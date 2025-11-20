---
title: Configure Pre-Deployment for Azure Native Dynatrace Service
description: Learn how to complete the prerequisites for Dynatrace in the Azure portal. 
ms.topic: concept-article
ms.date: 09/15/2025

---

# Configure pre-deployment

This article describes the prerequisites that you must complete in your Azure subscription or in Microsoft Entra ID before you create your first Dynatrace resource in Azure.

## Access control

To set up Dynatrace for Azure, you must have **Owner** or **Contributor** access on the Azure subscription. [Confirm that you have the appropriate access](../../role-based-access-control/check-access.md) before you start setup.

## Add an enterprise application

To use the SAML-based single sign-on (SSO) feature in the Dynatrace resource, you must set up an enterprise application. To add an enterprise application, you need either a Cloud Application Administrator or Application Administrator role.

1. Go to the Azure portal. Search for **Entra ID** and then select **Microsoft Entra ID**. In Entra ID, in the left pane, select  **Enterprise App** under **Manage**. Select **New Application**.

1. Under **Browse Microsoft Entra Gallery**, enter **Dynatrace** in the search box. Select **Dynatrace** in the search results, and then select **Create**.

    :::image type="content" source="media/dynatrace-how-to-configure-prereqs/dynatrace-gallery.png" alt-text="Screenshot of the Dynatrace service in the Microsoft Entra gallery." lightbox="media/dynatrace-how-to-configure-prereqs/dynatrace-gallery.png":::

1. After the app is created, select **Properties** under **Manage** in the left pane, set **Assignment required?** to **No**, and then select **Save**.

    :::image type="content" source="media/dynatrace-how-to-configure-prereqs/dynatrace-properties.png" alt-text="Screenshot of the Dynatrace service properties page." lightbox="media/dynatrace-how-to-configure-prereqs/dynatrace-properties.png":::

1. In the left pane, under **Manage**, select **Single sign-on**. Then select **SAML**.

    :::image type="content" source="media/dynatrace-how-to-configure-prereqs/dynatrace-single-sign-on.png" alt-text="Screenshot of the Dynatrace single sign-on settings." lightbox="media/dynatrace-how-to-configure-prereqs/dynatrace-single-sign-on.png":::

1. Select **Yes** when prompted to **Save single sign-on setting**.

   :::image type="content" source="media/dynatrace-how-to-configure-prereqs/dynatrace-saml-sign-on.png" alt-text="Screenshot of the confirmation prompt." lightbox="media/dynatrace-how-to-configure-prereqs/dynatrace-saml-sign-on.png":::

## Next step

> [!div class="nextstepaction"]
> [Quickstart: Create a new Dynatrace resource](dynatrace-create.md)

    
