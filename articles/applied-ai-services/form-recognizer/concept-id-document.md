---
title: Identity document (ID) processing – Form Recognizer
titleSuffix: Azure Applied AI Services
description: Automate identity document (ID) processing of driver licenses, passports, and more with Form Recognizer.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 03/03/2023
ms.author: lajanuar
recommendations: false
ms.custom: references.regions
---
<!-- markdownlint-disable MD033 -->

# Azure Form Recognizer identity document model

::: moniker range="form-recog-3.0.0"
[!INCLUDE [applies to v3.0](includes/applies-to-v3-0.md)]
::: moniker-end

::: moniker range="form-recog-2.1.0"
[!INCLUDE [applies to v2.1](includes/applies-to-v2-1.md)]
::: moniker-end

::: moniker range="form-recog-3.0.0"

Form Recognizer Identity document (ID) model combines Optical Character Recognition (OCR) with deep learning models to analyze and extract key information from identity documents. The API analyzes identity documents (including the following) and returns a structured JSON data representation:

* US Drivers Licenses (all 50 states and District of Columbia)
* International passport biographical pages
* US state IDs
* Social Security cards
* Permanent resident cards

::: moniker-end

::: moniker range="form-recog-2.1.0"

Azure Form Recognizer can analyze and extract information from government-issued identification documents (IDs) using its prebuilt IDs model. It combines our powerful [Optical Character Recognition (OCR)](../../cognitive-services/computer-vision/overview-ocr.md) capabilities with ID recognition capabilities to extract key information from Worldwide Passports and U.S. Driver's Licenses (all 50 states and D.C.). The IDs API extracts key information from these identity documents, such as first name, last name, date of birth, document number, and more. This API is available in the Form Recognizer v2.1 as a cloud service. 

::: moniker-end

## Identity document processing

Identity document processing involves extracting data from identity documents either manually or by using OCR-based technology. ID document is processing an important step in any business process that requires some proof of identity. Examples include customer verification in banks and other financial institutions, mortgage applications, medical visits, claim processing, hospitality industry, and more. Individuals provide some proof of their identity via driver licenses, passports, and other similar documents so that the business can efficiently verify them before providing services and benefits.

::: moniker range="form-recog-3.0.0"

***Sample U.S. Driver's License processed with [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=idDocument)***

:::image type="content" source="media/studio/analyze-drivers-license.png" alt-text="Image of a sample driver's license.":::

::: moniker-end

::: moniker range="form-recog-2.1.0"

## Data extraction

The prebuilt IDs service extracts the key values from worldwide passports and U.S. Driver's Licenses and returns them in an organized structured JSON response.

### **Driver's license example**

