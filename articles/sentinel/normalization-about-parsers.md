---
title: Use Advanced SIEM Information Model (ASIM) parsers | Microsoft Docs
description: This article explains how to use KQL functions as query-time parsers to implement the Advanced SIEM Information Model (ASIM)
author: oshezaf
ms.topic: conceptual
ms.date: 11/09/2021
ms.author: ofshezaf
ms.custom: ignite-fall-2021
--- 

# Use Advanced SIEM Information Model (ASIM) parsers (Public preview)

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

Use Advanced SIEM Information Model (ASIM) parsers instead of table names in your Microsoft Sentinel queries to view data in a normalized format and to include all data relevant to the schema in your query. Refer to the table below to find the relevant parser for each schema.

To understand how parsers fit within the ASIM architecture, refer to the [ASIM architecture diagram](normalization.md#asim-components).

> [!IMPORTANT]
> ASIM is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>


## Unifying parsers

When using ASIM in your queries, use **unifying parsers** to combine all sources, normalized to the same schema, and query them using normalized fields. The unifying parser name is `_Im_<schema>` for built-in parsers and `im<schema>` for workspace deployed parsers, where `<schema>` stands for the specific schema it serves.

For example, the following query uses the built-in unifying DNS parser to query DNS events using the `ResponseCodeName`, `SrcIpAddr`, and `TimeGenerated` normalized fields:

```kusto
_Im_Dns
  | where isnotempty(ResponseCodeName)
  | where ResponseCodeName =~ "NXDOMAIN"
  | summarize count() by SrcIpAddr, bin(TimeGenerated,15m)
```

> [!NOTE]
> When using the ASIM unifying filtering parsers in the **Logs** page, the time range selector is set to `custom`. You can still set the time range yourself. Alternatively, specify the time range using parser parameters.
>
> Alternately, use the parameter-less parsers, which start with `_ASim_` for built-in parsers and `ASim` for workspace deployed parsers. Those parsers do not set the time-range picker to `custom` by default.
>

The following table lists unifying parsers available:

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

Unifying parsers use Source-specific parsers to handle the unique aspects of each source. However, source-specific parsers can also be used independently. For example, in an Infoblox-specific workbook, use the `vimDnsInfobloxNIOS` source-specific parser.

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

Each schema has a standard set of filtering parameters documented in the relevant schema documentation. Filtering parameters are entirely optional. The following schemas support filtering parameters:
- [Authentication](authentication-normalization-schema.md)
- [DNS](dns-normalization-schema.md#filtering-parser-parameters)
- [Network Session](network-normalization-schema.md#filtering-parser-parameters)
- [Web Session](web-normalization-schema.md#filtering-parser-parameters)


## <a name="next-steps"></a>Next steps

This article discusses the Advanced SIEM Information Model (ASIM) parsers. To learn how to develop your own parsers, see [Develop ASIM parsers](normalization-develop-parsers.md).

Learn more about ASIM parsers:

- [ASIM parsers overview](normalization-parsers-overview.md)
- [Manage ASIM parsers](normalization-manage-parsers.md)
- [Develop custom ASIM parsers](normalization-develop-parsers.md)

Learn more about the ASIM in general: 

- Watch the [Deep Dive Webinar on Microsoft Sentinel Normalizing Parsers and Normalized Content](https://www.youtube.com/watch?v=zaqblyjQW6k) or review the [slides](https://1drv.ms/b/s!AnEPjr8tHcNmjGtoRPQ2XYe3wQDz?e=R3dWeM)
- [Advanced SIEM Information Model (ASIM) overview](normalization.md)
- [Advanced SIEM Information Model (ASIM) schemas](normalization-about-schemas.md)
- [Advanced SIEM Information Model (ASIM) content](normalization-content.md)
