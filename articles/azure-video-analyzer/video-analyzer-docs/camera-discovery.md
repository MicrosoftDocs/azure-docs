---
title: Camera discovery
description: This how-to walks you through the steps to enable camera discovery via ONVIF for Azure Video Analyzer by using the Azure portal.

ms.topic: how-to
ms.date: 09/15/2021
---

# Tutorial:  Camera discovery

This tutorial walks you through the ONVIF enablement within Azure Video Analyzer.  Open Network Video Interface Forum or ONVIF is a open standard where descrete IP-based physical devices, such as surveillance cameras, can communicate with additional networked deviecs and software.  For more information about ONVIF please visit the [ONVIF](https://www.onvif.org/about/mission/) website.

ONVIF sub-devides the standard into profiles.  These profiles provide complance and ensure the compatibility of different ONVIF complient devices reguardless of manufacture.  It is important to point out that not all of the ONVIF profiles are used with IP-based video surveillance devices.  For more information about ONVIF profiles see this [article](https://www.onvif.org/profiles-add-ons-specifications/).
## Prerequisites

- An active Azure subscription.
- Have completed either:
  - [Quickstart: Get started with Azure Video Analyzer](https://docs.microsoft.com/azure/azure-video-analyzer/video-analyzer-docs/get-started-detect-motion-emit-events)
  - [Quickstart: Get started with Azure Video Analyzer in the Azure portal](https://docs.microsoft.com/azure/azure-video-analyzer/video-analyzer-docs/get-started-detect-motion-emit-events-portal)
- Have the avaedge module version 1.1 deployed to your IoT Edge device.

>[!NOTE]
>If you have a new deployment of Video Analyzer account and / or a new deployment of avaedge module then you can skip to the section for **Use direct method calls**.  If not please follow the below sections to upgrade your existing avaedge module to enable the ONVIF discovery feature.  If you are upgrading your avaedge module please ensure that you save your topologies and pipelines before upgrading the module.

## Check the avaedge modules version
1.  In the Azure portal navigate to the IoT Hub that is used with your Video Analzyer account deployment.
1.  Click on IoT Edge under Automatic Device Management and select the IoT Edge device that is configured to run the avaedge module.
1.  Click on the avaedge module and look at the version under **Reported Value**

    :::image type="content" source="./media/camera-discovery/avaedge-version1.png" alt-text="Screenshot that shows the avaedge version.":::
1.  If the module version is listed at 1.0 for both the `Desired Options` and the `Reported Options` then follow the below steps to update the avaedge module.

    1.  In the Azure portal navigate to the IoT Hub that is used with your Video Analzyer account deployment.
    2.  Click on IoT Edge under Automatic Device Management and select the IoT Edge device that is configured to run the avaedge module.
    3.  Click on Set modules and select the avaedge module under the **'IoT Edge Modules'** section.
    4.  Under `Image URI` udpate this to refelect **mcr.microsoft.com/media/video-analyzer:1.1** and click `Update`.
    5.  Click on `Review + create` and then `Create`.

### Varify the avaedge module has updated the settings
With in a few minutes the avaedge module should update to the new version (1.1) and you can check this by performing the following:
1.  Select the IoT Edge device that is running the avaedge module and click on the avaedge module.
1.  select `Container Create Options`
1.  Verify that the version under `Desired Options` matches the version under the `Reported Options`

    :::image type="content" source="./media/camera-discovery/avaedge-version1dot1dot1.png" alt-text="Screenshot that shows the avaedge version.":::

### Prepare the avaedge module to allow for ONVIF discovery
To prepare the avaedge module for ONVIF discovery events it is necessary to add additional elements into the IoT Edge container create options.

1.  In the Azure portal navigate to the IoT Hub that is used with your Video Analzyer account deployment.
1.  Click on IoT Edge under Automatic Device Management and select the IoT Edge device that is configured to run the avaedge module.
1.  Click on Set modules and select the avaedge module.
1.  Select `Container Create Options` and add the following:

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
1.  Click on `Update` at the bottom and then click on `Review + create`.
1.  Click on `Create`.



## Use direct method calls
Azure Video Analyzer allows for direct method calls for ONVIF discovery of network attached cameras.  
The following steps apply to both the onvifDeviceDiscover and the onvifDeviceGet setions below:

1.  In the Azure portal navigate to the IoT Hub that is used with your Video Analzyer account deployment.
1.  Click on IoT Edge under Automatic Device Management and select the IoT Edge device that is configured to run the avaedge module.
1.  Click on the avaedge module and select  `Direct method`.


### onvifDeviceDiscover
Lists all the discoverable ONVIF devices on the same network as the avaedge module. 
>[!NOTE]
>the discover process only returns the discoverable devices in the same subnet as the IoT Edge device that is running the avaedge module.

1.  In the method name enter:
    ```
    onvifDeviceDiscover
    ```
2.  In the payload enter:
   
    ```JSON
    {
      "@apiVersion":"1.1",
      "discoveryDuration":"PT10S"
    }
    ```
>[!NOTE]
>The discovery duration is the amount of time to wait for the call to complete.  It might be necessary in a large enviroment to adjust this value. 

  Within a few seconds you see the following `Result`:

        ```JSON
         {
            "status": 200,
            "payload": {
                "value": [
                    {
                        "serviceIdentifier": "urn:uuid:00075faf-931e-19e3-af5f-0700075faf5f",
                        "remoteIPAddress": "10.0.1.79",
                        "transportAddresses": [
                            "http://10.0.1.79/onvif/device_service",
                            "https://10.0.1.79/onvif/device_service"
                        ],
                        "scopes": [
                            "onvif://www.onvif.org/type/Network_Video_Transmitter",
                            "onvif://www.onvif.org/name/Bosch",
                            "onvif://www.onvif.org/location/",
                            "onvif://www.onvif.org/hardware/MIC_inteox_7100i",
                            "onvif://www.onvif.org/Profile/Streaming",
                            "onvif://www.onvif.org/Profile/G",
                            "onvif://www.onvif.org/Profile/T"
                        ]
                    }
                ]
            }
        }
        ```

  >[!NOTE]
  >The return status of 200 is successful.

### onvifDeviceGet
Gets information regarding the OnVif Device 

1.  In the Azure portal navigate to the IoT Hub that is used with your Video Analzyer account deployment.
1.  Click on IoT Edge under Automatic Device Management and select the IoT Edge device that is configured to run the avaedge module.
1.  Click on the avaedge module and select  `Direct method`.
1.  In the method name enter:
    ```
    onvifDeviceGet
    ```
1.  In the payload enter:
   
    ```JSON
    { 
       "@apiVersion": "1.1",  
       "remoteIPAddress": "10.159.30.99", 
       "username": "admin", 
       "password": "password" 
    } 
    ```
In the above payload:
 - remoteIPAddress is the IP address of the camera you wish to get additional details from.
 - username is the user name that is used to authenticate with the RTSP stream from the camera.
 - password is the user accounts password.

Within a few seconds you see the following `Result`:


```JSON
    {
        "status": 200,
        "payload": {
            "hostname": {
                "fromDHCP": true,
                "hostname": "Keith-BoschCam1"
            },
            "systemDateTime": {
                "type": "ntp",
                "time": "2021-09-18T03:05:05.000Z",
                "timeZone": "GMT"
            },
            "dns": {
                "fromDHCP": true,
                "ipv4Address": [
                    "10.0.1.1"
                ],
                "ipv6Address": []
            },
            "mediaProfiles": [
                {
                    "name": "Profile_L1S1",
                    "mediaUri": {
                        "uri": "rtsp://10.0.1.79/rtsp_tunnel?p=0&line=1&inst=1&vcd=2"
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
                            "guarantedFrameRate": false
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
                        "uri": "rtsp://10.0.1.79/rtsp_tunnel?p=1&line=1&inst=2&vcd=2"
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
                            "guarantedFrameRate": false
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

>[!NOTE]
>The return status of 200 is successful, while a return of 403 is forbidden.  If you are getting a 403 return code check your user name and password used in the body.  Also if a timeout occurs we return a 504, if an error is known we return a status of 502, and if the error is unknown a return status of 500 is issued.

## Troubleshooting 
If the following error occurs:

    :::image type="content" source="./media/camera-discovery/504-error.png" alt-text="Screenshot that shows the avaedge version.":::

Check to ensure that the setting for `"discoveryDuration":"PT10S"` in the above direct method calls is shorter than the `Connection Timeout` or `Method Timeout` values

    :::image type="content" source="./media/camera-discovery/504-error-fix.png" alt-text="Screenshot that shows the avaedge version.":::

If the folloiwng message return is displayed in the direct method `Results` field:

    :::image type="content" source="./media/camera-discovery/result-status-200-null.png" alt-text="Screenshot that shows the avaedge version.":::

adjust the time value (x) in `"discoveryDuration":"PTxS"` to a larger number.  Also adjust the `Connection Timeout` and / or `Method Timeout` values accordingly.

The `onvifDeviceGet` direct method call will not display any media profiles for H.265 encoded media streams.

## Clean up resources

[!INCLUDE [prerequisites](./includes/common-includes/clean-up-resources.md)]

## Next steps

- Try the [quickstart for recording videos to the cloud when motion is detected](detect-motion-record-video-clips-cloud.md).
- Try the [quickstart for analyzing live video](analyze-live-video-use-your-model-http.md).
- Learn more about [diagnostic messages](monitor-log-edge.md).

