---
title: Workload virtual instances - Azure Workload Center for SAP
description: Learn how Azure Workload Center for SAP uses Workload Virtual Instances to unify configuration, health, and troubleshooting for SAP on Azure.
ms.date: 11/06/2026
ms.topic: overview
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
author: vaidehikher18
ms.author: vaidehikher
ms.reviewer: mattmcinnes
---

# Workload virtual instance overview

A workload virtual instance (WVI) represents an SAP system, its components, and supporting Azure resources in Azure Workload Center for SAP. This article explains how that representation connects workload configuration, health, recommendations, and troubleshooting.

## What is Azure Workload Center for SAP?

Azure Workload Center for SAP is an Azure experience for managing and operating SAP workloads on Azure. It gives Azure an understanding of your SAP system as a workload, instead of requiring you to manage the underlying Azure resources individually.

When you onboard an existing SAP system, Azure Workload Center for SAP creates a workload virtual instance (WVI) that represents the SAP system, its components, and the Azure resources on which it runs.

This workload-level representation provides the context needed to bring together configuration management, health monitoring, recommendations, and AI-assisted troubleshooting for SAP workloads.

## Benefits of Azure Workload Center for SAP

Azure Workload Center for SAP helps simplify the ongoing management and operation of SAP systems on Azure.

With Azure Workload Center for SAP, you can:

- **Simplify SAP system management:** Work from a unified view of your SAP system, its components, and supporting Azure resources instead of piecing together individual infrastructure views.

- **Address configuration deviations before they become operational problems:** Identify deviations from Azure and SAP on Azure recommended practices, including configuration drift, so you can address risks proactively.

- **Detect and triage health issues faster:** Understand when workload health changes and which components are affected so you can decide where to investigate first.

- **Reduce investigation effort:** Use workload dependencies and health signals to understand the impact of an issue without manually piecing together SAP component and Azure resource context.

- **Move from findings to informed action:** Ask natural-language questions to understand configuration changes, check current settings, and get workload-aware remediation guidance while retaining control over when and where you execute changes.

## What is a Workload Virtual Instance?

> [!IMPORTANT]
> The Workload Virtual Instance is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

A Workload Virtual Instance (WVI) is a logical representation of an SAP system running on Azure.

A WVI brings together the SAP system's workload components, such as central services, application servers, database servers, and web dispatchers, with the Azure compute, storage, and networking resources that support them.

Instead of viewing these Azure resources as independent infrastructure, the WVI captures how the resources relate to the SAP system and the role they play within the workload.

This workload context allows Azure Workload Center for SAP to understand the SAP system as a whole and provide workload-aware management experiences.

:::image type="content" source="media/workload-virtual-instance-overview/workload-virtual-instance-hierarchy-diagram.png" alt-text="Diagram of Workload Virtual Instance as top-level system representation connecting different components, alongside Azure resources such as Compute, Storage, and Networking resources." lightbox="media/workload-virtual-instance-overview/workload-virtual-instance-hierarchy-diagram.png":::

## What does a Workload Virtual Instance enable?

After you represent an SAP system as a WVI, Azure Workload Center for SAP can use the workload topology and context to provide capabilities across the operational lifecycle.

**Configuration validation**

Continuously evaluate your SAP workload against Azure and SAP on Azure recommended practices. Identify configuration deviations, understand their impact, and get guidance to help resolve them.

**Workload health and observability**

Monitor the health of your SAP system, workload components, and underlying resources. Workload-level context helps identify where degradation originates and understand its impact on the overall system.

**Workload-aware recommendations**

View relevant Azure Advisor recommendations in the context of your SAP workload so you can understand which workload components are affected and prioritize actions accordingly.

**AI-assisted investigation and troubleshooting**

Use the Run SAP agent within Azure Copilot to ask natural-language questions about your workloads. Investigate configuration issues, retrieve and compare configuration values, understand workload degradation, and get workload-aware remediation guidance.

**Impact analysis**

Correlate Azure platform signals with the SAP workload topology to understand which workload components and systems are affected by an infrastructure issue and accelerate root-cause investigation.

### Next steps

- [Onboard an SAP system to Azure Workload Center for SAP](onboard-sap-system-as-workload-virtual-instance.md).

- [Learn more about workload virtual instances](#what-is-a-workload-virtual-instance).

- [Review configuration validation for SAP workloads](get-started-configuration-validation.md).

- [Monitor SAP workload health](view-workload-virtual-instance-health.md).

- [Explore the Azure Copilot Run SAP agent](run-sap-agent.md).
