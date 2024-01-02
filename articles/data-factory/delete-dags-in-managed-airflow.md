---
title: Delete files in Managed Airflow
description: This document explains how to delete files in Managed Airflow.
author: nabhishek
ms.author: abnarain
ms.reviewer: abnarain
ms.service: data-factory
ms.topic: how-to
ms.date: 10/01/2023
---

# Delete files in Managed Airflow

This guide walks you through the steps to delete DAG files in Managed Airflow environment.  

## Prerequisites

**Azure subscription**: If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin. Create or select an existing [Data Factory](https://azure.microsoft.com/products/data-factory#get-started) in a [region where the Managed Airflow preview is supported](concept-managed-airflow.md#region-availability-public-preview).


## Delete DAGs using Git-Sync Feature.  

While using Git-sync feature, deleting DAGs in Managed Airflow isn't possible because all your Git source files are synchronized with Managed Airflow. The recommended approach is to remove the file from your source code repository and your commit gets synchronized with Managed Airflow. 

## Delete DAGs using Blob Storage.

### Delete DAGs

1. Let’s say you want to delete the DAG named ``Tutorial.py`` as shown in the image. 
    
    :::image type="content" source="media/airflow-import-delete-dags/sample-dag-to-be-deleted.png" alt-text="Screenshot shows the DAG to be deleted.":::

1. Click on ellipsis icon -> Click on Delete DAG Button.
    
    :::image type="content" source="media/airflow-import-delete-dags/delete-dag-button.png" alt-text="Screenshot shows the delete button.":::

1. Fill out the name of your Dag file. 
    
    :::image type="content" source="media/airflow-import-delete-dags/dag-filename-input.png" alt-text="Screenshot shows the DAG filename.":::

1. Click Delete Button.
   
1. Successfully deleted file. 
    
    :::image type="content" source="media/airflow-import-delete-dags/dag-delete-success.png" alt-text="Screenshot shows successful DAG deletion.":::
