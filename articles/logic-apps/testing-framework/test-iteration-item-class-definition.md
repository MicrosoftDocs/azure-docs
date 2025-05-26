---
title: Test Iteration Item Class Definition
description: Describes the TestIterationItem class that represents an item in an iteration context when testing Logic Apps workflows with looping actions, providing access to current item and index.
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 05/26/2025
---

# TestIterationItem

**Namespace**: Microsoft.Azure.Workflows.UnitTesting.Definitions

The iteration item for unit test execution context.

## Usage

The TestIterationItem class represents an item in an iteration context when testing Logic Apps workflows with looping actions (like For each, Until, etc.). It provides access to the current item, its index, and allows navigation to parent iterations in nested loops.

```C#
// Basic iteration item for a simple array
var simpleItem = new TestIterationItem 
{
    Index = 2,
    Item = JToken.Parse("\"sample value\"")
};

// Iteration item for a complex object in a loop
var complexItem = new TestIterationItem 
{
    Index = 0,
    Item = JToken.Parse(@"{
        ""id"": 123,
        ""name"": ""Product A"",
        ""price"": 29.99,
        ""inStock"": true
    }")
};

// Nested iteration (parent-child relationship)
var parentItem = new TestIterationItem 
{
    Index = 1,
    Item = JToken.Parse(@"{""category"": ""Electronics""}")
};

var childItem = new TestIterationItem 
{
    Index = 3,
    Item = JToken.Parse(@"{""productName"": ""Smartphone""}"),
    Parent = parentItem
};

// Accessing properties from an iteration item
string productName = (string)complexItem.Item["name"];
decimal price = (decimal)complexItem.Item["price"];
```

## Properties

| Name | Description | Type |
|------|-------------|------|
| Index | Gets the index of the iteration item | int |
| Item | Gets the iteration item | JToken |
| Parent | Gets the parent iteration item | TestIterationItem |

## Constructor

This class uses property initialization for construction.

```C#
// Example: Creating a TestIterationItem
var iterationItem = new TestIterationItem 
{
    Index = 0,
    Item = JToken.Parse("{ \"value\": \"test\" }")
};
```

## Related Content

* [Action Mock Class Definition](action-mock-class-definition.md)
* [Trigger Mock Class Definition](trigger-mock-class-definition.md)
* [Test Execution Context Class Definition](test-execution-context-class-definition.md)
* [Test Action Execution Context Class Definition](test-action-execution-context-class-definition.md)
* [Test Workflow Run Class Definition](test-workflow-run-class-definition.md)
