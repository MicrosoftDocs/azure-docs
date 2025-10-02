---
title: Self-Hosted Gateway Overview | Azure API Management
description: Learn how the self-hosted gateway feature of Azure API Management can help you manage APIs in hybrid and multicloud environments.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: concept-article
ms.date: 09/30/2025
ms.author: danlep
#customer intent: As an API admin, I want learn about how the self-hosted gateway feature can help me manage APIs.
---

# Self-hosted gateway overview

[!INCLUDE [api-management-availability-premium-dev](../../includes/api-management-availability-premium-dev.md)]

Self-hosted gateway is an optional, containerized version of the default managed gateway that's included in every API Management instance. It's useful for scenarios like placing gateways in the same environments where you host your APIs. Use the self-hosted gateway to improve API traffic flow and address API security and compliance requirements.

This article explains how the self-hosted gateway feature of Azure API Management enables hybrid and multicloud API management. It also  presents the feature's high-level architecture and describes its capabilities.

For an overview of the differences between managed and self-hosted gateways, see [API gateway in API Management](api-management-gateways-overview.md#feature-comparison-managed-versus-self-hosted-gateways).

## Hybrid and multicloud API management

The self-hosted gateway feature expands API Management support for hybrid and multicloud environments and enables you to efficiently and securely manage APIs hosted on-premises and across clouds from a single API Management instance on Azure.

With self-hosted gateway, you have the flexibility to deploy a containerized version of the API Management gateway component to the same environments where you host your APIs. All self-hosted gateways are managed from the API Management instance they're federated with, thus providing you with the visibility and unified management experience across all internal and external APIs.

Each API Management instance is composed of the following key components:

-   A management plane, exposed as an API, used to configure the service via the Azure portal, PowerShell, and other supported technologies
-   A gateway (or data plane), that's responsible for proxying API requests, applying policies, and collecting telemetry
-   A developer portal that's used by developers to discover, learn, and onboard for using the APIs

By default, all these components are deployed on Azure, causing all API traffic (shown as solid black arrows in the following image) to flow through Azure regardless of where backends implementing the APIs are hosted. The operational simplicity of this model comes at the cost of increased latency, compliance issues, and in some cases, extra data transfer fees.

:::image type="content" source="media/self-hosted-gateway-overview/without-gateways.png" alt-text="API traffic flow without self-hosted gateways" lightbox="media/self-hosted-gateway-overview/without-gateways.png":::

Deploying self-hosted gateways into the same environments where the backend API implementations are hosted allows API traffic to flow directly to the backend APIs, which reduces latency, optimizes data transfer costs, and enables compliance while retaining the benefits of having a single point of management, observability, and discovery for all APIs in the organization, regardless of where their implementations are hosted.

:::image type="content" source="media/self-hosted-gateway-overview/with-gateways.png" alt-text="API traffic flow with self-hosted gateways" lightbox="media/self-hosted-gateway-overview/with-gateways.png":::

## Packaging

The self-hosted gateway is available as a Linux-based Docker [container image](https://aka.ms/apim/shgw/registry-portal) from the Microsoft Artifact Registry. It can be deployed to Docker, Kubernetes, or any other container orchestration solution running on a server cluster on premises, cloud infrastructure, or, for evaluation and development purposes, on a personal computer. You can also deploy the self-hosted gateway as a cluster extension to an [Azure Arc-enabled Kubernetes cluster](./how-to-deploy-self-hosted-gateway-azure-arc.md).

### Container images

A variety of container images for self-hosted gateways are available:

| Tag convention | Recommendation | Example  | Rolling tag  | Recommended for production |
| ------------- | -------- | ------- | ------- | ------- |
| `{major}.{minor}.{patch}` | Use this tag to always run the same version of the gateway. |`2.0.0` | ❌ |  ✔️ |
| `v{major}` | Use this tag to always run a major version of the gateway with every new feature and patch. |`v2` | ✔️ |  ❌ |
| `v{major}-preview` | Use this tag if you always want to run the latest preview container image. | `v2-preview` | ✔️ |  ❌ |
| `latest` | Use this tag if you want to evaluate the self-hosted gateway. | `latest` | ✔️ |  ❌ |
| `beta`<sup>1</sup> | Use this tag if you want to evaluate preview versions of the self-hosted gateway. | `beta` | ✔️ |  ❌ |

You can [find a full list of available tags here](https://mcr.microsoft.com/product/azure-api-management/gateway/tags).

<sup>1</sup>Preview versions aren't officially supported and are for experimental purposes only. See the [self-hosted gateway support policies](self-hosted-gateway-support-policies.md#self-hosted-gateway-container-image-support-coverage). <br/> 

### Use of tags in official deployment options

Deployment options in the Azure portal use the `v2` tag that allows you to use the most recent version of the self-hosted gateway v2 container image with all feature updates and patches.

> [!NOTE]
> The command and YAML snippets are provided as a reference. You can use a more specific tag if you want to.

When you install a gateway with a Helm chart, image tagging is optimized. The Helm chart's application version pins the gateway to a given version and doesn't rely on `latest`.

For more information, see [Install an API Management self-hosted gateway on Kubernetes with Helm](how-to-deploy-self-hosted-gateway-kubernetes-helm.md).

### Risk of using rolling tags

Rolling tags are tags that are potentially updated when a new version of the container image is released. Using this type of tags enables container users to receive updates to the container image without having to update their deployments.

When you use this type of tag, you can potentially run different versions in parallel without noticing it, for example when you perform scaling actions after the `v2` tag is updated.

Example: The `v2` tag is released with the `2.0.0` container image. When `2.1.0` is released, the `v2` tag will be linked to the `2.1.0` image.

> [!IMPORTANT]
> Consider using a specific version tag in production to avoid unintentional upgrades to a newer version.

## Connectivity to Azure

Self-hosted gateways require outbound TCP/IP connectivity to Azure on port 443. Each self-hosted gateway must be associated with a single API Management instance and is configured via its management plane. A self-hosted gateway uses connectivity to Azure for:

-   Reporting its status by sending heartbeat messages every minute.
-   Regularly (every 10 seconds) checking for and applying configuration updates whenever they're available.
-   Sending metrics to Azure Monitor, if configured to do so.
-   Sending events to Application Insights, if configured to do so.

### FQDN dependencies

To operate properly, each self-hosted gateway needs outbound connectivity on port 443 to the following endpoints associated with its cloud-based API Management instance:


| Endpoint | Required? | Notes |
|:------------|:---------------------|:------|
| Hostname of the configuration endpoint | `<api-management-service-name>.configuration.azure-api.net`<sup>1</sup> | Custom hostnames are also supported and can be used instead of the default hostname. |
| Public IP address of the API Management instance | ✔️ | The IP address of the primary location is sufficient. |
| Public IP addresses of the Azure Storage [service tag](../virtual-network/service-tags-overview.md) | Optional<sup>2</sup> | IP addresses must correspond to the primary location of the API Management instance. |
| Hostname of the Azure Blob Storage account | Optional<sup>2</sup> | The account associated with the instance (`<blob-storage-account-name>.blob.core.windows.net`). |
| Hostname of the Azure Table Storage account | Optional<sup>2</sup> | The account associated with the instance (`<table-storage-account-name>.table.core.windows.net`). |
| Endpoints for Azure Resource Manager | Optional<sup>3</sup> | The required endpoint is `management.azure.com`. |
| Endpoints for Microsoft Entra integration | Optional<sup>4</sup> | Required endpoints are `<region>.login.microsoft.com` and `login.microsoftonline.com`. |
| Endpoints for [Azure Application Insights integration](api-management-howto-app-insights.md) | Optional<sup>5</sup> | Minimal required endpoints are `rt.services.visualstudio.com:443`, `dc.services.visualstudio.com:443`, and `{region}.livediagnostics.monitor.azure.com:443`. For more information, see the [Azure Monitor documentation](/azure/azure-monitor/ip-addresses#outgoing-ports). |
| Endpoints for [Event Hubs integration](api-management-howto-log-event-hubs.md) | Optional<sup>5</sup> | For more information, see the [Azure Event Hubs documentation](../event-hubs/network-security.md). |
| Endpoints for [external cache integration](api-management-howto-cache-external.md) | Optional<sup>5</sup> | This requirement depends on the external cache that's being used. |


<sup>1</sup>For information about an API Management instance in an internal virtual network, see [Connectivity in an internal virtual network](#connectivity-in-an-internal-virtual-network).<br/>
<sup>2</sup>Only required in v2 when API inspector or quotas are used in policies.<br/>
<sup>3</sup>Only required when using Microsoft Entra authentication to verify RBAC permissions.<br/>
<sup>4</sup>Only required when you use Microsoft Entra authentication or policies related to Microsoft Entra.<br/>
<sup>5</sup>Only required when the feature is used and requires public IP address, port, and hostname information.<br/>

> [!IMPORTANT]
> * DNS hostnames must be resolvable to IP addresses, and the corresponding IP addresses must be reachable.
> * The associated storage account names are listed on the service's **Network connectivity status** page in the Azure portal.
> * Public IP addresses underlying the associated storage accounts are dynamic and can change without notice.

### Connectivity in an internal virtual network

 * **Private connectivity**. If the self-hosted gateway is deployed in a virtual network, enable private connectivity to the v2 configuration endpoint from the location of the self-hosted gateway, for example, using a private DNS in a peered network. 

* **Internet connectivity**. If the self-hosted gateway needs to connect to the v2 configuration endpoint over the internet, configure a custom hostname for the configuration endpoint and expose the endpoint by using Azure Application Gateway.

### Authentication options

The gateway container's [configuration settings](self-hosted-gateway-settings-reference.md) provide the following options for authenticating the connection between the self-hosted gateway and the cloud-based API Management instance's configuration endpoint.

|Option  |Considerations  |
|---------|---------|
| [Microsoft Entra authentication](self-hosted-gateway-enable-azure-ad.md)   | Configure one or more Microsoft Entra apps for access to the gateway.<br/><br/>Manage access separately per app.<br/><br/>Configure longer expiration times for secrets in accordance with your organization's policies.<br/><br/>Use standard Microsoft Entra procedures to assign or revoke user or group permissions to apps and to rotate secrets.<br/><br/>        |
| Gateway access token. (Also called an authentication key.)    |  Token expires at least every 30 days and must be renewed in the containers.<br/><br/>Backed by a gateway key that can be rotated independently (for example, to revoke access). <br/><br/>Regenerating the gateway key invalidates all access tokens that are created with it.        |

> [!TIP]
> See [Azure API Management as an Event Grid source](/azure/event-grid/event-schema-api-management) for information about Event Grid events that are generated by a self-hosted gateway when a gateway access token is near expiration or has expired. Use these events to ensure that deployed gateways are always able to authenticate with their associated API Management instance. 

### Connectivity failures

When connectivity to Azure is lost, the self-hosted gateway is unable to receive configuration updates, report its status, or upload telemetry.

The self-hosted gateway is designed to "fail static" and can survive temporary loss of connectivity to Azure. It can be deployed with or without local configuration backup. With configuration backup, self-hosted gateways regularly save a backup copy of the latest downloaded configuration on a persistent volume attached to their container or pod.

When configuration backup is turned off and connectivity to Azure is interrupted:

-   Running self-hosted gateways continue to function by using an in-memory copy of the configuration.
-   Stopped self-hosted gateways won't be able to start.

When configuration backup is turned on and connectivity to Azure is interrupted:

-   Running self-hosted gateways continue to function by using an in-memory copy of the configuration.
-   Stopped self-hosted gateways can start by using a backup copy of the configuration.

When connectivity is restored, each self-hosted gateway affected by the outage automatically reconnects with its associated API Management instance and downloads all configuration updates that occurred while the gateway was offline.

## Security

### Limitations

The following functionality that's available in managed gateways *isn't* available in self-hosted gateways:

- TLS session resumption.
- Client certificate renegotiation. To use [client certificate authentication](api-management-howto-mutual-certificates-for-clients.md), API consumers must present their certificates as part of the initial TLS handshake. To ensure this behavior, enable the Negotiate Client Certificate setting when configuring a self-hosted gateway custom hostname (domain name).

### Transport Layer Security (TLS)

#### Supported protocols

Self-hosted gateways support TLS v1.2 by default.

If you use custom domains, you can enable TLS v1.0 and/or v1.1 [in the control plane](/rest/api/apimanagement/current-ga/gateway-hostname-configuration/create-or-update).

#### Available cipher suites

Self-hosted gateways use the following cipher suites for both client and server connections:

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

With v2.1.1 and later, you can manage the ciphers that are being used via configuration:

- `net.server.tls.ciphers.allowed-suites` enables you to define a comma-separated list of ciphers to use for the TLS connection between the API client and the self-hosted gateway.
- `net.client.tls.ciphers.allowed-suites` enables you to define a comma-separated list of ciphers to use for the TLS connection between the self-hosted gateway and the backend.

## Related content

-   [API gateway overview](api-management-gateways-overview.md)
-   [Support policy for self-hosted gateway](self-hosted-gateway-support-policies.md)
-   [API Management in a hybrid and multicloud world](https://aka.ms/hybrid-and-multi-cloud-api-management)
-   [Guidance for running self-hosted gateway on Kubernetes in production](how-to-self-hosted-gateway-on-kubernetes-in-production.md)
-   [Deploy a self-hosted gateway to Docker](how-to-deploy-self-hosted-gateway-docker.md)
-   [Deploy a self-hosted gateway to Kubernetes](how-to-deploy-self-hosted-gateway-kubernetes.md)
-   [Deploy a self-hosted gateway to an Azure Arc-enabled Kubernetes cluster](how-to-deploy-self-hosted-gateway-azure-arc.md)
-   [Deploy a self-hosted gateway to Azure Container Apps](how-to-deploy-self-hosted-gateway-container-apps.md)
-   [Self-hosted gateway configuration settings](self-hosted-gateway-settings-reference.md)
-   [Observability capabilities in API Management](observability.md) 
-   [Dapr integration with self-hosted gateway](https://github.com/dapr/samples/tree/master/dapr-apim-integration)
