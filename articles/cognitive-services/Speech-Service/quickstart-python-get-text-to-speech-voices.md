---
title: "Quickstart: List text-to-speech voices, Python - Speech Services"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you'll learn how to get the full list of standard and neural voices for a region/endpoint using Python. The list is returned as JSON, and voice availability varies by region.
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 07/05/2019
ms.author: erhopf
---

# Quickstart: Get the list of text-to-speech voices using Python

In this quickstart, you'll learn how to get the full list of standard and neural voices for a region/endpoint using Python. The list is returned as JSON, and voice availability varies by region. For a list of supported regions, see [regions](regions.md).

This quickstart requires an [Azure Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with a Speech Services resource. If you don't have an account, you can use the [free trial](get-started.md) to get a subscription key.

## Prerequisites

This quickstart requires:

* Python 2.7.x or 3.x
* [Visual Studio](https://visualstudio.microsoft.com/downloads/), [Visual Studio Code](https://code.visualstudio.com/download), or your favorite text editor
* An Azure subscription key for the Speech Services

## Create a project and import required modules

Create a new Python project using your favorite IDE or editor. Then copy this code snippet into your project in a file named `get-voices.py`.

```python
import requests
```

> [!NOTE]
> If you haven't used these modules you'll need to install them before running your program. To install these packages, run: `pip install requests`.

Requests is used for HTTP requests to the text-to-speech service.

## Set the subscription key and create a prompt for TTS

In the next few sections you'll create methods to handle authorization, call the text-to-speech API, and validate the response. Let's start by creating a class. This is where we'll put our methods for token exchange, and calling the text-to-speech API.

```python
class GetVoices(object):
    def __init__(self, subscription_key):
        self.subscription_key = subscription_key
        self.access_token = None
```

The `subscription_key` is your unique key from the Azure portal.

## Get an access token

This endpoint requires an access token for authentication. To get an access token, an exchange is required. This sample exchanges your Speech Services subscription key for an access token using the `issueToken` endpoint.

This sample assumes that your Speech Services subscription is in the West US region. If you're using a different region, update the value for `fetch_token_url`. For a full list, see [Regions](https://docs.microsoft.com/azure/cognitive-services/speech-service/regions#rest-apis).

Copy this code into the `GetVoices` class:

```python
def get_token(self):
    fetch_token_url = "https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken"
    headers = {
        'Ocp-Apim-Subscription-Key': self.subscription_key
    }
    response = requests.post(fetch_token_url, headers=headers)
    self.access_token = str(response.text)
```

> [!NOTE]
> For more information on authentication, see [Authenticate with an access token](https://docs.microsoft.com/azure/cognitive-services/authentication#authenticate-with-an-authentication-token).

## Make a request and save the response

Here you're going to build the request and save the list of returned voices. First, you need to set the `base_url` and `path`. This sample assumes you're using the West US endpoint. If your resource is registered to a different region, make sure you update the `base_url`. For more information, see [Speech Services regions](https://docs.microsoft.com/azure/cognitive-services/speech-service/regions#text-to-speech).

Next, add required headers for the request. Finally, you'll make a request to the service. If the request is successful, and a 200 status code is returned, the response is written to file.

Copy this code into the `GetVoices` class:

```python
def get_voices(self):
    base_url = 'https://westus.tts.speech.microsoft.com'
    path = '/cognitiveservices/voices/list'
    get_voices_url = base_url + path
    headers = {
        'Authorization': 'Bearer ' + self.access_token
    }
    response = requests.get(get_voices_url, headers=headers)
    if response.status_code == 200:
        with open('voices.json', 'wb') as voices:
            voices.write(response.content)
            print("\nStatus code: " + str(response.status_code) +
                  "\nvoices.json is ready to view.\n")
    else:
        print("\nStatus code: " + str(
            response.status_code) + "\nSomething went wrong. Check your subscription key and headers.\n")
```

## Put it all together

You're almost done. The last step is to instantiate your class and call your functions.

```python
if __name__ == "__main__":
    subscription_key = "YOUR_KEY_HERE"
    app = GetVoices(subscription_key)
    app.get_token()
    app.get_voices()
```

## Run the sample app

That's it, you're ready to run the sample. From the command line (or terminal session), navigate to your project directory and run:

```console
python get-voices.py
```

## Clean up resources

Make sure to remove any confidential information from your sample app's source code, like subscription keys.

## Next steps

> [!div class="nextstepaction"]
> [Explore Python samples on GitHub](https://github.com/Azure-Samples/Cognitive-Speech-TTS/tree/master/Samples-Http/Python)

## See also

* [Text-to-speech API reference](https://docs.microsoft.com/azure/cognitive-services/speech-service/rest-apis)
* [Creating custom voice fonts](how-to-customize-voice-font.md)
* [Record voice samples to create a custom voice](record-custom-voice-samples.md)
