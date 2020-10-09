---
title: Change token lifetime defaults for custom Azure AD apps
description: How to update Token Lifetime policies for your application that you are developing on Azure AD
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 09/30/2020
ms.author: ryanwi
ms.custom: aaddev, seoapril2019
---

# How to change the token lifetime defaults for a custom-developed application

This article shows how to use Azure AD PowerShell to set a token lifetime policy. Azure AD Premium allows app developers and tenant admins to configure the lifetime of tokens issued for non-confidential clients. Token lifetime policies are set on a tenant-wide basis or the resources being accessed.

To set a token lifetime policy, you need to download the [Azure AD PowerShell Module](https://www.powershellgallery.com/packages/AzureADPreview).
Run the **Connect-AzureAD -Confirm** command.

Here’s an example policy that requires users to authenticate more frequently in your web app. This policy sets the lifetime of the access/ID tokens and the max age of a multi-factor session token to the service principal of your web app. Create the policy and assign it to your service principal. You also need to get the ObjectId of your service principal.

```powershell
$policy = New-AzureADPolicy -Definition @('{"TokenLifetimePolicy":{"Version":1,"AccessTokenLifetime":"02:00:00","MaxAgeSessionSingleFactor":"02:00:00"}}') -DisplayName "WebPolicyScenario" -IsOrganizationDefault $false -Type "TokenLifetimePolicy"

$sp = Get-AzureADServicePrincipal -Filter "DisplayName eq '<service principal display name>'"

Add-AzureADServicePrincipalPolicy -Id $sp.ObjectId -RefObjectId $policy.Id
```

## Next steps

* See [Configurable token lifetimes in Azure AD](./active-directory-configurable-token-lifetimes.md) to learn how to configure token lifetimes issued by Azure AD, including how to set token lifetimes for all apps in your organization, for a multi-tenant app, or for a specific service principal in your organization. 
* [Azure AD Token Reference](./id-tokens.md)