---
title: How to install Azure IoT Edge on Windows with Linux containers | Microsoft Docs
description: Azure IoT Edge installation instructions on Windows with Linux containers
author: kgremban
manager: timlt
# this is the PM responsible
ms.reviewer: veyalla
ms.service: iot-edge
services: iot-edge
ms.topic: conceptual
ms.date: 06/27/2018
ms.author: kgremban
---
# Install Azure IoT Edge runtime on Windows to use with Linux containers

The Azure IoT Edge runtime is deployed on all IoT Edge devices. It has three components. The **IoT Edge security daemon** provides and maintains security standards on the Edge device. The daemon starts on every boot and bootstraps the device by starting the IoT Edge agent. The **IoT Edge agent** facilitates deployment and monitoring of modules on the Edge device, including the IoT Edge hub. The **IoT Edge hub** manages communications between modules on the IoT Edge device, and between the device and IoT Hub.

This article lists the steps to install the Azure IoT Edge runtime on your Windows x64 (AMD/Intel) system. Windows support is currently in Preview.

>[!NOTE]
Using Linux containers on Windows sytems is not a recommended or supported production configuration for Azure IoT Edge. However, it can be used for development and testing purposes.

## Supported Windows versions
Azure IoT Edge can be used for development and testing on following versions of Windows, when using Linux containers:
  * Windows 10 or newer desktop operating systems.
  * Windows Server 2016 or new server operating systems.

## Install the container runtime 

Azure IoT Edge relies on a [OCI-compatible][lnk-oci] container runtime (e.g. Docker). 

You can use [Docker for Windows][lnk-docker-for-windows] for development and testing. Ensure Docker for Windows is [configured to use Linux containers][lnk-docker-config]

## Install the Azure IoT Edge Security Daemon

>[!NOTE]
>Azure IoT Edge software packages are subject to the license terms located in the packages (in the LICENSE directory). Please read the license terms prior to using the package. Your installation and use of the package constitutes your acceptance of these terms. If you do not agree with the license terms, do not use the package.

### Download the Edge daemon package and install

In an Administrator PowerShell window, execute the following commands:

```powershell
Invoke-WebRequest https://aka.ms/iotedged-windows-latest -o .\iotedged-windows.zip
Expand-Archive .\iotedged-windows.zip C:\ProgramData\iotedge -f
Move-Item c:\ProgramData\iotedge\iotedged-windows\* C:\ProgramData\iotedge\ -Force
rmdir C:\ProgramData\iotedge\iotedged-windows
$sysenv = "HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Environment"
$path = (Get-ItemProperty -Path $sysenv -Name Path).Path + ";C:\ProgramData\iotedge"
Set-ItemProperty -Path $sysenv -Name Path -Value $path
```

Install the vcruntime using:

```powershell
Invoke-WebRequest -useb https://download.microsoft.com/download/0/6/4/064F84EA-D1DB-4EAA-9A5C-CC2F0FF6A638/vc_redist.x64.exe -o vc_redist.exe
.\vc_redist.exe /quiet /norestart
 ```

Create and start *iotedge* service:

```powershell
New-Service -Name "iotedge" -BinaryPathName "C:\ProgramData\iotedge\iotedged.exe -c C:\ProgramData\iotedge\config.yaml"
Start-Service iotedge
```

Add Firewall exceptions for the ports used by the service:

```powershell
New-NetFirewallRule -DisplayName "iotedged allow inbound 15580,15581" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 15580-15581 -Program "C:\programdata\iotedge\iotedged.exe" -InterfaceType Any
```

Create a **iotedge.reg** file with the following content, and import in to the Windows Registry by double-clicking it or using the `reg import iotedge.reg` command:

```
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\EventLog\Application\iotedged]
"CustomSource"=dword:00000001
"EventMessageFile"="C:\\ProgramData\\iotedge\\iotedged.exe"
"TypesSupported"=dword:00000007
```

## Configure the Azure IoT Edge Security Daemon

The daemon can be configured using the configuration file at `C:\ProgramData\iotedge\config.yaml`.

The edge device can be configured manually using a [device connection string][lnk-dcs] or [automatically via Device Provisioning Service][lnk-dps].

* For manual configuration, uncomment the **manual** provisioning mode. Update the value of **device_connection_string** with the connection string from your IoT Edge device.

   ```yaml
   provisioning:
     source: "manual"
     device_connection_string: "<ADD DEVICE CONNECTION STRING HERE>"
  
   # provisioning: 
   #   source: "dps"
   #   global_endpoint: "https://global.azure-devices-provisioning.net"
   #   scope_id: "{scope_id}"
   #   registration_id: "{registration_id}"
   ```

