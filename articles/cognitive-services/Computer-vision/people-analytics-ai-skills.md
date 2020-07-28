---
title: How to install and run the People Analytics container - Computer Vision
titleSuffix: Azure Cognitive Services
description: How to download, install, and run containers for Computer Vision in this walkthrough tutorial.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: conceptual
ms.date: 07/28/2020
ms.author: aahi
---

# AI skills for the People Analytics container

The People Analytics container lets you analyze real-time streaming video from camera devices. For each camera device you configure, AI skills are properties for detection and tracking that generate an output stream of JSON messages to your Azure IoT Hub instance. 

The container implements the following AI skills for People Analytics:

| AI skill ID | Description|
|---------|---------|
| `Microsoft.ComputerVision.PersonCount` | Counts people in a designated zone in the camera's field of view. <br> Emits an initial _personCountEvent_ event and _personCountEvent_ events when the count changes. |
| `Microsoft.ComputerVision.PersonCrossingLine` | Tracks when a person crosses a designated line in the camera's field of view. <br> Emits a _personLineEvent_ event when a person crosses the line, with directional info. 
| `Microsoft.ComputerVision.PersonCrossingPolygon` | Tracks when a person crosses a designated line in the camera's field of view. <br> Emits a _personLineEvent_ event when a person crosses the zone, with directional info. |
| `Microsoft.ComputerVision.PersonDistance` | Tracks when people violate a distance rule. <br> Emits a _personDistanceEvent_ periodically with the location of each distance violation. |
| `Microsoft.ComputerVision.PersonCrossingLine.Debug` | Same event output as `Microsoft.ComputerVision.PersonCrossingLine` with the ability to visualize video frames as being processed, for debugging. You will need to run `xhost +` on the  host computer to enable the visualization of the video frames and events. |
`Microsoft.ComputerVision.PersonCrossingPolygon.Debug` | Same event output as `Microsoft.ComputerVision.PersonCrossingPolygon` with the ability to visualize video frames as being processed, for debugging. You will need to run `xhost +` on the  host computer to enable the visualization of the video frames and events.|
`Microsoft.ComputerVision.VideoRecorder` | This skill enables recording of video streams as being processed into an Azure Blob Storage instance you can deploy on the edge or in the cloud. You are in control of where the data is being stored. The data is not transmitted to Microsoft. |

[!IMPORTANT] The computer vision AI models used in this container detect and locate human presences in video footage by using a bounding box around a human body or head. The AI models do not attempt to detect faces or discover the identities or demographics of individuals.

Each skill requires the following parameters:

| AI skill parameter| Description|
|---------|---------|
| `skill ID` | The AI skill ID from table above.|
| `enabled` | Whether the skill is enabled. Can be `true` or `false` |
| `VIDEO_URL`| The Real Time Streaming Protocol (RTSP) URL for the camera device (for example: `rtsp://username:password@url`). Archon supports H.264 encoded streams through RTSP or HTTP, and in case of file format(container format) should be mp4. |
| `VIDEO_SOURCE_ID` | A name for the camera device or video stream. Returned with the event JSON output.|
| `VIDEO_IS_LIVE`| `true` for camera devices; `false` for recorded videos.|
| `TRACKER_NODE_CONFIG` | JSON indicating which GPU to run the system on. Should be in the following format: `"{ \"gpu_index\": 0 }",`|
| `SPACEANALYTICS_CONFIG` | JSON configuration for zones and lines.|

## Zone configuration for Microsoft.ComputerVision.PersonCount

This is an example of a JSON input for the `SPACEANALYTICS_CONFIG` parameter that configures a zone. You may configure multiple zone for this AI skill.

```json
{
"zones":[{
	"name": "lobby"
	"polygon": [[0.3,0.3], [0.3,0.9], [0.6,0.9], [0.6,0.3], [0.3,0.3]],
	"threshold": 50.00,
	"events":[{
		"type": "count"
		"config":{
			"trigger": "event",
			"output_frequency": "1"
      }
		}]
	}]
}
```

