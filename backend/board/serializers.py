from rest_framework import serializers
from .models import Board, Column, Card, Comment, Issue


def get_board_prefix(title):
    words = title.split()
    if not words:
        return 'ISS'
    prefix = ''.join(w[0] for w in words if w).upper()[:3]
    return prefix if prefix else 'ISS'


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'card', 'body', 'created_at']
        read_only_fields = ['id', 'card', 'created_at']


class CardSerializer(serializers.ModelSerializer):
    comment_count = serializers.SerializerMethodField()
    issue_id = serializers.SerializerMethodField()
    issue_key = serializers.SerializerMethodField()
    priority = serializers.SerializerMethodField()
    column_title = serializers.SerializerMethodField()
    board_title = serializers.SerializerMethodField()

    class Meta:
        model = Card
        fields = [
            'id', 'column', 'title', 'description', 'position', 'color',
            'created_at', 'updated_at', 'comment_count', 'issue_id',
            'issue_key', 'priority', 'column_title', 'board_title',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at',
                            'comment_count', 'issue_id', 'issue_key',
                            'priority', 'column_title', 'board_title']

    def get_comment_count(self, obj):
        return obj.comments.count()

    def get_issue_id(self, obj):
        return getattr(obj, 'issue', None) and obj.issue.id

    def get_issue_key(self, obj):
        issue = getattr(obj, 'issue', None)
        if not issue:
            return None
        board = obj.column.board
        prefix = get_board_prefix(board.title)
        return f'{prefix}-{issue.id}'

    def get_priority(self, obj):
        issue = getattr(obj, 'issue', None)
        return issue.priority if issue else None

    def get_column_title(self, obj):
        return obj.column.title

    def get_board_title(self, obj):
        return obj.column.board.title


class ColumnSerializer(serializers.ModelSerializer):
    cards = CardSerializer(many=True, read_only=True)

    class Meta:
        model = Column
        fields = ['id', 'board', 'title', 'position', 'color', 'cards']
        read_only_fields = ['id', 'board']


class BoardSerializer(serializers.ModelSerializer):
    columns = ColumnSerializer(many=True, read_only=True)

    class Meta:
        model = Board
        fields = ['id', 'title', 'created_at', 'columns']
        read_only_fields = ['id', 'created_at']


class IssueSerializer(serializers.ModelSerializer):
    column = serializers.PrimaryKeyRelatedField(
        queryset=Column.objects.all(),
        required=True,
        allow_null=False,
    )

    class Meta:
        model = Issue
        fields = ['id', 'title', 'description', 'priority', 'column',
                  'card', 'created_at', 'updated_at']
        read_only_fields = ['id', 'card', 'created_at', 'updated_at']

    def validate_title(self, value):
        if len(value) > 200:
            raise serializers.ValidationError('Title must be 200 characters or fewer.')
        return value

    def validate_priority(self, value):
        if value not in dict(Issue.Priority.choices):
            raise serializers.ValidationError(
                f'Invalid priority. Choose from: {", ".join(dict(Issue.Priority.choices).keys())}'
            )
        return value

    def create(self, validated_data):
        column = validated_data.get('column')
        if column is None:
            raise serializers.ValidationError({'column': 'Column is required.'})
        board = column.board
        last_position = Card.objects.filter(column=column).count()
        title = validated_data['title']
        description = validated_data.get('description', '')
        priority = validated_data['priority']

        card = Card.objects.create(
            column=column,
            title=title,
            description=description,
            position=last_position,
            color=column.color,
        )

        issue = Issue.objects.create(
            title=title,
            description=description,
            priority=priority,
            column=column,
            card=card,
        )
        return issue

    def update(self, instance, validated_data):
        title = validated_data.get('title', instance.title)
        description = validated_data.get('description', instance.description)
        priority = validated_data.get('priority', instance.priority)
        column = validated_data.get('column', instance.column)

        instance.title = title
        instance.description = description
        instance.priority = priority
        instance.column = column
        instance.save()

        if instance.card:
            card = instance.card
            card.title = title
            card.description = description
            if column != card.column:
                card.column = column
                card.color = column.color
                last_position = Card.objects.filter(column=column).count()
                card.position = last_position
            card.save()

        return instance
