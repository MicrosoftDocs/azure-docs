---
title: Modify content to use the Microsoft Sentinel Advanced Security Information Model (ASIM) | Microsoft Docs
description: This article explains how to convert Microsoft Sentinel content to use the Advanced Security Information Model (ASIM).
author: oshezaf
ms.topic: conceptual
ms.date: 11/09/2021
ms.author: ofshezaf
---

# Modify content to use the Advanced Security Information Model (ASIM) (Public preview)

Normalized security content in Microsoft Sentinel includes analytics rules, hunting queries, and workbooks that work with unifying normalization parsers.

<a name="builtin"></a>You can find normalized, out-of-the-box content in Microsoft Sentinel galleries and [solutions](sentinel-solutions-catalog.md), create your own normalized content, or modify existing, custom content to use normalized data.

This article explains how to convert existing Microsoft Sentinel analytics rules to use [normalized data](normalization.md) with the Advanced Security Information Model (ASIM).

To understand how normalized content fits within the ASIM architecture, refer to the [ASIM architecture diagram](normalization.md#asim-components).

> [!TIP]
> Also watch the [Deep Dive Webinar on Microsoft Sentinel Normalizing Parsers and Normalized Content](https://www.youtube.com/watch?v=zaqblyjQW6k) or review the [slides](https://1drv.ms/b/s!AnEPjr8tHcNmjGtoRPQ2XYe3wQDz?e=R3dWeM). For more information, see [Next steps](#next-steps).
>

> [!IMPORTANT]
> ASIM is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Modify custom content to use normalization

To enable your custom Microsoft Sentinel content to use normalization:

- Modify your queries to use any [unifying parsers](normalization-about-parsers.md) relevant to the query.

- Modify field names in your query to use the [normalized schema](normalization-about-schemas.md) field names.

- When applicable, change conditions to use the normalized values of the fields in your query.

## Sample normalization for analytics rules

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

The following code is the source-agnostic version, which uses normalization to provide the same detection for any source providing DNS query events. The following example uses built-in ASIM parsers:

```kusto
_Im_Dns(responsecodename='NXDOMAIN')
| summarize count() by SrcIpAddr, bin(TimeGenerated,15m)
| where count_ > threshold
| join kind=inner (imDns(responsecodename='NXDOMAIN')) on SrcIpAddr
| extend timestamp = TimeGenerated, IPCustomEntity = SrcIpAddr
```

To use workspace-deployed ASIM parsers, replace the first line with the following code:

```kusto
imDns(responsecodename='NXDOMAIN')
```

### Differences between built-in and workspace-deployed parsers

The two options in the example [above](#sample-normalization-for-analytics-rules) are functionally identical. The normalized, source-agnostic version has the following differences:

- The `_Im_Dns` or `imDns`normalized parsers are used instead of the Infoblox Parser.

- The normalized parsers fetch only DNS query events, so there is no need for checking the event type, as performed by the `where ProcessName =~ "named" and Log_Type =~ "client"` in the Infoblox version.

- The `SrcIpAddr` field is used instead of `Client_IP`.
 
- Parser parameter filtering is used for ResponseCodeName, eliminating the need for an explicit `where` clauses.


>[!NOTE]
> Apart from supporting any normalized DNS source, the normalized version is shorter and easier to understand. 
>

If the schema or parsers do not support filtering parameters, the changes are similar, except that the filtering conditions are kept from the original query. For example:

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

## <a name="next-steps"></a>Next steps

This article discusses the Advanced Security Information Model (ASIM) content.

For more information, see:

- Watch the [Deep Dive Webinar on Microsoft Sentinel Normalizing Parsers and Normalized Content](https://www.youtube.com/watch?v=zaqblyjQW6k) or review the [slides](https://1drv.ms/b/s!AnEPjr8tHcNmjGtoRPQ2XYe3wQDz?e=R3dWeM)
- [Advanced Security Information Model (ASIM) overview](normalization.md)
- [Advanced Security Information Model (ASIM) parsers](normalization-parsers-overview.md)
- [Advanced Security Information Model (ASIM) schemas](normalization-about-schemas.md)
- [Advanced Security Information Model (ASIM) content](normalization-content.md)
