---
title: Defender for IoT installation
description: Learn how to install a sensor and the on-premises management console for Microsoft Defender for IoT.
ms.date: 01/06/2022
ms.topic: how-to
---

# Defender for IoT installation

This article describes how to install the following Microsoft Defender for IoT components:

- **Sensor**: Defender for IoT sensors collects ICS network traffic by using passive (agentless) monitoring. Passive and nonintrusive, the sensors have zero impact on OT and IoT networks and devices. The sensor connects to a SPAN port or network TAP and immediately begins monitoring your network. Detections appear in the sensor console. There, you can view, investigate, and analyze them in a network map, device inventory, and an extensive range of reports. Examples include risk assessment reports, data mining queries, and attack vectors.

- **On-premises management console**: The on-premises management console lets you carry out device management, risk management, and vulnerability management. You can also use it to carry out threat monitoring and incident response across your enterprise. It provides a unified view of all network devices, key IoT, and OT risk indicators and alerts detected in facilities where sensors are deployed. Use the on-premises management console to view and manage sensors in air-gapped networks.

This article covers the following installation information:

- **Hardware:** Dell and HPE physical appliance details.

- **Software:** Sensor and on-premises management console software installation.

- **Virtual Appliances:** Virtual machine details and software installation.

After the software is installed, connect your sensor to your network.

## About Defender for IoT appliances

The following sections provide information about Defender for IoT sensor appliances and the appliance for the Defender for IoT on-premises management console.

### Physical appliances

The Defender for IoT appliance sensor connects to a SPAN port, or network TAP. Once connected, the sensor immediately collects ICS network traffic by using passive (agentless) monitoring. This process has zero impact on OT networks, and devices because it isn't placed in the data path, and doesn't actively scan OT devices.

The following rack mount appliances are available:

| **Deployment type** | **Corporate** | **Enterprise** | **SMB** |**SMB Ruggedized** |
|--|--|--|--|--|
| **Model** | HPE ProLiant DL360 | HPE ProLiant DL20 | HPE ProLiant DL20 | HPE EL300 |
| **Monitoring ports** | up to 15 RJ45 or 8 OPT | up to 8 RJ45 or 6 OPT | up to 4 RJ45 | Up to 5 RJ45 |
| **Max Bandwidth\*** | 3 Gb/Sec | 1 Gb/Sec | 200 Mb/Sec | 100 Mb/Sec |
| **Max Protected Devices** | 12,000 | 10,000 | 1,000 | 800 |

*Maximum bandwidth capacity might vary depending on protocol distribution.

### Virtual appliances

The following virtual appliances are available:

| **Deployment type** | **Corporate** | **Enterprise** | **SMB** |
|--|--|--|--|
| **Description** | Virtual appliance for corporate deployments | Virtual appliance for enterprise deployments | Virtual appliance for SMB deployments |
| **Max Bandwidth\*** | 2.5 Gb/Sec | 800 Mb/sec | 160 Mb/sec |
| **Max protected devices** | 12,000 | 10,000 | 800 |
| **Deployment Type** | Corporate | Enterprise | SMB |

*Maximum bandwidth capacity might vary depending on protocol distribution.

### Hardware specifications for the on-premises management console

 | Item | Description |
 |----|--|
 **Description** | In a multi-tier architecture, the on-premises management console delivers visibility and control across geographically distributed sites. It integrates with SOC security stacks, including SIEMs, ticketing systems, next-generation firewalls, secure remote access platforms, and the Defender for IoT ICS malware sandbox. |
 **Deployment type** | Enterprise |
 **Appliance type**  | Dell R340, VM |
 **Number of managed sensors** | Unlimited |

## Prepare for the installation

### Access the ISO installation image

