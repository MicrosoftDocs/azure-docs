---
title:
description:
author:
ms.author:
manager: CelesteDG
ms.date: 12/07/2022
ms.topic: reference
ms.subservice: develop
ms.custom: aaddev
ms.service: active-directory
ms.reviewer:
---

# Revised limits of the `RequiredResourceAccess` collection (RRA)

The `RequiredResourceAccess` collection (RRA) on an application object contains all the configured API permissions that an app requires for its default consent request. This collection has various limits depending on which types of identities the app supports, For more information on the limits for supported account types, see [Validation differences by supported account types](supported-accounts-validation.md).

The limit on maximum permissions was updated in May 2022, so some apps may have more permissions in their RRA than are now allowed. For such apps, no new permissions may be added until the number of permissions in the `RequiredResourceAccess` collection is brought under the limits.

This document offers additional information and troubleshooting steps to resolve this issue.

## Identifying when an app has exceeded the `RequiredResourceAccess` limits

In general, applications with more than 400 permissions have exceeded the configuration limits. An app that has exceeded the permission limits will receive the following error when trying to add more permissions in the Azure portal: 

> `Failed to save permissions for <AppName>. This configuration exceeds the global application object limit. Remove some items and retry your request.`

## Resolution steps

If the application isn't needed anymore, the first option you should consider is to delete the app registration entirely. (You can restore recently deleted applications, in case you discover soon afterwards that it was still needed.)

If you still need the application or are unsure, the following steps will help you resolve this issue:

1. **Remove duplicate permissions.** In some cases, the same permission is listed multiple times. Review the required permissions and remove permissions that are listed two or more times. Learn more
2. **Remove unused permissions.** Review the permissions required by the application and compare them to what the application or service does. Remove permissions that are configured in the app registration, but which the application or services doesn’t require. Learn more
3. **Remove redundant permissions.** In many APIs, including Microsoft Graph, some permissions aren't necessary when other more privileged permissions are included. For example, the Microsoft Graph permission User.Read.All (read all users) isn't needed when an application also has User.ReadWrite.All (read, create and update all users). Learn more about Microsoft Graph permissions. 
4. **Use multiple app registrations.** If a single app or service requires more than 400 permissions in the required permissions list, the app will need to be configured to use two (or more) different app registrations, each one with 400 or fewer permissions configured on the app registration. Learn more

## Frequently asked questions (FAQ)

### *Why did Microsoft revise the limit on total permissions?*

This limit is important for two reasons:

1. To help prevent an app from being configured to require more permissions than can be granted during consent.
2. To keep the total size of the app registration within the limits required for stability and performance of the underlying storage platform.

### *What will happen if I don’t do anything?*

If your app exceeds the total permissions limit, you'll no longer be able to increase the total number of required permissions for your application.

### *Does the limit change how many permissions my application can be granted?*

No. This limit affects only the list of requested API permissions configured on the app registration. This is different from the list of permissions that have been granted to your application. [Learn more]()

Even if it isn't listed in the required API permissions list, a delegated permission can still be requested dynamically by an application. Both delegated permissions and app roles (application permissions) can also be granted directly, using Microsoft Graph API or Microsoft Graph PowerShell.  

### *Can the limit be raised for my application?*

No, the limit can't be raised. 

### *Are there other limits on the list of required API permissions?*

Yes. The limits can vary depending on the supported account types for the app. Apps that support personal Microsoft Accounts for sign-in (for example, Outlook.com, Hotmail.com, Xbox Live) generally have lower limits. See [Validation differences by supported account types](supported-accounts-validation.md) to learn more.

## Additional resources

The PowerShell script below can be used to remove any duplicate permissions from your app registrations.

```PowerShell
<#
.SYNOPSIS
    Remove duplicate required API permissions from an app registration's required API permission list.
.DESCRIPTION
    This script ensures all API permissions listed in a Microsoft identity platform's app registration are only listed once,
    removing any duplicates it finds. This script requires the Microsoft.Graph.Applications PowerShell module.
.EXAMPLE
     Get-MgApplication -Filter "appId eq '46c22aca-bcdd-467d-a837-bd544c09b8b4'" | .\Deduplicate_RequiredResourceAccess.ps1"
.EXAMPLE
     $apps = Get-MgApplication -Filter "startswith(displayName,'Test_app')"
     $apps | .\Deduplicate_RequiredResourceAccess.ps1
#>

#Requires -Modules Microsoft.Graph.Applications

[CmdletBinding()]
param(
    [Parameter(ValueFromPipeline = $true)]
    $App
)

begin {
    $context = Get-MgContext
    if (-not $context) {
        throw ("You must connect to Microsoft Graph PowerShell first, with sufficient permissions " +
               "to manage Application objects. For example: Connect-MgGraph -Scopes ""Application.ReadWrite.All""")
    }
}

process {
    
    # Build the unique list of required API permissions for each required API
    $originalCount = 0
    $tempRras = @{}
    foreach ($rra in $App.RequiredResourceAccess) {
        if (-not $tempRras.ContainsKey($rra.ResourceAppId)) {
            $tempRras[$rra.ResourceAppId] = @{"Scope" = @{}; "Role" = @{}};
        }
        foreach ($ra in $rra.ResourceAccess) {
            if ($tempRras[$rra.ResourceAppId][$ra.Type].ContainsKey($ra.Id)) {
                # Skip duplicate required API permission
            } else {
                $tempRras[$rra.ResourceAppId][$ra.Type][$ra.Id] = $true
            }
            $originalCount++
        }
    }
    
    # Now that we have the unique set of required API permissions, iterate over all the keys to build the final requiredResourceAccess structure
    $deduplicatedCount = 0
    $finalRras = @($tempRras.Keys) | ForEach-Object {
        $resourceAppId = $_
        @{
            "resourceAppId" = $resourceAppId
            "resourceAccess" = @(@("Scope", "Role") | ForEach-Object { 
                $type = $_
                $tempRras[$resourceAppId][$type].Keys | ForEach-Object { 
                    $deduplicatedCount++;
                    @{"type" = $type; "id" = $_}
                }
            })
        }
    }
    
    $countDifference = $originalCount - $deduplicatedCount
    if ($countDifference) {
        Write-Host "Removing $($countDifference) duplicate entries in RequiredResourceAccess for '$($App.DisplayName)' (AppId: $($App.AppId))"
        Update-MgApplication -ApplicationId $App.Id -RequiredResourceAccess $finalRras
    } else {
        Write-Host "No updates necessary for '$($App.DisplayName)' (AppId: $($App.AppId))"
    }
}
```