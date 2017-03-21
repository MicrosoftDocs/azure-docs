---
title: Create workflows with your first Azure Logic App | Microsoft Docs
description: Get started connecting apps and SaaS services with your first Logic App
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
# Create your first logic app to connect cloud services

In just a few minutes, you can create and get started with [Azure Logic Apps](logic-apps-what-are-logic-apps.md). 
We'll walk through a basic workflow that lets you send interesting tweets to your email.

Before you start, you need these items:

* An Azure subscription
* A Twitter account
* A Outlook.com or hosted Office 365 mailbox

## Create a new logic app to email you tweets

1. Sign in to the [Azure portal](https://portal.azure.com "Azure portal").

2. From the left menu, choose **New** > **Enterprise Integration** > **Logic App**.

   > [!TIP]
   > You can also choose **New** to show the search box, 
   > and enter "logic app" for your filter. 
   > Then choose **Logic App** > **Logic App** > **Create**.

3. Name your logic app, select your Azure subscription for billing, 
a datacenter location for hosting your logic app, and the Azure resource group. 
When you're ready, choose **Create**. 

   > [!NOTE]
   > If you select **Pin to Dashboard**,
   > your logic app appears on the Azure dashboard, 
   > and opens automatically after deployment. 
   > If your logic app doesn't appear on the dashboard, 
   > choose **Logic Apps** on the left menu, and select your logic app.

4. When you open your logic app for the first time, 
the Logic Apps Designer shows templates that 
you can select to get started. 
For now, choose **Blank Logic App** so you can 
build your logic app from scratch.

	The Logic Apps Designer opens and shows a list of 
	services and *triggers* that you can select. 
	You must first select a trigger as the first item 
	that your logic app needs. The trigger is the event 
	that starts your logic app.

5. In the search box, find and select **twitter**. 
Sign in with your Twitter credentials.

6. Now type a search term to trigger your logic app.

	The **Frequency** and **Interval** determines 
	how often your logic app checks for new tweets 
	and return all tweets during that time span.

	![Twitter search](media/logic-apps-create-a-logic-app/twittersearch.png)

7. Choose **New step**, and then either **Add an action** or **Add a condition**.

	When you select **Add an Action**, you can browse, search, and 
	select from [available connectors](../connectors/apis-list.md) 
	to add an action. 	For this example, to send mail from an outlook.com address, 
	select **Outlook.com - Send Email**:

	![Actions](media/logic-apps-create-a-logic-app/actions.png)

9. Enter the parameters for the email you want:

	![Parameters](media/logic-apps-create-a-logic-app/parameters.png)

10. Choose **Save** to make your logic app live.

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
