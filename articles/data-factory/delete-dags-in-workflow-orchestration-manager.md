---
title: Delete files in Workflow Orchestration Manager
description: This article explains how to delete files in Workflow Orchestration Manager.
author: nabhishek
ms.author: abnarain
ms.reviewer: abnarain
ms.service: data-factory
ms.topic: how-to
ms.date: 10/01/2023
---

# Delete files in Workflow Orchestration Manager

> [!NOTE]
> Workflow Orchestration Manager is powered by Apache Airflow.

This article walks you through the steps to delete directed acyclic graph (DAG) files in Workflow Orchestration Manager environment.

## Prerequisites

- **Azure subscription**: If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
- **Azure Data Factory**: Create or select an existing [Data Factory](https://azure.microsoft.com/products/data-factory#get-started) instance in a [region where the Workflow Orchestration Manager preview is supported](concepts-workflow-orchestration-manager.md#region-availability-public-preview).

## Delete DAGs by using Git sync

When you use the Git sync feature, it isn't possible to delete DAGs in Workflow Orchestration Manager because all your Git source files are synchronized with Workflow Orchestration Manager. We recommend removing the file from your source code repository so that your commit syncs with runtime.

## Delete DAGs by using Azure Blob Storage

1. In this example, you want to delete the DAG named `adf.py`.

    :::image type="content" source="media/airflow-import-delete-dags/sample-dag-to-be-deleted.png" alt-text="Screenshot that shows the DAG to delete.":::

1. Select the ellipsis icon and select **Delete DAG**.

    :::image type="content" source="media/airflow-import-delete-dags/delete-dag-button.png" alt-text="Screenshot that shows the Delete DAG button.":::

1. Enter the name of your DAG file.

    :::image type="content" source="media/airflow-import-delete-dags/dag-filename-input.png" alt-text="Screenshot that shows the DAG filename.":::

1. Select **Delete**.

1. You see a message that tells you the file was successfully deleted.

    :::image type="content" source="media/airflow-import-delete-dags/dag-delete-success.png" alt-text="Screenshot that shows successful DAG deletion.":::
