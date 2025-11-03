---
title: What Is Azure Operator Service Manager?
description: Learn about Azure Operator Service Manager, an Azure orchestration service for managing network services in large-scale operator environments.
author: msftadam
ms.author: adamdor
ms.date: 10/18/2023
ms.topic: overview
ms.service: azure-operator-service-manager
---
# What is Azure Operator Service Manager?
Azure Operator Service Manager is a cloud orchestration service designed to automate lifecycle management of complex mobility workloads hosted on Azure Operator Nexus. Azure Operator Service Manager caters to unique telecommunication industry requirements, taking inspiration from standards defining organizations (SDOs) such as 3GPP, ETSI, ONAP, and TMF, fusing these efforts with our adaptive cloud approach to increase hybrid orchestration: 
* Simplicity, via unified composition of infrastructure, software, and configuration specifications.
* Reliability, via Azure safe deployment and upgrade practices, ensuring error-free service operations.
* Resiliency, via robust edge registry and high availability, to survive even a disconnected event.
* Security, with private link and obscured secrets, to prevent unauthorized access to sensitive date.

In an industry where pace of mobility service delivery often decides winners and losers use Azure Operator Service Manager to accelerate the transition of mobility services to Azure.

:::image type="content" source="media/overview-unified-service.png" alt-text="Diagram that shows unified service orchestration across Azure domains." lightbox="media/overview-unified-service-lightbox.png":::

## Technical overview
Managing a complex network service lifecycle efficiently and reliably can be a challenge. Azure Operator Service Manager offers a unique approach that introduces curated experiences for publishers, designers, and operators.
* The publisher role first onboards the network function (NF) to create a network function description (NFD).
* The designer role then onboards the network service to create a network service design (NSD) and configuration group schema (CGS).
* The operator role deploys a site network service to provide configuration group values (CGVs) for the site and runtime.

These personas deploy a complete service stack that stretches across platforms, software, and configuration requirements, as illustrated in the following workflows.

:::image type="content" source="media/overview-deployment-workflows.png" alt-text="Diagram that shows Azure Operator Service Manager deployment workflows." lightbox="media/overview-deployment-workflows-lightbox.png":::

## Product features

### Orchestration of service platforms
The deep integration of Azure Operator Service Manager with Azure Operator Nexus helps ensure comprehensive coverage of infrastructure operations that any NF type requires.
* For virtual network functions (VNFs), create Layer 2 and Layer 3 isolation domains, network resources, the trunk, and content service network (CSN) resources.
* For container network functions (CNFs), create the initial Nexus Azure Kubernetes Service (NAKS) cluster, finalize the cluster, and then test the cluster for standards/security compliance.

### Flexible service composition
Use Azure Operator Service Manager service models to describe complex functional resource requirements across both installation and upgrade deployments. Use familiar artifacts like Azure Resource Manager templates with:
* Virtual hard disk (VHD) images for VNFs and Helm charts.
* Docker images for CNFs.

Artifact versioning keeps multiple generations of software available. Failure detection uses versions for automated rollback.

### Repeatable service configuration
Azure Operator Service Manager abstracts workload configuration into schemas and values that can handle the expansive configuration requirements of demanding workloads. Publishers can:
* Define static configuration, which never changes.
* Expose site-specific or unique service configuration dynamically.

Configuration validation prechecks values to ensure compliance with schemas. Versioning manages both the major and minor configuration changes, which are common during the workload lifecycle.

### Unified service workflows
Define workflow tasks for service management as a consolidated set of end-to-end Azure operations. 
* Seamlessly manage infrastructure, software, and configuration for complex multiple-vendor and multiple-region services.
* Develop workflows by using Azure Resource Manager, just like other Azure services. 

Drive persona operations via any Azure interface, such as  the portal, CLI, API, or SDK.

### Hybrid operations at scale
Azure Operator Service Manager scales by using the same underlying databases, analytics, and cloud-native fundamentals as Azure itself. 
* You can manage core and edge workloads together as complete network deployments that range in scale from private 5G to national networks.
* Alternatively, segregate resources by using Azure subscriptions or roles to create domain separation.

### Safe upgrade practices
Azure Operator Service Manager uses Azure safe practices to offer a common upgrade method for multiple-vendor workload resources. 
* Optimize upgrade processes to reduce durations and finish fast.
* Detect failures via intelligent service awareness.
* Avoid failures where possible, and fail fast when failures aren't avoidable.
* Minimize the impact of unplanned upgrade failures with pause-on-failure or rollback-on-failure recovery options.
* Follow the progress of complex upgrades with component-level visibility and curated logging.

### Operator-grade security

Azure Operator Service Manager works seamlessly with security features like 
* Azure Private Link to harden all interfaces between customer premises and the Azure cloud platform.
* Secret management services to ensure privilege information aren't exposed unnecessarily.

Services installed on the customer edge cluster undergo rigorous security testing and are constantly updated for compliance with a strong security posture.

### Automation and AI
Achieve continuous integration and continuous delivery (CI/CD) by combining Azure Operator Service Manager with Azure DevOps. 
* Pull new software releases directly from the latest repository.
* Deploy by using Azure safe practices, and scale from one site to thousands of sites.
* Integrate with any Azure analytics or AI services, including Microsoft Fabric, Azure Data Explorer, Azure Logic Apps, and Microsoft Copilot.

Go further by influencing workflow decisions with data-driven insights and actions. 

## Service-level agreement
For service-level agreement (SLA) information, see the [list of SLAs for Microsoft online services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services?lang=1).

## Related Azure services
Azure Operator Service Manager is often deployed in combination with the following Azure services:
- [Azure Operator Nexus](/azure/operator-nexus)
- [Azure DevOps](/azure/devops)
- [Microsoft Fabric](/fabric)
- [Microsoft Copilot](/copilot)

## Access to Azure Operator Service Manager for your Azure subscription
Azure Operator Service Manager is now generally available to any commercial Azure subscription. To use Azure Operator Service Manager in your subscription, register for the `Microsoft.HybridNetwork` service provider.

