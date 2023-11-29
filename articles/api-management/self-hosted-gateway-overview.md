---
title: Self-hosted gateway overview | Azure API Management
description: Learn how self-hosted gateway feature of Azure API Management helps organizations manage APIs in hybrid and multicloud environments.
services: api-management
documentationcenter: ''
author: dlepow

ms.service: api-management
ms.topic: conceptual
ms.date: 06/14/2023
ms.author: danlep
---

# Self-hosted gateway overview

The self-hosted gateway is an optional, containerized version of the default managed gateway included in every API Management service. It's useful for scenarios such as placing gateways in the same environments where you host your APIs. Use the self-hosted gateway to improve API traffic flow and address API security and compliance requirements.

This article explains how the self-hosted gateway feature of Azure API Management enables hybrid and multicloud API management, presents its high-level architecture, and highlights its capabilities.

For an overview of the features across the various gateway offerings, see [API gateway in API Management](api-management-gateways-overview.md#feature-comparison-managed-versus-self-hosted-gateways).

[!INCLUDE [api-management-availability-premium-dev](../../includes/api-management-availability-premium-dev.md)]

## Hybrid and multicloud API management

The self-hosted gateway feature expands API Management support for hybrid and multicloud environments and enables organizations to efficiently and securely manage APIs hosted on-premises and across clouds from a single API Management service in Azure.

With the self-hosted gateway, customers have the flexibility to deploy a containerized version of the API Management gateway component to the same environments where they host their APIs. All self-hosted gateways are managed from the API Management service they're federated with, thus providing customers with the visibility and unified management experience across all internal and external APIs.

Each API Management service is composed of the following key components:

-   Management plane, exposed as an API, used to configure the service via the Azure portal, PowerShell, and other supported mechanisms.
-   Gateway (or data plane), which is responsible for proxying API requests, applying policies, and collecting telemetry
-   Developer portal used by developers to discover, learn, and onboard to use the APIs

By default, all these components are deployed in Azure, causing all API traffic (shown as solid black arrows on the following picture) to flow through Azure regardless of where backends implementing the APIs are hosted. The operational simplicity of this model comes at the cost of increased latency, compliance issues, and in some cases, extra data transfer fees.

:::image type="content" source="media/self-hosted-gateway-overview/without-gateways.png" alt-text="API traffic flow without self-hosted gateways":::

Deploying self-hosted gateways into the same environments where the backend API implementations are hosted allows API traffic to flow directly to the backend APIs, which reduces latency, optimizes data transfer costs, and enables compliance while retaining the benefits of having a single point of management, observability, and discovery of all APIs within the organization regardless of where their implementations are hosted.

:::image type="content" source="media/self-hosted-gateway-overview/with-gateways.png" alt-text="API traffic flow with self-hosted gateways":::

## Packaging

The self-hosted gateway is available as a Linux-based Docker [container image](https://aka.ms/apim/shgw/registry-portal) from the Microsoft Artifact Registry. It can be deployed to Docker, Kubernetes, or any other container orchestration solution running on a server cluster on premises, cloud infrastructure, or for evaluation and development purposes, on a personal computer. You can also deploy the self-hosted gateway as a cluster extension to an [Azure Arc-enabled Kubernetes cluster](./how-to-deploy-self-hosted-gateway-azure-arc.md).

### Container images

We provide a variety of container images for self-hosted gateways to meet your needs:

| Tag convention | Recommendation | Example  | Rolling tag  | Recommended for production |
| ------------- | -------- | ------- | ------- | ------- |
| `{major}.{minor}.{patch}` | Use this tag to always run the same version of the gateway |`2.0.0` | ❌ |  ✔️ |
| `v{major}` | Use this tag to always run a major version of the gateway with every new feature and patch. |`v2` | ✔️ |  ❌ |
| `v{major}-preview` | Use this tag if you always want to run our latest preview container image. | `v2-preview` | ✔️ |  ❌ |
| `latest` | Use this tag if you want to evaluate the self-hosted gateway. | `latest` | ✔️ |  ❌ |
| `beta`<sup>1</sup> | Use this tag if you want to evaluate preview versions of the self-hosted gateway. | `beta` | ✔️ |  ❌ |

You can find a full list of available tags [here](https://mcr.microsoft.com/product/azure-api-management/gateway/tags).

<sup>1</sup>Preview versions aren't officially supported and are for experimental purposes only. See the [self-hosted gateway support policies](self-hosted-gateway-support-policies.md#self-hosted-gateway-container-image-support-coverage). <br/> 

### Use of tags in our official deployment options

Our deployment options in the Azure portal use the `v2` tag that allows customers to use the most recent version of the self-hosted gateway v2 container image with all feature updates and patches.

> [!NOTE]
> We provide the command and YAML snippets as reference, feel free to use a more specific tag if you wish to.

When installing with our Helm chart, image tagging is optimized for you. The Helm chart's application version pins the gateway to a given version and doesn't rely on `latest`.

Learn more on how to [install an API Management self-hosted gateway on Kubernetes with Helm](how-to-deploy-self-hosted-gateway-kubernetes-helm.md).

### Risk of using rolling tags

Rolling tags are tags that are potentially updated when a new version of the container image is released. This allows container users to receive updates to the container image without having to update their deployments.

This means that you can potentially run different versions in parallel without noticing it, for example when you perform scaling actions once `v2` tag was updated.

Example - `v2` tag was released with `2.0.0` container image, but when `2.1.0` will be released, the `v2` tag will be linked to the `2.1.0` image.

> [!IMPORTANT]
> Consider using a specific version tag in production to avoid unintentional upgrade to a newer version.

## Connectivity to Azure

Self-hosted gateways require outbound TCP/IP connectivity to Azure on port 443. Each self-hosted gateway must be associated with a single API Management service and is configured via its management plane. A self-hosted gateway uses connectivity to Azure for:

-   Reporting its status by sending heartbeat messages every minute
-   Regularly checking for (every 10 seconds) and applying configuration updates whenever they're available
-   Sending metrics to Azure Monitor, if configured to do so
-   Sending events to Application Insights, if set to do so

[!INCLUDE [preview](./includes/preview/preview-callout-self-hosted-gateway-deprecation.md)]

### FQDN dependencies

To operate properly, each self-hosted gateway needs outbound connectivity on port 443 to the following endpoints associated with its cloud-based API Management instance:

| Description | Required for v1 | Required for v2 | Notes |
|:------------|:---------------------|:---------------------|:------|
| Hostname of the configuration endpoint | `<apim-service-name>.management.azure-api.net` | `<apim-service-name>.configuration.azure-api.net` | Custom hostnames are also supported and can be used instead of the default hostname. |
| Public IP address of the API Management instance | ✔️ | ✔️ | IP address of primary location is sufficient. |
| Public IP addresses of Azure Storage [service tag](../virtual-network/service-tags-overview.md) | ✔️ | Optional<sup>2</sup> | IP addresses must correspond to primary location of API Management instance. |
| Hostname of Azure Blob Storage account | ✔️ | Optional<sup>2</sup> | Account associated with instance (`<blob-storage-account-name>.blob.core.windows.net`) |
| Hostname of Azure Table Storage account | ✔️ | Optional<sup>2</sup> | Account associated with instance (`<table-storage-account-name>.table.core.windows.net`) |
| Endpoints for Azure Resource Manager | ✔️ | Optional<sup>3</sup> | Required endpoints are `management.azure.com`. |
| Endpoints for Microsoft Entra integration | ✔️ | Optional<sup>4</sup> | Required endpoints are `<region>.login.microsoft.com` and `login.microsoftonline.com`. |
| Endpoints for [Azure Application Insights integration](api-management-howto-app-insights.md) | Optional<sup>5</sup> | Optional<sup>5</sup> | Minimal required endpoints are:<ul><li>`rt.services.visualstudio.com:443`</li><li>`dc.services.visualstudio.com:443`</li><li>`{region}.livediagnostics.monitor.azure.com:443`</li></ul>Learn more in [Azure Monitor docs](../azure-monitor/app/ip-addresses.md#outgoing-ports) |
| Endpoints for [Event Hubs integration](api-management-howto-log-event-hubs.md) | Optional<sup>5</sup> | Optional<sup>5</sup> | Learn more in [Azure Event Hubs docs](../event-hubs/network-security.md) |
| Endpoints for [external cache integration](api-management-howto-cache-external.md) | Optional<sup>5</sup> | Optional<sup>5</sup> | This requirement depends on the external cache that is being used |

<sup>1</sup>For an API Management instance in an internal virtual network, enable private connectivity to the v2 configuration endpoint from the location of the self-hosted gateway, for example, using a private DNS in a peered network.<br/> 
<sup>2</sup>Only required in v2 when API inspector or quotas are used in policies.<br/>
<sup>3</sup>Only required when using Microsoft Entra authentication to verify RBAC permissions.<br/>
<sup>4</sup>Only required when using Microsoft Entra authentication or Microsoft Entra related policies.<br/>
<sup>5</sup>Only required when feature is used and requires public IP address, port, and hostname information.<br/>

> [!IMPORTANT]
> * DNS hostnames must be resolvable to IP addresses and the corresponding IP addresses must be reachable.
> * The associated storage account names are listed in the service's **Network connectivity status** page in the Azure portal.
> * Public IP addresses underlying the associated storage accounts are dynamic and can change without notice.

### Authentication options

To authenticate the connection between the self-hosted gateway and the cloud-based API Management instance's configuration endpoint, you have the following options in the gateway container's [configuration settings](self-hosted-gateway-settings-reference.md).

|Option  |Considerations  |
|---------|---------|
| [Microsoft Entra authentication](self-hosted-gateway-enable-azure-ad.md)   | Configure one or more Microsoft Entra apps for access to gateway<br/><br/>Manage access separately per app<br/><br/>Configure longer expiry times for secrets in accordance with your organization's policies<br/><br/>Use standard Microsoft Entra procedures to assign or revoke user or group permissions to app and to rotate secrets<br/><br/>        |
| Gateway access token (also called authentication key)    |  Token expires every 30 days at maximum and must be renewed in the containers<br/><br/>Backed by a gateway key that can be rotated independently (for example, to revoke access) <br/><br/>Regenerating gateway key invalidates all access tokens created with it        |

### Connectivity failures

When connectivity to Azure is lost, the self-hosted gateway is unable to receive configuration updates, report its status, or upload telemetry.

The self-hosted gateway is designed to "fail static" and can survive temporary loss of connectivity to Azure. It can be deployed with or without local configuration backup. With configuration backup, self-hosted gateways regularly save a backup copy of the latest downloaded configuration on a persistent volume attached to their container or pod.

When configuration backup is turned off and connectivity to Azure is interrupted:

-   Running self-hosted gateways will continue to function using an in-memory copy of the configuration
-   Stopped self-hosted gateways won't be able to start

When configuration backup is turned on and connectivity to Azure is interrupted:

-   Running self-hosted gateways will continue to function using an in-memory copy of the configuration
-   Stopped self-hosted gateways will be able to start using a backup copy of the configuration

When connectivity is restored, each self-hosted gateway affected by the outage will automatically reconnect with its associated API Management service and download all configuration updates that occurred while the gateway was "offline".

## Security

### Limitations

The following functionality found in the managed gateways is **not available** in the self-hosted gateways:

- TLS session resumption.
- Client certificate renegotiation. To use [client certificate authentication](api-management-howto-mutual-certificates-for-clients.md), API consumers must present their certificates as part of the initial TLS handshake. To ensure this behavior, enable the Negotiate Client Certificate setting when configuring a self-hosted gateway custom hostname (domain name).

### Transport Layer Security (TLS)

> [!IMPORTANT]
> This overview is only applicable to the self-hosted gateway v1 & v2.

#### Supported protocols

The self-hosted gateway provides support for TLS v1.2 by default.

Customers using custom domains can enable TLS v1.0 and/or v1.1 [in the control plane](/rest/api/apimanagement/current-ga/gateway-hostname-configuration/create-or-update).

#### Available cipher suites

> [!IMPORTANT]
> This overview is only applicable to the self-hosted gateway v2.

The self-hosted gateway uses the following cipher suites for both client and server connections:

- `TLS_AES_256_GCM_SHA384`
- `TLS_CHACHA20_POLY1305_SHA256`
- `TLS_AES_128_GCM_SHA256`
- `TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384`
- `TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384`
- `TLS_DHE_RSA_WITH_AES_256_GCM_SHA384`
- `TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256`
- `TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256`
- `TLS_DHE_RSA_WITH_CHACHA20_POLY1305_SHA256`
- `TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256`
- `TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256`
- `TLS_DHE_RSA_WITH_AES_128_GCM_SHA256`
- `TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384`
- `TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384`
- `TLS_DHE_RSA_WITH_AES_256_CBC_SHA256`
- `TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256`
- `TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256`
- `TLS_DHE_RSA_WITH_AES_128_CBC_SHA256`
- `TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA`
- `TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA`
- `TLS_DHE_RSA_WITH_AES_256_CBC_SHA`
- `TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA`
- `TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA`
- `TLS_DHE_RSA_WITH_AES_128_CBC_SHA`
- `TLS_RSA_WITH_AES_256_GCM_SHA384`
- `TLS_RSA_WITH_AES_128_GCM_SHA256`
- `TLS_RSA_WITH_AES_256_CBC_SHA256`
- `TLS_RSA_WITH_AES_128_CBC_SHA256`
- `TLS_RSA_WITH_AES_256_CBC_SHA`
- `TLS_RSA_WITH_AES_128_CBC_SHA`

#### Managing cipher suites

As of v2.1.1 and above, you can manage the ciphers that are being used through the configuration:

- `net.server.tls.ciphers.allowed-suites` allows you to define a comma-separated list of ciphers to use for the TLS connection between the API client and the self-hosted gateway.
- `net.client.tls.ciphers.allowed-suites` allows you to define a comma-separated list of ciphers to use for the TLS connection between the self-hosted gateway and the backend.

## Next steps

-   Learn more about the various gateways in our [API gateway overview](api-management-gateways-overview.md)
-   Learn more about the support policy for the [self-hosted gateway](self-hosted-gateway-support-policies.md)
-   Learn more about [API Management in a hybrid and multicloud world](https://aka.ms/hybrid-and-multi-cloud-api-management)
-   Learn more about guidance for [running the self-hosted gateway on Kubernetes in production](how-to-self-hosted-gateway-on-kubernetes-in-production.md)
-   [Deploy self-hosted gateway to Docker](how-to-deploy-self-hosted-gateway-docker.md)
-   [Deploy self-hosted gateway to Kubernetes](how-to-deploy-self-hosted-gateway-kubernetes.md)
-   [Deploy self-hosted gateway to Azure Arc-enabled Kubernetes cluster](how-to-deploy-self-hosted-gateway-azure-arc.md)
-   [Self-hosted gateway configuration settings](self-hosted-gateway-settings-reference.md)
-   Learn about [observability capabilities](observability.md) in API Management
-   Learn about [Dapr integration with the self-hosted gateway](https://github.com/dapr/samples/tree/master/dapr-apim-integration)
