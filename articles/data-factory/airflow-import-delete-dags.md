---
title: Import and Delete files in Managed Airflow.
description: This is the quickstart guide that talks about import and delete files in Managed Airflow
author: nabhishek
ms.author: abnarain
ms.reviewer: abnarain
ms.service: data-factory
ms.topic: how-to
ms.date: 10/01/2023
---


# Import and Delete files in Managed Airflow.

Managed Airflow provides two distinct methods for loading DAGs from python source files into Airflow's environment. These methods are listed below:

1. **Git Sync:** This service allows you to synchronize your GitHub repository with Managed Airflow, enabling you to import DAGs directly from your GitHub repository.

1. **Blob Storage**: With this approach, you can upload your DAG files to a designated directory within a blob storage account that is linked to your Azure Data Factory. Subsequently, you import the file paths of these DAGs in Managed Airflow.

This guide will walk you through the steps to import and delete DAGs file using both of the features listed above.  

## Prerequisites

**Azure subscription**: If you don't have an Azure subscription, create a free account before you begin. Create or select an existing Data Factory in the region where the managed airflow preview is supported.

## Import and Delete DAGs using Git-Sync Feature. 

### Import DAGs 

1. Follow the Instructions given in Sync a[ GitHub repository with Managed Airflow - Azure Data Factory | Microsoft Learn](/azure/data-factory/airflow-sync-github-repository). 

1. Note that it's essential to manually import the requirements.  Since, at present the Git-sync feature cannot read the requirements file.

### Delete DAGs 

1. While using Git-sync feature, deleting DAGs in Managed Airflow is not possible because all your Git source files are synchronized with Managed Airflow. The recommended approach is to remove the file from your source code repository. 

## Import and Delete DAGs using Blob Storage. 

### Import DAGs

1. Follow the Instructions given in [Import Dags using Blob Storage](/azure/data-factory/how-does-managed-airflow-work).

### Delete DAGs

1. Let’s say you want to delete the DAG named “Tutorial” as shown in the image below. 

1. Click on ellipsis icon -> Click on Delete DAG Button. 

1. Fill out the name of your Dag file. 

1. Click Delete Button. 

1. Successfully deleted file. 

