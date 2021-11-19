---
title: Use private endpoints for secure access to Purview
description: This article describes a high level overview of how you can use a private end point for your Purview account
author: viseshag
ms.author: viseshag
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 10/19/2021
# Customer intent: As a Purview admin, I want to set up private endpoints for my Purview account, for secure access.
---

# Use private endpoints for your Azure Purview account

> [!IMPORTANT]
> If you created a _portal_ private endpoint for your Purview account **prior to 27 September 2021 at 15:30 UTC**, you'll need to take the required actions as detailed in, [Reconfigure DNS for portal private endpoints](#reconfigure-dns-for-portal-private-endpoints). **These actions must be completed before November 12, 2021. Failing to do so will cause existing portal private endpoints to stop functioning**.


This article describes how to configure private endpoints for Azure Purview.

## Conceptual Overview
You can use [Azure private endpoints](../private-link/private-endpoint-overview.md) for your Azure Purview accounts to allow users on a virtual network (VNet) to securely access the catalog over a Private Link. A private endpoint uses an IP address from the VNet address space for your Purview account. Network traffic between the clients on the VNet and the Purview account traverses over the VNet and a private link on the Microsoft backbone network. 

You can deploy Azure Purview _account_ private endpoint, to allow only client calls to Azure Purview that originate from within the private network.

To connect to Azure Purview Studio using a private network connectivity, you can deploy _portal_ private endpoint.

You can deploy _ingestion_ private endpoints if you need to scan Azure IaaS and PaaS data sources inside Azure virtual networks and on-premises data sources through a private connection. This method ensures network isolation for your metadata flowing from the data sources to Azure Purview Data Map.

:::image type="content" source="media/catalog-private-link/purview-private-link-overview.png" alt-text="Screenshot that shows Azure Purview with Private Endpoints."::: 

## Prerequisites

Before deploying private endpoints for Azure Purview account, ensure you meet the following prerequisites:

1. An Azure account with an active subscription. [Create an account for free.](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
<br>
2. An existing Azure Virtual network. Deploy a new [Azure virtual network](../virtual-network/quick-create-portal.md) if you do not have one.
<br>

## Azure Purview private endpoint deployment scenarios

Use the following recommended checklist to perform deployment of Azure Purview account with private endpoints:

|Scenario  |Objectives  |
|---------|---------|
|**Scenario 1** - [Connect to your Azure Purview and scan data sources privately and securely](./catalog-private-link-end-to-end.md) |You need to restrict access to your Azure Purview account only via a private endpoint, including access to Azure Purview Studio, Atlas APIs and scan data sources in on-premises and Azure behind a virtual network using self-hosted integration runtime ensuring end to end network isolation. (Deploy _account_, _portal_ and _ingestion_ private endpoints.)   |
|**Scenario 2** - [Connect privately and securely to your Purview account](./catalog-private-link-account-portal.md)   | You need to enable access to your Azure Purview account, including access to _Azure Purview Studio_ and Atlas API through private endpoints. (Deploy _account_ and _portal_ private endpoints).   |

## Support matrix for Scanning data sources through _ingestion_ private endpoint

For scenarios where _ingestion_ private endpoint is used in your Azure Purview account, and public access on your data sources is disabled, Azure Purview can scan the following data sources that are behind a private endpoint:

|Data source behind a private endpoint  |Integration runtime type  |Credential type  |
|---------|---------|---------|
|Azure Blob Storage | Self-Hosted IR | Service Principal|
|Azure Blob Storage | Self-Hosted IR | Account Key|
|Azure Data Lake Storage Gen 2 | Self-Hosted IR| Service Principal|
|Azure Data Lake Storage Gen 2 | Self-Hosted IR| Account Key|
|Azure SQL Database | Self-Hosted IR| SQL Authentication|
|Azure SQL Database | Self-Hosted IR| Service Principal|
|Azure SQL Managed Instance | Self-Hosted IR| SQL Authentication|
|Azure Cosmos DB| Self-Hosted IR| Account Key|
|SQL Server | Self-Hosted IR| SQL Authentication|
|Azure Synapse Analytics | Self-Hosted IR| Service Principal|
|Azure Synapse Analytics | Self-Hosted IR| SQL Authentication|

## Reconfigure DNS for portal private endpoints

If you created a _portal_ private endpoint for your Purview account **prior to 27 September 2021 at 15:30 UTC**, take the required actions as detailed in this section.

### Review your current DNS settings

1. From Azure portal, locate your Purview account. From left hand menu click on **Networking**, select **Private Endpoint connections**. Click on each private endpoint in the list and follow the steps below.

    :::image type="content" source="media/catalog-private-link/purview-pe-dns-updates-1.png" alt-text="Screenshot that shows purview private endpoint."lightbox="media/catalog-private-link/purview-pe-dns-updates-1.png":::

2. If target sub-resource is _portal_, review **DNS configuration**, otherwise go back to previous step, and select the next private endpoint until you reviewed all of the private endpoints and have validated all of the private endpoints associated with the portal.

    :::image type="content" source="media/catalog-private-link/purview-pe-dns-updates-2.png" alt-text="Screenshot that shows portal purview private endpoint."lightbox="media/catalog-private-link/purview-pe-dns-updates-2.png":::

3. In the **DNS configuration** window verify the current settings:
   
    - If there are any records in the **Custom DNS records** section, follow steps in [Remediation scenarios 1](#scenario-1) and [Remediation scenario 2](#scenario-2).
    
        :::image type="content" source="media/catalog-private-link/purview-pe-dns-updates-3.png" alt-text="Screenshot that shows portal purview private endpoint custom DNS configuration."lightbox="media/catalog-private-link/purview-pe-dns-updates-3.png":::

    - If there are any records in the **Configuration name** section and If the DNS zone is `privatelink.purviewstudio.azure.com`, no action is required for this private endpoint. Go back to **step 1** and review remaining portal private endpoints.
  
        :::image type="content" source="media/catalog-private-link/purview-pe-dns-updates-4.png" alt-text="Screenshot that shows portal purview private endpoint with new DNS zone."lightbox="media/catalog-private-link/purview-pe-dns-updates-4.png":::
    
    - If there are any records in the **Configuration name** section and If the DNS zone is `privatelink.purview.azure.com`, follow steps in [Remediation scenario 3](#scenario-3).

        :::image type="content" source="media/catalog-private-link/purview-pe-dns-updates-5.png" alt-text="Screenshot that shows portal purview private endpoint with old DNS zone."lightbox="media/catalog-private-link/purview-pe-dns-updates-5.png":::

### Remediation scenarios

#### Scenario 1

If you **have added required DNS A records directly to your DNS or machines' host file**, **no action is required**.
    
:::image type="content" source="media/catalog-private-link/purview-pe-dns-updates-host.png" alt-text="Screenshot that shows host file with A records."lightbox="media/catalog-private-link/purview-pe-dns-updates-host.png":::

#### Scenario 2

If you **have configured on-premises DNS Servers**, **DNS Forwarders or custom DNS resolution**, review your DNS settings and take proper actions:

1. Review your DNS Server. if your DNS record is `web.purview.azure.com`, or if your conditional forwarder is `purview.azure.com`, **no action is required**. 

2. If your DNS record is `web.privatelink.purview.azure.com`, update the record to `web.privatelink.purviewstudio.azure.com`.

3. If your conditional forwarder is `privatelink.purview.azure.com`, DO NOT REMOVE the zone. You are required to add a new conditional forwarder to `privatelink.purviewstudio.azure.com`.

#### Scenario 3

If you have configured **Azure Private DNS Zone integration for your Purview account**, follow these steps to redeploy private endpoints to reconfigure DNS settings:

1. Deploy a new portal private endpoint:
       
    1. Go to the [Azure portal](https://portal.azure.com), and then click on to your Azure Purview account, and under **Settings** select **Networking**, and then select **Private endpoint connections**.

        :::image type="content" source="media/catalog-private-link/purview-pe-reconfigure-portal.png" alt-text="Screenshot that shows creating a portal private endpoint."lightbox="media/catalog-private-link/purview-pe-reconfigure-portal.png":::

    2. Select **+ Private endpoint** to create a new private endpoint.

    3. Fill in the basic information.

    4. On the **Resource** tab, for **Resource type**, select **Microsoft.Purview/account**.

    5. For **Resource**, select the Azure Purview account, and for **Target sub-resource**, select **portal**.

    6. On the **Configuration** tab, select the virtual network and then, select Azure Private DNS zone to create a new Azure DNS Zone.
            
        :::image type="content" source="media/catalog-private-link/purview-pe-reconfigure-portal-dns.png" alt-text="Screenshot that shows creating a portal private endpoint and DNS settings."lightbox="media/catalog-private-link/purview-pe-reconfigure-portal-dns.png":::

    7. Go to the summary page, and select **Create** to create the portal private endpoint.

2. Delete the previous portal private endpoint associated with the Purview account. 

3. Ensure that a new Azure Private DNS Zone `privatelink.purviewstudio.azure.com` is created during the deployment of the portal private endpoint, and that a corresponding A record (web) exists in the Private DNS Zone. 
    
4. Ensure you are able to successfully load Azure Purview Studio. It might take a few minutes (about 10 minutes) for the new DNS routing to take effect after reconfiguring DNS. You can wait a few minutes and try again, if it doesn't load immediately.
    
5. If navigation fails, perform nslookup web.purview.azure.com, which should resolve to a private IP address that's associated to the portal private endpoint.
  
6. Repeat steps 1 through 3 above for all existing portal private endpoints that you have. 

### Validation steps

1. Ensure you are able to successfully load Azure Purview Studio. It might take a few minutes (about 10 minutes) for the new DNS routing to take effect after reconfiguring DNS. You can wait a few minutes and try again, if it doesn't load immediately.

2. If navigation fails, perform nslookup `web.purview.azure.com`, which should resolve to a private IP address that's associated to the portal private endpoint.

## Frequently Asked Questions  

For FAQs related to private endpoint deployments in Azure Purview, see [FAQ about Azure Purview private endpoints](./catalog-private-link-faqs.md).
 
## Troubleshooting guide 
For troubleshooting private endpoint configuration for Purview accounts, see [Troubleshooting private endpoint configuration for Purview accounts](./catalog-private-link-troubleshoot.md).

## Known limitations
To view list of current limitations related to Azure Purview private endpoints, see [Azure Purview private endpoints known limitations](./catalog-private-link-troubleshoot.md#known-limitations).

## Next steps

- [Deploy end to end private networking](./catalog-private-link-end-to-end.md)
- [Deploy private networking for the Purview Studio](./catalog-private-link-account-portal.md)
