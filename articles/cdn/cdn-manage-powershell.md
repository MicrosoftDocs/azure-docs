---
title: Manage Azure Content Delivery Network with PowerShell
description: Use this tutorial to learn how to use PowerShell to manage aspects of your Azure Content Delivery Network endpoint profiles and endpoints.
services: cdn
author: duongau
manager: kumudd
ms.service: azure-cdn
ms.topic: how-to
ms.date: 03/20/2024
ms.author: duau 
ms.custom: devx-track-azurepowershell
---

# Manage Azure Content Delivery Network with PowerShell

PowerShell provides one of the most flexible methods to manage your Azure Content Delivery Network profiles and endpoints. You can use PowerShell interactively or by writing scripts to automate management tasks. This tutorial demonstrates several of the most common tasks you can accomplish with PowerShell to manage your Azure Content Delivery Network profiles and endpoints.

## Prerequisites

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

To use PowerShell to manage your Azure Content Delivery Network profiles and endpoints, you must have the Azure PowerShell module installed. To learn how to install Azure PowerShell and connect to Azure using the `Connect-AzAccount` cmdlet, see [How to install and configure Azure PowerShell](/powershell/azure/).

> [!IMPORTANT]
> You must log in with `Connect-AzAccount` before you can execute Azure PowerShell cmdlets.
>
>

<a name='listing-the-azure-cdn-cmdlets'></a>

## Listing the Azure Content Delivery Network cmdlets

You can list all the Azure Content Delivery Network cmdlets using the `Get-Command` cmdlet.

```text
PS C:\> Get-Command -Module Az.Cdn

CommandType     Name                                               Version    Source
-----------     ----                                               -------    ------
Cmdlet          Confirm-AzCdnEndpointProbeURL                      2.1.0      Az.Cdn
Cmdlet          Disable-AzCdnCustomDomain                          2.1.0      Az.Cdn
Cmdlet          Disable-AzCdnCustomDomainHttps                     2.1.0      Az.Cdn
Cmdlet          Enable-AzCdnCustomDomain                           2.1.0      Az.Cdn
Cmdlet          Enable-AzCdnCustomDomainHttps                      2.1.0      Az.Cdn
Cmdlet          Get-AzCdnCustomDomain                              2.1.0      Az.Cdn
Cmdlet          Get-AzCdnEdgeNode                                  2.1.0      Az.Cdn
Cmdlet          Get-AzCdnEndpoint                                  2.1.0      Az.Cdn
Cmdlet          Get-AzCdnEndpointResourceUsage                     2.1.0      Az.Cdn
Cmdlet          Get-AzCdnOrigin                                    2.1.0      Az.Cdn
Cmdlet          Get-AzCdnProfile                                   2.1.0      Az.Cdn
Cmdlet          Get-AzCdnProfileResourceUsage                      2.1.0      Az.Cdn
Cmdlet          Get-AzCdnProfileSupportedOptimizationType          2.1.0      Az.Cdn
Cmdlet          Get-AzCdnSubscriptionResourceUsage                 2.1.0      Az.Cdn
Cmdlet          New-AzCdnCustomDomain                              2.1.0      Az.Cdn
Cmdlet          New-AzCdnDeliveryPolicy                            2.1.0      Az.Cdn
Cmdlet          New-AzCdnDeliveryRule                              2.1.0      Az.Cdn
Cmdlet          New-AzCdnDeliveryRuleAction                        2.1.0      Az.Cdn
Cmdlet          New-AzCdnDeliveryRuleCondition                     2.1.0      Az.Cdn
Cmdlet          New-AzCdnEndpoint                                  2.1.0      Az.Cdn
Cmdlet          New-AzCdnProfile                                   2.1.0      Az.Cdn
Cmdlet          Remove-AzCdnCustomDomain                           2.1.0      Az.Cdn
Cmdlet          Remove-AzCdnEndpoint                               2.1.0      Az.Cdn
Cmdlet          Remove-AzCdnProfile                                2.1.0      Az.Cdn
Cmdlet          Set-AzCdnProfile                                   2.1.0      Az.Cdn
Cmdlet          Start-AzCdnEndpoint                                2.1.0      Az.Cdn
Cmdlet          Stop-AzCdnEndpoint                                 2.1.0      Az.Cdn
```

