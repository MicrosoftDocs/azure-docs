---
title: "Quickstart: Translator Text Python SDK"
description: 'Text translation processing using the Python programming language'
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: include
ms.date: 07/18/2023
ms.author: lajanuar
recommendations: false
---

<!-- markdownlint-disable MD036 -->

## Set up your Python project

1. If you haven't done so already, install the latest version of [Python 3.x](https://www.python.org/downloads/). The Python installer package (pip) is included with the Python installation.

    > [!TIP]
    > If you're new to Python, try the [Introduction to Python](/training/paths/beginner-python/) Learn module.

1. Open a terminal window and install the `Azure Text Translation` client library for Python with `pip`:

    ```console
    pip install azure-ai-translation-text==1.0.0b1
    ```

## Build your application

To interact with the Translator service using the client library, you need to create an instance of the `TextTranslationClient`class. To do so, create a `TranslatorCredential` with your `key` from the Azure portal and a `TextTranslationClient` instance. For more information, _see_ [Translator text sdks](../../text-sdk-overview.md#3-authenticate-the-client).

1. Create a new Python file called **text-translation-app.py** in your preferred editor or IDE.

1. Copy and paste the following text translation code sample code-sample into the **text-translation-app.py** file.  Update **`<your-key>`**, **`<your-endpoint>`**, and **`<region>`** with values from your Azure portal Translator instance.

## Code sample

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../key-vault/general/overview.md). For more information, *see* Azure AI services [security](../../../../ai-services/security-features.md).

**Translate text**

```python
from azure.ai.translation.text import TextTranslationClient, TranslatorCredential
from azure.ai.translation.text.models import InputTextItem
from azure.core.exceptions import HttpResponseError

# set `<your-key>`, `<your-endpoint>`, and  `<region>` variables with the values from the Azure portal
key = "<your-key>"
endpoint = "<your-endpoint>"
region = "<region>"

credential = TranslatorCredential(key, region)
text_translator = TextTranslationClient(endpoint=endpoint, credential=credential)

try:
    source_language = "en"
    target_languages = ["es", "it"]
    input_text_elements = [ InputTextItem(text = "This is a test") ]

    response = text_translator.translate(content = input_text_elements, to = target_languages, from_parameter = source_language)
    translation = response[0] if response else None

    if translation:
        for translated_text in translation.translations:
            print(f"Text was translated to: '{translated_text.to}' and the result is: '{translated_text.text}'.")

except HttpResponseError as exception:
    print(f"Error Code: {exception.error.code}")
    print(f"Message: {exception.error.message}")

```

## Run the application

Once you've added the code sample to your application, build and run your program:

Navigate to the folder where you have your **text-translation-app.py** file.

Type the following command in your terminal:

  ```console
  python text-translation-app.py

  ```

Here's a snippet of the expected output:

:::image type="content" source="../../media/quickstarts/python-output.png" alt-text="Screenshot of JavaScript output in the terminal window.":::
