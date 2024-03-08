---
title: Flowlet transformation in mapping data flow
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to run a flowlet transformation inside of a mapping data flow in Azure Data Factory and Synapse Analytics pipelines.
author: kromerm
ms.author: makromer
ms.service: data-factory
ms.subservice: data-flows
ms.custom: synapse
ms.topic: conceptual
ms.date: 07/17/2023
---

# Flowlet transformation in mapping data flow

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

[!INCLUDE[data-flow-preamble](includes/data-flow-preamble.md)]

Use the flowlet transformation to run a previously created mapping data flow flowlet. For an overview of flowlets see [Flowlets in mapping data flow | Microsoft Docs](concepts-data-flow-flowlet.md)

> [!NOTE] 
> The flowlet transformation in Azure Data Factory and Synapse Analytics pipelines is currently in public preview

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RWQK3m]

## Configuration

The flowlet transformation contains the following configuration settings

:::image type="content" source="media/data-flow-flowlet/flowlet-settings.png" alt-text="Screenshot showing Flowlet settings configuration.":::

### Flowlet

Select the flowlet to run. Once the flowlet is selected you will be able to map input columns, if any, in the mapping tab.

### Mapping

:::image type="content" source="media/data-flow-flowlet/flowlet-mapping.png" alt-text="Screenshot showing mapping columns to the flowlet input.":::

If the selected flowlet has input columns, you can map columns from the input stream to the expected input columns in the flowlet. This mapping of your mapping data flows columns to the flowlet is what enables the flowlets to serve as reusable snippets of mapping data flow logic across potentially many mapping data flows.

## Data flow script

### Syntax

```
<incomingStream>
<transformation> ~> <transformationName>
<outputStream>
```

### Example

```
source1 derive(Test = "test") ~> DerivedColumn1
DerivedColumn1 output() ~> output1 
```    