## Getting help

You can get help with any of these cmdlets using the `Get-Help` cmdlet.  `Get-Help` provides usage and syntax, and optionally shows examples.

```text
PS C:\> Get-Help Get-AzCdnProfile

NAME
    Get-AzCdnProfile

SYNOPSIS
    Gets an Azure CDN profile.

SYNTAX
    Get-AzCdnProfile [-ProfileName <String>] [-ResourceGroupName <String>] [-InformationAction
    <ActionPreference>] [-InformationVariable <String>] [<CommonParameters>]

DESCRIPTION
    Gets an Azure CDN profile and all related information.

RELATED LINKS
    https://docs.microsoft.com/powershell/module/az.cdn/get-azcdnprofile

REMARKS
    To see the examples, type: "get-help Get-AzCdnProfile -examples".
    For more information, type: "get-help Get-AzCdnProfile -detailed".
    For technical information, type: "get-help Get-AzCdnProfile -full".
    For online help, type: "get-help Get-AzCdnProfile -online"
```

<a name='listing-existing-azure-cdn-profiles'></a>

## Listing existing Azure Content Delivery Network profiles

The `Get-AzCdnProfile` cmdlet without any parameters retrieves all your existing content delivery network profiles.

```powershell
Get-AzCdnProfile
```

This output can be piped to cmdlets for enumeration.

```powershell
# Output the name of all profiles on this subscription.
Get-AzCdnProfile | ForEach-Object { Write-Host $_.Name }
```

You can also return a single profile by specifying the profile name and resource group.

```powershell
Get-AzCdnProfile -ProfileName CdnDemo -ResourceGroupName CdnDemoRG
```

> [!TIP]
> It is possible to have multiple content delivery network profiles with the same name, so long as they are in different resource groups. Omitting the `ResourceGroupName` parameter returns all profiles with a matching name.
>

<a name='listing-existing-cdn-endpoints'></a>

## Listing existing content delivery network endpoints

`Get-AzCdnEndpoint` can retrieve an individual endpoint or all the endpoints on a profile.

```powershell
# Get a single endpoint.
Get-AzCdnEndpoint -ProfileName CdnDemo -ResourceGroupName CdnDemoRG -EndpointName cdndocdemo

# Get all of the endpoints on a given profile. 
Get-AzCdnEndpoint -ProfileName CdnDemo -ResourceGroupName CdnDemoRG
```

<a name='creating-cdn-profiles-and-endpoints'></a>

## Creating content delivery network profiles and endpoints

`New-AzCdnProfile` and `New-AzCdnEndpoint` are used to create content delivery network profiles and endpoints. The following SKUs are supported:
- Standard_Verizon
- Premium_Verizon
- Custom_Verizon
- Standard_Microsoft
- Standard_ChinaCdn

```powershell
# Create a new profile
New-AzCdnProfile -ProfileName CdnPoshDemo -ResourceGroupName CdnDemoRG -Sku Standard_Microsoft -Location "Central US"

# Create a new endpoint
$origin = @{
    Name = "Contoso"
    HostName = "www.contoso.com"
};

New-AzCdnEndpoint -ProfileName CdnPoshDemo -ResourceGroupName CdnDemoRG -Location "Central US" -EndpointName cdnposhdoc -Origin $origin
```

## Adding a custom domain

`New-AzCdnCustomDomain` adds a custom domain name to an existing endpoint.

> [!IMPORTANT]
> You must set up the CNAME with your DNS provider as described in [How to map Custom Domain to Content Delivery Network endpoint](cdn-map-content-to-custom-domain.md). You can test the mapping before modifying your endpoint using `Test-AzCdnCustomDomain`.
>
>

