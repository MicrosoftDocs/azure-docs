---
title: Self service maintenance orchestration (public preview)
description: Learn how to enable self service maintenance orchestration.
author: jjaygbay1
ms.author: jacobjaygbay
ms.topic: conceptual
ms.service: azure-vmware
ms.date: 06/25/2024
ms.custom: engagement-fy24
---

# Self service maintenance orchestration (public preview)

In this article, you learn about one of the advantages of Azure VMware Solution private cloud. The advantage is the managed platform where Microsoft handles the lifecycle management of VMware software (ESXi, vCenter Server, and vSAN) and NSX appliances. Microsoft also takes care of applying any patches, updates, or upgrades to ESXi, vCenter Server, vSAN, and NSX within your private cloud. 
Regular upgrades of the Azure VMware Solution private cloud and VMware software ensure the latest security, stability, and feature sets are running in your private cloud. For more information, see [Host maintenance and lifecycle management](architecture-private-clouds.md).

Microsoft schedules maintenance and notifies customers through Service Health notifications. The details of the planned maintenance are available under the planned maintenance section. Currently, customers must raise a support ticket if they wish to change a scheduled maintenance window.
The Self-Service Maintenance orchestration feature provides customers with the flexibility to reschedule their planned maintenance directly from the Azure portal.

## Prerequisites

- An existing Azure VMware Solution private cloud.
- A registered subscription to the Microsoft Azure VMware Solution AFEC flags named Early Access and Self Serve for Maintenance. You can find these flags under **Preview Features** on the Azure portal.
 
## Reschedule maintenance through Azure VMware Solution maintenance

1. Sign in to your Azure VMware Solution private cloud.
 
    >[!Note]
    > At least a contributor level access on the Azure VMware Solution private cloud is required.

1. From the left navigation, locate **Operations** and select **Maintenance** from the drop-down list.

    :::image type="content" source="media/self-service-orchestration/operations-maintenance.png" alt-text="Screenshot that shows how to set up self-service maintenance." lightbox="media/self-service-orchestration/operations-maintenance.png":::
    
1. Under the **Upcoming maintenance** tab, select the **Reschedule** option located on the right side.

     :::image type="content" source="media/self-service-orchestration/reschedule-maintenance.png" alt-text="Screenshot that shows how to reschedule maintenance." lightbox="media/self-service-orchestration/reschedule-maintenance.png":::

      
 
1. Input the revised date and time, then select **Reschedule**. 
    
      :::image type="content" source="media/self-service-orchestration/upcoming-maintenance.png" alt-text="Screenshot that shows how to review upcoming maintenance schedule." lightbox="media/self-service-orchestration/upcoming-maintenance.png":::
 
 After you’ve selected **Reschedule**, the system modifies the schedule to the new date and the new schedule is displayed to the portal.

## Additional Information
The following system error or warning messages appear while trying to reschedule maintenance tasks:

 - Users aren't allowed to reschedule maintenance after the upgrade deadline and on freeze days.
 - Users will be allowed to reschedule up to 1 hour before and after the start of the maintenance. 
 - Each maintenance task is assigned an internal deadline. Dates that exceed this deadline appear greyed out on the portal. If a customer needs to reschedule maintenance beyond this point, they should raise a support ticket.
 - Maintenance that is critical or carries fix for a critical security vulnerability, might have the reschedule option greyed out.
 - This feature is only enabled for a selected set of maintenance, therefore not all the Azure VMware Solution maintenance shows up in this navigation or have the reschedule option.