---
title: Delete files in Managed Airflow
description: This article explains how to delete files in Managed Airflow.
author: nabhishek
ms.author: abnarain
ms.reviewer: abnarain
ms.service: data-factory
ms.topic: how-to
ms.date: 10/01/2023
---

# Delete files in Managed Airflow

This article walks you through the steps to delete directed acyclic graph (DAG) files in an Azure Data Factory Managed Airflow environment.

## Prerequisites

- **Azure subscription**: If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
- **Azure Data Factory**: Create or select an existing [Data Factory](https://azure.microsoft.com/products/data-factory#get-started) instance in a [region where the Managed Airflow preview is supported](concept-managed-airflow.md#region-availability-public-preview).

## Delete DAGs by using git-sync

When you use the git-sync feature, it isn't possible to delete DAGs in Managed Airflow because all your Git source files are synchronized with Managed Airflow. We recommend removing the file from your source code repository so that your commit syncs with Managed Airflow.

## Delete DAGs by using Azure Blob Storage

1. In this example, you want to delete the DAG named *adf.py*.

    :::image type="content" source="media/airflow-import-delete-dags/sample-dag-to-be-deleted.png" alt-text="Screenshot that shows the DAG to delete.":::

1. Select the ellipsis icon and select **Delete DAG**.

    :::image type="content" source="media/airflow-import-delete-dags/delete-dag-button.png" alt-text="Screenshot that shows the Delete DAG button.":::

1. Enter the name of your DAG file.

    :::image type="content" source="media/airflow-import-delete-dags/dag-filename-input.png" alt-text="Screenshot that shows the DAG filename.":::

1. Select **Delete**.

1. You see a message that tells you the file was successfully deleted.

    :::image type="content" source="media/airflow-import-delete-dags/dag-delete-success.png" alt-text="Screenshot that shows successful DAG deletion.":::
