---
title: Connect an Azure Purview account  
description: Connect an Azure Purview account to a Synapse workspace.
author: Jejiang
ms.service: synapse-analytics
ms.subservice: purview
ms.topic: quickstart
ms.date: 08/24/2021
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

Follow the steps to connect an Azure Purview account:

1. In the Synapse workspace, go to **Manage** -> **Azure Purview**. Select **Connect to a Purview account**. 
2. You can choose **From Azure subscription** or **Enter manually**. **From Azure subscription**, you can select the account that you have access to.
3. Once connected, you can see the name of the Purview account in the tab **Azure Purview account**. 

The Purview connection information is stored in the Synapse workspace resource like the following. To establish the connection programmatically, you can update the Synapse workspace and add the `purviewConfiguration` settings.

```json
{
    "name": "ContosoSynapseWorkspace",
    "type": "Microsoft.Synapse/workspaces",
    "location": "<region>",
    "properties": {
        ...
        "purviewConfiguration": {
            "purviewResourceId": "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupname>/providers/Microsoft.Purview/accounts/<PurviewAccountName>"
        }
    },
    "identity": {...},
    ...
}
```

### Authenticate lineage push operations

Synapse workspace's managed identity is used to authenticate lineage push operations from Synapse workspace to Purview.

- For Purview account created **on or after August 18, 2021**, grant the Synapse workspace's managed identity **Data Curator** role on your Purview **root collection**. Learn more about [Access control in Azure Purview](../purview/catalog-permissions.md) and [Add roles and restrict access through collections](../purview/how-to-create-and-manage-collections.md#add-roles-and-restrict-access-through-collections).

    When connecting Synapse workspace to Purview on authoring UI, ADF tries to add such role assignment automatically. If you have **Collection admins** role on the Purview root collection, this operation will be done successfully.

- For Purview account created **before August 18, 2021**, grant the Synapse workspace's managed identity Azure built-in [**Purview Data Curator** role](../role-based-access-control/built-in-roles#purview-data-curator.md) on your Purview account. Learn more about [Access control in Azure Purview - legacy permissions](../purview/catalog-permissions.md#legacy-permission-guide).

    When connecting Synapse workspace to Purview on authoring UI, ADF tries to add such role assignment automatically. If you have Azure built-in **Owner** or **User Access Administrator** role on the Purview account, this operation will be done successfully.

You may see below warning if the needed role is not granted and you have the privilege to read Purview role assignment information.

:::image type="content" source="./media/register-purview-account-warning.png" alt-text="Screenshot for warning of registering a Purview account.":::

To make sure the connection is properly set for the pipeline lineage push, go to your Purview account and check if **Purview Data Curator** role is granted to the Synapse workspace's managed identity. If not, manually add the role assignment.

## Report lineage data to Azure Purview

Once you connect the Synapse workspace to a Purview account, when you run Copy, Data flow or Execute SSIS package activity, you can get the lineage between datasets created by data processes and have a high-level overview of whole workflow process among data sources and destination. For detailed supported capabilities, see [Metadata and lineage from Azure Synapse Analytics](../../purview/how-to-lineage-azure-synapse-analytics.md).

## Discover and explore data using Purview

Once you connect the Synapse workspace to a Purview account, you can use the search bar at the top center of Azure Synapse workspace autoring UI to search for data and perform actions. Learn more from [Discover, connect and explore data in Synapse using Azure Purview](how-to-discover-connect-analyze-azure-purview.md).

## Next steps 

[Discover, connect and explore data in Synapse using Azure Purview](how-to-discover-connect-analyze-azure-purview.md)

[Metadata and lineage from Azure Synapse Analytics](../../purview/how-to-lineage-azure-synapse-analytics.md)

[Register and scan Azure Synapse assets in Azure Purview](../../purview/register-scan-azure-synapse-analytics.md)

[Get lineage from Power BI into Azure Purview](../../purview/how-to-lineage-powerbi.md)

[Connect Azure Data Share and Azure Purview](../../purview/how-to-link-azure-data-share.md)