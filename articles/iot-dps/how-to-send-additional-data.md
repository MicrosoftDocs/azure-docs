---
title: How to transfer a payload between device and Azure Device Provisioning Service
description: This document describes how to transfer a payload between device and Device Provisioning Service (DPS)
author: menchi
ms.author: menchi
ms.date: 02/11/2020
ms.topic: conceptual
ms.service: iot-dps
services: iot-dps
---

# How to transfer a payload between device and DPS
Sometimes DPS needs more data from devices to properly provision them to the right IoT Hub, and that data needs to be provided by the device. Vice versa, DPS can return data to the device to facilitate client side logics. 

## When to use it
This feature can be used as an enhancement for [custom allocation](https://docs.microsoft.com/azure/iot-dps/how-to-use-custom-allocation-policies). For instance, you want to allocate your devices based on the device model without human intervention. In this case, you will use [custom allocation](https://docs.microsoft.com/azure/iot-dps/how-to-use-custom-allocation-policies). You can configure the device to report the model information as part of the [register device call](https://docs.microsoft.com/rest/api/iot-dps/runtimeregistration/registerdevice). DPS will pass the device’s payload into to the custom allocation webhook. And your function can decide which IoT Hub this device will go to when it receives device model information. Similarly, if the webhook wishes to return some data to the device, it will pass the data back as a string in the webhook response.  

## Device sends data payload to DPS
When your device is sending a [register device call](https://docs.microsoft.com/rest/api/iot-dps/runtimeregistration/registerdevice) to DPS, The register call can be enhanced to take other fields in the body. The body looks like the following: 
   ```
   { 
       “registrationId”: “mydevice”, 
       “tpm”:				 
       { 
           “endorsementKey”: “stuff”, 
           “storageRootKey”: “things” 
       }, 
       “payload”: “your additional data goes here. It can be nested JSON.” 
    } 
   ```

## DPS returns data to the device
If the custom allocation policy webhook wishes to return some data to the device, it will pass the data back as a string in the webhook response. The change is in the payload section below. 
   ```
   { 
       "iotHubHostName": "sample-iot-hub-1.azure-devices.net", 
       "initialTwin": { 
           "tags": { 
               "tag1": true 
               }, 
               "properties": { 
                   "desired": { 
                       "tag2": true 
                    } 
                } 
            }, 
        "payload": "whatever is returned by the webhook" 
    } 
   ```

## SDK support
This feature is available in C, C#, JAVA and Node.js [client SDKs](https://docs.microsoft.com/azure/iot-dps/).  

## Next steps
* Develop using the [Azure IoT SDK]( https://github.com/Azure/azure-iot-sdks) for Azure IoT Hub and Azure IoT Hub Device Provisioning Service
