---
title: 'Query data from a Gen1 environment using C# code - Azure Time Series Insights Gen1 | Microsoft Docs'
description: Learn how to query data from an Azure Time Series Insights Gen1 environment using a custom app written in C#.
ms.service: time-series-insights
services: time-series-insights
author: shreyasharmamsft
ms.author: shresha
manager: cnovak
ms.reviewer: orspodek
ms.devlang: csharp
ms.workload: big-data
ms.topic: conceptual
ms.date: 09/30/2020
ms.custom: seodec18
---

# Query data from the Azure Time Series Insights Gen1 environment using C Sharp

[!INCLUDE [retirement](../../includes/tsi-retirement.md)]

> [!CAUTION]
> This is a Gen1 article.

This C# example demonstrates how to use the [Gen1 Query APIs](/rest/api/time-series-insights/gen1-query) to query data from Azure Time Series Insights Gen1 environments.

> [!TIP]
> View Gen1 C# code samples at [https://github.com/Azure-Samples/Azure-Time-Series-Insights](https://github.com/Azure-Samples/Azure-Time-Series-Insights/tree/master/gen1-sample/csharp-tsi-gen1-sample).

## Summary

The sample code below demonstrates the following features:

* How to acquire an access token through Azure Active Directory using [Microsoft.IdentityModel.Clients.ActiveDirectory](https://www.nuget.org/packages/Microsoft.IdentityModel.Clients.ActiveDirectory/).

* How to pass that acquired access token in the `Authorization` header of subsequent Query API requests.

* The sample calls each of the Gen1 Query APIs demonstrating how HTTP requests are made to the:
  * [Get Environments API](/rest/api/time-series-insights/gen1-query-api#get-environments-api) to return the environments the user has access to
  * [Get Environment Availability API](/rest/api/time-series-insights/gen1-query-api#get-environment-availability-api)
  * [Get Environment Metadata API](/rest/api/time-series-insights/gen1-query-api#get-environment-metadata-api) to retrieve environment metadata
  * [Get Environments Events API](/rest/api/time-series-insights/gen1-query-api#get-environment-events-api)
  * [Get Environment Aggregates API](/rest/api/time-series-insights/gen1-query-api#get-environment-aggregates-api)

* How to interact with the Gen1 Query APIs using WSS to message the:

  * [Get Environment Events Streamed API](/rest/api/time-series-insights/gen1-query-api#get-environment-events-streamed-api)
  * [Get Environment Aggregates Streamed API](/rest/api/time-series-insights/gen1-query-api#get-environment-aggregates-streamed-api)

## Prerequisites and setup

Complete the following steps before you compile and run the sample code:

1. [Provision a Gen1 Azure Time Series Insights](./time-series-insights-get-started.md) environment.
1. Configure your Azure Time Series Insights environment for Azure Active Directory as described in [Authentication and authorization](time-series-insights-authentication-and-authorization.md).
1. Install the required project dependencies.
1. Edit the sample code below by replacing each **#DUMMY#** with the appropriate environment identifier.
1. Execute the code inside Visual Studio.

## Project dependencies

It's recommended that you use the newest version of Visual Studio:

* [Visual Studio 2019](https://visualstudio.microsoft.com/vs/) - Version 16.4.2+

The sample code has two required dependencies:

* [Microsoft.IdentityModel.Clients.ActiveDirectory](https://www.nuget.org/packages/Microsoft.IdentityModel.Clients.ActiveDirectory/) -  3.13.9 package.
* [Newtonsoft.Json](https://www.nuget.org/packages/Newtonsoft.Json) - 9.0.1 package.

Download the packages in Visual Studio 2019 by selecting the **Build** > **Build Solution** option.

Alternatively, add the packages using [NuGet 2.12+](https://www.nuget.org/):

* `dotnet add package Newtonsoft.Json --version 9.0.1`
* `dotnet add package Microsoft.IdentityModel.Clients.ActiveDirectory --version 3.13.9`

## C# sample code

Please refer to the [Azure Time Series Insights](https://github.com/Azure-Samples/Azure-Time-Series-Insights/blob/master/gen1-sample/csharp-tsi-gen1-sample/Program.cs)] repo to access the C# sample code.

## Next steps

* To learn more about querying, read the [Query API reference](/rest/api/time-series-insights/gen1-query-api).

* Read how to [connect a JavaScript app using the client SDK](https://github.com/microsoft/tsiclient) to Time Series Insights.
Azure-Samples/Azure-Time-Series-Insights/gen1-sample/csharp-tsi-gen1-sample/Program.cs