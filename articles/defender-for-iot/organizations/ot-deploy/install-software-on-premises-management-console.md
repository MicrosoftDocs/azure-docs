---
title: Install Microsoft Defender for IoT on-premises management console software - Microsoft Defender for IoT
description: Learn how to install Microsoft Defender for IoT on-premises management console software. Use this article if you're reinstalling software on a pre-configured appliance, or if you've chosen to install software on your own appliances.
ms.date: 12/13/2022
ms.topic: install-set-up-deploy
---

# Install Microsoft Defender for IoT on-premises management console software

This article is one in a series of articles describing the [deployment path](air-gapped-deploy.md) for a Microsoft Defender for IoT on-premises management console for air-gapped OT sensors.

:::image type="content" source="../media/deployment-paths/management-install.png" alt-text="Diagram of a progress bar with Install software highlighted." border="false" lightbox="../media/deployment-paths/management-install.png":::

Use the procedures in this article when installing Microsoft Defender for IoT software on an on-premises management console. You might be reinstalling software on a [pre-configured appliance](../ot-pre-configured-appliances.md), or you may be installing software on your own appliance.

[!INCLUDE [caution do not use manual configurations](../includes/caution-manual-configurations.md)]

## Prerequisites

Before installing Defender for IoT software on your on-premises management console, make sure that you have:

- An [OT plan in Defender for IoT](../getting-started.md) on your Azure subscription.

- Access to the Azure portal as a [Security Reader](../../../role-based-access-control/built-in-roles.md#security-reader), [Security Admin](../../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../../role-based-access-control/built-in-roles.md#contributor), or [Owner](../../../role-based-access-control/built-in-roles.md#owner) user

- A [physical or virtual appliance prepared](prepare-management-appliance.md)for your on-premises management console.

## Download software files from the Azure portal

Download on-premises management console software from Defender for IoT in the Azure portal.

Select **Getting started** > **On-premises management console** and select the software version you want to download.

> [!IMPORTANT]
> If you're updating software from a previous version, alternately use the options from the **Sites and sensors** > **Sensor update (Preview)** menu. Use this option especially when you're updating your on-premises management console together with connected OT sensors. For more information, see [Update Defender for IoT OT monitoring software](../update-ot-software.md).

[!INCLUDE [root-of-trust](../includes/root-of-trust.md)]

## Install on-premises management console software

This procedure describes how to install OT management software on an on-premises management console, for a physical or virtual appliance.

The installation process takes about 20 minutes. After the installation, the system is restarted several times.

> [!NOTE]
> Towards the end of this process you will be presented with the usernames and passwords for your device. Make sure to copy these down as these passwords will not be presented again.

**To install the software**:

1. Mount the ISO file onto your hardware appliance or VM using one of the following options:

    - **Physical media** – burn the ISO file to your external storage, and then boot from the media.

        - DVDs: First burn the software to the DVD as an image
        - USB drive: First make sure that you’ve created a bootable USB drive with software such as [Rufus](https://rufus.ie/en/), and then save the software to the USB drive. USB drives must have USB version 3.0 or later.

        Your physical media must have a minimum of 4-GB storage.

    - **Virtual mount** – use iLO for HPE appliances, or iDRAC for Dell appliances to boot the ISO file.

1. Select your preferred language for the installation process. For example:

   :::image type="content" source="../media/tutorial-install-components/on-prem-language-select.png" alt-text="Screenshot of selecting your preferred language for the installation process.":::

1. From the options displayed, select the management release you want to install based on the hardware profile you're using. 

1. Define the following network properties as prompted:

    - For the **Configure management network interface** prompt: For Dell appliances, enter `eth0` and `eth1`. For HP appliances, enter `enu1` and `enu2`, or `possible value`.

    - For the **Configure management network IP address**, **Configure subnet mask**, **Configure DNS**, and **Configure default gateway IP address** prompts, enter the relevant values for each item.

1. **(Optional)** To install a secondary Network Interface Card (NIC), define a hardware profile, and network properties as prompted.

    For the **Configure sensor monitoring interface**, enter `eth1` or `possible value`. For other prompts, enter the relevant values for each item.

    For example:

    :::image type="content" source="../media/tutorial-install-components/on-prem-secondary-nic-install.png" alt-text="Screenshot that shows the Secondary NIC install questions.":::

    If you choose not to install the secondary NIC now, you can [do so at a later time](../how-to-manage-the-on-premises-management-console.md#add-a-secondary-nic-after-installation).

1. Accept the settings and continue by entering `Y`.

1. <a name="users"></a>After about 10 minutes, the two sets of credentials appear. For example:

   :::image type="content" source="../media/tutorial-install-components/credentials-screen.png" alt-text="Screenshot of the credentials that appear that must be copied as they won't be presented again.":::

   Save the usernames and passwords, you'll need these credentials to access the platform the first time you use it.

    For more information, see [Default privileged on-premises users](../roles-on-premises.md#default-privileged-on-premises-users).

1. Select **Enter** to continue.

## Configure network adapters for a VM deployment

After deploying an on-premises management console sensor on a [virtual appliance](../ot-virtual-appliances.md), configure at least one network adapter on your VM to connect to both the on-premises management console UI and to any connected OT sensors. If you've added a secondary NIC to separate between the two connections, configure two separate network adapters.

**On your virtual machine**:

1. Open your VM settings for editing.
1. Together with the other hardware defined for your VM, such as memory, CPUs, and hard disk, add the following network adapters:

    |Adapters  |Description  |
    |---------|---------|
    |**Single network adapter**     |   To use a single network adapter, add **Network adapter 1** to connect to the on-premises management console UI and any connected OT sensors.      |
    |**Secondary NIC**     |   To use a secondary NIC in addition to your main network adapter, add: <br> <br> - **Network adapter 1** to connect to the on-premises management console UI <br>  - **Network adapter 2**, to connect to connected OT sensors     |

For more information, see:

- Your virtual machine software documentation
- [On-premises management console (VMware ESXi)](../appliance-catalog/virtual-management-vmware.md)
- [On-premises management console (Microsoft Hyper-V hypervisor)](../appliance-catalog/virtual-management-hyper-v.md)
- [Networking requirements](../networking-requirements.md)

## Find a port on your appliance

If you're having trouble locating the physical port on your appliance, sign into the on-premises management console and run the following command to find your port:

```bash
sudo ethtool -p <port value> <time-in-seconds>
```

This command causes the light on the port to flash for the specified time period. For example, entering `sudo ethtool -p eno1 120`, will have port eno1 flash for 2 minutes, allowing you to find the port on the back of your appliance.

## Next steps

For more information, see [Troubleshoot the on-premises management console](../how-to-troubleshoot-on-premises-management-console.md).

> [!div class="step-by-step"]
> [« Prepare an on-premises management console appliance](prepare-management-appliance.md)

> [!div class="step-by-step"]
> [Activate and set up an on-premises management console »](activate-deploy-management.md)
