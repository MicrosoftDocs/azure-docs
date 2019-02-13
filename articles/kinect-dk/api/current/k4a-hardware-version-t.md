---
title: k4a_hardware_version_t structure
description: Structure to define hardware version. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, structure
---
# k4a_hardware_version_t structure

Structure to define hardware version. 

## Syntax

```C
typedef struct {
    k4a_version_t rgb;
    k4a_version_t depth;
    k4a_version_t audio;
    k4a_version_t depth_sensor;
    k4a_firmware_build_t firmware_build;
    k4a_firmware_signature_t firmware_signature;
} k4a_hardware_version_t;
```

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4atypes.h (include k4a/k4a.h) 


## Members

[`k4a_version_t`](~/api/current/k4a-version-t.md) `rgb`

RGB version. 

[`k4a_version_t`](~/api/current/k4a-version-t.md) `depth`

Depth version. 

[`k4a_version_t`](~/api/current/k4a-version-t.md) `audio`

Audio version. 

[`k4a_version_t`](~/api/current/k4a-version-t.md) `depth_sensor`

Depth Sensor. 

[`k4a_firmware_build_t`](~/api/current/k4a-firmware-build-t.md) `firmware_build`

Firmware reported hardware build. 

[`k4a_firmware_signature_t`](~/api/current/k4a-firmware-signature-t.md) `firmware_signature`

Firmware reported signature. 

