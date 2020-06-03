---
title: Kerberos constrained delegation for Azure AD Domain Services | Microsoft Docs
description: Learn how to enable resource-based Kerberos constrained delegation (KCD) in an Azure Active Directory Domain Services managed domain.
services: active-directory-ds
author: iainfoulds
manager: daveba

ms.assetid: 938a5fbc-2dd1-4759-bcce-628a6e19ab9d
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: how-to
ms.date: 03/30/2020
ms.author: iainfou

---
# Configure Kerberos constrained delegation (KCD) in Azure Active Directory Domain Services

As you run applications, there may be a need for those applications to access resources in the context of a different user. Active Directory Domain Services (AD DS) supports a mechanism called *Kerberos delegation* that enables this use-case. Kerberos *constrained* delegation (KCD) then builds on this mechanism to define specific resources that can be accessed in the context of the user. Azure Active Directory Domain Services (Azure AD DS) managed domains are more securely locked down than traditional on-premises AD DS environments, so use a more secure *resource-based* KCD.

This article shows you how to configure resource-based Kerberos constrained delegation in an Azure AD DS managed domain.

## Prerequisites

To complete this article, you need the following resources:

* An active Azure subscription.
    * If you don't have an Azure subscription, [create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* An Azure Active Directory tenant associated with your subscription, either synchronized with an on-premises directory or a cloud-only directory.
    * If needed, [create an Azure Active Directory tenant][create-azure-ad-tenant] or [associate an Azure subscription with your account][associate-azure-ad-tenant].
* An Azure Active Directory Domain Services managed domain enabled and configured in your Azure AD tenant.
    * If needed, [create and configure an Azure Active Directory Domain Services managed domain][create-azure-ad-ds-instance].
* A Windows Server management VM that is joined to the Azure AD DS managed domain.
    * If needed, complete the tutorial to [create a Windows Server VM and join it to a managed domain][create-join-windows-vm] then [install the AD DS management tools][tutorial-create-management-vm].
* A user account that's a member of the *Azure AD DC administrators* group in your Azure AD tenant.

## Kerberos constrained delegation overview

Kerberos delegation lets one account impersonate another account to access resources. For example, a web application that accesses a back-end web component can impersonate itself as a different user account when it makes the back-end connection. Kerberos delegation is insecure as it doesn't limit what resources the impersonating account can access.

Kerberos constrained delegation (KCD) restricts the services or resources that a specified server or application can connect when impersonating another identity. Traditional KCD requires domain administrator privileges to configure a domain account for a service, and it restricts the account to run on a single domain.

Traditional KCD also has a few issues. For example, in earlier operating systems, the service administrator had no useful way to know which front-end services delegated to the resource services they owned. Any front-end service that could delegate to a resource service was a potential attack point. If a server that hosted a front-end service configured to delegate to resource services was compromised, the resource services could also be compromised.

In a managed domain, you don't have domain administrator privileges. As a result, traditional account-based KCD can't be configured in a managed domain. Resource-based KCD can instead be used, which is also more secure.

### Resource-based KCD

Windows Server 2012 and later gives service administrators the ability to configure constrained delegation for their service. This model is known as resource-based KCD. With this approach, the back-end service administrator can allow or deny specific front-end services from using KCD.

Resource-based KCD is configured using PowerShell. You use the [Set-ADComputer][Set-ADComputer] or [Set-ADUser][Set-ADUser] cmdlets, depending on whether the impersonating account is a computer account or a user account / service account.

## Configure resource-based KCD for a computer account

In this scenario, let's assume you have a web app that runs on the computer named *contoso-webapp.aaddscontoso.com*. The web app needs to access a web API that runs on the computer named *contoso-api.aaddscontoso.com* in the context of domain users. Complete the following steps to configure this scenario:

1. [Create a custom OU](create-ou.md). You can delegate permissions to manage this custom OU to users within the managed domain.
1. [Domain-join the virtual machines][create-join-windows-vm], both the one that runs the web app, and the one that runs the web API, to the managed domain. Create these computer accounts in the custom OU from the previous step.

    > [!NOTE]
    > The computer accounts for the web app and the web API must be in a custom OU where you have permissions to configure resource-based KCD. You can't configure resource-based KCD for a computer account in the built-in *AAD DC Computers* container.

1. Finally, configure resource-based KCD using the [Set-ADComputer][Set-ADComputer] PowerShell cmdlet. From your domain-joined management VM and logged in as user account that's a member of the *Azure AD DC administrators* group, run the following cmdlets. Provide your own computer names as needed:
    
    ```powershell
    $ImpersonatingAccount = Get-ADComputer -Identity contoso-webapp.aaddscontoso.com
    Set-ADComputer contoso-api.aaddscontoso.com -PrincipalsAllowedToDelegateToAccount $ImpersonatingAccount
    ```

## Configure resource-based KCD for a user account

In this scenario, let's assume you have a web app that runs as a service account named *appsvc*. The web app needs to access a web API that runs as a service account named *backendsvc* in the context of domain users. Complete the following steps to configure this scenario:

1. [Create a custom OU](create-ou.md). You can delegate permissions to manage this custom OU to users within the managed domain.
1. [Domain-join the virtual machines][create-join-windows-vm] that run the backend web API/resource to the managed domain. Create its computer account within the custom OU.
1. Create the service account (for example, 'appsvc') used to run the web app within the custom OU.

    > [!NOTE]
    > Again, the computer account for the web API VM, and the service account for the web app, must be in a custom OU where you have permissions to configure resource-based KCD. You can't configure resource-based KCD for accounts in the built-in *AAD DC Computers* or *AAD DC Users* containers. This also means that you can't use user accounts synchronized from Azure AD to set up resource-based KCD. You must create and use service accounts specifically created in Azure AD DS.

1. Finally, configure resource-based KCD using the [Set-ADUser][Set-ADUser] PowerShell cmdlet. From your domain-joined management VM and logged in as user account that's a member of the *Azure AD DC administrators* group, run the following cmdlets. Provide your own service names as needed:

    ```powershell
    $ImpersonatingAccount = Get-ADUser -Identity appsvc
    Set-ADUser backendsvc -PrincipalsAllowedToDelegateToAccount $ImpersonatingAccount
    ```

## Next steps

To learn more about how delegation works in Active Directory Domain Services, see [Kerberos Constrained Delegation Overview][kcd-technet].

<!-- INTERNAL LINKS -->
[create-azure-ad-tenant]: ../active-directory/fundamentals/sign-up-organization.md
[associate-azure-ad-tenant]: ../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md
[create-azure-ad-ds-instance]: tutorial-create-instance.md
[create-join-windows-vm]: join-windows-vm.md
[tutorial-create-management-vm]: tutorial-create-management-vm.md
[Set-ADComputer]: /powershell/module/addsadministration/set-adcomputer
[Set-ADUser]: /powershell/module/addsadministration/set-aduser

<!-- EXTERNAL LINKS -->
[kcd-technet]: https://technet.microsoft.com/library/jj553400.aspx
