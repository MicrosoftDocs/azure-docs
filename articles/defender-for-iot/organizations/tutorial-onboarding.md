---
title: Onboard and activate a virtual OT sensor - Microsoft Defender for IoT.
description: This tutorial describes how to set up a virtual OT network sensor to monitor your OT network traffic.
ms.topic: tutorial
ms.date: 04/18/2023
---

# Tutorial: Onboard and activate a virtual OT sensor

This tutorial describes the basics of setting up a Microsoft Defender for IoT OT sensor, using a trial subscription of Microsoft Defender for IoT and a virtual machine.

For a full, end-to-end deployment, make sure to follow steps to plan and prepare your system, and also fully calibrate and fine-tune your settings. For more information, see [Deploy Defender for IoT for OT monitoring](ot-deploy/ot-deploy-path.md).

> [!NOTE]
> If you're looking to set up security monitoring for enterprise IoT systems, see [Enable Enterprise IoT security in Defender for Endpoint](eiot-defender-for-endpoint.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Download software for a virtual sensor
> * Create a VM for the sensor
> * Install the virtual sensor software
> * Configure a virtual SPAN port
> * Verify your cloud connection
> * Onboard and activate the virtual sensor

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


## Download software for your virtual sensor

Defender for IoT's solution for OT security includes on-premises network sensors, which connect to Defender for IoT and send device data for analysis.

You can either purchase pre-configured appliances or bring your own appliance and install the software yourself. This tutorial uses your own machine and VMware and describes how to download and install the sensor software yourself.

**To download software for your virtual sensors**:

1. Go to Defender for IoT in the Azure portal. On the **Getting started** page, select the **Sensor** tab.

1. In the **Purchase an appliance and install software** box, ensure that the default option is selected for the latest and recommended software version, and then select **Download**.

1. Save the downloaded software in a location that will be accessible from your VM.

[!INCLUDE [root-of-trust](includes/root-of-trust.md)]

## Create a VM for your sensor

This procedure describes how to create a VM for your sensor with VMware ESXi. 

Defender for IoT also supports other processes, such as using Hyper-V or physical sensors. For more information, see [Defender for IoT installation](how-to-install-software.md).

**To create a VM for your sensor**:

1. Make sure that you have the sensor software downloaded and accessible, and that VMware is running on your machine.

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

1. For **CD/DVD Drive 1**, select **Datastore ISO file** and select the Defender for IoT software you'd [downloaded earlier](#download-software-for-your-virtual-sensor).

1. Select **Next** > **Finish**.

1. Power on the VM, and open a console.

## Install sensor software

This procedure describes how to install the sensor software on your VM.

**To install the software on the virtual sensor**:

1. Open the VM console.

1. The VM will start from the ISO image, and the language selection screen will appear. Select **English**.

