from rest_framework import viewsets
from .models import Issue
from .serializers import IssueSerializer


class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all().order_by('-created_at')
    serializer_class = IssueSerializer
    http_method_names = ['get', 'post', 'patch', 'head', 'options']
