---
title: Form Recognizer Custom and composed models
titleSuffix: Azure Applied AI Services
description: Learn how to create, use, and manage Form Recognizer custom and composed models.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 10/07/2021
ms.author: lajanuar
recommendations: false
---

# Form Recognizer custom and composed models

Form Recognizer uses advanced machine learning technology to detect and extract information from document images and return the extracted data in a structured JSON output. With Form Recognizer, you can train standalone custom models or combine custom models to create composed models. See our

* **Custom models**. Form Recognizer custom models enable you to analyze and extract data from forms and documents specific to your business. Custom models are trained for your distinct data and use cases.

* **Composed models**. A composed model is created by taking a collection of custom models and assigning them to a single model that encompasses your form types. When a document is submitted to a composed model, the service performs a classification step to decide which custom model accurately represents the form presented for analysis.

:::image type="content" source="media/analyze.png" alt-text="Screenshot: Form Recognizer tool analyze-a-custom-form window.":::


## What is a custom model?

A custom model is a machine learning program trained to recognize form fields within your distinct content and extract key-value pairs and table data. You only need five examples of the same form type to get started and your custom model can be trained with or without labeled datasets.

## What is a composed model?

With composed models, you can assign multiple custom models to a composed model called with a single model ID. This is useful when you have trained several models and want to group them to analyze similar form types. For example, your composed model may include custom models trained to analyze your supply, equipment, and furniture purchase orders. Instead of manually trying to select the appropriate model, you can use a composed model to determine the appropriate custom model for each analysis and extraction.

## Try Form Recognizer Studio (Preview)

* Form Recognizer studio is available with the preview (v3.0) API.

* Analyze forms of a specific or unique type with our Form Recognizer Studio Custom Form feature:

> [!div class="nextstepaction"]
> [Try Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/customform/projects)

## Try Form Recognizer Sample labeling tool

You can see how data is extracted from custom forms by trying our Sample Labeling tool. You'll need the following:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* A [Form Recognizer instance](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) ) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, click **Go to resource** to get your API key and endpoint.

 :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

> [!div class="nextstepaction"]
> [Try it](https://fott-2-1.azurewebsites.net/projects/create)

In the Form Recognizer UI:

1. Select **Use Custom to train a model with labels and get key value pairs**.

      :::image type="content" source="media/label-tool/fott-use-custom.png" alt-text="Screenshot: FOTTtool selection of custom option.":::

1. In the next window, select **New project**:

    :::image type="content" source="media/label-tool/fott-new-project.png" alt-text="Screenshot: FOTTtools select new project.":::

## Input requirements

* For best results, provide one clear photo or high-quality scan per document.
* Supported file formats: JPEG, PNG, BMP, TIFF, and PDF (text-embedded or scanned). Text-embedded PDFs are best to eliminate the possibility of error in character extraction and location.
* For PDF and TIFF, up to 2000 pages can be processed (with a free tier subscription, only the first two pages are processed).
* The file size must be less than 50 MB.
* Image dimensions must be between 50 x 50 pixels and 10000 x 10000 pixels.
* PDF dimensions are up to 17 x 17 inches, corresponding to Legal or A3 paper size, or smaller.
* The total size of the training data is 500 pages or less.
* If your PDFs are password-locked, you must remove the lock before submission.
* For unsupervised learning (without labeled data):
  * data must contain keys and values.
  * keys must appear above or to the left of the values; they can't appear below or to the right.

  > [!TIP]
  > **Training data**
  >
  >* If possible, use text-based PDF documents instead of image-based documents. Scanned PDFs are handled as images.
  > * For filled-in forms, use examples that have all of their fields filled in.
  > * Use forms with different values in each field.
  >* If your form images are of lower quality, use a larger data set (10-15 images, for example).

> [!NOTE]
> The [sample labeling tool](https://fott-2-1.azurewebsites.net/) does not support the BMP file format. This is a limitation of the tool not the Form Recognizer Service.

## Supported languages and locales

 Form Recognizer preview version introduces additional language support for custom models. *See* our [Language Support](language-support.md#layout-and-custom-model) for a complete list of supported handwritten and printed text.

## Form Recognizer preview v3.0

 Form Recognizer v3.0 (preview) introduces several new features and capabilities:

* **Custom model API (v3.0)** supports signature detection for custom forms. When training custom models, you can specify certain fields as signatures.  When a document is analyzed with your custom model, it will indicate whether a signature has been detected or not.

* Following our [**Form Recognizer v3.0 migration guide**](v3-migration-guide.md) to learn how to use the preview version in your applications and workflows.

* Explore our [**REST API (preview)**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/AnalyzeDocument) to learn more about the preview version and new capabilities.

### Try signature detection

1. [**Build your training data set**](build-training-data-set.md#custom-model-input-requirements).

1. Navigate to the [**Form Recognizer sample labeling tool**](https://fott-preview-private.azurewebsites.net) and select **Use Custom to train a models with labels and get key value pairs**:

    :::image type="content" source="media/label-tool/fott-use-custom.png" alt-text="Screenshot: FOTTtools selection of the custom option.":::

1. In the next window, select **New project**:

    :::image type="content" source="media/label-tool/fott-new-project.png" alt-text="Screenshot: FOTTtools select new project.":::

1. Follow the  [**Custom model input requirements**](build-training-data-set.md#custom-model-input-requirements).

1. Create a label with the type **Signature**.

1. **Label your documents**.  For signature fields, using region labeling is recommended for better accuracy.

1. Once your training set has been labeled, you can **train your custom model** and use it to analyze documents. The signature fields will specify whether a signature was detected or not.

## Next steps

* Complete a Form Recognizer quickstart:

  > [!div class="nextstepaction"]
  > [Form Recognizer quickstart](quickstarts/try-sdk-rest-api.md)

* Explore our REST API:

    > [!div class="nextstepaction"]
    > [Form Recognizer API v2.1](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeWithCustomForm)
