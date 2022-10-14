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

The Arc telemetry router enables exporting the collected monitoring telemetry data to other monitoring solutions. For this Public Preview, we only support exporting log data to either Kafka or Elasticsearch and metric data to Kafka.

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
| caCertificateName      | The cluster's Certificate Authority or customer-provided certificate for the Exporter  |

Kafka Exporter Settings

|  Setting     | Description |
|--------------|-----------|
| topic       | Name of the topic to export to |
| brokers      | Broker service endpoint  | 
| encoding      | Encoding for the telemetry: otlp_json or otlp_proto  |

Elasticsearch Exporter Settings

|  Setting     | Description |
|--------------|-----------|
| index       | This setting can be the name of an index or datastream name to publish events to      |

### Pipelines

During the Public Preview, only logs and metrics pipelines are supported. These pipelines are exposed in the custom resource specification of the Arc telemetry router and available for modification.  During our public preview, only exporters are configurable.  All pipelines must be prefixed with "logs" or "metrics" in order to be injected with the necessary receivers and processors. For example, `logs/internal`

Logs pipelines may export to Kafka or Elasticsearch. Metrics pipelines may only export to Kafka.

Pipeline Settings

|  Setting     | Description |
|--------------|-----------|
| logs       | Can only declare new logs pipelines. Must be prefixed with "logs"       |
| metrics | Can only declare new metrics pipelines. Must be prefixed with "metrics" |
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
apiVersion: arcdata.microsoft.com/v1beta2
kind: TelemetryRouter
metadata:
  name: arc-telemetry-router
  namespace: test
spec:
    collector:
      customerPipelines:
        # Additional logs pipelines must be prefixed with "logs"
        # For example: logs/internal, logs/external, etc.
        logs:
          # The name of these exporters need to map to the declared ones beneath
          # the exporters property.
          # logs pipelines can export to elasticsearch or kafka
          exporters:
          - elasticsearch
          - kafka
        # Additional metrics piplines must be prefixed with "metrics"
        # For example: metrics/internal, metrics/external, etc.
        metrics:
          # The name of these exporters need to map to the declared ones beneath
          # the exporters property.
          # metrics pipelines can export to kafka only
          exporters:
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

Once you have your cluster and Azure CLI setup correctly, to deploy the telemetry router, you must create the *DataController* custom resource. Then, set the `enableOpenTelemetry` flag on its spec to `true`.  This flag is a temporary feature flag that must be enabled.

To set the feature flag, follow the [normal configuration profile instructions](create-custom-configuration-template.md). After you have created your configuration profile, add the monitoring property with the `enableOpenTelemetry` flag set to `true`. You can do set the feature flag by running the following commands in the az CLI:

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

When the data controller is deployed, it also deploys a default TelemetryRouter custom resource as part of the data controller creation. Note that the controller pod will only be marked ready when both custom resources have finished deploying. Use the following command to verify that the TelemetryRouter exists:

```bash
kubectl describe telemetryrouter arc-telemetry-router -n <namespace>
```

```yaml
apiVersion: arcdata.microsoft.com/v1beta2
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
```

We are exporting logs to our deployment of Elasticsearch in the Arc cluster. When you deploy the telemetry router, two OtelCollector custom resources are created. You can see the index, service endpoint, and certificates it is using to do so.  This telemetry router is provided as an example of the deployment, so you can see how to export to your own monitoring solutions.

You can run the following commands to see the detailed deployment of the child collectors that are receiving logs and exporting to Elasticsearch:

```bash
kubectl describe otelcollector collector-inbound -n <namespace>
kubectl describe otelcollector collector-outbound -n <namespace>
```

The first of the two OtelCollector custom resources is the inbound collector, dedicated to the inbound telemetry layer. The inbound collector receives the logs and metrics, then exports them to a Kafka custom resource.

