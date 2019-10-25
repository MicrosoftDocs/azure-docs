---
title: "Tutorial: Voices enable your bot using Speech SDK"
titleSuffix: Azure Cognitive Services
description: In this tutorial, you'll create an Echo Bot using Microsoft Bot-Framework, deploy it to Azure, and register it with the Bot-Framework Direct Line Speech channel. Then you'll configure a sample client app for Windows that lets you speak to your bot and hear it respond back to you.
services: cognitive-services
author: dargilco
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 11/05/2019
ms.author: dcohen
---

# Tutorial: Voice-enable your bot using the Speech SDK

You can now use the power of the Speech Services to easily voice-enable a chat bot.

In this tutorial, you'll create an Echo Bot using Microsoft Bot-Framework, deploy it to Azure, and register it with the Bot-Framework Direct Line Speech channel. Then you'll configure a sample client app for Windows that lets you speak to your bot and hear it respond back to you.

This tutorial is designed for developers who are just starting their journey with Azure, Bot-Framework bots, Direct Line Speech, or the Speech SDK, and want to quickly build a working system with limited coding. No experience or familiarity with these services is needed.

At the end of this exercise, you'll have set up a system that will operate as follows:

1. The sample client application is configured to connect to Direct Line Speech channel and the Echo Bot
2. Audio is recorded from the default microphone on button press (or continuously recorded if custom keyword is activated)
3. Optionally, custom keyword detection happens, gating audio streaming to the cloud
4. Using Speech SDK, the app connects to Direct Line Speech channel and streams audio
5. Optionally, higher accuracy keyword verification happens on the service
6. The audio is passed to the speech recognition service and transcribed to text
7. The recognized text is passed to the Echo-Bot as a Bot Framework Activity 
8. The response text is turned into audio by the Text-to-Speech (TTS) service, and streamed back to the client application for playback

![diagram-tag](media/tutorial-voice-enable-your-bot-speech-sdk/diagram.png "The Speech Channel flow")

> [!NOTE]
> The steps in this tutorial do not require a paid service. As a new Azure user, you'll be able to use credits from your free Azure trail subscription and the free tier of Speech Services to complete this tutorial.

Here's what this tutorial covers:
> [!div class="checklist"]
> * Create new Azure resources
> * Build, test, and deploy the Echo Bot sample to an Azure App Service
> * Register your bot with Direct Line Speech channel
> * Build and run the Direct Line Speech Client to interact with your Echo Bot
> * Add custom keyword activation
> * Learn to change the language of the recognized and spoken speech

## Prerequisites

Here's what you'll need to complete this tutorial:

