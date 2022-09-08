---
title: Upgrading a basic Load Balancer
description: Overview of upgrade options and rationale for migrating basic Load Balancer to standard Load Balancer
author: mbender-ms
ms.service: load-balancer
ms.author: mbender
ms.topic: overview
ms.date: 09/08/2022
---

# Upgrading a basic Load Balancer

On September 30, 2025, Basic public IP addresses will be retired. For more information, see the official announcement. If you use Basic SKU public IP addresses, make sure to upgrade to Standard SKU public IP addresses prior to that date. This article will help guide you with the upgrade. 

Steps to complete the upgrade 

We recommend the following approach to upgrade to Standard LB. 

Learn about some of the key differences between Basic LB and Standard LB. 

Identify the Basic LB that you will need to upgrade. 

Create a migration plan for planned downtime. 

Create a new Standard LB with Basic LB configurations or use automated PowerShell scripts 

Verify your application and workloads are receiving traffic through the Standard Load Balancer. Then delete your Basic LB resource. 

## Basic SKU vs. Standard SKU 

This section lists out some key differences between these two Public IP addresses SKUs. 

 
|---| Standard Load Balancer | Basic Load Balancer |
| ---- | ---- | ---- |
| **Backend type** | IP based, NIC based | NIC based |
| **Protocol** | TCP, UDP | TCP, UDP |
| **Frontend IP Configurations** | Supports up to 600 configurations | Supports up to 200 configurations |
| **Backend pool size** | Supports up to 1000 instances | Supports up to 300 instances |
| **Backend pool endpoints** | Any virtual machines or virtual machine scale sets in a single virtual network | Virtual machines in a single availability set or virtual machine scale set |
| **Health probes** | TCP, HTTP, HTTPS | TCP, HTTP |
| **Health probe down behavior** | TCP connections stay alive on an instance probe down and on all probes down | TCP connections stay alive on an instance probe down. All TCP connections end when all probes are down |
| **Availability Zones** | Zone-redundant and zonal frontends for inbound and outbound traffic | Not available |
| **Diagnostics** | Azure Monitor multi-dimensional metrics | Not supported |
| **HA Ports** | Available for Internal Load Balancer | Not available |
| **Secure by default** | Closed to inbound flows unless allowed by a network security group. Internal traffic from the virtual network to the internal load balancer is allowed. | Open by default. Network security group optional. |
| **Outbound Rules** | Declarative outbound NAT configuration | Not available |
| **TCP Reset on Idle** | Available on any rule | Not available |
| **Multiple front ends** | Inbound and outbound | Inbound only |
| **Management Operations** | Most operations < 30 seconds | 60-90+ seconds typical |
| **SLA** | 99.99% | Not available |
| **Global VNet Peering Support** | Standard ILB is supported via Global VNet Peering | Not supported 
| **NAT Gateway Support** | Both Standard ILB and Standard Public LB are supported via Nat Gateway | Not supported |
| **Private Link Support** | Standard ILB is supported via Private Link | Not supported |
| **Global tier (Preview)** | Standard LB supports the Global tier for Public LBs enabling cross-region load balancing | Not supported |

## Upgrade using automated scripts 

Use these PowerShell scripts to help with upgrading from Basic to Standard SKU. 

- [Upgrading a basic to standard public load balancer](upgrade-basic-standard.md)
- [Upgrade from Basic Internal to Standard Internal](upgrade-basicInternal-standard.md)
- [Upgrade an internal basic load balancer - Outbound connections required](upgrade-internalbasic-to-publicstandard.md)