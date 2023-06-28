---
title: Install OT network monitoring software on OT sensors - Microsoft Defender for IoT
description: Learn how to install agentless monitoring software for an OT sensor for Microsoft Defender for IoT. Use this article if you've chosen to install software on your own appliances or when reinstalling software on a pre-configured appliance.
ms.date: 06/26/2023
ms.topic: install-set-up-deploy
---

# Install and set up your OT sensor

This article is one in a series of articles describing the [deployment path](../ot-deploy/ot-deploy-path.md) for OT monitoring with Microsoft Defender for IoT, and describes how to install Defender for IoT software on OT sensors and configure initial setup settings.

:::image type="content" source="../media/deployment-paths/progress-deploy-your-sensors.png" alt-text="Diagram of a progress bar with Deploy your sensors highlighted." border="false" lightbox="../media/deployment-paths/progress-deploy-your-sensors.png":::

[!INCLUDE [caution do not use manual configurations](../includes/caution-manual-configurations.md)]


## Prerequisites

Before installing, configuring, and activating your OT sensor, make sure that you have:

- A [plan](../best-practices/plan-prepare-deploy.md) for your OT site deployment with Defender for IoT, including the appliance you'll be using for your OT sensor.

- Access to the Azure portal as a [Security Reader](../../../role-based-access-control/built-in-roles.md#security-reader), [Security Admin](../../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../../role-based-access-control/built-in-roles.md#contributor), or [Owner](../../../role-based-access-control/built-in-roles.md#owner) user.

- Performed extra procedures per appliance type. Each appliance type also comes with its own set of instructions that are required before installing Defender for IoT software.

    Make sure that you've completed any specific procedures required for your appliance before installing Defender for IoT software.

    For more information, see:

    - The [OT monitoring appliance catalog](../appliance-catalog/index.yml)
    - [Which appliances do I need?](../ot-appliance-sizing.md)
    - [OT monitoring with virtual appliances](../ot-virtual-appliances.md)

- An OT sensor [onboarded](../onboard-sensors.md) to Defender for IoT in the Azure portal and [installed](install-software-ot-sensor.md) or [purchased](../ot-pre-configured-appliances.md).

- The sensor's activation file, which was downloaded after [onboarding your sensor](../onboard-sensors.md). You need a unique activation file for each OT sensor you deploy.

    [!INCLUDE [root-of-trust](../includes/root-of-trust.md)]

- A SSL/TLS certificate. We recommend using a CA-signed certificate, and not a self-signed certificate. For more information, see [Create SSL/TLS certificates for OT appliances](create-ssl-certificates.md).

This step is performed by your deployment teams.

> [!NOTE]
> There is no need to pre-install an operating system on the VM. The sensor installation includes the operating system image.

## Download software files from the Azure portal

Download the OT sensor software from Defender for IoT in the Azure portal.

In Defender for IoT on the Azure portal, select **Getting started** > **Sensor**, and then select the software version you want to download.

> [!IMPORTANT]
> If you're updating software from a previous version, use the options from the **Sites and sensors** > **Sensor update** menu. For more information, see [Update Defender for IoT OT monitoring software](../update-ot-software.md).

## Install Defender or IoT software on OT sensors

This procedure describes how to install OT monitoring software on an OT network sensor.

If you're using a [pre-configured appliance](../ot-pre-configured-appliances.md)s, skip directly to [Configure setup via the GUI](#configure-setup-via-the-gui).


**To install your software**:

1. Mount the downloaded ISO file onto your hardware appliance or VM using one of the following options:

    - **Physical media** – burn the ISO file to your external storage, and then boot from the media.

        - DVDs: First burn the software to the DVD as an image
        - USB drive: First make sure that you’ve created a bootable USB drive with software such as [Rufus](https://rufus.ie/en/), and then save the software to the USB drive. USB drives must have USB version 3.0 or later.

        Your physical media must have a minimum of 4-GB storage.

    - **Virtual mount** – use iLO for HPE appliances, or iDRAC for Dell appliances to boot the ISO file.

1. When the installation boots, you're prompted to start the installation process. Select the **Install iot-sensor-<version number>** item to continue. For example:

    :::image type="content" source="../media/install-software-ot-sensor/initial-install-screen.png" alt-text="Screenshot of the initial installation screen.":::

    > [!NOTE]
    > If you're using a legacy BIOS version, you're prompted to select a language and the installation options are presented at the top left instead of in the center. When prompted, select `English` and then the the **Install iot-sensor-<version number> option to continue.

    The installation begins, giving you updated status messages as it goes. The entire installation process takes up to 20-30 minutes.

    When the installation is complete, you're shown a set of default networking details. For example:

    ```bash
    IP: 172.23.41.83,
    SUBNET: 255.255.255.0,
    GATEWAY: 172.23.41.1,
    UID: 91F14D56-C1E4-966F-726F-006A527C61D
    ```

1. Continue with one of the following:

    - [Continue the setup via the GUI](#configure-setup-via-the-gui). To do this, you'll need to connect physical cables from your switch to the sensor to identify your network correctly.
    - [Continue the setup via CLI](#configure-setup-via-the-cli). Do this if you know your networking details without needing to connect physical cables.

Configuring your setup via the CLI requires you to complete the last few steps in the browser.

## Configure and activate your sensor

Use the following tabs to configure and activate your sensor, either using the GUI or the CLI.

- Use the GUI if you can connect physical cables from your switch to the sensor to identify your interfaces correctly.
- Use the CLI if you know your networking details without needing to connect physical cables.

Configuring your setup via the CLI still requires you to complete the last few steps in the browser.


# [Configure setup via the GUI](#tab/ui)

1. In a browser, go to the default IP address provided. For example: `https://172.23.41.83`

    :::image type="content" source="../media/install-software-ot-sensor/ui-sign-in.png" alt-text="Screenshot of the initial sensor sign-in page.":::

1. Enter the following credentials and select **Login**:

    - **Username**: `support`
    - **Password**: `support`

    You're asked to define a new password for the *support* user.

1. In the **New password** field, enter your new password. Your password must contain lowercase and uppercase alphabetic characters, numbers, and symbols.

    In the **Confirm new password** field, enter your new password again, and then select **Get started**.

    For more information, see [Default privileged users](../manage-users-sensor.md#default-privileged-users).

1. The **Defender for IoT | Overview** page opens to the **Management interface**. Use the following fields to define network details for your new sensor.

    |Name  |Description  |
    |---------|---------|
    |**Management interface**     |  Select the interface you want to use as the management interface, to connect to either the Azure portal or an on-premises management console. <br><br>To identify a physical interface on your machine, select an interface and then select **Blink physical interface LED**. The port that matches the selected interface lights up so that you can connect your cable correctly.        |
    |<a name="ip"></a>**IP Address**     |  Enter the IP address you want to use for your sensor. This is the IP address your team will use to connect to the sensor via the browser or CLI. |
    |**Subnet Mask**     | Enter the address you want to use as the sensor's subnet mask.        |
    |**Default Gateway**     | Enter the address you want to use as the sensor's default gateway.        |
    |**DNS**     |   Enter the sensor's DNS server IP address.      |
    |**Hostname**     |  Enter the hostname you want to assign to the sensor. Make sure that you use the same hostname as is defined in the DNS server.       |
    |**Enable proxy for cloud connectivity (Optional)**     | Select to define a proxy server for your sensor.  <br><br>If you use an SSL/TSL certificate to access the proxy server, select **Client certificate** and upload your certificate.      |

    Select **Next: Interface configurations** to continue.

1. The **Interface configurations** tab shows a list of interfaces automatically detected by your sensor. Do the following:

    1. Select the **Enable/Disable** toggle for any interfaces you want the sensor to monitor. You must select at least one interface to continue.

        If you're not sure which interface to use, select the :::image type="icon" source="../media/install-software-ot-sensor/blink-interface.png" border="false"::: **Blink physical interface LED** button to have the selected port blink on your machine. Select any of the interfaces that you've connected to your switch.

    1. (Optional) For each interface you select to monitor, select the :::image type="icon" source="../media/install-software-ot-sensor/advanced-settings-icon.png" border="false"::: **Advanced settings**  button to modify any of the following settings:

        |Name  |Description  |
        |---------|---------|
        |**Mode**     | Select **SPAN Traffic (no encapsulation)** to use the default SPAN port mirroring.  Select **ERSPAN** if you're using ERSPAN mirroring. For more information, see [Choose a traffic mirroring method for OT sensors](../best-practices/traffic-mirroring-methods.md).       |
        |**Description**     |  Enter an optional description for the interface. <!--where would i see this afterwards?-->       |
        |**Auto negotiation**     | Relevant for physical machines only.  <!--what does this do?-->       |

        Select **Save** to save your changes.

1. Select **Next: Reboot >** to continue, and then **Start reboot** to reboot your sensor machine. After the sensor starts again, you're automatically redirected to the IP address you'd [defined earlier as your sensor IP address](#ip).

    Select **Cancel** to wait for the reboot.

1. <a name=cli></a>After the sensor reboots, you're redirected to the same **Defender for IoT | Overview** page, to the **Activation** tab.

    > [!NOTE]
    > If you started configuring your setup via the CLI, you'll finish the configuration in the browser with this step.

    Select **Upload** to upload the sensor's activation file that you'd downloaded from the Azure portal.

    Select the terms and conditions option and then select **Next: Certificates**.

1. Use the **Certificates** tab to deploy an SSL/TLS certificate on your OT sensor. We recommend that you use a [CA-signed certificate](create-ssl-certificates.md) for all production environments.

    1. Select **Import trusted CA certificate (recommended)** to deploy a CA-signed certificate.

        Enter the certificates name and passphrase, and then select **Upload** to upload your private key file, certificate file, and an optional certificate chain file.

        You may need to refresh the page after uploading your files. For more information, see [Troubleshoot certificate upload errors](../how-to-manage-individual-sensors.md#troubleshoot-certificate-upload-errors).

        > [!TIP]
        > If you're working on a testing environment, you can also use the self-signed certificate that's generated locally during installation. For more information, see [Manage SSL/TLS certificates](../how-to-manage-individual-sensors.md#manage-ssltls-certificates).

    1. In the **Enable certificate validation** area, select **Mandatory** to validate the certificate against a certificate revocation list (CRL), as [configured in your certificate](../best-practices/certificate-requirements.md#crt-file-requirements). <!--in the current UI this actually reads Validation of on-premises management console certificate-->

1. Select **Finish** to complete the initial setup and open your sensor console.

# [Configure setup via the CLI](#tab/cli)

Use this procedure to configure your initial sensor setup via the CLI.

1. In the installation screen, after the default networking details are shown, press **ENTER** to continue.

1. At the `D4Iot login` prompt, sign in with the following default credentials:

    - **Username**: `support`
    - **Password**: `support`

    When you enter your password, the password characters don't display on the screen. Make sure you enter them carefully.

1. At the prompt, enter a new password for the *support* user. Your password must contain lowercase and uppercase alphabetic characters, numbers, and symbols.

    When prompted to confirm your password, enter your new password again. For more information, see [Default privileged users](../manage-users-sensor.md#default-privileged-users).

    <does this happen immediately? unclear-->The `Package configuration` Linux configuration wizard opens. In this wizard, use the up or down arrows to navigate, and the **SPACE** bar to select an option. Press **ENTER** to advance to the next screen.

1. In the wizard's `Select monitor interfaces` screen, select any of the interfaces you want to monitor with this sensor.

    <!--this isn't available in the sample machine i used: By default, `eno1` is reserved for the management interface and we recommend that you leave this option unselected.

    For example:

    :::image type="content" source="../media/tutorial-install-components/monitor-interface.png" alt-text="Screenshot of the select monitor interface screen."::: -->

    For example:

    :::image type="content" source="../media/install-software-ot-sensor/select-monitor-interfaces.png" alt-text="Screenshot of the Select monitor interfaces screen.":::

    > [!IMPORTANT]
    > Make sure that you select only interfaces that are connected.
    >
    > If you select interfaces that are enabled but not connected, the sensor will show a *No traffic monitored* health notification in the Azure portal. If you connect more traffic sources after installation and want to monitor them with Defender for IoT, you can add them later via the [CLI](../references-work-with-defender-for-iot-cli-commands.md). <!--can i still not do this after via the UI?-->

<!--
1. In the `Select erspan monitor interfaces` screen, select any ERSPAN monitoring ports that you have. The wizard lists available interfaces, even if you don't have any ERSPAN monitoring ports in your system. If you have no ERSPAN monitoring ports, leave all options unselected. <!--does this page still show? i don't see it

    For example:

    :::image type="content" source="../media/tutorial-install-components/erspan-monitor.png" alt-text="Screenshot of the select erspan monitor screen.":::

-->
1. In the `Select management interface` screen, select the interface you want to use to connect to the Azure portal or an on-premises management console.  <!--is this correct?-->

    <!--not shown in my sample machine: we recommend keeping the default `eno1` value selected as the management interface.-->

    For example:

    :::image type="content" source="../media/install-software-ot-sensor/select-management-interface.png" alt-text="Screenshot of the Select management interface screen.":::

    <!--:::image type="content" source="../media/tutorial-install-components/management-interface.png" alt-text="Screenshot of the management interface select screen.":::-->

1. In the `Enter sensor IP address` screen, enter the IP address you want to use for this sensor. You'll use this IP address to connect to the sensor via CLI or the browser. For example:

    :::image type="content" source="../media/install-software-ot-sensor/enter-sensor-ip-address.png" alt-text="Screenshot of the Enter sensor IP address screen.":::

1. In the `Enter path to the mounted backups folder` screen, enter the path to the sensor's mounted backups. We recommend using the default path of `/opt/sensor/persist/backups`. For example:

    :::image type="content" source="../media/install-software-ot-sensor/mounted-backups.png" alt-text="Screenshot of the mounted backups folder configuration.":::

1. In the `Enter Subnet Mask` screen, enter the IP address for the sensor's subnet mask. For example:

    :::image type="content" source="../media/install-software-ot-sensor/subnet-mask.png" alt-text="Screenshot of the Enter Subnet Mask screen.":::

1. In the `Enter Gateway` screen, enter the sensor's default gateway IP address. For example:

    :::image type="content" source="../media/install-software-ot-sensor/enter-gateway.png" alt-text="Screenshot of the Enter Gateway screen.":::

1. In the `Enter DNS server` screen, enter the sensor's DNS server IP address. For example:

    :::image type="content" source="../media/install-software-ot-sensor/enter-dns-server.png" alt-text="Screenshot of the Enter DNS server screen.":::

1. In the `Enter hostname` screen, enter a name you want to use as the sensor hostname. Make sure that you use the same hostname as is defined in the DNS server.  For example:

    :::image type="content" source="../media/install-software-ot-sensor/enter-hostname.png" alt-text="Screenshot of the Enter hostname screen.":::

1. In the `Run this sensor as a proxy server (Preview)` screen, select `<Yes>` only if you want to configure a proxy, and then enter the proxy credentials as prompted. For more information, see [Configure proxy settings on an OT sensor](../connect-sensors.md).

    The default configuration is without a proxy.

1. The configuration process starts running and then prompts you to sign in again. For example:

    :::image type="content" source="../media/install-software-ot-sensor/final-cli-sign-in.png" alt-text="Screenshot of the final sign-in prompt at the end of the initial CLI configuration.":::

At this point, open a browser to the IP address you'd defined for your sensor and [continue the setup in the browser](#cli).

---

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
