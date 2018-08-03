---
title: Configure DNS to access a managed domain using LDAPS over the internet | Microsoft Docs
description: Configure DNS to access an Azure AD Domain Services managed domain using LDAPS over the internet
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
ms.topic: conceptual
ms.date: 08/01/2018
ms.author: maheshu

---
# Configure DNS to access an Azure AD Domain Services managed domain using secure LDAP (LDAPS)

## Before you begin
Complete [Task 3: enable secure LDAP for the managed domain using the Azure portal](active-directory-ds-admin-guide-configure-secure-ldap-enable-ldaps.md)

## Task 4: Configure DNS to access the managed domain from the internet
> [!TIP]
> **Optional task** - If you do not plan to access the managed domain using LDAPS over the internet, skip this configuration task.
>
>

Before you begin this task, complete the steps outlined in [Task 3](active-directory-ds-admin-guide-configure-secure-ldap-enable-ldaps.md).

After you enable secure LDAP access over the internet, you need to update DNS so that client computers can find this managed domain. You see an external IP address on the **Properties** tab in **EXTERNAL IP ADDRESS FOR LDAPS ACCESS**.

Configure your external DNS provider so that the DNS name of the managed domain (for example, 'ldaps.contoso100.com') points to this external IP address. For example, create the following DNS entry:

    ldaps.contoso100.com  -> 52.165.38.113

That's it! You're now ready to connect to the managed domain using secure LDAP over the internet.

> [!WARNING]
> Remember that client computers must trust the issuer of the LDAPS certificate to be able to connect successfully to the managed domain using LDAPS. If you are using a publicly trusted certification authority, you do not need to do anything since client computers trust these certificate issuers. If you are using a self-signed certificate, install the public part of the self-signed certificate into the trusted certificate store on the client computer.
>
>

## Next step
[Task 5: bind to the managed domain and lock down secure LDAP access](active-directory-ds-ldaps-bind-lockdown.md)
