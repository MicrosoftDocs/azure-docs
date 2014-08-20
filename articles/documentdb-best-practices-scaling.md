<properties title="Scale with Azure DocumentDB" pageTitle="Scale with DocumentDB | Azure" description="How to scale a DocumentDB database elastically with lifecycle demands." metaKeywords="NoSQL, DocumentDB,  database, document-orientated database, JSON, scaling" services="documentdb"  solutions="data-management" documentationCenter=""  authors="bradsev" manager="jhubbard" editor="cgronlun" videoId="" scriptId="" />

<tags ms.service="documentdb" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="08/20/2014" ms.author="bradsev" />


#Scale with Azure DocumentDB

##In this article

- [Manage capacity](#capacity)
- [Partition document data](#partition)


Microsoft Azure DocumentDB allows you to scale elastically as the demands of your application change throughout its lifecycle. Scaling DocumentDB is accomplished by increasing the capacity of your DocumentDB database account in the [Azure Preview portal][preview-portal]. When you create a database account, it is provisioned with database storage and reserved throughput. At any time, you can change the provisioned database storage and throughput for your account by adding or removing service capacity units expressed as database storage in the [Azure Preview portal][preview-portal].  

DocumentDB operates on a reserved capacity model with granular resource increments to express your capacity needs. If the capacity requirements of your application change, you can scale out or scale back the amount of provisioned capacity in your account. Capacity provisioned under a database account is available for all databases and collections that exist or are created within the account.  

DocumentDB allocates your provisioned capacity to collections within your database account based on the data stored in each collection. This provides you with control and flexibility over how capacity is allocated within an account. There is no practical limit on the size of a database account or database; however, operational limits are in place to govern consumption patterns of the service based on available capacity per region. Refer to [DocumentDB resource limits and quotas][limits] for more information on DocumentDB’s operational limits and default values. Provisioned capacity is allocated to a DocumentDB collection upon creation and collections can grow elastically based on the data stored in the collection. Capacity is expressed as size in GB and includes a corresponding allocation of reserved throughput. By default, DocumentDB preallocates the minimum collection size for each new collection and allocates additional storage in GB increments as a collection grows. For each additional allocation of storage a proportionate amount of throughput is allocated to the collection. With this capability, collections can dynamically scale in size and throughput.  

## <a id="capacity"></a>Manage capacity
Provisioned capacity can be added or removed through the [Azure Preview portal][preview-portal] or through the Azure management APIs. Capacity is available for use within minutes of adjusting the provisioned capacity level for your account. Capacity is expressed in discrete units through the Preview portal and Azure management APIs. Each unit includes an allocation of 10 GB of database storage and associated throughput. You can reduce the capacity provisioned for your database account through the Preview portal and Azure management APIs. Capacity that has not been allocated to a collection can be freed from the account by scaling the capacity slider back in the Azure portal in 10 GB increments. To free up additional capacity, you must delete existing collections or data stored in those collections.  
 
##  <a id="partition"></a> Partition document data 
Each JSON document in DocumentDB belongs to a single collection within a database. Based on your application scenarios and design, you may choose to create multiple collections for your documents. When deciding to spread data across collections, consider the following factors:  

1.	**Collection size limits:** Collections can expand and will consume provisioned capacity up to the maximum size limit of a single collection. If you expect your document data to grow beyond the maximum size of a single collection, you will need to spread your data across multiple collections. 
2.	**Query and transaction boundaries:** Collections provide the boundary for both queries and transactions. Transactional execution of JavaScript as a script or trigger is always scoped to a single collection. Queries that span collections require application logic to fan out queries and aggregate result sets. Scripts that are executed across multiple collections require application logic to coordinate execution.
3.	**Frequently accessed data:** As collections expand in size, they are allocated proportionate throughput capacity to serve read and write requests. If a dataset includes a set of frequently accessed (or "hot") documents, consideration should be given to spreading these documents across one or more collections to ensure that request throttling is localized to a hot collection and does not impact read and write availability of other documents. Request rate throttling is applied on a per collection basis.
4.	**Document use case heterogeneity:** By default, DocumentDB indexes all properties contained in a document. An index is scoped to a collection and consumes storage from provisioned database storage. Use indexing policies to tune how and when documents should be indexed. If your application has different use cases for document types, it may call for different default indexing behaviors. For these cases, multiple collections may be appropriate.  

For many application scenarios, a single collection can be sufficient to meet the desired performance and access patterns. DocumentDB provides efficient query and indexing of JSON documents at scale. This provides the ability to store, query, and retrieve documents by entity type, tenant ID, or any other property that may have necessitated a separate container (table, collection) in another system.

[preview-portal]: https://portal.azure.com
[limits]: ../documentdb-limits/