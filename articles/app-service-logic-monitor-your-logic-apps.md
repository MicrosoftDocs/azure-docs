<properties 
	pageTitle="Monitor your Logic Apps" 
	description="How to see what your Logic Apps have done." 
	authors="stepsic-microsoft-com" 
	manager="dwrede" 
	editor="" 
	services="app-service-logic" 
	documentationCenter=""/>

<tags
	ms.service="app-service-logic"
	ms.workload="web"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/10/2015"
	ms.author="stepsic"/>

##Monitor your Logic Apps

After you've created your Logic App you can see the full history of its execution in the Azure portal. Click on **Browse** at the left side of the portal screen and select **Logic Apps**. You’ll see a list of Logic Apps in your subscription and if they are Enabled or not (*Enabled* just means that triggers will run your Logic App when they decide to, *Disabled* Logic Apps will not run in response to trigger events).

When you see the blade for your Logic App there are 2 sections that are useful:

- **Summary**, which tells you the latest status and is an entry point to editing your Logic App
- **All runs**, which shows you a list of the runs this Logic App has had

### Runs

![All Runs](./media/app-service-logic-monitor-your-logic-apps/allruns.png)

This list of runs shows the **Start time**, the **Name** (you can use this Name when calling the REST API), and the **Duration** of the particular runs. Click any row to see details on that run.

The details blade shows a graph with the execution time and sequence of all of the actions in the run. Below that is the full list of all of the actions that were executed.

![Run and Actions](./media/app-service-logic-monitor-your-logic-apps/runandaction.png)

Finally, on a particular action, you can get all of the data that was passed to the action, and that was received from the action in the **Inputs** and **Outputs** sections.

There is also the **Tracking ID**. This is the identifier that all calls are passed in the header to identify themselves. If you have logging inside of your own service, we recommend logging the Tracking ID, and then you can cross-reference your own logs with this identifier.