---
title: Prerequisites for Datadog on Azure
description: This article describes how to configure your Azure environment to create an instance of Datadog.



ms.topic: conceptual
ms.date: 12/05/2024
---

# Configure environment before Datadog deployment

This article describes how to set up your environment before deploying your first instance of Datadog. These conditions are prerequisites for completing the quickstarts.

## Access control

To set up the Datadog, you must have **Owner** access on the Azure subscription. [Confirm that you have the appropriate access](../../role-based-access-control/check-access.md) before starting the setup.

## Add enterprise application

To use the Security Assertion Markup Language (SAML) single sign-on (SSO) feature within the Datadog resource, you must set up an enterprise application. To add an enterprise application, you need one of these roles: Cloud Application Administrator, Application Administrator, or owner of the service principal.

Use the following steps to set up the enterprise application:

1. Go to [Azure portal](https://portal.azure.com). Select **Microsoft Entra ID**.
1. In the left pane, select **Enterprise applications**.
1. Select **New Application**.
1. In **Add from the gallery**, search for *Datadog*. Select the search result then select **Add**.

1. Once the app is created, go to properties from the side panel. Set **User assignment required?** to **No**, and select **Save**.

1. Go to **Single sign-on** from the side panel. Then select **SAML**.

1. Select **Yes** when prompted to **Save single sign-on settings**.

The setup of single sign-on is now complete.

## Next steps

- To create an instance of Datadog, see [QuickStart: Get started with Datadog](create.md).
- Get started with Datadog on

   > [!div class="nextstepaction"]
   > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Datadog%2Fmonitors)

   > [!div class="nextstepaction"]
   > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/datadog1591740804488.dd_liftr_v2?tab=Overview)
