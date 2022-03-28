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
> * Onboard with Microsoft Defender for IoT
> * Download the ISO for the virtual sensor
> * Create a VM for the sensor
> * Install the virtual sensor software
> * Configure a SPAN port
> * Onboard, and activate the virtual sensor

## Prerequisites

Before you start, make sure that you have the following:

- Completed [Quickstart: Get started with Defender for IoT](getting-started.md) so that you have an Azure subscription added to Defender for IoT.

- Azure permissions of **Security admin**, **Subscription contributor**, or **Subscription owner** on your subscription

- At least one device to monitor, with the device connected to a SPAN port on a switch.

- Either VMWare, ESXi 5.5 or later, or Hyper-V hypervisor, Windows 10 Pro or Enterprise, installed and operational.

- Available hardware resources for your VM. For more information, see [virtual sensor system requirements](how-to-identify-required-appliances.md#virtual-sensors).

- The following network parameters to use for your sensor appliance:

    - A management network IP address
    - A sensor subnet mask
    - An appliance hostname
    - A DNS address
    - A default gateway
    - Any input interfaces

## Download software for your virtual sensor

Defender for IoT's solution for OT security includes on-premises network sensors, which connect to Defender for IoT and send device data for analysis.

You can either purchase pre-configured appliances or bring your own appliance and install the software yourself. This procedure uses your own machine, with either VMWare or Hyper-V hypervisor, and describes how to download and install the sensor software yourself.

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

1. Add a sensor name and choose:

   - Compatibility: **&lt;latest ESXi version&gt;**

   - Guest OS family: **Linux**

   - Guest OS version: **Ubuntu Linux (64-bit)**

1. Select **Next**.

1. Choose the relevant datastore and select **Next**.

1. Change the virtual hardware parameters according to the required specifications for your needs. For more information, see [virtual sensor system requirements](how-to-identify-required-appliances.md#virtual-sensors).

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

1. Enter the required size. For more information, see [virtual sensor system requirements](how-to-identify-required-appliances.md#virtual-sensors).

1. Review the summary and select **Finish**.

1. On the **Actions** menu, create a new VM.

1. Enter a name for the VM.

1. Select **Specify Generation** > **Generation 1**.

1. Specify the memory allocation and select the check box for dynamic memory. For more information, see [virtual sensor system requirements](how-to-identify-required-appliances.md#virtual-sensors).

1. Configure the network adaptor according to your server network topology.

1. Connect the VHDX created previously to the VM.

1. Review the summary and select **Finish**.

1. Right-click the new VM and select **Settings**.

1. Select **Add Hardware** and add a new network adapter.

1. Select the virtual switch that will connect to the sensor management network.

1. Allocate CPU resources. For more information, see [virtual sensor system requirements](how-to-identify-required-appliances.md#virtual-sensors).

1. Start the VM.

1. On the **Actions** menu, select **Connect** to continue the software installation.

---

## Install sensor software

This procedure describes how to install the sensor software on your VM, whether you've used ESXi or Hyper-V to [create a VM](#create-a-vm-for-your-sensor).

**To install the software on the virtual sensor**:

1. Open the VM console.

1. The VM will start from the ISO image, and the language selection screen will appear. Select **English**.

1. Select the required specifications for your needs. For more information, see [virtual sensor system requirements](how-to-identify-required-appliances.md#virtual-sensors).

1. Define the appliance profile and network properties as follows:

    | Parameter | Configuration |
    | ----------| ------------- |
    | **Hardware profile** | Depending on your [system specifications](how-to-identify-required-appliances.md#virtual-sensors).  |
    | **Management interface** | **ens192** |
    | **Network parameters (provided by the customer)** | **management network IP address:** <br/>**subnet mask:** <br>**appliance hostname:** <br/>**DNS:** <br/>**default gateway:** <br/>**input interfaces:**|

    You don't need to configure the bridge interface, which is relevant for special use cases only.

1. Enter **Y** to accept the settings.

1. The following credentials are automatically generated and presented. Copy the usernames and passwords to a safe place, because they're required to sign-in and manage your sensor. The usernames and passwords will not be presented again.

    - **Support**: The administrative user for user management.

    - **CyberX**: The equivalent of root for accessing the appliance.

1. When the appliance restarts, access the sensor via the IP address previously configured: `https://<ip_address>`.

### Post-installation validation

To validate the installation of a physical appliance, you need to perform many tests.

The validation is available to both the **Support**, and **CyberX** user.

**To access the post validation tool**:

1. Sign in to the sensor.

1. Select **System Settings**> **Health and troubleshooting** > **System Health Check**.

1. Select a command.

For post-installation validation, test that:

- the system is running
- you have the right version
- all of the input interfaces that were configured during the installation process are running

**To verify that the system is running**:

1. Select **Appliance**, and ensure that each line item shows `Running` and the bottom line states `System is up`.

1. Select **Version**, and ensure that the correct version appears.

1. Select **ifconfig** to display the parameters for the appliance's physical interfaces, and ensure that they are correct.

## Configure a SPAN port

A virtual switch does not have mirroring capabilities. However, you can use promiscuous mode in a virtual switch environment. Promiscuous mode  is a mode of operation, as well as a security, monitoring and administration technique, that is defined at the virtual switch, or portgroup level. By default, Promiscuous mode is disabled. When Promiscuous mode is enabled the VM’s network interfaces that are in the same portgroup will use the Promiscuous mode to view all network traffic that goes through that virtual switch. You can implement a workaround with either ESXi, or Hyper-V.

:::image type="content" source="media/tutorial-onboarding/purdue-model.png" alt-text="A screenshot of where in your architecture the sensor should be placed.":::

Select one of the following tabs to configure a SPAN port for your sensor.

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

### Attach a SPAN Virtual Interface to the virtual switch

You are able to attach a SPAN Virtual Interface to the Virtual Switch through Windows PowerShell, or through Hyper-V Manager.

**To attach a SPAN Virtual Interface to the virtual switch with PowerShell**:

1. Select the newly added SPAN virtual switch, and add a new network adapter with the following command:

    ```bash
    ADD-VMNetworkAdapter -VMName VK-C1000V-LongRunning-650 -Name Monitor -SwitchName vSwitch_Span
    ```

1. Enable port mirroring for the selected interface as the span destination with the following command:

    ```bash
    Get-VMNetworkAdapter -VMName VK-C1000V-LongRunning-650 | ? Name -eq Monitor | Set-VMNetworkAdapter -PortMirroring Destination
    ```

    | Parameter | Description |
    |--|--|
    | VK-C1000V-LongRunning-650 | CPPM VA name |
    |vSwitch_Span |Newly added SPAN virtual switch name |
    |Monitor |Newly added adapter name |

1. Select **OK**.

These commands set the name of the newly added adapter hardware to be `Monitor`. If you are using Hyper-V Manager, the name of the newly added adapter hardware is set to `Network Adapter`.

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

#### Set the Mirroring Mode on the external port

Mirroring mode will need to be set on the external port of the new virtual switch to be the source.

You will need to configure the Hyper-V virtual switch (vSwitch_Span) to forward any traffic that comes to the external source port, to the virtual network adapter that you configured as the destination.

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
## Onboard, and activate the virtual sensor

Before you can start using your Defender for IoT sensor, you will need to onboard the created virtual sensor to your Azure subscription, and download the virtual sensor's activation file to activate the sensor.

### Onboard the virtual sensor

**To onboard the virtual sensor:**

1. Go to [Defender for IoT: Getting started](https://portal.azure.com/#blade/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/Getting_Started) in the Azure portal.

1. Select **Onboard sensor**.

   :::image type="content" source="media/tutorial-onboarding/onboard-a-sensor.png" alt-text="Screenshot of selecting to onboard the sensor to start the onboarding process for your sensor.":::

1. Enter a name for the sensor.

   We recommend that you include the IP address of the sensor as part of the name, or use an easily identifiable name. Naming your sensor in this way will ensure easier tracking.

1. Select a subscription from the drop-down menu.

    :::image type="content" source="media/tutorial-onboarding/name-subscription.png" alt-text="Screenshot of entering a meaningful name, and connect your sensor to a subscription.":::

1. Choose a sensor connection mode by using the **Cloud connected** toggle. If the toggle is on, the sensor is cloud connected. If the toggle is off, the sensor is locally managed.

   - **Cloud-connected sensors**: Information that the sensor detects is displayed in the sensor console. Alert information is delivered to Defender for Cloud on Azure and can be shared with other Azure services, such as Microsoft Sentinel. In addition, threat intelligence packages can be pushed from Defender for IoT to sensors. Conversely when, the sensor is not cloud connected, you must download threat intelligence packages and then upload them to your enterprise sensors. To allow Defender for IoT to push packages to sensors, enable the **Automatic Threat Intelligence Updates** toggle. For more information, see [Threat intelligence research and packages](how-to-work-with-threat-intelligence-packages.md).

        For cloud connected sensors, the name defined during onboarding is the name that appears in the sensor console. You can't change this name from the console directly. For locally managed sensors, the name applied during onboarding will be stored in Azure but can be updated in the sensor console.

        For more information, see [Sensor connection methods](architecture-connections.md) and [Connect your sensors to Microsoft Defender for IoT](connect-sensors.md).

   - **Locally managed sensors**: Information that sensors detect is displayed in the sensor console. If you're working in an air-gapped network and want a unified view of all information detected by multiple locally managed sensors, work with the on-premises management console.

1. Select a site to associate your sensor to. Define the display name, and zone. You can also add descriptive tags. The display name, zone, and tags are descriptive entries on the [View onboarded sensors](how-to-manage-sensors-on-the-cloud.md#manage-on-boarded-sensors).

1. Select **Register**.

### Download the sensor activation file

Once registration is complete for the sensor, you will be able to download an activation file for the sensor. The sensor activation file contains instructions about the management mode of the sensor. The activation file you download, will be unique for each sensor that you deploy. The user who signs in to the sensor console for the first time, will uploads the activation file to the sensor.

**To download an activation file:**

1. On the **Onboard Sensor** page, select **Register**

1. Select **download activation file**.

1. Make the file accessible to the user who's signing in to the sensor console for the first time.

### Sign in and activate the sensor

**To sign in and activate:**

1. Go to the sensor console from your browser by using the IP defined during the installation.

    :::image type="content" source="media/tutorial-onboarding/defender-for-iot-sensor-log-in-screen.png" alt-text="Screenshot of the Microsoft Defender for IoT sensor.":::

1. Enter the credentials defined during the sensor installation.

1. Select **Log in** and follow the instructions described in [Activate and set up your sensor](how-to-activate-and-set-up-your-sensor.md#activate-and-set-up-your-sensor).

## Connect sensors to Defender for IoT

This section is required only when you are using a Defender for IoT sensor version 22.1.x or higher.

Connect your sensors to Defender for IoT to ensure that sensors send alert and device inventory information to Defender for IoT on the Azure portal.

For more information, see [Sensor connection methods](architecture-connections.md) and [Connect your sensors to Microsoft Defender for IoT](connect-sensors.md).

## Next steps

For more information, see:

- [Defender for IoT installation](how-to-install-software.md)
- [Microsoft Defender for IoT system architecture](architecture.md)
