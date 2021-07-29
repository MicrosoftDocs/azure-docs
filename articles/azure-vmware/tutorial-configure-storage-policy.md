---
title: Tutorial - Configure storage policy
description:  Learn how to configure storage policy for your Azure VMware Solution virtual machines.
ms.topic: tutorial
ms.date: 08/15/2021

#Customer intent: As a < type of user >, I want < what? > so that < why? >.

---

# Tutorial: Configure storage policy

vSAN storage policies define storage requirements for your virtual machines (VMs). These policies guarantee the required level of service for your VMs because they determine how storage is allocated to the VM. Each virtual machine deployed to a vSAN datastore is assigned at least one virtual machine storage policy.

You can assign a VM storage policy in an initial deployment of a virtual machine or when you perform other virtual machine operations, such as cloning or migrating. Post-deployment cloudadmin users or equivalent roles cannot change the default storage policy for a VM. However, **VM storage policy** per disk changes is permitted. 

The RUN command enables authorized users to change the default or existing VM storage policy to one of the available policies for a VM post its deployment. There are no changes made on the disk-level VM storage policy. A user can always change the disk level VM Storage policy as per the requirements.


In this tutorial, you learn how to:

> [!div class="checklist"]
> * List all storage policies
> * Set the storage policy for a VM



## Prerequisites

Make sure that the [minimum level of hosts are met](https://docs.vmware.com/en/VMware-Cloud-on-AWS/services/com.vmware.vsphere.vmc-aws-manage-data-center-vms.doc/GUID-EDBB551B-51B0-421B-9C44-6ECB66ED660B.html).

|  **RAID configuration** | **Failures to tolerate (FTT)** | **Minimum hosts required** |
| --- | --- | --- |
| RAID-1 (Mirroring) <br />Default setting.  | 1  | 3  |
| RAID-5 (Erasure Coding)  | 1  | 4  |
| RAID-1 (Mirroring)  | 2  | 5  |
| RAID-6 (Erasure Coding)  | 2  | 6  |
| RAID-1 (Mirroring)  | 3  | 7  |


 

## List storage policies

You'll run the `Get-StoragePolicy` cmdlet to list the available storage policies in vCenter. 

all storage policies for VMs to use.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Run command** > **Packages** > **Get-StoragePolicies**.

   :::image type="content" source="media/run-command/run-command-overview-storage-policy.png" alt-text="Screenshot showing how to access the storage policy run commands available." lightbox="media/run-command/run-command-overview-storage-policy.png":::

1. Provide the required values or change the default values, and then select **Run**.

   :::image type="content" source="media/run-command/run-command-get-storage-policy.png" alt-text="Screenshot showing how to list storage policies available. ":::
   
   | **Field** | **Value** |
   | --- | --- |
   | **Retain up to**  | Job retention period. The cmdlet output will be stored for these many days. Default value is 60.  |
   | **Specify name for execution**  | Alphanumeric name of the task to execute. For example, **listVMStoragePolicy**. |
   | **Timeout**  | The period after which a cmdlet will exit if a certain task is taking too long to finish.  |

1. Check **Notifications** to see the progress.




## Set storage policy on VM

You'll run the `Set-StoragePolicy` cmdlet to set the storage policy for a VM. 

>[!NOTE]
>You cannot use the vSphere Client to change the default storage policy or any existing storage policies for a VM. 

1. Select **Run command** > **Packages** > **Set-StoragePolicy**.

1. Provide the required values or change the default values, and then select **Run**.

   | **Field** | **Value** |
   | --- | --- |
   | **StoragePolicyName** | Name of the storage policy to set. For example, **RAID-FTT-1**. |
   | **VMName** | Name of the target VM. |
   | **Retain up to**  | Job retention period. The cmdlet output is stored for the number of days defined. Default value is 60.  |
   | **Specify name for execution**  | Alphanumeric name of the task to execute. For example, **changeVMStoragePolicy**.  |
   | **Timeout**  | The time in which the cmdlet exits if a certain task takes too long to finish.  |

1. Check **Notifications** to see the progress.


## Next steps

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Next steps button]()

