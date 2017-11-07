---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Deploy modules for Azure IoT Edge | Microsoft Docs 
description: Learn about how modules get deployed to edge devices
services: iot-edge
keywords: 
author: kgremban
manager: timlt

ms.author: kgremban
ms.date: 10/05/2017
ms.topic: article
ms.service: iot-edge

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.devlang:devlang-from-white-list
# ms.suite: 
# ms.tgt_pltfrm:
# ms.reviewer:
---

# Understand IoT Edge deployments for single devices or at scale

Azure IoT Edge devices follow a [device lifecycle][lnk-lifecycle] that is similar to other types of IoT devices:

1. IoT Edge devices are provisioned, which involves imaging a device with an OS and installing the [IoT Edge runtime][lnk-runtime].
1. The devices are configured to run [IoT Edge modules][lnk-modules], and then monitored for health. 
1. Finally, devices may be retired when they are replaced or become obsolete.  

This article focuses on the configuration and monitoring stages, collectively referred to as IoT Edge deployments. The overall deployment steps are as follows:   

1. An operator defines a deployment that describes a set of modules as well as the target devices. Each deployment has a deployment manifest that reflects this information. 
1. The IoT Hub service communicates with all targeted devices to configure them with the desired modules. 
1. The IoT Hub service retrieves status from the IoT Edge devices and surfaces those for the operator to monitor.  For example, an operator can see when an Edge device is not configured successfully or if a module fails during runtime. 
1. At any time, new IoT Edge devices that meet the targeting conditions are configured for the deployment. For example, a deployment that targets all IoT Edge devices in Washington State automatically configures a new IoT Edge device once it is provisioned and added to the Washington State device group. 
 
This article walks through each component involved in configuring and monitoring a deployment. For a walkthrough of creating and updating a deployment, see [Deploy and monitor IoT Edge modules at scale][lnk-howto].

## Deployment

A deployment assigns IoT Edge module images to run as instances on a targeted set of IoT Edge devices. It works by configuring an IoT Edge deployment manifest to include a list of modules with the corresponding initialization parameters. A deployment can be assigned to a single device (usually based on Device Id) or to a group of devices (based on tags). Once an IoT Edge device receives a deployment manifest, it downloads and installs the module container images from the respective container repositories, and configures them accordingly. Once a deployment is created, an operator can monitor the deployment status to see whether targeted devices are correctly configured.   

Devices need to be provisioned as IoT Edge devices to be configured with a deployment. The following are prerequisites, and are not included in the deployment:
* The base operating system
* Docker 
* Provisioning of the IoT Edge runtime 

### Deployment manifest

A deployment manifest is a JSON document that describes the modules to be configured on the targeted IoT Edge devices. It contains the configuration metadata for all the modules, including the required system modules (specifically the IoT Edge agent and IoT Edge hub).  

The configuration metadata for each module includes: 
* Version 
* Type 
* Status (e.g. Running or Stopped) 
* Re-start policy 
* Image and container repository 
* Routes for data input and output 

### Target condition

Targeting conditions specify whether an IoT Edge device should be under the scope of a deployment. Targeting conditions are based on device twin tags. 

### Priority

A priority defines whether a deployment should be applied to a targeted device relative to other deployments. A deployment priority is a positive integer, with larger numbers denoting higher priority. If an IoT Edge device is targeted by more than one deployment, the deployment with the highest priority applies.  Deployments with lower priorities are not applied, nor are they merged.  If a device is targeted with two or more deployments with equal priority, the most recently created deployment (determined by the creation timestamp) applies.

### Labels 

Labels are string key/value pairs that you can use to filter and group of deployments. A deployment may have multiple labels. Labels are optional and do no impact the actual configuration of IoT Edge devices. 

### Dep

<!-- Links -->
[lnk-lifecycle]: ../iot-hub/iot-hub-device-management-overview.md
[lnk-runtime]: iot-edge-runtime.md
[lnk-modules]: iot-edge-modules.md
[lnk-howto]: how-to-deploy-monitor.md