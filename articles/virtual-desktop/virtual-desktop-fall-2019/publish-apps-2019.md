---
title: Publish built-in apps in Azure Virtual Desktop (classic) - Azure
description: How to publish built-in apps in Azure Virtual Desktop (classic).
author: Heidilohr
ms.topic: how-to
ms.date: 03/30/2020
ms.author: helohr
manager: femila
---
# Publish built-in apps in Azure Virtual Desktop (classic)

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop (classic), which doesn't support Azure Resource Manager Azure Virtual Desktop objects. If you're trying to manage Azure Resource Manager Azure Virtual Desktop objects, see [this article](../publish-apps.md).

This article will tell you how to publish apps in your Azure Virtual Desktop environment.

## Publish built-in apps

To publish a built-in app:

1. Connect to one of the virtual machines in your host pool.
2. Get the **PackageFamilyName** of the app you want to publish by following the instructions in [this article](/powershell/module/appx/get-appxpackage).
3. Finally, run the following cmdlet with `<PackageFamilyName>` replaced by the **PackageFamilyName** you found in the previous step:

   ```powershell
   New-RdsRemoteApp <tenantname> <hostpoolname> <appgroupname> -Name <remoteappname> -FriendlyName <RemoteAppName> -FilePath "shell:appsFolder\<PackageFamilyName>!App"
   ```

>[!NOTE]
> Azure Virtual Desktop only supports publishing apps with install locations that begin with `C:\Program Files\Windows Apps`.

## Update app icons

After you publish an app, it will have the default Windows app icon instead of its regular icon picture. To change the icon to its regular icon, put the image of the icon you want on a network share. Supported image formats are PNG, BMP, GIF, JPG, JPEG, and ICO.

## Publish Microsoft Edge

The process you use to publish Microsoft Edge is a little different from the publishing process for other apps. To publish Microsoft Edge with the default homepage, run this cmdlet:

```powershell
New-RdsRemoteApp <tenantname> <hostpoolname> <appgroupname> -Name <RemoteAppName> -FriendlyName <RemoteAppName> -FilePath "shell:Appsfolder\Microsoft.MicrosoftEdge_8wekyb3d8bbwe!MicrosoftEdge"
```

## Next steps

- Learn about how to configure feeds to organize how apps are displayed for users at [Customize feed for Azure Virtual Desktop users](customize-feed-virtual-desktop-users-2019.md).
- Learn about the MSIX app attach feature at [Set up MSIX app attach](../app-attach.md).

