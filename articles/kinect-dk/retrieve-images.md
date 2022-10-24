---
title: Retrieve Azure Kinect image data 
description: Learn how to retrieve Azure Kinect image data using the Kinect Sensor SDK.
author: cdedmonds
ms.author: cedmonds
ms.service: azure-kinect-developer-kit
ms.date: 06/26/2019
ms.topic: conceptual
keywords: kinect, azure, retrieve, sensor, camera, sdk, depth, rgb, images, color, capture, resolution, buffer
---

# Retrieve Azure Kinect image data

This page provides details about how to retrieve images from the Azure Kinect. The article demonstrates how to capture and access images coordinated between the device's color and depth. To access images, you must first open and configure the device, then you can capture images.
Before you configure and capture an image, you must [Find and open device](find-then-open-device.md).

You can also refer to the [SDK Streaming Example](https://github.com/microsoft/Azure-Kinect-Sensor-SDK/tree/develop/examples/streaming) that demonstrates how to use the functions in this article.

The following functions are covered:

- [`k4a_device_start_cameras()`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_gaad7a85e1e5471810262442fc4a8e217a.html#gaad7a85e1e5471810262442fc4a8e217a)
- [`k4a_device_get_capture()`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_ga4dac757a33657f4d3dbf1ae8b21c158a.html#ga4dac757a33657f4d3dbf1ae8b21c158a)
- [`k4a_capture_get_depth_image()`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_gafa03513da96bf6b8c254fc11a04ee6d6.html#gafa03513da96bf6b8c254fc11a04ee6d6)
- [`k4a_image_get_buffer()`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_ga2ef070cf4e543cd0f726478af332546e.html#ga2ef070cf4e543cd0f726478af332546e)
- [`k4a_image_release()`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_ga27c81863b13fafc3934a32935a014e9f.html#ga27c81863b13fafc3934a32935a014e9f)
- [`k4a_capture_release()`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_ga0ed6f74ec403c3eac1b8ef3afb32cee6.html#ga0ed6f74ec403c3eac1b8ef3afb32cee6)
- [`k4a_device_stop_cameras()`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_ga4fa0e0a011a7105309ad97f081a5d6b8.html#ga4fa0e0a011a7105309ad97f081a5d6b8)
  
## Configure and start the device

The two cameras available on your Kinect device support multiple modes, resolutions, and output formats. For a complete list, refer to the Azure Kinect Development Kit [hardware specifications](hardware-specification.md).

The streaming configuration is set using values in the [`k4a_device_configuration_t`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/structk4a__device__configuration__t.html) structure.

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

Once cameras are started, they'll continue to capture data until [`k4a_device_stop_cameras()`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_ga4fa0e0a011a7105309ad97f081a5d6b8.html#ga4fa0e0a011a7105309ad97f081a5d6b8) is called or the device is closed.

## Stabilization

When starting up devices using the multi device synchronization feature, it is highly recommended to do so using a fixed exposure setting.
With a manual exposure set, it can take up to eight captures from the device before images and framerate stabilize. 
With auto exposure, it can take up to 20 captures before images and framerate stabilize.

## Get a capture from the device

Images are captured from the device in a correlated manner. Each captured image contains a depth image, an IR image, a color image, or a combination of images.

By default, the API will only return a capture once it has received all of the requested images for the streaming mode. You can configure the API to return partial captures with only depth or color images as soon as they're available by clearing the [`synchronized_images_only`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/structk4a__device__configuration__t_a8208974f05d89fc1362c6a0900bdef4d.html#a8208974f05d89fc1362c6a0900bdef4d) parameter of the [`k4a_device_configuration_t`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/structk4a__device__configuration__t.html).

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
```

Once the API has successfully returned a capture, you must call [`k4a_capture_release()`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_ga0ed6f74ec403c3eac1b8ef3afb32cee6.html#ga0ed6f74ec403c3eac1b8ef3afb32cee6) when you have completed using the capture object.

## Get an image from the capture

To retrieve a captured image, call the appropriate function for each image type. One of:

- [`k4a_capture_get_color_image()`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_ga683e440b5f22215a2de58d7fa140488c.html#ga683e440b5f22215a2de58d7fa140488c)
- [`k4a_capture_get_depth_image()`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_gafa03513da96bf6b8c254fc11a04ee6d6.html#gafa03513da96bf6b8c254fc11a04ee6d6)
- [`k4a_capture_get_ir_image()`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_ga1531c3fa76a7c174b8f2eab24de91794.html#ga1531c3fa76a7c174b8f2eab24de91794)

You must call [`k4a_image_release()`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_ga27c81863b13fafc3934a32935a014e9f.html#ga27c81863b13fafc3934a32935a014e9f) on any [`k4a_image_t`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/structk4a__image__t.html) handle returned by these functions once you're done using the image.

## Access image buffers

[`k4a_image_t`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/structk4a__image__t.html) has many accessor functions
to get properties of the image.

To access the image's memory buffer, use [k4a_image_get_buffer](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_ga2ef070cf4e543cd0f726478af332546e.html#ga2ef070cf4e543cd0f726478af332546e).

The following example demonstrates how to access a captured depth image. This same principle applies to other image types. However, make sure you replace the image-type variable with the correct image type, such as IR, or color.

```C
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

Now you know how to capture, and coordinate the cameras' images between the color and depth, using your Azure Kinect device. You also can:

>[!div class="nextstepaction"]
>[Retrieve IMU samples](retrieve-imu-samples.md)

>[!div class="nextstepaction"]
>[Access microphones](access-mics.md)
