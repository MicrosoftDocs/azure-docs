---
title: Logic Apps Standard Automated Test Framework SDK
description: An overview of the classes in the Logic Apps Automated Test Framework SDK
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 05/26/2025
---

# Logic Apps Standard Automated Test Framework Overview

When you create a unit tests using the Automated Test Framework for Logic Apps Standard, your test methods and classes uses an SDK to define mocks for actions and triggers and to access execution results for assertion. This reference provides an overview of this SDK and what classes are available for you to implement your own test scenarios.

## List of classes available

The classes below are part of the `Microsoft.Azure.Workflows.UnitTesting.Definitions` namespace and are used to implement Logic Apps Standard test scenarios.

| Class | Description |
|-------|-------------|
| [ActionMock](action-mock-class-definition.md) | Creates a mocked instance of an action in a workflow |
| [TriggerMock](trigger-mock-class-definition.md) | Creates a mocked instance of a trigger in a workflow |
| [TestExecutionContext](TestExecutionContext-document.md) | Represents the execution context for a unit test |
| [TestActionExecutionContext](TestActionExecutionContext-document.md) | Represents the execution context for a unit test action |
| [TestIterationItem](TestIterationItem-document.md) | Represents an iteration item for unit test execution context |
| [TestWorkflowRun](TestWorkflowRun-document.md) | Represents flow run properties for a workflow test |




## Related content

* [Create unit tests from Standard workflow definitions in Azure Logic Apps with Visual Studio Code](create-unit-tests-Standard-workflow-definitions-visual-studio-code.md)
* [Create unit tests from Standard workflow runs in Azure Logic Apps with Visual Studio Code](create-unit-tests-standard-workflow-runs-visual-studio-code.md)


