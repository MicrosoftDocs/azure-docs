---
title: Use Azure Kinect image transformations
description: Transform Between Coordinate Systems
author: cdedmonds
ms.author: cdedmonds
ms.prod: kinect-dk
ms.topic: conceptual
ms.date: 06/15/2019 
keywords: kinect, azure, sensor, sdk, coordinate system, calibration, project, unproject, transformation, rgb-d, point cloud
---

# Use Image Transformations

Follow the specific functions to use and transform images between coordinated camera systems in your Azure Kinect DK.

## k4a_transformation functions

 All functions prefixed with *k4a_transformation* operate on whole images. They require the transformation handle [k4a_transformation_t](https://aka.ms/AzureKinectAPIDocs/api/k4a-transformation-t.md) obtained via [k4a_transformation_create()](https://aka.ms/AzureKinectAPIDocs/api/k4a-transformation-create.md) and are unallocated via [k4a_transformation_destroy()](https://aka.ms/AzureKinectAPIDocs/api/k4a-transformation-destroy.md). You can also refer to the SDK [Transformation Example](https://github.com/Microsoft/Azure-Kinect-Sensor-SDK/tree/develop/examples/transformation) which demonstrates how to use the 3 functions in this topic.

The following functions are covered:

* *k4a_transformation_depth_image_to_color_camera*
* *k4a_transformation_color_image_to_depth_camera*
* *k4a_transformation_depth_image_to_point_cloud*

## Overview of depth image from the color camera

 The function [k4a_transformation_depth_image_to_color_camera()](https://aka.ms/AzureKinectAPIDocs/api/k4a-transformation-depth-image-to-color-camera.md) transforms the depth map from the viewpoint of the depth camera into the viewpoint of the color camera. This function is designed to produce so-called RGB-D images, where D represents an additional image channel recording the depth value. As seen in the figure below, the color image and the output of [k4a_transformation_depth_image_to_color_camera()](https://aka.ms/AzureKinectAPIDocs/api/k4a-transformation-depth-image-to-color-camera.md) look as if they were taken from the same viewpoint, i.e., the viewpoint of the color camera.

### Implementation

 This transformation function is more complex than simply calling [k4a_calibration_2d_to_2d()](https://aka.ms/AzureKinectAPIDocs/api/k4a-calibration-2d-to-2d.md) for every pixel. It warps a triangle mesh from the geometry of the depth camera into the geometry of the color camera. The triangle mesh is used to avoid generating holes in the transformed depth image. A Z-buffer ensures that occlusions are handled correctly. GPU acceleration is enabled for this function by default.

### Parameters

 Input parameters are the transformation handle and a depth image. The depth image resolution must match the ```depth_mode``` specified at creation of the transformation handle. For example, if the transformation handle was created using the 1024x1024 ```K4A_DEPTH_MODE_WFOV_UNBINNED``` mode, the resolution of the depth image must be 1024x1024 pixels. The output is a transformed depth image that needs to be allocated by the user via calling [k4a_image_create()](https://aka.ms/AzureKinectAPIDocs/api/k4a-image-create.md). The resolution of the transformed depth image must match the ```color_resolution``` specified at creation of the transformation handle. For example, if the color resolution was set to ```K4A_COLOR_RESOLUTION_1080P```, the output image resolution must be 1920x1080 pixels. The output image stride is set to ```width * sizeof(uint16_t)```, as the image stores 16-bit depth values.

## Overview of color image to depth camera

 The function [k4a_transformation_color_image_to_depth_camera()](https://aka.ms/AzureKinectAPIDocs/api/k4a-transformation-color-image-to-depth-camera.md) transforms the color image from the viewpoint of the color camera into the viewpoint of the depth camera (see figure above). It can be used to generate RGB-D images.

### Implementation

 For every pixel of the depth map, the function uses the pixel’s depth value to compute the corresponding subpixel coordinate in the color image. We then look up the color value at this coordinate in the color image. Bilinear interpolation is performed in the color image to obtain the color value at subpixel precision. A pixel that does not have an associated depth reading is assigned to a BGRA value of ```[0,0,0,0]``` in the output image. GPU acceleration is enabled for this function by default. As this method produces holes in the transformed color image and does not handle occlusions, we recommend using the function [k4a_transformation_depth_image_to_color_camera()](https://aka.ms/AzureKinectAPIDocs/api/k4a-transformation-depth-image-to-color-camera.md) instead.

### Parameters

The input parameters are the transformation handle, a depth image and a color image. The resolutions of depth and color images must match the depth_mode and color_resolution specified at creation of the transformation handle. The output is a transformed color image that needs to be allocated by the user via calling [k4a_image_create()](https://aka.ms/AzureKinectAPIDocs/api/k4a-image-create.md). The resolution of the transformed color image must match the depth_resolution specified at creation of the transformation handle. The output image stores four 8-bit values representing BGRA for every pixel. Therefore, the stride of the image is ```width * 4 * sizeof(uint8_t)```. The data order is pixel interleaved, i.e., blue value - pixel 0, green value - pixel 0, red value - pixel 0, alpha value - pixel 0, blue value - pixel 1 and so on.

## Overview of depth image from 2D to 3D point cloud

The function [k4a_transformation_depth_image_to_point_cloud()](https://aka.ms/AzureKinectAPIDocs/api/k4a-transformation-depth-image-to-point-cloud.md) converts a 2D depth map taken by a camera into a 3D point cloud in the coordinate system of the same camera. The camera can thereby be the depth or color camera.

### Implementation

 The function gives equivalent results to running [k4a_calibration_2d_to_2d()](https://aka.ms/AzureKinectAPIDocs/api/k4a-calibration-2d-to-2d.md) for every pixel, but is computationally more efficient. When calling [k4a_transformation_create()](https://aka.ms/AzureKinectAPIDocs/api/k4a-transformation-create.md) we precompute a so-called xy-lookup table that stores x- and y-scale factors for every image pixel. When calling [k4a_transformation_depth_image_to_point_cloud()](https://aka.ms/AzureKinectAPIDocs/api/k4a-transformation-depth-image-to-point-cloud.md), we obtain a pixel’s 3D X-coordinate by multiplying the pixel’s x-scale factor with the pixel’s Z-coordinate. Analogously, the 3D Y-coordinate is computed by multiplication with the y-scale factor. The [fast point cloud example](https://github.com/Microsoft/Azure-Kinect-Sensor-SDK/tree/develop/examples/fastpointcloud) of the SDK demonstrates how the xy-table is computed. Users can follow the example code to implement their own version of this function, e.g., to speed up their GPU pipeline.

### Parameters

 The input parameters are the transformation handle, a camera specifier and a depth image. If the camera specifier is set to depth, the resolution of the depth image must match the depth_mode specified at creation of the transformation handle. Otherwise, if the specifier is set to the color camera, the resolution must match the resolution of the chosen color_resolution. The output parameter is an XYZ image that needs to be allocated by the user via calling [k4a_image_create()](https://aka.ms/AzureKinectAPIDocs/api/k4a-image-create.md). The XYZ image resolution must match the resolution of the input depth map. We store three signed 16-bit coordinate values in millimeter for every pixel. The XYZ image stride is therefore set to ```width * 3 * sizeof(int16_t)```. The data order is pixel interleaved, i.e., X-coordinate – pixel 0, Y-coordinate – pixel 0, Z-coordinate – pixel 0, X-coordinate – pixel 1 and so on. If a pixel cannot be converted to 3D, the function assigns the values ```[0,0,0]``` to the pixel.

## Samples

* [Transformation example](https://github.com/Microsoft/Azure-Kinect-Sensor-SDK/tree/develop/examples/transformation)

## Next steps

* [Coordinate systems](https://aka.ms/AzureKinectAPIDocs/coordinate-systems.md)
* [k4a_calibration_t](https://aka.ms/AzureKinectAPIDocs/api/k4a-calibration-t.md)
* [k4a_device_get_calibration()](https://aka.ms/AzureKinectAPIDocs/api/k4a-device-get-calibration.md)
* [k4a_transformation_create()](https://aka.ms/AzureKinectAPIDocs/api/k4a-transformation-create.md)
* [k4a_transformation_destroy()](https://aka.ms/AzureKinectAPIDocs/api/k4a-transformation-destroy.md)
* [k4a_transformation_depth_image_to_color_camera()](https://aka.ms/AzureKinectAPIDocs/api/k4a-transformation-depth-image-to-color-camera.md)
* [k4a_transformation_color_image_to_depth_camera()](https://aka.ms/AzureKinectAPIDocs/api/k4a-transformation-color-image-to-depth-camera.md)
* [k4a_transformation_depth_image_to_point_cloud()](https://aka.ms/AzureKinectAPIDocs/api/k4a-transformation-depth-image-to-point-cloud.md)
* [k4a_image_create()](https://aka.ms/AzureKinectAPIDocs/api/k4a-image-create.md)
