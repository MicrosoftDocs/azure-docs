---
title: Set Up the API Center Portal
description: How to set up the API Center portal, a managed website that enables discovery of the API inventory in your Azure API center.

ms.service: azure-api-center
ms.topic: how-to
ms.date: 02/25/2026
ms.update-cycle: 180-days
 
ms.custom: 
ms.collection: 
# Customer intent: As an API program manager, I want to enable an Azure-managed portal for developers and other API stakeholders in my organization to discover the APIs in my organization's API center.
---

# Set up and customize your API Center portal

This article shows you how to set up and customize the *API Center portal* (preview), an Azure-managed website for discovering APIs, MCP servers, and related assets in your [API center](overview.md). 

The API Center portal supports and streamlines the work of developers who use and create APIs within your organization. Users with access can:

* **Search for APIs** by name or use AI-assisted semantic search.
* **Filter APIs** by type or lifecycle stage.
* **View API details and definitions** including endpoints, methods, parameters, and response formats.
* **Download API definitions** to their computer or open in Visual Studio Code.
* **Try out APIs** with API key or OAuth 2.0 authentication.

:::image type="content" source="media/self-host-api-center-portal/api-center-portal-signed-in.png" alt-text="Screenshot of the API Center portal after user sign-in.":::

> [!NOTE]
> The API Center portal is currently in preview.

> [!TIP]
> Both Azure API Management and Azure API Center provide API portal experiences for developers. [Compare the portals](#api-management-and-api-center-portals).

[!INCLUDE [api-center-portal-prerequisites](includes/api-center-portal-prerequisites.md)]

## Configure access to the API Center portal

First, choose how you want users to access the API Center portal. You can set up Microsoft Entra ID as an identity provider or allow anonymous access.

### Option 1: Configure Microsoft Entra ID authentication for the portal (recommended)

[!INCLUDE [api-center-portal-app-registration](includes/api-center-portal-app-registration.md)]

### Option 2: Allow anonymous access to the portal

To enable anonymous access, follow these steps.

> [!CAUTION]
> If you configure anonymous access, anyone can view the APIs in your API center without signing in. Don't expose sensitive information in API definitions or settings.

1. In the [Azure portal](https://portal.azure.com), go to your API center.
1. In the sidebar menu, select **API Center portal** > **Settings**.
1. On the **Access** tab, select **Allow anonymous access**.

    :::image type="content" source="media/set-up-api-center-portal/configure-access-anonymous.png" alt-text="Screenshot showing configuration of anonymous access in the portal.":::
1. To configure access, select **Confirm and Enable**.

<a id="access-the-portal"></a> 
## View the portal

After configuring access, open the API Center portal by selecting **View API Center portal** on the **Settings** page, or visit:<br/>
`https://<service-name>.portal.<location>.azure-apicenter.ms`

(Replace `<service-name>` and `<location>` with your API center name and deployment location.)

By default, the portal home page is publicly reachable. If Microsoft Entra ID is configured for access, users must select **Sign-in** to access APIs. See [Enable sign-in to portal by Microsoft Entra users and groups](#enable-sign-in) for details on configuring user access.

<a id="enable-sign-in"></a>
## Enable sign-in to portal by Microsoft Entra users and groups 

[!INCLUDE [api-center-portal-user-sign-in](includes/api-center-portal-user-sign-in.md)]

## Customize the API Center portal

The following sections show you how to customize the API Center portal experience for users. For more extensive customization, you can also choose to [self-host the API Center portal](self-host-api-center-portal.md).

> [!IMPORTANT]
> Select **Save + publish** after making changes. Changes aren't visible until published.
> :::image type="content" source="media/set-up-api-center-portal/save-and-publish.png" alt-text="Screenshot of Save + Publish button in the Azure portal.":::

### Site profile

On the **Site profile** tab of the API Center portal settings, optionally provide a custom name to appear in the top bar of the portal.

:::image type="content" source="media/set-up-api-center-portal/custom-name.png" alt-text="Screenshot of custom name in API Center portal.":::

### API visibility

On the **Visibility** tab, control which APIs are discoverable (visible) to API Center portal users. Visibility settings apply to all users of the API Center portal.

> [!NOTE]
> The API Center portal uses the [Azure API Center data plane API](/rest/api/dataplane/apicenter/operation-groups) to retrieve and display APIs in your API center. By default, it makes all APIs visible to users with access. 
> 

To make only specific APIs visible, add filter conditions for APIs based on built-in properties. For example, display APIs only of certain types, like REST or GraphQL, or based on certain specification formats, such as OpenAPI.

:::image type="content" source="media/set-up-api-center-portal/add-visibility-condition.png" alt-text="Screenshot of adding API visibility conditions in the portal.":::

### Semantic search

If you enable semantic search on the **Semantic search** tab, the API Center portal supplements basic name-based API search with AI-assisted *semantic search* built on API names, descriptions, and optionally custom metadata. Semantic search is available in the **Standard** plan only.

Users can search for APIs by using natural language queries to find APIs based on their intent. For example, if a developer searches for "I need an API for inventory management," the portal can suggest relevant APIs, even if the API names or descriptions don't include those exact words.

> [!TIP]
> If you use the **Free** plan of Azure API Center, you can [upgrade](frequently-asked-questions.yml#how-do-i-upgrade-my-api-center-from-the-free-plan-to-the-standard-plan) to the **Standard** plan to enable full service features including semantic search in the API Center portal.

To use AI-assisted search when signed in to the API Center portal, select the search box, choose **Search with AI**, and enter a query.

:::image type="content" source="media/set-up-api-center-portal/semantic-search.png" alt-text="Screenshot of semantic search results in API Center portal.":::

### Custom metadata

On the **Metadata** tab, optionally select [custom metadata](metadata.md) properties that you want to expose in API details and semantic search.

## Enable access to test console for APIs

You can configure user settings to granularly authorize access to APIs and specific versions in your API center. For example, configure certain API versions to use API keys for authentication, and create an access policy that permits specific users to authenticate by using those keys. 

Access policies also apply to the "Try this API" capability for APIs in the API Center portal, ensuring that only portal users with the appropriate access policy can use the test console for those API versions. [Learn more about authorizing access to APIs](authorize-api-access.md).

[!INCLUDE [api-center-portal-compare-apim-dev-portal](includes/api-center-portal-compare-apim-dev-portal.md)]

## Related content

* [Enable and view Azure API Center portal in Visual Studio Code](enable-api-center-portal-vs-code-extension.md)
* [Self-host the API Center portal](self-host-api-center-portal.md)