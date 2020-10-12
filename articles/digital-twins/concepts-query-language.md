---
# Mandatory fields.
title: Query language
titleSuffix: Azure Digital Twins
description: Understand the basics of the Azure Digital Twins query language.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 3/26/2020
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# About the query language for Azure Digital Twins

Recall that the center of Azure Digital Twins is the [**twin graph**](concepts-twins-graph.md), constructed from **digital twins** and **relationships**. This graph can be queried to get information about the digital twins and relationships it contains. These queries are written in a custom SQL-like query language, referred to as the **Azure Digital Twins query language**.

To submit a query to the service from a client app, you will use the Azure Digital Twins [**Query API**](https://docs.microsoft.com/dotnet/api/azure.digitaltwins.core.digitaltwinsclient.query?view=azure-dotnet-preview&preserve-view=true). This lets developers write queries and apply filters to find sets of digital twins in the twin graph, and other information about the Azure Digital Twins scenario.

[!INCLUDE [digital-twins-query-operations.md](../../includes/digital-twins-query-operations.md)]

## Next steps

Learn how to write queries and see client code examples in [*How-to: Query the twin graph*](how-to-query-graph.md).
