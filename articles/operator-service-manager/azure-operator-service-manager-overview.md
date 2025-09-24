---
title: What is Azure Operator Service Manager?
description: Learn about Azure Operator Service Manager, an Azure orchestration service used to managed network service in large scale operator environments.
author: msftadam
ms.author: adamdor
ms.date: 10/18/2023
ms.topic: overview
ms.service: azure-operator-service-manager
---
# What is Azure Operator Service Manager?

Azure Operator Service Manager is a cloud orchestration service designed to simplify management of complex edge network services hosted on the Azure Operator Nexus platform. It provides persona-based capabilities to onboard, compose, deploy, and update multi-vendor applications across one-to-many Azure sites and regions. Azure Operator Service Manager caters to large scale operator environments, accelerating workload migrations using Azure safe practices to ensure error-free service deployments.

:::image type="content" source="media/overview-unified-service.png" alt-text="Diagram that shows unified service orchestration across Azure domains." lightbox="media/overview-unified-service-lightbox.png":::

## Technical overview

Managing complex network service lifecycle efficiently and reliably can be a challenge. Azure Operator Service Manager’s unique approach introduces curated experiences for publishers, designers, and operators. The publisher role first onboards the network function, creating a network function description (NFD). The designer role then onboards the network service, creating a network service design (NSD) and configuration group schema (CGS). The operator role deploys a site network service, providing the site and run-time configuration group values (CGVs). These personas deploy a complete service stack, stretching across platforms, software and configuration requirements, as illustrated in the following workflows;

:::image type="content" source="media/overview-deployment-workflows.png" alt-text="Illustration that shows the Azure Operator Service Manager (AOSM) deployment workflow." lightbox="media/overview-deployment-workflows-lightbox.png":::

## Product features

### Orchestrate service platforms

Azure Operator Service Manager's deep integration with Azure Operator Nexus ensures comprehensive coverage of infrastruction operations required for any network function type. For virtual network functions (VNFs) create L2/L3 isolation domains, network resources, trunk, and content service network (CSN) resources. For container network functions (CNFs) create initial Nexus AKS (NAKS) cluster, finalize cluster and test cluster for standards/security compliance.

### Flexible service composition

Use Azure Operator Service Manager's service models to describe complex functional resource requirements across both installation and upgrade deployments. Use familiar artifacts like ARM templates with 'VHD' Images, for VNFs and Helm charts, with Docker images, for CNFs. Artifact versioning keeps multiple generations of software available and failure detection uses versions for automated rollback.

### Repeatable service configuration

Azure Operator Service Manager abstracts workload configuration into schemas and values capable of handling the expansive configuration requirements of the most demanding workloads. Publisher's can define static configuration, which never changes, or expose site-specific or unique-service configuration, dynamically. Configuration validation prechecks values, to ensure compliance with schema, while versioning manages both the major and minor configuration changes, which are common during workload lifecycle.

### Unified service workflows

Define service management workflow tasks as a consolidated set of end-to-end Azure operations. Seamlessly manage infrastructure, software, and configuration for complex multi-vendor multi-region services. Develop workflows using Azure Resource Manager (ARM), just like other Azure service. Drive persona operations via any Azure interfaces, such as portal, CLI, API, or SDK.

### Hybrid operations at scale

Azure Operator Service Manager scales using the same underlying databases, analytics, and cloud-native fundamentals as Azure itself. Core and edge workloads can be managed together, as complete network deployments ranging in scale from private 5G to national networks. Alternatively, segregate resources using Azure subscription or role to create domain separation.

### Safe upgrade practices

Azure Operator Service Manager uses Azure safe practices to offer a common upgrade method for multi-vendor workload resources. Optimize upgrade process to reduce durations and finish fast. Detect failures, via intelligent service awareness, avoid failures, where possible, and where not, to fail fast. Minimize the impact of unplanned upgrade failures with pause-on-failure or rollbac-on-failure recovery options. Follow progress of complex upgrades with component level visibility and curated logging.

### Operator grade security

Azure Operator Service Manager works seamlessly with security features including Azure private link and secret management services to harden all interface between customer premise and Azure cloud. In addition, services installed onto the customer edge cluster undergoing rigorous security testing and are constantly updated for compliance with strong security posture.

### Automation and AI

Achieve continuous integration and delivery combining Azure Operator Service Manager with Azure DevOps (ADO). Pull new software release directly from the latest repository, deploy using Azure safe practices and scale from one site to thousands of sites. Go further by influencing workflow decisions with data-driven insights and actions. Integrate with any Azure analytics or AI services, including Azure Fabric, Azure Data Explorer (ADX), Azure LogicApps, and Azure Copilot.

## Conclusion

By unifying service management, facilitating deployments at fleet-wide scale, and ensuring service consistency, operators can achieve accelerated service velocity, improved service reliability, and optimize service cost. Harness the power of Microsoft Azure through Azure Operator Service Manager to drive network services forward.

## Service Level Agreement

SLA (Service Level Agreement) information can be found on the [Service Level Agreements SLA for Online Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services?lang=1)).

### Related Azure services

Azure Operator Service Manager is often deployed in combination with the following Azure services.

- [Azure Operator Nexus](/azure/operator-nexus)
- [Azure DevOps](/azure/devops)
- [Microsoft Fabric](/fabric)
- [Microsoft Copilot](/copilot)

## Get access to Azure Operator Service Manager (AOSM) for your Azure subscription

Contact your Microsoft account team to register your Azure subscription for access to Azure Operator Service Manager (AOSM) or express your interest through the [partner registration form](https://forms.office.com/pages/responsepage.aspx?id=v4j5cvGGr0GRqy180BHbR7lMzG3q6a5Hta4AIflS-llUMlNRVVZFS00xOUNRM01DNkhENURXU1o2TS4u).
