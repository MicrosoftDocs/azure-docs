---
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 04/06/2022
ms.author: aahi
---

> [!NOTE]
> The project name is case sensitive for all operations.

Create a **POST** request using the following URL, headers, and JSON body to create your project and import the tags file.

Use the following URL to create a project and import your tags file. Replace the placeholder values below with your own values. 

```rest
{YOUR-ENDPOINT}/language/analyze-text/projects/{projectName}/:import?api-version=2021-11-01-preview
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{YOUR-ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |

### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|

### Body

Use the following JSON in your request. Replace the placeholder values below with your own values. Use the tags file available in the [sample data](https://github.com/Azure-Samples/cognitive-services-sample-data-files) tab

```json
{
    "api-version": "2021-11-01-preview",
    "metadata": {
        "name": "MyProject",
        "multiLingual": true,
        "description": "Trying out custom NER",
        "modelType": "Extraction",
        "language": "string",
        "storageInputContainerName": "YOUR-CONTAINER-NAME",
        "settings": {}
    },
    "assets": {
        "extractors": [
        {
            "name": "Entity1"
        },
        {
            "name": "Entity2"
        }
    ],
    "documents": [
        {
            "location": "doc1.txt",
            "language": "en-us",
            "dataset": "Train",
            "extractors": [
                {
                    "regionOffset": 0,
                    "regionLength": 500,
                    "labels": [
                        {
                            "extractorName": "Entity1",
                            "offset": 25,
                            "length": 10
                        },                    
                        {
                            "extractorName": "Entity2",
                            "offset": 120,
                            "length": 8
                        }
                    ]
                }
            ]
        },
        {
            "location": "doc2.txt",
            "language": "en-us",
            "dataset": "Test",
            "extractors": [
                {
                    "regionOffset": 0,
                    "regionLength": 100,
                    "labels": [
                        {
                            "extractorName": "Entity2",
                            "offset": 20,
                            "length": 5
                        }
                    ]
                }
            ]
        }
    ]
    }
}
```
For the metadata key: 

|Key  |Value  | Example |
|---------|---------|---------|
| `modelType  `    | Your Model type. | Extraction |
|`storageInputContainerName`   | The name of your Azure blob storage container.   | `myContainer` |

For the documents key: 

|Key  |Value  | Example |
|---------|---------|---------|
| `location `    | Document name on the blob store. | `doc2.txt` |
|`language`   | The language of the document.   | `en-us` |
|`dataset`   |  Optional field to specify the dataset which this document will belong to. | `Train` or `Test` | 


This request will return an error if:

* The selected resource doesn't have proper permission for the storage account. 
