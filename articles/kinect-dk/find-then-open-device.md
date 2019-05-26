---
title: Find then open the Azure Kinect device
description: Find and open an Azure Kinect device
author: cedmonds
ms.author: cedmonds
ms.prod: kinect-dk
ms.date: 04/10/2019
ms.topic: conceptual
keywords: kinect, azure, sensor, sdk, depth, rgb, device, find, open
---

# Find then open the Azure Kinect device

This article describes how you can find, then open your Azure Kinect DK. The article explains how to handle the case where there are multiple devices connected to your machine.

Perform the following steps to find, then open your Azure Kinect DK device:

1. To find or retrieve image data, you must first enumerate and open the desired device.
2. Retrieve the number of available devices by using [k4a_device_get_installed_count](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_gaf7d19df0f73f8e4dfaa21e1b4b719ecc.html#gaf7d19df0f73f8e4dfaa21e1b4b719ecc
).
3. Use this number to check for any device's existence, or to walk through and query each individual
device for its serial number using [k4a_device_get_serialnum](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_ga798489af207ff1c99f2285ff6b08bc22.html#ga798489af207ff1c99f2285ff6b08bc22
).
4. In our example, we open the default device. If there is more than one device attached
to a single host, select a specific device instance.

## Devices installed function

```C
k4a_device_t device = NULL;
uint32_t device_count = k4a_device_get_installed_count();

if (device_count == 0)
{
    printf("No K4A devices found\n");
    return 0;
}

if (K4A_RESULT_SUCCEEDED != k4a_device_open(K4A_DEVICE_DEFAULT, &device))
{
    printf("Failed to open device\n");
    goto Exit;
}
```

## Next steps

>[!div class="nextstepaction"]
>[Retrieve Images](retrieve-images.md)

>[!div class="nextstepaction"]
>[Retrieve IMU Samples](retrieve-imu-samples.md)

