---
title: Add a custom domain to Azure AD | Microsoft Docs
description: Explains how to add a custom domain in Azure Active Directory.
services: active-directory
author: eross-msft
manager: mtillman
ms.service: active-directory
ms.workload: identity
ms.component: fundamentals
ms.topic: quickstart
ms.date: 11/14/2017
ms.author: lizross
ms.reviewer: elkuzmen
ms.custom: it-pro
---

# Quickstart: Add a custom domain name to Azure Active Directory

Every Azure AD directory comes with an initial domain name in the form of *domainname*.onmicrosoft.com. The initial domain name cannot be changed or deleted, but you can add your corporate domain name to Azure AD as well. For example, your organization probably has other domain names used to do business and users who sign in using your corporate domain name. Adding custom domain names to Azure AD allows you to assign user names in the directory that are familiar to your users, such as ‘alice@contoso.com.’ instead of 'alice@*domain name*.onmicrosoft.com'. The process is simple:

1. Add the custom domain name to your directory
2. Add a DNS entry for the domain name at the domain name registrar
3. Verify the custom domain name in Azure AD

## Add the custom domain name to your directory
1. Sign in to the [Azure portal](https://aad.portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview) with an account that's a global admin for the directory.
2. On the left, select **Custom domain names**.
3. Select **Add custom domain**.
   
   ![Select the Add command](./media/add-custom-domain/add-custom-domain.png)
5. On **Custom domain names**, enter the name of your custom domain in the box, such as 'contoso.com', and then select **Add Domain**. Be sure to include the .com, .net, or other top-level extension.
6. On ***domainname*** (that is, your new domain name is the title), gather the DNS entry information to use later to verify the custom domain name in Azure AD.
   
   ![get DNS entry information](./media/add-custom-domain/get-dns-info.png)

> [!TIP]
> If you plan to federate your on-premises Windows Server AD with Azure AD, then you need to select the **I plan to configure this domain for single sign-on with my local Active Directory** checkbox when you run the Azure AD Connect tool to synchronize your directories. You also need to register the same domain name you select for federating with your on-premises directory in the **Azure AD Domain** step in the wizard. You can see what that step in the wizard looks like [in these instructions](./../connect/active-directory-aadconnect-get-started-custom.md#verify-the-azure-ad-domain-selected-for-federation). If you do not have the Azure AD Connect tool, you can [download it here](http://go.microsoft.com/fwlink/?LinkId=615771).

## Add a DNS entry for the domain name at the domain name registrar
The next step to use your custom domain name with Azure AD is to update the DNS zone file for the domain. Azure AD can then verify that your organization owns the custom domain name. You can use [Azure DNS](https://docs.microsoft.com/azure/dns/dns-getstarted-portal) for your Azure/Office 365/external DNS records within Azure, or add the DNS entry at [a different DNS registrar](https://support.office.com/article/Create-DNS-records-for-Office-365-when-you-manage-your-DNS-records-b0f3fdca-8a80-4e8e-9ef3-61e8a2a9ab23/).

1. Sign in to the domain name registrar for the domain. If you don't have access to update the DNS entry, ask the person or team who has this access to complete step 2 and to let you know when it is completed.
2. Update the DNS zone file for the domain by adding the DNS entry provided to you by Azure AD. The DNS entry doesn't change any behaviors such as mail routing or web hosting.

## Verify the custom domain name in Azure AD
Once you have added the DNS entry, you are ready to verify the domain name with Azure AD. A domain name can be verified only after the DNS records have propagated. This propagation often takes only seconds, but it can sometimes take an hour or more. If verification doesn’t work the first time, try again later.

1. Sign in to [Azure AD](https://aad.portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview) with an account that's a global admin for the tenant.
2. Select **Custom domain names**.
3. Select the unverified domain name that you want to verify.
4. Check your entries and select **Verify** to complete the verification.

Now you can [assign user names that include your custom domain name](../users-groups-roles/domains-manage.md). You can create cloud-based user accounts, or update previously synchronized on-premises user account information, using your custom domain name. You can also change synchronized user account domain suffix information using [Microsoft PowerShell](https://msdn.microsoft.com/library/azure/e1ef403f-3347-4409-8f46-d72dafa116e0#BKMK_ManageDomains) or the [Graph API](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/domains-operations).

> [!TIP]
> You can add up to a maximum of 900 managed domain names. If you are configuring all of your domains for federation on-premises with Active Directory, you can add up to a maximum of 450 domain names in each directory. For more information, see [Federated and managed domain names](https://docs.microsoft.com/azure/active-directory/active-directory-add-domain-concepts#federated-and-managed-domain-names).

## Troubleshooting
If you can't verify a custom domain name, try the following troubleshooting steps:

1. **Wait an hour**. DNS records must propagate before Azure AD can verify the domain. This process can take an hour or more.
2. **Ensure the DNS record was entered, and that it is correct**. Complete this step at the website for the domain name registrar for the domain. Azure AD can't verify the domain name if 
  * The DNS entry is not present in the DNS zone file
  * It is not an exact match with the DNS entry that Azure AD provided you. 
  
  If you do not have access to update DNS records for the domain at the domain name registrar, share the DNS entry with the person or team at your organization who has this access, and ask them to add the DNS entry.
3. **Delete the domain name from another directory in Azure AD**. A domain name can be verified in only a single directory. If a domain name is currently verified in a different directory, it can't be verified in your new directory until it is deleted on the other one. To learn about deleting domain names, read [Manage custom domain names](../users-groups-roles/domains-manage.md).    

Repeat the steps in this article to add each of your domain names.

## Learn more
[Conceptual overview of custom domain names in Azure AD](../users-groups-roles/domains-manage.md)

[Manage custom domain names](../users-groups-roles/domains-manage.md)

## Next steps
In this quickstart, you’ve learned how to add a custom domain to Azure AD. 

You can use the following link to add a new custom domain in Azure AD from the Azure portal.

> [!div class="nextstepaction"]
> [Add a custom domain](https://aad.portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/QuickStart) 