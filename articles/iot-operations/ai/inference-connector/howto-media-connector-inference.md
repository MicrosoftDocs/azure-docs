---
title: Run inference on camera images captured by the media connector (preview)
description: Learn how to combine the media connector, data flow graphs, and the inference connector to run a machine learning model on the camera image taken when an event happens.
author: jkarangula
ms.author: jkarangula
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 11/11/2026
ai-usage: ai-assisted

#CustomerIntent: As a solution builder, I want to run a machine learning model on the camera image taken when an event happens, so that I can detect defects and other conditions at the edge and act on the result.
---

# Run inference on camera images captured by the media connector (preview)

This article shows you how to build an event-driven image inference pipeline in Azure IoT Operations. When a trigger message arrives, for example from a programmable logic controller (PLC) when a part reaches an inspection station, the pipeline:

1. Gets the camera image taken at the time of the trigger from the [media connector](../../discover-manage-assets/howto-use-media-connector.md).
1. Runs a machine learning model on the image through the [inference connector](overview-inference-connector.md) and Foundry Local.
1. Publishes the model's results, such as the defects that it detected, to an MQTT topic for your applications.

This article uses a YOLOv8 object detection model as an example, but the same pipeline works for other image models.

This article builds on the media connector articles. For camera devices, assets, and recording streams, see [Configure the media connector](../../discover-manage-assets/howto-use-media-connector.md). For storage roots and retention, see [Configure storage and retention for the media connector](../../discover-manage-assets/howto-configure-media-connector-storage.md). For the `ExtractClip` action that captures the image, see [Use media connector mRPC management actions](../../discover-manage-assets/howto-use-media-connector-actions.md).

[!INCLUDE [inference-connector-preview-note](../../includes/inference-connector-preview-note.md)]

## Architecture

The pipeline connects the components through the MQTT broker, and passes images between them through a shared volume:

:::image type="content" source="media/media-inference-architecture.svg" alt-text="Architecture diagram of a trigger and a camera in the factory, and the media connector, inference connector, and two data flows exchanging MQTT messages through the broker, sharing files on a volume, and calling Foundry Local." lightbox="media/media-inference-architecture.svg" border="false":::

| Component | Role |
|--|--|
| Trigger | Any MQTT client that decides that an image should be analyzed, such as a PLC through a connector, a schedule, an operator action, or another application. |
| MQTT broker | Carries the trigger, the requests and responses between the data flows and the connectors, and the results. |
| Data flow 1 (capture) | Subscribes to the trigger topic. For each trigger, it asks the media connector for the images taken just before the trigger, and publishes the media connector's response to a capture topic. |
| Media connector | Records snapshots from the camera continuously. When it receives a request, it copies the requested snapshots to the shared volume, and returns their paths. |
| Shared volume | A persistent volume claim (PVC) that the media connector, the inference connector, and data flow 2 all mount. Images and model outputs move through the volume, not through the MQTT broker. |
| Data flow 2 (inference) | Subscribes to the capture topic, and runs three stages: pre-processing picks the image to analyze, inference runs the model on it, and post-processing converts the model output into results that your applications can use. |
| Inference connector | Reads the image from the shared volume, calls the model, and writes the model output to the volume. |
| Foundry Local | Hosts the model on the cluster. |
| Your application | Subscribes to the result topic, and acts on the results. |