![Sample Driver's License](./media/id-example-drivers-license.JPG)

### **Passport example**

![Sample Passport](./media/id-example-passport-result.JPG)

::: moniker-end

## Development options

::: moniker range="form-recog-3.0.0"
Form Recognizer v3.0 supports the following tools:

| Feature | Resources | Model ID |
|----------|-------------|-----------|
|**ID document model**|<ul><li> [**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com)</li><li>[**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)</li><li>[**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li><li>[**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li><li>[**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li><li>[**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li></ul>|**prebuilt-idDocument**|
::: moniker-end

::: moniker range="form-recog-2.1.0"

Form Recognizer v2.1 supports the following tools:

| Feature | Resources |
|----------|-------------------------|
|**ID document model**| <ul><li>[**Form Recognizer labeling tool**](https://fott-2-1.azurewebsites.net/prebuilts-analyze)</li><li>[**REST API**](./how-to-guides/use-sdk-rest-api.md?pivots=programming-language-rest-api&preserve-view=true&tabs=windows&view=form-recog-2.1.0#analyze-identity-id-documents)</li><li>[**Client-library SDK**](/azure/applied-ai-services/form-recognizer/how-to-guides/v2-1-sdk-rest-api)</li><li>[**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?tabs=id-document#run-the-container-with-the-docker-compose-up-command)</li></ul>|
::: moniker-end

## Input requirements

::: moniker range="form-recog-3.0.0"

[!INCLUDE [input requirements](./includes/input-requirements.md)]

::: moniker-end

::: moniker range="form-recog-2.1.0"

* Supported file formats: JPEG, PNG, PDF, and TIFF
* Form Recognizer processes PDF and TIFF files up to 2000 pages or only the first two pages for free-tier subscribers.
* The file size must be less than 50 MB and dimensions at least 50 x 50 pixels and at most 10,000 x 10,000 pixels.

::: moniker-end

### Try Form Recognizer

Extract data, including name, birth date, and expiration date, from ID documents. You need the following resources:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* A [Form Recognizer instance](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, select **Go to resource** to get your key and endpoint.

 :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

::: moniker range="form-recog-3.0.0"

## Form Recognizer Studio

> [!NOTE]
> Form Recognizer studio is available with the v3.0 API (API version 2022-08-31 generally available (GA) release)

1. On the Form Recognizer Studio home page, select **Identity documents**

1. You can analyze the sample invoice or select the **+ Add** button to upload your own sample.

1. Select the **Analyze** button:

    :::image type="content" source="media/studio/id-document-analyze.png" alt-text="Screenshot: analyze ID document menu.":::

    > [!div class="nextstepaction"]
    > [Try Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=idDocument)
::: moniker-end

::: moniker range="form-recog-2.1.0"

## Form Recognizer Sample Labeling tool

1. Navigate to the [Form Recognizer Sample Tool](https://fott-2-1.azurewebsites.net/).

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

1. In the **Form recognizer service endpoint** field, paste the endpoint that you obtained with your Form Recognizer subscription.

1. In the **key** field, paste  the key you obtained from your Form Recognizer resource.

    :::image type="content" source="media/fott-select-form-type.png" alt-text="Screenshot: select document type dropdown menu.":::

1. Select **Run analysis**. The Form Recognizer Sample Labeling tool calls the Analyze Prebuilt API and analyzes the document.

1. View the results - see the key-value pairs extracted, line items, highlighted text extracted and tables detected.

    :::image type="content" source="media/id-example-drivers-license.jpg" alt-text="Screenshot of the identity model analyze results operation.":::

1. Download the JSON output file to view the detailed results.

    * The "readResults" node contains every line of text with its respective bounding box placement on the page.
    * The "selectionMarks" node shows every selection mark (checkbox, radio mark) and whether its status is "selected" or "unselected".
    * The "pageResults" section includes the tables extracted. For each table, Form Recognizer extracts the text, row, and column index, row and column spanning, bounding box, and more.
    * The "documentResults" field contains key/value pairs information and line items information for the most relevant parts of the document.

> [!NOTE]
> The [Sample Labeling tool](https://fott-2-1.azurewebsites.net/) does not support the BMP file format. This is a limitation of the tool not the Form Recognizer Service.

::: moniker-end

::: moniker range="form-recog-3.0.0"

## Supported document types

| Region | Document Types |
|--------|----------------|
|Worldwide|Passport Book, Passport Card|
|`United States (US)`|Driver License, Identification Card, Residency Permit (Green card), Social Security Card, Military ID|
|`India (IN)`|Driver License, PAN Card, Aadhaar Card|
|`Canada (CA)`|Driver License, Identification Card, Residency Permit (Maple Card)|
|`United Kingdom (GB)`|Driver License, National Identity Card|
|`Australia (AU)`|Driver License, Photo Card, Key-pass ID (including digital version)|

## Field extractions

The following are the fields extracted per document type. The Azure Form Recognizer ID model `prebuilt-idDocument` extracts the following fields in the `documents.*.fields`. The json output includes all the extracted text in the documents, words, lines, and styles.

>[!NOTE]
>
> In addition to specifying the IdDocument model, you can designate the ID type for (driver license, passport, national identity card, residence permit, or US social security card ).

### Data extraction (all types)

|**Model ID** | **Text extraction** | **Language detection** | **Selection Marks** | **Tables** | **Paragraphs** | **Structure** |**Key-Value pairs** | **Fields** |
|:-----|:----:|:----:|:----:|:----:|:----:|:----:|:----:|:----:|
|[prebuilt-idDocument](concept-id-document.md#field-extractions) | ✓ |   |   |  | ✓ |   |  | ✓ |

### Document types

#### `idDocument.driverLicense` fields extracted

| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`CountryRegion`|`countryRegion`|Country or region code|USA|
|`Region`|`string`|State or province|Washington|
|`DocumentNumber`|`string`|Driver license number|WDLABCD456DG|
|`DocumentDiscriminator`|`string`|Driver license document discriminator|12645646464554646456464544|
|`FirstName`|`string`|Given name and middle initial if applicable|LIAM R.|
|`LastName`|`string`|Surname|TALBOT|
|`Address`|`address`|Address|123 STREET ADDRESS YOUR CITY WA 99999-1234|
|`DateOfBirth`|`date`|Date of birth|01/06/1958|
|`DateOfExpiration`|`date`|Date of expiration|08/12/2020|
|`DateOfIssue`|`date`|Date of issue|08/12/2012|
|`EyeColor`|`string`|Eye color|BLU|
|`HairColor`|`string`|Hair color|BRO|
|`Height`|`string`|Height|5'11"|
|`Weight`|`string`|Weight|185LB|
|`Sex`|`string`|Sex|M|
|`Endorsements`|`string`|Endorsements|L|
|`Restrictions`|`string`|Restrictions|B|
|`VehicleClassifications`|`string`|Vehicle classification|D|

#### `idDocument.passport` fields extracted

| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`DocumentNumber`|`string`|Passport number|340020013|
|`FirstName`|`string`|Given name and middle initial if applicable|JENNIFER|
|`MiddleName`|`string`|Name between given name and surname|REYES|
|`LastName`|`string`|Surname|BROOKS|
|`Aliases`|`array`|||
|`Aliases.*`|`string`|Also known as|MAY LIN|
|`DateOfBirth`|`date`|Date of birth|1980-01-01|
|`DateOfExpiration`|`date`|Date of expiration|2019-05-05|
|`DateOfIssue`|`date`|Date of issue|2014-05-06|
|`Sex`|`string`|Sex|F|
|`CountryRegion`|`countryRegion`|Issuing country or organization|USA|
|`DocumentType`|`string`|Document type|P|
|`Nationality`|`countryRegion`|Nationality|USA|
|`PlaceOfBirth`|`string`|Place of birth|MASSACHUSETTS, U.S.A.|
|`PlaceOfIssue`|`string`|Place of issue|LA PAZ|
|`IssuingAuthority`|`string`|Issuing authority|United States Department of State|
|`PersonalNumber`|`string`|Personal ID. No.|A234567893|
|`MachineReadableZone`|`object`|Machine readable zone (MRZ)|P<USABROOKS<<JENNIFER<<<<<<<<<<<<<<<<<<<<<<< 3400200135USA8001014F1905054710000307<715816|
|`MachineReadableZone.FirstName`|`string`|Given name and middle initial if applicable|JENNIFER|
|`MachineReadableZone.LastName`|`string`|Surname|BROOKS|
|`MachineReadableZone.DocumentNumber`|`string`|Passport number|340020013|
|`MachineReadableZone.CountryRegion`|`countryRegion`|Issuing country or organization|USA|
|`MachineReadableZone.Nationality`|`countryRegion`|Nationality|USA|
|`MachineReadableZone.DateOfBirth`|`date`|Date of birth|1980-01-01|
|`MachineReadableZone.DateOfExpiration`|`date`|Date of expiration|2019-05-05|
|`MachineReadableZone.Sex`|`string`|Sex|F|

#### `idDocument.nationalIdentityCard` fields extracted

| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`CountryRegion`|`countryRegion`|Country or region code|USA|
|`Region`|`string`|State or province|Washington|
|`DocumentNumber`|`string`|National identity card number|WDLABCD456DG|
|`DocumentDiscriminator`|`string`|National identity card document discriminator|12645646464554646456464544|
|`FirstName`|`string`|Given name and middle initial if applicable|LIAM R.|
|`LastName`|`string`|Surname|TALBOT|
|`Address`|`address`|Address|123 STREET ADDRESS YOUR CITY WA 99999-1234|
|`DateOfBirth`|`date`|Date of birth|01/06/1958|
|`DateOfExpiration`|`date`|Date of expiration|08/12/2020|
|`DateOfIssue`|`date`|Date of issue|08/12/2012|
|`EyeColor`|`string`|Eye color|BLU|
|`HairColor`|`string`|Hair color|BRO|
|`Height`|`string`|Height|5'11"|
|`Weight`|`string`|Weight|185LB|
|`Sex`|`string`|Sex|M|

#### `idDocument.residencePermit` fields extracted

| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`CountryRegion`|`countryRegion`|Country or region code|USA|
|`DocumentNumber`|`string`|Residence permit number|WDLABCD456DG|
|`FirstName`|`string`|Given name and middle initial if applicable|LIAM R.|
|`LastName`|`string`|Surname|TALBOT|
|`DateOfBirth`|`date`|Date of birth|01/06/1958|
|`DateOfExpiration`|`date`|Date of expiration|08/12/2020|
|`DateOfIssue`|`date`|Date of issue|08/12/2012|
|`Sex`|`string`|Sex|M|
|`PlaceOfBirth`|`string`|Place of birth|Germany|
|`Category`|`string`|Permit category|DV2|

#### `idDocument.usSocialSecurityCard` fields extracted

| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`DocumentNumber`|`string`|Social security card number|WDLABCD456DG|
|`FirstName`|`string`|Given name and middle initial if applicable|LIAM R.|
|`LastName`|`string`|Surname|TALBOT|
|`DateOfIssue`|`date`|Date of issue|08/12/2012|

#### `idDocument` fields extracted

| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`Address`|`address`|Address|123 STREET ADDRESS YOUR CITY WA 99999-1234|
|`DocumentNumber`|`string`|Driver license number|WDLABCD456DG|
|`FirstName`|`string`|Given name and middle initial if applicable|LIAM R.|
|`LastName`|`string`|Surname|TALBOT|
|`DateOfBirth`|`date`|Date of birth|01/06/1958|
|`DateOfExpiration`|`date`|Date of expiration|08/12/2020|

::: moniker-end

::: moniker range="form-recog-2.1.0"

## Supported document types and locales

 **Prebuilt ID v2.1** extracts key values from worldwide passports, and U.S. Driver's Licenses in the **en-us** locale.

## Fields extracted

|Name| Type | Description | Value |
|:-----|:----|:----|:----|
|  Country | country | Country code compliant with ISO 3166 standard | "USA" |
|  DateOfBirth | date | DOB in YYYY-MM-DD format | "1980-01-01" |
|  DateOfExpiration | date | Expiration date in YYYY-MM-DD format | "2019-05-05" |
|  DocumentNumber | string | Relevant passport number, driver's license number, etc. | "340020013" |
|  FirstName | string | Extracted given name and middle initial if applicable | "JENNIFER" |
|  LastName | string | Extracted surname | "BROOKS" |
|  Nationality | country | Country code compliant with ISO 3166 standard | "USA" |
|  Sex | gender | Possible extracted values include "M", "F" and "X" | "F" |
|  MachineReadableZone | object | Extracted Passport MRZ including two lines of 44 characters each | "P<USABROOKS<<JENNIFER<<<<<<<<<<<<<<<<<<<<<<< 3400200135USA8001014F1905054710000307<715816" |
|  DocumentType | string | Document type, for example, Passport, Driver's License | "passport" |
|  Address | string | Extracted address (Driver's License only) | "123 STREET ADDRESS YOUR CITY WA 99999-1234"|
|  Region | string | Extracted region, state, province, etc. (Driver's License only) | "Washington" |

### Migration guide

* Follow our [**Form Recognizer v3.0 migration guide**](v3-migration-guide.md) to learn how to use the v3.0 version in your applications and workflows.

::: moniker-end

## Next steps

::: moniker range="form-recog-3.0.0"

* Try processing your own forms and documents with the [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio)

* Complete a [Form Recognizer quickstart](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true) and get started creating a document processing app in the development language of your choice.

::: moniker-end

::: moniker range="form-recog-2.1.0"

* Try processing your own forms and documents with the [Form Recognizer Sample Labeling tool](https://fott-2-1.azurewebsites.net/)

* Complete a [Form Recognizer quickstart](quickstarts/get-started-sdks-rest-api.md?view=form-recog-2.1.0&preserve-view=true) and get started creating a document processing app in the development language of your choice.

::: moniker-end