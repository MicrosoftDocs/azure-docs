---
title: What is Azure Firewall
description: Learn how you can use an Azure Firewall to manage web traffic.
services: firewall
author: vhorne
manager: jpconnock

ms.service: firewall
ms.topic: overview
ms.custom: mvc
ms.date: 5/16/2018
ms.author: victorh
#Customer intent: As an IT administrator, I want to learn about Azure Firewall and what I can use it for.
---
# What is Azure Firewall - Public Preview?

![Firewall overview](media/overview/firewall-overview.png)

Azure Firewall is a cloud-based network security service, providing filtering capabilities with built-in high availability, unrestricted cloud scalability and zero maintenance.

You can centrally create and enforce application and network connectivity policies to protect your Azure virtual network resources. It is fully integrated with the Azure platform, portal, and services.

The Azure Firewall public preview offers the following features:

## Built-in high availability
High availability is built in, so no additional load balancers are required and there is nothing you need to configure.

## Unrestricted cloud scalability 
Azure Firewall can scale up as much as you need  to accommodate changing network traffic flows, so you don't need to budget for your peak traffic.

##  FQDN filtering 
You can limit outbound HTTPS/S traffic to a specified list of fully qualified domain names (FQDN) including wild cards. This feature does not require SSL termination.

## Network traffic filtering rules

You can centrally create allow or deny network filtering rules by source and destination IP address, port, and protocol. Azure Firewall is fully stateful. Rules are enforced and logged across multiple subscriptions and virtual networks.

## Outbound SNAT support

All outbound virtual network traffic IP addresses are translated to the Azure Firewall public IP (Source Network Address Translation). You can identify and allow traffic originating from your virtual network to remote Internet destinations.

## Azure Monitor logging and metrics

All events are integrated with Azure Monitor, allowing you to archive logs to a storage account, stream events to your Event Hub, or send them to Log Analytics.

## Next steps

You can create a test Azure Firewall using a Quickstart template.

- Quickstart: 

