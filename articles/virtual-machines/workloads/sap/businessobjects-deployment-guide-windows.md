---
title: SAP BusinessObjects BI platform deployment on Azure for Windows | Microsoft Docs
description: Deploy and configure the SAP BusinessObjects BI platform on Azure for Windows
services: virtual-machines-windows,virtual-network,storage,azure-netapp-files,azure-files,azure-sql
documentationcenter: saponazure
author: dennispadia
manager: juergent
editor: ''
tags: azure-resource-manager
keywords: ''
ms.service: virtual-machines-sap
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 04/08/2021
ms.author: depadia
---

# SAP BusinessObjects BI platform deployment guide for Windows on Azure

This article describes the strategy to deploy the SAP BusinessObjects Business Intelligence (BOBI) platform on Azure for Windows. In this example, two virtual machines (VMs) with Premium SSD-managed disks as their installation directory are configured. Azure SQL Database, a platform as a service (PaaS) offering, is used as the central management service (CMS) and as an audit database. Azure Premium Files, an SMB protocol, are used as a file store that's shared across both VMs. The default Tomcat Java web application and business intelligence (BI) platform application are installed together on both VMs. To load balance the user requests, Azure Application Gateway is used, which has native TLS/SSL offloading capabilities.

This type of architecture is effective for small deployment or nonproduction environments. For production or large-scale deployment, you should separate hosts for web applications and can have multiple BOBI applications hosts, which allows the server to process more information.

![Diagram that shows an SAP BOBI deployment on Azure for Windows.](media/businessobjects-deployment-guide/businessobjects-deployment-windows.png)

In this example, the following product versions and file system layout are used:

- SAP BusinessObjects platform 4.3 SP01 Patch 1
- Windows Server 2019
- SQL Database (Version: 12.0.2000.8)
- Microsoft ODBC driver - msodbcsql.msi (Version: 13.1)

| File system        | Description                                                                                                               | Size (GB)             | Required access  | Storage                    |
|--------------------|---------------------------------------------------------------------------------------------------------------------------|-----------------------|---------------|----------------------------|
| F:          | The  file system for installation of SAP BOBI instance, default Tomcat Web Application, and database drivers (if necessary) | SAP sizing guidelines | Local administrative privileges | Managed Premium disk - SSD |
| \\\azusbobi.file.core.windows.net\frsinput  | The mount directory is for the shared files across all BOBI hosts that will be used as Input Filestore directory | Business need         | Local administrative privileges | Azure NetApp Files         |
| \\\azusbobi.file.core.windows.net\frsoutput | The mount directory is for the shared files across all BOBI hosts that will be used as Output Filestore directory | Business need         | Local administrative privileges | Azure NetApp Files         |

## Deploy a Windows virtual machine via the Azure portal

In this section, we'll create two VMs with a Windows operating system (OS) image for the SAP BOBI platform. The high-level steps to create VMs are as follows:

