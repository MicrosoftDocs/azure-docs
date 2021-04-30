---
title: Configure quorum 
description: "Learn how to configure a disk witness, cloud witness, and file share witness as quorum for a Windows Server Failover Cluster on SQL Server on Azure VMs. " 
services: virtual-machines
documentationCenter: na
author: cawrites
editor: 
tags: azure-service-management
ms.service: virtual-machines-sql
ms.subservice: hadr
ms.topic: conceptual
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: "03/15/2021"
ms.author: chadam

---

# Configure quorum for SQL Server on Azure VMs
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This article teaches you to configure one of the three quorum options for a Windows Server Failover Cluster running on SQL Server on Azure Virtual Machines (VMs) - a disk witness, a cloud witness, and a file share witness.


## Overview

The quorum for a cluster is determined by the number of voting elements that must be part of active cluster membership for the cluster to start properly or continue running. Configuring a quorum resource allows a two-node cluster to continue with only one node online. The Windows Server Failover Cluster is the underlying technology for the SQL Server on Azure VMs high availability options: [failover cluster instances (FCIs)](failover-cluster-instance-overview.md) and [availability groups (AGs)](availability-group-overview.md). 

The following quorum options are available to use with an SQL Server on Azure VMs, with the disk witness being the preferred choice:

||[Disk witness](/windows-server/failover-clustering/manage-cluster-quorum#configure-the-cluster-quorum)|[Cloud witness](/windows-server/failover-clustering/deploy-cloud-witness)  |[File share witness](/windows-server/failover-clustering/manage-cluster-quorum#configure-the-cluster-quorum)  |
|---------|---------|---------|---------|
|**Supported OS**| All<sup>1</sup>   |Windows Server 2016+| All|

<sup>1</sup> A disk witness is not supported if you're using the Storage Spaces Direct shared-storage solution for your failover cluster instance. Configure a cloud witness instead. 

To learn more about quorum, see the [Windows Server Failover Cluster overview](hadr-windows-server-failover-cluster-overview.md). 


## Disk Witness

A disk witness is a small clustered disk in the Cluster Available Storage group. This disk is highly available and can fail over between nodes. 

The disk witness is the recommended quorum option when used with SQL Server on Azure VMs. 

The following table provides additional information and considerations about the quorum disk witness: 

| Witness type  | Description  | Requirements and recommendations  |
| ---------    |---------        |---------                        |
| Disk witness     |  <ul><li> Dedicated LUN that stores a copy of the cluster database</li><li> Most useful for clusters with shared (not replicated) storage</li>       |  <ul><li>Size of LUN must be at least 512 MB</li><li> Must be dedicated to cluster use and not assigned to a clustered role</li><li> Must be included in clustered storage and pass storage validation tests</li><li> Can't be a disk that is a Cluster Shared Volume (CSV)</li><li> Basic disk with a single volume</li><li> Doesn't need to have a drive letter</li><li> Can be formatted with NTFS or ReFS</li><li> Can be optionally configured with hardware RAID for fault tolerance</li><li> Should be excluded from backups and antivirus scanning</li><li> A Disk witness isn't supported with Storage Spaces Direct</li>|

To use an Azure Shared drive for the disk witness, you must first create the file share in your storage account and mount it on each node of the cluster. To mount the storage, follow these steps: 

1. Sign in to the [Azure portal](https://portal.azure.com). and go to your storage account.
1. Go to **File Shares** under **File service**, and then select the standard file share you want to use for your disk witness. 
1. Select **Connect** to bring up the connection string for your file share.
1. In the drop-down list, select the drive letter you want to use, and then copy both code blocks to Notepad.

   :::image type="content" source="media/failover-cluster-instance-premium-file-share-manually-configure/premium-file-storage-commands.png" alt-text="Copy both PowerShell commands from the file share connect portal":::

1. Use Remote Desktop Protocol (RDP) to connect to the SQL Server VM with the account that your SQL Server service will use for the service account.
1. Open an administrative PowerShell command console.
1. Run the commands that you saved earlier when you were working in the portal.
1. Go to the share by using either File Explorer or the **Run** dialog box (select Windows + R). Use the network path `\\storageaccountname.file.core.windows.net\filesharename`. For example, `\\sqlvmstorageaccount.file.core.windows.net\sqlpremiumfileshare`
1. Create at least one folder on the newly connected file share to place your cluster quorum on. 
1. Repeat these steps on each SQL Server VM that will participate in the cluster.

After your file share is mounted, configure quorum following these steps:

# [PowerShell](#tab/powershell)

The existing Set-ClusterQuorum PowerShell command has new parameters corresponding to Cloud Witness.

You can configure disk witness with the cmdlet [`Set-ClusterQuorum`](https://docs.microsoft.com/powershell/module/failoverclusters/set-clusterquorum) using the PowerShell command:

```PowerShell
Set-ClusterQuorum -NodeAndDiskMajority "\\storageaccountname.file.core.windows.net\filesharename"
```


# [Failover Cluster Manager](#tab/fcm-gui)

Use the Quorum Configuration Wizard built into Failover Cluster Manager to configure your disk witness. To do so, follow these steps: 

1. Open Failover Cluster Manager.

2. Right-click the cluster -> **More Actions** -> **Configure Cluster Quorum Settings**. This launches the Configure Cluster Quorum wizard.

    ![Snapshot of the menu path to Configure Cluster Quorum Settings in the Failover Cluster Manager UI](./media/hadr-create-quorum-windows-failover-cluster-how-to/cloudwitness_7.png)
    
3. On the **Select Quorum Configurations** page, select **Select the quorum witness**.

    ![Snapshot of the 'select the quorum witness' radio button in the Cluster Quorum wizard](./media/hadr-create-quorum-windows-failover-cluster-how-to/cloudwitness_8.png)
   
4. On the **Select Quorum Witness** page, select **Configure a disk witness**.

    ![Snapshot of the appropriate radio button to select a disk witness](./media/hadr-create-quorum-windows-failover-cluster-how-to/cloudwitness_9.png)
    

5. On the **Configure Disk Witness** page, enter the UNC path for your Azure file share. 
6. Upon successful configuration of the disk witness, you can view the newly created witness resource in the Failover Cluster Manager snap-in.


---



## Cloud Witness

A cloud witness is a type of failover cluster quorum witness that uses Microsoft Azure storage to provide a vote on cluster quorum. 


The following table provides additional information and considerations about the cloud witness: 

| Witness type  | Description  | Requirements and recommendations  |
| ---------    |---------        |---------                        |
| Cloud witness     |  <ul><li> Uses Azure storage as the cloud witness, contains just the time stamp. </li><li> Ideal for deployments in multiple sites, multiple zones, and multiple regions.</li> <li> Creates well-known container `msft-cloud-witness` under the Microsoft Storage Account. </li> <li> Writes a single blob file with corresponding cluster's unique ID used as the file name of the blob file under the container </li>      |  <ul><li>Default size is 1MB.</li><li> Use **General Purpose** for the account kind. Blob storage is not supported. </li><li> Use Standard storage. Azure Premium Storage is not supported. </li><li> Failover Clustering uses the blob file as the arbitration point, which requires some consistency guarantees when reading the data. Therefore you must select **Locally redundant storage** for **Replication** type.</li><li> Should be excluded from backups and antivirus scanning</li><li> A Disk witness isn't supported with Storage Spaces Direct</li> <li> Cloud Witness uses HTTPS (default port 443) to establish communication with Azure blob service. Ensure that HTTPS port is accessible via network Proxy. </li>|

When configuring a Cloud Witness quorum resource for your Failover Cluster, consider::
- Instead of storing the Access Key, your Failover Cluster will generate and securely store a Shared Access Security (SAS) token.
- The generated SAS token is valid as long as the Access Key remains valid. When rotating the Primary Access Key, it is important to first update the Cloud Witness (on all your clusters that are using that Storage Account) with the Secondary Access Key before regenerating the Primary Access Key.
- Cloud Witness uses HTTPS REST interface of the Azure Storage Account service. This means it requires the HTTPS port to be open on all cluster nodes.


A cloud witness requires an Azure Storage Account. To configure a storage account, follow these steps: 

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the Hub menu, select New -> Data + Storage -> Storage account.
3. In the Create a storage account page, do the following:
    1. Enter a name for your storage account. Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only. The storage account name must also be unique within Azure.
    2. For **Account kind**, select **General purpose**.
    3. For **Performance**, select **Standard**.
    2. For **Replication**, select **Local-redundant storage (LRS)**.


Once your storage account is created, follow these steps to configure your cloud witness quorum resource for your failover cluster: 


# [PowerShell](#tab/powershell)

The existing Set-ClusterQuorum PowerShell command has new parameters corresponding to Cloud Witness.

You can configure cloud witness with the cmdlet [`Set-ClusterQuorum`](https://docs.microsoft.com/powershell/module/failoverclusters/set-clusterquorum) using the PowerShell command:

```PowerShell
Set-ClusterQuorum -CloudWitness -AccountName <StorageAccountName> -AccessKey <StorageAccountAccessKey>
```

In the rare instance you need to use a different endpoint, use this PowerShell command: 

```PowerShell
Set-ClusterQuorum -CloudWitness -AccountName <StorageAccountName> -AccessKey <StorageAccountAccessKey> -Endpoint <servername>
```

See the [cloud witness documentation](/windows-server/failover-clustering/deploy-cloud-witness) for help for finding the Storage Account AccessKey. 


# [Failover Cluster Manager](#tab/fcm-gui)

Use the Quorum Configuration Wizard built into Failover Cluster Manager to configure your cloud witness. To do so, follow these steps: 

1. Open Failover Cluster Manager.

2. Right-click the cluster -> **More Actions** -> **Configure Cluster Quorum Settings**. This launches the Configure Cluster Quorum wizard.

    ![Snapshot of the menu path to Configure Cluster Quorum Settings in the Failover Cluster Manager UI](./media/hadr-create-quorum-windows-failover-cluster-how-to/cloudwitness_7.png)
    
3. On the **Select Quorum Configurations** page, select **Select the quorum witness**.

    ![Snapshot of the 'select the quorum witness' radio button in the Cluster Quorum wizard](./media/hadr-create-quorum-windows-failover-cluster-how-to/cloudwitness_8.png)
   
4. On the **Select Quorum Witness** page, select **Configure a cloud witness**.

    ![Snapshot of the appropriate radio button to select a cloud witness](./media/hadr-create-quorum-windows-failover-cluster-how-to/cloudwitness_9.png)
    
5. On the **Configure Cloud Witness** page, enter the Azure Storage Account information. For help with finding this information, see the [cloud witness documentation](/windows-server/failover-clustering/deploy-cloud-witness). 
   1. (Required parameter) Azure Storage Account Name.
   2. (Required parameter) Access Key corresponding to the Storage Account.
       1. When creating for the first time, use Primary Access Key 
       2. When rotating the Primary Access Key, use Secondary Access Key
   3. (Optional parameter) If you intend to use a different Azure service endpoint (for example the Microsoft Azure service in China), then update the endpoint server name.

      ![Snapshot of the Cloud Witness configuration pane in the Cluster Quorum wizard](./media/hadr-create-quorum-windows-failover-cluster-how-to/cloudwitness_10.png)
      

6. Upon successful configuration of the cloud witness, you can view the newly created witness resource in the Failover Cluster Manager snap-in.

    ![Successful configuration of Cloud Witness](./media/hadr-create-quorum-windows-failover-cluster-how-to/cloudwitness_11.png)
    


---


## File share witness

A file share witness is an SMB file share that's typically configured on a file server running Windows Server. It maintains clustering information in a witness.log file, but doesn't store a copy of the cluster database. In Azure, you can configure a file share on a separate virtual machine. 

Configure a file share witness if a disk witness or a cloud witness are unavailable or unsupported in your environment. 

The following table provides additional information and considerations about the quorum file share witness: 

| Witness type  | Description  | Requirements and recommendations  |
| ---------    |---------        |---------                        |
| File share witness     | <ul><li>SMB file share that is configured on a file server running Windows Server</li><li> Does not store a copy of the cluster database</li><li> Maintains cluster information only in a witness.log file</li><li> Most useful for multisite clusters with replicated storage </li>       |  <ul><li>Must have a minimum of 5 MB of free space</li><li> Must be dedicated to the single cluster and not used to store user or application data</li><li> Must have write permissions enabled for the computer object for the cluster name</li></ul><br>The following are additional considerations for a file server that hosts the file share witness:<ul><li>A single file server can be configured with file share witnesses for multiple clusters.</li><li> The file server must be on a site that is separate from the cluster workload. This allows equal opportunity for any cluster site to survive if site-to-site network communication is lost. If the file server is on the same site, that site becomes the primary site, and it is the only site that can reach the file share.</li><li> The file server can run on a virtual machine if the virtual machine is not hosted on the same cluster that uses the file share witness.</li><li> For high availability, the file server can be configured on a separate failover cluster. </li>      |

Once you have created your file share and properly configured permissions, use PowerShell to add the file share as the quorum witnes resource: 

```powershell
Set-ClusterQuorum -FileShareWitness <UNC path to file share> -Credential $(Get-Credential)
```

You will be prompted for an account and password for a local (to the file share) non-admin account that has full admin rights to the share.  The cluster will keep the name and password encrypted and not accessible by anyone.



## Next Steps

After you've determined the appropriate best practices for your solution, get started by [preparing your SQL Server VM for FCI](failover-cluster-instance-prepare-vm.md) or by creating your availability group by using the [Azure portal](availability-group-azure-portal-configure.md), the [Azure CLI / PowerShell](./availability-group-az-commandline-configure.md), or [Azure quickstart templates](availability-group-quickstart-template-configure.md).
