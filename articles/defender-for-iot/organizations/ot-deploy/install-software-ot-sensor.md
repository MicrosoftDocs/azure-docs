---
title: Install OT network monitoring software on OT sensors - Microsoft Defender for IoT
description: Learn how to install agentless monitoring software for an OT sensor for Microsoft Defender for IoT. Use this article if you've chosen to install software on your own appliances or when reinstalling software on a preconfigured appliance.
ms.date: 06/26/2023
ms.topic: install-set-up-deploy
---

# Install OT monitoring software on OT sensors

This article is one in a series of articles describing the [deployment path](../ot-deploy/ot-deploy-path.md) for OT monitoring with Microsoft Defender for IoT, and describes how to install Defender for IoT software on OT sensors and configure initial setup settings.

:::image type="content" source="../media/deployment-paths/progress-deploy-your-sensors.png" alt-text="Diagram of a progress bar with Deploy your sensors highlighted." border="false" lightbox="../media/deployment-paths/progress-deploy-your-sensors.png":::

Use the procedures in this article when installing Microsoft Defender for IoT software on your own appliances. You might be reinstalling software on a [preconfigured appliance](../ot-pre-configured-appliances.md), or you may be installing software on your own appliance. If you're using a new preconfigured appliance, skip this step and continue directly with [configuring and activating your sensor](activate-deploy-sensor.md) instead.

[!INCLUDE [caution do not use manual configurations](../includes/caution-manual-configurations.md)]


## Prerequisites

Before installing, configuring, and activating your OT sensor, make sure that you have:

- A [plan](../best-practices/plan-prepare-deploy.md) for your OT site deployment with Defender for IoT, including the appliance you're using for your OT sensor.

- Access to the Azure portal as a [Security Reader](../../../role-based-access-control/built-in-roles.md#security-reader), [Security Admin](../../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../../role-based-access-control/built-in-roles.md#contributor), or [Owner](../../../role-based-access-control/built-in-roles.md#owner) user.

- Performed extra procedures per appliance type. Each appliance type also comes with its own set of instructions that are required before installing Defender for IoT software.

    Make sure that you've completed any specific procedures required for your appliance before installing Defender for IoT software. If your appliance has a RAID storage array, make sure to configure it before you continue installation.

    For more information, see:

    - The [OT monitoring appliance catalog](../appliance-catalog/index.yml)
    - [Which appliances do I need?](../ot-appliance-sizing.md)
    - [OT monitoring with virtual appliances](../ot-virtual-appliances.md)

- Access to the physical or virtual appliance where you're installing your sensor. For more information, see [Which appliances do I need?](../ot-appliance-sizing.md)

This step is performed by your deployment teams.

> [!NOTE]
> There is no need to pre-install an operating system on the VM. The sensor installation includes the operating system image.
>

### Configure network adapters for a VM deployment

Before deploying an OT sensor on a [virtual appliance](../ot-virtual-appliances.md), configure at least two network adapters on your VM: one to connect to the Azure portal, and another to connect to traffic mirroring ports.

**On your virtual machine**:

1. Open your VM settings for editing.

1. Together with the other hardware defined for your VM, such as memory, CPUs, and hard disk, add the following network adapters:

    - **Network adapter 1**, to connect to the Azure portal for cloud management.
    - **Network adapter 2**, to connect to a traffic mirroring port that's configured to allow promiscuous mode traffic. If you're connecting your sensor to multiple traffic mirroring ports, make sure there's a network adapter configured for each port.

For more information, see:

- Your virtual machine software documentation
- [OT network sensor VM (VMware ESXi)](../appliance-catalog/virtual-sensor-vmware.md)
- [OT network sensor VM (Microsoft Hyper-V)](../appliance-catalog/virtual-sensor-hyper-v.md)
- [Networking requirements](../networking-requirements.md)

> [!NOTE]
> If you're working with an air-gapped sensor and are [deploying an on-premises management console](air-gapped-deploy.md), configure **Network adapter 1** to connect to the on-premises management console UI instead of the Azure portal.
>

## Download software files from the Azure portal

Download the OT sensor software from Defender for IoT in the Azure portal.

In Defender for IoT on the Azure portal, select **Getting started** > **Sensor**, and then select the software version you want to download.

> [!IMPORTANT]
> If you're updating software from a previous version, use the options from the **Sites and sensors** > **Sensor update** menu. For more information, see [Update Defender for IoT OT monitoring software](../update-ot-software.md).

## Install Defender or IoT software on OT sensors

This procedure describes how to install the Defender for IoT software you'd downloaded from the Azure portal.

> [!TIP]
> While you can run this procedure and watch the installation from a deployment workstation, after you boot your sensor machine from the physical media or virtual mount, the installation can also run automatically on its own.
>
> If you choose to do this without a keyboard or screen, note the default IP address listed at the end of this procedure. Use the default IP address to access the sensor from a browser and [continue the deployment process](activate-deploy-sensor.md) from there.
>

**To install your software**:

1. Mount the downloaded ISO file onto your hardware appliance or VM using one of the following options:

    - **Physical media** – burn the ISO file to your external storage, and then boot from the media.

        - DVDs: First burn the software to the DVD as an image.
        - USB drive: First make sure that you’ve created a bootable USB drive with software such as [Rufus](https://rufus.ie/en/), and then save the software to the USB drive. USB drives must have USB version 3.0 or later.
        - Select the **DD Image mode** setting when creating your image, for example:

        :::image type="content" source="media/rufus-4-4-dd-image-mode.png" alt-text="Screenshot of the DD image settings.":::

        :::image type="content" source="media/rufus-4-4-drive-properties.png" alt-text="Screenshot of the drive properties.":::

        Your physical media must have a minimum of 4-GB storage.

    - **Virtual mount** – use iLO for HPE appliances, or iDRAC for Dell appliances to boot the ISO file.

1. When the installation boots, you're prompted to start the installation process. Either select the **Install iot-sensor-`<version number>`** item to continue, or leave the wizard to make the selection automatically on its own.

    The wizard automatically selects to install the software after 30 seconds of waiting. For example:

    :::image type="content" source="../media/install-software-ot-sensor/initial-install-screen.png" alt-text="Screenshot of the initial installation screen.":::

    > [!NOTE]
    > If you're using a legacy BIOS version, you're prompted to select a language and the installation options are presented at the top left instead of in the center. When prompted, select `English` and then the **Install iot-sensor-`<version number>`** option to continue.

    The installation begins, giving you updated status messages as it goes. The entire installation process takes up to 20-30 minutes, and may vary depending on the type of media you're using.

    When the installation is complete, you're shown the following a set of default networking details. While the default IP, subnet, and gateway addresses are identical with each installation, the UID is unique for each appliance. For example:

    ```bash
    IP: 192.168.0.101, 
    SUBNET: 255.255.255.0, 
    GATEWAY: 192.168.0.1,
    UID: 91F14D56-C1E4-966F-726F-006A527C61D
    ```

Use the default IP address provided to access your sensor for [initial setup and activation](activate-deploy-sensor.md).


## Next steps

For more information, see [Troubleshoot the sensor](../how-to-troubleshoot-sensor.md).

> [!div class="step-by-step"]
> [« Provision OT sensors for cloud management](provision-cloud-management.md)

> [!div class="step-by-step"]
> [Validate after installing software »](post-install-validation-ot-software.md)
