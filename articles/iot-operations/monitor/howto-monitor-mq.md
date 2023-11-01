---
title: Monitor Azure IoT MQ
# titleSuffix: Azure IoT MQ
description: Monitor and set alerts for Azure IoT MQ
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.date: 10/31/2023

#CustomerIntent: As an operator, I want to set up TLS so that I have secure communication between the MQTT broker and clients.
---

# Monitor Azure IoT MQ

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Azure IoT MQ includes a diagnostics service that periodically self tests IoT MQ components and emits metrics. These metrics can be used by operators to monitor the health of the system. The diagnostics service has a Prometheus endpoint for metrics.

## What's supported

| Feature | Supported |
| --- | --- |
| Metrics | Supported |
| Traces | Supported |
| Logs | Supported |
| SLI metrics | Supported |
| Prometheus endpoint | Supported |
| Grafana dashboard for metrics, traces and logs | Supported |

## Glossary

| Name | Meaning |
|---|:---:|



## Diagnostics service configuration

The diagnostics service processes and collates diagnostic signals from various IoT MQ core components. You can configure it using a custom resource definition (CRD). The following table lists its properties.

| Name | Required | Format | Default | Description |
| --- | --- | --- | --- | --- |
| dataExportFrequencySeconds | false | Int32 | `10` | Frequency in seconds for data export |
| repository | true | String | N/A | Docker image name |
| tag | true | String | N/A | Docker image tag |
| pullPolicy | false | String | N/A | Image pull policy to use |
| pullSecrets | false | String | N/A | Kubernetes secret containing docker authentication details |
| logFormat | false | String | `json` | Log format. `json` or `text` |
| logLevel | false | String | `info` | Log level. `trace`, `debug`, `info`, `warn`, or `error`. |
| maxDataStorageSize | false | Unsigned integer | `16` | Maximum data storage size in MiB |
| metricsPort | false | Int32 | `9600` | Port for metrics |
| openTelemetryCollectorAddr | false | String | `null` | Endpoint URL of the OpenTelemetry collector |
| staleDataTimeoutSeconds | false | Int32 | `600` | Data timeouts in seconds |

## Prerequisites

- Install Grafana on the cluster:

   ```bash
   helm repo add grafana https://grafana.github.io/helm-charts
   helm repo update
   ```

- Install the diagnostics service on the cluster. To check if the service is installed, run the following command:

   ```bash
   kubectl get diagnosticservices
   ```

   If the diagnostics service is deployed, you should see output similar to:

   ```text
   NAME                         AGE
   azedge-diagnostics-service   108m
   ```

   If the diagnostics service isn't installed, complete the following steps to install it:

   1. Create a file named diagnostics-service.yaml:

      ```yaml
      apiVersion: mq.iotoperations.azure.com/v1beta1
      kind: DiagnosticService
      metadata:
        name: azedge-diagnostics-service
        namespace: default
      spec:
        image:
          pullPolicy: Always
          repository: e4kpreview.azurecr.io/diagnostics-service
          tag: 0.1.0
        logFormat: "text"
      ```

   1. Apply the YAML with kubectl

      ```bash
      kubectl apply -f diagnostics-service.yaml
      ```

## Install samples and view metrics

Currently, four groups of metrics are presented on the dashboard sample:

- Publish latency - the time it takes for an MQTT publish to be processed by the IoT MQ broker
- Publish health - the correctness of the replication algorithm while processing an MQTT publish
- Traffic - how much demand is placed on the IoT MQ broker
- Saturation - IoT MQ broker resource utilization

