---
title: Using sensor SDK - Getting image data
description: Getting image data
author: cedmonds
ms.author: cedmonds
ms.date: 01/10/2019
keywords: kinect, azure, sensor, sdk, depth, rgb
---

# Getting image data

The device provides access to coordinated image captures between the color and depth cameras. Accessing these 
images requires opening a device, configuring the device, and then capturing images. 

## Find and open the device

The first step in retrieving image data is to enumerate and open the desired device. The number of available devices can be 
retrieved using k4a_device_get_installed_count. This number can be used to check for the existence of any device or to walk through and query each individual
device for its serial number using k4a_device_get_serialnum. In our example we open the default device. If there is more than one device attached
to a single host then a specific device instance should be selected.  

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

## Configure and start the device

The cameras in your Kinect support multiple modes, resolutions, and output formats. For a complete list see [here](azure-kinect-devkit.md). 

```C
k4a_device_configuration_t config = K4A_DEVICE_CONFIG_INIT_DISABLE_ALL;
config.color_fps = K4A_FRAMES_PER_SECOND_30;
config.color_format = K4A_IMAGE_FORMAT_COLOR_MJPG;
config.color_resolution = K4A_COLOR_RESOLUTION_2160P;
config.depth_fps = K4A_FRAMES_PER_SECOND_30;
config.depth_mode = K4A_DEPTH_MODE_NFOV_UNBINNED;

if (K4A_RESULT_SUCCEEDED != k4a_device_start_cameras(device, &config))
{
    printf("Failed to start device\n");
    goto Exit;
}
```

## Access image buffers

Images are captured from the device in a correlated manner. Each capture will contain a depth image, an ir image, a color image, 
or a combinatino of images. All images that exist on a capture are time syncrhonized. To retrieve individual images
from a capture call the appropariate function for each image type. To access the memory buffer of an image use k4a_image_get_buffer.

```C
// Capture a depth frame
switch (k4a_device_get_capture(device, &capture, TIMEOUT_IN_MS))
{
case K4A_WAIT_RESULT_SUCCEEDED:
    break;
case K4A_WAIT_RESULT_TIMEOUT:
    printf("Timed out waiting for a capture\n");
    continue;
    break;
case K4A_WAIT_RESULT_FAILED:
    printf("Failed to read a capture\n");
    goto Exit;
}

// Access the depth16 image
k4a_image_t image = k4a_capture_get_depth_image(capture);
if (image != NULL)
{
    if (K4A_SUCCEEDED(result))
    {
        printf(" | Depth16 res:%4dx%4d stride:%5d\n",
                k4a_image_get_height_pixels(image),
                k4a_image_get_width_pixels(image),
                k4a_image_get_stride_bytes(image));
    }
}

// Release the capture
k4a_image_release(image);
k4a_capture_release(capture);
```


## See also
* [Getting IMU data](sdk-getting-imu-data.md)
* [Accessing microphones](sdk-getting-mic-data.md)