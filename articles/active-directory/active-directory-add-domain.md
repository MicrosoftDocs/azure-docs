<properties
	pageTitle="Add your custom domain name to Azure Active Directory | Microsoft Azure"
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

# Add your custom domain name to Azure Active Directory

You've got one or more domain names that your organization uses to do business, and your users sign in to your corporate network using your corporate domain name. Now that you're using Azure Active Directory (Azure AD), you can add your corporate domain name to Azure AD as well. This allows you to assign user names in the directory that are familiar to your users, such as ‘alice@contoso.com.’ The process is simple:

- Add your domain name in our **Add Domain** wizard in the Azure classic portal

- Get DNS entry in the Azure AD classic portal or the Azure AD Connect tool

- Add the DNS entry for the domain name into the DNS zone file at the website for the DNS registrar

- Verify the domain name in the Azure AD classic portal or the Azure AD Connect tool


Until you verify your custom domain name, your users must sign in with user names like ‘alice@contoso.onmicrosoft.com,’ which use the initial domain name for your directory. If you require multiple custom domain names, such as ‘contoso.com’ and ‘contosobank.com’, you can add them up to a maximum of 900 domain names. Use the same steps in this article to add each domain name.

## Add a custom domain name to your directory

1. Sign in to the [Azure classic portal](https://manage.windowsazure.com/) with a user account that is a global administrator of your Azure AD directory.

2. In **Active Directory**, open your directory and select the **Domains** tab.

3. On the command bar, select **Add**, and then enter the name of your custom domain, such as 'contoso.com'. Be sure to include the .com, .net, or other top-level extension.

4. If you plan to configure this domain for [federated sign-in](https://channel9.msdn.com/Series/Azure-Active-Directory-Videos-Demos/Configuring-AD-FS-for-user-sign-in-with-Azure-AD-Connect) with your on-premises Active Directory, select the check box.

5. Select **Add**.

Now that you've added the domain name, Azure AD must verify that your organization owns the domain name. Before Azure AD can perform this verification, you must add a DNS entry in the DNS zone file for the domain name. This task is performed at the website for domain name registrar for the domain name.

## Get the DNS entries for the domain name

The DNS entries are on the second page of the **Add domain** wizard, if you're not federating with an on-premises Windows Server Active Directory.

If you are configuring the domain for federation, you'll be directed to download the Azure AD Connect tool. Run the Azure AD Connect tool to [get the DNS entries you need to add at your domain name registrar](active-directory-aadconnect-get-started-custom.md#verify-the-azure-ad-domain-selected-for-federation). The Azure AD Connect tool will also verify the domain name for Azure AD.

## Add the DNS entry to the DNS zone file

1.  Sign in to the domain name registrar for the domain. If you don't have sufficient permissions to update the DNS entry, ask the person or team who has this access to add the DNS entry.

2.  Update the DNS zone file for the domain by adding the DNS entry provided to you by Azure AD. This DNS entry enables Azure AD to verify your ownership of the domain. The DNS entry doesn't change any behaviors such as mail routing or web hosting. It can take up to an hour for the DNS records to propagate.

[Instructions for adding a DNS entry at popular DNS registrars](https://support.office.com/article/Create-DNS-records-for-Office-365-when-you-manage-your-DNS-records-b0f3fdca-8a80-4e8e-9ef3-61e8a2a9ab23/)

## Verify the domain name with Azure AD

Once you have added the DNS entry, you must ensure that the domain name is verified by Azure AD. This is the final step to success.

If you still have the **Add domain** wizard open, select **Verify** on the third page of the wizard. You should wait up to an hour for the DNS entry to propagate before verifying.

If the **Add domain** wizard isn't still open, you can verify the domain in the [Azure classic portal](https://manage.windowsazure.com/):

1.  Sign in with a user account that is a global administrator of your Azure AD directory.

2.  Open your directory and select the **Domains** tab.

3.  Select the domain you want to verify.

4.  Select **Verify** on the command bar, and then select **Verify** in the dialog box.

Congratulations on your success! Now you can [assign user names that include your custom domain name](active-directory-add-domain-add-users.md). If you had any trouble verifying the domain name, see our [Troubleshooting](#troubleshooting) section.

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
-   [Learn about domain management concepts in Azure AD](active-directory-add-domain-concepts.md)
-   [Show your company's branding when your users sign in](active-directory-add-company-branding.md)
-   [Use PowerShell to manage domain names in Azure AD](https://msdn.microsoft.com/library/azure/e1ef403f-3347-4409-8f46-d72dafa116e0#BKMK_ManageDomains)
