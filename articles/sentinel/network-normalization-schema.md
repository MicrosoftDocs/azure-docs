---
title: Microsoft Sentinel Network Session normalization schema reference (preview) | Microsoft Docs
description: This article displays the Microsoft Sentinel Network Session normalization schema.
author: oshezaf
ms.topic: reference
ms.date: 11/17/2021
ms.author: ofshezaf

---

# Microsoft Sentinel Network Session normalization schema reference (preview)

The Microsoft Sentinel Network Session normalization schema is used to describe an IP network activity. Network connections and network sessions are included. Such events are reported, for example, by operating systems, routers, firewalls, intrusion prevention systems, and web security gateways.

For more information about normalization in Microsoft Sentinel, see [Normalization and the Advanced SIEM Information Model (ASIM)](normalization.md).

This article describes version 0.2.x of the network normalization schema. [Version 0.1](normalization-schema-v1.md) was released before ASIM was available and doesn't align with ASIM in several places. For more information, see [Differences between network normalization schema versions](normalization-schema-v1.md#changes).

> [!IMPORTANT]
> The network normalization schema is currently in *preview*. This feature is provided without a service level agreement. We don't recommend it for production workloads.
>
> The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Schema overview

The network normalization schema can represent any type of an IP network session but is designed to provide support for common source types, such as Netflow, firewalls, and intrusion prevention systems.

## Parsers

This section discusses parsers, how to add parsers, and how to filter parser parameters. For more information, see [ASIM parsers](normalization-parsers-overview.md) and [Use ASIM parsers](normalization-about-parsers.md).

### Unifying parsers

To use the unifying parsers that unify all of the out-of-the-box parsers, and ensure that your analysis runs across all the configured sources, use the following KQL functions as the table name in your query. 

