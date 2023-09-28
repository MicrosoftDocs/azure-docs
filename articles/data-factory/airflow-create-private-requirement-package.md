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

Creating a private requirement package within a Managed Airflow environment involves several key steps to ensure seamless integration. By following these steps, you can effectively manage and utilize your own custom packages. If you're interested in learning how to create a custom package in Python, refer to the guide [Creating a package in python](https://airflow.apache.org/docs/apache-airflow/stable/administration-and-deployment/modules_management.html#creating-a-package-in-python).

## Step 1: Create a storage container

Use the steps described in [Manage blob containers using the Azure portal](/azure/storage/blobs/blob-containers-portal) to create a storage account for the package.

## Step 2: Upload the private package into your storage account

1. Navigate to the designated container where you intend to store your Airflow DAGs and Plugins.
1. Upload your private package file to the container. Common file formats include zip, whl, or tar.gz. Place the file within either the 'Dags' or 'Plugins' folder, as appropriate.

## Step 3: Add your private package as a requirement

1. Add your private package as a requirement in the requirements.txt file. Add this file if it doesn't already exist.
1. Be sure to prepend the prefix "**/opt/airflow**" to the package path. For instance, if your private package resides at _/dats/test/private.wht_, your requirements.txt file should feature the requirement _/opt/airflow/dags/test/private.wht_.

## Step 4: Import your folder to an Airflow integrated runtime (IR) environment

When performing the import of your folder into an Airflow IR environment, ensure that you enable the import requirements checkbox.

:::image type="content" source="media/airflow-create-private-requirement-package/import-requirements-checkbox.png" alt-text="Screenshot showing the import dialog for an Airflow integrated runtime environment, with the Import requirements checkbox checked.":::

## Next steps

- [What is Azure Data Factory Managed Airflow?](concept-managed-airflow.md)
- [Run an existing pipeline with Airflow](tutorial-run-existing-pipeline-with-airflow.md)
