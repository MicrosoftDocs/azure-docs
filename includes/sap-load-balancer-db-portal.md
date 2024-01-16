---
title: include file
description: include file
services: load-balancer
ms.service: sap-on-azure
ms.topic: include
ms.date: 01/10/2024
author: dennispadia
ms.author: depadia
---

Follow [create load balancer](https://learn.microsoft.com/azure/load-balancer/quickstart-load-balancer-standard-internal-portal#create-load-balancer) guide to set up a standard load balancer for a high availability SAP system using the Azure portal. During the set up of load balancer, follow below consideration.

1. **Frontend IP Configuration:** Create frontend IP. Select the same virtual network and subnet as that of your ASCS/ERS virtual machines.
2. **Backend Pool:** Create backend pool and add DB VMs.
3. **Inbound rules:** Create load balancing rule. Follow the same steps for both load balancing rules.
     - Frontend IP address: Select frontend IP
     - Backend pool: Select backend pool
     - Check "High availability ports"
     - Protocol: TCP
           - Health Probe: Create health probe with below details
             - Protocol: TCP
             - Port: [eg: 625<instance-no.>]
             - Interval: 5
     - Idle timeout (minutes): 30
     - Check "Enable Floating IP"

> [!NOTE]
>
> Health probe configuration property numberOfProbes, otherwise known as "Unhealthy threshold" in Portal, isn't respected. So to control the number of successful or failed consecutive probes, set the property "probeThreshold" to 2. It is currently not possible to set this property using Azure portal, so use either the [Azure CLI](https://learn.microsoft.com/cli/azure/network/lb/probe?view=azure-cli-latest) or [PowerShell](https://learn.microsoft.com/powershell/module/az.network/new-azloadbalancerprobeconfig?view=azps-11.1.0) command.
