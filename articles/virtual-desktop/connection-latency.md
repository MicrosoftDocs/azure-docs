---
title: Windows Virtual Desktop user connection latency - Azure
description: Connection latency for Windows Virtual Desktop users.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 10/30/2019
ms.author: helohr
manager: lizross
---
# Determine user connection latency in Windows Virtual Desktop

Windows Virtual Desktop is globally available. Administrators can create virtual machines (VMs) in any Azure region they want. Connection latency will vary depending on the location of the users and the virtual machines. Windows Virtual Desktop services will continuously roll out to new geographies to improve latency. 
 
The [Windows Virtual Desktop Experience Estimator tool](https://azure.microsoft.com/services/virtual-desktop/assessment/) can help you determine the best location to optimize the latency of your VMs. We recommend you use the tool every two to three months to make sure the optimal location hasn't changed as Windows Virtual Desktop rolls out to new areas. 

## Azure Traffic Manager

Windows Virtual Desktop uses the Azure Traffic Manager, which checks the location of the user's DNS server to find the nearest Windows Virtual Desktop service instance. We recommend admins review the location of the user's DNS server before choosing the location for the VMs.

## Next steps

- To check the best location for optimal latency, see the [Windows Virtual Desktop Experience Estimator tool](https://azure.microsoft.com/services/virtual-desktop/assessment/).
- For pricing plans, see [Windows Virtual Desktop pricing](https://azure.microsoft.com/pricing/details/virtual-desktop/).
- To get started with your Windows Virtual Desktop deployment, check out [our tutorial](./virtual-desktop-fall-2019/tenant-setup-azure-active-directory.md).