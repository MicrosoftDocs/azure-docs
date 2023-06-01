---
title: Preparing data for custom summarization
titleSuffix: Azure Cognitive Services
description: Learn about how to select and prepare data, to be successful in creating custom summarization projects.
services: cognitive-services
author: jboback
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 06/01/2022
ms.author: jboback
---

## Format data for custom Summarization

This page contains information about how to select and prepare data in order to be successful in creating custom summarization projects.

> [!NOTE]
> Throughout this document, we refer to a summary of a document as a“label”.

### csum-document-sample-format

In the abstractive document summarization scenario, each document (whether it has a provided label or not) is expected to be provided in a plain .txt file. The file contains one or more lines. If multiple lines are provided, each is assumed to be a paragraph of the document. The following is an example document with five paragraphs.

    *At any given moment, turnaround coordinators for German airline Lufthansa CityLine have their eyes glued to monitors displaying more than half a dozen video feeds of airplanes parked at gates around the airport. The coordinators' job is to ensure that the planes are unloaded, refueled, cleaned, restocked and reloaded so that every passenger reaches their destination safely, on time and with their luggage.
    Minutes lost here or there in the turnaround process can add up, costing airlines millions of dollars per year. As many in the industry note, airplanes only make money while in the air.
    "Think of a pit stop in a car race, and this is pretty much the same that happens in a turnaround for an aircraft." said Phillipp Grindemann, head of business development and project management for Lufthansa CityLine. "All the processes need to be on time, need to be fast, need to be lean."
    Lufthansa CityLine is a subsidiary of Lufthansa, one of the world's major airline groups with a network that spans the globe. Lufthansa maintains hubs in Frankfurt and Munich, Germany. Lufthansa CityLine connects passengers with destinations around Europe to and from these hubs, flying more than 300 flights per day. On time arrivals and departures are essential for customer satisfaction and Lufthansa's bottom line.
    Outside of weather, delays stem from missteps during the tightly choreographed turnaround process. Like most industry players, Lufthansa CityLine relies on manual timestamps to understand when each step of the turnaround process starts and ends and uses that manual timestamp data to glean insights on where to make adjustments for faster, leaner turnarounds."*

### csum-conv-sample-format

In the abstractive conversation summarization scenario, each conversation (whether it has a provided label or not) is expected to be provided in a plain .txt file. Each conversation turn must be provided in a single line that is formatted as Speaker + “: “ + text (I.e., Speaker and text are separated by a colon followed by a space). The following is an example conversation of three turns between two speakers (Agent and Customer).

Agent: Hello, how can I help you?
Customer: How do I upgrade office? I have been getting error messages all day.
Agent: Please press the upgrade button, then sign in and follow the instructions.

### csum-doc-and-sample-mapping-json-format

In both document and conversation summarization scenarios, a set of documents and corresponding labels can be provided in a single JSON file that references individual document/conversation and summary files. The JSON file is expected to contain the following fields:

```json
projectFileVersion": TODO,
"stringIndexType": TODO,
"metadata": {
    "projectKind": TODO,
    "storageInputContainerName": TODO,
    "projectName": a string project name,
    "multilingual": TODO,
    "description": a string project description,
    "language": TODO:
},
"assets": {
    "projectKind": TODO,
    "documents": a list of document-label pairs, each is defined with three fields:
        [
        {
        "summaryLocation": a string path to the summary txt file,
        "location": a string path to the document txt file,
        "language": TODO
        }
        ]
}
```

The following is an example mapping file for the abstractive document summarization scenario with three documents and corresponding labels.

```json
{
    "projectFileVersion": "2022-10-01-preview",
    "stringIndexType": "Utf16CodeUnit",
    "metadata": {
        "projectKind": "CustomAbstractiveSummarization",
        "storageInputContainerName": "abstractivesummarization",
        "projectName": "sample_custom_summarization",
        "multilingual": false,
        "description": "Creating a custom summarization model",
        "language": "en-us"
    }
    "assets": {
        "projectKind": "CustomAbstractiveSummarization",
        "documents": [
            {
                "summaryLocation": "doc1_summary.txt",
                "location": "doc1.txt",
                "language": "en-us"
            },
            {
                "summaryLocation": "doc2_summary.txt",
                "location": "doc2.txt",
                "language": "en-us"
            },
            {
                "summaryLocation": "doc3_summary.txt",
                "location": "doc3.txt",
                "language": "en-us"
            }
            ]
    }
}
```

## Next steps

[!INCLUDE [Get started with custom summarization](../../custom/quickstart.md)]
