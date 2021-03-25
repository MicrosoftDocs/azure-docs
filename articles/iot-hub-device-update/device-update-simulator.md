---
title: Device Update for Azure IoT Hub tutorial using the Ubuntu (18.04 x64) Simulator Reference Agent | Microsoft Docs
description: Get started with Device Update for Azure IoT Hub using the Ubuntu (18.04 x64) Simulator Reference Agent.
author: valls
ms.author: valls
ms.date: 2/11/2021
ms.topic: tutorial
ms.service: iot-hub-device-update
---

# Device Update for Azure IoT Hub tutorial using the Ubuntu (18.04 x64) Simulator Reference Agent

Device Update for IoT Hub supports two forms of updates – image-based
and package-based.

Image updates provide a higher level of confidence in the end-state of the device. It is typically easier to replicate the results of an image-update between a pre-production environment and a production environment, since it doesn’t pose the same challenges as packages and their dependencies. Due to their atomic nature, one can also adopt an A/B failover model easily.

This tutorial walks you through the steps to complete an end-to-end image-based update using Device Update for IoT Hub. 

In this tutorial you will learn how to:
> [!div class="checklist"]
> * Download and install image
> * Add a tag to your IoT device
> * Import an update
> * Create a device group
> * Deploy an image update
> * Monitor the update deployment

## Prerequisites
* If you haven't already done so, create a [Device Update account and instance](create-device-update-account.md), including configuring an IoT Hub.

### Download and install

* Az (Azure CLI) cmdlets for PowerShell:
  * Open PowerShell > Install Azure CLI ("Y" for prompts to install from "untrusted" source)

```powershell
PS> Install-Module Az -Scope CurrentUser
```

### Enable WSL on your Windows device (Windows Subsystem for Linux)

1. Open PowerShell as Administrator on your machine and run the following command (you might be asked to restart after each step; restart when asked):

```powershell
PS> Enable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform
PS> Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux
```

(*You may be prompted to restart after this step*)

