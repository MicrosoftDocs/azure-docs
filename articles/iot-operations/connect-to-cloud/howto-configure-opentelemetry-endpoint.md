---
title: Configure OpenTelemetry data flow endpoints in Azure IoT Operations (preview)
description: Learn how to configure data flow endpoints for OpenTelemetry destinations to send metrics and logs to observability platforms.
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 09/24/2025
ai-usage: ai-assisted

#CustomerIntent: As an operator, I want to understand how to configure data flow endpoints for OpenTelemetry destinations in Azure IoT Operations so that I can send metrics and logs to observability platforms like Grafana and Azure Monitor.
---

# Configure OpenTelemetry data flow endpoints (preview)

[!INCLUDE [kubernetes-management-preview-note](../includes/kubernetes-management-preview-note.md)]

OpenTelemetry data flow endpoints are used to send metrics and logs to OpenTelemetry collectors, which can then forward the data to observability platforms like Grafana dashboards and Azure Monitor. You can configure the endpoint settings, authentication, Transport Layer Security (TLS), and batching options.

## Prerequisites

- An instance of [Azure IoT Operations](../deploy-iot-ops/howto-deploy-iot-operations.md)
- An OpenTelemetry collector deployed and accessible from your Azure IoT Operations cluster

## OpenTelemetry endpoint overview

OpenTelemetry endpoints enable you to export telemetry data from Azure IoT Operations dataflows to OpenTelemetry collectors using the OpenTelemetry Protocol (OTLP). This allows you to integrate device and system telemetry into your existing observability infrastructure.

### Common scenarios

- Device diagnostics: Export temperature, pressure, and other sensor readings as metrics to monitor device health
- Factory monitoring: Send production line telemetry to Grafana dashboards for operational visibility
- System observability: Forward application logs and metrics to Azure Monitor for centralized monitoring
- Custom metrics: Add contextual attributes like factory ID or location to metrics for better filtering and analysis

### Data format requirements

OpenTelemetry endpoints require data to conform to a specific JSON schema with either a `metrics` array, a `logs` array, or both. Messages that don't conform to this schema are dropped and acknowledged to prevent message loss.

The JSON payload must use this top-level structure:

```json
{
  "metrics": [ /* array of metric objects */ ],
  "logs": [ /* array of log objects */ ]
}
```

At least one of `metrics` or `logs` must be present.

All incoming messages are validated against the required schema. Messages that fail validation are dropped, acknowledged back to the broker, and logged for troubleshooting. Common validation failures include missing required fields, invalid data types, unsupported metric types or log levels, and malformed timestamps. If MQTT messages include expiration timestamps, expired messages are filtered out before processing.

#### Metrics format

Each metric object in the `metrics` array must contain the following fields:

