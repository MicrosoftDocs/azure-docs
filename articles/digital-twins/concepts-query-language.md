---
# Mandatory fields.
title: Query language
titleSuffix: Azure Digital Twins
description: Learn about the basics of the Azure Digital Twins query language.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 01/10/2023
ms.topic: conceptual
ms.service: digital-twins
ms.custom: contperf-fy21q2

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Azure Digital Twins query language

This article describes the basics of the query language and its capabilities. Recall that the center of Azure Digital Twins is the [twin graph](concepts-twins-graph.md), constructed from digital twins and relationships. This graph can be queried to get information about the digital twins and relationships it contains. These queries are written in a custom SQL-like query language, referred to as the *Azure Digital Twins query language*. This language is similar to the [IoT Hub query language](../iot-hub/iot-hub-devguide-query-language.md) with many comparable features.

For more detailed examples of query syntax and how to run query requests, see [Query the twin graph](how-to-query-graph.md).

## About the queries

You can use the Azure Digital Twins query language to retrieve digital twins according to their...
* Properties (including [tag properties](how-to-use-tags.md))
* Models
* Relationships
  - Properties of the relationships

To submit a query to the service from a client app, you'll use the Azure Digital Twins [Query API](/rest/api/digital-twins/dataplane/query). One way to use the API is through one of the [SDKs for Azure Digital Twins](concepts-apis-sdks.md#data-plane-apis).

[!INCLUDE [digital-twins-query-reference.md](../../includes/digital-twins-query-reference.md)]

## Considerations for querying

When writing queries for Azure Digital Twins, keep the following considerations in mind:
* Remember case sensitivity: All Azure Digital Twins query operations are case-sensitive, so take care to use the exact names defined in the models. If property names are misspelled or incorrectly cased, the result set is empty with no errors returned.
* Escape single quotes: If your query text includes a single quote character in the data, the quote will need to be escaped with the `\` character. Here's an example that deals with a property value of *D'Souza*:

  :::code language="sql" source="~/digital-twins-docs-samples/queries/examples.sql" id="EscapedSingleQuote":::

[!INCLUDE [digital-twins-query-latency-note.md](../../includes/digital-twins-query-latency-note.md)]

## Querying historized twin data over time

The Azure Digital Twins query language is only for querying the **present** state of your digital twins and relationships.

To run queries on historized twin graph data collected over time, use the [data history](concepts-data-history.md) feature to connect your Azure Digital Twins instance to an [Azure Data Explorer](/azure/data-explorer/data-explorer-overview) cluster. This will automatically historize graph updates to Azure Data Explorer, where they can be queried using the [Azure Digital Twins plugin for Azure Data Explorer](concepts-data-explorer-plugin.md).

## Next steps

Learn how to write queries and see client code examples in [Query the twin graph](how-to-query-graph.md).