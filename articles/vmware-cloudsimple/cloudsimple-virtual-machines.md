---
title: VMware Solution by CloudSimple - Azure virtual machines overview 
description: Learn about CloudSimple virtual machines and their benefits. 
author: sharaths-cs 
ms.author: dikamath 
ms.date: 04/10/2019
ms.topic: article 
ms.service: vmware 
ms.reviewer: cynthn 
manager: dikamath 
---
# CloudSimple virtual machines overview

CloudSimple allows you to manage VMware VMs from the Azure portal.  A cluster or a resource pool from your vSphere cluster is managed through Azure by mapping it to your subscription.  CloudSimple virtual machine brings self-service management of VMware VMs from the Azure portal.  

To create a CloudSimple VM from Azure, a VM template must exist on your Private Cloud vCenter.  The template is used to customize the operating system and applications.  The template VM can be hardened to meet enterprise security policies.  You can use the template to create VMs and consume them from Azure portal using a self-service model.

## Benefits

CloudSimple virtual machines from Azure portal provide a self-service mechanism for users to create and manage VMware virtual machines.

* Create a CloudSimple VM on your Private Cloud vCenter
* Manage VM properties
  * Add/remove disks
  * Add/remove NICs
* Power operations of your CloudSimple VM
  * Power on and power off
  * Reset VM
* Delete VM

## Next steps

* Learn how to [Consume VMware VMs on Azure](quickstart-create-vmware-virtual-machine.md)
* Learn how to [Map your Azure subscription](https://docs.azure.cloudsimple.com/azure-subscription-mapping/)