---
title: Configure sign-in auto-acceleration for an application using a Home Realm Discovery policy | Microsoft Docs
description: Learn how to configure Home Realm Discovery policy for Azure Active Directory authentication for federated users, including auto-acceleration and domain hints.
services: active-directory
documentationcenter: 
author: msmimart
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 04/08/2019
ms.author: mimart
ms.custom: seoapril2019
ms.collection: M365-identity-device-management
---

# Configure Azure Active Directory sign in behavior for an application by using a Home Realm Discovery policy

This article provides an introduction to configuring Azure Active Directory authentication behavior for federated users. It covers configuration of auto-acceleration and authentication restrictions for users in federated domains.

## Home Realm Discovery
Home Realm Discovery (HRD) is the process that allows Azure Active Directory (Azure AD) to determine where a user needs to authenticate at sign-in time.  When a user signs in to an Azure AD tenant to access a resource, or to the Azure AD common sign-in page, they type a user name (UPN). Azure AD uses that to discover where the user needs to sign in. 

The user might need to be taken to one of the following locations to be authenticated:

- The home tenant of the user (might be the same tenant as the resource that the user is attempting to access). 

- Microsoft account.  The user is a guest in the resource tenant.

-  An on-premises identity provider such as Active Directory Federation Services (AD FS).

- Another identity provider that's federated with the Azure AD tenant.

## Auto-acceleration 
Some organizations configure domains in their Azure Active Directory tenant to federate with another IdP, such as AD FS for user authentication.  

When a user signs into an application, they are first presented with an Azure AD sign-in page. After they have typed their UPN, if they are in a federated domain they are then taken to the sign-in page of the IdP serving that domain. Under certain circumstances, administrators might want to direct users to the sign-in page when they're signing in to specific applications. 

As a result users can skip the initial Azure Active Directory page. This process is referred to as “sign-in auto-acceleration.”

In cases where the tenant is federated to another IdP for sign-in, auto-acceleration makes user sign-in more streamlined.  You can configure auto-acceleration for individual applications.

>[!NOTE]
>If you configure an application for auto-acceleration, guest users cannot sign in. If you take a user straight to a federated IdP for authentication, there is no way to for them to get back to the Azure Active Directory sign-in page. Guest users, who might need to be directed to other tenants or an external IdP such as a Microsoft account, can't sign in to that application because they're skipping the Home Realm Discovery step.  

There are two ways to control auto-acceleration to a federated IdP:   

- Use a domain hint on authentication requests for an application. 
- Configure a Home Realm Discovery policy to enable auto-acceleration.

### Domain hints	
Domain hints are directives that are included in the authentication request from an application. They can be used to accelerate the user to their federated IdP sign-in page. Or they can be used by a multi-tenant application to accelerate the user straight to the branded Azure AD sign-in page for their tenant.  

For example, the application "largeapp.com" might enable their customers to access the application at a custom URL "contoso.largeapp.com." The app might also include a domain hint to contoso.com in the authentication request. 

Domain hint syntax varies depending on the protocol that's used, and it's typically configured in the application.

**WS-Federation**:  whr=contoso.com in the query string.

**SAML**:  Either a SAML authentication request that contains a domain hint or a query string whr=contoso.com.

**Open ID Connect**: A query string domain_hint=contoso.com. 

If a domain hint is included in the authentication request from the application, and the tenant is federated with that domain, Azure AD attempts to redirect sign-in to the IdP that's configured for that domain. 

If the domain hint doesn’t refer to a verified federated domain, it is ignored and normal Home Realm Discovery is invoked.

