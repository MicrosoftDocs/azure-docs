---
title: Form Recognizer general document model | Preview
titleSuffix: Azure Applied AI Services
description: Concepts encompassing data extraction and analysis using prebuilt general document preview model
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 03/08/2022
ms.author: lajanuar
recommendations: false
---
<!-- markdownlint-disable MD033 -->

# Form Recognizer general document model (preview)

The General document preview model combines powerful Optical Character Recognition (OCR) capabilities with deep learning models to extract key-value pairs, selection marks, and entities from documents. General document is only available with the preview (v3.0) API.  For more information on using the preview (v3.0) API, see our [migration guide](v3-migration-guide.md).


The general document API supports most form types and will analyze your documents and extract keys and associated values. It's ideal for extracting common key-value pairs from documents. You can use the general document model as an alternative to training a custom model without labels.

> [!NOTE]
> The ```2022-01-30-preview``` update to the general document model adds support for selection marks. 

## General document features

* The general document model is a pre-trained model, doesn't require labels or training.

* A single API extracts key-value pairs, selection marks entities, text, tables, and structure from documents.

* The general document model supports structured, semi-structured, and unstructured documents.

* Key names are spans of text within the document that are associated with a value.


* Selection marks are identified as fields with a value of ```:selected:``` or ```:unselected:``` 

***Sample document processed in the Form Recognizer Studio***

:::image type="content" source="media/studio/general-document-analyze.png" alt-text="Screenshot: general document analysis in the Form Recognizer Studio.":::

## Development options

The following tools are supported by Form Recognizer v3.0:

| Feature | Resources |
|----------|-------------------------|
|🆕 **General document model**|<ul ><li>[**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com)</li><li>[**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/AnalyzeDocument)</li><li>[**C# SDK**](quickstarts/try-v3-csharp-sdk.md)</li><li>[**Python SDK**](quickstarts/try-v3-python-sdk.md)</li><li>[**Java SDK**](quickstarts/try-v3-java-sdk.md)</li><li>[**JavaScript SDK**](quickstarts/try-v3-javascript-sdk.md)</li></ul>|

### Try Form Recognizer

See how data is extracted from forms and documents using the Form Recognizer Studio or our Sample Labeling tool.

You'll need the following resources:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* A [Form Recognizer instance](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, select **Go to resource** to get your key and endpoint.

 :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

#### Form Recognizer Studio (preview)

> [!NOTE]
> Form Recognizer studio and the general document model are available with the preview (v3.0) API.

1. On the Form Recognizer Studio home page, select **General documents**

1. You can analyze the sample document or select the **+ Add** button to upload your own sample.

1. Select the **Analyze** button:

    :::image type="content" source="media/studio/general-document-analyze-1.png" alt-text="Screenshot: analyze general document menu.":::

    > [!div class="nextstepaction"]
    > [Try Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=document)

## Key-value pairs

Key-value pairs are specific spans within the document that identify a label or key and its associated response or value. In a structured form, these pairs could be the label and the value the user entered for that field or in an unstructured  document they could be the date a contract was executed on based on the text in a paragraph.  The AI model is trained to extract identifiable keys and values based on a wide variety of document types, formats, and structures.

Keys can also exist in isolation when the model detects that a key exists, with no associated value or when processing optional fields. For example, a middle name field may be left blank on a form in some instances. key-value pairs are always spans of text contained in the document and if you have documents where same value is described in different ways, for example, a customer or a user, the associated key will be either customer or user based on what the document contained. 

## Entities

Natural language processing models can identify parts of speech and classify each token or word. The named entity recognition model is able to identify entities like people, locations, and dates to provide for a richer experience. Identifying entities enables you to distinguish between customer types, for example,  an individual or an organization.

The key value pair extraction model and entity identification model are run in parallel on the entire document and not just on the values of the extracted key-value pairs. This process ensures that complex structures where a key can't be identified is still enriched by identifying the entities referenced. You can still match keys or values to entities based on the offsets of the identified spans.

* The general document is a pre-trained model and can be directly invoked via the REST API.

* The general document model supports named entity recognition (NER) for several entity categories. NER is the ability to identify different entities in text and categorize them into pre-defined classes or types such as: person, location, event, product, and organization. Extracting entities can be useful in scenarios where you want to validate extracted values. The entities are extracted from the entire content and not just the extracted values.

## Data extraction

| **Model**   | **Text extraction** |**Key-Value pairs** |**Selection Marks**   | **Tables**   |**Entities** |
| --- | :---: |:---:| :---: | :---: |:---: |
|General document  | ✓  |  ✓ | ✓  | ✓  | ✓  |

## Input requirements

* For best results, provide one clear photo or high-quality scan per document.
* Supported file formats: JPEG/JPG, PNG, BMP, TIFF, and PDF (text-embedded or scanned). Text-embedded PDFs are best to eliminate the possibility of error in character extraction and location.
* For PDF and TIFF, up to 2000 pages can be processed (with a free tier subscription, only the first two pages are processed).
* The file size must be less than 500 MB for paid (S0) tier and 4 MB for free (F0) tier.
* Image dimensions must be between 50 x 50 pixels and 10,000 x 10,000 pixels.
* PDF dimensions are up to 17 x 17 inches, corresponding to Legal or A3 paper size, or smaller.
* The total size of the training data is 500 pages or less.
* If your PDFs are password-locked, you must remove the lock before submission.

## Supported languages and locales

| Model | Language—Locale code | Default |
|--------|:----------------------|:---------|
|General document| <ul><li>English (United States)—en-US</li></ul>| English (United States)—en-US|

### Named entity recognition (NER) categories

| Category | Type | Description |
|-----------|-------|--------------------|
| Person | String | A person's partial or full name. |
| PersonType | String | A person's job type or role.  |
| Location | String | Natural and human-made landmarks, structures, geographical features, and geopolitical entities. |
| Organization | String | Companies, political groups, musical bands, sport clubs, government bodies, and public organizations. |
| Event | String | Historical, social, and naturally occurring events. |
| Product | String |Physical objects of various categories. |
| Skill | String | A capability, skill, or expertise. |
| Address | String | Full mailing addresses. |
| Phone number | String| Phone numbers. | 
| Email | String | Email address. |
| URL | String | Website URLs and links. |
| IP Address | String | Network IP addresses. |
| DateTime | String | Dates and times of day. |
| Quantity | String | Numerical measurements and units. |

## Considerations

* Extracting entities can be useful in scenarios where you want to validate extracted values. The entities are extracted on the entire contents of the documents and not just the extracted values.

* Keys are spans of text extracted from the document, for semi structured documents, keys may need to be mapped to an existing dictionary of keys.

* Expect to see key-value pairs with a key, but no value. For example if a user chose to not provide an email address on the form.

## Next steps

* Follow our [**Form Recognizer v3.0 migration guide**](v3-migration-guide.md) to learn how to use the preview version in your applications and workflows.

* Explore our [**REST API (preview)**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-2/operations/AnalyzeDocument) to learn more about the preview version and new capabilities.

> [!div class="nextstepaction"]
> [Try the Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio)