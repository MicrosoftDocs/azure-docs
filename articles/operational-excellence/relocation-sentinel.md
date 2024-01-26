---
title: Relocation guidance for Microsoft Sentinel
description: Learn how to relocate Microsoft Sentinel to a new region
author: anaharris-ms
ms.author: anaharris
ms.date: 01/18/2024
ms.service: microsoft-sentinel
ms.topic: how-to
ms.custom:
  - subject-relocation
---

# Relocate Microsoft Sentinel to another region

This article covers relocation guidance for Microsoft Sentinel across regions. Because Sentinel is a global resource, you don't need to move it as an instance. Instead, you must reconfigure Sentinel with the associated resources, such as Workbooks, Data Connectors, and Log Analytics Workspace, at target.

## Prerequisites

Carefully prepare and plan your Sentinel reconfiguration, before you move the related Log Analytics Workspace or  other Azure services.  

You also need to make sure to plan and prepare any compliance requirements for data collection and storage at target, as well as the Role-based access control (RBAC) model to access Microsoft Sentinel data.

>[!NOTE]
>Sentinel doesn’t connect to default workspaces that are created by Microsoft Defender for Cloud.


## Relocate

To relocate Microsoft Sentinel to a new region, you must reconfigure Sentinel to connect to the relocated Log Analytics Workspace, Workbooks, and Data Connectors at target. 

**Azure Resource Mover** doesn't support moving services used by the Microsoft Sentinel. To see which resources Resource Mover supports, see [What resources can I move across regions?](/azure/resource-mover/overview#what-resources-can-i-move-across-regions).


:::image type="content" source="media/relocation/sentinel/sentinel-pattern-design.png" alt-text="Diagram illustrating Sentinel relocation pattern.":::


>[!IMPORTANT]
>Until and unless the complete relocation is successful the source Log Analytics workspace can remain connected to Sentinel to ensure monitoring of both the source and target regions.

**To reconfigure Sentinel for relocation:**

1. Create/relocate the target Log Analytics Workspace to which Sentinel will connect.
1. Connect Sentinel to the target/relocated Log Analytics Workspace.
1. Relocate and reconfigure the workbooks to the target as per source.
1. Connect the workbooks to Sentinel.
1. Reconfigure the target data connectors as per source. 
1. Connect the connectors to Sentinel.

## Next steps

To learn more about moving resources between regions and disaster recovery in Azure, refer to:

- [Move resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md)
- [Move Azure VMs to another region](../site-recovery/azure-to-azure-tutorial-migrate.md)
