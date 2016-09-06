<properties 
	pageTitle="Connecting SQL Server on Azure VMs to Azure Search Using Indexers | Microsoft Azure | Indexers" 
	description="Learn how to pull data from SQL Server on Azure VMs to an Azure Search index using indexers." 
	services="search" 
	documentationCenter="" 
	authors="jack4it" 
	manager="pablocas" 
	editor=""/>

<tags 
	ms.service="search" 
	ms.devlang="rest-api" 
	ms.workload="search" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.date="08/30/2016" 
	ms.author="jackma"/>

# Connecting SQL Server on Azure VMs to Azure Search using indexers

As noted in article [Connecting Azure SQL Database to Azure Search using indexers](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers-2015-02-28.md), creating indexers against **SQL Server on Azure VMs** (or **SQL Azure VMs** for short) is well supported by Azure Search; however, also as noted in the [Frequently asked questions](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers-2015-02-28.md##frequently-asked-questions) section, there are some prerequisite work in order to let Azure Search connect to your SQL Azure VMs. Essentially two things have to be taken care of, both are security related. They are not huge efforts but somehow tricky. In this article we’ll discuss the details of these prerequisites.

Firstly, Azure Search only uses secure connections to read data from your database. This means that you need to enable encrypted connections on your SQL Azure VMs, by configuring an SSL certificate. Secondly, you need to configure the firewall on your SQL Azure VMs to allow access to the IP address of your search service.

## Enable encrypted connections on SQL Azure VMs

The steps to enable encrypted connections for SQL Server are well described in this [SQL Server technical documentation](https://msdn.microsoft.com/en-us/library/ms191192.aspx). You can generally follow these instructions to configure an SSL certificate to enable the encrypted connections for your SQL Azure VMs. But a few more things are not very obvious in the documentation and worth pointing out here:

1. The subject name of the SSL certificate has to be the fully qualified domain name (or **FQDN**) of the SQL VM. It's the same FQDN you'll specify in the database connection string when creating a data source in your search service. You can find the FQDN of your SQL Azure VM in the [Azure portal](https://portal.azure.com/).

2. SQL Server Configuration Manager is not able to show the FQDN SSL certificate in the **Certificate** drop down as described in the documentation. Instead of using SQL Server Configuration Manager, you'll have to configure the SSL certificate by editing this registry key: **HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Microsoft SQL Server\[MSSQL13.MSSQLSERVER]\MSSQLServer\SuperSocketNetLib\Certificate**. The *[MSSQL13.MSSQLSERVER]* part varies based on your SQL Server version and instance name. This key needs to be updated with the **thumbprint** of the SSL certificate you installed on the SQL Azure VM.

3. Another thing already described in the documentation but often gets overlooked is that, the service account under which your SQL Server is running has to be granted appropriate permission on the private key of the SSL certificate. Without taking care of this, SQL Server will not be able to start.

## Configure SQL Azure VMs firewall to allow connections from search services

It is not unusual to configure the VM firewall and corresponding Azure endpoint and/or access control list (ACL) to make your Azure VM accessible from other parties. Chances are you have done this already to allow your own application logic to connect to your SQL Azure VMs. It's no different between Azure Search and your own application logic regarding allowing connections to your SQL Azure VMs. If you haven't done this yet, here are a few pointers of the instructions and things to keep in mind for good security practices:

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-both-include.md)]

1. If you are using **Resource Manager** VMs, see [Connect to a SQL Server Virtual Machine on Azure using Resource Manager](../virtual-machines/virtual-machines-windows-sql-connect.md). If you are still on **classic** VMs, see [Connect to a SQL Server Virtual Machine on Azure Classic](../virtual-machines/virtual-machines-windows-classic-sql-connect.md).

2. In either deployment model, when configuring to allow connections from Azure Search, we strongly recommend that you restrict the access to the IP address of your search service in the ACL, instead of making your SQL Azure VMs wide open to any sources. You can easily find out the IP address by pinging the FQDN (e.g. azstest.search.windows.net) of your search service.

3. Please note that if your search service has only one Search Unit (i.e. one replica and one partition), the IP address likely will change across regular Azure Search service updates. In this case, you could specify the IP address range of the Azure region where your search service is provisioned. The list of IP ranges from which public IP addresses are allocated to Azure resources is published at [Azure Datacenter IP ranges](https://www.microsoft.com/download/details.aspx?id=41653).

4. Please also note that if you are using the Azure portal to create an indexer, Azure Search portal logic also needs to access your SQL Azure VM during creation time. So that you also need to give access to Azure Search portal. Azure search portal IP addresses can be found out by pinging *stamp1.search.ext.azure.com* and *stamp2.search.ext.azure.com*.

## Summary

With the aforementioned prerequisites in place, connecting SQL Azure VMs to Azure Search using indexers is then a very straightforward process. Please see article [Connecting Azure SQL Database to Azure Search using indexers](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers-2015-02-28.md) for more information.
