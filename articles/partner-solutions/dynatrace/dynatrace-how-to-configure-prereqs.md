---
title: Configure pre-deployment to use Dynatrace with Azure - Azure partner solutions
description: This article describes how to complete the prerequisites for Dynatrace on the Azure portal. 
ms.topic: conceptual
author: flang-msft
ms.author: franlanglois
ms.date: 10/12/2022

---

# Configure pre-deployment

This article describes the prerequisites that must be completed in your Azure subscription or Azure Active Directory before you create your first Dynatrace resource in Azure.

## Access control

To set up Dynatrace for Azure, you must have **Owner** or **Contributor** access on the Azure subscription. First, [confirm that you have the appropriate access](/azure/role-based-access-control/check-access) before starting the setup.

## Add enterprise application

To use the Security Assertion Markup Language (SAML) based single sign-on (SSO) feature within the Dynatrace resource, you must set up an enterprise application. To add an enterprise application, you need one of these roles: Global administrator, Cloud Application Administrator, or Application Administrator.

1. Go to Azure portal. Select **Azure Active Directory,** then **Enterprise App** and then **New Application**.

1. Under **Add from the gallery**, type in `Dynatrace`. Select the search result then select **Create**.

    :::image type="content" source="media/dynatrace-how-to-configure-prereqs/dynatrace-gallery.png" alt-text="Screenshot of the Dynatrace service in the Marketplace gallery.":::

1. Once the app is created, go to properties from the side panel, and set the **User assignment required?** to **No**, then select **Save**.

    :::image type="content" source="media/dynatrace-how-to-configure-prereqs/dynatrace-properties.png" alt-text="Screenshot of the Dynatrace service properties.":::

1. Go to **Single sign-on** from the side panel. Then select **SAML**.

    :::image type="content" source="media/dynatrace-how-to-configure-prereqs/dynatrace-single-sign-on.png" alt-text="Screenshot of the Dynatrace single sign-on settings.":::

1. Select **Yes** when prompted to **Save single sign-on settings**.

   :::image type="content" source="media/dynatrace-how-to-configure-prereqs/dynatrace-saml-sign-on.png" alt-text="Screenshot of the Dynatrace S A M L settings.":::

## Next steps

- [Quickstart: Create a new Dynatrace environment](dynatrace-create.md)
