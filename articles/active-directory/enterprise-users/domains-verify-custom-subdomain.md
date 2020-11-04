---
title: Add and verify custom domain names - Azure Active Directory | Microsoft Docs
description: Mto manage child domain authentication settings independently from root domain settings in Azure Active Directory
services: active-directory
documentationcenter: ''
author: curtand
manager: daveba

ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.topic: how-to
ms.date: 11/04/2020
ms.author: curtand
ms.reviewer: elkuzmen

ms.custom: it-pro

ms.collection: M365-identity-device-management
---

# Add a custom subdomain name as a managed domain in Azure ACtive Directory

After a root domain is added to Azure Active Directory (Azure AD), all subsequent subdomains added to that root in your Azure AD organization automatically inherit the authentication setting from the root domain. However, if you want to manage domain authentication settings independently from the root domain settings, you can now with the Microsoft Graph API. For example, if you have a federated root domain such as contoso.com, this article can help you verify a subdomain such as child.contoso.com as managed instead of federated.

In the Azure AD portal, when the parent domain is federated and the admin tries to verify a managed subdomain on the **Custom domain names** page, you'll get a 'Failed to add domain' error with the reason "One or more properties contains invalid values". If the administrator tries to add this subdomain from the Microsoft 365 admin center, they will receive a similar error.

## How to verify a custom subdomain

Because subdomains by default inherit the authentication type of the root domain, administrators must promote the subdomain to a root domain instead of a child subdomain in Azure AD using Graph API so they can set the authenticationType to managed.

1. Verify the new child domain with its root domain's default authentication type using PowerShell.

```powershell
New-MsolDomain -Name "child.mydomain.com" -Authentication Federated
```

1. Use [Azure AD Graph Explorer](https://graphexplorer.azurewebsites.net) to GET the domain and see the domain isn't root so it has to inherit its root domain authentication type. For example"

```HTTP
GET: 
https://graph.windows.net/{{tenant_id}}/domains?api-version=1.6

Return:
     {
         "authenticationType": "Federated",
         "availabilityStatus": null,
         "isAdminManaged": true,
         "isDefault": false,
         "isDefaultForCloudRedirections": false,
         "isInitial": false,
         "isRoot": false,          <---------------- Not a root domain, so it inherits parent domain's authentication type (federated)
         "isVerified": true,
         "name": "child.mydomain.com",
         "supportedServices": [],
         "forceDeleteState": null,
         "state": null,
         "passwordValidityPeriodInDays": null,
         "passwordNotificationWindowInDays": null
     },
```

## Use Azure AD Graph Explorer API to make this a root domain

```HTTP
POST https://graph.windows.net/{tenant_id}/domains/child.mydomain.com/promote?api-version=1.6
```

Now Set to a managed domain using Set-MsolDomainAuthentication

```powershell
Set-MsolDomainAuthentication -DomainName child.mydomain.com -Authentication Managed
```

Verify via GET in Azure AD Graph Explorer that subdomain authentication type is now managed:

```HTTP
GET https://graph.windows.net/{{tenant_id} }/domains?api-version=1.6

Return:
     {
         "authenticationType": "Managed",   <---------- Now this domain is successfully added as Managed and not inheriting Federated status
         "availabilityStatus": null,
         "isAdminManaged": true,
         "isDefault": false,
         "isDefaultForCloudRedirections": false,
         "isInitial": false,
         "isRoot": true,   <------------------------------ Also a root domain, so not inheriting from parent domain any longer
         "isVerified": true,
         "name": "child.mydomain.com",
         "supportedServices": [
             "Email",
             "OfficeCommunicationsOnline",
             "Intune"
         ],
         "forceDeleteState": null,
         "state": null,
         "passwordValidityPeriodInDays": null,
         "passwordNotificationWindowInDays": null }
```

> [!Note]
>This process can be used only if the child domain does not already have users referencing the domain. If the child domain does already have users referencing it, open an [Incident Management ticket](https://aka.ms/icm) and transfer it to **Azure AD Distributed Directory Services** > **Customer Escalations**.

## Next steps

## Next steps

- [Add custom domain names](../fundamentals/add-custom-domain.md?context=azure%2factive-directory%2fusers-groups-roles%2fcontext%2fugr-context)
- [ForceDelete a custom domain name with Microsoft Graph API](/graph/api/domain-forcedelete?view=graph-rest-beta)