These metrics are available as Prometheus metrics and are sourced via built-in IoT MQ metrics, [node-exporter](https://github.com/prometheus/node_exporter) and [kube-state-metrics](https://github.com/kubernetes/kube-state-metrics).

To deploy the sample dashboard:

1. Enable metrics and traces via CRD by [following the instruction](/docs/mqtt-broker/diagnostics-settings/), save as diag.yaml and apply the yaml.

   ```bash
   kubectl apply -f diag.yaml
   ```

1. Install the sample dashboard.

   ```bash
   helm install obs-sample oci://e4kpreview.azurecr.io/helm/sample-dashboard --version 0.4.0 -n e4k-observability-sample --create-namespace
    ```

   If the command runs successfully, you will see an output similar to

   ```text
    Pulled: e4kpreview.azurecr.io/helm/sample-dashboard:0.4.0
    Digest: sha256:46842c8bd7f8e46dc8bcc623ae8505a53b377cd75c293f03797736e2f4b0b235
    NAME: obs-sample
    LAST DEPLOYED: Wed Jun 9 23:14:21 2023
    NAMESPACE: e4k-observability-sample
    STATUS: deployed
    REVISION: 1
   ```

1. Port-forward Grafana service to localhost port 3000:

   ```bash
   kubectl port-forward svc/obs-sample-grafana 3000:80 -n e4k-observability-sample
   ```

   Note: _The name of the Grafana service is `<helm-installation-name>-grafana`. In the example above, the `helm-installation-name` is `obs-sample`_

1. In your local browser, go to <http://localhost:3000>. When asked for username enter `admin` and password is `prom-operator`.

1. In Grafana UI, go to **Dashboard > General > E4K-Main**:

   Note that some tiles and charts may show as red as defaults are sample thresholds. Please modify the thresholds in Grafana as you see fits in your defined SLOs.

   ![Dashboard](SLI-Dashboard.png)

## Available metrics

For details on the IoT MQ broker and cloud connector metrics, see [Available metrics for IoT MQ broker and cloud connector](/docs/reference/2-metrics/).

| Service Level Indicator (SLI) | The indicators or actual metric values that come from IoT MQ measurements. Customers can define their SLOs based on SLI metrics |
| Service Level Objectives (SLO)  | The objectives or targets we're trying to meet. The SLIs will be used to assess if we are meeting our SLOs or not |
| Customer  SLOs | Customer centric SLO represents the north star for quality of IoT MQ deployed and defined by IoT MQ customers. IoT MQ emits SLI metrics for customers to define their SLOs |

For details on the SLI metrics, see [SLI metrics](/docs/observability/3-sli/).

## Logs

Logs will be scraped from IoT MQ pods and shipped to Grafana Loki using Fluentd. You can install and configure this as follows:

1. Open [Grafana dashboard](http://localhost:3000). Make sure to configure the grafana port-foward if not done previously. Go to Explore menu from the left navigation bar and select Loki from the pull-down menu on the left top.

1. Search some keywords from the logs. In this example, search with the keyword = 'probe' which are the logs from the Selftest component.
   1. On top right screen, there are toggles to choose between 'Builder' or 'Code'. Choose 'Code' as default is 'Builder'.
   1. Run the query below.

   ```bash
   {job="e4kvarlogs"} |= `probe` | logfmt | __error__=`` | line_format `{{.message}}`
   ```

1. You should see the results below for logs from the Diagnostic Service pod.

   ![Loki-View](Loki-Show.png)

## Traces

Traces will be exported to Grafana Tempo using the OpenTelemetry Collector. You can install and configure this as follows:

1. Install Grafana Tempo

   - The instructions use the "e4k-observability-sample" namespace. This can be changed by modifying the command line parameter and/or subsequent yaml file in the instruction.

   - Below command assumes that `Grafana` repo is added from the Log section above. If the repo is not added previously, run `helm repo add grafana https://grafana.github.io/helm-charts` and `helm repo update` commands before running the command below.

   ```bash
   helm upgrade --install tempo grafana/tempo -n e4k-observability-sample
   ```

1. Configure Diagnostics Service to export traces to the OpenTelemetry collector endpoint.

   ```bash
   kubectl set env deployment/azedge-diagnostics-service OPENTELEMETRY_COLLECTOR_ADDR=http://otel-collector.e4k-observability-sample.svc.cluster.local:4317
   ```

1. Set up the port forwarding for Grafana:

    ```bash
   kubectl port-forward svc/obs-sample-grafana 3000:80 -n e4k-observability-sample
   ```

1. Open [Grafana dashboard](http://localhost:3000).

1. To view distributed traces via Grafana Tempo:

   1. Go to Explore menu from the left navigation bar and select Tempo from the pull-down menu on the left top.
   1. Go to Search tab. Select service name and span name.
   1. Click 'Run query' button on the top right corner. This will match all traces.
   1. If you'd like to see traces originating from a specific pod or span, select service and span names from the drop-down menu.

   ![Tempo-View](Tempo-Traces.png)

## Monitor and set alerts with Service Level Indicator (SLI) metrics

IoT MQ is built to report its performance and correctness as [SLI](https://learn.microsoft.com/azure/cloud-adoption-framework/scenarios/cloud-scale-analytics/manage-observability#service-level-indicators-slis) metrics in near real-time. You can use the SLI metrics to understand how the system is behaving currently and to get a historical trend of system behavior. You can evaluate the SLIs against your targets or objectives, which are typically expressed as SLOs. The builtin metrics provided by IoT MQ enables you to monitor the performance of the system and identify when the system does not meet objectives.

In the following sections, you will learn about the various SLI metrics provided by IoT MQ and how to configure Grafana to define alerts that fit your SLOs. You will learn about how to identify issues using the metrics charts and troubleshoot them through logs and traces.

## Glossary

| Name | Meaning |
|---|:---:|
| Publish latency | Publish latency is defined as the time interval between a client sending a PUBLISH and receiving a PUB_ACK |
| Publish Health | Each message published to IoT MQ is replicated a configured number of times across a redundant array of broker nodes. Not all message are replicated to all the broker nodes. Instead, each message is assigned a subset of broker nodes, with a defined path (route) that the message should take to visit the subset of broker nodes for replication purposes. At any given time, the system is defined as being healthy from a publish perspective, if it has been verified that the expected routes have been followed for at least one publish message per route |
| µ (mu)   | Average 99th percentile of publish latency in [ms] |
| σ (sigma)  | Standard deviation of the 99th percentile of publish latency [ms] |
| Control chart  | Statistical chart to monitor and analyze publish latency with UCL and LCL values to take corrective actions |
| Upper Control Limit (UCL)  | The highest value in variation a system can accept. This is typically set to µ + 3σ  |
| Lower Control Limit (LCL)  | The lowest value in variation a system can accept. This is typically set to µ - 3σ |

## Monitoring SLI metrics in Grafana

1. Prerequsites:
   - Configure Grafana following [these instructions](https://www.e4k.dev/docs/observability/#metrics)

1. Below table shows you how to interpret each value in the Grafana charts.

| Value | Meaning |
|---|:---:|
| Publish Health % (avg) | Average of publish health in [%] |
| Publish Health per route (avg)   | Average of publish health per route (frontend pods) in [%] |
| Publish message latency (Average 99th percentile) |  Average 99th percentile of publish latency in [ms]   |
| Publish message latency (Std dev of 99th percentile)   | Standard deviation of the 99th percentile of publish latency in [ms] |
| Publish message latency Control Chart   | The control chart for publish latency to identify when the IoT MQ deployed system is experiencing abnormal variation |

1. Setting alerts

Each SLI metric comes with sample alerts. These alerts are listed under **Alerting** > **Alert rules**. To view an alert, choose the view action on it. A page with alert details displays.

![Screenshot showing the IoT MQ Subscribe alert details](grafana-view-alert.png)

Alerts are also visible on the dashboard charts.

![Screenshot showing the IoT MQ Subscribe alert icon on dashboard chart](grafana-alert-in-dashboard.png)

The alerts thresholds are provided as a sample and should be updated based on your custom solution parameters. The sample alerts are read only. To edit, please clone or create new ones with updated parameters.



The E4K broker and cloud connector exposes several metrics through the diagnostics service.

## Configuration

The metric config has three global values:

* `disable_all` [false]: Setting this to true will disable all metrics and prevent the pod from connecting to the diagnostics service.
* `metric_update_frequency_seconds` [30]: How frequently metrics should be sent to the diagnostics service.

In addition, each metric can be individually toggled. The following table shows the metrics and labels/tags.

Metric Name | Labels/tags
--|--
Messaging Metrics: |
[publishes_received](#publishes_received) | `ThreadId`
[publishes_sent](#publishes_sent) | `ThreadId`
[authorization_allow](#authorization_allow) | `ThreadId`
[authorization_deny](#authorization_deny) | `ThreadId`
Connection and Subscription Metrics: |
[total_sessions](#total_sessions) | `mqtt_version`
[store_total_sessions](#store_total_sessions)  | `is_persistent`
[connected_sessions](#connected_sessions)  |
[store_connected_sessions](#store_connected_sessions) | `is_persistent`
[total_subscriptions](#total_subscriptions)  |
[store_total_subscriptions](#store_total_subscriptions)  |
[authentication_successes](#authentication_successes)  | `ThreadId`
[authentication_failures](#authentication_failures)  | `ThreadId`
Self-test Metrics: |
[connect_route_replication_correctness](#connect_route_replication_correctness)|`route`
[connect_latency_route_ms](#connect_latency_route_ms)|`route`
[connect_latency_last_value_ms](#connect_latency_last_value_ms)|
[connect_latency_mu_ms](#connect_latency_mu_ms)|
[connect_latency_sigma_ms](#connect_latency_sigma_ms) |
[subscribe_route_replication_correctness](#subscribe_route_replication_correctness) | `route`
[subscribe_latency_route_ms](#subscribe_latency_route_ms) | `route`
[subscribe_latency_last_value_ms](#subscribe_latency_last_value_ms) | 
[subscribe_latency_mu_ms](#subscribe_latency_mu_ms)|
[subscribe_latency_sigma_ms](#subscribe_latency_sigma_ms)|
[unsubscribe_route_replication_correctness](#unsubscribe_route_replication_correctness)| `route`
[unsubscribe_latency_route_ms](#unsubscribe_latency_route_ms)| `route`
[unsubscribe_latency_last_value_ms](#unsubscribe_latency_last_value_ms)|
[unsubscribe_latency_mu_ms](#unsubscribe_latency_mu_ms)|
[unsubscribe_latency_sigma_ms](#unsubscribe_latency_sigma_ms)|
[publish_route_replication_correctness](#publish_route_replication_correctness)|`route`
[publish_latency_route_ms](#publish_latency_route_ms) | `route`
[publish_latency_last_value_ms](#publish_latency_last_value_ms)|
[publish_latency_mu_ms](#publish_latency_mu_ms)|
[publish_latency_sigma_ms](#publish_latency_sigma_ms)|
Operator Health Metrics |
[backend_replicas](#operator-health-metrics) |
[backend_replicas_current](#operator-health-metrics) |
[backend_vertical_chain](#operator-health-metrics) |
[backend_vertical_chain_current](#operator-health-metrics) |
[frontend_replicas](#operator-health-metrics) |
[frontend_replicas_current](#operator-health-metrics) |

### Metric Descriptions

#### publishes_received

On the front end, this represents how many incoming publish packets have been received from clients. For the backend, this represents how many internal messages have been sent from the front end nodes.

Tags: `ThreadId`

#### publishes_sent

On the front end, this represents how many outgoing publish packets have been sent to clients. If multiple clients are subscribed to the same topic, this will count each message sent, even if they have the same payload. This does not count ack packets. For the backend, this represents how many internal messages have been sent to the front end nodes.

Tags: `ThreadId`

#### authentication_successes

This metric counts how many times a client has successfully authenticated.

Tags: `ThreadId`

#### authentication_failures

This metric counts how many times a client has failed to authenticate. Note for an errorless authentication server: authentication_successes + authentication_failures = publishes_received = publishes_sent

Tags: `ThreadId`

#### authorization_allow

This metric counts how many times an authenticated client has successfully authorized. This should always be less than or equal to authentication_successes.

Tags: `ThreadId`

#### authorization_deny

This metric counts how many times an authenticated client has been denied. This should always be less than or equal to authentication_successes.

Tags: `ThreadId`

#### Operator Health Metrics

This set of metrics tracks the overall state of the broker. These are paired metrics, where the first metric (e.g. backend_replicas) represents the desired state and the second metric (e.g. backend_replicas_current) represents the current state. These metrics show how many pods are healthy from the broker's perspective, and might not match with what k8s reports.

For example, if a back end node has been restarted but has not reconnected to it's chain, k8s will report the pod as healthy but the operator will report the pod as down, since it is not functioning.

Desired Metric | Reported Metric
--|--
backend_replicas | backend_replicas_current
backend_vertical_chain | backend_vertical_chain_current
frontend_replicas | frontend_replicas_current
<!-- authentication_service_replicas | authentication_service_replicas_current -->

Note backend_vertical_chain_current will report the chain with the least healthy nodes. For example, if there is an expected chain length of 4, and 3 of the chains have 4 healthy nodes and 1 chain only has 2 healthy nodes, the backend_vertical_chain_current will report 2.

#### total_sessions

On the front end and single node broker, this represents how many client sessions there are. This does not include disconnected persistent sessions, because a client might reconnect to a different front end node. For the backend, this represents its connections to the other nodes in its chain. On the operator, this represents how many front and back end nodes are connected. For the authentication server, this represents how many front end workers are connected (1 per front end per thread)

Tags:

* `mqtt_version`: [v3/v5]

Backend Node Only Tags:

* `is_tail`: [true/false]
* `chain_id`: [n]

#### store_total_sessions

This is a back end specific metric that represents how many sessions are managed by the backend's chain. Backend nodes in the same chain should report the same number of sessions, and the sum of each chain should equal the sum of the front end's total_sessions.

Tags:

* `is_persistent`: [true/false]
* `is_tail`: [true/false]
* `chain_id`: [n]

#### connected_sessions

As [total_sessions](#total_sessions), except only sessions that have an active connection.

#### store_connected_sessions

As [store_total_sessions](#store_total_sessions), except only sessions that have an active connection. If is_persistent is false, this should be equal to total sessions

#### total_subscriptions

On the front end, this represents how many subscriptions the currently connected sessions have. This does not include disconnected persistent sessions, because a client might reconnect to a different front end node. For the backend, this represents other nodes in its chain connecting to it. On the operator, this represents the front and back end nodes. For the authentication server, this represents how many front end workers are connected (1 per front end per thread)

#### store_total_subscriptions

This is a back end specific metric that represents how many subscriptions are managed by the backend's chain. Backend nodes in the same chain should report the same number of subscriptions. This will not necessarily match the front end's total_subscriptions, since this metric tracks disconnected persistent sessions as well.

#### connect_route_replication_correctness

This metric describes if a connection request from selftest client is replicated correctly along a specific route.

#### connect_latency_route_ms

This metric describes time interval between a selftest client sending a CONNECT packet and receiving a CONNACK packet. This metric is generated per route. This metric is generated only if a CONNECT is successful.

#### connect_latency_last_value_ms

This metric is an estimated p99 of connect_latency_route_ms.

#### connect_latency_mu_ms

This metric is the mean value of connect_latency_route_ms.

#### connect_latency_sigma_ms

This metric is the standard deviation of connect_latency_route_ms.

#### subscribe_route_replication_correctness

This metric describes if a subscribe request from selftest client is replicated correctly along a specific route.

#### subscribe_latency_route_ms

This metric describes time interval between a selftest client sending a SUBSCRIBE packet and receiving a SUBACK packet. This metric is genrated per route. This metric is generated only if a SUBSCRIBE is successful.

#### subscribe_latency_last_value_ms

This metric is an estimated p99 of subscribe_latency_route_ms.

#### subscribe_latency_mu_ms

This metric is the mean value of subscribe_latency_route_ms.

#### subscribe_latency_sigma_ms

This metric is the standard deviation of subscribe_latency_route_ms.

#### unsubscribe_route_replication_correctness

This metric describes if a unsubscribe request from selftest client is replicated correctly along a specific route.

#### unsubscribe_latency_route_ms

This metric describes time interval between a selftest client sending a UNSUBSCRIBE packet and receiving a UNSUBACK packet. This metric is genrated per route. This metric is generated only if a UNSUBSCRIBE is successful.

#### unsubscribe_latency_last_value_ms

This metric is an estimated p99 of unsubscribe_latency_route_ms.

#### unsubscribe_latency_mu_ms

This metric is the mean value of unsubscribe_latency_route_ms.

#### unsubscribe_latency_sigma_ms

This metric is the standard deviation of unsubscribe_latency_route_ms.

#### publish_route_replication_correctness

This metric describes if a publish request from selftest client is replicated correctly along a specific route.

#### publish_latency_route_ms

This metric describes time interval between a selftest client sending a PUBLISH packet and receiving a PUBACK packet. This metric is genrated per route. This metric is generated only if a PUBLISH is successful.

#### publish_latency_last_value_ms

This metric is an estimated p99 of publish_latency_route_ms.

#### publish_latency_mu_ms

This metric is the mean value of publish_latency_route_ms.

#### publish_latency_sigma_ms

This metric is the standard deviation of publish_latency_route_ms.

## Cloud connector Metrics

## Configuration

The metrics config has three values. The default value is indicated with [].

* disable_all [false] Setting this to true will disable all metrics and prevent the pod from connecting to the diagnostics service.
* metric_update_frequency_seconds: [30] How frequently metrics should be sent to the diagnostics service.

Metric Name | Tags
--|--
connector_routes |
local_publishes_received | `route`, `hostname`
local_publishes_sent | `route`, `hostname`
cloud_publishes_received | `route`, `hostname`
cloud_publishes_sent | `route`, `hostname`

## Metric Descriptions

### connector_routes

The number of routes configured.

### local_publishes_received

Number of publishes received from the dmqtt broker. If the connector is online this should be equal to the `cloud_publishes_sent` with the same `route` tag.

### local_publishes_sent

Number of publishes sent to the dmqtt broker. This should be equal to the `cloud_publishes_received` with the same `route` tag.

### cloud_publishes_received

Number of messages received from the cloud.

### cloud_publishes_sent

Number of messages sent to the cloud.

## Related content
