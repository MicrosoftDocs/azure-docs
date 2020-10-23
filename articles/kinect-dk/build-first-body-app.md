---
title: 'Quickstart: Build an Azure Kinect body tracking application'
description: Step by step instructions to build your first Azure Kinect body tracking application 
author: qm13
ms.author: quentinm
ms.reviewer: yijwan
ms.prod: kinect-dk
ms.date: 06/26/2019
ms.topic: quickstart
keywords: kinect, azure, sensor, sdk, body, tracking, joint, application, first

#Customer intent: As an Azure Kinect DK developer, I want to create a new Azure Kinect DK application.

---

# Quickstart: Build an Azure Kinect body tracking application

Getting started with the Body Tracking SDK? This quickstart will get you up and running with body tracking! You can find more examples in this [Azure-Kinect-Sample repo](https://github.com/microsoft/Azure-Kinect-Samples/tree/master/body-tracking-samples).

## Prerequisites

- [Set up Azure Kinect DK](set-up-azure-kinect-dk.md)
- [Set up Body Tracking SDK](body-sdk-setup.md)
- Walk through how to [build your first Azure Kinect application](build-first-app.md) quickstart.
- Familiarize yourself with the following Sensor SDK functions:
  - [k4a_device_open()](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_ga3d4eb5dfbf4d576d4978b66ea419f113.html#ga3d4eb5dfbf4d576d4978b66ea419f113)
  - [k4a_device_start_cameras()](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_gaad7a85e1e5471810262442fc4a8e217a.html#gaad7a85e1e5471810262442fc4a8e217a)
  - [k4a_device_stop_cameras()](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_ga4fa0e0a011a7105309ad97f081a5d6b8.html#ga4fa0e0a011a7105309ad97f081a5d6b8)
  - [k4a_device_close()](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_ga7a3931d9a690b3971caaac83b43f9423.html#ga7a3931d9a690b3971caaac83b43f9423)
- Review the documentation on the following Body Tracking SDK functions:
  - [k4abt_tracker_create()](https://microsoft.github.io/Azure-Kinect-Body-Tracking/release/1.x.x/group__btfunctions_ga1aa71481b8441def94de11b29e0e3cbc.html#ga1aa71481b8441def94de11b29e0e3cbc)
  - [k4abt_tracker_enqueue_capture()](https://microsoft.github.io/Azure-Kinect-Body-Tracking/release/1.x.x/group__btfunctions_ga093becd9bb4a63f5f4d56f58097a7b1e.html#ga093becd9bb4a63f5f4d56f58097a7b1e)
  - [k4abt_tracker_pop_result()](https://microsoft.github.io/Azure-Kinect-Body-Tracking/release/1.x.x/group__btfunctions_gaaf446fb1579cbbe0b6af824ee0a7458b.html#gaaf446fb1579cbbe0b6af824ee0a7458b)
  - [k4abt_tracker_shutdown()](https://microsoft.github.io/Azure-Kinect-Body-Tracking/release/1.x.x/group__btfunctions_ga94036969ef94cbc414c78b3f6d04bfa5.html#ga94036969ef94cbc414c78b3f6d04bfa5)
  - [k4abt_tracker_destroy()](https://microsoft.github.io/Azure-Kinect-Body-Tracking/release/1.x.x/group__btfunctions_gab2c9afca092130976cd66077c0557ed1.html#gab2c9afca092130976cd66077c0557ed1)

## Headers

Body tracking uses a single header, `k4abt.h`. Include this header in addition to `k4a.h`. Make sure your compiler of choice is set up for both the Sensor SDK and the Body Tracking SDK `lib` and `include` folders. You also need to link to `k4a.lib` and `k4abt.lib` files. Running the application requires `k4a.dll`, `k4abt.dll`, `onnxruntime.dll`, and `dnn_model.onnx` to be in the applications execution path.

```C
#include <k4a/k4a.h>
#include <k4abt.h>
```

## Open device and start the camera

Your first body tracking application assumes a single Azure Kinect device connected to the PC.

Body tracking builds on the Sensor SDK. To use body tracking, you first need to open and configure the device. Use the [k4a_device_open()](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_ga3d4eb5dfbf4d576d4978b66ea419f113.html#ga3d4eb5dfbf4d576d4978b66ea419f113) function to open the device and then configure it with a [k4a_device_configuration_t](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/structk4a__device__configuration__t.html) object. For best results set the depth mode to `K4A_DEPTH_MODE_NFOV_UNBINNED` or `K4A_DEPTH_MODE_WFOV_2X2BINNED`. The body tracker will not run if the depth mode is set to  `K4A_DEPTH_MODE_OFF` or `K4A_DEPTH_MODE_PASSIVE_IR`.

You can find more information on finding and opening the device on [this page](find-then-open-device.md).

You can find more information on Azure Kinect depth modes on these pages:
[hardware specification](hardware-specification.md) 
and [k4a_depth_mode_t](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___enumerations_ga3507ee60c1ffe1909096e2080dd2a05d.html#ga3507ee60c1ffe1909096e2080dd2a05d) enumerations.

```C
k4a_device_t device = NULL;
k4a_device_open(0, &device);

// Start camera. Make sure depth camera is enabled.
k4a_device_configuration_t deviceConfig = K4A_DEVICE_CONFIG_INIT_DISABLE_ALL;
deviceConfig.depth_mode = K4A_DEPTH_MODE_NFOV_UNBINNED;
deviceConfig.color_resolution = K4A_COLOR_RESOLUTION_OFF;
k4a_device_start_cameras(device, &deviceConfig);
```

## Create the tracker

The first step in getting body tracking results is to create a body tracker. It needs the sensor calibration [k4a_calibration_t](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/structk4a__calibration__t.html) structure. The sensor calibration can be queried using the [k4a_device_get_calibration()](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_ga4e43940d8d8db48da266c7a7842c8d78.html#ga4e43940d8d8db48da266c7a7842c8d78) function.

```C
k4a_calibration_t sensor_calibration;
k4a_device_get_calibration(device, deviceConfig.depth_mode, deviceConfig.color_resolution, &sensor_calibration);

k4abt_tracker_t tracker = NULL;
k4abt_tracker_configuration_t tracker_config = K4ABT_TRACKER_CONFIG_DEFAULT;
k4abt_tracker_create(&sensor_calibration, tracker_config, &tracker);
```

## Get captures from the Azure Kinect device

You can find more information on retrieving image data on [this page](retrieve-images.md).

```C
// Capture a depth frame
k4a_device_get_capture(device, &capture, TIMEOUT_IN_MS);
```

## Enqueue the capture and pop the results

The tracker internally maintains an input queue and an output queue to asynchronously process the Azure Kinect DK captures more efficiently. The next step is to use the `k4abt_tracker_enqueue_capture()` function to add a new capture to the input queue. Use the `k4abt_tracker_pop_result()` function to pop a result from the output queue. The timeout value is dependent on the application and controls the queueing wait time.

Your first body tracking application uses the real-time processing pattern. Refer to [get body tracking results](get-body-tracking-results.md) for a detailed explanation of the other patterns.

```C
k4a_wait_result_t queue_capture_result = k4abt_tracker_enqueue_capture(tracker, sensor_capture, K4A_WAIT_INFINITE);
k4a_capture_release(sensor_capture); // Remember to release the sensor capture once you finish using it
if (queue_capture_result == K4A_WAIT_RESULT_FAILED)
{
    printf("Error! Adding capture to tracker process queue failed!\n");
    break;
}

k4abt_frame_t body_frame = NULL;
k4a_wait_result_t pop_frame_result = k4abt_tracker_pop_result(tracker, &body_frame, K4A_WAIT_INFINITE);
if (pop_frame_result == K4A_WAIT_RESULT_SUCCEEDED)
{
    // Successfully popped the body tracking result. Start your processing
    ...

    k4abt_frame_release(body_frame); // Remember to release the body frame once you finish using it
}
```

## Access the body tracking result data

The body tracking results for each sensor capture are stored in a body frame [k4abt_frame_t](https://microsoft.github.io/Azure-Kinect-Body-Tracking/release/1.x.x/structk4abt__frame__t.html) structure. Each body frame contains three key components: a collection of body structs, a 2D body index map, and the input capture.

Your first body tracking application only accesses the number of detected bodies. Refer to [access data in body frame](access-data-body-frame.md) for detailed explanation of data in a body frame.

```C
size_t num_bodies = k4abt_frame_get_num_bodies(body_frame);
printf("%zu bodies are detected!\n", num_bodies);
```

## Clean up

The final step is to shut down the body tracker and release the body tracking object. You also need to stop and close the device.

```C
k4abt_tracker_shutdown(tracker);
k4abt_tracker_destroy(tracker);
k4a_device_stop_cameras(device);
k4a_device_close(device);
```

## Full source

```C
#include <stdio.h>
#include <stdlib.h>

#include <k4a/k4a.h>
#include <k4abt.h>

#define VERIFY(result, error)                                                                            \
    if(result != K4A_RESULT_SUCCEEDED)                                                                   \
    {                                                                                                    \
        printf("%s \n - (File: %s, Function: %s, Line: %d)\n", error, __FILE__, __FUNCTION__, __LINE__); \
        exit(1);                                                                                         \
    }                                                                                                    \

int main()
{
    k4a_device_t device = NULL;
    VERIFY(k4a_device_open(0, &device), "Open K4A Device failed!");

    // Start camera. Make sure depth camera is enabled.
    k4a_device_configuration_t deviceConfig = K4A_DEVICE_CONFIG_INIT_DISABLE_ALL;
    deviceConfig.depth_mode = K4A_DEPTH_MODE_NFOV_UNBINNED;
    deviceConfig.color_resolution = K4A_COLOR_RESOLUTION_OFF;
    VERIFY(k4a_device_start_cameras(device, &deviceConfig), "Start K4A cameras failed!");

    k4a_calibration_t sensor_calibration;
    VERIFY(k4a_device_get_calibration(device, deviceConfig.depth_mode, deviceConfig.color_resolution, &sensor_calibration),
        "Get depth camera calibration failed!");

    k4abt_tracker_t tracker = NULL;
    k4abt_tracker_configuration_t tracker_config = K4ABT_TRACKER_CONFIG_DEFAULT;
    VERIFY(k4abt_tracker_create(&sensor_calibration, tracker_config, &tracker), "Body tracker initialization failed!");

    int frame_count = 0;
    do
    {
        k4a_capture_t sensor_capture;
        k4a_wait_result_t get_capture_result = k4a_device_get_capture(device, &sensor_capture, K4A_WAIT_INFINITE);
        if (get_capture_result == K4A_WAIT_RESULT_SUCCEEDED)
        {
            frame_count++;
            k4a_wait_result_t queue_capture_result = k4abt_tracker_enqueue_capture(tracker, sensor_capture, K4A_WAIT_INFINITE);
            k4a_capture_release(sensor_capture); // Remember to release the sensor capture once you finish using it
            if (queue_capture_result == K4A_WAIT_RESULT_TIMEOUT)
            {
                // It should never hit timeout when K4A_WAIT_INFINITE is set.
                printf("Error! Add capture to tracker process queue timeout!\n");
                break;
            }
            else if (queue_capture_result == K4A_WAIT_RESULT_FAILED)
            {
                printf("Error! Add capture to tracker process queue failed!\n");
                break;
            }

            k4abt_frame_t body_frame = NULL;
            k4a_wait_result_t pop_frame_result = k4abt_tracker_pop_result(tracker, &body_frame, K4A_WAIT_INFINITE);
            if (pop_frame_result == K4A_WAIT_RESULT_SUCCEEDED)
            {
                // Successfully popped the body tracking result. Start your processing

                size_t num_bodies = k4abt_frame_get_num_bodies(body_frame);
                printf("%zu bodies are detected!\n", num_bodies);

                k4abt_frame_release(body_frame); // Remember to release the body frame once you finish using it
            }
            else if (pop_frame_result == K4A_WAIT_RESULT_TIMEOUT)
            {
                //  It should never hit timeout when K4A_WAIT_INFINITE is set.
                printf("Error! Pop body frame result timeout!\n");
                break;
            }
            else
            {
                printf("Pop body frame result failed!\n");
                break;
            }
        }
        else if (get_capture_result == K4A_WAIT_RESULT_TIMEOUT)
        {
            // It should never hit time out when K4A_WAIT_INFINITE is set.
            printf("Error! Get depth frame time out!\n");
            break;
        }
        else
        {
            printf("Get depth capture returned error: %d\n", get_capture_result);
            break;
        }

    } while (frame_count < 100);

    printf("Finished body tracking processing!\n");

    k4abt_tracker_shutdown(tracker);
    k4abt_tracker_destroy(tracker);
    k4a_device_stop_cameras(device);
    k4a_device_close(device);

    return 0;
}
```

## Next steps

> [!div class="nextstepaction"]
>[Get body tracking results](get-body-tracking-results.md)
