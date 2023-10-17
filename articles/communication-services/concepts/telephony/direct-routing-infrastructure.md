---
title: Azure direct routing infrastructure requirements—Azure Communication Services
description: Familiarize yourself with the infrastructure requirements for Azure Communication Services direct routing configuration
author: boris-bazilevskiy
manager: nmurav
services: azure-communication-services
ms.author: bobazile
ms.date: 06/22/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: pstn
---

# Azure direct routing infrastructure requirements 
 
This article describes infrastructure, licensing, and Session Border Controller (SBC) connectivity details that you want to keep in mind as your plan your Azure direct routing deployment.


## Infrastructure requirements
The infrastructure requirements for the supported SBCs, domains, and other network connectivity requirements to deploy Azure direct routing are listed in the following table:  

|Infrastructure requirement|You need the following|
|:--- |:--- |
|Session Border Controller (SBC)|A supported SBC. For more information, see [Supported SBCs](#supported-session-border-controllers-sbcs).|
|Telephony trunks connected to the SBC|One or more telephony trunks connected to the SBC. On one end, the SBC connects to the Azure Communication Service via direct routing. The SBC can also connect to third-party telephony entities, such as PBXs, Analog Telephony Adapters. Any Public Switched Telephony Network (PSTN) connectivity option connected to the SBC works. (For configuration of the PSTN trunks to the SBC, refer to the SBC vendors or trunk providers.)|
|Azure subscription|An Azure subscription that you use to [create Communication Services resource](../../quickstarts/create-communication-resource.md), and the configuration and connection to the SBC.|
|Communication Services Access Token|To make calls, you need a valid Access Token with `voip` scope. See [Access Tokens](../identity-model.md#access-tokens)|
|Public IP address for the SBC|A public IP address that can be used to connect to the SBC. Based on the type of SBC, the SBC can use NAT.|
|Fully Qualified Domain Name (FQDN) for the SBC|For more information, see [SBC certificates and domain names](#sbc-certificates-and-domain-names).|
|Public DNS entry for the SBC |A public DNS entry mapping the SBC FQDN to the public IP address. |
|Public trusted certificate for the SBC |A certificate for the SBC to be used for all communication with Azure direct routing. For more information, see [SBC certificates and domain names](#sbc-certificates-and-domain-names).|
|Firewall IP addresses and ports for SIP signaling and media |The SBC communicates to the following services in the cloud:<br/><br/>SIP Proxy, which handles the signaling<br/>Media Processor, which handles media<br/><br/>These two services have separate IP addresses in Microsoft Cloud, described later in this document.


## SBC certificates and domain names

Microsoft recommends that you request the certificate for the SBC by a certification signing request (CSR). For specific instructions on how to generate a CSR for an SBC, refer to the interconnection instructions or documentation provided by your SBC vendors. 

 >[!NOTE]
 > Most Certificate Authorities (CAs) require the private key size to be at least 2048. Keep this in mind when you generate the CSR.

The certificate must have the SBC FQDN as the common name (CN) or the subject alternative name (SAN) field. The certificate should be issued directly from a certification authority, not an intermediate provider.

Alternatively, Communication Services direct routing supports a wildcard in the CN and/or SAN, and the wildcard must conform to standard [RFC HTTP Over TLS](https://tools.ietf.org/html/rfc2818#section-3.1). 

Customers who already use Office 365 and have a domain registered in Microsoft 365 Admin Center can use SBC FQDN from the same domain.

An example would be using `*.contoso.com`, which would match the SBC FQDN `sbc.contoso.com`, but wouldn't match with `sbc.test.contoso.com`.

 >[!NOTE]
 > SBC FQDN in Azure Communication Services direct routing must be different from SBC FQDN in Teams Direct Routing.

Communication Services only trusts certificates signed by Certificate Authorities (CAs) that are part of the Microsoft Trusted Root Certificate Program. Ensure that your SBC certificate is signed by a CA that is part of the program, and that Extended Key Usage (EKU) extension of your certificate includes Server Authentication.
Learn more:

[Program Requirements — Microsoft Trusted Root Program](/security/trusted-root/program-requirements)
 
[Included CA Certificate List](https://ccadb-public.secure.force.com/microsoft/IncludedCACertificateReportForMSFT)

>[!IMPORTANT]
>Azure Communication Services direct routing supports only TLS 1.2 (or a later version). To avoid any service impact, ensure that your SBCs are configured to support TLS1.2 and can connect using one of the following cipher suites: 
>
>TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 i.e. ECDHE-RSA-AES256-GCM-SHA384 
>TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 i.e. ECDHE-RSA-AES128-GCM-SHA256 
>TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384 i.e. ECDHE-RSA-AES256-SHA384 
>TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256 i.e. ECDHE-RSA-AES128-SHA256

SBC pairing works on the Communication Services resource level. It means you can pair many SBCs to a single Communication Services resource. Still, you can't pair a single SBC to more than one Communication Services resource. Unique SBC FQDNs are required for pairing to different resources.

If Mutual TLS (MTLS) support is enabled for the direct routing connection on the SBC, then you must install the Baltimore CyberTrust Root **and** the DigiCert Global Root G2 certificates in the SBC Trusted Root Store of the direct routing TLS context. (This is because the Microsoft service certificates use one of these two root certificates.) To download these root certificates, see [Office 365 Encryption chains](/microsoft-365/compliance/encryption-office-365-certificate-chains). For more details, see [Office TLS Certificate Changes](/microsoft-365/compliance/encryption-office-365-tls-certificates-changes).

## SIP Signaling: FQDNs 

The connection points for Communication Services direct routing are the following three FQDNs:

- **sip.pstnhub.microsoft.com** — Global FQDN — must be tried first. When the SBC sends a request to resolve this name, the Microsoft Azure DNS servers return an IP address that points to the primary Azure datacenter assigned to the SBC. The assignment is based on performance metrics of the datacenters and geographical proximity to the SBC. The IP address returned corresponds to the primary FQDN.
- **sip2.pstnhub.microsoft.com** — Secondary FQDN — geographically maps to the second priority region.
- **sip3.pstnhub.microsoft.com** — Tertiary FQDN — geographically maps to the third priority region.

These three FQDNs in order are required to:

- Provide optimal experience (less loaded and closest to the SBC datacenter assigned by querying the first FQDN).
- Provide failover when connection from an SBC is established to a datacenter that is experiencing a temporary issue. For more information, see [Failover mechanism](#failover-mechanism-for-sip-signaling).  

The FQDNs — sip.pstnhub.microsoft.com, sip2.pstnhub.microsoft.com, and sip3.pstnhub.microsoft.com — resolve to one of the following IP addresses:

- `52.112.0.0/14 (IP addresses from 52.112.0.0 to 52.115.255.255)`
- `52.120.0.0/14 (IP addresses from 52.120.0.0 to 52.123.255.255)`

Open firewall ports for all these IP address ranges to allow incoming and outgoing traffic to and from the addresses for signaling.

## SIP Signaling: Ports

Use the following ports for Communication Services Azure direct routing:

|Traffic|From|To|Source port|Destination port|
|:--- |:--- |:--- |:--- |:--- |
|SIP/TLS|SIP Proxy|SBC|1024–65535|Defined on the SBC|
SIP/TLS|SBC|SIP Proxy|Defined on the SBC|5061|

### Failover mechanism for SIP Signaling

The SBC makes a DNS query to resolve sip.pstnhub.microsoft.com. Based on the SBC location and the datacenter performance metrics, the primary datacenter is selected. If the primary datacenter experiences an issue, the SBC tries the sip2.pstnhub.microsoft.com, which resolves to the second assigned datacenter, and, in the rare case that datacenters in two regions aren’t available, the SBC retries the last FQDN (sip3.pstnhub.microsoft.com), which provides the tertiary datacenter IP.

## Media traffic: IP and Port ranges

The media traffic flows to and from a separate service called Media Processor. The IP address ranges for media traffic are the same as for signaling:

- `52.112.0.0/14 (IP addresses from 52.112.0.0 to 52.115.255.255)`
- `52.120.0.0/14 (IP addresses from 52.120.0.0 to 52.123.255.255)`

### Port ranges
The port ranges of the Media Processors are shown in the following table: 

|Traffic|From|To|Source port|Destination port|
|:--- |:--- |:--- |:--- |:--- |
|UDP/SRTP|Media Processor|SBC|49152–53247|Defined on the SBC|
|UDP/SRTP|SBC|Media Processor|Defined on the SBC|49152–53247|

  > [!NOTE]
  > Microsoft recommends at least two ports per concurrent call on the SBC.


## Media traffic: Media processors geography

Media Processors are placed in the same datacenters as SIP proxies:
- NOAM (US South Central, two in US West and US East datacenters)
- Europe (UK South, France Central, Amsterdam and Dublin datacenters)
- Asia (Singapore datacenter)
- Japan (JP East and West datacenters)
- Australia (AU East and Southeast datacenters)
- LATAM (Brazil South)
- Africa (South Africa North)


## Media traffic: Codecs

### Leg between SBC and Cloud Media Processor.

The Azure direct routing interface on the leg between the Session Border Controller and Cloud Media Processor can use the following codecs:

- SILK, G.711, G.722, G.729

You can force use of the specific codec on the Session Border Controller by excluding undesirable codecs from the offer.

### Leg between Communication Services Calling SDK app and Cloud Media Processor

On the leg between the Cloud Media Processor and Communication Services Calling SDK app, G.722 is used. Work on adding more codecs on this leg is in progress. 

## Supported Session Border Controllers (SBCs)

- [Session Border Controllers certified for Azure Communication Services direct routing](./certified-session-border-controllers.md)

## Next steps

### Conceptual documentation

- [Telephony Concept](./telephony-concept.md)
- [Phone number types in Azure Communication Services](./plan-solution.md)
- [Pair the Session Border Controller and configure voice routing](./direct-routing-provisioning.md)
- [Call Automation overview](../call-automation/call-automation.md)
- [Pricing](../pricing.md)

### Quickstarts

- [Get a phone number](../../quickstarts/telephony/get-phone-number.md)
- [Outbound call to a phone number](../../quickstarts/telephony/pstn-call.md)
- [Redirect inbound telephony calls with Call Automation](../../quickstarts/call-automation/redirect-inbound-telephony-calls.md)
