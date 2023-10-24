---
title: Understanding Azure CDN billing | Microsoft Docs
description: Learn about the billing structure for content hosted by Azure Content Delivery Network, including billing regions, delivery charges, and to manage costs.
services: cdn
author: duongau
manager: kumudd
ms.service: azure-cdn
ms.workload: media
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 02/27/2023
ms.author: duau

---
# Understanding Azure CDN billing

This FAQ describes the billing structure for content hosted by Azure Content Delivery Network (CDN).

## What is a billing region?

A billing region is a geographic area used to determine what rate is charged for delivery of objects from Azure CDN. The current billing zones and their regions are as follows:

- Zone 1: North America, Europe, Middle East, and Africa

- Zone 2: Asia Pacific (including Japan)

- Zone 3: South America

- Zone 4: Australia and New Zealand

- Zone 5: India

For information about point-of-presence (POP) regions, see [Azure CDN POP locations by region](./cdn-pop-locations.md). For example, a POP located in Mexico is in the North America region and is therefore included in zone 1. 

For information about Azure CDN pricing, see [Content Delivery Network pricing](https://azure.microsoft.com/pricing/details/cdn/).

## How are delivery charges calculated by region?
The Azure CDN billing region is based on the location of the source server delivering the content to the end user. The destination (physical location) of the client isn't considered the billing region.

For example, if a user located in Mexico issues a request and this request gets serviced by a server located in a United States POP due to peering or traffic conditions, the billing region is the United States.

## What is a billable Azure CDN transaction?
Any HTTP(S) request that terminates at the CDN is a billable event, which includes all response types: success, failure, or other. However, different responses may generate different traffic amounts. For example, *304 Not Modified* and other header-only responses generate little traffic because they're a small header response. Similarly, error responses (for example, *404 Not Found*) are billable but incur a small cost because of the tiny response payload.

## What other Azure costs are associated with Azure CDN use?
Using Azure CDN also incurs some usage charges on the services used as the origin for your objects. These costs are typically a small fraction of the overall CDN usage cost.

If you're using Azure Blob storage as the origin for your content, you also incur the following storage charges for cache fills:

- Actual GB used: The actual storage of your source objects.

- Transactions: As needed to fill the cache.

- Transfers in GB: The amount of data transferred to fill the CDN caches.

> [!NOTE]
> Starting October 2019, If you are using Azure CDN from Microsoft, the cost of data transfer from Origins hosted in Azure to CDN PoPs is free of charge. Azure CDN from Edgio and Azure CDN from Akamai are subject to the rates described as followed.

For more information about Azure Storage billing, see [Plan and manage costs for Azure Storage](../storage/common/storage-plan-manage-costs.md).

If you're using *hosted service delivery*, you incur charges as follows:

- Azure compute time: The compute instances that act as the origin.

- Azure compute transfer: The data transfers from the compute instances to fill the Azure CDN caches.

If your client uses byte-range requests (regardless of origin service), the following considerations apply:

- A *byte-range request* is a billable transaction at the CDN. When a client issues a byte-range request, this request is for a subset (range) of the object. The CDN responds with only a partial portion of the content that is requested. This partial response is a billable transaction and the transfer amount is limited to the size of the range response (plus headers).

- When a request arrives for only part of an object (by specifying a byte-range header), the CDN may fetch the entire object into its cache. As a result, even though the billable transaction from the CDN is for a partial response, the billable transaction from the origin may involve the full size of the object.

## How much transfer activity occurs to support the cache?
Each time a CDN POP needs to fill its cache, it makes a request to the origin for the object being cached. As a result, the origin incurs a billable transaction on every cache miss. The number of cache misses depends on many factors:

- How cacheable the content is: If the content has high TTL (time-to-live)/expiration values and is accessed frequently so it stays popular in cache, then most of the load gets handled by the CDN. A typical good cache-hit ratio is well over 90%, meaning that less than 10% of client requests have to return to origin, either for a cache miss or object refresh.

- How many nodes need to load the object: Each time a node loads an object from the origin, it incurs a billable transaction. As a result, more global content (accessed from more nodes) results in more billable transactions.

- TTL influence: A higher TTL for an object means it needs to be fetched from the origin less frequently. It also means clients, such as browsers, can cache the object longer, which can reduce the transactions to the CDN.

## Which origin services are eligible for free data transfer with Azure CDN from Microsoft? 
If you use one of the following Azure services as your CDN origin, you don't get charged from Data transfer from the Origin to the CDN PoPs. 

- Azure Storage
- Azure Media Services
- Azure Virtual Machines
- Virtual Network
- Load Balancer
- Application Gateway
- Azure DNS
- ExpressRoute
- VPN Gateway
- Traffic Manager
- Network Watcher
- Azure Firewall
- Azure Front Door Service
- Azure Bastion
- Azure App service
- Azure Functions
- Azure Data Factory
- Azure API Management
- Azure Batch 
- Azure Data Explorer
- HDInsight
- Azure Cosmos DB
- Azure Data Lake Store
- Azure Machine Learning 
- Azure SQL Database
- Azure SQL Managed Instance
- Azure Cache for Redis

## How do I manage my costs most effectively?
Set the longest TTL possible on your content.
