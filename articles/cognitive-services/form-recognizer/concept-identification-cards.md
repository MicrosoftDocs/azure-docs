---
title: IDs - Form Recognizer
titleSuffix: Azure Cognitive Services
description: Learn concepts related to data extraction from identity documents with the Form Recognizer Pre-built IDs API.
services: cognitive-services
author: laujan
manager: nitinme

ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 04/14/2021
ms.author: lajanuar
---

# Form Recognizer prebuilt identification (ID) document model

Azure Form Recognizer can analyze and extract information from government-issued identification documents (IDs) using its prebuilt IDs model. It combines our powerful [Optical Character Recognition (OCR)](../computer-vision/overview-ocr.md) capabilities with ID recognition capabilities to extract key information from Worldwide Passports and U.S. Driver's Licenses (all 50 states and D.C.). The IDs API extracts key information from these identity documents, such as first name, last name, date of birth, document number, and more. This API is available in the Form Recognizer v2.1 preview as a cloud service and as an on-premise container.

## What does the ID service do?

The prebuilt IDs service extracts the key values from worldwide passports and U.S. Driver's Licenses and returns them in an organized structured JSON response.

### **Driver's license example**

![Sample Driver's License](./media/id-example-drivers-license.JPG)

### **Passport example**

![Sample Passport](./media/id-example-passport-result.JPG)

### Fields extracted

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

### Additional features

The IDs API also returns the following information:

* Field confidence level (each field returns an associated confidence value)
* OCR raw text (OCR-extracted text output for the entire receipt)
* Bounding box of each extracted field in U.S. Driver's Licenses
* Bounding box for Machine Readable Zone (MRZ) on Passports

  > [!NOTE]
  > Pre-built IDs does not detect ID authenticity
  >
  > Form Recognizer Pre-built IDs extracts key data from ID data. However, it does not detect the validity or authenticity of the original identity document.

## Try it out

To try out the Form Recognizer IDs service, go to the online Sample UI Tool:

> [!div class="nextstepaction"]
> [Try Prebuilt Models](https://fott-preview.azurewebsites.net/)

## Input requirements

[!INCLUDE [input requirements](./includes/input-requirements-receipts.md)]

## Supported ID types

* **Pre-built IDs v2.1-preview.3** Extracts key values from worldwide passports, and U.S. Driver's Licenses.

  > [!NOTE]
  > ID type support
  >
  > Currently supported ID types include worldwide passport and U.S. Driver's Licenses. We are actively seeking to expand our ID support to other identity documents around the world.

## POST Analyze Id Document

The [Analyze ID](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1-preview-3/operations/5f74a7daad1f2612c46f5822) operation takes an image or PDF of an ID as the input and extracts the values of interest. The call returns a response header field called `Operation-Location`. The `Operation-Location` value is a URL that contains the Result ID to be used in the next step.

|Response header| Result URL |
|:-----|:----|
|Operation-Location | `https://cognitiveservice/formrecognizer/v2.1-preview.3/prebuilt/idDocument/analyzeResults/49a36324-fc4b-4387-aa06-090cfbf0064f` |

## GET Analyze Id Document Result

<!---
Need to update this with updated APIM links when available
-->

The second step is to call the [**Get Analyze idDocument Result**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1-preview-3/operations/GetAnalyzeFormResult) operation. This operation takes as input the Result ID that was created by the Analyze ID operation. It returns a JSON response that contains a **status** field with the following possible values. You call this operation iteratively until it returns with the **succeeded** value. Use an interval of 3 to 5 seconds to avoid exceeding the requests per second (RPS) rate.

|Field| Type | Possible values |
|:-----|:----:|:----|
|status | string | notStarted: The analysis operation has not started. |
| |  | running: The analysis operation is in progress. |
| |  | failed: The analysis operation has failed. |
| |  | succeeded: The analysis operation has succeeded. |

When the **status** field has the **succeeded** value, the JSON response will include the receipt understanding and text recognition results. The IDs result are organized as a dictionary of named field values, where each value contains the extracted text, normalized value, bounding box, confidence, and corresponding word elements. The text recognition result is organized as a hierarchy of lines and words, with text, bounding box and confidence information.

![sample receipt results](./media/id-example-passport-result.JPG)

### Sample JSON output

See the following example of a successful JSON response:
The `readResults` node contains all of the recognized text. Text is organized by page, then by line, then by individual words. The `documentResults` node contains the ID values that the model discovered. This node is also where you'll find useful key/value pairs like the first name, last name, document number, and more.

```json
{
   "status": "succeeded",
  "createdDateTime": "2021-03-04T22:29:33Z",
  "lastUpdatedDateTime": "2021-03-04T22:29:36Z",
  "analyzeResult": {
    "version": "2.1.0",
    "readResults": [
     {
        "page": 1,
        "angle": 0.3183,
        "width": 549,
        "height": 387,
        "unit": "pixel",
        "lines": [
          {
            "text": "PASSPORT",
            "boundingBox": [
              57,
              10,
              120,
              11,
              119,
              22,
              57,
              22
            ],
            "words": [
              {
                "text": "PASSPORT",
                "boundingBox": [
                  57,
                  11,
                  119,
                  11,
                  118,
                  23,
                  57,
                  22
                ],
                "confidence": 0.994
              }
            ],
          ...
      }
    ],

     "documentResults": [
      {
        "docType": "prebuilt:idDocument:passport",
        "docTypeConfidence": 0.995,
        "pageRange": [
          1,
          1
        ],
        "fields": {
          "Country": {
            "type": "country",
            "valueCountry": "USA",
            "text": "USA"
          },
          "DateOfBirth": {
            "type": "date",
            "valueDate": "1980-01-01",
            "text": "800101"
          },
          "DateOfExpiration": {
            "type": "date",
            "valueDate": "2019-05-05",
            "text": "190505"
          },
          "DocumentNumber": {
            "type": "string",
            "valueString": "340020013",
            "text": "340020013"
          },
          "FirstName": {
            "type": "string",
            "valueString": "JENNIFER",
            "text": "JENNIFER"
          },
          "LastName": {
            "type": "string",
            "valueString": "BROOKS",
            "text": "BROOKS"
          },
          "Nationality": {
            "type": "country",
            "valueCountry": "USA",
            "text": "USA"
          },
          "Sex": {
            "type": "gender",
            "valueGender": "F",
            "text": "F"
          },
          "MachineReadableZone": {
            "type": "object",
            "text": "P<USABROOKS<<JENNIFER<<<<<<<<<<<<<<<<<<<<<<< 3400200135USA8001014F1905054710000307<715816",
            "boundingBox": [
              16,
              314.1,
              504.2,
              317,
              503.9,
              363,
              15.7,
              360.1
            ],
            "page": 1,
            "confidence": 0.384,
            "elements": [
              "#/readResults/0/lines/33/words/0",
              "#/readResults/0/lines/33/words/1",
              "#/readResults/0/lines/33/words/2",
              "#/readResults/0/lines/33/words/3",
              "#/readResults/0/lines/33/words/4",
              "#/readResults/0/lines/34/words/0"
            ]
          },
          "DocumentType": {
            "type": "string",
            "text": "passport",
            "confidence": 0.995
          }
        }
      }
    ]
  }
}
```

## Next steps

* Try your own IDs and samples in the [Form Recognizer Sample UI](https://fott-preview.azurewebsites.net/).
* Complete a [Form Recognizer quickstart](quickstarts/client-library.md) to get started writing an ID processing app with Form Recognizer in the development language of your choice.

## See also

* [**What is Form Recognizer?**](./overview.md)
* [**REST API reference docs**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1-preview-3/operations/AnalyzeWithCustomForm)
