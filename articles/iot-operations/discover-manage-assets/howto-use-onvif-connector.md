---
title: How to use the connector for ONVIF (preview)
description: How to use the connector for ONVIF (preview) to perform tasks such as reading and writing settings in a connected ONVIF compliant camera.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: how-to
ms.date: 04/24/2025

#CustomerIntent: As an industrial edge IT or operations user, I want to configure the connector for ONVIF so that I can read and write camera settings to control an ONVIF compliant camera.
---

# Configure the connector for ONVIF (preview)

In Azure IoT Operations, the connector for ONVIF (preview) enables you to control an ONVIF compliant camera that's connected to your Azure IoT Operations cluster. This article explains how to configure and use the connector for ONVIF to perform tasks such as:

- Reading and writing properties to control a camera.
- Discovering the media streams a camera supports.

## Prerequisites

A deployed instance of Azure IoT Operations. If you don't already have an instance, see [Quickstart: Run Azure IoT Operations in GitHub Codespaces with K3s](../get-started-end-to-end-sample/quickstart-deploy.md).

An ONVIF compliant camera connected to your Azure IoT Operations cluster.

## Deploy the connector for ONVIF

[!INCLUDE [deploy-preview-media-connectors](../includes/deploy-preview-media-connectors.md)]

> [!IMPORTANT]
> If you don't enable preview features, you see the following error message in the `aio-supervisor-...` pod logs when you try to use the media or ONVIF connectors: `No connector configuration present for AssetEndpointProfile: <AssetEndpointProfileName>`.

## Asset endpoint configuration

To configure the ONVIF connector, first create an asset endpoint that defines the connection to the ONVIF compliant camera asset. The asset endpoint includes the URL of the ONVIF discovery endpoint and any credentials you need to access the camera.

If your camera requires authentication, create a secret in your Kubernetes cluster that stores the camera's username and password. The media connector uses this secret to authenticate with the camera:

1. Create a YAML file called _contoso-onvif-secrets.yaml_ with the following content. Replace the placeholders with your camera's username and password encoded in base64:

    ```yaml
    apiVersion: v1
    kind: Secret
    metadata:
      name: contoso-onvif-secrets
    type: Opaque
    data:
      username: "<YOUR CAMERA USERNAME BASE64 ENCODED>"
      password: "<YOUR CAMERA PASSWORD BASE64 ENCODED>"
    ```

    > [!TIP]
    > To encode the username and password in base64 at a Bash prompt, use the following command: `echo -n "<STRING TO ENCODE>" | base64`.

1. To add the secret to your cluster in the default Azure IoT Operations namespace, run the following command:

    ```console
    kubectl apply -f contoso-onvif-secrets.yaml -n azure-iot-operations
    ```

To create the asset endpoint by using a Bicep file:

# [Bash](#tab/bash)

1. Set the following environment variables:

    ```bash
    SUBSCRIPTION_ID="<YOUR SUBSCRIPTION ID>"
    RESOURCE_GROUP="<YOUR AZURE IOT OPERATIONS RESOURCE GROUP>"
    ONVIF_ADDRESS="<YOUR CAMERA ONVIF DISCOVERY ADDRESS>"
    AEP_NAME="contoso-onvif-aep"
    SECRET_NAME="contoso-onvif-secrets"
    ```

1. Run the following script:

    ```bash
    # Download the Bicep file
    wget https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/onvif-connector-bicep/aep-onvif-connector.bicep -O aep-onvif-connector.bicep
    
    # Find the name of your custom location
    CUSTOM_LOCATION_NAME=$(az iot ops list -g $RESOURCE_GROUP --query "[0].extendedLocation.name" -o tsv)
    
    # Use the Bicep file to deploy the asset endpoint
    az deployment group create --subscription $SUBSCRIPTION_ID --resource-group $RESOURCE_GROUP --template-file aep-onvif-connector.bicep --parameters onvifAddress=$ONVIF_ADDRESS customLocationName=$CUSTOM_LOCATION_NAME aepName=$AEP_NAME secretName=$SECRET_NAME
    ```

# [PowerShell](#tab/powershell)

1. Set the following environment variables:

    ```powershell
    $SUBSCRIPTION_ID="<YOUR SUBSCRIPTION ID>"
    $RESOURCE_GROUP="<YOUR AZURE IOT OPERATIONS RESOURCE GROUP>"
    $TARGET_ADDRESS="<YOUR CAMERA ONVIF DISCOVERY ADDRESS>"
    $AEP_NAME="contoso-onvif-aep"
    $SECRET_NAME="contoso-onvif-secrets"
    ```

