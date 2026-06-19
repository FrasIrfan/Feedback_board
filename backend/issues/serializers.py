from rest_framework import serializers
from .models import Issue


class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = ['id', 'title', 'description', 'priority', 'status', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_title(self, value):
        if len(value) > 200:
            raise serializers.ValidationError('Title must be 200 characters or fewer.')
        return value

    def validate_priority(self, value):
        if value not in dict(Issue.Priority.choices):
            raise serializers.ValidationError(f'Invalid priority. Choose from: {", ".join(dict(Issue.Priority.choices).keys())}')
        return value

    def validate_status(self, value):
        if value not in dict(Issue.Status.choices):
            raise serializers.ValidationError(f'Invalid status. Choose from: {", ".join(dict(Issue.Status.choices).keys())}')
        return value
