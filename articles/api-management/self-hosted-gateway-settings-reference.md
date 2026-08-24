---
title: Reference - Self-hosted gateway container settings - Azure API Management
description: Reference for the required and optional settings to configure the Azure API Management self-hosted gateway.
services: api-management

ms.service: azure-api-management
ms.topic: reference
ms.date: 08/24/2026
---

# Reference: Self-hosted gateway container configuration settings

[!INCLUDE [api-management-availability-premium-dev](../../includes/api-management-availability-premium-dev.md)]

This article provides a reference for required and optional settings that are used to configure the API Management [self-hosted gateway container](self-hosted-gateway-overview.md).

For more information, see [Guidance for running a self-hosted gateway on Kubernetes in production](how-to-self-hosted-gateway-on-kubernetes-in-production.md).

> [!IMPORTANT]
> This reference applies only to the self-hosted gateway v2. This reference notes the minimum version that supports each setting.

## Configuration API integration

The self-hosted gateway uses the Configuration API to connect to Azure API Management, get the latest configuration, and send metrics when enabled.

The following table describes the configuration options for Configuration API integration:

| Name                           | Description              | Required | Default           | Availability |
|----|------|----------|-------------------|-------------------|
| gateway.name | ID of the self-hosted gateway resource. | Yes, when using Microsoft Entra authentication | N/A | v2.3+ |
| config.service.endpoint | Configuration endpoint in Azure API Management for the self-hosted gateway. Find this value in the Azure portal under **Gateways** > **Deployment**.  | Yes       | N/A             | v2.0+ |
| config.service.auth | Defines how the self-hosted gateway authenticates to the Configuration API. Currently, the gateway supports gateway token and Microsoft Entra authentication. | Yes | N/A | v2.0+ |
| config.service.auth.azureAd.tenantId | ID of the Microsoft Entra tenant. | Yes, when using Microsoft Entra authentication | N/A | v2.3+ |
| config.service.auth.azureAd.clientId | Client ID of the Microsoft Entra app to authenticate with (also known as application ID). | Yes, when using Microsoft Entra authentication | N/A | v2.3+ |
| config.service.auth.azureAd.clientSecret | Secret of the Microsoft Entra app to authenticate with. | Yes, when using Microsoft Entra authentication (unless you specify a certificate) | N/A | v2.3+ |
| config.service.auth.azureAd.certificatePath | Path to certificate to authenticate with for the Microsoft Entra app. | Yes, when using Microsoft Entra authentication (unless you specify a secret) | N/A | v2.3+ |
| config.service.auth.azureAd.authority | Authority URL of Microsoft Entra ID. | No | `https://login.microsoftonline.com` | v2.3+ |
| config.service.auth.tokenAudience | Audience of the token for Microsoft Entra authentication. | No | `https://azure-api.net/configuration` | v2.3+ |
| config.service.endpoint.disableCertificateValidation | Defines whether the self-hosted gateway validates the server-side certificate of the Configuration API. Use certificate validation in production. Disable it only for testing, and use caution because it can introduce a security risk. | No | `false` |  v2.0+ |
| config.service.integration.timeout | Defines the timeout for interacting with the Configuration API. | No | `00:01:40` |  v2.3.5+ |

The self-hosted gateway supports several authentication options to integrate with the Configuration API. Define these options by using `config.service.auth`.

To define how to authenticate, provide the following information:

- For gateway token-based authentication, specify an access token (authentication key) of the self-hosted gateway in the Azure portal under **Gateways** > **Deployment**.
- For Microsoft Entra ID-based authentication, specify `azureAdApp` and provide the additional `config.service.auth.azureAd` authentication settings.

## Cross-instance discovery and synchronization

| Name                           | Description              | Required | Default           | Availability |
|----|------|----------|-------------------| ----|
| neighborhood.host | DNS name used to resolve all instances of a self-hosted gateway deployment for cross-instance synchronization. In Kubernetes, use a headless Service to resolve the instances. | No | N/A | v2.0+ |
| neighborhood.heartbeat.port | UDP port used for instances of a self-hosted gateway deployment to send heartbeats to other instances. | No | `4291` | v2.0+ |
| policy.rate-limit.sync.port | UDP port used for self-hosted gateway instances to synchronize rate limiting across multiple instances. | No | `4290` | v2.0+ |

