<properties 
	pageTitle="Create a business process" 
	description="Create a business process" 
	authors="stepsic-microsoft-com" 
	manager="dwrede" 
	editor="" 
	services="app-service-logic" 
	documentationCenter=""/>



<tags
	ms.service="app-service-logic"
	ms.workload="web"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="02/24/2015"
	ms.author="stepsic"/>

# Developing a business process using Flow and API apps

You’ve created a basic flow, but now you want to get serious and make a business process using Flow apps. I will cover several key topics in this article:

- Add conditional logic (for example, only execute an action if a certain condition is met) and adding loops
- BizTalk API apps
- Using the Code view to edit a flow
- The different types of triggers

To get started, click here to create an item in your subscription that has a basic flow already filled it out. Once you’ve created this flow, click on triggers and actions to edit it.

## Adding conditional logic and adding loops

Although the basic flow works fine, you may have noticed a couple problems with it. First, it only will email you the top tweet, not all of the tweets on the keyword. In order to repeat an action for a list of items you can use the “repeat” property.

### Repeating

Repeat takes a list of items and executes the action for each item in that list. To use repeat, click the circular arrow icon at the top of the action. This will open up a text box, and type:

    @triggers().outputs.body

As with the basic flow, this outputs a list of tweets. Then to actually use the tweet inside the action, replace the message with this:

    @repeatItem().message

“repeatItem()” is a function that will give you each element in the list. Click the check mark.

### Conditional

Now, this flow still may be annoying because it will result in a lot of emails. You can add more logic so that you can only receive an email when the person making the tweet has a certain number of followers. To do that, click the diamond icon at the top of the action. 

Inside the text box type:

    @greaterThan(repeatItem().person.followers, 1000)

This shows you the repeatItem() function, but also a new function called greaterThan(). This function compares two values and will only allow the action to be executed if the first is bigger than the second. Notice the syntax for getting the followers – for each property you’re interested in add a dot followed by the property name. Click the check mark to save the condition.

## BizTalk API apps

There are a few different categories of API apps available in Azure. Twitter and Office 365 are great connectors for this scenario, but there are also a number of API apps provided by BizTalk that you can leverage in your flow.

Click on the XXXXXX service in the right-hand pane. This will add this service, powered by BizTalk to the designer.

### Passing data between actions

In order to use more than one action in a flow, you have to pass data between the actions. The way to do this is with the actions() function. 

Once you’ve added the XXXXXX action, type:

    @actions(‘SendMail’).outputs.YYYYYY

This will flow the YYYYYY property from the outputs of the SendMail action. You can always see the name of an action by looking right underneath the icon for that action. Likewise, you can see all of the outputs for that action at the bottom of the box.

## Using the Code view to edit a flow

In addition to the designer, you can directly edit the definition of a flow by hand. To do this, click on the Code view button in the command bar. This will open up a full editor that shows you the definition of the flow that you just edited.

A text editor can make certain operations easier, for example, you can copy and paste any number of actions within the same flow (or even between flows). You can also easily add or remove entire sections from the flow at once.

### Parameters

There are also some capabilities that are only exposed in the code view, one example of this is parameters. Parameters make it easy to re-use values throughout a flow. For example, if you have an email address that you want include in several actions, you can make that a parameter.

To define parameters, go to the parameters {} object and add inside of it:
    “emailAddress” : {
	    “type” : “string”,
	    “defaultValue” : “me@example.com”
    }

Now, scroll to the send email action. You’ll see the input for the to email there, replace your email with:

    @parameters(‘emailAddress’)

Parameters are a good way to pull out values that you are likely to change a lot.

## Different types of triggers

There are a few different ways to start flows, each has slightly different behavior so be sure to select the right one for your scenarios.

### Polling triggers

Some triggers check on an API app based on some interval. You can define that interval, but you also need to pass a field called “triggerState”. Trigger state is information to pass to the invocation of the trigger so that it knows what it returned the previous time it checked. Trigger state will usually be the string:

    @triggers().outputs.body.triggerState

### Callback triggers

Other triggers, call the flow back when they have a new request. In this case, you need to give the trigger the callback URI of your flow. To get this copy the access endpoint from the Properties blade from the Settings screen when you navigate to a flow. 

### Manually invoking

Third, you can have a flow that you just run manually. In the portal there is a Run button that you can click to kick off a flow. 
