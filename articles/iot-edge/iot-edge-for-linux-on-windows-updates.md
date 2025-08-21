---
title: Azure IoT Edge for Linux on Windows updates
description: Overview of Azure IoT Edge for Linux on Windows updates. Learn how to update your IoT Edge for Linux on Windows devices when a new version is available.
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-edge
ms.custom: linux-related-content
services: iot-edge
ms.topic: concept-article
ms.date: 07/11/2025
---

# Update IoT Edge for Linux on Windows

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

When a new version of the IoT Edge for Linux on Windows (EFLOW) application is released, update your IoT Edge devices to get the latest features and security improvements. This article explains how to update your IoT Edge for Linux on Windows devices when a new version is available.


With IoT Edge for Linux on Windows, IoT Edge runs in a Linux virtual machine hosted on a Windows device. This virtual machine comes preinstalled with IoT Edge and doesn't have a package manager, so you can't manually update or change any of the VM components. Instead, Microsoft Update manages the virtual machine to keep the components up to date automatically.

The EFLOW virtual machine is designed for reliable updates through Microsoft Update. The virtual machine operating system uses an A/B update partition scheme to make each update safe and lets you roll back to a previous version if something goes wrong during the update process.

Each update has two main components that can be updated to the latest versions. The first is the EFLOW virtual machine and its internal components. For more information about EFLOW, see [Azure IoT Edge for Linux on Windows composition](./iot-edge-for-linux-on-windows.md). This also includes the virtual machine base operating system. The EFLOW virtual machine is based on [Microsoft Azure Linux](https://github.com/microsoft/CBL-Mariner), and each update provides performance and security fixes to keep the OS up to date with the latest CVE patches. The EFLOW release notes show the Azure Linux version used, and you can check the [CBL-Mariner Releases](https://github.com/microsoft/CBL-Mariner/releases) for the list of CVEs fixed for each version.

The second component is the group of Windows runtime components needed to run and interop with the EFLOW virtual machine. The virtual machine lifecycle and interop is managed through different components: WSSDAgent, EFLOWProxy service, and the PowerShell module. 

EFLOW updates are sequential, and you need to update to every version in order. To get to the latest version, either do a fresh installation using the latest available version or apply all previous servicing updates up to the version you want.

> [!IMPORTANT]
> You can upgrade from EFLOW 1.4 LTS to EFLOW 1.5 LTS using any of the methods described in this article. No special steps are needed to upgrade from EFLOW 1.4 LTS to EFLOW 1.5 LTS.

To find the latest version of Azure IoT Edge for Linux on Windows, see [EFLOW releases](https://aka.ms/AzEFLOW-Releases).

## Update using Microsoft Update

To get IoT Edge for Linux on Windows updates, configure the Windows host to get updates for other Microsoft products. By default, Microsoft Updates is on during EFLOW installation. If you need a custom configuration after EFLOW installation, turn this option on or off with these steps:

1. Open **Settings** on the Windows host.

1. Select **Updates & Security**.

1. Select **Advanced options**.

1. Turn the *Receive updates for other Microsoft products when you update Windows* option to **On**.


## Update using Windows Server Update Services (WSUS)

On-premises updates using WSUS are supported for IoT Edge for Linux on Windows updates. For more information about WSUS, see [Device Management Overview - WSUS](/windows/iot/iot-enterprise/device-management/device-management-overview#windows-server-update-services-wsus).


## Offline manual update

If you have restricted or limited internet connectivity, you can manually apply EFLOW updates offline. Use Microsoft Update offline mechanisms to manually download and install IoT Edge for Linux on Windows updates. Follow these steps:

1. Check the current EFLOW installed version. Open **Settings** then select **Apps** -> **Apps & features**. Search for *Azure IoT Edge*. 

1. Search and download the required update from [EFLOW - Microsoft Update catalog](https://www.catalog.update.microsoft.com/Search.aspx?q=Azure%20IoT%20Edge%20for%20Linux%20on%20Windows).

1. Extract *AzureIoTEdge.msi* from the downloaded *.cab* file.

1. Install the extracted *AzureIoTEdge.msi*.

## Managing Microsoft Updates

IoT Edge for Linux on Windows updates are serviced using Microsoft Update channel. To change receiving EFLOW updates, you have to manage Microsoft Updates. The following list includes ways to automate turning on or off Microsoft updates. For more information about managing OS updates, see [OS Updates](/windows/iot/iot-enterprise/os-features/updates#completely-turn-off-windows-updates).

- **CSP Policies** - Use the **Update/AllowMUUpdateService** CSP policy. For more information about the Microsoft Updates CSP policy, see [Policy CSP - MU Update](/windows/client-management/mdm/policy-csp-update#update-allowmuupdateservice).

- **Manually manage Microsoft Updates** - To opt in to Microsoft Updates, see [Opt-In to Microsoft Update](/windows/win32/wua_sdk/opt-in-to-microsoft-update).

## Migration between EFLOW with Azure Linux 2.0 to EFLOW with Azure Linux 3.0

Migration between Azure Linux 2.0 and Azure Linux 3.0 was introduced as part of EFLOW 1.5.5.07025 update. This migration handles the EFLOW VM migration from EFLOW 1.5.4.07025 with Azure Linux 2.0 to EFLOW 1.5.5.07025 with Azure Linux 3.0, including the following:
- IoT Edge runtime
- IoT Edge configurations
- Containers
- Networking and VM configuration
- Stored files

To migrate from EFLOW 1.5.4.07025 with Azure Linux 2.0 to EFLOW 1.5.5.07025 with Azure Linux 3.0, use the following steps.

1. Get the latest Azure EFLOW 1.5.4.07025 update. If you're using Windows Update, *Check Updates* to get the latest EFLOW update.
1. For auto-download migration (needs internet connection), skip this step. If the EFLOW VM has limited/no internet access, download the necessary files before starting the migration (download one of the following).
    - [1.5.5.07025 x64 Update MSI](https://aka.ms/AzEFLOW-Update-azl2-to-azl3_Update_x64)
    - [1.5.5.07025 ARM64 Update MSI](https://aka.ms/AzEFLOW-Update-azl2-to-azl3_Update_arm64)
1. Open an elevated PowerShell session
1. Start the EFLOW migration

    > [!NOTE]
    > You can migrate with one single cmdlet by using the `-autoConfirm` flag with the `Start-EflowMigration` cmdlet. If specified `Confirm-EflowMigration` doesn't needs to be called to proceed with the Azure Linux 3.0 migration.

    1. If you're using the auto-download migration option, run the following cmdlet
        ```powershell
        Start-EflowMigration
        ```
    1. If you downloaded the MSI in **Step 2**, use the downloaded files to apply the migration (replace "X64" with "ARM64" in the filepath if using ARM64).
        ```powershell
        Start-EflowMigration -standaloneMsiPath "<path-to-folder>\AzureIoTEdge_Update_LTS_1.5.5.07025_X64.msi" 
        ```
1. Confirm the EFLOW migration
    1. If you're using the auto-download migration option, run the following cmdlet
        ```powershell
        Confirm-EflowMigration
        ```
    1. If you downloaded the MSI in **Step 2**, use the downloaded files to apply the migration (replace "X64" with "ARM64" in the filepath if using ARM64).
        ```powershell
        Confirm-EflowMigration -updateMsiPath "<path-to-folder>\AzureIoTEdge_Update_LTS_1.5.5.07025_X64.msi" 
        ```

>[!WARNING]
> If the migration fails for any reason, the EFLOW VM is restored to its original EFLOW 1.5.4.07025 version with Azure Linux 2.0.
> To cancel the migration or manually restore the EFLOW VM to its prior state, run the `Start-EflowMigration` cmdlet and then `Restore-EflowPriorToMigration`.

For more information, check `Start-EflowMigration`, `Confirm-EflowMigration` and `Restore-EflowPriorToMigration` cmdlet documentation by using the `Get-Help <cmdlet> -full` command. 

## Next steps

View the latest [IoT Edge for Linux on Windows releases](https://github.com/Azure/iotedge-eflow/releases).

Learn about [IoT Edge for Linux on Windows security premises](./iot-edge-for-linux-on-windows-security.md).
