---
title: Power connections for Microsoft Azure FXT Edge Filer  
description: How to attach power cables and procedures for startup and safe shutdown of an Azure FXT Edge Filer node
author: ekpgh
ms.service: fxt-edge-filer
ms.topic: tutorial
ms.date: 05/20/2019
ms.author: v-erkell
---

# Tutorial: Connect power to the Azure FXT Edge Filer 

This tutorial explains how to attach power cables to the Azure FXT Edge Filer device, and how to power on and shut down the node. 

In this tutorial, you will learn: 

> [!div class="checklist"]
> * How to connect power to the racked device during initial setup
> * How to power on individual nodes
> * How to shut down and safely power off a node

## Prerequisites

Before starting this tutorial, the Azure FXT Edge Filer node should be installed in a standard equipment rack. 

## Connect power cables 

Each Azure FXT Edge Filer node uses two power supply units (PSUs). 

> [!TIP] 
> To take advantage of the two redundant PSUs, attach each AC power cable to a power distribution unit (PDU) on an independent branch circuit.  
> 
> You can use a UPS to power the PDUs for extra protection. 

1. Connect the included power cords to the PSUs in the chassis. Make sure that the cords and PSUs are fully seated. 
1. Attach the power cords to the power distribution units on the equipment rack. If possible, use two separate power sources for the two cords. 
 
## Power on an Azure FXT Edge Filer node

To power up the node, press the power button on the front of the system. The button is on the right side control panel. 

## Power off an Azure FXT Edge Filer node

After an Azure FXT Edge Filer node is in use as part of a cluster, you should use the cluster control panel software to shut down the hardware. 

> [!NOTE] 
> To avoid possible data loss or corruption, always use the Control Panel software to shut down an Azure FXT Edge Filer. Do not use the physical power button for shutdown unless you are instructed to do so by Microsoft Customer Service and Support. (In an electrical emergency, disconnect power cords or use your data center's electricity disconnect mechanism.)

Follow these instructions to safely power off an Azure FXT Edge Filer node:

1. Sign in to the cluster Control Panel. (Directions in [Open the Settings pages](fxt-cluster-config-overview.md#open-the-settings-pages))
1. Click the **Settings** tab, then load the **Cluster** > **FXT Nodes** page. 
1. In the list of cluster nodes, find the one you want to shut down. Click the **Power down** button in its **Actions** column. 
1. Wait a few moments. The node will shut down and power itself off.

## Next steps

After you finish installing power cables, continue setting up the nodes: 

* Attach network cables and use the Cable Management Arm (CMA) as described in [Make network connections to the Azure FXT Edge Filer node](fxt-network.md).
* Power on the nodes and initialize them by setting the root passwords. Read [Set initial passwords](fxt-node-password.md) for details. 
