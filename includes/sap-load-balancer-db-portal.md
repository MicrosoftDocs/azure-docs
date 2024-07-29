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

Follow the steps in [Create load balancer](../articles/load-balancer/quickstart-load-balancer-standard-internal-portal.md#create-load-balancer) to set up a standard load balancer for a high-availability SAP system by using the Azure portal. During the setup of the load balancer, consider the following points:

1. **Frontend IP Configuration:** Create a front-end IP. Select the same virtual network and subnet name as your database virtual machines.
1. **Backend Pool:** Create a back-end pool and add database VMs.
1. **Inbound rules:** Create a load-balancing rule. Follow the same steps for both load-balancing rules.
     - **Frontend IP address**: Select a front-end IP.
     - **Backend pool**: Select a back-end pool.
     - **High-availability ports**: Select this option.
     - **Protocol**: Select **TCP**.
     - **Health Probe**: Create a health probe with the following details:
       - **Protocol**: Select **TCP**.
       - **Port**: For example, **625<instance-no.>**.
       - **Interval**: Enter **5**.
       - **Probe Threshold**: Enter **2**.
     - **Idle timeout (minutes)**: Enter **30**.
     - **Enable Floating IP**: Select this option.

> [!NOTE]
> The health probe configuration property `numberOfProbes`, otherwise known as **Unhealthy threshold** in the portal, isn't respected. To control the number of successful or failed consecutive probes, set the property `probeThreshold` to `2`. It's currently not possible to set this property by using the Azure portal, so use either the [Azure CLI](/cli/azure/network/lb/probe) or the [PowerShell](/powershell/module/az.network/set-azloadbalancerprobeconfig) command.
