---
title: enforce signed SAML authentication requests
description: Learn how to enforce signed SAML authentication requests.
services: active-directory
author: AllisonAm
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: conceptual
ms.date: 06/29/2022
ms.author: alamaral
ms.collection: M365-identity-device-management
---

# SAML Request Signature Verification (Preview)

SAML Request Signature Verification is a functionality that validates the signature of signed authentication requests. An App Admin now can enable and disable the enforcement of signed requests and upload the public keys that should be used to do the validation. 

If enabled Azure Active Directory will validate the requests against the public keys configured. There are some scenarios where the authentication requests can fail: 

- Protocol not allowed for signed requests. Only SAML protocol is supported. 
- Request not signed, but verification is enabled. 
- No verification certificate configured for SAML request signature verification. 
- Signature verification failed. 
- Key identifier in request is missing and 2 most recently added certificates do not match with the request signature. 
- Request signed but algorithm missing. 
- No certificate matching with provided key identifier. 
- Signature algorithm not allowed. Only RSA-SHA256 is supported. 

## To Configure SAML Request Signature Verification in the Azure Portal
1. Inside the Azure Portal navigate to **Azure Active Directory** from the Search bar or Azure Services.
![Azure Active Directory inside Azure Portal](./media/howto-enforce-signed-saml-authentication/samlsignaturevalidation1.png)
1. Navigate to **Enterprise applications** from the left menu. 
![Enterprise Application option inside Azure Portal Navigation](./media/howto-enforce-signed-saml-authentication/samlsignaturevalidation2.png)
1. Select the application you wish to apply the changes. 
1. Navigate to **Single sign-on.** 
1. In the **Single sign-on** screen, there is a new subsection called **Verification certificates** under **SAML Certificates.**
![Verification certificates under SAML Certificates on the Enterprise Application page in the Azure Portal](./media/howto-enforce-signed-saml-authentication/samlsignaturevalidation3.png)
1. Click on **Edit.** 
1. In the new blade, you will be able to enable the verification of signed requests and opt-in for weak algorithm verification in case your application still uses RSA-SHA1 to sign the authentication requests.  
1. To enable the verification of signed requests, click **Enable verification certificates** and upload a verification public key that matches with the private key used to sign the request.
![Enable verification certificates in Enterprise Application within the Azure Portal](./media/howto-enforce-signed-saml-authentication/samlsignaturevalidation4.png)
![Upload certificates in Enterprise Application within the Azure Portal](./media/howto-enforce-signed-saml-authentication/samlsignaturevalidation5.png)
![Certificate upload success in Enterprise Application within the Azure Portal](./media/howto-enforce-signed-saml-authentication/samlsignaturevalidation6.png)
1. Once you have your verification certificate uploaded, click **Save.**
![Certificate verification save in Enterprise Application within the Azure Portal](./media/howto-enforce-signed-saml-authentication/samlsignaturevalidation7.png)
![Certificate update success in Enterprise Application within the Azure Portal](./media/howto-enforce-signed-saml-authentication/samlsignaturevalidation8.png)
1. When the verification of signed requests is enabled, the test experience is disabled as the requests requires to be signed by the service provider. 
![Testing disabled warning when signed requests enabled in Enterprise Application within the Azure Portal](./media/howto-enforce-signed-saml-authentication/samlsignaturevalidation9.png)
1. If you want to see the current configuration of an enterprise application, you can navigate to the **Single Sign-on** screen and see the summary of your configuration under **SAML Certificates**. There you will be able to see if the verification of signed requests is enabled and the count of Active and Expired verification certificates.
![Enterprise application configuration in Single Sign-on screen within the Azure Portal](./media/howto-enforce-signed-saml-authentication/samlsignaturevalidation10.png)

## Next steps

* Find out [How Azure AD uses the SAML protocol](../develop/active-directory-saml-protocol-reference.md)
* Learn the format, security characteristics, and contents of [SAML tokens in Azure AD](../develop/reference-saml-tokens.md)
