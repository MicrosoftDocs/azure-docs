---
title: Connect an Azure Purview Account  
description: Connect an Azure Purview Account to a Synapse workspace.
author: julieMSFT
ms.service: synapse-analytics
ms.subservice: 
ms.topic: quickstart
ms.date: 12/16/2020
ms.author: jrasnick
ms.reviewer: jrasnick
---

# QuickStart: Connect an Azure Purview Account to a Synapse workspace 


In this quickstart, you will register an Azure Purview Account to a Synapse workspace. That connection allows you to discover Azure Purview assets and interact with them through Synapse capabilities. 

You can perform the following tasks in Synapse: 
- Use the search box at the top to find Purview assets based on keywords 
- Understand the data based on metadata, lineage, annotations 
- Connect those data to your workspace with linked services or integration datasets 
- Analyze those datasets with Synapse Apache Spark, Synapse SQL, and Data Flow 

## Prerequisites 
- [Azure Purview account](../../purview/create-catalog-portal.md) 
- [Synapse workspace](../quickstart-create-workspace.md) 

## Sign in to a Synapse workspace 

Go to [https://web.azuresynapse.net](https://web.azuresynapse.net) and sign in to your workspace. 

## Permissions for connecting an Azure Purview Account 

- To connect an Azure Purview Account to a Synapse workspace, you need a **Contributor** role in Synapse workspace from Azure portal IAM and you need access to that Azure Purview Account. For more details, see [Azure Purview permissions](../../purview/catalog-permissions.md).

## Connect an Azure Purview Account  

- In the Synapse workspace, go to **Manage** -> **Azure Purview**. Select **Connect to a Purview account**. 
- You can choose **From Azure subscription** or **Enter manually**. **From Azure subscription**, you can select the account that you have access to. 
- Once connected, you should be able to see the name of the Purview account in the tab **Azure Purview account**. 
- You can use the Search bar at the top center of the Synapse workspace to search for data. 

## Next steps 

[Register and scan Azure Synapse assets in Azure Purview](../../purview/register-scan-azure-synapse-analytics.md)

[Discover, connect and explore data in Synapse using Azure Purview](how-to-discover-connect-analyze-azure-purview.md)   
