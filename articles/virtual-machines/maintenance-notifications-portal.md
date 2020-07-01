---
title: Use the portal for maintenance notifications
description: View maintenance notifications for virtual machines running in Azure, and start self-service maintenance, using the portal.
author: shants123
ms.service: virtual-machines
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 11/19/2019
ms.author: shants
#pmcontact: shants
---

# Handling planned maintenance notifications using the portal

**This article applies to virtual machines running both Linux and Windows.**

Once a [planned maintenance](maintenance-notifications.md) wave is scheduled, you can check for a list of virtual machines that are impacted. 

You can use the Azure portal and look for VMs scheduled for maintenance.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the left navigation, click **Virtual Machines**.

3. In the Virtual Machines pane, select **Edit columns** button to open the list of available columns.

4. Select and add the following columns:

   **Maintenance status**: Shows the maintenance status for the VM. The following are the potential values:
	  
      | Value | Description |
	  |-------|-------------|
	  | Start now | The VM is in the self-service maintenance window that lets you initiate the maintenance yourself. See below on how to start maintenance on your VM. | 
	  | Scheduled | The VM is scheduled for maintenance with no option for you to initiate maintenance. You can learn of the maintenance window by selecting the Maintenance - Scheduled window in this view or by clicking on the VM. | 
	  | Already updated | Your VM is already updated and no further action is required at this time. | 
	  | Retry later | You have initiated maintenance with no success. You will be able to use the self-service maintenance option at a later time. | 
	  | Retry now | You can retry a previously unsuccessful self-initiated maintenance. | 
	  | - | Your VM is not part of a planned maintenance wave. |
	  

   **Maintenance - Self-service window**: Shows the time window when you can self-start maintenance on your VMs.
   
   **Maintenance - Scheduled window**: Shows the time window when Azure will maintain your VM in order to complete maintenance. 



## Notification and alerts in the portal

Azure communicates a schedule for planned maintenance by sending an email to the subscription owner and co-owners group. You can add additional recipients and channels to this communication by creating Azure activity log alerts. For more information, see [Create activity log alerts on service notifications](../azure-monitor/platform/alerts-activity-log-service-notifications.md).

Make sure you set the **Event type** as **Planned maintenance**, and **Services** as **Virtual Machine Scale Sets** and/or **Virtual Machines**.

## Start Maintenance on your VM from the portal

While looking at the VM details, you will be able to see more maintenance-related details.  
At the top of the VM details view, a new notification ribbon will be added if your VM is included in a planned maintenance wave. In addition, a new option is added to start maintenance when possible. 


Click on the maintenance notification to see the maintenance page with more details on the planned maintenance. From there, you will be able to **start maintenance** on your VM.

Once you start maintenance, your virtual machine will be maintained and the maintenance status will be updated to reflect the result within few minutes.

If you missed the self-service window, you will still be able to see the window when your VM will be maintained by Azure. 


## Next steps

You can also handle planned maintenance using the [Azure CLI](maintenance-notifications-cli.md) or [PowerShell](maintenance-notifications-powershell.md).