---
title: Import DAGs by using Azure Blob Storage
titleSuffix: Azure Data Factory
description: This article shows the steps required to import DAGs by using Azure Blob Storage.
ms.service: data-factory
ms.topic: conceptual
author: nabhishek
ms.author: abnarain
ms.date: 10/20/2023
---

# Import DAGs by using Azure Blob Storage

> [!NOTE]
> This feature is in public preview. Workflow Orchestration Manager is powered by Apache Airflow.

This article shows you step-by-step instructions on how to import directed acyclic graphs (DAGs) into Workflow Orchestration Manager by using Azure Blob Storage.

## Prerequisites

- **Azure subscription**: If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
- **Azure Data Factory**: Create or select an existing [Data Factory](https://azure.microsoft.com/products/data-factory#get-started) instance in a [region where the Workflow Orchestration Manager preview is supported](concepts-workflow-orchestration-manager.md#region-availability-public-preview).
- **Azure Storage account**: If you don't have a storage account, see [Create an Azure Storage account](/azure/storage/common/storage-account-create?tabs=azure-portal) for steps to create one. Ensure the storage account allows access only from selected networks.

Blob Storage behind virtual networks isn't supported during the preview. Azure Key Vault configuration in `storageLinkedServices` isn't supported to import DAGs.

## Import DAGs

1. Copy either [Sample Apache Airflow v2.x DAG](https://airflow.apache.org/docs/apache-airflow/stable/tutorial/fundamentals.html) or [Sample Apache Airflow v1.10 DAG](https://airflow.apache.org/docs/apache-airflow/1.10.11/_modules/airflow/example_dags/tutorial.html) based on the Airflow environment that you set up. Paste the content into a new file called *tutorial.py*.

   Upload the *tutorial.py* file to Blob Storage. For more information, see [Upload a file into a blob](../storage/blobs/storage-quickstart-blobs-portal.md).

   > [!NOTE]
   > You need to select a directory path from a Blob Storage account that contains folders named *dags* and *plugins* to import them into the Airflow environment. Plugins aren't mandatory. You can also have a container named **dags** and upload all Airflow files within it.

1. Under the **Manage** hub, select **Apache Airflow**. Then hover over the previously created **Airflow** environment and select **Import files** to import all DAGs and dependencies into the Airflow environment.

   :::image type="content" source="media/how-does-workflow-orchestration-manager-work/import-files.png" alt-text="Screenshot that shows importing files in the Manage hub." lightbox="media/how-does-workflow-orchestration-manager-work/import-files.png":::

1. Create a new linked service to the accessible storage account mentioned in the "Prerequisites" section. You can also use an existing one if you already have your own DAGs.

   :::image type="content" source="media/how-does-workflow-orchestration-manager-work/create-new-linked-service.png" alt-text="Screenshot that shows how to create a new linked service." lightbox="media/how-does-workflow-orchestration-manager-work/create-new-linked-service.png":::

1. Use the storage account where you uploaded the DAG. (Check the "Prerequisites" section.) Test the connection and then select **Create**.

   :::image type="content" source="media/how-does-workflow-orchestration-manager-work/linked-service-details.png" alt-text="Screenshot that shows some linked service details." lightbox="media/how-does-workflow-orchestration-manager-work/linked-service-details.png":::

1. Browse and select **airflow** if you're using the sample SAS URL. You can also select the folder that contains the *dags* folder with DAG files.

   > [!NOTE]
   > You can import DAGs and their dependencies through this interface. You need to select a directory path from a Blob Storage account that contains folders named *dags* and *plugins* to import those into the Airflow environment. Plugins aren't mandatory.

   :::image type="content" source="media/how-does-workflow-orchestration-manager-work/browse-storage.png" alt-text="Screenshot that shows the Browse storage button on the Import Files screen." lightbox="media/how-does-workflow-orchestration-manager-work/browse-storage.png" :::

   :::image type="content" source="media/how-does-workflow-orchestration-manager-work/browse.png" alt-text="Screenshot that shows the airflow root folder on Browse." lightbox="media/how-does-workflow-orchestration-manager-work/browse.png" :::

1. Select **Import** to import files.

   :::image type="content" source="media/how-does-workflow-orchestration-manager-work/import-in-import-files.png" alt-text="Screenshot that shows the Import button on the Import Files screen." lightbox="media/how-does-workflow-orchestration-manager-work/import-in-import-files.png" :::

   :::image type="content" source="media/how-does-workflow-orchestration-manager-work/import-dags.png" alt-text="Screenshot that shows importing DAGs." lightbox="media/how-does-workflow-orchestration-manager-work/import-dags.png" :::

Importing DAGs could take a couple of minutes during the preview. You can use the notification center (bell icon in the Data Factory UI) to track import status updates.
