---
title: The Advanced Security Information Model (ASIM) Network Session normalization schema reference (Public preview) | Microsoft Docs
description: This article displays the Microsoft Sentinel Network Session normalization schema.
author: oshezaf
ms.topic: reference
ms.date: 11/17/2021
ms.author: ofshezaf

---

# The Advanced Security Information Model (ASIM) Network Session normalization schema reference (Public preview)

The Microsoft Sentinel Network Session normalization schema represents an IP network activity, such as network connections and network sessions. Such events are reported, for example, by operating systems, routers, firewalls, and intrusion prevention systems.

The network normalization schema can represent any type of an IP network session but is designed to provide support for common source types, such as Netflow, firewalls, and intrusion prevention systems.

For more information about normalization in Microsoft Sentinel, see [Normalization and the Advanced Security Information Model (ASIM)](normalization.md).

This article describes version 0.2.x of the network normalization schema. [Version 0.1](normalization-schema-v1.md) was released before ASIM was available and doesn't align with ASIM in several places. For more information, see [Differences between network normalization schema versions](normalization-schema-v1.md#changes).

> [!IMPORTANT]
> The network normalization schema is currently in *preview*. This feature is provided without a service level agreement. We don't recommend it for production workloads.
>
> The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Parsers

For more information about ASIM parsers, see the [ASIM parsers overview](normalization-parsers-overview.md).

### Unifying parsers

To use parsers that unify all ASIM out-of-the-box parsers, and ensure that your analysis runs across all the configured sources, use the `_Im_NetworkSession` filtering parser or the `_ASim_NetworkSession` parameter-less parser.

