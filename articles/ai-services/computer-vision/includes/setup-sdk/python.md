---
author: PatrickFarley
ms.service: azure-ai-vision
ms.topic: include
ms.date: 08/01/2023
ms.author: pafarley
---

[Reference documentation](https://aka.ms/azsdk/image-analysis/ref-docs/python) | [Package (PyPi)](https://aka.ms/azsdk/image-analysis/package/pypi) | [Samples](https://aka.ms/azsdk/image-analysis/samples/python)

This guide shows how to install the Vision SDK for Python.

## Platform requirements

[!INCLUDE [Requirements](python-requirements.md)]

## Install the Vision SDK for Python

Before you install the Vision SDK for Python, make sure to satisfy the [platform requirements](#platform-requirements).

**Choose your tool or IDE**

# [Terminal](#tab/terminal)

### Install from terminal

To install the Vision SDK for Python, run this command in a terminal.

```console
python -m pip install azure-ai-vision-imageanalysis
```

### Upgrade to the latest Vision SDK

To upgrade to the latest Vision SDK, run this command in a terminal:

```console
python -m pip install --upgrade azure-ai-vision-imageanalysis
```

You can check which Vision SDK for Python version is currently installed by running this command in a terminal:

```console
pip list
```

# [VS Code](#tab/vscode)

### Install the Vision SDK by using Visual Studio Code

To install the Vision SDK for Python:

1. Download and install [Visual Studio Code](https://code.visualstudio.com/Download).
1. Run Visual Studio Code and install the Python extension:

   1. Select **File** > **Preferences** > **Extensions**. 
   1. Search for **Python**, find the **Python extension for Visual Studio Code** published by Microsoft, and then select **Install**.

   ![Screenshot that shows selections for installing the Python extension.](~/articles/ai-services/speech-service/media/sdk/qs-python-vscode-python-extension.png)

1. Select **Terminal** > **New Terminal** to open a terminal within Visual Studio Code. 
1. At the terminal prompt, run the following command to install the Vision SDK for Python package. 
    ```console
    python -m pip install azure-ai-vision-imageanalysis
    ```

1. To upgrade to the latest Vision SDK, run this command in a terminal:
    ```console
    python -m pip install --upgrade azure-ai-vision-imageanalysis
    ```

1. You can check which Vision SDK for Python version is currently installed by running this command:
    ```console
    pip list
    ```

For more information about Visual Studio Code and Python, see the [Visual Studio Code documentation](https://code.visualstudio.com/docs) and the [Visual Studio Code Python tutorial](https://code.visualstudio.com/docs/python/python-tutorial).

---

