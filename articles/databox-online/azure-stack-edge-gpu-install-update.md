---
title: Install Update on Azure Stack Edge Pro GPU device | Microsoft Docs
description: Describes how to apply updates using the Azure portal and local web UI for Azure Stack Edge Pro GPU device and the Kubernetes cluster on the device.
services: databox
author: sipastak
ms.service: azure-stack-edge
ms.topic: how-to
ms.date: 08/26/2026
ms.author: sipastak
---
# Update your Azure Stack Edge Pro GPU

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes the steps to install an update on your Azure Stack Edge Pro device with GPU by using the local web UI and Azure portal.

Apply the software updates or hotfixes to keep your Azure Stack Edge Pro device and the associated Kubernetes cluster on the device up-to-date.

> [!NOTE]
> The procedure in this article uses a different version of the software. However, the process is the same for the current software version.

## About latest updates

The current version is Update 2607. This update installs two updates, the device update followed by Kubernetes updates.

The associated versions for this update are:

- Device software version: Azure Stack Edge 2607 (3.3.2607.3535)
- Device Kubernetes version: Azure Stack Kubernetes Edge 2607 (3.3.2607.3535)
- Device Kubernetes workload profile: Other workloads
- Kubernetes server version: v1.35.0
- IoT Edge version: 0.1.0-beta15
- Azure Arc version: 1.31.7
- GPU driver version: 590.48.01
- CUDA version: 13.1

For information on what's new in this update, go to [Release notes](azure-stack-edge-gpu-2607-release-notes.md).

**To apply the 2607 update, your device must pass through the mandatory update 2510.**

- If you aren't running the minimum required version, you see this error:

  *Update package can't be installed as its dependencies aren't met.*

- If your device is running a version earlier than 2501, update to 2501, then to 2510, before you update to 2607.
- If your device is running 2604, you can update directly to 2607.

Supported update paths:

| Current version of Azure Stack Edge software and Kubernetes | Update to Azure Stack Edge software and Kubernetes | Desired update to 2607 |
| ------------------------------------------------------------| ---------------------------------------------------| -----------------------|
| earlier than 2501                                           | update to 2501, then to 2510                       | 2607                   |
| earlier than 2510                                           | update to 2510                                     | 2607                   |
| 2604                                                        | Directly to 2607                                   | 2607                   |

### Update Azure Kubernetes service on Azure Stack Edge

> [!IMPORTANT]
>
>- Use the following procedure only if you're an SAP or a PMEC customer.
>- For SAP and PMEC customers, version 2510 is the last supported build.

If you deployed Azure Kubernetes service and your Azure Stack Edge device and Kubernetes versions are earlier than 2403, you must update in multiple steps to apply 2510.

Use the following steps to update your Azure Stack Edge version and Kubernetes version to 2510:

1. Update your device version to 2501.
1. Update your Kubernetes version to 2403.
1. Update your Kubernetes version to 2501.
1. Update both device software and Kubernetes to 2510.

If you're running earlier than 2403, update both your device version and Kubernetes version to 2403, then to 2501, and then to 2510.

If you're running 2501, you can update both your device version and Kubernetes version directly to 2510.

In Azure portal, the process requires two clicks. The first update gets your device version to 2510 and your Kubernetes version to 2501. The second update gets your Kubernetes version upgraded to 2510.

From the local UI, run each update separately: update the device version to 2501, update Kubernetes version to 2403, update Kubernetes version to 2501, and then update both the device version and Kubernetes version to 2510.

### Updates for a single-node or two-node cluster

The procedure to update an Azure Stack Edge is the same whether it's a single-node device or a two-node cluster. This procedure applies both to the Azure portal and to the local UI.

- **Single node** - For a single-node device, installing an update or hotfix is disruptive and restarts your device. Your device experiences downtime for the entire duration of the update.

- **Two-node** - For a two-node cluster, this procedure is an optimized update. The two-node cluster might experience short, intermittent disruptions while the update is in progress. Don't perform any operations on the device node when an update is in progress.

    The Kubernetes worker VMs go down when a node goes down. The Kubernetes master VM fails over to the other node. Workloads continue to run. For more information, see [Kubernetes failover scenarios for Azure Stack Edge](azure-stack-edge-gpu-kubernetes-failover-scenarios.md).

Provisioning actions such as creating shares or virtual machines aren't supported during update. The update takes about 60 to 75 minutes per node to complete.

To install updates on your device, follow these steps:

1. Configure the location of the update server.
1. Apply the updates via the Azure portal UI or the local web UI.

