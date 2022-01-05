---
title: Use ASIM parsers | Microsoft Docs
description: This article explains how to use KQL functions as query-time parsers to implement the Advanced SIEM Information Model (ASIM)
author: oshezaf
ms.topic: conceptual
ms.date: 11/09/2021
ms.author: ofshezaf
ms.custom: ignite-fall-2021
--- 

# Use ASIM parsers (Public preview)

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

As a user, use ASIM parsers instead of table names in your queries to view data in a normalized format and to include all data relevant to the schema in your query. Refer to the table below to find the relevant parser for each schema.

> [!IMPORTANT]
> ASIM is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>


## Source-agnostic parsers

When using ASIM in your queries, you typically use the **source-agnostic parsers**. A **source-agnostic parser** combines all the sources normalized to the same schema and can be used to query all of them using normalized fields. The source agnostic parser name is `_Im_<schema>` for built-in parsers and `im<schema>` for workspace deployed parsers, where `<schema>` stands for the specific schema it serves.

For example, the following query uses the built-in source-agnostic DNS parser to query DNS events using the `ResponseCodeName`, `SrcIpAddr`, and `TimeGenerated` normalized fields:

```kusto
_Im_Dns
  | where isnotempty(ResponseCodeName)
  | where ResponseCodeName =~ "NXDOMAIN"
  | summarize count() by SrcIpAddr, bin(TimeGenerated,15m)
```

> [!NOTE]
> When using the ASIM source-agnostic filtering parsers in the **Logs** page, the time range selector is set to `custom`. You can still set the time range yourself. Alternatively, specify the time range using parser parameters.
>
> Alternately, use the parameter-less parsers, which start with `_ASim_` for built-in parsers and `ASim` for workspace deployed parsers. Those parsers do not set the time-range picker to `custom` by default.
>

The following are the available source-agnostics parsers you can use:

| Schema | Built-in filtering parser | Built-in parameter-less parser | workspace deployed filtering parser | workspace deployed parameter-less parser |
| ------ | ------------------------- | ------------------------------ | ----------------------------------- | --------------------------- |
| Authentication | | | imAuthentication | ASimAuthentication |
| Dns | _Im_Dns | _ASim_Dns | imDns | ASimDns |
| File Event | | |  | imFileEvent |
| Network Session |  |  | imNetworkSession | ASimNetworkSession |
| Process Event | | | | - imProcess<br> - imProcessCreate<br> - imProcessTerminate |
| Registry Event | | | | imRegistry |
| Web Session | | | imWebSession | ASimWebSession | 
| | | | | 


## Source-specific parsers

Source-agnostic parsers use Source-specific parsers to handle the unique aspects of each source. However, source-specific parsers can also be used independently. For example, in an Infoblox-specific workbook, use the `vimDnsInfobloxNIOS` source-specific parser.

## <a name="optimized-parsers"></a>Optimizing parsing using parameters

Using parsers may impact your query performance, primarily from filtering the results after parsing. For this reason, many parsers have optional filtering parameters, which enable you to filter before parsing and enhance query performance. With query optimization and pre-filtering efforts, ASIM parsers often provide better performance when compared to not using normalization at all.

When invoking the parser, use filtering parameters by adding one or more named parameters. For example, the following query start ensures that only DNS queries for non-existent domains are returned:

```kusto
_Im_Dns(responsecodename='NXDOMAIN')
```

The previous example is similar to the following query but is much more efficient.

```kusto
_Im_Dns | where ResponseCodeName == 'NXDOMAIN'
```

Each schema has a standard set of filtering parameters documented in the schema doc. Filtering parameters are entirely optional. The following schemas support filtering parameters:
- Authentication
- DNS
- Network Session
- Web Session


## <a name="next-steps"></a>Next steps

This article discusses the Advanced SIEM Information Model (ASIM) parsers. To learn how to develop your own parsers, refer to the article [Develop ASIM parsers](normalization-write-parsers.md)

For more information, see:

- Watch the [Deep Dive Webinar on Microsoft Sentinel Normalizing Parsers and Normalized Content](https://www.youtube.com/watch?v=zaqblyjQW6k) or review the [slides](https://1drv.ms/b/s!AnEPjr8tHcNmjGtoRPQ2XYe3wQDz?e=R3dWeM)
- [Advanced SIEM Information Model overview](normalization.md)
- [Advanced SIEM Information Model schemas](normalization-about-schemas.md)
- [Advanced SIEM Information Model content](normalization-content.md)
