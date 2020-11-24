---
title: Self-hosted gateway overview | Microsoft Docs
description: Learn how self-hosted gateway feature of Azure API Management helps organizations manage APIs in hybrid and multicloud environments.
services: api-management
documentationcenter: ''
author: vlvinogr
manager: gwallace
editor: ''

ms.service: api-management
ms.topic: article
ms.date: 04/26/2020
ms.author: apimpm
---

# Self-hosted gateway overview

This article explains how self-hosted gateway feature of Azure API Management enables hybrid and multi-cloud API management, presents its high-level architecture, and highlights its capabilities.

## Hybrid and multi-cloud API management

The self-hosted gateway feature expands API Management support for hybrid and multi-cloud environments and enables organizations to efficiently and securely manage APIs hosted on-premises and across clouds from a single API Management service in Azure.

With the self-hosted gateway, customers have the flexibility to deploy a containerized version of the API Management gateway component to the same environments where they host their APIs. All self-hosted gateways are managed from the API Management service they are federated with, thus providing customers with the visibility and unified management experience across all internal and external APIs. Placing the gateways close to the APIs allow customers to optimize API traffic flows and address security and compliance requirements.

Each API Management service is composed of the following key components:

-   Management plane, exposed as an API, used to configure the service via the Azure portal, PowerShell, and other supported mechanisms.
-   Gateway (or data plane) is responsible for proxying API requests, applying policies, and collecting telemetry
-   Developer portal used by developers to discover, learn, and onboard to use the APIs

By default, all these components are deployed in Azure, causing all API traffic (shown as solid black arrows on the picture below) to flow through Azure regardless of where backends implementing the APIs are hosted. The operational simplicity of this model comes at the cost of increased latency, compliance issues, and in some cases, additional data transfer fees.

![API traffic flow without self-hosted gateways](media/self-hosted-gateway-overview/without-gateways.png)

Deploying self-hosted gateways into the same environments where the backend API implementations are hosted allows API traffic to flow directly to the backend APIs, which improves latency, optimizes data transfer costs, and enables compliance while retaining the benefits of having a single point of management, observability, and discovery of all APIs within the organization regardless of where their implementations are hosted.

![API traffic flow with self-hosted gateways](media/self-hosted-gateway-overview/with-gateways.png)

## Packaging and features

The self-hosted gateway is a containerized, functionally-equivalent version of the managed gateway deployed to Azure as part of every API Management service. The self-hosted gateway is available as a Linux-based Docker [container](https://aka.ms/apim/sputnik/dhub) from the Microsoft Container Registry. It can be deployed to Docker, Kubernetes, or any other container orchestration solution running on a server cluster on premises, cloud infrastructure, or for evaluation and development purposes, on a personal computer.

The following functionality found in the managed gateways is **not available** in the self-hosted gateways:

- Azure Monitor logs
- Upstream (backend side) TLS version and cipher management
- Validation of server and client certificates using [CA root certificates](api-management-howto-ca-certificates.md) uploaded to API Management service. To add support for custom CA, add a layer to the self-hosted gateway container image that installs the CA's root certificate.
- Integration with the [Service Fabric](../service-fabric/service-fabric-api-management-overview.md)
- TLS session resumption
- Client certificate renegotiation. This means that for [client certificate authentication](api-management-howto-mutual-certificates-for-clients.md) to work API consumers must present their certificates as part of the initial TLS handshake. To ensure that, enable the negotiate client certificate setting when configuring a self-hosted gateway custom hostname.
- Built-in cache. See this [document](api-management-howto-cache-external.md) to learn about using external cache in self-hosted gateways.

## Connectivity to Azure

Self-hosted gateways require outbound TCP/IP connectivity to Azure on port 443. Each self-hosted gateway must be associated with a single API Management service and is configured via its management plane. Self-hosted gateway uses connectivity to Azure for:

-   Reporting its status by sending heartbeat messages every minute
-   Regularly checking for (every 10 seconds) and applying configuration updates whenever they are available
-   Sending request logs and metrics to Azure Monitor, if configured to do so
-   Sending events to Application Insights, if set to do so

When connectivity to Azure is lost, self-hosted gateway will be unable to receive configuration updates, report its status, or upload telemetry.

The self-hosted gateway is designed to "fail static" and can survive temporary loss of connectivity to Azure. It can be deployed with or without local configuration backup. In the former case, self-hosted gateways will regularly save a backup copy of the latest downloaded configuration on a persistent volume attached to its container or pod.

When configuration backup is turned off and connectivity to Azure is interrupted:

-   Running self-hosted gateways will continue to function using an in-memory copy of the configuration
-   Stopped self-hosted gateways will not be able to start

When configuration backup is turned on and connectivity to Azure is interrupted:

-   Running self-hosted gateways will continue to function using an in-memory copy of the configuration
-   Stopped self-hosted gateways will be able to start using a backup copy of the configuration

When connectivity is restored, each self-hosted gateway affected by the outage will automatically reconnect with its associated API Management service and download all configuration updates that occurred while the gateway was "offline".

## Next steps

-   [Read a whitepaper for additional background on this topic](https://aka.ms/hybrid-and-multi-cloud-api-management)
-   [Deploy self-hosted gateway to Docker](how-to-deploy-self-hosted-gateway-docker.md)
-   [Deploy self-hosted gateway to Kubernetes](how-to-deploy-self-hosted-gateway-kubernetes.md)
