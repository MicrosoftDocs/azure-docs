---
title: Relocation guidance for Microsoft Defender for Cloud
description: Learn how to relocate Microsoft Defender for Cloud to a new region
author: anaharris-ms
ms.author: anaharris
ms.date: 01/18/2024
ms.service: defender-for-cloud
ms.topic: how-to
---

# Relocation guidance for Microsoft Defender for Cloud

Microsoft Defender for Cloud is an environment-based management feature of Azure. As such, Defender is not region specific. Moving region specific services to another region may or may not have implications on their connectivity or functionality with Microsoft Defender for Cloud. This article covers all the aspects of this scenario.

## Prerequisites

- If there is a subscription change in the new region, [enable Defender for Cloud on the new subscription](/azure/defender-for-cloud/connect-azure-subscription).


## Relocation

To relocate Azure Storage account to a new region, you must reconfigure Sentinel to the relocated Log Analytics Workspace, Workbooks, and Data Connectors at target. 

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

### Validate relocation

Once the relocation is complete, Sentinel needs to be tested and validated. Below are some of the recommended guidelines.

- Run manual or automated smoke and integration tests to ensure that configurations and dependent resources have been properly linked, and that configured data is accessible.

- Test Sentinel components and integration.