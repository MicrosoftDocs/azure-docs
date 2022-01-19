---
title: Azure Firewall Premium features
description: Azure Firewall Premium is a managed, cloud-based network security service that protects your Azure Virtual Network resources.
author: vhorne
ms.service: firewall
services: firewall
ms.topic: conceptual
ms.date: 01/19/2022
ms.author: victorh
ms.custom: references_regions
---

# Azure Firewall Premium features

:::image type="content" source="media/premium-features/icsa-cert-firewall-small.png" alt-text="ICSA certification logo" border="false"::::::image type="content" source="media/premium-features/pci-logo.png" alt-text="PCI certification logo" border="false":::

Azure Firewall Premium provides advanced threat protection that meets the needs of highly sensitive and regulated environments, such as the payment and healthcare industries. 

Organizations can leverage Premium stock-keeping unit (SKU) features like IDPS and TLS inspection to prevent malware and viruses from spreading across networks in both lateral and horizontal directions. To meet the increased performance demands of IDPS and TLS inspection, Azure Firewall Premium uses a more powerful virtual machine SKU. Like the Standard SKU, the Premium SKU can seamlessly scale up to 30 Gbps and integrate with availability zones to support the service level agreement (SLA) of 99.99 percent. The Premium SKU complies with Payment Card Industry Data Security Standard (PCI DSS) environment needs.

:::image type="content" source="media/premium-features/premium-overview.png" alt-text="Azure Firewall Premium overview diagram":::

Azure Firewall Premium includes the following features:

- **TLS inspection** - decrypts outbound traffic, processes the data, then encrypts the data and sends it to the destination.
- **IDPS** - A network intrusion detection and prevention system (IDPS) allows you to monitor network activities for malicious activity, log information about this activity, report it, and optionally attempt to block it.
- **URL filtering** - extends Azure Firewall’s FQDN filtering capability to consider an entire URL. For example, `www.contoso.com/a/c` instead of `www.contoso.com`.
- **Web categories** - administrators can allow or deny user access to website categories such as gambling websites, social media websites, and others.

## TLS inspection

Azure Firewall Premium terminates outbound and east-west TLS connections. Inbound TLS inspection is supported with [Azure Application Gateway](../web-application-firewall/ag/ag-overview.md) allowing end-to-end encryption. Azure Firewall does the required value-added security functions and re-encrypts the traffic that is sent to the original destination.

> [!TIP]
> TLS 1.0 and 1.1 are being deprecated and won’t be supported. TLS 1.0 and 1.1 versions of TLS/Secure Sockets Layer (SSL) have been found to be vulnerable, and while they still currently work to allow backwards compatibility, they aren't recommended. Migrate to TLS 1.2 as soon as possible.

To learn more about Azure Firewall Premium Intermediate CA certificate requirements, see [Azure Firewall Premium certificates](premium-certificates.md).

## IDPS

A network intrusion detection and prevention system (IDPS) allows you to monitor your network for malicious activity, log information about this activity, report it, and optionally attempt to block it. 

Azure Firewall Premium provides signature-based IDPS to allow rapid detection of attacks by looking for specific patterns, such as byte sequences in network traffic, or known malicious instruction sequences used by malware. The IDPS signatures are applicable for both application and network level traffic (Layers 4-7), they are fully managed, and continuously updated. IDPS can be applied to inbound, spoke-to-spoke (East-West), and outbound traffic.

The Azure Firewall signatures/rulesets include:
- An emphasis on fingerprinting actual malware, Command and Control, exploit kits, and in the wild malicious activity missed by traditional prevention methods.
- Over 58,000 rules in over 50 categories.
    - The categories include malware command and control, phishing, trojans, botnets, informational events, exploits, vulnerabilities, SCADA network protocols, exploit kit activity, and more.
- 20 to 40+ new rules are released each day.
- Low false positive rating by using state-of-the-art malware sandbox and global sensor network feedback loop.

IDPS allows you to detect attacks in all ports and protocols for non-encrypted traffic. However, when HTTPS traffic needs to be inspected, Azure Firewall can use its TLS inspection capability to decrypt the traffic and better detect malicious activities.  

The IDPS Bypass List allows you to not filter traffic to any of the IP addresses, ranges, and subnets specified in the bypass list.

### IDPS signature rules

