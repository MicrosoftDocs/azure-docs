---
title: Set up your network
description: Learn about solution architecture, network preparation, prerequisites, and other information needed to ensure that you successfully set up your network to work with Azure Defender for IoT appliances.
ms.date: 02/18/2021
ms.topic: how-to
---

# About Azure Defender for IoT network setup

Azure Defender for IoT delivers continuous ICS threat monitoring and device discovery. The platform includes the following components:

**Defender for IoT sensors:** Sensors collect ICS network traffic by using passive (agentless) monitoring. Passive and nonintrusive, the sensors have zero performance impact on OT and IoT networks and devices. The sensor connects to a SPAN port or network TAP and immediately begins monitoring your network. Detections are displayed in the sensor console. There, you can view, investigate, and analyze them in a network map, a device inventory, and an extensive range of reports. Examples include risk assessment reports, data mining queries, and attack vectors. 

**Defender for IoT on-premises management console**: The on-premises management console provides a consolidated view of all network devices. It delivers a real-time view of key OT and IoT risk indicators and alerts across all your facilities. Tightly integrated with your SOC workflows and playbooks, it enables easy prioritization of mitigation activities and cross-site correlation of threats. 

**Defender for IoT portal:** The Defender for IoT application can help you purchase solution appliances, install and update software, and update TI packages. 

This article provides information about solution architecture, network preparation, prerequisites, and more to help you successfully set up your network to work with Defender for IoT appliances. Readers working with the information in this article should be experienced in operating and managing OT and IoT networks. Examples include automation engineers, plant managers, OT network infrastructure service providers, cybersecurity teams, CISOs, or CIOs.