| Name | Type| Description|
|---------|---------|---------|
| `zones` | list| List of zones|
| `name` | string| Friendly name for this zone.|
| `polygon` | list| Each value pair represents the x,y for vertices of a polygon. The polygon represents the areas in which people are tracked or counted and polygon points are based on normalized coordinates (0-1), where the top left corner is (0.0, 0.0) and the bottom right corner is (1.0, 1.0).   
| `threshold` | float| Events are egressed when the confidence of the AI models is greater or equal this value. |
| `type` | string| The type of skill. For **Microsoft.ComputerVision.PersonCount** this should be `count`.|
| `trigger` | string| The type of trigger for sending an event. Supported values are `event` for sending events when the count changes or `interval` for sending events periodically, irrespective of whether the count has changed or not.
| `interval` | string| A time in seconds that the person count will be aggregated before an event is fired. The AI skill system will continue to analyze the scene at a constant rate and returns the most common count over that interval. The aggregation interval is applicable to both `event` and `interval`.|

### Example JSON output

The events from each AI skill are sent to Azure IoT Hub using JSON.

```json
{
  "schemaVersion": "0.1",
    "sourceInfo": {
      "id": "end_computer",
      "timestamp": "2019-09-28T01:18:16.378Z"
    },
    "events": [{
        "id": "23a5514ca7a148eba98ab9664c649e62",
        "detections": [{
                "types": [{
                "name": "person",
                "confidence": 0.6406716704368591
              }],
            "id": "c13c3e8ac42f40178d155a7bcafe3679",
            "rectangle": {
              "width": 0.1308304179798473,
              "height": 0.3069009491891572,
              "left": 0.5149070566350763,
              "top": 0.28866476964468907
            }}],
        "metadataType": "personCountEvent",
        "metadataVersion": "1.0",
        "metadata": {
          "label": "queue",
          "trigger": "event",
          "detectionCount": 2
        }}
      ]},
    }
```

| Name | Type| Description|
|---------|---------|---------|
| `person` | string| Detection of type 'person'|
| `confidence` | float| Algorithm confidence|
| `id` | string| Event id|
| `rectangle` | 4 float values| Width, height, left, top values with the coordinates of the bounding box indicating where in the frame the person's body was detected|
| `metadataType` | string| The type of the metadata for this event is 'personCountEvent' |
| `label` | string| The value in "name" field of the "zones" in the SPACEANALYTICS_CONFIG  JSON configuration|
| `trigger` | string| The trigger type is 'event'|
| `detectionCount` | int| Number of people detected|




### Line configuration for Microsoft.ComputerVision.PersonCrossingLine

This is an example of a JSON input for the `SPACEANALYTICS_CONFIG` parameter that configures a line. You may configure multiple lines for this AI skill.

> [!NOTE]
> `Microsoft.ComputerVision.PersonCrossingLine` detects when the bounding box for a person's head intersects the line. When selecting the line's start and end coordinates, place the line at a height appropriate for the average person's head and ensure that it covers the entire path where people will pass.

```json
{
"lines":[{
	"name": "door"
	"line": {
        "start": {"x": 0, "y": 0.5},
        "end": {"x": 1, "y": 0.5}
            },
	"threshold": 50.00,
	"events":[{
		"type": "linecrossing",
		"config":{
			"trigger": "event"
      }
		}]
	}]
}
```

| Name | Type| Description|
|---------|---------|---------|
| `lines` | list| List of lines.|
| `name` | string| Friendly name for this line.|
| `line` | list| The definition of the line. This is a directional line allowing you to understand "entry" vs. "exit".|
| `start` | value pair| x, y coordinates for line's starting point. The float values represent the position of the vertex relative to the top,left corner. To calculate the absolute x, y values, you multiply these values with the frame size. |
| `end` | value pair| x, y coordinates for line's ending point. The float values represent the position of the vertex relative to the top,left corner. To calculate the absolute x, y values, you multiply these values with the frame size. |
| `threshold` | float| Events are egressed when the confidence of the AI models is greater or equal this value. |
| `type` | string| The type of skill. For **Microsoft.ComputerVision.PersonCrossingLine** this should be `linecrossing`.|
|`trigger`|string|The type of trigger for sending an event.<br>Supported Values: "event": fire when someone crosses the line.|

### Example JSON output

The events from each AI skill are sent to Azure IoT Hub using JSON.

> [!NOTE]  
> The AI model detects a person's head irrespective whether the person is facing towards or away from the camera. The AI model doesn't run face detection or recognition and doesn't emit any biometric information. 

