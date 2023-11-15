---
title: Import Airflow DAGs using Azure Blob Storage
titleSuffix: Azure Data Factory
description: This document shows the steps required to import Airflow DAGs using Azure Blob Storage
ms.service: data-factory
ms.topic: conceptual
author: nabhishek
ms.author: abnarain
ms.date: 10/20/2023
---

# Import DAGs using Azure Blob Storage

This guide will give you step by step instructions on how to import DAGs into Managed Airflow using Azure Blob storage.

## Prerequisites

- **Azure subscription** - If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin. Create or select an existing [Data Factory](https://azure.microsoft.com/products/data-factory#get-started) in a [region where the Managed Airflow preview is supported](concept-managed-airflow.md#region-availability-public-preview).
- **Azure storage account** - If you don't have a storage account, see [Create an Azure storage account](/azure/storage/common/storage-account-create?tabs=azure-portal) for steps to create one. Ensure the storage account allows access only from selected networks.

> [!NOTE]
> Blob Storage behind VNet are not supported during the preview.
> KeyVault configuration in storageLinkedServices not supported to import dags.


## Steps to import DAGs
1. Copy-paste the content (either [Sample Apache Airflow v2.x DAG](https://airflow.apache.org/docs/apache-airflow/stable/tutorial/fundamentals.html) or [Sample Apache Airflow v1.10 DAG](https://airflow.apache.org/docs/apache-airflow/1.10.11/_modules/airflow/example_dags/tutorial.html) based on the Airflow environment that you have setup) into a new file called as **tutorial.py**.

   Upload the **tutorial.py** to a blob storage. ([How to upload a file into blob](../storage/blobs/storage-quickstart-blobs-portal.md))

   > [!NOTE]
   > You will need to select a directory path from a blob storage account that contains folders named **dags** and **plugins** to import those into the Airflow environment. **Plugins** are not mandatory. You can also have a container named **dags** and upload all Airflow files within it.  

1. Select on **Apache Airflow** under **Manage** hub. Then hover over the earlier created **Airflow** environment and select on **Import files** to Import all DAGs and dependencies into the Airflow Environment.

   :::image type="content" source="media/how-does-managed-airflow-work/import-files.png" alt-text="Screenshot shows import files in manage hub." lightbox="media/how-does-managed-airflow-work/import-files.png":::

1. Create a new Linked Service to the accessible storage account mentioned in the prerequisite (or use an existing one if you already have your own DAGs).

   :::image type="content" source="media/how-does-managed-airflow-work/create-new-linked-service.png" alt-text="Screenshot that shows how to create a new linked service." lightbox="media/how-does-managed-airflow-work/create-new-linked-service.png":::

1. Use the storage account where you uploaded the DAG (check prerequisite). Test connection, then select **Create**.

   :::image type="content" source="media/how-does-managed-airflow-work/linked-service-details.png" alt-text="Screenshot shows some linked service details." lightbox="media/how-does-managed-airflow-work/linked-service-details.png":::

1. Browse and select **airflow** if using the sample SAS URL or select the folder that contains **dags** folder with DAG files.

   > [!NOTE]
   > You can import DAGs and their dependencies through this interface. You will need to select a directory path from a blob storage account that contains folders named **dags** and **plugins** to import those into the Airflow environment. **Plugins** are not mandatory.

   :::image type="content" source="media/how-does-managed-airflow-work/browse-storage.png" alt-text="Screenshot shows browse storage in import files." lightbox="media/how-does-managed-airflow-work/browse-storage.png" :::

   :::image type="content" source="media/how-does-managed-airflow-work/browse.png" alt-text="Screenshot that shows browse in airflow." lightbox="media/how-does-managed-airflow-work/browse.png" :::

   :::image type="content" source="media/how-does-managed-airflow-work/import-in-import-files.png" alt-text="Screenshot shows import in import files." lightbox="media/how-does-managed-airflow-work/import-in-import-files.png" :::

   :::image type="content" source="media/how-does-managed-airflow-work/import-dags.png" alt-text="Screenshot shows import dags." lightbox="media/how-does-managed-airflow-work/import-dags.png" :::

> [!NOTE]
> Importing DAGs could take a couple of minutes during **Preview**. The notification center (bell icon in ADF UI) can be used to track the import status updates.
