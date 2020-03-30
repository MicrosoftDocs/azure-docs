---
title: "Tutorial: Integrate with Power Virtual Agent - QnA Maker"
description: In this tutorial, improve the quality of your knowledge base with active learning. Review, accept or reject, add without removing or changing existing questions.
ms.topic: tutorial
ms.date: 03/11/2020
---

# Tutorial: Add knowledge base to Power Virtual Agent
Create and extend a [Power Virtual Agent](https://powervirtualagents.microsoft.com/) bot to provide answers from your knowledge base.

**In this tutorial, you learn how to:**

<!-- green checkmark -->
> [!div class="checklist"]
> * Create Power Virtual Agent
> * Create System fallback topic
> * Add QnA Maker as action to topic as Power Automate flow
> * Create Power Automate solution
> * Add Power Automate flow to solution
> * Publish Power Virtual Agent
> * Test Power Virtual Agent, recieve answer from QnA Maker knowledge base

## Integrate a Power Virtual Agent with a knowledge base

[Power Virtual Agents](https://powervirtualagents.microsoft.com/) allows teams to easily create powerful bots using a guided, no-code graphical interface without the need for data scientists or developers.

A Power Virtual Agent is created with a series of topics (subject areas), in order to answer user questions by performing actions. If an answer can't be found, a system fallback can return an answer.

Configure the agent to send the question to your knowledge base as part of a topic's action or as part of the **System Fallback** topic path. They both use the same mechanism of an action to connect to your knowledge base and return an answer.

## Power Automate connects to GenerateAnswer action

To connect your agent to your knowledge base, use Power Automate to create the action. Power Automate provides a process **flow**, which connects to QnA Maker's GenerateAnswer API.

Once the **flow** is designed and saved, it is available from a Power Automate **Solution**.  Once the GenerateAnswer flow is added to a solution, use that solution as an action in your agent.

## Process steps to connect an agent to your knowledge base

The following steps are presented as an overview to help you understand how the steps relate to the goal of connecting a Power Virtual Agent to a QnA Maker knowledge base.

Steps to use a Power Virtual agent with QnA Maker:
* In [QnA Maker](https://www.qnamaker.ai/) portal
    * Build and publish knowledge base
    * Copy knowledge base details including knowledge base ID, runtime endpoint key, and runtime endpoint host.
* In [Power Virtual Agent](https://powerva.microsoft.com/) portal
    * Build agent topic
    * Call an action (to Power Automate Flow)
* In [Power Automate](https://us.flow.microsoft.com/) portal
    * Build a flow with connector to [QnA
    Maker's GenerateAnswer](https://docs.microsoft.com/connectors/cognitiveservicesqnamaker/)
        * QnA Maker published knowledge base information
            * Knowledge base ID
            * QnA Maker resource endpoint host
            * QnA Maker resource endpoint key
        * Input - user query
        * Output - knowledge base answer
    * Create solution and add flow
* Return to Power Virtual Agent
    * Select solution's output as message for topic

## Create and publish a knowledge base

1. Follow the [quickstart](../Quickstarts/create-publish-knowledge-base.md) to create a knowledge base. Do not complete the last section to create a bot. This tutorial is a replacement for the last section of the quickstart because this tutorial uses the Power Virtual Agent to create a bot, instead of the Bot Framework bot in the quickstart.

    > [!div class="mx-imgBorder"]
    > ![Enter your published knowledge base settings found on the **Settings** page in the [QnA Maker](https://www.qnamaker.ai/) portal.](../media/how-to-integrate-power-virtual-agent/published-knowledge-base-settings.png)

    You will need this information for the [Power Automate step](#create-power-automate-flow-to-connect-to-your-knowledge-base) to configure your QnA Maker GenerateAnswer connection.

1. Find the endpoint key, endpoint host, and knowledge base ID on the **Settings** page in the QnA Maker portal.

## Create Power Virtual Agent

1. [Sign into](https://go.microsoft.com/fwlink/?LinkId=2108000&clcid=0x409) the Power Virtual Agent with your school or work email account.
1. If this is your first bot, you should be on the **Home** page of the agent. If this is not your first Power Virtual Agent, select the bot from the top-right navigation and select **+ New Bot**.

    > [!div class="mx-imgBorder"]
    > ![Enter your published knowledge base settings found on the **Settings** page in the [QnA Maker](https://www.qnamaker.ai/) portal.](../media/how-to-integrate-power-virtual-agent/power-virtual-agent-home.png)

## Several topics are provided in the bot

The agent uses the topic collection to answer questions in your subject area. In this tutorial, the agent has many topics provided for you, divided into **User Topics** and **System topics**.

> [!div class="mx-imgBorder"]
> ![The agent uses the topic collection to answer questions in your subject area. In this tutorial, the agent has many topics provided for divided into **User Topics** and **System topics**.](../media/how-to-integrate-power-virtual-agent/power-virtual-agent-topics-provided.png)


## Create Power Virtual Agent's System fallback topic

While the agent can connect to your knowledge base from any topic, this tutorial uses the System **Fallback** topic. The fallback topic is used when the agent can't find an answer. The agent passes the user's text to QnA Maker's GenerateAnswer API, receives the answer from your knowledge base, and displays it back to the user as a message.

1. In the [Power Virtual Agents](https://powerva.microsoft.com/#/) portal, on the top-right corner of the navigation, select the **Settings** page. The icon for this page is the gear. Select **System Fallback**.

    > [!div class="mx-imgBorder"]
    > ![Power Virtual agent menu item for System Fallback](../media/how-to-integrate-power-virtual-agent/power-virtual-agent-settings-system-fallback.png)

1. On the pop-up **Settings** window, select **+ Add** to add a System Fallback topic.

    > [!div class="mx-imgBorder"]
    > ![On Settings window, add fallback topic.](../media/how-to-integrate-power-virtual-agent/power-virtual-agent-settings-add-fallback-topic.png)

1. After the topic is added, select **Go to Fallback topic** to author the Fallback topic on the authoring canvas.

    > [!TIP]
    > If you need to return to the Fallback topic, it is available in the **Topics** section, as part of the **System** topics.

## Use authoring canvas to add an action

Use the Power Virtual Agents authoring canvas to connect the Fallback topic to your knowledge base. The topic starts with the **unrecognized user text**. Add an action that passes that text to QnA Maker, then shows the answer as a message. The last step of displaying an answer is handled as a [separate step](#add-solutions-flow-to-power-virtual-agent) later in this tutorial.

This section creates the fallback topic conversation flow.

1. The new Fallback action may already have conversation flow elements. Delete the **Escalate** item by selecting the Options menu.

    > [!div class="mx-imgBorder"]
    > ![Start fallback action with trigger phrases](../media/how-to-integrate-power-virtual-agent/power-virtual-agent-fallback-topic-delete-escalate.png)

1. Select the **+** connector flowing from the **Message** box, then select **Call an action**.

    > [!div class="mx-imgBorder"]
    > ![Call an action](../media/how-to-integrate-power-virtual-agent/create-new-item-call-an-action.png)

1. Select **Create a flow**. The process takes you to **Power Automate**, a different browser-based portal.

    > [!div class="mx-imgBorder"]
    > ![Call an action](../media/how-to-integrate-power-virtual-agent/create-a-flow.png)

## Create Power Automate Flow to connect to your knowledge base

The following procedure creates a **Power Automate** flow that:
* takes the incoming user text
* sends it to QnA Maker
* assigns the QnA Maker top answer to a variable
* sends the variable (top answer) as the response back to your agent

1. In **Power Automate**, the **Flow Template** is started for you. On the **Power Virtual Agents** flow item, select **Edit** to configure the input variable coming from the agent to your knowledge base. The text-based input variable is the user-submitted text question from your agent.

    > [!div class="mx-imgBorder"]
    > ![Configure your input variable as a text string](../media/how-to-integrate-power-virtual-agent/power-automate-configure-input-variable.png)

1. Add a text input and name the variable `InputText` with a description of `IncomingUserQuestion`. This naming helps distinguish the input text from the output text you create later.

    > [!div class="mx-imgBorder"]
    > ![Add a text input and name the variable `InputText` with a description of `UserQuestion`](../media/how-to-integrate-power-virtual-agent/power-automate-configure-input-variable-name-and-description.png)

1. Select the **+** connector flowing from the **Power Virtual Agents** box, to insert a new step in the flow (before the **Return value(s) to Power Virtual Agent**), then select **Add an action**.

1. Search for `Qna` to find the **QnA Maker** actions, then select **Generate answer**.

    > [!div class="mx-imgBorder"]
    > ![Search for `Qna` to find the **QnA Maker** actions, then select **Generate answer**](../media/how-to-integrate-power-virtual-agent/generate-answer-action-selected.png)

    The three (3) required connection settings for QnA Maker appear in the action and the question settings from the Power Virtual Agent.

    > [!div class="mx-imgBorder"]
    > ![The connections settings for QnA Maker appear in the action.](../media/how-to-integrate-power-virtual-agent/generate-answer-knowledge-base-settings.png)

1. Configure the action with your knowledge base ID, endpoint host and endpoint key. These are found on the **Settings** page of your knowledge base, in the QnA Maker portal.

    > [!div class="mx-imgBorder"]
    > ![Enter your published knowledge base settings found on the **Settings** page in the [QnA Maker](https://www.qnamaker.ai/) portal.](../media/how-to-integrate-power-virtual-agent/published-knowledge-base-settings.png)

1. To configure the **Question**, select the text box, then select the  `InputText` from the list.

1. To insert a new step in the flow, select the **+** connector flowing from the **Generate answer** action box, then select **Add an action**.

1. To add a variable to capture the answer text returned from GenerateAnswer, search for and select the `Initialize variable` action.

    Set the name of the variable to `OutgoingQnAAnswer`, and select the type as **String**. Don't set the **Value**.

    > [!div class="mx-imgBorder"]
    > ![Set the name of the variable to `QnAAnswer`, and select the type as **String**](../media/how-to-integrate-power-virtual-agent/initialize-output-variable-for-qna-answer.png)

1. To insert a new step in the flow, select the **+** connector flowing from the **Initialize variable** action box, then select **Add an action**.

1. To set the entire knowledge base JSON response to the variable, search for and select the`Apply to each` action. Select the GenerateAnswer `answers`.

1. To return only the top answer, in the same **Apply to each** box, select **Add an action**. Search for and select **Set variable**.

    In the **Set variable** box, select the text box for **Name**, then select **OutgoingQnAAnswer** from the list.

    Select the text box for **Value**, then select **Answers Answer** from the list.

    > [!div class="mx-imgBorder"]
    > ![Set the name and value for the variable ](../media/how-to-integrate-power-virtual-agent/power-automate-flow-apply-to-each-set-variable.png)

1. To return the variable (and its value), select the **Return value(s) to Power Virtual Agent** flow item then select **Edit**, then **Add an output**. Select a **Text** output type then enter the **Title** of `FinalAnswer`. Select the text box for the **Value**, then select the `OutgoingQnAAnswer` variable.

    > [!div class="mx-imgBorder"]
    > ![Set the return value](../media/how-to-integrate-power-virtual-agent/power-automate-flow-return-value.png)

1. Select **Save** to save the Flow.

## Create solution and add flow

In order for the Power Virtual Agent to find and connect to the flow, the flow must be included in a Power Automate Solution.

1. While still in the Power Automate portal, select **Solutions** from the left-side navigation.

1. Select **+ New solution**.

1. Enter a display name. The list of solutions includes every solution in your organization or school. Choose a naming convention that helps you filter to just your solutions such as prefixing your email to your solution name: `jondoe-power-virtual-agent-qnamaker-fallback`.

1. Select your publisher from the list of choices.

1. Accept the default values for the name and version.

1. Select **Create** to finish the process.

## Add flow to solution

1. In the list of solutions, select the solution you just created. It should be at the top of the list. If it isn't, search by your email name, which is part of the solution name.

1. In the solution, select **+ Add existing**, then select **Flow** from the list.

1. Find your flow, then select **Add** to finish the process. If there are many flows, look at the **Modified** column to find the most recent flow.

## Add solution's flow to Power Virtual Agent

1. Return to the browser tab with your Power Virtual Agent. The authoring canvas should still be open.

1. Select the **+** connector under the **Message** action box to insert a new step in the flow, then select **Call an action**.

1. In the new action, select the input value of **UnrecognizedTriggerPhrase**. This passes the text from the agent to the flow.

    > [!div class="mx-imgBorder"]
    > ![In the new action, select the input value of **UnrecognizedTriggerPhrase**.](../media/how-to-integrate-power-virtual-agent/power-virtual-agent-select-unrecognized-trigger-phrase.png)

1. Select the **+** connector under the **Action** box to insert a new step in the flow, then select **Show a message**.

1. Enter the message text, `Your answer is:`, and select `FinalAnswer` as a context variable using the function of the in-place toolbar.

    > [!div class="mx-imgBorder"]
    > ![Enter the message text and the `FinalAnswer` from the Power Automate Flow.](../media/how-to-integrate-power-virtual-agent/power-virtual-agent-topic-authoring-canvas-show-message-final-answer.png)

1. Select **Save** from the context toolbar to save the authoring canvas details for the topic.

The final canvas is shown below.

> [!div class="mx-imgBorder"]
> ![Final agent canvas](../media/how-to-integrate-power-virtual-agent/power-virtual-agent-topic-authoring-canvas-full-flow.png)

## Test Power Virtual Agent

1. In the test pane, toggle **Track between topics**. This allows you to watch the progression between topics as well as in a single topic.

1. Test the agent by entering the user text in the order provided below. The authoring canvas reports the successful steps with a green check mark.

|Question order|Test questions|Purpose|
|--|--|--|
|1|Hello|Begin conversation|
|2|Store hours|Sample topic - configured for you without any additional work on your part.|
|3|Yes|In reply to `Did that answer your question?`|
|4|Excellent|In reply to `Please rate your experience.`|
|5|Yes|In reply to `Can I help with anything else?`|
|6|What is a knowledge base?|This question triggers the fallback action, which sends the text to your knowledge base to answer, then the answer is displayed. |

> [!div class="mx-imgBorder"]
> ![Final agent canvas](../media/how-to-integrate-power-virtual-agent/power-virtual-agent-test-tracked.png)

## Publish your bot

In order to make the agent available to all members of your school or organization, you need to publish it.

1. Select **Publish** from the left-navigation, then select **Publish** on the page.

1. Try your bot on the demo website, provided as a link below the **Publish** button .

    A new web page opens with your bot. Ask the bot the same test question: `What is a knowledge base?`

    > [!div class="mx-imgBorder"]
    > ![Final agent canvas](../media/how-to-integrate-power-virtual-agent/demo-chat-bot.png)

## Share your bot

In order to share the demo website, configure it as a channel.

1. Select **Manage** then **Channels** from the left-navigation.

1. Select **Demo website** from the channels list.

1. Copy the link and select **Save**. Paste the link to your demo website into an email to your school or organization members.

## Clean up resources

When you are done with the knowledge base, remove the QnA Maker resources in the Azure portal.

## Next step

[Get analytics on your knowledge base](../How-To/get-analytics-knowledge-base.md)

Learn more about:
* [Power Virtual Agents](https://docs.microsoft.com/power-virtual-agents/)
* [Power Automate](https://docs.microsoft.com/power-automate/)
* [QnA Maker connector](https://us.flow.microsoft.com/connectors/shared_cognitiveservicesqnamaker/qna-maker/) and the [settings for the connector](https://docs.microsoft.com/connectors/cognitiveservicesqnamaker/)