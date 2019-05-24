---
ms.title: Retrieve Azure Kinect IMU samples
description: Retrieve IMU samples using Azure Kinect 
author: qm13
ms.author: cedmonds
ms.date: 04/26/2019
ms.prod: kinect-dk
ms.topic: conceptual
keywords: kinect, azure, configure, depth, color, RBG, camera, sensor, sdk, IMU, motion sensor, motion, gyroscope, gyro, accelerometer, FPS
---

# Retrieve IMU samples

The Azure Kinect device provides access to Inertial Motion Units (IMUs), including both the accelerometer and gyroscope types. To access IMUs samples, you must first open and configure your device, then capture IMU data. For more information, see [find and open device](find-then-open-device.md).

## Configure and start cameras

IMU sensors can only work when the color and/or the depth cameras are running. IMU sensors cannot work alone.

To start the cameras, use [k4a_device_start_cameras](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/feature/publishdocs/group___functions_ga4dc81cbeb54b07e4bbb7d639c448f6eb.html#ga4dc81cbeb54b07e4bbb7d639c448f6eb).

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

Keep in mind, you can start one or both cameras. However, one camera offers a depth the other camera offers color capability. Currently, each camera cannot perform both functions.

## Access IMU samples

Sensor readings are captured from the device in a correlated manner. Each [k4a_imu_sample_t](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/feature/publishdocs/structk4a__imu__sample__t.html#details) contains a combination
of accelerometer and gyroscope readings.

You can access and view IMU samples on either a single, dedicated thread. Or, ping-pong by a single thread, then read the captured image, including the available IMU samples.

As long as a thread can keep up with the capture frame rate, the IMU has sufficient queueing to allow a thread to:

1. Wait on a capture, at any frames-per-second (FPS).
2. Process the capture.
3. Repeatedly call [k4a_device_get_imu_sample](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/feature/publishdocs/group___functions_ga8e5913b3bb94a453c7143bbd6e399a0e.html#ga8e5913b3bb94a453c7143bbd6e399a0e) with a timestamp of 0 until the queue is drained.
4. Repeat.

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