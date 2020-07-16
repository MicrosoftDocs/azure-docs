---
title: "Quickstart: Form Recognizer client library for Python"
description: In this quickstart, get started with the Form Recognizer client library for Python.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: include
ms.date: 06/15/2020
ms.author: pafarley
---

[Reference documentation](https://docs.microsoft.com/python/api/overview/azure/formrecognizer) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/formrecognizer/azure-ai-formrecognizer/azure/ai/formrecognizer) | [Package (PyPi)](https://pypi.org/project/azure-ai-formrecognizer/) | [Samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/formrecognizer/azure-ai-formrecognizer/samples)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/)
* An Azure Storage blob that contains a set of training data. See [Build a training data set for a custom model](../../build-training-data-set.md) for tips and options for putting together your training data set. For this quickstart, you can use the files under the **Train** folder of the [sample data set](https://go.microsoft.com/fwlink/?linkid=2090451).
* [Python 2.7, or 3.5 or later](https://www.python.org/)

## Setting up

### Create a Form Recognizer Azure resource

[!INCLUDE [create resource](../create-resource.md)]

### Create environment variables

[!INCLUDE [environment-variables](../environment-variables.md)]


### Create a new python application

Create a new Python application in your preferred editor or IDE. Then import the following libraries.

```python
import os
import azure.ai.formrecognizer
from azure.core.credentials import AzureKeyCredential
from azure.core.exceptions import ResourceNotFoundError
```

Create variables for your resource's Azure endpoint and key. If you created the environment variable after you launched the application, you'll need to close and reopen the editor, IDE, or shell to access the variable.

```python
endpoint = os.environ["FORM_RECOGNIZER_ENDPOINT"]
key = os.environ["FORM_RECOGNIZER_KEY"]
```

### Install the client library

After installing Python, you can install the client library with:

```console
pip install azure-ai-formrecognizer
```

<!-- 
tbd object model
-->

## Code examples

These code snippets show you how to do the following tasks with the Form Recognizer client library for Python:

* [Authenticate the client](#authenticate-the-client)
* [Recognize form content](#recognize-form-content)
* [Recognize receipts](#recognize-receipts)
* [Train a custom model](#train-a-custom-model)
* [Analyze forms with a custom model](#analyze-forms-with-a-custom-model)
* [Manage your custom models](#manage-your-custom-models)


## Authenticate the client

Here, you'll authenticate two client objects using the subscription variables you defined above. You'll use an **AzureKeyCredential** object, so that if needed, you can update the API key without creating new client objects.

```python
form_recognizer_client = FormRecognizerClient(endpoint=self.endpoint, credential=AzureKeyCredential(self.key))

form_training_client = FormTrainingClient(self.endpoint, AzureKeyCredential(self.key))
```

## Define variables

> [!NOTE]
> The code snippets in this guide use remote forms accessed by URLs. If you want to process local form documents instead, see the related methods in the [reference documentation](https://docs.microsoft.com/python/api/overview/azure/formrecognizer) and [samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/formrecognizer/azure-ai-formrecognizer/samples).

You'll also need to add references to the URLs for your training and testing data.
* To retrieve the SAS URL for your custom model training data, open the Microsoft Azure Storage Explorer, right-click your container, and select **Get shared access signature**. Make sure the **Read** and **List** permissions are checked, and click **Create**. Then copy the value in the **URL** section. It should have the form: `https://<storage account>.blob.core.windows.net/<container name>?<SAS value>`.
* To get a URL of a form to test, you can use the above steps to get the SAS URL of an individual document in blob storage. Or, take the URL of a document located elsewhere.
* Use the above method to get the URL of a receipt image as well, or use the sample image URL provided.

```python
trainingDataUrl = "<SAS-URL-of-your-form-folder-in-blob-storage>"
formUrl = "<SAS-URL-of-a-form-in-blob-storage>"
receiptUrl = "https://raw.githubusercontent.com/Azure/azure-sdk-for-python/master/sdk/formrecognizer/azure-ai-formrecognizer/tests/sample_forms/receipt/contoso-receipt.png"
```

## Recognize form content

You can use Form Recognizer to recognize tables, lines, and words in documents, without needing to train a model.

To recognize the content of a file at a given URL, use the **begin_recognize_content** method.

```Python
poller = form_recognizer_client.begin_recognize_content_from_url(formUrl)
contents = poller.result()
```

The returned value is a collection of **FormPage** objects: one for each page in the submitted document. The following code iterates through these objects and prints the extracted key/value pairs and table data.

```python
for idx, content in enumerate(contents):
    print("----Recognizing content from page #{}----".format(idx))
    print("Has width: {} and height: {}, measured with unit: {}".format(
        content.width,
        content.height,
        content.unit
    ))
    for table_idx, table in enumerate(content.tables):
        print("Table # {} has {} rows and {} columns".format(table_idx, table.row_count, table.column_count))
        for cell in table.cells:
            print("...Cell[{}][{}] has text '{}' within bounding box '{}'".format(
                cell.row_index,
                cell.column_index,
                cell.text,
                format_bounding_box(cell.bounding_box)
            ))
    for line_idx, line in enumerate(content.lines):
        print("Line # {} has word count '{}' and text '{}' within bounding box '{}'".format(
            line_idx,
            len(line.words),
            line.text,
            format_bounding_box(line.bounding_box)
        ))
    print("----------------------------------------")
```

The above code uses a helper function `format_bounding_box` to simplify the coordinates of a bounding box. Define it separately:

```python
def format_bounding_box(bounding_box):
    if not bounding_box:
        return "N/A"
    return ", ".join(["[{}, {}]".format(p.x, p.y) for p in bounding_box])
```

## Recognize receipts

This section demonstrates how to recognize and extract common fields from US receipts, using a pre-trained receipt model. To recognize receipts from a URL, use the **begin_recognize_receipts_from_url** method. 

```python
poller = form_recognizer_client.begin_recognize_receipts_from_url(receiptUrl)
receipts = poller.result()
```

The returned value is a collection of **RecognizedReceipt** objects: one for each page in the submitted document. The following block of code prints basic receipt information to the console.

```python
for idx, receipt in enumerate(receipts):
    print("--------Recognizing receipt #{}--------".format(idx))
    receipt_type = receipt.fields.get("ReceiptType")
    if receipt_type:
        print("Receipt Type: {} has confidence: {}".format(receipt_type.value, receipt_type.confidence))
    merchant_name = receipt.fields.get("MerchantName")
    if merchant_name:
        print("Merchant Name: {} has confidence: {}".format(merchant_name.value, merchant_name.confidence))
    transaction_date = receipt.fields.get("TransactionDate")
    if transaction_date:
        print("Transaction Date: {} has confidence: {}".format(transaction_date.value, transaction_date.confidence))
```

The next block of code iterates through the individual items detected on the receipt and prints their details to the console.


```python
    print("Receipt items:")
    for idx, item in enumerate(receipt.fields.get("Items").value):
        print("...Item #{}".format(idx))
        item_name = item.value.get("Name")
        if item_name:
            print("......Item Name: {} has confidence: {}".format(item_name.value, item_name.confidence))
        item_quantity = item.value.get("Quantity")
        if item_quantity:
            print("......Item Quantity: {} has confidence: {}".format(item_quantity.value, item_quantity.confidence))
        item_price = item.value.get("Price")
        if item_price:
            print("......Individual Item Price: {} has confidence: {}".format(item_price.value, item_price.confidence))
        item_total_price = item.value.get("TotalPrice")
        if item_total_price:
            print("......Total Item Price: {} has confidence: {}".format(item_total_price.value, item_total_price.confidence))
```

Finally, the last block of code prints the rest of the major receipt details.

```python
    subtotal = receipt.fields.get("Subtotal")
    if subtotal:
        print("Subtotal: {} has confidence: {}".format(subtotal.value, subtotal.confidence))
    tax = receipt.fields.get("Tax")
    if tax:
        print("Tax: {} has confidence: {}".format(tax.value, tax.confidence))
    tip = receipt.fields.get("Tip")
    if tip:
        print("Tip: {} has confidence: {}".format(tip.value, tip.confidence))
    total = receipt.fields.get("Total")
    if total:
        print("Total: {} has confidence: {}".format(total.value, total.confidence))
    print("--------------------------------------")
```


## Train a custom model

This section demonstrates how to train a model with your own data. A trained model can output structured data that includes the key/value relationships in the original form document. After you train the model, you can test and retrain it and eventually use it to reliably extract data from more forms according to your needs.

> [!NOTE]
> You can also train models with a graphical user interface such as the [Form Recognizer sample labeling tool](../../quickstarts/label-tool.md).

### Train a model without labels

Train custom models to recognize all fields and values found in your custom forms without manually labeling the training documents.

The following code uses the training client with the **begin_training** function to train a model on a given set of documents.

```python
poller = form_training_client.begin_training(self.trainingDataUrl, use_training_labels=False)
model = poller.result()
```

The returned **CustomFormSubmodel** object contains information on the form types the model can recognize and the fields it can extract from each form type. The following code block prints this information to the console.

```python
# Custom model information
print("Model ID: {}".format(model.model_id))
print("Status: {}".format(model.status))
print("Created on: {}".format(model.requested_on))
print("Last modified: {}".format(model.completed_on))

print("Recognized fields:")
# Looping through the submodels, which contains the fields they were trained on
for submodel in model.submodels:
    print("...The submodel has form type '{}'".format(submodel.form_type))
    for name, field in submodel.fields.items():
        print("...The model found field '{}' to have label '{}'".format(
            name, field.label
        ))
```

### Train a model with labels

You can also train custom models by manually labeling the training documents. Training with labels leads to better performance in some scenarios. 

> [!IMPORTANT]
> To train with labels, you need to have special label information files (*\<filename\>.pdf.labels.json*) in your blob storage container alongside the training documents. The [Form Recognizer sample labeling tool](../../quickstarts/label-tool.md) provides a UI to help you create these label files. Once you have them, you can call the **begin_training** function with the *use_training_labels* parameter set to `true`.

```python
poller = form_training_client.begin_training(self.trainingDataUrl, use_training_labels=True)
model = poller.result()
```

The returned **CustomFormSubmodel** indicates the fields the model can extract, along with its estimated accuracy in each field. The following code block prints this information to the console.

```python
# Custom model information
print("Model ID: {}".format(model.model_id))
print("Status: {}".format(model.status))
print("Created on: {}".format(model.created_on))
print("Last modified: {}".format(model.last_modified))

print("Recognized fields:")
# looping through the submodels, which contains the fields they were trained on
# The labels are based on the ones you gave the training document.
for submodel in model.submodels:
    print("...The submodel with form type {} has accuracy '{}'".format(submodel.form_type, submodel.accuracy))
    for name, field in submodel.fields.items():
        print("...The model found field '{}' to have name '{}' with an accuracy of {}".format(
            name, field.name, field.accuracy
        ))
```

## Analyze forms with a custom model

This section demonstrates how to extract key/value information and other content from your custom form types, using models you trained with your own forms.

> [!IMPORTANT]
> In order to implement this scenario, you must have already trained a model so you can pass its ID into the method below. See the [Train a model](#train-a-model-without-labels) section.

You'll use the **begin_recognize_custom_forms_from_url** method. The returned value is a collection of **RecognizedForm** objects: one for each page in the submitted document.

```python
# Make sure your form's type is included in the list of form types the custom model can recognize
poller = form_recognizer_client.begin_recognize_custom_forms_from_url(
    model_id=model.model_id, form_url=formUrl)
forms = poller.result()
```

The following code prints the analysis results to the console. It prints each recognized field and corresponding value, along with a confidence score.

```python
for idx, form in enumerate(forms):
    print("--------Recognizing Form #{}--------".format(idx))
    print("Form {} has type {}".format(idx, form.form_type))
    for name, field in form.fields.items():
        # each field is of type FormField
        # The value of the field can also be a FormField, or a list of FormFields
        # In our sample, it is just a FormField.
        print("...Field '{}' has value '{}' with a confidence score of {}".format(
            name, field.value, field.confidence
        ))
        # label data is populated if you are using a model trained with unlabeled data, since the service needs to make predictions for
        # labels if not explicitly given to it.
        if field.label_data:
            print("...Field '{}' has label '{}' with a confidence score of {}".format(
                name,
                field.label_data.text,
                field.confidence
            ))
    print("-----------------------------------")
```

## Manage your custom models

This section demonstrates how to manage the custom models stored in your account. 

### Check the number of models in the FormRecognizer resource account

The following code block checks how many models you have saved in your Form Recognizer account and compares it to the account limit.

```python
# First, we see how many custom models we have, and what our limit is
account_properties = form_training_client.get_account_properties()
print("Our account has {} custom models, and we can have at most {} custom models".format(
    account_properties.custom_model_count, account_properties.custom_model_limit
))
```

### List the models currently stored in the resource account

The following code block lists the current models in your account and prints their details to the console. It also saves a reference to the first model.

```python
# Next, we get a paged list of all of our custom models
custom_models = form_training_client.list_custom_models()

print("We have models with the following ids:")

# Let's pull out the first model
first_model = next(custom_models)
print(first_model.model_id)
for model in custom_models:
    print(model.model_id)
```

### Get a specific model using the model's ID

The following code block uses the model ID saved from the previous section and uses it to retrieve details about the model.

```python
# Now we'll get the first custom model in the paged list
custom_model = form_training_client.get_custom_model(model_id=first_model.model_id)
print("Model ID: {}".format(custom_model.model_id))
print("Status: {}".format(custom_model.status))
print("Created on: {}".format(custom_model.requested_on))
print("Last modified: {}".format(custom_model.completed_on))
```

### Delete a model from the resource account

You can also delete a model from your account by referencing its ID. This code deletes the model used in the previous section.

```python
form_training_client.delete_model(model_id=custom_model.model_id)

# Confirm deletion:
try:
    form_training_client.get_custom_model(model_id=custom_model.model_id)
except ResourceNotFoundError:
    print("Successfully deleted model with id {}".format(custom_model.model_id))
}
```

## Run the application

Run the application with the `python` command on your quickstart file.

```console
python quickstart-file.py
```

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Troubleshooting

### General

The Form Recognizer client library will raise exceptions defined in [Azure Core](https://aka.ms/azsdk-python-azure-core).

## Logging

This library uses the [standard logging library](https://docs.python.org/3/library/logging.html) for logging. Basic information about HTTP sessions (URLs, headers, and so on) is logged at the INFO level.

Detailed DEBUG level logging, including request/response bodies and unredacted headers, can be enabled on a client with the `logging_enable` keyword argument:

```python
import sys
import logging
from azure.ai.formrecognizer import FormRecognizerClient
from azure.core.credentials import AzureKeyCredential

# Create a logger for the 'azure' SDK
logger = logging.getLogger('azure')
logger.setLevel(logging.DEBUG)

# Configure a console output
handler = logging.StreamHandler(stream=sys.stdout)
logger.addHandler(handler)

endpoint = "https://<my-custom-subdomain>.cognitiveservices.azure.com/"
credential = AzureKeyCredential("<api_key>")

# This client will log detailed information about its HTTP sessions, at DEBUG level
form_recognizer_client = FormRecognizerClient(endpoint, credential, logging_enable=True)
```

Similarly, `logging_enable` can enable detailed logging for a single operation, even when it isn't enabled for the client:

```python
poller = form_recognizer_client.begin_recognize_receipts(receipt, logging_enable=True)
```

## Next steps

In this quickstart, you used the Form Recognizer Python client library to train models and analyze forms in different ways. Next, learn tips to create a better training data set and produce more accurate models.

> [!div class="nextstepaction"]
> [Build a training data set](../../build-training-data-set.md)

* [What is Form Recognizer?](../../overview.md)
* The sample code from this guide (and more) can be found on [GitHub](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/formrecognizer/azure-ai-formrecognizer/samples).
