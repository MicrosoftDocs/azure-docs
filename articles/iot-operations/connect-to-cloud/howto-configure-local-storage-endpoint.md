---
title: Configure local storage dataflow endpoint in Azure IoT Operations
description: Learn how to configure a local storage dataflow endpoint in Azure IoT Operations.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 10/02/2024
ai-usage: ai-assisted

#CustomerIntent: As an operator, I want to understand how to configure a local storage dataflow endpoint so that I can create a dataflow.
---

# Configure dataflow endpoints for local storage

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

To send data to local storage in Azure IoT Operations Preview, you can configure a dataflow endpoint. This configuration allows you to specify the endpoint, authentication, table, and other settings.

## Prerequisites

- An instance of [Azure IoT Operations Preview](../deploy-iot-ops/howto-deploy-iot-operations.md)
- A [configured dataflow profile](howto-configure-dataflow-profile.md)
- A [PersistentVolumeClaim (PVC)](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)

## Create a local storage dataflow endpoint

Use the local storage option to send data to a locally available persistent volume, through which you can upload data via Azure Container Storage enabled by Azure Arc edge volumes.

# [Kubernetes](#tab/kubernetes)

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: DataflowEndpoint
metadata:
  name: esa
  namespace: azure-iot-operations
spec:
  endpointType: localStorage
  localStorageSettings:
    persistentVolumeClaimRef: <PVC-NAME>
```

The PersistentVolumeClaim (PVC) must be in the same namespace as the *DataflowEndpoint*.

# [Bicep](#tab/bicep)

1. This [single Bicep template file](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/quickstarts/localStorage-df.bicep) from the *explore-iot-operations* repository deploys a sample dataflow and dataflow endpoint resources for data to Local Storage. Download the template file and customize it according to your environment.

2. Deploy the resources using the [az stack group](/azure/azure-resource-manager/bicep/deployment-stacks?tabs=azure-powershell) command in your terminal:

    ```azurecli
    az stack group create --name MyDeploymentStack \
    --resource-group <RESOURCE_GROUP> --template-file <filename>.bicep \
    --action-on-unmanage 'deleteResources' --deny-settings-mode 'none' --yes
    ```

This endpoint is the destination for the dataflow that receives messages to Local storage.

```bicep
param aioInstanceName string = '<AIO_INSTANCE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'
param endpointName string = '<ENDPOINT_NAME>'
param persistentVCName string = '<PERSISTENT_VC_NAME>'

resource localStorageDataflowEndpoint 'Microsoft.IoTOperations/instances/dataflowEndpoints@2024-08-15-preview' = {
  parent: aioInstance
  name: endpointName
  extendedLocation: {
    name: customLocationName
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

## Supported serialization formats

The only supported serialization format is Parquet.