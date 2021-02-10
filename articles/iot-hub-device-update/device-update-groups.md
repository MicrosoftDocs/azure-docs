---
title: Understand Device Update for IoT Hub Device Groups | Microsoft Docs
description: Understand how Device Groups are used.
author: aysancag, vimeht
ms.author: aysancag, vimeht
ms.date: 2/09/2021
ms.topic: conceptual
ms.service: iot-hub-device-update
---

# Device Groups

A device group is a collection of devices. Device groups provide a way to scale deployments to many devices. Each device belongs to exactly one device group at a time.
You may choose to create multiple device groups to organize your devices. For example, Contoso might use the "Flighting" group for the devices in its test laboratory and 
the "Evaluation" group for the devices that its field team uses in the operations center. Further, Contoso might choose to group their Production devices based on
their geographic regions, so that they can update devices on a schedule that aligns with their regional timezones. 

Device twin tags are used to group devices. Devices need to have a ADUGroup key and a value in their device twin to belong to a group.

### Device Twin Tag Format

```markdown
"tags": {
  "ADUGroup": "<CustomTagValue>"
}
```


## Uncategorized Group

Uncategorized is a reserved word that is used to group devices that:
- don't have ADUGroup device twin tag.
- have ADUGroup device twin tag but a group is not created with this group name.

For example consider the devices with their device twin tags below:

```markdown
"deviceId": "Device1",
"tags": {
  "ADUGroup": "Group1"
}
```

```markdown
"deviceId": "Device2",
"tags": {
  "ADUGroup": "Group1"
}
```

```markdown
"deviceId": "Device3",
"tags": {
  "ADUGroup": "Group2"
}
```

```markdown
"deviceId": "Device4",
```

Below are the devices and the possible groups that can be created for them.

|Device	|Group  |
|-----------|--------------|
|Device1	|Group1|
|Device2	|Group1|
|Device3	|Group2|
|Device4	|Uncategorized|



[Create Update Group](./create-update-group.md) provides step-by-step instructions for creating device groups.
