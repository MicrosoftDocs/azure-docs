---
title: Overview of cloud-native certificate-based authentication without federation - Azure Active Directory
description: Learn about cloud-native certificate-based authentication in Azure Active Directory

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 01/19/2022

ms.author: justinha
author: justinha
manager: daveba
ms.reviewer: tommma

ms.collection: M365-identity-device-management
ms.custom: has-adal-ref
---

# Overview cloud-native certificate-based authentication in Azure Active Directory

Cloud-native certificate-based authentication (CBA) enables customers to allow or require users to authenticate with X.509 certificates against their Azure Active Directory (Azure AD) for applications and browser sign-in. 
This feature enables customers to adopt a modern passwordless strategy and authenticate with an X.509 certificate against their Enterprise Public Key Infrastructure (PKI).

## What is cloud-native certificate-based authentication?

Previously, certificate-based authentication required customers to have federated Active Directory Federation Services (AD FS) to be able to authenticate using X.509 certificates against Azure AD. With cloud-native certificate-based authentication, customers will be able to authenticate directly against Azure AD and eliminate the need for federated AD FS thereby helping simplify their environments and reduce costs.

The following images below show how cloud-native CBA simplifies the customer environment by eliminating federated AD FS. 

**Certificate-based authentication with federated AD FS**

:::image type="content" border="false" source="./media/concept-cloud-native-certificate-based-authentication/cert-with-federation.png" alt-text="Diagram of certificate-based authentication with federation.":::

**Cloud-native certificate-based authentication**

:::image type="content" border="false" source="./media/concept-cloud-native-certificate-based-authentication/cloud-native-cert.png" alt-text="Diagram of cloud-native certificate-based authentication.":::


### Key benefits of using cloud-native certificate-based authentication

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

## Next steps

- [Technical deep dive for cloud-native certificate-based authentication](concept-cloud-native-certificate-based-authentication-technical-deep-dive.md)   
- [Limitations with cloud-native certificate-based authentication](concept-cloud-native-certificate-based-authentication-limitations.md)
- [Get started with cloud-native certificate-based authentication](how-to-certificate-based-authentication.md)
- [FAQ](cloud-native-certificate-based-authentication-faq.yml)
- [Troubleshoot cloud-native certificate-based authentication](troubleshoot-cloud-native-certificate-based-authentication.md)

