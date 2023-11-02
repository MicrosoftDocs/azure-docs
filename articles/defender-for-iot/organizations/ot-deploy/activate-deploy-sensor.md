---
title: Configure and activate your OT sensor - - Microsoft Defender for IoT
description: Learn how to configure initial setup settings and activate your Microsoft Defender for IoT OT sensor.
ms.date: 07/04/2023
ms.topic: install-set-up-deploy
---

# Configure and activate your OT sensor

This article is one in a series of articles describing the [deployment path](ot-deploy-path.md) for OT monitoring with Microsoft Defender for IoT, and describes how to configure initial setup settings and activate your OT sensor.

:::image type="content" source="../media/deployment-paths/progress-deploy-your-sensors.png" alt-text="Diagram of a progress bar with Deploy your sensors highlighted." border="false" lightbox="../media/deployment-paths/progress-deploy-your-sensors.png":::

Several initial setup steps can be performed in the browser or via CLI.

- Use the browser if you can connect physical cables from your switch to the sensor to identify your interfaces correctly.         Make sure to reconfigure your network adapter to match the default settings on the sensor.
- Use the CLI if you know your networking details without needing to connect physical cables.      Use the CLI if you can only connect to the sensor via iLo / iDrac

Configuring your setup via the CLI still requires you to complete the last few steps in the browser.

## Prerequisites

To perform the procedures in this article, you need:

- An OT sensor [onboarded](../onboard-sensors.md) to Defender for IoT in the Azure portal.

- OT sensor software installed on your appliance. Make sure that you've either [installed](install-software-ot-sensor.md) the software yourself or [purchased](../ot-pre-configured-appliances.md) a preconfigured appliance.

- The sensor's activation file, which was downloaded after [onboarding your sensor](../onboard-sensors.md). You need a unique activation file for each OT sensor you deploy.

    [!INCLUDE [root-of-trust](../includes/root-of-trust.md)]

    > [!NOTE]
    > Activation files expire 14 days after creation. If you onboarded your sensor but didn't upload the activation file before it expired, [download a new  activation file](../how-to-manage-individual-sensors.md#current).

- A SSL/TLS certificate. We recommend using a CA-signed certificate, and not a self-signed certificate. For more information, see [Create SSL/TLS certificates for OT appliances](create-ssl-certificates.md).

- Access to the physical or virtual appliance where you're installing your sensor. For more information, see [Which appliances do I need?](../ot-appliance-sizing.md)

This step is performed by your deployment teams.

## Configure setup via the browser

Configuring sensor setup via the browser includes the following steps:

- Signing into the sensor console and changing the *support* user password
- Defining network details for your sensor
- Defining the interfaces you want to monitor
- Activating your sensor
- Configuring SSL/TLS certificate settings

### Sign in to the sensor console and change the default password

This procedure describes how to sign into the OT sensor console for the first time. You're prompted to change the default password for the *support* user.

**To sign in to your sensor**:

1. In a browser, go the `192.168.0.101` IP address, which is the default IP address provided for your sensor at the end of the installation.

    The initial sign-in page appears. For example:

    :::image type="content" source="../media/install-software-ot-sensor/ui-sign-in.png" alt-text="Screenshot of the initial sensor sign-in page.":::

1. Enter the following credentials and select **Login**:

    - **Username**: `support`
    - **Password**: `support`

    You're asked to define a new password for the *support* user.

