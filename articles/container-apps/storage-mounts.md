---
title: Use storage mounts in Azure Container Apps
description: Learn to use temporary and permanent storage mounts in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom: devx-track-azurecli
ms.topic: conceptual
ms.date: 09/13/2023
ms.author: cshoe
zone_pivot_groups: arm-azure-cli-portal
---

# Use storage mounts in Azure Container Apps

A container app has access to different types of storage. A single app can take advantage of more than one type of storage if necessary.

| Storage type | Description | Persistence | Usage example |
|--|--|--|
| [Container-scoped storage](#container-scoped-storage) | Ephemeral storage available to a running container | Data is available until container shuts down | Writing a local app cache.  |
| [Replica-scoped storage](#replica-scoped-storage) | Ephemeral storage for sharing files between containers in the same replica | Data is available until replica shuts down | The main app container writing log files that are processed by a sidecar container. |
| [Azure Files](#azure-files) | Permanent storage | Data is persisted to Azure Files | Writing files to a file share to make data accessible by other systems. |

## Ephemeral storage

A container app can read and write temporary data to ephemeral storage. Ephermal storage can be scoped to a container or a replica. The total amount of container-scoped and replica-scoped storage available to each replica depends on the total amount of vCPUs allocated to the replica.

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

To enable Azure Files storage in your container, you need to set up your container in the following ways:

* Create a storage definition in the Container Apps environment.
* Define a volume of type `AzureFile` in a revision.
* Define a volume mount in one or more containers in the revision.

### Prerequisites

| Requirement | Instructions |
|--|--|
| Azure account | If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). |
| Azure Storage account | [Create a storage account](../storage/common/storage-account-create.md?tabs=azure-cli#create-a-storage-account-1). |
| Azure Container Apps environment | [Create a container apps environment](environment.md). |

### Configuration

::: zone pivot="azure-cli"

When configuring a container app to mount an Azure Files volume using the Azure CLI, you must use a YAML definition to create or update your container app.

For a step-by-step tutorial, refer to [Create an Azure Files storage mount in Azure Container Apps](storage-mounts-azure-files.md).

1. Add a storage definition to your Container Apps environment.
  
    ```azure-cli
    az containerapp env storage set --name my-env --resource-group my-group \
        --storage-name mystorage \
        --azure-file-account-name <STORAGE_ACCOUNT_NAME> \
        --azure-file-account-key <STORAGE_ACCOUNT_KEY> \
        --azure-file-share-name <STORAGE_SHARE_NAME> \
        --access-mode ReadWrite
    ```

    Replace `<STORAGE_ACCOUNT_NAME>` and `<STORAGE_ACCOUNT_KEY>` with the name and key of your storage account. Replace `<STORAGE_SHARE_NAME>` with the name of the file share in the storage account.

    Valid values for `--access-mode` are `ReadWrite` and `ReadOnly`.

1. To update an existing container app to mount a file share, export your app's specification to a YAML file named *app.yaml*.

    ```azure-cli
    az containerapp show -n <APP_NAME> -g <RESOURCE_GROUP_NAME> -o yaml > app.yaml
    ```

1. Make the following changes to your container app specification.

    - Add a `volumes` array to the `template` section of your container app definition and define a volume. If you already have a `volumes` array, add a new volume to the array.
        - The `name` is an identifier for the volume.
        - For `storageType`, use `AzureFile`.
        - For `storageName`, use the name of the storage you defined in the environment.
    - For each container in the template that you want to mount Azure Files storage, define a volume mount in the `volumeMounts` array of the container definition.
        - The `volumeName` is the name defined in the `volumes` array.
        - The `mountPath` is the path in the container to mount the volume.

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

1. Update the container app resource to add a volume and volume mount.

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

    - Add a `volumes` array to the `template` section of your container app definition and define a volume. If you already have a `volumes` array, add a new volume to the array.
        - The `name` is an identifier for the volume.
        - For `storageType`, use `AzureFile`.
        - For `storageName`, use the name of the storage you defined in the environment.
    - For each container in the template that you want to mount Azure Files storage, define a volume mount in the `volumeMounts` array of the container definition.
        - The `volumeName` is the name defined in the `volumes` array.
        - The `mountPath` is the path in the container to mount the volume.

See the [ARM template API specification](azure-resource-manager-api-spec.md) for a full example.

::: zone-end

::: zone pivot="azure-portal"

To configure a volume mount for Azure Files storage in the Azure portal, add a file share to your Container Apps environment and then add a volume mount to your container app by creating a new revision.

1. In the Azure portal, navigate to your Container Apps environment.

1. Select **Azure Files** from the left menu.

1. Select **Add**.

1. In the *Add file share* context menu, enter the following information:

    - **Name**: A name for the file share.
    - **Storage account name**: The name of the storage account that contains the file share.
    - **Storage account key**: The access key for the storage account.
    - **File share**: The name of the file share.
    - **Access mode**: The access mode for the file share. Valid values are "Read/Write" and "Read only".

1. Select **Add** to exit the context pane.

1. Select **Save** to commit the changes.

1. Navigate to your container app.

1. Select **Revision management** from the left menu.

1. Select **Create new revision**.

1. Select the container that you want to mount the volume in.

1. In the *Edit a container* context pane, select the **Volume mounts** tab.

1. Under the *File shares* section, create a new volume with the following information.

    - **File share name**: The file share you added.
    - **Mount path**: The absolute path in the container to mount the volume.

1. Select **Save** to save changes and exit the context pane.

1. Select **Create** to create the new revision.

::: zone-end
