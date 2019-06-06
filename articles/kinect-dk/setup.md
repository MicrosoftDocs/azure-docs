---
title: Quickstart- Build a new Azure Kinect application
description: This quickstart guides the Azure Kinect DK user through the process of creating a new application.
author: tesych
ms.author: tesych
ms.prod: kinect-dk
ms.date: 06/10/2019
ms.topic: conceptual 
keywords: kinect, azure, sensor, sdk, microphone, access mics, mic data

#Customer intent: As an Azure Kinect DK developer, I want to create a new Azure Kinect DK application.

---

# Quickstart: Set up your first Azure Kinect DK application

Getting started with the Azure Kinect DK API? This quickstart will get you up and running with access to the device!

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

1. [Set up Azure Kinect device](set-up-azure-kinect-dk.md).
2. [Download](sensor-sdk-download.md), and install the Azure Kinect Sensor SDK.
3. Review the functions we'll use:

    - [`k4a_device_get_installed_count()`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_gaf7d19df0f73f8e4dfaa21e1b4b719ecc.html#gaf7d19df0f73f8e4dfaa21e1b4b719ecc)
    - [`k4a_device_open()`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_ga3d4eb5dfbf4d576d4978b66ea419f113.html#ga3d4eb5dfbf4d576d4978b66ea419f113)
    - [`k4a_device_get_serialnum()`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_ga798489af207ff1c99f2285ff6b08bc22.html#ga798489af207ff1c99f2285ff6b08bc22)
    - [`k4a_device_start_cameras()`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_ga4dc81cbeb54b07e4bbb7d639c448f6eb.html#ga4dc81cbeb54b07e4bbb7d639c448f6eb)
    - [`k4a_device_stop_cameras()`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_ga4fa0e0a011a7105309ad97f081a5d6b8.html#ga4fa0e0a011a7105309ad97f081a5d6b8)
    - [`k4a_device_close()`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_ga7a3931d9a690b3971caaac83b43f9423.html#ga7a3931d9a690b3971caaac83b43f9423)

## Headers

There's only one header that you'll need, and that's k4a.h. Make sure your compiler of choice is set up with the SDK's lib and include folders. You'll also need the k4a.lib and k4a.dll files linked up.

```C
#include <k4a/k4a.h>
```

## Finding a Kinect device

Multiple Azure Kinect DK devices can be connected to your computer. We'll first start by finding out how many, or if any are connected at all using the [`k4a_device_get_installed_count()`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_gaf7d19df0f73f8e4dfaa21e1b4b719ecc.html#gaf7d19df0f73f8e4dfaa21e1b4b719ecc) function. This function should work right away, without any additional setup.

```C
uint32_t count = k4a_device_get_installed_count();
```

Once you've determined there's a device connected to the computer, you can open it using [`k4a_device_open()`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_ga3d4eb5dfbf4d576d4978b66ea419f113.html#ga3d4eb5dfbf4d576d4978b66ea419f113). You can provide the index of the device you want to open, or you can just use `K4A_DEVICE_DEFAULT` for the first one.

```C
// Open the first plugged in Kinect device
k4a_device_t device = NULL;
k4a_device_open(K4A_DEVICE_DEFAULT, &device);
```
As with most things in the k4a API, when you open something, you should also close it when you're finished with it! When you're shutting down, remember to make a call to [`k4a_device_close()`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_ga7a3931d9a690b3971caaac83b43f9423.html#ga7a3931d9a690b3971caaac83b43f9423).

```C
k4a_device_close(device);
```

Once the device is open, we can make a test to ensure it's all good. So let's read the device's serial number!

```C
// Get the size of the serial number
size_t serial_size = 0;
k4a_device_get_serialnum(device, NULL, &serial_size);

// Allocate memory for the serial, then acquire it
char *serial = (char*)(malloc(serial_size));
k4a_device_get_serialnum(device, serial, &serial_size);
printf("Opened device: %s\n", serial);
free(serial);
```

## Starting the cameras

Once you've opened the device, you'll need to configure the camera with a [`k4a_device_configuration_t`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/structk4a__device__configuration__t.html) object. Camera configuration has a number of different options. Choose the settings that best fit your own scenario.

```C
// Configure a stream of 4096x3072 BRGA color data at 15 frames per second
k4a_device_configuration_t config = K4A_DEVICE_CONFIG_INIT_DISABLE_ALL;
config.camera_fps       = K4A_FRAMES_PER_SECOND_15;
config.color_format     = K4A_IMAGE_FORMAT_COLOR_BGRA32;
config.color_resolution = K4A_COLOR_RESOLUTION_3072P;

// Start the camera with the given configuration
k4a_device_start_cameras(device, &config)

// ...Camera capture and application specific code would go here...

// Shut down the camera when finished with application logic
k4a_device_stop_cameras(device);
```

## Error handling

For the sake of brevity and clarity, we don't show error handling in some inline examples. However, error handling is always important! Many functions will return a general success/failure type [`k4a_result_t`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___enumerations_ga4b419a99aa2220b076a4520dc2afd1e5.html#ga4b419a99aa2220b076a4520dc2afd1e5), or a more specific variant with detailed information such as [`k4a_wait_result_t`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___enumerations_ga44c7c0c1cfba7c879e9e2da1a869e4ee.html#ga44c7c0c1cfba7c879e9e2da1a869e4ee). Check the docs or intellisense for each function to see what error messages you should expect to see from it!

Along with the error types, there's also the [`K4A_SUCCEEDED`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___macros_ga8e5b48150bc243c6052793bd830c2fcd.html#ga8e5b48150bc243c6052793bd830c2fcd) and [`K4A_FAILED`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___macros_ga7c2e32349135d008b6f836c571d434b4.html#ga7c2e32349135d008b6f836c571d434b4) macros that you can use with them. So instead of just opening a k4a device, we might guard it like this:

```C
// Open the first plugged in Kinect device
k4a_device_t device = NULL;
if ( K4A_FAILED( k4a_device_open(K4A_DEVICE_DEFAULT, &device) ) )
{
    printf("Failed to open k4a device!\n");
    return;
}
```

## Full source

```C
#pragma comment(lib, "k4a.lib")
#include <k4a/k4a.h>

#include <stdio.h>
#include <stdlib.h>

int main()
{
    uint32_t count = k4a_device_get_installed_count();
    if (count == 0)
    {
        printf("No k4a devices attached!\n");
        return 1;
    }

    // Open the first plugged in Kinect device
    k4a_device_t device = NULL;
    if (K4A_FAILED(k4a_device_open(K4A_DEVICE_DEFAULT, &device)))
    {
        printf("Failed to open k4a device!\n");
        return 1;
    }

    // Get the size of the serial number
    size_t serial_size = 0;
    k4a_device_get_serialnum(device, NULL, &serial_size);

    // Allocate memory for the serial, then acquire it
    char *serial = (char*)(malloc(serial_size));
    k4a_device_get_serialnum(device, serial, &serial_size);
    printf("Opened device: %s\n", serial);
    free(serial);

    // Configure a stream of 4096x3072 BRGA color data at 15 frames per second
    k4a_device_configuration_t config = K4A_DEVICE_CONFIG_INIT_DISABLE_ALL;
    config.camera_fps       = K4A_FRAMES_PER_SECOND_15;
    config.color_format     = K4A_IMAGE_FORMAT_COLOR_BGRA32;
    config.color_resolution = K4A_COLOR_RESOLUTION_3072P;

    // Start the camera with the given configuration
    if (K4A_FAILED(k4a_device_start_cameras(device, &config)))
    {
        printf("Failed to start cameras!\n");
        k4a_device_close(device);
        return 1;
    }

    // Camera capture and application specific code would go here

    // Shut down the camera when finished with application logic
    k4a_device_stop_cameras(device);
    k4a_device_close(device);

    return 0;
}

```

## Next steps

You may also review the following articles:
> [!div class="nextstepaction"]
>[Using Azure Kinect sensor SDK](overview-sensor-sdk.md)
