> [!IMPORTANT]
>
> * This quickstart SDK targets REST API version **v3.0**.
>

[Reference documentation](/javascript/api/@azure/ai-form-recognizer/?view=azure-node-latest&preserve-view=true) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/formrecognizer/ai-form-recognizer) | [Package (npm)](https://www.npmjs.com/package/@azure/ai-form-recognizer) | [Samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/formrecognizer/ai-form-recognizer/samples/v3/javascript)

Azure Cognitive Services Form Recognizer is a cloud service that uses machine learning to extract and analyze form fields, text, and tables from your documents. You can easily call Form Recognizer models by integrating our client library SDks into your workflows and applications.

### Form Recognizer models

The JavaScript SDK supports the following models and capabilities:

* 🆕General document—Analyze and extract text, tables, structure, key-value pairs and named entities.|
* Layout—Analyze and extract tables, lines, words, and selection marks like radio buttons and check boxes in forms documents, without the need to train a model.
* Custom—Analyze and extract form fields and other content from your custom forms, using models you trained with your own form types.
* Invoices—Analyze and extract common fields from invoices, using a pre-trained invoice model.
* Receipts—Analyze and extract common fields from receipts, using a pre-trained receipt model.
* ID documents—Analyze and extract common fields from ID documents like passports or driver's licenses, using a pre-trained ID documents model.
* Business Cards—Analyze and extract common fields from business cards, using a pre-trained business cards model.

In this quickstart you'll use following features to analyze and extract data and values from forms and documents:

* [**General document**](#try-it-general-document-model)

* [**Layout**](#try-it-layout-model)

* [**Prebuilt Invoice**](#try-it-prebuilt-invoice-model)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services).

* The current version of [Node.js](https://nodejs.org/). The sample programs are compatible with Node.js 12.0.0 or later.

* A Cognitive Services or Form Recognizer resource. Once you have your Azure subscription, create a [single-service](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [multi-service](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) Form Recognizer resource in the Azure portal to get your key and endpoint. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

> [!TIP]
> Create a Cognitive Services resource if you plan to access multiple cognitive services under a single endpoint/key. For Form Recognizer access only, create a Form Recognizer resource. Please note that you'lll need a single-service resource if you intend to use [Azure Active Directory authentication](/azure/active-directory/authentication/overview-authentication).

* After your resource deploys, click **Go to resource**. You need the key and endpoint from the resource you create to connect your application to the Form Recognizer API. You'll paste your key and endpoint into the code below later in the quickstart:

  :::image type="content" source="../../media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

## Set up

Open a terminal window in your local environment and install the Azure Form Recognizer client library for  JavaScript using npm:

```console
npm i @azure/ai-form-recognizer
```

### Create a new JavaScript application

Congratulations! In this quickstart, you used the Form Recognizer JavaScript SDK to analyze forms in different ways. Next, explore the reference documentation to learn about Form Recognizer API in more depth.

## **Try It**: General document model

> [!div class="checklist"]
>
> * For this example, you'll need a **form document file at a URI**. You can use our [sample form document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf) for this quickstart.
> * Add the file URI value to the `formUrl` variable near the top of your file.

## **Try it**: Layout model

> [!div class="checklist"]
>
> * For this example, you'll need a **form document file at a URI**. You can use our [sample form document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf) for this quickstart.
> * Add the file URI value to the `formUrl` variable near the top of your file.

## **Try it**: Prebuilt invoice model

This sample demonstrates how to analyze data from certain types of common documents with pre-trained models, using an invoice as an example. *See* our invoice concept page for a complete list of [**invoice key-value pairs**](../../concept-invoice.md#key-value-pair-extraction)

> [!div class="checklist"]
>
> * For this example, you'll need an **invoice document file at a URI**. You can use our [sample invoice document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf) for this quickstart.
> * Add the file URI value to the `string fileUri` variable at the top of the Main method.

### Choose the invoice prebuilt model ID

You are not limited to invoices—there are several prebuilt models to choose from, each of which has its own set of supported fields. The model to use for the analyze operation depends on the type of document to be analyzed. Here are the model IDs for the prebuilt models currently supported by the Form Recognizer service:

* **prebuilt-invoice**: extracts text, selection marks, tables, key-value pairs, and key information from invoices.
* **prebuilt-businessCard**: extracts text and key information from business cards.
* **prebuilt-idDocument**: extracts text and key information from driver licenses and international passports.
* **prebuilt-receipt**: extracts text and key information from receipts.

## Run your application

1. Navigate to the folder where you have your **form_recognizer_quickstart.py** file.

1. Type the following in your terminal:

```python
python form_recognizer_quickstart.py
```


## Next steps

> [!div class="nextstepaction"]
> [REST API v3.0reference documentation](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/AnalyzeDocument)
