---
title: Connect to a secure storage account from Azure Synapse workspace 
description: Learn how to connect to a secure storage account from your Azure Synapse workspace.
author: ashinMSFT 
ms.service: azure-synapse-analytics
ms.topic: how-to
ms.subservice: security 
ms.date: 02/05/2025 
ms.author: seshin
---

# Connect to a secure Azure storage account from a Synapse workspace

This article explains how to connect to a secure Azure storage account from your Azure Synapse workspace. You can link an Azure storage account to your Synapse workspace when you create your workspace. You can link more storage accounts after you create your workspace.

## Secured Azure storage accounts

Azure storage provides a layered security model that allows you to secure and control access to your storage accounts. You can configure IP firewall rules to grant traffic from selected public IP address ranges access to your storage account. You can also configure network rules to grant traffic from selected virtual networks access to your storage account. You can combine IP firewall rules that allow access from selected IP address ranges and network rules that grant access from selected virtual networks on the same storage account. 

These rules apply to the public endpoint of a storage account. You don't need any access rules to allow traffic from managed private endpoints created in your workspace to a storage account. Storage firewall rules can be applied to existing storage accounts, or to new storage accounts when you create them. To learn more about securing your storage account, see [Configure Azure Storage firewalls and virtual networks](../../storage/common/storage-network-security.md).

## Synapse workspaces and virtual networks

When you create a Synapse workspace, you can choose to allow a managed virtual network to be associated with it.

If you *don't* enable a managed virtual network for your workspace when you create it, your workspace is in a shared virtual network along with other Synapse workspaces that don't have a managed virtual network associated with it.

If you *do* enable managed virtual network when you create the workspace, then your workspace is associated with a dedicated virtual network managed by Azure Synapse. These virtual networks aren't created in your customer subscription. Therefore, you can't grant traffic from these virtual networks access to your secured storage account using network rules described above.  

## Access a secured storage account

Synapse operates from networks that can't be included in your network rules. Use the following steps to enable access from your workspace to your secure storage account.

1. Create an Azure Synapse workspace with a managed virtual network associated with it, and create managed private endpoints from it to the secure storage account. If you use the Azure portal to create your workspace, you can enable **Managed virtual network** under the **Networking** tab.

    :::image type="content" source="media/connect-to-a-secure-storage-account/enable-managed-virtual-network-managed-private-endpoint.png" alt-text="Screenshot that shows the Manage virtual network option under the Networking tab.":::

1. If you enable **Managed virtual network** or if Synapse determines that the primary storage account is a secure storage account, then you have the option to **Create managed private endpoint to primary storage account**, as shown. The storage account owner needs to approve the connection request to establish the private link. Alternatively, Synapse approves this connection request if the user creating an Apache Spark pool in the workspace has sufficient privileges to approve the connection request.

1. Grant your Azure Synapse workspace access to your secure storage account as a trusted Azure service. As a trusted service, Azure Synapse then uses strong authentication to securely connect to your storage account.

### Create a Synapse workspace with a managed virtual network and create managed private endpoints to your storage account

To create a Synapse workspace that has a managed virtual network associated with it, see [Azure Synapse Analytics Managed Virtual Network](./synapse-workspace-managed-vnet.md#create-an-azure-synapse-workspace-with-a-managed-workspace-virtual-network).

After the workspace with an associated managed virtual network is created, you can create a managed private endpoint to your secure storage account. To learn how, see [Create a Managed private endpoint to your data source](./how-to-create-managed-private-endpoints.md).

### Grant your Azure Synapse workspace access to your secure storage account as a trusted Azure service

Analytic capabilities such as dedicated SQL pool and serverless SQL pool use multitenant infrastructure that isn't deployed into the managed virtual network. In order for traffic from these capabilities to access the secured storage account, you must configure access to your storage account based on the workspace's system-assigned managed identity by following these steps.

1. In the Azure portal, navigate to your secured storage account and select **Networking** from the left navigation pane.

    :::image type="content" source="media/connect-to-a-secure-storage-account/secured-storage-access.png" alt-text="Screenshot of the storage account network configuration." lightbox="media/connect-to-a-secure-storage-account/secured-storage-access.png":::

1. In the **Resource instances** section, select *Microsoft.Synapse/workspaces* as the **Resource type** and enter your workspace name for **Instance name**. Select **Save**.

    You should now be able to access your secured storage account from the workspace.

## Related content

* [Azure Synapse Analytics Managed Virtual Network](./synapse-workspace-managed-vnet.md)
* [Azure Synapse Analytics managed private endpoints](./synapse-workspace-managed-private-endpoints.md)
