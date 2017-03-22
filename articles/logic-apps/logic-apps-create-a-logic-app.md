---
title: Create your first workflow with Azure Logic Apps | Microsoft Docs
description: Get started automating processes between cloud-based SaaS apps and services with Azure Logic Apps
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
ms.date: 01/25/2017
ms.author: jehollan

---
# Create your first workflow to automate processes for cloud apps and services

In just a few minutes, you can create a basic workflow 
that automates a process between cloud services with 
[Azure Logic Apps](logic-apps-what-are-logic-apps.md). 
For example, this sample logic app sends email to your Outlook account 
when new content appears in a website's RSS feed.

Before you start, you need these items:

* An Azure subscription for 
[billing logic app actions](./logic-apps-pricing.md). 
Learn more about [pricing for Azure Logic Apps](https://azure.microsoft.com/pricing/details/logic-apps/).

	If you don't have a subscription, 
	you can [start with a free Azure account](https://azure.microsoft.com/free/). 
	Otherwise, [sign up for a Pay-As-You-Go subscription](https://azure.microsoft.com/pricing/purchase-options/).

* A mail account at either Outlook.com, Office 365, or Gmail

* The link to the RSS feed for a website. This example uses 
the RSS feed for MSDN Channel 9:`https://s.ch9.ms/Feeds/RSS`

## Add a trigger that starts your workflow

1. Sign in to the [Azure portal](https://portal.azure.com "Azure portal").

2. From the left menu, choose **New (+)** > **Enterprise Integration** > **Logic App**.

	![Azure portal, New, Enterprise Integration, Logic App](media/logic-apps-create-a-logic-app/azure-portal-create-logic-app.png)

   > [!TIP]
   > You can also choose **New** to show the search box, 
   > and enter "logic app" for your filter. 
   > Then choose **Logic App** > **Logic App** > **Create**.

3. Name your logic app, select your Azure subscription, 
the location for hosting your logic app, 
and an Azure resource group for organizing and 
managing resources related to an Azure solution.
When you're ready, choose **Create**.

	![Logic app details](media/logic-apps-create-a-logic-app/logic-app-settings.png)

   > [!NOTE]
   > If you select **Pin to Dashboard**,
   > your logic app appears on the Azure dashboard, 
   > and opens automatically after deployment. 
   > If your logic app doesn't appear on the dashboard, 
   > on the left menu, choose **More services** > **Logic Apps**, 
   > and select your logic app.

4. When you open your logic app for the first time, 
the Logic Apps Designer shows templates that 
you can select to get started. 
For now, choose **Blank Logic App** so you can 
build your logic app from scratch.

	The Logic App Designer appears and shows a 
	list of services and *triggers* that you can select. 
	You must first select a trigger as the first item 
	that your logic app needs. The trigger is the event 
	that starts your logic app.

5. In the search box for services and triggers, 
find and select this trigger: **RSS - When a feed item is published** 

	![RSS trigger](media/logic-apps-create-a-logic-app/rss-trigger.png)

6. Enter the link for the website's RSS feed that you want to track. 

	If you want, change the **Frequency** and **Interval** 
	that determine how often your logic app checks for 
	new items and returns all items during that time span.

	For this example, we want to check every 7 days for new 
	items posted to the MSDN Channel 9 website.

	![Set up trigger with RSS feed, frequency, and interval](media/logic-apps-create-a-logic-app/rss-trigger-setup.png)

7. Save your changes. On the designer toolbar, choose **Save**.

	![Save your logic app](media/logic-apps-create-a-logic-app/save-logic-app.png)

	Your logic app is now live and periodically checks 
	for new items in the specified RSS feed. However, 
	to make this scenario more interesting, we add an action.

## Add an action that responds to your trigger

1. Under your trigger in the designer, choose **New step** > **Add an action**. 
You can now browse or search for [available connectors](../connectors/apis-list.md), 
and select an action to perform when your trigger fires.

	![Add an action](media/logic-apps-create-a-logic-app/add-new-action.png)

2. We want to send mail when new items appear in the RSS feed. 
Based on the mail account that you have, follow the steps for Outlook or Gmail.

	*	To send mail to your Outlook inbox, 
	in the search box, enter **outlook**. 
	Under **Services**, select either **Outlook.com** 
	or **Office 365 Outlook**. Under **Actions**, 
	select **Send an email**.

		![Choose Outlook action to send email](media/logic-apps-create-a-logic-app/actions.png)

	*	To send mail to your Gmail inbox, 
	in the search box, enter **gmail**. 
	Under **Actions**, select **Gmail - Send email**.

		![Choose "Gmail - Send email"](media/logic-apps-create-a-logic-app/actions-gmail.png)

3. When you're prompted for your credentials, 
sign in with your mail account's username and password. 

4. Choose the parameters for the data outputs to include in your email.

	![Select outputs to include in email](media/logic-apps-create-a-logic-app/rss-action-setup.png)

	When you're done, if you chose Outlook, 
	your logic app should look similar to this example:

	![Completed logic app](media/logic-apps-create-a-logic-app/save-run-complete-logic-app.png)

5. Save your changes. (On the designer toolbar, choose **Save**)

	Now when your logic app checks your specified RSS feed and 
	finds new items, your logic app sends an email with the 
	selected outputs to your mail account.

6. To manually start or trigger your logic app at any time, 
choose **Run** on the designer toolbar.

## Manage your logic app after creation

Follow these steps to check on your logic app, 
or turn off your logic app.

1. Sign in to the [Azure portal](https://portal.azure.com "Azure portal").

2. On the left menu, choose **More services** > **Logic Apps**.

3. To check your logic app's current status and general information, 
select your logic app.

4. To edit your new logic app, choose **Edit**.

5. To turn off the app, choose **Disable** in the command bar.

6. View run and trigger histories to monitor when your logic app is running. 
You can click **Refresh** to see the latest data.

In less than 5 minutes, you set up a basic logic app running in the cloud. 
To learn more about using Logic Apps features, see [Use logic app features]. 
To learn about the Logic App definitions themselves, see 
[author Logic App definitions](../logic-apps/logic-apps-author-definitions.md).

<!-- Shared links -->
[Azure portal]: https://portal.azure.com
[Use logic app features]: logic-apps-create-a-logic-app.md
