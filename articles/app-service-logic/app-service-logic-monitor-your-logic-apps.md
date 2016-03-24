<properties 
	pageTitle="Monitor your Logic Apps in Azure App Service | Microsoft Azure" 
	description="How to see what your Logic Apps have done" 
	authors="stepsic-microsoft-com" 
	manager="erikre" 
	editor="" 
	services="app-service\logic" 
	documentationCenter=""/>

<tags
	ms.service="app-service-logic"
	ms.workload="integration"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="02/29/2016"
	ms.author="stepsic"/>

# Monitor your Logic Apps

After you [create a Logic App](app-service-logic-create-a-logic-app.md), you can see the full history of its execution in the Azure portal. To view the history, select **Browse**, and select **Logic Apps**. A list of all Logic Apps in your subscription is displayed. You can select any logic app, and can **Enable** or **Disable** it. **Enabled** Logic Apps means that triggers run your Logic App in response to trigger events. **Disabled** Logic App do not run in response to events.

![Overview](./media/app-service-logic-monitor-your-logic-apps/overview.png)

When the blade for your Logic App appears, there are 2 sections that are useful:

- **Summary** shows you the latest status and is an entry point to editing your Logic App.
- **All runs** shows you a list of the runs this Logic App has had.

## View the runs of your app

![All Runs](./media/app-service-logic-monitor-your-logic-apps/allruns.png)

This list of runs shows the **Start time**, the **Run identifier** (you can use this when calling the REST API), and the **Duration** of the particular run. Select any row to see details on that run.

The details blade shows a graph with the execution time and sequence of all of the actions in the run. The following is the full list of all of the actions that were executed:  

![Run and Actions](./media/app-service-logic-monitor-your-logic-apps/runandaction.png)

Finally, on a particular action, you can get all of the data that was passed to the action, and that was received from the action in the **Inputs** and **Outputs** sections. Select the links to see the full content (you can also copy the links to download the content). 

Another important piece of information is the **Tracking ID**. This identifier is passed in the headers of all action calls. If you have logging inside of your own service, we recommend logging the Tracking ID, and then you can cross-reference your own logs with this identifier.

## View the Trigger history 

Polling triggers check an API on some interval but don't necessarily start a run, depending on the response (for example a `200` means to run and a `202` means to not run). The trigger history gives you a way to see all of the calls that happen but that don't run the Logic App (the `202` responses):  

![Trigger History](./media/app-service-logic-monitor-your-logic-apps/triggerhistory.png)

For each trigger you can see if it **Fired**, if it didn't fire, or if it had some sort of error (it **Failed**). To inspect why your trigger failed, select the **Outputs** link. If it did fire, select the **Run** link to see what happened after it fired.

Note that for *Push* triggers, you do *not* see the times that the runs started here. Instead you see the *callback registration* calls; which are when the Logic app registers to get called back. If your push trigger is not working, it may be a problem with the registration (which you can see on the Outputs), but otherwise you many need to investigate that API specifically.

## Enable versioning

There is an additional capability that is not currently possible in the UI (coming soon) but is available using the [REST API](https://msdn.microsoft.com/library/azure/mt643788.aspx). When you update the definition of a Logic App, the previous version of the definition is stored. This is because if you already have a run in progress, that run references the version of the Logic App that existed when the run started. Definitions of runs cannot change while they are in progress. The Version history REST API gives you access to this information.
 