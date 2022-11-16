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
> - The current preview does not support in-place upgrades of a data controller deployed with the Arc telemetry router enabled. In order to install a data controller in a future release, you will need to uninstall the data controller and then re-install.

## What are Exporters and Pipelines?

Exporters and Pipelines are two of the main components of the telemetry router. Exporters are used to send telemetry data to one or more backends or destinations, including your own deployments of a supported exporter. When creating an exporter, you'll associate it with a pipeline in order to route that type of telemetry data to that exporter.

This article provides examples of how you can set up your own exporters and pipelines to route monitoring telemetry data to your own supported exporter. 

### Supported Exporters

|  Exporter     | Supported Pipelines |
|--------------|-----------|
| Kafka       | logs, metrics      |
| Elasticsearch       | logs      |

## Prerequisites

- Deploy an [Arc-enabled Kubernetes cluster in indirectly connected mode](/create-complete-managed-instance-indirectly-connected.md). 
- An instance of the Azure Arc telemetry router is deployed and running. See [deploy telemetry router](/deploy-telemetry-router.md)

## Example 1: Adding a Kafka exporter for a metrics pipeline

You can test creating a Kafka exporter for a metrics pipeline that can send metrics data to your own instance of Kafka. You'll need to prefix the name of your metrics pipeline with `kafka/`. 
   
1. Provide your client and CA certificates in the credentials section through Kubernetes secrets
2. Declare the new Exporter beneath `exporters` with the needed settings - certificates, endpoint, and index. Be sure to prepend the type of exporter to the front of the exporter name. For example, `kafka/myMetricsPipeline`
3. Add your new metrics pipeline to the exporters list beneath `pipelines`. Be sure to use the same exporter name from the previous step. For example, `kafka/myMetricsPipeline`

In this example, we've added a metrics pipeline (`kafka/myMetricsPipeline`) that will route to an instance of Kafka.

**router.yaml**

```yaml
apiVersion: arcdata.microsoft.com/v1beta3
kind: TelemetryRouter
metadata:
  name: arc-telemetry-router
  namespace: <namespace>
spec:
  collector:
    pipelines:
      metrics:
        exporters:
        - kafka/arcdata/msft/internal
        # Step 3. Assign your kafka exporter to the list
        # of exporters for the metrics pipeline.
        - kafka/myMetricsPipeline
    exporters:
      # Step 2. Declare your Kafka exporter with the needed settings 
      # (certificates, endpoint, and index to export to)
      kafka/myMetricsPipeline:
        # Provide your client and CA certificate names
        # for the exporter as well as any additional settings needed
        caCertificateName: <ca-certificate-name>
        certificateName: <kafka-client-certificate-name>
        endpoint: <kafka_endpoint>
        # Index can be the name of an index or datastream name to publish events to
        index: <kafka_index>
      kafka/arcdata/msft/internal:
        caCertificateName: cluster-ca-certificate
        certificateName: arcdata-msft-kafka-exporter-internal
        endpoint: https://logsdb-svc:9200
        index: metricsstash-otel
  credentials:
    certificates:
    - certificateName: arcdata-msft-kafka-exporter-internal
    - certificateName: cluster-ca-certificate
    # Step 1. Provide your client and ca certificates through Kubernetes secrets
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
You've added a metrics pipeline that will export to your instance of Kafka. After you've applied the changes to the yaml file, the TelemetryRouter custom resource will go into an updating state, and the collector service will restart.

## Example 2: Adding an Elasticsearch exporter for a logs pipeline

Your telemetry router deployment can be connected to multiple exporters. Multiple types of exporters are supported on a given telemetry router deployment. This example demonstrates adding an Elasticsearch exporter as a second exporter. We'll map this second exporter to a logs pipeline.

1. Provide your client and CA certificates in the credentials section through Kubernetes secrets
2. Declare the new Exporter beneath `exporters` with the needed settings - certificates, endpoint, and index. Be sure to prepend the type of exporter to the front of the exporter name. For example, `elasticsearch/myLogsPipeline`
3. Add your new metrics pipeline to the exporters list beneath `pipelines`. Be sure to use the same exporter name from the previous step. For example, `elasticsearch/myLogsPipeline`

This example builds on the previous example by adding an Elasticsearch exporter mapped to a logs pipeline (`elasticsearch/myLogsPipeline`). At the end of the example, we'll have two exporters with each exporter mapped to a different pipeline.

**router.yaml**

```yaml
apiVersion: arcdata.microsoft.com/v1beta3
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
        # Step 3. Add your Elasticsearch exporter to 
        # the exporters list of a logs pipeline.
        - elasticsearch/myLogsPipeline
      metrics:
        exporters:
        - kafka/arcdata/msft/internal
        - kafka/myMetricsPipeline
    exporters:
      # Step 2. Declare your Elasticsearch exporter with the needed settings 
      # (certificates, endpoint, and index to export to)
      elasticsearch/myLogsPipeline:
        # Provide your client and CA certificate names
        # for the exporter as well as any additional settings needed
        caCertificateName: <ca-certificate-name>
        certificateName: <elasticsearch-client-certificate-name>
        endpoint: <elasticsearch_endpoint>
        # Index can be the name of an index or datastream name to publish events to
        index: <elasticsearch_index>      
      kafka/myMetricsPipeline:
        caCertificateName: <ca-certificate-name>
        certificateName: <kafka-client-certificate-name>
        endpoint: <kafka_endpoint>
        index: <kafka_index>
      elasticsearch/arcdata/msft/internal:
        caCertificateName: cluster-ca-certificate
        certificateName: arcdata-msft-elasticsearch-exporter-internal
        endpoint: https://logsdb-svc:9200
        index: logstash-otel
      kafka/arcdata/msft/internal:
        caCertificateName: cluster-ca-certificate
        certificateName: arcdata-msft-kafka-exporter-internal
        endpoint: https://logsdb-svc:9200
        index: metricsstash-otel
  credentials:
    certificates:
    - certificateName: arcdata-msft-elasticsearch-exporter-internal
    - certificateName: cluster-ca-certificate
    - certificateName: arcdata-msft-kafka-exporter-internal
    - certificateName: cluster-ca-certificate
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
```

```bash
kubectl apply -f router.yaml -n <namespace>
```

You now have Kafka and Elasticsearch exporters, mapped to metrics and logs pipelines. After you'd applied the changes to the yaml file, the TelemetryRouter custom resource will go into an updating state, and the collector service will restart.
