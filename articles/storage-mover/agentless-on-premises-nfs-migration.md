---
title: Migrate on-premises NFS file shares to Azure Files and Azure Blob Storage using the agentless migration capability in Storage Mover
description: Learn how to migrate NFS file data from on-premises file shares to Azure Files NFS shares or Azure Blob Storage by using the agentless migration capability in Azure Storage Mover.
author: jeevanbalanmanoj
ms.author: jeevanm
ms.service: azure-storage-mover
ms.topic: how-to
ms.date: 11/03/2026
ms.collection:
  - migration
---

# Migrate data from on-premises NFS to Azure Files and Azure Blob Storage with Azure Storage Mover (preview)

Azure Storage Mover supports agentless migration from on-premises NFS file shares to Azure Files (NFS) and to Azure Blob Storage. With agentless migration, you don't deploy or register a Storage Mover agent in your datacenter. Storage Mover reaches the source NFS export over a private connection between Azure and your network and copies the data to the Azure target you choose.

This article explains how to prepare prerequisites, select the agentless NFS migration type, configure endpoints, run migration jobs, validate data, and complete cutover.

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
- Permissions to create Storage Mover resources and to assign RBAC roles on the target storage account. When you start a job in the portal, Storage Mover tries to assign the roles the job needs.

> [!NOTE]
> Agentless NFS migrations don't need Azure Key Vault. NFS doesn't use user-based authentication, so the source endpoint stores only the host and export path, with no credentials.

## Migration limits and behavior

The on-premises NFS to Azure Files and Azure Blob Storage scenario is currently in preview. Review these limits and behaviors before production use:

- Each migration job supports up to **100 million objects**. If your source share contains more objects, split migration scope across multiple jobs.
- Up to **10 migration jobs** can run concurrently per subscription.
- During preview, run only one migration job at a time per target file share or blob container to avoid conflicts.
- NFSv3 and NFSv4 sources are supported. The portal creates the source endpoint with the protocol version set to **NFS (auto)** and doesn't let you choose a version.
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

## Choose the agentless NFS migration type

In the Azure portal, agentless and agent-based NFS migrations appear as separate source types. Select the agentless option so that Storage Mover connects to your source over a private connection instead of expecting a registered agent.

1. In the Azure portal, open your Storage Mover resource. Under **Plan + run migrations**, select **Projects**.
1. Select the **Get started** tab.
1. For **What is your migration type?**, select **On-premises migration**. Its description reads *NFS/SMB to Blob containers/File shares*. The other options, **Multicloud migration** and **Azure to Azure**, aren't used for on-premises sources.

    :::image type="content" source="media/agentless-on-premises-nfs-migration/migration-type-options.png" alt-text="Screenshot of the Get started tab of the Projects page in Azure Storage Mover. The What is your migration type list is open and On-premises migration is highlighted.":::

1. For **What is your source type?**, select **File Server/NAS - NFS (Preview)**. Its description reads *Private network access required, no appliance required*.

    :::image type="content" source="media/agentless-on-premises-nfs-migration/source-type-options.png" alt-text="Screenshot of the What is your source type list with File Server/NAS - NFS (Preview), described as Private network access required, no appliance required, highlighted.":::

    The source type list shows each on-premises option with a short description. Use the following table to pick the right one.

    | Source type in the portal | Description in the portal | Migration approach |
    |---|---|---|
    | **File Server/NAS - NFS (Preview)** | Private network access required, no appliance required | Agentless NFS (this article) |
    | **File Server/NAS - NFS** | Appliance required | Agent-based NFS, using a Storage Mover agent |
    | **File Server/NAS - SMB (Preview)** | Private network access required, no appliance required | Agentless SMB |
    | **File Server/NAS - SMB** | Appliance required | Agent-based SMB, using a Storage Mover agent |
    | **On-prem sources (Dell ECS, AWS Storage Gateway, MinIO etc) - S3 (Preview)** | Private network access required, no appliance required | Agentless S3-compatible object storage |

    > [!IMPORTANT]
    > Make sure you select **File Server/NAS - NFS (Preview)**. The **File Server/NAS - NFS** option without the **(Preview)** label is the agent-based path and requires a Storage Mover agent.

