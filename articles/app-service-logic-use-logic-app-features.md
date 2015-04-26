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
	ms.date="03/20/2015"
	ms.author="stepsic"/>
	
# Use Logic Apps features

In the [previous topic][Create a new logic app], you created your first logic app. Now we will show you how to build a more complete process using App Services Logic Apps. This topic introduces the following new Logic Apps concepts:

- Conditional logic, which executes an action only when a certain condition is met.
- Repeating actions.
- Code view to edit an existing logic app.
- Options for starting a workflow.

Before you complete this topic, you should complete the steps in [Create a new logic app]. In the [Azure portal], browse to your logic app and click **Triggers and Actions** in the summary to edit the logic app definition.

## Adding conditional logic and a repeat

Although the original flow works, there are some areas that could be improved. First, the action only sends you the top tweet returned. Logically, you would want to receive all of the tweets with the keyword. To repeat an action for a list of items, such as the returned tweets, you must use the `repeat` property.

### Repeating
Repeat takes a list of items and executes the action for each item in that list. The following steps update the existing action to use repeats, which makes more sense for a list of tweets.

1. Return to the workflow you created and click the **Definition** link in the **Essentials**. 

2. To edit the **Dropbox connector** action, click the pencil icon.

3. Click on the gear icon, and select **Repeat over a list**. 
 
2. Next to the **Repeat** box click the `...` and select **Body**. This will input:

    	@body('twitterconnector')

	Into the text box. This function outputs a list of tweets. 

3. Select all of the text in the **Content** text box and delete it. Then, click the `...` and select **Tweet Text**. This will insert the **repeatItem()** function, which returns each element in the list. 

Finally, note that the outputs of repeating actions are special. If you wanted to reference the results of the Dropbox operation, for example, you could *not* do the normal `@actions('dropboxconnector').outputs.body`, you would instead do: `@actions('dropboxconnector').outputs.repeatItems`. This returns a list of all of the times that the operation ran, along with the outputs of each. For example, `@first(actions('dropboxconnector').outputs.repeatItems).outputs.body.FilePath` will return the path of the first file uploaded.

### Conditional
This logic app still results in a lot of files being uploaded to Dropbox. The following steps add additional logic to make sure that you only receive a file when the tweet has a certain number of retweets. 

1. Click the gear icon at the top of the action and select **Add a condition to be met**.

2. In the text box, type the following:

    	@greater(repeatItem().Retweet_Count , 5)
    
	The function **greater** compares two values and only allows the action to be executed when the first value is greater than the second value. You access a given property as a dot (.) followed by the property name, such as `.Retweet_Count` above. 

3. Click the check mark to save the Dropbox action.

## Using the code view to edit a Logic App

In addition to the designer, you can directly edit the code that defines a logic app, as follows. 

1. Click on the **Code view** button in the command bar. 

	This opens a full editor that shows the definition you just edited.

	![Code view](./media/app-service-logic-use-logic-app-features/codeview.png)

    By using the text editor, you can copy and paste any number of actions within the same logic app or between logic apps. You can also easily add or remove entire sections from the definition, and you can also share definitions with others.

2. After you make your changes in code view, simply click **Save**. 

### Parameters
There are some capabilities of Logic Apps that can only be used in the code view. One example of these is parameters. Parameters make it easy to re-use values throughout your logic app. For example, if you have an email address that you want use in several actions, you should define it as a parameter.

The following updates your existing logic app to use parameters for the query term.

1. In the code view, locate the `parameters : {}` object and insert the following topic object:

	    "topic" : {
		    "type" : "string",
		    "defaultValue" : "MicrosoftAzure"
	    }
    
2. Scroll to the `twitterconnector` action, locate the query value and replace it with `@concat('#', parameters('topic'))`.
	The  **concat** function joins together two or more strings. 
 
3. Finally, go to the `dropboxconnector` action and add the topic parameter, as follows:

    	@concat('/tweets/', parameters('topic'), '/',repeatItem().TweetID,'.txt')

Parameters are a good way to pull out values that you are likely to change a lot. They are especially useful when you need to override parameters in different environments. For more information on how to override parameters based on environment, see our [REST API documentation](http://go.microsoft.com/fwlink/?LinkID=525617&clcid=0x409).

Now, when you click **Save**, every hour you will get any new tweets that have more than 5 retweets delivered to a folder called **tweets** in your Dropbox.

## Starting a logic app workflow
There are several different options for starting the workflow defined in you logic app. A workflow can always be started on-demand in the [Azure portal].

### Recurrence triggers
A recurrence trigger run at an interval that you specify. When the trigger has conditional logic, the trigger determines whether or not the workflow needs to run. A trigger indicates it should run by returning a `200` status code. When is does not need to run, it returns `202` status code.

### Callback using REST APIs
Services can call a logic app endpoint to start a workflow. You can find the endpoint to access by navigating to the **Properties** blade from the **Settings** command bar button in your logic app. 

You can use this callback to invoke a logic app from inside your custom application. You need to use **Basic** authentication. The username of `default` is created for you, and the password is the **Primary Access Key** field on the **Properties** blade. For example: 

        POST https://default:<<your primary access key>>@<< your endpoint>>/run?api-version=2015-02-01-preview
        Content-type: application/json
        {
            "name" : "nameOfTrigger",
            "outputs" : { "property" : "value" }
        }

You can pass outputs to the workflow and reference them in the workflow. For example, with the above trigger, if you include `@triggers().outputs.property` you will get `value`.

For more information, see [the REST documentation](http://go.microsoft.com/fwlink/?LinkID=525617&clcid=0x409). 

### Manual execution
You can define a logic app that does not have a trigger. In this case the workflow must be started on-demand. This kind of logic app is best suited for a process that only needs to run intermittently. To create a logic app without a trigger, check the **Run this logic manually** in the **Start logic** box in the designer. 

To start logic app on-demand, click the **Run now** button on the command bar. 

<!-- Shared links -->
[Create a new logic app]: app-service-logic-create-a-logic-app.md
[Azure portal]: https://portal.azure.com