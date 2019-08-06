---
title: Azure Serial Console for Linux | Microsoft Docs
description: Bi-Directional Serial Console for Azure Virtual Machines and Virtual Machine Scale Sets.
services: virtual-machines
documentationcenter: ''
author: asinn826
manager: borisb
editor: ''
tags: azure-resource-manager

ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm
ms.workload: infrastructure-services
ms.date: 8/6/2019
ms.author: alsin
---

# Azure Serial Console

The Serial Console in the Azure portal provides access to a text-based console for virtual machines (VMs) and virtual machine scale set instances running either Linux or Windows. This serial connection connects to the ttyS0 serial port of the VM or virtual machine scale set instance, providing access to it independent of the network or operating system state. The serial console can only be accessed by using the Azure portal and is allowed only for those users who have an access role of Contributor or higher to the VM or virtual machine scale set.

Serial Console works in the same manner for VMs and virtual machine scale set instances. In this doc, all mentions to VMs will implicitly include virtual machine scale set instances unless otherwise stated.

For Serial Console documentation for Windows, see [Serial Console for Windows](../windows/serial-console.md).

> [!NOTE]
> The Serial Console is generally available in global Azure regions. It is not yet available in Azure government or Azure China clouds.

## Access the Azure Serial Console
To access the Serial Console on your VM or virtual machine scale set instance, you will need the following:

- Boot diagnostics must be enabled for the VM
- A user account that uses password authentication must exist within the VM
- The Azure account accessing Serial Console must have [Virtual Machine Contributor role](../../role-based-access-control/built-in-roles.md#virtual-machine-contributor) for the VM and the [boot diagnostics](boot-diagnostics.md) storage account


## Get started with the Serial Console
The Serial Console for VMs and virtual machine scale set is accessible only through the Azure portal:

### Serial Console for Virtual Machines
Serial Console for VMs is as straightforward as clicking on **Serial console** within the **Support + troubleshooting** section in the Azure portal.
  1. Open the [Azure portal](https://portal.azure.com).

  1. Navigate to **All resources** and select a Virtual Machine. The overview page for the VM opens.

  1. Scroll down to the **Support + troubleshooting** section and select **Serial console**. A new pane with the serial console opens and starts the connection.

     ![Linux Serial Console window](./media/virtual-machines-serial-console/virtual-machine-linux-serial-console-connect.gif)

### Serial Console for Virtual Machine Scale Sets
Serial Console is available on a per-instance basis for virtual machine scale sets. You will have to navigate to the individual instance of a virtual machine scale set before seeing the **Serial console** button. If your virtual machine scale set does not have boot diagnostics enabled, ensure you update your virtual machine scale set model to enable boot diagnostics, and then upgrade all instances to the new model in order to access serial console.
  1. Open the [Azure portal](https://portal.azure.com).

  1. Navigate to **All resources** and select a Virtual Machine Scale Set. The overview page for the virtual machine scale set opens.

  1. Navigate to **Instances**

  1. Select a virtual machine scale set instance

  1. From the **Support + troubleshooting** section, select **Serial console**. A new pane with the serial console opens and starts the connection.

     ![Linux virtual machine scale set Serial Console](./media/virtual-machines-serial-console/vmss-start-console.gif)

## Next steps
Additional Serial Console documentation is available in the sidebar.
- For more information on Serial Console for Linux VMs, click [here](./serial-console-linux.md).
- For more information on Serial Console for Windows VMs, click [here](./serial-console-windows.md).
