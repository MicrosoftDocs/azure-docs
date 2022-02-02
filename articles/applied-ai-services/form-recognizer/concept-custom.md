---
title: Form Recognizer custom and composed models
titleSuffix: Azure Applied AI Services
description: Learn how to create, use, and manage Azure Form Recognizer custom and composed models.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 11/02/2021
ms.author: lajanuar
recommendations: false
ms.custom: ignite-fall-2021
---

# Form Recognizer custom and composed models


Form Recognizer uses advanced machine-learning technology to detect and extract information from document images and return the extracted data in a structured JSON output. With Form Recognizer, you can train standalone custom models or combine custom models to create composed models.


* **Custom models**: By using custom models, you can analyze and extract data from forms and documents specific to your business. Custom models are trained for your distinct data and use cases.
* **Composed models**: A composed model is created by taking a collection of custom models and assigning them to a single model that encompasses your form types. When a document is submitted to a composed model, the service performs a classification step to decide which custom model accurately represents the form presented for analysis.

   :::image type="content" source="media/studio/analyze-custom.png" alt-text="Screenshot that shows the Form Recognizer tool analyze-a-custom-form window.":::

## What is a custom model?


A custom model is a machine-learning program trained to recognize form fields within your distinct content and extract key-value pairs and table data. You only need five examples of the same form type to get started and your custom model can be trained with or without labeled datasets.

## What is a composed model?

With composed models, you can assign multiple custom models to a composed model called with a single model ID. It's useful when you've trained several models and want to group them to analyze similar form types. For example, your composed model might include custom models trained to analyze your supply, equipment, and furniture purchase orders. Instead of manually trying to select the appropriate model, you can use a composed model to determine the appropriate custom model for each analysis and extraction.

## Development options

The following resources are supported by Form Recognizer v2.1:

