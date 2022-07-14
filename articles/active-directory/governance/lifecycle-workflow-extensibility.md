---
title: Workflow Extensibility - Azure Active Directory
description: Conceptual article discussing workflow extensibility with Lifecycle Workflows
author: owinfreyATL
ms.author: owinfrey
ms.service: active-directory
ms.workload: identity
ms.topic: conceptual 
ms.date: 07/06/2022
ms.custom: template-concept 
---


# Lifecycle workflow extensibility (Preview)


Lifecycle Workflows allow you to create workflows that can be triggered based on joiner, mover, or leaver scenarios. While Lifecycle Workflows provide several built-in tasks to automate common scenarios throughout the lifecycle of users, eventually you may reach the limits of the built-in tasks. With the extensibility feature, you'll be able to utilize the concept of custom task extensions to call-out to an external system as part of a Lifecycle workflow. By calling out to the external systems, you're able to create custom tasks for workflows. Lifecycle workflows currently support creating custom tasks extensions to call-out to [Azure Logic Apps](/azure/logic-apps/logic-apps-overview).


## Custom App deployment scenarios with Lifecycle Workflows

When creating a custom task via the custom task extension, the scenarios for how it will interact with Lifecycle Workflows can be one of two ways:

- Fire-and-forget scenario- The Logic App is started, and the sequential task execution immediately continues with no response expected from the Logic App. This scenario is best suited if the Lifecycle workflow doesn't require any feedback (including status) from the Logic App. With this scenario, as long as the workflow is started successfully the workflow status will show as a success and parameters such as ContinueOnError won't come into focus.
- Callback scenario- The Logic app is started, and the sequential task execution waits on the response from the Logic App. If no response is received within a customer defined timeout window the task will be considered failed, and the parameter ContinueOnError will decide how the workflow proceeds. The Logic Apps response is limited to an operation status, which can either be Completed or Failed to indicate the result of the Logic App run.

> [!NOTE]
> Tasks from the callback scenario will not yet time out and require a positive or negative response from the Logic App, we are working on automatically timing out the tasks.

 

## Custom task extension integration with Azure Logic Apps high-level steps

The high-level steps for the Azure Logic Apps integration are as follows:

- **Create a consumption-based Azure Logic App**: A consumption-based Azure Logic App that is used to be called to from the custom task extension.
- **Configure the Azure Logic App so its compatible with Lifecycle workflows**: Configuring the consumption-based Azure Logic App so that it can be used with the custom task extension.
- **Build your custom business logic within your Azure Logic App**: Set up your business logic within the Azure Logic App using Logic App designer.
- **Create a lifecycle workflow customTaskExtension which holds necessary information about the Azure Logic App**: Creating a custom task extension that references the configured Azure Logic App.
- **Update or create a Lifecycle workflow with the “Run a custom task extension” task, referencing your created customTaskExtension**: Adding the newly created custom task extension to a new workflow, or updating the information to an existing workflow.

For a complete guide on these steps, see: [Trigger Logic Apps based on custom task extensions](trigger-custom-task.md).

## Logic App parameters required for integration with the custom task extension

When linking your Azure Logic App with the custom task extension task, there are certain parameters that must be completed before the link can be established. The following parameters must be set in the Logic App authorization policy before linking to a custom task extension:

|Parameter  |Description  |
|---------|---------|
|Trigger     | The HTTP trigger for the logic app that defines the call and starts the call for the Logic App to be launched.        |
|Application ID     |  The universal custom task extension ID ce79fdc4-cd1d-4ea5-8139-e74d7dbe0bb7      |
|Application Managed identity     | The system-assigned managed identity application ID.       |

For a guide on getting this information, see [Configure Logic Apps for LCW use](trigger-custom-task.md#configure-logic-apps-for-lcw-use).

## Parameters required for Custom task extension

When creating the custom task extension, there are certain parameters that must be completed in order for it to be created and linked to the Logic App.

The parameters of the custom extension are:

|Parameter  |Description  |
|---------|---------|
|displayName     | A unique string that identifies the custom task extension.        |
|description     | A string that describes the purpose of the custom task extension for administrative use. (Optional)    |
|timeoutDuration     | A string parameter of the **callbackConfiguration** argument that accepts ISO 8601 time duration. Accepted time durations are between 5 min-3 hours. The accepted format is PT followed by an integer and M for minute or H for hour. Examples of these include: PT5M for 5 Minutes and PT3H for 3 Hours        |
|subscriptionId     | A string that is your Azure Subscription ID.        |
|resourceGroupName     | A string that is the resource name of the resource group where your Logic App is located.        |
|logicAppWorkflowName     | A string that matches the name of the Logic App being triggered by the custom task extension.        |
|resourceId     |  A string that is the application ID of your Logic Apps Managed Identity.        |


Some of the parameters are dependent on what type of custom task extension you're running. For example, the **callbackConfiguration** argument isn't required if your custom task extension is a fire and forget based scenario as the custom task needing a reply wouldn't be required for the workflow to continue.

For an example of the custom task extension API, see [Linking Lifecycle Workflows with Logic Apps using Microsoft Graph](trigger-custom-task.md#linking-lifecycle-workflows-with-logic-apps-using-microsoft-graph).



## Next steps

- [Trigger Logic Apps based on custom task extensions (Preview)](trigger-custom-task.md)
- [Manage Workflow Versions (Preview)](manage-workflow-tasks.md)


