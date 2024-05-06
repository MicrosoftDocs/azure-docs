---
title: Collect and read OpenTelemetry data in Azure Container Apps (preview)
description: Learn to record and query data collected using OpenTelemetry in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.date: 03/08/2024
ms.author: cshoe
ms.topic: how-to
---

# Collect and read OpenTelemetry data in Azure Container Apps (preview)

Using an [OpenTelemetry](https://opentelemetry.io/) data agent with your Azure Container Apps environment, you can choose to send observability data in an OpenTelemetry format by:

- Piping data from an agent into a desired endpoint. Destination options include Azure Monitor Application Insights, Datadog, and any OpenTelemetry Protocol (OTLP)-compatible endpoint.

- Easily changing destination endpoints without having to reconfigure how they emit data, and without having to manually run an OpenTelemetry agent.

This article shows you how to set up and configure an OpenTelemetry agent for your container app.

## Configure an OpenTelemetry agent

OpenTelemetry agents live within your container app environment. You configure agent settings via an ARM template or Bicep calls to the environment, or through the CLI.

Each endpoint type (Azure Monitor Application Insights, DataDog, and OTLP) has specific configuration requirements.


## Prerequisites

Enabling the managed OpenTelemetry agent to your environment doesn't automatically mean the agent collects data. Agents only send data based on your configuration settings and instrumenting your code correctly. 

### Configure source code

Prepare your application to collect data by installing the [OpenTelemetry SDK](https://opentelemetry.io/ecosystem/integrations/) and follow the OpenTelemetry guidelines to instrument [metrics](https://opentelemetry.io/docs/concepts/signals/logs/), [logs](https://opentelemetry.io/docs/concepts/signals/metrics), or [traces](https://opentelemetry.io/docs/concepts/signals/traces/).

### Initialize endpoints

Before you can send data to a collection destination, you first need to create an instance of the destination service. For example, if you want to send data to Azure Monitor Application Insights, you need to create an Application Insights instance ahead of time.

The managed OpenTelemetry agent accepts the following destinations:

- Azure Monitor Application Insights
- Datadog
- Any OTLP endpoint (For example: New Relic or Honeycomb)

The following table shows you what type of data you can send to each destination:

| Destination | Logs | Metrics | Traces |
|---|------|---------|--------|
| [Azure App Insights](/azure/azure-monitor/app/app-insights-overview) | Yes | No | Yes |
| [Datadog](https://datadoghq.com/) | No | Yes | Yes |
| [OpenTelemetry](https://opentelemetry.io/) protocol (OTLP) configured endpoint | Yes | Yes | Yes |

## Azure Monitor Application Insights

The only configuration detail required from Application Insights is the connection string. Once you have the connection string, you can configure the agent via your container app's ARM template or with Azure CLI commands.

# [ARM template](#tab/arm)

Before you deploy this template, replace placeholders surrounded by `<>` with your values.

```json
{
  ...
  "properties": {
    "appInsightsConfiguration ": {  
      "connectionString": "<YOUR_APP_INSIGHTS_CONNECTION_STRING>"
    }
    "openTelemetryConfiguration": {
      ...
      "tracesConfiguration":{
        "destinations": ["appInsights"]
      },
      "logsConfiguration": {
        "destinations": ["appInsights"]
      }
    }
  }
}
```

# [Azure CLI](#tab/azure-cli)

Before you run this command, replace placeholders surrounded by `<>` with your values.

```azurecli
az containerapp env telemetry app-insights set \
  --connection-string <YOUR_APP_INSIGHTS_CONNECTION_STRING> \
  --enable-open-telemetry-traces true \
  --enable-open-telemetry-logs true
```

---

## Datadog

The Datadog agent configuration requires a value for `site` and `key` from your Datadog instance. Gather these values from your Datadog instance according to this table:

| Datadog agent property | Container Apps configuration property |
|---|---|
| `DD_SITE` | `site` |
| `DD_API_KEY` | `key` |

Once you have these configuration details, you can configure the agent via your container app's ARM template or with Azure CLI commands.

# [ARM template](#tab/arm)

Before you deploy this template, replace placeholders surrounded by `<>` with your values.

```json
{
  ...
  "properties": {
    ...
    "openTelemetryConfiguration": {
      ...
      "destinationsConfiguration":{
        ...
        "dataDogConfiguration":{
          "site": "<YOUR_DATADOG_SUBDOMAIN>.datadoghq.com",
          "key": "<YOUR_DATADOG_KEY>"
        }
      },
      "tracesConfiguration":{
        "destinations": ["dataDog"]
      },
      "metricsConfiguration": {
        "destinations": ["dataDog"]
      }
    }
  }
}
```


# [Azure CLI](#tab/azure-cli)

Before you run this command, replace placeholders surrounded by `<>` with your values.

```azurecli
az containerapp env telemetry data-dog set \
  --site  "<YOUR_DATADOG_SUBDOMAIN>.datadoghq.com" \
  --key <YOUR_DATADOG_KEY> \
  --enable-open-telemetry-traces true \
  --enable-open-telemetry-metrics true
```

---

## OTLP endpoint

An OpenTelemetry protocol (OTLP) endpoint is a telemetry data destination that consumes OpenTelemetry data. In your application configuration, you can add multiple OTLP endpoints. The following example adds two endpoints and sends the following data to these endpoints.

| Endpoint name | Data sent to endpoint |
|---|---|
| `oltp1` | Metrics and/or traces |
| `oltp2` | Logs and/or traces |

While you can set up as many OTLP-configured endpoints as you like, each endpoint must have a distinct name.

# [ARM template](#tab/arm)

```json
{
  "properties": {
    "appInsightsConfiguration": {},
    "openTelemetryConfiguration": {
      "destinationsConfiguration":{
        "otlpConfigurations": [
          {
            "name": "otlp1",
            "endpoint": "ENDPOINT_URL_1",
            "insecure": false,
            "headers": "api-key-1=key"
          },
          {
            "name": "otlp2",
            "endpoint": "ENDPOINT_URL_2",
            "insecure": true
          }
        ]
      },
      "logsConfiguration": { 
        "destinations": ["otlp2"]
      },
      "tracesConfiguration":{
        "destinations": ["otlp1", "otlp2"]
      },
      "metricsConfiguration": {
        "destinations": ["otlp1"]
      }
    }
  }
}

```

# [Azure CLI](#tab/azure-cli)

```azurecli
az containerap env telemetry otlp add \
  --name "otlp1"
  --endpoint "ENDPOINT_URL_1" \
  --insecure false \
  --headers "api-key-1=key" \
  --enable-open-telemetry-traces true \
  --enable-open-telemetry-metrics true
az containerap env telemetry otlp add \
  --name "otlp2"
  --endpoint "ENDPOINT_URL_2" \
  --insecure true \
  --enable-open-telemetry-traces true \
  --enable-open-telemetry-logs true
```

---

| Name | Description |
|---|---|
| `name` | A name you select to identify your OTLP-configured endpoint. |
| `endpoint` | The URL of the destination that receives collected data. |
| `insecure` | Default true. Defines whether to enable client transport security for the exporter's gRPC connection. If false, the `headers` parameter is required. |
| `headers` | Space-separated values, in 'key=value' format, that provide required information for the OTLP endpoints' security. Example: `"api-key=key other-config-value=value"`. |

## Configure Data Destinations

To configure an agent, use the `destinations` array to define which agents your application sends data. Valid keys are either `appInsights`, `dataDog`, or the name of your custom OTLP endpoint. You can control how an agent behaves based off data type and endpoint-related options.

### By data type

| Option | Example |
|---|---|
| Select a data type. | You can configure logs, metrics, and/or traces individually. |
| Enable or disable any data type. | You can choose to send only traces and no other data. |
| Send one data type to multiple endpoints. | You can send logs to both DataDog and an OTLP-configured endpoint. |
| Send different data types to different locations. | You can send traces to an OTLP endpoint and metrics to DataDog. |
| Disable sending all data types. | You can choose to not send any data through the OpenTelemetry agent. |

### By endpoint

- You can only set up one Application Insights and Datadog endpoint each at a time.
- While you can define more than one OTLP-configured endpoint, each one must have a distinct name.


The following example shows how to use an OTLP endpoint named `customDashboard`. It sends:
-  traces to app insights and `customDashboard`
- logs to app insights and `customDashboard`
- metrics to DataDog and `customDashboard`

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
          "customDashboard"
        ]
      },
      "logsConfiguration": {
        "destinations": [
          "appInsights",
          "customDashboard"
        ]
      },
      "metricsConfiguration": {
        "destinations": [
          "dataDog",
          "customDashboard"
        ]
      }
    }
  }
}

