---
title: Form Recognizer ID document model
titleSuffix: Azure Applied AI Services
description: Concepts related to data extraction and analysis using the prebuilt ID document model
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

# Form Recognizer ID document model

[!INCLUDE [applies to v3.0 and v2.1](includes/applies-to-v3-0-and-v2-1.md)]

The ID document model combines Optical Character Recognition (OCR) with deep learning models to analyze and extract key information from US Drivers Licenses (all 50 states and District of Columbia), international passport biographical pages, US state IDs, social security cards, and permanent resident (green) cards. The API analyzes identity documents, extracts key information, and returns a structured JSON data representation.

***Sample U.S. Driver's License processed with [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=idDocument)***

:::image type="content" source="media/studio/analyze-drivers-license.png" alt-text="Image of a sample driver's license.":::

## Development options

The following tools are supported by Form Recognizer v3.0:

| Feature | Resources | Model ID |
|----------|-------------|-----------|
|**ID document model**|<ul><li> [**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com)</li><li>[**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)</li><li>[**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li><li>[**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li><li>[**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li><li>[**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li></ul>|**prebuilt-idDocument**|

The following tools are supported by Form Recognizer v2.1:

| Feature | Resources |
|----------|-------------------------|
|**ID document model**| <ul><li>[**Form Recognizer labeling tool**](https://fott-2-1.azurewebsites.net/prebuilts-analyze)</li><li>[**REST API**](quickstarts/try-sdk-rest-api.md?pivots=programming-language-rest-api#analyze-identity-id-documents)</li><li>[**Client-library SDK**](quickstarts/try-sdk-rest-api.md)</li><li>[**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?tabs=id-document#run-the-container-with-the-docker-compose-up-command)</li></ul>|

### Try Form Recognizer

Extract data, including name, birth date, machine-readable zone, and expiration date, from ID documents using the Form Recognizer Studio. You'll need the following resources:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* A [Form Recognizer instance](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, select **Go to resource** to get your key and endpoint.

 :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

#### Form Recognizer Studio 

> [!NOTE]
> Form Recognizer studio is available with the v3.0 API (API version 2022-08-31 generally available (GA) release)

1. On the Form Recognizer Studio home page, select **Identity documents**

1. You can analyze the sample invoice or select the **+ Add** button to upload your own sample.

1. Select the **Analyze** button:

    :::image type="content" source="media/studio/id-document-analyze.png" alt-text="Screenshot: analyze ID document menu.":::

    > [!div class="nextstepaction"]
    > [Try Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=idDocument)

## Input requirements

[!INCLUDE [input requirements](./includes/input-requirements.md)]

## Supported languages and locales

| Model | Language—Locale code | Default |
|--------|:----------------------|:---------|
|ID document| <ul><li>English (United States)—en-US (driver's license)</li><li>Biographical pages from international passports</br> (excluding visa and other travel documents)</li><li>English (United States)—en-US (state ID)</li><li>English (United States)—en-US (social security card)</li><li>English (United States)—en-US (Green card)</li></ul></br>|English (United States)—en-US|

## Field extractions

|Name| Type | Description | Standardized output|
|:-----|:----|:----|:----|
|  CountryRegion | countryRegion | Country or region code compliant with ISO 3166 standard |  |
|  DateOfBirth | Date | DOB | yyyy-mm-dd |
|  DateOfExpiration | Date | Expiration date DOB | yyyy-mm-dd |
|  DocumentNumber | String | Relevant passport number, driver's license number, etc. |  |
|  FirstName | String | Extracted given name and middle initial if applicable |  |
|  LastName | String | Extracted surname |  |
|  Nationality | countryRegion | Country or region code compliant with ISO 3166 standard (Passport only) |  |
|  Sex | String | Possible extracted values include "M", "F" and "X" | |
|  MachineReadableZone | Object | Extracted Passport MRZ including two lines of 44 characters each | "P<USABROOKS<<JENNIFER<<<<<<<<<<<<<<<<<<<<<<< 3400200135USA8001014F1905054710000307<715816" |
|  DocumentType | String | Document type, for example, Passport, Driver's License | "passport" |
|  Address | String | Extracted address (Driver's License only) ||
|  Region | String | Extracted region, state, province, etc. (Driver's License only) |  |

## Form Recognizer v3.0

 The Form Recognizer v3.0 introduces several new features and capabilities:

* **ID document (v3.0)** prebuilt model supports extraction of endorsement, restriction, and vehicle class codes from US driver's licenses.

* The ID Document **2022-06-30** and later releases support the following data extraction from US driver's licenses:

  * Date issued
  * Height
  * Weight
  * Eye color
  * Hair color
  * Document discriminator security code

### ID document field extractions

|Name| Type | Description | Standardized output|
|:-----|:----|:----|:----|
|  DateOfIssue | Date | Issue date  | yyyy-mm-dd |
|  Height | String | Height of the holder.  | |
|  Weight | String | Weight of the holder.  | |
|  EyeColor | String | Eye color of the holder.  | |
|  HairColor | String | Hair color of the holder.  | |
|  DocumentDiscriminator | String | Document discriminator is a security code that identifies where and when the license was issued.  | |
| Endorsements | String | More driving privileges granted to a driver such as Motorcycle or School bus.  | |
| Restrictions | String | Restricted driving privileges applicable to suspended or revoked licenses.| |
| VehicleClassification | String | Types of vehicles that can be driven by a driver. ||
|  CountryRegion | countryRegion | Country or region code compliant with ISO 3166 standard |  |
|  DateOfBirth | Date | DOB | yyyy-mm-dd |
|  DateOfExpiration | Date | Expiration date DOB | yyyy-mm-dd |
|  DocumentNumber | String | Relevant passport number, driver's license number, etc. |  |
|  FirstName | String | Extracted given name and middle initial if applicable |  |
|  LastName | String | Extracted surname |  |
|  Nationality | countryRegion | Country or region code compliant with ISO 3166 standard (Passport only) |  |
|  Sex | String | Possible extracted values include "M", "F" and "X" | |
|  MachineReadableZone | Object | Extracted Passport MRZ including two lines of 44 characters each | "P<USABROOKS<<JENNIFER<<<<<<<<<<<<<<<<<<<<<<< 3400200135USA8001014F1905054710000307<715816" |
|  DocumentType | String | Document type, for example, Passport, Driver's License, Social security card and more | "passport" |
|  Address | String | Extracted address, address is also parsed to its components - address, city, state, country, zip code ||
|  Region | String | Extracted region, state, province, etc. (Driver's License only) |  |

### Migration guide and REST API v3.0

* Follow our [**Form Recognizer v3.0 migration guide**](v3-migration-guide.md) to learn how to use the v3.0 version in your applications and workflows.

* Explore our [**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument) to learn more about the v3.0 version and new capabilities.

## Next steps

* Complete a Form Recognizer quickstart:

  > [!div class="nextstepaction"]
  > [Form Recognizer quickstart](quickstarts/try-sdk-rest-api.md)

* Explore our REST API:

    > [!div class="nextstepaction"]
    > [Form Recognizer API v3.0](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)
