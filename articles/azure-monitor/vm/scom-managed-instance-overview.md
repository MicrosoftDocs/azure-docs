---
title: SCOM Managed Instance overview
description: 
ms.service: azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 12/15/2022

---

# Azure Monitor SCOM Managed Instance (preview)

Azure Monitor SCOM Managed Instance (preview) allows existing customers of System Center Operations Manager (SCOM) to maintain their investment in SCOM while moving their monitoring infrastructure into the cloud.

## Overview

While Azure Monitor can use the [Azure Monitor agent](../agents/agents-overview.md) to collect telemetry from a virtual machine, it isn't able to replicate the extensive monitoring provided by management packs written for SCOM, including any management packs that you may have written for your custom applications. 

You may have an eventual goal to move your monitoring completely to Azure Monitor, but you must maintain SCOM functionality until you no longer rely on management packs. SCOM Managed Instance (preview) is compatible with all existing management packs and provides migration from your existing on-premises SCOM infrastructure.

SCOM managed instance (preview) allows you to take a step toward an eventual migration to Azure Monitor. In addition to moving your backend SCOM infrastructure into the cloud saving you the complexity of maintaining these components, you can manage the configuration in the Azure portal along with the rest of your Azure Monitor configuration and monitoring tasks. 


## Documentation
The documentation for SCOM Management Instance (preview) is maintained with the [other documentation for System Center Operations Manager](/system-center/scom).

### Overview

- [About Azure Monitor SCOM Managed Instance (preview)](/system-center/scom/operations-manager-managed-instance-overview)

### Get started

- [Migrate from Operations Manager on-premises](/system-center/scom/migrate-to-operations-manager-managed-instance)


### Manage

- [Create an Azure Monitor SCOM Managed Instance](/system-center/scom/create-operations-manager-managed-instance)
- [Scale Azure Monitor SCOM Managed Instance (preview)](/system-center/scom/scale-scom-managed-instance)
- [Scale Azure Monitor SCOM Managed Instance (preview)](/system-center/scom/scale-scom-managed-instance)
- [Patch Azure Monitor SCOM Managed Instance (preview)](/system-center/scom/patch-scom-managed-instance)
- [Create reports on Power BI](/system-center/scom/operations-manager-managed-instance-create-reports-on-power-bi)
- [Azure Monitor SCOM Managed Instance (preview) monitoring scenarios](/system-center/scom/scom-managed-instance-monitoring-scenarios)
- [Azure Monitor SCOM Managed Instance (preview) Agents](/system-center/scom/plan-planning-agent-deployment-scom-managed-instance)
- [Install Windows Agent Manually Using MOMAgent.msi - Azure Monitor SCOM Managed Instance (preview)](/system-center/scom/manage-deploy-windows-agent-manually-scom-managed-instance)


- [Connect the Azure Monitor SCOM Managed Instance (preview) to Ops console](/system-center/scom/connect-managed-instance-ops-console)

- [Azure Monitor SCOM Managed Instance (preview) activity log](/system-center/scom/scom-mi-activity-log)

- [Azure Monitor SCOM Managed Instance (preview) frequently asked questions](/system-center/scom/operations-manager-managed-instance-common-questions)
- [Troubleshoot issues with Azure Monitor SCOM Managed Instance (preview)](/system-center/scom/troubleshoot-scom-managed-instance)

### Security
- [Use Managed identities for Azure with Azure Monitor SCOM Managed Instance (preview)](/system-center/scom/use-managed-identities-with-scom-mi)
- [Azure Monitor SCOM Managed Instance (preview) Data Encryption at Rest](/system-center/scom/scom-mi-data-encryption-at-rest)