---
title: Connect an Azure Purview Account  
description: Connect an Azure Purview Account to a Synapse workspace.
author: Jejiang
ms.service: synapse-analytics
ms.subservice: purview
ms.topic: quickstart
ms.date: 08/06/2021
ms.author: jejiang
ms.reviewer: jrasnick
---

# QuickStart: Connect an Azure Purview Account to a Synapse workspace 

In this quickstart, you will register an Azure Purview Account to a Synapse workspace. That connection allows you to discover Azure Purview assets, interact with them through Synapse capabilities, and push lineage information to Purview. 

You can perform the following tasks in Synapse: 
- Use the search box at the top to find Purview assets based on keywords 
- Understand the data based on metadata, [lineage](../../purview/catalog-lineage-user-guide.md), annotations 
- Connect those data to your workspace with linked services or integration datasets 
- Analyze those datasets with Synapse Apache Spark, Synapse SQL, and Data Flow 
- Execute pipelines and [push lineage information to Purview](../../purview/how-to-lineage-azure-synapse-analytics.md)

## Prerequisites 
- [Azure Purview account](../../purview/create-catalog-portal.md) 
- [Synapse workspace](../quickstart-create-workspace.md) 

## Sign in to a Synapse workspace 

Go to [https://web.azuresynapse.net](https://web.azuresynapse.net) and sign in to your workspace. 

## Permissions for connecting an Azure Purview account 

- To connect an Azure Purview Account to a Synapse workspace, you need a **Contributor** role in Synapse workspace from Azure portal IAM and you need access to that Azure Purview Account. For more information, see [Azure Purview permissions](../../purview/catalog-permissions.md).

## Connect an Azure Purview account  

Follow the steps to connect an Purview account:

1. In the Synapse workspace, go to **Manage** -> **Azure Purview**. Select **Connect to a Purview account**. 
2. You can choose **From Azure subscription** or **Enter manually**. **From Azure subscription**, you can select the account that you have access to. 
3. Once connected, you can see the name of the Purview account in the tab **Azure Purview account**. 

When connecting Synapse workspace with Purview, Synapse also tries to grant the Synapse workspace's managed identity **Purview Data Curator** role on your Purview account. Managed identity is used to authenticate lineage push operations from Synapse to Purview. If you have **Owner** or **User Access Administrator** role on the Purview account, this operation will be done automatically. 

To make sure the connection is properly set for the Synapse pipeline lineage push, go to Azure portal -> your Purview account -> Access control (IAM), check if **Purview Data Curator** role is granted to the Synapse workspace's managed identity. Manually add the role assignment as needed.

Once the connection is established, you can use the Search bar at the top center of the Synapse workspace to search for data, and the pipeline execution will push lineage information to the Purview account.

## Next steps 

[Discover, connect and explore data in Synapse using Azure Purview](how-to-discover-connect-analyze-azure-purview.md)

[Metadata and lineage from Azure Synapse Analytics](../../purview/how-to-lineage-azure-synapse-analytics.md)

[Register and scan Azure Synapse assets in Azure Purview](../../purview/register-scan-azure-synapse-analytics.md)

[Get lineage from Power BI into Azure Purview](../../purview/how-to-lineage-powerbi.md)

[Connect Azure Data Share and Azure Purview](../../purview/how-to-link-azure-data-share.md)