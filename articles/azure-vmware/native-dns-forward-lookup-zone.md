---
title: DNS forward lookup zone for Azure VMware Solution on native private cloud
description: Learn about DNS forward lookup zone for Azure VMware Solution on native private cloud.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 3/14/2025
ms.custom: engagement-fy25
---

# DNS forward lookup zone for Azure VMware Solution on native private cloud

This article focuses on the Azure VMware Solution on native private cloud DNS forward lookup zone configuration options and associated behavior for the domain name resolution for private cloud appliances domain names.

In this article, you  learn to DNS forward lookup zone configuration option.

## Prerequisites
- Have Azure VMware Solution on native deployed successfully.

## DNS forward lookup zone configuration option

Azure VMware Solution allows customers to configure DNS forward lookup zones, either public or private. This configuration defines how DNS name resolution for Azure VMware Solution components, such as vCenter, ESX hosts, and NSX Managers is done. This configuration could be a public or private zone:

- **Public**: The public DNS forward lookup zone allows domain names to be resolved using any public DNS servers.
- **Private**: The private DNS forward lookup zone makes it resolvable only within a private customer environment and provides other security compliance. If a customer chooses Private Forward Lookup Zone, the SDDC FQDNs are resolvable from the virtual network where the SDDC is provisioned. If customers wish to enable this zone to be resolvable outside of this virtual network, such as in a customer on-premises environment, you need to configure an Azure DNS Private Resolver or deploy your own DNS server in your virtual network that will use the Azure DNS Service (168.63.129.16) to resolve your SDDC FQDNs.

AVS DNS forward lookup zone can be configured at the time of creation, or this can be changed post SDDC creation. The configuration page for the same is shown below.