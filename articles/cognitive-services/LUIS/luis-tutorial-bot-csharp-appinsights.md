---
title: Application Insights, C# 
titleSuffix: Azure Cognitive Services
description: This tutorial adds bot and Language Understanding information to Application Insights telemetry data storage.
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: tutorial
ms.date: 06/16/2019
ms.author: diberry
---

# Add LUIS results to Application Insights from a Bot in C#

This tutorial adds bot and Language Understanding information to [Application Insights](https://azure.microsoft.com/services/application-insights/) telemetry data storage. Once you have that data, you can query it with the Kusto language or Power BI to analyze, aggregate, and report on intents, and entities of the utterance in real-time. This analysis helps you determine if you should add or edit the intents and entities of your LUIS app.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Capture bot and Language understanding data in Application Insights
> * Query Application Insights for Language Understanding data

## Prerequisites

* An Azure bot service bot, created with Application Insights enabled.
* Downloaded bot code from the previous bot **[tutorial](luis-csharp-tutorial-bf-v4.md)**. 
* [Bot emulator](https://aka.ms/abs/build/emulatordownload)
* [Visual Studio Code](https://code.visualstudio.com/Download)

All of the code in this tutorial is available on the [Azure-Samples Language Understanding GitHub repository](https://github.com/Azure-Samples/cognitive-services-language-understanding/tree/master/documentation-samples/tutorial-web-app-bot-application-insights/v4/luis-csharp-bot-johnsmith-src-telemetry). 

## Add Application Insights to web app bot project

Currently, the Application Insights service, used in this web app bot, collects general state telemetry for the bot. It does not collect LUIS information. 

In order to capture the LUIS information, the web app bot needs the **[Microsoft.ApplicationInsights](https://www.nuget.org/packages/Microsoft.ApplicationInsights/)** NuGet package installed and configured.  

1. From Visual Studio, add the dependency to the solution. In the **Solution Explorer**, right-click on the project name and select **Manage NuGet Packages...**. The NuGet Package manager shows a list of installed packages. 
1. Select **Browse** then search for **Microsoft.ApplicationInsights**.
1. Install the package. 

## Capture and send LUIS query results to Application Insights

1. Open the `LuisHelper.cs` file and replace the contents with the following code. The **LogToApplicationInsights** method capture the bot and LUIS data and sends it to Application Insights as a Trace event named `LUIS`.

    ```csharp
    // Copyright (c) Microsoft Corporation. All rights reserved.
    // Licensed under the MIT License.
    
    using System;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Bot.Builder;
    using Microsoft.Bot.Builder.AI.Luis;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Logging;
    using Microsoft.ApplicationInsights;
    using System.Collections.Generic;
    
    namespace Microsoft.BotBuilderSamples
    {
        public static class LuisHelper
        {
            public static async Task<BookingDetails> ExecuteLuisQuery(IConfiguration configuration, ILogger logger, ITurnContext turnContext, CancellationToken cancellationToken)
            {
                var bookingDetails = new BookingDetails();
    
                try
                {
                    // Create the LUIS settings from configuration.
                    var luisApplication = new LuisApplication(
                        configuration["LuisAppId"],
                        configuration["LuisAPIKey"],
                        "https://" + configuration["LuisAPIHostName"]
                    );
    
                    var recognizer = new LuisRecognizer(luisApplication);
    
                    // The actual call to LUIS
                    var recognizerResult = await recognizer.RecognizeAsync(turnContext, cancellationToken);
    
                    LuisHelper.LogToApplicationInsights(configuration, turnContext, recognizerResult);
    
                    var (intent, score) = recognizerResult.GetTopScoringIntent();
                    if (intent == "Book_flight")
                    {
                        // We need to get the result from the LUIS JSON which at every level returns an array.
                        bookingDetails.Destination = recognizerResult.Entities["To"]?.FirstOrDefault()?["Airport"]?.FirstOrDefault()?.FirstOrDefault()?.ToString();
                        bookingDetails.Origin = recognizerResult.Entities["From"]?.FirstOrDefault()?["Airport"]?.FirstOrDefault()?.FirstOrDefault()?.ToString();
    
                        // This value will be a TIMEX. And we are only interested in a Date so grab the first result and drop the Time part.
                        // TIMEX is a format that represents DateTime expressions that include some ambiguity. e.g. missing a Year.
                        bookingDetails.TravelDate = recognizerResult.Entities["datetime"]?.FirstOrDefault()?["timex"]?.FirstOrDefault()?.ToString().Split('T')[0];
                    }
                }
                catch (Exception e)
                {
                    logger.LogWarning($"LUIS Exception: {e.Message} Check your LUIS configuration.");
                }
    
                return bookingDetails;
            }
            public static void LogToApplicationInsights(IConfiguration configuration, ITurnContext turnContext, RecognizerResult result)
            {
                // Create Application Insights object
                TelemetryClient telemetry = new TelemetryClient();
    
                // Set Application Insights Instrumentation Key from App Settings
                telemetry.InstrumentationKey = configuration["BotDevAppInsightsKey"];
    
                // Collect information to send to Application Insights
                Dictionary<string, string> logProperties = new Dictionary<string, string>();
    
                logProperties.Add("BotConversation", turnContext.Activity.Conversation.Name);
                logProperties.Add("Bot_userId", turnContext.Activity.Conversation.Id);
    
                logProperties.Add("LUIS_query", result.Text);
                logProperties.Add("LUIS_topScoringIntent_Name", result.GetTopScoringIntent().intent);
                logProperties.Add("LUIS_topScoringIntentScore", result.GetTopScoringIntent().score.ToString());
    
    
                // Add entities to collected information
                int i = 1;
                if (result.Entities.Count > 0)
                {
                    foreach (var item in result.Entities)
                    {
                        logProperties.Add("LUIS_entities_" + i++ + "_" + item.Key, item.Value.ToString());
                    }
                }
    
                // Send to Application Insights
                telemetry.TrackTrace("LUIS", ApplicationInsights.DataContracts.SeverityLevel.Information, logProperties);
    
            }
        }
    }
    ```

## Add Application Insights instrumentation key 

In order to add data to application insights, you need the instrumentation key.

1. In a browser, in the [Azure portal](https://portal.azure.com), find your bot's **Application Insights** resource. Its name will have most of the bot's name, then random characters at the end of the name, such as `luis-csharp-bot-johnsmithxqowom`. 
1. On the Application Insights resource, on the **Overview** page, copy the **Instrumentation Key**.
1. In Visual Studio, open the **appsettings.json** file at the root of the bot project. This file holds all your environment variables.
1. Add a new variable, `BotDevAppInsightsKey` with the value of your instrumentation key. The value in should be in quotes. 

## Build and start the bot

1. In Visual Studio, build and run the bot. 
1. Start the bot emulator and open the bot. This [step](luis-csharp-tutorial-bf-v4.md#use-the-bot-emulator-to-test-the-bot) is provided in the previous tutorial.

1. Ask the bot a question. This [step](luis-csharp-tutorial-bf-v4.md#ask-bot-a-question-for-the-book-flight-intent) is provided in the previous tutorial.

## View LUIS entries in Application Insights

Open Application Insights to see the LUIS entries. It can take a few minutes for the data to appear in Application Insights.

1. In the [Azure portal](https://portal.azure.com), open the bot's Application Insights resource. 
1. When the resource opens, select **Search** and search for all data in the last **30 minutes** with the event type of **Trace**. Select the trace named **LUIS**. 
1. The bot and LUIS information is available under **Custom Properties**. 

    ![Review LUIS custom properties stored in Application Insights](./media/luis-tutorial-appinsights/application-insights-luis-trace-custom-properties-csharp.png)

## Query Application Insights for intent, score, and utterance
Application Insights gives you the power to query the data with the [Kusto](https://docs.microsoft.com/azure/azure-monitor/log-query/log-query-overview#what-language-do-log-queries-use) language, as well as export it to [Power BI](https://powerbi.microsoft.com). 

1. Select **Log (Analytics)**. A new window opens with a query window at the top and a data table window below that. If you have used databases before, this arrangement is familiar. The query represents your previous filtered data. The **CustomDimensions** column has the bot and LUIS information.
1. To pull out the top intent, score, and utterance, add the following just above the last line (the `|top...` line) in the query window:

    ```kusto
    | extend topIntent = tostring(customDimensions.LUIS_topScoringIntent_Name)
    | extend score = todouble(customDimensions.LUIS_topScoringIntentScore)
    | extend utterance = tostring(customDimensions.LUIS_query)
    ```

1. Run the query. The new columns of topIntent, score, and utterance are available. Select topIntent column to sort.

Learn more about the [Kusto query language](https://docs.microsoft.com/azure/log-analytics/query-language/get-started-queries) or [export the data to Power BI](https://docs.microsoft.com/azure/application-insights/app-insights-export-power-bi). 


## Learn more about Bot Framework

Learn more about [Bot Framework](https://dev.botframework.com/).

## Next steps

Other information you may want to add to the application insights data includes app ID, version ID, last model change date, last train date, last publish date. These values can either be retrieved from the endpoint URL (app ID and version ID), or from an authoring API call then set in the web app bot settings and pulled from there.  

If you are using the same endpoint subscription for more than one LUIS app, you should also include the subscription ID and a property stating that it is a shared key.

> [!div class="nextstepaction"]
> [Learn more about example utterances](luis-how-to-add-example-utterances.md)
