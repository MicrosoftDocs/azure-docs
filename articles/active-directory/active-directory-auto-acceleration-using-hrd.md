---
title: Configure sign-in auto-acceleration for an application using Home Realm Discovery Policy | Microsoft Docs
description: Explains what an Azure AD tenant is, and how to manage Azure through Azure Active Directory.
services: active-directory
documentationcenter: 
author: billmath
manager: femila
ms.service: active-directory
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: it-pro
ms.date: 11/09/2017
ms.author: billmath
---

# Configure sign-in auto-acceleration for an application by using home realm discovery (HRD) policy

The following document provides an introduction to home realm discovery and auto-acceleration.

## Home realm discovery
Home Realm Discovery (HRD) is the process that allows Azure Active Directory (Azure AD) to determine, at sign-in time, where a user needs to authenticate.  When signing in to an Azure AD tenant to access a resource, or to the Azure AD common sign-in page, the user types a user name (UPN). Azure AD uses that to discover where the user needs to sign in. 

The user might need to be taken to one of the following locations to be authenticated:

- The home tenant of the user (might be the same tenant as the resource that the user is attempting to access). 

- Microsoft account.  The user is a guest in the resource tenant.

- Another identity provider that's federated with the Azure AD tenant.

-  An on-premises identity provider such as Active Directory Federation Services (AD FS), for example.

## Auto-acceleration 
Some organizations configure their Azure Active Directory tenant to federate with another IdP, such as AD FS for user authentication.  

In these cases, when signing into an application, the user is first presented with an Azure AD sign-in page. After they have typed their UPN, they are then taken to the IdP sign-in page.  In circumstances where it makes sense, administrators might want to direct users to the sign-in page when they're signing in to specific applications, and have them skip the initial Azure Active Directory page. This is referred to as “sign-in auto-acceleration”.

In cases where the tenant is federated to another IdP for sign-in, enabling auto-acceleration makes user sign-in more streamlined.  You can configure auto-acceleration for individual applications.

>[!NOTE]
>If you configure an application for auto-acceleration, guest users cannot sign in. Taking the user straight to a federated IdP for authentication is a one-way street, because there is no way to get back to the Azure Active Directory sign-in page. Guest users, who might need to be directed to other tenants or an external IdP such as a Microsoft account to be authenticated, can't sign in to that application because they're skipping the Home Realm Discovery step.  

There are two ways to control auto-acceleration to a federated IdP:   

- Use a domain hint on authentication requests for an application. 
- Configure a Home Realm Discovery policy to enable auto-acceleration.

## Domain hints	
Domain hints are directives that are included in the authentication request from an application. They can be used to accelerate the user to their federated IdP sign-in page. Or they can be used by a multi-tenant application to accelerate the user straight to the branded Azure AD sign-in page for their tenant.  

For example, the application "largeapp.com" might enable their customers to access the application at a custom URL "contoso.largeapp.com," and might include a domain hint to contoso.com in the authentication request. 

Domain hint syntax varies depending on the protocol that's used, and it's typically configured in the application.

**WS-Federation**:  whr=contoso.com in the query string.

**SAML**:  Either a SAML authentication request that contains a domain hint or a query string whr=contoso.com.

**Open ID Connect**: A query string domain_hint=contoso.com. 

If a domain hint is included in the authentication request from the application, and the tenant is federated with that domain, Azure AD attempts to redirect sign-in to the IdP that's configured for that domain. 

If the domain hint doesn’t refer to a verified federated domain, it is ignored and normal home realm discovery is invoked.

