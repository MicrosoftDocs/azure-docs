---
title: Azure IoT Edge for Linux on Windows updates
description: Overview of Azure IoT Edge for Linux on Windows updates
author: PatAltimore

# this is the PM responsible
ms.reviewer: fcabrera
ms.service: iot-edge
services: iot-edge
ms.topic: conceptual
ms.date: 07/05/2022
ms.author: fcabrera
---

# Update IoT Edge for Linux on Windows

[!INCLUDE [iot-edge-version-1.1-or-1.4](./includes/iot-edge-version-1.1-or-1.4.md)]

As the IoT Edge for Linux on Windows (EFLOW) application releases new versions, you'll want to update your IoT Edge devices for the latest features and security improvements. This article provides information about how to update your IoT Edge for Linux on Windows devices when a new version is available.

With IoT Edge for Linux on Windows, IoT Edge runs in a Linux virtual machine hosted on a Windows device. This virtual machine is pre-installed with IoT Edge, and has no package manager, so you can't manually update or change any of the VM components. Instead, the virtual machine is managed with Microsoft Update to keep the components up to date automatically.

The EFLOW virtual machine is designed to be reliably updated via Microsoft Update. The virtual machine operating system has an A/B update partition scheme to utilize a subset of those to make each update safe and enable a roll-back to a previous version if anything goes wrong during the update process.

