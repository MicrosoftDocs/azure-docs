---
title: Understand Device Update for Azure IoT Hub device groups | Microsoft Docs
description: Understand how device groups are used.
author: aysancag
ms.author: aysancag
ms.date: 2/09/2021
ms.topic: conceptual
ms.service: iot-hub-device-update
---

# Device groups

A device group is a collection of devices. Device groups provide a way to scale deployments to many devices. Each device belongs to exactly one device group at a time.
You may choose to create multiple device groups to organize your devices. For example, Contoso might use the "Flighting" device group for the devices in its test laboratory and 
the "Evaluation" device group for the devices that its field team uses in the operations center. Further, Contoso might choose to group their Production devices based on
their geographic regions, so that they can update devices on a schedule that aligns with their regional timezones. 


## Using device or module twin tag for device group creation

Tags enable users to group devices. Devices need to have a ADUGroup key and a value in their device or module twin to allow them to be grouped.

### Device or module twin tag format

```markdown
"tags": {
  "ADUGroup": "<CustomTagValue>"
}
```


## Uncategorized device group

Uncategorized is a reserved word that is used to group devices that:
- Don't have the ADUGroup device or module twin tag.
- Have ADUGroup device or module twin tag but a group is not created with this group name.

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



## Next steps

[Create device group](./create-update-group.md)
