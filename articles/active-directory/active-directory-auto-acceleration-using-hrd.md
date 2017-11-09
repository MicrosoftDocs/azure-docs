---
title: Configuring Sign-In Auto-Acceleration for an application using Home Realm Discovery Policy | Microsoft Docs
description: Explains what an Azure AD tenant is, and how to manage Azure through Azure Active Directory
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

# Configuring Sign-In Auto-Acceleration for an application using Home Realm Discovery (HRD) Policy

## Introduction to Home Realm Discovery and Auto-Acceleration
The following document provides an introduction to home realm discovery and auto-acceleration.

### Home Realm Discovery
Home Realm Discovery is the process that allows Azure Active Directory to determine, at sign-in time, where a user needs to authenticate.  When signing in to an Azure AD tenant to access a resource, or the Azure AD common sign-in page, the user types a user name (UPN).  Azure AD uses that to discover where the user needs to sign-in.   The user may need to be taken to one of the following to be authenticated:

- The home tenant of the user (may be the same tenant as the resource the user is attempting to access). 
- Microsoft account.   The user is a guest in the resource tenant
- Another Identity provider federated with the Azure AD tenant.  An on-premise identity provider such as AD FS for instance.

### Auto-Acceleration 
Some organizations configure their Azure Active Directory tenant to federate with another IdP, such as AD FS, for user authentication.  In these cases, when signing into an application, the user is first presented with an Azure AD sign-in page and once they have typed their UPN they are then taken to the IdP sign-in page.  In circumstances where it makes sense, Administrators may wish to have users directed straight to the sign-in page when signing in to specific applications, skipping the initial Azure Active Directory page. This is referred to as “sign-in auto-acceleration”.

In cases where the tenant is federated to another IdP for sign-in, enabling auto-acceleration makes user sign-in more streamlined in cases where you know that everyone signing in can be authenticated by that IdP.  You can configure auto-acceleration for individual applications.

>[NOTE!]
>If you configure an application for auto-acceleration, guest users cannot sign-in. Taking the user straight to a federated IdP for authentication is a one-way street as there is no way to get back to the Azure Active Directory sign-in page.  Guest users, who may need to be directed to other tenants or an external IdP like Microsoft account to be authenticated, won’t be able to sign in to that application as the Home Realm Discovery step is being skipped.  

There are two ways to control auto-acceleration to a federated IdP.  Either:   

- Use a domain hint on authentication requests for an application 
- Configure a HomeRealmDiscovery policy to enable auto-acceleration

## Domain Hints	
Domain hints are directives included in the authentication request from an application.  They can be used to accelerate the user to their federated IdP sign-in page or they can be used by a multi-tenant application to accelerate the user straight to the branded Azure AD sign-in page for their tenant.  For example, an application largeapp.com might enable their customers to access the application at a custom URL contoso.largeapp.com and might include a domain hint to Contoso.com in the authentication request. Domain hint syntax varies depending on the protocol being used and they are typically configured in the application.

**WS-Federation**:  whr=contoso.com in the query string

**SAML**:  Either a SAML authentication request containing a domain hint, or a query string whr=contoso.com

**Open ID Connect**: A query string domain_hint=contoso.com 

If a domain hint is included in the authentication request from the application and the tenant is federated with that domain, Azure AD attempts to redirect sign-in to the IdP configured for that domain.  If the domain hint doesn’t refer to a verified federated domain, it is ignored and normal home realm discovery is invoked.

