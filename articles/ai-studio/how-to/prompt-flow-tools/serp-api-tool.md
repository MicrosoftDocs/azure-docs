---
title: Serp API tool for flows in Azure AI Studio
titleSuffix: Azure AI Studio
description: This article introduces the Serp API tool for flows in Azure AI Studio.
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: conceptual
ms.date: 11/15/2023
ms.author: eur
---

# Serp API tool for flows in Azure AI Studio

[!INCLUDE [Azure AI Studio preview](../../includes/preview-ai-studio.md)]

The prompt flow *Serp API* tool provides a wrapper to the [SerpAPI Google Search Engine Results API](https://serpapi.com/search-api) and [SerpApi Bing Search Engine Results API](https://serpapi.com/bing-search-api). 

You can use the tool to retrieve search results from many different search engines, including Google and Bing. You can specify a range of search parameters, such as the search query, location, device type, and more.

## Prerequisites

Sign up at [SERP API homepage](https://serpapi.com/)

Create a Serp connection:
1. Sign in to [Azure AI Studio](https://studio.azureml.net/).
1. Go to **Settings** > **Connections**.
1. Select **+ New connection**.
1. Complete all steps in the **Create a new connection** dialog box. 

The connection is the model used to establish connections with Serp API. Get your API key from the SerpAPI account dashboard. 

| Type        | Name     | API KEY  |
|-------------|----------|----------|
| Serp        | Required | Required |

## Build with the Serp API tool

1. Create or open a flow in Azure AI Studio. For more information, see [Create a flow](../flow-develop.md).
1. Select **+ More tools** > **Serp API** to add the Serp API tool to your flow.

    :::image type="content" source="../../media/prompt-flow/serp-api-tool.png" alt-text="Screenshot of the Serp API tool added to a flow in Azure AI Studio." lightbox="../../media/prompt-flow/serp-api-tool.png":::

1. Select the connection to one of your provisioned resources. For example, select **SerpConnection** if you created a connection with that name. For more information, see [Prerequisites](#prerequisites).
1. Enter values for the Serp API tool input parameters described [here](#inputs).
1. Add more tools to your flow as needed, or select **Run** to run the flow.
1. The outputs are described [here](#outputs).


## Inputs

The following are available input parameters:


| Name     | Type    | Description                                                   | Required |
|----------|---------|---------------------------------------------------------------|----------|
| query    | string  | The search query to be executed.                              | Yes      |
| engine   | string  | The search engine to use for the search. Default is `google`. | Yes      |
| num      | integer | The number of search results to return. Default is 10.         | No      |
| location | string  | The geographic location to execute the search from.           | No       |
| safe     | string  | The safe search mode to use for the search. Default is off. | No       |


## Outputs

The json representation from serpapi query.

| Engine   | Return Type | Output                                                |
|----------|-------------|-------------------------------------------------------|
| Google   | json        | [Sample](https://serpapi.com/search-api#api-examples) |
| Bing     | json        | [Sample](https://serpapi.com/bing-search-api)         |


## Next steps

- [Learn more about how to create a flow](../flow-develop.md)