1. Select the required specifications for your needs, as defined in the [table in the Prerequisites](#hw) section above.

1. Define the appliance profile and network properties as follows:

    | Parameter | Configuration |
    | ----------| ------------- |
    | **Hardware profile** | Depending on your [system specifications](#hw).  |
    | **Management interface** | **ens192** |
    | **Network parameters (provided by the customer)** | **management network IP address:** <br/>**subnet mask:** <br>**appliance hostname:** <br/>**DNS:** <br/>**default gateway:** <br/>**input interfaces:**|

    You don't need to configure the bridge interface, which is relevant for special use cases only.

1. Enter **Y** to accept the settings.

1. The following credentials are automatically generated and presented. Copy the usernames and passwords to a safe place, because they're required to sign-in and manage your sensor. The usernames and passwords won't be presented again.

    - **support**: The administrative user for user management.

    - **cyberx**: The equivalent of root for accessing the appliance.

    For more information, see [Default privileged on-premises users](roles-on-premises.md#default-privileged-on-premises-users).

1. When the appliance restarts, access the sensor via the IP address previously configured: `https://<ip_address>`.

### Post-installation validation

This procedure describes how to validate your installation using the sensor's own system health checks, and is available to both the *support* and *cyberx* sensor users.

**To validate your installation**:

1. Sign in to the sensor.

1. Select **System Settings**> **Sensor management** > **System Health Check**.

1. Select the following commands:

    - **Appliance** to check that the system is running. Verify that each line item shows **Running** and that the last line states that the **System is up**.
    - **Version** to verify that you have the correct version installed.
    - **ifconfig** to verify that all input interfaces configured during installation are running.

## Configure a SPAN port

Virtual switches don't have mirroring capabilities. However, for the sake of this tutorial you can use *promiscuous mode* in a virtual switch environment to view all network traffic that goes through the virtual switch.

This procedure describes how to configure a SPAN port using a workaround with VMware ESXi.


> [!NOTE]
> Promiscuous mode is an operating mode and a security monitoring technique for a VM's interfaces in the same portgroup level as the virtual switch to view the switch's network traffic. Promiscuous mode is disabled by default but can be defined at the virtual switch or portgroup level.
>

**To configure a SPAN port with ESXi**:

1. Open vSwitch properties.

1. Select **Add**.

1. Select **Virtual Machine** > **Next**.

1. Insert a network label **SPAN Network**, select **VLAN ID** > **All**, and then select **Next**.

1. Select **Finish**.

1. Select **SPAN Network** > **Edit*.

1. Select **Security**, and verify that the **Promiscuous Mode** policy is set to **Accept** mode.

1. Select **OK**, and then select **Close** to close the vSwitch properties.

1. Open the **XSense VM** properties.

1. For **Network Adapter 2**, select the **SPAN** network.

1. Select **OK**.

1. Connect to the sensor, and verify that mirroring works.

## Onboard and activate the virtual sensor

Before you can start using your Defender for IoT sensor, you'll need to onboard your new virtual sensor to your Azure subscription, and download the virtual sensor's activation file to activate the sensor.

### Onboard the virtual sensor

**To onboard the virtual sensor:**

1. In the Azure portal, go to the [**Defender for IoT > Getting started**](https://portal.azure.com/#blade/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/Getting_Started) page.

1. At the bottom left, select **Set up OT/ICS Security**.

   :::image type="content" source="media/tutorial-onboarding/onboard-a-sensor.png" alt-text="Screenshot of the Getting started page for OT network sensors.":::

    In the **Set up OT/ICS Security** page, you can leave the **Step 1: Did you set up a sensor?** and **Step 2: Configure SPAN port or TAP** steps collapsed, because you've completed these tasks earlier in this tutorial.

1. In **Step 3: Register this sensor with Microsoft Defender for IoT**, define the following values:

    |Name  |Description  |
    |---------|---------|
    |**Sensor name**     |  Enter a name for the sensor. <br><br>We recommend that you include the IP address of the sensor as part of the name, or use an easily identifiable name. Naming your sensor in this way will ensure easier tracking.       |
    |**Subscription**     |  Select the Azure subscription where you want to add your sensors.      |
    |**Cloud connected**     |  Select to connect your sensor to Azure.      |
    |**Automatic threat intelligence updates**     |   Displayed only when the **Cloud connected** option is toggled on.  Select to have Microsoft threat intelligence packages automatically updated on your sensor.  For more information, see [Threat intelligence research and packages #](how-to-work-with-threat-intelligence-packages.md).   |
    |**Sensor version**     | Displayed only when the **Cloud connected** option is toggled on. Select the software version installed on your sensor.        |
    |**Site**     | Define the site where you want to associate your sensor, or select **Create site** to create a new site. Define a display name for your site and optional tags to help identify the site later.       |
    |**Zone**     |  Define the zone where you want to deploy your sensor, or select **Create zone** to create a new one.       |

    For more information, see [Plan OT sites and zones](best-practices/plan-corporate-monitoring.md#plan-ot-sites-and-zones).

1. Select **Register** to add your sensor to Defender for IoT. A success message is displayed and your activation file is automatically downloaded. The activation file is unique for your sensor and contains instructions about your sensor's management mode.

    [!INCLUDE [root-of-trust](includes/root-of-trust.md)]

1. Save the downloaded activation file in a location that will be accessible to the user signing into the console for the first time.

    You can also download the file manually by selecting the relevant link in the **Activate your sensor** box. You'll use this file to activate your sensor, as described [below](#activate-your-sensor).

1. Make sure that your new sensor will be able to successfully connect to Azure. In the **Add outbound allow rules** box, select the **Download endpoint details** link to download a JSON list of the endpoints you must configure as secure endpoints from your sensor.  For example:

    :::image type="content" source="media/release-notes/download-endpoints.png" alt-text="Screenshot of the **Add outbound allow rules** box.":::

    To ensure that your sensor can connect to Azure, configure the listed endpoints as allowed outbound HTTPS traffic over port 443. You'll need to configure these outbound allow rules once for all OT sensors onboarded to the same subscription

    > [!TIP]
    > You can also access the list of required endpoints from the **Sites and sensors** page. For more information, see [Sensor management options from the Azure portal](how-to-manage-sensors-on-the-cloud.md#sensor-management-options-from-the-azure-portal).

1. At the bottom left of the page, select **Finish**. You can now see your new sensor listed on the Defender for IoT **Sites and sensors** page.

For more information, see [Manage sensors with Defender for IoT in the Azure portal](how-to-manage-sensors-on-the-cloud.md).

### Activate your sensor

This procedure describes how to use the sensor activation file downloaded from Defender for IoT in the Azure portal to activate your newly added sensor.

**To activate your sensor**:

1. Go to the sensor console from your browser by using the IP defined during the installation. The sign-in dialog box opens.

    :::image type="content" source="media/how-to-activate-and-set-up-your-sensor/sensor-log-in-1.png" alt-text="Screenshot of a Defender for IoT sensor sign-in page.":::

1. Enter the credentials defined during the sensor installation.

1. Select **Login/Next**.  The **Sensor Network Settings** tab opens.

      :::image type="content" source="media/how-to-activate-and-set-up-your-sensor/sensor-log-in-wizard-activate.png" alt-text="Screenshot of the sensor network settings options when signing into the sensor.":::

1. In the **Sensor Network Settings** tab, you can modify the sensor network configuration defined during installation. For the sake of this tutorial, leave the default values as they are, and select **Next**.

1. In the **Activation** tab, select **Upload**, and then browse to and select your activation file.

1. Approve the terms and conditions and then select **Activate**.

1. In the **SSL/TLS Certificates** tab, you can import a trusted CA certificate, which is the recommended process for production environments. However, for the sake of the tutorial, you can select **Use Locally generated self-signed certificate**, and then select **Finish**.

Your sensor is activated and onboarded to Defender for IoT. In the **Sites and sensors** page, you can see that the **Sensor status** column shows a green check mark, and lists the status as **OK**.

## Next steps

> [!div class="step-by-step"]
> [Full deployment path for OT monitoring](ot-deploy/ot-deploy-path.md)
