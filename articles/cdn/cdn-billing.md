---
title: Understanding Azure Content Delivery Network billing
description: Learn about the billing structure for content hosted by Azure Content Delivery Network, including billing regions, delivery charges, and to manage costs.
services: cdn
author: duongau
manager: kumudd
ms.service: azure-cdn
ms.topic: article
ms.date: 03/20/2024
ms.author: duau
---

# Understanding Azure Content Delivery Network billing

This FAQ describes the billing structure for content hosted by Azure Content Delivery Network.

## What is a billing region?

A billing region is a geographic area used to determine what rate is charged for delivery of objects from Azure Content Delivery Network. The current billing zones and their regions are as follows:

- Zone 1: North America, Europe, Middle East, and Africa

- Zone 2: Asia Pacific (including Japan)

- Zone 3: South America

- Zone 4: Australia and New Zealand

- Zone 5: India

For information about point of presence (POP) regions, see [Azure Content Delivery Network POP locations by region](./cdn-pop-locations.md). For example, a POP located in Mexico is in the North America region and is therefore included in zone 1.

For information about Azure Content Delivery Network pricing, see [Content Delivery Network pricing](https://azure.microsoft.com/pricing/details/cdn/).

## How are delivery charges calculated by region?

The Azure content delivery network billing region is based on the location of the source server delivering the content to the end user. The destination (physical location) of the client isn't considered the billing region.

For example, if a user located in Mexico issues a request and this request gets serviced by a server located in a United States POP due to peering or traffic conditions, the billing region is the United States.

<a name='what-is-a-billable-azure-cdn-transaction'></a>

## What is a billable Azure Content Delivery Network transaction?

Any HTTP(S) request that terminates at the content delivery network is a billable event, which includes all response types: success, failure, or other. However, different responses might generate different traffic amounts. For example, *304 Not Modified* and other header-only responses generate little traffic because they're a small header response. Similarly, error responses (for example, *404 Not Found*) are billable but incur a small cost because of the tiny response payload.

<a name='what-other-azure-costs-are-associated-with-azure-cdn-use'></a>

## What other Azure costs are associated with Azure Content Delivery Network use?

Using Azure Content Delivery Network also incurs some usage charges on the services used as the origin for your objects. These costs are typically a small fraction of the overall content delivery network usage cost.

If you're using Azure Blob storage as the origin for your content, you also incur the following storage charges for cache fills:

- Actual GB used: The actual storage of your source objects.

- Transactions: As needed to fill the cache.

- Transfers in GB: The amount of data transferred to fill the content delivery network caches.

> [!NOTE]
> Starting October 2019, if you are using Azure Content Delivery Network from Microsoft, the cost of data transfer from origins hosted in Azure to content delivery network PoPs is free of charge. Azure Content Delivery Network from Edgio is subject to the rates described as followed.

For more information about Azure Storage billing, see [Plan and manage costs for Azure Storage](../storage/common/storage-plan-manage-costs.md).

If you're using *hosted service delivery*, you incur charges as follows:

- Azure compute time: The compute instances that act as the origin.

- Azure compute transfer: The data transfers from the compute instances to fill the Azure Content Delivery Network caches.

If your client uses byte-range requests (regardless of origin service), the following considerations apply:

- A *byte-range request* is a billable transaction at the content delivery network. When a client issues a byte-range request, this request is for a subset (range) of the object. The content delivery network responds with only a partial portion of the content that is requested. This partial response is a billable transaction and the transfer amount is limited to the size of the range response (plus headers).

- When a request arrives for only part of an object (by specifying a byte-range header), the content delivery network might fetch the entire object into its cache. As a result, even though the billable transaction from the content delivery network is for a partial response, the billable transaction from the origin might involve the full size of the object.

## How much transfer activity occurs to support the cache?

Each time a content delivery network POP needs to fill its cache, it makes a request to the origin for the object being cached. As a result, the origin incurs a billable transaction on every cache miss. The number of cache misses depends on many factors:

- How cacheable the content is: If the content has high TTL (time to live)/expiration values and is accessed frequently so it stays popular in cache, then most of the load gets handled by the content delivery network. A typical good cache-hit ratio is well over 90%, meaning that less than 10% of client requests have to return to origin, either for a cache miss or object refresh.

- How many nodes need to load the object: Each time a node loads an object from the origin, it incurs a billable transaction. As a result, more global content (accessed from more nodes) results in more billable transactions.

- TTL influence: A higher TTL for an object means it needs to be fetched from the origin less frequently. It also means clients, such as browsers, can cache the object longer, which can reduce the transactions to the content delivery network.

<a name='which-origin-services-are-eligible-for-free-data-transfer-with-azure-cdn-from-microsoft'></a>

## Which origin services are eligible for free data transfer with Azure Content Delivery Network from Microsoft?

If you use one of the following Azure services as your content delivery network origin, you don't get charged from Data transfer from the Origin to the content delivery network PoPs.

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
- Azure Front Door
- Azure Bastion
- Azure App Service
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
