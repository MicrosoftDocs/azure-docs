---
title: Reference - Self-hosted gateway container settings - Azure API Management
description: Reference for the required and optional settings to configure the Azure API Management self-hosted gateway.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: reference
ms.date: 06/28/2022
ms.author: danlep
---

# Reference: Self-hosted gateway container configuration settings

This article provides a reference for required and optional settings that are used to configure the API Management [self-hosted gateway container](self-hosted-gateway-overview.md). 

> [!IMPORTANT]
> This reference applies only to the self-hosted gateway v2. Minimum versions for availability of settings are provided.

## Configuration API integration

The Configuration API is used by the self-hosted gateway to connect to Azure API Management to get the latest configuration and send metrics, when enabled.

Here is an overview of all configuration options:

| Name                           | Description              | Required | Default           | Availability |
|----|------|----------|-------------------|-------------------|
| gateway.name | Id of the self-hosted gateway resource. | Yes, when using Microsoft Entra authentication | N/A | v2.3+ |
| config.service.endpoint | Configuration endpoint in Azure API Management for the self-hosted gateway. Find this value in the Azure portal under **Gateways** > **Deployment**.  | Yes       | N/A             | v2.0+ |
| config.service.auth | Defines how the self-hosted gateway should authenticate to the Configuration API. Currently gateway token and Microsoft Entra authentication are supported. | Yes | N/A | v2.0+ |
| config.service.auth.azureAd.tenantId | ID of the Microsoft Entra tenant. | Yes, when using Microsoft Entra authentication | N/A | v2.3+ |
| config.service.auth.azureAd.clientId | Client ID of the Microsoft Entra app to authenticate with (also known as application ID). | Yes, when using Microsoft Entra authentication | N/A | v2.3+ |
| config.service.auth.azureAd.clientSecret | Secret of the Microsoft Entra app to authenticate with. | Yes, when using Microsoft Entra authentication (unless certificate is specified) | N/A | v2.3+ |
| config.service.auth.azureAd.certificatePath | Path to certificate to authenticate with for the Microsoft Entra app. | Yes, when using Microsoft Entra authentication (unless secret is specified) | N/A | v2.3+ |
| config.service.auth.azureAd.authority | Authority URL of Microsoft Entra ID. | No | `https://login.microsoftonline.com` | v2.3+ |
| config.service.auth.tokenAudience | Audience of token used for Microsoft Entra authentication | No | `https://azure-api.net/configuration` | v2.3+ |
| config.service.endpoint.disableCertificateValidation | Defines if the self-hosted gateway should validate the server-side certificate of the Configuration API. It is recommended to use certificate validation, only disable for testing purposes and with caution as it can introduce security risk. | No | `false` |  v2.0+ |
| config.service.integration.timeout | Defines the timeout for interacting with the Configuration API. | No | `00:01:40` |  v2.3.5+ |

The self-hosted gateway provides support for a few authentication options to integrate with the Configuration API which can be defined by using `config.service.auth`.

This guidance helps you provide the required information to define how to authenticate:

- For gateway token-based authentication, specify an access token (authentication key) of the self-hosted gateway in the Azure portal under **Gateways** > **Deployment**.
- For Microsoft Entra ID-based authentication, specify `azureAdApp` and provide the additional `config.service.auth.azureAd` authentication settings.

## Cross-instance discovery & synchronization

| Name                           | Description              | Required | Default           | Availability |
|----|------|----------|-------------------| ----|
| neighborhood.host | DNS name used to resolve all instances of a self-hosted gateway deployment for cross-instance synchronization. In Kubernetes, it can be achieved by using a headless Service. | No | N/A | v2.0+ |
| neighborhood.heartbeat.port | UDP port used for instances of a self-hosted gateway deployment to send heartbeats to other instances. | No | 4291 | v2.0+ |
| policy.rate-limit.sync.port | UDP port used for self-hosted gateway instances to synchronize rate limiting across multiple instances. | No | 4290 | v2.0+ |

##  Metrics

