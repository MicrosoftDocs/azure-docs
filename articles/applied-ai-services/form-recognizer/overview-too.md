---
title: What's Azure Form Recognizer
titleSuffix: Azure Applied AI Services
description: Form Recognizedr is a machine-learning based OCR and intelligent document processing service to automate extraction of text, table and structure, and key-value pairs from forms and documents.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: overview
ms.date: 02/22/2023
ms.author: lajanuar
recommendations: false
---

<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD036 -->

# What's Azure Form Recognizer?

::: moniker range="form-recog-3.0.0"
[!INCLUDE [applies to v3.0](includes/applies-to-v3-0.md)]
::: moniker-end

::: moniker range="form-recog-3.0.0"

Azure Form Recognizer is a cloud-based [Azure Applied AI Service](../../applied-ai-services/index.yml) for developers to build intelligent document processing solutions. Form Recognizer applies machine-learning-based optical character recognition (OCR) and document understanding technologies to extract text, tables, structure, and key-value pairs from documents. You can also label and train custom models to automate data extraction from structured, semi-structured, and unstructured documents.

## Form Recognizer models

Select one of the tiles below to learn more about Form Recognizer models.

### Document analysis models

:::row:::
   :::column:::
      :::image type="content" source="media/overview/icon-read.png" alt-text="Screenshot of read model icon." link="#read":::</br>
   [**Read**](#read)
   :::column-end:::
   :::column span="":::
      :::image type="content" source="media/overview/icon-general-document.png" alt-text="Screenshot of general document model icon." link="#general-document":::</br>
    [**general document**](#general-document)
   :::column-end:::
   :::column span="":::
      :::image type="content" source="media/overview/icon-layout.png" alt-text="Screenshot of layout model icon." link="#layout":::</br>
    [**layout**](#layout)
   :::column-end:::
:::row-end:::

### Prebuilt models

:::row:::
   :::column span="":::
      :::image type="content" source="media/overview/icon-invoice.png" alt-text="Screenshot of invoice model icon." link="#invoice":::</br>
    [**Invoice**](#invoice)
   :::column-end:::
   :::column span="":::
      :::image type="content" source="media/overview/icon-receipt.png" alt-text="Screenshot of receipt model icon." link="#receipt":::</br>
    [**Receipt**](#receipt)
   :::column-end:::
   :::column span="":::
      :::image type="content" source="media/overview/icon-id-document.png" alt-text="Screenshot of identity document model icon." link="#identity-id":::</br>
    [**Identity**](#identity-id)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      :::image type="content" source="media/overview/icon-w2.png" alt-text="Screenshot of w2 model icon." link="#w-2":::</br>
    [**W2**](#w-2)
   :::column-end:::
   :::column span="":::
      :::image type="content" source="media/overview/icon-business-card.png" alt-text="Screenshot of business card model icon." link="#business-card":::</br>
    [**Business card**](#business-card)
   :::column-end:::
:::column span="":::
   :::column-end:::
:::row-end:::

### Custom models

:::row:::
   :::column:::
      :::image type="content" source="media/overview/icon-custom.png" alt-text="Screenshot of custom model icon" link="#custom-models":::</br>
    [**Overview**](#custom-model-overview)
   :::column-end:::
   :::column span="":::
      :::image type="content" source="media/overview/icon-custom-template.png" alt-text="Screenshot of custom template model icon.":::</br>
    [**Custom template**](#custom-template)
   :::column-end:::
   :::column span="":::
      :::image type="content" source="media/overview/icon-custom-neural.png" alt-text="Screenshot of custom neural model icon.":::</br>
    [**Custom neural**](#custom-neural)
   :::column-end:::
      :::column span="":::
      :::image type="content" source="media/overview/icon-custom-composed.png" alt-text="Screenshot of custom com posed model icon.":::</br>
    [**Custom composed**](#composed-custom)
   :::column-end:::
:::row-end:::

## Video: Form Recognizer models

The following video introduces Form Recognizer models and their associated output to help you choose the best model to address your document scenario needs.</br></br>

  > [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE5fX1b]

## Development options

> [!NOTE]
>The following document understanding models and development options are supported by the Form Recognizer service v3.0.

You can Use Form Recognizer to automate your document processing in applications and workflows, enhance data-driven strategies, and enrich document search capabilities. Use the links in the table to learn more about each model and browse the API references.

### Read

:::image type="content" source="media/overview/analyze-read.png" alt-text="Screenshot of Read model analysis using Form Recognizer Studio.":::

|About| Description |Automation use cases | Development options |
|----------|--------------|-------------------------|-----------|
|[**Read OCR model**](concept-read.md)|Extract text lines, words, detected languages, and handwritten style if detected.| <ul><li>Contract processing. </li><li>Financial or medical report processing.</li></ul>|<ul ><li>[**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio/read)</li><li>[**REST API**](how-to-guides/use-prebuilt-read.md?pivots=programming-language-rest-api)</li><li>[**C# SDK**](how-to-guides/use-prebuilt-read.md?pivots=programming-language-csharp)</li><li>[**Python SDK**](how-to-guides/use-prebuilt-read.md?pivots=programming-language-python)</li><li>[**Java SDK**](how-to-guides/use-prebuilt-read.md?pivots=programming-language-java)</li><li>[**JavaScript**](how-to-guides/use-prebuilt-read.md?pivots=programming-language-javascript)</li></ul> |

> [!div class="nextstepaction"]
> [Return to model types](#document-analysis-models)

## General document

:::image type="content" source="media/overview/analyze-general-document.png" alt-text="Screenshot of General Document model analysis using Form Recognizer Studio.":::

| About | Description |Automation use cases | Development options |
|----------|--------------|-------------------------|-----------|
|[**General document model**](concept-general-document.md)|Extract text, tables, structure, and key-value pairs.|<ul><li>Key-value pair extraction.</li><li>Form processing.</li><li>Survey data collection and analysis.</li></ul>|<ul ><li>[**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio/document)</li><li>[**REST API**](quickstarts/get-started-v3-sdk-rest-api.md)</li><li>[**C# SDK**](quickstarts/get-started-v3-sdk-rest-api.md#general-document-model)</li><li>[**Python SDK**](quickstarts/get-started-v3-sdk-rest-api.md#general-document-model)</li><li>[**Java SDK**](quickstarts/get-started-v3-sdk-rest-api.md#general-document-model)</li><li>[**JavaScript**](quickstarts/get-started-v3-sdk-rest-api.md#general-document-model)</li></ul> |

> [!div class="nextstepaction"]
> [Return to model types](#document-analysis-models)

## Layout

:::image type="content" source="media/overview/analyze-layout.png" alt-text="Screenshot of Layout model analysis using Form Recognizer Studio.":::

| About | Description |Automation use cases | Development options |
|----------|--------------|-------------------------|-----------|
|[**Layout analysis model**](concept-layout.md) | Extract text, selection marks, and tables structures, along with their bounding box coordinates, from forms and documents.</br></br> Layout API has been updated to a prebuilt model. |<ul><li>Document indexing and retrieval by structure.</li><li>Preprocessing prior to OCR analysis.</li></ul> |<ul><li>[**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio/layout)</li><li>[**REST API**](quickstarts/get-started-v3-sdk-rest-api.md)</li><li>[**C# SDK**](quickstarts/get-started-v3-sdk-rest-api.md#layout-model)</li><li>[**Python SDK**](quickstarts/get-started-v3-sdk-rest-api.md#layout-model)</li><li>[**Java SDK**](quickstarts/get-started-v3-sdk-rest-api.md#layout-model)</li><li>[**JavaScript**](quickstarts/get-started-v3-sdk-rest-api.md#layout-model)</li></ul>|

> [!div class="nextstepaction"]
> [Return to model types](#document-analysis-models)

## W-2

:::image type="content" source="media/overview/analyze-w2.png" alt-text="Screenshot of W-2 model analysis using Form Recognizer Studio.":::

| About | Description |Automation use cases | Development options |
|----------|--------------|-------------------------|-----------|
|[**W-2 Form**](concept-w2.md) | Extract information reported in each box on a W-2 form.|<ul><li>Automated tax document management.</li><li>Mortgage loan application processing.</li></ul> |<ul ><li>[**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=tax.us.w2)<li>[**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-2/operations/AnalyzeDocument)</li><li>[**C# SDK**](quickstarts/get-started-v3-sdk-rest-api.md#prebuilt-model)</li><li>[**Python SDK**](quickstarts/get-started-v3-sdk-rest-api.md#prebuilt-model)</li><li>[**Java SDK**](quickstarts/get-started-v3-sdk-rest-api.md#prebuilt-model)</li><li>[**JavaScript**](quickstarts/get-started-v3-sdk-rest-api.md#prebuilt-model)</li></ul> |

> [!div class="nextstepaction"]
> [Return to model types](#prebuilt-models)

## Invoice

:::image type="content" source="media/overview/analyze-invoice.png" alt-text="Screenshot of Invoice model analysis using Form Recognizer Studio.":::

| About | Description |Automation use cases | Development options |
|----------|--------------|-------------------------|-----------|
|[**Invoice model**](concept-invoice.md) | Automated data processing and extraction of key information from sales invoices. |<ul><li>Accounts payable processing.</li><li>Automated tax recording and reporting.</li></ul> |<ul><li>[**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=invoice)</li><li>[**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)</li><li>[**C# SDK**](quickstarts/get-started-v3-sdk-rest-api.md#prebuilt-model)</li><li>[**Python SDK**](quickstarts/get-started-v3-sdk-rest-api.md#prebuilt-model)</li></ul>|

> [!div class="nextstepaction"]
> [Return to model types](#prebuilt-models)

## Receipt

:::image type="content" source="media/overview/analyze-receipt.png" alt-text="Screenshot of Receipt model analysis using Form Recognizer Studio.":::

| About | Description |Automation use cases | Development options |
|----------|--------------|-------------------------|-----------|
|[**Receipt model**](concept-receipt.md) | Automated data processing and extraction of key information from sales receipts.</br></br>Receipt model v3.0 supports processing of **single-page hotel receipts**.|<ul><li>Expense management.</li><li>Consumer behavior data analysis.</li><li>Customer loyalty program.</li><li>Merchandise return processing.</li><li>Automated tax recording and reporting.</li></ul> |<ul><li>[**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=receipt)</li><li>[**REST API**](quickstarts/get-started-v3-sdk-rest-api.md)</li><li>[**C# SDK**](quickstarts/get-started-v3-sdk-rest-api.md#prebuilt-model)</li><li>[**Python SDK**](quickstarts/get-started-v3-sdk-rest-api.md#prebuilt-model)</li><li>[**Java SDK**](quickstarts/get-started-v3-sdk-rest-api.md#prebuilt-model)</li><li>[**JavaScript**](quickstarts/get-started-v3-sdk-rest-api.md#prebuilt-model)</li></ul>|

> [!div class="nextstepaction"]
> [Return to model types](#prebuilt-models)

## Identity (ID)

:::image type="content" source="media/overview/analyze-id-document.png" alt-text="Screenshot of Identity (ID) Document model analysis using Form Recognizer Studio.":::

| About | Description |Automation use cases | Development options |
|----------|--------------|-------------------------|-----------|
|[**Identity document (ID) model**](concept-id-document.md) |Automated data processing and extraction of key information from US driver's licenses and international passports.</br></br>Prebuilt ID document API supports the **extraction of endorsements, restrictions, and vehicle classifications from US driver's licenses**. |<ul><li>Know your customer (KYC) financial services guidelines compliance.</li><li>Medical account management.</li><li>Identity checkpoints and gateways.</li><li>Hotel registration.</li></ul> |<ul><li> [**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=idDocument)</li><li>[**REST API**](quickstarts/get-started-v3-sdk-rest-api.md)</li><li>[**C# SDK**](quickstarts/get-started-v3-sdk-rest-api.md#prebuilt-model)</li><li>[**Python SDK**](quickstarts/get-started-v3-sdk-rest-api.md#prebuilt-model)</li><li>[**Java SDK**](quickstarts/get-started-v3-sdk-rest-api.md#prebuilt-model)</li><li>[**JavaScript**](quickstarts/get-started-v3-sdk-rest-api.md#prebuilt-model)</li></ul>|

> [!div class="nextstepaction"]
> [Return to model types](#prebuilt-models)

## Business card

:::image type="content" source="media/overview/analyze-business-card.png" alt-text="Screenshot of Business card model analysis using Form Recognizer Studio.":::

| About | Description |Automation use cases | Development options |
|----------|--------------|-------------------------|-----------|
|[**Business card model**](concept-business-card.md) |Automated data processing and extraction of key information from business cards.|<ul><li>Sales lead and marketing management.</li></ul> |<ul><li>[**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=businessCard)</li><li>[**REST API**](quickstarts/get-started-v3-sdk-rest-api.md)</li><li>[**C# SDK**](quickstarts/get-started-v3-sdk-rest-api.md#prebuilt-model)</li><li>[**Python SDK**](quickstarts/get-started-v3-sdk-rest-api.md#prebuilt-model)</li><li>[**Java SDK**](quickstarts/get-started-v3-sdk-rest-api.md#prebuilt-model)</li><li>[**JavaScript**](quickstarts/get-started-v3-sdk-rest-api.md#prebuilt-model)</li></ul>|

> [!div class="nextstepaction"]
> [Return to model types](#prebuilt-models)

## Custom model overview

:::image type="content" source="media/overview/custom-train.png" alt-text="Screenshot of Custom model training using Form Recognizer Studio.":::

| About | Description |Automation use cases | Development options |
|----------|--------------|-------------------------|-----------|
|[**Custom model**](concept-custom.md) | Extraction and analysis of data from forms and documents specific to distinct business data and use cases.|| <ul><li>[**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio/custommodel/projects)</li><li>[**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)</li><li>[**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li><li>[**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li><li>[**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li><li>[**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li></ul>|

> [!div class="nextstepaction"]
> [Return to model types](#custom-model-overview)

### Custom template

:::image type="content" source="media/overview/analyze-custom-template.png" alt-text="Screenshot of Custom Template model analysis using Form Recognizer Studio.":::

  > [!NOTE]
  > To train a custom template model, set the ```buildMode``` property to ```template```.
  > For more information, *see* [Training a template model](concept-custom-template.md#training-a-model)

| About | Description |Automation use cases | Development options |
|----------|--------------|-------------------------|-----------|
|[**Custom Template model**](concept-custom-template.md) (custom form) | is used to analyze structured and semi-structured documents.</li><li>|Extract key-value pairs, selection marks, tables, signature fields, and selected regions, from target document that share a common visual layout, such as a form.| <ul><li>[**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio/custommodel/projects)</li><li>[**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)</li><li>[**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li><li>[**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li><li>[**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li><li>[**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li></ul>

> [!div class="nextstepaction"]
> [Return to model types](#custom-template)

## Custom neural

:::image type="content" source="media/overview/analyze-custom-neural.png" alt-text="Screenshot of Custom Neural model analysis using Form Recognizer Studio.":::

  > [!NOTE]
  > To train a custom neural model, set the ```buildMode``` property to ```neural```.
  > For more information, *see* [Training a neural model](concept-custom-neural.md#training-a-model)

| About | Description |Automation use cases | Development options |
|----------|--------------|-------------------------|-----------|
|[**Custom Neural model**](concept-custom-neural.md) (custom document)| is used to analyze unstructured documents.|<ul><li>Extract field data and checkboxes from structured and unstructured documents such as contracts and agreements.|[**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio/custommodel/projects)</li><li>[**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)</li><li>[**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li><li>[**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li><li>[**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li><li>[**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true)</li></ul>

> [!div class="nextstepaction"]
> [Return to model types](#custom-neural)

## Composed custom

:::image type="content" source="media/overview/composed-custom-models.png" alt-text="Screenshot of Composed Custom model list in Form Recognizer Studio.":::

| About | Description |Automation use cases | Development options |
|----------|--------------|-------------------------|-----------|
|[**Composed custom models**](concept-composed-models.md)| A composed model is created by taking a collection of custom models and assigning them to a single model built from your form types.| Useful when you've trained several models and want to group them to analyze similar form types like purchase orders.|<ul><li>[Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio/custommodel/projects)</li><li>[REST API](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/ComposeDocumentModel)</li><li>[C# SDK](/dotnet/api/azure.ai.formrecognizer.training.formtrainingclient.startcreatecomposedmodel)</li><li>[Java SDK](/java/api/com.azure.ai.formrecognizer.training.formtrainingclient.begincreatecomposedmodel)</li><li>[JavaScript SDK](/javascript/api/@azure/ai-form-recognizer/documentmodeladministrationclient?view=azure-node-latest#@azure-ai-form-recognizer-documentmodeladministrationclient-begincomposemodel&preserve-view=true)</li><li>[Python SDK](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer.formtrainingclient?view=azure-python#azure-ai-formrecognizer-formtrainingclient-begin-create-composed-model&preserve-view=true)</li></ul>

::: moniker-end
::: moniker range="form-recog-2.1.0"
[!INCLUDE [applies to v2.1](includes/applies-to-v2-1.md)]
::: moniker-end

::: moniker range="form-recog-2.1.0"

Azure Form Recognizer is a cloud-based [Azure Applied AI Service](../../applied-ai-services/index.yml) for developers to build intelligent document processing solutions. Form Recognizer applies machine-learning-based optical character recognition (OCR) and document understanding technologies to extract text, tables, structure, and key-value pairs from documents. You can also label and train custom models to automate data extraction from structured, semi-structured, and unstructured documents. To learn more about each model, *see* the Concepts articles:

| Model type | Model name |
|------------|-----------|
|**Document analysis model**| &#9679; [**Layout analysis model**](concept-layout.md?view=form-recog-2.1.0&preserve-view=true) </br>  |
| **Prebuilt models** | &#9679; [**Invoice model**](concept-invoice.md?view=form-recog-2.1.0&preserve-view=true)</br>&#9679; [**Receipt model**](concept-receipt.md?view=form-recog-2.1.0&preserve-view=true) </br>&#9679; [**Identity document (ID) model**](concept-id-document.md?view=form-recog-2.1.0&preserve-view=true) </br>&#9679; [**Business card model**](concept-business-card.md?view=form-recog-2.1.0&preserve-view=true) </br>
| **Custom models** | &#9679; [**Custom model**](concept-custom.md) </br>&#9679; [**Composed model**](concept-model-overview.md?view=form-recog-2.1.0&preserve-view=true)|

## Form Recognizer models and development options

 >[!TIP]
 >
 > * For an enhanced experience and advanced model quality, try the [Form Recognizer v3.0 Studio](https://formrecognizer.appliedai.azure.com/studio).
 > * The v3.0 Studio supports any model trained with v2.1 labeled data.
 > * You can refer to the API migration guide for detailed information about migrating from v2.1 to v3.0.

> [!NOTE]
> The following models  and development options are supported by the Form Recognizer service v2.1.

Use the links in the table to learn more about each model and browse the API references:

| Model| Description | Development options |
|----------|--------------|-------------------------|
|[**Layout analysis**](concept-layout.md?view=form-recog-2.1.0&preserve-view=true) | Extraction and analysis of text, selection marks, tables, and bounding box coordinates, from forms and documents. | <ul><li>[**Form Recognizer labeling tool**](quickstarts/try-sample-label-tool.md#analyze-layout)</li><li>[**REST API**](quickstarts/get-started-v2-1-sdk-rest-api.md#try-it-layout-model)</li><li>[**Client-library SDK**](quickstarts/get-started-sdks-rest-api.md)</li><li>[**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?branch=main&tabs=layout#run-the-container-with-the-docker-compose-up-command)</li></ul>|
|[**Custom model**](concept-custom.md?view=form-recog-2.1.0&preserve-view=true) | Extraction and analysis of data from forms and documents specific to distinct business data and use cases.| <ul><li>[**Form Recognizer labeling tool**](quickstarts/try-sample-label-tool.md#train-a-custom-form-model)</li><li>[**REST API**](quickstarts/get-started-sdks-rest-api.md)</li><li>[**Sample Labeling Tool**](concept-custom.md?view=form-recog-2.1.0&preserve-view=true#build-a-custom-model)</li><li>[**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?tabs=custom#run-the-container-with-the-docker-compose-up-command)</li></ul>|
|[**Invoice model**](concept-invoice.md?view=form-recog-2.1.0&preserve-view=true) | Automated data processing and extraction of key information from sales invoices. | <ul><li>[**Form Recognizer labeling tool**](quickstarts/try-sample-label-tool.md#analyze-using-a-prebuilt-model)</li><li>[**REST API**](quickstarts/get-started-v2-1-sdk-rest-api.md#try-it-prebuilt-model)</li><li>[**Client-library SDK**](quickstarts/get-started-sdks-rest-api.md#try-it-prebuilt-model)</li><li>[**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?tabs=invoice#run-the-container-with-the-docker-compose-up-command)</li></ul>|
|[**Receipt model**](concept-receipt.md?view=form-recog-2.1.0&preserve-view=true) | Automated data processing and extraction of key information from sales receipts.| <ul><li>[**Form Recognizer labeling tool**](quickstarts/try-sample-label-tool.md#analyze-using-a-prebuilt-model)</li><li>[**REST API**](quickstarts/get-started-v2-1-sdk-rest-api.md#try-it-prebuilt-model)</li><li>[**Client-library SDK**](quickstarts/get-started-sdks-rest-api.md)</li><li>[**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?tabs=receipt#run-the-container-with-the-docker-compose-up-command)</li></ul>|
|[**Identity document (ID) model**](concept-id-document.md?view=form-recog-2.1.0&preserve-view=true) | Automated data processing and extraction of key information from US driver's licenses and international passports.| <ul><li>[**Form Recognizer labeling tool**](quickstarts/try-sample-label-tool.md#analyze-using-a-prebuilt-model)</li><li>[**REST API**](quickstarts/get-started-v2-1-sdk-rest-api.md#try-it-prebuilt-model)</li><li>[**Client-library SDK**](quickstarts/get-started-sdks-rest-api.md)</li><li>[**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?tabs=id-document#run-the-container-with-the-docker-compose-up-command)</li></ul>|
|[**Business card model**](concept-business-card.md?view=form-recog-2.1.0&preserve-view=true) | Automated data processing and extraction of key information from business cards.| <ul><li>[**Form Recognizer labeling tool**](quickstarts/try-sample-label-tool.md#analyze-using-a-prebuilt-model)</li><li>[**REST API**](quickstarts/get-started-v2-1-sdk-rest-api.md#try-it-prebuilt-model)</li><li>[**Client-library SDK**](quickstarts/get-started-sdks-rest-api.md)</li><li>[**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?tabs=business-card#run-the-container-with-the-docker-compose-up-command)</li></ul>|

::: moniker-end

## Data privacy and security

 As with all AI services, developers using the Form Recognizer service should be aware of Microsoft policies on customer data. See our [Data, privacy, and security for Form Recognizer](/legal/cognitive-services/form-recognizer/fr-data-privacy-security) page.

## Next steps

::: moniker range="form-recog-3.0.0"

* Try processing your own forms and documents with the [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio)

* Complete a [Form Recognizer quickstart](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true) and get started creating a document processing app in the development language of your choice.

::: moniker-end

::: moniker range="form-recog-2.1.0"

* Try processing your own forms and documents with the [Form Recognizer Sample Labeling tool](https://fott-2-1.azurewebsites.net/)

* Complete a [Form Recognizer quickstart](quickstarts/get-started-sdks-rest-api.md?view=form-recog-2.1.0&preserve-view=true) and get started creating a document processing app in the development language of your choice.

::: moniker-end
