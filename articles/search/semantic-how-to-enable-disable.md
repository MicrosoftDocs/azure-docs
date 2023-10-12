---
title: Enable or disable semantic ranking
titleSuffix: Azure Cognitive Search
description: Steps for turning semantic ranking on or off in Cognitive Search.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 10/04/2023
---

# Enable or disable semantic ranking

Semantic ranking is a premium feature that's billed by usage. By default, semantic ranking is disabled on all services. 

## Enable semantic ranking

Follow these steps to enable [semantic ranking](semantic-search-overview.md) at the service level. Once enabled, it's available to all indexes. You can't turn it on or off for specific indexes.

### [**Azure portal**](#tab/enable-portal)

1. Open the [Azure portal](https://portal.azure.com).

1. Navigate to your search service. The service must be a billable tier.

1. Determine whether the service region supports semantic ranking:

   1. Find your service region in the overview page in the Azure portal.

   1. Check the [Products Available by Region](https://azure.microsoft.com/global-infrastructure/services/?products=search) page on the Azure web site to see if your region is listed.

1. On the left-nav pane, select **Semantic ranking**.

1. Select either the **Free plan** or the **Standard plan**. You can switch between the free plan and the standard plan at any time.

:::image type="content" source="media/semantic-search-overview/semantic-search-billing.png" alt-text="Screenshot of enabling semantic ranking in the Azure portal." border="true":::

The free plan is capped at 1,000 queries per month. After the first 1,000 queries in the free plan, you'll receive an error message letting you know you've exhausted your quota the next time you issue a semantic query. When this happens, you need to upgrade to the standard plan to continue using semantic ranking.

### [**REST**](#tab/enable-rest)

To enable semantic ranking using the REST API, you can use the [Create or Update Service API](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update#searchsemanticsearch).

Management REST API calls are authenticated through Microsoft Entra ID. See [Manage your Azure Cognitive Search service with REST APIs](search-manage-rest.md) for instructions on how to authenticate.

* Management REST API version 2021-04-01-Preview provides the configuration property.

* Owner or Contributor permissions are required to enable or disable features. 

> [!NOTE]
> Create or Update supports two HTTP methods: PUT and PATCH. Both PUT and PATCH can be used to update existing services, but only PUT can be used to create a new service. If PUT is used to update an existing service, it replaces all properties in the service with their defaults if they are not specified in the request. When PATCH is used to update an existing service, it only replaces properties that are specified in the request. When using PUT to update an existing service, it's possible to accidentally introduce an unexpected scaling or configuration change. When enabling semantic ranking on an existing service, it's recommended to use PATCH instead of PUT.

```http
PATCH https://management.azure.com/subscriptions/{{subscriptionId}}/resourcegroups/{{resource-group}}/providers/Microsoft.Search/searchServices/{{search-service-name}}?api-version=2021-04-01-Preview
    {
      "properties": {
        "semanticSearch": "standard"
      }
    }
```

---

## Disable semantic ranking using the REST API

To reverse feature enablement, or for full protection against accidental usage and charges, you can disable semantic ranking using the [Create or Update Service API](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update#searchsemanticsearch) on your search service. After the feature is disabled, any requests that include the semantic query type will be rejected.

Management REST API calls are authenticated through Microsoft Entra ID. See [Manage your Azure Cognitive Search service with REST APIs](search-manage-rest.md) for instructions on how to authenticate.

```http
PATCH https://management.azure.com/subscriptions/{{subscriptionId}}/resourcegroups/{{resource-group}}/providers/Microsoft.Search/searchServices/{{search-service-name}}?api-version=2021-04-01-Preview
    {
      "properties": {
        "semanticSearch": "disabled"
      }
    }
```

To re-enable semantic ranking, rerun the above request, setting "semanticSearch" to either "free" (default) or "standard".

## Next steps

[Configure semantic ranking](semantic-how-to-query-request.md) so that you can test out semantic ranking on your content.
