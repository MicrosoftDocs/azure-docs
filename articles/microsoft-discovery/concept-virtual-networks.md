---
title: Virtual Networks in Microsoft Discovery
description: Conceptual Architecture Overview of Virtual Networks in Microsoft Discovery
author: anzaman
ms.author: alzam
ms.service: azure
ms.topic: concept-article
ms.date: 02/19/2026
---

# Virtual Networks in Microsoft Discovery

Microsoft Discovery uses Azure Virtual Networks (VNets) to provide secure, isolated networking for Discovery resources deployed in a customer’s Azure subscription. VNets form the foundational network boundary that enables secure communication between Discovery components while aligning with enterprise security and compliance expectations.

This document provides a high‑level, conceptual overview of how VNets are used in Microsoft Discovery. It focuses on intent and principles rather than configuration details or implementation steps.

## Why Virtual Networks Matter in Discovery
Virtual Networks are used in Microsoft Discovery to:

- Isolate Discovery resources from the public internet where appropriate
- Control network traffic between compute, storage, and platform services
- Support private and restricted connectivity patterns
- Integrate Discovery deployments into customer enterprise network environments

By anchoring Discovery resources inside VNets, the platform enables customers to apply familiar Azure networking constructs such as IP address management, routing, and access controls.

## Discovery Components and Network Context
Microsoft Discovery consists of several interconnected components that work together to orchestrate and execute scientific and engineering workloads. At a high level, these components include:

- **Workspace** (Discovery Copilot / control plane orchestration)
- **Supercomputer** (GPU and compute execution environment)
- **Bookshelf** (optional indexing and knowledge storage component)

Virtual Networks provide the secure network context in which these components communicate with each other and with underlying Azure services.

## Virtual Networks as Isolation Boundaries
In Microsoft Discovery, a Virtual Network represents a clear isolation boundary for deployed resources. Within this boundary:

- Network traffic between Discovery resources can remain on the Azure backbone
- Exposure to public endpoints can be limited or eliminated depending on configuration
- Customers can reason about Discovery traffic using standard Azure networking concepts

## Subnets and Network Segmentation
Within a Discovery VNet, subnets are treated as logical roles, not merely IP partitions. Common conceptual subnet roles include:

* Compute subnets (AKS, VMSS, or supercomputer node pools)
* Storage or data access subnets
* Platform integration subnets (private endpoints, service integrations)

Subnets allow Discovery deployments to:

- Apply scoped network policies and rules
- Reduce the blast radius of misconfigurations
- Prepare for future expansion without redesigning the network boundary

From a conceptual standpoint, subnets represent roles within the network, rather than exposing customers to internal service topology.

## Private Connectivity
Microsoft Discovery supports networking patterns that enable private connectivity to Azure services. In these patterns:

- VNets host private connectivity endpoints
- Discovery resources access dependent Azure services through private network paths
- Public network access can be minimized in environments with stricter security requirements

This model helps customers meet compliance and security expectations while continuing to use managed Azure services.

## Regional Deployment and Availability
Discovery VNets are deployed in the same Azure regions as the resources they contain. This ensures:

- Low‑latency communication between components
- Alignment with Azure regional and Availability Zone constructs
- Clear mapping between regional capacity and network boundaries

## Security Perspective
From a security standpoint, Virtual Networks play a central role in Microsoft Discovery by:

- Limiting unintended network exposure
- Supporting private access to compute and data resources
- Enabling compliance with enterprise networking policies

VNets are one layer in a broader security model that also includes identity, access management, and platform‑level controls.
