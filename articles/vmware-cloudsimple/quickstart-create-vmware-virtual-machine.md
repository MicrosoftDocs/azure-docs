---
title: Azure VMware Solution by CloudSimple Quickstart - consume VMware VMs on Azure 
description: Learn how to configure and consume VMware VMs from Azure portal using Azure VMware Solution by CloudSimple 
author: sharaths-cs 
ms.author: dikamath 
ms.date: 04/11/2019 
ms.topic: article 
ms.service: vmware 
ms.reviewer: cynthn 
manager: dikamath 
---
# Quickstart - Consume VMware VMs on Azure

To create a virtual machine in the Azure portal, use Virtual Machine templates that your CloudSimple administrator has enabled for your subscription. These VM templates are found on the VMware infrastructure.

## CloudSimple VM creation on Azure requires a VM template

Create a virtual machine on your private cloud from vCenter UI. To create a template, follow the instructions in [Clone a Virtual Machine to a Template in the vSphere Web Client](https://docs.vmware.com/en/VMware-vSphere/6.7/com.vmware.vsphere.vm_admin.doc/GUID-FE6DE4DF-FAD0-4BB0-A1FD-AFE9A40F4BFE.html). Store the VM template on your private cloud vCenter.

## Create a virtual machine in the Azure portal

1. On the left menu, click **+** or **Create a Resource**.

2. On the left menu, click **Compute**, and then click **CloudSimple Virtual Machine**.

3. Click **Confirm** to verify that you want to create a new VM.

4. Set the basic configuration as described in the following table, and then click **Next: Size**.

    | Field | Description |
    | ------------ | ------------- |
    | Subscription | Azure subscription associated with your private cloud deployment.  |
    | Resource Group | Deployment group to which the VM will be assigned. You can select an existing group or create a new one. |
    | Name | Name to identify the VM.  |
    | Location | Azure region in which this VM is hosted.  |
    | Resource Pool | Physical resources for the VM. Select from the available resource pools. |
    | vSphere Template | Type of operating system template for the VM.  |
    | User name | User name of the VM administrator. |
    | Password Confirm password | Password for the VM administrator.  |

5. Select the number of cores and memory capacity for the VM.

6. (Optional) If you want to expose full CPU virtualization to the guest operating system, select the **Expose to Guest OS** checkbox.
This selection enables applications that require hardware virtualization to run on virtual machines without binary translation or paravirtualization. For more information, see the VMware article [Expose VMware Hardware Assisted Virtualization](https://docs.vmware.com/en/VMware-vSphere/6.5/com.vmware.vsphere.vm_admin.doc/GUID-2A98801C-68E8-47AF-99ED-00C63E4857F6.html).

7. Click **Next: Configuration**.

8. Configure network interfaces and disks as described in the following tables.

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

9. Review the settings. To make any changes, click the tabs at the top.

10. Click **Create** to save the settings and create the VM.

## Next steps

* [View list of CloudSimple virtual machines](https://docs.azure.cloudsimple.com/azurelistvms/)
* [Manage CloudSimple virtual machine from Azure](https://docs.azure.cloudsimple.com/azureoverviewpage/)