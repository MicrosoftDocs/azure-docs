---
title: Azure CLI samples for virtual network
description: Learn about various sample scripts you can use for completing tasks in the Azure CLI, including creating a virtual network for multi-tier applications.
services: virtual-network
author: asudbring
ms.service: virtual-network
ms.topic: sample
ms.date: 04/04/2023
ms.author: allensu 
ms.custom: devx-track-azurecli

---
# Azure CLI samples for virtual network

The following table includes links to bash scripts with Azure CLI commands:

| Script | Description |
|----|----|
| [Create a virtual network for multi-tier applications](./scripts/virtual-network-cli-sample-multi-tier-application.md) | Creates a virtual network with front-end and back-end subnets. Traffic to the front-end subnet is limited to HTTP and SSH, while traffic to the back-end subnet is limited to MySQL, port 3306. |
| [Peer two virtual networks](./scripts/virtual-network-cli-sample-peer-two-virtual-networks.md) | Creates and connects two virtual networks in the same region. |
| [Route traffic through a network virtual appliance](./scripts/virtual-network-cli-sample-route-traffic-through-nva.md) | Creates a virtual network with front-end and back-end subnets and a VM that is able to route traffic between the two subnets. |
| [Filter inbound and outbound VM network traffic](./scripts/virtual-network-cli-sample-filter-network-traffic.md) | Creates a virtual network with front-end and back-end subnets. Inbound network traffic to the front-end subnet is limited to HTTP, HTTPS, and SSH. Outbound traffic to the internet from the back-end subnet isn't permitted. |
|[Configure IPv4 + IPv6 dual stack virtual network with Standard Load Balancer](./scripts/virtual-network-cli-sample-ipv6-dual-stack-standard-load-balancer.md)|Deploys dual-stack (IPv4+IPv6) virtual network with two VMs and an Azure Standard Load Balancer with IPv4 and IPv6 public IP addresses. |
|[Quickstart: Create and test a NAT gateway - Azure CLI](../virtual-network/nat-gateway/quickstart-create-nat-gateway-cli.md)|Create and validate a NAT gateway using a virtual machine. |
