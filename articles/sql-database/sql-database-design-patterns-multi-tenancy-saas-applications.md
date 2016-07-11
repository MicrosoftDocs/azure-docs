<properties
   pageTitle="Design Patterns for Multi-tenant SaaS Applications with Azure SQL Database | Microsoft Azure" 
   description="This article discusses the requirements and common data architecture patterns of multi-tenant database applications running in a cloud environment need to consider and the various tradeoffs associated with these patterns. It also explains how Azure SQL Database service with its elastic database pools and elastic tools help in addressing these requirements in a no-compromise fashion."
   keywords=""
   services="sql-database"
   documentationCenter=""
   authors="carlrabeler"
   manager="jhubbard"
   editor=""/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="sqldb-design"
   ms.date="06/07/2016"
   ms.author="carlrab"/>

# Design Patterns for Multi-tenant SaaS Applications with Azure SQL Database

In this article you learn about the requirements and common data architecture patterns of multi-tenant software-as-a-service (SaaS) database applications running in a cloud environment need to consider and the various tradeoffs associated with these patterns. It also explains how Azure SQL Database service with its elastic database pools and elastic tools help in addressing these requirements in a no-compromise fashion.

## Introduction

Having worked with SaaS application providers over the last few years, we see developers often making choices against their best long-term interests when designing the tenancy models for the data tiers of their multi-tenant applications. At least initially, ease of development and lower cloud provider cost are perceived as more important than tenant isolation or scalability of the applications. This oftentimes leads to customer satisfaction issues and costly course-corrections at a later point in time. 

In the context of this article, a multi-tenant application is an application hosted in a cloud environment and provides the same set of services to multiple (hundreds or thousands) tenants who do not share or see each other’s data. An archetypical category of such service is a SaaS application providing services to its tenants in a cloud hosted environment. 

## Multi-tenant applications

Multi-tenant applications are a prominent example of a type of application whose data and workloads can be partitioned easily. For instance, with multi-tenant applications, data and workload can typically be partitioned along tenant boundaries since most requests are within the confines of a tenant. That property is inherent to the data and the workload and it favors the applications patterns discussed throughout the remainder of the article. 

We find such applications spread across the whole spectrum of cloud based applications, including:

- ISV database applications transitioning into cloud as SaaS applications
- SaaS applications built for the cloud from ground up
- Direct consumer/end user facing applications 
- Employee facing enterprise applications

Both cloud-born SaaS applications and SaaS applications rooted in ISV database applications typically result into multi-tenant applications. These SaaS applications deliver a specialized software application as a service to their tenants. Tenants have access to the application service and full ownership of associated data stored as part of the application. But in order to take advantage of the benefits of SaaS, its tenants must surrender a level of control over their own data, trusting the SaaS vendor to keep it safe and isolated from other tenant’s data. Typical examples are MyOB, SnelStart, Salesforce etc. All these applications allow for partitioning along tenant boundaries and therefore support the applications patterns discussed in the following sections of this article.

Applications that provide a direct service to consumers or employees within an organization (often referred to as users, rather than tenants) form another category in the multi-tenant application spectrum. Customers subscribe to the service and do not own the data collected and stored by the service provider. Service providers have less stringent requirements to keep their customer’s data isolated from each other, other than government mandated privacy regulations. Typical examples are media content providers like Netflix, Spotify, Xbox-live etc. Other examples of easily partitionable applications are found with customer facing internet-scale applications or internet of things (IoT) applications where each customer or device can serve as a partition and partition boundaries can be drawn between different users or devices. 

We, however, also recognize not all applications partition easily along a single property such as tenant, customer, user, or device. Think, for instance, of complex ERP (Enterprise Resource Planning) applications with products, orders, customers. They typically have a complex schema with thousands of highly interconnected tables. No single partition strategy will apply to all tables and work across the whole workload. Therefore, we explicitly exclude them from our discussion throughout the remainder of this article. 

The multi-tenant design patterns we explore in the sections below apply to all of the above application patterns which have easily partitionable data and workloads. However, for ease of presentation, we simply refer to all of them as multi-tenant SaaS applications.

## Multi-tenant application design trade-Offs

For developers building multi-tenant applications in the cloud, there are the following overarching dimensions:

