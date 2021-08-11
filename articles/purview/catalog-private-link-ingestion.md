---
title: Use private endpoints for secure access to Azure Purview
description: This article describes how you can set up a private endpoint for your Azure Purview account.
author: viseshag
ms.author: viseshag
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 08/10/2021
# Customer intent: As an Azure Purview admin, I want to set up private endpoints for my Azure Purview account for secure access.
---

# Ingestion private endpoints and scanning sources

If you plan to scan your data sources in private networks, virtual networks, and behind private endpoints, Azure Purview ingestion private endpoints must be deployed to ensure network isolation for your metadata flowing from the data sources that are being scanned to the Azure Purview Data Map.

Azure Purview can scan data sources in Azure or an on-premises environment by using ingestion private endpoints. Three private endpoint resources are required to be deployed and linked to Azure Purview managed resources when ingestion private endpoints are created:

- Blob private endpoint is linked to an Azure Purview managed storage account.
- Queue private endpoint is linked to an Azure Purview managed storage account.
- namespace private endpoint is linked to an Azure Purview managed event hub namespace.

:::image type="content" source="media/catalog-private-link/purview-private-link-architecture-ingestion.png" alt-text="Diagram that shows Azure Purview and Private Link architecture." "lightbox="media/catalog-private-link/purview-private-link-architecture-ingestion.png":::
   
Enable ingestion private endpoints for your Azure Purview account by following the steps from any of these options:

## Option 1 - Deploy a new Azure Purview account with _ingestion_ private endpoint

When deploying a new Azure Purview account you can optionally deploy it with ingestion, account and portal private endpoints: 

1. Go to the [Azure portal](https://portal.azure.com), from left-hand menu select **+ Create a resource**. From Azure marketplace search for Purview Accounts and select **Create**.

2. Fill in the basic information, and on the **Networking** tab, set the connectivity method to **Private endpoint**. Set up your ingestion private endpoints by providing details for **Subscription**, **Virtual network**, and **Subnet** that you want to pair with your private endpoint.

   :::image type="content" source="media/catalog-private-link/create-pe-azure-portal.png" alt-text="Screenshot that shows creating a private endpoint in the Azure portal.":::

3. Optionally, set up a **Private DNS zone** for each ingestion private endpoint. It is important to select correct Azure Private DNS Zones to allow correct name resolution between Azure Purview and data sources. 

4. Optionally, create account and portal private endpoints. 
   1. On the **Create a private endpoint** page, for **Purview sub-resource**, choose your location, virtual network and subnet for private endpoint, select **account** and select the private DNS zone where the DNS will be registered. You can also use your own DNS servers or create DNS records by using host files on your virtual machines. For more information, see [Configure DNS Name Resolution for private endpoints](./catalog-private-link-name-resolution.md)

    :::image type="content" source="media/catalog-private-link/create-pe-account.png" alt-text="Screenshot that shows Create private endpoint page selections.":::

   2. Select **OK**.

   3. In Create Purview account wizard, select **+Add** again to add _portal_ private endpoint.
     
   4. On the **Create a private endpoint** page, for **Purview sub-resource**, choose your location, virtual network and subnet for private endpoint, select select **portal** and select the private DNS zone where the DNS will be registered. You can also use your own DNS servers or create DNS records by using host files on your virtual machines. For more information, see [Configure DNS Name Resolution for private endpoints](./catalog-private-link-name-resolution.md)

    :::image type="content" source="media/catalog-private-link/create-pe-portal.png" alt-text="Screenshot that shows Create private endpoint page selections.":::

5. Select **OK**.
   
6.  Select **Review + Create**. On the **Review + Create** page, Azure validates your configuration.

7.  When you see the "Validation passed" message, select **Create**.

    :::image type="content" source="media/catalog-private-link/validation-passed.png" alt-text="Screenshot that shows that validation passed for account creation.":::

## Option 2 - Enable _ingestion_ private endpoint on existing Azure Purview accounts

1. Go to the Azure Purview account from the Azure portal, and under **Settings** > **Networking**, select **Private endpoint connections**.

2. Go to the **Ingestion private endpoint connections** tab, and select **+ New** to create a new ingestion private endpoint.

3. Fill in the basic information, selecting your existing virtual network and a subnet details. Optionally, select **Private DNS integration** to use Azure Private DNS Zones. Select correct Azure Private DNS Zones from each list.

   :::image type="content" source="media/catalog-private-link/ingestion-pe-fill-details.png" alt-text="Screenshot that shows filling in private endpoint details.":::

4. Select **Create** to finish the setup.

> [!NOTE]
> Ingestion private endpoints can be created only via the Azure Purview portal experience described in the preceding steps. They can't be created from the Private Link Center.

## Scan the source by using a self-hosted integration runtime (IR).

    1. All on-premises source types like Azure SQL Server, Oracle, SAP, and others are currently supported only via self-hosted IR-based scans. The self-hosted IR must run within your private network and then be peered with your virtual network in Azure. Follow [these steps](#create-an-ingestion-private-endpoint) to enable your Azure virtual network on your ingestion private endpoint.

    2. For all Azure source types like Azure Blob Storage and Azure SQL Database, you must explicitly choose to run the scan by using a self-hosted IR to ensure network isolation. Follow the steps in [Create and manage a self-hosted integration runtime](manage-integration-runtimes.md) to set up a self-hosted IR. Then set up your scan on the Azure source by choosing that self-hosted IR in the **Connect via integration runtime** dropdown list to ensure network isolation.
    
       :::image type="content" source="media/catalog-private-link/shir-for-azure.png" alt-text="Screenshot that shows running an Azure scan by using self-hosted IR.":::

> [!NOTE]
> When you use a private endpoint for ingestion, you can use an Azure integration runtime for scanning only for the following data sources:
>
> - Azure Blob Storage
> - Azure Data Lake Gen 2
>
> For other data sources, a self-hosted IR is required. We currently don't support the MSI credential method when you scan your Azure sources by using a self-hosted IR. You must use one of the other supported credential methods for that Azure source.

## Next steps

- [Deploy account and portal private endpoints for Azure Purview Account](catalog-private-link-account-portal.md)
- 