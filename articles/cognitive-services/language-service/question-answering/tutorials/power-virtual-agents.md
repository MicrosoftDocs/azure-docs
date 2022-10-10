---
title: Tutorial: Add your Question Answering project to Power Virtual Agents
description: In this tutorial, you will learn how to add your Question Answering project to Power Virtual Agents.
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: tutorial
author: jboback
ms.author: jboback
ms.date: 10/9/2022
ms.custom: language-service-question-answering
---

Create and extend a [Power Virtual Agents](https://powervirtualagents.microsoft.com/) bot to provide answers from your knowledge base. 

> [Note]
> The integration demonstrated in this tutorial is in preview and is not intended for deployment to production environments. 

In this tutorial, you learn how to: 
> [!div class="checklist"]
> * Create a Power Virtual Agents bot 
> * Create a system fallback topic
> * Add Question Answering as an action to a topic as a Power Automate flow
> * Create a Power Automate solution
> * Add a Power Automate flow to your solution
> * Publish Power Virtual Agents
> * Test Power Virtual Agents, and receive an answer from your Question Answering project

> [Note]
> The QnA Maker service is being retired on the 31st of March, 2025. A newer version of the question and answering capability is now available as part of [Azure Cognitive Service for Language](../../../language-service/). For question answering capabilities within the Language Service, see [question answering](../overview.md). Starting 1st October, 2022 you won’t be able to create new QnA Maker resources. For information on migrating existing QnA Maker knowledge bases to question answering, consult the [migration guide](../how-to/migrate-qnamaker.md).

## Create and publish a project
1. Follow the [quickstart](../quickstart/sdk?pivots=studio.md) to create a Question Answering project. Once you have deployed your project.
2. After deploying your project from Language Studio, click on “Get Prediction URL”. 
3. Get your Site URL from the hostname of Prediction URL and your Account key which would be the Ocp-Apim-Subscription-Key.

IMAGE

4. Create a Custom Question Answering connector: Follow the [connector documentation](https://learn.microsoft.com/connectors/languagequestionansw/) to create a connection to Question Answering.
5. Use this tutorial to create a Bot with Power Virtual Agents instead of creating a bot from Language Studio.

## Create a bot in Power Virtual Agents
[Power Virtual Agents](https://powervirtualagents.microsoft.com/) allows teams to create powerful bots by using a guided, no-code graphical interface. You don't need data scientists or developers.

Create a bot by following the steps in [Create and delete Power Virtual Agents bots](https://learn.microsoft.com/power-virtual-agents/authoring-first-bot).

## Create the system fallback topic
In Power Virtual Agents, you create a bot with a series of topics (subject areas), in order to answer user questions by performing actions.

Although the bot can connect to your project from any topic, this tutorial uses the system fallback topic. The fallback topic is used when the bot can't find an answer. The bot passes the user's text to Question Answering Query knowledgebase API, receives the answer from your project, and displays it to the user as a message.

Create a fallback topic by following the steps in [Configure the system fallback topic in Power Virtual Agents](https://learn.microsoft.com/power-virtual-agents/authoring-system-fallback-topic).

## Use the authoring canvas to add an action
Use the Power Virtual Agents authoring canvas to connect the fallback topic to your project. The topic starts with the unrecognized user text. Add an action that passes that text to Question Answering, and then shows the answer as a message. The last step of displaying an answer is handled as a [separate step](../../../QnAMaker/Tutorials/integrate-with-power-virtual-assistant-fallback-topic#add-your-solutions-flow-to-power-virtual-agents.md), later in this tutorial.

This section creates the fallback topic conversation flow.

The new fallback action might already have conversation flow elements. Delete the **Escalate** item by selecting the **Options** menu.

IMAGE

Below the *Message* node, select the (**+**) icon, then select **Call an action**.

IMAGE

Select **Create a flow**. This takes you to the Power Automate portal.

IMAGE

Power Automate opens a new template as shown below.

**Do not use the template shown above.**

Instead you need to follow the steps below that creates a Power Automate flow. This flow:
- Takes the incoming user text as a question, and sends it to Question Answering.
- Returns the top response back to your bot.

click on **Create** in the left panel, then click "OK" to leave the page.

IMAGE

Select "Instant Cloud flow"

IMAGE

For testing this connector, you can click on “When PowerVirtual Agents calls a flow” and click on **Create**.

IMAGE

Click on "New Step" and search for "Power Virtual Agents". Choose "Add and input" and select text. Next, provide the keyword and the value.

IMAGE

Click on "New Step" and search "Language - Question Answering" and choose "Generate answer from Project" from the three actions.

IMAGE

This option helps in answering the specified question using your project. Type in the project name, deployment name and API version and select the question from the previous step.

IMAGE

Click on "New Step" and search for "Initialize variable". Choose a name for your variable, and select the "String" type.

IMAGE

Click on "New Step" again, and search for "Apply to each", then select the output from the previous steps and add an action of "Set variable" and select the connector action. ????????????????

IMAGE

Click on "New Step" and search for "Return value(s) to Power Virtual Agents" and type in a keyword, then choose the previous variable name in the answer. ????????

IMAGE