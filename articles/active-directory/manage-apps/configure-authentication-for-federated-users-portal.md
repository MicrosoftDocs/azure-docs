---
title: Configure sign-in auto-acceleration using Home Realm Discovery
description: Learn how to force federated IdP acceleration for an application using Home Realm Discovery policy.
services: active-directory
author: nickludwig
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 02/09/2022
ms.author: ludwignick
ms.custom: seoapril2019, contperf-fy22q2
ms.collection: M365-identity-device-management
zone_pivot_groups: home-realm-discovery

#customer intent: As and admin, I want to configure Home Realm Discovery for Azure AD authentication for federated users.
---

# Configure sign-in behavior using Home Realm Discovery

This article provides an introduction to configuring Azure Active Directory(Azure AD) authentication behavior for federated users using Home Realm Discovery (HRD) policy.  It covers using auto-acceleration to skip the username entry screen and automatically forward users to federated login endpoints. To learn more about HRD policy, see [Home Realm Discovery](home-realm-discovery-policy.md)

For federated users with cloud-enabled credentials, such as SMS sign-in or FIDO keys, you should prevent sign-in auto-acceleration. See [Disable auto-acceleration sign-in](prevent-domain-hints-with-home-realm-discovery.md) to learn how to prevent domain hints with HRD. 

## Prerequisites

To configure HRD policy for an application in Azure AD, you need:

- An Azure account with an active subscription. If you don't already have one, you can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
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

- Setting up HRD policy to enable a legacy application to do direct username/password authentication to Azure AD for a federated user.

- Listing the applications for which a policy is configured.

::: zone pivot="powershell-hrd"

In the following examples, you create, update, link, and delete HRD policies on application service principals in Azure AD.

1. Before you begin, run the Connect command to sign in to Azure AD with your admin account:

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

- Auto-accelerates users to an federated identity provider sign-in screen when they are signing in to an application when there is a single domain in your tenant.
- Auto-accelerates users to an federated identity provider sign-in screen if there is more than one federated domain in your tenant.
- Enables non-interactive username/password sign-in directly to Azure AD for federated users for the applications the policy is assigned to.

The following policy auto-accelerates users to an federated identity provider sign-in screen when they're signing in to an application when there's a single domain in your tenant.

::: zone pivot="powershell-hrd"

```powershell
New-AzureADPolicy -Definition @("{`"HomeRealmDiscoveryPolicy`":{`"AccelerateToFederatedDomain`":true}}") -DisplayName BasicAutoAccelerationPolicy -Type HomeRealmDiscoveryPolicy
```
::: zone-end

::: zone pivot="graph-hrd"

```json
"HomeRealmDiscoveryPolicy": {
    "AccelerateToFederatedDomain": true
}
```
::: zone-end

The following policy auto-accelerates users to an federated identity provider sign-in screen when there is more than one federated domain in your tenant. If you have more than one federated domain that authenticates users for applications, you need to specify the domain to auto-accelerate.

::: zone pivot="powershell-hrd"

```powershell
New-AzureADPolicy -Definition @("{`"HomeRealmDiscoveryPolicy`":{`"AccelerateToFederatedDomain`":true, `"PreferredDomain`":`"federated.example.edu`"}}") -DisplayName MultiDomainAutoAccelerationPolicy -Type HomeRealmDiscoveryPolicy
```
::: zone-end

::: zone pivot="graph-hrd"

```json
"HomeRealmDiscoveryPolicy": {
    "AccelerateToFederatedDomain": true,
    "PreferredDomain": [
      "federated.example.edu"
    ]
}
```
::: zone-end

The following policy enables username/password authentication for federated users directly with Azure AD for specific applications:


::: zone pivot="graph-hrd"

```json

"EnableDirectAuthPolicy": {
    "AllowCloudPasswordValidation": true
}

```

::: zone-end

::: zone pivot="powershell-hrd"

```powershell
New-AzureADPolicy -Definition @("{`"HomeRealmDiscoveryPolicy`":{`"AllowCloudPasswordValidation`":true}}") -DisplayName EnableDirectAuthPolicy -Type HomeRealmDiscoveryPolicy
```

To see your new policy and get its **ObjectID**, run the following command:

```powershell
Get-AzureADPolicy
```

To apply the HRD policy after you have created it, you can assign it to multiple application service principals.

## Locate the service principal to which to assign the policy

You need the **ObjectID** of the service principals to which you want to assign the policy. There are several ways to find the **ObjectID** of service principals.

You can use the [Azure portal](https://portal.azure.com), or you can query [Microsoft Graph](/graph/api/resources/serviceprincipal). You can also go to the [Graph Explorer Tool](https://developer.microsoft.com/graph/graph-explorer) and sign in to your Azure AD account to see all your organization's service principals.

Because you are using PowerShell, you can use the following cmdlet to list the service principals and their IDs.

```powershell
Get-AzureADServicePrincipal
```

## Assign the policy to your service principal

After you have the **ObjectID** of the service principal of the application for which you want to configure auto-acceleration, run the following command. This command associates the HRD policy that you created in step 1 with the service principal that you located in step 2.

```powershell
Add-AzureADServicePrincipalPolicy -Id <ObjectID of the Service Principal> -RefObjectId <ObjectId of the Policy>
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

Set the HRD policy using Microsoft Graph. See [homeRealmDiscoveryPolicy](/graph/api/resources/homeRealmDiscoveryPolicy?view=graph-rest-1.0&preserve-view=true) resource type for information on how to create the policy.

From the Microsoft Graph explorer window:

1. Grant consent to the *Policy.ReadWrite.ApplicationConfiguration* permission.
1. Use the URL https://graph.microsoft.com/v1.0/policies/homeRealmDiscoveryPolicies
1. POST the new policy to this URL, or PATCH to https://graph.microsoft.com/v1.0/policies/homeRealmDiscoveryPolicies/{policyID} if overwriting an existing one.
1. POST or PATCH contents:

    ```json
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
1. To see your new policy and get its ObjectID, run the following query:  

    ```http
    GET https://graph.microsoft.com/v1.0/policies/homeRealmDiscoveryPolicies
    ```	
1. To  delete the HRD policy you created, run the query:

    ```http
    DELETE https://graph.microsoft.com/v1.0/policies/homeRealmDiscoveryPolicies/{policy objectID}
    ```	
::: zone-end

## Next steps

[Prevent sign-in auto-acceleration](prevent-domain-hints-with-home-realm-discovery.md).
