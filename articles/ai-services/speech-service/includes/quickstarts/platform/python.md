---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 09/05/2023
ms.author: eur
---

[!INCLUDE [Header](../../common/python.md)]

This guide shows how to install the [Speech SDK](~/articles/ai-services/speech-service/speech-sdk.md) for Python.

## Platform requirements

[!INCLUDE [Requirements](python-requirements.md)]

## Install the Speech SDK for Python

Before you install the Speech SDK for Python, make sure to satisfy the [platform requirements](#platform-requirements).

# [PyPI](#tab/pypi)

### Install from PyPI

To install the Speech SDK for Python, run this command in a console window:

```console
pip install azure-cognitiveservices-speech
```

### Upgrade to the latest Speech SDK

To upgrade to the latest Speech SDK, run this command in console window:

```console
pip install --upgrade azure-cognitiveservices-speech
```

You can check which Speech SDK for Python version is currently installed by inspecting the `azure.cognitiveservices.speech.__version__` variable. For example, run this command in a console window:

```console
pip list
```

# [VS Code](#tab/vscode)

### Install the Speech SDK by using Visual Studio Code

To install the Speech SDK for Python:

1. Download and install [Visual Studio Code](https://code.visualstudio.com/Download).
1. Run Visual Studio Code and install the Python extension:

   1. Select **File** > **Preferences** > **Extensions**.
   1. Search for **Python**, find the **Python extension for Visual Studio Code** published by Microsoft, and then select **Install**.

   :::image type="content" source="~/articles/ai-services/speech-service/media/sdk/qs-python-vscode-python-extension.png" alt-text="Screenshot that shows selections for installing the Python extension." lightbox="~/articles/ai-services/speech-service/media/sdk/qs-python-vscode-python-extension.png":::

1. Select **Terminal** > **New Terminal** to open a terminal within Visual Studio Code.
1. At the terminal prompt, run the following command to install the Speech SDK for Python package.

    ```console
    python -m pip install azure-cognitiveservices-speech
    ```

For more information about Visual Studio Code and Python, see [Visual Studio Code](https://code.visualstudio.com/docs) and [Getting Started with Python in VS Code](https://code.visualstudio.com/docs/python/python-tutorial).

---

## Use the Speech SDK

Add the following import statement to use the Speech SDK in your Python project:

```python
import azure.cognitiveservices.speech as speechsdk
```
