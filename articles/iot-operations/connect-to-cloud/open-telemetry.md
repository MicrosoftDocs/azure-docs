---
title: Configure OpenTelemetry data flow endpoints in Azure IoT Operations (preview)
description: Learn how to configure data flow endpoints for OpenTelemetry destinations to send metrics and logs to observability platforms.
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 02/24/2026
ai-usage: ai-assisted

#CustomerIntent: As an operator, I want to understand how to configure data flow endpoints for OpenTelemetry destinations in Azure IoT Operations so that I can send metrics and logs to observability platforms like Grafana and Azure Monitor.
---

# Configure OpenTelemetry data flow endpoints (preview)

[!INCLUDE [kubernetes-management-preview-note](../includes/kubernetes-management-preview-note.md)]

OpenTelemetry (OTEL) data flow endpoints send metrics and logs to OpenTelemetry collectors, which can then forward the data to observability platforms like Grafana dashboards and Azure Monitor. You can configure the endpoint settings, authentication, Transport Layer Security (TLS), and batching options.

This article describes how to create and configure an OpenTelemetry dataflow endpoint to export asset data from your MQTT broker to an OpenTelemetry collector. The article describes the *OTEL dataflow endpoint*, which routes asset data from the MQTT broker to external OTEL collectors. You can also send asset data to observability endpoints using the OpenTelemetry dataflow endpoint if you want to route telemetry to platforms like Grafana or Azure Monitor.
 
This feature is for routing device and asset data, not for collecting Azure IoT Operations component health metrics or logs. For cluster observability (monitoring the health of the MQTT broker, dataflow components, and so on), see [Configure observability and monitoring](../configure-observability-monitoring/howto-configure-observability.md).

## Prerequisites

- An instance of [Azure IoT Operations](../deploy-iot-ops/howto-deploy-iot-operations.md).
- An OpenTelemetry collector deployed and accessible from your Azure IoT Operations cluster.
- Administrative access to your Azure IoT Operations cluster.

## Terminology

| Term                    | Definition                                                                                                                                                                         |
|-------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| OTEL dataflow endpoint                    | A destination‑only dataflow endpoint that exports asset telemetry to an OpenTelemetry (OTEL) collector using OTLP. It can't be used as a source.                                                                  |
| OTLP                    | The OpenTelemetry Protocol (OTLP) is the default protocol for sending telemetry data to an OpenTelemetry Collector.                                                                |
| OTEL Collector (for cluster observability)          | A separate third-party component that collects Azure IoT Operations component metrics and logs for cluster health monitoring. For more information, see [Configure observability and monitoring](../configure-observability-monitoring/howto-configure-observability.md).                                                                                             |
| OpenTelemetry Exporter           | A component that sends observability data to a destination backend.                                                                                                                |

## OpenTelemetry endpoint overview

By using OpenTelemetry endpoints, you can export device and asset telemetry data from Azure IoT Operations dataflows to OpenTelemetry collectors by using the OpenTelemetry Protocol (OTLP). By using this feature, you can integrate device and system telemetry into your existing observability infrastructure.

In Azure IoT Operations, OpenTelemetry lets you:

- Export asset telemetry as OTEL metrics: send sensor readings, production data, or equipment status to observability platforms.
- Route data without modifying devices: transform MQTT messages to OTEL format at the dataflow layer.
- Collect and export telemetry data to your preferred observability platform.
- Integrate with existing observability pipelines: send data to any OTLP-compatible backend (Grafana, Prometheus, Azure Monitor, and Datadog).

OTEL dataflow endpoints are first-class endpoints in Azure IoT Operations. They appear in the list of available dataflow endpoints in the Operations experience portal and can be selected when configuring modern dataflow graphs. This approach makes it straightforward to route telemetry to OTEL-compatible backends while keeping a consistent configuration experience.

### Common scenarios

The following are common scenarios for using OpenTelemetry endpoints in Azure IoT Operations:

- Device diagnostics: Export temperature, pressure, and other sensor readings as metrics to monitor device health.
- Factory monitoring: Send production line telemetry to Grafana dashboards for operational visibility.
- System observability: Forward application logs and metrics to Azure Monitor for centralized monitoring.
- Custom metrics: Add contextual attributes like factory ID or location to metrics for better filtering and analysis.

### Data format requirements