For assistance or support, contact [Microsoft Support](https://support.microsoft.com/en-us/supportforbusiness/productselection?sapId=82c88f35-1b8e-f274-ec11-c6efdd6dd099).

## On-site deployment tasks

Site deployment tasks include:

- [Collect site information](#collect-site-information)

- [Prepare a configuration workstation](#prepare-a-configuration-workstation)

- [Planning rack installation](#planning-rack-installation)

### Collect site information

Record site information such as:

- Sensor management network information.

- Site network architecture.

- Physical environment.

- System integrations.

- Planned user credentials.

- Configuration workstation.

- SSL certificates (optional but recommended).

- SMTP authentication (optional). To use the SMTP server with authentication, prepare the credentials required for your server.

- DNS servers (optional). Prepare your DNS server's IP and host name.

For a detailed list and description of important site information, see [Example site book](#example-site-book).

#### Successful monitoring guidelines

To find the optimal place to connect the appliance in each of your production networks, we recommend that you follow this procedure:

:::image type="content" source="media/how-to-set-up-your-network/production-network-diagram.png" alt-text="Diagram example of production network setup.":::

### Prepare a configuration workstation

Prepare a Windows workstation, including the following:

- Connectivity to the sensor management interface.

- A supported browser

- Terminal software, such as PuTTY.

Make sure the required firewall rules are open on the workstation. See [Network access requirements](#network-access-requirements) for details.

#### Supported browsers

The following browsers are supported for the sensors and on-premises management console web applications:

- Chrome 32+

- Microsoft Edge 86+

- Internet Explorer 10+

### Network access requirements

Verify that your organizational security policy allows access to the following:

| Protocol | Transport | In/Out | Port | Used | Purpose | Source | Destination |
|--|--|--|--|--|--|--|--|
| HTTPS | TCP | IN/OUT | 443 | Sensor and On-Premises Management Console Web Console | Access to Web console | Client | Sensor and on-premises management console |
| SSH | TCP | IN/OUT | 22 | CLI | Access to the CLI | Client | Sensor and on-premises management console |
| SSL | TCP | IN/OUT | 443 | Sensor and on-premises management console | Connection Between CyberX platform and the Central Management platform | sensor | On-premises management console |
| NTP | UDP | IN | 123 | Time Sync | On-premises management console use as NTP to sensor | sensor | on-premises management console |
| NTP | UDP | IN/OUT | 123 | Time Sync | Sensor connected to external NTP server, when there is no on-premises management console installed | sensor | NTP |
| SMTP | TCP | OUT | 25 | Email | The connection between CyberX platform and the Management platform and the mail server | Sensor and On-premises management console | Email server |
| Syslog | UDP | OUT | 514 | LEEF | Logs that send from the on-premises management console to Syslog server | On-premises management console and Sensor | Syslog server |
| DNS |  | IN/OUT | 53 | DNS | DNS Server Port | On-premises management console and Sensor | DNS server |
| LDAP | TCP | IN/OUT | 389 | Active Directory | The connection between CyberX platform and the Management platform to the Active Directory | On-premises management console and Sensor | LDAP server |
| LDAPS | TCP | IN/OUT | 636 | Active Directory | The connection between CyberX platform and the Management platform to the Active Directory | On-premises management console and Sensor | LDAPS server |
| SNMP | UDP | OUT | 161 | Monitoring | Remote SNMP collectors. | On-premises management console and Sensor | SNMP server |
| WMI | UDP | OUT | 135 | monitoring | Windows Endpoint Monitoring | Sensor | Relevant network element |
| Tunneling | TCP | IN | 9000 <br /><br />- on top of port 443 <br /><br />From end user to the on-premises management console. <br /><br />- Port 22 from sensor to the on-premises management console  | monitoring | Tunneling | Sensor | On-premises management console |

### Planning rack installation

To plan your rack installation:

1. Prepare a monitor and a keyboard for your appliance network settings.

1. Allocate the rack space for the appliance.

1. Have AC power available for the appliance.
1. Prepare the LAN cable for connecting the management to the network switch.
1. Prepare the LAN cables for connecting switch SPAN (mirror) ports and or network taps to the Defender for IoT appliance. 
1. Configure, connect, and validate SPAN ports in the mirrored switches as described in the architecture review session.
1. Connect the configured SPAN port to a computer running Wireshark and verify that the port is configured correctly.
1. Open all the relevant firewall ports.

## About passive network monitoring

The appliance receives traffic from multiple sources, either by switch mirror ports (SPAN ports) or by network TAPs. The management port is connected to the business, corporate, or sensor management network with connectivity to an on-premises management console or the Defender for IoT portal.

:::image type="content" source="media/how-to-set-up-your-network/switch-with-port-mirroring.png" alt-text="Diagram of a managed switch with port mirroring.":::

### Purdue model

The following sections describe Purdue levels.

:::image type="content" source="media/how-to-set-up-your-network/purdue-model.png" alt-text="Diagram of the Purdue model.":::

####  Level 0: Cell and area  

Level 0 consists of a wide variety of sensors, actuators, and devices involved in the basic manufacturing process. These devices perform the basic functions of the industrial automation and control system, such as:

- Driving a motor.

- Measuring variables.
- Setting an output.
- Performing key functions, such as painting, welding, and bending.

#### Level 1: Process control

Level 1 consists of embedded controllers that control and manipulate the manufacturing process whose key function is to communicate with the Level 0 devices. In discrete manufacturing, those devices are programmable logic controllers (PLCs) or remote telemetry units (RTUs). In process manufacturing, the basic controller is called a distributed control system (DCS).

#### Level 2: Supervisory

Level 2 represents the systems and functions associated with the runtime supervision and operation of an area of a production facility. These usually include the following: 

- Operator interfaces or HMIs

- Alarms or alerting systems

- Process historian and batch management systems

- Control room workstations

These systems communicate with the PLCs and RTUs in Level 1. In some cases, they communicate or share data with the site or enterprise (Level 4 and Level 5) systems and applications. These systems are primarily based on standard computing equipment and operating systems (Unix or Microsoft Windows).

#### Levels 3 and 3.5: Site-level and industrial perimeter network

The site level represents the highest level of industrial automation and control systems. The systems and applications that exist at this level manage site-wide industrial automation and control functions. Levels 0 through 3 are considered critical to site operations. The systems and functions that exist at this level might include the following:

- Production reporting (for example, cycle times, quality index, predictive maintenance)

- Plant historian

- Detailed production scheduling

- Site-level operations management

- Device and material management

- Patch launch server

- File server

- Industrial domain, Active Directory, terminal server

These systems communicate with the production zone and share data with the enterprise (Level 4 and Level 5) systems and applications.  

#### Levels 4 and 5: Business and enterprise networks

Level 4 and Level 5 represent the site or enterprise network where the centralized IT systems and functions exist. The IT organization directly manages the services, systems, and applications at these levels.

## Planning for network monitoring

The following examples present different types of topologies for industrial control networks, along with considerations for optimal monitoring and placement of sensors.

### What should be monitored?

Traffic that goes through layers 1 and 2 should be monitored.

### What should the Defender for IoT appliance connect to?

The Defender for IoT appliance should connect to the managed switches that see the industrial communications between layers 1 and 2 (in some cases also layer 3).

The following diagram is a general abstraction of a multilayer, multitenant network, with an expansive cybersecurity ecosystem typically operated by an SOC and MSSP.

Typically, NTA sensors are deployed in layers 0 to 3 of the OSI model.

:::image type="content" source="media/how-to-set-up-your-network/osi-model.png" alt-text="Diagram of the OSI model.":::

#### Example: Ring topology

The ring network is a topology in which each switch or node connects to exactly two other switches, forming a single continuous pathway for the traffic.

:::image type="content" source="media/how-to-set-up-your-network/ring-topology.PNG" alt-text="Diagram of the ring topology.":::

#### Example: Linear bus and star topology

In a star network, every host is connected to a central hub. In its simplest form, one central hub acts as a conduit to transmit messages. In the following example, lower switches are not monitored, and traffic that remains local to these switches will not be seen. Devices might be identified based on ARP messages, but connection information will be missing.

:::image type="content" source="media/how-to-set-up-your-network/linear-bus-star-topology.PNG" alt-text="Diagram of the linear bus and star topology.":::

#### Multisensor deployment

Here are some recommendations for deploying multiple sensors:

| **Number** | **Meters** | **Dependency** | **Number of sensors** |
|--|--|--|--|
| The maximum distance between switches | 80 meters | Prepared Ethernet cable | More than 1 |
| Number of OT networks | More than 1 | No physical connectivity | More than 1 |
| Number of switches | Can use RSPAN configuration | Up to eight switches with local span close to the sensor by cabling distance | More than 1 |

#### Traffic mirroring  

To see only relevant information for traffic analysis, you need to connect the Defender for IoT platform to a mirroring port on a switch or a TAP that includes only industrial ICS and SCADA traffic. 

:::image type="content" source="media/how-to-set-up-your-network/switch.jpg" alt-text="Use this switch for your setup.":::

You can monitor switch traffic by using the following methods:

- [Switch SPAN port](#switch-span-port)

- [Remote SPAN (RSPAN)](#remote-span-rspan)

- [Active and passive aggregation TAP](#active-and-passive-aggregation-tap)

SPAN and RSPAN are Cisco terminology. Other brands of switches have similar functionality but might use different terminology.

#### Switch SPAN port

A switch port analyzer mirrors local traffic from interfaces on the switch to interface on the same switch. Here are some considerations:

- Verify that the relevant switch supports the port mirroring function.  

- The mirroring option is disabled by default.

- We recommend that you configure all of the switch's ports, even if no data is connected to them. Otherwise, a rogue device might be connected to an unmonitored port, and it would not be alerted on the sensor.

- On OT networks that utilize broadcast or multicast messaging, configure the switch to mirror only RX (Receive) transmissions. Otherwise, multicast messages will be repeated for as many active ports, and the bandwidth is multiplied.

The following configuration examples are for reference only and are based on a Cisco 2960 switch (24 ports) running IOS. They are typical examples only, so don't use them as instructions. Mirror ports on other Cisco operating systems and other brands of switches are configured differently.

:::image type="content" source="media/how-to-set-up-your-network/span-port-configuration-terminal-v2.png" alt-text="Diagram of a SPAN port configuration terminal.":::
:::image type="content" source="media/how-to-set-up-your-network/span-port-configuration-mode-v2.png" alt-text="Diagram of SPAN port configuration mode.":::

##### Monitoring multiple VLANs

Defender for IoT allows monitoring VLANs configured in your network. No configuration of the Defender for IoT system is required. The user needs to ensure that the switch in your network is configured to send VLAN tags to Defender for IoT.

The following example shows the required commands that must be configured on the Cisco switch to enable monitoring VLANs in Defender for IoT:

**Monitor session**: This command is responsible for the process of sending VLANs to the SPAN port.

- monitor session 1 source interface Gi1/2

- monitor session 1 filter packet type good Rx

- monitor session 1 destination interface fastEthernet1/1 encapsulation dot1q

**Monitor Trunk Port F.E. Gi1/1**: VLANs are configured on the trunk port.

- interface GigabitEthernet1/1

- switchport trunk encapsulation dot1q

- switchport mode trunk

#### Remote SPAN (RSPAN)

The remote SPAN session mirrors traffic from multiple distributed source ports into a dedicated remote VLAN.  

:::image type="content" source="media/how-to-set-up-your-network/remote-span.png" alt-text="Diagram of remote SPAN.":::

The data in the VLAN is then delivered through trunked ports across multiple switches to a specific switch that contains the physical destination port. This port connects to the Defender for IoT platform.  

##### More about RSPAN

- RSPAN is an advanced feature that requires a special VLAN to carry the traffic that SPAN monitors between switches. RSPAN is not supported on all switches. Verify that the switch supports the RSPAN function.

- The mirroring option is disabled by default.

- The remote VLAN must be allowed on the trunked port between the source and destination switches.

- All switches that connect the same RSPAN session must be from the same vendor.

> [!NOTE]
> Make sure that the trunk port that's sharing the remote VLAN between the switches is not defined as a mirror session source port.
>
> The remote VLAN increases the bandwidth on the trunked port by the size of the mirrored session's bandwidth. Verify that the switch's trunk port supports that.  

:::image type="content" source="media/how-to-set-up-your-network/remote-vlan.jpg" alt-text="Diagram of remote VLAN.":::

#### RSPAN configuration examples

RSPAN: Based on Cisco catalyst 2960 (24 ports).

**Source switch configuration example:**

:::image type="content" source="media/how-to-set-up-your-network/rspan-configuration.png" alt-text="Screenshot of RSPAN configuration.":::

1. Enter global configuration mode.

1. Create a dedicated VLAN.

1. Identify the VLAN as the RSPAN VLAN.

1. Return to "configure terminal" mode.

1. Configure all 24 ports as session sources.

1. Configure the RSPAN VLAN to be the session destination.

1. Return to privileged EXEC mode.

1. Verify the port mirroring configuration.

**Destination switch configuration example:**

1. Enter global configuration mode.

1. Configure the RSPAN VLAN to be the session source.

1. Configure physical port 24 to be the session destination.

1. Return to privileged EXEC mode.

1. Verify the port mirroring configuration.

1. Save the configuration.

#### Active and passive aggregation TAP

An active or passive aggregation TAP is installed inline to the network cable. It duplicates both RX and TX to the monitoring sensor.

The terminal access point (TAP) is a hardware device that allows network traffic to flow from port A to port B, and from port B to port A, without interruption. It creates an exact copy of both sides of the traffic flow, continuously, without compromising network integrity. Some TAPs aggregate transmit and receive traffic by using switch settings if desired. If aggregation is not supported, each TAP uses two sensor ports to monitor send and receive traffic.

TAPs are advantageous for various reasons. They're hardware-based and can't be compromised. They pass all traffic, even damaged messages, which switches often drop. They're not processor sensitive, so packet timing is exact where switches handle the mirror function as a low-priority task that can affect the timing of the mirrored packets. For forensic purposes, a TAP is the best device.

TAP aggregators can also be used for port monitoring. These devices are processor-based and are not as intrinsically secure as hardware TAPs. They might not reflect exact packet timing.

:::image type="content" source="media/how-to-set-up-your-network/active-passive-tap-v2.PNG" alt-text="Diagram of active and passive TAPs.":::

##### Common TAP models

These models have been tested for compatibility. Other vendors and models might also be compatible.

| Image | Model |
|--|--|
| :::image type="content" source="media/how-to-set-up-your-network/garland-p1gccas-v2.png" alt-text="Screenshot of Garland P1GCCAS."::: | Garland P1GCCAS |
| :::image type="content" source="media/how-to-set-up-your-network/ixia-tpa2-cu3-v2.png" alt-text="Screenshot of IXIA TPA2-CU3."::: | IXIA TPA2-CU3 |
| :::image type="content" source="media/how-to-set-up-your-network/us-robotics-usr-4503-v2.png" alt-text="Screenshot of US Robotics USR 4503."::: | US Robotics USR 4503 |

##### Special TAP configuration

| Garland TAP | US Robotics TAP |
| ----------- | --------------- |
| Make sure jumpers are set as follows:<br />:::image type="content" source="media/how-to-set-up-your-network/jumper-setup-v2.jpg" alt-text="Screenshot of US Robotics switch.":::| Make sure Aggregation mode is active. |

## Deployment validation

### Engineering self-review  

Reviewing your OT and ICS network diagram is the most efficient way to define the best place to connect to, where you can get the most relevant traffic for monitoring.

The site engineers know what their network looks like. Having a review session with the local network and operational teams will usually clarify expectations and define the best place to connect the appliance.

Relevant information:

- List of known devices (spreadsheet)  

- Estimated number of devices  

- Vendors and industrial protocols

- Model of switches, to verify that port mirroring option is available

- Information about who manages the switches (for example, IT) and whether they're external resources

- List of OT networks at the site

#### Common questions

- What are the overall goals of the implementation? Are a complete inventory and accurate network map important?

- Are there multiple or redundant networks in the ICS? Are all the networks being monitored?

- Are there communications between the ICS and the enterprise (business) network? Are these communications being monitored?

- Are VLANs configured in the network design?

- How is maintenance of the ICS performed, with fixed or transient devices?

- Where are firewalls installed in the monitored networks?

- Is there any routing in the monitored networks?

- What OT protocols are active on the monitored networks?

- If we connect to this switch, will we see communication between the HMI and the PLCs?

- What is the physical distance between the ICS switches and the enterprise firewall? 

- Can unmanaged switches be replaced with managed switches, or is the use of network TAPs an option?

- Is there any serial communication in the network? If yes, show it on the network diagram.

- If the Defender for IoT appliance should be connected to that switch, is there physical available rack space in that cabinet?

#### Other considerations

The purpose of the Defender for IoT appliance is to monitor traffic from layers 1 and 2.

For some architectures, the Defender for IoT appliance will also monitor layer 3, if OT traffic exists on this layer. While you're reviewing the site architecture and deciding whether to monitor a switch, consider the following variables:

- What is the cost/benefit versus the importance of monitoring this switch?

- If a switch is unmanaged, will it be possible to monitor the traffic from a higher-level switch?

  If the ICS architecture is a ring topology, only one switch in this ring needs to be monitored.

- What is the security or operational risk in this network?

- Is it possible to monitor the switch's VLAN? Is that VLAN visible in another switch that we can monitor?

#### Technical validation

Receiving a sample of recorded traffic (PCAP file) from the switch SPAN (or mirror) port can help to:

- Validate if the switch is configured properly.

- Confirm if the traffic that goes through the switch is relevant for monitoring (OT traffic).

- Identify bandwidth and the estimated number of devices in this switch.

You can record a sample PCAP file (a few minutes) by connecting a laptop to an already configured SPAN port through the Wireshark application.

:::image type="content" source="media/how-to-set-up-your-network/laptop-connected-to-span.jpg" alt-text="Screenshot of a laptop connected to a SPAN port.":::
:::image type="content" source="media/how-to-set-up-your-network/sample-pcap-file.PNG" alt-text="Screenshot of the recording of a sample PCAP file.":::

#### Wireshark validation

- Check that *Unicast packets* are present in the recording traffic. Unicast is from one address to another. If most of the traffic is ARP messages, then the switch setup is incorrect.

- Go to **Statistics** > **Protocol Hierarchy**. Verify that industrial OT protocols are present.

:::image type="content" source="media/how-to-set-up-your-network/wireshark-validation.png" alt-text="Screenshot of Wireshark validation.":::

## Troubleshooting

Use these sections for troubleshooting issues:

- [Can't connect by using a web interface](#cant-connect-by-using-a-web-interface)

- [Appliance is not responding](#appliance-is-not-responding)

### Can't connect by using a web interface

1. Verify that the computer that you're trying to connect is on the same network as the appliance.

2. Verify that the GUI network is connected to the management port on the sensor.

3. Ping the appliance IP address. If there is no response to ping:

    1. Connect a monitor and a keyboard to the appliance.

    1. Use the **support** user and password to sign in.

    1. Use the command **network list** to see the current IP address.

    :::image type="content" source="media/how-to-set-up-your-network/list-of-network-commands.png" alt-text="Screenshot of the network list command.":::

4. If the network parameters are misconfigured, use the following procedure to change it:

    1. Use the command **network edit-settings**.

    1. To change the management network IP address, select **Y**.

    1. To change the subnet mask, select **Y**.

    1. To change the DNS, select **Y**.

    1. To change the default gateway IP address, select **Y**.

    1. For the input interface change (for sensor only), select **Y**.

    1. For the bridge interface, select **N**.

    1. To apply the settings, select **Y**.

5. After you restart, connect with user support and use the **network list** command to verify that the parameters were changed.

6. Try to ping and connect from the GUI again.

### Appliance is not responding

1. Connect with a monitor and keyboard to the appliance, or use PuTTY to connect remotely to the CLI.

2. Use the support credentials to sign in.

3. Use the **system sanity** command and check that all processes are running.

    :::image type="content" source="media/how-to-set-up-your-network/system-sanity-command.png" alt-text="Screenshot of the system sanity command.":::

For any other issues, contact [Microsoft Support](https://support.microsoft.com/en-us/supportforbusiness/productselection?sapId=82c88f35-1b8e-f274-ec11-c6efdd6dd099).

## Example site book

Use the example site book to retrieve and review important information that you need for network setup.

### Site checklist

Review this list before site deployment:

| **#** | **Task or activity** | **Status** | **Comments** |
|--|--|--|--|
| 1 | Order appliances. | ☐ |  |
| 2 | Prepare a list of subnets in the network. | ☐ |  |
| 3 | Provide a VLAN list of the production networks. | ☐ |  |
| 4 | Provide a list of switch models in the network. | ☐ |  |
| 5 | Provide a list of vendors and protocols of the industrial equipment. | ☐ |  |
| 6 | Provide network details for sensors (IP address, subnet, D-GW, DNS). | ☐ |  |
| 7 | Create necessary firewall rules and the access list. | ☐ |  |
| 8 | Create spanning ports on switches for port monitoring, or configure network taps as desired. | ☐ |  |
| 9 | Prepare rack space for sensor appliances. | ☐ |  |
| 10 | Prepare a workstation for personnel. | ☐ |  |
| 11 | Provide a keyboard, monitor, and mouse for the Defender for IoT rack devices. | ☐ |  |
| 12 | Rack and cable the appliances. | ☐ |  |
| 13 | Allocate site resources to support deployment. | ☐ |  |
| 14 | Create Active Directory groups or local users. | ☐ |  |
| 15 | Set-up training (self-learning). | ☐ |  |
| 16 | Go or no-go. | ☐ |  |
| 17 | Schedule the deployment date. | ☐ |  |


| **Date** | **Note** | **Deployment date** | **Note** |
|--|--|--|--|
| Defender for IoT |  | Site name* |  |
| Name |  | Name |  |
| Position |  | Position |  |

#### Architecture review

An overview of the industrial network diagram will allow you to define the proper location for the Defender for IoT equipment.

1.  View a global network diagram of the industrial OT environment. For example:

    :::image type="content" source="media/how-to-set-up-your-network/ot-global-network-diagram.png" alt-text="Diagram of the industrial OT environment for the global network.":::

    > [!NOTE]
    > The Defender for IoT appliance should be connected to a lower-level switch that sees the traffic between the ports on the switch.  

2. Provide the approximate number of network devices that will be monitored. You will need this information when onboarding your subscription to the Azure Defender for IoT portal. During the onboarding process, you will be prompted to enter the number of devices in increments of 1000.

3. Provide a subnet list for the production networks and a description (optional). 

    |  **#**  | **Subnet name** | **Description** |
    |--| --------------- | --------------- |
    | 1  | |
    | 2  | |
    | 3  | |
    | 4  | |

4. Provide a VLAN list of the production networks.

    | **#** | **VLAN Name** | **Description** |
    |--|--|--|
    | 1 |  |  |
    | 2 |  |  |
    | 3 |  |  |
    | 4 |  |  |

5. To verify that the switches have port mirroring capability, provide the switch model numbers that the Defender for IoT platform should connect to:

    | **#** | **Switch** | **Model** | **Traffic mirroring support (SPAN, RSPAN, or none)** |
    |--|--|--|--|
    | 1 |  |  |
    | 2 |  |  |
    | 3 |  |  |
    | 4 |  |  |

    Does a third party manage the switches? Y or N 

    If yes, who? __________________________________ 

    What is their policy? __________________________________ 

    For example:

    - Siemens

    - Rockwell automation – Ethernet or IP

    - Emerson – DeltaV, Ovation
    
6. Are there devices that communicate via a serial connection in the network? Yes or No 

    If yes, specify which serial communication protocol: ________________ 

    If yes, mark on the network diagram what devices communicate with serial protocols, and where they are: 
 
    <Add your network diagram with marked serial connection> 

7. For QoS, the default setting of the sensor is 1.5 Mbps. Specify if you want to change it: ________________ 

   Business unit (BU): ________________ 

### Specifications for site equipment

#### Network  

The sensor appliance is connected to switch SPAN port through a network adapter. It's connected to the customer's corporate network for management through another dedicated network adapter.

Provide address details for the sensor NIC that will be connected in the corporate network: 

|  Item               | Appliance 1 | Appliance 2 | Appliance 3 |
| --------------- | ------------- | ------------- | ------------- |
| Appliance IP address    |               |               |               |
| Subnet          |               |               |               |
| Default gateway |               |               |               |
| DNS             |               |               |               |
| Host name       |               |               |               |

#### iDRAC/iLO/Server management

|       Item          | Appliance 1 | Appliance 2 | Appliance 3 |
| --------------- | ------------- | ------------- | ------------- |
| Appliance IP address     |               |               |               |
| Subnet          |               |               |               |
| Default gateway |               |               |               |
| DNS             |               |               |               |

#### On-premises management console  

|       Item          | Active | Passive (when using HA) |
| --------------- | ------ | ----------------------- |
| IP address             |        |                         |
| Subnet          |        |                         |
| Default gateway |        |                         |
| DNS             |        |                         |

#### SNMP  

|   Item              | Details |
| --------------- | ------ |
| IP              |        |
| IP address | |
| Username | |
| Password | |
| Authentication type | MD5 or SHA |
| Encryption | DES or AES |
| Secret key | |
| SNMP v2 community string |

### On-premises management console SSL certificate

Are you planning to use an SSL certificate? Yes or No

If yes, what service will you use to generate it? What attributes will you include in the certificate (for example, domain or IP address)?

### SMTP authentication

Are you planning to use SMTP to forward alerts to an email server? Yes or No

If yes, what authentication method you will use?  

### Active Directory or local users

Contact an Active Directory administrator to create an Active Directory site user group or create local users. Be sure to have your users ready for the deployment day. 

### IoT device types in the network

| Device type | Number of devices in the network | Average bandwidth |
| --------------- | ------ | ----------------------- |
| Camera | |
| X-ray machine | |

## See also

[About the Defender for IoT installation](how-to-install-software.md)
