---
title: Troubleshooting - Unable to reach vCenter Server Appliance and NSX-T Manager
description: Learn what to do if you're unable to reach the VMware vCenter Server Appliance (VCSA) and NSX-T Manager from on-premises.
ms.topic: troubleshooting 
ms.date: 10/04/2021
---


# Troubleshooting - Unable to reach vCenter Server Appliance and NSX-T Manager


Azure VMware Solution uses virtual routing and forwarding (VRF): 

- MGMT-VRF: is connected to management vNET by ExpressRoute managed by Azure VMware Solution.
- PRIV-VRF: is connected to your vNET by ExperssRotue created by Azure VMware Solution.

NSX-T Manager and vCenter Server Appliance (VCSA) are located in the MGMT-VRF with your address space.

By design, you won't be able to reach NSX and VCSA from on-premises when only 0.0.0.0/0 is being advertised through Border Gateway Protocol (BGP) over ExpressRoute Global Reach between TNT-CUST-ER and your ExpressRoute or through BGP between vNET (ExpressRoute gateway or vWAN) to Azure VMware Solution. 

:::image type="content" source="media/troubleshooting-unable-to-reach-vcsa-and-nsx.png" alt-text="Diagram showing the virtual routing and forwarding in the Azure VMware Solution and on-premises environments.":::



## Root cause

NSX and VCSA are located in MGMT-VRF, which has its own 0.0.0.0/0 that sends all internet traffic through the management vNET. When you send just a 0.0.0.0/0 into PRIV-VRF, it's not forwarded to MGMT-VRF per design. Only a specific route is leaked between PRIV-VRF and MGMT-VRF.


## Solution

You'll need to send a more specific route (LPM) along with 0.0.0.0/0 to access NSX and VCSA. For example, if you want to access NSX and VCSA from on-premises source of 10.0.0.0/8, you'll need to send 10.0.0.0/8, which is leaked from PRIV-VRF to MGMT-VRF.

Advertising only 0.0.0.0/0 and trying to access NSX-T Manager and VCSA will not work by design.
