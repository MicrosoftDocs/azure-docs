---
ms.topic: include
ms.date: 10/29/2021
author: PatAltimore
ms.author: patricka
ms.service: iot-edge
services: iot-edge
---

## Install IoT Edge

In this section, you prepare your Windows VM or physical device for IoT Edge. Then, you install IoT Edge.

Azure IoT Edge relies on an OCI-compatible container runtime. [Moby](https://github.com/moby/moby), a Moby-based engine, is included in the installation script, which means there are no additional steps to install the engine.

To install the IoT Edge runtime:

1. Run PowerShell as an administrator.

   Use an AMD64 session of PowerShell, not PowerShell(x86). If you're unsure which session type you're using, run the following command:

   ```powershell
   (Get-Process -Id $PID).StartInfo.EnvironmentVariables["PROCESSOR_ARCHITECTURE"]
   ```

2. Run the [Deploy-IoTEdge](../articles/iot-edge/reference-windows-scripts.md#deploy-iotedge) command, which performs the following tasks:

   * Checks that your Windows machine is on a supported version
   * Turns on the containers feature
   * Downloads the moby engine and the IoT Edge runtime

   ```powershell
   . {Invoke-WebRequest -useb https://aka.ms/iotedge-win} | Invoke-Expression; `
   Deploy-IoTEdge
   ```

3. Restart your device if prompted.

When you install IoT Edge on a device, you can use additional parameters to modify the process including:

* Direct traffic to go through a proxy server
* Point the installer to a local directory for offline installation

For more information about these additional parameters, see [PowerShell scripts for IoT Edge with Windows containers](../articles/iot-edge/reference-windows-scripts.md).
