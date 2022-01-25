---
title: Connect a Data Factory to Azure Purview
description: Learn about how to connect a Data Factory to Azure Purview
ms.author: jingwang
author: linda33wj
ms.service: data-factory
ms.topic: conceptual
ms.custom: seo-lt-2019, references_regions
ms.date: 10/25/2021
---

# Connect Data Factory to Azure Purview (Preview)

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

[Azure Purview](../purview/overview.md) is a unified data governance service that helps you manage and govern your on-premises, multi-cloud, and software-as-a-service (SaaS) data. You can connect your data factory to Azure Purview. That connection allows you to use Azure Purview for capturing lineage data, and to discover and explore Azure Purview assets.

## Connect Data Factory to Azure Purview

You have two options to connect data factory to Azure Purview:

- [Connect to Azure Purview account in Data Factory](#connect-to-azure-purview-account-in-data-factory)
- [Register Data Factory in Azure Purview](#register-data-factory-in-azure-purview)

### Connect to Azure Purview account in Data Factory

You need to have **Owner** or **Contributor** role on your data factory to connect to an Azure Purview account.

To establish the connection on Data Factory authoring UI:

1. In the ADF authoring UI, go to **Manage** -> **Azure Purview**, and select **Connect to an Azure Purview account**. 

    :::image type="content" source="./media/data-factory-purview/register-purview-account.png" alt-text="Screenshot for registering an Azure Purview account.":::

2. Choose **From Azure subscription** or **Enter manually**. **From Azure subscription**, you can select the account that you have access to.

3. Once connected, you can see the name of the Azure Purview account in the tab **Azure Purview account**.

If your Azure Purview account is protected by firewall, create the managed private endpoints for Azure Purview. Learn more about how to let Data Factory [access a secured Azure Purview account](how-to-access-secured-purview-account.md). You can either do it during the initial connection or edit an existing connection later.

The Azure Purview connection information is stored in the data factory resource like the following. To establish the connection programmatically, you can update the data factory and add the `purviewConfiguration` settings. When you want to push lineage from SSIS activities, also add `catalogUri` tag additionally.

```json
{
    "name": "ContosoDataFactory",
    "type": "Microsoft.DataFactory/factories",
    "location": "<region>",
    "properties": {
        ...
        "purviewConfiguration": {
            "purviewResourceId": "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupname>/providers/Microsoft.Purview/accounts/<PurviewAccountName>"
        }
    },
    ...
    "identity": {...},
    "tags": {
        "catalogUri": "<PurviewAccountName>.purview.azure.com/catalog //Note: used for SSIS lineage only"
    }
}
```

### Register Data Factory in Azure Purview

For how to register Data Factory in Azure Purview, see [How to connect Azure Data Factory and Azure Purview](../purview/how-to-link-azure-data-factory.md).

## Set up authentication

Data factory's managed identity is used to authenticate lineage push operations from data factory to Azure Purview. 

Grant the data factory's managed identity **Data Curator** role on your Azure Purview **root collection**. Learn more about [Access control in Azure Purview](../purview/catalog-permissions.md) and [Add roles and restrict access through collections](../purview/how-to-create-and-manage-collections.md#add-roles-and-restrict-access-through-collections).

When connecting data factory to Azure Purview on authoring UI, ADF tries to add such role assignment automatically. If you have **Collection admins** role on the Azure Purview root collection and have access to Azure Purview account from your network, this operation is done successfully.

## Monitor Azure Purview connection

Once you connect the data factory to an Azure Purview account, you see the following page with details on the enabled integration capabilities.

:::image type="content" source="./media/data-factory-purview/monitor-purview-connection-status.png" alt-text="Screenshot for monitoring the integration status between Azure Data Factory and Azure Purview.":::

For **Data Lineage - Pipeline**, you may see one of below status:

- **Connected**: The data factory is successfully connected to the Azure Purview account. Note this indicates data factory is associated with an Azure Purview account and has permission to push lineage to it. If your Azure Purview account is protected by firewall, you also need to make sure the integration runtime used to execute the activities and conduct lineage push can reach the Azure Purview account. Learn more from [Access a secured Azure Purview account from Azure Data Factory](how-to-access-secured-purview-account.md).
- **Disconnected**: The data factory cannot push lineage to Azure Purview because Azure Purview Data Curator role is not granted to data factory's managed identity. To fix this issue, go to your Azure Purview account to check the role assignments, and manually grant the role as needed. Learn more from [Set up authentication](#set-up-authentication) section.
- **Unknown**: Data Factory cannot check the status. Possible reasons are:

    - Cannot reach the Azure Purview account from your current network because the account is protected by firewall. You can launch the ADF UI from a private network that has connectivity to your Azure Purview account instead.
    - You don't have permission to check role assignments on the Azure Purview account. You can contact the Azure Purview account admin to check the role assignments for you. Learn about the needed Azure Purview role from [Set up authentication](#set-up-authentication) section.

## Report lineage data to Azure Purview

Once you connect the data factory to an Azure Purview account, when you execute pipelines, Data Factory push lineage information to the Azure Purview account. For detailed supported capabilities, see [Supported Azure Data Factory activities](../purview/how-to-link-azure-data-factory.md#supported-azure-data-factory-activities). For an end to end walkthrough, refer to [Tutorial: Push Data Factory lineage data to Azure Purview](tutorial-push-lineage-to-purview.md).

## Discover and explore data using Azure Purview

Once you connect the data factory to an Azure Purview account, you can use the search bar at the top center of Data Factory authoring UI to search for data and perform actions. Learn more from [Discover and explore data in ADF using Azure Purview](how-to-discover-explore-purview-data.md).

## Next steps

[Tutorial: Push Data Factory lineage data to Azure Purview](tutorial-push-lineage-to-purview.md)

[Discover and explore data in ADF using Azure Purview](how-to-discover-explore-purview-data.md)

[Access a secured Azure Purview account](how-to-access-secured-purview-account.md)
