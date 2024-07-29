---
title: include file
description: include file
author: dominicbetts
ms.topic: include
ms.date: 12/18/2023
ms.author: dobett
---

Navigate to the [Microsoft Fabric Power BI experience](https://msit.powerbi.com/groups/me/list?experience=power-bi).

To ensure you can see the **Manage access** option in your Microsoft Fabric workspace, create a new workspace:

1. Select **Workspaces** in the left navigation bar, then select **New Workspace**:

    :::image type="content" source="media/grant-service-principal-fabric-access/create-fabric-workspace.png" alt-text="Screenshot that shows how to create a new Microsoft Fabric workspace.":::

1. Enter a name for your workspace, such as _Your name AIO workspace_, and select **Apply**.

To grant the service principal access to your Microsoft Fabric workspace:

1. In your Microsoft Fabric workspace, select **Manage access**:

    :::image type="content" source="media/grant-service-principal-fabric-access/workspace-manage-access.png" alt-text="Screenshot that shows how to access the Manage access option in a workspace.":::

1. Select **Add people or groups**, then paste the display name of the service principal from the previous step and grant at least **Contributor** access to it.

    :::image type="content" source="media/grant-service-principal-fabric-access/workspace-add-service-principal.png" alt-text="Screenshot that shows how to add a service principal to a workspace and add it to the contributor role.":::

1. Select **Add** to grant the service principal contributor permissions in the workspace.
