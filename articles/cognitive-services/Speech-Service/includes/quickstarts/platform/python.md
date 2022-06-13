---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 06/10/2022
ms.author: eur
---

This guide shows how to install the [Speech SDK](~/articles/cognitive-services/speech-service/speech-sdk.md) for Python. 

### System requirements

Before you do anything, see the [platform requirements and instructions](~/articles/cognitive-services/speech-service/speech-sdk.md#platform-requirements).

## Supported operating systems

The Speech SDK for Python package is available for these operating systems:
- Windows: x64 and x86.
- Mac: macOS X version 10.14 or later. 
- Linux: See the list of [supported Linux distributions and target architectures](~/articles/cognitive-services/speech-service/speech-sdk.md).

## Prerequisites

Before you install the Speech SDK for Python, make sure you have the following prerequisites:

- On Windows, you must install the [Microsoft Visual C++ Redistributable for Visual Studio 2015, 2017, 2019, or 2022](/cpp/windows/latest-supported-vc-redist?view=msvc-170&preserve-view=true) for your platform. Installing this package for the first time might require a restart.

- On Linux, see the [system requirements and setup instructions](~/articles/cognitive-services/speech-service/speech-sdk.md#platform-requirements).

- Install a version of [Python from 3.7 to 3.10](https://www.python.org/downloads/). The minimum Python version on macOS is 3.7. Select **Add Python to your PATH** during the installation process on Windows. To check your installation, open a terminal and run the command `python --version`. If it's installed properly, you'll get a response like "Python 3.8.8".

> [!IMPORTANT]
> Make sure that packages of the same platform (x64 or x86) are installed. For example, if you install the x64 redistributable package, then you need to install the x64 package for Python. 

## Install the Speech SDK from PyPI

To install the Speech SDK for Python, run this command in a terminal.

```console
pip install azure-cognitiveservices-speech
```

> [!NOTE]>
> If you're on macOS and run into install issues, you may need to run the `python3 -m pip install --upgrade pip` command first.

To upgrade to the latest Speech SDK, run this command in a terminal:

```console
pip install --upgrade azure-cognitiveservices-speech
```

You can check which Speech SDK for Python version is currently installed by inspecting the `azure.cognitiveservices.speech.__version__` variable. For example, run this command in a terminal:

```console
pip list
```

## Install the Speech SDK by using Visual Studio Code

Before you install the Speech SDK for Python, make sure to satisfy the [system requirements](#system-requirements) and [prerequisites](#prerequisites). 

To install the Speech SDK for Python:

1. Download and install [Visual Studio Code](https://code.visualstudio.com/Download).
1. Run Visual Studio Code and install the Python extension:

   1. Select **File** > **Preferences** > **Extensions**. 
   1. Search for **Python**, find the **Python extension for Visual Studio Code** published by Microsoft, and then select **Install**.

   ![Screenshot that shows selections for installing the Python extension.](~/articles/cognitive-services/speech-service/media/sdk/qs-python-vscode-python-extension.png)

1. Select **Terminal** > **New Terminal** to open a terminal within Visual Studio Code. 
1. At the terminal prompt, run the command `python -m pip install azure-cognitiveservices-speech` to install the Speech SDK Python package. 

For more information about Visual Studio Code and Python, see the [Visual Studio Code documentation](https://code.visualstudio.com/docs) and the [Visual Studio Code Python tutorial](https://code.visualstudio.com/docs/python/python-tutorial).

## Import and use the SDK

Add the following import statement to use the Speech SDK in your Python project:

```Python
import azure.cognitiveservices.speech as speechsdk
```
