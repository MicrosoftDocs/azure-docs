---
title: The Advanced Security Information Model (ASIM) Web Session normalization schema reference (Public preview) | Microsoft Docs
description: This article displays the Microsoft Sentinel Web Session normalization schema.
services: sentinel
cloud: na
documentationcenter: na
author: oshezaf
ms.topic: reference
ms.date: 11/17/2021
ms.author: ofshezaf

---

# The Advanced Security Information Model (ASIM) Web Session normalization schema reference (Public preview)

The Web Session normalization schema is used to describe an IP network activity. For example, IP network activities are reported by web servers, web proxies, and web security gateways.

For more information about normalization in Microsoft Sentinel, see [Normalization and the Advanced Security Information Model (ASIM)](normalization.md).

> [!IMPORTANT]
> The Network normalization schema is currently in PREVIEW. This feature is provided without a service level agreement, and is not recommended for production workloads.
>
> The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Schema overview

The Web Session normalization schema represents any HTTP network session, and is suitable to provide support for common source types, including:

- Web servers
- Web proxies
- Web security gateways

The ASIM Web Session schema represents HTTP and HTTPS protocol activity. Since the schema represents protocol activity, it is governed by RFCs and officially assigned parameter lists, which are referenced in this article when appropriate. 

The Web Session schema doesn't represent audit events from source devices. For example, an event modifying a Web Security Gateway policy can't be represented by the Web Session schema.

Since HTTP sessions are application layer sessions that utilize TCP/IP as the underlying network layer session, the Web Session schema is a super set of the [ASIM Network Session schema](normalization-schema-network.md).

The most important fields in a Web Session schema are:

- [Url](#url), which reports the url that the client requested from the server.
- The [SrcIpAddr](normalization-schema-network.md#srcipaddr) (aliased to [IpAddr](normalization-schema-network.md#ipaddr)), which represents the IP address from which the request was generated. 
- [EventResultDetails](#eventresultdetails) field, which typically reports the HTTP Status Code.

Web Session events may also include [User](normalization-schema-network.md#user) and [Process](normalization-schema-process-event.md) information for the user and process initiating the request. 


## Parsers

For more information about ASIM parsers, see the [ASIM parsers overview](normalization-parsers-overview.md).

### Unifying parsers

To use parsers that unify all ASIM out-of-the-box parsers, and ensure that your analysis runs across all the configured sources, use the `_Im_WebSession` filtering parser or the `_ASim_WebSession` parameter-less parser.

You can also use workspace-deployed `ImWebSession` and `ASimWebSession` parsers by deploying them from the [Microsoft Sentinel GitHub repository](https://aka.ms/DeployASIM). For more information, see [built-in ASIM parsers and workspace-deployed parsers](normalization-parsers-overview.md#built-in-asim-parsers-and-workspace-deployed-parsers).

### Out-of-the-box, source-specific parsers

For the list of the Web Session parsers Microsoft Sentinel provides out-of-the-box refer to the [ASIM parsers list](normalization-parsers-list.md#web-session-parsers) 
### Add your own normalized parsers

When implementing custom parsers for the Web Session information model, name your KQL functions using the following syntax:

- `vimWebSession<vendor><Product>` for parametrized parsers
- `ASimWebSession<vendor><Product>` for regular parsers

### Filtering parser parameters

The `im` and `vim*` parsers support [filtering parameters](normalization-about-parsers.md#). While these parsers are optional, they can improve your query performance.

The following filtering parameters are available:

| Name     | Type      | Description |
|----------|-----------|-------------|
| **starttime** | datetime | Filter only Web sessions that **started** at or after this time. |
| **endtime** | datetime | Filter only Web sessions that **started** running at or before this time. |
| **srcipaddr_has_any_prefix** | dynamic | Filter only Web sessions for which the [source IP address field](normalization-schema-network.md#srcipaddr) prefix is in one of the listed values. The list of values can include IP addresses and IP address prefixes. Prefixes should end with a `.`, for example: `10.0.`. The length of the list is limited to 10,000 items.|
| **ipaddr_has_any_prefix** | dynamic | Filter only network sessions for which the [destination IP address field](normalization-schema-network.md#dstipaddr) or [source IP address field](normalization-schema-network.md#srcipaddr) prefix is in one of the listed values. Prefixes should end with a `.`, for example: `10.0.`. The length of the list is limited to 10,000 items.<br><br>The field [ASimMatchingIpAddr](normalization-common-fields.md#asimmatchingipaddr) is set with the one of the values `SrcIpAddr`, `DstIpAddr`, or `Both` to reflect the matching fields or fields. |
| **url_has_any** | dynamic | Filter only Web sessions for which the [URL field](#url) has any of the values listed. The parser may ignore the schema of the URL passed as a parameter, if the source does not report it. If specified, and the session is not a web session, no result will be returned. The length of the list is limited to 10,000 items.|  
| **httpuseragent_has_any** | dynamic | Filter only web sessions for which the [user agent field](#httpuseragent) has any of the values listed. If specified, and the session is not a web session, no result will be returned. The length of the list is limited to 10,000 items. | 
| **eventresultdetails_in** | dynamic | Filter only web sessions for which the HTTP status code, stored in the [EventResultDetails](#eventresultdetails) field, is any of the values listed. | 
| **eventresult** | string | Filter only network sessions with a specific **EventResult** value. |

Some parameter can accept both list of values of type `dynamic` or a single string value. To pass a literal list to parameters that expect a dynamic value, explicitly use a [dynamic literal](/azure/data-explorer/kusto/query/scalar-data-types/dynamic#dynamic-literals). For example: `dynamic(['192.168.','10.'])`

For example, to filter only Web sessions for a specified list of domain names, use:

```kql
let torProxies=dynamic(["tor2web.org", "tor2web.com", "torlink.co"]);
_Im_WebSession (url_has_any = torProxies)
```

## Schema details

The Web Session information model is aligned with the [OSSEM Network entity schema](https://github.com/OTRF/OSSEM/blob/master/docs/cdm/entities/network.md) and the [OSSEM HTTP entity schema](https://github.com/OTRF/OSSEM/blob/master/docs/cdm/entities/http.md).

To conform with industry best practices, the Web Session schema uses the descriptors **Src** and **Dst** to identify the session source and destination devices, without including the token **Dvc** in the field name.

So, for example, the source device hostname and IP address are named **SrcHostname** and **SrcIpAddr** respectively, and not **Src*Dvc*Hostname** and **Src*Dvc*IpAddr**. The prefix **Dvc** is only used for the reporting or intermediary device, as applicable.

Fields that describe the user and application associated with the source and destination devices also use the **Src** and **Dst** descriptors.

Other ASIM schemas typically use **Target** instead of **Dst**.


### Common ASIM fields

> [!IMPORTANT]
> Fields common to all schemas are described in detail in the [ASIM Common Fields](normalization-common-fields.md) article.
>

#### Common fields with specific guidelines

The following list mentions fields that have specific guidelines for Web Session events:

| Field               | Class       | Type       |  Description        |
|---------------------|-------------|------------|--------------------|
| <a name='eventtype'></a>**EventType** | Mandatory | Enumerated | Describes the operation reported by the record. Allowed values are:<br> - `HTTPsession`: Denotes a network session used for HTTP or HTTPS, typically reported by an intermediary device, such as a proxy or a Web security gateway.<br> - `WebServerSession`: Denotes an HTTP request reported by a web server. Such an event typically has less network related information. The URL reported should not include a schema and a server name, but only the path and parameters part of the URL. <br> - `ApiRequest`: Denotes an HTTP request reported associated with an API call, typically reported by an application server. Such an event typically has less network related information. When reported by the application server, the URL reported should not include a schema and a server name, but only the path and parameters part of the URL. |
| **EventResult** | Mandatory | Enumerated | Describes the event result, normalized to one of the following values: <br> - `Success` <br> - `Partial` <br> - `Failure` <br> - `NA` (not applicable) <br><br>For an HTTP session, `Success` is defined as a status code lower than `400`, and `Failure` is defined as a status code higher than `400`. For a list of HTTP status codes, refer to [W3 Org](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html).<br><br>The source may provide only a value for the [EventResultDetails](#eventresultdetails)  field, which must be analyzed to get the  **EventResult**  value. |
| <a name="eventresultdetails"></a>**EventResultDetails** | Recommended | String | The HTTP status code.<br><br>**Note**: The value may be provided in the source record using different terms, which should be normalized to these values. The original value should be stored in the **EventOriginalResultDetails** field.|
| **EventSchema** | Mandatory | String | The name of the schema documented here is `WebSession`. |
| **EventSchemaVersion**  | Mandatory   | String     | The version of the schema. The version of the schema documented here is `0.2.6`         |
| **Dvc** fields|        |      | For Web Session events,  device fields refer to the system reporting the Web Session event. This is typically an intermediary device for `HTTPSession` events, and the destination web or application server for `WebServerSession` and `ApiRequest` events. |


#### All common fields

Fields that appear in the table below are common to all ASIM schemas. Any guideline specified above overrides the general guidelines for the field. For example, a field might be optional in general, but mandatory for a specific schema. For further details on each field, refer to the [ASIM Common Fields](normalization-common-fields.md) article.

| **Class** | **Fields** |
| --------- | ---------- |
| Mandatory | - [EventCount](normalization-common-fields.md#eventcount)<br> - [EventStartTime](normalization-common-fields.md#eventstarttime)<br> - [EventEndTime](normalization-common-fields.md#eventendtime)<br> - [EventType](normalization-common-fields.md#eventtype)<br>- [EventResult](normalization-common-fields.md#eventresult)<br> - [EventProduct](normalization-common-fields.md#eventproduct)<br> - [EventVendor](normalization-common-fields.md#eventvendor)<br> - [EventSchema](normalization-common-fields.md#eventschema)<br> - [EventSchemaVersion](normalization-common-fields.md#eventschemaversion)<br> - [Dvc](normalization-common-fields.md#dvc)<br>|
| Recommended | - [EventResultDetails](normalization-common-fields.md#eventresultdetails)<br>- [EventSeverity](normalization-common-fields.md#eventseverity)<br>- [EventUid](normalization-common-fields.md#eventuid)<br> - [DvcIpAddr](normalization-common-fields.md#dvcipaddr)<br> - [DvcHostname](normalization-common-fields.md#dvchostname)<br> - [DvcDomain](normalization-common-fields.md#dvcdomain)<br>- [DvcDomainType](normalization-common-fields.md#dvcdomaintype)<br>- [DvcFQDN](normalization-common-fields.md#dvcfqdn)<br>- [DvcId](normalization-common-fields.md#dvcid)<br>- [DvcIdType](normalization-common-fields.md#dvcidtype)<br>- [DvcAction](normalization-common-fields.md#dvcaction)|
| Optional | - [EventMessage](normalization-common-fields.md#eventmessage)<br> - [EventSubType](normalization-common-fields.md#eventsubtype)<br>- [EventOriginalUid](normalization-common-fields.md#eventoriginaluid)<br>- [EventOriginalType](normalization-common-fields.md#eventoriginaltype)<br>- [EventOriginalSubType](normalization-common-fields.md#eventoriginalsubtype)<br>- [EventOriginalResultDetails](normalization-common-fields.md#eventoriginalresultdetails)<br> - [EventOriginalSeverity](normalization-common-fields.md#eventoriginalseverity) <br> - [EventProductVersion](normalization-common-fields.md#eventproductversion)<br> - [EventReportUrl](normalization-common-fields.md#eventreporturl)<br> - [EventOwner](normalization-common-fields.md#eventowner)<br>- [DvcZone](normalization-common-fields.md#dvczone)<br>- [DvcMacAddr](normalization-common-fields.md#dvcmacaddr)<br>- [DvcOs](normalization-common-fields.md#dvcos)<br>- [DvcOsVersion](normalization-common-fields.md#dvchostname)<br>- [DvcOriginalAction](normalization-common-fields.md#dvcoriginalaction)<br>- [DvcInterface](normalization-common-fields.md#dvcinterface)<br>- [AdditionalFields](normalization-common-fields.md#additionalfields)<br>- [DvcDescription](normalization-common-fields.md#dvcdescription)<br>- [DvcScopeId](normalization-common-fields.md#dvcscopeid)<br>- [DvcScope](normalization-common-fields.md#dvcscope)|



### Network session fields

HTTP sessions are application layer sessions that utilize TCP/IP as the underlying network layer session. The Web Session schema is a super set of [ASIM Network Session schema](normalization-schema-network.md) and all the Network Schema Fields are also included in the Web Session schema.


The following ASIM Network Session schema fields have specific guidelines when used for a Web Session event:
- The alias User should refer to the [SrcUsername](normalization-schema-network.md#srcusername) and not to [DstUsername](normalization-schema-network.md#dstusername).
- The field [EventOriginalResultDetails](normalization-common-fields.md#eventoriginalresultdetails) can hold any result reported by the source in addition to the HTTP status code stored in [EventResultDetails](#eventresultdetails).
- For Web Sessions, the primary destination field is the [Url Field](#url). The [DstDomain](normalization-schema-network.md#dstdomain) is optional rather than recommended. Specifically, if not available, there is no need to extract it from the URL in the parser.
- The fields `NetworkRuleName` and `NetworkRuleNumber` are renamed `RuleName` and `RuleNumber` respectively.

Web Session events are commonly reported by intermediate devices that terminate the HTTP connection from the client and initiate a new connection, acting as a proxy, with the server. To represent the intermediate device, use the [ASIM Network Session schema](normalization-schema-network.md) [Intermediary device fields](normalization-schema-network.md#Intermediary)


### <a name="http-session-fields"></a>HTTP session fields

The following are additional fields that are specific to web sessions:

| Field | Class | Type | Description |
| --- | --- | --- | --- |
| <a name="url"></a>**Url** | Mandatory | String | The HTTP request URL, including parameters. For `HTTPSession` events, the URL may include the schema and should include the server name. For `WebServerSession` and for `ApiRequest` the URL would typically not include the schema and server, which can be found in the `NetworkApplicationProtocol` and `DstFQDN` fields respectively. <br><br>Example: `https://contoso.com/fo/?k=v&amp;q=u#f` |
| **UrlCategory** | Optional | String | The defined grouping of a URL or the domain part of the URL. The category is commonly provided by web security gateways and is based on the content of the site the URL points to.<br><br>Example: search engines, adult, news, advertising, and parked domains. |
| **UrlOriginal** | Optional | String | The original value of the URL, when the URL was modified by the reporting device and both values are provided. |
| **HttpVersion** | Optional | String | The HTTP Request Version.<br><br>Example: `2.0` |
| **HttpRequestMethod** | Recommended | Enumerated | The HTTP Method. The values are as defined in [RFC 7231](https://datatracker.ietf.org/doc/html/rfc7231#section-4) and [RFC 5789](https://datatracker.ietf.org/doc/html/rfc5789#section-2), and include `GET`, `HEAD`, `POST`, `PUT`, `DELETE`, `CONNECT`, `OPTIONS`, `TRACE`, and `PATCH`.<br><br>Example: `GET` |
| **HttpStatusCode** | Alias | | The HTTP Status Code. Alias to [EventResultDetails](#eventresultdetails). |
| <a name="httpcontenttype"></a>**HttpContentType** | Optional | String | The HTTP Response content type header. <br><br>**Note**: The **HttpContentType** field may include both the content format and extra parameters, such as the encoding used to get the actual format.<br><br> Example: `text/html; charset=ISO-8859-4` |
| **HttpContentFormat** | Optional | String | The content format part of the [HttpContentType](#httpcontenttype) <br><br> Example: `text/html` |
| **HttpReferrer** | Optional | String | The HTTP referrer header.<br><br>**Note**: ASIM, in sync with OSSEM, uses the correct spelling for *referrer*, and not the original HTTP header spelling.<br><br>Example: `https://developer.mozilla.org/docs` |
| <a name="httpuseragent"></a>**HttpUserAgent** | Optional | String | The HTTP user agent header.<br><br>Example:<br> `Mozilla/5.0` (Windows NT 10.0; WOW64)<br>`AppleWebKit/537.36` (KHTML, like Gecko)<br>`Chrome/83.0.4103.97 Safari/537.36` |
| **UserAgent** | Alias | | Alias to [HttpUserAgent](#httpuseragent) |
| **HttpRequestXff** | Optional | IP Address | The HTTP X-Forwarded-For header.<br><br>Example: `120.12.41.1` |
| **HttpRequestTime** | Optional | Integer | The amount of time, in milliseconds, it took to send the request to the server, if applicable.<br><br>Example: `700` |
| **HttpResponseTime** | Optional | Integer | The amount of time, in milliseconds, it took to receive a response in the server, if applicable.<br><br>Example: `800` |
| **HttpHost** | Optional | String | The virtual web server the HTTP request has targeted. This value is typically based on the [HTTP Host header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host). |   
| **FileName** | Optional | String | For HTTP uploads, the name of the uploaded file. |
| **FileMD5** | Optional | MD5 | For HTTP uploads, the MD5 hash of the uploaded file.<br><br>Example: `75a599802f1fa166cdadb360960b1dd0` |
| **FileSHA1** | Optional | SHA1 | For HTTP uploads, the SHA1 hash of the uploaded file.<br><br>Example:<br>`d55c5a4df19b46db8c54`<br>`c801c4665d3338acdab0` |
| **FileSHA256** | Optional | SHA256 | For HTTP uploads, the SHA256 hash of the uploaded file.<br><br>Example:<br>`e81bb824c4a09a811af17deae22f22dd`<br>`2e1ec8cbb00b22629d2899f7c68da274` |
| **FileSHA512** | Optional | SHA512 | For HTTP uploads, the SHA512 hash of the uploaded file. |
| <a name="hash"></a>**Hash** | Alias || Alias to the available Hash field. | 
| **FileHashType** | Optional | Enumerated | The type of the hash in the [Hash](#hash) field. Possible values include: `MD5`, `SHA1`, `SHA256`, and `SHA512`. |
| **FileSize** | Optional | Long | For HTTP uploads, the size in bytes of the uploaded file. |
| **FileContentType** | Optional | String | For HTTP uploads, the content type of the uploaded file. |


### Other fields

If the event is reported by one of the endpoints of the web session, it may include information about the process that initiated or terminated the session. In such cases, the [ASIM Process Event schema](normalization-schema-process-event.md) to normalize this information.

### Schema updates

The Web Session schema relies on the Network Session schema. Therefore, [Network Session schema updates](normalization-schema-network.md#schema-updates) apply to the Web Session schema as well. 

The following are the changes in version 0.2.5 of the schema:
- Added the field `HttpHost`.

The following are the changes in version 0.2.6 of the schema:
- The type of FileSize was changed from Integer to Long.

## Next steps

For more information, see:

- Watch the [ASIM Webinar](https://www.youtube.com/watch?v=WoGD-JeC7ng) or review the [slides](https://1drv.ms/b/s!AnEPjr8tHcNmjDY1cro08Fk3KUj-?e=murYHG)
- [Advanced Security Information Model (ASIM) overview](normalization.md)
- [Advanced Security Information Model (ASIM) schemas](normalization-about-schemas.md)
- [Advanced Security Information Model (ASIM) parsers](normalization-parsers-overview.md)
- [Advanced Security Information Model (ASIM) content](normalization-content.md)
