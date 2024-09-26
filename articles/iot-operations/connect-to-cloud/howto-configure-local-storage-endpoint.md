---
title: Configure local storage dataflow endpoint in Azure IoT Operations
description: Learn how to configure a local storage dataflow endpoint in Azure IoT Operations.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 09/26/2024
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

Use the local storage option to send data to a locally available persistent volume, through which you can upload data via Edge Storage Accelerator edge volumes.

# [Portal](#tab/portal)

1. In the IoT Operations portal, select the **Dataflow endpoints** tab.
1. Under **Create new dataflow endpoint**, select **Local Storage** > **New**.

    :::image type="content" source="media/howto-configure-local-storage-endpoint/create-local-storage-endpoint.png" alt-text="Screenshot using Azure Operations portal to create a Local Storage dataflow endpoint.":::

1. Enter the following settings for the endpoint:

    | Setting               | Description                                                             |
    | --------------------- | ------------------------------------------------------------------------------------------------- |
    | Name                  | The name of the dataflow endpoint.                                      |
    | Persistent volume claim name | The name of the PersistentVolumeClaim (PVC) to use for local storage.                        |

1. Select **Apply** to provision the endpoint.

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

---

## Configure dataflow destination

Once the endpoint is created, you can use it in a dataflow by specifying the endpoint name in the dataflow's destination settings.

# [Portal](#tab/portal)

1. In the Azure IoT Operations Preview portal, create a new dataflow or edit an existing dataflow by selecting the **Dataflows** tab on the left. If creating a new dataflow, select a source for the dataflow.
1. In the editor, select the destination dataflow endpoint.
1. Choose the Local Storage endpoint that you created previously.

    :::image type="content" source="media/howto-configure-local-storage-endpoint/dataflow-mq-local-storage.png" alt-text="Screenshot using Azure Operations portal to create a dataflow with an MQTT source and local storage.":::

1. Enter the following settings for the endpoint:

    | Settings      | Description                                                                                       |
    | ------------- | ------------------------------------------------------------------------------------------------- |
    | Folder name   | The name of the folder where the data should be stored.                                           |
    | Schema name   | The name of the schema that defines the structure of the data.                                     |
    | Output schema | The schema that matches the source data. You can select an existing schema or upload a new one to the schema registry. |

1. Select **Apply** to provision the dataflow.

# [Kubernetes](#tab/kubernetes)

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: Dataflow
metadata:
  name: my-dataflow
  namespace: azure-iot-operations
spec:
  profileRef: default
  mode: Enabled
  operations:
    - operationType: Source
      sourceSettings:
        endpointRef: mq
        dataSources:
          *
    - operationType: Destination
      destinationSettings:
        endpointRef: esa
```

---

For more information about dataflow destination settings, see [Create a dataflow](howto-create-dataflow.md).

> [!NOTE]
> Using the local storage endpoint as a source in a dataflow isn't supported. You can use the endpoint as a destination only.


## Supported serialization formats

The only supported serialization format is Parquet.