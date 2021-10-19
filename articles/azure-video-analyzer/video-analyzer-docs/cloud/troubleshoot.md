---
title: Troubleshoot Azure Video Analyzer - cloud
description: This article covers troubleshooting steps for Azure Video Analyzer in the cloud.
ms.topic: troubleshooting
ms.date: 07/15/2021
---

# Troubleshoot Video Analyzer in the cloud

This article covers troubleshooting steps for Azure Video Analyzer (AVA).

## Troubleshoot deployment issues

### Diagnostics

As part of your Video Analyzer deployment, you set up Azure resources such as IoT Hub and IoT Edge devices. As a first step to diagnosing problems, always ensure that the Edge device is properly set up by following these instructions:

1. [Run the `check` command](../../../iot-edge/troubleshoot.md#run-the-check-command).
1. [Check your IoT Edge version](../../../iot-edge/troubleshoot.md#check-your-iot-edge-version).
1. [Check the status of the IoT Edge security manager and its logs](../../../iot-edge/troubleshoot.md#check-the-status-of-the-iot-edge-security-manager-and-its-logs).
1. [View the messages that are going through the IoT Edge hub](../../../iot-edge/troubleshoot.md#view-the-messages-going-through-the-iot-edge-hub).
1. [Restart containers](../../../iot-edge/troubleshoot.md#restart-containers).
1. [Check your firewall and port configuration rules](../../../iot-edge/troubleshoot.md#check-your-firewall-and-port-configuration-rules).

### Pre-deployment issues

If the edge infrastructure is fine, you can look for issues with the deployment manifest file. To deploy the Video Analyzer module on the IoT Edge device alongside any other IoT modules, you use a deployment manifest that contains the IoT Edge hub, IoT Edge agent, and other modules and their properties. You can use the following command to deploy the manifest file:

```
az iot edge set-modules --hub-name <iot-hub-name> --device-id avasample-iot-edge-device --content <path-to-deployment_manifest.json>
```

If the JSON code isn't well formed, you might receive the following error:
&nbsp;&nbsp;&nbsp; **Failed to parse JSON from file: '\<deployment manifest.json\>' for argument 'content' with exception: "Extra data: line 101 column 1 (char 5325)"**

If you encounter this error, we recommend that you check the JSON for missing brackets or other issues with the structure of the file. To validate the file structure, you can use a client such as the [Notepad++ with JSON Viewer plug-in](https://riptutorial.com/notepadplusplus/example/18201/json-viewer) or an online tool such as the [JSON Formatter & Validator](https://jsonformatter.curiousconcept.com/).
he inferencing result back to Video Analyzer when ready.

## Next steps

[Overview](../overview.md)
