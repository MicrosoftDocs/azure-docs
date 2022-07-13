---
title: Connect USB devices to Azure IoT Edge for Linux on Windows | Microsoft Docs
description: Connect a USB device to the Azure IoT Edge for Linux on Windows virtual machine
author: PatAltimore
ms.reviewer: fcabrera
ms.service: iot-edge
services: iot-edge
ms.topic: conceptual
ms.date: 07/13/2022
ms.author: patricka
---

# Azure IoT Edge for Linux on Windows virtual USB device connection

In some scenarios, your workloads need to get data or communicate with USB devices. Because Azure IoT Edge for Linux on Windows (EFLOW) runs as a virtual machine, you need to connect these devices to the virtual machine. This guide will walk through the steps necessary to connect a USB device to the EFLOW virtual machine  using the USB/IP open-source project, [usbipd-win](https://github.com/dorssel/usbipd-win).

Setting up the USB/IP project on your Windows machine will enable common developer USB scenarios like flashing an Arduino or accessing a smartcard reader directly from the EFLOW virtual machine. 

## Prerequisites

- Azure IoT Edge for Linux on Windows 1.2.10 update or higher. For more information about EFLOW release notes, see [EFLOW Releases](https://aka.ms/AzEFLOW-Releases).
- A machine with an x64/x86 processor is required. (Arm64 is currently not supported with usbipd-win).

> [!NOTE]
>  To check your Azure IoT Edge for Linux on Windows version, go to _Add or Remove Programs_ and then search for _Azure IoT Edge_. You should see the installed version under _Azure IoT Edge_. If you need to update to the latest version, see [Azure IoT Edge for Linux on Windows udpates](./iot-edge-for-linux-on-windows-updates.md).

## Install the UsbIp-Win project

Support for connecting USB devices isn't natively available with EFLOW, so you'll need to install the open-source [usbipd-win](https://github.com/dorssel/usbipd-win) project.

1. Go to the [latest release page for the usbipd-win](https://github.com/dorssel/usbipd-win/releases) project.
1. Select and download the _usbipd-win_x.y.z.msi_ file. (_You may get a warning asking you to confirm that you trust this download_).
1. Run the downloaded _usbipd-win_x.y.z.msi_ installer file.

> [!NOTE]
>Alternatively, you can also install the usbipd-win project using [Windows Package Manager](/windows/package-manager/winget/) (_winget_). If you have already installed _winget_, just use the command: `winget install --interactive --exact dorssel.usbipd-win` to install usbipd-win. If you leave out `--interactive`, _winget_ may immediately restart your computer if that is required to install the drivers.

The _winget_ command will install:

- A service called `usbipd` (display name: USBIP Device Host). You can check the status of this service using the Services app from Windows.
- A command line tool `usbipd`. The location of this tool will be added to the PATH environment variable.
- A firewall rule called `usbipd` to allow all local subnets to connect to the service. You can modify this firewall rule to fine tune access control.

At this point a service is running on Windows to share USB devices, and the necessary tools are installed in the EFLOW virtual machine to attach to shared devices.

## Attach a USB device to the EFLOW VM

The following steps in this section provide sample EFLOW PowerShell cmdlet to attach a USB device to the EFLOW VM. If you want to manually execute the needed commands, check [How to use usbip-win](https://github.com/dorssel/usbipd-win).

> [!IMPORTANT]
The following PowerShell cmdlets are a sample code that are not meant to be used in production deployments. Furthermore, cmdlets are subject to change and deletion. Make sure you create your own functions based on these samples.

1. Go to [EFLOW-Util](https://github.com/Azure/iotedge-eflow/tree/main/eflow-util) and download the EFLOW-USBIP sample PowerShell module.

1. Open PowerShell in an elevated session. You can do so by opening the **Start** pane on Windows and typing in "PowerShell". Right-click the **Windows PowerShell** app that shows up and select **Run as administrator**.

1. Import the downloaded EFLOW-USBIP module
    ```powershell
    Import-Module "<path-to-module>/EFLOW-USBIP.psm1"
    ```

1. List all of the USB devices connected to Windows using the following command:
    ```powershell
    List-EflowUSBDevices
    ```

1. Select the bus ID of the device you’d like to attach to the EFLOW and use the following command:
    ```powershell
    Add-EflowUSBDevices --busid <busid>
    ```

1. Check the device was correctly attached to the EFLOW VM
    ```powershell
    Invoke-EflowVmCommand `lsusb`
    ```

1. Once you're done using the device in EFLOW, you can either physically disconnect the USB device or run this command from PowerShell in administrator mode:
     ```powershell
    Remove-EflowUSBDevices --busid <busid>
    ```
> [!IMPORTANT]
> The attachment from the EFLOW VM side will not persist across reboots. In order to keep the USB device attached across reboots, you may need to create a bash script that runs during startup and connects the device using the `usbip` bash command. For more information about how to attach the device on the EFLOW VM side, see [Add-EflowUSBDevices](https://github.com/Azure/iotedge-eflow/blob/main/eflow-util/EflowUtil.psm1).

## Next steps
Follow the steps in [Install and provision Azure IoT Edge for Linux on a Windows device](how-to-provision-single-device-linux-on-windows-symmetric.md) to set up a device with IoT Edge for Linux on Windows.
