---
title: Configure IP firewall rules 
description: An article that teaches you to configure IP firewall rules in Azure Synapse Analytics 
author: ashinMSFT 
ms.service: synapse-analytics 
ms.topic: overview
ms.subservice: security 
ms.date: 08/15/2021 
ms.author: seshin 
ms.reviewer: wiassaf
---

# Azure Synapse Analytics IP firewall rules

This article will explain IP firewall rules and teach you how to configure them in Azure Synapse Analytics.

## IP firewall rules

IP firewall rules grant or deny access to your Synapse workspace based on the originating IP address of each request. You can configure IP firewall rules for your workspace. IP firewall rules configured at the workspace level apply to all public endpoints of the workspace (dedicated SQL pools, serverless SQL pool, and development).

## Create and manage IP firewall rules

There are two ways IP firewall rules are added to an Azure Synapse workspace. To add an IP firewall to your workspace, select **Networking** and check **Allow connections from all IP addresses** during workspace creation.

> [!Important]
> This feature is only available to Azure Synapse workspaces not associated with a Managed VNet.

:::image type="content" source="./media/synpase-workspace-ip-firewall/azure-synapse-workspace-networking-connections-all-ip-addresses.png" lightbox="./media/synpase-workspace-ip-firewall/azure-synapse-workspace-networking-connections-all-ip-addresses.png" alt-text="Screenshot that highlights the Security tab, and the 'Allow connections from all IP addresses' checkbox.":::


You can also add IP firewall rules to a Synapse workspace after the workspace is created. Select **Firewalls** under **Security** from Azure portal. To add a new IP firewall rule, give it a name, Start IP, and End IP. Select **Save** when done.

:::image type="content" source="./media/synpase-workspace-ip-firewall/azure-synapse-workspace-networking-firewalls-add-client-ip.png" lightbox="./media/synpase-workspace-ip-firewall/azure-synapse-workspace-networking-firewalls-add-client-ip.png" alt-text="Screenshot of the Networking page of a Synapse Workspace, highlighting the Add client IP button and rules fields.":::

## Connect to Synapse from your own network

You can connect to your Synapse workspace using Synapse Studio. You can also use SQL Server Management Studio (SSMS) to connect to the SQL resources (dedicated SQL pools and serverless SQL pool) in your workspace.

Make sure that the firewall on your network and local computer allows outgoing communication on TCP ports 80, 443 and 1443 for Synapse Studio.

Also, you need to allow outgoing communication on UDP port 53 for Synapse Studio. To connect using tools such as SSMS and Power BI, you must allow outgoing communication on TCP port 1433.


## Next steps

Create an [Azure Synapse Workspace](../quickstart-create-workspace.md)

Create an Azure Synapse workspace with a [Managed workspace Virtual Network](./synapse-workspace-managed-vnet.md)