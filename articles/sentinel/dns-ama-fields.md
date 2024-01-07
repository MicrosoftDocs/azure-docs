---
title: Microsoft Sentinel DNS over AMA connector reference - available fields and normalization schema
description: This article lists available fields for filtering DNS data using the Windows DNS Events via AMA connector, and the normalization schema for Windows DNS server fields.
author: limwainstein
ms.author: lwainstein
ms.topic: reference
ms.date: 09/01/2022
---

# DNS over AMA connector reference - available fields and normalization schema

Microsoft Sentinel allows you to stream and filter events from your Windows Domain Name System (DNS) server logs to the `ASimDnsActivityLog` normalized schema table. This article describes the fields used for filtering the data, and the normalization schema for the Windows DNS server fields.

The Azure Monitor Agent (AMA) and its DNS extension are installed on your Windows Server to upload data from your DNS analytical logs to your Microsoft Sentinel workspace. You stream and filter the data using the [Windows DNS Events via AMA connector](dns-ama-fields.md).

## Available fields for filtering

This table shows the available fields. The field names are normalized using the [DNS schema](#asim-normalized-dns-schema).  

|Field name  |Values  |Description  |
|---------|---------|---------|
|EventOriginalType   |Numbers between 256 and 280   |The Windows DNS eventID, which indicates the type of the DNS protocol event.    |
|EventResultDetails   |• NOERROR<br>• FORMERR<br>• SERVFAIL<br>• NXDOMAIN<br>• NOTIMP<br>• REFUSED<br>• YXDOMAIN<br>• YXRRSET<br>• NXRRSET<br>• NOTAUTH<br>• NOTZONE<br>• DSOTYPENI<br>• BADVERS<br>• BADSIG<br>• BADKEY<br>• BADTIME<br>• BADALG<br>• BADTRUNC<br>• BADCOOKIE  |The operation's DNS result string as defined by the Internet Assigned Numbers Authority (IANA).  |
|DvcIpAdrr  |IP addresses    |The IP address of the server reporting the event. This field also includes geo-location and malicious IP information.    |
|DnsQuery     |Domain names (FQDN)    |The string representing the domain name to be resolved.<br>• Can accept multiple values in a comma-separated list, and wildcards. For example:<br>`*.microsoft.com,google.com,facebook.com`<br>• Review these considerations for [using wildcards](connect-dns-ama.md#use-wildcards). |
|DnsQueryTypeName      |• A<br>• NS<br>• MD<br>• MF<br>• CNAME<br>• SOA<br>• MB<br>• MG<br>• MR<br>• NULL<br>• WKS<br>• PTR<br>• HINFO<br>• MINFO<br>• MX<br>• TXT<br>• RP<br>• AFSDB<br>• X25<br>• ISDN<br>• RT<br>• NSAP<br>• NSAP-PTR<br>• SIG<br>• KEY<br>• PX<br>• GPOS<br>• AAAA<br>• LOC<br>• NXT<br>• EID<br>• NIMLOC<br>• SRV         |The requested DNS attribute. The DNS resource record type name as defined by IANA.  |

## ASIM normalized DNS schema 

This table describes and translates Windows DNS server fields into the normalized field names as they appear in the [DNS normalization schema](normalization-schema-dns.md#schema-details).

|Windows DNS field name  |Normalized field name  |Type  |Description |
|---------|---------|---------|---------|
|EventID     |EventOriginalType          |String         |The original event type or ID. |
|RCODE     |EventResult          |String         |The outcome of the event (success, partial, failure, NA). |
|RCODE parsed     |EventResultDetails          |String         |The DNS response code as defined by IANA.  |
|InterfaceIP      |DvcIpAdrr          |String         |The IP address of the event reporting device or interface. |
|AA     |DnsFlagsAuthoritative         |Integer         |Indicates whether the response from the server was authoritative. |
|AD    |DnsFlagsAuthenticated          |Integer         |Indicates that the server verified all of the data in the answer and the authority of the response, according to the server policies. |
|RQNAME      |DnsQuery          |String         |The domain needs to be resolved. |
|QTYPE     |DnsQueryType         |Integer         |The DNS resource record type as defined by IANA. |
|Port     |SrcPortNumber         |Integer         |Source port sending the query. |
|Source      |SrcIpAddr         |IP address          |The IP address of the client sending the DNS request. For a recursive DNS request, this value is typically the reporting device's IP, in most cases, `127.0.0.1`. |
|ElapsedTime |DnsNetworkDuration |Integer |The time it took to complete the DNS request. |
|GUID |DnsSessionId |String |The DNS session identifier as reported by the reporting device. | 

## Next steps

In this article, you learned about the fields used to filter DNS log data using the Windows DNS events via AMA connector. To learn more about Microsoft Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](detect-threats-built-in.md).
- [Use workbooks](monitor-your-data.md) to monitor your data.