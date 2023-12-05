---
title: Onboard and activate a virtual OT sensor - Microsoft Defender for IoT.
description: This tutorial describes how to set up a virtual OT network sensor to monitor your OT network traffic.
ms.topic: tutorial
ms.date: 07/04/2023
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

Before you can start using your Defender for IoT sensor, you need to onboard your new virtual sensor to your Azure subscription.

**To onboard the virtual sensor:**

1. In the Azure portal, go to the [**Defender for IoT > Getting started**](https://portal.azure.com/#blade/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/Getting_Started) page.

1. At the bottom left, select **Set up OT/ICS Security**.

    Alternately, from the Defender for IoT **Sites and sensors** page, select **Onboard OT sensor** > **OT**.

    By default, on the **Set up OT/ICS Security** page, **Step 1: Did you set up a sensor?** and **Step 2: Configure SPAN port or TAP​** of the wizard are collapsed.

    You'll install software and configure traffic mirroring later on in the deployment process, but should have your appliances ready and traffic mirroring method planned.

1. In **Step 3: Register this sensor with Microsoft Defender for IoT**, define the following values:

    |Field name |Description  |
    |---------|---------|
    |**Resource name**     |  Select the site you want to attach your sensors to, or select **Create site** to create a new site.  <br><br>If you're creating a new site: <br>1. In the **New site** field, enter your site's name and select the checkmark button. <br>2.  From the **Site size** menu, select your site's size. The sizes listed in this menu are the sizes that you're licensed for, based on the licenses [you'd purchased](how-to-manage-subscriptions.md) in the Microsoft 365 admin center.     |
    |**Display name**     |    Enter a meaningful name for your site to be shown across Defender for IoT.   |
    |**Tags**     |   Enter tag key and values to help you identify and locate your site and sensor in the Azure portal.      |
    |**Zone**     | Select the zone you want to use for your OT sensor, or select **Create zone** to create a new one.        |

    For more information, see [Plan OT sites and zones](best-practices/plan-corporate-monitoring.md#plan-ot-sites-and-zones).

1. When you're done with all other fields, select **Register** to add your sensor to Defender for IoT. A success message is displayed and your activation file is automatically downloaded. The activation file is unique for your sensor and contains instructions about your sensor's management mode.

    [!INCLUDE [root-of-trust](includes/root-of-trust.md)]

1. <a name="activation"></a>Save the downloaded activation file in a location that will be accessible to the user signing into the console for the first time so they can activate the sensor.

    You can also download the file manually by selecting the relevant link in the **Activate your sensor** box. You'll use this file to activate your sensor, as described [below](#activate-your-ot-sensor).

1. In the **Add outbound allow rules** box, select the **Download endpoint details** link to download a JSON list of the endpoints you must configure as secure endpoints from your sensor.

    Save the downloaded file locally. Use the endpoints listed in the downloaded file to [later in this tutorial](#provision-for-cloud-management) to ensure that your new sensor can successfully connect to Azure.

    > [!TIP]
    > You can also access the list of required endpoints from the **Sites and sensors** page. For more information, see [Sensor management options from the Azure portal](how-to-manage-sensors-on-the-cloud.md#sensor-management-options-from-the-azure-portal).
 
1. At the bottom left of the page, select **Finish**. You can now see your new sensor listed on the Defender for IoT **Sites and sensors** page.

    Until you activate your sensor, the sensor's status shows as **Pending Activation**.

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

1. Highlight the vSwitch you've created, and select **Add uplink**.

1. Select the physical NIC you'll use for the SPAN traffic, change the MTU to **4096**, then select **Save**.

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

1. Save the downloaded software in a location that's accessible from your VM.

[!INCLUDE [root-of-trust](includes/root-of-trust.md)]

## Install sensor software

This procedure describes how to install the sensor software on your VM.

> [!NOTE]
> Towards the end of this process you will be presented with the usernames and passwords for your device. Make sure to copy these down as these passwords will not be presented again.

**To install the software on the virtual sensor**:

1. If you closed your VM, sign into the ESXi again and open your VM settings.

1. For **CD/DVD Drive 1**, select **Datastore ISO file** and select the Defender for IoT software you'd [downloaded earlier](#download-software-for-your-virtual-sensor).

1. Select **Next** > **Finish**.

1. Power on the VM, and open a console.

1. When the installation boots, you're prompted to start the installation process. Select the **Install iot-sensor-`<version number>`** item to continue or let it start automatically after 30 seconds. For example:

    :::image type="content" source="media/install-software-ot-sensor/initial-install-screen.png" alt-text="Screenshot of the initial installation screen.":::

    > [!NOTE]
    > If you're using a legacy BIOS version, you're prompted to select a language and the installation options are presented at the top left instead of in the center. When prompted, select `English` and then the  **Install iot-sensor-`<version number>`** option to continue.

    The installation begins, giving you updated status messages as it goes. The entire installation process takes up to 20-30 minutes, and may vary depending on the type of media you're using.

    When the installation is complete, you're shown the following set of default networking details.

    ```bash
    IP: 172.23.41.83,
    SUBNET: 255.255.255.0,
    GATEWAY: 172.23.41.1,
    UID: 91F14D56-C1E4-966F-726F-006A527C61D
    ```

Use the default IP address provided to access your sensor for [initial setup and activation](ot-deploy/activate-deploy-sensor.md).

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

## Define initial setup

The following procedure describes how to configure your sensor's initial setup settings, including:

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

    :::image type="content" source="media/install-software-ot-sensor/ui-sign-in.png" alt-text="Screenshot of the initial sensor sign-in page.":::

1. Enter the following credentials and select **Login**:

    - **Username**: `support`
    - **Password**: `support`

    You're asked to define a new password for the *support* user.

1. In the **New password** field, enter your new password. Your password must contain lowercase and uppercase alphabetic characters, numbers, and symbols.

    In the **Confirm new password** field, enter your new password again, and then select **Get started**.

    For more information, see [Default privileged users](manage-users-sensor.md#default-privileged-users).

The **Defender for IoT | Overview** page opens to the **Management interface** tab.

### Define sensor networking details

In the **Management interface** tab, use the following fields to define network details for your new sensor:

|Name  |Description  |
|---------|---------|
|**Management interface**     |  Select the interface you want to use as the management interface and connect to the Azure portal. <br><br>To identify a physical interface on your machine, select an interface and then select **Blink physical interface LED**. The port that matches the selected interface lights up so that you can connect your cable correctly.        |
|<a name="ip"></a>**IP Address**     |  Enter the IP address you want to use for your sensor. This is the IP address your team will use to connect to the sensor via the browser or CLI. |
|**Subnet Mask**     | Enter the address you want to use as the sensor's subnet mask.        |
|**Default Gateway**     | Enter the address you want to use as the sensor's default gateway.        |
|**DNS**     |   Enter the sensor's DNS server IP address.      |
|**Hostname**     |  Enter the hostname you want to assign to the sensor. Make sure that you use the same hostname as is defined in the DNS server.       |

For the sake of this tutorial, leave the skip the proxy configurations in the **Enable proxy for cloud connectivity (Optional)** area.

When you're done, select **Next: Interface configurations** to continue.

### Define the interfaces you want to monitor

The **Interface connections** tab shows all interfaces detected by the sensor by default. Use this tab to turn monitoring on or off per interface, or define specific settings for each interface.

> [!TIP]
> We recommend that you optimize performance on your sensor by configuring your settings to monitor only the interfaces that are actively in use.
>

In the **Interface configurations** tab, do the following to configure settings for your monitored interfaces:

1. Select the **Enable/Disable** toggle for any interfaces you want the sensor to monitor. You must select at least one interface to continue.

    If you're not sure about which interface to use, select the :::image type="icon" source="media/install-software-ot-sensor/blink-interface.png" border="false"::: **Blink physical interface LED** button to have the selected port blink on your machine. Select any of the interfaces that you've connected to your switch.

1. For the sake of this tutorial, skip any advanced settings and select **Next: Reboot >** to continue.

1. When prompted, select **Start reboot** to reboot your sensor machine. After the sensor starts again, you're automatically redirected to the IP address you'd [defined earlier as your sensor IP address](#ip).

    Select **Cancel** to wait for the reboot.

### Activate your OT sensor

This procedure describes how to activate your new OT sensor.

**To activate your sensor**:

1. In the **Activation** tab, select **Upload** to upload the sensor's activation file that you'd [downloaded from the Azure portal](#activation).

1. Select the terms and conditions option and then select **Next: Certificates**.

### Define SSL/TLS certificate settings

Use the **Certificates** tab to deploy an SSL/TLS certificate on your OT sensor. While we recommend that you use a [CA-signed certificate](ot-deploy/create-ssl-certificates.md) for all production environments, for the sake of this tutorial, select to use a self-signed certificate. 

**To define SSL/TLS certificate settings**:

1. In the **Certificates** tab, select **Use Locally generated self-signed certificate (Not recommended)**, and then select the **Confirm** option.

    For more information, see [SSL/TLS certificate requirements for on-premises resources](best-practices/certificate-requirements.md) and [Create SSL/TLS certificates for OT appliances](ot-deploy/create-ssl-certificates.md).

1. Select **Finish** to complete the initial setup and open your sensor console.


## Next steps

> [!div class="step-by-step"]
> [Full deployment path for OT monitoring](ot-deploy/ot-deploy-path.md)
