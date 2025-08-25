---
title: Troubleshoot your IoT Edge for Linux on Windows device
description: Learn standard diagnostic skills for troubleshooting Azure IoT Edge for Linux on Windows (EFLOW) like retrieving component status and logs.
author: sethmanheim
ms.author: sethm
ms.date: 07/22/2025
ms.topic: troubleshooting-general
ms.service: azure-iot-edge
ms.custom: linux-related-content
services: iot-edge
---

# Troubleshoot your IoT Edge for Linux on Windows device

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

If you run into issues with Azure IoT Edge for Linux on Windows (EFLOW), use this article to troubleshoot and diagnose the problem.

You can also check [IoT Edge for Linux on Windows GitHub issues](https://github.com/Azure/iotedge-eflow/issues?q=is%3Aissue) for a similar reported issue.

## Isolate the issue

Start troubleshooting IoT Edge for Linux on Windows by identifying which component causes the issue. An EFLOW solution has three main components:
- Windows components: PowerShell module, WSSDAgent, and EFLOWProxy
- Azure Linux virtual machine
- Azure IoT Edge 

For more information about EFLOW architecture, see [What is Azure IoT Edge for Linux on Windows](iot-edge-for-linux-on-windows.md).

If you have trouble installing or deploying the EFLOW virtual machine, check that all prerequisites are met, and verify your networking and VM configurations. If installation and deployment succeed but you run into issues with post-VM management, problems are usually related to VM lifecycle, networking, or Azure IoT Edge. If the issue involves modules or IoT Edge features, see [Troubleshoot your IoT Edge device](troubleshoot.md).

For more information about common errors related to *installation and deployment*, *provisioning*, *interaction with the VM*, and *networking*, see [Common issues and resolutions for Azure IoT Edge for Linux on Windows](troubleshoot-iot-edge-for-linux-on-windows-common-errors.md).

## Gather debug information

To gather logs from an IoT Edge for Linux on Windows device, use the `Get-EflowLogs` PowerShell cmdlet. By default, this command collects these logs:
- **eflowlogs-summary.txt**: shows the status of all log collection steps.
- **EFLOW VM configuration**: has the VM, networking, passthrough configurations, and other information.
- **EFLOW Events**: Windows events related to the VM lifecycle and *EFLOWProxy* service.
- **IoT Edge logs**: includes the output of `iotedge check` the IoT Edge runtime support bundle.
- **WSSDAgent logs**: includes all logs related to the *WSSDAgent* service.

After the cmdlet gathers all required logs, it compresses the files into a single file named *eflowlogs.zip* in the EFLOW installation path (for example, *C:\Program Files\Azure IoT Edge*).

## Check your IoT Edge version

If you're running an older version of IoT Edge for Linux on Windows, upgrading can resolve your issue. To check the EFLOW version installed on your device, follow these steps:

1. Open **Settings** on Windows.
1. Select **Add or Remove Programs**.
1. Depending on the EFLOW release train you use (Continuous Release or LTS), select **Azure IoT Edge LTS** or **Azure IoT Edge**.
1. Check the version under the EFLOW app name.

For more information about specific versions release notes, check [Azure IoT Edge for Linux on Windows release notes](https://aka.ms/AzEFLOW-Releases). 

For instructions on how to update your device, see [Update IoT Edge for Linux on Windows](iot-edge-for-linux-on-windows-updates.md).

## Check the EFLOW VM status

You can verify the EFLOW VM status and information by using the `Get-EflowVm` PowerShell cmdlet. If the EFLOW VM is running, the **VmPowerState** output should be *Running*. Whereas if the VM is stopped, the **VmPowerState** output is *Off*. To start or stop the EFLOW VM, use the `Start-EflowVm` and `Stop-EflowVm` cmdlet. 

If the VM is *Running* but you can't interact with or use the VM, there might be a networking issue between the VM and the Windows host OS. Also, check that the EFLOW VM has enough memory and storage available to continue normal execution. Run the `Get-EflowVm` cmdlet to see the memory (*TotalMemMb*, *UsedMemMb*, *AvailableMemMb*) and storage (*TotalStorageMb*, *UsedStorageMb*, *AvailableStorageMb*) information. 

If the VM is *Off* and you can't start it using the `Start-EflowVm` cmdlet, there can be several reasons why the VM can't start. 

First, the issue could be related to the VM lifecycle management service (*WSSDAgent*) not running. Ensure that the *WSSDAgent* service is running using the following steps: 

1. Start an elevated *PowerShell* session using **Run as Administrator**.
1. Check the service status
    ```powershell
    Get-Service -Name WSSDAgent
    ```
1. If the service is **Stopped**, start the service using the following command:
    ```powershell
    Start-Service -Name WSSDAgent
    ```
1. If the service is **Running**, the issue is probably related to a networking misconfiguration or lack of resources to create the VM.

Second, the issue could be related to lack of resources. You can set the *EflowVmAssignedMemory* (`-memoryInMb`) and *EflowVmAssignedCPUcores* (`-cpuCount`) assigned to the VM during deployment using the `Deploy-Eflow` PowerShell cmdlet, or after deployment using the `Set-EflowVm` cmdlet. If these resources aren't available when trying to start the VM, the VM fails to start. To check the resources assigned and available, use the following steps:

1. Start an elevated *PowerShell* session using **Run as Administrator**.
1. Check the available memory. Ensure that the *FreePhysicalMemory* is greater than the *EflowVmAssignedMemory*.
    ```powershell
    Get-CIMInstance Win32_OperatingSystem | Select FreePhysicalMemory
    ```
1. Check the available CPU cores. Make sure that *NumberOfLogicalProcessors* is greater than *EflowVmAssignedCPUcores*.
   ```powershell
    wmic cpu get NumberOfLogicalProcessors
    ```ssignedCPUcores*.
   ```powershell
    wmic cpu get NumberOfLogicalProcessors
    ```

Finally, the issue might be related to networking. For more information about EFLOW VM networking issues, see [How to troubleshoot Azure IoT Edge for Linux on Windows networking](./troubleshoot-common-errors.md).

## Check the status of the IoT Edge runtime

The [IoT Edge runtime](./iot-edge-runtime.md) is responsible for receiving the code to run at the edge and communicate the results. If IoT Edge runtime and modules aren't running, no code runs at the edge. You can check the runtime and module status using the following steps:

1. Start an elevated *PowerShell* session using **Run as Administrator**.
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

If you're using TPM provisioning by following the guide [Create and provision an IoT Edge for Linux on Windows device at scale by using a TPM](./how-to-provision-devices-at-scale-linux-on-windows-tpm.md), you must enable TPM passthrough. In order to access the physical TPM connected to the Windows host OS, all the EFLOW VM TPM commands are forwarded to the host OS using a Windows service called *EFLOWProxy*. If you experience issues using *DpsTpm* provisioning, or accessing TPM indexes from the EFLOW VM, check the service status using the following steps:

1. Start an elevated *PowerShell* session using **Run as Administrator**.
1. Check the status of the *EFLOWProxy* service.
    ```powershell
    Get-Service -Name EFLOWProxy
    ```
1. If the service is **Stopped**, start the service using the following command:
    ```powershell
    Start-Service -Name EFLOWProxy
    ```
   If the service doesn't start, check the *EFLOWProxy* logs. Go to **Apps** > **Event Viewer** > **Applications and Services Logs** > **Microsoft** > **EFLOW** > **EFLOWProxy** and review the logs.

1. If the service is **Running**, check the EFLOW VM proxy services. Start by connecting to the EFLOW VM.
   ```powershell
   Connect-EflowVm
    ```
1. From inside the EFLOW VM, check that the TPM services are running.
   ```bash
   sudo systemctl status tpm*
   ```
   You see the status and logs of four different services. All four services need to be running.
    1. **tpm2-netns.service** - TPM2 Network Namespace
    1. **tpm2-socat@2322.service** - TPM2 Sandbox Service on Port 2322
    1. **tpm2-socat@2321.service** - TPM2 Sandbox Service on Port 2321
    1. **tpm2-abrmd.service** - TPM2 Access Broker and Resource Management Daemon

   If any of these services is **stopped** or **failed**, restart all services with the following command:
   
   ```bash
   sudo systemctl restart tpm*
   ```
   
1. Check the communication between the EFLOW VM and the *EFLOWProxy* service. If communication works, you see the *RegistrationId* and the TPM *Endorsement Key* as output from the following command:
   ```bash
   sudo /usr/bin/tpm_device_provision
   ```

## Check GPU Assignment

If you're using GPU passthrough, make sure you follow all the prerequisites and configurations in [GPU acceleration for Azure IoT Edge for Linux on Windows](./gpu-acceleration.md). If you have issues with the GPU passthrough feature, follow these steps:

First, check that your device is available on the Windows host OS.

1. Open **Apps** > **Device Manager**.
1. Go to **Display Adapters** and check that your GPU is in the list.
1. Right-click the GPU name and select **Properties**.
1. Check that the driver is correctly installed.

Second, if the GPU is correctly assigned, but still not being able to use it inside the EFLOW VM, use the following steps:
1. Start an elevated *PowerShell* session using **Run as Administrator**.
1. Connect to the EFLOW VM
    ```powershell
    Connect-EflowVm
    ```
1. If you're using a **NVIDIA GPU**, check the passthrough status with this command:
    ```bash
    sudo nvidia-smi
    ```
   You see the GPU card information, driver version, CUDA version, and GPU system and process information.

1. If you're using an **Intel iGPU** passthrough, check the passthrough status with this command:
    ```bash
    sudo ls -al /dev/dxg
    ```
    The expected output looks like:
    ```Output
    crw-rw-rw- 1 root 10, 60  Sep  8 06:20 /dev/dxg
    ```
    For more about Intel iGPU performance and debugging, see [Witness the power of Intel&reg; iGPU with Azure IoT Edge for Linux on Windows(EFLOW) & OpenVINO&trade; Toolkit](https://community.intel.com/t5/Blogs/Tech-Innovation/Artificial-Intelligence-AI/Witness-the-power-of-Intel-iGPU-with-Azure-IoT-Edge-for-Linux-on/post/1382405).

## Check WSSDAgent logs for issues

Before you check the *WSSDAgent* logs, make sure the VM is created and running.

1. Start an elevated *PowerShell* session using **Run as Administrator**.
1. On Windows Client SKUs, check the [HCS](https://techcommunity.microsoft.com/t5/containers/introducing-the-host-compute-service-hcs/ba-p/382332) virtual machines.
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

If the VM isn't listed, it isn't running or the *WSSDAgent* can't create it. Follow these steps to check the *WSSDAgent* logs:

1. Open **File Explorer**.
1. Go to `C:\ProgramData\wssdagent\log`
1. Open the *wssdagent.log* file.
1. Look for the words **Error** or **Fail**.

## Reinstall EFLOW

Sometimes, a system needs special changes to work with existing networking or operating system constraints. For example, a system might need complex networking settings, like firewall, Windows policies, proxy settings, or custom Windows OS settings. If you've tried all previous troubleshooting steps and still have EFLOW issues, a misconfiguration might be causing the problem. In this case, the last option is to uninstall and reinstall EFLOW. 

## Next steps

Do you think that you found a bug in the IoT Edge for Linux on Windows? [Submit an issue](https://github.com/Azure/iotedge-eflow/issues) so that we can continue to improve.

If you have more questions, create a [Support request](https://portal.azure.com/#create/Microsoft.Support) for help.
