---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 02/03/2020
 ms.author: rogarana
 ms.custom: include file
---

Azure shared disks (preview) is a new feature for Azure managed disks. Enabling shared disks allows you to attach a managed disk to multiple virtual machines (VMs) simultaneously. Attaching a managed disk to multiple VMs allows you to either deploy new or migrate existing clustered applications to Azure. The VMs in the cluster can read or write to your attached disk based on the reservation chosen by the clustered application using [SCSI Persistent Reservations](https://www.t10.org/members/w_spc3.htm) (SCSI PR). SCSI PR is a well-known industry standard leveraged by applications running on Storage Area Network (SAN) on-premises. Enabling SCSI PR on a managed disk allows you to migrate these applications to Azure as-is.

Managed disks that have shared disks enabled offer a SAN-like block-level storage protocol, data is stored and accessed in blocks. These blocks of data are stored in Logical Unit Numbers (LUNs). LUNs are then presented to an initiator (host) from a target (storage system). To an end device like a server, these LUNs appear to be direct-attached-storage (DAS) or a local drive. When you enable shared disks, you will need to format the drive with an operating system-specific file system. On Windows, you will need to use a clustered file system like Windows Server failover cluster (WSFC), that handles locking for writes from multiple hosts to prevent data corruption.

> [!NOTE]
> This is different from Azure Files, which offers a fully-managed file service where the data lives in directories consisting of files and folders. Because Azure Files is a full-fledged file system, data is completely independent of the devices that they are connected to.

## Limitations

While in preview, managed disks that have shared disks enabled are subject to the following limitations:

- Currently only available with premium SSDs.
- Only currently supported in the West Central US region.
- Can only be enabled on a data disk, not an OS disk.
- Only basic disks can be used with WSFC, for details see here.
- ReadOnly host caching is not available for premium SSDs with maxShares>1.
- AvailabilitySet and virtual machine scale  sets can only be used with `FaultDomainCount` set to 1.
- Azure Backup and Azure Site Recovery support is not yet available.

## Disk sizes

For now, only premium SSDs can enable shared disks. The disk sizes that support this feature are P15 and greater.

For each disk, you can define a `maxShares` value that represents the maximum number of nodes you expect will share the disk. For example, if you plan to set up a 2-node failover cluster, you can set `maxShares=2`. The maximum value is an upper bound. Nodes can join or leave the cluster (mount or unmount the disk) as long as the number of nodes is lower than the specified `maxShares` value.

> [!NOTE]
> The `maxShares` value can only be set or edited when the disk is detached from all nodes.

The following table illustrates the allowed maximum values for `maxShares` by disk size:

|Disk sizes  |maxShares limit  |
|---------|---------|
|P15, P20     |2         |
|P30, P40, P50     |5         |
|P60, P70, P80     |10         |


## Sample workloads

There could be a number of clustered servers, file systems, and database servers running in your on-premises production environment. The following are a few common workloads that run on your clustered systems:

### Windows

Most Windows-based clustering builds on WSFC, which handles all core infrastructure for cluster node communication. This allows your applications to take advantage of parallel access patterns. WSFC enables both CSV and non-CSV-based options depending on your version of Windows Server. For details, refer to [Create a failover cluster](https://docs.microsoft.com/windows-server/failover-clustering/create-failover-cluster).

Some popular applications running on WSFC include:

- SQL Server Failover Cluster Instances (FCI)
- Scale-out File Server (SoFS)
- File Server for General Use (IW workload)
- Remote Desktop Server User Profile Disk (RDS UPD)
- SAP ASCS/SCS
- Other 3rd-party applications.

### Linux

Linux can leverage cluster managers such as [Pacemaker](https://wiki.clusterlabs.org/wiki/Pacemaker). Pacemaker builds on [Corosync](http://corosync.github.io/corosync/), enabling cluster communications for applications deployed in highly available environments. Some common clustered filesystems include [ocfs2](https://oss.oracle.com/projects/ocfs2/) and [gfs2](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/global_file_system_2/ch-overview-gfs2). You can manipulate reservations and registrations using utilities such as [fence_scsi](http://manpages.ubuntu.com/manpages/eoan/man8/fence_scsi.8.html) and [sg_persist](https://linux.die.net/man/8/sg_persist).

## Persistent Reservation flow

The following diagram illustrates a sample 2-node clustered database application that leverages SCSI PR to enable failover from one node to the other.

![shared-disk-two-node-cluster-diagram.png](media/virtual-machines-disks-shared-disks/shared-disk-two-node-cluster-diagram.png)

The flow is as follows:

- The clustered application running on both Azure VM1 and VM2 registers the intent to read or write to the disk.
- The application instance on VM1 then takes exclusive reservation to write to the disk.
- This reservation is enforced on your Azure disk and the database can now exclusively write to the disk. Any writes from the application instance on VM2 will not succeed.
- If the application instance on VM1 goes down, the instance on VM2 can now initiate a database failover and take-over of the disk (simple or hostile).
- This reservation is now enforced on the Azure disk and the disk will no longer accept writes from the application on VM1. It will only accept writes from the application on VM2.
- The clustered application can complete the database failover and serve requests from VM2.

The following diagram illustrates another common clustered workload consisting of multiple nodes reading data from the disk for running parallel processes, such as training of ML models.

![shared-disk-machine-learning-trainer-model.png](media/virtual-machines-disks-shared-disks/shared-disk-machine-learning-trainer-model.png)

The flow is as follows:

- The clustered application running on all VMs registers the intent to read or write to the disk.
- The application instance on VM1 takes an exclusive reservation to write to the disk while opening up reads to the disk from other VMs.
- This reservation is enforced on your Azure disk.
- All nodes in the cluster can now read from the disk. Only one node writes back results to the disk, on behalf of all nodes in the cluster.

## Get started with Azure shared disks

### Deploy an Azure shared disk

To deploy a managed disk with the shared disk feature enabled, use the new property `maxShares` and define a value `>1`. This will make the disk shareable across multiple VMs.

> [!IMPORTANT]
> The value of `maxShares` can only be set or changed when a disk is unmounted from all VMs. Please see the [Disk sizes](#disk-sizes) for the allowed values for `maxShares`.

```json
{ 
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "dataDiskName": {
      "type": "string",
      "defaultValue": "mySharedDisk"
    },
    "dataDiskSizeGB": {
      "type": "int",
      "defaultValue": 1024
    },
    "maxShares": {
      "type": "int",
      "defaultValue": 2
    }
  },
  "resources": [
    {
      "type": "Microsoft.Compute/disks",
      "name": "[parameters('dataDiskName')]",
      "location": "[resourceGroup().location]",
      "apiVersion": "2019-07-01",
      "sku": {
        "name": "Premium_LRS"
      },
      "properties": {
        "creationData": {
          "createOption": "Empty"
        },
        "diskSizeGB": "[parameters('dataDiskSizeGB')]",
        "maxShares": "[parameters('maxShares')]"
      }
    }
  ] 
}
```

### Using Azure shared disks with your VMs

Once you have deployed a shared disk with `maxShares>1`, you can mount the disk to one or more of your VMs.

```azurepowershell-interactive
$vm = New-AzVm -ResourceGroupName "mySharedDiskRG" -Name "myVM" -Location "WestCentralUS" -VirtualNetworkName "myVnet" -SubnetName "mySubnet" -SecurityGroupName "myNetworkSecurityGroup" -PublicIpAddressName "myPublicIpAddress" 

$vm = Add-AzVMDataDisk -VM $vm -Name "mySharedDisk" -CreateOption Attach -ManagedDiskId $dataDisk.Id -Lun 0
```

## Supported SCSI PR commands

Once you've mounted the shared disk on your VMs in your cluster, you can now establish quorum and read/write to the disk using SCSI PR. The following PR commands are available when using Azure shared disks.

To initiate interaction with the disk, start with the persistent-reservation-action list:

```
PR_REGISTER_KEY 

PR_REGISTER_AND_IGNORE 

PR_GET_CONFIGURATION 

PR_RESERVE 

PR_PREEMPT_RESERVATION 

PR_CLEAR_RESERVATION 

PR_RELEASE_RESERVATION 
```

When using PR_RESERVE, PR_PREEMPT_RESERVATION, or  PR_RELEASE_RESERVATION, provide one of the following persistent-reservation-type:

```
PR_NONE 

PR_WRITE_EXCLUSIVE 

PR_EXCLUSIVE_ACCESS 

PR_WRITE_EXCLUSIVE_REGISTRANTS_ONLY 

PR_EXCLUSIVE_ACCESS_REGISTRANTS_ONLY 

PR_WRITE_EXCLUSIVE_ALL_REGISTRANTS 

PR_EXCLUSIVE_ACCESS_ALL_REGISTRANTS 
```

You will also need to provide a persistent-reservation-key when using PR_RESERVE, PR_REGISTER_AND_IGNORE, PR_REGISTER_KEY, PR_PREEMPT_RESERVATION, PR_CLEAR_RESERVATION, or PR_RELEASE-RESERVATION.

If any commands you expect to be in the list are missing, contact us at SharedDiskFeedback@microsoft .com