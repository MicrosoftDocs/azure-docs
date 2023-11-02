---
title: Configure storage policy
description:  Learn how to configure storage policy for your Azure VMware Solution virtual machines.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 2/5/2023

#Customer intent: As an Azure service administrator, I want set the VMware vSAN storage policies to determine how storage is allocated to the VM.

---

# Configure storage policy

VMware vSAN storage policies define storage requirements for your virtual machines (VMs). These policies guarantee the required level of service for your VMs because they determine how storage is allocated to the VM. Each VM deployed to a vSAN datastore is assigned at least one VM storage policy.

You can assign a VM storage policy in an initial deployment of a VM or when you do other VM operations, such as cloning or migrating. Post-deployment cloudadmin users or equivalent roles can't change the default storage policy for a VM. However, **VM storage policy** per disk changes is permitted.

The Run command lets authorized users change the default or existing VM storage policy to an available policy for a VM post-deployment. There are no changes made on the disk-level VM storage policy. You can always change the disk level VM storage policy as per your requirements.


> [!NOTE]
> Run commands are executed one at a time in the order submitted.


In this how-to, you learn how to:

> [!div class="checklist"]
> * List all storage policies
> * Set the storage policy for a VM
> * Specify default storage policy for a cluster
> * Create storage policy
> * Remove storage policy


## Prerequisites

