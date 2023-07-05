---
title: The Advanced Security Information Model (ASIM) DNS normalization schema reference (Public preview) | Microsoft Docs
description: This article describes the Microsoft Sentinel DNS normalization schema.
author: oshezaf
ms.topic: reference
ms.date: 11/09/2021
ms.author: ofshezaf
---

# The Advanced Security Information Model (ASIM) DNS normalization schema reference (Public preview)

The DNS information model is used to describe events reported by a DNS server or a DNS security system, and is used by Microsoft Sentinel to enable source-agnostic analytics.

For more information, see [Normalization and the Advanced Security Information Model (ASIM)](normalization.md).

> [!IMPORTANT]
> The DNS normalization schema is currently in PREVIEW. This feature is provided without a service level agreement, and is not recommended for production workloads.
>
> The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Schema overview

The ASIM DNS schema represents DNS protocol activity. Both DNS servers and devices sending DNS requests to a DNS server log DNS activity. The DNS protocol activity includes DNS queries, DNS server updates, and DNS bulk data transfers. Since the schema represents protocol activity, it's governed by RFCs and officially assigned parameter lists, which are referenced in this article when appropriate. The DNS schema doesn't represent DNS server audit events. 

The most important activity reported by DNS servers is a DNS query, for which the `EventType` field is set to `Query`.   

The most important fields in a DNS event are:

