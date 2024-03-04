---
title: "Use Document Intelligence (formerly Form Recognizer) SDK for JavaScript / .NET (REST API v3.0)"
description: 'Use the Document Intelligence SDK for JavaScript (REST API v3.0) to create a forms processing app that extracts key data from documents.'
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: include
ms.date: 07/18/2023
ms.author: lajanuar
ms.custom: devx-track-csharp
---

<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD034 -->

> [!IMPORTANT]
>
> This project targets Document Intelligence REST API version **3.0**.

[SDK reference](https://azuresdkdocs.blob.core.windows.net/$web/javascript/azure-ai-form-recognizer/4.0.0/index.html) | [API reference](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/AnalyzeDocument) | [Package (npm)](https://www.npmjs.com/package/@azure/ai-form-recognizer) | [Samples](https://github.com/witemple-msft/azure-sdk-for-js/tree/7e3196f7e529212a6bc329f5f06b0831bf4cc174/sdk/formrecognizer/ai-form-recognizer/samples/v4) |[Supported REST API versions](../../../sdk-overview.md)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/).

* The latest version of [Visual Studio Code](https://code.visualstudio.com/) or your preferred IDE. For more information, *see* [Node.js in Visual Studio Code](https://code.visualstudio.com/docs/nodejs/nodejs-tutorial)

* The latest LTS version of [Node.js](https://nodejs.org/)

* An Azure AI services or Document Intelligence resource. Once you have your Azure subscription, create a [single-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [multi-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) Document Intelligence resource, in the Azure portal, to get your key and endpoint. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

    > [!TIP]
    > Create an Azure AI services resource if you plan to access multiple Azure AI services under a single endpoint/key. For Document Intelligence access only, create a Document Intelligence resource. Please note that you'll  need a single-service resource if you intend to use [Azure Active Directory authentication](../../../../../active-directory/authentication/overview-authentication.md).

* After your resource deploys, select **Go to resource**. You need the key and endpoint from the resource you create to connect your application to the Document Intelligence API. You paste your key and endpoint into the code later in the quickstart:

  :::image type="content" source="../../../media/containers/keys-and-endpoint.png" alt-text="Screenshot of keys and endpoint location in the Azure portal.":::

* You need a document file at a URL. For this project, you can use the sample forms provided in the following table for each feature:

    **Sample documents**

    | **Feature**   | **{modelID}**   | **{document-url}** |
    | --- | --- |--|
    | **Read model** | prebuilt-read | [Sample brochure](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/read.png) |
    | **Layout model** | prebuilt-layout | [Sample booking confirmation](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/layout.png) |
    | **General document model** | prebuilt-document | [Sample SEC report](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf) |
    | **W-2 form model**  | prebuilt-tax.us.w2 | [Sample W-2 form](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/w2.png) |
    | **Invoice model**  | prebuilt-invoice | [Sample invoice](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/raw/master/curl/form-recognizer/rest-api/invoice.pdf) |
    | **Receipt model**  | prebuilt-receipt | [Sample receipt](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/receipt.png) |
    | **ID document model**  | prebuilt-idDocument | [Sample ID document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/identity_documents.png) |
    | **Business card model**  | prebuilt-businessCard | [Sample business card](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/de5e0d8982ab754823c54de47a47e8e499351523/curl/form-recognizer/rest-api/business_card.jpg) |

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue with the prerequisites.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=javascript&Product=FormRecognizer&Page=how-to&Section=prerequisites) -->

[!INCLUDE [environment-variables](set-environment-variables.md)]

## Set up your programming environment

1. Create a new Node.js Express application: In a console window (such as cmd, PowerShell, or Bash), create and navigate to a new directory for your app named `form-recognizer-app`.

    ```console
    mkdir form-recognizer-app && cd form-recognizer-app
    ```

1. Run the `npm init` command to initialize the application and scaffold your project.

    ```console
    npm init
    ```

1. Specify your project's attributes using the prompts presented in the terminal.

    * The most important attributes are name, version number, and entry point.
    * We recommend keeping `index.js` for the entry point name. The description, test command, GitHub repository, keywords, author, and license information are optional attributes—they can be skipped for this project.
    * Accept the suggestions in parentheses by selecting **Return** or **Enter**.
    * After you've completed the prompts, a `package.json` file will be created in your form-recognizer-app directory.

1. Install the `ai-form-recognizer` client library and `azure/identity` npm packages:

    ```console
    npm i @azure/ai-form-recognizer @azure/identity
    ```

    * Your app's `package.json` file is updated with the dependencies.

1. Create a file named `index.js` in the application directory.

    > [!TIP]
    >
    > * You can create a new file using PowerShell.
    > * Open a PowerShell window in your project directory by holding down the Shift key and right-clicking the folder.
    > * Type the following command **New-Item index.js**.

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue with the setup.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=javascript&Product=FormRecognizer&Page=how-to&Section=setup) -->

## Build your application

To interact with the Document Intelligence service, you need to create an instance of the `DocumentAnalysisClient` class. To do so, you create an `AzureKeyCredential` with your `key` from the Azure portal and a `DocumentAnalysisClient` instance with the `AzureKeyCredential` and your Document Intelligence `endpoint`.

Open the `index.js` file in Visual Studio Code or your favorite IDE and select one of the following code samples to copy and paste into your application:

* The [prebuilt-read](#read-model) model is at the core of all Document Intelligence models and can detect lines, words, locations, and languages. The layout, general document, prebuilt, and custom models all use the read model as a foundation for extracting texts from documents.

* The [prebuilt-layout](#layout-model) model extracts text and text locations, tables, selection marks, and structure information from documents and images.

* The [prebuilt-document](#general-document-model) model extracts key-value pairs, tables, and selection marks from documents and can be used as an alternative to training a custom model without labels.

* The [prebuilt-tax.us.w2](#w-2-tax-model) model extracts information reported on US Internal Revenue Service (IRS) tax forms.

* The [prebuilt-invoice](#invoice-model) model extracts information reported on US Internal Revenue Service (IRS) tax forms.

* The [prebuilt-receipt](#receipt-model) model extracts key information from printed and handwritten sales receipts.

* The [prebuilt-idDocument](#id-document-model) model extracts key information from US Drivers Licenses, international passport biographical pages, US state IDs, social security cards, and permanent resident (green) cards.

* The [prebuilt-businessCard](#business-card-model) model extracts key information from business card images.

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue building the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=javascript&Product=FormRecognizer&Page=how-to&Section=build-application) -->

## Read model

```javascript

const { AzureKeyCredential, DocumentAnalysisClient } = require("@azure/ai-form-recognizer");

//use your `key` and `endpoint` environment variables
const key = process.env['FR_KEY'];
const endpoint = process.env['FR_ENDPOINT'];

// sample document
const documentUrlRead = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/read.png"

// helper function
function* getTextOfSpans(content, spans) {
    for (const span of spans) {
        yield content.slice(span.offset, span.offset + span.length);
    }
}

async function main() {
    // create your `DocumentAnalysisClient` instance and `AzureKeyCredential` variable
    const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));
    const poller = await client.beginAnalyzeDocument("prebuilt-read", documentUrlRead);

    const {
        content,
        pages,
        languages,
        styles
    } = await poller.pollUntilDone();

    if (pages.length <= 0) {
        console.log("No pages were extracted from the document.");
    } else {
        console.log("Pages:");
        for (const page of pages) {
            console.log("- Page", page.pageNumber, `(unit: ${page.unit})`);
            console.log(`  ${page.width}x${page.height}, angle: ${page.angle}`);
            console.log(`  ${page.lines.length} lines, ${page.words.length} words`);

            if (page.lines.length > 0) {
                console.log("  Lines:");

                for (const line of page.lines) {
                    console.log(`  - "${line.content}"`);

                    // The words of the line can also be iterated independently. The words are computed based on their
                    // corresponding spans.
                    for (const word of line.words()) {
                        console.log(`    - "${word.content}"`);
                    }
                }
            }
        }
    }

    if (languages.length <= 0) {
        console.log("No language spans were extracted from the document.");
    } else {
        console.log("Languages:");
        for (const languageEntry of languages) {
            console.log(
                `- Found language: ${languageEntry.languageCode} (confidence: ${languageEntry.confidence})`
            );
            for (const text of getTextOfSpans(content, languageEntry.spans)) {
                const escapedText = text.replace(/\r?\n/g, "\\n").replace(/"/g, '\\"');
                console.log(`  - "${escapedText}"`);
            }
        }
    }

    if (styles.length <= 0) {
        console.log("No text styles were extracted from the document.");
    } else {
        console.log("Styles:");
        for (const style of styles) {
            console.log(
                `- Handwritten: ${style.isHandwritten ? "yes" : "no"} (confidence=${style.confidence})`
            );

            for (const word of getTextOfSpans(content, style.spans)) {
                console.log(`  - "${word}"`);
            }
        }
    }
}

main().catch((error) => {
    console.error("An error occurred:", error);
    process.exit(1);
});

```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue when running the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=javascript&Product=FormRecognizer&Page=how-to&Section=run-read) -->

### Read model output

Visit the Azure samples repository on GitHub to view the [read model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/FormRecognizer/how-to-guide/read-model-output.md).

## Layout model

```javascript
const { AzureKeyCredential, DocumentAnalysisClient } = require("@azure/ai-form-recognizer");

//use your `key` and `endpoint` environment variables
const key = process.env['FR_KEY'];
const endpoint = process.env['FR_ENDPOINT'];

// sample document
const layoutUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/layout.png"

async function main() {
    const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));

    const poller = await client.beginAnalyzeDocumentFromUrl(
      "prebuilt-layout", layoutUrl);

    // Layout extraction produces basic elements such as pages, words, lines, etc. as well as information about the
    // appearance (styles) of textual elements.
    const { pages, tables } = await poller.pollUntilDone();

    if (!pages || pages.length <= 0) {
      console.log("No pages were extracted from the document.");
    } else {
      console.log("Pages:");
      for (const page of pages) {
        console.log("- Page", page.pageNumber, `(unit: ${page.unit})`);
        console.log(`  ${page.width}x${page.height}, angle: ${page.angle}`);
        console.log(
          `  ${page.lines && page.lines.length} lines, ${page.words && page.words.length} words`
        );

        if (page.lines && page.lines.length > 0) {
          console.log("  Lines:");

          for (const line of page.lines) {
            console.log(`  - "${line.content}"`);

            // The words of the line can also be iterated independently. The words are computed based on their
            // corresponding spans.
            for (const word of line.words()) {
              console.log(`    - "${word.content}"`);
            }
          }
        }
      }
    }

    if (!tables || tables.length <= 0) {
      console.log("No tables were extracted from the document.");
    } else {
      console.log("Tables:");
      for (const table of tables) {
        console.log(
          `- Extracted table: ${table.columnCount} columns, ${table.rowCount} rows (${table.cells.length} cells)`
        );
      }
    }
  }

  main().catch((error) => {
    console.error("An error occurred:", error);
    process.exit(1);
  });

```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue when running the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=javascript&Product=FormRecognizer&Page=how-to&Section=run-layout) -->

### Layout model output

Visit the Azure samples repository on GitHub to view the [layout model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/FormRecognizer/how-to-guide/layout-model-output.md).

## General document model

```javascript
const { AzureKeyCredential, DocumentAnalysisClient } = require("@azure/ai-form-recognizer");

//use your `key` and `endpoint` environment variables
const key = process.env['FR_KEY'];
const endpoint = process.env['FR_ENDPOINT'];

// sample document
const documentUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf"

async function main() {
    const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));

    const poller = await client.beginAnalyzeDocumentFromUrl("prebuilt-document", documentUrl);

    const {
        keyValuePairs
    } = await poller.pollUntilDone();

    if (!keyValuePairs || keyValuePairs.length <= 0) {
        console.log("No key-value pairs were extracted from the document.");
    } else {
        console.log("Key-Value Pairs:");
        for (const {
                key,
                value,
                confidence
            } of keyValuePairs) {
            console.log("- Key  :", `"${key.content}"`);
            console.log("  Value:", `"${(value && value.content) || "<undefined>"}" (${confidence})`);
        }
    }

}

main().catch((error) => {
    console.error("An error occurred:", error);
    process.exit(1);
});

```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue when running the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=javascript&Product=FormRecognizer&Page=how-to&Section=run-general-document) -->

### General document model output

Visit the Azure samples repository on GitHub to view the [general document model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/FormRecognizer/how-to-guide/general-document-model-output.md).

## W-2 tax model

```javascript
const { AzureKeyCredential, DocumentAnalysisClient } = require("@azure/ai-form-recognizer");

//use your `key` and `endpoint` environment variables
const key = process.env['FR_KEY'];
const endpoint = process.env['FR_ENDPOINT'];

const w2DocumentURL = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/w2.png"

async function main() {
 const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));

 const poller = await client.beginAnalyzeDocument("prebuilt-tax.us.w2", w2DocumentURL);

 const {
   documents: [result]
 } = await poller.pollUntilDone();

  if (result) {
    const { Employee, Employer, ControlNumber, TaxYear, AdditionalInfo } = result.fields;

    if (Employee) {
      const { Name, Address, SocialSecurityNumber } = Employee.properties;
      console.log("Employee:");
      console.log("  Name:", Name && Name.content);
      console.log("  SSN/TIN:", SocialSecurityNumber && SocialSecurityNumber.content);
      if (Address && Address.value) {
        const { streetAddress, postalCode } = Address.value;
        console.log("  Address:");
        console.log("    Street Address:", streetAddress);
        console.log("    Postal Code:", postalCode);
      }
    } else {
      console.log("No employee information extracted.");
    }

    if (Employer) {
      const { Name, Address, IdNumber } = Employer.properties;
      console.log("Employer:");
      console.log("  Name:", Name && Name.content);
      console.log("  ID (EIN):", IdNumber && IdNumber.content);

      if (Address && Address.value) {
        const { streetAddress, postalCode } = Address.value;
        console.log("  Address:");
        console.log("    Street Address:", streetAddress);
        console.log("    Postal Code:", postalCode);
      }
    } else {
      console.log("No employer information extracted.");
    }

    console.log("Control Number:", ControlNumber && ControlNumber.content);
    console.log("Tax Year:", TaxYear && TaxYear.content);

    if (AdditionalInfo) {
      console.log("Additional Info:");

      for (const info of AdditionalInfo.values) {
        const { LetterCode, Amount } = info.properties;
        console.log(`- ${LetterCode && LetterCode.content}: ${Amount && Amount.content}`);
      }
    }
  } else {
    throw new Error("Expected at least one document in the result.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue when running the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=javascript&Product=FormRecognizer&Page=how-to&Section=run-w2-tax) -->

### W-2 tax model output

Visit the Azure samples repository on GitHub to view the [W-2 tax model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/FormRecognizer/how-to-guide/w2-tax-model-output.md).

## Invoice model

```javascript
const { AzureKeyCredential, DocumentAnalysisClient } = require("@azure/ai-form-recognizer");

//use your `key` and `endpoint` environment variables
const key = process.env['FR_KEY'];
const endpoint = process.env['FR_ENDPOINT'];

// sample url
const invoiceUrl = "https://github.com/Azure-Samples/cognitive-services-REST-api-samples/raw/master/curl/form-recognizer/rest-api/invoice.pdf";

async function main() {

  const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));

  const poller = await client.beginAnalyzeDocument("prebuilt-invoice", invoiceUrl);

  const {
      documents: [result]
  } = await poller.pollUntilDone();

  if (result) {
      const invoice = result.fields;

      console.log("Vendor Name:", invoice.VendorName?.content);
      console.log("Customer Name:", invoice.CustomerName?.content);
      console.log("Invoice Date:", invoice.InvoiceDate?.content);
      console.log("Due Date:", invoice.DueDate?.content);

      console.log("Items:");
      for (const {
              properties: item
          } of invoice.Items?.values ?? []) {
          console.log("-", item.ProductCode?.content ?? "<no product code>");
          console.log("  Description:", item.Description?.content);
          console.log("  Quantity:", item.Quantity?.content);
          console.log("  Date:", item.Date?.content);
          console.log("  Unit:", item.Unit?.content);
          console.log("  Unit Price:", item.UnitPrice?.content);
          console.log("  Tax:", item.Tax?.content);
          console.log("  Amount:", item.Amount?.content);
      }

      console.log("Subtotal:", invoice.SubTotal?.content);
      console.log("Previous Unpaid Balance:", invoice.PreviousUnpaidBalance?.content);
      console.log("Tax:", invoice.TotalTax?.content);
      console.log("Amount Due:", invoice.AmountDue?.content);
  } else {
      throw new Error("Expected at least one receipt in the result.");
  }
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});

```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue when running the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=javascript&Product=FormRecognizer&Page=how-to&Section=run-invoice) -->

### Invoice model output

Visit the Azure samples repository on GitHub to view the [invoice model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/FormRecognizer/how-to-guide/invoice-model-output.md).

## Receipt-model

```javascript
const { AzureKeyCredential, DocumentAnalysisClient } = require("@azure/ai-form-recognizer");

//use your `key` and `endpoint` environment variables
const key = process.env['FR_KEY'];
const endpoint = process.env['FR_ENDPOINT'];

// sample url
const receiptUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/receipt.png";

async function main() {

    const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));

    const poller = await client.beginAnalyzeDocument("prebuilt-receipt", receiptUrl);

    const {
        documents: [result]
    } = await poller.pollUntilDone();

    if (result) {
        const {
            MerchantName,
            Items,
            Total
        } = result.fields;

        console.log("=== Receipt Information ===");
        console.log("Type:", result.docType);
        console.log("Merchant:", MerchantName && MerchantName.content);

        console.log("Items:");
        for (const item of (Items && Items.values) || []) {
            const {
                Description,
                TotalPrice
            } = item.properties;

            console.log("- Description:", Description && Description.content);
            console.log("  Total Price:", TotalPrice && TotalPrice.content);
        }

        console.log("Total:", Total && Total.content);
    } else {
        throw new Error("Expected at least one receipt in the result.");
    }

}

main().catch((err) => {
    console.error("The sample encountered an error:", err);
});

```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue when running the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=javascript&Product=FormRecognizer&Page=how-to&Section=run-receipt) -->

### Receipt model output

Visit the Azure samples repository on GitHub to view the [receipt model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/FormRecognizer/how-to-guide/receipt-model-output.md).

## ID document model

```javascript
const { AzureKeyCredential, DocumentAnalysisClient } = require("@azure/ai-form-recognizer");

//use your `key` and `endpoint` environment variables
const key = process.env['FR_KEY'];
const endpoint = process.env['FR_ENDPOINT'];

// sample document
const idDocumentURL = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/identity_documents.png"

async function main() {
 const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));

 const poller = await client.beginAnalyzeDocument("prebuilt-idDocument", idDocumentURL);

 const {
   documents: [result]
 } = await poller.pollUntilDone();

  if (result) {
// The identity document model has multiple document types, so we need to know which document type was actually
    extracted.
    if (result.docType === "idDocument.driverLicense") {
      const { FirstName, LastName, DocumentNumber, DateOfBirth, DateOfExpiration, Height, Weight, EyeColor, Endorsements, Restrictions, VehicleClassifications} = result.fields;

// For the sake of the example, we'll only show a few of the fields that are produced.
      console.log("Extracted a Driver License:");
      console.log("  Name:", FirstName && FirstName.content, LastName && LastName.content);
      console.log("  License No.:", DocumentNumber && DocumentNumber.content);
      console.log("  Date of Birth:", DateOfBirth && DateOfBirth.content);
      console.log("  Expiration:", DateOfExpiration && DateOfExpiration.content);
      console.log("  Height:", Height && Height.content);
      console.log("  Weight:", Weight && Weight.content);
      console.log("  Eye color:", EyeColor && EyeColor.content);
      console.log("  Restrictions:", Restrictions && Restrictions.content);
      console.log("  Endorsements:", Endorsements && Endorsements.content);
      console.log("  Class:", VehicleClassifications && VehicleClassifications.content);
    } else if (result.docType === "idDocument.passport") {
// The passport document type extracts and parses the Passport's machine-readable zone
      if (!result.fields.machineReadableZone) {
        throw new Error("No Machine Readable Zone extracted from passport.");
      }

      const {
        FirstName,
        LastName,
        DateOfBirth,
        Nationality,
        DocumentNumber,
        CountryRegion,
        DateOfExpiration,
      } = result.fields.machineReadableZone.properties;

      console.log("Extracted a Passport:");
      console.log("  Name:", FirstName && FirstName.content, LastName && LastName.content);
      console.log("  Date of Birth:", DateOfBirth && DateOfBirth.content);
      console.log("  Nationality:", Nationality && natiNationalityonality.content);
      console.log("  Passport No.:", DocumentNumber && DocumentNumber.content);
      console.log("  Issuer:", CountryRegion && CountryRegion.content);
      console.log("  Expiration Date:", DateOfExpiration && DateOfExpiration.content);
    } else {
// The only reason this would happen is if the client library's schema for the prebuilt identity document model is
      out of date, and a new document type has been introduced.
      console.error("Unknown document type in result:", result);
    }
  } else {
    throw new Error("Expected at least one receipt in the result.");
  }
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});

