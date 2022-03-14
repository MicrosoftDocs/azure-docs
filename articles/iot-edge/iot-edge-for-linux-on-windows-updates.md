---
title: Azure IoT Edge for Linux on Windows Updates | Microsoft Docs
description: Overview of Azure IoT Edge for Linux on Windows updates
author: PatAltimore

# this is the PM responsible
ms.reviewer: fcabrera
ms.service: iot-edge
services: iot-edge
ms.topic: conceptual
ms.date: 03/14/2022
ms.author: fcabrera
---

# Update IoT Edge for Linux on Windows

[!INCLUDE [iot-edge-version-all-supported](../../includes/iot-edge-version-all-supported.md)]

As the IoT Edge for Linux on Windows (EFLOW) application releases new versions, you'll want to update your IoT Edge devices for the latest features and security improvements. This article provides information about how to update your IoT Edge for Linux on Windows devices when a new version is available.

With IoT Edge for Linux on Windows, IoT Edge runs in a Linux virtual machine hosted on a Windows device. This virtual machine is pre-installed with IoT Edge, and has no package manager, so you cannot manually update or change any of the VM components. Instead, the virtual machine is managed with Microsoft Update to keep the components up to date automatically.

Each update consits of three components that may get updated to latest versions. The first is the IoT Edge runtime and security daemon, which is updated following the IoT Edge releases to keep the newest version available. For more information about IoT Edge updates, see [IoT Edge updates](./how-to-update-iot-edge.md). 

The second component is the virutal machine base operating system. The EFLOW virutal machine is based on [Microsoft CBL-Mariner](https://github.com/microsoft/CBL-Mariner) and each update will provide performance and security fixes to keep the OS with the latest CVE patches. As part of the EFLOW Release notes, the version will indicate the CBL-Mariner version used, and users can check the [CBL-Mariner Releases](https://github.com/microsoft/CBL-Mariner/releases) to get the list of CVEs fixed for each version. 

The third component is the group of Windows runtime components needed to run and interop with the EFLOW virutal machine. The EFLOW virtual machine lifecycle and interop is managed through differnt components: WSSDAgent, EFLOWProxy service and the PowerShell module. 

IoT Edge for Linux on Windows update are not cumulative, so in order to get to the latest version, you'll have to either do a fresh installtaion using the latest version, or apply all the preivous serciving updates until the desired version. 

To find the latest version of Azure IoT Edge for Linux on Windows, see [EFLOW releases](https://aka.ms/AzEFLOW-Releases).

<!-- 1.2 -->
:::moniker range=">=iotedge-2020-11"

>[!IMPORTANT]
>This is a Public Preview version of [Azure IoT Edge for Linux on Windows continuous release (EFLOW CR)](./version-history.md), not intended for production use. A clean install may be required for production use once the final General Availability (GA) release is available.
>
>To find out if you're currently using the continuous release version, navigate to **Settings** > **Apps** on your Windows device. Find **Azure IoT Edge** in the list of apps and features. If your listed version is 1.2.x.y, you are running the continuous release version.
<!-- end 1.2 -->
:::moniker-end

## Update using Microsoft Update

To receive IoT Edge for Linux on Windows updates, the Windows host should be configured to receive updates for other Microsoft products. You can turn this option with the following steps:

1. Open **Settings** on the Windows host.

1. Select **Updates & Security**.

1. Select **Advanced options**.

1. Toggle the *Receive updates for other Microsoft products when you update Windows* button to **On**.


## Offline manual update

In some scenarios with restricted or limited internet connectivity, you may want to manually apply EFLOW updates offline. This is possible using Micorsoft Update offline mechanisms. You can manually download and install an IoT Edge for LInux on Windows updates with the following steps:

<!-- 1.1 -->
:::moniker range="iotedge-2018-06"
1. Check the current EFLOW installed version. Open **Settings**, select **Apps** -> **Apps & features**  search for _Azure IoT Edge LTS_.
<!-- end 1.1 -->
:::moniker-end

<!-- 1.2 -->
:::moniker range=">=iotedge-2020-11"
1. Check the current EFLOW installed version. Open **Settings**, select **Apps** -> **Apps & features**  search for _Azure IoT Edge_. 
<!-- end 1.2 -->
:::moniker-end

1. Search and download the required update from [EFLOW - Microsoft Update catalog](https://www.catalog.update.microsoft.com/Search.aspx?q=Azure%20IoT%20Edge%20for%20Linux%20on%20Windows).

1. Extract _AzureIoTEdge.msi_ from the downloaded _.cab_ file.

1. Install the extracted _AzureIoTEdge.msi_.


<!-- 1.1 -->
:::moniker range="iotedge-2018-06"
## Special case: Migration from HCS to VMMS on Server SKUs

If you are updating a Windows Server SKU device previous to 1.1.2110.03111 version of IoT Edge for Linux on Windows to the latest available version, you need to do a manual migration.

Update [1.1.2110.0311](https://github.com/Azure/iotedge-eflow/releases/tag/1.1.2110.03111) introduced a change to the VM technology (HCS to VMMS) used for EFLOW Windows Server deployments. You can execute the VM migration with the following steps:

 1. Using Microsoft Update, download and install the 1.1.2110.03111 update (same as any other EFLOW update, no need for manual steps as long as EFLOW updates are turned on).
 2. Once EFLOW update is finished, open an elevated PowerShell session.
 3. Run the migration script:

    ```powershell
    Migrate-EflowVmFromHcsToVmms
    ```

Note: Fresh EFLOW 1.1.2110.0311 msi installations on Windows Server SKUs will result in EFLOW deployments using VMMS technology, so no migration is needed.
<!-- end 1.1 -->
:::moniker-end

## Migrations between EFLOW 1.1LTS and EFLOW CR




## Next steps

View the latest [Azure IoT Edge for Linux on Windows releases](https://github.com/Azure/iotedge-eflow/releases).

Stay up-to-date with recent updates and announcements in the [Internet of Things blog](https://azure.microsoft.com/blog/topics/internet-of-things/)