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

# Deploy the Azure Arc Telemetry Router

> [!NOTE]
>
> - The telemetry router is currently in Public Preview and you should only deploy it for **testing purposes only**.
> - In-place upgrades of a data controller deployed with the Arc telemetry router enabled are not currently available in the current preview. In order to install a data controller in a future release, you will need to uninstall the data controller and then re-install.

**What is the Arc Telemetry Router?**

The Arc telemetry router enables exporting the collected monitoring telemetry data to other monitoring solutions. For this Public Preview we only support exporting log data to either Kafka or Elasticsearch.

This document specifies how to deploy the telemetry router and configure it to work with the supported exporters.

## **Configuration**

When deployed, the Arc telemetry router custom resource manages a hierarchy of resources. All configurations are specified through the telemetry router's custom resource specification. For the Public Preview, it initially targets the configuration of exporters and pipelines.

### Exporters

For the Public Preview, Exporters are partially configurable and support the following Primary Exporters:

- Kafka
- Elasticsearch

The following properties are currently configurable during the Public Preview:

General Exporter Settings

|  Setting     | Description |
|--------------|-----------|
| endpoint       | Endpoint of the monitoring solution to export to |
| certificateName     | The client certificate in order to export to the monitoring solution  | 
| caCertificateName      | The cluster's Certificate Authority certificate for the Exporter  |

Kafka Exporter Settings

|  Setting     | Description |
|--------------|-----------|
| topic       | Name of the topic to export to |
| brokers      | Broker service endpoint  | 
| encoding      | Encoding for the telemetry: otlp_json or otlp_proto  |

Elasticsearch Exporter Settings

|  Setting     | Description |
|--------------|-----------|
| index       | This can be the name of an index or datastream name to publish events to      |

### Pipelines

During the Public Preview, only logs pipelines are supported. These are exposed in the custom resource specification of the Arc telemetry router and available for modification.  Currently, we do not allow configuration of receivers and processors in these pipelines - only exporters are changeable.  All pipelines must be prefixed with "logs" in order to be injected with the necessary receivers and processors. e.g., `logs/internal`

Pipeline Settings

|  Setting     | Description |
|--------------|-----------|
| logs       | Can only declare new logs pipelines. Must be prefixed with "logs"       |
| exporters       | List of exporters. Can be multiple of the same type.      |

### Credentials 

**Credentials Settings**

|  Setting     | Description |
|--------------|-----------|
| certificateName       | Name of the certificate must correspond to the certificate name specified in the exporter declaration       |
| secretName       | Name of the secret provided through Kubernetes      |
| secretNamespace       | Namespace with secret provided through Kubernetes      |

### Example TelemetryRouter Specification:

```yaml
apiVersion: arcdata.microsoft.com/v1beta1
kind: TelemetryRouter
metadata:
  name: arc-telemetry-router
  namespace: test
spec:
    collector:
      customerPipelines:
        # Only logs pipelines are supported for the first preview.
        # Any additional logs pipelines, must be prefixed with "logs"
        # e.g. logs/internal, logs/external, etc.
        logs:
          # The name of these exporters need to map to the declared ones beneath
          # the exporters property.
          exporters:
          - elasticsearch
          - kafka
      exporters:
        # Only elasticsearch and kafka exporters are supported for this first preview.
        # Any additional exporters of those types must be prefixed with the name
        # of the exporter, e.g. kafka/2, elasticsearch/2
        elasticsearch:
          # Users will specify client and CA certificate names
          # for the exporter as well as any additional settings needed
          # These names should map to the credentials section below.
          caCertificateName: cluster-ca-certificate
          certificateName: elasticsearch-exporter
          endpoint: <elasticsearch_endpoint>
          settings:
            # Currently supported properties include: index
            # This can be the name of an index or datastream name to publish events to
            index: <elasticsearch_index>
        kafka:
            certificateName: kafka-exporter
            caCertificateName: cluster-ca-certificate
            settings:
                # Currently supported properties include: topic, brokers, and encoding
                # Name of the topic to export to
                topic: kafka_logs_topic
                # Broker service endpoint
                brokers: kafka-broker-svc.test.svc.cluster.local:9092
                # Encoding for the telemetry, otlp_json or otlp_proto
                encoding: otlp_json
    credentials:
      certificates:
      # For user-provided certificates, they must be provided
      # through a Kubernetes secret, where the name of the secret and its
      # namespace are specified.
      - certificateName: elasticsearch-exporter
        secretName: <name_of_secret>
        secretNamespace: <namespace_with_secret>
      - certificateName: kafka-exporter
        secretName: <name_of_secret>
        secretNamespace: <namespace_with_secret>
      - certificateName: cluster-ca-certificate
        secretName: <name_of_secret>
        secretNamespace: <namespace_with_secret>
```

## **Deployment**

> [!NOTE]
> The telemetry router currently supports indirect mode only.

