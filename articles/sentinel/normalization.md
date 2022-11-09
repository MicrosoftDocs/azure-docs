---
title: Normalization and the Advanced Security Information Model (ASIM) | Microsoft Docs
description: This article explains how Microsoft Sentinel normalizes data from many different sources using the Advanced Security Information Model (ASIM)
author: oshezaf
ms.topic: conceptual
ms.date: 11/09/2021
ms.author: ofshezaf
---

# Normalization and the Advanced Security Information Model (ASIM) (Public preview)

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

Microsoft Sentinel ingests data from many sources. Working with various data types and tables together requires you to understand each of them, and write and use unique sets of data for analytics rules, workbooks, and hunting queries for each type or schema.


Sometimes, you'll need separate rules, workbooks, and queries, even when data types share common elements, such as firewall devices. Correlating between different types of data during an investigation and hunting can also be challenging.

The Advanced Security Information Model (ASIM) is a layer that is located between these diverse sources and the user. ASIM follows the [robustness principle](https://en.wikipedia.org/wiki/Robustness_principle): **"Be strict in what you send, be flexible in what you accept"**. Using the robustness principle as design pattern, ASIM transforms Microsoft Sentinel's inconsistent and hard to use source telemetry to  user friendly data. 

This article provides an overview of the Advanced Security Information Model (ASIM), its use cases and major components. Refer to the [next steps](#next-steps) section for more details.

> [!TIP]
> Also watch the [ASIM Webinar](https://www.youtube.com/watch?v=WoGD-JeC7ng) or review the [webinar slides](https://1drv.ms/b/s!AnEPjr8tHcNmjDY1cro08Fk3KUj-?e=murYHG).
>

> [!IMPORTANT]
> ASIM is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Common ASIM usage

ASIM provides a seamless experience for handling various sources in uniform, normalized views, by providing the following functionality:

- **Cross source detection**. Normalized analytics rules work across sources, on-premises and cloud, and detect attacks such as brute force or impossible travel across systems, including Okta, AWS, and Azure.

- **Source agnostic content**. The coverage of both built-in and custom content using ASIM automatically expands to any source that supports ASIM, even if the source was added after the content was created. For example, process event analytics support any source that a customer may use to bring in the data, such as Microsoft Defender for Endpoint, Windows Events, and Sysmon.

- **Support for your custom sources**, in built-in analytics

- **Ease of use**. After an analyst learns ASIM, writing queries is much simpler as the field names are always the same.

### ASIM and the Open Source Security Events Metadata

ASIM aligns with the [Open Source Security Events Metadata (OSSEM)](https://ossemproject.com/intro.html) common information model, allowing for predictable entities correlation across normalized tables.

OSSEM is a community-led project that focuses primarily on the documentation and standardization of security event logs from diverse data sources and operating systems. The project also provides a Common Information Model (CIM) that can be used for data engineers during data normalization procedures to allow security analysts to query and analyze data across diverse data sources.

For more information, see the [OSSEM reference documentation](https://ossemproject.com/cdm/guidelines/entity_structure.html).

## ASIM components

The following image shows how non-normalized data can be translated into normalized content and used in Microsoft Sentinel. For example, you can start with a custom, product-specific, non-normalized table, and use a parser and a normalization schema to convert that table to normalized data. Use your normalized data in both Microsoft and custom analytics, rules, workbooks, queries, and more.

 :::image type="content" source="media/normalization/asim-architecture.png" alt-text="Non-normalized to normalized data conversion flow and usage in Microsoft Sentinel":::

ASIM includes the following components:

|Component  |Description  |
|---------|---------|
|**Normalized schemas**     |   Cover standard sets of predictable event types that you can use when building unified capabilities. <br><br>Each schema defines the fields that represent an event, a normalized column naming convention, and a standard format for the field values. <br><br> ASIM currently defines the following schemas:<br> - [Authentication Event](authentication-normalization-schema.md)<br> - [DHCP Activity](dhcp-normalization-schema.md)<br> - [DNS Activity](dns-normalization-schema.md)<br> - [File Activity](file-event-normalization-schema.md)  <br> - [Network Session](./network-normalization-schema.md)<br> - [Process Event](process-events-normalization-schema.md)<br> - [Registry Event](registry-event-normalization-schema.md)<br>- [User Management](user-management-normalization-schema.md)<br> - [Web Session](web-normalization-schema.md)<br><br>For more information, see [ASIM schemas](normalization-about-schemas.md).  |
|**Parsers**     |  Map existing data to the normalized schemas using [KQL functions](/azure/data-explorer/kusto/query/functions/user-defined-functions). <br><br>Many ASIM parsers are available out of the box with Microsoft Sentinel. More parsers, and versions of the built-in parsers that can be modified can be deployed from the [Microsoft Sentinel GitHub repository](https://aka.ms/AzSentinelASim). <br><br>For more information, see [ASIM parsers](normalization-parsers-overview.md).     |
|**Content for each normalized schema**     |    Includes analytics rules, workbooks, hunting queries, and more. Content for each normalized schema works on any normalized data without the need to create source-specific content. <br><br>For more information, see [ASIM content](normalization-content.md).   |


### ASIM terminology

ASIM uses the following terms:

|Term  |Description  |
|---------|---------|
|**Reporting device**     |   The system that sends the records to Microsoft Sentinel. This system may not be the subject system for the record that's being sent.      |
|**Record**     |A unit of data sent from the reporting device. A record is often referred to as `log`, `event`, or `alert`, but can also be other types of data.         |
|**Content**, or **Content Item**     |The different, customizable, or user-created artifacts than can be used with Microsoft Sentinel. Those artifacts include, for example, Analytics rules, Hunting queries and workbooks. A content item is one such artifact.|


<br>

## Getting started with ASIM

To start using ASIM:

- Activate analytics rule templates that use ASIM. For more information, see the [ASIM content list](normalization-content.md#builtin).

- Use the ASIM hunting queries from the Microsoft Sentinel GitHub repository, when querying logs in KQL in the Microsoft Sentinel **Logs** page. For more information, see the [ASIM content list](normalization-content.md#builtin).

- Write your own analytics rules using ASIM or [convert existing ones](normalization-content.md#builtin).

- Enable your custom data to use built-in analytics by [writing parsers](normalization-develop-parsers.md) for your custom sources and [adding](normalization-manage-parsers.md) them to the relevant source agnostic parser.

## <a name="next-steps"></a>Next steps

This article provides an overview of normalization in Microsoft Sentinel and ASIM.

For more information, see:

- Watch the [ASIM Webinar](https://www.youtube.com/watch?v=WoGD-JeC7ng) or review the [slides](https://1drv.ms/b/s!AnEPjr8tHcNmjDY1cro08Fk3KUj-?e=murYHG)
- [Advanced Security Information Model (ASIM) schemas](normalization-about-schemas.md)
- [Advanced Security Information Model (ASIM) parsers](normalization-parsers-overview.md)
- [Advanced Security Information Model (ASIM) content](normalization-content.md)