* For automatic configuration, uncomment the **dps** provisioning mode. Update the values of **scope_id** and **registration_id** with the values from your IoT Hub DPS instance and your IoT Edge device with TPM. 

   ```yaml
   # provisioning:
   #   source: "manual"
   #   device_connection_string: "<ADD DEVICE CONNECTION STRING HERE>"
  
   provisioning: 
     source: "dps"
     global_endpoint: "https://global.azure-devices-provisioning.net"
     scope_id: "{scope_id}"
     registration_id: "{registration_id}"
   ```

Get the name of edge device using `hostname` command in PowerShell and set it as the value for **hostname:** in the configuration yaml. For example:

```yaml
  ###############################################################################
  # Edge device hostname
  ###############################################################################
  #
  # Configures the environment variable 'IOTEDGE_GATEWAYHOSTNAME' injected into
  # modules.
  #
  ###############################################################################

  hostname: "edgedevice-1"
```

Next, provide the IP address and port for **workload_uri** and **management_uri** in the **connect:** and **listen:** sections of the configuration.

To retrieve your IP address, enter `ipconfig` in your PowerShell window. Copy the IP address of the **vEthernet (DockerNAT)**` interface as shown in the following example (the ip address on your system may be different):

![DockerNat][img-docker-nat]

Update the **workload_uri** and **management_uri** in the **connect:** section of the configuration file. Replace **\<GATEWAY_ADDRESS\>** with the DockerNAT IP address that you copied. 

```yaml
connect:
  management_uri: "http://<GATEWAY_ADDRESS>:15580"
  workload_uri: "http://<GATEWAY_ADDRESS>:15581"
```

Enter the same addresses in the **listen:** section.

```yaml
listen:
  management_uri: "http://<GATEWAY_ADDRESS>:15580"
  workload_uri: "http://<GATEWAY_ADDRESS>:15581"
```

In the PowerShell window, create an environment variable **IOTEDGE_HOST** with the **management_uri** address.

```powershell
[Environment]::SetEnvironmentVariable("IOTEDGE_HOST", "http://<GATEWAY_ADDRESS>:15580")
```

Persist the environment variable across reboots.

```powershell
SETX /M IOTEDGE_HOST "http://<GATEWAY_ADDRESS>:15580"
```

Finally, ensure the **network:** setting under **moby_runtime:** is uncommented and set to **azure-iot-edge**

```yaml
moby_runtime:
  docker_uri: "npipe://./pipe/docker_engine"
  network: "azure-iot-edge"
```

Save the configuration file and restart the service:

```powershell
Stop-Service iotedge -NoWait
sleep 5
Start-Service iotedge
```

## Verify successful installation

If you used the **manual configuration** steps in the previous section, the IoT Edge runtime should be successfully provisioned and running on your device. If you used the **automatic configuration** steps, then you need to complete some additional steps so that the runtime can register your device with your IoT hub on your behalf. For next steps, see [Create and provision a simulated TPM Edge device on Windows](how-to-auto-provision-simulated-device-windows.md#create-a-tpm-environment-variable).


You can check the status of the IoT Edge service by: 

```powershell
Get-Service iotedge
```

Examine service logs from the last 5 minutes using:

```powershell

# Displays logs from last 5 min, newest at the bottom.

Get-WinEvent -ea SilentlyContinue `
  -FilterHashtable @{ProviderName= "iotedged";
    LogName = "application"; StartTime = [datetime]::Now.AddMinutes(-5)} |
  select TimeCreated, Message |
  sort-object @{Expression="TimeCreated";Descending=$false}
```

And, list running modules with:

```powershell
iotedge list
```

## Next steps

If you are having problems with the Edge runtime installing properly, checkout the [troubleshooting][lnk-trouble] page.


<!-- Images -->
[img-docker-nat]: ./media/how-to-install-iot-edge-windows-with-linux/dockernat.png

<!-- Links -->
[lnk-docker-config]: https://docs.docker.com/docker-for-windows/#switch-between-windows-and-linux-containers
[lnk-dcs]: how-to-register-device-portal.md
[lnk-dps]: how-to-auto-provision-simulated-device-windows.md
[lnk-oci]: https://www.opencontainers.org/
[lnk-moby]: https://mobyproject.org/
[lnk-trouble]: troubleshoot.md
[lnk-docker-for-windows]: https://www.docker.com/docker-windows

