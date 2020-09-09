> [!div class="mx-imgBorder"]
> :::image type="content" source="../../../media/quickstarts/overview-qs4.svg" alt-text="Signals flow":::

The preceding diagram shows how the signals flow in this quickstart. [An edge module](https://github.com/Azure/live-video-analytics/tree/master/utilities/rtspsim-live555) simulates an IP camera that hosts a Real-Time Streaming Protocol (RTSP) server. An [RTSP source](../../../media-graph-concept.md#rtsp-source) node pulls the video feed from this server and sends video frames to the [motion detection processor](../../../media-graph-concept.md#motion-detection-processor) node. The RTSP source sends the same video frames to a [signal gate processor](../../../media-graph-concept.md#signal-gate-processor) node, which remains closed until it's triggered by an event.

When the motion detection processor detects motion in the video, it sends an event to the signal gate processor node, triggering it. The gate opens for the configured duration of time, sending video frames to the [file sink](../../../media-graph-concept.md#file-sink) node. This sink node records the video as an MP4 file on the local file system of your edge device. The file is saved in the configured location.

In this quickstart, you will:

1. Create and deploy the media graph.
1. Interpret the results.
1. Clean up resources.
