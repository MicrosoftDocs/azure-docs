---
title: RDP fails if no RD license server is available to provide a license in Azure | Microsoft Docs
description: Learn how to troubleshoot RDP fails issues because no Remote Desktop license server is available | Microsoft Docs
services: virtual-machines-windows
documentationCenter: ''
author: genlin
manager: cshepard
editor: ''

ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: troubleshooting
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 10/23/2018
ms.author: genli
---

# RDP fails if no RD license server is available in Azure

This article helps resolve the issue in which you can't connect to an Azure Virtual Machine (VM) because no Remote Desktop (RD) license server is available to provide a license.

## Symptoms

When you try to connect to a VM, you experience the following issues:

- The Virtual Machine (VM) screenshot shows that the operating system is fully loaded and waiting for credentials.
-	You receive the following error messages when you use the Microsoft Remote Desktop Protocol (RDP):

    ```
    The remote session was disconnected because there are no Remote Desktop license servers available to provide a license.
    ```

    ```
    No Remote Desktop license server is available. Remote Desktop Services will stop working because this computer is past its grace period and has not contacted at least a valid Windows Server 2008 license server. Click this message to open RD Session Host Server Configuration to use Licensing Diagnosis.
    ```

However, you can connect to the VM normally by using an administrative session by using the following command:

    `mstsc /v:<Server>[:<Port>] /admin`

## Cause

This problem occurs if an RD license server is unavailable to provide a license to start a remote session. This problem can be caused by several scenarios even though an RD Session Host role was set up on the VM:

- There was never an RD license role in the environment and the grace period (180 days) is over.
- An RD license was installed in the environment but it is never activated.
- An RD license in the environment doesn't have Client Access Licenses (CALs) injected to set up the connection.
- An RD license was installed in the environment. There are available CALs but they weren't configured properly.
- An RD license has CALs and it was activated. However, some other issues on the RD license server prevent it from providing licenses in the environment.

## Solution

To resolve this problem, [back up the OS disk](../windows/snapshot-copy-managed-disk.md) and follow these steps:

1. Connect to the VM by using an administrative session:

    `mstsc /v:<Server>[:<Port>] /admin`

2. Check whether the VM has an RD Session Host role enabled. If the role is enabled, make sure that it is functioning properly. Open an elevated CMD instance and follow these steps:

  1. Use the following command to check the status of the RD Session Host role:

      ```
      reg query "HKLM\SOFTWARE\Microsoft\ServerManager\ServicingStorage\ServerComponentCache\RDS-RD-Server" /v InstallState
      ```

      If this command returns a value of 0, it means that the role is disabled, and you can go to step 3.

  2. Use the following commands to check the policies and reconfigure as needed.

      ```
      reg query "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\RCM\Licensing Core" /v LicensingMode reg query "HKLM\SYSTEM\CurrentControlSet\Services\TermService\Parameters" /v SpecifiedLicenseServers
      ```

      If the **LicensingMode** value is set to any other value than 4 (per user), then set the value to 4:

      ```
      reg add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\RCM\Licensing Core" /v LicensingMode /t REG_DWORD /d 4
      ```

      If the **SpecifiedLicenseServers** value doesn't exist or it has an incorrect license server information, then change it as follows:

      ```
      reg add "HKLM\SYSTEM\CurrentControlSet\Services\TermService\Parameters" /v SpecifiedLicenseServers /t REG_MULTI_SZ /d "<FQDN / IP License server>"
      ```

  3. After you make any changes to the registry, restart the VM.

  4. If you don't have CALs, the RD Session Host role needs to be removed to set the RDP back to normal and it only allows two concurrent RDP connections to the VM.

    ```
    dism /ONLINE /Disable-feature /FeatureName:Remote-Desktop-Services
    ```

    If the VM has the RD license role and it is not used, you can also remove that role.

    ```
    dism /ONLINE /Disable-feature /FeatureName:Licensing
    ```

  5. Make sure that there are no networking blocks when you access the RD license server.  

3. If there's no RD license server in the environment and you want one, you can [install an RD license role server or Remote Desktop Services (RDS) server](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc731765(v=ws.11)), and then [configure the RDS licensing](https://blogs.technet.microsoft.com/askperf/2013/09/20/rd-licensing-configuration-on-windows-server-2012/).

4. If an RD license server is configured and it is healthy, make sure that the RD license server is activated and it has CALs.

## Next steps

If you still can't resolve this issue, open a support request.
