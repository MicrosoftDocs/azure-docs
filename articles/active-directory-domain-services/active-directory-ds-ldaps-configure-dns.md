---
title: Configure Secure LDAP (LDAPS) in Azure AD Domain Services | Microsoft Docs
description: Configure Secure LDAP (LDAPS) for an Azure AD Domain Services managed domain
services: active-directory-ds
documentationcenter: ''
author: mahesh-unnikrishnan
manager: mtillman
editor: curtand

ms.assetid: a47f0f3e-2578-422a-a421-034f66de38f5
ms.service: active-directory
ms.component: domain-services
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/01/2018
ms.author: maheshu

---
# Configure secure LDAP (LDAPS) for an Azure AD Domain Services managed domain

## Before you begin
Ensure you've completed [Task 3 - enable secure LDAP for the managed domain using the Azure portal](active-directory-ds-admin-guide-configure-secure-ldap-enable-ldaps.md)

## Task 4 - configure DNS to access the managed domain from the internet
> [!TIP]
> **Optional task** - If you do not plan to access the managed domain using LDAPS over the internet, skip this configuration task.
>
>

Before you begin this task, ensure you have completed the steps outlined in [Task 3](#task-3---enable-secure-ldap-for-the-managed-domain-using-the-azure-portal-preview).

Once you have enabled secure LDAP access over the internet for your managed domain, you need to update DNS so that client computers can find this managed domain. At the end of task 3, an external IP address is displayed on the **Properties** tab in **EXTERNAL IP ADDRESS FOR LDAPS ACCESS**.

Configure your external DNS provider so that the DNS name of the managed domain (for example, 'ldaps.contoso100.com') points to this external IP address. For example, create the following DNS entry:

    ```ldaps.contoso100.com  -> 52.165.38.113```

That's it - you are now ready to connect to the managed domain using secure LDAP over the internet.

> [!WARNING]
> Remember that client computers must trust the issuer of the LDAPS certificate to be able to connect successfully to the managed domain using LDAPS. If you are using a publicly trusted certification authority, you do not need to do anything since client computers trust these certificate issuers. If you are using a self-signed certificate, install the public part of the self-signed certificate into the trusted certificate store on the client computer.
>
>

## Next step
[Task 5 - bind to the managed domain and lock down secure LDAP access](active-directory-ds-ldaps-bind-and-lockdown.md)
