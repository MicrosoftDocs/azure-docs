---
title: Customize the API Center Portal
description: Learn about settings you can customize in your Azure API Center portal.

ms.service: azure-api-center
ms.topic: how-to
ms.date: 08/07/2025
ms.update-cycle: 180-days
 
ms.custom: 
ms.collection: ce-skilling-ai-copilot
# Customer intent: As an API program manager, I want to customize the Azure-managed portal for developers and other API stakeholders in my organization.
---

# Customize your API Center portal

This article explains settings that you can customize in the API Center portal (preview). The API Center portal is an Azure-managed website that developers and other stakeholders in your organization use to discover the APIs in your [API center](overview.md). 

To set up the API Center portal for initial use and sign-in, see [Set up the API Center portal](set-up-api-center-portal.md).

> [!NOTE]
> The API Center portal is currently in preview.

## Portal settings page

Configure API Center portal settings in the Azure portal. To access the settings page:

1. Navigate to your API center in the Azure portal.
1. Under **API Center portal**, select **Settings**. 
1. Click on the tabs to view and customize the settings.
1. Select **Save + publish** to apply your changes.

:::image type="content" source="media/customize-api-center-portal/configure-portal-settings.png" alt-text="Screenshot of API Center portal settings in the Azure portal." lightbox="media/customize-api-center-portal/configure-portal-settings.png":::

> [!IMPORTANT]
> Select **Save + publish** each time that you make changes to the settings. Until you publish, your changes aren't visible in the API Center portal.

## Site profile

On the **Site profile** tab, optionally provide a custom name that appears in the top bar of the published portal.

:::image type="content" source="media/customize-api-center-portal/custom-name.png" alt-text="Screenshot of custom name in API Center portal.":::

## API visibility

On the **API visibility** tab, control which APIs are discoverable (visible) to API Center portal users. Visibility settings apply to all users of the API Center portal.

The API Center portal uses the [Azure API Center data plane API](/rest/api/dataplane/apicenter/operation-groups) to retrieve and display APIs in your API center, and by default shows all APIs for signed-in users with Azure RBAC permissions. 

To make only specific APIs visible, add filter conditions for APIs based on built-in properties. For instance, choose to display APIs only of certain types (like REST or GraphQL) or based on certain specification formats (such as OpenAPI).

:::image type="content" source="media/customize-api-center-portal/add-visibility-condition.png" alt-text="Screenshot of adding API visibility conditions in the portal.":::

## Anonymous access

On the **API visibility** tab, optionally enable anonymous read access to the [Azure API Center data plane API](/rest/api/dataplane/apicenter/operation-groups), which allows unauthenticated users to discover the API inventory by direct API calls. For example, enable this setting to make APIs discoverable to unauthenticated users when you [self-host](self-host-api-center-portal.md) the API Center portal.

> [!CAUTION]
> When enabling anonymous access, take care not to expose sensitive information in API definitions or settings.

## Semantic search

If enabled on the **Semantic search** tab, the API Center portal supplements basic name-based API search with AI-assisted *semantic search* built on API names, descriptions, and optionally custom metadata. Semantic search is available in the **Standard** plan only.

Users can search for APIs using natural language queries, making it easier to find APIs based on their intent. For example, if a developer searches for "I need an API for inventory management," the portal can suggest relevant APIs, even if the API names or descriptions don't include those exact words.

> [!TIP]
> When using the **Free** plan of Azure API Center, you can [upgrade easily](frequently-asked-questions.yml#how-do-i-upgrade-my-api-center-from-the-free-plan-to-the-standard-plan) to the **Standard** plan to enable full service features including semantic search in the API Center portal.

To use AI-assisted search when signed in to the API Center portal, click in the search box, select **Search with AI**, and enter a query.

:::image type="content" source="media/customize-api-center-portal/semantic-search.png" alt-text="Screenshot of semantic search results in API Center portal.":::

## Custom metadata

On the **Metadata** tab, optionally select [custom metadata](metadata.md) properties that you want to expose in API details and semantic search.

## Enable access to test console for APIs

You can configure user settings to granularly authorize access to APIs and their specific versions in your API center. For example, configure certain API versions to use API keys for authentication, and create an access policy that permits only specific users to authenticate using those keys. 

Access policies also apply to the "Try this API" capability for APIs in the API Center portal, ensuring that only portal users with the appropriate access policy can use the test console for those API versions. [Learn more about authorizing access to APIs](authorize-api-access.md)

## Related content

* [Set up the API Center portal](set-up-api-center-portal.md)
* [Enable and view Azure API Center portal in Visual Studio Code](enable-api-center-portal-vs-code-extension.md)
* [Self-host the API Center portal](self-host-api-center-portal.md)

