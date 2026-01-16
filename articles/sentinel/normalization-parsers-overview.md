---
title: Microsoft Sentinel Advanced Security Information Model (ASIM) parsers overview | Microsoft Docs
description: This article provides an overview of Advanced Security Information Model (ASIM) parsers and a link to more detailed ASIM parsers documents.
author: oshezaf
ms.topic: conceptual
ms.date: 11/09/2021
ms.author: ofshezaf


#Customer intent: As a security analyst, I want to use ASIM parsers to normalize and query security data so that I can efficiently analyze and correlate information from various sources.

--- 

# The Advanced Security Information Model (ASIM) parsers

In Microsoft Sentinel, parsing and [normalizing](normalization.md) happen at query time. Parsers are built as [KQL user-defined functions](/kusto/query/functions/user-defined-functions?view=microsoft-sentinel&preserve-view=true) that transform data in existing tables, such as **CommonSecurityLog**, custom logs tables, or Syslog, into the normalized schema.

Users [use Advanced Security Information Model (ASIM) parsers](normalization-about-parsers.md) instead of table names in their queries to view data in a normalized format, and to include all data relevant to the schema in your query. 

To understand how parsers fit within the ASIM architecture, refer to the [ASIM architecture diagram](normalization.md#asim-components).

## Built-in ASIM parsers and workspace-deployed parsers

ASIM parsers are built in and available out-of-the-box in every Microsoft Sentinel workspace. 

ASIM also supports deploying parsers to specific workspaces [from GitHub](https://aka.ms/DeployASIM), using an ARM template. Workspace deployed parsers are used for ASIM parser development and management. Workspace deployed parsers are functionally equivalent, but have slightly different naming conventions, allowing both parser sets to coexist with built-in parsers in the same Microsoft Sentinel workspace. Read more about [workspace deployed parsers](normalization-about-workspace-parsers.md) to deploy, use and manage them.

It is recommended to use built-in parsers when developing ASIM content. Workspace deployed parsers are typically used during the parser development process or to provide modified versions of built-in parsers as described in [managing parsers](normalization-manage-parsers.md)

## Parser hierarchy and naming

ASIM includes two levels of parsers: **unifying** parser and **source-specific** parsers. The user usually uses the **unifying** parser for the relevant schema, ensuring all data relevant to the schema is queried. The **unifying** parser in turn calls **source-specific** parsers to perform the actual parsing and normalization, which is specific for each source.

The unifying parser name is `_Im_<schema>` where `<schema>` stands for the specific schema it serves. Source-specific parsers can also be used independently. Their naming convention is `_Im_<schema>_<source>V<version>`. You can find a list of source-specific parsers in the [ASIM parsers list](normalization-parsers-list.md).

>[!NOTE]
> A corresponding set of parsers that use `_ASim_<schema>`. These parsers do not support filtering parameters and are provided for backward compatibility.

>[!TIP]
> The parser hierarchy adds a layer to support customization. For more information, see [Managing ASIM parsers](normalization-develop-parsers.md).

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
