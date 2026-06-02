---
title: Export OpenTelemetry data to Dynatrace in Azure Container Apps
description: Learn how to configure Azure Container Apps to export OpenTelemetry logs, traces, and metrics to Dynatrace by using the managed OpenTelemetry agent.
author: jefmarti
ms.service: azure-container-apps
ms.date: 05/22/2026
ms.author: cshoe
ms.reviewer: cshoe
ms.topic: how-to
---

# Export OpenTelemetry data to Dynatrace in Azure Container Apps

This guide shows how to configure Azure Container Apps to forward logs, traces, and metrics to Dynatrace by using the managed OpenTelemetry agent.

For more information about the managed OpenTelemetry agent, see [Set up OpenTelemetry agents in Azure Container Apps](./opentelemetry-agents.md).

## What you learn

- Create a Dynatrace ingest token with the required scopes.
- Configure a Dynatrace OpenTelemetry Protocol (OTLP) destination by using Bicep or the Azure portal.
- Configure required app environment variables for metrics export.
- Apply configuration updates to your existing Container Apps environment and app.
- Verify telemetry in Dynatrace.

## Prerequisites

- An Azure subscription where you can create resource groups and deploy Azure Container Apps resources.
- A Dynatrace SaaS environment.
- Azure CLI installed and signed in.
- Azure Container Apps CLI extension installed.

```azurecli
az extension add --name containerapp --upgrade
```

## Create a Dynatrace ingest token

Create a Dynatrace API token with these scopes:

- `logs.ingest`
- `metrics.ingest`
- `openTelemetryTrace.ingest`

