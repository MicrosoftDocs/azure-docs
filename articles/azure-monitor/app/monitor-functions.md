---
title: Monitor applications running on Azure Functions with Application Insights - Azure Monitor | Microsoft Docs
description: Azure Monitor integrates with your Azure Functions application, allowing performance monitoring and quickly identifying problems.
ms.topic: conceptual
ms.date: 11/14/2022
ms.reviewer: abinetabate
---

# Monitoring Azure Functions with Azure Monitor Application Insights

[Azure Functions](../../azure-functions/functions-overview.md) offers built-in integration with Azure Application Insights to monitor functions. For languages other than .NET and .NET Core, other language-specific workers/extensions are needed to get the full benefits of distributed tracing. 

Application Insights collects log, performance, and error data, and automatically detects performance anomalies. Application Insights includes powerful analytics tools to help you diagnose issues and to understand how your functions are used. When you have the visibility into your application data, you can continuously improve performance and usability. You can even use Application Insights during local function app project development. 

The required Application Insights instrumentation is built into Azure Functions. The only thing you need is a valid instrumentation key to connect your function app to an Application Insights resource. The instrumentation key should be added to your application settings when your function app resource is created in Azure. If your function app doesn't already have this key, you can set it manually. For more information, read more about [monitoring Azure Functions](../../azure-functions/functions-monitoring.md?tabs=cmd).

For a complete list of supported auto-instrumentation scenarios, see [Supported environments, languages, and resource providers](codeless-overview.md#supported-environments-languages-and-resource-providers).

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

## Distributed tracing for Java applications (public preview)

> [!IMPORTANT]
> This feature is currently in public preview for Java Azure Functions both Windows and Linux

> [!Note]
> This feature used to have a 8-9 second cold startup implication, which has been reduced to less than 1 sec. If you were an early adopter of this feature (i.e. prior to Feb 2023), then review the troubleshooting section to update to the current version and benefit from the new faster startup.

To view more data from your Java-based Azure Functions applications than is [collected by default](../../azure-functions/functions-monitoring.md?tabs=cmd), you can enable the [Application Insights Java 3.x agent](./java-in-process-agent.md). This agent allows Application Insights to automatically collect and correlate dependencies, logs, and metrics from popular libraries and Azure SDKs, in addition to the request telemetry already captured by Functions.

By using the application map and having a more complete view of end-to-end transactions, you can better diagnose issues and see a topological view of how systems interact, along with data on average performance and error rates. You have more data for end-to-end diagnostics and the ability to use the application map to easily find the root cause of reliability issues and performance bottlenecks on a per request basis.

For more advanced use cases, you're able to modify telemetry (add spans, update span status, add span attributes) or send custom telemetry using standard APIs.

### How to enable distributed tracing for Java Function apps

Navigate to the functions app Overview pane and go to configurations. Under Application Settings, select "+ New application setting". 

> [!div class="mx-imgBorder"]
> ![Under Settings, add new application settings](./media//functions/create-new-setting.png)

Add the following application settings with below values, then select Save on the upper left. DONE!

```
APPLICATIONINSIGHTS_ENABLE_AGENT: true
```

### Troubleshooting

Your Java Functions may have slow startup times if you adopted this feature before Feb 2023. Follow the steps to fix the issue.
    #### Windows
    1. Check to see if the following settings exist and remove them.

        ```
        XDT_MicrosoftApplicationInsights_Java -> 1
        ApplicationInsightsAgent_EXTENSION_VERSION -> ~2
        ```
    
    2. Enable the latest version by adding this setting.

        ```
        APPLICATIONINSIGHTS_ENABLE_AGENT: true
        ```
    
    #### Linux Dedicated/Premium
    1. Check to see if the following settings exist and remove it.
    
        ```
        ApplicationInsightsAgent_EXTENSION_VERSION -> ~3
        ```
    
    2. Enable the latest version by adding this setting.

        ```
        APPLICATIONINSIGHTS_ENABLE_AGENT: true
        ```

* Sometimes the latest version of the Application Insights Java agent isn't available in Azure Function - it takes a few months for the latest versions to roll out to all regions. In case you need the latest version of Java agent to monitor your app in Azure Function to use a specific version of Application Insights Java Auto-instrumentation Agent, you can upload the agent manually:

    Follow this [instruction](https://github.com/Azure/azure-functions-java-worker/wiki/Distributed-Tracing-for-Java-Azure-Functions#customize-distribute-agent).

[!INCLUDE [azure-monitor-app-insights-test-connectivity](../../../includes/azure-monitor-app-insights-test-connectivity.md)]

## Distributed tracing for Python Function apps

To collect custom telemetry from services such as Redis, Memcached, MongoDB, and more, you can use the [OpenCensus Python Extension](https://github.com/census-ecosystem/opencensus-python-extensions-azure) and [log your telemetry](../../azure-functions/functions-reference-python.md?tabs=azurecli-linux%2capplication-level#log-custom-telemetry). You can find the list of supported services [here](https://github.com/census-instrumentation/opencensus-python/tree/master/contrib).

## Next Steps

* Read more instructions and information about monitoring [Monitoring Azure Functions](../../azure-functions/functions-monitoring.md)
* Get an overview of [Distributed Tracing](./distributed-tracing.md)
* See what [Application Map](./app-map.md?tabs=net) can do for your business
* Read about [requests and dependencies for Java apps](./java-in-process-agent.md)
* Learn more about [Azure Monitor](../overview.md) and [Application Insights](./app-insights-overview.md)