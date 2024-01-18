---
title: Create a private requirement package for Managed Airflow
description: This article provides step-by-step instructions for how to create a private requirement package within a Managed Airflow environment in Azure Data Factory.
author: nabhishek
ms.author: abnarain
ms.reviewer: jburchel
ms.service: data-factory
ms.topic: how-to
ms.date: 09/23/2023
---

# Create a private requirement package for Managed Airflow

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

A Python package is a way to organize related Python modules into a single directory hierarchy. A package is typically represented as a directory that contains a special file called `__init__.py`. Inside a package directory, you can have multiple Python module files (.py files) that define functions, classes, and variables.

In the context of Azure Data Factory Managed Airflow, you can use Python packages to organize and distribute your custom Airflow Plugins and Provider packages.

This article provides step-by-step instructions on how to install a .whl (Wheel) file, which serves as a binary distribution format for a Python package, as a requirement in your Managed Airflow runtime.

For illustration purposes, you create a custom operator as a Python package that you can import as a module inside a directed acyclic graph (DAG) file.

## Prerequisites

- **Azure subscription**: If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
- **Azure Data Factory**: Create or select an existing [Data Factory](https://azure.microsoft.com/products/data-factory#get-started) instance in a [region where the Managed Airflow preview is supported](concept-managed-airflow.md#region-availability-public-preview).
- **Azure Storage account**: If you don't have a storage account, see [Create an Azure Storage account](/azure/storage/common/storage-account-create?tabs=azure-portal) for steps to create one. Ensure the storage account allows access only from selected networks.

## Develop a custom operator

1. Create the file `sample_operator.py`.

    ```python
    from airflow.models.baseoperator import BaseOperator
    
    
    class SampleOperator(BaseOperator):
        def __init__(self, name: str, **kwargs) -> None:
            super().__init__(**kwargs)
            self.name = name
    
        def execute(self, context):
            message = f"Hello {self.name}"
            return message
    ```

1. To create a Python package for this file, see [Create a package in Python](https://airflow.apache.org/docs/apache-airflow/stable/administration-and-deployment/modules_management.html#creating-a-package-in-python).

1. Create the DAG file `sample_dag.py` to test your operator.
    
    ```python
    from airflow_operator.hello_operator import SampleCustomOperator
    from airflow import DAG
    
    
    with DAG(
       "tutorial",
       tags=["example"],
    ) as dag:
        sample_task = SampleCustomOperator(task_id="sample-task", name="foo_bar")
    ```

## Create a storage container

Use the steps described in [Manage blob containers using the Azure portal](/azure/storage/blobs/blob-containers-portal) to create a storage account to upload DAGs and your package file.

## Upload the private package into your storage account

1. Go to the designated container where you intend to store your Airflow DAG and Plugin files.
1. Upload your private package file to the container. Common file formats include .zip, .whl, or `tar.gz`. Place the file within either the `Dags` or `Plugins` folder, as appropriate.

## Add your private package as a requirement

1. Add your private package as a requirement in the `requirements.txt` file. Add this file if it doesn't already exist.
1. Be sure to prepend the prefix `/opt/airflow` to the package path. For instance, if your private package resides at `/dats/test/private.wht`, your `requirements.txt` file should feature the requirement `/opt/airflow/dags/test/private.wht`.

## Import your folder to an Airflow integration runtime environment

When you import your folder into an Airflow integration runtime environment, select the **Import requirements** checkbox to load your requirements inside your Airflow environment.

:::image type="content" source="media/airflow-create-private-requirement-package/import-requirements-checkbox.png" alt-text="Screenshot that shows the Import dialog for an Airflow integration runtime environment with the Import requirements checkbox selected.":::

:::image type="content" source="media/airflow-create-private-requirement-package/import-requirements-airflow-environment.png" alt-text="Screenshot that shows the imported requirements dialog in an Airflow integration runtime environment." lightbox="media/airflow-create-private-requirement-package/import-requirements-airflow-environment.png":::

### Check the import

Inside the Airflow UI, you can run the DAG file you created in step 1 to check if the import was successful.

## Related content

- [What is Azure Data Factory Managed Airflow?](concept-managed-airflow.md)
- [Run an existing pipeline with Airflow](tutorial-run-existing-pipeline-with-airflow.md)
