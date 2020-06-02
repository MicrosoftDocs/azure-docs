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

This article explains how to configure Microsoft Endpoint Configuration Manager to automatically apply updates to a Windows Virtual Desktop host running Windows 10 Enterprise multi-session.

## Prerequisites

To configure this setting, you'll need the following things:

- Make sure you've installed the Microsoft Endpoint Configuration Manager Agent on your virtual machines.
- Make sure your version of Microsoft Endpoint Configuration Manager is at least on branch level 1906. For best results, use branch level 1910 or higher.

## Configure the software update point

To receive updates for Windows 10 Enterprise multi-session, you need to enable Windows Server, version 1903 and later as a product within Microsoft Endpoint Configuration Manager. This product setting also applies if you use the Windows Server Update Service to deploy updates to your systems.

To receive updates:

1. Open Microsoft Endpoint Configuration Manager and go to your Primary Site Server Software Update Point.
2. Select **Configure Site Components**.
3. Select the **Products** tab.
4. Select the check box that says **Windows Server, version 1903 and later**.

## Create a Microsoft Endpoint Configuration Manager collection

To create a collection of Windows 10 Enterprise multi-session virtual machines, a query-based collection can be used to identify the specific operating system SKU.

To make a query:

1. Open the **Windows 10 Multi Session Query Statement Properties** window.
2. Select the **Criteria** tab and enter the following parameters:

```syntax
select
SMS_R_SYSTEM.ResourceID,SMS_R_SYSTEM.ResourceType,SMS_R_SYSTEM.Name,SMS_R_SYSTEM.SMSUniqueIdentifier,SMS_R_SYSTEM.ResourceDomainORWorkgroup,SMS_R_SYSTEM.Client
from SMS_R_System inner join SMS_G_System_OPERATING_SYSTEM on
SMS_G_System_OPERATING_SYSTEM.ResourceId = SMS_R_System.ResourceId where
SMS_G_System_OPERATING_SYSTEM.OperatingSystemSKU = 175
```