1. In the **New password** field, enter your new password. Your password must contain lowercase and uppercase alphabetic characters, numbers, and symbols.

    In the **Confirm new password** field, enter your new password again, and then select **Get started**.

    For more information, see [Default privileged users](../manage-users-sensor.md#default-privileged-users).

The **Defender for IoT | Overview** page opens to the **Management interface** tab.

### Define sensor networking details

In the **Management interface** tab, use the following fields to define network details for your new sensor:

|Name  |Description  |
|---------|---------|
|**Management interface**     |  Select the interface you want to use as the management interface, to connect to either the Azure portal or an on-premises management console.<br><br>To identify a physical interface on your machine, select an interface and then select **Blink physical interface LED**. The port that matches the selected interface lights up so that you can connect your cable correctly.        |
|<a name="ip"></a>**IP Address**     |  Enter the IP address you want to use for your sensor. This is the IP address your team uses to connect to the sensor via the browser or CLI. |
|**Subnet Mask**     | Enter the address you want to use as the sensor's subnet mask.        |
|**Default Gateway**     | Enter the address you want to use as the sensor's default gateway.        |
|**DNS**     |   Enter the sensor's DNS server IP address.      |
|**Hostname**     |  Enter the hostname you want to assign to the sensor. Make sure that you use the same hostname as is defined in the DNS server.       |
|**Enable proxy for cloud connectivity (Optional)**     | Select to define a proxy server for your sensor.  <br><br>If you use an SSL/TSL certificate to access the proxy server, select **Client certificate** and upload your certificate.      |

When you're done, select **Next: Interface configurations** to continue.

### Define the interfaces you want to monitor

The **Interface connections** tab shows all interfaces detected by the sensor by default. Use this tab to turn monitoring on or off per interface, or define specific settings for each interface.

> [!TIP]
> We recommend that you optimize performance on your sensor by configuring your settings to monitor only the interfaces that are actively in use. 
> 

In the **Interface configurations** tab, do the following to configure settings for your monitored interfaces:

1. Select the **Enable/Disable** toggle for any interfaces you want the sensor to monitor. You must select at least one interface to continue.

    If you're not sure about which interface to use, select the :::image type="icon" source="../media/install-software-ot-sensor/blink-interface.png" border="false"::: **Blink physical interface LED** button to have the selected port blink on your machine. Select any of the interfaces that you've connected to your switch.

1. (Optional) For each interface you select to monitor, select the :::image type="icon" source="../media/install-software-ot-sensor/advanced-settings-icon.png" border="false"::: **Advanced settings**  button to modify any of the following settings:

    |Name  |Description  |
    |---------|---------|
    |**Mode**     | Select one of the following: <br>- **SPAN Traffic (no encapsulation)** to use the default SPAN port mirroring.  <br>- **ERSPAN** if you're using ERSPAN mirroring. <br><br>For more information, see [Choose a traffic mirroring method for OT sensors](../best-practices/traffic-mirroring-methods.md).       |
    |**Description**     |  Enter an optional description for the interface. You'll see this later on in the sensor's **System settings > Interface configurations** page, and these descriptions may be helpful in understanding the purpose of each interface.  |
    |**Auto negotiation**     | Relevant for physical machines only. Use this option to determine which sort of communication methods are used, or if the communication methods are automatically defined between components. <br><br>**Important**: We recommend that you change this setting only on the advice of your networking team. |

    Select **Save** to save your changes.

1. Select **Next: Reboot >** to continue, and then **Start reboot** to reboot your sensor machine. After the sensor starts again, you're automatically redirected to the IP address you'd [defined earlier as your sensor IP address](#ip).

    Select **Cancel** to wait for the reboot.

### Activate your OT sensor

This procedure describes how to activate your new OT sensor. 

If you've configured the initial settings [via the CLI](#configure-setup-via-the-cli) until now, you'll start the browser-based configuration at this step. After the sensor reboots, you're redirected to the same **Defender for IoT | Overview** page, to the **Activation** tab.

**To activate your sensor**:

1. In the **Activation** tab, select **Upload** to upload the sensor's activation file that you'd downloaded from the Azure portal.

1. Select the terms and conditions option and then select **Next: Certificates**.

### Define SSL/TLS certificate settings

Use the **Certificates** tab to deploy an SSL/TLS certificate on your OT sensor. We recommend that you use a [CA-signed certificate](create-ssl-certificates.md) for all production environments.


**To define SSL/TLS certificate settings**:

1. In the **Certificates** tab, select **Import trusted CA certificate (recommended)** to deploy a CA-signed certificate.

    Enter the certificate's name and [passphrase](../best-practices/certificate-requirements.md#supported-characters-for-keys-and-passphrases), and then select **Upload** to upload your private key file, certificate file, and an optional certificate chain file.

    You may need to refresh the page after uploading your files. For more information, see [Troubleshoot certificate upload errors](../how-to-manage-individual-sensors.md#troubleshoot-certificate-upload-errors).

    > [!TIP]
    > If you're working on a testing environment, you can also use the self-signed certificate that's generated locally during installation. If you select to use a self-signed certificate, make sure to select the **Confirm** option about the recommendations.
    >
    > For more information, see [Manage SSL/TLS certificates](../how-to-manage-individual-sensors.md#manage-ssltls-certificates).

1. In the **Validation of on-premises management console certificate** area, select **Mandatory** to validate an on-premises management console's certificate against a certificate revocation list (CRL), as [configured in your certificate](../best-practices/certificate-requirements.md#crt-file-requirements). 

    For more information, see [SSL/TLS certificate requirements for on-premises resources](../best-practices/certificate-requirements.md) and [Create SSL/TLS certificates for OT appliances](create-ssl-certificates.md).

1. Select **Finish** to complete the initial setup and open your sensor console.

## Configure setup via the CLI

Use this procedure to configure the following initial setup settings via CLI:

- Signing into the sensor console and setting a new *support* user password
- Defining network details for your sensor
- Defining the interfaces you want to monitor

Continue with [activating](#activate-your-ot-sensor) and [configuring SSL/TLS certificate settings](#define-ssltls-certificate-settings) in the browser.

**To configure initial setup settings via CLI**:

1. In the installation screen, after the default networking details are shown, press **ENTER** to continue.

1. At the `D4Iot login` prompt, sign in with the following default credentials:

    - **Username**: `support`
    - **Password**: `support`

    When you enter your password, the password characters don't display on the screen. Make sure you enter them carefully.

1. At the prompt, enter a new password for the *support* user. Your password must contain lowercase and uppercase alphabetic characters, numbers, and symbols.

    When prompted to confirm your password, enter your new password again. For more information, see [Default privileged users](../manage-users-sensor.md#default-privileged-users).

    <does this happen immediately? unclear-->The `Package configuration` Linux configuration wizard opens. In this wizard, use the up or down arrows to navigate, and the **SPACE** bar to select an option. Press **ENTER** to advance to the next screen.

1. In the wizard's `Select monitor interfaces` screen, select any of the interfaces you want to monitor with this sensor.

    The system selects the first interface it finds as the management interface, and we recommend that you leave the default selection. If you decide to use a different port as the management interface, the change is implemented only after the sensor restarts. In such cases, make sure that the sensor is connected as needed.

    For example:

    :::image type="content" source="../media/install-software-ot-sensor/select-monitor-interfaces.png" alt-text="Screenshot of the Select monitor interfaces screen.":::

    > [!IMPORTANT]
    > Make sure that you select only interfaces that are connected.
    >
    > If you select interfaces that are enabled but not connected, the sensor will show a *No traffic monitored* health notification in the Azure portal. If you connect more traffic sources after installation and want to monitor them with Defender for IoT, you can add them later via the [CLI](../references-work-with-defender-for-iot-cli-commands.md).

1. In the `Select management interface` screen, select the interface you want to use to connect to the Azure portal or an on-premises management console.

    For example:

    :::image type="content" source="../media/install-software-ot-sensor/select-management-interface.png" alt-text="Screenshot of the Select management interface screen.":::

1. In the `Enter sensor IP address` screen, enter the IP address you want to use for this sensor. Use this IP address to connect to the sensor via CLI or the browser. For example:

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

1. The configuration process starts running, reboots, and then prompts you to sign in again. For example:

    :::image type="content" source="../media/install-software-ot-sensor/final-cli-sign-in.png" alt-text="Screenshot of the final sign-in prompt at the end of the initial CLI configuration.":::

At this point, open a browser to the IP address you'd defined for your sensor and continue the setup in the browser. For more information, see [Activate your OT sensor](#activate-your-ot-sensor).

> [!NOTE]
> During initial setup, options for ERSPAN monitoring ports are available only in the browser-based procedure.
>
> If you're defining your network details via CLI and want to set up ERSPAN monitoring ports, do so afterwards via the sensor's **Settings > Interface connections** page. For more information, see [Update a sensor's monitoring interfaces (configure ERSPAN)](../how-to-manage-individual-sensors.md#update-a-sensors-monitoring-interfaces-configure-erspan).
>

## Next steps

> [!div class="step-by-step"]
> [« Validate an OT sensor software installation](post-install-validation-ot-software.md)

> [!div class="step-by-step"]
> [Configure proxy settings on an OT sensor »](../connect-sensors.md)
