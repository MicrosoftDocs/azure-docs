---
title: Add natural language understanding to your bot in Bot Framework SDK using conversational language understanding
description: Learn how to use CLU for natural language understanding in your bot.
keywords: conversational language understanding, bot framework, bot, language understanding, nlu
author: hazemelh
ms.author: hazemelh
manager: cahann
ms.reviewer: cahann
ms.service: language
ms.topic: how-to
ms.date: 05/10/2022
---

# Integrate conversational language understanding with Bot Framework

A dialog is the interaction that occurs between user queries and an application. Dialog management is the process that defines the automatic behaviour that should occur for different customer interactions. While conversational language understanding can classify intents and extract information through entities, the [Bot Framework SDK](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-overview?view=azure-bot-service-4.0) allows you to configure the applied logic for the responses returned from it.

This tutorial will explain how to integrate your own conversational language understanding project (CLU) for a flight booking project in the Bot Framework SDK that includes 3 intents: **Book Flight**, **Get Weather**, and **None**.


## Prerequisites

- Create a [Language resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics) in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
  - You will need the key and endpoint from the resource you create to connect your bot to the API. You'll paste your key and endpoint into the code below later in the tutorial.
- Download the **Core Bot** for CLU sample in [**C#**](https://aka.ms/clu-botframework-overview).
  - Clone the entire Bot Framework Samples repository to get access to this sample project.


## Import a project in conversational language understanding

1. Copy the [FlightBooking.json](https://aka.ms/clu-botframework-json) file in the **Core Bot** for CLU sample.
2. Sign into the [Language Studio](https://language.cognitive.azure.com/) and select your Language resource. 
3. Navigate to [Conversational Language Understanding](https://language.cognitive.azure.com/clu/projects) and click on the service. This will route you the projects page. Click the Import button next to the Create New Project button. Import the FlightBooking.json file with the project name as **FlightBooking**. This will automatically import the CLU project with all the intents, entities, and utterances. 

:::image type="content" source="../media/import.png" alt-text="A screenshot showing where to import a JSON in CLU." lightbox="../media/import.png":::

4. Once the project is loaded, click on **Training** on the left. Press on Start a training job, provide the model name **v1** and press Train. All other settings such as **Standard Training** and the evaluation settings can be left as is.

:::image type="content" source="../media/train-model-tutorial.png" alt-text="A screenshot of the training page in CLU." lightbox="../media/train-model-tutorial.png":::

5. Once training is complete, click to **Deployments** on the left. Click on Add Deployment and create a new deployment with the name **Testing**, and assign model **v1** to the deployment.

:::image type="content" source="../media/deploy-model-tutorial.png" alt-text="A screenshot of the deploy model add deployment page in CLU." lightbox="../media/deploy-model-tutorial.png":::

## Update the settings file

Now that your CLU project is deployed and ready, update the settings that will connect to the deployment. 

In the **Core Bot** sample, update your [appsettings.json](https://aka.ms/clu-botframework-settings) with the appropriate values.

- The _CluProjectName_ is **FlightBooking**.
- The _CluDeploymentName_ is **Testing**
- The _CluAPIKey_ are either of the keys in the Keys and Endpoint section for your Language resource in the Azure portal. You can also copy your key from the Project Settings tab in CLU. 
- The _CluAPIHostName_ is the endpoint found in the Keys and Endpoint section for your Language resource in the Azure portal. Note the format should be ```<Language_Resource_Name>.cognitiveservices.azure.com``` without "https://"

```json
{
  "MicrosoftAppId": "",
  "MicrosoftAppPassword": "",
  "CluProjectName": "",
  "CluDeploymentName": "",
  "CluAPIKey": "",
  "CluAPIHostName": ""
}
```

## Identify integration points

In the Core Bot sample, under the Clu folder, you can check out the **FlightBookingRecognizer.cs** file. Here is where the CLU API call to the deployed endpoint is made to retrieve the CLU prediction for intents and entities.

```csharp
        public FlightBookingRecognizer(IConfiguration configuration)
        {
            var cluIsConfigured = !string.IsNullOrEmpty(configuration["CluProjectName"]) && !string.IsNullOrEmpty(configuration["CluDeploymentName"]) && !string.IsNullOrEmpty(configuration["CluAPIKey"]) && !string.IsNullOrEmpty(configuration["CluAPIHostName"]);
            if (cluIsConfigured)
            {
                var cluApplication = new CluApplication(
                    configuration["CluProjectName"],
                    configuration["CluDeploymentName"],
                    configuration["CluAPIKey"],
                    "https://" + configuration["CluAPIHostName"]);
                // Set the recognizer options depending on which endpoint version you want to use.
                var recognizerOptions = new CluOptions(cluApplication)
                {
                    Language = "en"
                };

                _recognizer = new CluRecognizer(recognizerOptions);
            }
```


Under the folder Dialogs folder, find the **MainDialog** which uses the following to make a CLU prediction.

```csharp
            var cluResult = await _cluRecognizer.RecognizeAsync<FlightBooking>(stepContext.Context, cancellationToken);
```

The logic that determines what to do with the CLU result follows it.

```csharp
 switch (cluResult.TopIntent().intent)
            {
                case FlightBooking.Intent.BookFlight:
                    // Initialize BookingDetails with any entities we may have found in the response.
                    var bookingDetails = new BookingDetails()
                    {
                        Destination = cluResult.Entities.toCity,
                        Origin = cluResult.Entities.fromCity,
                        TravelDate = cluResult.Entities.flightDate,
                    };

                    // Run the BookingDialog giving it whatever details we have from the CLU call, it will fill out the remainder.
                    return await stepContext.BeginDialogAsync(nameof(BookingDialog), bookingDetails, cancellationToken);

                case FlightBooking.Intent.GetWeather:
                    // We haven't implemented the GetWeatherDialog so we just display a TODO message.
                    var getWeatherMessageText = "TODO: get weather flow here";
                    var getWeatherMessage = MessageFactory.Text(getWeatherMessageText, getWeatherMessageText, InputHints.IgnoringInput);
                    await stepContext.Context.SendActivityAsync(getWeatherMessage, cancellationToken);
                    break;

                default:
                    // Catch all for unhandled intents
                    var didntUnderstandMessageText = $"Sorry, I didn't get that. Please try asking in a different way (intent was {cluResult.TopIntent().intent})";
                    var didntUnderstandMessage = MessageFactory.Text(didntUnderstandMessageText, didntUnderstandMessageText, InputHints.IgnoringInput);
                    await stepContext.Context.SendActivityAsync(didntUnderstandMessage, cancellationToken);
                    break;
            }
```

## Run the bot locally

Run the sample locally on your machine **OR** run the bot from a terminal or from Visual Studio:

  A) From a terminal, navigate to `samples/csharp_dotnetcore/90.core-bot-with-clu/90.core-bot-with-clu`

  ```bash
  # run the bot
  dotnet run
  ```

  B) Or from Visual Studio

  - Launch Visual Studio
  - File -> Open -> Project/Solution
  - Navigate to `samples/csharp_dotnetcore/90.core-bot-with-clu/90.core-bot-with-clu` folder
  - Select `CoreBotWithCLU.csproj` file
  - Press `F5` to run the project


## Testing the bot using Bot Framework Emulator

[Bot Framework Emulator](https://github.com/microsoft/botframework-emulator) is a desktop application that allows bot developers to test and debug their bots on localhost or running remotely through a tunnel.

- Install the latest Bot Framework Emulator from [here](https://github.com/Microsoft/BotFramework-Emulator/releases).

## Connect to the bot using Bot Framework Emulator

- Launch Bot Framework Emulator
- File -> Open Bot
- Enter a Bot URL of `http://localhost:3978/api/messages` and press Connect and wait for it to load
- You can now query for different examples such as "Travel from Cairo to Paris" and observe the results

If the top intent returned from CLU resolves to "Book flight" your bot will ask additional questions until it has enough information stored to create a travel booking. At that point it will return this booking information back to your user.

## Next Steps

- Learn more about the [Bot Framework SDK](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-overview?view=azure-bot-service-4.0).


