---
title: Securing service principals in Azure Active Directory
description: Find, assess, and secure service principals.
services: active-directory
author: janicericketts
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 11/28/2022
ms.author: jricketts
ms.reviewer: ajburnle
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# Securing service principals 

An Azure Active Directory (Azure AD) [service principal](../develop/app-objects-and-service-principals.md) is the local representation of an application object in a single tenant or directory. It functions as the identity of the application instance. Service principals define who can access the application, and what resources the application can access. A service principal is created in each tenant where the application is used, and references the globally unique application object. The tenant secures the service principal sign-in and access to resources.  

### Tenant-service principal relationships

A single-tenant application has one service principal in its home tenant. A multi-tenant web application or API requires a service principal in each tenant. A service principal is created when a user from that tenant consents to use of the application or API. This consent creates a one-to-many relationship between the multi-tenant application and its associated service principals.

A multi-tenant application is homed in a single tenant and has instances in other tenants. Most software-as-a-service (SaaS) applications accommodate multi-tenancy. Use service principals to ensure the needed security posture for the application and its users in single-tenant and multi-tenant scenarios.

## ApplicationID and ObjectID

An application instance has two properties: the ApplicationID (also known as ClientID) and the ObjectID.

> [!NOTE] 
> It's possible the terms application and service principal are used interchangeably when referring to an application in the context of authentication-related tasks. However, they are two representations of applications in Azure AD.
 
The ApplicationID represents the global application and is the same for application instances across tenants. The ObjectID is a unique value for an application object. As with users, groups, and other resources, the ObjectID helps to identify an application instance in Azure AD.

To learn more, see [Application and service principal relationship](../develop/app-objects-and-service-principals.md).

You can create an application and its service principal object (ObjectID) in a tenant using Azure PowerShell, Azure CLI, Microsoft Graph, the Azure portal, and other tools. 

![Screen shot showing a new application registration, with the Application ID and Object ID fields highlighted.](./media/securing-service-accounts/secure-principal-image-1.png)

## Service principal authentication

When using service principals—client certificates and client secrets, there are two mechanisms for authentication. 

![ Screen shot of New App page showing the Certificates and client secrets areas highlighted.](./media/securing-service-accounts/secure-principal-certificates.png)

Certificates are more secure, therefore use them, if possible. Unlike client secrets, client certificates can't be embedded in code, accidentally. When possible, use Azure Key Vault for certificate and secrets management to encrypt the following assets with keys protected by hardware security modules:

* Authentication keys

* Storage account keys

* Data encryption keys

* .pfx files

* Passwords 

For more information on Azure Key Vault and how to use it for certificate and secret management, see 
[About Azure Key Vault](../../key-vault/general/overview.md) and [Assign a Key Vault access policy using the Azure portal](../../key-vault/general/assign-access-policy-portal.md). 

 ### Challenges and mitigations
 
Use the following table to match challenges and mitigations, when using service principals.

| Challenges​| Mitigations​ |
| - | - |
| Access reviews for service principals assigned to privileged roles| This functionality is in preview, and not widely available |
| Reviews service principal access| Manual check of resource access control list using the Azure portal |
| Over-permissioned service principals| When you create automation service accounts or or service principals, provide permissions required for the task. Evaluate service principals to reduce privileges |
|Identify modifications to service principal credentials or authentication methods |Use the Sensitive Operations Report workbook to mitigate. See also the Tech Community blog post [Azure AD workbook to help you assess Solorigate risk](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/azure-ad-workbook-to-help-you-assess-solorigate-risk/ba-p/2010718).|

## Find accounts using service principals

Run the following commands to find accounts using service principals with Azure CLI or PowerShell.

Azure CLI:

`az ad sp list`

PowerShell:

`Get-AzureADServicePrincipal -All:$true` 

For more information see [Get-AzureADServicePrincipal](/powershell/module/azuread/get-azureadserviceprincipal).

## Assess service principal security

To assess the security of your service principals, ensure you evaluate privileges and credential storage.

Mitigate potential challenges using the following information.

|Challenges | Mitigations|
| - | - |
| Detect the user who consented to a multi-tenant app, and detect illicit consent grants to a multi-tenant app | Run the following PowerShell to find multi-tenant apps.<br>`Get-AzureADServicePrincipal -All:$true ? {$_.Tags -eq WindowsAzureActiveDirectoryIntegratedApp"}`<br>Disable user consent. <br>Allow user consent from verified publishers, for selected permissions (recommended) <br> Configure them in the user context. Use their tokens to trigger the service principal.|
|Use of a hard-coded shared secret in a script using a service principal|Use a certificate|
|Tracking who uses the certificate or the secret​| Monitor the service principal sign-ins using the Azure AD sign-in logs|
Can't manage service principal sign-in with Conditional Access| Monitor the sign-ins using the Azure AD sign-in logs
| Contributor is the default Azure role-based access control (RBAC) role|Evaluate needs and apply the role with the least possible permissions|

## Move from a user account to a service principal​  

If you're using an Azure user account as a service principal, evaluate if you can move to a [Managed Identity](../../app-service/overview-managed-identity.md?tabs=dotnet) or a service principal. If you can't use a managed identity, provision a service principal with enough permissions and scope to run the required tasks. You can create a service principal by [registering an application](../develop/howto-create-service-principal-portal.md), or with [PowerShell](../develop/howto-authenticate-service-principal-powershell.md).

When using Microsoft Graph, check the API documentation. See, [Create an Azure service principal](/powershell/azure/create-azure-service-principal-azureps). Ensure the permission type for application is supported.

## Next steps

Learn more about service principals:

[Create a service principal](../develop/howto-create-service-principal-portal.md)

[Monitor service principal sign-ins](../reports-monitoring/concept-sign-ins.md)

Learn more about securing service accounts:

[Introduction to Azure service accounts](service-accounts-introduction-azure.md)

[Securing managed identities](service-accounts-managed-identities.md)

[Governing Azure service accounts](service-accounts-governing-azure.md)

[Introduction to on-premises service accounts](service-accounts-on-premises.md)

Conditional Access:

Use Conditional Access to block service principals from untrusted locations. See, [Create a location-based Conditional Access policy](/azure/active-directory/conditional-access/workload-identity#create-a-location-based-conditional-access-policy).