```yaml
Name:         collector-inbound
Namespace:    <namespace>
Labels:       <none>
Annotations:  <none>
Is Valid:     true
API Version:  arcdata.microsoft.com/v1beta2
Kind:         OtelCollector
Spec:
  Collector:
    Exporters:
      kafka/arcdata/msft/logs:
        Brokers:           kafka-broker-svc:9092
        Encoding:          otlp_proto
        protocol_version:  2.0.0
        Tls:
          ca_file:    cluster-ca-certificate
          cert_file:  arcdata-msft-kafka-exporter-internal
          key_file:   arcdata-msft-kafka-exporter-internal
        Topic:        arcdata.microsoft.com.logs
      kafka/arcdata/msft/metrics:
        Brokers:           kafka-broker-svc:9092
        Encoding:          otlp_proto
        protocol_version:  2.0.0
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

The second of the two OtelCollector custom resources is the outbound collector, dedicated to the outbound telemetry layer. The outbound collector receives the logs and metrics data from the Kafka custom resource. Those logs and metrics can then be exported to the customer's monitoring solutions, such as Kafka or Elasticsearch.

```yaml
Name:         collector-outbound
Namespace:    arc
Labels:       <none>
Annotations:  <none>
Is Valid:     true
API Version:  arcdata.microsoft.com/v1beta2
Kind:         OtelCollector
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

After you deploy the Telemetry Router, both OtelCollector custom resources should be in a *Ready* state.  For modification, all updates should go through its parent resource, the TelemetryRouter custom resource. 

If you look at the pods, you should see the two collector pods - `arctc-collector-inbound-0` and `arctc-collector-outbound-0`. You should also see the `kakfa-server-0` pod.

```bash
kubectl get pods -n <namespace>

NAME                          READY   STATUS      RESTARTS   AGE
arc-bootstrapper-job-kmrsx    0/1     Completed   0          19h
arc-webhook-job-5bd06-r6g8w   0/1     Completed   0          19h
arctc-collector-inbound-0     2/2     Running     0          19h
arctc-collector-outbound-0    2/2     Running     0          19h
bootstrapper-789b4f89-c77z6   1/1     Running     0          19h
control-xtjrr                 2/2     Running     0          19h
controldb-0                   2/2     Running     0          19h
kafka-server-0                2/2     Running     0          19h
logsdb-0                      3/3     Running     0          19h
logsui-67hvm                  3/3     Running     0          19h
metricsdb-0                   2/2     Running     0          19h
metricsdc-hq25d               2/2     Running     0          19h
metricsdc-twq7r               2/2     Running     0          19h
metricsui-psnvg               2/2     Running     0          19h
```

## **Exporting to Your Monitoring Solutions**

This next section will guide you through a series of modifications you can make on the Arc telemetry router to export to your own Elasticsearch or Kafka instances.

### **1. Add an Elasticsearch Exporter**

You can test adding your own Elasticsearch exporter to send logs to your deployment of Elasticsearch by doing the following steps:

1. Add your Elasticsearch exporter to the exporters list beneath customer pipelines
2. Declare your Elasticsearch exporter with the needed settings - certificates, endpoint, and index
3. Provide your client and CA certificates in the credentials section through Kubernetes secrets

For example:

**router.yaml**

```yaml
apiVersion: arcdata.microsoft.com/v1beta2
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

You've now added a second Elasticsearch exporter that exports to your instance of Elasticsearch on the logs pipeline.  The TelemetryRouter custom resource should go into an updating state and the collector service will restart. 

### **2. Add a Kafka Exporter**

You can test adding your own Kafka exporter to send logs to your deployment of Kafka by doing the following steps:

1. Add your Kafka exporter to the exporters list beneath customer pipelines
2. Declare your Kafka exporter with the needed settings - topic, broker, and encoding
3. Provide your client and CA certificates in the credentials section through Kubernetes secrets

For example:

**router.yaml**

```yaml
apiVersion: arcdata.microsoft.com/v1beta2
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

You've now added a Kafka exporter that exports to the topic name at the broker service endpoint you provided on the logs pipeline.  The TelemetryRouter custom resource should go into an updating state and the collector service will restart.   

## Next steps

- [Test Arc-enabled servers using an Azure VM](../servers/plan-evaluate-on-azure-virtual-machine.md)