- A Windows 10 PC with a working microphone and speakers (or headphones)
- [Visual Studio 2017](https://visualstudio.microsoft.com/downloads/) or higher
- [.NET Core SDK](https://dotnet.microsoft.com/download) version 2.1 or later
- An Azure account. [Sign up for free](https://azure.microsoft.com/free/ai/).
- A [GitHub](https://github.com/) account
- [Git for Windows](https://git-scm.com/download/win)

## Create a resource group

The client app that you'll create in this tutorial uses a handful of Azure services. To reduce the round-trip time for responses from your bot, you'll want to make sure that these services are located in the same Azure region. In this section, you'll create a resource group in the **West US** region. This resource group will be used when creating individual resources for the Bot-Framework, the  Direct Line Speech channel, and Speech Services.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. From the left navigation, select **Resource groups**. Then click **Add** to add a new resource group.
3. You'll be prompted to provide some information:
   * Set **Subscription** to **Free Trial** (you can also use an existing subscription).
   * Enter a name for your **Resource group**. We recommend **SpeechEchoBotTutorial-ResourceGroup**.
   * From the **Region** drop-down, select **West US**.
4. Click **Review and create**. You should see a banner that read **Validation passed**.
5. Click **Create**. It may take a few minutes to create the resource group.
6. As with the resources you'll create later in this tutorial, it's a good idea to pin this resource group to your dashboard for easy access. If you'd like to pin this resource group, click the pin icon in the upper right of the dashboard.

### Choosing an Azure region

If you'd like to use a different region for this tutorial these factors may limit your choices:

* Ensure that you use a [supported Azure region](https://docs.microsoft.com/azure/cognitive-services/speech-service/regions#voice-assistants).
* The Direct Line Speech channel uses the text-to-speech service, which has standard and neural voices. Neural voices are [limited to specific Azure regions](https://docs.microsoft.com/azure/cognitive-services/speech-service/regions#standard-and-neural-voices).
* Free trial keys may be restricted to a specific region.

For more information about regions, see [Azure locations](https://azure.microsoft.com/global-infrastructure/locations/).

## Create resources

Now that you have a resource group in the **West US** region, the next step is to create individual resources for each service that you'll use in this tutorial.

### Create a Speech Services resource

Follow these instructions to create a Speech resource:

1. Select **Create a resource** from the left navigation.
2. In the search bar, type **Speech**.
3. Select **Speech**, then click **Create**.
4. You'll be prompted to provide some information:
   * Give your resource a **Name**. We recommend **SpeechEchoBotTutorial-Speech**
   * For **Subscription**, make sure **Free Trial** is selected.
   * For **Location**, select **West US**.
   * For **Pricing tier**, select **F0**. This is the free tier.
   * For **Resource group**, select **SpeechEchoBotTutorial-ResourceGroup**.
5. After you've entered all required information, click **Create**. It may take a few minutes to create your resource.
6. Later in this tutorial you'll need subscription keys for this service. You can access these keys at any time from your resource's **Overview** (Manage keys) or **Keys**.

At this point, check that your resource group (**SpeechEchoBotTutorial-ResourceGroup**) has a Speech resource:

| NAME | TYPE  | LOCATION |
|------|-------|----------|
| SpeechEchoBotTutorial-Speech | Cognitive Services | West US |

### Create an Azure App Service plan

The next step is to create an App Service Plan. An App Service plan defines a set of compute resources for a web app to run.

1. Select **Create a resource** from the left navigation.
2. In the search bar, type **App Service Plan**. Next, locate and select the **App Service Plan** card from the search results.
3. Click **Create**.
4. You'll be prompted to provide some information:
   * Set **Subscription** to **Free Trial** (you can also use an existing subscription).
   * For **Resource group**, select **SpeechEchoBotTutorial-ResourceGroup**.
   * Give your resource a **Name**. We recommend **SpeechEchoBotTutorial-AppServicePlan**
   * For **Operating System**, select **Windows**.
   * For **Region**, select **West US**.
   * For **Pricing Tier**, make sure that **Standard S1** is selected. This should be the default value.
5. Click **Review and create**. You should see a banner that read **Validation passed**.
6. Click **Create**. It may take a few minutes to create the resource group.

At this point, check that your resource group (**SpeechEchoBotTutorial-ResourceGroup**) has two resources:

| NAME | TYPE  | LOCATION |
|------|-------|----------|
| SpeechEchoBotTutorial-AppServicePlan | App Service Plan | West US |
| SpeechEchoBotTutorial-Speech | Cognitive Services | West US |

## Build an Echo Bot

Now that you've created some resources, let's build a bot. We're going to start with the Echo Bot sample, which as the name implies, echoes the text that you've entered as its response. Don't worry, the sample code is ready for you to use without any changes. It's configured to work with the Direct Line Speech channel, which we'll connect after we've deployed the bot to Azure.

> [!NOTE]
> The instructions that follow, as well as additional information about the Echo Bot are available in the [sample's README on GitHub](https://github.com/microsoft/BotBuilder-Samples/blob/master/experimental/directline-speech/csharp_dotnetcore/02.echo-bot/README.md).

### Download and run the sample

1. Clone the samples repository:
   ```bash
   git clone https://github.com/Microsoft/botbuilder-samples.git
   ```
2. Launch Visual Studio.
3. From the toolbar, select **File** > **Open** > **Project/Solution**, and open the project file of the Echo Bot that's been configured for use with Direct Line Speech channel:
   ```
   experimental\directline-speech\csharp_dotnetcore\02.echo-bot\EchoBot.csproj
   ```
4. After the project is loaded, press `F5` to run the project.

### Test with the Bot Framework Emulator

The [Bot Framework Emulator](https://github.com/microsoft/botframework-emulator) is a desktop app that allows bot developers to test and debug their bots locally or remotely through a tunnel. Follow these steps to use the Bot Framework Emulator to test your Echo Bot.

1. Install the [Bot Framework Emulator](https://github.com/Microsoft/BotFramework-Emulator/releases/latest) version 4.3.0 or greater
2. Launch the Bot Framework Emulator and open your bot:
   * **File** -> **Open Bot**.
3. Enter the URL for your bot. For example:
   ```
   http://localhost:3978/api/messages
   ```
4. Use the UI to communicate with your bot using typed text. Confirm that you get a response.


## Deploy your bot to an Azure App Service

The next step is to deploy the Echo Bot to Azure. There are a few ways to deploy a bot, but in this tutorial we'll focus on publishing directly from Visual Studio.

> [!NOTE]
> Alternatively, you can deploy a bot using the [Azure CLI](https://docs.microsoft.com/azure/bot-service/bot-builder-deploy-az-cli) and [deployment templates](https://github.com/microsoft/BotBuilder-Samples/tree/master/experimental/directline-speech/csharp_dotnetcore/02.echo-bot/DeploymentTemplates).

1. From Visual Studio, open the Echo Bot that's been configured for use with Direct Line Speech channel:
   ```
   experimental\directline-speech\csharp_dotnetcore\02.echo-bot\EchoBot.csproj
   ```
2. In the **Solution Explorer**, right-click the **EchoBot** solution and select **Publish...**
3. A new window titled **Pick a publish target** will open.
3. Select **App Service** from the left navigation, select **Create New**, then click **Publish**.
5. When the **Create App Service** window appears:
   * Click **Add an account**, and sign in with your Azure account credentials. If you're already signed in, select the account you want from the drop-down list.
   * For the **App Name**, you'll need to enter a globally unique name for your Bot. This name is used to create a unique bot URL. A default value will be populated including the date and time (For example: "EchoBot20190805125647"). You can use the default name for this tutorial.
   * For **Subscription**, set it to **Free Trial**
   * For **Resource Group**, select **SpeechEchoBotTutorial-ResourceGroup**
   * For **Hosting Plan**, select **SpeechEchoBotTutorial-AppServicePlan**
6. Click **Create**
7. You should see a success message in Visual Studio that looks like this:
   ```
   Publish Succeeded.
   Web App was published successfully https://EchoBot20190805125647.azurewebsites.net/
   ```
8. Your default browser should open and display a page that reads: "Your bot is ready!".
9. At this point, check your Resource Group **SpeechEchoBotTutorial-ResourceGroup** in the Azure portal, and confirm there are three resources:

| NAME | TYPE  | LOCATION |
|------|-------|----------|
| EchoBot20190805125647 | App Service | West US |
| SpeechEchoBotTutorial-AppServicePlan | App Service plan | West US |
| SpeechEchoBotTutorial-Speech | Cognitive Services | West US |

## Enable web sockets

You'll need to make a small configuration change so that your bot can communicate with the Direct Line Speech channel using web sockets. Follow these steps to enable web sockets:

1. Navigate to the [Azure portal](https://portal.azure.com), and locate your App Service. The resource should be named similar to **EchoBot20190805125647** (your unique app name).
2. In the left navigation, select **Settings**, then click **Configuration**.
3. Select the **General settings** tab.
4. Locate the toggle for **Web sockets** and set it to **On**.
5. Click **Save**.

> [!TIP]
> You can use the controls at the top of your Azure App Service page to stop or restart the service. This may come in handy when troubleshooting.

## Create a channel registration

Now that you've created an Azure App Service to host your bot, the next step is to create a **Bot Channels Registration**. Creating a channel registration is a prerequisite for registering your bot with Bot-Framework channels, including Direct Line Speech channel.

> [!NOTE]
> If you'd like to learn more about how bots leverage channels, see [Connect a bot to channels](https://docs.microsoft.com/azure/bot-service/bot-service-manage-channels?view=azure-bot-service-4.0).

1. The first step is to create a new resource for the registration. In the [Azure portal](https://portal.azure.com), click **Create a resource**.
2. In the search bar type **bot**, after the results appear, select **Bot Channels Registration**.
3. Click **Create**.
4. You'll be prompted to provide some information:
   * For **Bot name**, enter **SpeechEchoBotTutorial-BotRegistration**.
   * For **Subscription**, select **Free Trial**.
   * For **Resource group**, select **SpeechEchoBotTutorial-ResourceGroup**.
   * For **Location**, select **West US**.
     * For **Pricing tier**, select **F0**.
     * For **Messaging endpoint**, enter the URL for your web app with the `/api/messages` path appended at the end. For example: if your globally unique App Name was **EchoBot20190805125647**, your messaging endpoint would be: `https://EchoBot20190805125647.azurewebsites.net/api/messages/`.
     * For **Application insights**, you can set this to **Off**. For more information, see [Bot analytics](https://docs.microsoft.com/azure/bot-service/bot-service-manage-analytics?view=azure-bot-service-4.0).
     * Ignore **Auto create App ID and password**.
5. Navigate back to the **Bot Channels Registration** and click **Create**.

At this point, check your Resource Group **SpeechEchoBotTutorial-ResourceGroup** in the Azure portal. It should now show four resources:

| NAME | TYPE  | LOCATION |
|------|-------|----------|
| EchoBot20190805125647 | App Service | West US |
| SpeechEchoBotTutorial-AppServicePlan | App Service plan | West US |
| SpeechEchoBotTutorial-BotRegistration | Bot Channels Registration | Global |
| SpeechEchoBotTutorial-Speech | Cognitive Services | West US |

> [!IMPORTANT]
> The Bot Channels Registration resource will show the Global region even though you selected West US. This is expected.

## Register the Direct Line Speech channel

Now it's time to register your bot with the Direct Line Speech channel. This channel is what's used to create a connection between your echo bot and a client app compiled with the Speech SDK.

1. Locate and open your **SpeechEchoBotTutorial-BotRegistration** resource in the [Azure portal](https://portal.azure.com).
2. From the left navigation, select **Channels**.
   * Look for **More channels**, locate and click **Direct Line Speech**.
   * Review the text on the page titled **Configure Direct line Speech**, then click **Save**.
   * As part of creation, two **Secret keys** were generated. These keys are unique to your bot. When you write a client app using the [Speech SDK](https://docs.microsoft.com/azure/cognitive-services/speech-service/), you'll provide one of these keys to establish a connection between the client app, the Direct Line Speech channel, and your bot service. In this tutorial, you'll use the Direct Line Speech Client (WPF, C#).
   * Click **Show** and copy one of the keys somewhere you'll be able to easily access it. Don't worry, you can always access the keys from the Azure portal.
3. From the left navigation, click **Settings**.
   * Check the box labeled **Enable Streaming Endpoint**. This is needed to enable a communication protocol built on web sockets between your bot and the Direct Line Speech channel.
   * Click **Save**.

> [!TIP]
> If you'd like to learn more, see [Connect a bot to Direct Line Speech](https://docs.microsoft.com/azure/bot-service/bot-service-channel-connect-directlinespeech?view=azure-bot-service-4.0). This page includes additional information and known issues.

## Build the Direct Line Speech Client

In this step, you're going to build the Direct Line Speech Client. The client is a Windows Presentation Foundation (WPF) app in C# that uses the [Speech SDK](https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-sdk) to manage communication with your bot using the Direct Line Speech channel. Use it to interact with and test your bot before writing a custom client app.

The Direct Line Speech Client has a simple UI that allows you to configure the connection to your bot, view the text conversation, view Bot-Framework activities in JSON format, and display adaptive cards. It also supports the use of custom keywords. You'll use this client to speak with your bot and receive a voice response.

Before we move on, make sure that your microphone and speakers are enabled and working.

1. Navigate to the GitHub repository for the [Direct Line Speech Client](https://github.com/Azure-Samples/Cognitive-Services-Direct-Line-Speech-Client/blob/master/README.md).
2. Follow the instructions provided to clone the repository, build the project, configure the client, and launch the client.
3. Click **Reconnect** and make sure you see the message **Press the mic button, or type to start talking to your bot**.
4. Let's test it out. Click the microphone button, and speak a few words in English. The recognized text will appear as you speak. When you're done speaking, the bot will reply in its own voice, saying "echo" followed by the recognized words.
5. You can also use text to communicate with the bot. Just type in the text at the bottom bar. 

### Troubleshooting errors in Direct Line Speech Client

If you get an error message in your main app window, use this table to identify and troubleshoot the error:

| Error | What should you do? |
|-------|----------------------|
|App Error (see log for details): Microsoft.CognitiveServices.Speech.csharp: Value cannot be null. Parameter name: speechConfig | This is a client app error. Make sure you have a non-empty value for *Bot Secret* in the main app window (see section [Register your bot with Direct Line Speech channel](#register-the-direct-line-speech-channel)) |
|Error AuthenticationFailure: WebSocket Upgrade failed with an authentication error (401). Check for correct subscription key (or authorization token) and region name| In the Settings page of the app, make sure you entered the Speech Subscription key and its region correctly.<br>Make sure your Bot Secret was entered correctly. |
|Error ConnectionFailure: Connection was closed by the remote host. Error code: 1011. Error details: We could not connect to the bot before sending a message | Make sure you [checked the "Enable Streaming Endpoint"](#register-the-direct-line-speech-channel) box and/or [toggled **Web sockets**](#enable-web-sockets) to On.<br>Make sure your Azure App Service is running. If it is, try restarting your App Service.|
|Error ConnectionFailure: Connection was closed by the remote host. Error code: 1011. Error details: Response status code does not indicate success: 500 (InternalServerError)| Your bot specified a neural voice in its output Activity [Speak](https://github.com/microsoft/botframework-sdk/blob/master/specs/botframework-activity/botframework-activity.md#speak) field, but the Azure region associated with your Speech subscription key does not support neural voices. See [Standard and neural voices](https://docs.microsoft.com/azure/cognitive-services/speech-service/regions#standard-and-neural-voices).|
|Error ConnectionFailure: Connection was closed by the remote host. Error code: 1000. Error details: Exceeded maximum web socket connection idle duration(> 300000 ms)| This is an expected error when a connection to the channel is left open and inactive for more than five minutes. |

If your issue isn't addressed in the table, see [Voice assistants: Frequently asked questions](faq-voice-assistants.md).

### View bot activities

Every bot sends and receives **Activity** messages. In the **Activity Log** window of Direct Line Speech Client, you'll see timestamped logs with each activity that the client has received from the bot. You can also see the activities that the client sent to the bot using the [`DialogServiceConnector.SendActivityAsync`](https://docs.microsoft.com/dotnet/api/microsoft.cognitiveservices.speech.dialog.dialogserviceconnector.sendactivityasync)  method. When you select a log item, it will show the details of the associated activity as JSON.

Here's a sample json of an Activity the client received:
```json
{
    "attachments":[],
    "channelData":{
        "conversationalAiData":{
             "requestInfo":{
                 "interactionId":"8d5cb416-73c3-476b-95fd-9358cbfaebfa",
                 "version":"0.2"
             }
         }
    },
    "channelId":"directlinespeech",
    "conversation":{
        "id":"129ebffe-772b-47f0-9812-7c5bfd4aca79",
        "isGroup":false
    },
    "entities":[],
    "from":{
        "id":"SpeechEchoBotTutorial-BotRegistration"
    },
    "id":"89841b4d-46ce-42de-9960-4fe4070c70cc",
    "inputHint":"acceptingInput",
    "recipient":{
        "id":"129ebffe-772b-47f0-9812-7c5bfd4aca79|0000"
    },
    "replyToId":"67c823b4-4c7a-4828-9d6e-0b84fd052869",
    "serviceUrl":"urn:botframework:websocket:directlinespeech",
    "speak":"<speak version='1.0' xmlns='https://www.w3.org/2001/10/synthesis' xml:lang='en-US'><voice name='Microsoft Server Speech Text to Speech Voice (en-US, JessaRUS)'>Echo: Hello and welcome.</voice></speak>",
    "text":"Echo: Hello and welcome.",
    "timestamp":"2019-07-19T20:03:51.1939097Z",
    "type":"message"
}
```

To learn more about what's returned in the JSON output, see [fields in the Activity](https://github.com/microsoft/botframework-sdk/blob/master/specs/botframework-activity/botframework-activity.md). For the purpose of this tutorial, you can focus on the [Text](https://github.com/microsoft/botframework-sdk/blob/master/specs/botframework-activity/botframework-activity.md#text) and [Speak](https://github.com/microsoft/botframework-sdk/blob/master/specs/botframework-activity/botframework-activity.md#speak) fields.

### View client source code for calls to the Speech SDK

The Direct Line Speech Client uses the NuGet package [Microsoft.CognitiveServices.Speech](https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech/), which contains the Speech SDK. A good place to start reviewing the sample code is the method InitSpeechConnector() in file [`DLSpeechClient\MainWindow.xaml.cs`](https://github.com/Azure-Samples/Cognitive-Services-Direct-Line-Speech-Client/blob/master/DLSpeechClient/MainWindow.xaml.cs), which creates these two Speech SDK objects:
- [`DialogServiceConfig`](https://docs.microsoft.com/dotnet/api/microsoft.cognitiveservices.speech.dialog.dialogserviceconfig) - For configuration settings (speech subscription key, key region, bot secret)
- [`DialogServiceConnector`](https://docs.microsoft.com/dotnet/api/microsoft.cognitiveservices.speech.dialog.dialogserviceconnector.-ctor) - To manage the channel connection and client subscription events for handling recognized speech and bot responses.

## Add custom keyword activation

The Speech SDK supports custom keyword activation. Similar to "Hey Cortana" for Microsoft's Assistant, you can write an app that will continuously listen for a keyword of your choice. Keep in mind that a keyword can be single word or a multi-word phrase.

> [!NOTE]
> The term *keyword* is often used interchangeably with the term *wake word*, and you may see both used in Microsoft documentation.

Keyword detection is done on the client app. If using a keyword, audio is only streamed to the Direct Line Speech channel if the keyword is detected. The Direct Line Speech channel includes a component called *keyword verification (KWV)*, which does more complex processing in the cloud to verify that the keyword you've chosen is at the start of the audio stream. If key word verification succeeds, then the channel will communicate with the bot.

Follow these steps to create a keyword model, configure the Direct Line Speech Client to use this model, and finally, test it with your bot.

1. Follow these instructions to [create a custom keyword by using the Speech service](https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-devices-sdk-create-kws).
2. Unzip the model file that you downloaded in the previous step. It should be named for your keyword. You're looking for a file named `kws.table`.
3. In the Direct Line Speech client, locate the **Settings** menu (look for the gear icon in the top right). Locate **Model file path** and enter the full path name for the `kws.table` file from step 2.
4. Make sure to check the box labeled **Enabled**. You should see this message next to the check box: "Will listen for the keyword upon next connection". If you've provided the wrong file or an invalid path, you should see an error message.
5. Enter your speech **subscription key**, **subscription key region**, and then click **OK** to close the **Settings** menu.
6. Select a **Bot Secret**, then click **Reconnect**. You should see a message that reads: "New conversation started - type, press the microphone button, or say the keyword". The app is now continuously listening.
7. Speak any phrase that starts with your keyword. For example: "**{your keyword}**, what time is it?". You don't need to pause after uttering the keyword. When finished, two things happen:
   * You'll see a transcription of what you spoke
   * Shortly after, you'll hear the bot's response
8. Continue to experiment with the three input types that your bot supports:
   * Typed-text in the bottom bar
   * Pressing the microphone icon and speaking
   * Saying a phrase that starts with your keyword

### View the source code that enables keyword

In the Direct Line Client source code, take a look at these files to review the code that's used to enable keyword detection:

1. [`DLSpeechClient\Models.cs`](https://github.com/Azure-Samples/Cognitive-Services-Direct-Line-Speech-Client/blob/master/DLSpeechClient/Models.cs) includes a call to the Speech SDK method [`KeywordRecognitionModel.fromFile()`](https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/keywordrecognitionmodel?view=azure-node-latest#fromfile-string-), which is used to instantiate the model from a local file on disk.
1. [`DLSpeechClient\MainWindow.xaml.cs`](https://github.com/Azure-Samples/Cognitive-Services-Direct-Line-Speech-Client/blob/master/DLSpeechClient/MainWindow.xaml.cs) includes a call to Speech SDK method [`DialogServiceConnector.StartKeywordRecognitionAsync()`](https://docs.microsoft.com/dotnet/api/microsoft.cognitiveservices.speech.dialog.dialogserviceconnector.startkeywordrecognitionasync), which activates continuous keyword detection.

## (Optional) Change the language and redeploy your bot

The bot that you've created will listen for and respond in English. However, you're not limited to using English. In this section, you'll learn how to change the language that your bot will listen for and respond in, and redeploy the bot.

### Change the language

1. Let's start by opening `\experimental\directline-speech\csharp_dotnetcore\02.echo-bot\Bots\echo-bot.cs`.
2. Next, locate the SSML. It's easy to find, as it's enclosed in `<speak></speak>` tags.
3. In the SSML string, locate the `<voice name>` tag, replace it with `<voice name='de-DE-Stefan-Apollo'>`, and save. This formatted string tells the text-to-speech service to return a synthesized speech response using the voice `de-DE-Stefan-Apollo`, which is optimized for German.

>[!NOTE]
> You're not limited to German and can choose from the list of available voices from the [Speech service](language-support.md#text-to-speech).

### Redeploy your bot

Now that you've made the necessary change to the bot, the next step is to republish it to your Azure App Service and try it out:

1. Build your solution in Visual Studio and fix any build errors.
2. In the Solution Explorer window, right-click on the **EchoBot** project and select **Publish**.
3. Your previous deployment configuration has already been loaded as the default. Simply click **Publish** next to **EchoBot20190805125647 - Web Deploy**.
4. The **Publish Succeeded** message will appear in the Visual Studio output window, and a web page will launch with the message "Your bot is ready!".
5. Open the Direct Line Speech Client app, click on the settings button (upper-right gear icon), and enter `de-de` in the Language field. This sets the spoken language to be recognized, overriding the default `en-us`.
6. Follow the instructions in [Build the Direct Line Speech Client](#build-the-direct-line-speech-client) to reconnect with your newly deployed bot, speak in the new language and hear you bot reply in that language with the new voice.

## Clean up resources

If you're not going to continue using the echo-bot deployed in this tutorial, you can remove it and all its associated Azure resources by simply deleting the Azure Resource group **SpeechEchoBotTutorial-ResourceGroup**.

1. From the [Azure portal](https://portal.azure.com), click on **Resource Groups** from the left navigation.
2. Find the resource group named: **SpeechEchoBotTutorial-ResourceGroup**. Click the three dots (...).
3. Select **Delete resource group**.

## Next steps

> [!div class="nextstepaction"]
> [Build your own client app with the Speech SDK](quickstart-voice-assistant-csharp-uwp.md)

## See also

* Deploying to an [Azure region near you](https://azure.microsoft.com/global-infrastructure/locations/) to see bot response time improvement
* Deploying to an [Azure region that supports high quality Neural TTS voices](https://docs.microsoft.com/azure/cognitive-services/speech-service/regions#standard-and-neural-voices)
* Pricing associated with Direct Line Speech channel:
  * [Bot Service pricing](https://azure.microsoft.com/pricing/details/bot-service/)
  * [Speech Services](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/)
* Building and deploying your own voice-enabled bot:
  * Build a [Bot-Framework bot](https://dev.botframework.com/). Register it with [Direct Line Speech channel](https://docs.microsoft.com/azure/bot-service/bot-service-channel-connect-directlinespeech?view=azure-bot-service-4.0) and [customize your bot for voice](https://docs.microsoft.com/azure/bot-service/directline-speech-bot?view=azure-bot-service-4.0)
  * Explore existing [Bot-Framework solutions](https://github.com/microsoft/botframework-solutions): Build a [custom voice assistant](https://docs.microsoft.com/azure/cognitive-services/speech-service/voice-assistants) and [voice-enable it](https://github.com/microsoft/botframework-solutions/blob/master/docs/howto/assistant/csharp/speechenablement.md)
