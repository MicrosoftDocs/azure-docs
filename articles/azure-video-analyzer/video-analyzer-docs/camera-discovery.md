---
title: Discovering ONVIF-capable cameras in the local subnet
description: This how-to shows you how you can use Video Analyzer edge module to discover ONVIF-capable cameras in your local subnet.

ms.topic: how-to
ms.date: 10/05/2021
---

# Discovering ONVIF-capable cameras in the local subnet

This how to guide walks you through how to use the Azure Video Analyzer edge module to discover ONVIF compliant cameras on the same subnet as the IoT Edge device.  Open Network Video Interface Forum or ONVIF is an open standard where discrete IP-based physical devices, such as surveillance cameras, can communicate with additional networked devices and software.  For more information about ONVIF please visit the [ONVIF](https://www.onvif.org/about/mission/) website.

## Prerequisites

To complete the steps in this article, you need to:

- Have an active Azure subscription.
- Install the [Azure CLI extension for IoT](https://github.com/Azure/azure-iot-cli-extension#installation)
- Complete one of the following:
  - [Quickstart: Get started with Azure Video Analyzer](get-started-detect-motion-emit-events.md)
  - [Quickstart: Get started with Azure Video Analyzer in the Azure portal](get-started-detect-motion-emit-events-portal.md)
- Have the Video Analyzer edge module version 1.1 (or newer) deployed to your IoT Edge device.
    
    The ONVIF feature of the Video Analyzer edge module requires specific container create options, as described in [Enable ONVIF discovery feature](#enable-onvif-discovery-feature).
  
> [!NOTE]
> If you have a new deployment of Video Analyzer account and/or a new deployment of the Video Analyzer edge module, you can skip to the section for [Use direct method calls](#use-direct-method-calls). Otherwise, follow the below sections to upgrade your existing Video Analyzer edge module to enable the ONVIF discovery feature.  

## Check the Video Analyzer edge modules version

From a command prompt run the following command:

```CLI
az iot hub module-twin show -m <VIDEO_ANALYZER_IOT_EDGE_MODULE_NAME> -n <IOT_HUB_NAME> -d <IOT_EDGE_DEVICE_NAME> --query 'properties.reported.ProductInfo' -o tsv
```

If the result of the above command is **Azure Video Analyzer:1.0.1** then run the following steps to update the Video Analyzer edge module to version 1.1.

1. In the Azure portal navigate to the IoT Hub that is used with your Video Analyzer account deployment.
1. Click on IoT Edge under Automatic Device Management and select the IoT Edge device that is configured to run the Video Analyzer edge module.
1. Click on Set modules and click on review + create.
1. Click on create.
1. After a few moments the Video Analyzer edge module will update and you can run the above command again to verify.  

### Enable ONVIF discovery feature

If the Video Analyzer edge module was updated from 1.0 to 1.1 (or newer) it is necessary to add additional elements into the IoT Edge container create options.  These elements allow the Video Analyzer edge module to communicate through the host network to discover ONVIF enabled cameras on the same subnet.

1. In the Azure portal navigate to the IoT Hub that is used with your Video Analyzer account deployment.
1. Click on IoT Edge under Automatic Device Management and select the IoT Edge device that is configured to run the Video Analyzer edge module.
1. Click on Set modules and select the Video Analyzer edge module.
1. Select **Container Create Options** and add the following:

    ```JSON
    { 
        "NetworkingConfig": {  
            "EndpointsConfig": {  
            "host": {}  
            }  
        }, 
        "HostConfig": { 
            "NetworkMode": "host" 
                } 
    } 
    ```
3. Click **Update** at the bottom.
4. Click **Review + create**.
5. Click **Create**.

## Use direct method calls

Video Analyzer edge module provides direct method calls for ONVIF discovery of network attached cameras.  
The following steps apply to both the `onvifDeviceDiscover` and the `onvifDeviceGet` sections below:

1. In the Azure portal navigate to the IoT Hub that is used with your Video Analyzer account deployment.
1. Click on IoT Edge under Automatic Device Management and select the IoT Edge device that is configured to run the Video Analyzer edge module.
1. Click on the Video Analyzer edge module and select  `Direct method`.

### onvifDeviceDiscover

Lists all the discoverable ONVIF devices on the same network as the Video Analyzer edge module.

> [!NOTE]
> The discover process only returns the discoverable devices in the same subnet as the IoT Edge device that is running the Video Analyzer edge module.

1. In the method name enter:

    ```
    onvifDeviceDiscover
    ```
1. In the payload enter:

    ```JSON
    {
        "@apiVersion":"1.1",
        "discoveryDuration":"PT10S"
    }
    ```

    > [!NOTE]
    > The discovery duration is the amount of time that the Video Analyzer edge module waits to receive responses from ONVIF discoverable devices.  It might be necessary in a large environment to adjust this value.

    Within a few seconds you see the following `result`:

    ```JSON
    {
        "status": 200,
        "payload": {
            "value": [
                {
                    "serviceIdentifier": "{urn:uuid}",
                    "remoteIPAddress": "{IP_ADDRESS}",
                    "transportAddresses": [
                        "http://10.0.1.79/onvif/device_service",
                        "https://10.0.1.79/onvif/device_service"
                    ],
                    "scopes": [
                        "onvif://www.onvif.org/type/Network_Video_Transmitter",
                        "onvif://www.onvif.org/name/{CAMERA_MANUFACTURE}",
                        "onvif://www.onvif.org/location/",
                        "onvif://www.onvif.org/hardware/{CAMERA_MODEL}",
                        "onvif://www.onvif.org/Profile/Streaming",
                        "onvif://www.onvif.org/Profile/G",
                        "onvif://www.onvif.org/Profile/T"
                    ]
                }
            ]
        }
    }
    ```

    > [!NOTE]
    > The return status of 200 indicates that the direct method call was handled successfully.

### onvifDeviceGet

This direct method helps you retrieve detailed information about a specific ONVIF device.

1. In the method name enter:

    ```
    onvifDeviceGet
    ```
1. In the payload enter:

    ```JSON
    { 
        "@apiVersion": "1.1",  
        "remoteIPAddress": "{IP_ADDRESS_OF_ONVIF_DEVICE}", 
        "username": "{USER_NAME}", 
        "password": "{PASSWORD}" 
    } 
    ```

    In the above payload:

    - `remoteIPAddress` is the IP address of the camera you wish to get additional details from.
    - `username` is the user name that is used to authenticate with the ONVIF device.
    - `password` is the user accounts password.

    Within a few seconds you see the following result:

    ```JSON
    {
        "status": 200,
        "payload": {
            "hostname": {
                "fromDHCP": true,
                "hostname": "{NAME_OF_THE_ONVIF_DEVICE}"
            },
            "systemDateTime": {
                "type": "ntp",
                "time": "2021-09-18T03:05:05.000Z",
                "timeZone": "GMT"
            },
            "dns": {
                "fromDhcp": true,
                "ipv4Address": [
                    "{IP_ADDRESS}"
                ],
                "ipv6Address": []
            },
            "mediaProfiles": [
                {
                    "name": "Profile_L1S1",
                    "mediaUri": {
                        "uri": "{RTSP_URI}"
                    },
                    "videoEncoderConfiguration": {
                        "encoding": "h264",
                        "resolution": {
                            "width": 3840,
                            "height": 2160
                        },
                        "rateControl": {
                            "bitRateLimit": 15600,
                            "encodingInterval": 1,
                            "frameRateLimit": 30,
                            "guaranteedFrameRate": false
                        },
                        "quality": 50,
                        "h264": {
                            "govLength": 255,
                            "profile": "main"
                        }
                    }
                },
                {
                    "name": "Profile_L1S2",
                    "mediaUri": {
                        "uri": "{RTSP_URI}"
                    },
                    "videoEncoderConfiguration": {
                        "encoding": "h264",
                        "resolution": {
                            "width": 1280,
                            "height": 720
                        },
                        "rateControl": {
                            "bitRateLimit": 1900,
                            "encodingInterval": 1,
                            "frameRateLimit": 30,
                            "guaranteedFrameRate": false
                        },
                        "quality": 50,
                        "h264": {
                            "govLength": 255,
                            "profile": "main"
                        }
                    }
                }
            ]
        }
    }
    ```

### Return status of onvifDeviceGet

| Status | Code      | Meaning / solution                                                                                                                                                                                                            |
| ------ | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 200    | Success   | The direct method call completed successfully.                                                                                                                                                                                |
| 403    | Forbidden | The direct method call could not successfully retrieve the requested information from the ONVIF device due to a authentication failure.  Check to ensure that the username and / or password in the message body was correct. |
| 504    | Timeout   | The direct method call expired before the response of the ONVIF device was received.                                                                                                                                          |
| 500    | Error     | If an error occurred that is unknown.                                                                                                                                                                                         |

## Troubleshooting

This section covers some troubleshooting steps:

- If you receive the error "An error prevented the operation from successfully completing. The request failed with status code 504.":

    :::image type="content" source="./media/camera-discovery/five-zero-four-error.png" alt-text="Screenshot that shows the 504 error.":::

    Check to ensure that the setting for `"discoveryDuration":"PT10S"` in the above direct method call is shorter than the `Connection Timeout` or `Method Timeout` values.

    :::image type="content" source="./media/camera-discovery/five-zero-four-error-fix.png" alt-text="Screenshot that shows the 504 error fix.":::

- If the direct method `Results` field displays "{"status":200,"payload":{"value":[]}} 

    :::image type="content" source="./media/camera-discovery/result-status-two-hundred-null.png" alt-text="The message return is displayed in the direct method `Results` field":::

    Adjust the time value (x) in `"discoveryDuration":"PTxS"` to a larger number.  Also adjust the `Connection Timeout` and / or `Method Timeout` values accordingly.
- The `onvifDeviceGet` direct method call will not display any media profiles for H.265 encoded media streams.
- Return status of 403 can be returned in the event that the user account used to connect to the ONVIF device does not have permissions to the ONVIF camera features. Some ONVIF-compliant cameras require that a user is added to the ONVIF security settings to retrieve the ONVIF device information.
- Currently the Video Analyzer edge module will return up to 200 ONVIF enabled cameras that are reachable on the same subnet via multicast. This also requires that port 3702 is available. 

## Next steps

- Try the [quickstart for analyzing live video](analyze-live-video-use-your-model-http.md).
- Try the [tutorial for analyzing video with Spatial Analytics](computer-vision-for-spatial-analysis.md).
- Try the [How-to guide for analyzing live video with multiple AI models](analyze-ai-composition.md).
