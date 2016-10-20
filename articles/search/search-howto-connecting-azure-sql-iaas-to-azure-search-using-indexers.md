<properties 
	pageTitle="Configure a connection from an Azure Search indexer to SQL Server on an Azure virtual machine | Microsoft Azure | Indexers" 
	description="Enable encrypted connections and configure the firewall to allow connections to SQL Server on an Azure virtual machine (VM) from an indexer on Azure Search." 
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
	ms.date="09/06/2016" 
	ms.author="jackma"/>

# Configure a connection from an Azure Search indexer to SQL Server on an Azure VM

As noted in [Connecting Azure SQL Database to Azure Search using indexers](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers-2015-02-28.md#frequently-asked-questions), creating indexers against **SQL Server on Azure VMs** (or **SQL Azure VMs** for short) is supported by Azure Search, but there are two security-related prerequisites to take care of first. 

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-both-include.md)]

## Enable encrypted connections

Azure Search requires a secure connection to read data from your database. This means that you need to enable encrypted connections on your SQL Azure VM by configuring an SSL certificate.

The steps for enabling encrypted connections to SQL Server are documented in [Enable Encrypted Connections to the Database Engine](https://msdn.microsoft.com/library/ms191192.aspx), but for public internet connections, such as a connection from Azure Search to a SQL Azure VM, there are a few additional requirements to make this work.

### Specify an FQDN in the SSL certificate

The subject name of the SSL certificate must be the fully qualified domain name (or **FQDN**) of the SQL Azure VM. It's the same FQDN you'll specify in the database connection string when creating a data source in your search service. An FQDN is formatted as `<your-VM-name>.<region>.cloudapp.azure.com` for **Resource Manager** VMs. If you are still on **classic** VMs, it is formatted as `<your-cloud-service-name.cloudapp.net>`. You can find the FQDN of your SQL Azure VM as the DNS name/label in the [Azure portal](https://portal.azure.com/).

### Use REGEDIT to configure the SSL certificate

SQL Server Configuration Manager is not able to show the FQDN SSL certificate in the **Certificate** dropdown as described in the documentation. The workaround is to configure the SSL certificate by editing this registry key: **HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Microsoft SQL Server\[MSSQL13.MSSQLSERVER]\MSSQLServer\SuperSocketNetLib\Certificate**. The *[MSSQL13.MSSQLSERVER]* part varies based on your SQL Server version and instance name. This key needs to be updated with the **thumbprint** of the SSL certificate you installed on the SQL Azure VM.

### Grant permissions to the service account

Make sure the SQL Server service account is granted appropriate permission on the private key of the SSL certificate. If you overlook this step, SQL Server will not start.

## Configure the firewall to allow connections from Azure Search

It is not unusual to configure the firewall and corresponding Azure endpoint or access control list (ACL) to make your Azure VM accessible from other parties. Chances are you have done this configuration already to allow your own application logic to connect to your SQL Azure VM. It's no different for an Azure Search connection to your SQL Azure VM. If you haven't done this yet, here are a few good security practices to keep in mind.

If you are using **Resource Manager** VMs, see [Connect to a SQL Server Virtual Machine on Azure using Resource Manager](../virtual-machines/virtual-machines-windows-sql-connect.md). If you are still on **classic** VMs, see [Connect to a SQL Server Virtual Machine on Azure Classic](../virtual-machines/virtual-machines-windows-classic-sql-connect.md).

### Restrict access to the search service IP address

For either deployment model, when configuring connections from Azure Search, we strongly recommend that you restrict the access to the IP address of your search service in the ACL instead of making your SQL Azure VMs wide open to any connection requests. You can easily find out the IP address by pinging the FQDN (for example, `<your-search-service-name>.search.windows.net`) of your search service.

### Configure an IP address range

Note that if your search service has only one search unit (that is, one replica and one partition), the IP address may change during routine service restarts. To avoid connection failures, you should specify the IP address range of the Azure region where your search service is provisioned. The list of IP ranges from which public IP addresses are allocated to Azure resources is published at [Azure Datacenter IP ranges](https://www.microsoft.com/download/details.aspx?id=41653).

### Include the Azure Search portal IP addresses

Additionally, if you are using the Azure portal to create an indexer, Azure Search portal logic also needs access to your SQL Azure VM during creation time. Azure search portal IP addresses can be found by pinging `stamp1.search.ext.azure.com` and `stamp2.search.ext.azure.com`.

## Next steps

With the above configuration requirements out of the way, you can now specify a SQL Server on Azure VM as the data source for an Azure Search indexer. See [Connecting Azure SQL Database to Azure Search using indexers](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers-2015-02-28.md) for more information.
