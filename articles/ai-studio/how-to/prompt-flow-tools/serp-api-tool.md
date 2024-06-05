---
title: Serp API tool for flows in Azure AI Studio
titleSuffix: Azure AI Studio
description: This article introduces you to the Serp API tool for flows in Azure AI Studio.
manager: scottpolly
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
  - build-2024
ms.topic: how-to
ms.date: 5/21/2024
ms.reviewer: keli19
ms.author: lagayhar
author: lgayhardt
---

# Serp API tool for flows in Azure AI Studio

[!INCLUDE [Feature preview](../../includes/feature-preview.md)]

The prompt flow Serp API tool provides a wrapper to the [Serp API Google Search Engine Results API](https://serpapi.com/search-api) and [Serp API Bing Search Engine Results API](https://serpapi.com/bing-search-api).

You can use the tool to retrieve search results from many different search engines, including Google and Bing. You can specify a range of search parameters, such as the search query, location, and device type.

## Prerequisites

Sign up on the [Serp API home page](https://serpapi.com/).

To create a Serp connection:

1. Sign in to [Azure AI Studio](https://studio.azureml.net/).
1. Go to **Project settings** > **Connections**.
1. Select **+ New connection**.
1. Add the following custom keys to the connection:

    - `azureml.flow.connection_type`: `Custom`
    - `azureml.flow.module`: `promptflow.connections`
    - `api_key`: Your Serp API key. You must select the **is secret** checkbox to keep the API key secure.
    
    :::image type="content" source="../../media/prompt-flow/serp-custom-connection-keys.png" alt-text="Screenshot that shows adding extra information to a custom connection in AI Studio." lightbox = "../../media/prompt-flow/serp-custom-connection-keys.png":::

The connection is the model used to establish connections with the Serp API. Get your API key from the Serp API account dashboard.

| Type        | Name     | API key  |
|-------------|----------|----------|
| Serp        | Required | Required |

## Build with the Serp API tool

1. Create or open a flow in [Azure AI Studio](https://ai.azure.com). For more information, see [Create a flow](../flow-develop.md).
1. Select **+ More tools** > **Serp API** to add the Serp API tool to your flow.

    :::image type="content" source="../../media/prompt-flow/serp-api-tool.png" alt-text="Screenshot that shows the Serp API tool added to a flow in Azure AI Studio." lightbox="../../media/prompt-flow/serp-api-tool.png":::

1. Select the connection to one of your provisioned resources. For example, select **SerpConnection** if you created a connection with that name. For more information, see [Prerequisites](#prerequisites).
1. Enter values for the Serp API tool input parameters described in the [Inputs table](#inputs).
1. Add more tools to your flow, as needed. Or select **Run** to run the flow.
1. The outputs are described in the [Outputs table](#outputs).

## Inputs

The following input parameters are available.

| Name     | Type    | Description                                                   | Required |
|----------|---------|---------------------------------------------------------------|----------|
| query    | string  | The search query to be executed.                              | Yes      |
| engine   | string  | The search engine to use for the search. Default is `google`. | Yes      |
| num      | integer | The number of search results to return. Default is 10.         | No      |
| location | string  | The geographic location from which to execute the search.           | No       |
| safe     | string  | The safe search mode to use for the search. Default is off. | No       |

## Outputs

The JSON representation from a `serpapi` query:

| Engine   | Return type | Output                                                |
|----------|-------------|-------------------------------------------------------|
| Google   | json        | [Sample](https://serpapi.com/search-api#api-examples) |
| Bing     | json        | [Sample](https://serpapi.com/bing-search-api)         |

## Next steps

- [Learn more about how to create a flow](../flow-develop.md)
