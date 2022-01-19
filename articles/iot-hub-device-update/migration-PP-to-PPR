---
title: Migrate Devices from Public Preview to Public Preview Refresh| Microsoft Docs
description: Understand Device Update for Azure IoT Hub Agent.
author: EshaShah
ms.author: eshashah
ms.date: 1/14/2022
ms.topic: how-to
ms.service: iot-hub-device-update
---

# Migrate Devices from Public Preview to Public Preview Refresh

As the Device Update for IoT Hub service releases new versions, you'll want to update your devices for the latest features and security improvements. This article provides information about how to migrate from the Public Preview release to the current, Public Preview Refresh (PPR) release. This article also explains the group and UX behavior across these release

To migrate successfully, you will have to upgrade the DU agent running on your devices. You will also have to create new device groups to deploy and manage updates. Please note that as there are major changes with the PPR release, we recommend that you follow the instructions closely to avoid errors.

## Update the device update agent

1. Create a new IoT/IoT Edge device on the Azure Portal. Copy the primary connection string for the device from the device view for later. For more details, refer [Add Device to IoT Hub](device-update-simulator.md#add-device-to-azure-iot-hub) section in this tutorial) 

2. 

## Migrating Groups to Public Preview Refresh

1.If your devices are using Device Update agent versions 0.6.0 or 0.7.0, upgrade to the latest agent version 0.8.0 following the steps above. 
 
2.Delete the existing groups in the public preview portal by navigating through the banner. 
 
3.Add group tag to new devices with the latest agent. Recreate the groups in the PPR portal by going to ‘Add Groups’ and selecting the groups tag that automatically appears in the drop-down list. 
 
4.Please note that groups with the same name cannot be created in the PPR portal if the group in the public preview portal is not deleted.

##Group and deplaoyment behavior across releases

1.Groups created in the Public Preview Refresh release portal will only allow addition of devices with the latest Device Update Agent (0.8.0). Devices with older agents (0.7.0/0.6.0) cannot be added to these groups.
 
2.Any new IoT or IoT edge devices created and using the latest agent will be automatically added to a Default DeviceClass Group in the ‘Groups and Deployments’ tab and be ready for deployment. If a group tag is added to the device properties, then the device will be added to that group if a group for that tag exists. 
 
3.For the device using the latest agent, if a group tag is added to the device properties but the corresponding group is not yet created the device will not be visible in the ‘Groups and Deployments’ tab
 
4.To view devices using older agents (versions 0.7.0/0.6.0) and groups created before 18th January 2021, the old Public Preview portal which can be accessed through the banner at the top of the portal.
 
5.Devices using the older agents will be show up as ungrouped in the old portal if the hroup tag is not added.

> [!NOTE]
>  Do not add devices with latest agent in public preview groups. This will cause any deployments to fail.
 


## Next Steps
[Understand Device Update agent configuration file](device-update-configuration-file.md)

You can use the following tutorials for a simple demonstration of Device Update for IoT Hub:

- [Image Update: Getting Started with Raspberry Pi 3 B+ Reference Yocto Image](device-update-raspberry-pi.md) extensible via open source to build you own images for other architecture as needed.
	
- [Package Update: Getting Started using Ubuntu Server 18.04 x64 Package agent](device-update-ubuntu-agent.md)
	
- [Proxy Update: Getting Started using Device Update binary agent for downstream devices](device-update-howto-proxy-updates.md)
	
- [Getting Started Using Ubuntu (18.04 x64) Simulator Reference Agent](device-update-simulator.md)

- [Device Update for Azure IoT Hub tutorial for Azure-Real-Time-Operating-System](device-update-azure-real-time-operating-system.md)
