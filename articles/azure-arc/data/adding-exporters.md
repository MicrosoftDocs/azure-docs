---
title: Adding Exporters | Azure Arc-enabled Data Services
description: Learn how to add exporters to the telemetry router
author: lcwright
ms.author: lancewright
ms.service: azure
ms.topic: how-to 
ms.date: 10/25/2022
ms.custom: template-how-to 
---

> [!NOTE]
>
> - The telemetry router is currently in Public Preview and you should only deploy it for **testing purposes only**.
> - While the telemetry router is in Public Preview, be advised that future preview releases could include schema changes.
> - In-place upgrades of a data controller deployed with the Arc telemetry router enabled are not currently available in the current preview. In order to install a data controller in a future release, you will need to uninstall the data controller and then re-install.

# Add exporters to your telemetry router deployment

This article will walk you through how to set up your own exporters, allowing you to export to your own deployments of Kafka or Elasticsearch.

We currently support exporting logs to Kafka or Elasticsearch. Metrics can be exported to Kafka only.

## Prerequisites

- An instance of the Azure Arc telemetry router is deployed and running. See [Deploy telemetry router](/deploy-telemetry-router.md)

## Example 1: Add an Elasticsearch exporter for a logs pipeline

You can test adding your own Elasticsearch exporter to send logs and metrics to your deployment of Elasticsearch by doing the following steps:

1. Add your Elasticsearch exporter to the exporters list beneath `pipelines`
2. Declare your Elasticsearch exporter with the needed settings - certificates, endpoint, and index
3. Provide your client and CA certificates in the credentials section through Kubernetes secrets

In this example, we've added an Elasticsearch exporter to the `exampleLogsPipeline` logs pipeline and declared it in the list of Exporters.

**router.yaml**

```yaml
apiVersion: arcdata.microsoft.com/v1beta2
kind: TelemetryRouter
metadata:
  name: arc-telemetry-router
  namespace: <namespace>
spec:
  collector:
    pipelines:
      logs:
        exporters:
        - elasticsearch/arcdata/msft/internal
        # 1. Add your logs Elasticsearch exporter to the exporters list.
        - elasticsearch/exampleLogsPipeline
    exporters:
      # 2. Declare your Elasticsearch exporter with the needed settings (certificates, endpoint, and index to export to)
      elasticsearch/exampleLogsPipeline:
        # Provide your client and CA certificate names
        # for the exporter as well as any additional settings needed
        caCertificateName: <ca-certificate-name>
        certificateName: <elasticsearch-client-certificate-name>
        endpoint: <elasticsearch_endpoint>
        settings:
          # Currently supported properties include: index
          # This can be the name of an index or datastream name to publish events to
          index: <elasticsearch_index>
      elasticsearch/arcdata/msft/internal:
        caCertificateName: cluster-ca-certificate
        certificateName: arcdata-msft-elasticsearch-exporter-internal
        endpoint: https://logsdb-svc:9200
        settings:
          index: logstash-otel
  credentials:
    certificates:
    - certificateName: arcdata-msft-elasticsearch-exporter-internal
    - certificateName: cluster-ca-certificate
    # 3. Provide your client and ca certificates through Kubernetes secrets
    # where the name of the secret and its namespace are specified.
    - certificateName: <elasticsearch-client-certificate-name>
      secretName: <name_of_secret>
      secretNamespace: <namespace_with_secret>
    - certificateName: <ca-certificate-name>
      secretName: <name_of_secret>
      secretNamespace: <namespace_with_secret>
```

```bash
kubectl apply -f router.yaml -n <namespace>
```

You've added an Elasticsearch exporter that exports the logs pipeline to your instance of Elasticsearch. After you've applied the changes, the TelemetryRouter custom resource will go into an updating state, and the collector service will restart.

### Example 2: Add a Kafka exporter to your Metrics and Logs Pipelines

You can test adding your own Kafka exporter to send logs and/or metrics to your deployment of Kafka by doing the following steps:

1. Add your Kafka exporter to the exporters list beneath `pipelines`. 
   1. You can add a Kafka exporter to the Logs and/or Metrics pipeline.
   2. You can use the same Kafka exporter for both lots and metrics pipelines, or you can assign separate exporters to each pipeline.
2. Declare your Kafka exporter(s) with the needed settings - topic, broker, and encoding
3. Provide your client and CA certificates in the credentials section through Kubernetes secrets

In the example below, we've created two Kafka exporters - `logsPipelineExample` and `metricsPipelineExample` - and mapped them to the applicable pipelines. Each exporter is declared in the list of Exporters.

**router.yaml**

```yaml
apiVersion: arcdata.microsoft.com/v1beta2
kind: TelemetryRouter
metadata:
  name: arc-telemetry-router
  namespace: <namespace>
spec:
    collector:
      pipelines:
        logs:
          exporters:
          - elasticsearch/arcdata/msft/internal
          # 1. Add your Kafka exporter to the exporters list of a logs pipeline.
          - kafka/logsPipelineExample
        metrics:
          exporters:
          - elasticsearch/arcdata/msft/internal
          # 1a. Add your Kafka exporter to the exporters list of a metrics pipeline.
          - kafka/metricsPipelineExample
      exporters:
        # 2. Declare each of your Kafka exporters with the needed settings (certificates, endpoint, topic, brokers, and encoding)
        kafka/logsPipelineExample:
          # Provide your client and CA certificate names
          # for the exporter as well as any additional settings needed
          certificateName: <kafka-client-certificate-name>
          caCertificateName: <ca-certificate-name>
          settings:
              # Name of the topic to export to
              topic: <topic-name>
              # Broker service endpoint
              brokers: <broker-service-endpoint>
              # Encoding for the telemetry, otlp_json or otlp_proto
              encoding: otlp_json
        kafka/metricsPipelineExample:
          # Provide your client and CA certificate names
          # for the exporter as well as any additional settings needed
          certificateName: <kafka-client-certificate-name>
          caCertificateName: <ca-certificate-name>
          settings:
              # Name of the topic to export to
              topic: <topic-name>
              # Broker service endpoint
              brokers: <broker-service-endpoint>
              # Encoding for the telemetry, otlp_json or otlp_proto
              encoding: otlp_json
        elasticsearch/arcdata/msft/internal:
          caCertificateName: cluster-ca-certificate
          certificateName: arcdata-msft-elasticsearch-exporter-internal
          endpoint: https://logsdb-svc:9200
          settings:
            index: logstash-otel
    credentials:
      certificates:
      - certificateName: arcdata-msft-elasticsearch-exporter-internal
      - certificateName: cluster-ca-certificate
      # 3. Provide your client and ca certificates through Kubernetes secrets
      # where the name of the secret and its namespace are specified.
      - certificateName: <kafka-client-certificate-name>
        secretName: <name_of_secret>
        secretNamespace: <namespace_with_secret>
      - certificateName: <ca-certificate-name>
        secretName: <name_of_secret>
        secretNamespace: <namespace_with_secret>
```

```bash
kubectl apply -f router.yaml -n <namespace>
```

You've added two Kafka exporters for exporting logs and metrics pipelines to your Kafka instance. After you've applied the changes, the TelemetryRouter custom resource will go into an updating state, and the collector service will restart.

## Next steps

- [Add pipelines to your telemetry router](/adding-pipelines.md)