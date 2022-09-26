---
title: Manage workflow properties - Azure Active Directory
description: This article guides a user to editing a workflow's properties using Lifecycle Workflows
author: OWinfreyATL
ms.author: owinfrey
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: how-to 
ms.date: 02/15/2022
ms.subservice: compliance
ms.custom: template-how-to 
---

# Manage workflow properties (preview)

Managing workflows can be accomplished in one of two ways.  
   - Updating the basic properties of a workflow without creating a new version of it
   - Creating a new version of the updated workflow. 

You can update the following basic information without creating a new workflow.
   - display name
   - description
   - whether or not it is enabled.

If you change any other parameters, a new version is required to be created as outlined in the [Managing workflow versions](manage-workflow-tasks.md) article. 

If done via the Azure portal, the new version is created automatically. If done using Microsoft Graph, you will have to manually create a new version of the workflow.  For more information, see [Edit the properties of a workflow using Microsoft Graph](#edit-the-properties-of-a-workflow-using-microsoft-graph).

## Edit the properties of a workflow using the Azure portal

To edit the properties of a workflow using the Azure portal, you'll do the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Azure Active Directory** and then select **Identity Governance**.

1. On the left menu, select **Lifecycle workflows (Preview)**. 

1. On the left menu, select **Workflows (Preview)**.

1. Here you'll see a list of all of your current workflows. Select the workflow that you want to edit.
    
    :::image type="content" source="media/manage-workflow-properties/manage-list.png" alt-text="Screenshot of the manage workflow list.":::

6. To change the display name or description, select **Properties (Preview)**.

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
