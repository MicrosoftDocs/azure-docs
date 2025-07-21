---
title: Troubleshoot Connectivity Between Synapse Studio and Storage
description: Troubleshoot connectivity between Synapse Studio and storage
author: Danzhang-msft
ms.author: danzhang
ms.date: 02/27/2025
ms.service: azure-synapse-analytics
ms.subservice: troubleshooting
ms.topic: troubleshooting-problem-resolution
---

# Troubleshoot connectivity between Azure Synapse Analytics Synapse Studio and storage

In Synapse Studio, you can explore data resources located in your linked storage. This guide helps you solve connectivity issues when you're trying to access your data resources. 

## Case #1: Storage account lacks proper permissions

If your storage account lacks the proper permissions, you aren't able to expand the storage structure through "Data" --> "Linked" in Synapse Studio. See the issue symptom screenshot: 

The detailed error message might vary, but the general meaning of the error message is: "This request isn't authorized to perform this operation.".

In the linked storage node:

:::image type="content" source="media/troubleshoot-synapse-studio-and-storage-connectivity/storage-connectivity-issue-1.png" alt-text="Screenshot from the Azure portal of the permissions storage connectivity issue.":::

In the storage container node:

:::image type="content" source="media/troubleshoot-synapse-studio-and-storage-connectivity/storage-connectivity-issue-1a.png" alt-text="Screenshot from the Azure portal of the storage permissions error message." lightbox="media/troubleshoot-synapse-studio-and-storage-connectivity/storage-connectivity-issue-1a.png":::

**SOLUTION**: To assign your account to the proper role, see [Assign an Azure role for access to blob data](../../storage/blobs/assign-azure-role-data-access.md)

## Case #2: Failed to send the request to storage server

When selecting the arrow to expand the storage structure in "Data" --> "Linked" in Synapse Studio, you might see the "REQUEST_SEND_ERROR" issue in the linked storage node or the storage container node. For example, in the linked storage node:  

:::image type="content" source="media/troubleshoot-synapse-studio-and-storage-connectivity/storage-connectivity-issue-2.png" alt-text="Screenshot from the Azure portal of the REQUEST_SEND_ERROR message.":::

There might be several possible reasons behind this issue:

### The storage resource is behind a vNet and a storage private endpoint needs to configure

**SOLUTION**: In this case, you need to configure the storage private endpoint for your storage account. For how to configure the storage private endpoint for vNet, see [Connect to workspace resources from a restricted network](../security/how-to-connect-to-workspace-from-restricted-network.md).

You can use the command `nslookup <storage-account-name>.dfs.core.windows.net` to check the connectivity after the storage private endpoint is configured. It should return a string similar to: `<storage-account-name>.privatelink.dfs.core.windows.net`.

<a id="the-storage-resource-is-not-behind-a-vnet-but-the-blob-service-azure-ad-endpoint-is-not-accessible-due-to-firewall-configured"></a>

### The storage resource isn't behind a vNet but the Blob service (Microsoft Entra ID) endpoint isn't accessible due to firewall configured

**SOLUTION**: In this case, you need to open your storage account in the Azure portal. In the resource menu, scroll to **Support + troubleshooting** and select **Connectivity check** to check the **Blob service (Microsoft Entra ID)** connectivity status. If it isn't accessible, follow the promoted guide to check the **Firewalls and virtual networks** configuration under your storage account page. For more information about storage firewalls, see [Configure Azure Storage firewalls and virtual networks](../../storage/common/storage-network-security.md).

### Other issues to check

- The storage resource you are accessing is Azure Data Lake Storage Gen2 and is behind a firewall and vNet (with storage private endpoint configured) at the same time.
- The container resource you are accessing has been deleted or doesn't exist.
- Crossing-tenant: the workspace tenant that user used to sign in isn't same with the tenant of the storage account. 

## Next step

If the previous steps don't help to resolve your issue, [create a support ticket](../sql-data-warehouse/sql-data-warehouse-get-started-create-support-ticket.md).
