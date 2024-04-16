---
title: Deploy your custom text to speech avatar model as an endpoint - Speech service
titleSuffix: Azure AI services
description: Learn about how to deploy your custom text to speech avatar model as an endpoint. 
author: sally-baolian
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 4/15/2024
ms.author: v-baolianzou
---

# Deploy your custom text to speech avatar model as an endpoint

Once your custom text to speech avatar model is successfully trained through our manual process, you can self-deploy it to a custom avatar endpoint. You can create up to 10 endpoints with a standard (S0) Speech resource, each with its own custom avatar.

Here's how you can use your custom text to speech avatar:

- The avatar appears in the avatar list of text to speech avatar on [Speech Studio](https://speech.microsoft.com/portal/talkingavatar).
- The avatar appears in the avatar list of live chat avatar on [Speech Studio](https://speech.microsoft.com/portal/livechat).
- You can call the avatar from the API by specifying the avatar model name.

## Add a deployment endpoint

To create a custom avatar endpoint, follow these steps:

1. Sign in to [Speech Studio](https://speech.microsoft.com/portal/talkingavatar).
1. Navigate to **Custom avatar** > Your project name > **Train model**.
1. All available models are listed on the **Train model** page. Click on a model link to view more information, such as the created date and a preview image of the custom avatar.
1. Select a model that you would like to deploy, then click the **Deploy model** button above the list.
1. Confirm the deployment to create your endpoint.

Once your model is successfully deployed as an endpoint, you can click the endpoint link on the **Deploy model** page. There, you'll find a link to the text to speech avatar portal on Speech Studio, where you can try and create videos with your custom avatar using text input.

### Use your custom voice

If you have built a custom neural voice (CNV) and would like to use it together with the custom avatar, pay attention to the following points:

1. Ensure that the CNV endpoint is created in the same Speech resource as the custom avatar endpoint.
1. If the CNV model is deployed in the same region as the custom avatar, you can see the CNV voice selection in the voices list of the avatar content generation page and live chat voice settings.
1. If you're using the API to generate content, add the "customVoices" property to assign the deployment ID of the CNV model in the request batch synthesis properties. For more information, refer to the [Text to speech properties](batch-synthesis-avatar-properties.md#text-to-speech-properties).
1. If you're using real-time mode, refer to our sample code on [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/js/browser/avatar) to set the custom voice.

### Sample code of calling both CNV and custom avatar

If your custom neural voice endpoint is in a different Speech Service or service region from the custom avatar endpoint:

- Refer to [Deploy your professional voice model as an endpoint](../professional-voice-deploy-endpoint.md) to learn how to create a custom neural voice endpoint and check the region in the Application settings.
- If your trained CNV models and custom avatars are in different regions, refer to [Train your professional voice model](../professional-voice-train-voice.md#copy-your-voice-model-to-another-project) to copy the CNV model to another project and region.

## Remove a deployment endpoint

To remove a deployment endpoint, follow these steps:

1. Sign in to [Speech Studio](https://speech.microsoft.com/portal/talkingavatar).
1. Navigate to **Custom avatar** > Your project name > **Train model**.
1. All available models are listed on the **Train model** page. Click on a model link to view more information, such as the created date and a preview image of the custom avatar.
1. Select a model on the **Train model** page. If it's in "Succeeded" status, it means it's in hosting status. You can click the **Delete** button and confirm the deletion to remove the hosting.

## Next steps

- Learn more about custom text to speech avatar in the [overview](what-is-custom-text-to-speech-avatar.md).