```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue when running the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=javascript&Product=FormRecognizer&Page=how-to&Section=run-id-document) -->

### ID document model output

Visit the Azure samples repository on GitHub to view the [ID document model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/FormRecognizer/how-to-guide/id-document-output.md).

## Business card model

```javascript
const { AzureKeyCredential, DocumentAnalysisClient } = require("@azure/ai-form-recognizer");

//use your `key` and `endpoint` environment variables
const key = process.env['FR_KEY'];
const endpoint = process.env['FR_ENDPOINT'];

// sample document
const businessCardURL = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/de5e0d8982ab754823c54de47a47e8e499351523/curl/form-recognizer/rest-api/business_card.jpg"

async function main() {
    const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));

    const poller = await client.beginAnalyzeDocument("prebuilt-businessCard", businessCardURL);

    const {
        documents: [result]
    } = await poller.pollUntilDone();

    if (result) {
        const businessCard = result.fields;
        console.log("=== Business Card Information ===");

        // There are more fields than just these few, and the model allows for multiple contact & company names as well as
        // phone numbers, though we'll only show the first extracted values here.
        const name = businessCard.ContactNames && businessCard.ContactNames.values[0];
        if (name) {
            const {
                FirstName,
                LastName
            } = name.properties;
            console.log("Name:", FirstName && FirstName.content, LastName && LastName.content);
        }

        const company = businessCard.CompanyNames && businessCard.CompanyNames.values[0];
        if (company) {
            console.log("Company:", company.content);
        }

        const address = businessCard.Addresses && businessCard.Addresses.values[0];
        if (address) {
            console.log("Address:", address.content);
        }
        const jobTitle = businessCard.JobTitles && businessCard.JobTitles.values[0];
        if (jobTitle) {
            console.log("Job title:", jobTitle.content);
        }
        const department = businessCard.Departments && businessCard.Departments.values[0];
        if (department) {
            console.log("Department:", department.content);
        }
        const email = businessCard.Emails && businessCard.Emails.values[0];
        if (email) {
            console.log("Email:", email.content);
        }
        const workPhone = businessCard.WorkPhones && businessCard.WorkPhones.values[0];
        if (workPhone) {
            console.log("Work phone:", workPhone.content);
        }
        const website = businessCard.Websites && businessCard.Websites.values[0];
        if (website) {
            console.log("Website:", website.content);
        }
    } else {
        throw new Error("Expected at least one business card in the result.");
    }
}

main().catch((error) => {
    console.error("An error occurred:", error);
    process.exit(1);
});

```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue when running the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=javascript&Product=FormRecognizer&Page=how-to&Section=run-business-card) -->

### Business card model output

Visit the Azure samples repository on GitHub to view the [business card model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/FormRecognizer/how-to-guide/business-card-model-output.md).
