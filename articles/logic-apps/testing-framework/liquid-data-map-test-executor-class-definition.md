---
title: LiquidDataMapTestExecutor class
titleSuffix: Azure Logic Apps
description: Executes liquid data map transformations for unit testing Azure Logic Apps workflows with support for schema validation.
author: wsilveiranz
ms.author: wsilveira
ms.reviewers: estfan, azla
ms.topic: reference
ms.date: 06/05/2026
---

# LiquidDataMapTestExecutor class

**Namespace**: Microsoft.Azure.Workflows.UnitTesting

The `LiquidDataMapTestExecutor` class provides the capability to execute Liquid data map transformations during unit testing. The instance locates a Liquid map file by name within the logic app project directory named `Artifacts/Maps` and runs the transformation against provided input content, with optional schema validation of the output.

## Usage

```csharp
var executor = new LiquidDataMapTestExecutor(appDirectoryPath: @"C:\MyLogicApp");

JToken result = await executor.RunLiquidMapAsync(
    mapName: "TransformOrder",
    transformKind: TestLiquidTransformKind.JsonToJson,
    inputContent: JToken.Parse("{\"orderId\": 123}"));
```

## Constructors

### LiquidDataMapTestExecutor(string appDirectoryPath)

Initializes a new instance of the `LiquidDataMapTestExecutor` class with the specified logic app project root path.

```csharp
public LiquidDataMapTestExecutor(string appDirectoryPath)
```

|Name|Description|Type|Required|
|---|---|---|---|
|appDirectoryPath|The logic app project root path where the Artifacts/Maps directory is located.|`string`|Yes|

```csharp
var executor = new LiquidDataMapTestExecutor(appDirectoryPath: @"C:\MyLogicApp");
```

## Methods

### RunLiquidMapAsync

Executes a Liquid map transformation using the specified map name, transform kind, and input content. Optionally validates the transformed content against a JSON schema. Throws `ArgumentException` if the map file does not exist.

```csharp
public async Task<JToken> RunLiquidMapAsync(string mapName, TestLiquidTransformKind transformKind, JToken inputContent, JSchema transformedContentSchema = null)
```

|Name|Description|Type|Required|
|---|---|---|---|
|mapName|The name of the Liquid data map file (without the `.liquid` extension).|`string`|Yes|
|transformKind|The kind of Liquid transformation to perform.|[TestLiquidTransformKind](test-liquid-transform-kind-enum-definition.md)|Yes|
|inputContent|The input content to be transformed.|`JToken`|Yes|
|transformedContentSchema|An optional JSON schema to validate the transformed content.|`JSchema`|No|

```csharp
var executor = new LiquidDataMapTestExecutor(appDirectoryPath: @"C:\MyLogicApp");

// Execute a JSON-to-JSON Liquid transformation with schema validation
var schema = JSchema.Parse("{\"type\": \"object\", \"properties\": {\"total\": {\"type\": \"number\"}}}");
JToken result = await executor.RunLiquidMapAsync(
    mapName: "CalculateTotal",
    transformKind: TestLiquidTransformKind.JsonToJson,
    inputContent: JToken.Parse("{\"items\": [{\"price\": 10}, {\"price\": 20}]}"),
    transformedContentSchema: schema);
```

## Related content

- [TestLiquidTransformKind enum](test-liquid-transform-kind-enum-definition.md)
