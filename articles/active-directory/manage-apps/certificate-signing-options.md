---
title: Advanced certificate signing options in a SAML token
description: Learn how to use advanced certificate signing options in the SAML token for preintegrated apps in Microsoft Entra ID
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: conceptual
ms.date: 07/18/2023
ms.author: jomondi
ms.reviewer: saumadan
ms.custom: aaddev, enterprise-apps
ms.collection: M365-identity-device-management
---

# Advanced certificate signing options in a SAML token

Today Microsoft Entra ID supports thousands of preintegrated applications in the Microsoft Entra App Gallery. Over 500 of the applications support single sign-on by using the [Security Assertion Markup Language](https://wikipedia.org/wiki/Security_Assertion_Markup_Language) (SAML) 2.0 protocol, such as the [NetSuite](https://azuremarketplace.microsoft.com/marketplace/apps/aad.netsuite) application. When a customer authenticates to an application through Microsoft Entra ID by using SAML, Microsoft Entra ID sends a token to the application (via an HTTP POST). The application then validates and uses the token to sign in the customer instead of prompting for a username and password. These SAML tokens are signed with the unique certificate that's generated in Microsoft Entra ID and by specific standard algorithms.

Microsoft Entra ID uses some of the default settings for the gallery applications. The default values are set up based on the application's requirements.

In Microsoft Entra ID, you can set up certificate signing options and the certificate signing algorithm.

## Certificate signing options

Microsoft Entra ID supports three certificate signing options:

* **Sign SAML assertion**. This default option is set for most of the gallery applications. If you select this option, Microsoft Entra ID as an Identity Provider (IdP) signs the SAML assertion and certificate with the [X.509](https://wikipedia.org/wiki/X.509) certificate of the application.

* **Sign SAML response**. If you select this option, Microsoft Entra ID as an IdP signs the SAML response with the X.509 certificate of the application.

* **Sign SAML response and assertion**. If you select this option, Microsoft Entra ID as an IdP signs the entire SAML token with the X.509 certificate of the application.

## Certificate signing algorithms

Microsoft Entra ID supports two signing algorithms, or secure hash algorithms (SHAs), to sign the SAML response:

* **SHA-256**. Microsoft Entra ID uses this default algorithm to sign the SAML response. It's the newest algorithm and is more secure than SHA-1. Most of the applications support the SHA-256 algorithm. If an application supports only SHA-1 as the signing algorithm, you can change it. Otherwise, we recommend that you use the SHA-256 algorithm for signing the SAML response.

* **SHA-1**. This algorithm is older, and it's treated as less secure than SHA-256. If an application supports only this signing algorithm, you can select this option in the **Signing Algorithm** drop-down list. Microsoft Entra ID then signs the SAML response with the SHA-1 algorithm.

## Prerequisites

To change an application's SAML certificate signing options and the certificate signing algorithm, you need:

- A Microsoft Entra user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.

[!INCLUDE [portal updates](../includes/portal-update.md)]

## Change certificate signing options and signing algorithm

To change an application's SAML certificate signing options and the certificate signing algorithm:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator). 
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **All applications**.
1. Enter the name of the existing application in the search box, and then select the application from the search results. In this example, you use the Salesforce application.

   ![Example: Application overview page](./media/certificate-signing-options/application-overview-page.png)

Next, change the certificate signing options in the SAML token for that application:

1. In the left pane of the application overview page, select **Single sign-on**.
1. If the **Set up Single Sign-On with SAML** page appears, go to step 5.
1. If the **Set up Single Sign-On with SAML** page doesn't appear, select **Change single sign-on modes**.
1. In the **Select a single sign-on method** page, select **SAML**. If **SAML** isn't available, the application doesn't support SAML, and you may ignore the rest of this procedure and article.
1. In the **Set up Single Sign-On with SAML** page, find the **SAML Signing Certificate** heading and select the **Edit** icon (a pencil). The **SAML Signing Certificate** page appears.

   ![Example: SAML signing certificate page](./media/certificate-signing-options/saml-signing-page.png)

1. In the **Signing Option** drop-down list, choose **Sign SAML response**, **Sign SAML assertion**, or **Sign SAML response and assertion**. Descriptions of these options appear earlier in this article in the [Certificate signing options](#certificate-signing-options).
1. In the **Signing Algorithm** drop-down list, choose **SHA-1** or **SHA-256**. Descriptions of these options appear earlier in this article in the [Certificate signing algorithms](#certificate-signing-algorithms) section.
1. If you're satisfied with your choices, select **Save** to apply the new SAML signing certificate settings. Otherwise, select the **X** to discard the changes.

## Next steps

- [Configure single sign-on to applications that are not in the Microsoft Entra App Gallery](../develop/single-sign-on-saml-protocol.md)
- [Troubleshoot SAML-based single sign-on](./debug-saml-sso-issues.md)
