---
title: Customize RDP properties - Azure
description: How to customize RDP Properties for Azure Virtual Desktop.
author: Heidilohr
ms.topic: how-to
ms.date: 07/26/2022
ms.author: helohr 
ms.custom: devx-track-azurepowershell
manager: femila
---
# Customize Remote Desktop Protocol (RDP) properties for a host pool

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop with Azure Resource Manager Azure Virtual Desktop objects. If you're using Azure Virtual Desktop (classic) without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/customize-rdp-properties-2019.md).

You can customize a host pool's Remote Desktop Protocol (RDP) properties, such as multi-monitor experience and audio redirection, to deliver an optimal experience for your users based on their needs. If you'd like to change the default RDP file properties, you can customize RDP properties in Azure Virtual Desktop by either using the Azure portal or by using the `-CustomRdpProperty` parameter in the `Update-AzWvdHostPool` cmdlet.

See [Supported RDP properties with Azure Virtual Desktop](rdp-properties.md) for a full list of supported properties and their default values.

## Default RDP file properties

RDP files have the following properties by default:

|RDP property|For both Desktop and RemoteApp|
|---|---|
|Multi-monitor mode|Enabled|
|Redirections enabled|Drives, clipboard, printers, COM ports, smart cards, devices, usbdevicestore, and WebAuthn|
|Remote audio mode|Play locally|
|VideoPlayback|Enabled|
|EnableCredssp|Enabled|

>[!IMPORTANT]
>- Multi-monitor mode is only enabled for Desktop application groups and will be ignored for RemoteApp application groups.
>
>- All default RDP file properties are exposed in the Azure Portal.
>
>- A null CustomRdpProperty field will apply all default RDP properties to your host pool. An empty CustomRdpProperty field won't apply any default RDP properties to your host pool.
>
>- If you also configure device redirection settings using Group Policy objects (GPOs), the settings in the GPOs will override the RDP properties you specify on the host pool.

## Prerequisites

Before you begin, follow the instructions in [Set up the Azure Virtual Desktop PowerShell module](powershell-module.md) to set up your PowerShell module and sign in to Azure.

## Configure RDP properties in the Azure portal

To configure RDP properties in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Enter **Azure Virtual Desktop** into the search bar.
3. Under Services, select **Azure Virtual Desktop**.
4. At the Azure Virtual Desktop page, select **host pools** in the menu on the left side of the screen.
5. Select **the name of the host pool** you want to update.
6. Select **RDP Properties** in the menu on the left side of the screen.
7. Set the property you want.
   - Alternatively, you can open the **Advanced** tab and add your RDP properties in a semicolon-separated format like the PowerShell examples in the following sections.
8. When you're done, select **Save** to save your changes.

The next sections will tell you how to edit custom RDP properties manually in PowerShell.

## Add or edit a single custom RDP property

To add or edit a single custom RDP property, run the following PowerShell cmdlet:

```powershell
Update-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> -CustomRdpProperty <property>
```

>[!NOTE]
>The Azure Virtual Desktop service doesn't accept escape characters, such as semicolons or colons, as valid custom RDP property names.

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

>[!NOTE]
>The Azure Virtual Desktop service doesn't accept escape characters, such as semicolons or colons, as valid custom RDP property names.

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

You can reset individual custom RDP properties to their default values by following the instructions in [Add or edit a single custom RDP property](#add-or-edit-a-single-custom-rdp-property). You can also reset all custom RDP properties for a host pool by running the following PowerShell cmdlet:

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

Now that you've customized the RDP properties for a given host pool, you can sign in to an Azure Virtual Desktop client to test them as part of a user session. These next how-to guides will tell you how to connect to a session using the client of your choice:

- [Connect with the Windows Desktop client](./users/connect-windows.md)
- [Connect with the web client](./users/connect-web.md)
- [Connect with the Android client](./users/connect-android-chrome-os.md)
- [Connect with the macOS client](./users/connect-macos.md)
- [Connect with the iOS client](./users/connect-ios-ipados.md)
