---
title: Access a secured Microsoft Purview account
description: Learn about how to access a firewall protected Microsoft Purview account through private endpoints from Azure Data Factory
ms.author: jianleishen
author: jianleishen
ms.service: data-factory
ms.topic: conceptual
ms.custom: [seo-lt-2019, references_regions]
ms.date: 08/07/2023
---

# Access a secured Microsoft Purview account from Azure Data Factory

This article describes how to access a secured Microsoft Purview account from Azure Data Factory for different integration scenarios.

## Microsoft Purview private endpoint deployment scenarios

Microsoft Purview provides different options of [firewall settings](/purview/catalog-firewall). Refer to the following pipeline lineage support matrix for each Data Factory integration runtime type. 

| Microsoft Purview firewall settings | Azure integration runtime | Azure integration runtime with managed virtual network       | Self-hosted integration runtime                              |
| ----------------------------------- | ------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Enabled from all networks           | Supported                 | Supported                                                    | Supported                                                    |
| Disabled for ingestion only         | Supported                 | Supported                                                    | Supported, ***ingestion*** private endpoints are required    |
| Disabled from all networks          | Unsupported               | Supported, ***account*** and ***ingestion*** private endpoints are required | Supported, ***account*** and ***ingestion*** private endpoints are required |

You can use [Azure private endpoints](../private-link/private-endpoint-overview.md) for your Microsoft Purview accounts to allow secure access from a virtual network (VNet) to the catalog over a Private Link. Microsoft Purview provides different types of private endpoints for various access need: *account* private endpoint, *portal* private endpoint, and *ingestion* private endpoints. Learn more from [Microsoft Purview private endpoints conceptual overview](../purview/catalog-private-link.md#conceptual-overview). 

When private endpoints are needed, make sure you follow below instruction to set them up so Data Factory can successfully connect to Microsoft Purview. If the integration runtime cannot connect to Purview, you will see lineage status as failed or timed out on the activity run monitoring, and the activity execution duration might be slight longer (up to 2-minute which is the default timeout setting).

| Scenario                                                     | Required Microsoft Purview private endpoints                 |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [Run pipeline and report lineage to Microsoft](tutorial-push-lineage-to-purview.md) | For Data Factory pipeline to push lineage to Microsoft Purview: <br>- When using **Azure Integration Runtime**, follow the steps in [Managed private endpoints for Microsoft Purview](#managed-private-endpoints-for-microsoft-purview) section to create managed private endpoints in the Data Factory managed virtual network.<br>- When using **Self-hosted Integration Runtime**, follow the steps in [this section](../purview/catalog-private-link-end-to-end.md#option-2---enable-account-portal-and-ingestion-private-endpoint-on-existing-microsoft-purview-accounts) to create the ***account*** and ***ingestion*** private endpoints in your integration runtime's virtual network. |
| [Discover and explore data using Microsoft on ADF UI](how-to-discover-explore-purview-data.md) | To use the search bar at the top center of Data Factory authoring UI to search for Microsoft Purview data and perform actions, you need to create Microsoft Purview ***account*** and ***portal*** private endpoints in the virtual network that you launch the Data Factory Studio. Follow the steps in [Enable *account* and *portal* private endpoint](../purview/catalog-private-link-account-portal.md#option-2---enable-account-and-portal-private-endpoint-on-existing-microsoft-purview-accounts). |

## Managed private endpoints for Microsoft Purview

[Managed private endpoints](managed-virtual-network-private-endpoint.md#managed-private-endpoints) are private endpoints created in the Azure Data Factory Managed Virtual Network establishing a private link to Azure resources. When you run pipeline and report lineage to a firewall protected Microsoft Purview account, create an Azure Integration Runtime with "Virtual network configuration" option enabled, then create the Microsoft Purview ***account*** and ***ingestion*** managed private endpoints as follows.

### Create managed private endpoints

To create managed private endpoints for Microsoft Purview on Data Factory authoring UI:

1. Go to **Manage** -> **Microsoft Purview**, and click **Edit** to edit your existing connected Microsoft Purview account or click **Connect to a Microsoft Purview account** to connect to a new Microsoft Purview account.

2. Select **Yes** for **Create managed private endpoints**. You need to have at least one Azure Integration Runtime with "Virtual network configuration" option enabled in the data factory to see this option.

3. Click **+ Create all** button to batch create the needed Microsoft Purview private endpoints, including the ***account*** private endpoint and the ***ingestion*** private endpoints for the Microsoft Purview managed resources - Blob storage, Queue storage, and Event Hubs namespace. You need to have at least **Reader** role on your Microsoft Purview account for Data Factory to retrieve the Microsoft Purview managed resources' information.

   :::image type="content" source="./media/how-to-access-secured-purview-account/purview-create-all-managed-private-endpoints.png" alt-text="Create managed private endpoint for your connected Microsoft Purview account.":::

4. In the next page, specify a name for the private endpoint. It will be used to generate names for the ingestion private endpoints as well with suffix.

   :::image type="content" source="./media/how-to-access-secured-purview-account/name-purview-private-endpoints.png" alt-text="Name the managed private endpoints for your connected Microsoft Purview account.":::

5. Click **Create** to create the private endpoints. After creation, 4 private endpoint requests will be generated that must [get approved by an owner of Microsoft Purview](#approve-private-endpoint-connections).

Such batch managed private endpoint creation is provided on the Microsoft Purview UI only. If you want to create the managed private endpoints programmatically, you need to create those PEs individually. You can find Microsoft Purview managed resources' information from Azure portal -> your Microsoft Purview account -> Managed resources.

### Approve private endpoint connections

After you create the managed private endpoints for Microsoft Purview, you see "Pending" state first. The Microsoft Purview owner need to approve the private endpoint connections for each resource.

If you have permission to approve the Microsoft Purview private endpoint connection, from Data Factory UI: 

1. Go to **Manage** -> **Microsoft Purview** -> **Edit**
2. In the private endpoint list, click the **Edit** (pencil) button next to each private endpoint name
3. Click **Manage approvals in Azure portal** which will bring you to the resource.
4. On the given resource, go to **Networking** -> **Private endpoint connection** to approve it. The private endpoint is named as `data_factory_name.your_defined_private_endpoint_name` with description as "Requested by data_factory_name".
5. Repeat this operation for all private endpoints.

If you don't have permission to approve the Microsoft Purview private endpoint connection, ask the Microsoft Purview account owner to do as follows.

- For *account* private endpoint, go to Azure portal -> your Microsoft Purview account -> Networking -> Private endpoint connection to approve.
- For *ingestion* private endpoints, go to Azure portal -> your Microsoft Purview account -> Managed resources, click into the Storage account and Event Hubs namespace respectively, and approve the private endpoint connection in Networking -> Private endpoint connection page.

### Monitor managed private endpoints

You can monitor the created managed private endpoints for Microsoft Purview at two places:

- Go to **Manage** -> **Microsoft Purview** -> **Edit** to open your existing connected Microsoft Purview account. To see all the relevant private endpoints, you need to have at least **Reader** role on your Microsoft Purview account for Data Factory to retrieve the Microsoft Purview managed resources' information. Otherwise, you only see *account* private endpoint with warning.
- Go to **Manage** -> **Managed private endpoints** where you see all the managed private endpoints created under the data factory. If you have at least **Reader** role on your Microsoft Purview account, you see Microsoft Purview relevant private endpoints being grouped together. Otherwise, they show up separately in the list.

## Next steps 

- [Connect Data Factory to Microsoft Purview](connect-data-factory-to-azure-purview.md)
- [Tutorial: Push Data Factory lineage data to Microsoft Purview](tutorial-push-lineage-to-purview.md)
- [Discover and explore data in ADF using Microsoft Purview](how-to-discover-explore-purview-data.md)
