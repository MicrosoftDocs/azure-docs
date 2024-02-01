---
title: Centralized lifecycle management in Azure Operator 5G Core
description: Outlines the benefit of Azure Operator 5G Core's centralized lifecycle management feature.
author: HollyCl
ms.author: HollyCl
ms.service: azure
ms.topic: concept-article #required; leave this attribute/value as-is.
ms.date: 01/18/2024

#CustomerIntent: As a <type of user>, I want <what?> so that <why?>.
---


# Centralized Lifecycle Management in Azure Operator 5G Core
 
The Azure Operator 5G Core Resource Provider (RP) is responsible for the lifecycle management (LCM) of the following UnityCloud network functions:
- Access and Mobility Management Function (AMF)
- Session Management Function (SMF)
- User Plane Function (UPF)
- Network Repository Function (NRF)
- Network Slice Selection Function (NSSF)
- Containerized Mobility Management Entity (cMME)

Lifecycle Management consists of the following operations:
- Instantiation
- Upgrade (out of scope for Public Preview)
- Termination

The Azure Resource Manager (ARM) model that is used for lifecycle management is shown here: 

> [!NOTE]
> The CNFs are included for Public Preview while the VNFs are targeted for GA release.

:::image type="content" source="media/concept-centralized-lifecycle-management/lifecycle-management-model.png" alt-text="Diagram showing the containerized network functions and virtualized network functions responsible for lifecycle management in Azure Operator 5G Core.":::

Network function federated deployments require fully deployed local Platform as a Service (PaaS) components (cluster). Any attempt to deploy a network function prior to PaaS deployment fails. ARM templates are serial in nature and don't proceed until dependent templates are complete. This process prevents network function templates from being deployed prior to PaaS completion.  Observability deployments also fail if local PaaS deployment is incomplete.

The federated network functions include:
- fed-smf
- fed-amf-mme
- fed-upf
- fed-nrf
- fed-nssf

The deployments for cMME and AnyG are variations on the existing helm charts. Creation of these functions is a matter of specifying different input Helm values. The AO5GC RP uses the Network Function Manager (NFM) Resource Provider to perform this activity. 

AO5GC network function images and Helm charts are Azure-managed and accessed by the AO5GC Resource Provider for lifecycle management operations.  

Local Observability is provided by UnityCloud Observability components listed in the diagram. Because the Observability function is local, it also available in break-glass scenarios for Nexus where the interfaces can be accessed locally.
 
:::image type="content" source="media/concept-centralized-lifecycle-management/local-observability.png" alt-text="Diagram showing how UnityCloud observability components are used in Azure Operator 5G Core. ":::



## Next step
TODO: Add your next step link(s)
> [!div class="nextstepaction"]
> Write concepts
<!-- OR -->

## Related content
TODO: Add your next step link(s)
- 

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.

-->
