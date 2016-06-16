<properties
	pageTitle="Configure Always On availability group in Azure VM automatically - Resource Manager"
	description="Create an Always On availability group with Azure virtual machines in Azure Resource Manager mode. This tutorial primarily uses the user interface to automatically create the entire solution."
	services="virtual-machines-windows"
	documentationCenter="na"
	authors="MikeRayMSFT"
	manager="jhubbard"
	editor=""
	tags="azure-resource-manager" />
<tags
	ms.service="virtual-machines-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="vm-windows-sql-server"
	ms.workload="infrastructure-services"
	ms.date="06/12/2016"
	ms.author="mikeray" />

# Configure Always On availability group in Azure VM automatically - Resource Manager

> [AZURE.SELECTOR]
- [Resource Manager: Auto](virtual-machines-windows-portal-sql-alwayson-availability-groups.md)
- [Resource Manager: Manual](virtual-machines-windows-portal-sql-alwayson-availability-groups-manual.md)
- [Classic: UI](virtual-machines-windows-classic-portal-sql-alwayson-availability-groups.md)
- [Classic: PowerShell](virtual-machines-windows-classic-ps-sql-alwayson-availability-groups.md)

<br/>

This end-to-end tutorial shows you how to create a SQL Server availability group with Azure Resource Manager virtual machines. The tutorial uses Azure blades to configure a template. You will review the default settings, type required settings, and update the blades in the portal as you walk through this tutorial.

At the end of the tutorial, your SQL Server availability group solution in Azure will consist of the following elements:

- A virtual network containing multiple subnets, including a front-end and a back-end subnet

- Two domain controller with an Active Directory (AD) domain

- Two SQL Server VMs deployed to the back-end subnet and joined to the AD domain

- A 3-node WSFC cluster with the Node Majority quorum model

- An availability group with two synchronous-commit replicas of an availability database

The figure below is a graphical representation of the solution.

![Test Lab Architecture for AG in Azure](./media/virtual-machines-windows-portal-sql-alwayson-availability-groups/0-EndstateSample.png)

All of the resources in this solution belong to a single resource group.

This tutorial assumes the following:

- You already have an Azure account. If you don't have one, [sign up for a trial account](http://azure.microsoft.com/pricing/free-trial/).

- You already know how to provision a SQL Server VM from the virtual machine gallery using the GUI. For more information, see [Provisioning a SQL Server virtual machine on Azure](virtual-machines-windows-portal-sql-server-provision.md)

