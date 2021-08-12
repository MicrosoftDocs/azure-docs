---
title: Azure Sentinel DNS normalization schema reference | Microsoft Docs
description: This article describes the Azure Sentinel DNS normalization schema.
services: sentinel
cloud: na
documentationcenter: na
author: batamig
manager: rkarlin

ms.assetid:
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: reference
ms.date: 06/15/2021
ms.author: bagol

---

# Azure Sentinel DNS normalization schema reference (Public preview)

The DNS information model is used to describe events reported by a DNS server or a DNS security system, and is used by Azure Sentinel to enable source-agnostic analytics.

For more information, see [Normalization and the Azure Sentinel Information Model (ASIM)](normalization.md).

> [!IMPORTANT]
> The DNS normalization schema is currently in public preview.
> This feature is provided without a service level agreement, and it's not recommended for production workloads.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Guidelines for collecting DNS events

DNS is a unique protocol in that it may cross a large number of computers. Also, since DNS uses UDP, requests and responses are de-coupled and are not directly related to each other.

The following image shows a simplified DNS request flow, including four segments. A real-world request can be more complex, with more segments involved.

:::image type="content" source="media/normalization/dns-request-flow.png" alt-text="Simplified DNS request flow.":::

Since request and response segments are not directly connected to each other in the DNS request flow, full logging can result in significant duplication.

The most valuable segment to log is the response to the client, which provides the domain name queries, the lookup result, and the IP address of the client. While many DNS systems log only this segment, there is value in logging the other parts. For example, a DNS cache poisoning attack often takes advantage of fake responses from an upstream server.

If your data source supports full DNS logging and you've chosen to log multiple segments, you'll need to adjust your queries to prevent data duplication in Azure Sentinel.

For example, you might modify your query with the following normalization:

```kql
imDNS | where SrcIpAddr != "127.0.0.1" and EventSubType == "response"
```

## Parsers

The KQL functions implementing the DNS information model have the following names:

| Name | Description | Usage instructions |
| --- | --- | --- |
| **imDNS** | Aggregative parser that uses *union* to include normalized events from all DNS sources. |- Update this parser if you want to add or remove sources from source-agnostic analytics. <br><br>- Use this function in your source-agnostic queries.|
| **imDNS\<vendor\>\<product\>** | Source-specific parsers implement normalization for a specific source, such as *imDNSWindowsOMS*. |- Add a source-specific parser for a source when there is no built-in normalizing parser. Update the aggregative parser to include reference to your new parser. <br><br>- Update a source-specific parser to resolve parsing and normalization issues.<br><br>- Use a source-specific parser for source-specific analytics.|
| | | |

The parsers can be deployed from the [Azure Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Parsers/ASimDns/ARM).

## Normalized content

Support for the DNS ASIM schema also includes support for the following built-in analytics rules with normalized authentication parsers. The linked below point to the Azure Sentinel GitHub as a reference. However, analytic rules are available in the Analytics rule gallery, while hunting queries need to be copied from the linked GitHub page.