Once you have your cluster and Azure CLI setup correctly, to deploy the telemetry router, you must create the *DataController* custom resource. Then, set the `enableOpenTelemetry` flag on its spec to `true`.  This is a temporary feature flag that must be enabled.

To do this, follow the [normal configuration profile instructions](create-custom-configuration-template.md). After you have created your configuration profile, add the monitoring property with the `enableOpenTelemetry` flag set to `true`. You can do this by running the following commends in the az CLI:

```bash
az arcdata dc config add --path ./output/control.json --json-values ".spec.monitoring={}"
az arcdata dc config add --path ./output/control.json --json-values ".spec.monitoring.enableOpenTelemetry=true"
```

To confirm the flag was set correctly, you can open the control.json file and confirm the `monitoring` object was added to the `spec` object, as shown below.

```yaml
spec:
    monitoring:
        enableOpenTelemetry: true
```

Then deploy the data controller as normal in the [Deployment Instructions](create-data-controller-indirect-cli.md?tabs=linux)

When the data controller is deployed, it also deploys a default TelemetryRouter custom resource at the end of the data controller creation. Use the following command to verify that it exists:

```bash
kubectl describe telemetryrouter arc-telemetry-router -n <namespace>
```

```yaml
apiVersion: arcdata.microsoft.com/v1beta1
  kind: TelemetryRouter
  metadata:
    creationTimestamp: "2022-09-08T16:54:04Z"
    generation: 1
    name: arc-telemetry-router
    namespace: <namespace>
    ownerReferences:
    - apiVersion: arcdata.microsoft.com/v5
      controller: true
      kind: DataController
      name: datacontroller-arc
      uid: 9c0443d8-1cc3-4c40-b600-3552272b3d3e
    resourceVersion: "15000547"
    uid: 3349f73a-0904-4063-a501-d92bd6d3e66e
  spec:
    collector:
      customerPipelines:
        logs:
          exporters:
          - elasticsearch/arcdata/msft/internal
      exporters:
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
  status:
    lastUpdateTime: "2022-09-08T16:54:05.042806Z"
    observedGeneration: 1
    runningVersion: v1.11.0_2022-09-13
    state: Ready

```

We are exporting logs to our deployment of Elasticsearch in the Arc cluster.  You can see the index, service endpoint, and certificates it is using to do so.  This is provided as an example in the deployment, so you can see how to export to your own monitoring solutions.

You can run the following command to see the detailed deployment of the child collector that is receiving logs and exporting to Elasticsearch:

```bash
kubectl describe otelcollector collector -n <namespace>
```

```yaml
apiVersion: arcdata.microsoft.com/v1beta1
  kind: OtelCollector
  metadata:
    creationTimestamp: "2022-09-08T16:54:04Z"
    generation: 1
    name: collector
    namespace: <namespace>
    ownerReferences:
    - apiVersion: arcdata.microsoft.com/v1beta1
      controller: true
      kind: TelemetryRouter
      name: arc-telemetry-router
      uid: <uid>
    resourceVersion: "15000654"
    uid: <uid>
  spec:
    collector:
      exporters:
        elasticsearch/arcdata/msft/internal:
          endpoints:
          - https://logsdb-svc:9200
          index: logstash-otel
          tls:
            ca_file: cluster-ca-certificate
            cert_file: arcdata-msft-elasticsearch-exporter-internal
            key_file: arcdata-msft-elasticsearch-exporter-internal
      extensions:
        memory_ballast:
          size_mib: 683
      processors:
        batch:
          send_batch_max_size: 500
          send_batch_size: 100
          timeout: 10s
        memory_limiter:
          check_interval: 5s
          limit_mib: 1500
          spike_limit_mib: 512
      receivers:
        fluentforward:
          endpoint: 0.0.0.0:8006
      service:
        extensions:
        - memory_ballast
        pipelines:
          logs:
            exporters:
            - elasticsearch/arcdata/msft/internal
            processors:
            - memory_limiter
            - batch
            receivers:
            - fluentforward
    credentials:
      certificates:
      - certificateName: arcdata-msft-elasticsearch-exporter-internal
      - certificateName: cluster-ca-certificate
  status:
    lastUpdateTime: "2022-09-08T16:54:56.923140Z"
    observedGeneration: 1
    runningVersion: v1.11.0_2022-09-13
    state: Ready

```

The purpose of this child resource is to provide a visual representation of the inner configuration of the collector, and you should see it in a *Ready* state.  For modification, all updates should go through its parent resource, the TelemetryRouter custom resource. 

If you look at the pods, you should see an otel-collector-0 pod there as well:

```bash
kubectl get pods -n <namespace>

NAME                           READY   STATUS      RESTARTS   AGE
arc-bootstrapper-job-r4m45     0/1     Completed   0          9m5s
arc-webhook-job-7d443-lf9ws    0/1     Completed   0          9m3s
bootstrapper-96b5c4fc7-kvxgq   1/1     Running     0          9m3s
control-l5j2c                  2/2     Running     0          8m46s
controldb-0                    2/2     Running     0          8m46s
logsdb-0                       3/3     Running     0          7m51s
logsui-rx746                   3/3     Running     0          6m9s
metricsdb-0                    2/2     Running     0          7m51s
metricsdc-6g66g                2/2     Running     0          7m51s
metricsui-jg25t                2/2     Running     0          7m51s
otel-collector-0               2/2     Running     0          5m4s
```

