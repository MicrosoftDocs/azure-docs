---
title: Azure Application Insights - Dependency Auto-Collection | Microsoft Docs
description: Application Insights automatically collect and visualize dependencies
services: application-insights
documentationcenter: .net
author: nikmd23
manager: carmonm

ms.service: application-insights
ms.workload: TBD
ms.tgt_pltfrm: ibiza
ms.devlang: multiple
ms.topic: reference
ms.date: 08/13/2018
ms.reviewer: mbullwin
ms.author: nimolnar

---

# Dependency auto-collection

Below is the currently supported list of dependency calls that are automatically detected as dependencies without requiring any additional modification to your application's code. This consists of outgoing calls to communication libraries, storage clients, logging & metrics libraries, as well as incoming calls into application frameworks and servers. These dependencies are visualized in the Application Insights [Application map](https://docs.microsoft.com/azure/application-insights/app-insights-app-map) and [Transaction diagnostics](https://docs.microsoft.com/azure/application-insights/app-insights-transaction-diagnostics) views. If your dependency isn't on the list below, you can still track it manually with a [track dependency call](https://docs.microsoft.com/azure/application-insights/app-insights-api-custom-events-metrics#trackdependency).

## .NET

| App frameworks| Versions |
| ------------------------|----------|
| ASP.NET Webforms | 4.5+ |
| ASP.NET MVC | 4+ |
| ASP.NET WebAPI | 4.5+ |
| ASP.NET Core | 1.1+ |
| <b> Communication libraries</b> |
| [HttpClient](https://www.microsoft.com/net/) | 4.5+, .NET Core 1.1+ |
| [SqlClient](https://www.nuget.org/packages/System.Data.SqlClient) | .NET Core 1.0+, NuGet 4.3.0 |
| [EventHubs Client SDK](https://www.nuget.org/packages/Microsoft.Azure.EventHubs) | 1.1.0 |
| [ServiceBus Client SDK](https://www.nuget.org/packages/Microsoft.Azure.ServiceBus) | 3.0.0 |
| <b>Storage clients</b>|  |
| ADO.NET | 4.5+ |
| <b>Logging libraries</b> |  |
| ILogger | 1.1+ |
| System.Diagnostics.Trace | 4.5+ |
| [nLog](https://www.nuget.org/packages/NLog/) | 4.4.12+ |
| [log4net](https://www.nuget.org/packages/log4net/) | 2.0.8+ on NetStandard  1.3, 2.0.6+ on .NET 4.5+ |

## Java
| App servers | Versions |
|-------------|----------|
| [Tomcat](https://tomcat.apache.org/) | 7, 8 | 
| [JBoss EAP](https://developers.redhat.com/products/eap/download/) | 6, 7 |
| [Jetty](http://www.eclipse.org/jetty/) | 9 |
| <b>App frameworks </b> |  |
| [Spring](https://spring.io/) | 3.0 |
| [Spring Boot](https://spring.io/projects/spring-boot) | 1.5.9+<sup>*</sup> |
| Java Servlet | 3.1+ |
| <b>Communication libraries</b> |  |
| [Apache Http Client](https://mvnrepository.com/artifact/org.apache.httpcomponents/httpclient) | 4.3+<sup>†</sup> |
| <b>Storage clients</b> | |
| [SQL Server]( https://mvnrepository.com/artifact/com.microsoft.sqlserver/mssql-jdbc) | 1+<sup>†</sup> |
| [Oracle]( http://www.oracle.com/technetwork/database/application-development/jdbc/downloads/index.html) | 1+<sup>†</sup> |
| [MySql]( https://mvnrepository.com/artifact/mysql/mysql-connector-java) | 1+<sup>†</sup> |
| <b>Logging libraries</b> | |
| [Logback](https://logback.qos.ch/) | 1+ |
| [Log4j](https://logging.apache.org/log4j/) | 1.2+ |
| <b>Metrics libraries</b> |  |
| JMX | 1.0+ |

> [!NOTE]
> *Except reactive programing support.
> <br>†Requires installation of [JVM Agent](https://docs.microsoft.com/azure/application-insights/app-insights-java-agent#install-the-application-insights-agent-for-java).

## Node.js

| Communication libraries | Versions |
| ------------------------|----------|
| [HTTP](https://nodejs.org/api/http.html), [HTTPS](https://nodejs.org/api/https.html) | 0.10+ |
| <b>Storage clients</b> | |
| [Redis](https://www.npmjs.com/package/redis) | 2.x |
| [MongoDb](https://www.npmjs.com/package/mongodb); [MongoDb Core](https://www.npmjs.com/package/mongodb-core) | 2.0.0 - 2.3.0 |
| [MySQL](https://www.npmjs.com/package/mysql) | 2.0.0 - 2.14.x |
| [PostgreSql](https://www.npmjs.com/package/pg); | 6.x |
| [pg-pool](https://www.npmjs.com/package/pg-pool) | 1.x |
| <b>Logging libraries</b> | |
| [console](https://nodejs.org/api/console.html) | 0.10+ |
| [Bunyan](https://www.npmjs.com/package/bunyan) | 1.x |
| [Winston](https://www.npmjs.com/package/winston) | 2.x |

## JavaScript

| Communication libraries | Versions |
| ------------------------|----------|
| [XMLHttpRequest](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest) | All |

## Next steps

- Set up custom dependency tracking for [.NET](app-insights-asp-net-dependencies.md).
- Set up custom dependency tracking for [Java](app-insights-java-agent.md).
- [Write custom dependency telemetry](app-insights-api-custom-events-metrics.md#trackdependency)
- See [data model](application-insights-data-model.md) for Application Insights types and data model.
- Check out [platforms](app-insights-platforms.md) supported by Application Insights.
