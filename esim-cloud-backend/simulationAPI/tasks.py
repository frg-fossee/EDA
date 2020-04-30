from celery import shared_task, current_task
from celery import states
from simulationAPI.helpers import ngspice_helper
from celery.exceptions import Ignore
import traceback
from simulationAPI.models import spiceFile


@shared_task
def process_task(task_id):
    try:

        file_obj = list(spiceFile.objects.filter(task_id=task_id))[0]
        file_path = file_obj.file.path
        file_id = file_obj.file_id

        print("Processing ", file_path, file_id)

        current_task.update_state(
            state='PROGRESS',
            meta={'current_process': 'Started Processing File'})

        output = ngspice_helper.ExecNetlist(file_path, file_id)
        current_task.update_state(
            state='PROGRESS',
            meta={'current_process': 'Processed Netlist, Loading Output'})
        return output

    except Exception as e:
        current_task.update_state(state=states.FAILURE, meta={
            'exc_type': type(e).__name__,
            'exc_message': traceback.format_exc().split('\n')})
        print('Exception Occured: ', type(e).__name__)
        raise Ignore()
