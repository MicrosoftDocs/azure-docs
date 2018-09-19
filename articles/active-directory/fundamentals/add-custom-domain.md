---
title: How to add your custom domain to Azure Active Directory | Microsoft Docs
description: Learn how to add a custom domain using the Azure Active Directory portal.
services: active-directory
author: eross-msft
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.component: fundamentals
ms.topic: conceptual
ms.date: 09/10/2018
ms.author: lizross
ms.reviewer: elkuzmen
ms.custom: it-pro
---

# How to: Add your custom domain name using the Azure Active Directory portal
Every new Azure AD tenant comes with an initial domain name, *domainname*.onmicrosoft.com. You can't change or delete the initial domain name, but you can add your organization's names to the list. Adding custom domain names helps you to create user names that are familiar to your users, such as _alain@contoso.com_.

>[!Note]
>You must repeat this entire process, from start to finish, for each of your custom domain names.

## Add a custom domain name
First, you must add your custom domain name to the Azure AD tenant.

### To add a custom domain name
1. Sign in to the [Azure AD portal](https://portal.azure.com/) using a Global administrator account for the directory.

<<<<<<< HEAD
> [!TIP]
> If you plan to federate your on-premises Windows Server AD with Azure AD, then you need to select the **I plan to configure this domain for single sign-on with my local Active Directory** checkbox when you run the Azure AD Connect tool to synchronize your directories. You also need to register the same domain name you select for federating with your on-premises directory in the **Azure AD Domain** step in the wizard. You can see what that step in the wizard looks like [in these instructions](../hybrid/how-to-connect-install-custom.md#verify-the-azure-ad-domain-selected-for-federation). If you do not have the Azure AD Connect tool, you can [download it here](http://go.microsoft.com/fwlink/?LinkId=615771).
=======
2. Select **Azure Active Directory**, select **Custom domain names**, and then select **Add custom domain**.
>>>>>>> 73f447b1499ba1f189efb6832ad759f1230e55a2

    ![Fabrikam - Custom domain names blade, with Add custom domain option highlighted](media/add-custom-domain/add-custom-domain.png)

3. Type your new corporate domain name into the **Custom domain name** box (for example, _contoso.com_), and then select **Add domain**.

    >[!Important]
    >You must include .com, .net, or any other top-level extension for this to work properly.

    ![Fabrikam - Custom domain names blade, with Add domain button highlighted](media/add-custom-domain/add-custom-domain-blade.png)

4. Copy the DNS entry information from the **Contoso** blade.

    ![Contoso blade with DNS entry information](media/add-custom-domain/contoso-blade-with-dns-info.png)

## Add your domain name with a domain name registrar
Next, you must update the DNS zone file for your new custom domain. You can use [DNS zones](https://docs.microsoft.com/azure/dns/dns-getstarted-portal) for your Azure, Office 365, or external DNS records, or you can add your new DNS entry using a different DNS registrar (for example, [InterNIC](https://go.microsoft.com/fwlink/p/?LinkId=402770)).

### To add your domain name 
1. Sign in to the domain name registrar for your custom domain. If you don't have the right permissions to update your entry, you'll need to contact someone with those permissions.

2. After the DNS entry is updated with the registrar, you must update the DNS zone file with the information provided by Azure AD.

    >[!Note]
    >The DNS entry doesn't change how your mail routing or web hosting works.

## Verify your custom domain name
After you register your custom domain name, it can take a few seconds to a couple of hours before the DNS information propagates to where Azure AD can see it as valid.

### To verify your custom domain name
1. Sign in to the [Azure AD portal](https://portal.azure.com/) using a Global administrator account for the directory.

2. Select **Azure Active Directory**, and then select **Custom domain names**.

3. On the **Fabrikam - Custom domain names** blade, select the custom domain name, **Contoso**.

    ![Fabrikam - Custom domain names blade, with contoso highlighted](media/add-custom-domain/custom-blade-with-contoso-highlighted.png)

4. On the **Contoso** blade, select **Verify** to make sure your custom domain is properly registered and is valid for Azure AD.

    ![Contoso blade with DNS entry information and the Verify button](media/add-custom-domain/contoso-blade-with-dns-info-verify.png)

### Common verification issues
If Azure AD can't verify a custom domain name, try the following suggestions:
- **Wait at least an hour and try again**. DNS records must propagate before Azure AD can verify the domain and this process can take an hour or more.

- **Make sure the DNS record is correct.** Go back to the domain name registrar site and make sure the entry is there, and that it matches the DSN entry information provided by Azure AD.

    If you can't update the record on the registrar site, you must share the entry with someone that has the right permissions to add the entry and verify it's accurate.

- **Make sure the domain name isn't already in another directory.** A domain name can only be verified in one directory, which means that if your domain name is currently verified in another directory, it can't also be verified in the new directory. To fix this duplication problem, you must delete the domain name from the old directory. For more information about deleting domain names, see [Manage custom domain names](../users-groups-roles/domains-manage.md).    

## Next steps
- Add users to your domain, see [Manage custom domain names](../users-groups-roles/domains-manage.md).

- If you have on-premises versions of Windows Server that you want to use alongside Azure Active Directory, see [Integrate your on-premises directories with Azure Active Directory](../connect/active-directory-aadconnect.md).