---
title: Microsoft Sentinel Network Session normalization schema reference (Public preview) | Microsoft Docs
description: This article displays the Microsoft Sentinel Network Session normalization schema.
services: sentinel
cloud: na
documentationcenter: na
author: oshezaf
manager: rkarlin
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: reference
ms.date: 11/09/2021
ms.author: ofshezaf
ms.custom: ignite-fall-2021
---

# Microsoft Sentinel Network Session normalization schema reference (Public preview)

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

The Network Session normalization schema is used to describe an IP network activity. This includes network connections and network sessions. Such events are reported, for example, by operating systems, routers, firewalls, intrusion prevention systems and web security gateways.

For more information about normalization in Microsoft Sentinel, see [Normalization and the Advanced SIEM Information Model (ASIM)](normalization.md).

> [!IMPORTANT]
> This article describes version 0.2 of the network normalization schema, where [version 0.1](normalization-schema-v1.md) was released before ASIM was available and does not align with ASIM in several places. For more information, see [Differences between network normalization schema versions](normalization-schema-v1.md#changes). 
>

> [!IMPORTANT]
> The Network normalization schema is currently in PREVIEW. This feature is provided without a service level agreement, and is not recommended for production workloads.
>
> The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Support for common network telemetry sources

The network normalization schema can represent any IP network session, but is specifically designed to provide support for common source types, including:

- Netflow
- Firewalls
- Intrusion prevention systems
- Web servers
- Web security gateways

The following sections provide guidance on normalizing and using the schema for the different source types. Each source type may:
- Support additional fields from the auxiliary field lists: [Intermediary device fields](#Intermediary), [HTTP Session fields](#http-session-fields), and [Inspection fields](#inspection-fields). Some fields might be mandatory only in the context of the specific source type.
- Allow source type specific values to common event fields such as `EventType` and and `EventResult`.
- Support, in addition to the `imNetworkSession` parser, also either the `imWebSession` or `inNetworkNotable` parser, or both.

### Netflow log sources

| Task | Description|
| --- | --- |
| **Normalize Netflow events** | To normalize Netflow events, map them to [network session fields](#network-session-fields). Netflow telemetry supports aggregation, and the `EventCount` field value should reflect this, and be set to the Netflow *Flows* value. |
| **Use Netflow events** | Netflow events are surfaced as part of the [imNetworkSession](#use-parsers) source-agnostic parser. When creating an aggregative query, make sure that you consider the `EventCount` field value, which may not always be set to `1`. |
| | |

### Firewall log sources

| Task | Description |
| --- | --- |
| **Normalize firewall events** | To normalize events from firewalls, map relevant events to [event](#event-fields), [network session](#network-session-fields), and [session inspection](#inspection-fields) fields. Filter those events and add them to the [inNetworkNotables](#use-parsers) source-agnostic parser. |
| **Use Firewall Events** | Firewall events are surfaced as part of the [imNetworkSession](#use-parsers) source-agnostic parser. Relevant events, identified by the firewall inspection engines, are also surfaced as part of the [inNetworkNotables](#use-parsers) source-agnostic parsers. |
| | |

### Intrusion Prevention Systems (IPS) log sources

| Task | Description |
| --- | --- |
| **Normalize IPS events** | To normalize events from intrusion prevention systems, map [event fields](#event-fields), [network session fields](#network-session-fields), and [session inspection fields](#inspection-fields). Make sure to include your source-specific parser in both both the [imNetworkSession](#use-parsers) and [inNetworkNotables](#use-parsers) source-agnostic parsers. |
| **Use IPS events** | IPS events are surfaced as part of the [imNetworkSession](#use-parsers) and [inNetworkNotables](#use-parsers) source-agnostic parsers. |
| | |

### Web servers

| Task | Description |
| --- | --- |
| **Normalize Web Servers Events** | To normalize events from a web server, map [Event fields](#event-fields), [Network Session fields](#network-session-fields), and [HTTP Session fields](#http-session-fields). Make sure to set the `EventType` value to `HTTP Session`, and follow the HTTP session-specific guidance for the `EventResult` and `EventResultDetails` fields. <br><br>Make sure to include your source-specific parser in both the [imNetworkSession](#use-parsers) and [imWebSession](#use-parsers) source-agnostic parsers. |
| **Use Web Server Events** | Web Server events are surfaced as part of the [imNetworkSession](#use-parsers) source-agnostic parser. However, to use any HTTP-specific fields, use the [imWebSession](#use-parsers) parser. |
| | |

### Web security gateways

| Task | Description |
| --- | --- |
| **Normalize Web Security Gateways Events** | To normalize events from a web server gateway, map [event fields](#event-fields), [network session fields](#network-session-fields), [HTTP session fields](#http-session-fields), [session inspection fields](#inspection-fields), and optionally the intermediary fields. <br><br>Make sure to set the `EventType` to `HTTP`, and follow HTTP session-specific guidance for the `EventResult` and `EventResultDetails` fields. <br><br>Make sure you include your source-specific parser in both the [imNetworkSession](#use-parsers) and [imWebSession](#use-parsers) source-agnostic parsers. Also, filter any events detected by the inspection engine and add them to the [inNetworkNotables](#use-parsers) source-agnostic parser. |
| **Use Web Security Gateways Events** | Web Server events are surfaced as part of the [imNetworkSession](#use-parsers) source-agnostic parser. <br><br>- To use any HTTP-specific fields, use the [imWebSession](#use-parsers) parser.<br>- To analyze detected sessions, use the [inNetworkNotables](#use-parsers) source-agnostic parser. |
| | |


## Use parsers

To use a source-agnostic parser that unifies all built-in parsers, and ensure that your analysis runs across all configured sources, use any of the following parsers:


- **imNetworkSession**, for all network sessions
- **imWebSession**, for HTTP sessions, typically reported by web servers, web proxies, and web security gateways
- **inNetworkNotables**, for sessions detected by a detection engine, usually as suspicious. Notable events are typically reported by intrusion prevention systems, firewalls, and web security gateways.

Deploy the [source-agnostic and source-specific parsers](normalization-about-parsers.md) from the [Microsoft Sentinel GitHub repository](https://aka.ms/AzSentinelNetworkSession).

### Built-in source-specific parsers

Microsoft Sentinel provides the following built-in, product-specific Network Session parsers:

- Source specific parsers:
  - **Microsoft 365 Defender for Endpoint** - vimNetworkSessionMicrosoft365Defender
  - **Microsoft Defender for IoT - Endpoint (MD4IoT)** - vimNetworkSessionMD4IoT
  - **Microsoft Sysmon for Linux** - vimNetworkSessionSysmonLinux
  - **Windows Events Firewall** - Windows firewall activity as collected using Windows Events 515x, collected using either the Log Analytics Agent or the Azure Monitor Agent into either the Event or the WindowsEvent table, vimNetworkSessionMicrosoftWindowsEventFirewall 

The parsers can be deployed from the [Microsoft Sentinel GitHub repository](https://aka.ms/AzSentinelNetworkSession).

### Add your own normalized parsers

When implementing custom parsers for the Network Session information model, name your KQL functions using the following syntax: `imNetworkSession<vendor><Product>`. This function should map all fields relevant for the source.

Add your KQL function to the relevant source agnostic parsers as needed, depending on their log sources. For more information, see:

- [Netflow log sources](#netflow-log-sources)
- [Firewall log sources](#firewall-log-sources)
- [Intrusion Prevention Systems (IPS) log sources](#intrusion-prevention-systems-ips-log-sources)
- [Web Servers](#web-servers)
- [Web Security Gateways](#web-security-gateways)

## Schema details

The Network Sessions information model is aligned is the [OSSEM Network entity schema](https://github.com/OTRF/OSSEM/blob/master/docs/cdm/entities/network.md).

To conform with industry best practices, the Network Session schema uses the descriptors **Src** and **Dst** to identify the network session source and destination devices, without including the token **Dvc** in the field name.

So, for example, the source device hostname and IP address are named **SrcHostname** and **SrcIpAddr** respectively, and not **Src*Dvc*Hostname** and **Src*Dvc*IpAddr**. The prefix **Dvc** is only used for the reporting or intermediary device, as applicable.

Fields that describe the user and application associated with the source and destination devices also use the **Src** and **Dst** descriptors.

Other ASIM schemas typically use **Target** instead of **Dst**.

### Log Analytics fields

The following fields are generated by Log Analytics for each record, and can be overridden when [creating a custom connector](create-custom-connector.md).


| Field | Type | Discussion |
|-------|------|------------|
| <a name="timegenerated"></a>**TimeGenerated** | datetime | The time the event was generated by the reporting device. |
| **\_ResourceId** | guid | The Azure Resource ID of the reporting device or service, or the log forwarder resource ID for events forwarded using Syslog, CEF or WEF. |
| **Type** | String | The original table from which the record was fetched. This field is useful when the same event can be received through multiple channels to different tables, but have the same `EventVendor` and `EventProduct` values. <br><br>For example, a Sysmon event can be collected either to the **Event** table or to the **SecurityEvent** table. |
| | | |

> [!NOTE]
> Log Analytics also adds other fields that are less relevant to security use cases. For more information, see [Standard columns in Azure Monitor Logs](../azure-monitor/logs/log-standard-columns.md).
>

### Event fields

Event fields are common to all schemas and describe the activity itself and the reporting device.

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| **EventMessage** | Optional | String | A general message or description, either included in or generated from the record. |
| **EventCount** | Mandatory | Integer | The number of events described by the record. <br><br>This value is used when the source supports aggregation, and a single record may represent multiple events. <br><br>**Note**: Netflow sources support aggregation, and the **EventCount** field should be set to the value of the Netflow **FLOWS** field. For other sources, the value is typically set to `1`. |
| **EventStartTime** | Mandatory | Date/time | If the source supports aggregation and the record represents multiple events, this field specifies the time the that first event was generated. Otherwise, this field aliases the [TimeGenerated](#timegenerated) field. |
| **EventEndTime** | Mandatory | Alias | Alias to the [TimeGenerated](#timegenerated) field. |
| **EventType** | Mandatory | Enumerated | Describes the operation reported by the record.<br><br> For Network Sessions records, supported values include:<br>- `NetworkConnection`<br>- `NetworkSession`<br>- `HTTPsession` |
| **EventSubType** | Optional | String | Additional description of the event type, if applicable. <br> For Network Sessions records, supported values include:<br>- `Start`<br>- `End` |
| **EventResult** | Mandatory | Enumerated | Describes the event result, normalized to one of the following values: <br> - `Success` <br> - `Partial` <br> - `Failure` <br> - `NA` (not applicable) <br><br>For an HTTP session, `Success` is defined as a status code lower than `400`, and `Failure` is defined as a status code higher than `400`. For a list of HTTP status codes refer to [W3 Org](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html).<br><br>The source may provide only a value for the [EventResultDetails](#eventresultdetails)  field, which must be analyzed to get the  **EventResult**  value. |
| <a name="eventresultdetails"></a>**EventResultDetails** | Optional | String | For HTTP sessions, the value should be the HTTP status code. <br><br>**Note**: The value may be provided in the source record using different terms, which should be normalized to these values. The original value should be stored in the **EventOriginalResultDetails** field.|
| **EventOriginalResultDetails**    | Optional    | String     |  The value provided in the original record for [EventResultDetails](#eventresultdetails), if provided by the source.|
| **EventSeverity** | Mandatory | Enumerated | The severity of the event, if it represents a detected threat or an alert. Possible values include `Informational`, `Low`, `Medium`, and `High`. <br><br>If the event does not represent a threat, use the `Informational` value.<br><br>**Note**: The value may be provided in the source record using different terms, which should be normalized to these values. Store the original value in the [EventOriginalSeverity](#eventoriginalseverity) field. |
| <a name="eventoriginalseverity"></a>**EventOriginalSeverity** | Optional | String | The original severity value provided in the source record. |
| **EventOriginalUid** | Optional | String | A unique ID of the original record, if provided by the source.<br><br>Example: `69f37748-ddcd-4331-bf0f-b137f1ea83b` |
| **EventOriginalType** | Optional | String | The original event type or ID, if provided by the source. <br><br>Example: `5031` |
| <a name="eventproduct"></a>**EventProduct** | Mandatory | String | The product generating the event.<br><br>Example: `Sysmon`<br><br>**Note**: This field may not be available in the source record. In such cases, this field must be set by the parser. |
| **EventProductVersion** | Optional | String | The version of the product generating the event.<br><br>Example: `12.1` |
| **EventVendor** | Mandatory | String | The vendor of the product generating the event.<br><br>Example: `Microsoft`<br><br>**Note**: This field may not be available in the source record. In such cases, this field must be set by the parser. |
| **EventSchema** | Mandatory | String | The name of the schema. The name of the schema documented here is `NetworkSession`. |
| **EventSchemaVersion** | Mandatory | String | The version of the schema. The version of the schema documented here is `0.2`. |
| **EventReportUrl** | Optional | String | A URL provided in the event for a resource that provides additional information about the event. |
| **Dvc** | Alias | String | A unique identifier of the reporting or intermediary device.<br><br>Example: `ContosoDc.Contoso.Azure`<br><br>This field may alias the [DvcFQDN](#dvcfqdn), [DvcId](#dvcid), [DvcHostname](#dvchostname), or [DvcIpAddr](#dvcipaddr) fields. For cloud sources, for which there is not apparent device, use the same value as the [Event Product](#eventproduct) field. |
| <a name="dvcipaddr"></a>**DvcIpAddr** | Recommended | IP address | The IP address of the reporting or intermediary device.<br><br>Example: `2001:db8::ff00:42:8329` |
| <a name="dvchostname"></a>**DvcHostname** | Mandatory | String | The hostname of the reporting or intermediary device, excluding domain information. If no device name is available, store the relevant IP address in this field.<br><br>Example: `DESKTOP-1282V4D` |
| <a name="dvcdomain"></a>**DvcDomain** | Recommended | String | The domain of the reporting or intermediary device.<br><br>Example: `Contoso` |
| <a name="dvcdomaintype"></a>**DvcDomainType** | Recommended | Enumerated | The type of  [DvcDomain](#dvcdomain) , if known. Possible values include:<br>- `Windows (contoso\mypc)`<br>- `FQDN (docs.microsoft.com)`<br><br>**Note**: This field is required if the [DvcDomain](#dvcdomain) field is used. |
| <a name="dvcfqdn"></a>**DvcFQDN** | Optional | String | The hostname of the reporting or intermediary device, including domain information when available. <br><br> Example: `Contoso\DESKTOP-1282V4D`<br><br>**Note**: This field supports both both traditional FQDN format and Windows domain\hostname format. The  [DvcDomainType](#dvcdomaintype) field reflects the format used.  |
| <a name="dvcid"></a>**DvcId** | Optional | String | The ID of the reporting or intermediary device as reported in the record.<br><br>Example:  `ac7e9755-8eae-4ffc-8a02-50ed7a2216c3` |
| **DvcIdType** | Optional | Enumerated | The type of [DvcId](#dvcid), if known. Possible values include:<br> - `AzureResourceId`<br>- `MDEid`<br><br>If multiple IDs are available, use the first one from the list, and store the others using the field names  **DvcAzureResourceId** and **DvcMDEid** respectively.<br><br>**Note**: This field is required if the [DvcId](#dvcid) field is used. |
| **AdditionalFields** | Optional | Dynamic | If your source provides additional information worth preserving, either keep it with the original field names or create the dynamic  **AdditionalFields**  field, and add to it the extra information as key/value pairs. |
| | | | |

### Network session fields

The following fields are common to all network session activity logging:

| Field | Class | Type | Description |
|-------|-------|------|-------------|
|<a name="dstipaddr"></a> **DstIpAddr** | Recommended | IP address | The IP address of the connection or session destination. <br><br>Example: `2001:db8::ff00:42:8329`<br><br>**Note**: This value is mandatory if [DstHostname](#dsthostname) is specified. |
| <a name="dstportnumber"></a>**DstPortNumber** | Optional | Integer | The destination IP port.<br><br>Example: `443` |
| <a name="dsthostname"></a>**DstHostname** | Recommended | String | The destination device hostname, excluding domain information. If no device name is available, store the relevant IP address in this field.<br><br>Example: `DESKTOP-1282V4D`<br><br>**Note**: This value is mandatory if [DstIpAddr](#dstipaddr) is specified. |
| **Hostname** | Alias | | Alias to [DstHostname](#dsthostname) |
| <a name="dstdomain"></a>**DstDomain** | Recommended | String | The domain of the destination device.<br><br>Example: `Contoso` |
| <a name="dstdomaintype"></a>**DstDomainType** | Recommended | Enumerated | The type of [DstDomain](#dstdomain), if known. Possible values include:<br>- `Windows (contoso\mypc)`<br>- `FQDN (docs.microsoft.com)`<br><br>Required if [DstDomain](#dstdomain) is used. |
| **DstFQDN** | Optional | String | The destination device hostname, including domain information when available. <br><br>Example: `Contoso\DESKTOP-1282V4D` <br><br>**Note**: This field supports both traditional FQDN format and Windows domain\hostname format. The [DstDomainType](#dstdomaintype) reflects the format used.   |
| <a name="dstdvcid"></a>**DstDvcId** | Optional | String | The ID of the destination device as reported in the record.<br><br>Example: `ac7e9755-8eae-4ffc-8a02-50ed7a2216c3` |
| **DstDvcIdType** | Optional | Enumerated | The type of [DstDvcId](#dstdvcid), if known. Possible values include:<br> - `AzureResourceId`<br>- `MDEidIf`<br><br>If multiple IDs are available, use the first one from the list above, and store the others in the  **DstDvcAzureResourceId** or **DstDvcMDEid** fields, respectively.<br><br>Required if **DstDeviceId** is used.|
| **DstDeviceType** | Optional | Enumerated | The type of the destination device. Possible values include:<br>- `Computer`<br>- `Mobile Device`<br>- `IOT Device`<br>- `Other` |
| <a name="dstuserid"></a>**DstUserId** | Optional | String | A machine-readable, alphanumeric, unique representation of the destination user. <br><br>Supported formats and types include:<br>- **SID**  (Windows): `S-1-5-21-1377283216-344919071-3415362939-500`<br>- **UID**  (Linux): `4578`<br>-  **AADID**  (Azure Active Directory): `9267d02c-5f76-40a9-a9eb-b686f3ca47aa`<br>-  **OktaId**: `00urjk4znu3BcncfY0h7`<br>-  **AWSId**: `72643944673`<br><br>Store the ID type in the [DstUserIdType](#dstuseridtype) field. If other IDs are available, we recommend that you normalize the field names to **DstUserSid**, **DstUserUid**, **DstUserAADID**, **DstUserOktaId** and **UserAwsId**, respectively. For more information, see [The User entity](normalization-about-schemas.md#the-user-entity).<br><br>Example: `S-1-12` |
| <a name="dstuseridtype"></a>**DstUserIdType** | Optional | Enumerated | The type of the ID stored in the [DstUserId](#dstuserid) field. <br><br>Supported values are: `SID`, `UIS`, `AADID`, `OktaId`, and `AWSId`. |
| <a name="dstusername"></a>**DstUsername** | Optional | String | The Destination username, including domain information when available. <br><br>Use one of the following formats and in the following order of priority:<br>- **Upn/Email**: `johndow@contoso.com`<br>- **Windows**: `Contoso\johndow`<br>- **DN**: `CN=Jeff Smith,OU=Sales,DC=Fabrikam,DC=COM`<br>- **Simple**: `johndow`. Use the Simple form only if domain information is not available.<br><br>Store the Username type in the [DstUsernameType](#dstusernametype) field. If other IDs are available, we recommend that you normalize the field names to **DstUserUpn**, **DstUserWindows** and **DstUserDn**.For more information, see [The User entity](normalization-about-schemas.md#the-user-entity).<br><br>Example: `AlbertE` |
| **User** | Alias | | Alias to [DstUsername](#dstusername) |
| <a name="dstusernametype"></a>**DstUsernameType** | Optional | Enumerated | Specifies the type of the username stored in the [DstUsername](#dstusername) field. Supported values include: `UPN`, `Windows`, `DN`, and `Simple`. For more information, see [The User entity](normalization-about-schemas.md#the-user-entity).<br><br>Example: `Windows` |
| **DstUserType** | Optional | Enumerated | The type of Actor. Supported values include:<br>- `Regular`<br>- `Machine`<br>- `Admin`<br>- `System`<br>- `Application`<br>- `Service Principal`<br>- `Other`<br><br>**Note**: The value may be provided in the source record using different terms, which should be normalized to these values. Store the original value in the [DstOriginalUserType](#dstoriginalusertype) field. |
| <a name="dstoriginalusertype"></a>**DstOriginalUserType** | Optional | String | The original destination user type, if provided by the source. |
| **DstUserDomain** | Optional | String | This field is kept for backward compatibility only. ASIM requires domain information, if available, to be part of the [DstUsername](#dstusername) field. |
| <a name="dstappname"></a>**DstAppName** | Optional | String | The name of the destination application.<br><br>Example: `Facebook` |
| <a name="dstappid"></a>**DstAppId** | Optional | String | The ID of the destination application, as reported by the reporting device.<br><br>Example: `124` |
| **DstAppType** | Optional | String | The type of the application authorizing on behalf of the Actor. Supported values include:<br>- `Process`<br>- `Service`<br>- `Resource`<br>- `URL`<br>- `SaaS application`<br>- `Other`<br><br>This field is mandatory if [DstAppName](#dstappname) or [DstAppId](#dstappid) are used. |
| **DstZone** | Optional | String | The network zone of the destination, as defined by the reporting device.<br><br>Example: `Dmz` |
| **DstInterfaceName** | Optional | String | The network interface used for the connection or session by the destination device.<br><br>Example: `Microsoft Hyper-V Network Adapter` |
| **DstInterfaceGuid** | Optional | String | The GUID of the network interface used on the destination device.<br><br>Example:<br>`46ad544b-eaf0-47ef-`<br>`827c-266030f545a6` |
| **DstMacAddr** | Optional | String | The MAC address of the network interface at used for the connection or session by the destination device.<br><br>Example: `06:10:9f:eb:8f:14` |
| **DstGeoCountry** | Optional | Country | The country associated with the destination IP address. For more information, see [Logical types](normalization-about-schemas.md#logical-types).<br><br>Example: `USA` |
| **DstGeoRegion** | Optional | Region | The region, or state, within a country associated with the destination IP address. For more information, see [Logical types](normalization-about-schemas.md#logical-types).<br><br>Example: `Vermont` |
| **DstGeoCity** | Optional | City | The city associated with the destination IP address. For more information, see [Logical types](normalization-about-schemas.md#logical-types).<br><br>Example: `Burlington` |
| **DstGeoLatitude** | Optional | Latitude | The latitude of the geographical coordinate associated with the destination IP address. For more information, see [Logical types](normalization-about-schemas.md#logical-types).<br><br>Example: `44.475833` |
| **DstGeoLongitude** | Optional | Longitude | The longitude of the geographical coordinate associated with the destination IP address. For more information, see [Logical types](normalization-about-schemas.md#logical-types).<br><br>Example: `73.211944` |
| <a name="srcipaddr"></a>**SrcIpAddr** | Recommended | IP address | The IP address from which the connection or session originated. This value is mandatory if **SrcHostname** is specified.<br><br>Example: `77.138.103.108` |
| **IpAddr** | Alias | | Alias to [SrcIpAddr](#srcipaddr) |
| **SrcPortNumber** | Optional | Integer | The IP port from which the connection originated. May not be relevant for a session comprising multiple connections.<br><br>Example: `2335` |
| **SrcHostname** | Recommended | String | The source device hostname, excluding domain information. If no device name is available, store the relevant IP address in this field.This value is mandatory if [SrcIpAddr](#srcipaddr) is specified.<br><br>Example: `DESKTOP-1282V4D` |
|<a name="srcdomain"></a> **SrcDomain** | Recommended | String | The domain of the source device.<br><br>Example: `Contoso` |
| <a name="srcdomaintype"></a>**SrcDomainType** | Recommended | Enumerated | The type of  [SrcDomain](#srcdomain), if known. Possible values include:<br>- `Windows` (such as: `contoso`)<br>- `FQDN` (such as: `microsoft.com`)<br><br>Required if [SrcDomain](#srcdomain) is used. |
| **SrcFQDN** | Optional | String | The source device hostname, including domain information when available. <br><br>**Note**: This field supports both traditional FQDN format and Windows domain\hostname format. The [SrcDomainType](#srcdomaintype) field reflects the format used. <br><br>Example: `Contoso\DESKTOP-1282V4D` |
| <a name="srcdvcid"></a>**SrcDvcId** | Optional | String | The ID of the source device as reported in the record.<br><br>For example: `ac7e9755-8eae-4ffc-8a02-50ed7a2216c3` |
| **SrcDvcIdType** | Optional | Enumerated | The type of [SrcDvcId](#srcdvcid), if known. Possible values include:<br> - `AzureResourceId`<br>- `MDEid`<br><br>If multiple IDs are available, use the first one from the list above, and store the others in the **SrcDvcAzureResourceId** and **SrcDvcMDEid**, respectively.<br><br>**Note**: This field is required if [SrcDvcId](#srcdvcid) is used. |
| **SrcDeviceType** | Optional | Enumerated | The type of the source device. Possible values include:<br>- `Computer`<br>- `Mobile Device`<br>- `IOT Device`<br>- `Other` |
| <a name="srcuserid"></a>**SrcUserId** | Optional | String | A machine-readable, alphanumeric, unique representation of the source user. Format and supported types include:<br>-  **SID**  (Windows): `S-1-5-21-1377283216-344919071-3415362939-500`<br>-  **UID**  (Linux): `4578`<br>-  **AADID**  (Azure Active Directory): `9267d02c-5f76-40a9-a9eb-b686f3ca47aa`<br>-  **OktaId**: `00urjk4znu3BcncfY0h7`<br>-  **AWSId**: `72643944673`<br><br>Store the ID type in the [SrcUserIdType](#srcuseridtype) field. If other IDs are available, we recommend that you normalize the field names to SrcUserSid, SrcUserUid, SrcUserAadId, SrcUserOktaId and UserAwsId, respectively.For more information, see The User entity.<br><br>Example: S-1-12 |
| <a name="srcuseridtype"></a>**SrcUserIdType** | Optional | Enumerated | The type of the ID stored in the [SrcUserId](#srcuserid) field. Supported values include: `SID`, `UIS`, `AADID`, `OktaId`, and `AWSId`. |
| <a name="srcusername"></a>**SrcUsername** | Optional | String | The Source username, including domain information when available. Use one of the following formats and in the following order of priority:<br>- **Upn/Email**: `johndow@contoso.com`<br>- **Windows**: `Contoso\johndow`<br>- **DN**: `CN=Jeff Smith,OU=Sales,DC=Fabrikam,DC=COM`<br>- **Simple**: `johndow`. Use the Simple form only if domain information is not available.<br><br>Store the Username type in the [SrcUsernameType](#srcusernametype) field. If other IDs are available, we recommend that you normalize the field names to **SrcUserUpn**, **SrcUserWindows** and **SrcUserDn**.<br><br>For more information, see [The User entity](normalization-about-schemas.md#the-user-entity).<br><br>Example: `AlbertE` |
| <a name="srcusernametype"></a>**SrcUsernameType** | Optional | Enumerated | Specifies the type of the username stored in the [SrcUsername](#srcusername) field. Supported values are: `UPN`, `Windows`, `DN`, and `Simple`. For more information, see [The User entity](normalization-about-schemas.md#the-user-entity).<br><br>Example: `Windows` |
| **SrcUserType** | Optional | Enumerated | The type of Actor. Allowed values are:<br>- `Regular`<br>- `Machine`<br>- `Admin`<br>- `System`<br>- `Application`<br>- `Service Principal`<br>- `Other`<br><br>**Note**: The value may be provided in the source record using different terms, which should be normalized to these values. Store the original value in the [EventOriginalSeverity](#eventoriginalseverity) field. |
| **SrcOriginalUserType** | | | The original source user type, if provided by the source. |
| **SrcUserDomain** | Optional | String | This field is kept for backward compatibility only. ASIM requires domain information, if available, to be part of the [SrcUsername](#srcusername) field. |
| <a name="srcappname"></a>**SrcAppName** | Optional | String | The name of the source application. <br><br>Example: `filezilla.exe` |
| <a name="srcappid"></a>**SrcAppId** | Optional | String | The ID of the destination application, as reported by the reporting device.<br><br>Example: `124` |
| **SrcAppType** | Optional | String | The type of the source application. Supported values include:<br>- `Process`<br>- `Service`<br>- `Resource`<br>- `Other`<br><br>This field is mandatory if [SrcAppName](#srcappname) or [SrcAppId](#srcappid) are used. |
| **SrcZone** | Optional | String | The network zone of the source, as defined by the reporting device.<br><br>Example: `Internet` |
| **SrcIntefaceName** | Optional | String | The network interface used for the connection or session by the source device. <br><br>Example: `eth01` |
| **SrcInterfaceGuid** | Optional | String | The GUID of the network interface used on the source device.<br><br>Example:<br>`46ad544b-eaf0-47ef-`<br>`827c-266030f545a6` |
| **SrcMacAddr** | Optional | String | The MAC address of the network interface from which the connection or session originated.<br><br>Example: `06:10:9f:eb:8f:14` |
| **SrcGeoCountry** | Optional | Country | The country associated with the source IP address.<br><br>Example: `USA` |
| **SrcGeoRegion** | Optional | Region | The region within a country associated with the source IP address.<br><br>Example: `Vermont` |
| **SrcGeoCity** | Optional | City | The city associated with the source IP address.<br><br>Example: `Burlington` |
| **SrcGeoLatitude** | Optional | Latitude | The latitude of the geographical coordinate associated with the source IP address.<br><br>Example: `44.475833` |
| **SrcGeoLongitude** | Optional | Longitude | The longitude of the geographical coordinate associated with the source IP address.<br><br>Example: `73.211944` |
| **NetworkApplicationProtocol** | Optional | String | The application layer protocol used by the connection or session. If the [DstPortNumber](#dstportnumber) value is provided, we recommend that you include  **NetworkApplicationProtocol** too. If the value is not available from the source, derive the value from the [DstPortNumber](#dstportnumber) value.<br><br>Example: `HTTP` |
| **NetworkProtocol** | Optional | Enumerated | The IP protocol used by the connection or session as listed in [IANA protocol assignment](https://www.iana.org/assignments/protocol-numbers/protocol-numbers.xhtml). Typically, `TCP`, `UDP` or `ICMP`.<br><br>Example: `TCP` |
| **NetworkDirection** | Optional | Enumerated | The direction of the connection or session, into or out of the organization. Supported values include: `Inbound`, `Outbound`, `Listen`. `Listen` indicates that a device has started accepting network connections, but is not actually, necessarily, connected.|
| <a name="networkduration"></a>**NetworkDuration** | Optional | Integer | The amount of time, in milliseconds, for the completion of the network session or connection.<br><br>Example: `1500` |
| **Duration** | Alias | | Alias to [NetworkDuration](#networkduration) |
| **NetworkIcmpCode** | Optional | Integer | For an ICMP message, the ICMP message type numeric value as described in [RFC 2780](https://datatracker.ietf.org/doc/html/rfc2780) for IPv4 network connections, or in [RFC 4443](https://datatracker.ietf.org/doc/html/rfc4443) for IPv6 network connections. If a [NetworkIcmpType](#networkicmptype) value is provided, this field is mandatory. If the value is not available from the source, derive the value from the  [NetworkIcmpType](#networkicmptype) field instead.<br><br>Example: `34` |
|<a name="networkicmptype"></a> **NetworkIcmpType** | Optional | String | For an ICMP message, the ICMP message type text representation, as described in [RFC 2780](https://datatracker.ietf.org/doc/html/rfc2780) for IPv4 network connections, or in [RFC 4443](https://datatracker.ietf.org/doc/html/rfc4443) for IPv6 network connections.<br><br>Example: `Destination Unreachable` |
| **DstBytes** | Recommended | Integer | The number of bytes sent from the destination to the source for the connection or session. If the event is aggregated, **DstBytes** should be the sum over all aggregated sessions.<br><br>Example: `32455` |
| **SrcBytes** | Recommended | Integer | The number of bytes sent from the source to the destination for the connection or session. If the event is aggregated, **SrcBytes** should be the sum over all aggregated sessions.<br><br>Example: `46536` |
| **NetworkBytes** | Optional | Integer | Number of bytes sent in both directions. If both **BytesReceived** and **BytesSent** exist, **BytesTotal** should equal their sum. If the event is aggregated, **NetworkBytes** should be the sum over all aggregated sessions.<br><br>Example: `78991` |
| **DstPackets** | Optional | Integer | The number of packets sent from the destination to the source for the connection or session. The meaning of a packet is defined by the reporting device.If the event is aggregated, **DstPackets** should be the sum over all aggregated sessions.<br><br>Example: `446` |
| **SrcPackets** | Optional | Integer | The number of packets sent from the source to the destination for the connection or session. The meaning of a packet is defined by the reporting device. If the event is aggregated, **SrcPackets** should be the sum over all aggregated sessions.<br><br>Example: `6478` |
| **NetworkPackets** | Optional | Integer | The number of packets sent in both directions. If both **PacketsReceived** and **PacketsSent** exist, **BytesTotal** should equal their sum. The meaning of a packet is defined by the reporting device. If the event is aggregated, **NetworkPackets** should be the sum over all aggregated sessions.<br><br>Example: `6924` |
|<a name="networksessionid"></a>**NetworkSessionId** | Optional | string | The session identifier as reported by the reporting device. <br><br>Example: `172\_12\_53\_32\_4322\_\_123\_64\_207\_1\_80` |
| **SessionId** | Alias | String | Alias to [NetworkSessionId](#networksessionid) |
| | | | |

### <a name="Intermediary"></a>Intermediary device fields

The following fields are useful if the record includes information about an intermediary device, such as a Firewall or a Proxy, which relays the network session.

| Field | Class | Type | Description |
| --- | --- | --- | --- |
| **DstNatIpAddr** | Optional | IP address | If reported by an intermediary NAT device, the IP address used by the NAT device for communication with the source.<br><br>Example: `2::1` |
| **DstNatPortNumber** | Optional | Integer | If reported by an intermediary NAT device, the port used by the NAT device for communication with the source.<br><br>Example: `443` |
| **SrcNatIpAddr** | Optional | IP address | If reported by an intermediary NAT device, the IP address used by the NAT device for communication with the destination.<br><br>Example: `4.3.2.1` |
| **SrcNatPortNumber** | Optional | Integer | If reported by an intermediary NAT device, the port used by the NAT device for communication with the destination.<br><br>Example: `345` |
| **DvcInboundInterface** | Optional | String | If reported by an intermediary device, the network interface used by the NAT device for the connection to the source device.<br><br>Example: `eth0` |
| **DvcOutboundInterface** | Optional | String | If reported by an intermediary device, the network interface used by the NAT device for the connection to the destination device.<br><br>Example: `Ethernet adapter Ethernet 4e` |
| | | | |

### <a name="http-session-fields"></a>HTTP session fields

An HTTP session is a network session that uses the HTTP protocol. Such sessions are often reported by web servers, web proxies, and web security gateways. The following are additional fields that are specific to HTTP sessions:

| Field | Class | Type | Description |
| --- | --- | --- | --- |
| **Url** | Recommended | String | For HTTP/HTTPS network sessions, the full HTTP request URL, including parameters. This field is mandatory when the event represents an HTTP session.<br><br>Example: `https://contoso.com/fo/?k=v&amp;q=u#f` |
| **UrlCategory** | Optional | String | The defined grouping of a URL or the domain part of the URL. The category is commonly provided by web security gateways and is based on the content of the site the URL points to.<br><br>Example: search engines, adult, news, advertising, and parked domains. |
| **UrlOriginal** | Optional | String | The original value of the URL, when the URL was modified by the reporting device and both values are provided. |
| **HttpVersion** | Optional | String | The HTTP Request Version for HTTP/HTTPS network connections.<br><br>Example: `2.0` |
| **HttpRequestMethod** | Recommended | Enumerated | The HTTP Method for HTTP/HTTPS network sessions. The values are as defined in [RFC 7231](https://datatracker.ietf.org/doc/html/rfc7231#section-4) and [RFC 5789](https://datatracker.ietf.org/doc/html/rfc5789#section-2), and include `GET`, `HEAD`, `POST`, `PUT`, `DELETE`, `CONNECT`, `OPTIONS`, `TRACE`, and `PATCH`.<br><br>Example: `GET` |
| **HttpStatusCode** | Alias | | The HTTP Status Code for HTTP/HTTPS network sessions. Alias to [EventResultDetails](#eventresultdetails). |
| <a name="httpcontenttype"></a>**HttpContentType** | Optional | String | The HTTP Response content type header for HTTP/HTTPS network sessions. <br><br>**Note**: The **HttpContentType** field may include both the content format and additional parameters, such as the encoding used to get the actual format.<br><br> Example: `text/html; charset=ISO-8859-4` |
| **HttpContentFormat** | Optional | String | The content format part of [HttpContentType](#httpcontenttype) <br><br> Example: `text/html` |
| **HttpReferrer** | Optional | String | The HTTP referrer header for HTTP/HTTPS network sessions.<br><br>**Note**: ASIM, in sync with OSSEM, uses the correct spelling for *referrer*, and not the original HTTP header spelling.<br><br>Example: `https://developer.mozilla.org/docs` |
| <a name="httpuseragent"></a>**HttpUserAgent** | Optional | String | The HTTP user agent header for HTTP/HTTPS network sessions.<br><br>Example:<br> `Mozilla/5.0` (Windows NT 10.0; WOW64)<br>`AppleWebKit/537.36` (KHTML, like Gecko)<br>`Chrome/83.0.4103.97 Safari/537.36` |
| **UserAgent** | Alias | | Alias to [HttpUserAgent](#httpuseragent) |
| **HttpRequestXff** | Optional | IP Address | The HTTP X-Forwarded-For header for HTTP/HTTPS network sessions.<br><br>Example: `120.12.41.1` |
| **HttpRequestTime** | Optional | Integer | The amount of time, in milliseconds, it took to send the request to the server, if applicable.<br><br>Example: `700` |
| **HttpResponseTime** | Optional | Integer | The amount of time, in milliseconds, it took to receive a response in the server, if applicable.<br><br>Example: `800` |
| **FileName** | Optional | String | For HTTP uploads, the name of the uploaded file. |
| **FileMD5** | Optional | MD5 | For HTTP uploads, The MD5 hash of the uploaded file.<br><br>Example: `75a599802f1fa166cdadb360960b1dd0` |
| **FileSHA1** | Optional | SHA1 | For HTTP uploads, The SHA1 hash of the uploaded file.<br><br>Example:<br>`d55c5a4df19b46db8c54`<br>`c801c4665d3338acdab0` |
| **FileSHA256** | Optional | SHA256 | For HTTP uploads, The SHA256 hash of the uploaded file.<br><br>Example:<br>`e81bb824c4a09a811af17deae22f22dd`<br>`2e1ec8cbb00b22629d2899f7c68da274` |
| **FileSHA512** | Optional | SHA512 | For HTTP uploads, The SHA512 hash of the uploaded file. |
| **FileSize** | Optional | Integer | For HTTP uploads, the size in bytes of the uploaded file. |
| **FileContentType** | Optional | String | For HTTP uploads, the content type of the uploaded file. |
| | | | |

In addition, the following standard Networking Schema fields have additional guidelines when used for an HTTP session:

- **EventType** should be &quot;HTTP Session&quot;
- **EventResultDetails** should be set to the HTTP Status code.
- **EventResult** should be &quot;Success&quot; for HTTP status codes lower than 400 and &quot;Failure&quot; otherwise.

### <a name="inspection-fields"></a>Inspection fields

The following fields are used to represent that inspection which a security device such as a firewall, an IPS or a Web Security Gateway performed:

| Field | Class | Type | Description |
| --- | --- | --- | --- |
| **NetworkRuleName** | Optional | String | The name or ID of the rule by which [DvcAction](#dvcaction) was decided upon.<br><br> Example: `AnyAnyDrop` |
| **NetworkRuleNumber** | Optional | Integer | The number of the rule by which [DvcAction](#dvcaction) was decided upon.<br><br>Example: `23` |
| **Rule** | Mandatory | String | Either `NetworkRuleName` or `NetworkRuleNumber` |
| <a name="dvcaction"></a>**DvcAction** | Optional | Enumerated | The action taken on the network session. Supported values are:<br>- `Allow`<br>- `Deny`<br>- `Drop`<br>- `Drop ICMP`<br>- `Reset`<br>- `Reset Source`<br>- `Reset Destination`<br>- `Encrypt`<br>- `Decrypt`<br>- `VPNroute`<br><br>**Note**: The value may be provided in the source record using different terms, which should be normalized to these values. The original value should be stored in the [DvcOriginalAction](#dvcoriginalaction) field.<br><br>Example: `drop` |
| <a name="dvcoriginalaction"></a>**DvcOriginalAction** | Optional | String | The original [DvcAction](#dvcaction) as provided by the reporting device. |
| **ThreatId** | Optional | String | The ID of the threat or malware identified in the network session.<br><br>Example: `Tr.124` |
| **ThreatName** | Optional | String | The name of the threat or malware identified in the network session.<br><br>Example: `EICAR Test File` |
| **ThreatCategory** | Optional | String | The category of the threat or malware identified in the network session.<br><br>Example: `Trojan` |
| **ThreatRiskLevel** | Optional | Integer | The risk level associated with the Session. The level should be a number between **0** and a **100**.<br><br>**Note**: The value may be provided in the source record using a different scale, which should be normalized to this scale. The original value should be stored in [ThreatRiskLevelOriginal](#threatriskleveloriginal). |
| <a name="threatriskleveloriginal"></a>**ThreatRiskLevelOriginal** | Optional | String | The risk level as reported by the reporting device. |
| | | | |

### Other fields

If the event is reported by one of the endpoints of the network session, it may include information about the process that initiated or terminated the session. In such cases, the [ASIM Process Event schema](process-events-normalization-schema.md) to normalize this information.

## Next steps

For more information, see:

- [Normalization in Microsoft Sentinel](normalization.md)
- [Microsoft Sentinel authentication normalization schema reference (Public preview)](authentication-normalization-schema.md)
- [Microsoft Sentinel file event normalization schema reference (Public preview)](file-event-normalization-schema.md)
- [Microsoft Sentinel DNS normalization schema reference](dns-normalization-schema.md)
- [Microsoft Sentinel process event normalization schema reference](process-events-normalization-schema.md)
- [Microsoft Sentinel registry event normalization schema reference (Public preview)](registry-event-normalization-schema.md)
