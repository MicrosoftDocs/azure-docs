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

Let's review the software and subscription key that you'll need for this tutorial.

- [GitHub](https://github.com/) account
- [Git for Windows](https://git-scm.com/download/win)
- [Visual Studio 2017](https://visualstudio.microsoft.com/downloads/) or later

<!-- An [Azure account with a Speech resource](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/get-started#new-azure-account), in one of the supported [Azure regions](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/regions#voice-first-virtual-assistants) (see "Voice-first virtual assistant" regions) -->


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

The echo-bot is a simple bot that replies back echoing the text it got as input. That is all we need to demonstrated how a deployed bot can listen and speak to you. There is a custom version of the echo-bot that is already configured to work with Direct Line Speech channel, and no code changes will be needed on your part if you are satisfied with its default behaviour. In one of the next sections we will discuss changing the default voice for example.

Follow the instructions in the [REAME.md file of the echo Bot in the BotBuilder-Samples GitHub repo](https://github.com/microsoft/BotBuilder-Samples/blob/preview/speechAndAse/experimental/directline-speech/csharp_dotnetcore/02.echo-bot/README.md) to achieve the following:
- Clone the BotBuilder-samples repo
- Build the echo-bot in the experimental\directline-speech\csharp_dotnetcore folder
- Deploy it locally and test it using Bot-Framework Emulator 

The next step is deploying your bot to Azure. The above link shows how to do this from the command line using Azure Command-Line Interface (CLI). If you are new to Azure, you may find it easier to use Visual Studio's "Publish" feature: 
- Open the project experimental\directline-speech\csharp_dotnetcore\02.echo-bot\EchoBot.csproj in Visual Studio
- In the Solution Explorer, right click the "EoBot" solution and select "Publish"
- A new window titled "Pick a publish target" will open, with a default selection of "App Service", and "Crate New" Azure App Service
- Click on "Publish".
- In the "Create App Service" window:
    - Click "Add an account", and sign in with your Azure account credentials. If you're already signed in, select the account you want from the drop-down list.
    - In the "App Name" you will need to enter a globally unique app name for your Bot. This will determine your unique bot URL. A default value of "EchoBot##############" (where '#' are digits) will be populated from your current clock time. You can leave the default or change it. When you enter your app name, there will be a check to see if it is not already taken. For this tutorial, I will assume the app name is SpeechEchoBotTutorial.
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












<!-- ########################################################################  -->

### JUNK BELOW
- Default will be populated for you for App Name, Subscription, Resource Group, Hosting Plan and Application Insights. Keep those defaults and press "Create".
- Wait patiently while your bot is deployed. It can take a few minutes.

If deployment was successful, you will see the following message in Visual Studio's Output window:
"Web App was published successfully https://echobot##############.azurewebsites.net/ (where '#' are digits representing your unique bot name). A web page should also open at the above URL showing the "Your bot is ready!" message.

TODO - Discuss failure points and what to do?

At this point, view the Azure resources that were created for you:
- Log into the [Azure portal](https://portal.azure.com).
- Click on "Resouces groups" on the left-side menu ([direct link](https://portal.azure.com/#blade/HubsExtension/BrowseResourceGroupBlade/resourceType/Microsoft.Resources%2Fsubscriptions%2FresourceGroups))
- You should see a new Resource group named EchoBot##############ResourceGroup, which will hold all Azure resources related to this project. When you click on it you will see two resources:
    - "App Service" (named "EchoBot##############")
    - "App Service Plan" (named "EchoBot##############Plan")

See the [App Service overview](https://docs.microsoft.com/en-us/azure/app-service/overview) page for more information on Azure App Service and App Service Plans.

TODO: they were created by default in "centeral US"... should we change this to westus2?
See here: https://docs.microsoft.com/en-us/azure/app-service/app-service-web-get-started-dotnet

The next step is to register your Bot.. [TODO explain more why this is needed]
- In the [Azure portal](https://portal.azure.com), click on "Create a resource"
- In the search bar type "bot", and select the option "Bot Channels Registration".
- Click on "Create"
- Fill in the details
    - Bot name - Enter your unique bot name (echobot##############)
    - Subscription - Leave the deault "Free Trail"
    - Resource group - Select your EchoBot##############ResourceGroup from the drop-down menu 
    - Location - Enter the Azure region you decided in step ??? ("West US 2" in our case)
    - Pricing tier - Select F0 from the drop down menu for free
    - Messaging endpoint - Enter the URL of your web app with the /api/messages path. It should look like: https://echobot##############.azurewebsites.net/api/messages/
    - Application insights - you can turn this off for now
    - Click on "Auto create App ID and password", it will open another blade. Click "Auto crate App  ID and apssword".
    - Back in the "Bot Channels Registration" blade, click "Create" at the bottom.


TODO Discuss pricing in a separate section...

Now view your resource group again, and you should see an additional "Bot Channels Registration" resource that you just created.


Next validate again with Bot-Framework Emulator that you can chat with your deployed bot using typed text.

TODO: talk about input hint (and other speech related items?)


Include a sentence or two to explain only what is needed to complete the
procedure.

1. Step 1 of the procedure
1. Step 2 of the procedure
1. Step 3 of the procedure
   ![Browser](media/contribute-how-to-mvc-tutorial/browser.png)
1. Step 4 of the procedure

## Procedure 2

Include a sentence or two to explain only what is needed to complete the procedure.

1. Step 1 of the procedure
1. Step 2 of the procedure
1. Step 3 of the procedure

## Procedure 3

Include a sentence or two to explain only what is needed to complete the
procedure.


Here is an example of a code block for Java:

```java
cluster = Cluster.build(new File("src/remote.yaml")).create();
...
client = cluster.connect();
```

or a code block for Azure CLI:

```azurecli-interactive 
az vm create --resource-group myResourceGroup --name myVM --image win2016datacenter --admin-username azureuser --admin-password myPassword12
```

or a code block for Azure PowerShell:

```azurepowershell-interactive
New-AzureRmContainerGroup -ResourceGroupName myResourceGroup -Name mycontainer -Image microsoft/iis:nanoserver -OsType Windows -IpAddressType Public
```


## Clean up resources

If you're not going to continue to use this application, delete
<resources> with the following steps:

1. From the left-hand menu...
2. ...click Delete, type...and then click Delete



## Next steps

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Next steps button](contribute-get-started-mvc.md)