-	***Tenant isolation***: Developers need to ensure no tenant gets unwanted access to other tenants’ data. This isolation requirement extends to other properties such as protection from noisy neighbors, the ability to restore a given tenant’s data, tenant specific customizations etc. 
-	***Cloud resource cost***: SaaS application needs to be cost-competitive. Based on this, developers of SaaS applications will optimize for lower cost in their cloud resource usage (Compute, Storage etc.), when designing their multi-tenant applications.
-	***Ease of DevOps***: Multi-tenant application providers need to build isolation protection, maintain their application, database schema, monitor its health and troubleshoot their tenant’s issues. Complexity of application development and operation directly translates to added cost and lower tenant satisfaction.
-	***Scalability***: Adding incrementally more tenants is paramount to a successful SaaS operation as well as adding more capacity for individual tenants requiring more resources.

There are trade-offs between these dimensions. The lowest cost cloud offering may not necessarily also offer the most convenient development experience. We often see developers make uninformed choices across the space identified by the four dimensions above. 

For SaaS multi-tenant applications catering to other businesses, tenant isolation is often a fundamental requirement. We often see developers being tempted by the perceived advantages regarding simplicity and cost over tenant isolation and scalability. This tradeoff can prove complex and expensive as the service grows and tenant isolation requirements become more important and need to be dealt with at the application layer.

For multi-tenant applications providing a direct consumer facing service to end users, tenant isolation may become lower priority than optimizing for cloud resource cost. 

A popular development pattern is to pack multiple tenants into one or a few databases. The (perceived) benefits with this approach is lower cost by paying only for a few databases and to keep things simple by working only across as few databases as possible. For SaaS multi-tenant applications, over time, such a decision comes with substantial downsides regarding tenant isolation and scalability. If tenant isolation is needed, additional efforts are required to protect tenant data in shared storage from unauthorized access or noisy neighbors and can significantly boost the application development efforts and isolation maintenance costs. Similarly, when adding new tenants, properly scaling the data tier of such an application typically requires development expertise for redistributing tenant data across databases.  

## Multi-tenant data models 

Common design practices for placing tenant data follows these three distinct models. 


  ![multi-tenant data models](./media/sql-database-design-patterns-multi-tenancy-saas-applications/sql-database-multi-tenant-data-models.png)
    Figure 1: Common design practices for multi-tenant data models
  
1.	***Database-per-tenant***: This approach places each tenant in its own database. All tenant specific data is confined to their database and isolated from other tenants and their data.
2.	***Shared database-sharded***: This approach uses multiple databases, with multiple tenants sharing a database. i.e. a distinct set of tenants are assigned to each database using a partitioning strategy such as hash, range or list partitioning. This data distribution strategy is oftentimes referred to as sharding.
3.	***Shared database-single***: This approach uses a single, sometimes large database containing data for all tenants disambiguated with a tenant ID column. 
  
> [AZURE.NOTE] Sometimes, different tenants are also placed in different database schemas where the schema name is used to disambiguate between different tenants. This is not a recommended approach since it usually requires the use of dynamic SQL and it cannot make effective use of plan caching. Therefore, the remainder of this article focuses on the shared table approach in this category. 
 
## Characterization of popular multi-tenant data models

While evaluating the use of these multi-tenant data models it is important to frame them in terms of the application design trade-offs we discussed in the previous section.

-	***Isolation***: The degree of isolation between tenants as a measure of how much of the tenant isolation a data model achieves, and
-	***Cloud resource cost***: The amount of resource sharing happening between tenants in order to optimize cloud resource cost. A resource can be defined as the compute and storage cost. 
-	***DevOps cost***: Ease of application development, deployment and manageability reduces the overall SaaS operation cost.  

Using these dimensions, we can characterize the previously described multi-tenant data models and their database usage with the quadrant space as shown in Figure 2 below. The degree of tenant isolation and the amount of resource sharing describe the Y and X axis dimensions of the space. The large diagonal arrow in the middle indicates the DevOps costs. 

![popular patterns](./media/sql-database-design-patterns-multi-tenancy-saas-applications/sql-database-popular-application-patterns.png)
Figure 2: Characterization of popular multi-tenant data models

The bottom right quadrant in Figure 2 above shows using a potentially large single shared database together with the shared table (or separate schema) approach as one of the application patterns. It provides for great resource sharing since all tenants are using the same database resources (CPU, memory and IO…) on a single database. However, tenant isolation is limited.  Additional steps need to be taken to protect tenants from each other at the application layer which can significantly increase DevOps costs in application development and management. Additionally, scalability is limited by the scale of the hardware used to host the database.

