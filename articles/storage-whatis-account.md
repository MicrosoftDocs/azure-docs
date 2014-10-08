<properties urlDisplayName="What is a Storage Account" pageTitle="What is a storage account? | Microsoft Azure" metaKeywords="" description="Learn about the different types of storage accounts available in Azure, and get definitions for key storage terms." metaCanonical="" services="storage" documentationCenter="" title="What is a Storage Account?" authors="tamram" solutions="" manager="adinah" editor="cgronlun" />

<tags ms.service="storage" ms.workload="storage" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="tamram" />





#What is a Storage Account?

Azure Storage includes three services: Blob storage, Table storage, and Queue storage. These services are included in every storage account. A storage account provides your unique namespace for working with blobs, queues, and tables.

For information about storage account limits, see [Azure Storage Scalability and Performance Targets](http://msdn.microsoft.com/en-us/library/dn249410.aspx).

All of the information about your storage account, including when it was created, is available in the Management Portal, on the **Dashboard** page for **Storage**.

Storage costs are based on four factors: storage capacity, replication scheme, storage transactions, and data egress. Storage capacity refers to how much of your storage account allotment you are using to store data. The cost of simply storing your data is determined by how much data you are storing, and how it is replicated. Transactions refer to all read and write operations to Azure Storage. Data egress refers to data transferred out of an Azure region. When the data in your storage account is accessed by an application that is not running in the same region, whether that application is a cloud service or some other type of application, then you are charged for data egress. (For Azure services, you can take steps to group your data and services in the same data centers to reduce or eliminate data egress charges.)  

The [Storage Pricing Details](http://www.windowsazure.com/en-us/pricing/details/#storage) page provides detailed pricing information for storage capacity, replication, and transactions. The [Data Transfers Pricing Details](http://www.windowsazure.com/en-us/pricing/details/data-transfers/) provides detailed pricing information for data egress.

##Storage Account Concepts

### Storage account replication options

[WACOM.INCLUDE [storage-replication-options](../includes/storage-replication-options.md)]


### Storage account endpoints 

The *endpoints* for a storage account represent the highest level of the namespace for accessing blobs, tables, queues, or files. The default endpoints for a storage account have the following formats: 

- Blob service: http://*mystorageaccount*.blob.core.windows.net

- Table service: http://*mystorageaccount*.table.core.windows.net

- Queue service: http://*mystorageaccount*.queue.core.windows.net

- File service: http://*mystorageaccount*.file.core.windows.net

The URL for accessing an object in a storage account is built by appending the object's location in the storage account to the endpoint. For example, a blob address might have this format: http://*mystorageaccount*.blob.core.windows.net/*mycontainer*/*myblob*.

### Storage account security

When you create a storage account, Azure generates two 512-bit storage access keys, which are used for authentication when the storage account is accessed. By providing two storage access keys, Azure enables you to regenerate the keys with no interruption to your storage service or access to that service.

We recommend that you avoid sharing your storage account access keys with anyone else. If you feel that your account has been compromised, you can regenerate your access keys from within the portal. Select your storage account and choose **Manage Access Keys**.

To permit access to storage resources without giving out your access keys, you can use a *shared access signature*. A shared access signature provides access to a resource in your account for an interval that you define and with the permissions that you specify. See the [shared access signature tutorial](../storage-dotnet-shared-access-signature-part-1/) for more information.

### Storage account metrics and logging

- **minimal vs. verbose metrics**   You can configure minimal or verbose metrics in the monitoring settings for your storage account. *Minimal metrics* collects metrics on data such as ingress/egress, availability, latency, and success percentages, which are aggregated for the Blob, Table, and Queue services. *Verbose metrics* collects operations-level detail in addition to service-level aggregates for the same metrics. Verbose metrics enable closer analysis of issues that occur during application operations. For the full list of available metrics, see [Storage Analytics Metrics Table Schema](http://msdn.microsoft.com/en-us/library/windowsazure/hh343264.aspx). For more information about storage monitoring, see [About Storage Analytics Metrics](http://msdn.microsoft.com/en-us/library/windowsazure/hh343258.aspx).

- **logging**   Logging is a configurable feature of storage accounts that enables logging of requests to read, write, and delete blobs, tables, and queues. You configure logging in the Azure Management Portal, but you can't view the logs in the Management Portal. The logs are stored and accessed in the storage account, in the $logs container. For more information, see [Storage Analytics Overview](http://msdn.microsoft.com/en-us/library/windowsazure/hh343268.aspx).

### Affinity groups for co-locating Azure Storage and other services

An *affinity group* is a geographic grouping of your Azure services and VMs with your Azure storage account. An affinity group can improve service performance by locating computer workloads in the same data center or near the target user audience. Also, no billing charges are incurred for egress when data in a storage account is accessed from another service that is part of the same affinity group.

