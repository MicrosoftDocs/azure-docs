---
title: Customize RDP Properties with PowerShell  - Azure
description: How to customize RDP Properties for Windows Virtual Desktop with PowerShell cmdlets.
services: virtual-desktop
author: v-hevem

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 06/03/2019
ms.author: v-hevem
---
# Customize Remote Desktop Protocol properties for a host pool

Customizing a host pool's Remote Desktop Protocol (RDP) properties, such as multi-monitor experience and audio redirection, lets you deliver an optimal experience for your users based on their needs. You can customize RDP properties in Windows Virtual Desktop using the **-CustomRdpProperty** parameter in the **Set-RdsHostPool** cmdlet.

See [Remote Desktop RDP file settings](https://docs.microsoft.com/windows-server/remote/remote-desktop-services/clients/rdp-files) for a full list of supported properties and their default values.

First, [download and import the Windows Virtual Desktop PowerShell module](https://docs.microsoft.com/powershell/windows-virtual-desktop/overview) to use in your PowerShell session if you haven't already.

## Add or edit a single custom RDP property

To add or edit a single custom RDP property, run the following PowerShell cmdlet:

```powershell
Set-RdsHostPool -TenantName <tenantname> -Name <hostpoolname> -CustomRdpProperty "<property>"
```
![A screenshot of PowerShell cmdlet Get-RDSRemoteApp with Name and FriendlyName highlighted.](media/singlecustomrdpproperty.png)

## Add or edit multiple custom RDP properties

To add or edit multiple custom RDP properties, run the following PowerShell cmdlets by providing the custom RDP properties as a semicolon-separated string:

```powershell
$properties="<property1>;<property2>;<property3>"
Set-RdsHostPool -TenantName <tenantname> -Name <hostpoolname> -CustomRdpProperty $properties
```
![A screenshot of PowerShell cmdlet Get-RDSRemoteApp with Name and FriendlyName highlighted.](media/multiplecustomrdpproperty.png)

## Reset all custom RDP properties

You can reset individual custom RDP properties to their default values by following the instructions in [Add or edit a single custom RDP property](#add-or-edit-a-single-custom-rdp-property), or you can reset all custom RDP properties for a host pool by running the following PowerShell cmdlet:

```powershell
Set-RdsHostPool -TenantName <tenantname> -Name <hostpoolname> -CustomRdpProperty ""
```
![A screenshot of PowerShell cmdlet Get-RDSRemoteApp with Name and FriendlyName highlighted.](media/resetcustomrdpproperty.png)

## Next steps

Now that you've customized the RDP properties for a given host pool, you can sign in to a Windows Virtual Desktop client to test them as part of a user session. To do so, continue to the Connect to Windows Virtual Desktop How-tos:

- [Connect from Windows 10 and Windows 7](connect-windows-7-and-10.md)
- [Connect from a web browser](connect-web.md)