Required fields:
- `name` (string): The metric name
- `type` (string): The metric type (see [supported metric types](#supported-metric-types))
- `value` (number): The numeric value of the metric

Optional fields:
- `description` (string): Human-readable description of the metric
- `timestamp` (number): Unix epoch timestamp in nanoseconds when the metric was recorded
- `attributes` (array): Key-value pairs for metric labeling and filtering

```json
{
  "metrics": [
    {
      "name": "temperature",
      "description": "The temperature reading from sensor",
      "type": "f64_gauge",
      "value": 72.5,
      "timestamp": 1754851200000000000,
      "attributes": [
        {
          "key": "factoryId",
          "value": "factory1"
        },
        {
          "key": "location",
          "value": "warehouse"
        }
      ]
    }
  ]
}
```

Each attribute in the `attributes` array must have:
- `key` (string): The attribute name
- `value` (string): The attribute value (must be a string)

#### Logs format

Each log object in the `logs` array must contain the following fields:

Required fields:
- `value` (string): Log message content
- `level` (string): Log level (see [supported log levels](#supported-log-levels))

Optional fields:
- `timestamp` (number): Unix epoch timestamp in nanoseconds when the log was recorded
- `attributes` (array): Key-value pairs for log context and filtering

```json
{
  "logs": [
    {
      "value": "Device temperature sensor initialized",
      "level": "info",
      "timestamp": 1754851200000000000,
      "attributes": [
        {
          "key": "deviceId",
          "value": "sensor001"
        },
        {
          "key": "component",
          "value": "temperature-sensor"
        }
      ]
    }
  ]
}
```

Each attribute in the `attributes` array must have:
- `key` (string): The attribute name  
- `value` (string): The attribute value (must be a string)

### Supported metric types

The following OpenTelemetry metric types are supported:

- Counters: `u64_counter`, `f64_counter` - Monotonically increasing values
- Up/down counters: `i64_up_down_counter`, `f64_up_down_counter` - Values that can increase or decrease
- Gauges: `u64_gauge`, `i64_gauge`, `f64_gauge` - Point-in-time values
- Histograms: `f64_histogram`, `u64_histogram` - Distribution of values

### Supported log levels

The following log levels are supported:
- `trace`
- `debug`
- `info`
- `warn`
- `error`
- `fatal`

## Create OpenTelemetry endpoint

You can create an OpenTelemetry dataflow endpoint using the operations experience, Bicep, or Kubernetes.

# [Operations experience](#tab/portal)

1. To create an OpenTelemetry dataflow in the [operations experience](https://iotoperations.azure.com/), go to the **Dataflow endpoints**.
1. From the data flow endpoints page, identify **Open Telemetry** and select **+ New**.

    :::image type="content" source="media/howto-connect-opentelemetry/create-new-open-telemetry.png" alt-text="Screenshot of the operations experience interface showing the option to create a new OpenTelemetry endpoint":::

1. In the **Create new data flow endpoint: Open Telemetry** pane, select the **Basic** configuration tab and provide the following information:

    - **Name**: A unique name for the endpoint.
    - **Host**: The OpenTelemetry collector endpoint in the format`<host>:<port>`, for example, `otel-collector.monitoring.svc.cluster.local:4317`.
    - **Authentication method**: Choose one of the following authentication methods:
        - **Kubernetes service account token**: Uses Kubernetes service account tokens to authenticate with the OpenTelemetry collector. Provide the audience value for your OpenTelemetry collector configuration. See [Service Account Token (SAT)](#service-account-token-sat) for more details.
        - **Anonymous**: Use when the OpenTelemetry collector doesn't require authentication.
        - **X509 certificate**: Uses client certificates for mutual TLS authentication. Provide the name of a Kubernetes secret containing your client certificate. See [X.509 certificate](#x509-certificate) for more details.

    :::image type="content" source="media/howto-connect-opentelemetry/create-new-open-telemetry-basic.png" alt-text="Screenshot of the operations experience interface showing the basic tab in create a new OpenTelemetry endpoint.":::

1. Select the **Advanced** configuration tab and provide the following information:

    - **Batching latency (in seconds)**: Maximum time to wait before sending a batch. Default is 5 seconds.
    - **Message count**: Maximum number of messages in a batch. Default is 100000 messages.
    - **TLS mode**: Choose one of the following TLS modes:
        - **Enabled**: Enables TLS for secure communication with the OpenTelemetry collector. Provide the name of a Kubernetes ConfigMap containing your trusted CA certificate.
        - **Disabled**: Disables TLS.
    - **Trusted CA certificate config map name**: The name of a Kubernetes ConfigMap containing your trusted CA certificate.

    :::image type="content" source="media/howto-connect-opentelemetry/create-open-telemetry-advance.png" alt-text="Screenshot of the operations experience interface showing the advanced tab in create a new OpenTelemetry endpoint.":::

1. Select **Apply** to create the OpenTelemetry endpoint.


# [Bicep](#tab/bicep)

Create a Bicep `.bicep` file with the following content. Update the settings as needed, and replace the placeholder values like `<AIO_INSTANCE_NAME>` with your values.

```bicep
param aioInstanceName string = '<AIO_INSTANCE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'
param endpointName string = '<ENDPOINT_NAME>'
param collectorHost string = '<COLLECTOR_HOST>'

resource aioInstance 'Microsoft.IoTOperations/instances@2024-11-01' existing = {
  name: aioInstanceName
}

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

resource openTelemetryEndpoint 'Microsoft.IoTOperations/instances/dataflowEndpoints@2024-11-01' = {
  parent: aioInstance
  name: endpointName
  extendedLocation: {
    name: customLocation.id
    type: 'CustomLocation'
  }
  properties: {
    endpointType: 'OpenTelemetry'
    openTelemetrySettings: {
      host: collectorHost
      authentication: {
        method: 'ServiceAccountToken'
        serviceAccountTokenSettings: {
          audience: '<OTEL_AUDIENCE>'
        }
      }
      tls: {
        mode: 'Enabled'
        trustedCaCertificateConfigMapRef: '<CA_CONFIGMAP_NAME>'
      }
      batching: {
        latencySeconds: 5
        maxMessages: 100
      }
    }
  }
}
```

Deploy the file by running the following Azure CLI command:

```azurecli
az deployment group create --resource-group <RESOURCE_GROUP> --template-file <FILE>.bicep
```

# [Kubernetes (preview)](#tab/kubernetes)

Create a Kubernetes manifest `.yaml` file with the following content:

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: DataflowEndpoint
metadata:
  name: <ENDPOINT_NAME>
  namespace: azure-iot-operations
spec:
  endpointType: OpenTelemetry
  openTelemetrySettings:
    host: <COLLECTOR_HOST>
    authentication:
      method: ServiceAccountToken
      serviceAccountTokenSettings:
        audience: <OTEL_AUDIENCE>
    tls:
      mode: Enabled
      trustedCaCertificateConfigMapRef: <CA_CONFIGMAP_NAME>
    batching:
      latencySeconds: 5
      maxMessages: 100
```

Apply the manifest file to the Kubernetes cluster:

```bash
kubectl apply -f <FILE>.yaml
```

---

## Configuration options

This section describes configuration options for OpenTelemetry data flow endpoints.

### Host

The `host` property specifies the OpenTelemetry collector endpoint URL. Include the protocol (`http://` or `https://`) and port number.

Examples:
- `https://otel-collector.monitoring.svc.cluster.local:4317`
- `http://localhost:4317`
- `https://otel-collector:4317`

### Authentication

OpenTelemetry endpoints support several authentication methods to connect securely to collectors.

#### Service Account Token (SAT)

Service account token (SAT) authentication uses Kubernetes service account tokens to authenticate with the OpenTelemetry collector.

Replace `<OTEL_AUDIENCE>` with the audience value for your OpenTelemetry collector configuration. This value must match the expected audience on the collector.

# [Operations experience](#tab/portal)

1. In the **Create new data flow endpoint: Open Telemetry** pane, under the **Basic** configuration tab, select **Kubernetes service account token** as the authentication method.
1. Provide the **Service audience** value for your OpenTelemetry collector configuration.

    :::image type="content" source="media/howto-connect-opentelemetry/service-account-token.png" alt-text="Screenshot of the operations experience interface showing the authentication method selection in create a new OpenTelemetry endpoint.":::

> [!IMPORTANT] 
> You can only choose the authentication method when creating a new OpenTelemetry data flow endpoint. You can't change the authentication method after the OpenTelemetry data flow endpoint is created.
> If you want to change the authentication method of an existing data flow, delete the original data flow and create a new one with the new authentication method.

# [Bicep](#tab/bicep)

```bicep
authentication: {
  method: 'ServiceAccountToken'
  serviceAccountTokenSettings: {
    audience: '<OTEL_AUDIENCE>'
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
authentication:
  method: ServiceAccountToken
  serviceAccountTokenSettings:
    audience: <OTEL_AUDIENCE>
```

---

#### X.509 certificate

X.509 certificate authentication uses client certificates for mutual TLS authentication.

# [Operations experience](#tab/portal)

1. In the **Create new data flow endpoint: Open Telemetry** pane, under the **Basic** configuration tab, select **X509 certificate** as the authentication method.
1. Provide the following information from Azure Key Vault:
    
    - **Synced secret name**: The name of a Kubernetes secret containing your client certificate.
    - **X509 client certificate**: The client certificate.
    - **X509 client key**: The private key for the client certificate.
    - **X509 intermediate certificates**: The intermediate certificates for the client certificate chain.

    :::image type="content" source="media/howto-connect-opentelemetry/x-509-certificate.png" alt-text="Screenshot of the operations experience interface showing the X509 authentication method selection in create a new OpenTelemetry endpoint.":::

# [Bicep](#tab/bicep)

```bicep
authentication: {
  method: 'X509Certificate'
  x509CertificateSettings: {
    secretRef: '<X509_SECRET_NAME>'
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
authentication:
  method: X509Certificate
  x509CertificateSettings:
    secretRef: <X509_SECRET_NAME>
```

---

Before you use X.509 certificate authentication, create a Kubernetes secret with your client certificate:

```bash
kubectl create secret tls <X509_SECRET_NAME> \
  --cert=client.crt \
  --key=client.key \
  -n azure-iot-operations
```

#### Anonymous authentication

Anonymous authentication is used when the OpenTelemetry collector doesn't require authentication.

# [Operations experience](#tab/portal)

In the **Create new data flow endpoint: Open Telemetry** pane, under the **Basic** configuration tab, select **Anonymous** as the authentication method. No additional settings are required.

# [Bicep](#tab/bicep)

```bicep
authentication: {
  method: 'Anonymous'
  anonymousSettings: {}
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
authentication:
  method: Anonymous
  anonymousSettings: {}
```

---

### TLS configuration

Configure Transport Layer Security (TLS) settings for secure communication with the OpenTelemetry collector.

#### Enabled TLS with trusted CA

# [Operations experience](#tab/portal)

1. In the **Create new data flow endpoint: Open Telemetry** pane, under the **Advanced** configuration tab, select **Enabled** as the TLS mode.
1. In **Trusted CA certificate config map name** provide the name of a Kubernetes ConfigMap containing your trusted CA certificate.

# [Bicep](#tab/bicep)

```bicep
tls: {
  mode: 'Enabled'
  trustedCaCertificateConfigMapRef: '<CA_CONFIGMAP_NAME>'
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
tls:
  mode: Enabled
  trustedCaCertificateConfigMapRef: <CA_CONFIGMAP_NAME>
```

---

#### Disabled TLS

# [Operations experience](#tab/portal)

In the **Create new data flow endpoint: Open Telemetry** pane, under the **Advanced** configuration tab, select **Disabled** as the TLS mode.

# [Bicep](#tab/bicep)

```bicep
tls: {
  mode: 'Disabled'
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
tls:
  mode: Disabled
```

---

### Batching

Configure batching settings to optimize performance by grouping multiple messages before sending to the collector.

# [Operations experience](#tab/portal)

In the **Create new data flow endpoint: Open Telemetry** pane, under the **Advanced** configuration tab, provide the following batching settings:
    
  - **Batching latency (in seconds)**: Maximum time to wait before sending a batch. Default is 5 seconds.
  - **Message count**: Maximum number of messages in a batch. Default is 100000 messages.

# [Bicep](#tab/bicep)

```bicep
batching: {
  latencySeconds: 5
  maxMessages: 100
}
```

| Property | Description | Default |
|----------|-------------|---------|
| `latencySeconds` | Maximum time to wait before sending a batch. | 60 seconds |
| `maxMessages` | Maximum number of messages in a batch. | 100000 messages |

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
batching:
  latencySeconds: 5
  maxMessages: 100
```

| Property | Description | Default |
|----------|-------------|---------|
| `latencySeconds` | Maximum time to wait before sending a batch. | 60 seconds |
| `maxMessages` | Maximum number of messages in a batch. | 100000 messages |

---



## Error handling and troubleshooting

### Message validation

OpenTelemetry endpoints validate incoming messages against the required schema. Invalid messages are dropped and acknowledged to prevent message loss in the dataflow pipeline.

Common validation errors:
- Missing required fields (`name`, `type`, `value` for metrics; `value`, `level` for logs)
- Invalid metric types or log levels
- Non-numeric values in metric `value` fields
- Malformed timestamp values

### Delivery guarantees

The OpenTelemetry endpoint provides delivery guarantees to the collector itself, but not to upstream services that the collector can forward data to. Once data reaches the collector, Azure IoT Operations doesn't have visibility into whether it reaches the final destination.

## Related content

- [Create a data flow](howto-create-dataflow.md)
- [Configure data flow endpoints](howto-configure-dataflow-endpoint.md)
- [Configure MQTT data flow endpoints](howto-configure-mqtt-endpoint.md)