1. Run the following script:

    ```powershell
    # Download the Bicep file
    Invoke-WebRequest -Uri https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/onvif-connector-bicep/aep-onvif-connector.bicep -OutFile aep-onvif-connector.bicep

    # Find the name of your custom location
    $CUSTOM_LOCATION_NAME = (az iot ops list -g $RESOURCE_GROUP --query "[0].extendedLocation.name" -o tsv)

    # Use the Bicep file to deploy the asset endpoint
    az deployment group create --subscription $SUBSCRIPTION_ID --resource-group $RESOURCE_GROUP --template-file aep-onvif-connector.bicep --parameters onvifAddress=$ONVIF_ADDRESS customLocationName=$CUSTOM_LOCATION_NAME aepName=$AEP_NAME secretName=$SECRET_NAME
    ```

---

The following snippet shows the bicep file that you used to create the asset endpoint:

:::code language="bicep" source="~/azure-iot-operations-samples/samples/onvif-connector-bicep/aep-onvif-connector.bicep":::

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

## Create the asset endpoints and assets to represent the ONVIF camera capabilities

After you create the asset endpoint, the connector for ONVIF runs a discovery process to detect the capabilities of the connected camera. The results of the discovery process are **DiscoveredAsset** and **DiscoverAssetEndpointProfile** custom resources:

