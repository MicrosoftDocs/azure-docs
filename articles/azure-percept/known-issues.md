---
title: Azure Percept known issues
description: Learn more about Azure Percept known issues and their workarounds
author: elqu20
ms.author: v-elqu
ms.service: azure-percept
ms.topic: reference
ms.date: 03/03/2021
---

# Known issues

If you encounter any of these issues, it is not necessary to open a bug. If you have trouble with any of the workarounds, please open an issue.

|Area|Description of Issue|Workaround|
|-------|---------|---------|
| On-boarding experience | Can’t complete on-boarding experience unless device’s Wi-Fi is configured (Azure login fails). | 1. SSH to the device access point (10.1.1.1) <br> 2. Identify and copy the device ethernet IP address <br> 3. Connect to on-boarding experience using the copied ethernet IP-based URL |
| On-boarding experience | Clicking on links in the EULA during on-boarding experience sometimes does not open a new web page. | Copy the link and open it in a separate browser window. |
| On-boarding experience | Cannot work through on-boarding experience when connected to a mobile Wi-Fi hotspot. | Connect your device directly to the SoftAP, a Wi-Fi network, or to a network over ethernet. |
| Wi-Fi/SoftAP | The SoftAP can sometimes disconnect or disappear. | We are investigating.  Rebooting the device will typically bring it back. |
| Wi-Fi | The hardware button that toggles the Wi-Fi SoftAP on and off sometimes does not work. | Continue to try pressing the button or reboot the device. |
| Wi-Fi | Users may see a message after connecting to Wi-Fi saying "This Wi-Fi network uses an older security standard." | The devkit's hotspot/SoftAP uses the WEP encryption algorithm. |
| Wi-Fi | Unable to connect to SoftAP from Windows 10 PC with the following error message: <br> "Can't connect to this network" | Reboot both the devkit and the computer. |
| Device update | Containers do not run after an OTA update. | SSH into the device and restart the IoT Edge container with this command `systemctl restart iotedge`. This will restart all containers. |
| Device update | Users may get a message that the update failed, even if it succeeded. | Confirm the device updated by navigating to the Device Twin for the device in IoT Hub. This is fixed after the first update. |
| Device update | Users may lose their Wi-Fi connection settings after their first update. | Run through on-boarding experience after updating to set up the Wi-Fi connection. This is fixed after the first update. |
| Device update | After performing an OTA update, users can no longer log on via SSH using previously created user accounts, and new SSH users cannot be created through the on-boarding experience. This issue affects systems performing OTA updates from the following pre-installed image versions: 2020.110.114.105 and 2020.109.101.105. | To recover your user profiles, perform these steps after the OTA update: <br> [SSH into your devkit](./how-to-ssh-into-percept-dk.md) using “root” as the username. If you disabled the SSH “root” user login via on-boarding experience, you must re-enable it. Run this command after successfully connecting: <br> ```mkdir -p /var/custom-configs/home; chmod 755 /var/custom-configs/home``` <br> To recover previous user home data, run the following command: <br> ```mkdir -p /tmp/prev-rootfs && mount /dev/mmcblk0p3 /tmp/prev-rootfs && [ ! -L /tmp/prev-rootfs/home ] && cp -a /tmp/prev-rootfs/home/* /var/custom-configs/home/. && echo "User home migrated!"; umount /tmp/prev-rootfs``` |
| Device update | After taking an OTA update, update groups are lost. | Update the device’s tag by following [these instructions](./how-to-update-over-the-air.md#create-a-device-update-group). |
| Dev Tools Pack Installer | Optional Caffe install may fail if Docker is not running properly on system. | Make sure Docker is installed and running, then retry Caffe installation. |
| Dev Tools Pack Installer | Optional CUDA install fails on incompatible systems. | Verify system compatibility with CUDA prior to running installer. |
| Docker, Network, IoT Edge | If your internal network uses 172.x.x.x, docker containers will fail to connect to edge. | Add a special bip section to the /etc/docker/daemon.json file like this: `{    "bip": "192.168.168.1/24"}` |
|Azure Percept Studio | "View stream" links within Azure Percept Studio do not open a new window showing the device's web stream. | 1. Open the [Azure portal](https://portal.azure.com) and select **IoT Hub**. <br> 2. Click on the IoT Hub to which your device is connected. <br> 3. Select **IoT Edge** under **Automatic Device Management** on your IoT Hub page. <br> 4. Select your device from the list. <br> 5. Select **Set modules** at the top of your device page. <br> 6. Click the trashcan icon next to **HostIpModule** to delete the module. <br> 7. To confirm the action, click **Review + create** and then **Create**. <br> 8. Open [Azure Percept Studio](https://go.microsoft.com/fwlink/?linkid=2135819) and click **Devices** on the left menu panel. <br> 9. Select your device from the list. <br> 10. On the **Vision** tab, click **View your device stream**. Your device will download a new version of HostIpModule and open a browser tab with your device's web stream. |