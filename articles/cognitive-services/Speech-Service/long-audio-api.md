---
title: Long Audio API - Speech service
titleSuffix: Azure Cognitive Services
description: Learn how the Long Audio API is designed for asynchronous synthesis of long-form text to speech.
services: cognitive-services
author: nitinme
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 08/11/2020
ms.author: nitinme
---

# Long Audio API

The Long Audio API provides asynchronous synthesis of long-form text to speech (for example: audio books, news articles and documents). This API doesn't return synthesized audio in real time. Instead, you poll for the response(s) and consume the output(s) as the service makes them available. Unlike the Text-to-speech API used by the Speech SDK, the Long Audio API can create synthesized audio longer than 10 minutes. This makes it ideal for publishers and audio content platforms to create long audio content like audio books in a batch.

More benefits of the Long Audio API:

* Synthesized speech returned by the service uses the best neural voices.
* There's no need to deploy a voice endpoint.

> [!NOTE]
> The Long Audio API supports both [Public Neural Voices](./language-support.md#neural-voices) and [Custom Neural Voices](./how-to-custom-voice.md).

## Workflow

When using the Long Audio API, you'll typically submit a text file or files to be synthesized, poll for the status, and download the audio output when the status indicates success.

This diagram provides a high-level overview of the workflow.

![Long Audio API workflow diagram](media/long-audio-api/long-audio-api-workflow.png)

## Prepare content for synthesis

When preparing your text file, make sure it:

* Is either plain text (.txt) or SSML text (.txt).
* Is encoded as [UTF-8 with Byte Order Mark (BOM)](https://www.w3.org/International/questions/qa-utf8-bom.en#bom).
* Is a single file, not a zip.
* Contains more than 400 characters for plain text or 400 [billable characters](./text-to-speech.md#pricing-note) for SSML text, and less than 10,000 paragraphs.
  * For plain text, each paragraph is separated by hitting **Enter/Return**. See [plain text input example](https://github.com/Azure-Samples/Cognitive-Speech-TTS/blob/master/CustomVoice-API-Samples/Java/en-US.txt).
  * For SSML text, each SSML piece is considered a paragraph. Separate SSML pieces by different paragraphs. See [SSML text input example](https://github.com/Azure-Samples/Cognitive-Speech-TTS/blob/master/CustomVoice-API-Samples/Java/SSMLTextInputSample.txt).

## Sample code

The rest of this page focuses on Python, but sample code for the Long Audio API is available on GitHub for the following programming languages:

* [Sample code: Python](https://github.com/Azure-Samples/Cognitive-Speech-TTS/tree/master/CustomVoice-API-Samples/Python)
* [Sample code: C#](https://github.com/Azure-Samples/Cognitive-Speech-TTS/tree/master/CustomVoice-API-Samples/CSharp)
* [Sample code: Java](https://github.com/Azure-Samples/Cognitive-Speech-TTS/blob/master/CustomVoice-API-Samples/Java/)

## Python example

This section contains Python examples that show the basic usage of the Long Audio API. Create a new Python project using your favorite IDE or editor. Then copy this code snippet into a file named `long_audio_synthesis_client.py`.

```python
import json
import ntpath
import requests
```

These libraries are used to construct the HTTP request, and call the text-to-speech long audio synthesis REST API.

### Get a list of supported voices

To get a list of supported voices, send a GET request to `https://<endpoint>/api/texttospeech/v3.0/longaudiosynthesis/voices`.

This code gets a full list of voices you can use at a specific region/endpoint.

```python
def get_voices():
    region = '<region>'
    key = '<your_key>'
    url = 'https://{}.customvoice.api.speech.microsoft.com/api/texttospeech/v3.0/longaudiosynthesis/voices'.format(region)
    header = {
        'Ocp-Apim-Subscription-Key': key
    }

    response = requests.get(url, headers=header)
    print(response.text)

get_voices()
```

Replace the following values:

* Replace `<your_key>` with your Speech service subscription key. This information is available in the **Overview** tab for your resource in the [Azure portal](https://aka.ms/azureportal).
* Replace `<region>` with the region where your Speech resource was created (for example: `eastus` or `westus`). This information is available in the **Overview** tab for your resource in the [Azure portal](https://aka.ms/azureportal).

You'll see output that looks like this:

```json
{
  "values": [
    {
      "locale": "en-US",
      "voiceName": "en-US-AriaNeural",
      "description": "",
      "gender": "Female",
      "createdDateTime": "2020-05-21T05:57:39.123Z",
      "properties": {
        "publicAvailable": true
      }
    },
    {
      "id": "8fafd8cd-5f95-4a27-a0ce-59260f873141"
      "locale": "en-US",
      "voiceName": "my custom neural voice",
      "description": "",
      "gender": "Male",
      "createdDateTime": "2020-05-21T05:25:40.243Z",
      "properties": {
        "publicAvailable": false
      }
    }
  ]
}
```

If **properties.publicAvailable** is **true**, the voice is a public neural voice. Otherwise, it's a custom neural voice.

### Convert text to speech

Prepare an input text file, in either plain text or SSML text, then add the following code to `long_audio_synthesis_client.py`:

> [!NOTE]
> `concatenateResult` is an optional parameter. If this parameter isn't set, the audio outputs will be generated per paragraph. You can also concatenate the audios into one output by including the parameter. 
> `outputFormat` is also optional. By default, the audio output is set to `riff-16khz-16bit-mono-pcm`. For more information about supported audio output formats, see [Audio output formats](#audio-output-formats).

```python
def submit_synthesis():
    region = '<region>'
    key = '<your_key>'
    input_file_path = '<input_file_path>'
    locale = '<locale>'
    url = 'https://{}.customvoice.api.speech.microsoft.com/api/texttospeech/v3.0/longaudiosynthesis'.format(region)
    header = {
        'Ocp-Apim-Subscription-Key': key
    }

    voice_identities = [
        {
            'voicename': '<voice_name>'
        }
    ]

    payload = {
        'displayname': 'long audio synthesis sample',
        'description': 'sample description',
        'locale': locale,
        'voices': json.dumps(voice_identities),
        'outputformat': 'riff-16khz-16bit-mono-pcm',
        'concatenateresult': True,
    }

    filename = ntpath.basename(input_file_path)
    files = {
        'script': (filename, open(input_file_path, 'rb'), 'text/plain')
    }

    response = requests.post(url, payload, headers=header, files=files)
    print('response.status_code: %d' % response.status_code)
    print(response.headers['Location'])

submit_synthesis()
```

Replace the following values:

* Replace `<your_key>` with your Speech service subscription key. This information is available in the **Overview** tab for your resource in the [Azure portal](https://aka.ms/azureportal).
* Replace `<region>` with the region where your Speech resource was created (for example: `eastus` or `westus`). This information is available in the **Overview** tab for your resource in the [Azure portal](https://aka.ms/azureportal).
* Replace `<input_file_path>` with the path to the text file you've prepared for text-to-speech.
* Replace `<locale>` with the desired output locale. For more information, see [language support](language-support.md#neural-voices).

Use one of the voices returned by your previous call to the `/voices` endpoint.

* If you are using public neural voice, replace `<voice_name>` with the desired output voice.
* To use a custom neural voice, replace `voice_identities` variable with following, and replace `<voice_id>` with the `id` of your custom neural voice.
```Python
voice_identities = [
    {
        'id': '<voice_id>'
    }
]
```

You'll see output that looks like this:

```console
response.status_code: 202
https://<endpoint>/api/texttospeech/v3.0/longaudiosynthesis/<guid>
```

> [!NOTE]
> If you have more than one input file, you will need to submit multiple requests, and there are limitations to consider.
> * The client can submit up to **5** requests per second for each Azure subscription account. If it exceeds the limitation, a **429 error code (too many requests)** is returned. Reduce the rate of submissions to avoid this limit.
> * The server can queue up to **120** requests for each Azure subscription account. If the queue exceeds this limitation, server will return **429 error code(too many requests)**. Wait for completed requests before submitting additional requests.

You can use the URL in output to get the request status.

### Get details about a submitted request

To get status of a submitted synthesis request, send a GET request to the URL returned in previous step.

```Python

def get_synthesis():
    url = '<url>'
    key = '<your_key>'
    header = {
        'Ocp-Apim-Subscription-Key': key
    }
    response = requests.get(url, headers=header)
    print(response.text)

get_synthesis()
```

Output will be like this:

```json
response.status_code: 200
{
  "models": [
    {
      "voiceName": "en-US-AriaNeural"
    }
  ],
  "properties": {
    "outputFormat": "riff-16khz-16bit-mono-pcm",
    "concatenateResult": false,
    "totalDuration": "PT5M57.252S",
    "billableCharacterCount": 3048
  },
  "id": "eb3d7a81-ee3e-4e9a-b725-713383e71677",
  "lastActionDateTime": "2021-01-14T11:12:27.240Z",
  "status": "Succeeded",
  "createdDateTime": "2021-01-14T11:11:02.557Z",
  "locale": "en-US",
  "displayName": "long audio synthesis sample",
  "description": "sample description"
}
```

The `status` property changes from `NotStarted` status, to `Running`, and finally to `Succeeded` or `Failed`. You can poll this API in a loop until the status becomes `Succeeded` or `Failed`.

### Download audio result

Once a synthesis request succeeds, you can download the audio result by calling the GET `/files` API.

```python
def get_files():
    id = '<request_id>'
    region = '<region>'
    key = '<your_key>'
    url = 'https://{}.customvoice.api.speech.microsoft.com/api/texttospeech/v3.0/longaudiosynthesis/{}/files'.format(region, id)
    header = {
        'Ocp-Apim-Subscription-Key': key
    }

    response = requests.get(url, headers=header)
    print('response.status_code: %d' % response.status_code)
    print(response.text)

get_files()
```

Replace `<request_id>` with the ID of request you want to download the result. It can be found in the response of previous step.

Output will be like this:

```json
response.status_code: 200
{
  "values": [
    {
      "name": "2779f2aa-4e21-4d13-8afb-6b3104d6661a.txt",
      "kind": "LongAudioSynthesisScript",
      "properties": {
        "size": 4200
      },
      "createdDateTime": "2021-01-14T11:11:02.410Z",
      "links": {
        "contentUrl": "https://customvoice-usw.blob.core.windows.net/artifacts/input.txt?st=2018-02-09T18%3A07%3A00Z&se=2018-02-10T18%3A07%3A00Z&sp=rl&sv=2017-04-17&sr=b&sig=e05d8d56-9675-448b-820c-4318ae64c8d5"
      }
    },
    {
      "name": "voicesynthesis_waves.zip",
      "kind": "LongAudioSynthesisResult",
      "properties": {
        "size": 9290000
      },
      "createdDateTime": "2021-01-14T11:12:27.226Z",
      "links": {
        "contentUrl": "https://customvoice-usw.blob.core.windows.net/artifacts/voicesynthesis_waves.zip?st=2018-02-09T18%3A07%3A00Z&se=2018-02-10T18%3A07%3A00Z&sp=rl&sv=2017-04-17&sr=b&sig=e05d8d56-9675-448b-820c-4318ae64c8d5"
      }
    }
  ]
}
```
This example output contains information for two files. The one with `"kind": "LongAudioSynthesisScript"` is the input script submitted. The other one with `"kind": "LongAudioSynthesisResult"` is the result of this request.

The result is zip that contains the audio output files generated, along with a copy of the input text.

Both files can be downloaded from the URL in their `links.contentUrl` property.

### Get all synthesis requests

The following code lists all submitted requests:

```python
def get_synthesis():
    region = '<region>'
    key = '<your_key>'
    url = 'https://{}.customvoice.api.speech.microsoft.com/api/texttospeech/v3.0/longaudiosynthesis/'.format(region)    
    header = {
        'Ocp-Apim-Subscription-Key': key
    }

    response = requests.get(url, headers=header)
    print('response.status_code: %d' % response.status_code)
    print(response.text)

get_synthesis()
```

Output will be like:

```json
response.status_code: 200
{
  "values": [
    {
      "models": [
        {
          "id": "8fafd8cd-5f95-4a27-a0ce-59260f873141",
          "voiceName": "my custom neural voice"
        }
      ],
      "properties": {
        "outputFormat": "riff-16khz-16bit-mono-pcm",
        "concatenateResult": false,
        "totalDuration": "PT1S",
        "billableCharacterCount": 5
      },
      "id": "f9f0bb74-dfa5-423d-95e7-58a5e1479315",
      "lastActionDateTime": "2021-01-05T07:25:42.433Z",
      "status": "Succeeded",
      "createdDateTime": "2021-01-05T07:25:13.600Z",
      "locale": "en-US",
      "displayName": "Long Audio Synthesis",
      "description": "Long audio synthesis sample"
    },
    {
      "models": [
        {
          "voiceName": "en-US-AriaNeural"
        }
      ],
      "properties": {
        "outputFormat": "riff-16khz-16bit-mono-pcm",
        "concatenateResult": false,
        "totalDuration": "PT5M57.252S",
        "billableCharacterCount": 3048
      },
      "id": "eb3d7a81-ee3e-4e9a-b725-713383e71677",
      "lastActionDateTime": "2021-01-14T11:12:27.240Z",
      "status": "Succeeded",
      "createdDateTime": "2021-01-14T11:11:02.557Z",
      "locale": "en-US",
      "displayName": "long audio synthesis sample",
      "description": "sample description"
    }
  ]
}
```

The `values` property lists your synthesis requests. The list is paginated, with a maximum page size of 100. If there are more than 100 requests, a `"@nextLink"` property is provided to get the next page of the paginated list.

```console
  "@nextLink": "https://<endpoint>/api/texttospeech/v3.0/longaudiosynthesis/?top=100&skip=100"
```

You can also customize page size and skip number by providing `skip` and `top` in URL parameter.

### Remove previous requests

The service will keep up to **20,000** requests for each Azure subscription account. If your request amount exceeds this limitation, remove previous requests before making new ones. If you don't remove existing requests, you'll receive an error notification.

The following code shows how to remove a specific synthesis request.

```python
def delete_synthesis():
    id = '<request_id>'
    region = '<region>'
    key = '<your_key>'
    url = 'https://{}.customvoice.api.speech.microsoft.com/api/texttospeech/v3.0/longaudiosynthesis/{}/'.format(region, id)
    header = {
        'Ocp-Apim-Subscription-Key': key
    }

    response = requests.delete(url, headers=header)
    print('response.status_code: %d' % response.status_code)
```

If the request is successfully removed, the response status code will be HTTP 204 (No Content).

```console
response.status_code: 204
```

> [!NOTE]
> Requests with a status of `NotStarted` or `Running` cannot be removed or deleted.

The completed `long_audio_synthesis_client.py` is available on [GitHub](https://github.com/Azure-Samples/Cognitive-Speech-TTS/blob/master/CustomVoice-API-Samples/Python/voiceclient.py).

## HTTP status codes

The following table details the HTTP response codes and messages from the REST API.

| API | HTTP status code | Description | Solution |
|-----|------------------|-------------|----------|
| Create | 400 | The voice synthesis is not enabled in this region. | Change the speech subscription key with a supported region. |
|        | 400 | Only the **Standard** speech subscription for this region is valid. | Change the speech subscription key to the "Standard" pricing tier. |
|        | 400 | Exceed the 20,000 request limit for the Azure account. Remove some requests before submitting new ones. | The server will keep up to 20,000 requests for each Azure account. Delete some requests before submitting new ones. |
|        | 400 | This model cannot be used in the voice synthesis: {modelID}. | Make sure the {modelID}'s state is correct. |
|        | 400 | The region for the request does not match the region for the model: {modelID}. | Make sure the {modelID}'s region match with the request's region. |
|        | 400 | The voice synthesis only supports the text file in the UTF-8 encoding with the byte-order marker. | Make sure the input files are in UTF-8 encoding with the byte-order marker. |
|        | 400 | Only valid SSML inputs are allowed in the voice synthesis request. | Make sure the input SSML expressions are correct. |
|        | 400 | The voice name {voiceName} is not found in the input file. | The input SSML voice name is not aligned with the model ID. |
|        | 400 | The number of paragraphs in the input file should be less than 10,000. | Make sure the number of paragraphs in the file is less than 10,000. |
|        | 400 | The input file should be more than 400 characters. | Make sure your input file exceeds 400 characters. |
|        | 404 | The model declared in the voice synthesis definition cannot be found: {modelID}. | Make sure the {modelID} is correct. |
|        | 429 | Exceed the active voice synthesis limit. Wait until some requests finish. | The server is allowed to run and queue up to 120 requests for each Azure account. Wait and avoid submitting new requests until some requests are completed. |
| All       | 429 | There are too many requests. | The client is allowed to submit up to 5 requests to server per second for each Azure account. Reduce the request amount per second. |
| Delete    | 400 | The voice synthesis task is still in use. | You can only delete requests that are **Completed** or **Failed**. |
| GetByID   | 404 | The specified entity cannot be found. | Make sure the synthesis ID is correct. |

## Regions and endpoints

The Long audio API is available in multiple regions with unique endpoints.

| Region | Endpoint |
|--------|----------|
| East US | `https://eastus.customvoice.api.speech.microsoft.com` |
| India Central | `https://centralindia.customvoice.api.speech.microsoft.com` |
| Southeast Asia | `https://southeastasia.customvoice.api.speech.microsoft.com` |
| UK South | `https://uksouth.customvoice.api.speech.microsoft.com` |
| West Europe | `https://westeurope.customvoice.api.speech.microsoft.com` |

## Audio output formats

We support flexible audio output formats. You can generate audio outputs per paragraph or concatenate the audio outputs into a single output by setting the `concatenateResult` parameter. The following audio output formats are supported by the Long Audio API:

> [!NOTE]
> The default audio format is riff-16khz-16bit-mono-pcm.

* riff-8khz-16bit-mono-pcm
* riff-16khz-16bit-mono-pcm
* riff-24khz-16bit-mono-pcm
* riff-48khz-16bit-mono-pcm
* audio-16khz-32kbitrate-mono-mp3
* audio-16khz-64kbitrate-mono-mp3
* audio-16khz-128kbitrate-mono-mp3
* audio-24khz-48kbitrate-mono-mp3
* audio-24khz-96kbitrate-mono-mp3
* audio-24khz-160kbitrate-mono-mp3
