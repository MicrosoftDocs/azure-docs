---
title: "Azure Operator Nexus: Before you start platform deployment prerequisites"
description: Learn the prerequisite steps for deploying the Operator Nexus platform software.
author: surajmb
ms.author: surmb
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 03/13/2023
ms.custom: template-how-to
---

# Operator Nexus platform prerequisites

Operators need to complete the prerequisites before the deploy of the
Operator Nexus platform software. Some of these steps may take
extended amounts of time, thus, a review of these prerequisites may prove beneficial.

In subsequent deployments of Operator Nexus instances, you can skip to creating the on-premises
[Network Fabric](./howto-configure-network-fabric.md) and the [Cluster](./howto-configure-cluster.md). 

## Azure prerequisites

When deploying Operator Nexus for the first time or in a new region,
you'll first need to create a Network Fabric Controller and then a Cluster Manager as specified [here](./howto-azure-operator-nexus-prerequisites.md). Additionally, the following tasks need to be accomplished:
- Set up users, policies, permissions, and RBAC
- Set up Resource Groups to place and group resources in a logical manner
  that will be created for Operator Nexus platform.
- Establish ExpressRoute connectivity from your WAN to an Azure Region
- To enable Microsoft Defender for Endpoint for on-premises bare metal machines (BMMs), you must have selected a Defender for Servers plan in your Operator Nexus subscription before deployment. Additional information available [here](./howto-set-up-defender-for-cloud-security.md).

## On your premises prerequisites

When deploying Operator Nexus on-premises instance in your datacenter, various teams are likely involved performing various roles. The following tasks must be performed accurately in order to ensure a successful platform software installation.

### Physical hardware setup

An operator that wishes to take advantage of the Operator Nexus service needs to
purchase, install, configure, and operate hardware resources. This section of
the document describes the necessary components and efforts to purchase and implement the appropriate hardware systems. This section discusses the bill of materials, the rack elevations diagram and the cabling diagram, and the steps required to assemble the hardware.

#### Using the Bill of Materials (BOM)

To ensure a seamless operator experience, Operator Nexus has developed a BOM for the hardware acquisition necessary for the service. This BOM is a comprehensive list of the necessary components and quantities needed to implement the environment for a successful implementation and maintenance of the on-premises instance. The BOM is structured to provide the operator with a series of stock keeping units (SKU) that can be ordered from hardware vendors. SKUs is discussed later in the document.

#### Using the elevation diagram

The rack elevation diagram is a graphical reference that demonstrates how the
servers and other components fit into the assembled and configured racks. The
rack elevation diagram is provided as part of the overall build instructions. It will help the operators staff to correctly configure and install all of the hardware components necessary for service operation.

#### Cabling diagram

Cabling diagrams are graphical representations of the cable connections that are required to provide network services to components installed within the racks. Following the cabling diagram ensures proper implementation of the various components in the build.

### How to order based on SKU

#### SKU definition

A SKU is an inventory management and tracking method
that allows grouping of multiple components into a single designator. A SKU
allows an operator to order all needed components with through specify one SKU
number. The SKU expedites the operator and vendor interaction while reducing
ordering errors because of complex parts lists.

#### Placing a SKU-based order

Operator Nexus has created a series of SKUs with vendors such as Dell, Pure
Storage and Arista that the operator can reference when they place
an order. Thus, an operator simply needs to place an order based on the SKU
information provided by Operator Nexus to the vendor to receive the correct
parts list for the build.

### How to build the physical hardware footprint

The physical hardware build is executed through a series of steps, which will be detailed in this section.
There are three prerequisite steps before the build execution. This section will also discuss assumptions
concerning the skills of the operator's employees to execute the build.

#### Ordering and receipt of the specific hardware infrastructure SKU

The ordering of the appropriate SKU and delivery of hardware to the site must occur before the
start of building. Adequate time should be allowed for this step. We recommend the operator
communicate with the supplier of the hardware early in the process to ensure and understand
delivery timeframes.

#### Site preparation

The installation site can support the hardware infrastructure from a space, power,
and network perspective. The specific site requirements will be defined by the SKU purchased for the
site. This step can be accomplished after the order is placed and before the receipt of the
SKU.

