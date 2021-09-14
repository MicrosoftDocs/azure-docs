---
# Mandatory fields.
title: Query language
titleSuffix: Azure Digital Twins
description: Understand the basics of the Azure Digital Twins query language.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 6/1/2021
ms.topic: conceptual
ms.service: digital-twins
ms.custom: contperf-fy21q2

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# About the query language for Azure Digital Twins

Recall that the center of Azure Digital Twins is the [twin graph](concepts-twins-graph.md), constructed from digital twins and relationships. 

This graph can be queried to get information about the digital twins and relationships it contains. These queries are written in a custom SQL-like query language, referred to as the **Azure Digital Twins query language**. This language is similar to the [IoT Hub query language](../iot-hub/iot-hub-devguide-query-language.md) with many comparable features.

This article describes the basics of the query language and its capabilities. For more detailed examples of query syntax and how to run query requests, see [Query the twin graph](how-to-query-graph.md).

## About the queries

You can use the Azure Digital Twins query language to retrieve digital twins according to their...
* properties (including [tag properties](how-to-use-tags.md))
* models
* relationships
  - properties of the relationships

To submit a query to the service from a client app, you'll use the Azure Digital Twins [Query API](/rest/api/digital-twins/dataplane/query). One way to use the API is through one of the [SDKs for Azure Digital Twins](concepts-apis-sdks.md#overview-data-plane-apis).

[!INCLUDE [digital-twins-query-reference.md](../../includes/digital-twins-query-reference.md)]

## Considerations for querying

When writing queries for Azure Digital Twins, keep the following considerations in mind:
* **Remember case sensitivity**: All Azure Digital Twins query operations are case-sensitive, so take care to use the exact names defined in the models. If property names are misspelled or incorrectly cased, the result set is empty with no errors returned.
* **Escape single quotes**: If your query text includes a single quote character in the data, the quote will need to be escaped with the `\` character. Here's an example that deals with a property value of *D'Souza*:

  :::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="EscapedSingleQuote":::

* **Consider possible latency**: After making a change to the data in your graph, there may be a latency of up to 10 seconds before the changes will be reflected in queries. The [GetDigitalTwin API](how-to-manage-twin.md#get-data-for-a-digital-twin) doesn't experience this delay, so if you need an instant response, use the API call instead of querying to see your change reflected immediately.

## Next steps

Learn how to write queries and see client code examples in [Query the twin graph](how-to-query-graph.md).