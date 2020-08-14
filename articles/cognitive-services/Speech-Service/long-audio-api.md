---
title: Long Audio API (Preview) - Speech service
titleSuffix: Azure Cognitive Services
description: Learn how the Long Audio API is designed for asynchronous synthesis of long-form text to speech.
services: cognitive-services
author: trevorbye
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 08/11/2020
ms.author: trbye
---

# Long Audio API (Preview)

The Long Audio API is designed for asynchronous synthesis of long-form text to speech (for example: audio books, news articles and documents). This API doesn't return synthesized audio in real-time, instead the expectation is that you will poll for the response(s) and consume the output(s) as they are made available from the service. Unlike the text to speech API that's used by the Speech SDK, the Long Audio API can create synthesized audio longer than 10 minutes, making it ideal for publishers and audio content platforms.

Additional benefits of the Long Audio API:

* Synthesized speech returned by the service uses the best neural voices.
* There's no need to deploy a voice endpoint as it synthesizes voices in none real-time batch mode.

> [!NOTE]
> The Long Audio API now supports both [Public Neural Voices](https://docs.microsoft.com/azure/cognitive-services/speech-service/language-support#neural-voices) and [Custom Neural Voices](https://docs.microsoft.com/azure/cognitive-services/speech-service/how-to-custom-voice#custom-neural-voices).

## Workflow

Typically, when using the Long Audio API, you'll submit a text file or files to be synthesized, poll for the status, then if the status is successful, you can download the audio output.

This diagram provides a high-level overview of the workflow.

![Long Audio API workflow diagram](media/long-audio-api/long-audio-api-workflow.png)

## Prepare content for synthesis

When preparing your text file, make sure it:

* Is either plain text (.txt) or SSML text (.txt)
* Is encoded as [UTF-8 with Byte Order Mark (BOM)](https://www.w3.org/International/questions/qa-utf8-bom.en#bom)
* Is a single file, not a zip
* Contains more than 400 characters for plain text or 400 [billable characters](https://docs.microsoft.com/azure/cognitive-services/speech-service/text-to-speech#pricing-note) for SSML text, and less than 10,000 paragraphs
  * For plain text, each paragraph is separated by hitting **Enter/Return** - View [plain text input example](https://github.com/Azure-Samples/Cognitive-Speech-TTS/blob/master/CustomVoice-API-Samples/Java/en-US.txt)
  * For SSML text, each SSML piece is considered a paragraph. SSML pieces shall be separated by different paragraphs - View [SSML text input example](https://github.com/Azure-Samples/Cognitive-Speech-TTS/blob/master/CustomVoice-API-Samples/Java/SSMLTextInputSample.txt)
> [!NOTE]
> For Chinese (Mainland), Chinese (Hong Kong SAR), Chinese (Taiwan), Japanese, and Korean, one word will be counted as two characters. 

## Python example

This section contains Python examples that show the basic usage of the Long Audio API. Create a new Python project using your favorite IDE or editor. Then copy this code snippet into a file named `voice_synthesis_client.py`.

```python
import argparse
import json
import ntpath
import urllib3
import requests
import time
from json import dumps, loads, JSONEncoder, JSONDecoder
import pickle

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
```

These libraries are used to parse arguments, construct the HTTP request, and call the text-to-speech long audio REST API.

### Get a list of supported voices

This code allows you to get a full list of voices for a specific region/endpoint that you can use. Add the code to `voice_synthesis_client.py`:

```python
parser = argparse.ArgumentParser(description='Text-to-speech client tool to submit voice synthesis requests.')
parser.add_argument('--voices', action="store_true", default=False, help='print voice list')
parser.add_argument('-key', action="store", dest="key", required=True, help='the speech subscription key, like fg1f763i01d94768bda32u7a******** ')
parser.add_argument('-region', action="store", dest="region", required=True, help='the region information, could be centralindia, canadacentral or uksouth')
args = parser.parse_args()
baseAddress = 'https://%s.customvoice.api.speech.microsoft.com/api/texttospeech/v3.0-beta1/' % args.region

def getVoices():
	response=requests.get(baseAddress+"voicesynthesis/voices", headers={"Ocp-Apim-Subscription-Key":args.key}, verify=False)
	voices = json.loads(response.text)
	return voices

if args.voices:
	voices = getVoices()
	print("There are %d voices available:" % len(voices))
	for voice in voices:
		print ("Name: %s, Description: %s, Id: %s, Locale: %s, Gender: %s, PublicVoice: %s, Created: %s" % (voice['name'], voice['description'], voice['id'], voice['locale'], voice['gender'], voice['isPublicVoice'], voice['created']))
```

Run the script using the command `python voice_synthesis_client.py --voices -key <your_key> -region <region>`, and replace the following values:

* Replace `<your_key>` with your Speech service subscription key. This information is available in the **Overview** tab for your resource in the [Azure portal](https://aka.ms/azureportal).
* Replace `<region>` with the region where your Speech resource was created (for example: `eastus` or `westus`). This information is available in the **Overview** tab for your resource in the [Azure portal](https://aka.ms/azureportal).

You'll see an output that looks like this:

```console
There are xx voices available:

Name: Microsoft Server Speech Text to Speech Voice (en-US, xxx), Description: xxx , Id: xxx, Locale: en-US, Gender: Male, PublicVoice: xxx, Created: 2019-07-22T09:38:14Z
Name: Microsoft Server Speech Text to Speech Voice (zh-CN, xxx), Description: xxx , Id: xxx, Locale: zh-CN, Gender: Female, PublicVoice: xxx, Created: 2019-08-26T04:55:39Z
```

If **PublicVoice** parameter is **True**, the voice is public neural voice. Otherwise, it's custom neural voice.

### Convert text to speech

Prepare an input text file, in either plain text or SSML text, then add the following code to `voice_synthesis_client.py`:

> [!NOTE]
> 'concatenateResult' is an optional parameter. If this parameter isn't set, the audio outputs will be generated per paragraph. You can also concatenate the audios into 1 output by setting the parameter. 
> By default, the audio output is set to riff-16khz-16bit-mono-pcm. For more information about supported audio outputs, see [Audio output formats](https://docs.microsoft.com/azure/cognitive-services/speech-service/long-audio-api#audio-output-formats).

```python
parser.add_argument('--submit', action="store_true", default=False, help='submit a synthesis request')
parser.add_argument('--concatenateResult', action="store_true", default=False, help='If concatenate result in a single wave file')
parser.add_argument('-file', action="store", dest="file", help='the input text script file path')
parser.add_argument('-voiceId', action="store", nargs='+', dest="voiceId", help='the id of the voice which used to synthesis')
parser.add_argument('-locale', action="store", dest="locale", help='the locale information like zh-CN/en-US')
parser.add_argument('-format', action="store", dest="format", default='riff-16khz-16bit-mono-pcm', help='the output audio format')

def submitSynthesis():
    modelList = args.voiceId
    data={'name': 'simple test', 'description': 'desc...', 'models': json.dumps(modelList), 'locale': args.locale, 'outputformat': args.format}
    if args.concatenateResult:
        properties={'ConcatenateResult': 'true'}
        data['properties'] = json.dumps(properties)
    if args.file is not None:
	    scriptfilename=ntpath.basename(args.file)
	    files = {'script': (scriptfilename, open(args.file, 'rb'), 'text/plain')}
    response = requests.post(baseAddress+"voicesynthesis", data, headers={"Ocp-Apim-Subscription-Key":args.key}, files=files, verify=False)
    if response.status_code == 202:
        location = response.headers['Location']
        id = location.split("/")[-1]
        print("Submit synthesis request successful")
        return id
    else:
        print("Submit synthesis request failed")
        print("response.status_code: %d" % response.status_code)
        print("response.text: %s" % response.text)
        return 0

def getSubmittedSynthesis(id):
    response=requests.get(baseAddress+"voicesynthesis/"+id, headers={"Ocp-Apim-Subscription-Key":args.key}, verify=False)
    synthesis = json.loads(response.text)
    return synthesis

if args.submit:
    id = submitSynthesis()
    if (id == 0):
        exit(1)

    while(1):
        print("\r\nChecking status")
        synthesis=getSubmittedSynthesis(id)
        if synthesis['status'] == "Succeeded":
            r = requests.get(synthesis['resultsUrl'])
            filename=id + ".zip"
            with open(filename, 'wb') as f:  
                f.write(r.content)
                print("Succeeded... Result file downloaded : " + filename)
            break
        elif synthesis['status'] == "Failed":
            print("Failed...")
            break
        elif synthesis['status'] == "Running":
            print("Running...")
        elif synthesis['status'] == "NotStarted":
            print("NotStarted...")
        time.sleep(10)
```

Run the script using the command `python voice_synthesis_client.py --submit -key <your_key> -region <region> -file <input> -locale <locale> -voiceId <voice_guid>`, and replace the following values:

* Replace `<your_key>` with your Speech service subscription key. This information is available in the **Overview** tab for your resource in the [Azure portal](https://aka.ms/azureportal).
* Replace `<region>` with the region where your Speech resource was created (for example: `eastus` or `westus`). This information is available in the **Overview** tab for your resource in the [Azure portal](https://aka.ms/azureportal).
* Replace `<input>` with the path to the text file you've prepared for text-to-speech.
* Replace `<locale>` with the desired output locale. For more information, see [language support](language-support.md#neural-voices).
* Replace `<voice_guid>` with the desired output voice. Use one of the voices returned by your previous call to the `/voicesynthesis/voices` endpoint.

You'll see an output that looks like this:

```console
Submit synthesis request successful

Checking status
NotStarted...

Checking status
Running...

Checking status
Running...

Checking status
Succeeded... Result file downloaded : xxxx.zip
```

The result contains the input text and the audio output files that are generated by the service. You can download these files in a zip.

> [!NOTE]
> If you have more than 1 input files, you will need to submit multiple requests. There are some limitations that needs to be aware. 
> * The client is allowed to submit up to **5** requests to server per second for each Azure subscription account. If it exceeds the limitation, client will get a 429 error code(too many requests). Please reduce the request amount per second
> * The server is allowed to run and queue up to **120** requests for each Azure subscription account. If it exceeds the limitation, server will return a 429 error code(too many requests). Please wait and avoid submitting new request until some requests are completed

### Remove previous requests

The service will keep up to **20,000** requests for each Azure subscription account. If your request amount exceeds this limitation, please remove previous requests before making new ones. If you don't remove existing requests, you'll receive an error notification.

Add the following code to `voice_synthesis_client.py`:

```python
parser.add_argument('--syntheses', action="store_true", default=False, help='print synthesis list')
parser.add_argument('--delete', action="store_true", default=False, help='delete a synthesis request')
parser.add_argument('-synthesisId', action="store", nargs='+', dest="synthesisId", help='the id of the voice synthesis which need to be deleted')

def getSubmittedSyntheses():
    response=requests.get(baseAddress+"voicesynthesis", headers={"Ocp-Apim-Subscription-Key":args.key}, verify=False)
    syntheses = json.loads(response.text)
    return syntheses

def deleteSynthesis(ids):
    for id in ids:
        print("delete voice synthesis %s " % id)
        response = requests.delete(baseAddress+"voicesynthesis/"+id, headers={"Ocp-Apim-Subscription-Key":args.key}, verify=False)
        if (response.status_code == 204):
            print("delete successful")
        else:
            print("delete failed, response.status_code: %d, response.text: %s " % (response.status_code, response.text))

if args.syntheses:
    synthese = getSubmittedSyntheses()
    print("There are %d synthesis requests submitted:" % len(synthese))
    for synthesis in synthese:
        print ("ID : %s , Name : %s, Status : %s " % (synthesis['id'], synthesis['name'], synthesis['status']))

if args.delete:
	deleteSynthesis(args.synthesisId)
```

Run `python voice_synthesis_client.py --syntheses -key <your_key> -region <region>` to get a list of synthesis requests that you've made. You'll see an output like this:

```console
There are <number> synthesis requests submitted:
ID : xxx , Name : xxx, Status : Succeeded
ID : xxx , Name : xxx, Status : Running
ID : xxx , Name : xxx : Succeeded
```

To delete a request, run `python voice_synthesis_client.py --delete -key <your_key> -region <Region> -synthesisId <synthesis_id>` and replace `<synthesis_id>` with a request ID value returned from the previous request.

> [!NOTE]
> Requests with a status of ‘Running’/'Waiting' cannot be removed or deleted.

The completed `voice_synthesis_client.py` is available on [GitHub](https://github.com/Azure-Samples/Cognitive-Speech-TTS/blob/master/CustomVoice-API-Samples/Python/voiceclient.py).

## HTTP status codes

The following table details the HTTP response codes and messages from the REST API.

| API | HTTP status code | Description | Solution |
|-----|------------------|-------------|----------|
| Create | 400 | The voice synthesis is not enabled in this region. | Change the speech subscription key with a supported region. |
|        | 400 | Only the **Standard** speech subscription for this region is valid. | Change the speech subscription key to the "Standard" pricing tier. |
|        | 400 | Exceed the 20,000 request limit for the Azure account. Please remove some requests before submitting new ones. | The server will keep up to 20,000 requests for each Azure account. Delete some requests before submitting new ones. |
|        | 400 | This model cannot be used in the voice synthesis : {modelID}. | Make sure the {modelID}'s state is correct. |
|        | 400 | The region for the request does not match the region for the model : {modelID}. | Make sure the {modelID}'s region match with the request's region. |
|        | 400 | The voice synthesis only supports the text file in the UTF-8 encoding with the byte-order marker. | Make sure the input files are in UTF-8 encoding with the byte-order marker. |
|        | 400 | Only valid SSML inputs are allowed in the voice synthesis request. | Make sure the input SSML expressions are correct. |
|        | 400 | The voice name {voiceName} is not found in the input file. | The input SSML voice name is not aligned with the model ID. |
|        | 400 | The number of paragraphs in the input file should be less than 10,000. | Make sure the number of paragraphs in the file is less than 10,000. |
|        | 400 | The input file should be more than 400 characters. | Make sure your input file exceeds 400 characters. |
|        | 404 | The model declared in the voice synthesis definition cannot be found : {modelID}. | Make sure the {modelID} is correct. |
|        | 429 | Exceed the active voice synthesis limit. Please wait until some requests finish. | The server is allowed to run and queue up to 120 requests for each Azure account. Please wait and avoid submitting new requests until some requests are completed. |
| All       | 429 | There are too many requests. | The client is allowed to submit up to 5 requests to server per second for each Azure account. Please reduce the request amount per second. |
| Delete    | 400 | The voice synthesis task is still in use. | You can only delete requests that is **Completed** or **Failed**. |
| GetByID   | 404 | The specified entity cannot be found. | Make sure the synthesis ID is correct. |

## Regions and endpoints

The Long audio API is available in multiple regions with unique endpoints.

| Region | Endpoint |
|--------|----------|
| Australia East | `https://australiaeast.customvoice.api.speech.microsoft.com` |
| Canada Central | `https://canadacentral.customvoice.api.speech.microsoft.com` |
| East US | `https://eastus.customvoice.api.speech.microsoft.com` |
| India Central | `https://centralindia.customvoice.api.speech.microsoft.com` |
| South Central US | `https://southcentralus.customvoice.api.speech.microsoft.com` |
| Southeast Asia | `https://southeastasia.customvoice.api.speech.microsoft.com` |
| UK South | `https://uksouth.customvoice.api.speech.microsoft.com` |
| West Europe | `https://westeurope.customvoice.api.speech.microsoft.com` |
| West US 2 | `https://westus2.customvoice.api.speech.microsoft.com` |

## Audio output formats

We support flexible audio output formats. You can generate audio outputs per paragraph or concatenate the audio outputs into a single output by setting the 'concatenateResult' parameter. The following audio output formats are supported by the Long Audio API:

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

## Sample code
Sample code for Long Audio API is available on GitHub.

* [Sample code: Python](https://github.com/Azure-Samples/Cognitive-Speech-TTS/tree/master/CustomVoice-API-Samples/Python)
* [Sample code: C#](https://github.com/Azure-Samples/Cognitive-Speech-TTS/tree/master/CustomVoice-API-Samples/CSharp)
* [Sample code: Java](https://github.com/Azure-Samples/Cognitive-Speech-TTS/blob/master/CustomVoice-API-Samples/Java/)
