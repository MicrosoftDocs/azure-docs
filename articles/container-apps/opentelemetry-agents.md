---
title: Collect and read OpenTelemetry data in Azure Container Apps (preview)
description: Learn to record and query data collected using OpenTelemetry in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.date: 03/08/2024
ms.author: cshoe
---

# Collect and read OpenTelemetry data in Azure Container Apps (preview)

Using an OpenTelemetry (OTel) data agent with your Azure Container Apps environment, you can send observability data in OpenTelemetry format to:

- Azure App Insights
- Datadog
- Any OTLP-configured endpoint

The following table shows you what type of data you can send to each destination:

| Destination | Logs | Metrics | Traces |
|---|------|---------|--------|
| [Azure App Insights](/azure/azure-monitor/app/app-insights-overview) | Yes | Yes | Yes |
| [Datadog](https://datadoghq.com/) | No | Yes | Yes |
| [OpenTelemetry](https://opentelemetry.io/) protocol (OTLP) configured endpoint | Yes | Yes | Yes |

Through simple configuration settings, the Container Apps OTel agent makes it easy for you to:

- Send data to one or multiple destinations
- Switch collection destinations

This article shows you how to set up and configure an OTel agent for your container app.

## Set up an agent

Setting up an agent is a two step process. The first step is to create an instance of the destination service to accept data from your container app. For instance, if you want to send data to Azure Application Insights, you first need to create an App Insights instance.

The second step is to configure your container app to send data to the destination.

The following examples show how to configure your container app to send telemetry data to different agents.

## Azure App Insights

The only configuration detail required from Application Insights is the connection string. Once you have the connection string, you can configure the agent via your container app's ARM template or with Azure CLI commands.

# [ARM template](#tab/arm)

```json
{
  ...
  "properties": {
    "appInsightsConfiguration ": {  
      "connectionString": "<YOUR_APP_INSIGHTS_CONNECTION_STRING>"
    }
  }
}
```

# [Azure CLI](#tab/azure-cli)

```azurecli
 az containerapp env telemetry app-insights set \
  --connection-string <YOUR_APP_INSIGHTS_CONNECTION_STRING>
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

```azurecli
 az containerapp env telemetry data-dog set \
  --site  "<YOUR_DATADOG_SUBDOMAIN>.datadoghq.com" \
  --key <YOUR_DATADOG_KEY> 
```

---

## OTLP endpoint

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
| `name` | A name you select to identify your OTLP-configured endpoint. |
| `endpoint` |  The URL of the destination that receives collected data. |
| `insecure` |  Default true. Defines whether to enable client transport security for the exporter's gRPC connection. If false, the `header` parameter is required.  |
| `header` | space separated values in 'key=value' format that provide required information for the otlp endpoints' security. example: "api-key=key other-config-value=value"  |


# [Azure CLI](#tab/azure-cli)

```azurecli
az containerapp env telemetry otlp add \  
  --name <ENDPOINT_NAME> \ 
  --endpoint  <ENDPOINT_URL> \
  --insecure  <IS_INSECURE>
  --headers  <HEADERS>
```

| Name | Description |
|---|---|
| `<ENDPOINT_NAME>` | A name you select to identify your OTLP-configured endpoint. |
| `<ENDPOINT_URL>` |  The URL of the destination that receives collected data. |
| `<IS_INSECURE>` | True/false. If false, include headers to |
| `<HEADERS>` |  List of security headers. |

---

## Restrictions

Keep in mind the following restrictions as you use an OTel agent in your container app:

- You can only set up one Application Insights and Datadog endpoint at a time.
- While you can define more than one OTLP-configured endpoint, each one must be distinct.

## Configure what data is collected

The OTel agent divides data up into the following categories:

- Traces
- Metrics
- Logs

You can send each type of data to different locations, but you can also choose not to send one of the data categories an agent.

To configure an agent, use the `destinations` array to define which agents your application sends data. Valid keys are either `appInsights`, `dataDog`, or the name of your custom OTLP endpoint.

The following example shows how to use an OTLP endpoint named `customDashboard`.

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
```

## Example OTel configuration

The following example show how you might configure your container app to collect telemetry data using Azure Application Insights, Datadog, and with a custom OTLP agent named `customDashboard`.

# [ARM template](#tab/arm)

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
            "name": "customDashboard",
            "endpoint": "<OTLP_ENDPOINT_URI>",
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

# [CLI](#tab/azure-cli)

Use a combination of commands with `az containerapp env telemetry` that match the type of agent you want to enable. The following table lists the agents you can enable.

| Command | Description |
|---|---|
| `app-insights` | Application Insights agent |
| `data-dog` | Datadog agent |
| `otlp` | Custom OTLP agent |

Once you select an agent, then you can enable the type of data you want to collect. The following table lists the parameters available to enable or disable different categories of data to collect.

| Parameter | Value |
|---|---|
| `--enable-open-telemetry-traces` | `true` or `false` |
| `--enable-open-telemetry-logs` | `true` or `false` |
| `--enable-open-telemetry-metrics` | `true` or `false` |

For example, if you wanted to start collecting traces and logs with Application Insights you would use the following command.

```azurecli
az containerapp env telemetry app-insights set
  --enable-open-telemetry-traces true
  --enable-open-telemetry-logs true
```

---

## Send data from your app to an OTel agent

To send data to an agent, install the [OTel SDK](https://opentelemetry.io/ecosystem/integrations/) into your application. The OTel agent automatically injects environment variables when your application runs to pick up logs, metrics, or traces produced while using the SDK.

## OTel agent costs

There's no cost for enabling a data agent or adding a data destination.

Costs are applied to the data processed by a destination agent. See the billing terms for the data destination of your choice for cost related details.

For example, if you send data to both Azure App Insights and Datadog, you're responsible for the charges applied by both services.

## Frequently asked questions

### How can I use an OTLP agent with a Dapr Sidecar?  

You can configure Dapr to send traces to App Insights without an agent, but you can choose to use an OTel agent as an alternative.

By default an OTel agent doesn't include system data, but you can include system level messages (including Dapr telemetry) by setting `includeSystemTelemetry` to `true`.

To prevent you from collecting redundant data, make sure to remove `daprAIConectionString` (or set it to an empty string) if you plan to use an OTel agent to send Dapr data.

### How granular is collected data?

Data is collected at the environment level. All logs, metrics, and traces generated in an environment are sent through the OTLP agent and to the configured destinations.

## Next steps

> [!div class="nextstepaction"]
> [Learn about monitoring and health](observability.md)