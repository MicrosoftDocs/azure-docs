---
title: "Setup Always On availability group with DH2i DxEnterprise running on Linux-based Azure Virtual Machines"
description: Use DH2i DxEnterprise as the cluster manager to achieve high availability with an availability group on SQL Server on Linux Azure Virtual Machines
ms.date: 03/04/2021
ms.service: virtual-machines-sql
ms.subservice: hadr
ms.topic: tutorial
author: amvin87
ms.author: amitkh
ms.reviewer: vanto
---

# Tutorial - Setup a three node Always On availability group with DH2i DxEnterprise running on Linux-based Azure Virtual Machines

[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This tutorial explains how to configure SQL Server Always On availability group with DH2i DxEnterprise running on Linux-based Azure Virtual Machines (VMs). 

For more information about DxEnterprise, see [DH2i DxEnterprise](https://dh2i.com/dxenterprise-availability-groups/).

> [!NOTE]
> Microsoft supports data movement, the availability group, and the SQL Server components. Contact DH2i for support related to the documentation of DH2i DxEnterprise cluster, for the cluster and quorum management.
 

This tutorial consists of the following steps:

> [!div class="checklist"]
> * Install SQL Server on all the Azure virtual machines (VMs) that will be part of the availability group.
> * Install DxEnterprise on all the VMs and configure the DxEnterprise cluster.
> * Create the virtual hosts to provide failover support and high availability, add an availability group and database to the availability group.
> * Create the Internal Azure Load balancer for Availability group listener (optional).
> * Perform an manual or automatic failover.

In this tutorial, we are going to set up a DxEnterprise cluster using [DxAdmin Client UI](https://dh2i.com/docs/20-0/dxenterprise/dh2i-dxenterprise-20-0-software-dxadmin-client-ui-quick-start-guide/). Optionally, you can also set up the cluster using the [DxCLI](https://dh2i.com/docs/20-0/dxenterprise/dh2i-dxenterprise-20-software-dxcli-guide/) command-line interface. For this example, we've used four VMs. Three of those VMs are running Ubuntu 18.04, and are part of the three node cluster. The fourth VM is running Windows 10 with the DxAdmin tool to manage and configure the cluster.

## Prerequisites

- Create four VMs in Azure. Follow the [Quickstart: Create Linux virtual machine in Azure portal](../../../virtual-machines/linux/quick-create-portal.md) article to create Linux based virtual machines. Similarly, for creating the Windows based virtual machine, follow the [Quickstart: Create a Windows virtual machine in the Azure portal](../../../virtual-machines/windows/quick-create-portal.md) article.
- Install .NET 3.1 on all the Linux-based VMs that are going to be part of the cluster. Follow the instructions documented [here](/dotnet/core/install/linux) based on the Linux operating system that you choose.
- A valid DxEnterprise license with availability group management features enabled will be required. For more information, see [DxEnterprise Free Trial](https://dh2i.com/trial/) about how you can obtain a free trial.

## Install SQL Server on all the Azure VMs that will be part of the availability group

In this tutorial, we are setting up a three node Linux-based cluster running the availability group. Follow the documentation for [SQL Server installation on Linux](/sql/linux/sql-server-linux-overview#install) based on the choice of your Linux platform. We also recommend you install the [SQL Server tools](/sql/linux/sql-server-linux-setup-tools) for this tutorial.
 
> [!NOTE]
> Ensure that the Linux OS that you choose is a common distribution that is supported by both [DH2i DxEnterprise ( See Minimal System Requirements Section)](https://dh2i.com/wp-content/uploads/DxEnterprise-v20-Admin-Guide.pdf) and [Microsoft SQL Server](/sql/linux/sql-server-linux-release-notes-2019#supported-platforms).
>
> In this example, we use Ubuntu 18.04, which is supported by both DH2i DxEnterprise and Microsoft SQL Server.

For this tutorial, we are not going to install SQL Server on the Windows VM, as this node is not going to be part of the cluster, and is used only to manage the cluster using DxAdmin.

After you complete this step, you should have SQL Server and [SQL Server tools](/sql/linux/sql-server-linux-setup-tools) (optionally) installed on all three Linux-based VMs that will participate in the availability group.
 
## Install DxEnterprise on all the VMs and Configure the cluster

In this step, we are going to install DH2i DxEnterprise for Linux on the three Linux VMs. The following table describes the role each server plays in the cluster:

| Number of VMs | DH2i DxEnterprise   role | Microsoft SQL   Server availability group replica role |
|--|--|--|
| 1 | Cluster node -   Linux based | Primary |
| 1 | Cluster node -   Linux based | Secondary - Synchronous commit |
| 1 | Cluster node -   Linux based | Secondary - Synchronous commit |
| 1 | DxAdmin Client | NA |


To install DxEnterprise on the three Linux-based nodes, follow the DH2i DxEnterprise documentation based on the Linux operating system you choose. Install DxEnterprise using any one of the methods listed below.

- **Ubuntu**
    - [Repo Installation Quick Start Guide](https://dh2i.com/docs/20-0/dxenterprise/dh2i-dxenterprise-20-0-software-ubuntu-installation-quick-start-guide/)
    - [Extension Quick Start Guide](https://dh2i.com/docs/20-0/dxenterprise/dh2i-dxenterprise-20-0-software-azure-extension-quick-start-guide/)
    - [Marketplace Image Quick Start Guide](https://dh2i.com/docs/20-0/dxenterprise/dh2i-dxenterprise-20-0-software-azure-marketplace-image-for-linux-quick-start-guide/)
- **RHEL**
    - [Repo Installation Quick Start Guide](https://dh2i.com/docs/20-0/dxenterprise/dh2i-dxenterprise-20-0-software-rhel-centos-installation-quick-start-guide/)
    - [Extension Quick Start Guide](https://dh2i.com/docs/20-0/dxenterprise/dh2i-dxenterprise-20-0-software-azure-extension-quick-start-guide/)
    - [Marketplace Image Quick Start Guide](https://dh2i.com/docs/20-0/dxenterprise/dh2i-dxenterprise-20-0-software-azure-marketplace-image-for-linux-quick-start-guide/)

To install just the DxAdmin client tool on the Windows VM, follow [DxAdmin Client UI Quick Start Guide](https://dh2i.com/docs/20-0/dxenterprise/dh2i-dxenterprise-20-0-software-dxadmin-client-ui-quick-start-guide/).

After this step, you should have the DxEnterprise cluster created on the Linux VMs, and DxAdmin client installed on the Windows Client machine. 

> [!NOTE]
> You can also create a three node cluster where one of the node is added as *configuration-only mode*, as described [here](/sql/database-engine/availability-groups/windows/availability-modes-always-on-availability-groups#SupportedAvModes) to enable automatic failover. 

## Create the virtual hosts to provide failover support and high availability

In this step, we're going to create a virtual host, availability group, and then add a database, all using the DxAdmin UI.   

> [!NOTE]
> During this step, the SQL Server instances will be restarted to enable Always On. 

Connect to the Windows client machine running DxAdmin to connect to the cluster created in the step above. Follow the steps documented at [MSSQL Availability Groups with DxAdmin](https://dh2i.com/docs/20-0/dxenterprise/dh2i-dxenterprise-20-0-software-mssql-availability-groups-with-dxadmin-quick-start-guide/) to enable Always On and create the virtual host and availability group. 

> [!TIP]
> Before adding the databases, ensure the database is created and backed up on the primary instance of SQL Server.  

## Create the Internal Azure Load balancer for Listener (optional)

In this optional step, you can create and configure the Azure Load balancer that holds the IP addresses for the availability group listeners. For more information on Azure Load Balancer, refer [Azure Load Balancer](../../../load-balancer/load-balancer-overview.md). To configure the Azure load balancer and availability group listener using DxAdmin, follow the DxEnterprise [Azure Load Balancer Quick Start Guide](https://dh2i.com/docs/20-0/dxenterprise/dh2i-dxenterprise-20-0-software-azure-load-balancer-quick-start-guide/).

After this step, you should have an availability group listener created and mapped to the Internal Azure load balancer.

## Test manual or automatic failover

For the automatic failover test, you can go ahead and bring down the primary replica (power off the virtual machine from the Azure portal). This will replicate the sudden unavailability of the primary node. The expected behavior is:
- The cluster manager promotes one of the secondary replicas in the availability group to primary.
- The failed primary replica automatically joins the cluster after it is back up. The cluster manager promotes it to secondary replica.

 
You could also perform a manual failover by following the below mentioned steps:

1. Connect to the cluster via DxAdmin   
1. Expand the virtual host for the availability group
1. Right-click on the target node/secondary replica and select **Start Hosting on Member** to initiate the failover 

For more information on more operations within DxEnterprise, access the [DxEnterprise Admin Guide](https://dh2i.com/wp-content/uploads/DxEnterprise-v20-Admin-Guide.pdf) and [DxEnterprise DxCLI Guide](https://dh2i.com/docs/20-0/dxenterprise/dh2i-dxenterprise-20-software-dxcli-guide/)

## Next Steps

- Learn more about [Availability Groups on Linux](/sql/linux/sql-server-linux-availability-group-overview)
- [Quickstart: Create Linux virtual machine in Azure portal](../../../virtual-machines/linux/quick-create-portal.md)
- [Quickstart: Create a Windows virtual machine in the Azure portal](../../../virtual-machines/windows/quick-create-portal.md)
- [Supported platforms for SQL Server 2019 on Linux](/sql/linux/sql-server-linux-release-notes-2019#supported-platforms)