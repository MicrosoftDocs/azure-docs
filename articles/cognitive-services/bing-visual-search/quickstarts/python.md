---
title: Python Quickstart for Bing Visual Search API | Microsoft Docs
titleSuffix: Bing Web Search APIs - Cognitive Services
description: Shows how to quickly get started using the Visual Search API to get insights about an image.
services: cognitive-services
author: swhite-msft
manager: rosh

ms.service: cognitive-services
ms.technology: bing-visual-search
ms.topic: article
ms.date: 4/19/2018
ms.author: scottwhi
---

# Your first Bing Visual Search query in Python

Bing Visual Search API lets you send a request to Bing to get insights about an image. To call the API, send an HTTP POST  request to https:\/\/api.cognitive.microsoft.com/bing/v7.0/images/visualsearch. The response contains JSON objects that you parse to get the insights.

This article includes a simple console application that sends a Bing Visual Search API request and displays the JSON search results. While this application is written in Python, the API is a RESTful Web service compatible with any programming language that can make HTTP requests and parse JSON. 

## Prerequisites

You need [Python 3](https://www.python.org/) to run this code.

For this quickstart, you may use a [free trial](https://azure.microsoft.com/try/cognitive-services/?api=bing-web-search-api) subscription key or a paid subscription key.

## Running the walkthrough

To run this application, follow these steps:

1. Create a new Python project in your favorite IDE or editor.
2. Create a file named visualsearch.py and add the code shown in this quickstart.
3. Replace the `SUBSCRIPTION_KEY` value with your subscription key.
3. Replace the `INSIGHTS_TOKEN` value with an insights token from an /images/search response.
4. Run the program.


```python
"""Bing Visual Search example"""

# Download and install Python at https://www.python.org/
# Run 'pip3 install requests' in a command console window
# Run 'python visualsearch.py` in the console window

import requests, json


BASE_URI = 'https://api.cognitive.microsoft.com/bing/v7.0/images/visualsearch'

INSIGHTS_TOKEN = "<YOUR-INSIGHTS-TOKEN-GOES-HERE>"

SUBSCRIPTION_KEY = '<YOUR-SUBSCRIPTION-KEY-GOES-HERE>'

BOUNDARY = 'boundary_ABC123DEF456'
START_BOUNDARY = '--' + BOUNDARY
END_BOUNDARY = '--' + BOUNDARY + '--'

HEADERS = {'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
'Content-Type' : 'multipart/form-data; boundary=' + BOUNDARY}

CRLF = '\r\n'
POST_BODY_HEADER = "Content-Disposition: form-data; name=\"knowledgeRequest\"" + CRLF + CRLF

requestBody = START_BOUNDARY + CRLF;
requestBody += POST_BODY_HEADER;
requestBody += "{\"imageInfo\":{\"imageInsightsToken\":\"" + INSIGHTS_TOKEN + "\"}}" + CRLF + CRLF;
requestBody += END_BOUNDARY + CRLF;


def main():
    
    try:
        response = requests.post(BASE_URI, headers=HEADERS, data=requestBody)
        response.raise_for_status()
        print_json(response.json())

    except Exception as ex:
        raise ex


def print_json(obj):
    """Print the object as json"""
    print(json.dumps(obj, sort_keys=True, indent=2, separators=(',', ': ')))



# Main execution
if __name__ == '__main__':
    main()
```

## Next steps

> [!div class="nextstepaction"]
> [Bing Visual Search single-page app tutorial](../tutorial-bing-visual-search-single-page-app.md)

## See also 

[Bing Visual Search overview](../overview.md)  
[Try it](https://aka.ms/bingvisualsearchtryforfree)  
[Get a free trial access key](https://azure.microsoft.com/try/cognitive-services/?api=bing-visual-search-api)  
[Bing Visual Search API reference](https://aka.ms/bingvisualsearchreferencedoc)
