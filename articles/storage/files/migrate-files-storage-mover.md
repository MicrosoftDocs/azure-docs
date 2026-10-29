---
title: Migrate to Azure Files using Azure Storage Mover
description: Learn how to migrate on-premises SMB or NFS file shares to Azure file shares with full fidelity using Azure Storage Mover, a fully managed migration service.
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 10/28/2026
ms.author: kendownie
author: khdownie
# Customer intent: "As an IT administrator, I want to migrate on-premises file shares to Azure file shares using a managed service, so that I can ensure full fidelity transfer and streamline my data management in the cloud."
---

# Use Azure Storage Mover to migrate to Azure file shares

**Applies to:** :heavy_check_mark: Classic SMB and NFS file shares created with the Microsoft.Storage resource provider

This migration guide describes how to migrate on-premises files to Azure file shares with full fidelity by using [Azure Storage Mover](../../storage-mover/service-overview.md), a fully managed migration service. You can use Storage Mover to migrate from SMB or NFS source shares, including Windows Server, Linux, or NAS. Storage Mover also supports agentless migration from on-premises SMB shares (preview) and from AWS FSx for Windows File Server (preview). See [Migrate on-premises SMB file shares with agentless migration](../../storage-mover/agentless-on-premises-files-migration.md) and [Migrate from AWS FSx to Azure Files](../../storage-mover/amazon-files-azure-files-migration.md).

> [!NOTE]
> If you're using or plan to use Azure File Sync for cloud tiering and on-premises caching, you can use Azure File Sync to migrate [on-premises NAS](storage-files-migration-nas-hybrid.md) or [Windows Server](../file-sync/file-sync-extend-servers.md) file shares instead of using Storage Mover. If you don't plan to use Azure File Sync long term, use Storage Mover for your migration.

## Why use Storage Mover to migrate to Azure file shares?

There are several reasons to use Storage Mover to migrate your on-premises file shares to Azure file shares.

- It's faster than other methods such as Robocopy because it uses the FileREST API (the native Azure Files REST API) to move data directly to the cloud, rather than depending on SMB.
- [Supported file metadata](storage-files-migration-overview.md#supported-metadata) is copied with full fidelity. Unlike object storage in Azure Blobs, an Azure file share can natively store file metadata, and it's important to make sure metadata gets copied from source to target during a migration. When migrating from an SMB source, folder structure and metadata values such as file and folder timestamps, ACLs, and file attributes are maintained.
- Storage Mover supports both SMB and NFS source shares, giving you flexibility when migrating from different storage systems.
- It scales to large namespaces. Storage Mover is tested with 500 million namespace items (files and folders) migrated from a supported source to a supported target in Azure. For SMB-to-Azure Files test results, see [Storage Mover performance targets](../../storage-mover/performance-targets.md#performance-baselines).

## Storage Mover migration prerequisites

To use Storage Mover to migrate your file shares, the following are required:

- An Azure subscription and resource group. [Review required permissions](../../storage-mover/deployment-planning.md#permissions).
- An Azure storage account with at least one Azure file share.
- Your local network must allow the Storage Mover agent to communicate with Azure. Port 443 (TLS) must be open outbound, and your firewall rules shouldn't limit traffic to Azure. Use the connectivity checker on the Storage Mover agent console to learn about the endpoint URLs in Azure that you must allow.
- For SMB source shares: Credentials (username and password) with read access to the source share.
- For NFS source shares: The NFS export must be accessible from the Storage Mover agent VM.

## Migrate files and metadata using Storage Mover

To migrate your data, follow these steps.

> [!NOTE]
> These steps use agent-based migration. For agentless migration from on-premises SMB shares (preview), which needs private connectivity and source credentials in Azure Key Vault, see [Migrate on-premises SMB file shares with agentless migration](../../storage-mover/agentless-on-premises-files-migration.md).

1. First, [create a Storage Mover resource](../../storage-mover/storage-mover-create.md).

1. Next, [deploy one or more Storage Mover agents](../../storage-mover/agent-deploy.md) close to your on-premises migration sources. These are virtual machines (VMs) that can run on Hyper-V or VMware hypervisors.

1. [Register the agent VMs with your Storage Mover resource](../../storage-mover/agent-register.md) to use your agent for a migration and manage it from the cloud. To register an agent, connect to its administrative shell, preferably over SSH. You can manage all subsequent steps from the Azure portal, Azure PowerShell, or Azure CLI.

1. **For SMB source shares only:** [Create an Azure Key Vault](/azure/key-vault/general/quick-create-portal) and place two secrets in it: one for the username and one for the password the agent can use to access the source SMB share. In the Azure portal, select the Key Vault and both secrets when you create the SMB source endpoint, and the required role assignments are applied automatically. If you create endpoints with Azure PowerShell or Azure CLI, [assign the agent's managed identity the Key Vault Secrets User role](../../storage-mover/endpoint-manage.md#smb-endpoints) on the Key Vault yourself. If the Key Vault firewall is enabled, allow traffic from the agent. NFS source shares don't require Key Vault credentials.

1. Now you must [define your source and target endpoints](../../storage-mover/endpoint-manage.md) in preparation for migrating your data. When creating the source endpoint, select either **SMB share** or **NFS share** depending on your source protocol. When creating the target endpoint, select **File share** for **Target type**.

1. [Create a project](../../storage-mover/project-manage.md) to collate the shares that need to be migrated together.

1. [Define your first migration job](../../storage-mover/job-definition-create.md) in your Storage Mover project. For the first migration job, use the Azure portal. On the **Source** and **Target** tabs, select the endpoints you created earlier instead of creating new ones. On the **Settings** tab, review the copy mode and migration outcomes carefully.

1. When your migration job and its settings are as you want them, start the job. Telemetry and copy logs help you monitor the progress and success of your migration job. If you want to estimate the time required to perform your migration job, see [Storage Mover scale and performance targets](../../storage-mover/performance-targets.md#performance-baselines).

## Verify that the migration succeeded

When the migration job is complete, you should find all the files and folders in your Azure file share, with full fidelity. Review the copy logs to ensure nothing was left behind. In the Azure portal, go to your Storage Mover resource, select **Projects**, select your project, and then select the job. On the **Run history** tab, confirm that the latest run succeeded. On the **Monitoring** tab, confirm that no items are listed as **Failed**.

## Next steps

Make sure you've [enabled backup](../../backup/azure-file-share-backup-overview.md) for your SMB Azure file shares.

## See also

- [What is Azure Storage Mover?](../../storage-mover/service-overview.md)
- [Plan a successful Azure Storage Mover deployment](../../storage-mover/deployment-planning.md)
- [Migrate from AWS FSx for Windows File Server to Azure Files (preview)](../../storage-mover/amazon-files-azure-files-migration.md)
- [Migrate to Azure file shares using Robocopy](storage-files-migration-robocopy.md)
- [Migrate files from one Azure file share to another when using Azure File Sync](../file-sync/file-sync-share-to-share-migration.md)
- [Copy data between Azure file shares with Storage Mover (preview)](../../storage-mover/azure-files-to-azure-files-copy.md)
- [Copy files between Azure file shares](migrate-files-between-shares.md)
