---
title: Change subdomain authentication type using PowerShell and Graph - Azure Active Directory | Microsoft Docs
description: Change default subdomain authentication settings inherited from root domain settings in Azure Active Directory.
services: active-directory
documentationcenter: ''
author: curtand
manager: daveba

ms.service: active-directory
ms.subservice: enterprise-users
ms.workload: identity
ms.topic: how-to
ms.date: 04/18/2021
ms.author: curtand
ms.reviewer: sumitp

ms.custom: it-pro

ms.collection: M365-identity-device-management
---

# Change subdomain authentication type in Azure Active Directory

After a root domain is added to Azure Active Directory (Azure AD), all subsequent subdomains added to that root in your Azure AD organization automatically inherit the authentication setting from the root domain. However, if you want to manage domain authentication settings independently from the root domain settings, you can now with the Microsoft Graph API. For example, if you have a federated root domain such as contoso.com, this article can help you verify a subdomain such as child.contoso.com as managed instead of federated.

In the Azure AD portal, when the parent domain is federated and the admin tries to verify a managed subdomain on the **Custom domain names** page, you'll get a 'Failed to add domain' error with the reason "One or more properties contains invalid values". If you try to add this subdomain from the Microsoft 365 admin center, you will receive a similar error. For more information about the error, see [A child domain doesn't inherit parent domain changes in Office 365, Azure, or Intune](/office365/troubleshoot/administration/child-domain-fails-inherit-parent-domain-changes).

## How to verify a custom subdomain

Because subdomains inherit the authentication type of the root domain by default, you must promote the subdomain to a root domain in Azure AD using the Microsoft Graph so you can set the authentication type to your desired type.

### Add the subdomain and view its authentication type

1. Use PowerShell to add the new subdomain, which has its root domain's default authentication type. The Azure AD and Microsoft 365 admin centers don't yet support this operation.

   ```powershell
   New-MsolDomain -Name "child.mydomain.com" -Authentication Federated
   ```

1. Use [Azure AD Graph Explorer](https://graphexplorer.azurewebsites.net) to GET the domain. Because the domain isn't a root domain, it inherits the root domain authentication type. Your command and results might look as follows, using your own tenant ID:

   ```http
   GET https://graph.windows.net/{tenant_id}/domains?api-version=1.6
   
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

### Use Azure AD Graph Explorer API to make this a root domain

Use the following command to promote the subdomain:

```http
POST https://graph.windows.net/{tenant_id}/domains/child.mydomain.com/promote?api-version=1.6
```

### Change the subdomain authentication type

1. Use the following command to change the subdomain authentication type:

   ```powershell
   Set-MsolDomainAuthentication -DomainName child.mydomain.com -Authentication Managed
   ```

1. Verify via GET in Azure AD Graph Explorer that subdomain authentication type is now managed:

   ```http
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

## Next steps

- [Add custom domain names](../fundamentals/add-custom-domain.md?context=azure%2factive-directory%2fusers-groups-roles%2fcontext%2fugr-context)
- [Manage domain names](domains-manage.md)
- [ForceDelete a custom domain name with Microsoft Graph API](/graph/api/domain-forcedelete?view=graph-rest-beta&preserve-view=true)