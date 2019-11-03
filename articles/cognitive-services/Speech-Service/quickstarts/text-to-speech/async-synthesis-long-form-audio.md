---
title: "Quickstart: Asynchronous synthesis for long-form audio (Preview) - Speech Service"
titleSuffix: Azure Cognitive Services
description: Use the Long Audio API to asynchronously convert text to speech, and retrieve the audio output from a URI provided by the service. This REST API is ideal for content providers that need to convert text files greater than 10,000 characters or 50 paragraphs into synthesized speech.
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 10/26/2019
ms.author: erhopf
---

# Quickstart: Asynchronous synthesis for long-form audio in Python (Preview)

In this quickstart, you'll use the Long Audio API to asynchronously convert text to speech, and retrieve the audio output from a URI provided by the service. This REST API is ideal for content providers that need to convert text files greater than 10,000 characters or 50 paragraphs into synthesized speech. For more information, see [Long Audio API](../../long-audio-api.md).

## Prerequisites

This quickstart requires:

* Python 2.7.x or 3.x.
* [Visual Studio](https://visualstudio.microsoft.com/downloads/), [Visual Studio Code](https://code.visualstudio.com/download), or your favorite text editor.
* An Azure subscription and a Speech service subscription key. [Create an account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account).

## Create a project and import required modules

Create a new Python project using your favorite IDE or editor. Then copy this code snippet into a file named `voice_synthesis_client.py`.

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

> [!NOTE]
> If you haven't used these modules you'll need to install them before running your program. To install these packages, run: `pip install requests`.

These modules are used to parse arguments, construct the HTTP request, and call the text-to-speech long audio REST API.

## Get a list of supported voices

This code gets a list of available voices that you can use to convert text-to-speech. Add this code  `voice_synthesis_client.py`:

```python
parser = argparse.ArgumentParser(description='Cris client tool to submit voice synthesis requests.')
parser.add_argument('--voices', action="store_true", default=False, help='print voice list')
parser.add_argument('-key', action="store", dest="key", required=True, help='the cris subscription key, like ff1eb62d06d34767bda0207acb1da7d7 ')
parser.add_argument('-region', action="store", dest="region", required=True, help='the region information, could be centralindia, canadacentral or uksouth')
args = parser.parse_args()
baseAddress = 'https://%s.cris.ai/api/texttospeech/v3.0-beta1/' % args.region

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

### Test your code

Let's test what you've done so far. Run this command, replacing `<your_key>` with your Speech subscription key, and `<region>` with the region where your Speech resource was created (for example: `eastus` or `westus`). This information is available in the **Overview** tab for your resource in the [Azure portal](https://aka.ms/azureportal).

```console
python voice_synthesis_client.py --voices -key <your_key> -region <Region>
```

You should get an output that looks like this:

```console
There are xx voices available:

Name: Microsoft Server Speech Text to Speech Voice (en-US, xxx), Description: xxx , Id: xxx, Locale: en-US, Gender: Male, PublicVoice: xxx, Created: 2019-07-22T09:38:14Z
Name: Microsoft Server Speech Text to Speech Voice (zh-CN, xxx), Description: xxx , Id: xxx, Locale: zh-CN, Gender: Female, PublicVoice: xxx, Created: 2019-08-26T04:55:39Z
```

## Convert text to speech

The next step is to prepare an input text file. It can be either plain text or SSML, but must be more than 10,000 character or 50 paragraphs. For a complete list of requirements, see [Long Audio API](../../long-audio-api.md).

After you've prepared the text file. The next step is to add code for speech synthesis to your project. Add this code to `voice_synthesis_client.py`:

> [!NOTE]
> By default, the audio output is set to riff-16khz-16bit-mono-pcm. For more information about supported audio outputs, see [Long Audio API](../../long-audio-api.md#audio-output-formats).

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
        location = response.headers['Operation-Location']
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

### Test your code

Let's try making a request to synthesize text using your input file as a source. You'll need to update a few things in the request below:

* Replace `<your_key>` with your Speech service subscription key. This information is available in the **Overview** tab for your resource in the [Azure portal](https://aka.ms/azureportal).
* Replace `<region>` with the region where your Speech resource was created (for example: `eastus` or `westus`). This information is available in the **Overview** tab for your resource in the [Azure portal](https://aka.ms/azureportal).
* Replace `<input>` with the path to the text file you're looking to convert from text-to-speech.
* Replace `<locale>` with the desired output locale. For more information, see [language support](../../language-support.md#neural-voices).
* Replace `<voice_guid>` with the desired voice for the audio output. Use one of the voices returned by [Get a list of supported voices](#get-a-list-of-supported-voices) or use the list of neural voices provided in [language support](../../language-support.md#neural-voices).

Convert text to speech with this command:

```console
python voice_synthesis_client.py --submit -key <your_key> -region <Region> -file <input> -locale <locale> -voiceId <voice_guid>
```

> [!NOTE]
> 'concatenateResult' is an optional parameter, if this parameter isn't provided, the output will be provided as multiple wave files, one for each line.

You should get an output that looks like this:

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

The result provided contains the input text and the audio output files generated by the service. These are downloaded as a zip.

## Remove previous requests

There is a limit of 2,000 requests for each subscription. As such, there will be times that you need to remove previously submitted requests before you can make new ones. If you don't remove existing requests, you'll receive an error when you exceed 2,000.

Add this code to `voice_synthesis_client.py`:

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

### Test your code

Run this command, replacing `<your_key>` with your Speech subscription key, and `<region>` with the region where your Speech resource was created (for example: `eastus` or `westus`). This information is available in the **Overview** tab for your resource in the [Azure portal](https://aka.ms/azureportal).

```console
python voice_synthesis_client.py – syntheses -key <your_key> -region <Region>
```

This will return a list of syntheses you've requested. You should get an output that looks like this:

```console
There are <number> synthesis requests submitted:
ID : xxx , Name : xxx, Status : Succeeded
ID : xxx , Name : xxx, Status : Running
ID : xxx , Name : xxx : Succeeded
```

Now let's use some of these values to remove/delete previously submitted requests. Run this command, replacing `<your_key>` with your Speech subscription key, and `<region>` with the region where your Speech resource was created (for example: `eastus` or `westus`). This information is available in the **Overview** tab for your resource in the [Azure portal](https://aka.ms/azureportal). The `<synthesis_id>` should be one of the values returned in the previous request.

> [!NOTE]
> Requests with a status of ‘Running’/'Waiting' cannot be removed or deleted.

```console
python voice_synthesis_client.py – delete -key <your_key> -region <Region> -synthesisId <synthesis_id>
```

You should get an output that looks like this:

```console
delete voice synthesis xxx
delete successful
```

## Get the full client

The complete `voice_synthesis_client.py` is available for download on [GitHub](https://github.com/Azure-Samples/Cognitive-Speech-TTS/blob/master/CustomVoice-API-Samples/Python/voiceclient.py).

## Next steps

> [!div class="nextstepaction"]
> [Learn more about the Long Audio API](../../long-audio-api.md)
