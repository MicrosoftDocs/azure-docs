---
title: Text Analytics for health language support
titleSuffix: Azure AI services
description: "This article explains which natural languages are supported by the Text Analytics for health."
#services: cognitive-services
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: conceptual
ms.date: 12/19/2023
ms.author: jboback
ms.custom: language-service-health, ignite-fall-2021
---

# Language support for Text Analytics for health

Use this article to learn which natural languages are supported by Text Analytics for health and its Docker container.  

## Hosted API Service

The hosted API service supports the English, Spanish, French, German, Italian, and Portuguese languages.

When structuring the API request, the relevant language tags must be added for these languages: 

```
English – “en”
Spanish – “es”
French  - “fr”
German – “de”
Italian – “it”
Portuguese – “pt”
```
```json
json

{
    "analysisInput": {
        "documents": [
            {
                "text": "El médico prescrió 200 mg de ibuprofeno.",
                "language": "es",
                "id": "1"
            }
        ]
    },
    "tasks": [
        {
            "taskName": "analyze 1",
            "kind": "Healthcare",
            "parameters":
            {
            "modelVersion": "2022-08-15-preview"
            }
        }
    ]
}
```

## Docker container

The docker container supports the English, Spanish, French, German, Italian, Portuguese and Hebrew languages.
Full details for deploying the service in a container can be found [here](../text-analytics-for-health/how-to/use-containers.md).

In order to download the new container images from the Microsoft public container registry, use the following [docker pull](https://docs.docker.com/engine/reference/commandline/pull/) command.

For English, Spanish, Italian, French, German and Portuguese:

```
docker pull mcr.microsoft.com/azure-cognitive-services/textanalytics/healthcare:latin
```

For Hebrew:

```
docker pull mcr.microsoft.com/azure-cognitive-services/textanalytics/healthcare:semitic
```


When structuring the API request, the relevant language tags must be added for these languages: 

```
English – “en”
Spanish – “es”
French  - “fr”
German – “de”
Italian – “it”
Portuguese – “pt”
Hebrew – “he”
```

The following json is an example of a JSON file attached to the Language request's POST body, for a Spanish document:

```json
json

{
    "analysisInput": {
        "documents": [
            {
                "text": "El médico prescrió 200 mg de ibuprofeno.",
                "language": "es",
                "id": "1"
            }
        ]
    },
    "tasks": [
        {
            "taskName": "analyze 1",
            "kind": "Healthcare",
        }
    ]
}
```



## See also

[Text Analytics for health overview](overview.md)
