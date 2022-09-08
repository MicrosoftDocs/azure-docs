---
title: Deploy Azure Arc TelemetryRouter
description: Learn how to deploy the Azure Arc TelemetryRouter
author: lcwright
ms.author: lancewright
ms.service: #Required; service per approved list. slug assigned by ACOM.
ms.topic: how-to 
ms.date: 09/07/2022
ms.custom: template-how-to
---

# Deploy the Azure Arc TelemetryRouter

> [!NOTE]
>
> - The Arc TelemetryRouter is currently in Public Preview and you should only deploy it for **testing purposes only**.
> - In-place upgrades are not currently available in the current Preview. In order to install a future release, you will need to uninstall this Preview release and then install the next release.

**What is the Arc TelemetryRouter?**

The Arc TelemetryRouter's primary goal is to provide a means for customers to declare telemetry pipelines and the exporters which correspond to those pipelines in order to export to their own monitoring solutions.  For this Public Preview we only support logs pipelines and Kafka or Elasticsearch exporters.

The TelemetryRouter manages a hierarchy of resources in order to provide this telemetry pipeline functionality.  One of its child resources is an OpenTelemetry collector.  The OpenTelemetry collector is a vendor-agnostic proxy that can receive, process, and export telemetry data.  It supports receiving telemetry data in multiple formats and sending data to one or more backends.  It also supports processing and filtering telemetry data before it gets exported.  

This document specifies initial details regarding the architecture of the underlying resources and configuration design of the Arc TelemetryRouter.

## **Configuration**

When deployed, the Arc TelemetryRouter custom resource manages a hierarchy of resources. All configurationS are specified through the TelemetryRouter's custom resource specification. For the Public Preview, it initially targets the configuration of exporters and pipelines.

### **Exporters**

For the Public Preview, Exporters are partially configurable and support the following Primary Exporters:

- Kafka
- Elasticsearch

The following properties are currently configurable during the Public Preview:

- Credentials
  - User-provided client and CA certificates through Kubernetes secrets.
- Endpoints
- Settings
  - KafkaExporter Settings:
    - topic
    - brokers
    - encoding
- ElasticSearchExporter Settings:
  - index

### **Pipelines**

During the Public Preview, only logs pipelines are supported. These are exposed in the custom resource specification of the Arc TelemetryRouter and available for modification.  Currently, we do not allow configuration of receivers and processors in these pipelines - only exporters are mutable.  All pipelines must be prefixed with "logs" in order to be injected with the necessary receivers and processors. e.g., `logs/internal`

### **Example TelemetryRouter Specification:**

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

Once you have your cluster and Azure CLI setup correctly **(LW Comment: ADD LINK)**, to deploy the TelemetryRouter, you must create the *DataController* custom resource. Then, set the `enableOpenTelemetry` flag on its spec to `true`.  This is a temporary feature flag that must be enabled.

To do this, follow the normal configuration profile instructions **(LW Comment: ADD LINK)**. After you have created your configuration profile, add the monitoring property with the `enableOpenTelemetry` flag set to `true`. You can do this by running the following commends in the az CLI:

```bash
az arcdata dc config init --source azure-arc-kubeadm --path ./output/custom --force
az arcdata dc config add --path ./output/control.json --json-values ".spec.monitoring={}"
az arcdata dc config add --path ./output/control.json --json-values ".spec.monitoring.enableOpenTelemetry=true"
```

To confirm the flag was set correctly, you can open the control.json file and confirm the `monitoring` object was added to the `spec` object, as shown below.

```yaml
spec:
    monitoring:
        enableOpenTelemetry: true
```

Then deploy the data controller as normal in the [Custom Deployment Instructions] **(LW Comment: Replace Link)**

When the data controller is deployed, it also deploys a default TelemetryRouter custom resource at the end of the data controller creation. Use the following command to verify  that it exists:

```bash
kubectl -n <namespace> describe telemetryrouter arc-telemetry-router
```

```yaml
<brakoc to add example, customer-facing .yaml file>
```

In the above example, we have an initial logs pipeline deployed, exporting Fluentbit logs to our deployment of Elasticsearch in the Arc cluster.  You can see the index, service endpoint, and certificates it is using to do so.

You can run the following command to see the detailed deployment of the child collector that is receiving Fluentbit logs and exporting to Elasticsearch:

```bash
kubectl -n <namespace> describe otelcollector collector
```

```yaml
<brakoc to add example, customer-facing .yaml file>
```

The purpose of this child resource is to provide a visual representation of the inner configuration of the collector.  For modification, all updates should go through its parent resource, the TelemetryRouter custom resource. 

After running the following `get pods` command, you should see it in a *Ready* state. If you look at the pods, you should see an otel-collector-0 pod there as well:

```bash
kubectl -n <namespace> get pods

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

To look at the logs of the collector, run the following command:

```bash
 kubectl -n <namespace> exec -it otel-collector-0 -c otel-collector -- /bin/bash

