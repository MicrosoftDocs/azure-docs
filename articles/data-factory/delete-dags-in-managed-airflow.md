---
title: Delete files in Managed Airflow.
description: This document explains how to delete files in Managed Airflow.
author: nabhishek
ms.author: abnarain
ms.reviewer: abnarain
ms.service: data-factory
ms.topic: how-to
ms.date: 10/01/2023
---

# Delete files in Managed Airflow.

Managed Airflow provides two distinct methods for loading DAGs from python source files into Airflow's environment. These methods are listed below:

1. **Git Sync:** This service allows you to synchronize your GitHub repository with Managed Airflow, enabling you to import DAGs directly from your GitHub repository.

1. **Blob Storage**: With this approach, you can upload your DAG files to a designated directory within a blob storage account that is linked to your Azure Data Factory. Subsequently, you import the file paths of these DAGs in Managed Airflow.

This guide will walk you through the steps to delete DAGs file using both of the features listed above.  

## Prerequisites

**Azure subscription**: If you don't have an Azure subscription, create a free account before you begin. Create or select an existing Data Factory in the region where the managed airflow preview is supported.

## Delete DAGs using Git-Sync Feature.  

1. While using Git-sync feature, deleting DAGs in Managed Airflow is not possible because all your Git source files are synchronized with Managed Airflow. The recommended approach is to remove the file from your source code repository. 

## Delete DAGs using Blob Storage.

### Delete DAGs

1. Let’s say you want to delete the DAG named ``Tutorial.py`` as shown in the image below. 
    :::image type="content" source="media/airflow-import-delete-dags/sample-dag-to-be-deleted.png" alt-text="Screenshot shows the dag to be deleted.":::

1. Click on ellipsis icon -> Click on Delete DAG Button.
    :::image type="content" source="media/airflow-import-delete-dags/delete-dag-button.png" alt-text="Screenshot shows the dag filename.":::

1. Fill out the name of your Dag file. 
    :::image type="content" source="media/airflow-import-delete-dags/dag-filename-input.png" alt-text="Screenshot shows the dag filename.":::

1. Click Delete Button.
    :::image type="content" source="media/airflow-import-delete-dags/delete-dag-button.png" alt-text="Screenshot shows delete button.":::

1. Successfully deleted file. 
    :::image type="content" source="media/airflow-import-delete-dags/dag-delete-success.png" alt-text="Screenshot shows delete button.":::
