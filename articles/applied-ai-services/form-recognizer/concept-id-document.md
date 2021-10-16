---
title: Form Recognizer ID document model
titleSuffix: Azure Applied AI Services
description: Concepts encompassing data extraction and analysis using the prebuilt ID document model
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 10/16/2021
ms.author: lajanuar
recommendations: false
---
<!-- markdownlint-disable MD033 -->

# Form Recognizer ID document model

The ID document model combines powerful Optical Character Recognition (OCR) capabilities with deep learning models to analyze and extracts key information from U.S. Driver's Licenses (all 50 states and District of Columbia) and international passport biographical pages (excluding visa and other travel documents). The API analyzes identity documents; extracts key information such as first name, last name, address, and date of birth; and returns a structured JSON data representation.

***Sample U.S. Driver's License processed with [Form Recognizer sample labeling tool](https://fott-2-1.azurewebsites.net/):***

:::image type="content" source="./media/id-example-drivers-license.jpg" alt-text="sample identification card" lightbox="./media/overview-id.jpg":::

## Try Form Recognizer Studio (Preview)

* Form Recognizer studio is available with the preview (v3.0) API.

* Extract name, machine-readable zone, expiration date with our Form Recognizer Studio ID document feature:

> [!div class="nextstepaction"]
> [Try Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=idDocument)

## Try it: Sample Labeling tool

You can see how ID document data is extracted by trying our Sample Labeling tool. You'll need the following:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* A [Form Recognizer instance](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) ) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, click **Go to resource** to get your API key and endpoint.

 :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

* An ID document. You can use our [sample ID document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/id-license.jpg).

> [!div class="nextstepaction"]
  > [Try it](https://fott-2-1.azurewebsites.net/prebuilts-analyze)

In the Form Recognizer UI:

  1. Select **Use prebuilt model to get data**.
  1. Select **Receipt** from the **Form Type** dropdown menu:

  :::image type="content" source="media/try-id-document.png" alt-text="Screenshot: sample labeling tool dropdown prebuilt model selection menu.":::

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

> [!NOTE]
> The [sample labeling tool](https://fott-2-1.azurewebsites.net/) does not support the BMP file format. This is a limitation of the tool not the Form Recognizer Service.

## Supported languages and locales v2.1

| Model | Language—Locale code | Default |
|--------|:----------------------|:---------|
|ID document| <ul><li>English (United States)—en-US (driver's license)</li><li>Biographical pages from international passports</br> (excluding visa and other travel documents)</li></ul></br>|English (United States)—en-US|

## Key-value pair extraction

|Name| Type | Description | Standardized output|
|:-----|:----|:----|:----|
|  CountryRegion | countryRegion | Country or region code compliant with ISO 3166 standard |  |
|  DateOfBirth | date | DOB | yyyy-mm-dd |
|  DateOfExpiration | date | Expiration date DOB | yyyy-mm-dd |
|  DocumentNumber | string | Relevant passport number, driver's license number, etc. |  |
|  FirstName | string | Extracted given name and middle initial if applicable |  |
|  LastName | string | Extracted surname |  |
|  Nationality | countryRegion | Country or region code compliant with ISO 3166 standard (Passport only) |  |
|  Sex | string | Possible extracted values include "M", "F" and "X" | |
|  MachineReadableZone | object | Extracted Passport MRZ including two lines of 44 characters each | "P<USABROOKS<<JENNIFER<<<<<<<<<<<<<<<<<<<<<<< 3400200135USA8001014F1905054710000307<715816" |
|  DocumentType | string | Document type, for example, Passport, Driver's License | "passport" |
|  Address | string | Extracted address (Driver's License only) ||
|  Region | string | Extracted region, state, province, etc. (Driver's License only) |  |

## Form Recognizer preview v3.0

 The Form Recognizer preview introduces several new features and capabilities:

* **ID document (v3.0)** model supports endorsements, restrictions, and vehicle classification extraction from US driver's licenses.

    ### ID document preview key-value pair extraction

    |Name| Type | Description | Standardized output|
    |:-----|:----|:----|:----|
    | 🆕 Endorsements | string | Additional driving privileges granted to a driver such as Motorcycle or School bus.  | |
    | 🆕 Restrictions | string | Restricted driving privileges applicable to suspended or revoked licenses.| |
    | 🆕VehicleClassification | string | Types of vehicles that can be driven by a driver. ||
    |  CountryRegion | countryRegion | Country or region code compliant with ISO 3166 standard |  |
    |  DateOfBirth | date | DOB | yyyy-mm-dd |
    |  DateOfExpiration | date | Expiration date DOB | yyyy-mm-dd |
    |  DocumentNumber | string | Relevant passport number, driver's license number, etc. |  |
    |  FirstName | string | Extracted given name and middle initial if applicable |  |
    |  LastName | string | Extracted surname |  |
    |  Nationality | countryRegion | Country or region code compliant with ISO 3166 standard (Passport only) |  |
    |  Sex | string | Possible extracted values include "M", "F" and "X" | |
    |  MachineReadableZone | object | Extracted Passport MRZ including two lines of 44 characters each | "P<USABROOKS<<JENNIFER<<<<<<<<<<<<<<<<<<<<<<< 3400200135USA8001014F1905054710000307<715816" |
    |  DocumentType | string | Document type, for example, Passport, Driver's License | "passport" |
    |  Address | string | Extracted address (Driver's License only) ||
    |  Region | string | Extracted region, state, province, etc. (Driver's License only) |  |

* Following our [**Form Recognizer v3.0 migration guide**](v3-migration-guide.md) to learn how to use the preview version in your applications and workflows.

* Explore our [**REST API (preview)**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/AnalyzeDocument) to learn more about the preview version and new capabilities.

## Next steps

* Complete a Form Recognizer quickstart:

  > [!div class="nextstepaction"]
  > [Form Recognizer quickstart](quickstarts/try-sdk-rest-api.md)

* Explore our REST API:

    > [!div class="nextstepaction"]
    > [Form Recognizer API v2.1](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/5f74a7738978e467c5fb8707)