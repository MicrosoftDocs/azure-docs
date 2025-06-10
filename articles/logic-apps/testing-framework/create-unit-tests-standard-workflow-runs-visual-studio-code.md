---
title: Create Unit Tests from Standard Workflow Runs with Visual Studio Code
description: Create unit tests from previously run Standard workflows in Azure Logic Apps by using Visual Studio Code.
services: logic-apps
ms.suite: integration
author: wsilveiranz
ms.author: wsilveira
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 06/09/2025

---

# Create unit tests from Standard workflow runs in Azure Logic Apps with Visual Studio Code

[!INCLUDE [logic-apps-sku-standard](../../../includes/logic-apps-sku-standard.md)]

Unit testing is an essential practice that keeps your app or solution reliable and accurate throughout the software development lifecycle. Unit tests help you efficiently and systematically validate the key components in your solution.

For Standard logic app workflows, you can create unit tests by using Visual Studio Code and the Azure Logic Apps (Standard) extension. This capability lets you use previously executed workflow runs to create unit tests and tailor them to scenarios supported by your logic app solution. This approach provides the following benefits:

- Reuse workflow runs to generate mock data for specific operations in the workflow.

  This data lets you test workflows without having to call external services, systems, or APIs. You save time, and your workflow stays aligned with the actual workflow execution scenario.

- Improve workflow quality by identifying and addressing potential issues before you deploy to other environments.

- Streamline unit test integration with your development process, while ensuring consistent and accurate workflow behavior.

This guide shows how to create a unit test definition from a workflow run. This definition mocks the external calls from each workflow operation without changing the workflow logic. When you create a unit test from a workflow run, you get a unit test project that includes two folders:

- A folder that contains strongly-typed classes for each mockable operation in your workflow.

- A folder for each unit test definition, which includes the following files:

  - A JSON file that represents the generated mocked operations in your workflow.

  - A C# file that contains a sample class and methods that you use to set up your own assertions, confirm that the workflow behaves as expected, and make sure that the workflow behaves reliably and predictably in your larger Azure ecosystem.

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A Standard logic app project in Visual Studio Code that contains at least one previously and locally executed workflow to use for creating a unit test.

  For more information about Visual Studio Code setup and project creation, see [Create Standard logic app workflows with Visual Studio Code](/azure/logic-apps/create-standard-workflows-visual-studio-code).

### Limitations and known issues

- This release currently supports only C# for creating unit tests.

- This release doesn't support non-mocked actions. Make sure that all actions in the workflow execution path are mocked.

- This release doesn't support the following action types:

  - Integration account actions
  - Data Mapper actions
  - Custom code actions
  - XML actions
  - Liquid actions
  - EDI encode and decode actions

## Review the basic concepts

The following list includes basic but important concepts about unit tests for Standard workflows:

- **Logic app unit test**

  A controlled workflow execution that injects mock objects. These objects represent either the workflow trigger or actions that depend on external services or systems.

- **Mockable action**

  A workflow action that depends on an external service or system. You can convert these actions to mocked actions for unit test creation and execution.

## Create a unit test from a workflow run

1. In Visual Studio Code, open your Standard logic app project.

1. On the Visual Studio Code toolbar, from the **Run** menu, select **Start Debugging**. (Keyboard: Press F5)

1. Return to the **Explorer** window. In your project, expand the workflow definition folder.

1. Open the **workflow.json** shortcut menu, and select **Overview**.

1. On the overview page, under **Run history**, select the workflow run to use for creating a unit test.

   :::image type="content" source="media/create-unit-tests-standard-workflow-runs-visual-studio-code/overview-page.png" alt-text="Screenshot shows Visual Studio Code with Standard logic app project, debug mode running, opened workflow overview page, and selected workflow run." lightbox="media/create-unit-tests-standard-workflow-runs-visual-studio-code/overview-page.png":::

1. On the run history toolbar, select **Create unit test from run**.

   :::image type="content" source="media/create-unit-tests-standard-workflow-runs-visual-studio-code/run-history-page.png" alt-text="Screenshot shows Visual Studio Code, Standard workflow run history page, and selected command to creat unit test." lightbox="media/create-unit-tests-standard-workflow-runs-visual-studio-code/run-history-page.png":::