IDPS signature rules allow you to:

- Customize one or more signatures and change their mode to *Disabled*, *Alert* or *Alert and Deny*. 

   For example, if you receive a false positive where a legitimate request is blocked by Azure Firewall due to a faulty signature, you can use the signature ID from the network rules logs, and set its IDPS mode to off. This causes the "faulty" signature to be ignored and resolves the false positive issue.
- You can apply the same fine-tuning procedure for signatures that are creating too many low-priority alerts, and therefore interfering with visibility for high-priority alerts.
- Get a holistic view of the entire 55,000 signatures
- Smart search

   Allows you to search through the entire signatures database by any type of attribute. For example, you can search for specific CVE-ID to discovered what signatures are taking care of this CVE by simply typing the ID in the search bar.


IDPS signature rules have the following properties:


|Column  |Description  |
|---------|---------|
|Signature ID     |Internal ID for each signature. This ID is also presented in Azure Firewall Network Rules logs.|
|Mode      |Indicates if the signature is active or not, and whether firewall will drop or alert upon matched traffic. The below signature mode can override IDPS mode<br>- **Disabled**: The signature is not enabled on your firewall.<br>- **Alert**: You will receive alerts when suspicious traffic is detected.<br>- **Alert and Deny**: You will receive alerts and suspicious traffic will be blocked. Few signature categories are defined as “Alert Only”, therefore by default, traffic matching their signatures will not be blocked even though IDPS mode is set to “Alert and Deny”. Customers may override this by customizing these specific signatures to “Alert and Deny” mode. <br><br> Note: IDPS alerts are available in the portal via network rule log query.|
|Severity      |Each signature has an associated severity level that indicates the probability that the signature is an actual attack.<br>- **Low**: An abnormal event is one that does not normally occur on a network or Informational events are logged. Probability of attack is low.<br>- **Medium**: The signature indicates an attack of a suspicious nature. The administrator should investigate further.<br>- **High**: The attack signatures indicate that an attack of a severe nature is being launched. There is very little probability that the packets have a legitimate purpose.|
|Direction      |The traffic direction for which the signature is applied.<br>- **Inbound**: Signature is applied only on traffic arriving from the Internet and destined in Azure private IP range (according to IANA RFC 1918).<br>- **Outbound**: Signature is applied only on traffic sent from Azure private IP range (according to IANA RFC 1918) to the Internet.<br>- **Bidirectional**: Signature is always applied on any traffic direction.|
|Group      |The group name that the signature belongs to.|
|Description      |Structured from the following three parts:<br>- **Category name**: The category name that the signature belongs to as described in [Azure Firewall IDPS signature rule categories](idps-signature-categories.md).<br>- High level description of the signature<br>- **CVE-ID** (optional) in the case where the signature is associated with a specific CVE. The ID is listed here.|
|Protocol     |The protocol associated with this signature.|
|Source/Destination Ports     |The ports associated with this signature.|
|Last updated     |The last date that this signature was introduced or modified.|

:::image type="content" source="media/idps-signature-categories/firewall-idps-signature.png" alt-text="Image showing the IDPS signature rule columns":::


## URL filtering

URL filtering extends Azure Firewall’s FQDN filtering capability to consider an entire URL. For example, `www.contoso.com/a/c` instead of `www.contoso.com`.  

URL Filtering can be applied both on HTTP and HTTPS traffic. When HTTPS traffic is inspected, Azure Firewall Premium can use its TLS inspection capability to decrypt the traffic and extract the target URL to validate whether access is permitted. TLS inspection requires opt-in at the application rule level. Once enabled, you can use URLs for filtering with HTTPS. 

## Web categories

Web categories lets administrators allow or deny user access to web site categories such as gambling websites, social media websites, and others. Web categories will also be included in Azure Firewall Standard, but it will be more fine-tuned in Azure Firewall Premium. As opposed to the Web categories capability in the Standard SKU that matches the category based on an FQDN, the Premium SKU matches the category according to the entire URL for both HTTP and HTTPS traffic. 

For example, if Azure Firewall intercepts an HTTPS request for `www.google.com/news`, the following categorization is expected: 

- Firewall Standard – only the FQDN part will be examined, so `www.google.com` will be categorized as *Search Engine*. 