The installation image is accessible from Defender for IoT, in the [Azure portal](https://ms.portal.azure.com).

**To access the file**:

1. Navigate to the [Azure portal](https://ms.portal.azure.com).

1. Search for, and select **Microsoft Defender for IoT**.

1. Select the **Sensor**, or **On-premises management console** tab.

    :::image type="content" source="media/tutorial-install-components/sensor-tab.png" alt-text="Screeshot of the sensor tab under Defender for IoT.":::

1. Select a version from the drop-down menu.

1. Select the **Download** button.

### Install from DVD

Before the installation, ensure you have:

- A portable DVD drive with the USB connector.

- An ISO installer image.

**To Burn the image to a DVD**:

1. Connect a portable DVD drive to your computer.

1. Insert a blank DVD into the portable DVD drive.

1. Right-click the ISO image, and select **Burn to disk**.

1. Connect the DVD drive to the device, and configure the appliance to boot from DVD.

### Install from disk on a key

Before the installation, ensure you have:

- Rufus installed.
  
- A disk on key with USB version 3.0 and later. The minimum size is 4 GB.

- An ISO installer image file.

This process will format the disk on a key and any data stored on the disk on key will be erased.

**To prepare a disk on a key**:

1. Run Rufus, and select **SENSOR ISO**.

1. Connect the disk on a key to the front panel.

1. Set the BIOS of the server to boot from the USB.

## Sensor installations for physical appliances sensor installation

For more information, see installation procedures for the following appliances:

- **Corporate appliances**: [HPE ProLiant DL360](appliance-catalog/hpe-proliant-dl360.md)

- **Enterprise appliances**: [HPE ProLiant DL20/DL20 Plus for enterprise deployments](appliance-catalog/hpe-proliant-dl20-plus-enterprise.md)

- **SMB appliances**:

    - [Dell Edge 5200](appliance-catalog/dell-edge-5200.md)
    - [HPE ProLiant DL20/DL20 Plus for SMB deployments](appliance-catalog/hpe-proliant-dl20-plus-smb.md)

- **Rugged appliances**:  [YS-techsystems YS-FIT2](appliance-catalog/ys-techsystems-ys-fit2.md)

## Sensor installation for the virtual appliance

You can deploy the virtual machine for the Defender for IoT sensor in the following architectures:

| Architecture | Specifications | Usage | Comments |
|---|---|---|---|
| **Enterprise** | CPU: 8<br/>Memory: 32G RAM<br/>HDD: 1800 GB | Production environment | Default and most common |
| **Small Business** | CPU: 4 <br/>Memory: 8G RAM<br/>HDD: 500 GB | Test or small production environments | -  |
| **Office** | CPU: 4<br/>Memory: 8G RAM<br/>HDD: 100 GB | Small test environments | -  |

### Prerequisites

The on-premises management console supports both VMware and Hyper-V deployment options. Before you begin the installation, make sure you have the following items:

- VMware (ESXi 5.5 or later) or Hyper-V hypervisor (Windows 10 Pro or Enterprise) installed and operational

- Available hardware resources for the virtual machine

- ISO installation file for the Microsoft Defender for IoT sensor

Make sure the hypervisor is running.

### Create the virtual machine (ESXi)

This procedure describes how to create a virtual machine by using ESXi.

**To create the virtual machine using ESXi**:

1. Sign in to the ESXi, choose the relevant **datastore**, and select **Datastore Browser**.

1. Select **Upload**, to upload the image, and select **Close**.

1. Navigate to VM, and then select **Create/Register VM**.

1. Select **Create new virtual machine**, and then select **Next**.

1. Add a sensor name, and select the following options:

   - Compatibility: **&lt;latest ESXi version&gt;**

   - Guest OS family: **Linux**

   - Guest OS version: **Ubuntu Linux (64-bit)**

1. Select **Next**.

1. Choose the relevant datastore and select **Next**.

1. Change the virtual hardware parameters according to the required architecture.

1. For **CD/DVD Drive 1**, select **Datastore ISO file** and choose the ISO file that you uploaded earlier.

1. Select **Next** > **Finish**.

### Create the virtual machine (Hyper-V)

This procedure describes how to create a virtual machine by using Hyper-V.

**To create the virtual machine using Hyper-V**:

1. Create a virtual disk in Hyper-V Manager.

1. Select **format = VHDX**.

1. Select **type = Dynamic Expanding**.

1. Enter the name and location for the VHD.

1. Enter the required size (according to the architecture).

1. Review the summary, and select **Finish**.

1. On the **Actions** menu, create a new virtual machine.

1. Enter a name for the virtual machine.

1. Select **Specify Generation** > **Generation 1**.

1. Specify the memory allocation (according to the architecture), and select the check box for dynamic memory.

1. Configure the network adaptor according to your server network topology.

1. Connect the VHDX created previously to the virtual machine.

1. Review the summary, and select **Finish**.

1. Right-click on the new virtual machine, and select **Settings**.

1. Select **Add Hardware**, and add a new network adapter.

1. Select the virtual switch that will connect to the sensor management network.

1. Allocate CPU resources (according to the architecture).

1. Connect the management console's ISO image to a virtual DVD drive.

1. Start the virtual machine.

1. On the **Actions** menu, select **Connect** to continue the software installation.

### Software installation (ESXi and Hyper-V)

This section describes the ESXi and Hyper-V software installation.

To install:

1. Open the virtual machine console.

1. The VM will start from the ISO image, and the language selection screen will appear.

1. Continue by installing OT sensor or on-premises management software. For more information, see [Install the software](#install-defender-for-iot-software).

## Install Defender for IoT software

Ensure you followed the installation instruction for your device prior to starting the software installation, and have downloaded the containerized sensor version ISO file.

Mount the ISO file using one of the following options;

- Physical media – burn the ISO file to a DVD, or USB, and boot from the media.  

- Virtual mount – use iLO for HPE, or iDRAC for Dell to boot the iso file.

> [!Note]
> At the end of this process you will be presented with the usernames, and passwords for your device. Make sure to copy these down as these passwords will not be presented again.

**To install the sensor's software**:

1. Select the installation language.

    :::image type="content" source="media/tutorial-install-components/language-select.png" alt-text="Screenshot of the sensor's language select screen.":::

1. Select the sensor's architecture.

    :::image type="content" source="media/tutorial-install-components/sensor-architecture.png" alt-text="Screenshot of the sensor's architecture select screen.":::

1. The Sensor will reboot, and the Package configuration screen will appear. Press the up, or down arrows to navigate, and the Space bar to select an option. Press the Enter key to advance to the next screen.  

1. Select the monitor interface, and press the **Enter** key.

    :::image type="content" source="media/tutorial-install-components/monitor-interface.png" alt-text="Screenshot of the select monitor interface screen.":::

1. If one of the monitoring ports is for ERSPAN, select it, and press the **Enter** key.

    :::image type="content" source="media/tutorial-install-components/erspan-monitor.png" alt-text="Screenshot of the select erspan monitor screen.":::

1. Select the interface to be used as the management interface, and press the **Enter** key.

    :::image type="content" source="media/tutorial-install-components/management-interface.png" alt-text="Screenshot of the management interface select screen.":::

1. Enter the sensor's IP address, and press the **Enter** key.

    :::image type="content" source="media/tutorial-install-components/sensor-ip-address.png" alt-text="Screenshot of the sensor IP address screen.":::

1. Enter the path of the mounted logs folder. We recommend using the default path, and press the **Enter** key.

    :::image type="content" source="media/tutorial-install-components/mounted-backups-path.png" alt-text="Screenshot of the mounted backup path screen.":::

1. Enter the Subnet Mask IP address, and press the **Enter** key.

1. Enter the default gateway IP address, and press the **Enter** key.

1. Enter the DNS Server IP address, and press the **Enter** key.

1. Enter the sensor hostname, and press the **Enter** key.

    :::image type="content" source="media/tutorial-install-components/sensor-hostname.png" alt-text="Screenshot of the screen where you enter a hostname for your sensor.":::

1. The installation process runs.

1. When the installation process completes, save the appliance ID, and passwords. Copy these credentials to a safe place as you'll need them to access the platform the first time you use it.

    :::image type="content" source="media/tutorial-install-components/login-information.png" alt-text="Screenshot of the final screen of the installation with usernames, and passwords.":::

## On-premises management console installation

Before installing the software on the appliance, you need to adjust the appliance's BIOS configuration:

### BIOS configuration

**To configure the BIOS for your appliance**:

1. [Enable remote access and update the password](#enable-remote-access-and-update-the-password).

1. [Configure the BIOS](#configure-the-hpe-bios).

### Software installation

The installation process takes about 20 minutes. After the installation, the system is restarted several times.

During the installation process, you can add a secondary NIC. If you choose not to install the secondary NIC during installation, you can [add a secondary NIC](#add-a-secondary-nic) at a later time.

To install the software:

1. Select your preferred language for the installation process.

   :::image type="content" source="media/tutorial-install-components/on-prem-language-select.png" alt-text="Select your preferred language for the installation process.":::

1. Select **MANAGEMENT-RELEASE-\<version\>\<deployment type\>**.

   :::image type="content" source="media/tutorial-install-components/on-prem-install-screen.png" alt-text="Select your version.":::

1. In the Installation Wizard, define the network properties:

   :::image type="content" source="media/tutorial-install-components/on-prem-first-steps-install.png" alt-text="Screenshot that shows the appliance profile.":::

   | Parameter | Configuration |
   |--|--|
   | **configure management network interface** | For Dell: **eth0, eth1** <br /> For HP: **enu1, enu2** <br>  Or <br />**possible value** |
   | **configure management network IP address:** | **IP address provided by the customer** |
   | **configure subnet mask:** | **IP address provided by the customer** |
   | **configure DNS:** | **IP address provided by the customer** |
   | **configure default gateway IP address:** | **IP address provided by the customer** |

1. **(Optional)** If you would like to install a secondary Network Interface Card (NIC), define the following appliance profile, and network properties:

    :::image type="content" source="media/tutorial-install-components/on-prem-secondary-nic-install.png" alt-text="Screenshot that shows the Secondary NIC install questions.":::

   | Parameter | Configuration |
   |--|--|
   | **configure sensor monitoring interface (Optional):** | **eth1**, or **possible value** |
   | **configure an IP address for the sensor monitoring interface:** | **IP address provided by the customer** |
   | **configure a subnet mask for the sensor monitoring interface:** | **IP address provided by the customer** |

1. Accept the settlings and continue by typing `Y`.

1. After about 10 minutes, the two sets of credentials appear. One is for a **CyberX** user, and one is for a **Support** user.

   :::image type="content" source="media/tutorial-install-components/credentials-screen.png" alt-text="Copy these credentials as they will not be presented again.":::  

   Save the usernames, and passwords, you'll need these credentials to access the platform the first time you use it.

1. Select **Enter** to continue.

For information on how to find the physical port on your appliance, see [Find your port](#find-your-port).

### Add a secondary NIC

You can enhance security to your on-premises management console by adding a secondary NIC. By adding a secondary NIC you will have one dedicated for your users, and the other will support the configuration of a gateway for routed networks. The second NIC is dedicated to all attached sensors within an IP address range.

:::image type="content" source="media/tutorial-install-components/secondary-nic.png" alt-text="The overall architecture of the secondary NIC.":::

Both NICs will support the user interface (UI). If you choose not to deploy a secondary NIC, all of the features will be available through the primary NIC.

If you have already configured your on-premises management console, and would like to add a secondary NIC to your on-premises management console, use the following steps:

1. Use the network reconfigure command:

    ```bash
    sudo cyberx-management-network-reconfigure
    ```

1. Enter the following responses to the following questions:

    :::image type="content" source="media/tutorial-install-components/network-reconfig-command.png" alt-text="Enter the following answers to configure your appliance.":::

    | Parameters | Response to enter |
    |--|--|
    | **Management Network IP address** | `N` |
    | **Subnet mask** | `N` |
    | **DNS** | `N` |
    | **Default gateway IP Address** | `N` |
    | **Sensor monitoring interface (Optional. Applicable when sensors are on a different network segment. For more information, see the Installation instructions)**| `Y`, **select a possible value** |
    | **An IP address for the sensor monitoring interface (accessible by the sensors)** | `Y`, **IP address provided by the customer**|
    | **A subnet mask for the sensor monitoring interface (accessible by the sensors)** | `Y`, **IP address provided by the customer** |
    | **Hostname** | **provided by the customer** |

1. Review all choices, and enter `Y` to accept the changes. The system reboots.

### Find your port

If you are having trouble locating the physical port on your device, you can use the following command to:

```bash
sudo ethtool -p <port value> <time-in-seconds>
```

This command will cause the light on the port to flash for the specified time period. For example, entering `sudo ethtool -p eno1 120`, will have port eno1 flash for 2 minutes allowing you to find the port on the back of your appliance.

## Virtual appliance: On-premises management console installation

The on-premises management console VM supports the following architectures:

| Architecture | Specifications | Usage |
|--|--|--|
| Enterprise <br/>(Default and most common) | CPU: 8 <br/>Memory: 32G RAM<br/> HDD: 1.8 TB | Large production environments |
| Small | CPU: 4 <br/> Memory: 8G RAM<br/> HDD: 500 GB | Large production environments |
| Office | CPU: 4 <br/>Memory: 8G RAM <br/> HDD: 100 GB | Small test environments |

### Prerequisites

The on-premises management console supports both VMware and Hyper-V deployment options. Before you begin the installation, verify the following:

- VMware (ESXi 5.5 or later) or Hyper-V hypervisor (Windows 10 Pro or Enterprise) is installed and operational.

- The hardware resources are available for the virtual machine.

- You have the ISO installation file for the on-premises management console.

- The hypervisor is running.

### Create the virtual machine (ESXi)

To create a virtual machine (ESXi):

1. Sign in to the ESXi, choose the relevant **datastore**, and select **Datastore Browser**.

1. Upload the image and select **Close**.

1. Go to **Virtual Machines**.

1. Select **Create/Register VM**.

1. Select **Create new virtual machine** and select **Next**.

1. Add a sensor name and choose:

   - Compatibility: \<latest ESXi version>

   - Guest OS family: Linux

   - Guest OS version: Ubuntu Linux (64-bit)

1. Select **Next**.

1. Choose relevant datastore and select **Next**.

1. Change the virtual hardware parameters according to the required architecture.

1. For **CD/DVD Drive 1**, select **Datastore ISO file** and choose the ISO file that you uploaded earlier.

1. Select **Next** > **Finish**.

### Create the virtual machine (Hyper-V)

To create a virtual machine by using Hyper-V:

1. Create a virtual disk in Hyper-V Manager.

1. Select the format **VHDX**.

1. Select **Next**.

1. Select the type **Dynamic expanding**.

1. Select **Next**.

1. Enter the name and location for the VHD.

1. Select **Next**.

1. Enter the required size (according to the architecture).

1. Select **Next**.

1. Review the summary and select **Finish**.

1. On the **Actions** menu, create a new virtual machine.

1. Select **Next**.

1. Enter a name for the virtual machine.

1. Select **Next**.

1. Select **Generation** and set it to **Generation 1**.

1. Select **Next**.

1. Specify the memory allocation (according to the architecture) and select the check box for dynamic memory.

1. Select **Next**.

1. Configure the network adaptor according to your server network topology.

1. Select **Next**.

1. Connect the VHDX created previously to the virtual machine.

1. Select **Next**.

1. Review the summary and select **Finish**.

1. Right-click the new virtual machine, and then select **Settings**.

1. Select **Add Hardware** and add a new adapter for **Network Adapter**.

1. For **Virtual Switch**, select the switch that will connect to the sensor management network.

1. Allocate CPU resources (according to the architecture).

1. Connect the management console's ISO image to a virtual DVD drive.

1. Start the virtual machine.

1. On the **Actions** menu, select **Connect** to continue the software installation.

### Software installation (ESXi and Hyper-V)

Starting the virtual machine will start the installation process from the ISO image.

To install the software:

1. Select **English**.

1. Select the required architecture for your deployment.

1. Define the network interface for the sensor management network: interface, IP, subnet, DNS server, and default gateway.

1. Sign-in credentials are automatically generated. Save the username and passwords, you'll need these credentials to access the platform the first time you use it.

   The appliance will then reboot.

1. Access the management console via the IP address previously configured: `<https://ip_address>`.

    :::image type="content" source="media/tutorial-install-components/defender-for-iot-management-console-sign-in-screen.png" alt-text="Screenshot that shows the management console's sign-in screen.":::

## Legacy appliances

This section describes installation procedures for *legacy* appliances only. See [Identify required appliances](how-to-identify-required-appliances.md), if you are buying a new appliance.

For more information, see:

- [Dell PowerEdge R340 XL](appliance-catalog/dell-poweredge-r340-xl-legacy.md)
- [HPE Edgeline EL300](appliance-catalog/hpe-edgeline-el300.md).
- [Neousys Nuvo-5006LP](appliance-catalog/neousys-nuvo-5006lp.md)

## Post-installation validation

To validate the installation of a physical appliance, you need to perform many tests. The same validation process applies to all the appliance types.

Perform the validation by using the GUI or the CLI. The validation is available to the user **Support** and the user **CyberX**.

Post-installation validation must include the following tests:

- **Sanity test**: Verify that the system is running.

- **Version**: Verify that the version is correct.

- **ifconfig**: Verify that all the input interfaces configured during the installation process are running.

### Check system health by using the GUI

:::image type="content" source="media/tutorial-install-components/system-health-check-screen.png" alt-text="Screenshot that shows the system health check.":::

#### Sanity

- **Appliance**: Runs the appliance sanity check. You can perform the same check by using the CLI command `system-sanity`.

- **Version**: Displays the appliance version.

- **Network Properties**: Displays the sensor network parameters.

#### Redis

- **Memory**: Provides the overall picture of memory usage, such as how much memory was used and how much remained.

- **Longest Key**: Displays the longest keys that might cause extensive memory usage.

#### System

- **Core Log**: Provides the last 500 rows of the core log, enabling you to view the recent log rows without exporting the entire system log.

- **Task Manager**: Translates the tasks that appear in the table of processes to the following layers:
  
  - Persistent layer (Redis)

  - Cash layer (SQL)

- **Network Statistics**: Displays your network statistics.

- **TOP**: Shows the table of processes. It's a Linux command that provides a dynamic real-time view of the running system.

- **Backup Memory Check**: Provides the status of the backup memory, checking the following:

  - The location of the backup folder

  - The size of the backup folder

  - The limitations of the backup folder

  - When the last backup happened

  - How much space there are for the extra backup files

- **ifconfig**: Displays the parameters for the appliance's physical interfaces.

- **CyberX nload**: Displays network traffic and bandwidth by using the six-second tests.

- **Errors from Core, log**: Displays errors from the core log file.

**To access the tool**:

1. Sign in to the sensor with the **Support** user credentials.

1. Select **System Statistics** from the **System Settings** window.

    :::image type="icon" source="media/tutorial-install-components/system-statistics-icon.png" border="false":::

### Check system health by using the CLI

Verify that the system is up, and running prior to testing the system's sanity.

**To test the system's sanity**:

1. Connect to the CLI with the Linux terminal (for example, PuTTY) and the user **Support**.

1. Enter `system sanity`.

1. Check that all the services are green (running).

    :::image type="content" source="media/tutorial-install-components/support-screen.png" alt-text="Screenshot that shows running services.":::

1. Verify that **System is UP! (prod)** appears at the bottom.

Verify that the correct version is used:

**To check the system's version**:

1. Connect to the CLI with the Linux terminal (for example, PuTTY) and the user **Support**.

1. Enter `system version`.

1. Check that the correct version appears.

Verify that all the input interfaces configured during the installation process are running:

**To validate the system's network status**:

1. Connect to the CLI with the Linux terminal (for example, PuTTY) and the user **Support**.

1. Enter `network list` (the equivalent of the Linux command `ifconfig`).

1. Validate that the required input interfaces appear. For example, if two quad Copper NICs are installed, there should be 10 interfaces in the list.

    :::image type="content" source="media/tutorial-install-components/interface-list-screen.png" alt-text="Screenshot that shows the list of interfaces.":::

Verify that you can access the console web GUI:

**To check that management has access to the UI**:

1. Connect a laptop with an Ethernet cable to the management port (**Gb1**).

1. Define the laptop NIC address to be in the same range as the appliance.

    :::image type="content" source="media/tutorial-install-components/access-to-ui.png" alt-text="Screenshot that shows management access to the UI.":::

1. Ping the appliance's IP address from the laptop to verify connectivity (default: 10.100.10.1).

1. Open the Chrome browser in the laptop and enter the appliance's IP address.

1. In the **Your connection is not private** window, select **Advanced** and proceed.

1. The test is successful when the Defender for IoT sign-in screen appears.

   :::image type="content" source="media/tutorial-install-components/defender-for-iot-sign-in-screen.png" alt-text="Screenshot that shows access to management console.":::

## Troubleshooting

### You can't connect by using a web interface

1. Verify that the computer that you're trying to connect is on the same network as the appliance.

1. Verify that the GUI network is connected to the management port.

1. Ping the appliance's IP address. If there is no ping:

   1. Connect a monitor and a keyboard to the appliance.

   1. Use the **Support** user and password to sign in.

   1. Use the command `network list` to see the current IP address.

      :::image type="content" source="media/tutorial-install-components/network-list.png" alt-text="Screenshot that shows the network list.":::

1. If the network parameters are misconfigured, use the following procedure to change them:

   1. Use the command `network edit-settings`.

   1. To change the management network IP address, select **Y**.

   1. To change the subnet mask, select **Y**.

   1. To change the DNS, select **Y**.

   1. To change the default gateway IP address, select **Y**.

   1. For the input interface change (sensor only), select **N**.

   1. To apply the settings, select **Y**.

1. After restart, connect with the support user credentials and use the `network list` command to verify that the parameters were changed.

1. Try to ping and connect from the GUI again.

### The appliance isn't responding

1. Connect a monitor and keyboard to the appliance, or use PuTTY to connect remotely to the CLI.

1. Use the **Support** user's credentials to sign in.

1. Use the `system sanity` command and check that all processes are running.

    :::image type="content" source="media/tutorial-install-components/system-sanity-screen.png" alt-text="Screenshot that shows the system sanity command.":::

For any other issues, contact [Microsoft Support](https://support.microsoft.com/en-us/supportforbusiness/productselection?sapId=82c88f35-1b8e-f274-ec11-c6efdd6dd099).

## Configure a SPAN port

A virtual switch does not have mirroring capabilities. However, you can use promiscuous mode in a virtual switch environment. Promiscuous mode  is a mode of operation, and a security, monitoring and administration technique, that is defined at the virtual switch, or portgroup level. By default, Promiscuous mode is disabled. When Promiscuous mode is enabled the virtual machine’s network interfaces that are in the same portgroup will use the Promiscuous mode to view all network traffic that goes through that virtual switch. You can implement a workaround with either ESXi, or Hyper-V.

:::image type="content" source="media/tutorial-install-components/purdue-model.png" alt-text="A screenshot of where in your architecture the sensor should be placed.":::

### Configure a SPAN port with ESXi

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

### Configure a SPAN port with Hyper-V

Prior to starting you will need to:

- Ensure that there is no instance of a virtual appliance running.

- Enable Ensure SPAN on the data port, and not the management port.

- Ensure that the data port SPAN configuration is not configured with an IP address.

**To configure a SPAN port with Hyper-V**:

1. Open the Virtual Switch Manager.

1. In the Virtual Switches list, select **New virtual network switch** > **External** as the dedicated spanned network adapter type.

    :::image type="content" source="media/tutorial-install-components/new-virtual-network.png" alt-text="Screenshot of selecting new virtual network and external before creating the virtual switch.":::

1. Select **Create Virtual Switch**.

1. Under connection type, select **External Network**.

1. Ensure the checkbox for **Allow management operating system to share this network adapter** is checked.

   :::image type="content" source="media/tutorial-install-components/external-network.png" alt-text="Select external network, and allow the management operating system to share the network adapter.":::

1. Select **OK**.

#### Attach a SPAN Virtual Interface to the virtual switch

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

    :::image type="content" source="media/tutorial-install-components/vswitch-span.png" alt-text="Screenshot of selecting the following options on the virtual switch screen.":::

1. In the Hardware list, under the Network Adapter drop-down list, select **Advanced Features**.

1. In the Port Mirroring section, select **Destination** as the mirroring mode for the new virtual interface.

    :::image type="content" source="media/tutorial-install-components/destination.png" alt-text="Screenshot of the selections needed to configure mirroring mode.":::

1. Select **OK**.

#### Enable Microsoft NDIS capture extensions for the virtual switch

Microsoft NDIS Capture Extensions will need to be enabled for the new virtual switch.

**To enable Microsoft NDIS capture extensions for the newly added virtual switch**:

1. Open the Virtual Switch Manager on the Hyper-V host.

1. In the Virtual Switches list, expand the virtual switch name `vSwitch_Span` and select **Extensions**.

1. In the Switch Extensions field, select **Microsoft NDIS Capture**.

    :::image type="content" source="media/tutorial-install-components/microsoft-ndis.png" alt-text="Screenshot of enabling the Microsoft NDIS by selecting it from the switch extensions menu.":::

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

## Access sensors from the on-premises management console

You can enhance system security by preventing direct user access to the sensor. Instead, use proxy tunneling to let users access the sensor from the on-premises management console with a single firewall rule. This technique narrows the possibility of unauthorized access to the network environment beyond the sensor. The user's experience when signing in to the sensor remains the same.

:::image type="content" source="media/tutorial-install-components/sensor-system-graph.png" alt-text="Screenshot that shows access to the sensor.":::

**To enable tunneling**:

1. Sign in to the on-premises management console's CLI with the **CyberX**, or the **Support** user credentials.

1. Enter `sudo cyberx-management-tunnel-enable`.

1. Select **Enter**.

1. Enter `--port 10000`.

## Next steps

For more information, see [Set up your network](how-to-set-up-your-network.md).
