---
title: SerpAPI tool in Azure Machine Learning prompt flow (preview)
titleSuffix: Azure Machine Learning
description: The SerpAPI API is a Python tool that provides a wrapper to the SerpAPI Google Search Engine Results API and SerpApi Bing Search Engine Results API.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.custom: devx-track-python
ms.topic: reference
author: likebupt
ms.author: keli19
ms.reviewer: lagayhar
ms.date: 06/30/2023
---

# SerpAPI tool (preview)

The SerpAPI API is a Python tool that provides a wrapper to the [SerpAPI Google Search Engine Results API](https://serpapi.com/search-api) and [SerpApi Bing Search Engine Results API](https://serpapi.com/bing-search-api).

We could use the tool to retrieve search results from many different search engines, including Google and Bing, and you can specify a range of search parameters, such as the search query, location, device type, and more.

> [!IMPORTANT]
> Prompt flow is currently in public preview. This preview is provided without a service-level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisite

Sign up at [SERP API homepage](https://serpapi.com/)


## Connection

Connection is the model used to establish connections with Serp API.

| Type        | Name     | API KEY  |
|-------------|----------|----------|
| Serp        | Required | Required |

_**API Key** is on SerpAPI account dashboard_


## Inputs

The **serp api** tool supports following parameters:


| Name     | Type    | Description                                                   | Required |
|----------|---------|---------------------------------------------------------------|----------|
| query    | string  | The search query to be executed.                              | Yes      |
| engine   | string  | The search engine to use for the search. Default is 'google'. | Yes      |
| num      | integer | The number of search results to return. Default is 10.         | No      |
| location | string  | The geographic location to execute the search from.           | No       |
| safe     | string  | The safe search mode to use for the search. Default is 'off'. | No       |


## Outputs

The json representation from serpapi query.

| Engine   | Return Type | Output                                                |
|----------|-------------|-------------------------------------------------------|
| Google   | json        | [Sample](https://serpapi.com/search-api#api-examples) |
| Bing     | json        | [Sample](https://serpapi.com/bing-search-api)         |