- You already have a solid understanding of availability groups. For more information, see [Always On availability groups (SQL Server)](http://msdn.microsoft.com/library/hh510230.aspx).

>[AZURE.NOTE] If you are interested in using availability groups with SharePoint, also see [Configure SQL Server 2012 Always On availability groups for SharePoint 2013](http://technet.microsoft.com/library/jj715261.aspx).

In this tutorial you will use the Azure portal to:

- Select the the Always On template from the portal

- Review the template settings and update a few configuration settings for your environment

- Monitor Azure as it creates the entire environment

- Connect to one of the domain controllers and then to one of the SQL Servers

[AZURE.INCLUDE [availability-group-template](../../includes/virtual-machines-windows-portal-sql-alwayson-ag-template.md)]


## Provision the cluster from the gallery

Azure provides a gallery image for the entire solution. In order to locate the template:

1. 	Log in to the Azure portal using your account.
1.	On the Azure portal click **+New.** The portal will open the New blade.
1.	On the New blade search for **AlwaysOn**.
![Find AlwaysOn Template](./media/virtual-machines-windows-portal-sql-alwayson-availability-groups/16-findalwayson.png)
1.	In the search results locate **SQL Server AlwaysOn Cluster**.
![AlwaysOn Template](./media/virtual-machines-windows-portal-sql-alwayson-availability-groups/17-alwaysontemplate.png)
1.	On **Select a deployment model** choose **Resource Manager**.

### Basics

Click on **Basics** and configure the following:

- **Administrator user name** is a user account with domain administrator permissions and a member of the SQL Server sysadmin fixed server role on both instances of SQL Server. For this tutorial use **DomainAdmin**.

- **Password** is the password for the domain administrator account. Use a complex password. Confirm the password.

- **Subscription** is the subscription that Azure will bill to run all of the resources deployed for the availability group. You can specify a different subscription if your account has multiple subscriptions.

- **Resource group** is the name for the group that all of the Azure resources created by this tutorial will belong to. For this tutorial use **SQL-HA-RG**. For more information, see (Azure Resource Manager overview)[resource-group-overview.md/#resource-groups].

- **Location** is the Azure region where the resources for this tutorial will be created. Select an Azure region to host the infrastructure.

Below is what the **Basics** blade will look like:

![Basics](./media/virtual-machines-windows-portal-sql-alwayson-availability-groups/1-basics.png)

- Click **OK**.

### Domain and network settings

This Azure gallery template creates a new domain with new domain controllers. It also creates a new network and two subnets. The template does not enable creating the servers in an existing domain or virtual network. The next step is to configure the domain and network settings.

On **Domain and network settings** blade review the preset values for the domain and network settings:

- **Forest root domain name** is the domain name that will be used for the AD domain that will host the cluster. For the tutorial use **contoso.com**.

- **Virtual Network name** is the network name for the Azure virtual network. For this tutorial use **autohaVNET**.

- **Domain Controller subnet name** is the name of a portion of the virtual network that hosts the domain controller. For this tutorial use **subnet-1**. This subnet will use address prefix **10.0.0.0/24**.

- **SQL Server subnet name** is the name of a portion of the virtual network that hosts the SQL Servers and the file share witness. For this tutorial use **subnet-2**. This subnet will use address prefix **10.0.1.0/26**.

To learn more about virtual networks in [Azure see Virtual Network Overview](../virtual-network/virtual-networks-overview.md).  

The **Domain and network settings** should look like this:

![Domain and network settings](./media/virtual-machines-windows-portal-sql-alwayson-availability-groups/2-domain.png)

If necessary, you may change these values. For this tutorial we use the preset values.

- Review the settings and click **OK**.

###availability group settings

On **availability group settings** review the preset values for teh availability group and the listener.

- **Availablity group name** is the clustered resource name for the availability group. For this tutorial use **Contoso-ag**.

- **availability group listener name** is used by the cluster and the internal load balancer. Clients connecting to SQL Server can use this name to connect to the appropriate replica of the database. For this tutorial use **Contoso-listener**.

-  **availability group listener port** specifies the TCP port the SQL Server listener will use. For this tutorial use the default port, **1433**.

If necessary, you may change these values. For this tutorial use the preset values.  

![availability group settings](./media/virtual-machines-windows-portal-sql-alwayson-availability-groups/3-availabilitygroup.png)

- Click **OK**.

###VM size, storage settings

On **VM size, storage settings** choose a SQL Server virtual machine size and review the other settings.

- **SQL Server virtual machine size** is the Azure virtual machine size for both SQL Servers. Choose a virtual machine size appropriate for your workload. If you are building this environment for the tutorial use **DS2**. For production workloads choose a virtual machine size that can support the workload. Many production workloads will require **DS4** or larger. The template will build two virtual machines of this size and install SQL Server on each one. For more information, see [Sizes for virtual machines](virtual-machines-linux-sizes.md).

>[AZURE.NOTE]Azure will install Enterprise Edition of SQL Server. The cost depends on the edition and the virtual machine size. For detailed information about current costs, see [virtual machines Pricing](http://azure.microsoft.com/pricing/details/virtual-machines/#Sql).

- **Domain controller virtual machine size** is the virtual machine size for the domain controllers. For this tutorial use **D2**.

- **File Share Witness virtual machine size** is the virtual machine size for the file share witness. For this tutorial use **A1**.

- **SQL Storage account** is the name of the storage account to hold the SQL Server data and operating system disks. For this tutorial use **alwaysonsql01**.

- **DC Storage account** is the name of the storage account for the domain controllers. For this tutorial use **alwaysondc01**.

- **SQL Server data disk size** in TB is the size of the SQL Server data disk in TB. Specify a number from 1 through 4. This is the size of the data disk that will be attached to each SQL Server. For this tutorial use **1**.

- **Storage optimization** sets specific storage configuration settings for the SQL Server virtual machines based on the workload type. All SQL Servers in this scenario use premium storage with Azure disk host cache set to read only. In addition, you can optimize SQL Server settings for the workload by choosing one of these three settings:

    - **General workload** sets no specific configuration settings

    - **Transactional processing** sets trace flag 1117 and 1118

    - **Data warehousing** sets trace flag 1117 and 610

For this tutorial use **General workload**.

![VM size storage settings](./media/virtual-machines-windows-portal-sql-alwayson-availability-groups/4-vm.png)

- Review the settings and click **OK**.

####A note about storage

Additional optimizations depend on the size of the SQL Server data disks. For each terabyte of data disk, Azure adds an additional 1 TB premium storage (SSD). When a server requires 2 TB or more, the template creates a storage pool on each SQL Server. A storage pool is a form of storage virtualization where multiple discs are configured to provide higher capacity, resiliency, and performance.  The template then creates a storage space on the storage pool and presents this as a single data to the operating system. The template designates this disk as the data disk for SQL Server. The template tunes the storage pool for SQL Server with the following settings:

- Stripe size is the interleave setting for the virtual disk. For transactional workloads this is set to 64 KB. For data warehousing workloads the setting is 256 KB.

- Resiliency is simple (no resiliency).

>[AZURE.NOTE] Azure premium storage is locally redundant and keeps three copies of the data within a single region, so additional resiliency at the storage pool is not required.

- Column count equals the number of disks in the storage pool.

For additional information about storage space and storage pools see:

- [Storage Spaces Overview](http://technet.microsoft.com/library/hh831739.aspx).

- [Windows Server Backup and Storage Pools](http://technet.microsoft.com/library/dn390929.aspx)

For more information about SQL Server configuration best practices, see
[Performance best practices for SQL Server in Azure virtual machines](virtual-machines-windows-sql-performance.md)


###SQL Server settings

On **SQL Server settings** review and modify the SQL Server VM name prefix, SQL Server version, SQL Server service account and password, and the SQL auto patching maintenance schedule.

- **SQL Server Name Prefix** is used to create a name for each SQL Server. For this tutorial use **Contoso-ag**. The SQL Server names will be *Contoso-ag-0* and *Contoso-ag-1*.

- **SQL Server version** is the version of SQL Server . For this tutorial use **SQL Server 2014**. You can also choose **SQL Server 2012** or **SQL Server 2016**.

- **SQL Server service account user name** is the domain account name for the SQL Server service. For this tutorial use **sqlservice**.

- **Password** is the password for the SQL Server service account.  Use a complex password. Confirm the password.

- **SQL Auto Patching maintenance schedule** identifies the weekday that Azure will automatically patch the SQL Servers. For this tutorial type **Sunday**.

- **SQL Auto Patching maintenance start hour** is the time of day for the Azure region when automatic patching will begin.

>[AZURE.NOTE]The patching window for each VM is staggered by one hour. Only one virtual machine is patched at a time in order to prevent disruption of services.

![SQL Server settings](./media/virtual-machines-windows-portal-sql-alwayson-availability-groups/5-sql.png)

Review the settings and click **OK**.

###Summary

On the summary page Azure validates the settings. You can also download the template. Review the summary. Click **OK**.

###Buy

This final blade contains **Terms of use**, and **privacy policy**. Review this information. When you are ready for Azure to start creating the virtual machines, and all of the other required resources for the availability group, click **Create**.

The Azure portal will create the resource group and all of the resources.

##Monitor deployment

Monitor the deployment progress from the Azure portal. An icon representing the deployment is automatically pinned to the Azure portal dashboard.

![Azure Dashboard](./media/virtual-machines-windows-portal-sql-alwayson-availability-groups/11-deploydashboard.png)

##Connect to SQL Server

The new instances of SQL Server are running on virtual machines that do not have connections to the internet. However, the domain controllers do have an internet facing connection. In order to connect to the SQL servers with remote desktop, first RDP to one of the domain controllers. From the domain controller open a second RDP to the SQL Server.

To RDP to the primary domain controller, follow these steps:

1.	From the Azure portal dashboard very that the deployment has succeeded.

1.	Click **Resources**.

1.	In the **Resources** blade, click **ad-primary-dc** which is the computer name of the virtual machine for the primary domain controller.

1.	On the blade for **ad-primary-dc** click **Connect**. Your browser will ask if you want to open or save the remote connection object. Click **Open**.
![Connect to DC](./media/virtual-machines-windows-portal-sql-alwayson-availability-groups/13-ad-primary-dc-connect.png)
1.	**Remote desktop connection** may warn you that the publisher of this remote connection can’t be identified. Click **Connect**.

1.	Windows security prompts you to enter your credentials to connect to the IP address of the primary domain controller. Click **Use another account**. For **User name** type **contoso\DomainAdmin**. This is the account you chose for administrator user name. Use the complex password that you chose when you configured the template.

1.	**Remote desktop** may warn you that the remote computer could not be authenticated due to problems with its security certificate. It will show you the security certificate name. If you followed the tutorial the name will be **ad-primary-dc.contoso.com**. Click **Yes**.

You are now connected to the primary domain controller. To RDP to the SQL Server, follow these steps:

1.	On the domain controller, open **Remote Desktop Connection**.

1.	For **Computer**, type the name of one of the SQL Servers. For this tutorial, type **sqlserver-0**.

1.	Use the same user account and password that you used to RDP to the domain controller.

You are now connected with RDP to the SQL Server. You can open SQL Server management studio, connect to the default instance of SQL Server and verify the availabilty group is configured.


