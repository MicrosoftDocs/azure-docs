---
title: Set up service alerts - Azure
description: How to set up Azure Service Health to receive service notifications for Windows Virtual Desktop.
services: virtual-desktop
author: ChJenk

ms.service: virtual-desktop
ms.topic: tutorial
ms.date: 06/11/2019
ms.author: v-chjenk
---
# Tutorial: Set up service alerts

You can use Azure Service Health to monitor service issues and health advisories for Windows Virtual Desktop. Azure Service Health can notify you with different types of alerts (for example, email or SMS), help you understand the effect of an issue, and keep you updated as the issue resolves. Azure Service Health can also help you mitigate downtime, and prepare for planned maintenance and changes that could affect the availability of your resources.

In this tutorial, you'll:

> [!div class="checklist"]
> * Learn about Azure Service Health.
> * Create and configure service alerts.

## Prerequisites

- [Tutorial: Create a tenant in Windows Virtual Desktop Preview](https://docs.microsoft.com/azure/virtual-desktop/tenant-setup-azure-active-directory)
- [Tutorial: Create service principals and role assignments with PowerShell](https://docs.microsoft.com/azure/virtual-desktop/create-service-principal-role-powershell)
- [Tutorial: Create a host pool with Azure Marketplace](https://docs.microsoft.com/en-us/azure/virtual-desktop/create-host-pools-azure-marketplace)

## Learn about Azure Service Health

For an overview of the Azure Service Health dashboard, see [Service Health overview](https://docs.microsoft.com/azure/service-health/service-health-overview)

For video tutorials about health alerts, see [How to stay informed about Azure service issues](https://aka.ms/ash-videos).

For the latest content about Azure Service Health, see [Azure Health Documentation](https://docs.microsoft.com/azure/service-health/).

![Screenshot of Azure Service Health.](media/service-alerts.png)

## Create service alerts

This section shows you how to configure Azure Service Health and how to set up notifications, which you can access on the Azure portal. You can  set up different types of alerts and schedule them to notify you in a timely manner.

### Recommended service alerts

We recommend you create service alerts for the following health event types:

- **Service issue:** Receive notifications on major issues that impact connectivity of your users with the service or with the ability to manage your WVD tenant.
- **Health advisory:** Receive notifications that require your attention. The following are some examples of this type of notification:
    - Virtual Machines (VMs) not securely configured as open port 3389
    - Deprecation of functionality

### Configure service alerts

To configure service alerts:

1. Sign in to the [Azure Portal](https://portal.azure.com/).
2. Select **Service Health.**
3. Use the instructions in [Create activity log alerts on service notifications](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log-service-notifications?toc=%2Fazure%2Fservice-health%2Ftoc.json#alert-and-new-action-group-using-azure-portal) to set up your alerts and notifications.

## Next steps

In this tutorial, you learned how to create app groups, populate it with RemoteApps, and assign users to the app group. To learn more about how to sign in to Windows Virtual Desktop, continue to the Connect to Windows Virtual Desktop How-tos.

- [Connect to the Remote Desktop client on Windows 7 and Windows 10](connect-windows-7-and-10.md)
- [Connect to the Windows Virtual Desktop Preview web client](connect-web.md)