To verify that the exporting of the logs is happening correctly, you can inspect the logs of the collector or look at Elasticsearch and verify.

To look at the logs of the collector, you will need to exec into the container run the following command:

```bash
 kubectl exec -it otel-collector-0 -c otel-collector -- /bin/bash -n <namespace>

cd /var/log/opentelemetry-collector/
```

If you look at the logs files, you should see successful POSTs to Elasticsearch with response code 200. 

Example Output:

```bash
2022-08-30T16:08:33.455Z        debug   elasticsearchexporter@v0.53.0/exporter.go:182   Request roundtrip completed.    {"kind": "exporter", "name": "elasticsearch/arcdata/internal", "path": "/_bulk", "method": "POST", "duration": 0.006774934, "status": "200 OK"}
```

If there are successful POSTs, everything should be running correctly.

## **Exporting to Your Monitoring Solutions**

This next section will guide you through a series of modifications you can make on the Arc telemetry router to export to your own Elasticsearch or Kafka instances.

### **1. Add an Elasticsearch Exporter**

You can test adding your own Elasticsearch exporter to send logs to your deployment of Elasticsearch by doing the following:

1. Add your Elasticsearch exporter to the exporters list beneath customer pipelines
2. Declare your Elasticsearch exporter with the needed settings - certificates, endpoint, and index
3. Provide your client and CA certificates in the credentials section through Kubernetes secrets

For example:

**router.yaml**

```yaml
apiVersion: arcdata.microsoft.com/v1beta1
kind: TelemetryRouter
metadata:
  name: arc-telemetry-router
  namespace: <namespace>
spec:
    collector:
      customerPipelines:
        logs:
          exporters:
          - elasticsearch/arcdata/msft/internal
          # 1. Add your Elasticsearch exporter to the exporters list.
          - elasticsearch/example
      exporters:
        # 2. Declare your Elasticsearch exporter with the needed settings (certificates, endpoint, and index to export to)
        elasticsearch/example:
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

This will add a second Elasticsearch exporter that exports to your instance of Elasticsearch on the logs pipeline.  The TelemetryRouter custom resource should go into an updating state and the collector service will restart.  Once it is in a ready state, you can inspect the collector logs as shown above again to ensure it's successfully posting to your instance of Elasticsearch.

### **2. Add a new logs pipeline with your Elasticsearch exporter**

You can test adding a new logs pipeline by updating the TelemetryRouter custom resource as seen below:

**router.yaml**

```yaml
apiVersion: arcdata.microsoft.com/v1beta1
kind: TelemetryRouter
metadata:
  name: arc-telemetry-router
  namespace: <namespace>
spec:
    collector:
      customerPipelines:
        logs:
          exporters:
          - elasticsearch/arcdata/msft/internal
        logs/example:
          exporters:
          - elasticsearch/example
      exporters:
        elasticsearch/example:
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
      # Provide your client and ca certificates through Kubernetes secrets
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

This will add your Elasticsearch exporter to a *different* logs pipeline called 'logs/example'.  The TelemetryRouter custom resource should go into an updating state and the collector service will restart.  Once it is in a ready state, you can inspect the collector logs as shown above again to ensure it's successfully posting to your instance of Elasticsearch.

### **3. Add a Kafka Exporter**

You can test adding your own Kafka exporter to send logs to your deployment of Kafka by doing the following:

1. Add your Kafka exporter to the exporters list beneath customer pipelines
2. Declare your Kafka exporter with the needed settings - topic, broker, and encoding
3. Provide your client and CA certificates in the credentials section through Kubernetes secrets

For example:

**router.yaml**

```yaml
apiVersion: arcdata.microsoft.com/v1beta1
kind: TelemetryRouter
metadata:
  name: arc-telemetry-router
  namespace: <namespace>
spec:
    collector:
      customerPipelines:
        logs:
          exporters:
          - elasticsearch/arcdata/msft/internal
          # 1. Add your Kafka exporter to the exporters list of a logs pipeline.
          - kafka/example
      exporters:
        # 2. Declare your Kafka exporter with the needed settings (certificates, endpoint, topic, brokers, and encoding)
        kafka/example:
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

This will add a Kafka exporter that exports to the topic name at the broker service endpoint you provided on the logs pipeline.  The TelemetryRouter custom resource should go into an updating state and the collector service will restart.  Once it is in a ready state, you can inspect the collector logs as shown above again to ensure there are no errors and verify on your Kafka cluster that it is receiving the logs.  

## Next steps

- [Test Arc-enabled servers using an Azure VM](../servers/plan-evaluate-on-azure-virtual-machine.md)
