<properties
	pageTitle="Create a Logic App | Microsoft Azure"
	description="Learn how to create a Logic App connecting SaaS services"
	authors="stepsic-microsoft-com"
	manager="dwrede"
	editor=""
	services="app-service\logic"
	documentationCenter=""/>

<tags
	ms.service="app-service-logic"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="03/16/2016"
	ms.author="stepsic"/>

# Create a new logic app connecting SaaS services

| Quick Reference |
| --------------- |
| [Logic Apps Definition Language](https://msdn.microsoft.com/library/azure/dn948512.aspx?f=255&MSPPError=-2147217396) |
| [Logic Apps Connector Documentation](https://azure.microsoft.com/documentation/articles/app-service-logic-connectors-list/) |
| [Logic Apps Forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps) |

This topic demonstrates how, in just a few minutes, you can get started with [App Services Logic Apps](app-service-logic-what-are-logic-apps.md). We'll walk through a workflow that lets you deliver a set of Tweets that you’re interested in to a mailbox.

To use this scenario, you need:

- An Azure subscription
- A Twitter account
- An Office 365 account

## Create a new logic app to email you tweets

1. On the Azure portal dashboard, select **Marketplace**. 
2. In Everything, search for 'logic apps', and then select **Logic App (preview)**. You can also select **New**, **Web + Mobile**, and select **Logic App (preview)**. 
3. Enter a name for your logic app, select the app service plan, and select **Create**.  
	In this step, we're assuming you have an app service plan and are familiar with the required properties. If not, no worries, you can start at [Azure App Service plans in-depth overview](azure-web-sites-web-hosting-plans-in-depth-overview.md). 

4. When the logic app opens for the first time you'll need a trigger. Search for **twitter** in the trigger search box, and select it.

7. Now you'll type which keyword you want to search twitter for. 
	![Twitter search](./media/app-service-logic-create-a-logic-app/twittersearch.png)

5. Select the plus sign, and then choose **Add an action** or **Add a condition**:  
	![Plus](./media/app-service-logic-create-a-logic-app/plus.png)
6. When you select **Add an Action**, all the connectors with their available actions are listed. You can then choose which connector and action to add to your logic app. For example, you can select **Office 365 - Send Email**, and more Office 365 actions:  
	![Actions](./media/app-service-logic-create-a-logic-app/actions.png)

7. Now you have to fill out the parameters for the email you want:
	![Parameters](./media/app-service-logic-create-a-logic-app/parameters.png)

8. Finally, you can select **Save** to make your logic app live.

## Manage your logic app after creation

Now your logic app is up and running. Every time the scheduled workflow runs, it checks for tweets with the  specific hashtag. When it finds a matching tweet, it puts it in your Dropbox. Finally, you'll see how to disable the app, or see how it’s doing.

1. Click **Browse** on the left side of the screen and select **Logic Apps**.

2. Click the new logic app that you just created to see current status and general information.

3. To edit your new logic app, click **Triggers and Actions**.

5. To turn off the app, click **Disable** in the command bar.

In less than 5 minutes you were able to set up a simple logic app running in the cloud. To learn more about using Logic Apps features, see [Use logic app features]. To learn about the Logic App definitions themselves, see [author Logic App definitions](app-service-logic-author-definitions.md).

<!-- Shared links -->
[Azure portal]: https://portal.azure.com
[Use logic app features]: app-service-logic-create-a-logic-app.md
