---
title: Concepts - Network design considerations
description: Learn about network design considerations for Azure VMware Solution
ms.topic: conceptual
ms.service: azure-vmware
ms.date: 08/19/2022
---

# Azure VMware Solution network design considerations

Azure VMware Solution offers a VMware private cloud environment accessible for users and applications from on-premises and Azure-based environments or resources. The connectivity is delivered through networking services such as Azure ExpressRoute and VPN connections. There are several networking considerations to review before setting up your Azure VMware Solution environment. This article provides solutions for use cases you may encounter when configuring your networking with Azure VMware Solution. 

## Azure VMware Solution compatibility with AS-Path Prepend

Azure VMware Solution is incompatible with AS-Path Prepend for redundant ExpressRoute configurations and doesn't honor the outbound path selection from Azure towards on-premises.  If you're running 2 or more ExpressRoute paths between on-prem and Azure plus the following listed conditions are true, you may experience impaired connectivity or no connectivity between your on-premises networks and Azure VMware Solution.  The connectivity issue is caused when Azure VMware Solution doesn't see the AS-Path Prepend and uses ECMP to send traffic towards your environment over both ExR circuits, resulting in issues with stateful firewall inspection.

**Checklist of conditions that are true:**
- Both or all circuits are connected to Azure VMware Solution with global reach.
- The same netblocks are being advertised from two or more circuits.
- Stateful firewalls are in the network path.
- You're using AS-Path Prepend to force Azure to prefer one path over others.

**Solution**

If you’re using BGP AS-Path Prepend to dedicate a circuit from Azure towards on-prem, open a [Customer Support Request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) with Azure VMware Solution to designate a primary circuit from Azure. You’ll need to identify which circuit you’d like to be primary for a given network advertisement. Azure support staff will implement the AS-Path Prepend manually within the Azure VMware Solution environment to match your on-prem configuration for route selection.  That action doesn't affect redundancy as the other path(s) is still available if the primary one fails. 

## Management VMs and default routes from on-premises 

> [!IMPORTANT]
> Azure VMware Solution Management VMs don't honor a default route from On-Premises.

If you’re routing back to your on-premises networks using only a default route advertised towards Azure, the vCenter Server and NSX Manager VMs won't honor that route.  

**Solution**

To reach vCenter Server and NSX Manager, more specific routes from on-prem need to be provided to allow traffic to have a return path route to those networks. 

## Next steps

Now that you've covered Azure VMware Solution network design considerations, you might consider learning more.

- [Network interconnectivity concepts - Azure VMware Solution](concepts-networking.md)
- [Plan the Azure VMware Solution deployment](plan-private-cloud-deployment.md)
- [Networking planning checklist for Azure VMware Solution](tutorial-network-checklist.md)

## Recommended content

- [Tutorial - Configure networking for your VMware private cloud in Azure - Azure VMware Solution](tutorial-network-checklist.md)



