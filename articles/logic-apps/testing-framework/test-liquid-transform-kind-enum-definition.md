---
title: TestLiquidTransformKind enum
titleSuffix: Azure Logic Apps
description: The supported Liquid transformation kinds for unit testing data map operations in Azure Logic Apps.
services: azure-logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: reference
ms.date: 06/05/2026
---

# TestLiquidTransformKind enum

**Namespace**: Microsoft.Azure.Workflows.UnitTesting.Definitions

This enumeration specifies the type of Liquid transformation to perform when executing a data map test. It determines the input and output format combination for the transformation.

## Values

|Name|Description|
|---|---|
|NotSpecified|The Liquid transform kind is not specified.|
|JsonToJson|Transforms JSON input content to JSON output.|
|JsonToText|Transforms JSON input content to plain text output.|
|XmlToJson|Transforms XML input content to JSON output.|
|XmlToText|Transforms XML input content to plain text output.|

## Related content

- [LiquidDataMapTestExecutor class](liquid-data-map-test-executor-class-definition.md)
- [DataMapTestExecutor class](data-map-test-executor-class-definition.md)
