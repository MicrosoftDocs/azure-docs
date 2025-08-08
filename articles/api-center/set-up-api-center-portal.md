---
title: Set Up the API Center Portal
description: How to set up the API Center portal, a managed website that enables discovery of the API inventory in your Azure API center.
author: dlepow
ms.service: azure-api-center
ms.topic: how-to
ms.date: 08/05/2025
ms.update-cycle: 180-days
ms.author: danlep 
ms.custom: 
ms.collection: 
# Customer intent: As an API program manager, I want to enable an Azure-managed portal for developers and other API stakeholders in my organization to discover the APIs in my organization's API center.
---

# Set up your API Center portal

This article shows you how to set up the *API Center portal* (preview), an Azure-managed website that developers and other stakeholders in your organization use to discover the APIs in your [API center](overview.md). Signed-in users can browse and filter APIs and view API details such as API definitions and documentation. User access to API information is based on Microsoft Entra ID and Azure role-based access control.

:::image type="content" source="media/self-host-api-center-portal/api-center-portal-signed-in.png" alt-text="Screenshot of the API Center portal after user sign-in.":::

> [!NOTE]
> The API Center portal is currently in preview.

> [!TIP]
> Both Azure API Management and Azure API Center provide API portal experiences for developers. [Compare the portals](#api-management-and-api-center-portals)


[!INCLUDE [api-center-portal-prerequisites](includes/api-center-portal-prerequisites.md)]

## Create Microsoft Entra app registration

[!INCLUDE [api-center-portal-app-registration](includes/api-center-portal-app-registration.md)]

## Configure and publish the API Center portal

After creating the API Center portal app registration, you can [customize settings](customize-api-center-portal.md) and publish your API Center portal. Complete the following steps in the Azure portal.

1. In the [Azure portal](https://portal.azure.com), navigate to your API center.
1. In the left menu, under **API Center portal**, select **Settings**.

    :::image type="content" source="media/set-up-api-center-portal/configure-portal-settings.png" alt-text="Screenshot of API Center portal settings in the Azure portal." lightbox="media/set-up-api-center-portal/configure-portal-settings.png":::

1. If you set up an app registration manually, on the **Identity provider** tab, select **Start set up**. If you used the quick setup, this step is already complete, and you can continue to settings on other tabs.
    1. On the **Manual** tab, in **Client ID**, enter the **Application (client) ID** from the app registration you created in the previous section.
    1. Confirm that the **Redirect URI** is the value you configured in the app registration. 
    1. Select **Save + publish**.
1. On the remaining tabs, optionally customize the settings for your API Center portal. For information on the settings, see [Customize your API Center portal](customize-api-center-portal.md). 
1. Select **Save + publish**.

## Access the portal

After publishing, you can access the API Center portal in your browser.

* On the portal's **Settings** page, select **View API Center portal** to open the portal in a new tab. 
* Or, enter the following URL in your browser, replacing `<service-name>` and `<location>` with the name of your API center and the location where it's deployed:<br/>
    `https://<service-name>.portal.<location>.azure-apicenter.ms`

By default, the portal home page is reachable publicly but requires sign-in to access APIs. See [Enable sign-in to portal by Microsoft Entra users and groups](#enable-sign-in-to-portal-by-microsoft-entra-users-and-groups) for details on how to configure user access to the portal.

## Enable sign-in to portal by Microsoft Entra users and groups 

[!INCLUDE [api-center-portal-user-sign-in](includes/api-center-portal-user-sign-in.md)]


## API discovery and consumption in the API Center portal

The API Center portal supports and streamlines the work of developers who use and create APIs within your organization. Signed-in users can:

* **Search for APIs** by name or using [AI-assisted semantic search](customize-api-center-portal.md#semantic-search)

* **Filter APIs** by type or lifecycle stage

* **View API details and definitions** including endpoints, methods, parameters, and response formats

* **Download API definitions** to a local computer or open them in Visual Studio Code

* **Try out APIs** that support API key authentication or OAuth 2.0 authorization

[!INCLUDE [api-center-portal-compare-apim-dev-portal](includes/api-center-portal-compare-apim-dev-portal.md)]

## Related content

* [Customize your API Center portal](customize-api-center-portal.md)
* [Enable and view Azure API Center portal in Visual Studio Code](enable-api-center-portal-vs-code-extension.md)
* [Self-host the API Center portal](self-host-api-center-portal.md)
