---
title: How to use the connector for ONVIF (preview)
description: How to use the connector for ONVIF (preview) to perform tasks such as reading and writing settings in a connected ONVIF compliant camera.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: how-to
ms.date: 11/06/2024

#CustomerIntent: As an industrial edge IT or operations user, I want to configure the connector for ONVIF so that I can read and write camera settings to control an ONVIF compliant camera.
---

# Configure the connector for ONVIF (preview)

In Azure IoT Operations, the connector for ONVIF (preview) enables you to control an ONVIF compliant camera that's connected to your Azure IoT Operations cluster. This article explains how to configure and use the connector for ONVIF to perform tasks such as reading and writing properties to control a camera or discovering the media streams a camera supports.

## Prerequisites

A deployed instance of Azure IoT Operations. If you don't already have an instance, see [Quickstart: Run Azure IoT Operations in GitHub Codespaces with K3s](../get-started-end-to-end-sample/quickstart-deploy.md).

An ONVIF compliant camera connected to your Azure IoT Operations cluster.

> [!NOTE]
> Microsoft has validated this preview release with the TP-Link Tapo C210 camera.

## Use Bicep to discover and register ONVIF compliant assets

The connector for ONVIF (preview) uses [asset endpoint and asset](concept-assets-asset-endpoints.md) custom resources to represent the connection and the camera.

For example, use the following Bicep and parameters to create an asset endpoint that enables discovery of an ONVIF compliant camera at `http://onvif-rtsp-simulator:8000`:

```bicep
metadata description = 'Asset endpoint profile for ONVIF discovery'
param resourceName  string
param targetAddress string
param customLocationName string

/*****************************************************************************/
/*                          Existing AIO cluster                             */
/*****************************************************************************/
resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}
/*****************************************************************************/
/*                          Asset endpoint profile                           */
/*****************************************************************************/
resource assetEndpoint 'Microsoft.DeviceRegistry/assetEndpointProfiles@2024-11-01' = {
  name: resourceName
  location: resourceGroup().location
  extendedLocation: {
    type: 'CustomLocation'
    name: customLocation.id
  }
  properties: {
    targetAddress: targetAddress
    endpointProfileType: 'Microsoft.Onvif'
    authentication: {
      method: 'Anonymous'
    }
    additionalConfiguration: '{"$schema": "https://aiobrokers.blob.core.windows.net/aio-onvif-connector/1.0.0.json"}'
  }
}
```

The following JSON snippet shows a set of parameter values to use:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "resourceName": {
            "value": "aep-onvif-discovery-anonymous-1"
        },
        "targetAddress": {
            "value": "http://onvif-rtsp-simulator:8000"
        }
     }
}
```

These parameters configure:

- The name of the asset endpoint to create.
- The address of the ONVIF compliant camera to discover capabilities from.

To apply the previous configuration, save the examples above as files, and run the following command:

```azurecli
az deployment group create --resource-group <your resource group> --template-file aep-onvif-discovery-anonymous.bicep --parameters aep-onvif-discovery-anonymous.json --parameters customLocationName=<your custom location>
```

[!INCLUDE [discover-custom-location](../includes/discover-custom-location.md)]

After you create the asset endpoint, the connector for ONVIF runs a discovery process to detect the capabilities of the connected camera. The results of the discovery process are **DiscoveredAsset** and **DiscoverAssetEndpointProfile** custom resources.

## Create the asset endpoints and assets to represent the ONVIF camera

Each **DiscoveredAsset** custom resource represents one of the [ONVIF services](https://www.onvif.org/profiles/specifications/) such as pan-tilt-zoom (PTZ) that the camera supports.

Each **DiscoveredAssetEndpointProfile** custom resource represents a video stream format that the camera exposes.

Currently, during public preview, you must manually create the **Asset** and **AssetEndpointProfile** custom resources that represent the capabilities of the camera and its video streams.

To create an asset that represents the PTZ capabilities of the camera discovered above, use the following Bicep and parameters:

```bicep
metadata description = 'ONVIF camera PTZ capabilities'
param resourceName  string
param customLocationName string
param assetName     string
param displayName string

/*****************************************************************************/
/*                          Existing AIO cluster                             */
/*****************************************************************************/
resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}
/*****************************************************************************/
/*                                    Asset                                  */
/*****************************************************************************/
resource asset 'Microsoft.DeviceRegistry/assets@2024-11-01' = {
  name: assetName
  location: resourceGroup().location
  extendedLocation: {
    type: 'CustomLocation'
    name: customLocation.id
  }
  properties: {
    displayName: displayName
    assetEndpointProfileRef: resourceName
  }
}
```

The following JSON snippet shows a set of parameter values to use:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "resourceName": {
            "value": "aep-onvif-discovery-anonymous-1"
        },
        "assetName": {
            "value": "simulator-ptz"
        },
        "displayName": {
            "value": "Simulator PTZ Service"
        }
    }
}
```

These parameters configure:

- The name of the asset to create. The `-ptz` suffix is a required convention to indicate that the asset represents the PTZ capabilities of the camera.
- The associated asset endpoint you created previously.

To apply the previous configuration, save the examples above as files, and run the following command:

```azurecli
az deployment group create --resource-group <your resource group> --template-file asset-onvif-ptz.bicep --parameters asset-onvif-ptz.json --parameters customLocationName=<your custom location>
```

[!INCLUDE [discover-custom-location](../includes/discover-custom-location.md)]

## Manage and control the camera

To interact with the ONVIF camera, you can publish MQTT messages that the connector for ONVIF subscribes to. The message format is based on the [ONVIF network interface specifications](https://www.onvif.org/profiles/specifications/).

The [Azure IoT Operations connector for ONVIF PTZ Demo](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/aio-onvif-connector-ptz-demo) sample application shows how to use the connector for ONVIF to interact with the PTZ capabilities of an ONVIF camera.

The sample application uses the Azure IoT Operations MQTT broker to send commands to the connector for ONVIF. To learn more, see [Secure MQTT broker communication using BrokerListener](../manage-mqtt-broker/howto-configure-brokerlistener.md).


