<properties
	pageTitle="Use Logic Flows with PowerApp"
	description="Business User: How to use Logic Flows in apps created using PowerApps"
	services="powerapps"
	documentationCenter=""
	authors="MandiOhlinger"
	manager="dwrede"
	editor=""/>

<tags
   ms.service="powerapps"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="11/05/2015"
   ms.author="anneta"/>

# Logic Flows in PowerApps

Logic Flows provides an easy way to run a series of actions from apps created using PowerApps. These actions can be to  read or update data, send notifications on email, update your calendar or tasks in Office 365 or SharePoint, and even wait on tasks to be updated by you or other people you work with. You can configure any control in your app to start the flow and the flow runs in the cloud even when you have closed PowerApps to carry out the steps automatically.

This article describes how you can create such a flow and use it in an app.

## Creating a Logic Flow for your PowerApp

To create a app that uses Logic Flows, you need to install PowerApps on your Windows PC or tablet. Once you've installed and signed in to PowerApps, choose the option to create a new app. You can add Logic Flows to any kind of app, so you can choose any of the options to create a new app (from a template, from data or blank).

To create a new Logic Flow, select **Action** from the ribbon menu and select **Logic Flows**.

![][1]

The Logic Flows pane will slide out on the right. Select the **Create a new Logic Flow** button.

![][2]

This opens powerapps.com in the browser and you may need to log in with your work email address. Once you are logged in, you can choose the option to create a logic flow to open the  designer.

![][3]

In the first box, enter when do you want the logic flow to run. For running the flow from an app, select **PowerApps - When a control is selected**.

![][4]

You can now add one or more actions to your logic flow to carry out the steps you need the flow to run. Here's another great article that explains in more detail on [how to run multiple steps in a Logic Flow](http://link-to-create-flow-doc.com).

Once your flow is complete, provide the name of the flow at the bottom and select **Done** to save the flow in PowerApps.

![][5]

Your logic flow is now ready to be used in an app.

## Using a Logic Flow in a PowerApp

Switch back to PowerApps and open the Logic Flows pane if it is not open already. The new flow that you created on powerapps.com would now appear in the list of flows on the task pane under "All Logic Flows".

**Note: Only flows that are have the trigger _When a control is selected_ will be available to run in the Task Pane**

You can associate your logic flow as an action with any control in your app:

1. Select the control using which you want to run the flow (for example, you can add a button in your app and configure it to run a flow when the button is selected by a user).

2. From the **Actions** tab, select **Logic Flows** to open the task pane.

3. From the list of "All flows", select the flow you want to run. It may take a few seconds while the flow is added to your app:
![][6]

4. Once the flow is added, the formula bar will be partly filled with the formula to run the flow. It will look something like this:
![][7]

5. If your flow doesn't require any parameters, simply close the parenthesis to complete the formula.

Your app is now ready to run the flow when this button is selected.

## Sending data to a flow
With Logic Flows, you can not only pass data between the various steps of the flow, but also send data to a flow to use when the steps execute. This can be useful in cases where you don't know all the settings for each of the steps when you create the flow, but these would be known when users of your app fill in data in the app.
For example, consider an app that registers information about a new user into a SharePoint list and sends a welcome email to the user who just registered. For this, your logic flow will need to use the email address provided by the user when filling up data in the app.

To identify an input in a flow step that will be specified in a PowerApp, simply fill in the value with the "Ask in PowerApps" token:
![][8]

The value will be automatically filled in with the name of the action and the setting. For example, if you need to use the email address provided by a user of the app, just select the "To" configuration of the "Send Email" action. This tells the flow that the "SendEmail_To" value will be provided later when using the flow in app.
![][9]

Next, when you use the flow in a PowerApp (as described in the **Using a Logic Flow in a PowerApp** section, the formula will be partly filled and PowerApps will assist you in filling up the values for the formula to run the Logic Flow. Any values you choose when filling up the formula will be used at the corresponding places when the flow runs.
![][10]


[1]: ./media/powerapps-using-logic-flows-in-powerapps/LogicFlowsInRibbon.png
[2]: ./media/powerapps-using-logic-flows-in-powerapps/Day0TaskPane.png
[3]: ./media/powerapps-using-logic-flows-in-powerapps/FlowDesigner.png
[4]: ./media/powerapps-using-logic-flows-in-powerapps/ManualTrigger.png
[5]: ./media/powerapps-using-logic-flows-in-powerapps/SaveFlowWhenDone.png
[6]: ./media/powerapps-using-logic-flows-in-powerapps/AddingFlow.png
[7]: ./media/powerapps-using-logic-flows-in-powerapps/FormulaBarPrefilled.png
[8]: ./media/powerapps-using-logic-flows-in-powerapps/AskInPowerAppsParameterBeforeSelection.png
[9]: ./media/powerapps-using-logic-flows-in-powerapps/AskInPowerAppsParameterAfterSelection.png
[10]: ./media/powerapps-using-logic-flows-in-powerapps/FlowFilledIn.png
