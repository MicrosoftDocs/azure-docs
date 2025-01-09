---
title: Configure and activate your OT sensor - - Microsoft Defender for IoT
description: Learn how to configure initial setup settings and activate your Microsoft Defender for IoT OT sensor.
ms.date: 12/19/2023
ms.topic: install-set-up-deploy
---

# Configure and activate your OT sensor

This article is one in a series of articles describing the [deployment path](ot-deploy-path.md) for OT monitoring with Microsoft Defender for IoT, and describes how to configure initial setup settings and activate your OT sensor.

:::image type="content" source="../media/deployment-paths/progress-deploy-your-sensors.png" alt-text="Diagram of a progress bar with Deploy your sensors highlighted." border="false" lightbox="../media/deployment-paths/progress-deploy-your-sensors.png":::

Several initial setup steps can be performed in the browser or via CLI.

- Use the browser if you can connect physical cables from your switch to the sensor to identify your interfaces correctly. Make sure to reconfigure your network adapter to match the default settings on the sensor.
- Use the CLI if you know your networking details without needing to connect physical cables. Use the CLI if you can only connect to the sensor via iLo / iDrac

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

- Signing into the sensor console and changing the *admin* user password
- Defining network details for your sensor
- Defining the interfaces you want to monitor
- Activating your sensor
- Configuring SSL/TLS certificate settings

### Sign in to the sensor console and change the default password

This procedure describes how to sign into the OT sensor console for the first time. You're prompted to change the default password for the *admin* user.

**To sign in to your sensor**:

1. In a browser, go the `192.168.0.101` IP address, which is the default IP address provided for your sensor at the end of the installation.

    The initial sign-in page appears. For example:

    :::image type="content" source="../media/install-software-ot-sensor/ui-sign-in.png" alt-text="Screenshot of the initial sensor sign-in page.":::

1. Enter the following credentials and select **Login**:

    - **Username**: `admin`
    - **Password**: `admin`

    You're asked to define a new password for the *admin* user.

