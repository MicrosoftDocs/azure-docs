---
title: Custom classification model - Form Recognizer
titleSuffix: Azure Applied AI Services
description: Use the custom classification model to train a model to identify and split the documents you process within your application.
author: vkurpad
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 02/28/2023
ms.author: lajanuar
ms.custom: references_regions
monikerRange: 'form-recog-3.0.0'
recommendations: false
---

# Custom classification model

**This article applies to:** ![Form Recognizer v3.0 checkmark](media/yes-icon.png) **Form Recognizer v3.0**.

Custom classification models are a deep learned model type that combines layout and language features to accurately detect and identify documents that you process within your application.

## Model capabilities

Custom classification models can analyze a file to identify it any of the document types it was trained with are contained within the document. Classifier models can process multi-document files. The scenarios supported are:

* A single file containing one document. For instance, a loan application form.
* A single file containing multiple documents. For instance, a loan application package containing a loan application form, a pay stub and a bank statement.
* A single file containing multiple instances of the same document. For instance, a stack of scanned invoices.

Training a custom classifier requires at least 2 distinct classes and a minimum of 5 samples per class.

### Compare custom classifiers to model compose

Custom classifiers can replace [the composed model](concept-composed-models.md) capability and has a few differences to be aware of.

| Capability | Custom classifier | Model compose |
|--|--|--|
|Analyze a single document of unknown type belonging to one of the types a extraction model is trained for| Multiple calls. Call the classifier and extraction model based on the document class. This allows for confidence based check before invoking the extraction model. | Single call to the composed model containing the model for the input document type |
|Analyze a single document of unknown type where some types have a extraction model is trained for| Multiple calls, classifier and extraction models. With the ability to ignore documents not matching a type that requires extraction. | Single call to the composed model. Will always pick a component model in the composed model with the highest match. Cannot ignore documents.|
|Analyze a file containing multiple documents of known or unknown type belonging to one of the types a extraction model is trained for| Multiple calls, classifier and extraction models. Call the extraction model for each identified document in the input file.| Single call to the composed model. The composed model will only invoke the component model once on the first instance of the document. The remaining documents are ignored. |

## Language support

Classification models currently only support English language documents.

## Best practices

Custom classification models require a minimum of 5 samples per class to train. If the classes are very similar, adding additional training samples will improve model accuracy.

## Training a model

Custom classification models are only available in the [v3 API](v3-migration-guide.md) starting with API version ```2023-02-28-preview```. The [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio) provides a easy to use user interface to train a custom classifier.

When using the REST API, if your documents are organized by folders, you can use the ```azureBlobSource``` property of the request to train a classifier.

```REST
https://{endpoint}/formrecognizer/documentClassifiers:build?api-version=2023-02-28-preview

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

Alternatively, if you have a flat list of files or only plan to use a few select files within each folder to train the model, you can use the ```azureBlobFileListSource``` property to train the model. This requires an additional ```file list``` in [JSON Lines](https://jsonlines.org/) format. For each class, add a new file with list of files to be submitted for training.

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

An example of the contents of the car-maint.jsonl file list from the sample above.

```json
{"file":"sample1/car-maint/Commercial Motor Vehicle - Adatum.pdf"}
{"file":"sample1/car-maint/Commercial Motor Vehicle - Fincher.pdf"}
{"file":"sample1/car-maint/Commercial Motor Vehicle - Lamna.pdf"}
{"file":"sample1/car-maint/Commercial Motor Vehicle - Liberty.pdf"}
{"file":"sample1/car-maint/Commercial Motor Vehicle - Trey.pdf"}
```

## Next steps

Learn to create custom classifier models:

> [!div class="nextstepaction"]
> [**Build a custom classifier model**](how-to-guides/build-a-custom-classifier.md)
> [**Custom models overview**](concept-custom.md.md)
