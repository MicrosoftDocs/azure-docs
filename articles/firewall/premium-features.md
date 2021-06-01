---
title: Azure Firewall Premium Preview features
description: Azure Firewall Premium is a managed, cloud-based network security service that protects your Azure Virtual Network resources.
author: vhorne
ms.service: firewall
services: firewall
ms.topic: conceptual
ms.date: 04/22/2021
ms.author: victorh
ms.custom: references_regions
---

# Azure Firewall Premium Preview features

:::image type="content" source="media/premium-features/icsa-cert-firewall-small.png" alt-text="ICSA certification logo" border="false"::::::image type="content" source="media/premium-features/pci-logo.png" alt-text="PCI certification logo" border="false":::


> [!IMPORTANT]
> Azure Firewall Premium is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

 Azure Firewall Premium Preview is a next generation firewall with capabilities that are required for highly sensitive and regulated environments.

:::image type="content" source="media/premium-features/premium-overview.png" alt-text="Azure Firewall Premium overview diagram":::

Azure Firewall Premium Preview uses Firewall Policy, a global resource that can be used to centrally manage your firewalls using Azure Firewall Manager. Starting this release, all new features are configurable via Firewall Policy only. Firewall Rules (classic) continue to be supported and can be used to configure existing Standard Firewall features.  Firewall Policy can be managed independently or with Azure Firewall Manager. A firewall policy associated with a single firewall has no charge.

> [!IMPORTANT]
> Currently the Firewall Premium SKU is  not supported in Secure Hub deployments and forced tunnel configurations. 

Azure Firewall Premium Preview includes the following features:

- **TLS inspection** - decrypts outbound traffic, processes the data, then encrypts the data and sends it to the destination.
- **IDPS** - A network intrusion detection and prevention system (IDPS) allows you to monitor network activities for malicious activity, log information about this activity, report it, and optionally attempt to block it.
- **URL filtering** - extends Azure Firewall’s FQDN filtering capability to consider an entire URL. For example, `www.contoso.com/a/c` instead of `www.contoso.com`.
- **Web categories** - administrators can allow or deny user access to website categories such as gambling websites, social media websites, and others.


## TLS inspection

Azure Firewall Premium terminates outbound and east-west TLS connections. Inbound TLS inspection is supported with [Azure Application Gateway](../web-application-firewall/ag/ag-overview.md) allowing end-to-end encryption. Azure Firewall does the required value-added security functions and re-encrypts the traffic that is sent to the original destination.

> [!TIP]
> TLS 1.0 and 1.1 are being deprecated and won’t be supported. TLS 1.0 and 1.1 versions of TLS/Secure Sockets Layer (SSL) have been found to be vulnerable, and while they still currently work to allow backwards compatibility, they aren't recommended. Migrate to TLS 1.2 as soon as possible.

To learn more about Azure Firewall Premium Preview Intermediate CA certificate requirements, see [Azure Firewall Premium Preview certificates](premium-certificates.md).

## IDPS

A network intrusion detection and prevention system (IDPS) allows you to monitor your network for malicious activity, log information about this activity, report it, and optionally attempt to block it. 

Azure Firewall Premium Preview provides signature-based IDPS to allow rapid detection of attacks by looking for specific patterns, such as byte sequences in network traffic, or known malicious instruction sequences used by malware. The IDPS signatures are fully managed and continuously updated.

The Azure Firewall signatures/rulesets include:
- An emphasis on fingerprinting actual malware, Command and Control, exploit kits, and in the wild malicious activity missed by traditional prevention methods.
- Over 35,000 rules in over 50 categories.
    - The categories include malware command and control, DoS attacks, botnets, informational events, exploits, vulnerabilities, SCADA network protocols, exploit kit activity, and more.
- 20 to 40+ new rules are released each day.
- Low false positive rating by using state-of-the-art malware sandbox and global sensor network feedback loop.

IDPS allows you to detect attacks in all ports and protocols for non-encrypted traffic. However, when HTTPS traffic needs to be inspected, Azure Firewall can use its TLS inspection capability to decrypt the traffic and better detect malicious activities.  

The IDPS Bypass List allows you to not filter traffic to any of the IP addresses, ranges, and subnets specified in the bypass list. 

## URL filtering

URL filtering extends Azure Firewall’s FQDN filtering capability to consider an entire URL. For example, `www.contoso.com/a/c` instead of `www.contoso.com`.  

URL Filtering can be applied both on HTTP and HTTPS traffic. When HTTPS traffic is inspected, Azure Firewall Premium Preview can use its TLS inspection capability to decrypt the traffic and extract the target URL to validate whether access is permitted. TLS inspection requires opt-in at the application rule level. Once enabled, you can use URLs for filtering with HTTPS. 

## Web categories

Web categories lets administrators allow or deny user access to web site categories such as gambling websites, social media websites, and others. Web categories will also be included in Azure Firewall Standard, but it will be more fine-tuned in Azure Firewall Premium Preview. As opposed to the Web categories capability in the Standard SKU that matches the category based on an FQDN, the Premium SKU matches the category according to the entire URL for both HTTP and HTTPS traffic. 

