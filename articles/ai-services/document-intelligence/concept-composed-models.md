---
title: Composed custom models - Document Intelligence (formerly Form Recognizer)
titleSuffix: Azure AI services
description: Compose several custom models into a single model for easier data extraction from groups of distinct form types.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: conceptual
ms.date: 08/07/2024
ms.author: lajanuar
---

# Document Intelligence composed custom models

::: moniker range="doc-intel-4.0.0"
[!INCLUDE [preview-version-notice](includes/preview-notice.md)]

[!INCLUDE [applies to v4.0](includes/applies-to-v40.md)]
::: moniker-end

::: moniker range="doc-intel-3.1.0"
[!INCLUDE [applies to v3.1](includes/applies-to-v31.md)]
::: moniker-end

::: moniker range="doc-intel-3.0.0"
[!INCLUDE [applies to v3.0](includes/applies-to-v30.md)]
::: moniker-end

::: moniker range="doc-intel-2.1.0"
[!INCLUDE [applies to v2.1](includes/applies-to-v21.md)]
::: moniker-end

> [!IMPORTANT]
> [The `model compose` operation behavior is changing from api-version=2024-07-31-preview](#composed-models-2024-07-31-preview-enhancements). Model compose v4.0 and lateradds an explicitly trained classifier instead of an implicit classifier for analysis. For the previous composed model version, *see* [Composed custom models v3.1]().  If you are currently using composed models consider upgrading to the latest implementation.

# What is a composed model?
Some scenarios require classifying the document first and then analyzing the document with the model best suited to extract the fields from the model. This could include scenarios where a user uploads a document to your app where you don’t know the document type explicitly, or when a user scans multiple documents together into a single file and submits the file for processing. Your app then needs to identify the component documents and select the best model for each of the component documents. 
With composed models, you can group multiple custom models into a composed model called with a single model ID. For example, your composed model might include custom models trained to analyze your supply, equipment, and furniture purchase orders. Instead of manually trying to select the appropriate model, you can use a composed model to determine the appropriate custom model for each analysis and extraction.

The implmentation of model compose prior to API version 2024-07-31-preview performed an implicit classification to decide which custom model best represents the submitted document. The new implementation of the `model compose` operation replaces the implicit classification from the earlier versions with an explicit classification step and adds conditional routing.

## Benefits of the new model compose

The new model compose, requires you to train an explicit classifier, which provides a few benefits.
•	You can continually improve the quality of the classifier by adding additional samples and [incrementally improving the classification]( concept-incremental-classifier.md) ensuring your documents are always routed to the right model for extraction.
•	This implementation provides complete control over routing. By adding confidence-based routing, you provide a confidence threshold in addition to the mapping of the analysis model to the doc type of the classification response. 
•	Ignoring documents, earlier implementations of model compose always selected the best analysis model for extraction based on the highest confidence score even if the confidence scores were very low. By providing a confidence threshold or explicitly not mapping a known document type from classification to an extraction model, you can ignore specific document types.
•	Analyze multiple instances of the same document type. This implementation of model compose when paired with ```splitMode``` option of the classifier can detect multiple instances of the same document in a file and split the file to process each document independently. This enables the processing of multiple instances of a document in a single request.
•	Support for additional features. Add on features like query fields or barcodes can also be specified as a part of the analysis model parameters.
•	Expanding the number of composed models to 500 models. The new implementation of model compose allows you to assign up to 500 trained custom models to a single composed model.



::: moniker range="doc-intel-4.0.0"

##  How to use model compose

* Start by collecting samples of all your needed documents including the documents information should be extracted from and documents that should be ignored.

* Train a classifier by organizing the documents in folders where the folder names are the document type you intend to use in your composed model definition.

* Finally, train an extraction model for each of the document types you intend to use.

* Once your classification and extraction models are trained, use the Document Intelligence Studio, client libraries, or the [REST API](/rest/api/aiservices/operation-groups?view=rest-aiservices-2024-07-31-preview&preserve-view=true) to compose the classification and extraction models into a composed model.

Use the `splitMode` parameter to control the file splitting behavior:

  * **None**. The entire file is treated as a single document.
  * **perPage**. Each page in the file is treated as a separate document.
  * **auto**. The file is automatically split into documents.

## Billing and pricing

Composed models are billed the same as individual custom models. The pricing is based on the number of pages analyzed by the the downstream analysis model. You are only billed the extraction price for the pages routed to an extraction model. With the addition of the explict classification, you are also billed for classification of all pages in the input file. For more information, see the [Document Intelligence pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/form-recognizer/).

::: moniker-end



::: moniker range="doc-intel-3.1.0"

// **This should include all previous versions**
##  How to use model compose

* Start by creating a list of all the model IDs you want to compose into a single model.

* Compose the models into a single model ID using the Studio, REST API, or client libraries. 

* Use the composed model ID to analyze documents.


## Billing and pricing

Composed models are billed the same as individual custom models. The pricing is based on the number of pages analyzed. You are only billed the extraction price for the pages routed to an extraction model. For more information, see the [Document Intelligence pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/form-recognizer/).

* There's no change in pricing for analyzing a document by using an individual custom model or a composed custom model.


::: moniker-end




## Composed models features

* `Custom template` and `custom neural` models can be composed together into a single composed model across multiple API versions.

* The response includes a `docType` property to indicate which of the composed models was used to analyze the document.

* For `custom template` models, the composed model can be created using variations of a custom template or different form types. This operation is useful when incoming forms belong to one of several templates.

* For `custom neural` models the best practice is to add all the different variations of a single document type into a single training dataset and train on custom neural model. The `model compose` operation is best suited for scenarios when you have documents of different types being submitted for analysis.


## Compose model limits

* With the `model compose` operation, you can assign up to 500 models to a single model ID. If the number of models that I want to compose exceeds the upper limit of a composed model, you can use one of these alternatives:

  * Classify the documents before calling the custom model. You can use the [Read model](concept-read.md) and build a classification based on the extracted text from the documents and certain phrases by using sources like code, regular expressions, or search.

  * If you want to extract the same fields from various structured, semi-structured, and unstructured documents, consider using the deep-learning [custom neural model](concept-custom-neural.md). Learn more about the [differences between the custom template model and the custom neural model](concept-custom.md#compare-model-features).

* Analyzing a document by using composed models is identical to analyzing a document by using a single model. The `Analyze Document` result returns a `docType` property that indicates which of the component models you selected for analyzing the document.

* The `model compose` operation is currently available only for custom models trained with labels.

### Composed model compatibility

|Custom model type|Models trained with v2.1 and v2.0 | Custom template and neural models v3.1 and v3.0 |Custom template and neural models v4.0 preview|Custom Generative models v4.0 preview|
|--|--|--|--|--|
|**Models trained with version 2.1 and v2.0** |Not Supported|Not Supported|Not Supported|Not Supported|
|**Custom template and neural models v3.0 and v3.1** |Not Supported|Supported|Supported|Not Supported|
|**Custom template and neural models v4.0 preview**|Not Supported|Supported|Supported|Not Supported|
|**Custom generative models v4.0 preview**|Not Supported|Not Supported|Not Supported|Not Supported|

* To compose a model trained with a prior version of the API (v2.1 or earlier), train a model with the v3.0 API using the same labeled dataset. That addition ensures that the v2.1 model can be composed with other models.

* With models composed using v2.1 of the API continues to be supported, requiring no updates.

::: moniker-end

## Development options

:::moniker range="doc-intel-4.0.0"

Document Intelligence **v4.0:2024-07-31-preview** supports the following tools, applications, and libraries:

| Feature | Resources |
|----------|-------------|
|***Custom model***| &bullet; [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/custommodel/projects)</br>&bullet; [REST API](/rest/api/aiservices/operation-groups?view=rest-aiservices-2024-07-31-preview&preserve-view=true)</br>&bullet; [C# SDK](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)</br>&bullet; [Java SDK](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)</br>&bullet; [JavaScript SDK](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)</br>&bullet; [Python SDK](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)|
| ***Composed model***| &bullet; [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/custommodel/projects)</br>&bullet; [REST API](/rest/api/aiservices/operation-groups?view=rest-aiservices-2024-02-29-preview&preserve-view=true)</br>&bullet; [C# SDK](/dotnet/api/azure.ai.formrecognizer.training.formtrainingclient.startcreatecomposedmodel)</br>&bullet; [Java SDK](/java/api/com.azure.ai.formrecognizer.training.formtrainingclient.begincreatecomposedmodel)</br>&bullet; [JavaScript SDK](/javascript/api/@azure/ai-form-recognizer/documentmodeladministrationclient?view=azure-node-latest#@azure-ai-form-recognizer-documentmodeladministrationclient-begincomposemodel&preserve-view=true)</br>&bullet; [Python SDK](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer.formtrainingclient?view=azure-python#azure-ai-formrecognizer-formtrainingclient-begin-create-composed-model&preserve-view=true)|

:::moniker-end

:::moniker range="doc-intel-3.1.0"

Document Intelligence **v3.1:2023-07-31 (GA)** supports the following tools, applications, and libraries:

| Feature | Resources |
|----------|-------------|
|***Custom model***| &bullet; [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/custommodel/projects)</br>&bullet; [REST API](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP)</br>&bullet; [C# SDK](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.1.0&preserve-view=true)</br>&bullet; [Java SDK](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.1.0&preserve-view=true)</br>&bullet; [JavaScript SDK](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.1.0&preserve-view=true)</br>&bullet; [Python SDK](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.1.0&preserve-view=true)|
| ***Composed model***| &bullet; [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/custommodel/projects)</br>&bullet; [REST API](/rest/api/aiservices/document-models/compose-model?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP)</br>&bullet; [C# SDK](/dotnet/api/azure.ai.formrecognizer.training.formtrainingclient.startcreatecomposedmodel)</br>&bullet; [Java SDK](/java/api/com.azure.ai.formrecognizer.training.formtrainingclient.begincreatecomposedmodel)</br>&bullet; [JavaScript SDK](/javascript/api/@azure/ai-form-recognizer/documentmodeladministrationclient?view=azure-node-latest#@azure-ai-form-recognizer-documentmodeladministrationclient-begincomposemodel&preserve-view=true)</br>&bullet; [Python SDK](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer.formtrainingclient?view=azure-python#azure-ai-formrecognizer-formtrainingclient-begin-create-composed-model&preserve-view=true)|

:::moniker-end

::: moniker range="doc-intel-3.0.0"

Document Intelligence **v3.0:2022-08-31 (GA)** supports the following tools, applications, and libraries:

| Feature | Resources |
|----------|-------------|
|***Custom model***| &bullet; [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/custommodel/projects)</br>&bullet; [REST API](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-v3.0%20(2022-08-31)&preserve-view=true&tabs=HTTP)</br>&bullet; [C# SDK](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</br>&bullet; [Java SDK](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</br>&bullet; [JavaScript SDK](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</br>&bullet; [Python SDK](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)|
| ***Composed model***| &bullet; [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/custommodel/projects)</br>&bullet; [REST API](/rest/api/aiservices/document-models/compose-model?view=rest-aiservices-v3.0%20(2022-08-31)&preserve-view=true&tabs=HTTP)</br>&bullet; [C# SDK](/dotnet/api/azure.ai.formrecognizer.training.formtrainingclient.startcreatecomposedmodel)</br>&bullet; [Java SDK](/java/api/com.azure.ai.formrecognizer.training.formtrainingclient.begincreatecomposedmodel)</br>&bullet; [JavaScript SDK](/javascript/api/@azure/ai-form-recognizer/documentmodeladministrationclient?view=azure-node-latest#@azure-ai-form-recognizer-documentmodeladministrationclient-begincomposemodel&preserve-view=true)</br>&bullet; [Python SDK](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer.formtrainingclient?view=azure-python#azure-ai-formrecognizer-formtrainingclient-begin-create-composed-model&preserve-view=true)|
::: moniker-end

::: moniker range="doc-intel-2.1.0"

Document Intelligence v2.1 supports the following resources:

| Feature | Resources |
|----------|-------------------------|
|***Custom model***| &bullet; [Document Intelligence labeling tool](https://fott-2-1.azurewebsites.net)</br>&bullet; [REST API](how-to-guides/compose-custom-models.md?view=doc-intel-2.1.0&tabs=rest&preserve-view=true)</br>&bullet; [Client library SDK](~/articles/ai-services/document-intelligence/how-to-guides/use-sdk-rest-api.md?view=doc-intel-2.1.0&preserve-view=true)</br>&bullet; [Document Intelligence Docker container](containers/install-run.md?tabs=custom#run-the-container-with-the-docker-compose-up-command)|
| ***Composed model*** |&bullet; [Document Intelligence labeling tool](https://fott-2-1.azurewebsites.net/)</br>&bullet; [REST API](/rest/api/aiservices/analyzer?view=rest-aiservices-v2.1&preserve-view=true)</br>&bullet; [C# SDK](/dotnet/api/azure.ai.formrecognizer.training.createcomposedmodeloperation?view=azure-dotnet&preserve-view=true)</br>&bullet; [Java SDK](/java/api/com.azure.ai.formrecognizer.models.createcomposedmodeloptions?view=azure-java-stable&preserve-view=true)</br>&bullet; JavaScript SDK</br>&bullet; [Python SDK](/python/api/azure-ai-formrecognizer/azure.ai.formrecognizer.formtrainingclient?view=azure-python#azure-ai-formrecognizer-formtrainingclient-begin-create-composed-model&preserve-view=true)|
::: moniker-end

## Next steps

Learn to create and compose custom models:

> [!div class="nextstepaction"]
>
> [**Build a custom model**](how-to-guides/build-a-custom-model.md)
> [**Compose custom models**](how-to-guides/compose-custom-models.md)
