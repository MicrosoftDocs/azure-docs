---
title: "Tutorial: Deploy a voice-enabled Echo-Bot using Direct Line Speech channel"
titleSuffix: Azure Cognitive Services
description: TODO
services: cognitive-services
author: dargilco
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 07/11/2019
ms.author: dcohen
---

<!---Recommended: Remove all the comments in this template before you
sign-off or merge to master.--->

<!---Tutorials are scenario-based procedures for the top customer tasks
identified in milestone one of the
[Content + Learning content model](contribute-get-started-mvc.md).
You only use tutorials to show the single best procedure for completing
an approved top 10 customer task.
--->

# Tutorial: Deploy a voice-enabled echo-bot using Direct Line Speech channel 
<!---Required:
Starts with "Tutorial: "
Make the first word following "Tutorial:" a verb.
--->

You can now use the power of Microsoft's Cognitive Speech Services to easily make any chat bot accessible to users by voice.

<!---Required:
Lead with a light intro that describes, in customer-friendly language,
what the customer will learn, or do, or accomplish. Answer the
fundamental “why would I want to do this?” question.
--->

In this tutorial, you will modify the simple echo-bot sample code, deploy it to Azure, and register it with the Bot-Framework Direct Line Speech channel. You will then run and configure a sample client application for Window (Direct Line Speech Client), allowing you to talk to your bot and hear it speak back to you.

This tutorial is targeted for developers who are just starting their journey with Bot-Framework bots, Direct Line Speech or Speech SDK, and want to quickly build a working end-to-end system with minimal coding. The focus is not on the functionality of the bot (the dialog), but rather on setting up a simple system with client app, channel and bot service communicating with each other. When configured correctly, it will demostrate the how quickly the user hears the Bot's spoken reply, the accuracy of speech recognition and the quality of Bot's voice (text-to-speech).

TODO: mention that everything can be done for free (free Azure account, free usage of TTS, STT...)

 To read more about Direct Line Speech channel and its usage in a commercial application look at [About custom voice-first virtual assistants](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/voice-first-virtual-assistants)

Here's what this tutorial covers:
> [!div class="checklist"]
> * Downloading the echo-bot sample code and modifying it to support voice output and Direct Line Speech channel
> * Deploying the bot to Azure and registering it with Direct Line Speech channel
> * Downloading Direct Line Speech client sample code and configuring it to communicate with your bot
> * Running the client application, using voice to communicate with your bot and examining the json Activity objects set by the bot
> * TODO: Custom wakeword


## Prerequisites

Let's review the hardware and software that you'll need for this tutorial.

