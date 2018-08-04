---
 title: include file
 description: include file
 services: firewall
 author: vhorne
 ms.service: 
 ms.topic: include
 ms.date: 7/19/2018
 ms.author: victorh
 ms.custom: include file
---

### What is Azure Firewall?

Azure Firewall is a managed, cloud-based network security service that protects your Azure Virtual Network resources. It is a fully stateful firewall-as-a-service with built-in high availability and unrestricted cloud scalability. You can centrally create, enforce, and log application and network connectivity policies across subscriptions and virtual networks. Azure Firewall is currently in public preview.

### What capabilities are supported in the Azure Firewall public preview release?  

* Stateful firewall as a Service
* Built-in high availability with unrestricted cloud scalability
* FQDN filtering 
* Network traffic filtering rules
* Outbound SNAT support
* Centrally create, enforce, and log application and network connectivity policies across Azure subscriptions and VNETs
* Fully integrated with Azure Monitor for logging and analytics 

### How can I join the Azure Firewall Public Preview?

Azure Firewall is currently a managed public preview that you can join by  using the Register-AzureRmProviderFeature PowerShell command as explained in the Azure Firewall Public Preview Documentation.

### What is the pricing for Azure Firewall?

Azure Firewall has a fixed cost + variable cost. The prices are below, and these are further discounted by 50% during public preview.

* Fixed fee: $1.25/firewall/hour
* Variable fee: $0.03/GB processed by the firewall (ingress or egress).

### What is the typical deployment model for Azure Firewall?

While it is possible to deploy Azure Firewall on any VNET, customers would typically deploy Azure Firewall in a central VNET and peer other VNETs to it in a Hub & Spoke model. You can then set the default route from the peered VNETs to point to this central Firewall VNET.

### How can I install the Azure Firewall?

Azure Firewall can set up via the Azure portal, PowerShell, REST API, or Templates. See [Tutorial: Deploy and configure Azure Firewall using the Azure portal](../articles/firewall/tutorial-firewall-deploy-portal.md) for step-by-step instructions.

### What are some Azure Firewall Concepts?

Azure Firewall supports rules and rule collections. A rule collection is a set of rules that shares the same order and priority. Rule collections are executed in order of their priority, Network rule collections are higher priority than application rule collections, all rules are terminating.
There are two types of rule collections:

* Application rules: Allows you to configure fully qualified domain names (FQDNs) that can be accessed from a subnet. 
* Network rules: Allows you to configure rules containing source address, protocol, destination port, and destination address. 

### Does Azure Firewall support inbound traffic filtering?

Azure Firewall public preview supports outbound filtering only. Inbound protection for non-HTTP/S protocols (ex: RDP, SSH, FTP) is tentatively planned for Azure Firewall GA.  
 
### What logging/analytics is supported by the Azure Firewall?

Azure Firewall is integrated with Azure Monitor for viewing and analyzing Firewall logs. Logs can be sent to Log Analytics, Azure Storage, or Event Hub. They can be analyzed in Log Analytics or by different tools such as Excel and Power BI. See [Tutorial: Monitor Azure Firewall logs](../articles/firewall/tutorial-diagnostics.md) for more details.

### How does Azure Firewall work relative to existing like NVAs in the marketplace?

Azure Firewall is a basic firewall service that can address certain customer scenarios. We expect customers to have a mix of 3rd party NVAs and Azure Firewall and are working with our partners on multiple better together opportunities. 
 
### What is the difference between Application Gateway WAF and Azure Firewall?

The Web Application Firewall (WAF) is a feature of Application Gateway that provides centralized inbound protection of your web applications from common exploits and vulnerabilities. Azure Firewall provides outbound network level protection for all ports and protocols and application level protection for outbound HTTP/S. Inbound protection for non-HTTP/S protocols (for example, RDP, SSH, FTP) is tentatively planned for Azure Firewall GA.

### What is the difference between Network Security Groups (NSG) and Azure Firewall?

The Azure firewall service complements our existing Network Security Group functionality and together provide better defense-in-depth network security. NSGs provide distributed network layer traffic filtering to limit traffic to resources within virtual networks in each subscription.  Azure Firewall is a fully stateful, centralized network firewall as-a-service, providing network and application level protection across different subscriptions and virtual networks (VNets). 

### How do I set up Azure Firewall with my service endpoints?

For secure access to PaaS services, we recommend Service Endpoints. Azure Firewall customers can choose to enable service endpoints in the Azure Firewall subnet and disable it on the connected spoke VNETs for benefitting from both features – service endpoint security and central logging for all traffic.

### What are the known service limits?

* Azure firewall has a soft limit of 1000 TB/firewall/month. 
* Azure firewall that is running in a central VNET is subject to VNET peering limitations: max of 50 spoke VNETs.  
* Azure Firewall cannot work with global peering, so customers should have at least one deployment of the Firewall per region.