---
title:  Tutorial - NSX-Tier-1-Gateway
description: Learn how to create a Tier-1 Gateway
ms.topic: tutorial
ms.service: azure-vmware
ms.date: 12/11/2024
ms.custom: engagement-fy25
---

# Tutorial: Create an NSX Tier-1 Gateway 

After deploying the Azure VMware Solution, you can create additional Tier-1 Gateways from the NSX Manager. Once configured, the additional Tier-1 Gateway is visible in the NSX Manager. NSX comes pre-provisioned by default with an NSX Tier-0 Gateway in **Active/Active** mode and a default Tier-1 Gateway in **Active/Standby** mode. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an additional NSX Tier-1 Gateway in the NSX Manager
> * Configure the High Availability (HA) mode on a Tier-1 Gateway 

## Prerequisites

An Azure VMware Solution private cloud with access to the NSX Manager interface. For more information, see the [Configure networking](tutorial-configure-networking.md) tutorial. 

## Use NSX Manager to create a Tier-1 Gateway

A Tier-1 Gateway is typically added to a Tier-0 Gateway in the northbound direction and to segments in the southbound direction. 

1. With the CloudAdmin account, sign-in to the NSX Manager.

2. In NSX Manager, select **Networking** > **Tier-1 Gateways**.

3. Select **Add Tier-1 Gateway**. 

4. Enter a name for the gateway. 

5. Select the **HA Mode** for the Tier-1 Gateway. Choose between **Active/Standby**, **Active/Active**, or **Distributed Only**:
 
    | HA Mode | Description |
    | :--------- | :------------- |
    | Active Standby | One active instance and one standby instance. The Standby takes over is the active fails. |
    | Active Active | Both instances are active and can handle traffic simultaneously. |
    | Distributed Only | No centralized instances; routing is distributed across all transport nodes. |

6. Select a Tier-0 Gateway to connect to this Tier-1 Gateway to create a multi-tier topology. 

7. Select an NSX Edge cluster if you want this Tier-1 Gateway to host stateful services such as NAT, load balancer, or firewall. 

8. After you select an NSX Edge cluster, a toggle gives you the option to select NSX Edge Nodes. 

9. If you selected an NSX Edge cluster, select a failover mode or accept the default. 

     | Option | Description | 
     | :----- | :---------- |
     | Preemptive | If the preferred NSX Edge node fails and recovers, it preempts its peer and becomes the active node. The peer changes its state to standby. |
     | Non-preemptive  | If the preferred NSX Edge node fails and recovers, it checks if its peer is the active node. If so, the preferred node will not preempt its peer and will be the standby node. This is the default option. |

:::image type="content" source="media/nsxt/nsx-create-tier-1.png" alt-text="Diagram showing the creation of a new Tier-1 Gateway in NSX Manager." border="false" lightbox="media/nsxt/nsx-create-tier-1.png":::

10. Select **Save**. 

## Next steps

In this tutorial, you created an additional Tier-1 Gateway to use in your Azure VMware Solution private cloud. 

