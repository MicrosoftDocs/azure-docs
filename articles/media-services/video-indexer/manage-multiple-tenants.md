---
title: Manage multiple tenants with Video Indexer - Azure 
description: This article suggests different integration options for managing multiple tenants with Video Indexer.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.custom: 
ms.date: 01/30/2019
ms.author: juliako
---

# Manage multiple tenants

Some customers use Video Indexer on behalf of their tenants. This article suggests different integration options for managing multiple tenants with Video Indexer:

* Azure subscription per tenant
* Video Indexer account per tenant
* Single Video Indexer account for all tenants

## Azure subscription per tenant 

When using this architecture, each tenant will have his own Azure subscription. For each user, you will create a new Video Indexer account in the tenant subscription.

### Pros

* This is the only option that enables billing separation.

### Cons

* This integration has more management overhead than Video Indexer account per tenant. If billing is not a requirement, it is recommended to use one of the other options described in this article.

## Video Indexer account per tenant

When using this architecture, a Video Indexer account is created for each tenant. The tenants have full isolation in the persistent and compute layer.  

### Pros

* Customers do not share storage accounts. (Unless manually configured by the customer).
* Customers do not share compute (reserved units) and don't impact processing jobs times of one another.
* You can easily remove a tenant from the system by deleting the Video Indexer account.

### Cons

* There is no ability to share custom models between tenants.

    > [!TIP]
    > Make sure there is no business requirement to share custom models.
* Harder to manage due to multiple Video Indexer (and associated Media Services) accounts per tenant.

> [!TIP]
> Create an admin user for your system in [Video Indexer developer portal](https://api-portal.videoindexer.ai/) and use the Authorization API to provide your tenants the relevant [account access token](https://api-portal.videoindexer.ai/docs/services/authorization/operations/Get-Account-Access-Token).

## Single Video Indexer account for all users

When using this architecture, the customer is responsible for tenants isolation. All tenants have to use a single Video Indexer account with a single Azure Media Service account. When uploading, searching, or deleting content, the customer will need to filter the proper results for that tenant.

With this option, customization models (Person, Language, and Brands) can be shared or isolated between  tenants by filtering the models by tenant.

### Pros 

* Ability to share content and customization models between tenants.

### Cons

* One tenant impacts the performance of other tenants.
* Customer needs to build a complex management layer on top of Video Indexer.

> [!TIP]
> You can use the [priority](upload-index-videos.md) attribute to prioritize tenants jobs.

## Next steps

[Overview](video-indexer-overview.md)