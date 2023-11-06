---
title: Deploy a flow as a managed online endpoint for real-time inference
titleSuffix: Azure AI services
description: Learn how to deploy a flow as a managed online endpoint for real-time inference with Azure AI Studio.
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: how-to
ms.date: 10/1/2023
ms.author: eur
---

# Deploy a flow as a managed online endpoint for real-time inference

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

After you build a flow and test it properly, you might want to deploy it as an endpoint so that you can invoke the endpoint for real-time inference.

In this article, you learn how to deploy a flow as a managed online endpoint for real-time inference. The steps you take are:

- Test your flow and get it ready for deployment
- Create an online deployment
- Grant permissions to the endpoint
- Test the endpoint
- Consume the endpoint

We use the sample flow **Web Classification** as example to show how to deploy the flow. This sample flow is a standard flow. Deploying chat flows is similar. Evaluation flow doesn't support deployment.

## Define the environment used by deployment

When you deploy prompt flow to managed online endpoint in UI, by default the deployment uses the environment created based on the latest prompt flow image and dependencies specified in the `requirements.txt` of the flow. You can specify extra packages you needed in `requirements.txt`. You can find `requirements.txt` in the root folder of your flow folder.

## Prerequisites

In order to make the chat playground to respond to your query, you must grant permissions to the endpoint entity after the prompt flow deployment is created. This is a subscription owner level action, so if needed, ask your subscription owner to do it for you. 

## Create an online deployment

Now that you have built a flow and tested it properly, it's time to create your online endpoint for real-time inference. 

The Prompt flow supports you to deploy endpoints from a flow, or a bulk test run. Testing your flow before deployment is recommended best practice.


### If you're using AI Studio UI:
1. Follow [the prompt flow instruction](https://github.com/Azure/azureai-insiders/blob/aistudio-preview/previews/aistudio/how-to/build_with_promptflow.md) to create a prompt flow.
1. Select **Deploy** on the flow editor.
1. Fill out the basic settings such as **Endpoint name**, **Deployment name** and **Content safety**.
1. If you're satisfied with the basic settings, then you can select **Deploy** and continue. However, if you want to add more customization such as **Authentication type** and **Identity type**, select **Advanced settings**. 
1. Select **Deploy** to start the deployment. You can check the deployment status in the **Deployments** tab. On the left pane, you'll see attributes related to the deployment, while the right-hand side shows the endpoint attributes. 
1. Once you're redirected to the deployment details page, **look for the endpoint name** in URL (`EndpointName.region.inference.ml.azure.com/score`). You need this for step 9 (enabling access to secrets).
1. Go to Project details page (`Projects` > `Details`).
1. Select the **YourResourceGroupName** link on the Details page.
1. Once you're redirected to the Azure Resource Group page, Select **Access control (IAM)** on the left navigation menu.
1. Select **Add role assignment**.
1. Select **Azure ML Data Scientist** and select **Next**.
1. Select **+ select members** and search for your endpoint name. Tip: use your project name as a search keyword to find the endpoint quickly. 
1. Select **Select**.
1. Select **Review + Assign**.
1. Return to AI Studio and go to the deployment details page (`Deployments` > `YourDeploymentName`).
1. Test the prompt flow deployment (`YourDeploymentName` > `Test`)


## Check the status of the endpoint

There will be notifications after you finish the deploy wizard. After the endpoint and deployment are created successfully, you can select **Deploy details** in the notification to endpoint detail page.

You can also directly go to the **Endpoints** page in the studio, and check the status of the endpoint you deployed.


## Test the endpoint with sample data

In the endpoint detail page, switch to the **Test** tab.

If you select **Allow sharing sample input data for testing purpose only** when you deploy the endpoint, you can see the input data values are already preloaded.

If there's no sample value, you'll need to input a URL.


### Test the endpoint deployed from a chat flow

For endpoints deployed from chat flow, you can test it in an immersive chat window.


The `chat_input` was set during development of the chat flow. You can input the `chat_input` message in the input box. The **Inputs** panel on the right side is for you to specify the values for other inputs besides the `chat_input`. Learn more about [how to develop a chat flow](./flow-develop.md#develop-a-chat-flow).

## Consume the endpoint

In the endpoint detail page, switch to the **Consume** tab. You can find the REST endpoint and key/token to consume your endpoint. There's also sample code for you to consume the endpoint in different languages.


## Clean up resources

If you aren't going use the endpoint after completing this tutorial, you should delete the endpoint.

> [!NOTE]
> The complete deletion might take up to 20 minutes.

## Next Steps

- Learn more about what you can do in [Azure AI Studio](../what-is-ai-studio.md)
- Get answers to frequently asked questions in the [Azure AI FAQ article](../faq.yml)
