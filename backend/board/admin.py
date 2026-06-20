from django.contrib import admin
from .models import Board, Column, Card, Comment, Issue

admin.site.register(Board)
admin.site.register(Column)
admin.site.register(Card)
admin.site.register(Comment)
admin.site.register(Issue)
