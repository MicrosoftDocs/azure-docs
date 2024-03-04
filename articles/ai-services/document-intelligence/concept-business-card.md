---
title: Business card data extraction - Document Intelligence (formerly Form Recognizer)
titleSuffix: Azure AI services
description: OCR and machine learning based business card scanning in Document Intelligence extracts key data from business cards.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 07/18/2023
ms.author: lajanuar
monikerRange: '<=doc-intel-3.1.0'
---

<!-- markdownlint-disable MD033 -->

# Document Intelligence business card model

::: moniker range=">=doc-intel-3.0.0"
[!INCLUDE [applies to v3.1 and v3.0](includes/applies-to-v3-1-v3-0.md)]
::: moniker-end

::: moniker range="doc-intel-2.1.0"
[!INCLUDE [applies to v2.1](includes/applies-to-v2-1.md)]
::: moniker-end

The Document Intelligence business card model combines powerful Optical Character Recognition (OCR) capabilities with deep learning models to analyze and extract data from business card images. The API analyzes printed business cards; extracts key information such as first name, last name, company name, email address, and phone number;  and returns a structured JSON data representation.

## Business card data extraction

Business cards are a great way to represent a business or a professional. The company logo, fonts and background images found in business cards help promote the company branding and differentiate it from others. Applying OCR and machine-learning based techniques to automate scanning of business cards is a common image processing scenario. Enterprise systems used by sales and marketing teams typically have business card data extraction capability integration into for the benefit of their users.

::: moniker range=">=doc-intel-3.0.0"
***Sample business card processed with [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=businessCard)***

:::image type="content" source="media/studio/overview-business-card-studio.png" alt-text="Screenshot of a sample business card analyzed in the Document Intelligence Studio." lightbox="./media/overview-business-card.jpg":::

::: moniker-end

::: moniker range="doc-intel-2.1.0"

