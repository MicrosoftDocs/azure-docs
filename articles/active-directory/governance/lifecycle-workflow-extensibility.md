---
title: Workflow Extensibility - Azure Active Directory
description: Conceptual article discussing workflow extensibility with Lifecycle Workflows
author: owinfreyATL
ms.author: owinfrey
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: conceptual 
ms.date: 07/06/2022
ms.custom: template-concept 
---


# Lifecycle Workflows Custom Task Extension (Preview)


Lifecycle Workflows allow you to create workflows that can be triggered based on joiner, mover, or leaver scenarios. While Lifecycle Workflows provide several built-in tasks to automate common scenarios throughout the lifecycle of users, eventually you may reach the limits of these built-in tasks. With the extensibility feature, you'll be able to utilize the concept of custom task extensions to call-out to external systems as part of a workflow. By calling out to the external systems, you're able to accomplish things, which can extend the purpose of your workflows. When a user joins your organization you can have a workflow with a custom task extension that assigns a Teams number, or have a separate workflow that grants access to an email account for a manager when a user leaves. With the extensibility feature, Lifecycle Workflows currently support creating custom tasks extensions to call-out to [Azure Logic Apps](../../logic-apps/logic-apps-overview.md).


## Prerequisite Logic App roles required for integration with the custom task extension

When linking your Azure Logic App with the custom task extension task, there are certain permissions that must be completed before the link can be established. 

The roles on the Azure Logic App, which allows it to be compatible with the custom task extension, are as follows:

- **Logic App contributor**
- **Contributor**
- **Owner**

> [!NOTE]
> The **Logic App Operator** role alone will not make an Azure Logic App compatible with the custom task extension. For more information on the required **Logic App contributor** role, see: [Logic App Contributor](../../role-based-access-control/built-in-roles.md#logic-app-contributor).

## Custom task extension deployment scenarios

When creating custom task extensions, the scenarios for how it will interact with Lifecycle Workflows can be one of two ways:

 :::image type="content" source="media/lifecycle-workflow-extensibility/task-extension-deployment-scenarios.png" alt-text="Screenshot of custom task deployment scenarios.":::

- **Launch and complete**- The Azure Logic App is started, and the following task execution immediately continues with no response expected from the Azure Logic App. This scenario is best suited if the Lifecycle workflow doesn't require any feedback (including status) from the Azure Logic App. With this scenario, as long as the workflow is started successfully, the workflow is viewed as a success.
- **Launch and wait**- The Azure Logic App is started, and the following task's execution waits on the response from the Logic App. You enter a time duration for how long the custom task extension should wait for a response from the Azure Logic App. If no response is received within a customer defined duration window, the task will be considered failed.
 :::image type="content" source="media/lifecycle-workflow-extensibility/custom-task-launch-wait.png" alt-text="Screenshot of custom task launch and wait task choice.":::

## Custom task extension integration with Azure Logic Apps high-level steps

The high-level steps for the Azure Logic Apps integration are as follows:

> [!NOTE]
> Creating a custom task extension and logic app through the workflows page in the Azure portal will automate most of these steps. For a guide on creating a custom task extension this way, see: [Trigger Logic Apps based on custom task extensions (Preview)](trigger-custom-task.md).

- **Create a consumption-based Azure Logic App**: A consumption-based Azure Logic App that is used to be called to from the custom task extension.
- **Configure the Azure Logic App so its compatible with Lifecycle workflows**: Configuring the consumption-based Azure Logic App so that it can be used with the custom task extension.
- **Build your custom business logic within your Azure Logic App**: Set up your business logic within the Azure Logic App using Logic App designer.
- **Create a lifecycle workflow customTaskExtension which holds necessary information about the Azure Logic App**: Creating a custom task extension that references the configured Azure Logic App.
- **Update or create a Lifecycle workflow with the “Run a custom task extension” task, referencing your created customTaskExtension**: Adding the newly created custom task extension to a new workflow, or updating the information to an existing workflow.

## Logic App parameters used by the custom task

When creating a custom task extension from the Azure portal, you're able to create a Logic App, or link it to an existing one.
:::image type="content" source="media/lifecycle-workflow-extensibility/custom-task-logic-app.png" alt-text="Screenshot of a custom task create logic app selection screen."::: 

The following information is supplied to the custom task from the Logic App:

- Subscription
- Resource group
- Logic App name


For a guide on supplying this information to a custom task extension via Microsoft Graph, see: [Configure a Logic App for Lifecycle Workflow use](configure-logic-app-lifecycle-workflows.md).

## Next steps

- [customTaskExtension resource type](/graph/api/resources/identitygovernance-customtaskextension?view=graph-rest-beta)
- [Trigger Logic Apps based on custom task extensions (Preview)](trigger-custom-task.md)
- [Configure a Logic App for Lifecycle Workflow use (Preview)](configure-logic-app-lifecycle-workflows.md)