| Name                           | Description              | Required | Default           | Availability |
|----|------|----------|-------------------| ----|
| telemetry.metrics.local | Enable [local metrics collection](how-to-configure-local-metrics-logs.md) through StatsD. Value is one of the following options: `none`, `statsd`. | No | `none` | v2.0+ |
| telemetry.metrics.local.statsd.endpoint | StatsD endpoint. | Yes, if `telemetry.metrics.local` is set to `statsd`; otherwise no.  | N/A | v2.0+ |
| telemetry.metrics.local.statsd.sampling | StatsD metrics sampling rate. Value must be between 0 and 1, for example, 0.5. |  No | N/A | v2.0+ |
| telemetry.metrics.local.statsd.tag-format | StatsD exporter [tagging format](https://github.com/prometheus/statsd_exporter#tagging-extensions). Value is one of the following options: `ibrato`, `dogStatsD`, `influxDB`. | No | N/A | v2.0+ |
| telemetry.metrics.cloud | Indication whether or not to [enable emitting metrics to Azure Monitor](how-to-configure-cloud-metrics-logs.md). | No |    `true` | v2.0+ |
| observability.opentelemetry.enabled | Indication whether or not to enable [emitting metrics to an OpenTelemetry collector](how-to-deploy-self-hosted-gateway-kubernetes-opentelemetry.md) on Kubernetes. | No | `false` | v2.0+ |
| observability.opentelemetry.collector.uri | URI of the OpenTelemetry collector to send metrics to. | Yes, if `observability.opentelemetry.enabled` is set to `true`; otherwise no. | N/A | v2.0+ |
| observability.opentelemetry.system-metrics.enabled | Enable sending system metrics to the OpenTelemetry collector such as CPU, memory, garbage collection, etc. | No | `false` | v2.3+ |
| observability.opentelemetry.histogram.buckets | Histogram buckets in which OpenTelemetry metrics should be reported. Format: "*x,y,z*,...". | No | "5,10,25,50,100,250,500,1000,2500,5000,10000" | v2.0+ |

## Logs

| Name   | Description | Required | Default | Availability |
| ------------- | ------------- | ------------- | ----| ----|
| telemetry.logs.std  |[Enable  logging](how-to-configure-local-metrics-logs.md#logs) to a standard stream. Value is one of the following options: `none`, `text`, `json`. | No |  `text` | v2.0+ |
| telemetry.logs.std.level  | Defines the log level of logs sent to standard stream. Value is one of the following options: `all`, `debug`, `info`, `warn`, `error` or `fatal`. | No |  `info` | v2.0+ |
| telemetry.logs.std.color  | Indication whether or not colored logs should be used in standard stream. | No |  `true` | v2.0+ |
| telemetry.logs.local  | [Enable local logging](how-to-configure-local-metrics-logs.md#logs). Value is one of the following options: `none`, `auto`, `localsyslog`, `rfc5424`, `journal`, `json`  | No  | `auto` | v2.0+ |
| telemetry.logs.local.localsyslog.endpoint  |  localsyslog endpoint.  | Yes if `telemetry.logs.local` is set to `localsyslog`; otherwise no. | N/A | v2.0+ |
| telemetry.logs.local.localsyslog.facility  | Specifies localsyslog [facility code](https://en.wikipedia.org/wiki/Syslog#Facility), for example, `7`. | No | N/A | v2.0+ |
| telemetry.logs.local.rfc5424.endpoint  |  rfc5424 endpoint.  | Yes if `telemetry.logs.local` is set to `rfc5424`; otherwise no. | N/A | v2.0+ |
| telemetry.logs.local.rfc5424.facility  | Facility code per [rfc5424](https://tools.ietf.org/html/rfc5424), for example, `7`  | No | N/A | v2.0+ |
| telemetry.logs.local.journal.endpoint  | Journal endpoint.   |Yes if `telemetry.logs.local` is set to `journal`; otherwise no. | N/A | v2.0+ |
| telemetry.logs.local.json.endpoint | UDP endpoint that accepts JSON data, specified as file path, IP:port, or hostname:port. | Yes if `telemetry.logs.local` is set to `json`; otherwise no. | 127.0.0.1:8888  | v2.0+ |

## Security

| Name  | Description | Required | Default | Availability |
| ------------- | ------------- | ------------- | ----| ----|
| certificates.local.ca.enabled | Indication whether or not the self-hosted gateway should use local CA certificates that are mounted. It's required to run the self-hosted gateway as root or with user ID 1001. | No | `false` | v2.0+ |
| net.server.tls.ciphers.allowed-suites |   Comma-separated list of ciphers to use for TLS connection between API client and the self-hosted gateway. | No | `TLS_AES_256_GCM_SHA384,TLS_CHACHA20_POLY1305_SHA256,TLS_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_DHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256,TLS_DHE_RSA_WITH_CHACHA20_POLY1305_SHA256,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_DHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384,TLS_DHE_RSA_WITH_AES_256_CBC_SHA256,TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256,TLS_DHE_RSA_WITH_AES_128_CBC_SHA256,TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,TLS_DHE_RSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA,TLS_DHE_RSA_WITH_AES_128_CBC_SHA,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256,TLS_RSA_WITH_AES_256_CBC_SHA256,TLS_RSA_WITH_AES_128_CBC_SHA256,TLS_RSA_WITH_AES_256_CBC_SHA,TLS_RSA_WITH_AES_128_CBC_SHA` | v2.0+ |
| net.client.tls.ciphers.allowed-suites | Comma-separated list of ciphers to use for TLS connection between the self-hosted gateway and the backend. | No | `TLS_AES_256_GCM_SHA384,TLS_CHACHA20_POLY1305_SHA256,TLS_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_DHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256,TLS_DHE_RSA_WITH_CHACHA20_POLY1305_SHA256,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_DHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384,TLS_DHE_RSA_WITH_AES_256_CBC_SHA256,TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256,TLS_DHE_RSA_WITH_AES_128_CBC_SHA256,TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,TLS_DHE_RSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA,TLS_DHE_RSA_WITH_AES_128_CBC_SHA,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256,TLS_RSA_WITH_AES_256_CBC_SHA256,TLS_RSA_WITH_AES_128_CBC_SHA256,TLS_RSA_WITH_AES_256_CBC_SHA,TLS_RSA_WITH_AES_128_CBC_SHA` | v2.0+ |

## Sovereign clouds

Here is an overview of settings that need to be configured to be able to work with sovereign clouds

| Name                              | Public                                         | Azure China                          | US Government  |
|-----------------------------------|------------------------------------------------|--------------------------------------|----------------|
| config.service.auth.tokenAudience | `https://azure-api.net/configuration` (Default) | `https://azure-api.cn/configuration` | `https://azure-api.us/configuration` |

## How to configure settings

### Kubernetes YAML file

When deploying the self-hosted gateway to Kubernetes using a [YAML file](how-to-deploy-self-hosted-gateway-kubernetes.md), configure settings as name-value pairs in the `data` element of the gateway's ConfigMap. For example:

```yml
apiVersion: v1
    kind: ConfigMap
    metadata:
        name: contoso-gateway-environment
    data:
        config.service.endpoint: "contoso.configuration.azure-api.net"
        telemetry.logs.std: "text"
        telemetry.logs.local.localsyslog.endpoint: "/dev/log"
        telemetry.logs.local.localsyslog.facility: "7"

[...]

```

### Helm chart

When using [Helm](how-to-deploy-self-hosted-gateway-kubernetes-helm.md) to deploy the self-hosted gateway to Kubernetes, pass [chart configuration settings](https://artifacthub.io/packages/helm/azure-api-management/azure-api-management-gateway) as parameters to the `helm install` command. For example:

```
helm install azure-api-management-gateway \
    --set gateway.configuration.uri='contoso.configuration.azure-api.net' \
    --set gateway.auth.key='GatewayKey contosogw&xxxxxxxxxxxxxx...' \
    --set secret.createSecret=false \
    --set secret.existingSecretName=`mysecret` \
    azure-apim-gateway/azure-api-management-gateway
```


## Next steps

-   Learn more about guidance for [running the self-hosted gateway on Kubernetes in production](how-to-self-hosted-gateway-on-kubernetes-in-production.md)
-   [Deploy self-hosted gateway to Docker](how-to-deploy-self-hosted-gateway-docker.md)
-   [Deploy self-hosted gateway to Kubernetes](how-to-deploy-self-hosted-gateway-kubernetes.md)
-   [Deploy self-hosted gateway to Azure Arc-enabled Kubernetes cluster](how-to-deploy-self-hosted-gateway-azure-arc.md)
- [Enable Dapr support on self-hosted gateway](self-hosted-gateway-enable-dapr.md)
- Learn more about configuration options for [Azure Arc extension](self-hosted-gateway-arc-reference.md)
