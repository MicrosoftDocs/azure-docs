Follow these steps to run the sample code:

1. In Visual Studio Code, go to *src/cloud-to-device-console-app/operations.json*.
1. On the **GraphTopologySet** node, make sure you see the following value:

    `"topologyUrl" : "https://raw.githubusercontent.com/Azure/live-video-analytics/master/MediaGraph/topologies/motion-detection/topology.json"`
1. On the **GraphInstanceSet** and **GraphTopologyDelete**  nodes, ensure that the value of `topologyName` matches the value of the `name` property in the graph topology:

    `"topologyName" : "MotionDetection"`
    
1. Start a debugging session by selecting the F5 key. The **TERMINAL** window will display some messages.
1. The *operations.json* file starts off with calls to `GraphTopologyList` and `GraphInstanceList`. If you cleaned up resources after you finished previous quickstarts, then this process will return empty lists and then pause. To continue, select the Enter key.

    ```
    --------------------------------------------------------------------------
    Executing operation GraphTopologyList
    -----------------------  Request: GraphTopologyList  --------------------------------------------------
    {
        "@apiVersion": "1.0"
    }
    ---------------  Response: GraphTopologyList - Status: 200  ---------------
    {
        "value": []
    }
    --------------------------------------------------------------------------
    Executing operation WaitForInput
    Press Enter to continue
    ```
    
    The **TERMINAL** window shows the next set of direct method calls:
     * A call to `GraphTopologySet` that uses the preceding `topologyUrl`
     * A call to `GraphInstanceSet` that uses the following body:
         
    ```
    {
      "@apiVersion": "1.0",
      "name": "Sample-Graph",
      "properties": {
        "topologyName": "MotionDetection",
        "description": "Sample graph description",
        "parameters": [
          {
            "name": "rtspUrl",
            "value": "rtsp://rtspsim:554/media/camera-300s.mkv"
          },
          {
            "name": "rtspUserName",
            "value": "testuser"
          },
          {
            "name": "rtspPassword",
            "value": "testpassword"
          }
        ]
      }
    }
    ```
     
    * A call to `GraphInstanceActivate` that starts the graph instance and the flow of video.
    * A second call to `GraphInstanceList` that shows that the graph instance is in the running state.
1. The output in the **TERMINAL** window pauses at `Press Enter to continue`. Don't select Enter yet. Scroll up to see the JSON response payloads for the direct methods you invoked.
1. Switch to the **OUTPUT** window in Visual Studio Code. You see messages that the Live Video Analytics on IoT Edge module is sending to the IoT hub. The following section of this quickstart discusses these messages.
1. The media graph continues to run and print results. The RTSP simulator keeps looping the source video. To stop the media graph, return to the **TERMINAL** window and select Enter. 

    The next series of calls cleans up resources:

    * A call to `GraphInstanceDeactivate` deactivates the graph instance.
    * A call to `GraphInstanceDelete` deletes the instance.
    * A call to `GraphTopologyDelete` deletes the topology.
    * A final call to `GraphTopologyList` shows that the list is empty.
