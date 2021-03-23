You'll use the Azure Video Analyzer on IoT Edge module to detect motion in the incoming live video stream and send events to IoT Hub. To see these events, follow these steps:

1. Open the Explorer pane in Visual Studio Code and look for Azure IoT Hub in the lower-left corner.
1. Expand the **Devices** node.
1. Right-click **ava-sample-device** and select **Start Monitoring Built-in Event Endpoint**.

    ![Start monitoring a built-in event endpoint](../../../media/quickstarts/start-monitoring-iothub-events.png)
    <!-- This location may have changed -->
> [!NOTE]
> You might be asked to provide Built-in endpoint information for the IoT Hub. To get that information, in Azure portal, navigate to your IoT Hub and look for **Built-in endpoints** option in the left navigation pane. Click there and look for the **Event Hub-compatible endpoint** under **Event Hub compatible endpoint** section. Copy and use the text in the box. The endpoint will look something like this:  
    ```
    Endpoint=sb://iothub-ns-xxx.servicebus.windows.net/;SharedAccessKeyName=iothubowner;SharedAccessKey=XXX;EntityPath=<IoT Hub name>
    ```
