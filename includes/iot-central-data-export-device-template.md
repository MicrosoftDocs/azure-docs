---
 title: include file
 description: include file
 services: iot-central
 author: v-krishnag
 ms.service: iot-central
 ms.topic: include
 ms.date: 04/27/2022
 ms.author: v-krishnag
 ms.custom: include file
---

### Device template lifecycle changes format

Each message or record represents one change to a single published device template. Information in the exported message includes:

- `applicationId`: The ID of the IoT Central application.
- `messageSource`: The source for the message - `deviceTemplateLifecycle`.
- `messageType`: Either `created`, `updated`, or `deleted`.
- `schema`: The name and version of the payload schema.
- `templateId`: The ID of the device template assigned to the device.
- `enqueuedTime`: The time at which this change occurred in IoT Central.
- `enrichments`: Any enrichments set up on the export.