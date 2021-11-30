---
title: Using Multiple Steps for Updates with Device Update for Azure IoT Hub| Microsoft Docs
description: Using Multiple Steps for Updates with Device Update for Azure IoT Hub
author: ValOlson
ms.author: valls
ms.date: 11/12/2021
ms.topic: conceptual
ms.service: iot-hub-device-update
---

# Muti-Step Updates
Using Multiple Steps for Updates with Device Update for Azure IoT Hub

Please see the [Update Manifest](update-manifest.md) documentation before reviewing the following changes as part of the Public Preview Refresh release.

## Multi-Step Ordered Execution (MSOE) Support

Based on many Public Preview customers' requests for the ability to run pre-install and post-install tasks, a new feature called Multi-Step Ordered Execution (MSOE) has been added to Device Update platform. The MSOE data is part of the Update Manifest v4 schema.  

There are 2 types of Steps:

- Inline Step
- Reference Step

Example Update Manifest with 1 Inline Step:

```json
{
    "updateId": {...},
    "isDeployable": true,
    "compatibility": [
        {
            "deviceManufacturer": "adu-device",
            "deviceModel": "e2e-test"
        }
    ],
    "instructions": {
        "steps": [
            {
                "description": "Example APT update that install libcurl4-doc on a host device.",
                "handler": "microsoft/apt:1",
                "files": [
                    "apt-manifest-1.0.json"
                ],
                "handlerProperties": {
                    "installedCriteria": "apt-update-test-1.0"
                }
            }
        ]
    },
    "manifestVersion": "4.0",
    "importedDateTime": "2021-11-16T14:54:55.8858676Z",
    "createdDateTime": "2021-11-16T14:50:47.3511877Z"
}
```

Example Update Manifest with 2 Inline Steps:

```json
{
    "updateId": {...},
    "isDeployable": true,
    "compatibility": [
        {
            "deviceManufacturer": "adu-device",
            "deviceModel": "e2e-test"
        }
    ],
    "instructions": {
        "steps": [
            {
                "description": "Install libcurl4-doc on host device",
                "handler": "microsoft/apt:1",
                "files": [
                    "apt-manifest-1.0.json"
                ],
                "handlerProperties": {
                    "installedCriteria": "apt-update-test-2.2"
                }
            },
            {
                "description": "Install tree on host device",
                "handler": "microsoft/apt:1",
                "files": [
                    "apt-manifest-tree-1.0.json"
                ],
                "handlerProperties": {
                    "installedCriteria": "apt-update-test-tree-2.2"
                }
            }
        ]
    },
    "manifestVersion": "4.0",
    "importedDateTime": "2021-11-16T20:21:33.6514738Z",
    "createdDateTime": "2021-11-16T20:19:29.4019035Z"
}
```

Example Update Manifest with 1 Reference Step:

- Parent Update

```json
{
    "updateId": {...},
    "isDeployable": true,
    "compatibility": [
        {
            "deviceManufacturer": "adu-device",
            "deviceModel": "e2e-test"
        }
    ],
    "instructions": {
        "steps": [
            {
                "type": "reference",
                "description": "Cameras Firmware Update",
                "updateId": {
                    "provider": "contoso",
                    "name": "virtual-camera",
                    "version": "1.2"
                }
            }
        ]
    },
    "manifestVersion": "4.0",
    "importedDateTime": "2021-11-17T07:26:14.7484389Z",
    "createdDateTime": "2021-11-17T07:22:10.6014567Z"
}
```

- Child Update

