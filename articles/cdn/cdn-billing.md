---
title: Understanding Azure CDN billing | Microsoft Docs
description: This FAQ describes how Azure CDN billing works.
services: cdn
documentationcenter: ''
author: mdgattuso
manager: danielgi
editor: ''

ms.assetid: 
ms.service: azure-cdn
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/20/2018
ms.author: magattus

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

For information about point-of-presence (POP) regions, see [Azure CDN POP locations by region](https://docs.microsoft.com/azure/cdn/cdn-pop-locations). For example, a POP located in Mexico is in the North America region and is therefore included in zone 1. 

For information about Azure CDN pricing, see [Content Delivery Network pricing](https://azure.microsoft.com/pricing/details/cdn/).

## How are delivery charges calculated by region?
The Azure CDN billing region is based on the location of the source server delivering the content to the end user. The destination (physical location) of the client is not considered the billing region.

For example, if a user located in Mexico issues a request and this request is serviced by a server located in a United States POP due to peering or traffic conditions, the billing region will be the United States.

## What is a billable Azure CDN transaction?
Any HTTP(S) request that terminates at the CDN is a billable event, which includes all response types: success, failure, or other. However, different responses may generate different traffic amounts. For example, *304 Not Modified* and other header-only responses generate little traffic because they are a small header response; similarly, error responses (for example, *404 Not Found*) are billable but incur a small cost because of the tiny response payload.

## What other Azure costs are associated with Azure CDN use?
Using Azure CDN also incurs some usage charges on the services used as the origin for your objects. These costs are typically a small fraction of the overall CDN usage cost.

If you are using Azure Blob storage as the origin for your content, you also incur the following storage charges for cache fills:

- Actual GB used: The actual storage of your source objects.

- Transfers in GB: The amount of data transferred to fill the CDN caches.

- Transactions: As needed to fill the cache.

For more information about Azure Storage billing, see [Understanding Azure Storage Billing – Bandwidth, Transactions, and Capacity](https://blogs.msdn.microsoft.com/windowsazurestorage/2010/07/08/understanding-windows-azure-storage-billing-bandwidth-transactions-and-capacity/).

If you are using *hosted service delivery*, you will incur charges as follows:

- Azure compute time: The compute instances that act as the origin.

- Azure compute transfer: The data transfers from the compute instances to fill the Azure CDN caches.

If your client uses byte-range requests (regardless of origin service), the following considerations apply:

- A *byte-range request* is a billable transaction at the CDN. When a client issues a byte-range request, this request is for a subset (range) of the object. The CDN responds with only a partial portion of the content that is requested. This partial response is a billable transaction and the transfer amount is limited to the size of the range response (plus headers).

- When a request arrives for only part of an object (by specifying a byte-range header), the CDN may fetch the entire object into its cache. As a result, even though the billable transaction from the CDN is for a partial response, the billable transaction from the origin may involve the full size of the object.

## How much transfer activity occurs to support the cache?
Each time a CDN POP needs to fill its cache, it makes a request to the origin for the object being cached. As a result, the origin incurs a billable transaction on every cache miss. The number of cache misses depends on a number of factors:

- How cacheable the content is: If the content has high TTL (time-to-live)/expiration values and is accessed frequently so it stays popular in cache, then the vast majority of the load is handled by the CDN. A typical good cache-hit ratio is well over 90%, meaning that less than 10% of client requests have to return to origin, either for a cache miss or object refresh.

- How many nodes need to load the object: Each time a node loads an object from the origin, it incurs a billable transaction. As a result, more global content (accessed from more nodes) results in more billable transactions.

- TTL influence: A higher TTL for an object means it needs to be fetched from the origin less frequently. It also means clients, such as browsers, can cache the object longer, which can reduce the transactions to the CDN.

## How do I manage my costs most effectively?
Set the longest TTL possible on your content. 
