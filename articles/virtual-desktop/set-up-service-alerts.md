---
title: Set up service alerts - Azure
description: How to set up Azure Service Health to receive service notifications for Windows Virtual Desktop.
services: virtual-desktop
author: ChJenk

ms.service: virtual-desktop
ms.topic: tutorial
ms.date: 04/08/2019
ms.author: v-chjenk
---
# Tutorial: Set up service alerts

You can use Azure Service Health to monitor service issues and health advisories for Windows Virtual Desktop. You can configure Azure Service Health so that the service sends you notifications, which you can access on the Azure portal. You can also set up different types of alerts (for example, email or SMS) and schedule them to notify you in a timely manner.  

## Service alert recommendations

We recommend you create service alerts for the following health event types:

- **Service issue:** Receive notifications on major issues that impact connectivity of your users with the service or with the ability to manage your WVD tenant.
- **Health advisory:** Receive notifications that require your attention. The following are some examples of this type of notification:
    - Virtual Machines (VMs) not securely configured as open port 3389
    - Deprecation of functionality
- 
## Configure service alerts

Learn how to configure service alerts with Azure Service Health here:

- [Video tutorials](https://aka.ms/ash-videos)
- [How-tos](https://aka.ms/ash-alerts)

## Next steps

Once you've set up alerts, you can troubleshoot issues that require your attention. See the following articles to learn how to troubleshoot and address issues.

- For an overview on troubleshooting Windows Virtual Desktop and the escalation tracks, see [Troubleshooting overview, feedback, and support](troubleshoot-set-up-overview.md).
- To use the diagnostics feature to identify issues, see [Identify issues with the diagnostics feature](https://docs.microsoft.com/azure/virtual-desktop/diagnostics-role-service)
