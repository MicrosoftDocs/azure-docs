---
author: aahill
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 12/06/2022
ms.author: aahi
ms.custom: ignite-fall-2021
---

[Reference documentation](/python/api/azure-ai-textanalytics/azure.ai.textanalytics?preserve-view=true&view=azure-python) | [Additional samples](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/textanalytics/azure-ai-textanalytics/samples) | [Package (PyPi)](https://pypi.org/project/azure-ai-textanalytics/5.2.0/) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/textanalytics/azure-ai-textanalytics)

Use this quickstart to create a sentiment analysis application with the client library for Python. In the following example, you will create a Python application that can identify the sentiment(s) expressed in a text sample, and perform aspect-based sentiment analysis.

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* [Python 3.7 or later](https://www.python.org/)

> [!div class="nextstepaction"]
> <a href="https://github.com/Azure/azure-sdk-for-python/issues/new?title=&body=%0A-%20**Package%20Name**:%20%0A-%20**Package%20Version**:%20%0A-%20**Operating%20System**:%20%0A-%20**Python%20Version**:%20%0A%0A%5BEnter%20feedback%20here%5D%0A%0A%0A---%0A%23%23%23%23%20Document%20details%0A%0A⚠%20*Do%20not%20edit%20this%20section.%20It%20is%20required%20for%20learn.microsoft.com%20➟%20GitHub%20issue%20linking.%0A%0ALanguage%20Quickstart%20Feedback%0A*%20Content:%20%5BQuickstart:%20Sentiment%20analysis%20and%20opinion%20mining%20-%20Azure%20Cognitive%20Services%5D(https:%2F%2Flearn.microsoft.com%2Fazure%2Fcognitive-services%2Flanguage-service%2Fsentiment-opinion-mining%2Fquickstart%3Fpivots%3Dprogramming-language-python)%0A*%20Content%20Source:%20%5Barticles%2Fcognitive-services%2Flanguage-service%2Fsentiment-opinion-mining%2Fquickstart.md%5D(https:%2F%2Fgithub.com%2FMicrosoftDocs%2Fazure-docs%2Fblob%2Fmain%2Farticles%2Fcognitive-services%2Flanguage-service%2Fsentiment-opinion-mining%2Fquickstart.md)%0A*%20Section:%20**Prerequisites**%0A*%20Service:%20**cognitive-services**%0A*%20Sub-service:%20**language-service**%0A&labels=Cognitive%20-%20Language%2CCognitive%20Language%20QS%20Feedback" target="_target">I ran into an issue</a>

## Setting up

[!INCLUDE [Create an Azure resource](../../../includes/create-resource.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=PYTHON&Pillar=Language&Product=Sentiment-analysis&Page=quickstart&Section=Create-an-azure-resource" target="_target">I ran into an issue</a>

[!INCLUDE [Get your key and endpoint](../../../includes/get-key-endpoint.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=PYTHON&Pillar=Language&Product=Sentiment-analysis&Page=quickstart&Section=Get-your-key-and-endpoint" target="_target">I ran into an issue</a>

[!INCLUDE [Create environment variables](../../../includes/environment-variables.md)]

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=PYTHON&Pillar=Language&Product=Sentiment-analysis&Page=quickstart&Section=Create-environment-variables" target="_target">I ran into an issue</a>


### Install the client library

After installing Python, you can install the client library with:

```console
pip install azure-ai-textanalytics==5.2.0
```

> [!div class="nextstepaction"]
> <a href="https://github.com/Azure/azure-sdk-for-python/issues/new?title=&body=%0A-%20**Package%20Name**:%20%0A-%20**Package%20Version**:%20%0A-%20**Operating%20System**:%20%0A-%20**Python%20Version**:%20%0A%0A%5BEnter%20feedback%20here%5D%0A%0A%0A---%0A%23%23%23%23%20Document%20details%0A%0A⚠%20*Do%20not%20edit%20this%20section.%20It%20is%20required%20for%20learn.microsoft.com%20➟%20GitHub%20issue%20linking.%0A%0ALanguage%20Quickstart%20Feedback%0A*%20Content:%20%5BQuickstart:%20Sentiment%20analysis%20and%20opinion%20mining%20-%20Azure%20Cognitive%20Services%5D(https:%2F%2Flearn.microsoft.com%2Fazure%2Fcognitive-services%2Flanguage-service%2Fsentiment-opinion-mining%2Fquickstart%3Fpivots%3Dprogramming-language-python)%0A*%20Content%20Source:%20%5Barticles%2Fcognitive-services%2Flanguage-service%2Fsentiment-opinion-mining%2Fquickstart.md%5D(https:%2F%2Fgithub.com%2FMicrosoftDocs%2Fazure-docs%2Fblob%2Fmain%2Farticles%2Fcognitive-services%2Flanguage-service%2Fsentiment-opinion-mining%2Fquickstart.md)%0A*%20Section:%20**Set-up-the-environment**%0A*%20Service:%20**cognitive-services**%0A*%20Sub-service:%20**language-service**%0A&labels=Cognitive%20-%20Language%2CCognitive%20Language%20QS%20Feedback" target="_target">I ran into an issue</a>


## Code example

Create a new Python file and copy the below code. Then run the code 

```python
# This example requires environment variables named "LANGUAGE_KEY" and "LANGUAGE_ENDPOINT"
language_key = os.environ.get('LANGUAGE_KEY')
language_endpoint = os.environ.get('LANGUAGE_ENDPOINT')

from azure.ai.textanalytics import TextAnalyticsClient
from azure.core.credentials import AzureKeyCredential

# Authenticate the client using your key and endpoint 
def authenticate_client():
    ta_credential = AzureKeyCredential(language_key)
    text_analytics_client = TextAnalyticsClient(
            endpoint=language_endpoint, 
            credential=ta_credential)
    return text_analytics_client

client = authenticate_client()

# Example method for detecting sentiment and opinions in text 
def sentiment_analysis_with_opinion_mining_example(client):

    documents = [
        "The food and service were unacceptable. The concierge was nice, however."
    ]

    result = client.analyze_sentiment(documents, show_opinion_mining=True)
    doc_result = [doc for doc in result if not doc.is_error]

    positive_reviews = [doc for doc in doc_result if doc.sentiment == "positive"]
    negative_reviews = [doc for doc in doc_result if doc.sentiment == "negative"]

    positive_mined_opinions = []
    mixed_mined_opinions = []
    negative_mined_opinions = []

    for document in doc_result:
        print("Document Sentiment: {}".format(document.sentiment))
        print("Overall scores: positive={0:.2f}; neutral={1:.2f}; negative={2:.2f} \n".format(
            document.confidence_scores.positive,
            document.confidence_scores.neutral,
            document.confidence_scores.negative,
        ))
        for sentence in document.sentences:
            print("Sentence: {}".format(sentence.text))
            print("Sentence sentiment: {}".format(sentence.sentiment))
            print("Sentence score:\nPositive={0:.2f}\nNeutral={1:.2f}\nNegative={2:.2f}\n".format(
                sentence.confidence_scores.positive,
                sentence.confidence_scores.neutral,
                sentence.confidence_scores.negative,
            ))
            for mined_opinion in sentence.mined_opinions:
                target = mined_opinion.target
                print("......'{}' target '{}'".format(target.sentiment, target.text))
                print("......Target score:\n......Positive={0:.2f}\n......Negative={1:.2f}\n".format(
                    target.confidence_scores.positive,
                    target.confidence_scores.negative,
                ))
                for assessment in mined_opinion.assessments:
                    print("......'{}' assessment '{}'".format(assessment.sentiment, assessment.text))
                    print("......Assessment score:\n......Positive={0:.2f}\n......Negative={1:.2f}\n".format(
                        assessment.confidence_scores.positive,
                        assessment.confidence_scores.negative,
                    ))
            print("\n")
        print("\n")
          
sentiment_analysis_with_opinion_mining_example(client)
```

> [!div class="nextstepaction"]
> <a href="https://github.com/Azure/azure-sdk-for-python/issues/new?title=&body=%0A-%20**Package%20Name**:%20%0A-%20**Package%20Version**:%20%0A-%20**Operating%20System**:%20%0A-%20**Python%20Version**:%20%0A%0A%5BEnter%20feedback%20here%5D%0A%0A%0A---%0A%23%23%23%23%20Document%20details%0A%0A⚠%20*Do%20not%20edit%20this%20section.%20It%20is%20required%20for%20learn.microsoft.com%20➟%20GitHub%20issue%20linking.%0A%0ALanguage%20Quickstart%20Feedback%0A*%20Content:%20%5BQuickstart:%20Sentiment%20analysis%20and%20opinion%20mining%20-%20Azure%20Cognitive%20Services%5D(https:%2F%2Flearn.microsoft.com%2Fazure%2Fcognitive-services%2Flanguage-service%2Fsentiment-opinion-mining%2Fquickstart%3Fpivots%3Dprogramming-language-python)%0A*%20Content%20Source:%20%5Barticles%2Fcognitive-services%2Flanguage-service%2Fsentiment-opinion-mining%2Fquickstart.md%5D(https:%2F%2Fgithub.com%2FMicrosoftDocs%2Fazure-docs%2Fblob%2Fmain%2Farticles%2Fcognitive-services%2Flanguage-service%2Fsentiment-opinion-mining%2Fquickstart.md)%0A*%20Section:%20**Code-example**%0A*%20Service:%20**cognitive-services**%0A*%20Sub-service:%20**language-service**%0A&labels=Cognitive%20-%20Language%2CCognitive%20Language%20QS%20Feedback" target="_target">I ran into an issue</a>

## Output

```console
Document Sentiment: mixed
Overall scores: positive=0.47; neutral=0.00; negative=0.52

Sentence: The food and service were unacceptable.
Sentence sentiment: negative
Sentence score:
Positive=0.00
Neutral=0.00
Negative=0.99

......'negative' target 'food'
......Target score:
......Positive=0.00
......Negative=1.00

......'negative' assessment 'unacceptable'
......Assessment score:
......Positive=0.00
......Negative=1.00

......'negative' target 'service'
......Target score:
......Positive=0.00
......Negative=1.00

......'negative' assessment 'unacceptable'
......Assessment score:
......Positive=0.00
......Negative=1.00



Sentence: The concierge was nice, however.
Sentence sentiment: positive
Sentence score:
Positive=0.94
Neutral=0.01
Negative=0.05

......'positive' target 'concierge'
......Target score:
......Positive=1.00
......Negative=0.00

......'positive' assessment 'nice'
......Assessment score:
......Positive=1.00
......Negative=0.00
```

[!INCLUDE [clean up resources](../../../includes/clean-up-resources.md)]

[!INCLUDE [clean up resources](../../../includes/clean-up-variables.md)]

> [!div class="nextstepaction"]
> <a href="https://github.com/Azure/azure-sdk-for-python/issues/new?title=&body=%0A-%20**Package%20Name**:%20%0A-%20**Package%20Version**:%20%0A-%20**Operating%20System**:%20%0A-%20**Python%20Version**:%20%0A%0A%5BEnter%20feedback%20here%5D%0A%0A%0A---%0A%23%23%23%23%20Document%20details%0A%0A⚠%20*Do%20not%20edit%20this%20section.%20It%20is%20required%20for%20learn.microsoft.com%20➟%20GitHub%20issue%20linking.%0A%0ALanguage%20Quickstart%20Feedback%0A*%20Content:%20%5BQuickstart:%20Sentiment%20analysis%20and%20opinion%20mining%20-%20Azure%20Cognitive%20Services%5D(https:%2F%2Flearn.microsoft.com%2Fazure%2Fcognitive-services%2Flanguage-service%2Fsentiment-opinion-mining%2Fquickstart%3Fpivots%3Dprogramming-language-python)%0A*%20Content%20Source:%20%5Barticles%2Fcognitive-services%2Flanguage-service%2Fsentiment-opinion-mining%2Fquickstart.md%5D(https:%2F%2Fgithub.com%2FMicrosoftDocs%2Fazure-docs%2Fblob%2Fmain%2Farticles%2Fcognitive-services%2Flanguage-service%2Fsentiment-opinion-mining%2Fquickstart.md)%0A*%20Section:%20**Clean-up-resources**%0A*%20Service:%20**cognitive-services**%0A*%20Sub-service:%20**language-service**%0A&labels=Cognitive%20-%20Language%2CCognitive%20Language%20QS%20Feedback" target="_target">I ran into an issue</a>

## Next steps

* [Sentiment analysis and opinion mining language support](../../language-support.md)
* [How to call the API](../../how-to/call-api.md)  
* [Reference documentation](/python/api/azure-ai-textanalytics/azure.ai.textanalytics?preserve-view=true&view=azure-python)
* [Additional samples](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/textanalytics/azure-ai-textanalytics/samples)