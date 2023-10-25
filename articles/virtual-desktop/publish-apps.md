---
title: Publish built-in apps in Azure Virtual Desktop - Azure
description: How to publish built-in apps in Azure Virtual Desktop.
author: Heidilohr
ms.topic: how-to
ms.date: 05/25/2023
ms.author: helohr 
ms.custom: devx-track-azurepowershell
manager: femila
---
# Publish built-in apps in Azure Virtual Desktop

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop with Azure Resource Manager Azure Virtual Desktop objects. If you're using Azure Virtual Desktop (classic) without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/publish-apps-2019.md).

This article will tell you how to publish apps in your Azure Virtual Desktop environment.

## Publish built-in apps

To publish a built-in app:

1. Connect to one of the virtual machines in your host pool.
2. Get the **PackageFamilyName** of the app you want to publish by following the instructions in [this article](/powershell/module/appx/get-appxpackage).
3. Finally, run the following cmdlet with `<PackageFamilyName>` replaced by the **PackageFamilyName** you found in the previous step:

   ```powershell
   $parameters = @{
       Name = '<ApplicationName>'
       ResourceGroupName = '<ResourceGroupName>'
       ApplicationGroupName = '<ApplicationGroupName>'
       FilePath = 'shell:appsFolder\<PackageFamilyName>!App'
       CommandLineSetting = '<Allow|Require|DoNotAllow>'
       IconIndex = '0'
       IconPath = '<IconPath>'
       ShowInPortal = $true
    }

   New-AzWvdApplication @parameters
   ```

>[!NOTE]
> Azure Virtual Desktop only supports publishing apps with install locations that begin with `C:\Program Files\WindowsApps`.

## Publish Microsoft Edge

To publish Microsoft Edge with the default homepage, run this cmdlet:

```powershell
$parameters = @{
    Name = '<ApplicationName>'
    ResourceGroupName = '<ResourceGroupName>'
    ApplicationGroupName = '<ApplicationGroupName>'
    FilePath = 'shell:Appsfolder\Microsoft.MicrosoftEdge_8wekyb3d8bbwe!MicrosoftEdge'
    CommandLineSetting = '<Allow|Require|DoNotAllow>'
    IconIndex = '0'
    IconPath = 'C:\Windows\SystemApps\Microsoft.MicrosoftEdge_8wekyb3d8bbwe\microsoftedge'
    ShowInPortal = $true
}

New-AzWvdApplication @parameters
```

## Next steps

- Learn about how to configure feeds to organize how apps are displayed for users at [Customize feed for Azure Virtual Desktop users](customize-feed-for-virtual-desktop-users.md).
- Learn about the MSIX app attach feature at [Set up MSIX app attach](app-attach.md).

