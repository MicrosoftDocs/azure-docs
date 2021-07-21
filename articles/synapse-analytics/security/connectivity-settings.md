---
title: Azure Synapse connectivity settings
description: An article that teaches you to configure connectivity settings in Azure Synapse Analytics 
author: RonyMSFT 
ms.service: synapse-analytics 
ms.topic: overview
ms.subservice: security 
ms.date: 07/20/2021 
ms.author: ronytho 
ms.reviewer: jrasnick, wiassaf
---

# Azure Synapse Analytics connectivity settings

This article will explain connectivity settings in Azure Synapse Analytics and how to configure them where applicable.

## Public network access 

Public network access allows you to control the incoming public network connectivity to your Synapse workspace. 

- When public network access is **disabled**, you can connect to your workspace using only [private endpoints](synapse-workspace-managed-private-endpoints.md). 
- When public network access is **enabled**, you can connect to your workspace also from public networks. You can manage this feature both during and after your workspace creation.

> [!Important]
> These settings only apply to Synapse workspaces associated with Managed VNet.

Selecting the **Disable** option will not apply any firewall rules that you may configure. Additionally, your firewall rules will appear grayed out in the Network setting in Synapse portal. And it will be reapplied if you enable Public network access again. 

> [!Tip]
> When you revert to enable, allow some time before editing the firewall rules.

### Configure public network access when you create your workspace

1.    Select the **Networking** tab when you create your workspace in [Azure portal](https://aka.ms/azureportal).
2.    Under Managed virtual network, select Enable to associate your workspace with Managed virtual network and permit Public network access. 

    :::image type="content" source="./media/connectivity-settings/create-synapse-workspace-managed-virtual-network-1.png" alt-text="Create Synapse workspace, networking tab, Managed virtual network setting" lightbox="media/connectivity-settings/create-synapse-workspace-managed-virtual-network-1.png":::

3.    Under **Public network access**, select **Disabled** to deny public access to your workspace. Select **Enable** if you want to allow public access to your workspace.

    :::image type="content" source="./media/connectivity-settings/create-synapse-workspace-public-network-access-2.png" alt-text="Create Synapse workspace, networking tab, public network access setting" lightbox="media/connectivity-settings/create-synapse-workspace-public-network-access-2.png"::: 

4.    Complete the rest of the workspace creation flow.

### Configure public network access after you create your workspace

1.    Select your Synapse workspace in [Azure portal](https://aka.ms/azureportal).
2.    Select **Networking** from the left navigation.
3.    Select **Disabled** to deny public access to your workspace. Select **Enable** if you want to allow public access to your workspace.

    :::image type="content" source="./media/connectivity-settings/synapse-workspace-networking-public-network-access-3.png" alt-text="In an existing Synapse workspace, networking tab, public network access setting is enabled" lightbox="media/connectivity-settings/synapse-workspace-networking-public-network-access-3.png"::: 

4.    When disabled, the **Firewall rules** gray out to indicate that firewall rules are not in effect. Firewall rule configurations will be retained. 

    :::image type="content" source="./media/connectivity-settings/synapse-workspace-networking-firewall-rules-4.png" alt-text="In an existing Synapse workspace, networking tab, public network access setting is disabled, attention to the firewall rules" lightbox="media/connectivity-settings/synapse-workspace-networking-firewall-rules-4.png"::: 
 
5.    Select **Save** to save the change. A notification will confirm that the network setting was successfully saved.

## Connection policy
The connection policy for Synapse SQL in Azure Synapse Analytics is set to *Default*. You cannot change this in Azure Synapse Analytics. You can learn more about how that affects connections to Synapse SQL in Azure Synapse Analytics [here](../../azure-sql/database/connectivity-architecture.md#connection-policy). 

## Minimal TLS version
Synapse SQL in Azure Synapse Analytics allows connections using all TLS versions. You cannot set the minimal TLS version for Synapse SQL in Azure Synapse Analytics.

## Next steps

Create an [Azure Synapse Workspace](./synapse-workspace-ip-firewall.md)