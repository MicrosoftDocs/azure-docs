---
title: Create Unit Tests from Standard Workflows with Visual Studio Code
description: Create unit tests from Standard workflow definitions in Azure Logic Apps by using Visual Studio Code.
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.author: wsilveira
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 06/09/2025
# Customer intent: As logic app developer, I want to learn how to create a unit test that mocks the operations and outputs from a Standard workflow definition in Azure Logic Apps with Visual Studio Code. 
---

# Create unit tests from Standard workflow definitions in Azure Logic Apps with Visual Studio Code

[!INCLUDE [logic-apps-sku-standard](../../../includes/logic-apps-sku-standard.md)]

Unit testing is an essential practice that keeps your app or solution reliable and accurate throughout the software development lifecycle. Unit tests help you efficiently and systematically validate the key components in your solution.

For Standard logic app workflows, you can create unit tests by using Visual Studio Code and the Azure Logic Apps (Standard) extension. This capability lets you use workflow definitions to create unit tests and tailor them to scenarios supported by your logic app solution - all without needing connections to any external services, systems, or APIs. This approach lets you test your workflows without having to interact with external services, systems, or APIs and provides the following benefits:

- Improve workflow quality by identifying and addressing potential issues before you deploy to other environments.

- Streamline unit test integration with your development process, while ensuring consistent and accurate workflow behavior.

This guide shows how to create a unit test definition from a workflow. This definition mocks the external calls from each workflow operation without changing the workflow logic. When you create a unit test for a workflow, you get a unit test project that includes the following folders:

- A folder that contains strongly typed classes for each mockable operation in your workflow.

- A folder for each unit test definition. This folder includes a C# file that contains a sample class and methods. You use this class and methods to set up your own assertions, confirm that the workflow behaves as expected, and make sure that the workflow behaves reliably and predictably in your larger Azure ecosystem.

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A Standard logic app project in Visual Studio Code that contains at least one workflow definition to use for creating a unit test.

  For more information about Visual Studio Code setup and project creation, see [Create Standard logic app workflows with Visual Studio Code](/azure/logic-apps/create-standard-workflows-visual-studio-code).

## Limitations and known issues

- This release currently supports only C# for creating unit tests.

- This release doesn't support non-mocked actions. Make sure that all actions in the workflow execution path are mocked.

- This release doesn't support the following action types:

  - Integration account actions
  - EDI encode and decode actions

## Review the basic concepts

The following list includes basic but important concepts about unit tests for Standard workflows:

- **Logic app unit test**

  A controlled workflow execution that injects mock objects. These objects represent either the workflow trigger or actions that depend on external services or systems.

- **Mockable action**

  A workflow action that depends on an external service or system. You can convert these actions to mocked actions for unit test creation and execution.

## Create a unit test from a workflow definition

1. In Visual Studio Code, open your Standard logic app project.

1. In your project, expand the workflow definition folder.

1. From the shortcut menu for the **workflow.json** file, select **Open Designer**.

1. On the designer toolbar, select **Create unit test**.

   :::image type="content" source="media/create-unit-tests-standard-workflow-definitions-visual-studio-code/designer.png" alt-text="Screenshot shows Visual Studio Code, Standard logic app project, workflow designer, and selected command to create unit test." lightbox="media/create-unit-tests-standard-workflow-definitions-visual-studio-code/designer.png":::

