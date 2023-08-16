---
title: Microsoft Sentinel Advanced Security Information Model (ASIM) parsers overview | Microsoft Docs
description: This article provides an overview of Advanced Security Information Model (ASIM) parsers and a link to more detailed ASIM parsers documents.
author: oshezaf
ms.topic: conceptual
ms.date: 11/09/2021
ms.author: ofshezaf
--- 

# The Advanced Security Information Model (ASIM) parsers (Public preview)

In Microsoft Sentinel, parsing and [normalizing](normalization.md) happen at query time. Parsers are built as [KQL user-defined functions](/azure/data-explorer/kusto/query/functions/user-defined-functions) that transform data in existing tables, such as **CommonSecurityLog**, custom logs tables, or Syslog, into the normalized schema.

Users [use Advanced Security Information Model (ASIM) parsers](normalization-about-parsers.md) instead of table names in their queries to view data in a normalized format, and to include all data relevant to the schema in your query. 

To understand how parsers fit within the ASIM architecture, refer to the [ASIM architecture diagram](normalization.md#asim-components).

> [!IMPORTANT]
> ASIM is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Built-in ASIM parsers and workspace-deployed parsers

Many ASIM parsers are built in and available out-of-the-box in every Microsoft Sentinel workspace. ASIM also supports deploying parsers to specific workspaces [from GitHub](https://aka.ms/DeployASIM), using an ARM template or manually. Both out-of-the-box and workspace-deployed parsers are functionally equivalent, but have slightly different naming conventions, allowing both parser sets to coexist in the same Microsoft Sentinel workspace.

Each method has advantages over the other: 

| Compare | Built-in | Workspace-deployed |
| --- | --- | --- |
| **Advantages** | Exist in every Microsoft Sentinel instance. <br><br>Usable with other built-in content. | New parsers are often delivered first as workspace-deployed parsers.|
| **Disadvantages** |Cannot be directly modified by users. <br><br>Fewer parsers available. | Not used by built-in content. |
| **When to use** | Use in most cases that you need ASIM parsers. | Use when deploying new parsers, or for parsers not yet available out-of-the-box. |

It is recommended to use built-in parsers for  schemas for which built-in parsers are available. 

## Parser hierarchy and naming

ASIM includes two levels of parsers: **unifying** parser and **source-specific** parsers. The user usually uses the **unifying** parser for the relevant schema, ensuring all data relevant to the schema is queried. The **unifying** parser in turn calls **source-specific** parsers to perform the actual parsing and normalization, which is specific for each source.

The unifying parser name is `_Im_<schema>` for built-in parsers and `im<schema>` for workspace deployed parsers, where `<schema>` stands for the specific schema it serves. Source-specific parsers can also be used independently. Use `_Im_<schema>_<source>` for built-in parsers and `vim<schema><source>` for workspace deployed parsers. For example, in an Infoblox-specific workbook, use the `_Im_Dns_InfobloxNIOS` source-specific parser. You can find a list of source-specific parsers in the [ASIM parsers list](normalization-parsers-list.md).

>[!TIP]
> A corresponding set of parsers that use `_ASim_<schema>` and `ASim<Schema>` are also available. Theses parsers do not support filtering parameters and are provided to help mitigate the [Time picker set to a custom range](normalization-known-issues.md#time-picker-set-to-a-custom-range) issue. Use those parsers only interactively in the logs screen, but not elsewhere, for example in analytic rules or workbooks. This parsers may not be removed when the issue is resolves.


>[!TIP]
> The built-in parser hierarchy adds a layer to support customization. For more information, see [Managing ASIM parsers](normalization-develop-parsers.md).

## <a name="next-steps"></a>Next steps

Learn more about ASIM parsers:

- [Use ASIM parsers](normalization-about-parsers.md)
- [Develop custom ASIM parsers](normalization-develop-parsers.md)
- [Manage ASIM parsers](normalization-manage-parsers.md)
- [The ASIM parsers list](normalization-parsers-list.md)


For more about ASIM, in general, see: 

- Watch the [Deep Dive Webinar on Microsoft Sentinel Normalizing Parsers and Normalized Content](https://www.youtube.com/watch?v=zaqblyjQW6k) or review the [slides](https://1drv.ms/b/s!AnEPjr8tHcNmjGtoRPQ2XYe3wQDz?e=R3dWeM)
- [Advanced Security Information Model (ASIM) overview](normalization.md)
- [Advanced Security Information Model (ASIM) schemas](normalization-about-schemas.md)
- [Advanced Security Information Model (ASIM) content](normalization-content.md)
