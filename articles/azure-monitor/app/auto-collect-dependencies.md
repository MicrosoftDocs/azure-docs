---
title: Azure Application Insights - Dependency Auto-Collection | Microsoft Docs
description: Application Insights automatically collect and visualize dependencies
ms.topic: reference
ms.devlang: csharp, java, javascript
ms.custom: devx-track-dotnet
ms.date: 08/22/2022
ms.reviewer: mmcc
---

# Dependency auto-collection

Below is the currently supported list of dependency calls that are automatically detected as dependencies without requiring any additional modification to your application's code. These dependencies are visualized in the Application Insights [Application map](./app-map.md) and [Transaction diagnostics](./transaction-diagnostics.md) views. If your dependency isn't on the list below, you can still track it manually with a [track dependency call](./api-custom-events-metrics.md#trackdependency).

## .NET

| App frameworks| Versions |
| ------------------------|----------|
| ASP.NET Webforms | 4.5+ |
| ASP.NET MVC | 4+ |
| ASP.NET WebAPI | 4.5+ |
| ASP.NET Core | 1.1+ |
| <b> Communication libraries</b> |
| [HttpClient](https://dotnet.microsoft.com) | 4.5+, .NET Core 1.1+ |
| [SqlClient](https://www.nuget.org/packages/System.Data.SqlClient) | .NET Core 1.0+, NuGet 4.3.0 |
| [Microsoft.Data.SqlClient](https://www.nuget.org/packages/Microsoft.Data.SqlClient/1.1.2)| 1.1.0 - latest stable release. (See Note below.)
| [EventHubs Client SDK](https://www.nuget.org/packages/Microsoft.Azure.EventHubs) | 1.1.0 |
| [ServiceBus Client SDK](https://www.nuget.org/packages/Microsoft.Azure.ServiceBus) | 3.0.0 |
| <b>Storage clients</b>|  |
| ADO.NET | 4.5+ |

> [!NOTE]
> There is a [known issue](https://github.com/microsoft/ApplicationInsights-dotnet/issues/1347) with older versions of Microsoft.Data.SqlClient. We recommend using 1.1.0 or later to mitigate this issue. Entity Framework Core does not necessarily ship with the latest stable release of Microsoft.Data.SqlClient so we advise confirming that you are on at least 1.1.0 to avoid this issue.   


## Java

See the list of Application Insights Java's
[autocollected dependencies](java-in-process-agent.md#autocollected-dependencies).

## Node.js

A list of the latest [currently-supported modules](https://github.com/microsoft/node-diagnostic-channel/tree/master/src/diagnostic-channel-publishers) is maintained [here](https://github.com/microsoft/node-diagnostic-channel/tree/master/src/diagnostic-channel-publishers).

## JavaScript

| Communication libraries | Versions |
| ------------------------|----------|
| [XMLHttpRequest](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest) | All |

## Next steps

- Set up custom dependency tracking for [.NET](./asp-net-dependencies.md).
- Set up custom dependency tracking for [Java](java-in-process-agent.md#add-spans).
- Set up custom dependency tracking for [OpenCensus Python](./opencensus-python-dependency.md).
- [Write custom dependency telemetry](./api-custom-events-metrics.md#trackdependency)
- See [data model](./data-model.md) for Application Insights types and data model.
- Check out [platforms](./platforms.md) supported by Application Insights.

