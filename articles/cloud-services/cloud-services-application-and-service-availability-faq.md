---
title: Application and service availability issues for Microsoft Azure Cloud Services FAQ| Microsoft Docs
description: This article lists the frequently asked questions about application and service availability for Microsoft Azure Cloud Services.
services: cloud-services
documentationcenter: ''
author: genlin
manager: cshepard
editor: ''
tags: top-support-issue

ms.assetid: 84985660-2cfd-483a-8378-50eef6a0151d
ms.service: cloud-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/31/2018
ms.author: genli

---
# Application and service availability issues for Azure Cloud Services: Frequently asked questions (FAQs)

This article includes frequently asked questions about application and service availability issues for [Microsoft Azure Cloud Services](https://azure.microsoft.com/services/cloud-services). You can also consult the [Cloud Services VM Size page](cloud-services-sizes-specs.md) for size information.

[!INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## My role got recycled. Was there any update rolled out for my cloud service?
Roughly once a month, Microsoft releases a new Guest OS version for Windows Azure PaaS VMs. The Guest OS is only one such update in the pipeline. A release can be affected by many other factors. In addition, Azure runs on hundreds of thousands of machines. Therefore, it's impossible to predict the exact date and time when your roles will reboot. We update the Guest OS Update RSS Feed with the latest information that we have, but you should consider that reported time to be an approximate value. We are aware that this is problematic for customers and are working on a plan to limit or precisely time reboots.

For complete details about recent Guest OS updates, see [Azure Guest OS releases and SDK compatibility matrix](cloud-services-guestos-update-matrix.md).

For helpful information on restarts and pointers to technical details of Guest and Host OS updates, see the MSDN blog post [Role Instance Restarts Due to OS Upgrades](https://blogs.msdn.com/b/kwill/archive/2012/09/19/role-instance-restarts-due-to-os-upgrades.aspx).

## Why does the first request to my cloud service after the service has been idle for some time take longer than usual?
When the Web Server receives the first request, it first recompiles the code and then processes the request. That's why the first request takes longer than the others. By default, the app pool gets shut down in cases of user inactivity. The app pool will also recycle by default every 1,740 minutes (29 hours).

Internet Information Services (IIS) application pools can be periodically recycled to avoid unstable states that can lead to application crashes, hangs, or memory leaks.

The following documents will help you understand and mitigate this issue:
* [Fixing slow initial load for IIS](https://stackoverflow.com/questions/13386471/fixing-slow-initial-load-for-iis)
* [IIS 7.5 web application first request after app-pool recycle very slow](https://stackoverflow.com/questions/13917205/iis-7-5-web-application-first-request-after-app-pool-recycle-very-slow)

If you want to change the default behavior of IIS, you will need to use startup tasks, because if you manually apply changes to the Web Role instances, the changes will eventually be lost.

For more information, see [How to configure and run startup tasks for a cloud service](cloud-services-startup-tasks.md).
