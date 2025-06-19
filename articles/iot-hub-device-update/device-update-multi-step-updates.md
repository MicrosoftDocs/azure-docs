---
title: Azure Device Update for IoT Hub multistep ordered execution
description: Learn about using multiple steps to execute preinstall and postinstall tasks when you deploy over-the-air updates with Device Update for Azure IoT Hub.
author: SoniaLopezBravo
ms.author: sonialopez
ms.date: 01/15/2025
ms.topic: concept-article
ms.service: azure-iot-hub
ms.subservice: device-update
---

# Multistep ordered execution

Multistep ordered execution in Azure Device Update for IoT Hub lets you run preinstall and postinstall tasks when you deploy an over-the-air update. This capability is part of the Device Update update manifest schema version 4. For more information, see [Device Update update manifest](update-manifest.md).

Multistep ordered execution can have two types of steps, *inline steps* and *reference steps*. An inline step is an instruction that executes code and is the default type. A reference step is a step that contains an identifier for another update.

## Parent updates and child updates

When an update manifest references another update manifest, the top-level manifest is called the *parent update*, and the manifest specified in the reference step is called a *child update*. A child update can't contain any reference steps, only inline steps. Device Update validates this restriction at import time and fails the update if it isn't met.

### Inline steps in a parent update

The Device Update agent applies inline steps specified in a parent update to the host device. The `ADUC_WorkflowData` object that passes to the step handler, also called an update content handler, doesn't contain any `Selected Components` data. The handler for this type of step shouldn't be a `Component-Aware` handler.

The Device Update agent's step content handler applies `IsInstalled` validation logic for each step. The step handler checks to see if the update is already installed by checking whether `IsInstalled()` returns result code `900`, or true, and uses this result to determine whether to perform the step. To avoid reinstalling an update that's already on the device, the Device Update agent skips future steps if an update is already installed.

To report an update result, write the result of a step handler execution to the `ADUC_Result` struct in a desired result file as specified in the `--result-file` option. Based on results of the execution, return `0` for success and return `-1` or `0xFF` for fatal errors.

For more information, see [Step handlers](https://github.com/Azure/iot-hub-device-update/tree/main/src/extensions/step_handlers) and [How to implement a custom component-aware content handler](https://github.com/Azure/iot-hub-device-update/tree/main/docs/agent-reference/how-to-implement-custom-update-handler.md).

### Reference steps in a parent update

The Device Update agent applies reference steps specified in a parent update to components on, or connected to, the host device. When it processes a reference step, the step handler downloads a detached update manifest file specified in the step, and validates the file integrity.

The step handler then parses the child update manifest and creates an `ADUC_Workflow` object, also called child workflow data, by combining the data from the child update manifest and file URL information from the parent update manifest. This child workflow data has a `level` property set to `1`.

## Examples

The following example update manifest has one inline step:

```json
{
    "updateId": {...},
    "isDeployable": true,
    "compatibility": [
        {
            "manufacturer": "du-device",
            "model": "e2e-test"
        }
    ],
    "instructions": {
        "steps": [
            {
                "description": "Example APT update that installs libcurl4-doc on a host device.",
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

The following example update manifest has two inline steps:

```json
{
    "updateId": {...},
    "isDeployable": true,
    "compatibility": [
        {
            "manufacturer": "du-device",
            "model": "e2e-test"
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

The following parent update manifest has one reference step that references a child update:

  ```json
  {
      "updateId": {...},
      "isDeployable": true,
      "compatibility": [
          {
              "manufacturer": "du-device",
              "model": "e2e-test"
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

The child update contains inline steps.

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
                  "description": "Cameras Update - preinstall step",
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
                  "description": "Cameras Update - postinstall step",
                  "handler": "microsoft/script:1",
                  "files": [
                      "contoso-camera-installscript.sh"
                  ],
                  "handlerProperties": {
                      "scriptFileName": "contoso-camera-installscript.sh",
                      "arguments": "--post-install-sim-success --component-name --component-name-val --component-group --component-group-val --component-prop path --component-prop-val path",
                      "installedCriteria": "contoso-virtual-camera-1.2-step-2"
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

> [!NOTE]
> If you use `installedCriteria` to determine whether or not the step should execute, you should give each step a different `installedCriteria` value in the update manifest.

## Detached update manifests

To avoid deployment failure because of Azure IoT Hub twin data size limits, Device Update delivers large update manifests to devices as JSON data files called *detached update manifests*. When you import a large content update into Device Update, the generated update manifest contains another payload file called `Detached Update Manifest`, which contains the full update manifest data.

The `UpdateManifest` property in the device or module twin contains the detached update manifest file information. When it processes the PnP `PropertyChanged` event, the Device Update agent automatically downloads the detached update manifest file and creates an `ADUC_WorkflowData` object that contains the full update manifest data.

## Related content

- [Device Update update manifest](update-manifest.md)
- [Device Update and IoT Plug and Play](device-update-plug-and-play.md)
