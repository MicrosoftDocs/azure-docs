---
title: Troubleshooting the Azure RTOS embedded device quickstarts
description: Steps to help you troubleshoot common issues when using the Azure RTOS embedded device quickstarts
author: timlt
ms.author: timlt
ms.service: iot-develop
ms.topic: troubleshooting
ms.date: 10/07/2022
ms.custom: engagement-fy23
---

# Troubleshooting the Azure RTOS embedded device quickstarts

As you follow the [Embedded device development quickstarts](quickstart-devkit-mxchip-az3166.md), you might experience some common issues. In general, issues can occur in any of the following sources:

* **Your environment**. Your machine, software, or network setup and connection.
* **Your Azure IoT resources**. The IoT hub and device that you created to connect to Azure IoT.
* **Your device**. The physical board and its configuration.

This article provides suggested resolutions for the most common issues that can occur as you complete the quickstarts.

## Prerequisites

All the troubleshooting steps require that you've completed the following prerequisites for the quickstart you're working in:

* You installed or acquired all prerequisites and software tools for the quickstart.
* You created an Azure IoT hub or Azure IoT Central application, and registered a device, as directed in the quickstart.
* You built an image for the device, as directed in the quickstart.

## Issue: The source directory doesn't contain CMakeLists.txt file
### Description
This issue can occur when you attempt to build the project. It's the result of the project being incorrectly cloned from GitHub. The project contains multiple submodules that won't be cloned by default unless the **--recursive** flag is used.

### Resolution
* When you clone the repository using Git, confirm that the **--recursive** option is present.

## Issue: The build fails

### Description

The issue can occur because the path to an object file exceeds the default maximum path length in Windows. Examine the build output for a message similar to the following example:

```output
-- Configuring done
CMake Warning in C:/embedded quickstarts/areallyreallyreallylongpath/getting-started/core/lib/netxduo/addons/azure_iot/azure_iot_security_module/iot-security-module-core/CMakeLists.txt:
  The object file directory

    C:/embedded quickstarts/areallyreallyreallylongpath/getting-started/NXP/MIMXRT1060-EVK/build/lib/netxduo/addons/azure_iot/azure_iot_security_module/iot-security-module-core/CMakeFiles/asc_security_core.dir/./

  has 208 characters.  The maximum full path to an object file is 250
  characters (see CMAKE_OBJECT_PATH_MAX).  Object file

    src/serializer/extensions/custom_builder_allocator.c.obj

  cannot be safely placed under this directory.  The build may not work
  correctly.


-- Generating done
```

### Resolution

You can try one of the following options to resolve this error:
* Clone the repository into a directory with a shorter path and try again.
* Follow the instructions in [Maximum Path Length Limitation](/windows/win32/fileio/maximum-file-path-limitation) to enable long paths in Windows 11 and Windows 10, version 1607 and later.

## Issue: Device can't connect to Iot hub

### Description

The issue can occur after you've created Azure resources, and flashed your device. When you try to connect your newly flashed device to Azure IoT, you see a console message like the following example:

```output
Unable to resolve DNS for MQTT Server
```

### Resolution

* Check the spelling and case of the configuration values you entered for your IoT configuration in the file *azure_config.h*. The values for some IoT resource attributes, such as `deviceID` and `primaryKey`, are case-sensitive.

## Issue:  Wi-Fi is unable to connect

### Description

After you flash a device that uses a Wi-Fi connection, you get an error message that Wi-Fi is unable to connect.

### Resolution

* Check your Wi-Fi network frequency and settings. The devices used in the embedded device quickstarts all use 2.4 GHz. Confirm that your Wi-Fi router is configured to support a 2.4-GHz network.
* Check the Wi-Fi mode. Confirm what setting you used for the WIFI_MODE constant in the *azure_config.h* file. Check your Wi-Fi network security or authentication settings to confirm that the Wi-Fi security mode matches what you have in the configuration file.

## Issue: Flashing the board fails

### Description

You can't complete the process of flashing your device. The following symptoms indicate that flashing is incomplete:

* The **.bin* image file that you built doesn't copy to the device.
* The utility that you're using to flash the device gives a warning or error.
* The utility that you're using to flash the device doesn't say that programming completed successfully.

### Resolution

* Make sure you're connected to the correct USB port on the device. Some devices have more than one port.
* Try using a different Micro USB cable. Some devices and cables are incompatible.
* Try connecting to a different USB port on your computer. A USB port might be disconnected internally, disabled in software, or temporarily in an unusable state.
* Restart your computer.

## Issue: Device fails to connect to port

### Description

After you flash your device and connect it to your computer, you get output like the following message in your terminal software:

```output
Failed to initialize the port.
Please verify the COM port settings.
```

### Resolution

* In the settings for your terminal software, check the **Port** setting to confirm that the correct port is selected. If there are multiple ports displayed, you can open Windows Device Manager and select the **Ports** node to find the correct port for your connected device.

## Issue: Terminal output shows garbled text

### Description

After you flash your device successfully and connect it to your computer, you see garbled text output in your terminal software.

### Resolution

* In the settings for your terminal software, confirm that the **Baud rate** setting is *115,200*.

## Issue: Terminal output shows no text

### Description

After you flash your device successfully and connect it to your computer, you see no output in your terminal software.

### Resolution

* Confirm that the settings in your terminal software match the settings in the quickstart.
* Restart your terminal software.
* Press the **Reset** button on your device.
* Confirm that your USB cable is properly connected.

## Issue: Communication between device and IoT Hub fails

### Description

After you flash your device and connect it to your computer, you get output like the following message in your terminal window:

```output
Failed to publish temperature
```

### Resolution

* Confirm that the *Pricing and scale tier* is one of *Free* or *Standard*. **Basic is not supported** as it doesn't support cloud-to-device and device twin communication.

## Issue: Extra messages sent when connecting to IoT Central or IoT Hub

### Description

Because [Defender for IoT module](../defender-for-iot/device-builders/iot-security-azure-rtos.md) is enabled by default from the device end, you might observe extra messages in the output.

### Resolution

* To disable it, define `NX_AZURE_DISABLE_IOT_SECURITY_MODULE` in the NetX Duo header file `nx_port.h`.

## Next steps

If after reviewing the issues in this article, you still can't monitor your device in a terminal or connect to Azure IoT, there might be an issue with your device's hardware or physical configuration. See the manufacturer's page for your device to find documentation and support options.

* [STMicroelectronics B-L475E-IOT01](https://www.st.com/content/st_com/en/products/evaluation-tools/product-evaluation-tools/mcu-mpu-eval-tools/stm32-mcu-mpu-eval-tools/stm32-discovery-kits/b-l475e-iot01a.html)
* [NXP MIMXRT1060-EVK](https://www.nxp.com/design/development-boards/i-mx-evaluation-and-development-boards/mimxrt1060-evk-i-mx-rt1060-evaluation-kit:MIMXRT1060-EVK)
* [Microchip ATSAME54-XPro](https://www.microchip.com/developmenttools/productdetails/atsame54-xpro)