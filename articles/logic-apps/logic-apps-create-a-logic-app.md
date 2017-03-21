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
This example logic app sends you email about new 
content from an RSS feed to your Outlook account.

Before you start, you need these items:

* An Azure subscription for 
[billing logic app actions](./logic-apps-pricing.md). 
Learn more about [pricing for Azure Logic Apps](https://azure.microsoft.com/pricing/details/logic-apps/).

	If you don't have a subscription, 
	you can [start with a free Azure account](https://azure.microsoft.com/free/). 
	Otherwise, [sign up for a Pay-As-You-Go subscription](https://azure.microsoft.com/pricing/purchase-options/).

* A Outlook.com or hosted Office 365 mailbox

* A link to the RSS feed for a website. This example uses 
the RSS feed for MSDN Channel 9:`https://s.ch9.ms/Feeds/RSS`

## Create a logic app workflow to email you new website content

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

7. Now we add an action to perform when new items appear in the RSS feed. 
Choose **New step** > **Add an action**.

	When you select **Add an Action**, you can browse, search, and 
	select actions from [available connectors](../connectors/apis-list.md). 

8. In the search box, enter **outlook**. 
To send mail to your Outlook inbox, 
select **Outlook.com** or **Office 365 Outlook**. 
Then select the **Send an email** action.

	![Actions](media/logic-apps-create-a-logic-app/actions.png)

9. When you're prompted for Outlook credentials, 
sign in with your Outlook username and password. 

10. Choose the parameters for outputs to include in your email.

	![Select outputs to include in email](media/logic-apps-create-a-logic-app/rss-action-setup.png)

11. Choose **Save**, and then to manually test your logic app, 
choose **Run**.

Your logic app is now up and running, 
periodically checking for tweets with your specified search term. 
If your logic app finds a matching tweet, your logic app sends you an email.

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
