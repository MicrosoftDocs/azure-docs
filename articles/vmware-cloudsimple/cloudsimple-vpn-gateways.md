---
title:  Azure VMware Solution by CloudSimple - VPN gateways
description: Learn about CloudSimple site-to-site and point-to-site VPN gateways, which are used to send encrypted traffic between a CloudSimple region and other resources.
author: sharaths-cs 
ms.author: dikamath 
ms.date: 08/20/2019 
ms.topic: article 
ms.service: azure-vmware-cloudsimple 
ms.reviewer: cynthn 
manager: dikamath 
---
# VPN gateways overview

A VPN gateway is used to send encrypted traffic between a CloudSimple region network at an on-premises location, or a computer over the public internet.  Each region can have one VPN gateway, which can support multiple connections. When you create multiple connections to the same VPN gateway, all VPN tunnels share the available gateway bandwidth.

CloudSimple provides two kinds of VPN gateways:

* Site-to-Site VPN gateway
* Point-to-Site VPN gateway

## Site-to-Site VPN gateway

A Site-to-Site VPN gateway is used to send encrypted traffic between a CloudSimple region network and an on-premises datacenter. Use this connection to define the subnets/CIDR range, for network traffic between your on-premises network and the CloudSimple region network.

The VPN gateway allows you to consume services from on-premises on your Private Cloud, and services on your Private Cloud from the on-premises network.  CloudSimple provides a policy-based VPN server for establishing the connection from your on-premises network.

Use cases for Site-to-Site VPN:

* Accessibility of your Private Cloud vCenter from any workstation in your on-premises network.
* Use of your on-premises Active Directory as a vCenter identity source.
* Convenient transfer of VM templates, ISOs, and other files from your on-premises resources to your Private Cloud vCenter.
* Accessibility of workloads running on your Private Cloud from your on-premises network.

![Site-to-Site VPN connection topology](media/cloudsimple-site-to-site-vpn-connection.png)

### Cryptographic parameters

A Site-to-Site VPN connection uses the following default cryptographic parameters to establish a secure connection.  When you create a connection from your on-premises VPN device, use any of the following parameters that are supported by your on-premises VPN gateway.

#### Phase 1 proposals

| Parameter | Proposal 1 | Proposal 2 | Proposal 3 |
|-----------|------------|------------|------------|
| IKE Version | IKEv1 | IKEv1 | IKEv1 |
| Encryption | AES 128 | AES 256 | AES 256 |
| Hash Algorithm| SHA 256 | SHA 256 | SHA 1 |
| Diffie Hellman Group (DH Group) | 2 | 2 | 2 |
| Life Time | 28,800 seconds | 28,800 seconds | 28,800 seconds |
| Data Size | 4 GB | 4 GB | 4 GB |

#### Phase 2 proposals

| Parameter | Proposal 1 | Proposal 2 | Proposal 3 |
|-----------|------------|------------|------------|
| Encryption | AES 128 | AES 256 | AES 256 |
| Hash Algorithm| SHA 256 | SHA 256 | SHA 1 |
| Perfect Forward Secrecy Group (PFS Group) | None | None | None |
| Life Time | 1,800 seconds | 1,800 seconds | 1,800 seconds |
| Data Size | 4 GB | 4 GB | 4 GB |


> [!IMPORTANT]
> Set TCP MSS Clamping at 1200 on your VPN device. Or if your VPN devices do not support MSS clamping, you can alternatively set the MTU on the tunnel interface to 1240 bytes instead.

## Point-to-Site VPN gateway

A Point-to-Site VPN is used to send encrypted traffic between a CloudSimple region network and a client computer.  Point-to-Site VPN is the easiest way to access your Private Cloud network, including your Private Cloud vCenter and workload VMs.  Use Point-to-Site VPN connectivity if you're connecting to the Private Cloud remotely.

## Next steps

* [Set up VPN gateway](vpn-gateway.md)
