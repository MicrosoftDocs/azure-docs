---
title: Create a security module twin for Azure Security Center for IoT Preview| Microsoft Docs
description: Learn how to create a Azure Security Center for IoT module twin for use with ASC for IoT.
services: asc-for-iot
ms.service: asc-for-iot
documentationcenter: na
author: mlottner
manager: rkarlin
editor: ''

ms.assetid: c782692e-1284-4c54-9d76-567bc13787cc
ms.subservice: asc-for-iot
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/26/2019
ms.author: mlottner

---
# Quickstart: Create an azureiotsecurity module twin

> [!IMPORTANT]
> Azure Security Center for IoT is currently in public preview. This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This quickstart explanations of how to create individual _azureiotsecurity_ module twins for new devices, or batch create module twins for all devices in an IoT Hub.  

## Understanding azureiotsecurity module twins 

For IoT solutions built in Azure, device twins play a key role in both device management and process automation. 

Azure Security Center (ASC) for IoT offers full integration with your existing IoT device management platform, enabling you to manage your device security status as well as make use of existing device control capabilities.
ASC for IoT integration is achieved by making use of the IoT Hub twin mechanism.  

See [IoT Hub module twins](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-module-twins) to learn more about the general concept of module twins in Azure IoT Hub. 
 
ASC for IoT makes use of the module twin mechanism and maintains a security module twin named _azureiotsecurity_ for each of your devices.
The security module twin holds all the information relevant to device security for each of your devices. 
 
To make full use of ASC for IoT features, you'll need to create, configure and use these security module twins for every device in the service.  

## Create azureiotsecurity module twin 

_azureiotsecurity_ module twins can be created in two ways:
1. [Module batch script](https://aka.ms/iot-security-github-create-module) - automatically creates module twin for new devices or devices without a module twin using the default configuration.
2. Manually editing each module twin individually with specific configurations for each device.

>[!NOTE] 
> Using the batch method will not overwrite existing azureiotsecurity module twins. Using the batch method ONLY creates new module twins for devices that do not already have a security module twin. 

See [agent configuration](how-to-agent-configuration.md) to learn how to modify or change the configuration of an existing module twin. 

To create manually a new _azureiotsecurity_ module twin for a device use the following instructions: 

1. In your IoT Hub, locate and select the device you wish to create a security module twin for in your IoT Hub.
1. Click on your device, and then on **Add module identity**.
1. In the **Module Identity Name** field, enter **azureiotsecurity**.

1. Click **Save**. 

## Verify creation of a module twin

To verify if a security module twin exists for a specific device:

1. In your Azure IoT Hub, select **IoT devices** from the **Explorers** menu.    
1. Enter the device ID, or select an option in the **Query device field** and click **Query devices**. 
    ![Query devices](./media/quickstart/verify-security-module-twin.png)
1. Select the device or double click it to open the Device details page. 
1. Select the **Module identities** menu, and confirm existence of the **azureiotsecurity** module in the list of module identities associated with the device. 
    ![Modules associated with a device](./media/quickstart/verify-security-module-twin-3.png)


To learn more about customizing properties of ASC for IoT module twins, see [Agent configuration](how-to-agent-configuration.md).

## Next steps

Advance to the next article to learn how to configure custom alerts...

> [!div class="nextstepaction"]
> [Configure custom alerts](quickstart-create-custom-alerts.md)