- [DnsQuery](#query), which reports the domain name for which the query was issued.

- The [SrcIpAddr](#srcipaddr) (aliased to [IpAddr](#ipaddr)), which represents the IP address from which the request was generated. DNS servers typically provide the SrcIpAddr field, but DNS clients sometimes don't provide this field and only provide the [SrcHostname](#srchostname) field. 

- [EventResultDetails](#eventresultdetails), which reports whether the request was successful and if not, why.

- When available, [DnsResponseName](#responsename), which holds the answer provided by the server to the query. ASIM doesn't require parsing the response, and its format varies between sources. 

    To use this field in source-agnostic content, search the content with the `has` or `contains` operators.

DNS events collected on client device may also include [User](#user) and [Process](#process) information. 

## Guidelines for collecting DNS events

DNS is a unique protocol in that it may cross a large number of computers. Also, since DNS uses UDP, requests and responses are de-coupled and aren't directly related to each other.

The following image shows a simplified DNS request flow, including four segments. A real-world request can be more complex, with more segments involved.

:::image type="content" source="media/normalization/dns-request-flow.png" alt-text="Simplified DNS request flow.":::

Since request and response segments aren't directly connected to each other in the DNS request flow, full logging can result in significant duplication.

The most valuable segment to log is the response to the client. The response provides the domain name queries, the lookup result, and the IP address of the client. While many DNS systems log only this segment, there is value in logging the other parts. For example, a DNS cache poisoning attack often takes advantage of fake responses from an upstream server.

If your data source supports full DNS logging and you've chosen to log multiple segments, adjust your queries to prevent data duplication in Microsoft Sentinel.

For example, you might modify your query with the following normalization:

```kql
_Im_Dns | where SrcIpAddr != "127.0.0.1" and EventSubType == "response"
```

## Parsers

For more information about ASIM parsers, see the [ASIM parsers overview](normalization-parsers-overview.md).

### Out-of-the-box parsers

To use parsers that unify all ASIM out-of-the-box parsers, and ensure that your analysis runs across all the configured sources, use the unifying parser `_Im_Dns` as the table name in your query.

For the list of the DNS parsers Microsoft Sentinel provides out-of-the-box refer to the [ASIM parsers list](normalization-parsers-list.md#dns-parsers).

### Add your own normalized parsers

When implementing custom parsers for the Dns information model, name your KQL functions using the format `vimDns<vendor><Product>`. Refer to the article [Managing ASIM parsers](normalization-manage-parsers.md) to learn how to add your custom parsers to the DNS unifying parser.

### Filtering parser parameters

The DNS parsers support [filtering parameters](normalization-about-parsers.md#optimizing-parsing-using-parameters). While these parameters are optional, they can improve your query performance.

The following filtering parameters are available:

| Name     | Type      | Description |
|----------|-----------|-------------|
| **starttime** | datetime | Filter only DNS queries that ran at or after this time. |
| **endtime** | datetime | Filter only DNS queries that finished running at or before this time. |
| **srcipaddr** | string | Filter only DNS queries from this source IP address. |
| **domain_has_any**| dynamic/string | Filter only DNS queries where the `domain` (or `query`) has any of the listed domain names, including as part of the event domain. The length of the list is limited to 10,000 items.
| **responsecodename** | string | Filter only DNS queries for which the response code name matches the provided value. <br>For example: `NXDOMAIN` |
| **response_has_ipv4** | string | Filter only DNS queries in which the response field includes the provided IP address or IP address prefix. Use this parameter when you want to filter on a single IP address or prefix. <br><br>Results aren't returned for sources that don't provide a response.|
| **response_has_any_prefix** | dynamic| Filter only DNS queries in which the response field includes any of the listed IP addresses or IP address prefixes. Prefixes should end with a `.`, for example: `10.0.`. <br><br>Use this parameter when you want to filter on a list of IP addresses or prefixes. <br><br>Results aren't returned for sources that don't provide a response. The length of the list is limited to 10,000 items. |
| **eventtype**| string | Filter only DNS queries of the specified type. If no value is specified, only lookup queries are returned. |


For example, to filter only DNS queries from the last day that failed to resolve the domain name, use:

```kql
_Im_Dns (responsecodename = 'NXDOMAIN', starttime = ago(1d), endtime=now())
```

To filter only DNS queries for a specified list of domain names, use:

```kql
let torProxies=dynamic(["tor2web.org", "tor2web.com", "torlink.co"]);
_Im_Dns (domain_has_any = torProxies)
```

Some parameter can accept both list of values of type `dynamic` or a single string value. To pass a literal list to parameters that expect a dynamic value, explicitly use a [dynamic literal](/azure/data-explorer/kusto/query/scalar-data-types/dynamic#dynamic-literals.md). For example: `dynamic(['192.168.','10.'])`

## Normalized content

For a full list of analytics rules that use normalized DNS events, see [DNS query security content](normalization-content.md#dns-query-security-content).

## Schema details

The DNS information model is aligned with the [OSSEM DNS entity schema](https://github.com/OTRF/OSSEM/blob/master/docs/cdm/entities/dns.md).

For more information, see the [Internet Assigned Numbers Authority (IANA) DNS parameter reference](https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml).

### Common ASIM fields

> [!IMPORTANT]
> Fields common to all schemas are described in detail in the [ASIM Common Fields](normalization-common-fields.md) article.
>



#### Common fields with specific guidelines

The following list mentions fields that have specific guidelines for DNS events:

| **Field** | **Class** | **Type**  | **Description** |
| --- | --- | --- | --- |
| **EventType** | Mandatory | Enumerated | Indicates the operation reported by the record. <br><br> For DNS records, this value would be the [DNS op code](https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml). <br><br>Example: `Query`|
| **EventSubType** | Optional | Enumerated | Either `request` or `response`. <br><br>For most sources, [only the responses are logged](#guidelines-for-collecting-dns-events), and therefore the value is often **response**.  |
| <a name=eventresultdetails></a>**EventResultDetails** | Mandatory | Enumerated | For DNS events, this field provides the [DNS response code](https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml). <br><br>**Notes**:<br>- IANA doesn't define the case for the values, so analytics must normalize the case.<br> - If the source provides only a numerical response code and not a response code name, the parser must include a lookup table to enrich with this value. <br>- If this record represents a request and not a response, set to **NA**. <br><br>Example: `NXDOMAIN` |
| **EventSchemaVersion** | Mandatory | String | The version of the schema documented here is **0.1.7**. |
| **EventSchema** | Mandatory | String | The name of the schema documented here is **Dns**. |
| **Dvc** fields| -      | -    | For DNS events, device fields refer to the system that reports the DNS event. |


#### All common fields

Fields that appear in the table below are common to all ASIM schemas. Any guideline specified above overrides the general guidelines for the field. For example, a field might be optional in general, but mandatory for a specific schema. For further details on each field, see the [ASIM Common Fields](normalization-common-fields.md) article.

| **Class** | **Fields** |
| --------- | ---------- |
| Mandatory | - [EventCount](normalization-common-fields.md#eventcount)<br> - [EventStartTime](normalization-common-fields.md#eventstarttime)<br> - [EventEndTime](normalization-common-fields.md#eventendtime)<br> - [EventType](normalization-common-fields.md#eventtype)<br>- [EventResult](normalization-common-fields.md#eventresult)<br> - [EventProduct](normalization-common-fields.md#eventproduct)<br> - [EventVendor](normalization-common-fields.md#eventvendor)<br> - [EventSchema](normalization-common-fields.md#eventschema)<br> - [EventSchemaVersion](normalization-common-fields.md#eventschemaversion)<br> - [Dvc](normalization-common-fields.md#dvc)<br>|
| Recommended | - [EventResultDetails](normalization-common-fields.md#eventresultdetails)<br>- [EventSeverity](normalization-common-fields.md#eventseverity)<br>- [EventUid](normalization-common-fields.md#eventuid)<br> - [DvcIpAddr](normalization-common-fields.md#dvcipaddr)<br> - [DvcHostname](normalization-common-fields.md#dvchostname)<br> - [DvcDomain](normalization-common-fields.md#dvcdomain)<br>- [DvcDomainType](normalization-common-fields.md#dvcdomaintype)<br>- [DvcFQDN](normalization-common-fields.md#dvcfqdn)<br>- [DvcId](normalization-common-fields.md#dvcid)<br>- [DvcIdType](normalization-common-fields.md#dvcidtype)<br>- [DvcAction](normalization-common-fields.md#dvcaction)|
| Optional | - [EventMessage](normalization-common-fields.md#eventmessage)<br> - [EventSubType](normalization-common-fields.md#eventsubtype)<br>- [EventOriginalUid](normalization-common-fields.md#eventoriginaluid)<br>- [EventOriginalType](normalization-common-fields.md#eventoriginaltype)<br>- [EventOriginalSubType](normalization-common-fields.md#eventoriginalsubtype)<br>- [EventOriginalResultDetails](normalization-common-fields.md#eventoriginalresultdetails)<br> - [EventOriginalSeverity](normalization-common-fields.md#eventoriginalseverity) <br> - [EventProductVersion](normalization-common-fields.md#eventproductversion)<br> - [EventReportUrl](normalization-common-fields.md#eventreporturl)<br> - [EventOwner](normalization-common-fields.md#eventowner)<br>- [DvcZone](normalization-common-fields.md#dvczone)<br>- [DvcMacAddr](normalization-common-fields.md#dvcmacaddr)<br>- [DvcOs](normalization-common-fields.md#dvcos)<br>- [DvcOsVersion](normalization-common-fields.md#dvchostname)<br>- [DvcOriginalAction](normalization-common-fields.md#dvcoriginalaction)<br>- [DvcInterface](normalization-common-fields.md#dvcinterface)<br>- [AdditionalFields](normalization-common-fields.md#additionalfields)<br>- [DvcDescription](normalization-common-fields.md#dvcdescription)<br>- [DvcScopeId](normalization-common-fields.md#dvcscopeid)<br>- [DvcScope](normalization-common-fields.md#dvcscope)|



### Source system fields

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| <a name="src"></a>**Src** | Alias       | String     |    A unique identifier of the source device. <br><br>This field can alias the [SrcDvcId](#srcdvcid), [SrcHostname](#srchostname), or [SrcIpAddr](#srcipaddr) fields. <br><br>Example: `192.168.12.1`       |
| <a name="srcipaddr"></a>**SrcIpAddr** | Recommended | IP Address | The IP address of the client that sent the DNS request. For a recursive DNS request, this value would typically be the reporting device, and in most cases set to `127.0.0.1`. <br><br>Example: `192.168.12.1` |
| **SrcPortNumber** | Optional | Integer | Source port of the DNS query.<br><br>Example: `54312` |
| <a name="ipaddr"></a>**IpAddr** | Alias | | Alias to [SrcIpAddr](#srcipaddr) |
| **SrcGeoCountry** | Optional | Country | The country associated with the source IP address.<br><br>Example: `USA` |
| **SrcGeoRegion** | Optional | Region | The region associated with the source IP address.<br><br>Example: `Vermont` |
| **SrcGeoCity** | Optional | City | The city associated with the source IP address.<br><br>Example: `Burlington` |
| **SrcGeoLatitude** | Optional | Latitude | The latitude of the geographical coordinate associated with the source IP address.<br><br>Example: `44.475833` |
| **SrcGeoLongitude** | Optional | Longitude | The longitude of the geographical coordinate associated with the source IP address.<br><br>Example: `73.211944` |
| **SrcRiskLevel** | Optional | Integer | The risk level associated with the source. The value should be adjusted to a range of `0` to `100`, with `0` for benign and `100` for a high risk.<br><br>Example: `90` |
| **SrcOriginalRiskLevel** | Optional | Integer | The risk level associated with the source, as reported by the reporting device. <br><br>Example: `Suspicious` |
| <a name="srchostname"></a>**SrcHostname** | Recommended | String | The source device hostname, excluding domain information.<br><br>Example: `DESKTOP-1282V4D` |
| **Hostname** | Alias | | Alias to [SrcHostname](#srchostname) |
|<a name="srcdomain"></a> **SrcDomain** | Recommended | String | The domain of the source device.<br><br>Example: `Contoso` |
| <a name="srcdomaintype"></a>**SrcDomainType** | Conditional | Enumerated | The type of  [SrcDomain](#srcdomain), if known. Possible values include:<br>- `Windows` (such as: `contoso`)<br>- `FQDN` (such as: `microsoft.com`)<br><br>Required if [SrcDomain](#srcdomain) is used. |
| **SrcFQDN** | Optional | String | The source device hostname, including domain information when available. <br><br>**Note**: This field supports both traditional FQDN format and Windows domain\hostname format. The [SrcDomainType](#srcdomaintype) field reflects the format used. <br><br>Example: `Contoso\DESKTOP-1282V4D` |
| <a name="srcdvcid"></a>**SrcDvcId** | Optional | String | The ID of the source device as reported in the record.<br><br>For example: `ac7e9755-8eae-4ffc-8a02-50ed7a2216c3` |
| <a name="srcdvcscopeid"></a>**SrcDvcScopeId** | Optional | String | The cloud platform scope ID the device belongs to. **SrcDvcScopeId** map to a subscription ID on Azure and to an account ID on AWS. | 
| <a name="srcdvcscope"></a>**SrcDvcScope** | Optional | String | The cloud platform scope the device belongs to. **SrcDvcScope** map to a subscription ID on Azure and to an account ID on AWS. | 
| **SrcDvcIdType** | Conditional | Enumerated | The type of [SrcDvcId](#srcdvcid), if known. Possible values include:<br> - `AzureResourceId`<br>- `MDEid`<br><br>If multiple IDs are available, use the first one from the list, and store the others in the **SrcDvcAzureResourceId** and **SrcDvcMDEid**, respectively.<br><br>**Note**: This field is required if [SrcDvcId](#srcdvcid) is used. |
| **SrcDeviceType** | Optional | Enumerated | The type of the source device. Possible values include:<br>- `Computer`<br>- `Mobile Device`<br>- `IOT Device`<br>- `Other` |
| <a name = "srcdescription"></a>**SrcDescription** | Optional | String | A descriptive text associated with the device. For example: `Primary Domain Controller`. |


### Source user fields

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| <a name="srcuserid"></a>**SrcUserId**   | Optional  | String     |   A machine-readable, alphanumeric, unique representation of the source user. For more information, and for alternative fields for additional IDs, see [The User entity](normalization-about-schemas.md#the-user-entity).  <br><br>Example: `S-1-12-1-4141952679-1282074057-627758481-2916039507`    |
| **SrcUserScope** | Optional | String | The scope, such as Azure AD tenant, in which [SrcUserId](#srcuserid) and [SrcUsername](#srcusername) are defined. or more information and list of allowed values, see [UserScope](normalization-about-schemas.md#userscope) in the [Schema Overview article](normalization-about-schemas.md).|
| **SrcUserScopeId** | Optional | String | The scope ID, such as Azure AD Directory ID, in which [SrcUserId](#srcuserid) and [SrcUsername](#srcusername) are defined. for more information and list of allowed values, see [UserScopeId](normalization-about-schemas.md#userscopeid) in the [Schema Overview article](normalization-about-schemas.md).|
| <a name="srcuseridtype"></a>**SrcUserIdType** | Conditional  | UserIdType |  The type of the ID stored in the [SrcUserId](#srcuserid) field. For more information and list of allowed values, see [UserIdType](normalization-about-schemas.md#useridtype) in the [Schema Overview article](normalization-about-schemas.md).|
| <a name="srcusername"></a>**SrcUsername** | Optional    | Username     | The source username, including domain information when available. For more information, see [The User entity](normalization-about-schemas.md#the-user-entity).<br><br>Example: `AlbertE`     |
| <a name="srcusernametype"></a>**SrcUsernameType**  | Conditional    | UsernameType |   Specifies the type of the user name stored in the [SrcUsername](#srcusername) field. For more information, and list of allowed values, see [UsernameType](normalization-about-schemas.md#usernametype) in the [Schema Overview article](normalization-about-schemas.md). <br><br>Example: `Windows`       |
| <a name="user"></a>**User** | Alias | | Alias to [SrcUsername](#srcusername) |
| **SrcUserType**  | Optional | UserType | The type of the source user. For more information, and  list of allowed values, see [UserType](normalization-about-schemas.md#usertype) in the [Schema Overview article](normalization-about-schemas.md).<br><br>For example: `Guest` |
| **SrcUserSessionId** | Optional     | String     |   The unique ID of the sign-in session of the Actor.  <br><br>Example: `102pTUgC3p8RIqHvzxLCHnFlg`  |
| <a name="eventoriginalusertype"></a>**SrcOriginalUserType** | Optional | String | The original source user type, if provided by the source. |


### Source process fields

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| <a name="srcprocessname"></a>**SrcProcessName**              | Optional     | String     |   The file name of the process that initiated the DNS request. This name is typically considered to be the process name.  <br><br>Example: `C:\Windows\explorer.exe`  |
| <a name="process"></a>**Process**        | Alias        |            | Alias to the [SrcProcessName](#srcprocessname) <br><br>Example: `C:\Windows\System32\rundll32.exe`|
| **SrcProcessId**| Optional    | String        | The process ID (PID) of the process that initiated the DNS request.<br><br>Example:  `48610176`           <br><br>**Note**: The type is defined as *string* to support varying systems, but on Windows and Linux this value must be numeric. <br><br>If you are using a Windows or Linux machine and used a different type, make sure to convert the values. For example, if you used a hexadecimal value, convert it to a decimal value.    |
| **SrcProcessGuid**              | Optional     | String     |  A generated unique identifier (GUID) of the process that initiated the DNS request.   <br><br> Example: `EF3BD0BD-2B74-60C5-AF5C-010000001E00`            |

### Destination system fields

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| <a name="dst"></a>**Dst** | Alias       | String     |    A unique identifier of the server that received the DNS request. <br><br>This field may alias the [DstDvcId](#dstdvcid), [DstHostname](#dsthostname), or [DstIpAddr](#dstipaddr) fields. <br><br>Example: `192.168.12.1`       |
| <a name="dstipaddr"></a>**DstIpAddr** | Optional | IP Address | The IP address of the server that received the DNS request. For a regular DNS request, this value would typically be the reporting device, and in most cases set to `127.0.0.1`.<br><br>Example: `127.0.0.1` |
| **DstGeoCountry** | Optional | Country | The country associated with the destination IP address. For more information, see [Logical types](normalization-about-schemas.md#logical-types).<br><br>Example: `USA` |
| **DstGeoRegion** | Optional | Region | The region, or state, associated with the destination IP address. For more information, see [Logical types](normalization-about-schemas.md#logical-types).<br><br>Example: `Vermont` |
| **DstGeoCity** | Optional | City | The city associated with the destination IP address. For more information, see [Logical types](normalization-about-schemas.md#logical-types).<br><br>Example: `Burlington` |
| **DstGeoLatitude** | Optional | Latitude | The latitude of the geographical coordinate associated with the destination IP address. For more information, see [Logical types](normalization-about-schemas.md#logical-types).<br><br>Example: `44.475833` |
| **DstGeoLongitude** | Optional | Longitude | The longitude of the geographical coordinate associated with the destination IP address. For more information, see [Logical types](normalization-about-schemas.md#logical-types).<br><br>Example: `73.211944` |
| **DstRiskLevel** | Optional | Integer | The risk level associated with the destination. The value should be adjusted to a range of 0 to 100, which 0 being benign and 100 being a high risk.<br><br>Example: `90` |
| **DstOriginalRiskLevel** | Optional | Integer | The risk level associated with the destination, as reported by the reporting device. <br><br>Example: `Malicious` |
| **DstPortNumber** | Optional | Integer  | Destination Port number.<br><br>Example: `53` |
| <a name="dsthostname"></a>**DstHostname** | Optional | String | The destination device hostname, excluding domain information. If no device name is available, store the relevant IP address in this field.<br><br>Example: `DESKTOP-1282V4D`<br><br>**Note**: This value is mandatory if [DstIpAddr](#dstipaddr) is specified. |
| <a name="dstdomain"></a>**DstDomain** | Optional | String | The domain of the destination device.<br><br>Example: `Contoso` |
| <a name="dstdomaintype"></a>**DstDomainType** | Conditional | Enumerated | The type of [DstDomain](#dstdomain), if known. Possible values include:<br>- `Windows (contoso\mypc)`<br>- `FQDN (learn.microsoft.com)`<br><br>Required if [DstDomain](#dstdomain) is used. |
| **DstFQDN** | Optional | String | The destination device hostname, including domain information when available. <br><br>Example: `Contoso\DESKTOP-1282V4D` <br><br>**Note**: This field supports both traditional FQDN format and Windows domain\hostname format. The [DstDomainType](#dstdomaintype) reflects the format used.   |
| <a name="dstdvcid"></a>**DstDvcId** | Optional | String | The ID of the destination device as reported in the record.<br><br>Example: `ac7e9755-8eae-4ffc-8a02-50ed7a2216c3` |
| <a name="dstdvcscopeid"></a>**DstDvcScopeId** | Optional | String | The cloud platform scope ID the device belongs to. **DstDvcScopeId** map to a subscription ID on Azure and to an account ID on AWS. | 
| <a name="dstdvcscope"></a>**DstDvcScope** | Optional | String | The cloud platform scope the device belongs to. **DstDvcScope** map to a subscription ID on Azure and to an account ID on AWS. | 
| **DstDvcIdType** | Conditional | Enumerated | The type of [DstDvcId](#dstdvcid), if known. Possible values include:<br> - `AzureResourceId`<br>- `MDEidIf`<br><br>If multiple IDs are available, use the first one from the list above, and store the others in the  **DstDvcAzureResourceId** or **DstDvcMDEid** fields, respectively.<br><br>Required if **DstDeviceId** is used.|
| **DstDeviceType** | Optional | Enumerated | The type of the destination device. Possible values include:<br>- `Computer`<br>- `Mobile Device`<br>- `IOT Device`<br>- `Other` |
| <a name = "dstdescription"></a>**DstDescription** | Optional | String | A descriptive text associated with the device. For example: `Primary Domain Controller`. |

### DNS specific fields

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| <a name=query></a>**DnsQuery** | Mandatory | String | The domain that the request tries to resolve. <br><br>**Notes**:<br> - Some sources send valid FQDN queries in a different format. For example, in the DNS protocol itself, the query includes a dot (**.**) at the end, which must be removed.<br>- While the DNS protocol limits the type of value in this field to an FQDN, most DNS servers allow any value, and this field is therefore not limited to FQDN values only. Most notably, DNS tunneling attacks may use invalid FQDN values in the query field.<br>- While the DNS protocol allows for multiple queries in a single request, this scenario is rare, if it's found at all. If the request has multiple queries, store the first one in this field, and then and optionally keep the rest in the [AdditionalFields](normalization-common-fields.md#additionalfields) field.<br><br>Example: `www.malicious.com` |
| <a name="domain"></a>**Domain** | Alias | | Alias to [DnsQuery](#query). |
| **DnsQueryType** | Optional | Integer | The [DNS Resource Record Type codes](https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml). <br><br>Example: `28`|
| **DnsQueryTypeName** | Recommended | Enumerated | The [DNS Resource Record Type](https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml) names. <br><br>**Notes**:<br> - IANA doesn't define the case for the values, so analytics must normalize the case as needed.<br>- The value `ANY` is supported for the response code 255.<br> - The value `TYPExxxx` is supported for unmapped response codes, where `xxxx` is the numerical value of the response code, as reported by the BIND DNS server.<br> -If the source provides only a numerical query type code and not a query type name, the parser must include a lookup table to enrich with this value.<br><br>Example: `AAAA`|
| <a name=responsename></a>**DnsResponseName** | Optional | String | The content of the response, as included in the record.<br> <br> The DNS response data is inconsistent across reporting devices, is complex to parse, and has less value for source-agnostic analytics. Therefore the information model doesn't require parsing and normalization, and Microsoft Sentinel uses an auxiliary function to provide response information. For more information, see [Handling DNS response](#handling-dns-response).|
| <a name=responsecodename></a>**DnsResponseCodeName** |  Alias | | Alias to [EventResultDetails](#eventresultdetails) |
| **DnsResponseCode** | Optional | Integer | The [DNS numerical response code](https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml). <br><br>Example: `3`|
| <a name="transactionidhex"></a>**TransactionIdHex** | Recommended | String | The DNS query unique ID as assigned by the DNS client, in hexadecimal format. Note that this value is part of the DNS protocol and different from [DnsSessionId](#dnssessionid), the network layer session ID, typically assigned by the reporting device. |
| <a name="networkprotocol"></a>**NetworkProtocol** | Optional | Enumerated | The transport protocol used by the network resolution event. The value can be **UDP** or **TCP**, and is most commonly set to **UDP** for DNS. <br><br>Example: `UDP`|
| **NetworkProtocolVersion** | Optional | Enumerated | The version of [NetworkProtocol](#networkprotocol). When using it to distinguish between IP version, use the values `IPv4` and `IPv6`. |
| **DnsQueryClass** | Optional | Integer | The [DNS class ID](https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml).<br> <br>In practice, only the **IN** class (ID 1) is used, and therefore this field is less valuable.|
| **DnsQueryClassName** | Optional | String | The [DNS class name](https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml).<br> <br>In practice, only the **IN** class (ID 1) is used, and therefore this field is less valuable.<br><br>Example: `IN`|
| <a name=flags></a>**DnsFlags** | Optional | String | The flags field, as provided by the reporting device. If flag information is provided in multiple fields, concatenate them with comma as a separator. <br><br>Since DNS flags are complex to parse and are less often used by analytics, parsing, and normalization aren't required. Microsoft Sentinel can use an auxiliary function to provide flags information. For more information, see [Handling DNS response](#handling-dns-response). <br><br>Example: `["DR"]`|
| <a name="dnsnetworkduration"></a>**DnsNetworkDuration** | Optional | Integer | The amount of time, in milliseconds, for the completion of DNS request.<br><br>Example: `1500` |
| **Duration** | Alias | | Alias to [DnsNetworkDuration](#dnsnetworkduration) |
| **DnsFlagsAuthenticated** | Optional | Boolean | The DNS `AD` flag, which is related to DNSSEC, indicates in a response that all data included in the answer and authority sections of the response have been verified by the server according to the policies of that server. For more information, see [RFC 3655 Section 6.1](https://tools.ietf.org/html/rfc3655#section-6.1) for more information.    |
| **DnsFlagsAuthoritative** | Optional | Boolean | The DNS `AA` flag indicates whether the response from the server was authoritative    |
| **DnsFlagsCheckingDisabled** | Optional | Boolean | The DNS `CD` flag, which is related to DNSSEC, indicates in a query that non-verified data is acceptable to the system sending the query. For more information, see [RFC 3655 Section 6.1](https://tools.ietf.org/html/rfc3655#section-6.1) for more information.   |
| **DnsFlagsRecursionAvailable** | Optional | Boolean | The DNS `RA` flag indicates in a response that  that server supports recursive queries.   |
| **DnsFlagsRecursionDesired** | Optional | Boolean | The DNS `RD` flag indicates in a request that that client would like the server to use recursive queries.   |
| **DnsFlagsTruncated** | Optional | Boolean | The DNS `TC` flag indicates that a response was truncated as it exceeded the maximum response size.  |
| **DnsFlagsZ** | Optional | Boolean | The DNS `Z` flag is a deprecated DNS flag, which might be reported by older DNS systems.  |
|<a name="dnssessionid"></a>**DnsSessionId** | Optional | string | The DNS session identifier as reported by the reporting device. This value is different from [TransactionIdHex](#transactionidhex), the DNS query unique ID as assigned by the DNS client.<br><br>Example: `EB4BFA28-2EAD-4EF7-BC8A-51DF4FDF5B55` |
| **SessionId** | Alias | | Alias to [DnsSessionId](#dnssessionid) |
| **DnsResponseIpCountry** | Optional | Country | The country associated with one of the IP addresses in the DNS response. For more information, see [Logical types](normalization-about-schemas.md#logical-types).<br><br>Example: `USA` |
| **DnsResponseIpRegion** | Optional | Region | The region, or state, associated with one of the IP addresses in the DNS response. For more information, see [Logical types](normalization-about-schemas.md#logical-types).<br><br>Example: `Vermont` |
| **DnsResponseIpCity** | Optional | City | The city associated with one of the IP addresses in the DNS response. For more information, see [Logical types](normalization-about-schemas.md#logical-types).<br><br>Example: `Burlington` |
| **DnsResponseIpLatitude** | Optional | Latitude | The latitude of the geographical coordinate associated with one of the IP addresses in the DNS response. For more information, see [Logical types](normalization-about-schemas.md#logical-types).<br><br>Example: `44.475833` |
| **DnsResponseIpLongitude** | Optional | Longitude | The longitude of the geographical coordinate associated with one of the IP addresses in the DNS response. For more information, see [Logical types](normalization-about-schemas.md#logical-types).<br><br>Example: `73.211944` |

### Inspection fields

The following fields are used to represent an inspection, which a DNS security device performed. The threat related fields represent a single threat that is associated with either the source address, the destination address, one of the IP addresses in the response or the DNS query domain. If more than one threat was identified as a threat, information about other IP addresses can be stored in the field `AdditionalFields`.

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| <a name=UrlCategory></a>**UrlCategory** |  Optional | String | A DNS event source may also look up the category of the requested Domains. The field is called **UrlCategory** to align with the Microsoft Sentinel network schema. <br><br>**DomainCategory** is added as an alias that's fitting to DNS. <br><br>Example: `Educational \\ Phishing` |
| **DomainCategory** | Alias | | Alias to [UrlCategory](#UrlCategory). |
| <a name="networkrulename"></a>**NetworkRuleName** | Optional | String | The name or ID of the rule which identified the threat.<br><br> Example: `AnyAnyDrop` |
| <a name="networkrulenumber"></a>**NetworkRuleNumber** | Optional | Integer | The number of the rule which identified the threat.<br><br>Example: `23` |
| **Rule** | Alias | String | Either the value of [NetworkRuleName](#networkrulename) or the value of [NetworkRuleNumber](#networkrulenumber). If the value of [NetworkRuleNumber](#networkrulenumber) is used, the type should be converted to string. |
| **ThreatId** | Optional | String | The ID of the threat or malware identified in the network session.<br><br>Example: `Tr.124` |
| **ThreatCategory** | Optional | String | If a DNS event source also provides DNS security, it may also evaluate the DNS event. For example, it can search for the IP address or domain in a threat intelligence database, and assign the domain or IP address with a Threat Category. |
| **ThreatIpAddr** | Optional | IP Address | An IP address for which a threat was identified. The field [ThreatField](#threatfield) contains the name of the field **ThreatIpAddr** represents. If a threat is identified in the [Domain](#domain) field, this field should be empty. |
| <a name="threatfield"></a>**ThreatField** | Conditional | Enumerated | The field for which a threat was identified. The value is either `SrcIpAddr`, `DstIpAddr`, `Domain`, or `DnsResponseName`. |
| **ThreatName** | Optional | String | The name of the threat identified, as reported by the reporting device. | 
| **ThreatConfidence** | Optional | Integer | The confidence level of the threat identified, normalized to a value between 0 and a 100.| 
| **ThreatOriginalConfidence** | Optional | String |  The original confidence level of the threat identified, as reported by the reporting device.| 
| **ThreatRiskLevel** | Optional | Integer | The risk level associated with the threat identified, normalized to a value between 0 and a 100. | 
| **ThreatOriginalRiskLevel** | Optional | String | The original risk level associated with the threat identified, as reported by the reporting device. |  
| **ThreatIsActive** | Optional | Boolean | True if the threat identified is considered an active threat. | 
| **ThreatFirstReportedTime** | Optional | datetime | The first time the IP address or domain were identified as a threat.  | 
| **ThreatLastReportedTime** | Optional | datetime | The last time the IP address or domain were identified as a threat.| 


### Deprecated aliases and fields

The following fields are aliases that are maintained for backwards compatibility. They were removed from the schema on December 31, 2021.

- `Query` (alias to `DnsQuery`)
- `QueryType` (alias to `DnsQueryType`)
- `QueryTypeName` (alias to `DnsQueryTypeName`)
- `ResponseName` (alias to `DnsReasponseName`)
- `ResponseCodeName` (alias to `DnsResponseCodeName`)
- `ResponseCode` (alias to `DnsResponseCode`)
- `QueryClass` (alias to `DnsQueryClass`)
- `QueryClassName` (alias to `DnsQueryClassName`)
- `Flags` (alias to `DnsFlags`)
- `SrcUserDomain`

### Schema updates

The changes in version 0.1.2 of the schema are:
- Added the field `EventSchema`.
- Added dedicated flag field, which augments the combined **[Flags](#flags)** field: `DnsFlagsAuthoritative`, `DnsFlagsCheckingDisabled`, `DnsFlagsRecursionAvailable`, `DnsFlagsRecursionDesired`, `DnsFlagsTruncated`, and `DnsFlagsZ`.

The changes in version 0.1.3 of the schema are:
- The schema now explicitly documents `Src*`, `Dst*`, `Process*` and `User*` fields.
- Added more `Dvc*` fields to match the latest common fields definition. 
- Added `Src` and `Dst` as aliases to a leading identifier for the source and destination systems.
- Added optional `DnsNetworkDuration` and `Duration`, an alias to it.
- Added optional Geo Location and Risk Level fields.

The changes in version 0.1.4 of the schema are:
- Added the optional fields `ThreatIpAddr`, `ThreatField`, `ThreatName`, `ThreatConfidence`, `ThreatOriginalConfidence`, `ThreatOriginalRiskLevel`, `ThreatIsActive`, `ThreatFirstReportedTime`, and `ThreatLastReportedTime`.

The changes in version 0.1.5 of the schema are:
- Added the fields `SrcUserScope`, `SrcUserSessionId`, `SrcDvcScopeId`, `SrcDvcScope`, `DstDvcScopeId`, `DstDvcScope`, `DvcScopeId`, and `DvcScope`.

The changes in version 0.1.6 of the schema are:
- Added the fields `DnsResponseIpCountry`, `DnsResponseIpRegion`, `DnsResponseIpCity`, `DnsResponseIpLatitude`, and `DnsResponseIpLongitude`.

The changes in version 0.1.7 of the schema are:
- Added the fields `SrcDescription`, `SrcOriginalRiskLevel`, `DstDescription`, `DstOriginalRiskLevel`, `SrcUserScopeId`, `NetworkProtocolVersion`, `Rule`, `RuleName`, `RuleNumber`, and `ThreatId`.


## Source-specific discrepancies 

The goal of normalizing is to ensure that all sources provide consistent telemetry. A source that doesn't provide the required telemetry, such as mandatory schema fields, cannot be normalized. However, sources that typically provide all required telemetry, even if there are some discrepancies, can be normalized. Discrepancies may affect the completeness of query results.

The following table lists known discrepancies:

| Source | Discrepancies |
| ------ | ------------- |
| Microsoft DNS Server Collected using the DNS connector and the Log Analytics Agent | The connector doesn't provide the mandatory DnsQuery field for original event ID 264 (Response to a dynamic update). The data is available at the source, but not forwarded by the connector. |
| Corelight Zeek | Corelight Zeek may not provide the mandatory DnsQuery field. We have observed such behavior in certain cases in which the DNS response code name is `NXDOMAIN`. |


## Handling DNS response

In most cases, logged DNS events don't include response information, which may be large and detailed. If your record includes more response information, store it in the [ResponseName](#responsename) field as it appears in the record.

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

Parsing and normalization aren't required for flag data. Instead, store the flag data provided by the reporting device in the [Flags](#flags) field. If determining the value of individual flags is straight forward, you can also use the dedicated flags fields. 

You can also provide an extra KQL function called `_imDNS<vendor>Flags_`, which takes the unparsed response, or dedicated flag fields, as input and returns a dynamic list, with Boolean values that represent each flag in the following order:

- Authenticated (AD)
- Authoritative (AA)
- Checking Disabled (CD)
- Recursion Available (RA)
- Recursion Desired (RD)
- Truncated (TC)
- Z

## Next steps

For more information, see:

- Watch the [ASIM Webinar](https://www.youtube.com/watch?v=WoGD-JeC7ng) or review the [slides](https://1drv.ms/b/s!AnEPjr8tHcNmjDY1cro08Fk3KUj-?e=murYHG)
- [Advanced Security Information Model (ASIM) overview](normalization.md)
- [Advanced Security Information Model (ASIM) schemas](normalization-about-schemas.md)
- [Advanced Security Information Model (ASIM) parsers](normalization-parsers-overview.md)
- [Advanced Security Information Model (ASIM) content](normalization-content.md)
