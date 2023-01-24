---
title: Refresh a Power BI dataset with Airflow
description: This tutorial provides step-by-step instructions for refreshing a Power BI dataset with Airflow.
author: nabhishek
ms.service: data-factory
ms.subservice: tutorials
ms.topic: tutorial
ms.date: 01/24/2023
ms.author: abnarain
---

# Refresh a Power BI dataset with Airflow

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This tutorial shows you how to refresh a Power BI dataset with Airflow.

## Prerequisites

* **Azure subscription**. If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
* **Azure storage account**. If you don't have a storage account, see [Create an Azure storage account](../storage/common/storage-account-create.md?tabs=azure-portal) for steps to create one. *Ensure the storage account allows access only from selected networks.*
* **Setup a Service Principal**. You will need to [create a new service principal](../active-directory/develop/howto-create-service-principal-portal.md) or use an existing one and grant it permission to run the pipeline (example – contributor role in the data factory where the existing pipelines exist), even if the Managed Airflow environment and the pipelines exist in the same data factory. You will need to get the Service Principal’s Client ID and Client Secret (API Key).

## Steps

- Create a new Python file **pbi-dataset-refresh.py** with the below contents:
  ```python
  from airflow import DAG
  from airflow.operators.python_operator import PythonOperator
  from datetime import datetime, timedelta
  from powerbi.datasets import Datasets

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
      'refresh_power_bi_dataset',
      default_args=default_args,
      schedule_interval=timedelta(hours=1),
  )

  # Define a function to refresh the dataset
  def refresh_dataset(**kwargs):
      # Create a Power BI client
      datasets = Datasets(client_id='your_client_id',
                          client_secret='your_client_secret',
                          tenant_id='your_tenant_id')
    
  # Refresh the dataset
  dataset_name = 'your_dataset_name'
  datasets.refresh(dataset_name)
  print(f'Successfully refreshed dataset: {dataset_name}')

  # Create a PythonOperator to run the dataset refresh
  refresh_dataset_operator = PythonOperator(
      task_id='refresh_dataset',
      python_callable=refresh_dataset,
      provide_context=True,
      dag=dag,
  )

  refresh_dataset_operator
  ```

  You will have to fill in your **client_id**, **client_secret**, **tenant_id**, and **dataset_name** with your own values.

  Also, you will need to install the **powerbi** python package to use the above code using Airflow requirements. Edit an Airflow environemtn and add the **powerbi** python package under **Airflow requirements**.

- Upload the **pbi-dataset-refresh.py** file to the blob storage within a folder named **DAG**.
- [Import the **DAG** folder into your Airflow environment]().  If you do not have one, [create a new one]().
  :::image type="content" source="media/tutorial_run_existing_pipeline_with_airflow/airflow_environment.png" alt-text="Screenshot showing the data factory management tabwith the Airflow section selected.":::

## Next Steps

- [Run an existing pipeline with Airflow](tutorial-run-existing-pipeline-with-airflow.md)
- [Airflow pricing](airflow-pricing.md)
- [Changing password for Airflow environments](password-change-airflow.md)