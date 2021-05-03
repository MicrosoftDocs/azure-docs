---
author: fvneerden
ms.service: azure-video-analyzer
ms.topic: include
ms.date: 03/18/2021
ms.author: faneerde
---

Follow these steps to run the sample code:

1. In Visual Studio Code, open the **Extensions** tab (or press Ctrl+Shift+X) and search for Azure IoT Hub.
1. Right click and select **Extension Settings**.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="../../../media/run-program/extensions-tab.png" alt-text="Extension Settings":::
1. Search and enable “Show Verbose Message”.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="../../../media/run-program/show-verbose-message.png" alt-text="Show Verbose Message":::
1. In Visual Studio Code, go to *src/cloud-to-device-console-app/operations.json*.
1. On the **livePipelineSet** node, make sure you see the following value:

    ```
    "topologyUrl" : "https://raw.githubusercontent.com/Azure/azure-video-analyzer/master/pipelines/live/topologies/motion-detection/1.0/topology.json"
    ```
    
1. On the **livePipelineSet** and **livePipelineDelete**  nodes, ensure that the value of `topologyName` matches the value of the `name` property in the graph topology:

    `"topologyName" : "MotionDetection"`
    
1. Start a debugging session by selecting the F5 key. The **TERMINAL** window will display some messages.
1. The *operations.json* file starts off with calls to `livePipelineTopologyList` and `livePipelineInstanceList`. If you cleaned up resources after you finished previous quickstarts, then this process will return empty lists and then pause. To continue, select the Enter key.

    ```
    --------------------------------------------------------------------------
    Executing operation pipelineTopologyList
    -----------------------  Request: pipelineTopologyList  --------------------------------------------------
    {
      "@apiVersion": "1.0"
    }
    ---------------  Response: pipelineTopologyList - Status: 200  ---------------
    {
      "value": []
    }
    --------------------------------------------------------------------------
    Executing operation WaitForInput
    Press Enter to continue
    ```
    
    The **TERMINAL** window shows the next set of direct method calls:
     * A call to `livePipelineTopologySet` that uses the preceding `topologyUrl`
     * A call to `livePipelineInstanceSet` that uses the following body:
         
    ```
    {
       "@apiVersion": "1.0",
       "name": "Sample-Pipeline-1",
       "properties": {
         "topologyName": "MotionDetection",
         "description": "Sample topology description",
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
     
    * A call to `livePipelineInstanceActivate` that starts the pipeline instance and the flow of video.
    * A second call to `LivePipelineInstanceList` that shows that the pipeline instance is in the running state.
1. The output in the **TERMINAL** window pauses at `Press Enter to continue`. Don't select Enter yet. Scroll up to see the JSON response payloads for the direct methods you invoked.
1. Switch to the **OUTPUT** window in Visual Studio Code. You see messages that the Azure Video Analyzer on IoT Edge module is sending to the IoT hub. The following section of this quickstart discusses these messages.
1. The live pipeline continues to run and print results. The RTSP simulator keeps looping the source video. To stop the live pipeline, return to the **TERMINAL** window and select Enter. 

    The next series of calls cleans up resources:

    * A call to `livePipelineInstanceDeactivate` deactivates the pipeline.
    * A call to `livePipelineInstanceDelete` deletes the pipeline.
    * A call to `livePipelineTopologyDelete` deletes the topology.
    * A final call to `livePipelineTopologyList` shows that the list is empty.
