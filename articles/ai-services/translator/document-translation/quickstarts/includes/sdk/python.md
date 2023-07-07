---
title: "Quickstart: Document Translation Python SDK"
description: 'Document Translation processing using the Python SDK'
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: include
ms.date: 07/18/2023
ms.author: lajanuar
recommendations: false
---

<!-- markdownlint-disable MD051 -->

### Set up your project

If you haven't done so, install the latest version of [Python](https://www.python.org/downloads/).

### Install the client library

Install the latest version of the Document Translation client library:

```console
pip install azure-ai-translation-document==1.0.0
```

### Translate a document or batch files

1. For this project, you need a **source document** uploaded to your **source container**. You can download our [document translation sample document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/Translator/document-translation-sample.pdf) for this quickstart. The source language is English.

1. In your Python application file, create variables for your resource key and custom endpoint. For more information, *see* [Retrieve your key and custom domain endpoint](../../../quickstarts/document-translation-rest-api.md#retrieve-your-key-and-document-translation-endpoint).

  ```python
  key = "<your-key>"
  endpoint = "<your-custom-endpoint>"
  
  ```

1. Initialize a `DocumentTranslationClient` object that contains your `endpoint` and `key` parameters.

1. Call the `begin_translation` method and pass in the `sourceUri`, `targetUri`, and `targetLanguageCode` parameters.

    * For [**Managed Identity authorization**](../../../how-to-guides/create-use-managed-identities.md) create these variables:

      * **sourceUri**. The URL for the source container containing documents to be translated.
      * **targetUri** The URL for the target container to which the translated documents are written.
      * **targetLanguageCode**. The language code for the translated documents. You can find language codes on our [Language support](../../../../language-support.md) page.

        To find your source and target URLs, navigate to your storage account in the Azure portal. In the left sidebar, under  **Data storage** , select **Containers** and follow these steps to retrieve your source document(s) and target container URLS.

          |Source|Target|
          |------|-------|
          |1. Select the checkbox next to the source container|1. Select the checkbox next to the target container.|
          | 2. From the main window area, select a file or document(s) for translation.| 2. Select the ellipses located at the right, then choose **Properties**.|
          | 3. The source URL is located at the top of the Properties list.|3. The target URL is located at the top of the Properties list.|

    * For [**Shared Access Signature (SAS) authorization**](../../../how-to-guides/create-sas-tokens.md) create these variables

      * **sourceUri**. The SAS URI, with a SAS token appended as a query string, for the source container containing documents to be translated.
      * **targetUri** The SAS URI, with a SAS token appended as a query string,for the target container to which the translated documents are written.
      * **targetLanguageCode**. The language code for the translated documents. You can find language codes on our [Language support](../../../../language-support.md) page.

### Code Sample

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../../../key-vault/general/overview.md). For more information, *see* Azure AI services [security](../../../../../../ai-services/security-features.md).

**Enter the following code sample into your Python application:**

```python

#  import libraries
from azure.core.credentials import AzureKeyCredential
from azure.ai.translation.document import DocumentTranslationClient

# create variables for your resource key, custom endpoint, sourceUrl, targetUrl, and targetLanguage
key = "<your-key>"
endpoint = "<your-custom-endpoint>"
sourceUri = "<your-container-sourceUrl>"
targetUri = "<your-container-targetUrl>"
targetLanguage = "<target-language-code>"


# initialize a new instance of the DocumentTranslationClient object to interact with the Document Translation feature
client = DocumentTranslationClient(endpoint, AzureKeyCredential(key))

# include source and target locations and target language code for the begin translation operation
poller = client.begin_translation(sourceUri, targetUri, targetLanguage)
result = poller.result()

print("Status: {}".format(poller.status()))
print("Created on: {}".format(poller.details.created_on))
print("Last updated on: {}".format(poller.details.last_updated_on))
print(
    "Total number of translations on documents: {}".format(
        poller.details.documents_total_count
    )
)

print("\nOf total documents...")
print("{} failed".format(poller.details.documents_failed_count))
print("{} succeeded".format(poller.details.documents_succeeded_count))

for document in result:
    print("Document ID: {}".format(document.id))
    print("Document status: {}".format(document.status))
    if document.status == "Succeeded":
        print("Source document location: {}".format(document.source_document_url))
        print(
            "Translated document location: {}".format(document.translated_document_url)
        )
        print("Translated to language: {}\n".format(document.translated_to))
    else:
        print(
            "Error Code: {}, Message: {}\n".format(
                document.error.code, document.error.message
            )
        )
```

## Run your application

Once you've added the code sample to your application type the following command in your terminal:

  ```python
  python document-translation-sdk.py
  ```

Here's a snippet of the expected output:

  :::image type="content" source="../../../../media/quickstarts/python-output-document.png" alt-text="Screenshot of the Python output in the terminal window. ":::

That's it! You've created a program to translate documents in a storage container using the Python client library.
