---
author: KishorIoT
ms.author: nandab
ms.service: iot-central
ms.topic: include
ms.date: 06/20/2020
---

## Instantiate the cameras in IoT Central

The **LvaEdgeGatewayModule** instantiates Cameras on the edge. They appear
in IoT Central as first-class citizens and support the twin programing
model.

To create a camera, follow these steps

### Ensure the LVA Edge Gateway has the correct settings

[TODO: I'm not sure where to find this, a screenshot would help. I'm not sure if I'm supposed to go to the device templates or go to the device instance I've created. I'm not sure what "parameters" or "Gateway Instance Id" the doc is referring to.]

Go to the LVA Edge Gateway and select the Manage tab.

You pointed these parameters to this application, but ensure they match.

The Gateway Instance Id, is the Device ID for your LVA Edge Gateway

### Run the Command Add Camera

Go to Devices and select the LVA Edge Gateway, and pick the device instance you created. Select the Command tab, and fill in the following information on the `Add Camera Request` command.

| Field          | Description             | Sample Value            |
|---------|---------|---------|
| Camera Id      | Device ID for provisioning       | 4mca46neku87            |
| Camera Name    | Friendly Name           | Uri's Office            |
| Rtsp Url       | Address of the stream   | For the simulated stream, use the private IP address of the VM as follows: rtsp://10.0.0.4:554/media/rtspvideo.mkv|
|                |                         | For a real Camera find  your streaming options, in our example it is rtsp://192.168.1.64:554/Streaming/Channels/101/ |
| Rtsp Username  |                         | Enter dummy value for the simulated stream    |
| Rtsp password  |                         | Enter dummy value for the simulated stream    |
| Detection Type | Dropdown                | Object Detection        |

### Ensure the camera shows up as a downstream device for the LVA Edge Gateway

[TODO: Document]

### Set the object detection settings for the camera

Navigate to the newly created camera and select setting tab.

Enter detection class and threshold for primary and secondary detection

The class is a string such as person or car,

Optionally, check the auto start box

Save the desire properties

### Start LVA processing

For the same camera navigate to the Commands Tab

Run the Start LVA processing command