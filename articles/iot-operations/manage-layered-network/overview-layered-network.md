---
title: Azure IoT Operations networking
description: Learn about Azure IoT Operations networking
author: PatAltimore
ms.subservice: layered-network-management
ms.author: patricka
ms.topic: concept-article
ms.custom:
  - ignite-2023
ms.date: 06/30/2025

#CustomerIntent: As an operator, I want understand how to use Azure IoT Operations networking to secure my devices.
ms.service: azure-iot-operations
---

# Azure IoT Operations networking

Networking is a foundational aspect of deploying and managing distributed systems, especially when working with hybrid and multi-cloud environments. In Azure Arc-enabled scenarios, networking enables secure connectivity between on-premises resources, edge devices, and Azure services. Proper network configuration ensures reliable communication, security, and scalability for your IoT Operations and Kubernetes clusters. There are several networking options you can use.

## Arc gateway

The Azure Arc gateway acts as a network proxy, allowing you to onboard and manage servers that do not have direct internet access. By routing traffic through the gateway, you can simplify firewall rules and reduce the need for complex network changes. This is especially useful for securely connecting isolated or segmented environments to Azure Arc.

For more information about the Azure Arc gateway, see [simplify network configuration requirements with Azure Arc gateway (preview)](/azure/azure-arc/servers/arc-gateway).

## Connected clusters

The Azure Arc gateway for connected Kubernetes clusters enables you to register and manage clusters behind firewalls or in private networks. It reduces the need for outbound connectivity from each cluster, centralizing network egress through the gateway. This approach streamlines onboarding and ongoing management of clusters in secure or restricted environments.

For more information about connected clusters, see [simplify network configuration requirements with Azure Arc gateway (preview)](/azure/azure-arc/servers/arc-gateway).

## Explicit proxy usage

Azure Firewall Explicit Proxy allows you to direct Azure Arc traffic through a managed firewall, providing enhanced security and monitoring. This is useful for organizations that require all outbound traffic to be inspected or logged, and helps meet compliance requirements by controlling and auditing network flows to Azure.

For more information about Azure Firewall Explicit Proxy, see [access Azure services over Azure Firewall Explicit Proxy (Public Preview)](/azure/azure-arc/azure-firewall-explicit-proxy).

## Networking sample

In industries like manufacturing, you often see segmented networking architectures that create layers. These layers minimize or block lower-level segments from connecting to the internet (for example, [Purdue Network Architecture](https://en.wikipedia.org/wiki/Purdue_Enterprise_Reference_Architecture)). This article shows one way to work with these networks by using open, industry-recognized software.

A networking guidance sample is available in the [Azure IoT Operations samples repository](https://github.com/Azure-Samples/explore-iot-operations/tree/patricka-layered-network/samples/layered-networking). The sample demonstrates how to use Azure IoT Operations networking to manage devices in segmented networks, such as those found in manufacturing environments. It provides a practical implementation of the layered network architecture, allowing you to connect and manage devices securely. The sample includes:

- Kubernetes-based configuration and compatibility with networking primitives
- Connecting devices in isolated networks at scale to [Azure Arc](/azure/azure-arc/) for application lifecycle management and configuration of previously isolated resources remotely from a single Azure control plane
- Security and governance across network levels for devices and services with URL and IP allow lists and connection auditing
- Compatibility with all Azure IoT Operations services connection
- Bifurcation capabilities for targeted endpoints

> [!IMPORTANT]
> Azure IoT Layered Network Management (preview) will be retired. Use the [networking sample](https://github.com/Azure-Samples/explore-iot-operations/tree/patricka-layered-network/samples/layered-networking) instead to implement layered network management in Azure IoT Operations.
