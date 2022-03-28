---
title: Get started with Microsoft Defender for IoT for OT security
description: This tutorial describes how to use Microsoft Defender for IoT to set up a network for OT system security.
ms.topic: tutorial
ms.date: 03/24/2022
---

# Tutorial: Get started with Microsoft Defender for IoT for OT security

This tutorial describes how to set up your network for OT system security monitoring, using a virtual sensor, on a virtual machine (VM), using a trial subscription of Microsoft Defender  IoT.

> [!NOTE]
> If you're looking to set up security monitoring for enterprise IoT systems, see [Tutorial: Get started with Enterprise IoT](tutorial-getting-started-eiot-sensor.md) instead.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Download software for a virtual sensor
> * Create a VM for the sensor
> * Install the virtual sensor software
> * Configure a SPAN port
> * Onboard, and activate the virtual sensor

## Prerequisites

Before you start, make sure that you have the following:

- Completed [Quickstart: Get started with Defender for IoT](getting-started.md) so that you have an Azure subscription added to Defender for IoT.

- Azure permissions of **Security admin**, **Subscription contributor**, or **Subscription owner** on your subscription

- At least one device to monitor, with the device connected to a SPAN port on a switch.

- One of the following, installed and operational:

    - VMWare, ESXi 5.5 or later
    - Hyper-V hypervisor, Windows 10 Pro or Enterprise

- <a name="hw"></a>Available hardware resources for your VM as follows:

    | Deployment type | Corporate | Enterprise | SMB |
    |--|--|--|--|
    | **Maximum bandwidth** | 2.5 Gb/sec | 800 Mb/sec | 160 Mb/sec |
    | **Maximum protected devices** | 12,000 | 10,000 | 800 |

- Details for the following network parameters to use for your sensor appliance:

    - A management network IP address
    - A sensor subnet mask
    - An appliance hostname
    - A DNS address
    - A default gateway
    - Any input interfaces


## Download software for your virtual sensor

Defender for IoT's solution for OT security includes on-premises network sensors, which connect to Defender for IoT and send device data for analysis.

You can either purchase pre-configured appliances or bring your own appliance and install the software yourself. This tutorial uses your own machine, with either VMWare or Hyper-V hypervisor, and describes how to download and install the sensor software yourself.

**To download software for your virtual sensors**:

1. Go to Defender for IoT in the Azure portal. On the **Getting started** page, select the **Sensor** tab.

1. In the **Purchase an appliance and install software** box, ensure that the default option is selected for the latest and recommended software version, and then select **Download**.

1. Save the downloaded software in a location that will be accessible from your VM.

## Create a VM for your sensor

Select one of the following tabs to create a VM for your sensor.

# [VMWare ESXi](#tab/vmware)

**To create a VM for your sensor with VMWare ESXi**:

1. Make sure that you have the sensor software downloaded and accessible, and that VMWare is running on your machine.

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

# [Hyper-V hypervisor](#tab/hyper-v)

**To create VM for your sensor with Hyper-V hypervisor**:

1. Make sure that you have the sensor software downloaded and accessible, and that hypervisor is running on your machine.

1. Create a virtual disk in Hyper-V Manager.

1. Select **format = VHDX**.

1. Select **type = Dynamic Expanding**.

1. Enter the name and location for the VHD.