#### Scheduling resources

The build process requires several different staff members to perform the
build, such as engineers to provide power, network access and cabling, systems
staff to assemble the racks, switches, and servers, to name a few. To ensure that the
build is accomplished in a timely manner, we recommend scheduling these team members
in advance based on the delivery schedule.

#### Assumptions about build staff skills

The staff performing the build should be experienced at assembling systems
hardware such as racks, switches, PDUs, and servers. The instructions provided will discuss
the steps of the process, while referencing rack elevations and cabling diagrams.

#### Build process overview

If the site preparation is complete and validated to support the ordered SKU,
the build process occurs in the following steps:

1. Assemble the racks based on the rack elevations of the SKU. Specific rack assembly
instructions will be provided by the rack manufacturer.
1. After the racks are assembled, install the fabric devices in the racks per the elevation diagram.
1. Cable the fabric devices by connecting the network interfaces per the cabling diagram.
1. Assemble and install the servers per rack elevation diagram.
1. Assemble and install the storage device per rack elevation diagram.
1. Cable the server and storage devices by connecting the network interfaces per the cabling diagram.
1. Cable power from each device.
1. Review/validate the build through the checklists provided by Operator Nexus and other vendors.

#### How to visually inspect the physical hardware installation

It's recommended to label on all cables following ANSI/TIA 606 Standards,
or the operator's standards, during the build process. The build process
should also create reverse mapping for cabling from a switch port to far end
connection. The reverse mapping can be compared to the cabling diagram to
validate the installation.

## Terminal Server and storage array setup

Now that the physical installation and validation has completed, the next steps involved configuring up the default settings required before platform software installation.

### Set up Terminal Server

Terminal Server has been deployed and configured as follows:
  - Terminal Server is configured for Out-of-Band management
    - Authentication credentials have been set up
    - DHCP client is enabled on the out-of-band management port
    - HTTP access is enabled
  - Terminal Server interface is connected to the operators on-premises Provider Edge routers (PEs) and configured with the IP addresses and credentials
  - Terminal Server is accessible from the management VPN

### Step 1: Setting up hostname

To set up the hostname for your terminal server, follow these steps:

Use the following command in the CLI:

```bash
sudo ogcli update system/hostname hostname=\"$TS_HOSTNAME\"
```

**Parameters:**

| Parameter Name | Description               |
| -------------- | ------------------------- |
| TS_HOSTNAME    | Terminal server hostname  |

