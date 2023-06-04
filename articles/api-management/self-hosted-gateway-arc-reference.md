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

## Configuration API integration - TODO

The Configuration API is used by the self-hosted gateway to connect to Azure API Management to get the latest configuration and send metrics, when enabled.

Here is an overview of all configuration options:

| Name                           | Description              | Required | Default           | Availability |
|----|------|----------|-------------------|-------------------|
| gateway.name | Id of the self-hosted gateway resource. | Yes, when using Azure AD authentication | N/A | v2.3+ |
| config.service.endpoint | Configuration endpoint in Azure API Management for the self-hosted gateway. Find this value in the Azure portal under **Gateways** > **Deployment**.  | Yes       | N/A             | v2.0+ |
| config.service.auth | Defines how the self-hosted gateway should authenticate to the Configuration API. Currently gateway token and Azure AD authentication are supported. | Yes | N/A | v2.0+ |
| config.service.auth.azureAd.tenantId | ID of the Azure AD tenant. | Yes, when using Azure AD authentication | N/A | v2.3+ |
| config.service.auth.azureAd.clientId | Client ID of the Azure AD app to authenticate with (also known as application ID). | Yes, when using Azure AD authentication | N/A | v2.3+ |
| config.service.auth.azureAd.clientSecret | Secret of the Azure AD app to authenticate with. | Yes, when using Azure AD authentication (unless certificate is specified) | N/A | v2.3+ |
| config.service.auth.azureAd.certificatePath | Path to certificate to authenticate with for the Azure AD app. | Yes, when using Azure AD authentication (unless secret is specified) | N/A | v2.3+ |
| config.service.auth.azureAd.authority | Authority URL of Azure AD. | No | `https://login.microsoftonline.com` | v2.3+ |

The self-hosted gateway provides support for a few authentication options to integrate with the Configuration API which can be defined by using `config.service.auth`.

This guidance helps you provide the required information to define how to authenticate:

- For gateway token-based authentication, specify an access token (authentication key) of the self-hosted gateway in the Azure portal under **Gateways** > **Deployment**.
- For Azure AD-based authentication, specify `azureAdApp` and provide the additional `config.service.auth.azureAd` authentication settings.

## Cross-instance discovery & synchronization - TODO

| Name                           | Description              | Required | Default           | Availability |
|----|------|----------|-------------------| ----|
| neighborhood.host | DNS name used to resolve all instances of a self-hosted gateway deployment for cross-instance synchronization. In Kubernetes, it can be achieved by using a headless Service. | No | N/A | v2.0+ |
| neighborhood.heartbeat.port | UDP port used for instances of a self-hosted gateway deployment to send heartbeats to other instances. | No | 4291 | v2.0+ |
| policy.rate-limit.sync.port | UDP port used for self-hosted gateway instances to synchronize rate limiting across multiple instances. | No | 4290 | v2.0+ |

##  Metrics

