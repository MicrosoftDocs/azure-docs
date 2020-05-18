---
title: Customize feed for Windows Virtual Desktop users - Azure
description: How to customize feed for Windows Virtual Desktop users with PowerShell cmdlets.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 08/29/2019
ms.author: helohr
manager: lizross
---
# Customize feed for Windows Virtual Desktop users

>[!IMPORTANT]
>This content applies to the Spring 2020 update with Azure Resource Manager Windows Virtual Desktop objects. If you're using the Windows Virtual Desktop Fall 2019 release without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/customize-feed-virtual-desktop-users-2019.md).
>
> The Windows Virtual Desktop Spring 2020 update is currently in public preview. This preview version is provided without a service level agreement, and we don't recommend using it for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

You can customize the feed so the RemoteApp and remote desktop resources appear in a recognizable way for your users.

## Prerequisites

This article assumes you've already downloaded and installed the Windows Virtual Desktop PowerShell module. If you haven't, follow the instructions in [Set up the PowerShell module](powershell-module.md).

## Customize the display name for a RemoteApp

You can change the display name for a published RemoteApp by setting the friendly name. By default, the friendly name is the same as the name of the RemoteApp program.

To retrieve a list of published RemoteApps for an app group, run the following PowerShell cmdlet:

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

You can change the display name for a published remote desktop by setting a friendly name. If you manually created a host pool and desktop app group through PowerShell, the default friendly name is "Session Desktop." If you created a host pool and desktop app group through the GitHub Azure Resource Manager template or the Azure Marketplace offering, the default friendly name is the same as the host pool name.

To retrieve the remote desktop resource, run the following PowerShell cmdlet:

```powershell
Get-AzWvdDesktop -ResourceGroupName <resourcegroupname> -ApplicationGroupName <appgroupname> -Name <applicationname>
```

To assign a friendly name to the remote desktop resource, run the following PowerShell cmdlet:

```powershell
Update-AzWvdDesktop -ResourceGroupName <resourcegroupname> -ApplicationGroupName <appgroupname> -Name <applicationname> -FriendlyName <newfriendlyname>
```

## Customize a display name in Azure portal

You can change the display name for a published remote desktop by setting a friendly name using the Azure portal. 

1. Sign in to the Azure portal at <https://portal.azure.com>. 

2. Search for **Windows Virtual Desktop**.

3. Under Services, select **Windows Virtual Desktop**. 

4. On the Windows Virtual Desktop page, select **Application groups** on the left side of the screen, then select the name of the app group you want to edit. 

5. Select **Applications** in the menu on the left side of the screen.

6. Select the application you want to update, then enter a new **Display name**. 

7. Select **Save**. The application you edited should now display the updated name.

## Next steps

Now that you've customized the feed for users, you can sign in to a Windows Virtual Desktop client to test it out. To do so, continue to the Connect to Windows Virtual Desktop How-tos:
    
 * [Connect with Windows 10 or Windows 7](connect-windows-7-and-10.md)
 * [Connect with the web client](connect-web.md) 
 * [Connect with the Android client](connect-android.md)
 * [Connect with the iOS client](connect-ios.md)
 * [Connect with the macOS client](connect-macos.md)
