---
title: Quality checks for Azure Large Instances
titleSuffix: Azure Large Instances
description: Provides an overview of Azure Large Instances for Epic quality checks.
ms.topic: conceptual
ms.title: Quality checks
author: jjaygbay1
ms.author: jacobjaygbay
ms.service: azure-large-instances
ms.date: 06/01/2023
---

# Quality checks for Azure Large Instances  
This article provides an overview of Azure Large Instances for Epic<sup>®</sup> quality checks.

The Microsoft operations team performs a series of extensive quality checks to ensure that customers' requests to run Azure Large Instances for Epic are fulfilled accurately, and that infrastructure is healthy before handover.
However, customers are advised to perform their own checks to ensure services have been provided as requested, including the following:

* Basic connectivity  
* Latency check
* Server health check from operating system
* OS level sanity checks / configuration checks

The following sections identify quality checks often performed by Microsoft teams before the infrastructure handover to the customer.

## Network

* IP blade information  
* Access control list on firewall

## Compute  

* Number of processors and cores for servers
* Accuracy of memory size for the assigned server
* Latest firmware version on the blades

## Storage

* Size of boot LUN and FC LUNs are consistent with the Azure Large Instances on Epic  standard configuration
* SAN configuration
* Required VLANs creation

## Operating System

* Accuracy of LUNs

