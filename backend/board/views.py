from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from .models import Board, Column, Card, Comment, Issue
from .serializers import (BoardSerializer, ColumnSerializer,
                           CardSerializer, CommentSerializer,
                           IssueSerializer)


class BoardViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        board = Board.objects.first()
        if not board:
            return Response({'detail': 'No board found. Run seed_board.'},
                            status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(board)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class ColumnViewSet(viewsets.ModelViewSet):
    queryset = Column.objects.all()
    serializer_class = ColumnSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        board = Board.objects.first()
        if not board:
            board = Board.objects.create(title='Task Feedback Board')
        last_position = Column.objects.filter(board=board).count()
        serializer.save(board=board, position=last_position)

    def perform_update(self, serializer):
        column = serializer.save()
        if 'color' in serializer.validated_data:
            Card.objects.filter(column=column).update(color=column.color)


class CardViewSet(viewsets.ModelViewSet):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = [AllowAny]
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']

    def perform_update(self, serializer):
        card = self.get_object()
        old_column_id = card.column_id
        card = serializer.save()

        if old_column_id != card.column_id:
            last_position = Card.objects.filter(column=card.column).count()
            Card.objects.filter(id=card.id).update(
                position=last_position - 1,
                color=card.column.color,
            )
            card.refresh_from_db()

        issue = getattr(card, 'issue', None)
        if issue:
            issue.title = card.title
            issue.description = card.description
            issue.column = card.column
            issue.save()

    @action(detail=True, methods=['get', 'post'])
    def comments(self, request, pk=None):
        card = self.get_object()

        if request.method == 'GET':
            comments = Comment.objects.filter(card=card)
            serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data)

        if request.method == 'POST':
            serializer = CommentSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(card=card)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [AllowAny]
    http_method_names = ['get', 'post', 'patch', 'head', 'options']
