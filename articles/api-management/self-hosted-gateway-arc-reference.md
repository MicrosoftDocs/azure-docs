---
title: Reference - Self-hosted gateway Azure Arc settings - Azure API Management
description: Reference for the required and optional settings to configure when using the Azure Arc extension for Azure API Management self-hosted gateway.
services: api-management
author: tomkerkhove

ms.service: api-management
ms.topic: reference
ms.date: 06/04/2023
ms.author: danlep
---

# Reference: Self-hosted gateway Azure Arc configuration settings

This article provides a reference for required and optional settings that are used to configure the Azure Arc extension for API Management [self-hosted gateway container](self-hosted-gateway-overview.md). 

[!INCLUDE [preview](./includes/preview/preview-callout-self-hosted-gateway-azure-arc.md)]

## Configuration API integration

The Configuration API is used by the self-hosted gateway to connect to Azure API Management to get the latest configuration and send metrics, when enabled.

Here's an overview of all configuration options:

| Name                           | Description              | Required | Default           |
|----|------|----------|-------------------|
| `gateway.configuration.uri` | Configuration endpoint in Azure API Management for the self-hosted gateway. Find this value in the Azure portal under **Gateways** > **Deployment**.  | Yes       | N/A             |
| `gateway.auth.token` | Authentication key to authenticate with to Azure API Management service. Typically starts with `GatewayKey`. | Yes | N/A |
| `gateway.configuration.backup.enabled` | If enabled will store a backup copy of the latest downloaded configuration on a storage volume | `false` |
| `gateway.configuration.backup.persistentVolumeClaim.accessMode` | Access mode for the Persistent Volume Claim (PVC) pod | `ReadWriteMany` |
| `gateway.configuration.backup.persistentVolumeClaim.size` | Size of the Persistent Volume Claim (PVC) to be created | `50Mi` |
| `gateway.configuration.backup.persistentVolumeClaim.storageClassName` | Storage class name to be used for the Persistent Volume Claim (PVC). When no value is assigned (`null`), the platform default will be used. The specified storage class should support `ReadWriteMany` access mode, learn more about the [supported volume providers and their supported access modes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes).| `null` |

## Cross-instance discovery & synchronization

| Name                           | Description              | Required | Default           |
|----|------|----------|-------------------|
| `service.instance.heartbeat.port` | UDP port used for instances of a self-hosted gateway deployment to send heartbeats to other instances. | No | 4291 |
| `service.instance.synchronization.port` | UDP port used for self-hosted gateway instances to synchronize rate limiting across multiple instances. | No | 4290 |

##  Metrics