```json
{
    "updateId": {
        "provider": "contoso",
        "name": "virtual-camera",
        "version": "1.2"
    },
    "isDeployable": false,
    "compatibility": [
        {
            "group": "cameras"
        }
    ],
    "instructions": {
        "steps": [
            {
                "description": "Cameras Update - pre-install step",
                "handler": "microsoft/script:1",
                "files": [
                    "contoso-camera-installscript.sh"
                ],
                "handlerProperties": {
                    "scriptFileName": "contoso-camera-installscript.sh",
                    "arguments": "--pre-install-sim-success --component-name --component-name-val --component-group --component-group-val --component-prop path --component-prop-val path",
                    "installedCriteria": "contoso-virtual-camera-1.2-step-0"
                }
            },
            {
                "description": "Cameras Update - firmware installation (failure - missing file)",
                "handler": "microsoft/script:1",
                "files": [
                    "contoso-camera-installscript.sh",
                    "camera-firmware-1.1.json"
                ],
                "handlerProperties": {
                    "scriptFileName": "missing-contoso-camera-installscript.sh",
                    "arguments": "--firmware-file camera-firmware-1.1.json --component-name --component-name-val --component-group --component-group-val --component-prop path --component-prop-val path",
                    "installedCriteria": "contoso-virtual-camera-1.2-step-1"
                }
            },
            {
                "description": "Cameras Update - post-install step",
                "handler": "microsoft/script:1",
                "files": [
                    "contoso-camera-installscript.sh"
                ],
                "handlerProperties": {
                    "scriptFileName": "contoso-camera-installscript.sh",
                    "arguments": "--post-install-sim-success --component-name --component-name-val --component-group --component-group-val --component-prop path --component-prop-val path",
                    "installedCriteria": "contoso-virtual-camera-1.2-stop-2"
                }
            }
        ]
    },
    "referencedBy": [
        {
            "provider": "ADU-Client-Eng",
            "name": "MSOE-Update-Demo",
            "version": "3.1"
        }
    ],
    "manifestVersion": "4.0",
    "importedDateTime": "2021-11-17T07:26:14.7376536Z",
    "createdDateTime": "2021-11-17T07:22:09.2232968Z",
    "etag": "\"ad7a553d-24a8-492b-9885-9af424d44d58\""
}
```

## Parent Update vs. Child Update

For Public Preview Refresh, we will refer to the top-level Update Manifest as `Parent Update` and refer to an Update Manifest specified in a Reference Step as `Child Update`.  

Currently, a `Child Update` must not contain any Reference Steps. This restriction is validate at import time. If violated, the import will fail.

### Inline Step In Parent Update

Inline step(s) specified in `Parent Update` will be applied to the Host Device. Here the ADUC_WorkflowData object that is passed to a Step Handler (aka. Update Content Handler) will not contains a `Selected Components` data. The handler for this type of step should not be a `Component-Aware` handler.  

> **Note** | See [Steps Content Handler](../../src/content_handlers/steps_handler/README.md) and [Implementing a Component-Aware Content Handler](./how-to-implement-custom-update-handler.md#implementing-a-component-aware-content-handler) for more details.

### Reference Step In Parent Update

Reference step(s) specified in `Parent Update` will be applied to the component on or components connected to the Host Device. A **Reference Step** is a step that contains update identifier of another Update, called `Child Update`.  When processing a Reference Step, Steps Handler will download a Detached Update Manifest file specified in the Reference Step data, then validate the file integrity.

Next, the Steps Handler will parse the Child Update Manifest and create ADUC_Workflow object (aka. Child Workflow Data) by combining the data from Child Update Manifest and File URLs information from the Parent Update Manifest.  This Child Workflow Data also has a 'level' property set to '1'.

> Note: for Update Manfiest version v4, the Child Udpate cannot contain any Reference Steps.

## Detached Update Manifest

To avoid deployment failure due to IoT Hub Twin Data Size Limit, any large Update Manifest will be delivered in a form of JSON data file, called 'Detached Update Manifest'.

If an update with large content is imported into Device Update for IoT Hub, the generated Update Manifest will contain an additional payload file called `Detached Update Manifest` which contians a full data of the Update Manifest.

The `UpdateManifest` property in the Device or Module Twin will contains the Detached Update Manifest file information.

When processing PnP Property Changed Event, Device Update Agent will automatically download the Detached Update Manifest file, and create ADUC_WorkflowData object that contain the full Update Manifest data.

 
