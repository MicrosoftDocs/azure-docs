---
title: "Tutorial: Protect your public load balancer using DDoS Protection Standard"
titleSuffix: Azure Load Balancer
description: This tutorial shows how to protect protect your public load balancer using DDoS Protection Standard.
author: mbender-ms
ms.service: load-balancer
ms.topic: quickstart
ms.date: 12/19/2022
ms.author: mbender
---

# Tutorial: Protect your public load balancer using DDoS Protection Standard

DDoS Protection can help defend your public Azure Load Balancers from DDoS attacks. 

For more information about Azure DDoS Protection, see 

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Create a DDoS Protection plan.
> * Create a virtual network with DDoS Protection and Bastion enabled.
> * Create a standard SKU public load balancer with frontend IP, health probe, backend configuration, and load-balancing rule.
> * Create a NAT gateway for outbound internet access for the backend pool.
> * Create virtual machine, then install and configure IIS on the VMs to demonstrate the port forwarding and load-balancing rules.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.