2. Go to the Microsoft Store on the web and install [Ubuntu 18.04 LTS](https://www.microsoft.com/p/ubuntu-1804-lts/9n9tngvndl3q?activetab=pivot:overviewtab`).

3. Start "Ubuntu 18.04 LTS" and install.

4. When installed, you'll be asked to set root name (username) and password. Be sure to use a memorable root name password.

5. In PowerShell, run the following command to set Ubuntu to be the default Linux distribution:

```powershell
PS> wsl --setdefault Ubuntu-18.04
```

6. List all Linux distributions, make sure that Ubuntu is the default one.

```powershell
PS> wsl --list
```

7. You should see: **Ubuntu-18.04 (Default)**

## Download Device Update Ubuntu (18.04 x64) Simulator Reference Agent

The Ubuntu update image can be downloaded from the *Assets* section from release notes [here](https://github.com/Azure/iot-hub-device-update/releases).

There are two versions of the agent. If you're exercising image-based scenario, use AducIotAgentSim-microsoft-swupdate and if you are exercising package-based scenario, use AducIotAgentSim-microsoft-apt.

## Install Device Update Agent simulator

1. Start Ubuntu WSL and enter the following command (note that extra space and dot at the end).

  ```shell
  explorer.exe .
  ```

2. Copy AducIotAgentSim-microsoft-swupdate (or AducIotAgentSim-microsoft-apt) from your local folder where it was downloaded under /mnt to your home folder in WSL.

3. Run the following command to make the binaries executable.

  ```shell
  sudo chmod u+x AducIotAgentSim-microsoft-swupdate
  ```

  or

  ```shell
  sudo chmod u+x AducIotAgentSim-microsoft-apt
  ```
Device Update for Azure IoT Hub software is subject to the following license terms:
   * [Device update for IoT Hub license](https://github.com/Azure/iot-hub-device-update/blob/main/LICENSE.md)
   * [Delivery optimization client license](https://github.com/microsoft/do-client/blob/main/LICENSE.md)
   
Read the license terms prior to using the agent. Your installation and use constitutes your acceptance of these terms. If you do not agree with the license terms, do not use the Device update for IoT Hub agent.

## Add device to Azure IoT Hub

Once the Device Update Agent is running on an IoT device, the device needs to be added to the Azure IoT Hub.  From within Azure IoT Hub, a connection string will be generated for a particular device.

1. From the Azure portal, launch the Device Update IoT Hub.
2. Create a new device.
3. On the left-hand side of the page, navigate to 'Explorers' > 'IoT Devices' > Select "New".
4. Provide a name for the device under 'Device ID'--Ensure that "Autogenerate keys" is checkbox is selected.
5. Select 'Save'.
6. Now, you'll be returned to the 'Devices' page and the device you created should be in the list. Select that device.
7. In the device view, select the 'Copy' icon next to 'Primary Connection String'.
8. Paste the copied characters somewhere for later use in the steps below. **This copied string is your device connection string**.

## Add connection string to simulator

Start Device Update Agent on your new Software Devices.

1. Start Ubuntu.
2. Run the Device Update Agent and specify the device connection string from the previous section wrapped with apostrophes:

Replace `<device connection string>` with your connection string
```shell
./AducIotAgentSim-microsoft-swupdate -c '<device connection string>'
```

or

```shell
./AducIotAgentSim-microsoft-apt -c '<device connection string>'
```

3. Scroll up and look for the string indicating that the device is in "Idle" state. An "Idle" state signifies that the device is ready for service commands:

```markdown
Agent running. [main]
```

## Add a tag to your device

1. Log into [Azure portal](https://portal.azure.com) and navigate to the IoT Hub.

2. From 'IoT Devices' or 'IoT Edge' on the left navigation pane find your IoT device and navigate to the Device Twin.

3. In the Device Twin, delete any existing Device Update tag value by setting them to null.

4. Add a new Device Update tag value as shown below.

```JSON
    "tags": {
            "ADUGroup": "<CustomTagValue>"
            }
```

## Import update

1. Create an Import Manifest following these [instructions](import-update.md).
2. Select the Device Updates option under Automatic Device Management from the left-hand navigation bar.

3. Select the Updates tab.

4. Select "+ Import New Update".

5. Select the folder icon or text box under "Select an Import Manifest File". You will see a file picker dialog. Select the Import Manifest you created above.  Next, select the folder icon or text box under "Select one or more update files". You will see a file picker dialog. Select the Ubuntu update image that you downloaded earlier. 

   :::image type="content" source="media/import-update/select-update-files.png" alt-text="Screenshot showing update file selection." lightbox="media/import-update/select-update-files.png":::

6. Select the folder icon or text box under "Select a storage container". Then select the appropriate storage account.

7. If you’ve already created a container, you can reuse it. (Otherwise, select "+ Container" to create a new storage container for updates.).  Select the container you wish to use and click "Select".
  
  :::image type="content" source="media/import-update/container.png" alt-text="Screenshot showing container selection." lightbox="media/import-update/container.png":::

8. Select "Submit" to start the import process.

9. The import process begins, and the screen changes to the "Import History" section. Select "Refresh" to view progress until the import process completes. Depending on the size of the update, this may complete in a few minutes but could take longer.
   
   :::image type="content" source="media/import-update/update-publishing-sequence-2.png" alt-text="Screenshot showing update import sequence." lightbox="media/import-update/update-publishing-sequence-2.png":::

10. When the Status column indicates the import has succeeded, select the "Ready to Deploy" header. You should see your imported update in the list now.

[Learn more](import-update.md) about importing updates.

## Create update group

1. Go to the IoT Hub you previously connected to your Device Update instance.

2. Select the Device Updates option under Automatic Device Management from the left-hand navigation bar.

3. Select the Groups tab at the top of the page. 

4. Select the Add button to create a new group.

5. Select the IoT Hub tag you created in the previous step from the list. Select Create update group.

   :::image type="content" source="media/create-update-group/select-tag.PNG" alt-text="Screenshot showing tag selection." lightbox="media/create-update-group/select-tag.PNG":::

[Learn more](create-update-group.md) about adding tags and creating update groups


## Deploy update

1. Once the group is created, you should see a new update available for your device group, with a link to the update under Pending Updates. You may need to Refresh once. 

2. Click on the available update.

3. Confirm the correct group is selected as the target group. Schedule your deployment, then select Deploy update.

   :::image type="content" source="media/deploy-update/select-update.png" alt-text="Select update" lightbox="media/deploy-update/select-update.png":::

4. View the compliance chart. You should see the update is now in progress. 

   :::image type="content" source="media/deploy-update/update-in-progress.png" alt-text="Update in progress" lightbox="media/deploy-update/update-in-progress.png":::

5. After your device is successfully updated, you should see your compliance chart and deployment details update to reflect the same. 

   :::image type="content" source="media/deploy-update/update-succeeded.png" alt-text="Update succeeded" lightbox="media/deploy-update/update-succeeded.png":::

## Monitor an update deployment

1. Select the Deployments tab at the top of the page.

   :::image type="content" source="media/deploy-update/deployments-tab.png" alt-text="Deployments tab" lightbox="media/deploy-update/deployments-tab.png":::

2. Select the deployment you created to view the deployment details.

   :::image type="content" source="media/deploy-update/deployment-details.png" alt-text="Deployment details" lightbox="media/deploy-update/deployment-details.png":::

3. Select Refresh to view the latest status details. Continue this process until the status changes to Succeeded.

You have now completed a successful end-to-end image update using Device Update for IoT Hub using the Ubuntu (18.04 x64) Simulator Reference Agent.

## Clean up resources

When no longer needed, clean up your device update account, instance, IoT Hub and IoT device. 

## Next steps

> [!div class="nextstepaction"]
> [Troubleshooting](troubleshoot-device-update.md)

