---
title: Customize feed for Azure Virtual Desktop users - Azure
description: How to customize feed for Azure Virtual Desktop users with PowerShell cmdlets.
author: Heidilohr
ms.topic: how-to
ms.date: 08/16/2020
ms.author: helohr 
ms.custom: devx-track-azurepowershell
manager: femila
---
# Customize the feed for Azure Virtual Desktop users

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop with Azure Resource Manager Azure Virtual Desktop objects. If you're using Azure Virtual Desktop (classic) without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/customize-feed-virtual-desktop-users-2019.md).

You can customize the feed so the RemoteApp and remote desktop resources appear in a recognizable way for your users.

## Prerequisites

This article assumes you've already downloaded and installed the Azure Virtual Desktop PowerShell module. If you haven't, follow the instructions in [Set up the PowerShell module](powershell-module.md).

## Customize the display name for a session host

You can change the display name for a remote desktop for your users by setting its session host friendly name. By default, the session host friendly name is empty, so users only see the app name. You can set the session host friendly name using REST API.

>[!NOTE]
>The following instructions only apply to personal desktops, not pooled desktops. Also, personal host pools only allow and support desktop application groups.

To add or change a session host's friendly name, use the [Session Host - Update REST API](/rest/api/desktopvirtualization/session-hosts/update?tabs=HTTP) and update the *properties.friendlyName* parameter with a REST API request.

## Customize the display name for a RemoteApp

You can change the display name for a published RemoteApp by setting the friendly name. By default, the friendly name is the same as the name of the RemoteApp program.

To retrieve a list of published applications for an application group, run the following PowerShell cmdlet:

```powershell
Get-AzWvdApplication -ResourceGroupName <resourcegroupname> -ApplicationGroupName <appgroupname>
```

To assign a friendly name to a RemoteApp, run the following cmdlet with the required parameters:

```powershell
Update-AzWvdApplication -ResourceGroupName <resourcegroupname> -ApplicationGroupName <appgroupname> -Name <applicationname> -FriendlyName <newfriendlyname>
```

For example, let's say you retrieved the current applications with the following example cmdlet:

```powershell
Get-AzWvdApplication -ResourceGroupName 0301RG -ApplicationGroupName 0301RAG | format-list
```

The output would look like this:

```powershell
CommandLineArgument :
CommandLineSetting  : DoNotAllow
Description         :
FilePath            : C:\Program Files\Windows NT\Accessories\wordpad.exe
FriendlyName        : Microsoft Word
IconContent         : {0, 0, 1, 0…}
IconHash            : --iom0PS6XLu-EMMlHWVW3F7LLsNt63Zz2K10RE0_64
IconIndex           : 0
IconPath            : C:\Program Files\Windows NT\Accessories\wordpad.exe
Id                  : /subscriptions/<subid>/resourcegroups/0301RG/providers/Microsoft.DesktopVirtualization/applicationgroups/0301RAG/applications/Microsoft Word
Name                : 0301RAG/Microsoft Word
ShowInPortal        : False
Type                : Microsoft.DesktopVirtualization/applicationgroups/applications
```
To update the friendly name, run this cmdlet:

```powershell
Update-AzWvdApplication -GroupName 0301RAG -Name "Microsoft Word" -FriendlyName "WordUpdate" -ResourceGroupName 0301RG -IconIndex 0 -IconPath "C:\Program Files\Windows NT\Accessories\wordpad.exe" -ShowInPortal:$true -CommandLineSetting DoNotallow -FilePath "C:\Program Files\Windows NT\Accessories\wordpad.exe"
```

To confirm you've successfully updated the friendly name, run this cmdlet:

```powershell
Get-AzWvdApplication -ResourceGroupName 0301RG -ApplicationGroupName 0301RAG | format-list FriendlyName
```

The cmdlet should give you the following output:

```powershell
FriendlyName        : WordUpdate
```

## Customize the display name for a Remote Desktop

You can change the display name for a published remote desktop by setting a friendly name. If you manually created a host pool and desktop application group through PowerShell, the default friendly name is "Session Desktop." If you created a host pool and desktop application group through the GitHub Azure Resource Manager template or the Azure Marketplace offering, the default friendly name is the same as the host pool name.

To retrieve the remote desktop resource, run the following PowerShell cmdlet:

```powershell
Get-AzWvdDesktop -ResourceGroupName <resourcegroupname> -ApplicationGroupName <appgroupname> -Name <applicationname>
```

To assign a friendly name to the remote desktop resource, run the following PowerShell cmdlet:

```powershell
Update-AzWvdDesktop -ResourceGroupName <resourcegroupname> -ApplicationGroupName <appgroupname> -Name <applicationname> -FriendlyName <newfriendlyname>
```

## Customize a display name in the Azure portal

You can change the display name for a published remote desktop by setting a friendly name using the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Search for **Azure Virtual Desktop**.

3. Under Services, select **Azure Virtual Desktop**.

4. On the Azure Virtual Desktop page, select **Application groups** on the left side of the screen, then select the name of the application group you want to edit. (For example, if you want to edit the display name of the desktop application group, select the application group named **Desktop**.)

5. Select **Applications** in the menu on the left side of the screen.

6. Select the application you want to update, then enter a new **Display name**.

7. Select **Save**. The application you edited should now display the updated name.

## Next steps

Now that you've customized the feed for users, you can sign in to a Azure Virtual Desktop client to test it out. To do so, continue to the Connect to Azure Virtual Desktop How-tos:

 * [Connect with Windows](./users/connect-windows.md)
 * [Connect with the web client](./users/connect-web.md)
 * [Connect with the Android client](./users/connect-android-chrome-os.md)
 * [Connect with the iOS client](./users/connect-ios-ipados.md)
 * [Connect with the macOS client](./users/connect-macos.md)
