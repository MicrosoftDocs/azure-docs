---
title: Architecture of BareMetal Infrastructure for Nutanix
description: Learn about the architecture of several configurations of BareMetal Infrastructure for Nutanix.
ms.topic: reference
ms.subservice:  
ms.date: 04/14/2021
---

# Architecture of BareMetal Infrastructure for Nutanix

In this article, we'll look at the architectural options for BareMetal Infrastructure for Nutanix and the features each supports.

## Deployment Example

[![Deployment](media/nutanix-baremetal-architecture/nutanix-deployment-architecture.png)](media/nutanix-baremetal-architecture/nutanix-deployment-architecture.png#lightbox)

### Cluster Management virtual network

* Contains the Nutanix Ready Nodes
* Nodes reside in a delegated subnet (special BareMetal construct)

### Hub virtual network

* Contains a gateway subnet and VPN Gateway
* VPN Gateway is entry point from on=prem to cloud

### PC virtual network 

* Contains Prism Central - Nutanix's software appliance that enables advanced functionality within the Prism portal.

## Connecting on premises

Connecting from cloud to on-prem is supported via two traditional products: Express Route and VPN Gateway. One example deployment is to have a VPN gateway in the Hub VNet. This vnet is peered with both the PC Vnet and Cluster Management Vnet, providing connectivity across the network and to your on-premises site.

## Next steps

Learn more about Nutanix:

> [!div class="nextstepaction"]
> [About the Public Preview](about-the-public-preview.md)

