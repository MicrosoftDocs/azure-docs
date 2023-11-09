---
title: Azure Monitor SCOM Managed Instance overview
description: Azure Monitor SCOM Managed Instance allows you to maintain your investment in your existing System Center Operations Manager (SCOM) environment while moving your monitoring infrastructure into the Azure cloud.
ms.service: azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 09/28/2023

---

# Azure Monitor SCOM Managed Instance (preview)

[Azure Monitor SCOM Managed Instance (preview)](/system-center/scom/operations-manager-managed-instance-overview) allows existing customers of System Center Operations Manager (SCOM) to maintain their investment in SCOM while moving their monitoring infrastructure into the Azure cloud.

## Overview

While Azure Monitor can use the [Azure Monitor agent](../agents/agents-overview.md) to collect telemetry from a virtual machine, it isn't able to replicate the extensive monitoring provided by management packs written for SCOM, including any management packs that you might have written for your custom applications. 

You might have an eventual goal to move your monitoring completely to Azure Monitor, but you must maintain SCOM functionality until you no longer rely on management packs for monitoring your virtual machine workloads. SCOM Managed Instance (preview) is compatible with all existing management packs and provides migration from your existing on-premises SCOM infrastructure.

SCOM Managed Instance (preview) allows you to take a step toward an eventual migration to Azure Monitor. You can move your backend SCOM infrastructure into the cloud saving you the complexity of maintaining these components. Then you can manage the configuration in the Azure portal along with the rest of your Azure Monitor configuration and monitoring tasks.

:::image type="content" source="media/scom-managed-instance-overview/scom-managed-instance-architecture.png" alt-text="Diagram of SCOM Managed Instance." border="false" lightbox="media/scom-managed-instance-overview/scom-managed-instance-architecture.png":::


## Documentation
The documentation for SCOM Managed Instance (preview) is maintained with the [other documentation for System Center Operations Manager](/system-center/scom).


| Section | Articles |
|:---|:---|
| Overview | [About Azure Monitor SCOM Managed Instance (preview)](/system-center/scom/operations-manager-managed-instance-overview) |
| Get started | [Migrate from Operations Manager on-premises](/system-center/scom/migrate-to-operations-manager-managed-instance) |
| Manage | [Create an Azure Monitor SCOM Managed Instance](/system-center/scom/create-operations-manager-managed-instance)<br>[Scale Azure Monitor SCOM Managed Instance (preview)](/system-center/scom/scale-scom-managed-instance)<br>[Patch Azure Monitor SCOM Managed Instance (preview)](/system-center/scom/patch-scom-managed-instance)<br>[Create reports on Power BI](/system-center/scom/operations-manager-managed-instance-create-reports-on-power-bi)<br>[Azure Monitor SCOM Managed Instance (preview) monitoring scenarios](/system-center/scom/scom-managed-instance-monitoring-scenarios)<br>[Azure Monitor SCOM Managed Instance (preview) Agents](/system-center/scom/plan-planning-agent-deployment-scom-managed-instance)<br>[Install Windows Agent Manually Using MOMAgent.msi - Azure Monitor SCOM Managed Instance (preview)](/system-center/scom/manage-deploy-windows-agent-manually-scom-managed-instance)<br>[Connect the Azure Monitor SCOM Managed Instance (preview) to Ops console](/system-center/scom/connect-managed-instance-ops-console)<br>[Azure Monitor SCOM Managed Instance (preview) activity log](/system-center/scom/scom-mi-activity-log)<br>[Azure Monitor SCOM Managed Instance (preview) frequently asked questions](/system-center/scom/operations-manager-managed-instance-common-questions)<br>[Troubleshoot issues with Azure Monitor SCOM Managed Instance (preview)](/system-center/scom/troubleshoot-scom-managed-instance)
| Security | [Use Managed identities for Azure with Azure Monitor SCOM Managed Instance (preview)](/system-center/scom/use-managed-identities-with-scom-mi)<br>[Azure Monitor SCOM Managed Instance (preview) Data Encryption at Rest](/system-center/scom/scom-mi-data-encryption-at-rest) |

## Frequently asked questions

This section provides answers to common questions.

### What's the upgrade path from the Log Analytics agent to Azure Monitor Agent for monitoring System Center Operations Manager? Can we use Azure Monitor Agent for System Center Operations Manager scenarios?

Here's how Azure Monitor Agent affects the two System Center Operations Manager monitoring scenarios:
- **Scenario 1**: Monitoring the Windows operating system of System Center Operations Manager. The upgrade path is the same as for any other machine. You can migrate from the Microsoft Monitoring Agent (versions 2016 and 2019) to Azure Monitor Agent as soon as your required parity features are available on Azure Monitor Agent.
- **Scenario 2**: Onboarding or connecting System Center Operations Manager to Log Analytics workspaces. Use a System Center Operations Manager connector for Log Analytics/Azure Monitor. Neither the Microsoft Monitoring Agent nor Azure Monitor Agent is required to be installed on the Operations Manager management server. As a result, there's no impact to this use case from an Azure Monitor Agent perspective.  
                    
          