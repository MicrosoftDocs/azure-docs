<properties 
	pageTitle="Use Logic App features" 
	description="Learn how to use the advanced features of logic apps." 
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
	
# Use Logic App features

You’ve [created a basic Logic App](../app-service-logic-create-a-logic-app/), but now you want to get more serious and make a full process using Logic Apps. We will cover several key topics in this article:

- Add conditional logic (for example, only execute an action if a certain condition is met) and adding loops
- Using the Code view to edit a Logic App
- The different types of triggers

To get started, first walk through this article to create a basic Logic App. Once you’ve created this, click on Triggers and Actions to edit the definition.

## Adding conditional logic and adding repeat

Although the basic flow works fine, you may have noticed a couple gaps with it. First, it only will email you the top tweet, not all of the tweets on the keyword. In order to repeat an action for a list of items you can use the `repeat` property.

### Repeating
Repeat takes a list of items and executes the action for each item in that list. To use repeat, click the gear icon at the top of the **Search twitter** action and select **Repeat over a list**. This will display a text box, and type:

    @actions('twitterconnector').outputs.body

As with the basic flow, this outputs a list of tweets. Then to actually use the tweet inside the action, replace the **Content** with `@repeatItem().TweetText`. The **repeatItem** is a function that will give you each element in the list. 

Also, replace the **File Path** field with `@contact('/',repeatItem(),'.txt')`. The  **concat** function will join 2 or more strings together. Click the check mark to accept the changes.

### Conditional
This Logic App still may still have a problem because it will result in a lot of files being uploaded. You can add more logic so that you only receive a file when the person making the tweet has a certain number of followers. To do that, click the gear icon at the top of the action and select **Add a condition to be met**.

Inside the text box type:

    @greaterThan(repeatItem().Tweeted_By.Followers, 1000)
    
The function **greaterThan** compares two values and will only allow the action to be executed if the first is bigger than the second. Notice the syntax for getting the Followers – for each property you’re interested in, add a dot followed by the property name. Click the check mark to save the condition.

## Using the code view to edit a Logic App

In addition to the designer, you can directly edit the definition of a Logic App by hand. To do this, click on the code view button in the command bar. This will open up a full editor that shows the definition you just edited.

![Code view](./media/app-service-logic-use-logic-app-features/codeview.png)

A text editor can make certain operations easier, for example, you can copy and paste any number of actions within the same Logic App (or even between Logic Apps). You can also easily add or remove entire sections from the definition at once. Also, if someone sends you a definition it can be pasted in the editor.

### Parameters
There are also some capabilities that are only exposed in the code view. One example of these is parameters. Parameters make it easy to re-use values throughout a Logic App. For example, if you have an email address that you want include in several actions, you can make that a parameter.

To define parameters, go to the `parameters : {}` object and add inside of it type:

    "topic" : {
	    "type" : "string",
	    "defaultValue" : "MicrosoftAzure"
    }
    
Now, scroll to the send Twitter action. You’ll see the input for the to query there, replace it with `@parameters('topic')`. You can also go to the Dropbox action and add the topic parameter there:

    @contact('/tweets/', parameters('topic'), '/',repeatItem().TweetID,'.txt')

Parameters are a good way to pull out values that you are likely to change a lot.

Additionally, they are especially useful if you have different environments and you want to override parameters in different environments. Check out our [full REST documentation](http://go.microsoft.com/fwlink/?LinkID=525617&clcid=0x409) on how to override parameters depending on environment.

## Different types of triggers
There are a few different ways to start Logic Apps, each has slightly different behavior so be sure to select the right one for your scenarios.

### Polling or Recurrence triggers
Some triggers check on an API app based on some time interval. You can define that interval, and the Logic App will at most be as responsive as that time.

Note, just because you define an interval of every 1 minute, that does not mean you will see a new run every minute. That's because it's up to the trigger to determine if it has any new data. The way that a trigger indicates it should run is by returning a `200` status code, and it indicates a run should not start by returning `202`.

### Callback
Other services can call the Logic App endpoint when they have a new request. 

You can get the access endpoint by navigating to the **Properties** blade from the **Settings** commandbar button when you navigate to a Logic App. You can use this callback yourself from inside your custom application. See [the REST documentation](http://go.microsoft.com/fwlink/?LinkID=525617&clcid=0x409) on how to invoke a Logic App from your App with a callback.

### Manually invoking
Finally, you can have a Logic App that you just run on-demand. This could include a process that you only want to invoke intermittently. In the commandbar for the Logic App, there is a Run now button that you can click to kick off a Logic App Run. 
