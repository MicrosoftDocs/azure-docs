---
title: Using sensor SDK - Transforming Between Coordinate Systems
description: Transformation Functions
author: cedmonds, mbleyer
ms.author: cedmonds, mbleyer
ms.date: 12/17/2018
keywords: kinect, azure, sensor, sdk, coordinate system, calibration, project, unproject, transformation, rgb-d, point cloud
---

# Coordinate Systems and Transformations

## Calibration

It is necessary to retrieve the device calibration to perform coordinate system transformations. The calibration data is stored in the k4a_calibration_t data type. It is obtained from the device via the function k4a_device_get_calibration(). The calibration data is not only specific to each device, but also to the operating mode of the cameras. Hence k4a_device_get_calibration() requires the ```depth_mode``` and ```color_resolution``` parameters as input. 

### The k4a_calibration_t Type

The type k4a_calibration_t contains the individual camera’s calibration, i.e., ```depth_camera_calibration``` and ```color_camera_calibration```, as well as transformation parameters stored in the 2D array called ```extrinsics```.

Let us start with ```depth_camera_calibration``` and ```color_camera_calibration``` represented by the type k4a_calibration_camera_t. This data type stores the intrinsic and extrinsic calibration of the camera. The intrinsic calibration represented by the k4a_calibration_intrinsics_t type uses the Brown–Conrady lens distortion model consisting of six parameters (```k1```-```k6```) for radial and two parameters (```p1```, ```p2```) for tangential distortion. The type k4a_calibration_extrinsics_t stores the extrinsic calibration that allows converting points from the 3D coordinate system of the depth camera to the coordinate system of the current camera. The array ```rotation``` thereby stores a 3x3 rotation matrix in row major order, while the  array ```translation``` stores a 3D translation vector in millimeter. For ```depth_camera_calibration```, the array ```rotation``` is the identity matrix and ```translation``` is set to the vector ```[0,0,0]```, as source and target coordinate systems are identical.

Let us now focus on the 2D array ```extrinsics``` of k4a_calibration_t. It provides extrinsic transformation parameters to directly convert from a source 3D coordinate to a target 3D coordinate system. Source and target systems are represented by the type k4a_calibration_type_t and can take the following values: (1) ```K4A_CALIBRATION_TYPE_DEPTH``` for the depth camera, (2) ```K4A_CALIBRATION_TYPE_COLOR``` for the color camera, (3) ```K4A_CALIBRATION_TYPE_GYRO``` for the gyroscope of the inertial measurement unit (IMU) and (4) ```K4A_CALIBRATION_TYPE_ACCEL``` for the accelerometer of the IMU. Use ```extrinsics```[```K4A_CALIBRATION_TYPE_GYRO```][```K4A_CALIBRATION_TYPE_COLOR```] to access the extrinsic parameters transforming from the gyroscope coordinate system to the color camera.

### OpenCV Compatibility

