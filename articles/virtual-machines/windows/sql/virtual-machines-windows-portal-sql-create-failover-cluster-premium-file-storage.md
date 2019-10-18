---
title: SQL Server FCI with premium file share - Azure Virtual Machines 
description: "This article explains how to create a SQL Server Failover Cluster Instance using a premium file share on Azure Virtual Machines."
services: virtual-machines
documentationCenter: na
author: MashaMSFT
editor: monicar
tags: azure-service-management
ms.assetid: 9fc761b1-21ad-4d79-bebc-a2f094ec214d
ms.service: virtual-machines-sql
ms.custom: na
ms.topic: article
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 10/09/2019
ms.author: mathoma
---

# Configure SQL Server Failover Cluster Instance with premium file share on Azure Virtual Machines

This article explains how to create a SQL Server failover cluster instance (FCI) on Azure virtual machines using a [premium file share](../../../storage/files/storage-how-to-create-premium-fileshare.md). 

Premium file shares are SSD-backed consistently-low-latency file shares that are fully supported for use with Failover Cluster Instance for SQL Server 2012 and newer on Windows Server 2012 and newer. Premium file shares give you greater flexibility, allowing you to resize and scale the file share without any downtime. 


## Before you begin

There are a few things you need to know and a couple of things that you need in place before you proceed.

You should have an operational understanding of the following technologies:

- [Windows cluster technologies](/windows-server/failover-clustering/failover-clustering-overview)
- [SQL Server Failover Cluster Instances](/sql/sql-server/failover-clusters/windows/always-on-failover-cluster-instances-sql-server).

One important difference is that on an Azure IaaS VM failover cluster, we recommend a single NIC per server (cluster node) and a single subnet. Azure networking has physical redundancy that makes additional NICs and subnets unnecessary on an Azure IaaS VM guest cluster. Although the cluster validation report will issue a warning that the nodes are only reachable on a single network, this warning can be safely ignored on Azure IaaS VM failover clusters. 

Additionally, you should have a general understanding of the following technologies:

- [Azure premium file share](../../../storage/files/storage-how-to-create-premium-fileshare.md)
- [Azure resource groups](../../../azure-resource-manager/manage-resource-groups-portal.md)

