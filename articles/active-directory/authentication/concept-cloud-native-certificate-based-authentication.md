---
title: Overview of cloud native certificate-based authentication without federation - Azure Active Directory
description: Learn about cloud native certificate-based authentication in Azure Active Directory

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 01/11/2022

ms.author: justinha
author: justinha
manager: daveba
ms.reviewer: tommma

ms.collection: M365-identity-device-management
ms.custom: has-adal-ref
---

# Overview cloud native certificate-based authentication in Azure Active Directory

Cloud native certificate-based authentication (CBA) enables customers to allow or require users to authenticate with X.509 certificates against their Azure Active Directory (Azure AD) for applications and browser sign-in. 
This feature enables customers to adopt a modern passwordless strategy and authenticate with an X.509 certificate against their Enterprise Public Key Infrastructure (PKI).


## What is Cloud native Certificate-based Authentication?

Today, certificate-based authentication requires customers to have federated Active Directory Federation Services (AD FS) to be able to authenticate using X.509 certificates against Azure AD. With this new feature, customers will be able to authenticate directly against Azure AD and eliminate the need for federated AD FS thereby helping simplify their environments and reduce costs.

The following images below show how cloud native CBA simplifies the customer environment by eliminating federated AD FS. 

**Certificate-based authentication with federated AD FS**

:::image type="content" border="false" source="./media/concept-cloud-native-certificate-based-authentication/cert-with-federation.png" alt-text="Diagram of certificate-based authentication with federation.":::

**Cloud native certificate-based authentication**

:::image type="content" border="false" source="./media/concept-cloud-native-certificate-based-authentication/cloud-native-cert.png" alt-text="Diagram of cloud native certificate-based authentication.":::


### Key benefits of using cloud native certificate-based authentication

| Benefits | Description |
|---------|---------|
| Great user experience |- Users who need certificate-based authentication can now directly authenticate against Azure AD and not have to invest in federated AD FS.<br>- Portal UI enables users to easily configure how to map certificate fields to a user object attribute to look up the user in the tenant (certificate username bindings)<br>- Portal UI to configure authentication policies to help determine which certificates are single factor vs multi factor. |
| Easy to deploy and administer |- No need for complex on-premises deployments or network configuration.<br>- Directly authenticate against Azure AD. <br>- No management overhead or cost. |
| Secure |- On-premises passwords need not be stored in the cloud in any form.<br>- Protects your user accounts by working seamlessly with Azure AD Conditional Access policies, including Multi-Factor Authentication (MFA), blocking legacy authentication.<br>- Strong authentication support where users can define authentication policies through the certificate fields like issuer or policy OID (object identifiers) to determine which certificates qualify as single factor vs multi factor. |

### Feature highlights

- Facilitates onboarding to Azure quickly without being delayed by additional on-premises infrastructure to support certificate-based authentication in public and US (UNITED STATES) Gov clouds 
- Provides support for unphishable multi factor authentication
- Supports user sign-in against cloud Azure AD using X.509 certificates into all web browser-based applications and into Microsoft Office client applications that use modern authentication.
- The feature works seamlessly with Conditional Access features such as Multi-Factor Authentication (MFA) to help secure your users.
- It is a free feature, and you do not need any paid editions of Azure AD to use it.
- Eliminates the need for federated AD FS and reduces the cost and on-premises footprint for the customers.

## How does Azure Active Directory Certificate-based Authentication work?

When a user tries to sign into an application secured by Azure AD, and if Certificate-based Authentication is enabled on the tenant, the following steps occur:

1. The user tries to access an application, for example, Office.
1. If the user is not already signed in, the user is redirected to the Azure AD User Sign-in page.
1. The user enters their username into the Azure AD sign in page, and then selects the Next button.
1. Azure AD checks whether Certificate-based Authentication (CBA) is enabled for the tenant.
1. If CBA is enabled, the user sees a link to **Sign in with a certificate** on the password page. If you do not see the sign in link, please make sure Certificate-based Authentication is enabled on the tenant. <Link to faq section>
1. The user clicks on the link which will bring up client certificate picker UI. 
Note: We currently do not have support for CA hints so that the list of certs in the 	 client 	certificate picker UI is not scoped down for users to easily pick the client	certificate.
1. The user selects the client certificate and clicks ok.
1. Azure AD identifies the user in the tenant by using the username binding configured <link to Getting started username binding section) on the tenant by mapping the certificate field value to user attribute value.
1. If a unique user is found successfully, Azure AD signs the user in immediately otherwise the sign in fails.
1. If the user has a conditional access policy and needs Multi-Factor Authentication (MFA) and the certificate authentication binding rule <Link to Getting started Authentication binding section> satisfies MFA, then Azure AD signs the user in immediately. If the certificate satisfies only a single factor, then it requests the user to complete Azure AD Multi-Factor Authentication.
1. If the user sign-in is successful, the user can access the application.

The following diagram illustrates all the components and the steps involved:
<!---Link to a diagram like the one in Azure AD Connect: Pass-through Authentication - How it works | Microsoft Docs--->


## Next steps

•	Getting started with Cloud native Certificate-based authentication - Get up and running Cloud-native Certificate-based Authentication against Azure AD.
•	Current limitations - Learn which scenarios are supported and which ones are not.
•	Technical Deep Dive - Understand how this feature works.
•	Frequently Asked Questions - Answers to frequently asked questions.
•	Troubleshoot - Learn how to resolve common issues with the feature.


