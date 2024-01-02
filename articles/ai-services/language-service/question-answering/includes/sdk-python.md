---
title: "Quickstart: Question answering client library for Python"
description: This quickstart shows how to get started with the question answering client library for Python.
ms.topic: include
author: jboback
ms.author: jboback
ms.date: 12/19/2023
---

Use this quickstart for the question answering client library for Python to:

* Get an answer from a project.
* Get an answer from a body of text that you send along with your question.
* Get the confidence score for the answer to your question.

[Reference documentation][questionanswering_refdocs] | [Package (PyPI)][questionanswering_pypi_package] | [Additional samples][questionanswering_samples] | [Library source code][questionanswering_client_src] 

[questionanswering_client_class]: https://azuresdkdocs.blob.core.windows.net/$web/python/azure-ai-language-questionanswering/1.0.0/azure.ai.language.questionanswering.html#azure.ai.language.questionanswering.QuestionAnsweringClient
[questionanswering_client_src]: https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/cognitivelanguage/azure-ai-language-questionanswering/
[questionanswering_pypi_package]: https://pypi.org/project/azure-ai-language-questionanswering/
[questionanswering_refdocs]: https://azuresdkdocs.blob.core.windows.net/$web/python/azure-ai-language-questionanswering/1.0.0/azure.ai.language.questionanswering.html
[questionanswering_samples]: https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/cognitivelanguage/azure-ai-language-questionanswering/samples/README.md

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* [Python 3.x](https://www.python.org/)
* Question answering requires a [Language resource](https://portal.azure.com/?quickstart=true#create/Microsoft.CognitiveServicesTextAnalytics) with the custom question answering feature enabled to generate an API key and endpoint.
	* After your Language resource deploys, select **Go to resource**. You need the key and endpoint from the resource you create to connect to the API. Paste your key and endpoint into the code below later in the quickstart.
* To create a Language resource with [Azure CLI](../../../multi-service-resource.md?pivots=azcli) provide the following other properties: `--api-properties qnaAzureSearchEndpointId=/subscriptions/<azure-subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Search/searchServices/<azure-search-service-name> qnaAzureSearchEndpointKey=<azure-search-service-auth-key>`
* An existing project to query. If you have not set up a project, you can follow the instructions in the [**Language Studio quickstart**](../quickstart/sdk.md). Or add a project that uses this [Surface User Guide URL](https://download.microsoft.com/download/7/B/1/7B10C82E-F520-4080-8516-5CF0D803EEE0/surface-book-user-guide-EN.pdf) as a data source.



## Setting up

### Install the client library

After installing Python, you can install the client library with:

```console
pip install azure-ai-language-questionanswering
```



## Query a project

### Generate an answer from a project

The example below will allow you to query a project using [get_answers](https://azuresdkdocs.blob.core.windows.net/$web/python/azure-ai-language-questionanswering/1.0.0/azure.ai.language.questionanswering.html#azure.ai.language.questionanswering.QuestionAnsweringClient.get-answers) to get an answer to your question. You can copy this code into a dedicated .py file or into a cell in [Jupyter Notebook/Lab](https://jupyter.org/).

You need to update the code below and provide your own values for the following variables.

|Variable name | Value |
|--------------------------|-------------|
| `endpoint`               | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. An example endpoint is: `https://southcentralus.api.cognitive.microsoft.com/`|
| `credential` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either Key1 or Key2. Always having two valid keys always for secure key rotation with zero downtime. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. The key value is part of the sample request.|
| `knowledge_base_project` | The name of your question answering project.|
| `deployment`             | There are two possible values: `test`, and `production`. `production` is dependent on you having deployed your project from **Language Studio** > **question answering** > **Deploy project**.|

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../key-vault/general/overview.md). For more information, see the Azure AI services [security article](../../../security-features.md).

```python
from azure.core.credentials import AzureKeyCredential
from azure.ai.language.questionanswering import QuestionAnsweringClient

endpoint = "https://{YOUR-ENDPOINT}.api.cognitive.microsoft.com/"
credential = AzureKeyCredential("{YOUR-LANGUAGE-RESOURCE-KEY}")
knowledge_base_project = "{YOUR-PROJECT-NAME}"
deployment = "production"

def main():
    client = QuestionAnsweringClient(endpoint, credential)
    with client:
        question="How much battery life do I have left?"
        output = client.get_answers(
            question = question,
            project_name=knowledge_base_project,
            deployment_name=deployment
        )
    print("Q: {}".format(question))
    print("A: {}".format(output.answers[0].answer))

if __name__ == '__main__':
    main()
```

While we're hard coding the variables for our example. For production, consider using a secure way of storing and accessing your credentials. For example, [Azure key vault](../../../../key-vault/general/overview.md) provides secure key storage.

When you run the code above, if you're using the data source from the prerequisites you get an answer that looks as follows:

```
Q: How much battery life do I have left?
A: If you want to see how much battery you have left, go to **Start  **> **Settings  **> **Devices  **> **Bluetooth & other devices  **, then find your pen. The current battery level will appear under the battery icon.
```

For information on how confident question answering is that this is the correct response add another print statement underneath the existing print statements:

```python
print("Q: {}".format(question))
print("A: {}".format(output.answers[0].answer))
print("Confidence Score: {}".format(output.answers[0].confidence)) # add this line 
```

You'll now receive a result with a confidence score:

```
Q: How much battery life do I have left?
A: If you want to see how much battery you have left, go to **Start  **> **Settings  **> **Devices  **> **Bluetooth & other devices  **, then find your pen. The current battery level will appear under the battery icon.
Confidence Score: 0.9185
```

The confidence score returns a value between 0 and 1. You can think of this like a percentage and multiply by 100 so a confidence score of 0.9185 means question answering is 91.85% confident this is the correct answer to the question based on the project.

If you want to exclude answers where the confidence score falls below a certain threshold, you can modify the [AnswerOptions](https://azuresdkdocs.blob.core.windows.net/$web/python/azure-ai-language-questionanswering/1.0.0/azure.ai.language.questionanswering.models.html#azure.ai.language.questionanswering.models.AnswersOptions) to add the `confidence_threshold` parameter.

```python
        output = client.get_answers(
            confidence_threshold = 0.95, #add this line
            question = question,
            project_name=knowledge_base_project,
            deployment_name=deployment
        )
```

Since we know from our previous execution of the code that our confidence score is: `.9185` setting the threshold to `.95` results in the [default answer](../how-to/change-default-answer.md) being returned.

```
Q: How much battery life do I have left?
A: No good match found in KB
Confidence Score: 0.0
```



## Query text without a project

You can also use question answering without a project with [get_answers_from_text](https://azuresdkdocs.blob.core.windows.net/$web/python/azure-ai-language-questionanswering/1.0.0/azure.ai.language.questionanswering.html#azure.ai.language.questionanswering.QuestionAnsweringClient.get-answers-from-text). In this case, you provide question answering with both a question and the associated text records you would like to search for an answer at the time the request is sent.

For this example, you only need to modify the variables for `endpoint` and `credential`.

```python
import os
from azure.core.credentials import AzureKeyCredential
from azure.ai.language.questionanswering import QuestionAnsweringClient
from azure.ai.language.questionanswering import models as qna

endpoint = "https://{YOUR-ENDPOINT}.api.cognitive.microsoft.com/"
credential = AzureKeyCredential("YOUR-LANGUAGE-RESOURCE-KEY")

def main():
    client = QuestionAnsweringClient(endpoint, credential)
    with client:
        question="How long does it takes to charge a surface?"
        input = qna.AnswersFromTextOptions(
            question=question,
            text_documents=[
                "Power and charging. It takes two to four hours to charge the Surface Pro 4 battery fully from an empty state. " +
                "It can take longer if you're using your Surface for power-intensive activities like gaming or video streaming while you're charging it.",
                "You can use the USB port on your Surface Pro 4 power supply to charge other devices, like a phone, while your Surface charges. " +
                "The USB port on the power supply is only for charging, not for data transfer. If you want to use a USB device, plug it into the USB port on your Surface.",
            ]
        )


        output = client.get_answers_from_text(input)

    best_answer = [a for a in output.answers if a.confidence > 0.9][0]
    print(u"Q: {}".format(input.question))
    print(u"A: {}".format(best_answer.answer))
    print("Confidence Score: {}".format(output.answers[0].confidence))

if __name__ == '__main__':
    main()
```

You can copy this code into a dedicated .py file or into a new cell in [Jupyter Notebook/Lab](https://jupyter.org/). This example returns a result of:

```
Q: How long does it takes to charge surface?
A: Power and charging. It takes two to four hours to charge the Surface Pro 4 battery fully from an empty state. It can take longer if you're using your Surface for power-intensive activities like gaming or video streaming while you're charging it.
Confidence Score: 0.9254655838012695
```

In this case, we iterate through all responses and only return the response with the highest confidence score that is greater than 0.9. To understand more about the options available with [get_answers_from_text](https://azuresdkdocs.blob.core.windows.net/$web/python/azure-ai-language-questionanswering/1.0.0/azure.ai.language.questionanswering.html#azure.ai.language.questionanswering.QuestionAnsweringClient.get-answers-from-text), review the [AnswersFromTextOptions parameters](https://azuresdkdocs.blob.core.windows.net/$web/python/azure-ai-language-questionanswering/1.0.0/azure.ai.language.questionanswering.models.html#azure.ai.language.questionanswering.models.AnswersFromTextOptions).