## Example OpenTelemetry configuration

The following example ARM template shows how you might configure your container app to collect telemetry data using Azure Monitor Application Insights, Datadog, and with a custom OTLP agent named `customDashboard`.

Before you deploy this template, replace placeholders surrounded by `<>` with your values.

```json
{
  "location": "eastus",
  "properties": {
    "appInsightsConfiguration": {
      "connectionString": "<APP_INSIGHTS_CONNECTION_STRING>"
    },
    "openTelemetryConfiguration": {
      "destinationsConfiguration": {
        "dataDogConfiguration": {
          "site": "datadoghq.com",
          "key": "<YOUR_DATADOG_KEY>"
        },
        "otlpConfigurations": [
          {
            "name": "customDashboard",
            "endpoint": "<OTLP_ENDPOINT_URL>",
            "insecure": true
          }
        ]
      },
      "tracesConfiguration": {
        "destinations": [
          "appInsights",
          "customDashboard"
        ]
      },
      "logsConfiguration": {
        "destinations": [
          "appInsights",
          "customDashboard"
        ]
      },
      "metricsConfiguration": {
        "destinations": [
          "dataDog",
          "customDashboard"
        ]
      }
    }
  }
}
```

## Environment variables

The OpenTelemetry agent automatically injects a set of environment variables into your application at runtime.

