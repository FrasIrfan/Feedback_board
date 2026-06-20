from django.core.management.base import BaseCommand
from board.models import Board, Column


SEED_COLUMNS = [
    ('Backlog', 0, '#8c9ae0'),
    ('In Progress', 1, '#e6915d'),
    ('Review', 2, '#c0d4a7'),
    ('Done', 3, '#27a644'),
]


class Command(BaseCommand):
    help = 'Create the default board with seed columns'

    def handle(self, *args, **options):
        if Board.objects.exists():
            self.stdout.write('Board already exists. Skipping.')
            return

        board = Board.objects.create(title='Task Feedback Board')
        for title, position, color in SEED_COLUMNS:
            Column.objects.create(
                board=board,
                title=title,
                position=position,
                color=color,
            )
        self.stdout.write(self.style.SUCCESS('Board seeded successfully.'))
