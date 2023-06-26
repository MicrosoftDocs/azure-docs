---
title: Install OT network monitoring software on OT sensors - Microsoft Defender for IoT
description: Learn how to install agentless monitoring software for an OT sensor for Microsoft Defender for IoT. Use this article if you've chosen to install software on your own appliances or when reinstalling software on a pre-configured appliance.
ms.date: 06/26/2023
ms.topic: install-set-up-deploy
---

# Install OT monitoring software on OT sensors

<!--TBD TO UPDATE FOR HEADLESS-->

This article is one in a series of articles describing the [deployment path](../ot-deploy/ot-deploy-path.md) for OT monitoring with Microsoft Defender for IoT, and describes how to install Defender for IoT software on OT sensors.

:::image type="content" source="../media/deployment-paths/progress-deploy-your-sensors.png" alt-text="Diagram of a progress bar with Deploy your sensors highlighted." border="false" lightbox="../media/deployment-paths/progress-deploy-your-sensors.png":::

Use the procedures in this article when installing Microsoft Defender for IoT software on your own appliances. You might be reinstalling software on a [pre-configured appliance](../ot-pre-configured-appliances.md), or you may be installing software on your own appliance.

If you're using pre-configured appliances, skip this step and continue directly with [activating and setting up your OT network sensor](activate-deploy-sensor.md) instead.

[!INCLUDE [caution do not use manual configurations](../includes/caution-manual-configurations.md)]

## Prerequisites

Before installing Microsoft Defender for IoT, make sure that you have:

- A [plan](../best-practices/plan-prepare-deploy.md) for your OT site deployment with Defender for IoT, including the appliance you'll be using for your OT sensor.

- Access to the Azure portal as a [Security Reader](../../../role-based-access-control/built-in-roles.md#security-reader), [Security Admin](../../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../../role-based-access-control/built-in-roles.md#contributor), or [Owner](../../../role-based-access-control/built-in-roles.md#owner) user.

- Performed extra procedures per appliance type. Each appliance type also comes with its own set of instructions that are required before installing Defender for IoT software.

    Make sure that you've completed any specific procedures required for your appliance before installing Defender for IoT software.

    For more information, see:

    - The [OT monitoring appliance catalog](../appliance-catalog/index.yml)
    - [Which appliances do I need?](../ot-appliance-sizing.md)
    - [OT monitoring with virtual appliances](../ot-virtual-appliances.md)

This step is performed by your deployment teams.

> [!NOTE]
> There is no need to pre-install an operating system on the VM, the sensor installation includes the operating system image.

## Download software files from the Azure portal

Download the OT sensor software from Defender for IoT in the Azure portal.

In Defender for IoT on the Azure portal, select **Getting started** > **Sensor**, and then select the software version you want to download.

> [!IMPORTANT]
> If you're updating software from a previous version, use the options from the **Sites and sensors** > **Sensor update** menu. For more information, see [Update Defender for IoT OT monitoring software](../update-ot-software.md).

## Install Defender or IoT software on OT sensors

This procedure describes how to install OT monitoring software on an OT network sensor.

> [!NOTE]
> Towards the end of this process you will be presented with the usernames and passwords for your device. Make sure to copy these down as these passwords will not be presented again.

**To install your software**:

1. Mount the ISO file onto your hardware appliance or VM using one of the following options:

    - **Physical media** – burn the ISO file to your external storage, and then boot from the media.

        - DVDs: First burn the software to the DVD as an image
        - USB drive: First make sure that you’ve created a bootable USB drive with software such as [Rufus](https://rufus.ie/en/), and then save the software to the USB drive. USB drives must have USB version 3.0 or later.

        Your physical media must have a minimum of 4-GB storage.

    - **Virtual mount** – use iLO for HPE appliances, or iDRAC for Dell appliances to boot the ISO file.

1. When the installation boots, you're prompted to start the installation process. Select the **Install iot-sensor-<version number>** item to continue. <!--For example: TBD-->

1. The installation begins, giving you updated confirmation messages as it goes. <!--For example: TBD-->

    When the installation is complete, a language options page appears. Select your language to continue.

1. You're prompted to sign in. Sign in with the support user and the initial password. <!--what is it and how do they get it?--> 

1. You're prompted to change the **support** user password. Enter the new password to complete the installation.

<!--do we have a success message?-->

The installation is complete.

## Configure network adapters for a VM deployment

After deploying an OT sensor on a [virtual appliance](../ot-virtual-appliances.md), configure at least two network adapters on your VM: one to connect to the Azure portal, and another to connect to traffic mirroring ports.

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

## Next steps

For more information, see [Troubleshoot the sensor](../how-to-troubleshoot-sensor.md).

> [!div class="step-by-step"]
> [« Provision OT sensors for cloud management](provision-cloud-management.md)


> [!div class="step-by-step"]
> [Validate after installing software »](post-install-validation-ot-software.md)
