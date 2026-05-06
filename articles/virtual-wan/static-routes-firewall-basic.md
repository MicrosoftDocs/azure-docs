---
title: 'Basic static route scenarios with Azure Firewall in Virtual WAN'
titleSuffix: Azure Virtual WAN
description: Learn about common static route scenarios that use Azure Firewall in an Azure Virtual WAN hub.
author: wtnlee
ms.service: azure-virtual-wan
ms.topic: concept-article
ms.date: 04/27/2026
ms.author: wellee
ms.custom:
---

# Static routes with Azure Firewall in Virtual WAN

This article describes basic static route scenarios that send Virtual WAN traffic to Azure Firewall in the virtual hub.

## Overview

This document summarizes basic scenarios for routing Virtual WAN traffic to Azure Firewall using static routes. The document **doesn't cover** [routing intent](how-to-routing-policies.md).

The document also contains notes on how [Azure Firewall Manager configures routing in Virtual WAN](../firewall-manager/secure-cloud-network.md). There are two configurable routing modes in Azure Firewall Manager:
* **Inter-hub set to off**: Utilizes static routes to direct traffic to Azure Firewall within the local Virtual Hub **without** routing intent. This configuration is covered by this document.
* **Inter-hub set to on**: Enables [routing intent](how-to-routing-policies.md) on the Virtual WAN hub. This configuration is **not** covered by this document.

## Private traffic inspection: Branch-to-Virtual Network and Virtual Network-to-Virtual Network via Azure Firewall

> [!NOTE]
> In this configuration, Azure Firewall Manager configures the defaultRouteTable to have a static route named **private_traffic**.

### Traffic patterns

* Private (Virtual Network and on-premises) inspected by Azure Firewall.

### Configuration

Connection routing properties:

| Connection type | Associated route table | Propagated route table | 
|--|--|--|
| Branch connections | defaultRouteTable | noneRouteTable | 
| Virtual network connections | defaultRouteTable | noneRouteTable | 

### Virtual WAN route table: defaultRouteTable

>[!NOTE]
> If any of your private networks utilize non-RFC1918 address spaces, ensure that the corresponding address ranges are included in the **private_traffic** static route so that traffic destined for those networks is correctly routed to Azure Firewall for inspection.

| Destination Prefix | Next Hop |
|--|--|
| 10.0.0.0/8, 192.168.0.0/16, 172.16.0.0/12 | Azure Firewall in the local hub |

## Internet traffic inspection by Azure Firewall

> [!NOTE]
> In this configuration, Azure Firewall Manager expects the defaultRouteTable to have a single static route named **internet_traffic**. Additionally, a Virtual WAN connection learns the default route (0.0.0.0/0) if the Enable Internet Security setting or Propagate default route setting is set to **true**. Azure Firewall Manager uses this setting to display whether a connection's internet traffic is **secured**.

### Traffic patterns

* Internet traffic is inspected by Azure Firewall.
* Private traffic (between on-premises and Virtual Networks) is **not** inspected by Azure Firewall.


### Configuration

| Connection type | Associated route table | Propagated route table(s) | Propagated route labels |
|--|--|--|--|
| Branch connections | defaultRouteTable | defaultRouteTable | - |
| Virtual network connections | defaultRouteTable | defaultRouteTable | - |

### Virtual WAN route table: defaultRouteTable

| Destination Prefix | Next Hop |
|--|--|
| 0.0.0.0/0 | Azure Firewall in the local hub |

## Private and Internet traffic inspection

> [!NOTE]
> In this configuration, Azure Firewall Manager expects the defaultRouteTable to have a single static route named **all_traffic**.

To ensure inter-hub and branch-to-branch traffic is inspected by Azure Firewall, use [routing intent and policies](how-to-routing-policies.md).

### Traffic patterns

* Private (between on-premises and Virtual Networks) traffic is inspected by Azure Firewall.
* Internet traffic is inspected by Azure Firewall.
* Branch-to-branch traffic is **not** inspected by Azure Firewall.

### Configuration

| Connection type | Associated route table | Propagated route table(s) |
|--|--|--|
| Branch connections | defaultRouteTable | none |
| Virtual network connections | defaultRouteTable | none |

### Virtual WAN route table: defaultRouteTable

> [!NOTE]
> In this configuration, Azure Firewall Manager expects the defaultRouteTable to have a single static route named **all_traffic**.

| Destination Prefix | Next Hop |
|--|--|
| 10.0.0.0/8, 192.168.0.0/16, 172.16.0.0/12, 0.0.0.0/0 | Azure Firewall in the local hub |

## Local hub inspection with inter-hub routed directly

To ensure inter-hub traffic is inspected by Azure Firewall, use [routing intent and policies](how-to-routing-policies.md).

### Traffic patterns

* Inter-hub traffic bypasses Azure Firewall (routed directly) via Virtual WAN hub. 
* Local (same-hub) traffic between Virtual Networks and on-premises inspected by Azure Firewall.
* Internet traffic uses the local Azure Firewall for inspection and breakout.

> [!NOTE]
> Use Virtual WAN route table labels to group hubs across the Virtual WAN to reduce operational complexity. This network design is **not** configurable via Azure Firewall Manager.


### Configuration Hub 1

| Connection type | Associated route table | Propagated route table(s) | Propagated route labels |
|--|--|--|--|
| Branch connections | defaultRouteTable | defaultRouteTable (Hub 2) | - |
| Virtual network connections | defaultRouteTable | defaultRouteTable (Hub 2) | - |

### Virtual WAN route table Hub 1: defaultRouteTable

| Destination Prefix | Next Hop |
|--|--|
|  10.0.0.0/8, 192.168.0.0/16, 172.16.0.0/12, 0.0.0.0/0 | Azure Firewall in Hub 1 |

### Configuration Hub 2

| Connection type | Associated route table | Propagated route table(s) | Propagated route labels |
|--|--|--|--|
| Branch connections | defaultRouteTable | defaultRouteTable (Hub 1) | - |
| Virtual network connections | defaultRouteTable | defaultRouteTable (Hub 1) | - |

### Virtual WAN route table Hub 2: defaultRouteTable

| Destination Prefix | Next Hop |
|--|--|
|  10.0.0.0/8, 192.168.0.0/16, 172.16.0.0/12, 0.0.0.0/0 | Azure Firewall in Hub 2 |