---
title: Configure local storage dataflow endpoint in Azure IoT Operations
description: Learn how to configure a local storage dataflow endpoint in Azure IoT Operations.
author: PatAltimore
ms.author: patricka
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 10/22/2024
ai-usage: ai-assisted

#CustomerIntent: As an operator, I want to understand how to configure a local storage dataflow endpoint so that I can create a dataflow.
---

# Configure dataflow endpoints for local storage

To send data to local storage in Azure IoT Operations, you can configure a dataflow endpoint. This configuration allows you to specify the endpoint, authentication, table, and other settings.

## Prerequisites

- An instance of [Azure IoT Operations](../deploy-iot-ops/howto-deploy-iot-operations.md)
- A [configured dataflow profile](howto-configure-dataflow-profile.md)
- A [PersistentVolumeClaim (PVC)](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)

## Create a local storage dataflow endpoint

Use the local storage option to send data to a locally available persistent volume, through which you can upload data via Azure Container Storage enabled by Azure Arc edge volumes.

# [Bicep](#tab/bicep)

Create a Bicep `.bicep` file with the following content.

```bicep
param aioInstanceName string = '<AIO_INSTANCE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'
param endpointName string = '<ENDPOINT_NAME>'
param persistentVCName string = '<PERSISTENT_VC_NAME>'

resource aioInstance 'Microsoft.IoTOperations/instances@2024-08-15-preview' existing = {
  name: aioInstanceName
}
resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}
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

Then, deploy via Azure CLI.

```azurecli
az stack group create --name <DEPLOYMENT_NAME> --resource-group <RESOURCE_GROUP> --template-file <FILE>.bicep
```

# [Kubernetes](#tab/kubernetes)

Create a Kubernetes manifest `.yaml` file with the following content.

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: DataflowEndpoint
metadata:
  name: <ENDPOINT_NAME>
  namespace: azure-iot-operations
spec:
  endpointType: localStorage
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

## Next steps

- [Create a dataflow](howto-create-dataflow.md)