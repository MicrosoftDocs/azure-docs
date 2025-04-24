---
title: VMware Cloud Director (VCD) with Azure VMware Solution Networking 
description: This article explains how to use Azure VMware Solution to enable enterprise and hosters to use Azure VMware Solution for private clouds underlying resources for virtual datacenters.
ms.topic: how-to
author: rdutt
ms.service: azure-vmware
ms.date: 4/24/2025
---

# VCD on Azure VMware Solution network scenarios 

VMware Cloud Director (VCD) on Azure VMware Solution offers a robust platform for managing multi-tenant environments, enabling organizations to create secure, isolated virtual data centers. This article provides various network connectivity scenarios for VCD tenants, including connecting to the internet and accessing Azure services. By leveraging the flexibility of VCD and Azure VMware Solution, tenants can achieve seamless integration with external networks and Azure resources, ensuring efficient and scalable operations.


## Connecting VCD tenants on Azure VMware Solution to internet

- Tenants can use public IP to do SNAT configuration to enable Internet access for VM hosted in organization VDC. 

:::image type="content" source="media/vmware-vcd/VCD_internet_diag.png" alt-text="Diagram showing how tenants in VMware Cloud Director connects to internet in Azure VMware Solution." border="false" lightbox="media/vmware-vcd/VCD_internet_diag.png":::


- To achieve this connectivity, the provider can create organization VDCs with a dedicated Tier-1 router and with reserved Public & Private IP for NAT configuration. 
- Tenants can use public IP SNAT configuration to enable Internet access for VM hosted in organization VDC.
    - Learn about [NSX-T public IP](https://learn.microsoft.com/azure/azure-vmware/enable-public-ip-nsx-edge) and how to turn on public IP addresses on a VMware NSX Edge node in Azure VMware solution.
- Organization VDC Edge gateway has default DENY ALL firewall rule. Organization administrators need to open appropriate ports to allow access through the firewall by adding a new firewall rule.

    > [!Note]
    >  Overlapping IP address can be managed using NAT to prevent conflicts in end-to-end routing scenarios.


## How VCD tenants and their organization virtual datacenters can connect to Azure services

- To enable access to VNet based Azure resources, each tenant can have a dedicated Azure VNet with an Azure VPN gateway. 
- A site-to-site VPN is established between tenant’s organization VDC and Azure VNet. To achieve this connectivity, the tenant provides a public IP to the organization VDC. 
- The organization VDC administrator can configure IPsec VPN connectivity using VMware Cloud Director.

:::image type="content" source="media/vmware-vcd/VCD_Azure_Services_diag.png" alt-text="Diagram showing how tenants in VMware Cloud Director connects to azure services in Azure VMware Solution." border="false" lightbox="media/vmware-vcd/VCD_Azure_Services_diag.png":::

## Related Content

Learn about [How to enable VMware Cloud Director on Azure VMware Solution](enable-vmware-vcd-with-azure.md)

## Learn More

Learn about [VMware Cloud Director](https://techdocs.broadcom.com/us/en/vmware-cis/cloud-director/vmware-cloud-director/10-6/overview.html)

Learn about [Architecture - Network interconnectivity - Azure VMware Solution](https://learn.microsoft.com/azure/azure-vmware/architecture-networking)
