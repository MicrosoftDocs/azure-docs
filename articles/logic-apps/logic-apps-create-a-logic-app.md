---
title: Create your first workflow between cloud apps & services - Azure Logic Apps | Microsoft Docs
description: Automate processes between software-as-a-service apps and services by creating workflows with Azure Logic Apps
author: jeffhollan
manager: anneta
editor: ''
services: logic-apps
documentationcenter: ''

ms.assetid: ce3582b5-9c58-4637-9379-75ff99878dcd
ms.service: logic-apps
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 03/24/2017
ms.author: jeffhollan; estfan

---
# Create your first logic app workflow to automate processes between cloud apps and services

Without writing any code, you can automate processes between cloud apps and services 
when you create and run workflows with [Azure Logic Apps](logic-apps-what-are-logic-apps.md). 
This first example shows how you can create a basic logic app workflow that checks 
an RSS feed for new content on a website. When new items appear in the website's feed, 
the logic app sends email to an Outlook or Gmail account.

To create and run a logic app, you need these items:

*	An Azure subscription. If you don't have a subscription, you can 
[start with a free Azure account](https://azure.microsoft.com/free/). 
Otherwise, you can [sign up for a Pay-As-You-Go subscription](https://azure.microsoft.com/pricing/purchase-options/).

	Your Azure subscription is used for billing logic app usage. Learn how 
	[usage metering](../logic-apps/logic-apps-pricing.md) and 
	[pricing](https://azure.microsoft.com/pricing/details/logic-apps/) 
	work for Azure Logic Apps.

Also, this example requires these items:

* An Outlook.com, Office 365 Outlook, or Gmail account

* A link to a website's RSS feed. This example uses 
the RSS feed for the [MSDN Channel 9 website](https://channel9.msdn.com/): 
`https://s.ch9.ms/Feeds/RSS`

## Add a trigger that starts your workflow

A trigger is the event that starts your logic app 
and is the first item that your logic app needs.

1. Sign in to the [Azure portal](https://portal.azure.com "Azure portal").

2. From the left menu, choose **New** > **Enterprise Integration** > **Logic App**.

	![Azure portal, New, Enterprise Integration, Logic App](media/logic-apps-create-a-logic-app/azure-portal-create-logic-app.png)

   > [!TIP]
   > You can also choose **New**, then in the search box, 
   > type `logic app`, and press Enter. 
   > Then choose **Logic App** > **Create**.

3. Name your logic app and select your Azure subscription. 
Now create or select an Azure resource group, which helps you organize and 
manage related Azure resources. Finally, select the datacenter location 
for hosting your logic app. When you're done, choose **Create**.

	![Logic app details](media/logic-apps-create-a-logic-app/logic-app-settings.png)

   > [!NOTE]
   > If you select **Pin to dashboard**, 
   > your logic app appears on the Azure dashboard after deployment, 
   > and opens automatically. If your logic app doesn't appear on the dashboard, 
   > on the **All resources** tile, choose **See More**, and select your logic app. 
   > Or on the left menu, choose **More services**. Under **Enterprise Integration**, 
   > choose **Logic Apps**, and select your logic app.

4. When you open your logic app for the first time, 
the Logic App Designer shows templates that 
you can use to get started. 
For now, choose **Blank Logic App** so you can 
build your logic app from scratch.

	The Logic App Designer opens and shows 
	available services and *triggers* that 
	you can use in your logic app.

5. In the search box, type `RSS`, and select 
this trigger: **RSS - When a feed item is published** 

	![RSS trigger](media/logic-apps-create-a-logic-app/rss-trigger.png)

6. Enter the link for the website's RSS feed that you want to track. 

	You can also change **Frequency** and **Interval**. 
	These settings determine how often your logic app checks for 
	new items and returns all items found during that time span.

	For this example, let's check every day for new 
	items posted to the MSDN Channel 9 website.

	![Set up trigger with RSS feed, frequency, and interval](media/logic-apps-create-a-logic-app/rss-trigger-setup.png)

7. Save your changes. (On the designer command bar, choose **Save**.)

	![Save your logic app](media/logic-apps-create-a-logic-app/save-logic-app.png)

	Your logic app is now live. Based on the schedule that you set up, 
	your logic app checks for new items in the specified RSS feed. 

	However, to make this example more interesting, we add an 
	action that your logic app takes after your trigger fires.

## Add an action that responds to your trigger

Now we add an action that sends email when new items appear in the website's RSS feed.

1. In the designer, under your trigger, choose **New step** > **Add an action**. 

	![Add an action](media/logic-apps-create-a-logic-app/add-new-action.png)

	The designer shows [available connectors](../connectors/apis-list.md) so 
	that you can select an action to perform when your trigger fires.

2. Based on your email account, follow the steps for Outlook or Gmail.

	*	To send email to your Outlook account, 
	in the search box, enter `outlook`. 
	Under **Services**, select either **Outlook.com** 
	or **Office 365 Outlook**. Under **Actions**, 
	select **Send an email**.

		![Select Outlook "Send an email" action](media/logic-apps-create-a-logic-app/actions.png)

	*	To send email to your Gmail account, 
	in the search box, enter `gmail`. 
	Under **Actions**, select **Gmail - Send email**.

		![Choose "Gmail - Send email"](media/logic-apps-create-a-logic-app/actions-gmail.png)

3. When you're prompted for credentials, 
sign in with the username and password for your email account. 

4. Provide the details for this action and 
choose parameters for data that you 
want to include in your email. For example:

	![Select data to include in email](media/logic-apps-create-a-logic-app/rss-action-setup.png)

	So if you chose Outlook, 
	your logic app might look like this example:

	![Completed logic app](media/logic-apps-create-a-logic-app/save-run-complete-logic-app.png)

5. Save your changes. (On the designer command bar, choose **Save**.)

6.	Now manually trigger your logic app for testing. 
On the designer command bar, choose **Run**. Otherwise, 
your logic app checks the specified RSS feed 
based on the schedule that you set up.

	If your logic app finds new items, 
	you get an email that includes your selected data. 
	If no new items are found, your logic app "skips" 
	the action that sends you email.

7. To monitor and check your logic app's run and trigger history, 
on your logic app menu, choose **Overview**.

	![Monitor and view logic app run and trigger history](media/logic-apps-create-a-logic-app/logic-app-run-trigger-history.png)

   > [!TIP]
   > If you don't find the data that you expect, on the command bar, 
   > try choosing **Refresh**.

	To learn more about your logic app's status or run and trigger 
	history, or to diagnose your logic app, see 
	[Troubleshoot your logic app](logic-apps-diagnosing-failures.md).

      > [!NOTE]
      > Your logic app continues running until you turn off your app. 
      > To turn off your app for now, on your logic app menu, 
      > choose **Overview**. On the command bar, choose **Disable**.

Congratulations, you just set up and run your first basic logic app. 
You also learned how easily you can create workflows that automate 
processes, and integrate cloud apps and cloud services - all without code.

## Manage your logic app

To check on, edit, turn off, or delete your logic app, 
follow these steps.

1. Sign in to the [Azure portal](https://portal.azure.com "Azure portal").

2. On the left menu, choose **More services**. Under **Enterprise Integration**, 
choose **Logic Apps**. Select your logic app.

	*	To check your app's status and general information, 
	choose **Overview**.

	*	To edit your app, choose **Logic App Designer**.

	*	To turn off your app for now, choose **Overview**. 
	On the command bar, choose **Disable**.

	*	To delete your logic app, choose **Overview**. 
	On the command bar, choose **Delete**. Enter your 
	logic app's name, then choose **Delete**.

## Next steps

*  [Add conditions and run workflows](../logic-apps/logic-apps-use-logic-app-features.md)
*	[Logic app templates](../logic-apps/logic-apps-use-logic-app-templates.md)
*  [Create logic apps from Azure Resource Manager templates](../logic-apps/logic-apps-arm-provision.md)
