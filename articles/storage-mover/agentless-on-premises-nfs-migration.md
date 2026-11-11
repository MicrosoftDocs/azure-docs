---
title: Migrate on-premises NFS file shares to Azure Files and Azure Blob Storage using the agentless migration capability in Storage Mover
description: Learn how to migrate NFS file data from on-premises file shares to Azure Files NFS shares or Azure Blob Storage by using the agentless migration capability in Azure Storage Mover.
author: jeevanbalanmanoj
ms.author: jeevanm
ms.service: azure-storage-mover
ms.topic: how-to
ms.date: 11/11/2026
ms.collection:
  - migration
---

# Migrate data from on-premises NFS to Azure Files and Azure Blob Storage with Azure Storage Mover (preview)

Azure Storage Mover supports agentless migration from on-premises NFS file shares to Azure Files (NFS) and to Azure Blob Storage. With agentless migration, you don't deploy or register a Storage Mover agent in your datacenter. Storage Mover reaches the source NFS export over a private connection between Azure and your network and copies the data to the Azure target you choose.

This article explains how to prepare prerequisites, configure endpoints, run migration jobs, validate data, and complete cutover by using Azure CLI.

> [!IMPORTANT]
> The agentless NFS migration capability isn't available in the Azure portal yet. Until the portal experience is available, use Azure CLI to complete the steps in this article.

> [!IMPORTANT]
> Agentless NFS migrations require private connectivity between Azure and the network that hosts your source NFS share.

Agentless NFS migration supports two Azure targets. Choose the one that matches how applications use the data.

| Target | Target type in Storage Mover | Choose it when |
|---|---|---|
| Azure Files (NFS 4.1 file share) | File share, NFS protocol | Linux and UNIX clients need to keep mounting the data over NFS, with a POSIX file system, after cutover. |
| Azure Blob Storage (blob container) | Blob container | The data moves to object storage, for example for archives, data lakes, or analytics, and applications read it through Blob Storage APIs, SDKs, or tools. |

## Prerequisites

Before you begin, ensure that you have:

- An on-premises NFS source share, such as an export on a NAS device or a Linux or UNIX file server, accessible through private network connectivity.
- A [Storage Mover resource](storage-mover-create.md) in your Azure subscription.
- An [Azure Storage account](../storage/common/storage-account-create.md) and a destination for the data: an NFS Azure Files (NFS 4.1) or a blob container.
- A private connection set up for private source access. See [Migrate data using private connections in Azure Storage Mover](migrations-requiring-private-connections.md) and [Configure private network connectivity for on-premises to Azure migrations](on-premises-private-network-configuration.md).
- An NFS export that allows access from the source NAT IP addresses of the Private Link Service Direct Connect resource behind your private connection.
- Permissions to create Storage Mover resources and to assign RBAC roles on the target storage account.
- [Azure CLI](/cli/azure/install-azure-cli) with the `storage-mover` extension installed. To install it, run `az extension add --name storage-mover`.

> [!NOTE]
> Agentless NFS migrations don't need Azure Key Vault. NFS doesn't use user-based authentication, so the source endpoint stores only the host and export path, with no credentials.

## Migration limits and behavior

The on-premises NFS to Azure Files and Azure Blob Storage scenario is currently in preview. Review these limits and behaviors before production use:

- Each migration job supports up to **100 million objects**. If your source share contains more objects, split migration scope across multiple jobs.
- Up to **10 migration jobs** can run concurrently per subscription.
- During preview, run only one migration job at a time per target file share or blob container to avoid conflicts.
- NFSv3 and NFSv4 sources are supported. The source endpoint sets the protocol version to **NFS (auto)**, so you don't choose a version.
- Data is copied, not moved. Source data remains on your NFS server until you decommission it.
- File metadata is handled differently on each target, as shown in the following table.

