---
title: Prepare your OT network for Microsoft Defender for IoT
description: Learn about solution architecture, network preparation, prerequisites, and other information needed to ensure that you successfully set up your network to work with Microsoft Defender for IoT appliances.
ms.date: 06/02/2022
ms.topic: how-to
---

# Prepare your OT network for Microsoft Defender for IoT

This article describes how to set up your OT network to work with Microsoft Defender for IoT components, including the OT network sensors, the Azure portal, and an optional on-premises management console.

OT network sensors use agentless, patented technology to discover, learn, and continuously monitor network devices for a deep visibility into OT/ICS/IoT risks. Sensors carry out data collection, analysis, and alerting on-site, making them ideal for locations with low bandwidth or high latency.

This article is intended for personnel experienced in operating and managing OT and IoT networks, such as automation engineers, plant managers, OT network infrastructure service providers, cybersecurity teams, CISOs, and CIOs.

We recommend that you use this article together with our [pre-deployment checklist](pre-deployment-checklist.md).

For assistance or support, contact [Microsoft Support](https://support.microsoft.com/supportforbusiness/productselection?sapId=82c88f35-1b8e-f274-ec11-c6efdd6dd099).

## Prerequisites

Before performing the procedures in this article, make sure you understand your own network architecture and how you'll connect to Defender for IoT. For more information, see:

- [Microsoft Defender for IoT system architecture](architecture.md)
- [Sensor connection methods](architecture-connections.md)
- [Best practices for planning your OT network monitoring](best-practices/plan-network-monitoring.md)

## On-site deployment tasks

Perform the steps in this section before deploying Defender for IoT on your network.

Make sure to perform each step methodologically, requesting the information and reviewing the data you receive. Prepare and configure your site and then validate your configuration.

### Collect site information

Record the following site information:

- Sensor management network information.

- Site network architecture.

- Physical environment.

- System integrations.

- Planned user credentials.

- Configuration workstation.

- TLS/SSL certificates (optional but recommended).

- SMTP authentication (optional). To use the SMTP server with authentication, prepare the credentials required for your server.

- DNS servers (optional). Prepare your DNS server's IP and host name.

### Prepare a configuration workstation

**To prepare a Windows or Mac workstation**:

- Make sure that you can connect to the sensor management interface.

- Make sure that you have terminal software (like PuTTY) or a supported browser. Supported browsers include the latest versions of Microsoft Edge, Chrome, Firefox, or Safari (Mac only).

    For more information, see [recommended browsers for the Azure portal](../../azure-portal/azure-portal-supported-browsers-devices.md#recommended-browsers).

- Make sure the required firewall rules are open on the workstation. Verify that your organizational security policy allows access as required. For more information, see [Networking requirements](#networking-requirements).

### Set up certificates

After you've installed the Defender for IoT sensor or on-premises management console software, a local, self-signed certificate is generated, and used to access the sensor web application.

The first time they sign in to Defender for IoT, administrator users are prompted to provide an SSL/TLS certificate. Optional certificate validation is enabled by default.

We recommend having your certificates ready before you start your deployment. For more information, see [Defender for IoT installation](how-to-install-software.md) and [About Certificates](how-to-deploy-certificates.md).

### Plan rack installation

**To plan your rack installation**:

1. Prepare a monitor and a keyboard for your appliance network settings.

1. Allocate the rack space for the appliance.

1. Have AC power available for the appliance.

1. Prepare the LAN cable for connecting the management to the network switch.

1. Prepare the LAN cables for connecting switch SPAN (mirror) ports and network taps to the Defender for IoT appliance.

1. Configure, connect, and validate SPAN ports in the mirrored switches using one of the following methods:

    |Method  |Description  |
    |---------|---------|
    |[Switch SPAN port](traffic-mirroring/configure-mirror-span.md)     |  Mirror local traffic from interfaces on the switch to a different interface on the same switch.     |
    |[Remote SPAN (RSPAN)](traffic-mirroring/configure-mirror-rspan.md)     | Mirror traffic from multiple, distributed source ports into a dedicated remote VLAN.        |
    |[Active or passive aggregation (TAP)](traffic-mirroring/configure-mirror-tap.md)     |     Mirror traffic by installing an active or passive aggregation terminal access point (TAP) inline to the network cable.     |
    |[ERSPAN](traffic-mirroring/configure-mirror-erspan.md)     |   Mirror traffic with ERSPAN encapsulation when you need to extend monitored traffic across Layer 3 domains, when using specific Cisco routers and switches.      |
    |[ESXi vSwitch](traffic-mirroring/configure-mirror-esxi.md)     |  Use *Promiscuous mode* in a virtual switch environment as a workaround for configuring a monitoring port.       |
    |[Hyper-V vSwitch](traffic-mirroring/configure-mirror-hyper-v.md)     | Use *Promiscuous mode* in a virtual switch environment as a workaround for configuring a monitoring port.      |

    > [!NOTE]
    > SPAN and RSPAN are Cisco terminology. Other brands of switches have similar functionality but might use different terminology.
    >

1. Connect the configured SPAN port to a computer running Wireshark, and verify that the port is configured correctly.

1. Open all the relevant firewall ports.

### Validate your network

After preparing your network, use the guidance in this section to validate whether you're ready to deploy Defender for IoT.

Make an attempt to receive a sample of recorded traffic (PCAP file) from the switch SPAN or mirror port. This sample will:

- Validate if the switch is configured properly.

- Confirm if the traffic that goes through the switch is relevant for monitoring (OT traffic).

- Identify bandwidth and the estimated number of devices in this switch.

For example, you can record a sample PCAP file for a few minutes by connecting a laptop to an already configured SPAN port through the Wireshark application.

**To use Wireshark to validate your network**:

- Check that *Unicast packets* are present in the recording traffic. Unicast is from one address to another. If most of the traffic is ARP messages, then the switch setup is incorrect.

- Go to **Statistics** > **Protocol Hierarchy**. Verify that industrial OT protocols are present.

For example:

:::image type="content" source="media/how-to-set-up-your-network/wireshark-validation.png" alt-text="Screenshot of Wireshark validation.":::

## Networking requirements

Use the following tables to ensure that required firewalls are open on your workstation and verify that your organization security policy allows required access.

### User access to the sensor and management console

| Protocol | Transport | In/Out | Port | Used | Purpose | Source | Destination |
|--|--|--|--|--|--|--|--|
| SSH | TCP | In/Out | 22 | CLI | To access the CLI | Client | Sensor and on-premises management console |
| HTTPS | TCP | In/Out | 443 | To access the sensor, and on-premises management console web console | Access to Web console | Client | Sensor and on-premises management console |

### Sensor access to Azure portal

| Protocol | Transport | In/Out | Port | Purpose | Source | Destination |
|--|--|--|--|--|--|--|
| HTTPS | TCP | Out | 443 | Access to Azure | Sensor |OT network sensors connect to Azure to provide alert and device data and sensor health messages, access threat intelligence packages, and more. Connected Azure services include IoT Hub, Blob Storage, Event Hubs, and the Microsoft Download Center.<br><br>**For OT sensor versions 22.x**: Download the list from the **Sites and sensors** page in the Azure portal. Select an OT sensor with software versions 22.x or higher, or a site with one or more supported sensor versions. Then, select **More options > Download endpoint details**. For more information, see [Sensor management options from the Azure portal](how-to-manage-sensors-on-the-cloud.md#sensor-management-options-from-the-azure-portal).<br><br>**For OT sensor versions 10.x**:  `*.azure-devices.net`<br> `*.blob.core.windows.net`<br> `*.servicebus.windows.net`<br> `download.microsoft.com`|



### Sensor access to the on-premises management console

| Protocol | Transport | In/Out | Port | Used | Purpose | Source | Destination |
|--|--|--|--|--|--|--|--|
| NTP | UDP | In/Out | 123 | Time Sync | Connects the NTP to the on-premises management console | Sensor | On-premises management console |
| TLS/SSL | TCP | In/Out | 443 | Give the sensor access to the on-premises management console. | The connection between the sensor, and the on-premises management console | Sensor | On-premises management console |

### Other firewall rules for external services (optional)

Open these ports to allow extra services for Defender for IoT.

| Protocol | Transport | In/Out | Port | Used | Purpose | Source | Destination |
|--|--|--|--|--|--|--|--|
| SMTP | TCP | Out | 25 | Email | Used to open the customer's mail server, in order to send emails for alerts, and events | Sensor and On-premises management console | Email server |
| DNS | TCP/UDP | In/Out | 53 | DNS | The DNS server port | On-premises management console and Sensor | DNS server |
| HTTP | TCP | Out | 80 | The CRL download for certificate validation when uploading  certificates. | Access to the CRL server | Sensor and on-premises management console | CRL server |
| [WMI](how-to-configure-windows-endpoint-monitoring.md) | TCP/UDP | Out | 135, 1025-65535 | Monitoring | Windows Endpoint Monitoring | Sensor | Relevant network element |
| [SNMP](how-to-set-up-snmp-mib-monitoring.md) | UDP | Out | 161 | Monitoring | Monitors the sensor's health | On-premises management console and Sensor | SNMP server |
| LDAP | TCP | In/Out | 389 | Active Directory | Allows Active Directory management of users that have access, to sign in to the system | On-premises management console and Sensor | LDAP server |
| Proxy | TCP/UDP | In/Out | 443 | Proxy | To connect the sensor to a proxy server | On-premises management console and Sensor | Proxy server |
| Syslog | UDP | Out | 514 | LEEF | The logs that are sent from the on-premises management console to Syslog server | On-premises management console and Sensor | Syslog server |
| LDAPS | TCP | In/Out | 636 | Active Directory | Allows Active Directory management of users that have access, to sign in to the system | On-premises management console and Sensor | LDAPS server |
| Tunneling | TCP | In | 9000 </br></br> In addition to port 443 </br></br> Allows access from the sensor, or end user, to the on-premises management console </br></br> Port 22 from the sensor to the on-premises management console | Monitoring | Tunneling | Endpoint, Sensor | On-premises management console |

## Choose a cloud connection method

If you're setting up OT sensors and connecting them to the cloud, understand supported cloud connection methods, and make sure to connect your sensors as needed.

For more information, see:

- [OT sensor cloud connection methods](architecture-connections.md)
- [Connect your OT sensors to the cloud](connect-sensors.md)

## Troubleshooting

This section provides troubleshooting for common issues when preparing your network for a Defender for IoT deployment.

### Can't connect by using a web interface

1. Verify that the computer you're trying to connect is on the same network as the appliance.

2. Verify that the GUI network is connected to the management port on the sensor.

3. Ping the appliance IP address. If there's no response to ping:

    1. Connect a monitor and a keyboard to the appliance.

    1. Use the **support** user and password to sign in.

    1. Use the command **network list** to see the current IP address.

4. If the network parameters are misconfigured, use the following procedure to change it:

    1. Use the command **network edit-settings**.

    1. To change the management network IP address, select **Y**.

    1. To change the subnet mask, select **Y**.

    1. To change the DNS, select **Y**.

    1. To change the default gateway IP address, select **Y**.

    1. For the input interface change (for sensor only), select **Y**.

    1. For the bridge interface, select **N**.

    1. To apply the settings, select **Y**.

5. After you restart, connect with user support, and use the **network list** command to verify that the parameters were changed.

6. Try to ping and connect from the GUI again.

### Appliance isn't responding

1. Connect with a monitor and keyboard to the appliance, or use PuTTY to connect remotely to the CLI.

2. Use the **support** credentials to sign in.

3. Use the **system sanity** command and check that all processes are running.

    :::image type="content" source="media/how-to-set-up-your-network/system-sanity-command.png" alt-text="Screenshot of the system sanity command.":::

For any other issues, contact [Microsoft Support](https://support.microsoft.com/supportforbusiness/productselection?sapId=82c88f35-1b8e-f274-ec11-c6efdd6dd099).

## Next steps

For more information, see:

- [Predeployment checklist](pre-deployment-checklist.md)
- [Quickstart: Get started with Defender for IoT](getting-started.md)
- [Tutorial: Get started with Microsoft Defender for IoT for OT security](tutorial-onboarding.md)
- [Defender for IoT installation](how-to-install-software.md)
- [Connect your sensors to Microsoft Defender for IoT](connect-sensors.md)
- [Microsoft Defender for IoT system architecture](architecture.md)
- [Sensor connection methods](architecture-connections.md)
