---
title: Use Advanced Security Information Model (ASIM) parsers | Microsoft Docs
description: This article explains how to use Kusto Query Language (KQL) functions as query-time parsers to implement the Advanced Security Information Model (ASIM)
author: oshezaf
ms.topic: concept-article
ms.date: 11/11/2024
ms.author: ofshezaf


#Customer intent: As a security analyst, I want to use ASIM parsers in my queries so that I can view and analyze data in a normalized format for improved query performance and comprehensive security insights.

--- 

# Using the Advanced Security Information Model (ASIM) (Public preview)

Use Advanced Security Information Model (ASIM) parsers instead of table names in your Microsoft Sentinel queries to view data in a normalized format and to include all data relevant to the schema in your query. Refer to the table below to find the relevant parser for each schema.

> [!IMPORTANT]
> ASIM is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Unifying parsers

When using ASIM in your queries, use **unifying parsers** to combine all sources, normalized to the same schema, and query them using normalized fields. The unifying parser name is `_Im_<schema>` for built-in parsers and `im<schema>` for workspace deployed parsers, where `<schema>` stands for the specific schema it serves.

For example, the following query uses the built-in unifying DNS parser to query DNS events using the `ResponseCodeName`, `SrcIpAddr`, and `TimeGenerated` normalized fields:

```kusto
_Im_Dns(starttime=ago(1d), responsecodename='NXDOMAIN')
  | summarize count() by SrcIpAddr, bin(TimeGenerated,15m)
```

The example uses [filtering parameters](#optimizing-parsing-using-parameters), which improve ASIM performance. The same example without filtering parameters would look like this:  

```kusto
_Im_Dns
  | where TimeGenerated > ago(1d)
  | where ResponseCodeName =~ "NXDOMAIN"
  | summarize count() by SrcIpAddr, bin(TimeGenerated,15m)
```

> [!NOTE]
> When using the ASIM parsers in the **Logs** page, the time range selector is set to `custom`. You can still set the time range yourself. Alternatively, specify the time range using parser parameters.
>

The following table lists the available unifying parsers:

| Schema | Unifying parser | 
| ------ | ------------------------- |
| Audit Event | _Im_AuditEvent |
| Authentication | imAuthentication | 
| Dns | _Im_Dns |
| File Event | imFileEvent |
| Network Session | _Im_NetworkSession | 
| Process Event | - imProcessCreate<br> - imProcessTerminate |
| Registry Event |  imRegistry |
| Web Session | _Im_WebSession |  


## Optimizing parsing using parameters

Using parsers might affect your query performance, primarily from filtering the results after parsing. For this reason, many parsers have optional filtering parameters, which enable you to filter before parsing and enhance query performance. With query optimization and prefiltering efforts, ASIM parsers often provide better performance when compared to not using normalization at all.

When invoking the parser, always use available filtering parameters by adding one or more named parameters to ensure optimal performance of the ASIM parsers.

Each schema has a standard set of filtering parameters documented in the relevant schema documentation. Filtering parameters are entirely optional. The following schemas support filtering parameters:

- [Audit Event](normalization-schema-audit.md)
- [Authentication](normalization-schema-authentication.md)
- [DNS](normalization-schema-dns.md#filtering-parser-parameters)
- [Network Session](normalization-schema-network.md#filtering-parser-parameters)
- [Web Session](normalization-schema-web.md#filtering-parser-parameters)

Every schema that supports filtering parameters supports at least the `starttime` and `endtime` parameters and using them is often critical for optimizing performance.

For an example of using filtering parsers, see [Unifying parsers](#unifying-parsers). 

## The pack parameter

To ensure efficiency, parsers maintain only normalized fields. Fields that aren't normalized have less value when combined with other sources. Some parsers support the *pack* parameter. When the *pack* parameter is set to `true`, the parser will pack extra data into the *AdditionalFields* dynamic field.

The [parsers list](normalization-parsers-list.md) article notes parsers that support the *pack* parameter. 

## Related content

For more information, see:

- [ASIM parsers overview](normalization-parsers-overview.md)
- [Manage ASIM parsers](normalization-manage-parsers.md)
- [Develop custom ASIM parsers](normalization-develop-parsers.md)
