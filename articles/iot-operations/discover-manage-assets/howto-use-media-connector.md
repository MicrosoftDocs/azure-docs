---
title: How to use the media connector (preview)
description: How to use the media connector (preview) to perform tasks such as sending an image snapshot to the MQTT broker or saving a video stream to a local file system.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: how-to
ms.date: 10/07/2024

#CustomerIntent: As an industrial edge IT or operations user, I want to configure the media connector so that I can access snapshots and videos from a media source such as a IP video camera.
---

# Configure the media connector (preview)

In Azure IoT Operations, the media connector (preview) enables access to media from media sources such as edge-attached cameras. This article explains how to use the media connector to perform tasks such as:

- Send an image snapshot to the MQTT broker.
- Save a video stream to a local file system.

The media connector:

- Uses _asset endpoints_ to access media sources. An asset endpoint defines a connection to a media source such as a camera. The asset endpoint configuration includes the URL of the media source, the type of media source, and any credentials needed to access the media source.

- Uses _assets_ to represent media sources such as cameras. An asset defines the capabilities and properties of a media source such as a camera.

## Prerequisites

A deployed instance of Azure IoT Operations. If you don't already have an instance, see [Quickstart: Run Azure IoT Operations in GitHub Codespaces with K3s](../get-started-end-to-end-sample/quickstart-deploy.md).

A camera connected to your network and accessible from your Azure IoT Operations cluster. The camera must support the Real Time Streaming Protocol for video streaming. You also need the camera's username and password to authenticate with it.

> [!NOTE]
> Microsoft validated this preview release with the A-MTK AH6016O camera.

## Update the media connector

To update the version of the media connector in your Azure IoT Operations deployment, run the following PowerShell commands:

```powershell
$clusterName="<YOUR AZURE IOT OPERATIONS CLUSTER NAME>"
$clusterResourceGroup="<YOUR RESOURCE GROUP NAME>"

$extension = az k8s-extension list `
--cluster-name $clusterName `
--cluster-type connectedClusters `
--resource-group $clusterResourceGroup `
--query "[?extensionType == 'microsoft.iotoperations']" `
| ConvertFrom-Json


