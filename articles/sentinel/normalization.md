---
title: Normalization and the Azure Sentinel Information Model (ASIM) | Microsoft Docs
description: This article explains how Azure Sentinel normalizes data from many different sources using the Azure Sentinel Information Model (ASIM)
services: sentinel
cloud: na
documentationcenter: na
author: batamig
manager: rkarlin

ms.assetid:
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 06/15/2021
ms.author: bagol

---

# Normalization and the Azure Sentinel Information Model (ASIM)

Azure Sentinel ingests data from many sources. Working with various data types and tables together requires you to understand each of them, and write / use unique sets for analytics rules, workbooks, and hunting queries for each type or schema. Sometimes, you'll need separate rules, workbooks, and queries, even when data types share common elements, such as firewall devices. Correlating between different types of data during an investigation and hunting can also be challenging.

This article provides an overview of the Azure Sentinel Information model (ASIM), which provides a solution for these challenges. You can also Watch the [ASIM Webinar](https://www.youtube.com/watch?v=WoGD-JeC7ng) or review the [slides](https://1drv.ms/b/s!AnEPjr8tHcNmjDY1cro08Fk3KUj-?e=murYHG). Refer to the next steps listed below to understand ASIM in detail.

## Common ASIM use cases and scenarios

The Azure Sentinel Information Model (ASIM) provides a seamless experience for handling various sources in uniform, normalized views, by providing:

- Cross source detection - Normalized analytic rules work across sources, on-prem and cloud, now detecting attacks such as brute force or impossible travel across systems including Okta, AWS, and Azure.
- Source agnostic content - the coverage of built-in as well as custom content using ASIM automatically expands to any source that supports ASIM, even if the source was added after the content was created. For example, process event analytics support any source that a customer may use to bring in the data, including Defender for Endpoint, Windows Events, and Sysmon. We are ready to add Sysmon for Linux and WEF once released!
- Support for your custom sources in built-in analytics
- Ease of use - once an analyst learns ASIM, writing queries is much simpler as the field names are always the same.

> [!NOTE]
> The Azure Sentinel Information model aligns with the [Open Source Security Events Metadata (OSSEM)](https://ossemproject.com/intro.html) common information model, allowing for predictable entities correlation across normalized tables. OSSEM is a community-led project that focuses primarily on the documentation and standardization of security event logs from diverse data sources and operating systems. The project also provides a Common Information Model (CIM) that can be used for data engineers during data normalization procedures to allow security analysts to query and analyze data across diverse data sources.
>
> For more information, see the [OSSEM reference documentation](https://ossemproject.com/cdm/guidelines/entity_structure.html).
>
## ASIM components

The Azure Sentinel Information Model includes the following components:

|Component  |Description  |
|---------|---------|
|**Normalized schemas**     |   Cover standard sets of predictable event types that you can use when building unified capabilities. <br><br>Each schema defines the fields that represent an event, a normalized column naming convention, and a standard format for the field values. <br><br> ASIM currently defines the following schemas:<br> - [Network Session](normalization-schema.md)<br> - [DNS Activity](dns-normalization-schema.md)<br> - [Process Event](process-events-normalization-schema.md)<br> - [Authentication Event](authentication-normalization-schema.md)<br> - [Registry Event](registry-event-normalization-schema.md)<br> - [File Activity](file-event-normalization-schema.md)  <br><br>For more information about ASIM schemas refer to "[Azure Sentinel Information Model schemas](normalization-about-schemas.md)"  |
|**Parsers**     |  Map existing data to the normalized schemas using [KQL functions](/azure/data-explorer/kusto/query/functions/user-defined-functions). <br><br>Deploy the Microsoft-developed normalizing parsers from the [Azure Sentinel GitHub Parsers folder](https://github.com/Azure/Azure-Sentinel/tree/master/Parsers). Normalized parsers are located in subfolders starting with **ASim**.  <br><br>For more information about ASIM parsers refer to "[Azure Sentinel Information Model parsers](normalization-about-parsers.md)"     |
|**Content for each normalized schema**     |    Includes analytics rules, workbooks, hunting queries, and more. Content for each normalized schema works on any normalized data without the need to create source-specific content. <br><br>For more information about ASIM content refer to "[Azure Sentinel Information Model content](normalization-content.md)"   |

<br>

The following image shows how non-normalized data can be translated into normalized content and used in Azure Sentinel. For example, you can start with a custom, product-specific, non-normalized table, and use a parser and a normalization schema to convert that table to normalized data. Use your normalized data in both Microsoft and custom analytics, rules, workbooks, queries, and more.

 :::image type="content" source="media/normalization/sentinel-information-model-components.png" alt-text="Non-normalized to normalized data conversion flow and usage in Azure Sentinel":::

### ASIM terminology

The Azure Sentinel Information Model uses the following terms:

|Term  |Description  |
|---------|---------|
|**Reporting device**     |   The system that sends the records to Azure Sentinel. This system may not be the subject system for the record that's being sent.      |
|**Record**     |A unit of data sent from the reporting device. A record is often referred to as `log`, `event`, or `alert`, but can also be other types of data.         |
|**Content**, or **Content Item**     |The different, customizable, or user-created artifacts than can be used with Azure Sentinel. Those artifacts include, for example, Analytics rules, Hunting queries and workbooks. A content item is one such artifact.|

<br>

## Getting started with ASIM

### Deploying ASIM

 - To start using ASIM, deploy the ASIM parsers from the folders starting with `ASim` in the [Azure Sentinel HitHub parsers folder] on GitHub](https://github.com/Azure/Azure-Sentinel/tree/master/Parsers).
 - Next activate analytic rules templates that use ASIM. Refer to the [Azure Sentinel Information Model (ASIM) content list](normalized-content.md#builtin) for a list of analytic rules that support ASIM.

### Using ASIM
 - Use the ASIM hunting queries from GitHub. Refer to the [Azure Sentinel Information Model (ASIM) content list](normalized-content.md#builtin) for a list of analytic rules that support ASIM.
 - Use ASIM queries when using KQL in the log screen. 
 - Write your own analytic rules using ASIM or [convert existing ones](normalized-content.md#builtin).
 - [Write parsers](normalization-about-parsers.md) for your custom sources and [add](normalization-about-parsers.md#include) them to the relevant source agnostic parser to enable your customer data to take part of built-in analytics


## Next steps

This article provides an overview of normalization in Azure Sentinel and the Azure Sentinel Information Model.

For more information, see:

- Watch the [ASIM Webinar](https://www.youtube.com/watch?v=WoGD-JeC7ng) or review the [slides](https://1drv.ms/b/s!AnEPjr8tHcNmjDY1cro08Fk3KUj-?e=murYHG)
- [Azure Sentinel Information Model schemas](normalization-about-schemas.md)
- [Azure Sentinel Information Model parsers](normalization-about-parsers.md)
- [Azure Sentinel Information Model content](normalization-content.md)