---
title: Connect Synapse workspace to Azure Purview
description: Connect a Synapse workspace to an Azure Purview account.
author: Jejiang
ms.service: synapse-analytics
ms.subservice: purview
ms.topic: quickstart
ms.date: 09/29/2021
ms.author: jejiang
ms.reviewer: sngun
ms.custom: mode-other
---

# QuickStart: Connect a Synapse workspace to an Azure Purview account

In this quickstart, you will register an Azure Purview Account to a Synapse workspace. That connection allows you to discover Azure Purview assets, interact with them through Synapse capabilities, and push lineage information to Azure Purview.

You can perform the following tasks in Synapse:
- Use the search box at the top to find Azure Purview assets based on keywords 
- Understand the data based on metadata, [lineage](../../purview/catalog-lineage-user-guide.md), annotations 
- Connect those data to your workspace with linked services or integration datasets 
- Analyze those datasets with Synapse Apache Spark, Synapse SQL, and Data Flow 
- Execute pipelines and [push lineage information to Azure Purview](../../purview/how-to-lineage-azure-synapse-analytics.md)

## Prerequisites 
- [Azure Azure Purview account](../../purview/create-catalog-portal.md) 
- [Synapse workspace](../quickstart-create-workspace.md) 

## Permissions for connecting an Azure Purview account 

To connect an Azure Purview Account to a Synapse workspace, you need a **Contributor** role in Synapse workspace from Azure portal IAM and you need access to that Azure Purview Account. For more information, see [Azure Purview permissions](../../purview/catalog-permissions.md).

## Connect an Azure Purview account  

Follow the steps to connect an Azure Purview account:

1. Go to [https://web.azuresynapse.net](https://web.azuresynapse.net) and sign in to your Synapse workspace. 
2. Go to **Manage** -> **Azure Purview**, select **Connect to an Azure Purview account**.
3. You can choose **From Azure subscription** or **Enter manually**. **From Azure subscription**, you can select the account that you have access to.
4. Once connected, you can see the name of the Azure Purview account in the tab **Azure Purview account**. 

If your Azure Purview account is protected by firewall, create the managed private endpoints for Azure Purview. Learn more about how to let Azure Synapse [access a secured Azure Purview account](how-to-access-secured-purview-account.md). You can either do it during the initial connection or edit an existing connection later.

The Azure Purview connection information is stored in the Synapse workspace resource like the following. To establish the connection programmatically, you can update the Synapse workspace and add the `purviewConfiguration` settings.

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

## Set up authentication

Synapse workspace's managed identity is used to authenticate lineage push operations from Synapse workspace to Azure Purview.

Grant the Synapse workspace's managed identity **Data Curator** role on your Azure Purview **root collection**. Learn more about [Access control in Azure Purview](../../purview/catalog-permissions.md) and [Add roles and restrict access through collections](../../purview/how-to-create-and-manage-collections.md#add-roles-and-restrict-access-through-collections).

When connecting Synapse workspace to Azure Purview in Synapse Studio, Synapse tries to add such role assignment automatically. If you have **Collection admins** role on the Azure Purview root collection and have access to Azure Purview account from your network, this operation is done successfully.

## Monitor Azure Purview connection

Once you connect the Synapse workspace to an Azure Purview account, you see the following page with details on the enabled integration capabilities.

:::image type="content" source="./media/monitor-purview-connection-status.png" alt-text="Screenshot for monitoring the integration status between Azure Synapse and Azure Purview.":::

For **Data Lineage - Synapse Pipeline**, you may see one of below status:

- **Connected**: The Synapse workspace is successfully connected to the Azure Purview account. Note this indicates Synapse workspace is associated with an Azure Purview account and has permission to push lineage to it. If your Azure Purview account is protected by firewall, you also need to make sure the integration runtime used to execute the activities and conduct lineage push can reach the Azure Purview account. Learn more from [Access a secured Azure Purview account](how-to-access-secured-purview-account.md).
- **Disconnected**: The Synapse workspace cannot push lineage to Azure Purview because Azure Purview Data Curator role is not granted to Synapse workspace's managed identity. To fix this issue, go to your Azure Purview account to check the role assignments, and manually grant the role as needed. Learn more from [Set up authentication](#set-up-authentication) section.
- **Unknown**: Azure Synapse cannot check the status. Possible reasons are:

    - Cannot reach the Azure Purview account from your current network because the account is protected by firewall. You can launch the Synapse Studio from a private network that has connectivity to your Azure Purview account instead.
    - You don't have permission to check role assignments on the Azure Purview account. You can contact the Azure Purview account admin to check the role assignments for you. Learn about the needed Azure Purview role from [Set up authentication](#set-up-authentication) section.

## Report lineage to Azure Purview

Once you connect the Synapse workspace to an Azure Purview account, when you execute pipelines, Synapse reports lineage information to the Azure Purview account. For detailed supported capabilities and an end to end walkthrough, see [Metadata and lineage from Azure Synapse Analytics](../../purview/how-to-lineage-azure-synapse-analytics.md).

## Discover and explore data using Azure Purview

Once you connect the Synapse workspace to an Azure Purview account, you can use the search bar at the top center of Synapse workspace to search for data and perform actions. Learn more from [Discover, connect and explore data in Synapse using Azure Purview](how-to-discover-connect-analyze-azure-purview.md).

## Next steps 

[Discover, connect and explore data in Synapse using Azure Purview](how-to-discover-connect-analyze-azure-purview.md)

[Metadata and lineage from Azure Synapse Analytics](../../purview/how-to-lineage-azure-synapse-analytics.md)

[Access a secured Azure Purview account](how-to-access-secured-purview-account.md)

[Register and scan Azure Synapse assets in Azure Purview](../../purview/register-scan-azure-synapse-analytics.md)

[Get lineage from Power BI into Azure Purview](../../purview/how-to-lineage-powerbi.md)

[Connect Azure Data Share and Azure Purview](../../purview/how-to-link-azure-data-share.md)