```json
{
  "schemaVersion": "0.1", 
  "sourceInfo": {
    "id": "end_computer",
    "timestamp": "2019-09-28T01:18:16.378Z"
  },
  "detections": [{
      "id": "0a2db64b6f3844269c5da947f6720f92",
      "types": [{
          "name": "person",
          "confidence": 0.9771826863288879
        }],
      "rectangle": {
        "width": 0.1235465345,
        "height": 0.2341315241,
        "top": 0.2563542359,
        "left": 0.9268795875
      },
      "metadataType": "personLineEvent",
      "metadataVersion": "1.0",
      "metadata": {
        "trackingId": "9b5b9b4066c8447887e9d5812c573044",
        "label": "door",
        "status": "CrossLeft"
      }}]
}
```
| Name | Type| Description|
|---------|---------|---------|
| `person` | string| Detection of type 'person'|
| `confidence` | float| Algorithm confidence|
| `id` | string| Event id|
| `rectangle` | 4 float values| Width, height, left, top values with the coordinates of the bounding box indicating where in the frame the person's head was detected|
| `metadataType` | string| The type of the metadata for this event is 'personLineEvent' |
| `label` | string| The value in "name" field of the "lines" in the SPACEANALYTICS_CONFIG  JSON configuration|
| `trackingId` | string| Unique value that identifies a person across multiple detections|
| `status` | int| Direction of line crossings, either CrossLeft or CrossRight|

### Zone configuration for Microsoft.ComputerVision.PersonCrossingPolygon

This is an example of a JSON input for the `SPACEANALYTICS_CONFIG` parameter that configures a zone. You may configure multiple zones for this AI skill.

| Name | Type| Description|
|---------|---------|---------|
| `zones` | list| List of zones|
| `name` | string| Friendly name for this zone.|
| `polygon` | list| Each value pair represents the x,y for vertices of polygon. The polygon represents the areas in which people are tracked or counted. The float values represent the position of the vertex relative to the top,left corner. To calculate the absolute x, y values, you multiply these values with the frame size. 
| `threshold` | float| Events are egressed when the confidence of the AI models is greater or equal this value. |
| `type` | string| The type of skill. For **Microsoft.ComputerVision.PersonCrossingPolygon** this should be `enter` or `exit`.|
| `trigger`|string|The type of trigger for sending an event<br>Supported Values: "event": fire when someone enters or exits the zone.|

```json
{
"zones":[{
	"name": "queue"
	"polygon": [[0.3,0.3], [0.3,0.9], [0.6,0.9], [0.6,0.3], [0.3,0.3]],
	"threshold": 50.00,
	"events":[{
		"type": "enter/exit",
		"config":{
			"trigger": "event"
      }
		}]
	}]
}
```

### Example JSON output

The events from each AI skill are sent to Azure IoT Hub using JSON.

```json
{
  "schemaVersion": "0.1",
  "sourceInfo": {
    "id": "end_computer",
    "timestamp": "2019-09-28T01:18:16.378Z"
  },
  "detections": [{
      "id": "0a2db64b6f3844269c5da947f6720f92",
      "types": [{
          "name": "person",
          "confidence": 0.9771826863288879
        }],
      "rectangle": {
        "width": 0.1235465345,
        "height": 0.2341315241,
        "top": 0.2563542359,
        "left": 0.9268795875
      },
      "metadataType": "personZoneEvent",
      "metadataVersion": "1.0",
      "metadata": {
        "trackingId": "9b5b9b4066c8447887e9d5812c573044",
        "label": "door",
        "status": "Exit",
	 "side": "1",
      }}]}
```
| Name | Type| Description|
|---------|---------|---------|
| `person` | string| Detection of type 'person'|
| `confidence` | float| Algorithm confidence|
| `id` | string| Event id|
| `rectangle` | 4 float values| Width, height, left, top values with the coordinates of the bounding box indicating where in the frame the person's body was detected|
| `metadataType` | string| The type of the metadata for this event is 'personZoneEvent' |
| `label` | string| The value in "name" field of the "zones" in the SPACEANALYTICS_CONFIG JSON configuration|
| `trackingId` | string| Unique value that identifies a person across multiple detections|
| `status` | int| Direction of zone crossings, either Exit or Entry|

### Zone configuration for Microsoft.ComputerVision.PersonDistance

This is an example of a JSON input for the `SPACEANALYTICS_CONFIG` parameter that configures a zone for **Microsoft.ComputerVision.PersonDistance**. You may configure multiple zones for this AI skill.