You can also use workspace-deployed `ImNetworkSession` and `ASimNetworkSession` parsers by deploying them from the [Microsoft Sentinel GitHub repository](https://aka.ms/DeployASIM).

For more information, see [built-in ASIM parsers and workspace-deployed parsers](normalization-parsers-overview.md#built-in-asim-parsers-and-workspace-deployed-parsers).

### Out-of-the-box, source-specific parsers

For the list of the Network Session parsers Microsoft Sentinel provides out-of-the-box refer to the [ASIM parsers list](normalization-parsers-list.md#network-session-parsers) 

### Add your own normalized parsers

When [developing custom parsers](normalization-develop-parsers.md) for the Network Session information model, name your KQL functions using the following syntax:

- `vimNetworkSession<vendor><Product>` for parametrized parsers
- `ASimNetworkSession<vendor><Product>` for regular parsers

Refer to the article [Managing ASIM parsers](normalization-manage-parsers.md) to learn how to add your custom parsers to the network session unifying parsers.

### Filtering parser parameters

The Network Session parsers support [filtering parameters](normalization-about-parsers.md#optimizing-parsing-using-parameters). While these parameters are optional, they can improve your query performance.

The following filtering parameters are available:

| Name     | Type      | Description |
|----------|-----------|-------------|
| **starttime** | datetime | Filter only network sessions that *started* at or after this time. |
| **endtime** | datetime | Filter only network sessions that *started* running at or before this time. |
| **srcipaddr_has_any_prefix** | dynamic | Filter only network sessions for which the [source IP address field](#srcipaddr) prefix is in one of the listed values. Prefixes should end with a `.`, for example: `10.0.`. The length of the list is limited to 10,000 items.|
| **dstipaddr_has_any_prefix** | dynamic | Filter only network sessions for which the [destination IP address field](#dstipaddr) prefix is in one of the listed values. Prefixes should end with a `.`, for example: `10.0.`. The length of the list is limited to 10,000 items.|
| **ipaddr_has_any_prefix** | dynamic | Filter only network sessions for which the [destination IP address field](#dstipaddr) or [source IP address field](#srcipaddr) prefix is in one of the listed values. Prefixes should end with a `.`, for example: `10.0.`. The length of the list is limited to 10,000 items.<br><br>The field [ASimMatchingIpAddr](normalization-common-fields.md#asimmatchingipaddr) is set with the one of the values `SrcIpAddr`, `DstIpAddr`, or `Both` to reflect the matching fields or fields. |
| **dstportnumber** | Int | Filter only network sessions with the specified destination port number. |
| **hostname_has_any** | dynamic/string | Filter only network sessions for which the [destination hostname field](#dsthostname) has any of the values listed. The length of the list is limited to 10,000 items.<br><br> The field [ASimMatchingHostname](normalization-common-fields.md#asimmatchinghostname) is set with the one of the values `SrcHostname`, `DstHostname`, or `Both` to reflect the matching fields or fields. |
| **dvcaction** | dynamic/string | Filter only network sessions for which the [Device Action field](#dvcaction) is any of the values listed. | 
| **eventresult** | String | Filter only network sessions with a specific **EventResult** value. |

Some parameter can accept both list of values of type `dynamic` or a single string value. To pass a literal list to parameters that expect a dynamic value, explicitly use a [dynamic literal](/azure/data-explorer/kusto/query/scalar-data-types/dynamic#dynamic-literals.md). For example: `dynamic(['192.168.','10.'])`

For example, to filter only network sessions for a specified list of domain names, use:

```kql
let torProxies=dynamic(["tor2web.org", "tor2web.com", "torlink.co"]);
_Im_NetworkSession (hostname_has_any = torProxies)
```

> [!TIP]
> To pass a literal list to parameters that expect a dynamic value, explicitly use a [dynamic literal](/azure/data-explorer/kusto/query/scalar-data-types/dynamic#dynamic-literals.md). For example: `dynamic(['192.168.','10.'])`.
>

## Normalized content

For a full list of analytics rules that use normalized DNS events, see [Network session security content](normalization-content.md#network-session-security-content).

## Schema overview

The Network Session information model is aligned with the [OSSEM Network entity schema](https://github.com/OTRF/OSSEM/blob/master/docs/cdm/entities/network.md).

The Network Session schema serves several types of similar but distinct scenarios, which share the same fields. Those scenarios are identified by the EventType field:

- `NetworkSession` - a network session reported by an intermediate device monitoring the network, such as a Firewall, a router, or a network tap.
- `L2NetworkSession` - a network sessions for which only layer 2 information is available. Such events will include MAC addresses but not IP addresses. 
- `Flow` - an aggregated event that reports multiple similar network sessions, typically over a predefined time period, such as **Netflow** events.  
- `EndpointNetworkSession` - a network session reported by one of the end points of the session, including clients and servers. For such events, the schema supports the `remote` and `local` alias fields.
- `IDS` - a network session reported as suspicious. Such an event will have some of the inspection fields populated, and may have just one IP address field populated, either the source or the destination.

Typically, a query should either select just a subset of those event types, and may need to address separately unique aspects of the use cases. For example, IDS events do not reflect the entire network volume and should not be taken into account in column based analytics. 

Network session events use the descriptors `Src` and `Dst` to denote the roles of the devices and related users and applications involved in the session. So, for example, the source device hostname and IP address are named `SrcHostname` and `SrcIpAddr`. Other ASIM schemas typically use `Target` instead of `Dst`.

For events reported by an endpoint and for which the event type is `EndpointNetworkSession`, the descriptors `Local` and `Remote` denote the endpoint itself and the device at the other end of the network session respectively.

The descriptor `Dvc` is used for the reporting device, which is the local system for sessions reported by an endpoint, and the intermediary device or network tap for other network session events. 

## Schema details

### Common ASIM fields

> [!IMPORTANT]
> Fields common to all schemas are described in detail in the [ASIM Common Fields](normalization-common-fields.md) article.
>
#### Common fields with specific guidelines

The following list mentions fields that have specific guidelines for Network Session events:


| Field               | Class       | Type       |  Description        |
|---------------------|-------------|------------|--------------------|
| **EventCount** | Mandatory | Integer | Netflow sources support aggregation, and the **EventCount** field should be set to the value of the Netflow **FLOWS** field. For other sources, the value is typically set to `1`. |
| <a name="eventtype"></a> **EventType** | Mandatory | Enumerated | Describes the scenario reported by the record.<br><br> For Network Session records, the allowed values are:<br> - `EndpointNetworkSession`<br> - `NetworkSession` <br> - `L2NetworkSession`<br>- `IDS` <br> - `Flow`<br><br>For more information on event types, refer to the [schema overview](#schema-overview) |
| <a name="eventsubtype"></a>**EventSubType** | Optional | String | Additional description of the event type, if applicable. <br> For Network Session records, supported values include:<br>- `Start`<br>- `End`<br><br>This is field is not relevant for `Flow` events. |
| <a name="eventresult"></a>**EventResult** | Mandatory | Enumerated | If the source device does not provide an event result, **EventResult** should be based on the value of [DvcAction](#dvcaction).  If [DvcAction](#dvcaction) is `Deny`, `Drop`, `Drop ICMP`, `Reset`, `Reset Source`, or `Reset Destination`<br>, **EventResult** should be `Failure`. Otherwise, **EventResult** should be `Success`. |
| **EventResultDetails** | Recommended | Enumerated | Reason or details for the result reported in the [EventResult](#eventresult) field. Supported values are:<br> - Failover <br> - Invalid TCP <br> - Invalid Tunnel<br> - Maximum Retry<br> - Reset<br> - Routing issue<br> - Simulation<br> - Terminated<br> - Timeout<br> - Transient error<br> - Unknown<br> - NA.<br><br>The original, source specific, value is stored in the [EventOriginalResultDetails](normalization-common-fields.md#eventoriginalresultdetails) field. |
| **EventSchema** | Mandatory | String | The name of the schema documented here is `NetworkSession`. |
| **EventSchemaVersion**  | Mandatory   | String     | The version of the schema. The version of the schema documented here is `0.2.6`.        |
| <a name="dvcaction"></a>**DvcAction** | Recommended | Enumerated | The action taken on the network session. Supported values are:<br>- `Allow`<br>- `Deny`<br>- `Drop`<br>- `Drop ICMP`<br>- `Reset`<br>- `Reset Source`<br>- `Reset Destination`<br>- `Encrypt`<br>- `Decrypt`<br>- `VPNroute`<br><br>**Note**: The value might be provided in the source record by using different terms, which should be normalized to these values. The original value should be stored in the [DvcOriginalAction](normalization-common-fields.md#dvcoriginalaction) field.<br><br>Example: `drop` |
| **EventSeverity** | Optional | Enumerated | If the source device does not provide an event severity, **EventSeverity** should be based on the value of [DvcAction](#dvcaction).  If [DvcAction](#dvcaction) is `Deny`, `Drop`, `Drop ICMP`, `Reset`, `Reset Source`, or `Reset Destination`<br>, **EventSeverity** should be `Low`. Otherwise, **EventSeverity** should be `Informational`. |
| **DvcInterface** | | | The DvcInterface field should alias either the [DvcInboundInterface](#dvcinboundinterface) or the [DvcOutboundInterface](#dvcoutboundinterface) fields. |
| **Dvc** fields|        |      | For Network Session events, device fields refer to the system reporting the Network Session event.  |


#### All common fields

Fields that appear in the table below are common to all ASIM schemas. Any guideline specified above overrides the general guidelines for the field. For example, a field might be optional in general, but mandatory for a specific schema. For more information on each field, refer to the [ASIM Common Fields](normalization-common-fields.md) article.

| **Class** | **Fields** |
| --------- | ---------- |
| Mandatory | - [EventCount](normalization-common-fields.md#eventcount)<br> - [EventStartTime](normalization-common-fields.md#eventstarttime)<br> - [EventEndTime](normalization-common-fields.md#eventendtime)<br> - [EventType](normalization-common-fields.md#eventtype)<br>- [EventResult](normalization-common-fields.md#eventresult)<br> - [EventProduct](normalization-common-fields.md#eventproduct)<br> - [EventVendor](normalization-common-fields.md#eventvendor)<br> - [EventSchema](normalization-common-fields.md#eventschema)<br> - [EventSchemaVersion](normalization-common-fields.md#eventschemaversion)<br> - [Dvc](normalization-common-fields.md#dvc)<br>|
| Recommended | - [EventResultDetails](normalization-common-fields.md#eventresultdetails)<br>- [EventSeverity](normalization-common-fields.md#eventseverity)<br>- [EventUid](normalization-common-fields.md#eventuid)<br> - [DvcIpAddr](normalization-common-fields.md#dvcipaddr)<br> - [DvcHostname](normalization-common-fields.md#dvchostname)<br> - [DvcDomain](normalization-common-fields.md#dvcdomain)<br>- [DvcDomainType](normalization-common-fields.md#dvcdomaintype)<br>- [DvcFQDN](normalization-common-fields.md#dvcfqdn)<br>- [DvcId](normalization-common-fields.md#dvcid)<br>- [DvcIdType](normalization-common-fields.md#dvcidtype)<br>- [DvcAction](normalization-common-fields.md#dvcaction)|
| Optional | - [EventMessage](normalization-common-fields.md#eventmessage)<br> - [EventSubType](normalization-common-fields.md#eventsubtype)<br>- [EventOriginalUid](normalization-common-fields.md#eventoriginaluid)<br>- [EventOriginalType](normalization-common-fields.md#eventoriginaltype)<br>- [EventOriginalSubType](normalization-common-fields.md#eventoriginalsubtype)<br>- [EventOriginalResultDetails](normalization-common-fields.md#eventoriginalresultdetails)<br> - [EventOriginalSeverity](normalization-common-fields.md#eventoriginalseverity) <br> - [EventProductVersion](normalization-common-fields.md#eventproductversion)<br> - [EventReportUrl](normalization-common-fields.md#eventreporturl)<br> - [EventOwner](normalization-common-fields.md#eventowner)<br>- [DvcZone](normalization-common-fields.md#dvczone)<br>- [DvcMacAddr](normalization-common-fields.md#dvcmacaddr)<br>- [DvcOs](normalization-common-fields.md#dvcos)<br>- [DvcOsVersion](normalization-common-fields.md#dvchostname)<br>- [DvcOriginalAction](normalization-common-fields.md#dvcoriginalaction)<br>- [DvcInterface](normalization-common-fields.md#dvcinterface)<br>- [AdditionalFields](normalization-common-fields.md#additionalfields)<br>- [DvcDescription](normalization-common-fields.md#dvcdescription)<br>- [DvcScopeId](normalization-common-fields.md#dvcscopeid)<br>- [DvcScope](normalization-common-fields.md#dvcscope)|


### Network session fields

| Field               | Class       | Type       |  Description        |
|---------------------|-------------|------------|--------------------|
| **NetworkApplicationProtocol** | Optional | String | The application layer protocol used by the connection or session. The value should be in all uppercase.<br><br>Example: `FTP` |
| <a name="networkprotocol"></a> **NetworkProtocol** | Optional | Enumerated | The IP protocol used by the connection or session as listed in [IANA protocol assignment](https://www.iana.org/assignments/protocol-numbers/protocol-numbers.xhtml), which is typically `TCP`, `UDP`, or `ICMP`.<br><br>Example: `TCP` |
| **NetworkProtocolVersion** | Optional | Enumerated | The version of [NetworkProtocol](#networkprotocol). When using it to distinguish between IP version, use the values `IPv4` and `IPv6`. |
| <a name="networkdirection"></a>**NetworkDirection** | Optional | Enumerated | The direction of the connection or session:<br><br> - For the [EventType](#eventtype) `NetworkSession`, `Flow` or `L2NetworkSession`, **NetworkDirection** represents the direction relative to the organization or cloud environment boundary. Supported values are `Inbound`, `Outbound`, `Local` (to the organization), `External` (to the organization) or `NA` (Not Applicable).<br><br> - For the [EventType](#eventtype) `EndpointNetworkSession`, **NetworkDirection** represents the direction relative to the endpoint. Supported values are `Inbound`, `Outbound`, `Local` (to the system), `Listen` or `NA` (Not Applicable). The `Listen` value indicates that a device has started accepting network connections but isn't actually, necessarily, connected. |
| <a name="networkduration"></a>**NetworkDuration** | Optional | Integer | The amount of time, in milliseconds, for the completion of the network session or connection.<br><br>Example: `1500` |
| **Duration** | Alias | | Alias to [NetworkDuration](#networkduration). |
|<a name="networkicmptype"></a> **NetworkIcmpType** | Optional | String | For an ICMP message, the ICMP message type number, as described in [RFC 2780](https://datatracker.ietf.org/doc/html/rfc2780) for IPv4 network connections, or in [RFC 4443](https://datatracker.ietf.org/doc/html/rfc4443) for IPv6 network connections. |
| **NetworkIcmpCode** | Optional | Integer | For an ICMP message, the ICMP code number as described in [RFC 2780](https://datatracker.ietf.org/doc/html/rfc2780) for IPv4 network connections, or in [RFC 4443](https://datatracker.ietf.org/doc/html/rfc4443) for IPv6 network connections. |
| **NetworkConnectionHistory** | Optional | String | TCP flags and other potential IP header information. |
| **DstBytes** | Recommended | Long | The number of bytes sent from the destination to the source for the connection or session. If the event is aggregated, **DstBytes** should be the sum over all aggregated sessions.<br><br>Example: `32455` |
| **SrcBytes** | Recommended | Long | The number of bytes sent from the source to the destination for the connection or session. If the event is aggregated, **SrcBytes** should be the sum over all aggregated sessions.<br><br>Example: `46536` |
| **NetworkBytes** | Optional | Long | Number of bytes sent in both directions. If both **BytesReceived** and **BytesSent** exist, **BytesTotal** should equal their sum. If the event is aggregated, **NetworkBytes** should be the sum over all aggregated sessions.<br><br>Example: `78991` |
| **DstPackets** | Optional | Long | The number of packets sent from the destination to the source for the connection or session. The meaning of a packet is defined by the reporting device. If the event is aggregated, **DstPackets** should be the sum over all aggregated sessions.<br><br>Example: `446` |
| **SrcPackets** | Optional | Long | The number of packets sent from the source to the destination for the connection or session. The meaning of a packet is defined by the reporting device. If the event is aggregated, **SrcPackets** should be the sum over all aggregated sessions.<br><br>Example: `6478` |
| **NetworkPackets** | Optional | Long | The number of packets sent in both directions. If both **PacketsReceived** and **PacketsSent** exist, **BytesTotal** should equal their sum. The meaning of a packet is defined by the reporting device. If the event is aggregated, **NetworkPackets** should be the sum over all aggregated sessions.<br><br>Example: `6924` |
|<a name="networksessionid"></a>**NetworkSessionId** | Optional | string | The session identifier as reported by the reporting device. <br><br>Example: `172\_12\_53\_32\_4322\_\_123\_64\_207\_1\_80` |
| **SessionId** | Alias | String | Alias to [NetworkSessionId](#networksessionid). |
| **TcpFlagsAck** | Optional | Boolean | The TCP ACK Flag reported. The acknowledgment flag is used to acknowledge the successful receipt of a packet. As we can see from the diagram above, the receiver sends an ACK and a SYN in the second step of the three way handshake process to tell the sender that it received its initial packet. |
| **TcpFlagsFin** | Optional | Boolean | The TCP FIN Flag reported. The finished flag means there is no more data from the sender. Therefore, it is used in the last packet sent from the sender. |
| **TcpFlagsSyn** | Optional | Boolean | The TCP SYN Flag reported. The synchronization flag is used as a first step in establishing a three way handshake between two hosts. Only the first packet from both the sender and receiver should have this flag set. |
| **TcpFlagsUrg** | Optional | Boolean | The TCP URG Flag reported. The urgent flag is used to notify the receiver to process the urgent packets before processing all other packets. The receiver will be notified when all known urgent data has been received. See [RFC 6093](https://tools.ietf.org/html/rfc6093) for more details. |
| **TcpFlagsPsh** | Optional | Boolean | The TCP PSH Flag reported. The push flag is similar to the URG flag and tells the receiver to process these packets as they are received instead of buffering them. |
| **TcpFlagsRst** | Optional | Boolean | The TCP RST Flag reported. The reset flag gets sent from the receiver to the sender when a packet is sent to a particular host that was not expecting it. |
| **TcpFlagsEce** | Optional | Boolean | The TCP ECE Flag reported. This flag is responsible for indicating if the TCP peer is [ECN capable](https://en.wikipedia.org/wiki/Explicit_Congestion_Notification). See [RFC 3168](https://tools.ietf.org/html/rfc3168) for more details. |
| **TcpFlagsCwr** | Optional | Boolean | The TCP CWR Flag reported. The congestion window reduced flag is used by the sending host to indicate it received a packet with the ECE flag set. See [RFC 3168](https://tools.ietf.org/html/rfc3168) for more details. |
| **TcpFlagsNs** | Optional | Boolean | The TCP NS Flag reported. The nonce sum flag is still an experimental flag used to help protect against accidental malicious concealment of packets from the sender. See [RFC 3540](https://tools.ietf.org/html/rfc3540) for more details |


### Destination system fields

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| <a name="dst"></a>**Dst** | Recommended       | Alias     |    A unique identifier of the server receiving the DNS request. <br><br>This field might alias the [DstDvcId](#dstdvcid), [DstHostname](#dsthostname), or [DstIpAddr](#dstipaddr) fields. <br><br>Example: `192.168.12.1`       |
|<a name="dstipaddr"></a> **DstIpAddr** | Recommended | IP address | The IP address of the connection or session destination. If the session uses network address translation, `DstIpAddr` is the publicly visible address, and not the original address of the source, which is stored in [DstNatIpAddr](#dstnatipaddr)<br><br>Example: `2001:db8::ff00:42:8329`<br><br>**Note**: This value is mandatory if [DstHostname](#dsthostname) is specified. |
| <a name="dstportnumber"></a>**DstPortNumber** | Optional | Integer | The destination IP port.<br><br>Example: `443` |
| <a name="dsthostname"></a>**DstHostname** | Recommended | Hostname | The destination device hostname, excluding domain information. If no device name is available, store the relevant IP address in this field.<br><br>Example: `DESKTOP-1282V4D` |
| <a name="dstdomain"></a>**DstDomain** | Recommended | String | The domain of the destination device.<br><br>Example: `Contoso` |
| <a name="dstdomaintype"></a>**DstDomainType** | Conditional | Enumerated | The type of [DstDomain](#dstdomain). For a list of allowed values and further information, refer to [DomainType](normalization-about-schemas.md#domaintype) in the [Schema Overview article](normalization-about-schemas.md).<br><br>Required if [DstDomain](#dstdomain) is used. |
| **DstFQDN** | Optional | String | The destination device hostname, including domain information when available. <br><br>Example: `Contoso\DESKTOP-1282V4D` <br><br>**Note**: This field supports both traditional FQDN format and Windows domain\hostname format. The [DstDomainType](#dstdomaintype) reflects the format used.   |
| <a name="dstdvcid"></a>**DstDvcId** | Optional | String | The ID of the destination device. If multiple IDs are available, use the most important one, and store the others in the fields `DstDvc<DvcIdType>`. <br><br>Example: `ac7e9755-8eae-4ffc-8a02-50ed7a2216c3` |
| <a name="dstdvcscopeid"></a>**DstDvcScopeId** | Optional | String | The cloud platform scope ID the device belongs to. **DstDvcScopeId** map to a subscription ID on Azure and to an account ID on AWS. | 
| <a name="dstdvcscope"></a>**DstDvcScope** | Optional | String | The cloud platform scope the device belongs to. **DstDvcScope** map to a subscription ID on Azure and to an account ID on AWS. | 
| **DstDvcIdType** | Conditional | Enumerated | The type of [DstDvcId](#dstdvcid). For a list of allowed values and further information, refer to [DvcIdType](normalization-about-schemas.md#dvcidtype) in the [Schema Overview article](normalization-about-schemas.md). <br><br>Required if **DstDeviceId** is used.|
| **DstDeviceType** | Optional | Enumerated | The type of the destination device.  For a list of allowed values and further information, refer to [DeviceType](normalization-about-schemas.md#devicetype) in the [Schema Overview article](normalization-about-schemas.md). |
| **DstZone** | Optional | String | The network zone of the destination, as defined by the reporting device.<br><br>Example: `Dmz` |
| **DstInterfaceName** | Optional | String | The network interface used for the connection or session by the destination device.<br><br>Example: `Microsoft Hyper-V Network Adapter` |
| **DstInterfaceGuid** | Optional | String | The GUID of the network interface used on the destination device.<br><br>Example:<br>`46ad544b-eaf0-47ef-`<br>`827c-266030f545a6` |
| **DstMacAddr** | Optional | String | The MAC address of the network interface used for the connection or session by the destination device.<br><br>Example: `06:10:9f:eb:8f:14` |
| <a name="dstvlanid"></a>**DstVlanId** | Optional | String | The VLAN ID related to the destination device.<br><br>Example: `130` |
| **OuterVlanId** | Optional | Alias | Alias to [DstVlanId](#dstvlanid). <br><br>In many cases, the VLAN can't be determined as a source or a destination but is characterized as inner or outer. This alias to signifies that [DstVlanId](#dstvlanid) should be used when the VLAN is characterized as outer. |
| <a name="dstsubscription"></a>**DstSubscriptionId** | Optional | String | The cloud platform subscription ID the destination device belongs to. **DstSubscriptionId** map to a subscription ID on Azure and to an account ID on AWS. | 
| **DstGeoCountry** | Optional | Country | The country associated with the destination IP address. For more information, see [Logical types](normalization-about-schemas.md#logical-types).<br><br>Example: `USA` |
| **DstGeoRegion** | Optional | Region | The region, or state, associated with the destination IP address. For more information, see [Logical types](normalization-about-schemas.md#logical-types).<br><br>Example: `Vermont` |
| **DstGeoCity** | Optional | City | The city associated with the destination IP address. For more information, see [Logical types](normalization-about-schemas.md#logical-types).<br><br>Example: `Burlington` |
| **DstGeoLatitude** | Optional | Latitude | The latitude of the geographical coordinate associated with the destination IP address. For more information, see [Logical types](normalization-about-schemas.md#logical-types).<br><br>Example: `44.475833` |
| **DstGeoLongitude** | Optional | Longitude | The longitude of the geographical coordinate associated with the destination IP address. For more information, see [Logical types](normalization-about-schemas.md#logical-types).<br><br>Example: `73.211944` |


### Destination user fields

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| <a name="dstuserid"></a>**DstUserId** | Optional | String | A machine-readable, alphanumeric, unique representation of the destination user. For the supported format for different ID types, refer to [the User entity](normalization-about-schemas.md#the-user-entity). <br><br>Example: `S-1-12` |
| **DstUserScope** | Optional | String | The scope, such as Azure AD tenant, in which [DstUserId](#dstuserid) and [DstUsername](#dstusername) are defined. or more information and list of allowed values, see [UserScope](normalization-about-schemas.md#userscope) in the [Schema Overview article](normalization-about-schemas.md).|
| **DstUserScopeId** | Optional | String | The scope ID, such as Azure AD Directory ID, in which [DstUserId](#dstuserid) and [DstUsername](#dstusername) are defined. for more information and list of allowed values, see [UserScopeId](normalization-about-schemas.md#userscopeid) in the [Schema Overview article](normalization-about-schemas.md).|
| <a name="dstuseridtype"></a>**DstUserIdType** | Conditional | UserIdType | The type of the ID stored in the [DstUserId](#dstuserid) field. For a list of allowed values and further information, refer to [UserIdType](normalization-about-schemas.md#useridtype) in the [Schema Overview article](normalization-about-schemas.md). |
| <a name="dstusername"></a>**DstUsername** | Optional | String | The destination username, including domain information when available. For the supported format for different ID types, refer to [the User entity](normalization-about-schemas.md#the-user-entity). Use the simple form only if domain information isn't available.<br><br>Store the Username type in the [DstUsernameType](#dstusernametype) field. If other username formats are available, store them in the fields `DstUsername<UsernameType>`.<br><br>Example: `AlbertE` |
| <a name="user"></a>**User** | Alias | | Alias to [DstUsername](#dstusername). |
| <a name="dstusernametype"></a>**DstUsernameType** | Conditional | UsernameType | Specifies the type of the username stored in the [DstUsername](#dstusername) field. For a list of allowed values and further information, refer to [UsernameType](normalization-about-schemas.md#usernametype) in the [Schema Overview article](normalization-about-schemas.md).<br><br>Example: `Windows` |
| **DstUserType** | Optional | UserType | The type of destination user. For a list of allowed values and further information, refer to [UserType](normalization-about-schemas.md#usertype) in the [Schema Overview article](normalization-about-schemas.md). <br><br>**Note**: The value might be provided in the source record by using different terms, which should be normalized to these values. Store the original value in the [DstOriginalUserType](#dstoriginalusertype) field. |
| <a name="dstoriginalusertype"></a>**DstOriginalUserType** | Optional | String | The original destination user type, if provided by the source. |


### Destination application fields

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| <a name="dstappname"></a>**DstAppName** | Optional | String | The name of the destination application.<br><br>Example: `Facebook` |
| <a name="dstappid"></a>**DstAppId** | Optional | String | The ID of the destination application, as reported by the reporting device.If [DstAppType](#dstapptype) is `Process`, `DstAppId` and `DstProcessId` should have the same value.<br><br>Example: `124` |
| <a name="dstapptype"></a>**DstAppType** | Optional | AppType | The type of the destination application. For a list of allowed values and further information, refer to [AppType](normalization-about-schemas.md#apptype) in the [Schema Overview article](normalization-about-schemas.md).<br><br>This field is mandatory if [DstAppName](#dstappname) or [DstAppId](#dstappid) are used. |
| <a name="dstprocessname"></a>**DstProcessName**              | Optional     | String     |   The file name of the process that terminated the network session. This name is typically considered to be the process name.  <br><br>Example: `C:\Windows\explorer.exe`  |
| <a name="process"></a>**Process**        | Alias        |            | Alias to the [DstProcessName](#dstprocessname) <br><br>Example: `C:\Windows\System32\rundll32.exe`|
| **DstProcessId**| Optional    | String  | The process ID (PID) of the process that terminated the network session.<br><br>Example:  `48610176` <br><br>**Note**: The type is defined as *string* to support varying systems, but on Windows and Linux this value must be numeric. <br><br>If you are using a Windows or Linux machine and used a different type, make sure to convert the values. For example, if you used a hexadecimal value, convert it to a decimal value.    |
| **DstProcessGuid** | Optional     | String     |  A generated unique identifier (GUID) of the process that terminated the network session.   <br><br> Example: `EF3BD0BD-2B74-60C5-AF5C-010000001E00`            |


### Source system fields

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| <a name="src"></a>**Src** | Alias       | |    A unique identifier of the source device. <br><br>This field might alias the [SrcDvcId](#srcdvcid), [SrcHostname](#srchostname), or [SrcIpAddr](#srcipaddr) fields. <br><br>Example: `192.168.12.1`       |
| <a name="srcipaddr"></a>**SrcIpAddr** | Recommended | IP address | The IP address from which the connection or session originated. This value is mandatory if **SrcHostname** is specified. If the session uses network address translation, `SrcIpAddr` is the publicly visible address, and not the original address of the source, which is stored in [SrcNatIpAddr](#srcnatipaddr)<br><br>Example: `77.138.103.108` |
| **SrcPortNumber** | Optional | Integer | The IP port from which the connection originated. Might not be relevant for a session comprising multiple connections.<br><br>Example: `2335` |
| <a name="srchostname"></a> **SrcHostname** | Recommended | Hostname | The source device hostname, excluding domain information. If no device name is available, store the relevant IP address in this field.<br><br>Example: `DESKTOP-1282V4D` |
|<a name="srcdomain"></a> **SrcDomain** | Recommended | String | The domain of the source device.<br><br>Example: `Contoso` |
| <a name="srcdomaintype"></a>**SrcDomainType** | Conditional | DomainType | The type of [SrcDomain](#srcdomain). For a list of allowed values and further information, refer to [DomainType](normalization-about-schemas.md#domaintype) in the [Schema Overview article](normalization-about-schemas.md).<br><br>Required if [SrcDomain](#srcdomain) is used. |
| **SrcFQDN** | Optional | String | The source device hostname, including domain information when available. <br><br>**Note**: This field supports both traditional FQDN format and Windows domain\hostname format. The [SrcDomainType](#srcdomaintype) field reflects the format used. <br><br>Example: `Contoso\DESKTOP-1282V4D` |
| <a name="srcdvcid"></a>**SrcDvcId** | Optional | String |  The ID of the source device. If multiple IDs are available, use the most important one, and store the others in the fields `SrcDvc<DvcIdType>`.<br><br>Example: `ac7e9755-8eae-4ffc-8a02-50ed7a2216c3` |
| <a name="srcdvcscopeid"></a>**SrcDvcScopeId** | Optional | String | The cloud platform scope ID the device belongs to. **SrcDvcScopeId** map to a subscription ID on Azure and to an account ID on AWS. | 
| <a name="srcdvcscope"></a>**SrcDvcScope** | Optional | String | The cloud platform scope the device belongs to. **SrcDvcScope** map to a subscription ID on Azure and to an account ID on AWS. | 
| **SrcDvcIdType** | Conditional | DvcIdType | The type of [SrcDvcId](#srcdvcid). For a list of allowed values and further information, refer to [DvcIdType](normalization-about-schemas.md#dvcidtype) in the [Schema Overview article](normalization-about-schemas.md). <br><br>**Note**: This field is required if [SrcDvcId](#srcdvcid) is used. |
| **SrcDeviceType** | Optional | DeviceType | The type of the source device. For a list of allowed values and further information, refer to [DeviceType](normalization-about-schemas.md#devicetype) in the [Schema Overview article](normalization-about-schemas.md). |
| **SrcZone** | Optional | String | The network zone of the source, as defined by the reporting device.<br><br>Example: `Internet` |
| **SrcInterfaceName** | Optional | String | The network interface used for the connection or session by the source device. <br><br>Example: `eth01` |
| **SrcInterfaceGuid** | Optional | String | The GUID of the network interface used on the source device.<br><br>Example:<br>`46ad544b-eaf0-47ef-`<br>`827c-266030f545a6` |
| **SrcMacAddr** | Optional | String | The MAC address of the network interface from which the connection or session originated.<br><br>Example: `06:10:9f:eb:8f:14` |
| <a name="srcvlanid"></a>**SrcVlanId** | Optional | String | The VLAN ID related to the source device.<br><br>Example: `130` |
| **InnerVlanId** | Optional | Alias | Alias to [SrcVlanId](#srcvlanid). <br><br>In many cases, the VLAN can't be determined as a source or a destination but is characterized as inner or outer. This alias to signifies that [SrcVlanId](#srcvlanid) should be used when the VLAN is characterized as inner.    |
| <a name="srcsubscription"></a>**SrcSubscriptionId** | Optional | String | The cloud platform subscription ID the source device belongs to. **SrcSubscriptionId** map to a subscription ID on Azure and to an account ID on AWS. | 
| **SrcGeoCountry** | Optional | Country | The country associated with the source IP address.<br><br>Example: `USA` |
| **SrcGeoRegion** | Optional | Region | The region associated with the source IP address.<br><br>Example: `Vermont` |
| **SrcGeoCity** | Optional | City | The city associated with the source IP address.<br><br>Example: `Burlington` |
| **SrcGeoLatitude** | Optional | Latitude | The latitude of the geographical coordinate associated with the source IP address.<br><br>Example: `44.475833` |
| **SrcGeoLongitude** | Optional | Longitude | The longitude of the geographical coordinate associated with the source IP address.<br><br>Example: `73.211944` |


### Source user fields

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| <a name="srcuserid"></a>**SrcUserId** | Optional | String | A machine-readable, alphanumeric, unique representation of the source user. For the supported format for different ID types, refer to [the User entity](normalization-about-schemas.md#the-user-entity). <br><br>Example: `S-1-12` |
| **SrcUserScope** | Optional | String | The scope, such as Azure AD tenant, in which [SrcUserId](#srcuserid) and [SrcUsername](#srcusername) are defined. or more information and list of allowed values, see [UserScope](normalization-about-schemas.md#userscope) in the [Schema Overview article](normalization-about-schemas.md).|
| **SrcUserScopeId** | Optional | String | The scope ID, such as Azure AD Directory ID, in which [SrcUserId](#srcuserid) and [SrcUsername](#srcusername) are defined. for more information and list of allowed values, see [UserScopeId](normalization-about-schemas.md#userscopeid) in the [Schema Overview article](normalization-about-schemas.md).|
| <a name="srcuseridtype"></a>**SrcUserIdType** | Conditional | UserIdType | The type of the ID stored in the [SrcUserId](#srcuserid) field. For a list of allowed values and further information, refer to [UserIdType](normalization-about-schemas.md#useridtype) in the [Schema Overview article](normalization-about-schemas.md). |
| <a name="srcusername"></a>**SrcUsername** | Optional | String | The source username, including domain information when available. For the supported format for different ID types, refer to [the User entity](normalization-about-schemas.md#the-user-entity). Use the simple form only if domain information isn't available.<br><br>Store the Username type in the [SrcUsernameType](#srcusernametype) field. If other username formats are available, store them in the fields `SrcUsername<UsernameType>`.<br><br>Example: `AlbertE` |
| <a name="srcusernametype"></a>**SrcUsernameType** | Conditional | UsernameType | Specifies the type of the username stored in the [SrcUsername](#srcusername) field. For a list of allowed values and further information, refer to [UsernameType](normalization-about-schemas.md#usernametype) in the [Schema Overview article](normalization-about-schemas.md).<br><br>Example: `Windows` |
| **SrcUserType** | Optional | UserType | The type of source user. For a list of allowed values and further information, refer to [UserType](normalization-about-schemas.md#usertype) in the [Schema Overview article](normalization-about-schemas.md). <br><br>**Note**: The value might be provided in the source record by using different terms, which should be normalized to these values. Store the original value in the [SrcOriginalUserType](#srcoriginalusertype) field. |
| <a name="srcoriginalusertype"></a>**SrcOriginalUserType** | Optional | String | The original destination user type, if provided by the reporting device. |


### Source application fields

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| <a name="srcappname"></a>**SrcAppName** | Optional | String | The name of the source application. <br><br>Example: `filezilla.exe` |
| <a name="srcappid"></a>**SrcAppId** | Optional | String | The ID of the source application, as reported by the reporting device. If [SrcAppType](#srcapptype) is `Process`, `SrcAppId` and `SrcProcessId` should have the same value.<br><br>Example: `124` |
| <a name="srcapptype"></a>**SrcAppType** | Optional | AppType | The type of the source application. For a list of allowed values and further information, refer to [AppType](normalization-about-schemas.md#apptype) in the [Schema Overview article](normalization-about-schemas.md).<br><br>This field is mandatory if [SrcAppName](#srcappname) or [SrcAppId](#srcappid) are used. |
| <a name="srcprocessname"></a>**SrcProcessName**              | Optional     | String     |   The file name of the process that initiated the network session. This name is typically considered to be the process name.  <br><br>Example: `C:\Windows\explorer.exe`  |
| **SrcProcessId**| Optional    | String | The process ID (PID) of the process that initiated the network session.<br><br>Example:  `48610176` <br><br>**Note**: The type is defined as *string* to support varying systems, but on Windows and Linux this value must be numeric. <br><br>If you are using a Windows or Linux machine and used a different type, make sure to convert the values. For example, if you used a hexadecimal value, convert it to a decimal value.    |
| **SrcProcessGuid** | Optional     | String     |  A generated unique identifier (GUID) of the process that initiated the network session. <br><br> Example: `EF3BD0BD-2B74-60C5-AF5C-010000001E00`            |

### Local and remote aliases

All the source and destination fields listed above, can be optionally aliased by fields with the same name and the descriptors `Local` and `Remote`. This is typically helpful for events reported by an endpoint and for which the event type is `EndpointNetworkSession`. 

For such events the descriptors `Local` and `Remote` denote the endpoint itself and the device at the other end of the network session respectively. For inbound connections, the local system is the destination, `Local` fields are aliases to the `Dst` fields, and 'Remote' fields are aliases to `Src` fields. Conversely, for outbound connections, the local system is the source, `Local` fields are aliases to the `Src` fields, and `Remote` fields are aliases to `Dst` fields.

For example, for an inbound event, the field `LocalIpAddr` is an alias to `DstIpAddr` and the field `RemoteIpAddr` is an alias to `SrcIpAddr`.

### Hostname and IP address aliases

| Field | Class | Type | Description |
| --- | --- | --- | --- |
| <a name="hostname"></a>**Hostname** | Alias | | - If the event type is `NetworkSession`, `Flow` or `L2NetworkSession`, Hostname is an alias to [DstHostname](#dsthostname).<br> - If the event type is `EndpointNetworkSession`, Hostname is an alias to `RemoteHostname`, which can alias either [DstHostname](#dsthostname) or [SrcHostName](#srchostname), depending on [NetworkDirection](#networkdirection) |
| <a name="ipaddr"></a>**IpAddr** | Alias | | - If the event type is `NetworkSession`, `Flow` or `L2NetworkSession`, IpAddr is an alias to [SrcIpAddr](#srcipaddr).<br> - If the event type is `EndpointNetworkSession`, IpAddr is an alias to `LocalIpAddr`, which can alias either [SrcIpAddr](#srcipaddr) or [DstIpAddr](#dstipaddr), depending on [NetworkDirection](#networkdirection). |


### <a name="Intermediary"></a>Intermediary device and Network Address Translation (NAT) fields

The following fields are useful if the record includes information about an intermediary device, such as a firewall or a proxy, which relays the network session.

Intermediary systems often use address translation and therefore the original address and the address observed externally are not the same. In such cases, the primary address fields such as [SrcIPAddr](#srcipaddr) and [DstIpAddr](#dstipaddr) represent the addresses observed externally, while the NAT address fields, [SrcNatIpAddr](#srcnatipaddr) and [DstNatIpAddr](#dstnatipaddr) represent the internal address of the original device before translation.

| Field | Class | Type | Description |
| --- | --- | --- | --- |
| <a name="dstnatipaddr"></a>**DstNatIpAddr** | Optional | IP address | The **DstNatIpAddr** represents either of:<br> - The original address of the destination device if network address translation was used.<br> - The IP address used by the intermediary device for communication with the source.<br><br>Example: `2::1` | 
| **DstNatPortNumber** | Optional | Integer | If reported by an intermediary NAT device, the port used by the NAT device for communication with the source.<br><br>Example: `443` |
| <a name="srcnatipaddr"></a>**SrcNatIpAddr** | Optional | IP address | The **SrcNatIpAddr** represents either of:<br> - The original address of the source device if network address translation was used.<br> - The IP address used by the intermediary device for communication with the destination.<br><br>Example: `4.3.2.1` |
| **SrcNatPortNumber** | Optional | Integer | If reported by an intermediary NAT device, the port used by the NAT device for communication with the destination.<br><br>Example: `345` |
| <a name="dvcinboundinterface"></a>**DvcInboundInterface** | Optional | String | If reported by an intermediary device, the network interface used by the NAT device for the connection to the source device.<br><br>Example: `eth0` |
| <a name="dvcoutboundinterface"></a>**DvcOutboundInterface** | Optional | String | If reported by an intermediary device, the network interface used by the NAT device for the connection to the destination device.<br><br>Example: `Ethernet adapter Ethernet 4e` |


### <a name="inspection-fields"></a>Inspection fields

The following fields are used to represent that inspection which a security device such as a firewall, an IPS, or a web security gateway performed:

| Field | Class | Type | Description |
| --- | --- | --- | --- |
| <a name="networkrulename"></a>**NetworkRuleName** | Optional | String | The name or ID of the rule by which [DvcAction](#dvcaction) was decided upon.<br><br> Example: `AnyAnyDrop` |
| <a name="networkrulenumber"></a>**NetworkRuleNumber** | Optional | Integer | The number of the rule by which [DvcAction](#dvcaction) was decided upon.<br><br>Example: `23` |
| **Rule** | Alias | String | Either the value of [NetworkRuleName](#networkrulename) or the value of [NetworkRuleNumber](#networkrulenumber). If the value of [NetworkRuleNumber](#networkrulenumber) is used, the type should be converted to string. |
| **ThreatId** | Optional | String | The ID of the threat or malware identified in the network session.<br><br>Example: `Tr.124` |
| **ThreatName** | Optional | String | The name of the threat or malware identified in the network session.<br><br>Example: `EICAR Test File` |
| **ThreatCategory** | Optional | String | The category of the threat or malware identified in the network session.<br><br>Example: `Trojan` |
| **ThreatRiskLevel** | Optional | Integer | The risk level associated with the session. The level should be a number between **0** and **100**.<br><br>**Note**: The value might be provided in the source record by using a different scale, which should be normalized to this scale. The original value should be stored in [ThreatRiskLevelOriginal](#threatoriginalriskleveloriginal). |
| <a name="threatoriginalriskleveloriginal"></a>**ThreatOriginalRiskLevel** | Optional | String | The risk level as reported by the reporting device. |
| **ThreatIpAddr** | Optional | IP Address | An IP address for which a threat was identified. The field [ThreatField](#threatfield) contains the name of the field **ThreatIpAddr** represents. |
| <a name="threatfield"></a>**ThreatField** | Conditional | Enumerated | The field for which a threat was identified. The value is either `SrcIpAddr` or `DstIpAddr`. |
| **ThreatConfidence** | Optional | Integer | The confidence level of the threat identified, normalized to a value between 0 and a 100.| 
| **ThreatOriginalConfidence** | Optional | String |  The original confidence level of the threat identified, as reported by the reporting device.| 
| **ThreatIsActive** | Optional | Boolean | True if the threat identified is considered an active threat. | 
| **ThreatFirstReportedTime** | Optional | datetime | The first time the IP address or domain were identified as a threat.  | 
| **ThreatLastReportedTime** | Optional | datetime | The last time the IP address or domain were identified as a threat.| 


### Other fields

If the event is reported by one of the endpoints of the network session, it might include information about the process that initiated or terminated the session. In such cases, the [ASIM Process Event schema](normalization-schema-process-event.md) is used to normalize this information.

### Schema updates

The following are the changes in version 0.2.1 of the schema:

- Added `Src` and `Dst` as aliases to a leading identifier for the source and destination systems.
- Added the fields `NetworkConnectionHistory`, `SrcVlanId`, `DstVlanId`, `InnerVlanId`, and `OuterVlanId`.

 
The following are the changes in version 0.2.2 of the schema:

- Added `Remote` and `Local` aliases.
- Added the event type `EndpointNetworkSession`.
- Defined `Hostname` and `IpAddr` as aliases for `RemoteHostname` and `LocalIpAddr` respectively when the event type is `EndpointNetworkSession`.
- Defined `DvcInterface` as an alias to `DvcInboundInterface` or `DvcOutboundInterface`.
- Changed the type of the following fields from Integer to Long: `SrcBytes`, `DstBytes`, `NetworkBytes`, `SrcPackets`, `DstPackets`, and `NetworkPackets`.
- Added the fields `NetworkProtocolVersion`, `SrcSubscriptionId`, and `DstSubscriptionId`.
- Deprecated `DstUserDomain` and `SrcUserDomain`.

The following are the changes in version 0.2.3 of the schema:
- Added the `ipaddr_has_any_prefix` filtering parameter.
- The `hostname_has_any` filtering parameter now matches either source or destination hostnames.
- Added the fields `ASimMatchingHostname` and `ASimMatchingIpAddr`.

The following are the changes in version 0.2.4 of the schema:
- Added the `TcpFlags` fields.
- Updated `NetworkIcpmType` and `NetworkIcmpCode` to reflect the number value for both. 
- Added additional inspection fields.
- The field 'ThreatRiskLevelOriginal' was renamed to `ThreatOriginalRiskLevel` to align with ASIM conventions. Existing Microsoft parsers will maintain `ThreatRiskLevelOriginal` until May 1st 2023.
- Marked `EventResultDetails` as recommended, and specified the allowed values.
 
The following are the changes in version 0.2.5 of the schema: 
- Added the fields `DstUserScope`, `SrcUserScope`, `SrcDvcScopeId`, `SrcDvcScope`, `DstDvcScopeId`, `DstDvcScope`, `DvcScopeId`, and `DvcScope`.

The following are the changes in version 0.2.6 of the schema: 
- Added IDS as an event type


## Next steps

For more information, see:

- Watch the [ASIM Webinar](https://www.youtube.com/watch?v=WoGD-JeC7ng) or review the [slides](https://1drv.ms/b/s!AnEPjr8tHcNmjDY1cro08Fk3KUj-?e=murYHG)
- [Advanced Security Information Model (ASIM) overview](normalization.md)
- [Advanced Security Information Model (ASIM) schemas](normalization-about-schemas.md)
- [Advanced Security Information Model (ASIM) parsers](normalization-parsers-overview.md)
- [Advanced Security Information Model (ASIM) content](normalization-content.md)
