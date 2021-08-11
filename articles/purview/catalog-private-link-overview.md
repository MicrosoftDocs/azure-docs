---
title: Use private endpoints for secure access to Purview
description: This article describes a high level overview of how you can use a private end point for your Purview account
author: viseshag
ms.author: viseshag
ms.service: purview
ms.subservice: purview-data-catalog-overview
ms.topic: how-to
ms.date: 08/11/2021
# Customer intent: As a Purview admin, I want to set up private endpoints for my Purview account, for secure access.
---

# Use private endpoints for your Azure Purview account

This article describes how to configure private endpoints for Azure Purview.

## Conceptual Overview
You can use [Azure private endpoints](../private-link/private-endpoint-overview.md) for your Azure Purview accounts to allow users on a virtual network (VNet) to securely access the catalog over a Private Link. A private endpoint uses an IP address from the VNet address space for your Purview account. Network traffic between the clients on the VNet and the Purview account traverses over the VNet and a private link on the Microsoft backbone network. 

You can deploy Azure Purview _account_ private endpoint, to allow only client calls to Azure Purview that originate from within the private network.

To connect to Azure Purview Studio using a private network connectivity, you can deploy _portal_ private endpoint.

You can deploy _ingestion_ private endpoints if you need to scan Azure IaaS and PaaS data sources inside Azure virtual networks and on-premises data sources through a private connection. This method ensures network isolation for your metadata flowing from the data sources to Azure Purview Data Map.

:::image type="content" source="media/catalog-private-link/purview-private-link-overview.png" alt-text="Screenshot that shows Azure Purview with Private Endpoints."::: 

> [!TIP]
> If you want to restrict access to your Purview Studio through the private endpoint only, create account, portal and ingestion private endpoints and set Public network access to deny in your Azure Purview account.

## Prerequisites

Before deploying private endpoints for Azure Purview account, ensure you meet the following prerequisites:

1. An Azure account with an active subscription. [Create an account for free.](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
<br>
2. An existing [Azure virtual network](../virtual-network/quick-create-portal.md).
<br>

## Azure Purview private endpoint deployment checklist

|Task |Description |
|-------------|----------|
|Select an appropriate Azure virtual network |<ul><li>Setup a new Azure Virtual Network</li><li>Select a existing Azure Virtual Network</li></ul>|
|Define your DNS name resolution strategy |<ul><li>Setup new Azure Private DNS Zones </li><li>Select existing Azure DNS Zones</li><li>Add required DNS A records manually inside your own DNS zones</li></ul>|
|[Deploy ingestion private endpoints](./catalog-private-link-ingestion.md) |This step is required if private connectivity between Azure Purview and data sources is required for ingestion scenarios such as scanning data sources inside Azure virtual networks or an on-premises network.| 
|[Deploy _account_ private endpoint](./catalog-private-link-account-portal.md) |This step is required if you are planning to restrict API calls to your Azure Purview account only through private network connectivity. |
|[Deploy _portal_ private endpoint](./catalog-private-link-account-portal.md) |This step is required if you are planning to restrict access to Azure Purview Studio through private network connectivity.|
|[Configure DNS Name Resolution](./catalog-private-link-name-resolution.md)  |It is important to correctly configure your DNS settings to resolve IP address based on private IP addresses between user's machine and Purview, Azure Purview and data sources to the fully qualified domain name (FQDN) of the connection string.|
|Setup self-hosted integration runtime |Deploy and register Self-hosted integration runtime inside the same VNet where Azure Purview ingestion private endpoints are deployed. |
|Test connectivity and name resolution |Test connectivity and name resolution to ensure correct configuration of the previous steps.|
|Register and scan data sources|Register and scan Azure or on-premises data sources through private connectivity.|

## Support Matrix
For scenarios where _ingestion_ private endpoint is used in your Azure Purview account, and public access on your data sources is disabled, Azure Purview can scan the following data sources that are behind a private endpoint:

|Data source behind a private endpoint  |Integration runtime type  |Credential type  |
|---------|---------|---------|
|Row1     |         |         |
|Row2     |         |         |
|Row3     |         |         |
|Row4     |         |         |
|Row5     |         |         |
|Row6     |         |         |
|Row7     |         |         |
|Row8     |         |         |
|Row9     |         |         |
|Row10     |         |         |



## Frequently Asked Questions  

For FAQs related to private endpoint deployments in Azure Purview, see [FAQ about Azure Purview private endpoints](./catalog-private-link-faqs.md).
 
## Troubleshooting guide 
For troubleshooting private endpoint configuration for Purview accounts, see [Troubleshooting private endpoint configuration for Purview accounts](./catalog-private-link-troubleshooting.md).

## Known limitations

- We currently do not support ingestion private endpoints that work with your AWS sources.
- Scanning Azure Multiple Sources using self-hosted integration runtime is not supported.
- Using Azure Portal, The ingestion private endpoints can be created via the Azure Purview portal experience described in the preceding steps. They can't be created from the Private Link Center.
- Creating DNS A records for ingestion private endpoints inside existing Azure DNS Zones, while the Azure Private DNS Zones are located in a different subscription than the private endpoints is not supported via the Azure Purview portal experience. A records can be added manually in the destination DNS Zones in the other subscription. 
- Self-hosted integration runtime machine must be deployed in the same VNet where Azure Purview ingestion private endpoint is deployed.
- For limitation related to Private Link service, see [Azure Private Link limits](../azure-resource-manager/management/azure-subscription-service-limits.md#private-link-limits).

## Next steps

- [Deploy ingestion private endpoints ](./catalog-private-link-ingestion.md)
