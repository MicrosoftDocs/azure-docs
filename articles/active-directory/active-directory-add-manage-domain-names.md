<properties
	pageTitle="Managing custom domain names in your Azure Active Directory | Microsoft Azure"
	description="Management concepts and how-tos for managing a custom domain in Azure Active Directory"
	services="active-directory"
	documentationCenter=""
	authors="jeffsta"
	manager="femila"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/18/2016"
	ms.author="curtand;jeffsta"/>

# Managing custom domain names in your Azure Active Directory

A domain name is an important part of the identifier for many directory resources: it is part of a user name or email address for a user, part of the address for a group, and can be part of the app ID URI for an application. A resource in Azure Active Directory (Azure AD) can include a domain name that is already verified to be owned by the directory that contains the resource. Only a global administrator can perform domain management tasks in Azure AD.

## Set the primary domain name for your Azure AD directory

When your directory is created, the initial domain name, such as ‘contoso.onmicrosoft.com,’ is also the primary domain name for your directory. The primary domain is the default domain name for a new user when you create a new user in the [Azure classic portal](https://manage.windowsazure.com/), or other portals such as the Office 365 admin portal. This streamlines the process for an administrator to create new users in the portal.

To change the primary domain name for your directory:

1.  Sign in to the [Azure classic portal](https://manage.windowsazure.com/) with a user account that is a global administrator of your Azure AD directory.

2.  Select **Active Directory** on the left navigation bar.

3.  Open your directory.

4.  Select the **Domains** tab.

5.  Select the **Change primary** button on the command bar.

6.  Select the domain that you want to be the new primary domain for your directory.

You can change the primary domain name for your directory to be any verified custom domain that is not federated. Changing the primary domain for your directory will not change the user names for any existing users.

## Add custom domain names to your Azure AD

You can add up to 900 custom domain names to each Azure AD directory. The process to [add an additional custom domain name](active-directory-add-domain.md) is the same for the first custom domain name.

## Add subdomains of a custom domain

If you want to add a third-level domain name such as ‘europe.contoso.com’ to your directory, you should first add and verify the second-level domain, such as contoso.com. The subdomain will be automatically verified by Azure AD. To see that the subdomain that you just added has been verified, refresh the page in the browser that lists the domains in your directory.

## What to do if you change the DNS registrar for your custom domain name

If you change the DNS registrar for your custom domain name, you can continue to use your custom domain name with Azure AD itself without interruption and without additional configuration tasks. If you use your custom domain name with Office 365, Intune, or other services that rely on custom domain names in Azure AD, refer to the documentation for those services.

## Delete a custom domain name

You can delete a custom domain name from your Azure AD if your organization no longer uses that domain name, or if you need to use that domain name with another Azure AD.

To delete a custom domain name, you must first ensure that no resources in your directory rely on the domain name. You can't delete a domain name from your directory if:

-   Any user has a user name, email address, or proxy address that include the domain name.

-   Any group has an email address or proxy address that includes the domain name.

-   Any application in your Azure AD has an app ID URI that includes the domain name.

You must change or delete any such resource in your Azure AD directory before you can delete the custom domain name.

## Use PowerShell or Graph API to manage domain names

Most management tasks for domain names in Azure Active Directory can also be completed using Microsoft PowerShell, or programmatically using Azure AD Graph API (in public preview).

-   [Using PowerShell to manage domain names in Azure AD](https://msdn.microsoft.com/library/azure/e1ef403f-3347-4409-8f46-d72dafa116e0#BKMK_ManageDomains)

-   [Using Graph API to manage domain names in Azure AD](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/domains-operations)

## Next steps

-   [Learn about domain names in Azure AD](active-directory-add-domain-concepts.md)

-   [Manage custom domain names](active-directory-add-manage-domain-names.md)
