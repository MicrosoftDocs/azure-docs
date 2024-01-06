---
title: Custom classification model - Document Intelligence (formerly Form Recognizer)
titleSuffix: Azure AI services
description: Use the custom classification model to train a model to identify and split the documents you process within your application.
author: vkurpad
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: conceptual
ms.date: 11/21/2023
ms.author: lajanuar
ms.custom:
  - references_regions
  - ignite-2023
monikerRange: '>=doc-intel-3.1.0'
---


# Document Intelligence custom classification model

::: moniker range="doc-intel-4.0.0"
[!INCLUDE [preview-version-notice](includes/preview-notice.md)]

**This content applies to:**![checkmark](media/yes-icon.png) **v4.0 (preview)** | **Previous version:** ![blue-checkmark](media/blue-yes-icon.png) [**v3.1 (GA)**](?view=doc-intel-3.1.0&preserve-view=tru)
:::moniker-end

:::moniker range="doc-intel-3.1.0"
**This content applies to:** ![checkmark](media/yes-icon.png) **v3.1 (GA)** | **Latest version:** ![purple-checkmark](media/purple-yes-icon.png) [**v4.0 (preview)**](?view=doc-intel-4.0.0&preserve-view=true)
:::moniker-end

::: moniker range=">=doc-intel-4.0.0"

> [!IMPORTANT]
>
> * Starting with the `2023-10-31-preview` API, analyzing documents with the custom classification model won't split documents by default.
> * You need to explicitly set the ``splitMode`` property to auto to preserve the behavior from previous releases. The default for `splitMode` is `none`.
> * If your input file contains multiple documents, you need to enable splitting by setting the ``splitMode`` to ``auto``.

::: moniker-end

Custom classification models are deep-learning-model types that combine layout and language features to accurately detect and identify documents you process within your application. Custom classification models perform classification of an input file one page at a time to identify the document(s) within and can also identify multiple documents or multiple instances of a single document within an input file.

## Model capabilities

Custom classification models can analyze a single- or multi-file documents to identify if any of the trained document types are contained within an input file. Here are the currently supported scenarios:

* A single file containing one document. For instance, a loan application form.

* A single file containing multiple documents. For instance, a loan application package containing a loan application form, payslip, and bank statement.

* A single file containing multiple instances of the same document. For instance, a collection of scanned invoices.

✔️ Training a custom classifier requires at least `two` distinct classes and a minimum of `five` document samples per class. The model response contains the page ranges for each of the classes of documents identified.

✔️ The maximum allowed number of classes is `500`. The maximum allowed number of document samples per class is `100`.

The model classifies each page of the input document to one of the classes in the labeled dataset. Use the confidence score from the response to set the threshold for your application.

### Compare custom classification and composed models

A custom classification model can replace [a composed model](concept-composed-models.md) in some scenarios but there are a few differences to be aware of:

| Capability | Custom classifier process | Composed model process |
|--|--|--|
|Analyze a single document of unknown type belonging to one of the types trained for extraction model processing.| &#9679; Requires multiple calls. </br> &#9679; Call the classification model based on the document class. This step allows for a confidence-based check before invoking the extraction model analysis.</br> &#9679; Invoke the extraction model. | &#9679; Requires a single call to a composed model containing the model corresponding to the input document type. |
 |Analyze a single document of unknown type belonging to several types trained for extraction model processing.| &#9679;Requires multiple calls.</br> &#9679; Make a call to the classifier that ignores documents not matching a designated type for extraction.</br> &#9679; Invoke the extraction model. | &#9679;  Requires a single call to a composed model. The service selects a custom model within the composed model with the highest match.</br> &#9679; A composed model can't ignore documents.|
|Analyze a file containing multiple documents of known or unknown type belonging to one of the types trained for extraction model processing.| &#9679; Requires multiple calls. </br> &#9679; Call the extraction model for each identified document in the input file.</br> &#9679; Invoke the extraction model. | &#9679;  Requires a single call to a composed model.</br> &#9679; The composed model invokes the component model once on the first instance of the document. </br> &#9679;The remaining documents are ignored. |

## Language support

:::moniker range="doc-intel-3.1.0"
Classification models currently only support English language documents.
:::moniker-end

::: moniker range=">=doc-intel-4.0.0"
Classification models can now be trained on documents of different languages. See [supported languages](language-support-custom.md) for a complete list.
::: moniker-end

## Input requirements

* For best results, provide five clear photos or high-quality scans per document type.

* Supported file formats:

    |Model | PDF |Image: </br>JPEG/JPG, PNG, BMP, TIFF, HEIF | Microsoft Office: </br> Word (DOCX), Excel (XLSX), PowerPoint (PPTX), and HTML|
    |--------|:----:|:-----:|:---------------:
    |Read            | ✔    | ✔    | ✔  |
    |Layout          | ✔  | ✔ | ✔ (2023-10-31-preview)  |
    |General&nbsp;Document| ✔  | ✔ |   |
    |Prebuilt        |  ✔  | ✔ |   |
    |Custom          |  ✔  | ✔ |   |

   

* For PDF and TIFF, up to 2000 pages can be processed (with a free tier subscription, only the first two pages are processed).

