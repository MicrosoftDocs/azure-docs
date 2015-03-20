<properties 
	pageTitle="Create a Logic App" 
	description="Get started with creating a basic Logic App" 
	authors="stepsic-microsoft-com" 
	manager="dwrede" 
	editor="" 
	services="app-service\logic" 
	documentationCenter=""/>

<tags
	ms.service="app-service-logic"
	ms.workload="integration"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/10/2015"
	ms.author="stepsic"/>

#Create a Logic App
You can get started with Logic Apps in just a few minutes. In this scenario, we'll walk  through how you can get a record of Tweets that you’re interested in delivered right to a Dropbox folder.

To use this scenario you will need:

- An Azure subscription
- A Twitter account
- A Dropbox account

##The Basics

First, go to the Azure portal and sign in to your Azure subscription. 

Once you’ve signed in click on the + New button at the bottom-left of the screen. This will let you choose from any of the Azure services, but for today, go to **Web + Mobile** and then choose Logic App. 

When you click on Logic App, you’ll have to fill out some basic settings to get started:

1. Name your Logic App something you’ll remember

2. Choose the App Service Plan that you’ll use to pay for your Logic App. Note: you can choose Free, but Free Logic Apps can only use 1000 actions per month.

3. Choose the Resource group for your flow – resource groups act as containers for your apps – all of the resources for your app will go to the same resource group.

4. Choose which Azure subscription you’d like to use.

5. Choose a location to run your Logic app.

![Basics](./media/app-service-logic-create-a-logic-app/createlogicapp.png)

Once you’ve filled out the basic settings, you can add Triggers and Actions. Click there to get started.

## Adding a trigger

Triggers are what make your Logic App run. The simplest trigger is a Recurrence trigger.

After clicking the Triggers and Actions selector you’ll see a full-screen designer that will display your flow. On the right-hand side is a list of all possible services that have Triggers. First, find **Recurrence** in this pane and click it. This will add a box  where you can fill out the settings. Choose your recurrence frequency (for example, every 1 hour) and hit the green checkmark.

![Recurrence](./media/app-service-logic-create-a-logic-app/recurrence.png)

## Adding a Twitter action

Actions are what your flow does. You can have any number of actions, and you can organize them so that information from one action is passed to the next.

Next, click on TwitterConnector in the right-hand pane. This will cause the connector to be created in the Resource group and App Service Plan that you selected previously. This may take a minute or two. 

Once the creation has completed, you should see an **Authorize** button. Click this button to grant the connector access to your Twitter account. Now you will see a list of possible operations the Twitter Connector has. Choose **Search tweets**.

![Actions](./media/app-service-logic-create-a-logic-app/actions.png)

You should now see a box to enter your query. For example, could you type `#MicrosoftAzure` here. After you’ve filled this out, click the green checkmark.

![Twitter search](./media/app-service-logic-create-a-logic-app/twittersearch.png)

## Adding a Dropbox action

We will have just one more action: Upload to dropbox. Find Dropbox in the right-hand pane and click it. 

![Authorize](./media/app-service-logic-create-a-logic-app/authorize.png)

Like with Twitter, click the green checkmark and authorize. 

Select **Upload file**, and you'll see the inputs for that operation. Now you need to pass the data from the Twitter search Dropbox. 

Field                     | Enter...
------------------------- | ---
File path                 | `/tweet.txt`
Content                   | Click the `...` button and select the **Tweet text** option. This will enter `@first(actions('twitterconnector').outputs.body).TweetText` into the text box.
Content transfer encoding | `none`
Overwrite                 | `false`

The most complex function here is in the Content field. Let’s break this content down:

- The `@` means that you are entering a function (rather than an actual value)
- `actions('twitterconnector').outputs.body` will give you the list of tweets that were found
- `first()` is because the Search Tweets action returns back a list, but you only want to upload one file
- Last, `.TweetText` will select the message property tweet

![Dropbox](./media/app-service-logic-create-a-logic-app/dropbox.png)

Click on the **OK** button at the bottom of the screen. Finally, choose the **Create** button. That’s it!

## Managing your Logic App after creation

Now your Logic App is alive! Every time it sees a tweet with that keyword you’ll get that in your dropbox. But what if you want to turn off the Logic App, or see how it’s doing. 

Click on Browse at the left side of the screen and select Logic Apps. You’ll see the name that you entered when you first created it. 

Now you can see all the details. Click the Triggers and Actions part to edit the Logic app you created. Or you can turn it off by clicking **Disable** in the command bar.

In less than 5 minutes you were able to set up a simple Logic App running in the cloud. To learn more about using Logic App features, see [Use Logic App Features](](../app-service-logic-use-logic-app-features/)).