The middle section illustrates multiple tenants sharded across multiple different databases (typically different hardware scale units) with each database hosting a subset of tenants which addresses the scalability concern of the previous pattern. If new capacity is required for more tenants those can easily be placed on new databases allocated to new hardware scale units. However, the amount of resource sharing is reduced since only the tenants placed on the same scale units are sharing their resources. Also, the approach provides little improvement to tenant isolation since still many tenants are collocated in the same places without being automatically protected from each other’s actions. Application complexity remains high. This approach is oftentimes referred to as ‘sharding’.

The top left quadrant in Figure 2 above is the third approach. It places each tenant in its own database. This approach has great tenant isolation properties but allows for little resource sharing when each database provides its own dedicated resources. This approach is great if all tenants are exhibiting predictable workloads. However, as soon as the tenant workloads become less predictable (most common for SaaS), resource sharing can’t be optimized causing the provider to either over-provision to meet demands or lower resources resulting in either higher costs or lower tenant satisfaction. As a result, a higher degree of resource sharing across tenants becomes desirable to make the solution more cost effective. Increasing the number of databases also increase the DevOps cost in application deployment and maintenance. We will come back to these concerns in the next section, but it is important to remember this method provides the best and easiest isolation for tenants compared to the others.

Customer choice of the design pattern is also influenced by these additional factors:

-	***Ownership of tenant data***: If tenants retain ownership of their data that favors the single-db per tenant pattern
-	***Scale***: If the application targets hundreds of thousands or millions of tenants, it favors database sharing approaches such as sharding, but isolation requirements can still pose challenges.
-	***Value and Business model***: Per tenant revenue if very small (less than a dollar), isolation requirements become less critical and shared database makes sense. If it is few dollars or more, database per tenant becomes feasible and application dev-ops cost can be reduced.

Given the above trade-offs as shown in Figure 2 above, an ideal multi-tenant model would need to incorporate great tenant isolation properties with optimal resource sharing among the tenants. i.e. a model which fits the top right quadrant.

## Multi-tenancy support with Azure SQL Database

Azure SQL Database supports all of the multi-tenant application patterns outlined by Figure 2. With elastic database pools, it now also supports a new application pattern combining great resource sharing and isolation benefits of the database-per-tenant approach (top right quadrant in green in Figure 3 below). The elastic database tools & capabilities in Azure SQL Database help with DevOps cost in developing and operating an application with many databases (shown by the shaded area in Figure 3 below). These tools help building and managing applications adopting any of the multi-database patterns. 
The following subsections discuss the SQL database capabilities and how SQL database helps these multi-tenant models in more detail. 

![pattern SQL DB](./media/sql-database-design-patterns-multi-tenancy-saas-applications/sql-database-patterns-sqldb.png)
Figure 3: Multi-tenant application patterns with Azure SQL Database

## Database-per-tenant model with elastic pools and tools

Azure SQL Database provides “elastic database pools” for better support of the ‘database-per-tenant’ approach combining the tenant isolation with resource sharing among tenant databases. It is designed as a data tier solution for SaaS providers to build multi-tenant applications. When combined with elastic database tool offerings, multi-tenancy is built-in and the burden of resource sharing among tenants is moved from the application down to the database service layer. The complexity of managing/querying at scale across databases is simplified with elastic jobs, query, transactions and the elastic database client library.

| Application Requirements | SQL Database Capabilities |
| ------------------------ | ------------------------- |
| Tenant Isolation & Resource Sharing | [Elastic Database Pools:](sql-database-elastic-pool.md) This feature allows to allocate a pool of SQLDB resources and share these resources across a number of databases. Also, individual databases can draw as much resources from the pool as needed to accommodate capacity demand spikes due to changes in tenant workloads and the elastic pool itself can be scaled up or down as needed. Elastic pools also provide ease of manageability, monitoring and troubleshooting at the pool level. |
| Ease of DevOps across databases | [Elastic Database Pools:](sql-database-elastic-pool.md) As listed above.|
||[Elastic Query:](sql-database-elastic-query-horizontal-partitioning.md) Provides ability to query across databases for reporting or cross-tenant analysis.|
||[Elastic Jobs:](sql-database-elastic-jobs-overview.md) Provides ability to package and reliably deploy database maintenance operations or database schema changes to a number of databases.|
||[Elastic Transactions:](sql-database-elastic-transactions-overview.md) Provides ability to process changes to several databases in an atomic and isolated way. This is needed when applications need “all or nothing” guarantees over several database operations. |
||[Elastic Database Client Library:](sql-database-elastic-database-client-library.md) This feature allows managing data distributions and the mapping of tenants to databases. |
||||

