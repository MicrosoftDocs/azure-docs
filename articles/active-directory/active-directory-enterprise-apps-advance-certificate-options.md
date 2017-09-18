---
title: Advanced certificate signing options in the SAML token for pre-integrated apps in Azure Active Directory | Microsoft Docs
description: Learn how to use advanced certificate signing options in the SAML token for pre-integrated apps in Azure Active Directory
services: active-directory
documentationcenter: ''
author: jeevansd
manager: femila
editor: ''

ms.assetid: ''
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/07/2017
ms.author: jeedes
ms.custom: aaddev

---
# Advanced certificate signing options in the SAML token for gallery apps in Azure Active Directory
Today Azure Active Directory supports thousands of pre-integrated applications in the Azure AD Application Gallery, including over 500 that support single sign-on using the SAML 2.0 protocol. When a user authenticates to an application through Azure AD using SAML, Azure AD sends a token to the application (via an HTTP POST). Then, the application validates and uses the token to log the user in instead of prompting for a username and password. These SAML tokens are signed with the unique certificate that is generated in Azure AD. This SAML token is signed with the specific standard algorithms.

Azure Active Directory uses some of the default settings for the gallery applications. Based on the application requirement the default values are set up.

Azure Active Directory support advance certificate signing settings. To select these options, first select the **SAML advance certificate signing settings** checkbox as shown following.

![Certificate signing options][1]

Once, this checkbox is checked then you can set up the **Certificate signing options** and **Certificate signing algorithm**.

## Certificate signing options

Following are the three types of Certificate signing options are supported by Azure AD.

1. **Sign SAML assertion** - This is the default option set for most of the gallery applications. If this option is selected, then Azure AD as an IDP signs the SAML Assertions and Certificate with the X509 certificate of the application. Also it uses the signing algorithm, which is selected in the drop-down below.

2. **Sign SAML response** - If this option is selected then Azure AD as IDP signs the SAML Response with the X509 certificate of the application. Also it uses the signing algorithm, which is selected in the drop-down below.

3. **Sign SAML response and assertion** - If this option is selected then Azure AD as IDP sign the entire SAML token with the X509 certificate of the application. Also it uses the signing algorithm, which is selected in the drop-down below.

    ![Certificate signing options][4]

## Certificate signing algorithm

Azure Active Directory support two types of signing algorithm to sign the SAML response.

1. SHA256 - This is the default algorithm which Azure Active Directory use to sign the SAML Response. This is the newest algorithm and treated as more secure than SHA1. Most of the application does support SHA256 algorithm. If the application only supports Sha1 as signing algorithm, then you can change it. otherwise we recommend using SHA256 algorithm for signing the SAML Response.

    ![SHA256 Certificate signing algorithm][3]

2. SHA1 - This is the older algorithm and not treated as secure. If the application support only this signing algorithm, then you can select this option in the drop-down. With that Azure AD signs the SAML Response with Sha1 algorithm.

    ![SHA1 Certificate signing algorithm][2]

## Next steps
* [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)
* [Configuring single sign-on to applications that are not in the Azure Active Directory application gallery](active-directory-saas-custom-apps.md)
* [Troubleshooting SAML-Based Single Sign-On](develop/active-directory-saml-debugging.md)

<!--Image references-->

[1]: ./media/active-directory-enterprise-apps-advance-certificate-options/saml-advance-certificate.png
[2]: ./media/active-directory-enterprise-apps-advance-certificate-options/saml-signing-algo-sha1.png
[3]: ./media/active-directory-enterprise-apps-advance-certificate-options/saml-signing-algo-sha256.png
[4]: ./media/active-directory-enterprise-apps-advance-certificate-options/saml-signing-options.png