* The file size for analyzing documents is 500 MB for paid (S0) tier and 4 MB for free (F0) tier.

* Image dimensions must be between 50 x 50 pixels and 10,000 px x 10,000 pixels.

* If your PDFs are password-locked, you must remove the lock before submission.

* The minimum height of the text to be extracted is 12 pixels for a 1024 x 768 pixel image. This dimension corresponds to about `8`-point text at 150 dots per inch (DPI).

* For custom model training, the maximum number of pages for training data is 500 for the custom template model and 50,000 for the custom neural model.

* For custom extraction model training, the total size of training data is 50 MB for template model and 1G-MB for the neural model.

* For custom classification model training, the total size of training data is `1GB`  with a maximum of 10,000 pages.


## Document splitting

When you have more than one document in a file, the classifier can identify the different document types contained within the input file. The classifier response will contain the page ranges for each of the identified document types contined within a file. This can include multiple instances of the same document type.

::: moniker range=">=doc-intel-4.0.0"
The analyze operation now includes a `splitMode` property that gives you granular control over the splitting behavior. 
* To trat the entire input file as a single document for classification set the splitMode to `none`. When you do this, the service returns just one class for the entire input file.
* To classify each page of the input file, set the splitMode to `perPage`. The service will attept to classify each page as an individual document.
* Set the splitMode to `auto` and the service will identify the documents and associated page ranges.
::: moniker-end

## Best practices

Custom classification models require a minimum of five samples per class to train. If the classes are similar, adding extra training samples improves model accuracy.

The classifier will attempt to assign each document to one of the classes, if you expect the model will see document types not in the classes that are part of the training dataset, you should plan to set a threshold on the classification score or add a few representative samples of the document types to an ```"other"``` class. Adding an ```"other"``` class will ensure that the documents not needed do not impact your classifier quality.

## Training a model

Custom classification models are supported by **v4.0:2023-10-31-preview** and **v3.1:2023-07-31 (GA)** APIs. [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio) provides a no-code user interface to interactively train a custom classifier. Follow the [how to guide](how-to-guides/build-a-custom-classifier.md) to get started.

When using the REST API, if you organize your documents by folders, you can use the ```azureBlobSource``` property of the request to train a classification model.

:::moniker range="doc-intel-4.0.0"

```rest

https://{endpoint}/documentintelligence/documentClassifiers:build?api-version=2023-10-31-preview

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

:::moniker-end

:::moniker range="doc-intel-3.1.0"

```rest
https://{endpoint}/formrecognizer/documentClassifiers:build?api-version=2023-07-31

{
  "classifierId": "demo2.1",
  "description": "",
  "docTypes": {
    "car-maint": {
        "azureBlobSource": {
            "containerUrl": "SAS URL to container",
            "prefix": "{path to dataset root}/car-maint/"
            }
    },
    "cc-auth": {
        "azureBlobSource": {
            "containerUrl": "SAS URL to container",
            "prefix": "{path to dataset root}/cc-auth/"
            }
    },
    "deed-of-trust": {
        "azureBlobSource": {
            "containerUrl": "SAS URL to container",
            "prefix": "{path to dataset root}/deed-of-trust/"
            }
    }
  }
}

```

:::moniker-end

Alternatively, if you have a flat list of files or only plan to use a few select files within each folder to train the model, you can use the ```azureBlobFileListSource``` property to train the model. This step requires a ```file list``` in [JSON Lines](https://jsonlines.org/) format. For each class, add a new file with a list of files to be submitted for training.

```rest
{
  "classifierId": "demo2",
  "description": "",
  "docTypes": {
    "car-maint": {
      "azureBlobFileListSource": {
        "containerUrl": "SAS URL to container",
        "fileList": "{path to dataset root}/car-maint.jsonl"
      }
    },
    "cc-auth": {
      "azureBlobFileListSource": {
        "containerUrl": "SAS URL to container",
        "fileList": "{path to dataset root}/cc-auth.jsonl"
      }
    },
    "deed-of-trust": {
      "azureBlobFileListSource": {
        "containerUrl": "SAS URL to container",
        "fileList": "{path to dataset root}/deed-of-trust.jsonl"
      }
    }
  }
}

```

As an example, the file list `car-maint.jsonl` contains the following files.

```json
{"file":"classifier/car-maint/Commercial Motor Vehicle - Adatum.pdf"}
{"file":"classifier/car-maint/Commercial Motor Vehicle - Fincher.pdf"}
{"file":"classifier/car-maint/Commercial Motor Vehicle - Lamna.pdf"}
{"file":"classifier/car-maint/Commercial Motor Vehicle - Liberty.pdf"}
{"file":"classifier/car-maint/Commercial Motor Vehicle - Trey.pdf"}
```

## Model response

Analyze an input file with the document classification model

:::moniker range="doc-intel-4.0.0"

```rest
https://{endpoint}/documentintelligence/documentClassifiers/{classifier}:analyze?api-version=2023-10-31-preview
```

:::moniker-end

:::moniker range="doc-intel-3.1.0"

```rest
https://{service-endpoint}/formrecognizer/documentClassifiers/{classifier}:analyze?api-version=2023-07-31
```

:::moniker-end

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
