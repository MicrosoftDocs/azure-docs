---
title: Using multiple steps for Updates with Device Update for Azure IoT Hub
description: Using multiple steps for Updates with Device Update for Azure IoT Hub
author: kgremban
ms.author: kgremban
ms.date: 11/12/2021
ms.topic: concept-article
ms.service: iot-hub-device-update
---

# Multi-step ordered execution

Multi-step ordered execution gives you the ability to run pre-install and post-install tasks when deploying an over-the-air update. This capability is part of the Public Preview Refresh Update Manifest v4 schema.  

See the [Update Manifest](update-manifest.md) documentation before reviewing the following changes as part of the public preview refresh release.

With multi-step ordered execution there are two types of steps:

- Inline step (default)
- Reference step

An example update manifest with one inline step:

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

An example update manifest with two inline steps:

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

An example update manifest with one reference step:

- The parent update that references a child update

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

- The child update with inline steps

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

> [!NOTE]
> In the [update manifest](update-manifest.md), each step should have a different **installedCriteria** string if that string is being used to determine whether the step should be performed or not.

## Parent updates and child updates

When update manifests reference each other, the top-level manifest is called the **parent update** and a manifest specified in a reference step is called a **child update**.  

Currently, a child update can't contain any reference steps. This restriction is validated at import time and if not followed the import will fail.

### Inline steps in a parent update

Inline step(s) specified in a parent update are applied to the host device. Here the ADUC_WorkflowData object that is passed to a step handler (also known as an update content handler) and it will not contain the `Selected Components` data. The handler for this type of step should *not* be a `Component-Aware` handler.

The steps content handler applies **IsInstalled** validation logic for each step. The Device Update agent’s step handler checks to see if particular update is already installed by checking whether IsInstalled() resulted in a result code “900” which means ‘true’. If an update is already installed, to avoid reinstalling an update that is already on the device, the DU agent will skip future steps because we use it to determine whether to perform the step or not.

To report an update result, the result of a step handler execution must be written to ADUC_Result struct in a desired result file as specified in --result-file option. Then based on results of the execution, for success return 0, for any fatal errors return -1 or 0xFF.

For more information, see [Steps content handler](https://github.com/Azure/iot-hub-device-update/tree/main/src/extensions/step_handlers) and [Implementing a custom component-aware content handler](https://github.com/Azure/iot-hub-device-update/tree/main/docs/agent-reference/how-to-implement-custom-update-handler.md).

### Reference steps in a parent update

Reference step(s) specified in a parent update are applied to components on or connected to the host device. A **reference step** is a step that contains update identifier of another update, called a child update.

When processing a reference step, the steps handler downloads a detached update manifest file specified in the reference step data, then validates the file integrity. Next, the steps handler parses the child update manifest and creates an **ADUC_Workflow** object (also known as child workflow data) by combining the data from the child update manifest and file URLs information from the parent update manifest.  This child workflow data also has a 'level' property set to '1'.

> [!NOTE]
> Currently, child updates can't contain any reference steps.

## Detached update manifests

To avoid deployment failure because of IoT Hub twin data size limits, any large update manifest will be delivered in the form of a JSON data file, also called a **detached update manifest**.

If an update with large content is imported into Device Update for IoT Hub, the generated update manifest will contain another payload file called `Detached Update Manifest`, which contains the full data of the Update Manifest.

The `UpdateManifest` property in the device or module twin will contain the detached update manifest file information.

When processing PnP property changed event, the Device Update agent will automatically download the detached update manifest file and create an ADUC_WorkflowData object that contains the full update manifest data.
