---
title: Discovery and resource association
titleSuffix: Azure Workload Center for Oracle
description: Learn how Azure Workload Center for Oracle builds workload context through discovery and resource association.
author: teja-san
ms.author: tsankranthi
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: concept-article
ms.date: 11/06/2026
ai-usage: ai-assisted
---
# Discovery and resource association

Azure Workload Center for Oracle uses information about your Oracle system, its components, and their Azure resources to build workload context. This article explains how the context is built through discovery and resource association, and how each capability uses it.

When you enroll an Oracle system, Azure Workload Center for Oracle creates a *Workload Virtual Instance (WVI)*. The WVI records which Oracle system each Azure resource belongs to and what role the resource plays in that system.

## Workload components

A workload component groups the Azure resources that do one job in the Oracle system. When you enroll a system, you select a component type and a component role for each component.

| **Component type**          | **What it contains**                        | **Example**                                                                         |
|-----------------------------|---------------------------------------------|-------------------------------------------------------------------------------------|
| Application Services        | Compute and storage of the application tier | VMs that run Oracle E-Business Suite                                                |
| Application Networking      | Network resources of the application tier   | Application tier virtual network, load balancer                                     |
| Database Services           | The Oracle database resources               | Exadata infrastructure, Exadata VM cluster, CDB, PDB, Oracle Autonomous AI Database |
| Database Networking         | Network resources of the database tier      | Database virtual network, private DNS zone                                          |
| Data and Analytics Services | Analytics resources that use the database   | Microsoft Fabric capacity                                                           |
| AI Services                 | AI resources that use the data              | Azure AI Search                                                                     |

The component role describes the job of a component more precisely. A Database Services component can have the role **Oracle Database Service on Azure**, **Data Guard Observer VM**, **Far Sync VM**, or **GoldenGate on Azure Compute**. Other component types use the role **Default**.

## Oracle database resources in a Database Services component

The resources in a Database Services component depend on how the Oracle database runs.

**Oracle Exadata Database Service on Dedicated Infrastructure**

An Exadata system is built from several related Azure resources:

- **Oracle Exadata infrastructure**: the dedicated Exadata hardware, with its database servers and storage servers

- **Oracle Exadata VM cluster**: a group of virtual machines (VMs) that run on the Exadata infrastructure and host the Oracle databases. Each VM in the cluster is a **DB node**

- **Container database (CDB)**: an Oracle database that runs on the VM cluster and holds one or more pluggable databases

- **Pluggable database (PDB)**: a database inside a CDB. Applications usually connect to a PDB

Add the Exadata infrastructure, the VM cluster, and its DB nodes to the Database Services component. You can also add the CDBs and PDBs of the cluster.

Workload health then shows each CDB and PDB as its own entity under the VM cluster.

**Oracle Autonomous AI Database**

An Autonomous AI Database is one Azure resource. Add it to the Database Services component.

**Oracle on Azure VMs**

When the Oracle database runs on Azure VMs, add the database VMs to the Database Services component.

## How resource associations are established

You map Azure resources to each workload component in one of two ways:

- **Azure Resource Graph (ARG) query-based discovery**: Azure Resource Graph is the Azure service that queries resources across subscriptions. You define discovery rules for each component. The rules find the resources that match conditions that you set, such as resource group, type, name, or tag.

- **Manual resource mapping**: You select the resources for each component from a list.

With both methods, you can also add a resource by its resource ID. Use this method for resources (proxy) that the WVI supports but don't show in the list.

## How workload context is used

**Configuration validation** uses the WVI to decide which checks apply to each resource. It links each deviation to the component and resource that it affects.

**Workload health observability** uses the WVI hierarchy to build an Azure Monitor health model. The health model calculates the health of each resource and rolls it up to the components and to the WVI.

**Azure Copilot "Run Oracle" Agent** uses the WVI to answer questions about your Oracle system. It uses the relationships between components and resources for configuration deviation analysis and impact analysis.

## Maintaining workload context

Oracle environments change after enrollment. You might add a database, move an application VM, or retire a component. How the WVI reflects these changes depends on the method that you used for the component:

- **Azure Resource Graph (ARG) query-based discovery**: The discovery rules run again every hour. The WVI is updated with the resources that match the rules.

- **Manual resource mapping**: Changes aren't detected automatically. Update the WVI when you add, remove, or change resources, so that configuration validation and workload health cover the right resources.

- **Resources added by resource ID**: The WVI keeps them until you remove them.

When the WVI changes, the health model changes with it. For the steps to add, update, or remove components, see [Manage an Oracle workload](manage-oracle-workload-virtual.md).
