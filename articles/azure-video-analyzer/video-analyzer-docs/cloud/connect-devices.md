---
title: Connect devices to the service
description: This article describes how to connect devices to Azure Video Analyzer
ms.service: azure-video-analyzer
ms.topic: how-to
ms.date: 11/04/2021
ms.custom: ignite-fall-2021
---
# Connect devices to Azure Video Analyzer

[!INCLUDE [header](includes/cloud-env.md)]

[!INCLUDE [deprecation notice](../includes/deprecation-notice.md)]

In order to capture and record video from a device, Azure Video Analyzer service needs to establish an [RTSP](../terminology.md#rtsp) connection to it. If the device is behind a firewall, such connections are blocked, and it may not always be possible to create rules to allow inbound connections from Azure. To support such devices, you can build and install an [Azure IoT Plug and Play](../../../iot-develop/overview-iot-plug-and-play.md) device implementation, which listens to commands sent via IoT Hub from Video Analyzer and then opens a secure websocket tunnel to the service. Once such a tunnel is established, Video Analyzer can then connect to the RTSP server.

## Overview 

This article provides high-level concepts about building an Azure IoT PnP device implementation that can enable Video Analyzer to capture and record video from a device. 

The application will need to: 

1. Run as an IoT device 
1. Implement the [IoT PnP](../../../iot-develop/overview-iot-plug-and-play.md) interface with a specific command (`tunnelOpen`) 
1. Upon receiving such a command: 
   * Validate the arguments received 
   * Open a secure websocket connection to the URL provided using the token provided
   * Forward the websocket bytes to the camera's RTSP server TCP connection

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/connect-devices/connect-devices.svg" alt-text="Connect devices to the cloud":::

## Run as an IoT Device 

The Video Analyzer application will be deployed as a Video Analyzer PnP plugin. This requires using one of the [Azure IoT device SDKs](../../../iot-develop/libraries-sdks.md#device-sdks) to build your IoT PnP device implementation. Register the IoT device with your IoT Hub to get the IoT Hub Device ID and Device Connection String.

### IoT Device Client Configuration

* Set OPTION_MODEL_ID to `“dtmi:azure:videoanalyzer:WebSocketTunneling;1”` to support PnP queries  
* Ensure your device is using either the MQTT or MQTT over WebSockets protocol to connect to Azure IoT Hub 
    * Connect to IoT Hub over an HTTPS proxy if configured on the IoT device  
* Register callback for `tunnelOpen` direct method 

## Implement the IoT PnP Interface for Video Analyzer

The following [Digital Twins Definition Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl) model describes a device that can connect to Video Analyzer.

```json
{
  "@context": "dtmi:dtdl:context;2",
  "@id": "dtmi:azure:videoanalyzer:WebSocketTunneling;1",
  "@type": "Interface",
  "displayName": "Azure Video Analyzer Web Socket Tunneling",
  "description": "This interface enables media publishing to Azure Video Analyzer service from a RTSP compatible device which is located behind a firewall or NAT device.",
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

The IoT device registers a direct method `tunnelOpen`, where the body of the request will have the parameters `remoteEndpoint`, `remoteAuthorizationToken`, and `localPort` as shown above.

## Implement the direct method `tunnelOpen`
When the `tunnelOpen` direct method is invoked by Video Analyzer service, the application needs to do the following:

1. Get the available RTSP port(s) of the device
1. Compare the `localPort` value specified in the direct method call with the available ports
   * Return **BadRequest** if no match is found (see Error Responses section below)
1. Open a TCP connection to "(camera IP or hostname):`localPort`"
   * Return **BadRequest** if the connection fails
   * NOTE: hostname is typically **localhost**
1. Open a web socket connection to the `remoteEndpoint` (through a proxy if configured on the device)
   * Set the HTTP "Authorization" header as "Bearer (remoteAuthorizationToken)"
   * Set the header "TunnelConnectionSource" with value "PnpDevice"
   * Set User-Agent to a suitable value that would help you identify your implementation. 
      * For example, you may want to capture the architecture of the CPU, the OS, the model/make of the device.
   * Return 200 OK if the web socket connection was successful, otherwise return the appropriate error code
1. Return response (do not block)
1. IoT PnP device implementation starts sending TCP data bi-directionally between the websocket and RTSP server TCP connection

Video Analyzer service will retry `tunnelOpen` requests on failure, so retries are not needed in the application.

### Error responses
If the `tunnelOpen` request fails then the response body should be as follows

```
{
    "code": "<errorCode>", // Use HTTP status error codes
    "target": "<uri>", // The target URI experiencing the issue
    "message": "<Error message>",  // Short error message describing issue. Do not include end user identifiable information.
}
```
Examples of such error responses are:

* Local port is not available as an RTSP or RTSPS port
{ "code": "400", "target": "(camera IP or hostname):{localPort}", "message": "Local port is not available"}
* Timeout/could not connect to RTSP endpoint
{ "code": "400", "target": "(camera IP or hostname):{localPort}", "message":"Could not connect to RTSP endpoint"}
*	Timeout/error response from web socket connect attempt
{ "code": "{WebSocket response code}", "target": "{remoteEndpoint}", "message": "{Web socket response error message}"}


## Ingestion to Video Analyzer
In order to capture and record video to Video Analyzer, a pipeline topology with tunneling enabled must be created. From that topology, a live pipeline must be created and activated. [Instructions for this process are outlined here.](use-remote-device-adapter.md#create-pipeline-topology-in-the-video-analyzer-service)

 
## Example implementation
Contact videoanalyzerhelp@microsoft.com if you would like to implement an application on your device to connect it to Video Analyzer.

## See Also 

[What is IoT Plug and Play?](../../../iot-develop/overview-iot-plug-and-play.md)
