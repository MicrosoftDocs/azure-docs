---
title: Use storage mounts in Azure Container Apps
description: Learn to use temporary and permanent storage mounts in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 05/13/2022
ms.author: cshoe
zone_pivot_groups: container-apps-config-types
---

# Use storage mounts in Azure Container Apps

A container app has access to different types of storage. A single app can take advantage of more than one type of storage if necessary.

| Storage type | Description | Usage examples |
|--|--|--|
| [Container file system](#container-file-system) | Temporary storage scoped to the local container | Writing a local app cache.  |
| [Temporary storage](#temporary-storage) | Temporary storage scoped to an individual replica | Sharing files between containers in a replica. For instance, the main app container can write log files that are processed by a sidecar container. |
| [Azure Files](#azure-files) | Permanent storage | Writing files to a file share to make data accessible by other systems. |

> [!NOTE]
> The volume mounting features in Azure Container Apps are in preview.

## Container file system

A container can write to its own file system.

Container file system storage has the following characteristics:

* The storage is temporary and disappears when the container is shut down or restarted.
* Files written to this storage are only visible to processes running in the current container.
* There are no capacity guarantees. The available storage depends on the amount of disk space available in the container.

## Temporary storage

You can mount an ephemeral volume that is equivalent to [emptyDir](https://kubernetes.io/docs/concepts/storage/volumes/#emptydir) in Kubernetes. Temporary storage is scoped to a single replica.

Temporary storage has the following characteristics:

* Files are persisted for the lifetime of the replica.
    * If a container in a replica restarts, the files in the volume remain.
* Any containers in the replica can mount the same volume.
* A container can mount multiple temporary volumes.
* There are no capacity guarantees. The available storage depends on the amount of disk space available in the replica.

To configure temporary storage, first define an `EmptyDir` volume in the revision. Then define a volume mount in one or more containers in the revision.

### Prerequisites

| Requirement | Instructions |
|--|--|
| Azure account | If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). |
| Azure Container Apps environment | [Create a container apps environment](environment.md). |

### Configuration

::: zone pivot="aca-cli"

When using temporary storage, you must use the Azure CLI with a YAML definition to create or update your container app.

1. To update an existing container app to use temporary storage, export your app's specification to a YAML file named *app.yaml*.

    ```azure-cli
    az containerapp show -n <APP_NAME> -g <RESOURCE_GROUP_NAME> -o yaml > app.yaml
    ```

1. Make the following changes to your container app specification.

    - Add a `volumes` array to the `template` section of your container app definition and define a volume.
        - The `name` is an identifier for the volume.
        - Use `EmptyDir` as the `storageType`.
    - For each container in the template that you want to mount temporary storage, add a `volumeMounts` array to the container definition and define a volume mount.
        - The `volumeName` is the name defined in the `volumes` array.
        - The `mountPath` is the path in the container to mount the volume.

    ```yaml
    properties:
      managedEnvironmentId: /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP_NAME>/providers/Microsoft.App/managedEnvironments/<ENVIRONMENT_NAME>
      configuration:
        activeRevisionsMode: Single
      template:
        containers:
        - image: <IMAGE_NAME>
          name: my-container
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

::: zone-end

::: zone pivot="aca-arm"

To create a temporary volume and mount it in a container, make the following changes to the container apps resource in an ARM template:

- Add a `volumes` array to the `template` section of your container app definition and define a volume.
    - The `name` is an identifier for the volume.
    - Use `EmptyDir` as the `storageType`.
- For each container in the template that you want to mount temporary storage, add a `volumeMounts` array to the container definition and define a volume mount.
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

## Azure Files

You can mount a file share from [Azure Files](../storage/files/index.yml) as a volume inside a container.

For a step-by-step tutorial, refer to [Create an Azure Files storage mount in Azure Container Apps](storage-mounts-azure-files.md).

Azure Files storage has the following characteristics:

* Files written under the mount location are persisted to the file share.
* Files in the share are available via the mount location.
* Multiple containers can mount the same file share, including ones that are in another replica, revision, or container app.
* All containers that mount the share can access files written by any other container or method.
* More than one Azure Files volume can be mounted in a single container.

To enable Azure Files storage in your container, you need to set up your container in the following ways:

* Create a storage definition of type `AzureFile` in the Container Apps environment.
* Define a storage volume in a revision.
* Define a volume mount in one or more containers in the revision.

#### Prerequisites

| Requirement | Instructions |
|--|--|
| Azure account | If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). |
| Azure Storage account | [Create a storage account](../storage/common/storage-account-create.md?tabs=azure-cli#create-a-storage-account-1). |
| Azure Container Apps environment | [Create a container apps environment](environment.md). |

### Configuration

::: zone pivot="aca-cli"

When using Azure Files, you must use the Azure CLI with a YAML definition to create or update your container app.

1. Add a storage definition of type `AzureFile` to your Container Apps environment.
  
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

    - Add a `volumes` array to the `template` section of your container app definition and define a volume.
        - The `name` is an identifier for the volume.
        - For `storageType`, use `AzureFile`.
        - For `storageName`, use the name of the storage you defined in the environment.
    - For each container in the template that you want to mount Azure Files storage, add a `volumeMounts` array to the container definition and define a volume mount.
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

::: zone-end

::: zone pivot="aca-arm"

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

    - Add a `volumes` array to the `template` section of your container app definition and define a volume.
        - The `name` is an identifier for the volume.
        - For `storageType`, use `AzureFile`.
        - For `storageName`, use the name of the storage you defined in the environment.
    - For each container in the template that you want to mount Azure Files storage, add a `volumeMounts` array to the container definition and define a volume mount.
        - The `volumeName` is the name defined in the `volumes` array.
        - The `mountPath` is the path in the container to mount the volume.

See the [ARM template API specification](azure-resource-manager-api-spec.md) for a full example.

::: zone-end
