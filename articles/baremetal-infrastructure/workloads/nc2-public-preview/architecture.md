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

<!--- ![Infographic of Microsoft Azure components used to migrate IBM i workloads to Skytap on Azure](media/migrate-ibm-i-series-applications-800.png)

 [View a larger version of the image](media/migrate-ibm-i-series-applications-v2.png) -->

![Public Preview architecture](media/nutanix-baremetal-architecture/nutanix-deployment-architecture.png#lightbox)

[View a larger version of the image](media/nutanix-baremetal-architecture/nutanix-deployment-architecture-large.png)

### Cluster Management virtual network

* Contains the Nutanix Ready Nodes
* Nodes reside in a delegated subnet (special BareMetal construct)

### Hub virtual network

* Contains a gateway subnet and VPN Gateway
* VPN Gateway is entry point from on=prem to cloud

### PC virtual network 

* Contains Prism Central - Nutanix's software appliance that enables advanced functionality within the Prism portal.

## Connecting on premises

Connecting from cloud to on-premises is supported with two traditional products: Express Route and VPN Gateway. 
One example deployment is to have a VPN gateway in the Hub virtual network.
This virtual network is peered with both the PC virtual network and Cluster Management virtual network, providing connectivity across the network and to your on-premises site.

## Next steps

Learn more about Nutanix:

> [!div class="nextstepaction"]
> [About the Public Preview](about-the-public-preview.md)

