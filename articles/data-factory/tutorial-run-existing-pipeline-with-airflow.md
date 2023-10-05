---
title: Run an existing pipeline with Managed Airflow
description: This tutorial provides step-by-step instructions for running an existing pipeline with Managed Airflow in Azure Data Factory.
author: nabhishek
ms.service: data-factory
ms.subservice: tutorials
ms.topic: tutorial
ms.date: 01/24/2023
ms.author: abnarain
---


# Run an existing pipeline with Managed Airflow

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

> [!NOTE]
> Managed Airflow for Azure Data Factory relies on the open source Apache Airflow application. Documentation and more tutorials for Airflow can be found on the Apache Airflow [Documentation](https://airflow.apache.org/docs/) or [Community](https://airflow.apache.org/community/) pages.

Data Factory pipelines provide 100+ data source connectors that provide scalable and reliable data integration/ data flows. There are scenarios where you would like to run an existing data factory pipeline from your Apache Airflow DAG.  This tutorial shows you how to do just that.

## Prerequisites

* **Azure subscription**. If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
* **Azure storage account**. If you don't have a storage account, see [Create an Azure storage account](../storage/common/storage-account-create.md?tabs=azure-portal) for steps to create one. *Ensure the storage account allows access only from selected networks.*
* **Azure Data Factory pipeline**. You can follow any of the tutorials and create a new data factory pipeline in case you don't already have one, or create one with one select in [Get started and try out your first data factory pipeline](quickstart-get-started.md). 
* **Setup a Service Principal**. You'll need to [create a new service principal](../active-directory/develop/howto-create-service-principal-portal.md) or use an existing one and grant it permission to run the pipeline (example - contributor role in the data factory where the existing pipelines exist), even if the Managed Airflow environment and the pipelines exist in the same data factory. You'll need to get the Service Principal’s Client ID and Client Secret (API Key).

## Steps

1. Create a new Python file **adf.py** with the below contents:
   ```python
   from datetime import datetime, timedelta

   from airflow.models import DAG, BaseOperator

   try:
       from airflow.operators.empty import EmptyOperator
   except ModuleNotFoundError:
       from airflow.operators.dummy import DummyOperator as EmptyOperator  # type: ignore
   from airflow.providers.microsoft.azure.operators.data_factory import AzureDataFactoryRunPipelineOperator
   from airflow.providers.microsoft.azure.sensors.data_factory import AzureDataFactoryPipelineRunStatusSensor
   from airflow.utils.edgemodifier import Label

   with DAG(
       dag_id="example_adf_run_pipeline",
       start_date=datetime(2022, 5, 14),
       schedule_interval="@daily",
       catchup=False,
       default_args={
           "retries": 1,
           "retry_delay": timedelta(minutes=3),
           "azure_data_factory_conn_id": "<connection_id>", #This is a connection created on Airflow UI
           "factory_name": "<FactoryName>",  # This can also be specified in the ADF connection.
           "resource_group_name": "<ResourceGroupName>",  # This can also be specified in the ADF connection.
       },
       default_view="graph",
   ) as dag:
       begin = EmptyOperator(task_id="begin")
       end = EmptyOperator(task_id="end")

       # [START howto_operator_adf_run_pipeline]
       run_pipeline1: BaseOperator = AzureDataFactoryRunPipelineOperator(
           task_id="run_pipeline1",
           pipeline_name="<PipelineName>", 
           parameters={"myParam": "value"},
       )
       # [END howto_operator_adf_run_pipeline]

       # [START howto_operator_adf_run_pipeline_async]
       run_pipeline2: BaseOperator = AzureDataFactoryRunPipelineOperator(
           task_id="run_pipeline2",
           pipeline_name="<PipelineName>",
           wait_for_termination=False,
       )

       pipeline_run_sensor: BaseOperator = AzureDataFactoryPipelineRunStatusSensor(
           task_id="pipeline_run_sensor",
           run_id=run_pipeline2.output["run_id"],
       )
       # [END howto_operator_adf_run_pipeline_async]

       begin >> Label("No async wait") >> run_pipeline1
       begin >> Label("Do async wait with sensor") >> run_pipeline2
       [run_pipeline1, pipeline_run_sensor] >> end

       # Task dependency created via `XComArgs`:
       #   run_pipeline2 >> pipeline_run_sensor
    ```

    You'll have to create the connection using the Airflow UI (Admin -> Connections -> '+' -> Choose 'Connection type' as 'Azure Data Factory',  then fill in your **client_id**, **client_secret**, **tenant_id**, **subscription_id**, **resource_group_name**, **data_factory_name**, and **pipeline_name**.

1. Upload the **adf.py** file to your blob storage within a folder called **DAGS**.
1. [Import the **DAGS** folder into your Managed Airflow environment](./how-does-managed-airflow-work.md#import-dags).  If you don't have one, [create a new one](./how-does-managed-airflow-work.md#create-a-managed-airflow-environment)

   :::image type="content" source="media/tutorial-run-existing-pipeline-with-airflow/airflow-environment.png" alt-text="Screenshot showing the data factory management tab with the Airflow section selected.":::

## Next steps

- [Managed Airflow pricing](airflow-pricing.md)
- [Changing password for Managed Airflow environments](password-change-airflow.md)
