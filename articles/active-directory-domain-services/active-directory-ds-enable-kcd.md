---
title: 'Azure Active Directory Domain Services: Enable kerberos constrained delegation | Microsoft Docs'
description: Enable kerberos constrained delegation on Azure Active Directory Domain Services managed domains
services: active-directory-ds
documentationcenter: ''
author: mahesh-unnikrishnan
manager: mtillman
editor: curtand

ms.assetid: 938a5fbc-2dd1-4759-bcce-628a6e19ab9d
ms.service: active-directory
ms.component: domain-services
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 06/22/2018
ms.author: maheshu

---

# Configure Kerberos constrained delegation (KCD) on a managed domain
Many applications need to access resources in the context of the user. Active Directory supports a mechanism called Kerberos delegation, which enables this use-case. Further, you can restrict delegation so that only specific resources can be accessed in the context of the user. Azure AD Domain Services managed domains are different from traditional Active Directory domains since they are more securely locked down.

This article shows you how to configure Kerberos constrained delegation on an Azure AD Domain Services managed domain.

[!INCLUDE [active-directory-ds-prerequisites.md](../../includes/active-directory-ds-prerequisites.md)]

## Kerberos constrained delegation (KCD)
Kerberos delegation enables an account to impersonate another security principal (such as a user) to access resources. Consider a web application that accesses a back-end web API in the context of a user. In this example, the web application (running in the context of a service account or a computer/machine account) impersonates the user when accessing the resource (back-end web API). Kerberos delegation is insecure since it does not restrict the resources the impersonating account can access in the context of the user.

Kerberos constrained delegation (KCD) restricts the services/resources to which the specified server can act on the behalf of a user. Traditional KCD requires domain administrator privileges to configure a domain account for a service and it restricts the account to a single domain.

Traditional KCD also has a few issues associated with it. In earlier operating systems, if the domain administrator configured account-based KCD for the service, the service administrator had no useful way to know which front-end services delegated to the resource services they owned. And any front-end service that could delegate to a resource service represented a potential attack point. If a server that hosted a front-end service was compromised, and it was configured to delegate to resource services, the resource services could also be compromised.

> [!NOTE]
> On an Azure AD Domain Services managed domain, you do not have domain administrator privileges. Therefore, **traditional account-based KCD cannot be configured on a managed domain**. Use resource-based KCD as described in this article. This mechanism is also more secure.
>
>

## Resource-based KCD
From Windows Server 2012 onwards, service administrators gain the ability to configure constrained delegation for their service. In this model, the back-end service administrator can allow or deny specific front-end services from using KCD. This model is known as **resource-based KCD**.

Resource-based KCD is configured using PowerShell. You use the `Set-ADComputer` or `Set-ADUser` cmdlets, depending on whether the impersonating account is a computer account or a user account/service account.

### Configure resource-based KCD for a computer account on a managed domain
Assume you have a web app running on the computer 'contoso100-webapp.contoso100.com'. It needs to access the resource (a web API running on 'contoso100-api.contoso100.com') in the context of domain users. Here's how you would set up resource-based KCD for this scenario:

1. [Create a custom OU](active-directory-ds-admin-guide-create-ou.md). You can delegate permissions to manage this custom OU to users within the managed domain.
2. Join both virtual machines (the one running the web app and the one running the web API) to the managed domain. Create these computer accounts within the custom OU.
3. Now, configure resource-based KCD using the following PowerShell command:

```powershell
$ImpersonatingAccount = Get-ADComputer -Identity contoso100-webapp.contoso100.com
Set-ADComputer contoso100-api.contoso100.com -PrincipalsAllowedToDelegateToAccount $ImpersonatingAccount
```

> [!NOTE]
> The computer accounts for the web app and the web API need to be in a custom OU where you have permissions to configure resource-based KCD. You cannot configure resource-based KCD for a computer account in the built-in 'AAD DC Computers' container.
>

### Configure resource-based KCD for a user account on a managed domain
Assume you have a web app running as a service account 'appsvc' and it needs to access the resource (a web API running as a service account - 'backendsvc') in the context of domain users. Here's how you would set up resource-based KCD for this scenario.

1. [Create a custom OU](active-directory-ds-admin-guide-create-ou.md). You can delegate permissions to manage this custom OU to users within the managed domain.
2. Join the virtual machine running the backend web API/resource to the managed domain. Create its computer account within the custom OU.
3. Create the service account (for example, 'appsvc') used to run the web app within the custom OU.
4. Now, configure resource-based KCD using the following PowerShell command:

```powershell
$ImpersonatingAccount = Get-ADUser -Identity appsvc
Set-ADUser backendsvc -PrincipalsAllowedToDelegateToAccount $ImpersonatingAccount
```

> [!NOTE]
> Both the computer account for the backend web API and the service account need to be in a custom OU where you have permissions to configure resource-based KCD. You cannot configure resource-based KCD for a computer account in the built-in 'AAD DC Computers' container or for user accounts in the built-in 'AAD DC Users' container. Thus, you cannot use user accounts synchronized from Azure AD to set up resource-based KCD.
>

## Related Content
* [Azure AD Domain Services - Getting Started guide](active-directory-ds-getting-started.md)
* [Kerberos Constrained Delegation Overview](https://technet.microsoft.com/library/jj553400.aspx)
