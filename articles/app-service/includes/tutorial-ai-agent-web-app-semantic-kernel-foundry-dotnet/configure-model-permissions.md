---
title: Configure permissions for Microsoft Foundry resource
description: Steps to assign the required Azure role for your App Service app to access the Microsoft Foundry resource.
ms.author: cephalin
ms.topic: include
ms.date: 12/08/2025
ms.service: azure-app-service
---

1. From the top menu of the new Foundry portal, select **Operate**, then select **Admin**. In the row for your Foundry project, you should see two links. The one in the **Name** column is the Foundry project resource, and the one in the **Parent resource** column is the Foundry resource.

    :::image type="content" source="../../media/tutorial-ai-agent-web-app-semantic-kernel-foundry-dotnet/select-foundry-and-foundry-project.png" alt-text="Screenshot showing how to quickly go to the foundry resource or foundry project resource.":::

1. Select the Foundry resource in the **Parent resource** and then select **Manage this resource in the Azure portal**. From the Azure portal, you can assign role-based access for the resource to the deployed web app.

1. Add the following role for the App Service app's managed identity:

    | Target resource                | Required role                       | Needed for              |
    |--------------------------------|-------------------------------------|-------------------------|
    | Foundry               | Cognitive Services OpenAI User      | The chat completion service in Microsoft Agent Framework. |

    For instructions, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).
