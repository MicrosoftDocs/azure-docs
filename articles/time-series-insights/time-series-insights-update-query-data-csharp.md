---
title: 'Query data from a Gen2 environment using C# - Azure Time Series Insights | Microsoft Docs'
description: Learn how to query data from an Azure Time Series Insights Gen2 environment by using an app written in C#.
ms.service: time-series-insights
services: time-series-insights
author: shreyasharmamsft
ms.author: shresha
manager: cnovak
ms.reviewer: orspodek
ms.devlang: csharp
ms.workload: big-data
ms.topic: conceptual
ms.date: 10/02/2020
ms.custom: seodec18
---

# Query data from the Azure Time Series Insights Gen2 environment using C Sharp

[!INCLUDE [retirement](../../includes/tsi-retirement.md)]

This C# example demonstrates how to query data from the [Gen2 Data Access APIs](/rest/api/time-series-insights/reference-data-access-overview) in Azure Time Series Insights Gen2 environments.

> [!TIP]
> View Gen2 C# code samples at [https://github.com/Azure-Samples/Azure-Time-Series-Insights](https://github.com/Azure-Samples/Azure-Time-Series-Insights/tree/master/gen2-sample/csharp-tsi-gen2-sample).

## Summary

The sample code below demonstrates the following features:

* Support for SDK auto-generation from [Azure AutoRest](https://github.com/Azure/AutoRest).
* How to acquire an access token through Microsoft Entra ID using [Microsoft.IdentityModel.Clients.ActiveDirectory](https://www.nuget.org/packages/Microsoft.IdentityModel.Clients.ActiveDirectory/).
* How to pass that acquired access token in the `Authorization` header of subsequent Data Access API requests.
* The sample provides a console interface demonstrating how HTTP requests are made to the following:
  * [Gen2 Environments API](/rest/api/time-series-insights/reference-environments-apis)
    * [Get Environments Availability API](/rest/api/time-series-insights/dataaccessgen2/query/getavailability) and [Get Event Schema API](/rest/api/time-series-insights/dataaccessgen2/query/geteventschema)
  * [Gen2 Query API](/rest/api/time-series-insights/reference-query-apis)
    * [Get Events API](/rest/api/time-series-insights/dataaccessgen2/query/execute#getevents), [Get Series API](/rest/api/time-series-insights/dataaccessgen2/query/execute#getseries), and [Get Aggregate Series API](/rest/api/time-series-insights/dataaccessgen2/query/execute#aggregateseries)
  * [Time Series Model APIs](/rest/api/time-series-insights/dataaccessgen2/query/execute#aggregateseries)
    * [Get Hierarchies API](/rest/api/time-series-insights/dataaccessgen2/timeserieshierarchies) and [Hierarchies Batch API](/rest/api/time-series-insights/dataaccessgen2/timeserieshierarchies/executebatch)
    * [Get Types API](/rest/api/time-series-insights/dataaccessgen2/timeseriestypes) and [Types Batch API](/rest/api/time-series-insights/dataaccessgen2/timeseriestypes/executebatch)
    * [Get Instances API](/rest/api/time-series-insights/dataaccessgen2/timeseriesinstances) and [Instances Batch API](/rest/api/time-series-insights/dataaccessgen2/timeseriesinstances/executebatch)

* Advanced [Search](/rest/api/time-series-insights/reference-model-apis#search-features) and [TSX](/rest/api/time-series-insights/reference-time-series-expression-syntax) capabilities.

## Prerequisites and setup

Complete the following steps before you compile and run the sample code:

1. [Provision a Gen2 Azure Time Series Insights](./how-to-create-environment-using-portal.md) environment.
1. Configure your Azure Time Series Insights environment for Microsoft Entra ID as described in [Authentication and authorization](time-series-insights-authentication-and-authorization.md).
1. Run the [GenerateCode.bat](https://github.com/Azure-Samples/Azure-Time-Series-Insights/blob/master/gen2-sample/csharp-tsi-gen2-sample/DataPlaneClient/GenerateCode.bat) as specified in the [Readme.md](https://github.com/Azure-Samples/Azure-Time-Series-Insights/blob/master/gen2-sample/csharp-tsi-gen2-sample/DataPlaneClient/Readme.md) to generate the Azure Time Series Insights Gen2 client dependencies.
1. Open the `TSIPreviewDataPlaneclient.sln` solution and set `DataPlaneClientSampleApp` as the default project in Visual Studio.
1. Install the required project dependencies using the steps described [below](#project-dependencies) and compile the example to an executable `.exe` file.
1. Run the `.exe` file by double-clicking on it.

## Project dependencies

It's recommended that you use the newest version of Visual Studio:

* [Visual Studio 2019](https://visualstudio.microsoft.com/vs/) - Version 16.4.2+

The sample code has several required dependencies which can be viewed in the [packages.config](https://github.com/Azure-Samples/Azure-Time-Series-Insights/blob/master/gen2-sample/csharp-tsi-gen2-sample/DataPlaneClientSampleApp/packages.config) file.

Download the packages in Visual Studio 2019 by selecting the **Build** > **Build Solution** option.

Alternatively, add each package using [NuGet 2.12+](https://www.nuget.org/). For example:

* `dotnet add package Microsoft.IdentityModel.Clients.ActiveDirectory --version 4.5.1`

## C# sample code

Please refer to the [Azure Time Series Insights](https://github.com/Azure-Samples/Azure-Time-Series-Insights/tree/master/gen2-sample/csharp-tsi-gen2-sample) repo to access the C# sample code.

> [!NOTE]
>
> * The code sample can be executed without altering the default environment variables.
> * The code sample will compile to a .NET executable console app.

## Next steps

* To learn more about querying, read the [Query API reference](/rest/api/time-series-insights/reference-query-apis).

* Read how to [connect a JavaScript app using the client SDK](https://github.com/microsoft/tsiclient) to Azure Time Series Insights.
