<properties
	pageTitle="Add your custom domain name and set up federated sign-on to Azure Active Directory | Microsoft Azure"
	description="How to add your company's domain names to Azure Active Directory, and how set up federated sign-on between Azure Active Directory and your on-premises federation solution."
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

# Add your custom domain name to Azure Active Directory

You can configure a custom domain name, such as ‘contoso.com,’ so that users in contoso.com can have a federated single sign-on experience from your corporate network. If you already have Active Directory Federation Services (AD FS) or a different federation server running on your corporate network, you can configure Azure AD to use your custom domain name using the Azure AD Connect tool. You can also use Azure AD Connect to deploy a new AD FS environment, and configure that for federated single sign-on to Azure AD.

If you do not have and do not plan to deploy AD FS or another federation server, follow these instructions: [Add a custom domain name to Azure Active Directory](active-directory-add-domain.md).

## Add a custom domain name to your directory

1. Sign in to the [Azure classic portal](https://manage.windowsazure.com/) with a user account that is a global administrator of your Azure AD directory.

2. In **Active Directory**, open your directory and select the **Domains** tab.

3. On the command bar, select **Add**, and then enter the name of your custom domain, such as 'contoso.com'. Be sure to include the .com, .net, or other top-level extension.

4. Select the **I plan to configure this domain for single sign-on with my local Active Directory** checkbox.

5. Select **Add**.

Run the Azure AD Connect tool to get the DNS entry that Azure AD will use to verify the domain. You will see the DNS entry in the **Azure AD Domain** step in the wizard. You can see what that step in the wizard looks like [in these instructions](active-directory-aadconnect-get-started-custom.md#verify-the-azure-ad-domain-selected-for-federation). If you do not have the Azure AD Connect tool, you can [download it here](http://go.microsoft.com/fwlink/?LinkId=615771).

## Add the DNS entry at the domain name registrar for the domain

The next step to use your custom domain name with Azure AD is to update the DNS zone file for the domain. This enables Azure AD to verify that your organization owns the custom domain name.

1. Sign in to the website for domain name registrar for your domain name. If you don't have access to do this, ask the person or team in your organization who has this access to complete step 2 and to let you know when it is completed.

2. Update the DNS zone file for the domain by adding the DNS entry provided to you by Azure AD. This DNS entry enables Azure AD to verify your ownership of the domain. The DNS entry doesn't change any behaviors such as mail routing or web hosting.

For help with this step, read [Instructions for adding a DNS entry at popular DNS registrars](https://support.office.com/article/Create-DNS-records-for-Office-365-when-you-manage-your-DNS-records-b0f3fdca-8a80-4e8e-9ef3-61e8a2a9ab23/)

## Verify the domain name with Azure AD

Once you have added the DNS entry, you are ready to verify the domain name with Azure AD.

To verify the domain, select **Next** on the **Azure AD Domain** step of the Azure AD Connect wizard. Azure AD will look for the DNS entry in the DNS zone file for the domain. Azure AD only verify the domain name once the DNS records have propagated. Propagation often takes only seconds, but it can sometimes take an hour or more. If verification doesn’t work the first time, try again later.

Then, proceed with the remaining steps in the Azure AD Connect wizard. This will synchronize users from your Windows Server AD to Azure AD. Synchronized users in the domain that you configured for federation will be able to get a federated single sign-on experience from your corporate network to Azure AD.

## Troubleshooting

If you can't verify a custom domain name, try the following. We'll start with the most common and work down to the least common.

1.	**Wait an hour**. DNS records need to propagate before Azure AD can verify the domain. This can take an hour or more.

2.	**Ensure the DNS record was entered, and that it is correct**. Complete this step at the website for the domain name registrar for the domain. Azure AD cannot verify the domain name if the DNS entry is not present in the DNS zone file, or if it is not an exact match with the DNS entry that Azure AD provided you. If you do not have access to update DNS records for the domain at the domain name registrar, share the DNS entry with the person or team at your organization who has this access, and ask them to add the DNS entry.

3.	**Delete the domain name from another directory in Azure AD**. A domain name can be verified in only a single directory. If a domain name was previously verified in another directory, it must be deleted there before it can be verified in your new directory. To learn about deleting domain names, read [Manage custom domain names](active-directory-add-manage-domain-names.md).

## Add more custom domain names

If your organization uses multiple custom domain names, such as ‘contoso.com’ and ‘contosobank.com’, you can add them up to a maximum of 900 domain names. Use the same steps in this article to add each of your domain names.

## Next steps

-   [Manage custom domain names](active-directory-add-manage-domain-names.md)
-   [Learn about domain management concepts in Azure AD](active-directory-add-domain-concepts.md)
-   [Show your company's branding when your users sign in](active-directory-add-company-branding.md)
-   [Use PowerShell to manage domain names in Azure AD](https://msdn.microsoft.com/library/azure/e1ef403f-3347-4409-8f46-d72dafa116e0#BKMK_ManageDomains)
