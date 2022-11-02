---
title: Advanced Security Information Model (ASIM) helper functions | Microsoft Docs
description: This article outlines the Microsoft Sentinel Advanced Security Information Model (ASIM) helper functions.
author: oshezaf
ms.topic: reference
ms.date: 06/07/2021
ms.author: ofshezaf
---

# Advanced Security Information Model (ASIM) helper functions (Public preview)

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

Advanced Security Information Model (ASIM) helper functions extend the KQL language providing functionality that helps interact with normalized data and in writing parsers. The following is a list of ASIM help functions:

## Scalar functions

Scalar functions are used in expressions are typically invoked as part of an `extend` statement.

| Function | Input parameters | Output | Description |
| -------- | ---------------- | ------ | ----------- | 
| _ASIM_GetSourceBySourceType | SourceType (String) | List of sources (dynamic) | Retrieve the list of sources associated with the input source type from the `SourceBySourceType` Watchlist. This function is intended for use by parsers writers. |
| _ASIM_LookupDnsQueryType | QueryType (Integer) | Query Type Name | Translate a numeric DNS resource record (RR) type to its name, as defined by [IANA](https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml#dns-parameters-4) |
| _ASIM_LookupDnsResponseCode | ResponseCode (Integer) | Response Code Name | Translate a numeric DNS response code (RCODE) to its name, as defined by [IANA](https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml#dns-parameters-6) |


## Tabular functions

Tabular functions are invoked using the `invoke` operator and return value by adding fields to the data set, as if they perform `extend`.

| Function | Input parameters | Extended fields | Description |
| -------- | ---------------- | ------ | ----------- | 
| _ASIM_ResolveDnsQueryType | field (String) | `DnsQueryTypeName`  | Translate a numeric DNS resource record (RR) type stored in the field specified to its name, as defined by [IANA](https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml#dns-parameters-4), and assigns the result to the field `DnsQueryTypeName` |
| _ASIM_LookupDnsResponseCode | field (String) | `DnsResponseCodeName` | Translate a numeric DNS response code (RCODE) stored in the field specified to its name, as defined by [IANA](https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml#dns-parameters-6), and assigns the result to the field `DnsResponseCodeName` |
| _ASIM_ResolveFQDN | field (String) | - `ExtractedHostname`<br> - `Domain`<br> - `DomainType` <br> - `FQDN` | Analyzes the value in the field specified and set the output fields accordingly. For more information, see [example](normalization-develop-parsers.md#resolvefqnd) in the article about developing parsers. | 
| _ASIM_ResolveSrcFQDN | field (String) | - `SrcHostname`<br> - `SrcDomain`<br> - `SrcDomainType`<br> - `SrcFQDN` | Similar to _ASIM_ResolveFQDN, but sets the `Src` fields | 
| _ASIM_ResolveDstFQDN | field (String) | - `DstHostname`<br> - `DstDomain`<br> - `DstDomainType`<br> - `SrcFQDN` | Similar to _ASIM_ResolveFQDN, but sets the `Dst` fields | 
| _ASIM_ResolveDvcFQDN | field (String) | - `DvcHostname`<br> - `DvcDomain`<br> - `DvcDomainType`<br> - `DvcFQDN` | Similar to _ASIM_ResolveFQDN, but sets the `Dvc` fields | 



## <a name="next-steps"></a>Next steps

This article discusses the Advanced Security Information Model (ASIM) help functions.

For more information, see:

- Watch the [Deep Dive Webinar on Microsoft Sentinel Normalizing Parsers and Normalized Content](https://www.youtube.com/watch?v=zaqblyjQW6k) or review the [slides](https://1drv.ms/b/s!AnEPjr8tHcNmjGtoRPQ2XYe3wQDz?e=R3dWeM)
- [Advanced Security Information Model (ASIM) overview](normalization.md)
- [Advanced Security Information Model (ASIM) schemas](normalization-about-schemas.md)
- [Advanced Security Information Model (ASIM) parsers](normalization-about-parsers.md)
- [Using the Advanced Security Information Model (ASIM)](normalization-about-parsers.md)
- [Modifying Microsoft Sentinel content to use the Advanced Security Information Model (ASIM) parsers](normalization-modify-content.md)
