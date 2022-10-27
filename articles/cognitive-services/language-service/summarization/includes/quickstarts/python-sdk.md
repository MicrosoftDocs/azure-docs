---
author: jboback
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 08/18/2022
ms.author: aahi
ms.custom: ignite-fall-2021
---

# [Document summarization](#tab/document-summarization)

[Reference documentation](/python/api/azure-ai-textanalytics/azure.ai.textanalytics?preserve-view=true&view=azure-python-preview) | [Additional samples](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/textanalytics/azure-ai-textanalytics/samples) | [Package (PyPi)](https://pypi.org/project/azure-ai-textanalytics/5.2.0b1/) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/textanalytics/azure-ai-textanalytics) 

# [Conversation summarization](#tab/conversation-summarization)

[Reference documentation](/python/api/overview/azure/ai-language-conversations-readme?preserve-view=true&view=azure-python-preview) | [Additional samples](https://github.com/Azure/azure-sdk-for-python/blob/azure-ai-language-conversations_1.1.0b2/sdk/cognitivelanguage/azure-ai-language-conversations/samples/README.md) | [Package (PyPi)](https://pypi.org/project/azure-ai-language-conversations/1.1.0b2/) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/azure-ai-language-conversations_1.1.0b2/sdk/cognitivelanguage/azure-ai-language-conversations) 

---

Use this quickstart to create a text summarization application with the client library for Python. In the following example, you will create a Python application that can summarize documents or text-based customer service conversations.

[!INCLUDE [Use Language Studio](../use-language-studio.md)]

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* [Python 3.x](https://www.python.org/)
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Language resource"  target="_blank">create a Language resource </a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`Free F0`) to try the service, and upgrade later to a paid tier for production.
* To use the Analyze feature, you will need a Language resource with the standard (S) pricing tier.

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=PYTHON&Pillar=Language&Product=Summarization&Page=quickstart&Section=Prerequisites" target="_target">I ran into an issue</a>

## Setting up

### Install the client library

After installing Python, you can install the client library with:

# [Document summarization](#tab/document-summarization)

```console
pip install azure-ai-textanalytics==5.2.0b4
```

# [Conversation summarization](#tab/conversation-summarization)

```console
pip install azure-ai-language-conversations==1.1.0b2
```

---

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=PYTHON&Pillar=Language&Product=Summarization&Page=quickstart&Section=Set-up-the-environment" target="_target">I ran into an issue</a>


## Code example

Create a new Python file and copy the below code. Remember to replace the `key` variable with the key for your resource, and replace the `endpoint` variable with the endpoint for your resource. 

[!INCLUDE [find the key and endpoint for a resource](../../../includes/find-azure-resource-info.md)]

# [Document summarization](#tab/document-summarization)

```python
key = "paste-your-key-here"
endpoint = "paste-your-endpoint-here"

from azure.ai.textanalytics import TextAnalyticsClient
from azure.core.credentials import AzureKeyCredential

# Authenticate the client using your key and endpoint 
def authenticate_client():
    ta_credential = AzureKeyCredential(key)
    text_analytics_client = TextAnalyticsClient(
            endpoint=endpoint, 
            credential=ta_credential)
    return text_analytics_client

client = authenticate_client()

# Example method for summarizing text
def sample_extractive_summarization(client):
    from azure.core.credentials import AzureKeyCredential
    from azure.ai.textanalytics import (
        TextAnalyticsClient,
        ExtractSummaryAction
    ) 

    document = [
        "The extractive summarization feature uses natural language processing techniques to locate key sentences in an unstructured text document. "
        "These sentences collectively convey the main idea of the document. This feature is provided as an API for developers. " 
        "They can use it to build intelligent solutions based on the relevant information extracted to support various use cases. "
        "In the public preview, extractive summarization supports several languages. It is based on pretrained multilingual transformer models, part of our quest for holistic representations. "
        "It draws its strength from transfer learning across monolingual and harness the shared nature of languages to produce models of improved quality and efficiency. "
    ]

    poller = client.begin_analyze_actions(
        document,
        actions=[
            ExtractSummaryAction(max_sentence_count=4)
        ],
    )

    document_results = poller.result()
    for result in document_results:
        extract_summary_result = result[0]  # first document, first result
        if extract_summary_result.is_error:
            print("...Is an error with code '{}' and message '{}'".format(
                extract_summary_result.code, extract_summary_result.message
            ))
        else:
            print("Summary extracted: \n{}".format(
                " ".join([sentence.text for sentence in extract_summary_result.sentences]))
            )

sample_extractive_summarization(client)
```

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=PYTHON&Pillar=Language&Product=Summarization&Page=quickstart&Section=Code-example" target="_target">I ran into an issue</a>

### Output

```console
Summary extracted: 
The extractive summarization feature uses natural language processing techniques to locate key sentences in an unstructured text document. This feature is provided as an API for developers. They can use it to build intelligent solutions based on the relevant information extracted to support various use cases.
```

# [Conversation summarization](#tab/conversation-summarization)

```python

key = "paste-your-key-here"
endpoint = "paste-your-endpoint-here"

import os
from azure.core.credentials import AzureKeyCredential
from azure.ai.language.conversations import ConversationAnalysisClient

client = ConversationAnalysisClient(endpoint, AzureKeyCredential(key))
with client:
    poller = client.begin_conversation_analysis(
        task={
            "displayName": "Analyze conversations from xxx",
            "analysisInput": {
                "conversations": [
                    {
                        "conversationItems": [
                            {
                                "text": "Hello, you’re chatting with Rene. How may I help you?",
                                "id": "1",
                                "role": "Agent",
                                "participantId": "Agent_1"
                            },
                            {
                                "text": "Hi, I tried to set up wifi connection for Smart Brew 300 coffee machine, but it didn’t work.",
                                "id": "2",
                                "role": "Customer",
                                "participantId": "Customer_1"
                            },
                            {
                                "text": "I’m sorry to hear that. Let’s see what we can do to fix this issue. Could you please try the following steps for me? First, could you push the wifi connection button, hold for 3 seconds, then let me know if the power light is slowly blinking on and off every second?",
                                "id": "3",
                                "role": "Agent",
                                "participantId": "Agent_1"
                            },
                            {
                                "text": "Yes, I pushed the wifi connection button, and now the power light is slowly blinking.",
                                "id": "4",
                                "role": "Customer",
                                "participantId": "Customer_1"
                            },
                            {
                                "text": "Great. Thank you! Now, please check in your Contoso Coffee app. Does it prompt to ask you to connect with the machine?",
                                "id": "5",
                                "role": "Agent",
                                "participantId": "Agent_1"
                            },
                            {
                                "text": "No. Nothing happened.",
                                "id": "6",
                                "role": "Customer",
                                "participantId": "Customer_1"
                            },
                            {
                                "text": "I’m very sorry to hear that. Let me see if there’s another way to fix the issue. Please hold on for a minute.",
                                "id": "7",
                                "role": "Agent",
                                "participantId": "Agent_1"
                            }
                        ],
                        "modality": "text",
                        "id": "conversation1",
                        "language": "en"
                    },
                ]
            },
            "tasks": [
                {
                    "taskName": "analyze 1",
                    "kind": "ConversationalSummarizationTask",
                    "parameters": {
                        "summaryAspects": ["Issue, Resolution"]
                    }
                }
            ]
        }
    )

    # view result
    result = poller.result()
    task_result = result["tasks"]["items"][0]
    print("... view task status ...")
    print("status: {}".format(task_result["status"]))
    resolution_result = task_result["results"]
    if resolution_result["errors"]:
        print("... errors occured ...")
        for error in resolution_result["errors"]:
            print(error)
    else:
        conversation_result = resolution_result["conversations"][0]
        if conversation_result["warnings"]:
            print("... view warnings ...")
            for warning in conversation_result["warnings"]:
                print(warning)
        else:
            summaries = conversation_result["summaries"]
            print("... view task result ...")
            print("issue: {}".format(summaries[0]["text"]))
            print("resolution: {}".format(summaries[1]["text"]))

```

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=PYTHON&Pillar=Language&Product=Summarization&Page=quickstart&Section=Code-example" target="_target">I ran into an issue</a>

### Output

```console
... view task status ...
status: succeeded
... view task result ...
issue: Customer tried to set up wifi connection for Smart Brew 300 coffee machine, but it didn't work
resolution: Asked customer to try the following steps | Asked customer for the power light | Helped customer to connect to the machine
```

---