| Metadata | Azure Files (NFS) target | Azure Blob Storage target |
|---|---|---|
| Directory structure | Preserved | Kept as virtual folders; empty folders become empty blobs |
| Permissions (mode, user, group) | Preserved | Saved as custom blob metadata; not enforced |
| Symbolic links | Skipped | Migrated when the link resolves; otherwise logged as a failed file |
| Hard links | Copied as regular files | Copied as regular files |
| Create and modified timestamps | Preserved | Saved as custom blob metadata |
| Change timestamp (ctime) | Not preserved | Saved as custom blob metadata |
| Last access timestamp | Not preserved | Saved as custom blob metadata when present on the source |

Blob targets store up to 4 KiB of custom metadata per item; larger metadata isn't migrated. For more detail, see [Manage Azure Storage Mover endpoints](endpoint-manage.md). For the latest limits and constraints, see [Cloud migration basics](migration-basics.md) and [Release notes](release-notes.md).

## Identify the private connection

Agentless NFS migration uses a Storage Mover private connection to reach your NFS server. Each private connection references a Private Link Service Direct Connect resource whose destination IP address is your NFS server. To set one up, see [Configure private network connectivity for on-premises to Azure migrations](on-premises-private-network-configuration.md).

Note the resource ID of the private connection that routes to your NFS server. You use it when you create the job definition.

> [!IMPORTANT]
> Only private connections in the **Approved** state can be used for a migration job. Pending, rejected, or disconnected connections can't be used.

## Create the on-premises NFS source endpoint

Create a source endpoint that points to your on-premises NFS export. NFS doesn't use user-based authentication, so the source endpoint stores only the host and export path, with no credentials. Unlike agentless SMB, you don't need Azure Key Vault or a **Key Vault Secrets User** role assignment for the source endpoint.

Create the source endpoint:

```azurecli
az storage-mover endpoint create-for-nfs \
  --resource-group <resource-group> \
  --storage-mover-name <storage-mover-name> \
  --name OnPremisesNfsSourceEndpoint \
  --host <nfs-server-ip-or-fqdn> \
  --export <export-path>
```

Verify the endpoint:

```azurecli
az storage-mover endpoint show \
  --resource-group <resource-group> \
  --storage-mover-name <storage-mover-name> \
  --name OnPremisesNfsSourceEndpoint
```

## Create the target endpoint

Create the target endpoint for the destination you chose: an NFS Azure Files share or a blob container. Each job needs only one of the following options.

### Option 1: Azure Files (NFS) target

```azurecli
az storage-mover endpoint create-for-storage-nfs-file-share \
  --resource-group <resource-group> \
  --storage-mover-name <storage-mover-name> \
  --name AzureFilesNfsTargetEndpoint \
  --storage-account-id <storage-account-resource-id> \
  --file-share-name <target-file-share-name>
```

### Option 2: Azure Blob Storage target

```azurecli
az storage-mover endpoint create-for-storage-container \
  --resource-group <resource-group> \
  --storage-mover-name <storage-mover-name> \
  --name AzureBlobTargetEndpoint \
  --storage-account-id <storage-account-resource-id> \
  --container-name <target-container-name>
```

Verify either target endpoint with `az storage-mover endpoint show`, as shown for the source endpoint.

## Create and run a migration job

After you create the endpoints, create a project and job definition. Then, after you create the project and job definition resources, run the first copy pass.

### Create a project

```azurecli
az storage-mover project create \
  --resource-group <resource-group> \
  --storage-mover-name <storage-mover-name> \
  --name OnPremisesNfsMigrationProject
```

### Create a job definition

```azurecli
az storage-mover job-definition create \
  --resource-group <resource-group> \
  --storage-mover-name <storage-mover-name> \
  --project-name OnPremisesNfsMigrationProject \
  --name OnPremisesNfsToAzureFilesJob \
  --source-name OnPremisesNfsSourceEndpoint \
  --target-name AzureFilesNfsTargetEndpoint \
  --copy-mode Additive \
  --job-type OnPremToCloud \
  --connections "[<private-connection-resource-id>]"
```

