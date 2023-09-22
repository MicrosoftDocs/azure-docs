---
title: Single sign-on for Azure integration with Logz.io
description: Learn about how to set up single sign-on for Azure integration with Logz.io.
ms.topic: conceptual
ms.date: 10/25/2021
author: flang-msft
ms.author: franlanglois
---

# Set up Logz.io single sign-on

This article describes how to set up single sign-on (SSO) in Azure Active Directory. SSO for Logz.io integration is optional.

## Configure single sign-on

To use the Security Assertion Markup Language (SAML) SSO feature within the Logz.io resource, you must set up an enterprise application.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. From the portal menu, select **Azure Active Directory** or search for _Azure Active Directory_.
1. Go to **Manage** > **Enterprise Applications** and select the **New Application** button.
1. Search for _Logz.io_ and select SAML application named **Logz.io - Azure AD Integration** and then select **Create**.

   :::image type="content" source="./media/sso-setup/gallery.png" alt-text="Browse Azure Active Directory gallery.":::

1. From the **Overview**, copy the **Application ID** of the SSO application.

   Make note of the _Application ID_ because you'll use it in a later step to configure SAML.

   :::image type="content" source="./media/sso-setup/app-id.png" alt-text="Copy the Application ID.":::

1. Select the tile named **2. Set up single sign on**.

   :::image type="content" source="./media/sso-setup/setup.png" alt-text="Set up single sign-on.":::

1. Select the **SAML** protocol as the single sign-on method.

   :::image type="content" source="./media/sso-setup/saml.png" alt-text="SAML single sign-on.":::

1. In the SAML configuration, select existing values or use the text boxes to enter the required fields **Identifier** and **Reply URL**. To create new entries, use the _Application ID_ that was copied in an earlier step.

   Use the following patterns to add new values:

   - **Identifier**: `urn:auth0:logzio:<Application ID>`
   - **Reply URL**: `https://logzio.auth0.com/login/callback?connection=<Application ID>`

   :::image type="content" source="./media/sso-setup/saml-config.png" alt-text="Basic SAML configuration.":::

1. From the **Save single sign-on settings** prompt, select **Yes** then select **Save**.

   For the SSO prompt, select **No, I'll test later**.

1. After the SAML configuration is saved, go to **Manage** > **Properties** and set the **User assignment required?** to **No**. Select **Save**.

   :::image type="content" source="./media/sso-setup/properties.png" alt-text="Single sign-on properties.":::

## Next steps

- To resolve problems with SSO, see [Troubleshooting](troubleshoot.md).
- To create a Logz.io integration, see [Quickstart: Create a Logz.io resource in Azure portal](create.md).
