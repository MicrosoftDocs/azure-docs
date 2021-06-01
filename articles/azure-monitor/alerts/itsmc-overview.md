---
title: IT Service Management Connector overview
description: This article provides an overview of IT Service Management Connector (ITSMC).
ms.topic: conceptual
author: nolavime
ms.author: v-jysur
ms.date: 12/16/2020
ms.custom: references_regions

---

# IT Service Management Connector Overview

:::image type="icon" source="media/itsmc-overview/itsmc-symbol.png":::

IT Service Management Connector (ITSMC) allows you to connect Azure to a supported IT Service Management (ITSM) product or service.

Azure services like Azure Log Analytics and Azure Monitor provide tools to detect, analyze, and troubleshoot problems with your Azure and non-Azure resources. But the work items related to an issue typically reside in an ITSM product or service. ITSMC provides a bi-directional connection between Azure and ITSM tools to help you resolve issues faster.

## Configuration steps

ITSMC supports connections with the following ITSM tools:

-	ServiceNow
-	System Center Service Manager
-	Provance
-	Cherwell

   >[!NOTE]
> As of 1-Oct-2020 Cherwell and Provance ITSM integrations with Azure Alert will no longer be enabled for new customers. New ITSM Connections will not be supported.
> Existing ITSM connections will be supported.

With ITSMC, you can:

-  Create work items in your ITSM tool, based on your Azure alerts (Metric Alerts, Activity Log Alerts, and Log Analytics alerts).
-  Optionally, you can sync your incident and change request data from your ITSM tool to an Azure Log Analytics workspace.

For information about legal terms and the privacy policy, see [Microsoft Privacy Statement](https://go.microsoft.com/fwLink/?LinkID=522330&clcid=0x9).

You can start using ITSMC by completing the following steps:

1. [Setup your ITSM Environment to accept alerts from Azure.](./itsmc-connections.md)
1. [Configure Azure ITSM Solution](./itsmc-definition.md#add-it-service-management-connector)
1. [Configure Azure ITSM connector for your ITSM environment.](./itsmc-definition.md#create-an-itsm-connection)
1. [Configure Action Group to leverage ITSM connector.](./itsmc-definition.md#define-a-template)

## Next steps

* [Troubleshooting problems in ITSM Connector](./itsmc-resync-servicenow.md)
