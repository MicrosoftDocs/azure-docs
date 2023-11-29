---
title: Integrate custom question answering and conversational language understanding with orchestration workflow
description: Learn how to connect different projects with orchestration workflow. 
keywords: conversational language understanding, bot framework, bot, language understanding, nlu
author: aahill
ms.author: aahi
manager: nitinme
ms.reviewer: cahann, hazemelh
ms.service: azure-ai-language
ms.topic: tutorial
ms.date: 05/25/2022
---

# Connect different services with Orchestration workflow

Orchestration workflow is a feature that allows you to connect different projects from LUIS, conversational language understanding, and custom question answering in one project. You can then use this project for predictions under one endpoint. The orchestration project makes a prediction on which project should be called and automatically routes the request to that project, and returns with its response. 

In this tutorial, you will learn how to connect a custom question answering knowledge base with a conversational language understanding project. You will then call the project using the .NET SDK sample for orchestration.

This tutorial will include creating a **chit chat** knowledge base and **email commands** project. Chit chat will deal with common niceties and greetings with static responses. Email commands will predict among a few simple actions for an email assistant. The tutorial will then teach you to call the Orchestrator using the SDK in a .NET environment using a sample solution. 


## Prerequisites

- Create a [Language resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics) **and select the custom question answering feature** in the Azure portal to get your key and endpoint. After it deploys, select **Go to resource**.
  - You will need the key and endpoint from the resource you create to connect your bot to the API. You'll paste your key and endpoint into the code below later in the tutorial. Copy them from the **Keys and Endpoint** tab in your resource.
  - When you enable custom question answering, you must select an Azure search resource to connect to.
  - Make sure the region of your resource is supported by [conversational language understanding](../../conversational-language-understanding/service-limits.md#regional-availability).
- Download the **OrchestrationWorkflowSample** [sample](https://aka.ms/orchestration-sample).

## Create a custom question answering knowledge base

1. Sign into the [Language Studio](https://language.cognitive.azure.com/) and select your Language resource. 
2. Find and select the [Custom question answering](https://language.cognitive.azure.com/questionAnswering/projects/) card in the homepage.
3. Select **Create new project** and add the name **chitchat** with the language _English_ before clicking on **Create project**.
4. When the project loads, select **Add source** and select _Chit chat_. Select the professional personality for chit chat before
    
    :::image type="content" source="../media/chit-chat.png" alt-text="A screenshot of the chit chat popup." lightbox="../media/chit-chat.png":::
    
5. Go to **Deploy knowledge base** from the left navigation menu and select **Deploy** and confirm the popup that shows up.

You are now done with deploying your knowledge base for chit chat. You can explore the type of questions and answers to expect in the **Edit knowledge base** page.

## Create a conversational language understanding project

1. In Language Studio, go to the [Conversational language understanding](https://language.cognitive.azure.com/clu/projects) service. 
2. Download the `EmailProject.json` sample file [here](https://aka.ms/clu-sample-json).
3. Select the **Import** button. Browse to the `EmailProject.json`` file you downloaded and press Done. 
    
    :::image type="content" source="../media/import-export.png" alt-text="A screenshot showing where to import a J son file." lightbox="../media/import-export.png":::
    
4. Once the project is loaded, select **Training jobs** on the left. Press on Start a training job, provide the model name **v1** and press Train.
    
    :::image type="content" source="../media/train-model.png" alt-text="A screenshot of the training page." lightbox="../media/train-model.png":::
    
5. Once training is complete, click to **Deploying a model** on the left. Select **Add Deployment** and create a new deployment with the name **Testing**, and assign model **v1** to the deployment.
    
    :::image type="content" source="../media/deploy-model-tutorial.png" alt-text="A screenshot showing the model deployment page." lightbox="../media/deploy-model-tutorial.png":::
    
You are now done with deploying a conversational language understanding project for email commands. You can explore the different commands in the **Data labeling** page.

## Create an Orchestration workflow project 

1. In Language Studio, go to the [Orchestration workflow](https://language.cognitive.azure.com/orchestration/projects) service.
2. Select **Create new project**. Use the name **Orchestrator** and the language _English_ before clicking next then done.
3. Once the project is created, select **Add** in the **Schema definition** page. 
4. Select _Yes, I want to connect it to an existing project_. Add the intent name **EmailIntent** and select **Conversational Language Understanding** as the connected service. Select the recently created **EmailProject** project for the project name before clicking on **Add Intent**. 

:::image type="content" source="../media/connect-intent-tutorial.png" alt-text="A screenshot of the connect intent popup in orchestration workflow." lightbox="../media/connect-intent-tutorial.png":::

5. Add another intent but now select **Question Answering** as the service and select **chitchat** as the project name. 
6. Similar to conversational language understanding, go to **Training jobs** and start a new training job with the name **v1** and press Train.
7. Once training is complete, click to **Deploying a model** on the left. Select **Add deployment** and create a new deployment with the name **Testing**, and assign model **v1** to the deployment and press Next.
8. On the next page, select the deployment name **Testing** for the **EmailIntent**. This tells the orchestrator to call the **Testing** deployment in **EmailProject** when it routes to it. Custom question answering projects only have one deployment by default. 

:::image type="content" source="../media/deployment-orchestrator-tutorial.png" alt-text="A screenshot of the deployment popup for orchestration workflow." lightbox="../media/deployment-orchestrator-tutorial.png":::

Now your orchestration project is ready to be used. Any incoming request will be routed to either **EmailIntent** and the **EmailProject** in conversational language understanding or **ChitChatIntent** and the **chitchat** knowledge base.

## Call the orchestration project with the Conversations SDK

1. In the downloaded sample, open OrchestrationWorkflowSample.sln in Visual Studio.

2. In the OrchestrationWorkflowSample solution, make sure to install all the required packages. In Visual Studio, go to _Tools_, _NuGet Package Manager_ and select _Package Manager Console_ and run the following command.

```powershell
dotnet add package Azure.AI.Language.Conversations
```
Alternatively, you can search for "Azure.AI.Language.Conversations" in the NuGet package manager and install the latest release.

3. In `Program.cs`, replace `{api-key}` and the `{endpoint}` variables. Use the key and endpoint for the Language resource you created earlier. You can find them in the **Keys and Endpoint** tab in your Language resource in Azure.

```csharp
Uri endpoint = new Uri("{endpoint}");
AzureKeyCredential credential = new AzureKeyCredential("{api-key}");
```

4. Replace the project and deployment parameters to **Orchestrator** and **Testing** as below if they are not set already.

```csharp
string projectName = "Orchestrator";
string deploymentName = "Testing";
```

5. Run the project or press F5 in Visual Studio. 
6. Input a query such as "read the email from matt" or "hello how are you". You'll now observe different responses for each, a conversational language understanding **EmailProject** response from the first query, and the answer from the **chitchat** knowledge base for the second query.

**Conversational Language Understanding**:
:::image type="content" source="../media/clu-response-orchestration.png" alt-text="A screenshot showing the sample response from conversational language understanding." lightbox="../media/clu-response-orchestration.png":::

**Custom Question Answering**:
:::image type="content" source="../media/qna-response-orchestration.png" alt-text="A screenshot showing the sample response from custom question answering." lightbox="../media/qna-response-orchestration.png":::

You can now connect other projects to your orchestrator and begin building complex architectures with various different projects.

## Next steps

- Learn more about [conversational language understanding](./../../conversational-language-understanding/overview.md).
- Learn more about [custom question answering](./../../question-answering/overview.md).


