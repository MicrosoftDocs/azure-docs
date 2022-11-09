---
title: Troubleshoot the Speech SDK - Speech service
titleSuffix: Azure Cognitive Services
description: This article provides information to help you solve issues you might encounter when you use the Speech SDK.
services: cognitive-services
author: jhakulin
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 07/23/2019
ms.author: jhakulin
---

# Troubleshoot the Speech SDK

This article provides information to help you solve issues you might encounter when you use the Speech SDK.

## Error: WebSocket Upgrade failed with an authentication error (403)

You might have the wrong endpoint for your region or service. Check the URI to make sure it's correct.

Also, there might be a problem with your Speech resource key or authorization token. For more information, see the next section.

## Error: HTTP 403 Forbidden or HTTP 401 Unauthorized

This error often is caused by authentication issues. Connection requests without a valid `Ocp-Apim-Subscription-Key` or `Authorization` header are rejected with a status of 403 or 401.

* If you're using a resource key for authentication, you might see the error because:

    - The key is missing or invalid
    - You have exceeded your resource's usage quota

* If you're using an authorization token for authentication, you might see the error because:

    - The authorization token is invalid
    - The authorization token is expired

### Validate your resource key

You can verify that you have a valid resource key by running one of the following commands.

> [!NOTE]
> Replace `YOUR_RESOURCE_KEY` and `YOUR_REGION` with your own resource key and associated region.

* PowerShell

    ```powershell
    $FetchTokenHeader = @{
      'Content-type'='application/x-www-form-urlencoded'
      'Content-Length'= '0'
      'Ocp-Apim-Subscription-Key' = 'YOUR_RESOURCE_KEY'
    }
    $OAuthToken = Invoke-RestMethod -Method POST -Uri https://YOUR_REGION.api.cognitive.microsoft.com/sts/v1.0/issueToken -Headers $FetchTokenHeader
    $OAuthToken
    ```

* cURL

    ```
    curl -v -X POST "https://YOUR_REGION.api.cognitive.microsoft.com/sts/v1.0/issueToken" -H "Ocp-Apim-Subscription-Key: YOUR_RESOURCE_KEY" -H "Content-type: application/x-www-form-urlencoded" -H "Content-Length: 0"
    ```

If you entered a valid resource key, the command returns an authorization token, otherwise an error is returned.

### Validate an authorization token

If you use an authorization token for authentication, run one of the following commands to verify that the authorization token is still valid. Tokens are valid for 10 minutes.

> [!NOTE]
> Replace `YOUR_AUDIO_FILE` with the path to your prerecorded audio file. Replace `YOUR_ACCESS_TOKEN` with the authorization token returned in the preceding step. Replace `YOUR_REGION` with the correct region.

* PowerShell

    ```powershell
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

If you entered a valid authorization token, the command returns the transcription for your audio file, otherwise an error is returned.

---

## Error: HTTP 400 Bad Request

This error usually occurs when the request body contains invalid audio data. Only WAV format is supported. Also, check the request's headers to make sure you specify appropriate values for `Content-Type` and `Content-Length`.

## Error: HTTP 408 Request Timeout

The error most likely occurs because no audio data is being sent to the service. This error also might be caused by network issues.

## "RecognitionStatus" in the response is "InitialSilenceTimeout"

This issue usually is caused by audio data. You might see this error because:

* There's a long stretch of silence at the beginning of the audio. In that case, the service stops the recognition after a few seconds and returns `InitialSilenceTimeout`.

* The audio uses an unsupported codec format, which causes the audio data to be treated as silence.

## Connection closed or timeout

There is a known issue on Windows 11 that might affect some types of Secure Sockets Layer (SSL) and Transport Layer Security (TLS) connections. These connections might have handshake failures. For developers, the affected connections are likely to send multiple frames followed by a partial frame with a size of less than 5 bytes within a single input buffer. If the connection fails, your app will receive the error such as, "USP error", "Connection closed", "ServiceTimeout", or "SEC_E_ILLEGAL_MESSAGE".

There is an out of band update available for Windows 11 that fixes these issues. The update may be manually installed by following the instructions here:
- [Windows 11 21H2](https://support.microsoft.com/topic/october-17-2022-kb5020387-os-build-22000-1100-out-of-band-5e723873-2769-4e3d-8882-5cb044455a92)
- [Windows 11 22H2](https://support.microsoft.com/topic/october-25-2022-kb5018496-os-build-22621-755-preview-64040bea-1e02-4b6d-bad1-b036200c2cb3)

The issue started October 12th, 2022 and should be resolved via Windows update in November, 2022.

## Next steps

* [Review the release notes](releasenotes.md)
