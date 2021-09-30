---
title: Connecting camera to cloud using a transparent gateway
description: This article explains how to connect a camera to Azure Video Analyzer using a transparent gateway. 
ms.topic: reference
ms.date: 11/01/2021

---

# Connecting cameras to the cloud using a transparent gateway
Azure Video Analyzer allows users to connect cameras directly to the cloud in order capture and record video, using cloud pipelines.
Connecting cameras to the cloud using a transparent gateway allows cameras to connect to Video Analyzer via the Video Analyzer Edge module acting as a transparent gateway. This approach is useful in the following scenarios:

* When cameras connected to the gateway need to be shielded from exposure to the internet
* When cameras do not have the functionality to connect to IoT Hub independently
* When power, space, or other considerations permit only a lightweight edge device to be deployed on-premise

<!-- TODO: add graphic -->
> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/use-transparent-gateway/use-transparent-gateway.svg" alt-text="Connecting cameras to the cloud using a transparent gateway":::

## Pre-reading
[Get started with Azure Video Analyzer in the Portal](../get-started-detect-motion-emit-events-portal.md)
[Connect camera to the cloud](connect-cameras-to-cloud.md#connecting-via-a-transparent gateway)

## Prerequisites
The following are required for this tutorial:

* An Azure account that has an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) if you don't already have one.
* Azure Video Analyzer account with associated:
  * Storage account
  * User-assigned managed identity (UAMI)
* IoT Hub
  * Video Analyzer associated UAMI has **Owner** role
* [IoT Edge with Video Analyzer edge module installed and configured manually](../edge/deploy-iot-edge-device.md)
* [Azure Directory application with Owner access, service principal, and client secret](../../../active-directory/develop/howto-create-service-principal-portal.md)
  * Be sure to keep record of the values for the Tenant ID, App (Client) ID, and client secret.



## Ensure that camera(s) are on the same network as edge device
<!-- TODO: add instructions for testing using VLC on the edge server-->


## Create IoT device for camera via Portal
An IoT device has to be created for each camera to connect to the cloud.

In Azure Portal:
1. Navigate to the IoT Hub
1. Select the **IoT devices** pane under **Explorers**
1. Select **+Add device** 
1. Enter a **Device ID** with a unique string (Ex: building404-camera1)
1. All other properties can be left as default
1. Select **Save** to create the IoT device
1. Select the IoT device, and record the **Primary key**, as it will be needed

## Enable Video Analyzer edge module to act as transparent gateway
To enable the edge module to act as a transparent gateway between the camera and Video Analyzer, you must invoke a direct method that requires the following values:  
* Device ID for the IoT device
* Primary key for the IoT device
* Camera's IP address
* Camera's RTSP port (typically: **554**)  

In Azure Portal:
1. Navigate to the IoT Hub
1. Select the **IoT Edge** pane under **Automatic Device Management**
1. Select the corresponding edge device (Ex: ava-sample-device)
1. Under modules, select **avaedge**
1. Select **</> Direct Method** 
1. Enter **RemoteDeviceAdapterSet** for Method Name
1. Enter the following for **Payload** :

```
 {
   "@apiVersion" : "1.0",
   "name": "remoteDeviceAdapterCamera1",
   "properties": {
     "target": {
       "host": "<Camera's IP address>:<Camera's RTSP port>"
      },
     "iotHubDeviceConnection": {
      "deviceId": "<Device ID>",
      "credentials": {
        "@type": "#Microsoft.VideoAnalyzer.SymmetricKeyCredentials",
        "key": "<Primary Key>"
       }
    }
 }
```
If successful, you will receive a response with a status code 201.

> [!NOTE]
> IoT Hub ARM ID and IoT Hub User-Assiged Managed Identity ARM ID will be needed for the next steps. To acquire the IoT Hub ARM ID, navigate to the **Overview** pane of the IoT Hub and select **JSON View**. Record the **Resource ID** value for the IoT Hub ARM ID. To acquire the IoT Hub User-Assiged Managed Identity ARM ID, navigate to the **Overview** pane of the user-assigned managed identity that has been assigned **Owner** role on the IoT Hub and select **JSON View**. Record the **Resource ID** value for the IoT Hub User-Assiged Managed Identity ARM ID.

## Create cloud topology and pipeline
When creating a cloud pipeline to ingest from camera behind a firewall, tunneling must be enabled on the RTSP source node of the topology.
The following values are required to enable tunneling:  
* Device ID
* IoT Hub ARM ID
* IoT Hub User-Assigned Managed Identity ARM ID

```
{
        "@type": "#Microsoft.VideoAnalyzer.RtspSource",
        "name": "rtspSource",
        "transport": "tcp",
        "endpoint": {
            "@type": "#Microsoft.VideoAnalyzer.UnsecuredEndpoint",
            "url": "${rtspUrlParameter}",
            "credentials": {
                "@type": "#Microsoft.VideoAnalyzer.UsernamePasswordCredentials",
                "username": "${rtspUsernameParameter}",
                "password": "${rtspPasswordParameter}"
            },
            "tunnel": { 
               "@type": "#Microsoft.VideoAnalyzer.IotSecureDeviceRemoteTunnel",
               "deviceId": "<Device ID>",
               "iotHubArmId": "<IoT Hub ARM ID>",
               "userAssignedManagedIdentityArmId": "<IoT Hub User-Assigned Managed Identity ARM ID>"
            }
        }
    }

``` 


<!-- TODO: add link to Mayank's Cloud pipeline quickstart -->

## Playback in Portal

## Next Steps

