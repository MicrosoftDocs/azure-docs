---
title: How to debug SAML-based single sign-on to applications in Azure Active Directory | Microsoft Docs
description: 'Learn how to debug SAML-based single sign-on to applications in Azure Active Directory '
services: active-directory
author: asmalser-msft
documentationcenter: na
manager: femila

ms.assetid: edbe492b-1050-4fca-a48a-d1fa97d47815
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 02/09/2016
ms.author: asmalser
ms.custom: aaddev

---
# How to debug SAML-based single sign-on to applications in Azure Active Directory
When debugging a SAML-based application integration, it is often helpful to use a tool like [Fiddler](http://www.telerik.com/fiddler) to see the SAML request, the SAML response, and the actual SAML token that is issued to the application. By examining the SAML token, you can ensure that all of the required attributes, the username in the SAML subject, and the issuer URI are coming through as expected.

![][1]

The response from Azure AD that contains the SAML token is typically the one that occurs after an HTTP 302 redirect from https://login.windows.net, and is sent to the configured **Reply URL** of the application. 

You can view the SAML token by selecting this line and then selecting the **Inspectors > WebForms** tab in the right panel. From there, right-click the **SAMLResponse** value and select **Send to TextWizard**. Then select **From Base64** from the **Transform** menu to decode the token and see its contents.

**Note**: To see the contents of this HTTP request, Fiddler may prompt you to configure decryption of HTTPS traffic, which you will need to do.

## Related Articles
* [Article Index for Application Management in Azure Active Directory](../active-directory-apps-index.md)
* [Configuring single sign-on to applications that are not in the Azure Active Directory application gallery](../active-directory-saas-custom-apps.md)
* [How to Customize Claims Issued in the SAML Token for Pre-Integrated Apps](active-directory-saml-claims-customization.md)

<!--Image references-->
[1]: ../media/active-directory-saml-debugging/fiddler.png