For token creation steps and permission details, see [Dynatrace token and permission requirements](https://docs.dynatrace.com/docs/ingest-from/setup-on-k8s/deployment/tokens-permissions).


## Configure OpenTelemetry destinations

Use one of the following options to configure Dynatrace as an OpenTelemetry endpoint in your Container Apps environment.

> [!IMPORTANT]
> Configuring a managed OpenTelemetry destination doesn't automatically produce telemetry. Your application must also be instrumented to emit traces, metrics, and logs by using an OpenTelemetry SDK.

# [Bicep](#tab/bicep)

Set CLI variables for the deployment command:

```powershell
$RESOURCE_GROUP = "<RESOURCE_GROUP_NAME>"
$DYNATRACE_OTLP_ENDPOINT = "https://<TENANT>.live.dynatrace.com/api/v2/otlp"
$DYNATRACE_API_TOKEN = "<DYNATRACE_INGEST_TOKEN>"
```

Use only the OTLP base endpoint (`/api/v2/otlp`). Don't append `/v1/traces`, `/v1/metrics`, or `/v1/logs`; the managed agent appends signal paths automatically.

```bicep
var dynatraceEndpoint = 'https://<TENANT>.live.dynatrace.com/api/v2/otlp'
var dynatraceApiKey = '<DYNATRACE_INGEST_TOKEN>'
var dynatraceAuthHeader = 'Api-Token ${dynatraceApiKey}'
var dynatraceOtlpDestinationName = 'dynatrace-otlp'

resource environment 'Microsoft.App/managedEnvironments@2024-10-02-preview' = {
  name: '<managed-environment-name>'
  location: '<region>'
  properties: {
    openTelemetryConfiguration: {
      destinationsConfiguration: {
        otlpConfigurations: [
          {
            name: dynatraceOtlpDestinationName
            endpoint: dynatraceEndpoint
            protocol: 'http'
            insecure: false
            headers: [
              {
                key: 'Authorization'
                value: dynatraceAuthHeader
              }
            ]
          }
        ]
      }
      tracesConfiguration: {
        destinations: [
          dynatraceOtlpDestinationName
        ]
      }
      logsConfiguration: {
        destinations: [
          dynatraceOtlpDestinationName
        ]
      }
      metricsConfiguration: {
        destinations: [
          dynatraceOtlpDestinationName
        ]
      }
    }
  }
}
```

To set the required environment variables, use a container app resource block like the following example:

```bicep
resource app 'Microsoft.App/containerApps@2023-05-01' = {
  name: '<CONTAINER_APP_NAME>'
  location: '<REGION>'
  properties: {
    managedEnvironmentId: environment.id
    template: {
      containers: [
        {
          name: '<CONTAINER_NAME>'
          image: '<IMAGE_NAME>'
          env: [
            {
              name: 'OTEL_SERVICE_NAME'
              value: '<SERVICE_NAME>'
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
              name: 'OTEL_EXPORTER_OTLP_METRICS_PROTOCOL'
              value: 'http/protobuf'
            }
            {
              name: 'OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE'
              value: 'DELTA'
            }
          ]
        }
      ]
    }
  }
}
```

Dynatrace requires `OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE=DELTA` to ingest metrics.

For production deployments, pass token values through secure Bicep parameters or Key Vault instead of hardcoding secrets.

After you update the template, deploy the Bicep configuration from the repository root:

```powershell
az deployment group create `
  --resource-group $RESOURCE_GROUP `
  --template-file infra/main.bicep `
  --parameters @infra/main.parameters.json `
  dynatraceEndpoint="$DYNATRACE_OTLP_ENDPOINT" `
  dynatraceApiKey="$DYNATRACE_API_TOKEN"
```

Use the same endpoint and token values shown earlier in this guide, including the OTLP base endpoint format.

# [Azure portal](#tab/portal)

Use the following steps to configure Dynatrace in the Azure portal:

1. Go to your Container Apps environment.
1. In the left menu, under **Monitoring**, select **OTel endpoints**.
1. Select **Dynatrace**, and then select **Update**.
1. In **Update Dynatrace endpoint**, set **Endpoint** to `https://<TENANT>.live.dynatrace.com/api/v2/otlp`.
1. In **Key**, paste your Dynatrace ingest token.
1. Select the checkboxes for **Logs**, **Traces**, and **Metrics**.
1. Save the configuration.
1. Go to your container app, and then go to **Revisions and replicas** > **Edit and deploy new revision**.
1. Under **Environment variables**, add or confirm the following values:
   - `OTEL_SERVICE_NAME` = your app/service name
   - `OTEL_TRACES_EXPORTER` = `otlp`
   - `OTEL_METRICS_EXPORTER` = `otlp`
   - `OTEL_LOGS_EXPORTER` = `otlp`
   - `OTEL_EXPORTER_OTLP_METRICS_PROTOCOL` = `http/protobuf`
   - `OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE` = `DELTA`
1. Deploy the new revision.

In the update panel, if you aren't rotating the token, you can leave **Key** blank to keep the existing token.

Dynatrace requires `OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE=DELTA` to ingest metrics.

---

Your container app is now configured to send telemetry to Dynatrace.

## Verify OpenTelemetry data in Dynatrace

After you complete the configuration, your container app starts sending telemetry to Dynatrace through the managed OpenTelemetry agent. Use Dynatrace to check that logs, traces, and metrics are arriving from the application and that the data appears under the expected service or environment context.

You can validate the result by checking the Dynatrace experiences and tools that fit your workflow, such as log exploration, distributed tracing, and metric search. The exact query or navigation path might vary depending on the data you want to inspect.

For more information about data exploration in Dynatrace, see [Dynatrace analyze, explore, and automate](https://docs.dynatrace.com/docs/analyze-explore-automate).

## Related content

- [Collect and read OpenTelemetry data in Azure Container Apps](./opentelemetry-agents.md)
- [Dynatrace analyze, explore, and automate](https://docs.dynatrace.com/docs/analyze-explore-automate)
- [Dynatrace token and permission requirements](https://docs.dynatrace.com/docs/ingest-from/setup-on-k8s/deployment/tokens-permissions)

