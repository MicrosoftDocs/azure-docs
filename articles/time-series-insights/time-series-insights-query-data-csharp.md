---
title: 'Query data from a GA environment using C# code - Azure Time Series Insights | Microsoft Docs'
description: Learn how to query data from an Azure Time Series Insights environment using a custom app written in C#.
ms.service: time-series-insights
services: time-series-insights
author: deepakpalled
ms.author: dpalled
manager: cshankar
ms.devlang: csharp
ms.workload: big-data
ms.topic: conceptual
ms.date: 04/14/2020
ms.custom: seodec18
---

# Query data from the Azure Time Series Insights GA environment using C#

This C# example demonstrates how to use the [GA Query APIs](https://docs.microsoft.com/rest/api/time-series-insights/ga-query) to query data from Azure Time Series Insights GA environments.

> [!TIP]
> View GA C# code samples at [https://github.com/Azure-Samples/Azure-Time-Series-Insights](https://github.com/Azure-Samples/Azure-Time-Series-Insights/tree/master/csharp-tsi-ga-sample).

## Summary

The sample code below demonstrates the following features:

* How to acquire an access token through Azure Active Directory using [Microsoft.IdentityModel.Clients.ActiveDirectory](https://www.nuget.org/packages/Microsoft.IdentityModel.Clients.ActiveDirectory/).

* How to pass that acquired access token in the `Authorization` header of subsequent Query API requests. 

* The sample calls each of the GA Query APIs demonstrating how HTTP requests are made to the:
    * [Get Environments API](https://docs.microsoft.com/rest/api/time-series-insights/ga-query-api#get-environments-api) to return the environments the user has access to
    * [Get Environment Availability API](https://docs.microsoft.com/rest/api/time-series-insights/ga-query-api#get-environment-availability-api)
    * [Get Environment Metadata API](https://docs.microsoft.com/rest/api/time-series-insights/ga-query-api#get-environment-metadata-api) to retrieve environment metadata
    * [Get Environments Events API](https://docs.microsoft.com/rest/api/time-series-insights/ga-query-api#get-environment-events-api)
    * [Get Environment Aggregates API](https://docs.microsoft.com/rest/api/time-series-insights/ga-query-api#get-environment-aggregates-api)
    
* How to interact with the GA Query APIs using WSS to message the:

   * [Get Environment Events Streamed API](https://docs.microsoft.com/rest/api/time-series-insights/ga-query-api#get-environment-events-streamed-api)
   * [Get Environment Aggregates Streamed API](https://docs.microsoft.com/rest/api/time-series-insights/ga-query-api#get-environment-aggregates-streamed-api)

## Prerequisites and setup

Complete the following steps before you compile and run the sample code:

1. [Provision a GA Azure Time Series Insights](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-get-started) environment.
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

[!code-csharp[csharpquery-example](~/samples-tsi/csharp-tsi-ga-sample/Program.cs)]

## Next steps

- To learn more about querying, read the [Query API reference](https://docs.microsoft.com/rest/api/time-series-insights/ga-query-api).

- Read how to [connect a JavaScript app using the client SDK](https://github.com/microsoft/tsiclient) to Time Series Insights.
