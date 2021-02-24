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
ms.date: 02/01/2021
ms.author: ryanwi
ms.custom: aaddev, content-perf, FY21Q1
ms.reviewer: hirsin, jlu, annaba
---
# Configure token lifetime policies (preview)
You can specify the lifetime of an access, SAML, or ID token issued by Microsoft identity platform. You can set token lifetimes for all apps in your organization, for a multi-tenant (multi-organization) application, or for a specific service principal in your organization. For more info, read [configurable token lifetimes](active-directory-configurable-token-lifetimes.md).

In this section, we walk through a common policy scenario that can help you impose new rules for token lifetime. In the example, you learn how to create a policy that requires users to authenticate more frequently in your web app.

## Get started
To get started, do the following steps:

1. Download the latest [Azure AD PowerShell Module Public Preview release](https://www.powershellgallery.com/packages/AzureADPreview).
1. Run the `Connect` command to sign in to your Azure AD admin account. Run this command each time you start a new session.

    ```powershell
    Connect-AzureAD -Confirm
    ```

1. To see all policies that have been created in your organization, run the [Get-AzureADPolicy](/powershell/module/azuread/get-azureadpolicy?view=azureadps-2.0-preview&preserve-view=true) cmdlet.  Any results with defined property values that differ from the defaults listed above are in scope of the retirement.

    ```powershell
    Get-AzureADPolicy -All $true
    ```

1. To see which apps and service principals are linked to a specific policy you identified run the following [Get-AzureADPolicyAppliedObject](/powershell/module/azuread/get-azureadpolicyappliedobject?view=azureadps-2.0-preview&preserve-view=true) cmdlet by replacing **1a37dad8-5da7-4cc8-87c7-efbc0326cf20** with any of your policy IDs. Then you can decide whether to configure Conditional Access sign-in frequency or remain with the Azure AD defaults.

    ```powershell
    Get-AzureADPolicyAppliedObject -id 1a37dad8-5da7-4cc8-87c7-efbc0326cf20
    ```

If your tenant has policies which define custom values for the refresh and session token configuration properties, Microsoft recommends you update those policies to values that reflect the defaults described above. If no changes are made, Azure AD will automatically honor the default values.

## Create a policy for web sign-in

In this example, you create a policy that requires users to authenticate more frequently in your web app. This policy sets the lifetime of the access/ID tokens and the max age of a multi-factor session token to the service principal of your web app.

1. Create a token lifetime policy.

    This policy, for web sign-in, sets the access/ID token lifetime and the max single-factor session token age to two hours.

    1. To create the policy, run the [New-AzureADPolicy](/powershell/module/azuread/new-azureadpolicy?view=azureadps-2.0-preview&preserve-view=true) cmdlet:

        ```powershell
        $policy = New-AzureADPolicy -Definition @('{"TokenLifetimePolicy":{"Version":1,"AccessTokenLifetime":"02:00:00","MaxAgeSessionSingleFactor":"02:00:00"}}') -DisplayName "WebPolicyScenario" -IsOrganizationDefault $false -Type "TokenLifetimePolicy"
        ```

    1. To see your new policy, and to get the policy **ObjectId**, run the [Get-AzureADPolicy](/powershell/module/azuread/get-azureadpolicy?view=azureadps-2.0-preview&preserve-view=true) cmdlet:

        ```powershell
        Get-AzureADPolicy -Id $policy.Id
        ```

1. Assign the policy to your service principal. You also need to get the **ObjectId** of your service principal.

    1. Use the [Get-AzureADServicePrincipal](/powershell/module/azuread/get-azureadserviceprincipal) cmdlet to see all your organization's service principals or a single service principal.
        ```powershell
        # Get ID of the service principal
        $sp = Get-AzureADServicePrincipal -Filter "DisplayName eq '<service principal display name>'"
        ```

    1. When you have the service principal, run the [Add-AzureADServicePrincipalPolicy](/powershell/module/azuread/add-azureadserviceprincipalpolicy?view=azureadps-2.0-preview&preserve-view=true) cmdlet:
        ```powershell
        # Assign policy to a service principal
        Add-AzureADServicePrincipalPolicy -Id $sp.ObjectId -RefObjectId $policy.Id
        ```

## Create token lifetime policies for refresh and session tokens
> [!IMPORTANT]
> As of January 30, 2021 you can not configure refresh and session token lifetimes. Azure Active Directory no longer honors refresh and session token configuration in existing policies.  New tokens issued after existing tokens have expired are now set to the [default configuration](active-directory-configurable-token-lifetimes.md#configurable-token-lifetime-properties-after-the-retirement). You can still configure access, SAML, and ID token lifetimes after the refresh and session token configuration retirement.
>
> Existing token’s lifetime will not be changed. After they expire, a new token will be issued based on the default value.
>
> If you need to continue to define the time period before a user is asked to sign in again, configure sign-in frequency in Conditional Access. To learn more about Conditional Access, read [Configure authentication session management with Conditional Access](../conditional-access/howto-conditional-access-session-lifetime.md).

### Manage an organization's default policy
In this example, you create a policy that lets your users' sign in less frequently across your entire organization. To do this, create a token lifetime policy for single-factor refresh tokens, which is applied across your organization. The policy is applied to every application in your organization, and to each service principal that doesn’t already have a policy set.

1. Create a token lifetime policy.

    1. Set the single-factor refresh token to "until-revoked." The token doesn't expire until access is revoked. Create the following policy definition:

        ```powershell
        @('{
            "TokenLifetimePolicy":
            {
                "Version":1,
                "MaxAgeSingleFactor":"until-revoked"
            }
        }')
        ```

    1. To create the policy, run the [New-AzureADPolicy](/powershell/module/azuread/new-azureadpolicy?view=azureadps-2.0-preview&preserve-view=true) cmdlet:

        ```powershell
        $policy = New-AzureADPolicy -Definition @('{"TokenLifetimePolicy":{"Version":1, "MaxAgeSingleFactor":"until-revoked"}}') -DisplayName "OrganizationDefaultPolicyScenario" -IsOrganizationDefault $true -Type "TokenLifetimePolicy"
        ```

    1. To remove any whitespace, run the [Get-AzureADPolicy](/powershell/module/azuread/get-azureadpolicy?view=azureadps-2.0-preview&preserve-view=true) cmdlet:

        ```powershell
        Get-AzureADPolicy -id | set-azureadpolicy -Definition @($((Get-AzureADPolicy -id ).Replace(" ","")))
        ```

    1. To see your new policy, and to get the policy's **ObjectId**, run the following command:

        ```powershell
        Get-AzureADPolicy -Id $policy.Id
        ```

1. Update the policy.

    You might decide that the first policy you set in this example is not as strict as your service requires. To set your single-factor refresh token to expire in two days, run the following command:

    ```powershell
    Set-AzureADPolicy -Id $policy.Id -DisplayName $policy.DisplayName -Definition @('{"TokenLifetimePolicy":{"Version":1,"MaxAgeSingleFactor":"2.00:00:00"}}')
    ```

### Create a policy for a native app that calls a web API
In this example, you create a policy that requires users to authenticate less frequently. The policy also lengthens the amount of time a user can be inactive before the user must reauthenticate. The policy is applied to the web API. When the native app requests the web API as a resource, this policy is applied.

1. Create a token lifetime policy.

    1. To create a strict policy for a web API, run the [New-AzureADPolicy](/powershell/module/azuread/new-azureadpolicy?view=azureadps-2.0-preview&preserve-view=true) cmdlet:

        ```powershell
        $policy = New-AzureADPolicy -Definition @('{"TokenLifetimePolicy":{"Version":1,"MaxInactiveTime":"30.00:00:00","MaxAgeMultiFactor":"until-revoked","MaxAgeSingleFactor":"180.00:00:00"}}') -DisplayName "WebApiDefaultPolicyScenario" -IsOrganizationDefault $false -Type "TokenLifetimePolicy"
        ```

    1. To see your new policy, run the following command:

        ```powershell
        Get-AzureADPolicy -Id $policy.Id
        ```

1. Assign the policy to your web API. You also need to get the **ObjectId** of your application. Use the [Get-AzureADApplication](/powershell/module/azuread/get-azureadapplication) cmdlet to find your app's **ObjectId**, or use the [Azure portal](https://portal.azure.com/).

    Get the **ObjectId** of your app and assign the policy:

    ```powershell
    # Get the application
    $app = Get-AzureADApplication -Filter "DisplayName eq 'Fourth Coffee Web API'"

    # Assign the policy to your web API.
    Add-AzureADApplicationPolicy -Id $app.ObjectId -RefObjectId $policy.Id
    ```

### Manage an advanced policy
In this example, you create a few policies to learn how the priority system works. You also learn how to manage multiple policies that are applied to several objects.

1. Create a token lifetime policy.

    1. To create an organization default policy that sets the single-factor refresh token lifetime to 30 days, run the [New-AzureADPolicy](/powershell/module/azuread/new-azureadpolicy?view=azureadps-2.0-preview&preserve-view=true) cmdlet:

        ```powershell
        $policy = New-AzureADPolicy -Definition @('{"TokenLifetimePolicy":{"Version":1,"MaxAgeSingleFactor":"30.00:00:00"}}') -DisplayName "ComplexPolicyScenario" -IsOrganizationDefault $true -Type "TokenLifetimePolicy"
        ```

    1. To see your new policy, run the [Get-AzureADPolicy](/powershell/module/azuread/get-azureadpolicy?view=azureadps-2.0-preview&preserve-view=true) cmdlet:

        ```powershell
        Get-AzureADPolicy -Id $policy.Id
        ```

1. Assign the policy to a service principal.

    Now, you have a policy that applies to the entire organization. You might want to preserve this 30-day policy for a specific service principal, but change the organization default policy to the upper limit of "until-revoked."

    1. To see all your organization's service principals, you use the [Get-AzureADServicePrincipal](/powershell/module/azuread/get-azureadserviceprincipal) cmdlet.

    1. When you have the service principal, run the [Add-AzureADServicePrincipalPolicy](/powershell/module/azuread/add-azureadserviceprincipalpolicy?view=azureadps-2.0-preview&preserve-view=true) cmdlet:

        ```powershell
        # Get ID of the service principal
        $sp = Get-AzureADServicePrincipal -Filter "DisplayName eq '<service principal display name>'"

        # Assign policy to a service principal
        Add-AzureADServicePrincipalPolicy -Id $sp.ObjectId -RefObjectId $policy.Id
        ```

1. Set the `IsOrganizationDefault` flag to false:

    ```powershell
    Set-AzureADPolicy -Id $policy.Id -DisplayName "ComplexPolicyScenario" -IsOrganizationDefault $false
    ```

1. Create a new organization default policy:

    ```powershell
    New-AzureADPolicy -Definition @('{"TokenLifetimePolicy":{"Version":1,"MaxAgeSingleFactor":"until-revoked"}}') -DisplayName "ComplexPolicyScenarioTwo" -IsOrganizationDefault $true -Type "TokenLifetimePolicy"
    ```

    You now have the original policy linked to your service principal, and the new policy is set as your organization default policy. It's important to remember that policies applied to service principals have priority over organization default policies.

## Next steps
Learn about [authentication session management capabilities](../conditional-access/howto-conditional-access-session-lifetime.md) in Azure AD Conditional Access.
