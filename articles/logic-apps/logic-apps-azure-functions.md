---
# required metadata
title: Add and run your own custom code in Azure Logic Apps with Azure Functions | Microsoft Docs
description: Learn how you can add and run your own custom code snippets in Azure Logic Apps with Azure Functions
services: logic-apps
ms.service: logic-apps
author: jeffhollan
ms.author: jehollan
manager: jeconnoc
ms.date: 10/18/2016

# optional metatada
ms.reviewer: klam, LADocs
ms.suite: integration
ms.custom: H1Hack27Feb2017
---

# Add and run your own custom code snippets in Azure Logic Apps with Azure Functions

When you want to create and run just enough code 
that addresses a specific problem in your logic apps, 
you can create your own functions by using 
[Azure Functions](../azure-functions/functions-overview.md). 
This service provides the capability for creating and running 
custom code snippets written with Node.js or C# in your logic 
apps without worrying about creating an entire app or the 
infrastructure for running your code. Azure Functions provides 
serverless computing in the cloud and is useful for 
performing tasks such as these examples:

* Extend your logic app's behavior with functions supported by Node.js or C#.
* Perform calculations in your logic app workflow.
* Apply advanced formatting or compute fields in your logic apps.

You can also [call logic apps from inside an Azure function](#call-logic-app).

If you don't have an Azure subscription yet, 
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>. 

## Prerequisites

To follow this article, here are the items you need:

* The logic app where you want to add the function

  If you're new to logic apps, review 
  [What is Azure Logic Apps](../logic-apps/logic-apps-overview.md) 
  and [Quickstart: Create your first logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md).

* A [trigger](../logic-apps/logic-apps-overview.md#logic-app-concepts) 
as the first step in your logic app 

  Before you can add actions for running functions, 
  your logic app must start with a trigger.

* Your Azure function, which you can either 
[create separately outside your logic app](#create-function-external), 
or [create from inside your logic app](#create-function-designer) 
in the Logic App Designer. 

<a name="create-function-external"></a>

## Create functions separately

In the Azure portal, create your Azure function app, 
and then create your Azure function. If you're new to Azure Functions, see 
[Create your first function in the Azure portal](../azure-functions/functions-create-first-azure-function.md), 
but note these requirements for creating Azure functions 
that you can add and call from logic apps.

* Make sure you select either template: 

  * **Generic webhook - JavaScript** 
  * **Generic webhook - C#**

  These templates can accept content that has 
  `application/json` type from your logic app. 
  Also, these templates help the Logic App Designer 
  find and show the functions you create from these 
  templates when you go to add them to your logic apps.

  ![Generic webhook - JavaScript or C#](./media/logic-apps-azure-functions/generic-webhook.png)

* After you create your function, check these properties. 

  1. In the **Function Apps** list under your function's name, 
  select **Integrate**. 

  2. Check that your template has the **Mode** property 
  set to **Webhook** and the **Webhook type** property 
  set to **Generic JSON**. 

     ![Function's "Integrate" properties](./media/logic-apps-azure-functions/function-integrate-properties.png)

  Webhook functions accept HTTP requests and pass those 
  requests into your function as a `data` variable. 
  For example, suppose you have this basic JavaScript 
  function that converts a DateTime value into a date string:

  ```javascript
  function start(req, res){
     var data = req.body;
     res = {
        body: data.date.ToDateString();
     }
  }
  ```

  To access the payload's properties, you can use dot notation, 
  for example: 

  `data.function-name` 

When you're ready, follow the steps for 
[Add functions to logic apps](#add-function-logic-app).

<a name="create-function-designer"></a>

## Create functions within logic apps

From within your logic app on the Logic App Designer, 
you can also create Azure functions.

1. In the Azure portal, open your logic app in the Logic App Designer. 

2. Under the step where you want to create and add the function, 
choose **New step** > **Add an action**. 

3. In the search box, enter "azure functions" as your filter.
From the actions list, select this action: 
**Azure Functions - Choose an Azure function** 


Then select **Create New**.  


4. Select the function app container you want, 
and then select this action: 
**Azure Functions - Create New Function**

   If you don't have a function app container yet, 
   you must create the function app separately from the 
   [Azure Functions portal](https://functions.azure.com/). 

Select **Azure Functions in my Region,** 
and then choose a container for your function. 

To generate a template based on the data that you want to compute, 
specify the context object that you plan to pass into a function. 
This object must be a JSON object. For example, 
if you pass in the file content from an FTP action, 
the context payload looks like this example:

![Context payload][2]

> [!NOTE]
> Because this object wasn't cast as a string, 
> the content is added directly to the JSON payload. 
> However, an error occurs if the object is not a JSON token 
> (that is, a string or a JSON object/array). 
> To cast the object as a string, add quotes 
> as shown in the first illustration in this article.
> 

The designer then generates a function template that you can create inline. Variables are pre-created based on the context that you plan to pass into the function.

<a name="add-function-logic-app"></a>

## Add functions to logic apps

1. In the Azure portal, open your logic app in the Logic App Designer. 

2. Under the step where you want to create and add the function, 
choose **New step** > **Add an action**. 

2. In the search box, enter "azure functions" as your filter.
From the actions list, select this action: 
**Azure Functions - Choose an Azure function** 

In your logic app, 
To list the containers in your subscription 
and select the function that you want to call, 
in Logic App Designer, click the **Actions** menu, 
and select from **Azure Functions in my Region**.

After you select the function, you are asked to specify an input payload object. 
This object is the message that the logic app sends to the function and must be a JSON object. 
For example, if you want to pass in the **Last Modified** date from a Salesforce trigger, 
the function payload might look like this example:

![Last modified date][1]

<a name="call-logic-app"></a>

## Call logic apps from functions

You can trigger a logic app from inside a function. 
See [Logic apps as callable endpoints](logic-apps-http-endpoint.md). 
Create a logic app that has a manual trigger, then from inside your function, 
generate an HTTP POST to the manual trigger URL 
with the payload that you want sent to the logic app.


<!--Image references-->
[1]: ./media/logic-apps-azure-functions/callfunction.png
[2]: ./media/logic-apps-azure-functions/createfunction.png
