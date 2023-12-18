---
title: Azure Operator Nexus: Network Fabric Controller
description: Overview of Network Fabric Controller for Azure Operator Nexus.
author: lnyswonger
ms.author: lnyswonger
ms.reviewer: jdasari
ms.date: 12/18/2023
ms.service: azure-operator-nexus
ms.topic: conceptual
---

# Network Fabric Controller Overview
The Network Fabric Controller (NFC) is an Azure resource that allows customers to establish on-premises network infrastructure and workloads using Azure within an Azure region. The NFC acts as a conduit, connecting the Azure control plane to your on-site network hardware, such as routers, switches, and storage appliances. It enables network functions like virtualization, firewall, and gateway, while also facilitating seamless management and configuration of your network infrastructure. Its main role is to manage multiple Network Fabric (NF) instances connected to Nexus on-premises instances. This setup allows for structured grouping of NF instances within a designated Azure region. Additionally, NFC can be used to establish and modify configurations for Network Fabrics, Isolation Domains, Network Racks, and Network Devices within each Azure Operator Nexus instance.

The NFC is responsible for bootstrapping and managing network fabric instances. These NF instances are connected to the NFC through redundant ExpressRoute circuits. These circuits are linked to the management VPN, which is exclusively provided by the operator for management purposes. You can manage the lifecycle of a Network Fabric Controller through Azure using supported interfaces like Azure CLI and REST API. For example, you can create an NFC using Azure Command Line Interface (AzureCLI) and also check its status or delete it.

An NFC is a crucial component of the Azure Operator Nexus solution, a service that enables the connection between Azure and on-premises environments. With an NFC, you can:
- Establish a secure and private connection between your on-premises network and Azure using ExpressRoute, bypassing the public internet.
- Manage the network fabric, which comprises physical network devices like CE routers, Top of the Rack switches, Management Switches, Network Packet Broker devices, Terminal Servers, and storage appliances.
- Enable essential network functions, including virtualization, firewall, and gateway, which provide services and security at the logical layer of the network.