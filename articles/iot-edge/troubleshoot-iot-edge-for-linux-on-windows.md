---
title: Troubleshoot your IoT Edge for Linux on Windows device | Microsoft Docs 
description: Learn standard diagnostic skills for troubleshooting Azure IoT Edge for Linux on Windows (EFLOW) like retrieving component status and logs.
author: PatAltimore
ms.author: fcabrera
ms.date: 11/15/2022
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Troubleshoot your IoT Edge for Linux on Windows device

[!INCLUDE [iot-edge-version-1.4](includes/iot-edge-version-1.4.md)]

If you experience issues running Azure IoT Edge for Linux on Windows (EFLOW) in your environment, use this article as a guide for troubleshooting and diagnostics. 

You can also check [IoT Edge for Linux on Windows GitHub issues](https://github.com/Azure/iotedge-eflow/issues?q=is%3Aissue) for a similar reported issue.

## Isolate the issue

Your first step when troubleshooting IoT Edge for Linux on Windows should be to understand which component is causing the issue. There are three main components an EFLOW solution:
- Windows components: PowerShell module, WSSDAgent & EFLOWProxy
- CBL Mariner Linux virtual machine
- Azure IoT Edge 

For more information about EFLOW architecture, see [What is Azure IoT Edge for Linux on Windows](iot-edge-for-linux-on-windows.md).

If your issue is installing or deploying the EFLOW virtual machine, make sure that all the prerequisites are met, and verify your networking and VM configurations. If your installation and deployment was successful and you're facing issues with the post VM management, the problems are generally related to VM lifecycle, networking, or Azure IoT Edge. Finally, if the issue is related to modules or IoT Edge features, check [Troubleshoot your IoT Edge device](troubleshoot.md).

For more information about common errors related to *installation and deployment*, *provisioning*, *interaction with the VM*, and *networking*, see [Common issues and resolutions for Azure IoT Edge for Linux on Windows](troubleshoot-iot-edge-for-linux-on-windows-common-errors.md).

## Gather debug information

When you need to gather logs from an IoT Edge for Linux on Windows device, the most convenient way is to use the `Get-EflowLogs` PowerShell cmdlet. By default, this command collects the following logs:
- **eflowlogs-summary.txt**: contains the status of all log collection steps.
- **EFLOW VM configuration**: includes the VM, networking, and passthrough configurations and additional information. 
- **EFLOW Events** : Windows events related to the VM lifecycle and *EFLOWProxy* service.
- **IoT Edge logs**: includes the output of `iotedge check` the IoT Edge runtime support bundle.
- **WSSDAgent logs**: includes all the logs related to the *WSSDAgent* service.

After the cmdlet gathers all the required logs, the files are compressed into a single file named _eflowlogs.zip_ under the EFLOW installation path (For example, _C:\Program Files\Azure IoT Edge_).

## Check your IoT Edge version

If you're running an older version of IoT Edge for Linux on Windows, then upgrading may resolve your issue. To check the EFLOW version installed on your device, use the following steps:

1. Open **Settings** on Windows.
1. Select **Add or Remove Programs**.
1. Depending on the EFLOW release train being used (Continuous Release or LTS), choose **Azure IoT Edge LTS** or **Azure IoT Edge**.
1. Check the version under the EFLOW app name.

For more information about specific versions release notes, check [Azure IoT Edge for Linux on Windows release notes](https://aka.ms/AzEFLOW-Releases). 

For instructions on how to update your device, see [Update IoT Edge for Linux on Windows](iot-edge-for-linux-on-windows-updates.md).

## Check the EFLOW VM status

You can verify the EFLOW VM status and information by using the `Get-EflowVm` PowerShell cmdlet. If the EFLOW VM is running, the **VmPowerState** output should be _Running_. Whereas if the VM is stopped, the **VmPowerState** output is _Off_. To start or stop the EFLOW VM, use the `Start-EflowVm` and `Stop-EflowVm` cmdlet. 

If the VM is _Running_ but you can't interact or access the VM, there's probably a networking issue between the VM and the Windows host OS.  Also, make sure that the EFLOW VM has enough memory and storage available to continue with normal execution. Run the `Get-EflowVm` cmdlet to see the memory(_TotalMemMb_, _UsedMemMb_, _AvailableMemMb_) and storage(_TotalStorageMb_, _UsedStorageMb_, _AvailableStorageMb_) information. 

Finally, if the VM is _Off_ and you can't start it using the `Start-EflowVm` cmdlet, there may be several reasons why the VM can't be started. 

First, the issue could be related to the VM lifecycle management service (_WSSDAgent_) not running. Ensure that the _WSSDAgent_ service is running using the following steps: 

1. Start an elevated _PowerShell_ session using **Run as Administrator**.
1. Check the service status
    ```powershell
    Get-Service -Name WSSDAgent
    ```
1. If the service is **Stopped**, start the service using the following command:
    ```powershell
    Start-Service -Name WSSDAgent
    ```
1. If the service is **Running**, the issue is probably related to a networking misconfiguration or lack of resources to create the VM.

Second, the issue could be related to lack of resources. You can set the _EflowVmAssignedMemory_ (`-memoryInMb`) and _EflowVmAssignedCPUcores_ (`-cpuCount`) assigned to the VM during deployment using the `Deploy-Eflow` PowerShell cmdlet, or after deployment using the `Set-EflowVm` cmdlet. If these resources aren't available when trying to start the VM, the VM fails to start. To check the resources assigned and available, use the following steps:

1. Start an elevated _PowerShell_ session using **Run as Administrator**.
1. Check the available memory. Ensure that the _FreePhysicalMemory_ is greater than the _EflowVmAssignedMemory_.
    ```powershell
    Get-CIMInstance Win32_OperatingSystem | Select FreePhysicalMemory
    ```
1. Check the available CPU cores. Ensure that  _NumberOfLogicalProcessors_ is greater than _EflowVmAssignedCPUcores_.
   ```powershell
    wmic cpu get NumberOfLogicalProcessors
    ```

Finally, the issue could be related to networking. For more information about EFLOW VM networking issues, see [How to troubleshoot Azure IoT Edge for Linux on Windows networking](./troubleshoot-common-errors.md).

## Check the status of the IoT Edge runtime

The [IoT Edge runtime](./iot-edge-runtime.md) is responsible for receiving the code to run at the edge and communicate the results. If IoT Edge runtime and modules aren't running, no code runs at the edge. You can check the runtime and module status using the following steps:

1. Start an elevated _PowerShell_ session using **Run as Administrator**.
1. Check the IoT Edge runtime status. In particular, check if the service is **Loaded** and **Active**. 
    ```powershell
    (Get-EflowVm).EdgeRuntimeStatus.SystemCtlStatus | Format-List
    ```
1. Check the IoT Edge module status. Check that all modules are running.
     ```powershell
    (Get-EflowVm).EdgeRuntimeStatus.ModuleList | Format-List
    ```

For more information about IoT Edge runtime troubleshooting, see [Troubleshoot your IoT Edge device](./troubleshoot.md).

## Check TPM passthrough

If you're using TPM provisioning by following the guide [Create and provision an IoT Edge for Linux on Windows device at scale by using a TPM](./how-to-provision-devices-at-scale-linux-on-windows-tpm.md), you must enable TPM passthrough. In order to access the physical TPM connected to the Windows host OS, all the EFLOW VM TPM commands are forwarded to the host OS using a Windows service called _EFLOWProxy_. If you experience issues using _DpsTpm_ provisioning, or accessing TPM indexes from the EFLOW VM, check the service status using the following steps:

1. Start an elevated _PowerShell_ session using **Run as Administrator**.
1. Check the status of the _EFLOWProxy_ service.
    ```powershell
    Get-Service -Name EFLOWProxy
    ```
1. If the service is **Stopped**, start the service using the following command:
    ```powershell
    Start-Service -Name EFLOWProxy
    ```
   If the service won't start, check the _EFLOWProxy_ logs. Go to **Apps** > **Event Viewer** > **Applications and Services Logs** > **Microsoft** > **EFLOW** > **EFLOWProxy** and check the logs. 

1. If the service is **Running** then check the EFLOW VM proxy services. Start by connecting to the EFLOW VM.
   ```powershell
   Connect-EflowVm
    ```
1. From inside the EFLOW VM, check the TPM services are up and running.
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
   
1. Check the communication between the EFLOW VM and the *EFLOWProxy* service. If communication is working, you should see the _RegistrationId_ and the TPM _Endorsement Key_ as output from the following command: 
   ```bash
   sudo /usr/bin/tpm_device_provision
   ```

## Check GPU Assignment

If you're using GPU passthrough, ensure to follow all the prerequisites and configurations outlined in [GPU acceleration for Azure IoT Edge for Linux on Windows](./gpu-acceleration.md). If you experience issues using GPU passthrough feature, check the following steps:

First, start by checking your device is available on the Windows host OS.

1. Open **Apps** > **Device Manager**.
1. Go to **Display Adapters** and check that your GPU is in the list.
1. Right-click the GPU name and select **Properties**.
1. Check that the driver is correctly installed.

Second, if the GPU is correctly assigned, but still not being able to use it inside the EFLOW VM, use the following steps:
1. Start an elevated _PowerShell_ session using **Run as Administrator**.
1. Connect to the EFLOW VM
    ```powershell
    Connect-EflowVm
    ```
1. If you're using a **NVIDIA GPU**, check the passthrough status using the following command:
    ```bash
    sudo nvidia-smi
    ```
   You should be able to see the GPU card information, driver version, CUDA version, and the GPU system and processes information. 

1. If you're using an **Intel iGPU** passthrough, check the passthrough status using the following command:
    ```bash
    sudo ls -al /dev/dxg
    ```
    The expected output should be similar to:
    ```Output
    crw-rw-rw- 1 root 10, 60  Sep  8 06:20 /dev/dxg
    ```
    For more Intel iGPU performance and debugging information, see [Witness the power of Intel&reg; iGPU with Azure IoT Edge for Linux on Windows(EFLOW) & OpenVINO&trade; Toolkit](https://community.intel.com/t5/Blogs/Tech-Innovation/Artificial-Intelligence-AI/Witness-the-power-of-Intel-iGPU-with-Azure-IoT-Edge-for-Linux-on/post/1382405).

## Check WSSDAgent logs for issues

The first step before checking *WSSDAgent* logs is to check if the VM was created and is running. 

1. Start an elevated _PowerShell_ session using **Run as Administrator**.
1. On Windows Client SKUs, check the [HCS](/virtualization/community/team-blog/2017/20170127-introducing-the-host-compute-service-hcs) virtual machines.
    ```powershell
    hcsdiag list
    ```
    If the EFLOW VM is running, you should see a line that contains a GUID followed by *wssdagent*. For example:

    ```Output
    2bd841e4-126a-11ed-9a91-f01dbca16d1e
        VM,                         Running, 2BD841E4-126A-11ED-9A91-F01DBCA16D1E, wssdagent

    88d7aa8c-0d1f-4786-b4cb-62eff1decd92
        VM,                         SavedAsTemplate, 88D7AA8C-0D1F-4786-B4CB-62EFF1DECD92, CmService
    ```

1. On Windows Server SKUs, check the [VMMS](/windows-server/virtualization/hyper-v/hyper-v-technology-overview) virtual machines
    ```powershell
    hcsdiag list
    ```
   If the EFLOW VM is running, you should see a line that contains the \<WindowsHostname-EFLOW> as a name. For example:
    ```Output
    Name               State   CPUUsage(%) MemoryAssigned(M) Uptime           Status             Version
    ----               -----   ----------- ----------------- ------           ------             -------
    NUC-EFLOW          Running 0           1024              00:01:34.1280000 Operating normally 9.0
    ```

If for some reason the VM isn't listed, that means that VM isn't running or the *WSSDAgent* wasn't able to create it. Use the following steps to check the *WSSDAgent* logs:

1. Open **File Explorer**.
1. Go to `C:\ProgramData\wssdagent\log`
1. Open the _wssdagent.log_ file.
1. Look for the words **Error** or **Fail**.

## Reinstall EFLOW

Sometimes, a system might require significant special modification to work with existing networking or operating system constraints. For example, a system could require complex networking configurations (firewall, Windows policies, proxy settings) and custom Windows OS configurations. If you tried all previous troubleshooting steps and still have EFLOW issues, it's possible that there's some misconfiguration that is causing the issue. In this case, the final option is to uninstall and reinstall EFLOW. 

## Next steps

Do you think that you found a bug in the IoT Edge for Linux on Windows? [Submit an issue](https://github.com/Azure/iotedge-eflow/issues) so that we can continue to improve.

If you have more questions, create a [Support request](https://portal.azure.com/#create/Microsoft.Support) for help.
