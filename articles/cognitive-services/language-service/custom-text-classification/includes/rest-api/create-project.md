---
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 05/24/2022
ms.author: aahi
---
To start creating a custom text classification model, you need to create a project. Creating a project will let you label data, train, evaluate, improve, and deploy your models.

> [!NOTE]
> The project name is case-sensitive for all operations.

Create a **POST** request using the following URL, headers, and JSON body to create your project and import the labels file.

### Request URL

Use the following URL to create a project and import your labels file. Replace the placeholder values below with your own values. 

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

Use the following JSON in your request. Replace the placeholder values below with your own values.

```json
{
    "api-version": "2021-11-01-preview",
    "metadata": {
        "name": "MyProject",
        "multiLingual": true,
        "description": "Trying out custom text classification",
        "modelType": "multiClassification",
        "language": "string",
        "storageInputContainerName": "YOUR-CONTAINER-NAME",
        "settings": {}
    },
    "assets": {
        "classifiers": [
            {
                "name": "Class1"
            }
        ],
        "documents": [
            {
                "location": "doc1.txt",
                "language": "en-us",
                "dataset": "Train",
                "classifiers": [
                    {
                        "classifierName": "Class1"
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
| `modelType  `    | Your Model type, for single label classification use `singleClassification`.   | multiClassification |
|`storageInputContainerName`   | The name of your Azure blob storage container.   | `myContainer` |

For the documents key:

|Key  |Value  | Example |
|---------|---------|---------|
| `location`    | Document name on the blob store. | `doc2.txt` |
|`language`   | The language of the document.   | `en-us` |
|`dataset`   |  Optional field to specify the dataset that this document will belong to. | `Train` or `Test` |

This request will return an error if:

* The selected resource doesn't have proper permission for the storage account. 
