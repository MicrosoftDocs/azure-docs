---
title: Windows DNS Events via AMA connector overview
description: Learn about the importance of DNS activity monitoring for security purposes and how the AMA connector helps in collecting, streaming, and filtering DNS logs.
author: yelevin
ms.topic: concept-article
ms.date: 11/11/2024
ms.author: yelevin

#Customer intent: As a security engineer, I want to understand the importance of monitoring DNS activity and learn how to use the Windows DNS Events via AMA connector to collect, stream, and filter DNS logs for enhanced security monitoring.

---

# Windows DNS Events via AMA connector overivew

This article describes the Windows DNS Events via AMA connector, which ingests DNS logs from Windows DNS servers. The connector collects, streams, and filters DNS logs to provide enhanced security monitoring.

DNS is a widely used protocol, which maps between host names and computer readable IP addresses. Because DNS wasn’t designed with security in mind, the service is highly targeted by malicious activity, making its logging an essential part of security monitoring. Some well-known threats that target DNS servers include:

- DDoS attacks targeting DNS servers
- DNS DDoS Amplification 
- DNS hijacking 
- DNS tunneling 
- DNS poisoning 
- DNS spoofing 
- NXDOMAIN attack 
- Phantom domain attacks

While some mechanisms were introduced to improve the overall security of this protocol, DNS servers are still a highly targeted service. Organizations can monitor DNS logs to better understand network activity, and to identify suspicious behavior or attacks targeting resources within the network. The **Windows DNS Events via AMA** connector provides this type of visibility.



## 




### Windows DNS Events via AMA connector

While some mechanisms were introduced to improve the overall security of this protocol, DNS servers are still a highly targeted service. Organizations can monitor DNS logs to better understand network activity, and to identify suspicious behavior or attacks targeting resources within the network. The **Windows DNS Events via AMA** connector provides this type of visibility. 

With the connector, you can:  
- Identify clients that try to resolve malicious domain names.
- View and monitor request loads on DNS servers.
- View dynamic DNS registration failures.
- Identify frequently queried domain names and talkative clients. 
- Identify stale resource records. 
- View all DNS related logs in one place. 

### How collection works with the Windows DNS Events via AMA connector

1. The AMA connector uses the installed DNS extension to collect and parse the logs. 

    > [!NOTE]
    > The Windows DNS Events via AMA connector currently supports analytic event activities only.
 
1. The connector streams the events to the Microsoft Sentinel workspace to be further analyzed. 
1. You can now use advanced filters to filter out specific events or information. With advanced filters, you upload only the valuable data you want to monitor, reducing costs and bandwidth usage. 

### Normalization using ASIM

This connector is fully normalized using [Advanced Security Information Model (ASIM) parsers](normalization.md). The connector streams events originated from the analytical logs into the normalized table named `ASimDnsActivityLogs`. This table acts as a translator, using one unified language, shared across all DNS connectors to come. 

For a source-agnostic parser that unifies all DNS data and ensures that your analysis runs across all configured sources, use the [ASIM DNS unifying parser](normalization-schema-dns.md#out-of-the-box-parsers) `_Im_Dns`.   

The ASIM unifying parser complements the native `ASimDnsActivityLogs` table. While the native table is ASIM compliant, the parser is needed to add capabilities, such as aliases, available only at query time, and to combine `ASimDnsActivityLogs`  with other DNS data sources.   

The [ASIM DNS schema](normalization-schema-dns.md) represents the DNS protocol activity, as logged in the Windows DNS server in the analytical logs. The schema is governed by official parameter lists and RFCs that define fields and values. 

See the [list of Windows DNS server fields](dns-ama-fields.md#asim-normalized-dns-schema) translated into the normalized field names.