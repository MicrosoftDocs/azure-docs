Follow these steps to run the sample code:

1. In Visual Studio Code, open the **Extensions** tab (or press Ctrl+Shift+X) and search for Azure IoT Hub.
1. Right click and select **Extension Settings**.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="../../../media/run-program/extensions-tab.png" alt-text="Extension Settings":::
1. Search and enable “Show Verbose Message”.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="../../../media/run-program/show-verbose-message.png" alt-text="Show Verbose Message":::
1. In Visual Studio Code, go to *src/cloud-to-device-console-app/operations.json*.
1. On the **LivePipelineSet** node, make sure you see the following value:
<!-- I believe we're changing to LivePipelineSet -->
<!-- Below url needs to  be updated to new topology sample-->

    `"topologyUrl" : "https://raw.githubusercontent.com/Azure/live-video-analytics/master/MediaGraph/topologies/motion-detection/2.0/topology.json"`
1. On the **LivePipelineSet** and **LivePipelineDelete**  nodes, ensure that the value of `topologyName` matches the value of the `name` property in the graph topology:

    `"topologyName" : "MotionDetection"`
    
1. Start a debugging session by selecting the F5 key. The **TERMINAL** window will display some messages.
1. The *operations.json* file starts off with calls to `LivePipelineTopologyList` and `LivePipelineInstanceList`. If you cleaned up resources after you finished previous quickstarts, then this process will return empty lists and then pause. To continue, select the Enter key.

    ```
    --------------------------------------------------------------------------
    Executing operation GraphTopologyList
    -----------------------  Request: GraphTopologyList  --------------------------------------------------
    {
        "@apiVersion": "2.0"
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
     * A call to `LivePipelineTopologySet` that uses the preceding `topologyUrl`
     * A call to `LivePipelineInstanceSet` that uses the following body:
         
    ```
    {
      "@apiVersion": "2.0",
      "name": "Sample-LivePipeline",
      "properties": {
        "topologyName": "MotionDetection",
        "description": "Sample LivePipeline description",
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
     
    * A call to `LivePipelineInstanceActivate` that starts the pipeline instance and the flow of video.
    * A second call to `LivePipelineInstanceList` that shows that the pipeline instance is in the running state.
1. The output in the **TERMINAL** window pauses at `Press Enter to continue`. Don't select Enter yet. Scroll up to see the JSON response payloads for the direct methods you invoked.
1. Switch to the **OUTPUT** window in Visual Studio Code. You see messages that the Azure Video Analyzer on IoT Edge module is sending to the IoT hub. The following section of this quickstart discusses these messages.
1. The Live Pipeline continues to run and print results. The RTSP simulator keeps looping the source video. To stop the Live Pipeline, return to the **TERMINAL** window and select Enter. 

    The next series of calls cleans up resources:

    * A call to `LivePipelineInstanceDeactivate` deactivates the pipeline instance.
    * A call to `LivePipelineInstanceDelete` deletes the instance.
    * A call to `LivePipelineTopologyDelete` deletes the topology.
    * A final call to `LivePipelineTopologyList` shows that the list is empty.
