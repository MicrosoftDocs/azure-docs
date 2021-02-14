---
title: Getting Started Using Ubuntu (18.04 x64) Simulator Reference Agent | Microsoft Docs
description: Getting Started Using Ubuntu (18.04 x64) Simulator Reference Agent.
author: philmea
ms.author: philmea
ms.date: 1/11/2021
ms.topic: conceptual
ms.service: iot-hub
---

# Getting Started Using Ubuntu (18.04 x64) Simulator Reference Agent
Device Update for IoT Hub provides a simulator reference agent for testing and rollout.

## Simulator Prerequisites

### Download and install

* Az (Azure CLI) cmdlets for PowerShell:
  * Open PowerShell > Install Azure CLI ("Y" for prompts to install from "untrusted" source)

```powershell
PS> Install-Module Az -Scope CurrentUser
```

### Create a software device using WSL (Windows Subsystem for Linux)

1. Open PowerShell as Administrator on your machine and run the following command (you might be asked to restart after each step; restart when asked):

```powershell
PS> Enable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform
PS> Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux
```

(*You may be prompted to restart after this step*)

2. Go to the Microsoft Store on the web and install [Ubuntu 18.04 LTS](https://www.microsoft.com/p/ubuntu-1804-lts/9n9tngvndl3q?activetab=pivot:overviewtab`).

3. Start "Ubuntu 18.04 LTS" and install.

4. When installed, you will be asked to set root name (username) and password. Be sure to use a memorable root name password.

5. In PowerShell, run the following command to set Ubuntu to be the default Linux distribution:

```powershell
PS> wsl --setdefault Ubuntu-18.04
```

6. List all Linux distributions, make sure that Ubuntu is the default one.

```powershell
PS> wsl --list
```

7. You should see: **Ubuntu-18.04 (Default)**

## Download Ubuntu update agent

The Ubuntu update image can be downloaded from the *Assets* section from release notes [here](https://github.com/Azure/iot-hub-device-update/releases).

There are two versions of the agent. If you are exercising image-based scenario use AducIotAgentSim-microsoft-swupdate and if you are exercising package-based scenario use AducIotAgentSim-microsoft-apt.

## Install Device Update Agent simulator

1. Start Ubuntu WSL and enter the following command (note that extra space and dot at the end).

  ```shell
  explorer.exe .
  ```

2. Copy AducIotAgentSim-microsoft-swupdate (or AducIotAgentSim-microsoft-apt) from your local folder where it was downloaded under /mnt to your home folder inside of WSL.

3. Run the following command to make the binaries executable.

  ```shell
  sudo chmod u+x AducIotAgentSim-microsoft-swupdate
  ```

  or

  ```shell
  sudo chmod u+x AducIotAgentSim-microsoft-apt
  ```

## Add device to Azure IoT Hub

Once the Device Update Agent is running on an IoT device, the device needs to be added to the Azure IoT Hub.  From within the Azure IoT Hub a connection string will be generated for a particular device.

1. From the Azure portal, launch the Device Update IoT Hub.
2. Create a new device.
3. On the left-hand side of the page, navigate to 'Explorers' > 'IoT Devices' > Select "New".
4. Provide a name for the device under 'Device ID'--Ensure that "Autogenerate keys" is checkbox is selected.
5. Select 'Save'.
6. Now, you will be returned to the 'Devices' page and the device you created should be in the list. Select that device.
7. In the device view, select the 'Copy' icon next to 'Primary Connection String'.
8. Paste the copied characters somewhere for later use in the steps below. **This is your device connection string**.

## Add connection string to simulator

Start Device Update Agent on your new Software Devices.

1. Start Ubuntu.
2. Run the Device Update Agent and specify the device connection string from the previous section wrapped with apostrophes:

```shell
./AducIotAgentSim-microsoft-swupdate '{device connection string}'
```

or

```shell
./AducIotAgentSim-microsoft-apt '{device connection string}'
```

3. Scroll up and look for the string indicating that the device is in "Idle" state, which means it is ready for service commands:

```markdown
Agent running. [main]
```

> [!div class="nextstepaction"]
> [Import New Update](import-update.md)
