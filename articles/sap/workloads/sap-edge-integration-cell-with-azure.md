---
title: Onboarding SAP Edge Integration Cell with Azure
description: Learn about onboarding SAP Edge Integration Cell with Azure Kubernetes Service (AKS).
author: MartinPankraz

ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: how-to
ms.date: 06/05/2025
ms.author: mapankra
# Customer intent: As a cloud architect, I want to onboard SAP Edge Integration Cell with Azure Kubernetes Service, so that I can efficiently manage API integrations and optimize deployment across cloud and on-premises environments.
---

# Onboarding SAP Edge Integration Cell with Azure

[SAP Edge Integration Cell](https://help.sap.com/docs/integration-suite/sap-integration-suite/what-is-sap-integration-suite-edge-integration-cell) is a hybrid integration runtime offered as part of SAP Integration Suite, which enables you to manage APIs and run integration scenarios within your private landscape.

The hybrid deployment model of Edge Integration Cell enables you to:

- Design and monitor your SAP integration content in the cloud.
- Deploy and run your SAP integration content in your private landscape.

Using [Azure Kubernetes Service (AKS)](/azure/aks/) SAP Edge Integration Cell may natively run on Azure. Enriching AKS with [Azure ARC](/azure/azure-arc/kubernetes/overview) extends the scenario to on-premises and other cloud providers. Govern from Azure but deploy anywhere.

:::image type="content" source="media/sap-eic/overview.png" alt-text="Screenshot of SAP Edge Integration Cell architecture with Azure and Azure ARC.":::

This article builds on top of SAP's documentation and walks you through the deployment considerations and Azure best practices.

## Getting Started

Use [the accelerator project](https://github.com/Azure/sap-edge-integration-cell-on-azure-accelerator) for SAP Edge Integration Cell with Azure to get started quickly and discover blue prints for production-ready deployments. It uses terraform as common language to deploy the Azure infrastructure and the SAP Business Technology Platform (BTP) footprint at the same time.

## Setup Considerations

Find the latest info on supported Azure services for SAP Edge Integration Cell on SAP note [3247839 | Prerequisites for installing SAP Integration Suite Edge Integration Cell](https://me.sap.com/notes/3247839). In addition, follow SAP's [onboarding guide](https://help.sap.com/docs/integration-suite/sap-integration-suite/before-you-start).

Consider the following Microsoft Learn resources for AKS for a successful deployment in production. These apply independently of the SAP workload.

- [Architecture best practices and design checklists for Azure Kubernetes Service (AKS) | Well Architected Framework](/azure/well-architected/service-guides/azure-kubernetes-service)
- [Baseline architecture for an Azure Kubernetes Service (AKS) cluster | Architecture Center](/azure/architecture/reference-architectures/containers/aks/baseline-aks)

> [!NOTE]
> Network traffic between SAP BTP services deployed on Azure and other Azure services like AKS remains on the Microsoft backbone. This means that even the SAP Edge Integration Cell heartbeat stays private. Learn more [here](/azure/virtual-network/virtual-networks-udr-overview#default-route).

### Deployment Options

| Deployment Type | Kubernetes Platform | Supporting Azure Services | Notes |
|-----------------|---------------------|---------------------|-------|
| **Cloud-Native** | Azure Kubernetes Service (AKS) | Azure Database for PostgreSQL, Azure Redis Cache | Recommended for production; supports autoscaling and HA setups |
| **On-Premises** | Azure ARC-enabled Kubernetes Service | Azure ARC |  |
| **Dev/Test** | Azure Kubernetes Service (single node pool) | none | Use SAP's built-in PostgreSQL and Cache option for quickest deployment; not suitable for production |

It's recommended to use Azure PaaS services for a fully platform-managed experience and optimal Service Level Agreement.

### Supported Kubernetes Versions

Verify matching Kubernetes versions and release calendars as per SAP's requirements (SAP Note [3247839](https://me.sap.com/notes/3247839)) from the following source:

- [Azure Kubernetes Service (AKS)](/azure/aks/supported-kubernetes-versions)
- [Azure ARC-enabled Kubernetes Service](/azure/aks/aksarc/supported-kubernetes-versions)

Familiarize yourself with the mentioned support policy, [Long-term support](/azure/aks/long-term-support) options, and deprecation process to choose the right version for your scenario.

## Next Steps

- Use [the accelerator project](https://github.com/Azure/sap-edge-integration-cell-on-azure-accelerator) for SAP Edge Integration Cell with Azure to get started quickly.
- For more information, see the latest [SAP Edge Integration Cell documentation](https://help.sap.com/docs/integration-suite/sap-integration-suite/what-is-sap-integration-suite-edge-integration-cell).
