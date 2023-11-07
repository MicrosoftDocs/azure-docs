---
title: How does Managed Airflow work?
titleSuffix: Azure Data Factory
description: This article explains how to create a Managed Airflow instance and use DAG to make it work.
ms.service: data-factory
ms.topic: conceptual
author: nabhishek
ms.author: abnarain
ms.date: 10/20/2023
---

# How does Azure Data Factory Managed Airflow work? 

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

> [!NOTE]
> Managed Airflow for Azure Data Factory relies on the open source Apache Airflow application. Documentation and more tutorials for Airflow can be found on the Apache Airflow [Documentation](https://airflow.apache.org/docs/) or [Community](https://airflow.apache.org/community/) pages.

Managed Airflow in Azure Data Factory uses Python-based Directed Acyclic Graphs (DAGs) to run your orchestration workflows. 
To use this feature, you need to provide your DAGs and plugins in Azure Blob Storage. You can launch the Airflow UI from ADF using a command line interface (CLI) or a software development kit (SDK) to manage your DAGs.

## Create a Managed Airflow environment
The following steps set up and configure your Managed Airflow environment.

### Prerequisites
**Azure subscription**: If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
    Create or select an existing Data Factory in the region where the managed airflow preview is supported.

### Steps to create the environment
1. Create new Managed Airflow environment.
   Go to **Manage** hub -> **Airflow (Preview)** -> **+New** to create a new Airflow environment

   :::image type="content" source="media/how-does-managed-airflow-work/create-new-airflow.png" alt-text="Screenshot that shows how to create a new Managed Apache Airflow environment.":::

1. Provide the details (Airflow config)

   :::image type="content" source="media/how-does-managed-airflow-work/airflow-environment-details.png" alt-text="Screenshot that shows some Managed Airflow environment details.":::

   > [!IMPORTANT]
   > When using **Basic** authentication, remember the username and password specified in this screen. It will be needed to login later in the Managed Airflow UI. The default option is **Microsoft Entra ID** and it does not require creating username/ password for your Airflow environment, but instead uses the logged in user's credential to Azure Data Factory to login/ monitor DAGs.
1. **Environment variables** a simple key value store within Airflow to store and retrieve arbitrary content or settings.
1. **Requirements** can be used to pre-install python libraries. You can update these later as well.

## Import DAGs

The following steps describe how to import DAGs into Managed Airflow.

### Prerequisites

You'll need to upload a sample DAG onto an accessible Storage account (Should be under dags folder).

> [!NOTE]
> Blob Storage behind VNet are not supported during the preview.<br>
> KeyVault configuration in storageLinkedServices not supported to import dags.

[Sample Apache Airflow v2.x DAG](https://airflow.apache.org/docs/apache-airflow/stable/tutorial/fundamentals.html).
[Sample Apache Airflow v1.10 DAG](https://airflow.apache.org/docs/apache-airflow/1.10.11/_modules/airflow/example_dags/tutorial.html).


### Steps to import
1. Copy-paste the content (either v2.x or v1.10 based on the Airflow environment that you have setup) into a new file called as **tutorial.py**.

   Upload the **tutorial.py** to a blob storage. ([How to upload a file into blob](../storage/blobs/storage-quickstart-blobs-portal.md))

   > [!NOTE]
   > You will need to select a directory path from a blob storage account that contains folders named **dags** and **plugins** to import those into the Airflow environment. **Plugins** are not mandatory. You can also have a container named **dags** and upload all Airflow files within it.  

1. Select on **Airflow (Preview)** under **Manage** hub. Then hover over the earlier created **Airflow** environment and select on **Import files** to Import all DAGs and dependencies into the Airflow Environment.

   :::image type="content" source="media/how-does-managed-airflow-work/import-files.png" alt-text="Screenshot shows import files in manage hub.":::

1. Create a new Linked Service to the accessible storage account mentioned in the prerequisite (or use an existing one if you already have your own DAGs).

   :::image type="content" source="media/how-does-managed-airflow-work/create-new-linked-service.png" alt-text="Screenshot that shows how to create a new linked service.":::

1. Use the storage account where you uploaded the DAG (check prerequisite). Test connection, then select **Create**.

   :::image type="content" source="media/how-does-managed-airflow-work/linked-service-details.png" alt-text="Screenshot shows some linked service details.":::

1. Browse and select **airflow** if using the sample SAS URL or select the folder that contains **dags** folder with DAG files.

   > [!NOTE]
   > You can import DAGs and their dependencies through this interface. You will need to select a directory path from a blob storage account that contains folders named **dags** and **plugins** to import those into the Airflow environment. **Plugins** are not mandatory.

   :::image type="content" source="media/how-does-managed-airflow-work/browse-storage.png" alt-text="Screenshot shows browse storage in import files.":::

   :::image type="content" source="media/how-does-managed-airflow-work/browse.png" alt-text="Screenshot that shows browse in airflow.":::

   :::image type="content" source="media/how-does-managed-airflow-work/import-in-import-files.png" alt-text="Screenshot shows import in import files.":::

   :::image type="content" source="media/how-does-managed-airflow-work/import-dags.png" alt-text="Screenshot shows import dags.":::

> [!NOTE]
> Importing DAGs could take a couple of minutes during **Preview**. The notification center (bell icon in ADF UI) can be used to track the import status updates.

## Troubleshooting import DAG issues

* Problem: DAG import is taking over 5 minutes 
Mitigation: Reduce the size of the imported DAGs with a single import. One way to achieve this is by creating multiple DAG folders with lesser DAGs across multiple containers.  

* Problem: Imported DAGs don't show up when you sign in into the Airflow UI.  
Mitigation: Sign in into the Airflow UI and see if there are any DAG parsing errors. This could happen if the DAG files contain any incompatible code. You'll find the exact line numbers and the files, which have the issue through the Airflow UI.

    :::image type="content" source="media/how-does-managed-airflow-work/import-dag-issues.png" alt-text="Screenshot shows import dag issues.":::


## Monitor DAG runs

To monitor the Airflow DAGs, sign in into Airflow UI with the earlier created username and password.

1. Select on the Airflow environment created.

   :::image type="content" source="media/how-does-managed-airflow-work/airflow-environment-monitor-dag.png" alt-text="Screenshot that shows the Airflow environment created.":::

1. Sign in using the username-password provided during the Airflow Integration Runtime creation. ([You can reset the username or password by editing the Airflow Integration runtime]() if needed)

   :::image type="content" source="media/how-does-managed-airflow-work/login-in-dags.png" alt-text="Screenshot that shows sign in using the username-password provided during the Airflow Integration Runtime creation.":::

## Remove DAGs from the Airflow environment

If you're using Airflow version 1.x, delete DAGs that are deployed on any Airflow environment (IR), you need to delete the DAGs in two different places.

1. Delete the DAG from Airflow UI 
1. Delete the DAG in ADF UI

> [!NOTE]
> This is the current experience during the Public Preview, and we will be improving this experience. 

## Next steps

- [Run an existing pipeline with Managed Airflow](tutorial-run-existing-pipeline-with-airflow.md)
- [Managed Airflow pricing](airflow-pricing.md)
- [How to change the password for Managed Airflow environments](password-change-airflow.md)