1. Enter the required size, as defined in the [table in the Prerequisites](#hw) section above.

1. Review the summary and select **Finish**.

1. On the **Actions** menu, create a new VM.

1. Enter a name for the VM.

1. Select **Specify Generation** > **Generation 1**.

1. Specify the memory allocation and select the check box for dynamic memory, as defined in the [table in the Prerequisites](#hw) section above.

1. Configure the network adaptor according to your server network topology.

1. Connect the VHDX created previously to the VM.

1. Review the summary and select **Finish**.

1. Right-click the new VM and select **Settings**.

1. Select **Add Hardware** and add a new network adapter.

1. Select the virtual switch that will connect to the sensor management network.

1. Allocate CPU resources, as defined in the [table in the Prerequisites](#hw) section above.

1. Start the VM.

1. On the **Actions** menu, select **Connect** to continue the software installation.

---

## Install sensor software

This procedure describes how to install the sensor software on your VM, whether you've used ESXi or Hyper-V to [create a VM](#create-a-vm-for-your-sensor).

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

1. The following credentials are automatically generated and presented. Copy the usernames and passwords to a safe place, because they're required to sign-in and manage your sensor. The usernames and passwords will not be presented again.

    - **Support**: The administrative user for user management.

    - **CyberX**: The equivalent of root for accessing the appliance.

1. When the appliance restarts, access the sensor via the IP address previously configured: `https://<ip_address>`.

### Post-installation validation

This procedure describes how to validate your installation using the sensor's own system health checks, and is available to both the **Support** and **CyberX** sensor users.

**To validate your installation**:

1. Sign in to the sensor.

1. Select **System Settings**> **Sensor management** > **System Health Check**.

1. Select the following commands:

    - **Appliance** to check that the system is running. Verify that each line item shows **Running** and that the last line states that the **System is up**.
    - **Version** to verify that you have the correct version installed.
    - **ifconfig** to verify that all input interfaces configured during installation are running.

## Configure a SPAN port

Virtual switches do not have mirroring capabilities. However, for the sake of this tutorial you can use *promiscuous mode* in a virtual switch environment to view all network traffic that goes through the virtual switch.


> [!NOTE]
> Promiscuous mode is an operating mode and a security monitoring technique for a VM's interfaces in the same portgroup level as the virtual switch to view the switch's network traffic. Promiscuous mode is disabled by default but can be defined at the virtual switch or portgroup level.
>

Select one of the following tabs to implement your SPAN port configuration workaround.

# [VMWare ESXi](#tab/vmware)

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

# [Hyper-V hypervisor](#tab/hyper-v)

**Prerequisites**:

- Ensure that there is no instance of a virtual appliance running.

- Enable Ensure SPAN on the data port, and not the management port.

- Ensure that the data port SPAN configuration is not configured with an IP address.

**To configure a SPAN port with Hyper-V**:

1. Open the Virtual Switch Manager.

1. In the Virtual Switches list, select **New virtual network switch** > **External** as the dedicated spanned network adapter type.

    :::image type="content" source="media/tutorial-onboarding/new-virtual-network.png" alt-text="Screenshot of selecting new virtual network and external before creating the virtual switch.":::

1. Select **Create Virtual Switch**.

1. Under connection type, select **External Network**.

1. Ensure the checkbox for **Allow management operating system to share this network adapter** is checked.

   :::image type="content" source="media/tutorial-onboarding/external-network.png" alt-text="Select external network, and allow the management operating system to share the network adapter.":::

1. Select **OK**.

---
### Attach a SPAN virtual interface to the virtual switch

Use PowerShell or Hyper-V Manager to attach a SPAN virtual interface to the virtual switch.

**To attach a SPAN Virtual Interface to the virtual switch with PowerShell**:

The examples in this procedure use the following parameter definitions. Replace their values with the correct values for your system.

- **CPPM VA name** = `VK-C1000V-LongRunning-650`
- **Name of the newly added SPAN virtual switch** = `vSwitch_Span`
- **Name of the newly added adapter** = `Monitor`. If you are using Hyper-V Manager, use `Network Adapter` instead.

1. Select the newly added SPAN virtual switch, and add a new network adapter. For example, run:

    ```bash
    ADD-VMNetworkAdapter -VMName VK-C1000V-LongRunning-650 -Name Monitor -SwitchName vSwitch_Span
    ```

1. Enable port mirroring for the selected interface as the span destination. For example, run:

    ```bash
    Get-VMNetworkAdapter -VMName VK-C1000V-LongRunning-650 | ? Name -eq Monitor | Set-VMNetworkAdapter -PortMirroring Destination
    ```

1. Select **OK**.


**To attach a SPAN Virtual Interface to the virtual switch with Hyper-V Manager**:

1. Under the Hardware list, select **Network Adapter**.

1. In the Virtual Switch field, select **vSwitch_Span**.

    :::image type="content" source="media/tutorial-onboarding/vswitch-span.png" alt-text="Screenshot of selecting the following options on the virtual switch screen.":::

1. In the Hardware list, under the Network Adapter drop-down list, select **Advanced Features**.

1. In the Port Mirroring section, select **Destination** as the mirroring mode for the new virtual interface.

    :::image type="content" source="media/tutorial-onboarding/destination.png" alt-text="Screenshot of the selections needed to configure mirroring mode.":::

1. Select **OK**.

#### Enable Microsoft NDIS Capture Extensions for the Virtual Switch

Microsoft NDIS Capture Extensions will need to be enabled for the new virtual switch.

**To enable Microsoft NDIS Capture Extensions for the newly added virtual switch**:

1. Open the Virtual Switch Manager on the Hyper-V host.

1. In the Virtual Switches list, expand the virtual switch name `vSwitch_Span` and select **Extensions**.

1. In the Switch Extensions field, select **Microsoft NDIS Capture**.

    :::image type="content" source="media/tutorial-onboarding/microsoft-ndis.png" alt-text="Screenshot of enabling the Microsoft NDIS by selecting it from the switch extensions menu.":::

1. Select **OK**.

#### Define the mirroring mode on the external port

You'll need to define the mirroring mode on the external port of the new virtual switch to be the source.

To do this, configure the Hyper-V virtual switch, for example named **vSwitch_Span** to forward any traffic that comes to the external source port, to the virtual network adapter that you configured as the destination.

Use the following PowerShell commands to set the external virtual switch port to source mirror mode:

```bash
$ExtPortFeature=Get-VMSystemSwitchExtensionPortFeature -FeatureName "Ethernet Switch Port Security Settings"
$ExtPortFeature.SettingData.MonitorMode=2
Add-VMSwitchExtensionPortFeature -ExternalPort -SwitchName vSwitch_Span -VMSwitchExtensionFeature $ExtPortFeature
```

| Parameter | Description |
|--|--|
| vSwitch_Span | Newly added SPAN virtual switch name. |
| MonitorMode=2 | Source |
| MonitorMode=1 | Destination |
| MonitorMode=0 | None |

Use the following PowerShell command to verify the monitoring mode status:

```bash
Get-VMSwitchExtensionPortFeature -FeatureName "Ethernet Switch Port Security Settings" -SwitchName vSwitch_Span -ExternalPort | select -ExpandProperty SettingData
```

| Parameter | Description |
|--|--|
| vSwitch_Span | Newly added SPAN virtual switch name |

---
## Onboard and activate the virtual sensor

Before you can start using your Defender for IoT sensor, you will need to onboard the created virtual sensor to your Azure subscription, and download the virtual sensor's activation file to activate the sensor.

### Onboard the virtual sensor

**To onboard the virtual sensor:**

1. In the Azure portal, go to the [**Defender for IoT > Getting started**](https://portal.azure.com/#blade/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/Getting_Started) page.

1. At the bottom left, select **Set up OT/ICS Security**.

   :::image type="content" source="media/tutorial-onboarding/onboard-a-sensor.png" alt-text="Screenshot of selecting to onboard the sensor to start the onboarding process for your sensor.":::

    In the **Set up OT/ICS Security** page, you can leave the **Step 1: Did you set up a sensor?** and **Step 2: Configure SPAN port or TAP** steps collapsed, because you've completed these tasks earlier in this tutorial.

1. In **Step 3: Register this sensor with Microsoft Defender for IoT**, define the following values:

    |Name  |Description  |
    |---------|---------|
    |**Sensor name**     |  Enter a name for the sensor. <br><br>We recommend that you include the IP address of the sensor as part of the name, or use an easily identifiable name. Naming your sensor in this way will ensure easier tracking.       |
    |**Subscription**     |  Select the Azure subscription where you want to add your sensors.      |
    |**Cloud connected**     |  Select to connect your sensor to Azure. Leave this option toggled off to use an on-premises management console. For more information, see [Cloud connected vs local sensors](#cloud-connected-vs-local-sensors) and [Manage sensors from the management console](how-to-manage-sensors-from-the-on-premises-management-console.md).       |
    |**Automatic threat intelligence updates**     |   Displayed only when the **Cloud connected** option is toggled on.  Select to have Microsoft threat intelligence packages automatically updated on your sensor.  For more information, see [Threat intelligence research and packages #](how-to-work-with-threat-intelligence-packages.md).   |
    |**Sensor version**     | Displayed only when the **Cloud connected** option is toggled on. Select the software version installed on your sensor.        |
    |**Site**     | Define the site where you want to associate your sensor, or select **Create site** to create a new site. Define a display name for your site and optional tags to help identify the site later.       |
    |**Zone**     |  Define the zone where you want to deploy your sensor, or select **Create zone** to create a new one.       |

1. Select **Register** to add your sensor to Defender for IoT. A success message is displayed and your activation file is automatically downloaded. The activation file is unique for your sensor and contains instructions about your sensor's management mode.

1. Save the downloaded activation file in a location that will be accessible to the user signing into the console for the first time.

1. At the bottom left of the page, select **Finish**. You can now see your new sensor listed on the Defender for IoT **Sites and sensors** page.

For more information, see [Manage sensors with Defender for IoT in the Azure portal](how-to-manage-sensors-on-the-cloud.md).

### Activate your sensor

This procedure describes how to use the sensor activation file downloaded from Defender for IoT in the Azure portal to activate your newly added sensor.

**To activate your sensor**:

1. Go to the sensor console from your browser by using the IP defined during the installation. The sign-in dialog box opens.

    :::image type="content" source="media/how-to-activate-and-set-up-your-sensor/sensor-log-in-1.png" alt-text="Screenshot of a Defender for IoT sensor sign in page.":::

1. Enter the credentials defined during the sensor installation.

1. Select **Login/Next**.  The **Sensor Network Settings** tab opens.

      :::image type="content" source="media/how-to-activate-and-set-up-your-sensor/sensor-log-in-wizard-activate.png" alt-text="Screenshot of the sensor network settings options when signing into the sensor.":::

1. In the **Sensor Network Settings** tab, you can modify the sensor network configuration defined during installation. For the sake of this tutorial, leave the default values as they are, and select **Next**.

1. In the **Activation** tab, select **Upload**, and then browse to and select your activation file.

1. Approve the terms and conditions and then select **Activate**.

1. In the **SSL/TLS Certificates** tab, you can import a trusted CA certificate, which is the recommended process for production environments. However, for the sake of the tutorial, you can select **Use Locally generated self-signed certificate**, and then select **Finish**.

Your sensor is activated and onboarded to Defender for IoT. In the **Sites and sensors** page, you can see that the **Sensor status** column shows a green check mark, and lists the status as **OK**.

### Cloud-connected vs local sensors

Cloud-connected sensors are sensors that are connected to Defender for IoT in Azure, and differ from locally managed sensors as follows:

When you have a cloud connected sensor:

- All data that the sensor detects is displayed in the sensor console, but alert information is also delivered to Azure, where it can be analyzed and shared with other Azure services.

- Microsoft threat intelligence packages can also be automatically pushed to cloud-connected sensors.

- The sensor name defined during onboarding is the name displayed in the sensor, and is read-only from the sensor console.

In contrast, when working with locally managed sensors:

- View any data for a specific sensor from the sensor console. For a unified view of all information detected by several sensors, use an on-premises management console. For more information, see [Manage sensors from the management console](how-to-manage-sensors-from-the-on-premises-management-console.md).

- You must manually upload any threat intelligence packages

- Sensor names can be updated in the sensor console.

## Connect sensors to Defender for IoT

Starting with sensor software versions 22.1.x, use one of the following methods to ensure secure connections between your sensors and Defender for IoT:

- Connect via an Azure proxy
- Connect via proxy chaining
- Connect directly
- Connect using multiple cloud vendors

For more information, see [Sensor connection methods](architecture-connections.md) and [Connect your sensors to Microsoft Defender for IoT](connect-sensors.md).

## Next steps

For more information, see:

- [Defender for IoT installation](how-to-install-software.md)
- [Microsoft Defender for IoT system architecture](architecture.md)
