---
title: Troubleshoot the Speech SDK - Speech service
titleSuffix: Azure AI services
description: This article provides information to help you solve issues you might encounter when you use the Speech SDK.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: troubleshooting
ms.date: 12/08/2022
ms.author: eur
---

# Troubleshoot the Speech SDK

This article provides information to help you solve issues you might encounter when you use the Speech SDK.

## Authentication failed

You might observe one of several authentication errors, depending on the programming environment, API, or SDK. Here are some example errors:
- Did you set the speech resource key and region values? 
- AuthenticationFailure
- HTTP 403 Forbidden or HTTP 401 Unauthorized. Connection requests without a valid `Ocp-Apim-Subscription-Key` or `Authorization` header are rejected with a status of 403 or 401.
- ValueError: cannot construct SpeechConfig with the given arguments (or a variation of this message). This error could be observed, for example, when you run one of the Speech SDK for Python quickstarts without setting environment variables. You might also see it when you set the environment variables to something invalid such as your key or region. 
- Exception with an error code: 0x5. This access denied error could be observed, for example, when you run one of the Speech SDK for C# quickstarts without setting environment variables.

For baseline authentication troubleshooting tips, see [validate your resource key](#validate-your-resource-key) and [validate an authorization token](#validate-an-authorization-token). For more information about confirming credentials, see [get the keys for your resource](../multi-service-resource.md?pivots=azportal#get-the-keys-for-your-resource).

### Validate your resource key

You can verify that you have a valid resource key by running one of the following commands.

> [!NOTE]
> Replace `YOUR_RESOURCE_KEY` and `YOUR_REGION` with your own resource key and associated region.

# [PowerShell](#tab/powershell)

```powershell
$FetchTokenHeader = @{
    'Content-type'='application/x-www-form-urlencoded'
    'Content-Length'= '0'
    'Ocp-Apim-Subscription-Key' = 'YOUR_RESOURCE_KEY'
}
$OAuthToken = Invoke-RestMethod -Method POST -Uri https://YOUR_REGION.api.cognitive.microsoft.com/sts/v1.0/issueToken -Headers $FetchTokenHeader
$OAuthToken
```

# [cURL](#tab/curl)

```
curl -v -X POST "https://YOUR_REGION.api.cognitive.microsoft.com/sts/v1.0/issueToken" -H "Ocp-Apim-Subscription-Key: YOUR_RESOURCE_KEY" -H "Content-type: application/x-www-form-urlencoded" -H "Content-Length: 0"
```

---

If you entered a valid resource key, the command returns an authorization token, otherwise an error is returned.

### Validate an authorization token

If you're using an authorization token for authentication, you might see an authentication error because:
- The authorization token is invalid
- The authorization token is expired

If you use an authorization token for authentication, run one of the following commands to verify that the authorization token is still valid. Tokens are valid for 10 minutes.

> [!NOTE]
> Replace `YOUR_AUDIO_FILE` with the path to your prerecorded audio file. Replace `YOUR_ACCESS_TOKEN` with the authorization token returned in the preceding step. Replace `YOUR_REGION` with the correct region.

# [PowerShell](#tab/powershell)

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

# [cURL](#tab/curl)

```
curl -v -X POST "https://YOUR_REGION.stt.speech.microsoft.com/speech/recognition/interactive/cognitiveservices/v1?language=en-US" -H "Authorization: Bearer YOUR_ACCESS_TOKEN" -H "Transfer-Encoding: chunked" -H "Content-type: audio/wav; codec=audio/pcm; samplerate=16000" --data-binary @YOUR_AUDIO_FILE
```

---

If you entered a valid authorization token, the command returns the transcription for your audio file, otherwise an error is returned.


## InitialSilenceTimeout via RecognitionStatus

This issue usually is observed with [single-shot recognition](./how-to-recognize-speech.md#single-shot-recognition) of a single utterance. For example, the error can be returned under the following circumstances:

* The audio begins with a long stretch of silence. In that case, the service stops the recognition after a few seconds and returns `InitialSilenceTimeout`.
* The audio uses an unsupported codec format, which causes the audio data to be treated as silence.

It's OK to have silence at the beginning of audio, but only when you use [continuous recognition](./how-to-recognize-speech.md#continuous-recognition).

## SPXERR_AUDIO_SYS_LIBRARY_NOT_FOUND

This can be returned, for example, when multiple versions of Python have been installed, or if you're not using a supported version of Python. You can try using a different python interpreter or uninstall all python versions and re-install the latest version of python and the Speech SDK.

## HTTP 400 Bad Request

This error usually occurs when the request body contains invalid audio data. Only WAV format is supported. Also, check the request's headers to make sure you specify appropriate values for `Content-Type` and `Content-Length`.

## HTTP 408 Request Timeout

The error most likely occurs because no audio data is being sent to the service. This error also might be caused by network issues.

## Next steps

* [Review the release notes](releasenotes.md)
