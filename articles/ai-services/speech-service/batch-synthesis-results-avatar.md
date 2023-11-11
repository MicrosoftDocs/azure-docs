---
title: Obtain batch synthesis result - Speech service
titleSuffix: Azure AI services
description: Learn how to obtain text to speech avatar batch synthesis result and delete the batch synthesis job history 
author: sally-baolian
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 11/15/2023
ms.author: v-baolianzou
ms.custom: cog-serv-seo-aug-2020
keywords: text to speech avatar batch synthesis
---

# Obtain batch synthesis results

Once you get a batch synthesis job with `status` of "Succeeded", you can download the video output results. Use the URL from the `outputs.result` property of the [get batch synthesis](get-batch-synthesis-avatar.md) response.

To get the batch synthesis results file, make an HTTP GET request using the URI as shown in the following example. Replace `YourOutputsResultUrl` with the URL from the `outputs.result` property of the `get batch synthesis` response. Replace `YourSpeechKey` with your Speech resource key.

```azurecli-interactive 
curl -v -X GET "YourOutputsResultUrl" -H "Ocp-Apim-Subscription-Key: YourSpeechKey" > output.mp4
```

To get the batch synthesis summary file, make an HTTP GET request using the URI as shown in the following example. Replace `YourOutputsResultUrl` with the URL from the `outputs.summary` property of the [get batch synthesis](get-batch-synthesis-avatar.md) response. Replace `YourSpeechKey` with your Speech resource key.

curl -v -X GET "YourOutputsSummaryUrl" -H "Ocp-Apim-Subscription-Key: YourSpeechKey" > summary.json

The summary file contains the synthesis results for each text input. Here's an example summary.json file:

```json
{
  "jobID":  "c48b4cf5-957f-4a0f-96af-a4e3e71bd6b6",
  "status":  "Succeeded",
  "results":  [
    {
      "texts":  [
        "<speak version='1.0' xml:lang='en-US'>\n\t\t\t\t<voice name='en-US-JennyNeural'>\n\t\t\t\t\tThe rainbow has seven colors.\n\t\t\t\t</voice>\n\t\t\t</speak>"
      ],
      "status":  "Succeeded",
      "billingDetails":  {
        "Neural":  "29",
        "TalkingAvatarDuration":  "2"
      },
      "videoFileName":  "c48b4cf5-957f-4a0f-96af-a4e3e71bd6b6/0001.mp4",
      "TalkingAvatarCharacter":  "lisa",
      "TalkingAvatarStyle":  "graceful-sitting"
    }
  ]
}
```

## Delete batch synthesis

After you have retrieved the audio output results and no longer need the batch synthesis job history, you can delete it. The Speech service retains each synthesis history for up to 31 days or the duration specified by the request's `timeToLive` property, whichever comes sooner. The date and time of automatic deletion, for synthesis jobs with a status of "Succeeded" or "Failed" is calculated as the sum of the `lastActionDateTime` and `timeToLive` properties.

To delete a batch synthesis job, make an HTTP DELETE request using the following URI format. Replace `YourSynthesisId` with your batch synthesis ID, `YourSpeechKey` with your Speech resource key, and `YourSpeechRegion` with your Speech resource region.

```azurecli-interactive
curl -v -X DELETE "https://YourSpeechRegion.customvoice.api.speech.microsoft.com/api/texttospeech/3.1-preview1/batchsynthesis/talkingavatar/YourSynthesisId" -H "Ocp-Apim-Subscription-Key: YourSpeechKey"
```

If the delete request is successful, the response headers will include `HTTP/1.1 204 No Content`.

## Next steps

* [Get started with text to speech avatar](get-started-avatar.md)
* [What is text to speech avatar](what-is-text-to-speech-avatar.md)
* [Introduction to batch synthesis](introduction-to-batch-synthesis-avatar.md)
* [Create batch synthesis](create-batch-synthesis-avatar.md)
* [Get batch synthesis](get-batch-synthesis-avatar.md)
* [Batch synthesis results](batch-synthesis-results-avatar.md)
* [What is custom text to speech avatar](what-is-custom-tts-avatar.md)
