---
title: Connect to Azure Virtual Desktop (classic) Windows 10 or 7 - Azure
description: How to connect to Azure Virtual Desktop (classic) using the Windows Desktop client.
author: Heidilohr
ms.topic: how-to
ms.date: 08/08/2022
ms.author: helohr
manager: femila
---
# Connect with the Windows Desktop (classic) client

> Applies to: Windows 10 and Windows 10 IoT Enterprise

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop (classic), which doesn't support Azure Resource Manager Azure Virtual Desktop objects. If you're trying to manage Azure Resource Manager Azure Virtual Desktop objects, see [this article](../users/connect-windows.md).

You can access Azure Virtual Desktop resources on devices with Windows 10, and Windows 10 IoT Enterprise using the Windows Desktop client. The client doesn't support Windows 8 or Windows 8.1.

>[!NOTE]
>The Windows client automatically defaults to Azure Virtual Desktop (classic). However, if the client detects that the user also has Azure Resource Manager resources, it automatically adds the resources or notifies the user that they are available.

> [!IMPORTANT]
> - Azure Virtual Desktop doesn't support the RemoteApp and Desktop Connections (RADC) client or the Remote Desktop Connection (MSTSC) client.
>
> - Azure Virtual Desktop doesn't currently support the Remote Desktop client from the Windows Store.

## Install the Windows Desktop client

Choose the client that matches your version of Windows:

- [Windows 64-bit](https://go.microsoft.com/fwlink/?linkid=2068602)
- [Windows 32-bit](https://go.microsoft.com/fwlink/?linkid=2098960)
- [Windows ARM64](https://go.microsoft.com/fwlink/?linkid=2098961)

You can install the client for the current user, which doesn't require admin rights, or your admin can install and configure the client so that all users on the device can access it.

Once installed, the client can be launched from the Start menu by searching for **Remote Desktop**.

## Subscribe to a Workspace

There are two ways you can subscribe to a Workspace. The client can try to discover the resources available to you from your work or school account or you can directly specify the URL where your resources are for cases where the client is unable to find them. Once you've subscribed to a Workspace, you can launch resources with one of the following methods:

- Go to the Connection Center and double-click a resource to launch it.
- You can also go to the Start menu and look for a folder with the Workspace name or enter the resource name in the search bar.

### Subscribe with a user account

1. From the main page of the client, select **Subscribe**.
2. Sign in with your user account when prompted.
3. The resources will appear in the Connection Center, and are grouped by workspace.

### Subscribe with a URL

1. From the main page of the client, select **Subscribe with URL**.
2. Enter the Workspace URL or your email address:
   - If you use the **Workspace URL**, use the one your admin gave you. If accessing resources from Azure Virtual Desktop, you can use one of the following URLs:
     - Azure Virtual Desktop (classic): `https://rdweb.wvd.microsoft.com/api/feeddiscovery/webfeeddiscovery.aspx`
     - Azure Virtual Desktop: `https://rdweb.wvd.microsoft.com/api/arm/feeddiscovery`
   - If you're using the **Email** field instead, enter your email address. This tells the client to search for a URL associated with your email address if your admin has set up [email discovery](/windows-server/remote/remote-desktop-services/rds-email-discovery).
3. Select **Next**.
4. Sign in with your user account when prompted.
5. The resources should appear in the Connection Center, grouped by workspace.

## Next steps

To learn more about how to use the Windows Desktop client, check out [Get started with the Windows Desktop client](/windows-server/remote/remote-desktop-services/clients/windowsdesktop/).
