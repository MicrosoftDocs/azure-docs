---
title: Change subdomain authentication type using PowerShell and Graph
description: Change default subdomain authentication settings inherited from root domain settings in Azure Active Directory.
services: active-directory
documentationcenter: ''
author: barclayn
manager: amycolannino
ms.service: active-directory
ms.subservice: enterprise-users
ms.workload: identity
ms.topic: how-to
ms.date: 06/23/2022
ms.author: barclayn
ms.reviewer: sumitp

ms.custom: it-pro

ms.collection: M365-identity-device-management
---

# Change subdomain authentication type in Azure Active Directory

After a root domain is added to Azure Active Directory (Azure AD), part of Microsoft Entra, all subsequent subdomains added to that root in your Azure AD organization automatically inherit the authentication setting from the root domain. However, if you want to manage domain authentication settings independently from the root domain settings, you can now with the Microsoft Graph API. For example, if you have a federated root domain such as contoso.com, this article can help you verify a subdomain such as child.contoso.com as managed instead of federated.

In the Azure portal, when the parent domain is federated and the admin tries to verify a managed subdomain on the **Custom domain names** page, you'll get a 'Failed to add domain' error with the reason "One or more properties contains invalid values." If you try to add this subdomain from the Microsoft 365 admin center, you will receive a similar error. For more information about the error, see [A child domain doesn't inherit parent domain changes in Office 365, Azure, or Intune](/office365/troubleshoot/administration/child-domain-fails-inherit-parent-domain-changes).

Because subdomains inherit the authentication type of the root domain by default, you must promote the subdomain to a root domain in Azure AD using the Microsoft Graph so you can set the authentication type to your desired type.

## Add the subdomain

1. Use PowerShell to add the new subdomain, which has its root domain's default authentication type. The Azure AD and Microsoft 365 admin centers don't yet support this operation.

   ```powershell
   New-MsolDomain -Name "child.mydomain.com" -Authentication Federated
   ```

1. Use the following example to GET the domain. Because the domain isn't a root domain, it inherits the root domain authentication type. Your command and results might look as follows, using your own tenant ID:

> [!Note]
> Issuing this request can be performed directly in [Graph Explorer](https://aka.ms/ge).

   ```http
   GET https://graph.microsoft.com/v1.0/domains/foo.contoso.com/
   
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

## Change subdomain to a root domain

Use the following command to promote the subdomain:

```http
POST https://graph.microsoft.com/v1.0/{tenant-id}/domains/foo.contoso.com/promote
```

### Promote command error conditions

Scenario | Method | Code | Message
-------- | ------ | ---- | -------
Invoking API with a subdomain whose parent domain is unverified | POST | 400 | Unverified domains cannot be promoted. Please verify the domain before promotion.
Invoking API with a federated verified subdomain with user references | POST | 400 | Promoting a subdomain with user references is not allowed. Please migrate the users to the current root domain before promotion of the subdomain.


### Change the subdomain authentication type

1. Use the following command to change the subdomain authentication type:

   ```powershell
   Set-MsolDomainAuthentication -DomainName child.mydomain.com -Authentication Managed
   ```

1. Verify via GET in Microsoft Graph API that subdomain authentication type is now managed:

   ```http
   GET https://graph.microsoft.com/v1.0/domains/foo.contoso.com/
   
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

## Next steps

- [Add custom domain names](../fundamentals/add-custom-domain.md?context=azure%2factive-directory%2fusers-groups-roles%2fcontext%2fugr-context)
- [Manage domain names](domains-manage.md)
- [ForceDelete a custom domain name with Microsoft Graph API](/graph/api/domain-forcedelete)
