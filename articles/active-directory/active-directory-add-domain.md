<properties
	pageTitle="Add your custom domain name to simplify sign-in using Azure Active Directory | Microsoft Azure"
	description="How to add your company's domain names to Azure Active Directory, and how to verify the domain name."
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
	ms.topic="get-started-article"
	ms.date="04/19/2016"
	ms.author="curtand;jeffsta"/>

# Add your custom domain name to simplify sign-in using Azure Active Directory

You can use your own custom domain name or names to improve and simplify sign-in and other user experiences in Azure Active Directory (Azure AD). For example, if your organization owns the domain name ‘contoso.com,’ then your users can sign in with user names they're familiar with, such as ‘joe@contoso.com.' You must have access to a user account that is a global administrator of your Azure AD directory.

When you first get your tenant directory in Azure Active Directory, your users sign in with user names like ‘alice@contoso.onmicrosoft.com.’ In this example, contoso.onmicrosoft.com is an initial built-in domain name that you can use until you verify your custom domain name. One of your next steps, then, would be to add a custom domain name that your organization owns, such as ‘contoso.com.’ This lets you assign names that are familiar to your users, such as ‘alice@contoso.com.’

For background on how domain names are used in Azure AD, read [Domain Management Concepts in Azure AD](active-directory-add-domain-concepts.md). Most administrators perform domain name management tasks in Azure AD using the Azure classic portal. However, you can use [PowerShell](https://msdn.microsoft.com/library/azure/e1ef403f-3347-4409-8f46-d72dafa116e0#BKMK_ManageDomains) or the [Graph API preview](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/domains-operations) to perform your management tasks if you prefer.

## Add a custom domain name to your directory

To add a custom domain name to your directory:

1. Sign in to the [Azure classic portal](https://manage.windowsazure.com/) with a user account that is a global administrator of your Azure AD directory.

2. Select **Active Directory** on the left navigation bar.

3. Open your directory.

4. Select the **Domains** tab.

5. On the command bar, select **Add.**

6. Enter the name of your custom domain, such as ‘contoso.com’. Be sure to include the .com, .net, or other top-level extension.

7. If you plan to configure this domain for [federated sign in](https://channel9.msdn.com/Series/Azure-Active-Directory-Videos-Demos/Configuring-AD-FS-for-user-sign-in-with-Azure-AD-Connect) with your on-premises Active Directory, select the check box.

8. Select **Add**.

Before you can assign user names that include your custom domain name, Azure AD must verify that your organization owns the domain name. To do perform this verification, you must update DNS entries at the domain name registrar for the domain.

## Get the DNS entries that Azure AD will use to verify the domain name

If you selected the option to configure the domain for federation when you added the domain, you will see guidance to download the Azure AD Connect tool. Run the Azure AD Connect tool to [get the DNS entries you need to add at your domain name registrar](active-directory-aadconnect-get-started-custom.md#verify-the-azure-ad-domain-selected-for-federation).

If you did not select the option for federated sign in with Windows Server AD, you will see the DNS entries on the second page of the **Add domain** wizard.

## Add the DNS entries to the DNS zone file for the domain

To add the DNS entries required by Azure AD:

1.  Sign in to the domain name registrar for the domain. If you do not have sufficient permissions to update the DNS zone file for the domain, share the DNS entries with the person or team at your organization who has this access and ask them to update them.

2.  Update the DNS zone file for the domain by adding the DNS entries provided to you by Azure AD. These DNS entries will enable Azure AD to verify your ownership of the domain. They will not change any behaviors such as mail routing or web hosting.

[Instructions for adding DNS entries at popular DNS registrars](https://support.office.com/article/Create-DNS-records-for-Office-365-when-you-manage-your-DNS-records-b0f3fdca-8a80-4e8e-9ef3-61e8a2a9ab23/)

## Verify the domain with Azure AD

Once you have added the DNS entries, you can verify the domain with Azure AD.

If you selected the option to federate your custom domain name, the verification will be done automatically by the Azure AD Connect tool. Run the tool once you have completed the prerequisites. Otherwise, verify the domain in the Azure classic portal. If you still have the **Add domain** wizard open, you can click the verify button on the third page of the wizard. It might take a few minutes for the DNS records to propagate.

If the **Add domain** wizard is not still open, you can verify the domain in the [Azure classic portal](https://manage.windowsazure.com/):

1.  Sign in with a user account that is a global administrator of your Azure AD directory.

2.  Select **Active Directory** on the left navigation bar.

3.  Open your directory.

4.  Select the **Domains** tab.

5.  In the list of domains, select the domain you want to verify.

6.  Select **Verify** on the command bar.

7.  Select **Verify** in the dialog box.

Now you can assign user names that include your custom domain name.

## Add more custom domain names

If your organization uses more than one custom domain name, such as ‘contoso.com’ and ‘contosobank.com’, you can add each of them to your Azure AD directory, up to a maximum of 900 domains. Use the same steps listed above to add each subsequent domain name.

Next steps

-   [Assign user names with a custom domain name](active-directory-add-domain-add-users.md)

-   [Manage custom domain names](active-directory-add-manage-domain-names.md)

-   [Show your company’s branding when your users sign in](active-directory-add-company-branding.md)

-   [Domain Management Concepts in Azure AD](active-directory-add-domain-concepts.md)
