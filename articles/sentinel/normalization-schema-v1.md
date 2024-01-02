---
title: Microsoft Sentinel network normalization schema (Legacy version - Public preview)| Microsoft Docs
description: This article displays the Microsoft Sentinel data normalization schema.
author: oshezaf
ms.topic: reference
ms.date: 11/09/2021
ms.author: ofshezaf
---

# Microsoft Sentinel network normalization schema (Legacy version - Public preview)

The network normalization schema is used to describe reported network events, and is used by Microsoft Sentinel to enable unifying analytics.

For more information, see [Normalization and the Advanced Security Information Model (ASIM)](normalization.md).

> [!IMPORTANT]
> This article relates to version 0.1 of the network normalization schema, which was released as a preview before ASIM was available. [Version 0.2.x](normalization-schema-network.md) of the network normalization schema aligns with ASIM and provides other enhancements.
>
> For more information, see [Differences between network normalization schema versions](#changes)
>

## Terminology

The following terminology is used in Microsoft Sentinel schemas:

| Term | Definition |
| ---- | ---------- |
| **Reporting device** | The system sending the records to Microsoft Sentinel. It may not be the subject system of the record. |
| **Record** | A unit of data sent from the reporting device. This unit of data is often referred to as `log`, `event`, or `alert`, but can also have other types.|
|

## Data types and formats

The following table provides guidance for normalizing data values, which is required for normalized fields, and recommended for other fields.

| Data type | Physical type | Format and value |
| --------- | ------------- | ---------------- |
| **Date/Time** | One of the following, depending on the ingest method capability used, in descending priority:<ul><li>Log Analytics built-in datetime type</li><li>An integer field using Log Analytics datetime numerical representation</li><li>A string field using Log Analytics datetime numerical representation</li></ul> | Log Analytics datetime representation. <br></br>Log Analytics date and time representation is similar in nature but different than Unix time representation. Refer to these conversion guidelines. <br><br>The date and time must be adjusted for time zones. |
| **MAC Address** | String | Colon-Hexadecimal notation |
| **IP Address** | IP Address | The schema does not have separate IPv4 and IPv6 addresses. Any IP address field may include either an IPv4 address or IPv6 address:<ul><li>IPv4 in a dot-decimal notation</li><li>IPv6 in 8 hextets notation, allowing for the short forms described here.</li></ul> |
| **User** | String | The following 3 user fields are available:<ul><li>User name</li><li>User UPN</li><li>User domain</li></ul> |
| **User ID** | String | The following 2 user IDs are currently supported:<ul><li>User SID</li><li>Microsoft Entra ID</li></ul> |
| **Device** | String | The following 3 device/host columns are supported:<ul><li>ID</li><li>Name</li><li>Fully qualified domain name (FQDN)</li></ul> |
| **Country** | String | A string using ISO 3166-1, according to the following priorities:<ul><li>Alpha-2 codes, such as `US` for the United States</li><li>Alpha-3 codes, such as `USA` for the United States</li><li>Short name</li></ul> |
| **Region** | String | The country subdivision name using ISO 3166-2 |
| **City** | String | |
| **Longitude** | Double | ISO 6709 coordinate representation (signed decimal) |
| **Latitude** | Double | ISO 6709 coordinate representation (signed decimal) |
| **Hash Algorithm** | String | The following 4 hash columns are supported:<ul><li>MD5</li><li>SHA1</li><li>SHA256</li><li>SHA512</li></ul> |
| **File Type** | String | The type of the file type:<ul><li>Extension</li><li>Class</li><li>NamedType</li></ul> |
|

## Network sessions table schema

Below is the schema of the network sessions table, versioned 1.0.0

| Field name | Value type | Example | Description | Associated OSSEM entities |
|-|-|-|-|-|
| **EventType** | String | Traffic | Type of event being collected | Event |
| **EventSubType** | String | Authentication | Extra description of type, if applicable | Event |
| **EventCount** | Integer  | 10 | The number of events aggregated, if applicable. | Event |
| **EventEndTime** | Date/Time | See “data types” | The time in which the event ended | Event |
| EventMessage | string |  access denied | A general message or description, either included in, or generated from the record | Event |
| **DvcIpAddr** | IP Address |  23.21.23.34 | The IP address of the device generating the record | Device,<br>IP |
| **DvcMacAddr** | String | 06:10:9f:eb:8f:14 | The MAC address of the network interface of the reporting device from which the event was sent. | Device,<br>Mac |
| **DvcHostname** | Device Name (String) | syslogserver1.contoso.com | The device name of the device generating the message. | Device |
| **EventProduct** | String | OfficeSharepoint | The product generating the event. | Event |
| **EventProductVersion** | string | 9.0 |  The version of the product generating the event. | Event |
| **EventResourceId** | Device ID (String) | /subscriptions/3c1bb38c-82e3-4f8d-a115-a7110ba70d05 /resourcegroups/contoso77/providers /microsoft.compute/virtualmachines /syslogserver1 | The resource ID of the device generating the message. | Event |
| **EventReportUrl** | String | https://192.168.1.1/repoerts/ae3-56.htm | A link to the full report created by the reporting device | Event |
| **EventVendor** | String | Microsoft | The vendor of the product generating the event. | Event |
| **EventResult** | Multivalue: Success, Partial, Failure, [Empty] (String) | Success | The result reported for the activity. Empty value when not applicable. | Event |
| **EventResultDetails** | String | Wrong Password | Reason or details for the result reported in EventResult | Event |
| **EventSchemaVersion** | Real | 0.1 | Microsoft Sentinel Schema Version. Currently 0.1. | Event |
| **EventSeverity** | String | Low | If the activity reported has a security impact, denotes the severity of the impact. | Event |
| **EventOriginalUid** | String | af6ae8fe-ff43-4a4c-b537-8635976a2b51 | The record ID from the reporting device. | Event |
| **EventStartTime** | Date/Time | See “data types” | The time in which the event stated | Event |
| **TimeGenerated** | Date/Time | See “data types” | The time the event occurred, as reported by reporting source. | Custom field |
| **EventTimeIngested** | Date/Time | See “data types” | The time the event was ingested to Microsoft Sentinel. Will be added by Microsoft Sentinel. | Event |
| **EventUid** | Guid (String) | 516a64e3-8360-4f1e-a67c-d96b3d52df54 | Unique identifier used by Microsoft Sentinel to mark a row. | Event |
| **NetworkApplicationProtocol** | String | HTTPS | The application layer protocol used by the connection or session. | Network |
| **DstBytes** | int | 32455 | The number of bytes sent from the destination to the source for the connection or session. | Destination |
| **SrcBytes** | int | 46536 | The number of bytes sent from the source to the destination for the connection or session. | Source |
| **NetworkBytes** | int | 78991 | Number of bytes sent in both directions. If both BytesReceived and BytesSent exist, BytesTotal should equal their sum. | Network |
| **NetworkDirection** | Multi-value: Inbound, Outbound (string) | Inbound | The direction the connection or session, into or out of the organization. | Network |
| **DstGeoCity** | String | Burlington | The city associated with the destination IP address | Destination,<br>Geo |
| **DstGeoCountry** | Country (String) | USA | The country associated with the source IP address | Destination,<br>Geo |
| **DstDvcHostname** | Device name (String) |  victim_pc | The device name of the destination device | Destination<br>Device |
| **DstDvcFqdn** | String | victim_pc.contoso.local | The fully qualified domain name of the host where the log was created | Destination,<br>Device |
| **DstDomainHostname** | string | CONTOSO | The domain of the destination, The domain of the destination host (website, domain name, etc.), for example for DNS lookups or NS lookups | Destination |
| **DstInterfaceName** | string | Microsoft Hyper-V Network Adapter | The network interface used for the connection or session by the destination device. | Destination |
| **DstInterfaceGuid** | string | 2BB33827-6BB6-48DB-8DE6-DB9E0B9F9C9B | GUID of the network interface that was used for the authentication request  | Destination |
| **DstIpAddr** | IP address | 2001:db8::ff00:42:8329 | The IP address of the connection or session destination, most commonly referred to as the destination IP in the network packet | Destination,<br>IP |
| **DstDvcIpAddr** | IP address | 75.22.12.2 | The destination IP address of a device that is not directly associated with the network packet | Destination,<br>Device,<br>IP
| **DstGeoLatitude** | Latitude (Double) | 44.475833 | The latitude of the geographical coordinate associated with the destination IP address | Destination,<br>Geo |
| **DstMacAddr** | String | 06:10:9f:eb:8f:14 | The MAC address of the network interface at which the connection or session terminated, most commonly referred to the destination MAC in the network packet | Destination,<br>MAC |
| **DstDvcMacAddr** | String | 06:10:9f:eb:8f:14 | The destination MAC address of a device that is not directly associated with the network packet. | Destination,<br>Device,<br>MAC |
| **DstDvcDomain** | String | CONTOSO | The Domain of the destination device. | Destination,<br>Device |
| **DstPortNumber** | Integer | 443 | The destination IP port. | Destination,<br>Port |
| **DstGeoRegion** | Region (String) | Vermont | The region associated with the destination IP address | Destination,<br>Geo |
| **DstResourceId** | Device ID (String) |  /subscriptions/3c1bb38c-82e3-4f8d-a115-a7110ba70d05 /resourcegroups/contoso77/providers /microsoft.compute/virtualmachines /victim | The resource ID of the destination device. | Destination |
| **DstNatIpAddr** | IP address | 2::1 | If reported by an intermediary NAT device such as a firewall, the IP address used by the NAT device for communication with the source. | Destination NAT,<br>IP |
| **DstNatPortNumber** | int | 443 | If reported by an intermediary NAT device such as a firewall, the port used by the NAT device for communication with the source. | Destination NAT,<br>Port |
| **DstUserSid** | User SID |  S-12-1445 | The User ID of the identity associated with the session’s destination. Typically, the identity used to authenticate a server. For more information, see [Data types and formats](#data-types-and-formats). | Destination,<br>User |
| **DstUserAadId** | String (guid) | ae92b0b4-cfba-4b42-85a0-fbd862f4df54 | The Microsoft Entra account object ID of the user at the destination end of the session | Destination,<br>User |
| **DstUserName** | Username (String) | johnd | The username of the identity associated with the session’s destination.  | Destination,<br>User |
| **DstUserUpn** | string | johnd@anon.com | The UPN of the identity associated with the session’s destination. | Destination,<br>User |
| **DstUserDomain** | string | WORKGROUP | The domain or computer name of the account at the destination of the session | Destination,<br>User |
| **DstZone** | String | Dmz | The network zone of the destination, as defined by the reporting device. | Destination |
| **DstGeoLongitude** | Longitude (Double) | -73.211944 | The longitude of the geographical coordinate associated with the destination IP address | Destination,<br>Geo |
| **DvcAction** | Multi-value: Allow, Deny, Drop (string) | Allow | If reported by an intermediary device such as a firewall, the action taken by device. | Device |
| **DvcInboundInterface** | String | eth0 | If reported by an intermediary device such as a firewall, the network interface used by it for the connection to the source device. | Device |
| **DvcOutboundInterface** | String  | Ethernet adapter Ethernet 4 | If reported by an intermediary device such as a firewall, the network interface used by it for the connection to the destination device. | Device |
| **NetworkDuration** | Integer | 1500 | The amount of time, in millisecond, for the completion of the network session or connection | Network |
| **NetworkIcmpCode** | Integer | 34 | For an ICMP message, ICMP message type numeric value (RFC 2780 or RFC 4443). | Network |
| **NetworkIcmpType** | String | Destination Unreachable | For an ICMP message, ICMP message type text representation (RFC 2780 or RFC 4443). | Network |
| **DstPackets** | int  | 446 | The number of packets sent from the destination to the source for the connection or session. The meaning of a packet is defined by the reporting device. | Destination |
| **SrcPackets** | int  | 6478 | The number of packets sent from the source to the destination for the connection or session. The meaning of a packet is defined by the reporting device. | Source |
| **NetworkPackets** | int  | 0 | Number of packets sent in both directions. If both PacketsReceived and PacketsSent exist, BytesTotal should equal their sum. | Network |
| **HttpRequestTime** | Integer | 700 | The amount of time it took to send the request to the server, if applicable. | Http |
| **HttpResponseTime** | Integer | 800 | The amount of time it took to receive a response in the server, if applicable. | Http |
| **NetworkRuleName** | String | AnyAnyDrop | The name or ID of the rule by which DeviceAction was decided upon | Network |
| **NetworkRuleNumber** | int |  23 | Matched rule number  | Network |
| **NetworkSessionId** | string | 172_12_53_32_4322__123_64_207_1_80 | The session identifier as reported by the reporting device. For example, L7 session Identifier for specific applications following authentication | Network |
| **SrcGeoCity** | String | Burlington | The city associated with the source IP address | Source,<br>Geo |
| **SrcGeoCountry** | Country (String) | USA | The country associated with the source IP address | Source,<br>Geo |
| **SrcDvcHostname** | Device name (String) |  villain | The device name of the source device | Source,<br>Device |
| **SrcDvcFqdn** | string | Villain.malicious.com | The fully qualified domain name of the host where the log was created | Source,<br>Device |
| **SrcDvcDomain** | string | EVILORG | Domain of the device from which session was initiated | Source,<br>Device |
| **SrcDvcOs** | String | iOS | The OS of the source device | Source,<br>Device |
| **SrcDvcModelName** | String | Samsung Galaxy Note | The model name of the source device | Source,<br>Device |
| **SrcDvcModelNumber** | String | 10.0 | The model number of the source device | Source,<br>Device |
| **SrcDvcType** | String | Mobile | The type of the source device | Source,<br> Device |
| **SrcIntefaceName** | String | eth01 | The network interface used for the connection or session by the source device. | Source |
| **SrcInterfaceGuid** | String | 46ad544b-eaf0-47ef-827c-266030f545a6 | GUID of the network interface used | Source |
| **SrcIpAddr** | IP address | 77.138.103.108 | The IP address from which the connection or session originated. | Source,<br>IP |
| **SrcDvcIpAddr** | IP address | 77.138.103.108 | The source IP address of a device not directly associated with the network packet (collected by a provider or explicitly calculated). | Source,<br>Device,<br>IP |
| **SrcGeoLatitude** | Latitude (Double) | 44.475833 | The latitude of the geographical coordinate associated with the source IP address | Source,<br>Geo |
| **SrcGeoLongitude** | Longitude (Double) | -73.211944 | The longitude of the geographical coordinate associated with the source IP address | Source,<br>Geo |
| **SrcMacAddr** | String | 06:10:9f:eb:8f:14 | The MAC address of the network interface from which the connection od session originated. | Source,<br>Mac |
| **SrcDvcMacAddr** | String | 06:10:9f:eb:8f:14 | The source MAC address of a device that is not directly associated with the network packet. | Source,<br>Device,<br>Mac |
| **SrcPortNumber** | Integer | 2335 | The IP port from which the connection originated. May not be relevant for a session comprising multiple connections. | Source,<br>Port |
| **SrcGeoRegion** | Region (String) | Vermont | The region within a country associated with the source IP address | Source,<br>Geo |
| **SrcResourceId** | String | /subscriptions/3c1bb38c-82e3-4f8d-a115-a7110ba70d05 /resourcegroups/contoso77/providers /microsoft.compute/virtualmachines /syslogserver1 | The resource ID of the device generating the message. | Source |
| **SrcNatIpAddr** | IP address | 4.3.2.1 | If reported by an intermediary NAT device such as a firewall, the IP address used by the NAT device for communication with the destination. | Source NAT,<br>IP |
| **SrcNatPortNumber** | Integer | 345 | If reported by an intermediary NAT device such as a firewall, the port used by the NAT device for communication with the destination. | Source NAT,<br>Port |
| **SrcUserSid** | User ID (String) | S-15-1445 | The user ID of the identity associated with the sessions source. Typically, user performing an action on the client. For more information, see [Data types and formats](#data-types-and-formats). | Source,<br>User |
| **SrcUserAadId** | String (guid) | 16c8752c-7dd2-4cad-9e03-fb5d1cee5477 | The Microsoft Entra account object ID of the user at the source end of the session | Source,<br>User |
| **SrcUserName** | Username (String) | bob | The username of the identity associated with the sessions source. Typically, user performing an action on the client. For more information, see [Data types and formats](#data-types-and-formats). | Source<br>User |
| **SrcUserUpn** | string | bob@alice.com | UPN of the account initiating the session | Source,<br>User |
| **SrcUserDomain** | string | DESKTOP | The domain for the account initiating the session | Source,<br>User |
| **SrcZone** | String | Tap | The network zone of the source, as defined by the reporting device. | Source |
| **NetworkProtocol** | String | TCP | The IP protocol used by the connection or session. Typically, TCP, UDP, or ICMP | Network |
| **CloudAppName** | String | Facebook | The name of the destination application for an HTTP application as identified by a proxy. | Cloud |
| **CloudAppId** | String | 124 | The ID of the destination application for an HTTP application as identified by a proxy. This value is typically specific to the proxy used. | Cloud |
| **CloudAppOperation** | String | DeleteFile | The operation the user performed in the context of the destination application for an HTTP application as identified by a proxy. This value is typically specific to the proxy used. | Cloud |
| **CloudAppRiskLevel** | String | 3 | The risk level associated with an HTTP application as identified by a proxy. This value is typically specific to the proxy used. | Cloud |
| **FileName** | String | ImNotMalicious.exe | The filename transmitted over the network connections for protocols, such as FTP and HTTP, which provide the file name information. | File |
| **FilePath** | String | C:\Malicious\ImNotMalicious.exe | The full path, including file name, of the file | File |
| **FileHashMd5** | String | 51BC68715FC7C109DCEA406B42D9D78F | The MD5 hash value of the file transmitted over the network connections for protocols. | File |
| **FileHashSha1** | String | 491AE3…C299821476F4 | The SHA1 hash value of the file transmitted over the network connections for protocols. | File |
| **FileHashSha256** | String | 9B8F8EDB…C129976F03 | The SHA256 hash value of the file transmitted over the network connections for protocols. | File |
| **FileHashSha512** | String | 5E127D…F69F73F01F361 | The SHA512 hash value of the file transmitted over the network connections for protocols. | File |
| **FileExtension** |  String | exe | The type of the file transmitted over the network connections for protocols such as FTP and HTTP. | File
| **FileMimeType** | String | application/msword | The MIME  type of the file transmitted over the network connections for protocols such as FTP and HTTP | File |
| **FileSize** | Integer | 23500 | The file size, in bytes, of the file transmitted over the network connections for protocols. | File |
| **HttpVersion** | String | 2.0 | The HTTP Request Version for HTTP/HTTPS network connections. | Http |
| **HttpRequestMethod** | String | GET | The HTTP Method for HTTP/HTTPS network sessions. | Http |
| **HttpStatusCode** | String | 404 | The HTTP Status Code for HTTP/HTTPS network sessions. | Http |
| **HttpContentType** | String | multipart/form-data; boundary=something | The HTTP Response content type header for HTTP/HTTPS network sessions. | Http |
| **HttpReferrerOriginal** | String | https://developer.mozilla.org/en-US/docs/Web/JavaScript | The HTTP referrer header for HTTP/HTTPS network sessions. | Http |
| **HttpUserAgentOriginal** | String | Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36 | The HTTP user agent header for HTTP/HTTPS network sessions. | Http |
| **HttpRequestXff** | String | 120.12.41.1 | The HTTP X-Forwarded-For header for HTTP/HTTPS network sessions. | Http |
| **UrlCategory** | String | Search engines | The defined grouping of a URL, possibly based on the domain in the URL, related to what the content is. For example: adult, news, advertising, parked domains, and so on.) | url |
| **UrlOriginal** | String | https:// contoso.com/fo/?k=v&q=u#f | The HTTP request URL for HTTP/HTTPS network sessions. | Url |
| **UrlHostname** | String | contoso.com | The domain part of an HTTP request URL for HTTP/HTTPS network sessions. | Url |
| **ThreatCategory** | String | Trojan | The category of a threat identified by a security system such as Web Security Gateway of an IPS and is associated with this network session. | Threat |
| **ThreatId** | String | Tr.124 | The ID of a threat identified by a security system such as Web Security Gateway of an IPS and is associated with this network session. | Threat |
| **ThreatName** | String | EICAR Test File | The name of the threat or malware identified | Threat |
| **AdditionalFields** | Dynamic (JSON bag) | {<br>Property1: “val1”,<br>Property2: “val2”<br>} | When no respective column in the schema matches, other fields can be stored in a JSON bag.<br>For query-time parsing, we recommend promoting additional columns instead of using a JSON bag as packing data into JSON code will degrade query performance. | Custom field |
|


## <a name="changes"></a>Differences between the version 0.1 and version 0.2

The original version of the Microsoft Sentinel Network session normalization schema, version 0.1, was released as a preview before ASIM was available.

Differences between version 0.1, documented in this article, and [version 0.2.x](normalization-schema-network.md) include:

- In version 0.2, unifying and source-specific parser names have been changed to conform to a standard ASIM naming convention.
- Version 0.2 adds specific guidelines and unifying parsers to accommodate specific device types.

The following sections describe how [version 0.2.x](normalization-schema-network.md) differs for specific fields.

### Added fields in version 0.2

The following fields were added in [version 0.2.x](normalization-schema-network.md) and do not exist in version 0.1:

:::row:::
   :::column span="":::
      - DstAppType
      - DstDeviceType
      - DstDomainType
      - DstDvcId
      - DstDvcIdType
      - DstOriginalUserType
      - DstUserIdType
      - DstUsernameType
      - DstUserType
      - DvcActionOriginal
      - DvcDomain
   :::column-end:::
   :::column span="":::
      - DvcDomainType
      - DvcFQDN
      - DvcId
      - DvcIdType
      - DvcIdType
      - EventOriginalSeverity
      - EventOriginalType
      - SrcAppId
      - SrcAppName
      - SrcAppType
   :::column-end:::
   :::column span="":::
      - SrcDeviceType
      - SrcDomainType
      - SrcDvcId
      - SrcDvcIdType
      - SrcOriginalUserType
      - SrcUserIdType
      - SrcUsernameType
      - SrcUserType
      - ThreatRiskLevelOriginal
      - Url
   :::column-end:::
:::row-end:::


### Newly aliased fields in version 0.2

The following fields are now aliased in [version 0.2.x](normalization-schema-network.md) with the introduction of ASIM:

|Field in version 0.1  |Alias in version 0.2  |
|---------|---------|
|SessionId     |     NetworkSessionId    |
|Duration     |     NetworkDuration    |
|IpAddr     | SrcIpAddr        |
|User     |     DstUsername    |
|Hostname     |   DstHostname      |
|UserAgent     |     HttpUserAgent    |


### Modified fields in version 0.2

The following fields are enumerated in [version 0.2.x](normalization-schema-network.md), and require a specific value from a provided list.

- EventType
- EventResultDetails
- EventSeverity

### Renamed fields in version 0.2

The following fields were renamed in [version 0.2.x](normalization-schema-network.md):

- **In version 0.2, use the built-in Log Analytics fields:**

    Note that `ingestion_time()` is a KQL function and not a field name.

    |Field in version 0.1  |Renamed in version 0.2  |
    |---------|---------|
    |  EventResourceId  |   _ResourceId      |
    | EventUid   |     _ItemId    |
    | EventTimeIngested   |  ingestion_time()       |


- **Renamed to align with improvements in ASIM and OSSEM**:

    |Field in version 0.1  |Renamed in version 0.2  |
    |---------|---------|
    |  HttpReferrerOriginal  |   HttpReferrer      |
    | HttpUserAgentOriginal   |     HttpUserAgent    |


- **Renamed to reflect that the network session destination does not have to be a cloud service**:

    |Field in version 0.1  |Renamed in version 0.2  |
    |---------|---------|
    |  CloudAppId  |   DstAppId      |
    | CloudAppName   |     DstAppName    |
    | CloudAppRiskLevel   |  ThreatRiskLevel       |


- **Renamed to change the case and align with ASIM handling of the user entity**:

    |Field in version 0.1  |Renamed in version 0.2  |
    |---------|---------|
    |  DstUserName  |   DstUsername      |
    | SrcUserName   |     SrcUsername    |


- **Renamed to better align with the ASIM device entity, and allow for resource IDs other than Azure's**:

    |Field in version 0.1  |Renamed in version 0.2  |
    |---------|---------|
    |  DstResourceId  |   SrcDvcAzureRerouceId      |
    | SrcResourceId   |     SrcDvcAzureRerouceId    |


- **Renamed to remove the `Dvc` string from field names, as handling in version 0.1 was inconsistent**:

    |Field in version 0.1  |Renamed in version 0.2  |
    |---------|---------|
    |  DstDvcDomain  |   DstDomain      |
    | DstDvcFqdn   |     DstFqdn    |
    |  DstDvcHostname  |   DstHostname      |
    | SrcDvcDomain   |     SrcDomain    |
    |  SrcDvcFqdn  |   SrcFqdn      |
    | SrcDvcHostname   |     SrcHostname    |


- **Renamed to align with ASIM file representation guidance**:

    |Field in version 0.1  |Renamed in version 0.2  |
    |---------|---------|
    |  FileHashMd5  |   FileMD5      |
    | FileHashSha1   |     FileSHA1    |
    |  FileHashSha256  |   FileSHA256      |
    | FileHashSha512   |     FileSHA512    |
    |  FileMimeType  |   FileContentType      |


### Removed fields in version 0.2

The following fields exist in version 0.1 only, and were removed in [version 0.2.x](normalization-schema-network.md):

|Reason  |Removed fields  |
|---------|---------|
|**Removed because duplicates exist, without the `Dvc` string in the field name**     |  - DstDvcIpAddr<br> - DstDvcMacAddr<br>- SrcDvcIpAddr<br>- SrcDvcMacAddr       |
|**Removed to align with ASIM handling of URLs**     |  - UrlHostname       |
|**Removed because these fields are not typically provided as part of Network Session events.**<br><br>If an event includes these fields, use the [Process Event schema](normalization-schema-process-event.md) to understand how to describe device properties. |     - SrcDvcOs<br>-&nbsp;SrcDvcModelName<br>-&nbsp;SrcDvcModelNumber<br>- DvcMacAddr<br>- DvcOs         |
|**Removed to align with ASIM file representation guidance**     |   - FilePath<br>- FileExtension      |
|**Removed as this field indicates that a different schema should be used, such as the [Authentication schema](normalization-schema-authentication.md).**     |  - CloudAppOperation       |
|**Removed as it duplicates `DstHostname`**     |  - DstDomainHostname         |



## Next steps

For more information, see:

- [Normalization in Microsoft Sentinel](normalization.md)
- [Microsoft Sentinel authentication normalization schema reference (Public preview)](normalization-schema-authentication.md)
- [Microsoft Sentinel file event normalization schema reference (Public preview)](normalization-schema-file-event.md)
- [Microsoft Sentinel DNS normalization schema reference](normalization-schema-dns.md)
- [Microsoft Sentinel process event normalization schema reference](normalization-schema-process-event.md)
- [Microsoft Sentinel registry event normalization schema reference (Public preview)](normalization-schema-registry-event.md)
