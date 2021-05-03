--- 
title: Azure VMware Solution by CloudSimple - Manage Private Cloud VMs in Azure 
description: Describes how to manage CloudSimple Private Cloud VMs in the Azure portal, including adding disks, changing VM capacity, and adding network interfaces
author: shortpatti 
ms.author: v-patsho
ms.date: 08/16/2019 
ms.topic: article 
ms.service: azure-vmware-cloudsimple 
ms.reviewer: cynthn 
manager: dikamath 
---

# Manage your CloudSimple Private Cloud virtual machines in Azure

To manage the virtual machines that you [created for your CloudSimple Private Cloud](azure-create-vm.md), sign to the [Azure portal](https://portal.azure.com). Search for and select the virtual (search under **All Services** or **Virtual Machines** on the side menu).

## Control virtual machine operation

The following controls are available from the **Overview** page for your selected virtual machine.

| Control | Description |
| ------------ | ------------- |
| Connect | Connect to the specified VM.  |
| Start | Start the specified VM.  |
| Restart | Shut down and then power up the specified VM.  |
| Stop | Shut down the specific VM.  |
| Capture | Capture an image of the specified VM so it can be used as an image to create other VMs. See [Create a managed image of a generalized VM in Azure](../virtual-machines/windows/capture-image-resource.md).   |
| Move | Move to the specified VM.  |
| Delete | Remove the specified VM.  |
| Refresh | Refresh the data in the display.  |

### View performance information

The charts in the lower area of the **Overview** page present performance data for the selected interval (last hour to last 30 days; default is last hour). Within each chart, you can display the numeric values for any time within the interval by moving your cursor back and forth over the chart.

The following charts are displayed.

| Item | Description |
| ------------ | ------------- |
| CPU (average) | Average CPU utilization in percentage over the selected interval.   |
| Network | Traffic in and out of the network (MB) over the selected interval.  |
| Disk Bytes | Total data read from disk and written to disk (MB) over the selected interval.  |
| Disk Operations | Average rate of disk operations (operations/second) over the selected interval. |

## Manage VM disks

To add a VM disk, open the **Disks** page for the selected VM. To add a disk, click **Add disk**. Configure each of the following settings by entering or selecting an inline option. Click **Save**.

   | Item | Description |
   | ------------ | ------------- |
   | Name | Enter a name to identify the disk.  |
   | Size | Select one of the available sizes.  |
   | SCSI Controller | Select a SCSI controller. The available controllers vary for the different supported operating systems.  |
   | Mode | Determines how the disk participates in snapshots. Choose one of these options: <br> - Independent persistent: All data written to the disk is written permanently.<br> - Independent, non-persistent: Changes written to the disk are discarded when you power off or reset the virtual machine.  This mode allows you to always restart the VM in the same state. For more information, see the [VMware documentation](https://docs.vmware.com/en/VMware-vSphere/6.5/com.vmware.vsphere.vm_admin.doc/GUID-8B6174E6-36A8-42DA-ACF7-0DA4D8C5B084.html). |

To delete a disk, select it and click **Delete**.

## Change the capacity of the VM

To change the capacity of the VM, open the **Size** page for the selected VM. Specify any of the following, and click **Save**.

| Item | Description |
| ------------ | ------------- |
| Number of cores | Number of cores assigned to the VM.  |
| Hardware virtualization | Select the checkbox to expose the hardware virtualization to the guest OS. See the VMware article [Expose VMware Hardware Assisted Virtualization](https://docs.vmware.com/en/VMware-vSphere/6.5/com.vmware.vsphere.vm_admin.doc/GUID-2A98801C-68E8-47AF-99ED-00C63E4857F6.html). |
| Memory Size | Select the amount of memory to allocate to the VM.  

## Manage network interfaces

To add an interface, click **Add network interface**. Configure each of the following settings by entering or selected an inline option. Click **Save**.

   | Control | Description |
   | ------------ | ------------- |
   | Name | Enter a name to identify the interface.  |
   | Network | Select from the list of configured networks in your Private Cloud vSphere.  |
   | Adapter | Select a vSphere adaptor from the list of available types configured for the VM. For more information, see the VMware knowledge base article [Choosing a network adapter for your virtual machine](https://kb.vmware.com/s/article/1001805). |
   | Power on at Boot | Choose whether to enable the NIC hardware when the VM is booted. The default is **Enable**. |

To delete a network interface, select it and click **Delete**.
