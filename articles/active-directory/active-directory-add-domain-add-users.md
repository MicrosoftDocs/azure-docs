<properties
	pageTitle="Assign users to a custom domain in Azure Active Directory | Microsoft Azure"
	description="How to populate a custom domain in Azure Active Directory with user accounts."
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

# Assign users to a custom domain

After you have added your custom domain to Azure Active Directory, you must add the user accounts for this domain so that you can begin authenticating them.

## Users synced in from a directory on your corporate network

If you have already set up a connection between your on-premises Active Directory and Azure Active Directory, synchronization can populate the accounts. For more information on how to synchronize Azure Active Directory with your on-premises Active Directory, see [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md).

## Users added and managed in the cloud

To change the domain for an existing user account:

1.  Open the Azure classic portal using an account that is a global admin or a user admin.

2.  Open your directory.

3.  Select the **Users** tab.

4.  Select the user from the list.

5.  Change the domain for the user, and then select **Save**.

This can also be done using [Microsoft PowerShell](https://msdn.microsoft.com/library/azure/e1ef403f-3347-4409-8f46-d72dafa116e0#BKMK_ManageDomains) or the [Graph API](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/domains-operations).

## Select a custom domain when creating a new user

1.  Open the Azure classic portal using an account that is a global admin or a user admin.

2.  Open your directory.

3.  Select the **Users** tab.

4.  In the command bar, select **Add**.

5.  When you add the user name, choose the custom domain from the domain list.

6.  Select **Save**.

## Next steps

-   [Using custom domain names to simplify the sign-in experience for your users](active-directory-add-domain.md)

-   [Manage custom domain names](active-directory-add-manage-domain-names.md)

-   [Learn about domain management concepts in Azure AD](active-directory-add-domain-concepts.md)
