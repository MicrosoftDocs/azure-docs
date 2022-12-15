---
title: "Quickstart: Document Translation REST API"
description: 'Document translation processing using the REST API'
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: include
ms.date: 12/08/2022
ms.author: lajanuar
recommendations: false
---

In this quickstart we'll, use the curl command line tool to make Document Translation REST API calls.

## Set up your environment

You'll need the following tools:

* curl command line tool installed.

> [!NOTE]
> The curl package is pre-installed on most Windows 10 and Windows 11 and most macOS and Linux distributions. You can check the curl package version with the following commands:
> Windows: `curl.exe -V`.
> macOS `curl -V`
> Linux: `curl --version`

  * [Windows](https://curl.haxx.se/windows/); type curl.exe -V to see which version of cURL is installed
  * [Mac or Linux](https://learn2torials.com/thread/how-to-install-curl-on-mac-or-linux-(ubuntu)-or-windows); type curl -V to see which version of cURL is installed

## Translate documents (POST Request)

A batch Document Translation request is submitted to your Translator service endpoint via a POST request. If successful, the POST method returns a `202 Accepted`  response code and the batch request is created by the service. The translated documents will be listed in your target container.

Before you run the cURL command, make the following changes to the [post request](#post-request):

1. Replace `{endpoint}` with the endpoint value from your Azure portal Form Recognizer instance.

1. Replace `{key}` with the key value from your Azure portal Form Recognizer instance.

### POST request

```cmd
  cmd /c curl "{endpoint}}/translator/text/batch/v1.0/batches" -i -X POST --header "Content-Type: application/json" --header "Ocp-Apim-Subscription-Key: {key}" --data "@document-translation.json"

```