***Sample business processed with [Document Intelligence Sample Labeling tool](https://fott-2-1.azurewebsites.net/)***

:::image type="content" source="media/business-card-example.jpg" alt-text="Screenshot of a sample business card analyzed with the Document Intelligence Sample Labeling tool.":::

::: moniker-end

## Development options

::: moniker range=">=doc-intel-3.0.0"

Document Intelligence v3.0 supports the following tools:

| Feature | Resources | Model ID |
|----------|-------------|-----------|
|**Business card model**| <ul><li>[**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com)</li><li>[**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/AnalyzeDocument)</li><li>[**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</li><li>[**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</li><li>[**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</li><li>[**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</li></ul>|**prebuilt-businessCard**|

::: moniker-end

::: moniker range="doc-intel-2.1.0"

Document Intelligence v2.1 supports the following tools:

| Feature | Resources |
|----------|-------------------------|
|**Business card model**|  <ul><li>[**Document Intelligence labeling tool**](https://fott-2-1.azurewebsites.net/prebuilts-analyze)</li><li>[**REST API**](how-to-guides/use-sdk-rest-api.md?view=doc-intel-3.0.0&tabs=windows&pivots=programming-language-rest-api&preserve-view=true)</li><li>[**Client-library SDK**](~/articles/ai-services/document-intelligence/how-to-guides/use-sdk-rest-api.md?view=doc-intel-2.1.0&preserve-view=true)</li><li>[**Document Intelligence Docker container**](containers/install-run.md?tabs=business-card#run-the-container-with-the-docker-compose-up-command)</li></ul>|

::: moniker-end

### Try business card data extraction

See how data, including name, job title, address, email, and company name, is extracted from business cards. You need the following resources:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* An [Form Recognizer instance (Document Intelligence forthcoming)](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, select **Go to resource** to get your key and endpoint.

 :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot of keys and endpoint location in the Azure portal.":::

::: moniker range=">=doc-intel-3.0.0"

#### Document Intelligence Studio

> [!NOTE]
> Document Intelligence Studio is available with v3.1 and v3.0 APIs.

1. On the Document Intelligence Studio home page, select **Business cards**.

1. You can analyze the sample business card or select the **+ Add** button to upload your own sample.

1. Select the **Analyze** button:

    :::image type="content" source="media/studio/business-card-analyze.png" alt-text="Screenshot of analyze business card menu.":::

    > [!div class="nextstepaction"]
    > [Try Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=businessCard)

::: moniker-end

::: moniker range="doc-intel-2.1.0"

## Document Intelligence Sample Labeling tool

1. Navigate to the [Document Intelligence Sample Tool](https://fott-2-1.azurewebsites.net/).

1. On the sample tool home page, select the **Use prebuilt model to get data** tile.

    :::image type="content" source="media/label-tool/prebuilt-1.jpg" alt-text="Screenshot of the layout model analyze results operation.":::

1. Select the **Form Type**  to analyze from the dropdown menu.

1. Choose a URL for the file you would like to analyze from the below options:

    * [**Sample invoice document**](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/invoice_sample.jpg).
    * [**Sample ID document**](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/DriverLicense.png).
    * [**Sample receipt image**](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/contoso-allinone.jpg).
    * [**Sample business card image**](https://raw.githubusercontent.com/Azure/azure-sdk-for-python/master/sdk/formrecognizer/azure-ai-formrecognizer/samples/sample_forms/business_cards/business-card-english.jpg).

1. In the **Source** field, select **URL** from the dropdown menu, paste the selected URL, and select the **Fetch** button.

    :::image type="content" source="media/label-tool/fott-select-url.png" alt-text="Screenshot of source location dropdown menu.":::

1. In the **Document Intelligence service endpoint** field, paste the endpoint that you obtained with your Document Intelligence subscription.

1. In the **key** field, paste  the key you obtained from your Document Intelligence resource.

    :::image type="content" source="media/fott-select-form-type.png" alt-text="Screenshot of the select-form-type dropdown menu.":::

1. Select **Run analysis**. The Document Intelligence Sample Labeling tool calls the Analyze Prebuilt API and analyze the document.

1. View the results - see the key-value pairs extracted, line items, highlighted text extracted and tables detected.

    :::image type="content" source="media/business-card-results.png" alt-text="Screenshot of the business card model analyze results operation.":::

> [!NOTE]
> The [Sample Labeling tool](https://fott-2-1.azurewebsites.net/) does not support the BMP file format. This is a limitation of the tool not the Document Intelligence Service.

::: moniker-end

## Input requirements

::: moniker range=">=doc-intel-3.0.0"

[!INCLUDE [input requirements](./includes/input-requirements.md)]

::: moniker-end

::: moniker range="doc-intel-2.1.0"

* Supported file formats: JPEG, PNG, PDF, and TIFF
* For PDF and TIFF, up to 2000 pages are processed. For free tier subscribers, only the first two pages are processed.
* The file size must be less than 50 MB and dimensions at least 50 x 50 pixels and at most 10,000 x 10,000 pixels.

::: moniker-end

::: moniker range=">=doc-intel-3.0.0"

## Supported languages and locales

>[!NOTE]
> It's not necessary to specify a locale. This is an optional parameter. The Document Intelligence deep-learning technology will auto-detect the language of the text in your image.

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

::: moniker-end

::: moniker range="doc-intel-2.1.0"

### Fields extracted

|Name| Type | Description | Text |
|:-----|:----|:----|:----|
| ContactNames | array of objects | Contact name extracted from business card | [{ "FirstName": "John"`,` "LastName": "Doe" }] |
| FirstName | string | First (given) name of contact | "John" |
| LastName | string | Last (family) name of contact |     "Doe" |
| CompanyNames | array of strings | Company name extracted from business card | ["Contoso"] |
| Departments | array of strings | Department or organization of contact | ["R&D"] |
| JobTitles | array of strings | Listed Job title of contact | ["Software Engineer"] |
| Emails | array of strings | Contact email extracted from business card | ["johndoe@contoso.com"] |
| Websites | array of strings | Website extracted from business card | ["https://www.contoso.com"] |
| Addresses | array of strings | Address extracted from business card | ["123 Main Street, Redmond, WA 98052"] |
| MobilePhones | array of phone numbers | Mobile phone number extracted from business card | ["+19876543210"] |
| Faxes | array of phone numbers | Fax phone number extracted from business card | ["+19876543211"] |
| WorkPhones | array of phone numbers | Work phone number extracted from business card | ["+19876543231"] |
| OtherPhones     | array of phone numbers | Other phone number extracted from business card | ["+19876543233"] |

## Supported locales

**Prebuilt business cards v2.1** supports the following locales:

* **en-us**
* **en-au**
* **en-ca**
* **en-gb**
* **en-in**

### Migration guide and REST API v3.1

* Follow our [**Document Intelligence v3.1 migration guide**](v3-1-migration-guide.md) to learn how to use the v3.0 version in your applications and workflows.

::: moniker-end

## Next steps

::: moniker range=">=doc-intel-3.0.0"

* Try processing your own forms and documents with the [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio)

* Complete a [Document Intelligence quickstart](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true) and get started creating a document processing app in the development language of your choice.

::: moniker-end

::: moniker range="doc-intel-2.1.0"

* Try processing your own forms and documents with the [Document Intelligence Sample Labeling tool](https://fott-2-1.azurewebsites.net/)

* Complete a [Document Intelligence quickstart](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-2.1.0&preserve-view=true) and get started creating a document processing app in the development language of your choice.

::: moniker-end
