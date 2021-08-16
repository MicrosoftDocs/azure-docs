---
title: Use private endpoints for secure access to Purview
description: This article describes a high level overview of how you can use a private end point for your Purview account
author: viseshag
ms.author: viseshag
ms.service: purview
ms.subservice: purview-data-catalog-overview
ms.topic: how-to
ms.date: 08/16/2021
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
|**Scenario 1** - [Connect to your Purview account from restricted network](./catalog-private-link-account-portal.md)   | You need to enable access to your Azure Purview account, including access to _Azure Purview Studio_ and Atlas API through private endpoints. (Deploy _account_ and _portal_ private endpoints).   |
|**Scenario 2** - [Scan data sources from restricted network](./catalog-private-link-ingestion.md)  | You need to scan data sources in on-premises and Azure behind a virtual network using self-hosted integration runtime. (Deploy _ingestion_ private endpoints.)    |
|**Scenario 3** - [Connect to your Purview account and scan data sources from restricted network for an end to end isolation](./catalog-private-link-end-to-end.md) |You need to restrict access to your Azure Purview account only via a private endpoint, including access to Azure Purview Studio, Atlas APIs and scan data sources in on-premises and Azure behind a virtual network using self-hosted integration runtime ensuring end to end network isolation. (Deploy _account_, _portal_ and _ingestion_ private endpoints.)   |

## Scanning data sources through _ingestion_ private endpoints support matrix
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

## Frequently Asked Questions  

For FAQs related to private endpoint deployments in Azure Purview, see [FAQ about Azure Purview private endpoints](./catalog-private-link-faqs.md).
 
## Troubleshooting guide 
For troubleshooting private endpoint configuration for Purview accounts, see [Troubleshooting private endpoint configuration for Purview accounts](./catalog-private-link-troubleshooting.md).

## Known limitations
To view list of current limitations related to Azure Purview private endpoints, see [Azure Purview private endpoints known limitations](./catalog-private-link-troubleshooting.md#known-limitations).

## Next steps

- [Deploy ingestion private endpoints ](./catalog-private-link-ingestion.md)