For more information about auto-acceleration using the domain hints that are supported by Azure Active Directory, see the [Enterprise Mobility + Security blog](https://cloudblogs.microsoft.com/enterprisemobility/2015/02/11/using-azure-ad-to-land-users-on-their-custom-login-page-from-within-your-app/).

>[!NOTE]
>If a domain hint is included in an authentication request, its presence overrides auto-acceleration that is set for the application in HRD policy.

### Home Realm Discovery policy for auto-acceleration
Some applications do not provide a way to configure the authentication request they emit. In these cases, it’s not possible to use domain hints to control auto-acceleration. Auto-acceleration can be configured via policy to achieve the same behavior.  

## Enable direct authentication for legacy applications
Best practice is for applications to use AAD libraries and interactive sign-in to authenticate users. The libraries take care of the federated user flows.  Sometimes legacy applications aren't written to understand federation. They don't perform home realm discovery and do not interact with the correct federated endpoint to authenticate a user. If you choose to, you can use HRD Policy to enable specific legacy applications that submit username/password credentials to authenticate directly with Azure Active Directory. Password Hash Sync must be enabled. 

> [!IMPORTANT]
> Only enable direct authentication if you have Password Hash Sync turned on and you know it's okay to authenticate this application without any policies implemented by your on-premises IdP. If you turn off Password Hash Sync, or turn off Directory Synchronization with AD Connect for any reason, you should remove this policy to prevent the possibility of direct authentication using a stale password hash.

## Set HRD policy
There are three steps to setting HRD policy on an application for federated sign-in auto-acceleration or direct cloud-based applications:

1. Create an HRD policy.

2. Locate the service principal to which to attach the policy.

3. Attach the policy to the service principal. 

Policies only take effect for a specific application when they are attached to a service principal. 

Only one HRD policy can be active on a service principal at any one time.  

You can use either the Microsoft Azure Active Directory Graph API directly, or the Azure Active Directory PowerShell cmdlets to create and manage HRD policy.

The Graph API that manipulates policy is described in the [Operations on policy](https://msdn.microsoft.com/library/azure/ad/graph/api/policy-operations) article on MSDN.

Following is an example HRD policy definition:
    
 ```
   {  
    "HomeRealmDiscoveryPolicy":
    {  
    "AccelerateToFederatedDomain":true,
    "PreferredDomain":"federated.example.edu",
    "AllowCloudPasswordValidation":true
    }
   }
```

The policy type is "HomeRealmDiscoveryPolicy."

**AccelerateToFederatedDomain** is optional. If **AccelerateToFederatedDomain** is false, the policy has no effect on auto-acceleration. If **AccelerateToFederatedDomain** is true and there is only one verified and federated domain in the tenant, then users will be taken straight to the federated IdP for sign in. If it is true and there is more than one verified domain in the tenant, **PreferredDomain** must be specified.

**PreferredDomain** is optional. **PreferredDomain** should indicate a domain to which to accelerate. It can be omitted if the tenant has only one federated domain.  If it is omitted, and there is more than one verified federated domain, the policy has no effect.

 If **PreferredDomain** is specified, it must match a verified, federated domain for the tenant. All users of the application must be able to sign in to that domain.

**AllowCloudPasswordValidation** is optional. If **AllowCloudPasswordValidation** is true then the application is allowed to authenticate a federated user by presenting username/password credentials directly to the Azure Active Directory token endpoint. This only works if Password Hash Sync is enabled.

### Priority and evaluation of HRD policies
HRD policies can be created and then assigned to specific organizations and service principals. This means that it is possible for multiple policies to apply to a specific application. The HRD policy that takes effect follows these rules:


- If a domain hint is present in the authentication request, then any HRD policy is ignored for auto-acceleration. The behavior that's specified by the domain hint is used.

- Otherwise, if a policy is explicitly assigned to the service principal, it is enforced. 

- If there is no domain hint, and no policy is explicitly assigned to the service principal, a policy that's explicitly assigned to the parent organization of the service principal is enforced. 

- If there is no domain hint, and no policy has been assigned to the service principal or the organization, the default HRD behavior is used.

## Tutorial for setting HRD policy on an application 
We'll use Azure AD PowerShell cmdlets to walk through a few scenarios, including:


- Setting up HRD policy to do auto-acceleration for an application in a tenant with a single federated domain.

- Setting up HRD policy to do auto-acceleration  for an application to one of several domains that are verified for your tenant.

- Setting up HRD policy to enable a legacy application to do direct username/password authentication to Azure Active Directory for a federated user.

- Listing the applications for which a policy is configured.


### Prerequisites
In the following examples, you create, update, link, and delete policies on application service principals in Azure AD.

1.	To begin, download the latest Azure AD PowerShell cmdlet preview. 

2.	After you have downloaded the Azure AD PowerShell cmdlets, run the Connect command to sign in to Azure AD with your admin account:

    ``` powershell
    Connect-AzureAD -Confirm
    ```
3.	Run the following command to see all the policies in your organization:

    ``` powershell
    Get-AzureADPolicy
    ```

If nothing is returned, it means you have no policies created in your tenant.

### Example: Set HRD policy for an application 

In this example, you create a policy that when it is assigned to an application either: 
- Auto-accelerates users to an AD FS sign-in screen when they are signing in to an application when there is a single domain in your tenant. 
- Auto-accelerates users to an AD FS sign-in screen there is more than one federated domain in your tenant.
- Enables non-interactive username/password sign in directly to Azure Active Directory for federated users for the applications the policy is assigned to.

#### Step 1: Create an HRD policy

The following policy auto-accelerates users to an AD FS sign-in screen when they are signing in to an application when there is a single domain in your tenant.

``` powershell
New-AzureADPolicy -Definition @("{`"HomeRealmDiscoveryPolicy`":{`"AccelerateToFederatedDomain`":true}}") -DisplayName BasicAutoAccelerationPolicy -Type HomeRealmDiscoveryPolicy
```
The following policy auto-accelerates users to an AD FS sign-in screen there is more than one federated domain in your tenant. If you have more than one federated domain that authenticates users for applications, you need specify the domain to auto-accelerate.

``` powershell
New-AzureADPolicy -Definition @("{`"HomeRealmDiscoveryPolicy`":{`"AccelerateToFederatedDomain`":true, `"PreferredDomain`":`"federated.example.edu`"}}") -DisplayName MultiDomainAutoAccelerationPolicy -Type HomeRealmDiscoveryPolicy
```

To create a policy to enable username/password authentication for federated users directly with Azure Active Directory for specific applications, run the following command:

``` powershell
New-AzureADPolicy -Definition @("{`"HomeRealmDiscoveryPolicy`":{`"AllowCloudPasswordValidation`":true}}") -DisplayName EnableDirectAuthPolicy -Type HomeRealmDiscoveryPolicy
```


To see your new policy and get its **ObjectID**, run the following command:

``` powershell
Get-AzureADPolicy
```


To apply the HRD policy after you have created it, you can assign it to multiple application service principals.

#### Step 2: Locate the service principal to which to assign the policy  
You need the **ObjectID** of the service principals to which you want to assign the policy. There are several ways to find the **ObjectID** of service principals.    

You can use the portal, or you can query [Microsoft Graph](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#serviceprincipal-entity). You can also go to the [Graph Explorer Tool](https://developer.microsoft.com/graph/graph-explorer) and sign in to your Azure AD account to see all your organization's service principals. 

Because you are using PowerShell, you can use the following cmdlet to list the service principals and their IDs.

``` powershell
Get-AzureADServicePrincipal
```

#### Step 3: Assign the policy to your service principal  
After you have the **ObjectID** of the service principal of the application for which you want to configure auto-acceleration, run the following command. This command associates the HRD policy that you created in step 1 with the service principal that you located in step 2.

``` powershell
Add-AzureADServicePrincipalPolicy -Id <ObjectID of the Service Principal> -RefObjectId <ObjectId of the Policy>
```

You can repeat this command for each service principal to which you want to add the policy.

In the case where an application already has a HomeRealmDiscovery policy assigned, you won’t be able to add a second one.  In that case, change the definition of the Home Realm Discovery policy that is assigned to the application to add additional parameters.

#### Step 4: Check which application service principals your HRD policy is assigned to
To check which applications have HRD policy configured, use the **Get-AzureADPolicyAppliedObject** cmdlet. Pass it the **ObjectID** of the policy that you want to check on.

``` powershell
Get-AzureADPolicyAppliedObject -id <ObjectId of the Policy>
```
#### Step 5: You're done!
Try the application to check that the new policy is working.

### Example: List the applications for which HRD policy is configured

#### Step 1: List all policies that were created in your organization 

``` powershell
Get-AzureADPolicy
```

Note the **ObjectID** of the policy that you want to list assignments for.

#### Step 2: List the service principals to which the policy is assigned  

``` powershell
Get-AzureADPolicyAppliedObject -id <ObjectId of the Policy>
```

### Example: Remove an HRD policy for an application
#### Step 1: Get the ObjectID
Use the previous example to get the **ObjectID** of the policy, and that of the application service principal from which you want to remove it. 

#### Step 2: Remove the policy assignment from the application service principal  

``` powershell
Remove-AzureADApplicationPolicy -id <ObjectId of the Service Principal>  -PolicyId <ObjectId of the policy>
```

#### Step 3: Check removal by listing the service principals to which the policy is assigned 

``` powershell
Get-AzureADPolicyAppliedObject -id <ObjectId of the Policy>
```
## Next steps
- For more information about how authentication works in Azure AD, see [Authentication scenarios for Azure AD](../develop/authentication-scenarios.md).
- For more information about user single sign-on, see [Application access and single sign-on with Azure Active Directory](configure-single-sign-on-portal.md).
- Visit the [Active Directory developer's guide](../develop/v1-overview.md) for an overview of all developer-related content.
