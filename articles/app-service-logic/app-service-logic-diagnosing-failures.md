<properties
   pageTitle="Diagnosing logic apps failures | Microsoft Azure"
   description="Common approaches to understanding where logic apps are failing"
   services="logic-apps"
   documentationCenter=".net,nodejs,java"
   authors="jeffhollan"
   manager="erikre"
   editor=""/>

<tags
   ms.service="logic-apps"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration"
   ms.date="05/18/2016"
   ms.author="jehollan"/>

# Diagnosing logic app failures

If you experience issues or failures with the Logic Apps feature of Azure App Service, a few approaches can help you better understand where the failures are coming from.  

## Azure portal tools

The Azure portal provides many tools to diagnose each logic app at each step.

### Trigger history

Each logic app has at least one trigger. If you notice that apps aren't firing, the first place to look for additional information is the trigger history. You can access the trigger history on the logic app main blade.

![Locating the trigger history][1]

This lists all of the trigger attempts that your logic app has made. You can click each trigger attempt to get the next level of detail (specifically, any inputs or outputs that the trigger attempt generated). If you see any failed triggers, click the trigger attempt and drill into the **Outputs** link to see any error messages that might have been generated (for example, for invalid FTP credentials).

The different statuses you might see are:

* **Skipped**. It polled the endpoint to check for data and received a response that no data was available.
* **Succeeded**. The trigger received a response that data was available. This could be from a manual trigger, a recurrence trigger, or a polling trigger. This likely will be accompanied with a status of **Fired**, but it might not if you have a condition or SplitOn command in code view that wasn't satisfied.
* **Failed**. An error was generated.

#### Starting a trigger manually

If you want the logic app to check for an available trigger immediately (without waiting for the next recurrence), you can click **Select Trigger** on the main blade to force a check. For example, clicking this link with a Dropbox trigger will cause the workflow to immediately poll Dropbox for new files.

### Run history

Every trigger that is fired results in a run. You can access run information from the main blade, which contains a lot of information that can be helpful in understanding what happened during the workflow.

![Locating the run history][2]

A run displays one of the following statuses:

* **Succeeded**. All actions succeeded, or, if there was a failure, it was handled by an action that occurred later in the workflow. That is, it was handled by an action that was set to run after a failed action.
* **Failed**. At least one action had a failure that was not handled by an action later in the workflow.
* **Cancelled**. The workflow was running but received a cancel request.
* **Running**. The workflow is currently running. This may occur for workflows that are being throttled, or because of the current App Service plan. Please see action limits on the [pricing page](https://azure.microsoft.com/pricing/details/app-service/plans/) for details. Configuring diagnostics (the charts listed below the run history) also can provide information about any throttle events that are occurring.

When you are looking at a run history, you can drill in for more details.  

#### Trigger outputs

Trigger outputs show the data that was received from the trigger. This can help you determine whether all properties returned as expected.

>[AZURE.NOTE] It might be helpful to understand how the Logic Apps feature [handles different content types](app-service-logic-content-type.md) if you see any content that you don't understand.

![Trigger output examples][3]

#### Action inputs and outputs

You can drill into the inputs and outputs that an action received. This is useful for understanding the size and shape of the outputs, as well as to see any error messages that may have been generated.

![Action inputs and outputs][4]

## Debugging workflow runtime

In addition to monitoring the inputs, outputs, and triggers of a run, it could be useful to add some steps within a workflow to help with debugging. [RequestBin](http://requestb.in) is a powerful tool that you can add as a step in a workflow. By using RequestBin, you can set up an HTTP request inspector to determine the exact size, shape, and format of an HTTP request. You can create a new RequestBin and paste the URL in a logic app HTTP POST action along with body content you want to test (for example, an expression or another step output). After you run the logic app, you can refresh your RequestBin to see how the request was formed as it was generated from the Logic Apps engine.




<!-- image references -->
[1]: ./media/app-service-logic-diagnosing-failures/triggerHistory.PNG
[2]: ./media/app-service-logic-diagnosing-failures/runHistory.PNG
[3]: ./media/app-service-logic-diagnosing-failures/triggerOutputsLink.PNG
[4]: ./media/app-service-logic-diagnosing-failures/ActionOutputs.PNG
