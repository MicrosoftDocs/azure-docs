<properties
   pageTitle="Using Azure Functions with Logic Apps | Microsoft Azure"
   description="See how to use Azure Functions with Logic Apps"
   services="app-service\logic,functions"
   documentationCenter=".net,nodejs,java"
   authors="jeffhollan"
   manager="dwrede"
   editor=""/>

<tags
   ms.service="app-service-logic"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration"
   ms.date="05/14/2016"
   ms.author="jehollan"/>

# Using Azure Functions with Logic Apps

You can run custom snippets of C# or Node.js by leveraging Azure Functions from within a logic app.  [Azure Functions](../azure-functions/functions-overview.md) offers server-less computing in Microsoft Azure. This is useful when doing the following tasks:

* Formatting the value of an action (for example, converting from DateTime to a date string)
* Performing calculations within a workflow
* Extending the functionality of Logic Apps with functions that are supported in C# or Node.js

## Create an Azure Function for Logic Apps

We recommend that you create a new Azure Function in the functions portal by using the **Generic Node Webhook** or the **Generic C# Webhook** templates. This auto-populates a template that accepts `application/json` from a logic app. Functions that use these templates are automatically discovered and listed in the Logic Apps designer under **Azure Functions in my region.**

Webhook functions accept a request and pass it into the method via a `data` variable.  You can access properties of your payload by using dot notation like `data.foo`.  For example, a simple javascript function that converts a DateTime value into a date string looks like the following:

```
function start(req, res){
    var data = req.body;
    res = {
        body: data.date.ToDateString();
    }
}
```

## Call Azure Functions from a logic app

In the designer, if you click the dropdown menu for actions, you can select **Azure Functions in my Region**.  This lists the containers in your subscription, and enables you to choose the function you want to call.  

After selecting the function, you are prompted to specify an input payload object. This is the message the logic app sends to the function, and must be a JSON object. For example, if you wanted to pass in the **Last Modified** date from a salesforce trigger, the function payload could look like this:

![Last modfied date][1]

## Trigger logic apps from an Azure Function

It's also possible to trigger a logic app from within a function.  To do this, simply create a logic app with a manual trigger. For more information, see [Logic apps as callable endpoints](app-service-logic-http-endpoint.md).  Then, within your Azure Function, generate an HTTP POST to the manual trigger URL with the payload you want to send to the logic app.

### Create a Function from the designer

You can also create a node.js webhook function from within the designer. First, select **Azure Functions in my Region,** and then choose a container for your function.  If you don't yet have a container, you need to create one from the [Azure Functions portal](https://functions.azure.com/signin). Then select **Create New**.  

In order to generate a template based on the data you want to compute, specify the context object that you plan to pass into a function. This must be a JSON object. For example, if you pass in the file content from an FTP action, the context payload would look like this:

![Context payload][2]

>[AZURE.NOTE] Since this object wasn't cast as a string, the content will be added directly to the JSON payload. However, it will error out if it is not a JSON token (that is, a string or a JSON object/array). To cast it as a string, simply add quotes as shown in the first illustration in this article.

The designer then generates a function template that you can create inline. Variables are pre-created based on the context you plan to pass into the function.

<!--Image references-->
[1]: ./media/app-service-logic-azure-functions/callFunction.png
[2]: ./media/app-service-logic-azure-functions/createFunction.png
