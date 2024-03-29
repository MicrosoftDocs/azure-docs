---
title: Centralized lifecycle management in Azure Operator 5G Core Preview
description: Outlines the benefit of Azure Operator 5G Core's (preview) centralized lifecycle management feature.
author: HollyCl
ms.author: HollyCl
ms.service: azure-operator-5g-core
ms.topic: concept-article #required; leave this attribute/value as-is.
ms.date: 03/28/2024

#CustomerIntent: As a <type of user>, I want <what?> so that <why?>.
---


# Centralized Lifecycle Management in Azure Operator 5G Core Preview
 
The Azure Operator 5G Core (preview) Resource Provider (RP) is responsible for the lifecycle management (LCM) of the following Azure Operator 5G Core network functions and the dependent shared services:
- Access and Mobility Management Function (AMF)
- Session Management Function (SMF)
- User Plane Function (UPF)
- Network Repository Function (NRF)
- Network Slice Selection Function (NSSF)

Lifecycle Management consists of the following operations:
- Instantiation
- Upgrade (out of scope for Public Preview)
- Termination

The Azure Resource Manager (ARM) model that is used for lifecycle management is shown here. 

:::image type="content" source="media/concept-centralized-lifecycle-management/lifecycle-management-model.png" alt-text="Diagram showing the containerized network functions and virtualized network functions responsible for lifecycle management in Azure Operator 5G Core.":::

Network function deployments require fully deployed local Platform as a Service (PaaS) components (provided by the ClusterServices resource). Any attempt to deploy a network function resource before the ClusterServices deployment fails. The Azure Operator 5G Core ARM templates are serial in nature and don't proceed until dependent templates are complete. This process prevents network function templates from being deployed before the ClusterServices template is complete. Observability deployments also fail if local PaaS deployment is incomplete.


## Local observability

Local Observability is provided by Azure Operator 5G Core Observability components including Prometheus, FluentD, Elastic, Grafana, and Jaegar. Because the Observability function is local, it also available in break-glass scenarios for Nexus when connectivity to Azure is down and the services can be accessed locally. 
 
## Related content

- [Quickstart: Get Access to Azure Operator 5G Core](quickstart-subscription.md)
- [Deployment order for clusters, network functions, and observability](concept-deployment-order.md)