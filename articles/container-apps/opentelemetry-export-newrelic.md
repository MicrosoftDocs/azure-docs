---
title: Configure Azure Container Apps OpenTelemetry export to New Relic
description: Learn how to configure Azure Container Apps to export OpenTelemetry logs, traces, and metrics to New Relic by using the managed OpenTelemetry agent.
services: container-apps
author: jefmarti
ms.service: azure-container-apps
ms.date: 05/21/2026
ms.author: cshoe
ms.topic: how-to
---

# Configure Azure Container Apps OpenTelemetry export to New Relic

This configuration guide shows how to configure Azure Container Apps to forward logs, traces, and metrics to New Relic by using the managed OpenTelemetry agent.

For more information about the managed OpenTelemetry agent, see [Set up OpenTelemetry agents in Azure Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/opentelemetry-agents?tabs=arm%2Carm-example).

In this guide, you learn how to:

- Create a New Relic ingest key.
- Configure a New Relic OTLP destination by using Bicep or the Azure portal.
- Configure required app environment variables.
- Apply configuration updates to your existing Container Apps environment and app.
- Check telemetry in New Relic.

## Prerequisites

- An Azure subscription where you can update existing Azure Container Apps resources.
- Permissions to modify the target resource group and managed environment.
- A New Relic account.
- Azure CLI installed and signed in.
- Azure Container Apps CLI extension installed.

```powershell
az extension add --name containerapp --upgrade
```

## Create a New Relic ingest key

Use the API key creation guidance to create your New Relic API key: [New Relic API keys](https://docs.newrelic.com/docs/apis/intro-apis/new-relic-api-keys/). Choose the Ingest - License Key type when creating the key, as this type is used for data ingest.

Get the ingest license key value from your account:

- In New Relic, go to **API Keys**.
- Find the **Ingest - License** key.
- Copy the key value for use in destination configuration.


## Configure OpenTelemetry destinations

Use one of the following options to configure New Relic as an OTel endpoint in your Container Apps environment.

> [!IMPORTANT]
> Configuring a managed OpenTelemetry destination doesn't automatically produce telemetry. Your application must already be instrumented to emit traces, metrics, and logs by using an OpenTelemetry SDK.

# [Bicep](#tab/bicep)

Set CLI variables for deployment:

```powershell
$RESOURCE_GROUP = "<resource-group-name>"
$NEW_RELIC_OTLP_ENDPOINT = "https://otlp.nr-data.net:4318"
$NEW_RELIC_INGEST_KEY = "<new-relic-ingest-license-key>"
```

Use the New Relic OTLP base endpoint (`https://otlp.nr-data.net`) with the appropriate OTLP port:

- HTTP: `4318`
- gRPC: `4317`

Use this managed environment resource-style snippet to configure destination routing:

```bicep
var newRelicDestinationName = 'newrelic'
var newRelicAuthHeaderValue = newRelicIngestKey

@secure()
param newRelicIngestKey string
param newRelicOtlpEndpoint string = 'https://otlp.nr-data.net:4318'
@allowed([
  'http'
  'grpc'
])
param newRelicOtlpProtocol string = 'http'

resource environment 'Microsoft.App/managedEnvironments@2026-03-02-preview' = {
  name: '<managed-environment-name>'
  location: '<region>'
  properties: {
    openTelemetryConfiguration: {
      destinationsConfiguration: {
        otlpConfigurations: [
          {
            name: newRelicDestinationName
            endpoint: newRelicOtlpEndpoint
            protocol: newRelicOtlpProtocol
            insecure: false
            headers: [
              {
                key: 'api-key'
                value: newRelicAuthHeaderValue
              }
            ]
          }
        ]
      }
      tracesConfiguration: {
        destinations: [
          newRelicDestinationName
        ]
      }
      logsConfiguration: {
        destinations: [
          newRelicDestinationName
        ]
      }
      metricsConfiguration: {
        destinations: [
          newRelicDestinationName
        ]
      }
    }
  }
}
```

Use this app resource-style snippet to set required app environment variables:

```bicep
resource app 'Microsoft.App/containerApps@2023-05-01' = {
  name: '<container-app-name>'
  location: '<region>'
  properties: {
    managedEnvironmentId: environment.id
    template: {
      containers: [
        {
          name: '<container-name>'
          image: '<image-name>'
          env: [
            {
              name: 'OTEL_SERVICE_NAME'
              value: '<service-name>'
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
          ]
        }
      ]
    }
  }
}
```

Apply your Bicep configuration from the repository root:

```powershell
az deployment group create `
  --resource-group $RESOURCE_GROUP `
  --template-file infra/main.bicep `
  --parameters @infra/main.parameters.json `
  --parameters newRelicOtlpEndpoint="$NEW_RELIC_OTLP_ENDPOINT" `
  --parameters newRelicIngestKey="$NEW_RELIC_INGEST_KEY"
```

# [Azure portal](#tab/portal)

Use the Azure portal to configure the destination:

1. Go to your Container Apps environment.
1. In the left menu, under **Monitoring**, select **OTel endpoints**.
1. Select **Add destination**.
1. For destination type, select **New Relic**.
1. Set **Endpoint** to `https://otlp.nr-data.net:4318` (or `https://otlp.nr-data.net:4317` for gRPC).
1. Set **Protocol** to match the endpoint port.
1. In **Header key**, enter `api-key`.
1. In **Header value**, paste your New Relic ingest license key.
1. Select the checkboxes for **Logs**, **Traces**, and **Metrics**.
1. Save the configuration.

Update app environment variables in the portal revision flow:

1. Go to your Container App.
1. Go to **Revisions and replicas** > **Edit and deploy new revision**.
1. Under **Environment variables**, add or confirm:
   - `OTEL_SERVICE_NAME` = your app/service name
   - `OTEL_TRACES_EXPORTER` = `otlp`
   - `OTEL_METRICS_EXPORTER` = `otlp`
   - `OTEL_LOGS_EXPORTER` = `otlp`
1. Deploy the new revision.

---

Your Container App is now configured to send telemetry to New Relic.

## Check telemetry in New Relic

After configuration, check that logs, traces, and metrics are arriving from your application in New Relic and are associated with the expected service identity.

Use the New Relic experiences that fit your workflow, such as distributed tracing, log search, and metrics exploration.

For more information about exploration and analysis in New Relic, see [New Relic documentation](https://docs.newrelic.com/docs/new-relic-solutions/get-started/intro-new-relic/).
