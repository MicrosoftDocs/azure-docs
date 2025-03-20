---
title: Set up the API Center portal
description: How to set up the API Center portal, a managed website that enables discovery of the API inventory in your Azure API center.
author: dlepow
ms.service: azure-api-center
ms.topic: how-to
ms.date: 03/04/2025
ms.author: danlep 
ms.custom: 
# Customer intent: As an API program manager, I want to enable an Azure-managed portal for developers and other API stakeholders in my organization to discover the APIs in my organization's API center.
---

# Set up your API Center portal

This article shows you how to set up the *API Center portal* (preview), an Azure-managed website that developers and other stakeholders in your organization can use to discover the APIs in your [API center](overview.md). Signed-in users can browse and filter APIs and view API details such as API definitions and documentation. User access to API information is based on Microsoft Entra ID and Azure role-based access control.

:::image type="content" source="media/self-host-api-center-portal/api-center-portal-signed-in.png" alt-text="Screenshot of the API Center portal after user sign-in.":::

> [!NOTE]
> The API Center portal is currently in preview.

> [!TIP]
> Both Azure API Management and Azure API Center provide API portal experiences for developers. [Compare the portals](#api-management-and-api-center-portals)

[!INCLUDE [api-center-portal-prerequisites](includes/api-center-portal-prerequisites.md)]

[!INCLUDE [api-center-portal-app-registration](includes/api-center-portal-app-registration.md)]

## Configure and publish the API Center portal

After you create the API Center portal app registration, you need to configure and publish the API center portal. Complete the following steps in the Azure portal. 

1. In the [Azure portal](https://portal.azure.com), navigate to your API center.
1. In the left menu, under **API Center portal**, select **Portal settings**.
    :::image type="content" source="media/set-up-api-center-portal/configure-portal-settings.png" alt-text="Screenshot of API Center portal settings in the Azure portal." lightbox="media/set-up-api-center-portal/configure-portal-settings.png":::
1. On the **Identity provider** tab, select **Start set up**. On the screen that appears, do the following:
    1. In **Client ID**, enter the **Application (client) ID** from the app registration you created in the previous section.
    1. Confirm that the **Redirect URI** is the value you configured in the app registration. 
    1. Select **Save + publish**.
1. On the **Site profile** tab, enter a website name that you want to appear in the top bar of the API Center portal. Select **Save + publish**.
1. On the **API visibility** tab, optionally add filters for APIs that you want to make discoverable in the portal. Select **Save + publish**. [Learn more about API visibility](#api-visibility)

You can now access the API Center portal:
* On the **Portal settings** page, select **View API Center portal** to open the portal in a new tab. 
* Or, enter the following URL in your browser, replacing `<service-name>` and `<location>` with the name of your API center and the location where it's deployed:<br/>
    `https://<service-name>.portal.<location>.azure-api-center.ms`

### API visibility

API visibility settings control which APIs are discoverable (visible) to API Center portal users. The API Center portal uses the data plane API to retrieve and display APIs, and by default retrieves all APIs in your API center.

To make only specific APIs visible, go to the **API visibility** tab in the API Center portal settings. Here, add filter conditions for APIs based on built-in or custom API [metadata](metadata.md) properties. For instance, you can choose to display APIs only of certain types (like REST or GraphQL) or based on certain specification formats (such as OpenAPI). Additionally, you can select values of custom metadata properties that categorize your APIs.

:::image type="content" source="media/set-up-api-center-portal/add-visibility-condition.png" alt-text="Screenshot of adding API visibility conditions in the portal.":::

[!INCLUDE [api-center-portal-user-sign-in](includes/api-center-portal-user-sign-in.md)]

[!INCLUDE [api-center-portal-compare-apim-dev-portal](includes/api-center-portal-compare-apim-dev-portal.md)]


## Related content

* [Enable and view Azure API Center portal in Visual Studio Code](enable-api-center-portal-vscode-extension.md)