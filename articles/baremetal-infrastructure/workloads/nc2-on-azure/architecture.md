---
title: Architecture of BareMetal Infrastructure for NC2
author: jjaygbay1
ms.author: jacobjaygbay
description: Learn about the architecture of several configurations of BareMetal Infrastructure for NC2.
ms.topic: reference
ms.subservice: baremetal-nutanix
ms.custom: engagement-fy23
ms.date: 04/01/2023
---

# Architecture of BareMetal Infrastructure for Nutanix

In this article, we look at the architectural options for BareMetal Infrastructure for Nutanix and the features each option supports.

## Deployment example

The image in this section shows one example of an NC2 on Azure deployment.

:::image type="content" source="media/nc2-on-azure-deployment-architecture.png" alt-text="Diagram showing NC2 on Azure deployment architecture." border="false" lightbox="media/nc2-on-azure-deployment-architecture-large.png":::

### Cluster Management virtual network

* Contains the Nutanix Ready Nodes
* Nodes reside in a delegated subnet (special BareMetal construct)

### Hub virtual network

* Contains a gateway subnet and VPN Gateway
* VPN Gateway is entry point from on-premises to cloud

### PC virtual network

* Contains Prism Central - Nutanix's software appliance that enables advanced functionality within the Prism portal.

## Connect from cloud to on-premises

Connecting from cloud to on-premises is supported by two traditional products: Express Route and VPN Gateway.
One example deployment is to have a VPN gateway in the Hub virtual network.
This virtual network is peered with both the PC virtual network and Cluster Management virtual network, providing connectivity across the network and to your on-premises site.

## Next steps

Learn more:

> [!div class="nextstepaction"]
> [Requirements](requirements.md)
