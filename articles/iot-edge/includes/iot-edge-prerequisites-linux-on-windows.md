---
ms.topic: include
ms.date: 12/23/2022
author: PatAltimore
ms.author: patricka
ms.service: iot-edge
services: iot-edge
---

### Device requirements

A Windows device with the following minimum requirements:

* System Requirements
   * Windows 10<sup>1</sup>/11 (Pro, Enterprise, IoT Enterprise)
   * Windows Server 2019<sup>1</sup>/2022  
   <sub><sup>1</sup> Windows 10 and Windows Server 2019 minimum build 17763 with all current cumulative updates installed.</sub>

* Hardware requirements
  * Minimum Free Memory: 1 GB
  * Minimum Free Disk Space: 10 GB

* Virtualization support
  * On Windows 10, enable Hyper-V. For more information, see [Install Hyper-V on Windows 10](/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v).
  * On Windows Server, install the Hyper-V role and create a default network switch. For more information, see [Nested virtualization for Azure IoT Edge for Linux on Windows](../nested-virtualization.md).
  * On a virtual machine, configure nested virtualization. For more information, see [nested virtualization](../nested-virtualization.md).

* Networking support
  * Windows Server does not come with a default switch. Before you can deploy EFLOW to a Windows Server device, you need to create a virtual switch.  For more information, see [Create virtual switch for Linux on Windows](../how-to-create-virtual-switch.md).
  * Windows Desktop versions come with a default switch that can be used for EFLOW installation. If needed, you can create your own custom virtual switch.

> [!TIP]
> If you want to use **GPU-accelerated Linux modules** in your Azure IoT Edge for Linux on Windows deployment, there are several configuration options to consider.
>
> You will need to install the correct drivers depending on your GPU architecture, and you may need access to a Windows Insider Program build. To determine your configuration needs and satisfy these prerequisites, see [GPU acceleration for Azure IoT Edge for Linux on Windows](../gpu-acceleration.md).
>
> Make sure you take the time to satisfy the prerequisites for GPU acceleration now. You will need to restart the installation process if you decide you want GPU acceleration during installation.

### Developer tools

Prepare your target device for the installation of Azure IoT Edge for Linux on Windows and the deployment of the Linux virtual machine:

1. Set the execution policy on the target device to `AllSigned`. You can check the current execution policy in an elevated PowerShell prompt using the following command:

   ```powershell
   Get-ExecutionPolicy -List
   ```

   If the execution policy of `local machine` is not `AllSigned`, you can set the execution policy using:

   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy AllSigned -Force
   ```

For more information on the Azure IoT Edge for Linux on Windows PowerShell module, see the [PowerShell functions reference](../reference-iot-edge-for-linux-on-windows-functions.md).