For a Blob Storage target, set `--target-name` to `AzureBlobTargetEndpoint`.

### Start a migration job

Start the job:

```azurecli
az storage-mover job-definition start-job \
  --resource-group <resource-group> \
  --storage-mover-name <storage-mover-name> \
  --project-name OnPremisesNfsMigrationProject \
  --job-definition-name OnPremisesNfsToAzureFilesJob
```

View current job definition state:

```azurecli
az storage-mover job-definition show \
  --resource-group <resource-group> \
  --storage-mover-name <storage-mover-name> \
  --project-name OnPremisesNfsMigrationProject \
  --name OnPremisesNfsToAzureFilesJob
```

> [!IMPORTANT]
> If the job fails because of permissions, assign the role to the target endpoint's managed identity and retry: **Storage File Data Privileged Contributor** on the target file share for an Azure Files target, or **Storage Blob Data Contributor** on the target blob container for a Blob Storage target.

## Validate migration and perform cutover

Use an incremental migration pattern to minimize downtime.

1. Run an initial copy and validate folder structure, file counts, and sample file integrity on the target.
1. Run incremental passes to copy only changed data.
1. For final cutover, stop writes to the source NFS export.
1. Run a final incremental pass.
1. Redirect users and applications to the target, as described in the next section.
1. Keep the source export available in read-only mode for a short fallback period, then decommission it when validated.

For an Azure Files target, mount the NFS file share on your Linux clients. Clients need network access to the storage account. For details, see [Mount NFS Azure file shares on Linux](../storage/files/storage-files-how-to-mount-nfs-shares.md).

```bash
sudo mount -t nfs -o vers=4,minorversion=1,sec=sys \
  <storage-account-name>.file.core.windows.net:/<storage-account-name>/<share-name> \
  /mnt/<share-name>
```

For a Blob Storage target, point applications to the container, `https://<storage-account-name>.blob.core.windows.net/<container-name>`, through Blob Storage APIs, SDKs, or tools. NFS permissions are kept only as blob metadata and aren't enforced, so set up access with Azure RBAC or other Blob Storage access controls.

## Troubleshooting

If migration jobs fail, check the following items first:

- **Permissions**: Validate storage data access for the target endpoint identity: **Storage File Data Privileged Contributor** for an Azure Files target, or **Storage Blob Data Contributor** for a Blob Storage target.
- **Network**: Verify that the private connection is **Approved** and that the supporting network path is in place, including TCP 2049 reachability across VPN, Azure ExpressRoute, NSG, and firewall controls. Confirm that the Private Link Service Direct Connect destination IP address points to your NFS server.
- **Export access**: Confirm that the NFS export allows access from the source NAT IP addresses of the Private Link Service Direct Connect resource, because the NFS server sees those addresses as the client.
- **Source path values**: Confirm that the source host and export path are correct and that the full source path matches the export, for example `10.0.0.4:/data/share`.
- **Run status**: Review the latest job definition output before retrying.

When a job fails, the job run returns an error code. For example, `AZSM1001` (Failed to mount source path) means Storage Mover couldn't mount the NFS export. Check the host name or IP address and the export path, confirm that the export allows the source NAT IP addresses of the Private Link Service Direct Connect resource, and confirm that the NFS ports are reachable over the private connection.

For more troubleshooting guidance, see:

- [Troubleshooting Azure Storage Mover job run error codes](status-code.md)
- [Troubleshoot network issues](network-troubleshooting.md)

## Related content

- [Migrate on-premises SMB file shares to Azure Files using the agentless migration capability in Storage Mover](agentless-on-premises-files-migration.md)
- [Configure private network connectivity for on-premises to Azure migrations](on-premises-private-network-configuration.md)
- [Migrate data using private connections in Azure Storage Mover](migrations-requiring-private-connections.md)
- [Manage Azure Storage Mover endpoints](endpoint-manage.md)
- [Define and start a migration job](job-definition-create.md)
- [Monitor copy and job run logs](log-monitoring.md)
