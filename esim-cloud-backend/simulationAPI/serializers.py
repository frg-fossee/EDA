import logging
from rest_framework import serializers
from simulationAPI.models import spiceFile, Task, simulation
from saveAPI.serializers import SaveListSerializer

logger = logging.getLogger(__name__)


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = spiceFile
        fields = ('file', 'upload_time', 'file_id', 'task')


class TaskSerializer(serializers.HyperlinkedModelSerializer):
    # user = serializers.ReadOnlyField(source='user.username')
    file = FileSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = ('task_id', 'task_time', 'file')

    def create(self, validated_data):
        # Takes file from request and stores it along with a taskid
        files_data = list(self.context.get(
            'view').request.FILES.getlist("file"))[0]
        logger.info('File Upload')
        task = Task.objects.create()
        logger.info('task: '+str(task))
        spiceFile.objects.create(task=task, file=files_data)
        logger.info('Created Object for:' + files_data.name)
        return task


class simulationSerializer(serializers.ModelSerializer):
    schematic = SaveListSerializer(many=False)

    class Meta:
        model = simulation
        fields = '__all__'


class simulationSaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = simulation
        fields = '__all__'
