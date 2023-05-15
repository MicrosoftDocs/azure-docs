---
title: Ingest time normalization | Microsoft Docs
description: This article explains how Microsoft Sentinel normalizes data at ingest
author: oshezaf
ms.topic: conceptual
ms.date: 12/28/2022
ms.author: ofshezaf
---

# Ingest time normalization

## Query time parsing

As discussion in the [ASIM overview](normalization.md), Microsoft Sentinel uses both query time and ingest time normalization to take advantage of the benefits of each.

To use query time normalization, use the [query time unifying parsers](normalization-about-parsers.md#unifying-parsers), such as `_Im_Dns` in your queries. Normalizing using query time parsing has several advantages:
 
- **Preserving the original format**: Query time normalization doesn't require the data to be modified, thus preserving the original data format sent by the source.
- **Avoiding potential duplicate storage**: Since the normalized data is only a view of the original data, there is no need to store both original and normalized data. 
- **Easier development**: Since query time parsers present a view of the data and don't modify the data, they are easy to develop. Developing, testing and fixing a parser can all be done on existing data. Moreover, parsers can be fixed when an issue is discovered and the fix will apply to existing data.

## Ingest time parsing

While ASIM query time parsers are optimized, query time parsing can slow down queries, especially on large data sets. 

Ingest time parsing enables transforming events to a normalized schema as they are ingested into Microsoft Sentinel and storing them in a normalized format. Ingest time parsing is less flexible and parsers are harder to develop, but since the data is stored in a normalized format, offers better performance.

Normalized data can be stored in Microsoft Sentinel's native normalized tables, or in a custom table that uses an ASIM schema. A custom table that has a schema close to, but not identical, to an ASIM schema, also provides the performance benefits of ingest time normalization.

Currently, ASIM supports the following native normalized tables as a destination for ingest time normalization:
- [**ASimAuditEventLogs**](/azure/azure-monitor/reference/tables/asimauditeventlogs) for the [Audit Event](normalization-schema-audit.md) schema.
- **ASimAuthenticationEventLogs** for the [Authentication](normalization-schema-authentication.md) schema.
- [**ASimDnsActivityLogs**](/azure/azure-monitor/reference/tables/asimdnsactivitylogs) for the [DNS](normalization-schema-dns.md) schema.
- [**ASimNetworkSessionLogs**](/azure/azure-monitor/reference/tables/asimnetworksessionlogs) for the [Network Session](normalization-schema-network.md) schema 
- [**ASimWebSessionLogs**](/azure/azure-monitor/reference/tables/asimwebsessionlogs) for the [Web Session](normalization-schema-web.md) schema.

The advantage of native normalized tables is that they are included by default in the ASIM unifying parsers. Custom normalized tables can be included in the unifying parsers, as discussed in [Manage Parsers](normalization-manage-parsers.md).

## Combining ingest time and query time normalization

Queries should always use the [query time unifying parsers](normalization-about-parsers.md#unifying-parsers), such as `_Im_Dns` to take advantage of both query time and ingest time normalization. Native normalized tables are included in the queried data by using a stub parser.

The stub parser is a query time parser that uses as input the normalized table. Since the normalized table doesn't require parsing, the stub parser is efficient.

The stub parser presents a view to the calling query that adds to the ASIM native table:

- **Aliases** - in order to not waste storage on repeating values, aliases are not stored in ASIM native tables and are added at query time by the stub parsers.
- **Constant values** - Like aliases, and for the same reason, ASIM normalized tables also don't store constant values  such as [EventSchema](normalization-common-fields.md#eventschema). The stub parser adds those fields. ASIM normalized table is shared by many sources, and ingest time parsers can change their output version. Therefore, fields such as [EventProduct](normalization-common-fields.md#eventproduct), [EventVendor](normalization-common-fields.md#eventvendor), and [EventSchemaVersion](normalization-common-fields.md#eventschemaversion) are not constant and are not added by the stub parser. 
- **Filtering** - the stub parser also implements filtering. While ASIM native tables don't need filtering parsers to achieve better performance, filtering is needed to support inclusion in the unifying parser.
- **Updates and fixes** - Using a stub parser enables fixing issues faster. For example if data was ingested incorrectly, an IP address may have not been extracted from the message field during ingest. The IP address can be extracted by the stub parser at query time. 
 
When using custom normalized tables, create your own stub parser to implement this functionality, and add it to the unifying parsers as discussed in [Manage Parsers](normalization-manage-parsers.md). Use the stub parser for the native table, such as the [DNS native table stub parser](https://github.com/Azure/Azure-Sentinel/blob/master/Parsers/ASimDns/Parsers/ASimDnsNative.yaml) and its [filtering counterpart](https://github.com/Azure/Azure-Sentinel/blob/master/Parsers/ASimDns/Parsers/vimDnsNative.yaml), as a starting point. If your table is semi-normalized, use the stub parser to perform the additional parsing and normalization needed.

Learn more about writing parsers in [Developing ASIM parsers](normalization-develop-parsers.md).

## Implementing ingest time normalization
 
To normalize data at ingest, you will need to use a [Data Collection Rule (DCR)](../azure-monitor/essentials/data-collection-rule-overview.md). The procedure for implementing the DCR depends on the method used to ingest the data. For more information, refer to the article [Transform or customize data at ingestion time in Microsoft Sentinel](configure-data-transformation.md).

A [KQL](kusto-overview.md) transformation query is the core of a DCR. The KQL version used in DCRs is slightly different than the version used elsewhere in Microsoft Sentinel to accommodate for requirements of pipeline event processing. Therefore, you will need to modify any query-time parser to use it in a DCR. For more information on the differences, and how to convert a query-time parser to an ingest-time parser, read about the [DCR KQL limitations](../azure-monitor/essentials/data-collection-transformations-structure.md#kql-limitations).


## <a name="next-steps"></a>Next steps

For more information, see:

- [Normalization and the Advanced Security Information Model (ASIM)](normalization.md)
- [Advanced Security Information Model (ASIM) parsers](normalization-parsers-overview.md)
- [Transform or customize data at ingestion time in Microsoft Sentinel](configure-data-transformation.md)