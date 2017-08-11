---
title: Add your custom domain name to Azure Active Directory | Microsoft Docs
description: How to add your company's domain names to Azure Active Directory, and how to verify the domain name.
services: active-directory
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: d97e57c6-578a-4929-8fb8-42e858a711c7
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/08/2017
ms.author: curtand

---
# Add a custom domain name to Azure Active Directory

Using Azure Active Directory (Azure AD), you can add your corporate domain name to Azure AD as well. You might have a domain names that you organization uses to do business, and users who sign in using your corporate domain name. Adding the domain name to Azure AD allows you to assign user names in the directory that are familiar to your users, such as ‘alice@contoso.com.’ The process is simple:

1. Add the custom domain name to your directory
2. Add a DNS entry for the domain name at the domain name registrar
3. Verify the custom domain name in Azure AD

## How do I add a domain name?
1. Sign in to the [Azure portal](https://aad.portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview) with an account that's a global admin for the directory.
2. On the left, select **Domain names**.
3. On ***directory-name* - Domain names**, select the **Add domain name** command.
   
   ![Selecting the Add command](./media/active-directory-domains-add-azure-portal/add-command.png)
5. On **Domain name**, enter the name of your custom domain in the box, such as 'contoso.com', and then select **Add Domain**. Be sure to include the .com, .net, or other top-level extension.
6. On ***domainname*** (that is, where your new domain name is the title), gather the DNS entry information that you must use to verify the custom domain name in Azure AD.
   
   ![get DNS entry information](./media/active-directory-domains-add-azure-portal/get-dns-info.png)

Before Azure AD can verify that your organization owns the domain name, you must add a DNS entry in the DNS zone file for the domain name. You can do this at the website for domain name registrar for the domain name. You can also use [Azure DNS in the Azure portal](https://docs.microsoft.com/azure/dns/dns-getstarted-portal) for single point of management for your Azure, Office 365, and external DNS records within Azure.

## Add the DNS entry at the domain name registrar for the domain
The next step to use your custom domain name with Azure AD is to update the DNS zone file for the domain. This enables Azure AD to verify that your organization owns the custom domain name.

1. Sign in to the domain name registrar for the domain. If you don't have access to update the DNS entry, ask the person or team who has this access to complete step 2 and to let you know when it's done.
2. Update the DNS zone file for the domain by adding the DNS entry provided to you by Azure AD. This DNS entry enables Azure AD to verify your ownership of the domain. The DNS entry doesn't change any behaviors such as mail routing or web hosting.
  
  You can add the DNS entry using [Azure DNS](https://docs.microsoft.com/azure/dns/dns-getstarted-portal) or add the DNS entry at [a different DNS registrar](https://support.office.com/article/Create-DNS-records-for-Office-365-when-you-manage-your-DNS-records-b0f3fdca-8a80-4e8e-9ef3-61e8a2a9ab23/).
 
## Verify the domain name with Azure AD
Once you have added the DNS entry, you are ready to verify the domain name with Azure AD.

A domain name can be verified only after the DNS records have propagated. This propagation often takes only seconds, but it can sometimes take an hour or more. If verification doesn’t work the first time, try again later.

1. Sign in to the [Azure portal](https://aad.portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview) with an account that's a global admin for the directory.
2. On the left, select **Domain names**.
3. On ***directory-name* - Domain names**, select the **Add domain name** command.

3. On ***directory-name* - Domain names**, select the unverified domain name that you want to verify.
4. On ***domainname*** (that is, where your new domain name is the title), select **Verify** to complete the verification.

Now you can [assign user names that include your custom domain name](active-directory-users-create-azure-portal.md).

## Troubleshooting
If you can't verify a custom domain name, use these tips. We start with the most common scenario and work down to the least common.

1. **Wait an hour**. DNS records need to propagate before Azure AD can verify the domain. This process can take an hour or more.
2. **Ensure the DNS record was entered, and that it is correct**. Complete this step at the website for the domain name registrar for the domain. Azure AD cannot verify the domain name if the DNS entry is not found in the DNS zone file, or if it doesn't match the DNS entry that Azure AD provided. If you do not have access to update DNS records for the domain at the domain name registrar, share the DNS entry with the person or team at your organization who has this access, and ask them to add the DNS entry.
3. **Delete the domain name from another directory in Azure AD**. A domain name can be verified in only a single directory. If a domain name was previously verified in another directory, it must be deleted there before it can be verified in your new directory. To learn about deleting domain names, read [Manage custom domain names](active-directory-domains-manage-azure-portal.md).    

## Add more custom domain names
If your organization uses multiple custom domain names, such as ‘contoso.com’ and ‘contosobank.com’, you can add them up to a maximum of 900 domain names. The steps in this article can help you add each of your domain names.

## Next steps
[Manage custom domain names](active-directory-domains-manage-azure-portal.md)

