---
title: "Quickstart: Get image insights using the Bing Visual Search REST API and Python"
titleSuffix: Azure Cognitive Services
description: Learn how to upload an image to the Bing Visual Search API and get insights about it.
services: cognitive-services
author: swhite-msft
manager: nitinme

ms.service: cognitive-services
ms.subservice: bing-visual-search
ms.topic: quickstart
ms.date: 5/16/2018
ms.author: scottwhi
---

# Quickstart: Your first Bing Visual Search query in Python

Use this quickstart to make your first call to the Bing Visual Search API and view the search results. This simple JavaScript application uploads an image to the API, and displays the information returned about it. While this application is written in JavaScript, the API is a RESTful Web service compatible with most programming languages.

When uploading a local image, the POST form data must include the Content-Disposition header. Its `name` parameter must be set to "image" and the `filename` parameter may be set to any string. The contents of the form is the binary of the image. The maximum image size you may upload is 1 MB.

```
--boundary_1234-abcd
Content-Disposition: form-data; name="image"; filename="myimagefile.jpg"

ÿØÿà JFIF ÖÆ68g-¤CWŸþ29ÌÄøÖ‘º«™æ±èuZiÀ)"óÓß°Î= ØJ9á+*G¦...

--boundary_1234-abcd--
```

## Prerequisites

* [Python 3.x](https://www.python.org/)


[!INCLUDE [cognitive-services-bing-visual-search-signup-requirements](../../../../includes/cognitive-services-bing-image-search-signup-requirements.md)]

## Initialize the application

1. Create a new Python file in your favorite IDE or editor, and add the following import statement.

    ```python
    import requests, json
    ```

2. Create variables for your subscription key, endpoint, and the path to the image you're uploading.

    ```python

    BASE_URI = 'https://api.cognitive.microsoft.com/bing/v7.0/images/visualsearch'
    SUBSCRIPTION_KEY = 'your-subscription-key'
    imagePath = 'your-image-path'
    ```

3. Create a dictionary object to hold your requests' header information. Bind your subscription key to the string `Ocp-Apim-Subscription-Key`, as shown below.

    ```python
    HEADERS = {'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY}
    ```

4. Create another dictionary to contain your image, which will be opened and uploaded when you send the request. 

    ```python
    file = {'image' : ('myfile', open(imagePath, 'rb'))}
    ```

## Parse the JSON response

1. Create a method called `print_json()` to take in the API response, and print the JSON.

    ```python
    def print_json(obj):
        """Print the object as json"""
        print(json.dumps(obj, sort_keys=True, indent=2, separators=(',', ': ')))
    ```

## Send the request

1. Use `requests.post()` to send a request to the Bing Visual Search API. Include the string for your endpoint, header, and file information. Print `response.json()` with `print_json()`

    ```python
    try:
        response = requests.post(BASE_URI, headers=HEADERS, files=file)
        response.raise_for_status()
        print_json(response.json())
    
    except Exception as ex:
        raise ex
    ```

## Next steps

> [!div class="nextstepaction"]
> [Build a Custom Search web app](../tutorial-bing-visual-search-single-page-app.md)
