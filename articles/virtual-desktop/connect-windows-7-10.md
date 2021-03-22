---
title: Connect to Windows Virtual Desktop Windows 10 or 7 - Azure
description: How to connect to Windows Virtual Desktop using the Windows Desktop client.
author: Heidilohr
ms.topic: how-to
ms.date: 09/22/2020
ms.author: helohr
manager: lizross
ms.custom: template-how-to
---

# Connect with the Windows Desktop client

You can access Windows Virtual Desktop resources on devices with Windows 10, Windows 10 IoT Enterprise, and  Windows 7 using the Windows Desktop client. 

> [!IMPORTANT]
> This does not support Window 8 or Windows 8.1.
> 
> This only supports Azure Resource Manager objects, to support objects without Azure Resource Manager, see [Connect with Windows Desktop (classic) client](./virtual-desktop-fall-2019/connect-windows-7-10-2019.md).
> 
> This does not support the RemoteApp and Desktop Connections (RADC) client or the Remote Desktop Connection (MSTSC) client.

## Install the Windows Desktop client

Download the client based on your Windows version:

- [Windows 64-bit](https://go.microsoft.com/fwlink/?linkid=2068602)
- [Windows 32-bit](https://go.microsoft.com/fwlink/?linkid=2098960)
- [Windows ARM64](https://go.microsoft.com/fwlink/?linkid=2098961)

During installation to determine access, select either:

- **Install just for you**
- **Install for all users of this machine** (requires admin rights)

To launch the client after installation, use the **Start** menu and search for **Remote Desktop**.

## Subscribe to a Workspace

To subscribe to a Workspace, choose to either:

- Use a work or school account and have the client discover the resources available for you
- Use the specific URL of the resource

To launch the resource once subscribed, go to the **Connection Center** and double-click the resource.

> [!TIP]
> To launch a resource from the **Start** menu, you can find the folder with the Workspace name or enter the resource name in the search bar.

### Use a user account

1. Select **Subscribe** from the main page.
1. Sign in with your user account when prompted.

The resources grouped by workspace will appear in the **Connection Center**.

   > [!NOTE]
   > The Windows client automatically defaults to Windows Virtual Desktop (classic). 
   > 
   > However, if the client detects additional Azure Resource Manager resources, it adds them automatically or notifies the user that they're available.

### Use a specific URL

1. Select **Subscribe with URL** from the main page.
1. Enter either the *Workspace URL* or an *email address*:
   - For **Workspace URL**, use the URL provided by your admin.
      |Available Resources|URL|
      |-|-|
      |Windows Virtual Desktop (classic)|`https://rdweb.wvd.microsoft.com/api/feeddiscovery/webfeeddiscovery.aspx`|
      |Windows Virtual Desktop|`https://rdweb.wvd.microsoft.com/api/arm/feeddiscovery`|
      |Windows Virtual Desktop (US Gov)|`https://rdweb.wvd.azure.us/api/arm/feeddiscovery`|
   - For **Email**, use your email address. 
      The client will find the URL associated with your email, provided your admin has enabled [email discovery](/windows-server/remote/remote-desktop-services/rds-email-discovery).
1. Select **Next**.
1. Sign in with your user account when prompted.

The resources grouped by workspace will appear in the **Connection Center**.

## Next steps

To learn more about how to use the client, check out [Get started with the Windows Desktop client](/windows-server/remote/remote-desktop-services/clients/windowsdesktop/).

If you're an admin interested in learning more about the client's features, check out [Windows Desktop client for admins](/windows-server/remote/remote-desktop-services/clients/windowsdesktop-admin).
