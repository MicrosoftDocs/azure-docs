---
title: Deploy telemetry router | Azure Arc-enabled data services
description: Learn how to deploy the Azure Arc Telemetry Router
author: lcwright
ms.author: lancewright
ms.service: azure
ms.topic: how-to 
ms.date: 09/07/2022
ms.custom: template-how-to
---

# Deploy the Azure Arc telemetry Router

> [!NOTE]
>
> - The telemetry router is in Public Preview and should be deployed for **testing purposes only**.
> - While the telemetry router is in Public Preview, be advised that future preview releases could include changes to CRD specs, CLI commands, and/or telemetry router messages.
> - The current preview does not support in-place upgrades of a data controller deployed with the Arc telemetry router enabled. In order to install or upgrade a data controller in a future release, you will need to uninstall the data controller and then re-install.

## What is the Azure Arc Telemetry Router?

The Azure Arc telemetry router enables exporting telemetry data to other monitoring solutions. For this Public Preview, we only support exporting log data to either Kafka or Elasticsearch and metric data to Kafka.

This document specifies how to deploy the telemetry router and configure it to work with the supported exporters.

## Prerequisites

Deploy and connect to an [Arc-enabled Kubernetes cluster in indirectly connected mode](/create-complete-managed-instance-indirectly-connected.md).

## Configurations

All configurations are specified through the telemetry router's custom resource specification and supports the configuration of exporters and pipelines.

### Exporters

For the Public Preview, exporters are partially configurable and support the following solutions:

|  Exporter     | Supported Telemetry Types |
|--------------|-----------|
| Kafka       | logs, metrics      |
| Elasticsearch       | logs      |

The following properties are currently configurable during the Public Preview:

#### General Exporter Settings

|  Setting     | Description |
|--------------|-----------|
| certificateName     | The client certificate in order to export to the monitoring solution  |
| caCertificateName      | The cluster's Certificate Authority or customer-provided certificate for the Exporter  |

#### Kafka Exporter Settings

|  Setting     | Description |
|--------------|-----------|
| topic       | Name of the topic to export |
| brokers      | Broker service endpoint  |
| encoding      | Encoding for the telemetry: otlp_json or otlp_proto  |

#### Elasticsearch Exporter Settings

|  Setting     | Description |
|--------------|-----------|
| index       | This setting can be the name of an index or datastream name to publish events      |

### Pipelines

The Telemetry Router supports logs and metrics pipelines. These pipelines are exposed in the custom resource specification of the Arc telemetry router and available for modification.  All pipelines must be prefixed with the type of exporter that will be used. For example, `elasticsearch/mylogs`

#### Pipeline Settings

|  Setting     | Description |
|--------------|-----------|
| logs       | Can only declare new logs pipelines       |
| metrics | Can only declare new metrics pipelines |
| exporters       | List of exporters. Can be multiple of the same type     |

### Credentials

#### Credentials Settings

|  Setting     | Description |
|--------------|-----------|
| certificateName       | Name of the certificate must correspond to the certificate name specified in the exporter declaration       |
| secretName       | Name of the secret provided through Kubernetes      |
| secretNamespace       | Namespace with secret provided through Kubernetes      |

## Example TelemetryRouter Specification

```yaml
apiVersion: arcdata.microsoft.com/v1beta4
kind: TelemetryRouter
metadata:
  name: arc-telemetry-router
  namespace: <namespace>
spec:
  credentials:
    certificates:
    - certificateName: arcdata-msft-elasticsearch-exporter-internal
    - certificateName: cluster-ca-certificate
  exporters:
    elasticsearch:
    - caCertificateName: cluster-ca-certificate
      certificateName: arcdata-msft-elasticsearch-exporter-internal
      endpoint: https://logsdb-svc:9200
      index: logstash-otel
      name: arcdata/msft/internal
  pipelines:
    logs:
      exporters:
      - elasticsearch/arcdata/msft/internal
```

## Deployment

> [!NOTE]
> 
> The telemetry router currently supports indirectly connected mode only.

### Create a Custom Configuration Profile

After setting up your Kubernetes cluster, you'll need to [create a custom configuration profile](create-custom-configuration-template.md) and enable a temporary feature flag that will deploy the telemetry router during data controller creation.

### Turn on the Feature Flag

After creating the custom configuration profile, you'll need to edit the profile to add the `monitoring` property with the `enableOpenTelemetry` flag set to `true`. You can set the feature flag by running the following az CLI commands (edit the --path parameter, as necessary):

```bash
az arcdata dc config add --path ./control.json --json-values ".spec.monitoring={}"
az arcdata dc config add --path ./control.json --json-values ".spec.monitoring.enableOpenTelemetry=true"
```

