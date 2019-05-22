---
title: Build new Azure Kinect application
description: This article guides Azure Kinect DK user through new application creation
author: joylital
ms.author: joylital
ms.prod: kinect-dk
ms.date: 05/26/2019
ms.topic: conceptual 
keywords: kinect, azure, sensor, sdk, microphone, access mics, mic data
---

# Set Up First Azure Kinect DK application

Getting started with the Azure Kinect DK API? Look no further! This document will get you up and running with access to the device!

First, download and install the [Azure Kinect DK API](https://github.com/Microsoft/Azure-Kinect-Sensor-SDK) from GitHub.

Here are the functions we'll use:

   `k4a_device_get_installed_count()`
   `k4a_device_open()`
   `k4a_device_get_serialnum()`
   `k4a_device_start_cameras()`
   `k4a_device_stop_cameras()`
   `k4a_device_close()`

## Headers

There's only one header that you will need, and that's k4a.h! Make sure your compiler of choice is set up with the SDK's lib and include folders. You'll also need the k4a.lib and k4a.dll files linked up.

`#include <k4a/k4a.h>`

## Finding a Kinect device

Multiple Azure Kinect DK devices can be connected to your computer. We'll first start by finding out how many, or if any are connected at all using the `k4a_device_get_installed_count` function. This function should work right away, without any additional setup.

`uint32_t count = k4a_device_get_installed_count();`

Once you've determined there is actually a device connected to the computer, you can open it using `k4a_device_open`. You can provide the index of the device you want to open, or you can just use `K4A_DEVICE_DEFAULT`] for the first one.

```C
// Open the first plugged in Kinect device
k4a_device_t device = NULL;
k4a_device_open(K4A_DEVICE_DEFAULT, &device);
```
As with most things in the k4a API, when you open something, you should also close it when you're finished with it! When you're shutting down, remember to make a call to `k4a_device_close`.

```C
k4a_device_close(device);
```

Once the device is open, we can make a really simple test to ensure it's all good. So let's read the device's serial number!

```C
// Get the size of the serial number
size_t serial_size = 0;
k4a_device_get_serialnum(device, NULL, &serial_size);

// Allocate memory for the serial, then acquire it
char *serial = static_cast<char*>(malloc(serial_size));
k4a_device_get_serialnum(device, serial, &serial_size);
printf("Opened device: %s\n", serial);
free(serial);
```

## Starting the cameras

Once you've opened the device, you'll need to configure the camera with a `k4a_device_configuration_t` object. Camera configuration has a number of different options, and you'll need to choose the settings that best fit your own scenario.

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

For the sake of brevity and clarity, we don't show error handling in some inline examples. However, error handling is always important! Many functions will return a general success/failure type `k4a_result_t`, or a more specific variant with detailed information such as `k4a_wait_result_t`. Be sure to check the docs or intellisense of a specific function to see what error messages you might expect to see from it!

Along with the error types, there's also the `K4A_SUCCEEDED` and `K4A_FAILED` macros that you can use with them. So instead of just opening a k4a device, we might guard it like this:

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
        return;
    }

    // Open the first plugged in Kinect device
    k4a_device_t device = NULL;
    if ( K4A_FAILED( k4a_device_open(K4A_DEVICE_DEFAULT, &device) ) )
    {
        printf("Failed to open k4a device!\n");
        return;
    }

    // Get the size of the serial number
    size_t serial_size = 0;
    k4a_device_get_serialnum(device, NULL, &serial_size);

    // Allocate memory for the serial, then acquire it
    char *serial = static_cast<char*>(malloc(serial_size));
    k4a_device_get_serialnum(device, serial, &serial_size);
    printf("Opened device: %s\n", serial);
    free(serial);

    // Configure a stream of 4096x3072 BRGA color data at 15 frames per second
    k4a_device_configuration_t config = K4A_DEVICE_CONFIG_INIT_DISABLE_ALL;
    config.camera_fps       = K4A_FRAMES_PER_SECOND_15;
    config.color_format     = K4A_IMAGE_FORMAT_COLOR_BGRA32;
    config.color_resolution = K4A_COLOR_RESOLUTION_3072P;

    // Start the camera with the given configuration
    if ( K4A_FAILED( k4a_device_start_cameras(device, &config) ) )
    {
        printf("Failed to start cameras!\n");
        k4a_device_close(device);
        return;
    }

    // Camera capture and application specific code would go here

    // Shut down the camera when finished with application logic
    k4a_device_stop_cameras(device);
    k4a_device_close(device);

	return 0;
}
}

```

## Next steps

You may also review the following:
> [!div class="nextstepaction"]
>[Using Azure Kinect sensor SDK](overview-sensor-sdk.md)