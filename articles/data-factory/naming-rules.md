---
title: Rules for naming Azure Data Factory entities 
description: Describes naming rules for Data Factory entities.
author: ssabat
ms.author: susabat
ms.reviewer: whhender
ms.subservice: orchestration
ms.topic: concept-article
ms.date: 03/31/2025
---

# Azure Data Factory - naming rules

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

The following table provides naming rules for Data Factory artifacts.

| Name | Name Uniqueness | Validation Checks |
|:--- |:--- |:--- |
| Data factory | Unique across Microsoft Azure. Names are case-insensitive, that is, `MyDF` and `mydf` refer to the same data factory. |<ul><li>Each data factory is tied to exactly one Azure subscription.</li><li>Object names must start with a letter or a number, and can contain only letters, numbers, and the dash (-) character.</li><li>Every dash (-) character must be immediately preceded and followed by a letter or a number. Consecutive dashes aren't permitted in container names.</li><li>Name can be 3-63 characters long.</li></ul> |
| Linked services/Datasets/Pipelines/Data Flows | Unique within a data factory. Names are case-insensitive. |<ul><li>Object names must start with a letter.</li><li>The following characters aren't allowed: “.”, “+”, “?”, “/”, “<”, ”>”,”*”,”%”,”&”,”:”,”\\”</li><li>Dashes ("-") aren't allowed in the names of linked services, data flows, and datasets.</li></ul>  |
| Integration Runtime |Unique within a data factory. Names are case-insensitive. |<ul><li>Integration runtime Name can contain only letters, numbers, and the dash (-) character.</li><li>The first and last characters must be a letter or number. Every dash (-) character must be immediately preceded and followed by a letter or a number.</li><li>Consecutive dashes aren't permitted in integration runtime name. </li></ul> |
| Data flow transformations | Unique within a data flow. Names are case-insensitive | <ul><li>Data flow transformation names can only contain letters and numbers</li><li>The first character must be a letter. </li></ul> |
| Resource Group |Unique across Microsoft Azure. Names are case-insensitive. | For more info, see [Azure naming rules and restrictions](/azure/cloud-adoption-framework/ready/azure-best-practices/naming-and-tagging#resource-naming). |
| Pipeline parameters & variable  |Unique within the pipeline. Names are case-insensitive. | <ul><li>Validation check on parameter names and variable names is limited to uniqueness because of backward compatibility reason.</li><li>When use parameters or variables to reference entity names, for example linked service, the entity naming rules apply.</li><li>A good practice is to follow data flow transformation naming rules to name your pipeline parameters and variables.</li></ul> |

## Related content

Learn how to create data factories by following step-by-step instructions in [Quickstart: create a data factory](quickstart-create-data-factory.md) article. 
