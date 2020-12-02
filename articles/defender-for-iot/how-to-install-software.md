---
title: Install software
description: 
author: shhazam-ms
manager: rkarlin
ms.author: shhazam
ms.date: 12/2/2020
ms.topic: how-to
ms.service: azure
---

# About the Defender for IoT Installation

This article describes how to install the:

- **Defender for IoT sensor:** Defender for IoT sensors collects ICS network traffic using passive (agentless) monitoring. Passive and non-intrusive, the sensors have zero impact on OT and IoT networks and devices. The sensor connects to a SPAN port or network TAP and immediately begins monitoring your network. Detections are displayed in the sensor console, where they can be viewed, investigated, and analyzed in a network map, device inventory, and an extensive range of reports. For example risk assessment reports, data mining queries and attack vectors. Read more about sensor capabilities in the [***Defender for IoT Sensor User Guide***](https://aka.ms/AzureDefenderforIoTUserGuide).

 -  **Defender for IoT on-premises management console:** The on-premises management console lets you carry out device management, risk, and vulnerability management, as well as threat monitoring and incident response across your enterprise. It provides a unified view of all network devices, key IoT, and OT risk indicators and alerts detected in facilities where sensors are deployed. Use the on-premises management console to view and manage sensors in air-gapped networks.

The following installation information is covered:

  - **Hardware:** Dell and HPE physical appliance details

  - **Software:** Sensor and on-premises management console software installation

  - **Virtual Appliances:** virtual machine details and software installation

After installation, connect your sensor to your network.

## About Defender for IoT appliances 

This article covers information about Defender for IoT sensor appliances and the appliance for the Defender for IoT on-premises management console.

### Physical appliances

The Defender for IoT appliance sensor connects to a SPAN port or network TAP and immediately begins collecting ICS network traffic using passive (agentless) monitoring. This process has zero impact on OT networks and devices because it is not placed in the data path and does not actively scan OT devices.

The following rack mount appliances are available:

| **Deployment Type** | **Corporate** | **Enterprise** | **SMB** |  |
|--|--|--|--|--|
| **Model** | HPE ProLiant DL360 | Dell PowerEdge R340 XL | HPE ProLiant DL20 | HPE ProLiant DL20 |
| **Monitoring ports** | up to 15 RJ45 or 8 OPT | up to 9 RJ45 or 6 OPT | up to 8 RJ45 or 6 OPT | 4 RJ45 |
| **Max Bandwidth\*** | 3 Gb/Sec | 1 Gb/Sec | 1 Gb/Sec | 100 Mb/Sec |
| **Max Protected Devices** | 30,000 | 10,000 | 15,000 | 1,000 |

*Max Bandwidth capacity may vary depending on protocol distribution

### Virtual appliances

The following virtual appliances are available:

| **Deployment Type** | **Enterprise** | **SMB** | **Line** |
|--|--|--|--|
| **Description** | Virtual appliance for enterprise deployments | Virtual appliance for SMB deployments | Virtual appliance for line deployments |
| **Max Bandwidth\*** | 150 Mb/Sec | 15 Mb/Sec | 3 Mb/Sec |
| **Max protected devices** | 3,000 | 300 | 100 |
| **Deployment Type** | Enterprise | SMB | Line |
| **Description** | Virtual appliance for enterprise deployments | Virtual appliance for SMB deployments | Virtual appliance for line deployments |

*Max Bandwidth capacity may vary depending on protocol distribution

### On-premises management console hardware specifications

 | Item | Description |
 |----|--|
 **Description** | In a multi-tier architecture, the on-premises management console delivers visibility and control across geographically distributed sites. It integrates with SOC security stacks including SIEMs, ticketing systems, next generation firewalls, secure remote access platforms, and the Defender for IoT ICS malware sandbox. |
 **Deployment type** | Enterprise |
 **Appliance Type**  | Dell R340, VM |
 **Number of Managed Sensors** | Unlimited |

## Prepare for the installation

### Access the ISO installation image

The installation image is accessible from the Defender for IoT portal.

To access the file:

1. Sign in to your Defender for IoT account.

2. Go to the **Network sensor** or **On-premises management console** page and select a version to download.

### Install from DVD

Before the installation, ensure you have:

- a portable DVD drive with the USB connector.

- ISO installer image.

**To install:**

1. Burn the image to a DVD or prepare a disk on a key.

1. Connect the DVD or disk on a key and configure the appliance to boot from DVD or disk on a key.

> [!NOTE]
> Burn the ISO image to the DVD as image. Connect a portable DVD drive into your computer and right click on the ISO Image and choose “Burn to disk”.

### Install from disk on a key

Before the installation, ensure you have:

  - A disk on key with the USB version 3.0 and later. The minimum size is 4 GB.

  - ISO installer image file

Before you begin:

1.  Download RUFUS.

2.  Download ISO image.

3.  A USB disk on a k ey that you want to use. The minimum size is 4 GB.

The disk on a key will be erased in this process.

To prepare a disk on a key:

1. Run Rufus and select SENSOR ISO.

2. Connect the disk on a key to the front panel.

3. Set the BIOS of the server to boot from the USB.

## Dell PowerEdgeR340XL installation

This article provides the Dell PowerEdge R340XL installation procedure.

Before installing the software on the Dell appliance, you need to adjust the appliance BIOS configuration.

This article contains covers:

  - [Dell PowerEdge R340 Front Panel](#dell-poweredge-r340-front-panel) and [Dell PowerEdge R340 Back Panel](#dell-poweredge-r340-back-panel) contains front and back panels description, and information required for installation, such as drivers and ports.

  - [Dell BIOS Configuration](#dell-bios-configuration) provides information about how to connect to the Dell appliance management interface and configure the BIOS.

  - [Software Installation (Dell R340)](#software-installation-dell-r340) describes the procedure required to install the Defender for IoT sensor software.

### Dell PowerEdge R340XL requirements 

This article describes the requirements for installing the Dell PowerEdge R340XL appliance.

- Enterprise license for iDrac

- BIOS configuration XML

- Servers firmware versions:

  - Bios Version – 2.1.6

  - iDrac version - 3.23.23.23

### Dell PowerEdge R340 front panel

:::image type="content" source="media/tutorial-install-components/view-of-dell-poweredge-r340-front-panel.jpg" alt-text="Dell PowerEdge R340 front panel":::

 1. Left control panel 
 2. Optical drive (optional) 
 3. Right control panel 
 4. Information tag 
 5. Drives  

### Dell PowerEdge R340 back panel

:::image type="content" source="media/tutorial-install-components/view-of-dell-poweredge-r340-back-panel.jpg" alt-text="Dell PowerEdge R340 back panel":::

1. Serial port 
2. NIC port (Gb 1) 
3. NIC port (Gb 1) 
4. Half-height PCIe 
5. Full-height PCIe expansion card slot expansion card slot 
6. Power supply unit 1 
7. Power supply unit 2 
8. System identification 
9. System status indicator cable port (CMA) button 
10. USB 3.0 port (2) 
11. iDRAC9 dedicated network port 
12. VGA port 
### Dell BIOS configuration

Dell BIOS configuration is required to adjust the Dell appliance to work with the software.

The BIOS configuration is performed using a pre-defined configuration. The file is accessible from the [Help Center](https://help.cyberx-labs.com/).

Import the configuration file to the Dell appliance.

Before using the configuration file, you will need to establish the communication between the Dell appliance and the management computer.

The Dell appliance is managed by an integrated Dell Remote Access Controller (iDRAC) with Lifecycle Controller (LC). The LC is embedded in every Dell PowerEdge server and provides functionality that helps you deploy, update, monitor, and maintain your Dell PowerEdge appliances.

To establish the communication between the Dell appliance and the management computer, you need to define the iDRAC IP address and management computer IP address on the same subnet.

When the connection is established, the BIOS is configurable.

To configure Dell BIOS:

1. [Configure iDRAC IP address](#configure-idrac-ip-address)

2. [Import the BIOS Configuration File](#import-the-bios-configuration-file)

#### Configure iDRAC IP address

1. Power up the sensor.

2. If the OS is already installed, Select on F2 to enter the BIOS configuration.

3. Select **iDRAC Settings**.

4. Select **Network**.

   > [!NOTE]
   > During the installation you must configure the default iDRAC IP address and password mentioned in the following steps. After the installation, you change these definitions.

5. Change the static IPv4 address to 10.100.100.250.

6. Change the static subnet mask to 255.255.255.0.

   :::image type="content" source="media/tutorial-install-components/idrac-network-settings-screen.png" alt-text="Static subnet mask":::

7. Select **Back** and **Finish**.

#### Import the BIOS configuration file

This article describes how to configure the BIOS using the configuration file.

1. Plug in a PC with a static preconfigured IP address **10.100.100.200** to **iDRAC** port.

   :::image type="content" source="media/tutorial-install-components/idrac-port.png" alt-text="preconfigured IP address port":::

2. Open a browser and type **10.100.100.250** to connect to iDRAC web interface.

3. Sign in with Dell default administrator privileges:

   - Username: root

   - Password: calvin

4. Appliance's credentials are:

   - Username: cyberx

   - Password: xhxvhttju,@4338

     The import server profile operation is initiated.

     > [!NOTE]
     > Before importing the file make sure:
     > -You are the only user that is currently connected to iDRAC.
     > -The system is not in the BIOS menu.

5. Go to **Configuration** > **Server Configuration Profile**. And set the following parameters:

   :::image type="content" source="media/tutorial-install-components/configuration-screen.png" alt-text="Configure your server profile":::

   | Parameter | Configuration |
   |--|--|
   | Location Type | Select **Local** |
   | File Path | Select **Choose File** and add the configuration XML file |
   | Import Components | Select **BIOS, NIC, RAID** |
   | Maximum wait time | Select **20 minutes** |

6. Select **Import**.

7. To monitor the process, go to **Maintenance** > **Job Queue**:

   :::image type="content" source="media/tutorial-install-components/view-the-job-queue.png" alt-text="Job queue":::

#### Manually configuring BIOS 

This article describes how to manually configure the appliance BIOS. You will need to manually configure if:

- You did not purchase your appliance from Arrow

- You have an appliance, but do not have access to the XML configuration file

After you access the BIOS, go to **Device Settings**.

To manually configure:

1. Access the appliance BIOS 
   - directly using a keyboard and screen.

   or

    - using iDRAC.

   1. If the appliance is not a Defender for IoT appliance, open a browser and go to the IP address that was configured before. Sign in with the Dell default administrator privileges: Username: root, Password: calvin.

   2. If the appliance is a Defender for IoT appliance, log in with the following credentials: Username: cyberx, Password: xhxvhttju,@4338

2. Once you access the BIOS, go to **Device Settings**.

3. Choose the RAID-controlled configuration by selecting **Integrated RAID controller 1: Dell PERC\<PERC H330 Adapter\> Configuration Utility**.

4. Select **Configuration Management**.

5. Select **Create Virtual Disk**.

6. In the **Select RAID Level** field, select **RAID5**. In the **Virtual Disk Name** field, enter **ROOT** and select **Physical Disks**.

7. Select **Check All** and then select **Apply Changes**

8. Select **Ok**.

9. Scroll down the screen and select **Create Virtual Disk**.

10. Select the **Confirm** checkbox and select **Yes**.

11. Select **OK**.

12. Return to the main screen and select **System BIOS**.

13. Select **Boot Settings**.

14. For the **Boot Mode** option, select **BIOS**.

15. Select **Back** and then select **Finish** to exit the BIOS settings.

### Software installation (Dell R340)

The installation process takes approximately 20 minutes. After the installation, the system is restarted several times.

**To install:**

1. Verify that the version media is mounted to the appliance in one of the following ways:

   1. Connect the external CD or disk on a key with the release.

   2. Mount the ISO image using the iDRAC: After signing in to iDRAC, select the virtual console, and then select **Virtual Media**.

2. In the **Map CD/DVD** section, select **Choose File**.

3. Choose the version ISO image file for this version from the dialog box that opens.

4. Select the **Map Device** button.

   :::image type="content" source="media/tutorial-install-components/mapped-device-on-virtual-media-screen.png" alt-text="Mapped device":::

5. The media is mounted. Select **Close**.

6. Boot the appliance. When using iDRAC, rebooting the servers can be done by selecting on the **Consul Control** button, on the **Keyboard Macros** select on the **Apply** button, which will initiate the Ctrl-Alt-Del sequence.

7. Select **English**.

8. Select **SENSOR-RELEASE-\<version\> Enterprise…**

   :::image type="content" source="media/tutorial-install-components/sensor-version-select-screen.png" alt-text="Version select":::   

9. Define the appliance profile and network properties:

   :::image type="content" source="media/tutorial-install-components/appliance-profile-screen.png" alt-text="appliance profile":::   

   | Parameter | Configuration |
   |--|--|
   | **Hardware profile** | enterprise |
   | **Management interface** | eno1 |
   | **Network parameters (provided by the customer)** | - |
   |**management network IP address:** | - |
   | **subnet mask:** | - |
   | **appliance hostname:** | - |
   | **DNS:** | - |
   | **default gateway IP address:** | - |
   | **input interfaces:** |  The list of input interfaces is generated for you by the system\.  To mirror the input interfaces, copy all the items presented in the list with a comma separator\. NOTE: There is no need to configure the bridge interface, this option is used for special use cases only\. |

10. After approximately 10 minutes, the two sets of credentials appear. One for a *Defender for IoT* user and one for a *Support* user.  

11. Save the Appliance ID and passwords. You will need these credentials to access the platform the first time you use it.

12. Select **Enter** to continue.

## HPE ProLiant DL20 Installation

This article describes the HPE ProLiant DL20 installation process, which includes the following steps:

  - Enable R\remote access and update the default administrator password.
  - Configure BIOS and RAID settings.
  - Install the software.

### About the installation

  - Enterprise and SMB appliances can be installed. The install process is identical for both appliance types, except for the array configuration.
  - A default administrative user is provided. We recommended you change the password during the network configuration process.
  - During the network configuration, you will configure the iLO port on network port 1.
  - The installation process takes approximately 20 minutes. After the installation, the system is restarted several times.

### HPE ProLiant DL20 front panel

:::image type="content" source="media/tutorial-install-components/hpe-proliant-dl20-front-panel.png" alt-text="HPE Proliant DL20 front panel":::

### HPE ProLiant DL20 back panel

:::image type="content" source="media/tutorial-install-components/hpe-proliant-dl20-back-panel.png" alt-text="HPE Proliant DL20 back panel":::

:::image type="content" source="media/tutorial-install-components/hpe-proliant-dl20-back-panel.png" alt-text="The back panel of the HPE ProLiant DL20.":::

### Enable remote access and update password

This article describes how to set up network options and update the default password.

**To enable and update the password:**

1. Connect a screen and a keyboard to the HP appliance and power the appliance and Press **F9**.

    :::image type="content" source="media/tutorial-install-components/hpe-proliant-screen.png" alt-text="HPE ProLiant window":::

2. Go to **System Utilities >** **System Configuration > iLO 5 Configuration Utility > Network Options**.

    :::image type="content" source="media/tutorial-install-components/system-configuration-window.png" alt-text="System configuration window":::

    1.  Select **Shared Network Port-LOM** from the **Network Interface Adapter** field.
    
    2.  Disable DHCP.
    
    3.  Enter the IP address, subnet mask, and gateway IP address.

3. select **F10: Save**.

4. Select **Esc** to get back to the **iLO 5 Configuration Utility** and select **User Management**

5. Select **User Management**, **Edit/Remove User**. The administrator is the only default user defined. Change the default password.

6. Change the default password and select **F10: Save**.

### Configure the HPE BIOS

This article describes how to configure the HPE BIOS for the Enterprise and SMB appliances.

**To configure:**

1. Select **System Utilities >** **System Configuration > BIOS/Platform Configuration (RBSU)**.

2. In the **BIOS/Platform Configuration (RBSU)** form, select **Boot Options**.

3. Change the **Boot Mode** to **Legacy BIOS Mode** and select **F10: Save**.

4. Select **Esc** twice to the System Configuration form.

#### For the enterprise appliance

1. Select **Embedded RAID 1: HPE Smart Array P408i-a SR Gen 10 > Array Configuration > Create Array**.

2. In the **Create Array** form, select all the options. Three options are available for the *Enterprise* appliance.

#### For the SMB appliance

1. Select **Embedded RAID 1: HPE Smart Array P208i-a SR Gen 10 > Array Configuration > Create Array**.

2. Select **Proceed to Next Form**.

3. In the **Set RAID Level** form, set the level to **RAID 5** for enterprise deployments and **RAID 1** for SMB **deployments**.

4. Select **Proceed to Next Form**.

5. In the **Logical Drive Label** form, type **Logical Drive 1**.

6. Select **Submit Changes**.

7. In the **Submit** form, select **Back to Main Menu**.

8. Select **F10: Save** and then press **Esc** twice.

9. In the **System Utilities** window, select **One-Time Boot Menu**.

10. In the **One-Time Boot Menu** form, select **Legacy BIOS One-Time Boot Menu**.

11. The Booting in Legacy and Boot override windows appear. Choose a boot override option, for example to a CD-ROM, USB, HDD, or UEFI Shell.

    :::image type="content" source="media/tutorial-install-components/boot-override-window-one.png" alt-text="The boot override window screen number one":::

    :::image type="content" source="media/tutorial-install-components/boot-override-window-two.png" alt-text="The boot override window screen number two":::
### Software installation (HPE ProLiant DL20 appliance)

The installation process takes approximately 20 minutes. After the installation, the system is restarted several times.

**To install:**

1. Connect screen and keyboard to the appliance and then connect to the CLI.

2. Connect external CD or disk on key with the ISO image you downloaded from the **Azure Defender for IoT** portal, **Updates** page.

3. Boot the appliance.

4. Select **English**.

    :::image type="content" source="media/tutorial-install-components/select-english-screen.png" alt-text="CLI window select english":::

5. Select **SENSOR -RELEASE**-<version> Enterprise.

    :::image type="content" source="media/tutorial-install-components/sensor-version-select-screen.png" alt-text="Select version screen":::

6. In the installation Wizard, define the appliance profile and network properties:

    :::image type="content" source="media/tutorial-install-components/installation-wizard-screen.png" alt-text="Installation wizard":::

    | Parameter | Configuration |
    | ----------| ------------- |
    | **Hardware profile** | Select Enterprise or office for SMB deployments. |
    | **Management interface** | eno2 |
    | **Default network parameters (usually the parameters are provided by the customer)** | **management network IP address:** <br /> <br />**appliance hostname:** <br />**DNS:** <br />**the default gateway IP address:**|
    | **input interfaces:** | The list of input interfaces is generated for you by the system.<br /><br />To mirror the input interfaces, copy all the items presented in the list with a comma separator: **eno5, eno3, eno1, eno6, eno4**<br /><br />**For HPE DL20: Do not list eno1, enp1s0f4u4 (iLo interfaces)**<br /><br />**BRIDGE**: There is no need to configure the bridge interface, this option is used for special use cases only. Press enter to continue. |

7. After approximately 10 minutes, the two sets of credentials appear. One for a **Defender for IoT** user and one for a **support** user.

8. Save the appliance's ID and passwords. You will need the credentials to access the platform for the first time.*

9. Select **Enter** to continue.

## HPE ProLiant DL360 installation

  - A default administrative user is provided. It is recommended that you change the password during the network configuration.

  - During the network configuration, you will configure the iLO port.

  - The installation process takes approximately 20 minutes. After the installation, the system is restarted several times.

### HPE ProLiant DL360 front panel

:::image type="content" source="media/tutorial-install-components/hpe-proliant-dl360-front-panel.png" alt-text="HPE ProLiant DL360 front panel":::

### HPE ProLiant DL360 back panel

:::image type="content" source="media/tutorial-install-components/hpe-proliant-dl360-back-panel.png" alt-text="HPE Proliant DL360 back panel":::

### Enable remote access and update password

Refer to the following sections in ***HPE ProLiant DL20 Installation***:

  - **Enable remote access and update password**

  - **Configure the HPE BIOS**

The enterprise configuration is identical.

> [!Note]
> In the array form, verify that you select all the options.

### iLO remote install (from virtual drive)

This article describes the iLO installation from a virtual drive.

**To Install:**

1. Sign in to the iLO console, right-click on the servers’ screen

2. Choose HTML5 Console, the following console will appear:

3. Select the CD icon, and choose the CD/DVD option

4. Select **Local ISO file**.

5. In the dialog box, choose the relevant ISO file

6. Go the left Icon, choose **Power**, and select on **Reset**

7. The appliance will reboot and run the sensor installation process

### Software installation (HPE DL360)

The installation process takes approximately 20 minutes. After the installation, the system is restarted several times.

**To install:**

1. Connect screen and keyboard to the appliance and then connect to the CLI.

2. Connect external CD or disk on a key with the ISO image you downloaded from the **Azure Defender for IoT** portal, **Updates** page.

3. Boot the appliance.

4. Select **English**.

5. Select **SENSOR-RELEASE**-<version> Enterprise.

    :::image type="content" source="media/tutorial-install-components/sensor-version-select-screen.png" alt-text="Select version screen":::

6. In the installation Wizard, define the appliance profile and network properties:

    :::image type="content" source="media/tutorial-install-components/installation-wizard-screen.png" alt-text="Installation wizard":::

    | Parameter | Configuration |
    | ----------| ------------- |
    | **Hardware profile** | Select corporate. |
    | **Management interface** | eno2 |
    | **Default network parameters (provided by the customer)** | **management network IP address:** <br />**subnet mask:** <br />**appliance hostname:** <br />**DNS:** <br />**the default gateway IP address:**|
    | **input interfaces:**  | The list of input interfaces is generated for you by the system.<br /><br />To mirror the input interfaces, copy all the items presented in the list with a comma separator.<br /><br />**Note:** There is no need to configure the bridge interface, this option is used for special use cases only. |

7. After approximately 10 minutes, the two sets of credentials appear. One for a **Defender for IoT** user and one for a **support** user.

8. Save the appliance's ID and passwords. You will need these credentials to access the platform for the first time.

9. Select **Enter** to continue.

## Virtual appliance - sensor installation

The Defender for IoT sensor virtual machine can be deployed in the following architectures:


| Architecture | Specifications | Usage | Comments |
|---|---|---|---|
| **Enterprise** | CPU: 8<br/>Memory: 32G RAM<br/>HDD: 1800 GB | Production environment | Default and most common |
| **Small Business** | CPU: 4 <br />Memory: 8G RAM<br />HDD: 500 GB | Test or small production environments | -  |
| **Office** | CPU: 4<br />Memory: 8G RAM<br />HDD: 100 GB | Small Test environments | -  |

### Prerequisites

The on-premises management console supports both VMware and Hyper-V deployment options. Before you begin the installation, make sure you have the following items:

  - VMware (ESXi 5.5 or later) or Hyper-V hypervisor (Windows 10 Pro or Enterprise) is installed and operational

  - Available hardware resources for the Virtual Machine

  - Azure Defender for IoT Sensor – ISO Installation file

Make sure the hypervisor is running.

### Create the virtual machine (ESXi)

1. Sign in to the ESXi, choose the relevant **datastore** and select on **Datastore Browser**

2. **Upload** the image and select **Close**

3. Go to **Virtual Machines**. Select **Create/Register VM**

4. Choose **Create new virtual machine** and select on **Next**

5. Add a sensor name and choose

   - Compatibility: **&lt;latest ESXi version&gt;**

   - Guest OS family: **Linux**

   - Guest OS version: **Ubuntu Linux (64-bit)**

6. select **Next**

7. Choose the relevant datastore and select **Next**

8. Change the virtual hardware parameters according to the required architecture.

9. For **CD/DVD Drive 1**, select **Datastore ISO file** and choose the ISO file that you uploaded earlier

10. select on **Next** and **Finish**

### Create the virtual machine (Hyper-V)

This article describes how to create a virtual machine using Hyper-V.

**To create a virtual machine:**

1. Create a virtual disk in Hyper-V manager​.

2. Select format = *VHDX.*

3. Select type = *Dynamic Expanding.*

4. Enter the name and location for the VHD.

5. Enter the required size (according to architecture).   

6. Review the summary and select **Finish**.

7. In the **Actions** menu, create a new virtual machine.

8. Enter a name for the virtual machine.

9. Select **Specify Generation** > **Generation 1**.

10. Specify the memory allocation (according to architecture) and select the checkbox for dynamic memory.

11. Configure the network adaptor according to your server network topology.

12. Connect the VHDX created previously to the virtual machine.

13. Review the summary and select **Finish**.

14. Right click on the new virtual machine and select **Settings**.

15. Select **Add Hardware** and add a new network adapter.

16. Select the virtual switch that will connect to the sensor management network.

17. Allocate CPU resources (according to architecture).

18. Connect the management console ISO image to a virtual DVD drive.

19. Start the virtual machine.

20. In the **Actions** menu, select **Connect…** to continue the software installation

### Software installation (ESXi and Hyper-V)

This article describes the ESXi and Hyper-V software installation.

**To install:**

1. Open the virtual machine console.

2. The VM will boot from the ISO image, and the language selection screen will be shown. Select *English*.

3. Select the required architecture

4. Define the appliance profile and network properties:

    | Parameter | Configuration |
    | ----------| ------------- |
    | **Hardware profile** | &lt;required architecture&gt; |
    | **Management interface** | ens192 |
    | **DNetwork parameters (provided by the customer)** | **management network IP address:** <br />**subnet mask:** <br />**appliance hostname:** <br />**DNS:** <br />**default gateway:** <br />**input interfaces:**|
    | **bridge interfaces:** | No need to configure the bridge interface, this option is for special use cases only |

5. Type *Y* to accept the settings

6. Sign in credentials is automatically generated and presented. Copy the username and passwords in a safe place as they are required to Sign in and administration.

   - **Support** – the administrative user for user management

   - **Defender for IoT** – the equivalent of root for accessing the appliance

7. The appliance will reboot.

8. Access the management console via the IP address previously configured `https://ip_address`

    :::image type="content" source="media/tutorial-install-components/defender-for-iot-sign-in-screen.png" alt-text="Access to management console":::

## Virtual appliance - on-premises management console installation

The on-premises management console VM supports the following architectures.

| Architecture | Specifications | Usage | 
|--|--|--|
| Enterprise <br />(Default and most common) | CPU: 8 <br />Memory: 32G RAM<br /> HDD: 1.8 TB | Large production environments | 
| Enterprise | CPU: 4 <br /> Memory: 8G RAM<br /> HDD: 500 GB | Large production environments |
| Enterprise | CPU: 4 <br />Memory: 8G RAM <br /> HDD: 100 GB | Small test environment | 
   
### Prerequisites

The on-premises management console supports both VMware and Hyper-V Deployment options. Before you begin the installation, verify the following:

- VMware (ESXi 5.5 or later) or Hyper-V hypervisor (Windows 10 Pro or Enterprise) is installed and operational

- The available hardware resources for the virtual Machine

- On-premise management console – ISO installation file
    
- Make sure the Hypervisor is running 

### Create the virtual machine (ESXi)

This article describes how to a create virtual machine (ESXi).

**To create:**

1. Sign in to the ESXi, and choose the relevant **datastore** and select **Datastore Browser**

2. **Upload** the image and select **Close**.

3. Go to **Virtual Machines**.

4. Select **Create/Register VM**.

5. Choose **Create new virtual machine** and select **Next**.

6. Add a sensor name and choose:

   - Compatibility: \<latest ESXi version>

   - Guest OS family: Linux

   - Guest OS version: Ubuntu Linux (64-bit)

7. Select **Next**.

8. Choose relevant datastore and select **Next**.

9. Change the virtual hardware parameters according to the required architecture.

10. For **CD/DVD Drive 1**, select **Datastore ISO file** and choose the ISO file that you uploaded earlier

11. Select **Next** and **Finish**.

### Create the virtual machine (Hyper-V)

This article describes how to create a virtual machine using Hyper-V.

**To create:**

1. Create a virtual disk in Hyper-V manager​.

2. Select format **VHDX**.


3. Select **Next**.

4. Select type **Dynamic expanding**.

5. Select **Next**.

6. Enter the name and location for the VHD.

7. Select **Next**.

8. Enter the required size (according to architecture)

9. Select **Next**.

10. Review the summary and select **Finish**.

11. In the **Actions** menu, create a new virtual machine*

12. Select **Next**.

13. Enter a name for the virtual machine.

14. Select **Next**.

15. Select Generation and set it to **Generation 1**.

16. Select **Next**.

17. Specify the memory allocation (according to architecture) and select the checkbox for dynamic memory.

18. Select **Next**.

19. Configure the network adaptor according to your server network topology.

20. Select **Next**.

21. Connect the VHDX created previously to the virtual machine.

22. Select **Next**.

23. Review the summary and select **Finish**.

24. Right-click the new virtual machine, and select **Settings**.

25. Select **Add Hardware** and add a new **Network Adapter**.

26. Select the **Virtual Switch, which will connect to the sensor management network.

27. Allocate CPU resources (according to architecture)

28. Connect the management console ISO image to a virtual DVD drive

29. Start the virtual machine.

30. In the **Actions** menu, select **Connect…** to continue the software installation.

### Software installation (ESXi and Hyper-V)

Booting the virtual machine will start the installation process from the ISO image.

**To install:**

1. Select **English**.

2. Select the required architecture for your deployment

3. Define the network interface for the sensor management network – *interface, IP, subnet, DNS server, and Default Gateway:*

4. Sign in credentials is automatically generated and presented. Copy these credentials in a safe place as they are required to Sign in and administration.

  - **Support** – the administrative user for user management

  - **Defender for IoT** – the equivalent of root for accessing the appliance

5. The appliance will reboot

6. Access the management console via the IP address previously configured <https://ip_address>

    :::image type="content" source="media/tutorial-install-components/defender-for-iot-management-console-sign-in-screen.png" alt-text="Management console sign-in screen":::

## Post install validation

To validate the installation of a physical appliance, it is required to perform a number of tests. The same validation process applies to all the appliance types.

The validation is done using the GUI or the CLI and it is available to user *Support* and user *Defender for IoT*.

Post install validation must include the following tests:

  - **Sanity test:** Verify the system is up and running.

  - **Version:** Verify the version is correct.

  - **ifconfig:** Verify all the input interfaces configured during the installation process are up and running.

### Checking system health using the GUI

:::image type="content" source="media/tutorial-install-components/system-health-check-screen.png" alt-text="System Health check":::

#### Sanity

- **Appliance: Runs the appliance sanity check. The same check you can perform using the CLI command system-sanity.

- **Version: Displays the appliance version.

- **Network Properties: Displays the sensor network parameters.

#### Redis

- **Memory: Provides the overall picture of memory usage, such as how much memory was used and how much remained.

- **Longest Key: Displays the longest keys that might cause extensive memory usage.

#### System

- **Core Log: Provides the last 500 rows of the core log, enabling to view the recent log rows without exporting the entire system log.

- **Task Manager: Translates the tasks that appear in the Table of Processes to the following layers: 
  - persistent layer (Redis) 
  - cash layer (SQL)

- **Network Statistics: Displays your network statistics.

- **TOP: TOP (table of processes) is a Linux command that shows the processes. It provides a dynamic real-time view of the running system.

- **Backup Memory Check: Provides the status of the backup memory, checking the following:
  - The location of the backup folder 
  - The size of the backup folder
  - The limitations of the backup folder
  - When was the last backup
  - How much space there are for the additional backup files

- **ifconfig: Displays the appliance physical interfaces’ parameters.

- **CyberX nload: Displays network traffic and bandwidth using the six second-tests.

- **Errors from Core, log**: Displays errors from the core log file.

**To access the tool:**

1. Sign in to the sensor with the support user credentials.

2. Select **System Statistics** from the **System Settings** window.

    :::image type="icon" source="media/tutorial-install-components/system-statistics-icon.png" border="false":::

### Checking system health using the CLI

**Test 1: Sanity – verify the system is up and running:**

1. Connect to CLI with Linux terminal (for example, putty) user **support**

2. Type `system sanity`

3. Check that all the services are green, up and running

    :::image type="content" source="media/tutorial-install-components/support-screen.png" alt-text="Support":::

4. Verify that *System is UP! (prod)* is displayed at the bottom

**Test 2: Version Check – verify that the correct version is used:**

1. Connect to CLI with Linux terminal (for example, putty) with user **support**.

2. Type `system version`.

3. Check that the correct version is displayed.

**Test 3: Network Validation - verify all the input interfaces configured during the installation process are up and running:**

1. Connect to CLI with Linux terminal (for example, putty) user **support**.

2. Type `network list` (the equivalent of the Linux command ifconfig).

3. Validate that the required input interfaces appear. For example, if two quad Copper NICs are installed, there should be 10 interfaces in the list.

    :::image type="content" source="media/tutorial-install-components/interface-list-screen.png" alt-text="List of interfaces screen":::

**Test 4: Management access to UI – verify that you can access the Console Web GUI:**

1. Connect a laptop with an ethernet cable to the management port (**Gb1**).

2. Define the laptop NIC address to be in the same range as the appliance.

    :::image type="content" source="media/tutorial-install-components/access-to-ui.png" alt-text="Management access to UI":::

3. Ping to \<appliance IP> from the laptop to verify connectivity (default: 10.100.10.1).

4. Open the Chrome browser in the laptop and type the \<appliance IP>.

5. In the **Your connection is not private** window, select **Advanced** and proceed.

6. The test is successful when the Defender for IoT sign-in screen appears.

   :::image type="content" source="media/tutorial-install-components/defender-for-iot-sign-in-screen.png" alt-text="Access to management console":::

## Troubleshooting

### Cannot connect using a web interface

1. Verify that the computer that you are trying to connect is on the same network as the appliance.

2. Verify that the GUI network is connected to the management port.

3. Ping the appliance IP address. If there is no Ping:

   - Connect a monitor and a keyboard to the appliance.

   - Use the **support** user and password to Sign in.

   - Use the command **network list** to see the current IP address.

      :::image type="content" source="media/tutorial-install-components/network-list.png" alt-text="Network list":::

4. In case the network parameters are misconfigured, use the following procedure to change it:

   - Use the command network edit-settings

   - To change the management network IP address, select **Y**.

   - To change the subnet mask, select **Y**.

   - To change the DNS, select **Y**.

   - To change the default gateway IP address, select **Y**.

   - (for sensor only) For the input interface change, select **N**.

   - To apply the settings, select **Y**.

5. After reboot, connect with the support user credentials and use the network list command to verify that the parameters were changed.

6. Try to ping and connect from GUI again.

### The appliance is not responding

1. Connect with a monitor and keyboard to the appliance or use putty to connect remotely to the CLI.

2. Use the support user's credentials to sign in.

3. Use the system sanity command and check that all processes are up and running.

    :::image type="content" source="media/tutorial-install-components/system-sanity-screen.png" alt-text="System sanity":::

For any other issues, contact [support.microsoft.com](https://support.microsoft.com/en-us/supportforbusiness/productselection?sapId=82c88f35-1b8e-f274-ec11-c6efdd6dd099).

## Appendix A: Mirroring port on vSwitch (ESXi)

### Configure a SPAN port on existing vSwitch

A vSwitch does not have mirroring capabilities, but a simple workaround can be used to implement SPAN port.

**To configure a SPAN port:**

1. Open vSwitch Properties:

2. select **Add…**

3. Select **Virtual Machine** and select **Next**.

4. Insert a network Label **SPAN Network**, select **VLAN ID**, **All**, and select **Next**.

5. Select **Finish**.

6. Select **SPAN Network** and select **Edit…**

7. Select **Security**, and verify that **Promiscuous Mode** policy is set to **Accept** mode.

8. select **OK** and **Close** the vSwitch properties.

9. Open the **XSense VM** properties.

10. For **Network Adapter 2**, select the **SPAN** network.

11. Select **OK**.

12. Connect to the sensor and verify that mirroring works.

## Appendix B: Access sensors from the on-premises management console

You can enhance system security by preventing user  directly to the sensor. Instead leverage proxy tunneling to let users access the sensor directly from the on-premises management console with a single firewall rule. This narrows the possibility of unauthorized access to the network environment beyond the sensor.

However, The user's experience when signing in to the sensor remains the same.

:::image type="content" source="media/tutorial-install-components/sensor-system-graph.png" alt-text="Sensor":::

**To enable tunneling:**

1. Sign in to the on-premises management console CLI with Defender for Iot or support user credentials.

2. Type: `sudo cyberx-management-tunnel-enable`.

3. Select **Enter**.

4. Type `--port 10000`.

### Next Steps

[Set up your network](how-to-set-up-your-network.md)
