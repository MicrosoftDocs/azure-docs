---
title: Set up service alerts for Windows Virtual Desktop - Azure
description: How to set up Azure Service Health to receive service notifications for Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: tutorial
ms.date: 05/27/2020
ms.author: helohr
manager: lizross
---
# Tutorial: Set up service alerts

>[!IMPORTANT]
>This content applies to the Fall 2019 release that doesn't support Azure Resource Manager Windows Virtual Desktop objects. If you're trying to manage Azure Resource Manager Windows Virtual Desktop objects introduced in the Spring 2020 update, see [this article](../set-up-service-alerts.md).

You can use Azure Service Health to monitor service issues and health advisories for Windows Virtual Desktop. Azure Service Health can notify you with different types of alerts (for example, email or SMS), help you understand the effect of an issue, and keep you updated as the issue resolves. Azure Service Health can also help you mitigate downtime, and prepare for planned maintenance and changes that could affect the availability of your resources.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Create and configure service alerts.

To learn more about Azure Service Health, see the [Azure Health Documentation](https://docs.microsoft.com/azure/service-health/).

## Prerequisites

- [Tutorial: Create a tenant in Windows Virtual Desktop](tenant-setup-azure-active-directory.md)
- [Tutorial: Create service principals and role assignments with PowerShell](create-service-principal-role-powershell.md)
- [Tutorial: Create a host pool with Azure Marketplace](create-host-pools-azure-marketplace-2019.md)

## Create service alerts

This section shows you how to configure Azure Service Health and how to set up notifications, which you can access on the Azure portal. You can  set up different types of alerts and schedule them to notify you in a timely manner.

### Recommended service alerts

We recommend you create service alerts for the following health event types:

- **Service issue:** Receive notifications on major issues that impact connectivity of your users with the service or with the ability to manage your Windows Virtual Desktop tenant.
- **Health advisory:** Receive notifications that require your attention. The following are some examples of this type of notification:
    - Virtual Machines (VMs) not securely configured as open port 3389
    - Deprecation of functionality

### Configure service alerts

To configure service alerts:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select **Service Health.**
3. Use the instructions in [Create activity log alerts on service notifications](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log-service-notifications?toc=%2Fazure%2Fservice-health%2Ftoc.json#alert-and-new-action-group-using-azure-portal) to set up your alerts and notifications.

## Next steps

In this tutorial, you learned how to set up and use Azure Service Health to monitor service issues and health advisories for Windows Virtual Desktop. To learn about how to sign in to Windows Virtual Desktop, continue to the Connect to Windows Virtual Desktop How-tos.

> [!div class="nextstepaction"]
> [Connect to the Remote Desktop client on Windows 7 and Windows 10](../connect-windows-7-and-10.md)
