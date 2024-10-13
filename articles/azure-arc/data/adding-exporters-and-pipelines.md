---
title: Adding Exporters and Pipelines | Azure Arc-enabled Data Services
description: Learn how to add exporters and pipelines to the telemetry router
author: lcwright
ms.author: lancewright
ms.service: azure
ms.topic: how-to 
ms.date: 10/25/2022
ms.custom: template-how-to 
---

# Add exporters and pipelines to your telemetry router deployment

> [!NOTE]
>
> - The telemetry router is in Public Preview and should be deployed for **testing purposes only**.
> - While the telemetry router is in Public Preview, be advised that future preview releases could include changes to CRD specs, CLI commands, and/or telemetry router messages.
> - The current preview does not support in-place upgrades of a data controller deployed with the Arc telemetry router enabled. In order to install or upgrade a data controller in a future release, you will need to uninstall the data controller and then re-install.

## What are Exporters and Pipelines?

Exporters and Pipelines are two of the main components of the telemetry router. Exporters describe how to send data to a destination system such as Kafka. When creating an exporter, you associate it with a pipeline in order to route that type of telemetry data to that destination. You can have multiple exporters for each pipeline.

This article provides examples of how you can set up your own exporters and pipelines to route monitoring telemetry data to your own supported exporter.

### Supported Exporters

|  Exporter     | Supported Pipeline Types |
|--------------|-----------|
| Kafka       | logs, metrics      |
| Elasticsearch       | logs      |

## Configurations

All configurations are specified through the telemetry router's custom resource specification and support the configuration of exporters and pipelines.

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
| brokers      | List of brokers to connect to  |
| encoding      | Encoding for the telemetry: otlp_json or otlp_proto  |

#### Elasticsearch Exporter Settings

|  Setting     | Description |
|--------------|-----------|
| index       | This setting can be the name of an index or datastream name to publish events      |
| endpoint | Endpoint of the Elasticsearch to export to |

### Pipelines

The Telemetry Router supports logs and metrics pipelines. These pipelines are exposed in the custom resource specification of the Arc telemetry router and available for modification.

You can't remove the last pipeline from the telemetry router. If you apply a yaml file that removes the last pipeline, the service rejects the update.

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
    - certificateName: arcdata-elasticsearch-exporter
    - certificateName: cluster-ca-certificate
  exporters:
    elasticsearch:
    - caCertificateName: cluster-ca-certificate
      certificateName: arcdata-elasticsearch-exporter
      endpoint: https://logsdb-svc:9200
      index: logstash-otel
      name: arcdata
  pipelines:
    logs:
      exporters:
      - elasticsearch/arcdata
```


## Example 1: Adding a Kafka exporter for a metrics pipeline

You can test creating a Kafka exporter for a metrics pipeline that can send metrics data to your own instance of Kafka. You need to prefix the name of your metrics pipeline with `kafka/`. You can have one unnamed instance for each telemetry type. For example, "kafka" is a valid name for a metrics pipeline.
  
1. Provide your client and CA certificates in the `credentials` section through Kubernetes secrets
2. Declare the new Exporter in the `exporters` section with the needed settings - name, certificates, broker, and index. Be sure to list the new exporter under the applicable type ("kakfa:")
3. List your exporter in the `pipelines` section of the spec as a metrics pipeline. The exporter name needs to be prefixed with the type of exporter. For example, `kafka/myMetrics`

In this example, we've added a metrics pipeline called "metrics" with a single exporter (`kafka/myMetrics`) that routes to your instance of Kafka.

**arc-telemetry-router.yaml**

```yaml
apiVersion: arcdata.microsoft.com/v1beta4
kind: TelemetryRouter
metadata:
  name: arc-telemetry-router
  namespace: <namespace>
