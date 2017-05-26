---
title: Provision throughput for Azure Cosmos DB | Microsoft Docs
description: Learn  how to set provisioned throughput for your Azure Cosmos DB collection.
services: cosmosdb
author: mimig1
manager: jhubbard
editor: ''
documentationcenter: ''

ms.assetid: f98def7f-f012-4592-be03-f6fa185e1b1e
ms.service: cosmosdb
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/15/2017
ms.author: mimig

---

# Set throughput for Azure Cosmos DB collections

You can set throughput for your Azure Cosmos DB collections in the Azure portal or by using the client SDKs. 

The following table lists the throughput available for collections:

<table border="0" cellspacing="0" cellpadding="0">
    <tbody>
        <tr>
            <td valign="top"><p></p></td>
            <td valign="top"><p><strong>Single Partition Collection</strong></p></td>
            <td valign="top"><p><strong>Partitioned Collection</strong></p></td>
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

> [!NOTE] 
> To set partitioned collections to a throughput value betweeen 2,500 RU/s and 10,000 RU/s, you must temporarily use the Azure portal. This functionality is not yet available in the SDKs.

## To set the throughput by using the Azure portal

1. In a new window, open the [Azure portal](https://portal.azure.com).
2. On the left bar, click **Azure Cosmos DB**, or click **More Services** at the bottom, then scroll to **Databases**, and then click **Azure Cosmos DB**.
3. Select your Cosmos DB account.
4. In the new window, under **Collections**, click **Scale** as shown in the following screenshot.
5. In the new window, select your collection from the drop-down, change the **Throughput** value, and then click **Save**.

    ![Screenshot showing how to change throughput for a collection in the Azure portal by navigating to your account and clicking Scale](./media/documentdb-set-throughput/azure-documentdb-change-throughput-value.png)

<a id="set-throughput-sdk"></a>

## To set the throughput by using the .NET SDK

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

400 RU/s is the minimum throughput available on Cosmos DB single partition collections (2500 RU/s is the minimum for partitioned collections). Request units are set in 100 RU/s intervals, but throughput cannot be set to 100 RU/s or any value smaller than 400 RU/s. If you're looking for a cost effective method to develop and test Cosmos DB, you can use the free [Azure Cosmos DB Emulator](documentdb-nosql-local-emulator.md), which you can deploy locally at no cost. 

## Next steps

To learn more about provisioning and going planet-scale with Cosmos DB, see [Partitioning and scaling with Cosmos DB](documentdb-partition-data.md).
