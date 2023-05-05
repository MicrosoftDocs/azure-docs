---
title: Set up service alerts for Azure Virtual Desktop (classic) - Azure
description: How to set up Azure Service Health to receive service notifications for Azure Virtual Desktop (classic).
author: Heidilohr
ms.topic: tutorial
ms.date: 05/27/2020
ms.author: helohr
manager: femila
---
# Tutorial: Set up service alerts for Azure Virtual Desktop (classic)

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop (classic), which doesn't support Azure Resource Manager Azure Virtual Desktop objects. If you're trying to manage Azure Resource Manager Azure Virtual Desktop objects, see [this article](../set-up-service-alerts.md).

You can use Azure Service Health to monitor service issues and health advisories for Azure Virtual Desktop. Azure Service Health can notify you with different types of alerts (for example, email or SMS), help you understand the effect of an issue, and keep you updated as the issue resolves. Azure Service Health can also help you mitigate downtime, and prepare for planned maintenance and changes that could affect the availability of your resources.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Create and configure service alerts.

To learn more about Azure Service Health, see the [Azure Health Documentation](../../service-health/index.yml).

## Prerequisites

- [Tutorial: Create a tenant in Azure Virtual Desktop](tenant-setup-azure-active-directory.md)
- [Tutorial: Create service principals and role assignments with PowerShell](create-service-principal-role-powershell.md)
- [Tutorial: Create a host pool with Azure Marketplace](create-host-pools-azure-marketplace-2019.md)

## Create service alerts

This section shows you how to configure Azure Service Health and how to set up notifications, which you can access on the Azure portal. You can  set up different types of alerts and schedule them to notify you in a timely manner.

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
3. Use the instructions in [Create activity log alerts on service notifications](../../service-health/alerts-activity-log-service-notifications-portal.md?toc=%2fazure%2fservice-health%2ftoc.json) to set up your alerts and notifications.

## Next steps

In this tutorial, you learned how to set up and use Azure Service Health to monitor service issues and health advisories for Azure Virtual Desktop. To learn about how to sign in to Azure Virtual Desktop, continue to the Connect to Azure Virtual Desktop How-tos.

> [!div class="nextstepaction"]
> [Connect to the Remote Desktop client on Windows](connect-windows-2019.md)