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
> Microsoft has validated this preview release with the A-MTK AH6016O camera.

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

To discover the external IP address of this media server, run the following command:

```console
kubectl get service media-server-public --namespace "media-server"
```

Make a note of this value, you use it later to access the media server.

## Configure the media connector (preview)

To configure the media connector, you need to create an asset endpoint that defines the connection to the media source. The asset endpoint includes the URL of the media source, the type of media source, and any credentials needed to access the media source.

To create the asset endpoint, create a YAML file with the following content. Replace the placeholders with your camera's username, password, and RTSP address. An RTSP address looks like `rtsp://<CAMERA IP ADDRESS>:555/onvif-media/media.amp?streamprofile=Profile1&audio=1`

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: contoso-secret
type: Opaque
data:
  username: "<YOUR CAMERA USERNAME BASE64 ENCODED>"
  password: "<YOUR CAMERA PASSWORD BASE64 ENCODED>"

---

apiVersion: deviceregistry.microsoft.com/v1
kind: AssetEndpointProfile
metadata:
  name: contoso-rtsp-aep
spec:
  additionalConfiguration: >-
    {"@schema":"https://aiobrokers.blob.core.windows.net/aio-media-connector/1.0.0.json"}
  endpointProfileType: Microsoft.Media
  authentication:
    method: UsernamePassword
    usernamePasswordCredentials:
      passwordSecretName: contoso-secret/password
      usernameSecretName: contoso-secret/username
  targetAddress: >-
    <YOUR CAMERA RTSP ADDRESS>
```

To apply the settings, run the following command. Typically, you apply the settings to the `azure-iot-operations` namespace:

```console
kubectl apply -f <filename>.yaml -n <AIO NAMESPACE>
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

The following YAML snippets show example asset configurations for each task type. The `taskType` value determines the task type to configure.

## Snapshot to MQTT

To configure an asset to capture snapshots from a camera and publish them to an MQTT topic, create a file that contains the following YAML:

```yaml
apiVersion: deviceregistry.microsoft.com/v1
kind: Asset
metadata:
  name: "contoso-rtsp-snapshot-to-mqtt-autostart"
spec:
  assetEndpointProfileRef: contoso-rtsp-aep
  enabled: true
  datasets:
    - name: dataset1
      dataPoints:
        - name: snapshot-to-mqtt
          dataSource: snapshot-to-mqtt
          dataPointConfiguration: |
            {
              "taskType": "snapshot-to-mqtt",
              "autostart": true,
              "realtime": true,
              "loop": true,
              "format": "jpeg",
              "fps": 1
            }
```

To add the asset, run the following command. Typically, you apply the settings to the `azure-iot-operations` namespace:

```console
kubectl apply -f <filename>.yaml -n <AIO NAMESPACE>
```

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
kubectl delete -f <filename>.yaml -n <AIO NAMESPACE>
```

## Snapshot to file system

To configure an asset to capture snapshots from a camera and save them as files, create a file that contains the following YAML:

```yaml
apiVersion: deviceregistry.microsoft.com/v1
kind: Asset
metadata:
  name: "contoso-rtsp-snapshot-to-fs-autostart"
spec:
  assetEndpointProfileRef: contoso-rtsp-aep
  enabled: true
  datasets:
    - name: dataset1
      dataPoints:
        - name: snapshot-to-fs
          dataSource: snapshot-to-fs
          dataPointConfiguration: |
            {
              "taskType": "snapshot-to-fs",
              "autostart": true,
              "realtime": true,
              "loop": true,
              "format": "jpeg",
              "fps": 1
            }
```

The files are saved in the file system of the `opc-media-1-*` pod. To find the full name of the pod, run the following command. Typically, you apply the settings to the `azure-iot-operations` namespace:

```console
kubectl get pods -n <AIO NAMESPACE>
```

To view the files, create a shell in the pod. Use the full name of the pod in the following command:

```console
kubectl exec --stdin --tty aio-opc-media-1-* -n <AIO NAMESPACE> -- sh
```

Then navigate to the following folder to view the files: `/tmp/azure-iot-operations/data/contoso-rtsp-snapshot-to-fs-autostart/snapshot`. The folder name includes the name of your asset.

When you finish testing the asset, you can delete it by running the following command:

```console
kubectl delete -f <filename>.yaml -n <AIO NAMESPACE>
```

## Clip to file system

To configure an asset to capture clips from a camera and save them as files, create a file that contains the following YAML:

```yaml
apiVersion: deviceregistry.microsoft.com/v1
kind: Asset
metadata:
  name: "contoso-rtsp-clip-to-fs-autostart"
spec:
  assetEndpointProfileRef: contoso-rtsp-aep
  enabled: true
  datasets:
    - name: dataset1
      dataPoints:
        - name: clip-to-fs
          dataSource: clip-to-fs
          dataPointConfiguration: |
            {
              "taskType": "clip-to-fs",
              "format": "avi",
              "autostart": true,
              "realtime": true,
              "loop": true,
              "duration": 3
            }
```

The files are saved in the file system of the `opc-media-1-*` pod. To find the full name of the pod, run the following command. Typically, you apply the settings to the `azure-iot-operations` namespace:

```console
kubectl get pods -n <AIO NAMESPACE>
```

To view the files, create a shell in the pod. Use the full name of the pod in the following command:

```console
kubectl exec --stdin --tty aio-opc-media-1-* -n <AIO NAMESPACE> -- sh
```

Then navigate to the following folder to view the files: `/tmp/azure-iot-operations/data/contoso-rtsp-clip-to-fs-autostart/clip`. The folder name includes the name of your asset.

When you finish testing the asset, you can delete it by running the following command:

```console
kubectl delete -f <filename>.yaml -n <AIO NAMESPACE>
```

## Stream to RTSP

To configure an asset to stream video using the media server, create a file that contains the following YAML. Replace the placeholder with the IP address of the media server you noted previously:

```yaml
apiVersion: deviceregistry.microsoft.com/v1
kind: Asset
metadata:
  name: "contoso-rtsp-stream-to-rtsp-autostart"
spec:
  assetEndpointProfileRef: contoso-rtsp-aep
  enabled: true
  datasets:
    - name: dataset1
      dataPoints:
        - name: stream-to-rtsp
          dataSource: stream-to-rtsp
          dataPointConfiguration: |
            {
              "taskType": "stream-to-rtsp",
              "autostart": true,
              "realtime": true,
              "loop": true,
              "media_server_address": "<YOUR MEDIA SERVER IP ADDRESS>"
            }
```

To view the media stream, use a URL that looks like: `https://<YOUR KUBERNETES CLUSTER IP ADDRESS>:8888/azure-iot-operations/data/contoso-rtsp-stream-to-rtsp-autostart/`.

> [!TIP]
> If you're running Azure IoT Operations in Codespaces, run the following command to port forward the media server to your local machine: `kubectl port-forward service/media-server-public 8888:8888 -n media-server`.

When you finish testing the asset, you can delete it by running the following command:

```console
kubectl delete -f <filename>.yaml -n <AIO NAMESPACE>
```

## Samples

For more examples that show how to configure and use the media connector, see the [Azure IoT Operations samples repository](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/media-connector-invoke-test/README.md).
