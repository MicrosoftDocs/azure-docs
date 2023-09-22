---
title: Troubleshoot SAML-based single sign-on
description: Troubleshoot issues with a Microsoft Entra app that's configured for SAML-based single sign-on.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: troubleshooting
ms.date: 09/07/2023
ms.author: jomondi
ms.reviewer: alamaral
ms.custom: enterprise-apps
---

# Troubleshoot SAML-based single sign-on

If you encounter a problem when configuring an application, verify you have followed all the steps in the tutorial for the application. In the application’s configuration, you have inline documentation on how to configure the application. Also, you can access the [List of tutorials on how to integrate SaaS apps with Microsoft Entra ID](../saas-apps/tutorial-list.md) for a detail step-by-step guidance.

[!INCLUDE [portal updates](../includes/portal-update.md)]

## Can’t add another instance of the application

To add a second instance of an application, you need to be able to:

- Configure a unique identifier for the second instance. You won’t be able to configure the same identifier used for the first instance.
- Configure a different certificate than the one used for the first instance.

If the application doesn’t support any of the above. Then, you won’t be able to configure a second instance.

## Can’t add the Identifier or the Reply URL

If you’re not able to configure the Identifier or the Reply URL, confirm the Identifier and Reply URL values match the patterns pre-configured for the application.

To know the patterns pre-configured for the application:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator). Go to step 4. If you are already in the application configuration blade in Microsoft Entra ID.
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **All applications**.
1. Select the application you want to configure single sign-on.
1. Once the application loads, select the **Single sign-on** from the application’s left-hand navigation menu.
1. Select **SAML-based Sign-on** from the **Mode** dropdown.
1. Go to the **Identifier** or **Reply URL** textbox, under the **Domain and URLs section.**
1. There are three ways to know the supported patterns for the application:
    - In the textbox, you see the supported pattern(s) as a placeholder, for example: `https://contoso.com`.
    - if the pattern is not supported, you see a red exclamation mark when you try to enter the value in the textbox. If you hover your mouse over the red exclamation mark, you see the supported patterns.
    - In the tutorial for the application, you can also get information about the supported patterns. Under the **Configure Microsoft Entra single sign-on** section. Go to the step for configured the values under the **Domain and URLs** section.

If the values don’t match with the patterns pre-configured in Microsoft Entra ID. You can:

- Work with the application vendor to get values that match the pattern pre-configured in Microsoft Entra ID
- Or, you can contact Microsoft Entra team at <aadapprequest@microsoft.com> or leave a comment in the tutorial to request the update of the supported patterns for the application

## Where do I set the EntityID (User Identifier) format

You won’t be able to select the EntityID (User Identifier) format that Microsoft Entra ID sends to the application in the response after user authentication.

Microsoft Entra ID select the format for the NameID attribute (User Identifier) based on the value selected or the format requested by the application in the SAML AuthRequest. For more information visit the article [Single Sign-On SAML protocol](../develop/single-sign-on-saml-protocol.md#authnrequest) under the section NameIDPolicy,

<a name='cant-find-the-azure-ad-metadata-to-complete-the-configuration-with-the-application'></a>

## Can’t find the Microsoft Entra metadata to complete the configuration with the application

To download the application metadata or certificate from Microsoft Entra ID, follow these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator). 
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **All applications**.
1. Select the application you have configured single sign-on.
1. Once the application loads, click the **Single sign-on** from the application’s left-hand navigation menu.
1. Go to **SAML Signing Certificate** section, then click **Download** column value. Depending on what the application requires configuring single sign-on, you see either the option to download the Metadata XML or the Certificate.

Microsoft Entra doesn’t provide a URL to get the metadata. The metadata can only be retrieved as a XML file.

## Customize SAML claims sent to an application

To learn how to customize the SAML attribute claims sent to your application, see [Claims mapping in Microsoft Entra ID](../develop/saml-claims-customization.md) for more information.

## Next steps

- [Quickstart Series on Application Management](view-applications-portal.md)
