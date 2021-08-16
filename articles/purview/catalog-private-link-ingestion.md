---
title: Scan data sources from restricted network
description: This article describes how you can set up a private endpoint to scan data sources from restricted network
author: viseshag
ms.author: viseshag
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 08/16/2021
# Customer intent: As an Azure Purview admin, I want to set up private endpoints for my Azure Purview to scan data sources from restricted network.
---

# Scan data sources from restricted network using Ingestion private endpoint

If you plan to scan your data sources in private networks, virtual networks, and behind private endpoints, Azure Purview ingestion private endpoints must be deployed to ensure network isolation for your metadata flowing from the data sources that are being scanned to the Azure Purview Data Map.

Azure Purview can scan data sources in Azure or an on-premises environment by using _ingestion_ private endpoints. Three private endpoint resources are required to be deployed and linked to Azure Purview managed resources when ingestion private endpoint is deployed:

- Blob private endpoint is linked to an Azure Purview managed storage account.
- Queue private endpoint is linked to an Azure Purview managed storage account.
- namespace private endpoint is linked to an Azure Purview managed event hub namespace.

:::image type="content" source="media/catalog-private-link/purview-private-link-architecture-ingestion.png" alt-text="Diagram that shows Azure Purview and Private Link architecture." "lightbox="media/catalog-private-link/purview-private-link-architecture-ingestion.png":::

## Deployment checklist
Using the one of the deployment options from this guide, enable ingestion private endpoints for your Azure Purview account:

1. Before you start this guide, choose an appropriate Azure virtual network and a subnet to deploy Azure Purview ingestion private endpoints:
   - Deploy a [new virtual network](../virtual-network/quick-create-portal.md) in your Azure subscription.
   - Locate an existing Azure virtual network and a subnet in your Azure subscription.
  
2. Define an appropriate name resolution method for ingestion, so Azure Purview can scan data sources using private network. You can use any of the following options:
   - Deploy new Azure DNS zones using the steps explained further in this guide.
   - Add required DNS records to existing Azure DNS zones using the steps explained further in this guide.
   - After completing the steps in this guide, add required DNS A records in your existing DNS servers manually.
3. Deploy a [new Purview account](#option-1---deploy-a-new-azure-purview-account-with-ingestion-private-endpoint) with ingestion private endpoints, or deploy ingestion private endpoints for an [existing Purview account](#option-2---enable-ingestion-private-endpoint-on-existing-azure-purview-accounts).
4. Deploy and register [Self-hosted integration runtime](#deploy-self-hosted-integration-runtime-ir-and-scan-your-data-sources) inside the same VNet where Azure Purview ingestion private endpoints are deployed.
5. After completing this guide, adjust DNS configurations if needed.
6. Validate your network and name resolution between management machine, self-hosted IR VM and data sources to Azure Purview. 

## Option 1 - Deploy a new Azure Purview account with _ingestion_ private endpoint

1. Go to the [Azure portal](https://portal.azure.com), and then go to the **Purview accounts** page. Select **+ Create** to create a new Azure Purview account.

2. Fill in the basic information, and on the **Networking** tab, set the connectivity method to **Private endpoint**. Set enable private endpoint to **Ingestion only**.

3. Set up your ingestion private endpoints by providing details for **Subscription**, **Virtual network**, and **Subnet** that you want to pair with your private endpoint.

   :::image type="content" source="media/catalog-private-link/create-pe-azure-portal.png" alt-text="Screenshot that shows creating a private endpoint in the Azure portal.":::

4. Optionally, select **Private DNS integration** to use Azure Private DNS Zones.
   
   > [!IMPORTANT]
   > It is important to select correct Azure Private DNS Zones to allow correct name resolution between Azure Purview and data sources. You can also use your existing Azure Private DNS Zones or create DNS records in your DNS Servers manually later. For more information, see [Configure DNS Name Resolution for private endpoints](./catalog-private-link-name-resolution.md)

5.  Select **Review + Create**. On the **Review + Create** page, Azure validates your configuration.

6.  When you see the "Validation passed" message, select **Create**.

    :::image type="content" source="media/catalog-private-link/validation-passed.png" alt-text="Screenshot that shows that validation passed for account creation.":::

## Option 2 - Enable _ingestion_ private endpoint on existing Azure Purview accounts

1.  Go to the [Azure portal](https://portal.azure.com), and then click on to your Azure Purview account, under **Settings** select **Networking**, and then select **Ingestion private endpoint connections**.

2. Under Ingestion private endpoint connections, select **+ New** to create a new ingestion private endpoint.

3. Fill in the basic information, selecting your existing virtual network and a subnet details. Optionally, select **Private DNS integration** to use Azure Private DNS Zones. 
   
   > [!IMPORTANT]
   > It is important to select correct Azure Private DNS Zones to allow correct name resolution between Azure Purview and data sources. You can also use your existing Azure Private DNS Zones or create DNS records in your DNS Servers manually later. For more information, see [Configure DNS Name Resolution for private endpoints](./catalog-private-link-name-resolution.md)
   :::image type="content" source="media/catalog-private-link/ingestion-pe-fill-details.png" alt-text="Screenshot that shows filling in private endpoint details.":::

4. Select **Create** to finish the setup.

> [!NOTE]
> Ingestion private endpoints can be created only via the Azure Purview portal experience described in the preceding steps. They cannot be created from the Private Link Center.

## Deploy self-hosted integration runtime (IR) and scan your data sources.
Once you deploy ingestion private endpoints for your Azure Purview, you need to setup and register at least one self-hosted integration runtime (IR):

- All on-premises source types like Azure SQL Server, Oracle, SAP, and others are currently supported only via self-hosted IR-based scans. The self-hosted IR must run within your private network and then be peered with your virtual network in Azure. 
   
- For all Azure source types like Azure Blob Storage and Azure SQL Database, you must explicitly choose to run the scan by using a self-hosted integration runtime that is deployed in the same VNet as Azure Purview ingestion private endpoint. 

Follow the steps in [Create and manage a self-hosted integration runtime](manage-integration-runtimes.md) to set up a self-hosted IR. Then set up your scan on the Azure source by choosing that self-hosted IR in the **Connect via integration runtime** dropdown list to ensure network isolation.
    
   :::image type="content" source="media/catalog-private-link/shir-for-azure.png" alt-text="Screenshot that shows running an Azure scan by using self-hosted IR.":::

## Next steps

-  [Review name resolution for private endpoints](./catalog-private-link-name-resolution.md)
-  [Manage data sources in Azure Purview](./manage-data-sources.md)
-  [Troubleshooting private endpoint configuration for your Azure Purview account](./catalog-private-link-troubleshooting.md)