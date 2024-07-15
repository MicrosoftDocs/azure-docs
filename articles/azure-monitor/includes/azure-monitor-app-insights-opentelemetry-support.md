---
author: AaronMaxwell
ms.author: aaronmax
ms.service: azure-monitor
ms.topic: include
ms.date: 08/26/2023
---

## Troubleshooting

### [ASP.NET Core](#tab/aspnetcore)

#### Step 1: Enable diagnostic logging

The Azure Monitor Exporter uses EventSource for its internal logging. The exporter logs are available to any EventListener by opting in to the source that's named `OpenTelemetry-AzureMonitor-Exporter`. For troubleshooting steps, see [OpenTelemetry Troubleshooting](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry#troubleshooting) on GitHub.

#### Step 2: Test connectivity between your application host and the ingestion service

Application Insights SDKs and agents send telemetry to get ingested as REST calls at our ingestion endpoints. To test connectivity from your web server or application host computer to the ingestion service endpoints, use cURL commands or raw REST requests from PowerShell. For more information, see [Troubleshoot missing application telemetry in Azure Monitor Application Insights](/troubleshoot/azure/azure-monitor/app-insights/telemetry/investigate-missing-telemetry).

#### Known issues

The following items are known issues for the Azure Monitor OpenTelemetry Exporters:

- The operation name is missing from dependency telemetry. The missing operation name causes failures and adversely affects performance tab experience.

- The device model is missing from request and dependency telemetry. The missing device model adversely affects device cohort analysis.

### [.NET](#tab/net)

#### Step 1: Enable diagnostic logging

The Azure Monitor Exporter uses EventSource for its internal logging. The exporter logs are available to any EventListener by opting in to the source that's named `OpenTelemetry-AzureMonitor-Exporter`. For troubleshooting steps, see [OpenTelemetry Troubleshooting](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry#troubleshooting) on GitHub.

#### Step 2: Test connectivity between your application host and the ingestion service

Application Insights SDKs and agents send telemetry to get ingested as REST calls at our ingestion endpoints. To test connectivity from your web server or application host computer to the ingestion service endpoints, use cURL commands or raw REST requests from PowerShell. For more information, see [Troubleshoot missing application telemetry in Azure Monitor Application Insights](/troubleshoot/azure/azure-monitor/app-insights/telemetry/investigate-missing-telemetry).

#### Known issues

The following items are known issues for the Azure Monitor OpenTelemetry Exporters:

- The operation name is missing from dependency telemetry. The missing operation name causes failures and adversely affects performance tab experience.

- The device model is missing from request and dependency telemetry. The missing device model adversely affects device cohort analysis.

### [Java](#tab/java)

#### Step 1: Enable diagnostic logging

By default, diagnostic logging is enabled in Azure Monitor Application Insights. For more information, see [Troubleshoot guide: Azure Monitor Application Insights for Java](/troubleshoot/azure/azure-monitor/app-insights/telemetry/java-standalone-troubleshoot).

#### Step 2: Test connectivity between your application host and the ingestion service

Application Insights SDKs and agents send telemetry to get ingested as REST calls at our ingestion endpoints. To test connectivity from your web server or application host computer to the ingestion service endpoints, use cURL commands or raw REST requests from PowerShell. For more information, see [Troubleshoot missing application telemetry in Azure Monitor Application Insights](/troubleshoot/azure/azure-monitor/app-insights/telemetry/investigate-missing-telemetry).

#### Known issues

