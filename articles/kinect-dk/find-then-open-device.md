---
title: Find then open Azure Kinect device
description: Find and open an Azure Kinect device
author: cedmonds
ms.author: cedmonds
ms.prod: kinect-dk
ms.date: 04/10/2019
ms.topic: conceptual
keywords: kinect, azure, sensor, sdk, depth, rgb, device, find, open
---

# Find then open Azure Kinect Device

This article describes how you can find, then open your Azure Kinect DK, especially if you have more than one Kinect development kit connected to your machine.

Perform the following steps to find, then open your Azure Kinect DK device:

1. To find or retrieve image data, you must first enumerate and open the desired device.
2. Retrieve the number of available devices by using k4a_device_get_installed_count.
3. Use this number to check for any device's existence, or to walk through and query each individual
device for its serial number using k4a_device_get_serialnum.
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

* Retrieve Images
* Retrieve IMU Samples
