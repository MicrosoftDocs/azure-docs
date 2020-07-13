---
title: Troubleshoot Cosmos DB service unavailable exception
description: How to diagnose and fix Cosmos DB service unavailable exception
author: j82w
ms.service: cosmos-db
ms.date: 07/13/2020
ms.author: jawilley
ms.topic: troubleshooting
ms.reviewer: sngun
---

# Diagnose and troubleshoot Cosmos DB service unavailable

| Http Status Code | Name | Category |
|---|---|---|
|503|CosmosServiceUnavailable|Service|

## Issue

The SDK was not able to connect to the Azure Cosmos DB service.

## If a new application or service is getting 503

### 1. The required ports are not enabled.
Please verify that all the [required ports](https://docs.microsoft.com/azure/cosmos-db/performance-tips#networking) are enabled.

## If an existing application or service started getting 503

### 1. There is an outage
Please check the [Azure Status](https://status.azure.com/status) to see if there is an ongoing issue.

### 2. SNAT Port Exhaustion
If your app is deployed on Azure Virtual Machines without a public IP address, by default [Azure SNAT ports](https://docs.microsoft.com/azure/load-balancer/load-balancer-outbound-connections#preallocatedports) establish connections to any endpoint outside of your VM. The number of connections allowed from the VM to the Azure Cosmos DB endpoint is limited by the [Azure SNAT configuration](https://docs.microsoft.com/azure/load-balancer/load-balancer-outbound-connections#preallocatedports).

 Azure SNAT ports are used only when your VM has a private IP address and a process from the VM tries to connect to a public IP address.

#### Solution:

There are two workarounds to avoid Azure SNAT limitation:

* Add your Azure Cosmos DB service endpoint to the subnet of your Azure Virtual Machines virtual network. For more information, see [Azure Virtual Network service endpoints](https://docs.microsoft.com/azure/virtual-network/virtual-network-service-endpoints-overview). 

    When the service endpoint is enabled, the requests are no longer sent from a public IP to Azure Cosmos DB. Instead, the virtual network and subnet identity are sent. This change might result in firewall drops if only public IPs are allowed. If you use a firewall, when you enable the service endpoint, add a subnet to the firewall by using [Virtual Network ACLs](https://docs.microsoft.com/azure/virtual-network/virtual-networks-acl).
* Assign a public IP to your Azure VM.

### 3. The required ports are being blocked
Please verify that all the [required ports](https://docs.microsoft.com/azure/cosmos-db/performance-tips#networking) are enabled.