1. Review the guided path that appears for your selection: **Private networking**, **Source**, **Target**, **Project**, and **Migration job**. The following sections walk through each step.

    :::image type="content" source="media/agentless-on-premises-nfs-migration/guided-path-private-networking.png" alt-text="Screenshot of the Plan your on-premises migration with Azure Storage Mover pane with the Private networking, Source, Target, Project, and Migration job steps.":::

> [!NOTE]
> If you leave the **Get started** page before you finish, the guided path loses your progress. Resources and endpoints you already created remain, and you can select them when you return.

## Select a private connection

Agentless NFS migration uses a Storage Mover private connection to reach your NFS server. Each private connection references a Private Link Service Direct Connect resource whose destination IP address is your NFS server. To set one up, see [Configure private network connectivity for on-premises to Azure migrations](on-premises-private-network-configuration.md).

1. In the **Private networking** step of the guided path, select **Select existing connection**. If you don't have a private connection yet, use **Create Private link service** and **Create Private link connections** to set one up first.
1. In the **Select an existing private connection (Preview)** pane, search for your connection and select the one that routes to your NFS server, for example `contoso-nfs-pc`. You can only select connections listed under **Approved**.

    :::image type="content" source="media/agentless-on-premises-nfs-migration/private-connection-select.png" alt-text="Screenshot of the Select an existing private connection pane, filtered to contoso, with the approved private connection contoso-nfs-pc selected.":::

1. Choose **Select**. The **Private networking** step then shows **Connection selected**.

> [!IMPORTANT]
> Only private connections in the **Approved** state can be used for a migration job. Pending, rejected, or disconnected connections appear under **Not approved** and can't be selected.

## Create the on-premises NFS source endpoint

Create a source endpoint that points to your on-premises NFS export.

### [Azure portal](#tab/portal)

1. In the **Source** step of the guided path, select **Create source endpoint**. To reuse an endpoint you created earlier, select **Select source endpoint** instead. Outside the guided path, expand **Resource management** in your Storage Mover resource and select **Storage endpoints** > **Source endpoints** > **Create endpoint**.
1. In the **Create source endpoint** pane, confirm that **Migration type** is **On-premises migration** and **Source type** is **File Server/NFS - NFS (Preview)**. When you start from the guided path, both values are filled in for you.
1. For **Host name or IP**, enter the private IP address or FQDN of your NFS server, for example `10.0.0.4`.
1. For **Share name**, enter the full export path, including the leading slash, for example `/data/share`.
1. Optionally, enter a **Source description** of up to 1,024 characters.
1. Under **Verify source path**, check the **Full source path**. Storage Mover joins the host and share name, for example `10.0.0.4:/data/share`. Copy the path and confirm it's correct.

    :::image type="content" source="media/agentless-on-premises-nfs-migration/source-endpoint-create.png" alt-text="Screenshot of the Create source endpoint pane with Host name or IP 10.0.0.4, Share name /data/share, and Full source path 10.0.0.4:/data/share.":::

1. Select **Create**. The pane has no name field: the portal names the endpoint automatically, for example `source-<GUID>`, and the **Source** step shows **Source endpoint created**.

> [!NOTE]
> Unlike agentless SMB, an NFS source endpoint doesn't store credentials, so you don't need Azure Key Vault or a **Key Vault Secrets User** role assignment for the source endpoint.

### [Azure CLI](#tab/cli)

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

---

## Create the target endpoint

Create the target endpoint for the destination you chose: an NFS Azure Files share or a blob container. Each job needs only one of the following options.

### Option 1: Azure Files (NFS) target

#### [Azure portal](#tab/portal)

1. In the **Target** step of the guided path, select **Create target endpoint**. To reuse an endpoint, select **Select target endpoint** instead. Outside the guided path, expand **Resource management** in your Storage Mover resource and select **Storage endpoints** > **Target endpoints** > **Add endpoint**.
1. In the **Create target endpoint** pane, select the **Subscription** and **Storage account** that contain your destination file share, for example `contosonfsfiles`. When you select a premium file storage account, the **Azure blob container** target type isn't available.
1. For **Target type**, select **File share**. For **Protocol**, select **NFS**. SMB isn't available for an NFS source.
1. For **File share**, select the destination share, for example `fileshare`.

    :::image type="content" source="media/agentless-on-premises-nfs-migration/target-endpoint-files-create.png" alt-text="Screenshot of the Create target endpoint pane with Target type File share, Protocol NFS, and File share fileshare selected.":::

