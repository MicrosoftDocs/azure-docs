---
title: Azure Firewall Premium features
description: Azure Firewall Premium is a managed, cloud-based network security service that protects your Azure Virtual Network resources.
author: duongau
ms.service: azure-firewall
services: firewall
ms.topic: concept-article
ms.date: 03/17/2025
ms.author: duau
ms.custom: references_regions
---

# Azure Firewall Premium features

:::image type="content" source="media/premium-features/pci-logo.png" alt-text="PCI certification logo" border="false":::

Azure Firewall Premium offers advanced threat protection suitable for highly sensitive and regulated environments, such as payment and healthcare industries.

Organizations can leverage Premium SKU features like IDPS and TLS inspection to prevent malware and viruses from spreading across networks. To meet the increased performance demands of these features, Azure Firewall Premium uses a more powerful virtual machine SKU. Similar to the Standard SKU, the Premium SKU can scale up to 100 Gbps and integrate with availability zones to support a 99.99% SLA. The Premium SKU complies with Payment Card Industry Data Security Standard (PCI DSS) requirements.

:::image type="content" source="media/premium-features/premium-overview.png" alt-text="Azure Firewall Premium overview diagram":::

Azure Firewall Premium includes the following features:

- **TLS inspection**: Decrypts outbound traffic, processes it, then re-encrypts and sends it to the destination.
- **IDPS**: Monitors network activities for malicious activity, logs information, reports it, and optionally blocks it.
- **URL filtering**: Extends FQDN filtering to consider the entire URL, including any additional path.
- **Web categories**: Allows or denies user access to website categories such as gambling or social media.

To compare Azure Firewall features for all SKUs, see [Choose the right Azure Firewall SKU to meet your needs](choose-firewall-sku.md).

## TLS inspection

The TLS (Transport Layer Security) protocol provides cryptography for privacy, integrity, and authenticity using certificates between communicating applications. It encrypts HTTP traffic, which can hide illegal user activity and malicious traffic.

Without TLS inspection, Azure Firewall cannot see the data within the encrypted TLS tunnel, limiting its protection capabilities. Azure Firewall Premium, however, terminates and inspects TLS connections to detect, alert, and mitigate malicious activity in HTTPS. It creates two TLS connections: one with the web server and another with the client. Using a customer-provided CA certificate, it generates an on-the-fly certificate to replace the web server certificate and shares it with the client to establish the TLS connection.

Azure Firewall without TLS inspection:

:::image type="content" source="media/premium-features/end-to-end-transport-layer-security.png" alt-text="End-to-end TLS for Azure Firewall Standard":::

Azure Firewall with TLS inspection:

:::image type="content" source="media/premium-features/transport-layer-security-inspection.png" alt-text="TLS with Azure Firewall Premium":::

The following use cases are supported with Azure Firewall:

- **Outbound TLS Inspection**: Protects against malicious traffic sent from an internal client hosted in Azure to the Internet.
- **East-West TLS Inspection**: Protects Azure workloads from potential malicious traffic sent within Azure, including traffic to/from an on-premises network.

The following use case is supported by [Azure Web Application Firewall on Azure Application Gateway](../web-application-firewall/ag/ag-overview.md):

- **Inbound TLS Inspection**: Protects internal servers or applications hosted in Azure from malicious requests arriving from the Internet or an external network. Application Gateway provides end-to-end encryption.

For related information, see:

- [Azure Firewall Premium and name resolution](/azure/architecture/example-scenario/gateway/application-gateway-before-azure-firewall)
- [Application Gateway before Firewall](/azure/architecture/example-scenario/gateway/firewall-application-gateway)

> [!TIP]
> TLS 1.0 and 1.1 are being deprecated and won’t be supported. These versions have been found to be vulnerable. While they still work for backward compatibility, they aren't recommended. Migrate to TLS 1.2 as soon as possible.

To learn more about Azure Firewall Premium Intermediate CA certificate requirements, see [Azure Firewall Premium certificates](premium-certificates.md).

