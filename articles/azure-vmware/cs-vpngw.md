---
title: CloudSimple VPN gateways 
description: Learn about CloudSimple site-to-site VPN and point-to-site VPN concepts 
author: sharaths-cs 
ms.author: dikamath 
ms.date: 4/2/19 
ms.topic: article 
ms.service: vmware 
ms.reviewer: cynthn 
manager: dikamath 
---
# VPN gateways overview

A VPN gateway is used to send encrypted traffic between a CloudSimple region network at an on-premises location or a computer over the public Internet.  Each region can have only one VPN gateway. However, you can create multiple connections to the same VPN gateway. When you create multiple connections to the same VPN gateway, all VPN tunnels share the available gateway bandwidth.

CloudSimple provides two kinds of VPN gateways:

* Site-to-site VPN Gateway
* Point-to-site VPN Gateway

## Site-to-site VPN gateway

A site-to-site VPN gateway is used to send encrypted traffic between a CloudSimple region network and an on-premises datacenter.  A connection allows you to define the subnets/CIDR range that can send and receive network traffic from your on-premises network to the CloudSimple region network.  The VPN gateway allows you to consume services from on-premises on your Private Cloud and services on your Private Cloud from the on-premises network.  CloudSimple provides a policy-based VPN server for establishing connection from your on-premises network.

Use cases for site-to-site VPN include:

* Accessibility of your Private Cloud vCenter from any workstation in your on-premises network.
* Use of your on-premises Active Directory as a vCenter identity source.
* Convenient transfer of VM templates, ISOs, and other files from your on-premises resources to your Private Cloud vCenter.
* Accessibility of workloads running on your Private Cloud from your on-premises network.

### Cryptographic Parameters

A site-to-site VPN connection uses the following default cryptographic parameters to establish a secure connection.  When you create a connection from on-premises VPN device, the parameters must match.

#### Phase 1

| Parameter | Value |
|-----------|-------|
| IKE Version | IKEv1 |
| Encryption | AES 256 |
| Hash Algorithm| SHA 256 |
| Diffie Hellman Group (DH Group) | 1 |
| Life Time | 86,400 seconds |
| Data Size | 4 GB |

#### Phase 2

| Parameter | Value |
|-----------|-------|
| Encryption | AES 256 |
| Hash Algorithm| SHA 256 |
| Perfect Forward Secrecy Group (PFS Group) | None |
| Life Time | 28,800 seconds |
| Data Size | 4 GB |

## Point-to-site VPN gateway

A point-to-site VPN is used to send encrypted traffic between a CloudSimple region network and a client computer.  Point-to-site VPN is the easiest way to access your Private Cloud network, including your Private Cloud vCenter and workload VMs.  Use point-to-site VPN connectivity if you are connecting to the Private Cloud remotely.