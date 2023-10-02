---
title: Configure sign-in auto-acceleration using Home Realm Discovery
description: Learn how to force federated IdP acceleration for an application using Home Realm Discovery policy.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 03/16/2023
ms.author: jomondi
ms.reviewer: ludwignick
ms.custom: seoapril2019, contperf-fy22q2, enterprise-apps, has-azure-ad-ps-ref
ms.collection: M365-identity-device-management
zone_pivot_groups: home-realm-discovery
#customer intent: As and admin, I want to configure Home Realm Discovery for Microsoft Entra authentication for federated users.
---

# Configure sign-in behavior using Home Realm Discovery

This article provides an introduction to configuring Microsoft Entra authentication behavior for federated users using Home Realm Discovery (HRD) policy. It covers using auto-acceleration sign-in to skip the username entry screen and automatically forward users to federated login endpoints. To learn more about HRD policy, check out the [Home Realm Discovery](home-realm-discovery-policy.md) article.

## Auto-acceleration sign-in

Some organizations configure domains in their Microsoft Entra tenant to federate with another identity provider (IDP), such as AD FS for user authentication. When a user signs into an application, they're first presented with a Microsoft Entra sign-in page. After they've typed their UPN, if they are in a federated domain they're then taken to the sign-in page of the IDP serving that domain. Under certain circumstances, administrators might want to direct users to the sign-in page when they're signing in to specific applications. As a result users can skip the initial Microsoft Entra ID page. This process is referred to as "sign-in auto-acceleration." 

For federated users with cloud-enabled credentials, such as SMS sign-in or FIDO keys, you should prevent sign-in auto-acceleration. See [Disable auto-acceleration sign-in](prevent-domain-hints-with-home-realm-discovery.md) to learn how to prevent domain hints with HRD. 

> [!IMPORTANT]
> Starting April 2023, organizations who use auto-acceleration or smartlinks may begin to see a new screen added to the sign-in UI. This screen, termed the Domain Confirmation Dialog, is part of Microsoft's general commitment to security hardening and requires the user to confirm the domain of the tenant in which they are signing in to. If you see the Domain Confirmation Dialog and do not recognize the tenant domain listed, you should cancel the authentication flow and contact your IT Admin.
>
> While the Domain Confirmation Dialog does not need to be shown for every instance of auto-acceleration or smartlinks, the presence of the Domain Confirmation Dialog means auto-acceleration and smartlinks can no longer proceed seamlessly when shown. If your organization clears cookies due to browser policies or otherwise, you may experience the domain confirmation dialog more frequently. Finally, given Microsoft identity platform manages the auto-acceleration sign-in flow end-to-end, the introduction of the Domain Confirmation Dialog should not result in any application breakages. 

## Prerequisites

To configure HRD policy for an application in Microsoft Entra ID, you need:

- An Azure account with an active subscription. If you don't already have one, you can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- One of the following roles: Global Administrator, or owner of the service principal.

::: zone pivot="powershell-hrd"
- The latest Azure AD PowerShell cmdlet preview.
::: zone-end

## Set up an HRD policy on an application
::: zone pivot="powershell-hrd"

We'll use Azure AD PowerShell cmdlets to walk through a few scenarios, including:

::: zone-end
::: zone pivot="graph-hrd"

We'll use Microsoft Graph to walk through a few scenarios, including:

::: zone-end

- Setting up HRD policy to do auto-acceleration for an application in a tenant with a single federated domain.

- Setting up HRD policy to do auto-acceleration  for an application to one of several domains that are verified for your tenant.

- Setting up HRD policy to enable a legacy application to do direct username/password authentication to Microsoft Entra ID for a federated user.

- Listing the applications for which a policy is configured.

::: zone pivot="powershell-hrd"

In the following examples, you create, update, link, and delete HRD policies on application service principals in Microsoft Entra ID.

1. Before you begin, run the Connect command to sign in to Microsoft Entra ID with your admin account:

    ```powershell
    Connect-AzureAD -Confirm
    ```

1. Run the following command to see all the policies in your organization:

    ```powershell
    Get-AzureADPolicy
    ```

If nothing is returned, it means you have no policies created in your tenant.

::: zone-end

## Create an HRD policy

In this example, you create a policy that when it's assigned to an application either:

- Auto-accelerates users to a federated identity provider sign-in screen when they're signing in to an application when there's a single domain in your tenant.
- Auto-accelerates users to a federated identity provider sign-in screen if there's more than one federated domain in your tenant.
- Enables non-interactive username/password sign-in directly to Microsoft Entra ID for federated users for the applications the policy is assigned to.

The following policy auto-accelerates users to a federated identity provider sign-in screen when they're signing in to an application when there's a single domain in your tenant.

::: zone pivot="powershell-hrd"

```powershell
New-AzureADPolicy 
    -Definition @("{`"HomeRealmDiscoveryPolicy`":{`"AccelerateToFederatedDomain`":true}}") -DisplayName BasicAutoAccelerationPolicy 
    -Type HomeRealmDiscoveryPolicy
```
::: zone-end

::: zone pivot="graph-hrd"

```http
POST /policies/homeRealmDiscoveryPolicies

