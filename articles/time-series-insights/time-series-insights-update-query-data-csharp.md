---
title: 'Query data from a Preview environment using C# - Azure Time Series Insights | Microsoft Docs'
description: Learn how to query data from an Azure Time Series Insights environment by using an app written in C#.
ms.service: time-series-insights
services: time-series-insights
author: deepakpalled
ms.author: dpalled
manager: cshankar
ms.devlang: csharp
ms.workload: big-data
ms.topic: conceptual
ms.date: 12/05/2019
ms.custom: seodec18
---

# Query data from the Azure Time Series Insights Preview environment using C#

This C# example demonstrates how to query data from the Azure Time Series Insights Preview environment.

The sample shows several basic examples of Query API usage:

1. As a preparation step, acquire the access token through the Azure Active Directory API. Pass this token in the `Authorization` header of every Query API request. For setting up non-interactive applications, read [Authentication and authorization](time-series-insights-authentication-and-authorization.md). Also, ensure all the constants defined at the beginning of the sample are correctly set.
1. The list of environments that the user has access to is obtained. One of the environments is picked up as the environment of interest, and further data is queried for this environment.
1. As an example of HTTPS request, availability data is requested for the environment of interest.
1. Provides an example of SDK auto-generation support from [Azure AutoRest](https://github.com/Azure/AutoRest).

> [!NOTE]
> The example code as well as the steps to compile and run it are available at [https://github.com/Azure-Samples/Azure-Time-Series-Insights](https://github.com/Azure-Samples/Azure-Time-Series-Insights/tree/master/csharp-tsi-preview-sample).

## C# example

[!code-csharp[csharpquery-example](~/samples-tsi/csharp-tsi-preview-sample/DataPlaneClientSampleApp/Program.cs)]

> [!NOTE]
> The code sample above can be run without altering the default environment values.

## Next steps

- To learn more about querying, read the [Query API reference](https://docs.microsoft.com/rest/api/time-series-insights/preview-query).

- Read how to [connect a JavaScript app using the client SDK](https://github.com/microsoft/tsiclient) to Time Series Insights.
