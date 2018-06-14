---
title: Expand JSON Transformation using Azure Machine Learning Workbench
description: The reference document for the 'Expand JSON' transform
services: machine-learning
author: ranvijaykumar
ms.author: ranku
manager: mwinkle
ms.reviewer: jmartens, jasonwhowell, mldocs
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.custom: mvc, reference
ms.topic: article
ms.date: 09/14/2017

ROBOTS: NOINDEX
---

# Expand JSON transformation

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)] 


The **Expand JSON** transform enables users to expand an existing column that contains valid JSON text into multiple columns.

## How to perform this transformation

Follow these steps to perform this transform:
1. Select the source column that contains JSON text.
2. Select **Expand JSON** from the **Transforms** menu. Or, Right click on the header of the source column and select **Expand JSON** from the context menu. 
3. Click **OK**. 
 
New columns are added next to the source column. These columns contain properties from the next level of hierarchy in the JSON text. Property Key, if present, is used to create the name of the corresponding column. Nested properties are preserved as JSON text that user can iteratively expand or discard as needed.

## Examples

The source column *Customer* is expanded into two columns *Customer.Name* and *Customer.Phone*.

| Customer                                                | Customer.Name   | Customer.Phone |
|---------------------------------------------------------|-----------------|----------------|
| { "Name" : "Carrie Dodson", "Phone" : "123-4567-890"}   | Carrie Dodson   | 123-4567-890   |
| { "Name" : "Leonard Robledo", "Phone" : "456-7890-123"} | Leonard Robledo | 456-7890-123   |

