---
title: Adding preactions to schedules in Start/Stop VMs v2 (Azure)
description: This article shows you how to add a preaction to your Start/Stop VMs v2 schedules.
services: azure-functions
ms.subservice: start-stop-vms
ms.date: 09/21/2022
ms.topic: how-to
---

# Adding pre-actions to schedules in Start/Stop VMs v2

Pre-actions are a set of actions in Start/Stop VMs v2 that execute before scheduled start or stop actions. Some scenarios for using pre-actions before a start or stop action include: 

 - Create a backup of an Azure SQL Database.
 - Send a message to Azure Application Insights.
 - Call an external API.

Because Start/Stop VMs v2 uses [Azure Logic Apps](../../logic-apps/logic-apps-overview.md) to manage its schedules, it's easy to add one or more pre-actions before the main action. To learn more about Logic Apps, see the [Logic Apps documentation](../../logic-apps/logic-apps-overview.md). 

This article describes how to use the Logic Apps Designer in the Azure portal to add an HTTP request pre-action to an existing scheduled start action in Start/Stop VMs v2. In your implementation, the pre-action can be any action supported by Logic Apps.

> [!NOTE]
> At this time, Start/Stop VMs v2 only supports pre-actions, which are run before the execution of the main action. Because Log Apps runs Start/Stop VMs v2 actions asynchronously, there's currently no way to trigger a post-action that occurs after the main action completes. 

## Prerequisites

You must first complete the steps in [Deploy Start/Stop VMs v2 to an Azure subscription][deployment article], or else complete a default deployment from the [Start Stop V2 Deployments GitHub repository](https://github.com/microsoft/startstopv2-deployments). Logic app and action names are based on the ones in a default deployment of Start/Stop VMs v2.

## Create an HTTP request pre-action

The steps in this section require the `ststv2_vms_Scheduled_start` logic app that was created and deployed when you completed the [deployment article]. However, the same basic process is used for all scheduled actions.

 1. In the [Azure portal](https://portal.azure.com), search for and navigate to the resource group you created when you deployed Start/Stop VMs v2. 
 
 1. In the resource group, choose the logic app named `ststv2_vms_Scheduled_start`, which represents the default scheduled start action. 

 1. In **Overview** page of the logic app, select **Edit**. 

 1. In the Logic Apps Designer page, select **Function-Try** and then select **Add an action**.

    :::image type="content" source="./media/pre-actions/add-action-button.png" alt-text="Screenshot of the Logic Apps designer showing Add an Action button location.":::

 5. Choose **HTTP**, select the HTTP **Method**, and add the **URL**. This HTTP request will be the pre-action for the scheduled start action, after you change the action order in **Function-Try**. You can also configure the HTTP action at a later time.

 6. Drag the **Scheduled** action below the new **HTTP** action in the **Function-Try** step. The pre-action must come before the scheduled action in the step. Your app should now look like the following example:

    :::image type="content" source="./media/pre-actions/pre-action-configured.png" alt-text="Screenshot of the Logic Apps designer showing the actions in the correct order.":::

At this point, you've defined a pre-action that's run before the start action scheduled by `ststv2_vms_Scheduled_start`. 

## Next steps

If you have issues working with Start/Stop VMs v2, see the [Troubleshoot Guide](troubleshoot.md). For more assistance, you can also create an issue in the [Start Stop V2 Deployments GitHub repository](https://github.com/microsoft/startstopv2-deployments/issues).


[deployment article]: deploy.md
