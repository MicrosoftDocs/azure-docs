---
title: Provision throughput for Azure Cosmos DB | Microsoft Docs
description: Learn  how to set provisioned throughput for your Azure Cosmos DB containsers, collections, graphs, and tables.
services: cosmos-db
author: mimig1
manager: jhubbard
editor: ''
documentationcenter: ''

ms.assetid: f98def7f-f012-4592-be03-f6fa185e1b1e
ms.service: cosmos-db
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/12/2017
ms.author: mimig

---

# Set throughput for Azure Cosmos DB containers

You can set throughput for your Azure Cosmos DB containers in the Azure portal or by using the client SDKs. 

The following table lists the throughput available for containers:

<table border="0" cellspacing="0" cellpadding="0">
    <tbody>
        <tr>
            <td valign="top"><p></p></td>
            <td valign="top"><p><strong>Single Partition Container</strong></p></td>
            <td valign="top"><p><strong>Partitioned Container</strong></p></td>
        </tr>
        <tr>
            <td valign="top"><p>Minimum Throughput</p></td>
            <td valign="top"><p>400 request units per second</p></td>
            <td valign="top"><p>2,500 request units per second</p></td>
        </tr>
        <tr>
            <td valign="top"><p>Maximum Throughput</p></td>
            <td valign="top"><p>10,000 request units per second</p></td>
            <td valign="top"><p>Unlimited</p></td>
        </tr>
    </tbody>
</table>

## To set the throughput by using the Azure portal

1. In a new window, open the [Azure portal](https://portal.azure.com).
2. On the left bar, click **Azure Cosmos DB**, or click **More Services** at the bottom, then scroll to **Databases**, and then click **Azure Cosmos DB**.
3. Select your Cosmos DB account.
4. In the new window, click **Data Explorer (Preview)** in the navigation menu.
5. In the new window, expand your database and container and then click **Scale & Settings**.
6. In the new window, type the new throughput value in the **Throughput** box, and then click **Save**.

<a id="set-throughput-sdk"></a>

## To set the throughput by using the DocumentDB API for .NET

```C#
//Fetch the resource to be updated
Offer offer = client.CreateOfferQuery()
    .Where(r => r.ResourceLink == collection.SelfLink)    
    .AsEnumerable()
    .SingleOrDefault();

// Set the throughput to the new value, for example 12,000 request units per second
offer = new OfferV2(offer, 12000);

//Now persist these changes to the database by replacing the original resource
await client.ReplaceOfferAsync(offer);
```

## Throughput FAQ

**Can I set my throughput to less than 400 RU/s?**

400 RU/s is the minimum throughput available on Cosmos DB single partition collections (2500 RU/s is the minimum for partitioned collections). Request units are set in 100 RU/s intervals, but throughput cannot be set to 100 RU/s or any value smaller than 400 RU/s. If you're looking for a cost effective method to develop and test Cosmos DB, you can use the free [Azure Cosmos DB Emulator](local-emulator.md), which you can deploy locally at no cost. 

**How do I set througput using the MongoDB API?**

There's no MongoDB API extension to set throughput. The recommendation is to use the DocumentDB API, as shown in [To set the throughput by using the DocumentDB API for .NET](#set-throughput-sdk).

## Next steps

To learn more about provisioning and going planet-scale with Cosmos DB, see [Partitioning and scaling with Cosmos DB](partition-data.md).
