<properties
   pageTitle="Scalable web application | Azure reference architecture | Microsoft Azure"
   description="Improving scalability in a web application running in Microsoft Azure."
   services="app-service,app-service\web,sql-database"
   documentationCenter="na"
   authors="mikewasson"
   manager="roshar"
   editor=""
   tags=""/>

<tags
   ms.service="guidance"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="07/12/2016"
   ms.author="mikewasson"/>


# Improving scalability in a web application 

[AZURE.INCLUDE [pnp-RA-branding](../../includes/guidance-pnp-header-include.md)]

This article shows a recommended architecture for improving scalability and performance in a web application running on Microsoft Azure. The architecture builds on [Azure reference architecture: Basic web application][basic-web-app]. The recommendations and considerations from that article apply to this architecture as well.

>[AZURE.NOTE] Azure has two different deployment models: Resource Manager and classic. This article uses Resource Manager, which Microsoft recommends for new deployments.

## Architecture diagram

![[0]][0]

The architecture has the following components:

- **Resource group**. A [resource group][resource-group] is a logical container for Azure resources. 

- **[Web app][app-service-web-app]** and **[API app][app-service-api-app]**. A typical modern application might include both a website and one or more RESTful web APIs. A web API might be consumed by browser clients through AJAX, by native client applications, or by server-side applications. For considerations on designing web APIs, see [API design guidance][api-guidance].    

- **WebJob**. Use [Azure WebJobs][webjobs] to run long-running tasks in the background. WebJobs can run on a schedule, continously, or in response to a trigger, such as putting a message on a queue. A WebJob runs as a background process in the context of an App Service app. 

- **Queue**. In the architecture shown here, the application queues background tasks by putting a message onto an [Azure Queue Storage][queue-storage] queue. The message triggers a function in the WebJob. 

	Alternatively, you can use Service Bus queues. For a comparison, see [Azure Queues and Service Bus queues - compared and contrasted][queues-compared].

- **Cache**. Store semi-static data in [Azure Redis Cache][azure-redis].  

- **CDN**. Use [Azure Content Delivery Network][azure-cdn] (CDN) to cache publicly available content, for lower latency and faster delivery of content.

- **Data storage.** Use [Azure SQL Database][sql-db] for relational data. For non-relational data, consider a NoSQL store, such as Azure Table Storage or [DocumentDB][documentdb].

- **Azure Search**. Use [Azure Search][azure-search] to add search functionality, including search suggestions, fuzzy search, and language-specific search. Azure Search is typically used in conjunction with another data store, especially if the primary data store requires strict consistency. In this approach, you would the authoritative data in the other data store, and put the search index into Azure Search. Azure Search can also be used to consolidate a single search index from multiple data stores.  

- **Email/SMS**. If your application needs to send email or SMS messages, use a third-party service such as SendGrid or Twilio, rather than building this functionality directly into the application.

## Recommendations

### App Service apps 

We recommend creating the web application and the web API as separate App Service apps. This design lets you run them in separate App Service plans, which in turn lets you scale them independently. If you don't need that level of scalability at first, you can deploy the apps into the same plan, and move them into separate plans later, if needed. (For the Basic, Standard, and Premium plans, you are billed for the VM instances in the plan, not per app. See [App Service Pricing][app-service-pricing])

If you intend to use the *Easy Tables* or *Easy APIs* features of App Service Mobile Apps, create a separate App Service app for this purpose.  These features rely on a specific application framework to enable them.

### WebJobs

If the WebJob is resource intensive, consider deploying it to an empty App Service app within a separate App Service plan, to provide dedicated instances for the WebJob. See [Background jobs guidance][webjobs-guidance].  

### Cache

You can improve performance and scalability by using [Azure Redis Cache][azure-redis] to cache some data. Consider using Redis Cache for:

- Semi-static transaction data.

- Session state.

- HTML output. This can be useful in applications that render complex HTML output. 

For more detailed guidance on designing a caching strategy, see [Caching guidance][caching-guidance].

### CDN 

Use [Azure CDN][azure-cdn] to cache static content. The main benefit of a CDN is to reduce latency for users, because content is cached at an *edge server* that is geographically close to the user. CDN can also reduce load on the application, because that traffic is not being handled by the application.

- If your app consists mostly of static pages, consider using CDN to cache the entire app. See [Use Azure CDN in Azure App Service][cdn-app-service].

- Otherwise, put static content, such as images, CSS, and HTML files, into Azure Storage, and use CDN to cache those files. See [Integrate a Storage Account with CDN][cdn-storage-account].

> [AZURE.NOTE] Azure CDN cannot serve content that requires authentication.

For more detailed guidance, see [Content Delivery Network (CDN) guidance][cdn-guidance]. 

### Storage

Modern applications often process large amounts of data. In order to scale for the cloud, it's important to choose the right storage type. Here are some baseline recommendations.  For more detailed guidance, see [Assessing Data Store Capabilities for Polyglot Persistence Solutions][polyglot-storage].

