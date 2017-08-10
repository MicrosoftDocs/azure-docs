---

title: Add a custom domain to Azure AD | Microsoft Docs
description: Explains how to add a custom domain in Azure Active Directory.
services: active-directory
author: jeffgilb
manager: femila
ms.assetid: 0a90c3c5-4e0e-43bd-a606-6ee00f163038
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/10/2017
ms.author: jeffgilb
ms.reviewer: jsnow
ms.custom: it-pro

---
# Quickstart: Add a custom domain name to Azure Active Directory

Every Azure AD directory comes with an initial domain name in the form of *domainname*.onmicrosoft.com. The initial domain name cannot be changed or deleted, but you can add your corporate domain name to Azure AD as well. For example, your organization probably has other domain names used to do business and users who sign in using your corporate domain name. Adding custom domain names to Azure AD allows you to assign user names in the directory that are familiar to your users, such as ‘alice@contoso.com.’ instead of 'alice@*<domain name>*.onmicrosoft.com'. The process is simple:

1. Add the custom domain name to your directory
2. Add a DNS entry for the domain name at the domain name registrar
3. Verify the custom domain name in Azure AD

## Add your custom domain
1. Sign in to the [Azure portal](https://portal.azure.com) with an account that's a global admin for the directory.
2. Select **More services**, enter **Azure Active Directory** in the text box, and then select **Enter**.
   
   ![Opening user management](./media/active-directory-domains-add-azure-portal/user-management.png)
3. On the ***directory-name*** blade, select **Domain names**.
4. On the ***directory-name* - Domain names** blade, select the **Add** command.
   
   ![Selecting the Add command](./media/active-directory-domains-add-azure-portal/add-command.png)
5. On the **Domain name** blade, enter the name of your custom domain in the box, such as 'contoso.com', and then select **Add Domain**. Be sure to include the .com, .net, or other top-level extension.
6. On the ***domain name*** blade (with your custom domain name in the title), get the DNS entry information to use to verify that your organization owns the custom domain name.
   
   ![get DNS entry information](./media/active-directory-domains-add-azure-portal/get-dns-info.png)

> [!TIP]
> If you plan to federate your on-premises Windows Server AD with Azure AD, then you need to select the **I plan to configure this domain for single sign-on with my local Active Directory** checkbox when you run the Azure AD Connect tool to synchronize your directories. You also need to register the same domain name you select for federating with your on-premises directory in the **Azure AD Domain** step in the wizard. You can see what that step in the wizard looks like [in these instructions](./connect/active-directory-aadconnect-get-started-custom.md#verify-the-azure-ad-domain-selected-for-federation). If you do not have the Azure AD Connect tool, you can [download it here](http://go.microsoft.com/fwlink/?LinkId=615771).

Now that you've added the domain name, Azure AD must verify that your organization owns the domain name. Before Azure AD can perform this verification, you must add a DNS entry in the DNS zone file for the domain name. This task is performed at the website for domain name registrar for the domain name.

## Add the DNS entry at the domain name registrar for the domain
The next step to use your custom domain name with Azure AD is to update the DNS zone file for the domain. Azure AD can then verify that your organization owns the custom domain name.

1. Sign in to the domain name registrar for the domain. If you don't have access to update the DNS entry, ask the person or team who has this access to complete step 2 and to let you know when it is completed.
2. Update the DNS zone file for the domain by adding the DNS entry provided to you by Azure AD. This DNS entry enables Azure AD to verify your ownership of the domain. The DNS entry doesn't change any behaviors such as mail routing or web hosting.

For help with this adding the DNS entry, read [Instructions for adding a DNS entry at popular DNS registrars](https://support.office.com/article/Create-DNS-records-for-Office-365-when-you-manage-your-DNS-records-b0f3fdca-8a80-4e8e-9ef3-61e8a2a9ab23/)

## Verify the domain name with Azure AD
Once you have added the DNS entry, you are ready to verify the domain name with Azure AD.

A domain name can be verified only after the DNS records have propagated. This propagation often takes only seconds, but it can sometimes take an hour or more. If verification doesn’t work the first time, try again later.

1. Sign in to the [Azure portal](https://portal.azure.com) with an account that's a global admin for the directory.
2. Select **Browse**, enter User Management in the text box, and then select **Enter**.
   
   ![Opening user management](./media/active-directory-domains-add-azure-portal/user-management.png)
3. On the **User management - Domain names** blade, select the unverified domain name that you want to verify.
4. On the ***domain name*** blade (that is, the blade that opens that has your new domain name in the title), select **Verify** to complete the verification.

> [!TIP]
> You can add up to 900 custom domain names, but only one can be [set as the primary domain name for your Azure AD directory](active-directory-domains-manage-azure-portal.md#set-the-primary-domain-name-for-your-azure-ad-directory) used by default when you create new accounts.

Now you can create cloud-based user accounts, or update previously synchronized on-premises user account information, using your custom domain name. You can also modify previously synchronized user account domain suffix information using [Microsoft PowerShell](https://msdn.microsoft.com/library/azure/e1ef403f-3347-4409-8f46-d72dafa116e0#BKMK_ManageDomains) or the [Graph API](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/domains-operations).

## Troubleshooting
If you can't verify a custom domain name, try the following troubleshooting steps:

1. **Wait an hour**. DNS records need to propagate before Azure AD can verify the domain. This can take an hour or more.
2. **Ensure the DNS record was entered, and that it is correct**. Complete this step at the website for the domain name registrar for the domain. Azure AD cannot verify the domain name if the DNS entry is not present in the DNS zone file, or if it is not an exact match with the DNS entry that Azure AD provided you. If you do not have access to update DNS records for the domain at the domain name registrar, share the DNS entry with the person or team at your organization who has this access, and ask them to add the DNS entry.
3. **Delete the domain name from another directory in Azure AD**. A domain name can be verified in only a single directory. If a domain name was previously verified in another directory, it must be deleted there before it can be verified in your new directory. To learn about deleting domain names, read [Manage custom domain names](active-directory-domains-manage-azure-portal.md).    

## Add more custom domain names
If your organization uses more than one custom domain name, such as ‘contoso.com’ and ‘contosobank.com’, you can add up to 900 more by repeating the steps in this article for each.

### Learn more
[Conceptual overview of custom domain names in Azure AD](active-directory-add-domain-concepts.md)

[Manage custom domain names](active-directory-domains-manage-azure-portal.md)


## Next steps
In this quickstart, you’ve learned how to add a custom domain to Azure AD. 

You can use the following link to add a new custom domain in Azure AD from the Azure portal.

> [!div class="nextstepaction"]
> [Add a custom domain](https://aad.portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/QuickStart) 