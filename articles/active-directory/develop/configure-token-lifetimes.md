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
ms.date: 09/29/2020
ms.author: ryanwi
ms.custom: aaddev, content-perf, FY21Q1
ms.reviewer: hirsin, jlu, annaba
---
# Configure token lifetime policies (preview)
Many scenarios are possible in Azure AD when you can create and manage token lifetimes for apps, service principals, and your overall organization. To learn more, read [Configurable token lifetimes in Microsoft identity platform](active-directory-configurable-token-lifetimes.md). 

> [!IMPORTANT]
> After hearing from customers during the preview, we've implemented [authentication session management capabilities](../conditional-access/howto-conditional-access-session-lifetime.md) in Azure AD Conditional Access. You can use this new feature to configure refresh token lifetimes by setting sign in frequency. After May 30, 2020 no new tenant will be able to use configurable token lifetime policy to configure session and refresh tokens. The deprecation will happen within several months after that, which means that we will stop honoring existing session and refresh tokens polices. You can still configure access token lifetimes after the deprecation.


In this section, we walk through a few common policy scenarios that can help you impose new rules for:

* Token lifetime
* Token max inactive time
* Token max age

In the examples, you can learn how to:

* Manage an organization's default policy
* Create a policy for web sign-in
* Create a policy for a native app that calls a web API
* Manage an advanced policy

## Prerequisites
In the following examples, you create, update, link, and delete policies for apps, service principals, and your overall organization. If you are new to Azure AD, we recommend that you learn about [how to get an Azure AD tenant](quickstart-create-new-tenant.md) before you proceed with these examples.  

To get started, do the following steps:

1. Download the latest [Azure AD PowerShell Module Public Preview release](https://www.powershellgallery.com/packages/AzureADPreview).
2. Run the `Connect` command to sign in to your Azure AD admin account. Run this command each time you start a new session.

    ```powershell
    Connect-AzureAD -Confirm
    ```

3. To see all policies that have been created in your organization, run the following command. Run this command after most operations in the following scenarios. Running the command also helps you get the **
** of your policies.

    ```powershell
    Get-AzureADPolicy
    ```

## Manage an organization's default policy
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

## Create a policy for a native app that calls a web API
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

## Manage an advanced policy
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