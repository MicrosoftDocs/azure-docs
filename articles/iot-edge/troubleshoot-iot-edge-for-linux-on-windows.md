---
title: Troubleshoot - Azure IoT Edge for Linux on Windows | Microsoft Docs 
description: Use this article to learn standard diagnostic skills for Azure IoT Edge for Linux on Windows, like retrieving component status and logs
author: PatAltimore

ms.author: PatAltimore
ms.date: 05/04/2021
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Troubleshoot your IoT Edge for Linux on Windows device

[!INCLUDE [iot-edge-version-201806-or-202011](../../includes/iot-edge-version-201806-or-202011.md)]

If you experience issues running Azure IoT Edge for Linux on Windows (EFLOW) in your environment, use this article as a guide for troubleshooting and diagnostics. Also, ensure to check [IoT Edge for Linux on Windows GitHub](https://github.com/Azure/iotedge-eflow) issues. 

## Isolate the issue

Your first step when troubleshooting IoT Edge for Linux on Windows should be to understand which component is causing the issue. The are three main components that are part of EFLOW solution:
- Windows components: PowerShell module, WSSDAgent & EFLOWProxy
- CBL Mariner Linux virtual machine
- Azure IoT Edge 

For more information about EFLOW architecture, see [What is Azure IoT Edge for Linux on Windows](iot-edge-for-linux-on-windows.md). 

If the issue is when trying to install or deploy the EFLOW virtual machine, make sure that all the prerequisites are met, and you followed all the networking and VM configuration correctly. If the installation and deployment was successful and you're facing issues with the post VM management,  generally the problems are related to VM lifecycle, networking or Azure IoT Edge. Finally, if the issue is related to modules or IoT Edge features, check [Troubleshoot your IoT Edge device](troubleshoot.md).

For more information about common errors related to Installation & Deployment, Provisioning, Interaction with the VM and Networking, see [Common issues and resolutions for Azure IoT Edge for Linux on Windows](troubleshoot-iot-edge-for-linux-on-windows-common-errors.md).

## Gather debug information

When you need to gather logs from an IoT Edge for Linux on Windows device, the most convenient way is to use the `Get-EflowLogs` PowerShell cmdlet. By default, this command collects the following logs:
- **eflowlogs-summarty.txt**: contains the status of all log collection steps.
- **EFLOW VM configuration**: includes the VM configurations, networking configurations, passthroughs and more information. 
- **EFLOW Events** : Windows events related to the VM lifecycle and EFLOWProxy service.
- **IoT Edge logs**: including the output of running `iotedge check` and getting the IoT Edge runtime support bundle.
- **WSSDAgent logs**: includes all the logs related to the WSSDAgent service.

After gathering all the required logs, the cmdlet compresses all the files into a single file named _eflowlogs.zip_ under the EFLOW installation path (generally _C:\Program Files\Azure IoT Edge_).

## Check your IoT Edge version

If you're running an older version of IoT Edge for Linux on Windows, then upgrading may resolve your issue. The IoT. To check your EFLOW installed version  on your device, use the following steps:

1. Open Settings on Windows.
1. Select Add or Remove Programs.
1. Depending on the EFLOW train being used (Continuous Release or LTS), select Azure IoT Edge LTS or Azure IoT Edge.
1. Check the version under the app name.

For more information about specific versions release notes, check [Azure IoT Edge for Linux on Windows release notes](https://aka.ms/AzEFLOW-Releases). 

For instructions on how to update your device, see [Update IoT Edge for Linux on Windows](iot-edge-for-linux-on-windows-updates.md).

## Check the EFLOW VM status

You can verify the EFLOW VM status and information by using the `Get-EflowVm` PowerShell cmdlet. If the EFLOW VM is up and running **VmPowerState** output should be _Running_, whereas if the VM is stopped, the output will be _Off_. To start or stop the EFLOW VM, you can use the `Start-EflowVm` and `Stop-EflowVm` cmdlet. 

If the VM is _Running_ but you can't interact or access the VM, there's probably a networking issue between the VM and the Windows host OS.  Also, make sure that the EFLOW VM has enough memory and storage available to continue with normal execution. When running the `Get-EflowVm` cmdlet, you can see the memory(_TotalMemMb_, _UsedMemMb_, _AvailableMemMb_) and storage(_TotalStorageMb_, _UsedStorageMb_, _AvailableStorageMb_) information. 

Finally, if the VM is _Off_ and you can't turn it on using the `Start-EflowVm`, there may be several reasons why the VM can't be started. 

First, the issue could be related to the VM lifecycle management service (_WSSDAgent_) isn't running. Ensure that the _WSSDAgent_ service is running. 

1. Start an elevated _PowerShell_ session using **Run as Administrator**.
1. Check the service status
    ```powershell
    Get-Service -Name WSSDAgent
    ```
1. If the service is **Stopped**, start the service using the following command:
    ```powershell
    Start-Service -Name WSSDAgent
    ```
1. If the service is **Running**, the issue it's probably related to a networking misconfiguration, or lack of resources to create the VM.

Secondly, the issue could be related to lack of resources. During EFLOW deployment, using the `Deploy-Eflow` PowerShell cmdlet, or after using the `Set-EflowVm` cmdlet, the user can set the _EflowVmAssignedMemory_ (`-memoryInMb`) and _EflowVmAssignedCPUcores_ (`-cpuCount`) assigned to the VM. If these resources aren't available when trying to start the VM, the VM will fail to start. To check the resources assigned and available, use the following steps:

1. Start an elevated _PowerShell_ session using **Run as Administrator**.
1. Check the available memory. Ensure that the _FreePhysicalMemory_ > _EflowVmAssignedMemory_.
    ```powershell
    Get-CIMInstance Win32_OperatingSystem | Select FreePhysicalMemory
    ```
1. Check the available CPU cores. Ensure that  _NumberOfLogicalProcessors_ > _EflowVmAssignedCPUcores_.
   ```powershell
    wmic cpu get NumberOfLogicalProcessors
    ```

Finally, the issue could be related to networking. For more information about EFLOW VM networking issues, check [How to troubleshoot Azure IoT Edge for Linux on Windows networking](./troubleshoot-common-errors.md).

## Check the status of the IoT Edge runtime

The [IoT Edge runtime](./iot-edge-runtime.md) is responsible for receiving the code to run at the edge and communicate the results. If IoT Edge runtime isn't running, all the code/workloads won't run, and hence the no code will run at the edge. You can check the runtime and modules statuses using the following steps.

1. Start an elevated _PowerShell_ session using **Run as Administrator**.
1. Check the IoT Edge runtime status. In particular, check if the service is **Loaded** and **Active**. 
    ```powershell
    (Get-EflowVm).EdgeRuntimeStatus.SystemCtlStatus | Format-List
    ```
1. Check the IoT Edge modules status. Check tht the modules are running
     ```powershell
    (Get-EflowVm).EdgeRuntimeStatus.ModuleList | Format-List
    ```

For more information about IoT Edge runtime troubleshooting, check [Troubleshoot your IoT Edge device](./troubleshoot.md).

## Check TPM passthrough

If you're using the TPM provisioning, following the guide [Create and provision an IoT Edge for Linux on Windows device at scale by using a TPM](./how-to-provision-devices-at-scale-linux-on-windows-tpm.md), you must enable TPM passthrough. In order to access the physical TPM connected to the Windows host OS, all the EFLOW VM TPM commands are forwarded to the host OS through a Windows serviced called _EFLOWProxy_. If you experience issues using _DpsTpm_ provisioning, or accessing TPM indexes from the EFLOW VM, check the following steps.

1. Start an elevated _PowerShell_ session using **Run as Administrator**.
1. Check the status of the _EFLOWProxy_ service.
    ```powershell
    Get-Service -Name EFLOWProxy
    ```
1. If the service is **Stopped**, start the service using the following command:
    ```powershell
    Start-Service -Name EFLOWProxy
    ```
   If the service won't start, check the _EFLOWProxy_ logs. Go _Apps_ -> _Event Viewer_ -> _Applications and Services Logs_ -> _Microsoft_ -> _EFLOW_ -> _EFLOWProxy_ and check the logs. 

1. If the service is **Running** then check the EFLOW VM proxy services. Start by connecting to the EFLOW VM
   ```powershell
   Connect-EflowVm
    ```
1. From inside the EFLOW VM, check the TPM services are up and running
   ```bash
   sudo systemctl status tpm*
   ```
   You should see the status and logs of four different services. The four services should be up and running.
    1. **tpm2-netns.service** - TPM2 Network Namespace
    1. **tpm2-socat@2322.service** - TPM2 Sandbox Service on Port 2322
    1. **tpm2-socat@2321.service** - TPM2 Sandbox Service on Port 2321
    1. **tpm2-abrmd.service** - TPM2 Access Broker and Resource Management Daemon

   If any of these services is **stopped** or **failed**, restart all services using the following command:
   
   ```bash
   sudo systemctl restart tpm*
   ```
   
1. Check communication between the EFLOW VM and the _EFLOWProxy_ works. If everything works correctly, you should see the _RegistrationId_ and the TPM _Endorsement Key_. 
   ```bash
   sudo /usr/bin/tpm_device_provision
   ```

## Check GPU Assignment

If you're using GPU passthrough, ensure to follow all the prerequisites, and configurations noted in [GPU acceleration for Azure IoT Edge for Linux on Windows](./gpu-acceleration.md). If you experience issues using GPU passthrough feature, check the following steps.

First, start by checking your device is available on the Windows host OS.

1. Open _Apps_ -> _Device Manager_
1. Go to _Display Adapters_ and check that your GPU is listed there.
1. Rick-click on the GPU name and select _Properties_.
1. Check that the driver is correctly installed.

Second, if the GPU is correctly assigned, but still not being able to use it inside the EFLOW VM, use the following steps.

1. Start an elevated _PowerShell_ session using **Run as Administrator**.
1. Connect to the EFLOW VM
    ```powershell
    Connect-EflowVm
    ```
1. If you're using NVIDIA GPU, check the passthrough status using the following command:
    ```bash
    sudo nvidia-smi
    ```
   You should be able to see the GPU card information, Driver version, CUDA version and the GPU system & processes information. 

1. If you're using Intel iGPU passthrough, check the passthrough status using the following command:
    ```bash
    sudo ls -al /dev/dxg
    ```
    The expected output should be similar to:
    ```
    crw-rw-rw- 1 root 10, 60  Sep  8 06:20 /dev/dxg
    ```
    For more performance and debugging information, see [Witness the power of Intel® iGPU with Azure IoT Edge for Linux on Windows(EFLOW) & OpenVINO™ Toolkit](https://community.intel.com/t5/Blogs/Tech-Innovation/Artificial-Intelligence-AI/Witness-the-power-of-Intel-iGPU-with-Azure-IoT-Edge-for-Linux-on/post/1382405).

## Check WSSDAgent logs for issues




## Last resort: reinstall EFLOW

Sometimes, a system might require significant special modification to work with existing networking or operating system constraints. For example, a system could require complex networking configurations (firewall, Windows policies, proxy settings) and custom Windows OS configurations. If you tried all steps above and still get EFLOW issues, it's possible that there's some misconfiguration that is causing the issue. In this case, the last resort option is to uninstall EFLOW and get a clean start from scratch. 




## Next steps

Do you think that you found a bug in the IoT Edge for Linux on Windows? [Submit an issue](https://github.com/Azure/iotedge-eflow/issues) so that we can continue to improve.

If you have more questions, create a [Support request](https://portal.azure.com/#create/Microsoft.Support) for help.
