---
title: What is DNSSEC?
description: Learn about DNSSEC zone signing for Azure public DNS.
author: greg-lindsay
manager: KumuD
ms.service: azure-dns
ms.topic: article
ms.date: 09/04/2024
ms.author: greglin
---

# What is DNSSEC?

Domain Name System Security Extensions (DNSSEC) is a suite of extensions that add security to the Domain Name System (DNS) protocol by enabling DNS responses to be validated as genuine. DNSSEC provides origin authority, data integrity, and authenticated denial of existence. With DNSSEC, the DNS protocol is much less susceptible to certain types of attacks, particularly DNS spoofing attacks.

The core DNSSEC extensions are specified in the following Request for Comments (RFCs):

* [RFC 4033](https://datatracker.ietf.org/doc/html/rfc4033): "DNS Security Introduction and Requirements"
* [RFC 4034](https://datatracker.ietf.org/doc/html/rfc4034): "Resource Records for the DNS Security Extensions"
* [RFC 4035](https://datatracker.ietf.org/doc/html/rfc4035): "Protocol Modifications for the DNS Security Extensions"

For a summary of RFCs, see [RFC9364](https://www.rfc-editor.org/rfc/rfc9364): DNS Security Extensions (DNSSEC).

## Why sign a zone with DNSSEC?

> [!NOTE]
> DNSSEC zone signing is currently in PREVIEW.<br> 
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

DNSSEC validation of DNS responses can prevent common types of DNS hijacking attacks, also known as DNS redirection. DNS hijacking occurs when a client device is redirected to a malicious server by using incorrect (spoofed) DNS responses. An example of how DNS hijacking works is shown in the following figure.

  ![A diagram showing how DNS hijacking works.](media/dnssec/dns-hijacking.png)

**Normal DNS resolution**:
1. A client device sends a DNS query for **contoso.com** to a DNS server.
2. The DNS server responds with a DNS resource record for **contoso.com**.
3. The client device requests a response from **contoso.com**.
4. The contoso.com app or web server returns a response to the client.

**DNS hijacking**
1. A client device sends a DNS query for **contoso.com** to a hijacked DNS server.
2. The DNS server responds with an invalid (spoofed) DNS resource record for **contoso.com**.
3. The client device requests a response for **contoso.com** from malicious server.
4. The malicious server returns a spoofed response to the client.

The type of DNS resource record that is spoofed depends on the type of DNS hijacking attack. An MX record might be spoofed to redirect client emails, or a spoofed A record might send clients to a malicious web server.  

DNSSEC works to prevent DNS hijacking by performing validation on DNS responses. Before you sign a zone with DNSSEC, be sure to understand [how DNSSEC works](#how-dnssec-works). When you are ready to sign a zone, see [How to sign your Azure Public DNS zone with DNSSEC (Preview)](dnssec-how-to.md).

## How DNSSEC works

DNS zones are secured with DNSSEC using a process called zone signing. Signing a zone with DNSSEC adds validation support without changing the basic mechanism of a DNS query and response. To sign a zone with DNSSEC, the zone's primary authoritative DNS server must support DNSSEC.

[DNSSEC validation](#dnssec-validation) of DNS responses occurs by using digital signatures. Resource Record Signatures (RRSIGs) and other cryptographic records are added to the zone when it is signed. 

The following figure shows DNS resource records in the zone contoso.com before and after zone signing.

  ![A diagram showing how RRSIG records are added to a zone when it is signed with DNSSEC.](media/dnssec/rrsig-records.png)

> [!NOTE]
> DNSSEC-related resource records are not displayed in the Azure portal. For more information, see [View DNSSEC-related resource records](#view-dnssec-related-resource-records) 

If a DNS resolver is DNSSEC-aware, it can set the DNSSEC OK (DO) flag in the DNS query to 1. This tells the responding DNS server to include DNSSEC records to be in it's response. The resolver can then use the DNSSEC records to validate that the DNS response is genuine. In order for DNSSEC validation to work end-to-end, there must be an unbroken [chain of trust](#chain-of-trust).

## Chain of trust

 A chain of trust occurs when all the DNS servers involved in sending a response for a DNS query are able to validate that the response was not modified during transit. 

 Authoritative servers:
- Authoritative DNS servers maintain a chain of trust by verifying the authenticiy of the DNS zone in the DNS hierarchy. For example, if a parent zone doesn't have a delegation signer (DS) record for a child zone, it can't verify the DNSSEC status of the child zone and the chain of trust is broken.

Recursive servers:
- Recursive DNS servers, also called resolving or caching DNS servers, maintain a chain of trust through the use of DNSSEC trust anchor, also known as a DNSKEY record. The DNSKEY is a public cryptographic key for a signed zone, provided by the zone's authoritative server. 
    - If a recursive DNS server does not have a DNSSEC trust anchor, it will not perform DNSSEC validation.
    - If a recursive DNS server has a DNSSEC trust anchor for either a child zone or a parent zone, the recursive DNS server verifies that a DS record for the child zone is present in the parent zone and then performs DNSSEC validation. 
    - If the recursive DNS server determines that the parent zone does not have a DS record for the child zone, it assumes the child zone is insecure and does not perform DNSSEC validation.
    - In some cases, a recursive server can have DNSSEC validation disabled or servers are not DNSSEC-aware.

> [!NOTE]
> Trust anchors can also be DS records. The DS record contains a [hash](/dotnet/standard/security/ensuring-data-integrity-with-hash-codes) of a DNSKEY record.

## DNSSEC validation

A recursive DNS server performs DNSSEC validation using its trust anchor (DNSKEY). The server uses its DNSKEY to decrypt digital signatures in DNSSEC-related resource records, and then computes and compares hash values. If hash values are the same, it provides a reply to the DNS client with the DNS data that it requested, such as a host (A) resource record. 

  ![A diagram showing how DNSSEC validation works.](media/dnssec/dnssec-validation.png)

If hash values are not the same, it replies with a SERVFAIL message. In this way, a DNSSEC-capable, resolving DNS server with a valid trust anchor installed protects against DNS hijacking whether or not DNS clients are DNSSEC-aware.

## DNSSEC-related resource records

The following table provides a short description of DNSSEC-related records. For more information, see [RFC 4034: Resource Records for the DNS Security Extensions](https://datatracker.ietf.org/doc/html/rfc4034) and [RFC 7344: Automating DNSSEC Delegation Trust Maintenance](https://datatracker.ietf.org/doc/html/rfc7344).

| Record | Description |
| --- | --- |
| Resource record signature (RRSIG) | A DNSSEC resource record type that is used to hold a signature, which covers a set of DNS records for a particular name and type. |
| DNSKEY | A DNSSEC resource record type that is used to store a public key. |
| Delegation signer (DS) | A DNSSEC resource record type that is used to secure a delegation. |
| Next secure (NSEC) | A DNSSEC resource record type that is used to prove nonexistence of a DNS name. |
| Next secure 3 (NSEC3) | The NSEC3 resource record that provides hashed, authenticated denial of existence for DNS resource record sets. |
| Next secure 3 parameters (NSEC3PARAM) | Specifies parameters for NSEC3 records. |
| Child delegation signer (CDS) | This record is optional. If present, the CDS record can be used by a child zone to specify the desired contents of the DS record in a parent zone. |
| Child DNSKEY (CDNSKEY) | This record is optional. If the CDNSKEY record is present in a child zone, it can be used to generate a DS record from a DNSKEY record. |

### View DNSSEC-related resource records

To view DNSSEC-related records, use command line tools such as Resolve-DnsName or dig.exe. These tools are available using Cloud Shell, or locally if installed on your device. Be sure to set the DO flag in your query, which is done using the -dnssecok option in Resolve-DnsName or the +dnssec option in dig.exe. Do not use the nslookup.exe command-line tool to query for DNSSEC-related records. The nslookup.exe tool uses an internal DNS client that isn't DNSSEC-aware. See the following examples:

``PowerShell
PS C:\> resolve-dnsname server1.contoso.com -dnssecok

Name                                      Type   TTL   Section    IPAddress
----                                      ----   ---   -------    ---------
server1.contoso.com                        A     3600  Answer     203.0.113.1

Name        : server1.contoso.com
QueryType   : RRSIG
TTL         : 3600
Section     : Answer
TypeCovered : A
Algorithm   : 13
LabelCount  : 3
OriginalTtl : 3600
Expiration  : 9/20/2024 11:25:54 PM
Signed      : 9/18/2024 9:25:54 PM
Signer      : contoso.com
Signature   : {193, 20, 122, 196…}
``

``Cmd
C:\>dig server1.contoso.com +dnssec

; <<>> DiG 9.9.2-P1 <<>> server1.contoso.com +dnssec
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 61065
;; flags: qr rd ra; QUERY: 1, ANSWER: 2, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags: do; udp: 512
;; QUESTION SECTION:
;server1.contoso.com.       IN      A

;; ANSWER SECTION:
server1.contoso.com. 3600   IN      A       203.0.113.1
server1.contoso.com. 3600   IN      RRSIG   A 13 3 3600 20240920232359 20240918212359 11530 contoso.com. GmxeQhNk1nJZiep7nuCS2qmOQ+Ffs78Z2eoOgIYP3j417yqwS1DasfA5 e1UZ4HuujDk2G6GIbs0ji3RiM9ZpGQ==

;; Query time: 153 msec
;; SERVER: 192.168.1.1#53(192.168.1.1)
;; WHEN: Thu Sep 19 15:23:45 2024
;; MSG SIZE  rcvd: 179
``

``PowerShell
PS C:\> resolve-dnsname contoso.com -Type dnskey -dnssecok

Name                                 Type   TTL   Section    Flags  Protocol Algorithm      Key
----                                 ----   ---   -------    -----  -------- ---------      ---
contoso.com                          DNSKEY 3600  Answer     256    DNSSEC   13             {115, 117, 214,
                                                                                                165…}
contoso.com                          DNSKEY 3600  Answer     256    DNSSEC   13             {149, 166, 55, 78…}
contoso.com                          DNSKEY 3600  Answer     257    DNSSEC   13             {45, 176, 217, 2…}

Name        : contoso.com
QueryType   : RRSIG
TTL         : 3600
Section     : Answer
TypeCovered : DNSKEY
Algorithm   : 13
LabelCount  : 2
OriginalTtl : 3600
Expiration  : 11/17/2024 9:00:15 PM
Signed      : 9/18/2024 9:00:15 PM
Signer      : contoso.com
Signature   : {241, 147, 134, 121…}
``

```Cmd
C:\>dig contoso.com dnskey

; <<>> DiG 9.9.2-P1 <<>> contoso.com dnskey
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 46254
;; flags: qr rd ra; QUERY: 1, ANSWER: 3, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 512
;; QUESTION SECTION:
;contoso.com.               IN      DNSKEY

;; ANSWER SECTION:
contoso.com.        3600    IN      DNSKEY  256 3 13 laY3Toc/VTyjupgp/+WgD05N+euB6Qe1iaM/253k7bkaA0Dx+gSDhbH2 5wXTt+uLQgPljL9OusKTneLdhU+1iA==
contoso.com.        3600    IN      DNSKEY  257 3 13 LbDZAtjG8E9Ftih+LC8CqQrSZIJFFJMtP6hmN3qBRqLbtAj4JWtr2cVE ufXM5Pd/yW+Ca36augQDucd5n4SgTg==
contoso.com.        3600    IN      DNSKEY  256 3 13 c3XWpTqZ0q9IO+YqMEtOBHZSzGGeyFKq0+3xzs6tifvD1rey1Obhrkz4 DJlEIxy2m84VsG1Ij9VYdtGxxeVHIQ==

;; Query time: 182 msec
;; SERVER: 192.168.1.1#53(192.168.1.1)
;; WHEN: Thu Sep 19 16:35:10 2024
;; MSG SIZE  rcvd: 284
```

## DNSSEC terminology

This list is provided to help understand some of the common terms used when discussing DNSSEC. Also see: [DNSSEC-related resource records](#dnssec-related-resource-records)

| Term | Description |
| --- | --- |
| Authenticated data (AD) bit | A data bit that indicates in a response that all data that is included in the answer and authority sections of the response has been authenticated by the DNS server according to the policies of that server. |
| Authentication chain | A chain of signed and validated DNS records that extends from a preconfigured trust anchor to some child zone in the DNS tree. |
| DNS Extension (EDNS0) | A DNS record that carries extended DNS header information, such as the DO bit and maximum UDP packet size. |
| DNS Security Extensions (DNSSEC) | Extensions to the DNS service that provide mechanisms for signing and for securely resolving DNS data. |
| DNSSEC OK (DO) bit | A bit in the EDNS0 portion of a DNS request that signals that the client is DNSSEC-aware. |
| Island of security | A signed zone that does not have an authentication chain from its delegating parent zone. |
| Key signing key (KSK) | An authentication key that corresponds to a private key that is used to sign one or more other signing keys for a given zone. Typically, the private key that corresponds to a KSK signs a zone signing key (ZSK), which in turn has a corresponding private key that signs other zone data. Local policy can require that the ZSK be changed frequently, while the KSK can have a longer validity period in order to provide a more stable, secure entry point into the zone. Designating an authentication key as a KSK is purely an operational issue: DNSSEC validation does not distinguish between KSKs and other DNSSEC authentication keys. It is possible to use a single key as both a KSK and a ZSK. |
| Non-validating security-aware stub resolver | A security-aware stub resolver that trusts one or more security-aware DNS servers to perform DNSSEC validation on its behalf. |
| secure entry point (SEP) key | A subset of public keys within the DNSKEY RRSet. A SEP key is used either to generate a DS RR or is distributed to resolvers that use the key as a trust anchor. |
| Security-aware DNS server | A DNS server that implements the DNS security extensions as defined in RFCs 4033 [5], 4034 [6], and 4035 [7]. In particular, a security-aware DNS server is an entity that receives DNS queries, sends DNS responses, supports the EDNS0 [3] message size extension and the DO bit, and supports the DNSSEC record types and message header bits. |
| Signed zone | A zone whose records are signed as defined by RFC 4035 [7] Section 2. A signed zone can contain DNSKEY, NSEC, NSEC3, NSEC3PARAM, RRSIG, and DS resource records. These resource records enable DNS data to be validated by resolvers. |
| Signing key descriptor (SKD) | A collection of cryptographic keys and parameters that describe how to generate and maintain signing keys and signatures. An SKD is not the same as a signing key, but all signing keys are associated to an SKD. The unique identifier for an SKD is displayed as a GUID in DNSSEC properties of a signing key in DNS Manager, and this GUID is the value that must be provided for the KeyId parameter in Windows PowerShell in certain cmdlets, for example: Set-DnsServerSigningKey. |
| Trust anchor | A preconfigured public key that is associated with a particular zone. A trust anchor enables a DNS resolver to validate signed DNSSEC resource records for that zone and to build authentication chains to child zones. |
| Unsigned zone | Any DNS zone that has not been signed as defined by RFC 4035 [7] Section 2. |
| Zone signing key (ZSK) | An authentication key that corresponds to a private key that is used to sign a zone. Typically, a zone signing key is part of the same DNSKEY RRSet as the key signing key whose corresponding private key signs this DNSKEY RRSet, but the zone signing key is used for a slightly different purpose and can differ from the key signing key in other ways, such as in validity lifetime. Designating an authentication key as a zone signing key is purely an operational issue; DNSSEC validation does not distinguish between zone signing keys and other DNSSEC authentication keys. It is possible to use a single key as both a key signing key and a zone signing key. |

## Next steps

- Learn how to [sign a DNS zone with DNSSEC](dnssec-how-to.md).
- Learn how to [unsign a DNS zone](dnssec-unsign.md).
- Learn how to [host the reverse lookup zone for your ISP-assigned IP range in Azure DNS](dns-reverse-dns-for-azure-services.md).
- Learn how to [manage reverse DNS records for your Azure services](dns-reverse-dns-for-azure-services.md).
