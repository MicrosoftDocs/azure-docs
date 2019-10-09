---
title: 'Tutorial: Custom Speech Commands (Preview)'
titleSuffix: Azure Cognitive Services
description: In this article, you create a hosted Custom Speech Commands application. You connect your client application to a previously created Bot Framework bot configured to use the Direct Line Speech channel. The application is built with the Speech SDK NuGet Package and Microsoft Visual Studio 2019.
services: cognitive-services
author: donkim
manager: yetian
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 09/26/2019
ms.author: donkim
---

# Tutorial: Custom Speech Commands (Preview)

You can now author and deploy a hosted Custom Speech Commands application which

This tutorial is designed for developers who are just starting their journey with Azure and the Speech SDK, and want to quickly build end-to-end voice functionality into their applications.



> [!NOTE]
> The steps in this tutorial do not require a paid service. As a new Azure user, you'll be able to use credits from your free Azure trail subscription and the free tier of Speech Services to complete this tutorial.


Here's what this tutorial covers:
> [!div class="checklist"]
> * Create new Azure resources
> * Build, test, and deploy a Custom Speech Commands application
> * Build and run the Direct Line Speech Client to interact with your Custom Speech Commands application


## Prerequisites

Here's what you'll need to complete this tutorial:

- A Windows 10 PC with a working microphone and speakers (or headphones)
- [Visual Studio 2017](https://visualstudio.microsoft.com/downloads/) or higher
- [.NET Core SDK](https://dotnet.microsoft.com/download) version 2.1 or later
- An Azure account. [Sign up for free](https://azure.microsoft.com/free/ai/).
- A [GitHub](https://github.com/) account
- [Git for Windows](https://git-scm.com/download/win)

## Create a resource group

The client app that you'll create in this tutorial uses a handful of Azure services. To reduce the round-trip time for responses from your bot, you'll want to make sure that these services are located in the same Azure region. In this section, you'll create a resource group in the **West US 2** region. This resource group will be used when creating individual resources for the Bot-Framework, the  Direct Line Speech channel, and Speech Services.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. From the left navigation, select **Resource groups**. Then click **Add** to add a new resource group.
3. You'll be prompted to provide some information:
   * Set **Subscription** to **Free Trial** (you can also use an existing subscription).
   * Enter a name for your **Resource group**. We recommend **SpeechEchoBotTutorial-ResourceGroup**.
   * From the **Region** drop-down, select **West US 2**.
4. Click **Review and create**. You should see a banner that read **Validation passed**.
5. Click **Create**. It may take a few minutes to create the resource group.
6. As with the resources you'll create later in this tutorial, it's a good idea to pin this resource group to your dashboard for easy access. If you'd like to pin this resource group, click the pin icon in the upper right of the dashboard.


## Create Custom Speech Commands application

1. Sign in to the [Custom Speech portal](https://speech.microsoft.com/portal)
2. Select the resource you created previously

Select Custom Speech Commands

Select create a new command  

"TurnOn"
Language - en-us
Region westus2

> screenshot create command modal

Add sample utterances:
"turn on the tv"

Add an advanced rule
> PROBLEM: the most basic task is asking the user to create an "Advanced" rule.  This is jarring.

> screenshot - create command modal
> Friendly name - Confirmation message
> Wait for user - false
> Completes command - true
> template - title - default
  > message - "Ok, turning on the tv!" 

publish

## Create Custom Speech Commands application with parameters

Let's extend the previous quickstart so that we can handle turn on/off the tv/lights

Add a parameter OnOff
String List parameter
Canonical values on, off
synonyms - none
elicitation prompt "On or off?"

Add a parameter SubjectDevice
String List parameter
Canonical values "tv", "light"
synonyms - television, telly, lights
elicitation prompt - "Which device"

Add sample sentences
Syntax highlighted and autocomplete
turn {OnOff} the {SubjectDevice}



## Speech SDK


## Fulfill with REST backend

Demonstrate connecting to REST backed with an Azure function.
Can be any REST enabled backend

https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-function-vs-code

Code snippet for azure function
```C#
[FunctionName("DeviceControlTurnOnOff")]
public static async Task<IActionResult> Run(
    [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
    ILogger log)
{
    log.LogInformation("C# HTTP trigger function processed a request.");

    string name = req.Query["name"];

    string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
    dynamic data = JsonConvert.DeserializeObject(requestBody);
    name = name ?? data?.name;

    return name != null
        ? (ActionResult)new OkObjectResult($"Hello, {name}")
        : new BadRequestObjectResult("Please pass a name on the query string or in the request body");
}
```

Go to http endpoints tab
add new http endpoint "Device Control Quickstart Backend"

uri: function uri
headers: function key header

Go to Completion Rules section
Add new completion rule
Condition - Required OnOff, Required SubjectDevice
Action Http Action

On Success
 - No additional actions required.
On Failure
 - Speech Response - "Sorry, unable to complete your request at this time"


## Fulfill with Client command and the Speech SDK

In this How to you will create a and send a custom JSON payload from the Speech Commands application and handle it directly in thje Speech SDK client.

Extend the Speech Commands application we created for turn {OnOff} the {SubjectDevice}

Extend the Speech SDK client sample

First define the Completion Rule and the payload

Go to Completion Rules
Add new completion rule
Condition - Required OnOff, Required SubjectDevice
Action Send Activity action
Content
```json
{
    "name": "SetDeviceState",
    "state": "{OnOff}",
    "device": "{SubjectDevice}"
}
```

Client handling

Add activity handler

check type == 'event' name == "SetDeviceState"

new method on mainpage.xaml.cs

```C#
void SetDeviceState(string deviceName, string state)
{

}
```

## Confirmation


## Validation

Add a new command SetTemperature

Add a parameter Temperature
Number type
Add NumberInRange validation
Min 50, Max 90
Add prompt - "Temperature must be between 50 and 90 degrees"

