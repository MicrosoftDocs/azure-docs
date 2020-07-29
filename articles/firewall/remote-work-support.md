---
title: Azure Firewall remote work support
description: This article shows how Azure Firewall can support your remote work force requirements.
services: firewall
author: vhorne
ms.service: firewall
ms.topic: conceptual
ms.date: 05/04/2020
ms.author: victorh
---

# Azure Firewall remote work support

Azure Firewall is a managed, cloud-based network security service that protects your Azure virtual network resources. It's a fully stateful firewall as a service with built-in high availability and unrestricted cloud scalability.

## Virtual Desktop Infrastructure (VDI) deployment support

Work from home policies requires many IT organizations to address fundamental changes in capacity, network, security, and governance. Employees aren't protected by the layered security policies associated with on-premises services while working from home. Virtual Desktop Infrastructure (VDI) deployments on Azure can help organizations rapidly respond to this changing environment. However, you need a way to protect inbound/outbound Internet access to and from these VDI deployments. You can use Azure Firewall [DNAT rules](rule-processing.md) along with its [threat intelligence](threat-intel.md) based filtering capabilities to protect your VDI deployments.

## Azure Windows Virtual Desktop support

Windows Virtual Desktop is a comprehensive desktop and app virtualization service running in Azure. It’s the only virtual desktop infrastructure (VDI) that delivers simplified management, multi-session Windows 10, optimizations for Office 365 ProPlus, and support for Remote Desktop Services (RDS) environments. You can deploy and scale your Windows desktops and apps on Azure in minutes, and get built-in security and compliance features. Windows Virtual Desktop doesn't require you to open any inbound access to your virtual network. However, you must allow a set of outbound network connections for the Windows Virtual Desktop virtual machines that run in your virtual network. For more information, see [Use Azure Firewall to protect Window Virtual Desktop deployments](protect-windows-virtual-desktop.md).

## Next steps

Learn more about [Windows Virtual Desktop](https://docs.microsoft.com/azure/virtual-desktop/).