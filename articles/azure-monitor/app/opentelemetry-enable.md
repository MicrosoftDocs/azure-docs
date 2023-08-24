---
title: Enable Azure Monitor OpenTelemetry for .NET, Java, Node.js, and Python applications
description: This article provides guidance on how to enable Azure Monitor on applications by using OpenTelemetry.
ms.topic: conceptual
ms.date: 07/20/2023
ms.devlang: csharp, javascript, typescript, python
ms.custom: devx-track-dotnet, devx-track-extended-java, devx-track-python
ms.reviewer: mmcc
---

# Enable Azure Monitor OpenTelemetry for .NET, Node.js, Python and Java applications

This article describes how to enable and configure OpenTelemetry-based data collection to power the experiences within [Azure Monitor Application Insights](app-insights-overview.md#application-insights-overview). We walk through how to install the "Azure Monitor OpenTelemetry Distro". The Distro will [automatically collect](opentelemetry-add-modify.md#automatic-data-collection) traces, metrics, logs, and exceptions across your application and its dependencies. To learn more about collecting data using OpenTelemetry, see [Data Collection Basics](opentelemetry-overview.md) or [OpenTelemetry FAQ](/azure/azure-monitor/faq#opentelemetry).

## OpenTelemetry Release Status

OpenTelemetry offerings are available for .NET, Node.js, Python and Java applications.

|Language |Release Status                          |
|---------|----------------------------------------|
|Java     | :white_check_mark: <sup>[1](#GA)</sup> |
|.NET     | :warning: <sup>[2](#PREVIEW)</sup>     |
|Node.js  | :warning: <sup>[2](#PREVIEW)</sup>     |
|Python   | :warning: <sup>[2](#PREVIEW)</sup>     |

**Footnotes**
- <a name="GA"> :white_check_mark: 1</a>: OpenTelemetry is available to all customers with formal support.
- <a name="PREVIEW"> :warning: 2</a>: OpenTelemetry is available as a public preview. [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)

> [!NOTE] 
> For a feature-by-feature release status, see the [FAQ](../faq.yml#what-s-the-current-release-state-of-features-within-the-azure-monitor-opentelemetry-distro-).

## Get started

Follow the steps in this section to instrument your application with OpenTelemetry.

### Prerequisites

- An Azure subscription: [Create an Azure subscription for free](https://azure.microsoft.com/free/)
- An Application Insights resource: [Create an Application Insights resource](create-workspace-resource.md#create-a-workspace-based-resource)

<!---NOTE TO CONTRIBUTORS: PLEASE DO NOT SEPARATE OUT JAVASCRIPT AND TYPESCRIPT INTO DIFFERENT TABS.--->

### [ASP.NET Core](#tab/aspnetcore)

- Application using an officially supported version of [.NET Core](https://dotnet.microsoft.com/download/dotnet) or [.NET Framework](https://dotnet.microsoft.com/download/dotnet-framework) that's at least .NET Framework 4.6.2

### [.NET](#tab/net)

- Application using an officially supported version of [.NET Core](https://dotnet.microsoft.com/download/dotnet) or [.NET Framework](https://dotnet.microsoft.com/download/dotnet-framework) that's at least .NET Framework 4.6.2

### [Java](#tab/java)

- A Java application using Java 8+

### [Node.js](#tab/nodejs)

- Application using an officially [supported version](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/monitor/monitor-opentelemetry-exporter#currently-supported-environments) of Node.js runtime:
  - [OpenTelemetry supported runtimes](https://github.com/open-telemetry/opentelemetry-js#supported-runtimes)
  - [Azure Monitor OpenTelemetry Exporter supported runtimes](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/monitor/monitor-opentelemetry-exporter#currently-supported-environments)

### [Python](#tab/python)

- Python Application using Python 3.7+

---
> [!CAUTION]
> We have not tested the Azure Monitor OpenTelemetry Distro running side-by-side with the OpenTelemetry Community Package. We recommend you uninstall any OpenTelemetry-related packages before installing the Distro.

### Install the client library

#### [ASP.NET Core](#tab/aspnetcore)

Install the latest [Azure.Monitor.OpenTelemetry.AspNetCore](https://www.nuget.org/packages/Azure.Monitor.OpenTelemetry.AspNetCore) NuGet package:

```dotnetcli
dotnet add package --prerelease Azure.Monitor.OpenTelemetry.AspNetCore 
```

### [.NET](#tab/net)

Install the latest [Azure.Monitor.OpenTelemetry.Exporter](https://www.nuget.org/packages/Azure.Monitor.OpenTelemetry.Exporter) NuGet package:

```dotnetcli
dotnet add package --prerelease Azure.Monitor.OpenTelemetry.Exporter 
```

#### [Java](#tab/java)

Download the [applicationinsights-agent-3.4.15.jar](https://github.com/microsoft/ApplicationInsights-Java/releases/download/3.4.15/applicationinsights-agent-3.4.15.jar) file.

> [!WARNING]
>
> If you are upgrading from an earlier 3.x version, you may be impacted by changing defaults or slight differences in the data we collect. For more information, see the migration section in the release notes.
> [3.4.0](https://github.com/microsoft/ApplicationInsights-Java/releases/tag/3.4.0),
> [3.3.0](https://github.com/microsoft/ApplicationInsights-Java/releases/tag/3.3.0),
> [3.2.0](https://github.com/microsoft/ApplicationInsights-Java/releases/tag/3.2.0), and
> [3.1.0](https://github.com/microsoft/ApplicationInsights-Java/releases/tag/3.1.0)

#### [Node.js](#tab/nodejs)

Install these packages:

- [applicationinsights](https://www.npmjs.com/package/applicationinsights/v/beta)

```sh
npm install applicationinsights@beta
```

The following packages are also used for some specific scenarios described later in this article:

- [@opentelemetry/api](https://www.npmjs.com/package/@opentelemetry/api)
- [@opentelemetry/sdk-metrics](https://www.npmjs.com/package/@opentelemetry/sdk-metrics)
- [@opentelemetry/resources](https://www.npmjs.com/package/@opentelemetry/resources)
- [@opentelemetry/semantic-conventions](https://www.npmjs.com/package/@opentelemetry/semantic-conventions)
- [@opentelemetry/sdk-trace-base](https://www.npmjs.com/package/@opentelemetry/sdk-trace-base)

```sh
npm install @opentelemetry/api
npm install @opentelemetry/sdk-metrics
npm install @opentelemetry/resources
npm install @opentelemetry/semantic-conventions
npm install @opentelemetry/sdk-trace-base
```

#### [Python](#tab/python)

Install the latest [azure-monitor-opentelemetry](https://pypi.org/project/azure-monitor-opentelemetry/) PyPI package:

```sh
pip install azure-monitor-opentelemetry --pre
```

---

### Enable Azure Monitor Application Insights
To enable Azure Monitor Application Insights, you make a minor modification to your application and set your "Connection String". The Connection String tells your application where to send the telemetry the Distro collects, and it's unique to you.

#### Modify your Application

##### [ASP.NET Core](#tab/aspnetcore)

Add `UseAzureMonitor()` to your application startup. Depending on your version of .NET, it is in either your `startup.cs` or `program.cs` class.

```csharp
using Azure.Monitor.OpenTelemetry.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenTelemetry().UseAzureMonitor();

var app = builder.Build();

app.Run();
```

##### [.NET](#tab/net)

Add the Azure Monitor Exporter to each OpenTelemetry signal in application startup. Depending on your version of .NET, it is in either your `startup.cs` or `program.cs` class.
```csharp
var tracerProvider = Sdk.CreateTracerProviderBuilder()
    .AddAzureMonitorTraceExporter();

var metricsProvider = Sdk.CreateMeterProviderBuilder()
    .AddAzureMonitorMetricExporter();

var loggerFactory = LoggerFactory.Create(builder =>
{
    builder.AddOpenTelemetry(options =>
    {
        options.AddAzureMonitorLogExporter();
    });
});
```

> [!NOTE]
> For more information, see the [getting-started tutorial for OpenTelemetry .NET](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main#getting-started)

##### [Java](#tab/java)

Java autoinstrumentation is enabled through configuration changes; no code changes are required.

Point the JVM to the jar file by adding `-javaagent:"path/to/applicationinsights-agent-3.4.15.jar"` to your application's JVM args.

> [!TIP]
> For scenario-specific guidance, see [Get Started (Supplemental)](./java-get-started-supplemental.md).

> [!TIP]
> If you develop a Spring Boot application, you can optionally replace the JVM argument by a programmatic configuration. For more information, see [Using Azure Monitor Application Insights with Spring Boot](./java-spring-boot.md).

##### [Node.js](#tab/nodejs)

```javascript
const { ApplicationInsightsClient, ApplicationInsightsConfig } = require("applicationinsights");
const config = new ApplicationInsightsConfig();
const appInsights = new ApplicationInsightsClient(config);
```

##### [Python](#tab/python)

```python
from azure.monitor.opentelemetry import configure_azure_monitor
from opentelemetry import trace

configure_azure_monitor(
    connection_string="<Your Connection String>",
)

tracer = trace.get_tracer(__name__)

with tracer.start_as_current_span("hello"):
    print("Hello, World!")

input()

```

---

#### Copy the Connection String from your Application Insights Resource
> [!TIP]
> If you don't already have one, now is a great time to [Create an Application Insights Resource](create-workspace-resource.md#create-a-workspace-based-resource). Here's when we recommend you [create a new Application Insights Resource versus use an existing one](separate-resources.md#when-to-use-a-single-application-insights-resource).

To copy your unique Connection String:

:::image type="content" source="media/migrate-from-instrumentation-keys-to-connection-strings/migrate-from-instrumentation-keys-to-connection-strings.png" alt-text="Screenshot that shows Application Insights overview and connection string." lightbox="media/migrate-from-instrumentation-keys-to-connection-strings/migrate-from-instrumentation-keys-to-connection-strings.png":::

1. Go to the **Overview** pane of your Application Insights resource.
2. Find your **Connection String**.
3. Hover over the connection string and select the **Copy to clipboard** icon.

#### Paste the Connection String in your environment

To paste your Connection String, select from the following options:

  A. Set via Environment Variable (Recommended)
  
  Replace `<Your Connection String>` in the following command with *your* unique connection string.

   ```console
   APPLICATIONINSIGHTS_CONNECTION_STRING=<Your Connection String>
   ```

  B. Set via Configuration File - Java Only (Recommended)
  
  Create a configuration file named `applicationinsights.json`, and place it in the same directory as `applicationinsights-agent-3.4.15.jar` with the following content:
    
   ```json
   {
     "connectionString": "<Your Connection String>"
   }
   ```
  Replace `<Your Connection String>` in the preceding JSON with *your* unique connection string.

  C. Set via Code - ASP.NET Core, Node.js, and Python Only (Not recommended)
  
  See [Connection String Configuration](opentelemetry-configuration.md#connection-string) for example setting Connection String via code.

  > [!NOTE]
  > If you set the connection string in more than one place, we adhere to the following precendence:
  > 1. Code
  > 2. Environment Variable
  > 3. Configuration File

#### Confirm data is flowing

Run your application and open your **Application Insights Resource** tab in the Azure portal. It might take a few minutes for data to show up in the portal.

:::image type="content" source="media/opentelemetry/server-requests.png" alt-text="Screenshot of the Application Insights Overview tab with server requests and server response time highlighted.":::

That's it. Your application is now monitored by Application Insights. Everything else below is optional and available for further customization.

Not working? Check out the troubleshooting page for [ASP.NET Core](/troubleshoot/azure/azure-monitor/app-insights/opentelemetry-troubleshooting-dotnet), [Java](/troubleshoot/azure/azure-monitor/app-insights/opentelemetry-troubleshooting-java), [Node.js](/troubleshoot/azure/azure-monitor/app-insights/opentelemetry-troubleshooting-nodejs), or [Python](/troubleshoot/azure/azure-monitor/app-insights/opentelemetry-troubleshooting-python).

> [!IMPORTANT]
> If you have two or more services that emit telemetry to the same Application Insights resource, you're required to [set Cloud Role Names](opentelemetry-configuration.md#set-the-cloud-role-name-and-the-cloud-role-instance) to represent them properly on the Application Map.

As part of using Application Insights instrumentation, we collect and send diagnostic data to Microsoft. This data helps us run and improve Application Insights. To learn more, see [Statsbeat in Azure Application Insights](./statsbeat.md).

## Support

### [ASP.NET Core](#tab/aspnetcore)

- For Azure support issues, open an [Azure support ticket](https://azure.microsoft.com/support/create-ticket/).
- For OpenTelemetry issues, contact the [OpenTelemetry .NET community](https://github.com/open-telemetry/opentelemetry-dotnet) directly.
- For a list of open issues related to Azure Monitor Exporter, see the [GitHub Issues Page](https://github.com/Azure/azure-sdk-for-net/issues?q=is%3Aopen+is%3Aissue+label%3A%22Monitor+-+Exporter%22).

#### [.NET](#tab/net)

- For Azure support issues, open an [Azure support ticket](https://azure.microsoft.com/support/create-ticket/).
- For OpenTelemetry issues, contact the [OpenTelemetry .NET community](https://github.com/open-telemetry/opentelemetry-dotnet) directly.
- For a list of open issues related to Azure Monitor Exporter, see the [GitHub Issues Page](https://github.com/Azure/azure-sdk-for-net/issues?q=is%3Aopen+is%3Aissue+label%3A%22Monitor+-+Exporter%22).

### [Java](#tab/java)

- For Azure support issues, open an [Azure support ticket](https://azure.microsoft.com/support/create-ticket/).
- For help with troubleshooting, review the [troubleshooting steps](java-standalone-troubleshoot.md).
- For OpenTelemetry issues, contact the [OpenTelemetry community](https://opentelemetry.io/community/) directly.
- For a list of open issues related to Azure Monitor Java Autoinstrumentation, see the [GitHub Issues Page](https://github.com/microsoft/ApplicationInsights-Java/issues).

### [Node.js](#tab/nodejs)

- For Azure support issues, open an [Azure support ticket](https://azure.microsoft.com/support/create-ticket/).
- For OpenTelemetry issues, contact the [OpenTelemetry JavaScript community](https://github.com/open-telemetry/opentelemetry-js) directly.
- For a list of open issues related to Azure Monitor Exporter, see the [GitHub Issues Page](https://github.com/Azure/azure-sdk-for-js/issues?q=is%3Aopen+is%3Aissue+label%3A%22Monitor+-+Exporter%22).

### [Python](#tab/python)

- For Azure support issues, open an [Azure support ticket](https://azure.microsoft.com/support/create-ticket/).
- For OpenTelemetry issues, contact the [OpenTelemetry Python community](https://github.com/open-telemetry/opentelemetry-python) directly.
- For a list of open issues related to Azure Monitor Distro, see the [GitHub Issues Page](https://github.com/microsoft/ApplicationInsights-Python/issues/new).

---

## OpenTelemetry feedback

To provide feedback:

- Fill out the OpenTelemetry community's [customer feedback survey](https://docs.google.com/forms/d/e/1FAIpQLScUt4reClurLi60xyHwGozgM9ZAz8pNAfBHhbTZ4gFWaaXIRQ/viewform).
- Tell Microsoft about yourself by joining the [OpenTelemetry Early Adopter Community](https://aka.ms/AzMonOTel/).
- Engage with other Azure Monitor users in the [Microsoft Tech Community](https://techcommunity.microsoft.com/t5/azure-monitor/bd-p/AzureMonitor).
- Make a feature request at the [Azure Feedback Forum](https://feedback.azure.com/d365community/forum/3887dc70-2025-ec11-b6e6-000d3a4f09d0).

## Next steps

### [ASP.NET Core](#tab/aspnetcore)

- For details on adding and modifying Azure Monitor OpenTelemetry, see [Add and modify Azure Monitor OpenTelemetry](opentelemetry-add-modify.md)
- To further configure the OpenTelemetry distro, see [Azure Monitor OpenTelemetry configuration](opentelemetry-configuration.md)
- To review the source code, see the [Azure Monitor AspNetCore GitHub repository](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/monitor/Azure.Monitor.OpenTelemetry.AspNetCore).
- To install the NuGet package, check for updates, or view release notes, see the [Azure Monitor AspNetCore NuGet Package](https://www.nuget.org/packages/Azure.Monitor.OpenTelemetry.AspNetCore) page.
- To become more familiar with Azure Monitor and OpenTelemetry, see the [Azure Monitor Example Application](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/monitor/Azure.Monitor.OpenTelemetry.AspNetCore/tests/Azure.Monitor.OpenTelemetry.AspNetCore.Demo).
- To learn more about OpenTelemetry and its community, see the [OpenTelemetry .NET GitHub repository](https://github.com/open-telemetry/opentelemetry-dotnet).
- To enable usage experiences, [enable web or browser user monitoring](javascript.md).

#### [.NET](#tab/net)

- For details on adding and modifying Azure Monitor OpenTelemetry, see [Add and modify Azure Monitor OpenTelemetry](opentelemetry-add-modify.md)
- To further configure the OpenTelemetry distro, see [Azure Monitor OpenTelemetry configuration](opentelemetry-configuration.md)
- To review the source code, see the [Azure Monitor Exporter GitHub repository](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/monitor/Azure.Monitor.OpenTelemetry.Exporter).
- To install the NuGet package, check for updates, or view release notes, see the [Azure Monitor Exporter NuGet Package](https://www.nuget.org/packages/Azure.Monitor.OpenTelemetry.Exporter) page.
- To become more familiar with Azure Monitor and OpenTelemetry, see the [Azure Monitor Example Application](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/monitor/Azure.Monitor.OpenTelemetry.Exporter/tests/Azure.Monitor.OpenTelemetry.Exporter.Demo).
- To learn more about OpenTelemetry and its community, see the [OpenTelemetry .NET GitHub repository](https://github.com/open-telemetry/opentelemetry-dotnet).
- To enable usage experiences, [enable web or browser user monitoring](javascript.md).

### [Java](#tab/java)

- For details on adding and modifying Azure Monitor OpenTelemetry, see [Add and modify Azure Monitor OpenTelemetry](opentelemetry-add-modify.md)
- Review [Java autoinstrumentation configuration options](java-standalone-config.md).
- To review the source code, see the [Azure Monitor Java autoinstrumentation GitHub repository](https://github.com/Microsoft/ApplicationInsights-Java).
- To learn more about OpenTelemetry and its community, see the [OpenTelemetry Java GitHub repository](https://github.com/open-telemetry/opentelemetry-java-instrumentation).
- To enable usage experiences, see [Enable web or browser user monitoring](javascript.md).
- See the [release notes](https://github.com/microsoft/ApplicationInsights-Java/releases) on GitHub.

### [Node.js](#tab/nodejs)

- For details on adding and modifying Azure Monitor OpenTelemetry, see [Add and modify Azure Monitor OpenTelemetry](opentelemetry-add-modify.md)
- To review the source code, see the [Application Insights Beta GitHub repository](https://github.com/microsoft/ApplicationInsights-node.js/tree/beta).
- To install the npm package and check for updates see the [applicationinsights npm Package](https://www.npmjs.com/package/applicationinsights/v/beta) page.
- To become more familiar with Azure Monitor Application Insights and OpenTelemetry, see the [Azure Monitor Example Application](https://github.com/Azure-Samples/azure-monitor-opentelemetry-node.js).
- To learn more about OpenTelemetry and its community, see the [OpenTelemetry JavaScript GitHub repository](https://github.com/open-telemetry/opentelemetry-js).
- To enable usage experiences, [enable web or browser user monitoring](javascript.md).

### [Python](#tab/python)

- For details on adding and modifying Azure Monitor OpenTelemetry, see [Add and modify Azure Monitor OpenTelemetry](opentelemetry-add-modify.md)
- To review the source code and extra documentation, see the [Azure Monitor Distro GitHub repository](https://github.com/microsoft/ApplicationInsights-Python/blob/main/azure-monitor-opentelemetry/README.md).
- To see extra samples and use cases, see [Azure Monitor Distro samples](https://github.com/microsoft/ApplicationInsights-Python/tree/main/azure-monitor-opentelemetry/samples).
- See the [release notes](https://github.com/microsoft/ApplicationInsights-Python/releases) on GitHub.
- To install the PyPI package, check for updates, or view release notes, see the [Azure Monitor Distro PyPI Package](https://pypi.org/project/azure-monitor-opentelemetry/) page.
- To become more familiar with Azure Monitor Application Insights and OpenTelemetry, see the [Azure Monitor Example Application](https://github.com/Azure-Samples/azure-monitor-opentelemetry-python).
- To learn more about OpenTelemetry and its community, see the [OpenTelemetry Python GitHub repository](https://github.com/open-telemetry/opentelemetry-python).
- To see available OpenTelemetry instrumentations and components, see the [OpenTelemetry Contributor Python GitHub repository](https://github.com/open-telemetry/opentelemetry-python-contrib).
- To enable usage experiences, [enable web or browser user monitoring](javascript.md).

---
