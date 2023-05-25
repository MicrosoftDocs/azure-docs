---
title: Onboard and activate a virtual OT sensor - Microsoft Defender for IoT.
description: This tutorial describes how to set up a virtual OT network sensor to monitor your OT network traffic.
ms.topic: tutorial
ms.date: 05/23/2023
---

# Tutorial: Onboard and activate a virtual OT sensor

This tutorial describes the basics of setting up a Microsoft Defender for IoT OT sensor, using a trial subscription of Microsoft Defender for IoT and your own virtual machine.

For a full, end-to-end deployment, make sure to follow steps to plan and prepare your system, and also fully calibrate and fine-tune your settings. For more information, see [Deploy Defender for IoT for OT monitoring](ot-deploy/ot-deploy-path.md).

> [!NOTE]
> If you're looking to set up security monitoring for enterprise IoT systems, see [Enable Enterprise IoT security in Defender for Endpoint](eiot-defender-for-endpoint.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a VM for the sensor
> * Onboard a virtual sensor
> * Configure a virtual SPAN port
> * Provision for cloud management
> * Download software for a virtual sensor
> * Install the virtual sensor software
> * Activate the virtual sensor

## Prerequisites

Before you start, make sure that you have the following:

- Completed [Quickstart: Get started with Defender for IoT](getting-started.md) so that you have an Azure subscription added to Defender for IoT.

