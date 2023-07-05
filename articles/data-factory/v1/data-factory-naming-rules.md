---
title: Rules for naming Azure Data Factory entities - version 1
description: Describes naming rules for Data Factory v1 entities.
author: dcstwh
ms.author: weetok
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: v1
ms.topic: conceptual
ms.date: 04/12/2023
---

# Rules for naming Azure Data Factory entities
> [!NOTE]
> This article applies to version 1 of Data Factory. If you are using the current version of the Data Factory service, see [naming rules in Data Factory](../naming-rules.md).

The following table provides naming rules for Data Factory artifacts.

| Name | Name Uniqueness | Validation Checks |
|:--- |:--- |:--- |
| Data Factory |Unique across Microsoft Azure. Names are case-insensitive, that is, `MyDF` and `mydf` refer to the same data factory. |<ul><li>Each data factory is tied to exactly one Azure subscription.</li><li>Object names must start with a letter or a number, and can contain only letters, numbers, and the dash (-) character.</li><li>Every dash (-) character must be immediately preceded and followed by a letter or a number. Consecutive dashes are not permitted in container names.</li><li>Name can be 3-63 characters long.</li></ul> |
| Linked Services/Tables/Pipelines |Unique with in a data factory. Names are case-insensitive. |<ul><li>Maximum number of characters in a table name: 260.</li><li>Object names must start with a letter, number, or an underscore (_).</li><li>Following characters are not allowed: ".", "+", "?", "/", "<", ">","*","%","&",":","\\"</li></ul> |
| Resource Group |Unique across Microsoft Azure. Names are case-insensitive. |<ul><li>Maximum number of characters: 1000.</li><li>Name can contain letters, digits, and the following characters: "-", "_", "," and "."</li></ul> |

