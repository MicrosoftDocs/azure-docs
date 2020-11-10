---
title: What is Azure Firewall?
description: Azure Firewall is a managed, cloud-based network security service that protects your Azure Virtual Network resources.
author: vhorne
ms.service: firewall
services: firewall
ms.topic: overview
ms.custom: mvc, contperfq1
ms.date: 11/09/2020
ms.author: victorh
Customer intent: As an administrator, I want to evaluate Azure Firewall so I can determine if I want to use it.
---

# What is Azure Firewall?

![ICSA certification](media/overview/icsa-cert-firewall-small.png)

Azure Firewall is a managed, cloud-based network security service that protects your Azure Virtual Network resources. It's a fully stateful firewall as a service with built-in high availability and unrestricted cloud scalability.

![Firewall overview](media/overview/firewall-threat.png)

You can centrally create, enforce, and log application and network connectivity policies across subscriptions and virtual networks. Azure Firewall uses a static public IP address for your virtual network resources allowing outside firewalls to identify traffic originating from your virtual network.  The service is fully integrated with Azure Monitor for logging and analytics.

## Features

To learn about Azure Firewall features, see [Azure Firewall features](features.md).

## Known issues

Azure Firewall has the following known issues:

|Issue  |Description  |Mitigation  |
|---------|---------|---------|
Network filtering rules for non-TCP/UDP protocols (for example ICMP) don't work for Internet bound traffic|Network filtering rules for non-TCP/UDP protocols don't work with SNAT to your public IP address. Non-TCP/UDP protocols are supported between spoke subnets and VNets.|Azure Firewall uses the Standard Load Balancer, [which doesn't support SNAT for IP protocols today](https://docs.microsoft.com/azure/load-balancer/load-balancer-overview). We're exploring options to support this scenario in a future release.|
|Missing PowerShell and CLI support for ICMP|Azure PowerShell and CLI don't support ICMP as a valid protocol in network rules.|It's still possible to use ICMP as a protocol via the portal and the REST API. We're working to add ICMP in PowerShell and CLI soon.|
|FQDN tags require a protocol: port to be set|Application rules with FQDN tags require port: protocol definition.|You can use **https** as the port: protocol value. We're working to make this field optional when FQDN tags are used.|
|Moving a firewall to a different resource group or subscription isn't supported|Moving a firewall to a different resource group or subscription isn't supported.|Supporting this functionality is on our road map. To move a firewall to a different resource group or subscription, you must delete the current instance and recreate it in the new resource group or subscription.|
|Threat intelligence alerts may get masked|Network rules with destination 80/443 for outbound filtering masks threat intelligence alerts when configured to alert only mode.|Create outbound filtering for 80/443 using application rules. Or, change the threat intelligence mode to **Alert and Deny**.|
|Azure Firewall DNAT doesn't work for private IP destinations|Azure Firewall DNAT support is limited to Internet egress/ingress. DNAT doesn't currently work for private IP destinations. For example, spoke to spoke.|This is a current limitation.|
|Can't remove first public IP configuration|Each Azure Firewall public IP address is assigned to an *IP configuration*.  The first IP configuration is assigned during the firewall deployment, and typically also contains a reference to the firewall subnet (unless configured explicitly differently via a template deployment). You can't delete this IP configuration because it would de-allocate the firewall. You can still change or remove the public IP address associated with this IP configuration if the firewall has at least one other public IP address available to use.|This is by design.|
|Availability zones can only be configured during deployment.|Availability zones can only be configured during deployment. You can't configure Availability Zones after a firewall has been deployed.|This is by design.|
|SNAT on inbound connections|In addition to DNAT, connections via the firewall public IP address (inbound) are SNATed to one of the firewall private IPs. This requirement today (also for Active/Active NVAs) to ensure symmetric routing.|To preserve the original source for HTTP/S, consider using [XFF](https://en.wikipedia.org/wiki/X-Forwarded-For) headers. For example, use a service such as [Azure Front Door](../frontdoor/front-door-http-headers-protocol.md#front-door-to-backend) or [Azure Application Gateway](../application-gateway/rewrite-http-headers.md) in front of the firewall. You can also add WAF as part of Azure Front Door and chain to the firewall.
|SQL FQDN filtering support only in proxy mode (port 1433)|For Azure SQL Database, Azure Synapse Analytics, and Azure SQL Managed Instance:<br><br>SQL FQDN filtering is supported in proxy-mode only (port 1433).<br><br>For Azure SQL IaaS:<br><br>If you're using non-standard ports, you can specify those ports in the application rules.|For SQL in redirect mode (the default if connecting from within Azure), you can instead filter access using the SQL service tag as part of Azure Firewall network rules.
|Outbound traffic on TCP port 25 isn't allowed| Outbound SMTP connections that use TCP port 25 are blocked. Port 25 is primarily used for unauthenticated email delivery. This is the default platform behavior for virtual machines. For more information, see more [Troubleshoot outbound SMTP connectivity issues in Azure](../virtual-network/troubleshoot-outbound-smtp-connectivity.md). However, unlike virtual machines, it isn't currently possible to enable this functionality on Azure Firewall. Note: to allow authenticated SMTP (port 587) or SMTP over a port other than 25, please make sure you configure a network rule and not an application rule as SMTP inspection is not supported at this time.|Follow the recommended method to send email, as documented in the SMTP troubleshooting article. Or, exclude the virtual machine that needs outbound SMTP access from your default route to the firewall. Instead, configure outbound access directly to the internet.
|Active FTP isn't supported|Active FTP is disabled on Azure Firewall to protect against FTP bounce attacks using the FTP PORT command.|You can use Passive FTP instead. You must still explicitly open TCP ports 20 and 21 on the firewall.
|SNAT port utilization metric shows 0%|The Azure Firewall SNAT port utilization metric may show 0% usage even when SNAT ports are used. In this case, using the metric as part of the firewall health metric provides an incorrect result.|This issue has been fixed and rollout to production is targeted for May 2020. In some cases, firewall redeployment resolves the issue, but it's not consistent. As an intermediate workaround, only use the firewall health state to look for *status=degraded*, not for *status=unhealthy*. Port exhaustion will show as *degraded*. *Not healthy* is reserved for future use when the are more metrics to impact the firewall health.
|DNAT isn't supported with Forced Tunneling enabled|Firewalls deployed with Forced Tunneling enabled can't support inbound access from the Internet because of asymmetric routing.|This is by design because of asymmetric routing. The return path for inbound connections goes via the on-premises firewall, which hasn't seen the connection established.
|Outbound Passive FTP may not work for Firewalls with multiple public IP addresses, depending on your FTP server configuration.|Passive FTP establishes different connections for control and data channels. When a Firewall with multiple public IP addresses sends data outbound, it randomly selects one of its public IP addresses for the source IP address. FTP may fail when data and control channels use different source IP addresses, depending on your FTP server configuration.|An explicit SNAT configuration is planned. In the meantime, you can configure your FTP server to accept data and control channels from different source IP addresses (see [an example for  IIS](https://docs.microsoft.com/iis/configuration/system.applicationhost/sites/sitedefaults/ftpserver/security/datachannelsecurity)). Alternatively, consider using a single IP address in this situation.|
|Inbound Passive FTP may not work depending on your FTP server configuration |Passive FTP establishes different connections for control and data channels. Inbound connections on Azure Firewall are SNATed to one of the firewall private IP address to ensure symmetric routing. FTP may fail when data and control channels use different source IP addresses, depending on your FTP server configuration.|Preserving the original source IP address is being investigated. In the meantime, you can configure your FTP server to accept data and control channels from different source IP addresses.|
|NetworkRuleHit metric is missing a protocol dimension|The ApplicationRuleHit metric allows filtering based protocol, but this capability is missing in the corresponding NetworkRuleHit metric.|A fix is being investigated.|
|NAT rules with ports between 64000 and 65535 are unsupported|Azure Firewall allows any port in the 1-65535 range in network and application rules, however NAT rules only support ports in the 1-63999 range.|This is a current limitation.
|Configuration updates may take five minutes on average|An Azure Firewall configuration update can take three to five minutes on average, and parallel updates aren't supported.|A fix is being investigated.|
|Azure Firewall uses SNI TLS headers to filter HTTPS and MSSQL traffic|If browser or server software does not support the Server Name Indicator (SNI) extension, you won't be able to connect through Azure Firewall.|If browser or server software does not support SNI, then you may be able to control the connection using a network rule instead of an application rule. See [Server Name Indication](https://wikipedia.org/wiki/Server_Name_Indication) for software that supports SNI.|
|Custom DNS doesn't work with forced tunneling|If force tunneling is enabled, custom DNS doesn't work.|A fix is being investigated.|
|New public IP address support for multiple Availability Zones|You can't add a new public IP address when you deploy a firewall with two availability zones (either 1 and 2, 2 and 3, or 1 and 3)|This is a public IP address resource limitation.|
|Start/Stop doesn’t work with a firewall configured in forced-tunnel mode|Start/stop doesn’t work with Azure firewall configured in forced-tunnel mode. Attempting to start Azure Firewall with forced tunneling configured results in the following error:<br><br>*Set-AzFirewall: AzureFirewall FW-xx management IP configuration cannot be added to an existing firewall. Redeploy with a management IP configuration if you want to use forced tunneling support.<br>StatusCode: 400<br>ReasonPhrase: Bad Request*|Under investigation.<br><br>As a workaround, you can delete the existing firewall and create a new one with the same parameters.|
|Can't add firewall policy tags using the portal|Azure Firewall Policy has a patch support limitation that prevents you from adding a tag using the Azure portal. The following  error is generated: *Could not save the tags for the resource*.|A fix is being investigated. Alternatively, you can use the Azure PowerShell cmdlet `Set-AzFirewallPolicy` to update tags.


## Next steps

- [Tutorial: Deploy and configure Azure Firewall using the Azure portal](tutorial-firewall-deploy-portal.md)
- [Deploy Azure Firewall using a template](deploy-template.md)
- [Create an Azure Firewall test environment](scripts/sample-create-firewall-test.md)