- Access to the Azure portal as a [Security Admin](../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../role-based-access-control/built-in-roles.md#contributor), or [Owner](../../role-based-access-control/built-in-roles.md#owner). For more information, see [Azure user roles for OT and Enterprise IoT monitoring with Defender for IoT](roles-azure.md).

- Make sure that you have a network switch that supports traffic monitoring via a SPAN port. You'll also need at least one device to monitor, connected to the switch's SPAN port.

- VMware, ESXi 5.5 or later, installed and operational on your sensor.

- <a name="hw"></a>Available hardware resources for your VM as follows:

    | Deployment type | Corporate | Enterprise | SMB |
    |--|--|--|--|
    | **Maximum bandwidth** | 2.5 Gb/sec | 800 Mb/sec | 160 Mb/sec |
    | **Maximum protected devices** | 12,000 | 10,000 | 800 |

- An understanding of [OT monitoring with virtual appliances](ot-virtual-appliances.md).

- Details for the following network parameters to use for your sensor appliance:

    - A management network IP address
    - A sensor subnet mask
    - An appliance hostname
    - A DNS address
    - A default gateway
    - Any input interfaces

## Create a VM for your sensor

This procedure describes how to create a VM for your sensor with VMware ESXi.

Defender for IoT also supports other processes, such as using Hyper-V or physical sensors. For more information, see [Defender for IoT installation](how-to-install-software.md).

**To create a VM for your sensor**:

1. Make sure that VMware is running on your machine.

1. Sign in to the ESXi, choose the relevant **datastore**, and select **Datastore Browser**.

1. **Upload** the image and select **Close**.

1. Go to **Virtual Machines**, and then select **Create/Register VM**.

1. Select **Create new virtual machine**, and then select **Next**.

1. Add a sensor name and then define the following options:

   - Compatibility: **&lt;latest ESXi version&gt;**

   - Guest OS family: **Linux**

   - Guest OS version: **Ubuntu Linux (64-bit)**

1. Select **Next**.

1. Choose the relevant datastore and select **Next**.

1. Change the virtual hardware parameters according to the required specifications for your needs. For more information, see the [table in the Prerequisites](#hw) section above.

Your VM is now prepared for your Defender for IoT software installation. You'll continue by installing the software later on in this tutorial, after you've onboarded your sensor in the Azure portal, configured traffic mirroring, and provisioned the machine for cloud management.

## Onboard the virtual sensor

Before you can start using your Defender for IoT sensor, you'll need to onboard your new virtual sensor to your Azure subscription.

**To onboard the virtual sensor:**

1. In the Azure portal, go to the [**Defender for IoT > Getting started**](https://portal.azure.com/#blade/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/Getting_Started) page.

1. At the bottom left, select **Set up OT/ICS Security**.

    Alternately, from the Defender for IoT **Sites and sensors** page, select **Onboard OT sensor** > **OT**.

    By default, on the **Set up OT/ICS Security** page, **Step 1: Did you set up a sensor?** and **Step 2: Configure SPAN port or TAP​** of the wizard are collapsed.

    You'll install software and configure traffic mirroring later on in the deployment process, but should have your appliances ready and traffic mirroring method planned.

1. In **Step 3: Register this sensor with Microsoft Defender for IoT**, define the following values:

    |Name  |Description  |
    |---------|---------|
    |**Sensor name**     |  Enter a name for the sensor. <br><br>We recommend that you include the IP address of the sensor as part of the name, or use an easily identifiable name. Naming your sensor in this way will ensure easier tracking.       |
    |**Subscription**     |  Select the Azure subscription where you want to add your sensor.      |
    |**Cloud connected**     |  Toggle on to view detected data and manage your sensor from the Azure portal, and to connect your data to other Microsoft services, such as Microsoft Sentinel.      |
    |**Automatic threat intelligence updates**     |   Displayed only when the **Cloud connected** option is toggled on.  Select this option to have Defender for IoT automatically push threat intelligence packages to your OT sensor.  For more information, see [Threat intelligence research and packages #](how-to-work-with-threat-intelligence-packages.md).   |
    |**Sensor version**     | Displayed only when the **Cloud connected** option is toggled on. Select the software version installed on your sensor. Verify that version **22.X and above** is selected.       |
    |**Site**     | In the **Resource name** field, select the site you want to use for your OT sensor, or select **Create site** to create a new site.<br> In the **Display name** field, enter a meaningful name for your site to be shown across Defender for IoT in Azure.<br>In the **Tags** > **Key** and **Value** fields, enter tag values to help you identify and locate your site and sensor in the Azure portal (optional).    |
    |**Zone**     |  Select the zone you want to use for your OT sensor, or select **Create zone** to create a new one.       |

    For more information, see [Plan OT sites and zones](best-practices/plan-corporate-monitoring.md#plan-ot-sites-and-zones).

1. When you're done with all other fields, select **Register** to add your sensor to Defender for IoT. A success message is displayed and your activation file is automatically downloaded. The activation file is unique for your sensor and contains instructions about your sensor's management mode.

    [!INCLUDE [root-of-trust](includes/root-of-trust.md)]

1. Save the downloaded activation file in a location that will be accessible to the user signing into the console for the first time so they can activate the sensor.

    You can also download the file manually by selecting the relevant link in the **Activate your sensor** box. You'll use this file to activate your sensor, as described [below](#activate-your-sensor).

1. In the **Add outbound allow rules** box, select the **Download endpoint details** link to download a JSON list of the endpoints you must configure as secure endpoints from your sensor.

    Save the downloaded file locally. You'll use the endpoints listed in the downloaded file to [later in this tutorial](#provision-for-cloud-management) to ensure that your new sensor can successfully connect to Azure.

    > [!TIP]
    > You can also access the list of required endpoints from the **Sites and sensors** page. For more information, see [Sensor management options from the Azure portal](how-to-manage-sensors-on-the-cloud.md#sensor-management-options-from-the-azure-portal).
 
1. At the bottom left of the page, select **Finish**. You can now see your new sensor listed on the Defender for IoT **Sites and sensors** page.

    Until you activate your sensor, the sensor's status will show as **Pending Activation**.

For more information, see [Manage sensors with Defender for IoT in the Azure portal](how-to-manage-sensors-on-the-cloud.md).

## Configure a SPAN port

Virtual switches don't have mirroring capabilities. However, for the sake of this tutorial you can use *promiscuous mode* in a virtual switch environment to view all network traffic that goes through the virtual switch.

This procedure describes how to configure a SPAN port using a workaround with VMware ESXi.

> [!NOTE]
> Promiscuous mode is an operating mode and a security monitoring technique for a VM's interfaces in the same portgroup level as the virtual switch to view the switch's network traffic. Promiscuous mode is disabled by default but can be defined at the virtual switch or portgroup level.
>

**To configure a monitoring interface with Promiscuous mode on an ESXi v-Switch**:

1. Open the vSwitch properties page and select **Add standard virtual switch**.

1. Enter **SPAN Network** as the network label.

1. In the MTU field, enter **4096**.

1. Select **Security**, and verify that the **Promiscuous Mode** policy is set to **Accept** mode.

1. Select **Add** to close the vSwitch properties.

1. Highlight the vSwitch you have just created, and select **Add uplink**.

1. Select the physical NIC you will use for the SPAN traffic, change the MTU to **4096**, then select **Save**.

1. Open the **Port Group** properties page and select **Add Port Group**.

1.  Enter **SPAN Port Group** as the name, enter **4095** as the VLAN ID, and select **SPAN Network** in the vSwitch drop down, then select **Add**.

1. Open the **OT Sensor VM** properties.

1. For **Network Adapter 2**, select the **SPAN** network.

1. Select **OK**.

1. Connect to the sensor, and verify that mirroring works.

[!INCLUDE [validate-traffic-mirroring](includes/validate-traffic-mirroring.md)]

## Provision for cloud management

This section describes how to configure endpoints to define in firewall rules, ensuring that your OT sensors can connect to Azure.

For more information, see [Methods for connecting sensors to Azure](architecture-connections.md).

**To configure endpoint details**:

Open the file you'd downloaded earlier to view the list of required endpoints. Configure your firewall rules so that your sensor can access each of the required endpoints, over port 443.

> [!TIP]
> You can also download the list of required endpoints from the **Sites and sensors** page in the Azure portal. Go to **Sites and sensors** > **More actions** > **Download endpoint details**. For more information, see [Sensor management options from the Azure portal](how-to-manage-sensors-on-the-cloud.md#sensor-management-options-from-the-azure-portal).

For more information, see [Provision sensors for cloud management](ot-deploy/provision-cloud-management.md).

## Download software for your virtual sensor

This section describes how to download and install the sensor software on your own machine. 

**To download software for your virtual sensors**:

1. In the Azure portal, go to the [**Defender for IoT > Getting started**](https://portal.azure.com/#blade/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/Getting_Started) page, and select the **Sensor** tab.

1. In the **Purchase an appliance and install software** box, ensure that the default option is selected for the latest and recommended software version, and then select **Download**.

1. Save the downloaded software in a location that will be accessible from your VM.

[!INCLUDE [root-of-trust](includes/root-of-trust.md)]

## Install sensor software

This procedure describes how to install the sensor software on your VM.

> [!NOTE]
> Towards the end of this process you will be presented with the usernames and passwords for your device. Make sure to copy these down as these passwords will not be presented again.

**To install the software on the virtual sensor**:

1. If you had closed your VM, sign into the ESXi again and open your VM settings.

1. For **CD/DVD Drive 1**, select **Datastore ISO file** and select the Defender for IoT software you'd [downloaded earlier](#download-software-for-your-virtual-sensor).

1. Select **Next** > **Finish**.

1. Power on the VM, and open a console.

1. When the installation boots, you're first prompted to select the hardware profile you want to use.

    For more information, see [Which appliances do I need?](ot-appliance-sizing.md).

    After you've selected the hardware profile, the following steps occur, and can take a few minutes:

    - System files are installed
    - The sensor appliance reboots
    - Sensor files are installed

    When the installation steps are complete, the Ubuntu **Package configuration** screen is displayed, with the `Configuring iot-sensor` wizard, showing a prompt to  select your monitor interfaces.

    In the `Configuring iot-sensor` wizard, use the up or down arrows to navigate, and the SPACE bar to select an option. Press ENTER to advance to the next screen.

1. In the wizard's `Select monitor interfaces` screen, select the interfaces you want to monitor.

    By default, `eno1` is reserved for the management interface and we recommend that you leave this option unselected.

    > [!IMPORTANT]
    > Make sure that you select only interfaces that are connected.
    >
    > If you select interfaces that are enabled but not connected, the sensor will show a *No traffic monitored* health notification in the Azure portal. If you connect more traffic sources after installation and want to monitor them with Defender for IoT, you can add them via the [CLI](../references-work-with-defender-for-iot-cli-commands.md).

1. In the `Select erspan monitor interfaces` screen, select any ERSPAN monitoring ports that you have. The wizard lists available interfaces, even if you don't have any ERSPAN monitoring ports in your system. If you have no ERSPAN monitoring ports, leave all options unselected.

1. In the `Select management interface` screen, we recommend keeping the default `eno1` value selected as the management interface.

1. In the `Enter sensor IP address` screen, enter the IP address for the sensor appliance you're installing.

1. In the `Enter path to the mounted backups folder` screen, enter the path to the sensor's mounted backups. We recommend using the default path of `/opt/sensor/persist/backups`.

1. In the `Enter Subnet Mask` screen, enter the IP address for the sensor's subnet mask.

1. In the `Enter Gateway` screen, enter the sensor's default gateway IP address.

1. In the `Enter DNS server` screen, enter the sensor's DNS server IP address.

1. In the `Enter hostname` screen, enter the sensor hostname.

1. In the `Run this sensor as a proxy server (Preview)` screen, select `<Yes>` only if you want to configure a proxy, and then enter the proxy credentials as prompted.

    The default configuration is without a proxy.

    For more information, see [Configure proxy settings on an OT sensor](connect-sensors.md).

1. <a name="credentials"></a>The installation process starts running and then shows the credentials screen.

    Save the usernames and passwords listed, as the passwords are unique and this is the only time that the credentials are shown. Copy the credentials to a safe place so that you can use them when signing into the sensor for the first time.

    For more information, see [Default privileged on-premises users](roles-on-premises.md#default-privileged-on-premises-users).

    Select `<Ok>` when you're ready to continue.

    The installation continues running again, and then reboots when the installation is complete. Upon reboot, you're prompted to enter credentials to sign in.

1. Enter the credentials for the `support` user with the credentials that you'd copied down in the [previous step](#credentials).

    - If the `iot-sensor login:` prompt disappears, press **ENTER** to have it shown again.
    - When you enter your password, the password characters don't display on the screen. Make sure you enter them carefully.

    When you have successfully signed in, the following confirmation screen appears:

    :::image type="content" source="media/tutorial-install-components/install-complete.png" alt-text="Screenshot of install confirmation.":::

### Post-installation validation

This procedure describes how to validate your installation using the sensor's own system health checks, and is available to both the *support* and *cyberx* sensor users.

**To validate your installation**:

1. Sign in to the OT sensor as the `support` user.

1. Select **System Settings** > **Sensor management** > **System Health Check**.

1. Select the following commands:

    - **Appliance** to check that the system is running. Verify that each line item shows **Running** and that the last line states that the **System is up**.
    - **Version** to verify that you have the correct version installed.
    - **ifconfig** to verify that all input interfaces configured during installation are running.

For more post-installation validation tests, such as gateway, DNS or firewall checks, see [Validate an OT sensor software installation](ot-deploy/post-install-validation-ot-software.md).

## Activate your sensor

This procedure describes how to use the sensor activation file downloaded from Defender for IoT in the Azure portal to activate your newly added sensor.

**To activate your sensor**:

1. In a browser, go to the sensor console by entering the IP defined during the installation. The sign-in dialog box opens.

1. Enter the credentials for the `support` user with the credentials defined during the sensor installation.

1. Select **Login**. The **Sensor Network Settings** tab opens.

1. In the **Sensor Network Settings** tab, you can modify the sensor network configuration defined during installation. For the sake of this tutorial, leave the default values as they are, and select **Next**.

1. In the **Activation** tab, select **Upload** to upload the activation file you'd downloaded when [onboarding the virtual sensor](#onboard-the-virtual-sensor).

    Make sure that the confirmation message includes the name of the sensor that you're deploying.

1. Select the **Approve these terms and conditions** option, and then select **Activate** to continue in the **Certificates** screen.

1. In the **SSL/TLS Certificates** tab, you can import a trusted CA certificate, which is the recommended process for production environments. However, for the sake of the tutorial, you can select **Use Locally generated self-signed certificate**, and then select **Save**.

Your sensor is activated and onboarded to Defender for IoT. In the **Sites and sensors** page, you can see that the **Sensor status** column shows a green check mark, and lists the status as **OK**.

## Next steps

> [!div class="step-by-step"]
> [Full deployment path for OT monitoring](ot-deploy/ot-deploy-path.md)