See this [blog post](https://cloudblogs.microsoft.com/enterprisemobility/2015/02/11/using-azure-ad-to-land-users-on-their-custom-login-page-from-within-your-app/) for more information on auto-acceleration using the domain hints supported by Azure Active Directory.

>[NOTE!]
>If a domain hint is included in an authentication request its presence overrides any HRD policy that is set for the application.

## Home Realm Discovery (HRD) Policy
Some applications do not provide a way to configure the authentication request they emit, and in these cases it’s not possible to use domain hints to control auto-acceleration.   Auto-acceleration can be configured via policy to achieve the same behavior.  

### Setting HRD Policy
There are three steps to setting sign-in auto-acceleration on an application


1. Creating an HRD policy for auto-acceleration
2. Locating the Service Principle to which to attach the policy
3. Attaching the policy to the service principle.  Policies may have been created in a tenant but they don’t have any effect until they are attached to an entity.  An HRD policy can be attached to a Service Principal and only one HRD policy can be active on a given entity at any one time.  

You can use either the Microsoft Azure Active Directory Graph API directly, or the Azure Active Directory PowerShell Cmdlets to set up auto-acceleration using HRD policy

The Graph API that manipulates policy is described [here](https://msdn.microsoft.com/library/azure/ad/graph/api/policy-operations).

Here’s an example HRD policy definition:
    
	```{  
    "HomeRealmDiscoveryPolicy":
    {  
    "AccelerateToFederatedDomain":true,
    "PreferredDomain":"federated.example.edu"
    }
    }```

The policy type is "HomeRealmDiscoveryPolicy".

If **AccelerateToFederatedDomain** is false then the policy has no effect 
**PreferredDomain** should indicate a domain to accelerate to and can be omitted in case the tenant has one and only one federated domain.  If it is omitted and there is more than one verified, federated domain, the policy has no effect.

If **PreferredDomain** is specified it must match a verified, federated domain for the tenant, and all the users of the application in question must be able to sign in at that domain.

### Priority and evaluation of HRD policies
HRD policies can be created and then assigned to specific organizations and service principals. This means that it is possible for multiple policies to apply to a specific application. The HRD policy that takes effect follows these rules:


- If a domain hint is present in the authentication request, then any HRD policy is ignored and the behavior specified by the domain hint is used.
- Otherwise, if a policy is explicitly assigned to the service principal, it is enforced. 
- If there is no domain hint and no policy is explicitly assigned to the service principal, a policy explicitly assigned to the parent organization of the service principal is enforced. 
- If there is no domain hint, and no policy has been assigned to the service principal or the organization, the default HRD behavior is used.

## Tutorial for setting sign-in auto-acceleration on an application using HRD policy with Azure Active Directory PowerShell Cmdlets
We'll walk through a few scenarios including:


- Setting up auto-acceleration for an application for a tenant with a single federated domain
- Setting up auto-acceleration for an application to one of several domains that are verified for your tenant
- Listing the applications for which a policy is configured

### Prerequisites
In the examples below you create, update, link, and delete policies on application service principals in Azure AD.

1.	To begin, download the latest Azure AD PowerShell Cmdlet Preview. 
2.	Once you have the Azure AD PowerShell Cmdlets, run the Connect command to sign into Azure AD with your admin account.

``` powershell
Connect-AzureAD -Confirm
```
3.	Run the following command to see all the policies in your organization.

``` powershell
Get-AzureADPolicy
```

If nothing is returned, you have no policies created in your tenant

### Example: Setting auto-acceleration for an application 
In this example, you create a policy that auto-accelerates users to an AD FS sign-in screen when signing in to an application.  This is done without them having to enter a username at the Azure AD sign-in page first. 

#### Step 1: Create an HRD Policy
``` powershell
New-AzureADPoly -Definition @("{`"HomeRealmDiscoveryPolicy`":{`"AccelerateToFederatedDomain`":true}}") -DisplayName BasicAutoAccelerationPolicy -Type HomeRealmDiscoveryPolicy
```

If you have a single federated domain that authenticates users for applications, you only need to create one HRD policy.  
To see your new policy and get its ObjectID, run the following command.

``` powershell
Get-AzureADPolicy
```


Once you have an HRD policy, to enable auto-acceleration, you can assign it to multiple application service principles.

#### Step 2: Locate the Service Principal to assign the policy to.  
You need the ObjectId of the service principals you want to assign the policy to. There are several ways to find the object ID of service principals.    

You can use the portal, you can query the [Microsoft Graph](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#serviceprincipal-entity) or go to our [Graph Explorer Tool](https://graphexplorer.cloudapp.net/) and sign into your Azure AD account to see all your organization's service principals, or since you are using powershell, you can use the get-AzureADServicePrincipal cmdlet to list the service principles and their Ids.

#### Step 3: Assign the policy to your service principal  
Once you have the ObjectId of the service principal of the application you want to configure auto-acceleration for, run the following command to associate the HRD policy you created in step 1 with the service principal you located in step 2.

``` powershell
Add-AzureADServicePrincipalPolicy -Id <ObjectID of the Service Principal> -RefObjectId <ObjectId of the Policy>
```

You can repeat this command for each Service Principal you want to add the policy to.

#### Step 4: Check which application service principals your auto-acceleration policy is assigned to
To check which applications have auto-acceleration policy configured use the Get-AzureADPolicyAppliedObject cmdlet and pass it the objectId of the policy you want to check on.

``` powershell
Get-AzureADPolicyAppliedObject -ObjectId <ObjectId of the Policy>
```
#### Step 5: You're Done!
Try the application to check that the new policy is working.

### Example: Listing the applications for which an auto-acceleration policy is configured

#### Step 1: List all policies created in your organization 

``` powershell
Get-AzureADPolicy
```

Note the **Object ID** of the policy you wish to list assignments for.

#### Step 2: List the Service Principals the policy is assigned to.  

``` powershell
Get-AzureADPolicyAppliedObject -ObjectId <ObjectId of the Policy>
```

### Example: Removing an auto-acceleration policy for an application
#### Step 1: Use the previous example to get the ObjectId of the policy, and that of the application service principal you wish to remove it from
#### Step 2: Remove the policy assignment from the application service principal.  

``` powershell
Remove-AzureADApplicationPolicy -ObjectId <ObjectId of the Service Principal>  -PolicyId <ObjectId of the policy>
```

#### Step 3: Check removal by listing the service principals the policy is assigned to 

``` powershell
Get-AzureADPolicyAppliedObject -ObjectId <ObjectId of the Policy>
```
## Next steps
- For more information on how authentication works in Azure AD, see [Authentication Scenarios for Azure AD](develop/active-directory-authentication-scenarios.md).
- For more information on user single sign-on see [Application access and single sign-on with Azure Active Directory](active-directory-enterprise-apps-manage-sso.md)
- Visit the [Active Directory developer's guide](develop/active-directory-developers-guide.md) for an overview of all developer-related content.
