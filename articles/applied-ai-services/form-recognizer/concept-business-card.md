---
title: Form Recognizer business card model
titleSuffix: Azure Applied AI Services
description: Concepts encompassing data extraction and analysis using prebuilt business card model
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 10/05/2021
ms.author: lajanuar
recommendations: false
---
<!-- markdownlint-disable MD033 -->

# Form Recognizer business card model

## Overview

The business card model combines powerful Optical Character Recognition (OCR) capabilities with deep learning models to analyze and extract key information from business card images. The API analyzes printed business cards; extracts key information such as first name, last name, company name, email address, and phone number;  and returns a structured JSON data representation.

***Sample business card processed with [Form Recognizer sample labeling tool](https://fott-2-1.azurewebsites.net/):***

:::image type="content" source="./media/overview-business-card.jpg" alt-text="sample business card" lightbox="./media/overview-business-card.jpg":::

## Try Form Recognizer Studio (Preview)

* Form Recognizer studio is available with the preview (v3.0) API.

* Extract name, job title, address, email, company name, and more with our Form Recognizer Studio Business Card feature:

> [!div class="nextstepaction"]
> [Try Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=businessCard)

## Try it: Sample labeling tool

You can see how business card data is extracted by trying our Sample Labeling tool. You'll need the following:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* A [Form Recognizer instance](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) ) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, click **Go to resource** to get your API key and endpoint.

 :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

* A business card document. You can use our [sample business card document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/businessCard.png).

> [!div class="nextstepaction"]
  > [Try it](https://fott-2-1.azurewebsites.net/prebuilts-analyze)

  In the Form Recognizer UI:

  1. Select **Use prebuilt model to get data**.
  1. Select **Business card** from the **Form Type** dropdown menu:

  :::image type="content" source="media/try-business-card.png" alt-text="Screenshot: sample labeling tool dropdown prebuilt model selection menu.":::

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

## Supported languages and locales

>[!NOTE]
 > It's not necessary to specify a locale. This is an optional parameter. The Form Recognizer deep-learning technology will auto-detect the language of the text in your image.

| Model | Language—Locale code | Default |
|--------|:----------------------|:---------|
|Business card| <ul><li>English (United States)—en-US</li><li> English (Australia)—en-AU</li><li>English (Canada)—en-CA</li><li>English (United Kingdom)—en-GB</li><li>English (India)—en-IN</li></ul>  | Autodetected |

## Key-value pair extraction

|Name| Type | Description |Standardized output |
|:-----|:----|:----|:----:|
| ContactNames | array of objects | Contact name |  |
| FirstName | string | First (given) name of contact |  |
| LastName | string | Last (family) name of contact |  |
| CompanyNames | array of strings | Company name(s)|  |
| Departments | array of strings | Department(s) or organization(s) of contact |  |
| JobTitles | array of strings | Listed Job title(s) of contact |  |
| Emails | array of strings | Contact email address(es) |  |
| Websites | array of strings | Company website(s) |  |
| Addresses | array of strings | Address(es) extracted from business card | |
| MobilePhones | array of phone numbers | Mobile phone number(s) from business card |+1 xxx xxx xxxx |
| Faxes | array of phone numbers | Fax phone number(s) from business card | +1 xxx xxx xxxx |
| WorkPhones | array of phone numbers | Work phone number(s) from business card | +1 xxx xxx xxxx | 
| OtherPhones     | array of phone numbers | Other phone number(s) from business card | +1 xxx xxx xxxx |

## Form Recognizer preview v3.0

 The Form Recognizer preview introduces several new features and capabilities.

* Following our [**Form Recognizer v3.0 migration guide**](v3-migration-guide.md) to learn how to use the preview version in your applications and workflows.

* Explore our [**REST API (preview)**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/AnalyzeDocument) to learn more about the preview version and new capabilities.

## Next steps

* Complete a Form Recognizer quickstart:

  > [!div class="nextstepaction"]
  > [Form Recognizer quickstart](quickstarts/try-sdk-rest-api.md)

* Explore our REST API:

    > [!div class="nextstepaction"]
    > [Form Recognizer API v2.1](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeBusinessCardAsync)
