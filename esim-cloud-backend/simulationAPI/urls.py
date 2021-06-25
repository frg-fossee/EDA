"""

esimCloud URL Configuration

"""
from django.urls import path
from simulationAPI import views as simulationAPI_views


urlpatterns = [
    path('upload', simulationAPI_views.NetlistUploader.as_view(),
         name='netlistUploader'),

    path('status/<uuid:task_id>',
         simulationAPI_views.CeleryResultView.as_view(), name='celery_status'),

    path('history/<uuid:save_id>/<str:sim>',
         simulationAPI_views.SimulationResults.as_view()),
    path('history/<str:sim>', simulationAPI_views.SimulationResultsSimulator.as_view()),
]
