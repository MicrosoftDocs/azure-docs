---
title: Prepare data for custom summarization
titleSuffix: Azure AI services
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

# Format data for custom Summarization

This page contains information about how to select and prepare data in order to be successful in creating custom summarization projects.

> [!NOTE]
> Throughout this document, we refer to a summary of a document as a “label”.

## Custom summarization document sample format

In the abstractive document summarization scenario, each document (whether it has a provided label or not) is expected to be provided in a plain .txt file. The file contains one or more lines. If multiple lines are provided, each is assumed to be a paragraph of the document. The following is an example document with three paragraphs.

*At Microsoft, we have been on a quest to advance AI beyond existing techniques, by taking a more holistic, human-centric approach to learning and understanding. As Chief Technology Officer of Azure AI services, I have been working with a team of amazing scientists and engineers to turn this quest into a reality.*

*In my role, I enjoy a unique perspective in viewing the relationship among three attributes of human cognition: monolingual text (X), audio or visual sensory signals, (Y) and multilingual (Z). At the intersection of all three, there’s magic—what we call XYZ-code as illustrated in Figure 1—a joint representation to create more powerful AI that can speak, hear, see, and understand humans better. We believe XYZ-code will enable us to fulfill our long-term vision: cross-domain transfer learning, spanning modalities and languages.*

*The goal is to have pre-trained models that can jointly learn representations to support a broad range of downstream AI tasks, much in the way humans do today. Over the past five years, we have achieved human performance on benchmarks in conversational speech recognition, machine translation, conversational question answering, machine reading comprehension, and image captioning. These five breakthroughs provided us with strong signals toward our more ambitious aspiration to produce a leap in AI capabilities, achieving multi-sensory and multilingual learning that is closer in line with how humans learn and understand. I believe the joint XYZ-code is a foundational component of this aspiration, if grounded with external knowledge sources in the downstream AI tasks.*

## Custom summarization conversation sample format

In the abstractive conversation summarization scenario, each conversation (whether it has a provided label or not) is expected to be provided in a plain .txt file. Each conversation turn must be provided in a single line that is formatted as Speaker + “: “ + text (I.e., Speaker and text are separated by a colon followed by a space). The following is an example conversation of three turns between two speakers (Agent and Customer).

Agent: Hello, how can I help you?

Customer: How do I upgrade office? I have been getting error messages all day.

Agent: Please press the upgrade button, then sign in and follow the instructions.


## Custom summarization document and sample mapping JSON format

In both document and conversation summarization scenarios, a set of documents and corresponding labels can be provided in a single JSON file that references individual document/conversation and summary files. 

<!--- The JSON file is expected to contain the following fields:

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
``` --->

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

[Get started with custom summarization](../../custom/quickstart.md)
