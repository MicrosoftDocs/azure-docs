---
title: Export OpenTelemetry Data to Datadog in Azure Container Apps
description: Configure Azure Container Apps to export OpenTelemetry logs, traces, and metrics to Datadog using the managed OpenTelemetry agent.
#customer intent: As a developer using Azure Container Apps, I want to export OpenTelemetry logs, traces, and metrics to Datadog so that I can monitor my app's performance in a single observability platform.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.date: 06/03/2026
ms.author: cshoe
ms.reviewer: cshoe
ms.topic: how-to
---

# Export OpenTelemetry data to Datadog in Azure Container Apps

This guide shows how to configure Azure Container Apps to forward logs, traces, and metrics to Datadog by using the managed OpenTelemetry agent.

For more information about the managed OpenTelemetry agent, see [Set up OpenTelemetry agents in Azure Container Apps](./opentelemetry-agents.md).

## What you learn

- Create a Datadog API key for telemetry ingest.
- Configure a Datadog destination in your Container Apps environment by using Bicep, Azure CLI, or the Azure portal.
- Apply configuration updates to your existing Container Apps environment and app.
- Verify telemetry in Datadog.

## Prerequisites

- An Azure subscription where you can create resource groups and deploy Azure Container Apps resources.
- A Datadog environment and API key.
- Azure CLI installed and signed in.
- Azure Container Apps CLI extension installed.

```azurecli
az extension add --name containerapp --upgrade
```

## Create a Datadog API key

Create a Datadog API key with permissions that allow telemetry ingest.

You need the following Datadog values for Container Apps managed OTel configuration:

- `site` (full Datadog site value, for example: `datadoghq.com`, `us3.datadoghq.com`, `us5.datadoghq.com`, `datadoghq.eu`)
- `key` (Datadog API key)

