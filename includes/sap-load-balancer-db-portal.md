---
title: include file
description: include file
services: load-balancer
ms.service: sap-on-azure
ms.topic: include
ms.date: 01/24/2024
author: dennispadia
ms.author: depadia
---

Follow the steps in the [Create load balancer](../articles/load-balancer/quickstart-load-balancer-standard-internal-portal.md#create-load-balancer) guide to set up a standard load balancer for a high-availability SAP system by using the Azure portal. During the setup of the load balancer, consider the following points:

1. **Front-end IP configuration:** Create a front-end IP. Select the same virtual network and subnet same as your database virtual machines.
1. **Back-end pool:** Create a back-end pool and add database VMs.
1. **Inbound rules:** Create a load-balancing rule. Follow the same steps for both load-balancing rules.
     - **Frontend IP address**: Select a front-end IP.
     - **Backend pool**: Select a back-end pool.
     - **High-availability ports**: Select this option.
     - **Protocol**: TCP
     - **Health probe**: Create a health probe with the following details:
       - **Protocol**: TCP
       - **Port**: [for example: 625<instance-no.>]
       - **Interval**: 5
       - **Probe threshold**: 2
     - **Idle timeout (minutes)**: 30
     - **Enable Floating IP**: Select this option.

> [!NOTE]
>
> The health probe configuration property `numberOfProbes`, otherwise known as "Unhealthy threshold" in the portal, isn't respected. To control the number of successful or failed consecutive probes, set the property `probeThreshold` to 2. It's currently not possible to set this property by using the Azure portal, so use either the [Azure CLI](/cli/azure/network/lb/probe) or a [PowerShell](/powershell/module/az.network/set-azloadbalancerprobeconfig) command.
