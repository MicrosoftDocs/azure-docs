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

**Private**: The **private Domain Name System (DNS) forward lookup zone** ensures that names are resolvable only within a customer’s private environment, supporting security and compliance requirements. When a customer selects a private forward lookup zone, the Fully Qualified Domain Names (FQDNs) of the Software-Defined Data Center (SDDC) private cloud are resolvable only from the Azure Virtual Network where the private cloud is provisioned.

If you need these names to be resolvable outside of the Virtual Network (for example, in an on-premises environment), you must configure either an **Azure DNS Private Resolver** or deploy your own DNS server within the same Virtual Network as your Azure VMware Solution private cloud. The DNS server must then use the **Azure DNS service (168.63.129.16)** as a forwarder to resolve the private cloud FQDNs.

DNS forward lookup zone can be configured at the time of creation or changed after the private cloud is created. The following diagram shows the configuration page for the DNS forward lookup zone.

:::image type="content" source="./media/native-connectivity/native-connect-dns-lookup.png" alt-text="Diagram showing an Azure VMware Solution Gen 2 DNS forward lookup." lightbox="media/native-connectivity/native-connect-dns-lookup.png":::

## Using Public DNS Resolution with Azure VMware Solution Gen 2

Azure VMware Solution Gen 2 allows you to use public Domain Name System (DNS) resolution for fully qualified domain names such as the VMware vCenter Server or NSX Manager public endpoints. Public DNS resolution enables you to resolve these names to their corresponding private IP addresses.

### How Public DNS Resolution Works

Public DNS records resolve successfully from any location with internet access, including:
- Virtual machines inside the private cloud
- On-premises networks
- External networks

If you are testing name resolution from a workload segment inside Azure VMware Solution, ensure that internet access is enabled for the Private Cloud for workload networking, specifically using the "nsx-gw" and "nsx-gw-1 subnets. Without outbound internet access, DNS resolution to public DNS servers will not succeed.

### Verifying DNS Resolution

To verify that public DNS resolution is working:
1. Open a terminal or command prompt from any machine with internet access.
2. Run the following command:"nslookup vc123.eastus.avs.azure.com".

If DNS resolution is successful, the command returns a private IP address. If the command does not return an IP address, then either the DNS zone is private or the DNS server being used cannot reach the internet.

## Configure private DNS for your Azure VMware Solution Generation 2 private cloud  
 
If you select the Private DNS option, the private cloud will be resolvable from the Virtual Network where the private cloud is provisioned. This is done by linking the private DNS zone to your Virtual Network. If you need to enable this zone to be resolvable outside of this Virtual Network, such as in your on-premises environment, you need to configure an Azure DNS Private Resolver, or deploy your own DNS server in your Virtual Network. Private DNS will use the Azure DNS Service (168.63.129.16) to resolve your private cloud FQDNs. This section explains configuring an Azure DNS Private Resolver. 
 
 ### Prerequisite

 Create two /28 subnets to delegate to the Azure DNS Private Resolver service. As an example, they can be named ```dns-in``` and ```dns-out```.

 ### Deploy Azure DNS Private Resolver
 
 In the Resource Group, deploy the Private DNS Resolver. 
 
1. Select Create. 
 2. In the Search the Marketplace field, type Private DNS Resolver and select enter. 
 3. Select Create for the Private DNS Resolver. 
1. Ensure the Subscription, Resource group, and Region fields are correct. Enter a name and choose your Virtual Network. This virtual network must be the same as where you deployed your private cloud.

1. Select Next: Inbound Endpoints. 

 5. Select Add an Endpoint, enter a name for the Inbound endpoint, such as dns-in and select the subnet for the DNS inbound endpoint and select Save.
 6. Select Next: Outbound Endpoints. 
 7. Select Add an Endpoint, enter a name for the Outbound endpoint, such as dns-out and select the subnet for the DNS outbound endpoint and select Save.
 8. Select Next: Ruleset. 
 9. Select Next: Tags. 
 10. Select Next: Review + Create. 
 11. When the Validation passes, select Create. 
 
For more information on deploying Azure DNS Private Resolver, see this [page](/azure/dns/dns-private-resolver-overview). 

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

### Configure a forward lookup zone for your private cloud

After deploying the Azure DNS Private Resolver, you must create a forward lookup zone so that queries for your private cloud management components (such as vCenter Server, ESXi hosts, and NSX Manager) are correctly resolved.

To configure the forward lookup zone:

1. **Identify the DNS zone name** for your private cloud. The zone is typically derived from the Fully Qualified Domain Name (FQDN) of the vCenter Server. For example, if the vCenter Server URL is `https://vc123.avs.azure.com`, the DNS zone name is `avs.azure.com` (everything after `vc123`).
      
2. **Create a forward lookup zone** in your DNS solution (either your on-premises DNS server or a DNS server you deployed in the Azure Virtual Network of the private cloud). Use the DNS zone name identified above.
         
3. **Configure a forwarder** in that lookup zone. Point the zone to the IP address of the inbound endpoint of the Azure DNS Private Resolver that you deployed in the Virtual Network of the private cloud. This ensures that any DNS queries for private cloud FQDNs are forwarded to the Azure DNS Private Resolver.
   
**Example**:

vCenter Server URL: `https://vc123.avs.azure.com`

Forward lookup zone to create: `avs.azure.com`

Forwarder target: IP address of your Azure DNS Private Resolver inbound endpoint

Once complete, DNS queries for management components in your private cloud will resolve correctly from workloads within your Azure Virtual Network as well as from your on-premises environment.

## Related topics
- [Connectivity to an Azure Virtual Network](native-network-connectivity.md)
- [Connect to on-premises environment](native-connect-on-premises.md)
- [Internet connectivity options](native-internet-connectivity-design-considerations.md)
- [Connect multiple Gen 2 private clouds](native-connect-multiple-private-clouds.md)
- [Connect Gen 2 and Gen 1 private clouds](native-connect-private-cloud-previous-edition.md)
