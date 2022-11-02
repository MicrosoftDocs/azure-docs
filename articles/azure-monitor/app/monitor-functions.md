---
title: Monitor applications running on Azure Functions with Application Insights - Azure Monitor | Microsoft Docs
description: Azure Monitor seamlessly integrates with your application running on Azure Functions, and allows you to monitor the performance and spot the problems with your apps in no time.
ms.topic: conceptual
ms.date: 08/27/2021
ms.reviewer: abinetabate
---

# Monitoring Azure Functions with Azure Monitor Application Insights

[Azure Functions](../../azure-functions/functions-overview.md) offers built-in integration with Azure Application Insights to monitor functions. For languages other than .NET and .NETCore additional language-specific workers/extensions are needed to get the full benefits of distributed tracing. 

Application Insights collects log, performance, and error data, and automatically detects performance anomalies. Application Insights includes powerful analytics tools to help you diagnose issues and to understand how your functions are used. When you have the visibility into your application data, you can continuously improve performance and usability. You can even use Application Insights during local function app project development. 

The required Application Insights instrumentation is built into Azure Functions. The only thing you need is a valid instrumentation key to connect your function app to an Application Insights resource. The instrumentation key should be added to your application settings when your function app resource is created in Azure. If your function app doesn't already have this key, you can set it manually. For more information read more about [monitoring Azure Functions](../../azure-functions/functions-monitoring.md?tabs=cmd).

For a complete list of supported auto-instrumentation scenarios, see [Supported environments, languages, and resource providers](codeless-overview.md#supported-environments-languages-and-resource-providers).

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

## Distributed tracing for Java applications (public preview)

> [!IMPORTANT]
> This feature is currently in public preview for Java Azure Functions both Windows and Linux

If your applications are written in Java you can view richer data from your functions applications, including requests, dependencies, logs, and metrics. The additional data also lets you see and diagnose end-to-end transactions and see the application map, which aggregates many transactions to show a topological view of how the systems interact, and what the average performance and error rates are.

The end-to-end diagnostics and the application map provide visibility into one single transaction/request. Together these two features are helpful for finding the root cause of reliability issues and performance bottlenecks on a per request basis.

### How to enable distributed tracing for Java Function apps

Navigate to the functions app Overview blade and go to configurations. Under Application Settings, click "+ New application setting". 

> [!div class="mx-imgBorder"]
> ![Under Settings, add new application settings](./media//functions/create-new-setting.png)

Add the following application settings with below values, then click Save on the upper left. DONE!

#### Windows
```
XDT_MicrosoftApplicationInsights_Java -> 1
ApplicationInsightsAgent_EXTENSION_VERSION -> ~2
```
> [!IMPORTANT]
> This feature will have a cold start implication of 8-9 seconds in the Windows Consumption plan.

#### Linux Dedicated/Premium
```
ApplicationInsightsAgent_EXTENSION_VERSION -> ~3
```

#### Linux Consumption
```
APPLICATIONINSIGHTS_ENABLE_AGENT: true
```

### Troubleshooting

* Sometimes the latest version of the Application Insights Java agent is not
  available in Azure Function - it takes a few months for the latest versions to
  roll out to all regions. In case you need the latest version of Java agent to
  monitor your app in Azure Function to use a specific version of Application
  Insights Java Auto-instrumentation Agent, you can upload the agent manually:
   
  Please follow this [instruction](https://github.com/Azure/azure-functions-java-worker/wiki/Distributed-Tracing-for-Java-Azure-Functions#customize-distribute-agent).

[!INCLUDE [azure-monitor-app-insights-test-connectivity](../../../includes/azure-monitor-app-insights-test-connectivity.md)]

## Distributed tracing for Python Function apps

To collect custom telemetry from services such as Redis, Memcached, MongoDB, and more, you can use the [OpenCensus Python Extension](https://github.com/census-ecosystem/opencensus-python-extensions-azure) and [log your telemetry](../../azure-functions/functions-reference-python.md?tabs=azurecli-linux%2capplication-level#log-custom-telemetry). You can find the list of supported services [here](https://github.com/census-instrumentation/opencensus-python/tree/master/contrib).

## Next Steps

* Read more instructions and information about monitoring [Monitoring Azure Functions](../../azure-functions/functions-monitoring.md)
* Get an overview of [Distributed Tracing](./distributed-tracing.md)
* See what [Application Map](./app-map.md?tabs=net) can do for your business
* Read about [requests and dependencies for Java apps](./java-in-process-agent.md)
* Learn more about [Azure Monitor](../overview.md) and [Application Insights](./app-insights-overview.md)
