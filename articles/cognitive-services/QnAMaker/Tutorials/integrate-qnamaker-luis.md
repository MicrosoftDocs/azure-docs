---
title: Integrate QnA Maker and LUIS - Microsoft Cognitive Services | Microsoft Docs
titleSuffix: Azure
description: a step-by-step tutorial on integrating QnA Maker and LUIS
services: cognitive-services
author: nstulasi
manager: sangitap
ms.service: cognitive-services
ms.component: QnAMaker
ms.topic: article
ms.date: 04/21/2018
ms.author: saneppal
---

# Integrate QnA Maker and LUIS to distribute your knowledge base
As your QnA Maker knowledge base grows large, it becomes difficult to maintain it as a single monolithic set and there is a need to split the knowledge base into smaller logical chunks.

While it is straightforward to create multiple knowledge bases in QnA Maker, you will need some logic to route the incoming question to the appropriate knowledge base. You can do this by using LUIS.

## Architecture

![QnA Maker luis architecture](../media/qnamaker-tutorials-qna-luis/qnamaker-luis-architecture.PNG)

In the above scenario, QnA Maker first gets the intent of the incoming question from a LUIS model, and then use that to route it to the correct QnA Maker knowledge base.

## Prerequisites
- Log in to the [LUIS](https://www.luis.ai/) portal and [create an app](https://docs.microsoft.com/azure/cognitive-services/luis/create-new-app).
- [Add intents](https://docs.microsoft.com/azure/cognitive-services/luis/add-intents) as per your scenario.
- [Train](https://docs.microsoft.com/azure/cognitive-services/luis/luis-how-to-train) and [publish](https://docs.microsoft.com/azure/cognitive-services/luis/publishapp) your LUIS App.
- Log in to [QnA Maker](https://qnamaker.ai) and [create](https://www.qnamaker.ai/Create) knowledge bases as per your scenario.
- Test and publish the knowledge bases.

## QnA Maker + LUIS Bot
1. First create a Web App bot with the LUIS template, link it with the LUIS app you created above, and modify the intents. See detailed steps [here](https://docs.microsoft.com/azure/cognitive-services/luis/luis-csharp-tutorial-build-bot-framework-sample).

2. Add dependencies to the top of the file, with the other dependencies:

    ```
    using RestSharp;
    using System.Collections.Generic;
    using Newtonsoft.Json;
    ```
3. Add the below class for calling your QnA Maker service:

    ```
        /// <summary>
        /// QnAMakerService is a wrapper over the QnA Maker REST endpoint
        /// </summary>
        [Serializable]
        public class QnAMakerService
        {
            private string qnaServiceHostName;
            private string knowledgeBaseId;
            private string endpointKey;
    
            /// <summary>
            /// Initialize a particular endpoint with it's details
            /// </summary>
            /// <param name="hostName">Hostname of the endpoint</param>
            /// <param name="kbId">Knowledge base ID</param>
            /// <param name="ek">Endpoint Key</param>
            public QnAMakerService(string hostName, string kbId, string ek)
            {
                qnaServiceHostName = hostName;
                knowledgeBaseId = kbId;
                endpointKey = ek;
            }
    
            /// <summary>
            /// Call the QnA Maker endpoint and get a response
            /// </summary>
            /// <param name="query">User question</param>
            /// <returns></returns>
            public string GetAnswer(string query)
            {
                var client = new RestClient( qnaServiceHostName + "/qnamaker/knowledgebases/" + knowledgeBaseId + "/generateAnswer");
                var request = new RestRequest(Method.POST);
                request.AddHeader("authorization", "EndpointKey " + endpointKey);
                request.AddHeader("content-type", "application/json");
                request.AddParameter("application/json", "{\"question\": \"" + query + "\"}", ParameterType.RequestBody);
                IRestResponse response = client.Execute(request);
    
                // Deserialize the response JSON
                QnAAnswer answer = JsonConvert.DeserializeObject<QnAAnswer>(response.Content);
    
                // Return the answer if present
                if (answer.answers.Count > 0)
                    return answer.answers[0].answer;
                else
                    return "No good match found.";
            }
        }
    
        /* START - QnA Maker Response Class */
        public class Metadata
        {
            public string name { get; set; }
            public string value { get; set; }
        }
    
        public class Answer
        {
            public IList<string> questions { get; set; }
            public string answer { get; set; }
            public double score { get; set; }
            public int id { get; set; }
            public string source { get; set; }
            public IList<object> keywords { get; set; }
            public IList<Metadata> metadata { get; set; }
        }
    
        public class QnAAnswer
        {
            public IList<Answer> answers { get; set; }
        }
        /* END - QnA Maker Response Class */
    ```

3. Go to https://qnamaker.ai -> My knowledge bases -> View code, of your corresponding knowledge base. Get the following information:

    ![QnA Maker HTTP request](../media/qnamaker-tutorials-qna-luis/qnamaker-http-request.png)

4. Instantiate the QnAMakerService class for each of your knowledge bases:
    ```
            // Instantiate the knowledge bases
            public QnAMakerService hrQnAService = new QnAMakerService("https://hrkb.azurewebsites.net", "<HR knowledge base id>", "<HR endpoint key>");
            public QnAMakerService payrollQnAService = new QnAMakerService("https://payrollkb.azurewebsites.net", "<Payroll knowledge base id>", "<Payroll endpoint key>");
            public QnAMakerService financeQnAService = new QnAMakerService("https://financekb.azurewebsites.net", "<Finance knowledge base id>", "<Finance endpoint key>");
    ```

5. Call the corresponding knowledge base for the intent.
    ```
            // HR Intent
            [LuisIntent("HR")]
            public async Task CancelIntent(IDialogContext context, LuisResult result)
            {
                // Ask the HR knowledge base
                await context.PostAsync(hrQnAService.GetAnswer(result.Query));
            }
    
            // Payroll intent
            [LuisIntent("Payroll")]
            public async Task GreetingIntent(IDialogContext context, LuisResult result)
            {
                // Ask the payroll knowledge base
                await context.PostAsync(payrollQnAService.GetAnswer(result.Query));
            }
    
            // Finance intent
            [LuisIntent("Finance")]
            public async Task HelpIntent(IDialogContext context, LuisResult result)
            {
                // Ask the finance knowledge base
                await context.PostAsync(financeQnAService.GetAnswer(result.Query));
            }
    ```

## Build the bot
1. In the code editor, right-click on `build.cmd` and select **Run from Console**.

    ![run from console](../media/qnamaker-tutorials-qna-luis/run-from-console.png)

2. The code view is replaced with a terminal window showing the progress and results of the build.

    ![console build](../media/qnamaker-tutorials-qna-luis/console-build.png)

## Test the bot
In the Azure portal, select **Test in Web Chat** to test the bot. Type messages from different intents to get the response from the corresponding knowledge base.

![web chat test](../media/qnamaker-tutorials-qna-luis/qnamaker-web-chat.png)

## Next steps

> [!div class="nextstepaction"]
> [Create a business continuity plan for QnA Maker](../How-To/business-continuity-plan.md)
