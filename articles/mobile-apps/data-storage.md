---
title: Store, manage, and persist application data in the cloud with Visual Studio App Center and Azure services
description: Learn about services such as Visual Studio App Center that let you store, manage, and persist mobile application data in the cloud.
author: codemillmatt
ms.assetid: 12344321-0123-4678-8588-ccff02097224
ms.service: vs-appcenter
ms.topic: article
ms.date: 03/24/2020
ms.author: masoucou
---

# Store, sync, and query mobile application data from the cloud
No matter what kind of application you build, you will likely generate and process data. Your application's users have high expectations. They want the application to work fast and seamlessly, in all circumstances. Most applications also work across multiple devices. You might access your application from a desktop or mobile device. Multiple users might use the application at the same time and share data with the expectation of getting instant and real-time access to data.

Your application users won't always have internet connectivity. Applications are designed and expected to work with or without an internet connection. Developers must choose the right solution for storing and syncing their data to the cloud to provide a great customer experience for their application.

Microsoft provides a variety of services that eliminate the need to spin up servers, pick your database, or worry about scale or security to provide as rich experience as possible. These services provide a great developer experience that lets you store application data in the cloud by using SQL or NoSQL APIs. You can also sync data on all devices and enable the application to work with or without a network connection to help build scalable and robust applications.

Use the following services to manage and store mobile application data in the cloud.

## Visual Studio App Center
[App Center Data](/appcenter/data/) is a data management service. It enables applications to manage, persist, and sync application data in the cloud across different devices and platforms in online and offline scenarios. Built on top of Azure Cosmos DB, App Center Data scales as your user base and number of applications grow. It ensures low latency, high availability, and high scalability for all of your data.

**Key features**
- Easy provisioning to a new Azure Cosmos DB database or an existing Azure Cosmos DB database from the Visual Studio App Center portal.
- NoSQL database support to easily store, sync, and query application data.
- Built on top of Azure Cosmos DB, this service inherits most of the key features offered by Azure Cosmos DB and can scale globally to meet your business needs.
- Online and offline sync capabilities to synchronize data across devices.
- Mobile client SDKs that you can use to easily manage private application data.
- Platform support for iOS, Android, Xamarin, and React Native.

**References**
- [Sign up with Visual Studio App Center](https://appcenter.ms/signup?utm_source=Mobile%20Development%20Docs&utm_medium=Azure&utm_campaign=New%20azure%20docs)
- [Get started with App Center Data](/appcenter/data/getting-started)

## Azure Cosmos DB
[Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) is a globally distributed, multi-model database service. You can use it to build planet-scale applications. With Azure Cosmos DB, you can elastically and independently scale throughput and storage across any number of Azure regions worldwide. You can take advantage of fast, single-digit-millisecond data access by using your favorite API surfaces. These surfaces include SQL, MongoDB, Cassandra, Tables, or Gremlin. Azure Cosmos DB uniquely provides comprehensive service level agreements (SLAs) for throughput, latency, availability, and consistency.

**Key features**
- Supports a wide range of APIs, which includes the SQL (Core) API, Cassandra API, MongoDB API, Gremlin API, and Table API.
- Turnkey global distribution replicates your data wherever your users are. Your users can interact with a replica of the data that's closest to them.
- No schema or index management because the database engine is fully schema agnostic.
- Ubiquitous regional presence because Azure Cosmos DB is available in all Azure regions worldwide, which includes 54+ regions in the public cloud.
- Precisely defined, multiple consistency choices because Azure Cosmos DB's multi-master replication protocol is carefully designed to offer five well-defined consistency choices. These five choices are strong, bounded staleness, session, consistent prefix, and eventual.
- 99.999% availability for both reads and writes.
- Programmatically (or via the Azure portal) invoke the regional failover of your Azure Cosmos DB account to ensure that your application is designed to withstand a regional disaster.
- Guaranteed low latency at the 99th percentile worldwide.

**References**
- [Azure portal](https://portal.azure.com) 
- [Azure Cosmos DB documentation](/azure/cosmos-db/introduction)

## Azure SQL Database
 [Azure SQL Database](https://azure.microsoft.com/services/sql-database/) is a general-purpose relational database managed service. You can use it to create a highly available and high-performance data storage layer for applications and solutions in the Azure cloud.

**Key features**
- **Elastic database models and tools:** With an elastic database, developers can pool resources among a group of databases for scaling. To administratively manage these resources, you submit a script as a job. The SQL database then performs the script across the databases.
- **High performance:** High-throughput applications can take advantage of the latest version. It delivers 25% more premium database power.
- **Backups, replication, and high availability:** Built-in replication and a Microsoft-backed SLA at the database level provide application continuity and protection against catastrophic events. Active geo-replication lets you configure failover and self-service restore, which provide full control over "oops recovery." Data restoration is available from data backups of up to 35 days.
- **Near-zero maintenance:** Automatic software is part of the service. Built-in system replicas help to deliver inherent data protection, database uptime, and system stability. System replicas are automatically moved to new computers. They're provisioned on the fly as old ones fail.
- **Security:** Azure SQL Database offers a portfolio of security features to meet organizational or industry-mandated compliance policies:
    - Auditing provides developers the ability to perform compliance-related tasks and to gain knowledge about activities.
    - Developers and IT can implement policies at the database level to help limit access to sensitive data with row-level security, dynamic data masking, and transparent data encryption for Azure SQL Database.
    - Azure SQL Database is verified by key cloud auditors as part of the scope of key Azure compliance certifications and approvals, such as HIPAA BAA, ISO/IEC 27001:2005, FedRAMP, and EU Model Clauses.

**References**
- [Azure portal](https://portal.azure.com) 
- [Azure SQL Database documentation](/azure/sql-database/) 
