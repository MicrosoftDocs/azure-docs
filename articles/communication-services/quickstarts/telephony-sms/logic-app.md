---
title: Quickstart - Send SMS messages in Azure Logic Apps using Azure Communication Services
titleSuffix: An Azure Communication Services quickstart
description: Learn how to link SMS functionality to Azure Logic Apps workflows.
author: tophpalmer
manager: anvalent
services: azure-communication-services

ms.author: chpalm
ms.date: 08/09/2020
ms.topic: quickstart
ms.service: azure-communication-services
---
# Send SMS messages in Azure Logic Apps

Get started with Azure Communication Services by using an Azure Logic app to send SMS messages with the Azure Communication Services connector. This quickstart shows you how to automatically send text messages in response to Event Grid resource events, incoming email messages, or any other Logic App trigger.

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- An active Communication Services resource. [Create a Communication Services resource](../create-communication-resource.md).
- An active Logic Apps resource. [Create your Logic App](https://docs.microsoft.com/azure/logic-apps/quickstart-create-first-logic-app-workflow#create-your-logic-app)
- A [Logic Apps workflow](https://docs.microsoft.com/azure/logic-apps/quickstart-create-first-logic-app-workflow).
- An SMS enabled telephone number. [Get a phone number](./get-phone-number.md).

If you're new to Logic Apps, review [What are Azure Logic Apps](https://docs.microsoft.com/azure/logic-apps/logic-apps-overview) before getting started.

## Setting up

## Integrate SMS action to Logic Apps workflow

A prerequisite to this quickstart is a functional [Logic Apps workflow](https://docs.microsoft.com/azure/logic-apps/quickstart-create-first-logic-app-workflow). Once you have your workflow, we'll add an SMS action using Azure Communication Services.

First, insert a new step to your workflow. Under the last step where you want to add an action, choose **New step**. Alternatively, you can move your pointer over the arrow between two steps and **Add an action**.

When prompted by the action search box, enter "Azure Communication Services" as your filter. Select the **Send SMS** action.

![Selecting the Communication Service connector in Azure Logic Apps](../../media/logic-app-action-select.PNG)

Select the Azure Communication Service resource you want to use. Then, specify source and destination telephone numbers. To test the Logic App, you can use your own telephone number as a destination phone number.

Then, specify the message contents with a message like, "Hello from Logic Apps 👋".

Save the logic app by clicking the save button.

![Configuring the Send SMS Logic App action](../../media/logic-app-action.PNG)

## Run your Logic App

To manually start your Logic App, select **Run** from the designer toolbar. You can also wait for your Logic App to be triggered. In both cases, the destination telephone number should receive an SMS message.

For more information on running the Logic App, follow [instructions](https://docs.microsoft.com/azure/logic-apps/quickstart-create-first-logic-app-workflow#run-your-logic-app)

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](./create-communication-resource.md#clean-up-resources).

To clean up and remove Logic App workflows and resources take a look at [instructions](https://docs.microsoft.com/azure/logic-apps/quickstart-create-first-logic-app-workflow#clean-up-resources)

## Next steps

In this quickstart, you learned how to send SMS messages using Logic Apps and Azure Communication Services.

> [!div class="nextstepaction"]
> [Subscribe to SMS Events](./handle-sms-events.md)

For more information, see the following articles:

- [Plan your PSTN Solution](../../concepts/telephony-sms/plan-solution.md)
- Learn more about [SMS Concepts](../../concepts/telephony-sms/concepts.md)
- Learn more about [SMS SDK](../../concepts/telephony-sms/sdk-features.md)
