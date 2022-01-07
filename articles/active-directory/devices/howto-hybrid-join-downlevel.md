---
title: Enable downlevel devices to hybrid Azure AD join
description: 

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: tutorial
ms.date: 01/05/2022

ms.author: joflore
author: MicrosoftGuyJFlo
manager: karenhoran
ms.reviewer: sandeo

ms.collection: M365-identity-device-management
---
# Enable older operating systems

If some of your domain-joined devices are Windows downlevel devices, you must:

- Configure the local intranet settings for device registration
- Install Microsoft Workplace Join for Windows downlevel computers

> [!NOTE]
> Windows 7 support ended on January 14, 2020. For more information, [Support for Windows 7 has ended](https://support.microsoft.com/en-us/help/4057281/windows-7-support-ended-on-january-14-2020).

## Configure the local intranet settings for device registration

To complete hybrid Azure AD join of your Windows downlevel devices, and avoid certificate prompts when devices authenticate to Azure AD, you can push a policy to your domain-joined devices to add the following URLs to the local intranet zone in Internet Explorer:

- `https://device.login.microsoftonline.com`
- `https://autologon.microsoftazuread-sso.com` (For seamless SSO)
- Your organization's STS (**For federated domains**)

You also must enable **Allow updates to status bar via script** in the user’s local intranet zone.

## Install Microsoft Workplace Join for Windows downlevel computers

To register Windows downlevel devices, organizations must install [Microsoft Workplace Join for non-Windows 10 computers](https://www.microsoft.com/download/details.aspx?id=53554). Microsoft Workplace Join for non-Windows 10 computers is available in the Microsoft Download Center.

You can deploy the package by using a software distribution system like [Microsoft Endpoint Configuration Manager](/configmgr/). The package supports the standard silent installation options with the `quiet` parameter. The current branch of Configuration Manager offers benefits over earlier versions, like the ability to track completed registrations.

The installer creates a scheduled task on the system that runs in the user context. The task is triggered when the user signs in to Windows. The task silently joins the device with Azure AD by using the user credentials after it authenticates with Azure AD.

## Next steps

- [Hybrid Azure AD join verification](howto-hybrid-join-verify.md)
