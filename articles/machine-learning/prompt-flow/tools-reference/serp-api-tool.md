---
title: SerpApi tool in Azure Machine Learning prompt flow
titleSuffix: Azure Machine Learning
description: SerpApi is a Python tool that provides a wrapper to the SerpApi Google Search Engine Results API and the SerpApi Bing Search Engine Results API.
services: machine-learning
ms.service: machine-learning
ms.subservice: prompt-flow
ms.custom:
  - devx-track-python
  - ignite-2023
ms.topic: reference
author: likebupt
ms.author: keli19
ms.reviewer: lagayhar
ms.date: 11/02/2023
---

# SerpApi tool

SerpApi is a Python tool that provides a wrapper to the [SerpApi Google Search Engine Results API](https://serpapi.com/search-api) and the [SerpApi Bing Search Engine Results API](https://serpapi.com/bing-search-api).

You can use the tool to retrieve search results from many different search engines, including Google and Bing. You can also specify a range of search parameters, such as the search query, location, and device type.

## Prerequisite

Sign up at the [SerpApi website](https://serpapi.com/).

## Connection

Connection is the model used to establish connections with SerpApi.

| Type        | Name     | API key  |
|-------------|----------|----------|
| Serp        | Required | Required |

The API key is on the SerpApi account dashboard.

## Inputs

The SerpApi tool supports the following parameters:

| Name     | Type    | Description                                                   | Required |
|----------|---------|---------------------------------------------------------------|----------|
| query    | string  | The search query to be run.                              | Yes      |
| engine   | string  | The search engine to use for the search. Default is `google`. | Yes      |
| num      | integer | The number of search results to return. Default is 10.         | No      |
| location | string  | The geographic location from which to run the search.           | No       |
| safe     | string  | The safe search mode to use for the search. Default is `off`. | No       |

## Outputs

The JSON representation from a SerpApi query.

| Engine   | Return type | Output                                                |
|----------|-------------|-------------------------------------------------------|
| Google   | JSON        | [Sample](https://serpapi.com/search-api#api-examples) |
| Bing     | JSON        | [Sample](https://serpapi.com/bing-search-api)         |
