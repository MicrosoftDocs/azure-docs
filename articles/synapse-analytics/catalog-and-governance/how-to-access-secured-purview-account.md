---
title: Access a secured Microsoft Purview account
description: Learn about how to access a a firewall protected Microsoft Purview account through private endpoints from Synapse
author: linda33wj
ms.service: synapse-analytics
ms.subservice: purview 
ms.topic: how-to
ms.date: 09/02/2021
ms.author: jingwang
ms.reviewer: sngun
---

# Access a secured Microsoft Purview account from Azure Synapse Analytics

This article describes how to access a secured Microsoft Purview account from Azure Synapse Analytics for different integration scenarios.

## Microsoft Purview private endpoint deployment scenarios

You can use [Azure private endpoints](../../private-link/private-endpoint-overview.md) for your Microsoft Purview accounts to allow secure access from a virtual network (VNet) to the catalog over a Private Link. Microsoft Purview provides different types of private points for various access need: *account* private endpoint, *portal* private endpoint, and *ingestion* private endpoints. Learn more from [Microsoft Purview private endpoints conceptual overview](../../purview/catalog-private-link.md#conceptual-overview). 

If your Microsoft Purview account is protected by firewall and denies public access, make sure you follow below checklist to set up the private endpoints so Synapse can successfully connect to Microsoft Purview. 

| Scenario                                                     | Required Microsoft Purview private endpoints                           |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [Run pipeline and report lineage to Microsoft Purview](../../purview/how-to-lineage-azure-synapse-analytics.md) | For Synapse pipeline to push lineage to Microsoft Purview, Microsoft Purview ***account*** and ***ingestion*** private endpoints are required. <br>- When using **Azure Integration Runtime**, follow the steps in [Managed private endpoints for Microsoft Purview](#managed-private-endpoints-for-microsoft-purview) section to create managed private endpoints in the Synapse managed virtual network.<br>- When using **Self-hosted Integration Runtime**, follow the steps in [this section](../../purview/catalog-private-link-end-to-end.md#option-2---enable-account-portal-and-ingestion-private-endpoint-on-existing-microsoft-purview-accounts) to create the *account* and *ingestion* private endpoints in your integration runtime's virtual network. |
| [Discover and explore data using Microsoft Purview on Synapse Studio](how-to-discover-connect-analyze-azure-purview.md) | To use the search bar at the top center of Synapse Studio to search for Microsoft Purview data and perform actions, you need to create Microsoft Purview ***account*** and ***portal*** private endpoints in the virtual network that you launch the Synapse Studio. Follow the steps in [Enable *account* and *portal* private endpoint](../../purview/catalog-private-link-account-portal.md#option-2---enable-account-and-portal-private-endpoint-on-existing-microsoft-purview-accounts). |

## Managed private endpoints for Microsoft Purview

[Managed private endpoints](../security/synapse-workspace-managed-private-endpoints.md) are private endpoints created a Managed Virtual Network associated with your Azure Synapse workspace. When you run pipeline and report lineage to a firewall protected Microsoft Purview account, make sure your Synapse workspace is created with "Managed virtual network" option enabled, then create the Microsoft Purview ***account*** and ***ingestion*** managed private endpoints as follows.

### Create managed private endpoints

To create managed private endpoints for Microsoft Purview on Synapse Studio:

1. Go to **Manage** -> **Microsoft Purview**, and click **Edit** to edit your existing connected Microsoft Purview account or click **Connect to a Microsoft Purview account** to connect to a new Microsoft Purview account.

2. Select **Yes** for **Create managed private endpoints**. You need to have "**workspaces/managedPrivateEndpoint/write**" permission, e.g. Synapse Administrator or Synapse Linked Data Manager role.

   >[!TIP]
   > If you are not seeing any option to create managed private endpoints, you need to use or create an [Azure Synapse workspace has the managed virtual network option enabled at creation](../security/synapse-workspace-managed-vnet.md).

3. Click **+ Create all** button to batch create the needed Microsoft Purview private endpoints, including the ***account*** private endpoint and the ***ingestion*** private endpoints for the Microsoft Purview managed resources - Blob storage, Queue storage, and Event Hubs namespace. You need to have at least **Reader** role on your Microsoft Purview account for Synapse to retrieve the Microsoft Purview managed resources' information.

   :::image type="content" source="./media/purview-create-all-managed-private-endpoints.png" alt-text="Create managed private endpoint for your connected Microsoft Purview account.":::

4. In the next page, specify a name for the private endpoint. It will be used to generate names for the ingestion private endpoints as well with suffix.

   :::image type="content" source="./media/name-purview-private-endpoints.png" alt-text="Name the managed private endpoints for your connected Microsoft Purview account.":::

5. Click **Create** to create the private endpoints. After creation, 4 private endpoint requests will be generated that must [get approved by an owner of Microsoft Purview](#approve-private-endpoint-connections).

Such batch managed private endpoint creation is provided on the Synapse Studio only. If you want to create the managed private endpoints programmatically, you need to create those PEs individually. You can find Microsoft Purview managed resources' information from Azure portal -> your Microsoft Purview account -> Managed resources.

### Approve private endpoint connections

After you create the managed private endpoints for Microsoft Purview, you see "Pending" state first. The Microsoft Purview owner need to approve the private endpoint connections for each resource.

If you have permission to approve the Microsoft Purview private endpoint connection, from Synapse Studio: 

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

- Go to **Manage** -> **Microsoft Purview** -> **Edit** to open your existing connected Microsoft Purview account. To see all the relevant private endpoints, you need to have at least **Reader** role on your Microsoft Purview account for Synapse to retrieve the Microsoft Purview managed resources' information. Otherwise, you only see *account* private endpoint with warning.
- Go to **Manage** -> **Managed private endpoints** where you see all the managed private endpoints created under the Synapse workspace. If you have at least **Reader** role on your Microsoft Purview account, you see Microsoft Purview relevant private endpoints being grouped together. Otherwise, they show up separately in the list.

## Next steps 

- [Connect Synapse workspace to Microsoft Purview](quickstart-connect-azure-purview.md)
- [Metadata and lineage from Azure Synapse Analytics](../../purview/how-to-lineage-azure-synapse-analytics.md)
- [Discover, connect and explore data in Synapse using Microsoft Purview](how-to-discover-connect-analyze-azure-purview.md)
