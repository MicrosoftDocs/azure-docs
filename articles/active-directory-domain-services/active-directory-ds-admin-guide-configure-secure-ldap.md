---
title: Configure Secure LDAP (LDAPS) in Azure AD Domain Services | Microsoft Docs
description: Configure Secure LDAP (LDAPS) for an Azure AD Domain Services managed domain
services: active-directory-ds
documentationcenter: ''
author: mahesh-unnikrishnan
manager: mtillman
editor: curtand

ms.assetid: c6da94b6-4328-4230-801a-4b646055d4d7
ms.service: active-directory
ms.component: domain-services
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 09/25/2018
ms.author: maheshu

---
# Configure secure LDAP (LDAPS) for an Azure AD Domain Services managed domain
This article shows how you can enable Secure Lightweight Directory Access Protocol (LDAPS) for your Azure AD Domain Services managed domain. Secure LDAP is also known as 'Lightweight Directory Access Protocol (LDAP) over Secure Sockets Layer (SSL) / Transport Layer Security (TLS)'.

[!INCLUDE [active-directory-ds-prerequisites.md](../../includes/active-directory-ds-prerequisites.md)]

## Before you begin
To perform the tasks listed in this article, you need:

1. A valid **Azure subscription**.
2. An **Azure AD directory** - either synchronized with an on-premises directory or a cloud-only directory.
3. **Azure AD Domain Services** must be enabled for the Azure AD directory. If you haven't done so, follow all the tasks outlined in the [Getting Started guide](active-directory-ds-getting-started.md).
4. A **certificate to be used to enable secure LDAP**.

   * **Recommended** - Obtain a certificate from a trusted public certification authority. This configuration option is more secure.
   * Alternately, you may also choose to [create a self-signed certificate](#task-1---obtain-a-certificate-for-secure-ldap) as shown later in this article.

<br>

### Requirements for the secure LDAP certificate
Acquire a valid certificate per the following guidelines, before you enable secure LDAP. You encounter failures if you try to enable secure LDAP for your managed domain with an invalid/incorrect certificate.

1. **Trusted issuer** - The certificate must be issued by an authority trusted by computers connecting to the managed domain using secure LDAP. This authority may be a public certification authority (CA) or an Enterprise CA trusted by these computers.
2. **Lifetime** - The certificate must be valid for at least the next 3-6 months. Secure LDAP access to your managed domain is disrupted when the certificate expires.
3. **Subject name** - The subject name on the certificate must be a wildcard for your managed domain. For instance, if your domain is named 'contoso100.com', the certificate's subject name must be '*.contoso100.com'. Set the DNS name (subject alternate name) to this wildcard name.
4. **Key usage** - The certificate must be configured for the following uses - Digital signatures and key encipherment.
5. **Certificate purpose** - The certificate must be valid for SSL server authentication.

<br>

## Task 1 - obtain a certificate for secure LDAP
The first task involves obtaining a certificate used for secure LDAP access to the managed domain. You have two options:

* Obtain a certificate from a public CA or an enterprise CA.
* Create a self-signed certificate.

> [!NOTE]
> Client computers that need to connect to the managed domain using secure LDAP must trust the issuer of the secure LDAP certificate.
>

### Option A (Recommended) - Obtain a secure LDAP certificate from a certification authority
If your organization obtains its certificates from a public CA, obtain the secure LDAP certificate from that public CA. If you deploy an enterprise CA, obtain the secure LDAP certificate from the enterprise CA.

> [!TIP]
> **Use self-signed certificates for managed domains with '.onmicrosoft.com' domain suffixes.**
> If the DNS domain name of your managed domain ends in '.onmicrosoft.com', you cannot obtain a secure LDAP certificate from a public certification authority. Since Microsoft owns the 'onmicrosoft.com' domain, public certification authorities refuse to issue a secure LDAP certificate to you for a domain with this suffix. In this scenario, create a self-signed certificate and use that to configure secure LDAP.
>

Ensure the certificate you obtain from the public certificate authority satisfies all the requirements outlined in [requirements for the secure LDAP certificate](#requirements-for-the-secure-ldap-certificate).


### Option B - Create a self-signed certificate for secure LDAP
If you do not expect to use a certificate from a public certification authority, you may choose to create a self-signed certificate for secure LDAP. Pick this option if the DNS domain name of your managed domain ends in '.onmicrosoft.com'.

**Create a self-signed certificate using PowerShell**

On your Windows computer, open a new PowerShell window as **Administrator** and type the following commands, to create a new self-signed certificate.

```powershell
$lifetime=Get-Date
New-SelfSignedCertificate -Subject contoso100.com `
  -NotAfter $lifetime.AddDays(365) -KeyUsage DigitalSignature, KeyEncipherment `
  -Type SSLServerAuthentication -DnsName *.contoso100.com
```

In the preceding sample, replace '*.contoso100.com' with the DNS domain name of your managed domain. For example, if you created a managed domain called 'contoso100.onmicrosoft.com', replace '*.contoso100.com' in the preceding script with '*.contoso100.onmicrosoft.com').

![Select Azure AD Directory](./media/active-directory-domain-services-admin-guide/secure-ldap-powershell-create-self-signed-cert.png)

The newly created self-signed certificate is placed in the local machine's certificate store.


## Next step
[Task 2 - export the secure LDAP certificate to a .PFX file](active-directory-ds-admin-guide-configure-secure-ldap-export-pfx.md)
