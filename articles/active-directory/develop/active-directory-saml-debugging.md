---
title: How to debug SAML-based single sign-on to applications in Azure Active Directory | Microsoft Docs
description: 'Learn how to debug SAML-based single sign-on to applications in Azure Active Directory '
services: active-directory
author: asmalser-msft
documentationcenter: na
manager: mtillman

ms.assetid: edbe492b-1050-4fca-a48a-d1fa97d47815
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 07/20/2017
ms.author: asmalser
ms.custom: aaddev
ms.reviewer: dastrock

---
# How to debug SAML-based single sign-on to applications in Azure Active Directory

When debugging a SAML-based application integration, it is often helpful to use a tool like [Fiddler](http://www.telerik.com/fiddler) to see the SAML request and the SAML response that contain the SAML token that was issued to an application. 

![Fiddler][1]

Frequently the issues are related to a misconfiguration on Azure Active Directory or on the application side. Depending on where you see the error, you have to review the SAML request or response:

- I see an error in my company sign-in page [Links to the section]
- I see an error on the application’s page after signing in [Links to the section]

## I see an error in my company sign-in page.

You can find a one-to-one mapping between the error code and the resolution steps in [Problems signing in to a gallery application configured for federated single sign-on](https://docs.microsoft.com/azure/active-directory/application-sign-in-problem-federated-sso-gallery?/?WT.mc_id=DOC_AAD_How_to_Debug_SAML).

If you see an error in your company sign-in page, you need the error message and SAML request to debug the issue.

### How can I get the error  message?

To get the error message, look at the bottom-right corner of the page. You see an error that includes:

- A CorrelationID
- A timestamp
- A message

![Error][2] 

 
The correlation Id and the timestamp form a unique identifier you can use to find the back-end logs associated with the sign-in failure. These values are important when you create a support case with Microsoft because they  help the engineers to provide a faster resolution to your problem.

The message is the root cause of the sign-in problem. 


### How can I review the SAML request?

The SAML request sent by the application to Azure Active Directory is typically the last HTTP 200 response from  [https://login.microsoftonline.com](https://login.microsoftonline.com).
 
Using Fiddler, you can view the SAML request by selecting this line and then selecting the **Inspectors > WebForms** tab in the right panel. Right-click the **SAMLRequest** value, and then select **Send to TextWizard**. Then select **From Base64** from the **Transform** menu to decode the token and see its contents. 

Also, you can also copy the value in the SAMLrequest and use another Base64 decoder.

    <samlp:AuthnRequest
    xmlns="urn:oasis:names:tc:SAML:2.0:metadata"
    ID="id6c1c178c166d486687be4aaf5e482730"
    Version="2.0" IssueInstant="2013-03-18T03:28:54.1839884Z"
    Destination=https://login.microsoftonline.com/<Tenant-ID>/saml2
    AssertionConsumerServiceURL="https://contoso.applicationname.com/acs"
    xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol">
    <Issuer xmlns="urn:oasis:names:tc:SAML:2.0:assertion">https://www.contoso.com</Issuer>
    </samlp:AuthnRequest>

With the SAML request decoded, review the following:

1. **Destination** in the SAML request correspond the SAML Single Sign-On Service URL obtained from Azure Active Directory.
 
2. **Issuer** in the SAML request is the same **Identifier** you have configured for the application in Azure Active Directory. Azure AD uses the Issuer to find an application in your directory.

3. **AssertionConsumerServiceURL** is where the application expects to receive the SAML token from Azure Active Directory. You can configure this value in Azure Active Directory but it’s not mandatory if it’s part of the SAML request.


## I see an error on the application’s page after signing in

In this scenario, the application is not accepting the response issued by Azure AD. It’s important that you verify the response from Azure AD that contains the SAML token with the application vendor to know what is missing or wrong. 

### How can I get and review the SAML response?

The response from Azure AD that contains the SAML token is typically the one that occurs after an HTTP 302 redirect from https://login.microsoftonline.com and is sent to the configured **Reply URL** of the application. 

You can view the SAML token by selecting this line and then selecting the **Inspectors > WebForms** tab in the right panel. From there, right-click the **SAMLResponse** value and select **Send to TextWizard**. Then select **From Base64** from the **Transform** menu to decode the token and see its contents use another Base64 decoder. 

You can also copy the value in the **SAMLrequest** and use another Base64 decoder.

Visit [Error on application’s page after signing in](https://docs.microsoft.com/azure/active-directory/application-sign-in-problem-federated-sso-gallery?/?WT.mc_id=DOC_AAD_How_to_Debug_SAML) troubleshooting guidance for more information on what may be missing or wrong in the SAML response.

For information on how to review the SAML response visit the article [Single Sign-On SAML protocol](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-single-sign-on-protocol-reference?/?WT.mc_id=DOC_AAD_How_to_Debug_SAML#response).


## Related Articles
* [Article Index for Application Management in Azure Active Directory](../active-directory-apps-index.md)
* [Configuring single sign-on to applications that are not in the Azure Active Directory application gallery](../application-config-sso-how-to-configure-federated-sso-non-gallery.md)
* [How to Customize Claims Issued in the SAML Token for Pre-Integrated Apps](active-directory-saml-claims-customization.md)

<!--Image references-->
[1]: ../media/active-directory-saml-debugging/fiddler.png
[2]: ../media/active-directory-saml-debugging/error.png
