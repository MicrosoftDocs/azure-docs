---
title: Configure local storage dataflow endpoint in Azure IoT Operations
description: Learn how to configure a local storage dataflow endpoint in Azure IoT Operations.
author: PatAltimore
ms.author: patricka
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 10/30/2024
ai-usage: ai-assisted

#CustomerIntent: As an operator, I want to understand how to configure a local storage dataflow endpoint so that I can create a dataflow.
---

# Configure dataflow endpoints for local storage

[!INCLUDE [kubernetes-management-preview-note](../includes/kubernetes-management-preview-note.md)]

To send data to local storage in Azure IoT Operations, you can configure a dataflow endpoint. This configuration allows you to specify the endpoint, authentication, table, and other settings.

## Prerequisites

- An instance of [Azure IoT Operations](../deploy-iot-ops/howto-deploy-iot-operations.md)
- A [PersistentVolumeClaim (PVC)](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)

## Create a local storage dataflow endpoint

Use the local storage option to send data to a locally available persistent volume, through which you can upload data via Azure Container Storage enabled by Azure Arc edge volumes.

# [Portal](#tab/portal)

1. In the operations experience, select the **Dataflow endpoints** tab.
1. Under **Create new dataflow endpoint**, select **Local Storage** > **New**.

    :::image type="content" source="media/howto-configure-local-storage-endpoint/create-local-storage-endpoint.png" alt-text="Screenshot using operations experience to create a Local Storage dataflow endpoint.":::

1. Enter the following settings for the endpoint:

    | Setting               | Description                                                             |
    | --------------------- | ------------------------------------------------------------------------------------------------- |
    | Name                  | The name of the dataflow endpoint.                                      |
    | Persistent volume claim name | The name of the PersistentVolumeClaim (PVC) to use for local storage.                        |

1. Select **Apply** to provision the endpoint.

# [Bicep](#tab/bicep)

Create a Bicep `.bicep` file with the following content.

```bicep
param aioInstanceName string = '<AIO_INSTANCE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'
param endpointName string = '<ENDPOINT_NAME>'
param persistentVCName string = '<PERSISTENT_VC_NAME>'

resource aioInstance 'Microsoft.IoTOperations/instances@2024-11-01' existing = {
  name: aioInstanceName
}
resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}
resource localStorageDataflowEndpoint 'Microsoft.IoTOperations/instances/dataflowEndpoints@2024-11-01' = {
  parent: aioInstance
  name: endpointName
  extendedLocation: {
    name: customLocation.id
    type: 'CustomLocation'
  }
  properties: {
    endpointType: 'LocalStorage'
    localStorageSettings: {
      persistentVolumeClaimRef: persistentVCName
    }
  }
}
```

Then, deploy via Azure CLI.

```azurecli
az deployment group create --resource-group <RESOURCE_GROUP> --template-file <FILE>.bicep
```

# [Kubernetes (preview)](#tab/kubernetes)

Create a Kubernetes manifest `.yaml` file with the following content.

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: DataflowEndpoint
metadata:
  name: <ENDPOINT_NAME>
  namespace: azure-iot-operations
spec:
  endpointType: LocalStorage
  localStorageSettings:
    persistentVolumeClaimRef: <PVC_NAME>
```

Then apply the manifest file to the Kubernetes cluster.

```bash
kubectl apply -f <FILE>.yaml
```

---

The PersistentVolumeClaim (PVC) must be in the same namespace as the *DataflowEndpoint*.

## Supported serialization formats

The only supported serialization format is Parquet.

## Use Azure Container Storage enabled by Azure Arc (ACSA)

You can use the local storage dataflow endpoint together with [Azure Container Storage enabled by Azure Arc](/azure/azure-arc/container-storage/cloud-ingest-edge-volume-configuration) to store data locally or send data to a cloud destination.

### Local shared volume

To write to a local shared volume, first create a PersistentVolumeClaim (PVC) according to the instructions from [Local Shared Edge Volumes](/azure/azure-arc/container-storage/local-shared-edge-volumes).

Then, when configuring your local storage dataflow endpoint, input the PVC name under `persistentVolumeClaimRef`.

### Cloud ingest

To write your data to the cloud, follow the instructions in [Cloud Ingest Edge Volumes configuration](/azure/azure-arc/container-storage/cloud-ingest-edge-volume-configuration) to create a PVC and attach a subvolume for your desired cloud destination.

> [!IMPORTANT]
> Don't forget to create the subvolume after creating the PVC, or else the dataflow fails to start and the logs show a "read-only file system" error.

Then, when configuring your local storage dataflow endpoint, input the PVC name under `persistentVolumeClaimRef`.

Finally, when you create the dataflow, the [data destination](howto-create-dataflow.md#configure-data-destination-topic-container-or-table) parameter must match the `spec.path` parameter you created for your subvolume during configuration.

## Next steps

To learn more about dataflows, see [Create a dataflow](howto-create-dataflow.md).