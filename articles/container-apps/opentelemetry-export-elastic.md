---
title: Configure Azure Container Apps OpenTelemetry export to Elastic
description: Learn how to configure Azure Container Apps to export OpenTelemetry logs, traces, and metrics to Elastic by using the managed OpenTelemetry agent.
#customer intent: As an Azure Container Apps developer, I want to export OpenTelemetry logs, traces, and metrics to Elastic, so that I can monitor my app's health in my existing observability platform.
services: container-apps
author: jefmarti
ms.service: azure-container-apps
ms.date: 05/21/2026
ms.author: cshoe
ms.reviewer: cshoe
ms.topic: how-to
---

# Configure Azure Container Apps OpenTelemetry export to Elastic

This configuration guide shows how to configure Azure Container Apps to forward logs, traces, and metrics to Elastic by using the managed OpenTelemetry agent.

For more information about the managed OpenTelemetry agent, see [OpenTelemetry agents in Azure Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/opentelemetry-agents).

In this guide, you learn how to:

- Create an Elastic ingest token.
- Configure an Elastic OTLP destination by using Bicep or the Azure portal.
- Configure required app environment variables.
- Apply configuration updates to your existing Container Apps environment and app.
- Check telemetry in Elastic.

## Prerequisites

- An Azure subscription
- An Elastic account and target deployment or project that accepts OTLP ingest.
- Azure CLI installed and signed in to your Azure account.
- Azure Container Apps CLI extension installed (for Bicep).

```powershell
az extension add --name containerapp --upgrade
```

## Create an Elastic ingest token

Create an Elastic API key that can ingest OpenTelemetry data for your target deployment.

The required permissions should allow writing telemetry data for these signals:

- Logs ingest/write
- Traces ingest/write
- Metrics ingest/write

For provider guidance on token permissions and API keys, see [Elastic API keys](https://www.elastic.co/guide/en/elasticsearch/reference/current/security-api-create-api-key.html).

## Configure OpenTelemetry destinations

Use one of the following options to configure Elastic as an OTel endpoint in your Container Apps environment.

> [!IMPORTANT]
> Configuring a managed OpenTelemetry destination doesn't automatically produce telemetry. Your application must already be instrumented to emit traces, metrics, and logs by using an OpenTelemetry SDK.

# [Bicep](#tab/bicep)

Set CLI variables for deployment:

```powershell
$RESOURCE_GROUP = "<RESOURCE_GROUP_NAME>"
$ELASTIC_OTLP_ENDPOINT = "https://<YOUR_ELASTIC_ENDPOINT>:443"
$ELASTIC_API_KEY = "<ELASTIC_API_KEY_WITHOUT_PREFIX>"
```

Use the Elastic OTLP base endpoint format:

- `https://<YOUR_ELASTIC_ENDPOINT>:443`

Use the authorization token header format:

- Header key: `Authorization`
- Header value: `ApiKey <TOKEN>`

Use this managed environment resource example to configure destination routing:

```bicep
@secure()
param elasticApiKey string
param elasticOtlpEndpoint string = 'https://<YOUR_ELASTIC_ENDPOINT>:443'

var elasticDestinationName = 'elastic-otlp'
var elasticAuthHeaderValue = 'ApiKey ${elasticApiKey}'

resource environment 'Microsoft.App/managedEnvironments@2026-03-02-preview' = {
  name: '<MANAGED_ENVIRONMENT_NAME>'
  location: '<REGION>'
  properties: {
    openTelemetryConfiguration: {
      destinationsConfiguration: {
        otlpConfigurations: [
          {
            name: elasticDestinationName
            endpoint: elasticOtlpEndpoint
            protocol: 'http'
            insecure: false
            headers: [
              {
                key: 'Authorization'
                value: elasticAuthHeaderValue
              }
            ]
          }
        ]
      }
      tracesConfiguration: {
        destinations: [
          elasticDestinationName
        ]
      }
      logsConfiguration: {
        destinations: [
          elasticDestinationName
        ]
      }
      metricsConfiguration: {
        destinations: [
          elasticDestinationName
        ]
      }
    }
  }
}
```

Use this app resource example to set required app environment variables:

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
              name: 'OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE'
              value: 'cumulative'
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
  --parameters elasticOtlpEndpoint="$ELASTIC_OTLP_ENDPOINT" `
  --parameters elasticApiKey="$ELASTIC_API_KEY"
```

# [Azure portal](#tab/portal)

Use the Azure portal to configure the destination:

1. Go to your Container Apps environment.
1. In the left menu, under **Monitoring**, select **OTel endpoints**.
1. Select **Add destination**.
1. For destination type, select **Custom OTLP endpoint**.
1. Set **Endpoint** to your Elastic OTLP base endpoint, such as `https://<YOUR_ELASTIC_ENDPOINT>:443`.
1. Set **Protocol** to **HTTP**.
1. In **Header key**, enter `Authorization`.
1. In **Header value**, enter `ApiKey <TOKEN>`.
1. Select the checkboxes for **Logs**, **Traces**, and **Metrics**.
1. Save the configuration.

Then update app environment variables in the portal revision flow:

1. Go to your Container App.
1. Go to **Revisions and replicas** > **Edit and deploy new revision**.
1. Under **Environment variables**, add or confirm:
   - `OTEL_SERVICE_NAME` = your app or service name
   - `OTEL_TRACES_EXPORTER` = `otlp`
   - `OTEL_METRICS_EXPORTER` = `otlp`
   - `OTEL_LOGS_EXPORTER` = `otlp`
   - `OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE` = `cumulative` (if required by your instrumentation)
1. Deploy the new revision.

---

Your Container App is now configured to send telemetry to Elastic.

## Check telemetry in Elastic

After configuration, check that logs, traces, and metrics arrive from your application and map to the expected service identity.

Use the Elastic views that fit your workflow.

For more information about exploration and analysis in Elastic, see [Elastic Observability documentation](https://www.elastic.co/docs/solutions/observability).