az k8s-extension update `
--version $extension.version `
--name $extension.name `
--release-train $extension.releaseTrain `
--cluster-name $clusterName `
--resource-group $clusterResourceGroup `
--cluster-type connectedClusters `
--auto-upgrade-minor-version false `
--config connectors.image.registry=mcr.microsoft.com `
--config connectors.image.repository=aio-connectors/helmchart/microsoft-aio-connectors `
--config connectors.image.tag=1.1.0 `
--config connectors.values.enablePreviewFeatures=true `
--yes
```

> [!NOTE]
> This update process is for preview components only. The media connector is currently a preview component.

## Deploy the media server

If you're using the media connector to stream live video, you need to install your own media server. To deploy a sample media server to use with the media connector, run the following command:

```console
kubectl create namespace media-server --dry-run=client -o yaml | kubectl apply -f - & kubectl apply -f https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/refs/heads/main/samples/media-connector-invoke-test/media-server/media-server-deployment.yaml --validate=false & kubectl apply -f https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/refs/heads/main/samples/media-connector-invoke-test/media-server/media-server-service.yaml --validate=false & kubectl apply -f https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/refs/heads/main/samples/media-connector-invoke-test/media-server/media-server-service-public.yaml --validate=false
```

> [!IMPORTANT]
> This media server is only suitable for testing and development purposes. In a production environment you need to provide your own media server.

To discover the cluster IP address of this media server, run the following command:

```console
kubectl get service media-server-public --namespace media-server
```

Make a note of the **CLUSTER-IP** value, you use it later to access the media server.

## Asset endpoint configuration

To configure the media connector, first create an asset endpoint that defines the connection to the media source. The asset endpoint includes the URL of the media source, the type of media source, and any credentials you need to access the media source.

If your camera requires authentication, create a secret in your Kubernetes cluster that stores the camera's username and password. The media connector uses this secret to authenticate with the camera:

1. Create a YAML file called _contoso-secrets.yaml_ with the following content. Replace the placeholders with your camera's username and password encoded in base64:

    ```yaml
    apiVersion: v1
    kind: Secret
    metadata:
      name: contoso-secrets
    type: Opaque
    data:
      username: "<YOUR CAMERA USERNAME BASE64 ENCODED>"
      password: "<YOUR CAMERA PASSWORD BASE64 ENCODED>"
    ```

    > [!TIP]
    > To encode the username and password in base64 at a Bash prompt, use the following command: `echo -n "<STRING TO ENCODE>" | base64`.

1. To add the secret to your cluster in the default Azure IoT Operations namespace, run the following command:

    ```console
    kubectl apply -f contoso-secrets.yaml -n azure-iot-operations
    ```

To create the asset endpoint by using a Bicep file:

# [Bash](#tab/bash)

1. Set the following environment variables:

    ```bash
    SUBSCRIPTION_ID="<YOUR SUBSCRIPTION ID>"
    RESOURCE_GROUP="<YOUR AZURE IOT OPERATIONS RESOURCE GROUP>"
    TARGET_ADDRESS="<YOUR CAMERA RTSP ADDRESS>"
    AEP_NAME="contoso-rtsp-aep"
    SECRET_NAME="contoso-secrets"
    ```

1. Run the following script:

    ```bash
    # Download the Bicep file
    wget https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/media-connector-bicep/aep-media-connector.bicep -O aep-media-connector.bicep
    
    # Find the name of your custom location
    CUSTOM_LOCATION_NAME=$(az iot ops list -g $RESOURCE_GROUP --query "[0].extendedLocation.name" -o tsv)
    
    # Use the Bicep file to deploy the asset endpoint
    az deployment group create --subscription $SUBSCRIPTION_ID --resource-group $RESOURCE_GROUP --template-file aep-media-connector.bicep --parameters targetAddress=$TARGET_ADDRESS customLocationName=$CUSTOM_LOCATION_NAME aepName=$AEP_NAME secretName=$SECRET_NAME
    ```

# [PowerShell](#tab/powershell)

1. Set the following environment variables:

    ```powershell
    $SUBSCRIPTION_ID="<YOUR SUBSCRIPTION ID>"
    $RESOURCE_GROUP="<YOUR AZURE IOT OPERATIONS RESOURCE GROUP>"
    $TARGET_ADDRESS="<YOUR CAMERA RTSP ADDRESS>"
    $AEP_NAME="contoso-rtsp-aep"
    $SECRET_NAME="contoso-secrets"
    ```

1. Run the following script:

    ```powershell
    # Download the Bicep file
    Invoke-WebRequest -Uri https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/media-connector-bicep/aep-media-connector.bicep -OutFile aep-media-connector.bicep

    # Find the name of your custom location
    $CUSTOM_LOCATION_NAME = (az iot ops list -g $RESOURCE_GROUP --query "[0].extendedLocation.name" -o tsv)

    # Use the Bicep file to deploy the asset endpoint
    az deployment group create --subscription $SUBSCRIPTION_ID --resource-group $RESOURCE_GROUP --template-file aep-media-connector.bicep --parameters targetAddress=$TARGET_ADDRESS customLocationName=$CUSTOM_LOCATION_NAME aepName=$AEP_NAME secretName=$SECRET_NAME
    ```

---

The following snippet shows the bicep file that you used to create the asset endpoint:

:::code language="bicep" source="~/azure-iot-operations-samples/samples/media-connector-bicep/aep-media-connector.bicep":::

The previous example configures the asset endpoint to authenticate with the camera with a username and password. In the Bicep file, the authentication section of the asset endpoint you created looks like the following example:

```bicep
authentication: {
  method: 'UsernamePassword'
  usernamePasswordCredentials: {
    passwordSecretName: '${secretName}/password'
    usernameSecretName: '${secretName}/username'
    }
 ```

If your camera doesn't require a username and password, configure anonymous authentication as shown in the following example:

```bicep
authentication: {
  method: 'Anonymous'
}
```

## Asset configuration

When you configure an asset, the `datasets.DataPoints` parameter specifies the action the media connector takes on the asset. A camera asset supports the following task types:

| Task type | Description |
|-----------|-------------|
| `snapshot-to-mqtt` | Capture snapshots from a camera and publishes them to an MQTT topic. |
| `snapshot-to-fs` | Capture snapshots from a camera and saves them to the local file system. |
| `clip-to-fs` | Capture video clips from a camera and saves them to the local file system. |
| `stream-to-rtsp` | Sends a live video stream from a camera to a media server. |

You can use the following settings to configure individual tasks:

- `autostart`: Whether the task starts automatically when the asset starts.
- `realtime`: Whether the task runs in real time.
- `loop`: Whether the task runs continuously.
- `format`: The format of the media file.
- `fps`: The frames per second for the media file.
- `audioEnabled`: Whether audio is enabled for the media file.
- `duration`: The duration of the media file.

The following examples show how to deploy assets for each task type.

## Snapshot to MQTT

To configure an asset that captures snapshots from a camera and publishes them to an MQTT topic:

# [Bash](#tab/bash)

1. Set the following environment variables:

    ```bash
    SUBSCRIPTION_ID="<YOUR SUBSCRIPTION ID>"
    RESOURCE_GROUP="<YOUR AZURE IOT OPERATIONS RESOURCE GROUP>"
    AEP_NAME="contoso-rtsp-aep"
    ```

1. Run the following script:

    ```bash
    # Download the Bicep file
    wget https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/media-connector-bicep/asset-snapshot-to-mqtt.bicep -O asset-snapshot-to-mqtt.bicep
    
    # Find the name of your custom location
    CUSTOM_LOCATION_NAME=$(az iot ops list -g $RESOURCE_GROUP --query "[0].extendedLocation.name" -o tsv)
    
    # Use the Bicep file to deploy the asset
    az deployment group create --subscription $SUBSCRIPTION_ID --resource-group $RESOURCE_GROUP --template-file asset-snapshot-to-mqtt.bicep --parameters customLocationName=$CUSTOM_LOCATION_NAME aepName=$AEP_NAME
    ```

# [PowerShell](#tab/powershell)

1. Set the following environment variables:

    ```powershell
    $SUBSCRIPTION_ID="<YOUR SUBSCRIPTION ID>"
    $RESOURCE_GROUP="<YOUR AZURE IOT OPERATIONS RESOURCE GROUP>"
    $AEP_NAME="contoso-rtsp-aep"
    ```

1. Run the following script:

    ```powershell
    # Download the Bicep file
    Invoke-WebRequest -Uri https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/media-connector-bicep/asset-snapshot-to-mqtt.bicep -OutFile asset-snapshot-to-mqtt.bicep

    # Find the name of your custom location
    $CUSTOM_LOCATION_NAME = (az iot ops list -g $RESOURCE_GROUP --query "[0].extendedLocation.name" -o tsv)

    # Use the Bicep file to deploy the asset
    az deployment group create --subscription $SUBSCRIPTION_ID --resource-group $RESOURCE_GROUP --template-file asset-snapshot-to-mqtt.bicep --parameters customLocationName=$CUSTOM_LOCATION_NAME aepName=$AEP_NAME
    ```

---

The following snippet shows the bicep file that you used to create the asset:

:::code language="bicep" source="~/azure-iot-operations-samples/samples/media-connector-bicep/asset-snapshot-to-mqtt.bicep":::

To verify that snapshots are publishing to the MQTT broker, use the **mosquitto_sub** tool. In this example, you run the **mosquitto_sub** tool inside a pod in your Kubernetes cluster:

1. Run the following command to deploy a pod that includes the **mosquitto_pub** and **mosquitto_sub** tools that are useful for interacting with the MQTT broker in the cluster:

    ```console
    kubectl apply -f https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/quickstarts/mqtt-client.yaml
    ```

    > [!CAUTION]
    > This configuration isn't secure. Don't use this configuration in a production environment.

1. When the **mqtt-client** pod is running, run the following command to create a shell environment in the pod you created:

    ```console
    kubectl exec --stdin --tty mqtt-client -n azure-iot-operations -- sh
    ```

1. At the Bash shell in the **mqtt-client** pod, run the following command to connect to the MQTT broker using the **mosquitto_sub** tool subscribed to the `azure-iot-operations/data` topic:

    ```bash
    mosquitto_sub --host aio-broker --port 18883 --topic "azure-iot-operations/data/#" -V 5 -F '%p' -C 1 --cafile /var/run/certs/ca.crt -D CONNECT authentication-method 'K8S-SAT' -D CONNECT authentication-data $(cat /var/run/secrets/tokens/broker-sat) > image.jpeg
    ```

    This command captures the raw payload from a single message and saves it to a file called **image.jpeg** in the pod's filing system. To exit the pod's shell environment, type `exit`.

1. To copy the image file from the pod to your local machine, run the following command:

    ```console
    kubectl cp azure-iot-operations/mqtt-client:image.jpeg image.jpeg
    ```

When you finish testing the asset, you can delete it by running the following command:

```console
az iot ops asset delete -n asset-clip-to-mqtt -g $RESOURCE_GROUP
```

## Snapshot to file system

To configure an asset that captures snapshots from a camera and saves them as files:

# [Bash](#tab/bash)

1. Set the following environment variables:

    ```bash
    SUBSCRIPTION_ID="<YOUR SUBSCRIPTION ID>"
    RESOURCE_GROUP="<YOUR AZURE IOT OPERATIONS RESOURCE GROUP>"
    AEP_NAME="contoso-rtsp-aep"
    ```

1. Run the following script:

    ```bash
    # Download the Bicep file
    wget https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/media-connector-bicep/asset-snapshot-to-fs.bicep -O asset-snapshot-to-fs.bicep
    
    # Find the name of your custom location
    CUSTOM_LOCATION_NAME=$(az iot ops list -g $RESOURCE_GROUP --query "[0].extendedLocation.name" -o tsv)
    
    # Use the Bicep file to deploy the asset
    az deployment group create --subscription $SUBSCRIPTION_ID --resource-group $RESOURCE_GROUP --template-file asset-snapshot-to-fs.bicep --parameters customLocationName=$CUSTOM_LOCATION_NAME aepName=$AEP_NAME
    ```

# [PowerShell](#tab/powershell)

1. Set the following environment variables:

    ```powershell
    $SUBSCRIPTION_ID="<YOUR SUBSCRIPTION ID>"
    $RESOURCE_GROUP="<YOUR AZURE IOT OPERATIONS RESOURCE GROUP>"
    $AEP_NAME="contoso-rtsp-aep"
    ```

1. Run the following script:

    ```powershell
    # Download the Bicep file
    Invoke-WebRequest -Uri https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/media-connector-bicep/asset-snapshot-to-fs.bicep -OutFile asset-snapshot-to-fs.bicep

    # Find the name of your custom location
    $CUSTOM_LOCATION_NAME = (az iot ops list -g $RESOURCE_GROUP --query "[0].extendedLocation.name" -o tsv)

    # Use the Bicep file to deploy the asset
    az deployment group create --subscription $SUBSCRIPTION_ID --resource-group $RESOURCE_GROUP --template-file asset-snapshot-to-fs.bicep --parameters customLocationName=$CUSTOM_LOCATION_NAME aepName=$AEP_NAME
    ```

---

The following snippet shows the bicep file that you used to create the asset:

:::code language="bicep" source="~/azure-iot-operations-samples/samples/media-connector-bicep/asset-snapshot-to-fs.bicep":::

The files are saved in the file system of the `opc-media-1-...` pod. To find the full name of the pod, run the following command. The following command uses the default Azure IoT Operations namespace:

```console
kubectl get pods -n azure-iot-operations
```

To view the files, run the `ls` command in the pod. Use the full name of the pod in the following command:

```console
kubectl exec aio-opc-media-1-... -n azure-iot-operations -- ls /tmp/azure-iot-operations/data/asset-snapshot-to-fs/snapshot/
```

When you finish testing the asset, you can delete it by running the following command:

```console
az iot ops asset delete -n asset-snapshot-to-fs -g $RESOURCE_GROUP
```

## Clip to file system

To configure an asset that captures clips from a camera and saves them as files:

# [Bash](#tab/bash)

1. Set the following environment variables:

    ```bash
    SUBSCRIPTION_ID="<YOUR SUBSCRIPTION ID>"
    RESOURCE_GROUP="<YOUR AZURE IOT OPERATIONS RESOURCE GROUP>"
    AEP_NAME="contoso-rtsp-aep"
    ```

1. Run the following script:

    ```bash
    # Download the Bicep file
    wget https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/media-connector-bicep/asset-clip-to-fs.bicep -O asset-clip-to-fs.bicep
    
    # Find the name of your custom location
    CUSTOM_LOCATION_NAME=$(az iot ops list -g $RESOURCE_GROUP --query "[0].extendedLocation.name" -o tsv)
    
    # Use the Bicep file to deploy the asset
    az deployment group create --subscription $SUBSCRIPTION_ID --resource-group $RESOURCE_GROUP --template-file asset-clip-to-fs.bicep --parameters customLocationName=$CUSTOM_LOCATION_NAME aepName=$AEP_NAME
    ```

# [PowerShell](#tab/powershell)

1. Set the following environment variables:

    ```powershell
    $SUBSCRIPTION_ID="<YOUR SUBSCRIPTION ID>"
    $RESOURCE_GROUP="<YOUR AZURE IOT OPERATIONS RESOURCE GROUP>"
    $AEP_NAME="contoso-rtsp-aep"
    ```

1. Run the following script:

    ```powershell
    # Download the Bicep file
    Invoke-WebRequest -Uri https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/media-connector-bicep/asset-clip-to-fs.bicep -OutFile asset-clip-to-fs.bicep

    # Find the name of your custom location
    $CUSTOM_LOCATION_NAME = (az iot ops list -g $RESOURCE_GROUP --query "[0].extendedLocation.name" -o tsv)

    # Use the Bicep file to deploy the asset
    az deployment group create --subscription $SUBSCRIPTION_ID --resource-group $RESOURCE_GROUP --template-file asset-clip-to-fs.bicep --parameters customLocationName=$CUSTOM_LOCATION_NAME aepName=$AEP_NAME
    ```

---

The following snippet shows the bicep file that you used to create the asset:

:::code language="bicep" source="~/azure-iot-operations-samples/samples/media-connector-bicep/asset-clip-to-fs.bicep":::

The files are saved in the file system of the `opc-media-1-...` pod. To find the full name of the pod, run the following command. The following command uses the default Azure IoT Operations namespace:

```console
kubectl get pods -n azure-iot-operations
```

To view the files, run the `ls` command in the pod. Use the full name of the pod in the following command:

```console
kubectl exec aio-opc-media-1-... -n azure-iot-operations -- ls /tmp/azure-iot-operations/data/asset-clip-to-fs/clip/
```

When you finish testing the asset, you can delete it by running the following command:

```console
az iot ops asset delete -n asset-clip-to-fs -g $RESOURCE_GROUP
```

## Stream to RTSP

To configure an asset that forwards video streams from a camera to a media server:

You made a note of the IP address of the media server when you deployed it in a previous step.

# [Bash](#tab/bash)

1. Set the following environment variables:

    ```bash
    SUBSCRIPTION_ID="<YOUR SUBSCRIPTION ID>"
    RESOURCE_GROUP="<YOUR AZURE IOT OPERATIONS RESOURCE GROUP>"
    MEDIA_SERVER_ADDRESS="<YOUR MEDIA SERVER IP ADDRESS>"
    AEP_NAME="contoso-rtsp-aep"
    ```

1. Run the following script:

    ```bash
    # Download the Bicep file
    wget https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/media-connector-bicep/asset-stream-to-rtsp.bicep -O asset-stream-to-rtsp.bicep
    
    # Find the name of your custom location
    CUSTOM_LOCATION_NAME=$(az iot ops list -g $RESOURCE_GROUP --query "[0].extendedLocation.name" -o tsv)
    
    # Use the Bicep file to deploy the asset
    az deployment group create --subscription $SUBSCRIPTION_ID --resource-group $RESOURCE_GROUP --template-file asset-stream-to-rtsp.bicep --parameters customLocationName=$CUSTOM_LOCATION_NAME aepName=$AEP_NAME mediaServerAddress=$MEDIA_SERVER_ADDRESS
    ```

# [PowerShell](#tab/powershell)

1. Set the following environment variables:

    ```powershell
    $SUBSCRIPTION_ID="<YOUR SUBSCRIPTION ID>"
    $RESOURCE_GROUP="<YOUR AZURE IOT OPERATIONS RESOURCE GROUP>"
    $MEDIA_SERVER_ADDRESS="<YOUR MEDIA SERVER IP ADDRESS>"
    $AEP_NAME="contoso-rtsp-aep"
    ```

1. Run the following script:

    ```powershell
    # Download the Bicep file
    Invoke-WebRequest -Uri https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/media-connector-bicep/asset-stream-to-rtsp.bicep -OutFile asset-stream-to-rtsp.bicep

    # Find the name of your custom location
    $CUSTOM_LOCATION_NAME = (az iot ops list -g $RESOURCE_GROUP --query "[0].extendedLocation.name" -o tsv)

    # Use the Bicep file to deploy the asset
    az deployment group create --subscription $SUBSCRIPTION_ID --resource-group $RESOURCE_GROUP --template-file asset-stream-to-rtsp.bicep --parameters customLocationName=$CUSTOM_LOCATION_NAME aepName=$AEP_NAME mediaServerAddress=$MEDIA_SERVER_ADDRESS
    ```

---

The following snippet shows the bicep file that you used to create the asset:

:::code language="bicep" source="~/azure-iot-operations-samples/samples/media-connector-bicep/asset-stream-to-rtsp.bicep":::

To view the media stream, use a URL that looks like: `http://<YOUR KUBERNETES CLUSTER IP ADDRESS>:8888/azure-iot-operations/data/asset-stream-to-rtsp`.

> [!TIP]
> If you're running Azure IoT Operations in Codespaces, run the following command to port forward the media server to your local machine: `kubectl port-forward service/media-server-public 8888:8888 -n media-server`.

> [!TIP]
> If you're running Azure IoT Operations in a virtual machine, make sure that port 8888 is open for inbound access in your firewall.

The media server logs the connection from the asset and the creation of the stream:

```log
2025/02/20 15:31:10 INF [RTSP] [conn <INTERNAL IP ADDRESS OF ASSET>:41384] opened
2025/02/20 15:31:10 INF [RTSP] [session 180ce9ad] created by INTERNAL IP ADDRESS OF ASSET>:41384
2025/02/20 15:31:10 INF [RTSP] [session 180ce9ad] is publishing to path 'azure-iot-operations/data/asset-stream-to-rtsp', 2 tracks (H264, LPCM)
2025/02/20 15:31:18 INF [HLS] [muxer azure-iot-operations/data/asset-stream-to-rtsp] created (requested by 10.42.0.1:16831)
2025/02/20 15:31:18 WAR [HLS] [muxer azure-iot-operations/data/asset-stream-to-rtsp] skipping track 2 (LPCM)
2025/02/20 15:31:18 INF [HLS] [muxer azure-iot-operations/data/asset-stream-to-rtsp] is converting into HLS, 1 track (H264)
```

When you finish testing the asset, you can delete it by running the following command:

```console
az iot ops asset delete -n asset-stream-to-rtsp -g $RESOURCE_GROUP
```

## Samples

For more examples that show how to configure and use the media connector, see the [Azure IoT Operations samples repository](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/media-connector-invoke-test/README.md).
