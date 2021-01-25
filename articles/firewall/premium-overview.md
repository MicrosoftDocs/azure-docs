---
title: What is Azure Firewall Premium Preview?
description: Azure Firewall Premium is a managed, cloud-based network security service that protects your Azure Virtual Network resources.
author: vhorne
ms.service: firewall
services: firewall
ms.topic: conceptual
ms.date: 01/25/2021
ms.author: victorh
---

# What is Azure Firewall Premium Preview?

> [!IMPORTANT]
> Azure Firewall Premium is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

 Azure Firewall Premium Preview is a next generation firewall with capabilities that are required for highly sensitive and regulated environments. 

Azure Firewall Premium Preview uses Firewall Policy, a global resource that can be used to centrally manage your firewalls using Azure Firewall Manager. Starting this release, all new features are configurable via Firewall Policy only. Firewall Rules (classic) continues to be supported and can be used to configure existing Standard Firewall features.  Firewall Policy can be managed independently or with Azure Firewall Manager. A firewall policy associated with a single firewall has no charge. 

Azure Firewall Premium Preview includes the following features:

- **TLS inspection** - decrypts outbound traffic, processes the data, then encrypts the data and sends it to the destination.
- **IDPS** - A network intrusion detection and prevention system (IDPS) allows you to monitor network activities for malicious activity, log information about this activity, report it, and optionally attempt to block it.
- **URL filtering** - extends Azure Firewall’s FQDN filtering capability to consider an entire URL. For example, `www.contoso.com/a/c` instead of `www.contoso.com`.
- **Web categories** - administrators can allow or deny user access to website categories such as gambling websites, social media websites, and others.

## Features

### TLS inspection

Transport Layer Security (TLS), previously known as Secure Sockets Layer (SSL), is the standard security technology for establishing an encrypted link between a client and a server. This link ensures that all data passed between the client and server remain private and encrypted.  

Azure Firewall Premium Preview decrypts the outbound traffic, does the required value-added security services, and then encrypts the traffic and sends it to the original destination. 

There are several advantages of doing TLS inspection on Azure Firewall: 

- Enhanced Visibility: logs and metrics are available for all decrypted traffic. 

- URL Filtering: TLS Inspection is an enabler for advanced security services, such as URL Filtering. An URL, as opposed to a FQDN, isn't accessible to the firewall when traffic is encrypted. URLs provide stricter outbound traffic filtering for domains that are common for different customers (for example, OneDrive.live.com). 

- IDPS: while some detections can be done for encrypted traffic, TLS inspection is important to use the best of IDPS. 

- Threat Intelligence based filtering works better for shared domains when URLs are visible (for example, CDN).

 

While you're probably interested in having TLS inspection for both outbound and inbound scenarios, Azure Firewall Premium Preview only focuses on outbound and internal scenarios. If you're interested in inbound TLS inspection, you can chain Azure Firewall with Azure Web Application Firewall on Azure Application Gateway for that purpose. For more information, see [Azure Virtual Network security](https://docs.microsoft.com/azure/architecture/example-scenario/gateway/firewall-application-gateway). 

### IDPS

A network intrusion detection and prevention system (IDPS) allows you to monitor your network for malicious activity, log information about this activity, report it, and optionally attempt to block it. 

Azure Firewall Premium Preview provides signature-based IDPS to allow rapid detection of attacks by looking for specific patterns, such as byte sequences in network traffic, or known malicious instruction sequences used by malware. 

IDPS allows you to detect attacks in all ports and protocols for non-encrypted traffic. However, when HTTPS traffic needs to be inspected, Azure Firewall can utilize its TLS inspection capability to decrypt the traffic and better detect malicious activities.  

The IDPS Bypass List allows you to not filter traffic to any of the IP addresses, ranges, and subnets specified in the bypass list.  

IDPS will never filter traffic for Office365 or Azure PaaS ranges as defined by a Service Tag. 

### URL filtering

URL filtering extends Azure Firewall’s FQDN filtering capability to consider an entire URL. For example, `www.contoso.com/a/c` instead of `www.contoso.com`.  

URL Filtering can be applied both on HTTP and HTTPS traffic. When HTTPS traffic is inspected, Azure Firewall Premium Preview can use its TLS inspection capability to decrypt the traffic and extract the target URL to validate whether access is permitted. TLS inspection requires opt-in at the application rule level. Once enabled, you can use URLs for filtering with HTTPS. 

### Web categories

Web categories lets administrators allow or deny user access to web site categories such as gambling websites, social media websites, and others. Web categories will also be included in Azure Firewall Standard, but it will be more fine-tuned in Azure Firewall Premium Preview. As opposed to the Web categories capability in the Standard SKU that matches the category based on an FQDN, the Premium SKU matches the category according to the entire URL for both HTTP and HTTPS traffic. 

For example, if Azure Firewall intercepts an HTTPS request for `www.google.com/news`, the following categorization is expected: 

- Firewall Standard – only the FQDN part will be examined, so `www.google.com` will be categorized as *Search Engine*. 

- Firewall Premium – the complete URL will be examined, so `www.google.com/news` will be categorized as *News*.

## Known issues

Azure Firewall Premium Preview has the following known issues:

|Issue  |Description  |Mitigation  |
|---------|---------|---------|
|TLS Inspection supported only on HTTPS standard port|TLS Inspection supports HTTPS/443 only|None.<br>Other ports/protocols to be added by GA|
|ESNI support for FQDN resolution in HTTPS|Encrypted SNI is not supported in HTTPS handshake|Today only Firefox supports ESNI through custom configuration. Suggested mitigation is to use another browser.|
|TLS 1.0 & 1.1|TLS 1.0 & 1.1 are being deprecated and won’t be supported. TLS 1.0 & 1.1 versions of TLS/Secure Sockets Layer (SSL) have been found to be vulnerable and while they still currently work to allow backwards compatibility, they are not recommended.|Shift to TLS 1.2|
|PaaS Inbound Traffic|The TLS inspection can't generate valid certificates because Internet clients do not trust the customer's CA.|None|
|Untrusted Certificates|Users may connect from time to time to servers with untrusted certificates. Azure Firewall will drop the connection as if the server terminated the connection.|None
|Client Certificates (TLS)|Client certificates are used to build a mutual identity trust between the client and the server. Client certificates are used during a TLS negotiation. Azure firewall re-negotiates a connection with the server and has no access to the private key of the client certificates.|None|
|QUIC/HTTP3|QUIC is the new major version of HTTP. It is a UDP based protocol over 80 (PLAN) and 443 (SSL). FQDN/URL/TLS inspection will not be supported.|Configure passing UDP 80/443 as network rules.|


## Next steps

- [Learn about Azure Firewall](overview.md)
