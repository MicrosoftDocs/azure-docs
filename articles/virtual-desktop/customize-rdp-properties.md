---
title: Customize RDP Properties with PowerShell - Azure
description: How to customize RDP Properties for Windows Virtual Desktop with PowerShell cmdlets.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 04/30/2020
ms.author: helohr
manager: lizross
---
# Customize Remote Desktop Protocol properties for a host pool

>[!IMPORTANT]
>This content applies to the Spring 2020 update with Azure Resource Manager Windows Virtual Desktop objects. If you're using the Windows Virtual Desktop Fall 2019 release without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/customize-rdp-properties-2019.md).
>
> The Windows Virtual Desktop Spring 2020 update is currently in public preview. This preview version is provided without a service level agreement, and we don't recommend using it for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Customizing a host pool's Remote Desktop Protocol (RDP) properties, such as multi-monitor experience and audio redirection, lets you deliver an optimal experience for your users based on their needs. You can customize RDP properties in Windows Virtual Desktop by either using the Azure portal or by using the *-CustomRdpProperty* parameter in the **Update-AzWvdHostPool** cmdlet.

See [supported RDP file settings](https://docs.microsoft.com/windows-server/remote/remote-desktop-services/clients/rdp-files?context=/azure/virtual-desktop/context/context) for a full list of supported properties and their default values.

## Prerequisites

Before you begin, follow the instructions in [Set up the Windows Virtual Desktop PowerShell module](powershell-module.md) to set up your PowerShell module and sign in to Azure.

## Default RDP properties

By default, published RDP files contain the following properties:

|RDP properties | Desktops | RemoteApps |
|---|---| --- |
| Multi-monitor mode | Enabled | N/A |
| Drive redirections enabled | Drives, clipboard, printers, COM ports, USB devices and smartcards| Drives, clipboard, and printers |
| Remote audio mode | Play locally | Play locally |

Any custom properties you define for the host pool will override these defaults.

## Configure RDP properties in the Azure portal

To configure RDP properties in the Azure portal:

1. Sign in to Azure at <https://portal.azure.com>.
2. Enter **windows virtual desktop** into the search bar.
3. Under Services, select **Windows Virtual Desktop**.
4. At the Windows Virtual Desktop page, select **host pools** in the menu on the left side of the screen.
5. Select **the name of the host pool** you want to update.
6. Select **Properties** in the menu on the left side of the screen.
7. Select **RDP settings** to start editing the RDP properties.
8. When you're done, select **Save** to save your changes.

If there's a setting you want to edit that you don't see in the RDP settings menu, you'll have to edit it manually by running cmdlets in PowerShell. The next sections will tell you how to edit custom RDP properties manually in PowerShell.

## Add or edit a single custom RDP property

To add or edit a single custom RDP property, run the following PowerShell cmdlet:

```powershell
Update-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> -CustomRdpProperty <property>
```

To check if the cmdlet you just ran updated the property, run this cmdlet:

```powershell
Get-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> | format-list Name, CustomRdpProperty

Name              : <hostpoolname>
CustomRdpProperty : <customRDPpropertystring>
```

For example, if you were checking for the "audiocapturemode" property on a host pool named 0301HP, you'd enter this cmdlet:

```powershell
Get-AzWvdHostPool -ResourceGroupName 0301rg -Name 0301hp | format-list Name, CustomRdpProperty

Name              : 0301HP
CustomRdpProperty : audiocapturemode:i:1;
```

## Add or edit multiple custom RDP properties

To add or edit multiple custom RDP properties, run the following PowerShell cmdlets by providing the custom RDP properties as a semicolon-separated string:

```powershell
$properties="<property1>;<property2>;<property3>" 
Update-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> -CustomRdpProperty $properties 
```

You can check to make sure the RDP property was added by running the following cmdlet:

```powershell
Get-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> | format-list Name, CustomRdpProperty 

Name              : <hostpoolname>
CustomRdpProperty : <customRDPpropertystring>
```

Based on our earlier cmdlet example, if you set up multiple RDP properties on the 0301HP host pool, your cmdlet would look like this:

```powershell
Get-AzWvdHostPool -ResourceGroupName 0301rg -Name 0301hp | format-list Name, CustomRdpProperty 

Name              : 0301HP 
CustomRdpProperty : audiocapturemode:i:1;audiomode:i:0;
```

## Reset all custom RDP properties

You can reset individual custom RDP properties to their default values by following the instructions in [Add or edit a single custom RDP property](#add-or-edit-a-single-custom-rdp-property), or you can reset all custom RDP properties for a host pool by running the following PowerShell cmdlet:

```powershell
Update-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> -CustomRdpProperty ""
```

To make sure you've successfully removed the setting, enter this cmdlet:

```powershell
Get-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> | format-list Name, CustomRdpProperty 

Name              : <hostpoolname> 
CustomRdpProperty : <CustomRDPpropertystring>
```

## Next steps

Now that you've customized the RDP properties for a given host pool, you can sign in to a Windows Virtual Desktop client to test them as part of a user session. These next how-to guides will tell you how to connect to a session using the client of your choice:

- [Connect with the Windows Desktop client](connect-windows-7-and-10.md)
- [Connect with the web client](connect-web.md)
- [Connect with the Android client](connect-android.md)
- [Connect with the macOS client](connect-macos.md)
- [Connect with the iOS client](connect-ios.md)