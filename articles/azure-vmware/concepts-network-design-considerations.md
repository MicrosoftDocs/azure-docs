---
title: Concepts - Network design considerations
description: Learn about network design considerations for Azure VMware Solution
ms.topic: conceptual
ms.date: 03/04/2022
---

# Azure VMware Solution network design considerations

Azure VMware Solution offers a VMware private cloud environment accessible for users and applications from on-premises and Azure-based environments or resources. The connectivity is delivered through networking services such as Azure ExpressRoute and VPN connections. There are several networking considerations to review before setting up your Azure VMware Solution environment. This article provides solutions for use cases you may encounter when configuring your networking with Azure VMware Solution. 

## Azure VMware Solution compatibility with AS-Path Prepend

Azure VMware Solution is incompatible with AS-Path Prepend for redundant ExpressRoute configurations and doesn't honor the outbound path selection from Azure towards on-premises.  If you're running 2 or more ExpressRoute paths between on-prem and Azure plus the following listed conditions are true, you may experience impaired connectivity or no connectivity between your on-premises networks and AVS Azure VMware Solution.  This connectivity issue is caused by Azure VMware Solution not seeing the AS-Path Prepend and using ECMP to send traffic towards your environment over both ExR circuits, causing issues with stateful firewall inspection.

**Check list of conditions that are true:**
- Both or all circuits are connected to Azure VMware Solution with global reach.
- The same netblocks are being advertised from two or more circuits.
- Stateful firewalls are in the network path.
- You're using AS-Path Prepend to force Azure to prefer one path over others.

**Solution**

If you’re using BGP AS-Path Prepend to designate a circuit from Azure towards on-prem, open a [Customer Support Request](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) with AVS Azure VMware Solution. You’ll need to identify which circuit you’d like to be primary for a given network advertisement. Azure support staff will implement the AS-Path Prepend manually within the AVS Azure VMware Solution environment to match your on-prem configuration for route selection.  This does not affect redundancy as the other path(s) is still available if the primary one fails. 

## VMs and default routes from On-Premises 

> [!IMPORTANT]
> Azure Vmware Solution Management VMs don't honor a default route from On-Premises.

If you’re routing back to your on-premises networks using only a default route advertised towards Azure, the vCenter and NSX manager VMs won't honor that route.  To reach vCenter and NSX manager, more specific routes from on-prem need to be provided to allow traffic to have a return path route to those networks. 

## Next steps

Now that you've covered Azure VMware Solution network design considerations, you might consider learning more.

- [Network interconnectivity concepts - Azure VMware Solution](concepts-networking.md)

## Recommended content

- [Tutorial - Configure networking for your VMware private cloud in Azure - Azure VMware Solution](tutorial-network-checklist.md)



