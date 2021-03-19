---
title: Troubleshoot general issues with Azure Percept DK and IoT Edge
description: Get troubleshooting tips for some of the more common issues with Azure Percept DK
author: mimcco
ms.author: mimcco
ms.service: azure-percept
ms.topic: how-to
ms.date: 02/18/2021
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Azure Percept DK (dev kit) troubleshooting

See the guidance below for general troubleshooting tips for the Azure Percept DK.

## General troubleshooting commands

To run these commands, 
1. Connect to the [dev kit's Wi-Fi AP](./quickstart-percept-dk-set-up.md)
1. [SSH into the dev kit](./how-to-ssh-into-percept-dk.md)
1. Enter the commands in the SSH terminal

To redirect any output to a .txt file for further analysis, use the following syntax:

```console
sudo [command] > [file name].txt
```

Change the permissions of the .txt file so it can be copied:

```console
sudo chmod 666 [file name].txt
```

After redirecting output to a .txt file, copy the file to your host PC via SCP:

```console
scp [remote username]@[IP address]:[remote file path]/[file name].txt [local host file path]
```

```[local host file path]``` refers to the location on your host PC that you would like to copy the .txt file to. ```[remote username]``` is the SSH username chosen during the [setup experience](./quickstart-percept-dk-set-up.md). If you did not set up an SSH login during the OOBE, your remote username is ```root```.

For additional information on the Azure IoT Edge commands, see the [Azure IoT Edge device troubleshooting documentation](https://docs.microsoft.com/azure/iot-edge/troubleshoot).

|Category:         |Command:                    |Function:                  |
|------------------|----------------------------|---------------------------|
|OS                |```cat /etc/os-release```         |check Mariner image version |
|OS                |```cat /etc/os-subrelease```      |check derivative image version |
|OS                |```cat /etc/adu-version```        |check ADU version |
|Temperature       |```cat /sys/class/thermal/thermal_zone0/temp``` |check temperature of devkit |
|Wi-Fi             |```sudo journalctl -u hostapd.service``` |check SoftAP logs|
|Wi-Fi             |```sudo journalctl -u wpa_supplicant.service``` |check Wi-Fi services logs |
|Wi-Fi             |```sudo journalctl -u ztpd.service```  |check Wi-Fi Zero Touch Provisioning Service logs |
|Wi-Fi             |```sudo journalctl -u systemd-networkd``` |check Mariner Network stack logs |
|Wi-Fi             |```sudo cat /etc/hostapd/hostapd-wlan1.conf``` |check wifi access point configuration details |
|OOBE              |```sudo journalctl -u oobe -b```       |check OOBE logs |
|Telemetry         |```sudo azure-device-health-id```      |find unique telemetry HW_ID |
|Azure IoT Edge          |```sudo iotedge check```          |run configuration and connectivity checks for common issues |
|Azure IoT Edge          |```sudo iotedge logs [container name]``` |check container logs, such as speech and vision modules |
|Azure IoT Edge          |```sudo iotedge support-bundle --since 1h``` |collect module logs, Azure IoT Edge security manager logs, container engine logs, ```iotedge check``` JSON output, and other useful debug information from the past hour |
|Azure IoT Edge          |```sudo journalctl -u iotedge -f``` |view the logs of the Azure IoT Edge security manager |
|Azure IoT Edge          |```sudo systemctl restart iotedge``` |restart the Azure IoT Edge Security Daemon |
|Azure IoT Edge          |```sudo iotedge list```           |list the deployed Azure IoT Edge modules |
|Other             |```df [option] [file]```          |display information on available/total space in specified file system(s) |
|Other             |`ip route get 1.1.1.1`        |display device IP and interface information |
|Other             |<code>ip route get 1.1.1.1 &#124; awk '{print $7}'</code> <br> `ifconfig [interface]` |display device IP address only |


The ```journalctl``` Wi-Fi commands can be combined into the following single command:

```console
sudo journalctl -u hostapd.service -u wpa_supplicant.service -u ztpd.service -u systemd-networkd -b
```

## Docker troubleshooting commands

|Command:                        |Function:                  |
|--------------------------------|---------------------------|
|```sudo docker ps``` |[shows which containers are running](https://docs.docker.com/engine/reference/commandline/ps/) |
|```sudo docker images``` |[shows which images are on the device](https://docs.docker.com/engine/reference/commandline/images/)|
|```sudo docker rmi [image id] -f``` |[deletes an image from the device](https://docs.docker.com/engine/reference/commandline/rmi/) |
|```sudo docker logs -f edgeAgent``` <br> ```sudo docker logs -f [module_name]``` |[takes container logs of specified module](https://docs.docker.com/engine/reference/commandline/logs/) |
|```sudo docker image prune``` |[removes all dangling images](https://docs.docker.com/engine/reference/commandline/image_prune/) |
|```sudo watch docker ps``` <br> ```watch ifconfig [interface]``` |check docker container download status |

## USB Updating

|Error:                                    |Solution:                                               |
|------------------------------------------|--------------------------------------------------------|
|LIBUSB_ERROR_XXX during USB flash via UUU |This error is the result of a USB connection failure during UUU updating. If the USB cable is not properly connected to the USB ports on the PC or the PE-10X, an error of this form will occur. Try unplugging and replugging both ends of the USB cable and jiggling the cable to ensure a secure connection. This almost always solves the issue. |

## Azure Percept DK carrier board LED states

There are three small LEDs on top of the carrier board housing. A cloud icon is printed next to LED 1, a Wi-Fi icon is printed next to LED 2, and an exclamation mark icon is printed next to LED 3. See the table below for information on each LED state.

|LED             |State      |Description                      |
|----------------|-----------|---------------------------------|
|LED 1 (IoT Hub) |On (solid) |Device is connected to an IoT Hub. |
|LED 2 (Wi-Fi)   |Slow blink |Device is ready to be configured by Wi-Fi Easy Connect and is announcing its presence to a configurator. |
|LED 2 (Wi-Fi)   |Fast blink |Authentication was successful, device association in progress. |
|LED 2 (Wi-Fi)   |On (solid) |Authentication and association were successful; device is connected to a Wi-Fi network. |
|LED 3           |NA         |LED not in use. |


