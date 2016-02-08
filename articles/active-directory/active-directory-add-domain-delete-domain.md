<properties
	pageTitle="Delete a custom domain in Azure Active Directory | Microsoft Azure"
	description="How to delete a custom domain in Azure Active Directory."
	services="active-directory"
	documentationCenter=""
	authors="jeffsta"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="02/05/2016"
	ms.author="curtand;jeffsta"/>


# Deleting a custom domain name

You can delete a custom domain name that you no longer need to use with your Azure AD directory; for example, if you have a new corporate name, if you are using a different Azure AD directory, to name a couple of scenarios. You can also delete an unverified domain, such as if you find after adding it that you mistyped the name, or if you did not set the value correctly as to whether the domain will be federated.

## Before you begin

Before you remove a domain name, we recommend that you read the following information:

- The original contoso.onmicrosoft.com domain name that was provided for your directory when you signed up cannot be removed.
- Any top-level domain that has subdomains associated with it cannot be removed until the subdomains have been removed. For example, you can't remove adatum.com if you have corp.adatum.com or another subdomain that uses the top-level domain name. For more information, see the Support article ["Domain has associated subdomains" or "You cannot remove a domain that has subdomains" error when you try to remove a domain from Office 365](https://support.microsoft.com/kb/2787792/).
- Have you activated directory synchronization? If so, a domain was automatically added to your account that looks similar to this: contoso.mail.onmicrosoft.com. This domain name can't be removed.
- Before you can remove a domain name, you must first remove the domain name from all user or email accounts associated with the domain. You can remove all of the accounts, or you can bulk edit user accounts to change their domain name information and email addresses. For more information, see [Create or edit users in Azure AD](active-directory-create-users.md). Remember to remove:

	-   Any user that has the domain in their user name or email address

	-   Any mail-enabled group that has the domain in its email address

	-   Any application that has the domain as part of its reply URL

- If you are hosting a SharePoint Online site on a domain name that is being used for a SharePoint Online site collection, you must delete the site collection before you can remove the domain name.

## To delete a domain

1.  Sign into the Azure classic portal using an account with global admin privileges for that directory.

2.  Open your directory, and select **Domains**.

3.  Select the domain and click Delete.

## Next steps

- [Using custom domain names to simplify the sign-in experience for your users](active-directory-add-domain.md)
- [Add company branding to your Sign In and Access Panel pages ](active-directory-add-company-branding.md)
- [Add and verify a custom domain name in Azure Active Directory](active-directory-add-domain-add-verify-general.md)
- [Assign users to a custom domain](active-directory-add-domain-add-users.md)
- [Change the DNS registrar for your custom domain name](active-directory-add-domain-change-registrar.md)
