---
title: Logic Apps pricing model | Microsoft Docs
description: Details about how pricing works in Logic Apps
author: kevinlam1
manager: dwrede
editor: ''
services: logic-apps
documentationcenter: ''
ms.assetid: f8f528f5-51c5-4006-b571-54ef74532f32
ms.service: logic-apps
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/29/2016
ms.author: klam
---
# Logic Apps pricing model
Azure Logic Apps allows you to scale and execute integration workflows in the cloud.  Following are details on the billing and pricing plans for Logic Apps.
## Consumption pricing
Newly created Logic Apps use a consumption plan. With the Logic Apps consumption pricing model, you only pay for what you use.  Logic Apps are not throttled when using a consumption plan.
All actions executed in a run of a logic app instance are metered.
### What are action executions?
Every step in a logic app definition is an action, which includes triggers, control flow steps like conditions, scopes, for each loops, do until loops, calls to connectors and calls to native actions.
Triggers are special actions that are designed to instantiate a new instance of a logic app when a particular event occurs.  There are several different behaviors for triggers, which could affect how the logic app is metered.
* **Polling trigger** – this trigger continually polls an endpoint until it receives a message that satisfies the criteria for creating an instance of a logic app.  The polling interval can be configured in the trigger in the Logic Apps designer.  Each polling request, even if it doesn’t create an instance of a logic app, counts as an action execution.
* **Webhook trigger** – this trigger waits for a client to send it a request on a particular endpoint.  Each request sent to the webhook endpoint counts as an action execution. The Request and the HTTP Webhook trigger are both webhook triggers.
* **Recurrence trigger** – this trigger creates an instance of the logic app based on the recurrence interval configured in the trigger.  For example, a recurrence trigger can be configured to run every three days or even every minute.
Trigger executions can be seen in the Logic Apps resource blade in the Trigger History part.
All actions that were executed, whether they were successful or failed are metered as an action execution.  Actions that were skipped due to a condition not being met or actions that didn’t execute because the logic app terminated before completion are not counted as action executions.

Actions executed within loops are counted per iteration of the loop.  For example, a single action in a for each loop iterating through a list of 10 items will be counted as the count of items in the list (10) multiplied by the number of actions in the loop (1) plus one for the initiation of the loop, which, in this example, would be (10 * 1) + 1 = 11 action executions.
Logic Apps that are disabled cannot have new instances instantiated and therefore while they are disabled are not charged.  Be mindful that after disabling a logic app it may take a little time for the instances to quiesce before being completely disabled.
### Integration Account Usage
Included in consumption based usage is an [integration account](https://docs.microsoft.com/en-us/azure/app-service-logic/app-service-logic-enterprise-integration-create-integration-account?toc=%2fazure%2flogic-apps%2ftoc.json) for exploration, development and testing purposes allowing you to use the [B2B/EDI](https://docs.microsoft.com/en-us/azure/app-service-logic/app-service-logic-enterprise-integration-b2b?toc=%2fazure%2flogic-apps%2ftoc.json) and [XML processing](https://docs.microsoft.com/en-us/azure/app-service-logic/app-service-logic-enterprise-integration-xml?toc=%2fazure%2flogic-apps%2ftoc.json) features of Logic Apps at no additional cost. You are able to create a maximum of one account per region and store up to 10 Agreements and 25 maps. Schemas, certificates and partners have no limits and you can upload as many as you need.

In addition to the inclusion of integration accounts with consumption you can also create standard integration accounts without these limits and with our standard Logic Apps SLA. See [here](https://azure.microsoft.com/pricing/details/logic-apps) for further details.
## App Service plans
Logic apps previously created referencing an App Service Plan will continue to behave as before. Depending on the plan chosen, are throttled after the prescribed daily executions are exceeded but are billed using the action execution meter.
EA customers that have an App Service Plan in their subscription, which does not have to be explicitly associated with the Logic App, get the included quantities benefit.  For example, if you have a Standard App Service Plan in your EA subscription and a Logic App in the same subscription then you aren't charged for 10,000 action executions per day (see following table). 

App Service Plans and their daily allowed action executions:
|  | Free/Shared/Basic | Standard | Premium |
| --- | --- | --- | --- |
| Action executions per day |200 |10,000 |50,000 |
### Convert from App Service Plan pricing to Consumption
To change a Logic App that has an App Service Plan associated with it to a consumption model, remove the reference to the App Service Plan in the Logic App definition.  This change can be done with a call to a PowerShell cmdlet:
`Set-AzureRmLogicApp -ResourceGroupName ‘rgname’ -Name ‘wfname’ –UseConsumptionModel -Force`
## Pricing
For pricing details, see [Logic Apps Pricing](https://azure.microsoft.com/pricing/details/logic-apps/).
## Next steps
* [An overview of Logic Apps][whatis]
* [Create your first logic app][create]
[pricing]: https://azure.microsoft.com/pricing/details/logic-apps/
[whatis]: app-service-logic-what-are-logic-apps.md
[create]: app-service-logic-create-a-logic-app.md