| Name | Type| Description|
|---------|---------|---------|
| `zones` | list| List of zones|
| `name` | string| Friendly name for this zone.|
| `polygon` | list| Each value pair represents the x,y for vertices of polygon. The polygon represents the areas in which people are counted and the distance between people is measured. The float values represent the position of the vertex relative to the top,left corner. To calculate the absolute x, y values, you multiply these values with the frame size. 
| `threshold` | float| Events are egressed when the confidence of the AI models is greater or equal this value. |
| `type` | string| The type of skill. For **Microsoft.ComputerVision.PersonDistance** this should be `people_distance`.|
| `trigger` | string| The type of trigger for sending an event. Supported values are `event` for sending events when the count changes or `interval` for sending events periodically, irrespective of whether the count has changed or not.
| `interval` | string | A time in seconds that the violations will be aggregated before an event is fired. The aggregation interval is applicable to both `event` and `interval`.|
| `output_frequency` | int | The rate at which events are egressed. When `output_frequency` = X, every X event is egressed, ex. `output_frequency` = 2 means every other event is output. The output_frequency is applicable to both `event` and `interval`.|
| `minimum_distance_threshold` | float| A distance in feet that will trigger a "TooClose" event when people are less than that distance apart.|
| `maximum_distance_threshold` | float| A distance in feet that will trigger a "TooFar" event when people are greater than that distance apart.|

```json
{
"zones":[{
	"name": "distance_zone",
	"polygon": [[0.3,0.3], [0.3,0.9], [0.6,0.9], [0.6,0.3], [0.3,0.3]],
	"threshold": 35.00,
	"events":[{
		"type": "people_distance",
		"config":{
			"trigger": "event",
			"output_frequency":1,
			"minimum_distance_threshold":6.0,
			"maximum_distance_threshold":35.0
      			}
		}]
	}]
}
```

This is an example of a JSON input for the DETECTOR_NODE_CONFIG parameter that configures a **Microsoft.ComputerVision.PersonDistance** zone.

{ 
"gpu_index": 0, 
"do_calibration": true
}

| Name | Type| Description|
|---------|---------|---------|
| `gpu_index` | string| The GPU index on which this skill will run.|
| `do_calibration` | string | Indicates that calibration is turned on. `do_calibration` must be true for **Microsoft.ComputerVision.PersonDistance** to function properly.|

## AI Skill Output
The events from each AI skill are egressed to Azure IoT Hub on JSON format.

```json
{ 
   "events":[ 
      { 
         "id":"75850af10ae14531b1bbbd7a1647433f", 
         "metadataType":"personDistanceEvent", 
         "metadataVersion":"1.0", 
         "metadata":{ 
            "label":"distance_zone", 
            "trigger":"event", 
            "personCount":4, 
            "averageDistance":10.0, 
            "minimumDistanceThreshold":6.0, 
            "maximumDistanceThreshold":35.0, 
            "eventName":"TooClose", 
            "distanceViolationPersonCount":2, 
            "distanceViolationPersonInfo":[ 
               { 
                  "bbox":{ 
                     "width":0.01, 
                     "height":0.02, 
                     "left":0.015, 
                     "top":0.04 
                  }, 
                  "centerGroundPoint":{ 
                     "x":1.0, 
                     "y":1.0 
                  } 
               }, 
               { 
                  "bbox":{ 
                     "width":0.01, 
                     "height":0.02, 
                     "left":0.015, 
                     "top":0.04 
                  }, 
                  "centerGroundPoint":{ 
                     "x":2.0, 
                     "y":2.0 
                  } 
               } 
            ] 
         } 
      } 
   ], 

   "sourceInfo":{ 
      "id":"source_id", 
      "timestamp":"12345", 
      "width":200, 
      "height":100, 
      "cameraCalibrationInfo":{ 
         "status":"Complete", 
         "cameraHeightInFeet":10.0, 
         "focalLengthInPixel":1000.0, 
         "tiltUpAngleInRadian":1.0 
      } 
   } 
} 
```

