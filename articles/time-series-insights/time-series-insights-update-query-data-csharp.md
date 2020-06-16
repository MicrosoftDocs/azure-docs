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
ms.date: 04/14/2020
ms.custom: seodec18
---

# Query data from the Azure Time Series Insights Preview environment using C#

This C# example demonstrates how to query data from the [Preview Data Access APIs](https://docs.microsoft.com/rest/api/time-series-insights/preview) in Azure Time Series Insights Preview environments.

> [!TIP]
> View Preview C# code samples at [https://github.com/Azure-Samples/Azure-Time-Series-Insights](https://github.com/Azure-Samples/Azure-Time-Series-Insights/tree/master/csharp-tsi-preview-sample).

## Summary

The sample code below demonstrates the following features:

* Support for SDK auto-generation from [Azure AutoRest](https://github.com/Azure/AutoRest).
* How to acquire an access token through Azure Active Directory using [Microsoft.IdentityModel.Clients.ActiveDirectory](https://www.nuget.org/packages/Microsoft.IdentityModel.Clients.ActiveDirectory/).
* How to pass that acquired access token in the `Authorization` header of subsequent Data Access API requests. 
* The sample provides a console interface demonstrating how HTTP requests are made to the:

    * [Preview Environments API](https://docs.microsoft.com/rest/api/time-series-insights/preview#preview-environments-apis)
        * [Get Environments Availability API](https://docs.microsoft.com/rest/api/time-series-insights/dataaccess(preview)/query/getavailability) and [Get Event Schema API](https://docs.microsoft.com/rest/api/time-series-insights/dataaccess(preview)/query/geteventschema)
    * [Preview Query API](https://docs.microsoft.com/rest/api/time-series-insights/preview#query-apis)
        * [Get Events API](https://docs.microsoft.com/rest/api/time-series-insights/dataaccess(preview)/query/execute#getevents), [Get Series API](https://docs.microsoft.com/rest/api/time-series-insights/dataaccess(preview)/query/execute#getseries), and [Get Aggregate Series API](https://docs.microsoft.com/rest/api/time-series-insights/dataaccess(preview)/query/execute#aggregateseries)
    * [Time Series Model APIs](https://docs.microsoft.com/rest/api/time-series-insights/dataaccess(preview)/query/execute#aggregateseries)
        * [Get Hierarchies API](https://docs.microsoft.com/rest/api/time-series-insights/dataaccess(preview)/timeserieshierarchies/get) and [Hierarchies Batch API](https://docs.microsoft.com/rest/api/time-series-insights/dataaccess(preview)/timeserieshierarchies/executebatch)
        * [Get Types API](https://docs.microsoft.com/rest/api/time-series-insights/dataaccess(preview)/timeseriestypes/get) and [Types Batch API](https://docs.microsoft.com/rest/api/time-series-insights/dataaccess(preview)/timeseriestypes/executebatch)
        * [Get Instances API](https://docs.microsoft.com/rest/api/time-series-insights/dataaccess(preview)/timeseriesinstances/get) and [Instances Batch API](https://docs.microsoft.com/rest/api/time-series-insights/dataaccess(preview)/timeseriesinstances/executebatch)
* Advanced [Search](https://docs.microsoft.com/rest/api/time-series-insights/preview#search-features) and [TSX](https://docs.microsoft.com/rest/api/time-series-insights/preview#time-series-expression-and-syntax) capabilities.

## Prerequisites and setup

Complete the following steps before you compile and run the sample code:

1. [Provision a Preview Azure Time Series Insights](https://docs.microsoft.com/azure/time-series-insights/time-series-insights-update-how-to-manage#create-the-environment) environment.
1. Configure your Azure Time Series Insights environment for Azure Active Directory as described in [Authentication and authorization](time-series-insights-authentication-and-authorization.md). 
1. Run the [GenerateCode.bat](https://github.com/Azure-Samples/Azure-Time-Series-Insights/blob/master/csharp-tsi-preview-sample/DataPlaneClient/GenerateCode.bat) as specified in the [Readme.md](https://github.com/Azure-Samples/Azure-Time-Series-Insights/blob/master/csharp-tsi-preview-sample/DataPlaneClient/Readme.md) to generate the Time Series Insights Preview client dependencies.
1. Open the `TSIPreviewDataPlaneclient.sln` solution and set `DataPlaneClientSampleApp` as the default project in Visual Studio.
1. Install the required project dependencies using the steps described [below](#project-dependencies) and compile the example to an executable `.exe` file.
1. Run the `.exe` file by double-clicking on it.

## Project dependencies

It's recommended that you use the newest version of Visual Studio:

* [Visual Studio 2019](https://visualstudio.microsoft.com/vs/) - Version 16.4.2+

The sample code has several required dependencies which can be viewed in the [packages.config](https://github.com/Azure-Samples/Azure-Time-Series-Insights/blob/master/csharp-tsi-preview-sample/DataPlaneClientSampleApp/packages.config) file.

Download the packages in Visual Studio 2019 by selecting the **Build** > **Build Solution** option. 

Alternatively, add each package using [NuGet 2.12+](https://www.nuget.org/). For example:

* `dotnet add package Microsoft.IdentityModel.Clients.ActiveDirectory --version 4.5.1`

## C# sample code

[!code-csharp[csharpquery-example](~/samples-tsi/csharp-tsi-preview-sample/DataPlaneClientSampleApp/Program.cs)]

> [!NOTE]
> * The code sample can be executed without altering the default environment variables.
> * The code sample will compile to a .NET executable console app.

## Next steps

- To learn more about querying, read the [Query API reference](https://docs.microsoft.com/rest/api/time-series-insights/preview-query).

- Read how to [connect a JavaScript app using the client SDK](https://github.com/microsoft/tsiclient) to Time Series Insights.
