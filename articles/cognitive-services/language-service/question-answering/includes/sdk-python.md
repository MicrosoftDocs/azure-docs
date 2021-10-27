---
title: "Quickstart: Question answering client library for Python"
description: This quickstart shows how to get started with the question answring client library for Python.
ms.topic: include
ms.date: 11/02/2021
---

Use the question answering client library for Python to:

* Get an answer from a knowledgebase.
* Get an answer from a body of text that you send along with your question.

[API reference documentation][questionanswering_refdocs] | [Source code][questionanswering_client_src] | [Package (PyPI)][questionanswering_pypi_package] | [Python Samples][questionanswering_samples] |

[questionanswering_client_class]: https://azuresdkdocs.blob.core.windows.net/$web/python/azure-ai-language-questionanswering/1.0.0b1/azure.ai.language.questionanswering.html#azure.ai.language.questionanswering.QuestionAnsweringClient
[questionanswering_client_src]: https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/cognitivelanguage/azure-ai-language-questionanswering/
[questionanswering_pypi_package]: https://pypi.org/project/azure-ai-language-questionanswering/
[questionanswering_refdocs]: https://azuresdkdocs.blob.core.windows.net/$web/python/azure-ai-language-questionanswering/1.0.0b1/azure.ai.language.questionanswering.html
[questionanswering_samples]: https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/cognitivelanguage/azure-ai-language-questionanswering/samples/README.md

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* [Python 3.x](https://www.python.org/)
* Question answering, requires a [Language resource](https://ms.portal.azure.com/?quickstart=true#create/Microsoft.CognitiveServicesTextAnalytics) with the custom question answering feature enabled to generate an API key and endpoint.
	* After your Language resource deploys, select **Go to resource**. You will need the key and endpoint from the resource you create to connect your application. Paste your key and endpoint into the code below later in the quickstart.
* An existing knowledge base to query. If you have not setup a knowledge base you can follow the instructions in the **Laguage Studio** tab. Or add a knowledge base that uses this [Surface User Guide URL](https://download.microsoft.com/download/7/B/1/7B10C82E-F520-4080-8516-5CF0D803EEE0/surface-book-user-guide-EN.pdf) as a data source.

## Setting up

### Install the client library

After installing Python, you can install the client library with:

```console
pip install azure-ai-language-questionanswering
```

## Query a knowledge base

### Generate an answer from the knowledge base

The example below will allow you to query a knowledge base and get an answer.

You will need to update the code bloew and provide your own values for the following variables.

|Variable name | Value |
|--------------------------|-------------|
| `endpoint`               | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy knowledge base** > **Get prediction URL**. An example endpoint is: `https://southcentralus.api.cognitive.microsoft.com/`|
| `credential` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either Key1 or Key2. Always having two valid keys always for secure key rotation with zero downtime. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy knowledge base** > **Get prediction URL**. The key value is part of the sample request.|
| `knowledge_base_project` | The name of your question answering project.|
| `deployment`             | There are two possible values: `test`, and `production`. `production` is dependent on you having deployed your knowledge base from **Language Studio** > **question answering** > **Deploy knowledge base**.|

```python
from azure.core.credentials import AzureKeyCredential
from azure.ai.language.questionanswering import QuestionAnsweringClient
from azure.ai.language.questionanswering import models as qna

endpoint = "https://{YOUR-ENDPOINT}.api.cognitive.microsoft.com/"
credential = AzureKeyCredential("{YOUR-LANGUAGE-RESOURCE-KEY}")
knowledge_base_project = "{YOUR-PROJECT-NAME}"
deployment = "production"

def main():
    client = QuestionAnsweringClient(endpoint, credential)
    with client:
        input = qna.QueryKnowledgeBaseOptions(
            question="How much battery life do I have left?"
        )
        output = client.query_knowledge_base(
            input,
            project_name=knowledge_base_project,
            deployment_name=deployment
        )
    print("Q: {}".format(input.question))
    print("A: {}".format(output.answers[0].answer))

if __name__ == '__main__':
    main()
```

While we are hard coding the variables for our example. For production, consider using a secure way of storing and accessing your credentials. For example, [Azure key vault](../../../../key-vault/general/overview.md) provides secure key storage.

When you run the query above if you are using the data source from the prerequisites you will get an answer that looks as follows:

```
Q: How much battery life do I have left?
A: If you want to see how much battery you have left, go to **Start  **> **Settings  **> **Devices  **> **Bluetooth & other devices  **, then find your pen. The current battery level will appear under the battery icon.
```

For information on how confident question answering is that this is the correct response add an additional print statement underneath the existing print statements:

```python
print("Q: {}".format(input.question))
print("A: {}".format(output.answers[0].answer))
print("Confidence Score: {}".format(output.answers[0].confidence_score)) # add this line 
```

You will now receive a result with a confidence score:

```
Q: How much battery life do I have left?
A: If you want to see how much battery you have left, go to **Start  **> **Settings  **> **Devices  **> **Bluetooth & other devices  **, then find your pen. The current battery level will appear under the battery icon.
Confidence Score: 0.9185
```

The confidence score returns a value between 0 and 1. You can think of this like a percentage and multiple by 100 so a confidence score of 0.9185 means question answering is 91.85% confident this is the correct answer to the question based on the knowledge base.

If you want to exclude answers where the confidence score falls below a certain threshold you can modify the [QueryKnowledgeBaseOptions](https://github.com/Azure/azure-sdk-for-python/blob/ebce185ca34e0e3d76d466aaba8a9a3160b38e92/sdk/cognitivelanguage/azure-ai-language-questionanswering/azure/ai/language/questionanswering/operations/_operations.py#L145) to add the `confidence_score_threshold` parameter.

```python
with client:
        input = qna.QueryKnowledgeBaseOptions(
            question="How much battery life do I have left?", # add the ,
            confidence_score_threshold=0.95 # add this line
        )
```

Since we know from our previous execution of the code that our confidence score is .`.9185` settings the threshold to `.95` will result in the [default answer](../how-to/change-default-answer.md) being returned.

```
Q: How much battery life do I have left?
A: No good match found in KB
Confidence Score: 0.0
```

## 


<!-- TODO: Replace Link
This is a simple example of querying the knowledge base. To understand advanced querying scenarios, review [other query examples](../quickstarts/get-answer-from-knowledge-base-using-url-tool.md?pivots=url-test-tool-curl#use-curl-to-query-for-a-chit-chat-answer).
-->


The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/QnAMaker/sdk/preview-sdk/quickstart.py).
