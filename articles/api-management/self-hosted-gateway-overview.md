---
title: Self-hosted gateway overview | Azure API Management
description: Learn how self-hosted gateway feature of Azure API Management helps organizations manage APIs in hybrid and multicloud environments.
services: api-management
documentationcenter: ''
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 01/19/2022
ms.author: danlep
---

# Self-hosted gateway overview

This article explains how the self-hosted gateway feature of Azure API Management enables hybrid and multi-cloud API management, presents its high-level architecture, and highlights its capabilities.

## Hybrid and multi-cloud API management

The self-hosted gateway feature expands API Management support for hybrid and multi-cloud environments and enables organizations to efficiently and securely manage APIs hosted on-premises and across clouds from a single API Management service in Azure.

With the self-hosted gateway, customers have the flexibility to deploy a containerized version of the API Management gateway component to the same environments where they host their APIs. All self-hosted gateways are managed from the API Management service they are federated with, thus providing customers with the visibility and unified management experience across all internal and external APIs. Placing the gateways close to the APIs allows customers to optimize API traffic flows and address security and compliance requirements.

Each API Management service is composed of the following key components:

-   Management plane, exposed as an API, used to configure the service via the Azure portal, PowerShell, and other supported mechanisms.
-   Gateway (or data plane), which is responsible for proxying API requests, applying policies, and collecting telemetry
-   Developer portal used by developers to discover, learn, and onboard to use the APIs

By default, all these components are deployed in Azure, causing all API traffic (shown as solid black arrows on the following picture) to flow through Azure regardless of where backends implementing the APIs are hosted. The operational simplicity of this model comes at the cost of increased latency, compliance issues, and in some cases, extra data transfer fees.

:::image type="content" source="media/self-hosted-gateway-overview/without-gateways.png" alt-text="API traffic flow without self-hosted gateways":::

Deploying self-hosted gateways into the same environments where the backend API implementations are hosted allows API traffic to flow directly to the backend APIs, which reduces latency, optimizes data transfer costs, and enables compliance while retaining the benefits of having a single point of management, observability, and discovery of all APIs within the organization regardless of where their implementations are hosted.

:::image type="content" source="media/self-hosted-gateway-overview/with-gateways.png" alt-text="API traffic flow with self-hosted gateways":::

## Packaging and features

The self-hosted gateway is a containerized, functionally equivalent version of the managed gateway deployed to Azure as part of every API Management service. The self-hosted gateway is available as a Linux-based Docker [container image](https://aka.ms/apim/sputnik/dhub) from the Microsoft Container Registry. It can be deployed to Docker, Kubernetes, or any other container orchestration solution running on a server cluster on premises, cloud infrastructure, or for evaluation and development purposes, on a personal computer. You can also deploy the self-hosted gateway as a cluster extension to an [Azure Arc-enabled Kubernetes cluster](./how-to-deploy-self-hosted-gateway-azure-arc.md).

The following functionality found in the managed gateways is **not available** in the self-hosted gateways:

- Azure Monitor logs
- Upstream (backend side) TLS version and cipher management
- Validation of server and client certificates using [CA root certificates](api-management-howto-ca-certificates.md) uploaded to API Management service. You can configure [custom certificate authorities](api-management-howto-ca-certificates.md#create-custom-ca-for-self-hosted-gateway) for your self-hosted gateways and [client certificate validation](api-management-access-restriction-policies.md#validate-client-certificate) policies to enforce them.
- Integration with [Service Fabric](../service-fabric/service-fabric-api-management-overview.md)
- TLS session resumption
- Client certificate renegotiation. This means that for [client certificate authentication](api-management-howto-mutual-certificates-for-clients.md) to work, API consumers must present their certificates as part of the initial TLS handshake. To ensure this behavior, enable the Negotiate Client Certificate setting when configuring a self-hosted gateway custom hostname.
- Built-in cache. Learn about using an [external Redis-compatible cache](api-management-howto-cache-external.md) in self-hosted gateways.

## Connectivity to Azure

Self-hosted gateways require outbound TCP/IP connectivity to Azure on port 443. Each self-hosted gateway must be associated with a single API Management service and is configured via its management plane. A self-hosted gateway uses connectivity to Azure for:

-   Reporting its status by sending heartbeat messages every minute
-   Regularly checking for (every 10 seconds) and applying configuration updates whenever they are available
-   Sending request logs and metrics to Azure Monitor, if configured to do so
-   Sending events to Application Insights, if set to do so

### FQDN dependencies

To operate properly, each self-hosted gateway needs outbound connectivity on port 443 to the following endpoints associated with its cloud-based API Management instance:

* The public IP address of the API Management instance in its primary location
* The hostname of the instance's management endpoint: `<apim-service-name>.management.azure-api.net`
* The hostname of the instance's associated blob storage account: `<blob-storage-account-name>.blob.core.windows.net`
* The hostname of the instance's associated table storage account: `<table-storage-account-name>.table.core.windows.net`
* Public IP addresses from the Storage [service tag](../virtual-network/service-tags-overview.md) corresponding to the primary location of the API Management instance

> [!IMPORTANT]
> * DNS hostnames must be resolvable to IP addresses and the corresponding IP addresses must be reachable.
> * The associated storage account names are listed in the service's **Network connectivity status** page in the Azure portal.
> * Public IP addresses underlying the associated storage accounts are dynamic and can change without notice.

If integrated with your API Management instance, also enable outbound connectivity to the associated public IP addresses, ports, and hostnames for:

* [Event Hubs](api-management-howto-log-event-hubs.md) 
* [Application Insights](api-management-howto-app-insights.md)  
* [External cache](api-management-howto-cache-external.md) 

### Connectivity failures

When connectivity to Azure is lost, the self-hosted gateway is unable to receive configuration updates, report its status, or upload telemetry.

The self-hosted gateway is designed to "fail static" and can survive temporary loss of connectivity to Azure. It can be deployed with or without local configuration backup. With configuration backup, self-hosted gateways regularly save a backup copy of the latest downloaded configuration on a persistent volume attached to their container or pod.

When configuration backup is turned off and connectivity to Azure is interrupted:

-   Running self-hosted gateways will continue to function using an in-memory copy of the configuration
-   Stopped self-hosted gateways will not be able to start

When configuration backup is turned on and connectivity to Azure is interrupted:

-   Running self-hosted gateways will continue to function using an in-memory copy of the configuration
-   Stopped self-hosted gateways will be able to start using a backup copy of the configuration

When connectivity is restored, each self-hosted gateway affected by the outage will automatically reconnect with its associated API Management service and download all configuration updates that occurred while the gateway was "offline".

## Next steps

-   Learn more about [API Management in a Hybrid and MultiCloud World](https://aka.ms/hybrid-and-multi-cloud-api-management)
-   [Deploy self-hosted gateway to Docker](how-to-deploy-self-hosted-gateway-docker.md)
-   [Deploy self-hosted gateway to Kubernetes](how-to-deploy-self-hosted-gateway-kubernetes.md)
-   [Deploy self-hosted gateway to Azure Arc-enabled Kubernetes cluster](how-to-deploy-self-hosted-gateway-azure-arc.md)