spec:
  credentials:
    certificates:
    # Step 1. Provide your client and ca certificates through Kubernetes secrets
    # where the name of the secret and its namespace are specified.
    - certificateName: <kafka-client-certificate-name>
      secretName: <name_of_secret>
      secretNamespace: <namespace_with_secret>
    - certificateName: <ca-certificate-name>
      secretName: <name_of_secret>
      secretNamespace: <namespace_with_secret>
  exporters:
    kafka:
    # Step 2. Declare your Kafka exporter with the needed settings 
    # (name, certificates, endpoint, and index to export to)
    - name: myMetrics
      # Provide your client and CA certificate names
      # for the exporter as well as any additional settings needed
      caCertificateName: <ca-certificate-name>
      certificateName: <kafka-client-certificate-name>
      broker: <kafka_broker>
      # Index can be the name of an index or datastream name to publish events to
      index: <kafka_index>
  pipelines:
    metrics:
      exporters:
      # Step 3. Assign your kafka exporter to the list
      # of exporters for the metrics pipeline.
      - kafka/myMetrics
```

```bash
kubectl apply -f arc-telemetry-router.yaml -n <namespace>
```

You've added a metrics pipeline that exports to your instance of Kafka. After you've applied the changes to the yaml file, the TelemetryRouter custom resource will go into an updating state, and the collector service will restart.

## Example 2: Adding an Elasticsearch exporter for a logs pipeline

Your telemetry router deployment can export to multiple destinations by configuring more exporters. Multiple types of exporters are supported on a given telemetry router deployment. This example demonstrates adding an Elasticsearch exporter as a second exporter. We activate this second exporter by adding it to a logs pipeline.

1. Provide your client and CA certificates in the `credentials` section through Kubernetes secrets
2. Declare the new Exporter beneath the `exporters` section with the needed settings - name, certificates, endpoint, and index. Be sure to list the new exporter under the applicable type ("Elasticsearch:").
3. List your exporter in the `pipelines` section of the spec as a logs pipeline. The exporter name needs to be prefixed with the type of exporter. For example, `elasticsearch/myLogs`

This example builds on the previous example by adding a logs pipeline for an Elasticsearch exporter (`elasticsearch/myLogs`). At the end of the example, we have two exporters with each exporter added to a different pipeline.

**arc-telemetry-router.yaml**

```yaml
apiVersion: arcdata.microsoft.com/v1beta4
kind: TelemetryRouter
metadata:
  name: arc-telemetry-router
  namespace: <namespace>
spec:
  credentials:
    certificates:
    # Step 1. Provide your client and ca certificates through Kubernetes secrets
    # where the name of the secret and its namespace are specified.
    - certificateName: <elasticsearch-client-certificate-name>
      secretName: <name_of_secret>
      secretNamespace: <namespace_with_secret>
    - certificateName: <kafka-client-certificate-name>
      secretName: <name_of_secret>
      secretNamespace: <namespace_with_secret>
    - certificateName: <ca-certificate-name>
      secretName: <name_of_secret>
      secretNamespace: <namespace_with_secret>
  exporters:
    Elasticsearch:
    # Step 2. Declare your Elasticsearch exporter with the needed settings 
    # (certificates, endpoint, and index to export to)
    - name: myLogs
      # Provide your client and CA certificate names
      # for the exporter as well as any additional settings needed
      caCertificateName: <ca-certificate-name>
      certificateName: <elasticsearch-client-certificate-name>
      endpoint: <elasticsearch_endpoint>
      # Index can be the name of an index or datastream name to publish events to
      index: <elasticsearch_index>
    kafka:
    - name: myMetrics
      caCertificateName: <ca-certificate-name>
      certificateName: <kafka-client-certificate-name>
      broker: <kafka_broker>
      index: <kafka_index>
  pipelines:
    logs:
      exporters:
        # Step 3. Add your Elasticsearch exporter to 
        # the exporters list of a logs pipeline.
      - elasticsearch/myLogs
    metrics:
      exporters:
      - kafka/myMetrics
```

```bash
kubectl apply -f arc-telemetry-router.yaml -n <namespace>
```

You now have Kafka and Elasticsearch exporters, added to metrics and logs pipelines. After you apply the changes to the yaml file, the TelemetryRouter custom resource will go into an updating state, and the collector service will restart.