| Feature | Resources |
|----------|-------------------------|
|Custom model| <ul><li>[Form Recognizer labeling tool](https://fott-2-1.azurewebsites.net)</li><li>[REST API](quickstarts/try-sdk-rest-api.md?pivots=programming-language-rest-api#analyze-forms-with-a-custom-model)</li><li>[Client library SDK](quickstarts/try-sdk-rest-api.md)</li><li>[Form Recognizer Docker container](containers/form-recognizer-container-install-run.md?tabs=custom#run-the-container-with-the-docker-compose-up-command)</li></ul>|

The following resources are supported by Form Recognizer v3.0:

| Feature | Resources |
|----------|-------------|
|Custom model| <ul><li>[Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/customform/projects)</li><li>[REST API](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/AnalyzeDocument)</li><li>[C# SDK](quickstarts/try-v3-csharp-sdk.md)</li><li>[Python SDK](quickstarts/try-v3-python-sdk.md)</li></ul>|

### Try Form Recognizer

See how data is extracted from your specific or unique documents by using custom models. You need the following resources:

* An Azure subscription. You can [create one for free](https://azure.microsoft.com/free/cognitive-services/).
* A [Form Recognizer instance](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, select **Go to resource** to get your API key and endpoint.

  :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot that shows the keys and endpoint location in the Azure portal.":::

#### Form Recognizer Studio (preview)

> [!NOTE]
> Form Recognizer Studio is available with the preview (v3.0) API.

1. On the **Form Recognizer Studio** home page, select **Custom form**.

1. Under **My Projects**, select **Create a project**.

1. Complete the project details fields.

1. Configure the service resource by adding your **Storage account** and **Blob container** to **Connect your training data source**.

1. Review and create your project.

1. Use the sample documents to build and test your custom model.

    > [!div class="nextstepaction"]
    > [Try Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/customform/projects)

#### Sample Labeling tool

You need a set of at least six forms of the same type. You use this data to train the model and test a form. You can use the [sample dataset](https://go.microsoft.com/fwlink/?linkid=2090451). Download and extract the *sample_data.zip* file. Then upload the contents to your Azure Blob Storage container.

In the Form Recognizer UI:

1. On the **Sample Labeling tool** home page, select **Use Custom to train a model with labels and get key value pairs**.

      :::image type="content" source="media/label-tool/fott-use-custom.png" alt-text="Screenshot that shows selecting the custom option.":::

1. In the next window, select **New Project**.

    :::image type="content" source="media/label-tool/fott-new-project.png" alt-text="Screenshot that shows selecting New Project.":::

For more detailed instructions, see the [Sample Labeling tool](quickstarts/try-sample-label-tool.md) quickstart.

> [!div class="nextstepaction"]
> [Try Sample Labeling tool](https://fott-2-1.azurewebsites.net/projects/create)

## Input requirements

Meet the following requirements:

* For best results, provide one clear photo or high-quality scan per document.
* Supported file formats are JPEG, PNG, BMP, TIFF, and PDF (text-embedded or scanned). Text-embedded PDFs are best to eliminate the possibility of error in character extraction and location.
* For PDF and TIFF files, up to 2,000 pages can be processed. With a free tier subscription, only the first two pages are processed.
* The file size must be less than 50 MB.
* Image dimensions must be between 50 x 50 pixels and 10,000 x 10,000 pixels.
* PDF dimensions are up to 17 x 17 inches, corresponding to Legal or A3 paper size, or smaller.
* The total size of the training data is 500 pages or less.
* If your PDFs are password-locked, you must remove the lock before submission.
* For unsupervised learning (without labeled data):
  * Data must contain keys and values.
  * Keys must appear above or to the left of the values. They can't appear below or to the right.

  > [!TIP]
  > Training data:
  >
  >* If possible, use text-based PDF documents instead of image-based documents. Scanned PDFs are handled as images.
  > * For filled-in forms, use examples that have all their fields filled in.
  > * Use forms with different values in each field.
  >* If your form images are of lower quality, use a larger dataset. For example, use 10 to 15 images.

The [Sample Labeling tool](https://fott-2-1.azurewebsites.net/) doesn't support the BMP file format. This limitation relates to the tool, not the Form Recognizer service.

## Supported languages and locales

 The Form Recognizer preview version introduces more language support for custom models. For a list of supported handwritten and printed text, see [Language support](language-support.md#layout-and-custom-model).

## Form Recognizer v3.0 (preview)

 Form Recognizer v3.0 (preview) introduces several new features and capabilities:

* **Custom model API (v3.0)**: This version supports signature detection for custom forms. When you train custom models, you can specify certain fields as signatures. When a document is analyzed with your custom model, it indicates whether a signature was detected or not.
* [Form Recognizer v3.0 migration guide](v3-migration-guide.md): This guide shows you how to use the preview version in your applications and workflows.
* [REST API (preview)](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/AnalyzeDocument): This API shows you more about the preview version and new capabilities.

### Try signature detection

1. Build your training dataset.

1. Go to [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio). Under **Custom models**, select **Custom form**.

    :::image type="content" source="media/label-tool/select-custom-form.png" alt-text="Screenshot that shows selecting the Form Recognizer Studio Custom form page.":::

1. Follow the workflow to create a new project:

   1. Follow the **Custom model** input requirements.

   1. Label your documents. For signature fields, use **Region** labeling for better accuracy.

      :::image type="content" source="media/label-tool/signature-label-region-too.png" alt-text="Screenshot that shows the Label signature field.":::

After your training set is labeled, you can train your custom model and use it to analyze documents. The signature fields specify whether a signature was detected or not.

## Next steps

* Complete a Form Recognizer quickstart:

  > [!div class="nextstepaction"]
  > [Form Recognizer quickstart](quickstarts/try-sdk-rest-api.md)

* Explore the REST API:

    > [!div class="nextstepaction"]
    > [Form Recognizer API v2.1](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeWithCustomForm)
