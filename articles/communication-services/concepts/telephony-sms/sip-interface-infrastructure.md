---
title: Azure direct routing infrastructure requirements - Azure Communication Services
description: Familiarize yourself with the infrastructure requirements for Azure Communication Services direct routing configuration
author: boris-bazilevskiy
manager: nmurav
services: azure-communication-services

ms.author: bobazile
ms.date: 06/30/2021
ms.topic: overview
ms.service: azure-communication-services
---

# Azure direct routing infrastructure requirements 

[!INCLUDE [Public Preview](../../includes/public-preview-include-document.md)]

 
This article describes infrastructure, licensing, and Session Border Controller (SBC) connectivity details that you'll want to keep in mind as your plan your Azure direct routing deployment.


## Infrastructure requirements
The infrastructure requirements for the supported SBCs, domains, and other network connectivity requirements to deploy Azure direct routing are listed in the following table:  

|Infrastructure requirement|You need the following|
|:--- |:--- |
|Session Border Controller (SBC)|A supported SBC. For more information, see [Supported SBCs](#supported-session-border-controllers-sbcs).|
|Telephony trunks connected to the SBC|One or more telephony trunks connected to the SBC. On one end, the SBC connects to the Azure Communication Service via direct routing. The SBC can also connect to third-party telephony entities, such as PBXs, Analog Telephony Adapters, and so on. Any PSTN connectivity option connected to the SBC will work. (For configuration of the PSTN trunks to the SBC, refer to the SBC vendors or trunk providers.)|
|Azure subscription|An Azure subscription that you use to create Communication Services resource, and the configuration and connection to the SBC.|
|Communication Services Access Token|To make calls, you need a valid Access Token with `voip` scope. See [Access Tokens](../identity-model.md#access-tokens)|
|Public IP address for the SBC|A public IP address that can be used to connect to the SBC. Based on the type of SBC, the SBC can use NAT.|
|Fully Qualified Domain Name (FQDN) for the SBC|An FQDN for the SBC, where the domain portion of the FQDN does not match registered domains in your Microsoft 365 or Office 365 organization. For more information, see [SBC domain names](#sbc-domain-names).|
|Public DNS entry for the SBC |A public DNS entry mapping the SBC FQDN to the public IP Address. |
|Public trusted certificate for the SBC |A certificate for the SBC to be used for all communication with Azure direct routing. For more information, see [Public trusted certificate for the SBC](#public-trusted-certificate-for-the-sbc).|
|Firewall IP addresses and ports for SIP signaling and media |The SBC communicates to the following services in the cloud:<br/><br/>SIP Proxy, which handles the signaling<br/>Media Processor, which handles media<br/><br/>These two services have separate IP addresses in Microsoft Cloud, described later in this document.


## SBC domain names

Customers without Office 365 can use any domain name for which they can obtain a public certificate.

The following table shows examples of DNS names registered for the tenant, whether the name can be used as a fully qualified domain name (FQDN) for the SBC, and examples of valid FQDN names:

|DNS name|Can be used for SBC FQDN|Examples of FQDN names|
|:--- |:--- |:--- |
contoso.com|Yes|**Valid names:**<br/>sbc1.contoso.com<br/>ssbcs15.contoso.com<br/>europe.contoso.com|
|contoso.onmicrosoft.com|No|Using *.onmicrosoft.com domains is not supported for SBC names

If you are an Office 365 customer, then the SBC domain name must not match registered in Domains of the Office 365 tenant. Below is the example of Office 365 and Azure Communication Service coexistence:

|Domain registered in Office 365|Examples of SBC FQDN in Teams|Examples of SBC FQDN names in Azure Communication Services|
|:--- |:--- |:--- |
**contoso.com** (second level domain)|**sbc.contoso.com** (name in the second level domain)|**sbc.acs.contoso.com** (name in the third level domain)<br/>**sbc.fabrikam.com** (any name within different domain)|
|**o365.contoso.com** (third level domain)|**sbc.o365.contoso.com** (name in the third level domain)|**sbc.contoso.com** (name in the second level domain)<br/>**sbc.acs.o365.contoso.com** (name in the fourth level domain)<br/>**sbc.fabrikam.com** (any name within different domain)

SBC pairing works on the Communication Services resource level, meaning you can pair many SBCs to a single Communication Services resource, but you cannot pair a single SBC to more than one Communication Services resource. Unique SBC FQDNs are required for pairing to different resources.

## Public trusted certificate for the SBC

Microsoft recommends that you request the certificate for the SBC by generating a certification signing request (CSR). For specific instructions on generating a CSR for an SBC, refer to the interconnection instructions or documentation provided by your SBC vendors. 

  > [!NOTE]
  > Most Certificate Authorities (CAs) require the private key size to be at least 2048. Keep this in mind when generating the CSR.

The certificate needs to have the SBC FQDN as the common name (CN) or the subject alternative name (SAN) field. The certificate should be issued directly from a certification authority, not from an intermediate provider.

Alternatively, Communication Services direct routing supports a wildcard in the CN and/or SAN, and the wildcard needs to conform to standard [RFC HTTP Over TLS](https://tools.ietf.org/html/rfc2818#section-3.1). 

An example would be using `\*.contoso.com`, which would match the SBC FQDN `sbc.contoso.com`, but wouldn't match with `sbc.test.contoso.com`.

The certificate needs to be generated by one of the following root certificate authorities:

- AffirmTrust
- AddTrust External CA Root
- Baltimore CyberTrust Root*
- Buypass
- Cybertrust
- Class 3 Public Primary Certification Authority
- Comodo Secure Root CA
- Deutsche Telekom 
- DigiCert Global Root CA
- DigiCert High Assurance EV Root CA
- Entrust
- GlobalSign
- Go Daddy
- GeoTrust
- Verisign, Inc. 
- SSL.com
- Starfield
- Symantec Enterprise Mobile Root for Microsoft 
- SwissSign
- Thawte Timestamping CA
- Trustwave
- TeliaSonera 
- T-Systems International GmbH (Deutsche Telekom)
- QuoVadis

Microsoft is working on adding more certification authorities based on customer requests. 

## SIP Signaling: FQDNs 

The connection points for Communication Services direct routing are the following three FQDNs:

- **sip.pstnhub.microsoft.com** – Global FQDN – must be tried first. When the SBC sends a request to resolve this name, the Microsoft Azure DNS servers return an IP address pointing to the primary Azure datacenter assigned to the SBC. The assignment is based on performance metrics of the datacenters and geographical proximity to the SBC. The IP address returned corresponds to the primary FQDN.
- **sip2.pstnhub.microsoft.com** – Secondary FQDN – geographically maps to the second priority region.
- **sip3.pstnhub.microsoft.com** – Tertiary FQDN – geographically maps to the third priority region.

Placing these three FQDNs in order is required to:

- Provide optimal experience (less loaded and closest to the SBC datacenter assigned by querying the first FQDN).
- Provide failover when connection from an SBC is established to a datacenter that is experiencing a temporary issue. For more information, see [Failover mechanism](#failover-mechanism-for-sip-signaling) below.  

The FQDNs – sip.pstnhub.microsoft.com, sip2.pstnhub.microsoft.com, and sip3.pstnhub.microsoft.com – will be resolved to one of the following IP addresses:

- `52.114.148.0`
- `52.114.132.46`
- `52.114.75.24` 
- `52.114.76.76` 
- `52.114.7.24` 
- `52.114.14.70`
- `52.114.16.74`
- `52.114.20.29`

Open firewall ports for these IP addresses to allow incoming and outgoing traffic to and from the addresses for signaling. If your firewall supports DNS names, the FQDN `sip-all.pstnhub.microsoft.com` resolves to all these IP addresses. 

## SIP Signaling: Ports

Use the following ports for Communication Services Azure direct routing:

|Traffic|From|To|Source port|Destination port|
|:--- |:--- |:--- |:--- |:--- |
|SIP/TLS|SIP Proxy|SBC|1024 – 65535|Defined on the SBC (For Office 365 GCC High/DoD only port 5061 must be used)|
SIP/TLS|SBC|SIP Proxy|Defined on the SBC|5061|

### Failover mechanism for SIP Signaling

The SBC makes a DNS query to resolve sip.pstnhub.microsoft.com. Based on the SBC location and the datacenter performance metrics, the primary datacenter is selected. If the primary datacenter experiences an issue, the SBC will try the sip2.pstnhub.microsoft.com, which resolves to the second assigned datacenter, and, in the rare case that datacenters in two regions are not available, the SBC retries the last FQDN (sip3.pstnhub.microsoft.com), which provides the tertiary datacenter IP.

## Media traffic: IP and Port ranges

The media traffic flows to and from a separate service called Media Processor. At the moment of publishing, Media Processor for Communication Services can use any Azure IP address. 
Download [the full list of addresses](https://www.microsoft.com/download/details.aspx?id=56519).

### Port range
The port range of the Media Processors is shown in the following table: 

|Traffic|From|To|Source port|Destination port|
|:--- |:--- |:--- |:--- |:--- |
|UDP/SRTP|Media Processor|SBC|3478-3481 and 49152 – 53247|Defined on the SBC|
|UDP/SRTP|SBC|Media Processor|Defined on the SBC|3478-3481 and 49152 – 53247|

  > [!NOTE]
  > Microsoft recommends at least two ports per concurrent call on the SBC.


## Media traffic: Media processors geography

The media traffic flows via components called media processors. Media processors are placed in the same datacenters as SIP proxies. Also, there are additional media processors to optimize media flow. For example, we do not have a SIP proxy component now in Australia (SIP flows via Singapore or Hong Kong SAR) but we do have the media processor locally in Australia. The need for the media processors locally is dictated by the latency which we experience by sending traffic long-distance, for example from Australia to Singapore or Hong Kong SAR. While latency in the example of traffic flowing from Australia to Hong Kong SAR or Singapore is acceptable to preserve good call quality for SIP traffic, for real-time media traffic it is not.

Locations where both SIP proxy and media processor components deployed:
- US (two in US West and US East datacenters)
- Europe (Amsterdam and Dublin datacenters)
- Asia (Singapore and Hong Kong SAR datacenters)
- Australia (AU East and Southeast datacenters)

Locations where only media processors are deployed (SIP flows via the closest datacenter listed above):
- Japan (JP East and West datacenters)


## Media traffic: Codecs

### Leg between SBC and Cloud Media Processor or Microsoft Teams client.

The Azure direct routing interface on the leg between the Session Border Controller and Cloud Media Processor can use the following codecs:

- SILK, G.711, G.722, G.729

You can force use of the specific codec on the Session Border Controller by excluding undesirable codecs from the offer.

### Leg between Communication Services Calling SDK app and Cloud Media Processor

On the leg between the Cloud Media Processor and Communication Services Calling SDK app, G.722 is used. Microsoft is working on adding more codecs on this leg. 

## Supported Session Border Controllers (SBCs)

- [Session Border Controllers certified for Azure Communication Services direct routing](./certified-session-border-controllers.md)

## Next steps

### Conceptual documentation

- [Telephony Concept](./telephony-concept.md)
- [Phone number types in Azure Communication Services](./plan-solution.md)
- [Pair the Session Border Controller and configure voice routing](./direct-routing-provisioning.md)
- [Pricing](../pricing.md)

### Quickstarts

- [Call to Phone](../../quickstarts/voice-video-calling/pstn-call.md)