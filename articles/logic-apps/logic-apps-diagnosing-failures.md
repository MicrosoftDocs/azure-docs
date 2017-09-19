---
title: Diagnose failures - Azure Logic Apps | Microsoft Docs
description: Common ways to understand where logic apps are failing
services: logic-apps
documentationcenter: .net,nodejs,java
author: jeffhollan
manager: anneta
editor: ''

ms.assetid: a6727ebd-39bd-4298-9e68-2ae98738576e
ms.service: logic-apps
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: integration
ms.date: 10/18/2016
ms.author: LADocs; jehollan

---
# Diagnose logic app failures
If you experience issues or failures with your logic apps, there are a few approaches can help you better understand where the failures are coming from.  

## Azure portal tools
The Azure portal provides many tools to diagnose each logic app at each step.

### Trigger history

Each logic app has at least one trigger. 
If you notice that apps aren't firing, 
look first at the trigger history for more information. 
You can access the trigger history on the logic app'ss main blade.

![Locating the trigger history][1]

The trigger history lists all trigger attempts that your logic app made. 
You can click each trigger attempt to drill into the details, 
specifically, any inputs or outputs that the trigger attempt generated. 
If you find failed triggers, select the trigger attempt and 
choose the **Outputs** link to review any generated error messages, 
for example, for FTP credentials that aren't valid.

The different statuses you might see are:

* **Skipped**. The endpoint was polled to check for data and received a response that no data was available.
* **Succeeded**. The trigger received a response that data was available. 
This status might result from a manual trigger, a recurrence trigger, or a polling trigger. 
This status is usually accompanied by the **Fired** status, 
but might not be if you have a condition or SplitOn command in code view that wasn't satisfied.
* **Failed**. An error was generated.

#### Start a trigger manually

If you want the logic app to check for an available trigger immediately without waiting for the next recurrence, 
click **Select Trigger** on the main blade to force a check. For example, clicking this link with a Dropbox trigger 
causes the workflow to immediately poll Dropbox for new files.

### Run history

Every fired trigger results in a run. You can access run information from the main blade, 
which contains many details that can help you understand what happened during the workflow.

![Locating the run history][2]

A run displays one of the following statuses:

* **Succeeded**. All actions succeeded. If a failure happened, 
that failure was handled by an action that occurred later in the workflow. 
That is, the failure was handled by an action that was set to run after a failed action.
* **Failed**. At least one action had a failure that was not handled by an action later in the workflow.
* **Cancelled**. The workflow was running but received a cancel request.
* **Running**. The workflow is currently running. 
This status might occur for throttled workflows, or because of the current pricing plan. 
For details, see [action limits on the pricing page](https://azure.microsoft.com/pricing/details/app-service/plans/). 
Configuring diagnostics (the charts that appear under the run history) 
also can provide information about any throttle events that happen.

When you are looking at a run history, you can drill in for more details.  

#### Trigger outputs

Trigger outputs show the data that came from the trigger. 
These outputs can help you determine whether all properties returned as expected.

> [!NOTE]
> If you see any content that you don't understand, 
> learn how Azure Logic Apps 
> [handles different content types](../logic-apps/logic-apps-content-type.md).
> 

![Trigger output examples][3]

#### Action inputs and outputs

You can drill into the inputs and outputs that an action received. 
This data is useful for understanding the size and shape of the outputs, 
and also for finding any error messages that might have been generated.

![Action inputs and outputs][4]

## Debug workflow runtime

Along with monitoring the inputs, outputs, and triggers of a run, 
you could add some steps to a workflow that help with debugging. 
[RequestBin](http://requestb.in) is a powerful tool that you can add as a step in a workflow. 
By using RequestBin, you can set up an HTTP request inspector to determine the exact size, 
shape, and format of an HTTP request. You can create a RequestBin and paste the URL in 
a logic app HTTP POST action with body content that you want to test, 
for example, an expression or another step output. After you run the logic app, 
you can refresh your RequestBin to see how the request was formed when generated from the Logic Apps engine.

<!-- image references -->
[1]: ./media/logic-apps-diagnosing-failures/triggerhistory.png
[2]: ./media/logic-apps-diagnosing-failures/runhistory.png
[3]: ./media/logic-apps-diagnosing-failures/triggeroutputslink.png
[4]: ./media/logic-apps-diagnosing-failures/actionoutputs.png
