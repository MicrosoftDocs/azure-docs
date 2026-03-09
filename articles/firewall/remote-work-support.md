---
title: Azure Firewall remote work support
description: This article shows how Azure Firewall can support your remote work force requirements.
services: firewall
author: duongau
ms.service: azure-firewall
ms.topic: concept-article
ms.date: 12/31/2025
ms.author: duau
# Customer intent: "As an IT manager, I want to implement Azure Firewall for our remote workforce, so that I can ensure secure access and protect our Virtual Desktop Infrastructure from potential threats."
---

# Azure Firewall remote work support

Azure Firewall is a managed, cloud-based network security service that protects your Azure virtual network resources. It's a fully stateful firewall as a service with built-in high availability and unrestricted cloud scalability.

## Virtual Desktop Infrastructure (VDI) deployment support

Remote and hybrid work policies require IT organizations to manage capacity, network, security, and governance effectively. Employees working remotely may not be protected by the layered security policies associated with on-premises services. Virtual Desktop Infrastructure (VDI) deployments on Azure help organizations provide secure access to corporate resources. You can use Azure Firewall [DNAT rules](rule-processing.md) along with its [threat intelligence](threat-intel.md) based filtering capabilities to protect inbound and outbound Internet access to and from these VDI deployments.

## Azure Virtual Desktop support

Azure Virtual Desktop is a comprehensive desktop and app virtualization service running in Azure. It’s the only virtual desktop infrastructure (VDI) that delivers simplified management, multi-session Windows 10/11, optimizations for Microsoft 365 apps for enterprise, and support for Remote Desktop Services (RDS) environments. You can deploy and scale your Windows desktops and apps on Azure in minutes, and get built-in security and compliance features. Azure Virtual Desktop doesn't require you to open any inbound access to your virtual network. However, you must allow a set of outbound network connections for the Azure Virtual Desktop virtual machines that run in your virtual network. For more information, see [Use Azure Firewall to protect Azure Virtual Desktop deployments](protect-azure-virtual-desktop.md).

## Next steps

Learn more about [Azure Virtual Desktop](/azure/virtual-desktop/overview).