1. Create a [resource group](../../../azure-resource-manager/management/manage-resource-groups-portal.md#create-resource-groups).

1. Create a [virtual network](../../../virtual-network/quick-create-portal.md#create-a-virtual-network).

   - Don't use a single subnet for all Azure services in an SAP BI platform deployment. Based on SAP BI platform architecture, you might need to create multiple subnets. In this deployment, we'll create two subnets: a BI Application subnet and an Application Gateway subnet.
   - Follow SAP Note [2276646](https://launchpad.support.sap.com/#/notes/2276646) to identify ports for SAP BusinessObjects BI platform communication across different components.
   - SQL Database communicates over port 1433. Outbound traffic over port 1433 should be allowed from your SAP BOBI application servers.
   - In Azure, Application Gateway must be on a separate subnet. For more information, see [Azure Application Gateway](../../../application-gateway/configuration-overview.md).
   - If you're using Azure NetApp Files for file store instead of Azure Files, create a separate subnet for Azure NetApp Files. For more information, see [Guidelines for Azure NetApp Files network planning](../../../azure-netapp-files/azure-netapp-files-network-topologies.md).

1. Create an availability set:

   - To achieve redundancy for each tier in a multi-instance deployment, place VMs for each tier in an availability set. Make sure you separate the availability sets for each tier based on your architecture.

1. Create virtual machine 1 (**azuswinboap1**).

   - You can either use a custom image or choose an image from Azure Marketplace. Based on your need, see [Deploying a VM from the Azure Marketplace for SAP](deployment-guide.md) or [Deploying a VM with a custom image for SAP](deployment-guide.md).

1. Create virtual machine 2 (**azuswinboap2**).
1. Add one Premium SSD disk. It will be used as an SAP BOBI installation directory.

## Provision Azure Premium Files

Before you continue with the setup for Azure Files, familiarize yourself with the [Azure Files](../../../storage/files/storage-files-introduction.md) documentation.

Azure Files offers standard file shares hosted on hard disk-based (HDD-based) hardware, and premium file shares hosted on solid-state disk-based (SSD-based) hardware. For SAP BusinessObjects file store, use Azure premium files.

Azure premium file shares are available with local and zone redundancy in a subset of regions. To find out if premium file shares are currently available in your region, see the [products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=storage) page for Azure. For information about regions that support ZRS, see [Azure storage redundancy](../../../storage/common/storage-redundancy.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json).

### Deploy Azure files storage account and NFS shares

Azure file shares are deployed into storage accounts, which are top-level objects that represent a shared pool of storage. This pool of storage can be used to deploy multiple file shares. Azure supports multiple types of storage accounts for different storage scenarios customers may have, but for SAP BusinessObjects file store you need to create **FileStorage** storage account. It allows you to deploy Azure file shares on premium solid-state disk-based (SSD-based) hardware.

> [!NOTE]
> FileStorage accounts can only be used to store Azure file shares. No other storage resources (blob, containers, queues, and tables) can be deployed in a FileStorage account.

The storage account will be accessed via [private end point](../../../storage/files/storage-files-networking-endpoints.md), deployed in the same virtual network of SAP BOBI Platform. With this setup, the traffic form your SAP system never leaves the virtual network security boundaries. SAP systems often contain sensitive and business critical data and staying within the boundaries of the virtual network is important security consideration for many customers.

If you need to access the storage account from different virtual network, then you can use [Azure VNET peering](../../../virtual-network/virtual-network-peering-overview.md).

#### Azure files storage account

1. To create a storage account via the Azure portal, **Create a resource** > **Storage** > **Storage account**.

1. On the **Basics** tab, complete all required fields to create a storage account:

   1. Select **Subscription**, **Resource group**, and **Region**.

   1. Enter the **Storage account name** (for example, **azusbobi**). This name must be globally unique, but otherwise can provide any name you want.

   1. Select **Premium** as performance tier, and **FileStorage** as account kind.

   1. For Replication label, choose redundancy level. Select **Locally redundant storage (LRS)**.

   For Premium FileStorage, local-redundant storage (LRS) and zone-redundant storage (ZRS) are the only options available. So based on your deployment strategy (availability set or availability zone), choose the appropriate redundancy level. For more information, See [Azure storage redundancy](../../../storage/common/storage-redundancy.md).

   1. Select Next.

1. On **Networking** tab, select [private endpoint](../../../storage/files/storage-files-networking-endpoints.md) as connectivity method. For more information, see [Azure Files networking considerations](../../../storage/files/storage-files-networking-overview.md).

   1. Select **Add** in the private endpoint section.

   1. Select **Subscription**, **Resource group**, and **Location**.

   1. Enter the **Name** of private endpoint (for example, azusbobi-pe).

   1. Select **file** in **storage sub-resource**.

   1. In **Networking** section, select the **Virtual network** and **Subnet** on which SAP BusinessObjects BI application is deployed.

   1. Accept the **default (yes)** for **Integrate with private DNS zone**.

   1. Select your **private DNS zone** from the drop-down.

   1. Select **OK**, to go back to the Networking tab in create storage account.

1. On the **Data protection** tab, configure the soft-delete policy for Azure file shares in your storage account. By default, soft-delete functionality is turned off. To learn more about soft delete, see [How to prevent accidental deletion of Azure file shares](../../../storage/files/storage-files-prevent-file-share-deletion.md).

1. On the **Advanced** tab, check different security options.

   **Secure transfer required** filed indicates whether the storage account requires encryption in transit for communication to the storage account. If you require SMB 2.1 support, you must disable this field. For SAP BusinessObjects BI platform, keep it **default (enabled)**.

1. Continue and create the storage account.

For details on how to create storage account, see [Create FileStorage Storage Account](../../../storage/files/storage-how-to-create-file-share.md).

#### Create Azure file Shares

Next step is to create Azure Files in the storage account. Azure files use a provisioned model for premium file shares. In a provisioned business model, you proactively specify to Azure Files what your storage requirements are, rather than being billed based on what you use. To understand more on this model, see [Provisioned model](../../../storage/files/understanding-billing.md#provisioned-model). In this example, we create two Azure files: **frsinput** (256 GB) and **frsoutput** (256 GB) for the SAP BOBI file store.

Go to the storage account **azusbobi** > **File shares**

1. Select **New File share**.
1. Enter the **Name** of the file share (for example, **frsinput**, **frsouput**)
1. Insert the required file share size in **Provisioned capacity** (for example, 256 GB).
1. Choose **SMB** as **Protocol**.
1. Select **Create**.

## Configure a data disk on a Windows virtual machine

The steps in this section use the following prefixes:

**[A]**: The step applies to all hosts.

### Initialize a new data disk

SAP BusinessObjects BI application requires a partition on which its binaries can be installed. You can install an SAP BOBI application on the OS partition (C: ), but you must make sure to have enough space for the deployment and the OS. It's recommended that you have at least 2 GB available for temporary files and web applications. With all this consideration, it's advisable to separate SAP BOBI installation binaries in separate partition.

In this example, an SAP BOBI application is installed on a separate partition (F: ). Initialize the Premium SSD disk that you attached during the VM provisioning.

1. **[A]** If no data disk is attached to the VM (azuswinboap1 and azuswinboap2), follow the steps in [Add a data disk](../../windows/attach-managed-disk-portal.md#add-a-data-disk) to attach a new managed data disk.
1. **[A]** After the managed disk is attached to the VM, initialize the disk by following the steps in [Initialize a new data disk](../../windows/attach-managed-disk-portal.md#initialize-a-new-data-disk).

### Mount Azure Premium Files

To use Azure Files as a file store, you must mount it, which means you assign it a drive letter or mount point path.

1. **[A]** To mount the Azure file share, follow the steps in [Mount the Azure file share](../../../storage/files/storage-how-to-use-files-windows.md#mount-the-azure-file-share).

To mount Azure file share on Windows server, ensure port 445 is open. The SMB protocol requires TCP port 445 to be open. Connections will fail if port 445 is blocked. You can check if the firewall is blocking port 445 with the `Test-NetConnection` cmdlet mentioned in the [Troubleshooting](../../../storage/files/storage-troubleshoot-windows-file-connection-problems.md#cause-1-port-445-is-blocked) guide.

## Configure a CMS database - Azure SQL

This section provides details on how to provision Azure SQL using Azure portal. It also provides instructions on how to create the CMS and the Audit database for SAP BOBI platform and a user account to access the database.

The guidelines are applicable only if you’re using Azure SQL (DBaaS offering on Azure). For other databases, see SAP or database-specific documentation for instructions.

### Create a SQL Database server

SQL Database offers different deployment options: single database, elastic pool, and database server. For SAP BOBI, we need two databases (CMS and audit). Instead of creating two single databases, you can create a SQL database server that can manage the group of single databases and elastic pools. Follow these steps to create a SQL Database server:

1. Browse to the [Select SQL Deployment option](https://portal.azure.com/#create/Microsoft.AzureSQL) page.
1. Under **SQL databases**, change **Resource type** to **Database server**, and select **Create**.
1. On the **Basics** tab, fill in all the required fields to **Create SQL Database Server**.

   1. Select the **Subscription** and **Resource group** under **Project details**.

   1. Enter **Server name** (for example, **azussqlbodb**). The server name must be globally unique, but otherwise, you can provide any name you want.

   1. Select the **Location**.

   1. Enter **Server admin login** (for example, **boadmin**) and **Password**.

1. On the **Networking** tab, change **Allow Azure services and resources to access this server** to **No** under **Firewall rules**.
1. On **Additional settings**, keep the default settings.
1. Continue and create **SQL Database Server**.

In the next step, create the CMS and the audit databases in the SQL Database server (**azussqlbodb.database.windows.net**).

### Create the CMS and the audit database

After you provision the SQL Database server, browse to the resource **azussqlbodb**. Then follow these steps to create the CMS and audit databases.

1. On the azussqlbodb **Overview** page, select **Create database**.
1. On the **Basics** tab, fill in all the required fields:

   1. Enter the **Database name** (for example, **bocms** or **boaudit**).

   1. On the **Compute + storage** option, select **Configure database**. Choose the appropriate model based on your sizing result. For insight on the options, see [Sizing models for Azure SQL database](businessobjects-deployment-guide.md#sizing-models-for-azure-sql-database).
1. On the **Networking** tab, select [private endpoint](../../../private-link/tutorial-private-endpoint-sql-portal.md) for the connectivity method. The private endpoint will be used to access SQL Database within the configured virtual network.

   1. Select **Add private endpoint**.

   1. Select **Subscription**, **Resource group**, and **Location**.

   1. Enter the **Name** of the private endpoint (for example, azusbodb-pe).

   1. Select **SqlServer** in **Target sub-resource**.

   1. In the **Networking** section, select the **Virtual network** and **Subnet** on which the SAP BusinessObjects BI application is deployed.

   1. Accept the **default (yes)** for **Integrate with private DNS zone**.

   1. Select your **private DNS zone** from the dropdown.

   1. Select **OK** to go back to the **Networking** tab in **Create SQL database**.
1. On the **Additional settings** tab, change the **Collation** setting to **SQL_Latin1_General_CP850_BIN2**.
1. Continue and create the CMS database.

Similarly, you can create the audit database (for example, **boaudit**).

### Download and install ODBC driver

For SAP BOBI application servers to access CMS or audit database, it requires database client/drivers. Microsoft ODBC driver is used to access CMS and Audit databases running on Azure SQL database. This section provides instructions on how to download and set up ODBC driver on Windows. 

1. See the **CMS + Audit repository support by OS** section in [Product Availability Matrix (PAM) for SAP BusinessObjects BI Platform](https://support.sap.com/pam) to find out the database connectors that are compatible with SQL Database.
1. Download the ODBC driver version from the [link](/sql/connect/odbc/windows/release-notes-odbc-sql-server-windows?preserve-view=true&view=sql-server-ver15). In this example, we're downloading ODBC driver [13.1](/sql/connect/odbc/windows/release-notes-odbc-sql-server-windows?preserve-view=true&view=sql-server-ver15#131).
1. Install the ODBC driver on all BI servers (**azuswinboap1** and **azuswinboap2**).
1. After you install the driver in **azuswinboap1**, go to **Start** > **Windows Administrative Tools** > **ODBC Data Sources (64-bit)**.  
1. Go to the **System DSN** tab. 
1. Select **Add** to create a connection to the CMS database.
1. Select **ODBC Driver 13 for SQL Server**, and select **Finish**.
1. Enter the information of your CMS database like the following, and select **Next**.
   - **Name:** *name of database created in section Create CMS and audit database* (for example, **bocms** or **boaudit**)
   - **Description:** *description to describe the data source* (for example, **CMS database** or **Audit database**)
   - **Server:** *name of the SQL server created in the section Create SQL database server* (for example, **azussqlbodb.database.windows.net**)
1. Select “**With SQL server authentication using a login ID and password entered by user**” to verify authenticity to SQL server. Enter the user credential that has been created at the time of Azure SQL database server creation (for example, **boadmin**) and select **Next**.
1. **Change the default database** to **bocms** and keep everything else as default. Select **Next**.
1. Select the **Use strong encryption for data** checkbox, and keep everything else as default. Select **Finish**.
1. The data source to the CMS database has been created, and now you can select **Test Data Source** to validate the connection to the CMS database from the BI application. It should complete successfully. If it fails, [troubleshoot](../../../azure-sql/database/troubleshoot-common-errors-issues.md) the connectivity issue.

>[!Note]
>SQL Database communicates over port 1433. Outbound traffic over port 1433 should be allowed from your SAP BOBI application servers.

Repeat the preceding steps to create connection for the audit database on server **azuswinboap1**. Similarly, install and configure both ODBC data sources (**bocms** and **boaudit**) on all BI application servers (**azuswinboap2**). 

## Server preparation

Follow the latest guide by SAP to prepare servers for the installation of the BI platform. For the most up-to-date information, see the "Preparation" section in [Business Intelligence Platform Installation Guide for Windows](https://help.sap.com/viewer/df8899896b364f6c880112f52e4d06c8/4.3.1/en-US/46b0d1a26e041014910aba7db0e91070.html).

## Installation

To install the BI platform on a Windows host, sign in with a user that has local administrative privileges.

Go to the media of SAP BusinsessObjects BI platform, and run `setup.exe`.

Follow [SAP Business Intelligence Platform Installation Guide for Windows](https://help.sap.com/viewer/df8899896b364f6c880112f52e4d06c8/4.3.1/en-US/46ae62456e041014910aba7db0e91070.html), specific to your version. Few points to not while installing SAP BOBI platform on Windows. 

- On the **Configure Destination Folder** screen, provide the destination folder where you would like to install BI platform. (for example, F:\SAP BusinessObjects\). 
- On the **Configure Product Registration** screen, you can either use a temporary license key for SAP BusinessObjects Solutions from SAP Note [1288121](https://launchpad.support.sap.com/#/notes/1288121), or you can generate license key in SAP Service Marketplace.
- On the **Select Install Type** screen, select **Full** installation on first server (**azuswinboap1**), and for the other server (azuswinboap2) select **Custom / Expand**, which expands the existing BOBI setup.
- On **Select Default or Existing Database** screen, select **configure an existing database**, which will prompt you to select CMS and Audit database. Select **Microsoft SQL Server using ODBC** for the **CMS Database** type and the **Audit Database** type.

  You can also select **No auditing database**, if you don't want to configure auditing during installation.

- Select the appropriate options on the **Select Java Web Application Server** screen based on your SAP BOBI architecture. In this example, we've selected option 1, which installs a Tomcat server on the same SAP BOBI platform.
- Enter CMS database information in **Configure CMS Repository Database - SQL Server (ODBC)**. The following image shows example input for CMS database information for Windows installation.
  
  ![Screenshot that shows the CMS database information for Windows.](media/businessobjects-deployment-guide/businessobjects-deployment-windows-sql-cms.png)
- (Optional) Enter Audit database information in **Configure Audit Repository Database - SQL Server (ODBC)**. The following image shows example input for Audit database information for Windows installation.
  
  ![Screenshot that shows the audit database information for Windows.](media/businessobjects-deployment-guide/businessobjects-deployment-windows-sql-audit.png)

- Follow the instructions, and enter the required inputs to finish the installation.

For a multi-instance deployment, run the installation setup on the second host (**azuswinboap2**). During **Select Install Type** screen, select **Custom / Expand**, which expands the existing BOBI setup. For more information, see the SAP blog [SAP BusinessObjects Business Intelligence Platform Setup with Azure SQL DB](https://blogs.sap.com/2020/06/19/sap-on-azure-sap-businessobjects-business-intelligence-platform-setup-with-azure-sql-db-managed-paas-database/)

> [!IMPORTANT]
> The database engine version numbers for SQL Server and SQL Database aren't comparable with each other. They're internal build numbers for these separate products. The database engine for SQL Database is based on the same code base as the SQL Server database engine. Most importantly, the database engine in SQL Database always has the newest SQL Database engine bits. Version 12 of SQL Database is a newer than version 15 of SQL Server.

To find out the current SQL Database version, you can either check in the settings of Central Management Console (CMC) or you can run the following query by using [sqlcmd](/sql/tools/sqlcmd-utility?preserve-view=true&view=sql-server-ver15) or [SQL Server Management Studio (SSMS)](/sql/ssms/sql-server-management-studio-ssms?preserve-view=true&view=sql-server-ver15). The alignment of SQL versions to default compatibility can be found in the [database compatibility level](/sql/t-sql/statements/alter-database-transact-sql-compatibility-level?preserve-view=true&view=sql-server-ver15) article.

![Screenshot that shows database information in CMC.](media/businessobjects-deployment-guide/businessobjects-deployment-windows-sql-cmc.PNG)

```sql
1> select @@version as version;
2> go
version
------------------------------------------------------------------------------------------
Microsoft SQL Azure (RTM) - 12.0.2000.8
        Feb 20 2021 17:51:58
        Copyright (C) 2019 Microsoft Corporation

(1 rows affected)

1> select name, compatibility_level from sys.databases;
2> go
name                                                                  compatibility_level
--------------------------------------------------------------------- -------------------
master                                                                                150
bocms                                                                                 150
boaudit                                                                               150

(3 rows affected)
```

## Post installation

After a multi-instance installation of the SAP BOBI platform, additional post-configuration steps need to be performed to support application high availability.

### Configure a cluster name

In multi-instance deployment of SAP BOBI platform, you want to run several CMS servers together in a cluster. A cluster consists of two or more CMS servers working together against a common CMS system database. If a node that's running on CMS fails, a node with another CMS will continue to service BI platform requests. By default in an SAP BOBI platform, a cluster name reflects the hostname of the first CMS that you install. 

To configure the cluster name on windows, follow the instruction in [SAP Business Intelligence Platform Administrator Guide](https://help.sap.com/viewer/2e167338c1b24da9b2a94e68efd79c42/4.3.1/en-US). After you configure the cluster name, follow SAP Note [1660440](https://launchpad.support.sap.com/#/notes/1660440) to set default system entry on the CMC or BI Launchpad sign-in page. 

### Configure input and output filestore location to Azure Premium Files

Filestore refers to the disk directories where the actual SAP BusinessObjects files are located. The default location of the file repository server for the SAP BOBI platform is located in the local installation directory. In multi-instance deployment, it's important to set up filestore on a shared storage like Azure Premium Files or Azure NetApp Files so it can be accessed from all storage tier servers.

1. If not created, follow the instructions provided in the preceding section > **Provision Azure Premium Files** to create and mount Azure Premium Files.

   > [!Tip]
   > Choose the storage redundancy for Azure Premium Files (LRS or ZRS) based on your VMs deployment (availability set or availability zone).

1. Follow SAP Note [2512660](https://launchpad.support.sap.com/#/notes/0002512660) to change the path of file repository (Input and Output).

### Tomcat clustering: Session replication

Tomcat supports clustering of two or more application servers for session replication and failover. If SAP BOBI platform sessions are serialized, a user session can fail over seamlessly to another instance of Tomcat, even when an application server fails. For example, a user might be connected to a web server that fails while the user is navigating a folder hierarchy in an SAP BI application. On a correctly configured cluster, the user can continue navigating the folder hierarchy without being redirected to a sign-in page.

In SAP Note [2808640](https://launchpad.support.sap.com/#/notes/2808640), steps to configure Tomcat clustering is provided by using multicast. But in Azure, multicast isn't supported. To make a Tomcat cluster work in Azure, you must use [StaticMembershipInterceptor](https://tomcat.apache.org/tomcat-8.0-doc/config/cluster-interceptor.html#Static_Membership) (SAP Note [2764907](https://launchpad.support.sap.com/#/notes/2764907)). To set up a Tomcat cluster in Azure, see [Tomcat clustering using Static Membership for SAP BusinessObjects BI Platform](https://blogs.sap.com/2020/09/04/sap-on-azure-tomcat-clustering-using-static-membership-for-sap-businessobjects-bi-platform/) on the SAP blog.

### Load-balancing a web tier of an SAP BI platform

In an SAP BOBI multi-instance deployment, Java Web Application servers (web tier) are running on two or more hosts. To distribute the user load evenly across web servers, you can use a load balancer between end users and web servers. In Azure, you can either use Azure Load Balancer or Application Gateway to manage traffic to your web application servers. Details about each offering are explained in the following section.

1. [Load Balancer](../../../load-balancer/load-balancer-overview.md) is a high-performance, low-latency, layer 4 (TCP, UDP) load balancer that distributes traffic among healthy VMs. A load balancer health probe monitors a given port on each VM and only distributes traffic to an operational VM(s). You can either choose a public load balancer or internal load balancer depending on whether you want the SAP BI platform accessible from the internet or not. It's zone redundant, which ensures high-availability across availability zones.

   See the Internal Load Balancer section in the following figure where the web application server runs on port 8080 (default Tomcat HTTP port), which will be monitored by a health probe. Any incoming request that comes from end users will get redirected to the web application servers (**azuswinboap1** or **azuswinboap2**) in the back-end pool. Load Balancer doesn't support TLS/SSL termination (also known as TLS/SSL offloading). If you're using Load Balancer to distribute traffic across web servers, we recommend using Standard Load Balancer.

   > [!NOTE]
   > When VMs without public IP addresses are placed in the back-end pool of internal (no public IP address) Standard Load Balancer, there will be no outbound internet connectivity, unless additional configuration is performed to allow routing to public end points. For details on how to achieve outbound connectivity see [Public endpoint connectivity for virtual machines using Azure Standard Load Balancer in SAP high-availability scenarios](high-availability-guide-standard-load-balancer-outbound-connections.md).

   ![Screenshot that shows Load Balancer used to balance traffic across web servers.](media/businessobjects-deployment-guide/businessobjects-deployment-windows-load-balancer.png)

1. [Application Gateway](../../../application-gateway/overview.md) provides Application Delivery Controller (ADC) as a service, which is used to help applications direct user traffic to one or more web application servers. It offers various layer 7 load-balancing capabilities like TLS/SSL offloading, Web Application Firewall (WAF), cookie-based session affinity, and others for your applications.

   In an SAP BI platform, Application Gateway directs application web traffic to the specified resources in a back-end pool, either **azuswinboap1** or **azuswinboap2**. You assign a listener to the port, create rules, and add resources to a back-end pool. In the following figure, Application Gateway with a private front-end IP address (10.31.3.25) acts as an entry point for users, handles incoming TLS/SSL (HTTPS - TCP/443) connections, decrypts the TLS/SSL, and passes the request (HTTP - TCP/8080) to the servers in the back-end pool. With the in-built TLS/SSL termination feature, you need to maintain only one TLS/SSL certificate on the application gateway, which simplifies operations.

   ![Screenshot that shows Application Gateway used to balance traffic across web servers.](media/businessobjects-deployment-guide/businessobjects-deployment-windows-application-gateway.png)

   To configure Application Gateway for an SAP BOBI Web Server, see [Load Balancing SAP BOBI web servers by using Application Gateway](https://blogs.sap.com/2020/09/17/sap-on-azure-load-balancing-web-application-servers-for-sap-bobi-using-azure-application-gateway/) on the SAP blog.

   > [!NOTE]
   > Use Application Gateway to load balance the traffic to the web server because it provides features like SSL offloading, centralized SSL management to reduce encryption and decryption overhead on server, round-robin algorithms to distribute traffic, Web Application Firewall (WAF) capabilities, and high availability.

## SAP BusinessObjects BI platform reliability on Azure

The SAP BusinessObjects BI platform includes different tiers, which are optimized for specific tasks and operations. When a component from any one tier becomes unavailable, the SAP BOBI application will either become inaccessible or certain functionality of the application won't work. You need to make sure that each tier is designed to be reliable to keep the application operational without any business disruption.

This guide explores how features native to Azure in combination with an SAP BOBI platform configuration improve the availability of an SAP deployment. This section focuses on the following options for SAP BOBI platform reliability on Azure:

- **Back up and restore**: A process of creating periodic copies of data and applications to separate locations. If the original data or applications are lost or damaged, the copies can be used to restore or recover to the previous state.
- **High availability**: A high-availability platform has at least two of everything within an Azure region to keep the application operational if one of the servers becomes unavailable.
- **Disaster recovery (DR)**: A process of restoring your application functionality if there are any catastrophic losses. For example, an entire Azure region might become unavailable because of a natural disaster.

Implementation of this solution varies based on the nature of the system set up in Azure. You need to tailor your backup and restore, high-availability, and DR solutions based on your business requirements.

## Back up and restore

Back up and restore is a process of creating periodic copies of data and applications to a separate location. So it can be restored or recovered to previous state if the original data or applications are lost or damaged. It's also an essential component of any business DR strategy. These backups enable application and database restore to a point in time within the configured retention period.

To develop a comprehensive backup and restore strategy for an SAP BOBI platform, identify the components that lead to system downtime or disruption in the application. In an SAP BOBI platform, backup of the following components is vital to protect the application:

- SAP BOBI Installation Directory (Managed Premium Disks)
- Filestore (Azure Premium Files or Azure NetApp Files for distributed installation)
- CMS and Audit database (SQL Database, Azure Database for MySQL, or a database on Azure Virtual Machines)

The following section describes how to implement a backup and restore strategy for each component on an SAP BOBI platform.

### Backup and restore for an SAP BOBI installation directory

In Azure, the simplest way to back up VMs and all the attached disks is by using [Azure Backup](../../../backup/backup-azure-vms-introduction.md). It provides an independent and isolated backup to guard against unintended destruction of the data on your VMs. Backups are stored in a Recovery Services vault with built-in management of recovery points. Configuration and scaling are simple. Backups are optimized and can be restored easily when needed.

As part of the backup process, a snapshot is taken. The data is transferred to the Recovery Services vault with no effect on production workloads. The snapshot provides a different level of consistency as described in [Snapshot consistency](../../../backup/backup-azure-vms-introduction.md#snapshot-consistency). Backup also offers side-by-side support for backup of managed disks by using [Azure Disk backup](../../../backup/disk-backup-overview.md) in addition to an [Azure VM backup](../../../backup/backup-azure-vms-introduction.md) solution. It's useful when you need consistent backups of VMs once a day and more frequent backups of OS disks, or a specific data disk that are crash consistent. For more information, see [Azure VM backup](../../../backup/backup-azure-vms-introduction.md), [Azure disk backup](../../../backup/disk-backup-overview.md) and [FAQs: Back up Azure VMs](../../../backup/backup-azure-vm-backup-faq.yml).

### Backup and restore for filestore

Based on your deployment, filestore of an SAP BOBI platform can be on Azure NetApp Files or Azure Files. Choose from the following options for backup and restore based on the storage you use for filestore.

1. For Azure NetApp Files, you can create on-demand snapshots and schedule an automatic snapshot by using snapshot policies. Snapshot copies provide a point-in-time copy of your Azure NetApp Files volume. For more information, see [Manage snapshots by using Azure NetApp Files](../../../azure-netapp-files/azure-netapp-files-manage-snapshots.md).
1. Azure Files backup is integrated with a native instance of [Backup](../../../backup/backup-overview.md), which centralizes the backup and restore function along with VM backup and simplifies operation work. For more information, see [Azure File Share backup](../../../backup/azure-file-share-backup-overview.md) and [FAQs: Back up Azure Files](../../../backup/backup-azure-files-faq.yml).

If you've created a separate NFS server, make sure you implement the backup and restore strategy for the same.

### Backup and restore for the CMS and Audit databases

For an SAP BOBI platform running on Windows VMs, the CMS and audit databases can run on any of the supported databases as described in the [support matrix](businessobjects-deployment-guide.md#support-matrix) of the SAP BusinessObjects BI platform planning and implementation guide on Azure. So it's important that you adopt the backup and restore strategy based on the database you used for CMS and audit data storage.

1. SQL Database uses SQL Server technology to create [full backups](/sql/relational-databases/backup-restore/full-database-backups-sql-server?preserve-view=true&view=sql-server-ver15) every week, [differential backups](/sql/relational-databases/backup-restore/differential-backups-sql-server?preserve-view=true&view=sql-server-ver15) every 12 to 24 hours, and [transaction log](/sql/relational-databases/backup-restore/transaction-log-backups-sql-server?preserve-view=true&view=sql-server-ver15) backups every 5 to 10 minutes. The frequency of transaction log backups is based on the compute size and the amount of database activity. 
 
Users can choose an option to configure backup storage redundancy between locally redundant, zone-redundant, or geo-redundant storage blobs. Storage redundancy mechanisms store multiple copies of your data to protect it from planned and unplanned events, which includes transient hardware failure, network or power outages, or massive natural disasters. By default, SQL Database stores backup in geo-redundant [storage blobs](../../../storage/common/storage-redundancy.md) that are replicated to a [paired region](../../../best-practices-availability-paired-regions.md). It can be changed based on the business requirement to either locally redundant or zone-redundant storage blobs. For more up-to-date information on SQL Database backup scheduling, retention, and storage consumption, see [Automated backups: Azure SQL Database and SQL Managed Instance](../../../azure-sql/database/automated-backups-overview.md).

1. Azure Database for MySQL automatically creates server backups and stores in user-configured locally redundant or geo-redundant storage. Azure Database of MySQL takes backups of the data files and the transaction log. Depending on the supported maximum storage size, it either takes full and differential backups (4-TB max storage servers) or snapshot backup (up to 16-TB max storage servers). These backups allow you to restore a server at any point in time within your configured backup retention period. The default backup retention period is 7 days, which you can [optionally configure it](../../../mysql/howto-restore-server-portal.md#set-backup-configuration) up to 35 days. All backups are encrypted using AES 256-bit encryption. These backup files aren't user exposed and can't be exported. These backups can only be used for restore operations in Azure Database for MySQL. You can use [mysqldump](../../../mysql/concepts-migrate-dump-restore.md) to copy a database. For more information, see [Backup and restore in Azure Database for MySQL](../../../mysql/concepts-backup.md).

1. For a database installed on an Azure VM, you can use standard backup tools or [Backup](../../../backup/sap-hana-db-about.md) for supported databases. Also, if the Azure services and tools don't meet your requirements, you can use supported third-party backup tools that provide an agent for backup and recovery of all SAP BOBI platform components.

## High availability

High availability refers to a set of technologies that can minimize IT disruptions by providing business continuity of applications or services through redundant, fault-tolerant, or failover-protected components inside the same data center. In our case, the datacenters are within one Azure region. The article [High-availability Architecture and scenarios for SAP](sap-high-availability-architecture-scenarios.md) provides insight on different high-availability techniques and recommendation offered on Azure for SAP Applications, which complement the instructions in this section.

Based on the sizing result of the SAP BOBI platform, you need to design the landscape and determine the distribution of BI components across Azure Virtual Machines and subnets. The level of redundancy in the distributed architecture depends on the business required recovery time objective (RTO) and recovery point objective (RPO). The SAP BOBI platform includes different tiers, and components on each tier should be designed to achieve redundancy. Then if one component fails, there's little to no disruption to your SAP BOBI application. For example:

- Redundant application servers like BI Application Servers and Web Server
- Unique components like CMS Database, Filestore, Load Balancer

The following section describes how to achieve high availability on each component of an SAP BOBI platform.

### High availability for application servers

For BI and Web Application Servers whether they're installed separately or together, doesn't need a specific high availability solution. You can achieve high availability by redundancy, that is by configuring multiple instances of BI and web servers in various Azure VMs. You can deploy this VM in either [availability sets](sap-high-availability-architecture-scenarios.md#multiple-instances-of-virtual-machines-in-the-same-availability-set) or [availability zones](sap-high-availability-architecture-scenarios.md#azure-availability-zones) based on business required RTO. For deployment across availability zones, make sure all other components in the SAP BOBI platform are designed to be zone redundant as well.

Currently, not all Azure regions offer availability zones, so you need to adopt the deployment strategy based on your region. The Azure regions that offer zones are listed in [Azure availability zones](../../../availability-zones/az-overview.md).

> [!Important]
> The concepts of Azure availability zones and Azure availability sets are mutually exclusive. That means you can either deploy a pair or multiple VMs into a specific availability Zone or an Azure availability set. But not both.

### High availability for CMS database

If you're using an Azure database as a service solution for CMS and audit database, locally redundant high-availability framework is provided by default. Select the region and service inherent high-availability, redundancy, and resiliency capabilities without requiring you to configure any additional components. If the deployment strategy for an SAP BOBI platform is across an availability zone, you need to make sure you achieve zone redundancy for your CMS and audit databases. For more information on high-availability for supported DBaaS offering in Azure, see [High availability for Azure SQL Database](../../../azure-sql/database/high-availability-sla.md) and [High availability in Azure Database for MySQL](../../../mysql/concepts-high-availability.md). 

For other database management system (DBMS) deployment for a CMS database, see [DBMS deployment guides for SAP workload](dbms_guide_general.md) that provides insight on different DBMS deployment and its approach to achieve high availability.

### High availability for filestore

Filestore refers to the disk directories where contents like reports, universes, and connections are stored. It's being shared across all application servers of that system. So you must make sure that it's highly available, alongside with other SAP BOBI platform components.

For an SAP BOBI platform running on Windows, you can either choose [Azure Premium Files](../../../storage/files/storage-files-introduction.md) or [Azure NetApp Files](../../../azure-netapp-files/azure-netapp-files-introduction.md) for filestore, which is designed to be highly available and highly durable in nature. Azure Premium Files support zone redundant storage, which can be useful for cross-zone deployment of an SAP BOBI platform. For more information, see the [Redundancy](../../../storage/files/storage-files-planning.md#redundancy) section for Azure Files.

As the file share service isn't available in all regions, make sure you refer to [Products available by region](https://azure.microsoft.com/en-us/global-infrastructure/services/) to find up-to-date information. If the service isn't available in your region, you can create NFS server from which you can share the file system to SAP BOBI application. But you'll also need to consider its high availability.

### High availability for load balancer

To distribute traffic across web server, you can either use Load Balancer or Application Gateway. The redundancy for either of the load balancer can be achieved based on the SKU you choose for deployment.

1. For Load Balancer, redundancy can be achieved by configuring the Standard Load Balancer front end as zone redundant. For more information, see [Standard Load Balancer and availability zones](../../../load-balancer/load-balancer-standard-availability-zones.md)
1. For Application Gateway, high availability can be achieved based on the type of tier selected during deployment.
   1. The v1 SKU supports high-availability scenarios when you've deployed two or more instances. Azure distributes these instances across update and fault domains to ensure that instances don't all fail at the same time. So with this SKU, redundancy can be achieved within the zone.
   1. The v2 SKU automatically ensures that new instances are spread across fault domains and update domains. If you choose zone redundancy, the newest instances are also spread across availability zones to offer zonal failure resiliency. For more information, see [Autoscaling and zone-redundant Application Gateway v2](../../../application-gateway/application-gateway-autoscaling-zone-redundant.md)

### Reference high-availability architecture for the SAP BusinessObjects BI platform

The following reference architecture describe the setup of an SAP BOBI platform across availability zones running on a Windows server. The architecture showcases the use of different Azure services like Application Gateway, Azure Premium Files (Filestore), and SQL Database (CMS and audit database) for an SAP BOBI platform that offers built-in zone redundancy, which reduces the complexity of managing different high availability solutions.

In the following figure, the incoming traffic (HTTPS - TCP/443) is load balanced by using Application Gateway v2 SKU, which spans across multiple availability zones. The application gateway distributes the user request across web servers, which are distributed across availability zones. The web server forwards the request to management and processing server instances that are deployed in separate VMs across availability zones. Azure Premium Files with zone-redundant storage are attached via private link to management and storage tier VMs to access the contents like reports, universe, and connections. The application accesses the CMS and audit databases running on a zone-redundant instance of SQL Database, which replicates databases across multiple physical locations within an Azure region.

![Diagram that shows high-availability architecture for an SAP BOBI platform on Windows.](media/businessobjects-deployment-guide/businessobjects-deployment-windows-high-availability-availability-zone.png)

The preceding architecture provides insight on how an SAP BOBI deployment on Azure can be done. But it doesn't cover all possible configuration options for an SAP BOBI platform on Azure. You can tailor your deployment based on your business requirements by choosing different products or services for components like Load Balancer, File Repository Server, and DBMS.

In case availability zones aren't available in your selected region, you can deploy Azure VMs in availability sets. Azure makes sure the VMs you place within an availability set run across multiple physical servers, compute racks, storage units, and network switches. If hardware or software failure occurs, only a subset of your VMs is affected and the overall solution stays operational.

## Disaster recovery

The instruction in this section explains the strategy to provide DR protection for an SAP BOBI platform. It complements the [Disaster recovery for SAP](../../../site-recovery/site-recovery-sap.md) document, which represents the primary resources for an overall SAP DR approach. For the SAP BusinessObjects BI platform, see the SAP Note [2056228](https://launchpad.support.sap.com/#/notes/2056228), which describes the following methods to implement a DR environment safely.

 1. Fully or selectively use Lifecycle Management (LCM) or federation to promote or distribute the content from the primary system.
 1. Periodically copy over the CMS and FRS contents.

In this guide, we'll talk about the second option to implement a DR environment. It won't cover an exhaustive list of all possible configuration options for DR, but it covers a solution that features native Azure services in combination with SAP BOBI platform configuration.

>[!Important]
>Availability of each component in the SAP BusinessObjects BI platform should be factored in to the secondary region. The entire DR strategy must be thoroughly tested.

### Reference DR architecture for an SAP BusinessObjects BI platform

This reference architecture is running a multi-instance deployment of the SAP BOBI platform with redundant application servers. For DR, you should fail over all the components of the SAP BOBI platform to a secondary region. In the following figure, Azure Premium Files is used as filestore, SQL Database is used as the CMS and audit repository, and Application Gateway is used to load balance traffic. The strategy to achieve diaster recovery protection for each component is different, which is described in details in following section.

![Diagram that shows SAP BusinessObjects BI Platform Disaster Recovery for Windows.](media\businessobjects-deployment-guide\businessobjects-deployment-windows-disaster-recovery.png)

### Load Balancer

Load Balancer is used to distribute traffic across Web Application Servers of an SAP BOBI platform. On Azure, you can either use Load Balancer or Application Gateway to load balance the traffic across web servers. To achieve DR for the load balancer services, you need to implement another Load Balancer or Application Gateway on a secondary region. To keep the same URL after DR failover, you need to change the entry in DNS, pointing to the load-balancing service running on the secondary region.

### Virtual machines that run web and BI application servers

[Azure Site Recovery](../../../site-recovery/site-recovery-overview.md) can be used to replicate VMs running Web and BI Application Servers on the secondary region. It replicates the servers and all the attached managed disks to the secondary region so that when disasters and outages occur, you can easily fail over to your replicated environment and continue working. To start replicating all the SAP application VMs to the Azure DR datacenter, follow the guidance in [Replicate a virtual machine to Azure](../../../site-recovery/azure-to-azure-tutorial-enable-replication.md).

### Filestore

Filestore is a disk directory where the actual files like reports and BI documents are stored. It's important that all the files in the filestore are in sync to the DR region. Based on the type of file share service you use for the SAP BOBI platform running on Windows, the necessary DR strategy needs to adopted to sync the content.

- **Azure Premium Files** only supports locally redundant storage (LRS) and zone-redundant storage (ZRS). For Azure Premium Files DR strategy, you can use [AzCopy](../../../storage/common/storage-use-azcopy-v10.md) or [Azure PowerShell](/powershell/module/az.storage/?preserve-view=true&view=azps-5.8.0) to copy your files to another storage account in a different region. For more information, see [Disaster recovery and storage account failover](../../../storage/common/storage-disaster-recovery-guidance.md).
- **Azure NetApp Files** provides NFS and SMB volumes, so any file-based copy tool can be used to replicate data between Azure regions. For more information on how to copy Azure NetApp Files volume in another region, see [FAQs about Azure NetApp Files](../../../azure-netapp-files/azure-netapp-files-faqs.md#how-do-i-create-a-copy-of-an-azure-netapp-files-volume-in-another-azure-region).

  You can use Azure NetApp Files Cross-Region Replication, which is currently in [preview](https://azure.microsoft.com/en-us/blog/azure-netapp-files-cross-region-replication-and-new-enhancements-in-preview/) that uses NetApp SnapMirror® technology. With this technology, only changed blocks are sent over the network in a compressed, efficient format. This proprietary technology minimizes the amount of data required to replicate across the regions, which saves data transfer costs. It also shortens the replication time so that you can achieve a smaller RPO. For more information, see [Requirements and considerations for using cross-region replication](../../../azure-netapp-files/cross-region-replication-requirements-considerations.md).

### CMS database

The CMS and audit database in the DR region must be a copy of the databases running in primary region. Based on the database type, it's important to copy the database to a DR region based on business-required RTO and RPO. This section describes different options available for each database as a service solution in Azure that's supported for an SAP BOBI application running on Windows.

#### Azure SQL Database

For [SQL Database](../../../azure-sql/database/business-continuity-high-availability-disaster-recover-hadr-overview.md) DR strategy, there are two options available to copy the database to the secondary region. Both recovery option offers different level of RTO and RPO. For more information on the RTO and RPO for each recovery option, see [Recover a database to existing server](../../../azure-sql/database/business-continuity-high-availability-disaster-recover-hadr-overview.md#recover-a-database-to-the-existing-server).

1. [Geo-redundant database backup restore](../../../azure-sql/database/recovery-using-backups.md#geo-restore)

   By default, Azure SQL databases store data in geo-redundant [storage blobs](../../../storage/common/storage-redundancy.md) that are replicated to [paired region](../../../best-practices-availability-paired-regions.md). For a SQL database, the backup storage redundancy can be configured at the time of CMS and audit database creation or can be updated for an existing database. The changes made to an existing database apply to future backups only. You can restore a database on any Azure SQL database in any Azure region from the most recent geo-replicated backups. Geo-restore uses a geo-replicated backup as its source. But there's a delay between when a backup is taken and when it is geo-replicated to an Azure blob in a different region. As a result, the restored database can be up to one hour behind the original database.

   >[!Important]
   >Geo-restore is available for Azure SQL databases configured with geo-redundant [backup storage](../../../azure-sql/database/automated-backups-overview.md#backup-storage-redundancy).

1. [Geo-replication](../../../azure-sql/database/active-geo-replication-overview.md) or an [autofailover group](../../../azure-sql/database/auto-failover-group-overview.md)

   Geo-replication is a SQL Database feature that allows you to create readable secondary databases of individual databases on a server in the same or different region. If geo-replication is enabled for CMS and audit database, the application can initiate failover to a secondary database in a different Azure region. Geo-replication is enabled for individual databases, but to enable transparent and coordinated failover of multiple databases (CMS and audit) for SAP BOBI application, it's advisable to use auto failover group. It provides the group semantics on top of active geo-replication, which means the entire Azure SQL server (all databases) is replicated to other region instead of individual databases. Check the capabilities table that [Compare geo-replication with failover groups](../../../azure-sql/database/business-continuity-high-availability-disaster-recover-hadr-overview.md#compare-geo-replication-with-failover-groups).

   Auto failover groups provide read-write and read-only listener end-points that remain unchanged during failover. The read-write endpoint can be maintained as listener in ODBC connection entry for CMS and audit database. So whether you use manual or automatic failover activation, failover switches all secondary databases in the group to primary. After the database failover is completed, the DNS record is automatically updated to redirect the endpoints to the new region. So the application will be automatically connected to CMS database as read-write end-points is maintained as listener in ODBC connection.

   In the following figure, an auto-failover group for Azure SQL server (azussqlbodb) running on East US 2 region is replicated to East US secondary region (DR site). The read/write listener endpoint is maintained as a listener in an ODBC connection for BI application server running on Windows. After failover, the endpoint will remain same and no manual intervention is required to connect BI application to Azure SQL database on secondary region.

   ![Screenshot that shows Azure SQL database auto-failover groups.](media\businessobjects-deployment-guide\businessobjects-deployment-windows-sql-failover-group.png)

   This option provides a lower RTO and RPO than option 1. For more information about this option, see [Use auto failover groups to enable transparent and coordinated failover of multiple databases](../../../azure-sql/database/auto-failover-group-overview.md)

#### Azure Database for MySQL

Azure Database for MySQL provides multiple options to recover a database if there's a disaster. Choose the appropriate option that works for your business.

1. Enable cross-region read replicas to enhance your business continuity and DR planning. You can replicate from a source server up to five replicas. Read replicas are updated asynchronously by using MySQL's binary log replication technology. Replicas are new servers that you manage similar to regular Azure Database for MySQL servers. To learn more about read replicas, available regions, restrictions, and how to fail over from, see [Read replicas in Azure Database for MySQL](../../../mysql/concepts-read-replicas.md).

1. Use Azure Database for MySQL's geo-restore feature that restores the server by using geo-redundant backups. These backups are accessible even when the region on which your server is hosted is offline. You can restore from these backups to any other region and bring your server back online.

  > [!Important]
  > Geo-restore is only possible if you provisioned the server with geo-redundant backup storage. Changing the backup redundancy options after server creation isn't supported. For more information, see [Backup redundancy](../../../mysql/concepts-backup.md#backup-redundancy-options).

The following table lists the recommendations for DR for each tier used in this example.

| SAP BOBI platform tiers                          | Recommendation                                               |
| ------------------------------------------------ | ------------------------------------------------------------ |
| Azure Application Gateway or Azure Load Balancer | Parallel setup of Application Gateway on Secondary Region    |
| Web Application Servers                          | Replicate by using Azure Site Recovery                             |
| BI Application Servers                           | Replicate by using Site Recovery                             |
| Azure Premium Files                              | AzCopy *or* Azure PowerShell                               |
| Azure NetApp Files                               | File-based copy tool to replicate data to Secondary Region *or* Azure NetApp Files Cross-Region Replication (Preview) |
| Azure SQL Database                               | Geo-replication/auto-failover groups *or* geo-restore     |
| Azure Database for MySQL                         | Cross-region read replicas *or* restore backup from geo-redundant backups |
## Next steps

- [Set up disaster recovery for a multi-tier SAP app deployment](../../../site-recovery/site-recovery-sap.md)
- [Azure Virtual Machines planning and implementation for SAP](planning-guide.md)
- [Azure Virtual Machines deployment for SAP](deployment-guide.md)
- [Azure Virtual Machines DBMS deployment for SAP](./dbms_guide_general.md)