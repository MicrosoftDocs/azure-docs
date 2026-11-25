---
title: Resource discovery and mapping - Azure Workload Center for SAP
description: Discovery and resource association builds workload context for SAP systems in Azure Workload Center. Learn how it works.
ms.date: 11/06/2026
ms.topic: concept-article
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
author: vaidehikher18
ms.author: vaidehikher
ms.reviewer: mattmcinnes
---

# Discovery and resource association in Azure Workload Center for SAP

Azure Workload Center for SAP uses information about your SAP system, its functional components, and their underlying Azure resources to build workload context.

This article explains how Azure Workload Center for SAP establishes that context through discovery and resource association, and how it uses the context across its capabilities.

When you onboard an SAP system, Azure Workload Center for SAP creates a workload virtual instance (WVI) and establishes the relationships between the SAP system, its workload components, and the Azure resources that support them.

A workload component represents a functional part of the SAP system, such as:

- Central Services

- Application servers

- Database servers

- Web Dispatchers

Azure compute, networking, storage, and other supported resources are associated with the appropriate workload components.

These associations provide the context needed to understand not only that an Azure resource exists, but **which SAP system it belongs to and what role it plays within that system**.

## How resource associations are established

You can establish resource associations in different ways, depending on the SAP system and the discovery method you select during onboarding:

- **API-based discovery** identifies the SAP system, components, and associated resources by using SAP Host Control APIs.

- **Azure Resource Graph query-based discovery** uses discovery rules defined for individual workload components to identify their associated Azure resources.

- **Manual resource mapping** lets you explicitly define components and select the Azure resources associated with them.

The discovery method also determines how resource associations are maintained after onboarding. For example, Azure Resource Graph discovery rules are periodically reevaluated so that resources entering or leaving the discovery scope can be reflected in the workload representation. You explicitly maintain manually mapped resources.

For accurate workload context, keep the components and resource associations aligned with the actual SAP environment.

For information about selecting and configuring a discovery method, see [Onboard an SAP system to Azure Workload Center for SAP](onboard-sap-system-as-workload-virtual-instance.md).

## How workload context is used

After you establish the relationships between the SAP system, workload components, and Azure resources, Azure Workload Center for SAP uses this context across its management and operational capabilities.

## Maintaining workload context

SAP environments can change after onboarding. You might add or remove components, change infrastructure, or need to associate resources differently.

Resource associations in the workload virtual instance (WVI) can change as the underlying SAP system changes. How these changes are reflected in WVI depends on the discovery method used for the component:

- **API-based discovery:** Discovery runs every hour and automatically updates WVI to reflect the current SAP system and its associated resources.

- **Azure Resource Graph query-based discovery:** The discovery rules you define during onboarding rerun every hour. WVI components and resource mappings update based on the latest resources that match those rules.

- **Manual resource mapping:** Changes aren't detected automatically. Keep the WVI resource mappings aligned with the actual SAP system when you add, remove, or change resources. This practice helps ensure that capabilities that rely on WVI context continue to operate against the appropriate components and resources.

For information about adding, updating, or removing components and resource associations, see [Manage an SAP workload](manage-sap-workload.md).
