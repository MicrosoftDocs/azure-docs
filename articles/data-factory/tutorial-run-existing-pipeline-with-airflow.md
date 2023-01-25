---
title: Run an existing pipeline with managed Apache Airflow
description: This tutorial provides step-by-step instructions for running an existing pipeline with managed Apache Airflow in Azure Data Factory.
author: nabhishek
ms.service: data-factory
ms.subservice: tutorials
ms.topic: tutorial
ms.date: 01/24/2023
ms.author: abnarain
---


# Run an existing pipeline with managed Apache Airflow

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

Data Factory pipelines provides 100+ data source connectors that provides scalable and reliable data integration/ data flows. There are scenarios where you would like to run an existing data factory pipeline from your Apache Airflow DAG.  This tutorial shows you how to do just that.

## Prerequisites

* **Azure subscription**. If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
* **Azure storage account**. If you don't have a storage account, see [Create an Azure storage account](../storage/common/storage-account-create.md?tabs=azure-portal) for steps to create one. *Ensure the storage account allows access only from selected networks.*
* **Azure Data Factory pipeline**. You can follow any of the tutorials and create a new data factory pipeline in case you do not already have one, or create one with one click in [Get started and try out your first data factory pipeline](quickstart-get-started.md). 
* **Setup a Service Principal**. You will need to [create a new service principal](../active-directory/develop/howto-create-service-principal-portal.md) or use an existing one and grant it permission to run the pipeline (example – contributor role in the data factory where the existing pipelines exist), even if the managed Apache Airflow environment and the pipelines exist in the same data factory. You will need to get the Service Principal’s Client ID and Client Secret (API Key).

## Steps

- Create a a new Python file **adf.py** with the below contents:
  ```python
  from airflow import DAG
  from airflow.operators.python_operator import PythonOperator
  from azure.common.credentials import ServicePrincipalCredentials
  from azure.mgmt.datafactory import DataFactoryManagementClient
  from datetime import datetime, timedelta

  # Default arguments for the DAG
  default_args = {
      'owner': 'me',
      'start_date': datetime(2022, 1, 1),
      'depends_on_past': False,
      'retries': 1,
      'retry_delay': timedelta(minutes=5),
  }

  # Create the DAG
  dag = DAG(
      'run_azure_data_factory_pipeline',
      default_args=default_args,
      schedule_interval=timedelta(hours=1),
  )

  # Define a function to run the pipeline
  def run_pipeline(**kwargs):
      # Create the client
      credentials = ServicePrincipalCredentials(
          client_id='your_client_id',
          secret='your_client_secret',
          tenant='your_tenant_id',
      )
      client = DataFactoryManagementClient(credentials, 'your_subscription_id')

  # Run the pipeline
  pipeline_name = 'your_pipeline_name'
  run_response = client.pipelines.create_run(
      'your_resource_group_name',
      'your_data_factory_name',
      pipeline_name,
  )
  run_id = run_response.run_id

  # Print the run ID
  print(f'Pipeline run ID: {run_id}')

  # Create a PythonOperator to run the pipeline
  run_pipeline_operator = PythonOperator(
      task_id='run_pipeline',
      python_callable=run_pipeline,
      provide_context=True,
      dag=dag,
  )

  # Set the dependencies
  run_pipeline_operator
  ```

  You will have to fill in your **client_id**, **client_secret**, **tenant_id**, **subscription_id**, **resource_group_name**, **data_factory_name**, and **pipeline_name**.

- Upload the **adf.py** file to your blob storage within a folder called **DAG**.
- [Import the **DAG** folder into your Managed Apache Airflow environment]().  If you do not have one, [create a new one]().
  :::image type="content" source="media/tutorial_run_existing_pipeline_with_airflow/airflow_environment.png" alt-text="Screenshot showing the data factory management tabwith the Airflow section selected.":::

## Next steps

- [Refresh a Power BI dataset with managed Apache Airflow](tutorial-refresh-power-bi-dataset-with-airflow.md)
- [Managed Apache Airflow pricing](airflow-pricing.md)
- [Changing password for managed Apache Airflow environments](password-change-airflow.md)