| Name                           | Description              | Required | Default           |
|----|------|----------|-------------------|
| `telemetry.metrics.cloud` | Indication whether or not to [enable emitting metrics to Azure Monitor](how-to-configure-cloud-metrics-logs.md). | No | `true` |
| `telemetry.metrics.local` | Enable [local metrics collection](how-to-configure-local-metrics-logs.md) through StatsD. Value is one of the following options: `none`, `statsd`. | No | N/A |
| `telemetry.metrics.localStatsd.endpoint` | StatsD endpoint. | Yes, if `telemetry.metrics.local` is set to `statsd`; otherwise no.  | N/A |
| `telemetry.metrics.localStatsd.sampling` | StatsD metrics sampling rate. Value must be between 0 and 1, for example, 0.5. |  No | N/A |
| `telemetry.metrics.localStatsd.tagFormat` | StatsD exporter [tagging format](https://github.com/prometheus/statsd_exporter#tagging-extensions). Value is one of the following options: `ibrato`, `dogStatsD`, `influxDB`. | No | N/A |
| `telemetry.metrics.opentelemetry.enabled` | Indication whether or not to enable [emitting metrics to an OpenTelemetry collector](how-to-deploy-self-hosted-gateway-kubernetes-opentelemetry.md) on Kubernetes. | No | `false` |
| `telemetry.metrics.opentelemetry.collector.uri` | URI of the OpenTelemetry collector to send metrics to. | Yes, if `observability.opentelemetry.enabled` is set to `true`; otherwise no. | N/A |

## Logs

| Name   | Description | Required | Default |
| ------------- | ------------- | ------------- | ----|
| `telemetry.logs.std`  |[Enable  logging](how-to-configure-local-metrics-logs.md#logs) to a standard stream. Value is one of the following options: `none`, `text`, `json`. | No |  `text` |
| `telemetry.logs.local`  | [Enable local logging](how-to-configure-local-metrics-logs.md#logs). Value is one of the following options: `none`, `auto`, `localsyslog`, `rfc5424`, `journal`, `json`  | No  | `auto` |
| `telemetry.logs.localConfig.localsyslog.endpoint` |  Endpoint for local syslogs  | Yes if `telemetry.logs.local` is set to `localsyslog`; otherwise no. | N/A |
| `telemetry.logs.localConfig.localsyslog.facility`  | Specifies local syslog [facility code](https://en.wikipedia.org/wiki/Syslog#Facility), for example, `7`. | No | N/A |
| `telemetry.logs.localConfig.rfc5424.endpoint` |  rfc5424 endpoint.  | Yes if `telemetry.logs.local` is set to `rfc5424`; otherwise no. | N/A |
| `telemetry.logs.localConfig.rfc5424.facility` | Facility code per [rfc5424](https://tools.ietf.org/html/rfc5424), for example, `7`  | No | N/A |
| `telemetry.logs.localConfig.journal.endpoint` | Journal endpoint.   |Yes if `telemetry.logs.local` is set to `journal`; otherwise no. | N/A |

## Traffic routing

| Name   | Description | Required | Default |
| ------------- | ------------- | ------------- | ----|
| `service.type` | Type of Kubernetes service to use for exposing the gateway. ([docs](https://kubernetes.io/docs/concepts/services-networking/service/#publishing-services-service-types)) | No | `ClusterIP` |
| `service.http.port` | Port to use for exposing HTTP traffic. | No | `8080` |
| `service.http.nodePort` | Port on the node to use for exposing HTTP traffic. This requires `NodePort` as service type. | No | N/A |
| `service.https.port` | Port to use for exposing HTTPS traffic. | No | `8081` |
| `service.https.nodePort` | Port on the node to use for exposing HTTPS traffic. This requires `NodePort` as service type. | No | N/A |
| `service.annotations` | Annotations to add to the Kubernetes service for the gateway. | No | N/A |
| `ingress.annotations` | Annotations to add to the Kubernetes Ingress for the gateway. ([experimental](https://github.com/Azure/api-management-self-hosted-gateway-ingress)) | No | N/A |
| `ingress.enabled` | Indication whether or not Kubernetes Ingress should be used. ([experimental](https://github.com/Azure/api-management-self-hosted-gateway-ingress)) | No | `false` |
| `ingress.tls` | TLS configuration for Kubernetes Ingress. ([experimental](https://github.com/Azure/api-management-self-hosted-gateway-ingress)) | No | N/A |
| `ingress.hosts` | Configuration of hosts to use for Kubernetes Ingress. ([experimental](https://github.com/Azure/api-management-self-hosted-gateway-ingress)) | No | N/A |

## Integrations

The self-hosted gateway integrates with various other technologies. This section provides an overview of the available configuration options you can use.

### Dapr

| Name   | Description | Required | Default |
| ------------- | ------------- | ------------- | ----|
| `dapr.enabled`  |Indication whether or not Dapr integration should be used. | No |  `false` |
| `dapr.app.id` | Application ID to use for Dapr integration | None |
| `dapr.config` | Defines which Configuration CRD Dapr should use | `tracing` |
| `dapr.logging.level` | Level of log verbosity of Dapr sidecar | `info` |
| `dapr.logging.useJsonOutput` | Indication whether or not logging should be in JSON format | `true` |

### Azure Monitor

| Name   | Description | Required | Default |
| ------------- | ------------- | ------------- | ----|
| `monitoring.customResourceId`  | Resource ID of the Azure Log Analytics workspace to send logs to. | No | N/A |
| `monitoring.ingestionKey`  | Ingestion key to authenticate with Azure Log Analytics workspace to send logs to. | No | N/A |
| `monitoring.workspaceId`  | Workspace ID of the Azure Log Analytics workspace to send logs to. | No | N/A |

## Image & workload scheduling

Kubernetes is a powerful orchestration platform that gives much flexibility in what should be deployed and how it should be scheduled.

This section provides an overview of the available configuration options you can use to influence the image that is used, how it gets scheduled and configured to self-heal.

| Name   | Description | Required | Default |
| ------------- | ------------- | ------------- | ----|
| `replicaCount`  | Number of instances of the self-hosted gateway to run. | No |  `3` |
| `image.repository` | Image to run. | No |  `mcr.microsoft.com/azure-api-management/gateway` |
| `image.pullPolicy`  | Policy to use for pulling container images. | No | `IfNotPresent` |
| `image.tag`  | Container image tag to use. | No | App version of extension is used |
| `imagePullSecrets`  | Kubernetes secret to use for authenticating with container registry when pulling the container image. | No | N/A |
| `probes.readiness.httpGet.path` | URI path to use for readiness probes of the container | No | `/status-0123456789abcdef` |
| `probes.readiness.httpGet.port` | Port to use for liveness probes of the container | No | `http` |
| `probes.liveness.httpGet.path` | URI path to use for liveness probes of the container | No | `/status-0123456789abcdef` |
| `probes.liveness.httpGet.port` | Port to use for liveness probes of the container | No | `http` |
| `highAvailability.enabled` | Indication whether or not the gateway should be scheduled highly available in the cluster. | No | `false` |
| `highAvailability.disruption.maximumUnavailable` | Amount of pods that are allowed to be unavailable due to [voluntary disruptions](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/#voluntary-and-involuntary-disruptions). | No | `25%` |
| `highAvailability.podTopologySpread.whenUnsatisfiable` | Indication how pods should be spread across nodes in case the requirement can't be met. Learn more in the [Kubernetes docs](https://kubernetes.io/docs/concepts/workloads/pods/pod-topology-spread-constraints/) | No | `ScheduleAnyway` |
| `resources` | Capability to define CPU/Memory resources to assign to gateway | No | N/A |
| `nodeSelector` | Capability to use selectors to identify the node on which the gateway should run. | No | N/A |
| `affinity` | Affinity for pod scheduling ([docs](https://kubernetes.io/docs/tasks/configure-pod-container/assign-pods-nodes-using-node-affinity/)) | No | N/A |
| `tolerations` | 	Tolerations for pod scheduling ([docs](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/)) | No | N/A |

## Next steps

-   Learn more about guidance for [running the self-hosted gateway on Kubernetes in production](how-to-self-hosted-gateway-on-kubernetes-in-production.md)
-   [Deploy self-hosted gateway to Docker](how-to-deploy-self-hosted-gateway-docker.md)
-   [Deploy self-hosted gateway to Kubernetes](how-to-deploy-self-hosted-gateway-kubernetes.md)
-   [Deploy self-hosted gateway to Azure Arc-enabled Kubernetes cluster](how-to-deploy-self-hosted-gateway-azure-arc.md)
- [Enable Dapr support on self-hosted gateway](self-hosted-gateway-enable-dapr.md)
- Learn more about configuration options for the [self-hosted gateway container image](self-hosted-gateway-settings-reference.md)
