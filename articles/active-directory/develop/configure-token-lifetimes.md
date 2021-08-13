---
title: Set lifetimes for tokens
titleSuffix: Microsoft identity platform
description: Learn how to set lifetimes for tokens issued by Microsoft identity platform. Learn how to learn how to manage an organization's default policy, create a policy for web sign-in, create a policy for a native app that calls a web API, and manage an advanced policy.
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: how-to
ms.date: 04/08/2021
ms.author: ryanwi
ms.custom: aaddev, content-perf, FY21Q1
ms.reviewer: hirsin, jlu, annaba
---
# Configure token lifetime policies (preview)
You can specify the lifetime of an access, SAML, or ID token issued by Microsoft identity platform. You can set token lifetimes for all apps in your organization, for a multi-tenant (multi-organization) application, or for a specific service principal in your organization. For more info, read [configurable token lifetimes](active-directory-configurable-token-lifetimes.md).

In this section, we walk through a common policy scenario that can help you impose new rules for token lifetime. In the example, you learn how to create a policy that requires users to authenticate more frequently in your web app.

## Get started

To get started, download the latest [Azure AD PowerShell Module Public Preview release](https://www.powershellgallery.com/packages/AzureADPreview).

Next, run the `Connect` command to sign in to your Azure AD admin account. Run this command each time you start a new session.

```powershell
Connect-AzureAD -Confirm
```

## Create a policy for web sign-in

In this example, you create a policy that requires users to authenticate more frequently in your web app. This policy sets the lifetime of the access/ID tokens to the service principal of your web app.

1. Create a token lifetime policy.

    This policy, for web sign-in, sets the access/ID token lifetime to two hours.

    To create the policy, run the [New-AzureADPolicy](/powershell/module/azuread/new-azureadpolicy?view=azureadps-2.0-preview&preserve-view=true) cmdlet:

    ```powershell
    $policy = New-AzureADPolicy -Definition @('{"TokenLifetimePolicy":{"Version":1,"AccessTokenLifetime":"02:00:00"}}') -DisplayName "WebPolicyScenario" -IsOrganizationDefault $false -Type "TokenLifetimePolicy"
    ```

    To see your new policy, and to get the policy **ObjectId**, run the [Get-AzureADPolicy](/powershell/module/azuread/get-azureadpolicy?view=azureadps-2.0-preview&preserve-view=true) cmdlet:

    ```powershell
    Get-AzureADPolicy -Id $policy.Id
    ```

1. Assign the policy to your service principal. You also need to get the **ObjectId** of your service principal.

    Use the [Get-AzureADServicePrincipal](/powershell/module/azuread/get-azureadserviceprincipal) cmdlet to see all your organization's service principals or a single service principal.

    ```powershell
    # Get ID of the service principal
    $sp = Get-AzureADServicePrincipal -Filter "DisplayName eq '<service principal display name>'"
    ```

    When you have the service principal, run the [Add-AzureADServicePrincipalPolicy](/powershell/module/azuread/add-azureadserviceprincipalpolicy?view=azureadps-2.0-preview&preserve-view=true) cmdlet:

    ```powershell
    # Assign policy to a service principal
    Add-AzureADServicePrincipalPolicy -Id $sp.ObjectId -RefObjectId $policy.Id
    ```

## View existing policies in a tenant

To see all policies that have been created in your organization, run the [Get-AzureADPolicy](/powershell/module/azuread/get-azureadpolicy?view=azureadps-2.0-preview&preserve-view=true) cmdlet.  Any results with defined property values that differ from the defaults listed above are in scope of the retirement.

```powershell
Get-AzureADPolicy -All $true
```

To see which apps and service principals are linked to a specific policy you identified run the following [Get-AzureADPolicyAppliedObject](/powershell/module/azuread/get-azureadpolicyappliedobject?view=azureadps-2.0-preview&preserve-view=true) cmdlet by replacing **1a37dad8-5da7-4cc8-87c7-efbc0326cf20** with any of your policy IDs. Then you can decide whether to configure Conditional Access sign-in frequency or remain with the Azure AD defaults.

```powershell
Get-AzureADPolicyAppliedObject -id 1a37dad8-5da7-4cc8-87c7-efbc0326cf20
```

If your tenant has policies which define custom values for the refresh and session token configuration properties, Microsoft recommends you update those policies to values that reflect the defaults described above. If no changes are made, Azure AD will automatically honor the default values.

### Troubleshooting
Some users have reported a `Get-AzureADPolicy : The term 'Get-AzureADPolicy' is not recognized` error after running the `Get-AzureADPolicy` cmdlet. As a workaround, run the following to uninstall/re-install the AzureAD module and then install the AzureADPreview module:

```powershell
# Uninstall the AzureAD Module
UnInstall-Module AzureAD

# Re-install the AzureAD Module
Install-Module AzureAD

# Install the AzureAD Preview Module adding the -AllowClobber
Install-Module AzureADPreview -AllowClobber

Connect-AzureAD
Get-AzureADPolicy -All $true
```

## Next steps
Learn about [authentication session management capabilities](../conditional-access/howto-conditional-access-session-lifetime.md) in Azure AD Conditional Access.
