---
title: "Azure Operator Nexus: Before you start platform deployment pre-requisites"
description: Learn the prerequisite steps for deploying the Operator Nexus platform software.
author: surajmb
ms.author: surmb
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 03/13/2023
ms.custom: template-how-to
---

# Operator Nexus platform prerequisites

Operators will need to complete the prerequisites before the deploy of the
Operator Nexus platform software. Some of these steps may take
extended amounts of time, thus, a review of these prerequisites may prove beneficial.

In subsequent deployments of Operator Nexus instances, you can skip to creating the on-premises
[Network Fabric](./howto-configure-network-fabric.md) and the [Cluster](./howto-configure-cluster.md). 

## Azure prerequisites

When deploying Operator Nexus for the first time or in a new region,
you'll first need to create a Network Fabric Controller and then a Cluster Manager as specified [here](./howto-azure-operator-nexus-prerequisites.md). Additionally, the following tasks will need to be accomplished:
- Set up users, policies, permissions, and RBAC
- Set up Resource Groups to place and group resources in a logical manner
  that will be created for Operator Nexus platform.
- Establish ExpressRoute connectivity from your WAN to an Azure Region

## On your premises prerequisites

When deploying Operator Nexus on-premises instance in your datacenter, various teams are likely involved to perform a variety of roles. The following tasks must be performed accurately in order to ensure a successful platform software installation.

### Physical hardware setup

An operator that wishes to take advantage of the Operator Nexus service will need to
purchase, install, configure, and operate hardware resources. This section of
the document will describe the necessary components and efforts to purchase and implement the appropriate hardware systems. This section will discuss the bill of materials, the rack elevations diagram and the cabling diagram, as well as the steps required to assemble the hardware.

#### Using the Bill of Materials (BOM)

To ensure a seamless operator experience, Operator Nexus has developed a BOM for the hardware acquisition necessary for the service. This BOM is a comprehensive list of the necessary components and quantities needed to implement the environment for a successful implementation and maintenance of the on-premises instance. The BOM is structured to provide the operator with a series of stock keeping units (SKU) that can be ordered from hardware vendors. SKUs will be discussed later in the document.

#### Using the elevation diagram

The rack elevation diagram is a graphical reference that demonstrates how the
servers and other components fit into the assembled and configured racks. The
rack elevation diagram is provided as part of the overall build instructions and will help the operators staff to correctly configure and install all of the hardware components necessary for service operation.

#### Cabling diagram

Cabling diagrams are graphical representations of the cable connections that are required to provide network services to components installed within the racks. Following the cabling diagram ensures proper implementation of the various components in the build.

### How to order based on SKU

#### SKU definition

A SKU is an inventory management and tracking method
that allows grouping of multiple components into a single designator. A SKU
allows an operator to order all needed components with through specify one SKU
number. This expedites the operator and vendor interaction while reducing
ordering errors due to complex parts lists.

#### Placing a SKU based order

Operator Nexus has created a series of SKUs with vendors such as Dell, Pure
Storage and Arista that the operator will be able to reference when they place
an order. Thus, an operator simply needs to place an order based on the SKU
information provided by Operator Nexus to the vendor to receive the correct
parts list for the build.

### How to build the physical hardware footprint

The physical hardware build is executed through a series of steps which will be detailed in this section.
There are three prerequisite steps prior to the build execution. This section will also discuss assumptions
concerning the skills of the operator's employees to execute the build.

#### Ordering and receipt of the specific hardware infrastructure SKU

The ordering of the appropriate SKU and delivery of hardware to the site must occur before the
start of building. Adequate time should be allowed for this step. We recommend the operator
communicate with the supplier of the hardware early in the process to ensure and understand
delivery timeframes.

#### Site preparation

The installation site must be capable of supporting the hardware infrastructure from a space, power,
and network perspective. The specific site requirements will be defined by the SKU purchased for the
site. This step can be accomplished after the order is placed and before the receipt of the
SKU.

#### Scheduling resources

The build process will require several different staff members to perform the
build, such as engineers to provide power, network access and cabling, systems
staff to assemble the racks, switches, and servers, to name a few. To ensure that the
build is accomplished in a timely manner, we recommend scheduling these team members
in advance based on the delivery schedule.

#### Assumptions regarding build staff skills

The staff performing the build should be experienced at assembling systems
hardware such as racks, switches, PDUs and servers. The instructions provided will discuss
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

It is recommended to label on all cables following ANSI/TIA 606 Standards,
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

1. Setup hostname:
   [CLI Reference](https://opengear.zendesk.com/hc/articles/360044253292-Using-the-configuration-CLI-ogcli-)

   ```bash
   sudo ogcli update system/hostname hostname=\"$TS_HOSTNAME\"
   ```

   | Parameter name | Description                  |
   | -------------- | ---------------------------- |
   | TS_HOSTNAME    | The terminal server hostname |

2. Setup network:

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

   | Parameter name  | Description                                |
   | --------------- | ------------------------------------------ |
   | TS_NET1_IP      | The terminal server PE1 to TS NET1 IP      |
   | TS_NET1_NETMASK | The terminal server PE1 to TS NET1 netmask |
   | TS_NET1_GW      | The terminal server PE1 to TS NET1 gateway |
   | TS_NET2_IP      | The terminal server PE2 to TS NET2 IP      |
   | TS_NET2_NETMASK | The terminal server PE2 to TS NET2 netmask |
   | TS_NET2_GW      | The terminal server PE2 to TS NET2 gateway |

3. Setup support admin user:

   For each port
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

   | Parameter name     | Description                         |
   | ------------------ | ----------------------------------- |
   | SUPPORT_USER       | Support admin user                        |
   | HASHED_SUPPORT_PWD | Encoded support admin user password |

4. Verify settings:

```bash
 ping $PE1_IP -c 3  # ping test to PE1
 ping $PE2_IP -c 3 # ping test to PE2
 ogcli get conns # verify NET1, NET2
 ogcli get users # verify support admin user
 ogcli get static_routes # there should be no static routes
 ip r # verify only interface routes
 ip a # verify loopback, NET1, NET2
```

## Set up storage array

1. Operator needs to install the storage array hardware as specified by the BOM and rack elevation within the Aggregation Rack.
2. Operator will need to provide the storage array Technician with information, in order for the storage array Technician to arrive on-site to configure the appliance.
3. Required location-specific data that will be shared with storage array technician:
   - Customer Name:
   - Physical Inspection Date:
   - Chassis Serial Number:
   - Storage array Array Hostname:
   - CLLI code (Common Language location identifier):
   - Installation Address:
   - FIC/Rack/Grid Location:
4. Data provided to the operator and shared with storage array technician, which will be common to all installations:
   - Purity Code Level: 6.1.14
   - Array Time zone: UTC
   - DNS Server IP Address: 172.27.255.201
   - DNS Domain Suffix: not set by operator during setup
   - NTP Server IP Address or FQDN: 172.27.255.212
   - Syslog Primary: 172.27.255.210
   - Syslog Secondary: 172.27.255.211
   - SMTP Gateway IP address or FQDN: not set by operator during setup
   - Email Sender Domain Name: domain name of the sender of the email (example.com)
   - Email Address(es) to be alerted: List of emails where email alerts will be sent. (someone@example.com)
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

### Default setup for other devices installed

- All network fabric devices (except for the Terminal Server) are set to `ZTP` mode
- Servers have default factory settings

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
