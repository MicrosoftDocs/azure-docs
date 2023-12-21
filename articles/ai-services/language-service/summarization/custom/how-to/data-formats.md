---
title: Prepare data for custom summarization
titleSuffix: Azure AI services
description: Learn about how to select and prepare data, to be successful in creating custom summarization projects.
#services: cognitive-services
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: how-to
ms.date: 12/19/2023
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

 In the abstractive conversation summarization scenario, each conversation (whether it has a provided label or not) is expected to be provided in a .json file, which is similar to the input format for our [pre-built conversation summarization service](/rest/api/language/2023-04-01/analyze-conversation/submit-job?tabs=HTTP#textconversation).  The following is an example conversation of three turns between two speakers (Agent and Customer).

```json
{
  "conversationItems": [
    {
      "text": "Hello, how can I help you?",
      "modality": "text",
      "id": "1",
      "participantId": "Agent",
      "role": "Agent"
    },
    {
      "text": "How do I upgrade office? I have been getting error messages all day.",
      "modality": "text",
      "id": "2",
      "participantId": "Customer",
      "role": "Customer"
    },
    {
      "text": "Please press the upgrade button, then sign in and follow the instructions.",
      "modality": "text",
      "id": "3",
      "participantId": "Agent",
      "role": "Agent"
    }
  ],
  "modality": "text",
  "id": "conversation1",
  "language": "en"
}
```

## Sample mapping JSON format

In both document and conversation summarization scenarios, a set of documents and corresponding labels can be provided in a single JSON file that references individual document/conversation and summary files. 

The JSON file is expected to contain the following fields:

```json
{
    projectFileVersion": The version of the exported project,
    "stringIndexType": Specifies the method used to interpret string offsets. For additional information see https://aka.ms/text-analytics-offsets,
    "metadata": {
        "projectKind": The project kind you need to import. Values for summarization are CustomAbstractiveSummarization and CustomConversationSummarization. Both projectKind fields must be identical.,
        "storageInputContainerName": The name of the storage container that contains the documents/conversations and the summaries,
        "projectName": a string project name,
        "multilingual": A flag denoting whether this project should allow multilingual documents or not. For Summarization this option is turned off,
        "description": a string project description,
        "language": The default language of the project. Possible values are “en” and “en-us”
    },
    "assets": {
        "projectKind": The project kind you need to import. Values for summarization are CustomAbstractiveSummarization and CustomConversationSummarization. Both projectKind fields must be identical.,
        "documents": a list of document-label pairs, each is defined with three fields:[
            {
            "summaryLocation": a string path to the summary txt (for documents) or json (for conversations) file,
            "location": a string path to the document txt (for documents) or json (for conversations) file,
            "language": The language of the documents. Possible values are “en” and “en-us”
            }
            ]
    }
}
```
## Custom document summarization mapping sample

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

## Custom conversation summarization mapping sample

The following is an example mapping file for the abstractive conversation summarization scenario with three documents and corresponding labels.

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
                "summaryLocation": "conv1_summary.txt",
                "location": "conv1.json",
                "language": "en-us"
            },
            {
                "summaryLocation": "conv2_summary.txt",
                "location": "conv2.json",
                "language": "en-us"
            },
            {
                "summaryLocation": "conv3_summary.txt",
                "location": "conv3.json",
                "language": "en-us"
            }
            ]
    }
}
```

## Next steps

[Get started with custom summarization](../../custom/quickstart.md)
