---
title: Using multiple steps for Updates with Device Update for Azure IoT Hub| Microsoft Docs
description: Using multiple steps for Updates with Device Update for Azure IoT Hub
author: ValOlson
ms.author: valls
ms.date: 11/12/2021
ms.topic: conceptual
ms.service: iot-hub-device-update
---

# Multi-Step Ordered Execution
Based on customer requests we have added the ability to run pre-install and post-install tasks when deploying an over-the-air update. This capability is called Multi-Step Ordered Execution (MSOE) and is part of the Public Preview Refresh Update Manifest v4 schema.  

See the [Update Manifest](update-manifest.md) documentation before reviewing the following changes as part of the Public Preview Refresh release.

With MSOE we have introduced are two types of Steps:

- Inline Step (Default)
- Reference Step

Example Update Manifest with one Inline Step:

```json
{
    "updateId": {...},
    "isDeployable": true,
    "compatibility": [
        {
            "deviceManufacturer": "du-device",
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

Example Update Manifest with two Inline Steps:

```json
{
    "updateId": {...},
    "isDeployable": true,
    "compatibility": [
        {
            "deviceManufacturer": "du-device",
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

Example Update Manifest with one Reference Step:

- Parent Update

```json
{
    "updateId": {...},
    "isDeployable": true,
    "compatibility": [
        {
            "deviceManufacturer": "du-device",
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
            "provider": "DU-Client-Eng",
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

Currently, a `Child Update` must not contain any reference steps. This restriction is validated at import time and if not followed the import will fail.

### Inline Step In Parent Update

Inline step(s) specified in `Parent Update` will be applied to the Host Device. Here the ADUC_WorkflowData object that is passed to a Step Handler (also known as Update Content Handler) and it will not contain the `Selected Components` data. The handler for this type of step should *not* be a `Component-Aware` handler.  

> [!NOTE]
> See [Steps Content Handler](https://github.com/Azure/iot-hub-device-update/tree/main/src/content_handlers/steps_handler/README.md) and [Implementing a custom component-Aware Content Handler](https://github.com/Azure/iot-hub-device-update/tree/main/docs/agent-reference/how-to-implement-custom-update-handler.md) for more details.

### Reference Step In Parent Update

Reference step(s) specified in `Parent Update` will be applied to the component on or components connected to the Host Device. A **Reference Step** is a step that contains update identifier of another Update, called as a `Child Update`.  When processing a Reference Step, the Steps Handler will download a Detached Update Manifest file specified in the Reference Step data, then validate the file integrity.

Next, the Steps Handler will parse the Child Update Manifest and create ADUC_Workflow object (also known as Child Workflow Data) by combining the data from Child Update Manifest and File URLs information from the Parent Update Manifest.  This Child Workflow Data also has a 'level' property set to '1'.

> [!NOTE]
> For Update Manfiest version v4, the Child Udpate cannot contain any Reference Steps.

## Detached Update Manifest

To avoid deployment failure because of IoT Hub Twin Data Size Limits, any large Update Manifest will be delivered in the form of a JSON data file, also called as a 'Detached Update Manifest'.

If an update with large content is imported into Device Update for IoT Hub, the generated Update Manifest will contain another payload file called `Detached Update Manifest`, which contains the full data of the Update Manifest.

The `UpdateManifest` property in the Device or Module Twin will contain the Detached Update Manifest file information.

When processing PnP Property Changed Event, the Device Update Agent will automatically download the Detached Update Manifest file, and create ADUC_WorkflowData object that contains the full Update Manifest data.

 
