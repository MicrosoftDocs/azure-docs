---
title: Adding Pre Actions to Start/Stop V2 Schedules
description: This article describes the process to add a pre action to your Start/Stop V2 Schedules.
services: azure-functions
ms.subservice: start-stop-vms
ms.date: 09/21/2022
ms.topic: conceptual
---

# Adding Pre Actions to Start/Stop V2 Schedules

Pre Actions are a set of actions that happen before Start/Stop V2 schedules. Some common usages of Pre Actions are: 

 - Make the backup of Azure SQL Database
 - Send a message to Azure App Insights
 - Call an external API

Start/Stop V2 uses [Azure Logic App](../../../logic-apps/logic-apps-overview.md) to manage its schedules. This make it quite simple to add Pre Actions. For more details, check the [Azure Logic App](../../../logic-apps/logic-apps-overview.md) documentation. In this page, we will explain the necessary steps you need to follow to modify any exiting Start/Stop V2 schedule to add Pre Actions. 

## Prerequisites

We assume you have deployed Start/Stop V2 inside your subscription. If you haven't done it, please do it following the Deploy [Start/Stop V2](../deploy.md) Documentation.

## Adding a new Step

> [!NOTE]
> Currently, Start Stop only supports actions to be added before the execution of Start/Stop V2 Worflow Configuration action. This is a Logic App Limitation. Such don't wait for the VMs actions to be finished before continue executing the following steps of the logic app.

For the following example, we will be modifying the `ststv2_vms_Scheduled_start` Logic App, this was deployed with the default Start/Stop V2 deployment, however the process described below is the same for all Start/Stop V2 Schedules.
---
title: Adding Pre Actions to Start/Stop V2 Schedules
description: This article describes the process to add a pre action to your Start/Stop V2 Schedules.
services: azure-functions
ms.subservice: start-stop-vms
ms.date: 09/21/2022
ms.topic: conceptual
---

# Adding Pre Actions to Start/Stop V2 Schedules

Pre Actions are a set of actions that happen before Start/Stop V2 schedules. Some common usages of Pre Actions are: 

 - Make the backup of Azure SQL Database
 - Send a message to Azure App Insights
 - Call an external API

Start/Stop V2 uses [Azure Logic App](../../../logic-apps/logic-apps-overview.md) to manage its schedules. This make it quite simple to add Pre Actions. For more details, check the [Azure Logic App](../../../logic-apps/logic-apps-overview.md) documentation. In this page, we will explain the necessary steps you need to follow to modify any exiting Start/Stop V2 schedule to add Pre Actions. 

## Prerequisites

We assume you have deployed Start/Stop V2 inside your subscription. If you haven't done it, please do it following the Deploy [Start/Stop V2](../deploy.md) Documentation.

## Adding a new Step

> [!NOTE]
> Currently, Start Stop only supports actions to be added before the execution of Start/Stop V2 actions. This is a limitation happens due the functions apps. Such don't wait for the VMs actions to be finished before continue executing the following steps of the logic app.

For the following example, we will be modifying the `ststv2_vms_Scheduled_start` Logic App, this was deployed with the default Start/Stop V2 deployment, however the process described below is the same for all Start/Stop V2 Schedules.

 1. Inside the Resource Group created by Start/Stop V2 deployment process, you will find a group of logic apps, each representing a Start/Stop V2 schedule. Click on the one you wish to add Pre Actions to. In this example, we will select the one called`ststv2_vms_Scheduled_start`.

:::image type="content" source="../media/advanced/pre-actions/logic-app-selection.PNG" alt-text="Logic app selection page, showing which worflow we are selecting":::

 2. You should now be view the Overview Page of your Logic App. On the top of the page there is a button called "Edit", click on that.

:::image type="content" source="../media/advanced/pre-actions/edit-button-location.PNG" alt-text="Logic app overview page, showing the location of edit button":::

 3. You should be viewing the "Logic Apps Designer" page. In this page, you should see a rectangle called "Function-Try", click on that.

:::image type="content" source="../media/advanced/pre-actions/function-try-expand.PNG" alt-text="Logic app designer page showing which rectagle to expand":::

> [!NOTE]
> Logic Apps Designer doesn't allow us to add an action before another. So we will have to add an action after the one specifying the Start/Stop V2 payload and swipe their positions. 

 4. Let's add a new action inside the "Function-Try" rectangle. To do that, let's click on the button called "Add an action", located inside such rectangle.

 :::image type="content" source="../media/advanced/pre-actions/add-action-button.PNG" alt-text="Logic app designer page showing add action button location":::

 5. In this step, you shall choose the action you want to perform. In this example, we will perform an HTTP action, but fell free to choose and configure the step you would actually like to perform before the Start/Stop V2 Schedule execution.
 
:::image type="content" source="../media/advanced/pre-actions/action-configured.PNG" alt-text="Logic app designer page showing the new action":::

 6. Finally, let's swap our actions positions. Click on the Start/Stop V2 action, it in this example such is called "Scheduled" but this might be different if chosen in a different Logic App, and drag it below the action you will change positions with, drop it when you see a plus sign appear on your cursor.

:::image type="content" source="../media/advanced/pre-actions/pre-action-configured.PNG" alt-text="Logic app designer page showing the actions in the correct order":::

> [!NOTE]
>  In order for the Pre Actions to work, such shoul be place before the Start/Stop V2 Schedule Action.

## Troubleshoot
This concludes the addition of Pre Actions to a Start/Stop V2. If you experience any issues, follow the [Troubleshoot Guide](../troubleshoot.md) or create an issue on [Start Stop V2 Deployments](https://github.com/microsoft/startstopv2-deployments.md) GitHub repo, so we can help you.
 1. Inside the Resource Group created by Start/Stop V2 deployment process, you will find a group of logic apps, each representing a Start/Stop V2 schedule. Click on the one you wish to add Pre Actions to. In this example, we will select the one called`ststv2_vms_Scheduled_start`.

 2. You should now be view the Overview Page of your Logic App. On the top of the page there is a button called "Edit", click on that.

 3. You should be viewing the "Logic Apps Designer" page. In this page, you should see a rectangle called "Function-Try", click on that.

> [!NOTE]
> Logic Apps Designer doesn't allow us to add an action before another. So we will have to add an action after the one specifying the Start/Stop V2 payload and swipe their positions. 

 4. Let's add a new action inside the "Function-Try" rectangle. To do that, let's click on the button called "Add an action", located inside such rectangle.

 5. In this step, you shall choose the action you want to perform. In this example, we will perform an HTTP action, but fell free to choose and configure the step you would actually like to perform before the Start/Stop V2 Schedule execution.
 
 6. Finally, let's swap our actions positions. Click on the Start/Stop V2 action, it in this example such is called "Scheduled" but this might be different if chosen in a different Logic App, and drag it below the action you will change positions with, drop it when you see a plus sign appear on your cursor.

> [!NOTE]
>  In order for the Pre Actions to work, such shoul be place before the Start/Stop V2 Schedule Action.

## Troubleshoot
This concludes the addition of Pre Actions to a Start/Stop V2. If you experience any issues, follow the [Troubleshoot Guide](../troubleshoot.md) or create an issue on [Start Stop V2 Deployments](https://github.com/microsoft/startstopv2-deployments.md) GitHub repo, so we can help you.