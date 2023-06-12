---
title: Quality checks
description: Provides an overview of Azure Large Instances for Epic quality checks.
ms.topic: conceptual
author: jjaygbay
ms.author: jacobjaygbay
ms.service: baremetal-infrastructure
ms.date: 06/01/2023
---

# Quality checks

Microsoft operations team performs a series of extensive quality checks to ensure that customers request to run Epic systems on Azure ALI is fulfilled accurately, and infrastructure is healthy before handover.
However, customers are advised to perform their own checks to ensure services are provided as requested. 
This article identifies recommended checks.  

* Basic connectivity  
* Latency check
* Server health check from operating system
* OS level sanity checks / configuration checks

Quality checks often performed by Microsoft teams before the infrastructure handover to the customer include checks in the areas that follow.

## Network

* IP blade information  
* Access control list on firewall

## Compute  

* Number of processors and cores for servers.
* Accuracy of memory size for the assigned server.
* Latest firmware version on the blades.  

## Storage

* Size of boot LUN and FC LUNs are as per Epic on Azure Large Instances standard configuration.
* SAN configuration.
* Required VLANs creation.

## Operating System

* Accuracy of LUNs

## Next steps

Learn how to identify and interact with ALI instances through the Azure portal.

> [!div class="nextstepaction"]
> [What is Azure for Large Instances?](../../what-is-azure-for-large-instances.md)