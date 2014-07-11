<properties title="SharePoint Farm Configuration Details" pageTitle="SharePoint Farm Configuration Details" description="Describes how to configure a SharePoint farm in the Azure Preview Portal" metaKeywords="" services="virtual-machines" solutions="" documentationCenter="" authors="josephd" videoId="" scriptId="" />

#SharePoint Farm Configuration Details#

SharePoint Farm is a feature of the Microsoft Azure Preview Portal that automatically creates a pre-configured SharePoint Server 2013 farm for you. There are two farm configurations:

- Basic
- High-availability

The following sections provide configuration details for each farm.

For additional information, see [SharePoint Farm](http://go.microsoft.com/fwlink/?LinkId=403153).

##Basic SharePoint farm##

The basic SharePoint farm consists of three virtual machines in the following configuration:

![sharepointfarm](./media/virtual-machines-sharepoint-farm-config-azure-preview/SPFarm_Basic.png) 

Here are the configuration details:

-	Azure Subscription: Specified during the initial configuration.
-	Azure Domain Names (also known as cloud services): Separate Domain Name automatically created for each virtual machine automatically.
-	Storage account: Specified during the initial configuration.
-	Virtual network 	
	-   Type: Cloud-only	
    -	DNS server:	10.20.2.4 (the IP address of DC)    

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
	-	Size: A3 (default)
	-	SharePoint farm account name: Specified during the initial configuration.
	-	SharePoint farm account password: Specified during the initial configuration.
	-	SharePoint farm passphrase: Specified during the initial configuration.


##High-availability##

The high-availability SharePoint farm consists of nine virtual machines in the following configuration:

![sharepointfarm](./media/virtual-machines-sharepoint-farm-config-azure-preview/SPFarm_HighAvail.png)
 
Here are the configuration details:

-	Azure Subscription: Specified during the initial configuration.
-	Azure Domain Names (also known as cloud services): Separate Domain Name automatically created for each virtual machine.
-	Storage account: Specified during the initial configuration.
-	Virtual network	
	-	Type: Cloud-only
	-	DNS server: 10.20.2.4 (the IP address of DC1)	

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
	-	Size: A3 (default)
	-	SharePoint farm account name: Specified during the initial configuration.
	-	SharePoint farm account password: Specified during the initial configuration.		
	-	SharePoint farm passphrase: Specified during the initial configuration.

