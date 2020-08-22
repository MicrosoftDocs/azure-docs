1. Start a debugging session by selecting the F5 key. The **TERMINAL** window prints some messages.
1. The *operations.json* code calls the direct methods `GraphTopologyList` and `GraphInstanceList`. If you cleaned up resources after previous quickstarts, then this process will return empty lists and then pause. Select the Enter key.
    
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
  
  * A call to `GraphTopologySet` that uses the `topologyUrl` 
  * A call to `GraphInstanceSet` that uses the following body:
  
  ```
  {
    "@apiVersion": "1.0",
    "name": "Sample-Graph",
    "properties": {
      "topologyName": "EVRToFilesOnMotionDetection",
      "description": "Sample graph description",
      "parameters": [
        {
          "name": "rtspUrl",
          "value": "rtsp://rtspsim:554/media/lots_015.mkv"
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
  * A second call to `GraphInstanceList` that shows that the graph instance is in the running state  .
1. The output in the **TERMINAL** window pauses at `Press Enter to continue`. Don't select Enter yet. Scroll up to see the JSON response payloads for the direct methods that you invoked.
1. Switch to the **OUTPUT** window in Visual Studio Code. You see the messages that the Live Video Analytics on IoT Edge module is sending to the IoT hub. The following section of this quickstart discusses these messages.
1. The media graph continues to run and print results. The RTSP simulator keeps looping the source video. To stop the media graph, return to the **TERMINAL** window and select Enter. 

    The next series of calls cleans up the resources:

    * A call to `GraphInstanceDeactivate` deactivates the graph instance.
    * A call to `GraphInstanceDelete` deletes the instance.
    * A call to `GraphTopologyDelete` deletes the topology.
    * A final call to `GraphTopologyList` shows that the list is now empty.