The inference transform in data flow 2 is a prebuilt transform that Azure IoT Operations provides on `mcr.microsoft.com`. The capture, pre-processing, and post-processing transforms are sample WebAssembly (WASM) modules on the GitHub Container Registry (`ghcr.io`). See [About the sample transforms](#about-the-sample-transforms). To adapt them to your cameras and models, see [Customize the sample transforms](#customize-the-sample-transforms).

### Message flow

The following diagram shows the messages for one trigger:

:::image type="content" source="media/media-inference-sequence.svg" alt-text="Sequence diagram of a trigger, the ExtractClip request to the media connector, the capture message, the three inference stages, the predict request to the inference connector and Foundry Local, and the published result." lightbox="media/media-inference-sequence.svg" border="false":::

1. A client publishes a trigger message. The capture transform in data flow 1 uses the timestamp of the message as the event time.
1. Data flow 1 sends an `ExtractClip` request in `CopySource` mode to the camera asset, for the snapshots taken in a short window before the event. The media connector copies them from its private recording buffer to the shared volume, and responds with each copy's path and its time offset from the event.
1. Data flow 1 publishes the response to the capture topic. Separating capture from inference with a topic lets you change, scale, and reuse each data flow independently. Other applications can also subscribe to the captures.
1. In data flow 2, the pre-processing transform picks the copy taken nearest to the event, and outputs its path relative to the inference connector's read folder.
1. The inference transform sends a `predict` command with the path to the inference connector. The connector reads the image from the shared volume, sends it to Foundry Local, writes the model output to the shared volume, and returns the name of the output file.
1. The post-processing transform reads the model output from the shared volume, keeps the detections above a confidence threshold, adds their labels, and publishes them to the result topic.

All the messages keep the user properties of the trigger. To match each result with its trigger, add a correlation identifier, such as `trigger-id`, as a user property of the trigger message.

The stages that you need depend on your model. Foundry Local converts image inputs to the model's input shape, so this example's pre-processing stage only selects the image. If your model needs other input processing, use a custom pre-processing transform. If your applications can use the raw model output, you can omit post-processing.

### Topics and payloads

This article uses the following topics:

| Topic | Publisher | Payload |
|--|--|--|
| `media/trigger` | Your trigger source | Any payload. Optional user properties: `__ts`, the time of the event, and a correlation identifier such as `trigger-id`. |
| `media/capture` | Data flow 1 | The `ExtractClip` response of the media connector. To learn about its fields, see [ExtractClip response](../../discover-manage-assets/howto-use-media-connector-actions.md#extractclip-response). |
| `media/inference` | Data flow 2 | A JSON array of detections, for example `[{"label": "defect", "confidence": 0.69, "box": [154, 149, 180, 172]}]`. The box contains the pixel coordinates of the top-left and bottom-right corners. |

### Image paths on the shared volume

The media connector, the inference connector, and data flow 2 use the same PVC, but each one mounts it at its own path and builds file paths from its own settings. The following table shows how the path of one image, and of its model output, is built at each step. The values come from this article's configuration: the media connector mounts the PVC at `/local-shared`, and the inference connector mounts it at `/data`. Both mount paths are settings that you choose.

| Step | Path in this article | Built from |
|--|--|--|
| The media connector copies the image to | `/local-shared/media/recordings/<DEVICE>/<ENDPOINT>/<ASSET>/<STREAM>/snapshot_<TIME>.jpg` | The media connector's `localSharedPath` (`/local-shared/media`), the stream's destination path (`recordings`), the device, endpoint, asset, and stream names, and the snapshot's file name. |
| The media connector reports the copy as | `recordings/<DEVICE>/<ENDPOINT>/<ASSET>/<STREAM>/snapshot_<TIME>.jpg` | The same path, relative to `localSharedPath`. To learn more, see [Resolve response paths](../../discover-manage-assets/howto-use-media-connector-actions.md#resolve-response-paths). |
| The inference transform sends the path | `recordings/<DEVICE>/<ENDPOINT>/<ASSET>/<STREAM>/snapshot_<TIME>.jpg` | The reported path of the snapshot nearest to the event, which the pre-processing transform selects. |
| The inference connector reads the image from | `/data/media/recordings/<DEVICE>/<ENDPOINT>/<ASSET>/<STREAM>/snapshot_<TIME>.jpg` | The model's `data-volume` settings, `mount-path` (`/data`) and `read-sub-path` (`media`), followed by the path in the request. |
| The inference connector writes the model output to | `/data/responses/<OUTPUT_FILE>` | `mount-path` and `write-sub-path` (`responses`), followed by a unique file name that the connector generates and returns in the inference result. |
| The post-processing transform reads the output from | `<OUTPUT_FILE>` in the `responses` file store | The data flow's file store, which mounts the `responses` folder of the PVC. |

For the image to be found, the inference connector's read folder must be the same folder on the PVC as the media connector's `localSharedPath`. The inference connector can then read the path that the media connector reports without changes. For the model output to be found, the data flow's file store must mount the inference connector's write folder. This article uses the following folders. You can use other folder and mount paths, if these settings match:

| Folder on the PVC | Media connector | Inference connector | Data flow 2 |
|--|--|--|--|
| `media` | `localSharedPath`: `/local-shared/media`, which is the `media` folder of the PVC mounted at `/local-shared` | `read-sub-path`: `media` | Not used |
| `responses` | Not used | `write-sub-path`: `responses` | File store `subPath`: `responses` |

## Prerequisites

[!INCLUDE [prereq-deployed-instance](../../includes/prereq-deployed-instance.md)]

[!INCLUDE [prereq-azure-cli](../../includes/prereq-azure-cli.md)]

- `kubectl` access to your cluster, and the `jq` tool.

- An inference connector deployed by following [Deploy the inference connector](howto-deploy-inference-connector.md), including the application definition, and the Foundry Local configuration and trust bundle that the connector uses. This article replaces the connector's application configuration.

- A YOLOv8 object detection model deployed in Foundry Local. The post-processing transform requires a model whose output contains non-maximum suppression (NMS) results, with one row of `x1, y1, x2, y2, confidence, class id` values for each detection. To output labels instead of class IDs, the model's information must contain the class labels. To learn how to deploy a model, see [Deploy a bring-your-own model](/azure/azure-sovereign-clouds/private/foundry-local/how-to-deploy-custom-model).

- A PVC in the `azure-iot-operations` namespace that supports the `ReadWriteMany` access mode, so the connectors and the data flow can run on different nodes. For example, a [Local Shared Edge Volume](/azure/azure-arc/container-storage/howto-configure-local-shared-edge-volumes) from Azure Container Storage enabled by Azure Arc. The PVC must have:

    - A `media` folder for the images that the media connector copies, and a `responses` folder for the model outputs. The media connector requires its storage folder to exist when it starts, and data flow 2 requires the `responses` folder to exist when it starts.
    - Permissions that let the media connector and the inference connector write to these folders. The media connector runs as user and group `65532`.

    A `ReadWriteMany` claim that's bound doesn't prove that pods on different nodes can share files. Check that pods on different nodes can write and read the same files on the claim.

- A camera, or another media source, with an RTSP endpoint that the cluster can reach.

- A media connector template instance, with a media connector version that supports the `ExtractClip` management action. To create one, see [Create a basic connector template instance](../../discover-manage-assets/howto-manage-connector-templates.md#create-a-basic-connector-template-instance). Use one media connector template for the instance: Akri assigns each media asset to every template that handles the `Microsoft.Media` endpoint type.

- A registry endpoint for `ghcr.io`, to pull the sample transforms. `ghcr.io` requires authentication even for public artifacts, so the registry endpoint uses an artifact pull secret that contains a GitHub personal access token (PAT) with the `read:packages` scope. To create the registry endpoint, see [Use a public registry](../../develop-edge-apps/howto-configure-registry-endpoint.md#use-a-public-registry). The prebuilt inference transform comes from `mcr.microsoft.com` through the `default` registry endpoint, which Azure IoT Operations creates.

[!INCLUDE [set-environment-variables](../../includes/set-environment-variables.md)]

Also set the following variables:

- `CUSTOM_LOCATION_NAME` and `ADR_NAMESPACE` are the custom location and the Azure Device Registry namespace of your instance. The commands get them for you.
- `DATA_CLAIM_NAME` is the name of the shared PVC.
- `MEDIA_TEMPLATE` is the name of the media connector template instance.
- `CAMERA_URL` is the RTSP URL of the camera, for example `rtsp://192.168.1.20:554/stream1`.
- `DEVICE_NAME` and `ASSET_NAME` are names for the device and the asset that you create for the camera in this article, for example `camera-01` and `camera-01-asset`.
- `MODEL_NAME` is a name for the model in the inference connector configuration, for example `object-detection`. Data flow 2 uses this name to call the model.
- `REGISTRY_ENDPOINT_NAME` is the name of the registry endpoint for `ghcr.io`, for example `public-ghcr`.
- `MODEL_ENDPOINT` and `FOUNDRY_LOCAL_TRUST_BUNDLE` are the endpoint URL of the Foundry Local model deployment and the name of the trust bundle secret. To learn how to find them, see [Prepare the model endpoint](howto-deploy-inference-connector.md#prepare-the-model-endpoint).

```bash
CUSTOM_LOCATION_NAME=$(az iot ops show --name $AIO_INSTANCE_NAME --resource-group $RESOURCE_GROUP --query "extendedLocation.name" --output tsv | awk -F'/' '{print $NF}')
ADR_NAMESPACE=$(az iot ops show --name $AIO_INSTANCE_NAME --resource-group $RESOURCE_GROUP --query "properties.adrNamespaceRef.resourceId" --output tsv | awk -F'/' '{print $NF}')
DATA_CLAIM_NAME=<shared-pvc-name>
MEDIA_TEMPLATE=<media-connector-template-name>
CAMERA_URL=<camera-rtsp-url>
DEVICE_NAME=<camera-device-name>
ASSET_NAME=<camera-asset-name>
MODEL_NAME=<model-name>
REGISTRY_ENDPOINT_NAME=public-ghcr
MODEL_ENDPOINT=<model-endpoint-url>
FOUNDRY_LOCAL_TRUST_BUNDLE=<foundry-local-trust-bundle-name>
```

The other names in this article, such as the topics, folders, and data flow names, are examples. If you change them, change them everywhere that the article uses them.

## Set up the media connector and the camera

In this section, you configure storage in the media connector template, and create a device and an asset for the camera. The asset records one JPEG snapshot every second to the connector's private local storage, which keeps snapshots for 10 minutes. The shared volume only receives the snapshots that data flow 1 requests.

### Mount the shared volume in the media connector

Check that the instance has exactly one media connector template, and that its name matches `MEDIA_TEMPLATE`:

```bash
kubectl get connectortemplates.akri.iotoperations.azure.com -n azure-iot-operations -o json |
  jq -r '.items[] | select(any(.spec.deviceInboundEndpointTypes[]?; .endpointType == "Microsoft.Media")) | .metadata.name'
```

If the command prints nothing, [create a media connector template instance](../../discover-manage-assets/howto-manage-connector-templates.md#create-a-basic-connector-template-instance), and run the command again.

Then mount the shared PVC in the template at `/local-shared`. Don't mount it at `/tmp`, which contains the connector's private staging folder. To learn more, see [Configure a persistent volume claim for the media connector](../../discover-manage-assets/howto-manage-connector-templates.md#configure-a-persistent-volume-claim-for-the-media-connector).

If the template doesn't mount any PVC yet, run the following command:

```azurecli
az iot ops connector template update --name $MEDIA_TEMPLATE --instance $AIO_INSTANCE_NAME --resource-group $RESOURCE_GROUP --storage-volumes claimName=$DATA_CLAIM_NAME mountPath=/local-shared
```

The `--storage-volumes` parameter replaces the volumes of the template. If the template already mounts a PVC, add the shared PVC to the existing volumes instead:

1. Open the connector template for editing:

    ```bash
    kubectl edit connectortemplate $MEDIA_TEMPLATE --namespace azure-iot-operations
    ```

1. Add the shared PVC to the `persistentVolumeClaims` list, and save the template. Replace `<DATA_CLAIM_NAME>` with the name of your shared PVC. Keep any volumes that the template already has.

    ```yaml
    spec:
      runtimeConfiguration:
        managedConfigurationSettings:
          persistentVolumeClaims:
            - claimName: <DATA_CLAIM_NAME>
              mountPath: /local-shared
    ```

### Set the storage root and retention

Set the media connector's local shared storage root to the `media` folder of the PVC. `ExtractClip` copies the requested snapshots there. The Azure CLI doesn't set the connector's additional configuration, so edit the template on the cluster:

1. Open the connector template for editing:

    ```bash
    kubectl edit connectortemplate $MEDIA_TEMPLATE --namespace azure-iot-operations
    ```

1. Merge the following settings into the template, and save it. This YAML is a fragment, not a complete template: keep the template's other settings, such as its image, MQTT connection, and volumes, and any storage settings that it already has.

    ```yaml
    spec:
      runtimeConfiguration:
        runtimeConfigurationType: managedConfiguration
        managedConfigurationSettings:
          managedConfigurationType: imageConfiguration
          imageConfigurationSettings:
            replicas: 1
          allocation:
            policy: Bucketized
            bucketSize: 100
          additionalConfiguration:
            localSharedPath: "/local-shared/media"
            localStoreSnapshotRetentionMinutes: "10"
            localSharedSnapshotRetentionMinutes: "60"
            localSharedRetentionIntervalMinutes: "60"
    ```

    These settings:

    - Set `localSharedPath` to the `media` folder of the PVC, which you mounted at `/local-shared`.
    - Keep snapshots in local storage for 10 minutes, and copies on the shared volume for 60 minutes, the shortest supported value. The connector checks retention every 60 minutes, so it deletes copies one to two hours after the snapshot was taken.
    - Run one connector replica. Only one media connector process can write to and clean up a storage folder.

    To learn more about these settings, see [Configure storage roots and retention](../../discover-manage-assets/howto-configure-media-connector-storage.md#configure-storage-roots-and-retention).

### Create a device for the camera

Create a device with an inbound endpoint, named `rtsp`, for the camera's RTSP URL. To learn more about devices for the media connector, see [Create a device with a media endpoint](../../discover-manage-assets/howto-use-media-connector.md#create-a-device-with-a-media-endpoint).

# [Operations experience](#tab/portal)

1. In the operations experience web UI, select **Devices** in the left navigation pane. Then select **Create new**.

1. Enter the value of `DEVICE_NAME` as the name of the device. To add the endpoint, select **New** on the **Microsoft.Media** tile.

1. Enter `rtsp` as the name of the endpoint, and the RTSP URL of the camera as its address. If the camera requires credentials, add them. Select **Apply** to save the endpoint.

1. Select **Next** until you reach the **Summary** page, and then select **Create**.

# [Azure CLI](#tab/cli)

Run the following commands:

```azurecli
az iot ops ns device create --name $DEVICE_NAME --instance $AIO_INSTANCE_NAME --resource-group $RESOURCE_GROUP

az iot ops ns device endpoint inbound add media --device $DEVICE_NAME --instance $AIO_INSTANCE_NAME --resource-group $RESOURCE_GROUP --name rtsp --endpoint-address $CAMERA_URL
```

To learn more, see [az iot ops ns device](/cli/azure/iot/ops/ns/device).

# [Bicep](#tab/bicep)

1. Save the following Bicep file as `camera-device.bicep`:

    ```bicep
    param adrNamespaceName string
    param customLocationName string
    param deviceName string
    param cameraUrl string

    resource adrNamespace 'Microsoft.DeviceRegistry/namespaces@2026-04-01' existing = {
      name: adrNamespaceName
    }

    resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
      name: customLocationName
    }

    resource device 'Microsoft.DeviceRegistry/namespaces/devices@2026-04-01' = {
      name: deviceName
      parent: adrNamespace
      location: resourceGroup().location
      extendedLocation: {
        type: 'CustomLocation'
        name: customLocation.id
      }
      properties: {
        enabled: true
        endpoints: {
          outbound: {
            assigned: {}
          }
          inbound: {
            rtsp: {
              endpointType: 'Microsoft.Media'
              address: cameraUrl
            }
          }
        }
      }
    }
    ```

1. Deploy the Bicep file:

    ```azurecli
    az deployment group create \
      --resource-group $RESOURCE_GROUP \
      --name camera-device \
      --template-file camera-device.bicep \
      --parameters adrNamespaceName=$ADR_NAMESPACE customLocationName=$CUSTOM_LOCATION_NAME deviceName=$DEVICE_NAME cameraUrl=$CAMERA_URL
    ```

---

The device uses anonymous access to the camera. To use a username and password, see [Configure a device to use a username and password](../../discover-manage-assets/howto-use-media-connector.md#configure-a-device-to-use-a-username-and-password).

### Create an asset for the camera

Create an asset for the camera's `rtsp` endpoint that has:

- A `snapshot-to-fs` stream, `snapshots`, that records one JPEG snapshot every second to `recordings`, a relative path in the connector's local storage. To learn more about destination paths, see [Filesystem destination paths](../../discover-manage-assets/howto-use-media-connector.md#filesystem-destination-paths).
- The `ExtractClip` management action in a management group named `control`. Data flow 1 calls this action. To learn more about the action, see [Register the actions on the asset](../../discover-manage-assets/howto-use-media-connector-actions.md#register-the-actions-on-the-asset).

# [Operations experience](#tab/portal)

1. In the operations experience web UI, select **Assets** in the left navigation pane. Then select **Create asset**.

1. Select the `rtsp` inbound endpoint of your camera device, and enter the value of `ASSET_NAME` as the name of the asset. Select **Next** to continue.

1. On the **Streams** page, select **Add stream**, and enter the following values:

    | Field | Value |
    | --- | --- |
    | Name | `snapshots` |
    | Task type | `snapshot-to-fs` |
    | Format | `jpeg` |
    | Snapshots per second | `1` |
    | Destination | Storage, with the path `recordings` |

    Select **Add** to save the stream.

1. Select **Next** until you reach the **Review** page, and then select **Create**.

1. Add the `ExtractClip` management action to the asset by running the `mgmt-group add` and `mgmt-action add` commands in the **Azure CLI** tab.

# [Azure CLI](#tab/cli)

Run the following commands:

```azurecli
# Create the asset
az iot ops ns asset media create --name $ASSET_NAME --instance $AIO_INSTANCE_NAME --resource-group $RESOURCE_GROUP --device $DEVICE_NAME --endpoint rtsp

# Add a stream that records one JPEG snapshot every second to local storage
az iot ops ns asset media stream add --asset $ASSET_NAME --instance $AIO_INSTANCE_NAME --resource-group $RESOURCE_GROUP --name snapshots --task-type snapshot-to-fs --format jpeg --snapshots-per-sec 1 --dest path=recordings --disable-autostart false

# Add the ExtractClip management action
az iot ops ns asset mgmt-group add --asset $ASSET_NAME --instance $AIO_INSTANCE_NAME --resource-group $RESOURCE_GROUP --name control

az iot ops ns asset mgmt-action add --asset $ASSET_NAME --instance $AIO_INSTANCE_NAME --resource-group $RESOURCE_GROUP --group control --name ExtractClip --action-type Call --target-uri ExtractClip --type-ref ExtractClip --topic "azure-iot-operations/asset-operations/$ASSET_NAME/control/ExtractClip"
```

To learn more, see [az iot ops ns asset media](/cli/azure/iot/ops/ns/asset/media) and [az iot ops ns asset mgmt-action](/cli/azure/iot/ops/ns/asset/mgmt-action).

# [Bicep](#tab/bicep)

1. Save the following Bicep file as `camera-asset.bicep`:

    ```bicep
    param adrNamespaceName string
    param customLocationName string
    param deviceName string
    param assetName string

    resource adrNamespace 'Microsoft.DeviceRegistry/namespaces@2026-04-01' existing = {
      name: adrNamespaceName
    }

    resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
      name: customLocationName
    }

    resource asset 'Microsoft.DeviceRegistry/namespaces/assets@2026-04-01' = {
      name: assetName
      parent: adrNamespace
      location: resourceGroup().location
      extendedLocation: {
        type: 'CustomLocation'
        name: customLocation.id
      }
      properties: {
        enabled: true
        deviceRef: {
          deviceName: deviceName
          endpointName: 'rtsp'
        }
        streams: [
          {
            name: 'snapshots'
            streamConfiguration: '{"taskType":"snapshot-to-fs","autostart":true,"snapshotsPerSecond":1,"format":"jpeg"}'
            destinations: [
              {
                target: 'Storage'
                configuration: {
                  path: 'recordings'
                }
              }
            ]
          }
        ]
        managementGroups: [
          {
            name: 'control'
            actions: [
              {
                name: 'ExtractClip'
                actionType: 'Call'
                targetUri: 'ExtractClip'
                typeRef: 'ExtractClip'
                topic: 'azure-iot-operations/asset-operations/${assetName}/control/ExtractClip'
              }
            ]
          }
        ]
      }
    }
    ```

1. Deploy the Bicep file:

    ```azurecli
    az deployment group create \
      --resource-group $RESOURCE_GROUP \
      --name camera-asset \
      --template-file camera-asset.bicep \
      --parameters adrNamespaceName=$ADR_NAMESPACE customLocationName=$CUSTOM_LOCATION_NAME deviceName=$DEVICE_NAME assetName=$ASSET_NAME
    ```

---

### Check the asset

Wait until the asset reports its stream and action on the cluster without errors:

```bash
kubectl get assets.namespaces.deviceregistry.microsoft.com $ASSET_NAME -n azure-iot-operations -o json |
  jq '{stream: .status.streams, action: [.status.managementGroups[]?.actions[]?], health: .status.healthState}'
```

The output lists the `snapshots` stream and the `ExtractClip` action, and neither has an `error` field. If they don't appear after a few minutes, check the logs of the media connector pod. To test the action on its own, see [Invoke an action](../../discover-manage-assets/howto-use-media-connector-actions.md#invoke-an-action).

## Configure the inference connector to read the captured images

The inference connector reads the images from the folder that the media connector copies them to. The following configuration replaces the connector's application configuration with one model that:

- Accepts `predict` commands from data flow graphs, through its `mrpc` settings.
- Mounts the shared PVC at `/data`, and reads request files from the `media` folder, which is the media connector's `localSharedPath` folder.
- Writes the model output to the `responses` folder of the PVC, and returns the file name instead of the output, so large outputs don't pass through the MQTT broker.

The inference connector mounts the whole PVC, but it only reads from the media connector's folder. Keep its write folder outside the media connector's `localSharedPath`: only the media connector can write to and clean up that folder. To learn more, see [Plan the deployment boundary](../../discover-manage-assets/howto-configure-media-connector-storage.md#plan-the-deployment-boundary).

> [!IMPORTANT]
> The configuration replaces all the models in the connector's application configuration. If the connector serves other models, add this model's entry and the shared PVC to the existing configuration instead. Don't deploy a second inference connector for this pipeline.

The Azure CLI doesn't have commands for Azure IoT Operations applications, so this step uses Bicep, as in [Deploy the inference connector](howto-deploy-inference-connector.md).

1. Save the following Bicep file as `inference-connector-media.bicep`:

    ```bicep
    param aioInstanceName string
    param customLocationName string
    param applicationName string = 'inference-connector'
    param modelName string
    param modelEndpoint string
    param trustBundleName string
    param dataClaimName string
    @description('Folder on the PVC that request paths are relative to: the media connector\'s localSharedPath folder.')
    param readSubPath string = 'media'
    param writeSubPath string = 'responses'

    resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
      name: customLocationName
    }

    resource aioInstance 'Microsoft.IoTOperations/instances@2026-09-03-preview' existing = {
      name: aioInstanceName
    }

    resource applicationDefinition 'Microsoft.IoTOperations/instances/aioApplicationDefinitions@2026-09-03-preview' existing = {
      parent: aioInstance
      name: applicationName
    }

    resource applicationConfiguration 'Microsoft.IoTOperations/instances/aioApplicationDefinitions/aioApplicationConfigurations@2026-09-03-preview' = {
      parent: applicationDefinition
      name: applicationName
      extendedLocation: {
        type: 'CustomLocation'
        name: customLocation.id
      }
      properties: {
        configuration: {
          models: [
            {
              name: modelName
              'inference-provider': 'FoundryLocal'
              'http-endpoint': modelEndpoint
              'fl-client-max-retries': 3
              auth: {
                sat: {}
              }
              'trust-bundle': {
                'trust-settings-key': 'ca.crt'
              }
              mrpc: {
                'worker-count': 2
              }
              'data-volume': {
                'mount-path': '/data'
                'read-sub-path': readSubPath
                'write-sub-path': writeSubPath
              }
              'write-response-to-disk': true
            }
          ]
        }
        runtimeConfiguration: {
          runtimeConfigurationType: 'ImageConfiguration'
          imageConfigurationSettings: {
            replicas: 1
            imagePullPolicy: 'IfNotPresent'
            persistentVolumeClaims: [
              {
                claimName: dataClaimName
                mountPath: '/data'
              }
            ]
            trustSettings: {
              trustListSecretRef: trustBundleName
            }
          }
        }
      }
    }
    ```

    For a description of each setting, see [Inference connector configuration reference](reference-inference-connector-configuration.md).

1. Deploy the Bicep file:

    ```azurecli
    az deployment group create \
      --resource-group $RESOURCE_GROUP \
      --name inference-connector-media \
      --template-file inference-connector-media.bicep \
      --parameters aioInstanceName=$AIO_INSTANCE_NAME customLocationName=$CUSTOM_LOCATION_NAME \
        modelName=$MODEL_NAME modelEndpoint=$MODEL_ENDPOINT trustBundleName=$FOUNDRY_LOCAL_TRUST_BUNDLE dataClaimName=$DATA_CLAIM_NAME
    ```

1. Check that the connector pod restarts with the new configuration, and that its logs show your model without errors:

    ```bash
    kubectl logs -n azure-iot-operations -l akri.iotoperations.azure.com/aio-application-configuration=inference-connector --tail=50
    ```

## About the sample transforms

Data flows 1 and 2 use three sample transforms. Each transform consists of a WASM module, which runs as a map operator, and a graph definition, which declares the module's settings. The data flows pull the modules and graph definitions from `ghcr.io` through your `ghcr.io` registry endpoint:

| Transform | Graph definition | WASM module | What it does |
|--|--|--|--|
| Capture | `azure-samples/explore-iot-operations/graph-media-capture:1.0.0` | `azure-samples/explore-iot-operations/media-capture:1.0.0` | Calls the `ExtractClip` action of the camera asset for each trigger, and outputs the media connector's response. |
| Pre-processing | `azure-samples/explore-iot-operations/graph-select-snapshot:1.0.0` | `azure-samples/explore-iot-operations/select-snapshot:1.0.0` | Selects the snapshot nearest to the event from the `ExtractClip` response, and outputs its path. |
| Post-processing | `azure-samples/explore-iot-operations/graph-yolov8-detections:1.0.0` | `azure-samples/explore-iot-operations/yolov8-detections:1.0.0` | Reads the YOLOv8 model output from the shared volume, and converts it into labeled detections. |

The data flows reference the graph definitions, and each graph definition references its module in the same registry.

Data flow 2 also uses the prebuilt inference transform: the graph definition `azureiotoperations/graph-dataflow-inference:0.2.0-preview.0` and its module `azureiotoperations/module-inference-engine:0.2.0`, which the data flow pulls from `mcr.microsoft.com` through the `default` registry endpoint. This version of the inference transform replaces the payload with the name of the model output file, which the post-processing transform expects. To learn more, see [Run inference in a data flow graph](howto-inference-connector-dataflow-graph.md).

The sample transforms use two host APIs of the WASM SDK:

- The *command invoker* sends mRPC requests through the MQTT broker, and returns the responses. The capture transform uses it to call the media connector's `ExtractClip` action, and the post-processing transform uses it to get the model's labels from the inference connector. To learn more, see [Call services from WASM data flow graphs with the command invoker](../../develop-edge-apps/howto-webassembly-command-invoker.md).
- The *file store* reads files from a volume that the data flow graph mounts. The post-processing transform uses it to read the model output. To learn more, see [Read and write files from WASM data flow graphs with the file store](../../develop-edge-apps/howto-webassembly-file-store.md).

### Capture transform

The capture transform calls the media connector's `ExtractClip` action in the same way as any other mRPC client. For each message, it:

1. Creates an `ExtractClip` request in `CopySource` mode, for the snapshots stored in the second before the message's timestamp, with `local-shared` as the target. To learn about the fields of the request, see [ExtractClip request](../../discover-manage-assets/howto-use-media-connector-actions.md#extractclip-request).
1. Sends the request to the request topic of the asset's `ExtractClip` action, with `ExtractClip` as the command name. To learn about the action's topic, see [Register the actions on the asset](../../discover-manage-assets/howto-use-media-connector-actions.md#register-the-actions-on-the-asset).
1. Outputs the response unchanged, even when it contains an error, so subscribers to the capture topic can see why a capture failed. To learn about the fields of the response, see [ExtractClip response](../../discover-manage-assets/howto-use-media-connector-actions.md#extractclip-response).

The data flow sets the timestamp of each message from its `__ts` user property, or to the time that it receives the message if the message doesn't have one. The media connector doesn't wait for snapshots that don't exist yet. If the media connector doesn't respond, the transform returns an error, so the data flow drops the message and logs the error.

The media connector runs one file operation at a time. If a request arrives while another one runs, the response contains a `Busy:` error. To learn how to handle it, see [Retry safely](../../discover-manage-assets/howto-use-media-connector-actions.md#retry-safely).

### Pre-processing transform

The pre-processing transform reads the `ExtractClip` response, selects the copied snapshot whose `OffsetFromEventTimeMilliseconds` is nearest to zero, and outputs its `TargetPath`. The path is relative to the media connector's `localSharedPath` folder, which is the inference connector's read folder in this article, so the inference transform can send it unchanged. To learn more, see [Resolve response paths](../../discover-manage-assets/howto-use-media-connector-actions.md#resolve-response-paths).

The transform uses only snapshots whose `CopyStatus` is `Copied` or `Skipped`. A `Skipped` copy already exists on the shared volume. If two snapshots are equally near to the event, the transform selects the first one in the response. If the response doesn't contain a result, for example because of a `Busy:` error, or it doesn't contain a copied snapshot, the transform returns an error, so the data flow drops the message and logs the error. To learn more, see [Source-copy outcomes](../../discover-manage-assets/howto-use-media-connector-actions.md#source-copy-outcomes).

### Post-processing transform

The inference connector writes the model output to a file on the shared volume, and the inference transform replaces the message payload with the name of the file. For each message, the post-processing transform:

1. Reads the file from the data flow's file store whose `id` is `responses`. Data flow 2 mounts this file store from the inference connector's write folder.
1. Gets the class labels of the model, once, by sending a [getModelInfo](reference-inference-connector-commands.md#getmodelinfo) command to the inference connector. If the model's information doesn't contain labels, the transform uses the class IDs as labels.
1. Converts the model output into detections whose confidence is at least the threshold, and outputs them as a JSON array. Each detection has a `label`, a `confidence` rounded to two decimals, and a `box` with the pixel coordinates of the top-left and bottom-right corners.

The transform supports YOLOv8 models with non-maximum suppression (NMS), whose output contains one row of `x1, y1, x2, y2, confidence, class id` values for each detection, for example `{"output0_0": [[[154.2, 149.1, 180.4, 172.3, 0.69, 2.0]]]}`. To use another model, see [Customize the sample transforms](#customize-the-sample-transforms). The transform doesn't delete the model output files. See [Timing, retention, and capacity](#timing-retention-and-capacity).

## Deploy the data flows

Create a data flow profile named `media-inference` for the pipeline, along with two data flow graphs: `capture` for data flow 1, and `inference` for data flow 2. The graphs pull the sample transforms from `ghcr.io` through your `ghcr.io` registry endpoint, and the inference transform from `mcr.microsoft.com` through the `default` registry endpoint. Data flow 2 mounts the `responses` folder of the PVC as a read-only *file store*, so the post-processing transform can read the model output that the inference connector writes. To learn more about file stores, see [Read and write files from WASM data flow graphs with the file store](../../develop-edge-apps/howto-webassembly-file-store.md).

# [Operations experience](#tab/portal)

This operation isn't currently supported in the operations experience. Use the Azure CLI or Bicep to create the data flow profile and the data flow graphs.

# [Azure CLI](#tab/cli)

1. Create the data flow profile:

    ```azurecli
    az iot ops dataflow profile create --name media-inference --instance $AIO_INSTANCE_NAME --resource-group $RESOURCE_GROUP
    ```

1. Save the configuration of data flow 1 as `capture-graph.json`. The command fills in your registry endpoint and asset:

    ```bash
    cat > capture-graph.json <<EOF
    {
      "mode": "Enabled",
      "nodes": [
        {
          "nodeType": "Source",
          "name": "trigger",
          "sourceSettings": { "endpointRef": "default", "dataSources": [ "media/trigger" ] }
        },
        {
          "nodeType": "Graph",
          "name": "media-connector",
          "graphSettings": {
            "registryEndpointRef": "$REGISTRY_ENDPOINT_NAME",
            "artifact": "azure-samples/explore-iot-operations/graph-media-capture:1.0.0",
            "configuration": [
              { "key": "action_topic", "value": "azure-iot-operations/asset-operations/$ASSET_NAME/control/ExtractClip" },
              { "key": "stream_configuration_name", "value": "snapshots" }
            ]
          }
        },
        {
          "nodeType": "Destination",
          "name": "capture",
          "destinationSettings": { "endpointRef": "default", "dataDestination": "media/capture" }
        }
      ],
      "nodeConnections": [
        { "from": { "name": "trigger" }, "to": { "name": "media-connector" } },
        { "from": { "name": "media-connector" }, "to": { "name": "capture" } }
      ]
    }
    EOF
    ```

1. Create data flow 1:

    ```azurecli
    az iot ops dataflowgraph apply --name capture --profile media-inference --instance $AIO_INSTANCE_NAME --resource-group $RESOURCE_GROUP --config-file capture-graph.json
    ```

1. Save the definition of data flow 2 as `inference-graph.json`. The command fills in your custom location, PVC, registry endpoint, and model:

    ```bash
    CUSTOM_LOCATION_ID=$(az iot ops show --name $AIO_INSTANCE_NAME --resource-group $RESOURCE_GROUP --query "extendedLocation.name" --output tsv)
    cat > inference-graph.json <<EOF
    {
      "extendedLocation": { "type": "CustomLocation", "name": "$CUSTOM_LOCATION_ID" },
      "properties": {
        "mode": "Enabled",
        "fileStores": [
          { "id": "responses", "persistentVolumeClaimRef": "$DATA_CLAIM_NAME", "subPath": "responses", "readOnly": true }
        ],
        "nodes": [
          {
            "nodeType": "Source",
            "name": "capture",
            "sourceSettings": { "endpointRef": "default", "dataSources": [ "media/capture" ] }
          },
          {
            "nodeType": "Graph",
            "name": "preprocessing",
            "graphSettings": {
              "registryEndpointRef": "$REGISTRY_ENDPOINT_NAME",
              "artifact": "azure-samples/explore-iot-operations/graph-select-snapshot:1.0.0"
            }
          },
          {
            "nodeType": "Graph",
            "name": "inference",
            "graphSettings": {
              "registryEndpointRef": "default",
              "artifact": "azureiotoperations/graph-dataflow-inference:0.2.0-preview.0",
              "configuration": [
                { "key": "model_name", "value": "$MODEL_NAME" },
                { "key": "read_request_from_disk", "value": "true" }
              ]
            }
          },
          {
            "nodeType": "Graph",
            "name": "postprocessing",
            "graphSettings": {
              "registryEndpointRef": "$REGISTRY_ENDPOINT_NAME",
              "artifact": "azure-samples/explore-iot-operations/graph-yolov8-detections:1.0.0",
              "configuration": [
                { "key": "model_name", "value": "$MODEL_NAME" },
                { "key": "output_name", "value": "output0_0" },
                { "key": "confidence_threshold", "value": "0.55" }
              ]
            }
          },
          {
            "nodeType": "Destination",
            "name": "result",
            "destinationSettings": { "endpointRef": "default", "dataDestination": "media/inference" }
          }
        ],
        "nodeConnections": [
          { "from": { "name": "capture" }, "to": { "name": "preprocessing" } },
          { "from": { "name": "preprocessing" }, "to": { "name": "inference" } },
          { "from": { "name": "inference" }, "to": { "name": "postprocessing" } },
          { "from": { "name": "postprocessing" }, "to": { "name": "result" } }
        ]
      }
    }
    EOF
    ```

1. Create data flow 2. The [`az iot ops dataflowgraph apply`](/cli/azure/iot/ops/dataflowgraph#az-iot-ops-dataflowgraph-apply) command doesn't support file stores yet, so create the graph as an Azure resource with the preview API version:

    ```azurecli
    az resource create \
      --id "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.IoTOperations/instances/$AIO_INSTANCE_NAME/dataflowProfiles/media-inference/dataflowGraphs/inference" \
      --api-version 2026-09-03-preview \
      --is-full-object \
      --properties @inference-graph.json
    ```

# [Bicep](#tab/bicep)

1. Save the following Bicep file as `media-inference-dataflows.bicep`:

    ```bicep
    param aioInstanceName string
    param customLocationName string
    @description('Registry endpoint for ghcr.io, which hosts the sample transforms.')
    param registryEndpointName string = 'public-ghcr'
    param dataClaimName string
    param assetName string
    param modelName string

    param profileName string = 'media-inference'
    param triggerTopic string = 'media/trigger'
    param captureTopic string = 'media/capture'
    param resultTopic string = 'media/inference'

    @description('Request topic of the ExtractClip action of the camera asset.')
    param actionTopic string = 'azure-iot-operations/asset-operations/${assetName}/control/ExtractClip'
    param streamConfigurationName string = 'snapshots'

    @description('Model output that contains the detection rows.')
    param outputName string = 'output0_0'
    param confidenceThreshold string = '0.55'
    @description('Folder on the PVC that the inference connector writes model outputs to.')
    param responsesSubPath string = 'responses'

    @description('Graph definitions of the sample transforms on ghcr.io.')
    param captureGraph string = 'azure-samples/explore-iot-operations/graph-media-capture:1.0.0'
    param preprocessingGraph string = 'azure-samples/explore-iot-operations/graph-select-snapshot:1.0.0'
    param postprocessingGraph string = 'azure-samples/explore-iot-operations/graph-yolov8-detections:1.0.0'
    @description('Prebuilt inference transform on mcr.microsoft.com.')
    param inferenceGraph string = 'azureiotoperations/graph-dataflow-inference:0.2.0-preview.0'

    resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
      name: customLocationName
    }

    resource aioInstance 'Microsoft.IoTOperations/instances@2026-09-03-preview' existing = {
      name: aioInstanceName
    }

    resource profile 'Microsoft.IoTOperations/instances/dataflowProfiles@2026-09-03-preview' = {
      parent: aioInstance
      name: profileName
      extendedLocation: {
        type: 'CustomLocation'
        name: customLocation.id
      }
      properties: {
        instanceCount: 1
      }
    }

    resource captureDataflow 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflowGraphs@2026-09-03-preview' = {
      parent: profile
      name: 'capture'
      extendedLocation: {
        type: 'CustomLocation'
        name: customLocation.id
      }
      properties: {
        mode: 'Enabled'
        nodes: [
          {
            nodeType: 'Source'
            name: 'trigger'
            sourceSettings: {
              endpointRef: 'default'
              dataSources: [
                triggerTopic
              ]
            }
          }
          {
            nodeType: 'Graph'
            name: 'media-connector'
            graphSettings: {
              registryEndpointRef: registryEndpointName
              artifact: captureGraph
              configuration: [
                {
                  key: 'action_topic'
                  value: actionTopic
                }
                {
                  key: 'stream_configuration_name'
                  value: streamConfigurationName
                }
              ]
            }
          }
          {
            nodeType: 'Destination'
            name: 'capture'
            destinationSettings: {
              endpointRef: 'default'
              dataDestination: captureTopic
            }
          }
        ]
        nodeConnections: [
          {
            from: { name: 'trigger' }
            to: { name: 'media-connector' }
          }
          {
            from: { name: 'media-connector' }
            to: { name: 'capture' }
          }
        ]
      }
    }

    resource inferenceDataflow 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflowGraphs@2026-09-03-preview' = {
      parent: profile
      name: 'inference'
      extendedLocation: {
        type: 'CustomLocation'
        name: customLocation.id
      }
      properties: {
        mode: 'Enabled'
        fileStores: [
          {
            id: 'responses'
            persistentVolumeClaimRef: dataClaimName
            subPath: responsesSubPath
            readOnly: true
          }
        ]
        nodes: [
          {
            nodeType: 'Source'
            name: 'capture'
            sourceSettings: {
              endpointRef: 'default'
              dataSources: [
                captureTopic
              ]
            }
          }
          {
            nodeType: 'Graph'
            name: 'preprocessing'
            graphSettings: {
              registryEndpointRef: registryEndpointName
              artifact: preprocessingGraph
            }
          }
          {
            nodeType: 'Graph'
            name: 'inference'
            graphSettings: {
              registryEndpointRef: 'default'
              artifact: inferenceGraph
              configuration: [
                {
                  key: 'model_name'
                  value: modelName
                }
                {
                  key: 'read_request_from_disk'
                  value: 'true'
                }
              ]
            }
          }
          {
            nodeType: 'Graph'
            name: 'postprocessing'
            graphSettings: {
              registryEndpointRef: registryEndpointName
              artifact: postprocessingGraph
              configuration: [
                {
                  key: 'model_name'
                  value: modelName
                }
                {
                  key: 'output_name'
                  value: outputName
                }
                {
                  key: 'confidence_threshold'
                  value: confidenceThreshold
                }
              ]
            }
          }
          {
            nodeType: 'Destination'
            name: 'result'
            destinationSettings: {
              endpointRef: 'default'
              dataDestination: resultTopic
            }
          }
        ]
        nodeConnections: [
          {
            from: { name: 'capture' }
            to: { name: 'preprocessing' }
          }
          {
            from: { name: 'preprocessing' }
            to: { name: 'inference' }
          }
          {
            from: { name: 'inference' }
            to: { name: 'postprocessing' }
          }
          {
            from: { name: 'postprocessing' }
            to: { name: 'result' }
          }
        ]
      }
    }
    ```

1. Deploy the Bicep file:

    ```azurecli
    az deployment group create \
      --resource-group $RESOURCE_GROUP \
      --name media-inference-dataflows \
      --template-file media-inference-dataflows.bicep \
      --parameters aioInstanceName=$AIO_INSTANCE_NAME customLocationName=$CUSTOM_LOCATION_NAME \
        registryEndpointName=$REGISTRY_ENDPOINT_NAME dataClaimName=$DATA_CLAIM_NAME assetName=$ASSET_NAME modelName=$MODEL_NAME
    ```

    Bicep might show warning BCP081 because the preview resource types don't have type definitions yet. You can ignore this warning.

---

Wait until the pod of the data flow profile is ready:

```bash
kubectl get pods -n azure-iot-operations | grep aio-dataflow-media-inference
```

If your MQTT broker listener uses authorization, give the data flow's identity permission to:

- Subscribe to the trigger and capture topics.
- Publish to the capture and result topics.
- Send commands to the asset's `ExtractClip` action topic and to the model's `aio/inference/command/...` topics, and receive the responses.

To learn more, see [Configure MQTT broker authorization](../../manage-mqtt-broker/howto-configure-authorization.md).

### Transform settings

The graphs configure the transforms with the following settings. The capture, pre-processing, and post-processing settings are the settings of the [sample transforms](#about-the-sample-transforms). For the settings of the inference transform, see [Inference transform configuration](howto-inference-connector-dataflow-graph.md#inference-transform-configuration).

| Transform | Setting | Description |
|--|--|--|
| Capture | `action_topic` | Required. The request topic of the asset's `ExtractClip` action: `azure-iot-operations/asset-operations/<ASSET>/<MANAGEMENT_GROUP>/ExtractClip`. |
| Capture | `stream_configuration_name` | Required. The name of the asset's `snapshot-to-fs` stream. |
| Inference | `model_name` | Required. The name of the model in the inference connector configuration. |
| Inference | `read_request_from_disk` | Set to `true`, because the payload is the path of the image, not the image. |
| Post-processing | `model_name` | Required. The same model name as the inference transform. The transform gets the class labels from the model's information. |
| Post-processing | `output_name` | Required. The name of the model output that contains the detections. |
| Post-processing | `confidence_threshold` | The minimum confidence of the detections to publish, from `0` to `1`. The default is `0.55`. |

If a transform returns an error, for example because the media connector doesn't respond or inference fails, the data flow drops the message and logs the error. Errors that the media connector reports in its response, such as `Busy:`, are different: the capture transform publishes the response to the capture topic, so you can see the error there, and then the pre-processing transform drops the message.

## Send a trigger and check the results

The following steps use the `mqtt-client` pod from [Test connectivity to MQTT broker with MQTT clients](../../manage-mqtt-broker/howto-test-connection.md).

1. Deploy the `mqtt-client` pod if you didn't already:

    ```bash
    kubectl apply -f https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/quickstarts/mqtt-client.yaml
    kubectl wait --for=condition=Ready pod/mqtt-client -n azure-iot-operations --timeout=120s
    ```

1. In one terminal, subscribe to the capture and result topics:

    ```bash
    kubectl exec --stdin --tty mqtt-client -n azure-iot-operations -- sh -c '
    mosquitto_sub -h aio-broker -p 18883 -q 1 -V mqttv5 \
      -t "media/capture" -t "media/inference" \
      -F "%t | %P | %p" \
      --cafile /var/run/certs/ca.crt \
      -D CONNECT authentication-method "K8S-SAT" \
      -D CONNECT authentication-data "$(cat /var/run/secrets/tokens/broker-sat)"'
    ```

1. In a second terminal, publish a trigger. The `__ts` user property sets the event time to two seconds before the trigger, so the media connector finishes writing the snapshots in the window. The `trigger-id` user property identifies the trigger in the results:

    ```bash
    kubectl exec --stdin --tty mqtt-client -n azure-iot-operations -- sh -c '
    EVENT_MS=$(( ($(date +%s) - 2) * 1000 ))
    mosquitto_pub -h aio-broker -p 18883 -q 1 -V mqttv5 \
      -t "media/trigger" \
      -m "{\"event\": \"part-arrived\"}" \
      -D PUBLISH user-property trigger-id "trigger-0001" \
      -D PUBLISH user-property __ts "$(printf "%015d:00000:test-trigger" $EVENT_MS)" \
      --cafile /var/run/certs/ca.crt \
      -D CONNECT authentication-method "K8S-SAT" \
      -D CONNECT authentication-data "$(cat /var/run/secrets/tokens/broker-sat)"'
    ```

    The `__ts` value is a hybrid logical clock timestamp: the event time in milliseconds since the Unix epoch, padded to 15 digits, a counter, and a node identifier. If a trigger doesn't have an `__ts` property, the data flow uses the time it receives the trigger as the event time.

1. The subscriber in the first terminal shows the capture, and a few seconds later, the result. Both keep the `trigger-id` user property of the trigger:

    ```output
    media/capture | trigger-id:trigger-0001 ... | {"Result":{"RequestedStartTime":"2026-10-19T15:32:52.478Z", ... "SourceTier":"local-storage", ... "SourceFiles":[{ ... "CopyStatus":"Copied","TargetPath":"recordings/<DEVICE>/rtsp/<ASSET>/snapshots/snapshot_20261019-153253-322323898Z.jpg"}],"Failures":[]}}
    media/inference | trigger-id:trigger-0001 ... | [{"label":"defect","confidence":0.69,"box":[154,149,180,172]}]
    ```

    An empty array, `[]`, means that the model detected nothing above the confidence threshold.

If no result arrives, see [Troubleshooting](#troubleshooting).

## Use the results

Your application subscribes to the result topic and acts on each result, for example to reject a defective part, alert an operator, or record the inspection. To build an application that subscribes to MQTT topics, see [Start developing with the Azure IoT Operations SDKs](../../develop-edge-apps/quickstart-get-started-sdks.md). When you design the application:

- **Correlate results with triggers.** Match the `trigger-id` user property of each result with the trigger, and the capture. The capture contains the path and the time of the image that the model analyzed, so your application can show or keep the image.
- **Handle missing results.** A trigger produces no result if any stage fails, for example if the media connector doesn't respond, no snapshot exists for the event time, or inference fails. The data flow logs the error. Set a timeout for each trigger, and treat a trigger without a result as an error. To see why a capture failed, check the capture topic.
- **Keep what you need.** The media connector deletes its copies after their retention window. To keep an image as evidence, copy it before then. If the media connector has cloud ingest storage, you can also request the image again with `cloud-ingest` as the target to upload it to Azure.

## Timing, retention, and capacity

- **Only recorded media.** The media connector returns snapshots that it already recorded. It doesn't capture a new image when a trigger arrives. The recording task must run continuously, and the event time must be at least one snapshot interval in the past when data flow 1 processes the trigger.
- **Recording buffer.** The connector keeps 10 minutes of snapshots in local storage, so a trigger can request media from up to 10 minutes before. To support later triggers, increase `localStoreSnapshotRetentionMinutes`, and size the connector's storage for the extra snapshots. Unless a PVC backs local storage, the snapshots don't survive a restart of the connector pod. To learn more, see [Configure retention and cleanup](../../discover-manage-assets/howto-configure-media-connector-storage.md#configure-retention-and-cleanup).
- **Snapshot rate.** At one snapshot per second, the image nearest to the event can be up to one second away from it. For faster events, increase `snapshotsPerSecond`, and keep the requested window within the [limits](../../discover-manage-assets/howto-configure-media-connector-storage.md#limits-for-stored-media-management-actions) of the media connector.
- **Copies on the shared volume.** The media connector deletes its copies one to two hours after the snapshots were taken. A copy can disappear between the capture and inference, so handle missing files in your application. To learn more, see [Local shared settings](../../discover-manage-assets/howto-configure-media-connector-storage.md#local-shared-settings).
- **Model outputs.** The inference connector doesn't delete the output files that it writes to the `responses` folder. Delete them in your application after post-processing, or run a job that removes old files, so the volume doesn't fill up.
- **One operation at a time.** The media connector processes one `ExtractClip` request at a time. If triggers for the same stream arrive faster than the connector can copy the snapshots, the connector rejects requests with a `Busy:` error, which appears on the capture topic, and data flow 2 drops them. To learn more, see [Concurrency, limits, and readiness](../../discover-manage-assets/howto-use-media-connector-actions.md#concurrency-limits-and-readiness).
- **Throughput.** The inference connector processes up to `worker-count` commands for the model at the same time. To learn how to scale inference, see [Scale inference](howto-inference-connector-dataflow-graph.md#scale-inference).

## Customize the sample transforms

You can find the source code for the sample transforms in the Azure IoT Operations samples repository on GitHub:

| Transform | Module source | Graph definition |
|--|--|--|
| Capture | [media-capture](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/wasm/operators/media-capture) | [graph-media-capture.yaml](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/wasm/graph-media-capture.yaml) |
| Pre-processing | [select-snapshot](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/wasm/operators/select-snapshot) | [graph-select-snapshot.yaml](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/wasm/graph-select-snapshot.yaml) |
| Post-processing | [yolov8-detections](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/wasm/operators/yolov8-detections) | [graph-yolov8-detections.yaml](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/wasm/graph-yolov8-detections.yaml) |

Customize the transforms as needed for your cameras and models. For example:

- To change the capture window, change the padding values of the `ExtractClip` request in the capture transform. Keep the window within the [limits](../../discover-manage-assets/howto-configure-media-connector-storage.md#limits-for-stored-media-management-actions) of the media connector. To learn about the other fields of the request, see [ExtractClip request](../../discover-manage-assets/howto-use-media-connector-actions.md#extractclip-request).
- If the inference connector's read folder isn't the media connector's `localSharedPath` folder, convert the path in the pre-processing transform.
- To use another model, change the function in the post-processing transform that converts the model output. To find the names and shapes of a model's outputs, send a [getModelInfo](reference-inference-connector-commands.md#getmodelinfo) command. The transform reads the model output from the file store whose `id` is `responses`, so keep this `id` in data flow 2.

To deploy your version of a transform:

1. Build the module. The modules use `wasm_graph_sdk` 1.7.4 and Rust 1.90, which the `rust-toolchain.toml` file of each module selects. To learn how to build modules, see [Build WASM modules for data flows](../../develop-edge-apps/howto-build-wasm-modules.md).
1. Push the module and its graph definition to your container registry. The graph definition references the module by its repository path and tag, so if you push the module to another path or tag, update the `module` value in the graph definition. To learn how, see [Deploy WebAssembly (WASM) modules and graph definitions](../../develop-edge-apps/howto-deploy-wasm-graph-definitions.md).
1. In [Deploy the data flows](#deploy-the-data-flows), set `REGISTRY_ENDPOINT_NAME` to the name of the [registry endpoint](../../develop-edge-apps/howto-configure-registry-endpoint.md) for your registry, change the artifact references of the graph definitions if you changed their paths or tags, and deploy the data flows again.

## Troubleshooting

Both data flows write their logs to the `aio-dataflow-media-inference-0` pod. The inference connector logs to the pod with the `akri.iotoperations.azure.com/aio-application-configuration=inference-connector` label.

| Symptom | Cause and resolution |
|--|--|
| No capture for a trigger | Check the data flow log. The registry endpoint can't pull the sample transforms, the `action_topic` doesn't match the asset's action, or the media connector isn't running. |
| The data flow log shows that it can't pull an artifact from `ghcr.io`, for example with a `401 Unauthorized` error | The `ghcr.io` registry endpoint doesn't have a valid artifact pull secret. Check that the secret contains a GitHub PAT with the `read:packages` scope. To learn more, see [Use a public registry](../../develop-edge-apps/howto-configure-registry-endpoint.md#use-a-public-registry). |
| You can't tell whether the media connector or the data flow is failing | Test the `ExtractClip` action on its own, in `Query` mode, with the same `StreamConfigurationName`, an `EventTime` a few seconds in the past, and `Target` set to `local-shared`. To learn how, see [Invoke an action](../../discover-manage-assets/howto-use-media-connector-actions.md#invoke-an-action). |
| The capture contains an error saying that no snapshot exists | The event time is too recent, older than the recording buffer, or before recording started. Check the clocks and the asset's stream status. |
| The media connector pod shows `CreateContainerConfigError` with a message about a non-numeric user | The media connector image declares a named user, which the non-root policy of the cluster rejects. Use a media connector version whose image runs with a numeric user ID. Don't change the workloads that Azure IoT Operations generates for the connector. To change the version, see [Manage existing connector template instances](../../discover-manage-assets/howto-manage-connector-templates.md#manage-existing-connector-template-instances). |
| The capture contains a `Busy:` error | Triggers arrive faster than the media connector can process them. Reduce the trigger rate. To learn how to retry, see [Retry safely](../../discover-manage-assets/howto-use-media-connector-actions.md#retry-safely). |
| The data flow logs that the inference connector can't read the file | The `read-sub-path` of the inference connector isn't the media connector's `localSharedPath` folder, or the two connectors don't mount the same PVC. |
| The detections contain class IDs instead of labels | The model's information doesn't contain class labels. Deploy a model that includes them, or [customize the post-processing transform](#customize-the-sample-transforms) to set the labels. |
| The post-processing transform can't read the model output | The data flow's file store doesn't refer to the PVC and folder that the inference connector writes to, or its `id` isn't `responses`. |
| The post-processing transform says that the model output has no rows | The `output_name` setting isn't the name of the model output that contains the detections. To find the names of the outputs, send a [getModelInfo](reference-inference-connector-commands.md#getmodelinfo) command. |

For media connector storage issues, see [Verify storage and troubleshoot](../../discover-manage-assets/howto-configure-media-connector-storage.md#verify-storage-and-troubleshoot). For other inference issues, see [Troubleshoot the inference connector](troubleshoot-inference-connector.md).

## Clean up resources

1. Delete the data flow graphs and their profile.

    ```azurecli
    az iot ops dataflowgraph delete --name inference --profile media-inference --instance $AIO_INSTANCE_NAME --resource-group $RESOURCE_GROUP --yes
    az iot ops dataflowgraph delete --name capture --profile media-inference --instance $AIO_INSTANCE_NAME --resource-group $RESOURCE_GROUP --yes
    az iot ops dataflow profile delete --name media-inference --instance $AIO_INSTANCE_NAME --resource-group $RESOURCE_GROUP --yes
    ```

1. Delete the asset and the device.

    ```azurecli
    az iot ops ns asset delete --name $ASSET_NAME --instance $AIO_INSTANCE_NAME --resource-group $RESOURCE_GROUP
    az iot ops ns device delete --name $DEVICE_NAME --instance $AIO_INSTANCE_NAME --resource-group $RESOURCE_GROUP
    ```

1. To restore the inference connector's previous configuration, deploy it again. To remove the connector, see [Remove the inference connector](howto-deploy-inference-connector.md#remove-the-inference-connector).

1. If no other asset uses them, remove the volume and the storage settings that you added to the media connector template. To learn how, see [Mount the shared volume in the media connector](#mount-the-shared-volume-in-the-media-connector) and [Set the storage root and retention](#set-the-storage-root-and-retention).

1. If no other workload uses them, delete the `media` and `responses` folders from the shared PVC, or delete the PVC.

1. If no other data flow uses them, delete the `ghcr.io` registry endpoint and its artifact pull secret. Replace `<GHCR_PULL_SECRET>` with the name of the secret.

    ```azurecli
    az iot ops registry delete --name $REGISTRY_ENDPOINT_NAME --instance $AIO_INSTANCE_NAME --resource-group $RESOURCE_GROUP
    kubectl delete secret <GHCR_PULL_SECRET> -n azure-iot-operations
    ```

## Related content

- [Configure the media connector](../../discover-manage-assets/howto-use-media-connector.md)
- [Configure storage and retention for the media connector](../../discover-manage-assets/howto-configure-media-connector-storage.md)
- [Use media connector mRPC management actions](../../discover-manage-assets/howto-use-media-connector-actions.md)
- [What is the inference connector?](overview-inference-connector.md)
- [Run inference in a data flow graph](howto-inference-connector-dataflow-graph.md)
- [Call the inference connector from a WASM module](howto-inference-connector-webassembly-module.md)
- [Call services from WASM data flow graphs with the command invoker](../../develop-edge-apps/howto-webassembly-command-invoker.md)
- [Read and write files from WASM data flow graphs with the file store](../../develop-edge-apps/howto-webassembly-file-store.md)
- [Deploy WebAssembly (WASM) modules and graph definitions](../../develop-edge-apps/howto-deploy-wasm-graph-definitions.md)
- [Data flow graphs in Azure IoT Operations](../../connect-to-cloud/concept-dataflow-graphs.md)
