---
title: What is Azure Firewall
description: Learn how you can use an Azure Firewall to manage web traffic.
services: firewall
author: vhorne
manager: jpconnock

ms.service: firewall
ms.topic: overview
ms.custom: mvc
ms.workload: infrastructure-services
ms.date: 5/11/2018
ms.author: victorh
#Customer intent: As an IT administrator, I want to learn about Azure Firewall and what I can use it for.
---
# What is Azure Firewall - Public Preview?

Azure Firewall is a cloud-based network security service with build-in high availability that auto-scales as traffic grows.

You can centrally create and enforce application and network connectivity policies to protect your Azure virtual network resources. It is fully integrated with the Azure platform, portal, and services.

The Azure Firewall public preview offers the following features:

##  FQDN filtering 
You can filter traffic using HTTP and HTTPS fully qualified domain names (FQDN). This does not support SSL termination.

## Built-in high availability
High availability is built in, so there is nothing you need to configure.

## Unrestricted cloud scalability 
Azure Firewall can scale up or down to accommodate growing or shrinking network traffic flows.

## Layer-3 and layer-4 traffic filtering rules

You can centrally create allow or deny filter rules by source and destination IP address, port, and protocol (5-tuple rules).

## Outbound SNAT support

Source network address translation (SNAT) is supported to translate IP addresses outbound from your virtual networks to Internet destinations.

## Azure Monitor logging and metrics

Events are integrated with Azure Monitor and Azure Diagnostics and you can archive logs to a storage account. You can stream events to your Event Hub, or send them to Log Analytics.

## Next steps

You can create a test Azure Firewall using Azure PowerShell:

- Quickstart: 