Each of these steps is described in the following sections.

## Configure update server

1. In the local web UI, go to **Configuration** > **Update server**.

1. In **Select update server type**, choose from the dropdown list either the Microsoft Update server (default) or Windows Server Update Services.  

    If you choose to update from the Windows Server Update Services, specify the server URI. The server at that URI deploys the updates to all the devices connected to this server.

    Use the WSUS server to manage and distribute updates through a management console. A WSUS server can also be the update source for other WSUS servers within the organization. The WSUS server that acts as an update source is called an upstream server. In a WSUS implementation, at least one WSUS server on your network must be able to connect to Microsoft Update to get available update information. As an administrator, you can determine - based on network security and configuration - how many other WSUS servers connect directly to Microsoft Update.

    For more information, see [Windows Server Update Services (WSUS)](/windows-server/administration/windows-server-update-services/get-started/windows-server-update-services-wsus)

## Use the Azure portal

We recommend that you install updates through Azure portal. The device automatically scans for updates once a day. When updates are available, you see a notification in the portal. You can then download and install the updates.

> [!NOTE]
>
> - Make sure that the device is healthy and the status shows **Your device is running fine!** before you proceed to install the updates.
> - Tiering data from an Azure Stack Edge Pro device to the mapped Azure Storage account uses Managed Service Identity to authorize the data access. Make sure that the Azure Storage account you use has the following roles assigned to the Managed identities for Azure Stack Edge resource:
>
>   - Storage Blob Data Contributor
>   - Storage File Data Privileged Contributor
>   - Contributor
>
>    For more information, see [Assign an Azure role for access to blob data](../storage/blobs/assign-azure-role-data-access.md?tabs=portal#assign-an-azure-role).

Depending on the software version that you're running, the install process might differ slightly.

- If you're updating from 2106 to 2110 or later, you get a one-click install. See the **version 2106 and later** tab for instructions.
- If you're updating to versions before 2110, you get a two-click install. See **version 2105 and earlier** tab for instructions.

### [version 2106 and later](#tab/version-2106-and-later)

[!INCLUDE [azure-stack-edge-install-2110-updates](../../includes/azure-stack-edge-install-2110-updates.md)]

   :::image type="content" source="./media/azure-stack-edge-gpu-install-update/portal-update-17.png" alt-text="Screenshot of updated software version in local UI." lightbox="media/azure-stack-edge-gpu-install-update/portal-update-17.png":::

### [version 2105 and earlier](#tab/version-2105-and-earlier)

1. When updates are available for your device, you see a notification in the **Overview** page of your Azure Stack Edge resource. Select the notification or from the top command bar, **Update device**. This action applies device software updates.

    :::image type="content" source="./media/azure-stack-edge-gpu-install-update/portal-update-1.png" alt-text="Screenshot of Azure Stack Edge Overview page highlighting Overview menu, Update device option, and device status message." lightbox="media/azure-stack-edge-gpu-install-update/portal-update-1.png":::

1. In the **Device updates** pane, check that you reviewed the license terms associated with new features in the release notes.

    Choose **Download and install** to download and install the updates, or choose **Download** to download the updates only. You can choose to install these updates later.

    :::image type="content" source="./media/azure-stack-edge-gpu-install-update/device-updates-download-consent.png" alt-text="Screenshot of Device updates dialog highlighting the two consent checkboxes and the Download button." lightbox="media/azure-stack-edge-gpu-install-update/device-updates-download-consent.png":::

    If you want to download and install the updates, check the option that updates install automatically after the download completes.

    :::image type="content" source="./media/azure-stack-edge-gpu-install-update/portal-update-2-b.png" alt-text="Screenshot of Device updates pane showing update details, selected consent checkboxes, and the Download & Install button." lightbox="media/azure-stack-edge-gpu-install-update/portal-update-2-b.png":::

1. The download of updates starts. You see a notification that the download is in progress.

    :::image type="content" source="./media/azure-stack-edge-gpu-install-update/portal-update-3.png" alt-text="Screenshot of the update download progress notification." lightbox="media/azure-stack-edge-gpu-install-update/portal-update-3.png":::

    A notification banner also appears in the Azure portal. This banner indicates the download progress.

    :::image type="content" source="./media/azure-stack-edge-gpu-install-update/portal-update-4.png" alt-text="Screenshot of the Azure Stack Edge device Overview page with a Downloading updates notification banner." lightbox="media/azure-stack-edge-gpu-install-update/portal-update-4.png":::

    Select this notification or select **Update device** to see the detailed status of the update.

    :::image type="content" source="./media/azure-stack-edge-gpu-install-update/portal-update-5.png" alt-text="Screenshot of the Download and install updates pane." lightbox="media/azure-stack-edge-gpu-install-update/portal-update-5.png":::

1. After the download finishes, the notification banner updates to indicate completion. If you chose to download and install the updates, the installation begins automatically. If you chose to download updates only, select the notification to open the **Device updates** pane. Select **Install**.

1. You see a notification that the install is in progress. The portal also displays an informational alert to indicate that the install is in progress. The device goes offline and enters maintenance mode.
  
    :::image type="content" source="./media/azure-stack-edge-gpu-install-update/portal-update-9.png" alt-text="Screenshot of the Azure Stack Edge device Overview page with a banner stating the device is in maintenance mode." lightbox="media/azure-stack-edge-gpu-install-update/portal-update-9.png":::

1. For a single-node device, the device restarts after the updates are installed. The critical alert during the restart indicates that the device heartbeat is lost.

    :::image type="content" source="./media/azure-stack-edge-gpu-install-update/portal-update-10.png" alt-text="Screenshot of the Azure Stack Edge Overview page with a critical alert stating the device heartbeat is missing." lightbox="media/azure-stack-edge-gpu-install-update/portal-update-10.png":::

    Select the alert to see the corresponding device event.

    :::image type="content" source="./media/azure-stack-edge-gpu-install-update/portal-update-11.png" alt-text="Screenshot of Device events list with critical Lost heartbeat from your device alert." lightbox="media/azure-stack-edge-gpu-install-update/portal-update-11.png":::

1. After the restart, the device software finishes updating. After the update finishes, you can verify from the local web UI that the device software is updated. The Kubernetes software version isn't updated.

    :::image type="content" source="./media/azure-stack-edge-gpu-install-update/portal-update-12.png" alt-text="Screenshot of the local web UI Software update page showing the updated device software version." lightbox="media/azure-stack-edge-gpu-install-update/portal-update-12.png":::

1. You see a notification banner indicating that device updates are available. Select this banner to start updating the Kubernetes software on your device.

    :::image type="content" source="./media/azure-stack-edge-gpu-install-update/portal-update-13.png" alt-text="Screenshot of Azure Stack Edge device Overview page with Update device button and new device update banner." lightbox="media/azure-stack-edge-gpu-install-update/portal-update-13.png":::

    :::image type="content" source="./media/azure-stack-edge-gpu-install-update/device-overview-update-device-notification.png" alt-text="Screenshot of the device Overview blade showing Update device command and device notification." lightbox="media/azure-stack-edge-gpu-install-update/device-overview-update-device-notification.png":::

    If you select the **Update device** from the top command bar, you can see the progress of the updates.  

    :::image type="content" source="./media/azure-stack-edge-gpu-install-update/portal-update-14-b.png" alt-text="Screenshot of the Device updates pane showing update details, license acceptance checkboxes, and the Download & Install button." lightbox="media/azure-stack-edge-gpu-install-update/portal-update-14-b.png":::

1. The device status updates to **Your device is running fine** after the updates are installed.

    :::image type="content" source="./media/azure-stack-edge-gpu-install-update/portal-update-15.png" alt-text="Screenshot of the Azure Stack Edge device Overview page showing the message Your device is running fine! ." lightbox="media/azure-stack-edge-gpu-install-update/portal-update-15.png":::

    Go to the local web UI and then go to **Software update** page. Verify that the Kubernetes update is installed and the software version reflects that.

    :::image type="content" source="./media/azure-stack-edge-gpu-install-update/portal-update-17.png" alt-text="Screenshot of the Software update page showing the installed Kubernetes version." lightbox="media/azure-stack-edge-gpu-install-update/portal-update-17.png":::

When the device software and Kubernetes updates are installed, the banner notification disappears.

---

Your device now has the latest version of device software and Kubernetes.

## Use the local web UI

Using the local web UI involves two steps:

1. Download the update or the hotfix
1. Install the update or the hotfix

The following sections describe each of these steps in detail.

### Download the update or the hotfix

Follow these steps to download the update. You can download the update from the Microsoft-supplied location or from the Microsoft Update Catalog.

To download the update from the Microsoft Update Catalog, follow these steps:

1. Start the browser and go to [https://catalog.update.microsoft.com](https://catalog.update.microsoft.com).

    :::image type="content" source="./media/azure-stack-edge-gpu-install-update/download-update-1.png" alt-text="Screenshot of the Update Catalog Welcome page with the search box and Search button." lightbox="media/azure-stack-edge-gpu-install-update/download-update-1.png":::

1. In the search box of the Microsoft Update Catalog, enter the Knowledge Base (KB) number of the hotfix or terms for the update you want to download. For example, enter **Azure Stack Edge**, and then select **Search**.

    The update listing appears as **Azure Stack Edge Update 2501**.

    > [!NOTE]
    > Make sure to verify which workload you're running on your device [via the local UI](./azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy.md#configure-compute-ips) or [via the PowerShell](./azure-stack-edge-connect-powershell-interface.md) interface of the device. Depending on the workload that you're running, the update package differs.

    Specify the update package for your environment. Use the following table as a reference:

    | Kubernetes | Local UI Kubernetes workload profile | Update package name | Example Update File |
    | ------------------ | -------------- | --------------------------- | ----------------------------------- |
    | Azure Kubernetes Service | Azure Private MEC Solution in your environment<br><br>SAP Digital Manufacturing for Edge Computing or another Microsoft Partner Solution in your Environment | Azure Stack Edge Update 2403 Kubernetes Package for Private MEC/SAP Workloads | release~ase-2307d.3.2.2380.1632-42623-79365624-release_host_MsKubernetes_Package |
    | Kubernetes for Azure Stack Edge | Other workloads in your environment | Azure Stack Edge Update 2403 Kubernetes Package for Non Private MEC/Non SAP Workloads | \release~ase-2307d.3.2.2380.1632-42623-79365624-release_host_AseKubernetes_Package |

1. Select **Download**. Download two packages for the update. The first package has two files for the device software updates (*SoftwareUpdatePackage.0.exe*, *SoftwareUpdatePackage.1.exe*). The second package has two files for the Kubernetes updates (*Kubernetes_Package.0.exe* and *Kubernetes_Package.1.exe*). Download the packages to a folder on the local system. You can also copy the folder to a network share that the device can reach.

### Install the update or the hotfix

Before you install the update or hotfix, ensure that:

- You download the update or hotfix locally on your host or have access to it through a network share.
- Your device status is healthy as shown in the **Overview** page of the local web UI.

   :::image type="content" source="./media/azure-stack-edge-gpu-install-update/local-ui-update-1.png" alt-text="Screenshot of the Azure Stack Edge Pro local web UI Overview page with Health status showing Healthy." lightbox="media/azure-stack-edge-gpu-install-update/local-ui-update-1.png":::

This procedure takes around 20 minutes to complete. Follow these steps to install the update or hotfix.

1. In the local web UI, go to **Maintenance** > **Software update**. Make a note of the software version that you're running.

1. Enter the path to the update file. You can also browse to the update installation file if it's on a network share. Select both software files together (with *SoftwareUpdatePackage.0.exe* and *SoftwareUpdatePackage.1.exe* suffix).

1. Select **Apply update**.

1. When prompted for confirmation, select **Yes** to proceed. Because the device is a single node device, after the update is applied, the device restarts and there's downtime.

   :::image type="content" source="./media/azure-stack-edge-gpu-install-update/local-ui-update-5.png" alt-text="Screenshot of the Software update confirmation dialog." lightbox="media/azure-stack-edge-gpu-install-update/local-ui-update-5.png":::

1. The update starts. After the device is successfully updated, it restarts. The local UI isn't accessible during this time.

1. After the restart is complete, you're taken to the **Sign in** page. To verify that the device software is updated, in the local web UI, go to **Maintenance** > **Software update**. For the current release, the displayed software version should be **Azure Stack Edge 2501**.

1. Now update the Kubernetes software version. Select the remaining two Kubernetes files together (a file with the *Kubernetes_Package.0.exe* and the other with *Kubernetes_Package.1.exe* suffix) and repeat the preceding steps to apply the update.

1. Select **Apply Update**.

1. When prompted for confirmation, select **Yes** to proceed.

1. After the Kubernetes update is successfully installed, there's no change to the displayed software in **Maintenance** > **Software update**.

    :::image type="content" source="./media/azure-stack-edge-gpu-install-update/portal-update-17.png" alt-text="Screenshot of the Software update page after the Kubernetes update is installed." lightbox="media/azure-stack-edge-gpu-install-update/portal-update-17.png":::

## Next steps

- Learn more about [administering your Azure Stack Edge Pro](azure-stack-edge-manage-access-power-connectivity-mode.md).
