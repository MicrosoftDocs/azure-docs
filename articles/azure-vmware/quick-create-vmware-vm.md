---
title: Quick start - consume VMware VMs on Azure 
description: Learn how to configure and consume VMware VMs from Azure portal using VMware Solutions by CloudSimple 
author: sharaths-cs 
ms.author: dikamath 
ms.date: 4/2/19 
ms.topic: article 
ms.service: vmware 
ms.reviewer: cynthn 
manager: dikamath 
---
# Quick start - Consume VMware VMs on Azure

You can create a virtual machine in the Azure Portal by using VM templates on the VMware infrastructure that your CloudSimple administrator has enabled for your subscription.

1. On the left menu, click **+** or **Create a Resource**.

2. On the left menu, click **Compute**, and then click **CloudSimple Virtual Machine**.

3. Click **Confirm** to verify that you want to create a new VM.

4. Set the basic configuration as described in the following table, and then click **Next: Size**.

    !!! Note
        CloudSimple virtual machine creation on Azure requires a VM template.  This VM template should exist on your Private Cloud vCenter.  Create a virtual machine on your Private Cloud from vCenter UI with desired operating system and configurations.  Using instructions in [Clone a Virtual Machine to a Template in the vSphere Web Client](https://docs.vmware.com/en/VMware-vSphere/6.5/com.vmware.vsphere.vm_admin.doc), create a template.

    | Field | Description |
    | ------------ | ------------- |
    | Subscription | Azure subscription associated with your Private Cloud deployment.  |
    | Resource Group | Deployment group to which the VM will be assigned. You can select an existing group or create a new one. |
    | Name | Name to identify the VM.  |
    | Location | Azure region in which this VM is hosted.  |
    | Resource Pool | Physical resources for the VM. Select from the available resource pools. |
    | vSphere Template | Type of operating system template for the VM.  |
    | User name | User name of the VM administrator. |
    | Password Confirm password | Password for the VM administrator.  |

5. Select the number of cores and memory capacity for the VM. Select the **Expose to Guest OS** checkbox if you want to expose full CPU virtualization to the guest operating system so that applications that require hardware virtualization can run on virtual machines without binary translation or paravirtualization. For more information see the VMware article [Expose VMware Hardware Assisted Virtualization](https://docs.vmware.com/en/VMware-vSphere/6.5/com.vmware.vsphere.vm_admin.doc/GUID-2A98801C-68E8-47AF-99ED-00C63E4857F6.html).

6. Click **Next: Configuration**.

7. Configure network interfaces and disks as described in the following tables.

    For network interfaces, click **Add network interface** and configure the following settings.

    | Control | Description |
    | ------------ | ------------- |
    | Name | Enter a name to identify the interface.  |
    | Network | Select from the list of configured networks in your Private Cloud vSphere.  |
    | Adapter | Select a vSphere adaptor from the list of available types configured for the VM. For more information, see the VMware knowledge base article [Choosing a network adapter for your virtual machine](https://kb.vmware.com/s/article/1001805). |
    | Power on at Boot | Choose whether to enable the NIC hardware when the VM is booted. The default is **Enable**. |

    For disks, click **Add disk** and configure the following settings.

    | Item | Description |
    | ------------ | ------------- |
    | Name | Enter a name to identify the disk.  |
    | Size | Select one of the available sizes.  |
    | SCSI Controller | Select a SCSI controller. The available controllers vary for the different supported operating systems.  |
    | Mode | Determines how the disk participates in snapshots. Choose one of these options: <br> - Independent persistent: All data written to the disk is written permanently.<br> - Independent non-persistent: Changes written to the disk are discarded when you power off or reset the virtual machine.  Independent non-persistent mode allows you to always restart the VM in the same state. For more information, see the [VMware documentation.](https://docs.vmware.com/en/VMware-vSphere/6.5/com.vmware.vsphere.vm_admin.doc/GUID-8B6174E6-36A8-42DA-ACF7-0DA4D8C5B084.html)

8. Review the settings. To make any changes, click the tabs at the top.

9. Click **Create** to save the settings and create the VM.