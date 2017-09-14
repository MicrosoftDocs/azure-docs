---
title: React to maintenance notifications for Linux VMs in Azure | Microsoft Docs
description: View maintenance notifications for Linux virtual machines running in Azure and start self-service maintenance.
services: virtual-machines-linux
documentationcenter: ''
author: zivr
manager: timlt
editor: ''
tags: azure-service-management,azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 09/14/2017
ms.author: zivr

---


# React to planned maintenance notifications for Linux virtual machines

Azure periodically performs updates to improve the reliability, performance, and security of the host infrastructure for virtual machines. These updates range from patching software components in the hosting environment (like operating system, hypervisor, and various agents deployed on the host), upgrading networking components, to hardware decommissioning. The majority of these updates are performed without any impact to the hosted virtual machines. However, there are cases where updates do have an impact:

- If the maintenance does not require a reboot, Azure uses in-place migration to pause the VM while the host is updated.

- If maintenance requires a reboot, you get a notice of when the maintenance is planned. In these cases, you'll also be given a time window where you can start the maintenance yourself, at a time that works for you.


Both self-service maintenance and scheduled maintenance phases begin with an e-mail notification sent to the subscription admin and co-admin by default. You can also configure who receives maintenance notifications.

You can use the Azure CLI or portal to query for the maintenance windows for your VMs and start self-service maintenance.

 > [!NOTE]
 > If you try to start maintenance and fail, Azure will mark your VM as **skipped** and will not reboot it during the scheduled maintenance window. Instead, you will be contacted in a later time with a new schedule. 

## Find VMs scheduled for maintenance using CLI

Planned maintenance information can be seen using [azure vm get-instance-view](/cli/azure/vm?view=azure-cli-latest#az_vm_get_instance_view).
 
Maintenance information is returned only if there is maintenance planned, if there is no maintenance scheduled that will impact the VM, the cmdlet will not return any maintenance information. 

```azure-cli
az vm get-instance-view  rgName  vmName 
```

The following values are returned under MaintenanceRedeployStatus: 

| Value	| Description	|
|-------|---------------|
| IsCustomerInitiatedMaintenanceAllowed | Indicates whether you can start maitnenance on the VM at this time ||
| PreMaintenanceWindowStartTime         | The beginning of the maintenance self-service window when you can initiate maintenance on your VM ||
| PreMaintenanceWindowEndTime           | The end of the maintenance self-service window when you can initiate maintenance on your VM ||
| MaintenanceWindowStartTime            | The beginning ofthe maintenance scheduled window when you can initiate maintenance on your VM ||
| MaintenanceWindowEndTime              | The end of the maintenance scheduled window when you can initiate maintenance on your VM ||
| LastOperationResultCode               | The result of the last attempt to initiate mintenance on the VM ||


## Start maintenance on your VM using CLI

The following call will initiate maintenance on a VM if `IsCustomerInitiatedMaintenanceAllowed` is set to true.

```azure-cli
az vm perform-maintenance rgName vmName 
```

[!INCLUDE [virtual-machines-common-maintenance-notifications](../../../includes/virtual-machines-common-maintenance-notifications.md)]


## Next Steps

To learn more about VM maintenance, see [Planned maintenance for Windows virtual machines](planned-maintenance.md).