Each update consists of two main components that may get updated to latest versions. The first one is the EFLOW virtual machine and the internal components. For more information about EFLOW, see [Azure IoT Edge for Linux on Windows composition](./iot-edge-for-linux-on-windows.md). This also includes the virtual machine base operating system. The EFLOW virtual machine is based on [Microsoft CBL-Mariner](https://github.com/microsoft/CBL-Mariner) and each update provides performance and security fixes to keep the OS with the latest CVE patches. As part of the EFLOW Release notes, the version indicates the CBL-Mariner version used, and users can check the [CBL-Mariner Releases](https://github.com/microsoft/CBL-Mariner/releases) to get the list of CVEs fixed for each version. 

The second component is the group of Windows runtime components needed to run and interop with the EFLOW virtual machine. The virtual machine lifecycle and interop is managed through different components: WSSDAgent, EFLOWProxy service and the PowerShell module. 

EFLOW updates are sequential and you'll require to update to every version in order, which means that in order to get to the latest version, you'll have to either do a fresh installation using the latest available version, or apply all the previous servicing updates up to the desired version. 

To find the latest version of Azure IoT Edge for Linux on Windows, see [EFLOW releases](https://aka.ms/AzEFLOW-Releases).

<!-- iotedge-2020-11 -->
:::moniker range=">=iotedge-2020-11"

>[!IMPORTANT]
>This is a Public Preview version of [Azure IoT Edge for Linux on Windows continuous release (EFLOW CR)](./version-history.md), not intended for production use. A clean install may be required for production use once the final General Availability (GA) release is available.
>
>To find out if you're currently using the continuous release version, navigate to **Settings** > **Apps** on your Windows device. Find **Azure IoT Edge** in the list of apps and features. If your listed version is 1.2.x.y, you are running the continuous release version.
<!-- end iotedge-2020-11 -->
:::moniker-end

## Update using Microsoft Update

To receive IoT Edge for Linux on Windows updates, the Windows host should be configured to receive updates for other Microsoft products. By default, Microsoft Updates will be turned on during EFLOW installation. If custom configuration is needed after EFLOW installation, you can turn this option On/Off with the following steps:

1. Open **Settings** on the Windows host.

1. Select **Updates & Security**.

1. Select **Advanced options**.

1. Toggle the *Receive updates for other Microsoft products when you update Windows* button to **On**.


## Update using Windows Server Update Services (WSUS)

On premises updates using WSUS is supported for IoT Edge for Linux on Windows updates. For more information about WSUS, see [Device Management Overview - WSUS](/windows/iot/iot-enterprise/device-management/device-management-overview#windows-server-update-services-wsus).


## Offline manual update

In some scenarios with restricted or limited internet connectivity, you may want to manually apply EFLOW updates offline. This is possible using Microsoft Update offline mechanisms. You can manually download and install an IoT Edge for Linux on Windows updates with the following steps:

<!-- 1.1 -->
:::moniker range="iotedge-2018-06"
1. Check the current EFLOW installed version. Open **Settings**, select **Apps** -> **Apps & features**  search for *Azure IoT Edge LTS*.

1. Search and download the required update from [EFLOW - Microsoft Update catalog](https://www.catalog.update.microsoft.com/Search.aspx?q=Azure%20IoT%20Edge%20for%20Linux%20on%20Windows).

1. Extract *AzureIoTEdge.msi* from the downloaded *.cab* file.

1. Install the extracted *AzureIoTEdge.msi*.
<!-- end 1.1 -->
:::moniker-end

<!-- iotedge-2020-11 -->
:::moniker range=">=iotedge-2020-11"
1. Check the current EFLOW installed version. Open **Settings**, select **Apps** -> **Apps & features**  search for *Azure IoT Edge*. 

1. Search and download the required update from [EFLOW - Microsoft Update catalog](https://www.catalog.update.microsoft.com/Search.aspx?q=Azure%20IoT%20Edge%20for%20Linux%20on%20Windows).

1. Extract *AzureIoTEdge.msi* from the downloaded *.cab* file.

1. Install the extracted *AzureIoTEdge.msi*.
<!-- end iotedge-2020-11 -->
:::moniker-end


## Managing Microsoft Updates

As explained before, IoT Edges for Linux on Windows updates are serviced using Microsoft Update channel, so turn on/off EFLOW updates, you'll have to manage Microsoft Updates. Listed below are some of the ways to automate turning on/off Microsoft updates. For more information about managing OS updates, see [OS Updates](/windows/iot/iot-enterprise/os-features/updates#completely-turn-off-windows-updates).

1. **CSP Policies** - By using the **Update/AllowMUUpdateService** CSP Policy - For more information about Microsoft Updates CSP policy, see [Policy CSP - MU Update](/windows/client-management/mdm/policy-csp-update#update-allowmuupdateservice).

1. **Manually manage Microsoft Updates** - For more information about how to Opt-In to Microsoft Updates, see [Opt-In to Microsoft Update](/windows/win32/wua_sdk/opt-in-to-microsoft-update).

<!-- 1.1 -->
:::moniker range="iotedge-2018-06"
## Special case: Migration from HCS to VMMS on Server SKUs

If you're updating a Windows Server SKU device previous to [1.1.2110.0311](https://github.com/Azure/iotedge-eflow/releases/tag/1.1.2110.03111) version of IoT Edge for Linux on Windows to the latest available version, you need to do a manual migration.

Update [1.1.2110.0311](https://github.com/Azure/iotedge-eflow/releases/tag/1.1.2110.03111) introduced a change to the VM technology (HCS to VMMS) used for EFLOW Windows Server deployments. You can execute the VM migration with the following steps:

 1. Using Microsoft Update, download and install the [1.1.2110.0311](https://github.com/Azure/iotedge-eflow/releases/tag/1.1.2110.03111) update (same as any other EFLOW update, no need for manual steps as long as EFLOW updates are turned on).
 2. Once EFLOW update is finished, open an elevated PowerShell session.
 3. Run the migration script:

    ```powershell
    Migrate-EflowVmFromHcsToVmms
    ```

>[!NOTE]
>Fresh EFLOW 1.1.2110.0311 MSI installations on Windows Server SKUs will result in EFLOW deployments using VMMS technology, so no migration is needed.
<!-- end 1.1 -->
:::moniker-end

## Migrations between EFLOW 1.1 LTS and EFLOW CR

IoT Edge for Linux on Windows doesn't support migrations between the different release trains. If you want to move from the 1.1LTS version to the Continuous Release (CR) version or viceversa, you'll have to uninstall the current version and install the new desired version. 


## Next steps

View the latest [IoT Edge for Linux on Windows releases](https://github.com/Azure/iotedge-eflow/releases).

Read more about [IoT Edge for Linux on Windows security premises](./iot-edge-for-linux-on-windows-security.md).