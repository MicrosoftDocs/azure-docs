---
title: Windows Virtual Desktop user connection latency - Azure
description: Connection latency for Windows Virtual Desktop users.
author: Heidilohr
ms.topic: conceptual
ms.date: 10/30/2019
ms.author: helohr
manager: lizross
---
# Determine user connection latency in Windows Virtual Desktop

Windows Virtual Desktop is globally available. Administrators can create virtual machines (VMs) in any Azure region they want. Connection latency will vary depending on the location of the users and the virtual machines. Windows Virtual Desktop services will continuously roll out to new geographies to improve latency.

The [Windows Virtual Desktop Experience Estimator tool](https://azure.microsoft.com/services/virtual-desktop/assessment/) can help you determine the best location to optimize the latency of your VMs. We recommend you use the tool every two to three months to make sure the optimal location hasn't changed as Windows Virtual Desktop rolls out to new areas.

## Interpreting results from the Windows Virtual Desktop Experience Estimator tool

In Windows Virtual Desktop, latency up to 150 ms shouldn’t impact user experience that doesnt' involve rendering or video. Latencies between 150 ms and 200 ms should be fine for text processing. Latency above 200 ms may impact user experience. 

In addition the user’s internet connection plays a large role in the WVD connection. If latency is over 200ms and user does not have stable internet connection, circuit is saturated and/or rate limited, has bad wireless connection, etc.. users may experience intermittent disconnects and input delay. 

We recommend customers place VM's as close to users as possible. For example if client is connecting from India and VM is in US it is expected there will be latency and user experience will be impacted. 

## Azure Front Door

Windows Virtual Desktop uses [Azure Front Door](https://azure.microsoft.com/en-us/services/frontdoor/) to redirect the users connection to the nearest WVD gateway based on source IP address. Windows Virtual Desktop will always use the WVD gateway chosen by the client.

## Next steps

- To check the best location for optimal latency, see the [Windows Virtual Desktop Experience Estimator tool](https://azure.microsoft.com/services/virtual-desktop/assessment/).
- For pricing plans, see [Windows Virtual Desktop pricing](https://azure.microsoft.com/pricing/details/virtual-desktop/).
- To get started with your Windows Virtual Desktop deployment, check out [our tutorial](./virtual-desktop-fall-2019/tenant-setup-azure-active-directory.md).
