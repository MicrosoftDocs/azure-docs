---
title: 'Quickstart: create a Synapse workspace'
description: Create an  Synapse workspace by following the steps in this guide.
author: saveenr
ms.service: synapse-analytics
ms.topic: quickstart
ms.subservice: workspace
ms.date: 03/23/2022
ms.author: saveenr
ms.reviewer: sngun
ms.custom: subject-rbac-steps, mode-other
---

# Quickstart: Create a Synapse workspace
This quickstart describes the steps to create an Azure Synapse workspace by using the Azure portal.

## Create a Synapse workspace

1. Open the [Azure portal](https://portal.azure.com), and at the top search for **Synapse**.
1. In the search results, under **Services**, select **Azure Synapse Analytics**.
1. Select **Add** to create a workspace.
1. In the **Basics** tab, give the workspace a unique name. We'll use **mysworkspace** in this document
1. You need an ADLSGEN2 account to create a workspace. The simplest choice is to create a new one. If you want to re-use an existing one you'll need to perform some additional configuration. 
1. OPTION 1 Creating a new ADLSGEN2 account 
    1. Under **Select Data Lake Storage Gen 2**, click **Create New** and name it **contosolake**.
    1. Under **Select Data Lake Storage Gen 2**, click **File System** and  name it **users**.
1. OPTION 2 See the **Prepare a Storage Account** instructions at the bottom of this document.
1. Your Azure Synapse workspace will use this storage account as the "primary" storage account and the container to store workspace data. The workspace stores data in Apache Spark tables. It stores Spark application logs under a folder called **/synapse/workspacename**.
1. Select **Review + create** > **Create**. Your workspace is ready in a few minutes.

> [!NOTE]
> After creating your Azure Synapse workspace, you will not be able to move the workspace to another Microsoft Entra tenant. If you do so through subscription migration or other actions, you may lose access to the artifacts within the workspace.

## Open Synapse Studio

After your Azure Synapse workspace is created, you have two ways to open Synapse Studio:

* Open your Synapse workspace in the [Azure portal](https://portal.azure.com). On the top of the **Overview** section, select **Launch Synapse Studio**.
* Go to the `https://web.azuresynapse.net` and sign in to your workspace.

## Prepare an existing storage account for use with Azure Synapse Analytics

1. Open the [Azure portal](https://portal.azure.com).
1. Navigate to an existing ADLSGEN2 storage account
1. Select **Access control (IAM)**.
1. Select **Add** > **Add role assignment** to open the Add role assignment page.
1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).
    
    | Setting | Value |
    | --- | --- |
    | Role | Owner and Storage Blob Data Owner |
    | Assign access to | USER |
    | Members | your user name |

    ![Add role assignment page in Azure portal.](../../includes/role-based-access-control/media/add-role-assignment-page.png)
1. On the left pane, select **Containers** and create a container.
1. You can give the container any name. In this document, we'll name the container **users**.
1. Accept the default setting **Public access level**, and then select **Create**.

### Configure access to the storage account from your workspace

Managed identities for your Azure Synapse workspace might already have access to the storage account. Follow these steps to make sure:

1. Open the [Azure portal](https://portal.azure.com) and the primary storage account chosen for your workspace.
1. Select **Access control (IAM)**.
1. Select **Add** > **Add role assignment** to open the Add role assignment page.
1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).
    
    | Setting | Value |
    | --- | --- |
    | Role | Storage Blob Data Contributor |
    | Assign access to | MANAGEDIDENTITY |
    | Members | myworkspace  |

    > [!NOTE]
    > The managed identity name is also the workspace name.

    ![Add role assignment page in Azure portal.](../../includes/role-based-access-control/media/add-role-assignment-page.png)
1. Select **Save**.

## Next steps

* [Create a dedicated SQL pool](quickstart-create-sql-pool-studio.md) 
* [Create a serverless Apache Spark pool](quickstart-create-apache-spark-pool-portal.md)
* [Use serverless SQL pool](quickstart-sql-on-demand.md)
