<properties 
	pageTitle="Performance levels in DocumentDB | Azure" 
	description="Learn about how performance levels in DocumentDB enable you to reserve throughput on a per collection basis." 
	services="documentdb" 
	authors="johnfmacintyre" 
	manager="jhubbard" 
	editor="monicar" 
	documentationCenter=""/>

<tags 
	ms.service="documentdb" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/14/2015" 
	ms.author="johnmac"/>

#Performance levels in DocumentDB

This article provides an overview of performance levels in [Microsoft Azure DocumentDB](http://azure.microsoft.com/services/documentdb/). 

After reading this article, you'll be able to answer the following questions:  

-	What is a performance level?
-	How is throughput reserved for a database account?
-	How do I work with performance levels?
-	How am I billed for performance levels?

##Introduction to performance levels

Each DocumentDB collection created under a Standard account is provisioned with an associated performance level. Performance levels are designated as S1, S2 or S3 ranging from lowest to highest in performance. The collection’s performance level determines the amount of service resources reserved for your application. Each collection in a database can have a different performance level allowing you to designate more throughput for frequently accessed collections and less throughput for infrequently accessed collections. 

Each performance level has an associated request unit (RU) rate limit. This is the throughput that will be reserved for a collection based on its performance level, and is available for use by that collection exclusively. Collections can be created through the [Azure portal](http://portal.azure.com) or any of the [DocumentDB SDKs](https://msdn.microsoft.com/library/azure/dn781482.aspx). The DocumentDB APIs allow you to specify the performance level of a collection. 

<table> 
<tbody>
<tr>
<td valign="top" ><p><b>Collection performance level</b></p></td>
<td valign="top" ><p><b>Reserved throughput</b></p></td>
</tr>

<tr>
<td valign="top" ><p>S1</p></td>
<td valign="top" ><p>250 RU/sec</p></td>
</tr>

<tr>
<td valign="top" ><p>S2</p></td>
<td valign="top" ><p>1000 RU/sec</p></td>
</tr>

<tr>
<td valign="top" ><p>S3</p></td>
<td valign="top" ><p>2500 RU/sec</p></td>
</tr>

</tbody>
</table>

DocumentDB allows for a rich set of database operations including queries, queries with user-defined functions (UDFs), stored procedures and triggers. The processing cost associated with each of these operations will vary based on the CPU, IO and memory required to complete the operation. Instead of thinking about and managing hardware resources, you can think of a request unit as a single measure for the resources required to perform various database operations and service an application request.

> [AZURE.NOTE] Performance levels are measured in request units. Each performance level has an associated maximum request unit per second rate. The performance level of a collection can be adjusted through the APIs or the [Azure portal](https://portal.azure.com/).

##Setting performance levels for collections
Once a collection is created, the full allocation of RUs based on the designated performance level are reserved for the collection. For example, if a collection is set as S3 – the collection is capable of processing 2,500 RUs/sec. Each collection reserves its designated throughput and 10GB of database storage. The price of the collection will vary based on the performance level chosen (S1, S2, S3). Note that DocumentDB operates based on capacity reservation; by creating a collection, an application has reserved and is billed for reserved throughput and database storage, regardless of how much of that storage and throughput is actively used.

After collections are created, you can modify the performance level through the DocumentDB SDKs or through the Azure management portal. 

> [AZURE.IMPORTANT] DocumentDB Standard collections are billed at an hourly rate and each collection you create will be billed for a minimum one hour of usage. 

If you adjust the performance level of a collection within an hour, you will be billed for the highest performance level set during the hour. For example, if you increase your performance level for a collection at 8:53am you will be charged for the new level starting at 8:00am. Likewise, if you decrease your performance level at 8:53am, the new rate will be applied at 9:00am.

Request units are reserved for each collection based on the performance level set. Request unit consumption is evaluated as a per second rate. Applications that exceed the provisioned request unit rate (or performance level) on a collection will be throttled until the rate drops below the reserved level for that collection. If your application requires a higher level of throughput, you can increase the performance level for each collection.

> [AZURE.NOTE] When your application exceeds performance levels for one or multiple collections, requests will be throttled on a per collection basis. This means that some application requests may succeed while others may be throttled.

##Working with performance levels
DocumentDB collections allow you to partition your data based on both the query patterns and performance needs of your application. Refer to the [partitioning data documentation](documentdb-partition-data.md) for more details on partitioning data with DocumentDB. With DocumentDB’s automatic indexing and query support, it is quite common to collocate heterogeneous documents within the same collection. The key considerations in deciding whether separate collections should be used include:

- Queries – A collection is the scope for query execution. If you need to query across a set of documents, the most efficient read patterns come from collocating documents in a single collection.
- Transactions – A collection is the transaction domain for stored procedures and triggers. All transactions are scoped to a single collection. 
- Performance – A collection has an associated performance level. This ensures that each collection has a predictable performance through reserved RUs. Data can be allocated to different collections, with different performance levels, based on access frequency.

> [AZURE.IMPORTANT] It is important to understand you will be billed at full standard rates based on the number of collections created by your application.

It is recommended that your application makes use of a small number of collections unless you have large storage or throughput requirements. Ensure that you have well understood application patterns for the creation of new collections. You may choose to reserve collection creation as a management action handled outside your application. Similarly, adjusting the performance level for a collection will change the hourly rate at which the collection is billed. You should monitor collection performance levels if your application adjusts these dynamically.

##Changing performance levels using the Azure Preview portal

The Azure Preview portal is one option available to you when managing your collections' performance levels. Follow these steps to change a collection's performance level from the Azure Portal.

1. Navigate over to the [**Azure Preview portal**](https://portal.azure.com) from your browser.
2. Click **Browse** from the jump bar on the left side.
3. In the **Browse** hub, click **DocumentDB Accounts** under the **Filter by** label.
4. In the **DocumentDB Accounts** blade, click the DocumentDB account that contains the desired collection.
5. In the **DocumentDB Account** blade, scroll down to the **Databases** lens and click the database that contains the desired collection. 
6. In the newly opened **Database** blade, scroll down to the **Collections** lens and select your desired collection.
7. Finally, within your **Collection** blade, find and click the **Pricing tier** tile in the **Usage** lens.
8. In the **Choose your pricing tier** blade, click the desired performance level and then click **Select** at the bottom of the blade. 

>[AZURE.NOTE] Changing performance levels of a collection may take up to 2 minutes.

![Changing pricing tier][1]

##Changing performance levels using the .NET SDK

Another option for changing your collections' performance levels is through our SDKs. This section only covers changing a collection's performance level using our [.NET SDK](https://msdn.microsoft.com/library/azure/dn948556.aspx), but the process is similar for our other [SDKs](https://msdn.microsoft.com/library/azure/dn781482.aspx). If you are new to our .NET SDK, please visit our [getting started tutorial](documentdb-get-started.md).

Here is a code snippet for changing the offer type:

	//Fetch the resource to be updated
	Offer offer = client.CreateOfferQuery()
	                          .Where(r => r.ResourceLink == "collection selfLink")    
	                          .AsEnumerable()
	                          .SingleOrDefault();
	                          
	//Change the user mode to All
	offer.OfferType = "S3";
	                    
	//Now persist these changes to the database by replacing the original resource
	Offer updated = await client.ReplaceOfferAsync(offer);

Visit [MSDN](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.aspx) to view additional examples and learn more about our offer methods: 

- [**ReadOfferAsync**](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.readofferasync.aspx)
- [**ReadOffersFeedAsync**](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.readoffersfeedasync.aspx)
- [**ReplaceOfferAsync**](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.client.documentclient.replaceofferasync.aspx)
- [**CreateOfferQuery**](https://msdn.microsoft.com/library/azure/microsoft.azure.documents.linq.documentqueryable.createofferquery.aspx) 

##Next steps

To learn more about pricing and managing data with Azure DocumentDB, explore these resources:
 
- [DocumentDB pricing](http://azure.microsoft.com/pricing/details/documentdb/)
- [Managing DocumentDB capacity](documentdb-manage.md) 
- [Modeling data in DocumentDB](documentdb-modeling-data.md)
- [Partitioning data in DocumentDB](documentdb-partition-data.md)

To learn more about DocumentDB, see the Azure DocumentDB [documentation](http://azure.microsoft.com/documentation/services/documentdb/). 

[1]: ./media/documentdb-performance-levels/img1.png