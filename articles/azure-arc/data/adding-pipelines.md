---
title: Adding Pipelines | Azure Arc-enabled Data Services
description: Learn how to add pipelines to the telemetry router
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

# Add pipelines to your telemetry router deployment

This article provides examples of how you can set up your own pipelines that can export to your own deployments of Kafka or Elasticsearch. Today, we currently support logs and metrics pipelines. Logs pipelines can be exported to Kafka or Elasticsearch. Metrics pipelines can be exported to Kafka only

## Prerequisites

- An instance of the Azure Arc telemetry router is deployed and running. See [Deploy telemetry router](/deploy-telemetry-router.md)

## Example 1: Adding a logs pipeline

You can test creating a logs pipeline that can send logs to your own instances of Kafka and/or Elasticsearch. You'll need to prefix the name of your logs pipeline with either `kafka` or `elasticsearch`

1. Add your new logs pipeline to the exporters list beneath `pipelines`. Be sure to prepend the exporter to the front of pipeline name. For example, `kafka/myLogsPipeline`
2. Declare the new Exporter beneath `exporters` with the needed settings - certificates, endpoint, and index. Use the same logs name as the previous step
3. Provide your client and CA certificates in the credentials section through Kubernetes secrets

In this example, we've added a logs pipeline (`kafka/myLogsPipeline`) that will route to an instance of Kafka.

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
        # 1. Add your kafka exporter to the exporters list.
        - kafka/myLogsPipeline
    exporters:
      # 2. Declare your Kafka exporter with the needed settings (certificates, endpoint, and index to export to)
      kafka/myLogsPipeline:
        # Provide your client and CA certificate names
        # for the exporter as well as any additional settings needed
        caCertificateName: <ca-certificate-name>
        certificateName: <kafka-client-certificate-name>
        endpoint: <kafka_endpoint>
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
You've added a logs pipeline that will export to your instance of Kafka. After you'd applied the changes to the yaml file, the TelemetryRouter custom resource will go into an updating state, and the collector service will restart.

## Example 2: Using multiple pipelines and exporters

You can test creating multiple pipelines and exporters. Having multiple pipelines and exporters is helpful for instances where you want more control over how the pipelines are routed to your exporters.

1. Add your new pipelines to the exporters list beneath pipelines. You can have multiple pipelines route to a single exporter.
2. Declare the new exporter(s) beneath `exporters` with the needed settings - - certificates, endpoint, and index. Use the same logs name as the previous step
3. Provide your client and CA certificates in the credentials section through Kubernetes secrets

For this example, we'll build on the previous example by adding a logs and metrics pipeline (`kafka/kafkaPipelines`) that both route to the same Kafka exporter.

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
        # 1. Add your kafka exporter to the exporters list.
        - kafka/myLogsPipeline
        - kafka/kafkaPipelines
      metrics:
        exporters:
        #1a. Add a metrics pipeline that routes to the same kakfa exporter
        - kafka/kafkaPipelines
    exporters:
      # 2. Declare your Kafka exporter with the needed settings (certificates, endpoint, and index to export to)
      kafka/myLogsPipeline:
        # Provide your client and CA certificate names
        # for the exporter as well as any additional settings needed
        caCertificateName: <ca-certificate-name>
        certificateName: <kafka-client-certificate-name>
        endpoint: <kafka_endpoint>
        settings:
          # Currently supported properties include: index
          # This can be the name of an index or datastream name to publish events to
          index: <elasticsearch_index>
      kafka/kafkaPipelines:
         # Provide your client and CA certificate names
         # for the exporter as well as any additional settings needed
         caCertificateName: <ca-certificate-name>
         certificateName: <kafka-client-certificate-name>
         endpoint: <kafka_endpoint>
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

You've added a logs and metrics pipeline that will export to your instance of Kafka. After you'd applied the changes to the yaml file, the TelemetryRouter custom resource will go into an updating state, and the collector service will restart.

## Next steps

- [Add exporters to your telemetry router](/adding-exporters.md)