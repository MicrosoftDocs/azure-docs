---
title: Azure Sentinel Network Session normalization schema reference (Public preview) | Microsoft Docs
description: This article displays the Azure Sentinel Network Session normalization schema.
services: sentinel
cloud: na
documentationcenter: na
author: oshezaf
manager: rkarlin

ms.assetid:
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: reference
ms.date: 08/17/2021
ms.author: ofshezaf

---

# Azure Sentinel Network Session version 2 normalization schema reference (Public preview)

> [!IMPORTANT]
> This document is about version 2 of the network normalization schema. See [Azure Sentinel network normalization schema version 1 reference (Public Preview)](normalization-schema.md) for more details on version 1, or refer to the [change list](#changes) below to learn about the difference between the versions. 
>

The Network Session normalization schema is used to describe an IP network activity. This includes network connections and network sessions. Such events are reported, for example, by operating systems, routers, firewalls, intrusion prevention systems and web security gateways.

For more information about normalization in Azure Sentinel, see [Normalization and the Azure Sentinel Information Model (ASIM)](normalization.md).

> [!IMPORTANT]
> The Network normalization schema is currently in PREVIEW. This feature is provided without a service level agreement, and is not recommended for production workloads.
>
> The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Support for common network telemetry sources

This schema is designed to represent any IP network session. However, it is specifically extended to provide support for common source types of sources.

For those source types, the schema provides:

- Extensions which list fields used for those sources. The extensions are documented below. Each include fields that are mandatory if the extension is used.
- Additional guidelines for common event fields when used with those log sources.
- Additional source agnostic parsers will filter only relevant events for the source type and enable using only the relevant events for specific use cases.

To normalize specific sources and use them in queries, follow these guidelines:

### Netflow

| Task | How to? | 
| --- | --- |
| Normalize Netflow Events | To normalize Netflow events map them to Network Session fields. Netflow telemetry supports aggregation, and the field EventCount should reflect this and be set to the Netflow &quot;Flows&quot; value. |
| Use Netflow Events | Netflow events will be surfaces as part of the imNetworkSession source agnostic parser. When creating an aggregative query, don&#39;t forget to take into account the EventCount field, which may not be set to 1. |

### Firewalls

| Task | How to? | 
| --- | --- |
| Normalize Firewall Events | To normalize events from Firewalls, map relevant events, in addition to the Event and Network Session fields, also the Session inspection fields. Also, filter those events and add them to the **imNotables** source agnostic parser. |
| Use Firewall Events | Firewall events will be surfaces as part of the **imNetworkSession** source agnostic parser. Relevant events identified by the Firewall inspection engines will also be surfaces as part of the **imNotables** source agnostic parsers. |

### Intrusion Prevention Systems

| Task | How to? | 
| --- | --- |
| Normalize Intrusion Prevention Systems (IPS) Events | To normalize events from Intrusion Prevention Systems, map, in addition to the Event and Network Session fields, also the Session inspection fields. Make sure you include your source specific parser in both the imNetworkSession and imNotables source agnostic parsers. |
| Use Intrusion Prevention Systems (IPS) Events | Intrusion Prevention Systems events will be surfaces as part of the imNetworkSession and the imNotables source agnostic parsers. |

### Web Servers

| Task | How to? | 
| --- | --- |
| Normalize Web Servers Events | To normalize events from a web server, map, in addition to the Event and Network Session fields, also the HTTP session fields. Also pay attention to set the EventType to &quot;HTTP Session&quot; and follow the HTTP session specific guidelines for the EventResult and EventResultDetails fields.Make sure you include your source specific parser in both the imNetworkSession and imWebSession source agnostic parsers. |
| Use Web Server Events | Web Server events will be surfaces as part of the imNetworkSession source agnostic parser. However, if you want to use any HTTP specific fields, use the imWebSession parser. |

### Web Security Gateways

| Task | How to? | 
| --- | --- |
| Normalize Web Security Gateways Events | To normalize events from a web server gateway, map, in addition to the Event and Network Session fields, also the: - HTTP session fields. - Session inspection fields - Optionally, the intermediately fields Also pay attention to set the EventType to &quot;HTTP Session&quot; and follow the HTTP session specific guidelines for the EventResult and EventResultDetails fields Make sure you include your source specific parser in both the imNetworkSession and imWebSession source agnostic parsers. Also, filter events detected by the inspection engine and add them to the imNotables source agnostic parser. |
| Use Web Security Gateways Events | Web Server events will be surfaces as part of the imNetworkSession source agnostic parser. However: - If you want to use any HTTP specific fields, use the imWebSession parser. - If you want to analyze detected sessions, use the imNotables source agnostic parser. |


## Using parsers

Azure Sentinel provides the following built-in, product-specific Network Session parsers:

TBD

To use the source-agnostic parser that unifies all of the built-in parsers, and ensure that your analysis runs across all the configured sources, use any of:

- **imNetworkSession** – for all network sessions.
- **imWebSession** – for HTTP sessions, typically reported by web servers, web proxies and web security gateways.
- **imNotables** – for sessions detected by a detection engine, usually as suspicious. Notable events are typically reported by intrusion prevention systems, firewalls and web security gateways.

Deploy the [source-agnostic and source-specific parsers](normalization-about-parsers.md) from the [Azure Sentinel GitHub repository](https://aka.ms/AzSentinelNetworkSession).

## Add your own normalized parsers

When implementing custom parsers for the Network Session information model, name your KQL functions using the following syntax: `imNetworkSession<vendor><Product>`. This function should map all fields relevant for the source.

Add your KQL function to the relevant source agnostic parsers as described above.


## Schema details

The Network Sessions information model is aligned is the [OSSEM Process entity schema](https://github.com/OTRF/OSSEM/blob/master/docs/cdm/entities/process.md).

To conform with industry best practices, the Network Session schema uses the descriptors **Src** and **Dst** to identify the network session source and destination devices, without the need to include the token **Dvc** in the field name.

So, for example, the source device hostname and IP address are called **SrcHostname** and **SrcIpAddr** respectively, and not **SrcDvcHostname** and **SrcDvcIpAddr**. The prefix **Dvc** is used for the reporting device or intermediately device when applicable.

Fields describing the user and application associated with the source and destination devices likewise use the Src and Dst descriptors.

Note that other ASIM schemas typically use Target instead of Dst.

### Log Analytics fields

The following fields are generated by Log Analytics for each record, and can be overridden when creating a custom connector.


| Field | Type | Discussion |
|-------|------|------------| 
| <a name="timegenerated"></a>**TimeGenerated** | datetime | The time the event was generated by the reporting device. |
| **\_ResourceId** | guid | The Azure Resource ID of the reporting device or service, or the log forwarder resource ID for events forwarded using Syslog, CEF or WEF. |
| **Type** | String | The original table from which the record was fetched. This field is useful when the same event can be received through two channels to different tables, but have the same `EventVendor` and `EventProduct`. For example, a Sysmon event can be collected either to the Event table or to the SecurityEvent table. |

> [!NOTE]
> Log Analytics also adds other fields that are less relevant to security use cases. For more information, see [Standard columns in Azure Monitor Logs](../azure-monitor/logs/log-standard-columns.md).
>

### Event fields

Event fields are common to all schemas and describe the activity itself and the reporting device.

| Field | Class | Type | Description |
|-------|-------|------|-------------| 
| **EventMessage** | Optional | String | A general message or description, either included in or generated from the record. |
| **EventCount** | Mandatory | Integer | The number of events described by the record. <br><br>This value is used when the source supports aggregation, and a single record may represent multiple events. <br><br>Note that Netflow sources support aggregation and the EventCount field should be set to the Netflow &quot;FLOWS&quot; field. <br><br> For other sources, set to 1. |
| **EventStartTime** | Mandatory | Date/time | If the source supports aggregation and the record represents multiple events, this field specifies the time the that first event was generated. Otherwise, this field aliases the [TimeGenerated](#timegenerated) field. |
| **EventEndTime** | Mandatory | Alias | Alias to the [TimeGenerated](#timegenerated) field. |
| **EventType** | Mandatory | Enumerated | Describes the operation reported by the record.<br><br> For Network Sessions records, supported values include:<br>- NetworkConnection<br>- NetworkSession<br>- HTTPsession |
| **EventSubType** | Optional | String | Additional description of type if applicable |
| **EventResult** | Mandatory | Enumerated | Describes the result of the event, normalized to one of the following supported values: <br><br> - Success <br> - Partial <br> - Failure <br> - NA (not applicable) <br><br>For an HTTP session, Success is defined as status code below 400 and Failure is defined as status codes 400 as above.  <br><br>The source may provide only a value for the **EventResultDetails**  field, which must be analyzed to get the  **_EventResult_**  value. |
| **EventResultDetails** | Optional | Enumerated | One of the following values:### (look at firewalls)For HTTP sessions, the value should be the HTTP status code. Note: The value may be provided in the source record using different terms, which should be normalized to these values. The original value should be stored in EventResultOriginalDetails |
| **EventSeverity** | Mandatory | Enumerated | The severity of the event, if it represents a detected threat or an alert. Possible values are: Informational, Low, Medium and High.If the event does not represent a threat, use the value Informational.Note: The value may be provided in the source record using different terms, which should be normalized to these values. Store the original value in the **EventOriginalSeverity** field. |
| **EventOriginalSeverity** | Optional | String | The original severity value provided in the source record. |
| **EventOriginalUid** | Optional | String | A unique ID of the original record, if provided by the source.<br><br>Example: 69f37748-ddcd-4331-bf0f-b137f1ea83b |
| **EventOriginalType** | Optional | String | The original event type or ID, if provided by the source.Example: 5031 |
| <a name="eventproduct"></a>**EventProduct** | Mandatory | String | The product generating the event.<br><br> Example: Sysmon<br><br>**Note** : This field may not be available in the source record. In such cases, this field must be set by the parser. |
| **EventProductVersion** | Optional | String | The version of the product generating the event.<br><br>Example: 12.1 |
| **EventVendor** | Mandatory | String | The vendor of the product generating the event.<br><br>Example: Microsoft<br><br>**Note** : This field may not be available in the source record. In such cases, this field must be set by the parser. |
| **EventSchemaVersion** | Mandatory | String | The version of the schema. The version of the schema documented here is 0.2 |
| **EventReportUrl** | Optional | String | A URL provided in the event for a resource that provides additional information about the event. |
| **Dvc** | Alias | String | A unique identifier of the reporting or intermediary device.<br><br>Example: ContosoDc.Contoso.Azure<br><br>This field may alias any of DvcFQDN, **[DvcId](#dvcid)**, [**DvcHostname**](#dvchostname) or [**DvcIpAddr**](#dvcipaddr) fields. For cloud sources, for which there is not apparent device, use the same value as [**Event Product**](#eventproduct). |
| <a name="dvcipaddr"></a>**DvcIpAddr** | Recommended | IP address | The IP address of the reporting or intermediary device.Example: 2001:db8::ff00:42:8329 |
| <a name="dvchostname"></a>**DvcHostname** | Mandatory | String | The hostname of the reporting or intermediary device, excluding domain information. If no device name is available, store the relevant IP address in this field.Example: DESKTOP-1282V4D |
| **DvcDomain** | Recommended | String | The domain of the reporting or intermediary device.Example: Contoso |
| **DvcDomainType** | Recommended | Enumerated | The type of  **DvcDomain** , if known. Possible values include:<br>- Windows (contoso\mypc)<br>- FQDN (docs.microsoft.com)<br><br>Required if DvcDomain is used. |
| **DvcFQDN** | Optional | String | The hostname of the reporting or intermediary device, including domain information when available. Note that this fields can in both traditional FQDN format and Windows domain\hostname format. **DvcDomainType** has to reflect the format used. Example: Contoso\DESKTOP-1282V4D |
| <a name="dvcid"></a>**DvcId** | Optional | String | The ID of the reporting or intermediary device as reported in the record.For example: ac7e9755-8eae-4ffc-8a02-50ed7a2216c3 |
| **DvcIdType** | Optional | Enumerated | The type of DvcId, if known. Possible values include:<br> - AzureResourceId<br>- MDEid<br><br>If multiple IDs are available, use the first one form the list above, and store the others in the fields: DvcAzureRerouceId, DvcMDEid respectively.Required if DvcId is used. |
| **AdditionalFields** | Optional | Dynamic | If your source provides additional information worth preserving, either keep it with the original field names or create the dynamic  **_AdditionalFields_**  field, and add to it the extra information as key/value pairs. |

### Network Session fields


The fields below are common to all network session activity logging:

| Field | Class | Type | Description |
|-------|-------|------|-------------| 
| **DstIpAddr** | Recommended | IP address | The IP address of the connection or session destination.This value is mandatory if DstHostname is specified.<br><br>Example: 2001:db8::ff00:42:8329 |
| **DstPortNumber** | Optional | Integer | The destination IP port.<br><br>Example: 443 |
| **DstHostname** | Recommended | String | The destination device hostname, excluding domain information. If no device name is available, store the relevant IP address in this field.This value is mandatory if DstIpAddr is specified.<br><br>Example: DESKTOP-1282V4D |
| **Hostname** | Alias | | Alias to DstHostname |
| **DstDomain** | Recommended | String | The domain of the destination device.<br><br>Example: Contoso |
| **DstDomainType** | Recommended | Enumerated | The type of  **DstDomain** , if known. Possible values include:<br>- Windows (contoso\mypc)<br>- FQDN (docs.microsoft.com)<br><br>Required if **DstDomain** is used. |
| **DstFQDN** | Optional | String | The destination device hostname, including domain information when available. Note that this fields can in both traditional FQDN format and Windows domain\hostname format. **DstDomainType** has to reflect the format used. <br><br>Example: Contoso\DESKTOP-1282V4D |
| **DstDvcId** | Optional | String | The ID of the destination device as reported in the record.<br><br>For example: ac7e9755-8eae-4ffc-8a02-50ed7a2216c3 |
| **DstDvcIdType** | Optional | Enumerated | The type of DstDvcId, if known. Possible values include:<br> - AzureResourceId<br>- MDEidIf<br><br> multiple IDs are available, use the first one form the list above, and store the others in the fields: DstDvcAzureRerouceId, DstDvcMDEid respectively.<br><br>Required if DstDeviceId is used. |
| **DstDeviceType** | Optional | Enumerated | The type of the destination device. Possible values include:<br>- Computer<br>- Mobile Device<br>- IOT Device<br>- Other |
| **DstUserId** | Optional | String | A machine-readable, alphanumeric, unique representation of the destination user. Format and supported types include:<br>- **SID**  (Windows): S-1-5-21-1377283216-344919071-3415362939-500<br>- **UID**  (Linux): 4578<br>-  **AADID**  (Azure Active Directory): 9267d02c-5f76-40a9-a9eb-b686f3ca47aa<br>-  **OktaId** : 00urjk4znu3BcncfY0h7<br>-  **AWSId** : 72643944673<br><br>Store the ID type in the DstUserIdType field. If other IDs are available, we recommend that you normalize the field names to DstUserSid, DstUserUid, DstUserAADID, DstUserOktaId and UserAwsId, respectively.For more information, see The User entity.<br><br>Example: S-1-12 |
| **DstUserIdType** | Optional | Enumerated | The type of the ID stored in the DstUserId field Supported values are: SID, UIS, AADID, OktaId, and AWSId. |
| **DstUsername** | Optional | String | The Destination username, including domain information when available. Use one of the following formats and in the following order of priority:<br>- Upn/Email: johndow@contoso.com<br>- Windows: Contoso\johndow<br>- DN: CN=Jeff Smith,OU=Sales,DC=Fabrikam,DC=COM<br>- Simple: johndow. Use this form only if domain information is not available.<br><br>Store the Username type in the DstUsernameType field. If other IDs are available, we recommend that you normalize the field names to DstUserUpn, DstUserWindows and DstUserDn.For more information, see The User entity.<br><br>Example: AlbertE |
| **User** | Alias | | Alias to DstUsername |
| **DstUsernameType** | Optional | Enumerated | Specifies the type of the username stored in the DstUsername field. Supported values are: UPN, Windows, DN, and Simple.For more information, see The User entity.<br><br>Example: Windows |
| **DstUserType** | Optional | Enumerated | The type of Actor. Allowed values are:<br>- Regular<br>- Machine<br>- Admin<br>- System<br>- Application<br>- Service Principal<br>- Other<br><br>Note: The value may be provided in the source record using different terms, which should be normalized to these values. Store the original value in the DstOriginalUserType field. |
| **DstOriginalUserType** | Optional | String | The original destination user type, if provided by the source. |
| **DstUserDomain** | Optional | String | This fields is kept for backward compatibility only. ASIM requires domain information, if available, to be part of the **DstUsername** field. |
| **DstAppName** | Optional | String | The name of the destination application.Example: Facebook |
| **DstAppId** | Optional | String | The ID of the destination application, as reported by the reporting device.<br><br>Example: 124 |
| **DstAppType** | Optional | String | The type of the application authorizing on behalf of the Actor. Supported values include:<br>- Process<br>- Service<br>- Resource<br>- URL<br>- SaaS application<br>- Other<br><br>This field is mandatory if DstAppName or DstAppId are used. |
| **DstZone** | Optional | String | The network zone of the destination, as defined by the reporting device.<br><br>Example: Dmz |
| **DstInterfaceName** | Optional | String | The network interface used for the connection or session by the destination device.<br><br>Example: Microsoft Hyper-V Network Adapter |
| **DstInterfaceGuid** | Optional | String | The GUID of the network interface used on the destination device.<br><br>Example:<br>46ad544b-eaf0-47ef-<br> 827c-266030f545a6 |
| **DstMacAddr** | Optional | String | The MAC address of the network interface at used for the connection or session by the destination device.<br><br>Example: 06:10:9f:eb:8f:14 |
| **DstGeoCountry** | Optional | Country | The country associated with the destination IP address. For more information, see [Logical types](normalization-about-schemas.md#logical-types).<br><br>Example: USA |
| **DstGeoRegion** | Optional | Region | The region, or state, within a country associated with the destination IP address. For more information, see [Logical types](normalization-about-schemas.md#logical-types).<br><br>Example: Vermont |
| **DstGeoCity** | Optional | City | The city associated with the destination IP address. For more information, see [Logical types](normalization-about-schemas.md#logical-types).<br><br>Example: Burlington |
| **DstGeoLatitude** | Optional | Latitude | The latitude of the geographical coordinate associated with the destination IP address. For more information, see [Logical types](normalization-about-schemas.md#logical-types).<br><br>Example: 44.475833 |
| **DstGeoLongitude** | Optional | Longitude | The longitude of the geographical coordinate associated with the destination IP address. For more information, see [Logical types](normalization-about-schemas.md#logical-types).<br><br>Example: 73.211944 |
| **SrcIpAddr** | Recommended | IP address | The IP address from which the connection or session originated.This value is mandatory if SrcHostname is specified.<br><br>Example: 77.138.103.108 |
| **IpAddr** | Alias | | Alias to SrcIpAddr |
| **SrcPortNumber** | Optional | Integer | The IP port from which the connection originated. May not be relevant for a session comprising multiple connections.<br><br>Example: 2335 |
| **SrcHostname** | Recommended | String | The source device hostname, excluding domain information. If no device name is available, store the relevant IP address in this field.This value is mandatory if SrcIpAddr is specified.<br><br>Example: DESKTOP-1282V4D |
| **SrcDomain** | Recommended | String | The domain of the source device.<br><br>Example: Contoso |
| **SrcDomainType** | Recommended | Enumerated | The type of  **SrcDomain** , if known. Possible values include:<br>- Windows (contoso)<br>- FQDN (microsoft.com)<br><br>Required if **SrcDomain** is used. |
| **SrcFQDN** | Optional | String | The source device hostname, including domain information when available. Note that this fields can in both traditional FQDN format and Windows domain\hostname format. **SrcDomainType** has to reflect the format used. <br><br>Example: Contoso\DESKTOP-1282V4D |
| **SrcDvcId** | Optional | String | The ID of the source device as reported in the record.<br><br>For example: ac7e9755-8eae-4ffc-8a02-50ed7a2216c3 |
| **SrcDvcIdType** | Optional | Enumerated | The type of SrcDvcId, if known. Possible values include:<br> - AzureResourceId<br>- MDEid<br><br>If multiple IDs are available, use the first one form the list above, and store the others in the fields: SrcDvcAzureRerouceId, SrcDvcMDEid respectively.<br><br>Required if SrcDeviceId is used. |
| **SrcDeviceType** | Optional | Enumerated | The type of the source device. Possible values include:<br>- Computer<br>- Mobile Device<br>- IOT Device<br>- Other |
| **SrcUserId** | Optional | String | A machine-readable, alphanumeric, unique representation of the source user. Format and supported types include:<br>-  **SID**  (Windows): S-1-5-21-1377283216-344919071-3415362939-500<br>-  **UID**  (Linux): 4578<br>-  **AADID**  (Azure Active Directory): 9267d02c-5f76-40a9-a9eb-b686f3ca47aa<br>-  **OktaId** : 00urjk4znu3BcncfY0h7<br>-  **AWSId** : 72643944673<br><br>Store the ID type in the SrcUserIdType field. If other IDs are available, we recommend that you normalize the field names to SrcUserSid, SrcUserUid, SrcUserAadId, SrcUserOktaId and UserAwsId, respectively.For more information, see The User entity.<br><br>Example: S-1-12 |
| **SrcUserIdType** | Optional | Enumerated | The type of the ID stored in the SrcUserId field Supported values are: SID, UIS, AADID, OktaId, and AWSId. |
| **SrcUsername** | Optional | String | The Source username, including domain information when available. Use one of the following formats and in the following order of priority:<br>- Upn/Email: johndow@contoso.com<br>- Windows: Contoso\johndow<br>- DN: CN=Jeff Smith,OU=Sales,DC=Fabrikam,DC=COM<br>- Simple: johndow. Use this form only if domain information is not available.<br><br>Store the Username type in the SrcUsernameType field. If other IDs are available, we recommend that you normalize the field names to SrcUserUpn, SrcUserWindows and SrcUserDn.<br><br>For more information, see The User entity.Example: AlbertE |
| **User** | Alias | | Alias to SrcUsername |
| **SrcUsernameType** | Optional | Enumerated | Specifies the type of the username stored in the SrcUsername field. Supported values are: UPN, Windows, DN, and Simple.For more information, see The User entity.Example: Windows |
| **SrcUserType** | Optional | Enumerated | The type of Actor. Allowed values are:<br>- Regular<br>- Machine<br>- Admin<br>- System<br>- Application<br>- Service Principal<br>- Other<br><br>Note: The value may be provided in the source record using different terms, which should be normalized to these values. Store the original value in the EventOriginalSeverity field.. |
| **SrcOriginalUserType** | | | The original source user type, if provided by the source. |
| **SrcUserDomain** | Optional | String | This fields is kept for backward compatibility only. ASIM requires domain information, if available, to be part of the **SrcUsername** field. |
| **SrcAppName** | Optional | String | The name of the source application. Example: filezilla.exe |
| **SrcAppId** | Optional | String | The ID of the destination application, as reported by the reporting device.<br><br>Example: 124 |
| **SrcAppType** | Optional | String | The type of the source application. Supported values include:<br>- Process<br>- Service<br>- Resource<br>- Other<br><br>This field is mandatory if SrcAppName or SrcAppId are used. |
| **SrcZone** | Optional | String | The network zone of the source, as defined by the reporting device.<br>Example: Internet |
| **SrcIntefaceName** | Optional | String | The network interface used for the connection or session by the source device.Example: eth01 |
| **SrcInterfaceGuid** | Optional | String | The GUID of the network interface used on the source device.<br><br>Example:<br>46ad544b-eaf0-47ef-<br>827c-266030f545a6 |
| **SrcMacAddr** | Optional | String | The MAC address of the network interface from which the connection od session originated.<br><br>Example: 06:10:9f:eb:8f:14 |
| **SrcGeoCountry** | Optional | Country | The country associated with the source IP address.<br><br>Example: USA |
| **SrcGeoRegion** | Optional | Region | The region within a country associated with the source IP address.<br><br>Example: Vermont |
| **SrcGeoCity** | Optional | City | The city associated with the source IP address.<br><br>Example: Burlington |
| **SrcGeoLatitude** | Optional | Latitude | The latitude of the geographical coordinate associated with the source IP address.<br><br>Example: 44.475833 |
| **SrcGeoLongitude** | Optional | Longitude | The longitude of the geographical coordinate associated with the source IP address.<br><br>Example: 73.211944 |
| **NetworkApplicationProtocol** | Optional | String | The application layer protocol used by the connection or session.If the **DstIpPort** is provided, it is recommended to include **NetworkApplicationProtocol.** If it is not available from the source, derive it from **DstIpPort.**.<br><br>Example: HTTP |
| **NetworkProtocol** | Optional | Enumerated | The IP protocol used by the connection or session as listed in [IANA protocol assignment](https://www.iana.org/assignments/protocol-numbers/protocol-numbers.xhtml). Typically, TCP, UDP or ICMP.<br><br>Example: TCP |
| **NetworkDirection** | Optional | Enumerated | The direction the connection or session, into or out of the organization.supported values are: **Inbound** , **Outbound, Listen**. Listen signifies a device has started accepting network connections, and it not a connection per se. |
| **NetworkDuration** | Optional | Integer | The amount of time, in millisecond, for the completion of the network session or connection.<br><br>Example: 1500 |
| **Duration** | Alias | | Alias to **NetworkDuration** |
| **NetworkIcmpCode** | Optional | Integer | For an ICMP message, ICMP message type numeric value as described in [RFC 2780](https://datatracker.ietf.org/doc/html/rfc2780) for IPv4 network connections and in [RFC 4443](https://datatracker.ietf.org/doc/html/rfc4443) for IPv6 network connections.If a **NetworkIcmpType** is provided, this field mandatory and if not available from the source should be derived from **NetworkIcmpType**.<br><br>Example: 34 |
| **NetworkIcmpType** | Optional | String | For an ICMP message, ICMP message type text representation as described in [RFC 2780](https://datatracker.ietf.org/doc/html/rfc2780) for IPv4 network connections and in [RFC 4443](https://datatracker.ietf.org/doc/html/rfc4443) for IPv6 network connections.<br><br>Example: Destination Unreachable |
| **DstBytes** | Recommended | Integer | The number of bytes sent from the destination to the source for the connection or session.If the event is aggregated, DstBytes should be the sum over all aggregated sessions.<br><br>Example: 32455 |
| **SrcBytes** | Recommended | Integer | The number of bytes sent from the source to the destination for the connection or session.If the event is aggregated, SrcBytes should be the sum over all aggregated sessions.<br><br>Example: 46536 |
| **NetworkBytes** | Optional | Integer | Number of bytes sent in both directions. If both BytesReceived and BytesSent exist, BytesTotal should equal their sum.If the event is aggregated, NetworkBytes should be the sum over all aggregated sessions.<br><br>Example: 78991 |
| **DstPackets** | Optional | Integer | The number of packets sent from the destination to the source for the connection or session. The meaning of a packet is defined by the reporting device.If the event is aggregated, **DstPackets** should be the sum over all aggregated sessions.<br><br>Example: 446 |
| **SrcPackets** | Optional | Integer | The number of packets sent from the source to the destination for the connection or session. The meaning of a packet is defined by the reporting device.If the event is aggregated, **SrcPackets** should be the sum over all aggregated sessions.<br><br>Example: 6478 |
| **NetworkPackets** | Optional | Integer | Number of packets sent in both directions. If both PacketsReceived and PacketsSent exist, BytesTotal should equal their sum. The meaning of a packet is defined by the reporting device.If the event is aggregated, **NetworkPackets** should be the sum over all aggregated sessions.<br><br>Example: 6924 |
| **NetworkSessionId** | Optional | string | The session identifier as reported by the reporting device. <br><br>Example: 172\_12\_53\_32\_4322\_\_123\_64\_207\_1\_80 |
| **SessionId** | Alias | String | Alias to NetworkSessionId |

### Intermediary device fields

The following fields are useful if the record include information about an intermediary device, such as a Firewall or a Proxy, which relays the network session

| Field | Class | Type | Description |
| --- | --- | --- | --- |
| **DstNatIpAddr** | Optional | IP address | If reported by an intermediary NAT device such as a firewall, the IP address used by the NAT device for communication with the source.<br><br>Example: 2::1 |
| **DstNatPortNumber** | Optional | Integer | If reported by an intermediary NAT device such as a firewall, the port used by the NAT device for communication with the source.<br><br>Example: 443 |
| **SrcNatIpAddr** | Optional | IP address | If reported by an intermediary NAT device such as a firewall, the IP address used by the NAT device for communication with the destination.<br><br>Example: 4.3.2.1 |
| **SrcNatPortNumber** | Optional | Integer | If reported by an intermediary NAT device such as a firewall, the port used by the NAT device for communication with the destination.<br><br>Example: 345 |
| **DvcInboundInterface** | Optional | String | If reported by an intermediary device such as a firewall, the network interface used by it for the connection to the source device.<br><br>Example: eth0 |
| **DvcOutboundInterface** | Optional | String | If reported by an intermediary device such as a firewall, the network interface used by it for the connection to the destination device.<br><br>Example: Ethernet adapter Ethernet 4e |

### HTTP Session fields

An HTTP session is a network session that uses the HTTP protocol. Such a session is often reported by web servers, web proxies and web security gateways. The following are additional fields that are specific to HTTP sessions:

| Field | Class | Type | Description |
| --- | --- | --- | --- |
| **Url** | Recommended\* | String | For HTTP/HTTPS network sessions, the full HTTP request full URL, including parameters. \*This field is mandatory if the event represents an HTTP session.<br><br>Example: https://contoso.com/fo/?k=v&amp;q=u#f |
| **UrlCategory** | Optional | String | The defined grouping of a URL or the domain part of the URL. The category is commonly provided by web security gateways and is based on the content of the site the URL points to. related to what it is (i.e.:, etc.).<br><br>Examples include search engines, adult, news, advertising, and parked domains. |
| **UrlOriginal** | Optional | String | The original value of URL, in case URL was modified by the reporting device and both value are provided. |
| **HttpVersion** | Optional | String | The HTTP Request Version for HTTP/HTTPS network connections.<br><br>Example: 2.0 |
| **HttpRequestMethod** | Recommended | Enumerated | The HTTP Method for HTTP/HTTPS network sessions. The values are as defined in [RFC 7231](https://datatracker.ietf.org/doc/html/rfc7231#section-4) and [RFC 5789](https://datatracker.ietf.org/doc/html/rfc5789#section-2), and include **GET** , **HEAD** , **POST** , **PUT** , **DELETE** , **CONNECT** , **OPTIONS** , **TRACE** and **PATCH**.<br><br>Example: GET |
| **HttpStatusCode** | Alias | | The HTTP Status Code for HTTP/HTTPS network sessions. Alias to **EventResultDetails.** |
| **HttpContentType** | Optional | String | The HTTP Response content type header for HTTP/HTTPS network sessions.Note that **HttpContentType** may include both the content format and additional parameters such as the encoding used. To get the actual format.<br><br> Example: text/html; charset=ISO-8859-4 |
| **HttpContentFormat** | Optional | String | The content format part of **HttpContentType** Example: text/html |
| **HttpReferrer** | Optional | String | The HTTP referrer header for HTTP/HTTPS network sessions. Note that ASIM, in sync with OSSEM, is using the correct spelling for &quot;referrer&quot; and not the original HTTP header spelling.<br><br>Example: https://developer.mozilla.org/docs |
| **HttpUserAgent** | Optional | String | The HTTP user agent header for HTTP/HTTPS network sessions.<br><br>Example:<br> Mozilla/5.0 (Windows NT 10.0; WOW64)<br>AppleWebKit/537.36 (KHTML, like Gecko)<br>Chrome/83.0.4103.97 Safari/537.36 |
| **UserAgent** | Alias | | Alias to **HttpUserAgent** |
| **HttpRequestXff** | Optional | IP Address | The HTTP X-Forwarded-For header for HTTP/HTTPS network sessions.<br><br>Example: 120.12.41.1 |
| **HttpRequestTime** | Optional | Integer | The amount of time, in milliseconds, it took to send the request to the server, if applicable.<br><br>Example: 700 |
| **HttpResponseTime** | Optional | Integer | The amount of time, in milliseconds, it took to receive a response in the server, if applicable.<br><br>Example: 800 |
| **FileName** | Optional | String | For HTTP uploads, the name of the uploaded file. |
| **FileMD5** | Optional | MD5 | For HTTP uploads, The MD5 hash of the uploaded file.<br><br>Example: 75a599802f1fa166cdadb360960b1dd0 |
| **FileSHA1** | Optional | SHA1 | For HTTP uploads, The SHA1 hash of the uploaded file.<br><br>Example:<br>d55c5a4df19b46db8c54<br>c801c4665d3338acdab0 |
| **FileSHA256** | Optional | SHA256 | For HTTP uploads, The SHA256 hash of the uploaded file.<br><br>Example:<br>e81bb824c4a09a811af17deae22f22dd<br>2e1ec8cbb00b22629d2899f7c68da274 |
| **FileSHA512** | Optional | SHA512 | For HTTP uploads, The SHA512 hash of the uploaded file. |
| **FileSize** | Optional | Integer | For HTTP uploads, the size in bytes of the uploaded file. |
| **FileContentType** | Optional | String | For HTTP uploads, the content type of the uploaded file. |

In addition, the following standard Networking Schema fields have additional guidelines when used for an HTTP session:

- **EventType** should be &quot;HTTP Session&quot;
- **EventResultDetails** should be set to the HTTP Status code.
- **EventResult** should be &quot;Success&quot; for HTTP status codes lower than 400 and &quot;Failure&quot; otherwise.

### Inspection fields

The following fields are used to represent that inspection which a security device such as a firewall, an IPS or a Web Security Gateway performed:

| Field | Class | Type | Description |
| --- | --- | --- | --- |
| **NetworkRuleName** | Optional | String | The name or ID of the rule by which DvcAction was decided upon.<br><br> Example: AnyAnyDrop |
| **NetworkRuleNumber** | Optional | Integer | The number of the rule by which DvcAction was decided upon.<br><br>Example: 23 |
| **Rule** | Mandatory | String | Either **NetworkRuleName** or **NetworkRuleNumber** |
| **DvcAction** | Optional | Enumerated | The action taken on the network session. Supported values are:<br>- Allow<br>- Deny<br>- Drop<br>- Drop ICMP<br>- Reset<br>- Reset Source<br>- Reset Destination<br>- Encrypt<br>- Decrypt<br>- VPNroute<br><br>Note: The value may be provided in the source record using different terms, which should be normalized to these values. The original value should be stored in **DvcActionOriginal.**<br><br>Example: drop |
| **DvcActionOriginal** | Optional | String | The original **DvcAction** as provided by the reporting device. |
| **ThreatId** | Optional | String | The ID of the threat or malware identified in the network session.<br><br>Example: Tr.124 |
| **ThreatName** | Optional | String | The name of the threat or malware identified in the network session.<br><br>Example: EICAR Test File |
| **ThreatCategory** | Optional | String | The category of the threat or malware identified in the network session.<br><br>Example: Trojan |
| **ThreatRiskLevel** | Optional | Integer | The risk level associated with the Session. The level should be a number between 0 and a 100.<br><br>Note: The value may be provided in the source record using a different scale, which should be normalized to this scale. The original value should be stored in **ThreatRiskLevelOriginal.** |
| **ThreatRiskLevelOriginal** | Optional | String | The risk level as reported by the reporting device. |

### Other fields

If the event is reported by one of the endpoints of the network session, it may include information about the process that initiated or terminated the session. Use ASIM Process Event schema to normalize this information.

## <a name="changes"></a>Changes in this version

The original version of the Network Session schema, 0.1, was released as a preview before Azure Sentinel Information Mode (ASIM). This document documents version 0.2 of the Network Session schema, which aligns the schema with ASIM, and includes the following changes:

- Source agnostic and source specific parser names have been changed to conform to ASIM naming convention.
- Specific guidelines and source agnostic parsers where added to accommodate specific device types.
- The fields listed in the table below were changed.

| Change | Version 0.1 | Version 0.2 | Notes and guidelines |
| --- | --- | --- | --- |
| Added | |- EventOriginalType<br>- EventOriginalSeverity<br>- DvcDomain<br>- DvcDomainType<br>- DvcFQDN<br>- DvcId<br>- DstDomainType<br>- DstDvcId<br>- DstDvcIdType<br>- DstDeviceType<br>- DvcIdType<br>- SrcDomainType<br>- SrcDvcId<br>- SrcDvcIdType<br>- SrcDeviceType<br>- DvcIdType<br>- DstUserIdType<br>- DstUsernameType<br>- DstUserType<br>- SrcUserIdType<br>- SrcUsernameType<br>- SrcUserType<br>- SrcAppName<br>- SrcAppId<br>- SrcAppType<br>- DstAppType<br>- DstOriginalUserType<br>- SrcOriginalUserType<br>- Url<br>- DvcActionOriginal<br>- ThreatRiskLevelOriginal | See each field for details. |
| Aliases |- SessionId<br>- Duration<br>- IpAddr<br>- User<br>- Hostname<br>- UserAgent |- NetworkSessionId<br>- NetworkDuration<br>- SrcIpAddr<br>- DstUsername<br>- DstHostname<br>- HttpUserAgent | Add aliases which where introduced with ASIM to the Network Session schema. |
| Modified |- EventType<br>- EventResultDetails<br>- EventSeverity<br> | | Those fields are all now enumerated and require having a value only from a certain list. |
| Renamed | - EventResourceId<br>- EventUid<br> - EventTimeIngested<br> | - \_ResourceId<br>- \_ItemId<br>- ingestion\_time()  | Use the built in Log Analytics fields, which are always available.Note that ingestion\_time() is a KQL function and not a field. |
| Renamed | - HttpReferrerOriginal<br>-HttpUserAgentOriginal |- HttpReferrer<br>- HttpUserAgent | Aligning with improvements in ASIM and OSSEM. |
| Renamed |- CloudAppId<br>- CloudAppName<br>- CloudAppRiskLevel | - DstAppId<br>- DstAppName<br>- ThreatRiskLevel  | Reflect that the network session destination does not have to be a cloud service. |
| Renamed |- DstUserName<br>- SrcUserName | - DstUsername<br>- SrcUsername | Change case to align with ASIM handling of the user entity. |
| Renamed | - DstResourceId<br>- SrcResourceId | - SrcDvcAzureRerouceId<br>- SrcDvcAzureRerouceId  | Better align with ASIM device entity, and allow for resource IDs other than Azure&#39;s. |
| Renamed | - DstDvcDomain<br>- DstDvcFqdn<br>- DstDvcHostname<br>- SrcDvcDomain<br>- SrcDvcFqdn<br>- SrcDvcHostname |- DstDomain<br>- DstFqdn<br>- DstHostname<br>- SrcDomain<br>- SrcFqdn<br>- SrcHostname  | Align all source and destination device fields to not require the &quot;Dvc&quot; phrase. Handling in version 0.1 was inconsistent. |
| Renamed |- FileHashMd5<br>- FileHashSha1<br>- FileHashSha256<br>- FileHashSha512<br>- FileMimeType |- FileMD5<br>- FileSHA1<br>- FileSHA256<br>- FileSHA512<br>- FileContentType | Align with ASIM file representation guidelines. |
| Removed | - DstDvcIpAddr<br>- DstDvcMacAddr<br>- SrcDvcIpAddr<br>- SrcDvcMacAddr | | Duplicate with existing fields without the &quot;Dvc&quot; element in the field name. |
| Removed | - UrlHostname  |  | Align with ASIM handling of URLs. |
| Removed | - SrcDvcOs<br>- SrcDvcModelName<br>- SrcDvcModelNumber<br>- DvcMacAddr<br>- DvcOs | - | Those device fields are not typically provided as part of Network Session events. If an event includes them, refer to the ProcessEvent schema for guidelines on describing device properties. |
| Removed | - FilePath<br>- FileExtension  | - | Align with ASIM file representation guidelines. |
| Removed | - CloudAppOperation  | - | This is field usage implies a difference schema should be selected, for example authentication. |
| Removed |- DstDomainHostname  | - | Duplicate with DstHostname |
