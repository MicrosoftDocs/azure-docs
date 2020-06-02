---
title: Configure Microsoft Endpoint Manager - Azure
description: How to configure Microsoft Endpoint Manager to deploy software updates to Windows 10 Enterprise multi-session on Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 06/02/2020
ms.author: helohr
manager: lizross
---
# Configure Microsoft Endpoint Manager

This article will tell you how to configure Microsoft Endpoint Configuration Manager to automatically apply updates to a Windows Virtual Desktop host running Windows 10 Enterprise multi-session.

## Prerequisites

-   MECM must be at least at 1906 Branch Level, preferred 1910 or higher.

-   MECM Agent must be installed on the virtual machines.

## Configuration of the MECM Software Update Point

Windows 10 Enterprise multi-session represents itself as Server Operating to MECM. To receive updates for Windows 10 Enterprise multi-session Windows Server, version 1903 and later needs to be enabled as a product within MECM.

To receive updates:

1. Open Microsoft Endpoint Configuration Manager and go to your Primary Site Server Software Update Point.
2. Select **Configure Site Components**.
3. Select the **Products** tab.
4. Select the check box that says **Windows Server, version 1903 and later**.

This product setting also applies if you use Windows Server Update Service (WSUS) to deploy updates to your systems.

## Create a MECM Collection for Windows 10 Enterprise multi-session

To create a collection of Windows 10 Enterprise multi-session Virtual Machines, a query-based collection can be used to identify the specific operating system SKU.

![](media/898968fd58cb25a4f822ac8c53cc61aa.png)

```
select
SMS_R_SYSTEM.ResourceID,SMS_R_SYSTEM.ResourceType,SMS_R_SYSTEM.Name,SMS_R_SYSTEM.SMSUniqueIdentifier,SMS_R_SYSTEM.ResourceDomainORWorkgroup,SMS_R_SYSTEM.Client
from SMS_R_System inner join SMS_G_System_OPERATING_SYSTEM on
SMS_G_System_OPERATING_SYSTEM.ResourceId = SMS_R_System.ResourceId where
SMS_G_System_OPERATING_SYSTEM.OperatingSystemSKU = 175
```