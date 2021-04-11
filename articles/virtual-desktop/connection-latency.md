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

In Windows Virtual Desktop, latency up to 150 ms shouldn’t impact user experience that doesn't involve rendering or video. Latencies between 150 ms and 200 ms should be fine for text processing. Latency above 200 ms may impact user experience. 

In addition, the Windows Virtual Desktop connection depends on the internet connection of the machine the user is using the service from. Users may lose connection or experience input delay in one of the following situations:

 - The user doesn't have a stable local internet connection and the latency is over 200 ms.
 - The network is saturated or rate-limited.

We recommend you choose VMs locations that are as close to your users as possible. For example, if the user is located in India but the VM is in the United States, there will be latency that will affect the overall user experience. 

## Azure Front Door

Windows Virtual Desktop uses [Azure Front Door](https://azure.microsoft.com/services/frontdoor/) to redirect the user connection to the nearest Windows Virtual Desktop gateway based on the source IP address. Windows Virtual Desktop will always use the Windows Virtual Desktop gateway that the client chooses.

## Next steps

- To check the best location for optimal latency, see the [Windows Virtual Desktop Experience Estimator tool](https://azure.microsoft.com/services/virtual-desktop/assessment/).
- For pricing plans, see [Windows Virtual Desktop pricing](https://azure.microsoft.com/pricing/details/virtual-desktop/).
- To get started with your Windows Virtual Desktop deployment, check out [our tutorial](https://docs.microsoft.com/azure/virtual-desktop/create-host-pools-azure-marketplace).