Make sure that the [minimum level of hosts are met](https://docs.vmware.com/en/VMware-Cloud-on-AWS/services/com.vmware.vsphere.vmc-aws-manage-data-center-vms.doc/GUID-EDBB551B-51B0-421B-9C44-6ECB66ED660B.html).

|  **RAID configuration** | **Failures to tolerate (FTT)** | **Minimum hosts required** |
| --- | :---: | :---: |
| RAID-1 (Mirroring) <br />Default setting.  | 1  | 3  |
| RAID-5 (Erasure Coding)  | 1  | 4  |
| RAID-1 (Mirroring)  | 2  | 5  |
| RAID-6 (Erasure Coding)  | 2  | 6  |
| RAID-1 (Mirroring)  | 3  | 7  |




## List storage policies

You'll run the `Get-StoragePolicy` cmdlet to list the vSAN based storage policies available to set on a VM.

1. Sign in to the [Azure portal](https://portal.azure.com).

   >[!NOTE]
   >If you need access to the Azure US Gov portal, go to https://portal.azure.us/


1. Select **Run command** > **Packages** > **Get-StoragePolicies**.

   :::image type="content" source="media/run-command/run-command-overview-storage-policy.png" alt-text="Screenshot showing how to access the storage policy run commands available." lightbox="media/run-command/run-command-overview-storage-policy.png":::

1. Provide the required values or change the default values, and then select **Run**.

   :::image type="content" source="media/run-command/run-command-get-storage-policy.png" alt-text="Screenshot showing how to list storage policies available. ":::

   | **Field** | **Value** |
   | --- | --- |
   | **Retain up to**  | Retention period of the cmdlet output. The default value is 60.  |
   | **Specify name for execution**  | Alphanumeric name, for example, **Get-StoragePolicies-Exec1**. |
   | **Timeout**  |  The period after which a cmdlet exits if taking too long to finish.  |

1. Check **Notifications** to see the progress.




## Set storage policy on VM

You'll run the `Set-VMStoragePolicy` cmdlet to modify vSAN-based storage policies on a default cluster, individual VM, or group of VMs sharing a similar VM name. For example, if you have three VMs named "MyVM1", "MyVM2", and "MyVM3", supplying "MyVM*" to the VMName parameter would change the StoragePolicy on all three VMs.


> [!NOTE]
> You cannot use the vSphere Client to change the default storage policy or any existing storage policies for a VM.

1. Select **Run command** > **Packages** > **Set-VMStoragePolicy**.

1. Provide the required values or change the default values, and then select **Run**.

   | **Field** | **Value** |
   | --- | --- |
   | **VMName** | Name of the target VM. |
   | **StoragePolicyName** | Name of the storage policy to set. For example, **RAID-FTT-1**. |
   | **Retain up to**  | Retention period of the cmdlet output. The default value is 60.  |
   | **Specify name for execution**  | Alphanumeric name, for example, **changeVMStoragePolicy**.  |
   | **Timeout**  |  The period after which a cmdlet exits if taking too long to finish.  |

1. Check **Notifications** to see the progress.

## Set storage policy on all VMs in a location

You'll run the `Set-LocationStoragePolicy` cmdlet to Modify vSAN based storage policies on all VMs in a location where a location is the name of a cluster, resource pool, or folder. For example, if you have 3 VMs in Cluster-3, supplying "Cluster-3" would change the storage policy on all 3 VMs.

> [!NOTE]
> You cannot use the vSphere Client to change the default storage policy or any existing storage policies for a VM.

1. Select **Run command** > **Packages** > **Set-LocationStoragePolicy**.

1. Provide the required values or change the default values, and then select **Run**.

   | **Field** | **Value** |
   | --- | --- |
   | **Location** | Name of the target VM. |
   | **StoragePolicyName** | Name of the storage policy to set. For example, **RAID-FTT-1**. |
   | **Retain up to**  | Retention period of the cmdlet output. The default value is 60.  |
   | **Specify name for execution**  | Alphanumeric name, for example, **changeVMStoragePolicy**.  |
   | **Timeout**  |  The period after which a cmdlet exits if taking too long to finish.  |

1. Check **Notifications** to see the progress.



## Specify storage policy for a cluster

You'll run the `Set-ClusterDefaultStoragePolicy` cmdlet to specify default storage policy for a cluster,


1. Select **Run command** > **Packages** > **Set-ClusterDefaultStoragePolicy**.

1. Provide the required values or change the default values, and then select **Run**.

   | **Field** | **Value** |
   | --- | --- |
   | **ClusterName** | Name of the cluster. |
   | **StoragePolicyName** | Name of the storage policy to set. For example, **RAID-FTT-1**. |
   | **Retain up to**  | Retention period of the cmdlet output. The default value is 60.  |
   | **Specify name for execution**  | Alphanumeric name, for example, **Set-ClusterDefaultStoragePolicy-Exec1**.  |
   | **Timeout**  |  The period after which a cmdlet exits if taking too long to finish.  |

1. Check **Notifications** to see the progress.

## Create custom AVS storage policy
You'll run the `New-AVSStoragePolicy` cmdlet to create or overwrite an existing policy.
This function creates a new or overwrites an existing vSphere Storage Policy. Non vSAN-Based, vSAN Only, VMEncryption Only, Tag Only based and/or any combination of these policy types are supported.
> [!NOTE]
> You cannot modify existing AVS default storage policies.
> Certain options enabled in storage policies will produce warnings to associated risks.

1. Select **Run command** > **Packages** > **New-AVSStoragePolicy**.

1. Provide the required values or change the default values, and then select **Run**.

   | **Field** | **Value** |
   | --- | --- |
   | **Overwrite** | Overwrite existing Storage Policy. <br>- Default is $false. <br>- Passing overwrite true provided will overwrite an existing policy exactly as defined. <br>- Those values not passed will be removed or set to default values. |
   | **NotTags** | Match to datastores that do NOT have these tags. <br>- Tags are case sensitive. <br>- Comma separate multiple tags. <br>- Example: Tag1,Tag 2,Tag_3 |
   | **Tags** | Match to datastores that do have these tags.  <br>- Tags are case sensitive. <br>- Comma separate multiple tags. <br>- Example: Tag1,Tag 2,Tag_3 |
   | **vSANForceProvisioning** | Force provisioning for the policy. <br>- Default is $false.<br>- Valid values are $true or $false <br>- **WARNING** - vSAN Force Provisioned Objects are not covered under Microsoft SLA.  Data LOSS and vSAN instability may occur. <br>- Recommended value is $false. |
   | **vSANChecksumDisabled** | Enable or disable checksum for the policy. <br>- Default is $false. <br>- Valid values are $true or $false. <br>- **WARNING** - Disabling checksum may lead to data LOSS and/or corruption. <br>- Recommended value is $false. |
   | **vSANCacheReservation** | Percentage of cache reservation for the policy. <br>- Default is 0. <br>- Valid values are 0..100.|
   | **vSANIOLimit** | Sets limit on allowed IO. <br>- Default is unset. <br>- Valid values are 0..2147483647. <br>- IOPS limit for the policy. |
   | **vSANDiskStripesPerObject** | The number of HDDs across which each replica of a storage object is striped. <br>- Default is 1.  Valid values are 1..12. <br>- A value higher than 1 may result in better performance (for e.g. when flash read cache misses need to get serviced from HDD), but also results in higher use of system resources. |
   | **vSANObjectSpaceReservation** | Object Reservation. <br>- Default is 0.  <br>- Valid values are 0..100. <br>- 0=Thin Provision <br>- 100=Thick Provision|
   | **VMEncryption** | Sets VM Encryption. <br>- Default is None.  <br>- Valid values are None, PreIO, PostIO. <br>- PreIO allows VAIO filtering solutions to capture data prior to VM encryption. <br>- PostIO allows VAIO filtering solutions to capture data after VM encryption. |
   | **vSANFailuresToTolerate** | Number of vSAN Hosts failures to Tolerate. <br>- Default is "R1FTT1". <br>- Valid values are "None", "R1FTT1", "R1FTT2", "R1FTT3", "R5FTT1", "R6FTT2", "R1FTT3" <br>- None = No Data Redundancy<br>- R1FTT1 = 1 failure - RAID-1 (Mirroring)<br>- R1FTT2 = 2 failures - RAID-1 (Mirroring)<br>- R1FTT3 = 3 failures - RAID-1 (Mirroring)<br>- R5FTT1 = 1 failure - RAID-5 (Erasure Coding),<br>- R6FTT2 = 2 failures - RAID-6 (Erasure Coding) <br>- No Data Redundancy options are not covered under Microsoft SLA.|
   | **vSANSiteDisasterTolerance** | Only valid for stretch clusters. <br>-  Default is "None". <br>- Valid Values are "None", "Dual", "Preferred", "Secondary", "NoneStretch"  <br>- None = No Site Redundancy (Recommended Option for Non-Stretch Clusters, NOT recommended for Stretch Clusters)  <br>- Dual = Dual Site Redundancy (Recommended Option for Stretch Clusters)  <br>- Preferred = No site redundancy - keep data on Preferred (stretched cluster)  <br>- Secondary = No site redundancy -  Keep data on Secondary Site (stretched cluster)  <br>- NoneStretch = No site redundancy - Not Recommended (https://kb.vmware.com/s/article/88358)|
   | **Description** | Description of Storage Policy you are creating, free form text. |
   | **Name** | Name of the storage policy to set. For example, **RAID-FTT-1**. |
   | **Retain up to**  | Retention period of the cmdlet output. The default value is 60.  |
   | **Specify name for execution**  | Alphanumeric name, for example, **New-AVSStoragePolicy-Exec1**.  |
   | **Timeout**  |  The period after which a cmdlet exits if taking too long to finish.  |

1. Check **Notifications** to see the progress.

## Remove AVS Storage Policy

You'll run the `Remove-AVSStoragePolicy` cmdlet to specify default storage policy for a cluster,


1. Select **Run command** > **Packages** > **Remove-AVSStoragePolicy**.

1. Provide the required values or change the default values, and then select **Run**.

   | **Field** | **Value** |
   | --- | --- |
   | **Name** | Name of Storage Policy. Wildcards are not supported and will be stripped. |
   | **Retain up to**  | Retention period of the cmdlet output. The default value is 60.  |
   | **Specify name for execution**  | Alphanumeric name, for example, **Remove-AVSStoragePolicy-Exec1**.  |
   | **Timeout**  |  The period after which a cmdlet exits if taking too long to finish.  |

1. Check **Notifications** to see the progress.

## Next steps

Now that you've learned how to configure VMware vSAN storage policies, you can learn more about:

- [How to attach disk pools to Azure VMware Solution hosts (Preview)](attach-disk-pools-to-azure-vmware-solution-hosts.md) - You can use disks as the persistent storage for Azure VMware Solution for optimal cost and performance.

- [How to configure external identity for vCenter Server](configure-identity-source-vcenter.md) - vCenter Server has a built-in local user called cloudadmin and assigned to the CloudAdmin role. The local cloudadmin user is used to set up users in Active Directory (AD). With the Run command feature, you can configure Active Directory over LDAP or LDAPS for vCenter as an external identity source.
