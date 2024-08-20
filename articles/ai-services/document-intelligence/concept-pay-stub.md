---
title: Document Intelligence (formerly Form Recognizer) pay stub model
titleSuffix: Azure AI services
description: Automate compensation and earnings information from pay slips and stubs.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: conceptual
ms.date: 08/07/2024
ms.author: admaheshwari
monikerRange: '>=doc-intel-4.0.0'
---

<!-- markdownlint-disable MD033 -->

# Document Intelligence pay stub model

The Document Intelligence pay stub model combines powerful Optical Character Recognition (OCR) capabilities with deep learning models to analyze and extract compensation and earnings data from pay slips. The API analyzes documents and files with payroll related information; extracts key information and returns a structured JSON data representation.

| Feature   | version| Model ID |
|----------  |---------|--------|
|Pay stub model|&bullet; v4.0:2024-07-31 (preview)|**`prebuilt-payStub.us`**|

## Try pay stub data extraction

Pay stubs are essential documents issued by employers to employees, providing earnings, deductions, and net pay information for a specific pay period. See how data is extracted using `prebuilt-payStub.us` model. You need the following resources:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* A [Document Intelligence instance](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, select **Go to resource** to get your key and endpoint.

    :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot of keys and endpoint location in the Azure portal.":::

## Document Intelligence Studio

1. On the [Document Intelligence Studio home page](https://documentintelligence.ai.azure.com/studio), select **payStub**.

1. You can analyze the sample pay stub or upload your own files.

1. Select the **Run analysis** button and, if necessary, configure the **Analyze options** :

## Input requirements

[!INCLUDE [input requirements](./includes/input-requirements.md)]

## Supported languages and locales

*See* our [Language Support](language-support-prebuilt.md) page for a complete list of supported languages.

## Field extractions

|Name| Type | Description |Standardized output |
|:-----|:----|:----|:----:|
|`EmployeeAddress`|`address`|Address of the employee|123 Maple Street, Springfield, IL, 62701|
|`EmployeeName`|`string`|Name of the employee|John A. Doe|
|`EmployeeSSN`|`string`|Social security number of the employee|123-45-6789|
|`EmployerAddress`|`address`|Address of the employer|456 Oak Avenue, Metropolis, NY, 10101|
|`EmployerName`|`string`|Listed name of the employer|Contoso Corporation|
|`PayDate`|`date`|Date of salary payment|Feb. 26, 2020|
|`PayPeriodStartDate`|`date`|Start date of the pay period|Feb. 19, 2020|
|`PayPeriodEndDate`|`date`|End date of the pay period|Feb. 25, 2020|
|`CurrentPeriodGrossPay`|`number`|Gross pay of the current period|$744.10|
|`YearToDateGrossPay`|`number`|Year-to-date gross pay|$2744.10|
|`CurrentPeriodTaxes`|`number`|Taxes of the current period|$410.10|
|`YearToDateTaxes`|`number`|Year-to-date taxes|$855.90|
|`CurrentPeriodDeductions`|`number`|Deductions of the current period|$410.10|
|`YearToDateDeductions`|`number`|Year-to-date deductions|$855.90|
|`CurrentPeriodNetPay`|`number`|Net pay of the current period|$744.10|
|`YearToDateNetPay`|`number`|Year-to-date net pay|$2744.10|

## Supported locales

The **prebuilt-payStub.us** version 2027-07-31-preview supports the **en-us** locale.

## Next steps

* Try processing your own forms and documents with the [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio)

* Complete a [Document Intelligence quickstart](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true) and get started creating a document processing app in the development language of your choice.
