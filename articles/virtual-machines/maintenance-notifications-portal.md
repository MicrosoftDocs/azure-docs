---
title: Use the portal for maintenance notifications
description: View maintenance notifications for virtual machines running in Azure, and start self-service maintenance, using the portal.
ms.service: virtual-machines
ms.subservice: maintenance
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 11/14/2022
---

# Handling planned maintenance notifications using the portal

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

Once a [planned maintenance](maintenance-notifications.md) wave is scheduled, you can check for a list of virtual machines that are impacted. 

You can use the Azure portal and look for VMs scheduled for maintenance.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Search for or select **Virtual Machines**.

3. In the Virtual Machines pane, select the **More** menu and then select **Maintenance -> Virtual machine maintenance** to open the list with maintenance columns.

   **Maintenance status**: Shows the maintenance status for the VM. The following are the potential values:
	  
    | Value | Description |
    |-------|-------------|
    | Start now | The VM is in the self-service maintenance window that lets    you initiate the maintenance yourself. See below on how to start    maintenance on your VM. | 
    | Scheduled | The VM is scheduled for maintenance with no option for you    to initiate maintenance. You can learn of the maintenance window by    selecting the Maintenance - Scheduled window in this view or by clicking    on the VM. | 
    | Already updated | Your VM is already updated and no further action is    required at this time. | 
    | Retry later | You have initiated maintenance with no success. You will    be able to use the self-service maintenance option at a later time. | 
    | Retry now | You can retry a previously unsuccessful self-initiated    maintenance. | 
    | - | Your VM is not part of a planned maintenance wave. |

   **Maintenance - Self-service window**: Shows the time window when you can self-start maintenance on your VMs.
   
   **Maintenance - Scheduled window**: Shows the time window when Azure will maintain your VM in order to complete maintenance. 



## Notification and alerts in the portal

[Azure Service Health](https://azure.microsoft.com/get-started/azure-portal/service-health/#overview) has a dedicated tab for Planned Maintenance where all Azure services (for example, Virtual Machines) publish their upcoming Maintenance events.

Virtual Machine related Maintenance notifications are available under [Service Health](https://aka.ms/azureservicehealth) in the Azure portal. For some specific Virtual Machine Planned Maintenance scenarios, Azure might communicate the schedule by sending an additional email (besides Service Health) to the Subscription Classic Admin, Co-Admin, and Subscription Owners group.

[Azure Service Health](https://azure.microsoft.com/get-started/azure-portal/service-health/#overview) enables users to configure their own custom Service Health alerts for the Planned Maintenance category. With Azure Service Health alerts, you can assign different Action-Groups to include additional recipients and channels (such as emails and SMS) based on event or service type, like Virtual Machine maintenance in this context. For more information, see [Create activity log alerts on service notifications](../service-health/alerts-activity-log-service-notifications-portal.md).

While creating alerts specific to Virtual Machine maintenance, make sure you set the **Event type** as **Planned maintenance** and **Services** as **Virtual Machine Scale Sets** and/or **Virtual Machines**.

## Start Maintenance on your VM from the portal

While looking at the VM details, you will be able to see more maintenance-related details.  
At the top of the VM details view, a new notification ribbon will be added if your VM is included in a planned maintenance wave. In addition, a new option is added to start maintenance when possible.

Click on the maintenance notification to see the maintenance page with more details on the planned maintenance. From there, you will be able to **start maintenance** on your VM.

Once you start maintenance, your virtual machine will be maintained and the maintenance status will be updated to reflect the result within few minutes.

If you missed the self-service window, you will still be able to see the window when your VM will be maintained by Azure.


## Next steps

You can also handle planned maintenance using the [Azure CLI](maintenance-notifications-cli.md) or [PowerShell](maintenance-notifications-powershell.md).
