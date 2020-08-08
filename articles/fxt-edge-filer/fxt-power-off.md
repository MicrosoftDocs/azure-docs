---
title: How to shut down a Microsoft Azure FXT Edge Filer unit  
description: Procedures for startup and safe shutdown of an Azure FXT Edge Filer node
author: ekpgh
ms.service: fxt-edge-filer
ms.topic: how-to
ms.date: 07/01/2019
ms.author: rohogue
---

# How to safely power off Azure FXT Edge Filer hardware

Although you can use the physical power button to switch on an individual node, you should not use it to shut down the unit under normal circumstances.

After an Azure FXT Edge Filer node is in use as part of a cluster, you should use the cluster control panel software to shut down the hardware. 

> [!NOTE] 
> To avoid possible data loss or corruption, always use the Control Panel software to shut down an Azure FXT Edge Filer. Do not use the physical power button for shutdown unless you are instructed to do so by Microsoft Customer Service and Support.
> 
> In an electrical emergency, disconnect power cords or use your data center's electricity disconnect mechanism.

## Shut down a node from the Control Panel

Follow these instructions to safely power off an Azure FXT Edge Filer node:

1. Sign in to the cluster Control Panel. (Directions in [Open the Settings pages](fxt-cluster-create.md#open-the-settings-pages))
1. Click the **Settings** tab, then load the **Cluster** > **FXT Nodes** page.
1. In the list of cluster nodes, find the one you want to shut down. Click the **Power down** button in its **Actions** column. 
1. Wait a few moments. The node will shut down and power itself off.

## Next steps

* Learn about the status LEDs and other indicators in [Monitor Azure FXT Edge Filer hardware status](fxt-monitor.md).
* Read more about Azure FXT Edge Filer power supplies in [Connect power cables](fxt-network-power.md#connect-power-cables).
