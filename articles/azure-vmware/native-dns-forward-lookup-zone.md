---
title: DNS forward lookup zone for Azure VMware Solution in an Azure virtual network 
description: Learn about DNS forward lookup zone for Azure VMware Solution in an Azure virtual network.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 3/14/2025
ms.custom: engagement-fy25
# customer intent: As a cloud administrator, I want to configure DNS forward lookup zone for Azure VMware Solution in an Azure virtual network so that I can manage domain name resolution for private cloud appliances.
---

# DNS forward lookup zone for Azure VMware Solution in an Azure virtual network

In this article, you learn how to configure a Domain Name System (DNS) forward lookup zones for Azure VMware Solution private cloud appliances. It explains the options and behaviors for domain name resolution within an Azure virtual network. 

## Prerequisite

Azure VMware Solution is successfully deployed in an Azure Virtual Network. 

## DNS forward lookup zone configuration options 

Azure VMware Solution allows you to configure DNS forward lookup zones in two ways: public or private. This configuration defines how DNS name resolution for Azure VMware Solution components, such as vCenter, ESX hosts, and NSX Managers, is performed. 

**Public**: The public DNS forward lookup zone allows domain names to be resolved using any public DNS servers. 

**Private**: The private DNS forward lookup zone makes it resolvable only within a private customer environment and provides other security compliance. If a customer chooses Private Forward Lookup Zone, the Software-Defined Data Center (SDDC) Fully Qualified Domain Names (FQDNs) are resolvable from the virtual network where the SDDC is provisioned. If you wish to enable this zone to be resolvable outside of this virtual network, such as in a customer on-premises environment, you need to configure an Azure DNS Private Resolver or deploy your own DNS server in your virtual network that uses the Azure DNS Service (168.63.129.16) to resolve your SDDC FQDNs. 

## Related content 

DNS forward lookup zone can be configured at the time of creation or changed after the SDDC is created. The following diagram shows the configuration page for the DNS forward lookup zone. 

:::image type="content" source="./media/native-connectivity/native-connect-dns-lookup.png" alt-text="Diagram showing an Azure VMware Solution DNS forward lookup."::: 