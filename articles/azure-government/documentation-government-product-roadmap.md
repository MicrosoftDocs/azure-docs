---
title: Azure Government product General Availability (GA) roadmap
description: Overview of Azure Government product General Availability (GA) by authorization level
ms.service: azure-government
ms.topic: article
ms.author: russellkirk
author: krussell09
recommendations: false
ms.date: 11/19/2026
---
# Microsoft Azure Government Product General Availability(GA) Roadmap

This article provides a General Availability (GA) roadmap for current and upcoming Microsoft products across Azure Government cloud environments.

Microsoft Azure for U.S. Government offers two distinct cloud environments:

- **Azure Government**: A dedicated cloud for U.S. government agencies and their partners, authorized under *FedRAMP High* and compliant with *Department of Defense (DoD) Impact Levels 4 and 5* requirements.

- **Azure Government Secret**: An air-gapped environment designed exclusively for U.S. agencies and cleared partners working with Secret-level classified data. This environment is fully isolated from public networks with strict access controls and meets *DoD Impact Level 6* requirements.

Both environments are built on the same foundational principles and architecture as Azure commercial clouds while meeting rigorous security and compliance requirements in accordance with multiple regulatory standards, including *FedRAMP High* and the *Department of Defense Security Requirements Guide (DoD SRG)*.

For comprehensive information about compliance in Azure Government clouds, see [Azure Government Compliance](/azure/azure-government/documentation-government-plan-compliance).

## Legend

| GA Status | Description |
|---|---|
| :::image type="icon" source="media/check-mark.svg" border="false"::: | Currently generally available (GA) and authorized. |
| Awaiting review | Currently GA; authorization has been submitted but not yet granted. |
| In progress | Availability or authorization work is in progress. This includes products that are already GA but whose authorization has not yet been submitted. |
| n/a | Not planned, not applicable, retired, or closing down. |

> [!NOTE]
> **Bold names are offerings.** Indented rows are SKUs or features. For example, *App Service Premium v3 | Windows Containers* appears under **App Service**. Each row has its own status.

## Product General Availability Roadmap

