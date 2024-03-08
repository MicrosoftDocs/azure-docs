---
title: Centralized lifecycle management in Azure Operator 5G Core Preview
description: Outlines the benefit of Azure Operator 5G Core's (preview) centralized lifecycle management feature.
author: HollyCl
ms.author: HollyCl
ms.service: azure-operator-5g-core
ms.topic: concept-article #required; leave this attribute/value as-is.
ms.date: 02/27/2024

#CustomerIntent: As a <type of user>, I want <what?> so that <why?>.
---


# Centralized Lifecycle Management in Azure Operator 5G Core Preview
 
The Azure Operator 5G Core (preview) Resource Provider (RP) is responsible for the lifecycle management (LCM) of the following Azure Operator 5G Core network functions:
- Access and Mobility Management Function (AMF)
- Session Management Function (SMF)
- User Plane Function (UPF)
- Network Repository Function (NRF)
- Network Slice Selection Function (NSSF)
- Mobility Management Entity (MME)

 > [!NOTE]
>  AMF and MME can be deployed as combined network functions by adjusting the helm manifests. 

Lifecycle Management consists of the following operations:
- Instantiation
- Upgrade (out of scope for Public Preview)
- Termination

The Azure Resource Manager (ARM) model that is used for lifecycle management is shown here: 

> [!NOTE]
> The CNFs are included for Public Preview while the VNFs (VNFAgent and vMME) are targeted for GA release.

:::image type="content" source="media/concept-centralized-lifecycle-management/lifecycle-management-model.png" alt-text="Diagram showing the containerized network functions and virtualized network functions responsible for lifecycle management in Azure Operator 5G Core.":::

Network function deployments require fully deployed local Platform as a Service (PaaS) components (provided by the ClusterServices resource). Any attempt to deploy a network function resource before the ClusterServices deployment fails. ARM templates are serial in nature and don't proceed until dependent templates are complete. This process prevents network function templates from being deployed before the ClusterServices template is complete. Observability deployments also fail if local PaaS deployment is incomplete.

The deployments for cMME and AnyG are variations on the existing helm charts. Creation of these functions is a matter of specifying different input Helm values. The Azure Operator 5G Core RP uses the Network Function Manager (NFM) Resource Provider to perform this activity. 

Azure Operator 5G Core network function images and Helm charts are Azure-managed and accessed by the Azure Operator 5G Core Resource Provider for lifecycle management operations.  

## Local observability

Local Observability is provided by Azure Operator 5G Core Observability components listed in the diagram. Because the Observability function is local, it also available in break-glass scenarios for Nexus where the interfaces can be accessed locally.
 
:::image type="content" source="media/concept-centralized-lifecycle-management/local-observability.png" alt-text="Diagram showing how Azure Operator 5G Core observability components are used in Azure Operator 5G Core." lightbox="media/concept-centralized-lifecycle-management/local-observability.png":::


## Next Step

- [Quickstart: Get Access to Azure Operator 5G Core](quickstart-subscription.md)