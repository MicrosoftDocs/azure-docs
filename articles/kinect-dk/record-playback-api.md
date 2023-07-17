---
title: Azure Kinect playback API
description: Learn how to use the Azure Kinect Sensor SDK to open a recording file using the playback API.
author: martinekuan
ms.author: martinek
ms.service: azure-kinect-developer-kit
ms.date: 06/26/2019
ms.topic: conceptual
keywords: kinect, azure, sensor, sdk, depth, rgb, record, playback, matroska, mkv
---
# The Azure Kinect playback API

The sensor SDK provides an API for recording device data to a Matroska (.mkv) file. The Matroska container format stores video tracks, IMU samples, and device calibration. Recordings can be generated using the provided [k4arecorder](record-sensor-streams-file.md) command-line utility. Recordings can also be customized and recorded directly using the record API.

For more information about the recording API, see [`k4a_record_create()`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_gae14f4181e9688e710d1c80b215413831.html#gae14f4181e9688e710d1c80b215413831).

For more information on the Matroska file format specifications, see the [Recording File Format](record-file-format.md) page.

## Use the playback API

Recording files can be opened using the playback API. The playback API provides access to sensor data in the same format as the rest of the sensor SDK.

### Open a record file

In the following example, we open a recording using [`k4a_playback_open()`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_gacb254ac941b2ab3c202ca68f4537f368.html#gacb254ac941b2ab3c202ca68f4537f368), print the recording length,
and then close the file with [`k4a_playback_close()`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_ga76f415f2076f1c8c544e094a649306ff.html#ga76f415f2076f1c8c544e094a649306ff).

```C
k4a_playback_t playback_handle = NULL;
if (k4a_playback_open("recording.mkv", &playback_handle) != K4A_RESULT_SUCCEEDED)
{
    printf("Failed to open recording\n");
    return 1;
}

uint64_t recording_length = k4a_playback_get_last_timestamp_usec(playback_handle);
printf("Recording is %lld seconds long\n", recording_length / 1000000);

k4a_playback_close(playback_handle);
```

### Read captures

Once the file is open, we can start reading captures from the recording. This next example will read each of the captures in the file.

```C
k4a_capture_t capture = NULL;
k4a_stream_result_t result = K4A_STREAM_RESULT_SUCCEEDED;
while (result == K4A_STREAM_RESULT_SUCCEEDED)
{
    result = k4a_playback_get_next_capture(playback_handle, &capture);
    if (result == K4A_STREAM_RESULT_SUCCEEDED)
    {
        // Process capture here
        k4a_capture_release(capture);
    }
    else if (result == K4A_STREAM_RESULT_EOF)
    {
        // End of file reached
        break;
    }
}
if (result == K4A_STREAM_RESULT_FAILED)
{
    printf("Failed to read entire recording\n");
    return 1;
}
```

### Seek within a recording

Once we've reached the end of the file, we may want to go back and read it again. This process could be done by reading backwards with
[`k4a_playback_get_previous_capture()`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_ga54732e3aa0717e1ca4eb76ee385e878c.html#ga54732e3aa0717e1ca4eb76ee385e878c), but it could be very slow depending on the length of the recording.
Instead we can use the [`k4a_playback_seek_timestamp()`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_gaea748994a121543bd77f90417cf428f6.html#gaea748994a121543bd77f90417cf428f6) function to go to a specific point in the file.

In this example, we specify timestamps in microseconds to seek to various points in the file.

```C
// Seek to the beginning of the file
if (k4a_playback_seek_timestamp(playback_handle, 0, K4A_PLAYBACK_SEEK_BEGIN) != K4A_RESULT_SUCCEEDED)
{
    return 1;
}

// Seek to the end of the file
if (k4a_playback_seek_timestamp(playback_handle, 0, K4A_PLAYBACK_SEEK_END) != K4A_RESULT_SUCCEEDED)
{
    return 1;
}

// Seek to 10 seconds from the start
if (k4a_playback_seek_timestamp(playback_handle, 10 * 1000000, K4A_PLAYBACK_SEEK_BEGIN) != K4A_RESULT_SUCCEEDED)
{
    return 1;
}

// Seek to 10 seconds from the end
if (k4a_playback_seek_timestamp(playback_handle, -10 * 1000000, K4A_PLAYBACK_SEEK_END) != K4A_RESULT_SUCCEEDED)
{
    return 1;
}
```

### Read tag information

Recordings can also contain various metadata such as the device serial number and firmware versions. This metadata is
stored in recording tags, which can be accessed using the [`k4a_playback_get_tag()`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_ga320f966fc89b4ba0d758f787f70d5143.html#ga320f966fc89b4ba0d758f787f70d5143) function.

```C
// Print the serial number of the device used to record
char serial_number[256];
size_t serial_number_size = 256;
k4a_buffer_result_t buffer_result = k4a_playback_get_tag(playback_handle, "K4A_DEVICE_SERIAL_NUMBER", &serial_number, &serial_number_size);
if (buffer_result == K4A_BUFFER_RESULT_SUCCEEDED)
{
    printf("Device serial number: %s\n", serial_number);
}
else if (buffer_result == K4A_BUFFER_RESULT_TOO_SMALL)
{
    printf("Device serial number too long.\n");
}
else
{
    printf("Tag does not exist. Device serial number was not recorded.\n");
}
```

### Record tag list

Below is a list of all the default tags that may be included in a recording file. Many of these values are available as part of
the [`k4a_record_configuration_t`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/structk4a__record__configuration__t.html) struct, and can be read with the
[`k4a_playback_get_record_configuration()`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_gaab54a85c1f1e98d170d009042b449255.html#gaab54a85c1f1e98d170d009042b449255) function.

If a tag doesn't exist, it's assumed to have the default value.

| Tag Name                     | Default Value      | [`k4a_record_configuration_t`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/structk4a__record__configuration__t.html) Field | Notes     |
|------------------------------|--------------------|--------------------------------------|----------------------------------------------------------------------------------------------------------------|
| `K4A_COLOR_MODE`             | "OFF"              | `color_format` / `color_resolution`  | Possible values: "OFF", "MJPG_1080P", "NV12_720P", "YUY2_720P", and so on                                      |
| `K4A_DEPTH_MODE`             | "OFF"              | `depth_mode` / `depth_track_enabled` | Possible values: "OFF, "NFOV_UNBINNED", "PASSIVE_IR", and so on                                                |
| `K4A_IR_MODE`                | "OFF"              | `depth_mode` / `ir_track_enabled`    | Possible values: "OFF", "ACTIVE", "PASSIVE"                                                                    |
| `K4A_IMU_MODE`               | "OFF"              | `imu_track_enabled`                  | Possible values: "ON", "OFF"                                                                                   |
| `K4A_CALIBRATION_FILE`       | "calibration.json" | N/A                                  | See [`k4a_device_get_raw_calibration()`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_ga8c4e46642cee3115aeb0b33e2b43b24f.html#ga8c4e46642cee3115aeb0b33e2b43b24f) |
| `K4A_DEPTH_DELAY_NS`         | "0"                | `depth_delay_off_color_usec`         | Value stored in nanoseconds, API provides microseconds.                                                        |
| `K4A_WIRED_SYNC_MODE`        | "STANDALONE"       | `wired_sync_mode`                    | Possible values: "STANDALONE", "MASTER", "SUBORDINATE"                                                         |
| `K4A_SUBORDINATE_DELAY_NS`   | "0"                | `subordinate_delay_off_master_usec`  | Value stored in nanoseconds, API provides microseconds.                                                        |
| `K4A_COLOR_FIRMWARE_VERSION` | ""                 | N/A                                  | Device color firmware version, for example "1.x.xx"                                                            |
| `K4A_DEPTH_FIRMWARE_VERSION` | ""                 | N/A                                  | Device depth firmware version, for example "1.x.xx"                                                            |
| `K4A_DEVICE_SERIAL_NUMBER`   | ""                 | N/A                                  | Recording device serial number                                                                                 |
| `K4A_START_OFFSET_NS`        | "0"                | `start_timestamp_offset_usec`        | See [Timestamp Synchronization](record-playback-api.md#timestamp-synchronization) below.                       |
| `K4A_COLOR_TRACK`            | None               | N/A                                  | See [Recording File Format - Identifying tracks](record-file-format.md#identifying-tracks).                     |
| `K4A_DEPTH_TRACK`            | None               | N/A                                  | See [Recording File Format - Identifying tracks](record-file-format.md#identifying-tracks).                     |
| `K4A_IR_TRACK`               | None               | N/A                                  | See [Recording File Format - Identifying tracks](record-file-format.md#identifying-tracks).                     |
| `K4A_IMU_TRACK`              | None               | N/A                                  | See [Recording File Format - Identifying tracks](record-file-format.md#identifying-tracks).                     |

## Timestamp synchronization

The Matroska format requires that recordings must start with a timestamp of zero. When [externally syncing cameras](record-external-synchronized-units.md), the first timestamp from of each device can be non-zero.

To preserve the original timestamps from the devices between recording and playback, the file stores an offset to apply to the timestamps.

The `K4A_START_OFFSET_NS` tag is used to specify a timestamp offset so that files can be resynchronized after recording. This timestamp offset can be added to each timestamp in the file to reconstruct the original device timestamps.

The start offset is also available in the [`k4a_record_configuration_t`](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/structk4a__record__configuration__t.html) struct.