"HomeRealmDiscoveryPolicy": {
    "AccelerateToFederatedDomain": true
}
```
::: zone-end

The following policy auto-accelerates users to a federated identity provider sign-in screen when there's more than one federated domain in your tenant. If you've more than one federated domain that authenticates users for applications, you need to specify the domain to auto-accelerate.

::: zone pivot="powershell-hrd"

```powershell
New-AzureADPolicy 
    -Definition @("{`"HomeRealmDiscoveryPolicy`":{`"AccelerateToFederatedDomain`":true, `"PreferredDomain`":`"federated.example.edu`"}}") 
    -DisplayName MultiDomainAutoAccelerationPolicy 
    -Type HomeRealmDiscoveryPolicy
```
::: zone-end

::: zone pivot="graph-hrd"

```http
POST /policies/homeRealmDiscoveryPolicies

"HomeRealmDiscoveryPolicy": {
    "AccelerateToFederatedDomain": true,
    "PreferredDomain": [
      "federated.example.edu"
    ]
}
```
::: zone-end

The following policy enables username/password authentication for federated users directly with Microsoft Entra ID for specific applications:


::: zone pivot="powershell-hrd"


```powershell
New-AzureADPolicy 
    -Definition @("{`"HomeRealmDiscoveryPolicy`":{`"AllowCloudPasswordValidation`":true}}") 
    -DisplayName EnableDirectAuthPolicy 
    -Type HomeRealmDiscoveryPolicy
```
::: zone-end


::: zone pivot="graph-hrd"

```http
POST /policies/homeRealmDiscoveryPolicies

"EnableDirectAuthPolicy": {
    "AllowCloudPasswordValidation": true
}

```

::: zone-end

::: zone pivot="powershell-hrd"

To see your new policy and get its **ObjectID**, run the following command:

```powershell
Get-AzureADPolicy
```

To apply the HRD policy after you've created it, you can assign it to multiple application service principals.

## Locate the service principal to which to assign the policy

You need the **ObjectID** of the service principals to which you want to assign the policy. There are several ways to find the **ObjectID** of service principals.

You can use the [Microsoft Entra admin center](https://entra.microsoft.com), or you can query [Microsoft Graph](/graph/api/resources/serviceprincipal). You can also go to the [Graph Explorer Tool](https://developer.microsoft.com/graph/graph-explorer) and sign in to your Microsoft Entra account to see all your organization's service principals.

Because you're using PowerShell, you can use the following cmdlet to list the service principals and their IDs.

```powershell
Get-AzureADServicePrincipal
```

## Assign the policy to your service principal

After you have the **ObjectID** of the service principal of the application for which you want to configure auto-acceleration, run the following command. This command associates the HRD policy that you created in step 1 with the service principal that you located in step 2.

```powershell
Add-AzureADServicePrincipalPolicy 
    -Id <ObjectID of the Service Principal> 
    -RefObjectId <ObjectId of the Policy>
```

You can repeat this command for each service principal to which you want to add the policy.

In the case where an application already has a HomeRealmDiscovery policy assigned, you won't be able to add a second one.  In that case, change the definition of the HRD policy that is assigned to the application to add extra parameters.

### Check which application service principals your HRD policy is assigned to

To check which applications have HRD policy configured, use the **Get-AzureADPolicyAppliedObject** cmdlet. Pass it the **ObjectID** of the policy that you want to check on.

```powershell
Get-AzureADPolicyAppliedObject -id <ObjectId of the Policy>
```
Try the application to check that the new policy is working.

### List the applications for which HRD policy is configured

1. List all policies that were created in your organization

    ```powershell
    Get-AzureADPolicy
    ```

Note the **ObjectID** of the policy that you want to list assignments for.

2. List the service principals to which the policy is assigned

    ```powershell
    Get-AzureADPolicyAppliedObject -id <ObjectId of the Policy>
    ```

## Remove an HRD policy from an application

1. Get the ObjectID

Use the previous example to get the **ObjectID** of the policy, and that of the application service principal from which you want to remove it.

2. Remove the policy assignment from the application service principal

    ```powershell
    Remove-AzureADServicePrincipalPolicy -id <ObjectId of the Service Principal>  -PolicyId <ObjectId of the policy>
    ```

3. Check removal by listing the service principals to which the policy is assigned

    ```powershell
    Get-AzureADPolicyAppliedObject -id <ObjectId of the Policy>
    ```
::: zone-end
::: zone pivot="graph-hrd"

## Configuring policy through Graph Explorer

From the Microsoft Graph explorer window:

1. Sign in with one of the roles listed in the prerequisites section.
1. Grant consent to the `Policy.ReadWrite.ApplicationConfiguration` permission.
1. Use the [Home realm discovery policy](/graph/api/resources/homerealmdiscoverypolicy) to create a new policy.
1. POST the new policy, or PATCH to update an existing policy.

    ```http
    PATCH /policies/homeRealmDiscoveryPolicies/{id}
        {
            "definition": [
            "{\"HomeRealmDiscoveryPolicy\":
            {\"AccelerateToFederatedDomain\":true,
            \"PreferredDomain\":\"federated.example.edu\",
            \"AlternateIdLogin\":{\"Enabled\":true}}}"
        ],
            "displayName": "Home Realm Discovery auto acceleration",
            "isOrganizationDefault": true
        }
    ```
1. To view your new policy, run the following query:  

    ```http
    GET /policies/homeRealmDiscoveryPolicies/{id}
    ```	
1. To  delete the HRD policy you created, run the query:

    ```http
    DELETE /policies/homeRealmDiscoveryPolicies/{id}
    ```	
::: zone-end

## Next steps

- [Prevent sign-in auto-acceleration](prevent-domain-hints-with-home-realm-discovery.md)
- [Home Realm Discovery for an application](./home-realm-discovery-policy.md)