To confirm the flag was set correctly, open the control.json file and confirm the `monitoring` object was added to the `spec` object and `enableOpenTelemetry` is set to `true`, as shown below.

```yaml
spec:
    monitoring:
        enableOpenTelemetry: true
```

Note that this feature flag requirement will be removed on a future release.

### Create the Data Controller

After creating the custom configuration profile and setting the feature flag, you're ready to [create the data controller using indirect connectivity mode](create-data-controller-indirect-cli.md?tabs=linux). Be sure to replace the `--profile-name` parameter with a `--path` parameter that points to your custom control.json file (see [use custom control.json file to deploy Azure Arc-enabled data controller](https://learn.microsoft.com/en-us/azure/azure-arc/data/create-custom-configuration-template#use-custom-controljson-file-to-deploy-azure-arc-enabled-data-controller-using-azure-cli-az))

### Verify Telemetry Router Deployment

When the data controller is created, a TelemetryRouter custom resource is also created. Data controller deployment will only be marked ready when both custom resources have finished deploying. After the data controller finishes deployment, you can use the following command to verify that the TelemetryRouter exists:

```bash
kubectl describe telemetryrouter arc-telemetry-router -n <namespace>
```

```yaml
apiVersion: arcdata.microsoft.com/v1beta4
  kind: TelemetryRouter
  metadata:
    name: arc-telemetry-router
    namespace: <namespace>
  spec:
    credentials:
      certificates:
      - certificateName: arcdata-msft-elasticsearch-exporter-internal
      - certificateName: cluster-ca-certificate
    exporters:
      elasticsearch:
      - caCertificateName: cluster-ca-certificate
        certificateName: arcdata-msft-elasticsearch-exporter-internal
        endpoint: https://logsdb-svc:9200
        index: logstash-otel
        name: arcdata/msft/internal
    pipelines:
      logs:
        exporters:
        - elasticsearch/arcdata/msft/internal

```

For the public preview, the pipeline and exporter are have a default pre-configuration to Microsoft's deployment of Elasticsearch. This default deployment gives you an example of how the parameters for credentials, exporters, and pipelines are setup within the spec. You can follow this example to export to your own monitoring solutions. See [adding exporters and pipelines](adding-exporters-and-pipelines.md) for additional examples. This example deployment will be removed at the conclusion of the public preview.

When you deploy the telemetry router, two TelemetryCollector custom resources are also created. You can run the following commands to see detailed configuration of the wrapped TelemetryCollector resources and their deployment status:

```bash
kubectl describe TelemetryCollector collector-inbound -n <namespace>
kubectl describe TelemetryCollector collector-outbound -n <namespace>
```

```yaml
Name:         collector-inbound
Namespace:    <namespace>
Labels:       <none>
Annotations:  <none>
API Version:  arcdata.microsoft.com/v1beta2
Kind:         TelemetryCollector
Spec:
  Collector:
    Exporters:
      kafka/arcdata/msft/logs:
        Brokers:           kafka-broker-svc:9092
        Encoding:          otlp_proto
        protocol_version:  2.0.0
        auth:
          Tls:
            ca_file:    cluster-ca-certificate
            cert_file:  arcdata-msft-kafka-exporter-internal
            key_file:   arcdata-msft-kafka-exporter-internal
        Topic:        arcdata.microsoft.com.logs
      kafka/arcdata/msft/metrics:
        Brokers:           kafka-broker-svc:9092
        Encoding:          otlp_proto
        protocol_version:  2.0.0
        auth:
          Tls:
            ca_file:    cluster-ca-certificate
            cert_file:  arcdata-msft-kafka-exporter-internal
            key_file:   arcdata-msft-kafka-exporter-internal
        Topic:        arcdata.microsoft.com.metrics
    Extensions:
      memory_ballast:
        size_mib:  683
    Limits:        <nil>
    Processors:
      Batch:
        send_batch_max_size:  500
        send_batch_size:      100
        Timeout:              10s
      memory_limiter:
        check_interval:   5s
        limit_mib:        1500
        spike_limit_mib:  512
    Receivers:
      Collectd:
        Endpoint:  0.0.0.0:8003
      Fluentforward:
        Endpoint:  0.0.0.0:8002
    Requests:      <nil>
    Service:
      Extensions:
        memory_ballast
      Pipelines:
        Logs:
          Exporters:
            kafka/arcdata/msft/logs
          Processors:
            memory_limiter
            batch
          Receivers:
            fluentforward
        Metrics:
          Exporters:
            kafka/arcdata/msft/metrics
          Processors:
            memory_limiter
            batch
          Receivers:
            collectd
    Storage:  <nil>
  Credentials:
    Certificates:
      Certificate Name:  arcdata-msft-kafka-exporter-internal
      Secret Name:       <secret>
      Secret Namespace:  <secret namespace>
  Update:                <nil>
Events:             <none>

```

