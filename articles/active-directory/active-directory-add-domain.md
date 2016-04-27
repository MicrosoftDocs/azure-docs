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
	ms.date="04/20/2016"
	ms.author="curtand;jeffsta"/>

# Add your custom domain name to simplify sign-in using Azure Active Directory

When you first get your directory in Azure Active Directory (Azure AD), one of the important first tasks is to verify a custom domain name that your organization uses, such as ‘contoso.com’. Completing this task lets you assign user names that are familiar to your users, such as ‘alice@contoso.com.’ Until you verify your custom domain name, your users must sign in with user names like ‘alice@contoso.onmicrosoft.com’ which use the initial domain name for your directory.

## Add a custom domain name to your directory

To add a custom domain name to your directory:

1. Sign in to the [Azure classic portal](https://manage.windowsazure.com/) with a user account that is a global administrator of your Azure AD directory.

2. Select **Active Directory** on the left navigation bar, and open your directory.

4. Select the **Domains** tab.

5. On the command bar, select **Add.**

6. Enter the name of your custom domain, such as 'contoso.com'. Be sure to include the .com, .net, or other top-level extension.

7. If you plan to configure this domain for [federated sign-in](https://channel9.msdn.com/Series/Azure-Active-Directory-Videos-Demos/Configuring-AD-FS-for-user-sign-in-with-Azure-AD-Connect) with your on-premises Active Directory, select the check box.

8. Select **Add**.

Before you can assign user names that include your custom domain name, Azure AD must verify that your organization owns the domain name. To do perform this verification, you must add a DNS entry in the DNS zone file for the domain name. This task can be completed at the website for domain name registrar for the domain name.

## Get the DNS entries for the domain name

If you opted to configure the domain for federation, you'll be directed to download the Azure AD Connect tool. Run the Azure AD Connect tool to [get the DNS entries you need to add at your domain name registrar](active-directory-aadconnect-get-started-custom.md#verify-the-azure-ad-domain-selected-for-federation).

If you didn't opt to configure the domain for federation, the DNS entries are on the second page of the **Add domain** wizard.

## Add the DNS entry to the DNS zone file

To add the DNS entry required by Azure AD:

1.  Sign in to the domain name registrar for the domain. If you don't have sufficient permissions to update the DNS entry, ask the person or team who has this access to add the DNS entry.

2.  Update the DNS zone file for the domain by adding the DNS entry provided to you by Azure AD. This DNS entry enables Azure AD to verify your ownership of the domain. The DNS entry doesn't change any behaviors such as mail routing or web hosting.

[Instructions for adding a DNS entry at popular DNS registrars](https://support.office.com/article/Create-DNS-records-for-Office-365-when-you-manage-your-DNS-records-b0f3fdca-8a80-4e8e-9ef3-61e8a2a9ab23/)

## Verify the domain name with Azure AD

Once you have added the DNS entry, you can verify the domain name with Azure AD.

If you opted to federate your custom domain name, the Azure AD Connect tool performs verification automatically. Run the tool once you have completed the prerequisites. Otherwise, verify the domain in the Azure classic portal. If you still have the **Add domain** wizard open, you can click **Verify** on the third page of the wizard. It can take up to an hour for the DNS records to propagate.

If the **Add domain** wizard isn't still open, you can verify the domain in the [Azure classic portal](https://manage.windowsazure.com/):

1.  Sign in with a user account that is a global administrator of your Azure AD directory.

2.  Select **Active Directory** on the left navigation bar.

3.  Open your directory.

4.  Select the **Domains** tab.

5.  In the list of domains, select the domain you want to verify.

6.  Select **Verify** on the command bar.

7.  Select **Verify** in the dialog box.

Now you can [assign user names that include your custom domain name](active-directory-add-domain-add-users.md).

## Add more custom domain names

If your organization uses multiple custom domain names, such as ‘contoso.com’ and ‘contosobank.com’, you can add them to your Azure AD directory. The maximum is 900 domain names. Use the same steps to add each subsequent domain name.

## Troubleshooting
If you can't verify a custom domain name, there are a few potential causes. We'll start with the most common and work down to the least common.

- You tried to verify the domain name before the DNS entry could propagate. Wait for a while and try again.

- The DNS record wasn't entered at all. Verify the DNS entry and wait for it to propagate, and then try again.

- The domain name was already verified in another directory. Locate the domain name and delete it from the other directory, and try again.

- The DNS record contains an error. Correct the error and try again.

- You don't have sufficient permission to update DNS records. Share the DNS entries with the person or team at your organization who has this access and ask them to add the DNS entry.


## Next steps

-   [Assign user names that include your custom domain name](active-directory-add-domain-add-users.md)

-   [Manage custom domain names](active-directory-add-manage-domain-names.md)

-   [Show your company's branding when your users sign in](active-directory-add-company-branding.md)

-   [Use PowerShell to manage domain names in Azure AD](https://msdn.microsoft.com/library/azure/e1ef403f-3347-4409-8f46-d72dafa116e0#BKMK_ManageDomains)

-   [Learn about domain management concepts in Azure AD](active-directory-add-domain-concepts.md)
