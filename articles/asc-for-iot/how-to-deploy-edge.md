---
title: Deploy Azure Security Center for IoT Edge module | Microsoft Docs
description: Learn about how to deploy an Azure Security Center for IoT security agent on IoT Edge.
services: asc-for-iot
ms.service: asc-for-iot
documentationcenter: na
author: mlottner
manager: rkarlin
editor: ''

ms.assetid: 32a9564d-16fd-4b0d-9618-7d78d614ce76
ms.subservice: asc-for-iot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/1/2019
ms.author: mlottner

---

# Deploy a security module on your IoT Edge device

> [!IMPORTANT]
> Azure Security Center for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

**Azure Security Center (ASC) for IoT** module provides a comprehensive security solution for your IoT Edge device.
Security module collects, aggregates, and analyzes raw security data from your Operating System and Container system into actionable security recommendations and alerts.
To learn more, see [Security module for IoT Edge](security-edge-architecture.md).

In this guide, you learn how to deploy a security module on your IoT Edge device.

## Deploy security module

Use the following steps to deploy an ASC for IoT security module for IoT Edge.

### Prerequisites

- In your IoT Hub, make sure your device is [registered as an IoT Edge device](https://docs.microsoft.com/azure/iot-edge/how-to-register-device-portal).

- ASC for IoT Edge module requires [AuditD framework](https://linux.die.net/man/8/auditd) is installed on the IoT Edge device.

    - Install the framework by running the following command on your IoT Edge device:
   
      `sudo apt-get install auditd audispd-plugins`
   
    - Verify AuditD is active by running the following command:
   
      `sudo systemctl status auditd`
      
        The expected response is `active (running)`. 

### Deployment using Azure portal

1. From Azure portal, open **Marketplace**.

1. Select **Internet of Things**, then search for **Azure Security Center for IoT** and select it.

   ![Select Azure Security Center for IoT](media/howto/edge-onboarding-8.png)

1. Click **Create** to configure the deployment. 

1. Choose the Azure **Subscription** of your IoT Hub, then select your **IoT Hub**.<br>Select **Deploy to a device** to target a single device or select **Deploy at Scale** to target multiple devices, and click **Create**. For more information about deploying at scale, see [How to deploy](https://docs.microsoft.com/azure/iot-edge/how-to-deploy-monitor). 

    >[!Note] 
    >If you selected **Deploy at Scale**, add the device name and details before continuing to the **Add Modules** tab in the following instructions.     

There are three steps to create an IoT Edge deployment for Azure Security Center for IoT. The following sections walk through each one. 

#### Step 1: Add Modules

1. From the **Add Modules** tab, **Deployment Modules** area, click  **AzureSecurityCenterforIoT**. 
   
1. Change the **name** to **azureiotsecurity**.
1. Change the **Image URI** to **mcr.microsoft.com/ascforiot/azureiotsecurity:0.0.3**.
1. Verify the **Container Create Options** value is set to:      
    ``` json
    {
        "NetworkingConfig": {
            "EndpointsConfig": {
                "host": {}
            }
        },
        "HostConfig": {
            "Privileged": true,
            "NetworkMode": "host",
            "PidMode": "host",
            "Binds": [
                "/:/host"
            ]
        }
    }    
    ```
1. Verify that **Set module twin's desired properties** is selected, and change the configuration object to:
      
    ``` json
      "properties.desired": {
        "azureiot*com^securityAgentConfiguration^1*0*0": {
        }
      }
      ```

1. Click **Save**.
1. Scroll to the bottom of the tab and select **Configure advanced Edge Runtime settings**.
   
   >[!Note]
   > Do **not** disable AMQP communication for the IoT Edge Hub.
   > Azure Security Center for IoT module requires AMQP communication with the IoT Edge Hub.
   
1. Change the **Image** under **Edge Hub** to **mcr.microsoft.com/ascforiot/edgehub:1.0.9-preview**.

   >[!Note]
   > Azure Security Center for IoT module requires a forked version of IoT Edge Hub, based on SDK version 1.20.
   > By changing IoT Edge Hub image, you are instructing your IoT Edge device to replace the latest stable release with the forked version of IoT Edge Hub, which is not officially supported by the IoT Edge service.

1. Verify **Create Options** is set to: 
         
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

#### Step 2: Specify Routes 

1. In the **Specify Routes** tab, set the **ASCForIoTToIoTHub** route to **"FROM /messages/modules/azureiotsecurity/\* INTO $upstream"**, and click **Next**.

   ![Specify routes](media/howto/edge-onboarding-9.png)

#### Step 3: Review Deployment

1. In the **Review Deployment** tab, review your deployment information, then select **Submit** to complete the deployment.

## Diagnostic steps

If you encounter an issue, container logs are the best way to learn about the state of an IoT Edge security module device. Use the commands and tools in this section to gather information.

### Verify the required containers are installed and functioning as expected

1. Run the following command on your IoT Edge device:
    
     `sudo docker ps`
   
1. Verify that the following containers are running:
   
   | Name | IMAGE |
   | --- | --- |
   | azureiotsecurity | mcr.microsoft.com/ascforiot/azureiotsecurity:0.0.3 |
   | edgeHub | mcr.microsoft.com/ascforiot/edgehub:1.0.9-preview |
   | edgeAgent | mcr.microsoft.com/azureiotedge-agent:1.0 |
   
   If the minimum required containers are not present, check if your IoT Edge deployment manifest is aligned with the recommended settings. For more information, see [Deploy IoT Edge module](#deployment-using-azure-portal).

### Inspect the module logs for errors
   
1. Run the following command on your IoT Edge device:

   `sudo docker logs azureiotsecurity`
   
1. For more verbose logs, add the following environment variable to **azureiotsecurity** module deployment: `logLevel=Debug`.

## Next steps

To learn more about configuration options, continue to the how-to guide for module configuration. 
> [!div class="nextstepaction"]
> [Module configuration how-to guide](./how-to-agent-configuration.md)
