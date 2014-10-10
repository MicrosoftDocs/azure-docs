<properties title="SharePoint Server Farm Configuration Details" pageTitle="SharePoint Server Farm Configuration Details" description="Describes the default configuration of SharePoint farms" metaKeywords="" services="virtual-machines" solutions="" documentationCenter="" authors="josephd" videoId="" scriptId="" manager="timlt"/>

<tags ms.service="virtual-machines" ms.workload="infrastructure-services" ms.tgt_pltfrm="vm-sharepoint" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="josephd" />


#SharePoint Server Farm Configuration Details#

SharePoint Server Farm is a feature of the Microsoft Azure Preview Portal that automatically creates a pre-configured SharePoint Server 2013 farm for you. There are two farm configurations:

- Basic
- High-availability

The following sections provide configuration details for each farm.

For additional information, see [SharePoint Server Farm](../virtual-machines-sharepoint-farm-azure-preview/).

##Basic SharePoint farm##

The basic SharePoint farm consists of three virtual machines in the following configuration:

![sharepointfarm](./media/virtual-machines-sharepoint-farm-config-azure-preview/SPFarm_Basic.png) 

Here are the configuration details:

-	Azure Subscription: Specified during the initial configuration.
-	Azure Domain Names (also known as cloud services): Separate Domain Names are automatically created for each virtual machine.
-	Storage account: Specified during the initial configuration.
-	Virtual network 	
	-   Type: Cloud-only	
    -	Address space: 192.168.16.0/26    

- Virtual machines
	-	HostNamePrefix-DC (AD DS domain controller)
	-	HostNamePrefix-SQL (SQL Server 2014 server)
	-	HostNamePrefix-SP (SharePoint 2013 server)

- Domain controller
	-	Host name prefix: Specified during the initial configuration.
	-	Size: A1 (default)
	-	Domain name: contoso.com (default)
	-	Domain administrator account name: Specified during the initial configuration.
	-	Domain administrator account password: Specified during the initial configuration.

- SQL Server
	-	Host name prefix: Specified during the initial configuration.
	-	Size: A5 (default)
	-	Database access account name: Specified during the initial configuration.
	-	Database access account password: Specified during the initial configuration.
	-	SQL Server service account name: Specified during the initial configuration.
	-	SQL Server service account password: Specified during the initial configuration.

- SharePoint server
	-	Host name prefix: Specified during the initial configuration.
	-	Size: A2 (default)
	-	SharePoint farm account name: Specified during the initial configuration.
	-	SharePoint farm account password: Specified during the initial configuration.
	-	SharePoint farm passphrase: Specified during the initial configuration.


##High-availability##

The high-availability SharePoint farm consists of nine virtual machines in the following configuration:

![sharepointfarm](./media/virtual-machines-sharepoint-farm-config-azure-preview/SPFarm_HighAvail.png)
 
Here are the configuration details:

-	Azure Subscription: Specified during the initial configuration.
-	Azure Domain Names (also known as cloud services): Separate Domain Names are automatically created for each virtual machine.
-	Storage account: Specified during the initial configuration.
-	Virtual network	
	-	Type: Cloud-only
	-	Address space: 192.168.16.0/26	

-	Virtual machines
	-	HostNamePrefix-DC1 (AD DS domain controller)
	-	HostNamePrefix-DC2 (AD DS domain controller)
	-	HostNamePrefix-SQL1 (SQL Server 2014 server)
	-	HostNamePrefix-SQL2 (SQL Server 2014 server)
	-	HostNamePrefix-SQL0 (SQL Server 2014 server)
	-	HostNamePrefix-WEB1 (SharePoint 2013 server)
	-	HostNamePrefix-WEB2 (SharePoint 2013 server)
	-	HostNamePrefix-APP1 (SharePoint 2013 server)
	-	HostNamePrefix-APP2 (SharePoint 2013 server)

-	Domain controllers
	-	Host name prefix: Specified during the initial configuration.
	-	Size: A1 (default)
	-	Domain name: contoso.com (default)
	-	Domain administrator account name: Specified during the initial configuration.
	-	Domain administrator account password: Specified during the initial configuration.

-	SQL Servers
	-	Host name prefix: Specified during the initial configuration.
	-	Size: A5 (default)
	-	Database access account name: Specified during the initial configuration.
	-	Database access account password: Specified during the initial configuration.
	-	SQL Server service account name: Specified during the initial configuration.
	-	SQL Server service account password: Specified during the initial configuration.

-	SharePoint servers
	-	Host name prefix: Specified during the initial configuration.
	-	Size: A2 (default)
	-	SharePoint farm account name: Specified during the initial configuration.
	-	SharePoint farm account password: Specified during the initial configuration.		
	-	SharePoint farm passphrase: Specified during the initial configuration.

