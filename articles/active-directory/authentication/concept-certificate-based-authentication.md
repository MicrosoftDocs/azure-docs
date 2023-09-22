---
title: Overview of Microsoft Entra certificate-based authentication 
description: Learn about Microsoft Entra certificate-based authentication without federation

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 01/29/2023

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: vimrang

ms.collection: M365-identity-device-management
ms.custom: has-adal-ref
---

# Overview of Microsoft Entra certificate-based authentication

Microsoft Entra certificate-based authentication (CBA) enables customers to allow or require users to authenticate directly with X.509 certificates against their Microsoft Entra ID for applications and browser sign-in. 
This feature enables customers to adopt a phishing resistant authentication and authenticate with an X.509 certificate against their Public Key Infrastructure (PKI).

<a name='what-is-azure-ad-cba'></a>

## What is Microsoft Entra CBA?

Before cloud-managed support for CBA to Microsoft Entra ID, customers had to implement federated certificate-based authentication, which requires deploying Active Directory Federation Services (AD FS) to be able to authenticate using X.509 certificates against Microsoft Entra ID. With Microsoft Entra certificate-based authentication, customers can authenticate directly against Microsoft Entra ID and eliminate the need for federated AD FS, with simplified customer environments and cost reduction.

The following images show how Microsoft Entra CBA simplifies the customer environment by eliminating federated AD FS. 

**Certificate-based authentication with federated AD FS**

:::image type="content" border="false" source="./media/concept-certificate-based-authentication/cert-with-federation.png" alt-text="Diagram of certificate-based authentication with federation.":::

**Microsoft Entra certificate-based authentication**

:::image type="content" border="false" source="./media/concept-certificate-based-authentication/cloud-native-cert.png" alt-text="Diagram of Microsoft Entra certificate-based authentication.":::


<a name='key-benefits-of-using-azure-ad-cba'></a>

## Key benefits of using Microsoft Entra CBA

| Benefits | Description |
|---------|---------|
| Great user experience |- Users who need certificate-based authentication can now directly authenticate against Microsoft Entra ID and not have to invest in federated AD FS.<br>- Portal UI enables users to easily configure how to map certificate fields to a user object attribute to look up the user in the tenant ([certificate username bindings](concept-certificate-based-authentication-technical-deep-dive.md#understanding-the-username-binding-policy))<br>- Portal UI to [configure authentication policies](concept-certificate-based-authentication-technical-deep-dive.md#understanding-the-authentication-binding-policy) to help determine which certificates are single-factor versus multifactor. |
| Easy to deploy and administer |- Microsoft Entra CBA is a free feature, and you don't need any paid editions of Microsoft Entra ID to use it. <br>- No need for complex on-premises deployments or network configuration.<br>- Directly authenticate against Microsoft Entra ID. |
| Secure |- On-premises passwords don't need to be stored in the cloud in any form.<br>- Protects your user accounts by working seamlessly with Microsoft Entra Conditional Access policies, including Phishing-Resistant [multifactor authentication](concept-mfa-howitworks.md) (MFA requires [licensed edition](concept-mfa-licensing.md)) and blocking legacy authentication.<br>- Strong authentication support where users can define authentication policies through the certificate fields, such as issuer or policy OID (object identifiers), to determine which certificates qualify as single-factor versus multifactor.<br>- The feature works seamlessly with [Conditional Access features](../conditional-access/overview.md) and authentication strength capability to enforce MFA to help secure your users. |


## Supported scenarios

The following scenarios are supported:

- User sign-ins to web browser-based applications on all platforms.
- User sign-ins to Office mobile apps on iOS/Android platforms as well as Office native apps in Windows, including Outlook, OneDrive, and so on.
- User sign-ins on mobile native browsers.
- Support for granular authentication rules for multifactor authentication by using the certificate issuer **Subject** and **policy OIDs**.
- Configuring certificate-to-user account bindings by using any of the certificate fields:
  - Subject Alternate Name (SAN) PrincipalName and SAN RFC822Name
  - Subject Key Identifier (SKI) and SHA1PublicKey
- Configuring certificate-to-user account bindings by using any of the user object attributes:
  - User Principal Name
  - onPremisesUserPrincipalName
  - CertificateUserIds

## Unsupported scenarios

The following scenarios aren't supported:

- Certificate Authority hints aren't supported, so the list of certificates that appears for users in the certificate picker UI isn't scoped.
- Only one CRL Distribution Point (CDP) for a trusted CA is supported.
- The CDP can be only HTTP URLs. We don't support Online Certificate Status Protocol (OCSP), or Lightweight Directory Access Protocol (LDAP) URLs.
- Configuring other certificate-to-user account bindings, such as using the **Subject**, **Subject + Issuer** or **Issuer + Serial Number**, aren’t available in this release.
- Password as an authentication method cannot be disabled and the option to sign in using a password is displayed even with Microsoft Entra CBA method available to the user.

## Known Limitation with Windows Hello For Business certificates

- While Windows Hello For Business (WHFB) can be used for multi-factor authentication in Microsoft Entra ID, WHFB is not supported for fresh MFA. Customers may choose to enroll certificates for your users using the WHFB key pair.  When properly configured, these WHFB certificates can be used for multi-factor authentication in Microsoft Entra ID. WHFB certificates are compatible with Microsoft Entra certificate-based authentication (CBA) in Edge and Chrome browsers; however, at this time WHFB certificates are not compatible with Microsoft Entra CBA in non-browser scenarios (e.g. Office 365 applications). The workaround is to use the "Sign in Windows Hello or security key" option to sign in (when available) as this option does not use certificates for authentication and avoids the issue with Microsoft Entra CBA; however, this option may not be available in some older applications.

## Out of Scope

The following scenarios are out of scope for Microsoft Entra CBA:

- Public Key Infrastructure for creating client certificates. Customers need to configure their own Public Key Infrastructure (PKI) and provision certificates to their users and devices. 

## Next steps

- [Technical deep dive for Microsoft Entra CBA](concept-certificate-based-authentication-technical-deep-dive.md)
- [How to configure Microsoft Entra CBA](how-to-certificate-based-authentication.md)
- [Microsoft Entra CBA on iOS devices](concept-certificate-based-authentication-mobile-ios.md)
- [Microsoft Entra CBA on Android devices](concept-certificate-based-authentication-mobile-android.md)
- [Windows smart card logon using Microsoft Entra CBA](concept-certificate-based-authentication-smartcard.md)
- [Certificate user IDs](concept-certificate-based-authentication-certificateuserids.md)
- [How to migrate federated users](concept-certificate-based-authentication-migration.md)
- [FAQ](certificate-based-authentication-faq.yml)