[Refer to CLI Reference](https://opengear.zendesk.com/hc/articles/360044253292-Using-the-configuration-CLI-ogcli-) for more details.

### Step 2: Setting up network

To configure network settings, follow these steps:

Execute the following commands in the CLI:

```bash
sudo ogcli create conn << 'END'
  description="PE1 to TS NET1"
  mode="static"
  ipv4_static_settings.address="$TS_NET1_IP"
  ipv4_static_settings.netmask="$TS_NET1_NETMASK"
  ipv4_static_settings.gateway="$TS_NET1_GW"
  physif="net1"
  END
sudo ogcli create conn << 'END'
  description="PE2 to TS NET2"
  mode="static"
  ipv4_static_settings.address="$TS_NET2_IP"
  ipv4_static_settings.netmask="$TS_NET2_NETMASK"
  ipv4_static_settings.gateway="$TS_NET2_GW"
  physif="net2"
  END
```

**Parameters:**

| Parameter Name  | Description                                     |
| --------------- | ----------------------------------------------- |
| TS_NET1_IP      | Terminal server PE1 to TS NET1 IP               |
| TS_NET1_NETMASK | Terminal server PE1 to TS NET1 netmask          |
| TS_NET1_GW      | Terminal server PE1 to TS NET1 gateway          |
| TS_NET2_IP      | Terminal server PE2 to TS NET2 IP               |
| TS_NET2_NETMASK | Terminal server PE2 to TS NET2 netmask          |
| TS_NET2_GW      | Terminal server PE2 to TS NET2 gateway          |

>[!NOTE]
>Make sure to replace these parameters with appropriate values.

### Step 3: Clearing net3 interface (if existing)

To clear the net3 interface, follow these steps:

1. Check for any interface configured on the physical interface net3 and "Default IPv4 Static Address" using the following command:
   
```bash
ogcli get conns 
**description="Default IPv4 Static Address"**
**name="$TS_NET3_CONN_NAME"**
**physif="net3"**
```

**Parameters:**

| Parameter Name    | Description                              |
| ----------------- | ---------------------------------------- |
| TS_NET3_CONN_NAME | Terminal server NET3 Connection name     |

2. Remove the interface if it exists:
   
```bash
ogcli delete conn "$TS_NET3_CONN_NAME"
```

>[!NOTE]
>Make sure to replace these parameters with appropriate values.

### Step 4: Setting up support admin user

To set up the support admin user, follow these steps:

1. For each user, execute the following command in the CLI:
   
```bash
ogcli create user << 'END'
description="Support Admin User"
enabled=true
groups[0]="admin"
groups[1]="netgrp"
hashed_password="$HASHED_SUPPORT_PWD"
username="$SUPPORT_USER"
END
```

**Parameters:**

| Parameter Name     | Description                            |
| ------------------ | -------------------------------------- |
| SUPPORT_USER       | Support admin user                     |
| HASHED_SUPPORT_PWD | Encoded support admin user password    |

>[!NOTE]
>Make sure to replace these parameters with appropriate values.

### Step 5: Adding sudo support for admin users

To add sudo support for admin users, follow these steps:

1. Open the sudoers configuration file:

```bash
sudo vi /etc/sudoers.d/opengear
```

2. Add the following lines to grant sudo access:

```bash
%netgrp ALL=(ALL) ALL
%admin ALL=(ALL) NOPASSWD: ALL
```

>[!NOTE]
>Make sure to save the changes after editing the file.

This configuration allows members of the "netgrp" group to execute any command as any user and members of the "admin" group to execute any command as any user without requiring a password.

### Step 6: Ensuring LLDP service availability

To ensure the LLDP service is available on your terminal server, follow these steps:

Check if the LLDP service is running:

```bash
sudo systemctl status lldpd
```

You should see output similar to the following if the service is running:

```Output
lldpd.service - LLDP daemon
   Loaded: loaded (/lib/systemd/system/lldpd.service; enabled; vendor preset: disabled)
   Active: active (running) since Thu 2023-09-14 19:10:40 UTC; 3 months 25 days ago
     Docs: man:lldpd(8)
 Main PID: 926 (lldpd)
    Tasks: 2 (limit: 9495)
   Memory: 1.2M
   CGroup: /system.slice/lldpd.service
           ├─926 lldpd: monitor.
           └─992 lldpd: 3 neighbors.
Notice: journal has been rotated since unit was started, output may be incomplete.
```

If the service isn't active (running), start the service:

```bash
sudo systemctl start lldpd
```

Enable the service to start on reboot:

```bash
sudo systemctl enable lldpd
```

>[!NOTE]
>Make sure to perform these steps to ensure the LLDP service is always available and starts automatically upon reboot.

### Step 7: Checking system date/time

Ensure that the system date/time is correctly set, and the timezone for the terminal server is in UTC.

#### Check timezone setting:

To check the current timezone setting:

```bash
ogcli get system/timezone
```

#### Set timezone to UTC:

If the timezone is not set to UTC, you can set it using:

```bash
ogcli update system/timezone timezone=\"UTC\"
```

#### Check current date/time:

Check the current date and time:

```bash
date
```

#### Fix date/time if incorrect:

If the date/time is incorrect, you can fix it using:

```bash
ogcli replace system/time
Reading information from stdin. Press Ctrl-D to submit and Ctrl-C to cancel.
time="$CURRENT_DATE_TIME"
```

**Parameters:**

| Parameter Name     | Description                                   |
| ------------------ | --------------------------------------------- |
| CURRENT_DATE_TIME  | Current date time in format hh:mm MMM DD, YYYY |

>[!NOTE]
>Ensure the system date/time is accurate to prevent any issues with applications or services relying on it.

### Step 8: Labeling Terminal Server ports (if missing/incorrect)

To label Terminal Server ports, use the following command:

```bash
ogcli update port "port-<PORT_#>"  label=\"<NEW_NAME>\"	<PORT_#>
```

**Parameters:**

| Parameter Name  | Description                 |
| ----------------| --------------------------- |
| NEW_NAME        | Port label name             |
| PORT_#          | Terminal Server port number |

### Step 9: Settings required for PURE Array serial connections

For configuring PURE Array serial connections, use the following commands:

```bash
ogcli update port ports-<PORT_#> 'baudrate="115200"' <PORT_#> Pure Storage Controller console
ogcli update port ports-<PORT_#> 'pinout="X1"' <PORT_#>	Pure Storage Controller console
```

**Parameters:**

| Parameter Name  | Description                 |
| ----------------| --------------------------- |
| PORT_#          | Terminal Server port number |

These commands set the baudrate and pinout for connecting to the Pure Storage Controller console.

### Step 10: Verifying settings

To verify the configuration settings, execute the following commands:

```bash
ping $PE1_IP -c 3  # Ping test to PE1 //TS subnet +2
ping $PE2_IP -c 3  # Ping test to PE2 //TS subnet +2
ogcli get conns     # Verify NET1, NET2, NET3 Removed
ogcli get users     # Verify support admin user
ogcli get static_routes  # Ensure there are no static routes
ip r                # Verify only interface routes
ip a                # Verify loopback, NET1, NET2
date                # Check current date/time
pmshell             # Check ports labelled

sudo lldpctl
sudo lldpcli show neighbors  # Check LLDP neighbors - should show data from NET1 and NET2
```

>[!NOTE]
>Ensure that the LLDP neighbors are as expected, indicating successful connections to PE1 and PE2.

Example LLDP neighbors output:

```Output
-------------------------------------------------------------------------------
LLDP neighbors:
-------------------------------------------------------------------------------
Interface:    net2, via: LLDP, RID: 2, Time: 0 day, 20:28:36
  Chassis:     
    ChassisID:    mac 12:00:00:00:00:85
    SysName:      austx502xh1.els-an.att.net
    SysDescr:     7.7.2, S9700-53DX-R8
    Capability:   Router, on
  Port:         
    PortID:       ifname TenGigE0/0/0/0/3
    PortDescr:    GE10_Bundle-Ether83_austx4511ts1_net2_net2_CircuitID__austxm1-AUSTX45_[CBB][MCGW][AODS]
    TTL:          120
-------------------------------------------------------------------------------
Interface:    net1, via: LLDP, RID: 1, Time: 0 day, 20:28:36
  Chassis:     
    ChassisID:    mac 12:00:00:00:00:05
    SysName:      austx501xh1.els-an.att.net
    SysDescr:     7.7.2, S9700-53DX-R8
    Capability:   Router, on
  Port:         
    PortID:       ifname TenGigE0/0/0/0/3
    PortDescr:    GE10_Bundle-Ether83_austx4511ts1_net1_net1_CircuitID__austxm1-AUSTX45_[CBB][MCGW][AODS]
    TTL:          120
-------------------------------------------------------------------------------
```

>[!NOTE]
>Verify that the output matches your expectations and that all configurations are correct.

## Set up storage array

1. Operator needs to install the storage array hardware as specified by the BOM and rack elevation within the Aggregation Rack.
2. Operator needs to provide the storage array Technician with information, in order for the storage array Technician to arrive on-site to configure the appliance.
3. Required location-specific data that is shared with storage array technician:
   - Customer Name:
   - Physical Inspection Date:
   - Chassis Serial Number:
   - Storage array Array Hostname:
   - CLLI code (Common Language location identifier):
   - Installation Address:
   - FIC/Rack/Grid Location:
4. Data provided to the operator and shared with storage array technician, which will be common to all installations:
   - Purity Code Level: 6.5.1
   - Safe Mode: Disabled
   - Array Time zone: UTC
   - DNS (Domain Name System) Server IP Address: 172.27.255.201
   - DNS Domain Suffix: not set by operator during setup
   - NTP (Network Time Protocol) Server IP Address or FQDN: 172.27.255.212
   - Syslog Primary: 172.27.255.210
   - Syslog Secondary: 172.27.255.211
   - SMTP Gateway IP address or FQDN: not set by operator during setup
   - Email Sender Domain Name: domain name of the sender of the email (example.com)
   - Email Addresses to be alerted: not set by operator during setup
   - Proxy Server and Port: not set by operator during setup
   - Management: Virtual Interface
     - IP Address: 172.27.255.200
     - Gateway: 172.27.255.1
     - Subnet Mask: 255.255.255.0
     - MTU: 1500
     - Bond: not set by operator during setup
   - Management: Controller 0
     - IP Address: 172.27.255.254
     - Gateway: 172.27.255.1
     - Subnet Mask: 255.255.255.0
     - MTU: 1500
     - Bond: not set by operator during setup
   - Management: Controller 1
     - IP Address: 172.27.255.253
     - Gateway: 172.27.255.1
     - Subnet Mask: 255.255.255.0
     - MTU: 1500
     - Bond: not set by operator during setup
   - VLAN Number / Prefix: 43
   - ct0.eth10: not set by operator during setup
   - ct0.eth11: not set by operator during setup
   - ct0.eth18: not set by operator during setup
   - ct0.eth19: not set by operator during setup
   - ct1.eth10: not set by operator during setup
   - ct1.eth11: not set by operator during setup
   - ct1.eth18: not set by operator during setup
   - ct1.eth19: not set by operator during setup
   - Pure Tunable to be applied:
     - puretune -set PS_ENFORCE_IO_ORDERING 1 "PURE-209441";
     - puretune -set PS_STALE_IO_THRESH_SEC 4 "PURE-209441";
     - puretune -set PS_LANDLORD_QUORUM_LOSS_TIME_LIMIT_MS 0 "PURE-209441";
     - puretune -set PS_RDMA_STALE_OP_THRESH_MS 5000 "PURE-209441";
     - puretune -set PS_BDRV_REQ_MAXBUFS 128 "PURE-209441";

## iDRAC IP Assignment

Before deploying the Nexus Cluster, it’s best for the operator to set the iDRAC IPs while organizing the hardware racks. Here’s how to map servers to IPs:

   - Assign IPs based on each server’s position within the rack.
   - Use the fourth /24 block from the /19 subnet allocated for Fabric.
   - Start assigning IPs from the bottom server upwards in each rack, beginning with 0.11.
   - Continue to assign IPs in sequence to the first server at the bottom of the next rack.

### Example

Fabric range: 10.1.0.0-10.1.31.255 – iDRAC subnet at fourth /24 is 10.1.3.0/24.

   | Rack   | Server        | iDRAC IP      |
   |--------|---------------|---------------|
   | Rack 1 | Worker 1      | 10.1.3.11/24  |
   | Rack 1 | Worker 2      | 10.1.3.12/24  |
   | Rack 1 | Worker 3      | 10.1.3.13/24  |
   | Rack 1 | Worker 4      | 10.1.3.14/24  |
   | Rack 1 | Worker 5      | 10.1.3.15/24  |
   | Rack 1 | Worker 6      | 10.1.3.16/24  |
   | Rack 1 | Worker 7      | 10.1.3.17/24  |
   | Rack 1 | Worker 8      | 10.1.3.18/24  |
   | Rack 1 | Controller 1  | 10.1.3.19/24  |
   | Rack 1 | Controller 2  | 10.1.3.20/24  |
   | Rack 2 | Worker 1      | 10.1.3.21/24  |
   | Rack 2 | Worker 2      | 10.1.3.22/24  |
   | Rack 2 | Worker 3      | 10.1.3.23/24  |
   | Rack 2 | Worker 4      | 10.1.3.24/24  |
   | Rack 2 | Worker 5      | 10.1.3.25/24  |
   | Rack 2 | Worker 6      | 10.1.3.26/24  |
   | Rack 2 | Worker 7      | 10.1.3.27/24  |
   | Rack 2 | Worker 8      | 10.1.3.28/24  |
   | Rack 2 | Controller 1  | 10.1.3.29/24  |
   | Rack 2 | Controller 2  | 10.1.3.30/24  |
   | Rack 3 | Worker 1      | 10.1.3.31/24  |
   | Rack 3 | Worker 2      | 10.1.3.32/24  |
   | Rack 3 | Worker 3      | 10.1.3.33/24  |
   | Rack 3 | Worker 4      | 10.1.3.34/24  |
   | Rack 3 | Worker 5      | 10.1.3.35/24  |
   | Rack 3 | Worker 6      | 10.1.3.36/24  |
   | Rack 3 | Worker 7      | 10.1.3.37/24  |
   | Rack 3 | Worker 8      | 10.1.3.38/24  |
   | Rack 3 | Controller 1  | 10.1.3.39/24  |
   | Rack 3 | Controller 2  | 10.1.3.40/24  |
   | Rack 4 | Worker 1      | 10.1.3.41/24  |
   | Rack 4 | Worker 2      | 10.1.3.42/24  |
   | Rack 4 | Worker 3      | 10.1.3.43/24  |
   | Rack 4 | Worker 4      | 10.1.3.44/24  |
   | Rack 4 | Worker 5      | 10.1.3.45/24  |
   | Rack 4 | Worker 6      | 10.1.3.46/24  |
   | Rack 4 | Worker 7      | 10.1.3.47/24  |
   | Rack 4 | Worker 8      | 10.1.3.48/24  |
   | Rack 4 | Controller 1  | 10.1.3.49/24  |
   | Rack 4 | Controller 2  | 10.1.3.50/24  |

An example design of three on-premises instances from the same NFC/CM pair, using sequential /19 networks in a /16:

   | Instance   | Fabric Range            | iDRAC subnet |
   |------------|-------------------------|--------------|
   | Instance 1 | 10.1.0.0-10.1.31.255    | 10.1.3.0/24  |
   | Instance 2 | 10.1.32.0-10.1.63.255   | 10.1.35.0/24 |
   | Instance 3 | 10.1.64.0-10.1.95.255   | 10.1.67.0/24 | 

### Default setup for other devices installed

- All network fabric devices (except for the Terminal Server) are set to `ZTP` mode
- Servers have default factory settings

## Firewall rules between Azure to Nexus Cluster.

To establish firewall rules between Azure and the Nexus Cluster, the operator must open the specified ports. This ensures proper communication and connectivity for required services using TCP (Transmission Control Protocol) and UDP (User Datagram Protocol).

| S.No | Source                 | Destination           | Port (TCP/UDP)  | Bidirectional  | Rule Purpose                                             |
|------|------------------------|-----------------------|-----------------|----------------|----------------------------------------------------------|
| 1    | Azure virtual network  | Cluster               | 22 TCP          | No             | For SSH to undercloud servers from the CM subnet.        |
| 2    | Azure virtual network  | Cluster               | 443 TCP         | No             | To access undercloud nodes iDRAC                         |
| 3    | Azure virtual network  | Cluster               | 5900 TCP        | No             | Gnmi                                                     |
| 4    | Azure virtual network  | Cluster               | 6030 TCP        | No             | Gnmi Certs                                               |
| 5    | Azure virtual network  | Cluster               | 6443 TCP        | No             | To access undercloud K8S cluster                         |
| 6    | Cluster                | Azure virtual network | 8080 TCP        | Yes            | For mounting ISO image into iDRAC, NNF runtime upgrade   |
| 7    | Cluster                | Azure virtual network | 3128 TCP        | No             | Proxy to connect to global Azure endpoints               |
| 8    | Cluster                | Azure virtual network | 53 TCP and UDP  | No             | DNS                                                      |
| 9    | Cluster                | Azure virtual network | 123 UDP         | No             | NTP                                                      |
| 10   | Cluster                | Azure virtual network | 8888 TCP        | No             | Connecting to Cluster Manager webservice                 |
| 11   | Cluster                | Azure virtual network | 514 TCP and UDP | No             | To access undercloud logs from the Cluster Manager       |


## Install CLI extensions and sign-in to your Azure subscription

Install latest version of the
[necessary CLI extensions](./howto-install-cli-extensions.md).

### Azure subscription sign-in

```azurecli
  az login
  az account set --subscription $SUBSCRIPTION_ID
  az account show
```

>[!NOTE]
>The account must have permissions to read/write/publish in the subscription
