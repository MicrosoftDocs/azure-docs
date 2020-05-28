---
title: Azure Serial Console | Microsoft Docs
description: The Azure Serial Console allows you to connect to your VM when SSH or RDP are not available.
services: virtual-machines
documentationcenter: ''
author: asinn826
manager: borisb
editor: ''
tags: azure-resource-manager

ms.service: virtual-machines
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm
ms.workload: infrastructure-services
ms.date: 02/10/2020
ms.author: alsin
---

# Azure Serial Console

The Serial Console in the Azure portal provides access to a text-based console for virtual machines (VMs) and virtual machine scale set instances running either Linux or Windows. This serial connection connects to the ttyS0 or COM1 serial port of the VM or virtual machine scale set instance, providing access independent of the network or operating system state. The serial console can only be accessed by using the Azure portal and is allowed only for those users who have an access role of Contributor or higher to the VM or virtual machine scale set.

Serial Console works in the same manner for VMs and virtual machine scale set instances. In this doc, all mentions to VMs will implicitly include virtual machine scale set instances unless otherwise stated.

> [!NOTE]
> The Serial Console is generally available in global Azure regions and in public preview in Azure Government. It is not yet available in the Azure China cloud.

## Prerequisites to access the Azure Serial Console
To access the Serial Console on your VM or virtual machine scale set instance, you will need the following:

- Boot diagnostics must be enabled for the VM
- A user account that uses password authentication must exist within the VM. You can create a password-based user with the [reset password](https://docs.microsoft.com/azure/virtual-machines/extensions/vmaccess#reset-password) function of the VM access extension. Select **Reset password** from the **Support + troubleshooting** section.
- The Azure account accessing Serial Console must have [Virtual Machine Contributor role](../../role-based-access-control/built-in-roles.md#virtual-machine-contributor) for both the VM and the [boot diagnostics](boot-diagnostics.md) storage account

> [!NOTE]
> Classic deployments aren't supported. Your VM or virtual machine scale set instance must use the Azure Resource Manager deployment model.

## Get started with the Serial Console
The Serial Console for VMs and virtual machine scale set is accessible only through the Azure portal:

### Serial Console for Virtual Machines
Serial Console for VMs is as straightforward as clicking on **Serial console** within the **Support + troubleshooting** section in the Azure portal.
  1. Open the [Azure portal](https://portal.azure.com).

  1. Navigate to **All resources** and select a Virtual Machine. The overview page for the VM opens.

  1. Scroll down to the **Support + troubleshooting** section and select **Serial console**. A new pane with the serial console opens and starts the connection.

     ![Linux Serial Console window](./media/virtual-machines-serial-console/virtual-machine-linux-serial-console-connect.gif)

### Serial Console for Virtual Machine Scale Sets
Serial Console is available for virtual machine scale sets, accessible on each instance within the scale set. You will have to navigate to the individual instance of a virtual machine scale set before seeing the **Serial console** button. If your virtual machine scale set does not have boot diagnostics enabled, ensure you update your virtual machine scale set model to enable boot diagnostics, and then upgrade all instances to the new model in order to access serial console.
  1. Open the [Azure portal](https://portal.azure.com).

  1. Navigate to **All resources** and select a Virtual Machine Scale Set. The overview page for the virtual machine scale set opens.

  1. Navigate to **Instances**

  1. Select a virtual machine scale set instance

  1. From the **Support + troubleshooting** section, select **Serial console**. A new pane with the serial console opens and starts the connection.

     ![Linux virtual machine scale set Serial Console](./media/virtual-machines-serial-console/vmss-start-console.gif)


### TLS 1.2 in Serial Console
Serial Console uses TLS 1.2 end-to-end to secure all communication within the service. Serial Console has a dependency on a user-managed boot diagnostics storage account, and TLS 1.2 must be configured separately for the storage account. Instructions to do so are located [here](https://docs.microsoft.com/azure/storage/common/storage-security-tls).

## Advanced uses for Serial Console
Aside from console access to your VM, you can also use the Azure Serial Console for the following:
* Sending a [system request command to your VM](./serial-console-nmi-sysrq.md)
* Sending a [non-maskable interrupt to your VM](./serial-console-nmi-sysrq.md)
* Gracefully [rebooting or forcefully power-cycling your VM](./serial-console-power-options.md)


## Next steps
Additional Serial Console documentation is available in the sidebar.
- More information is available for [Serial Console for Linux VMs](./serial-console-linux.md).
- More information is available for [Serial Console for Windows VMs](./serial-console-windows.md).