1. In the **New password** field, enter your new password. Your password must contain lowercase and uppercase alphabetic characters, numbers, and symbols.

    In the **Confirm new password** field, enter your new password again, and then select **Get started**.

    For more information, see [Default privileged users](../manage-users-sensor.md#default-privileged-users).

The **Defender for IoT | Overview** page opens to the **Management interface** tab.

### Define sensor networking details

In the **Management interface** tab, use the following fields to define network details for your new sensor:

|Name  |Description  |
|---------|---------|
|**Management interface**     |  Select the interface you want to use as the management interface, to connect to the Azure portal.<br><br>To identify a physical interface on your machine, select an interface and then select **Blink physical interface LED**. The port that matches the selected interface lights up so that you can connect your cable correctly.        |
|<a name="ip"></a>**IP Address**     |  Enter the IP address you want to use for your sensor. This is the IP address your team uses to connect to the sensor via the browser or CLI. |
|**Subnet Mask**     | Enter the address you want to use as the sensor's subnet mask.        |
|**Default Gateway**     | Enter the address you want to use as the sensor's default gateway.        |
|**DNS**     |   Enter the sensor's DNS server IP address.      |
|**Hostname**     |  Enter the hostname you want to assign to the sensor. Make sure that you use the same hostname as is defined in the DNS server.       |
|**Enable proxy for cloud connectivity (Optional)**     | Select to define a proxy server for your sensor.  <br><br>If you use an SSL/TSL certificate to access the proxy server, select **Client certificate** and upload your certificate.      |

When you're done, select **Next: Interface configurations** to continue.

### Define the interfaces you want to monitor

The **Interface configurations** tab shows all interfaces detected by the sensor by default. Use this tab to turn monitoring on or off per interface, or define specific settings for each interface.

> [!TIP]
> We recommend that you optimize performance on your sensor by configuring your settings to monitor only the interfaces that are actively in use.

In the **Interface configurations** tab, do the following to configure settings for your monitored interfaces:

1. Select the **Enable/Disable** toggle for any interfaces you want the sensor to monitor. You must select at least one interface to continue.

    If you're not sure about which interface to use, select the :::image type="icon" source="../media/install-software-ot-sensor/blink-interface.png" border="false"::: **Blink physical interface LED** button to have the selected port blink on your machine. Select any of the interfaces that you've connected to your switch.

1. (Optional) For each interface you select to monitor, select the :::image type="icon" source="../media/install-software-ot-sensor/advanced-settings-icon.png" border="false"::: **Advanced settings**  button to modify any of the following settings:

    |Name  |Description  |
    |---------|---------|
    |**Mode**     | Select one of the following: <br>- **SPAN Traffic (no encapsulation)** to use the default SPAN port mirroring.  <br>- **ERSPAN** if you're using ERSPAN mirroring. <br><br>For more information, see [Choose a traffic mirroring method for OT sensors](../best-practices/traffic-mirroring-methods.md).       |
    |**Description**     |  Enter an optional description for the interface. You'll see this later on in the sensor's **System settings > Interface configurations** page, and these descriptions may be helpful in understanding the purpose of each interface.  |
    |**Auto negotiation**     | Relevant for physical machines only. Use this option to determine which sort of communication methods are used, or if the communication methods are automatically defined between components. <br><br>**Important**: We recommend that you change this setting only on the advice of your networking team. |

    **To add ERSPAN tunneling to your interface:**

    1. In the **Mode** option, select **Tunneling** from the drop-down list.

    1. To configure the tunnel, update the following OT sensor details:

        - **Description** (optional).
        - **Interface IP**.
        - **Subnet**.

    For example:

    :::image type="content" source="media/activate-deploy-sensor/erspan-adv-settings-tunneling.png" alt-text="Screenshot of how to configure ERSPAN settings in the OT sensor settings.":::

1. Select **Save** to save your changes.

1. Select **Next: Reboot >** to continue, and then **Start reboot** to reboot your sensor machine. After the sensor starts again, you're automatically redirected to the IP address you'd [defined earlier as your sensor IP address](#ip).

    Select **Cancel** to wait for the reboot.

### Activate your OT sensor

This procedure describes how to activate your new OT sensor.

If you've configured the initial settings [via the CLI](#configure-setup-via-the-cli) until now, you'll start the browser-based configuration at this step. After the sensor reboots, you're redirected to the same **Defender for IoT | Overview** page, to the **Activation** tab.

**To activate your sensor**:

1. In the **Activation** tab, select **Upload** to upload the sensor's activation file that you downloaded from the Azure portal.
1. Select the terms and conditions option and then select **Activate**.
1. Select **Next: Certificates**.

If you have a connection problem between the cloud-based sensor and the Azure portal during the activation process that causes the activation to fail, a message appears below the Activate button. To solve the connectivity problem select **Learn more** and the **Cloud connectivity** pane opens. The pane lists the causes for the problem and recommendations to solve it.

Even without solving the problem you're able to continue to the next stage, by selecting **Next: Certificates**.

The only connection problem that must be fixed before moving to the next stage, is when a time drift is detected and the sensor isn't synchronized to the cloud. In this case the sensor must be correctly synchronized, as described in the recommendations, before moving to the next stage.

### Define SSL/TLS certificate settings

Use the **Certificates** tab to deploy an SSL/TLS certificate on your OT sensor. We recommend that you use a [CA-signed certificate](create-ssl-certificates.md) for all production environments.

**To define SSL/TLS certificate settings**:

1. In the **Certificates** tab, select **Import trusted CA certificate (recommended)** to deploy a CA-signed certificate.

    Enter the certificate's name and [passphrase](../best-practices/certificate-requirements.md#supported-characters-for-keys-and-passphrases), and then select **Upload** to upload your private key file, certificate file, and an optional certificate chain file.

    You may need to refresh the page after uploading your files. For more information, see [Troubleshoot certificate upload errors](../how-to-manage-individual-sensors.md#troubleshoot-certificate-upload-errors).

    For more information, see [SSL/TLS certificate requirements for on-premises resources](../best-practices/certificate-requirements.md) and [Create SSL/TLS certificates for OT appliances](create-ssl-certificates.md).

    > [!TIP]
    > If you're working on a testing environment, you can also use the self-signed certificate that's generated locally during installation. If you select to use a self-signed certificate, make sure to select the **Confirm** option about the recommendations.
    >
    > For more information, see [Manage SSL/TLS certificates](../how-to-manage-individual-sensors.md#manage-ssltls-certificates).

1. Select **Finish** to complete the initial setup and open your sensor console.

## Configure setup via the CLI

Use this procedure to configure the following initial setup settings via CLI:

- Signing into the sensor console and setting a new *admin* user password
- Defining network details for your sensor
- Defining the interfaces you want to monitor

Continue with [activating](#activate-your-ot-sensor) and [configuring SSL/TLS certificate settings](#define-ssltls-certificate-settings) in the browser.

> [!NOTE]
> The information in this article applies to the sensor version 24.1.5. If you are running an earlier version, see [configure ERSPAN mirroring](../traffic-mirroring/configure-mirror-erspan.md).
>

**To configure initial setup settings via CLI**:

1. In the installation screen, after the default networking details are shown, press **ENTER** to continue.

1. At the `D4Iot login` prompt, sign in with the following default credentials:

    - **Username**: `admin`
    - **Password**: `admin`

    When you enter your password, the password characters don't display on the screen. Make sure you enter them carefully.

1. At the prompt, enter a new password for the *admin* user. Your password must contain lowercase and uppercase alphabetic characters, numbers, and symbols.

    When prompted to confirm your password, enter your new password again. For more information, see [Default privileged users](../manage-users-sensor.md#default-privileged-users).

1. After changing the password, the `Sensor Config` wizard automatically starts. Continue to step 5.

    If you're logging in on subsequent occasions continue to step 4.

1. To start the `Sensor Config` wizard, at the prompt type `network reconfigure`. If you are using the cyberx user, type `ERSPAN=1 python3 -m cyberx.config.configure`.

1. The `Sensor Config` screen shows the present setup of the interfaces. Ensure that one interface is set as the management interface. In this wizard, use the up or down arrows to navigate, and the **SPACE** bar to select an option. Press **ENTER** to advance to the next screen.

    Select the interface you want to configure, for example:

    :::image type="content" source="media/activate-deploy-sensor/ersp-cli-settings.png" alt-text="Screenshot of the Select monitor interfaces screen.":::

1. In the `Select type` screen select the new configuration type for this interface.

> [!IMPORTANT]
> Make sure that you select only interfaces that are connected.
>
> If you select interfaces that are enabled but not connected, the sensor will show a *No traffic monitored* health notification in the Azure portal. If you connect more traffic sources after installation and want to monitor them with Defender for IoT, you can add them later via the [CLI](../references-work-with-defender-for-iot-cli-commands.md).
>

An interface can be set as either **Management**, **Monitor**, **Tunnel** or **Unused**. You may wish to set an interface as **Unused** as a temporary setting, to reset it, or if a mistake was made in the original setup.

1. To configure a **Management** interface:

    1. Select the interface.
    1. Select **Management**.
    1. Type the sensor's **IP address**, **DNS server** IP address and the default **Gateway** IP address.

        :::image type="content" source="media/activate-deploy-sensor/ersp-cli-management-settings.png" alt-text="Screenshot of the interface Management screen.":::

    1. Select **Back**.

1. To configure a **Monitor** interface:

    1. Select the interface.
    1. Select **Monitor**. The **Sensor Config** screen updates.

1. To configure an ERSPAN **Tunnel** interface:

    1. Select Interface IP and add the **IP** and **Subnet** details.
    1. Select **Confirm**.
    1. Select **Tunnels** and add a **Name**, **Source IP** and an **ID** numbered between 1 and 1023.

        :::image type="content" source="media/activate-deploy-sensor/ersp-cli-interface-tunnel.png" alt-text="Screenshot of the interface Tunnels screen.":::

    1. Select **Confirm**.

1. To configure an interface as **Unused**:

    1. Select the interface.
    1. Select the existing status.
    1. Select **Unused**. The **Sensor Config** screen updates.

1. After configuring all of the interfaces, select **Save**.

### Automatic backup folder location

The sensor automatically creates a backup folder. To change the location of the mounted backups you must:

1. Log in to the sensor using the **admin** user.
1. Type the following code in the CLI interface: `system backup path` and then add the path location, for example `/opt/sensor/backup`.
1. The backup runs automatically and might take up to one minute.

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