| Name                           | Description              | Required | Default           |
|----|------|----------|-------------------| ----|
| telemetry.metrics.cloud | Indication whether or not to [enable emitting metrics to Azure Monitor](how-to-configure-cloud-metrics-logs.md). | No | `true` |
| telemetry.metrics.local | Enable [local metrics collection](how-to-configure-local-metrics-logs.md) through StatsD. Value is one of the following options: `none`, `statsd`. | No | N/A |
| telemetry.metrics.localStatsd.endpoint | StatsD endpoint. | Yes, if `telemetry.metrics.local` is set to `statsd`; otherwise no.  | N/A |
| telemetry.metrics.localStatsd.sampling | StatsD metrics sampling rate. Value must be between 0 and 1, for example, 0.5. |  No | N/A |
| telemetry.metrics.localStatsd.tagFormat | StatsD exporter [tagging format](https://github.com/prometheus/statsd_exporter#tagging-extensions). Value is one of the following options: `ibrato`, `dogStatsD`, `influxDB`. | No | N/A |
| telemetry.metrics.opentelemetry.enabled | Indication whether or not to enable [emitting metrics to an OpenTelemetry collector](how-to-deploy-self-hosted-gateway-kubernetes-opentelemetry.md) on Kubernetes. | No | `false` |
| telemetry.metrics.opentelemetry.collector.uri | URI of the OpenTelemetry collector to send metrics to. | Yes, if `observability.opentelemetry.enabled` is set to `true`; otherwise no. | N/A |

## Logs - TODO

| Name   | Description | Required | Default | Availability |
| ------------- | ------------- | ------------- | ----| ----|
| telemetry.logs.std  |[Enable  logging](how-to-configure-local-metrics-logs.md#logs) to a standard stream. Value is one of the following options: `none`, `text`, `json`. | No |  `text` |
| telemetry.logs.local  | [Enable local logging](how-to-configure-local-metrics-logs.md#logs). Value is one of the following options: `none`, `auto`, `localsyslog`, `rfc5424`, `journal`, `json`  | No  | `auto` |
| telemetry.logs.localConfig.localsyslog.endpoint  |  localsyslog endpoint.  | Yes if `telemetry.logs.local` is set to `localsyslog`; otherwise no. | N/A |
| telemetry.logs.localConfig.localsyslog.facility  | Specifies localsyslog [facility code](https://en.wikipedia.org/wiki/Syslog#Facility), for example, `7`. | No | N/A |
| telemetry.logs.localConfig.rfc5424.endpoint  |  rfc5424 endpoint.  | Yes if `telemetry.logs.local` is set to `rfc5424`; otherwise no. | N/A |
| telemetry.logs.localConfig.rfc5424.facility  | Facility code per [rfc5424](https://tools.ietf.org/html/rfc5424), for example, `7`  | No | N/A |
| telemetry.logs.localConfig.journal.endpoint  | Journal endpoint.   |Yes if `telemetry.logs.local` is set to `journal`; otherwise no. | N/A |

## Traffic routing - TODO

- Service
- Ingress

## Integrations - TODO

The self-hosted gateway integrates with varios other technologies. This section provides an overview of the available configuration options you can use.

### Dapr

| Name   | Description | Required | Default |
| ------------- | ------------- | ------------- | ----| ----|
| `dapr.enabled`  |Indication wheter or not Dapr integration should be used. | No |  `false` |
| `dapr.app.id` | Application ID to use for Dapr integration | None |
| `dapr.config` | Defines which Configuration CRD Dapr should use | `tracing` |
| `dapr.logging.level` | Level of log verbosity of Dapr sidecar | `info` |
| `dapr.logging.useJsonOutput` | Indication wheter or not logging should be in JSON format | `true` |

### Azure Monitor - TODO

| Name   | Description | Required | Default |
| ------------- | ------------- | ------------- | ----| ----|
| `dapr.enabled`  |Indication wheter or not Dapr integration should be used. | No |  `false` |

## Scheduling / HA / ... - TODO

- Image + Policy
- HA
- Health probes
- Selectors, taints, tolerances, 

| Name   | Description | Required | Default |
| ------------- | ------------- | ------------- | ----| ----|
| telemetry.logs.std  |[Enable  logging](how-to-configure-local-metrics-logs.md#logs) to a standard stream. Value is one of the following options: `none`, `text`, `json`. | No |  `text` |

## Next steps

-   Learn more about guidance for [running the self-hosted gateway on Kubernetes in production](how-to-self-hosted-gateway-on-kubernetes-in-production.md)
-   [Deploy self-hosted gateway to Docker](how-to-deploy-self-hosted-gateway-docker.md)
-   [Deploy self-hosted gateway to Kubernetes](how-to-deploy-self-hosted-gateway-kubernetes.md)
-   [Deploy self-hosted gateway to Azure Arc-enabled Kubernetes cluster](how-to-deploy-self-hosted-gateway-azure-arc.md)
- [Enable Dapr support on self-hosted gateway](self-hosted-gateway-enable-dapr.md)
- Learn more about configuration options for the [self-hosted gateway container image](self-hosted-gateway-settings-reference.md)