| Name | Type| Description|
|---------|---------|---------|
| `id` | string| Event id|
| `metadataType` | string| The type of the metadata for this event is 'personDistnaceEvent' |
| `label` | string| The value in "name" field of the "zones" in the SPACEANALYTICS_CONFIG  JSON configuration|
| `trigger` | string| The trigger type is 'event' or 'interval' depending on the value of `trigger` in SPACEANALYTICS_CONFIG|
| `personCount` | int| Number of people detected|
| `distanceViolationPersonCount` | int | Number of people detected in violation of `minimumDistanceThreshold` or `maximumDistanceThreshold` |
| `averageDistance` | float| The average distance between all detected people in feet|
| `minimumDistanceThreshold` | float| The distance in feet that will trigger a "TooClose" event when people are less than that distance apart.|
| `maximumDistanceThreshold` | float| The distance in feet that will trigger a "TooFar" event when people are greater than that distance apart.|
| `eventName` | string| Event name is `tooClose` with the `minimumDistanceThreshold` is violated, `tooFar` when `maximumDistanceThreshold` is violated, or `unknown` when auto-calibration hasn't completed for the skill|
| `distanceViolationPersonInfo` | list| A list of person detection information for each detection that is in violation of `minimumDistanceThreshold` or `maximumDistanceThreshold`|
| `bbox` | 4 float values| Width, height, left, top values with the coordinates of the bounding box indicating where in the frame the person's body was detected.|
| `centerGroundPoint` | 2 float values| `x`, `y` values with the coordinates of the person's inferred location on the ground in feet. `x` is distance from the camera perpendicular to the camera image plane projected on the ground in feet. `y` is distance from the camera parallel to the image plane projected on the ground in feet.|
| `cameraHeightInFeet` | float | The height of the camera above the ground in feet. This is inferred from auto-calibration. |
| `focalLengthInPixel` | float | The focal length of the camera in pixels. This is inferred from auto-calibration. |
| `tiltUpAngleInRadian` | float | The camera tilt angle from vertical. This is inferred from auto-calibration.|

## Enable Video Recording with the Microsoft.ComputerVision.VideoRecorder skill

The **Microsoft.ComputerVision.VideoRecorder** skill enables you to record video as it's being processed by the container. The deployment manifest file at [DeploymentManifest.json](./DeploymentManifest.json) has the configuration needed for the Microsoft.ComputerVision.VideoRecorder skill. The video recording is saved in an Azure Blob Storage that you need to configure. Video recordings are not sent to Microsoft. Disable this skill if you do not want recorded video.

