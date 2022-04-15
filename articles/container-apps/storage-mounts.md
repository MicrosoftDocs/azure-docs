---
title: Use storage mounts in Azure Container Apps
description: Learn to use temporary and permanent storage mounts in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 04/15/2022
ms.author: cshoe
zone_pivot_groups: container-apps-config-types
---

# Use storage mounts in Azure Container Apps

A container app has access to different types of storage. A single app can take advantage more than one type of storage if necessary.

| Storage type | Description | Usage examples |
|--|--|--|
| [Container file system](#container-filesystem) | Temporary storage scoped to the environment | Writing out a local app cache.  |
| [Replica-scoped volume](#replica-scoped-volume) | Temporary storage scoped to an individual replica | Sharing files between containers in a replica. For instance, the main app container can write log files that are processed by a sidecar container. |
| [Azure Files](#azure-files) | Permanent storage | Write files out to a mounted drive to make data accessible by other systems. |

## Container filesystem

A container can write to its own file system.

Container filesystem storage has the following characteristics:

* The storage is temporary and disappears when the container is shut down or restarted.
* Files written to this storage are only visible to processes running in the current container.
* There are no capacity guarantees. The available storage depends on the amount of disk space available on the host running the container.

## Replica-scoped volume

You can mount a Kubernetes [emptyDir](https://kubernetes.io/docs/concepts/storage/volumes/#emptydir) in a replica.

Replica-scoped storage has the following characteristics:

* Files are persisted for the lifetime of the replica.
  * If a container in a replica restarts, the files in the volume remain.
* Any containers in the replica can mount the same volume.
* More than one emptyDir volume can be mounted in a container.
* There are no capacity guarantees. **TODO: Anthony > (Or is it 1GB? Need to confirm)**

To configure, first define an EmptyDir volume in the revision. Then any container in the revision can mount it.

### Configuration

## Azure Files

You can mount a share volume with [Azure Files](/azure/storage/files/) inside a container.

Azure Files storage has the following characteristics:

* Files written under the mount location are persisted to the file share.
* Files in the share are available via the mount location.
* Multiple containers can mount the same file share, including ones that are in another replica, revision, or container app.
  * All containers that mount the share can see files written by any other container or method.
* Capacity is limited to 5 TB per share. **TODO: Anthony to confirm**
* More than one Azure Files volume can be mounted in a single container.

**TODO: Anthony to provide sample code**

To enable Azure Files storage in your container, you need to set up your container in the following ways:

* Define a `storage` section the Container Apps environment.
* Define the storage volume in a revision.
  * Once defined, any container in the revision can mount the volume.

### Configuration

::: zone pivot="aca-cli"

Same as the create YAML and create app steps in Azure Files

::: zone-end

::: zone pivot="aca-arm"

* Add a volume to `volumes` to the app’s `template`
* Add a volume mount to `volumeMounts` to the container definition in the `template`

::: zone-end

::: zone pivot="aca-bicep"

* Add a volume to `volumes` to the app’s `template`
* Add a volume mount to `volumeMounts` to the container definition in the `template`

::: zone-end

#### Prerequisites

| Requirement | Instructions |
|--|--|
| Azure account | If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). |
| Azure Storage account | [Create a storage account](/azure/storage/common/storage-account-create?tabs=azure-cli#create-a-storage-account-1). |
| Azure Container Apps environment | [Create a container apps environment](environment.md). |

::: zone pivot="aca-cli"

1. Set up variables.

    # [Bash](#tab/bash)

    ```azurecli
    RESOURCE_GROUP="my-container-apps-storage"
    ENVIRONMENT_NAME="<YOUR_ENVIRONMENT_NAME>"
    STORAGE_ACCOUNT_NAME="<YOUR_STORAGE_ACCOUNT_NAME>"
    STORAGE_KEY="<YOUR_STORAGE_ACCOUNT_KEY>"
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    $RESOURCE_GROUP="<YOUR_RESOURCE_GROUP_NAME>"
    $ENVIRONMENT_NAME="<YOUR_ENVIRONMENT_NAME>"
    $STORAGE_NAME="<YOUR_STORAGE_ACCOUNT_NAME>"
    $STORAGE_KEY="<YOUR_STORAGE_ACCOUNT_KEY>"
    ```

    ---

1. List storage

    # [Bash](#tab/bash)

    ```bash
    az containerapp env storage list \
      --name $ENVIRONMENT_NAME \
      --resource-group $RESOURCE_GROUP
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    az containerapp env storage list `
      --name $ENVIRONMENT_NAME `
      --resource-group $RESOURCE_GROUP
    ```

    ---

1. Show storage.

    # [Bash](#tab/bash)

    ```bash
    az containerapp env storage show \
      --name $ENVIRONMENT_NAME \
      --resource-group $RESOURCE_GROUP \
      --storage-name $STORAGE_NAME
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    az containerapp env storage show `
      --name $ENVIRONMENT_NAME `
      --resource-group $RESOURCE_GROUP `
      --storage-name $STORAGE_NAME
    ```

    ---

1. Assign storage account to your environment.

    # [Bash](#tab/bash)

    ```bash
    az containerapp env storage set \
      --name $ENVIRONMENT_NAME \
      -resource-group $RESOURCE_GROUP \
      --account-name $STORAGE_NAME \
      --account-key $STORAGE_KEY \
      --type AzureFile \
      --access-mode ReadWrite \
      --storage-name my-storage \
      --share-name myshare
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    az containerapp env storage set `
      --name $ENVIRONMENT_NAME `
      -resource-group $RESOURCE_GROUP `
      --account-name $STORAGE_NAME `
      --account-key $STORAGE_KEY `
      --type AzureFile `
      --access-mode ReadWrite `
      --storage-name my-storage `
      --share-name myshare
    ```

    ---

#### Remove storage account

# [Bash](#tab/bash)

```bash
az containerapp env storage remove \
  --name <YOUR_STORAGE_ACCOUNT_NAME> \
  --resource-group <YOUR_RESOURCE_GROUP_NAME> \
  --storage-name <YOUR_STORAGE_NAME>
```

# [PowerShell](#tab/powershell)

```powershell
az containerapp env storage remove `
  --name <YOUR_STORAGE_ACCOUNT_NAME> `
  --resource-group <YOUR_RESOURCE_GROUP_NAME> `
  --storage-name <YOUR_STORAGE_NAME>
```

---

::: zone-end

::: zone pivot="aca-arm"

* (Do we need to document how to create a storage account in an ARM template too?)
* To use Azure Files in Azure Resource Manager
  * Add storage to `storages` in the environment
  * Add a volume to `volumes` to the app’s `template`
  * Add a volume mount to `volumeMounts` to the container definition in the `template`
* Also add these items to the example in the API spec doc and link to it from here

::: zone-end

::: zone pivot="aca-bicep"

* (Do we need to document how to create a storage account in an ARM template too?)
* To use Azure Files in Azure Resource Manager
  * Add storage to `storages` in the environment
  * Add a volume to `volumes` to the app’s `template`
  * Add a volume mount to `volumeMounts` to the container definition in the `template`
* Also add these items to the example in the API spec doc and link to it from here

::: zone-end
