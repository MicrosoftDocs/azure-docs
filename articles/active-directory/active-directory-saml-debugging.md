<properties 
    pageTitle="How to debug SAML-based single sign-on to applications in Azure Active Directory | Microsoft Azure" 
    description="Learn how to debug SAML-based single sign-on to applications in Azure Active Directory " 
    services="active-directory" 
    authors="asmalser-msft"  
    documentationCenter="na" manager="stevenpo"/>
<tags 
    ms.service="active-directory" 
    ms.devlang="na" 
    ms.topic="article" 
    ms.tgt_pltfrm="na" 
    ms.workload="identity" 
    ms.date="11/18/2015" 
    ms.author="asmalser" />

#How to debug SAML-based single sign-on to applications in Azure Active Directory

When debugging a SAML-based application integration, it is often helpful to use a tool like [Fiddler](http://www.telerik.com/fiddler) to see the SAML request, the SAML response, and the actual SAML token that is issued to the application. By examining the SAML token, you can ensure that all of the required attributes, the username in the SAML subject, and the issuer URI are coming through as expected.

![][1]

The response from Azure AD that contains the SAML token is typically the one that occurs after an HTTP 302 redirect from https://login.windows.net, and is sent to the configured **Reply URL** of the application. 
 
You can view the SAML token by selecting this line and then selecting the **Inspectors > WebForms** tab in the right panel. From there, right-click the **SAMLResponse** value and select **Send to TextWizard**. Then select **From Base64** from the **Transform** menu to decode the token and see its contents.
 
**Note**: To see the contents of this HTTP request, Fiddler may prompt you to configure decryption of HTTPS traffic, which you will need to do.

<!--Image references-->
[1]: ./media/active-directory-saml-debugging/fiddler.png