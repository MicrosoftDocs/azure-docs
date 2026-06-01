---
title: DataMapTestExecutor class
description: Learn about the DataMapTestExecutor class in the Azure Logic Apps Unit Testing SDK.
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewers: estfan, azla
ms.topic: reference
ms.date: 12/03/2025
---

# DataMapTestExecutor class

This class provides functionality that compiles, generates XSLT, and executes data map tests for Standard logic app workflows in single-tenant Azure Logic Apps. The class serves as the main entry point for testing data transformations with data maps.

## Namespace

**`Microsoft.Azure.Workflows.UnitTesting`**

## Usage

You can use the **`DataMapTestExecutor`** class to generate XSLT from data map definitions and execute data transformations:

```csharp
using Microsoft.Azure.Workflows.Data.Entities;

// Initialize with app directory path
var executor = new DataMapTestExecutor("path/to/logic-app-project");

// Generate XSLT from map name
var xslt = await executor.GenerateXslt("MyDataMap");

// Generate XSLT from map content
var generateXsltInput = new GenerateXsltInput { MapContent = mapContent };
var xsltContent = await executor.GenerateXslt(generateXsltInput);

// Execute data map transformation by map name
var inputData = System.Text.Encoding.UTF8.GetBytes(xmlInput);
var result = await executor.RunMapAsync("MyDataMap", inputData);

// Execute data map transformation with XSLT content
var result = await executor.RunMapAsync(xsltContent, inputData);
```

## Constructors

### DataMapTestExecutor(string)

Initializes a new instance of the **`DataMapTestExecutor`** class by using the logic app project root path.

#### Parameters

| Name | Type | Description | Required |
|------|------|-------------|----------|
| appDirectoryPath | string | The logic app project root path | Yes |

#### Example

```csharp
var executor = new DataMapTestExecutor("C:\\MyLogicApp");
```

## Properties

### AppDirectoryPath

The logic app project root directory path.

| Property | Type | Description | Required |
|----------|------|-------------|----------|
| AppDirectoryPath | string | The root path of the logic app project | Yes |

## Methods

### GenerateXslt(string)

Compiles a data map and generates XSLT. The operation uses the map name to find the data map.

#### Parameters

| Name | Type | Description | Required |
|------|------|-------------|----------|
| mapName | string | The data map file name without the LML extension | Yes |

#### Returns

**`Task<byte[]>`**: A task representing the asynchronous operation that returns the generated XSLT content as a byte array.

#### Exceptions

- **`ArgumentException`**: Thrown when the data map file doesn't exist in the expected path.

#### Example

```csharp
var executor = new DataMapTestExecutor("C:\\MyLogicApp");
var xslt = await executor.GenerateXslt("OrderToInvoice");
```

> [!NOTE]
>
> This method looks for the data map file in the path: `{appDirectoryPath}\Artifacts\MapDefinitions\{mapName}.lml`

### GenerateXslt(GenerateXsltInput)

Compiles a data map and generates XSLT from the provided map content.

#### Parameters

| Name | Type | Description | Required |
|------|------|-------------|----------|
| generateXsltInput | GenerateXsltInput | The input containing data map content | Yes |

#### Returns

**`Task<byte[]>`**: A task representing the asynchronous operation that returns the generated XSLT content as a byte array.

#### Example

```csharp
var mapContent = await File.ReadAllTextAsync("CustomMap.lml");
var generateXsltInput = new GenerateXsltInput { MapContent = mapContent };
var xslt = await executor.GenerateXslt(generateXsltInput);
```

### RunMapAsync(string, byte[])

Executes a data map by applying the given XSLT to sample input data. The operation uses the map name to find the XSLT.

#### Parameters

| Name | Type | Description | Required |
|------|------|-------------|----------|
| mapName | string | The data map XSLT file name without the extension | Yes |
| inputContent | byte[] | The content to transform | Yes |

#### Returns

**`Task<JToken>`**: A task representing the asynchronous operation that returns the transformed output as a JSON token.

#### Example

```csharp
var xmlInput = "<Order><Item>Widget</Item></Order>";
var inputData = System.Text.Encoding.UTF8.GetBytes(xmlInput);
var result = await executor.RunMapAsync("OrderToInvoice", inputData);
Console.WriteLine(result.ToString());
```

> [!NOTE]
>
> This method looks for the XSLT file in the path: `{appDirectoryPath}\Artifacts\Maps\{mapName}.xslt`

### RunMapAsync(byte[], byte[])

Executes a data map by applying the given XSLT content to sample input data.

#### Parameters

| Name | Type | Description | Required |
|------|------|-------------|----------|
| xsltContent | byte[] | The data map XSLT content | Yes |
| inputContent | byte[] | The input content to be transformed | Yes |

#### Returns

**`Task<JToken>`**: A task representing the asynchronous operation that returns the transformed output as a JSON token.

#### Example

```csharp
// First generate XSLT
var xslt = await executor.GenerateXslt("OrderToInvoice");

// Then execute transformation
var xmlInput = "<Order><Item>Widget</Item></Order>";
var inputData = System.Text.Encoding.UTF8.GetBytes(xmlInput
var result = await executor.RunMapAsync(xslt, inputData);
Console.WriteLine(result.ToString());
```

## Related content

- [UnitTestExecutor Class Definition](unit-test-executor-class-definition.md)
- [ActionMock Class Definition](action-mock-class-definition.md)
- [TriggerMock Class Definition](trigger-mock-class-definition.md)
- [TestWorkflowRun Class Definition](test-workflow-run-class-definition.md)