What you want to store | Example | Recommended storage
--- | --- | ---
Files | Images, documents, PDFs | Azure Blob Storage
Key/Value pairs | User profile data looked up by user ID | Azure Table Storage
Short messages intended to trigger further processing | Order requests | Azure Queue Storage, Service Bus Queue, or Service Bus Topic
Non-relational data, with a flexible schema, requiring basic querying | Product catalog | Document database, such as Azure DocumentDB, MongoDB, or Apache CouchDB
Relational data, requiring richer query support, strict schema, and/or strong consistency | Product inventory | Azure SQL Database

## Scalability considerations

### App Service app

If your solution includes several App Service apps, consider deploying them to separate App Service plans. This approach enables you to scale them independently, because they run on separate instances. For more information about scaling out, see the [Scalability considerations][basic-web-app-scalability] section in the [Basic web application architecture][basic-web-app].

Similarly, consider putting a WebJob into its own plan, so that background tasks don't run on the same instances that handle HTTP requests.  

### SQL Database

Increase scalability of a SQL database by *sharding* the database &mdash; that is, partitioning the database horizontally. Sharding allows you to scale out the database horizontally, using [Elastic Database tools][sql-elastic]. Potential benefits of sharding include:

- Better transaction throughput.

- Queries can run faster over a subset of the data. 

### Azure Search

Azure Search removes the overhead of performing complex data searches from the primary data store, and it can scale to handle load. See [Scale resource levels for query and indexing workloads in Azure Search][azure-search-scaling].

## Security considerations

### Cross-Origin Resource Sharing (CORS)

If you create a website and web API as separate apps, the website cannot make client-side AJAX calls to the API unless you enable CORS. 

> [AZURE.NOTE] Browser security prevents a web page from making AJAX requests to another domain. This restriction is called the same-origin policy, and prevents a malicious site from reading sentitive data from another site. CORS is a W3C standard that allows a server to relax the same-origin policy and allow some cross-origin requests while rejecting others.

App Services has built-in support for CORS, without needing to write any application code. See [Consume an API app from JavaScript using CORS][cors]. Add the website to the list of allowed origins for the API. 

### SQL Database encryption

Use [Transparent Data Encryption][sql-encryption] if you need to encrypt data at rest in the database. This feature performs real-time encryption and decryption of an entire database (including backups and transaction log files), without requiring changes to the application. Encryption does add some latency, so it's a good practice to separate the data that must be secure into its own database, and enable encryption only for that database.  

## Next steps

- For higher availability, deploy the application in more than one region and use [Azure Traffic Manager][tm] for failover. For more information, see [Azure reference architecture: Web application with high availability][web-app-multi-region].    

<!-- links -->

[api-guidance]: ../best-practices-api-design.md
[app-service-web-app]: ../app-service-web/app-service-web-overview.md
[app-service-api-app]: ../app-service-api/app-service-api-apps-why-best-platform.md
[app-service-pricing]: https://azure.microsoft.com/en-us/pricing/details/app-service/
[azure-cdn]: https://azure.microsoft.com/en-us/services/cdn/
[azure-redis]: https://azure.microsoft.com/en-us/services/cache/
[azure-search]: https://azure.microsoft.com/en-us/documentation/services/search/
[azure-search-scaling]: ../search/search-capacity-planning.md
[background-jobs]: ../best-practices-background-jobs.md
[basic-web-app]: guidance-web-apps-basic.md
[basic-web-app-scalability]: guidance-web-apps-basic.md#scalability-considerations 
[caching-guidance]: ../best-practices-caching.md
[cdn-app-service]: ../app-service-web/cdn-websites-with-cdn.md
[cdn-storage-account]: ../cdn/cdn-create-a-storage-account-with-cdn.md
[cdn-guidance]: ../best-practices-cdn.md
[cors]: ../app-service-api/app-service-api-cors-consume-javascript.md
[documentdb]: https://azure.microsoft.com/en-us/documentation/services/documentdb/
[polyglot-storage]: https://github.com/mspnp/azure-guidance/blob/master/Polyglot-Solutions.md
[queue-storage]: ../storage/storage-dotnet-how-to-use-queues.md
[queues-compared]: ../service-bus/service-bus-azure-and-service-bus-queues-compared-contrasted.md
[resource-group]: ../resource-group-overview.md
[sql-db]: https://azure.microsoft.com/en-us/documentation/services/sql-database/
[sql-elastic]: ../sql-database/sql-database-elastic-scale-introduction.md
[sql-encryption]: https://msdn.microsoft.com/en-us/library/dn948096.aspx
[tm]: https://azure.microsoft.com/en-us/services/traffic-manager/
[web-app-multi-region]: ./guidance-web-apps-multi-region.md
[webjobs-guidance]: ../best-practices-background-jobs.md
[webjobs]: ../app-service/app-service-webjobs-readme.md
[0]: ./media/blueprints/paas-web-scalability.png "Web application in Azure with improved scalability"