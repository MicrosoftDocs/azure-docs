---
title: Collect and read OpenTelemetry data in Azure Container Apps (preview)
description: Learn to record and query data collected using OpenTelemetry in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.date: 02/07/2024
ms.author: cshoe
---

# Collect and read OpenTelemetry data in Azure Container Apps (preview)

Using an OpenTelemetry (OTel) data collector with your Azure Container Apps environment, you can send observability data in OpenTelemetry format to:

- Azure App Insights
- Datadog
- Any OTLP-configured endpoint

The following table shows you what type of data you can send to each destination:

| Destination | Logs | Metrics | Traces |
|---|------|---------|--------|
| [Azure App Insights](/azure/azure-monitor/app/app-insights-overview) | Yes | Yes | Yes |
| [Datadog](https://datadoghq.com/) | No | Yes | Yes |
| [OpenTelemetry](https://opentelemetry.io/) protocol (OTLP) configured endpoint | Yes | Yes | Yes |

Through simple configuration settings, the Container Apps OTel collector makes it easy for you to:

- Send data to one or multiple destinations
- Switch collection destinations

This article shows you how to setup and configure an OTel collector for your container app.

## Set up a collector

Setting up a collector is a two step process. The first step is to create an instance of the destination service to accept data from your container app. For instance, if you want to send data to Azure Application Insights, you first need to create an App Insights instance.

The second step is to configure your container app to send data to the destination.

The following examples show how to configure your container app to send telemetry data to different collectors.

## Azure App Insights

The only configuration detail required from Application Insights is the connection string. Once you have the connection string, you can configure the collector via your container app's ARM template or with Azure CLI commands.

# [ARM template](#tab/)

```json
{
  ...
  "properties": {
    ...
    "openTelemetryConfiguration": {
      ...
      "destinationsConfiguration": {
        "appInsightsConfiguration ": {  
          "connectionString": "<YOUR_APP_INSIGHTS_CONNECTION_STRING>"
        }
      }
    }
  }
}
```

# [Azure CLI](#tab/azure-cli)

TODO

---

## Datadog

The Datadog collector configuration requires a value for `site` and `key` from your Datadog instance. Gather these values from your Datadog instance according to this table:

| Datadog agent property | Container Apps configuration property |
|---|---|
| `DD_SITE` | `site` |
| `DD_API_KEY` | `key` |

Once you have these configuration details, you can configure the collector via your container app's ARM template or with Azure CLI commands.

# [ARM template](#tab/arm)

```json
{
  ...
  "properties": {
    ...
    "openTelemetryConfiguration": {
      ...
      "destinationsConfiguration": {
        "dataDogConfiguration": { 
          "site": "<YOUR_DATADOG_SUBDOMAIN>.datadoghq.com",
          "key": "<YOUR_DATADOG_KEY>"
        }
      }
    }
  }
}
```

# [Azure CLI](#tab/azure-cli)

TODO

---

## OLTP endpoint

An OpenTelemetry protocol (OTLP) endpoint is a telemetry data destination that consumes OpenTelemery data. You can use existing solutions that support OTLP, or develop your own according to the OpenTelemetry protocol.

While you can set up as many OTLP-configured endpoints as you like, each endpoint must be distinct.

# [ARM template](#tab/arm)

```json
{
  ...
  "openTelemetryConfiguration": {
    ...
    "destinationsConfiguration": {
      "otlpConfigurations": [ 
        { 
          "name": "<YOUR_CONFIGURATION_NAME>", 
          "endpoint": "<YOUR_ENDPOINT_URL>", 
          "header": "<YOUR_HEADER_VALUE>",
          "insecure": "true"
        } 
      ]
    }
  }
}
```

| Name | Description |
|---|---|
| `name` |  |
| `endpoint` |  |
| `header` |  |
| `insecure` |  |

# [Azure CLI](#tab/azure-cli)

TODO

---

## Restrictions

Keep in mind the following restrictions as you use an OTel collector in your container app:

- You can only set up one Application Insights and Datadog endpoint at a time.
- While you can define more than one OTLP-configured endpoint, each one must be distinct.

## Configure what data is collected

The OTel collector divides data up into the following categories:

- Traces
- Metrics
- Logs

You can send each type of data to different locations, but you can also choose not to send one of the data categories a collector.

To configure a collector, use the `destinations` array to define which collectors your application sends data. Valid keys are either `appInsights`, `dataDog`, or the name of your custom OTLP endpoint.

The following example shows how to use an OTLP endpoint named `aspiredashboard`.

```json
{
  ...
  "properties": {
    ...
    "openTelemetryConfiguration": {
      ...
      "tracesConfiguration": {
        "destinations": [
          "appInsights",
          "aspiredashboard"
        ]
      },
      "logsConfiguration": {
        "destinations": [
          "appInsights",
          "aspiredashboard"
        ]
      },
      "metricsConfiguration": {
        "destinations": [
          "dataDog",
          "aspiredashboard"
        ]
      }
    }
  }
}
```

## Collect system data

System data is made up of data exposed by the Container Apps environment, not data in a specific container app.

- You can only access system data through Dapr.

- By default Dapr traces aren't included in trace data, by you can include it by setting `--include-dapr-traces` to `true`.

TODO

## Example OTel configuration

The following example show how you might configure your container app to collect telemetry data using Azure Application Insights, Datadog, and with a custom OTLP collector named `aspiredashboard`.

```json
{
  "location": "eastus",
  "properties": {
    "appInsightsConfiguration": {
      "connectionString": "<APP_INSIGHTS_CONNECTION_STRING>"
    },
    "openTelemetryConfiguration": {
      "includeSystemTelemetry": true,
      "destinationsConfiguration": {
        "dataDogConfiguration": {
          "site": "datadoghq.com",
          "key": "<DATADOG_KEY>"
        },
        "otlpConfigurations": [
          {
            "name": "aspiredashboard",
            "endpoint": "<OLTP_ENDPOINT_URI>",
            "insecure": true
          }
        ]
      },
      "tracesConfiguration": {
        "destinations": [
          "appInsights",
          "aspiredashboard"
        ]
      },
      "logsConfiguration": {
        "destinations": [
          "appInsights",
          "aspiredashboard"
        ]
      },
      "metricsConfiguration": {
        "destinations": [
          "dataDog",
          "aspiredashboard"
        ]
      }
    }
  }
}
```

## Send data from your app to an OTel collector

| Type | Details |
|---|---|
| Logs | Define a collector in the `logsConfiguration` destinations array. |
| Metrics | Define a collector in the `metricsConfiguration` destinations array. |
| System traces | Define a collector in the `tracesConfiguration` destinations array. |
| Custom traces| Define custom collector in the `otlpConfigurations` section, and include the name in the `tracesConfiguration` destinations array. |
| System data | Set `IncludeSystemTelemetry` to `true` in the `openTelemetryConfiguration` section. |
| Dapr traces | Set `IncludeSystemTelemetry` to `true` in the `openTelemetryConfiguration` section. If you plan to use an OTel collector to send your Dapr data to a custom OTel endpoint, set the `daprAIConnectionString` to `null`. |

## OTel collector costs

There's no cost for enabling a data collector or adding a data destination.

Costs are applied to the data processed by a destination collector. See the billing terms for the data destination of your choice for cost related details.

For example, if you send data to both Azure App Insights and Datadog, you're responsible for the charges applied by both services.

## Frequently asked questions

### How can I use an OTLP collector with a Dapr Sidecar?  

You can configure Dapr to send traces to App Insights without a collector, but you can choose to use an OTel collector as an alternative.

By default an OTel collector doesn't include system data, but you can include system level messages (including Dapr telemetry) by setting `includeSystemTelemetry` to `true`.

To prevent you from collecting redundant data, make sure to remove `daprAIConectionString` (or set it to an empty string) if you plan to use an OTel collector to send Dapr data.

See the [example file](#example-otel-configuration) to see these properties in context.

### How granular is collected data?

Data is collected at the environment level. All logs, metrics, and traces generated in an environment are sent through the OTLP collector and to the configured destinations.

## Next steps

> [!div class="nextstepaction"]
> [Learn about monitoring and health](observability.md)