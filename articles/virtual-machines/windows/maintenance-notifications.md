---
title: Maintenance notifications Windows VMs in Azure | Microsoft Docs
description: View maintenance notifications for Windows virtual machines running in Azure.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: timlt
editor: ''
tags: azure-service-management,azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 08/10/2017
ms.author: cynthn

---


# View maintenance notifications for Windows virtual machines

You can use the Azure portal, PowerShell or the API to query for the maintenance windows for your VMs. In addition, you will  receive an e-mail notification if one or more of your VMs are scheduled for maintenance.

Both self-service maintenance and scheduled maintenance phases begin with a notification. Expect to receive a single notification per Azure subscription. The notification is sent to the subscription’s admin and co-admin by default. You can also configure who receives maintenance notifications.

## View in the portal 

You can use the Azure portal and look for VMs scheduled for maintenance.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the left navigation, click **Virtual Machines**.

3. In the Virtual Machines pane, click the **Columns** button to open the list of available columns.

4. Select and add the **Maintenance Window** columns. VMs that are scheduled for maintenance have the maintenance windows surfaced. Once maintenance is completed or aborted, the maintenance window is no longer be presented.

## Query using the Azure API

Use the [get VM information
API](https://docs.microsoft.com/rest/api/compute/virtualmachines/virtualmachines-get)
and look for the instance view to discover the maintenance details on an
individual VM. The response includes the following elements:

  - isCustomerInitiatedMaintenanceAllowed: Indicates whether you can now initiate pre-emptive redeploy on the VM.

  - preMaintenanceWindowStartTime: The start time of the pre-emptive maintenance window.

  - preMaintenanceWindowEndTime: The end time of the pre-emptive maintenance window. After this time, you will no longer be able to initiate maintenance on this VM.
    
  - maintenanceWindowStartTime: The start time of the scheduled maintenance window when your VM are impacted.

  - maintenanceWindowEndTime: The end time of the scheduled maintenance window.
  
  - lastOperationResultCode: The result of your last Maintenance-Redeploy operation.
 
  - lastOperationMessage:  Message describing the result of your last Maintenance-Redeploy operation.


## Next Steps

To learn more about VM maintenance, see [Planned maintenance for Windows virtual machines](planned-maintenance.md).