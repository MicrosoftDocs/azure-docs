<properties 
	title="Elastic database job (preview) pricing" 
	pageTitle="Elastic database job (preview) pricing" 
	description="Details about pricing and default setup" 
	metaKeywords="azure sql database elastic databases pricing" 
	services="sql-database" documentationCenter=""  
	manager="jeffreyg" 
	authors="sidneyh"/>

<tags 
	ms.service="sql-database" 
	ms.workload="sql-database" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/21/2015" 
	ms.author="sidneyh" />

# Elastic database job (preview) pricing 

The elastic database job (preview) uses four Azure components that incur charges. These services are created and named automatically during setup. For more information, see [Elastic jobs overview](sql-database-elastic-jobs-overview.md). The services are identifiable as they all have the same auto-generated name. The name is unique, and consists of the prefix "edj" followed by 21 characters.

## Service components 

### Azure Cloud Services

The default deployed service runs with the minimum of two worker roles for high availability. The default size of each worker role (ElasticDatabaseJobWorker) runs on an A0 instance. For pricing, see [Cloud services pricing](http://azure.microsoft.com/pricing/details/cloud-services/).
### Azure SQL Database (control database)

The service uses an Azure SQL Database known as the **control database** to hold metadata. The metadata about the elastic database pool allows the elastic job to log into each database and execute a script. The default service tier is a S0. For pricing, see [SQL Database Pricing](http://azure.microsoft.com/pricing/details/sql-database/).

### Azure Service Bus

A Service Bus Queue is used to coordinate the execution of the work. See [Service Bus Pricing](http://azure.microsoft.com/pricing/details/service-bus/).

### Azure Storage Account

The cloud service uses storage for output logging in the event that an issue requires further debugging (a common practice for [Azure diagnostics](cloud-services-dotnet-diagnostics.md)). For pricing, see [Azure Storage Pricing](http://azure.microsoft.com/pricing/details/storage/).

  </tr>
</table>


 

[AZURE.INCLUDE [elastic-scale-include](../includes/elastic-scale-include.md)]

<!--Image references-->
[1]: ./media/sql-database-elastic-jobs-overview/elastic-jobs.png
<!--anchors-->