- If you [download the Application Insights client library for installation](/azure/azure-monitor/app/opentelemetry-enable?tabs=java#install-the-client-libraries) from a browser, sometimes the downloaded JAR file is corrupted and is about half the size of the source file. If you experience this problem, download the JAR file by running the [curl](https://curl.se) or [wget](https://www.gnu.org/software/wget/) command, as shown in the following example command calls:

  ```bash
  curl --location --output applicationinsights-agent-3.4.11.jar https://github.com/microsoft/ApplicationInsights-Java/releases/download/3.4.11/applicationinsights-agent-3.4.11.jar
  ```

  ```bash
  wget --output-document=applicationinsights-agent-3.4.11.jar https://github.com/microsoft/ApplicationInsights-Java/releases/download/3.4.11/applicationinsights-agent-3.4.11.jar
  ```

  > [!NOTE]  
  > The example command calls apply to Application Insights for Java version 3.4.11. To find the version number and URL address of the current release of Application Insights for Java, see <https://github.com/microsoft/ApplicationInsights-Java/releases>.

### [Java native](#tab/java-native)


The following steps are applicable to Spring Boot native applications.

#### Step 1: Verify the OpenTelemetry version

You might notice the following message during the application startup:

```output
WARN  c.a.m.a.s.OpenTelemetryVersionCheckRunner - The OpenTelemetry version is not compatible with the spring-cloud-azure-starter-monitor dependency.
The OpenTelemetry version should be <version>
```

In this case, you have to import the OpenTelemetry Bills of Materials
by following the OpenTelemetry documentation in the [Spring Boot starter](https://opentelemetry.io/docs/zero-code/java/spring-boot-starter/getting-started/).

#### Step 2: Enable self-diagnostics

If something doesn't work as expected, you can enable self-diagnostics at the `DEBUG` level to get some insights. To do so, set the self-diagnostics level to `ERROR`, `WARN`, `INFO`, `DEBUG`, or `TRACE` by using the `APPLICATIONINSIGHTS_SELF_DIAGNOSTICS_LEVEL` environment variable.

To enable self-diagnostics at the `DEBUG` level when running a docker container, run the following command:

```console
docker run -e APPLICATIONINSIGHTS_SELF_DIAGNOSTICS_LEVEL=DEBUG <image-name>
```

> [!NOTE]
> Replace *`<image-name>`* with the docker image name accordingly.

**Third-party information disclaimer**

The third-party products that this article discusses are manufactured by companies that are independent of Microsoft. Microsoft makes no warranty, implied or otherwise, about the performance or reliability of these products.

### [Node.js](#tab/nodejs)

#### Step 1: Enable diagnostic logging

Azure Monitor Exporter uses the OpenTelemetry API logger for internal logs. To enable the logger, run the following code snippet:

```javascript
const { diag, DiagConsoleLogger, DiagLogLevel } = require("@opentelemetry/api");
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");

const provider = new NodeTracerProvider();
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ALL);
provider.register();
```

#### Step 2: Test connectivity between your application host and the ingestion service

Application Insights SDKs and agents send telemetry to get ingested as REST calls at our ingestion endpoints. To test connectivity from your web server or application host computer to the ingestion service endpoints, use cURL commands or raw REST requests from PowerShell. For more information, see [Troubleshoot missing application telemetry in Azure Monitor Application Insights](/troubleshoot/azure/azure-monitor/app-insights/telemetry/investigate-missing-telemetry).

#### Known issues

The following items are known issues for the Azure Monitor OpenTelemetry Exporters:

- The operation name is missing from dependency telemetry. The missing operation name causes failures and adversely affects performance tab experience.

- The device model is missing from request and dependency telemetry. The missing device model adversely affects device cohort analysis.

- The database server name is missing from the dependency name. Because the database server name isn't included, OpenTelemetry Exporters incorrectly aggregate tables that have the same name onto different servers.

### [Python](#tab/python)

#### Step 1: Enable diagnostic logging

The Microsoft Azure Monitor Exporter uses the [Python standard logging library](https://docs.python.org/3/library/logging.html) for its internal logging. OpenTelemetry API and Azure Monitor Exporter logs are assigned a severity level of `WARNING` or `ERROR` for irregular activity. The `INFO` severity level is used for regular or successful activity.

By default, the Python logging library sets the severity level to `WARNING`. Therefore, you must change the severity level to see logs under this severity setting. The following example code shows how to output logs of all severity levels to the console and a file:

```python
...
import logging

logging.basicConfig(format = "%(asctime)s:%(levelname)s:%(message)s", level = logging.DEBUG)

logger = logging.getLogger(__name__)
file = logging.FileHandler("example.log")
stream = logging.StreamHandler()
logger.addHandler(file)
logger.addHandler(stream)
...
```

#### Step 2: Test connectivity between your application host and the ingestion service

Application Insights SDKs and agents send telemetry to get ingested as REST calls at our ingestion endpoints. To test connectivity from your web server or application host computer to the ingestion service endpoints, use cURL commands or raw REST requests from PowerShell. For more information, see [Troubleshoot missing application telemetry in Azure Monitor Application Insights](/troubleshoot/azure/azure-monitor/app-insights/telemetry/investigate-missing-telemetry).

#### Step 3: Avoid duplicate telemetry

Duplicate telemetry is often caused if you create multiple instances of processors or exporters. Make sure that you run only one exporter and processor at a time for each telemetry pillar (logs, metrics, and distributed tracing).

The following sections describe scenarios that can cause duplicate telemetry.

##### Duplicate trace logs in Azure Functions

If you see a pair of entries for each trace log within Application Insights, you probably enabled the following types of logging instrumentation:

- The native logging instrumentation in Azure Functions
- The `azure-monitor-opentelemetry` logging instrumentation within the distribution

To prevent duplication, you can disable the distribution's logging, but leave the native logging instrumentation in Azure Functions enabled. To do this, set the `OTEL_LOGS_EXPORTER` environment variable to `None`.

##### Duplicate telemetry in "Always On" Azure Functions

If the **Always On** setting in Azure Functions is set to **On**, Azure Functions keeps some processes running in the background after each run is complete. For instance, suppose that you have a five-minute timer function that calls `configure_azure_monitor` each time. After 20 minutes, you then might have four metric exporters that are running at the same time. This situation might be the source of your duplicate metrics telemetry.

In this situation, either set the **Always On** setting to **Off**, or try manually shutting down the providers between each `configure_azure_monitor` call. To shut down each provider, run shutdown calls for each current meter, tracer, and logger provider, as shown in the following code:

```python
get_meter_provider().shutdown()
get_tracer_provider().shutdown()
get_logger_provider().shutdown()
```

##### Azure Workbooks and Jupyter Notebooks

Azure Workbooks and Jupyter Notebooks might keep exporter processes running in the background. To prevent duplicate telemetry, clear the cache before you make more calls to `configure_azure_monitor`.

#### Step 4: Make sure that Flask request data is collected

If you implement a Flask application, you might find that you can't collect Requests table data from Application Insights while you use the [Azure Monitor OpenTelemetry Distro client library for Python](/python/api/overview/azure/monitor-opentelemetry-readme). This issue could occur if you don't structure your `import` declarations correctly. You might be importing the `flask.Flask` web application framework before you call the `configure_azure_monitor` function to instrument the Flask library. For example, the following code doesn't successfully instrument the Flask app:

```python
from azure.monitor.opentelemetry import configure_azure_monitor
from flask import Flask

configure_azure_monitor()

app = Flask(__name__)
```

Instead, we recommend that you import the `flask` module as a whole, and then call `configure_azure_monitor` to configure OpenTelemetry to use Azure Monitor before you access `flask.Flask`:

```python
from azure.monitor.opentelemetry import configure_azure_monitor
import flask

configure_azure_monitor()

app = flask.Flask(__name__)
```

Alternatively, you can call `configure_azure_monitor` before you import `flask.Flask`:

```python
from azure.monitor.opentelemetry import configure_azure_monitor

configure_azure_monitor()

from flask import Flask

app = Flask(__name__)
```

---

## Support

Select a tab for the language of your choice to discover support options.

### [ASP.NET Core](#tab/aspnetcore)

- For Azure support issues, open an [Azure support ticket](https://azure.microsoft.com/support/create-ticket/).
- For OpenTelemetry issues, contact the [OpenTelemetry .NET community](https://github.com/open-telemetry/opentelemetry-dotnet) directly.
- For a list of open issues related to Azure Monitor Exporter, see the [GitHub Issues Page](https://github.com/Azure/azure-sdk-for-net/issues?q=is%3Aopen+is%3Aissue+label%3A%22Monitor+-+Exporter%22).

### [.NET](#tab/net)

- For Azure support issues, open an [Azure support ticket](https://azure.microsoft.com/support/create-ticket/).
- For OpenTelemetry issues, contact the [OpenTelemetry .NET community](https://github.com/open-telemetry/opentelemetry-dotnet) directly.
- For a list of open issues related to Azure Monitor Exporter, see the [GitHub Issues Page](https://github.com/Azure/azure-sdk-for-net/issues?q=is%3Aopen+is%3Aissue+label%3A%22Monitor+-+Exporter%22).

### [Java](#tab/java)

- For Azure support issues, open an [Azure support ticket](https://azure.microsoft.com/support/create-ticket/).
- For help with troubleshooting, review the [troubleshooting steps](/troubleshoot/azure/azure-monitor/app-insights/java-standalone-troubleshoot).
- For OpenTelemetry issues, contact the [OpenTelemetry community](https://opentelemetry.io/community/) directly.
- For a list of open issues related to Azure Monitor Java Autoinstrumentation, see the [GitHub Issues Page](https://github.com/microsoft/ApplicationInsights-Java/issues).

### [Java native](#tab/java-native)

- For Azure support issues, open an [Azure support ticket](https://azure.microsoft.com/support/create-ticket/).
- For OpenTelemetry issues, contact the [OpenTelemetry community](https://opentelemetry.io/community/) directly.
- For a list of open issues with Spring Boot native applications, see the [GitHub Issues Page](https://github.com/Azure/azure-sdk-for-java/issues?q=is%3Aopen+is%3Aissue+label%3A%22Spring+Monitor%22).
- For a list of open issues with Quarkus native applications, see the [GitHub Issues Page](https://github.com/quarkiverse/quarkus-opentelemetry-exporter).

### [Node.js](#tab/nodejs)

- For Azure support issues, open an [Azure support ticket](https://azure.microsoft.com/support/create-ticket/).
- For OpenTelemetry issues, contact the [OpenTelemetry JavaScript community](https://github.com/open-telemetry/opentelemetry-js) directly.
- For a list of open issues related to Azure Monitor Exporter, see the [GitHub Issues Page](https://github.com/Azure/azure-sdk-for-js/issues?q=is%3Aopen+is%3Aissue+label%3A%22Monitor+-+Exporter%22).

### [Python](#tab/python)

- For Azure support issues, open an [Azure support ticket](https://azure.microsoft.com/support/create-ticket/).
- For OpenTelemetry issues, contact the [OpenTelemetry Python community](https://github.com/open-telemetry/opentelemetry-python) directly.
- For a list of open issues related to Azure Monitor Distro, see the [GitHub Issues Page](https://github.com/Azure/azure-sdk-for-python/issues/new/choose).

---

## OpenTelemetry feedback

To provide feedback:

- Fill out the OpenTelemetry community's [customer feedback survey](https://docs.google.com/forms/d/e/1FAIpQLScUt4reClurLi60xyHwGozgM9ZAz8pNAfBHhbTZ4gFWaaXIRQ/viewform).
- Tell Microsoft about yourself by joining the [OpenTelemetry Early Adopter Community](https://aka.ms/AzMonOTel/).
- Engage with other Azure Monitor users in the [Microsoft Tech Community](https://techcommunity.microsoft.com/t5/azure-monitor/bd-p/AzureMonitor).
- Make a feature request at the [Azure Feedback Forum](https://feedback.azure.com/d365community/forum/3887dc70-2025-ec11-b6e6-000d3a4f09d0).
