---
title: Retrieve Azure Kinect image data 
description: Retrieve Images using the Kinect Sensor SDK
author: cdedmonds
ms.author: cedmonds
ms.prod: kinect-dk
ms.date: 04/10/2019
ms.topic: conceptual
keywords: kinect, azure, retrieve, sensor, camera, sdk, depth, rgb, images, color, capture, resolution, buffer
---

# Retrieve image data

This page provides details about how to retrieve images, and specifically to access, capture, and coordinate the cameras' images between the color and depth, using your Azure Kinect device.
To access images, you must first open and configure the device, then you can capture images and take pictures.
Before you configure and capture an image, you must [Find and open device](find-then-open-device.md).

## Configure and start the device

The 2 cameras available on your Kinect device support multiple modes, resolutions, and output formats. For a complete list, refer to the Azure Kinect Development Kit [hardware specifications](hardware-specification.md).

```C
k4a_device_configuration_t config = K4A_DEVICE_CONFIG_INIT_DISABLE_ALL;
config.camera_fps = K4A_FRAMES_PER_SECOND_30;
config.color_format = K4A_IMAGE_FORMAT_COLOR_MJPG;
config.color_resolution = K4A_COLOR_RESOLUTION_2160P;
config.depth_mode = K4A_DEPTH_MODE_NFOV_UNBINNED;

if (K4A_RESULT_SUCCEEDED != k4a_device_start_cameras(device, &config))
{
    printf("Failed to start device\n");
    goto Exit;
}
```

## Access image buffers

Images are captured from the device in a correlated manner. Each captured image contains a depth image, an IR image, a color image, or a combination of images. All captured images are time synchronized. To retrieve a captured image,
call the appropriate function for each image type. To access the image's memory buffer, use [k4a_image_get_buffer](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/feature/publishdocs/group___functions_ga2ef070cf4e543cd0f726478af332546e.html#ga2ef070cf4e543cd0f726478af332546e).

The following example demonstrates how to access a captured depth image. This same principle applies to other image types. However, make sure you replace the image-type variable with the correct image type, such as IR, or color.

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
    printf(" | Depth16 res:%4dx%4d stride:%5d\n",
            k4a_image_get_height_pixels(image),
            k4a_image_get_width_pixels(image),
            k4a_image_get_stride_bytes(image));

    // Release the image
    k4a_image_release(image);
}

// Release the capture
k4a_capture_release(capture);
```

## Next steps

Now you know how to capture, and coordinate the cameras' images between the color and depth, using your Azure Kinect device, you also can:

>[!div class="nextstepaction"]
>[Retrieve IMU samples](retrieve-imu-samples.md)

>[!div class="nextstepaction"]
>[Access microphones](access-mics.md)
