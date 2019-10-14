---
title: Cloud Data Storage
description: How to store, manage, and persist application data in the cloud
author: elamalani

ms.assetid: 12344321-0123-4678-8588-ccff02097224
ms.service: vs-appcenter
ms.topic: article
ms.date: 09/05/2019
ms.author: emalani
---

# Store, sync, and query mobile application data from the cloud
No matter what kind of app you are building, you will likely be generating and processing data. User expectations are high and they want the application to work fast and seamlessly, in all circumstances. Most applications work across multiple devices, so when you access your app, you may be accessing it from a desktop or mobile device. Multiple users might be using the application at the same time and sharing data with the expectation of getting instant and real-time access to data.

On top of that, your app users will not always have internet connectivity. Apps are designed and expected to be working with or without internet connection. With all these growing complexities, it's a huge task for developers to choose the right solution for storing and syncing their data to the cloud to provide a great customer experience for their app.

Microsoft provides a variety of services that eliminates the need to spin up servers, pick your database, or worry about scale or security to provide as rich experience as possible. These services provide a great developer experience that lets you store application data in the cloud using SQL or NoSQL solution, sync data on all the devices, and provides functionalities for the app to work with or without a network connection to help build scalable and robust applications.

## Services

### **Visual Studio App Center**
[App Center Data](https://docs.microsoft.com/en-us/appcenter/data/) is a data management service that enables apps to manage, persist, and sync application data in the cloud across different devices and platforms in both online and offline scenarios. **Built on top of Cosmos DB** service that scales as your user base and number of apps grows, this service ensures low latency, high availability, and high scalability for all of your data.

**Key Features**
- Easily **provision a new Cosmos DB database** or **connect to an existing Cosmos DB database** from the App Center portal
- **NoSQL database support** to easily store, sync, and query app data
- **Built on top of Cosmos DB**, this service inherits all the key features offered by Azure Cosmos DB and can **scale globally** to meet your business needs
- **Online and Offline sync** capabilities to synchronize data across devices
- Mobile **Client SDKs** that allow you to easily manage both private and public app data
- **Platform Support** - iOS, Android, Xamarin, React Native

**References**
- [Sign up with App Center](https://appcenter.ms/signup?utm_source=Mobile%20Development%20Docs&utm_medium=Azure&utm_campaign=New%20azure%20docs)
- [Get started with App Center Data](https://docs.microsoft.com/en-us/appcenter/data/getting-started)

### **Azure Cosmos DB**
[Azure Cosmos DB](https://azure.microsoft.com/en-us/services/cosmos-db/) is Microsoft's globally distributed, multi-model database service that helps you build planet-scale applications. With a click of a button, Cosmos DB enables you to elastically and independently scale throughput and storage across any number of Azure regions worldwide. You can elastically scale throughput and storage, and take advantage of fast, single-digit-millisecond data access using your favorite API surfaces including SQL, MongoDB, Cassandra, Tables, or Gremlin. Cosmos DB uniquely provides comprehensive service level agreements (SLAs) for throughput, latency, availability, and consistency.

**Key Features**
- Supports a **wide range of APIs** includes SQL(Core) API, Cassandra API, MongoDB API, Gremlin API and Table API
- **Turnkey global distribution** replicates your data wherever your users are, so your users can interact with a replica of the data that is closest to them
- **No schema or index management** as the database engine is fully schema-agnostic
- **Ubiquitous regional presence** as Cosmos DB is available in all Azure regions worldwide, including 54+ regions in the public cloud
- **Precisely defined, multiple consistency choices** as Cosmos DB’s multi-master replication protocol is carefully designed to offer five well-defined consistency choices - strong, bounded staleness, session, consistent prefix, and eventual
- **99.999% availability** for both reads and writes
- **Programmatically (or via Portal) invoke the regional failover** of your Cosmos account to ensure that your application is designed to withstand a regional disaster
- **Guaranteed low latency at 99th percentile**, worldwide

**References**
- [Azure portal](https://portal.azure.com) 
- [Documentation](https://docs.microsoft.com/en-us/azure/cosmos-db/introduction)   

### **Azure SQL Database**
 [Azure SQL Database](https://azure.microsoft.com/en-us/services/sql-database/) is a general-purpose relational database managed service that enables you to create a highly available and high-performance data storage layer for applications and solutions in Azure cloud.

**Key Features**
- **Elastic database models and tools** - An elastic database gives developers the ability to pool resources to use among a group of databases for scaling, which can then be administratively managed by submitting a script as a job, and the SQL Database performs the script across the databases
- **High performance** - High-throughput applications can take advantage of the latest version, which delivers 25% more premium database power
- **Backups, replication, and high availability** - Built-in replication and a Microsoft-backed SLA at the database level provide app continuity and protection against catastrophic events. Active geo replication, lets you configure failover and self-service restore, which provide full control over “oops recovery” (data restoration from available data backups of up to 35 days)
- **Near-zero maintenance** - Automatic software is part of the service, and built-in system replicas help to deliver inherent data protection, database uptime, and system stability. System replicas are automatically moved to new computers, which are provisioned on the fly as old ones fail
- **Security** - SQL Database offers a portfolio of security features to meet organizational or industry-mandated compliance policies
    - Auditing provides developers the ability to perform compliance-related tasks and to gain knowledge about activities
    - Developers and IT can implement policies at the database level to help limit access to sensitive data with row-level security, dynamic data masking, and transparent data encryption for Azure SQL Database
    - SQL Database is verified by key cloud auditors as part of the scope of key Azure compliance certifications and approvals, such as HIPAA BAA, ISO/IEC 27001:2005, FedRAMP, and EU Model Clauses)

**References**
- [Azure portal](https://portal.azure.com) 
- [Documentation](https://docs.microsoft.com/en-us/azure/sql-database/)
   