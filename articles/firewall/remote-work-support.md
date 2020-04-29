---
title: Azure Firewall remote work support
description: This article shows how Azure Firewall can support your remote work force requirements.
services: firewall
author: vhorne
ms.service: firewall
ms.topic: conceptual
ms.date: 04/29/2020
ms.author: victorh
---

# Azure Firewall remote work support

Azure Firewall is a managed, cloud-based network security service that protects your Azure virtual network resources. It's a fully stateful firewall as a service with built-in high availability and unrestricted cloud scalability. 

## Firewall rules

You can use Azure Firewall to secure your virtual desktop infrastructure (VDI) inbound RDP access to your Azure virtual network using Azure Firewall [DNAT rules](rule-processing.md). Windows Virtual Desktop (WVD) doesn't require you to open any inbound access to your virtual network. However, you must allow a set of outbound network connections for the WVD virtual machines that run in your virtual network. For more information, see [Use Azure Firewall to protect Window Virtual Desktop deployments](protect-windows-virtual-desktop.md).

## Next steps

Learn more about [Windows Virtual Desktop](https://docs.microsoft.com/azure/virtual-desktop/).