- Windows 10 PC with a microphone
- [Visual Studio 2017](https://visualstudio.microsoft.com/downloads/) or higher
- A [GitHub](https://github.com/) account
- [Git for Windows](https://git-scm.com/download/win) installed

## Select the Azure region for your bot deployment

The Windows application you will run connects to Direct Line Speech channel (an Azure web service). The channel connects to the bot service you deploy to Azure. To reduce the overall round-trip time for a response from your bot, it's best to have these two services located in the same Azure region, and one which is closest to your location.

See the section titled ["voice-first virtual assistant"](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/regions#voice-first-virtual-assistants) for the list of regions supported by Direct Line Speech channel. You will need to pick one region, closest to you. This will also be the region you will deploy your bot. Exact location associated with Azure region
[can be found here](https://azure.microsoft.com/en-us/global-infrastructure/locations/).

One caveats: Direct Line Speech channel uses Text-to-Speech, which has "Standard Voices" and "Neural Voices". If you are interested in the higher quality Neural Voices, make sure you also look at the [Azure regions where Neural Voices is supported](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/regions#standard-and-neural-voices)

<!-- Discuss this: As noted in the next section, you will need to create a Cognitive Service Speech resource on Azure. If you choose the free trial subscription, it is only available in the "westus" region. -->

From this point on, we will assume the chosen region is "West US" <!-- which also support Neural Voices :-( -->

## Create an Azure Account 

You will need an Azure account to deploy your echo-bot, if you don't already have one. Follow the instructions in the section titled ["New Azure account"](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/get-started#new-azure-account).

## Create an Azure Resource Group

<!-- note the text describing what a Resource Group is was taken from the Azure portal when you create a new Resource Group-->
You will need to create an Azure Resource Group if you don't already have one. Resource Group is a container that holds related resources for an Azure solution. The resource group can include all the resources for the solution, or only those resources that you want to manage as a group. You decide how you want to allocate resources to resource groups based on what makes the most sense for you ([learn more]([https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-overview#resource-groups)). In this tutorial, we will create a Resource Group named "SpeechEchoBotTutorial-ResourceGroup" and put all the resources related to the tutorial in this group. This will allow easy clean-up at the end by deleting the Resource Group. 
- In the [Azure portal](https://portal.azure.com), select "Resource groups" in the left-side menu.
- Click on "+Add" to create a new Resource Group
- In "Project details", 
    - leave "Subscription" as "Free Trial"
    - in "Resource group" enter "SpeechEchoBotTutorial-ResourceGroup"  
- In "Region", open the drop-down list and select "(US) West US" (or another [Azure region of your choice](#Select-the-Azure-region-for-your-bot-deployment))
- Click on "Review + create". You should see a green "Validation passed" banner at the top.
- Click on "Create". 
- It may take a minute to create the group. Click on "Refresh" and you should see the new group. 

For this new resource, as well as all others created below, it's good to "Pin to dashboard" to make it easy to find by clicking "Dashboard" in the left-side menu in the Azure portal.

## Create an Azure Cognitive-Services Speech resource

You now need to create an Azure Speech resource. It is needed to enable the Speech-To-Text and Text-to-Speech functionality in the Direct Line speech channel. Follow the instruction in [Create a Speech resource in Azure](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/get-started#create-a-speech-resource-in-azure). For consistency, select the following for the Speech resource:
- Name it "SpeechEchoBotTutorial-Speech"
- Location should be "(US) West US" <!-- internal link to section: (or another [Azure region of your choice](#Select-the-Azure-region-for-your-bot-deployment)) -->
- Pricing tier - F0
- Resource group - Select the existing one created above (SpeechEchoBotTutorial-ResourceGroup)
Make sure you know how to find the two subscription keys associates with your new Speech resource -- you will need one of them further down.

At this point, check that your Resource Group "SpeechEchoBotTutorial-ResourceGroup" has one resource:
| NAME | TYPE  | LOCATION |
|----------|-------|---------|
| SpeechEchoBotTutorial-AppServicePlan | App Service plan | West US |

## Create an Azure App Service Plan

The next step is to create an App Service Plan. See [Azure App Service plan overview](https://docs.microsoft.com/en-us/azure/app-service/overview-hosting-plans).

- In the [Azure portal](https://portal.azure.com), click on "Create a resource" 
- Type "app service" in the search bar, and select the "App Service plan" option
- In "Project Details"
    - Subscription: Keep the default selection of "Free Trail"
    - Resource Group: Select SpeechEchoBotTutorial-ResourceGroup from the drop-down list 
- In the "App Service Plan details:
    - Name: enter "SpeechEchoBotTutorial-AppServicePlan"
    - Operating System: Select "Windows"
    - Region: Select "West US" 
- Pricing Tier: Leave the default selection ("Standard S1)"
- Press "Review and create"
- Verify your selection and press "Create"

At this point, check that your Resource Group "SpeechEchoBotTutorial-ResourceGroup" has two resource:
| NAME | TYPE  | LOCATION |
|----------|-------|---------|
| SpeechEchoBotTutorial-AppServicePlan | App Service plan | West US |
| SpeechEchoBotTutorial-Speech | Cognitive Services | West US |

<!-- Can't do that now, because it asks me to select a template Bot, like echo bot...
## Create an Azure Web App Bot

- In the [Azure portal](https://portal.azure.com), click on "Create a resource" 
- Type "bot" in the search bar, and select the "Web App Bot" option
- Click "Create"
- Enter the following:
    - Bot name: SpeechEchoBotTutorial-WebAppBot
    - Subscription: Leave the default of "Free Trail"
    - Resource Group: Select SpeechEchoBotTutorial-ResourceGroup from the drop-down list
    - Location: West US
    - Pricing Tier: F0
    - App Name: Enter "SpeechEchoBotTutorial" TODO need a unique name here!
-->
<!-- When I deployed to West US 2 I got an error "The scale operation is not allowed for this subscription in this region. Try selecting different region or scale option". I had to change everything to West US. But Neural TTS is not available there... -->

## Get the echo-bot sample from GitHub, build and deploy it to your Azure account

The echo-bot is a very simple bot that replies back echoing the text it got as input. That is all we need to demonstrated how a deployed bot can listen and speak to you. There is a custom version of the echo-bot that is already configured to work with Direct Line Speech channel, and no code changes will be needed on your part. Find it in the experimental folder in the [BotBuilder-Samples GitHub repo](https://github.com/microsoft/BotBuilder-Samples/tree/master/experimental/directline-speech/csharp_dotnetcore/02.echo-bot). 

Follow the instructions in the [REAME.md file](https://github.com/microsoft/BotBuilder-Samples/blob/master/experimental/directline-speech/csharp_dotnetcore/02.echo-bot/README.md) to achieve the following:
- Clone the BotBuilder-samples repo
- Build the echo-bot in the experimental\directline-speech\csharp_dotnetcore folder
- Deploy it locally and test it using Bot-Framework Emulator 

## Deploy your echo-bot to a new Azure App Service

The next step is deploying your bot to Azure. This can be done using Azure Command-Line Interface (CLI) as [described here](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-deploy-az-cli), using [deployment templates](https://github.com/microsoft/BotBuilder-Samples/tree/master/experimental/directline-speech/csharp_dotnetcore/02.echo-bot/DeploymentTemplates). If you are new to Azure, you may find it more educational to use Visual Studio's "Publish" feature and do it manually: 
- Open the project experimental\directline-speech\csharp_dotnetcore\02.echo-bot\EchoBot.csproj in Visual Studio
- In the Solution Explorer, right click the "EoBot" solution and select "Publish"
- A new window titled "Pick a publish target" will open, with a default selection of "App Service", and "Crate New" Azure App Service
- Click on "Publish".
- In the "Create App Service" window:
    - Click "Add an account", and sign in with your Azure account credentials. If you're already signed in, select the account you want from the drop-down list.
    - In the "App Name" you will need to enter a globally unique app name for your Bot. This will determine your unique bot URL. A default value of "EchoBot##############" (where '#' are digits) will be populated from your current clock time. You can leave the default or change it. When you enter your app name, there will be a check to see if it is not already taken. In this tutorial, we will assume the app name is SpeechEchoBotTutorial.
    - In "Subscription" leave the default "Free Trail"
    - In "Resource Group" select "SpeechEchoBotTutorial-ResourceGroup" (it should be the default value if that is the only Azure resource group you have)
    - In "Hosting Plan" select "SpeechEchoBotTutorial-AppServicePlan" (it will be the default if that's the only app service plan you have)
- Click on "Create"

If all goes well, the Azure App Service will be created and the bot will be deployed. You should see a success message similar to this one in the Visual Studio
output window:
```
Publish Succeeded.
Web App was published successfully https://speechechobottutorial.azurewebsites.net/
```

Click on the URL to open it in your default browser. You should see a webpage with "Your bot is ready!".

At this point, check your Resource Group "SpeechEchoBotTutorial-ResourceGroup" in the Azure portal. It should now show three resource:

| NAME | TYPE  | LOCATION |
|----------|-------|---------|
| SpeechEchoBotTutorial | App Service | West US |
| SpeechEchoBotTutorial-AppServicePlan | App Service plan | West US |
| SpeechEchoBotTutorial-Speech | Cognitive Services | West US |

<!-- TOOD: This anchor does not work.Why -->
<!-- <a name="ToggleWebSocket"/> -->

At this point one small configuration chage is needed to your newly created App Service (SpeechEchoBotTutorial), so your bot can communicate with Direct Line Speech channel using websocket protocol:
- In the [Azure portal](https://portal.azure.com), go to your new app service (named "SpeechEchoBotTutorial")
- On the left-side menu, under "Settings", click "Configuration"
- Switch to the "General settings" tab
- Toggle the "Web sockets" to On (by default it is Off)
- Click Save.


## Create an Azure Bot Channels Registration 

You have created an Azure App Service hosting your Bot. Now you need to register it with Direct Line Speech channel. Bot-Framework channel registration and configuration is done using the Azure Resource named "Bot Channels Registration". Create one now:
- In the [Azure portal](https://portal.azure.com), click on "Create a resource"
- In the search bar type "bot", and select the option "Bot Channels Registration".
- Click on "Create"
- Fill in the details
    - Bot name - Enter a name for the Azure resource. To keep up with the naming convention in the Tutorial enter "SpeechEchoBotTutorial-BotRegistration" (note the name must be between 4 and 42 characters)
    - Subscription - Leave the default "Free Trail"
    - Resource group - Select "SpeechEchoBotTutorial-ResourceGroup" 
    - Location - Enter "West US"
    - Pricing tier - Select F0 from the drop down menu for free
    - Messaging endpoint - This is the URL where your bot will receive messages from the channel. Enter the URL of your web app with the /api/messages path appended at the end: https://speechechobottutorial.azurewebsites.net/api/messages/
    - Application insights - you can turn this off for now
    - Ignore "Auto create App ID and password".
    - Back in the "Bot Channels Registration" blade, click "Create" at the bottom.

At this point, check your Resource Group "SpeechEchoBotTutorial-ResourceGroup" in the Azure portal. It should now show four resource:

| NAME | TYPE  | LOCATION |
|----------|-------|---------|
| SpeechEchoBotTutorial | App Service | West US |
| SpeechEchoBotTutorial-AppServicePlan | App Service plan | West US |
| SpeechEchoBotTutorial-BotRegistration | Bot Channels Registration | global
| SpeechEchoBotTutorial-Speech | Cognitive Services | West US |

Note: it wil say "global" under Location for your Bot Channels Registration, even though you selected "West US" when creating it.

TODO: Why?

<!-- TODO: This anchor does not work. Why? -->
<!-- <a name="BotChannelRegistration"/> -->
## Register your bot with Direct Line Speech channel

- In the [Azure portal](https://portal.azure.com), open your SpeechEchoBotTutorial-BotRegistration resource.
- Click on "Channels" on the left-side menu. 
    - Find the "Direct Line Speech" channel under the "More channels" options and click on it.
    - Read the text in the "Configure Direct line Speech (Preview)" page and click "Save"
    - Two "Secret keys" were generated for you. These keys are unique to your bot. When you write a client application using the [Speech SDK](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/), you will provide one of those keys in order to establish a connection between the client application, Direct Line Speech channel, and your bot service. In this tutorial we use the C# WPF sample code "Direct Line Speech Client" as the client. It uses the Speech SDK and one of those keys will be needed in order to configure it.
    - Click "Show" and copy one of those keys. You can always come back and look at them again if needed.  
- Click on "Settings" on the left-side menu
    - Check the box titled "Enable Streaming Endpoint". This is needed to enable the websocket protocol between the bot and Direct Line Speech channel
    - Click "Save"

See also [Connect a bot to Direct Line Speech (Preview)](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-channel-connect-directlinespeech?view=azure-bot-service-4.0)

## Test your echo-bot with Direct Line Speech Client

Direct Line Speech Client is a Windows Presentation Foundation (WPF) application in C# that makes it easy to test interactions with your bot before creating a custom client application. It demonstrates how to use the [Azure Speech Services Speech SDK](https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-sdk) to manage communication with your Azure Bot-Framework bot. Here we wil use it to test the echo-bot we deployed.
- Got to the [GitHub repository of Direct Line Speech Client](https://github.com/Azure-Samples/Cognitive-Services-Direct-Line-Speech-Client) and read the text in the front page ([README.md](https://github.com/Azure-Samples/Cognitive-Services-Direct-Line-Speech-Client/blob/master/README.md))
- Follow the Quickstart to
    - Clone the repo
    - Build the project in Visual Studio
    - Run the executable DLSpeechClient.exe
    - Configure the settings page with 
        - The speech subscription key that you received while creating the Azure Cognitive-Services Speech resource
        - The Azure region associated with the speech subscription key. Use the "Speech SDK Parameter" format, as indicated in the [Speech SDK region table](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/regions#speech-to-text-text-to-speech-and-translation). For West US, enter "westus"
    - In the main application window, enter the "Bot Secret". This is one of two secret keys you got when you registered your bot with Direct Line Speech channel. 
       

## Troubleshooting errors in Direct Line Speech Client


| Error | What should I check? |
|-------|-------------|
|Error AuthenticationFailure : WebSocket Upgrade failed with an authentication error (401). Please check for correct subscription key (or authorization token) and region name| In the Settings page of the application, make sure you entered the Speech Subscription key and its region correctly.<br>Make sure your Bot Secret was entered correctly. |
|Error ConnectionFailure : Connection was closed by the remote host. Error code: 1011. Error details: We could not connect to the bot before sending a message | Make sure you [checked the "Enable Streaming Endpoint"](#BotChannelRegistration) box and/or [toggled "Web sockets"](#ToggleWebSocket) to On.|
|Error ConnectionFailure : Connection was closed by the remote host. Error code: 1011. Error details: Response status code does not indicate success: 500 (InternalServerError)| Your bot specified a Neural Voice in its ouptut Activity [Speak](https://github.com/microsoft/botframework-sdk/blob/master/specs/botframework-activity/botframework-activity.md#speak) field, but the Azure region associated with your Speech subscription key does not support Neural Voices. See [Standard and neural voices](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/regions#standard-and-neural-voices).|
|Error ConnectionFailure : Connection was closed by the remote host. Error code: 1000. Error details: Exceeded maximum websocket connection idle duration(> 300000ms)| This is an expected error when the client left the connection to the channel open for more than 5 minutes without any activity |

See also [Voice-first virtual assistants Preview: Frequently asked questions](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/faq-voice-first-virtual-assistants)

## Make a change to the Bot and redeploy it

TODO

## Try out the high-quality Neural Text-to-speech voices

TODO

## Add Custom Wakeword

TODO

## Debug you bot locally

TODO

## Clean up resources

If you're not going to continue using the echo-bot deployed in this tutorial, you can remove it and all its associated Azure resources by simply deleting the Azure Resource group SpeechEchoBotTutorial-ResourceGroup
1. In the [Azure portal](https://portal.azure.com), click on "Resource Groups" from the left-side menu 
1. Find the one named SpeechEchoBotTutorial-ResourceGroup, and click on the three dots (...) on the right side
1. Select "Delete resource group".

## Next steps

TODO

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Next steps button](contribute-get-started-mvc.md)

