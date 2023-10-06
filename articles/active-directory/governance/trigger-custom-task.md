---
title: Trigger Logic Apps based on custom task extensions
description: Trigger Logic Apps based on custom task extensions
author: owinfreyATL
ms.author: owinfrey
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.subservice: compliance
ms.topic: conceptual
ms.date: 06/22/2023
ms.custom: template-howto 
---


# Trigger Logic Apps based on custom task extensions

Lifecycle Workflows can be used to trigger custom tasks via an extension to Azure Logic Apps. This can be used to extend the capabilities of Lifecycle Workflow beyond the built-in tasks. The steps for triggering a Logic App based on a custom task extension are as follows:

- Create a custom task extension.
- Select which behavior you want the custom task extension to take.
- Link your custom task extension to a new or existing Azure Logic App.
- Add the custom task to a workflow.

For more information about Lifecycle Workflows extensibility, see: [Workflow Extensibility](lifecycle-workflow-extensibility.md).


## Create a custom task extension using the Microsoft Entra admin center

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

To use a custom task extension in your workflow, first a custom task extension must be created to be linked with an Azure Logic App. You're able to create a Logic App at the same time you're creating a custom task extension. To do this, you complete these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Lifecycle Workflows Administrator](../roles/permissions-reference.md#lifecycle-workflows-administrator).

1. Browse to **Identity governance** > **Lifecycle workflows** > **workflows**.

1. On the Lifecycle workflows screen, select **Custom task extension**. 

1. On the custom task extensions page, select **Create custom task extension**.
    :::image type="content" source="media/trigger-custom-task/create-custom-task-extension.png" alt-text="Screenshot for creating a custom task extension selection.":::
1. On the basics page you, enter a unique display name and description for the custom task extension and select **Next**.
    :::image type="content" source="media/trigger-custom-task/custom-task-extension-basics.png" alt-text="Screenshot of the basics section for creating a custom task extension.":::
1. On the **Task behavior** page, you specify how the custom task extension will behave after executing the Azure Logic App. If you choose **Launch and continue** you can immediately select **Next: Details**.
    :::image type="content" source="media/trigger-custom-task/custom-task-extension-behavior.png" alt-text="Screenshot for choose task behavior for custom task extension.":::

1. If you select **Launch and wait**, you're given an option of how long to wait for a response from the logic app before the task is considered a failure, and also options to set **Response authorization**. After choosing these options, you would be able to select **Next: Details**. 
    :::image type="content" source="media/trigger-custom-task/custom-task-extension-launch-wait.png" alt-text="Screenshot of launch and wait option for custom task extension." lightbox="media/trigger-custom-task/custom-task-extension-launch-wait.png"::: 
     > [!NOTE]
     > For more information about custom task extension behavior, see: [Lifecycle Workflow extensibility](lifecycle-workflow-extensibility.md)
1. On the **Logic App details** page, you select **Create new Logic App**, and specify the subscription and resource group where it will be located. You'll also give the new Azure Logic App a name.
    :::image type="content" source="media/trigger-custom-task/custom-task-extension-new-logic-app.png" alt-text="screen showing to create new logic app for custom task extension.":::
   > [!IMPORTANT]
   > A Logic App must be configured to be compatible with the custom task extension. For more information, see [Configure a Logic App for Lifecycle Workflow use](configure-logic-app-lifecycle-workflows.md) 
1. If deployed successfully, you get confirmation on the **Logic App details** page immediately, and then you can select **Next**. 

1. On the  **Review** page, you can review the details of the custom task extension and the Azure Logic App you've created. Select **Create** if the details match what you desire for the custom task extension.    


## Add your custom task extension to a workflow

After you've created your custom task extension, you can now add it to a workflow.  Unlike some tasks, which can only be added to workflow templates that match its category, a custom task extension can be added to any template you choose to make a custom workflow from.

To Add a custom task extension to a workflow, you'd do the following steps:

1. In the left menu, select **Lifecycle workflows**. 

1. In the left menu, select **Workflows**.

1. Select the workflow that you want to add the custom task extension to.

1. On the workflow screen, select **Tasks**.

1. On the tasks screen, select **Add task**.

1. In the **Select tasks** side menu, select **Run a Custom Task Extension**, and select **Add**.

1. On the custom task extension page, you can give the task a name and description. You also choose from a list of configured custom task extensions to use.
    :::image type="content" source="media/trigger-custom-task/add-custom-task-extension.png" alt-text="Screenshot showing to add a custom task extension to workflow.":::     
1. When finished, select **Save**.   

## Next steps

- [Lifecycle workflow extensibility](lifecycle-workflow-extensibility.md)
- [Manage Workflow Versions](manage-workflow-tasks.md)