Deploy ASIM parsers from the [Microsoft Sentinel GitHub repository](https://aka.ms/DeployASIM).

#### <a name="imnetworksession"></a>imNetworkSession

Aggregative parser that uses *union* to include normalized events from all *network session* sources.

- Update this parser if you want to add or remove sources from source-agnostic analytics. 
- Use this function in your source-agnostic queries.

#### ASimNetworkSession

Similar to the [imNetworkSession](#imnetworksession) function, but without parameter support, so it doesn't force the **Logs** page time picker to use the `custom` value. 

- Update these parsers if you want to add or remove sources from source-agnostic analytics.
- Use this function in your source-agnostic queries if you don't plan to use parameters.

#### vimNetworkSession\<vendor\>\<product\>

Source-specific parsers implement normalization for a specific source.

Example: `vimNetworkSessionSysmonLinux`

- Add a source-specific parser for a source when there's no out-of-the-box normalizing parser. Update the `im` aggregative parser to include reference to your new parser.
- Update a source-specific parser to resolve parsing and normalization issues.
- Use a source-specific parser for source-specific analytics.

#### ASimNetworkSession\<vendor\>\<product\>

Source-specific parsers implement normalization for a specific source.

Unlike the `vim*` functions, the `ASim*` functions don't support parameters.

- Add a source-specific parser for a source when there's no out-of-the-box normalizing parser. Update the aggregative `ASim` parser to include reference to your new parser.
- Update a source-specific parser to resolve parsing and normalization issues.
- Use an `ASim` source-specific parser for interactive queries when not using parameters.



### Out-of-the-box, source-specific parsers

Microsoft Sentinel provides the following built-in, product-specific Network Session parsers:

| **Name** | **Description** |
| --- | --- |
| **Microsoft 365 Defender for Endpoint** | - Parametrized: `vimNetworkSessionMicrosoft365Defender` <br> - Regular: `ASimNetworkSessionMicrosoft365Defender` | 
| **Microsoft Defender for IoT - Endpoint (MD4IoT)** | - Parametrized: `vimNetworkSessionMD4IoT` <br> - Regular: `ASimNetworkSessionMD4IoT`  |
| **Microsoft Sysmon for Linux** | - Parametrized: `vimNetworkSessionSysmonLinux`<br> - Regular: `ASimNetworkSessionSysmonLinux`  |
| **Windows Events Firewall** | Windows firewall activity as represented by using Windows Events 515x, collected by using either the Log Analytics Agent or the Azure Monitor Agent into either the `Event` table or the `WindowsEvent` table.<br><br> - Parametrized: `vimNetworkSessionMicrosoftWindowsEventFirewall` <br> -  Regular: `ASimNetworkSessionMicrosoftWindowsEventFirewall`
| | |

### Add your own normalized parsers

When you implement custom parsers for the Network Session information model, name your KQL functions by using the following syntax:

- `vimNetworkSession<vendor><Product>` for parametrized parsers
- `ASimNetworkSession<vendor><Product>` for regular parsers

Then, add the new parser to `imNetworkSession` or `ASimNetworkSession`, respectively.

### Filtering parser parameters

The `im` and `vim*` parsers support [filtering parameters](normalization-about-parsers.md#optimized-parsers). While these parsers are optional, they can improve your query performance.

The following filtering parameters are available:

| Name     | Type      | Description |
|----------|-----------|-------------|
| **starttime** | datetime | Filter only network sessions that *started* at or after this time. |
| **endtime** | datetime | Filter only network sessions that *started* running at or before this time. |
| **srcipaddr_has_any_prefix** | dynamic | Filter only network sessions for which the [source IP address field](#srcipaddr) prefix is in one of the listed values. Prefixes should end with a `.`, for example: `10.0.`. |
| **dstipaddr_has_any_prefix** | dynamic | Filter only network sessions for which the [destination IP address field](#dstipaddr) prefix is in one of the listed values. Prefixes should end with a `.`, for example: `10.0.`. |
| **dstportnum** | Int | Filter only network sessions with the specified destination port number. |
| **hostname_has_any** | dynamic | Filter only network sessions for which the [destination hostname field](#dsthostname) has any of the values listed. |
| **dvcaction** | dynamic | Filter only network sessions for which the [Device Action field](#dvcaction) is any of the values listed. | 
| **eventresult** | String | Filter only network sessions with a specific **EventResult** value. |
| | | |

For example, to filter only web sessions for a specified list of domain names, use:

```kql
let torProxies=dynamic(["tor2web.org", "tor2web.com", "torlink.co",...]);
imNetworkSession (hostname_has_any = torProxies)
```

## Schema details

The Network Session information model is aligned with the [OSSEM Network entity schema](https://github.com/OTRF/OSSEM/blob/master/docs/cdm/entities/network.md).

To conform with industry best practices, the Network Session schema uses the descriptors `Src` and `Dst` to identify the network session source and destination devices, without including the token `Dvc` in the field name.

So, for example, the source device hostname and IP address are named `SrcHostname` and `SrcIpAddr`, respectively, and not `Src*Dvc*Hostname` and `Src*Dvc*IpAddr`. The prefix `Dvc` is only used for the reporting or intermediary device, as applicable.

Fields that describe the user and application associated with the source and destination devices also use the `Src` and `Dst` descriptors.

Other ASIM schemas typically use `Target` instead of `Dst`.

### Common fields

Fields common to all schemas are described in the [ASIM schema overview](normalization-about-schemas.md#common). The following fields have specific guidelines for Network Session events:

| Field               | Class       | Type       |  Description        |
|---------------------|-------------|------------|--------------------|
| **EventCount** | Mandatory | Integer | Netflow sources support aggregation, and the **EventCount** field should be set to the value of the Netflow **FLOWS** field. For other sources, the value is typically set to `1`. |
| **EventType** | Mandatory | Enumerated | Describes the operation reported by the record.<br><br> For Network Session records, the value should be `NetworkSession`. |
| **EventSubType** | Optional | String | Additional description of the event type, if applicable. <br> For Network Session records, supported values include:<br>- `Start`<br>- `End` |
| **EventSchema** | Mandatory | String | The name of the schema documented here is `NetworkSession`. |
| **EventSchemaVersion**  | Mandatory   | String     | The version of the schema. The version of the schema documented here is `0.2.1`.        |
| <a name="dvcaction"></a>**DvcAction** | Optional | Enumerated | The action taken on the network session. Supported values are:<br>- `Allow`<br>- `Deny`<br>- `Drop`<br>- `Drop ICMP`<br>- `Reset`<br>- `Reset Source`<br>- `Reset Destination`<br>- `Encrypt`<br>- `Decrypt`<br>- `VPNroute`<br><br>**Note**: The value might be provided in the source record by using different terms, which should be normalized to these values. The original value should be stored in the [DvcOriginalAction](normalization-about-schemas.md#dvcoriginalaction) field.<br><br>Example: `drop` |
| **Dvc** fields|        |      | For Network Session events, device fields refer to the system reporting the Network Session event.  |
| | | | |

### Network session fields

The following fields are common to all network session activity logging:

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| <a name="dst"></a>**Dst** | Recommended       | String     |    A unique identifier of the server receiving the DNS request. <br><br>This field might alias the [DstDvcId](#dstdvcid), [DstHostname](#dsthostname), or [DstIpAddr](#dstipaddr) fields. <br><br>Example: `192.168.12.1`       |
|<a name="dstipaddr"></a> **DstIpAddr** | Recommended | IP address | The IP address of the connection or session destination. <br><br>Example: `2001:db8::ff00:42:8329`<br><br>**Note**: This value is mandatory if [DstHostname](#dsthostname) is specified. |
| <a name="dstportnumber"></a>**DstPortNumber** | Optional | Integer | The destination IP port.<br><br>Example: `443` |
| <a name="dsthostname"></a>**DstHostname** | Recommended | String | The destination device hostname, excluding domain information. If no device name is available, store the relevant IP address in this field.<br><br>Example: `DESKTOP-1282V4D`<br><br>**Note**: This value is mandatory if [DstIpAddr](#dstipaddr) is specified. |
| <a name="hostname"></a>**Hostname** | Alias | | Alias to [DstHostname](#dsthostname). |
| <a name="dstdomain"></a>**DstDomain** | Recommended | String | The domain of the destination device.<br><br>Example: `Contoso` |
| <a name="dstdomaintype"></a>**DstDomainType** | Recommended | Enumerated | The type of [DstDomain](#dstdomain), if known. Possible values include:<br>- `Windows (contoso\mypc)`<br>- `FQDN (docs.microsoft.com)`<br><br>Required if [DstDomain](#dstdomain) is used. |
| **DstFQDN** | Optional | String | The destination device hostname, including domain information when available. <br><br>Example: `Contoso\DESKTOP-1282V4D` <br><br>**Note**: This field supports both traditional FQDN format and Windows domain\hostname format. The [DstDomainType](#dstdomaintype) reflects the format used.   |
| <a name="dstdvcid"></a>**DstDvcId** | Optional | String | The ID of the destination device as reported in the record.<br><br>Example: `ac7e9755-8eae-4ffc-8a02-50ed7a2216c3` |
| **DstDvcIdType** | Optional | Enumerated | The type of [DstDvcId](#dstdvcid), if known. Possible values include:<br> - `AzureResourceId`<br>- `MDEid`<br><br>If multiple IDs are available, use the first one from the preceding list, and store the others in the **DstDvcAzureResourceId** or **DstDvcMDEid** fields, respectively.<br><br>Required if **DstDeviceId** is used.|
| **DstDeviceType** | Optional | Enumerated | The type of the destination device. Possible values include:<br>- `Computer`<br>- `Mobile Device`<br>- `IOT Device`<br>- `Other` |
| <a name="dstuserid"></a>**DstUserId** | Optional | String | A machine-readable, alphanumeric, unique representation of the destination user. <br><br>Supported formats and types include:<br>- **SID** (Windows): `S-1-5-21-1377283216-344919071-3415362939-500`<br>- **UID** (Linux): `4578`<br>-  **AADID** (Azure Active Directory): `9267d02c-5f76-40a9-a9eb-b686f3ca47aa`<br>-  **OktaId**: `00urjk4znu3BcncfY0h7`<br>-  **AWSId**: `72643944673`<br><br>Store the ID type in the [DstUserIdType](#dstuseridtype) field. If other IDs are available, we recommend that you normalize the field names to **DstUserSid**, **DstUserUid**, **DstUserAADID**, **DstUserOktaId**, and **UserAwsId**, respectively. For more information, see [The User entity](normalization-about-schemas.md#the-user-entity).<br><br>Example: `S-1-12` |
| <a name="dstuseridtype"></a>**DstUserIdType** | Optional | Enumerated | The type of the ID stored in the [DstUserId](#dstuserid) field. <br><br>Supported values are `SID`, `UIS`, `AADID`, `OktaId`, and `AWSId`. |
| <a name="dstusername"></a>**DstUsername** | Optional | String | The Destination username, including domain information when available. <br><br>Use one of the following formats and in the following order of priority:<br>- **Upn/Email**: `johndow@contoso.com`<br>- **Windows**: `Contoso\johndow`<br>- **DN**: `CN=Jeff Smith,OU=Sales,DC=Fabrikam,DC=COM`<br>- **Simple**: `johndow`. Use the Simple form only if domain information isn't available.<br><br>Store the Username type in the [DstUsernameType](#dstusernametype) field. If other IDs are available, we recommend that you normalize the field names to **DstUserUpn**, **DstUserWindows**, and **DstUserDn**. For more information, see [The User entity](normalization-about-schemas.md#the-user-entity).<br><br>Example: `AlbertE` |
| <a name="user"></a>**User** | Alias | | Alias to [DstUsername](#dstusername). |
| <a name="dstusernametype"></a>**DstUsernameType** | Optional | Enumerated | Specifies the type of the username stored in the [DstUsername](#dstusername) field. Supported values include `UPN`, `Windows`, `DN`, and `Simple`. For more information, see [The User entity](normalization-about-schemas.md#the-user-entity).<br><br>Example: `Windows` |
| **DstUserType** | Optional | Enumerated | The type of Actor. Supported values include:<br>- `Regular`<br>- `Machine`<br>- `Admin`<br>- `System`<br>- `Application`<br>- `Service Principal`<br>- `Other`<br><br>**Note**: The value might be provided in the source record by using different terms, which should be normalized to these values. Store the original value in the [DstOriginalUserType](#dstoriginalusertype) field. |
| <a name="dstoriginalusertype"></a>**DstOriginalUserType** | Optional | String | The original destination user type, if provided by the source. |
| **DstUserDomain** | Optional | String | This field is kept for backward compatibility only. ASIM requires domain information, if available, to be part of the [DstUsername](#dstusername) field. |
| <a name="dstappname"></a>**DstAppName** | Optional | String | The name of the destination application.<br><br>Example: `Facebook` |
| <a name="dstappid"></a>**DstAppId** | Optional | String | The ID of the destination application, as reported by the reporting device.<br><br>Example: `124` |
| **DstAppType** | Optional | String | The type of the application authorizing on behalf of the Actor. Supported values include:<br>- `Process`<br>- `Service`<br>- `Resource`<br>- `URL`<br>- `SaaS application`<br>- `Other`<br><br>This field is mandatory if [DstAppName](#dstappname) or [DstAppId](#dstappid) is used. |
| **DstZone** | Optional | String | The network zone of the destination, as defined by the reporting device.<br><br>Example: `Dmz` |
| **DstInterfaceName** | Optional | String | The network interface used for the connection or session by the destination device.<br><br>Example: `Microsoft Hyper-V Network Adapter` |
| **DstInterfaceGuid** | Optional | String | The GUID of the network interface used on the destination device.<br><br>Example:<br>`46ad544b-eaf0-47ef-`<br>`827c-266030f545a6` |
| **DstMacAddr** | Optional | String | The MAC address of the network interface used for the connection or session by the destination device.<br><br>Example: `06:10:9f:eb:8f:14` |
| <a name="dstvlanid"></a>**DstVlanId** | Optional | String | The VLAN ID related to the destination device.<br><br>Example: `130` |
| **OuterVlanId** | Optional | Alias | Alias to [DstVlanId](#dstvlanid). <br><br>In many cases, the VLAN can't be determined as a source or a destination but is characterized as inner or outer. This alias to signifies that [DstVlanId](#dstvlanid) should be used when the VLAN is characterized as outer. |
| **DstGeoCountry** | Optional | Country | The country associated with the destination IP address. For more information, see [Logical types](normalization-about-schemas.md#logical-types).<br><br>Example: `USA` |
| **DstGeoRegion** | Optional | Region | The region, or state, within a country associated with the destination IP address. For more information, see [Logical types](normalization-about-schemas.md#logical-types).<br><br>Example: `Vermont` |
| **DstGeoCity** | Optional | City | The city associated with the destination IP address. For more information, see [Logical types](normalization-about-schemas.md#logical-types).<br><br>Example: `Burlington` |
| **DstGeoLatitude** | Optional | Latitude | The latitude of the geographical coordinate associated with the destination IP address. For more information, see [Logical types](normalization-about-schemas.md#logical-types).<br><br>Example: `44.475833` |
| **DstGeoLongitude** | Optional | Longitude | The longitude of the geographical coordinate associated with the destination IP address. For more information, see [Logical types](normalization-about-schemas.md#logical-types).<br><br>Example: `73.211944` |
| <a name="src"></a>**Src** | Recommended       | String     |    A unique identifier of the source device. <br><br>This field might alias the [SrcDvcId](#srcdvcid), [SrcHostname](#srchostname), or [SrcIpAddr](#srcipaddr) fields. <br><br>Example: `192.168.12.1`       |
| <a name="srcipaddr"></a>**SrcIpAddr** | Recommended | IP address | The IP address from which the connection or session originated. This value is mandatory if **SrcHostname** is specified.<br><br>Example: `77.138.103.108` |
| <a name="ipaddr"></a>**IpAddr** | Alias | | Alias to [SrcIpAddr](#srcipaddr). |
| **SrcPortNumber** | Optional | Integer | The IP port from which the connection originated. Might not be relevant for a session comprising multiple connections.<br><br>Example: `2335` |
| <a name="srchostname"></a> **SrcHostname** | Recommended | String | The source device hostname, excluding domain information. If no device name is available, store the relevant IP address in this field. This value is mandatory if [SrcIpAddr](#srcipaddr) is specified.<br><br>Example: `DESKTOP-1282V4D` |
|<a name="srcdomain"></a> **SrcDomain** | Recommended | String | The domain of the source device.<br><br>Example: `Contoso` |
| <a name="srcdomaintype"></a>**SrcDomainType** | Recommended | Enumerated | The type of [SrcDomain](#srcdomain), if known. Possible values include:<br>- `Windows` (such as `contoso`)<br>- `FQDN` (such as `microsoft.com`)<br><br>Required if [SrcDomain](#srcdomain) is used. |
| **SrcFQDN** | Optional | String | The source device hostname, including domain information when available. <br><br>**Note**: This field supports both traditional FQDN format and Windows domain\hostname format. The [SrcDomainType](#srcdomaintype) field reflects the format used. <br><br>Example: `Contoso\DESKTOP-1282V4D` |
| <a name="srcdvcid"></a>**SrcDvcId** | Optional | String | The ID of the source device as reported in the record.<br><br>Example: `ac7e9755-8eae-4ffc-8a02-50ed7a2216c3` |
| **SrcDvcIdType** | Optional | Enumerated | The type of [SrcDvcId](#srcdvcid), if known. Possible values include:<br> - `AzureResourceId`<br>- `MDEid`<br><br>If multiple IDs are available, use the first one from the preceding list, and store the others in **SrcDvcAzureResourceId** and **SrcDvcMDEid**, respectively.<br><br>**Note**: This field is required if [SrcDvcId](#srcdvcid) is used. |
| **SrcDeviceType** | Optional | Enumerated | The type of the source device. Possible values include:<br>- `Computer`<br>- `Mobile Device`<br>- `IOT Device`<br>- `Other` |
| <a name="srcuserid"></a>**SrcUserId** | Optional | String | A machine-readable, alphanumeric, unique representation of the source user. Format and supported types include:<br>-  **SID**  (Windows): `S-1-5-21-1377283216-344919071-3415362939-500`<br>-  **UID**  (Linux): `4578`<br>-  **AADID**  (Azure Active Directory): `9267d02c-5f76-40a9-a9eb-b686f3ca47aa`<br>-  **OktaId**: `00urjk4znu3BcncfY0h7`<br>-  **AWSId**: `72643944673`<br><br>Store the ID type in the [SrcUserIdType](#srcuseridtype) field. If other IDs are available, we recommend that you normalize the field names to **SrcUserSid**, **SrcUserUid**, **SrcUserAadId**, **SrcUserOktaId**, and **UserAwsId**, respectively. For more information, see [The User entity](normalization-about-schemas.md#the-user-entity).<br><br>Example: S-1-12 |
| <a name="srcuseridtype"></a>**SrcUserIdType** | Optional | Enumerated | The type of the ID stored in the [SrcUserId](#srcuserid) field. Supported values include `SID`, `UID`, `AADID`, `OktaId`, and `AWSId`. |
| <a name="srcusername"></a>**SrcUsername** | Optional | String | The Source username, including domain information when available. Use one of the following formats and in the following order of priority:<br>- **Upn/Email**: `johndow@contoso.com`<br>- **Windows**: `Contoso\johndow`<br>- **DN**: `CN=Jeff Smith,OU=Sales,DC=Fabrikam,DC=COM`<br>- **Simple**: `johndow`. Use the Simple form only if domain information isn't available.<br><br>Store the Username type in the [SrcUsernameType](#srcusernametype) field. If other IDs are available, we recommend that you normalize the field names to **SrcUserUpn**, **SrcUserWindows**, and **SrcUserDn**.<br><br>For more information, see [The User entity](normalization-about-schemas.md#the-user-entity).<br><br>Example: `AlbertE` |
| <a name="srcusernametype"></a>**SrcUsernameType** | Optional | Enumerated | Specifies the type of the username stored in the [SrcUsername](#srcusername) field. Supported values are `UPN`, `Windows`, `DN`, and `Simple`. For more information, see [The User entity](normalization-about-schemas.md#the-user-entity).<br><br>Example: `Windows` |
| **SrcUserType** | Optional | Enumerated | The type of Actor. Allowed values are:<br>- `Regular`<br>- `Machine`<br>- `Admin`<br>- `System`<br>- `Application`<br>- `Service Principal`<br>- `Other`<br><br>**Note**: The value might be provided in the source record by using different terms, which should be normalized to these values. Store the original value in the [SrcOriginalUserType](#srcoriginalusertype) field. |
| <a name="srcoriginalusertype"></a>**SrcOriginalUserType** | | | The original source user type, if provided by the source. |
| **SrcUserDomain** | Optional | String | This field is kept for backward compatibility only. ASIM requires domain information, if available, to be part of the [SrcUsername](#srcusername) field. |
| <a name="srcappname"></a>**SrcAppName** | Optional | String | The name of the source application. <br><br>Example: `filezilla.exe` |
| <a name="srcappid"></a>**SrcAppId** | Optional | String | The ID of the destination application, as reported by the reporting device.<br><br>Example: `124` |
| **SrcAppType** | Optional | String | The type of the source application. Supported values include:<br>- `Process`<br>- `Service`<br>- `Resource`<br>- `Other`<br><br>This field is mandatory if [SrcAppName](#srcappname) or [SrcAppId](#srcappid) are used. |
| **SrcZone** | Optional | String | The network zone of the source, as defined by the reporting device.<br><br>Example: `Internet` |
| **SrcIntefaceName** | Optional | String | The network interface used for the connection or session by the source device. <br><br>Example: `eth01` |
| **SrcInterfaceGuid** | Optional | String | The GUID of the network interface used on the source device.<br><br>Example:<br>`46ad544b-eaf0-47ef-`<br>`827c-266030f545a6` |
| **SrcMacAddr** | Optional | String | The MAC address of the network interface from which the connection or session originated.<br><br>Example: `06:10:9f:eb:8f:14` |
| <a name="srcvlanid"></a>**SrcVlanId** | Optional | String | The VLAN ID related to the source device.<br><br>Example: `130` |
| **InnerVlanId** | Optional | Alias | Alias to [SrcVlanId](#srcvlanid). <br><br>In many cases, the VLAN can't be determined as a source or a destination but is characterized as inner or outer. This alias to signifies that [SrcVlanId](#srcvlanid) should be used when the VLAN is characterized as inner.    |
| **SrcGeoCountry** | Optional | Country | The country associated with the source IP address.<br><br>Example: `USA` |
| **SrcGeoRegion** | Optional | Region | The region within a country associated with the source IP address.<br><br>Example: `Vermont` |
| **SrcGeoCity** | Optional | City | The city associated with the source IP address.<br><br>Example: `Burlington` |
| **SrcGeoLatitude** | Optional | Latitude | The latitude of the geographical coordinate associated with the source IP address.<br><br>Example: `44.475833` |
| **SrcGeoLongitude** | Optional | Longitude | The longitude of the geographical coordinate associated with the source IP address.<br><br>Example: `73.211944` |
| **NetworkApplicationProtocol** | Optional | String | The application layer protocol used by the connection or session. If the [DstPortNumber](#dstportnumber) value is provided, we recommend that you include **NetworkApplicationProtocol** too. If the value isn't available from the source, derive the value from the [DstPortNumber](#dstportnumber) value.<br><br>Example: `FTP` |
| **NetworkProtocol** | Optional | Enumerated | The IP protocol used by the connection or session as listed in [IANA protocol assignment](https://www.iana.org/assignments/protocol-numbers/protocol-numbers.xhtml), which is typically `TCP`, `UDP`, or `ICMP`.<br><br>Example: `TCP` |
| **NetworkDirection** | Optional | Enumerated | The direction of the connection or session, into or out of the organization. Supported values include `Inbound`, `Outbound`, and `Listen`. The `Listen` value indicates that a device has started accepting network connections but isn't actually, necessarily, connected.|
| <a name="networkduration"></a>**NetworkDuration** | Optional | Integer | The amount of time, in milliseconds, for the completion of the network session or connection.<br><br>Example: `1500` |
| **Duration** | Alias | | Alias to [NetworkDuration](#networkduration). |
| **NetworkIcmpCode** | Optional | Integer | For an ICMP message, the ICMP message type numeric value as described in [RFC 2780](https://datatracker.ietf.org/doc/html/rfc2780) for IPv4 network connections, or in [RFC 4443](https://datatracker.ietf.org/doc/html/rfc4443) for IPv6 network connections. If a [NetworkIcmpType](#networkicmptype) value is provided, this field is mandatory. If the value isn't available from the source, derive the value from the [NetworkIcmpType](#networkicmptype) field instead.<br><br>Example: `34` |
|<a name="networkicmptype"></a> **NetworkIcmpType** | Optional | String | For an ICMP message, the ICMP message type text representation, as described in [RFC 2780](https://datatracker.ietf.org/doc/html/rfc2780) for IPv4 network connections, or in [RFC 4443](https://datatracker.ietf.org/doc/html/rfc4443) for IPv6 network connections.<br><br>Example: `Destination Unreachable` |
| **NetworkConnectionHistory** | Optional | String | TCP flags and other potential IP header information. |
| **DstBytes** | Recommended | Integer | The number of bytes sent from the destination to the source for the connection or session. If the event is aggregated, **DstBytes** should be the sum over all aggregated sessions.<br><br>Example: `32455` |
| **SrcBytes** | Recommended | Integer | The number of bytes sent from the source to the destination for the connection or session. If the event is aggregated, **SrcBytes** should be the sum over all aggregated sessions.<br><br>Example: `46536` |
| **NetworkBytes** | Optional | Integer | Number of bytes sent in both directions. If both **BytesReceived** and **BytesSent** exist, **BytesTotal** should equal their sum. If the event is aggregated, **NetworkBytes** should be the sum over all aggregated sessions.<br><br>Example: `78991` |
| **DstPackets** | Optional | Integer | The number of packets sent from the destination to the source for the connection or session. The meaning of a packet is defined by the reporting device. If the event is aggregated, **DstPackets** should be the sum over all aggregated sessions.<br><br>Example: `446` |
| **SrcPackets** | Optional | Integer | The number of packets sent from the source to the destination for the connection or session. The meaning of a packet is defined by the reporting device. If the event is aggregated, **SrcPackets** should be the sum over all aggregated sessions.<br><br>Example: `6478` |
| **NetworkPackets** | Optional | Integer | The number of packets sent in both directions. If both **PacketsReceived** and **PacketsSent** exist, **BytesTotal** should equal their sum. The meaning of a packet is defined by the reporting device. If the event is aggregated, **NetworkPackets** should be the sum over all aggregated sessions.<br><br>Example: `6924` |
|<a name="networksessionid"></a>**NetworkSessionId** | Optional | string | The session identifier as reported by the reporting device. <br><br>Example: `172\_12\_53\_32\_4322\_\_123\_64\_207\_1\_80` |
| **SessionId** | Alias | String | Alias to [NetworkSessionId](#networksessionid). |
| | | | |

### <a name="Intermediary"></a>Intermediary device fields

The following fields are useful if the record includes information about an intermediary device, such as a firewall or a proxy, which relays the network session.

| Field | Class | Type | Description |
| --- | --- | --- | --- |
| **DstNatIpAddr** | Optional | IP address | If reported by an intermediary NAT device, the IP address used by the NAT device for communication with the source.<br><br>Example: `2::1` |
| **DstNatPortNumber** | Optional | Integer | If reported by an intermediary NAT device, the port used by the NAT device for communication with the source.<br><br>Example: `443` |
| <a name="srcnatipaddr"></a>**SrcNatIpAddr** | Optional | IP address | If reported by an intermediary NAT device, the IP address used by the NAT device for communication with the destination.<br><br>Example: `4.3.2.1` |
| **SrcNatPortNumber** | Optional | Integer | If reported by an intermediary NAT device, the port used by the NAT device for communication with the destination.<br><br>Example: `345` |
| **DvcInboundInterface** | Optional | String | If reported by an intermediary device, the network interface used by the NAT device for the connection to the source device.<br><br>Example: `eth0` |
| **DvcOutboundInterface** | Optional | String | If reported by an intermediary device, the network interface used by the NAT device for the connection to the destination device.<br><br>Example: `Ethernet adapter Ethernet 4e` |
| | | | |


### <a name="inspection-fields"></a>Inspection fields

The following fields are used to represent that inspection which a security device such as a firewall, an IPS, or a web security gateway performed:

| Field | Class | Type | Description |
| --- | --- | --- | --- |
| **NetworkRuleName** | Optional | String | The name or ID of the rule by which [DvcAction](#dvcaction) was decided upon.<br><br> Example: `AnyAnyDrop` |
| **NetworkRuleNumber** | Optional | Integer | The number of the rule by which [DvcAction](#dvcaction) was decided upon.<br><br>Example: `23` |
| **Rule** | Mandatory | String | Either `NetworkRuleName` or `NetworkRuleNumber`. |
| **ThreatId** | Optional | String | The ID of the threat or malware identified in the network session.<br><br>Example: `Tr.124` |
| **ThreatName** | Optional | String | The name of the threat or malware identified in the network session.<br><br>Example: `EICAR Test File` |
| **ThreatCategory** | Optional | String | The category of the threat or malware identified in the network session.<br><br>Example: `Trojan` |
| **ThreatRiskLevel** | Optional | Integer | The risk level associated with the session. The level should be a number between **0** and **100**.<br><br>**Note**: The value might be provided in the source record by using a different scale, which should be normalized to this scale. The original value should be stored in [ThreatRiskLevelOriginal](#threatriskleveloriginal). |
| <a name="threatriskleveloriginal"></a>**ThreatRiskLevelOriginal** | Optional | String | The risk level as reported by the reporting device. |
| | | | |

### Other fields

If the event is reported by one of the endpoints of the network session, it might include information about the process that initiated or terminated the session. In such cases, the [ASIM Process Event schema](process-events-normalization-schema.md) is used to normalize this information.

### Schema updates

These are the changes in version 0.2.1 of the schema:

- Added `Src` and `Dst` as aliases to a leading identifier for the source and destination systems.
- Added the fields **NetworkConnectionHistory**, **SrcVlanId**, **DstVlanId**, **InnerVlanId**, and **OuterVlanId**.

## Next steps

For more information, see:

- Watch the [ASIM Webinar](https://www.youtube.com/watch?v=WoGD-JeC7ng) or review the [slides](https://1drv.ms/b/s!AnEPjr8tHcNmjDY1cro08Fk3KUj-?e=murYHG)
- [Advanced SIEM Information Model (ASIM) overview](normalization.md)
- [Advanced SIEM Information Model (ASIM) schemas](normalization-about-schemas.md)
- [Advanced SIEM Information Model (ASIM) parsers](normalization-parsers-overview.md)
- [Advanced SIEM Information Model (ASIM) content](normalization-content.md)

