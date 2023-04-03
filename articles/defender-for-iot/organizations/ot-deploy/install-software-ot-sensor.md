---
title: Install OT network monitoring software on OT sensors - Microsoft Defender for IoT
description: Learn how to install agentless monitoring software for an OT sensor for Microsoft Defender for IoT. Use this article if you've chosen to install software on your own appliances or when reinstalling software on a pre-configured appliance.
ms.date: 12/13/2022
ms.topic: install-set-up-deploy
---

# Install OT monitoring software on OT sensors

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

1. When the installation boots, you're first prompted to select the hardware profile you want to use. For example:

    :::image type="content" source="../media/tutorial-install-components/sensor-architecture.png" alt-text="Screenshot of the sensor's hardware profile options." lightbox="../media/tutorial-install-components/sensor-architecture.png":::

    For more information, see [Which appliances do I need?](../ot-appliance-sizing.md).

    After you've selected the hardware profile, the following steps occur, and can take a few minutes:

    - System files are installed
    - The sensor appliance reboots
    - Sensor files are installed

    When the installation steps are complete, the Ubuntu **Package configuration** screen is displayed, with the `Configuring iot-sensor` wizard, showing a prompt to  select your monitor interfaces.

    In the `Configuring iot-sensor` wizard, use the up or down arrows to navigate, and the SPACE bar to select an option. Press ENTER to advance to the next screen.

1. In the wizard's `Select monitor interfaces` screen, select the interfaces you want to monitor.

    By default, `eno1` is reserved for the management interface and we recommend that you leave this option unselected.

    For example:

    :::image type="content" source="../media/tutorial-install-components/monitor-interface.png" alt-text="Screenshot of the select monitor interface screen.":::

    > [!IMPORTANT]
    > Make sure that you select only interfaces that are connected.
    >
    > If you select interfaces that are enabled but not connected, the sensor will show a *No traffic monitored* health notification in the Azure portal. If you connect more traffic sources after installation and want to monitor them with Defender for IoT, you can add them via the [CLI](../references-work-with-defender-for-iot-cli-commands.md).

1. In the `Select erspan monitor interfaces` screen, select any ERSPAN monitoring ports that you have. The wizard lists available interfaces, even if you don't have any ERSPAN monitoring ports in your system. If you have no ERSPAN monitoring ports, leave all options unselected.

    For example:

    :::image type="content" source="../media/tutorial-install-components/erspan-monitor.png" alt-text="Screenshot of the select erspan monitor screen.":::

1. In the `Select management interface` screen, we recommend keeping the default `eno1` value selected as the management interface.

    For example:

    :::image type="content" source="../media/tutorial-install-components/management-interface.png" alt-text="Screenshot of the management interface select screen.":::

1. In the `Enter sensor IP address` screen, enter the IP address for the sensor appliance you're installing.

    :::image type="content" source="../media/tutorial-install-components/sensor-ip-address.png" alt-text="Screenshot of the sensor IP address screen.":::

1. In the `Enter path to the mounted backups folder` screen, enter the path to the sensor's mounted backups. We recommend using the default path of `/opt/sensor/persist/backups`. For example:

    :::image type="content" source="../media/tutorial-install-components/mounted-backups-path.png" alt-text="Screenshot of the mounted backup path screen.":::

1. In the `Enter Subnet Mask` screen, enter the IP address for the sensor's subnet mask. For example:

    :::image type="content" source="../media/tutorial-install-components/sensor-subnet-ip.png" alt-text="Screenshot of the Enter Subnet Mask screen.":::

1. In the `Enter Gateway` screen, enter the sensor's default gateway IP address. For example:

    :::image type="content" source="../media/tutorial-install-components/sensor-gateway-ip.png" alt-text="Screenshot of the Enter Gateway screen.":::

1. In the `Enter DNS server` screen, enter the sensor's DNS server IP address. For example:

    :::image type="content" source="../media/tutorial-install-components/sensor-dns-ip.png" alt-text="Screenshot of the Enter DNS server screen.":::

1. In the `Enter hostname` screen, enter the sensor hostname. For example:

    :::image type="content" source="../media/tutorial-install-components/sensor-hostname.png" alt-text="Screenshot of the Enter hostname screen.":::

1. In the `Run this sensor as a proxy server (Preview)` screen, select `<Yes>` only if you want to configure a proxy, and then enter the proxy credentials as prompted.

    The default configuration is without a proxy.

    For more information, see [Connect Microsoft Defender for IoT sensors without direct internet access by using a proxy (version 10.x)](../how-to-connect-sensor-by-proxy.md).

1. <a name=credentials></a>The installation process starts running and then shows the credentials screen. For example:

    :::image type="content" source="../media/tutorial-install-components/login-information.png" alt-text="Screenshot of the final screen of the installation with usernames, and passwords.":::

    Save the usernames and passwords listed, as the passwords are unique and this is the only time that the credentials are shown. Copy the credentials to a safe place so that you can use them when signing into the sensor for the first time.

    For more information, see [Default privileged on-premises users](../roles-on-premises.md#default-privileged-on-premises-users).

    Select `<Ok>` when you're ready to continue.

    The installation continues running again, and then reboots when the installation is complete. Upon reboot, you're prompted to enter credentials to sign in. For example:

    :::image type="content" source="../media/tutorial-install-components/sensor-sign-in.png" alt-text="Screenshot of a sensor sign-in screen after installation.":::

1. Enter the credentials for one of the users that you'd copied down in the [previous step](#credentials).

    - If the `iot-sensor login:` prompt disappears, press **ENTER** to have it shown again.
    - When you enter your password, the password characters don't display on the screen. Make sure you enter them carefully.

    When you've successfully signed in, the following confirmation screen appears:

    :::image type="content" source="../media/tutorial-install-components/install-complete.png" alt-text="Screenshot of the sign-in confirmation.":::

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
