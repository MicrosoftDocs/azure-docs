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

You must deploy the custom avatar to an endpoint before you can use it. Once your custom text to speech avatar model is successfully trained through our manual process, we will notify you. Then you can deploy it to a custom avatar endpoint. You can create up to 10 custom avatar endpoints for each standard (S0) Speech resource.

After you deploy your custom avatar, it's available to use in Speech Studio or through API:

- The avatar appears in the avatar list of text to speech avatar on [Speech Studio](https://speech.microsoft.com/portal/talkingavatar).
- The avatar appears in the avatar list of live chat avatar on [Speech Studio](https://speech.microsoft.com/portal/livechat).
- You can call the avatar from the API by specifying the avatar model name.

## Add a deployment endpoint

To create a custom avatar endpoint, follow these steps:

1. Sign in to [Speech Studio](https://speech.microsoft.com/portal).
1. Navigate to **Custom Avatar** > Your project name > **Train model**.
1. All available models are listed on the **Train model** page. Select a model link to view more information, such as the created date and a preview image of the custom avatar.
1. Select a model that you would like to deploy, then select the **Deploy model** button above the list.
1. Confirm the deployment to create your endpoint.

Once your model is successfully deployed as an endpoint, you can select the endpoint link on the **Deploy model** page. There, you'll find a link to the text to speech avatar portal on Speech Studio, where you can try and create videos with your custom avatar using text input.

## Remove a deployment endpoint

To remove a deployment endpoint, follow these steps:

1. Sign in to [Speech Studio](https://speech.microsoft.com/portal).
1. Navigate to **Custom Avatar** > Your project name > **Train model**.
1. All available models are listed on the **Train model** page. Select a model link to view more information, such as the created date and a preview image of the custom avatar.
1. Select a model on the **Train model** page. If it's in "Succeeded" status, it means it's in hosting status. You can select the **Delete** button and confirm the deletion to remove the hosting.

## Use your custom neural voice

If you're also creating a custom neural voice for the actor, the avatar can be highly realistic. For more information, see [What is custom text to speech avatar](./what-is-custom-text-to-speech-avatar.md).

[Custom neural voice](../custom-neural-voice.md) and [custom text to speech avatar](what-is-custom-text-to-speech-avatar.md) are separate features. You can use them independently or together. 

If you've built a custom neural voice (CNV) and would like to use it together with the custom avatar, pay attention to the following points:

- Ensure that the CNV endpoint is created in the same Speech resource as the custom avatar endpoint. You can see the CNV voice option in the voices list of the [avatar content generation page](https://speech.microsoft.com/portal/talkingavatar) and [live chat voice settings](https://speech.microsoft.com/portal/livechat).
- If you're using the batch synthesis for avatar API, add the "customVoices" property to associate the deployment ID of the CNV model with the voice name in the request. For more information, refer to the [Text to speech properties](batch-synthesis-avatar-properties.md#text-to-speech-properties).
- If you're using real-time synthesis for avatar API, refer to our sample code on [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/samples/js/browser/avatar) to set the custom neural voice.
- If your custom neural voice endpoint is in a different Speech resource from the custom avatar endpoint, refer to [Train your professional voice model](../professional-voice-train-voice.md#copy-your-voice-model-to-another-project) to copy the CNV model to the same Speech resource as the custom avatar endpoint. 

## Next steps

- Learn more about custom text to speech avatar in the [overview](what-is-custom-text-to-speech-avatar.md).
