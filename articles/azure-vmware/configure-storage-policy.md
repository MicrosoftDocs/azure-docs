---
title: Configure a Storage Policy
description:  Learn how to configure a storage policy for your Azure VMware Solution virtual machines.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 01/08/2025
ms.custom:
  - engagement-fy23
  - build-2025

#customer intent: As an Azure service administrator, I want to set VMware vSAN storage policies to determine how storage is allocated to the VM.

# Customer intent: As a cloud administrator, I want to configure VMware vSAN storage policies for my virtual machines, so that I can ensure they meet required service levels and optimize storage allocation.
---

# Configure a VMware vSAN storage policy

VMware vSAN storage policies define storage requirements for your virtual machines (VMs). These policies guarantee that your VMs have the required level of service because they determine how storage is allocated to each VM. Every VM that you deploy to a vSAN datastore is assigned at least one VM storage policy.

You can assign a VM storage policy during a VM's initial deployment or during other VM operations, such as cloning or migrating. Post-deployment users with the **cloudadmin** or equivalent roles can't change the default storage policy for a VM. However, VM storage policy per disk changes is permitted.

Authorized users can use the `Run` command to change the default or existing VM storage policy to an available policy for a VM after deployment. There are no changes made on the disk-level VM storage policy. You can always change the disk-level VM storage policy according to your requirements.

Run commands are executed one at a time in the order submitted.

In this article, learn how to:

> [!div class="checklist"]
> * List all storage policies.
> * Set the storage policy for a VM.
> * Specify the default storage policy for a cluster.
> * Create a storage policy.
> * Remove a storage policy.

## Prerequisites for vSAN OSA-based clusters

Make sure that the minimum level of hosts is met, according to the following table:

|  RAID configuration | Failures to tolerate (FTT) | Minimum hosts required |
| --- | :---: | :---: |
| RAID-1 (mirroring) <br />Default setting  | 1  | 3  |
| RAID-5 (erasure coding)  | 1  | 4  |
| RAID-1 (mirroring)  | 2  | 5  |
| RAID-6 (erasure coding)  | 2  | 6  |
| RAID-1 (mirroring)  | 3  | 7  |

## Prerequisites for vSAN ESA-based clusters

Make sure that the minimum level of hosts is met, according to the following table:

|  RAID configuration | Failures to tolerate (FTT) | Minimum hosts required |
| --- | :---: | :---: |
| RAID-1 (mirroring) <br />Default setting  | 1  | 3  |
| RAID-5 (ESA optimized)  | 1  | 3  |
| RAID-1 (mirroring)  | 2  | 5  |
| RAID-6 (ESA optimized)  | 2  | 5  |
| RAID-1 (mirroring)  | 3  | 7  |

## List storage policies

Run the `Get-StoragePolicy` cmdlet to list the vSAN-based storage policies that are available to set on a VM.

