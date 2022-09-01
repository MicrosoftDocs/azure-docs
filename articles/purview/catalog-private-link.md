---
title: Use private endpoints for secure access to Microsoft Purview
description: This article describes a high level overview of how you can use a private end point for your Microsoft Purview account
author: viseshag
ms.author: viseshag
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 01/10/2022
# Customer intent: As a Microsoft Purview admin, I want to set up private endpoints for my Microsoft Purview account, for secure access.
---

# Use private endpoints for your Microsoft Purview account

This article describes how to configure private endpoints for Microsoft Purview.

## Conceptual Overview
You can use [Azure private endpoints](../private-link/private-endpoint-overview.md) for your Microsoft Purview accounts to allow users on a virtual network (VNet) to securely access the catalog over a Private Link. A private endpoint uses an IP address from the VNet address space for your Microsoft Purview account. Network traffic between the clients on the VNet and the Microsoft Purview account traverses over the VNet and a private link on the Microsoft backbone network. 

You can deploy Microsoft Purview _account_ private endpoint, to allow only client calls to Microsoft Purview that originate from within the private network.

To connect to the Microsoft Purview governance portal using a private network connectivity, you can deploy _portal_ private endpoint.

You can deploy _ingestion_ private endpoints if you need to scan Azure IaaS and PaaS data sources inside Azure virtual networks and on-premises data sources through a private connection. This method ensures network isolation for your metadata flowing from the data sources to Microsoft Purview Data Map.

:::image type="content" source="media/catalog-private-link/purview-private-link-overview.png" alt-text="Screenshot that shows Microsoft Purview with Private Endpoints."::: 

## Prerequisites

Before deploying private endpoints for Microsoft Purview account, ensure you meet the following prerequisites:

1. An Azure account with an active subscription. [Create an account for free.](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
<br>
2. An existing Azure Virtual network. Deploy a new [Azure virtual network](../virtual-network/quick-create-portal.md) if you do not have one.
<br>

## Microsoft Purview private endpoint deployment scenarios

Use the following recommended checklist to perform deployment of Microsoft Purview account with private endpoints:

|Scenario  |Objectives  |
|---------|---------|
|**Scenario 1** - [Connect to your Microsoft Purview and scan data sources privately and securely](./catalog-private-link-end-to-end.md) |You need to restrict access to your Microsoft Purview account only via a private endpoint, including access to the Microsoft Purview governance portal, Atlas APIs and scan data sources in on-premises and Azure behind a virtual network using self-hosted integration runtime ensuring end to end network isolation. (Deploy _account_, _portal_ and _ingestion_ private endpoints.)   |
|**Scenario 2** - [Connect privately and securely to your Microsoft Purview account](./catalog-private-link-account-portal.md)   | You need to enable access to your Microsoft Purview account, including access to _the Microsoft Purview governance portal_ and Atlas API through private endpoints. (Deploy _account_ and _portal_ private endpoints).   |
|**Scenario 3** - [Scan data source securely using Managed Virtual Network](./catalog-managed-vnet.md)   | You need to scan Azure data sources securely, without having to manage a virtual network or a self-hosted integration runtime VM. (Deploy managed private endpoint for Microsoft Purview, managed storage account and Azure data sources).   |


## Support matrix for Scanning data sources through _ingestion_ private endpoint

For scenarios where _ingestion_ private endpoint is used in your Microsoft Purview account, and public access on your data sources is disabled, Microsoft Purview can scan the following data sources that are behind a private endpoint:

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
|Power BI tenant (Same tenant) |Self-Hosted IR| Delegated Auth|

## Frequently Asked Questions  

For FAQs related to private endpoint deployments in Microsoft Purview, see [FAQ about Microsoft Purview private endpoints](./catalog-private-link-faqs.md).
 
## Troubleshooting guide 
For troubleshooting private endpoint configuration for Microsoft Purview accounts, see [Troubleshooting private endpoint configuration for Microsoft Purview accounts](./catalog-private-link-troubleshoot.md).

## Known limitations
To view list of current limitations related to Microsoft Purview private endpoints, see [Microsoft Purview private endpoints known limitations](./catalog-private-link-troubleshoot.md#known-limitations).

## Next steps

- [Deploy end to end private networking](./catalog-private-link-end-to-end.md)
- [Deploy private networking for the Microsoft Purview governance portal](./catalog-private-link-account-portal.md)