The following built-in analytic rules now work with normalized DNS parsers:
 - [Excessive NXDOMAIN DNS Queries (Normalized DNS)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimDNS/imDns_ExcessiveNXDOMAINDNSQueries.yaml)
 - [DNS events related to mining pools (Normalized DNS)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimDNS/imDNS_Miners.yaml)
 - [DNS events related to ToR proxies (Normalized DNS)](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/ASimDNS/imDNS_TorProxies.yaml)
 - [Known Barium domains](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/BariumDomainIOC112020.yaml)
 - [Known Barium IP addresses](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/BariumIPIOC112020.yaml) 
 - [Exchange Server Vulnerabilities Disclosed March 2021 IoC Match](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/ExchangeServerVulnerabilitiesMarch2021IoCs.yaml)
 - [Known GALLIUM domains and hashes](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/GalliumIOCs.yaml)
 - [Known IRIDIUM IP](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/IridiumIOCs.yaml)
 - [NOBELIUM - Domain and IP IOCs - March 2021](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/NOBELIUM_DomainIOCsMarch2021.yaml)
 - [Known Phosphorus group domains/IP](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/PHOSPHORUSMarch2019IOCs.yaml)
 - [Known STRONTIUM group domains - July 2019](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/STRONTIUMJuly2019IOCs.yaml)
 - [Solorigate Network Beacon](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/Solorigate-Network-Beacon.yaml)
 - [THALLIUM domains included in DCU takedown](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/ThalliumIOCs.yaml)
 - [Known ZINC Comebacker and Klackring malware hashes](https://github.com/Azure/Azure-Sentinel/blob/master/Detections/MultipleDataSources/ZincJan272021IOCs.yaml)



## Schema details

The DNS information model is aligned with the [OSSEM DNS entity schema](https://github.com/OTRF/OSSEM/blob/master/docs/cdm/entities/dns.md).

For more information, see the [Internet Assigned Numbers Authority (IANA) domain name system parameter reference](https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml).

### Log Analytics fields

The following fields are generated by Log Analytics for each record, and you can override them when [creating a custom connector](create-custom-connector.md).

| **Field** | **Type** | **Description** |
| --- | --- | --- |
| <a name=timegenerated></a>**TimeGenerated** | Date/time | The time the event was generated by the reporting device. |
| **\_ResourceId** | guid | The Azure Resource ID of the reporting device or service, or the log forwarder resource ID for events forwarded using Syslog, CEF, or WEF. |
| | | |

> [!NOTE]
> More Log Analytics fields, less related to security, are documented with [Azure Monitor](../azure-monitor/logs/log-standard-columns.md).
> 

### Event fields

Event fields are common to all schemas, and describe the activity itself and the reporting device.

| **Field** | **Class** | **Type** | **Example** | **Discussion** |
| --- | --- | --- | --- | --- |
| **EventMessage** | Optional | String | | A general message or description, either included in or generated from the record. |
| **EventCount** | Mandatory | Integer | `1` | The number of events described by the record. <br><br>This value is used when the source supports aggregation and a single record may represent multiple events. <br><br>For other sources, it should be set to **1**. |
| **EventStartTime** | Mandatory | Date/time | | If the source supports aggregation and the record represents multiple events, use this field to specify the time that the first event was generated. <br><br>In other cases, alias the [TimeGenerated](#timegenerated) field. |
| **EventEndTime** | | Alias || Alias to the [TimeGenerated](#timegenerated) field. |
| **EventType** | Mandatory | Enumerated | `lookup` | Indicate the operation reported by the record. <br><Br> For DNS records, this value would be the [DNS op code](https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml). |
| **EventSubType** | Optional | Enumerated || Either **request** or **response**. For most sources, [only the responses are logged](#guidelines-for-collecting-dns-events), and therefore the value is often **response**.  |
| **EventResult** | Mandatory | Enumerated | `Success` | One of the following values: **Success**, **Partial**, **Failure**, **NA** (Not Applicable).<br> <br>The value may be provided in the source record using different terms, which should be normalized to these values. Alternatively, the source may provide only the [EventResultDetails](#eventresultdetails) field, which should be analyzed to derive the EventResult value.<br> <br>If this record represents a request and not a response, set to **NA**. |
| <a name=eventresultdetails></a>**EventResultDetails** | Mandatory | Alias | `NXDOMAIN` | Reason or details for the result reported in the **_EventResult_** field. Aliases the [ResponseCodeName](#responsecodename) field.|
| **EventOriginalUid** | Optional | String | | A unique ID of the original record, if provided by the source. |
| **EventOriginalType**   | Optional    | String  | `lookup` |   The original event type or ID, if provided by the source. |
| <a name ="eventproduct"></a>**EventProduct** | Mandatory | String | `DNS Server` | The product generating the event. This field may not be available in the source record, in which case it should be set by the parser. |
| **EventProductVersion** | Optional | String | `12.1` | The version of the product generating the event. This field may not be available in the source record, in which case it should be set by the parser. |
| **EventVendor** | Mandatory | String | `Microsoft` | The vendor of the product generating the event. This field may not be available in the source record, in which case it should be set by the parser. |
| **EventSchemaVersion** | Mandatory | String | `0.1.1` | The version of the schema documented here is **0.1.1**. |
| **EventReportUrl** | Optional | String | | A URL provided in the event for a resource that provides more information about the event. |
| <a name="dvc"></a>**Dvc** | Mandatory       | String     |    `ContosoDc.Contoso.Azure` |           A unique identifier of the device on which the event occurred. <br><br>This field may alias the [DvcId](#dvcid), [DvcHostname](#dvchostname), or [DvcIpAddr](#dvcipaddr) fields. For cloud sources, for which there is no apparent device, use the same value as the [Event Product](#eventproduct) field.         |
| <a name ="dvcipaddr"></a>**DvcIpAddr**           | Recommended | IP Address |  `45.21.42.12` |       The IP Address of the device on which the process event occurred.  |
| <a name ="dvchostname"></a>**DvcHostname**         | Recommended | Hostname   | `ContosoDc.Contoso.Azure` |              The hostname of the device on which the process event occurred.                |
| <a name ="dvcid"></a>**DvcId**               | Optional    | String     || The unique ID of the device on which the process event occurred. <br><br>Example: `41502da5-21b7-48ec-81c9-baeea8d7d669`   |
| <a name=additionalfields></a>**AdditionalFields** | Optional | Dynamic | | If your source provides other information worth preserving, either keep it with the original field names or create the **AdditionalFields** dynamic field, and add to the extra information as key/value pairs. |
| | | | | |

### DNS-specific fields

The fields below are specific to DNS events. That said, many of them do have similarities in other schemas and therefore follow the same naming convention.

| **Field** | **Class** | **Type** | **Example** | **Notes** |
| --- | --- | --- | --- | --- |
| **SrcIpAddr** | Mandatory | IP Address |  `192.168.12.1 `| The IP address of the client sending the DNS request. For a recursive DNS request, this value would typically be the reporting device, and in most cases set to **127.0.0.1**. |
| **SrcPortNumber** | Optional | Integer |  `54312` | Source port of the DNS query. |
| **DstIpAddr** | Optional | IP Address |  `127.0.0.1` | The IP address of the server receiving the DNS request. For a regular DNS request, this value would typically be the reporting device, and in most cases set to **127.0.0.1**. |
| **DstPortNumber** | Optional | Integer |  `53` | Destination Port number |
| **IpAddr** | | Alias | | Alias for SrcIpAddr |
| <a name=query></a>**DnsQuery** | Mandatory | FQDN | `www.malicious.com` | The domain that needs to be resolved. <br><br>Note that there are sources that send the query in a different format. Most notably, in the DNS protocol itself, the query includes a dot at the end. This should be removed.<br><br>While the DNS protocol allows for multiple queries in a single request, this scenario is rare, if it's found at all. If the request has multiple queries, store the first one in this field, and then and optionally keep the rest in the [AdditionalFields](#additionalfields) field. |
| **Domain** | | Alias || Alias to [Query](#query). |
| **DnsQueryType** | Optional | Integer | `28` | This field may contain [DNS Resource Record Type codes](https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml)). |
| **DnsQueryTypeName** | Mandatory | Enumerated | `AAAA` | The field may contain [DNS Resource Record Type](https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml) names. <br><br>**Note**: IANA does not define the case for the values, so analytics must normalize the case as needed. If the source provides only a numerical query type code and not a query type name, the parser must include a lookup table to enrich with this value. |
| <a name=responsename></a>**DnsResponseName** | Optional | String | | The content of the response, as included in the record.<br> <br> The DNS response data is inconsistent across reporting devices, is complex to parse, and has less value for source agnostics analytics. Therefore the information model does not require parsing and normalization, and Azure Sentinel uses an auxiliary function to provide response information. For more information, see [Handling DNS response](#handling-dns-response).|
| <a name=responsecodename></a>**DnsResponseCodeName** |  Mandatory | Enumerated | `NXDOMAIN` | The [DNS response code](https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml). <br><br>**Note**: IANA does not define the case for the values, so analytics must normalize the case. If the source provides only a numerical response code and not a response code name, the parser must include a lookup table to enrich with this value. <br><br> If this record represents a request and not a response, set to **NA**. |
| **DnsResponseCode** | Optional | Integer | `3` | The [DNS numerical response code](https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml).|
| **TransactionIdHex** | Recommended | String | | The DNS unique hex transaction ID. |
| **NetworkProtocol** | Optional | Enumerated | `UDP` | The transport protocol used by the network resolution event. The value can be **UDP** or **TCP**, and is most commonly set to **UDP** for DNS. |
| **DnsQueryClass** | Optional | Integer | | The [DNS class ID](https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml).<br> <br>In practice, only the **IN** class (ID 1) is used, making this field less valuable.|
| **DnsQueryClassName** | Optional | String | `"IN"` | The [DNS class name](https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml).<br> <br>In practice, only the **IN** class (ID 1) is used, making this field less valuable. |
| <a name=flags></a>**DnsFlags** | Optional | List of strings | `["DR"]` | The flags field, as provided by the reporting device. If flag information is provided in multiple fields, concatenate them with comma as a separator. <br><br>Since DNS flags are complex to parse and are less often used by analytics, parsing and normalization are not required, and Azure Sentinel uses an auxiliary function to provide flags information. For more information, see [Handling DNS response](#handling-dns-response).|
| <a name=UrlCategory></a>**UrlCategory** |   | String | `Educational \\ Phishing` | A DNS event source may also look up the category of the requested Domains. The field is called **_UrlCategory_** to align with the Azure Sentinel network schema. <br><br>**_DomainCategory_** is added as an alias that's fitting to DNS. |
| **DomainCategory** | | Alias | | Alias to [UrlCategory](#UrlCategory). |
| **ThreatCategory** |   | String |   | If a DNS event source also provides DNS security, it may also evaluate the DNS event. For example, it may search for the IP address or domain in a threat intelligence database, and may assign the domain or IP address with a Threat Category. |
| **EventSeverity** | Optional | String | `"Informational"` | If a DNS event source also provides DNS security, it may evaluate the DNS event. For example, it may search for the IP address or domain in a threat intelligence database, and may assign a severity based on the evaluation. |
| **DvcAction** | Optional | String | `"Blocked"` | If a DNS event source also provides DNS security, it may take an action on the request, such as blocking it. |
| | | | | |

### Additional aliases (deprecated)

The following fields are aliases which are maintained for backward compatibility:
- Query (alias to DnsQuery)
- QueryType (alias to DnsQueryType)
- QueryTypeName (alias to DnsQueryTypeName)
- ResponseName (alias to DnsReasponseName)
- ResponseCodeName (alias to DnsResponseCodeName)
- ResponseCode (alias to DnsResponseCode)
- QueryClass (alias to DnsQueryClass)
- QueryClassName (alias to DnsQueryClassName)
- Flags (alias to DnsFlags)

### Additional entities

Events evolve around entities such as users, hosts, process, or files. Each entity may require several fields to describe. For example, a host may have a name and an IP address. In addition, a single record may include multiple entities of the same type, for example a source and destination host. 
The DNS schema as documented above includes fields that describe entities. If your source includes other information to describe those entities, add more fields based on the entities below to capture this information. For more information about entities, refer to [Normalization in Azure Sentinel](normalization.md).

| **Entity** | **Fields** | **Type** | **Mandatory fields** | **Notes** |
| --- | --- | --- | --- | --- |
| **Actor** | Actor\* | User |  | Most DNS event sources do not provide user information, which is typically not part of the DNS protocol. <br><br>In some cases, the reporting device provides the user information, usually by resolving the source IP address into a user information. In such cases, represent the user as described in the schema entities documentation. Use **Actor** as a descriptor, as the information is based on the source IP address. <br><br>**Note**: When using **Actor** as an entity descriptor, there is no need to append the **User** field. |
| **Source Device** | Src\* | Device | `SrcIpAddr` | DNS event sources usually report the IP address of the source of the request, and therefore **SrcIpAddr** is mandatory. <br><br>If the reporting device provides more information on the source of the request, or if you enrich the data, use the device entity guidelines to normalize using **Src** as the field's prefix. |
| **Destination Device** | Dst\* | Device |  | DNS event sources usually do not report information about the destination of the request. If the reporting device provides information on the destination of the request, or if you enrich the data, use the device entity guidelines to normalize, using **Dst** as the prefix. |
| **Reporting Device** | Dvc\* | Device | `Dvc` | Most events include information about the reporting device. Use the prefix Dvc for those fields|
| **Process Information** | Process\* | Process |  | Information related to the process that generated the DNS query on the client device. |
| | | | | |

## Handling DNS response

In most cases, logged DNS events do not include response information, which may be large and detailed. If your record includes more response information, store it in the [ResponseName](#responsename) field as it appears in the record.

You can also provide an extra KQL function called `_imDNS<vendor>Response_`, which takes the unparsed response as input and returns dynamic value with the following structure:

```kql
[
    {
        "part": "answer"
        "query": "yahoo.com."
        "TTL": 1782
        "Class": "IN"
        "Type": "A"
        "Response": "74.6.231.21"
    }
    {
        "part": "authority"
        "query": "yahoo.com."
        "TTL": 113066
        "Class": "IN"
        "Type": "NS"
        "Response": "ns5.yahoo.com"
    }
    ...
]
```

The fields in each dictionary in the dynamic value correspond to the fields in each DNS response. The `part` entry should include either `answer`, `authority`, or `additional` to reflect the part in the response that the dictionary belongs to.

> [!TIP]
> To ensure optimal performance, call the `imDNS<vendor>Response` function only when needed, and only after an initial filtering to ensure better performance.
>

## Handling DNS flags

Parsing and normalization are not required for flag data. Instead, store the flag data provided by the reporting device in the [Flags](#flags) field.

You can also provide an extra KQL function called `_imDNS<vendor>Flags_`, which takes the unparsed response as input and returns a dynamic list, with Boolean values that represent each flag in the following order:

- Authenticated (AD)
- Authoritative (AA)
- Checking Disabled (CD)
- Recursion Available (RA)
- Recursion Desired (RD)
- Truncated (TC)
- Z

## Next steps

For more information, see:

- [Normalization in Azure Sentinel](normalization.md)
- [Azure Sentinel authentication normalization schema reference (Public preview)](authentication-normalization-schema.md)
- [Azure Sentinel data normalization schema reference](normalization-schema.md)
- [Azure Sentinel file event normalization schema reference (Public preview)](file-event-normalization-schema.md)
- [Azure Sentinel process event normalization schema reference](process-events-normalization-schema.md)
- [Azure Sentinel registry event normalization schema reference (Public preview)](registry-event-normalization-schema.md)
