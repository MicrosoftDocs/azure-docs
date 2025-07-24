---
title: Configure private and public DNS forward lookup zones
description: Learn about private and public DNS forward lookup zone configuration.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 4/21/2025
ms.custom: engagement-fy25
# customer intent: As a cloud administrator, I want to configure DNS forward lookup zone for Azure VMware Solution Generation 2 private clouds so that I can manage domain name resolution for private cloud appliances.
---

# Configure private and public DNS forward lookup zones

In this article, you learn how to configure a Domain Name System (DNS) forward lookup zones for Azure VMware Solution Generation 2 (Gen 2) private clouds. It explains the options and behaviors for domain name resolution within an Azure Virtual Network. 

## Prerequisite

Gen 2 private cloud is successfully deployed. 

## DNS forward lookup zone configuration options 

Azure VMware Solution allows you to configure DNS forward lookup zones in two ways: public or private. This configuration defines how DNS name resolution for Azure VMware Solution components, such as vCenter Server, ESX hosts, and NSX Manager, is performed. 

**Public**: The public DNS forward lookup zone allows domain names to be resolved using any public DNS servers. 

**Private**: The private DNS forward lookup zone makes it resolvable only within a private customer environment and provides other security compliance. If a customer chooses Private Forward Lookup Zone, the Software-Defined Data Center (private cloud) Fully Qualified Domain Names (FQDNs) are resolvable from the Virtual Network where the private cloud is provisioned. If need to enable this zone to be resolvable outside of this Virtual Network, such as in a customer on-premises environment, you need to configure an Azure DNS Private Resolver or deploy your own DNS server in your Virtual Network that uses the Azure DNS Service (168.63.129.16) to resolve your private cloud FQDNs. 

DNS forward lookup zone can be configured at the time of creation or changed after the private cloud is created. The following diagram shows the configuration page for the DNS forward lookup zone. 

:::image type="content" source="./media/native-connectivity/native-connect-dns-lookup.png" alt-text="Diagram showing an Azure VMware Solution Gen 2 DNS forward lookup." lightbox="media/native-connectivity/native-connect-dns-lookup.png":::

## Configure private DNS for your Azure VMware Solution Generation 2 private cloud  
 
If you select the Private DNS option, the private cloud will be resolvable from the Virtual Network where the private cloud is provisioned. This is done by linking the private DNS zone to your Virtual Network. If you need to enable this zone to be resolvable outside of this Virtual Network, such as in your on-premises environment, you need to configure an Azure DNS Private Resolver, or deploy your own DNS server in your Virtual Network. Private DNS will use the Azure DNS Service (168.63.129.16) to resolve your private cloud FQDNs. This section explains configuring an Azure DNS Private Resolver. 
 
 ### Prerequisite

 Create two /28 subnets to delegate to the Azure DNS Private Resolver service. As an example, they can be named ```dns-in``` and ```dns-out```.

 ### Deploy Azure DNS Private Resolver
 
 In the Resource Group, deploy the Private DNS Resolver. 
 
 1. Select Create. 
 2. In the Search the Marketplace field, type Private DNS Resolver and select enter. 
 3. Select Create for the Private DNS Resolver. 
 4. Ensure the Subscription, Resource group, and Region fields are correct. Enter a name and choose your Virtual Network. This network must be the same as where you deployed your private cloud, then select Next: Inbound Endpoints. 
 5. Select Add an Endpoint, enter a name for the Inbound endpoint, such as dns-in and select the subnet for the DNS inbound endpoint and select Save.
 6. Select Next: Outbound Endpoints. 
 7. Select Add an Endpoint, enter a name for the Outbound endpoint, such as dns-out and select the subnet for the DNS outbound endpoint and select Save.
 8. Select Next: Ruleset. 
 9. Select Next: Tags. 
 10. Select Next: Review + Create. 
 11. When the Validation passes, select Create. 
 
You can now resolve private cloud DNS records from any workload using the Inbound endpoint of the Azure DNS Private Resolver as it’s DNS server. You should now create a conditional forwarder in your on-premises DNS server and point it to the Inbound Endpoint of the Azure DNS Private Resolver to allow DNS resolution of the private cloud from your corporate network. 
 
 ### Enable Resolution for private cloud workload virtual machines
 
 If you need workload virtual machines deployed in your private cloud to resolve the private cloud management components you must add a forwarder to VMware NSX. 
 
 1. In your Resource group, open your private cloud. 
 2. Expand Workload Networking and select DNS. 
 3. Select the Add button, select FQDN zone, enter your private cloud’s DNS zone name and Domain. For IP address enter the IP address of the inbound endpoint of your Azure DNS Private Resolver and select OK. 
 4. Select DNS Service. 
 5. Select Edit. 
 6. Select the zone you just created in the FQDN zones dropdown and select OK.  

 Your workload virtual machines can now resolve the private cloud management components. 

## Related topics
- [Connectivity to an Azure Virtual Network](native-network-connectivity.md)
- [Connect to on-premises environment](native-connect-on-premises.md)
- [Internet connectivity options](native-internet-connectivity-design-considerations.md)
- [Connect multiple Gen 2 private clouds](native-connect-multiple-private-clouds.md)
- [Connect Gen 2 and Gen 1 private clouds](native-connect-private-cloud-previous-edition.md)
