from django.db import migrations, models
import django.db.models.deletion


STATUS_TO_COLUMN = {
    'open': 'Backlog',
    'in_progress': 'In Progress',
    'done': 'Done',
}


def seed_board_and_migrate(apps, schema_editor):
    Board = apps.get_model('board', 'Board')
    Column = apps.get_model('board', 'Column')
    Issue = apps.get_model('board', 'Issue')

    board = Board.objects.create(title='Task Feedback Board')

    columns_data = [
        ('Backlog', 0, '#8c9ae0'),
        ('In Progress', 1, '#e6915d'),
        ('Review', 2, '#c0d4a7'),
        ('Done', 3, '#27a644'),
    ]

    column_map = {}
    for title, position, color in columns_data:
        col = Column.objects.create(board=board, title=title, position=position, color=color)
        column_map[title] = col

    for issue in Issue.objects.all():
        target_column_title = STATUS_TO_COLUMN.get(issue.status, 'Backlog')
        issue.column = column_map[target_column_title]
        issue.save(update_fields=['column'])


def reverse_migration(apps, schema_editor):
    Issue = apps.get_model('board', 'Issue')
    Column = apps.get_model('board', 'Column')
    Issue.objects.update(column=None)
    Column.objects.all().delete()
    Board = apps.get_model('board', 'Board')
    Board.objects.all().delete()


class Migration(migrations.Migration):
    dependencies = [
        ('board', '0002_board_card_issue_updated_at_issue_card_column_and_more'),
    ]

    operations = [
        migrations.RunPython(seed_board_and_migrate, reverse_migration),
    ]