1. Provide a name to use for the unit test, unit test class, and C# file.

   In the **Explorer** window, a new project folder named **Tests** appears under your logic app project folder. The **Tests** folder contains the following folders and files:

   :::image type="content" source="media/create-unit-tests-standard-workflow-runs-visual-studio-code/unit-test-project-structure.png" alt-text="Screenshot shows Visual Studio Code, Standard logic app project, and Tests folder with unit test folders and files." lightbox="media/create-unit-tests-standard-workflow-runs-visual-studio-code/unit-test-project-structure.png":::

   | Folder or file | Description |
   |----------------|-------------|
   | **`Tests`** <br>**\|\| <`logic-app-name`>** | In the **`Tests`** folder, a **<`logic-app-name`>** folder appears when you add unit tests to a logic app project.|
   | **`Tests`** <br>**\|\| <`logic-app-name`>** <br>**\|\|\| <`workflow-name`>** | In the **<`logic-app-name`>** folder, a **<`workflow-name`>** folder appears when you add unit tests for a workflow. |
   | **`Tests`** <br>**\|\| <`logic-app-name`>** <br>**\|\|\| <`workflow-name`>** <br>**\|\|\|\| `MockOutputs`** <br>**\|\|\|\|\| <`operation-name-outputs`>**.**`cs`** | In the **<`workflow-name`>** folder, the **`MockOutputs`** folder contains a C# (**.cs**) file with strongly-typed classes for each connector operation in the workflow. Each **.cs** file name uses the following format: <br><br>**<`operation-name`>[`Trigger\|Action`]`Output.cs`** <br><br>If a connector operation has *dynamic contracts*, a class appears for each *dynamic type*. A dynamic type refers to an operation parameter that has different inputs and outputs based on the value provided for that parameter. You can use these classes to extend your unit tests and create new mocks from scratch. |
   | **`Tests`** <br>**\|\| <`logic-app-name`>** <br>**\|\|\| <`workflow-name`>** <br>**\|\|\|\| <`unit-test-name`>** <br>**\|\|\|\|\| <`unit-test-name`>`-mock.json`** <br>**\|\|\|\|\| <`unit-test-name`>`.cs`** | In the **<`workflow-name`>** folder, the **<`unit-test-name`>** folder contains the following files: <br><br>- The **<`unit-test-name`>`-mock.json`** file contains a JSON representation for the generated mocks, based on the workflow run that created the unit test. <br><br>- The **<`unit-test-name`>`.cs`** file contains a sample C# class and methods that use the **`*-mock.json`** file to run and assert results. You can edit this file to match your specific test scenarios. |

## Review the *-mock.json file

This file has the following main sections:

### `triggerMocks` section

The **`triggerMocks`** section contains the mocked result from the workflow trigger. This section is required to start workflow execution as shown in the following example:

```json
{
    "triggerMocks": {
        "When_messages_are_available_in_a_queue_(peek-lock)": {
            "name": "When_messages_are_available_in_a_queue_(peek-lock)",
            "status": "Succeeded",
            "outputs": {
                "body": {
                    "contentData": {
                        "messageId": "1234",
                        "status": "new",
                        "contentType": "application/json",
                        "userProperties": {},
                        "scheduledEnqueueTimeUtc": "1/1/0001 12:00:00 AM",
                        "timeToLive": "14.00:00:00",
                        "deliveryCount": 1,
                        "enqueuedSequenceNumber": 0,
                        "enqueuedTimeUtc": "2025-04-07T01:10:09.738Z",
                        "lockedUntilUtc": "2025-04-07T01:11:09.769Z",
                        "lockToken": "78232fa8-03cf-4baf-b1db-3375a64e0ced",
                        "sequenceNumber": 5
                    }
                }
            }
        }
    },
    "actionMocks": {...}
}
```

### `actionMocks` section

For each mockable action in a workflow run, the **`actionMocks`** section contains a mocked action and guarantees the controlled execution of the workflow.


