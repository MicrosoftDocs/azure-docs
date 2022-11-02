---
title: Business card data extraction - Form Recognizer
titleSuffix: Azure Applied AI Services
description: OCR and machine learning based business card scanning in Form Recognizer extracts key data from business cards.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 10/14/2022
ms.author: lajanuar
monikerRange: '>=form-recog-2.1.0'
recommendations: false
---
<!-- markdownlint-disable MD033 -->

# Business card data extraction

[!INCLUDE [applies to v3.0 and v2.1](includes/applies-to-v3-0-and-v2-1.md)]

## How business card data extraction works

Business cards are a great way of representing a business or a professional. The company logo, fonts and background images found in business cards help the company branding and differentiate it from others. Applying OCR and machine-learning based techniques to automate scanning of business cards is a common image processing scenario. Enterprise systems used by sales and marketing teams typically have business card data extraction capability integrated into them for the benefit of their users.

## Form Recognizer Business Card model

The business card model combines powerful Optical Character Recognition (OCR) capabilities with deep learning models to analyze and extract key information from business card images. The API analyzes printed business cards; extracts key information such as first name, last name, company name, email address, and phone number;  and returns a structured JSON data representation.

***Sample business card processed with [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=businessCard)***

:::image type="content" source="./media/studio/overview-business-card-studio.png" alt-text="sample business card" lightbox="./media/overview-business-card.jpg":::

## Development options

The following tools are supported by Form Recognizer v3.0:

| Feature | Resources | Model ID |
|----------|-------------|-----------|
|**Business card model**| <ul><li>[**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com)</li><li>[**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)</li><li>[**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li><li>[**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li><li>[**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li><li>[**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li></ul>|**prebuilt-businessCard**|

The following tools are supported by Form Recognizer v2.1:

| Feature | Resources |
|----------|-------------------------|
|**Business card model**|  <ul><li>[**Form Recognizer labeling tool**](https://fott-2-1.azurewebsites.net/prebuilts-analyze)</li><li>[**REST API**](/azure/applied-ai-services/form-recognizer/how-to-guides/use-sdk-rest-api?view=form-recog-2.1.0&preserve-view=true&tabs=windows&pivots=programming-language-rest-api#analyze-business-cards)</li><li>[**Client-library SDK**](/azure/applied-ai-services/form-recognizer/how-to-guides/v2-1-sdk-rest-api)</li><li>[**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?tabs=business-card#run-the-container-with-the-docker-compose-up-command)</li></ul>|

### Try business card data extraction

See how data, including name, job title, address, email, and company name, is extracted from business cards using the Form Recognizer Studio or our Sample Labeling tool. You'll need the following resources:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* A [Form Recognizer instance](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, select **Go to resource** to get your key and endpoint.

 :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

#### Form Recognizer Studio

> [!NOTE]
> Form Recognizer studio is available with the v3.0 API.

1. On the Form Recognizer Studio home page, select **Business cards**

1. You can analyze the sample business card or select the **+ Add** button to upload your own sample.

1. Select the **Analyze** button:

    :::image type="content" source="media/studio/business-card-analyze.png" alt-text="Screenshot: analyze business card menu.":::

    > [!div class="nextstepaction"]
    > [Try Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=businessCard)

## Input requirements

* For best results, provide one clear photo or high-quality scan per document.
* Supported file formats: JPEG/JPG, PNG, BMP, TIFF, and PDF (text-embedded or scanned). Text-embedded PDFs are best to eliminate the possibility of error in character extraction and location.
* For PDF and TIFF, up to 2000 pages can be processed (with a free tier subscription, only the first two pages are processed).
* The file size must be less than 500 MB for paid (S0) tier and 4 MB for free (F0) tier.
* Image dimensions must be between 50 x 50 pixels and 10,000 x 10,000 pixels.
* PDF dimensions are up to 17 x 17 inches, corresponding to Legal or A3 paper size, or smaller.
* The total size of the training data is 500 pages or less.
* If your PDFs are password-locked, you must remove the lock before submission.

> [!NOTE]
> The [Sample Labeling tool](https://fott-2-1.azurewebsites.net/) does not support the BMP file format. This is a limitation of the tool not the Form Recognizer Service.

## Supported languages and locales

>[!NOTE]
 > It's not necessary to specify a locale. This is an optional parameter. The Form Recognizer deep-learning technology will auto-detect the language of the text in your image.

| Model | Language—Locale code | Default |
|--------|:----------------------|:---------|
|Business card (v3.0 API)| <ul><li>English (United States)—en-US</li><li> English (Australia)—en-AU</li><li>English (Canada)—en-CA</li><li>English (United Kingdom)—en-GB</li><li>English (India)—en-IN</li><li>English (Japan)—en-JP</li><li>Japanese (Japan)—ja-JP</li></ul>  | Autodetected (en-US or ja-JP) |
|Business card (v2.1 API)| <ul><li>English (United States)—en-US</li><li> English (Australia)—en-AU</li><li>English (Canada)—en-CA</li><li>English (United Kingdom)—en-GB</li><li>English (India)—en-IN</li> | Autodetected |

## Field extractions

|Name| Type | Description |Standardized output |
|:-----|:----|:----|:----:|
| ContactNames | Array of objects | Contact name |  |
| FirstName | String | First (given) name of contact |  |
| LastName | String | Last (family) name of contact |  |
| CompanyNames | Array of strings | Company name(s)|  |
| Departments | Array of strings | Department(s) or organization(s) of contact |  |
| JobTitles | Array of strings | Listed Job title(s) of contact |  |
| Emails | Array of strings | Contact email address(es) |  |
| Websites | Array of strings | Company website(s) |  |
| Addresses | Array of strings | Address(es) extracted from business card | |
| MobilePhones | Array of phone numbers | Mobile phone number(s) from business card |+1 xxx xxx xxxx |
| Faxes | Array of phone numbers | Fax phone number(s) from business card | +1 xxx xxx xxxx |
| WorkPhones | Array of phone numbers | Work phone number(s) from business card | +1 xxx xxx xxxx |
| OtherPhones     | Array of phone numbers | Other phone number(s) from business card | +1 xxx xxx xxxx |

## Form Recognizer v3.0

 Form Recognizer v3.0 introduces several new features and capabilities.

* Follow our [**Form Recognizer v3.0 migration guide**](v3-migration-guide.md) to learn how to use the v3.0 version in your applications and workflows.

* Explore our [**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument) to learn more about the v3.0 version and new capabilities.

## Next steps

* Complete a Form Recognizer quickstart:

  > [!div class="nextstepaction"]
  > [Form Recognizer quickstart](/azure/applied-ai-services/form-recognizer/how-to-guides/v2-1-sdk-rest-api)

* Explore our REST API:

    > [!div class="nextstepaction"]
    > [Form Recognizer API v3.0](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)
