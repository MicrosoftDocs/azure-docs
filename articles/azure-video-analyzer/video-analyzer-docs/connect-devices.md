---
title: Connect devices behind a firewall to Azure Video Analyzer
description: This article describes how to connect devices behind a firewall to Azure Video Analyzer
ms.service: azure-video-analyzer
ms.topic: how-to
ms.date: 11/02/2021 
 
---
# Connect devices behind a firewall to Azure Video Analyzer

In order to capture and record video from a device, Azure Video Analyzer service needs to connect to an [RTSP](terminology.md#rtsp) server running on such devices. If the device is behind a firewall, such connections are blocked. To support such devices, you can build and install an application on the device, which listens to commands sent via IoT Hub from Video Analyzer, and then opens a secure websocket tunnel to the service. Once such a tunnel is established, Video Analyzer can then connect to the RTSP server. 

## Overview 

This article provides high-level concepts to about building an application that can enable Video Analyzer to capture and record video from a device behind a firewall. 

The application will need to: 

1. Run as an IoT device 

1. Implement the IoT PnP interface with a specific command (TunnelOpen) 

1. Upon receiving such a command: 

    a. Validate the arguments received 

    b. Open a secure websocket connection to the URL provided using the token provided 

    c. Forward the RTSP requests received from the Video Analyzer service to the RTSP server running on the device 

To-do: Add image

## Run as an IoT Device 

The Azure Video Analyzer application needs to be configured and run as an Azure IoT device. This requires using one of the [Azure IoT device SDKs](../../iot-develop/libraries-sdks.md#device-sdks). Register the IoT device with your IoT Hub using symmetric key authentication to get the Azure IoT Device ID and Device Connection String. Once the connection is successful, keep the connection alive. There may be network interruptions that break the connection. Typically, the SDK should handle retries, but it may be necessary to explicitly attempt to recreate the connection.  

**IoT Device Client Configuration**: 

* Set OPTION_MODEL_ID to `“dtmi:azure:videoanalyzer:WebSocketTunneling;1”` to support PnP queries  

* Ensure your device is using either the MQTT or MQTT over WebSockets protocol to connect to Azure IoT Hub 

    * Connect to IoT Hub over an HTTPS proxy if configured on the IoT device  

* Register callback for “tunnelOpen” direct method 

## PnP Interface 

This IoT PnP model defines the capability of Azure Video Analyzer to tunnel over a web socket.

```json
{
  "@context": "dtmi:dtdl:context;2",
  "@id": "dtmi:azure:videoanalyzer:WebSocketTunneling;1",
  "@type": "Interface",
  "displayName": "Azure Video Analyzer Web Socket Tunneling",
  "description": "This interface enables media publishing to Azure Video Analyzer cloud from a RTSP compatible device which is located behind a firewall or NAT device.",
  "contents": [
    {
      "@type": "Command",
      "displayName": "Tunnel Open",
      "name": "tunnelOpen",
      "request": {
        "@type": "CommandPayload",
        "displayName": "Parameters",
        "name": "parameters",
        "schema": {
          "@type": "Object",
          "fields": [
            {
              "displayName": "Remote Endpoint",
              "description": "The remote endpoint for the web socket tunnel.",
              "name": "remoteEndpoint",
              "schema": "string"
            },
            {
              "displayName": "Remote Authorization Token",
              "description": "The bearer token for the web socket authentication.",
              "name": "remoteAuthorizationToken",
              "schema": "string"
            },
            {
              "displayName": "Local Port",
              "description": "The local port where web socket data should be tunneled to.",
              "name": "localPort",
              "schema": "integer"
            }
          ]
        }
      }
    }
  ]
}
```

The IoT device client registers direct method “tunnelOpen” and a callback. The body of the request will have the following parameters as seen in the PnP contract:  

1. remoteEndpoint 
1. remoteAuthorizationToken 
1. localPort   

## Testing the application  

1. Install the application on the device 
1. Create IoT Hub
1. Update the Video Analyzer service so that it has access to the above IoT Hub <To-do: Link to article> 
1. Create an IoT device under the hub, use the device credentials in the PnP application
1. Create a pipeline topology, and then a live pipeline in Video Analyzer that uses the above hub and device as the RTSP source. Activate the pipeline to start the flow of video.  

Shortly after video ingestion is started, you can view the video in the portal or get an URL and access tokens to view the video using custom applications.  

1. Define tunneling in the pipeline topology on the RTSP source. 
1. Set the IoT Hub name and IoT Device ID. 
1. Set the pipeline topology and live pipeline on the Video Analyzer account. 
1.  Active the live pipeline to start video ingestion from the camera behind a firewall.   

After live pipeline activation:  

* AVA Cloud creates a session and secure authorization token for the tunnel. 
* Using the IoT Hub name and IoT Device ID configured on the pipeline, Video Analyzer Cloud makes a direct method request with a tunneling PnP model. 
* The camera configured as an IoT device receives the tunnel open command, connects to both the local RTSP port and Video Analyzer Cloud and tunnels these connections.
* Video Analyzer Cloud notifies backend services video ingestion is ready. 
* Video Analyzer establishes the RTSP session through the tunnel.   

## See Also 

[What is IoT Plug and Play?](../../iot-develop/overview-iot-plug-and-play.md)