1. Sign in to the [Azure portal](https://portal.azure.com) or, if applicable, sign in to the [Azure US Government portal](https://portal.azure.us/).

1. Select **Run command** > **Packages** > **Get-StoragePolicies**.

   :::image type="content" source="media/run-command/run-command-overview-storage-policy.png" alt-text="Screenshot that shows how to access the available storage policy run commands." lightbox="media/run-command/run-command-overview-storage-policy.png":::

1. Provide the required values or change the default values according to the following table. Then select **Run**.

   | Field | Value |
   | --- | --- |
   | **Retain up to**  | Retention period of the cmdlet output. The default value is `60`.  |
   | **Specify name for execution**  | Alphanumeric name. For example, *Get-StoragePolicies-Exec1*. |
   | **Timeout**  |  The period after which a cmdlet exits if it's taking too long to finish.  |

   :::image type="content" source="media/run-command/run-command-get-storage-policy.png" alt-text="Screenshot that shows how to list available storage policies. ":::
   
1. Check **Notifications** to see the progress.

## Set a storage policy on a VM

Run the `Set-VMStoragePolicy` cmdlet to modify vSAN-based storage policies on a default cluster, individual VM, or group of VMs sharing a similar VM name. For example, if you have three VMs named *MyVM1*, *MyVM2*, and *MyVM3*, supplying *MyVM* to the **VMName** parameter would change the `StoragePolicy` on all three VMs.

> [!NOTE]
> SDDC's running vCenter version 8 no longer need to utilize this run command to change a VM's storage policy.  It can be done so natively in vCenter UI/API.

1. Select **Run command** > **Packages** > **Set-VMStoragePolicy**.

1. Provide the required values or change the default values according to the following table. Then select **Run**.

   | Field | Value |
   | --- | --- |
   | **VMName** | Name of the target VM. |
   | **StoragePolicyName** | Name of the storage policy that you want to set. For example, *RAID1 FTT-1*. |
   | **Retain up to**  | Retention period of the cmdlet output. The default value is `60`.  |
   | **Specify name for execution**  | Alphanumeric name. For example, *changeVMStoragePolicy*.  |
   | **Timeout**  |  The period after which a cmdlet exits if it's taking too long to finish.  |

1. Check **Notifications** to see the progress.

## Set a storage policy on all VMs in a location

Run the `Set-LocationStoragePolicy` cmdlet to modify vSAN-based storage policies on all VMs in a location in which a location is the name of a cluster, resource pool, or folder. For example, if you have three VMs in *Cluster-3*, supplying *Cluster-3* would change the storage policy on all three VMs.

> [!NOTE]
> You can't use the vSphere client to change the default storage policy or any existing storage policies for a VM.

1. Select **Run command** > **Packages** > **Set-LocationStoragePolicy**.

1. Provide the required values or change the default values according to the following table. Then select **Run**.

   | Field | Value |
   | --- | --- |
   | **Location** | Name of the target VM. |
   | **StoragePolicyName** | Name of the storage policy to set. For example, *RAID1 FTT-1*. |
   | **Retain up to**  | Retention period of the cmdlet output. The default value is `60`.  |
   | **Specify name for execution**  | Alphanumeric name. For example, *changeVMStoragePolicy*.  |
   | **Timeout**  |  The period after which a cmdlet exits if it's taking too long to finish.  |

1. Check **Notifications** to see the progress.

## Specify a storage policy for a cluster

Run the `Set-ClusterDefaultStoragePolicy` cmdlet to specify a default storage policy for a cluster.

1. Select **Run command** > **Packages** > **Set-ClusterDefaultStoragePolicy**.

1. Provide the required values or change the default values according to the following table. Then select **Run**.

   | Field | Value |
   | --- | --- |
   | **ClusterName** | Name of the cluster. |
   | **StoragePolicyName** | Name of the storage policy to set. For example, *RAID1 FTT-1*. |
   | **Retain up to**  | Retention period of the cmdlet output. The default value is `60`.  |
   | **Specify name for execution**  | Alphanumeric name. For example, *Set-ClusterDefaultStoragePolicy-Exec1*.  |
   | **Timeout**  |  The period after which a cmdlet exits if it's taking too long to finish.  |

1. Check **Notifications** to see the progress.

> [!NOTE]
> Changing the default cluster policy affects only new VMs. Existing VMs retain the policy they're currently configured or deployed with.

## Create a custom Azure VMware Solution storage policy

Run the `New-AVSStoragePolicy` cmdlet to create or overwrite an existing policy. This function creates a new, or overwrites an existing, vSphere storage policy. Non-vSAN-based, vSAN-only-based, VMEncryption-only-based, tag-only-based, or any combination of these policy types is supported.

Keep the following information in mind:

* You can't modify existing Azure VMware Solution default storage policies.
* Certain options enabled in storage policies produce a warning that a policy is out of compliance.
* When you modify existing storage policies, existing associated vSAN objects like VMs, VMDK files, and ISO files appear to be "out of compliance." This means that existing objects are running against premodified policy settings. To update to match the modified policy settings, reapply the storage policy to objects.

1. Select **Run command** > **Packages** > **New-AVSStoragePolicy**.

1. Provide the required values or change the default values according to the following table. Then select **Run**.

   | Field | Value |
   | --- | --- |
   | **Overwrite** | Overwrite existing storage policy. <br>- The default value is  `$false`. <br>- Passing overwrite `true` provided overwrites an existing policy exactly as defined. <br>- Those values not passed are removed or set to default values. |
   | **NotTags** | Match to datastores that do *not* have these tags. <br>- Tags are case sensitive. <br>- Comma separate multiple tags. <br>- Example: `Tag1,Tag 2,Tag_3`. |
   | **Tags** | Match to datastores that do have these tags.  <br>- Tags are case sensitive. <br>- Comma separate multiple tags. <br>- Example: `Tag1,Tag 2,Tag_3`. |
   | **vSANForceProvisioning** | Force provisioning for the policy. <br>- The default value is `$false`.<br>- Valid values are `$true` or `$false`. <br>- Warning: vSAN force-provisioned objects aren't covered under the Microsoft service-level agreement (SLA). Data loss and vSAN instability can occur. <br>- Recommended value is `$false`. |
   | **vSANChecksumDisabled** | Enable or disable checksum for the policy. <br>- The default value is `$false`. <br>- Valid values are `$true` or `$false`. <br>- Warning: Disabling checksum can lead to data loss and/or corruption. <br>- Recommended value is `$false`. |
   | **vSANCacheReservation** | Percentage of cache reservation for the policy. <br>- The default value is `0`. <br>- Valid values are `0` to `100`.|
   | **vSANIOLimit** | Sets limit on allowed input/output (I/O). <br>- The default value is unset. <br>- Valid values are `0` to `2147483647`. <br>- Input/output operations per second (IOPS) limit for the policy. |
   | **vSANDiskStripesPerObject** | The number of hard disk drives (HDDs) across which each replica of a storage object is striped. <br>- The default value is `1`. Valid values are `1` to `12`. <br>- A value higher than `1` might result in better performance (for example, when flash read cache misses need to get serviced from HDD), but also results in a higher use of system resources. |
   | **vSANObjectSpaceReservation** | Object reservation. <br>- The default value is `0`.  <br>- Valid values are `0` to `100`. <br>- `0` = Thin provision. <br>- `100` = Thick provision.|
   | **VMEncryption** | Sets VM encryption. <br>- The default value is `None`.  <br>- Valid values are `None`, `Pre-IO`, and `Post-IO`. <br>- `Pre-IO` allows virtual I/O (VAIO) filtering solutions to capture data before VM encryption. <br>- `Post-IO` allows VAIO-filtering solutions to capture data after VM encryption. |
   | **vSANFailuresToTolerate** | Number of vSAN hosts' failures to tolerate. <br>- The default value is `R1FTT1`. <br>- Valid values are `None`, `R1FTT1`, `R1FTT2`, `R1FTT3`, `R5FTT1`, `R6FTT2`, and `R1FTT3`. <br>- `None` = No data redundancy.<br>- `R1FTT1` = 1 failure - RAID-1 (mirroring).<br>- `R1FTT2` = 2 failures - RAID-1 (mirroring).<br>- `R1FTT3` = 3 failures - RAID-1 (mirroring).<br>- `R5FTT1` = 1 failure - RAID-5 (erasure coding).<br>- `R6FTT2` = 2 failures - RAID-6 (erasure coding). <br>- The `None` (no data redundancy) option isn't covered under the Microsoft SLA.|
   | **vSANSiteDisasterTolerance** | Valid only for stretch clusters. <br>-  The default value is `None`. <br>- Valid values are `None`, `Dual`, `Preferred`, `Secondary`, and `NoneStretch`.  <br>- `None` = No site redundancy. This option is recommended for nonstretch clusters and not recommended for stretch clusters.  <br>- `Dual` = Dual site redundancy. This option is recommended for stretch clusters.  <br>- `Preferred` = No site redundancy. Keep data on preferred (stretched cluster).  <br>- `Secondary` = No site redundancy. Keep data on secondary site (stretched cluster).  <br>- `NoneStretch` = No site redundancy. Not recommended. For more information, see [For vSAN stretched clusters, don't use a storage policy with locality=none](https://kb.vmware.com/s/article/88358).|
   | **Description** | Description of the storage policy that you're creating, in free-form text. |
   | **Name** | Name of the storage policy to set. For example, *RAID1 FTT-1*. |
   | **Retain up to**  | Retention period of the cmdlet output. The default value is `60`.  |
   | **Specify name for execution**  | Alphanumeric name. For example, *New-AVSStoragePolicy-Exec1*.  |
   | **Timeout**  |  The period after which a cmdlet exits if it's taking too long to finish.  |

1. Check **Notifications** to see the progress.

## Remove an Azure VMware Solution storage policy

Run the `Remove-AVSStoragePolicy` cmdlet to specify the default storage policy for a cluster.

1. Select **Run command** > **Packages** > **Remove-AVSStoragePolicy**.

1. Provide the required values or change the default values according to the following table. Then select **Run**.

   | Field | Value |
   | --- | --- |
   | **Name** | Name of the storage policy. Wildcards aren't supported and are stripped. |
   | **Retain up to**  | Retention period of the cmdlet output. The default value is `60`.  |
   | **Specify name for execution**  | Alphanumeric name. For example, *Remove-AVSStoragePolicy-Exec1*.  |
   | **Timeout**  |  The period after which a cmdlet exits if it's taking too long to finish.  |

1. Check **Notifications** to see the progress.

## Related content

* [Learn about external storage options](ecosystem-external-storage-solutions.md)
* [Configure external identity for vCenter Server](configure-identity-source-vcenter.md)
