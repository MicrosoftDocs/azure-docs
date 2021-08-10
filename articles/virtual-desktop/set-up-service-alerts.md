---
title: Set up service alerts for Azure Virtual Desktop - Azure
description: How to set up Azure Service Health to receive service notifications for Azure Virtual Desktop.
author: Heidilohr
ms.topic: tutorial
ms.date: 06/11/2019
ms.author: helohr
manager: femila
---
# Tutorial: Set up service alerts

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop with Azure Resource Manager Azure Virtual Desktop objects. If you're using Azure Virtual Desktop (classic) without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/set-up-service-alerts-2019.md).

You can use Azure Service Health to monitor service issues and health advisories for Azure Virtual Desktop. Azure Service Health can notify you with different types of alerts (for example, email or SMS), help you understand the effect of an issue, and keep you updated as the issue resolves. Azure Service Health can also help you mitigate downtime and prepare for planned maintenance and changes that could affect the availability of your resources.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Create and configure service alerts.

To learn more about Azure Service Health, see the [Azure Health Documentation](../service-health/index.yml).

## Create service alerts

This section shows you how to configure Azure Service Health and how to set up notifications, which you can access on the Azure portal. You can set up different types of alerts and schedule them to notify you in a timely manner.

### Recommended service alerts

We recommend you create service alerts for the following health event types:

- **Service issue:** Receive notifications on major issues that impact connectivity of your users with the service or with the ability to manage your Azure Virtual Desktop tenant.
- **Health advisory:** Receive notifications that require your attention. The following are some examples of this type of notification:
    - Virtual Machines (VMs) not securely configured as open port 3389
    - Deprecation of functionality

### Configure service alerts

To configure service alerts:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select **Service Health.**
3. Follow the instructions in [Create activity log alerts on service notifications](../service-health/alerts-activity-log-service-notifications-portal.md?toc=%2fazure%2fservice-health%2ftoc.json) to set up your alerts and notifications. 

   >[!NOTE]
   >Azure Virtual Desktop is listed as "Windows Virtual Desktop" in the drop-down menu under **Services** when creating an alert rule.
   

## Next steps

In this tutorial, you learned how to set up and use Azure Service Health to monitor service issues and health advisories for Azure Virtual Desktop. To learn about how to sign in to Azure Virtual Desktop, continue to the Connect to Azure Virtual Desktop How-tos.

> [!div class="nextstepaction"]
> [Connect to the Remote Desktop client on Windows 7 and Windows 10](./user-documentation/connect-windows-7-10.md)