1. Provide a name to use for the unit test, unit test class, and C# file.

    A new folder named **Tests** now appears in your project workspace. This folder has the following structure:

    :::image type="content" source="media/create-unit-tests-standard-workflow-definitions-visual-studio-code/unit-test-project-structure.png" alt-text="Screenshot shows Visual Studio Code, Standard logic app project, and Tests folder with unit test folders and files." lightbox="media/create-unit-tests-standard-workflow-definitions-visual-studio-code/unit-test-project-structure.png":::

   | Folder or file | Description |
   |----------------|-------------|
   | **`Tests`** <br>**\|\| <`logic-app-name`>** | In the **`Tests`** folder, a **<`logic-app-name`>** folder appears when you add unit tests to a logic app project. |
   | **`Tests`** <br>**\|\| <`logic-app-name`>** <br>**\|\|\| <`workflow-name`>** | In the **<`logic-app-name`>** folder, a **<`workflow-name`>** folder appears when you add unit tests for a workflow. |
   | **`Tests`** <br>**\|\| <`logic-app-name`>** <br>**\|\|\| <`workflow-name`>** <br>**\|\|\|\| `MockOutputs`** <br>**\|\|\|\|\| <`operation-name-outputs`>**.**`cs`** | In the **<`workflow-name`>** folder, the **`MockOutputs`** folder contains a C# (**.cs**) file with strongly typed classes for each connector operation in the workflow. Each **.cs** file name uses the following format: <br><br>**<`operation-name`>[`Trigger\|Action`]`Output.cs`** <br><br>If a connector operation has *dynamic contracts*, a class appears for each *dynamic type*. A dynamic type refers to an operation parameter that has different inputs and outputs based on the value provided for that parameter. You can use these classes to extend your unit tests and create new mocks from scratch. |
   | **`Tests`** <br>**\|\| <`logic-app-name`>** <br>**\|\|\| <`workflow-name`>** <br>**\|\|\|\| <`unit-test-name`>** <br>**\|\|\|\|\| <`unit-test-name`>`.cs`** | In the **<`workflow-name`>** folder, the **<`unit-test-name`>** folder contains a **<`unit-test-name`>`.cs`** file. You use this file, which contains a sample C# class and methods, to run and assert results. You can edit this file to match your specific test scenarios. |

## Review the unit test *.cs file

This unit test class provides a framework for testing Standard logic app workflows by mocking triggers and actions. This class lets you test workflows without actually calling external services or APIs.

### Test class structure

A typical unit test class uses the following structure:

```csharp
[TestClass]
public class <unit-test-name>
{
    public TestExecutor TestExecutor;

    [TestInitialize]
    public void Setup()
    {
        this.TestExecutor = new TestExecutor("<workflow-name>/testSettings.config");
    }

    // Add test methods here.

    // Add helper methods here.
}
```

#### Setup() method

This method instantiates the **`TestExecutor`** class by using the path to your test settings configuration file. The method runs before each test execution and creates a new instance of **`TestExecutor`**.

```csharp
[TestInitialize]
public void Setup()
{
    this.TestExecutor = new TestExecutor("<workflow-name>/testSettings.config");
}
```

### Sample test methods

The following section describes sample test methods that you can use in your unit test class.

#### Static mock data test

The following method shows how to use static mock data to test your workflow. In this method, you can complete the following tasks:

- Set property values on your mocked actions.
- Execute the workflow with the configured mock data.
- Confirm that the execution succeeded.

```csharp
[TestMethod]
public async Task <workflow-name>_<unit-test-name>_ExecuteWorkflow_SUCCESS_Sample1()
{
    // PREPARE mock: Generate mock trigger data.
    var triggerMockOutput = new WhenMessagesAreAvailableInAQueuePeeklockTriggerOutput();
    // Sample that shows how to set the properties for triggerMockOutput
    // triggerMockOutput.Body.Id = "SampleId";
    var triggerMock = new WhenMessagesAreAvailableInAQueuePeeklockTriggerMock(outputs: triggerMockOutput);

    // Generate mock action data.
    var actionMockOutput = new CallExternalAPIActionOutput();
    // Sample that shows how to set the properties for actionMockOutput
    // actionMockOutput.Body.Name = "SampleResource";
    // actionMockOutput.Body.Id = "SampleId";
    var actionMock = new CallExternalAPIActionMock(name: "Call_External_API", outputs: actionMockOutput);

    // ACT: Create the UnitTestExecutor instance. Run the workflow with mock data.
    var testMock = new TestMockDefinition(
        triggerMock: triggerMock,
        actionMocks: new Dictionary<string, ActionMock>()
        {
            {actionMock.Name, actionMock}
        });
    var testRun = await this.TestExecutor
        .Create()
        .RunWorkflowAsync(testMock: testMock).ConfigureAwait(continueOnCapturedContext: false);

    // ASSERT: Confirm successful workflow execution and that the status is 'Succeeded'.
    Assert.IsNotNull(value: testRun);
    Assert.AreEqual(expected: TestWorkflowStatus.Succeeded, actual: te
    stRun.Status);
}
```

