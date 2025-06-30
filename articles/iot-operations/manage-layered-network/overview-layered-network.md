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

Networking is a foundational aspect of deploying and managing distributed systems, especially in hybrid and multi-cloud environments. In Azure IoT Operations, secure networking enables reliable connectivity between on-premises resources, edge devices, and Azure services. Proper network configuration is essential for communication, security, and scalability of IoT Operations and Kubernetes clusters. This article describes key networking options and best practices for securing layered network architectures.

## Azure Arc gateway

The Azure Arc gateway acts as a network proxy, allowing you to onboard and manage servers that do not have direct internet access. By routing traffic through the gateway, you can simplify firewall rules and reduce the need for complex network changes. This approach is especially useful for securely connecting isolated or segmented environments to Azure Arc and Azure IoT Operations.

For more information, see [Simplify network configuration requirements with Azure Arc gateway (preview)](/azure/azure-arc/servers/arc-gateway).

## Connected Kubernetes clusters

The Azure Arc gateway for connected Kubernetes clusters enables you to register and manage clusters behind firewalls or in private networks. It reduces the need for outbound connectivity from each cluster by centralizing network egress through the gateway. This approach streamlines onboarding and ongoing management of clusters in secure or restricted environments.

For more information, see [Simplify network configuration requirements with Azure Arc gateway (preview)](/azure/azure-arc/servers/arc-gateway).

## Explicit proxy usage

Azure Firewall Explicit Proxy allows you to direct Azure Arc and IoT Operations traffic through a managed firewall, providing enhanced security and monitoring. This is useful for organizations that require all outbound traffic to be inspected or logged, and helps meet compliance requirements by controlling and auditing network flows to Azure.

For more information, see [Access Azure services over Azure Firewall Explicit Proxy (Public Preview)](/azure/azure-arc/azure-firewall-explicit-proxy).

## Layered networking sample

In industries like manufacturing, segmented networking architectures (such as the [Purdue Network Architecture](https://en.wikipedia.org/wiki/Purdue_Enterprise_Reference_Architecture)) are common. These architectures create layers that minimize or block lower-level segments from connecting to the internet. Azure IoT Operations supports secure management of devices in these layered networks using open, industry-recognized software and Kubernetes-based configuration.

A practical networking sample is available in the [Azure IoT Operations samples repository](https://github.com/PatAltimore/explore-iot-operations/tree/patricka-layered-network/samples/layered-networking). This sample demonstrates how to:

- Use Kubernetes-based configuration and networking primitives for layered environments
- Connect devices in isolated networks at scale to [Azure Arc](/azure/azure-arc/) for application lifecycle management and remote configuration
- Enforce security and governance across network levels with URL/IP allow lists and connection auditing
- Ensure compatibility with all Azure IoT Operations services
- Enable bifurcation for targeted endpoints

[!INCLUDE [retirement-notice](includes/retirement-notice.md)]