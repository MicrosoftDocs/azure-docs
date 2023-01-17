---
title: How to configure the DMI Decoder
description: Learn how to configure your DMI decoder on your device, or use other alternatives. 
ms.date: 12/22/2022
ms.topic: how-to
---

# DMI Decoder configurations

This article explains how to configure the DMI decoder, and alternative configurations for devices that do not support it.

## Overview

The Microsoft Defender for IoT **Device inventory** provides an overview of all IoT devices in your environment. The device inventory table can be customized to your preferences by adding or removing information fields, and filtering the fields.

The DMI decoder is used to retrieve data on the hardware and firmware of the device.

Retrieved fields are:

- Firmware vendor
- Firmware version
- Hardware model
- Hardware serial number
- Hardware vendor

For more information on the DMI Decoder, see [dmidecode(8): DMI table decoder - Linux man page (die.net)](https://nam06.safelinks.protection.outlook.com/?url=https%3A%2F%2Flinux.die.net%2Fman%2F8%2Fdmidecode&data=05%7C01%7Cmiashapan%40microsoft.com%7C07f0384fdcf14dd8cdb808dae0be41a4%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C638069405000113003%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C3000%7C%7C%7C&sdata=%2FSFH0ALDDf6OPMsXW99gEP%2Bvu%2F1eIXyunIQth682NbQ%3D&reserved=0).

## Populate SMBIOS tables for dmidecode

To support dmidecode(8), SMBIOS tables needs to be present and valid.
To implement, please refer to the [System Management BIOS specifications](https://lwn.net/Articles/451967/).

## Alternative configurations

For devices that do not support the DMI decoder, there are two alternative options for retrieving and setting the firmware and hardware fields:

- [JSON file](#json-file)
- [Module twin configurations](#module-twin-configurations)

### JSON file

To manually set the values on the device, create a JSON file. The micro agent will read the values from the JSON file and send them to the cloud.

To configure the file, use the following path and format details:

- Path:

    ```bash
        /etc/defender_iot_micro_agent/sysinfo.json
    ```

- Format:

    ```bash
        "HardwareVendor": "<hardware vendor>", 
        "HardwareModel": "<hardware model>",
        "HardwareSerialNumber": "<hardware serial number>", 
        "FirmwareVendor": "<firmware vendor>", 
        "FirmwareVersion": "<firmware version>"
    ```

### Module twin configurations

To manually set the values on the cloud, use the module twin configuration by setting the following properties:

```bash
    “properties”:{
        “desired”:{
                    “SystemInformation_HardwareVendor”: ”<data>”,
                    “SystemInformation_HardwareModel”: ”<data>”,
                    “SystemInformation_FirmwareVendor”: ”<data>”,
                    “SystemInformation_ FirmwareVersion”: ”<data>”,
                    “SystemInformation_HardwareSerialNumber”: ”<data>”
        }
    }              
```

## Next steps

> [Configure Microsoft Defender for IoT agent-based solution](tutorial-configure-agent-based-solution.md)

> [Configure pluggable Authentication Modules (PAM) to audit sign-in events (Preview)](configure-pam-to-audit-sign-in-events.md)
