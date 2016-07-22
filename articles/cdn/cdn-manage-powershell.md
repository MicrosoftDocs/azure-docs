<properties
	pageTitle="Manage Azure CDN with PowerShell | Microsoft Azure"
	description="Learn how to use the Azure PowerShell cmdlets to manage Azure CDN."
	services="cdn"
	documentationCenter=""
	authors="camsoper"
	manager="erikre"
	editor=""/>

<tags
	ms.service="cdn"
	ms.workload="tbd"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/19/2016"
	ms.author="casoper"/>


# Manage Azure CDN with PowerShell

PowerShell provides one of the most flexible methods to manage your Azure CDN profiles and endpoints.  You can use PowerShell interactively or by writing scripts to automate management tasks.  This tutorial demonstrates several of the most common tasks you can accomplish with PowerShell to manage your Azure CDN profiles and endpoints.

## Prerequisites

In order to use PowerShell to manage your Azure CDN profiles and endpoints, you must have the Azure PowerShell module installed.  To learn how to install Azure PowerShell and connect to Azure using the `Login-AzureRmAccount` cmdlet, see [How to install and configure Azure PowerShell](../powershell-install-configure.md).

## Listing the Azure CDN cmdlets

You can list all the Azure CDN cmdlets using the `Get-Command` cmdlet.

```text
PS C:\> Get-Command -Module AzureRM.Cdn

CommandType     Name                                               Version    Source
-----------     ----                                               -------    ------
Cmdlet          Get-AzureRmCdnCustomDomain                         1.0.5      AzureRM.Cdn
Cmdlet          Get-AzureRmCdnEndpoint                             1.0.5      AzureRM.Cdn
Cmdlet          Get-AzureRmCdnEndpointNameAvailability             1.0.5      AzureRM.Cdn
Cmdlet          Get-AzureRmCdnOrigin                               1.0.5      AzureRM.Cdn
Cmdlet          Get-AzureRMCdnProfile                              1.0.5      AzureRM.Cdn
Cmdlet          Get-AzureRmCdnProfileSsoUrl                        1.0.5      AzureRM.Cdn
Cmdlet          New-AzureRmCdnCustomDomain                         1.0.5      AzureRM.Cdn
Cmdlet          New-AzureRmCdnEndpoint                             1.0.5      AzureRM.Cdn
Cmdlet          New-AzureRmCdnProfile                              1.0.5      AzureRM.Cdn
Cmdlet          Publish-AzureRmCdnEndpointContent                  1.0.5      AzureRM.Cdn
Cmdlet          Remove-AzureRmCdnCustomDomain                      1.0.5      AzureRM.Cdn
Cmdlet          Remove-AzureRmCdnEndpoint                          1.0.5      AzureRM.Cdn
Cmdlet          Remove-AzureRmCdnProfile                           1.0.5      AzureRM.Cdn
Cmdlet          Set-AzureRmCdnEndpoint                             1.0.5      AzureRM.Cdn
Cmdlet          Set-AzureRmCdnOrigin                               1.0.5      AzureRM.Cdn
Cmdlet          Set-AzureRmCdnProfile                              1.0.5      AzureRM.Cdn
Cmdlet          Start-AzureRmCdnEndpoint                           1.0.5      AzureRM.Cdn
Cmdlet          Stop-AzureRmCdnEndpoint                            1.0.5      AzureRM.Cdn
Cmdlet          Test-AzureRmCdnCustomDomain                        1.0.5      AzureRM.Cdn
Cmdlet          Unpublish-AzureRmCdnEndpointContent                1.0.5      AzureRM.Cdn
```

## Getting help

You can get help with any of these cmdlets using the `Get-Help` cmdlet.  `Get-Help` provides usage and syntax, as well as optionally showing examples.

```text
PS C:\> Get-Help Get-AzureRMCdnProfile

NAME
    Get-AzureRmCdnProfile

SYNOPSIS
    Get an Azure Cdn Profile.


SYNTAX
    Get-AzureRmCdnProfile [-ProfileName <String>] [-ResourceGroupName <String>] [-InformationAction
    <ActionPreference>] [-InformationVariable <String>] [<CommonParameters>]


DESCRIPTION
    Get an Azure Cdn Profile and all the related information.


RELATED LINKS

REMARKS
    To see the examples, type: "get-help Get-AzureRmCdnProfile -examples".
    For more information, type: "get-help Get-AzureRmCdnProfile -detailed".
    For technical information, type: "get-help Get-AzureRmCdnProfile -full".
```

## Listing existing Azure CDN profiles

The `Get-AzureRmCdnProfile` cmdlet without any parameters will list your existing CDN profiles.

```text
PS C:\> Get-AzureRMCdnProfile
Sku               : Microsoft.Azure.Management.Cdn.Models.Sku
ResourceState     : Active
ProvisioningState : Succeeded
Location          : CentralUs
Tags              : {}
Id                : /subscriptions/<subscription ID>/resourcegroups/CdnDemoRG/providers/Microsoft.Cdn/profiles/CdnDemo
Name              : CdnDemo
Type              : Microsoft.Cdn/profiles

Sku               : Microsoft.Azure.Management.Cdn.Models.Sku
ResourceState     : Active
ProvisioningState : Succeeded
Location          : CentralUs
Tags              : {}
Id                : /subscriptions/<subscription ID>/resourcegroups/CdnDemoRG/providers/Microsoft.Cdn/profiles/CdnPremiumDemo
Name              : CdnPremiumDemo
Type              : Microsoft.Cdn/profiles
```

This output can be piped to `ForEach-Object` to enumerate over each profile.

```text
Get-AzureRMCdnProfile

    