---
title: CertificateUserIds for Azure AD certificate-based authentication (Preview) - Azure Active Directory 
description: Learn about CertificateUserIds for Azure AD certificate-based authentication without federation

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 09/14/2022

ms.author: justinha
author: vimrang
manager: daveba
ms.reviewer: vimrang

ms.collection: M365-identity-device-management
ms.custom: has-adal-ref
---

# CertificateUserIds 

Azure AD has added a new user object attribute ‘CertificateUserIds’ which is a multi-valued attribute. The attribute allows a maximum of 4 values and each value can be of 120-character length. This attribute can store any value and need not be in an email Id format and can be used to store non-routable UPNs like bob@contoso or bob@local.
 
Supported patterns for certificateUserIds:
 
The values stored in certificateUserIds should be in an allowed format described in the table below
 
Certificate Mapping Field	Example Values in CertificateUserIds
PrincipalName	“X509:\<PN\>bob@contoso.com”

PrincipalName	“X509:\<P\N>bob@contoso” 

RFC822Name	“X509:\<RFC822\>user@contoso.com”

X509SKI	“X509:\<SKI\>123456789abcdef”
X509SHA1PublicKey	“X509:\<SHA1-PUKEY\>123456789abcdef”
 
## Update CertificateUserIds in the Azure portal
 
Tenant admins can use Azure portal to update the CertificateUserIds attribute on the user page.