1. Optionally, add a **Description**, and then select **Create**. The portal names the endpoint automatically, for example `target-<GUID>`.

> [!NOTE]
> If role assignment doesn't happen automatically at runtime, assign **Storage File Data Privileged Contributor** on the target file share to the target endpoint's managed identity.

#### [Azure CLI](#tab/cli)

```azurecli
az storage-mover endpoint create-for-storage-nfs-file-share \
  --resource-group <resource-group> \
  --storage-mover-name <storage-mover-name> \
  --name AzureFilesNfsTargetEndpoint \
  --storage-account-id <storage-account-resource-id> \
  --file-share-name <target-file-share-name>
```

---

### Option 2: Azure Blob Storage target

#### [Azure portal](#tab/portal)

1. In the **Target** step of the guided path, select **Create target endpoint**, or select **Select target endpoint** to reuse one. Outside the guided path, select **Storage endpoints** > **Target endpoints** > **Add endpoint**.
1. In the **Create target endpoint** pane, select the **Subscription** and **Storage account** that contain your destination container, for example `contosoblobarchive`.
1. For **Target type**, select **Azure blob container**.
1. For **Azure blob container**, select the destination container, for example `targetcontainer1`.

    :::image type="content" source="media/agentless-on-premises-nfs-migration/target-endpoint-blob-create.png" alt-text="Screenshot of the Create target endpoint pane with Target type Azure blob container and the container targetcontainer1 selected.":::

1. Optionally, add a **Description**, and then select **Create**. The portal names the endpoint automatically.

> [!NOTE]
> If role assignment doesn't happen automatically at runtime, assign **Storage Blob Data Contributor** on the target blob container to the target endpoint's managed identity.

#### [Azure CLI](#tab/cli)

```azurecli
az storage-mover endpoint create-for-storage-container \
  --resource-group <resource-group> \
  --storage-mover-name <storage-mover-name> \
  --name AzureBlobTargetEndpoint \
  --storage-account-id <storage-account-resource-id> \
  --container-name <target-container-name>
```

---

Verify either target endpoint with `az storage-mover endpoint show`, as shown for the source endpoint.

## Create and run a migration job

After you create the endpoints, create a project and job definition. Then, after you create the project and job definition resources, run the first copy pass.

### Create a project

#### [Azure portal](#tab/portal)

1. In the **Project** step of the guided path, select **Create project**, or select **Select existing project** to reuse one. Outside the guided path, go to the **Projects** page and select **Create project**.
1. Enter a **Project name**, such as `OnPremisesNfsMigrationProject`, and an optional **Project description**. You can't change the project name later.

    :::image type="content" source="media/agentless-on-premises-nfs-migration/project-create.png" alt-text="Screenshot of the Create a project pane with the project name OnPremisesNfsMigrationProject and a description.":::

1. Select **Create** to provision the project.

#### [Azure CLI](#tab/cli)

```azurecli
az storage-mover project create \
  --resource-group <resource-group> \
  --storage-mover-name <storage-mover-name> \
  --name OnPremisesNfsMigrationProject
```

---

### Create a job definition

#### [Azure portal](#tab/portal)

1. In the **Migration job** step of the guided path, select **Create Migration job**. The **Create a job** page opens with three tabs: **Basics**, **Settings**, and **Review**.

    :::image type="content" source="media/agentless-on-premises-nfs-migration/guided-path-job-step.png" alt-text="Screenshot of the guided path with Private networking, Source, Target, and Project marked complete and the Create Migration job button.":::

1. On the **Basics** tab, confirm that **Migration type** is **On-premises migration** and **Source type** is **File Server/NAS - NFS (Preview)**.

    :::image type="content" source="media/agentless-on-premises-nfs-migration/job-basics-migration-type.png" alt-text="Screenshot of the Basics tab of the Create a job page with Migration type On-premises migration and Source type File Server/NAS - NFS (Preview) highlighted, and the job name OnPremisesNfsToAzureBlobJob.":::