You may use a local Azure Blob Storage module to enable the **Microsoft.ComputerVision.VideoRecorder** skill to save the video and optionally upload video clips to cloud storage. First, deploy the [Azure Blob Storage on IoT Edge](https://docs.microsoft.com/azure/iot-edge/how-to-deploy-blob). The video recording partition may not be mounted automatically. The partition must be mounted to use the video recording feature. We recommend using a separate partition for video recording, to avoid accidentally filling up the main partition. If the main partition is full, the machine may become unstable.


```json
"localblobstorage": {
  "settings": {
      "image": "mcr.microsoft.com/azure-blob-storage:latest",
      "createOptions": "{\"HostConfig\":{\"Binds\":[\"/blobroot:/blobroot\"],\"PortBindings\":{\"11002/tcp\":[{\"HostPort\":\"11002\"}]}}}"
  },
  "type": "docker",
  "env": {
      "LOCAL_STORAGE_ACCOUNT_NAME": {
          "value": "<LBS_ACCOUNT_NAME>"
      },
      "LOCAL_STORAGE_ACCOUNT_KEY": {
          "value": "<LBS_ACCOUNT_KEY>"
      }
  },
  "status": "running",
  "restartPolicy": "always",
  "version": "1.0"
},
"VideoRecorder": {
  "version": 2,
  "enabled": false,
  "skillId": "Microsoft.ComputerVision.VideoRecorder",
  "parameters": {
      "DEVICES_PATH_PARAM": "{\"devices\": {\"<camera id>\": {\"url\": \"<camera url>\",\"format\": \"<video extension>\"}}}",
      "CONNECTION_STRING_PARAM": "DefaultEndpointsProtocol=http;BlobEndpoint=http://localblobstorage:11002/$LBS_ACCOUNT_NAME;AccountName=$LBS_ACCOUNT_NAME;AccountKey=$LBS_ACCOUNT_KEY",
      "CONTAINER_NAME_PARAM": "recordedvideo",
      "DURATION_TIME_PARAM": 1200,
      "SAFE_TIME_PARAM": 60,
      "OUTPUT_PATH_PARAM" : "outputvideo",
      "PUBLIC_KEY_PARAM": ""
  }
}	
```

| Parameter Name | Description|
|---------|---------|
|`DEVICES_PATH_PARAM`| The .json which contains the camera recording info (camera id, camera url, and video extension) |
|`CONNECTION_STRING_PARAM`| The connection string to the blob storage endpoint where the video will be saved |
|`CONTAINER_NAME_PARAM`| The name of the blob storage container where the video will be saved |
|`DURATION_TIME_PARAM`| The duration of each video clip (in seconds) |
|`SAFE_TIME_PARAM`| The time before the current recording ends to start recording the next video clip (in seconds) |
|`OUTPUT_PATH_PARAM`| An identifier for the location where the recorder process temporarily saves video files, and the exporter process monitors. This must be a unique string for each instance of the recorder node deployed in the container. |
|`PUBLIC_KEY_PARAM`| The Blob SAS URL or local path to the public key which the exporter process uses in order to encrypt videos. If this is not provided, videos will not be encrypted |

Use the following Environment Variables:
* LOCAL_STORAGE_ACCOUNT_NAME: Choose a local storage account name.
* LOCAL_STORAGE_ACCOUNT_KEY: Generate a [64-byte base64 key](https://generate.plus/base64?gp_base64_base%5Blength%5D=64). Please make sure to re-generate key once after opening this link and do not select the URL safe option.
 
Paste this in the **Container Create Options**:

```json
{
  "HostConfig": {
    "Binds": [
      "/srv/blobroot:/blobroot"
    ],
    "PortBindings": {
      "11002/tcp": [
        {
          "HostPort": "11002"
        }
      ]
    }
  }
}
```
 
The video recording data will be saved in `/srv/blobroot` as specified in the **Container Create Options** above. You need to provide write access to the blob root folder manually. Run these commands on the **host computer**. See [Granting directory access to container user on Linux](https://docs.microsoft.com/azure/iot-edge/how-to-store-data-blob#granting-directory-access-to-container-user-on-linux) for more information.

```bash
sudo chown -R 11000:11000 /srv/blobroot 
sudo chmod -R 700 /srv/blobroot
```

Add the following in the Module Twin settings for the Project Archon container in Azure IoT Hub and replace the placeholder values:
```json
{
  "deviceAutoDeleteProperties": {
    "deleteOn": <true, false>,
    "deleteAfterMinutes": <delete after minutes>,
    "retainWhileUploading": <true, false>
  },
  "deviceToCloudUploadProperties": {
    "uploadOn": <true, false>,
    "uploadOrder": <"OldestFirst", "NewestFirst">,
    "cloudStorageConnectionString": "<cloud storage connection string>",
    "storageContainersForUpload": {
      "<source container name1>": {
      "target": "<target container name1>"
      }
  },
  "deleteAfterUpload": <true, false>
  }
}
``` 

| Name | Description|
|---------|---------|
|`deleteOn`| This option allows for automatic video deletion after a period of time (automatic clean up). Videos should be (automatically or manually) collected from local blob storage after they are recorded.|
`deleteAfterMinutes`| The videos must be (automatically or manually) collected before this time, or else they will be deleted. | 
`uploadOn` |True if videos should be automatically uploaded to blob storage, False if videos will be manually collected and/or there is no connectivity.|
_cloud storage connection string_ |Replace this with the connection string to the location where videos should be uploaded to (a cloud storage account under your subscription).|
_source container name1_| Replace this with recordedvideo  (or whatever matches the CONTAINER_NAME_PARAM setting in the [DeploymentManifest.json](./DeploymentManifest.json)).|
_target container name1_| Replace this with the target container name.|

## Encryption for video recording

You need a key-pair for encrypting/decrypting video recording. Use `ssh-keygen` to generate key pairs. Do keep the private key in a secure place and supply the public key to the VideoRecorder skill via skill settings.<br>
1.	Save private_key.pem to a safe and secure location, such as an Azure KeyVault with proper access controls. A person who has access to this key will be able to decrypt and view videos recorded by the Microsoft.ComputerVision.VideoRecorder skill.
2.	Upload public_key.pem to a Blob Storage and take note of the blob's SAS url. This URL needs to be updated as the value for the PUBLIC_KEY_PARAM variable in the deployment manifest.<br>

Recorded video files are saved under /<LBS_BLOB_FOLDER>/BlockBlob/blobcontainer/. These are encrypted using the public key and these must be decrypted using the public key before viewing.<br><br>

To start the video recording manually, you need to edit the Module Twin for the container on your Azure IoT Hub and set the VideoRecorder graph state to "enabled": true. To stop the video recording, set the VideoRecorder graph state to "enabled": false.

To start and stop the VideoRecorder skill on a schedule, you can create an  Azure Function that calls into the your Azure IoT Hub and setting the function to run on a schedule.


## Next steps
