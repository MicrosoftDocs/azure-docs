
## AI skills
Project Archon enables the analysis of real-time streaming video from camera devices. For each camera device you configure, the AI skills for detection and tracking people will generate an output stream of JSON messages that are being egressed to your instance of Azure IoT Hub. 

The Project Archon container implements the following AI skills for People Analytics:

| AI skill ID | Description|
|---------|---------|
| Microsoft.ComputerVision.PersonCount | Counts people in a designated zone in the camera's field of view. <br> Emits an initial _personCountEvent_ event and then _personCountEvent_ events when the count changes. |
| Microsoft.ComputerVision.PersonCrossingLine | Tracks when a person crosses a designated line in the camera's field of view. <br>Emits a _personLineEvent_ event when the person crosssed the line and provides directional info. 
| Microsoft.ComputerVision.PersonCrossingPolygon | Tracks when a person crosses a designated line in the camera's field of view. <br> Emits a _personLineEvent_ event when the person crosssed the zone and provides directional info. |
| Microsoft.ComputerVision.PersonCrossingLine.Debug | Same event output as Microsoft.ComputerVision.PersonCrossingLine. Additionally it has debugging capability to visualize the video frames as being processed. You will need to run "xhost +" on the  **host computer** to enable the visualization of the video frames and events. |
Microsoft.ComputerVision.PersonCrossingPolygon.Debug | Same event output as Microsoft.ComputerVision.PersonCrossingPolygon. Additionally it has debugging capability to visualize the video frames as being processed. You will need to run "xhost +" on the  **host computer** to enable the visualization of the video frames and events.|
Microsoft.ComputerVision.VideoRecorder | This skill enables recording of video streams as being processed into an Azure Blob Storage instance you can deploy on the edge or in the cloud. You are in control of where the data is being stored. The data is not transmitted to Microsoft. |

<br>**IMPORTANT NOTE:**  The computer vision AI models detect and locate human presence in video footage and output by using a bounding box around a human body or head. The AI models do not attempt to detect faces or discover the identities or demographics of individuals.<br> 

These are the parameters required by each of these skills.
| AI skill parameters| Description|
|---------|---------|
| skill ID | The AI skill ID from table above.|
| enabled | Boolean: true or false|
| VIDEO_URL| The rtsp url for the camera device(Example: rtsp://username:password@url). Archon supports H.264 encoded stream either through rtsp or http and in case of file format(container format) should be mp4
| VIDEO_SOURCE_ID | A friendly name for the camera device or video stream. This will be returned with the event JSON output.|
| VIDEO_IS_LIVE| True for camera devices; false for recorded videos.|
| TRACKER_NODE_CONFIG | JSON indicating which GPU to run the system on. Should be in the following format: `"{ \"gpu_index\": 0 }",`|
| SPACEANALYTICS_CONFIG | JSON configuration for zone and line as outlined below.|

 ### Zone configuration for Microsoft.ComputerVision.PersonCount
 This is an example of a JSON input for the SPACEANALYTICS_CONFIG parameter that configures a zone. You may configure multiple zone for this AI skill.

```{
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

 ### Line configuration for Microsoft.ComputerVision.PersonCrossingLine
 This is an example of a JSON input for the SPACEANALYTICS_CONFIG parameter that configures a line. You may configure multiple lines for this AI skill.

 ```
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

**IMPORTANT NOTE:** The Microsoft.ComputerVision.PersonCrossingLine detects when the bounding box for a person's head intersects the line. When selecting the line's start and end coordinates, please place the line at a height appropriate for the average person's head and ensure that it covers the entire path where people will pass.

 ### Zone configuration for Microsoft.ComputerVision.PersonCrossingPolygon
This is an example of a JSON input for the SPACEANALYTICS_CONFIG parameter that configures a line. You may configure multiple lines for this AI skill.

 ```
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
| Name | Type| Description|
|---------|---------|---------|
| `zones` | list| List of zones|
| `name` | string| Friendly name for this zone.|
| `polygon` | list| Each value pair represents the x,y for vertices of polygon. The polygon represents the areas in which people are tracked or counted. The float values represent the position of the vertex relative to the top,left corner. To calculate the absolute x, y values, you multiply these values with the frame size. 
| `threshold` | float| Events are egressed when the confidence of the AI models is greater or equal this value. |
| `type` | string| The type of skill. For **Microsoft.ComputerVision.PersonCrossingPolygon** this should be `enter` or `exit`.|
| `trigger`|string|The type of trigger for sending an event<br>Supported Values: "event": fire when someone enters or exits the zone.|

## Camera configuration
Visit this [Companion Tool page](Project-Archon-Camera-Setup.md) to learn how to create zone and line configurations using a visual tool provided with Project Archon.

## AI Skill Output
The events from each AI skill are egressed to Azure IoT Hub on JSON format.

### JSON format for Microsoft.ComputerVision.PersonCount events
Sample JSON for an event output by this skill.
```
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

### JSON format for Microsoft.ComputerVision.PersonCrossingLine detections
Sample JSON for detections output by this skill.
```
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

**IMPORTANT NOTE:**  The AI model detects a person's head irrespective whether the person is facing towards or away from the camera. The AI model doesn't run face detection or recognition and doesn't emit any biometric information. 

### JSON format for Microsoft.ComputerVision.PersonCrossingPolygon detections
Sample JSON for detections output by this skill.
```
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