cd /var/log/opentelemetry-collector/
```

If you look at the logs files, you should see successful POSTs to Elasticsearch with response code 200. Example Output:

```bash
2022-08-30T16:08:33.455Z        debug   elasticsearchexporter@v0.53.0/exporter.go:182   Request roundtrip completed.    {"kind": "exporter", "name": "elasticsearch/arcdata/internal", "path": "/_bulk", "method": "POST", "duration": 0.006774934, "status": "200 OK"}
```

If there are successful POSTs, everything should be running correctly.

## **Modification**

This next section will guide you through a series of modifications you can make on the TelemetryRouter to test various functionality.

### **1. Modify the index of the Elasticsearch Exporter**

You can test exporting to a different index by updating the Elasticsearch exporter on the TelemetryRouter custom resource as seen below:

**router.yaml**

```yaml
<brakoc to add example, customer-facing .yaml file>
```

```bash
kubectl -n <namespace> apply -f router.yaml
```

This will change your exporter from exporting to logstash-otel to logstash-otel2.  The OtelCollector custom resource should go into an updating state and the collector service will restart.  Once it is in a ready state, you can inspect the collector logs as shown above again to ensure it's successfully posting to the new index.

### **2. Add a new Elasticsearch exporter**

You can test adding a new Elasticsearch exporter by updating the TelemetryRouter custom resource as seen below:

**router.yaml**

```yaml
<brakoc to add example, customer-facing .yaml file>
```

```bash
kubectl -n <namespace> apply -f router.yaml
```

This will add a second Elasticsearch exporter that exports to a different index on the *same* logs pipeline.  The OtelCollector custom resource should go into an updating state and the collector service will restart.  Once it is in a ready state, you can inspect the collector logs as shown above again to ensure it's successfully posting to both indices.

### **3. Add a new logs pipeline**

You can test adding a new logs pipeline by updating the TelemetryRouter custom resource as seen below:

**router.yaml**

```yaml
<brakoc to add example, customer-facing .yaml file>
```

```bash
kubectl -n <namespace> apply -f router.yaml
```

This will add a second Elasticsearch exporter that exports to a different index on a *different* logs pipeline.  The OtelCollector custom resource should go into an updating state and the collector service will restart.  Once it is in a ready state, you can inspect the collector logs as shown above again to ensure it's successfully posting to both indices.

### **4. Add a Kafka Exporter**

To test the Kafka exporter, you will first need to deploy Kafka to the Arc cluster.  To do so, apply a Kafka custom resource similar to below:

**kafka.yaml**

```yaml
<brakoc to add example, customer-facing .yaml file>
```

```bash
kubectl -n <namespace> apply -f kafka.yaml
```

Once the Kafka CR is in a ready state,

```bash
$ kubectl -n <namespace> get kafkas
NAME        STATUS    AGE
arc-kafka   Ready     19h
```

apply the change to the TelemetryRouter with the Kafka exporter:

**router.yaml**

```yaml
<brakoc to add example, customer-facing .yaml file>
```

```bash
kubectl -n <namespace> apply -f router.yaml
```

This will add a Kafka exporter that exports to the kafka_logs_topic on the logs pipeline.  The OtelCollector custom resource should go into an updating state and the collector service will restart.  Once it is in a ready state, you can inspect the collector logs as shown above again to ensure there are no errors.  

Currently, the Kafka exporter doesn't log its POST requests on the collector.  So, to ensure that Kafka is receiving the logs, you'll need to run a `kubectl exec` command into the Kafka broker to see the fluentbit logs.  You can do so as follows:

```bash
# 1. Exec into the broker pod
$ kubectl exec -it kafka-broker-0 -n <namespace> -c kafka-broker -- bash

# 2. Go to the kafka run directory and generate a connection properties file
$ cd /var/run/kafka
$ echo $'bootstrap.servers=kafka-broker-svc:9092\nsecurity.protocol=SSL\nssl.truststore.location=/var/run/secrets/managed/truststores/kafka/truststore.p12\nssl.truststore.password=password\nssl.keystore.location= /var/run/secrets/managed/keystores/kafka/kafka-keystore.p12\nssl.keystore.password=password\nssl.key.password=password\n' > client-ssl.properties

# 3. List the available topics to ensure the kafka_logs_topic exists
$ /opt/kafka/bin/kafka-topics.sh --list --bootstrap-server kafka-broker-svc:9092 --command-config client-ssl.properties

# 4. Begin reading from the kafka_logs_topic
$ /opt/kafka/bin/kafka-console-consumer.sh --topic kafka_logs_topic --bootstrap-server kafka-broker-svc:9092 --consumer.config client-ssl.properties
```

> **LW Comment:** are these outputs okay?

If the kafka_logs_topic exists and you are able to read from it and see the logs, then the exporter should be working correctly if there are no error messages from either the collector or Kafka.

## Next steps

- [Test Arc-enabled servers using an Azure VM]([contribute-how-to-write-howto.md](https://docs.microsoft.com/en-us/azure/azure-arc/servers/plan-evaluate-on-azure-virtual-machine))