The first two environment variables follow standard OpenTelemetry exporter configuration and are used in OTLP standard software development kits. If you explicitly set the environment variable in the container app specification, your value overwrites the automatically injected value.

Learn about the OTLP exporter configuration see, [OTLP Exporter Configuration](https://opentelemetry.io/docs/languages/sdk-configuration/otlp-exporter/).

| Name | Description |
|---|---|
| `OTEL_EXPORTER_OTLP_ENDPOINT` | A base endpoint URL for any signal type, with an optionally specified port number. This setting is helpful when you’re sending more than one signal to the same endpoint and want one environment variable to control the endpoint. Example:  `http://otel.service.k8se-apps:4317/` |
| `OTEL_EXPORTER_OTLP_PROTOCOL` | Specifies the OTLP transport protocol used for all telemetry data. The managed agent only supports `grpc`. Value: `grpc`. |

The other three environment variables are specific to Azure Container Apps, and are always injected. These variables hold agent’s endpoint URLs for each specific data type (logs, metrics, traces).

These variables are only necessary if you're using both the managed OpenTelemetry agent and another OpenTelemetry agent. Using these variables gives you control over how to route data between the different OpenTelemetry agents.

| Name | Description | Example |
|---|---|---|
| `CONTAINERAPP_OTEL_TRACING_GRPC_ENDPOINT` | Endpoint URL for trace data only. | `http://otel.service.k8se-apps:43178/v1/traces/` |
| `CONTAINERAPP_OTEL_LOGGING_GRPC_ENDPOINT` | Endpoint URL for log data only. | `http://otel.service.k8se-apps:43178/v1/logs/ ` |
| `CONTAINERAPP_OTEL_METRIC_GRPC_ENDPOINT` | Endpoint URL for metric data only. | `http://otel.service.k8se-apps:43178/v1/metrics/` |

## OpenTelemetry agent costs

You are [billed](./billing.md) for the underlying compute of the agent.

See the destination service for their billing structure and terms. For example, if you send data to both Azure Monitor Application Insights and Datadog, you're responsible for the charges applied by both services.

## Known limitations

- OpenTelemetry agents are in preview.
- System data, such as system logs or Container Apps standard metrics, isn't available to be sent to the OpenTelemetry agent.
- The Application Insights endpoint doesn't accept metrics.
- The Datadog endpoint doesn't accept logs.

## Next steps

> [!div class="nextstepaction"]
> [Learn about monitoring and health](observability.md)
