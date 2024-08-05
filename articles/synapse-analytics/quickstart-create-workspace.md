---
title: 'Quickstart: Create an Azure Synapse Analytics workspace'
description: Learn how to create an Azure Synapse Analytics workspace by following the steps in this quickstart.
author: whhender
ms.service: azure-synapse-analytics
ms.topic: quickstart
ms.subservice: workspace
ms.date: 03/23/2022
ms.author: whhender
ms.reviewer: whhender
ms.custom: subject-rbac-steps, mode-other
---

# Quickstart: Create an Azure Synapse Analytics workspace

This quickstart describes the steps to create an Azure Synapse Analytics workspace by using the Azure portal.

## Create an Azure Synapse Analytics workspace

1. Open the [Azure portal](https://portal.azure.com), and at the top, search for **Synapse**.
1. In the search results, under **Services**, select **Azure Synapse Analytics**.
1. Select **Add** to create a workspace.
1. On the **Basics** tab, give the workspace a unique name. We use **mysworkspace** in this document.
1. You need an Azure Data Lake Storage Gen2 account to create a workspace. The simplest choice is to create a new one. If you want to reuse an existing one, you need to perform extra configuration:

   - Option 1: Create a new Data Lake Storage Gen2 account:
       1. Under **Select Data Lake Storage Gen 2** > **Account Name**, select **Create New**. Provide a global unique name, such as **contosolake**.
       1. Under **Select Data Lake Storage Gen 2** > **File system name**, select **File System** and name it **users**.
   - Option 2: See the instructions in [Prepare an existing storage account for use with Azure Synapse Analytics](#prepare-an-existing-storage-account-for-use-with-azure-synapse-analytics).
1. Your Azure Synapse Analytics workspace uses this storage account as the primary storage account and the container to store workspace data. The workspace stores data in Apache Spark tables. It stores Spark application logs under a folder named */synapse/workspacename*.
1. Select **Review + create** > **Create**. Your workspace is ready in a few minutes.

> [!NOTE]
> After you create your Azure Synapse Analytics workspace, you won't be able to move the workspace to another Microsoft Entra tenant. If you do so through subscription migration or other actions, you might lose access to the artifacts within the workspace.

## Open Synapse Studio

After your Azure Synapse Analytics workspace is created, you have two ways to open Synapse Studio:

* Open your Synapse workspace in the [Azure portal](https://portal.azure.com). At the top of the **Overview** section, select **Launch Synapse Studio**.
* Go to [Azure Synapse Analytics](https://web.azuresynapse.net) and sign in to your workspace.

## Prepare an existing storage account for use with Azure Synapse Analytics

1. Open the [Azure portal](https://portal.azure.com).
1. Go to an existing Data Lake Storage Gen2 storage account.
1. Select **Access control (IAM)**.
1. Select **Add** > **Add role assignment** to open the **Add role assignment** page.
1. Assign the following role. For more information, see [Assign Azure roles by using the Azure portal](../role-based-access-control/role-assignments-portal.yml).
    
    | Setting | Value |
    | --- | --- |
    | Role | Owner and Storage Blob Data Owner |
    | Assign access to | USER |
    | Members | Your user name |

    ![Screenshot that shows the Add role assignment page in Azure portal.](~/reusable-content/ce-skilling/azure/media/role-based-access-control/add-role-assignment-page.png)
1. On the left pane, select **Containers** and create a container.
1. You can give the container any name. In this document, we name the container **users**.
1. Accept the default setting **Public access level**, and then select **Create**.

### Configure access to the storage account from your workspace

Managed identities for your Azure Synapse Analytics workspace might already have access to the storage account. Follow these steps to make sure:

1. Open the [Azure portal](https://portal.azure.com) and the primary storage account chosen for your workspace.
1. Select **Access control (IAM)**.
1. Select **Add** > **Add role assignment** to open the **Add role assignment** page.
1. Assign the following role. For more information, see [Assign Azure roles by using the Azure portal](../role-based-access-control/role-assignments-portal.yml).
    
    | Setting | Value |
    | --- | --- |
    | Role | Storage Blob Data Contributor |
    | Assign access to | MANAGEDIDENTITY |
    | Members | myworkspace  |

    > [!NOTE]
    > The managed identity name is also the workspace name.

    ![Screenshot that shows the Add role assignment pane in the Azure portal.](~/reusable-content/ce-skilling/azure/media/role-based-access-control/add-role-assignment-page.png)
1. Select **Save**.

## Related content

* [Create a dedicated SQL pool](quickstart-create-sql-pool-studio.md) 
* [Create a serverless Apache Spark pool](quickstart-create-apache-spark-pool-portal.md)
* [Use a serverless SQL pool](quickstart-sql-on-demand.md)