## Shared models

As described earlier, for most SaaS providers ‘shared model’ approaches can pose problems with tenant isolation issues as well as application development and maintenance complexities. However, for multi-tenant applications providing a service directly to end consumers, tenant isolation requirements may not be as high a priority as the desire to optimize the cost. They may be able to pack tenants in one or more databases at very high density to reduce costs.  Shared-database models using a single database or multiple sharded databases may result in additional efficiency in resource sharing and reduce overall cost. Azure SQL Database provides some features which help such customers to build isolation for security and management at scale in the data tier.

| Application Requirements | SQL Database Capabilities |
| ------------------------ | ------------------------- |
| Security Isolation features | [Row level security](https://msdn.microsoft.com/library/dn765131.aspx) |
|| [Database schema](https://msdn.microsoft.com/library/dd207005.aspx) |
| Ease of DevOps across databases | [Elastic query](sql-database-elastic-query-horizontal-partitioning.md) |
|| [Elastic jobs](sql-database-elastic-jobs-overview.md) |
|| [Elastic transactions](sql-database-elastic-transactions-overview.md) |
|| [Elastic database client library](sql-database-elastic-database-client-library.md) |
|| [Elastic database split / merge](sql-database-elastic-scale-overview-split-and-merge.md) |
||||

## Conclusions

Tenant isolation requirements are very important for most SaaS multi-tenant applications. The best option for providing isolation heavily leans towards the “database-per-tenant” approach. The other two approaches require complex application layer investments requiring skilled development staff to provide isolation. This can significantly increase cost and risk. If isolation requirements are not accounted for early in the service development, retrofitting them can be even more costly in the first two models. Main drawbacks associated with the “database-per-tenant” model are related to the increased cloud resource costs due to reduced sharing and maintaining and managing large number of databases. SaaS application developers often struggle making these trade-offs.

While these trade-offs can be major barriers with most cloud database service providers, Azure SQL database service eliminates these barriers with its “Elastic database pool” and “Elastic database capabilities”. SaaS developers can combine the isolation characteristics of database-per-tenant model while optimizing the resource sharing and improved manageability of large number of databases with elastic pools and associated tools.

For multi-tenant application providers who have no tenant isolation requirements and are able to pack tenants in a database at very high density to reduce costs, “shared” data models may result in some additional efficiency in resource sharing and reduce the overall cost. Azure SQL database elastic database tools, sharding libraries and security features help SaaS providers in building and managing such multi-tenant applications.

## Next steps

For a sample app that demonstrates the client library, see [Get started with Elastic Datababase tools](sql-database-elastic-scale-get-started.md).

For a sample application that provides a solution for a Softwware-as-a-Solution (SaaS) scenario that leverages Elastic Pools to provide a cost-effective, scalable database back-end of a SaaS application, see [Elastic Pool Custom Dashboard for Saas](https://github.com/Microsoft/sql-server-samples/tree/master/samples/manage/azure-sql-db-elastic-pools-custom-dashboard).

To convert existing databases to use the tools, see [Migrate existing databases to scale-out](sql-database-elastic-convert-to-use-elastic-tools.md).

To create a new pool, see the [Create an elastic pool tutorial](sql-database-elastic-pool-create-portal.md).  

To monitor and manage an elastic database pool, see [Monitor and manage an elastic database pool](sql-database-elastic-pool-manage-portal.md).

## Additional resources

- [What is an Azure elastic database pool?](sql-database-elastic-pool.md)
- [Scaling out with Azure SQL Database](sql-database-elastic-scale-introduction.md)
- [Multi-tenant applications with elastic database tools and row-level security](sql-database-elastic-tools-multi-tenant-row-level-security.md)
- [Authentication in multitenant apps, using Azure AD and OpenID Connect](../guidance/guidance-multitenant-identity-authenticate.md)
- [Tailspin Surveys application](../guidance/guidance-multitenant-identity-tailspin.md)
- [Solution Quick Starts](sql-database-solution-quick-starts.md)

## Questions and Feature Requests

For questions, please reach out to us on the [SQL Database forum](http://social.msdn.microsoft.com/forums/azure/home?forum=ssdsgetstarted) and for feature requests, please add them to the [SQL Database feedback forum](https://feedback.azure.com/forums/217321-sql-database/).









	