To learn more about TLS inspection, see [Building a POC for TLS inspection in Azure Firewall](https://techcommunity.microsoft.com/t5/azure-network-security-blog/building-a-poc-for-tls-inspection-in-azure-firewall/ba-p/3676723).

## IDPS

A network intrusion detection and prevention system (IDPS) monitors your network for malicious activity, logs information, reports it, and optionally blocks it.

Azure Firewall Premium offers signature-based IDPS to quickly detect attacks by identifying specific patterns, such as byte sequences in network traffic or known malicious instruction sequences used by malware. These IDPS signatures apply to both application and network-level traffic (Layers 3-7). They are fully managed and continuously updated. IDPS can be applied to inbound, spoke-to-spoke (East-West), and outbound traffic, including traffic to/from an on-premises network. You can configure your IDPS private IP address ranges using the **Private IP ranges** feature. For more information, see [IDPS Private IP ranges](#idps-private-ip-ranges).

The Azure Firewall signatures/rulesets include:
- Focus on identifying actual malware, Command and Control, exploit kits, and malicious activities missed by traditional methods.
- Over 67,000 rules in more than 50 categories, including malware command and control, phishing, trojans, botnets, informational events, exploits, vulnerabilities, SCADA network protocols, and exploit kit activity.
- 20 to 40+ new rules released daily.
- Low false positive rate using advanced malware detection techniques such as global sensor network feedback loop.

IDPS detects attacks on all ports and protocols for non-encrypted traffic. For HTTPS traffic inspection, Azure Firewall can use its TLS inspection capability to decrypt the traffic and better detect malicious activities.

The IDPS Bypass List allows you to exclude specific IP addresses, ranges, and subnets from filtering. Note that the bypass list is not intended to improve throughput performance, as the firewall's performance is still subject to your use case. For more information, see [Azure Firewall performance](firewall-performance.md#performance-data).

### IDPS Private IP ranges

In Azure Firewall Premium IDPS, private IP address ranges are used to determine if traffic is inbound, outbound, or internal (East-West). Each signature is applied to specific traffic directions as indicated in the signature rules table. By default, only ranges defined by IANA RFC 1918 are considered private IP addresses. Traffic between private IP address ranges is considered internal. You can easily edit, remove, or add private IP address ranges as needed.

### IDPS signature rules

IDPS signature rules allow you to:

- Customize signatures by changing their mode to *Disabled*, *Alert*, or *Alert and Deny*. You can customize up to 10,000 IDPS rules.
   - For example, if a legitimate request is blocked due to a faulty signature, you can disable that signature using its ID from the network rules logs to resolve the false positive issue.
- Fine-tune signatures that generate excessive low-priority alerts to improve visibility for high-priority alerts.
- View all 67,000+ signatures.
- Use smart search to find signatures by attributes, such as CVE-ID.

IDPS signature rules have the following properties:

| Column | Description |
|--------|-------------|
| Signature ID | Internal ID for each signature, also shown in Azure Firewall Network Rules logs. |
| Mode | Indicates if the signature is active and whether the firewall drops or alerts on matched traffic. Modes:<br>- **Disabled**: Signature is not enabled.<br>- **Alert**: Alerts on suspicious traffic.<br>- **Alert and Deny**: Alerts and blocks suspicious traffic. Some signatures are "Alert Only" by default but can be customized to "Alert and Deny".<br><br>Signature mode is determined by:<br>1. Policy Mode – Derived from the IDPS mode of the policy.<br>2. Parent Policy – Derived from the IDPS mode of the parent policy.<br>3. Overridden – Customized by the user.<br>4. System – Set to "Alert Only" by the system due to its category, but can be overridden.<br><br>IDPS alerts are available in the portal via network rule log query. |
| Severity | Indicates the probability that the signature is an actual attack:<br>- **Low (priority 3)**: Low probability, informational events.<br>- **Medium (priority 2)**: Suspicious, requires investigation.<br>- **High (priority 1)**: Severe attack, high probability. |
| Direction | Traffic direction for which the signature is applied:<br>- **Inbound**: From the Internet to your private IP range.<br>- **Outbound**: From your private IP range to the Internet.<br>- **Internal**: Within your private IP range.<br>- **Internal/Inbound**: From your private IP range or the Internet to your private IP range.<br>- **Internal/Outbound**: From your private IP range to your private IP range or the Internet.<br>- **Any**: Applied to any traffic direction. |
| Group | The group name the signature belongs to. |
| Description | Includes:<br>- **Category name**: The category of the signature.<br>- High-level description.<br>- **CVE-ID** (optional): Associated CVE. |
| Protocol | The protocol associated with the signature. |
| Source/Destination Ports | The ports associated with the signature. |
| Last updated | The date the signature was last introduced or modified. |

For more information about IDPS, see [Taking Azure Firewall IDPS on a Test Drive](https://techcommunity.microsoft.com/t5/azure-network-security-blog/taking-azure-firewall-idps-on-a-test-drive/ba-p/3872706).

## URL filtering

URL filtering extends Azure Firewall’s FQDN filtering capability to consider the entire URL, such as `www.contoso.com/a/c` instead of just `www.contoso.com`.

URL filtering can be applied to both HTTP and HTTPS traffic. When inspecting HTTPS traffic, Azure Firewall Premium uses its TLS inspection capability to decrypt the traffic, extract the target URL, and validate whether access is permitted. TLS inspection must be enabled at the application rule level. Once enabled, URLs can be used for filtering HTTPS traffic.

## Web categories

Web categories allow administrators to permit or deny user access to specific categories of websites, such as gambling or social media. While this feature is available in both Azure Firewall Standard and Premium, the Premium SKU offers more granular control by matching categories based on the entire URL for both HTTP and HTTPS traffic.

Azure Firewall Premium web categories are only available in firewall policies. Ensure that your policy SKU matches your firewall instance SKU. For example, a Firewall Premium instance requires a Firewall Premium policy.

For example, if Azure Firewall intercepts an HTTPS request for `www.google.com/news`:
- Firewall Standard examines only the FQDN, categorizing `www.google.com` as *Search Engine*.
- Firewall Premium examines the complete URL, categorizing `www.google.com/news` as *News*.

Categories are organized by severity under **Liability**, **High-Bandwidth**, **Business Use**, **Productivity Loss**, **General Surfing**, and **Uncategorized**. For detailed descriptions, see [Azure Firewall web categories](web-categories.md).

### Web category logging

Traffic filtered by web categories is logged in the Application logs. The **Web categories** field appears only if explicitly configured in your firewall policy application rules. For example, if no rule explicitly denies *Search Engines* and a user requests `www.bing.com`, only a default deny message is displayed.

### Category exceptions

You can create exceptions to web category rules by configuring separate allow or deny rule collections with higher priority. For example, allow `www.linkedin.com` with priority 100 and deny **Social networking** with priority 200 to create an exception for the **Social networking** category.

### Web category search

Identify the category of an FQDN or URL using the **Web Category Check** feature under **Firewall Policy Settings**. This helps define application rules for destination traffic.

> [!IMPORTANT]
> To use the **Web Category Check** feature, the user must have Microsoft.Network/azureWebCategories/* access at the subscription level.

### Category change

Under the **Web Categories** tab in **Firewall Policy Settings**, you can request a category change if you believe an FQDN or URL should be in a different category or have a suggestion for an uncategorized FQDN or URL. After submitting a category change report, you receive a token to track the request status.

:::image type="content" source="media/premium-features/firewall-category-change.png" alt-text="Firewall category report dialog":::

### Web categories that don't support TLS termination

Certain web traffic, such as employee health data, cannot be decrypted using TLS termination due to privacy and compliance reasons. The following web categories do not support TLS termination:
- Education
- Finance
- Government
- Health and medicine

To support TLS termination for specific URLs, manually add them to application rules. For example, add `www.princeton.edu` to allow this website.

## Supported regions

For a list of regions where Azure Firewall is available, see [Azure products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=azure-firewall).

## Next steps

- [Learn about Azure Firewall Premium certificates](premium-certificates.md)
- [Deploy and configure Azure Firewall Premium](premium-deploy.md)
- [Migrate to Azure Firewall Premium](premium-migrate.md)
- [Learn more about Azure network security](../networking/security/index.yml)
