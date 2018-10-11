---
title: Troubleshoot the Cognitive Services Speech SDK
description: Troubleshoot the Cognitive Services Speech SDK.
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: wolfma61

ms.service: cognitive-services
ms.component: speech-service
ms.topic: article
ms.date: 05/07/2018
ms.author: wolfma
---
# Troubleshoot the Speech SDK

This article provides information to help you solve issues you might encounter when you use the Speech SDK.

## Error: WebSocket Upgrade failed with an authentication error (403)

You might have the wrong endpoint for your region or service. Check the URI to make sure it's correct. 

Also, there might be a problem with your subscription key or authorization token. For more information, see the next section.

## Error: HTTP 403 Forbidden or HTTP 401 Unauthorized

This error often is caused by authentication issues. Connection requests without a valid `Ocp-Apim-Subscription-Key` or `Authorization` header are rejected with a status of 403 or 401.

* If you're using a subscription key for authentication, you might see the error because:

    - The subscription key is missing or invalid
    - You have exceeded your subscription's usage quota

* If you're using an authorization token for authentication, you might see the error because:

    - The authorization token is invalid
    - The authorization token is expired

### Validate your subscription key

You can verify that you have a valid subscription key by running one of the following commands.

> [!NOTE]
> Replace `YOUR_SUBSCRIPTION_KEY` and `YOUR_REGION` with your own subscription key and associated region.

* PowerShell

    ```Powershell
    $FetchTokenHeader = @{
      'Content-type'='application/x-www-form-urlencoded'
      'Content-Length'= '0'
      'Ocp-Apim-Subscription-Key' = 'YOUR_SUBSCRIPTION_KEY'
    }
    $OAuthToken = Invoke-RestMethod -Method POST -Uri https://YOUR_REGION.api.cognitive.microsoft.com/sts/v1.0/issueToken -Headers $FetchTokenHeader
    $OAuthToken
    ```

* cURL

    ```
    curl -v -X POST "https://YOUR_REGION.api.cognitive.microsoft.com/sts/v1.0/issueToken" -H "Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY" -H "Content-type: application/x-www-form-urlencoded" -H "Content-Length: 0"
    ```

### Validate an authorization token

If you use an authorization token for authentication, run one of the following commands to verify that the authorization token is still valid. Tokens are valid for 10 minutes.

> [!NOTE]
> Replace `YOUR_AUDIO_FILE` with the path to your prerecorded audio file. Replace `YOUR_ACCESS_TOKEN` with the authorization token returned in the preceding step. Replace `YOUR_REGION` with the correct region.

* PowerShell

    ```Powershell
    $SpeechServiceURI =
    'https://YOUR_REGION.stt.speech.microsoft.com/speech/recognition/interactive/cognitiveservices/v1?language=en-US'
    
    # $OAuthToken is the authorization token returned by the token service.
    $RecoRequestHeader = @{
      'Authorization' = 'Bearer '+ $OAuthToken
      'Transfer-Encoding' = 'chunked'
      'Content-type' = 'audio/wav; codec=audio/pcm; samplerate=16000'
    }
    
    # Read audio into byte array.
    $audioBytes = [System.IO.File]::ReadAllBytes("YOUR_AUDIO_FILE")
    
    $RecoResponse = Invoke-RestMethod -Method POST -Uri $SpeechServiceURI -Headers $RecoRequestHeader -Body $audioBytes
    
    # Show the result.
    $RecoResponse
    ```

* cURL

    ```
    curl -v -X POST "https://YOUR_REGION.stt.speech.microsoft.com/speech/recognition/interactive/cognitiveservices/v1?language=en-US" -H "Authorization: Bearer YOUR_ACCESS_TOKEN" -H "Transfer-Encoding: chunked" -H "Content-type: audio/wav; codec=audio/pcm; samplerate=16000" --data-binary @YOUR_AUDIO_FILE
    ```

---

## Error: HTTP 400 Bad Request

This error usually occurs when the request body contains invalid audio data. Only WAV format is supported. Also, check the request's headers to make sure you specify appropriate values for `Content-Type` and `Content-Length`.

## Error: HTTP 408 Request Timeout

The error most likely occurs because no audio data is being sent to the service. This error also might be caused by network issues.

## "RecognitionStatus" in the response is "InitialSilenceTimeout"

This issue usually is caused by audio data. You might see this error because:

* There's a long stretch of silence at the beginning of the audio. In that case, the service stops the recognition after a few seconds and returns `InitialSilenceTimeout`.

* The audio uses an unsupported codec format, which causes the audio data to be treated as silence.

## Next steps

* [Review the release notes](releasenotes.md)

