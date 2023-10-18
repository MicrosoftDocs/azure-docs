---
title: Workflow Extensibility
description: Conceptual article discussing workflow extensibility with Lifecycle Workflows
author: owinfreyATL
ms.author: owinfrey
manager: amycolannino
ms.service: active-directory
ms.subservice: compliance
ms.workload: identity
ms.topic: conceptual 
ms.date: 05/31/2023
ms.custom: template-concept 
---


# Lifecycle Workflows custom task extension


Lifecycle Workflows allow you to create workflows that can be triggered based on joiner, mover, or leaver scenarios. While Lifecycle Workflows provide several built-in tasks to automate common scenarios throughout the lifecycle of users, eventually you may reach the limits of these built-in tasks. With the extensibility feature, you're able to utilize the concept of custom task extensions to call-out to external systems as part of a workflow. For example, when a user joins your organization you can have a workflow with a custom task extension that assigns a Teams number, or have a separate workflow that grants access to an email account for a manager when a user leaves. With the extensibility feature, Lifecycle Workflows currently support creating custom tasks extensions to call-out to [Azure Logic Apps](../../logic-apps/logic-apps-overview.md).


## Logic Apps prerequisites

To link an Azure Logic App with a custom task extension, the following prerequisites must be available:

- An Azure subscription
- A resource group
- Permissions to create a new consumption-based Logic App or access to an existing consumption-based Logic App

One of the following Azure role assignments is required either on the Logic App itself or on a higher scope such as the resource group, subscription or management group:

- **Logic App contributor**
- **Contributor**
- **Owner**

> [!NOTE]
> The **Logic App Operator** role is not sufficient.

## Custom task extension deployment scenarios

When creating custom task extensions, the scenarios for how it interacts with Lifecycle Workflows can be one of two ways:

 :::image type="content" source="media/lifecycle-workflow-extensibility/task-extension-deployment-scenarios.png" alt-text="Screenshot of custom task deployment scenarios.":::

- **Launch and continue** - The Azure Logic App is started, and the following task execution immediately continues with no response expected from the Azure Logic App. This scenario is best suited if the Lifecycle workflow doesn't require any feedback (including status) from the Azure Logic App. If the Logic App is started successfully, the Lifecycle Workflow task is considered a success.
- **Launch and wait** - The Azure Logic App is started, and the following task's execution waits on the response from the Logic App. You enter a time duration for how long the custom task extension should wait for a response from the Azure Logic App. If no response is received within the defined duration window, the task is considered failed.
 :::image type="content" source="media/lifecycle-workflow-extensibility/custom-task-launch-wait.png" alt-text="Screenshot of custom task launch and wait task choice." lightbox="media/lifecycle-workflow-extensibility/custom-task-launch-wait.png":::

> [!NOTE]
> The response does not necessarily have to be provided by the Logic App, a third party system is able to respond if the Logic App only acts as an intermediary. To learn more about this, see: [taskProcessingResult: resume](/graph/api/identitygovernance-taskprocessingresult-resume).


## Response authorization

When you create a custom task extension that waits for a response from the Logic App, you're able to define which applications can send a response.

:::image type="content" source="media/lifecycle-workflow-extensibility/launch-wait-options.png" alt-text="Screenshot of custom task extension launch and wait options.":::

The response can be authorized in one of the following ways:

- **System-assigned managed identity (Default)** - With this choice you enable and utilize the Logic Apps system-assigned managed identity. For more information, see: [Authenticate access to Azure resources with managed identities in Azure Logic Apps](/azure/logic-apps/create-managed-service-identity)
- **No authorization** -  With this choice no authorization will be granted, and you separately have to assign an application permission (LifecycleWorkflows.ReadWrite.All), or role assignment (Lifecycle Workflows Administrator). If an application is responding we don't recommend this option, as it isn't following the principle of least privilege. This option may also be used if responses are only provided on behalf of a user (LifecycleWorkflows.ReadWrite.All delegated permission AND Lifecycle Workflows Administrator role assignment)
- **Existing application** - With this choice you're able to choose an existing application to respond. This can be a regular application and a system or user-assigned managed identity. For more information on managed identity types, see: [Managed identity types](../managed-identities-azure-resources/overview.md#managed-identity-types).

## Custom task extension integration with Azure Logic Apps high-level steps

The high-level steps for the Azure Logic Apps integration are as follows:

> [!NOTE]
> Creating a custom task extension and logic app through the Microsoft Entra admin center will automate most of these steps. For a guide on creating a custom task extension this way, see: [Trigger Logic Apps based on custom task extensions](trigger-custom-task.md).

- **Create a consumption-based Azure Logic App**: A consumption-based Azure Logic App that is used to be called to from the custom task extension.
- **Configure the Azure Logic App so its compatible with Lifecycle workflows**: Configuring the consumption-based Azure Logic App so that it can be used with the custom task extension. For more information, see: [Configure a Logic App for Lifecycle Workflow use](configure-logic-app-lifecycle-workflows.md)
- **Build your custom business logic within your Azure Logic App**: Set up your business logic within the Azure Logic App using Logic App designer.
- **Create a lifecycle workflow customTaskExtension which holds necessary information about the Azure Logic App**: Creating a custom task extension that references the configured Azure Logic App.
- **Update or create a Lifecycle workflow with the “Run a custom task extension” task, referencing your created customTaskExtension**: Adding the newly created custom task extension to a new workflow, or updating the information to an existing workflow.


## Next steps

- [customTaskExtension resource type](/graph/api/resources/identitygovernance-customtaskextension?view=graph-rest-beta&preserve-view=true)
- [Trigger Logic Apps based on custom task extensions](trigger-custom-task.md)
- [Configure a Logic App for Lifecycle Workflow use](configure-logic-app-lifecycle-workflows.md)
