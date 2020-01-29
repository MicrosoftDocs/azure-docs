---
title: Azure VMware Solutions (AVS) - Virtual machines overview 
description: Learn about AVS virtual machines and their benefits. 
titleSuffix: Azure VMware Solutions (AVS)
author: sharaths-cs 
ms.author: dikamath 
ms.date: 08/20/2019
ms.topic: article 
ms.service: azure-vmware-cloudsimple 
ms.reviewer: cynthn 
manager: dikamath 
---
# AVS virtual machines overview

AVS allows you to manage VMware virtual machines (VMs) from the Azure portal. A cluster or a resource pool from your vSphere cluster is managed through Azure by mapping it to your subscription.

To create an AVS VM from Azure, a VM template must exist on your AVS Private Cloud vCenter. The template is used to customize the operating system and applications. The template VM can be hardened to meet enterprise security policies. You can use the template to create VMs and then consume them from the Azure portal using a self-service model.

## Benefits

AVS virtual machines from Azure portal provide a self-service mechanism for users to create and manage VMware virtual machines.

* Create an AVS VM on your AVS Private Cloud vCenter
* Manage VM properties
  * Add/remove disks
  * Add/remove NICs
* Power operations of your AVS VM
  * Power on and power off
  * Reset VM
* Delete VM

## Next steps

* Learn how to [Consume VMware VMs on Azure](quickstart-create-vmware-virtual-machine.md)
* Learn how to [Map your Azure subscription](azure-subscription-mapping.md)