- Firewall Premium – the complete URL will be examined, so `www.google.com/news` will be categorized as *News*.

The categories are organized based on severity under **Liability**, **High-Bandwidth**, **Business Use**, **Productivity Loss**, **General Surfing**, and **Uncategorized**. For a detailed description of the web categories, see [Azure Firewall web categories](web-categories.md).

### Web category logging
You can view traffic that has been filtered by **Web categories** in the Application logs. **Web categories** field is only displayed if it has been explicitly configured in your firewall policy application rules. For example, if you do not have a rule that explicitly denies *Search Engines*, and a user requests to go to www.bing.com, only a default deny message is displayed as opposed to a Web categories message. This is because the web category was not explicitly configured.

### Category exceptions

You can create exceptions to your web category rules. Create a separate allow or deny rule collection with a higher priority within the rule collection group. For example, you can configure a rule collection that allows `www.linkedin.com` with priority 100, with a rule collection that denies **Social networking** with priority 200. This creates the exception for the pre-defined **Social networking** web category.

### Web category search

You can identify what category a given FQDN or URL is by using the **Web Category Check** feature. To use this, select the **Web Categories** tab under **Firewall Policy Settings**. This is particularly useful when defining your application rules for destination traffic.

:::image type="content" source="media/premium-features/firewall-category-search.png" alt-text="Firewall category search dialog":::

### Category change

Under the **Web Categories** tab in **Firewall Policy Settings**, you can request a categorization change if you: 

- think an FQDN or URL should be under a different category 

   or 

- have a suggested category for an uncategorized FQDN or URL 

 Once you submit a category change report, you will be given a token in the notifications that indicate that we have received the request for processing. You can check whether the request is in progress, denied, or approved by entering the token in the search bar.  Be sure to save your token ID to do so.

:::image type="content" source="media/premium-features/firewall-category-change.png" alt-text="Firewall category report dialog":::

## Supported regions

For the supported regions for Azure Firewall, see [Azure products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=azure-firewall).

## Known issues

Azure Firewall Premium has the following known issues:


|Issue  |Description  |Mitigation  |
|---------|---------|---------|
|ESNI support for FQDN resolution in HTTPS|Encrypted SNI isn't supported in HTTPS handshake.|Today only Firefox supports ESNI through custom configuration. Suggested workaround is to disable this feature.|
|Client Certificates (TLS)|Client certificates are used to build a mutual identity trust between the client and the server. Client certificates are used during a TLS negotiation. Azure firewall renegotiates a connection with the server and has no access to the private key of the client certificates.|None|
|QUIC/HTTP3|QUIC is the new major version of HTTP. It's a UDP-based protocol over 80 (PLAN) and 443 (SSL). FQDN/URL/TLS inspection won't be supported.|Configure passing UDP 80/443 as network rules.|
Untrusted customer signed certificates|Customer signed certificates are not trusted by the firewall once received from an intranet-based web server.|A fix is being investigated.
|Wrong source IP address in Alerts with IDPS for HTTP (without TLS inspection).|When plain text HTTP traffic is in use, and IDPS issues a new alert, and the destination is a public IP address, the displayed source IP address is wrong (the internal IP address is displayed instead of the original IP address).|A fix is being investigated.|
|Certificate Propagation|After a CA certificate is applied on the firewall, it may take between 5-10 minutes for the certificate to take effect.|A fix is being investigated.|
|TLS 1.3 support|TLS 1.3 is partially supported. The TLS tunnel from client to the firewall is based on TLS 1.2, and from the firewall to the external Web server is based on TLS 1.3.|Updates are being investigated.|
|KeyVault Private Endpoint|KeyVault supports Private Endpoint access to limit its network exposure. Trusted Azure Services can bypass this limitation if an exception is configured as described in the [KeyVault documentation](../key-vault/general/overview-vnet-service-endpoints.md#trusted-services). Azure Firewall is not currently listed as a trusted service and can't access the Key Vault.|A fix is being investigated.|
|IDPS Bypass list|IDPS Bypass list doesn't support IP Groups.|A fix is being investigated.|

## Next steps

- [Learn about Azure Firewall Premium certificates](premium-certificates.md)
- [Deploy and configure Azure Firewall Premium](premium-deploy.md)
- [Migrate to Azure Firewall Premium](premium-migrate.md)
