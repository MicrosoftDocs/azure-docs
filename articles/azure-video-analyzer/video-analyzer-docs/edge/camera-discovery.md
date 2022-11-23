---
title: Discovering ONVIF-capable cameras in the local subnet
description: This how-to shows you how you can use Video Analyzer edge module to discover ONVIF-capable cameras in your local subnet.
ms.topic: how-to
ms.date: 11/04/2021
ms.custom: ignite-fall-2021
---

# Discovering ONVIF-capable cameras in the local subnet

[!INCLUDE [header](includes/edge-env.md)]

[!INCLUDE [deprecation notice](../includes/deprecation-notice.md)]

This how to guide walks you through how to use the Azure Video Analyzer edge module to discover ONVIF compliant cameras on the same subnet as the IoT Edge device. Open Network Video Interface Forum (ONVIF) is an open standard where discrete IP-based physical devices, such as surveillance cameras, can communicate with additional networked devices and software. For more information about ONVIF please visit the [ONVIF](https://www.onvif.org/about/mission/) website.

## Prerequisites

To complete the steps in this article, you need to:

- Have an active Azure subscription.
- Install the [Azure CLI extension for IoT](https://github.com/Azure/azure-iot-cli-extension#installation)
- Complete one of the following:
  - [Quickstart: Get started with Azure Video Analyzer](get-started-detect-motion-emit-events.md)
  - [Quickstart: Get started with Azure Video Analyzer in the Azure portal](get-started-detect-motion-emit-events-portal.md)
- Have the Video Analyzer edge module version 1.1 (or newer) deployed to your IoT Edge device
- If using a [Hyper-V](/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/mt169373(v=ws.11)) Virtual Machine or [EFLOW](../../../iot-edge/how-to-install-iot-edge-on-windows.md?view=iotedge-2018-06&tabs=windowsadmincenter&preserve-view=true) an [external switch](/windows-server/virtualization/hyper-v/get-started/create-a-virtual-switch-for-hyper-v-virtual-machines) is required to perform the onvifDeviceDiscover direct method call. This requirement is due to a [multicast](https://en.wikipedia.org/wiki/Multicast) call used for ONVIF device discovery.

The ONVIF feature of the Video Analyzer edge module requires specific container create options, as described in [Enable ONVIF discovery feature](#enable-onvif-discovery-feature). This ONVIF discovery feature require that port 3702 be available.
  
> [!NOTE]
> If you have a new deployment of version 1.1 of the Video Analyzer edge module, you can skip to the section for [Use direct method calls](#use-direct-method-calls). Otherwise, follow the below sections to upgrade your existing Video Analyzer edge module to enable the ONVIF discovery feature.  

## Check the version

From a command prompt run the following commands:

```CLI
az account set --subscription <YOUR_SUBSCRIPTION_NAME>
az iot hub module-twin show -m <VIDEO_ANALYZER_IOT_EDGE_MODULE_NAME> -n <IOT_HUB_NAME> -d <IOT_EDGE_DEVICE_NAME> --query 'properties.reported.ProductInfo' -o tsv
```

If the result of the above command is **Azure Video Analyzer:1.0.1** then run the following steps to update the Video Analyzer edge module to version 1.1.

1. In the Azure portal navigate to the IoT Hub (`<IOT_HUB_NAME>` above) that is used with your Video Analyzer edge module deployment
1. Click on **IoT Edge** under Automatic Device Management and select the IoT Edge device (`<IOT_EDGE_DEVICE_NAME>` above) to which the Video Analyzer edge module has been deployed
1. Click on **Set modules** and click on **Review + create**
1. Click on **Create**
1. After a few minutes the Video Analyzer edge module will update and you can run the above command again to verify

### Enable ONVIF discovery feature

Next, add additional options into the container create options for the Video Analyzer edge module. This allows it to communicate through the host network to discover ONVIF enabled cameras on the same subnet.

1. In the Azure portal navigate to the IoT Hub
1. Click on **IoT Edge** under Automatic Device Management and select the IoT Edge device to which the Video Analyzer edge module has been deployed
1. Click on **Set modules** and select the Video Analyzer edge module
1. Go to the **Container Create Options** tab and add the following JSON entries to the respective sections:

    - In the JSON entry box, after the first `{` enter the following:
  
        ```JSON
        "NetworkingConfig": {
        "EndpointsConfig": {
            "host": {}
            }
        },
        ```
    - In the `HostConfig` JSON object:

        ```JSON
        "NetworkMode": "host",
        ```
1. Click **Update** at the bottom
1. Click **Review + create**
1. Click **Create**

## Use direct method calls

The Video Analyzer edge module provides direct method calls for ONVIF discovery of network attached cameras on the same subnet. The following steps apply to both the `onvifDeviceDiscover` and the `onvifDeviceGet` sections below:

1. In the Azure portal navigate to the IoT Hub
1. Click on **IoT Edge** under Automatic Device Management and select the IoT Edge device to which the Video Analyzer edge module has been deployed
1. Click on the Video Analyzer edge module and click on **Direct method** in the menu bar at the top

### onvifDeviceDiscover

This direct method lists all the discoverable ONVIF devices on the same subnet as the Video Analyzer edge module.


1. In the method name enter:

    ```JSON
    onvifDeviceDiscover
    ```
1. In the payload enter:

    ```JSON
    {
        "@apiVersion":"1.1",
        "discoveryDuration":"PT8S"
    }
    ```

   The discovery duration is the amount of time that the Video Analyzer edge module waits to receive responses from ONVIF discoverable devices. It might be necessary in a large environment to adjust this value.

1. Within a few seconds you should see a`result` such as the following:

    ```JSON
    {
        "status": 200,
        "payload": {
            "value": [
                {
                    "serviceIdentifier": "{urn:uuid}",
                    "remoteIPAddress": "{IP_ADDRESS}",
                    "scopes": [
                        "onvif://www.onvif.org/type/Network_Video_Transmitter",
                        "onvif://www.onvif.org/name/{CAMERA_MANUFACTURE}",
                        "onvif://www.onvif.org/location/",
                        "onvif://www.onvif.org/hardware/{CAMERA_MODEL}",
                        "onvif://www.onvif.org/Profile/Streaming",
                        "onvif://www.onvif.org/Profile/G",
                        "onvif://www.onvif.org/Profile/T"
                    ],
                    "endpoints": [
                        "http://<IP_ADDRESS>/onvif/device_service",
                        "https://<IP_ADDRESS>/onvif/device_service"
                    ],
                    
                }
            ]
        }
    }
    ```
    The return status of 200 indicates that the direct method call was handled successfully.

### onvifDeviceGet

The onvifDeviceGet call supports both unsecured and TLS enabled endpoints. This direct method call retrieves detailed information about a specific ONVIF device.

# [UnsecuredEndpoint](#tab/unsecuredendpoint)

> [!NOTE]
> When the onvifDeviceGet call is made to an unsecured endpoint on an ONVIF enabled camera you need to set the Video Edge module Identity Twin setting `"allowUnsecuredEndpoints"` to `true`. For more information see article [Module twin properties](./module-twin-configuration-schema.md).

1. In the method name enter:

    ```JSON
    onvifDeviceGet
    ```
1. In the payload enter:

    ```JSON
    {
        "endpoint": {
            "@type": "#Microsoft.VideoAnalyzer.UnsecuredEndpoint",
            "credentials": {
                "username": "<USER_NAME>",
                "password": "<PASSWORD>",
                "@type": "#Microsoft.VideoAnalyzer.UsernamePasswordCredentials"
            },
            "url": "http://<IP_ADDRESS>/onvif/device_service"
        },
        "@apiVersion": "1.1"
    }
    ```

# [TlsEndpoint](#tab/tlsendpoint)

1. In the method name enter:

    ```JSON
    onvifDeviceGet
    ```
1. In the payload enter:

    ```JSON
    {
        "endpoint": {
            "@type": "#Microsoft.VideoAnalyzer.TlsEndpoint",
            "credentials": {
                "username": "<USER_NAME>",
                "password": "<PASSWORD>",
                "@type": "#Microsoft.VideoAnalyzer.UsernamePasswordCredentials"
            },
            "url": "https://<IP_ADDRESS>/onvif/device_service"
        },
        "@apiVersion": "1.1"
    }

---

In the above payload:

- `url` is the IP address of the ONVIF device from which you wish to get additional details
- `username` is the user name that is used to authenticate with the device, which has permissions to the ONVIF features. Some devices require specific accounts to be created for this purpose.
- `password` is the password for that user name

    Within a few seconds you should see a result such as:

    ```JSON
    {
        "status": 200,
        "payload": {
            "hostname": {
                "fromDhcp": true,
                "hostname": "{NAME_OF_THE_ONVIF_DEVICE}"
            },
            "systemDateTime": {
                "type": "ntp",
                "time": "2021-09-28T03:05:05.000Z",
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
                    "name": "{Profile1}",
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
                    "name": "{Profile2}",
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
| 400    | Bad Request  | The request was malformed   |
| 403    | Forbidden | The direct method call could not successfully retrieve the requested information from the ONVIF device due to an authentication failure. Check to ensure that the username and / or password in the message body was correct. |
| 500 | Error | An unknown error occurred.  |
| 502    | Bad Gateway | Received an invalid response from an upstream service.  |
| 504    | Timeout   | The direct method call expired before the response of the ONVIF device was received.  |

## Troubleshooting

This section covers some troubleshooting steps:

- In the Azure portal on the IoT Edge module direct method blade if you receive the error "An error prevented the operation from successfully completing. The request failed with status code 504." (See image below):

    :::image type="content" source="./media/camera-discovery/five-zero-four-error.png" alt-text="Screenshot that shows the 504 error.":::

    Check to ensure that the setting for `"discoveryDuration":"PT8S"` in the above direct method call is shorter than the `Connection Timeout` or `Method Timeout` values.

    :::image type="content" source="./media/camera-discovery/five-zero-four-error-fix.png" alt-text="Screenshot that shows the 504 error fix.":::

- If the direct method `Results` field displays "{"status":200,"payload":{"value":[]}}, you may need longer discovery durations

    :::image type="content" source="./media/camera-discovery/result-status-two-hundred-null.png" alt-text="The message return is displayed in the direct method `Results` field":::

    Adjust the time value (x) in `"discoveryDuration":"PTxS"` to a larger number. Also adjust the `Connection Timeout` and/or `Method Timeout` values accordingly.
- The `onvifDeviceGet` direct method call will not display any media profiles for H.265 encoded media streams.
- Return status of 403 can be returned in the event that the user account used to connect to the ONVIF device does not have permissions to the ONVIF camera features. Some ONVIF-compliant cameras require that a user is added to the ONVIF security settings to retrieve the ONVIF device information.
- Currently the Video Analyzer edge module will return up to 200 ONVIF enabled cameras that are reachable on the same subnet via multicast. This also requires that port 3702 is available.
- If onvifDeviceGet is called with a TLS Endpoint the ONVIF device name and IP address must be added to the hosts (/etc/hosts) file on the edge device.  If a self-signed certificate is used for TLS encryption the certificate also needs to be added to the IoT Edge device’s certificate store. 
- For onvifDeviceDiscover direct method call from an EFLOW virtual machine the following steps must be performed:
  - Connect to the EFLOW virtual machine and run `sudo iptables -I INPUT -p udp -j ACCEPT`

## Next steps

- Try [Quickstart: Analyze a live video feed from a (simulated) IP camera using your own HTTP model](analyze-live-video-use-your-model-http.md) with the discovered ONVIF device