```yaml
Name:         collector-outbound
Namespace:    arc
Labels:       <none>
Annotations:  <none>
API Version:  arcdata.microsoft.com/v1beta2
Kind:         TelemetryCollector
Spec:
  Collector:
    Exporters:
      elasticsearch/arcdata/msft/internal:
        Endpoints:
          https://logsdb-svc:9200
        Index:  logstash-otel
        Tls:
          ca_file:    cluster-ca-certificate
          cert_file:  arcdata-msft-elasticsearch-exporter-internal
          key_file:   arcdata-msft-elasticsearch-exporter-internal
    Extensions:
      memory_ballast:
        size_mib:  683
    Limits:        <nil>
    Processors:
      Batch:
        send_batch_max_size:  500
        send_batch_size:      100
        Timeout:              10s
      memory_limiter:
        check_interval:   5s
        limit_mib:        1500
        spike_limit_mib:  512
    Receivers:
      kafka/arcdata/msft/logs:
        Auth:
          Tls:
            ca_file:       cluster-ca-certificate
            cert_file:     arcdata-msft-kafka-receiver-internal
            key_file:      arcdata-msft-kafka-receiver-internal
        Brokers:           kafka-broker-svc:9092
        Encoding:          otlp_proto
        protocol_version:  2.0.0
        Topic:             arcdata.microsoft.com.logs
      kafka/arcdata/msft/metrics:
        Auth:
          Tls:
            ca_file:       cluster-ca-certificate
            cert_file:     arcdata-msft-kafka-receiver-internal
            key_file:      arcdata-msft-kafka-receiver-internal
        Brokers:           kafka-broker-svc:9092
        Encoding:          otlp_proto
        protocol_version:  2.0.0
        Topic:             arcdata.microsoft.com.metrics
    Requests:              <nil>
    Service:
      Extensions:
        memory_ballast
      Pipelines:
        Logs:
          Exporters:
            elasticsearch/arcdata/msft/internal
          Processors:
            memory_limiter
            batch
          Receivers:
            kafka/arcdata/msft/logs
    Storage:  <nil>
  Credentials:
    Certificates:
      Certificate Name:  arcdata-msft-kafka-receiver-internal
      Secret Name:       <secret>
      Secret Namespace:  <secret namespace>
      Certificate Name:  arcdata-msft-elasticsearch-exporter-internal
      Secret Name:       <secret>
      Secret Namespace:  <secret namespace>
      Certificate Name:  cluster-ca-certificate
      Secret Name:       <secret>
      Secret Namespace:  <secret namespace>
  Update:                <nil>
Events:             <none>

```

After deploying the TelemetryRouter, both TelemetryCollector custom resources should be in a *Ready* state. These resources are system managed and editing them isn't supported. If you look at the pods, you should see the following:

- Two telemetry collector pods - `arctc-collector-inbound-0` and `arctc-collector-outbound-0`
- A kakfa broker pod - `arck-arc-router-kafka-broker-0`
- A kakfa controller pod - `arck-arc-router-kafka-controller-0`

```bash
kubectl get pods -n <namespace>

NAME                                 READY   STATUS      RESTARTS   AGE
arc-bootstrapper-job-4z2vr           0/1     Completed   0          15h
arc-webhook-job-facc4-z7dd7          0/1     Completed   0          15h
arck-arc-router-kafka-broker-0       2/2     Running     0          15h
arck-arc-router-kafka-controller-0   2/2     Running     0          15h
arctc-collector-inbound-0            2/2     Running     0          15h
arctc-collector-outbound-0           2/2     Running     0          15h
bootstrapper-8d5bff6f7-7w88j         1/1     Running     0          15h
control-vpfr9                        2/2     Running     0          15h
controldb-0                          2/2     Running     0          15h
logsdb-0                             3/3     Running     0          15h
logsui-fwrh9                         3/3     Running     0          15h
metricsdb-0                          2/2     Running     0          15h
metricsdc-bc4df                      2/2     Running     0          15h
metricsdc-fm7jh                      2/2     Running     0          15h
metricsdc-qgl26                      2/2     Running     0          15h
metricsdc-sndjv                      2/2     Running     0          15h
metricsdc-xh78q                      2/2     Running     0          15h
metricsui-qqgbv                      2/2     Running     0          15h
```

## Next steps

- [Add exporters and pipelines to your telemetry router](/adding-exporters-and-pipelines.md)