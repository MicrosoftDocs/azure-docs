---
title: Azure Sentinel data normalization schema reference | Microsoft Docs
description: This article displays the Azure Sentinel data normalization schema.
services: sentinel
cloud: na
documentationcenter: na
author: yelevin
manager: rkarlin

ms.assetid:
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: reference
ms.date: 09/08/2020
ms.author: yelevin

---

# Azure Sentinel data normalization schema reference

## Terminology

The following terminology is used in Sentinel’s schemas:

| Term | Definition |
| ---- | ---------- |
| Reporting device | The system sending the records to Azure Sentinel. It may not be the subject system of the record. |
| Record | A unit of data sent from the reporting device. This is often referred to as “log”, “event” or “alert”, but does not necessarily have to be one of those. |
|

## Data types and formats

Values should be normalized based on the guidelines below. This is mandatory for normalized fields and recommended for other fields. 

| Data type | Physical type | Format and value |
| --------- | ------------- | ---------------- |
| **Date/Time** | Depending on the ingest method capability use in descending priority:<ul><li>Log Analytics built in datetime type</li><li>An integer field using Log Analytics datetime numerical representation</li><li>A string field using Log Analytics datetime numerical representation</li></ul> | Log Analytics datetime representation. <br></br>Log Analytics date & time representation is similar in nature but different than Unix time representation. Refer to these conversion guidelines. <br></br>The date & time should be time zone adjusted. |
| **MAC Address** | String | Colon-Hexadecimal notation |
| **IP Address** | IP Address | The schema does not have separate IPv4 and IPv6 addresses. Any IP address field may include either an IPv4 address or IPv6 address:<ul><li>IPv4 in a dot-decimal notation</li><li>IPv6 in 8 hextets notation, allowing for the short forms described here.</li></ul> |
| **User** | String | The following 3 user fields are available:<ul><li>User name</li><li>User UPN</li><li>User domain</li></ul> |
| **User ID** | String | The following 2 user IDs are currently supported:<ul><li>User SID</li><li>Azure Active directory ID</li></ul> |
| **Device** | String | The following 3 device/host columns are supported:<ul><li>ID</li><li>Name</li><li>Fully qualified domain name (FQDN)</li></ul> |
| **Country** | String | A string using ISO 3166-1 according to this priority:<ul><li>Alpha-2 codes (i.e. US for the United States)</li><li>Alpha-3 codes (i.e. USA for the United States)</li><li>Short name</li></ul> |
| **Region** | String | The country sub-division name using ISO 3166-2 |
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
| EventType | String | Traffic | Type of event being collected | Event |
| EventSubType | String | Authentication | Additional description of type if applicable | Event |
| EventCount | Integer  | 10 | The number of events aggregated, if applicable. | Event |
| EventEndTime | Date/Time | See “data types” | The time in which the event ended | Event |
| EventMessage | string |  access denied | A general message or description, either included in, or generated from the record | Event |
| DvcIpAddr | IP Address |  23.21.23.34 | The IP address of the device generating the record | Device,<br>IP |
| DvcMacAddr | String | 06:10:9f:eb:8f:14 | The MAC address of the network interface of the reporting device from which the event was send. | Device,<br>Mac |
| DvcHostname | Device Name (String) | syslogserver1.contoso.com | The device name of the device generating the message. | Device |
| EventProduct | String | OfficeSharepoint | The product generating the event. | Event |
| EventProductVersion | string | 9.0 |  The version of the product generating the event. | Event |
| EventResourceId | Device ID (String) | /subscriptions/3c1bb38c-82e3-4f8d-a115-a7110ba70d05 /resourcegroups/contoso77/providers /microsoft.compute/virtualmachines /syslogserver1 | The resource ID of the device generating the message. | Event |
| EventReportUrl | String | https://192.168.1.1/repoerts/ae3-56.htm | A link to the full report created by the reporting device | Event |
| EventVendor | String | Microsoft | The vendor of the product generating the event. | Event |
| EventResult | Multivalue: Success, Partial, Failure, [Empty] (String) | Success | The result reported for the activity. Empty value when not applicable. | Event |
| EventResultDetails | String | Wrong Password | Reason or details for the result reported in EventResult | Event |
| EventSchemaVersion | Real | 0.1 | Azure Sentinel Schema Version. Currently 0.1. | Event |
| EventSeverity | String | Low | If the activity reported has a security impact, denotes the severity of the impact. | Event |
| EventOriginalUid | String | af6ae8fe-ff43-4a4c-b537-8635976a2b51 | The record ID from the reporting device. | Event |
| EventStartTime | Date/Time | See “data types” | The time in which the event stated | Event |
| TimeGenerated | Date/Time | See “data types” | The time the event occurred, as reported by reporting source. | Custom field |
| EventTimeIngested | Date/Time | See “data types” | The time the event was ingested to Azure Sentinel. Will be added by Azure Sentinel. | Event |
| EventUid | Guid (String) | 516a64e3-8360-4f1e-a67c-d96b3d52df54 | Unique identifier used by Sentinel to mark a row. | Event |
| NetworkApplicationProtocol | String | HTTPS | The application layer protocol used by the connection or session. | Network |
| DstBytes | int | 32455 | The number of bytes sent from the destination to the source for the connection or session. | Destination |
| SrcBytes | int | 46536 | The number of bytes sent from the source to the destination for the connection or session. | Source |
| NetworkBytes | int | 78991 | Number of bytes sent in both directions. If both BytesReceived and BytesSent exist, BytesTotal should equal their sum. | Network |
| NetworkDirection | Multi-value: Inbound, Outbound (string) | Inbound | The direction the connection or session, into or out of the organization. | Network |
| DstGeoCity | String | Burlington | The city associated with the destination IP address | Destination,<br>Geo |
| DstGeoCountry | Country (String) | USA | The country associated with the source IP address | Destination,<br>Geo |
| DstDvcHostname | Device name (String) |  victim_pc | The device name of the destination device | Destination<br>Device |
| DstDvcFqdn | String | victim_pc.contoso.local | The fully qualified domain name of the host where the log was created | Destination,<br>Device |
| DstDomainHostname | string | CONTOSO | The domain of the destination, The domain of the destination host (website, domain name, etc.), for example for DNS lookups or NS lookups | Destination |
| DstInterfaceName | string | Microsoft Hyper-V Network Adapter | The network interface used for the connection or session by the destination device. | Destination |
| DstInterfaceGuid | string | 2BB33827-6BB6-48DB-8DE6-DB9E0B9F9C9B | GUID of the network interface which was used for authentication request  | Destination |
| DstIpAddr | IP address | 2001:db8::ff00:42:8329 | The IP address of the connection or session destination, most commonly referred to as the destination IP in the network packet | Destination,<br>IP |
| DstDvcIpAddr | IP address | 75.22.12.2 | The destination IP address of a device that is not directly associated with the network packet | Destination,<br>Device,<br>IP
| DstGeoLatitude | Latitude (Double) | 44.475833 | The latitude of the geographical coordinate associated with the destination IP address | Destination,<br>Geo |
| DstMacAddr | String | 06:10:9f:eb:8f:14 | The MAC address of the network interface at which the connection or session terminated, most commonly referred to the destination MAC in the network packet | Destination,<br>MAC |
| DstDvcMacAddr | String | 06:10:9f:eb:8f:14 | The destination MAC address of a device that is not directly associated with the network packet. | Destination,<br>Device,<br>MAC |
| DstDvcDomain | String | CONTOSO | The Domain of the destination device. | Destination,<br>Device |
| DstPortNumber | Integer | 443 | The destination IP port. | Destination,<br>Port |
| DstGeoRegion | Region (String) | Vermont | The region within a country associated with the destination IP address | Destination,<br>Geo |
| DstResourceId | Device ID (String) |  /subscriptions/3c1bb38c-82e3-4f8d-a115-a7110ba70d05 /resourcegroups/contoso77/providers /microsoft.compute/virtualmachines /victim | The resource Id of the destination device. | Destination |
| DstNatIpAddr | IP address | 2::1 | If reported by an intermediary NAT device such as a firewall, the IP address used by the NAT device for communication with the source. | Destination NAT,<br>IP |
| DstNatPortNumber | int | 443 | If reported by an intermediary NAT device such as a firewall, the port used by the NAT device for communication with the source. | Destination NAT,<br>Port |
| DstUserSid | User SID |  S-12-1445 | The User ID of the identity associated with the session’s destination. Typically, the identity used to authenticate a server. See "data types" for details. | Destination,<br>User |
| DstUserAadId | String (guid) | ae92b0b4-cfba-4b42-85a0-fbd862f4df54 | The Azure AD account object ID of the user at the destination end of the session | Destination,<br>User |
| DstUserName | Username (String) | johnd | The username of the identity associated with the session’s destination.  | Destination,<br>User |
| DstUserUpn | string | johnd@anon.com | The UPN of the identity associated with the session’s destination. | Destination,<br>User |
| DstUserDomain | string | WORKGROUP | The domain or computer name of the account at the destination of the session | Destination,<br>User |
| DstZone | String | Dmz | The network zone of the destination, as defined by the reporting device. | Destination |
| DstGeoLongitude | Longitude (Double) | -73.211944 | The longitude of the geographical coordinate associated with the destination IP address | Destination,<br>Geo |
| DvcAction | Multi-value: Allow, Deny, Drop (string) | Allow | If reported by an intermediary device such as a firewall, the action taken by device. | Device |
| DvcInboundInterface | String | eth0 | If reported by an intermediary device such as a firewall, the network interface used by it for the connection to the source device. | Device |
| DvcOutboundInterface | String  | Ethernet adapter Ethernet 4 | If reported by an intermediary device such as a firewall, the network interface used by it for the connection to the destination device. | Device |
| NetworkDuration | Integer | 1500 | The amount of time, in millisecond, for the completion of the network session or connection | Network |
| NetworkIcmpCode | Integer | 34 | For an ICMP message, ICMP message type numeric value (RFC 2780 or RFC 4443). | Network |
| NetworkIcmpType | String | Destination Unreachable | For an ICMP message, ICMP message type text representation (RFC 2780 or RFC 4443). | Network |
| DstPackets | int  | 446 | The number of packets sent from the destination to the source for the connection or session. The meaning of a packet is defined by the reporting device. | Destination |
| SrcPackets | int  | 6478 | The number of packets sent from the source to the destination for the connection or session. The meaning of a packet is defined by the reporting device. | Source |
| NetworkPackets | int  | 0 | Number of packets sent in both directions. If both PacketsReceived and PacketsSent exist, BytesTotal should equal their sum. | Network |
| HttpRequestTime | Integer | 700 | The amount of time it took to send the request to the server, if applicable. | Http |
| HttpResponseTime | Integer | 800 | The amount of time it took to receive a response in the server, if applicable. | Http |
| NetworkRuleName | String | AnyAnyDrop | The name or ID of the rule by which DeviceAction was decided upon | Network |
| NetworkRuleNumber | int |  23 | Matched rule number  | Network |
| NetworkSessionId | string | 172_12_53_32_4322__123_64_207_1_80 | The session identifier as reported by the reporting device. For example, L7 session Identifier for specific applications following authentication | Network |
| SrcGeoCity | String | Burlington | The city associated with the source IP address | Source,<br>Geo |
| SrcGeoCountry | Country (String) | USA | The country associated with the source IP address | Source,<br>Geo |
| SrcDvcHostname | Device name (String) |  villain | The device name of the source device | Source,<br>Device |
| SrcDvcFqdn | string | Villain.malicious.com | The fully qualified domain name of the host where the log was created | Source,<br>Device |
| SrcDvcDomain | string | EVILORG | Domain of the device from which session was initiated | Source,<br>Device |
| SrcDvcOs | String | iOS | The OS of the source device | Source,<br>Device |
| SrcDvcModelName | String | Samsung Galaxy Note | The model name of the source device | Source,<br>Device |
| SrcDvcModelNumber | String | 10.0 | The model number of the source device | Source,<br>Device |
| SrcDvcType | String | Mobile | The type of the source device | Source,<br> Device |
| SrcIntefaceName | String | eth01 | The network interface used for the connection or session by the source device. | Source |
| SrcInterfaceGuid | String | 46ad544b-eaf0-47ef-827c-266030f545a6 | GUID of the network interface used | Source |
| SrcIpAddr | IP address | 77.138.103.108 | The IP address from which the connection or session originated. | Source,<br>IP |
| SrcDvcIpAddr | IP address | 77.138.103.108 | The source IP address of a device not directly associated with the network packet (collected by a provider or explicitly calculated). | Source,<br>Device,<br>IP |
| SrcGeoLatitude | Latitude (Double) | 44.475833 | The latitude of the geographical coordinate associated with the source IP address | Source,<br>Geo |
| SrcGeoLongitude | Longitude (Double) | -73.211944 | The longitude of the geographical coordinate associated with the source IP address | Source,<br>Geo |
| SrcMacAddr | String | 06:10:9f:eb:8f:14 | The MAC address of the network interface from which the connection od session originated. | Source,<br>Mac |
| SrcDvcMacAddr | String | 06:10:9f:eb:8f:14 | The source MAC address of a device that is not directly associated with the network packet. | Source,<br>Device,<br>Mac |
| SrcPortNumber | Integer | 2335 | The IP port from which the connection originated. May not be relevant for a session comprising multiple connections. | Source,<br>Port |
| SrcGeoRegion | Region (String) | Vermont | The region within a country associated with the source IP address | Source,<br>Geo |
| SrcResourceId | String | /subscriptions/3c1bb38c-82e3-4f8d-a115-a7110ba70d05 /resourcegroups/contoso77/providers /microsoft.compute/virtualmachines /syslogserver1 | The resource ID of the device generating the message. | Source |
| SrcNatIpAddr | IP address | 4.3.2.1 | If reported by an intermediary NAT device such as a firewall, the IP address used by the NAT device for communication with the destination. | Source NAT,<br>IP |
| SrcNatPortNumber | Integer | 345 | If reported by an intermediary NAT device such as a firewall, the port used by the NAT device for communication with the destination. | Source NAT,<br>Port |
| SrcUserSid | User ID (String) | S-15-1445 | The user ID of the identity associated with the sessions source. Typically, user performing an action on the client. See "data types" for details. | Source,<br>User |
| SrcUserAadId | String (guid) | 16c8752c-7dd2-4cad-9e03-fb5d1cee5477 | The Azure AD account object ID of the user at the source end of the session | Source,<br>User |
| SrcUserName | Username (String) | bob | The username of the identity associated with the sessions source. Typically, user performing an action on the client. See "data types" for details. | Source<br>User |
| SrcUserUpn | string | bob@alice.com | UPN of the account initiating the session | Source,<br>User |
| SrcUserDomain | string | DESKTOP | The domain for the account initiating the session | Source,<br>User |
| SrcZone | String | Tap | The network zone of the source, as defined by the reporting device. | Source |
| NetworkProtocol | String | TCP | The IP protocol used by the connection or session. Typically, TCP, UDP or ICMP | Network |
| CloudAppName | String | Facebook | The name of the destination application for an HTTP application as identified by a proxy. | Cloud |
| CloudAppId | String | 124 | The ID of the destination application for an HTTP application as identified by a proxy. This value is usually specific to the proxy used. | Cloud |
| CloudAppOperation | String | DeleteFile | The operation the user performed in the context of the destination application for an HTTP application as identified by a proxy. This value is usually specific to the proxy used. | Cloud |
| CloudAppRiskLevel | String | 3 | The risk level associated with an HTTP application as identified by a proxy. This value is usually specific to the proxy used. | Cloud |
| FileName | String | ImNotMalicious.exe | The filename transmitted over the network connections for protocols such as FTP and HTTP which provide the file name information. | File |
| FilePath | String | C:\Malicious\ImNotMalicious.exe | The full path, including file name, of the file | File |
| FileHashMd5 | String | 51BC68715FC7C109DCEA406B42D9D78F | The MD5 hash value of the file transmitted over the network connections for protocols. | File |
| FileHashSha1 | String | 491AE3…C299821476F4 | The SHA1 hash value of the file transmitted over the network connections for protocols. | File |
| FileHashSha256 | String | 9B8F8EDB…C129976F03 | The SHA256 hash value of the file transmitted over the network connections for protocols. | File |
| FileHashSha512 | String | 5E127D…F69F73F01F361 | The SHA512 hash value of the file transmitted over the network connections for protocols. | File |
| FileExtension |  String | exe | The type of the file transmitted over the network connections for protocols such as FTP and HTTP. | File
| FileMimeType | String | application/msword | The MIME  type of the file transmitted over the network connections for protocols such as FTP and HTTP | File |
| FileSize | Integer | 23500 | The file size, in bytes, of the file transmitted over the network connections for protocols. | File |
| HttpVersion | String | 2.0 | The HTTP Request Version for HTTP/HTTPS network connections. | Http |
| HttpRequestMethod | String | GET | The HTTP Method for HTTP/HTTPS network sessions. | Http |
| HttpStatusCode | String | 404 | The HTTP Status Code for HTTP/HTTPS network sessions. | Http |
| HttpContentType | String | multipart/form-data; boundary=something | The HTTP Response content type header for HTTP/HTTPS network sessions. | Http |
| HttpReferrerOriginal | String | https://developer.mozilla.org/en-US/docs/Web/JavaScript | The HTTP referrer header for HTTP/HTTPS network sessions. | Http |
| HttpUserAgentOriginal | String | Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36 | The HTTP user agent header for HTTP/HTTPS network sessions. | Http |
| HttpRequestXff | String | 120.12.41.1 | The HTTP X-Forwarded-For header for HTTP/HTTPS network sessions. | Http |
| UrlCategory | String | Search engines | The defined grouping of a URL (or could be just based on the domain in the URL) related to what it is (i.e.: adult, news, advertising, parked domains, etc.) | url |
| UrlOriginal | String | https:// contoso.com/fo/?k=v&q=u#f | The HTTP request URL for HTTP/HTTPS network sessions. | Url |
| UrlHostname | String | contoso.com | The domain part of an HTTP request URL for HTTP/HTTPS network sessions. | Url |
| ThreatCategory | String | Trojan | The category of a threat identified by a security system such as Web Security Gateway of an IPS and is associated with this network session. | Threat |
| ThreatId | String | Tr.124 | The ID of a threat identified by a security system such as Web Security Gateway of an IPS and is associated with this network session. | Threat |
| ThreatName | String | EICAR Test File | The name of the threat or malware identified | Threat |
| AdditionalFields | Dynamic (JSON bag) | {<br>Property1: “val1”,<br>Property2: “val2”<br>} | When no respective column in the schema matches, additional fields can be stored in a JSON bag.<br>For query-time parsing it’s recommended to not use this method as packing data into a JSON will degrade query performance. Instead, it is recommended to promote additional columns.<br>For future ingestion-time parsing scenarios, additional data will of course be collected into this JSON bag column. | Custom field |
| 
