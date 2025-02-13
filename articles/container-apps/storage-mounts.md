---
title: Use storage mounts in Azure Container Apps
description: Learn to use temporary and permanent storage mounts in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom: devx-track-azurecli
ms.topic: conceptual
ms.date: 01/31/2025
ms.author: cshoe
zone_pivot_groups: arm-azure-cli-portal
---

# Use storage mounts in Azure Container Apps

A container app has access to different types of storage. A single app can take advantage of more than one type of storage if necessary.

> [!Note]
> Avoid using special characters in volume names to prevent deployment failures. For example, a volume named `credentials.json` contains a special character (`.`) which results in a deployment error.

| Storage type | Description | Persistence | Usage example |
|--|--|--|
| [Container-scoped storage](#container-scoped-storage) | Ephemeral storage available to a running container | Data is available until container shuts down | Writing a local app cache. |
| [Replica-scoped storage](#replica-scoped-storage) | Ephemeral storage for sharing files between containers in the same replica | Data is available until replica shuts down | The main app container writing log files that a sidecar container processes. |
| [Azure Files](#azure-files) | Permanent storage | Data is persisted to Azure Files | Writing files to a file share to make data accessible by other systems. |

> [!NOTE]
> Azure Container Apps does not support mounting file shares from Azure NetApp Files or Azure Blob Storage.

## Ephemeral storage

A container app can read and write temporary data to ephemeral storage. Ephemeral storage can be scoped to a container or a replica. The total amount of container-scoped and replica-scoped storage available to each replica depends on the total number of vCPUs allocated to the replica.

| vCPUs | Total ephemeral storage |
|--|--|
| 0.25 or lower | 1 GiB |
| 0.5 or lower | 2 GiB |
| 1 or lower | 4 GiB |
| Over 1 | 8 GiB |

### Container-scoped storage

A container can write to its own file system.

Container file system storage has the following characteristics:

* The storage is temporary and disappears when the container is shut down or restarted.
* Files written to this storage are only visible to processes running in the current container.

### Replica-scoped storage

You can mount an ephemeral, temporary volume that is equivalent to [EmptyDir](https://kubernetes.io/docs/concepts/storage/volumes/#emptydir) (empty directory) in Kubernetes. This storage is scoped to a single replica. Use an `EmptyDir` volume to share data between containers in the same replica.

Replica-scoped storage has the following characteristics:

* Files are persisted for the lifetime of the replica.
    * If a container in a replica restarts, the files in the volume remain.
* Any init or app containers in the replica can mount the same volume.
* A container can mount multiple `EmptyDir` volumes.

To configure replica-scoped storage, first define an `EmptyDir` volume in the revision. Then define a volume mount in one or more containers in the revision.

#### Prerequisites

| Requirement | Instructions |
|--|--|
| Azure account | If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). |
| Azure Container Apps environment | [Create a container apps environment](environment.md). |

#### Configuration

::: zone pivot="azure-cli"

When configuring replica-scoped storage using the Azure CLI, you must use a YAML definition to create or update your container app.

1. To update an existing container app to use replica-scoped storage, export your app's specification to a YAML file named *app.yaml*.

    ```azure-cli
    az containerapp show -n <APP_NAME> -g <RESOURCE_GROUP_NAME> -o yaml > app.yaml
    ```

1. Make the following changes to your container app specification.

    - Add a `volumes` array to the `template` section of your container app definition and define a volume. If you already have a `volumes` array, add a new volume to the array.
        - The `name` is an identifier for the volume.
        - Use `EmptyDir` as the `storageType`.
    - For each container in the template that you want to mount the volume, define a volume mount in the `volumeMounts` array of the container definition.
        - The `volumeName` is the name defined in the `volumes` array.
        - The `mountPath` is the path in the container to mount the volume.

    ```yaml
    properties:
      managedEnvironmentId: /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP_NAME>/providers/Microsoft.App/managedEnvironments/<ENVIRONMENT_NAME>
      configuration:
        activeRevisionsMode: Single
      template:
        containers:
        - image: <IMAGE_NAME1>
          name: my-container-1
          volumeMounts:
          - mountPath: /myempty
            volumeName: myempty
        - image: <IMAGE_NAME_2>
          name: my-container-2
          volumeMounts:
          - mountPath: /myempty
            volumeName: myempty
        volumes:
        - name: myempty
          storageType: EmptyDir
    ```

1. Update your container app using the YAML file.

    ```azure-cli
    az containerapp update --name <APP_NAME> --resource-group <RESOURCE_GROUP_NAME> \
        --yaml app.yaml
    ```

See the [YAML specification](azure-resource-manager-api-spec.md?tabs=yaml) for a full example.

::: zone-end

::: zone pivot="azure-resource-manager"

To create a replica-scoped volume and mount it in a container, make the following changes to the container apps resource in an ARM template:

- Add a `volumes` array to the `template` section of your container app definition and define a volume. If you already have a `volumes` array, add a new volume to the array.
    - The `name` is an identifier for the volume.
    - Use `EmptyDir` as the `storageType`.
- For each container in the template that you want to mount the volume, define a volume mount in the `volumeMounts` array of the container definition.
    - The `volumeName` is the name defined in the `volumes` array.
    - The `mountPath` is the path in the container to mount the volume.

Example ARM template snippet:

```json
{
  "apiVersion": "2022-03-01",
  "type": "Microsoft.App/containerApps",
  "name": "[parameters('containerappName')]",
  "location": "[parameters('location')]",
  "properties": {
    
    ...

    "template": {
      "revisionSuffix": "myrevision",
      "containers": [
        {
          "name": "main",
          "image": "[parameters('container_image')]",
          "resources": {
            "cpu": 0.5,
            "memory": "1Gi"
          },
          "volumeMounts": [
            {
              "mountPath": "/myempty",
              "volumeName": "myempty"
            }
          ]
        },
        {
          "name": "sidecar",
          "image": "[parameters('sidecar_image')]",
          "resources": {
            "cpu": 0.5,
            "memory": "1Gi"
          },
          "volumeMounts": [
            {
              "mountPath": "/myempty",
              "volumeName": "myempty"
            }
          ]
        }
      ],
      "scale": {
        "minReplicas": 1,
        "maxReplicas": 3
      },
      "volumes": [
        {
          "name": "myempty",
          "storageType": "EmptyDir"
        }
      ]
    }
  }
}
```

See the [ARM template API specification](azure-resource-manager-api-spec.md) for a full example.

::: zone-end


::: zone pivot="azure-portal"

To create a replica-scoped volume and mount it in a container, deploy a new revision of your container app using the Azure portal.

1. In the Azure portal, navigate to your container app.

1. Select **Revision management** in the left menu.

1. Select **Create new revision**.

1. Select the container where you want to mount the volume.

1. In the *Edit a container* context pane, select the **Volume mounts** tab.

1. Under the *Ephemeral storage* section, create a new volume with the following information.

    - **Volume name**: A name for the ephemeral volume.
    - **Mount path**: The absolute path in the container to mount the volume.

1. Select **Save** to save changes and exit the context pane.

1. Select **Create** to create the new revision.

::: zone-end

## <a name="azure-files"></a>Azure Files volume

You can mount a file share from [Azure Files](../storage/files/index.yml) as a volume in a container.

Azure Files storage has the following characteristics:

* Files written under the mount location are persisted to the file share.
* Files in the share are available via the mount location.
* Multiple containers can mount the same file share, including ones that are in another replica, revision, or container app.
* All containers that mount the share can access files written by any other container or method.
* More than one Azure Files volume can be mounted in a single container.

Azure Files supports both SMB (Server Message Block) and NFS (Network File System) protocols. You can mount an Azure Files share using either protocol. The file share you define in the environment must be configured with the same protocol used by the file share in the storage account.

> [!NOTE]
> Support for mounting NFS shares in Azure Container Apps is in preview.

To enable Azure Files storage in your container, you need to set up your environment and container app as follows:

* Create a storage definition in the Container Apps environment.
* If you're using NFS, your environment must be configured with a custom VNet and the storage account must be configured to allow access from the VNet. For more information, see [NFS file shares in Azure Files
](../storage/files/files-nfs-protocol.md).
* If your environment is configured with a custom VNet, you must allow ports 445 and 2049 in the network security group (NSG) associated with the subnet.
* Define a volume of type `AzureFile` (SMB) or `NfsAzureFile` (NFS) in a revision.
* Define a volume mount in one or more containers in the revision.
* The Azure Files storage account used must be accessible from your container app's virtual network. For more information, see [Grant access from a virtual network](/azure/storage/common/storage-network-security#grant-access-from-a-virtual-network).
    * If you're using NFS, you must also disable secure transfer. For more information, see [NFS file shares in Azure Files](../storage/files/files-nfs-protocol.md) and the *Create an NFS Azure file share* section in [this tutorial](../storage/files/storage-files-quick-create-use-linux.md#create-an-nfs-azure-file-share).

### Prerequisites

| Requirement | Instructions |
|--|--|
| Azure account | If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). |
| Azure Storage account | [Create a storage account](../storage/common/storage-account-create.md?tabs=azure-cli#create-a-storage-account). |
| Azure Container Apps environment | [Create a container apps environment](environment.md). |

### Configuration

::: zone pivot="azure-cli"

When configuring a container app to mount an Azure Files volume using the Azure CLI, you must use a YAML definition to create or update your container app.

For a step-by-step tutorial on mounting an SMB file share, refer to [Create an Azure Files storage mount in Azure Container Apps](storage-mounts-azure-files.md).

1. Add a storage definition to your Container Apps environment.

    # [SMB](#tab/smb)

    ```azure-cli
    az containerapp env storage set --name my-env --resource-group my-group \
        --storage-name mystorage \
        --storage-type AzureFile \
        --azure-file-account-name <STORAGE_ACCOUNT_NAME> \
        --azure-file-account-key <STORAGE_ACCOUNT_KEY> \
        --azure-file-share-name <STORAGE_SHARE_NAME> \
        --access-mode ReadWrite
    ```

    Replace `<STORAGE_ACCOUNT_NAME>` and `<STORAGE_ACCOUNT_KEY>` with the name and key of your storage account. Replace `<STORAGE_SHARE_NAME>` with the name of the file share in the storage account.

    Valid values for `--access-mode` are `ReadWrite` and `ReadOnly`.

    # [NFS](#tab/nfs)

    ```azure-cli
    az containerapp env storage set --name my-env --resource-group my-group \
        --storage-name mystorage \
        --storage-type NfsAzureFile \
        --server <NFS_SERVER> \
        --azure-file-share-name <STORAGE_SHARE_NAME> \
        --azure-file-account-name <STORAGE_ACCOUNT_NAME> \
        --azure-file-account-key <STORAGE_ACCOUNT_KEY> \
        --access-mode ReadWrite
    ```

    Replace `<NFS_SERVER>` with the NFS server address in the format `<STORAGE_ACCOUNT_NAME>.file.core.windows.net`. For example, if your storage account name is `mystorageaccount`, the NFS server address is `mystorageaccount.file.core.windows.net`.
    
    Replace `<STORAGE_SHARE_NAME>` with the name of the file share in the format `/<STORAGE_ACCOUNT_NAME>/<STORAGE_SHARE_NAME>`. For example, if your storage account name is `mystorageaccount` and the file share name is `myshare`, the share name is `/mystorageaccount/myshare`.

    Replace `<STORAGE_ACCOUNT_NAME>` with the name of your Azure Storage account and `<STORAGE_ACCOUNT_KEY>` with the key for your Azure Storage account, which can be found in the Azure portal.

    Valid values for `--access-mode` are `ReadWrite` and `ReadOnly`.

    > [!NOTE]
    > To mount NFS Azure Files, you must use a Container Apps environment with a custom VNet. The Storage account must be configured to allow access from the VNet.

    ---

1. To update an existing container app to mount a file share, export your app's specification to a YAML file named *app.yaml*.

    ```azure-cli
    az containerapp show -n <APP_NAME> -g <RESOURCE_GROUP_NAME> -o yaml > app.yaml
    ```

1. Make the following changes to your container app specification.

    - Add a `volumes` array to the `template` section of your container app definition and define a volume. If you already have a `volumes` array, add a new volume to the array.
        - The `name` is an identifier for the volume.
        - For `storageType`, use `AzureFile` for SMB, or `NfsAzureFile` for NFS. This value must match the storage type you defined in the environment.
        - For `storageName`, use the name of the storage you defined in the environment.
    - For each container in the template that you want to mount Azure Files storage, define a volume mount in the `volumeMounts` array of the container definition.
        - The `volumeName` is the name defined in the `volumes` array.
        - The `mountPath` is the path in the container to mount the volume.

    # [SMB](#tab/smb)

    ```yaml
    properties:
      managedEnvironmentId: /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP_NAME>/providers/Microsoft.App/managedEnvironments/<ENVIRONMENT_NAME>
      configuration:
      template:
        containers:
        - image: <IMAGE_NAME>
          name: my-container
          volumeMounts:
          - volumeName: azure-files-volume
            mountPath: /my-files
        volumes:
        - name: azure-files-volume
          storageType: AzureFile
          storageName: mystorage
    ```

    # [NFS](#tab/nfs)

    ```yaml
    properties:
      managedEnvironmentId: /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP_NAME>/providers/Microsoft.App/managedEnvironments/<ENVIRONMENT_NAME>
      configuration:
      template:
        containers:
        - image: <IMAGE_NAME>
          name: my-container
          volumeMounts:
          - volumeName: azure-files-volume
            mountPath: /my-files
        volumes:
        - name: azure-files-volume
          storageType: NfsAzureFile
          storageName: mystorage
    ```

    ---

1. Update your container app using the YAML file.

    ```azure-cli
    az containerapp update --name <APP_NAME> --resource-group <RESOURCE_GROUP_NAME> \
        --yaml app.yaml
    ```

See the [YAML specification](azure-resource-manager-api-spec.md?tabs=yaml) for a full example.

::: zone-end

::: zone pivot="azure-resource-manager"

The following ARM template snippets demonstrate how to add an Azure Files share to a Container Apps environment and use it in a container app.

1. Add a `storages` child resource to the Container Apps environment.

    # [SMB](#tab/smb)

    ```json
    {
      "type": "Microsoft.App/managedEnvironments",
      "apiVersion": "2022-03-01",
      "name": "[parameters('environment_name')]",
      "location": "[parameters('location')]",
      "properties": {
        "daprAIInstrumentationKey": "[parameters('dapr_ai_instrumentation_key')]",
        "appLogsConfiguration": {
          "destination": "log-analytics",
          "logAnalyticsConfiguration": {
            "customerId": "[parameters('log_analytics_customer_id')]",
            "sharedKey": "[parameters('log_analytics_shared_key')]"
          }
        }
      },
      "resources": [
        {
          "type": "storages",
          "name": "myazurefiles",
          "apiVersion": "2022-03-01",
          "dependsOn": [
            "[resourceId('Microsoft.App/managedEnvironments', parameters('environment_name'))]"
          ],
          "properties": {
            "azureFile": {
              "accountName": "[parameters('storage_account_name')]",
              "accountKey": "[parameters('storage_account_key')]",
              "shareName": "[parameters('storage_share_name')]",
              "accessMode": "ReadWrite"
            }
          }
        }
      ]
    }
    ```

    # [NFS](#tab/nfs)

    ```json
    {
      "type": "Microsoft.App/managedEnvironments",
      "apiVersion": "2023-05-01",
      "name": "[parameters('environment_name')]",
      "location": "[parameters('location')]",
      "properties": {
        "daprAIInstrumentationKey": "[parameters('dapr_ai_instrumentation_key')]",
        "appLogsConfiguration": {
          "destination": "log-analytics",
          "logAnalyticsConfiguration": {
            "customerId": "[parameters('log_analytics_customer_id')]",
            "sharedKey": "[parameters('log_analytics_shared_key')]"
          }
        },
        "workloadProfiles": [
          {
            "name": "Consumption",
            "workloadProfileType": "Consumption"
          }
        ],
        "vnetConfiguration": {
          "infrastructureSubnetId": "[parameters('custom_vnet_subnet_id')]",
          "internal": false
        },
      },
      "resources": [
        {
          "type": "storages",
          "name": "myazurefiles",
          "apiVersion": "2023-11-02-preview",
          "dependsOn": [
            "[resourceId('Microsoft.App/managedEnvironments', parameters('environment_name'))]"
          ],
          "properties": {
            "nfsAzureFile": {
              "server": "[concat(parameters('storage_account_name'), '.file.core.windows.net')]",
              "shareName": "[concat('/', parameters('storage_account_name'), '/', parameters('storage_share_name'))]",
              "accessMode": "ReadWrite"
            }
          }
        }
      ]
    }
    ```

    > [!NOTE]
    > To mount NFS Azure Files, you must use a Container Apps environment with a custom VNet. The Storage account must be configured to allow access from the VNet.

    ---

1. Update the container app resource to add a volume and volume mount.

    # [SMB](#tab/smb)

    ```json
    {
      "apiVersion": "2023-05-01",
      "type": "Microsoft.App/containerApps",
      "name": "[parameters('containerappName')]",
      "location": "[parameters('location')]",
      "properties": {
        
        ...

        "template": {
          "revisionSuffix": "myrevision",
          "containers": [
            {
              "name": "main",
              "image": "[parameters('container_image')]",
              "resources": {
                "cpu": 0.5,
                "memory": "1Gi"
              },
              "volumeMounts": [
                {
                  "mountPath": "/myfiles",
                  "volumeName": "azure-files-volume"
                }
              ]
            }
          ],
          "scale": {
            "minReplicas": 1,
            "maxReplicas": 3
          },
          "volumes": [
            {
              "name": "azure-files-volume",
              "storageType": "AzureFile",
              "storageName": "myazurefiles"
            }
          ]
        }
      }
    }
    ```

    # [NFS](#tab/nfs)

    ```json
    {
      "apiVersion": "2023-11-02-preview",
      "type": "Microsoft.App/containerApps",
      "name": "[parameters('containerappName')]",
      "location": "[parameters('location')]",
      "properties": {
        
        ...

        "template": {
          "revisionSuffix": "myrevision",
          "containers": [
            {
              "name": "main",
              "image": "[parameters('container_image')]",
              "resources": {
                "cpu": 0.5,
                "memory": "1Gi"
              },
              "volumeMounts": [
                {
                  "mountPath": "/myfiles",
                  "volumeName": "azure-files-volume"
                }
              ]
            }
          ],
          "scale": {
            "minReplicas": 1,
            "maxReplicas": 3
          },
          "volumes": [
            {
              "name": "azure-files-volume",
              "storageType": "NfsAzureFile",
              "storageName": "myazurefiles"
            }
          ]
        }
      }
    }
    ```

    ---

    - Add a `volumes` array to the `template` section of your container app definition and define a volume. If you already have a `volumes` array, add a new volume to the array.
        - The `name` is an identifier for the volume.
        - For `storageType`, use `AzureFile` for SMB, or `NfsAzureFile` for NFS. This value must match the storage type you defined in the environment.
        - For `storageName`, use the name of the storage you defined in the environment.
    - For each container in the template that you want to mount Azure Files storage, define a volume mount in the `volumeMounts` array of the container definition.
        - The `volumeName` is the name defined in the `volumes` array.
        - The `mountPath` is the path in the container to mount the volume.

See the [ARM template API specification](azure-resource-manager-api-spec.md) for a full example.

::: zone-end

::: zone pivot="azure-portal"

To configure a volume mount for Azure Files storage in the Azure portal, add a file share to your Container Apps environment and then add a volume mount to your container app by creating a new revision.

1. In the Azure portal, navigate to your Container Apps environment.

1. In the navigation pane, under *Settings*, select **Azure Files**.

1. Select **Add**.

1. Select **Server Message Block (SMB)** or **Network File System (NFS)**, depending on the protocol used by your file share.

1. In the *Add file share* context pane, enter the following information:

    # [SMB](#tab/smb)

    - **Name**: A name for the file share.
    - **Storage account name**: The name of the storage account that contains the file share.
    - **Storage account key**: The access key for the storage account.
    - **File share**: The name of the file share.
    - **Access mode**: The access mode for the file share. Valid values are **Read/Write** and **Read only**.

    # [NFS](#tab/nfs)

    - **Name**: A name for the file share.
    - **Server**: The name of the server that contains the file share. This has the form `<STORAGE_ACCOUNT_NAME>.file.core.windows.net`.
    - **File share name**: The name of the file share. This has the form `/<STORAGE_ACCOUNT_NAME>/<FILE_SHARE_NAME>`.
    - **Access mode**: The access mode for the file share. Valid values are **Read/Write** and **Read only**.

    ---

1. Select **Add** to exit the context pane.

1. Select **Save** to commit the changes.

1. Navigate to your container app.

1. In the navigation pane, under *Application*, select **Revisions and replicas**.

1. Select **Create new revision**.

1. In the *Create and deploy new revision* page, select the **Volumes** tab.

1. Select **Add**.

1. In the *Add volume* context pane, set the following.

    - **Volume type**: **Azure file volume**.
    - **Name**: Enter a volume name.
    - **File share name**: Select the file share you created previously.

1. Select **Add** to exit the context pane.

1. In the *Create and reploy new revision* page, select the **Container** tab.

1. Select the container that you want to mount the volume in.

1. In the *Edit a container* context pane, select the **Volume mounts** tab.

1. Under *Volume name*, select the volume you created previously.

1. In **Mount path**, enter the absolute path in the container to mount the volume.

1. Select **Save** to save changes and exit the context pane.

1. Select **Create** to create the new revision.

::: zone-end
