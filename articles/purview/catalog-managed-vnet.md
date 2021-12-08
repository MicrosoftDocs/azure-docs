---
title: Managed virtual network and managed private endpoints
description: This article describes managed virtual network and managed private endpoints in Azure Purview.
author: zeinam
ms.author: zeinam
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 12/06/2021
# Customer intent: As a Purview admin, I want to set up managed virtual network and managed private endpoints for my Purview account.
---

# Use Managed VNet for your Azure Purview account

> [!IMPORTANT]
> Currently, managed virtual network and managed private endpoints are available for Azure Purview accounts that are deployed in the following regions:
> - Canada Central
> - East US 2
> - West Europe 

## Conceptual Overview

This article describes how to configure managed virtual network and managed private endpoints for Azure Purview.

### Managed virtual network

You can deploy an Azure Integration Runtime (IR) within Azure Purview Managed Virtual Network (VNET), the integration runtime will be provisioned with the managed Virtual Network and will leverage private endpoints to securely connect to supported data sources for scanning purposes. 

Creating an Azure IR within managed Virtual Network ensures that data integration process is isolated and secure. 

Benefits of using Managed Virtual Network:

- With a Managed Virtual Network, you can offload the burden of managing the Virtual Network to Azure Purview. You don't need to create and manage VNets or subnets for Azure Integration Runtime to use for scanning Azure data sources. 
- It doesn't require deep Azure networking knowledge to do data integrations securely. Using a managed virtual network is much simplified for data engineers. 
- Managed Virtual Network along with Managed private endpoints protects against data exfiltration. 

> [!IMPORTANT]
> Currently, the managed Virtual Network is only supported in the same region as Azure Purview account region.

> [!Note]
> Existing global Azure integration runtime or self-hosted integration runtime can't switch to Azure integration runtime in Azure Purview managed virtual network and vice versa.


A Managed VNet is created for your Azure Purview account when you create a managed vnet runtime for the first time in your Purview account. You can't view or manage the Managed VNets.

### Managed private endpoints

Managed private endpoints are private endpoints created in the Azure Purview Managed Virtual Network establishing a private link to Purview and Azure resources. Azure Purview manages these private endpoints on your behalf. 


Azure Purview supports private links. Private link enables you to access Azure (PaaS) services (such as Azure Storage, Azure Cosmos DB, Azure Synapse Analytics).

When you use a private link, traffic between your data sources and managed Virtual Network traverses entirely over the Microsoft backbone network. Private Link protects against data exfiltration risks. You establish a private link to a resource by creating a private endpoint.

Private endpoint uses a private IP address in the managed Virtual Network to effectively bring the service into it. Private endpoints are mapped to a specific resource in Azure and not the entire service. Customers can limit connectivity to a specific resource approved by their organization. Learn more about [private links and private endpoints](../private-link/index.yml).

> [!NOTE]
> to reduce administrative overhead, it's recommended that you create Managed private endpoints to scan all supported Azure data sources. 
 
> [!WARNING]
> If an Azure PaaS data store (Blob, Azure Data Lake Storage Gen2, Azure Synapse Analytics) has a private endpoint already created against it, and even if it allows access from all networks, Purview would only be able to access it using a managed private endpoint. If a private endpoint does not already exist, you must create one in such scenarios. 

A private endpoint connection is created in a "Pending" state when you create a managed private endpoint in Azure Purview. An approval workflow is initiated. The private link resource owner is responsible to approve or reject the connection.

:::image type="content" source="media/catalog-managed-vnet\purview-managed-data-source-approval.png" alt-text="approval for managed private endpoint":::

If the owner approves the connection, the private link is established. Otherwise, the private link won't be established. In either case, the Managed private endpoint will be updated with the status of the connection.

:::image type="content" source="media/catalog-managed-vnet\purview-managed-data-source-pe-azure.png" alt-text="Approve Managed private endpoint":::

Only a Managed private endpoint in an approved state can send traffic to a given private link resource.

