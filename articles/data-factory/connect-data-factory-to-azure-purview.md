---
title: Connect a Data Factory to Microsoft Purview
description: Learn about how to connect a Data Factory to Microsoft Purview
ms.author: jianleishen
author: jianleishen
ms.service: data-factory
ms.topic: conceptual
ms.custom: seo-lt-2019, references_regions
ms.date: 10/20/2023
---

# Connect Data Factory to Microsoft Purview

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

[Microsoft Purview](../purview/overview.md) is a unified data governance service that helps you manage and govern your on-premises, multicloud, and software-as-a-service (SaaS) data. You can connect your data factory to Microsoft Purview. That connection allows you to use Microsoft Purview for capturing lineage data, and to discover and explore Microsoft Purview assets.

## Connect Data Factory to Microsoft Purview

You have two options to connect data factory to Microsoft Purview:

- [Connect to Microsoft Purview account in Data Factory](#connect-to-microsoft-purview-account-in-data-factory)
- [Register Data Factory in Microsoft Purview](#register-data-factory-in-microsoft-purview)

### Connect to Microsoft Purview account in Data Factory

You need to have **Owner** or **Contributor** role on your data factory to connect to a Microsoft Purview account. Your data factory needs to have system assigned managed identity enabled.

To establish the connection on Data Factory authoring UI:

1. In the ADF authoring UI, go to **Manage** -> **Microsoft Purview**, and select **Connect to a Microsoft Purview account**. 

    :::image type="content" source="./media/data-factory-purview/register-purview-account.png" alt-text="Screenshot for registering a Microsoft Purview account.":::

2. Choose **From Azure subscription** or **Enter manually**. **From Azure subscription**, you can select the account that you have access to.

3. Once connected, you can see the name of the Microsoft Purview account in the tab **Microsoft Purview account**.

If your Microsoft Purview account is protected by firewall, create the managed private endpoints for Microsoft Purview. Learn more about how to let Data Factory [access a secured Microsoft Purview account](how-to-access-secured-purview-account.md). You can either do it during the initial connection or edit an existing connection later.

The Microsoft Purview connection information is stored in the data factory resource like the following. To establish the connection programmatically, you can update the data factory and add the `purviewConfiguration` settings. When you want to push lineage from SSIS activities, also add `catalogUri` tag additionally.

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

### Register Data Factory in Microsoft Purview

For how to register Data Factory in Microsoft Purview, see [How to connect Azure Data Factory and Microsoft Purview](../purview/how-to-link-azure-data-factory.md).

## Set up authentication

Data factory's managed identity is used to authenticate lineage push operations from data factory to Microsoft Purview. 

Grant the data factory's managed identity **Data Curator** role on your Microsoft Purview **root collection**. Learn more about [Access control in Microsoft Purview](../purview/catalog-permissions.md) and [Add roles and restrict access through collections](../purview/how-to-create-and-manage-collections.md#add-roles-and-restrict-access-through-collections).

When connecting data factory to Microsoft Purview on authoring UI, ADF tries to add such role assignment automatically. If you have **Collection admins** role on the Microsoft Purview root collection and have access to Microsoft Purview account from your network, this operation is done successfully.

## Monitor Microsoft Purview connection

Once you connect the data factory to a Microsoft Purview account, you see the following page with details on the enabled integration capabilities.

:::image type="content" source="./media/data-factory-purview/monitor-purview-connection-status.png" alt-text="Screenshot for monitoring the integration status between Azure Data Factory and Microsoft Purview.":::

For **Data Lineage - Pipeline**, you might see one of below status:

- **Connected**: The data factory is successfully connected to the Microsoft Purview account. Note this indicates data factory is associated with a Microsoft Purview account and has permission to push lineage to it. If your Microsoft Purview account is protected by firewall, you also need to make sure the integration runtime used to execute the activities and conduct lineage push can reach the Microsoft Purview account. Learn more from [Access a secured Microsoft Purview account from Azure Data Factory](how-to-access-secured-purview-account.md).
- **Disconnected**: The data factory cannot push lineage to Microsoft Purview because Microsoft Purview Data Curator role is not granted to data factory's managed identity. To fix this issue, go to your Microsoft Purview account to check the role assignments, and manually grant the role as needed. Learn more from [Set up authentication](#set-up-authentication) section.
- **Unknown**: Data Factory cannot check the status. Possible reasons are:

    - Cannot reach the Microsoft Purview account from your current network because the account is protected by firewall. You can launch the ADF UI from a private network that has connectivity to your Microsoft Purview account instead.
    - You don't have permission to check role assignments on the Microsoft Purview account. You can contact the Microsoft Purview account admin to check the role assignments for you. Learn about the needed Microsoft Purview role from [Set up authentication](#set-up-authentication) section.

## Report lineage data to Microsoft Purview

Once you connect the data factory to a Microsoft Purview account, when you execute pipelines, Data Factory push lineage information to the Microsoft Purview account. For detailed supported capabilities, see [Supported Azure Data Factory activities](../purview/how-to-link-azure-data-factory.md#supported-azure-data-factory-activities). For an end to end walkthrough, refer to [Tutorial: Push Data Factory lineage data to Microsoft Purview](tutorial-push-lineage-to-purview.md).

## Discover and explore data using Microsoft Purview

Once you connect the data factory to a Microsoft Purview account, you can use the search bar at the top center of Data Factory authoring UI to search for data and perform actions. Learn more from [Discover and explore data in ADF using Microsoft Purview](how-to-discover-explore-purview-data.md).

## Next steps

[Tutorial: Push Data Factory lineage data to Microsoft Purview](tutorial-push-lineage-to-purview.md)

[Discover and explore data in ADF using Microsoft Purview](how-to-discover-explore-purview-data.md)

[Access a secured Microsoft Purview account](how-to-access-secured-purview-account.md)
