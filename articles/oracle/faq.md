---
title: FAQ for Azure Workload Center for Oracle
description: Get answers to frequently asked questions about Azure Workload Center for Oracle.
author: teja-san
ms.author: tsankranthi
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: concept-article
ms.custom: references_regions
ms.date: 11/06/2026
ai-usage: ai-assisted
---
# FAQ for Azure Workload Center for Oracle

This article answers common questions about Azure Workload Center for Oracle, including supported regions, enrollment, workload health, configuration validation, and Azure Copilot Run Oracle Agent.

## General

### Which Azure regions are supported?

You can create WVIs in these regions: Australia East, Central US, East US, East US 2, Germany West Central, Italy North, Japan East, Korea Central, North Europe, South Central US, and West Europe.

### Does the WVI need to be in the same region as the Oracle resources?

No. The *Workload Virtual Instance (WVI)* is a logical representation of the Oracle system. The Oracle resources can be in another Azure region. Enrollment doesn't move or change the underlying resources.

### What is the difference between Oracle AI Database@Azure and Oracle on Azure VMs?

With Oracle AI Database@Azure, Oracle runs and manages the database service, such as Exadata or Autonomous AI Database, in Azure datacenters. With Oracle on Azure virtual machines (VMs), you install and manage the Oracle database yourself on Azure VMs. You select the option on the **Workload details** tab during enrollment.

## Enrollment and discovery

### Can I add or change resources after enrollment?

Yes. You can add components and add or remove the resources of a component. For the steps, see [Manage an Oracle workload](manage-oracle-workload-virtual.md).

### Can I add Oracle CDBs and PDBs to a WVI?

Yes. Add them to the Database Services component that contains the Exadata VM cluster. Select them with **Select database resources** in the **Add Component** pane or add them by resource ID in **Additional resources**. Workload health then shows each CDB and PDB under the component.

## Workload health

### Is the health model created in the same region as the WVI?

Not always. For the mapping, see [Region mapping](workload-health-observability.md#region-mapping).

### What happens to workload health when I add or remove resources?

The health model changes with the WVI. Your changes to health and signal definitions stay in place.

## Configuration validation

### Do I need to enable configuration validation separately?

No. It starts automatically after you enroll an Oracle system, when the required permissions are in place.

### Does configuration validation fix deviations automatically?

No. It finds deviations and gives the steps to fix them. It doesn't change your Oracle system or Azure resources.

## Azure Copilot Run Oracle Agent

### Does the agent change my Oracle system?

No. The agent reads data and gives guidance. You review and apply any change yourself.

### Why does Copilot give a general answer about my Oracle workload?

Copilot answers with workload context only when you select **Run Oracle** under **Agents**. Select **Run Oracle** and ask again.
