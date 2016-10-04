<properties
	pageTitle="Azure Government documentation | Microsoft Azure"
	description="This provides a comparision of features and guidance on developing applications for Azure Government"
	services="Azure-Government"
	cloud="gov" 
	documentationCenter=""
	authors="ryansoc"
	manager="zakramer"
	editor=""/>

<tags
	ms.service="multiple"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="azure-government"
	ms.date="09/30/2016"
	ms.author="ryansoc"/>


#  Azure Government Data and Storage

##  Azure Storage

For details on this service and how to use it, see [Azure Storage public documentation](https://azure.microsoft.com/documentation/services/storage/).

### Variations

The URLs for storage accounts in Azure Government are different:

Service Type|Azure Public|Azure Government
---|---|---
Blob Storage|*.blob.core.windows.net|*.blob.core.usgovcloudapi.net
Queue Storage|*.queue.core.windows.net|*.queue.core.usgovcloudapi.net
Table Storage|*.table.core>[AZURE.NOTE] *.table.core.usgovcloudapi.net

>[AZURE.NOTE] All of your scripts and code needs to account for the appropriate endpoints.  See [Configure Azure Storage Connection Strings](../storage-configure-connection-string.md#creating-a-connection-string-to-the-explicit-storage-endpoint). 

For more information on APIs see the <a href="https://msdn.microsoft.com/en-us/library/azure/mt616540.aspx"> Cloud Storage Account Constructor</a>.

The endpoint suffix to use in these overloads is core.usgovcloudapi.net 

### Considerations

The following information identifies the Azure Government boundary for Azure Storage:

| Regulated/controlled data permitted | Regulated/controlled data not permitted |
|--------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Data entered, stored, and processed within an Azure Storage product can contain export controlled data. Static authenticators, such as passwords and smartcard PINs for access to Azure platform components. Private keys of certificates used to manage Azure platform components. Other security information/secrets, such as certificates, encryption keys, master keys, and storage keys stored in Azure services. | Azure Storage metadata is not permitted to contain export controlled data. This metadata includes all configuration data entered when creating and maintaining your storage product.  Do not enter Regulated/controlled data into the following fields:  Resource groups, Deployment names, Resource names, Resource tags  

##  Premium Storage

For details on this service and how to use it, see [Premium Storage: High-Performance Storage for Azure Virtual Machine Workloads](../storage/storage-premium-storage.md).

###  Variations

Premium Storage is generally available in the USGov Virginia. This includes DS-series Virtual Machines. 

### Considerations

The same storage data considerations listed above apply to premium storage accounts. 

##  SQL Database

Refer to the<a href="https://msdn.microsoft.com/en-us/library/bb510589.aspx"> Microsoft Security Center for SQL Database Engine </a> and [Azure SQL Database Public Documentation](https://azure.microsoft.com/documentation/services/sql-database/) for additional guidance on metadata visibility configuration, and protection best practices.

### Variations

SQL V12 Database is generally available in Azure Government.

The Address for SQL Azure Servers in Azure Government is different:

Service Type|Azure Public|Azure Government
---|---|---
SQL Database|*.database.windows.net|*.database.usgovcloudapi.net

### Considerations

The following information identifies the Azure Government boundary for Azure Storage:

| Regulated/controlled data permitted | Regulated/controlled data not permitted |
|--------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| All data stored and processed in Microsoft Azure SQL can contain Azure Government-regulated data. You must use database tools for data transfer of Azure Government-regulated data. | Azure SQL metadata is not permitted to contain export controlled data. This metadata includes all configuration data entered when creating and maintaining your storage product.  Do not enter regulated/controlled data into the following fields: Database name, Subscription name, Resource groups, Server name, Server admin login, Deployment names, Resource names, Resource tags

##  Next Steps

For supplemental information and updates subscribe to the
<a href="https://blogs.msdn.microsoft.com/azuregov/">Microsoft Azure Government Blog. </a>
