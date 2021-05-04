---
title: Add and verify custom domain names - Azure Active Directory | Microsoft Docs
description: Management concepts and how-tos for managing a domain name in Azure Active Directory
services: active-directory
documentationcenter: ''
author: curtand
manager: mtillman

ms.service: active-directory
ms.subservice: enterprise-users
ms.workload: identity
ms.topic: how-to
ms.date: 03/12/2021
ms.author: curtand
ms.reviewer: sumitp

ms.custom: it-pro

ms.collection: M365-identity-device-management
---
# Managing custom domain names in your Azure Active Directory

A domain name is an important part of the identifier for many Azure Active Directory (Azure AD) resources: it's part of a user name or email address for a user, part of the address for a group, and is sometimes part of the app ID URI for an application. A resource in Azure AD can include a domain name that's owned by the organization that contains the resource. Only a Global Administrator can manage domains in Azure AD.

## Set the primary domain name for your Azure AD organization

When your organization is created, the initial domain name, such as ‘contoso.onmicrosoft.com,’ is also the primary domain name. The primary domain is the default domain name for a new user when you create a new user. Setting a primary domain name streamlines the process for an administrator to create new users in the portal. To change the primary domain name:

1. Sign in to the [Azure portal](https://portal.azure.com) with an account that's a Global Administrator for the organization.
2. Select **Azure Active Directory**.
3. Select **Custom domain names**.
  
   ![Opening the user management page](./media/domains-manage/add-custom-domain.png)
4. Select the name of the domain that you want to be the primary domain.
5. Select the **Make primary** command. Confirm your choice when prompted.
  
   ![Make a domain name the primary](./media/domains-manage/make-primary-domain.png)

You can change the primary domain name for your organization to be any verified custom domain that isn't federated. Changing the primary domain for your organization won't change the user name for any existing users.

## Add custom domain names to your Azure AD organization

You can add up to 5000 managed domain names. If you're configuring all your domains for federation with on-premises Active Directory, you can add up to 2500 domain names in each organization.

## Add subdomains of a custom domain

If you want to add a subdomain name such as ‘europe.contoso.com’ to your organization, you should first add and verify the root domain, such as contoso.com. The subdomain is automatically verified by Azure AD. To see that the subdomain you added is verified, refresh the domain list in the browser.

If you have already added a contoso.com domain to one Azure AD organization, you can also verify the subdomain europe.contoso.com in a different Azure AD organization. When adding the subdomain, you are prompted to add a TXT record in the DNS hosting provider.



## What to do if you change the DNS registrar for your custom domain name

If you change the DNS registrars, there are no additional configuration tasks in Azure AD. You can continue using the domain name with Azure AD without interruption. If you use your custom domain name with Microsoft 365, Intune, or other services that rely on custom domain names in Azure AD, see the documentation for those services.

## Delete a custom domain name

You can delete a custom domain name from your Azure AD if your organization no longer uses that domain name, or if you need to use that domain name with another Azure AD.

To delete a custom domain name, you must first ensure that no resources in your organization rely on the domain name. You can't delete a domain name from your organization if:

* Any user has a user name, email address, or proxy address that includes the domain name.
* Any group has an email address or proxy address that includes the domain name.
* Any application in your Azure AD has an app ID URI that includes the domain name.

You must change or delete any such resource in your Azure AD organization before you can delete the custom domain name.

### ForceDelete option

You can **ForceDelete** a domain name in the [Azure AD Admin Center](https://aad.portal.azure.com) or using [Microsoft Graph API](/graph/api/domain-forcedelete?view=graph-rest-beta&preserve-view=true). These options use an asynchronous operation and update all references from the custom domain name like “user@contoso.com” to the initial default domain name such as “user@contoso.onmicrosoft.com.”

To call **ForceDelete** in the Azure portal, you must ensure that there are fewer than 1000 references to the domain name, and any references where Exchange is the provisioning service must be updated or removed in the [Exchange Admin Center](https://outlook.office365.com/ecp/). This includes Exchange Mail-Enabled Security Groups and distributed lists; for more information, see [Removing mail-enabled security groups](/Exchange/recipients/mail-enabled-security-groups#Remove%20mail-enabled%20security%20groups&preserve-view=true). Also, the **ForceDelete** operation won't succeed if either of the following is true:

* You purchased a domain via Microsoft 365 domain subscription services
* You are a partner administering on behalf of another customer organization

The following actions are performed as part of the **ForceDelete** operation:

* Renames the UPN, EmailAddress, and ProxyAddress of users with references to the custom domain name to the initial default domain name.
* Renames the EmailAddress of groups with references to the custom domain name to the initial default domain name.
* Renames the identifierUris of applications with references to the custom domain name to the initial default domain name.

An error is returned when:

* The number of objects to be renamed is greater than 1000
* One of the applications to be renamed is a multi-tenant app

### Frequently asked questions

**Q: Why is the domain deletion failing with an error that states that I have Exchange mastered groups on this domain name?** <br>
**A:** Today, certain groups like Mail-Enabled Security groups and distributed lists are provisioned by Exchange and need to be manually cleaned up in [Exchange Admin Center (EAC)](https://outlook.office365.com/ecp/). There may be lingering ProxyAddresses which rely on the custom domain name and will need to be updated manually to another domain name. 

**Q: I am logged in as admin\@contoso.com but I cannot delete the domain name “contoso.com”?**<br>
**A:** You cannot reference the custom domain name you are trying to delete in your user account name. Ensure that the Global Administrator account is using the initial default domain name (.onmicrosoft.com) such as admin@contoso.onmicrosoft.com. Sign in with a different Global Administrator account that such as admin@contoso.onmicrosoft.com or another custom domain name like “fabrikam.com” where the account is admin@fabrikam.com.

**Q: I clicked the Delete domain button and see `In Progress` status for the Delete operation. How long does it take? What happens if it fails?**<br>
**A:** The delete domain operation is an asynchronous background task that renames all references to the domain name. It should complete within a minute or two. If domain deletion fails, ensure that you don’t have:

* Apps configured on the domain name with the appIdentifierURI
* Any mail-enabled group referencing the custom domain name
* More than 1000 references to the domain name

If you find that any of the conditions haven’t been met, manually clean up the references and try to delete the domain again.

## Use PowerShell or the Microsoft Graph API to manage domain names

Most management tasks for domain names in Azure Active Directory can also be completed using Microsoft PowerShell, or programmatically using the Microsoft Graph API.

* [Using PowerShell to manage domain names in Azure AD](/powershell/module/azuread/#domains&preserve-view=true)
* [Domain resource type](/graph/api/resources/domain)

## Next steps

* [Add custom domain names](../fundamentals/add-custom-domain.md?context=azure%2factive-directory%2fusers-groups-roles%2fcontext%2fugr-context)
* [Remove Exchange mail-enabled security groups in Exchange Admin Center on a custom domain name in Azure AD](/Exchange/recipients/mail-enabled-security-groups#Remove%20mail-enabled%20security%20groups&preserve-view=true)
* [ForceDelete a custom domain name with Microsoft Graph API](/graph/api/domain-forcedelete?view=graph-rest-beta&preserve-view=true)