```json
{
    "triggerMocks": {...},
    "actionMocks": {
        "Call_External_API": {
            "name": "Call_External_API",
            "status": "Succeeded",
            "outputs": {
                "statusCode": 200,
                "body": {
                    "status": "Awesome!"
                }
            }
        },
        "CompleteMessage": {
            "name": "CompleteMessage",
            "status": "Succeeded",
            "outputs": {
                "statusCode": "OK",
                "body": {}
            }
        }
    }
}
```

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
    // PREPARE mock: Generate mock action and trigger data.
    var mockData = this.GetTestMockDefinition();
    var sampleActionMock = mockData.ActionMocks["Call_External_API"];
    sampleActionMock.Outputs["your-property-name"] = "your-property-value";

    // ACT: Create the UnitTestExecutor instance. Run the workflow with mock data.
    var testRun = await this.TestExecutor
        .Create()
        .RunWorkflowAsync(testMock: mockData).ConfigureAwait(continueOnCapturedContext: false);

    // ASSERT: Confirm successful workflow execution and that the status is 'Succeeded'.
    Assert.IsNotNull(value: testRun);
    Assert.AreEqual(expected: TestWorkflowStatus.Succeeded, actual: testRun.Status);
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
    // PREPARE: Generate mock action and trigger data.
    var mockData = this.GetTestMockDefinition();
    
    // OPTION 1: Define a callback class.
    mockData.ActionMocks["Call_External_API"] = new CallExternalAPIActionMock(
        name: "Call_External_API", 
        onGetActionMock: CallExternalAPIActionMockOutputCallback);

    // OPTION 2: Define an inline lambda function.
    mockData.ActionMocks["Call_External_API"] = new CallExternalAPIActionMock(
        name: "Call_External_API", 
        onGetActionMock: (testExecutionContext) =>
        {
            return new CallExternalAPIActionMock(
                status: TestWorkflowStatus.Succeeded,
                outputs: new CallExternalAPIActionOutput {

                    // If this account contains a JObject Body, 
                    // set the properties you want here:
                    // Body = "something".ToJObject()

                }
            );
        });
        
    // ACT: Create UnitTestExecutor instance. Run the workflow with mock data.
    var testRun = await this.TestExecutor
        .Create()
        .RunWorkflowAsync(testMock: mockData).ConfigureAwait(continueOnCapturedContext: false);

    // ASSERT: Confirm successful workflow execution and that the status is 'Succeeded'.
    Assert.IsNotNull(value: testRun);
    Assert.AreEqual(expected: TestWorkflowStatus.Succeeded, actual: testRun.Status);
}
```

#### Error scenario test

The following method shows how to test failure conditions. In this method, you can complete the following tasks:

- Configure mocked actions to fail with specific error codes and messages.
- Confirm that the workflow handles these error conditions correctly.

```csharp
[TestMethod]
public async Task <workflow-name>_<unit-test-name>_ExecuteWorkflow_FAILED_Sample3()
{
    // PREPARE: Generate mock action and trigger data.
    var mockData = this.GetTestMockDefinition();
    var mockError = new TestErrorInfo(code: ErrorResponseCode.BadRequest, message: "Input is invalid.");
    mockData.ActionMocks["Call_External_API"] = new CallExternalAPIActionMock(
        status: TestWorkflowStatus.Failed, 
        error: mockError);

    // ACT: Create UnitTestExecutor instance. Run the workflow with mock data.
    var testRun = await this.TestExecutor
        .Create()
        .RunWorkflowAsync(testMock: mockData).ConfigureAwait(continueOnCapturedContext: false);

    // ASSERT: Confirm successful workflow execution and that the status is 'Succeeded'.
    Assert.IsNotNull(value: testRun);
    Assert.AreEqual(expected: TestWorkflowStatus.Failed, actual: testRun.Status);
}
```

### Helper methods

The following section describes methods used by the sample test methods. Helper methods appear under the test methods in the class definition.

#### GetTestMockDefinition()

The following method loads the mock definition from a JSON file. You can edit this method if your mock data is stored in a different location or format.

```csharp
private TestMockDefinition GetTestMockDefinition()
{
    var mockDataPath = Path.Combine(TestExecutor.rootDirectory, "Tests", TestExecutor.logicAppName, 
        TestExecutor.workflow, "<unit-test-name>", "<unit-test-name>-mock.json");
    return JsonConvert.DeserializeObject<TestMockDefinition>(File.ReadAllText(mockDataPath));
}
```

#### Callback method

The following method dynamically generates mock data. The method name varies based on the mocked action name in the test methods for static or dynamic mock data. You can edit this method to return different mock responses based on your test scenario requirements or use it as a template to create your own dynamic callback methods.

```csharp
public CallExternalAPIActionMock CallExternalAPIActionMockOutputCallback(TestExecutionContext context)
{
    // Sample mock data: Dynamically change the mocked data for "actionName".
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

* [Create unit tests from Standard workflow definitions in Azure Logic Apps with Visual Studio Code](create-unit-tests-Standard-workflow-definitions-visual-studio-code.md)

