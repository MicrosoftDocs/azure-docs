<properties
	pageTitle="Configure AlwaysOn Availability Groups ARM (GUI)  | Microsoft Azure"
	description="Create an AlwaysOn Availability Group with Azure Virtual Machines in Azure Resource Manager mode. This tutorial primarily uses the user interface to script the entire solution."
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
	ms.date="12/04/2015"
	ms.author="MikeRayMSFT" />

# Configure AlwaysOn Availability Groups in Azure VM (GUI)

> [AZURE.SELECTOR]
- [Azure classic portal](virtual-machines-sql-server-alwayson-availability-groups-gui.md)
- [PowerShell](virtual-machines-sql-server-alwayson-availability-groups-powershell.md)
- [ARM portal](virtual-machines-sql-server-alwayson-availability-groups-gui-arm.md)

<br/>

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-rm-include.md)] Resource Manager model.


This end-to-end tutorial shows you how to create a SQL Server Availability Group on new Azure Resource Manager model virtual machines.

>[AZURE.NOTE] In the Azure Management Portal, there is a new gallery setup for AlwaysOn Availability Groups with a Listener. This configures everything you need for AlwaysOn Availability Groups automatically. For more information, see [SQL Server AlwaysOn Offering in Microsoft Azure classic portal Gallery](http://blogs.technet.com/b/dataplatforminsider/archive/2014/08/25/sql-server-alwayson-offering-in-microsoft-azure-portal-gallery.aspx). To use PowerShell, see the tutorial of the same scenario at [Configure AlwaysOn Availability Groups in Azure with PowerShell](virtual-machines-sql-server-alwayson-availability-groups-powershell.md).

At the end of the tutorial, your SQL Server AlwaysOn solution in Azure will consist of the following elements:

- A virtual network containing multiple subnets, including a front-end and a back-end subnet

- Two domain controller with an Active Directory (AD) domain

- Two SQL Server VMs deployed to the back-end subnet and joined to the AD domain

- A 3-node WSFC cluster with the Node Majority quorum model

- An availability group with two synchronous-commit replicas of an availability database

The figure below is a graphical representation of the solution.

![Test Lab Architecture for AG in Azure](./media/virtual-machines-sql-server-alwayson-availability-groups-gui-arm/0-EndstateSample.png)



All of the resources in this solution belong to a single resource group.


This tutorial assumes the following:

- You already have an Azure account. If you don't have one, [sign up for a trial account](https://azure.microsoft.com/pricing/free-trial/).

- You already know how to provision a SQL Server VM from the virtual machine gallery using the GUI. For more information, see [Provisioning a SQL Server Virtual Machine on Azure](virtual-machines-provision-sql-server.md)

- You already have a solid understanding of AlwaysOn Availability Groups. For more information, see [AlwaysOn Availability Groups (SQL Server)](https://msdn.microsoft.com/library/hh510230.aspx).

>[AZURE.NOTE] If you are interested in using AlwaysOn Availability Groups with SharePoint, also see [Configure SQL Server 2012 AlwaysOn Availability Groups for SharePoint 2013](https://technet.microsoft.com/library/jj715261.aspx).

## Provision an AlwaysOn Availability Group from the gallery with the resource manager deployment model

Azure provides a gallery image for the entire solution. In order to locate the template: 

1. 	Log in to the Azure portal using your account.
2.	On the Azure portal click **+New.** The portal will open the New blade. 
3.	On the New blade search for *AlwaysOn*. 
4.	In the search results locate *SQL Server AlwaysOn Cluster*. 
5.	On **Select a deployment model** choose **Resource Manager** 

### Basics

Click on **Basics** and configure the following:

- **Administrator user name** is a user account with domain administrator permissions and a member of the SQL Server sysadmin fixed server role on both instances of SQL Server. For this tutorial use **DomainAdmin**. 

- **Password** is the password for the domain administrator account. Use a complex password. Confirm the password. 

- **Subscription** is the subscription that Azure will bill to run all of the resources deployed for the AlwaysOn availability group. You can specify a different subscription if your account has multiple subscriptions.
 
- **Resource group** is the name for the group that all of the Azure resources created by this tutorial will belong to. For this tutorial use **SQL-HA-RG**. For more information, see (Azure Resource Manager overview)[resource-group-overview.md/#resource-groups]. 

- **Location** is the Azure region where the resources for this tutorial will be created. Select an Azure region to host the infrastructure. 

Below is what the **Basics** blade will look like:

![Basics](./media/virtual-machines-sql-server-alwayson-availability-groups-gui-arm/1-basics.png)

- Click **OK**. 

### Domain and network settings

On **Domain and network settings** blade review the preset values for the domain and network settings:

- **Forest root domain name** is the domain name that will be used for the AD domain that will host the cluster. For the tutorial use **contoso.com**. 

- **Virtual Network name** is the network name for the Azure virtual network. For this tutorial use **autohaVNET**.

- **Virtual Network address range** is the virtual network address range in CIDR format. For this tutorial use **10.0.0.0/16**.
- **Domain Controller subnet**. This is the name of a portion of the virtual network that hosts the domain controller. For this tutorial use **subnet-1**.
- **Domain Controller subnet address prefix** is the subnet address prefix in CIDR format for subnet-1. For this tutorial use **10.0.0.0/24**. 
- **SQL Server subnet** is the name of a portion of the virtual network that hosts the SQL Servers and the file share witness. For this tutorial use **subnet-2**
- **SQL Server subnet address space** is the subnet address prefix in CIDR format for subnet-2. For this tutorial use **10.0.1.0/26**. 

To learn more about virtual networks in [Azure see Virtual Network Overview](virtual-networks-overview.md).  

The **Domain and network settings should look like this:

![Domain and network settings](./media/virtual-machines-sql-server-alwayson-availability-groups-gui-arm/2-domain.png)
 
If necessary, you may change these values. For this tutorial we use the preset values. 
 
- Review the settings and click **OK**. 
