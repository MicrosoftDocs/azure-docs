---
title: Troubleshoot issues with Azure Percept DK
description: Get troubleshooting tips for some of the more common issues with Azure Percept DK and IoT Edge
author: mimcco
ms.author: mimcco
ms.service: azure-percept
ms.topic: how-to
ms.date: 08/10/2021
ms.custom: template-how-to 
---

# Azure Percept DK troubleshooting

The purpose of this troubleshooting article is to help Azure Percept DK users to quickly resolve common issues with their dev kits. It also provides guidance on collecting logs for when extra support is needed.

## Log collection
In this section, you'll get guidance on which logs to collect and how to collect them.

### How to collect logs
1. Connect to your dev kit [over SSH](./how-to-ssh-into-percept-dk.md).
1. Run the needed commands in the SSH terminal window. See the next section for the list of log collection commands.
1. Redirect any output to a .txt file for further analysis, use the following syntax:
    ```console
    sudo [command] > [file name].txt
    ```
1. Change the permissions of the .txt file so it can be copied:
    ```console
    sudo chmod 666 [file name].txt
    ```
1. Copy the file to your host PC via SCP:
    ```console
    scp [remote username]@[IP address]:[remote file path]/[file name].txt [local host file path]
    ```

    ```[local host file path]``` refers to the location on your host PC that you would like to copy the .txt file to. ```[remote username]``` is the SSH username chosen during the [setup experience](./quickstart-percept-dk-set-up.md).

### Log types and commands

|Log purpose      |When to collect it         |Command                     |
|-----------------|---------------------------|----------------------------|
|*Support bundle* - provides a set of logs needed for most customer support requests.|Collect whenever requesting support.|```sudo iotedge support-bundle --since 1h``` <br><br>*"--since 1h" can be changed to any time span, for example, "6h" (6 hours), "6d" (6 days) or "6m" (6 minutes)*|
|*OOBE logs* - records details about the setup experience.|Collect when you find issues during the setup experience.|```sudo journalctl -u oobe -b```|
|*edgeAgent logs* - records the version numbers of all modules running on your device.|Collect when one or more modules aren't working.|```sudo iotedge logs edgeAgent```|
|*Module container logs* - records details about specific IoT Edge module containers|Collect when you find issues with a module|```sudo iotedge logs [container name]```|
|*Wi-Fi access point logs* - records details about the connection to the dev kit's Wi-Fi access point.|Collect when you find issues when connecting to the dev kit's Wi-Fi access point.|```sudo journalctl -u hostapd.service```|
|*Network logs* - a set of logs covering Wi-Fi services and the network stack.|Collect when you find Wi-Fi or network issues.|```sudo journalctl -u hostapd.service -u wpa_supplicant.service -u ztpd.service -u systemd-networkd > network_log.txt```<br><br>```cat /etc/os-release && cat /etc/os-subrelease && cat /etc/adu-version && rpm -q ztpd > system_ver.txt```<br><br>Run both commands. Each command collects multiple logs and puts them into a single output.|

## Troubleshooting commands
Here's a set of commands that can be used for troubleshooting issues you may find with the dev kit. To run these commands, you must first connect to your dev kit [over SSH](./how-to-ssh-into-percept-dk.md). 

For more information on the Azure IoT Edge commands, see the [Azure IoT Edge device troubleshooting documentation](../iot-edge/troubleshoot.md). 

|Function         |When to use                    |Command                 |
|------------------|----------------------------|---------------------------|
|Checks the software version on the dev kit.|Use anytime you need confirm which software version is on your dev kit.|```cat /etc/adu-version```|
|Checks the temperature of the dev kit|Use in cases where you think the dev kit might be overheating.|```cat /sys/class/thermal/thermal_zone0/temp```|
|Checks the dev kit's telemetry ID|Use in cases where you need to know the dev kits unique telemetry identifier.|```sudo azure-device-health-id```|
|Checks the status of IoT Edge|Use whenever there are issues with IoT Edge modules connecting to the cloud.|```sudo iotedge check```|
|Restarts the Azure IoT Edge security daemon|Use when IoT Edge is unresponsive or not working correctly.|```sudo systemctl restart iotedge``` |
|Lists the deployed Azure IoT Edge modules|Uwe when you need to see all of the modules deployed on the dev kit|```sudo iotedge list``` |
|Displays the available/total space in the specified file system(s)|Use if you need to know the available storage on the dev kit.|```df [option] [file]```|
|Displays the dev kit's IP and interface information|Use when you need to know the dev kit's IP address.|`ip route get 1.1.1.1`        | 
|Display dev kit's IP address only|Use when you only want the dev kit's IP address and not the other interface information.|<code>ip route get 1.1.1.1 &#124; awk '{print $7}'</code> <br> `ifconfig [interface]` |

## USB update errors

|Error:                                    |Solution:                                               |
|------------------------------------------|--------------------------------------------------------|
|LIBUSB_ERROR_XXX during USB flash via UUU |This error is the result of a USB connection failure during UUU updating. If the USB cable isn't properly connected to the USB ports on the PC or the Percept DK carrier board, an error of this form will occur. Try unplugging and reconnecting both ends of the USB cable and jiggling the cable to ensure a secure connection.|

## Clearing hard drive space on the Azure Percept DK
There are two components that take up the hard drive space on the Azure Percept DK, the docker container logs and the docker containers themselves. To ensure the container logs don't take up all fo the hard space, the Azure Percept DK has log rotation built in which rotates out any old logs as new logs get generated.

For situations when the number of docker containers cause hard drive space issues you can delete unused containers by following these steps:
1. [SSH into the dev kit](./how-to-ssh-into-percept-dk.md)
1. Run this command:
    `docker system prune`

This will remove all unused containers, networks, images and optionally, volumes. [Go to this page](https://docs.docker.com/engine/reference/commandline/system_prune/) for more details.

## Azure Percept DK carrier board LED states

There are three small LEDs on top of the carrier board housing. A cloud icon is printed next to LED 1, a Wi-Fi icon is printed next to LED 2, and an exclamation mark icon is printed next to LED 3. See the table below for information on each LED state.

|LED             |State      |Description                      |
|----------------|-----------|---------------------------------|
|LED 1 (IoT Hub) |On (solid) |Device is connected to an IoT Hub. |
|LED 2 (Wi-Fi)   |Slow blink |Device is ready to be configured by Wi-Fi Easy Connect and is announcing its presence to a configurator. |
|LED 2 (Wi-Fi)   |Fast blink |Authentication was successful, device association in progress. |
|LED 2 (Wi-Fi)   |On (solid) |Authentication and association were successful; device is connected to a Wi-Fi network. |
|LED 3           |NA         |LED not in use. |