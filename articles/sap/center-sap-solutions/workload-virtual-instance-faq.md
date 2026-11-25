---
title: Workload virtual instance FAQ - Azure Workload Center for SAP
description: Find answers about Azure Workload Center for SAP, covering supported architectures, regions, onboarding, and workload health. Explore the FAQs now.
ms.date: 11/06/2026
ms.topic: faq
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.author: vaidehikher
ms.reviewer: mattmcinnes
ms.custom: references_regions
---

# FAQs

This article answers frequently asked questions about supported architectures, regions, onboarding, workload health, and Azure Copilot Run SAP agent.

## General

### What SAP architectures are supported?

Azure Workload Center for SAP supports the following architecture types:

- Distributed high availability (HA)

- Distributed non-high availability (non-HA)

- Scale-out systems

- Standalone Web Dispatcher

You can't change the architecture type after you create the workload virtual instance (WVI).

### Which Azure regions are supported?

You can currently create WVIs in the following regions:

- Australia East

- Central US

- East US

- East US 2

- Germany West Central

- Italy North

- Japan East

- Korea Central

- North Europe

- South Central US

- West Europe

You can onboard workloads running in other Azure regions within the supported US, Europe, Australia, or Asia geographies. You create the WVI in a supported Azure Workload Center for SAP region within the corresponding geography.

### Does the WVI need to be in the same region as the SAP resources?

No. The WVI is a logical representation of the SAP system. The SAP resources can be located in another Azure region within the supported geography.

Onboarding doesn't move or modify the location of the underlying SAP resources.

### What types of SAP systems can I onboard?

You can onboard SAP systems with the following architecture types: distributed high availability (HA), distributed non-HA, scale-out, and standalone Web Dispatcher. API-based discovery is supported for ABAP/NetWeaver systems. For Java and PI/PO systems, use Azure Resource Graph query-based discovery or manual resource mapping.

### Does Workload Virtual Instance require extensions to be installed?

No. Workload Virtual Instance (WVI) doesn't require extensions. Capabilities such as configuration validation, workload health observability, and Azure Copilot Run SAP agent are built on the workload context in the WVI.

### What are the known limitations during preview?

- The WVI experience is in preview and is intended for non-production SAP environments.

- API-based discovery isn't supported for Java and PI/PO systems.

- Azure Copilot Run SAP agent impact analysis is scoped to Azure Virtual Machines, returns results only for events in the last 30 days, and might select only the first three regions when WVIs span more than three regions.

### Is there a cost to use Azure Workload Center for SAP?

There's no additional cost for using Azure Workload Center for SAP. Azure Monitor health models created when you onboard a workload as a WVI are exempt from billing during preview. Charges for the underlying Azure resources of your SAP system, such as virtual machines and storage, continue to apply as usual.

## Onboarding and discovery

### Which SAP systems support API-based discovery?

API-based discovery is supported for SAP systems running on the ABAP/NetWeaver stack.

API-based discovery isn't currently supported for Java stack or PI/PO systems. Use another supported resource association method for these systems.

### Can I add or change resources after onboarding?

Yes. You can add workload components and, for supported resource association methods, update the Azure resources associated with a component.

You can't manually edit resource mappings created through API-based discovery.

For complete workload coverage, keep the resources associated with the WVI aligned with the resources that make up your SAP system.

## Workload health

### Is the Azure Monitor health model always created in the same region as the WVI?

No. The Azure Monitor health model region is determined by the region where the WVI is created.

| **WVI region**       | **Azure Monitor health model region** |
|----------------------|---------------------------------------|
| Central US           | Central US                            |
| East US              | Central US                            |
| East US 2            | Central US                            |
| South Central US     | Central US                            |
| Italy North          | Italy North                           |
| North Europe         | North Europe                          |
| West Europe          | West Europe                           |
| Germany West Central | Germany West Central                  |
| Korea Central        | Japan West                            |
| Japan East           | Japan West                            |
| Australia East       | Australia East                        |

The health model can be created in a different region because Azure Monitor health model availability doesn't correspond one-to-one with WVI region availability.

### What happens to workload health when I add or remove resources?

Supported changes to workload components and associated resources are synchronized with the Azure Monitor health model.

When the workload representation changes, the corresponding health model entities are updated. Supported customizations to health and signal definitions are preserved during synchronization.

## Configuration validation

### Do I need to enable configuration validation separately?

No. Configuration validation runs automatically after a workload is successfully onboarded and the required permissions are available.

The system currently evaluates configuration checks hourly.

### Does configuration validation automatically fix configuration deviations?

No. Configuration validation identifies deviations and provides information and guidance to help you investigate and remediate them. It doesn't automatically change the configuration of your SAP system or Azure resources.

## Azure Copilot Run SAP agent

### What scenarios does Azure Copilot Run SAP agent support?

Run SAP agent supports natural-language experiences for key SAP workload scenarios, including:

- Configuration drift analysis and remediation guidance

- Configuration retrieval

- Impact analysis for supported Azure platform impacts

Your SAP workload must be onboarded as a WVI, and you must have access to Azure Copilot and the resources that you want to investigate.

### Does Run SAP agent make changes to my SAP system automatically?

No. Configuration retrieval is read-only, and generated remediation guidance or scripts aren't automatically executed against your environment.

Review generated remediation actions before applying changes to your SAP workload.
