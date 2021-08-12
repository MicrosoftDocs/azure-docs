---
title: Azure Sentinel Information Model (ASIM) content | Microsoft Docs
description: This article outlines the Azure Sentinel content that utilized Azure Sentinel Infomration Model (ASIM)
services: sentinel
cloud: na
documentationcenter: na
author: ofshezaf
manager: rkarlin

ms.assetid:
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 08/11/2021
ms.author: oshezaf

--- 

# Azure Sentinel Information Model (ASIM) Content

Azure Sentinel content includes analytic rules, hunting queries, and workbooks that work with source-agnostic normalization parsers.

- Find normalized, built-in content in Azure Sentinel galleries and [solutions](sentinel-solutions-catalog.md).

- Create normalized content yourself, or modify existing content to use normalized data.

##  Identify built-in normalized content

The documentation for each schema includes a list of content items that work with each normalized schema. Schema content is updated regularly, and uses the following guidelines:

-	**Content items that focus on a normalized schema** include the schema as part of the name. For example, the names of analytic rules that focus on the [Normalized DNS schema](dns-normalization-schema.md) have a suffix of `(Normalized DNS)`.

-	**Content items that consider the normalized schema among other data types** are not marked by any suffix. In such cases, search for the normalized schema parser name on GitHub to identify them all.

## Modifying your content to use normalized data

To enable your custom content to use normalization:

- Modify your queries to use the source-agnostic parsers relevant to the query.
- Modify field names in your query to use the normalized schema field names.
- When applicable, change conditions to use the normalized values of the fields in your query.

For example, consider the **Rare client observed with high reverse DNS lookup count** DNS analytic rule, which works on DNS events send by Infoblox DNS servers:

```kusto
let threshold = 200;
InfobloxNIOS
| where ProcessName =~ "named" and Log_Type =~ "client"
| where isnotempty(ResponseCode)
| where ResponseCode =~ "NXDOMAIN"
| summarize count() by Client_IP, bin(TimeGenerated,15m)
| where count_ > threshold
| join kind=inner (InfobloxNIOS
    | where ProcessName =~ "named" and Log_Type =~ "client"
    | where isnotempty(ResponseCode)
    | where ResponseCode =~ "NXDOMAIN"
    ) on Client_IP
| extend timestamp = TimeGenerated, IPCustomEntity = Client_IP
```

The following version is the source-agnostic version, which uses normalization to provide the same detection for any source providing DNS query events:

```kusto
let threshold = 200;
imDns
| where isnotempty(ResponseCodeName)
| where ResponseCodeName =~ "NXDOMAIN"
| summarize count() by SrcIpAddr, bin(TimeGenerated,15m)
| where count_ > threshold
| join kind=inner (imDns
    | where isnotempty(ResponseCodeName)
    | where ResponseCodeName =~ "NXDOMAIN"
    ) on SrcIpAddr
| extend timestamp = TimeGenerated, IPCustomEntity = SrcIpAddr
```

The normalized, source-agnostic version has the following differences:

- The `imDns`normalized parser is used instead of the Infoblox Parser.

- `imDns` fetches only DNS query events, so there is no need for checking the event type, as performed by the `where ProcessName =~ "named" and Log_Type =~ "client"` in the Infoblox version.

- The `ResponseCodeName` and `SrcIpAddr` fields are used instead of `ResponseCode`, and `Client_IP`, respectively.

## Enable normalized content to use your custom data

Normalization allows you to use your own content and built-in content with your custom data.

For example, if you have a custom connector that receives DNS query activity log, you can ensure that the DNS query activity logs take advantage of any normalized DNS content by:

-	[Creating a normalized parser](normalization-about-parsers.md) for your custom connector. If the parser is for product `Xxx` by vendor `Yyy`, the parser should be named `vimDnsYyyXxx`.

-	Modifying the `imDns` source-agnostic parser to also include your parser by adding it to the list of parsers in the `union` statement. For example:

    ```kusto
    union isfuzzy=true 
    vimDnsEmpty, 
    vimDnsCiscoUmbrella, 
    vimDnsInfobloxNIOS, 
    vimDnsMicrosoftOMS,
    vimDnsYyyXxx
    ```


## Next steps

This article discusses the Azure Sentinel Information Model (ASIM) content.

For more information, see:

- [Azure Sentinel Information Model overview](normalization.md)
- [Azure Sentinel Information Model schemas](normalization-about-schemas.md)
- [Azure Sentinel Information Model parsers](normalization-about-parsers.md)