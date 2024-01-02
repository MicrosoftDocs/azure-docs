---
author: jboback
ms.service: azure-ai-language
ms.topic: include
ms.date: 12/19/2023
ms.author: jboback
ms.custom: ignite-fall-2021
---

[Reference documentation](/python/api/azure-ai-textanalytics/azure.ai.textanalytics?preserve-view=true&view=azure-python) | [Additional samples](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/textanalytics/azure-ai-textanalytics/samples) | [Package (PyPi)](https://pypi.org/project/azure-ai-textanalytics/5.2.0/) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/textanalytics/azure-ai-textanalytics) 


Use this quickstart to create a Text Analytics for health application with the client library for Python. In the following example, you will create a Python application that can identify medical [entities](../../concepts/health-entity-categories.md), [relations](../../concepts/relation-extraction.md), and [assertions](../../concepts/assertion-detection.md) that appear in text.


## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* [Python 3.7 or later](https://www.python.org/)
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Language resource"  target="_blank">create a Language resource </a> in the Azure portal to get your key and endpoint. After it deploys, select **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`Free F0`) to try the service (providing 5000 text records - 1000 characters each) and upgrade later to the `Standard S` pricing tier for production. You can also start with the `Standard S` pricing tier, receiving the same initial quota for free (5000 text records) before getting charged. For more information on pricing, visit [Language Service Pricing](https://azure.microsoft.com/pricing/details/cognitive-services/language-service/).



## Setting up

[!INCLUDE [Create environment variables](../../../includes/environment-variables.md)]



### Install the client library

After installing Python, you can install the client library with:

```console
pip install azure-ai-textanalytics==5.2.0
```



## Code example

Create a new Python file and copy the below code. Then run the code.  

[!INCLUDE [find the key and endpoint for a resource](../../../includes/find-azure-resource-info.md)]

```python
# This example requires environment variables named "LANGUAGE_KEY" and "LANGUAGE_ENDPOINT"
key = os.environ.get('LANGUAGE_KEY')
endpoint = os.environ.get('LANGUAGE_ENDPOINT')

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

# Example function for extracting information from healthcare-related text 
def health_example(client):
    documents = [
        """
        Patient needs to take 50 mg of ibuprofen.
        """
    ]

    poller = client.begin_analyze_healthcare_entities(documents)
    result = poller.result()

    docs = [doc for doc in result if not doc.is_error]

    for idx, doc in enumerate(docs):
        for entity in doc.entities:
            print("Entity: {}".format(entity.text))
            print("...Normalized Text: {}".format(entity.normalized_text))
            print("...Category: {}".format(entity.category))
            print("...Subcategory: {}".format(entity.subcategory))
            print("...Offset: {}".format(entity.offset))
            print("...Confidence score: {}".format(entity.confidence_score))
        for relation in doc.entity_relations:
            print("Relation of type: {} has the following roles".format(relation.relation_type))
            for role in relation.roles:
                print("...Role '{}' with entity '{}'".format(role.name, role.entity.text))
        print("------------------------------------------")
health_example(client)
```



### Output

```console
Entity: 50 mg
...Normalized Text: None
...Category: Dosage
...Subcategory: None
...Offset: 31
...Confidence score: 1.0
Entity: ibuprofen
...Normalized Text: ibuprofen
...Category: MedicationName
...Subcategory: None
...Offset: 40
...Confidence score: 1.0
Relation of type: DosageOfMedication has the following roles
...Role 'Dosage' with entity '50 mg'
...Role 'Medication' with entity 'ibuprofen'
```

> [!TIP]
> Fast Healthcare Interoperability Resources (FHIR) structuring is available for preview using the Language REST API. The client libraries are not currently supported. [Learn more](../../how-to/call-api.md) on how to use FHIR structuring in your API call.
