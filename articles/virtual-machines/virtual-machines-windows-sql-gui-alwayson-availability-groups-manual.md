<properties
	pageTitle="Manually Configure AlwaysOn availability groups ARM (GUI) | Microsoft Azure"
	description="Create an AlwaysOn Availability Group with Azure Virtual Machines. This tutorial primarily uses the user interface and tools rather than scripting."
	services="virtual-machines"
	documentationCenter="na"
	authors="MikeRayMSFT"
	manager="jeffreyg"
	editor="monicar"
	tags="azure-service-management" />
<tags
	ms.service="virtual-machines"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="vm-windows-sql-server"
	ms.workload="infrastructure-services"
	ms.date="04/16/2015"
	ms.author="MikeRayMSFT" />

# Configure AlwaysOn Availability Groups in Azure VM (GUI)

> [AZURE.SELECTOR]
- [Portal - Resource Manager](virtual-machines-sql-server-alwayson-availability-groups-gui-arm.md)
- [Portal - Classic](virtual-machines-sql-server-alwayson-availability-groups-gui.md)
- [PowerShell - Classic](virtual-machines-sql-server-alwayson-availability-groups-powershell.md)

<br/>

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-classic-include.md)] Resource Manager model.


This end-to-end tutorial shows you how to implement availability groups using SQL Server AlwaysOn running on Azure resource manager virtual machines. 

>[AZURE.NOTE] In the Azure Portal, there is a new gallery setup for AlwaysOn Availability Groups with a Listener. This configures everything you need for AlwaysOn Availability Groups automatically. For more information, see [Portal - Resource Manager](virtual-machines-sql-server-alwayson-availability-groups-gui-arm.md). 

At the end of the tutorial, your SQL Server AlwaysOn solution in Azure will consist of the following elements:

- A virtual network containing two subnets, including a front-end and a back-end subnet

- Two domain controllers in an availability set with an Active Directory (AD) domain 

- Two SQL Server VMs in an availability set deployed to the back-end subnet and joined to the AD domain

- A 3-node WSFC cluster with the Node Majority quorum model

- An internet facing load balancer to provide RDP connectivity to one of the domain controllers

- An internal load balancer to provide an IP address to the AlwaysOn availabiltiy groups

- An availability group with two synchronous-commit replicas of an availability database

The figure below is a graphical representation of the solution.

![Architecture for AG in ARM](./media/virtual-machines-windows-sql-gui-alwayson-availability-groups-manual/00-EndstateSample.png)

Note that this is one possible configuration. For example, you can minimize the number of VMs for a two-replica availability group in order to save on compute hours in Azure by using the domain controller as the quorum file share witness in a 2-node WSFC cluster. This method reduces the VM count by one from the above configuration.

This tutorial assumes the following:

- You already have an Azure account.

- You already know how to provision a SQL Server VM from the virtual machine gallery using the GUI. For more information, see [Provisioning a SQL Server Virtual Machine on Azure](virtual-machines-provision-sql-server.md)

