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

The client doesn't support Window 8 or Windows 8.1.

> [!IMPORTANT]
> This only applies to Windows Virtual Desktop with Azure Resource Manager objects. If you're using Windows Virtual Desktop (classic) without Azure Resource Manager objects, see [Connect with Windows Desktop (classic) client](./virtual-desktop-fall-2019/connect-windows-7-10-2019.md).

## Install the Windows Desktop client

Dowload the client based on your version of Windows:

- [Windows 64-bit](https://go.microsoft.com/fwlink/?linkid=2068602)
- [Windows 32-bit](https://go.microsoft.com/fwlink/?linkid=2098960)
- [Windows ARM64](https://go.microsoft.com/fwlink/?linkid=2098961)

During installation, select **Install just for you** or **Install for all users of this machine** (requires admin rights) dependent on who needs access.

After installation, to launch the client, use the **Start** menu and search for **Remote Desktop**.

> [!IMPORTANT]
> The Windows Virtual Desktop does not support the RemoteApp and Desktop Connections (RADC) client or the Remote Desktop Connection (MSTSC) client.

## Subscribe to a Workspace

There are two ways you can subscribe to a Workspace,

- Use your work or school account to have the client automatically discover the resources available to you.
- Use the specific URL of your resources, if already known or in case the client is unable to find them. 

Once subscribed to a Workspace, to launch a resource, go to the **Connection Center** and double-click athe resource.

> [!TIP]
> You can also launch resources from the **Start** menu. Either look for a folder with the Workspace name, or enter the resource name in the search bar.

### Use a user account

1. From the client's main page, select **Subscribe**.
1. Sign in with your user account when prompted and the resources, grouped by workspace, will appear in the **Connection Center**.

> [!NOTE]
> The Windows client automatically defaults to Windows Virtual Desktop (classic). However, if the client detects that the user also has Azure Resource Manager resources, it automatically adds the resources or notifies the user that they are available.

### Use a specific URL

1. From the client's main page, select **Subscribe with URL**.
1. Either enter the *Workspace UR*L or your *email address*:
   - For **Workspace URL**, use the URL provided by your admin.
   - For **Email**, use your email address. The client will find the URL associated with your email, provided your admin has enabled [email discovery](/windows-server/remote/remote-desktop-services/rds-email-discovery).
1. Select **Next**.
1. Sign in with your user account when prompted and the resources, grouped by workspace, will appear in the **Connection Center**.

> [!NOTE
> To access resources from Windows Virtual Desktop, use the following URLs:
> - Windows Virtual Desktop (classic), `https://rdweb.wvd.microsoft.com/api/feeddiscovery/webfeeddiscovery.aspx`
> - Windows Virtual Desktop, `https://rdweb.wvd.microsoft.com/api/arm/feeddiscovery`
> - Windows Virtual Desktop (US Gov), `https://rdweb.wvd.azure.us/api/arm/feeddiscovery`

## Next steps

To learn more about how to use the Windows Desktop client, check out [Get started with the Windows Desktop client](/windows-server/remote/remote-desktop-services/clients/windowsdesktop/).

If you're an admin who's interested in learning more in-depth information about how to use Windows Desktop, check out [Windows Desktop client for admins](/windows-server/remote/remote-desktop-services/clients/windowsdesktop-admin).
