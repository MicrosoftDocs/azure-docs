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


Lifecycle Workflows allow you to create workflows that can be triggered based on joiner, mover, or leaver scenarios. While Lifecycle Workflows provide several built-in tasks to automate common scenarios throughout the lifecycle of users, eventually you may reach the limits of these built-in tasks. With the extensibility feature, you'll be able to utilize the concept of custom task extensions to call-out to external systems as part of a Lifecycle workflow. By calling out to the external systems, you're able to accomplish things which can extend the purpose of your workflows. When a user joins your organization you can have a workflow with a custom task extension that assigns a Teams number, or have a separate workflow that grants access to an email account for a manager when a user leaves. With the extensibility feature, Lifecycle workflows currently support creating custom tasks extensions to call-out to [Azure Logic Apps](/azure/logic-apps/logic-apps-overview).


## Custom task extension deployment scenarios

When creating custom task extensions, the scenarios for how it will interact with Lifecycle Workflows can be one of three ways:

- Fire-and-forget scenario- The Logic App is started, and the sequential task execution immediately continues with no response expected from the Logic App. This scenario is best suited if the Lifecycle workflow doesn't require any feedback (including status) from the Logic App. With this scenario, as long as the workflow is started successfully the workflow status will show as a success and parameters such as ContinueOnError won't come into focus.
- Sequential task execution waiting for response from the Logic App- The Logic app is started, and the sequential task execution waits on the response from the Logic App. If no response is received within a customer defined timeout window the task will be considered failed, and the parameter ContinueOnError will decide how the workflow proceeds. The Logic Apps response is limited to an operation status, which can either be Completed or Failed to indicate the result of the Logic App run.
- Sequential task execution waiting for the response of a 3rd party system- The Logic app is started, and the sequential task execution waits on the response from a 3rd party system that triggers the Logic App to tell the Custom Task extension whether or not it ran successfully. This response, then follows the sequential task execution with Logic App flow in that if the 3rd party system tells of a successful run, then the parameter ContinueOnError will decide how the workflow continues.

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

## Prerequisite Logic App roles required for integration with the custom task extension

When linking your Azure Logic App with the custom task extension task, there are certain permissions that must be completed before the link can be established. 

The roles on the Azure Logic app which allows it to be compatible with the custom task extension are as follows:

- **Logic App contributor**
- **Contributor**
- **Owner**

> [!NOTE]
> The **Logic App Operator** role alone will not make a Logic App compatible with the custom task extension. For more information on the required **Logic App contributor** role, see: [Logic App Contributor](/azure/role-based-access-control/built-in-roles#logic-app-contributor).


## Parameters required for the custom task extension

When creating the custom task extension, there are certain parameters that must be completed in order for it to be created and linked to the Logic App.

The basic parameters of the custom task extension are:



|Parameter  |Description  |
|---------|---------|
|displayName     |  A unique string that identifies the custom task extension.       |
|description     |  A string that describes the purpose of the custom task extension for administrative use. (Optional)       |


Within the custom task extension are arguments whose inclusion depends on the type of custom task extension you are running. For example, the following argument **callbackConfiguration** isn't required if the custom task extension does not require a reply for the workflow to continue (fire and forget).

The parameters for the **callbackConfiguration** argument is:


|Parameter  |Description  |
|---------|---------|
|durationBeforeTimeout     | A string parameter that accepts ISO 8601 time duration. Accepted time durations are between 5 min-3 hours. The accepted format is PT followed by an integer and M for minute or H for hour. Examples of these include: PT5M for 5 Minutes and PT3H for 3 Hours.        |

The next argument for the custom task extension is **endpointConfiguration**. This argument always exists and includes information about the Logic App such as its name, the subscription, and resource group where it is located.

The parameters for the **endpointConfiguration** argument is:


|Parameter  |Description  |
|---------|---------|
|subscriptionId     | A string that is your Azure Subscription ID.        |
|resourceGroupName     | A string that is the resource name of the resource group where your Logic App is located.        |
|logicAppWorkflowName     | A string that matches the name of the Logic App being triggered by the custom task extension.        |


The next argument for the custom task extension is **authenticationConfiguration**. This argument contains information for authenticating the Logic App. This argument always exists and includes the Logic App resource ID.

The parameter for the **authenticationConfiguration** argument is:

|Parameter  |Description  |
|---------|---------|
|resourceId     | A string that is the application ID of your Logic Apps Managed Identity.       |


The final argument in the custom task extension is **clientConfiguration**. This includes how long should the custom task extension wait for a response before it times out, and how many times an error will retry. 

the parameters for the **clientConfiguration** argument are:

|Parameter  |Description  |
|---------|---------|
|timeoutInMilliseconds     | How long it would take for the custom task to timeout while waiting for a response from the Logic App.       |
|maximumRetries     | An int that tells how many times a custom task extension will attempt to retry running.      |



For a complete example of the custom task extension API, see [Linking Lifecycle Workflows with Logic Apps using Microsoft Graph](trigger-custom-task.md#linking-lifecycle-workflows-with-logic-apps-using-microsoft-graph).



## Next steps

- [Trigger Logic Apps based on custom task extensions (Preview)](trigger-custom-task.md)
- [Manage Workflow Versions (Preview)](manage-workflow-tasks.md)