Products are grouped by category. Select a category to jump to its table:
- [Analytics](#roadmap-analytics)
- [Compute](#roadmap-compute)
- [Data And Storage](#roadmap-data-and-storage)
- [Developer Services](#roadmap-developer-services)
- [Hybrid Integration](#roadmap-hybrid-integration)
- [Identity And Access Management](#roadmap-identity-and-access-management)
- [Intelligence](#roadmap-intelligence)
- [Management](#roadmap-management)
- [Media And CDN](#roadmap-media-and-cdn)
- [Networking](#roadmap-networking)
- [Web And Mobile](#roadmap-web-and-mobile)

Products with only n/a or blank entries across all four certification columns are omitted.

<a id="roadmap-analytics"></a>

## Analytics

| Product | FedRAMP High | DoD IL4 | DoD IL5 WI | DoD IL6 (Azure Secret) |
| :--- | :---: | :---: | :---: | :---: |
| **Azure Analysis Services** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| **Azure Bot Service** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress | n/a |
| **Azure Data Explorer** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Azure Data Share** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| **Azure Databricks** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| **Azure Stream Analytics** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | Awaiting review |
| &emsp;&emsp;&emsp;Stream Analytics Dedicated | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | Awaiting review |
| &emsp;&emsp;&emsp;Stream Analytics Jobs | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | Awaiting review |
| **Data Factory** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Dynamics 365 Customer Service** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress | n/a |
| **Dynamics 365 Sales** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| **Event Hubs** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Azure Event Hubs Premium SKU | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| **HDInsight** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| **Microsoft Planetary Computer Pro** | :::image type="icon" source="media/check-mark.svg" border="false"::: | Awaiting review | Awaiting review | In progress |
| **Power BI** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Power BI Embedded** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress |

<a id="roadmap-compute"></a>

## Compute

| Product | FedRAMP High | DoD IL4 | DoD IL5 WI | DoD IL6 (Azure Secret) |
| :--- | :---: | :---: | :---: | :---: |
| **Azure Firewall** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Azure Firewall Premium | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Azure Firewall Standard | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Azure Kubernetes Service (AKS)** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Azure Red Hat OpenShift (ARO)** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| **Azure Service Manager (RDFE)** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Azure Update Manager** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | Awaiting review | In progress |
| **Azure VMware Solution** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| **Batch** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Cloud Services** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Container Instances** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Container Registry** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Service Fabric** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Virtual Machine Scale Sets** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Flexible Orchestration Mode | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Virtual Machines** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Av2-Series | In progress | In progress | In progress | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Azure Compute Gallery | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress |
| &emsp;&emsp;&emsp;Azure Dedicated Host | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress | In progress | In progress |
| &emsp;&emsp;&emsp;Azure Disk Encryption | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;B-Series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;D\*v4-Series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;DCadsv6-series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;DCasv6-series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Ddsv4-series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Ddsv5-Series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Ddv4-series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;DDv5-Series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Dldsv5-Series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Dlsv5-Series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;DSv2-Series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| &emsp;&emsp;&emsp;DSv3-Series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Dsv4-series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Dsv5-Series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Dv2-Series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| &emsp;&emsp;&emsp;Dv3-Series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Dv4-series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Dv5-Series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;E\*v4-Series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Ebdsv5-Series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Ebsv5-Series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;ECadsv6-series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;ECasv6-series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Edsv4-series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Edsv5-Series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Edv4-series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Eidsv5-Series | In progress | In progress | In progress | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;ESv3-Series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Esv4-series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Esv5-Series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Ev3-Series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Ev4-series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Ev5-Series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;F-Series | In progress | In progress | In progress | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;FS-Series | In progress | In progress | In progress | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;FSv2-Series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;HBv2-Series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| &emsp;&emsp;&emsp;HCv1-Series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| &emsp;&emsp;&emsp;Instance Level IPs | In progress | In progress | In progress | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;LSv2-Series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;M-Series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| &emsp;&emsp;&emsp;Mdsv2 Medium Memory Series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| &emsp;&emsp;&emsp;Msv2 Medium Memory Series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| &emsp;&emsp;&emsp;NCv3-Series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| &emsp;&emsp;&emsp;NDs H200 v5-Series | n/a | n/a | n/a | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;NVadsA10\_v5-series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;NVv3-Series | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| &emsp;&emsp;&emsp;Reserved IP | In progress | In progress | In progress | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Serial Console | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress |
| &emsp;&emsp;&emsp;Spot Virtual Machines | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| &emsp;&emsp;&emsp;Trusted Launch | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |

<a id="roadmap-data-and-storage"></a>

## Data And Storage

| Product | FedRAMP High | DoD IL4 | DoD IL5 WI | DoD IL6 (Azure Secret) |
| :--- | :---: | :---: | :---: | :---: |
| **Azure AI Search** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;AI Enrichment | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Semantic Ranker | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Azure App Configuration** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Azure Cosmos DB** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Azure Database for MySQL** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| &emsp;&emsp;&emsp;Azure Database for MySQL - Flexible Server | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| **Azure Database for PostgreSQL** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Azure Database for PostgreSQL - Flexible Server | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Azure Database Migration Service** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Azure Files** | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress | In progress | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Azure NetApp Files** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| **Azure SQL Database** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Azure SQL Managed Instance** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | Awaiting review |
| **Azure Synapse Analytics** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Default \| Workspace | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress |
| **Redis Cache** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Redis Enterprise | In progress | In progress | In progress | n/a |
| **Storage** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Archive Storage | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | Awaiting review |
| &emsp;&emsp;&emsp;Azure Data Lake Storage Gen2 | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Azure Data Lake Storage Gen2 \| Premium tier for Azure Data Lake Storage | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Azure File Sync | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Azure Premium Files | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Azure Storage Reservations | In progress | In progress | In progress | n/a |
| &emsp;&emsp;&emsp;Blobs (incl. Azure Data Lake Storage Gen2) | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Disk Storage | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Hot/Cool/Cold Blob Storage Tiers | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Hot/Cool/Cold Blob Storage Tiers \| SSH Transfer Protocol | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Import/Export | In progress | In progress | In progress | n/a |
| &emsp;&emsp;&emsp;Managed Disks | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Managed Disks \| Shared Disk | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Premium Block Blobs | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Premium Page Blob | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Premium SSD v2 | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| &emsp;&emsp;&emsp;Queues | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Standard Page Blob | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Tables | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Ultra Disk Storage | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |

<a id="roadmap-developer-services"></a>

## Developer Services

| Product | FedRAMP High | DoD IL4 | DoD IL5 WI | DoD IL6 (Azure Secret) |
| :--- | :---: | :---: | :---: | :---: |
| **Azure DevTest Labs** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| **Azure Monitor** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Application Insights | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Azure Monitor Essentials | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Azure Monitor Essentials \| Action Groups | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Azure Monitor Essentials \| Activity Log | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Azure Monitor Essentials \| Alerts | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Azure Monitor Essentials \| AutoScale | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Azure Monitor Essentials \| Diagnostic Logs | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Azure Monitor Essentials \| Metrics | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress |
| &emsp;&emsp;&emsp;Azure Monitor Managed Service for Prometheus | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress |
| &emsp;&emsp;&emsp;Log Analytics | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Log Analytics \| Container Insights | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Log Analytics \| Service Map and VM Insights | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Azure SignalR Service** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Microsoft Azure Portal** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Windows Admin Center for Azure Arc | In progress | In progress | In progress | n/a |
| **Power Apps Basic** | In progress | In progress | In progress | In progress |
| **Power Apps Premium** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress | :::image type="icon" source="media/check-mark.svg" border="false"::: |

<a id="roadmap-hybrid-integration"></a>

## Hybrid Integration

| Product | FedRAMP High | DoD IL4 | DoD IL5 WI | DoD IL6 (Azure Secret) |
| :--- | :---: | :---: | :---: | :---: |
| **Azure Data Box** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Data Box | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Data Box 120 | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Data Box 525 | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Data Box Disk | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| **Azure Migrate** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | Awaiting review |
| **Azure Stack** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Azure Stack Hub Ruggedized | In progress | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Backup** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Power Automate Basic** | In progress | In progress | In progress | In progress |
| **Power Automate Premium** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Service Bus** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Premium | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Site Recovery** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | Awaiting review |

<a id="roadmap-identity-and-access-management"></a>

## Identity And Access Management

| Product | FedRAMP High | DoD IL4 | DoD IL5 WI | DoD IL6 (Azure Secret) |
| :--- | :---: | :---: | :---: | :---: |
| **Azure Dedicated HSM** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| **Azure Information Protection** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Customer Lockbox for Microsoft Azure** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | Awaiting review |
| **Microsoft 365 Defender** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Microsoft Azure Attestation** | In progress | In progress | In progress | Awaiting review |
| **Microsoft Defender for Endpoint** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Microsoft Defender for Identity** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Microsoft Entra Domain Services** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | Awaiting review |
| **Microsoft Entra ID** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Multi-Factor Authentication | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Premium P1 | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Premium P2 | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Workload Identities | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Microsoft Graph** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |

<a id="roadmap-intelligence"></a>

## Intelligence

| Product | FedRAMP High | DoD IL4 | DoD IL5 WI | DoD IL6 (Azure Secret) |
| :--- | :---: | :---: | :---: | :---: |
| **AI builder** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress | n/a |
| **Azure Health Data Services** (group) |  |  |  |  |
| &emsp;&emsp;&emsp;Azure API for FHIR | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| **Dynamics 365 Customer Insights** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress | n/a |
| **Dynamics 365 Customer Voice** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress | n/a |
| **Microsoft Copilot Studio** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | Awaiting review | n/a |
| **Microsoft Foundry** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Azure Custom Vision | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| &emsp;&emsp;&emsp;Azure Document Intelligence | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | Awaiting review |
| &emsp;&emsp;&emsp;Azure Language | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | Awaiting review |
| &emsp;&emsp;&emsp;Azure Machine Learning | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress |
| &emsp;&emsp;&emsp;Azure Speech | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Azure Translator | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Azure Vision | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Azure Vision - Face | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | Awaiting review |
| &emsp;&emsp;&emsp;Content Safety | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress |
| &emsp;&emsp;&emsp;Foundry Agent Service | In progress | In progress | In progress | In progress |
| &emsp;&emsp;&emsp;Foundry Models | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress |

<a id="roadmap-management"></a>

## Management

| Product | FedRAMP High | DoD IL4 | DoD IL5 WI | DoD IL6 (Azure Secret) |
| :--- | :---: | :---: | :---: | :---: |
| **Automation** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Change Tracking | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Azure Advisor** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Azure Arc enabled Kubernetes** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress |
| **Azure Arc Enabled Servers** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress |
| **Azure Arc-Enabled SQL Server** | :::image type="icon" source="media/check-mark.svg" border="false"::: | Awaiting review | Awaiting review | In progress |
| **Azure Automanage Machine Configuration** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress |
| **Azure Cloud HSM** | In progress | In progress | In progress | In progress |
| **Azure Data Transfer** | In progress | In progress | In progress | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Batch Transfer \| Commercial to USSec |  |  |  | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Batch Transfer \| Fairfax to USSec |  |  |  | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Batch Transfer \| Intra Domain USSec |  |  |  | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Batch Transfer \| USSec to Fairfax |  |  |  | In progress |
| &emsp;&emsp;&emsp;Messaging Transfer \| Commercial to USSec |  |  |  | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Messaging Transfer \| Fairfax to USSec |  |  |  | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Messaging Transfer \| Intra Domain USSec |  |  |  | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Messaging Transfer \| USSec to Fairfax |  |  |  | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Streaming Transfer \| Fairfax to USSec |  |  |  | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Azure Enclave** | Awaiting review | In progress | In progress | Awaiting review |
| **Azure Grafana Service** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress | In progress |
| **Azure Lighthouse** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Azure Local** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress |
| **Azure Managed Applications** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| **Azure Maps** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| **Azure Policy** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Azure Resource Bridge** | In progress | In progress | In progress | In progress |
| **Azure Resource Graph** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Azure Resource Manager** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Azure Route Server** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | Awaiting review |
| **Azure Signup Portal** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress |
| **Azure Stack Edge** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Azure Data Box Gateway | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress | In progress | n/a |
| &emsp;&emsp;&emsp;Azure Stack Edge | In progress | In progress | In progress | n/a |
| &emsp;&emsp;&emsp;Azure Stack Edge Pro 2 | In progress | In progress | In progress | n/a |
| &emsp;&emsp;&emsp;Azure Stack Edge Ruggedized | In progress | In progress | In progress | In progress |
| **Azure Storage Mover** | In progress | In progress | In progress | In progress |
| **Azure Virtual Desktop** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Azure VM Image Builder** | In progress | In progress | In progress | In progress |
| **Chat for Dynamics 365** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress | n/a |
| **Cloud Shell** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Cost Management** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress |
| **Dataverse** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Dynamics 365 Commerce** | In progress | In progress | In progress | n/a |
| **Dynamics 365 Contact Center** | :::image type="icon" source="media/check-mark.svg" border="false"::: | Awaiting review | In progress | n/a |
| **Dynamics 365 Finance** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress | n/a |
| **Dynamics 365 Project Operations** | :::image type="icon" source="media/check-mark.svg" border="false"::: | Awaiting review | Awaiting review | n/a |
| **Dynamics 365 Supply Chain Management** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress | n/a |
| **GitHub - GHAE** | In progress | In progress | In progress | n/a |
| **IoT Hub** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| &emsp;&emsp;&emsp;IoT Hub Device Provisioning Service | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| **IP Services** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Azure Public IP Address Basic | In progress | In progress | In progress | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Azure Public IP Address Standard | In progress | In progress | In progress | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Azure Public IP Prefix | In progress | In progress | In progress | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Key Vault** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Azure Key Vault Managed HSM | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress |
| &emsp;&emsp;&emsp;Premium | In progress | In progress | In progress | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Microsoft Defender for Cloud** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Microsoft Defender for Cloud Apps** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| **Microsoft Defender for IoT** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| **Microsoft Fabric** | Awaiting review | In progress | In progress | In progress |
| **Microsoft Purview Compliance** | In progress | In progress | In progress | n/a |
| **Microsoft Secure Score** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| **Microsoft Sentinel** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Network Watcher** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Traffic Analytics | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Nomination Portal** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress | n/a |
| **Planned Maintenance** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress |
| **Quota+ Usage blade** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress |
| **Resource Move** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| **SQL Server on Azure Virtual Machines** | :::image type="icon" source="media/check-mark.svg" border="false"::: | Awaiting review | Awaiting review | Awaiting review |
| **VPN Gateway** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **WSUS as a Service** | n/a | n/a | n/a | In progress |

<a id="roadmap-media-and-cdn"></a>

## Media And CDN

| Product | FedRAMP High | DoD IL4 | DoD IL5 WI | DoD IL6 (Azure Secret) |
| :--- | :---: | :---: | :---: | :---: |
| **Content Delivery Network** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Dynamics 365 Guides** | In progress | In progress | In progress | n/a |
| **Media Services** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| &emsp;&emsp;&emsp;Video Indexer | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| **Microsoft Stream** | In progress | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress |

<a id="roadmap-networking"></a>

## Networking

| Product | FedRAMP High | DoD IL4 | DoD IL5 WI | DoD IL6 (Azure Secret) |
| :--- | :---: | :---: | :---: | :---: |
| **Application Gateway** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Application Gateway v2 | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Azure Bastion** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Azure DDoS Protection** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | Awaiting review |
| **Azure DNS** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Azure DNS Private Resolver | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress | In progress | Awaiting review |
| &emsp;&emsp;&emsp;Azure DNS Private Zones | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Azure DNS Public Zones | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress |
| **Azure Firewall Manager** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | Awaiting review |
| **Azure Front Door** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Azure Front Door Premium | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress |
| &emsp;&emsp;&emsp;Azure Front Door Standard | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress |
| **Azure Load Balancer** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Standard | In progress | In progress | In progress | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Azure Private Link** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Azure Web Application Firewall** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress |
| **Bandwidth** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **ExpressRoute** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;ExpressRoute Gateways | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Traffic Manager** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Virtual Network** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Global Vnet Peering | In progress | In progress | In progress | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Virtual Network Peering | In progress | In progress | In progress | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Virtual Network NAT** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | Awaiting review |
| **Virtual WAN** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;ExpressRoute | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Point-to-Site VPN Gateway | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Site-to-Site VPN Gateway | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |

<a id="roadmap-web-and-mobile"></a>

## Web And Mobile

| Product | FedRAMP High | DoD IL4 | DoD IL5 WI | DoD IL6 (Azure Secret) |
| :--- | :---: | :---: | :---: | :---: |
| **API Management** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **App Service** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;App Service Environments | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;App Service Environments \| App Service Environments v3 | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;App Service Free | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;App Service Free \| Web App | In progress | In progress | In progress | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;App Service Linux | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;App Service Premium v3 | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;App Service Premium v3 \| Windows Containers | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Web App for Containers | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Dynamics 365 Field Service** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress | n/a |
| **Event Grid** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Functions** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Consumption Plan | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Consumption Plan Linux | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress |
| &emsp;&emsp;&emsp;Dedicated Plan | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Dedicated Plan Linux | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Premium Plan | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Premium Plan Linux | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| **Logic Apps (Consumption)** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Azure Logic Apps Standard | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: |
| &emsp;&emsp;&emsp;Logic Apps Integration Service Environment | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| **Notification Hubs** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | n/a |
| **Power Pages** | :::image type="icon" source="media/check-mark.svg" border="false"::: | :::image type="icon" source="media/check-mark.svg" border="false"::: | In progress | In progress |

## Related content

- [Azure Government overview](./documentation-government-welcome.md)
- [Azure Government compliance](./documentation-government-plan-compliance.md)
- [Azure and other Microsoft services compliance offerings](/azure/compliance/offerings/)
- [Compare Azure Government and global Azure](./compare-azure-government-global-azure.md)
- [Azure guidance for secure isolation](./azure-secure-isolation-guidance.md)
- [Azure Government isolation guidelines for Impact Level 5 workloads](./documentation-government-impact-level-5.md)
- [Azure Government DoD overview](./documentation-government-overview-dod.md)
- [Azure security fundamentals documentation](../security/fundamentals/index.yml)
- [Azure Policy regulatory compliance built-in initiatives](/azure/governance/policy/samples/index#regulatory-compliance)