1. Enter a job **Name**, such as `OnPremisesNfsToAzureBlobJob`, and an optional **Description** of up to 1,024 characters.
1. In the **Endpoints** section, verify the source and target. The source shows the share and root path, such as `10.0.0.4:/data/share`, and the target shows the storage account and the container or file share. To switch endpoints, use **Change or create source endpoint** or **Change or create target endpoint**. Set the **Sub-path** fields if you want to migrate only part of the export or write into a folder on the target.

    :::image type="content" source="media/agentless-on-premises-nfs-migration/job-basics-endpoints.png" alt-text="Screenshot of the Endpoints section of the Basics tab showing the source share /data/share with full source path 10.0.0.4:/data/share, and the target storage account and blob container.":::

1. In the **Private connections (Preview)** section, verify that the private connection you selected is listed with the state **Approved**. To add another connection, select **Add**.

    :::image type="content" source="media/agentless-on-premises-nfs-migration/job-basics-private-connections.png" alt-text="Screenshot of the Private connections section of the Basics tab listing contoso-nfs-pc with private link service contoso-nfs-pls in the Approved state.":::

1. On the **Settings** tab, keep **Copy mode** set to **Merge content into target** for the initial migration, and review the **Migration outcomes** for your target type.

    :::image type="content" source="media/agentless-on-premises-nfs-migration/job-settings-copy-mode.png" alt-text="Screenshot of the Settings tab of the Create a job page with Copy mode set to Merge content into target and the migration outcomes for a blob container target.":::

1. On the **Review** tab, verify the values and select **Create**.

    :::image type="content" source="media/agentless-on-premises-nfs-migration/job-review.png" alt-text="Screenshot of the Review tab summarizing the job name, migration type, NFS source with protocol version NFS (auto) and private connection, and the blob container target, with the Create button.":::

1. After the job is created, it appears in the project with the status **Never ran**.

#### [Azure CLI](#tab/cli)

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

---

### Start and monitor a migration job

#### [Azure portal](#tab/portal)

1. On the **Projects** tab of your Storage Mover resource, select your project and then the job. On the job page, select **Start job**.
1. In the **Start job** pane, Storage Mover tries to assign the roles the job needs (**Step 1: Attempt to assign roles**). For a blob container target, it assigns **Storage Account Contributor** on the storage account and **Blob Data Contributor** on the container. When the roles show as assigned, select **Start** (**Step 2**).

    :::image type="content" source="media/agentless-on-premises-nfs-migration/job-start-roles.png" alt-text="Screenshot of the Start job pane showing Step 1, Attempt to assign roles, with roles assigned on the storage account and blob container, and Step 2, Click Start.":::

1. Monitor the job status on the job page. The status moves from **Queued** to **Running** and then shows the result of the run. A job can stay **Queued** for several minutes. During and after a run, the **Monitoring** tab shows files and folders, data volume, and a processed breakdown (copied, skipped, failed, unsupported, and no copy needed), and the **Run history** tab lists each run.

    :::image type="content" source="media/agentless-on-premises-nfs-migration/job-queued-status.png" alt-text="Screenshot of the job page for OnPremisesNfsToAzureBlobJob with the status Queued and the source and target properties.":::

> [!IMPORTANT]
> If the **Start job** pane can't assign a role, or the job fails because of permissions, assign the role to the target endpoint's managed identity yourself and retry: **Storage File Data Privileged Contributor** on the target file share for an Azure Files target, or **Storage Blob Data Contributor** on the target blob container for a Blob Storage target.

#### [Azure CLI](#tab/cli)

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

---

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
- **Run status**: Review the latest job definition output and portal error details before retrying.

When a job fails, the job page shows **Job failed** with an error code. Select the error code to open **Error details**, which shows the failure details, a **Mitigation** link, and the job run logs. For example, `AZSM1001` (Failed to mount source path) means Storage Mover couldn't mount the NFS export. Check the host name or IP address and the export path, confirm that the export allows the source NAT IP addresses of the Private Link Service Direct Connect resource, and confirm that the NFS ports are reachable over the private connection.

:::image type="content" source="media/agentless-on-premises-nfs-migration/job-error-details.png" alt-text="Screenshot of the Error details pane for error code AZSM1001 with the mount failure details, a Mitigation link, and the Job logs list.":::

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