For more information, see [Enterprise Mobility + Security blog](https://cloudblogs.microsoft.com/enterprisemobility/2015/02/11/using-azure-ad-to-land-users-on-their-custom-login-page-from-within-your-app/) for more information about auto-acceleration using the domain hints that are supported by Azure Active Directory.

>[!NOTE]
>If a domain hint is included in an authentication request, its presence overrides any HRD policy that is set for the application.

## Home realm discovery policy
Some applications do not provide a way to configure the authentication request they emit, and in these cases it’s not possible to use domain hints to control auto-acceleration.   Auto-acceleration can be configured via policy to achieve the same behavior.  

### Set HRD policy
There are three steps to setting sign-in auto-acceleration on an application.


1. Creating an HRD policy for auto-acceleration.

2. Locating the service principle to which to attach the policy.

3. Attaching the policy to the service principle. Policies might have been created in a tenant, but they don’t have any effect until they are attached to an entity. 

An HRD policy can be attached to a service principal, and only one HRD policy can be active on a given entity at any one time.  

You can use either the Microsoft Azure Active Directory Graph API directly, or the Azure Active Directory PowerShell cmdlets to set up auto-acceleration using HRD policy.

The Graph API that manipulates policy is described on MSDN at [Operations on policy](https://msdn.microsoft.com/library/azure/ad/graph/api/policy-operations).

Following is an example HRD policy definition:
    
 ```
   {  
    "HomeRealmDiscoveryPolicy":
    {  
    "AccelerateToFederatedDomain":true,
    "PreferredDomain":"federated.example.edu"
    }
   }
```

The policy type is "HomeRealmDiscoveryPolicy."

If **AccelerateToFederatedDomain** is false, the policy has no effect.

**PreferredDomain** should indicate a domain to which to accelerate. It can be omitted if the tenant has only one federated domain.  If it is omitted, and there is more than one verified, federated domain, the policy has no effect.

If **PreferredDomain** is specified, it must match a verified, federated domain for the tenant. All users of the application must be able to sign in to that domain.

### Priority and evaluation of HRD policies
HRD policies can be created and then assigned to specific organizations and service principals. This means that it is possible for multiple policies to apply to a specific application. The HRD policy that takes effect follows these rules:


- If a domain hint is present in the authentication request, then any HRD policy is ignored and the behavior that's specified by the domain hint is used.

- Otherwise, if a policy is explicitly assigned to the service principal, it is enforced. 

- If there is no domain hint, and no policy is explicitly assigned to the service principal, a policy that's explicitly assigned to the parent organization of the service principal is enforced. 

- If there is no domain hint, and no policy has been assigned to the service principal or the organization, the default HRD behavior is used.

## Tutorial for setting sign-in auto-acceleration on an application by using HRD policy with Azure Active Directory PowerShell cmdlets
We'll walk through a few scenarios, including:


- Setting up auto-acceleration for an application for a tenant with a single federated domain.

- Setting up auto-acceleration for an application to one of several domains that are verified for your tenant.

- Listing the applications for which a policy is configured.

### Prerequisites
In the following examples, you create, update, link, and delete policies on application service principals in Azure AD.

1.	To begin, download the latest Azure AD PowerShell cmdlet preview. 

2.	After you have downloaded the Azure AD PowerShell cmdlets, run the Connect command to sign into Azure AD with your admin account.

    ``` powershell
    Connect-AzureAD -Confirm
    ```
3.	Run the following command to see all the policies in your organization:

    ``` powershell
    Get-AzureADPolicy
    ```

If nothing is returned, it means you have no policies created in your tenant.

### Example: Set auto-acceleration for an application 
In this example, you create a policy that auto-accelerates users to an AD FS sign-in screen when they are signing in to an application. This is done without them having to enter a username at the Azure AD sign-in page first. 

#### Step 1: Create an HRD policy
``` powershell
New-AzureADPoly -Definition @("{`"HomeRealmDiscoveryPolicy`":{`"AccelerateToFederatedDomain`":true}}") -DisplayName BasicAutoAccelerationPolicy -Type HomeRealmDiscoveryPolicy
```

If you have a single federated domain that authenticates users for applications, you only need to create one HRD policy.  

To see your new policy and get its **ObjectID**, run the following command:

``` powershell
Get-AzureADPolicy
```


After you have an HRD policy, to enable auto-acceleration, you can assign it to multiple application service principles.

#### Step 2: Locate the service principal to which to assign the policy.  
You need the **ObjectID** of the service principals to which you want to assign the policy. There are several ways to find the **ObjectID** of service principals.    

You can use the portal or you can query the [Microsoft Graph](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#serviceprincipal-entity). You can also go to the [Graph Explorer Tool](https://graphexplorer.cloudapp.net/) and sign into your Azure AD account to see all your organization's service principals. Since you are using PowerShell, you can use the get-AzureADServicePrincipal cmdlet to list the service principles and their IDs.

#### Step 3: Assign the policy to your service principal  
After you have the **ObjectID** of the service principal of the application for which you want to configure auto-acceleration, run the following command to associate the HRD policy that you created in step 1 with the service principal that you located in step 2.

``` powershell
Add-AzureADServicePrincipalPolicy -Id <ObjectID of the Service Principal> -RefObjectId <ObjectId of the Policy>
```

You can repeat this command for each service principal to which you want to add the policy.

#### Step 4: Check which application service principals your auto-acceleration policy is assigned to.
To check which applications have auto-acceleration policy configured, use the **Get-AzureADPolicyAppliedObject** cmdlet. Pass it the **ObjectID** of the policy that you want to check on.

``` powershell
Get-AzureADPolicyAppliedObject -ObjectId <ObjectId of the Policy>
```
#### Step 5: You're done!
Try the application to check that the new policy is working.

### Example: List the applications for which an auto-acceleration policy is configured

#### Step 1: List all policies that were created in your organization. 

``` powershell
Get-AzureADPolicy
```

Note the **ObjectID** of the policy you wish to list assignments for.

#### Step 2: List the service principals to which the policy is assigned.   

``` powershell
Get-AzureADPolicyAppliedObject -ObjectId <ObjectId of the Policy>
```

### Example: Remove an auto-acceleration policy for an application
#### Step 1: Use the previous example to get the **ObjectID** of the policy, and that of the application service principal from which you wish to remove it. 

#### Step 2: Remove the policy assignment from the application service principal.  

``` powershell
Remove-AzureADApplicationPolicy -ObjectId <ObjectId of the Service Principal>  -PolicyId <ObjectId of the policy>
```

#### Step 3: Check removal by listing the service principals to which the policy is assigned. 

``` powershell
Get-AzureADPolicyAppliedObject -ObjectId <ObjectId of the Policy>
```
## Next steps
- For more information about how authentication works in Azure AD, see [Authentication scenarios for Azure AD](develop/active-directory-authentication-scenarios.md).
- For more information about user single sign-on, see [Application access and single sign-on with Azure Active Directory](active-directory-enterprise-apps-manage-sso.md)
- Visit the [Active Directory developer's guide](develop/active-directory-developers-guide.md) for an overview of all developer-related content.
