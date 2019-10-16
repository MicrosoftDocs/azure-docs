---
title: Publish apps in Windows Virtual Desktop - Azure
description: How to publish modern apps in Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 10/16/2019
ms.author: helohr
---
# Publish apps in Windows Virtual Desktop

This article will tell you how to publish applications in your Windows Virtual Desktop environment.

## Publish built-in apps

To publish a built-in app:

1. Connect to one of the virtual machines in your host pool.
2. Get the **PackageFamilyName** of the app you want to publish by following the instructions in [this article](https://docs.microsoft.com/powershell/module/appx/get-appxpackage?view=win10-ps).
3. Finally, run this cmdlet with `<PackageFamilyName>` replaced by the **PackageFamilyName** you found in the previous step:
   
   ```powershell
   New-RdsRemoteApp $tenant1 $pool1 $appgroup1 -Name $remoteapp3 -FriendlyName $remoteapp3 -FilePath "shell:appsFolder\<PackageFamilyName>!App"
   ```

>[!NOTE]
> Windows Virtual Desktop only supports publishing apps with install locations that begin with `C:\Program Files\Windows Apps`.

## Update app icons

After you publish an app, it'll have the default icon instead of its regular icon picture. To correct this, run the following cmdlet to get the **InstallLocation**.

```powershell
Get-AppxPackage *Appname*
```

After that, run the following cmdlet to find the **Executable** for the InstallLocation:

```powershell
explorer.exe “<InstallLocation>”
```

Once you have the information on hand, go to your assets and find the file path for the image you want to use. Supported image formats are PNG, BMP, GIF, JPG, JPEG and ICO.

Finally, run the following cmdlet with `<InstallLocation>` and `<Executable>` replaced with the relevant values:

```powershell
Set-RdsRemoteApp $tenant1 $pool1 $appgroup1 -Name $remoteapp3 -FriendlyName $remoteapp3 -IconPath "<InstallLocation>\<Executable>" -IconIndex 0
```

## Publish Microsoft Edge

The process to publish Microsoft Edge is a little different from the standard apps. To publish Microsoft Edge with the default homepage, run this cmdlet:

```powershell
New-RdsRemoteApp $tenant1 $pool1 $appgroup1 -Name $remoteapp3 -FriendlyName $remoteapp3 -FilePath "shell:Appsfolder\Microsoft.MicrosoftEdge_8wekyb3d8bbwe!MicrosoftEdge" 
```



