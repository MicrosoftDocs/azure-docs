---
title: Azure Kinect get body tracking results
description: Learn how to get body tracking results using the Azure Kinect Body Tracking SDK.
author: qm13
ms.prod: kinect-dk
ms.author: quentinm
ms.reviewer: yijwan
ms.date: 06/26/2019
ms.topic: conceptual
keywords: kinect, azure, sensor, sdk, body, tracking, joint
---

# Get body tracking results

Body Tracking SDK uses a body tracker object to process Azure Kinect DK captures and generates body tracking results. It also maintains global status of the tracker, processing queues and the output queue. There are three steps in using the body tracker:

- Create a tracker
- Capture depth and IR images using Azure Kinect DK
- Enqueue the capture and pop the results.

## Create a tracker


The first step in using body tracking is to create a tracker and requires passing in the sensor calibration [k4a_calibration_t](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/structk4a__calibration__t.html) structure. The sensor calibration can be queried using the Azure Kinect Sensor SDK [k4a_device_get_calibration()](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_ga4e43940d8d8db48da266c7a7842c8d78.html#ga4e43940d8d8db48da266c7a7842c8d78) function.

```C
k4a_calibration_t sensor_calibration;
if (K4A_RESULT_SUCCEEDED != k4a_device_get_calibration(device, device_config.depth_mode, K4A_COLOR_RESOLUTION_OFF, &sensor_calibration))
{
    printf("Get depth camera calibration failed!\n");
    return 0;
}

k4abt_tracker_t tracker = NULL;
k4abt_tracker_configuration_t tracker_config = K4ABT_TRACKER_CONFIG_DEFAULT;
if (K4A_RESULT_SUCCEEDED != k4abt_tracker_create(&sensor_calibration, tracker_config, &tracker))
{
    printf("Body tracker initialization failed!\n");
    return 0;
}
```

## Capture depth and IR images

Image capture using Azure Kinect DK is covered in the [retrieve images](retrieve-images.md) page.

>[!NOTE]
> `K4A_DEPTH_MODE_NFOV_UNBINNED` or `K4A_DEPTH_MODE_WFOV_2X2BINNED` modes are recommended for best performance and accuracy. Do not use the `K4A_DEPTH_MODE_OFF` or `K4A_DEPTH_MODE_PASSIVE_IR` modes.

The supported Azure Kinect DK modes are described in the Azure Kinect DK [hardware specification](hardware-specification.md) and [k4a_depth_mode_t](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___enumerations_ga3507ee60c1ffe1909096e2080dd2a05d.html#ga3507ee60c1ffe1909096e2080dd2a05d) enumerations.

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

## Enqueue the capture and pop the results

The tracker internally maintains an input queue and an output queue to asynchronously process the Azure Kinect DK captures more efficiently. Use the [k4abt_tracker_enqueue_capture()](https://microsoft.github.io/Azure-Kinect-Body-Tracking/release/1.x.x/group__btfunctions_ga093becd9bb4a63f5f4d56f58097a7b1e.html#ga093becd9bb4a63f5f4d56f58097a7b1e) function to add a new capture to the input queue. Use the [k4abt_tracker_pop_result()](https://microsoft.github.io/Azure-Kinect-Body-Tracking/release/1.x.x/group__btfunctions_gaaf446fb1579cbbe0b6af824ee0a7458b.html#gaaf446fb1579cbbe0b6af824ee0a7458b) function o pop a result from the output queue. Use of the timeout value is dependent on the application and controls the queuing wait time.

### Real-time processing
Use this pattern for single-threaded applications that need real-time results and can accommodate dropped frames. The `simple_3d_viewer` sample located in [GitHub Azure-Kinect-Samples](https://github.com/microsoft/Azure-Kinect-Samples) is an example of real-time processing.

```C
k4a_wait_result_t queue_capture_result = k4abt_tracker_enqueue_capture(tracker, sensor_capture, 0);
k4a_capture_release(sensor_capture); // Remember to release the sensor capture once you finish using it
if (queue_capture_result == K4A_WAIT_RESULT_FAILED)
{
    printf("Error! Adding capture to tracker process queue failed!\n");
    break;
}

k4abt_frame_t body_frame = NULL;
k4a_wait_result_t pop_frame_result = k4abt_tracker_pop_result(tracker, &body_frame, 0);
if (pop_frame_result == K4A_WAIT_RESULT_SUCCEEDED)
{
    // Successfully popped the body tracking result. Start your processing
    ...

    k4abt_frame_release(body_frame); // Remember to release the body frame once you finish using it
}
```

### Synchronous processing
Use this pattern for applications that do not need real-time results or cannot accommodate dropped frames.

Processing throughput may be limited.

The `simple_sample.exe` sample located in [GitHub Azure-Kinect-Samples](https://github.com/microsoft/Azure-Kinect-Samples) is an example of synchronous processing.

```C
k4a_wait_result_t queue_capture_result = k4abt_tracker_enqueue_capture(tracker, sensor_capture, K4A_WAIT_INFINITE);
k4a_capture_release(sensor_capture); // Remember to release the sensor capture once you finish using it
if (queue_capture_result != K4A_WAIT_RESULT_SUCCEEDED)
{
    // It should never hit timeout or error when K4A_WAIT_INFINITE is set.
    printf("Error! Adding capture to tracker process queue failed!\n");
    break;
}

k4abt_frame_t body_frame = NULL;
k4a_wait_result_t pop_frame_result = k4abt_tracker_pop_result(tracker, &body_frame, K4A_WAIT_INFINITE);
if (pop_frame_result != K4A_WAIT_RESULT_SUCCEEDED)
{
    // It should never hit timeout or error when K4A_WAIT_INFINITE is set.
    printf("Error! Popping body tracking result failed!\n");
    break;
}
// Successfully popped the body tracking result. Start your processing
...

k4abt_frame_release(body_frame); // Remember to release the body frame once you finish using it
```

## Next steps

> [!div class="nextstepaction"]
>[Access data in body frame](access-data-body-frame.md)
