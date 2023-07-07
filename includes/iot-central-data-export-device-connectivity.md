---
 title: include file
 description: include file
 services: iot-central
 author: dominicbetts
 ms.service: iot-central
 ms.topic: include
 ms.date: 05/22/2023
 ms.author: dobett
 ms.custom: include file
---

### Device connectivity changes format

Each message or record represents a connectivity event from a single device. Information in the exported message includes:

- `applicationId`: The ID of the IoT Central application.
- `messageSource`: The source for the message - `deviceConnectivity`.
- `messageType`: Either `connected` or `disconnected`.
- `deviceId`:  The ID of the device that was changed.
- `schema`: The name and version of the payload schema.
- `templateId`: The ID of the device template assigned to the device.
- `enqueuedTime`: The time at which this change occurred in IoT Central.
- `enrichments`: Any enrichments set up on the export.