```powershell
# Create the custom domain on the endpoint
New-AzCdnCustomDomain -ResourceGroupName CdnDemoRG -ProfileName CdnPoshDemo -Name contoso -HostName "cdn.contoso.com" -EndpointName cdnposhdoc
```

## Modifying an endpoint

`Update-AzCdnEndpoint` modifies an existing endpoint.

```powershell
# Update endpoint with compression settings
Update-AzCdnEndpoint -Name cdnposhdoc -ProfileName CdnPoshDemo -ResourceGroupName CdnDemoRG -IsCompressionEnabled -ContentTypesToCompress "text/javascript","text/css","application/json"
```

## Purging

`Clear-AzCdnEndpointContent` purges cached assets.

```powershell
# Purge some assets.
Clear-AzCdnEndpointContent -ProfileName CdnPoshDemo -ResourceGroupName CdnDemoRG -EndpointName cdnposhdoc -ContentFilePath @("/images/kitten.png","/video/rickroll.mp4")
```

## Pre-load some assets

> [!NOTE]
> Pre-loading is only available on Azure Content Delivery Network from Edgio profiles.

`Import-AzCdnEndpointContent` pre-loads assets into the content delivery network cache.

```powershell
Import-AzCdnEndpointContent -ProfileName CdnPoshDemo -ResourceGroupName CdnDemoRG -EndpointName cdnposhdoc -ContentFilePath @("/images/kitten.png","/video/rickroll.mp4")`
```

<a name='startingstopping-cdn-endpoints'></a>

## Starting/Stopping content delivery network endpoints

`Start-AzCdnEndpoint` and `Stop-AzCdnEndpoint` can be used to start and stop individual endpoints or groups of endpoints.

```powershell
# Stop the CdnPoshDemo endpoint
Stop-AzCdnEndpoint -ProfileName CdnPoshDemo -ResourceGroupName CdnDemoRG -Name cdnposhdoc

