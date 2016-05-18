<properties
   pageTitle="Using Azure Functions with Logic Apps | Microsoft Azure"
   description="See how to use Azure Functions with Logic Apps"
   services="app-service\logic"
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

You can execute custom snippets of C# or Node.js by leveraging Azure Functions from with a Logic App.  [Azure Functions](https://azure.microsoft.com/) is an offering that allows serverless compute in Microsoft Azure.  This is useful within Logic Apps for many of the following scenarios below:

* Formatting a value of an action (e.g. convert from DateTime to a date string)
* Performing calculations within a workflow
* Extending Logic Apps functionality with functions supported in C# or Node.js

## Creating an Azure Function for Logic Apps

It's recommended that you create a new Azure Function in the functions portal using the "Generic Node Webhook" or "Generic C# Webhook" templates.  This will auto-populate a template that accepts `application/json` from a Logic App, and functions using these templates will automatically be discovered and listed in the Logic Apps designer under "Azure Functions in my region."

Webhook functions accept a request and pass it into the method via a `data` variable.  You can access properties of your payload using dot notation like `data.foo`.  For example, a simple javascript function that converts a DateTime value into a date string looks as follows:

```
function start(req, res){
    var data = req.body;
    res = {
        body: data.date.ToDateString();
    }
}
```

## Calling Azure Functions from a Logic App

In the designer, if you click the dropdown menu for actions you can select "Azure Functions in my Region."  This will list the containers in your subscription, and allow you to choose the function you wish to call.  After selecting, you will be prompted to specify an input payload object.  This is the message the Logic App will send to the function, and must be a JSON object.  For example, if I wanted to pass in the "Last Modified" date from a salesforce trigger, the function payload could look like this:

![][1]

## Triggering Logic Apps from an Azure Function

It is also possible to trigger a Logic App from within a function.  To do this, simply create a Logic App with a manual trigger (details [here](app-service-logic-http-endpoint.md)).  Then within your Azure Function, generate an HTTP POST to the manual trigger URL with the payload you wish to send into the Logic App.

### Creating a Function from the Designer

You can also create a node.js webhook function from within the designer.  First, select "Azure Functions in my Region" and choose a container for your function.  If you do yet have a container you will need to create from the [Azure Functions Portal](https://functions.azure.com/signin).  You can then select "Create New."  In order to generate a template based on the data you wish to compute, please specify the context object you plan to pass into a function.  This must be a JSON object.  For example, if I am passing in the file content from an FTP action my context payload would look like this:

![][2]

>[AZURE.NOTE] Since this object wasn't cast as a string by adding quotes, the content will be added directly to the JSON payload.  This will error out if it is not JSON token (i.e. a string or JSON object/array).  To cast as a string, simply add quotes as the Salesforce example above.

The designer will then create a generate a function template you can create inline.  Variables are pre-created based on the context you plan to pass into the function.

<!--Image references-->
[1]: ./media/app-service-logic-azure-functions/callFunction.png
[2]: ./media/app-service-logic-azure-functions/createFunction.png