---
title: What is Azure Firewall?
description: Azure Firewall is a managed, cloud-based network security service that protects your Azure Virtual Network resources.
author: vhorne
ms.author: victorh
ms.service: firewall
services: firewall
ms.topic: overview
ms.custom: mvc, contperf-fy21q1, references_regions
ms.date: 11/07/2022

# Customer intent: As an administrator, I want to evaluate Azure Firewall so I can determine if I want to use it.
---

# What is Azure Firewall?

Azure Firewall is a cloud-native and intelligent network firewall security service that provides the best of breed threat protection for your cloud workloads running in Azure. It's a fully stateful, firewall as a service with built-in high availability and unrestricted cloud scalability. It provides both east-west and north-south traffic inspection. To learn what's east-west and north-south traffic, see [East-west and north-south traffic](/azure/architecture/framework/security/design-network-flow#east-west-and-north-south-traffic).

Azure Firewall is offered in three SKUs: Standard, Premium, and Basic.


## Azure Firewall Standard

   Azure Firewall Standard provides L3-L7 filtering and threat intelligence feeds directly from Microsoft Cyber Security. Threat intelligence-based filtering can alert and deny traffic from/to known malicious IP addresses and domains that are updated in real time to protect against new and emerging attacks.

   ![Firewall Standard overview](media/overview/firewall-standard.png)

To learn about Firewall Standard features, see [Azure Firewall Standard features](features.md).


## Azure Firewall Premium

   Azure Firewall Premium provides advanced capabilities include signature-based IDPS to allow rapid detection of attacks by looking for specific patterns. These patterns can include byte sequences in network traffic, or known malicious instruction sequences used by malware. There are more than 58,000 signatures in over 50 categories that are updated in real time to protect against new and emerging exploits. The exploit categories include malware, phishing, coin mining, and Trojan attacks.

   ![Firewall Premium overview](media/overview/firewall-premium.png)


To learn about Firewall Premium features, see [Azure Firewall Premium features](premium-features.md).

## Azure Firewall Basic

Azure Firewall Basic is intended for small and medium size (SMB) customers to secure their Azure cloud 
environments. It provides the essential protection SMB customers need at an affordable price point.

:::image type="content" source="media/overview/firewall-basic-diagram.png" alt-text="Diagram showing Firewall Basic.":::

Azure Firewall Basic is similar to Firewall Standard, but has the following main limitations:

- Supports Threat Intel *alert mode* only.
- Fixed scale unit to run the service on two virtual machine backend instances.
- Recommended for environments with an estimated throughput of 250 Mbps.

To deploy a Basic Firewall, see [Deploy and configure Azure Firewall Basic and policy using the Azure portal](deploy-firewall-basic-portal-policy.md).

## Azure Firewall Manager

You can use Azure Firewall Manager to centrally manage Azure Firewalls across multiple subscriptions. Firewall Manager uses firewall policy to apply a common set of network/application rules and configuration to the firewalls in your tenant.
 
Firewall Manager supports firewalls in both VNet and Virtual WANs (Secure Virtual Hub) environments. Secure Virtual Hubs use the Virtual WAN route automation solution to simplify routing traffic to the firewall with just a few steps.

To learn more about Azure Firewall Manager, see [Azure Firewall Manager](../firewall-manager/overview.md).

## Pricing and SLA

For Azure Firewall pricing information, see [Azure Firewall pricing](https://azure.microsoft.com/pricing/details/azure-firewall/).

For Azure Firewall SLA information, see [Azure Firewall SLA](https://azure.microsoft.com/support/legal/sla/azure-firewall/).

## Supported regions

For the supported regions for Azure Firewall, see [Azure products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=azure-firewall).

## What's new

To learn what's new with Azure Firewall, see [Azure updates](https://azure.microsoft.com/updates/?category=networking&query=Azure%20Firewall).


## Known issues

### Azure Firewall Standard

Azure Firewall Standard has the following known issues:

> [!NOTE]
> Any issue that applies to Standard also applies to Premium.

|Issue  |Description  |Mitigation  |
|---------|---------|---------|
|Network filtering rules for non-TCP/UDP protocols (for example ICMP) don't work for Internet bound traffic|Network filtering rules for non-TCP/UDP protocols don't work with SNAT to your public IP address. Non-TCP/UDP protocols are supported between spoke subnets and VNets.|Azure Firewall uses the Standard Load Balancer, [which doesn't support SNAT for IP protocols today](../load-balancer/outbound-rules.md#limitations). We're exploring options to support this scenario in a future release.|
|Missing PowerShell and CLI support for ICMP|Azure PowerShell and CLI don't support ICMP as a valid protocol in network rules.|It's still possible to use ICMP as a protocol via the portal and the REST API. We're working to add ICMP in PowerShell and CLI soon.|
|FQDN tags require a protocol: port to be set|Application rules with FQDN tags require port: protocol definition.|You can use **https** as the port: protocol value. We're working to make this field optional when FQDN tags are used.|
|Moving a firewall to a different resource group or subscription isn't supported|Moving a firewall to a different resource group or subscription isn't supported.|Supporting this functionality is on our road map. To move a firewall to a different resource group or subscription, you must delete the current instance and recreate it in the new resource group or subscription.|
|Threat intelligence alerts may get masked|Network rules with destination 80/443 for outbound filtering masks threat intelligence alerts when configured to alert only mode.|Create outbound filtering for 80/443 using application rules. Or, change the threat intelligence mode to **Alert and Deny**.|
|Azure Firewall DNAT doesn't work for private IP destinations|Azure Firewall DNAT support is limited to Internet egress/ingress. DNAT doesn't currently work for private IP destinations. For example, spoke to spoke.|A fix is being investigated.|
|Availability zones can only be configured during deployment.|Availability zones can only be configured during deployment. You can't configure Availability Zones after a firewall has been deployed.|This is by design.|
|SNAT on inbound connections|In addition to DNAT, connections via the firewall public IP address (inbound) are SNATed to one of the firewall private IPs. This requirement today (also for Active/Active NVAs) to ensure symmetric routing.|To preserve the original source for HTTP/S, consider using [XFF](https://en.wikipedia.org/wiki/X-Forwarded-For) headers. For example, use a service such as [Azure Front Door](../frontdoor/front-door-http-headers-protocol.md#from-the-front-door-to-the-backend) or [Azure Application Gateway](../application-gateway/rewrite-http-headers-url.md) in front of the firewall. You can also add WAF as part of Azure Front Door and chain to the firewall.
|SQL FQDN filtering support only in proxy mode (port 1433)|For Azure SQL Database, Azure Synapse Analytics, and Azure SQL Managed Instance:<br><br>SQL FQDN filtering is supported in proxy-mode only (port 1433).<br><br>For Azure SQL IaaS:<br><br>If you're using non-standard ports, you can specify those ports in the application rules.|For SQL in redirect mode (the default if connecting from within Azure), you can instead filter access using the SQL service tag as part of Azure Firewall network rules.
|Outbound SMTP traffic on TCP port 25 is blocked|Outbound email messages that are sent directly to external domains (like `outlook.com` and `gmail.com`) on TCP port 25 can be blocked by Azure platform. This is the default platform behavior in Azure, Azure Firewall doesn't introduce any more specific restriction. |Use authenticated SMTP relay services, which typically connect through TCP port 587, but also supports other ports.  For more information, see [Troubleshoot outbound SMTP connectivity problems in Azure](../virtual-network/troubleshoot-outbound-smtp-connectivity.md). Currently, Azure Firewall may be able to communicate to public IPs by using outbound TCP 25, but it's not guaranteed to work, and it's not supported for all subscription types. For private IPs like virtual networks, VPNs, and Azure ExpressRoute, Azure Firewall supports an outbound connection of TCP port 25.
|SNAT port exhaustion|Azure Firewall currently supports 2496 ports per Public IP address per backend Virtual Machine Scale Set instance. By default, there are two Virtual Machine Scale Set instances. So, there are 4992 ports per flow (destination IP, destination port and protocol (TCP or UDP).  The firewall scales up to a maximum of 20 instances. |This is a platform limitation. You can work around the limits by configuring Azure Firewall deployments with a minimum of five public IP addresses for deployments susceptible to SNAT exhaustion. This increases the SNAT ports available by five times. Allocate from an IP address prefix to simplify downstream permissions. For a more permanent solution, you can deploy a NAT gateway to overcome the SNAT port limits. This approach is supported for VNET deployments. <br /><br /> For more information, see [Scale SNAT ports with Azure Virtual Network NAT](integrate-with-nat-gateway.md).|
|DNAT isn't supported with Forced Tunneling enabled|Firewalls deployed with Forced Tunneling enabled can't support inbound access from the Internet because of asymmetric routing.|This is by design because of asymmetric routing. The return path for inbound connections goes via the on-premises firewall, which hasn't seen the connection established.
|Outbound Passive FTP may not work for Firewalls with multiple public IP addresses, depending on your FTP server configuration.|Passive FTP establishes different connections for control and data channels. When a Firewall with multiple public IP addresses sends data outbound, it randomly selects one of its public IP addresses for the source IP address. FTP may fail when data and control channels use different source IP addresses, depending on your FTP server configuration.|An explicit SNAT configuration is planned. In the meantime, you can configure your FTP server to accept data and control channels from different source IP addresses (see [an example for  IIS](/iis/configuration/system.applicationhost/sites/sitedefaults/ftpserver/security/datachannelsecurity)). Alternatively, consider using a single IP address in this situation.|
|Inbound Passive FTP may not work depending on your FTP server configuration |Passive FTP establishes different connections for control and data channels. Inbound connections on Azure Firewall are SNATed to one of the firewall private IP addresses to ensure symmetric routing. FTP may fail when data and control channels use different source IP addresses, depending on your FTP server configuration.|Preserving the original source IP address is being investigated. In the meantime, you can configure your FTP server to accept data and control channels from different source IP addresses.|
|Active FTP won't work when the FTP client must reach an FTP server across the internet.|Active FTP utilizes a PORT command from the FTP client that directs the FTP server what IP and port to use for the data channel. This PORT command utilizes the private IP of the client that can't be changed. Client-side traffic traversing the Azure Firewall will be NAT for Internet-based communications, making the PORT command seen as invalid by the FTP server.|This is a general limitation of Active FTP when used with client-side NAT.|
|NetworkRuleHit metric is missing a protocol dimension|The ApplicationRuleHit metric allows filtering based protocol, but this capability is missing in the corresponding NetworkRuleHit metric.|A fix is being investigated.|
|NAT rules with ports between 64000 and 65535 are unsupported|Azure Firewall allows any port in the 1-65535 range in network and application rules, however NAT rules only support ports in the 1-63999 range.|This is a current limitation.
|Configuration updates may take five minutes on average|An Azure Firewall configuration update can take three to five minutes on average, and parallel updates aren't supported.|A fix is being investigated.|
|Azure Firewall uses SNI TLS headers to filter HTTPS and MSSQL traffic|If browser or server software doesn't support the Server Name Indicator (SNI) extension, you can't connect through Azure Firewall.|If browser or server software doesn't support SNI, then you may be able to control the connection using a network rule instead of an application rule. See [Server Name Indication](https://wikipedia.org/wiki/Server_Name_Indication) for software that supports SNI.|
|Can't add firewall policy tags using the portal or Azure Resource Manager (ARM) templates|Azure Firewall Policy has a patch support limitation that prevents you from adding a tag using the Azure portal or ARM templates. The following  error is generated: *Couldn't save the tags for the resource*.|A fix is being investigated. Or, you can use the Azure PowerShell cmdlet `Set-AzFirewallPolicy` to update tags.|
|IPv6 not currently supported|If you add an IPv6 address to a rule, the firewall fails.|Use only IPv4 addresses. IPv6 support is under investigation.|
|Updating multiple IP Groups fails with conflict error.|When you update two or more IP Groups attached to the same firewall, one of the resources goes into a failed state.|This is a known issue/limitation. <br><br>When you update an IP Group, it triggers an update on all firewalls that the IPGroup is attached to. If an update to a second IP Group is started while the firewall is still in the *Updating* state, then the IPGroup update fails.<br><br>To avoid the failure, IP Groups attached to the same firewall must be updated one at a time. Allow enough time between updates to allow the firewall to get out of the *Updating* state.|
|Removing RuleCollectionGroups using ARM templates not supported.|Removing a RuleCollectionGroup using ARM templates isn't supported and results in failure.|This isn't a supported operation.|
|DNAT rule for allow *any* (*) will SNAT traffic.|If a DNAT rule allows *any* (*) as the Source IP address, then an implicit Network rule matches VNet-VNet traffic and will always SNAT the traffic.|This is a current limitation.|
|Adding a DNAT rule to a secured virtual hub with a security provider isn't supported.|This results in an asynchronous route for the returning DNAT traffic, which goes to the security provider.|Not supported.|
| Error encountered when creating more than 2000 rule collections. | The maximal number of NAT/Application or Network rule collections is 2000 (Resource Manager limit). | This is a current limitation. |
|XFF header in HTTP/S|XFF headers are overwritten with the original source IP address as seen by the firewall. This is applicable for the following use cases:<br>- HTTP requests<br>- HTTPS requests with TLS termination|A fix is being investigated.|
|Can't upgrade to Premium with Availability Zones in the Southeast Asia region|You can't currently upgrade to Azure Firewall Premium with Availability Zones in the Southeast Asia region.|Deploy a new Premium firewall in Southeast Asia without Availability Zones, or deploy in a region that supports Availability Zones.|
|Can’t deploy Firewall with Availability Zones with a newly created Public IP address|When you deploy a Firewall with Availability Zones, you can’t use a newly created Public IP address.|First create a new zone redundant Public IP address, then assign this previously created IP address during the Firewall deployment.|
|Azure private DNS zone isn't supported with Azure Firewall|Azure private DNS zone won't work with Azure Firewall regardless of Azure Firewall DNS settings.|To achieve the desire state of using a private DNS server, use Azure Firewall DNS proxy instead of an Azure private DNS zone.|

### Azure Firewall Premium

Azure Firewall Premium has the following known issues:


|Issue  |Description  |Mitigation  |
|---------|---------|---------|
|ESNI support for FQDN resolution in HTTPS|Encrypted SNI isn't supported in HTTPS handshake.|Today only Firefox supports ESNI through custom configuration. Suggested workaround is to disable this feature.|
|Client Certification Authentication isn't supported|Client certificates are used to build a mutual identity trust between the client and the server. Client certificates are used during a TLS negotiation. Azure firewall renegotiates a connection with the server and has no access to the private key of the client certificates.|None|
|QUIC/HTTP3|QUIC is the new major version of HTTP. It's a UDP-based protocol over 80 (PLAN) and 443 (SSL). FQDN/URL/TLS inspection won't be supported.|Configure passing UDP 80/443 as network rules.|
Untrusted customer signed certificates|Customer signed certificates aren't trusted by the firewall once received from an intranet-based web server.|A fix is being investigated.
|Wrong source IP address in Alerts with IDPS for HTTP (without TLS inspection).|When plain text HTTP traffic is in use, and IDPS issues a new alert, and the destination is a public IP address, the displayed source IP address is wrong (the internal IP address is displayed instead of the original IP address).|A fix is being investigated.|
|Certificate Propagation|After a CA certificate is applied on the firewall, it may take between 5-10 minutes for the certificate to take effect.|A fix is being investigated.|
|TLS 1.3 support|TLS 1.3 is partially supported. The TLS tunnel from client to the firewall is based on TLS 1.2, and from the firewall to the external Web server is based on TLS 1.3.|Updates are being investigated.|
|Availability Zones for Firewall Premium in the Southeast Asia region|You can't currently deploy Azure Firewall Premium with Availability Zones in the Southeast Asia region.|Deploy the firewall in Southeast Asia without Availability Zones, or deploy in a region that supports Availability Zones.|
|TLSi intermediate CA certificate expiration|In some unique cases, the intermediate CA certificate can expire two months before the original expiration date.|Renew the intermediate CA certificate two months before the original expiration date. A fix is being investigated.|

## Next steps

- [Quickstart: Create an Azure Firewall and a firewall policy - ARM template](../firewall-manager/quick-firewall-policy.md)
- [Quickstart: Deploy Azure Firewall with Availability Zones - ARM template](deploy-template.md)
- [Tutorial: Deploy and configure Azure Firewall using the Azure portal](tutorial-firewall-deploy-portal.md)
- [Learn module: Introduction to Azure Firewall](/training/modules/introduction-azure-firewall/)
