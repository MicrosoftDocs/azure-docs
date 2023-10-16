---
title: Advanced Security Information Model (ASIM) helper functions | Microsoft Docs
description: This article outlines the Microsoft Sentinel Advanced Security Information Model (ASIM) helper functions.
author: oshezaf
ms.topic: reference
ms.date: 06/07/2021
ms.author: ofshezaf
---

# Advanced Security Information Model (ASIM) helper functions (Public preview)

Advanced Security Information Model (ASIM) helper functions extend the KQL language providing functionality that helps interact with normalized data and in writing parsers.

## Enrichment lookup functions

Enrichment lookup functions provide an easy method of looking up known values, based on their numerical representation. Such functions are useful as events often use the short form numeric code, while users prefer the textual form. Most of the functions have two forms:

The **lookup** version is a scalar function that accepts as input the numeric code and returns the textual form. Use the following KQL snippet with the **lookup** version:

```KQL
| extend ProtocolName = _ASIM_LookupNetworkProtocol (ProtocolNumber)
``` 

The **resolve** version is a tabular function that:

- Is used a KQL pipeline operator. 
- Accepts as input the name of the field holding the value to look up.
- Sets the ASIM fields typically holding both the input value and the resulting lookup value. 

Use the following KQL snippet with the **resolve** version:

```KQL
| invoke _ASIM_ResolveNetworkProtocol (`ProtocolNumber`)
``` 

Which will automatically populate the NetworkProtocol field with the result of the lookup.

The **resolve** version is preferable for use in ASIM parsers, while the lookup version is useful in general purpose queries. When an enrichment lookup function has to return more than one value, it will always use the **resolve** format.

### Lookup type functions

| Function | Input* | Output | Description |
| -------- | ---------------- | ------ | ----------- | 
| **_ASIM_LookupDnsQueryType** | Numeric DNS query type code | Query type name | Translate a numeric DNS resource record (RR) type to its name, as defined by [IANA](https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml#dns-parameters-4) |
| **_ASIM_LookupDnsResponseCode** | Numeric DNS response code | Response code name | Translate a numeric DNS response code (RCODE) to its name, as defined by [IANA](https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml#dns-parameters-6) |
| **_ASIM_LookupICMPType** | Numeric ICMP type | ICMP type name | Translate a numeric ICMP type to its name, as defined by [IANA](https://www.iana.org/assignments/icmp-parameters/icmp-parameters.xhtml#icmp-parameters-types) |
| **_ASIM_LookupNetworkProtocol** | IP protocol number | IP protocol name | Translate a numeric IP protocol code to its name, as defined by [IANA](https://www.iana.org/assignments/protocol-numbers/protocol-numbers.xhtml) |


### Resolve type functions

The resolve format functions perform the same action as their lookup counterpart, but accept a field name, provided as a string constant, as input and set up predefined fields as output. The input value is also assigned to a predefined field.  

| Function | Extended fields | 
| -------- | ---------------- | 
| **_ASIM_ResolveDnsQueryType** |  - `DnsQueryType` for the input value<br> - `DnsQueryTypeName` for the output value  |
| **_ASIM_ResolveDnsResponseCode** | - `DnsResponseCode` for the input value<br> - `DnsResponseCodeName` for the output value | 
| **_ASIM_ResolveICMPType** |  - `NetworkIcmpCode` for the input value<br> - `NetworkIcmpType` for the lookup value  |
| **_ASIM_ResolveNetworkProtocol** | - `NetworkProtocolNumber` for the input value<br>- `NetworkProtocol` for the lookup value | 

## Parser helper functions

The following functions perform tasks which are common in parsers and useful to accelerate parser development.

### Device resolution functions

The device resolution functions analyze a hostname and determine whether it has domain information and the type of domain notation. The functions then populate the relevant ASIM fields representing a device. All the functions are resolve type functions and accept the name of the field containing the hostname, represented as a string, as input.

| Function | Extended fields | Description |
| -------- | ---------------- | ----------- |
| **_ASIM_ResolveFQDN** | - `ExtractedHostname`<br> - `Domain`<br> - `DomainType` <br> - `FQDN` | Analyzes the value in the field specified and set the output fields accordingly. For more information, see [example](normalization-develop-parsers.md#resolvefqnd) in the article about developing parsers. | 
| **_ASIM_ResolveSrcFQDN** | - `SrcHostname`<br> - `SrcDomain`<br> - `SrcDomainType`<br> - `SrcFQDN` | Similar to `_ASIM_ResolveFQDN`, but sets the `Src` fields | 
| **_ASIM_ResolveDstFQDN** | - `DstHostname`<br> - `DstDomain`<br> - `DstDomainType`<br> - `SrcFQDN` | Similar to `_ASIM_ResolveFQDN`, but sets the `Dst` fields | 
| **_ASIM_ResolveDvcFQDN** | - `DvcHostname`<br> - `DvcDomain`<br> - `DvcDomainType`<br> - `DvcFQDN` | Similar to `_ASIM_ResolveFQDN`, but sets the `Dvc` fields | 

### Source identification functions

The **_ASIM_GetSourceBySourceType** function retrieves the list of sources associated with a source type provided as input from the `SourceBySourceType` Watchlist. The function is intended for use by parsers writers. For more information, see [Filtering by source type using a Watchlist](normalization-develop-parsers.md#filtering-by-source-type-using-a-watchlist).

## <a name="next-steps"></a>Next steps

This article discusses the Advanced Security Information Model (ASIM) help functions.

For more information, see:

- Watch the [Deep Dive Webinar on Microsoft Sentinel Normalizing Parsers and Normalized Content](https://www.youtube.com/watch?v=zaqblyjQW6k) or review the [slides](https://1drv.ms/b/s!AnEPjr8tHcNmjGtoRPQ2XYe3wQDz?e=R3dWeM)
- [Advanced Security Information Model (ASIM) overview](normalization.md)
- [Advanced Security Information Model (ASIM) schemas](normalization-about-schemas.md)
- [Advanced Security Information Model (ASIM) parsers](normalization-about-parsers.md)
- [Using the Advanced Security Information Model (ASIM)](normalization-about-parsers.md)
- [Modifying Microsoft Sentinel content to use the Advanced Security Information Model (ASIM) parsers](normalization-modify-content.md)
