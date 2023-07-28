---
title: Manage workflow properties
description: This article guides a user to editing a workflow's properties using Lifecycle Workflows
author: OWinfreyATL
ms.author: owinfrey
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: how-to 
ms.date: 05/31/2023
ms.subservice: compliance
ms.custom: template-how-to 
---

# Manage workflow properties

Managing workflows can be accomplished in one of two ways:  
   - Updating the basic properties of a workflow without creating a new version of it
   - Creating a new version of the updated workflow

You can update the following basic information without creating a new workflow.
   - display name
   - description
   - whether or not it's enabled
   - Whether or not workflow schedule is enabled
   - task name
   - task description

If you change any other parameters, a new version is required to be created as outlined in the [Managing workflow versions](manage-workflow-tasks.md) article.

If done via the Azure portal, the new version is created automatically. If done using Microsoft Graph, you must manually create a new version of the workflow.  For more information, see [Edit the properties of a workflow using Microsoft Graph](#edit-the-properties-of-a-workflow-using-microsoft-graph).

## Edit the properties of a workflow using the Azure portal

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

To edit the properties of a workflow using the Azure portal, you do the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Type in **Identity Governance** on the search bar near the top of the page and select it.

1. On the left menu, select **Lifecycle workflows**. 

1. On the left menu, select **Workflows**.

1. Here you see a list of all of your current workflows. Select the workflow that you want to edit.
    
    :::image type="content" source="media/manage-workflow-properties/manage-list.png" alt-text="Screenshot of the manage workflow list.":::

6. To change the display name or description, select **Properties**.

    :::image type="content" source="media/manage-workflow-properties/manage-properties.png" alt-text="Screenshot of the manage basic properties screen.":::

7. Update the display name or description how you want. 
> [!NOTE]
> Display names can not be the same as other existing workflows. They must have their own unique name.

8. Select **save**.


## Edit the properties of a workflow using Microsoft Graph

To update a workflow via API using Microsoft Graph, see: [Update workflow](/graph/api/identitygovernance-workflow-update)






## Next steps

- [Manage workflow versions](manage-workflow-tasks.md)
- [Check status of a workflows](check-status-workflow.md)
