---
title: Bank statement US extraction model - Document Intelligence (formerly Form Recognizer)
titleSuffix: Azure AI services
description: OCR and machine learning based bank statement US extraction in Document Intelligence extracts key data from bank statements.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: conceptual
ms.date: 08/07/2024
ms.author: lajanuar
ms.custom: references_regions
monikerRange: '>=doc-intel-4.0.0'
---

<!-- markdownlint-disable MD033 -->

# Document Intelligence bank statement model

The Document Intelligence bank statement model combines powerful Optical Character Recognition (OCR) capabilities with deep learning models to analyze and extract data from US bank statements. The API analyzes printed bank statements; extracts key information such as account number, bank details, statement details, transaction details, and fees;  and returns a structured JSON data representation.

| Feature   | version| Model ID |
|----------  |---------|--------|
| Bank statement model|&bullet; v4.0:2024-07-31 (preview)|**`prebuilt-bankStatement.us`**|

## Bank statement data extraction

A bank statement helps review account's activities during a specified period. It's an official statement that helps in detecting fraud, tracking expenses, accounting errors and record the period's activities. See how data is extracted using the `prebuilt-bankStatement.us` model. You need the following resources:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* A [Document Intelligence instance](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, select **Go to resource** to get your key and endpoint.

    :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot of keys and endpoint location in the Azure portal.":::

## Document Intelligence Studio

1. On the [Document Intelligence Studio home page](https://documentintelligence.ai.azure.com/studio), select **bank statements**.

1. You can analyze the sample bank statement or upload your own files.

1. Select the **Run analysis** button and, if necessary, configure the **Analyze options** :

    :::image type="content" source="media/studio/run-analysis-analyze-options.png" alt-text="Screenshot of Run analysis and Analyze options buttons in the Document Intelligence Studio.":::

    > [!div class="nextstepaction"]
    > [Try Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=businessCard)

## Input requirements

[!INCLUDE [input requirements](./includes/input-requirements.md)]

## Supported languages and locales

*See* our [Language Support](language-support-prebuilt.md) page for a complete list of supported languages.

## Field extractions

| Field | Type | Description | Example |
|:------|:-----|:------------|:--------|
|`AccountNumber`|`string`|Account number on the bank statement|987-654-3210|
|`AccountType`|`string`|Type of account on the bank statement|Checking|
|`BankAddress`|`address`|Listed address of the bank|123 Main St., Redmond, Washington 98052|
|`BankName`|`string`|Listed name of the bank|Contoso Bank|
|`AccountHolderAddress`|`address`|Address of the account holder|456 Main St., Redmond, Washington 98052|
|`AccountHolderName`|`string`|Name of the account holder|JOHN DOE|
|`EndingBalance`|`number`|Ending balance on the bank statement|$1488.03|
|`BeginningBalance`|`number`|Beginning balance on the bank statement|$1488.03|
|`StatementStartDate`|`date`|Start date of the bank statement|July 01, 2017|
|`StatementEndDate`|`date`|End date of the bank statement|July 31, 2017|
|`TotalServiceFees`|`number`|Total service fees|$0.00|
|`Transactions`|`array`|Extracted transaction line item|07/17<br>OnlineTransfer From Check...6609 Transaction#: 6373187418<br>$1,500.00|
|`Transactions.*`|`object`|||
|`Transactions.*.Date`|`date`|Transaction date|07/17|
|`Transactions.*.Description`|`string`|Transaction description|OnlineTransfer From Check...6609 Transaction#: 6373187418|
|`Transactions.*.CheckNumber`|`string`|Check number of the transaction|6609|
|`Transactions.*.DepositAmount`|`number`|Amount of deposit in the transaction|$1500.00|
|`Transactions.*.WithdrawalAmount`|`number`|Amount of withdrawal in the transaction|$1500.00|

## Supported locales

The **prebuilt-bankStatement.us** version 2027-07-31-preview supports the **en-us** locale.

## Next steps

* Try processing your own forms and documents with the [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio)

* Complete a [Document Intelligence quickstart](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true) and get started creating a document processing app in the development language of your choice.
