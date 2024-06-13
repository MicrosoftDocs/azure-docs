---
author: maud-lv
ms.author: malev
ms.service: azure-app-configuration
ms.topic: include
ms.date: 02/14/2023
---

A [service connection](/azure/devops/pipelines/library/service-endpoints) gives you access to resources in your Azure subscription from your Azure DevOps project.

1. In Azure DevOps, go to the project that contains your target pipeline. In the lower-left corner, select **Project settings**.
1. Under **Pipelines**, select **Service connections**. In the upper-right corner, select **New service connection**.
1. In **New service connection**, select **Azure Resource Manager**.

    :::image type="content" source="./media/azure-app-configuration-service-connection/new-service-connection.png" alt-text="Screenshot shows selecting Azure Resource Manager from the New service connection dropdown list.":::
1. In the **Authentication method** dialog, select **Service principal (automatic)** to create a new service principal or select **Service principal (manual)** to [use an existing service principal](/azure/devops/pipelines/library/connect-to-azure?view=azure-devops#use-spn&preserve-view=true).
1. Enter your subscription, resource group, and a name for your service connection.

If you created a new service principal, find the name of the service principal assigned to the service connection. You'll add a new role assignment to this service principal in the next step.

1. Go to **Project Settings** > **Service connections**.
1. Select the new service connection.
1. Select **Manage Service Principal**.
1. Note the value in **Display name**.

    :::image type="content" source="./media/azure-app-configuration-service-connection/service-principal-display-name.png" alt-text="Screenshot shows the service principal display name.":::
