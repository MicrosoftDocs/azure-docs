---
title: Blob interoperability | Microsoft Docs
description: Some sort of description goes here.
services: storage
author: normesta

ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 04/26/2019
ms.author: normesta

---
# Blob and Azure Data Lake Storage Gen2 interoperability

Now, you can use existing blob storage features with Data Lake Storage Gen2. This means that features such as Create, Read, Update, and Delete (CRUD) operations, and diagnostic logs work with blob storage accounts that have a hierarchical namespace.

Storing your data in the cloud has typically been fraught with using different types of storage based on the use case.  For example, traditionally object storage has been used for backup and archive scenarios and analytics storage used for data processing and analytics.  This was hard to maintain because data was stored in multiple places and data movement was needed to get data to different forms of storage.  Additionally, developers needed to build and maintain applications for these disparate storage solutions because they had different protocols.  Furthermore, the supporting ecosystem typically had to build a different connector for each separate storage solution, which takes a lot of work and an extended period of time before you can get a full and rich ecosystem.  

In the past, you've had to use different types of storage based on your use case. For example, you might have used object storage for backup and archive scenarios and analytics storage for processing and analytics. This can be hard to maintain because data is stored in multiple places. 

- You have to move data between different types of storage. 

- Developers have to build and maintain separate applications for each storage solutions.  That's because each of them required different protocols. 

- Ecosystem providers have to build a different connector for each storage solution. 

  Because these connectors take a lot of work to build, you have to wait for an extended period of time before you can get a full and rich ecosystem.
 
A true data lake encompasses the capability to have multiple data access methods on all types of data, including unstructured, semi-structured, and structured data.  Having one central storage solution eliminates the need for multiple forms of storage and their associated overhead.  Providing multiple data access points to shared data sets allow tools and data applications to interact with the data in their most natural way.  Additionally, this allows your data lake to benefit from the tools and frameworks built for a wide variety of ecosystems.       
 
From a technical standpoint, Blob APIs and ADLS APIs can interoperate over the same data with the ADLS Hierarchical Namespace feature enabled.  The Blob APIs are routed through the Hierarchical Namespace so you get the benefits of first-class directory operations and POSIX-compliant Access Control Lists.  Existing tools and applications that use the Blob API gain these benefits without any modification.  Directory and file-level ACLs are consistently applied regardless of which protocol is used to access the data.

![Interop conceptual](./media/data-lake-storage-interop/interop-concept.png)    

# The features
diagnostic logs, SDKs, Powershell support, tiering, lifecycle management policies, and change notifications to work with your Data Lake Storage accounts.  Additionally, services such as Stream Analytics, IoT Hub Capture, Event Hubs Capture, and Data Box integrates seamlessly with Data Lake Storage.  This means your Blob data and applications can now be used for analytics.  You will not need to update existing applications to gain access to your data stored in Data Lake Storage.   

## Benefits

Blob interoperability with ADLS Gen2 brings together the best features of Data Lake Storage and Blob into one holistic package.  This unlocks a large number of Blob features and ecosystem support for Data Lake Storage as detailed below, and is a first step in moving towards full feature parity:

### Tiering

Cool and Archive tiers are now available for Data Lake Storage.  This is the only built for analytics cloud storage that has different tiers for different temperatures of data.  When your analytics data becomes less accessed, you can move your data to the Cool tier to save on cost without sacrificing performance.  The Cool tier provides you the same level of performance as the Hot tier for a lower data at rest cost.  You can access that data for slightly higher transaction costs or move that data back into the Hot tier if your data becomes more frequently accessed.  The Archive tier gives you a long term storage solution for your analytics data at a greatly reduced rate.  You can store your analytics data until you need it.         

### Lifecycle Management Policies 

You can now easily set policies to tier your data using Lifecycle Management Policies.  Instead of manually tiering data or writing scripts to tier data, you can use Lifecycle Management Policies to move or delete your data after the number of days that meet your analytics needs or data retention policies. 

### SDKs

Java, .NET, and Python SDKs are now available on Data Lake Storage.  With Blob interoperability with Data Lake Storage, you have one SDK for Data Lake Storage that can perform all your management and data plane operations.  You can easily use these SDKs to build your custom applications and manage your Data Lake Storage.  

#### Powershell

Powershell support for Data Lake Storage is now available.  You can use Powershell cmdlets to manager and interact with your data.  

#### Logging

Data Lake Storage customers now have diagnostic logs for both APIs available for consumption.  Both logs v1 and logs v2 will be supported so you can find out who did what operation for auditing purposes.  Diagnostic logs also provide you with the capability to do error detection and troubleshooting.  

#### Azure Ecosystem 

Blob Interoperability with ADLS Gen2 enables the Azure first party ecosystem to 
-	Azure Stream Analytics: Need this from ASA team 
-	IoT Hub: IoT Hub message routing now allows routing to Azure Data Lake Storage Gen 2 in preview in addition to Azure blob storage. Users can use the IoT Hub Create or Update REST API, specifically the RoutingStorageContainerProperties, the Azure portal, Azure CLI, or the Azure Powershell to route to Azure storage and select a storage account that is compatible with ADLS Gen 2.
-	Data Box: Need this from Data Box team

#### Partner Ecosystem (insert Azure Friday link)

Blob Interoperability with ADLS Gen2 lights up the existing Blob partner ecosystem for Data Lake Storage.  3rd party partners that have an existing Blob connector can use the same connector to connect to Data Lake Storage.  This means the ecosystem for Data Lake Storage is vastly accelerated so that you can quickly use your choice of tools and services on Data Lake Storage.  

#### Custom Blob Applications

With Blob Interoperability with Data Lake Storage, existing custom-built Blob applications will work on Data Lake Storage.  You can move you Blob data to Data Lake Storage and run the same applications on Data Lake Storage by merely repointing the destination of your storage account.  The enables you to easily bring together your Blob applications while leveraging the performance and features of Data Lake Storage.  