- You already have a solid understanding of AlwaysOn Availability Groups. For more information, see [AlwaysOn Availability Groups (SQL Server)](https://msdn.microsoft.com/library/hh510230.aspx).

>[AZURE.NOTE] If you are interested in using AlwaysOn Availability Groups with SharePoint, also see [Configure SQL Server 2012 AlwaysOn Availability Groups for SharePoint 2013](https://technet.microsoft.com/library/jj715261.aspx).

## Connect to your Azure subscription and create a resource group

1. Sign in to the [Azure portal](http://portal.azure.com). 

1. Click **+New** and then type **Resource group** in the **Marketplace** search window.

 ![Resource Group](./media/virtual-machines-windows-sql-gui-alwayson-availability-groups-manual/01-resourcegroupsymbol.png)

1. Click **Resource group** 

 ![New Resource Group](./media/virtual-machines-windows-sql-gui-alwayson-availability-groups-manual/01-newresourcegroup.png)

1. Click **Create**. 

1. In the **Resource group** blade, under **Resource group name** type **SQL-HA-RG**

1. If you have multiple Azure subscriptions, verify that the subscription is the Azure subscription you want to create the availability group in. 

1. Select a location. The location is the Azure location where the availability group will run. For this tutorial we are going to build all resourcs in one Azure location. 

1. Verify **Pin to dashboard** is checked. This optional setting places a shortcut for the resource group on the Azure portal dashboard. 

1. Click **Create** to create the resource group.

Azure will create the new resource group and pin a shortcut to the resource group in the portal.

## Create network and subnets

The next step is to create the networks and subnets in the Azure resource group.

The solution uses one virtual network with two subnets. You should understand the basics of networks and how networks work in Azure. The [Virtual Network Overview](virtual-networks-overview.md) provides more information about networks in Azure.

To create the virtual network:

1. On the Azure portal click click on the new resource group and click **+** to add a new item to the resource group. Azure opens the **Everything** blade. 

 ![New Item](./media/virtual-machines-windows-sql-gui-alwayson-availability-groups-manual/02-newiteminrg.png)

1. Search for **virtual network**.

 ![Search Virtual Network](./media/virtual-machines-windows-sql-gui-alwayson-availability-groups-manual/04-findvirtualnetwork.png)

1. Click **Virtual network**.

1. In the **Virtual network** blade, click the **Resource Manager**  deployment model and click **Create**.

 ![Create Virtual Network](./media/virtual-machines-windows-sql-gui-alwayson-availability-groups-manual/05-createvirtualnetwork.png)
 

 
Configure the virtual network on the **Create virtual network** blade. 

The table below shows the settings for the virtual network. 

| Field | Value |
| ----- | ----- |
| Name | autoHAVNET |
| Address space | 10.0.0.0/16 |
| Subnet name | Subnet-1 |
| Subnet address range | 10.0.0.0/24 |
| Subscription | Specify the subscription that you intend to use. If you only have one subscription this may be blank. |
| Location | Specify the Azure location where you will deploy your availability group |

Note that your address space and subnet address range may be different from the table. Depending on your subscription Azure will automatically specify an available address space and corresponding subnet address range. If no sufficient address space is available use a different subscription. 

Click **Create** 

   ![Configure Virtual Network](./media/virtual-machines-windows-sql-gui-alwayson-availability-groups-manual/06-configurevirtualnetwork.png)

Azure will return you to the portal dashboard and notify you when the new network is created.

###Create the second subnet

At this point your virtual network contains one subnet, named Subnet-1. The domain controllers will use this subnet. The SQL Servers will use a second subnet named **Subnet-2**. To configure Subnet-2

1. On your dashboard, click on the resource group that you created, **SQL-HA-RG**. Locate the network in the resource group under **Resources**.

  If **SQL-HA-RG** is not visible you can find it by clicking **Resource Groups** and filtering by the resource group name that you created.

1.  Click **autoHAVNET** on the list of resources to open the network configuration blade.

1.  On **autoHAVNET** virtual network, click **All settings*.

1. On the **Settings** blade, click **Subnets**.

   Notice the subnet that you already created. 

   ![Configure Virtual Network](./media/virtual-machines-windows-sql-gui-alwayson-availability-groups-manual/07-addsubnet.png)

1. Create a second subnet. Click **+ Subnet**. 

 In the **Add Subnet** blade configure the subnet by typing **subnet-2** under **Name**. Azure will automatically specify a valid **Address range**. Verify that this address range has at least 10 addresses in it. In a production environment you may require more addresses. 

Click **OK**. 

   ![Configure Virtual Network](./media/virtual-machines-windows-sql-gui-alwayson-availability-groups-manual/08-configuresubnet.png)
   
Here is a summary of the configuration settings for the virtual network and both subnets.

| Field | Value |
| ----- | ----- |
| **Name** | **autoHAVNET** |
| **Address space** | Depends on available address spaces in your subscription. A typical value is 10.0.0.0/16 |
| **Subnet name** | **Subnet-1** |
| **Subnet address range** | Depends on available address ranges in your subscription. A typical value is 10.0.0.0/24. |
| **Subnet name** | **Subnet-2** |
| **Subnet address range** | Depends on available address ranges in your subscription. A typical value is 10.0.1.0/24. |
| **Subscription** | Specify the subscription that you intend to use. |
| **Resource Group** | **SQL-HA-RG** |
| **Location** | Specify the same location that you chose for the resource group. |

## Create Availability Sets

Before creating virtual machines, you need to create availability sets. Availablity sets reduce downtime for planned or unplanned maintenance events. An Azure availablity set is a logical group of resources that Azure places on physical fault domains and update domains. A fault domain ensures that the members of the availablity set have separate power and network resouces. An update domain ensures that members of the availabilty set are not brought down for maintenance at the same time. [Manage the availability of virtual machines](virtual-machines-manage-availability.md).

You will need two availability sets. One is for the domain controllers, the second is for the SQL Servers.

To create an availablity set go to the resource group and click **Add**. Filter the results by typing **Availabilty Set**. Click **Availability Set** in the results. Click **Create**.

Configure two availablity sets according to the parameters in the following table.

| Field | Domain Controller Availabiltiy Set | SQL Server Availablity Set |
| ----- | ----- | ----- |
| Name  | adAvailablitySet | sqlAvailabilitySet|
| Resource group | SQL-HA-RG | SQL-HA-RG |
| Fault domains | 3 | 3 |
| Update domains | 5 | 3 |

After you create the availability sets, return to the resource group in the Azure portal.

## Create internet facing load balancer

All of the resources in this solution are on an Azure virtual network, with no access to the internet. In order to access a virtual machine, create an internet facing load balancer. The front end of the load balancer provides an IP address, and the back end points to one of the domain controller virtual machines.  You will use RDP through that load balancer to one domain controller. From that domain controller you will use RDP to connect to and configure all other virtual machines. 

To create a load balancer go to the resource group, click **Add** search for **load balancer**, click on **Load balancer** click **Create**. On the create load balancer tag configure the load balancer according to the following table:

| Field | Value  
| ----- | -----
| Name | rdpLoadBalancer
| Scheme | Public
| Public IP Address Name | rdpIP
| Assignment | Static
| Subscription | *Your subscription*
| Resource Group | SQL-HA-RG
| Location | The same as previous objects

>[AZURE.NOTE] For the public IP address, click *Choose a public IP address* and create a new IP address. 

Click **Create** to create the internet facing load balancer.

## Create and configure domain controllers

At this point you have created the network, subnets, availablity sets and an internet facing load balancer. You are ready to create the virtual machines for the domain controllers.

### Create the virutal machines for the domain controllers

To create and configure the domain controllers, return to the **SQL-HA-RG** resource group.

1. Click Add. The **Everything** blade opens.

1. Type **Windows Server 2012 R2 Datacenter**. 

1. Click **Windows Server 2012 R2 Datacenter**. In the **Windows Server 2012 R2 Datacenter** blade verify that the deployment model is set to **Resource Manager** and click **Create**. Azure opens the **Create virtual machine** blade. 

You will go through that process twice to create two virtual machines. Name the two virtual machine:

- ad-primary-dc
- ad-secondary-dc

The following table shows the settings for these two machines.

| Field | Value 
| ----- | ---- 
| User name  | DomainAdmin
| Password | Contoso!000 |
| Subscription | *your subscription* |
| Resource group | SQL-HA-RG |
| Location | *your location* 
| Size | D1_V2 (Standard)
| Storage type | standard
| Storage account | *Automatically created*
| Virtual network | autoHAVNET
| Subnet | subnet-1
| Public IP address | None
| Network Security Group | None
| Diagnostics | Enabled
| Diagnostics storage account | *Automatically created*
| Availability set | adAvailabilitySet

>[AZURE.NOTE] You cannot change the availabilty set on a VM after it is created.

Azure will create the virtual machines.

After the virtual machines are created, configure the internet facing load balancer to allow RDP connection to the primary domain controller. 

### Configure the internet facing load balancer to allow RDP connection to the primary domain controller
 
In the resource group, click **rdpLoadBalancer** to open the settings for the **rdpLoadbalancer**.
 
Click **Backend pools**.
 
On the **Backend address pools** blade, click **Add**.
 
In the **Add backend address pool** blade configure the backend address pool according to the settings in this table:
 
| Field | Setting
| ----- | -----
| **Name** | adLBBE
| **Availability set**| adAvailabilitySet
| **Virtual machines** | ad-primary-dc

This load balancer is only connected to one virtual machine. 

 
  
### Add Inbound NAT Rools on the rdpLoad Balancer

Add an inbound NAT rule on the rdpLoad Balancer. Configure the rule according to the following table:

| Field | Setting
| ----- | -----
| **Name** |RDP
| **Service** | RDP
| **Protocol** | TCP
| **Target** | ad-primary-dc

Sometimes it takes multiple attempts to configure the target. If the first configuration attempt fails, retry a few times.

After Azure finishes updating the load balancer, you can connect to **ad-primary-dc** with remote desktop.

## Set the domain controller network interfaces to use a static IP address

In the Azure portal, under the **SQL-HA-RG** resource group, locate the network interface card for each of the virtual machines. On each network interface card, click **IP addresses**. Set **Assignment** to **Static** and save the change. While here, note the IP address that Azure has assigned to each network interface cards. This is the private IP address the server uses on the Azure virtual network.

## Configure the domain controller

In the following steps, configure the ad-primary-dc machine as a domain controller for corp.contoso.com.

1. In the portal open the **SQL-HA-RG** resource group and select the **ad-primary-dc** machine. On the **ad-primary-dc** blade, click **Connect** to open an RDP file for remote desktop access. If the connect button is not enabled, verify the load balancer configuration from the previous step.

	![Connect to Vritual Machine](./media/virtual-machines-windows-sql-gui-alwayson-availability-groups-manual/20-connectrdp.png)

1. Log in with your configured administrator account (**\DomainAdmin**) and password (**Contoso!000**).

1. By default, the **Server Manager** dashboard should be displayed.

1. Click the **Add roles and features** link on the dashboard.

	![Server Explorer Add Roles](./media/virtual-machines-windows-sql-gui-alwayson-availability-groups-manual/IC784623.png)

1. Select **Next** until you get to the **Server Roles** section.

1. Select the **Active Directory Domain Services** and **DNS Server** roles. When prompted, add any additional features required by these roles.

	>[AZURE.NOTE] You will get a validation warning that there is no static IP address. If you are testing the configuration, click continue. For production scenarios set the IP address to static in the Azure portal or [use PowerShell to set the static IP address of the domain controller machine](./virtual-network/virtual-networks-reserved-private-ip.md).

	![Add Roles Dialog](./media/virtual-machines-windows-sql-gui-alwayson-availability-groups-manual/IC784624.png)

1. Click **Next** until you reach the **Confirmation** section. Select the **Restart the destination server automatically if required** checkbox.

1. Click **Install**.

1. After the features finish installing, return to the **Server Manager** dashboard.

1. Select the new **AD DS** option on the left-hand pane.

1. Click the **More** link on the yellow warning bar.

	![AD DS dialog on DNS Server VM](./media/virtual-machines-windows-sql-gui-alwayson-availability-groups-manual/IC784625.png)

1. In the **Action** column of the **All Server Task Details** dialog, click **Promote this server to a domain controller**.

1. In the **Active Directory Domain Services Configuration Wizard**, use the following values:

|Page|Setting|
|---|---|
|Deployment Configuration|**Add a new forest** = Selected<br/>**Root domain name** = corp.contoso.com|
|Domain Controller Options|**DSRM Password** = Contoso!000<br/>**Confirm Password** = Contoso!000|

1. Click **Next** to go through the other pages in the wizard. On the **Prerequisites Check** page, verify that you see the following message: **All prerequisite checks passed successfully**. Note that you should review any applicable warning messages, but it is possible to continue with the install.

1. Click **Install**. The **ad-primary-dc** virtual machine will automatically reboot.

### Configure the second domain controller

1. Log back into the **ad-primary-dc** machine. 

1. Open Remote desktop and connect to the secondary domain controller by IP address. If you do not know the IP address of the secondary domain controller, go to the Azure portal and check the address assigned to the network interface for the secondary domain controller. 

1. Repeat the steps that you followed to create the first domain controller except, in the **Active Directory Domain Services Configuration Wizard**, use the following values:

|Page|Setting|
|---|---|
|Deployment Configuration|**Add a domain controller to an existing domain** = Selected<br/>**Root domain name** = corp.contoso.com|
|Domain Controller Options|**DSRM Password** = Contoso!000<br/>**Confirm Password** = Contoso!000|


## Configure Domain Accounts

The next steps configure the Active Directory (AD) accounts for later use.

1. Log back into the **ad-primary-dc** machine.

1. In **Server Manager** select **Tools** and then click **Active Directory Administrative Center**.

	![Active Directory Administrative Center](./media/virtual-machines-windows-sql-gui-alwayson-availability-groups-manual/IC784626.png)

1. In the **Active Directory Administrative Center** select **corp (local)** from the left pane.

1. On the right **Tasks** pane, select **New** and then click **User**. Use the following settings:

|Setting|Value|
|---|---|
|**First Name**|Install|
|**User SamAccountName**|Install|
|**Password**|Contoso!000|
|**Confirm password**|Contoso!000|
|**Other password options**|Selected|
|**Password never expires**|Checked|

1. Click **OK** to create the **Install** user. This account will be used to configure the failover cluster and the availability group.

1. Create two additional users with the same steps: **CORP\SQLSvc1** and **CORP\SQLSvc2**. These accounts will be used for the SQL Server instances. Next, you need to give **CORP\Install** the necessary permissions for configuring Windows Service Failover Clustering (WSFC).

1. In the **Active Directory Administrative Center**, select **corp (local)** in the left pane. Then in the right-hand **Tasks** pane, click **Properties**.

	![CORP User Properties](./media/virtual-machines-windows-sql-gui-alwayson-availability-groups-manual/IC784627.png)

1. Select **Extensions**, and then click the **Advanced** button on the **Security** tab.

1. On the **Advanced Security Settings for corp** dialog. Click **Add**.

1. Click **Select a principal**. Then search for **CORP\Install**. Click **OK**.

1. Select the **Read all properties** and **Create Computer objects** permissions.

	![Corp User Permissions](./media/virtual-machines-windows-sql-gui-alwayson-availability-groups-manual/IC784628.png)

1. Click **OK**, and then click **OK** again. Close the corp properties window.

Now that you have finished configuring Active Directory and the user objects, you will create two SQL Server VMs, and a witness server VM, and join all three to this domain.

## Create the SQL Server VMs

Next, create three VMs, including two SQL Server VMs, and a WSFC cluster node. To create each of the VMs, go back to **HA-AG-RG** resource group, click **Add**, search for the appropriate gallery item, **Virtual Machine**, and then **From Gallery**. Then use the templates in the following table to help you create the VMs.

|Page|VM1|VM2|VM3|
|---|---|---|---|
|Select the appropriate gallery item|**Windows Server 2012 R2 Datacenter**|**SQL Server 2014 SP1 Enterprise on Windows Server 2012 R2**|**SQL Server 2014 SP1 Enterprise on Windows Server 2012 R2**|
| Virtual machine configuraiton **Basics**  | **Name** = cluster-fsw<br/>**User Name** = DomainAdmin<br/>**Password** = Contoso!000<br/>**Subscription** = Your subscription<br/>**Resource group** = SQL-HA-RG<br/>**Location** = Your azure location | **Name** = sqlserver-0<br/>**User Name** = DomainAdmin<br/>**Password** = Contoso!000<br/>**Subscription** = Your subscription<br/>**Resource group** = SQL-HA-RG<br/>**Location** = Your azure location  | **Name** = sqlserver-1<br/>**User Name** = DomainAdmin<br/>**Password** = Contoso!000<br/>**Subscription** = Your subscription<br/>**Resource group** = SQL-HA-RG<br/>**Location** = Your azure location |
|Virtual machine configuration **Size** |DS1 (1 core, 3.5 GB memory)|**SIZE** = DS 2 (2 cores, 7 GB memory)|**SIZE** = DS 2 (2 cores, 7 GB memory)|
|Virtual machine configuration **Settings**|**Storage** = Premium (SSD)<br/>**NETWORK SUBNETS** = autoHAVNET<br/>**STORAGE ACCOUNT** = Use an automatically generated storage account<br/>**Subnet** = subnet-2(10.1.1.0/24)<br/>**Public IP address** = None<br/>**Network security group** = None<br/>**Monitoring Diagnostics** = Enabled<br/>**Diagnostics storage acccount** = Use an automatically generated storage account<br/>**AVAILABILITY SET** =  sqlAvailabilitySet<br/>|**Storage** = Premium (SSD)<br/>**NETWORK SUBNETS** = autoHAVNET<br/>**STORAGE ACCOUNT** = Use an automatically generated storage account<br/>**Subnet** = subnet-2(10.1.1.0/24)<br/>**Public IP address** = None<br/>**Network security group** = None<br/>**Monitoring Diagnostics** = Enabled<br/>**Diagnostics storage acccount** = Use an automatically generated storage account<br/>**AVAILABILITY SET** =  sqlAvailabilitySet<br/>|**Storage** = Premium (SSD)<br/>**NETWORK SUBNETS** = autoHAVNET<br/>**STORAGE ACCOUNT** = Use an automatically generated storage account<br/>**Subnet** = subnet-2(10.1.1.0/24)<br/>**Public IP address** = None<br/>**Network security group** = None<br/>**Monitoring Diagnostics** = Enabled<br/>**Diagnostics storage acccount** = Use an automatically generated storage account<br/>**AVAILABILITY SET** =  sqlAvailabilitySet<br/>
|Virtual machine configuration **SQL Server settings**|Not applicable|**SQL connectivity** = Private (within Virtual Network)<br/>**Port** = 1433<br/>**SQL Authentication** = Disable<br/>**Storage configuration** = General<br/>**Automated patching** = Sunday at 2:00<br/>**Automated backup** = Disabled</br>**Azure Key Vault integration** = Disabled|**SQL connectivity** = Private (within Virtual Network)<br/>**Port** = 1433<br/>**SQL Authentication** = Disable<br/>**Storage configuration** = General<br/>**Automated patching** = Sunday at 2:00<br/>**Automated backup** = Disabled</br>**Azure Key Vault integration** = Disabled|

<br/>

>[AZURE.NOTE] The previous configuration suggests STANDARD tier virtual machines because BASIC tier machines do not support load-balanced endpoints required by the availability group listener. Also, the machine sizes suggested here are meant for testing availability groups in Azure VMs. For the best performance on production workloads, see the recommendations for SQL Server machine sizes and configuration in [Performance best practices for SQL Server in Azure Virtual Machines](virtual-machines-sql-server-performance-best-practices.md).



Once the three VMs are fully provisioned, you need to join them to the **corp.contoso.com** domain and grant CORP\Install administrative rights to the machines.

To help you proceed, write  down the Azure virtual IP address for each VM. Get the IP address for each server. In the Azure SQL-HA-RG resource group click the **autohaVNET** resource. The **autohaVNET** blade will show the IP addresses for each machine in your network.
Record the IP addresses for the following devices: 

| VM Role | Device | IP Address
| ----- | ----- | -----
| Primary domain controller | ad-primary-dc |
| Secondary domain controller | ad-secondary-dc |
| Cluster file share witness | cluster-fsw |
| SQL Server | sqlserver-0 | 
| SQL Server | sqlserver-1 | 

You will use these addresses to configure the DNS service for each VM. To do this, use the following steps for each of the three VMs.


1. First, change the preferred DNS server address for each member server. 

1. Launch the RDP file to the primary domain controller (**ad-primary-dc**) and log into the VM using your configured administrator account (**BUILTIN\DomainAdmin**) and password (**Contoso!000**).

1. From the primary domain controller, open launch a remote desktop to the secondary domain controller by using the IP address for the **Computer:**. Use the same account and password.

1. Once you are logged in, you should see the **Server Manager** dashboard. Click **Local Server** in the left pane.

1. Select the **IPv4 address assigned by DHCP, IPv6 enabled** link.

1. In the **Network Connections** window, select the network icon.

	![Change the VM Preferred DNS Server](./media/virtual-machines-windows-sql-gui-alwayson-availability-groups-manual/IC784629.png)

1. On the command bar, click **Change the settings of this connection** (depending on the size of your window, you might have to click the double right arrow to see this command).

1. Select **Internet Protocol Version 4 (TCP/IPv4)** and click Properties.

1. Select Use the following DNS server addresses and specify the address of the primary domain controller in **Preferred DNS server**.

1. The address is the address assigned to a VM in the subnet-1 subnet in the Azure virtual network, and that VM is **ad-primary-dc**. To verify **ad-primary-dc**'s IP address, use the **nslookup corp.contoso.com** in the command prompt, as shown below.

	![Use NSLOOKUP to find IP address for DC](./media/virtual-machines-windows-sql-gui-alwayson-availability-groups-manual/IC664954.png)

  >[AZURE.NOTE] After setting the DNS, you may loose the RDP session to the member server. If you do, reboot the VM from the Azure portal.


1. Click **OK** and then **Close** to commit the changes. You are now able to join the VM to **corp.contoso.com**.

1. Back in the **Local Server** window, click the **WORKGROUP** link.

1. In the **Computer Name** section, click **Change**.

1. Select the **Domain** check box and type **corp.contoso.com** in the text box. Click **OK**.

1. In the **Windows Security** popup dialog, specify the credentials for the default domain administrator account (**CORP\DomainAdmin**) and the password (**Contoso!000**).

1. When you see the "Welcome to the corp.contoso.com domain" message, click **OK**.

1. Click **Close**, and then click **Restart Now** in the popup dialog.

1. Repeat these steps for the file share witness server and each SQL Server. 

### Add the Corp\Install user as an administrator on each VM:

1. Wait until the VM is restarted, then launch the RDP file again from the primary domain controller to log into the VM using the **BUILTIN\DomainAdmin** account.

1. In **Server Manager** select **Tools**, and then click **Computer Management**.

	![Computer Management](./media/virtual-machines-windows-sql-gui-alwayson-availability-groups-manual/IC784630.png)

1. In the **Computer Management** window, expand **Local Users and Groups**, and then select **Groups**.

1. Double-click the **Administrators** group.

1. In the **Administrators Properties** dialog, click the **Add** button.

1. Enter the user **CORP\Install**, and then click **OK**. When prompted for credentials, use the **DomainAdmin** account with the **Contoso!000** password.

1. Click **OK** to close the **Administrator Properties** dialog.

### Add the **Failover Clustering** feature to each VM.

1. In the **Server Manager** dashboard, click **Add roles and features**.

1. In the **Add Roles and Features Wizard**, click **Next** until you get to the **Features** page.

1. Select **Failover Clustering**. When prompted, add any other dependent features.

	![Add Failover Clustering Feature to VM](./media/virtual-machines-windows-sql-gui-alwayson-availability-groups-manual/IC784631.png)

1. Click **Next**, and then click **Install** on the **Confirmation** page.

1. When the **Failover Clustering** feature installation is completed, click **Close**.

1. Log out of the VM.

1. Repeat the steps in this section for all three servers -- **ContosoWSFCNode**, **sqlserver-0**, and **sqlserver-1**.

The SQL Server VMs are now provisioned and running, but they are installed with SQL Server with default options.

## Create the WSFC Cluster

In this section, you create the WSFC cluster that will host the availability group you will create later. By now, you should have done the following to each of the three VMs you will use in the WSFC cluster:

- Fully provisioned in Azure

- Joined VM to the domain

- Added **CORP\Install** to the local Administrators group

- Added the Failover Clustering feature

All these are prerequisites on each VM before you can join it to the WSFC cluster.

Also, note that the Azure virtual network does not behave in the same way as an on-premises network. You need to create the cluster in the following order:

1. Create a single-node cluster on one of the nodes (**sqlserver-0**).

1. Modify the cluster IP address to an unused IP address in the **sqlsubnet**.

1. Bring the cluster name online.

1. Add the other nodes (**sqlserver-1** and **cluster-fsw**).

Follow the steps below to accomplish these tasks that fully configures the cluster.

1. Launch the RDP file for **sqlserver-0** and log in using the domain account **CORP\Install**.

1. In the **Server Manager** dashboard, select **Tools**, and then click **Failover Cluster Manager**.

1. In the left pane, right-click **Failover Cluster Manager**, and then click **Create a Cluster**, as shown below.

	![Create Cluster](./media/virtual-machines-windows-sql-gui-alwayson-availability-groups-manual/IC784632.png)

1. In the Create Cluster Wizard, create a one-node cluster by stepping through the pages with the settings below:

	|Page|Settings|
|---|---|
|Before You Begin|Use defaults|
|Select Servers|Type **sqlserver-0** in **Enter server name** and click **Add**|
|Validation Warning|Select **No. I do not require support from Microsoft for this cluster, and therefore do not want to run the validation tests. When I click Next, continue creating the cluster**.|
|Access Point for Administering the Cluster|Type **Cluster1** in **Cluster Name**|
|Confirmation|Use defaults unless you are using Storage Spaces. See the note following this table.|

	>[AZURE.WARNING] If you are using [Storage Spaces](https://technet.microsoft.com/library/hh831739), which groups multiple disks into storage pools, you must uncheck the **Add all eligible storage to the cluster** checkbox on the **Confirmation** page. If you do not uncheck this option, the virtual disks will be detached during the clustering process. As a result, they will also not appear in Disk Manager or Explorer until the storage spaces are removed from cluster and reattached using PowerShell.

1. In the left-pane, expand **Failover Cluster Manager**, and then click **Cluster1.corp.contoso.com**.

1. In the center pane, scroll down to **Cluster Core Resources** section and expand the **Name: Clutser1** details. You should see both the **Name** and the **IP Address** resources in the **Failed** state. The IP address resource cannot be brought online because the cluster is assigned the same IP address as that of the machine itself, which is a duplicate address.

1. Right-click the failed **IP Address** resource, and then click **Properties**.

	![Cluster Properties](./media/virtual-machines-windows-sql-gui-alwayson-availability-groups-manual/IC784633.png)

1. Select **Static IP Address** and specify an available address from subnet-2 in the Address text box. Then, click **OK**.

1. In the **Cluster Core Resources** section, right-click **Name: Cluster1** and click **Bring Online**. Then, wait until both resources are online. When the cluster name resource comes online, it updates the DC server with a new AD computer account. This AD account will be used to run the availability group clustered service later.

1. Finally, you add the remaining nodes to the cluster. In the browser tree, right-click **Cluster1.corp.contoso.com** and click **Add Node**, as shown below.

	![Add Node to the Cluster](./media/virtual-machines-windows-sql-gui-alwayson-availability-groups-manual/IC784634.png)

1. In the **Add Node Wizard**, click **Next**. In the **Select Servers** page, add **sqlserver-1** and **ContosoWSFCNode** to the list by typing the server name in **Enter server name** and then clicking **Add**. When you are done, click **Next**.

1. In the **Validation Warning** page, click **No** (in a production scenario you should perform the validation tests). Then, click **Next**.

1. In the **Confirmation** page, click **Next** to add the nodes.

	>[AZURE.WARNING] If you are using [Storage Spaces](https://technet.microsoft.com/library/hh831739), which groups multiple disks into storage pools, you must uncheck the **Add all eligible storage to the cluster** checkbox. If you do not uncheck this option, the virtual disks will be detached during the clustering process. As a result, they will also not appear in Disk Manager or Explorer until the storage spaces are removed from cluster and reattached using PowerShell.

1. Once the nodes are added to the cluster, click **Finish**. Failover Cluster Manager should now show that your cluster has three nodes and list them in the **Nodes** container.

1. Log out of the remote desktop session.

## Prepare the SQL Server Instances for Availability Group

In this section, you will do the following on both **sqlserver-0** and **sqlserver-1**:

- Add **CORP\Install** as a sysadmin role to the default SQL Server instance

- Open the firewall for remote access of SQL Server

- Enable the AlwaysOn Availability Groups feature

- Change the SQL Server service account to **CORP\SQLSvc1** and **CORP\SQLSvc2**, respectively

These actions can be performed in any order. Nevertheless, the steps below will walk through them in order. Follow the steps for both **sqlserver-0** and **sqlserver-1**:

1. If you have not logged out of the remote desktop session for the VM, do so now.

1. Launch the RDP files for **sqlserver-0** and **sqlserver-1** and log in as **BUILTIN\DomainAdmin**.

1. Launch **SQL Server Management Studio**, add **CORP\Install** as a **sysadmin** role to the default SQL Server instance. In **Object Explorer**, right-click **Logins** and click **New Login**.

1. Type **CORP\Install** in **Login name**.

1. In the **Server Roles** page, select **sysadmin**. Then, click **OK**. Once the login is created, you can see it by expanding **Logins** in **Object Explorer**.

1. Next, you create a firewall rule for SQL Server. From the **Start** screen, launch **Windows Firewall with Advanced Security**.

1. In the left pane, select **Inbound Rules**. On the right pane, click **New Rule**.

1. In the **Rule Type** page, select **Program**, then click **Next**.

1. In the **Program** page, select **This program path** and type **%ProgramFiles%\Microsoft SQL Server\MSSQL12.MSSQLSERVER\MSSQL\Binn\sqlservr.exe** in the text box (if you are following these directions but using SQL Server 2012, the SQL Server directory is **MSSQL11.MSSQLSERVER**). Then click **Next**.

1. In the **Action** page, keep **Allow the connection** selected and click **Next**.

1. In the **Profile** page, accept the default settings and click **Next**.

1. In the **Name** page, specify a rule name, such as **SQL Server (Program Rule)** in the **Name** text box, then click **Finish**.

1. Next, you enable the **AlwaysOn Availability Groups** feature. From the **Start** screen, launch **SQL Server Configuration Manager**.

1. In the browser tree, click **SQL Server Services**, then right-click the **SQL Server (MSSQLSERVER)** service and click **Properties**.

1. Click the **AlwaysOn High Availability** tab, then select **Enable AlwaysOn Availability Groups**, as shown below, and then click **Apply**. Click **OK** in the pop-up dialog, and do not close the properties window yet. You will restart the SQL Server service after you change the service account.

	![Enable AlwaysOn Availability Groups](./media/virtual-machines-windows-sql-gui-alwayson-availability-groups-manual/IC665520.gif)

1. Next, you change the SQL Server service account. Click the **Log On** tab, then type **CORP\SQLSvc1** (for **sqlserver-0**) or **CORP\SQLSvc2** (for **sqlserver-1**) in **Account Name**, then fill in and confirm the password, and then click **OK**.

1. In the pop-up window, click **Yes** to restart the SQL Server service. After the SQL Server service is restarted, the changes you made in the properties window are effective.

1. Log out of the VMs.

## Create the Availability Group

You are now ready to configure an availability group. Below is an outline of what you will do:

- Create a new database (**MyDB1**) on **sqlserver-0**

- Take both a full backup and a transaction log backup of the database

- Restore the full and log backups to **sqlserver-1** with the **NORECOVERY** option

- Create the availability group (**AG1**) with synchronous commit, automatic failover, and readable secondary replicas

### Create the MyDB1 database on sqlserver-0:

1. If you have not already logged out of the remote desktop sessions for **sqlserver-0** and **sqlserver-1**, do so now.

1. Launch the RDP file for **sqlserver-0** and log in as **CORP\Install**.

1. In **File Explorer**, under **C:\**, create a directory called **backup**. You will use this directory use to back up and restore your database.

1. Right-click the new directory, point to **Share with**, and then click **Specific people**, as shown below.

	![Create a Backup Folder](./media/virtual-machines-windows-sql-gui-alwayson-availability-groups-manual/IC665521.gif)

1. Add **CORP\SQLSvc1** and give it the **Read/Write** permission, then add **CORP\SQLSvc2** and give it the **Read** permission, as shown below, and then click **Share**. Once the file sharing process is complete, click **Done**.

	![Grant Permissions For Backup Folder](./media/virtual-machines-windows-sql-gui-alwayson-availability-groups-manual/IC665522.gif)

1. Next, you create the database. From the **Start** menu, launch **SQL Server Management Studio**, then click **Connect** to connect to the default SQL Server instance.

1. In the **Object Explorer**, right-click **Databases** and click **New Database**.

1. In **Database name**, type **MyDB1**, then click **OK**.

### Take a full backup of MyDB1 and restore it on sqlserver-1:

1. Next, you take a full backup of the database. In the **Object Explorer**, expand **Databases**, then right-click **MyDB1**, then point to **Tasks**, and then click **Back Up**.

1. In the **Source** section, keep **Backup type** set to **Full**. In the **Destination** section, click **Remove** to remove the default file path for the backup file.

1. In the **Destination** section, click **Add**.

1. In the **File name** text box, type **\\sqlserver-0\backup\MyDB1.bak**. Then, click **OK**, and then click **OK** again to backup the database. When the backup operation completes, click **OK** again to close the dialog.

1. Next, you take a transaction log backup of the database. In the **Object Explorer**, expand **Databases**, then right-click **MyDB1**, then point to **Tasks**, and then click **Back Up**.

1. In **Backup** type, select **Transaction Log**. Keep the **Destination** file path set to the one you specified earlier and click **OK**. Once the backup operation completes, click **OK** again.

1. Next, you restore the full and transaction log backups on **sqlserver-1**. Launch the RDP file for **sqlserver-1** and log in as **CORP\Install**. Leave the remote desktop session for **sqlserver-0** open.

1. From the **Start** menu, launch **SQL Server Management Studio**, then click **Connect** to connect to the default SQL Server instance.

1. In the **Object Explorer**, right-click **Databases** and click **Restore Database**.

1. In the **Source** section, select **Device**, and click the **…** button.

1. In **Select backup devices**, click **Add**.

1. In Backup file location, type \\sqlserver-0\backup, then click Refresh, then select MyDB1.bak, then click OK, and then click OK again. You should now see the full backup and the log backup in the Backup sets to restore pane.

1. Go to the Options page, then select RESTORE WITH NORECOVERY in Recovery state, and then click OK to restore the database. Once the restore operation completes, click OK.

### Create the availability group:

1. Go back to the remote desktop session for **sqlserver-0**. In the **Object Explorer** in SSMS, right-click **AlwaysOn High Availability** and click **New Availability Group Wizard**, as shown below.

	![Launch New Availability Group Wizard](./media/virtual-machines-windows-sql-gui-alwayson-availability-groups-manual/IC665523.gif)

1. In the **Introduction** page, click **Next**. In the **Specify Availability Group Name** page, type **AG1** in **Availability group name**, then click **Next** again.

	![New AG Wizard, Specify AG Name](./media/virtual-machines-windows-sql-gui-alwayson-availability-groups-manual/IC665524.gif)

1. In the **Select Databases** page, select **MyDB1** and click **Next**. The database meets the prerequisites for an availability group because you have taken at least one full backup on the intended primary replica.

	![New AG Wizard, Select Databases](./media/virtual-machines-windows-sql-gui-alwayson-availability-groups-manual/IC665525.gif)

1. In the **Specify Replicas** page, click **Add Replica**.

	![New AG Wizard, Specify Replicas](./media/virtual-machines-windows-sql-gui-alwayson-availability-groups-manual/IC665526.gif)

1. The **Connect to Server** dialog pops up. Type **sqlserver-1** in **Server name**, then click **Connect**.

	![New AG Wizard, Connect to Server](./media/virtual-machines-windows-sql-gui-alwayson-availability-groups-manual/IC665527.gif)

1. Back in the **Specify Replicas** page, you should now see **sqlserver-1** listed in **Available Replicas**. Configure the replicas as shown below. When you are finished, click **Next**.

	![New AG Wizard, Specify Replicas (Complete)](./media/virtual-machines-windows-sql-gui-alwayson-availability-groups-manual/IC665528.gif)

1. In the **Select Initial Data Synchronization** page, select **Join only** and click **Next**. You have already performed data synchronization manually when you took the full and transaction backups on **sqlserver-0** and restored them on **sqlserver-1**. You can instead choose not to perform the backup and restore operations on your database and select **Full** to let the New Availability Group Wizard perform data synchronization for you. However, this is not recommended for very large databases that are found in some enterprises.

	![New AG Wizard, Select Initial Data Synchronization](./media/virtual-machines-windows-sql-gui-alwayson-availability-groups-manual/IC665529.gif)

1. In the **Validation** page, click **Next**. This page should look similar to below. There is a warning for the listener configuration because you have not configured an availability group listener. You can ignore this warning, because this tutorial does not configure a listener. To configure the listener after completing this tutorial, see [Configure an ILB listener for AlwaysOn Availability Groups in Azure](virtual-machines-sql-server-configure-ilb-alwayson-availability-group-listener.md).

	![New AG Wizard, Validation](./media/virtual-machines-windows-sql-gui-alwayson-availability-groups-manual/IC665530.gif)

1. In the **Summary** page, click **Finish**, then wait while the wizard configures the new availability group. In the **Progress** page, you can click **More details** to view the detailed progress. Once the wizard is finished, inspect the **Results** page to verify that the availability group is successfully created, as shown below, then click **Close** to exit the wizard.

	![New AG Wizard, Results](./media/virtual-machines-windows-sql-gui-alwayson-availability-groups-manual/IC665531.gif)

1. In the **Object Explorer**, expand **AlwaysOn High Availability**, then expand **Availability Groups**. You should now see the new availability group in this container. Right-click **AG1 (Primary)** and click **Show Dashboard**.

	![Show AG Dashboard](./media/virtual-machines-windows-sql-gui-alwayson-availability-groups-manual/IC665532.gif)

1. Your **AlwaysOn Dashboard** should look similar to the one shown below. You can see the replicas, the failover mode of each replica and the synchronization state.

	![AG Dashboard](./media/virtual-machines-windows-sql-gui-alwayson-availability-groups-manual/IC665533.gif)

1. Return to **Server Manager**, select **Tools**, and then launch **Failover Cluster Manager**.

1. Expand **Cluster1.corp.contoso.com**, and then expand **Services and applications**. Select **Roles** and note that the **AG1** availability group role has been created. Note that AG1 does not have any IP address by which database clients can connect to the availability group, because you did not configure a listener. You can connect directly to the primary node for read-write operations and the secondary node for read-only queries.

	![AG in Failover Cluster Manager](./media/virtual-machines-windows-sql-gui-alwayson-availability-groups-manual/IC665534.gif)

>[AZURE.WARNING] Do not try to fail over the availability group from the Failover Cluster Manager. All failover operations should be performed from within **AlwaysOn Dashboard** in SSMS. For more information, see [Restrictions on Using The WSFC Failover Cluster Manager with Availability Groups](https://msdn.microsoft.com/library/ff929171.aspx).

## Configure an internal load balancer in Azure and an availablity group listener in the cluster

In order to connect to the availability group directly, you need to configure an internal load balancer in Azure and then create the listener on the cluster. This section provides a high level overview of those steps. For detailed instructions, see [Configure an internal load balancer for an AlwaysOn availability group in Azure](virtual-machines-windows-sql-gui-int-listener.md).  

### Create the load balancer in Azure

1. In the Azure portal, go to **SQL-HA-RG** and click **+ Add**.

1. Search for **Load Balancer**. Choose the load balancer published by Microsoft and click **Create**.

1. Configure the following parameters for the load balancer.

| Setting | Field |
| --- | ---
| **Name** | sqlLB
| **Scheme** | Internal
| **Virtual network ** | autoHAVNET
| **Subnet** | subnet-2
| **IP address assignment** | Static
| **IP address** | Use an available address from subnet-2.
| **Subscription** | Use the same subscription as all other resources in this solution.
| **Location** | Use the same location as all other resources in this solution.

Click **Create**.

Make the following settings on the load balancer:

| Setting | Field |
| --- | ---|
| **Backend pool** Name | sqlLBBE 
| **SQLLBBE Availability set** | sqlAvailabilitySet
| **SQLLBBE Virtual machines** | sqlserver-0, sqlserver-1
| **SQLLBBE Used by** | SQLAlwaysOnEndPointListener
| **Probe** Name | SQLAlwaysOnEndPointProbe
| **Probe Protocol** | TCP
| **Probe Port** | 59999 - Note that you can use any unused port.
| **Probe Interval** | 5
| **Probe Unhealthy threshold** | 2
| **Probe Used by** | SQLAlwaysOnEndPointListener
| **Load balancing rules** Name | SQLAlwaysOnEndPointListener
| **Load balancing rules Protocol** | TCP
| **Load balancing rules Port** | 1433 - Note that this is because this is the SQL Server default port.
| **Load balancing rules Backend Pool** | SQLLBBE
| **Load balancing rules Probe** | SQLAlwaysOnEndPointProbe
| **Load balancing rules Session Persistence** | None
| **Load balancing rules Idle Timeout ** | 4
| **Floating IP (direct server return)** | Enabled

## Next Steps

For other information about using SQL Server in Azure, see [SQL Server on Azure Virtual Machines](../articles/virtual-machines/virtual-machines-sql-server-infrastructure-services.md).
