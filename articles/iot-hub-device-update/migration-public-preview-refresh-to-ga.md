---
title: Migrating to the latest Device Update for IoT Hub release | Microsoft Docs
description: Understand how to migrate to latest Device Update for IoT Hub release
author: eshashah-msft
ms.author: eshashah
ms.date: 9/15/2022
ms.topic: how-to
ms.service: iot-hub-device-update
---

# Migrate devices and groups to latest Device Update for IoT Hub release

As the Device Update for IoT Hub service releases new versions, you'll want to update your devices for the latest features and security improvements. This article provides information about how to migrate from the [Public Preview Refresh(PPR) release] to the current, [GA release](understand-device-update.md). This article also explains the group and UX behavior across these releases. If you do not have devices, groups, and deployments that use the Public Preview Refresh release, you can ignore this page.

To migrate successfully, you will have to upgrade the DU agent running on your devices. Note that as there are major changes with the GA release, we recommend that you follow the instructions closely to avoid errors.

> [!NOTE] 
> All PPR device groups created will be automatically changed to GA groups. The groups and devices will be available after migration. The deployment history will not carry over to the updated GA groups. 

## Update the Device Update agent

For the GA release, the Device Update agent can be updated manually or using the Device Update Service using apt manifest or image updates. If you are using image updates, you can include the GA Device Update agent in the your update.

### Manual DU Agent Upgrade

1. Before you update your device, the device attributes will include the PPR PnP model details. The **Contract Model Name** will show **Device Update Model V1** and **Contract Model ID** will show **dtmi:azure:iot:deviceUpdateContractModel;1**.

3. SSH into your device and update the Device Update agent.
   ```bash
   sudo apt install deviceupdate-agent
   sudo systemctl restart deviceupdate-agent
   sudo systemctl status deviceupdate-agent
   ```
2. Confirm that the DU agent is running correctly. Look for 'HealthCheck passed'
   ```bash
   sudo -u adu /usr/bin/AducIotAgent -h  
   ```
3. See the updated device in the Device Update portal. The device attributes will now show the updated PnP model details.The **Contract Model Name** will show **Device Update Model V2** and **Contract Model ID** will show **dtmi:azure:iot:deviceUpdateContractModel;2**.


### OTA DU Agent Upgrade though APT manifest

1. Before you update your devices, the device attributes will include the PPR PnP model details. The **Contract Model Name** will show **Device Update Model V1** and **Contract Model ID** will show **dtmi:azure:iot:deviceUpdateContractModel;1**.

2. Add device update agent upgrade as the last step in your update. The import manifest version must be **"4.0"** to ensure it is targeted to the correct devices. See below a sample import manifest and APT manifest:

   **Example Import Manifest**
   ```json
   {
      "manifestVersion": "4",
      "updateId": {
        "provider": "Contoso",
        "name": "Sensor",
        "version": "1.0"
      },
      "compatibility": [
        {
          "manufacturer": "Contoso",
          "model": "Sensor"
        }
      ],
      "instructions": {
        "steps": [
          {
        "handler": "microsoft/apt:1",
        "handlerProperties": {
          "installedCriteria": "1.0"
        },
        "files": [
          "fileId0"
        ]
          }
        ]
      },
      "files": {
        "fileId0": {
          "filename": "sample-upgrade-apt-manifest.json",
          "sizeInBytes": 210,
          "hashes": {
        "sha256": "mcB5SexMU4JOOzqmlJqKbue9qMskWY3EI/iVjJxCtAs="
          }
        }
      },
      "createdDateTime": "2022-08-20T18:32:01.8404544Z"
    }
    ```

    **Example APT manifest**

    ```json
      {
        "name": "Sample DU agent upgrade update",
        "version": "1.0.0",
        "packages": [
        {
            "name": "deviceupdate-agent"
        }
        ]
    }
    ```

> [!NOTE] 
> It is required for the agent upgrade to be the last step. You may have other steps before the agent upgrade. Any steps added after the agent upgrade will not be executed and reported correctly as the device reconnects with the DU service.

3. Deploy the update.

4. Once the update is successfully deployed, the device attributes will now show the updated PnP model details.The **Contract Model Name** will show **Device Update Model V2** and **Contract Model ID** will show **dtmi:azure:iot:deviceUpdateContractModel;2**. 
 
## Group and deployment behavior across releases

- Device with the Public Preview Refresh DU agent ( 0.8.x) and GA DU agent (1.0.x) can be managed through the Device Update portal. 

- Devices with older agents (0.7.0/0.6.0) cannot be added to these groups.

## Next steps

[Understand Device Update agent configuration file](device-update-configuration-file.md)

You can use the following tutorials for a simple demonstration of Device Update for IoT Hub:
    
- [Package Update: Getting Started using Ubuntu Server 18.04 x64 Package agent](device-update-ubuntu-agent.md)
    
- [Proxy Update: Getting Started using Device Update binary agent for downstream devices](device-update-howto-proxy-updates.md)
    
- [Getting Started Using Ubuntu (18.04 x64) Simulator Reference Agent](device-update-simulator.md)

- [Device Update for Azure IoT Hub tutorial for Azure-Real-Time-Operating-System](device-update-azure-real-time-operating-system.md)
