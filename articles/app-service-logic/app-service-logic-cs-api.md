<properties
   pageTitle="Run C# expressions in a C# API App in a logic app | Microsoft Azure"
   description="C# Api App or connector"
   services="logic-apps"
   documentationCenter=".net"
   authors="jeffhollan"
   manager="dwrede"
   editor=""/>

<tags
   ms.service="logic-apps"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration"
   ms.date="02/22/2016"
   ms.author="jehollan"/>

#C\# API App

>[AZURE.NOTE] This version of the article applies to logic apps 2014-12-01-preview schema version. 

The C# API app gives you an easy way to run simple C# expressions *while your Logic app executes*.

##When should you use this API app?
The key scenario for this API app is when you want the lifecycle of the code that you write to be the same as the Logic app, and you do *not* want the code to be called in any other scenarios.

On the other hand, if you want a reusable snippet of code that has a lifecycle independent of the Logic app, then you should use the WebJobs API app to create simple code expressions and call them from your Logic app.

Finally, if you want to include any additional packages, you would need to pass in the assembly (.dll) to the connector as a Base64 encoded binary string (like the output from blob storage).  If you want more flexibility over packages and assemblies, a WebJob would likely be a better option.

Use the [JavaScript API App](app-service-logic-javascript-api.md) if you would prefer to write your expressions in JS.

##Creating a C\# API App
To use the C# API app, you need to first create an instance of the C# API app. This can be done either inline while creating a Logic app or by selecting the C# API app from the Azure Marketplace.

##Using C\# API App in Logic Apps designer surface
###Trigger
You can create a trigger that the Logic app service polls (on an interval you define), and, if it returns anything other than `false`, the Logic app runs, otherwise, it waits until the next polling interval to check again.

The inputs to the trigger are:
- **C# Expression**  - An expression that is evaluated. It is invoked inside a function and must return `false` when you do not want the Logic app to run, and can return anything else when you want the Logic app to run. You can use the content of the response in the actions of the Logic app.

For example, you could have a simple trigger that only runs your Logic app between the :15 and :30 of the hour:

```
var d = new DateTime.Now; return (d.Minute > 15) && (d.Minute < 30);
```

###Action

Likewise, you can provide an action to run. 

The inputs to the action are:
- **C# expression**  - An expression that is evaluated. You must include the `return` statement to get any content. 
- **Context object(s)** - An optional context object that can be passed into the trigger. You can define as many properties as you want, but the base must be a JObject `{ ... }`, and objects can be referenced in the script via the key name (the value is passed in as a JToken cooresponding to name).
- **Libraries** - An optional array of .dll files to include on compiling the script.  The array uses the following structure, and works best next to a blob storage connector with the .dll as the output:

```javascript
[{"filename": "name.dll", "assembly": {Base64StringFromConnector}, "usingstatment": "using Library.Reference;"}]
```

For example, imagine you are using the Office 365 trigger **New Email**. That returns the following object:

```javascript
{
	...
	"Attachments" : [
		{
			"name" : "Picture.png",
			"content" : {
				"ContentData" : "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFAQMAAAC3obSmAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAGUExURf///wAAAFXC034AAAASSURBVAjXY2BgCGBgYOhgKAAABEIBSWDJEbYAAAAASUVORK5CYII=",
				"ContentType" : "image/png",
				"ContentTransferEncoding" : "Base64"
			}
		},	
		{
			"name" : "File.txt",
			"content" : {
				"ContentData" : "Don't worry, be happy!",
				"ContentType" : "text/plain",
				"ContentTransferEncoding" : "None"
			}
		}	
	]
}
```

But, you want to upload these attachments to a Yammer post. Unfortunately, the schema for Yammer attachments is slightly different. Now, you can parse this inside your Logic app. For the context object just pass: `@triggerBody()`, and for the expression, pass:

```javascript
JArray YammerAttachments = new JObject();
foreach(var obj in (JArray)Attachments)
{
	JObject att = new JObject();
	att["Content"] = obj["content"];
	att["FileName"] = obj["Name"];
	YammerAttachments.Add(att);	
}
return YammerAttachments;
```

The action returns the object that you returned from your function in a results object. Thus, in the Yammer API app you can reference `@body('csapi').results` for the **Attachments** property.

## Do more with your Connector
Now that the connector is created, you can add it to a business flow using a Logic app. See [What are Logic Apps?](app-service-logic-what-are-logic-apps.md).

 

<!--References -->

<!--Links -->
[Creating a Logic App]: app-service-logic-create-a-logic-app.md
