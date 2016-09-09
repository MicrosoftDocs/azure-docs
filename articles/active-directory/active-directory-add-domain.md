<properties
	pageTitle="Add your custom domain name to Azure Active Directory | Microsoft Azure"
	description="How to add your company's domain names to Azure Active Directory, and how to verify the domain name."
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
	ms.topic="get-started-article"
	ms.date="07/18/2016"
	ms.author="curtand;jeffsta"/>

# Add a custom domain name to Azure Active Directory

You've got one or more domain names that your organization uses to do business, and your users sign in to your corporate network using your corporate domain name. Now that you're using Azure Active Directory (Azure AD), you can add your corporate domain name to Azure AD as well. This allows you to assign user names in the directory that are familiar to your users, such as ‘alice@contoso.com.’ The process is simple:

1. Add the custom domain name to your directory
2. Add a DNS entry for the domain name at the domain name registrar
3. Verify the custom domain name in Azure AD

> [AZURE.NOTE] If you plan to configure your custom domain name to be used with Active Directory Federation Services (AD FS) or a different security token service (STS) on your corporate network, follow the instructions in [Add and configure a domain for federation with Azure Active Directory](active-directory-add-domain-federated.md). This is useful if you plan to synchronize users from your corporate directory to Azure AD, and [password hash sync](active-directory-aadconnectsync-implement-password-synchronization.md) does not meet your requirements.

## Add a custom domain name to your directory

1. Sign in to the [Azure classic portal](https://manage.windowsazure.com/) with a user account that is a global administrator of your Azure AD directory.

2. In **Active Directory**, open your directory and select the **Domains** tab.

3. On the command bar, select **Add**. Enter the name of your custom domain, such as 'contoso.com'. Be sure to include the .com, .net, or other top-level extension, and leave the checkbox for "single sign-on" (federation) cleared.

4. Select **Add**.

5. On the second page of the Add Domain wizard, get the DNS entry that Azure AD will use to verify that your organization owns the custom domain name.

Now that you've added the domain name, Azure AD must verify that your organization owns the domain name. Before Azure AD can perform this verification, you must add a DNS entry in the DNS zone file for the domain name. This task is performed at the website for domain name registrar for the domain name.

## Add the DNS entry at the domain name registrar for the domain

The next step to use your custom domain name with Azure AD is to update the DNS zone file for the domain. This enables Azure AD to verify that your organization owns the custom domain name.

1.  Sign in to the domain name registrar for the domain. If you don't have access to update the DNS entry, ask the person or team who has this access to complete step 2 and to let you know when it is completed.

2.  Update the DNS zone file for the domain by adding the DNS entry provided to you by Azure AD. This DNS entry enables Azure AD to verify your ownership of the domain. The DNS entry doesn't change any behaviors such as mail routing or web hosting.

For help with this adding the DNS entry, read [Instructions for adding a DNS entry at popular DNS registrars](https://support.office.com/article/Create-DNS-records-for-Office-365-when-you-manage-your-DNS-records-b0f3fdca-8a80-4e8e-9ef3-61e8a2a9ab23/)

## Verify the domain name with Azure AD

Once you have added the DNS entry, you are ready to verify the domain name with Azure AD.

If you still have the **Add domain** wizard open, select **Verify** on the third page of the wizard. When you select **Verify**, Azure AD will look for the DNS entry in the DNS zone file for the domain. Azure AD can verify the domain name only after the DNS records have propagated. This propagation often takes only seconds, but it can sometimes take an hour or more. If verification doesn’t work the first time, try again later.

If the **Add domain** wizard isn't still open, you can verify the domain in the [Azure classic portal](https://manage.windowsazure.com/):

1.  Sign in with a user account that is a global administrator of your Azure AD directory.

2.  Open your directory and select the **Domains** tab.

3.  Select the domain name that you want to verify and select **Verify** on the command bar.

4. Select **Verify** in the dialog box to complete the verification.

Now you can [assign user names that include your custom domain name](active-directory-add-domain-add-users.md).

## Troubleshooting

If you can't verify a custom domain name, try the following. We'll start with the most common and work down to the least common.

1.	**Wait an hour**. DNS records need to propagate before Azure AD can verify the domain. This can take an hour or more.

2.	**Ensure the DNS record was entered, and that it is correct**. Complete this step at the website for the domain name registrar for the domain. Azure AD cannot verify the domain name if the DNS entry is not present in the DNS zone file, or if it is not an exact match with the DNS entry that Azure AD provided you. If you do not have access to update DNS records for the domain at the domain name registrar, share the DNS entry with the person or team at your organization who has this access, and ask them to add the DNS entry.

3.	**Delete the domain name from another directory in Azure AD**. A domain name can be verified in only a single directory. If a domain name was previously verified in another directory, it must be deleted there before it can be verified in your new directory. To learn about deleting domain names, read [Manage custom domain names](active-directory-add-manage-domain-names.md).


## Add more custom domain names

If your organization uses multiple custom domain names, such as ‘contoso.com’ and ‘contosobank.com’, you can add them up to a maximum of 900 domain names. Use the same steps in this article to add each of your domain names.

## Next steps

-   [Assign user names that include your custom domain name](active-directory-add-domain-add-users.md)
-   [Manage custom domain names](active-directory-add-manage-domain-names.md)
-   [Learn about domain management concepts in Azure AD](active-directory-add-domain-concepts.md)
-   [Show your company's branding when your users sign in](active-directory-add-company-branding.md)
-   [Use PowerShell to manage domain names in Azure AD](https://msdn.microsoft.com/library/azure/e1ef403f-3347-4409-8f46-d72dafa116e0#BKMK_ManageDomains)
