---
title: Configure pre-deploment Dynatrace integration with Azure - Azure partner solutions
description: This article describes how to complete the prerequistes for Dynatrace on the Azure portal. 
ms.topic: conceptual
ms.service: partner-services
author: flang-msft
ms.author: franlanglois
ms.date: 05/12/2022

---

# Configure pre-deployment

This article describes the pre-requisites that must be completed before you create the first instance of Dynatrace resource in Azure.

## Access control

To setup the Azure Dynatrace integration, you must have **owner** or **contributor** access on the Azure subscription. [Confirm that you have the appropriate access](/azure/role-based-access-control/check-access) before starting the setup.

## Add enterprise application

To use the Security Assertion Markup Language (SAML) based single sign-on (SSO) feature within the Dynatrace resource, you must setup an enterprise application. To add an enterprise application, you need one of these roles: Global administrator, Cloud Application Administrator, or Application Administrator.

1. Go to Azure Portal. Select **Azure Active Directory,** then **Enterprise App** and then **New Application**.

2. Under **Add from the gallery**, type in `Dynatrace`. Select the search result then click **Add**.

    :::image type="content" source="media/dynatrace-how-to-configure-prereqs/dynatrace-gallery.png" alt-text="Screenshot of the Dynatrace service in the Marketplace gallery.":::

3. Once the app is created, go to properties from the side panel, and set the **User assignment required?** to **No**, then select Save.

    :::image type="content" source="media/dynatrace-how-to-configure-prereqs/dynatrace-properties.png" alt-text="Screenshot of the Dynatrace service properties.":::

4. Go to **Single sign-on** from the side panel. Then select **SAML**.
    :::image type="content" source="media/dynatrace-how-to-configure-prereqs/dynatrace-saml-sign-on.png" alt-text="Screenshot of the Dynatrace S A M L settings.":::

5. Select **Yes** when prompted to **Save single sign-on settings**.

    :::image type="content" source="media/dynatrace-how-to-configure-prereqs/dynatrace-single-sign-on.png" alt-text="Screenshot of the Dynatrace single sign-on settings.":::

## Next steps

- [Quickstart: Create a new Dynatrace environment.](dynatrace-create.md)