The calibration parameters are compatible with [OpenCV](https://opencv.org/). We refer the reader to the [OpenCV documentation](https://docs.opencv.org/3.2.0/d9/d0c/group__calib3d.html#gga7041b2a9c8f9f8ee93a2796981bc5546a204766e24f2e413e7a7c9f8b9e93f16c) for a more detailed documentation of the individual camera calibration parameters. The reader is also referred to the [OpenCV compatibility example](https://microsoft.visualstudio.com/DefaultCollection/Analog/_git/analog.ai.depthcamera?path=%2Fsdk%2Fexamples%2Fopencv_compatibility&version=GBdevelop) of the SDK that demonstrates conversion between the k4a_calibration_t type and the corresponding OpenCV data structures.

## Coordinate Systems

We describe conventions used for 2D and 3D coordinate systems in the following.

### 2D Coordinate Systems

 Each camera, i.e., depth and color, is associated with an independent 2D coordinate system. An [x,y]-coordinate is represented in units of pixels where x ranges from 0 to width-1 and y ranges from 0 to height-1. Width and height depend on the chosen mode in which depth and color cameras are operated. The pixel coordinate ```[0,0]``` corresponds to the top left pixel of the image. Pixel coordinates can be fractional representing subpixel coordinates. The 2D coordinate system is 0-centered, i.e., the subpixel coordinate ```[0.0, 0.0]``` represents the center and ```[0.5,0.5]``` the bottom right corner of the pixel (see image below).

![2D coordinate system](media/sdk_2d_coordinate.png)

### 3D Coordinate Systems

Each camera, i.e., depth and color, and IMU component, i.e., gyroscope and accelerometer, is associated with an independent 3D coordinate space system. Points in the 3D coordinate systems are represented as metric [X,Y,Z]-coordinate triplets with units in millimeters. 

#### Depth and Color Camera

The origin ```[0,0,0]``` is located at the focal point of the camera. The coordinate system is oriented such that the positive X-axis points right, the positive Y-axis points down and the positive Z-axis points forward. Please note that depth camera module and NFOV illuminator are tilted 6 degrees down and WFOV additional 1.3 degrees (see image below).

![3D coordinate conventions](media/sdk_3d_coordinate.png)

#### Gyroscope and Accelerometer

The orgin ```[0,0,0]``` of the gyroscope is identical to the origin of the depth camera. The origin of the accelerometer coincides with its physical location. Both IMU coordinate systems are right-handed with the positive X-axis pointing backward, the positive Y-axis pointing left and the positive Z-axis pointing down (see image below).

![IMU coordinate system](media/AzureKinectDK-Imucoord.png)

## Overview of Coordinate Transformation Functions

The figure below shows the different coordinate systems of K4A as well as the functions to convert between them. We omit the 3D coordinate systems of gyroscope and accelerometer to keep the figure simple.

![transformation function overview](media/sdk_transformation_function_overview.png)

Remark on lens distortion: 2D coordinates always refer to the distorted image in the SDK. The [undistortion example](https://microsoft.visualstudio.com/DefaultCollection/Analog/_git/analog.ai.depthcamera?path=%2Fsdk%2Fexamples%2Fundistort&version=GBdevelop) of the SDK demonstrates image undistortion. In general, 3D points will never be affected by lens distortion.

## k4a_calibration Functions

Functions prefixed with k4a_calibration are used for converting single points at a time. All such functions require the k4a_calibration_t structure obtained via k4a_device_get_calibration().

### k4a_calibration_3d_to_3d

The function k4a_calibration_3d_to_3d() converts a 3D point of the source coordinate system to a 3D point of the target coordinate system using the extrinsic camera calibration. Source and target can be set to any of the four 3D coordinate systems, i.e., color camera, depth camera, gyroscope or accelerometer. If source and target are identical, the unmodified input 3D point is returned as output.

### k4a_calibration_3d_to_2d

The function k4a_calibration_3d_to_2d() converts a 3D point of the source coordinate system to a 2D pixel coordinate of the target camera. This function is often referred to as project function. While the source can be set to any of the four 3D coordinate systems, the target must be the depth or color camera. If source and target are different, the input 3D point is converted to the 3D coordinate system of the target camera using k4a_calibration_3d_to_3d(). Once the 3D point is represented in the target camera coordinate system, the corresponding 2D pixel coordinates are computed using the target camera’s intrinsic calibration. If a 3D point falls out of the visible area of the target camera, the valid value is set to 0.

### k4a_calibration_2d_to_3d

 The function k4a_calibration_2d_to_3d() converts a 2D pixel coordinate of the source camera to a 3D point of the target camera coordinate system. The source must be color or depth camera. The target can be set to any of the four 3D coordinate systems. In addition to the 2D pixel coordinate, the pixel’s depth value (in millimeter) in the source camera’s image is required as an input to the function. The function computes the 3D ray leading from the source camera’s focal point through the specified pixel coordinate using the source camera’s intrinsic calibration. The depth value is then used to find the exact location of the 3D point on this ray. This operation is often referred to as unproject function. If source and target cameras are different, the function transforms the 3D point to the coordinate system of the target via k4a_calibration_3d_to_3d(). If a 2D pixel coordinate falls out of the visible area of the source camera, the valid value is set to 0.
 
 ### k4a_calibration_2d_to_2d

 The function k4a_calibration_2d_to_2d() converts a 2D pixel coordinate of the source camera to a 2D pixel coordinate of the target camera. Source and target must be set to color or depth camera. The function requires the pixel’s depth value (in millimeter) in the source camera image as an input. It calls k4a_calibration_2d_to_3d() to convert to a 3D point of the source camera system. It then calls k4a_calibration_3d_to_2d() to convert to a 2D pixel coordinate of the target camera image. The valid value is set to 0, if k4a_calibration_2d_to_3d() or k4a_calibration_3d_to_2d() return an invalid result.

 ## k4a_transformation Functions

 All functions prefixed with k4a_transformation operate on whole images. They require the transformation handle k4a_transformation_t obtained via k4a_transformation_create() and deallocated via k4a_transformation_destroy(). In addition to this documentation, the reader is referred to the [transformation example](https://microsoft.visualstudio.com/DefaultCollection/Analog/_git/analog.ai.depthcamera?path=%2Fsdk%2Fexamples%2Ftransformation&version=GBdevelop) of the SDK that demonstrates the use of all three functions discussed in the following.

 ### k4a_transformation_depth_image_to_color_camera

 #### Overview

 The function k4a_transformation_depth_image_to_color_camera() transforms the depth map from the viewpoint of the depth camera into the viewpoint of the color camera. This function is designed to produce so-called RGB-D images where D represents an additional image channel recording the depth value. As seen in the figure below, the color image and the output of k4a_transformation_depth_image_to_color_camera() look as if they were taken from the same viewpoint, i.e., the viewpoint of the color camera.

 ![Result of RGB-D Functions](media/sdk_rgbd.png)

 #### Implementation

 This transformation function is more complex than simply calling k4a_calibration_2d_to_2d() for every pixel. It warps a triangle mesh from the geometry of the depth camera into the geometry of the color camera. The triangle mesh is used to avoid generating holes in the transformed depth image. A Z-buffer ensures that occlusions are handled correctly.

 #### Parameters

 Input parameters are the transformation handle and a depth image. The depth image resolution must match the ```depth_mode``` specified at creation of the transformation handle. For example, if the transformation handle was created using the 1024x1024 ```K4A_DEPTH_MODE_WFOV_UNBINNED``` mode, the resolution of the depth image must be 1024x1024 pixels. The output is a transformed depth image that needs to be allocated by the user via calling k4a_image_create(). The resolution of the transformed depth image must match the ```color_resolution``` specified at creation of the transformation handle. For example, if the color resolution was set to ```K4A_COLOR_RESOLUTION_1080P```, the output image resolution must be 1920x1080 pixels. The output image stride is set to width * sizeof(uint16_t), as the image stores 16-bit depth values.

 ### k4a_transformation_color_image_to_depth_camera

 #### Overview

 The function k4a_transformation_color_image_to_depth_camera() transforms the color image from the viewpoint of the color camera into the viewpoint of the depth camera (see figure above). It can be used to generate RGB-D images.

 #### Implementation

 For every pixel of the depth map, the function uses the pixel’s depth value to compute the corresponding subpixel coordinate in the color image. We then look up the color value at this coordinate in the color image. Bilinear interpolation is performed in the color image to obtain the color value at subpixel precision. A pixel that does not have an associated depth reading is assigned to a BGRA value of ```[0,0,0,0]``` in the output image. As this method produces holes in the transformed color image and does not handle occlusions, we recommend using the function k4a_transformation_depth_image_to_color_camera() instead.

 #### Parameters 

The input parameters are the transformation handle, a depth image and a color image. The resolutions of depth and color images must match the depth_mode and color_resolution specified at creation of the transformation handle. The output is a transformed color image that needs to be allocated by the user via calling k4a_image_create(). The resolution of the transformed color image must match the depth_resolution specified at creation of the transformation handle. The output image stores four 8-bit values representing BGRA for every pixel. Therefore, the stride of the image is width * 4 * sizeof(uint8_t). The data order is pixel interleaved, i.e., blue value - pixel 0, green value - pixel 0, red value - pixel 0, alpha value - pixel 0, blue value - pixel 1 and so on.

### k4a_transformation_depth_image_to_point_cloud

#### Overview

The function k4a_transformation_depth_image_to_point_cloud() converts a 2D depth map taken by a camera into a 3D point cloud in the coordinate system of the same camera. The camera can thereby be the depth or color camera.

#### Implementation

 The function gives equivalent results to running k4a_calibration_2d_to_2d() for every pixel, but is computationally more efficient. When calling k4a_transformation_create() we precompute a so-called xy-lookup table that stores x- and y-scale factors for every image pixel. When calling k4a_transformation_depth_image_to_point_cloud(), we obtain a pixel’s 3D X-coordinate by multiplying the pixel’s x-scale factor with the pixel’s Z-coordinate. Analogously, the 3D Y-coordinate is computed by multiplication with the y-scale factor. The [fast point cloud example](https://microsoft.visualstudio.com/DefaultCollection/Analog/_git/analog.ai.depthcamera?path=%2Fsdk%2Fexamples%2Ffastpointcloud&version=GBdevelop) of the SDK demonstrates how the xy-table is computed. Users can follow the example code to implement their own version of this function, e.g., to speed up their GPU pipeline.

 #### Parameters

 The input parameters are the transformation handle, a camera specifier and a depth image. If the camera specifier is set to depth, the resolution of the depth image must match the depth_mode specified at creation of the transformation handle. Otherwise, if the specifier is set to the color camera, the resolution must match the resolution of the chosen color_resolution. The output parameter is an XYZ image that needs to be allocated by the user via calling k4a_image_create(). The XYZ image resolution must match the resolution of the input depth map. We store three signed 16-bit coordinate values in millimeter for every pixel. The XYZ image stride is therefore set to width * 3 * sizeof(int16_t). The data order is pixel interleaved, i.e., X-coordinate – pixel 0, Y-coordinate – pixel 0, Z-coordinate – pixel 0, X-coordinate – pixel 1 and so on. If a pixel cannot be converted to 3D, the function assigns the values ```[0,0,0]``` to the pixel.

 ## Samples

- [OpenCV compatibility example](https://microsoft.visualstudio.com/DefaultCollection/Analog/_git/analog.ai.depthcamera?path=%2Fsdk%2Fexamples%2Fopencv_compatibility&version=GBdevelop)
- [Undistortion example](https://microsoft.visualstudio.com/DefaultCollection/Analog/_git/analog.ai.depthcamera?path=%2Fsdk%2Fexamples%2Fundistort&version=GBdevelop)
- [Transformation example](https://microsoft.visualstudio.com/DefaultCollection/Analog/_git/analog.ai.depthcamera?path=%2Fsdk%2Fexamples%2Ftransformation&version=GBdevelop)
- [Fast point cloud example](https://microsoft.visualstudio.com/DefaultCollection/Analog/_git/analog.ai.depthcamera?path=%2Fsdk%2Fexamples%2Ffastpointcloud&version=GBdevelop)

 ## See Also

- k4a_calibration_t
- k4a_device_get_calibration()
- k4a_calibration_3d_to_3d()
- k4a_calibration_3d_to_2d()
- k4a_calibration_2d_to_2d()
- k4a_calibration_2d_to_3d()
- k4a_transformation_create()
- k4a_transformation_destroy()
- k4a_transformation_depth_image_to_color_camera()
- k4a_transformation_color_image_to_depth_camera()
- k4a_transformation_depth_image_to_point_cloud()
- k4a_image_create()