For Datadog key creation and management, see [Datadog API and application keys](https://docs.datadoghq.com/account_management/api-app-keys/).

## Configure OpenTelemetry destinations

Use one of the following options to configure Datadog as an OpenTelemetry destination in your Container Apps environment.

> [!IMPORTANT]
> Configuring a managed OpenTelemetry destination doesn't automatically produce telemetry. Your application must also be instrumented to emit traces, metrics, and logs by using an OpenTelemetry SDK.

# [Bicep](#tab/bicep)

Set CLI variables for the deployment command:

```powershell
$RESOURCE_GROUP = "<resource-group-name>"
$DATADOG_SITE = "<datadog-site>" # Example: us3.datadoghq.com, us5.datadoghq.com, datadoghq.eu
$DATADOG_API_KEY = ""
$IMAGE = ""
$ACR_USERNAME = ""
$ACR_PASSWORD = ""
```

Use a managed environment resource block like the following example:

```bicep
param datadogSite string
@secure()
param datadogApiKey string

var datadogDestinationName = 'dataDog'

resource environment 'Microsoft.App/managedEnvironments@2024-10-02-preview' = {
  name: ''
  location: ''
  properties: {
    openTelemetryConfiguration: {
      destinationsConfiguration: {
        dataDogConfiguration: {
          site: datadogSite
          key: datadogApiKey
        }
      }
      tracesConfiguration: {
        destinations: [
          datadogDestinationName
        ]
      }
      logsConfiguration: {
        destinations: [
          datadogDestinationName
        ]
      }
      metricsConfiguration: {
        destinations: [
          datadogDestinationName
        ]
      }
    }
  }
}
```

Use a container app resource block like the following example to set required environment variables:

```bicep
resource app 'Microsoft.App/containerApps@2024-10-02-preview' = {
  name: ''
  location: ''
  properties: {
    managedEnvironmentId: environment.id
    template: {
      containers: [
        {
          name: ''
          image: ''
          env: [
            {
              name: 'OTEL_SERVICE_NAME'
              value: ''
            }
            {
              name: 'OTEL_TRACES_EXPORTER'
              value: 'otlp'
            }
            {
              name: 'OTEL_METRICS_EXPORTER'
              value: 'otlp'
            }
            {
              name: 'OTEL_LOGS_EXPORTER'
              value: 'otlp'
            }
            {
              name: 'OTEL_EXPORTER_OTLP_PROTOCOL'
              value: 'grpc'
            }
          ]
        }
      ]
    }
  }
}
```

For production deployments, pass token values through secure Bicep parameters or Key Vault instead of hardcoding secrets.

After you update the template, deploy the Bicep configuration from the repository root:

```powershell
az deployment group create `
  --resource-group $RESOURCE_GROUP `
  --template-file infra/main.bicep `
  --parameters @infra/main.parameters.json `
  image=$IMAGE `
  acrUsername=$ACR_USERNAME `
  acrPassword=$ACR_PASSWORD `
  datadogSite="$DATADOG_SITE" `
  datadogApiKey="$DATADOG_API_KEY"
```

# [Azure CLI](#tab/cli)

Use CLI to update an existing Container Apps environment:

```powershell
$RESOURCE_GROUP = "<resource-group-name>"
$ENVIRONMENT_NAME = "<container-apps-environment-name>"
$DATADOG_SITE = "<datadog-site>" # Example: us3.datadoghq.com, us5.datadoghq.com, datadoghq.eu
$DATADOG_API_KEY = ""

az containerapp env telemetry data-dog set `
  --resource-group $RESOURCE_GROUP `
  --name $ENVIRONMENT_NAME `
  --site $DATADOG_SITE `
  --key $DATADOG_API_KEY `
  --enable-open-telemetry-traces true `
  --enable-open-telemetry-metrics true
```

The current CLI only exposes flags for Datadog traces and metrics. You can enable logs by setting `logsConfiguration.destinations` to `dataDog` in the managed environment resource definition. If the portal shows Logs disabled after running the CLI command, update the environment through Bicep or the portal.

Then confirm your app has required OpenTelemetry environment variables:

```powershell
$APP_NAME = "<container-app-name>"

az containerapp update `
  --resource-group $RESOURCE_GROUP `
  --name $APP_NAME `
  --set-env-vars `
    OTEL_SERVICE_NAME=$APP_NAME `
    OTEL_TRACES_EXPORTER=otlp `
    OTEL_METRICS_EXPORTER=otlp `
    OTEL_LOGS_EXPORTER=otlp `
    OTEL_EXPORTER_OTLP_PROTOCOL=grpc
```

# [Azure portal](#tab/portal)

Use the Azure portal path shown in the platform docs:

1. Open your Container Apps environment.
1. In the left menu, under **Monitoring**, select **OTel endpoints**.
1. Select **Datadog**, and then select **Update**.
1. In **Update Datadog endpoint**, set **Site** to your Datadog site value.
1. In **Key**, paste your Datadog API key.
1. Select the checkboxes for **Logs**, **Traces**, and **Metrics**.
1. Save the configuration.
1. Open your container app, and then select **Revisions and replicas** > **Edit and deploy new revision**.
1. Under **Environment variables**, add or confirm the following values:
   - `OTEL_SERVICE_NAME` = your app/service name
   - `OTEL_TRACES_EXPORTER` = `otlp`
   - `OTEL_METRICS_EXPORTER` = `otlp`
   - `OTEL_LOGS_EXPORTER` = `otlp`
   - `OTEL_EXPORTER_OTLP_PROTOCOL` = `grpc`
1. Deploy the new revision.

In the update panel, if you aren't rotating the key, you can leave **Key** blank to keep the existing value.

---

Your Container App is now configured to send telemetry to Datadog through the managed OpenTelemetry agent.

## Verify OpenTelemetry data in Datadog

After you complete the configuration, your container app starts sending telemetry to Datadog through the managed OpenTelemetry agent. Use Datadog to confirm that logs, traces, and metrics are arriving from the application and that the data appears under the expected service and environment context.

Validate results by checking Datadog tools like log exploration, distributed tracing, and metric search. The exact query or navigation path varies depending on the data you inspect.

For more information about data exploration in Datadog, see [Datadog observability and telemetry](https://docs.datadoghq.com/).