OpenTelemetry endpoints require data to conform to a specific JSON schema with either a `metrics` array, a `logs` array, or both. The system drops and acknowledges messages that don't conform to this schema to prevent message loss.

The JSON payload must use this top-level structure:

```json
{
  "metrics": [ /* array of metric objects */ ],
  "logs": [ /* array of log objects */ ]
}
```

You must include at least one `metrics` or `logs` value.

The system validates all incoming messages against the required schema. It drops and acknowledges messages that fail validation back to the broker, and logs the errors for troubleshooting. Common validation failures include missing required fields, invalid data types, unsupported metric types or log levels, and malformed timestamps. If MQTT messages include expiration timestamps, the system filters out expired messages before processing.

#### Metrics format

Each metric object in the `metrics` array must have the following fields:

Required fields:
- `name` (string): The metric name.
- `type` (string): The metric type (see [supported metric types](#supported-metric-types)).
- `value` (number): The numeric value of the metric.

Optional fields:
- `description` (string): Human-readable description of the metric.
- `timestamp` (number): Unix epoch timestamp in nanoseconds when the metric was recorded.
- `attributes` (array): Key-value pairs for metric labeling and filtering.

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
- `key` (string): The attribute name.
- `value` (string): The attribute value (must be a string).

#### Logs format

Each log object in the `logs` array must contain the following fields:

Required fields:
- `value` (string): Log message content.
- `level` (string): Log level (see [supported log levels](#supported-log-levels)).

Optional fields:
- `timestamp` (number): Unix epoch timestamp in nanoseconds when the log was recorded.
- `attributes` (array): Key-value pairs for log context and filtering.

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
- `key` (string): The attribute name.
- `value` (string): The attribute value (must be a string).

### Supported metric types

The following OpenTelemetry metric types are supported:

- Counters: `u64_counter`, `f64_counter` - Monotonically increasing values.
- Up/down counters: `i64_up_down_counter`, `f64_up_down_counter` - Values that can increase or decrease.
- Gauges: `u64_gauge`, `i64_gauge`, `f64_gauge` - Point-in-time values.
- Histograms: `f64_histogram`, `u64_histogram` - Distribution of values.

### Supported log levels

The following log levels are supported:
- `trace`
- `debug`
- `info`
- `warn`
- `error`
- `fatal`

## Create OpenTelemetry endpoint

You can create an OpenTelemetry dataflow endpoint by using the IoT Operations experience, Bicep, or Kubernetes.

The dataflow endpoint appears in the list of available dataflow endpoints in the Azure IoT Operations experience. This addition ensures that you can easily identify and select the OpenTelemetry endpoint when configuring telemetry pipelines, promoting better integration and visibility across monitoring tools. By surfacing the OTEL endpoint along with other dataflow options, you can route telemetry data and maintain consistent observability standards across assets more efficiently.

# [Operations experience](#tab/portal)

1. To create an OpenTelemetry dataflow in the [IoT Operations experience](https://iotoperations.azure.com/), select **Dataflow endpoints**.
1. From the **Dataflow endpoints** page, select **Open Telemetry**, and then select **+ New**.

   :::image type="content" source="media/open-telemetry/dataflow-endpoints.png" alt-text="Screenshot showing endpoints screen." lightbox="media/open-telemetry/dataflow-endpoints.png" :::

1. In the **Create new data flow endpoint: Open Telemetry** pane, select the **Basic** configuration tab and enter the following information:

    - **Name**: A unique name for the endpoint.
    - **Host**: The OpenTelemetry collector endpoint in the format `<host>:<port>`. For example, `otel-collector.monitoring.svc.cluster.local:4317`.
    - **Authentication method**: Choose one of the following authentication methods:
        - **Kubernetes service account token**: Uses Kubernetes service account tokens to authenticate with the OpenTelemetry collector. Enter the audience value for your OpenTelemetry collector configuration. For more information, see [Service Account Token (SAT)](#service-account-token-sat).
        - **Anonymous**: Use when the OpenTelemetry collector [doesn't require authentication](#anonymous-authentication).
        - **X509 certificate**: Uses client certificates for mutual TLS authentication. Enter the name of a Kubernetes secret containing your client certificate. For more information, see [X.509 certificate](#x509-certificate).

   :::image type="content" source="media/open-telemetry/create-new-open-telemetry-basic.png" alt-text="Screenshot of the operations experience interface showing the basic tab in create a new OpenTelemetry endpoint." lightbox="media/open-telemetry/create-new-open-telemetry-basic.png":::

1. Select the **Advanced** configuration tab and enter the following information:

    - **Batching latency (in seconds)**: Maximum time to wait before sending a batch. The default value is 5 seconds.
    - **Message count**: Maximum number of messages in a batch. The default value is 100,000 messages.
    - **TLS mode**: Choose one of the following TLS modes:
        - **Enabled**: Enable TLS for secure communication with the OpenTelemetry collector. Enter the name of a Kubernetes ConfigMap containing your trusted CA certificate.
        - **Disabled**: Disables TLS.
    - **Trusted CA certificate ConfigMap name**: The name of a Kubernetes ConfigMap containing your trusted CA certificate.

   :::image type="content" source="media/open-telemetry/create-open-telemetry-advance.png" alt-text="Screenshot of the operations experience interface showing the advanced tab in create a new OpenTelemetry endpoint." lightbox="media/open-telemetry/create-open-telemetry-advance.png":::

1. Select **Apply** to create the OpenTelemetry endpoint.

# [Bicep](#tab/bicep)

Create a Bicep **.bicep** file with the following content. Update the settings as needed and replace the placeholder values like `<AIO_INSTANCE_NAME>` with your values. Replace `<OTEL_AUDIENCE>` with the audience value for your OpenTelemetry collector configuration. This value matches the expected audience on the collector.

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

Create a Kubernetes manifest **.yaml** file with the following content. Replace `<OTEL_AUDIENCE>` with the audience value for your OpenTelemetry collector configuration. This value must match the expected audience on the collector:

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

This section describes the configuration options for OpenTelemetry data flow endpoints.

### Host

Specify the OpenTelemetry collector endpoint URL in the `host` property. Include the protocol (`http://` or `https://`) and port number.

Examples:
- `https://otel-collector.monitoring.svc.cluster.local:4317`
- `http://localhost:4317`
- `https://otel-collector:4317`

### Authentication

OpenTelemetry endpoints support several authentication methods to securely connect to collectors.

#### Service Account Token (SAT)

Service account token (SAT) authentication uses Kubernetes service account tokens to authenticate with the OpenTelemetry collector.

Replace `<OTEL_AUDIENCE>` with the audience value for your OpenTelemetry collector configuration. This value must match the expected audience on the collector.

# [Operations experience](#tab/portal)

1. In the **Create new data flow endpoint: Open Telemetry** pane, under the **Basic** configuration tab, select **Kubernetes service account token** as the authentication method.
1. Provide the **Service audience** value for your OpenTelemetry collector configuration.

    :::image type="content" source="media/open-telemetry/service-account-token.png" alt-text="Screenshot of the operations experience interface showing the authentication method selection in create a new OpenTelemetry endpoint." lightbox="media/open-telemetry/service-account-token.png":::

> [!IMPORTANT] 
> You can only choose the authentication method when creating a new OpenTelemetry data flow endpoint. You can't change the authentication method after the OpenTelemetry data flow endpoint is created.
> To change the authentication method for an existing data flow, delete the original data flow and create a new one with the new authentication method.

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

1. In **Create new data flow endpoint: Open Telemetry**, under the **Basic** configuration tab, select **X509 certificate** as the authentication method.
1. Enter the following information from Azure Key Vault:
    
    - **Synced secret name**: The name of a Kubernetes secret containing your client certificate.
    - **X509 client certificate**: The client certificate.
    - **X509 client key**: The private key for the client certificate.
    - **X509 intermediate certificates**: The intermediate certificates for the client certificate chain.

    :::image type="content" source="media/open-telemetry/x-509-certificate.png" alt-text="Screenshot of the operations experience interface showing the X509 authentication method selection in create a new OpenTelemetry endpoint." lightbox="media/open-telemetry/x-509-certificate.png":::

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

Use anonymous authentication when the OpenTelemetry collector doesn't require authentication.

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

1. In **Create new data flow endpoint: Open Telemetry**, under the **Advanced** configuration tab, select **Enabled** as the TLS mode.
1. In **Trusted CA certificate config map name**, enter the name of a Kubernetes ConfigMap that contains your trusted CA certificate.

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

In **Create new data flow endpoint: Open Telemetry**, under the **Advanced** configuration tab, select **Disabled** as the TLS mode.

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

Configure batching settings to optimize performance by grouping multiple messages before sending them to the collector.

# [Operations experience](#tab/portal)

In the **Create new data flow endpoint: Open Telemetry** pane, under the **Advanced** configuration tab, enter the following batching settings:
    
  - **Batching latency (in seconds)**: Maximum time to wait before sending a batch. The default value is 5 seconds.
  - **Message count**: Maximum number of messages in a batch. The default value is 100,000 messages.

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
|----------|-------------|---------||
| `latencySeconds` | Maximum time to wait before sending a batch. | 60 seconds |
| `maxMessages` | Maximum number of messages in a batch. | 100000 messages |

---

## Use OpenTelemetry endpoints in dataflow graphs

Select OTEL dataflow endpoints as destinations in modern dataflow graphs. By using this feature, you can route metrics and logs directly to OTEL‑compatible backends. OTEL endpoints aren't available as destinations in classic dataflows. This restriction ensures compatibility with backends that don't support OTEL endpoints.

:::image type="content" source="media/open-telemetry/dataflow-graphs.png" alt-text="Screenshot showing dataflow graphs." lightbox="media/open-telemetry/dataflow-graphs.png":::

:::image type="content" source="media/open-telemetry/dataflow-graphs-destination.png" alt-text="Screenshot showing endpoint destination properties.":::

## Walkthrough: Configure an OTEL dataflow endpoint

This section provides a step-by-step walkthrough to create and configure an OTEL dataflow endpoint in Azure IoT Operations.

### Step 1: Create a new OTEL dataflow endpoint

When you create a new dataflow endpoint, select **OpenTelemetry (OTEL)** as the endpoint type. Make sure the host is prefixed with `http://`.

:::image type="content" source="media/open-telemetry/create-dataflow.png" alt-text="Screenshot showing configuration of new endpoint." lightbox="media/open-telemetry/create-dataflow.png":::

Follow the steps in [Deploy observability resources and set up logs](../configure-observability-monitoring/howto-configure-observability.md).

### Step 2: Create a dataflow graph using the OTEL endpoint

Create a dataflow with the asset as the source. Ensure the metric you want to send to OTEL is a datapoint in the asset. The following example uses a temperature value.
Select **OTEL dataflow graph**:

:::image type="content" source="media/open-telemetry/add-graph.png" alt-text="Screenshot of operations experience showing dataflow graph." lightbox="media/open-telemetry/add-graph.png":::

:::image type="content" source="media/open-telemetry/add-graph-2.png" alt-text="Screenshot of source node in graph." lightbox="media/open-telemetry/add-graph-2.png":::

### Step 3: Configure the OTEL endpoint as the destination

Select the source node and enter the details. In this example, you select the temperature metric as the datapoint to send to the OTEL endpoint.

:::image type="content" source="media/open-telemetry/endpoint-details.png" alt-text="Screenshot showing details screen." lightbox="media/open-telemetry/endpoint-details.png":::

Select **OTEL** as the destination, and enter the required details.

:::image type="content" source="media/open-telemetry/destination.png" alt-text="Screenshot showing otel as the destination." lightbox="media/open-telemetry/destination.png":::

:::image type="content" source="media/open-telemetry/destination-alternate.png" alt-text="Screenshot showing destination details." lightbox="media/open-telemetry/destination-alternate.png":::

## Error handling and troubleshooting

This section describes error handling and troubleshooting information for OpenTelemetry endpoints.

### Message validation

OpenTelemetry endpoints validate incoming messages against the required schema. The system drops invalid messages and acknowledges them to prevent message loss in the dataflow pipeline.

Common validation errors include:
- Missing required fields (`name`, `type`, and `value` for metrics; `value` and `level` for logs)
- Invalid metric types or log levels
- Non-numeric values in metric `value` fields
- Malformed timestamp values

### Delivery guarantees

The OpenTelemetry endpoint provides delivery guarantees to the collector itself, but not to upstream services that the collector can forward data to. After data reaches the collector, Azure IoT Operations doesn't have visibility into whether it reaches the final destination.

## Related content

- [Create a data flow](howto-create-dataflow.md)
- [Configure data flow endpoints](howto-configure-dataflow-endpoint.md)
- [Configure MQTT data flow endpoints](howto-configure-mqtt-endpoint.md)