- A **DiscoveredAsset** custom resource represents one of the [ONVIF services](https://www.onvif.org/profiles/specifications/) such as pan-tilt-zoom (PTZ) that the camera supports. The output from `kubectl get discoveredassets -n azure-iot-operations` might look like the following example:

    ```output
    NAME                       AGE
    contoso-onvif-aep-device    3m
    contoso-onvif-aep-media     3m
    contoso-onvif-aep-ptz       3m
    ```

- A **DiscoveredAssetEndpointProfile** custom resource represents a video stream format that the camera exposes. The output from `kubectl get discoveredassetendpointprofiles -n azure-iot-operations` might look like the following example:

    ```output
    NAME                                AGE
    contoso-onvif-aep-mainstream-http    3m
    contoso-onvif-aep-mainstream-rtsp    3m
    contoso-onvif-aep-mainstream-tcp     3m
    contoso-onvif-aep-mainstream-udp     3m
    contoso-onvif-aep-minorstream-http   3m
    contoso-onvif-aep-minorstream-rtsp   3m
    contoso-onvif-aep-minorstream-tcp    3m
    contoso-onvif-aep-minorstream-udp    3m
    ```

Currently, during public preview, you must manually create the **Asset** and **AssetEndpointProfile** custom resources that represent the capabilities of the camera and its video streams.

### Access the PTZ capabilities of the camera

Use the PTZ capabilities of an ONVIF compliant camera to control its position and orientation. To manually create an asset that represents the PTZ capabilities of the camera discovered previously:

# [Bash](#tab/bash)

1. Set the following environment variables:

    ```bash
    SUBSCRIPTION_ID="<YOUR SUBSCRIPTION ID>"
    RESOURCE_GROUP="<YOUR AZURE IOT OPERATIONS RESOURCE GROUP>"
    AEP_NAME="contoso-onvif-aep"
    ```

1. Run the following script:

    ```bash
    # Download the Bicep file
    wget https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/onvif-connector-bicep/asset-ptz.bicep -O asset-ptz.bicep
    
    # Find the name of your custom location
    CUSTOM_LOCATION_NAME=$(az iot ops list -g $RESOURCE_GROUP --query "[0].extendedLocation.name" -o tsv)
    
    # Use the Bicep file to deploy the asset
    az deployment group create --subscription $SUBSCRIPTION_ID --resource-group $RESOURCE_GROUP --template-file asset-ptz.bicep --parameters customLocationName=$CUSTOM_LOCATION_NAME aepName=$AEP_NAME
    ```

# [PowerShell](#tab/powershell)

1. Set the following environment variables:

    ```powershell
    $SUBSCRIPTION_ID="<YOUR SUBSCRIPTION ID>"
    $RESOURCE_GROUP="<YOUR AZURE IOT OPERATIONS RESOURCE GROUP>"
    $AEP_NAME="contoso-onvif-aep"
    ```

1. Run the following script:

    ```powershell
    # Download the Bicep file
    Invoke-WebRequest -Uri https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/onvif-connector-bicep/asset-ptz.bicep -OutFile asset-ptz.bicep

    # Find the name of your custom location
    $CUSTOM_LOCATION_NAME = (az iot ops list -g $RESOURCE_GROUP --query "[0].extendedLocation.name" -o tsv)

    # Use the Bicep file to deploy the asset
    az deployment group create --subscription $SUBSCRIPTION_ID --resource-group $RESOURCE_GROUP --template-file asset-ptz.bicep --parameters customLocationName=$CUSTOM_LOCATION_NAME aepName=$AEP_NAME
    ```

---

The following snippet shows the bicep file that you used to create the asset. The `-ptz` suffix to the asset name is a required convention to indicate that the asset represents the PTZ capabilities of the camera:

:::code language="bicep" source="~/azure-iot-operations-samples/samples/onvif-connector-bicep/asset-ptz.bicep":::

### Access the media capabilities of the camera

To manually create an asset that represents the media capabilities of the camera discovered previously:

# [Bash](#tab/bash)

1. Set the following environment variables:

    ```bash
    SUBSCRIPTION_ID="<YOUR SUBSCRIPTION ID>"
    RESOURCE_GROUP="<YOUR AZURE IOT OPERATIONS RESOURCE GROUP>"
    AEP_NAME="contoso-onvif-aep"
    ```

1. Run the following script:

    ```bash
    # Download the Bicep file
    wget https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/onvif-connector-bicep/asset-onvif-media.bicep -O asset-onvif-media.bicep
    
    # Find the name of your custom location
    CUSTOM_LOCATION_NAME=$(az iot ops list -g $RESOURCE_GROUP --query "[0].extendedLocation.name" -o tsv)
    
    # Use the Bicep file to deploy the asset
    az deployment group create --subscription $SUBSCRIPTION_ID --resource-group $RESOURCE_GROUP --template-file asset-onvif-media.bicep --parameters customLocationName=$CUSTOM_LOCATION_NAME aepName=$AEP_NAME
    ```

# [PowerShell](#tab/powershell)

1. Set the following environment variables:

    ```powershell
    $SUBSCRIPTION_ID="<YOUR SUBSCRIPTION ID>"
    $RESOURCE_GROUP="<YOUR AZURE IOT OPERATIONS RESOURCE GROUP>"
    $AEP_NAME="contoso-onvif-aep"
    ```

1. Run the following script:

    ```powershell
    # Download the Bicep file
    Invoke-WebRequest -Uri https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/onvif-connector-bicep/asset-onvif-media.bicep -OutFile asset-onvif-media.bicep

    # Find the name of your custom location
    $CUSTOM_LOCATION_NAME = (az iot ops list -g $RESOURCE_GROUP --query "[0].extendedLocation.name" -o tsv)

    # Use the Bicep file to deploy the asset
    az deployment group create --subscription $SUBSCRIPTION_ID --resource-group $RESOURCE_GROUP --template-file asset-onvif-media.bicep --parameters customLocationName=$CUSTOM_LOCATION_NAME aepName=$AEP_NAME
    ```

---

The following snippet shows the bicep file that you used to create the asset. The `-media` suffix to the asset name is a required convention to indicate that the asset represents the media capabilities of the camera:

:::code language="bicep" source="~/azure-iot-operations-samples/samples/onvif-connector-bicep/asset-onvif-media.bicep":::

### Receive events from the camera

The camera can send notifications such as motion detected events to the Azure IoT Operations cluster. The connector for ONVIF subscribes to the camera's event service and publishes the events to the Azure IoT Operations MQTT broker.

To find the events that camera can send, use the following command to view the description of the **DiscoveredAsset** custom resource that represents the camera. The discovered asset that lists the supported events has a `-device` suffix to the asset name:

```bash
kubectl describe discoveredasset your-discovered-asset-device -n azure-iot-operations
```

The output from the previous command includes a `Spec:` section that looks like the following example:

```output
Spec:
  Asset Endpoint Profile Ref:  your-asset-endpoint-profile-aep
  Datasets:
  Default Datasets Configuration:
  Default Events Configuration:
  Default Topic:
    Path:
    Retain:           Never
  Discovery Id:       a00b978b9d971450fa6378900b164736170bd2d790a2061da94a2238adee0d4f
  Documentation Uri:
  Events:
    Event Configuration:
    Event Notifier:       tns1:RuleEngine/CellMotionDetector/Motion
    Last Updated On:      2025-04-23T15:48:21.585502872+00:00
    Name:                 tns1:RuleEngine/CellMotionDetector/Motion
    Topic:
      Path:
      Retain:             Never
    Event Configuration:
    Event Notifier:       tns1:RuleEngine/TamperDetector/Tamper
    Last Updated On:      2025-04-23T15:48:21.585506712+00:00
    Name:                 tns1:RuleEngine/TamperDetector/Tamper
    Topic:
      Path:
      Retain:             Never
```

During public preview, you must manually add an asset definition based on the information in the discovered asset. To manually create an asset that represents the media capabilities of the camera discovered previously:

# [Bash](#tab/bash)

1. Set the following environment variables:

    ```bash
    SUBSCRIPTION_ID="<YOUR SUBSCRIPTION ID>"
    RESOURCE_GROUP="<YOUR AZURE IOT OPERATIONS RESOURCE GROUP>"
    AEP_NAME="contoso-onvif-aep"
    ```

1. Run the following script:

    ```bash
    # Download the Bicep file
    wget https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/onvif-connector-bicep/asset-onvif-device.bicep -O asset-onvif-device.bicep
    
    # Find the name of your custom location
    CUSTOM_LOCATION_NAME=$(az iot ops list -g $RESOURCE_GROUP --query "[0].extendedLocation.name" -o tsv)
    
    # Use the Bicep file to deploy the asset
    az deployment group create --subscription $SUBSCRIPTION_ID --resource-group $RESOURCE_GROUP --template-file asset-onvif-device.bicep --parameters customLocationName=$CUSTOM_LOCATION_NAME aepName=$AEP_NAME
    ```

# [PowerShell](#tab/powershell)

1. Set the following environment variables:

    ```powershell
    $SUBSCRIPTION_ID="<YOUR SUBSCRIPTION ID>"
    $RESOURCE_GROUP="<YOUR AZURE IOT OPERATIONS RESOURCE GROUP>"
    $AEP_NAME="contoso-onvif-aep"
    ```

1. Run the following script:

    ```powershell
    # Download the Bicep file
    Invoke-WebRequest -Uri https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/onvif-connector-bicep/asset-onvif-device.bicep -OutFile asset-onvif-device.bicep

    # Find the name of your custom location
    $CUSTOM_LOCATION_NAME = (az iot ops list -g $RESOURCE_GROUP --query "[0].extendedLocation.name" -o tsv)

    # Use the Bicep file to deploy the asset
    az deployment group create --subscription $SUBSCRIPTION_ID --resource-group $RESOURCE_GROUP --template-file asset-onvif-device.bicep --parameters customLocationName=$CUSTOM_LOCATION_NAME aepName=$AEP_NAME
    ```

---

The following snippet shows the bicep file that you used to create the asset. The `-device` suffix to the asset name is a required convention to indicate that the asset represents the device capabilities of the camera:

:::code language="bicep" source="~/azure-iot-operations-samples/samples/onvif-connector-bicep/asset-onvif-device.bicep":::

The connector for ONVIF now receives notifications of motion detected events from the camera and publishes them to the `data/camera-device` topic in the MQTT broker:

```output
{
  "name": "motionDetected",
  "eventNotifier": "tns1:RuleEngine/CellMotionDetector/Motion",
  "source": {
    "VideoSourceConfigurationToken": "vsconf",
    "VideoAnalyticsConfigurationToken": "VideoAnalyticsToken",
    "Rule": "MyMotionDetectorRule"
  },
  "data": {
    "IsMotion": "true"
  }
}
```

## Manage and control the camera

To interact with the ONVIF camera, you can publish MQTT messages that the connector for ONVIF subscribes to. The message format is based on the [ONVIF network interface specifications](https://www.onvif.org/profiles/specifications/).

The [Azure IoT Operations connector for ONVIF PTZ Demo](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/aio-onvif-connector-ptz-demo) sample application shows how to use the connector for ONVIF to:

- Use the media asset definition to retrieve a profile token from the camera's media service.
- Use the profile token when you use the camera's PTZ capabilities control its position and orientation.

The sample application uses the Azure IoT Operations MQTT broker to send commands to interact with the connector for ONVIF. To learn more, see [Publish and subscribe MQTT messages using MQTT broker](../manage-mqtt-broker/overview-broker.md).

### Access the camera's video streams

To manually create an asset endpoint and asset that enable access to the video streams of the ONVIF-compliant camera:

1. During public preview, first use a tool to discover the RTSP stream URLs of the camera.

1. Use the RTSP stream URL to create the asset endpoint and asset. To learn more, see [Configure the media connector (preview)](howto-use-media-connector.md).
