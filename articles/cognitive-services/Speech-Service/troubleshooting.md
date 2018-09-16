---
title: Cognitive Services Speech SDK Troubleshooting
description: Trouble Shooting Cognitive Services Speech SDK
titleSuffix: "Microsoft Cognitive Services"
services: cognitive-services
author: wolfma61

ms.service: cognitive-services
ms.component: speech-service
ms.topic: article
ms.date: 05/07/2018
ms.author: wolfma
---
# Troubleshooting Speech Services SDK

This article provides information to help you solve issues you might encounter when using the Speech SDK.

## Error `WebSocket Upgrade failed with an authentication error (403).`

You may have the wrong endpoint for your region or service. Double-check the URI to make sure it is correct. Also see the next section, as this could also be a problem with your subscription key or authorization token.

## Error `HTTP 403 Forbidden` or Error `HTTP 401 Unauthorized`

This error is often caused by authentication issues. Connection requests without a valid `Ocp-Apim-Subscription-Key` or `Authorization` header are rejected with status 401 or 403.

* If you are using a subscription key for authentication, the cause could be:

    - the subscription key is missing or invalid
    - you have exceeded your subscription's usage quota

* If you are using an authorization token for authentication, the cause could be:

    - the authorization token is invalid
    - the authorization token is expired

### Validate your subscription key

You can verify to make sure you have a valid subscription key by running one of the commands below.

> [!NOTE]
> Replace `YOUR_SUBSCRIPTION_KEY` and `YOUR_REGION` with your own subscription key and associated region, respectively.

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
> Replace `YOUR_AUDIO_FILE` with the path to your prerecorded audio file, `YOUR_ACCESS_TOKEN` with the authorization token returned in the previous step,
> and `YOUR_REGION` with the correct region.

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
    
    # Read audio into byte array
    $audioBytes = [System.IO.File]::ReadAllBytes("YOUR_AUDIO_FILE")
    
    $RecoResponse = Invoke-RestMethod -Method POST -Uri $SpeechServiceURI -Headers $RecoRequestHeader -Body $audioBytes
    
    # Show the result
    $RecoResponse
    ```

* cURL

    ```
    curl -v -X POST "https://YOUR_REGION.stt.speech.microsoft.com/speech/recognition/interactive/cognitiveservices/v1?language=en-US" -H "Authorization: Bearer YOUR_ACCESS_TOKEN" -H "Transfer-Encoding: chunked" -H "Content-type: audio/wav; codec=audio/pcm; samplerate=16000" --data-binary @YOUR_AUDIO_FILE
    ```

---

## Error `HTTP 400 Bad Request`

This error usually occurs when the request body contains invalid audio data. Only `WAV` format is supported. Also check the request's headers to make sure you are specifying an appropriate `Content-Type` and `Content-Length`.

## Error `HTTP 408 Request Timeout`

The error is most likely because no audio data is being sent to the service. This error could also be caused by network issues.

## The `RecognitionStatus` in the response is `InitialSilenceTimeout`

Audio data is usually the reason causing the issue. For example:

* There is a long stretch of silence at the beginning of the audio. The service will stop the recognition after a few seconds and return `InitialSilenceTimeout`.
* The audio uses an unsupported codec format, which causes the audio data to be treated as silence.

## Next steps

* [Release notes](releasenotes.md)