For example, if Azure Firewall intercepts an HTTPS request for `www.google.com/news`, the following categorization is expected: 

- Firewall Standard – only the FQDN part will be examined, so `www.google.com` will be categorized as *Search Engine*. 

- Firewall Premium – the complete URL will be examined, so `www.google.com/news` will be categorized as *News*.

The categories are organized based on severity under **Liability**, **High-Bandwidth**, **Business Use**, **Productivity Loss**, **General Surfing**, and **Uncategorized**.

### Category exceptions

You can create exceptions to your web category rules. Create a separate allow or deny rule collection with a higher priority within the rule collection group. For example, you can configure a rule collection that allows `www.linkedin.com` with priority 100, with a rule collection that denies **Social networking** with priority 200. This creates the exception for the pre-defined **Social networking** web category.

### Categorization change

You can request a categorization change if you:

 - think an FQDN or URL should be under a different category 
 
or 

- have a suggested category for an uncategorized FQDN or URL

You're welcome to submit a request at [https://aka.ms/azfw-webcategories-request](https://aka.ms/azfw-webcategories-request).
 
## Supported regions

Azure Firewall Premium Preview is supported in the following regions:

- Australia Central (Public / Australia)
- Australia Central 2 (Public / Australia)
- Australia East (Public / Australia)
- Australia Southeast (Public / Australia)
- Brazil South (Public / Brazil)
- Canada Central (Public / Canada)
- Canada East (Public / Canada)
- Central US (Public / United States)
- Central US EUAP (Public / Canary (US))
- East Asia (Public / Asia Pacific)
- East US (Public / United States)
- East US 2 (Public / United States)
- France Central (Public / France)
- France South (Public / France)
- Japan East (Public / Japan)
- Japan West (Public / Japan)
- Korea Central (Public / Korea)
- Korea South (Public / Korea)
- North Central US (Public / United States)
- North Europe (Public / Europe)
- South Africa North (Public / South Africa)
- South Central US (Public / United States)
- Southeast Asia (Public / Asia Pacific)
- UAE Central (Public / UAE)
- UK South (Public / United Kingdom)
- UK West (Public / United Kingdom)
- West Central US (Public / United States)
- West Europe (Public / Europe)
- West India (Public / India)
- West US (Public / United States)
- West US 2 (Public / United States)


## Known issues

Azure Firewall Premium Preview has the following known issues:

|Issue  |Description  |Mitigation  |
|---------|---------|---------|
|TLS Inspection supported only on the HTTPS standard port|TLS Inspection supports only HTTPS/443. |None. Other ports will be supported in GA.|
|ESNI support for FQDN resolution in HTTPS|Encrypted SNI isn't supported in HTTPS handshake.|Today only Firefox supports ESNI through custom configuration. Suggested workaround is to disable this feature.|
|Client Certificates (TLS)|Client certificates are used to build a mutual identity trust between the client and the server. Client certificates are used during a TLS negotiation. Azure firewall renegotiates a connection with the server and has no access to the private key of the client certificates.|None|
|QUIC/HTTP3|QUIC is the new major version of HTTP. It's a UDP-based protocol over 80 (PLAN) and 443 (SSL). FQDN/URL/TLS inspection won't be supported.|Configure passing UDP 80/443 as network rules.|
Untrusted customer signed certificates|Customer signed certificates are not trusted by the firewall once received from an intranet-based web server.|Fix scheduled for GA.
|Wrong source and destination IP addresses in Alerts for IDPS with TLS inspection.|When you enable TLS inspection and IDPS issues a new alert, the displayed source/destination IP address is wrong (the internal IP address is displayed instead of the original IP address).|Fix scheduled for GA.|
|Wrong source IP address in Alerts with IDPS for HTTP (without TLS inspection).|When plain text HTTP traffic is in use, and IDPS issues a new alert, and the destination is public an IP address, the displayed source IP address is wrong (the internal IP address is displayed instead of the original IP address).|Fix scheduled for GA.|
|Certificate Propagation|After a CA certificate is applied on the firewall, it may take between 5-10 minutes for the certificate to take effect.|Fix scheduled for GA.|
|IDPS Bypass|IDPS Bypass doesn't work for TLS terminated traffic, and Source IP address and Source IP Groups aren't supported.|Fix scheduled for GA.|
|TLS 1.3 support|TLS 1.3 is partially supported. The TLS tunnel from client to the firewall is based on TLS 1.2, and from the firewall to the external Web server is based on TLS 1.3.|Updates are being investigated.|
|KeyVault Private Endpoint|KeyVault supports Private Endpoint access to limit its network exposure. Trusted Azure Services can bypass this limitation if an exception is configured as described in the [KeyVault documentation](../key-vault/general/overview-vnet-service-endpoints.md#trusted-services). Azure Firewall is not currently listed as a trusted service and can't access the Key Vault.|Fix scheduled for GA.|
|IP Groups support|Azure Firewall Premium Preview does not support IP Groups.|Fix scheduled for GA.|


## Next steps

- [Learn about Azure Firewall Premium certificates](premium-certificates.md)
- [Deploy and configure Azure Firewall Premium Preview](premium-deploy.md)
- [Migrate to Azure Firewall Premium Preview](premium-migrate.md)
