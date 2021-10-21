---
title: Troubleshoot Azure Video - Azure
description: This article covers troubleshooting steps for Azure Video Analyzer service.
ms.topic: troubleshooting
ms.date: 07/15/2021
---

# Troubleshoot Azure Video Analyzer Service


This article covers troubleshooting steps for Azure Video Analyzer (AVA).

## Troubleshoot deployment issues

### Diagnostics

As part of your Video Analyzer deployment, you set up Azure resources such as IoT Hub and IoT Edge devices. As a first step to diagnosing problems, always ensure that the Edge device is properly set up by following these instructions:




### Pre-deployment issues

If the edge infrastructure is fine, you can look for issues with the deployment manifest file. To deploy the Video Analyzer module on the IoT Edge device alongside any other IoT modules, you use a deployment manifest that contains the IoT Edge hub, IoT Edge agent, and other modules and their properties. You can use the following command to deploy the manifest file:


### Post deployment: Direct method error code

1. If you get a status `501 code`, check to ensure that the direct method name is accurate. If the method name and request payload are accurate, you should get results along with success code =200.
1. If the request payload is inaccurate, you will get a status `400 code` and a response payload that indicates error code and message that should help with diagnosing the issue with your direct method call.

   - Checking on reported and desired properties can help you understand whether the module properties have synced with the deployment. If they haven't, you can restart your IoT Edge device.
   - Use the [Direct methods] guide to call a few methods, especially simple ones such as pipelineTopologyList. The guide also specifies expected request and response payloads and error codes. After the simple direct methods are successful, you can be assured that the Video Analyzer IoT Edge module is functionally OK.


1. If the **Specified in deployment** and **Reported by device** columns indicate _Yes_, you can invoke direct methods on the Video Analyzer module. Select the module to go to a page where you can check the desired and reported properties and invoke direct methods. Keep in mind the following:

### Post deployment: Diagnose logs for issues during the run

The container logs for your IoT Edge module should contain diagnostics information to help debug your issues during module runtime. You can [check container logs for issues]

## Common error resolutions

Video Analyzer is deployed as an IoT Edge module on the IoT Edge device, and it works collaboratively with the IoT Edge agent and hub modules. Some of the common errors that you'll encounter with the Video Analyzer deployment are caused by issues with the underlying IoT infrastructure. The errors include:




If there are any additional issues that you may need help with, please **[collect logs and submit a support ticket](#collect-logs-for-submitting-a-support-ticket)**. You can also reach out to us by sending us an email at **[amshelp@microsoft.com](mailto:amshelp@microsoft.com)**.


### Collect logs for submitting a support ticket

When self-guided troubleshooting steps don't resolve your problem, go the Azure portal and [open a support ticket](../../../azure-portal/supportability/how-to-create-azure-support-request.md).

> [!WARNING]
> The logs may contain personally identifiable information (PII) such as your IP address. All local copies of the logs will be deleted as soon as we complete examining them and close the support ticket.




   1. Attach the _debugLogs.zip_ file to the support ticket.


### Configure Video Analyzer module to collect Verbose Logs

Configure your Video Analyzer module to collect Verbose logs by setting the `logLevel` and `logCategories` as follows:

```
"logLevel": "Verbose",
"logCategories": "Application,Events,MediaPipeline",
```


## Next steps

Tutorial: Event-based video recording to cloud and playback from cloud - ToDo