#### Dynamic mock data test

The following method shows how to use dynamic mock data with callback methods. This approach gives you two options that dynamically generate mock data:

- Define a separate callback method.
- Use an [inline lambda function](/dotnet/csharp/language-reference/operators/lambda-expressions).

Both approaches let you create dynamic responses based on unit test execution context.

```csharp
[TestMethod]
public async Task <workflow-name>_<unit-test-name>_ExecuteWorkflow_SUCCESS_Sample2()
{
    // PREPARE: Generate mock trigger data.
    var triggerMockOutput = new WhenMessagesAreAvailableInAQueuePeeklockTriggerOutput();
    // Sample that shows how to set triggerMockOutput properties.
    // triggerMockOutput.Body.Flag = true;
    var triggerMock = new WhenMessagesAreAvailableInAQueuePeeklockTriggerMock(outputs: triggerMockOutput);

    // PREPARE: Generate mock action data.
    // OPTION 1: Define a callback class.
    var actionMock = new CallExternalAPIActionMock(name: "Call_External_API", onGetActionMock: CallExternalAPIActionMockOutputCallback);

    // OPTION 2: Define inline with a lambda function.
    /*var actionMock = new CallExternalAPIActionMock(name: "Call_External_API", onGetActionMock: (testExecutionContext) =>
    {
        return new CallExternalAPIActionMock(
            status: TestWorkflowStatus.Succeeded,
            outputs: new CallExternalAPIActionOutput {

                // If this account contains a JObject Body,
                // set the properties you want here:
                // Body = "something".ToJObject()

            }
        );
    });*/

    // ACT: Create the UnitTestExecutor instance. Run the workflow with mock data.
    var testMock = new TestMockDefinition(
        triggerMock: triggerMock,
        actionMocks: new Dictionary<string, ActionMock>()
        {
            {actionMock.Name, actionMock}
        });
    var testRun = await this.TestExecutor
        .Create()
        .RunWorkflowAsync(testMock: testMock).ConfigureAwait(continueOnCapturedContext: false);

    // ASSERT: Confirm successful workflow execution and that the status is 'Succeeded'.
    Assert.IsNotNull(value: testRun);
    Assert.AreEqual(expected: TestWorkflowStatus.Succeeded, actual: testRun.Status);
}
```

### Helper methods

The following section describes methods used by the sample test methods. Helper methods appear under the test methods in the class definition.

#### Callback method

The following method dynamically generates mock data. The method name varies based on the mocked action name in the test methods for static or dynamic mock data. You can edit this method to return different mock responses based on your test scenario requirements or use it as a template to create your own dynamic callback methods.

```csharp
public CallExternalAPIActionMock CallExternalAPIActionMockOutputCallback(TestExecutionContext context)
{
    // Sample mock data: Dynamically change the mocked data for 'actionName'.
    return new CallExternalAPIActionMock(
        status: TestWorkflowStatus.Succeeded,
        outputs: new CallExternalAPIActionOutput {

            // If this account contains a JObject Body, 
            // set the properties you want here:
            // Body = "something".ToJObject()

        }
    );
}
```

## Related content

* [Create unit tests from Standard workflow runs in Azure Logic Apps with Visual Studio Code](create-unit-tests-standard-workflow-runs-visual-studio-code.md)
