---
title: 'Quickstart: Create a Synapse workspace' 
description: In this quickstart, you'll learn how to create a Synapse workspace, a dedicated SQL pool, and a serverless Apache Spark pool.
author: whhender
ms.author: whhender
ms.reviewer: whhender
ms.service: azure-synapse-analytics
ms.subservice: workspace
ms.topic: quickstart
ms.date: 08/27/2024
---

# Quickstart: Create a Synapse workspace

In this Quickstart, you will create a Synapse workspace, and you can follow along with the rest of the tutorials to create a dedicated SQL pool, and a serverless Apache Spark pool.

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- To complete this tutorial's steps, you need to have access to a resource group for which you're assigned the **Owner** role. Create the Synapse workspace in this resource group.

## Create a Synapse workspace in the Azure portal

### Start the process

1. Open the [Azure portal](https://portal.azure.com), in the search bar enter **Synapse** without hitting enter.
1. In the search results, under **Services**, select **Azure Synapse Analytics**.
1. Select **Create** to create a workspace.

## Basics tab > Project Details

Fill in the following fields:

1. **Subscription** - Pick any subscription.
1. **Resource group** - Use any resource group.
1. **Managed Resource group** - Leave this blank.

## Basics tab > Workspace details

Fill in the following fields:

1. **Workspace name** - Pick any globally unique name. In this tutorial, we'll use **myworkspace**.
1. **Region** - Pick the region where you have placed your client applications/services (for example, Azure Virtual Machine, Power BI, Azure Analysis Service) and storages that contain data (for example Azure Data Lake storage, Azure Cosmos DB analytical storage).

> [!NOTE]
> A workspace that is not co-located with the client applications or storage can be the root cause of many performance issues. If your data or the clients are placed in multiple regions, you can create separate workspaces in different regions co-located with your data and clients.

Under **Select Data Lake Storage Gen 2**:

1. By **Account name**, select **Create New** and name the new storage account **contosolake** or similar as the name must be unique.

    >[!TIP]
    >If you get an error reading *"The Azure Synapse resource provider (Microsoft.Synapse) needs to be registered with the selected subscription"*, open the Azure portal and select **Subscriptions**. Select your subscription. Under the **Settings** list select **Resource providers**. Search for **Microsoft.Synapse**, select it, and select **Register**.

1. By **File system name**, select **Create New** and name it **users**. This will create a storage container called **users**. The workspace will use this storage account as the "primary" storage account to Spark tables and Spark application logs.
1. Check the **Assign myself the Storage Blob Data Contributor role on the Data Lake Storage Gen2 account** box. 

## Completing the process

Select **Review + create** > **Create**. Your workspace is ready in a few minutes.

> [!NOTE]
> To enable workspace features from an existing dedicated SQL pool (formerly SQL DW) refer to [How to enable a workspace for your dedicated SQL pool (formerly SQL DW)](./sql-data-warehouse/workspace-connected-create.md).

## Open Synapse Studio

After your Azure Synapse workspace is created, you have two ways to open Synapse Studio:

1. Open your Synapse workspace in the [Azure portal](https://portal.azure.com), in the **Overview** section of the Synapse workspace, select **Open** in the Open Synapse Studio box.
1. Go to the `https://web.azuresynapse.net` and sign in to your workspace.

    ![Log in to workspace](./security/media/common/login-workspace.png)

> [!NOTE]
> To sign into your workspace, there are two **Account selection methods**. One is from **Azure subscription**, the other is from **Enter manually**. If you have the Synapse Azure role or higher level Azure roles, you can use both methods to log into the workspace. If you don't have the related Azure roles, and you were granted as the Synapse RBAC role, **Enter manually** is the only way to log into the workspace. To learn more about the Synapse RBAC, refer to [What is Synapse role-based access control (RBAC)](./security/synapse-workspace-synapse-rbac.md).

## Place sample data into the primary storage account

We're going to use a small 100k row sample dataset of NYC Taxi Cab data for many examples in this getting started guide. We begin by placing it in the primary storage account you created for the workspace.

1. Download the [NYC Taxi - green trip dataset](/azure/open-datasets/dataset-taxi-green?tabs=azureml-opendatasets#additional-information) to your computer: 
    1. Navigate to the [original dataset location](https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page) from the link, choose a specific year and download the Green taxi trip records in Parquet format.
    1. Rename the downloaded file to *NYCTripSmall.parquet*.
1. In Synapse Studio, navigate to the **Data** hub.
1. Select **Linked**.
1. Under the category **Azure Data Lake Storage Gen2**, you'll see an item with a name like **myworkspace ( Primary - contosolake )**.
1. Select the container named **users (Primary)**.
1. Select **Upload** and select the `NYCTripSmall.parquet` file you downloaded.

Once the parquet file is uploaded, it's available through two equivalent URIs:
* `https://contosolake.dfs.core.windows.net/users/NYCTripSmall.parquet` 
* `abfss://users@contosolake.dfs.core.windows.net/NYCTripSmall.parquet`

>[!TIP]
>In the examples that follow in this tutorial, make sure to replace **contosolake** in the UI with the name of the primary storage account that you selected for your workspace.

## Next steps

> [!div class="nextstepaction"]
> [Analyze using a serverless SQL pool](get-started-analyze-sql-on-demand.md)
