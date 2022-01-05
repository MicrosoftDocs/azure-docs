---
title: Use ASIM parsers | Microsoft Docs
description: This article explains how to use KQL functions as query-time parsers to implement the Advanced SIEM Information Model (ASIM)
author: oshezaf
ms.topic: conceptual
ms.date: 11/09/2021
ms.author: ofshezaf
ms.custom: ignite-fall-2021
--- 

# The Advanced SIEM Information Model (ASIM) parsers (Public preview)

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

In Microsoft Sentinel, parsing and [normalizing](normalization.md) happen at query time. Parsers are built as [KQL user-defined functions](/azure/data-explorer/kusto/query/functions/user-defined-functions) that transform data in existing tables, such as **CommonSecurityLog**, custom logs tables, or Syslog, into the normalized schema.

Users [use ASIM parsers](normalization-about-parsers.md) instead of table names in their queries to view data in a normalized format and to include all data relevant to the schema in your query. 


> [!IMPORTANT]
> ASIM is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Built-in ASIM parsers and workspace deployed parsers

Many ASIM parsers are built-in and available out of the box in every Microsoft Sentinel workspace. ASIM also supports deploying parsers to specific workspaces [from GitHub](https://aka.ms/DeployASIM), using an ARM template or manually. The two types are functionally equivalent but have slightly different naming conventions, allowing both parser sets to coexist.

Each method has advantages over the other: 

| - | Built-in parsers | workspace deployed parsers |
| --------- | ----------------- | ---------------- | 
| Advantages | Exist in every Microsoft Sentinel instance, enabling built-in content to utilize them. | New parsers are often delivered first as workspace deployed parsers. |
| Caveats | - Cannot be directly modified by users. <br> - Less parsers available. | Not used by built-in content. | 
| When should I use them? | In most cases. | - When developing new parsers.<br> - For parsers not yet available as built-in parsers. |
||||

Both methods can coexist. Using both methods is especially useful to allow customization of built-in parsers by incorporating custom workspace deployed parsers in the built-in parsers hierarchy as described below. 

## Parser hierarchy

ASIM includes two levels of parsers: **source-agnostic** and **source-specific** parsers. The user usually uses the **source-agnostic** parser for the relevant schema, ensuring all data relevant to the schema is queried. The **source agnostic parser**, which in turn calls **source-specific** parsers to perform the actual parsing and normalization, which is specific for each source.

The built-in parser hierarchy adds a layer which enables customization, as discussed in the document [Managing ASIM parsers](normalization-develop-parsers.md).

## <a name="next-steps"></a>Next steps

Learn more about ASIM parsers:

- [Use ASIM parsers](normalization-about-parsers.md)
- [Develop custom ASIM parsers](normalization-develop-parsers.md)
- [Manage ASIM parsers](normalization-manage-parsers.md)


For more about ASIM:

- [Advanced SIEM Information Model overview](normalization.md)
- [Advanced SIEM Information Model schemas](normalization-about-schemas.md)
- [Advanced SIEM Information Model content](normalization-content.md)
