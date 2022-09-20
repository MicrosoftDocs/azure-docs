---
title: Migrating to the latest Device Update for Azure IoT Hub release | Microsoft Docs
description: Understand how to migrate to latest Device Update for Azure IoT Hub release
author: EshaShah
ms.author: eshashah
ms.date: 9/15/2022
ms.topic: how-to
ms.service: iot-hub-device-update
---

# Migrate devices and groups from Public Preview Refresh to GA

As the Device Update for IoT Hub service releases new versions, you'll want to update your devices for the latest features and security improvements. This article provides information about how to migrate from the [Public Preview Refresh(PPR) release] to the current, [GA release](understand-device-update.md). This article also explains the group and UX behavior across these releases. If you do not have devices, groups, and deployments that use the Public Preview Refresh release, you can ignore this page.

To migrate successfully, you will have to upgrade the DU agent running on your devices.Note that as there are major changes with the GA release, we recommend that you follow the instructions closely to avoid errors.

> [!NOTE] 
> PPR device groups created before 6/15/2022 will be automatically changed to GA groups. The groups and devices will be available after migration. The deployment history will not carry over to the the updated GA groups. 

## Update the device update agent

For the GA release, the Device Update agent can be updated manually or using the Device Update Service. 

### Manual DU Agent Upgrade

1. Before you update your device, the device attributes will include the PPR PnP model details. The **Contract Model Name** will show **Device Update Model V1** and **Contract Model ID** will show **dtmi:azure:iot:deviceUpdateContractModel;1**.

3. SSH into your device and update the Device Update agent.
   ```bash
   sudo apt install deviceupdate-agent  
   ```
2. Confirm that the DU agent is running correctly. Look for 'HealthCheck passed'
   ```bash
   sudo /usr/bin/AducIotAgent -h  
   ```
3. See the updated device in the Device Update portal. The device attributes will now show the updated PnP model details.The **Contract Model Name** will show **Device Update Model V2** and **Contract Model ID** will show **dtmi:azure:iot:deviceUpdateContractModel;2**.


### OTA DU Agent Upgrade though APT manifest

The DU agent can be updated using the the Device Update service using package update. 

1. Add device update agent upgrade as the last step in your update. The import manifest must be Ver. 4 to ensure it is targeted to the correct devices. Refer to the sample import manifest and apt manifest:

**Example Import Manifest**
```JSON
{
    "updateId":  {
                     "provider":  "Delta",
                     "name":  "Sensor",
                     "version":  "2.0"
                 },
    "isDeployable":  true,
    "compatibility":  [
                          {
                              "deviceModel":  "Sensor",
                              "deviceManufacturer":  "Delta"
                          }
                      ],
    "instructions":  {
                         "steps":  [
                                       {
                                           "type":  "inline",
                                           "handler":  "microsoft/apt:1",
                                           "files":  [
                                                         "sample-upgrade-apt-manifest.json"
                                                     ],
                                           "handlerProperties":  {
                                                                     "installedCriteria":  "1.1"
                                                                 }
                                       }
                                   ]
                     },
    "files":  [
                  {
                      "filename":  "sample-upgrade-apt-manifest.json",
                      "sizeInBytes":  211,
                      "hashes":  {
                                     "sha256":  "q9hCNObqGcGDW1kUcYdTa3J335Vt+yfHzIKqBtFHyvc="
                                 }
                  }
              ],
    "createdDateTime":  "2022-08-03T00:25:58.8744884Z",
    "manifestVersion":  "4.0"
}
```

> [!NOTE] 
> It is required for the agent upgrade to be the last step. You may have other steps before the agent upgrade. Any steps added after the agent upgrade will not be executed and reported correctly as the device reconnects with the DU service.


2. Deploy the update
 
3. SSH into your device and remove any old Device Update agent.
   ```bash
   sudo apt remove deviceupdate-agent 
   sudo apt remove adu-agent 
   ```
   
4. Remove the old configuration file
   ```bash
   sudo rm -f /etc/adu/adu-conf.txt 
   ```
   
5. Install the new agent
   ```bash
   sudo apt-get install deviceupdate-agent 
   ```
   Alternatively, you can get the .deb asset from [GitHub](https://github.com/Azure/iot-hub-device-update) and install the agent
   
      ```bash
   sudo apt install <file>.deb
   ```

   Trying to upgrade the Device Update agent without removing the old agent and configuration files will result in the error shown below.
    
   :::image type="content" source="media/migration/update-error.png" alt-text="Screenshot of update error." lightbox="media/migration/update-error.png":::
    

6. Enter your IoT device's device (or module, depending on how you [provisioned the device with Device Update](device-update-agent-provisioning.md)) primary connection string in the configuration file by running the command below.

   ```markdown
   sudo nano /etc/adu/du-config.json
   ```
 7. Add your model, manufacturer, agent name, connection type and other details in the configuration file

 8. Delete the old IoT/IoT Edge device from the public preview portal.

> [!NOTE] 
> Attempting to update the agent through a DU deployment will lead to the device no longer being manageable by Device Update. The device will have to be re-provisioned to be managed from Device Update.

## Migrate groups to Public Preview Refresh

1. If your devices are using Device Update agent versions 0.6.0 or 0.7.0, upgrade to the latest agent version 0.8.0 following the steps above. 
 
2. Delete the existing groups in the public preview portal by navigating through the banner. 
 
3. Add group tag to the device twin for the updated devices. For more details, refer the [Add a tag to your device](device-update-simulator.md#add-a-device-to-azure-iot-hub) section.

4. Recreate the groups in the PPR portal by going to ‘Add Groups’ and selecting the corresponding groups tag from the drop-down list. 
 
5. Note that a group with the same name cannot be created in the PPR portal if the group in the public preview portal is not deleted.

## Group and deployment behavior across releases

- Device with the Public Preview Refresh DU agent ( 0.8.x) and GA DU agent (1.0.x) can be managed through the Device Update portal. 
- 
- The Groups created in the Public Preview Refresh release portal will only allow addition of devices with the latest Device Update Agent (0.8.0). Devices with older agents (0.7.0/0.6.0) cannot be added to these groups.
 
- Any new devices using the latest agent will automatically be added to a Default DeviceClass Group in the ‘Groups and Deployments’ tab. If a group tag is added to the device properties, then the device will be added to that group if a group for that tag exists. 
 
- For the device using the latest agent, if a group tag is added to the device properties but the corresponding group is not yet created the device will not be visible in the ‘Groups and Deployments’ tab.
 
- Devices using the older agents will show up as ungrouped in the old portal if the group tag is not added.

## Next steps
[Understand Device Update agent configuration file](device-update-configuration-file.md)

You can use the following tutorials for a simple demonstration of Device Update for IoT Hub:

- [Image Update: Getting Started with Raspberry Pi 3 B+ Reference Yocto Image](device-update-raspberry-pi.md) extensible via open source to build you own images for other architecture as needed.
	
- [Package Update: Getting Started using Ubuntu Server 18.04 x64 Package agent](device-update-ubuntu-agent.md)
	
- [Proxy Update: Getting Started using Device Update binary agent for downstream devices](device-update-howto-proxy-updates.md)
	
- [Getting Started Using Ubuntu (18.04 x64) Simulator Reference Agent](device-update-simulator.md)

- [Device Update for Azure IoT Hub tutorial for Azure-Real-Time-Operating-System](device-update-azure-real-time-operating-system.md)