## HTTP

| Name                           | Description              | Required | Default           | Availability |
|----|------|----------|-------------------| ----|
| net.server.http.forwarded.proto.enabled | Honors the `X-Forwarded-Proto` header to identify the scheme to resolve the called API route (http/https only). | No | `false` | v2.5+ |

## Kubernetes integration

### Kubernetes Ingress (preview)

> [!IMPORTANT]
> Support for Kubernetes Ingress is experimental, and Azure Support doesn't cover it. Learn more in the [Kubernetes Ingress GitHub repository](https://github.com/Azure/api-management-self-hosted-gateway-ingress).

| Name                    | Description              | Required | Default           | Availability |
|-------------------------|------------------------|----------|-------------------| ----|
| k8s.ingress.enabled     | Enable Kubernetes Ingress integration. | No | `false` | v2.0+ |
| k8s.ingress.namespace   | Kubernetes namespace to watch Kubernetes Ingress resources in. | No | `default` | v2.0+ |
| k8s.ingress.dns.suffix  | DNS suffix to build DNS hostname for services to send requests to. | No | `svc.cluster.local` | v2.4+ |
| k8s.ingress.config.path | Path to Kubernetes configuration (Kubeconfig). | No | N/A | v2.4+ |

## Metrics

| Name                           | Description              | Required | Default           | Availability |
|----|------|----------|-------------------| ----|
| telemetry.metrics.local | Enable [local metrics collection](how-to-configure-local-metrics-logs.md) through StatsD. Value is one of the following options: `none`, `statsd`. | No | `none` | v2.0+ |
| telemetry.metrics.local.statsd.endpoint | StatsD endpoint. | Yes, if `telemetry.metrics.local` is set to `statsd`; otherwise no.  | N/A | v2.0+ |
| telemetry.metrics.local.statsd.sampling | StatsD metrics sampling rate. Value must be between 0 and 1, for example, 0.5. |  No | N/A | v2.0+ |
| telemetry.metrics.local.statsd.tag-format | StatsD exporter [tagging format](https://github.com/prometheus/statsd_exporter#tagging-extensions). Value is one of the following options: `librato`, `dogStatsD`, `influxDB`. | No | N/A | v2.0+ |
| telemetry.metrics.cloud | Indication whether to [enable emitting metrics to Azure Monitor](how-to-configure-cloud-metrics-logs.md). | No |    `true` | v2.0+ |
| observability.opentelemetry.enabled | Indication whether to enable [emitting metrics to an OpenTelemetry collector](how-to-deploy-self-hosted-gateway-kubernetes-opentelemetry.md) on Kubernetes. | No | `false` | v2.0+ |
| observability.opentelemetry.collector.uri | URI of the OpenTelemetry collector to send metrics to. | Yes, if `observability.opentelemetry.enabled` is set to `true`; otherwise no. | N/A | v2.0+ |
| observability.opentelemetry.system-metrics.enabled | Enable sending system metrics, such as CPU, memory, and garbage collection, to the OpenTelemetry collector. | No | `false` | v2.3+ |
| observability.opentelemetry.histogram.buckets | Histogram buckets in which to report OpenTelemetry metrics. Format: "*x,y,z*,...". | No | "5,10,25,50,100,250,500,1000,2500,5000,10000" | v2.0+ |

## Logs

| Name   | Description | Required | Default | Availability |
| ------------- | ------------- | ------------- | ----| ----|
| telemetry.logs.std  |[Enable  logging](how-to-configure-local-metrics-logs.md#logs) to a standard stream. Value is one of the following options: `none`, `text`, `json`. | No |  `text` | v2.0+ |
| telemetry.logs.std.level  | Defines the log level of logs sent to the standard stream. Value is one of the following options: `all`, `debug`, `info`, `warn`, `error`, or `fatal`. | No |  `info` | v2.0+ |
| telemetry.logs.std.color  | Indication whether or not to use colored logs in the standard stream. | No |  `true` | v2.0+ |
| telemetry.logs.local  | [Enable local logging](how-to-configure-local-metrics-logs.md#logs). Value is one of the following options: `none`, `auto`, `localsyslog`, `rfc5424`, `journal`, `json`  | No  | `auto` | v2.0+ |
| telemetry.logs.local.localsyslog.endpoint  |  localsyslog endpoint.  | Yes if `telemetry.logs.local` is set to `localsyslog`; otherwise no. See [local syslog documentation](how-to-configure-local-metrics-logs.md#using-local-syslog-logs) for more details on configuration. | N/A | v2.0+ |
| telemetry.logs.local.localsyslog.facility  | Specifies localsyslog [facility code](https://en.wikipedia.org/wiki/Syslog#Facility), for example, `7`. | No | N/A | v2.0+ |
| telemetry.logs.local.rfc5424.endpoint  |  rfc5424 endpoint.  | Yes if `telemetry.logs.local` is set to `rfc5424`; otherwise no. | N/A | v2.0+ |
| telemetry.logs.local.rfc5424.facility  | Facility code per [rfc5424](https://tools.ietf.org/html/rfc5424), for example, `7`  | No | N/A | v2.0+ |
| telemetry.logs.local.journal.endpoint  | Journal endpoint.   |Yes if `telemetry.logs.local` is set to `journal`; otherwise no. | N/A | v2.0+ |
| telemetry.logs.local.json.endpoint | UDP endpoint that accepts JSON data, specified as file path, IP:port, or hostname:port. | Yes if `telemetry.logs.local` is set to `json`; otherwise no. | 127.0.0.1:8888  | v2.0+ |

## Security

### Certificates and ciphers

| Name  | Description | Required | Default | Availability |
| ------------- | ------------- | ------------- | ----| ----|
| certificates.local.ca.enabled | Indication whether the self-hosted gateway should use mounted local CA certificates. It's required to run the self-hosted gateway as root or with user ID 1001. | No | `false` | v2.0+ |
| net.server.tls.ciphers.allowed-suites |   Comma-separated list of ciphers to use for TLS connection between the API client and the self-hosted gateway. | No | `TLS_AES_256_GCM_SHA384,TLS_CHACHA20_POLY1305_SHA256,TLS_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_DHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256,TLS_DHE_RSA_WITH_CHACHA20_POLY1305_SHA256,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_DHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384,TLS_DHE_RSA_WITH_AES_256_CBC_SHA256,TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256,TLS_DHE_RSA_WITH_AES_128_CBC_SHA256,TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,TLS_DHE_RSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA,TLS_DHE_RSA_WITH_AES_128_CBC_SHA,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256,TLS_RSA_WITH_AES_256_CBC_SHA256,TLS_RSA_WITH_AES_128_CBC_SHA256,TLS_RSA_WITH_AES_256_CBC_SHA,TLS_RSA_WITH_AES_128_CBC_SHA` | v2.0+ |
| net.client.tls.ciphers.allowed-suites | Comma-separated list of ciphers to use for TLS connection between the self-hosted gateway and the backend. | No | `TLS_AES_256_GCM_SHA384,TLS_CHACHA20_POLY1305_SHA256,TLS_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_DHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256,TLS_DHE_RSA_WITH_CHACHA20_POLY1305_SHA256,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_DHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384,TLS_DHE_RSA_WITH_AES_256_CBC_SHA256,TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256,TLS_DHE_RSA_WITH_AES_128_CBC_SHA256,TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,TLS_DHE_RSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA,TLS_DHE_RSA_WITH_AES_128_CBC_SHA,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256,TLS_RSA_WITH_AES_256_CBC_SHA256,TLS_RSA_WITH_AES_128_CBC_SHA256,TLS_RSA_WITH_AES_256_CBC_SHA,TLS_RSA_WITH_AES_128_CBC_SHA` | v2.0+ |
| security.certificate-revocation.validation.enabled | Turns certificate revocation list validation on or off. | No | `false` | v2.3.6+ |

### TLS

| Name  | Description | Required | Default | Availability |
| ------------- | ------------- | ------------- | ----| ----|
| Microsoft.WindowsAzure.ApiManagement.Gateway.Security.Backend.Protocols.Tls13 | Indicates whether the gateway allows TLS 1.3 to the backend. Similar to [managing protocol ciphers in managed gateway](api-management-howto-manage-protocols-ciphers.md). | No | `true` | v2.0+ |
| Microsoft.WindowsAzure.ApiManagement.Gateway.Security.Backend.Protocols.Tls12 | Indicates whether the gateway allows TLS 1.2 to the backend. Similar to [managing protocol ciphers in managed gateway](api-management-howto-manage-protocols-ciphers.md). | No | `true` | v2.0+ |
| Microsoft.WindowsAzure.ApiManagement.Gateway.Security.Backend.Protocols.Tls11 | Indicates whether the gateway allows TLS 1.1 to the backend. Similar to [managing protocol ciphers in managed gateway](api-management-howto-manage-protocols-ciphers.md). | No | `false` | v2.0+ |
| Microsoft.WindowsAzure.ApiManagement.Gateway.Security.Backend.Protocols.Tls10 | Indicates whether the gateway allows TLS 1.0 to the backend. Similar to [managing protocol ciphers in managed gateway](api-management-howto-manage-protocols-ciphers.md). | No | `false` | v2.0+ |
| Microsoft.WindowsAzure.ApiManagement.Gateway.Security.Backend.Protocols.Ssl30 | Indicates whether the gateway allows SSL 3.0 to the backend. Similar to [managing protocol ciphers in managed gateway](api-management-howto-manage-protocols-ciphers.md). | No | `false` | v2.0+ |

## Sovereign clouds

The following table describes the settings you must configure to work with sovereign clouds:

| Name                              | Public                                         | Azure China                          | US Government  |
|-----------------------------------|------------------------------------------------|--------------------------------------|----------------|
| config.service.auth.tokenAudience | `https://azure-api.net/configuration` (Default) | `https://azure-api.cn/configuration` | `https://azure-api.us/configuration` |
| logs.applicationinsights.endpoint | `https://dc.services.visualstudio.com/v2/track` (Default) | `https://dc.applicationinsights.azure.cn/v2/track` | `https://dc.applicationinsights.us/v2/track` |

## How to configure settings

### Kubernetes YAML file

When deploying the self-hosted gateway to Kubernetes by using a [YAML file](how-to-deploy-self-hosted-gateway-kubernetes.md), configure settings as name-value pairs in the `data` element of the gateway's ConfigMap. For example:

```yaml
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

When you use [Helm](how-to-deploy-self-hosted-gateway-kubernetes-helm.md) to deploy the self-hosted gateway to Kubernetes, pass [chart configuration settings](https://artifacthub.io/packages/helm/azure-api-management/azure-api-management-gateway) as parameters to the `helm install` command. For example:

```bash
helm install azure-api-management-gateway \
    --set gateway.configuration.uri='contoso.configuration.azure-api.net' \
    --set gateway.auth.key='GatewayKey contosogw&xxxxxxxxxxxxxx...' \
    --set secret.createSecret=false \
    --set secret.existingSecretName='mysecret' \
    azure-apim-gateway/azure-api-management-gateway
```


## Related content

- Learn more about [running the self-hosted gateway on Kubernetes in production](how-to-self-hosted-gateway-on-kubernetes-in-production.md)
- [Deploy self-hosted gateway to Docker](how-to-deploy-self-hosted-gateway-docker.md)
- [Deploy self-hosted gateway to Kubernetes](how-to-deploy-self-hosted-gateway-kubernetes.md)
- [Deploy self-hosted gateway to Azure Arc-enabled Kubernetes cluster](how-to-deploy-self-hosted-gateway-azure-arc.md)
- [Enable Dapr support on self-hosted gateway](self-hosted-gateway-enable-dapr.md)
- Learn more about configuration options for [Azure Arc extension](self-hosted-gateway-arc-reference.md)
