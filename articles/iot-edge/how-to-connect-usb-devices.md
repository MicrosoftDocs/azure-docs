---
title: How to connect a USB device to Azure IoT Edge for Linux on Windows | Microsoft Docs
description: How to connect a USB device using USB over IP to the Azure IoT Edge for Linux on Windows (EFLOW) virtual machine.
author: PatAltimore

ms.service: iot-edge
services: iot-edge
ms.topic: conceptual
ms.date: 07/25/2022
ms.author: fcabrera
---

# How to connect a USB device to Azure IoT Edge for Linux on Windows

[!INCLUDE [iot-edge-version-1.4](includes/iot-edge-version-1.4.md)]

In some scenarios, your workloads need to get data or communicate with USB devices. Because Azure IoT Edge for Linux on Windows (EFLOW) runs as a virtual machine, you need to connect these devices to the virtual machine. This article guides you through the steps necessary to connect a USB device to the EFLOW virtual machine using the USB/IP open-source project named [usbipd-win](https://github.com/dorssel/usbipd-win).

Setting up the USB/IP project on your Windows machine enables common developer USB scenarios like flashing an Arduino, connecting a USB serial device, or accessing a smartcard reader directly from the EFLOW virtual machine. 

> [!WARNING]
> *USB over IP* provides a generic mechanism for redirecting USB devices using the network between the Windows host OS and the EFLOW virtual machine. Some devices that are sensitive to network latency might experience issues. Additionally, some devices might not function as expected due to driver compatibility issues. Ensure that your devices work as expected before deploying to production. For more information about USB/IP tested devices, see [USBIP-Win - Wiki - Tested Devices](https://github.com/dorssel/usbipd-win/wiki/Tested-Devices).

## Prerequisites

- Azure IoT Edge for Linux on Windows 1.3.1 update or higher. For more information about EFLOW release notes, see [EFLOW Releases](https://aka.ms/AzEFLOW-Releases).
- A machine with an x64/x86 processor is required, *usbipd-win* doesn't support ARM64.

> [!NOTE]
>  To check your Azure IoT Edge for Linux on Windows version, go to _Add or Remove Programs_ and then search for _Azure IoT Edge_. The installed version is listed under _Azure IoT Edge_. If you need to update to the latest version, see [Azure IoT Edge for Linux on Windows updates](./iot-edge-for-linux-on-windows-updates.md).

## Install the UsbIp-Win project

Support for connecting USB devices isn't natively available with EFLOW. You'll need to install the open-source [usbipd-win](https://github.com/dorssel/usbipd-win) project using the following steps:

1. Go to the [latest release page for the usbipd-win](https://github.com/dorssel/usbipd-win/releases) project.
1. Choose and download the _usbipd-win_x.y.z.msi_ file. (You may get a warning asking you to confirm that you trust the downloaded installer).
1. Run the downloaded _usbipd-win_x.y.z.msi_ installer file.

> [!NOTE]
> Alternatively, you can also install the usbipd-win project using [Windows Package Manager](/windows/package-manager/winget/) (_winget_). If you have already installed _winget_, use the command: `winget install --interactive --exact dorssel.usbipd-win` to install usbipd-win. If you don't use the `--interactive` parameter, _winget_ may immediately restart your computer if needed to install the drivers.

The UsbIp-Win installs:

- A service called `usbipd` (USBIP Device Host). You can check the status of this service using the *Services* app in Windows.
- A command line tool `usbipd`. The location of this tool is added to the PATH environment variable.
- A firewall rule called `usbipd` to allow all local subnets to connect to the service. You can modify this firewall rule to fine tune access control.

At this point, a service is running on Windows to share USB devices, and the necessary tools are installed in the EFLOW virtual machine to attach to shared devices.

> [!WARNING]
> If you have an open PowerShell session, make sure to close it and open a new one to load the `usbipd` command line tool. 

## Attach a USB device to the EFLOW VM

The following steps provide a sample EFLOW PowerShell cmdlet to attach a USB device to the EFLOW VM. If you want to manually execute the needed commands, see [How to use usbip-win](https://github.com/dorssel/usbipd-win).

> [!IMPORTANT]
> The following functions are samples that are not meant to be used in production deployments. For production use, ensure you validate the functionality and create your own functions based on these samples. The sample functions are subject to change and deletion.

1. Go to [EFLOW-Util](https://github.com/Azure/iotedge-eflow/tree/main/eflow-util/eflow-usbip) and download the EFLOW-USBIP sample PowerShell module.

1. Open an elevated PowerShell session by starting with **Run as Administrator**.

1. Import the downloaded EFLOW-USBIP module.
    ```powershell
    Import-Module "<path-to-module>/EflowUtil-Usbip.psm1"
    ```

1. List all of the USB devices connected to Windows.
    ```powershell
    Get-EflowUSBDevices
    ```

1. List all the network interfaces and get the Windows host OS IP address
    ```powershell
    ipconfig
    ```

1. Select the *bus ID* of the device you'd like to attach to the EFLOW.
    ```powershell
    Add-EflowUSBDevices -busid <busid> -hostIp <host-ip>
    ```

1. Check the device was correctly attached to the EFLOW VM.
    ```powershell
    Invoke-EflowVmCommand "lsusb"
    ```

1. Once you're finished using the device in EFLOW, you can either physically disconnect the USB device or run this command from an elevated PowerShell session.
     ```powershell
    Remove-EflowUSBDevices -busid <busid>
    ```
> [!IMPORTANT]
> The attachment from the EFLOW VM to the USB device does not persist across reboots. To attach the USB device after reboot, you may need to create a bash script that runs during startup and connects the device using the `usbip` bash command. For more information about how to attach the device on the EFLOW VM side, see [Add-EflowUSBDevices](https://github.com/Azure/iotedge-eflow/blob/main/eflow-util/eflow-usbip/EflowUtil-Usbip.psm1).

To learn more about how USB over IP, see the [Connecting USB devices to WSL](https://devblogs.microsoft.com/commandline/connecting-usb-devices-to-wsl/#how-it-works) and the [usbipd-win repo on GitHub](https://github.com/dorssel/usbipd-win/wiki).

## Next steps

Follow the steps in [How to develop IoT Edge modules with Linux containers using IoT Edge for Linux on Windows.](./tutorial-develop-for-linux-on-windows.md) to develop and debug a module with IoT Edge for Linux on Windows.
