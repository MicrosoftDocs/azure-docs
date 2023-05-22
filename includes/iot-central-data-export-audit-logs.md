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

### Audit log format

Each audit log message represents a user-initiated change to an auditable entity inside the IoT Central application. Information in the exported message includes:

- `actor`: Information about the user who modified the entity.
- `applicationId`: The ID of the IoT Central application.
- `messageSource`: The source for the message - `audit`.
- `messageType`: The type of change that occurred. One of: `updated`, `created`, `deleted`.
- `updated`: Only present if `messageType` is `updated`. Provides more detail about the update.
- `resource`: Details of the modified entity.
- `schema`: The name and version of the payload schema.
- `deviceId`:  The ID of the device that was changed.
- `enqueuedTime`: The time at which this change occurred in IoT Central.
- `enrichments`: Any enrichments set up on the export.
