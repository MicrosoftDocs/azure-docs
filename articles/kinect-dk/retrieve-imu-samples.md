---
title: Retrieve Azure Kinect IMU samples
description: Learn how to retrieve Azure Kinect IMU samples using the Azure Kinect SDK. 
author: qm13
ms.author: cedmonds
ms.date: 06/26/2019
ms.service: azure-kinect-developer-kit
ms.topic: conceptual
keywords: kinect, azure, configure, depth, color, RBG, camera, sensor, sdk, IMU, motion sensor, motion, gyroscope, gyro, accelerometer, FPS
---

# Retrieve Azure Kinect IMU samples

The Azure Kinect device provides access to Inertial Motion Units (IMUs), including both the accelerometer and gyroscope types. To access IMUs samples, you must first open and configure your device, then capture IMU data. For more information, see [find and open device](find-then-open-device.md).

IMU samples are generated at a much higher frequency than images. Samples are reported to the host at a lower rate than they're sampled. When waiting for an IMU sample, multiple samples will frequently become available at the same time.

See the Azure Kinect DK [hardware specification](hardware-specification.md) for details on the IMU reporting rate.

## Configure and start cameras

> [!NOTE]
> IMU sensors can only work when the color and/or the depth cameras are running. IMU sensors cannot work alone.

To start the cameras, use [k4a_device_start_cameras()](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_gaad7a85e1e5471810262442fc4a8e217a.html#gaad7a85e1e5471810262442fc4a8e217a).

```C
k4a_device_configuration_t config = K4A_DEVICE_CONFIG_INIT_DISABLE_ALL;
config.camera_fps = K4A_FRAMES_PER_SECOND_30;
config.color_format = K4A_IMAGE_FORMAT_COLOR_MJPG;
config.color_resolution = K4A_COLOR_RESOLUTION_2160P;

if (K4A_RESULT_SUCCEEDED != k4a_device_start_cameras(device, &config))
{
    printf("Failed to start cameras\n");
    goto Exit;
}

if (K4A_RESULT_SUCCEEDED != k4a_device_start_imu(device))
{
    printf("Failed to start imu\n");
    goto Exit;
}
```

## Access IMU samples

 Each [k4a_imu_sample_t](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/structk4a__imu__sample__t.html#details) contains an accelerometer and gyroscope reading captured at nearly the same time.

You can get the IMU samples either on the same thread you get image captures, or on separate
threads.

To retrieve IMU samples as soon as they're available, you may want to call [`k4a_device_get_imu_sample()`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_ga8e5913b3bb94a453c7143bbd6e399a0e.html#ga8e5913b3bb94a453c7143bbd6e399a0e) on its own thread. The API also has sufficient internal queuing to allow you to only check for samples after each image capture is returned.

Because there's some internal queueing of IMU samples, you can use the following pattern without dropping any data:

1. Wait on a capture, at any frames rate.
2. Process the capture.
3. Retrieve all the queued IMU samples.
4. Repeat waiting on the next capture.

To retrieve all the currently queued IMU samples, you can call [`k4a_device_get_imu_sample()`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_ga8e5913b3bb94a453c7143bbd6e399a0e.html#ga8e5913b3bb94a453c7143bbd6e399a0e) with a `timeout_in_ms` of 0 in a loop until the function returns `K4A_WAIT_RESULT_TIMEOUT`. `K4A_WAIT_RESULT_TIMEOUT` indicates that there are no queued samples and none have arrived in the timeout specified.

## Usage example

```C
k4a_imu_sample_t imu_sample;

// Capture a imu sample
switch (k4a_device_get_imu_sample(device, &imu_sample, TIMEOUT_IN_MS))
{
case K4A_WAIT_RESULT_SUCCEEDED:
    break;
case K4A_WAIT_RESULT_TIMEOUT:
    printf("Timed out waiting for a imu sample\n");
    continue;
    break;
case K4A_WAIT_RESULT_FAILED:
    printf("Failed to read a imu sample\n");
    goto Exit;
}

// Access the accelerometer readings
if (imu_sample != NULL)
{
    printf(" | Accelerometer temperature:%.2f x:%.4f y:%.4f z: %.4f\n",
            imu_sample.temperature,
            imu_sample.acc_sample.xyz.x,
            imu_sample.acc_sample.xyz.y,
            imu_sample.acc_sample.xyz.z);
}

```

## Next steps

Now you know how to work with IMU samples, you also can
>[!div class="nextstepaction"]
>[Access microphone input data](access-mics.md)
