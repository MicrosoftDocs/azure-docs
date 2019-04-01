---
title: Deploy Azure Security Center for IoT Edge module | Microsoft Docs
description: Learn about how deploy Azure Security Center for IoT security agent on IoT Edge.
services: ascforiot
documentationcenter: na
author: mlottner
manager: barbkess
editor: ''

ms.assetid: 32a9564d-16fd-4b0d-9618-7d78d614ce76
ms.service: ascforiot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/27/2019
ms.author: mlottner

---

# Deploy security module on your IoT Edge device

> [!IMPORTANT]
> Azure Security Center for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

**Azure Security Center (ASC) for IoT** module provides a comprehensive security solution for your IoT Edge device.
Security module collects, aggregates and analyzes raw security data from your Operating System and Container system into actionable security recommendations and alerts.
To learn more, see [Security module for IoT Edge](security-edge-architecture.md).

In this guide, you learn how to deploy a security module on your IoT Edge device.

## Deploy security module

Use the following steps to deploy an ASC for IoT security module for IoT Edge.

### Prerequisites

1. In your IoT Hub, make sure your device is [registered as an IoT Edge device](https://docs.microsoft.com/en-us/azure/iot-edge/how-to-register-device-portal).

1. The ASC for IoT Edge module requires the [AuditD framework](https://linux.die.net/man/8/auditd) installed on the IoT Edge device.

   1. Install the framework by running the following command on your IoT Edge device:
   
      `sudo apt-get install auditd audispd-plugins`
   
   1. Verify that AuditD is active by running the following command
   
      `sudo systemctl status auditd`

### Deployment using Azure portal

1. Open **Marketplace** in Azure portal.

1. Select **Azure Security Center for IoT** under **Internet of Things**.

   ![](media/howto/edge_onboarding_8.png)

1. Click **Create**.

1. Choose your **Subscription** and **IoT Hub**.
   Next, choose **Deploy to a device** to target a single device and **Deploy at Scale** to target multiple devices.
   Then click **Create**.

1. Under **Add Modules**
   
   1. Click on **AzureSecurityCenterforIoT** under **Deployment Modules** and,
   
      1. Change the Name to **azureiotsecurity**.
      1. Verify that **Image URI** is set to **mcr.microsoft.com/ascforiot/azureiotsecurity:0.0.1**
      
      1. Verify that **Set module twin's desired properties** is checked, and that the following configuration is provided:
      
         ``` json
         "properties.desired": {
           "azureiot*com^securityAgentConfiguration^1*0*0": {
           }
         }
         ```
      1. Click **Save**.
   
   1. Click on **Configure advanced Edge Runtime settings**.
   
      >[!Note]
      > Do not disable AMQP communication for the Edge Hub.
      > Azure Security Center for IoT module requires AMQP communication with the Edge Hub.
   
      1. Verify that **Image** under **Edge Hub** is set to **mcr.microsoft.com/ascforiot/edgehub:1.05-preview**.
      
      1. Verify that **Create Options** is set to 
         
         ``` json
         {
           "HostConfig": {
             "PortBindings": {
               "8883/tcp": [{"HostPort": "8883"}],
               "443/tcp": [{"HostPort": "443"}],
               "5671/tcp": [{"HostPort": "5671"}]
             }
           }
         }
         ```
      
      1. Click **Save**.
   
   1. Click **Next**.

1. Under **Specify Routes** set the **ASCForIoTToIoTHub** route to **"FROM /messages/modules/azureiotsecurity/\* INTO $upstream"**.
   ![](media/howto/edge_onboarding_9.png)
   
   Then click **Next**.

1. Under **Review Deployment** click **Submit** to complete the deployment.

## Diagnostic steps

When you encounter an issue, learn more about the state of the IoT Edge security module device by reviewing the container logs. Use the commands and tools in this section to gather information.

1. Verify that the required containers are up and running:

   `sudo docker ps`
   
   You should see at least the following containers:
   
   | Name | IMAGE |
   | --- | --- |
   | azureIoTSecurity | mcr.microsoft.com/ascforiot/azureiotsecurity:0.0.1 |
   | edgeHub | asotcontainerregistry.azurecr.io/edgehub:1.04-preview |
   | edgeAgent | mcr.microsoft.com/azureiotedge-agent:1.0 |
   
   If this is not the case, check that your IoT Edge deployment manifest is aligned with the recommended settings. See [Deploy IoT Edge module](#Deployment-using-Azure-portal) for more details.
   
1. View module logs

   `sudo docker logs azureiotsecurity`
   
   For more verbose logs, add the following environment variable to **azureiotsecurity** module deployment: `logLevel=Debug`.

## Next steps

To learn more about configuration options, continue to the how-to guide for module configuration. 
> [!div class="nextstepaction"]
> [Module configuration how to guide](./how-to-agent-configuration.md)