# Start the CdnPoshDemo endpoint
Start-AzCdnEndpoint -ProfileName CdnPoshDemo -ResourceGroupName CdnDemoRG -Name cdnposhdoc
```

<a name='creating-standard-rules-engine-policy-and-applying-to-an-existing-cdn-endpoint'></a>

## Creating Standard Rules engine policy and applying to an existing content delivery network endpoint

The following list of cmdlets can be used to create a Standard Rules engine policy and apply it to an existing content delivery network endpoint.

Conditions:

- [New-AzFrontDoorCdnRuleCookiesConditionObject](/powershell/module/az.cdn/new-azcdndeliveryrulecookiesconditionobject)
- [New-AzCdnDeliveryRuleHttpVersionConditionObject](/powershell/module/az.cdn/new-azcdndeliveryrulehttpversionconditionobject)
- [New-AzCdnDeliveryRuleIsDeviceConditionObject](/powershell/module/az.cdn/new-azcdndeliveryruleisdeviceconditionobject)
- [New-AzCdnDeliveryRulePostArgsConditionObject](/powershell/module/az.cdn/new-azcdndeliveryrulepostargsconditionobject)
- [New-AzCdnDeliveryRuleQueryStringConditionObject](/powershell/module/az.cdn/new-azcdndeliveryrulequerystringconditionobject)
- [New-AzCdnDeliveryRuleRemoteAddressConditionObject](/powershell/module/az.cdn/new-azcdndeliveryruleremoteaddressconditionobject)
- [New-AzCdnDeliveryRuleRequestBodyConditionObject](/powershell/module/az.cdn/new-azcdndeliveryrulerequestbodyconditionobject)
- [New-AzCdnDeliveryRuleRequestHeaderConditionObject](/powershell/module/az.cdn/new-azcdndeliveryrulerequestheaderconditionobject)
- [New-AzCdnDeliveryRuleRequestMethodConditionObject](/powershell/module/az.cdn/new-azcdndeliveryrulerequestmethodconditionobject)
- [New-AzCdnDeliveryRuleRequestSchemeConditionObject](/powershell/module/az.cdn/new-azcdndeliveryrulerequestschemeconditionobject)
- [New-AzCdnDeliveryRuleRequestUriConditionObject](/powershell/module/az.cdn/new-azcdndeliveryrulerequesturiconditionobject)
- [New-AzCdnDeliveryRuleResponseHeaderActionObject](/powershell/module/az.cdn/new-azcdndeliveryruleresponseheaderactionobject)
- [New-AzCdnDeliveryRuleUrlFileExtensionConditionObject](/powershell/module/az.cdn/new-azcdndeliveryruleurlfileextensionconditionobject)
- [New-AzCdnDeliveryRuleUrlFileNameConditionObject](/powershell/module/az.cdn/new-azcdndeliveryruleurlfilenameconditionobject)
- [New-AzCdnDeliveryRuleUrlPathConditionObject](/powershell/module/az.cdn/new-azcdndeliveryruleurlpathconditionobject)

Actions:

- [New-AzCdnDeliveryRuleRequestHeaderActionObject](/powershell/module/az.cdn/new-azcdndeliveryrulerequestheaderactionobject)
- [New-AzCdnDeliveryRuleRequestHeaderActionObject](/powershell/module/az.cdn/new-azcdndeliveryrulerequestheaderactionobject)
- [New-AzCdnUrlRedirectActionObject](/powershell/module/az.cdn/new-azcdnurlredirectactionobject)
- [New-AzCdnUrlRewriteActionObject](/powershell/module/az.cdn/new-azcdnurlrewriteactionobject)
- [New-AzCdnUrlSigningActionObject](/powershell/module/az.cdn/new-azcdnurlsigningactionobject)

```powershell
# Create a path based Response header modification rule. 
$cond1 = New-AzCdnDeliveryRuleUrlPathConditionObject -Name UrlPath -ParameterOperator BeginsWith -ParameterMatchValue "/images/"
$action1 = New-AzCdnDeliveryRuleResponseHeaderActionObject -Name ModifyResponseHeader -ParameterHeaderAction Overwrite -ParameterHeaderName "Access-Control-Allow-Origin" -ParameterValue "*"
$rule1 = New-AzCdnDeliveryRuleObject -Name "PathBasedCacheOverride" -Order 1 -Condition $cond1 -Action $action1

# Create a new http to https redirect rule
$cond1 = New-AzCdnDeliveryRuleRequestSchemeConditionObject -Name RequestScheme -ParameterMatchValue HTTPS
$action1 = New-AzCdnUrlRedirectActionObject -Name UrlRedirect -ParameterRedirectType Found -ParameterDestinationProtocol Https
$rule2 = New-AzCdnDeliveryRuleObject -Name "UrlRewriteRule" -Order 2 -Condition $cond1 -Action $action1

# Update existing endpoint with new rules
Update-AzCdnEndpoint -Name cdnposhdoc -ProfileName CdnPoshDemo -ResourceGroupName CdnDemoRG -DeliveryPolicyRule $rule1,$rule2
```

<a name='deleting-cdn-resources'></a>

## Deleting content delivery network resources

`Remove-AzCdnProfile` and `Remove-AzCdnEndpoint` can be used to remove profiles and endpoints.

```powershell
# Remove a single endpoint
Remove-AzCdnEndpoint -ProfileName CdnPoshDemo -ResourceGroupName CdnDemoRG -EndpointName cdnposhdoc

# Remove a single profile
Remove-AzCdnProfile -ProfileName CdnPoshDemo -ResourceGroupName CdnDemoRG
```

## Next Steps

- Learn how to automate Azure Content Delivery Network with [.NET](cdn-app-dev-net.md) or [Node.js](cdn-app-dev-node.md).

- To learn about content delivery network features, see [content delivery network Overview](cdn-overview.md).
