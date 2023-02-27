---
title: "Operator Nexus: Platform deployment pre-requisites"
description: Learn the prerequisite steps for deploying the Operator Nexus platform software.
author: surajmb #Required; your GitHub user alias, with correct capitalization.
ms.author: surmb #Required; microsoft alias of author; optional team alias.
ms.service: azure #Required; service per approved list. slug assigned by ACOM.
ms.topic: quickstart #Required; leave this attribute/value as-is.
ms.date: 01/26/2023 #Required; mm/dd/yyyy format.
ms.custom: template-quickstart #Required; leave this attribute/value as-is.
---

# Quickstart: deploy Operator Nexus platform software prerequisites

You'll need to complete the prerequisites before you can deploy the
Operator Nexus platform software. Some of these steps may take
weeks to months and, thus, a review of these prerequisites may prove beneficial.

In subsequent deployments of Operator Nexus instances, you can skip to creating the on-premises
network fabric and the cluster. An instance of Network fabric Controller can support up to 32
Operator Nexus instances.

## Prerequisites

You need to be familiar with the Operator Nexus [key features](./overview.md#key-features)
and [platform components](./concepts-resource-types.md).

The prerequisite activities have been split among activities you'll perform in Azure and on
your premises that may require some data gathering.

### Azure prerequisites

- When deploying Operator Nexus for the first time or in a new region,
you'll first need to create a Network fabric Controller and then a (Network Cloud) Cluster Manager as specified [here](./quickstart-network-fabric-controller-cluster-manager-create.md).
- Set up users, policies, permissions, and RBAC
- Set up Resource Groups to place and group resources in a logical manner
  that will be created for Operator Nexus platform.
- Set up Key Vault to store encryption and security tokens, service principals,
  passwords, certificates, and API keys
- Set up Log Analytics workSpace (LAW) to store logs and analytics data for
  Operator Nexus sub-components (Fabric, Cluster, etc.)
- Set up Azure Storage account to store Operator Nexus data objects:
  - Azure Storage supports blobs and files accessible from anywhere in the world over HTTP or HTTPS
  - this storage is not for user/consumer data.

### On your premises prerequisites

- Purchase and install hardware:
  - Purchase the hardware as specified in the BOM provided to you
  - Perform the physical installation (EF&I)
  - Cable as per the BOM including the cabling to your WAN via a pair of PE devices.
- All network fabric devices (except for the Terminal Server (TS)) are set to ZTP mode
- Servers and Storage devices have default factory settings
- Establish ExpressRoute connectivity from your WAN to an Azure Region
- Terminal Server has been [deployed and configured](#set-up-terminal-server)
  - Terminal Server is configured for Out-of-Band management
    - Authentication credentials have been set up
    - DHCP client is enabled on the out-of-band management port, and
    - HTTP access is enabled
  - Terminal Server Interface is connected to your on-premises Provider Edge routers (PEs) and configured with the IP addresses and credentials
  - Terminal Server is accessible from the management VPN
- For the [Network fabric configuration](./quickstarts-platform-deployment.md#step-1-create-network fabric) (to be performed later)
  you'll need to provide:
  - ExpressRoute credentials and information
  - Terminal Server IPs and credentials
  - [optional] IP prefix for the Network
    Fabric Controller (NFC) subnet during its creation; the default IPv4 and IPv6
    prefix are `10.0.0.0/19` and `FC00:/59`, respectively
  - [optional] IP prefix for the Operator Nexus
    Management plane during NFC creation.
    By default, `10.1.0.0/19` and, `FC00:0000:0000:100::/59`
    IPv4 and IPv6 prefix, respectively, are used for subnets in the management plane for the first
    Operator Nexus instance. Prefix range `10.1.0.0/19` to `10.4.224.0/19` and
    `FC00:0000:0000:100::/59` to `FC00:0000:0000:4e0::/59` are used for
    the 32 instances of Operator Nexus supported for each NFC instance.

## Set up terminal server

1. Setup Hostname:
   [CLI Reference](https://opengear.zendesk.com/hc/articles/360044253292-Using-the-configuration-CLI-ogcli-)

   ```bash
   sudo ogcli update system/hostname hostname=\"$TS_HOSTNAME\"
   ```

   | Parameter name | Description                  |
   | -------------- | ---------------------------- |
   | TS_HOSTNAME    | The terminal server hostname |

2. Setup Network:

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
     physif="net1"
     END
   ```

   | Parameter name  | Description                                |
   | --------------- | ------------------------------------------ |
   | TS_NET1_IP      | The terminal server PE1 to TS NET1 IP      |
   | TS_NET1_NETMASK | The terminal server PE1 to TS NET1 netmask |
   | TS_NET1_GW      | The terminal server PE1 to TS NET1 gateway |
   | TS_NET2_IP      | The terminal server PE1 to TS NET2 IP      |
   | TS_NET2_NETMASK | The terminal server PE1 to TS NET2 netmask |
   | TS_NET2_GW      | The terminal server PE1 to TS NET2 gateway |

3. Setup Support Admin User:

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
   | SUPPORT_USER       | Support User                        |
   | HASHED_SUPPORT_PWD | Encoded Support Admin user password |

4. Verify settings:

```bash
 ping $PE1_IP -c 3  # Ping test to PE1
 ping $PE2_IP -c 3 # Ping test to PE2
 ogcli get conns # verify NET1, NET2
 ogcli get users # verify Support Admin User
 ogcli get static_routes # There should be no static routes
 ip r # verify only interface routes
 ip a # verify loopback, NET1, NET2
```

## Set up Pure storage

1. Operator needs to install the Pure hardware as specified by the BOM and rack elevation within the Aggregation Rack.
2. Operator will need to provide the Pure Technician with information, in order for the Pure Technician to arrive on-site to configure the appliance.
3. Required location-specific data that will be shared with Pure Technician:
   - Customer Name:
   - Physical Inspection Date:
   - Chassis Serial Number:
   - Pure Array Hostname:
   - CLLI code (Common Language location identifier):
   - Installation Address:
   - FIC/Rack/Grid Location:
4. Data provided to the Operator and shared with Pure Technician, which will be common to all installations:
   - Purity Code Level: 6.1.14
   - Array Time zone: UTC
   - DNS Server IP Address: 172.27.255.201
   - DNS Domain Suffix: not set by Operator during setup
   - NTP Server IP Address or FQDN: 172.27.255.212
   - Syslog Primary: 172.27.255.210
   - Syslog Secondary: 172.27.255.211
   - SMTP Gateway IP address or FQDN: not set by Operator during setup
   - Email Sender Domain Name: not set by Operator during setup
   - Email Address(es) to be alerted: not set by Operator during setup
   - Proxy Server and Port: not set by Operator during setup
   - Management: Virtual Interface
     - IP Address: 172.27.255.200
     - Gateway: 172.27.255.1
     - Subnet Mask: 255.255.255.0
     - MTU: 1500
     - Bond: not set by Operator during setup
   - Management: Controller 0
     - IP Address: 172.27.255.254
     - Gateway: 172.27.255.1
     - Subnet Mask: 255.255.255.0
     - MTU: 1500
     - Bond: not set by Operator during setup
   - Management: Controller 1
     - IP Address: 172.27.255.253
     - Gateway: 172.27.255.1
     - Subnet Mask: 255.255.255.0
     - MTU: 1500
     - Bond: not set by Operator during setup
   - VLAN Number / Prefix: 43
   - ct0.eth10: not set by Operator during setup
   - ct0.eth11: not set by Operator during setup
   - ct0.eth18: not set by Operator during setup
   - ct0.eth19: not set by Operator during setup
   - ct1.eth10: not set by Operator during setup
   - ct1.eth11: not set by Operator during setup
   - ct1.eth18: not set by Operator during setup
   - ct1.eth19: not set by Operator during setup

## Install CLI Extensions and sign-in to your Azure subscription

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