> [!IMPORTANT]
> At this time, SQL Server failover cluster instances on Azure virtual machines are only supported with the [lightweight](virtual-machines-windows-sql-register-with-resource-provider.md#register-with-sql-vm-resource-provider) management mode of the [SQL Server IaaS Agent Extension](virtual-machines-windows-sql-server-agent-extension.md). To change from full extension mode to lightweight, delete the **SQL Virtual Machine** resource for the corresponding VMs and then register them with the SQL VM resource provider in [lightweight](virtual-machines-windows-sql-register-with-resource-provider.md#register-with-sql-vm-resource-provider) mode. When deleting the **SQL Virtual Machine** resource using the Azure portal, clear the checkbox next to the correct Virtual Machine. The full extension supports features such as automated backup, patching, and advanced portal management. These features will not work for SQL VMs after the agent is reinstalled in [lightweight](virtual-machines-windows-sql-register-with-resource-provider.md#register-with-sql-vm-resource-provider) management mode.

### Workload consideration

Premium file shares provide IOPS and throughout capacity that will meet the needs of many workloads. However, for IO intensive workloads, consider [SQL Server FCI with Storage Spaces Direct](virtual-machines-windows-portal-sql-create-failover-cluster.md) based on managed premium disks or ultra-disks.  

Check the IOPS activity of your current environment and verify that premium files will provide the IOPS you need before starting a deployment or migration. Use Windows Performance Monitor disk counters and monitor total IOPS (Disk Transfers/sec) and throughput (Disk bytes/sec) required for SQL Server Data, Log, and Temp DB files. Many workloads have bursting IO so it is a good idea to check during heavy usage periods and note the max IOPS as well as average IOPS. Premium files shares provide IOPS based on the size of the share. Premium files also provide complimentary bursting where you can burst your IO to triple the baseline amount for up to one hour. 

For more information about premium file share performance, see [File share performance tiers](https://docs.microsoft.com/en-us/azure/storage/files/storage-files-planning#file-share-performance-tiers). 

### Licensing and pricing

On Azure Virtual Machines, you can license SQL Server using pay as you go (PAYG) or bring your own license (BYOL) VM images. The type of image you choose affects how you are charged.

With PAYG licensing, a failover cluster instance (FCI) of SQL Server on Azure Virtual Machines incurs charges for all nodes of FCI, including the passive nodes. For more information, see [SQL Server Enterprise Virtual Machines Pricing](https://azure.microsoft.com/pricing/details/virtual-machines/sql-server-enterprise/). 

Customers with Enterprise Agreement with Software Assurance have the right to use one free passive FCI node for each active node. To take advantage of this benefit in Azure, use BYOL VM images and then use the same license on both the active and passive nodes of the FCI. For more information, see [Enterprise Agreement](https://www.microsoft.com/Licensing/licensing-programs/enterprise.aspx).

To compare PAYG and BYOL licensing for SQL Server on Azure Virtual Machines see [Get started with SQL VMs](virtual-machines-windows-sql-server-iaas-overview.md#get-started-with-sql-vms).

For complete information about licensing SQL Server, see [Pricing](https://www.microsoft.com/sql-server/sql-server-2017-pricing).

### Limitations

- Filestream is not supported for a failover cluster with a premium file share. To use filestream, deploy your cluster using [Storage Spaces Direct](virtual-machines-windows-portal-sql-create-failover-cluster.md). 

## Prerequisites 

Before following the instructions in this article, you should already have:

- A Microsoft Azure subscription.
- A Windows domain on Azure virtual machines.
- An account with permission to create objects in the Azure virtual machine.
- An Azure virtual network and subnet with sufficient IP address space for the following components:
   - Both virtual machines.
   - The failover cluster IP address.
   - An IP address for each FCI.
- DNS configured on the Azure Network, pointing to the domain controllers.
- A [premium file share](../../../storage/files/storage-how-to-create-premium-fileshare.md) based on the storage quota of your database for your data files. 
- A file share for backups that is different than the premium file share used for your data files. This file share can either be standard or premium. 

With these prerequisites in place, you can proceed with building your failover cluster. The first step is to create the virtual machines.

## Step 1: Create virtual machines

1. Log in to the [Azure portal](https://portal.azure.com) with your subscription.

1. [Create an Azure availability set](../tutorial-availability-sets.md).

   The availability set groups virtual machines across fault domains and update domains. The availability set makes sure that your application is not affected by single points of failure, like the network switch or the power unit of a rack of servers.

   If you have not created the resource group for your virtual machines, do it when you create an Azure availability set. If you're using the Azure portal to create the availability set, do the following steps:

   - In the Azure portal, click **+** to open the Azure Marketplace. Search for **Availability set**.
   - Click **Availability set**.
   - Click **Create**.
   - On the **Create availability set** blade, set the following values:
      - **Name**: A name for the availability set.
      - **Subscription**: Your Azure subscription.
      - **Resource group**: If you want to use an existing group, click **Use existing** and select the group from the drop-down list. Otherwise choose **Create New** and type a name for the group.
      - **Location**: Set the location where you plan to create your virtual machines.
      - **Fault domains**: Use the default (3).
      - **Update domains**: Use the default (5).
   - Click **Create** to create the availability set.

1. Create the virtual machines in the availability set.

   Provision two SQL Server virtual machines in the Azure availability set. For instructions, see [Provision a SQL Server virtual machine in the Azure portal](virtual-machines-windows-portal-sql-server-provision.md).

   Place both virtual machines:

   - In the same Azure resource group that your availability set is in.
   - On the same network as your domain controller.
   - On a subnet with sufficient IP address space for both virtual machines, and all FCIs that you may eventually use on this cluster.
   - In the Azure availability set.   

      >[!IMPORTANT]
      >You cannot set or change availability set after a virtual machine has been created.

   Choose an image from the Azure Marketplace. You can use a Marketplace image with that includes Windows Server and SQL Server, or just the Windows Server. For details, see [Overview of SQL Server on Azure Virtual Machines](virtual-machines-windows-sql-server-iaas-overview.md)

   The official SQL Server images in the Azure Gallery include an installed SQL Server instance, plus the SQL Server installation software, and the required key.

   >[!IMPORTANT]
   > After you create the virtual machine, remove the pre-installed standalone SQL Server instance. You will use the pre-installed SQL Server media to create the SQL Server FCI after you configure the failover cluster and premium file share as storage. 

   Alternatively, you can use Azure Marketplace images with just the operating system. Choose a **Windows Server 2016 Datacenter** image and install the SQL Server FCI after you configure the failover cluster and premium file share as storage. This image does not contain SQL Server installation media. Place the installation media in a location where you can run the SQL Server installation for each server. 

1. After Azure creates your virtual machines, connect to each virtual machine with RDP.

   When you first connect to a virtual machine with RDP, the computer asks if you want to allow this PC to be discoverable on the network. Click **Yes**.

1. If you are using one of the SQL Server-based virtual machine images, remove the SQL Server instance.

   - In **Programs and Features**, right-click **Microsoft SQL Server 201_ (64-bit)** and click **Uninstall/Change**.
   - Click **Remove**.
   - Select the default instance.
   - Remove all features under **Database Engine Services**. Do not remove **Shared Features**. See the following picture:

      ![Remove Features](./media/virtual-machines-windows-portal-sql-create-failover-cluster/03-remove-features.png)

   - Click **Next**, and then click **Remove**.

1. <a name="ports"></a>Open the firewall ports.

   On each virtual machine, open the following ports on the Windows Firewall.

   | Purpose | TCP Port | Notes
   | ------ | ------ | ------
   | SQL Server | 1433 | Normal port for default instances of SQL Server. If you used an image from the gallery, this port is automatically opened.
   | Health probe | 59999 | Any open TCP port. In a later step, configure the load balancer [health probe](#probe) and the cluster to use this port.   
   | File share | 445 | Port used by the file share service. 

1. [Add the virtual machines to your pre-existing domain](virtual-machines-windows-portal-sql-availability-group-prereq.md#joinDomain).

After the virtual machines are created and configured, you can configure the premium file share.

## Step 2: Mount premium file share

1. Sign into the [Azure portal](https://portal.azure.com) and go to your storage account.
1. Go to **File Shares** under **File service** and select the premium file share you want to use for your SQL storage. 
1. Select **Connect** to bring up the connection string for your file share. 
1. Select the drive letter you want to use from the drop-down and then copy both code blocks to a notepad.

   :::image type="content" source="media/virtual-machines-windows-portal-sql-create-failover-cluster-premium-file-storage/premium-file-storage-commands.png" alt-text="Copy both PowerShell commands from the file share connect portal":::

1. RDP into the SQL Server VM using the account that your SQL Server FCI will use for the service account. 
1. Launch an administrative PowerShell command console. 
1. Run the commands from the portal you saved earlier. 
1. Navigate to the share with either file explorer or the **Run** dialog box (Windows key + r) using the network path `\\storageaccountname.file.core.windows.net\filesharename`. Example: `\\sqlvmstorageaccount.file.core.windows.net\sqlpremiumfileshare`

1. Create at least one folder on the newly connected file share to place your SQL Data files into. 
1. Repeat these steps on each SQL Server VM that will participate in the cluster. 

  > [!IMPORTANT]
  > Consider using a separate file share for backup files to save the IOPS and size capacity of this share for Data and Log file. You can use either a Premium or Standard File Share for backup files

## Step 3: Configure failover cluster with file share 

The next step is to configure the failover cluster. In this step, you will do the following substeps:

1. Add Windows Failover Clustering feature
1. Validate the cluster
1. Create the failover cluster
1. Create the cloud witness


### Add Windows Failover Clustering feature

1. To begin, connect to the first virtual machine with RDP using a domain account that is a member of local administrators, and has permissions to create objects in Active Directory. Use this account for the rest of the configuration.

1. [Add Failover Clustering feature to each virtual machine](virtual-machines-windows-portal-sql-availability-group-prereq.md#add-failover-clustering-features-to-both-sql-server-vms).

   To install Failover Clustering feature from the UI, do the following steps on both virtual machines.
   - In **Server Manager**, click **Manage**, and then click **Add Roles and Features**.
   - In **Add Roles and Features Wizard**, click **Next** until you get to **Select Features**.
   - In **Select Features**, click **Failover Clustering**. Include all required features and the management tools. Click **Add Features**.
   - Click **Next** and then click **Finish** to install the features.

   To install the Failover Clustering feature with PowerShell, run the following script from an administrator PowerShell session on one of the virtual machines.

   ```powershell
   $nodes = ("<node1>","<node2>")
   Invoke-Command  $nodes {Install-WindowsFeature Failover-Clustering -IncludeAllSubFeature -IncludeManagementTools}
   ```

### Validate the cluster

This guide refers to instructions under [validate cluster](https://technet.microsoft.com/windows-server-docs/storage/storage-spaces/hyper-converged-solution-using-storage-spaces-direct#step-31-run-cluster-validation).

Validate the cluster in the UI or with PowerShell.

To validate the cluster with the UI, do the following steps from one of the virtual machines.

1. In **Server Manager**, click **Tools**, then click **Failover Cluster Manager**.
1. In **Failover Cluster Manager**, click **Action**, then click **Validate Configuration...**.
1. Click **Next**.
1. On **Select Servers or a Cluster**, type the name of both virtual machines.
1. On **Testing options**, choose **Run only tests I select**. Click **Next**.
1. On **Test selection**, include all tests except **Storage** and **Storage Spaces Direct**. See the following picture:

   :::image type="content" source="media/virtual-machines-windows-portal-sql-create-failover-cluster-premium-file-storage/cluster-validation.png" alt-text="Cluster validation tests":::

1. Click **Next**.
1. On **Confirmation**, click **Next**.

The **Validate a Configuration Wizard** runs the validation tests.

To validate the cluster with PowerShell, run the following script from an administrator PowerShell session on one of the virtual machines.

   ```powershell
   Test-Cluster –Node ("<node1>","<node2>") –Include "Inventory", "Network", "System Configuration"
   ```

After you validate the cluster, create the failover cluster.

### Create the failover cluster


To create the failover cluster, you need:
- The names of the virtual machines that become the cluster nodes.
- A name for the failover cluster
- An IP address for the failover cluster. You can use an IP address that is not used on the same Azure virtual network and subnet as the cluster nodes.

#### Windows Server 2012-2016

The following PowerShell creates a failover cluster for **Windows Server 2012-2016**. Update the script with the names of the nodes (the virtual machine names) and an available IP address from the Azure VNET:

```powershell
New-Cluster -Name <FailoverCluster-Name> -Node ("<node1>","<node2>") –StaticAddress <n.n.n.n> -NoStorage
```   

#### Windows Server 2019

The following PowerShell creates a failover cluster for Windows Server 2019.  For more information, review the blog [Failover Cluster: Cluster network Object](https://blogs.windows.com/windowsexperience/2018/08/14/announcing-windows-server-2019-insider-preview-build-17733/#W0YAxO8BfwBRbkzG.97).  Update the script with the names of the nodes (the virtual machine names) and an available IP address from the Azure VNET:

```powershell
New-Cluster -Name <FailoverCluster-Name> -Node ("<node1>","<node2>") –StaticAddress <n.n.n.n> -NoStorage -ManagementPointNetworkType Singleton 
```


### Create a cloud witness

Cloud Witness is a new type of cluster quorum witness stored in an Azure Storage Blob. This removes the need for a separate VM hosting a witness share.

1. [Create a cloud witness for the failover cluster](https://technet.microsoft.com/windows-server-docs/failover-clustering/deploy-cloud-witness).

1. Create a blob container.

1. Save the access keys and the container URL.

1. Configure the failover cluster quorum witness. See, [Configure the quorum witness in the user interface](https://technet.microsoft.com/windows-server-docs/failover-clustering/deploy-cloud-witness#to-configure-cloud-witness-as-a-quorum-witness) in the UI.


## Step 4: Test cluster failover

Test failover of  your cluster. In Failover Cluster Manager, right-click your cluster > **More Actions** > **Move Core Cluster Resource** > **Select node** and select the other node of the cluster. Move the core cluster resource to every node of the cluster, and then move it back to the primary node. If you're able to successfully move the cluster to each node, then you are ready to install SQL Server.  

:::image type="content" source="media/virtual-machines-windows-portal-sql-create-failover-cluster-premium-file-storage/test-cluster-failover.png" alt-text="Test cluster failover by moving the core resource to the other nodes":::

## Step 5: Create SQL Server FCI

After you have configured the failover cluster, you can create the SQL Server FCI.

1. Connect to the first virtual machine with RDP.

1. In **Failover Cluster Manager**, make sure all cluster core resources are on the first virtual machine. If necessary, move all resources to this virtual machine.

1. Locate the installation media. If the virtual machine uses one of the Azure Marketplace images, the media is located at `C:\SQLServer_<version number>_Full`. Click **Setup**.

1. In the **SQL Server Installation Center**, click **Installation**.

1. Click **New SQL Server failover cluster installation**. Follow the instructions in the wizard to install the SQL Server FCI.

   The FCI data directories need to be on the premium file share. Type in the full path of the share, in the form of `\\storageaccountname.file.core.windows.net\filesharename\foldername`. A warning will appear, notifying you that you have specified a file server as the data directory. This is expected. Ensure that the same account you persisted the file share with is the same account that the SQL Server service uses to avoid possible failures. 

   :::image type="content" source="media/virtual-machines-windows-portal-sql-create-failover-cluster-premium-file-storage/use-file-share-as-data-directories.png" alt-text="Use file share as SQL data directories":::

1. After you complete the wizard, Setup will install a SQL Server FCI on the first node.

1. After Setup successfully installs the FCI on the first node, connect to the second node with RDP.

1. Open the **SQL Server Installation Center**. Click **Installation**.

1. Click **Add node to a SQL Server failover cluster**. Follow the instructions in the wizard to install SQL server and add this server to the FCI.

   >[!NOTE]
   >If you used an Azure Marketplace gallery image with SQL Server, SQL Server tools were included with the image. If you did not use this image, install the SQL Server tools separately. See [Download SQL Server Management Studio (SSMS)](https://msdn.microsoft.com/library/mt238290.aspx).

## Step 6: Create Azure load balancer

On Azure virtual machines, clusters use a load balancer to hold an IP address that needs to be on one cluster node at a time. In this solution, the load balancer holds the IP address for the SQL Server FCI.

[Create and configure an Azure load balancer](virtual-machines-windows-portal-sql-availability-group-tutorial.md#configure-internal-load-balancer).

### Create the load balancer in the Azure portal

To create the load balancer:

1. In the Azure portal, go to the Resource Group with the virtual machines.

1. Click **+ Add**. Search the Marketplace for **Load Balancer**. Click **Load Balancer**.

1. Click **Create**.

1. Configure the load balancer with:

   - **Subscription**: Your Azure subscription.
   - **Resource Group**: Use the same resource group as your virtual machines.
   - **Name**: A name that identifies the load balancer.
   - **Region**: Use the same Azure location as your virtual machines.
   - **Type**: The load balancer can be either public or private. A private load balancer can be accessed from within the same VNET. Most Azure applications can use a private load balancer. If your application needs access to SQL Server directly over the Internet, use a public load balancer.
   - **SKU**: The SKU for your load balancer should be standard. 
   - **Virtual Network**: The same network as the virtual machines.
   - **IP address assignment**: The IP address assignment should be static. 
   - **Private IP address**: The same IP address that you assigned to the SQL Server FCI cluster network resource.
   See the following picture:

   ![CreateLoadBalancer](./media/virtual-machines-windows-portal-sql-create-failover-cluster/30-load-balancer-create.png)
   

### Configure the load balancer backend pool

1. Return to the Azure Resource Group with the virtual machines and locate the new load balancer. You may have to refresh the view on the Resource Group. Click the load balancer.

1. Click **Backend pools** and click **+ Add** to add a backend pool.

1. Associate the backend pool with the availability set that contains the VMs.

1. Under **Target network IP configurations**, check **VIRTUAL MACHINE** and choose the virtual machines that will participate as cluster nodes. Be sure to include all virtual machines that will host the FCI. 

1. Click **OK** to create the backend pool.

### Configure a load balancer health probe

1. On the load balancer blade, click **Health probes**.

1. Click **+ Add**.

1. On the **Add health probe** blade, <a name="probe"></a>Set the health probe parameters:

   - **Name**: A name for the health probe.
   - **Protocol**: TCP.
   - **Port**: Set to the port you created in the firewall for the health probe in [this step](#ports). In this article, the example uses TCP port `59999`.
   - **Interval**: 5 Seconds.
   - **Unhealthy threshold**: 2 consecutive failures.

1. Click OK.

### Set load-balancing rules

1. On the load balancer blade, click **Load-balancing rules**.

1. Click **+ Add**.

1. Set the load-balancing rules parameters:

   - **Name**: A name for the load-balancing rules.
   - **Frontend IP address**: Use the IP address for the SQL Server FCI cluster network resource.
   - **Port**: Set for the SQL Server FCI TCP port. The default instance port is 1433.
   - **Backend port**: This value uses the same port as the **Port** value when you enable **Floating IP (direct server return)**.
   - **Backend pool**: Use the backend pool name that you configured earlier.
   - **Health probe**: Use the health probe that you configured earlier.
   - **Session persistence**: None.
   - **Idle timeout (minutes)**: 4.
   - **Floating IP (direct server return)**: Enabled

1. Click **OK**.

## Step 7: Configure cluster for probe

Set the cluster probe port parameter in PowerShell.

To set the cluster probe port parameter, update variables in the following script with values from your environment. Remove the angle brackets `<>` from the script. 

   ```powershell
   $ClusterNetworkName = "<Cluster Network Name>"
   $IPResourceName = "<SQL Server FCI IP Address Resource Name>" 
   $ILBIP = "<n.n.n.n>" 
   [int]$ProbePort = <nnnnn>

   Import-Module FailoverClusters

   Get-ClusterResource $IPResourceName | Set-ClusterParameter -Multiple @{"Address"="$ILBIP";"ProbePort"=$ProbePort;"SubnetMask"="255.255.255.255";"Network"="$ClusterNetworkName";"EnableDhcp"=0}
   ```

In the preceding script, set the values for your environment. The following list describes the values:

   - `<Cluster Network Name>`: Windows Server Failover Cluster name for the network. In **Failover Cluster Manager** > **Networks**, right-click on the network and click **Properties**. The correct value is under **Name** on the **General** tab. 

   - `<SQL Server FCI IP Address Resource Name>`: SQL Server FCI IP address resource name. In **Failover Cluster Manager** > **Roles**, under the SQL Server FCI role, under **Server Name**, right-click the IP address resource, and click **Properties**. The correct value is under **Name** on the **General** tab. 

   - `<ILBIP>`: The ILB IP address. This address is configured in the Azure portal as the ILB front-end address. This is also the SQL Server FCI IP address. You can find it in **Failover Cluster Manager** on the same properties page where you located the `<SQL Server FCI IP Address Resource Name>`.  

   - `<nnnnn>`: Is the probe port you configured in the load balancer health probe. Any unused TCP port is valid. 

>[!IMPORTANT]
>The subnet mask for the cluster parameter must be the TCP IP broadcast address: `255.255.255.255`.

After you set the cluster probe, you can see all of the cluster parameters in PowerShell. Run the following script:

   ```powershell
   Get-ClusterResource $IPResourceName | Get-ClusterParameter 
  ```

## Step 8: Test FCI failover

Test failover of the FCI to validate cluster functionality. Do the following steps:

1. Connect to one of the SQL Server FCI cluster nodes with RDP.

1. Open **Failover Cluster Manager**. Click **Roles**. Notice which node owns the SQL Server FCI role.

1. Right-click the SQL Server FCI role.

1. Click **Move** and click **Best Possible Node**.

**Failover Cluster Manager** shows the role and its resources go offline. The resources then move and come online on the other node.

### Test connectivity

To test connectivity, log in to another virtual machine in the same virtual network. Open **SQL Server Management Studio** and connect to the SQL Server FCI name.

>[!NOTE]
>If necessary, you can [download SQL Server Management Studio](https://msdn.microsoft.com/library/mt238290.aspx).

## Limitations

Azure Virtual Machines support Microsoft Distributed Transaction Coordinator (MSDTC) on Windows Server 2019 with storage on clustered shared volumes (CSV) and a [standard load balancer](../../../load-balancer/load-balancer-standard-overview.md).

On Azure virtual machines, MSDTC is not supported on Windows Server 2016 and earlier because:

- The clustered MSDTC resource cannot be configured to use shared storage. With Windows Server 2016 if you create an MSDTC resource, it will not show any shared storage available for use, even if the storage is there. This issue has been fixed in Windows Server 2019.
- The basic load balancer does not handle RPC ports.

## See Also

- [Windows cluster technologies](/windows-server/failover-clustering/failover-clustering-overview)
- [SQL Server Failover Cluster Instances](/sql/sql-server/failover-clusters/windows/always-on-failover-cluster-instances-sql-server).
