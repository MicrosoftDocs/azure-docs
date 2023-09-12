---
title: Custom classification model - Document Intelligence (formerly Form Recognizer)
titleSuffix: Azure AI services
description: Use the custom classification model to train a model to identify and split the documents you process within your application.
author: vkurpad
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: conceptual
ms.date: 07/18/2023
ms.author: lajanuar
ms.custom: references_regions
monikerRange: 'doc-intel-3.1.0'
---


# Document Intelligence custom classification model

**This article applies to:** ![Document Intelligence checkmark](media/yes-icon.png) **The latest [GA SDK](sdk-overview-v3-1.md) supported by Document Intelligence REST API version [2023-07-31](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/AnalyzeDocument)**.

> [!IMPORTANT]
>
> Custom classification model is now generally available!
>

Custom classification models are deep-learning-model types that combine layout and language features to accurately detect and identify documents you process within your application. Custom classification models perform classification of an input file one page at a time to identify the document(s) within and can also identify multiple documents or multiple instances of a single document within an input file.

## Model capabilities

Custom classification models can analyze a single- or multi-file documents to identify if any of the trained document types are contained within an input file. Here are the currently supported scenarios:

* A single file containing one document. For instance, a loan application form.

* A single file containing multiple documents. For instance, a loan application package containing a loan application form, payslip, and bank statement.

* A single file containing multiple instances of the same document. For instance, a collection of scanned invoices.

Training a custom classifier requires at least two distinct classes and a minimum of five samples per class. The model response contains the page ranges for each of the classes of documents identified. 

The model classifies each page of the input document to one of the classes in the labeled dataset. Use the confidence score from the response to set the threshold for your application. 

### Compare custom classification and composed models

A custom classification model can replace [a composed model](concept-composed-models.md) in some scenarios but there are a few differences to be aware of:

| Capability | Custom classifier process | Composed model process |
|--|--|--|
|Analyze a single document of unknown type belonging to one of the types trained for extraction model processing.| &#9679; Requires multiple calls. </br> &#9679; Call the classification model based on the document class. This step allows for a confidence-based check before invoking the extraction model analysis.</br> &#9679; Invoke the extraction model. | &#9679; Requires a single call to a composed model containing the model corresponding to the input document type. |
 |Analyze a single document of unknown type belonging to several types trained for extraction model processing.| &#9679;Requires multiple calls.</br> &#9679; Make a call to the classifier that ignores documents not matching a designated type for extraction.</br> &#9679; Invoke the extraction model. | &#9679;  Requires a single call to a composed model. The service selects a custom model within the composed model with the highest match.</br> &#9679; A composed model can't ignore documents.|
|Analyze a file containing multiple documents of known or unknown type belonging to one of the types trained for extraction model processing.| &#9679; Requires multiple calls. </br> &#9679; Call the extraction model for each identified document in the input file.</br> &#9679; Invoke the extraction model. | &#9679;  Requires a single call to a composed model.</br> &#9679; The composed model invokes the component model once on the first instance of the document. </br> &#9679;The remaining documents are ignored. |

## Language support

Classification models currently only support English language documents.

## Best practices

Custom classification models require a minimum of five samples per class to train. If the classes are similar, adding extra training samples improves model accuracy.

## Training a model

Custom classification models are only available in the [v3.1 API](v3-1-migration-guide.md) version ```2023-07-31```. [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio) provides a no-code user interface to interactively train a custom classifier.

When using the REST API, if you've organized your documents by folders, you can use the ```azureBlobSource``` property of the request to train a classification model.

```rest
https://{endpoint}/formrecognizer/documentClassifiers:build?api-version=2023-07-31

{
  "classifierId": "demo2.1",
  "description": "",
  "docTypes": {
    "car-maint": {
        "azureBlobSource": {
            "containerUrl": "SAS URL to container",
            "prefix": "sample1/car-maint/"
            }
    },
    "cc-auth": {
        "azureBlobSource": {
            "containerUrl": "SAS URL to container",
            "prefix": "sample1/cc-auth/"
            }
    },
    "deed-of-trust": {
        "azureBlobSource": {
            "containerUrl": "SAS URL to container",
            "prefix": "sample1/deed-of-trust/"
            }
    }
  }
}

```

Alternatively, if you have a flat list of files or only plan to use a few select files within each folder to train the model, you can use the ```azureBlobFileListSource``` property to train the model. This step requires a ```file list``` in [JSON Lines](https://jsonlines.org/) format. For each class, add a new file with a list of files to be submitted for training.

```rest
{
  "classifierId": "demo2",
  "description": "",
  "docTypes": {
    "car-maint": {
      "azureBlobFileListSource": {
        "containerUrl": "SAS URL to container",
        "fileList": "sample1/car-maint.jsonl"
      }
    },
    "cc-auth": {
      "azureBlobFileListSource": {
        "containerUrl": "SAS URL to container",
        "fileList": "sample1/cc-auth.jsonl"
      }
    },
    "deed-of-trust": {
      "azureBlobFileListSource": {
        "containerUrl": "SAS URL to container",
        "fileList": "sample1/deed-of-trust.jsonl"
      }
    }
  }
}

```

File list `car-maint.jsonl` contains the following files.

```json
{"file":"sample1/car-maint/Commercial Motor Vehicle - Adatum.pdf"}
{"file":"sample1/car-maint/Commercial Motor Vehicle - Fincher.pdf"}
{"file":"sample1/car-maint/Commercial Motor Vehicle - Lamna.pdf"}
{"file":"sample1/car-maint/Commercial Motor Vehicle - Liberty.pdf"}
{"file":"sample1/car-maint/Commercial Motor Vehicle - Trey.pdf"}
```

## Model response

Analyze an input file with the document classification model

```rest
https://{service-endpoint}/formrecognizer/documentClassifiers/{classifier}:analyze?api-version=2023-07-31
```

The response contains the identified documents with the associated page ranges in the documents section of the response.

```json
{
  ...
    
    "documents": [
      {
        "docType": "formA",
        "boundingRegions": [
          { "pageNumber": 1, "polygon": [...] },
          { "pageNumber": 2, "polygon": [...] }
        ],
        "confidence": 0.97,
        "spans": []
      },
      {
        "docType": "formB",
        "boundingRegions": [
          { "pageNumber": 3, "polygon": [...] }
        ],
        "confidence": 0.97,
        "spans": []
      }, ...
    ]
  }

```

## Next steps

Learn to create custom classification models:

> [!div class="nextstepaction"]
> [**Build a custom classification model**](how-to-guides/build-a-custom-classifier.md)
> [**Custom models overview**](concept-custom.md)
