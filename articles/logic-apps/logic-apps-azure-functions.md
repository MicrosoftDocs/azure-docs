---
title: Custom code for Azure Logic Apps with Azure Functions | Microsoft Docs
description: Create and run custom code for Azure Logic Apps with Azure Functions
services: logic-apps,functions
documentationcenter: .net,nodejs,java
author: jeffhollan
manager: anneta
editor: ''

ms.assetid: 9fab1050-cfbc-4a8b-b1b3-5531bee92856
ms.service: logic-apps
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: integration
ms.custom: H1Hack27Feb2017
ms.date: 10/18/2016
ms.author: LADocs; jehollan
---

# Add and run custom code for logic apps through Azure Functions

To run custom snippets of C# or node.js in logic apps, 
you can create custom functions through Azure Functions. 
[Azure Functions](../azure-functions/functions-overview.md) 
offers server-free computing in Microsoft Azure and are useful for performing these tasks:

* Advanced formatting or compute of fields in logic apps
* Perform calculations in a workflow.
* Extend the logic app functionality with functions that are supported in C# or node.js

## Create custom functions for your logic apps

We recommend that you create a function in the Azure Functions portal, 
from the **Generic Webhook - Node** or **Generic Webhook - C#** templates. 
The result creates an auto-populated a template that accepts 
`application/json` from a logic app. Functions that you create 
from these templates are automatically detected and appear 
in the Logic App Designer under **Azure Functions in my region.**

In the Azure portal, on the **Integrate** pane for your function, 
your template should show that **Mode** set to **Webhook** 
and **Webhook type** is set to **Generic JSON**. 

Webhook functions accept a request and pass it into the method via a `data` variable. 
You can access the properties of your payload by using dot notation like `data.function-name`. 
For example, a simple JavaScript function that converts a DateTime value into a 
date string looks like the following example:

```
function start(req, res){
    var data = req.body;
    res = {
        body: data.date.ToDateString();
    }
}
```

## Call Azure Functions from logic apps

To list the containers in your subscription 
and select the function that you want to call, 
in Logic App Designer, click the **Actions** menu, 
and select from **Azure Functions in my Region**.

After you select the function, you are asked to specify an input payload object. 
This object is the message that the logic app sends to the function and must be a JSON object. 
For example, if you want to pass in the **Last Modified** date from a Salesforce trigger, 
the function payload might look like this example:

![Last modified date][1]

## Trigger logic apps from a function

You can trigger a logic app from inside a function. 
See [Logic apps as callable endpoints](logic-apps-http-endpoint.md). 
Create a logic app that has a manual trigger, then from inside your function, 
generate an HTTP POST to the manual trigger URL 
with the payload that you want sent to the logic app.

### Create a function from Logic App Designer

You can also create a node.js webhook function from the designer. 
First, select **Azure Functions in my Region,** 
and then choose a container for your function. 
If you don't yet have a container, you need to create one from the 
[Azure Functions portal](https://functions.azure.com/signin). 
Then select **Create New**.  

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

<!--Image references-->
[1]: ./media/logic-apps-azure-functions/callfunction.png
[2]: ./media/logic-apps-azure-functions/createfunction.png
