---
title: Azure Application Insights - Dependency Auto-Collection | Microsoft Docs
description: Application Insights automatically collect and visualize dependencies
ms.topic: reference
author: mrbullwinkle
ms.author: mbullwin
ms.date: 05/06/2020

---

# Dependency auto-collection

Below is the currently supported list of dependency calls that are automatically detected as dependencies without requiring any additional modification to your application's code. These dependencies are visualized in the Application Insights [Application map](https://docs.microsoft.com/azure/application-insights/app-insights-app-map) and [Transaction diagnostics](https://docs.microsoft.com/azure/application-insights/app-insights-transaction-diagnostics) views. If your dependency isn't on the list below, you can still track it manually with a [track dependency call](https://docs.microsoft.com/azure/application-insights/app-insights-api-custom-events-metrics#trackdependency).

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
| [Microsoft.Data.SqlClient](https://www.nuget.org/packages/Microsoft.Data.SqlClient/1.1.2)| 1.1.0 - latest stable release. (See Note below.)
| [EventHubs Client SDK](https://www.nuget.org/packages/Microsoft.Azure.EventHubs) | 1.1.0 |
| [ServiceBus Client SDK](https://www.nuget.org/packages/Microsoft.Azure.ServiceBus) | 3.0.0 |
| <b>Storage clients</b>|  |
| ADO.NET | 4.5+ |

> [!NOTE]
> There is a [known issue](https://github.com/microsoft/ApplicationInsights-dotnet/issues/1347) with older versions of Microsoft.Data.SqlClient. We recommend using 1.1.0 or later to mitigate this issue. Entity Framework Core does not necessarily ship with the latest stable release of Microsoft.Data.SqlClient so we advise confirming that you are on at least 1.1.0 to avoid this issue.   


## Java
| App servers | Versions |
|-------------|----------|
| [Tomcat](https://tomcat.apache.org/) | 7, 8 | 
| [JBoss EAP](https://developers.redhat.com/products/eap/download/) | 6, 7 |
| [Jetty](https://www.eclipse.org/jetty/) | 9 |
| <b>App frameworks </b> |  |
| [Spring](https://spring.io/) | 3.0 |
| [Spring Boot](https://spring.io/projects/spring-boot) | 1.5.9+<sup>*</sup> |
| Java Servlet | 3.1+ |
| <b>Communication libraries</b> |  |
| [Apache Http Client](https://mvnrepository.com/artifact/org.apache.httpcomponents/httpclient) | 4.3+<sup>†</sup> |
| <b>Storage clients</b> | |
| [SQL Server]( https://mvnrepository.com/artifact/com.microsoft.sqlserver/mssql-jdbc) | 1+<sup>†</sup> |
| [PostgreSQL (Beta Support)](https://github.com/Microsoft/ApplicationInsights-Java/blob/master/CHANGELOG.md#version-240-beta) | |
| [Oracle]( https://www.oracle.com/technetwork/database/application-development/jdbc/downloads/index.html) | 1+<sup>†</sup> |
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
| [MongoDb](https://www.npmjs.com/package/mongodb); [MongoDb Core](https://www.npmjs.com/package/mongodb-core) | 2.x - 3.x |
| [MySQL](https://www.npmjs.com/package/mysql) | 2.0.0 - 2.16.x |
| [PostgreSql](https://www.npmjs.com/package/pg); | 6.x - 7.x |
| [pg-pool](https://www.npmjs.com/package/pg-pool) | 1.x - 2.x |
| <b>Logging libraries</b> | |
| [console](https://nodejs.org/api/console.html) | 0.10+ |
| [Bunyan](https://www.npmjs.com/package/bunyan) | 1.x |
| [Winston](https://www.npmjs.com/package/winston) | 2.x - 3.x |

## JavaScript

| Communication libraries | Versions |
| ------------------------|----------|
| [XMLHttpRequest](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest) | All |

## Next steps

- Set up custom dependency tracking for [.NET](../../azure-monitor/app/asp-net-dependencies.md).
- Set up custom dependency tracking for [Java](../../azure-monitor/app/java-agent.md).
- Set up custom dependency tracking for [OpenCensus Python](../../azure-monitor/app/opencensus-python-dependency.md).
- [Write custom dependency telemetry](../../azure-monitor/app/api-custom-events-metrics.md#trackdependency)
- See [data model](../../azure-monitor/app/data-model.md) for Application Insights types and data model.
- Check out [platforms](../../azure-monitor/app/platforms.md) supported by Application Insights.
