---
title: Azure Firewall known issues and limitations
description: Learn about Azure Firewall known issues and limitations.
services: firewall
author: varunkalyana
ms.service: azure-firewall
ms.topic: concept-article
ms.date: 04/13/2025
ms.author: varunkalyana
---

# Azure Firewall known issues and limitations

This article lists the known issues for [Azure Firewall](overview.md) and is updated as they're resolved.

For Azure Firewall limitations, see [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-firewall-limits).

> [!IMPORTANT]
> **Capacity constraints**
> 
> The following zones are currently experiencing capacity constraints for both Standard and Premium SKUs:
> 
> | Zones | Restrictions | Recommendation |
> | -- | -- | -- |
> |- **Physical zone 2** in **_North Europe_** </br>- **Physical zone 3** in **_South East Asia_**  | - You can't deploy a new Azure Firewall to zone 3 in South East Asia or zone 2 in North Europe. </br></br>- If you stop an existing Azure Firewall that is deployed in these zone, it can't be restarted. </br></br>For more information, see [Physical and logical availability zones](../reliability/availability-zones-overview.md#physical-and-logical-availability-zones). | We recommend you deploy a new Azure Firewall to the remaining availability zones or use a different region. To configure an existing firewall, see [How can I configure availability zones after deployment?](firewall-faq.yml#how-can-i-configure-availability-zones-after-deployment) |

## Azure Firewall Standard

Azure Firewall Standard has the following known issues:

|Issue  |Description  |Mitigation  |
|---------|---------|---------|
|DNAT support for private IP addresses limited to Standard and Premium versions|Support for DNAT on Azure Firewall private IP address is intended for enterprises, so is limited to the Standard and Premium Firewall versions.| None|
|Azure Firewall deallocation and allocation process isn't supported when private IP DNAT rules are configured| The Azure Firewall allocation process will fail when private DNAT rules are configured | 1. Deallocate the Azure Firewall </br>2. Delete all the private IP DNAT rules </br>3. Allocate the Azure Firewall and wait until the private IP gets populated </br>4. Reconfigure the private IP DNAT rules with the appropriate private IP address |
|Network filtering rules for non-TCP/UDP protocols (for example ICMP) don't work for Internet bound traffic|Network filtering rules for non-TCP/UDP protocols don't work with SNAT to your public IP address. Non-TCP/UDP protocols are supported between spoke subnets and VNets.|Azure Firewall uses the Standard Load Balancer, [which doesn't support SNAT for IP protocols today](../load-balancer/outbound-rules.md#limitations). We're exploring options to support this scenario in a future release.|
|When an Azure Firewall is deallocated and then allocated again, sometimes it may be assigned a new private IP address that differs from the previous one.| After the deallocation and application process of the Azure Firewall, a private IP address is assigned dynamically from the Azure Firewall subnet. When a new private IP address is assigned that is different from the previous one, it will cause routing issues. |The existing User Defined Routes (UDRs) configured with the old private IP address will need to be reconfigured to reflect the new private IP address. A fix is being investigated to retain the private IP address after the allocation process.|
|Azure Firewall DNS proxy server configurations in the parent policy is not inherited by child policies.|Changes made to the Azure Firewall parent policy will result in DNS resolution failures for Fully Qualified Domain Name (FQDN) based rules within the child policies that are linked to the parent policy.| To avoid this issue, configure the DNS proxy settings directly on the child policies instead of relying on inheritance from the parent policy. A fix is being investigated to allow child policies to interhit DNS configurations from the parent policy.|
|Missing PowerShell and CLI support for ICMP|Azure PowerShell and CLI don't support ICMP as a valid protocol in network rules.|It's still possible to use ICMP as a protocol via the portal and the REST API. We're working to add ICMP in PowerShell and CLI soon.|
|FQDN tags require a protocol: port to be set|Application rules with FQDN tags require port: protocol definition.|You can use **https** as the port: protocol value. We're working to make this field optional when FQDN tags are used.|
|Moving a firewall to a different resource group or subscription isn't supported|Moving a firewall to a different resource group or subscription isn't supported.|Supporting this functionality is on our road map. To move a firewall to a different resource group or subscription, you must delete the current instance and recreate it in the new resource group or subscription.|
|Threat intelligence alerts might get masked|Network rules with destination 80/443 for outbound filtering masks threat intelligence alerts when configured to alert only mode.|Create outbound filtering for 80/443 using application rules. Or, change the threat intelligence mode to **Alert and Deny**.|
|With secured virtual hubs, availability zones can only be configured during deployment.| You can't configure Availability Zones after a firewall with secured virtual hubs is deployed.|This is by design.|
|SNAT on inbound connections|Inbound DNAT rules always require SNAT for return traffic. |To preserve the original source for HTTP/S, either configure clients or proxy (in on-prem or cloud) to inject the original IP in in [XFF](https://en.wikipedia.org/wiki/X-Forwarded-For) headers. Azure Firewall will always preserve the IP addresses in the XFF header and will also add the Firewall IP case to the XFF header when processing application rules for HTTP traffic and TLS terminated HTTPS traffic. 
|SQL FQDN filtering support only in proxy mode (port 1433)|For Azure SQL Database, Azure Synapse Analytics, and Azure SQL Managed Instance:<br><br>SQL FQDN filtering is supported in proxy-mode only (port 1433).<br><br>For Azure SQL IaaS:<br><br>If you're using nonstandard ports, you can specify those ports in the application rules.|For SQL in redirect mode (the default if connecting from within Azure), you can instead filter access using the SQL service tag as part of Azure Firewall network rules.|
|Outbound SMTP traffic on TCP port 25 is blocked|The Azure platform blocks outbound email messages sent directly to external domains (like `outlook.com` and `gmail.com`) on TCP port 25. This is the default platform behavior in Azure. Azure Firewall doesn't introduce any more specific restriction. |Use authenticated SMTP relay services, which typically connect through TCP port 587, but also supports other ports. For more information, see [Troubleshoot outbound SMTP connectivity problems in Azure](../virtual-network/troubleshoot-outbound-smtp-connectivity.md).<br><br>Another option is to deploy Azure Firewall in a standard Enterprise Agreement (EA) subscription. Azure Firewall in an EA subscription can communicate with public IP addresses using outbound TCP port 25. It might work in other subscription types, but it's not guaranteed. For private IP addresses like virtual networks, VPNs, and Azure ExpressRoute, Azure Firewall supports an outbound connection on TCP port 25.
|SNAT port exhaustion|Azure Firewall currently supports 2,496 ports per Public IP address per backend Virtual Machine Scale Set instance. By default, there are two Virtual Machine Scale Set instances. So, there are 4,992 ports per flow (destination IP, destination port, and protocol (TCP or UDP). The firewall scales up to a maximum of 20 instances. |This is a platform limitation. You can work around the limits by configuring Azure Firewall deployments with a minimum of five public IP addresses for deployments susceptible to SNAT exhaustion. This increases the SNAT ports available by five times. Allocate from an IP address prefix to simplify downstream permissions. For a more permanent solution, you can deploy a NAT gateway to overcome the SNAT port limits. This approach is supported for virtual network deployments. <br /><br /> For more information, see [Scale SNAT ports with Azure Virtual Network NAT](integrate-with-nat-gateway.md).|
|DNAT isn't supported with Forced Tunneling enabled|Firewalls deployed with Forced Tunneling enabled can't support inbound access from the Internet because of asymmetric routing.|This is by design because of asymmetric routing. The return path for inbound connections goes via the on-premises firewall, which hasn't seen the connection established.|
|Outbound Passive FTP might not work for Firewalls with multiple public IP addresses, depending on your FTP server configuration.|Passive FTP establishes different connections for control and data channels. When a Firewall with multiple public IP addresses sends data outbound, it randomly selects one of its public IP addresses for the source IP address. FTP might fail when data and control channels use different source IP addresses, depending on your FTP server configuration.|An explicit SNAT configuration is planned. In the meantime, you can configure your FTP server to accept data and control channels from different source IP addresses (see [an example for  IIS](/iis/configuration/system.applicationhost/sites/sitedefaults/ftpserver/security/datachannelsecurity)). Alternatively, consider using a single IP address in this situation.|
|Inbound Passive FTP might not work depending on your FTP server configuration |Passive FTP establishes different connections for control and data channels. Inbound connections on Azure Firewall are SNATed to one of the firewall private IP addresses to ensure symmetric routing. FTP might fail when data and control channels use different source IP addresses, depending on your FTP server configuration.|Preserving the original source IP address is being investigated. In the meantime, you can configure your FTP server to accept data and control channels from different source IP addresses.|
|Active FTP doesn't work when the FTP client must reach an FTP server across the internet.|Active FTP utilizes a PORT command from the FTP client that directs the FTP server what IP and port to use for the data channel. This PORT command utilizes the private IP of the client that can't be changed. Client-side traffic traversing the Azure Firewall is NATed for Internet-based communications, making the PORT command seen as invalid by the FTP server.|This is a general limitation of Active FTP when used with client-side NAT.|
|NetworkRuleHit metric is missing a protocol dimension|The ApplicationRuleHit metric allows filtering based protocol, but this capability is missing in the corresponding NetworkRuleHit metric.|A fix is being investigated.|
|NAT rules with ports between 64000 and 65535 are unsupported|Azure Firewall allows any port in the 1-65535 range in network and application rules, however NAT rules only support ports in the 1-63999 range.|This is a current limitation.
|Configuration updates might take five minutes on average|An Azure Firewall configuration update can take three to five minutes on average, and parallel updates aren't supported.|A fix is being investigated.|
|Azure Firewall uses SNI TLS headers to filter HTTPS and MSSQL traffic|If browser or server software doesn't support the Server Name Indicator (SNI) extension, you can't connect through Azure Firewall.|If browser or server software doesn't support SNI, then you might be able to control the connection using a network rule instead of an application rule. See [Server Name Indication](https://wikipedia.org/wiki/Server_Name_Indication) for software that supports SNI.|
|Can't add firewall policy tags using the portal or Azure Resource Manager (ARM) templates|Azure Firewall Policy has a patch support limitation that prevents you from adding a tag using the Azure portal or ARM templates. The following  error is generated: *Couldn't save the tags for the resource*.|A fix is being investigated. Or, you can use the Azure PowerShell cmdlet `Set-AzFirewallPolicy` to update tags.|
|IPv6 not currently supported|If you add an IPv6 address to a rule, the firewall fails.|Use only IPv4 addresses. IPv6 support is under investigation.|
|Removing RuleCollectionGroups using ARM templates not supported.|Removing a RuleCollectionGroup using ARM templates isn't supported and results in failure.|This isn't a supported operation.|
|DNAT rule for allow *any* (*) will SNAT traffic.|If a DNAT rule allows *any* (*) as the Source IP address, then an implicit Network rule matches VNet-VNet traffic and will always SNAT the traffic.|This is a current limitation.|
|Adding a DNAT rule to a secured virtual hub with a security provider isn't supported.|This results in an asynchronous route for the returning DNAT traffic, which goes to the security provider.|Not supported.|
| Error encountered when creating more than 2,000 rule collections. | The maximal number of NAT/Application or Network rule collections is 2000 (Resource Manager limit). | This is a current limitation. |
|Can’t deploy Firewall with Availability Zones with a newly created Public IP address|When you deploy a Firewall with Availability Zones, you can’t use a newly created Public IP address.|First create a new zone redundant Public IP address, then assign this previously created IP address during the Firewall deployment.|
|Associating a Public IP address with Azure Firewall is not supported in a cross-tenant scenario.|If you create a Public IP address in tenant A, you cannot associate it with a firewall deployed in tenant B.|None.|

## Azure Firewall Premium

> [!NOTE]
> Any issue that applies to Standard also applies to Premium.

Azure Firewall Premium has the following known issues:

|Issue  |Description  |Mitigation  |
|---------|---------|---------|
|ESNI support for FQDN resolution in HTTPS|Encrypted SNI isn't supported in HTTPS handshake.|Today only Firefox supports ESNI through custom configuration. Suggested workaround is to disable this feature.|
|Client Certification Authentication isn't supported|Client certificates are used to build a mutual identity trust between the client and the server. Client certificates are used during a TLS negotiation. Azure firewall renegotiates a connection with the server and has no access to the private key of the client certificates.|None|
|QUIC/HTTP3|QUIC is the new major version of HTTP. It's a UDP-based protocol over 80 (PLAN) and 443 (SSL). FQDN/URL/TLS inspection isn't supported.|Configure passing UDP 80/443 as network rules.|
Untrusted customer signed certificates|Customer signed certificates aren't trusted by the firewall once received from an intranet-based web server.|A fix is being investigated.
|Wrong source IP address in Alerts with IDPS for HTTP (without TLS inspection).|When plain text HTTP traffic is in use, and IDPS issues a new alert, and the destination is a public IP address, the displayed source IP address is wrong (the internal IP address is displayed instead of the original IP address).|A fix is being investigated.|
|Certificate Propagation|After a CA certificate is applied on the firewall, it might take between 5-10 minutes for the certificate to take effect.|A fix is being investigated.|
|TLS 1.3 support|TLS 1.3 is partially supported. The TLS tunnel from client to the firewall is based on TLS 1.2, and from the firewall to the external Web server is based on TLS 1.3.|Updates are being investigated.|
|TLSi intermediate CA certificate expiration|In some unique cases, the intermediate CA certificate can expire two months before the original expiration date.|Renew the intermediate CA certificate two months before the original expiration date. A fix is being investigated.|

## Next steps

- [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-firewall-limits)
- [Azure Firewall Premium features](premium-features.md)
- [Learn more about Azure network security](../networking/security/index.yml)
