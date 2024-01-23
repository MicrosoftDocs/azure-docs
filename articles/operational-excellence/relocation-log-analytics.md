---
title: Relocation guidance for Azure Monitor - Log Analytics Workspace
description: Learn how to relocate an Azure Monitor - Log Analytics Workspace to a new region
author: anaharris-ms
ms.author: anaharris
ms.reviewer: anaharris
ms.date: 01/23/2024
ms.service: azure-monitor
ms.subservice: logs
ms.topic: how-to
---

# Relocation guidance for Azure Monitor - Log Analytics Workspace

This article covers relocation guidance for Azure Monitor - Log Analytics Workspace across regions.

### Prerequisites

- Validate the Azure subscription resource creation permission to deploy Log Analytics workspaces in the target region. Also, check to see if there's any Azure policy region restriction.
- Landing Zone has been deployed as per assessed architecture.
- Collect all Log Analytics workspace dependent resources. Below is a list of some of the Log Analytics Workspace dependent resources:

    - [Virtual Network, Network Security Groups, and Route Tables](./relocation-virtual-network.md)
    - [Azure Key Vault](./relocation-key-vault.md)
    - [Azure Automation Account](./relocation-automation.md)
    - [Storage Account](./relocation-storage-account.md)
    - [Azure Event Hub]()
    - [Azure Sentinel](./relocation-sentinel.md)
    - [Microsoft Defender for Cloud (Azure Security Center)](./relocation-defender.md)


### Redeploy your Log Analytics Workspace

In a Landing Zone deployment, many resources depend on Azure Log Analytics Workspace for data logging. When planning for the relocation of the Landing Zone, prioritization sequencing is extremely important. Planning should consider that you must relocated any resources that log data with Log Analytics Workspace as soon as Log Analytics has completed its move. 

Log Analytics Workspace doesn't natively support migrating workspace data from one region to another and associated devices. A new Log Analytics Workspace is relocated in the desired region and then the devices and settings are reconfigured. 

In the below architectural pattern for Log Analytics Workspace the cold standby is depicted by the red flow lines which comprises of redeployment of the target instance along with data movement and updating domains and endpoints.