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

Follow [create load balancer](../articles/load-balancer/quickstart-load-balancer-standard-internal-portal.md#create-load-balancer) guide to set up a standard load balancer for a high availability SAP system using the Azure portal. During the setup of load balancer, consider following points.

1. **Frontend IP Configuration:** Create two frontend IP, one for ASCS and another for ERS. Select the same virtual network and subnet as your ASCS/ERS virtual machines.
2. **Backend Pool:** Create backend pool and add ASCS and ERS VMs.
3. **Inbound rules:** Create two load balancing rule, one for ASCS and another for ERS. Follow the same steps for both load balancing rules.
     - Frontend IP address: Select frontend IP
     - Backend pool: Select backend pool
     - Check "High availability ports"
     - Protocol: TCP
     - Health Probe: Create health probe with below details (applies for both ASCS or ERS)
       - Protocol: TCP
       - Port: [for example: 620<Instance-no.> for ASCS, 621<Instance-no.> for ERS]
       - Interval: 5
       - Probe Threshold: 2
     - Idle timeout (minutes): 30
     - Check "Enable Floating IP"

> [!NOTE]
>
> Health probe configuration property numberOfProbes, otherwise known as "Unhealthy threshold" in Portal, isn't respected. So to control the number of successful or failed consecutive probes, set the property "probeThreshold" to 2. It is currently not possible to set this property using Azure portal, so use either the [Azure CLI](/cli/azure/network/lb/probe) or [PowerShell](/powershell/module/az.network/set-azloadbalancerprobeconfig) command.
