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

As with any other service on Azure, you can monitor Windows Virtual Desktop with Azure Service Health. You can set up Azure Service Health to send you notifications on service issues and you can access the notifications in the Azure portal where the service alerts are set up. Different types of alerts can be set up (for example, email or sms) and you can set them up to notify you in a timely manner.  

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

Once you've set up alerts, use the following instructions if you receive an alert that requires you to troubleshoot Windows Virtual Desktop issues.

- For an overview on troubleshooting Windows Virtual Desktop and the escalation tracks, see [Troubleshooting overview, feedback, and support](troubleshoot-set-up-overview.md).
- To use the diagnostics feature to identify issues, see [Identify issues with the diagnostics feature](https://docs.microsoft.com/azure/virtual-desktop/diagnostics-role-service)
