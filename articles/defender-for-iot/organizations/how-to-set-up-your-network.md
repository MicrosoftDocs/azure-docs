---
title: Set up your network
description: Learn about solution architecture, network preparation, prerequisites, and other information needed to ensure that you successfully set up your network to work with Microsoft Defender for IoT appliances.
ms.date: 02/22/2022
ms.topic: how-to
---

# About Microsoft Defender for IoT network setup

This article describes how to set up your network to work with Microsoft Defender for IoT components, including the network sensors, the Azure portal, and an on-premises management console. This article is intended for personnel experienced in operating and managing OT and IoT networks, such as automation engineers, plant managers, OT network infrastructure service providers, cybersecurity teams, CISOs, and CIOs.

For more information, see [Microsoft Defender for IoT system architecture](architecture.md) and [Sensor connection methods](architecture-connections.md).

For assistance or support, contact [Microsoft Support](https://support.microsoft.com/supportforbusiness/productselection?sapId=82c88f35-1b8e-f274-ec11-c6efdd6dd099).

## On-site deployment tasks

On-site deployment tasks include:

- [Collect site information](#collect-site-information)

- [Prepare a configuration workstation](#prepare-a-configuration-workstation)

- [Set up Certificates](#set-up-certificates)

- [Prepare a configuration workstation](#prepare-a-configuration-workstation)

- [Plan rack installation](#plan-rack-installation)

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

For a detailed list and description of important site information, see [Predeployment checklist](#predeployment-checklist).

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

- Microsoft Edge (latest version)

- Safari (latest version, Mac only)

- Chrome (latest version)

- Firefox (latest version)

For more information on supported browsers, see [recommended browsers](../../azure-portal/azure-portal-supported-browsers-devices.md#recommended-browsers).

### Set up certificates

Following sensor and on-premises management console installation, a local self-signed certificate is generated and used to access the sensor web application. When signing in to Defender for IoT for the first time, Administrator users are prompted to provide an SSL/TLS certificate. In addition, an option to validate to this certificate  as well other system certificates is automatically is enabled. See [About Certificates](how-to-deploy-certificates.md) for details.

### Network access requirements

Verify that your organizational security policy allows access to the following:

#### User access to the sensor and management console

| Protocol | Transport | In/Out | Port | Used | Purpose | Source | Destination |
|--|--|--|--|--|--|--|--|
| SSH | TCP | In/Out | 22 | CLI | To access the CLI. | Client | Sensor and on-premises management console |
| HTTPS | TCP | In/Out | 443 | To access the sensor, and on-premises management console web console. | Access to Web console | Client | Sensor and on-premises management console |

#### Sensor access to Azure portal

| Protocol | Transport | In/Out | Port | Purpose | Source | Destination |
|--|--|--|--|--|--|--|
| HTTPS | TCP | Out | 443 | Access to Azure | Sensor |  `*.azure-devices.net`<br> `*.blob.core.windows.net`<br> `*.servicebus.windows.net` |

#### Sensor access to the on-premises management console

| Protocol | Transport | In/Out | Port | Used | Purpose | Source | Destination |
|--|--|--|--|--|--|--|--|
| NTP | UDP | In/Out | 123 | Time Sync | Connects the NTP to the on-premises management console. | Sensor | On-premises management console |
| SSL | TCP | In/Out | 443 | Give the sensor access to the on-premises management console. | The connection between the sensor, and the on-premises management console | Sensor | On-premises management console |

#### Additional firewall rules for external services (optional)

Open these ports to allow extra services for Defender for IoT.

| Protocol | Transport | In/Out | Port | Used | Purpose | Source | Destination |
|--|--|--|--|--|--|--|--|
| SMTP | TCP | Out | 25 | Email | Used to open the customer's mail server, in order to send emails for alerts, and events. | Sensor and On-premises management console | Email server |
| DNS | TCP/UDP | In/Out | 53 | DNS | The DNS server port. | On-premises management console and Sensor | DNS server |
| HTTP | TCP | Out | 80 | The CRL download for certificate validation when uploading  certificates. | Access to the CRL server | Sensor and on-premises management console | CRL server |
| [WMI](how-to-configure-windows-endpoint-monitoring.md) | TCP/UDP | Out | 135, 1025-65535 | Monitoring | Windows Endpoint Monitoring. | Sensor | Relevant network element |
| [SNMP](how-to-set-up-snmp-mib-monitoring.md) | UDP | Out | 161 | Monitoring | Monitors the sensor's health. | On-premises management console and Sensor | SNMP server |
| LDAP | TCP | In/Out | 389 | Active Directory | Allows Active Directory management of users that have access, to log in to the system. | On-premises management console and Sensor | LDAP server |
| Proxy | TCP/UDP | In/Out | 443 | Proxy | To connect the sensor to a proxy server | On-premises management console and Sensor | Proxy server |
| Syslog | UDP | Out | 514 | LEEF | The logs that are sent from the on-premises management console to Syslog server. | On-premises management console and Sensor | Syslog server |
| LDAPS | TCP | In/Out | 636 | Active Directory | Allows Active Directory management of users that have access, to log in to the system. | On-premises management console and Sensor | LDAPS server |
| Tunneling | TCP | In | 9000 </br></br> in addition to port 443 </br></br> Allows access from the sensor, or end user, to the on-premises management console. </br></br> Port 22 from the sensor to the on-premises management console. | Monitoring | Tunneling | Endpoint, Sensor | On-premises management console |

### Plan rack installation

To plan your rack installation:

1. Prepare a monitor and a keyboard for your appliance network settings.

1. Allocate the rack space for the appliance.

1. Have AC power available for the appliance.

1. Prepare the LAN cable for connecting the management to the network switch.

1. Prepare the LAN cables for connecting switch SPAN (mirror) ports, and network taps to the Defender for IoT appliance.

1. Configure, connect, and validate SPAN ports in the mirrored switches as described in the architecture review session.

1. Connect the configured SPAN port to a computer running Wireshark and verify that the port is configured correctly.

1. Open all the relevant firewall ports.


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

## Predeployment checklist

Use the predeployment checklist to retrieve and review important information that you need for network setup.

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
| 7 | Third-party switch management | ☐ |  |
| 8 | Create necessary firewall rules and the access list. | ☐ |  |
| 9 | Create spanning ports on switches for port monitoring, or configure network taps as desired. | ☐ |  |
| 10 | Prepare rack space for sensor appliances. | ☐ |  |
| 11 | Prepare a workstation for personnel. | ☐ |  |
| 12 | Provide a keyboard, monitor, and mouse for the Defender for IoT rack devices. | ☐ |  |
| 13 | Rack and cable the appliances. | ☐ |  |
| 14 | Allocate site resources to support deployment. | ☐ |  |
| 15 | Create Active Directory groups or local users. | ☐ |  |
| 16 | Set up training (self-learning). | ☐ |  |
| 17 | Go or no-go. | ☐ |  |
| 18 | Schedule the deployment date. | ☐ |  |


| **Date** | **Note** | **Deployment date** | **Note** |
|--|--|--|--|
| Defender for IoT |  | Site name* |  |
| Name |  | Name |  |
| Position |  | Position |  |

#### Architecture review

An overview of the industrial network diagram will allow you to define the proper location for the Defender for IoT equipment.

1. **Global network diagram** - View a global network diagram of the industrial OT environment. For example:

    :::image type="content" source="media/how-to-set-up-your-network/backbone-switch.png" alt-text="Diagram of the industrial OT environment for the global network.":::

    > [!NOTE]
    > The Defender for IoT appliance should be connected to a lower-level switch that sees the traffic between the ports on the switch.  

1. **Committed devices** - Provide the approximate number of network devices that will be monitored. You will need this information when onboarding your subscription to Defender for IoT in the Azure portal. During the onboarding process, you will be prompted to enter the number of devices in increments of 1000.

1. **(Optional) Subnet list** - Provide a subnet list for the production networks and a description (optional).

    |  **#**  | **Subnet name** | **Description** |
    |--| --------------- | --------------- |
    | 1  | |
    | 2  | |
    | 3  | |
    | 4  | |

1. **VLANs** - Provide a VLAN list of the production networks.

    | **#** | **VLAN Name** | **Description** |
    |--|--|--|
    | 1 |  |  |
    | 2 |  |  |
    | 3 |  |  |
    | 4 |  |  |

1. **Switch models and mirroring support** - To verify that the switches have port mirroring capability, provide the switch model numbers that the Defender for IoT platform should connect to:

    | **#** | **Switch** | **Model** | **Traffic mirroring support (SPAN, RSPAN, or none)** |
    |--|--|--|--|
    | 1 |  |  |
    | 2 |  |  |
    | 3 |  |  |
    | 4 |  |  |

1. **Third-party switch management** - Does a third party manage the switches? Y or N 

    If yes, who? __________________________________ 

    What is their policy? __________________________________ 

    For example:

    - Siemens

    - Rockwell automation – Ethernet or IP

    - Emerson – DeltaV, Ovation

1. **Serial connection** - Are there devices that communicate via a serial connection in the network? Yes or No

    If yes, specify which serial communication protocol: ________________

    If yes, mark on the network diagram what devices communicate with serial protocols, and where they are:

    *Add your network diagram with marked serial connection*

1. **Quality of Service** - For Quality of Service (QoS), the default setting of the sensor is 1.5 Mbps. Specify if you want to change it: ________________

   Business unit (BU): ________________

1. **Sensor** - Specifications for site equipment

    The sensor appliance is connected to switch SPAN port through a network adapter. It's connected to the customer's corporate network for management through another dedicated network adapter.

    Provide address details for the sensor NIC that will be connected in the corporate network:

    | Item | Appliance 1 | Appliance 2 | Appliance 3 |
    |--|--|--|--|
    | Appliance IP address |  |  |  |
    | Subnet |  |  |  |
    | Default gateway |  |  |  |
    | DNS |  |  |  |
    | Host name |  |  |  |

1. **iDRAC/iLO/Server management**

    | Item | Appliance 1 | Appliance 2 | Appliance 3 |
    |--|--|--|--|
    | Appliance IP address |  |  |  |
    | Subnet |  |  |  |
    | Default gateway |  |  |  |
    | DNS |  |  |  |

1. **On-premises management console**

    | Item | Active | Passive (when using HA) |
    |--|--|--|
    | IP address |  |  |
    | Subnet |  |  |
    | Default gateway |  |  |
    | DNS |  |  |

1. **SNMP**  

    | Item | Details |
    |--|--|
    | IP |  |
    | IP address |  |
    | Username |  |
    | Password |  |
    | Authentication type | MD5 or SHA |
    | Encryption | DES or AES |
    | Secret key |  |
    | SNMP v2 community string |

1. **On-premises management console SSL certificate**

    Are you planning to use an SSL certificate? Yes or No

    If yes, what service will you use to generate it? What attributes will you include in the certificate (for example, domain or IP address)?

1. **SMTP authentication**

    Are you planning to use SMTP to forward alerts to an email server? Yes or No

    If yes, what authentication method you will use?  

1. **Active Directory or local users**

    Contact an Active Directory administrator to create an Active Directory site user group or create local users. Be sure to have your users ready for the deployment day.

1. IoT device types in the network

    | Device type | Number of devices in the network | Average bandwidth |
    | --------------- | ------ | ----------------------- |
    | Camera | |
    | X-ray machine | |
    |  |  |
    |  |  |
    |  |  |
    |  |  |
    |  |  |
    |  |  |
    |  |  |
    |  |  |

## Next steps

[About the Defender for IoT installation](how-to-install-software.md)
