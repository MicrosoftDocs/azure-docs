---
title: Windows 7 virtual machines Windows Virtual Desktop - Azure
description: How to resolve issues for Windows 7 virtual machines (VMs) in a Windows Virtual Desktop environment.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: troubleshooting
ms.date: 03/30/2020
ms.author: helohr
manager: lizross
---
# Troubleshoot Windows 7 virtual machines in Windows Virtual Desktop

>[!IMPORTANT]
>This content applies to the Fall 2019 release that doesn't support Azure Resource Manager Windows Virtual Desktop objects.

Use this article to troubleshoot issues you're having when configuring the Windows Virtual Desktop session host virtual machines (VMs).

## Known issues

Windows 7 on Windows Virtual Desktops doesn't support the following features:

- Virtualized applications (RemoteApps)
- Time zone redirection
- Automatic DPI scaling

Windows Virtual Desktop can only virtualize full desktops for Windows 7.

While Automatic DPI scaling isn't supported, you can manually change the resolution on your virtual machine by right-clicking the icon in the Remote Desktop client and selecting **Resolution**.

## Error: Can't access the Remote Desktop User group

If Windows Virtual Desktop can't find you or your users' credentials in the Remote Desktop User group, you may see one of the following error messages:

- "This user is not a member of the Remote Desktop User group"
- "You must be granted permissions to sign in through Remote Desktop Services"

To fix this error, add the user to the Remote Desktop User group:

1. Open the Azure portal.
2. Select the virtual machine you saw the error message on.
3. Select **Run a command**.
4. Run the following command with `<username>` replaced by the name of the user you want to add:
   
   ```cmd
   net localgroup "Remote Desktop Users" <username> /add
   ```