### Interactive authoring
Interactive authoring capabilities is used for functionalities like test connection, browse folder list and table list, get schema, and preview data. You can enable interactive authoring when creating or editing an Azure Integration Runtime which is in Purview-managed virtual network. The backend service will pre-allocate compute for interactive authoring functionalities. Otherwise, the compute will be allocated every time any interactive operation is performed which will take more time. The Time To Live (TTL) for interactive authoring is 60 minutes, which means it will automatically become disabled after 60 minutes of the last interactive authoring operation.

:::image type="content" source="media/catalog-managed-vnet\purview-managed-interactive-authoring.png" alt-text="Interactive authoring":::

## Steps to deploy a Managed VNet Runtime

### Prerequisites

Before deploying a Managed VNet and Managed VNet runtime for an Azure Purview account, ensure you meet the following prerequisites:

1. An Azure account with an active subscription. [Create an account for free.](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
2. An Azure Purview account deployed in one of the [supported regions](#supported-regions).
3. You must be a data curator at root collection level in your Azure Purview account.

### Deploy and managed VNet runtimes

1. Go to the [Azure portal](https://portal.azure.com), and navigate to the **Purview accounts** page and select your _Purview account_.

   :::image type="content" source="media/catalog-managed-vnet\purview-managed-azure-portal.png" alt-text="Screenshot that shows the Purview account":::

2. **Open Purview Studio** and navigate to the **Data Map --> Integration runtimes**.

   :::image type="content" source="media/catalog-managed-vnet\purview-managed-vnet.png" alt-text="Screenshot that shows Purview Data Map menus":::

3. From **Integration runtimes** page, select **+ New** icon, to create a new runtime. Select Azure and then select **Continue**.

   :::image type="content" source="media/catalog-managed-vnet\purview-managed-ir-create.png" alt-text="Screenshot that shows how to create new Azure runtime":::

4. Provide a name for your managed vnet runtime, select the region and configure interactive authoring. Select **Create**.

   :::image type="content" source="media/catalog-managed-vnet\purview-managed-ir-region.png" alt-text="Screenshot that shows to create a managed vnet runtime":::

5. Deploying the managed vnet runtime for the first time triggers multiple workflows in Purview Studio for creating managed private endpoints for Azure Purview and its Managed Storage Account. Click on each workflow to approve the private endpoint for the corresponding Azure resource.

   :::image type="content" source="media/catalog-managed-vnet\purview-managed-ir-workflows.png" alt-text="Screenshot that shows deployment of a managed vnet runtime":::

6. In Azure portal, from your Purview account resource blade, approve the managed private endpoint. From Managed storage account blade approve the managed private endpoints for blob and queue services:

   :::image type="content" source="media/catalog-managed-vnet\purview-managed-pe-purview.png" alt-text="Screenshot that shows how to approve a managed private endpoint for Purview":::

   :::image type="content" source="media/catalog-managed-vnet\purview-managed-pe-purview-approved.png" alt-text="Screenshot that shows how to approve a managed private endpoint for Purview - approved":::
   
   :::image type="content" source="media/catalog-managed-vnet\purview-managed-pe-managed-storage.png" alt-text="Screenshot that shows how to approve a managed private endpoint for managed storage account":::

   :::image type="content" source="media/catalog-managed-vnet\purview-managed-pe-managed-storage-approved.png" alt-text="Screenshot that shows how to approve a managed private endpoint for managed storage account - approved":::

7. From Management, select Managed private endpoint to validate if all managed private endpoints are successfully deployed and approved. All private endpoints be approved.
   
    :::image type="content" source="media/catalog-managed-vnet\purview-managed-pe-list.png" alt-text="Screenshot that shows managed private endpoints in Purview":::

    :::image type="content" source="media/catalog-managed-vnet\purview-managed-pe-list-approved.png" alt-text="Screenshot that shows managed private endpoints in Purview - approved ":::

### Deploy managed private endpoints for data sources

To scan any data sources using managed vnet runtime, you need to deploy and approve a managed private endpoint for the data source prior to create a new scan. To deploy and approve a managed private endpoint for a data source, follow these steps:

1. Navigate to **Management**, and select **Managed private endpoints**.
   
2. Select **+ New**.

3. From the list of supported data sources, select the type that corresponds to the data source you are planning to scan using managed vnet runtime.

    :::image type="content" source="media/catalog-managed-vnet\purview-managed-data-source.png" alt-text="Screenshot that shows how to create a managed private endpoint for data sources":::

4. Provide a name for the managed private endpoint, select the Azure subscription and the data source from the drop down lists. Select **create**.

    :::image type="content" source="media/catalog-managed-vnet\purview-managed-data-source-pe.png" alt-text="Screenshot that shows how to select data source for setting managed private endpoint":::

5. From the list of managed private endpoints, click on the newly created managed private endpoint for your data source and then click on **Manage approvals in the Azure portal**, to approve the private endpoint in Azure portal.

    :::image type="content" source="media/catalog-managed-vnet\purview-managed-data-source-approval.png" alt-text="Screenshot that shows the approval for managed private endpoint for data sources":::

6. By clicking on the link, you are redirected to Azure portal. Under private endpoints connection, select the newly created private endpoint and select **approve**.

    :::image type="content" source="media/catalog-managed-vnet\purview-managed-data-source-pe-azure.png" alt-text="Screenshot that shows how to approve a  private endpoint for data sources in Azure portal":::

    :::image type="content" source="media/catalog-managed-vnet\purview-managed-data-source-pe-azure-approved.png" alt-text="Screenshot that shows approved private endpoint for data sources in Azure portal":::

7. Inside Azure Purview Studio, the managed private endpoint must be shown as approved as well.
   
    :::image type="content" source="media/catalog-managed-vnet\purview-managed-pe-list-2.png" alt-text="Screenshot that shows managed private endpoints including data sources' in purview studio":::

### Register and scan a data source using managed vnet runtime

It is important to register the data source in Azure Purview prior to setting up a scan for the data source. Follow these steps to register data source if you haven't yet registered it.

1. Go to your Azure Purview account.
1. Select **Data Map** on the left menu.
1. Select **Register**.
2. On **Register sources**, select your data source 
3. Select **Continue**.
4. On the **Register sources** screen, do the following:

   1. In the **Name** box, enter a name that the data source will be listed with in the catalog. 
   2. In the **Subscription** dropdown list box, select a subscription. 
   3. In the **Select a collection** box, select a collection.
   4. Select **Register** to register the data sources.

For more information, see[Manage data sources in Azure Purview](manage-data-sources.md)

#### Setting up scan using Azure Purview Managed Identity (MSI)

To scan a data source using a managed vnet runtime and Purview managed identity perform these steps:

1. Select the **Data Map** tab on the left pane in the Purview Studio.
1. Select the data source that you registered.
1. Select **View details** > **+ New scan**, or use the **Scan** quick-action icon on the source tile.
1. Provide a **Name** for the scan.
2. Under **Connect via integration runtime**, select the newly created managed vnet runtime. 
3. For **Credential** Select the managed identity, choose the appropriate collection for the scan, and select **Test connection**. On a successful connection, select **Continue**.

    :::image type="content" source="media/catalog-managed-vnet\purview-managed-scan.png" alt-text="Screenshot that shows how to create a new scan using Managed VNet":::

4. Follow the steps to select the appropriate scan rule and scope for your scan.
5. Choose your scan trigger. You can set up a schedule or run the scan once.
6. Review your scan and select **Save and run**.

    :::image type="content" source="media/catalog-managed-vnet\purview-managed-scan-run.png" alt-text="review scan":::

## Supported data sources

Currently, the following data sources are supported to have a managed private endpoint and can be scanned using managed vnet runtime in Azure Purview:

- Azure Blob Storage 
- Azure Data Lake Storage Gen 2 
- Azure SQL Database 
- Azure Cosmos DB
- Azure Synapse Analytics
- Azure Files
- Azure Database for MySQL
- Azure Database for PostgreSQL

Additionally, you can deploy managed private endpoints for your Azure Key Vault resources if you need to run scans using any authentication options rather than Managed Identities, such as SQL Authentication or Account Key.  

## Supported regions

Currently, managed virtual network and managed private endpoints are available for Azure Purview accounts that are deployed in the following regions:
- Canada Central
- East US 2
- West Europe 

## Next steps

- [Manage data sources in Azure Purview](.//manage-data-source.md)
